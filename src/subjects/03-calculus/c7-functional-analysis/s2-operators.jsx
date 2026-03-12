import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function OperatorNormViz() {
  const [a, setA] = useState(2.0);
  const [b, setB] = useState(0.5);
  const [c, setC] = useState(0.3);
  const [d, setD] = useState(1.5);

  const W = 300, H = 220;

  // Map vectors on unit circle, show image under A
  const nPts = 80;
  const unitCircle = Array.from({ length: nPts + 1 }, (_, i) => {
    const t = (i / nPts) * 2 * Math.PI;
    return { x: Math.cos(t), y: Math.sin(t) };
  });

  const imageEllipse = unitCircle.map(({ x, y }) => ({
    x: a * x + b * y,
    y: c * x + d * y,
  }));

  const allX = [...unitCircle.map(p => p.x), ...imageEllipse.map(p => p.x)];
  const allY = [...unitCircle.map(p => p.y), ...imageEllipse.map(p => p.y)];
  const xMin = Math.min(...allX) - 0.5, xMax = Math.max(...allX) + 0.5;
  const yMin = Math.min(...allY) - 0.5, yMax = Math.max(...allY) + 0.5;
  const range = Math.max(xMax - xMin, yMax - yMin);
  const cx = W / 2, cy = H / 2;
  const scale = Math.min(W, H) * 0.38 / (range / 2);

  const toSvg = (x, y) => ({ sx: cx + x * scale, sy: cy - y * scale });

  const unitPath = unitCircle.map((p, i) => {
    const { sx, sy } = toSvg(p.x, p.y);
    return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(' ') + 'Z';

  const imagePath = imageEllipse.map((p, i) => {
    const { sx, sy } = toSvg(p.x, p.y);
    return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(' ') + 'Z';

  // Operator norm = largest singular value
  const sv1sq = ((a**2 + b**2 + c**2 + d**2) + Math.sqrt((a**2 + b**2 + c**2 + d**2)**2 - 4*(a*d - b*c)**2)) / 2;
  const opNorm = Math.sqrt(Math.max(0, sv1sq));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Bounded Linear Operator: Unit Ball Image
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Gray = unit circle. Blue = image under <InlineMath math="A" />. Operator norm = largest radius of image ellipse.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e5e7eb" strokeWidth={1} />
        <path d={unitPath} fill="rgba(156,163,175,0.1)" stroke="#9ca3af" strokeWidth={1.5} />
        <path d={imagePath} fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth={2} />
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[{l:'a',v:a,s:setA},{l:'b',v:b,s:setB},{l:'c',v:c,s:setC},{l:'d',v:d,s:setD}].map(({l,v,s}) => (
          <div key={l}>
            <div className="mb-1 flex justify-between text-xs"><span className="font-mono">{l}</span><span>{v.toFixed(2)}</span></div>
            <input type="range" min="-3" max="3" step="0.1" value={v} onChange={e => s(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        <InlineMath math={`\\|A\\|_{\\text{op}} = \\sigma_1 \\approx ${opNorm.toFixed(4)}`} />
        {' '} (largest singular value)
      </div>
    </div>
  );
}

export default function OperatorsSection() {
  return (
    <div className="space-y-8">
      <OperatorNormViz />

      <DefinitionBlock
        label="Definition 7.2.1"
        title="Bounded Linear Operators"
        definition={
          "A linear map $T: X \\to Y$ between normed spaces is bounded if " +
          "$\\|T\\|_{\\text{op}} = \\sup_{\\|x\\| \\leq 1} \\|Tx\\|_Y < \\infty$. " +
          "Equivalently: $\\|Tx\\| \\leq M\\|x\\|$ for some $M > 0$ and all $x$. " +
          "On infinite-dimensional spaces, linear ≠ bounded (unbounded linear operators exist, e.g., differentiation $d/dx$ on $C^1[0,1]$). " +
          "The operator norm satisfies $\\|ST\\| \\leq \\|S\\| \\|T\\|$ (submultiplicativity)."
        }
        notation={
          "The space of bounded linear operators $\\mathcal{B}(X, Y)$ is itself a Banach space under the operator norm. " +
          "The dual space $X^* = \\mathcal{B}(X, \\mathbb{R})$ consists of bounded linear functionals."
        }
      />

      <DefinitionBlock
        label="Definition 7.2.2"
        title="Spectrum of an Operator"
        definition={
          "For $T \\in \\mathcal{B}(X)$ on a Banach space $X$, the resolvent set is $\\rho(T) = \\{\\lambda \\in \\mathbb{C}: (T - \\lambda I)^{-1} \\in \\mathcal{B}(X)\\}$. " +
          "The spectrum is $\\sigma(T) = \\mathbb{C} \\setminus \\rho(T)$, decomposed as: " +
          "point spectrum (eigenvalues, $\\ker(T-\\lambda I) \\neq 0$), " +
          "continuous spectrum ($(T-\\lambda I)^{-1}$ exists but is unbounded), " +
          "residual spectrum ($(T-\\lambda I)^{-1}$ exists on a non-dense domain)."
        }
      />

      <TheoremBlock
        label="Theorem 7.2.1"
        title="Spectral Theorem for Compact Self-Adjoint Operators"
        statement={
          "Let $T: H \\to H$ be a compact self-adjoint operator on a Hilbert space. " +
          "Then $H$ has an orthonormal basis of eigenvectors of $T$, " +
          "the eigenvalues are real, form a sequence $(\\lambda_n)$ with $\\lambda_n \\to 0$, " +
          "and $T = \\sum_n \\lambda_n \\langle \\cdot, e_n \\rangle e_n$ (spectral decomposition)."
        }
        proof={
          "Since $T$ is compact, the closed unit ball maps to a precompact set. " +
          "By self-adjointness, eigenvalues are real and eigenvectors for distinct eigenvalues are orthogonal. " +
          "The sequence $\\lambda_n \\to 0$ follows from compactness: if $|\\lambda_n| \\geq \\varepsilon$ " +
          "for infinitely many $n$, the normalized eigenvectors form a bounded sequence with no convergent subsequence under $T$, " +
          "contradicting compactness."
        }
      />

      <ExampleBlock title="Integral Operator as Compact Operator">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          The Hilbert-Schmidt integral operator <InlineMath math="Tf(x) = \int_0^1 K(x,y) f(y)\,dy" /> with
          kernel <InlineMath math="K \in L^2([0,1]^2)" /> is compact on <InlineMath math="L^2[0,1]" />.
          Its Hilbert-Schmidt norm is:
        </p>
        <BlockMath math="\|T\|_{\text{HS}}^2 = \int_0^1\int_0^1 |K(x,y)|^2\,dx\,dy \geq \|T\|_{\text{op}}^2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gram matrices in kernel methods are finite-rank approximations of such operators.
        </p>
      </ExampleBlock>

      <WarningBlock title="Unbounded Operators Are Essential in Quantum Mechanics">
        <p>
          The position operator <InlineMath math="(Xf)(x) = xf(x)" /> and momentum operator{' '}
          <InlineMath math="(Pf)(x) = -i\hbar f'(x)" /> are both unbounded on <InlineMath math="L^2(\mathbb{R})" />.
          They cannot be defined on all of <InlineMath math="L^2" /> — only on dense domains. The
          uncertainty principle <InlineMath math="\|Xf\|\|Pf\| \geq \frac{\hbar}{2}\|f\|^2" /> follows from
          the Cauchy-Schwarz inequality applied to the commutator <InlineMath math="[X,P] = i\hbar I" />.
          Bounded operators on finite-dimensional spaces are just matrices — infinite dimensions add
          fundamental new phenomena.
        </p>
      </WarningBlock>

      <PythonCode
        title="Operator Norm and Spectrum with NumPy"
        code={`import numpy as np

# ── Operator norm (largest singular value) ───────────────────────────────
A = np.array([[2.0, 0.5],
              [0.3, 1.5]])

# Operator norm = largest singular value
U, s, Vt = np.linalg.svd(A)
op_norm = s[0]
print(f"Matrix A:\n{A}")
print(f"Singular values: {s}")
print(f"Operator norm ||A||_op = σ_max = {op_norm:.4f}")

# Verify: max ||Ax|| / ||x|| over unit sphere
n_samples = 100000
xs = np.random.randn(2, n_samples)
xs /= np.linalg.norm(xs, axis=0)
norms = np.linalg.norm(A @ xs, axis=0)
print(f"Empirical max ||Ax||/||x||: {norms.max():.4f}")

# ── Spectral radius ───────────────────────────────────────────────────────
eigenvalues = np.linalg.eigvals(A)
spectral_radius = np.max(np.abs(eigenvalues))
print(f"\\nEigenvalues: {eigenvalues}")
print(f"Spectral radius ρ(A) = {spectral_radius:.4f}")
print(f"Note: ρ(A) ≤ ||A||_op: {spectral_radius <= op_norm + 1e-10}")

# ── Compact operator: finite-rank approximation ───────────────────────────
# Truncated SVD approximation
B = np.random.randn(10, 10)
U, s, Vt = np.linalg.svd(B)

for rank in [1, 3, 5, 10]:
    B_approx = U[:, :rank] @ np.diag(s[:rank]) @ Vt[:rank, :]
    err = np.linalg.norm(B - B_approx, ord=2)
    print(f"  Rank-{rank:2d} approx: ||B - B_r||_op = {err:.4f} = σ_{rank+1} = {s[rank] if rank < 10 else 0:.4f}")`}
      />
    </div>
  );
}
