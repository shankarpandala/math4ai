import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function HessianExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0.5);
  const [d, setD] = useState(3);

  // 2x2 symmetric Hessian: H = [[a, b], [b, d]]
  const det = a * d - b * b;
  const tr = a + d;
  const disc = Math.sqrt(Math.max(0, (a - d) ** 2 + 4 * b * b));
  const lam1 = (tr + disc) / 2;
  const lam2 = (tr - disc) / 2;

  let status, color, bg;
  if (lam1 > 0 && lam2 > 0) { status = 'Positive Definite (local minimum)'; color = 'text-green-700 dark:text-green-300'; bg = 'bg-green-50 dark:bg-green-900/20'; }
  else if (lam1 < 0 && lam2 < 0) { status = 'Negative Definite (local maximum)'; color = 'text-red-700 dark:text-red-300'; bg = 'bg-red-50 dark:bg-red-900/20'; }
  else if (Math.abs(lam1) < 1e-9 || Math.abs(lam2) < 1e-9) { status = 'Positive Semidefinite or Singular'; color = 'text-yellow-700 dark:text-yellow-300'; bg = 'bg-yellow-50 dark:bg-yellow-900/20'; }
  else { status = 'Indefinite (saddle point)'; color = 'text-orange-700 dark:text-orange-300'; bg = 'bg-orange-50 dark:bg-orange-900/20'; }

  const sliderClass = 'w-full accent-violet-500';

  // Visualize quadratic form Q(v) = v^T H v on unit circle
  const W = 280, H = 200;
  const nPts = 120;
  const scaleF = 15;
  const cx = W / 2, cy = H / 2;
  const pts = Array.from({ length: nPts + 1 }, (_, i) => {
    const t = (i / nPts) * 2 * Math.PI;
    const vx = Math.cos(t), vy = Math.sin(t);
    const q = a * vx * vx + 2 * b * vx * vy + d * vy * vy;
    const r = Math.min(40, Math.abs(q) * scaleF);
    const sign = q >= 0 ? 1 : -1;
    return { x: cx + sign * r * vx, y: cy - sign * r * vy, pos: q >= 0 };
  });

  const posPts = pts.filter(p => p.pos);
  const negPts = pts.filter(p => !p.pos);
  const makePath = (ps) => ps.length < 2 ? '' : ps.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Hessian Eigenvalue Explorer
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Symmetric 2×2 Hessian <InlineMath math="H = \begin{bmatrix}a & b \\ b & d\end{bmatrix}" />. Shape shows quadratic form <InlineMath math="\mathbf{v}^T H \mathbf{v}" /> (green=positive, red=negative).
      </p>
      <div className="flex gap-6">
        <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
          <circle cx={cx} cy={cy} r={1} fill="#9ca3af" />
          {posPts.length > 1 && <path d={makePath(posPts)} fill="rgba(34,197,94,0.3)" stroke="#16a34a" strokeWidth={1.5} />}
          {negPts.length > 1 && <path d={makePath(negPts)} fill="rgba(239,68,68,0.3)" stroke="#dc2626" strokeWidth={1.5} />}
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e5e7eb" strokeWidth={1} />
        </svg>
        <div className="space-y-3 text-sm flex-1">
          <div className="font-mono text-xs space-y-1">
            <div>λ₁ = <span className="text-indigo-600 dark:text-indigo-400 font-bold">{lam1.toFixed(3)}</span></div>
            <div>λ₂ = <span className="text-indigo-600 dark:text-indigo-400 font-bold">{lam2.toFixed(3)}</span></div>
            <div>det(H) = <span className={det > 0 ? 'text-green-600' : 'text-red-600'}>{det.toFixed(3)}</span></div>
            <div>tr(H) = {tr.toFixed(3)}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[{ label: 'a (H₁₁)', val: a, set: setA }, { label: 'b (H₁₂=H₂₁)', val: b, set: setB }, { label: 'd (H₂₂)', val: d, set: setD }].map(({ label, val, set }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono">{label}</span><span>{val.toFixed(2)}</span>
            </div>
            <input type="range" min="-4" max="4" step="0.1" value={val}
              onChange={e => set(parseFloat(e.target.value))} className={sliderClass} />
          </div>
        ))}
      </div>
      <div className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${bg} ${color}`}>{status}</div>
    </div>
  );
}

export default function HessianSection() {
  return (
    <div className="space-y-8">
      <HessianExplorer />

      <DefinitionBlock
        label="Definition 4.2.1"
        title="Hessian Matrix"
        definition={
          "For $f: \\mathbb{R}^n \\to \\mathbb{R}$ twice continuously differentiable, the Hessian is " +
          "$H_f(\\mathbf{x}) = \\nabla^2 f(\\mathbf{x}) \\in \\mathbb{R}^{n \\times n}$ with entries " +
          "$(H_f)_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$. " +
          "By Schwarz's theorem ($f \\in C^2$), $H_f$ is symmetric: $(H_f)_{ij} = (H_f)_{ji}$. " +
          "The second-order Taylor expansion is $f(\\mathbf{x}+\\delta) \\approx f(\\mathbf{x}) + \\nabla f^T \\delta + \\frac{1}{2} \\delta^T H_f \\delta$."
        }
        notation={
          "Positive (semi)definite: $H \\succ 0$ iff all eigenvalues positive; $H \\succeq 0$ iff all $\\geq 0$. " +
          "Negative definite: $H \\prec 0$ iff all eigenvalues negative. Indefinite: mixed sign eigenvalues."
        }
      />

      <DefinitionBlock
        label="Definition 4.2.2"
        title="Second-Order Optimality Conditions"
        definition={
          "Let $f \\in C^2$ and $\\nabla f(\\mathbf{x}^*) = 0$ (first-order necessary condition). " +
          "(1) If $H_f(\\mathbf{x}^*) \\succ 0$, then $\\mathbf{x}^*$ is a strict local minimum. " +
          "(2) If $H_f(\\mathbf{x}^*) \\prec 0$, then $\\mathbf{x}^*$ is a strict local maximum. " +
          "(3) If $H_f(\\mathbf{x}^*)$ is indefinite, then $\\mathbf{x}^*$ is a saddle point. " +
          "(4) If $H_f(\\mathbf{x}^*) \\succeq 0$ (singular), the test is inconclusive."
        }
      />

      <TheoremBlock
        label="Theorem 4.2.1"
        title="Positive Definiteness and Convexity"
        statement={
          "A twice continuously differentiable function $f: \\mathbb{R}^n \\to \\mathbb{R}$ is convex if and only if " +
          "$H_f(\\mathbf{x}) \\succeq 0$ for all $\\mathbf{x}$. " +
          "It is strictly convex if $H_f(\\mathbf{x}) \\succ 0$ for all $\\mathbf{x}$ (sufficient but not necessary). " +
          "Equivalently: $f$ is convex iff $f(\\lambda \\mathbf{x} + (1-\\lambda)\\mathbf{y}) \\leq \\lambda f(\\mathbf{x}) + (1-\\lambda) f(\\mathbf{y})$ for all $\\lambda \\in [0,1]$."
        }
        proof={
          "($\\Rightarrow$) If $f$ is convex, for any $\\mathbf{x}, \\mathbf{d}$: $g(t) = f(\\mathbf{x}+t\\mathbf{d})$ is convex in $t$, " +
          "so $g''(0) \\geq 0$, i.e., $\\mathbf{d}^T H_f(\\mathbf{x}) \\mathbf{d} \\geq 0$. Since $\\mathbf{d}$ is arbitrary, $H_f \\succeq 0$. " +
          "($\\Leftarrow$) If $H_f \\succeq 0$ everywhere, integrate the second-order expansion along line segments to verify the convexity inequality."
        }
      />

      <ExampleBlock title="Classifying Critical Points of f(x,y) = x³ - 3xy² ">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          This function (the real part of <InlineMath math="z^3" />) has a critical point at the origin.
        </p>
        <BlockMath math="H_f(0,0) = \begin{bmatrix} 6x & -6y \\ -6y & -6x \end{bmatrix}_{(0,0)} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          The Hessian is zero — the second-order test is inconclusive. Direct inspection shows this is a
          saddle (monkey saddle) with three ascending and three descending paths.
        </p>
      </ExampleBlock>

      <WarningBlock title="Hessian Approximations in Deep Learning">
        <p>
          For a neural network with <InlineMath math="p" /> parameters, the full Hessian requires
          <InlineMath math="O(p^2)" /> memory — infeasible for millions of parameters. Practical
          alternatives: diagonal Hessian approximations (e.g., AdaGrad, Adam use diagonal curvature
          estimates), Hessian-free optimization (computes Hessian-vector products in <InlineMath math="O(p)" />),
          and K-FAC (Kronecker-factored approximations). The Hessian spectrum in deep networks often
          shows a bulk of small eigenvalues and a few very large ones (outliers).
        </p>
      </WarningBlock>

      <PythonCode
        title="Hessian Computation with NumPy and Autograd"
        code={`import numpy as np

def hessian_finite_diff(f, x, h=1e-4):
    """Compute Hessian via finite differences."""
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            xpp = x.copy(); xpp[i] += h; xpp[j] += h
            xpm = x.copy(); xpm[i] += h; xpm[j] -= h
            xmp = x.copy(); xmp[i] -= h; xmp[j] += h
            xmm = x.copy(); xmm[i] -= h; xmm[j] -= h
            H[i, j] = (f(xpp) - f(xpm) - f(xmp) + f(xmm)) / (4 * h**2)
    return H

# f(x,y) = x^2 + 3xy + y^2
f = lambda x: x[0]**2 + 3*x[0]*x[1] + x[1]**2
x0 = np.array([1.0, 2.0])
H = hessian_finite_diff(f, x0)
print("Hessian of x²+3xy+y²:")
print(H)
print("Analytic: [[2, 3], [3, 2]]")

# Eigenvalue analysis
eigenvalues = np.linalg.eigvalsh(H)
print(f"Eigenvalues: {eigenvalues}")

is_pd = np.all(eigenvalues > 0)
is_nd = np.all(eigenvalues < 0)
print(f"Positive definite: {is_pd}, Negative definite: {is_nd}")
print(f"Critical point type: {'min' if is_pd else 'max' if is_nd else 'saddle'}")

# Convexity check via Hessian PSD
def is_convex_on_grid(f, xlim=(-3,3), n=20):
    """Check if f is convex by testing H>=0 on a grid."""
    xs = np.linspace(*xlim, n)
    for xi in xs:
        for yi in xs:
            H = hessian_finite_diff(f, np.array([xi, yi]))
            if np.any(np.linalg.eigvalsh(H) < -1e-6):
                return False
    return True

f_convex = lambda x: x[0]**2 + x[1]**2  # convex
f_saddle = lambda x: x[0]**2 - x[1]**2  # not convex
print(f"\\nx²+y² is convex: {is_convex_on_grid(f_convex)}")
print(f"x²-y² is convex: {is_convex_on_grid(f_saddle)}")`}
      />
    </div>
  );
}
