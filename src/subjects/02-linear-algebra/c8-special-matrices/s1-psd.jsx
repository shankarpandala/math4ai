import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Eigenvalue sign explorer: PD / PSD / indefinite
// ---------------------------------------------------------------------------
function PSDExplorer() {
  const [a, setA] = useState(2.5);
  const [b, setB] = useState(0.5);
  const [d, setD] = useState(1.5);
  // Symmetric matrix: [[a, b], [b, d]]

  const tr = a + d;
  const det = a * d - b * b;
  const disc = tr * tr - 4 * det;
  let lam1, lam2;
  if (disc >= 0) {
    lam1 = (tr + Math.sqrt(disc)) / 2;
    lam2 = (tr - Math.sqrt(disc)) / 2;
  } else {
    lam1 = lam2 = null;
  }

  function classify() {
    if (lam1 === null) return { label: 'Complex eigenvalues', color: 'gray', bg: '#f3f4f6' };
    if (lam1 > 1e-9 && lam2 > 1e-9) return { label: 'Positive Definite (PD)', color: '#059669', bg: '#d1fae5' };
    if (lam1 >= -1e-9 && lam2 >= -1e-9) return { label: 'Positive Semidefinite (PSD)', color: '#d97706', bg: '#fef3c7' };
    if (lam1 <= 1e-9 && lam2 <= 1e-9) return { label: 'Negative Semidefinite (NSD)', color: '#9333ea', bg: '#f3e8ff' };
    return { label: 'Indefinite', color: '#ef4444', bg: '#fee2e2' };
  }

  const cls = classify();

  // Draw quadratic form contours: x^T A x = c for various c
  const W = 320, H = 260;
  const cx = W / 2, cy = H / 2;
  const pxPerUnit = 55;

  function toSvg(x, y) { return [cx + x * pxPerUnit, cy - y * pxPerUnit]; }

  // Sample grid for quadratic form
  const gridRes = 80;
  const range = 2.5;
  let positiveCells = [], negativeCells = [];
  for (let i = 0; i <= gridRes; i++) {
    for (let j = 0; j <= gridRes; j++) {
      const x = -range + (2 * range * i) / gridRes;
      const y = -range + (2 * range * j) / gridRes;
      const val = a * x * x + 2 * b * x * y + d * y * y;
      const [sx, sy] = toSvg(x, y);
      const cellW = (2 * range * pxPerUnit) / gridRes;
      if (val > 0.3 && val < 1.0) positiveCells.push({ sx, sy, cellW, v: val });
      if (val < -0.3 && val > -1.0) negativeCells.push({ sx, sy, cellW, v: val });
    }
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Eigenvalue Sign Explorer — PD/PSD/Indefinite Classification
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust the 2×2 symmetric matrix entries. The quadratic form <InlineMath math="x^\top A x" /> contours (yellow band ≈ level 0.65) show the definiteness. Classification updates in real time.
      </p>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'a', val: a, set: setA },
          { label: 'b', val: b, set: setB },
          { label: 'd', val: d, set: setD },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">{label}</span>
              <span>{val.toFixed(2)}</span>
            </div>
            <input type="range" min={-3} max={4} step={0.1} value={val}
              onChange={(e) => set(parseFloat(e.target.value))}
              className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div className="rounded-lg px-4 py-2 text-sm font-bold border-2"
          style={{ background: cls.bg, borderColor: cls.color, color: cls.color }}>
          {cls.label}
        </div>
        {lam1 !== null && (
          <>
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-mono dark:bg-gray-800">
              λ₁ = {lam1.toFixed(3)}
            </div>
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-mono dark:bg-gray-800">
              λ₂ = {lam2.toFixed(3)}
            </div>
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-mono dark:bg-gray-800">
              det = {det.toFixed(3)}
            </div>
          </>
        )}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800">
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#9ca3af" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#9ca3af" strokeWidth={1} />
          {positiveCells.map(({ sx, sy, cellW }, i) => (
            <rect key={`p-${i}`} x={sx} y={sy - cellW / 2} width={cellW} height={cellW}
              fill="#fbbf24" opacity={0.35} />
          ))}
          {negativeCells.map(({ sx, sy, cellW }, i) => (
            <rect key={`n-${i}`} x={sx} y={sy - cellW / 2} width={cellW} height={cellW}
              fill="#6366f1" opacity={0.35} />
          ))}
          <text x={cx + 5} y={20} fontSize={10} fill="#9ca3af">x</text>
          <text x={W - 15} y={cy - 5} fontSize={10} fill="#9ca3af">y</text>
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        Yellow = <InlineMath math="x^\top A x > 0" /> band. Indigo = <InlineMath math="x^\top A x < 0" /> band. PD has no negative region.
      </p>
    </div>
  );
}

const PSD_CODE = `import numpy as np
from scipy.linalg import cholesky, cho_solve, cho_factor

# ---------------------------------------------------------------------------
# Checking and enforcing PSD
# ---------------------------------------------------------------------------

def is_psd(A, tol=1e-8):
    """Check if A is positive semidefinite via eigenvalue test."""
    eigenvalues = np.linalg.eigvalsh(A)  # eigvalsh assumes symmetric
    return np.all(eigenvalues >= -tol)

def is_pd(A, tol=1e-8):
    """Check if A is positive definite."""
    eigenvalues = np.linalg.eigvalsh(A)
    return np.all(eigenvalues > tol)

def nearest_psd(A):
    """
    Project A to the nearest PSD matrix (Higham, 1988).
    Uses eigendecomposition: zero out negative eigenvalues.
    """
    A_sym = (A + A.T) / 2   # symmetrize
    eigenvalues, eigenvectors = np.linalg.eigh(A_sym)
    eigenvalues = np.maximum(eigenvalues, 0)   # ReLU on eigenvalues
    return eigenvectors @ np.diag(eigenvalues) @ eigenvectors.T

# ---------------------------------------------------------------------------
# Cholesky factorization: A = L @ L.T
# ---------------------------------------------------------------------------

def cholesky_solve(A, b):
    """Solve Ax = b efficiently when A is PD via Cholesky factorization."""
    L = np.linalg.cholesky(A)   # A = L @ L.T
    # Forward substitution: L y = b
    y = np.linalg.solve(L, b)
    # Backward substitution: L.T x = y
    x = np.linalg.solve(L.T, y)
    return x

# Example
np.random.seed(42)
d = 4
A_raw = np.random.randn(d, d)
A_pd = A_raw.T @ A_raw + 0.1 * np.eye(d)   # guaranteed PD

print("Is PD?", is_pd(A_pd))
print("Eigenvalues:", np.linalg.eigvalsh(A_pd).round(3))

L = np.linalg.cholesky(A_pd)
print("\\nCholesky factor L:")
print(L.round(3))
print("||A - LLᵀ||_F =", np.linalg.norm(A_pd - L @ L.T).round(12))

# Solve Ax = b
b = np.random.randn(d)
x = cholesky_solve(A_pd, b)
print("\\nResidual ||Ax - b||:", np.linalg.norm(A_pd @ x - b).round(12))

# Indefinite matrix example
A_indef = np.array([[2, 3], [3, 1]], dtype=float)
print("\\nIndefinite matrix eigenvalues:", np.linalg.eigvalsh(A_indef).round(3))
print("Nearest PSD:")
print(nearest_psd(A_indef).round(3))`;

export default function PositiveSemidefiniteMatrices() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Positive Semidefinite Matrices
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          PSD/PD definitions, Cholesky factorization, and applications in kernel methods, covariance estimation, and optimization.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 8.1"
        title="Positive Definite and Semidefinite"
        definition="A real symmetric matrix $A \in \mathbb{R}^{n \times n}$ is: Positive Definite (PD, $A \succ 0$) if $v^\top A v > 0$ for all nonzero $v \in \mathbb{R}^n$. Positive Semidefinite (PSD, $A \succeq 0$) if $v^\top A v \geq 0$ for all $v$. Negative Definite (ND) if $-A \succ 0$. Indefinite if $v^\top A v$ takes both positive and negative values for different $v$. The set $\mathcal{S}_+^n$ of $n \times n$ PSD matrices forms a convex cone."
        notation="Equivalent characterizations of PD: (1) all eigenvalues $\lambda_i > 0$, (2) all leading principal minors positive (Sylvester's criterion), (3) Cholesky factorization $A = LL^\top$ with positive diagonal $L$ exists."
      />

      <PSDExplorer />

      <DefinitionBlock
        label="Definition 8.2"
        title="Cholesky Factorization"
        definition="Every positive definite matrix $A \in \mathbb{R}^{n \times n}$ has a unique Cholesky factorization $A = LL^\top$ where $L$ is lower triangular with positive diagonal entries. The factorization requires $O(n^3/3)$ operations (half the cost of LU decomposition) and is the standard method for solving linear systems $Ax = b$ when $A$ is PD. It fails (with a non-real square root) when $A$ is indefinite, serving as a practical PD test."
        notation="If $A \succeq 0$ (PSD, not PD), the factorization $A = LL^\top$ exists with $L$ having zero diagonal entries where $A$ is singular. In practice, a regularized Cholesky $A + \epsilon I$ is used for near-singular matrices."
      />

      <TheoremBlock
        label="Theorem 8.1"
        title="Characterizations of PSD Matrices"
        statement="For a real symmetric $A \in \mathbb{R}^{n \times n}$, the following are equivalent: (1) $A \succeq 0$ (all $v^\top Av \geq 0$). (2) All eigenvalues $\lambda_i \geq 0$. (3) $A = B^\top B$ for some matrix $B$. (4) $A = \sum_i \sigma_i u_i u_i^\top$ with $\sigma_i \geq 0$ (sum of PSD rank-1 matrices). (5) All principal submatrices have non-negative determinant."
        proof="(1)⟺(2): By spectral theorem $A = Q\Lambda Q^\top$. Then $v^\top Av = (Q^\top v)^\top \Lambda (Q^\top v) = \sum_i \lambda_i w_i^2$. This is $\geq 0$ for all $v$ iff all $\lambda_i \geq 0$. (2)⟹(3): Set $B = \Lambda^{1/2} Q^\top$ (exists since $\lambda_i \geq 0$). Then $B^\top B = Q\Lambda^{1/2}\Lambda^{1/2}Q^\top = Q\Lambda Q^\top = A$. (3)⟹(1): $v^\top Av = v^\top B^\top B v = \|Bv\|^2 \geq 0$. $\square$"
        corollaries={[
          "Gram matrices $K = X X^\\top$ (for any $X$) are always PSD. Kernel matrices in kernel methods are PSD by construction.",
          "The sum of two PSD matrices is PSD: $(A+B) \\succeq 0$ if $A,B \\succeq 0$. The product is PSD iff $A$ and $B$ commute.",
        ]}
      />

      <ExampleBlock
        title="Checking PSD via Cholesky"
        difficulty="advanced"
        problem="Determine if $A = \begin{bmatrix}4 & 2 \\ 2 & 1\end{bmatrix}$ is PD or PSD, and attempt Cholesky factorization."
        solution={[
          { step: "Eigenvalues", formula: "\\text{tr}(A) = 5, \\; \\det(A) = 4 \\cdot 1 - 2 \\cdot 2 = 0 \\implies \\lambda_1 = 5, \\lambda_2 = 0", explanation: "$\\det = 0$ means one eigenvalue is 0 — $A$ is PSD but not PD (rank-deficient)." },
          { step: "Cholesky attempt: $L_{11} = \\sqrt{a_{11}} = \\sqrt{4} = 2$", formula: "L = \\begin{bmatrix}2 & 0\\\\ 1 & ?\\end{bmatrix}, \\quad L_{22} = \\sqrt{a_{22} - L_{21}^2} = \\sqrt{1 - 1} = 0" },
          { step: "Result", formula: "A = \\begin{bmatrix}2&0\\\\1&0\\end{bmatrix}\\begin{bmatrix}2&1\\\\0&0\\end{bmatrix}", explanation: "$L_{22} = 0$ confirms $A$ is singular PSD. Standard Cholesky succeeds but with a zero on the diagonal — cannot solve systems with this $A$ without regularization." },
        ]}
      />

      <WarningBlock title="PSD in Machine Learning Practice">
        <ul className="space-y-2 text-sm">
          <li><strong>Kernel matrices must be PSD.</strong> The SVM dual, Gaussian process covariance, and kernel regression all require the kernel matrix $K_{ij} = k(x_i, x_j)$ to be PSD. A non-PSD kernel function leads to indefinite quadratic programs that may have no solution. Verify kernels using Mercer's theorem.</li>
          <li className="mt-2"><strong>Sample covariance can be near-singular.</strong> When $n < d$ (fewer samples than features), the sample covariance is rank-deficient. Ridge regression adds $\lambda I$ (regularization) to ensure invertibility — equivalent to using the regularized covariance $\hat{\Sigma} + \lambda I \succ 0$.</li>
          <li className="mt-2"><strong>Neural network Hessians are indefinite.</strong> The Hessian of a neural network loss is generally indefinite at most points (including saddle points). Only at local minima is the Hessian PSD. This is why second-order optimizers in deep learning must handle indefinite curvature.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={PSD_CODE} title="PSD Matrices and Cholesky Factorization — NumPy" runnable />
    </div>
  );
}
