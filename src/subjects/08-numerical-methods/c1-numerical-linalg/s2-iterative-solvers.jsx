import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Simulate CG residual convergence for different condition numbers
function runCG(kappa, n = 10) {
  // For a diagonal system with eigenvalues spread between 1 and kappa
  // CG residuals ||r_k||/||r_0|| ≈ 2((sqrt(kappa)-1)/(sqrt(kappa)+1))^k
  const residuals = [];
  for (let k = 0; k <= n; k++) {
    const ratio = (Math.sqrt(kappa) - 1) / (Math.sqrt(kappa) + 1);
    residuals.push(2 * Math.pow(ratio, k));
  }
  return residuals;
}

function InteractiveCGResidual() {
  const [kappa, setKappa] = useState(10);
  const [showPrecond, setShowPrecond] = useState(false);
  const kappaP = showPrecond ? Math.max(1.1, kappa / 5) : kappa;

  const nIters = 25;
  const residNoCG = runCG(kappa, nIters);
  const residCG = residNoCG; // same formula — CG itself
  const residPrecond = runCG(kappaP, nIters);

  const W = 400, H = 240, PAD = 45;
  const iterMin = 0, iterMax = nIters;
  const logMin = -16, logMax = 1;

  function toSvg(iter, logR) {
    const clamped = Math.max(logMin, Math.min(logMax, logR));
    return {
      sx: PAD + (iter / iterMax) * (W - 2 * PAD),
      sy: H - PAD - ((clamped - logMin) / (logMax - logMin)) * (H - 2 * PAD),
    };
  }

  function makePath(resids) {
    return resids.map((r, i) => {
      const logR = Math.log10(Math.max(r, 1e-16));
      const { sx, sy } = toSvg(i, logR);
      return `${sx},${sy}`;
    }).join(' ');
  }

  const cgPath = makePath(residCG);
  const precondPath = showPrecond ? makePath(residPrecond) : null;

  // Y-axis tick labels
  const yTicks = [-15, -10, -5, 0];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: CG Residual Convergence</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Conjugate gradient convergence rate depends on the condition number <InlineMath math="\kappa" />.
        Preconditioning reduces the effective <InlineMath math="\kappa" />.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {yTicks.map(tick => {
            const { sy } = toSvg(0, tick);
            return (
              <React.Fragment key={tick}>
                <line x1={PAD - 4} y1={sy} x2={PAD} y2={sy} stroke="#9ca3af" strokeWidth="1" />
                <text x={PAD - 6} y={sy + 4} textAnchor="end" fontSize="9" fill="#6b7280">10^{tick}</text>
              </React.Fragment>
            );
          })}
          {/* CG without preconditioner */}
          <polyline points={cgPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          {/* CG with preconditioner */}
          {precondPath && <polyline points={precondPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,3" />}
          {/* Legend */}
          <rect x={W - PAD - 140} y={PAD} width="136" height={showPrecond ? 52 : 28} fill="white" fillOpacity="0.9" rx="4" />
          <line x1={W - PAD - 132} y1={PAD + 12} x2={W - PAD - 110} y2={PAD + 12} stroke="#3b82f6" strokeWidth="2.5" />
          <text x={W - PAD - 106} y={PAD + 16} fontSize="10" fill="#374151">CG (κ={kappa})</text>
          {showPrecond && (
            <>
              <line x1={W - PAD - 132} y1={PAD + 30} x2={W - PAD - 110} y2={PAD + 30} stroke="#10b981" strokeWidth="2" strokeDasharray="5,3" />
              <text x={W - PAD - 106} y={PAD + 34} fontSize="10" fill="#374151">PCG (κ̃≈{kappaP.toFixed(0)})</text>
            </>
          )}
          <text x={PAD + 4} y={H - PAD - 4} fontSize="10" fill="#374151">iteration →</text>
          <text x={6} y={PAD + 14} fontSize="9" fill="#6b7280" transform={`rotate(-90,10,${(H / 2)})`}>log₁₀ residual</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Condition number <InlineMath math={`\\kappa = ${kappa}`} />
            </label>
            <input type="range" min="2" max="1000" step="1" value={kappa} onChange={e => setKappa(+e.target.value)} className="w-full" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showPrecond} onChange={e => setShowPrecond(e.target.checked)} />
            Show preconditioned CG (κ̃ ≈ κ/5)
          </label>
          <div className="rounded bg-blue-50 dark:bg-blue-900/30 px-3 py-2 text-xs">
            <p>CG converges in at most <strong>n</strong> steps (exact)</p>
            <p>Rate: <InlineMath math="\left(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\right)^k" /></p>
            <p className="mt-1">Steps to 1e-6: ~{Math.ceil(-6 / Math.log10(Math.max(0.001, (Math.sqrt(kappa) - 1) / (Math.sqrt(kappa) + 1))))} iters</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IterativeSolvers() {
  return (
    <div className="space-y-8">
      <InteractiveCGResidual />

      <DefinitionBlock title="Krylov Subspace Methods">
        <p>
          Iterative solvers for <InlineMath math="Ax = b" /> search for the solution in a
          <strong> Krylov subspace</strong> of increasing dimension:
        </p>
        <BlockMath math="\mathcal{K}_k(A, r_0) = \operatorname{span}\{r_0, Ar_0, A^2 r_0, \ldots, A^{k-1} r_0\}," />
        <p className="mt-2">
          where <InlineMath math="r_0 = b - Ax_0" /> is the initial residual. At each step, only
          one matrix-vector product <InlineMath math="Av" /> is needed, costing <InlineMath math="O(\text{nnz})" />
          for sparse <InlineMath math="A" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Conjugate Gradient Method">
        <p>
          For symmetric positive definite <InlineMath math="A \succ 0" />, the
          <strong> Conjugate Gradient (CG)</strong> method iterates:
        </p>
        <BlockMath math="\begin{aligned} \alpha_k &= \frac{r_k^\top r_k}{p_k^\top A p_k} \\ x_{k+1} &= x_k + \alpha_k p_k \\ r_{k+1} &= r_k - \alpha_k A p_k \\ \beta_k &= \frac{r_{k+1}^\top r_{k+1}}{r_k^\top r_k}, \quad p_{k+1} = r_{k+1} + \beta_k p_k. \end{aligned}" />
        <p className="mt-2">
          CG is optimal: it minimizes <InlineMath math="\|e_k\|_A = \|x^* - x_k\|_A" /> over
          <InlineMath math="\mathcal{K}_k(A, r_0)" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="GMRES for Non-Symmetric Systems">
        <p>
          <strong>GMRES</strong> (Generalized Minimum RESidual) handles non-symmetric <InlineMath math="A" />.
          At step <InlineMath math="k" />, it solves:
        </p>
        <BlockMath math="x_k = \underset{x \in x_0 + \mathcal{K}_k(A,r_0)}{\arg\min} \|b - Ax\|_2." />
        <p className="mt-2">
          Using the Arnoldi process to build an orthonormal basis for <InlineMath math="\mathcal{K}_k" />,
          GMRES reduces to solving a small <InlineMath math="(k+1) \times k" /> least-squares problem.
          Restarted GMRES(m) limits memory to <InlineMath math="m" /> vectors.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="CG Convergence Rate"
        proof="CG minimizes the A-norm error over the Krylov space. The optimal polynomial is the Chebyshev polynomial scaled to the spectrum [λ_min, λ_max]. The ratio ||e_k||_A / ||e_0||_A ≤ 2·((√κ-1)/(√κ+1))^k follows from the min-max characterization and properties of Chebyshev polynomials on the interval [λ_min, λ_max]."
      >
        <p>
          The CG error in the <InlineMath math="A" />-norm satisfies:
        </p>
        <BlockMath math="\frac{\|e_k\|_A}{\|e_0\|_A} \leq 2\left(\frac{\sqrt{\kappa(A)} - 1}{\sqrt{\kappa(A)} + 1}\right)^k," />
        <p className="mt-2">
          where <InlineMath math="\kappa(A) = \lambda_{\max}/\lambda_{\min}" /> is the spectral condition
          number. CG terminates in at most <InlineMath math="n" /> steps (exact arithmetic).
          The convergence depends on the <em>eigenvalue distribution</em>, not just <InlineMath math="\kappa" />.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Preconditioning"
        proof="A preconditioner M ≈ A allows solving M⁻¹Ax = M⁻¹b or A M⁻¹y = b (y = Mx) with better condition number. Common choices: incomplete Cholesky (IC), incomplete LU (ILU), multigrid, or domain decomposition. The preconditioned system has condition number κ(M⁻¹A) << κ(A)."
      >
        <p>
          A <strong>preconditioner</strong> <InlineMath math="M \approx A" /> transforms the system
          to improve conditioning. Preconditioned CG solves:
        </p>
        <BlockMath math="\tilde{A} \tilde{x} = \tilde{b}, \quad \tilde{A} = M^{-1/2} A M^{-1/2}," />
        <p className="mt-2">
          with condition number <InlineMath math="\kappa(M^{-1/2}AM^{-1/2}) \ll \kappa(A)" /> when
          <InlineMath math="M^{-1} \approx A^{-1}" />. In practice, PCG uses the symmetric
          form avoiding explicit <InlineMath math="M^{1/2}" />.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Iterative Solvers in Machine Learning">
        <p>Iterative solvers appear throughout ML:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Gaussian processes</strong>: solve <InlineMath math="(K + \sigma^2 I)^{-1}y" /> using CG to avoid Cholesky decomposition.</li>
          <li><strong>Newton's method</strong>: solve the linear system <InlineMath math="\nabla^2 f \cdot d = -\nabla f" /> using CG (truncated Newton).</li>
          <li><strong>L-BFGS</strong>: implicitly represents the Hessian inverse via a Krylov-like two-loop recursion.</li>
          <li><strong>Power iteration</strong>: computes leading eigenvectors, used in PCA, spectral methods, and PageRank.</li>
        </ul>
      </ExampleBlock>

      <WarningBlock title="CG Requires SPD Matrices; Use GMRES or MINRES Otherwise">
        <p>
          CG is only valid for symmetric positive definite <InlineMath math="A" />. For
          symmetric indefinite systems (e.g., saddle-point problems), use <strong>MINRES</strong>.
          For non-symmetric systems (e.g., non-symmetric PDEs, Newton systems with non-symmetric
          Jacobian), use <strong>GMRES</strong> or <strong>BiCGSTAB</strong>. Applying CG to
          a non-SPD system can produce nonsensical results or break down entirely.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np
from scipy.sparse.linalg import cg, gmres, LinearOperator

def conjugate_gradient(A, b, x0=None, tol=1e-10, maxiter=None):
    """CG implementation for SPD A."""
    n = len(b)
    x = np.zeros(n) if x0 is None else x0.copy()
    r = b - A @ x
    p = r.copy()
    rs_old = r @ r
    residuals = [np.sqrt(rs_old)]
    maxiter = maxiter or 2 * n

    for _ in range(maxiter):
        Ap = A @ p
        alpha = rs_old / (p @ Ap)
        x = x + alpha * p
        r = r - alpha * Ap
        rs_new = r @ r
        residuals.append(np.sqrt(rs_new))
        if np.sqrt(rs_new) < tol:
            break
        p = r + (rs_new / rs_old) * p
        rs_old = rs_new

    return x, residuals

# Solve a well-conditioned vs ill-conditioned system
rng = np.random.default_rng(42)
n = 50

for kappa_target in [5, 50, 500]:
    # Build SPD matrix with eigenvalues in [1, kappa_target]
    eigvals = np.linspace(1, kappa_target, n)
    Q, _ = np.linalg.qr(rng.standard_normal((n, n)))
    A = Q @ np.diag(eigvals) @ Q.T
    b = rng.standard_normal(n)

    x_exact = np.linalg.solve(A, b)
    x_cg, residuals = conjugate_gradient(A, b, tol=1e-10, maxiter=200)

    error = np.linalg.norm(x_cg - x_exact)
    print(f"κ={kappa_target:>4}: {len(residuals)-1:>4} iters, "
          f"||x_CG - x_exact|| = {error:.2e}, "
          f"residual = {residuals[-1]:.2e}")
`} />
    </div>
  );
}
