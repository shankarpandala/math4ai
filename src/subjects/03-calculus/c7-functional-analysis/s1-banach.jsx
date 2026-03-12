import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function CauchySequenceViz() {
  const [n, setN] = useState(10);

  // Cauchy sequence: x_n = sum_{k=1}^{n} 1/k^2 -> pi^2/6 (converges in R)
  const terms = Array.from({ length: n }, (_, i) => {
    const k = i + 1;
    return { k, partial: Array.from({ length: k }, (_, j) => 1 / ((j + 1) ** 2)).reduce((a, b) => a + b, 0) };
  });
  const limit = Math.PI ** 2 / 6;
  const W = 340, H = 180;
  const maxK = n;
  const yMin = 1, yMax = 2;
  const toSvg = (k, y) => ({
    sx: (k / maxK) * W * 0.9 + W * 0.05,
    sy: H - ((y - yMin) / (yMax - yMin)) * H * 0.85 - H * 0.05,
  });

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Cauchy Sequence Convergence: <InlineMath math="\sum_{k=1}^n \frac{1}{k^2} \to \frac{\pi^2}{6}" />
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Completeness: every Cauchy sequence converges in a Banach/Hilbert space.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* limit line */}
        <line x1={W * 0.05} y1={toSvg(0, limit).sy} x2={W * 0.95} y2={toSvg(0, limit).sy}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={W * 0.96} y={toSvg(0, limit).sy + 4} fontSize={9} fill="#ef4444">π²/6</text>
        {/* partial sums */}
        {terms.map(({ k, partial }) => {
          const { sx, sy } = toSvg(k, partial);
          return <circle key={k} cx={sx} cy={sy} r={3} fill="#6366f1" />;
        })}
        {/* line connecting */}
        {terms.length > 1 && (
          <polyline
            points={terms.map(({ k, partial }) => `${toSvg(k, partial).sx},${toSvg(k, partial).sy}`).join(' ')}
            fill="none" stroke="#6366f1" strokeWidth={1.5} />
        )}
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span>Terms n = {n}</span>
          <span>S_n = {terms[n-1]?.partial.toFixed(6)} | π²/6 ≈ {limit.toFixed(6)}</span>
        </div>
        <input type="range" min="1" max="50" step="1" value={n}
          onChange={e => setN(parseInt(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-xs">
        Error: |S_n - π²/6| = {Math.abs((terms[n-1]?.partial ?? 0) - limit).toFixed(8)}
      </div>
    </div>
  );
}

export default function BanachSection() {
  return (
    <div className="space-y-8">
      <CauchySequenceViz />

      <DefinitionBlock
        label="Definition 7.1.1"
        title="Banach Space"
        definition={
          "A Banach space is a complete normed vector space $(X, \\|\\cdot\\|)$: a vector space $X$ over $\\mathbb{R}$ (or $\\mathbb{C}$) " +
          "equipped with a norm $\\|\\cdot\\|: X \\to [0,\\infty)$ satisfying " +
          "(1) $\\|x\\| = 0 \\iff x = 0$; (2) $\\|\\alpha x\\| = |\\alpha| \\|x\\|$; (3) $\\|x+y\\| \\leq \\|x\\| + \\|y\\|$ (triangle inequality); " +
          "and (4) every Cauchy sequence $(x_n)$ (i.e., $\\|x_m - x_n\\| \\to 0$ as $m,n \\to \\infty$) converges to some $x \\in X$."
        }
        notation={
          "Examples: $\\mathbb{R}^n$ with any $\\ell^p$ norm; $C([a,b])$ with sup norm; $L^p(\\Omega)$ for $1 \\leq p \\leq \\infty$. " +
          "Incomplete example: $C([0,1])$ with $L^2$ norm (Cauchy sequence of continuous functions can converge to discontinuous $L^2$ function)."
        }
      />

      <DefinitionBlock
        label="Definition 7.1.2"
        title="Hilbert Space"
        definition={
          "A Hilbert space $H$ is a complete inner product space: a vector space with an inner product " +
          "$\\langle \\cdot, \\cdot \\rangle: H \\times H \\to \\mathbb{R}$ (or $\\mathbb{C}$) satisfying linearity, symmetry ($\\langle x,y\\rangle = \\overline{\\langle y,x\\rangle}$), " +
          "and positive-definiteness ($\\langle x,x\\rangle > 0$ for $x \\neq 0$), " +
          "with induced norm $\\|x\\| = \\sqrt{\\langle x,x\\rangle}$, complete as a Banach space. " +
          "Key example: $L^2(\\Omega) = \\{f: \\int |f|^2\\,d\\mu < \\infty\\}$ with $\\langle f,g\\rangle = \\int f\\bar{g}\\,d\\mu$."
        }
      />

      <TheoremBlock
        label="Theorem 7.1.1"
        title="Cauchy-Schwarz Inequality"
        statement={
          "In a Hilbert space $H$: $|\\langle x, y \\rangle| \\leq \\|x\\| \\|y\\|$ for all $x, y \\in H$, " +
          "with equality iff $x$ and $y$ are linearly dependent. " +
          "Corollary (Bessel's inequality): for any orthonormal sequence $(e_n)$: $\\sum_n |\\langle x, e_n\\rangle|^2 \\leq \\|x\\|^2$."
        }
        proof={
          "For $y = 0$ the result is trivial. For $y \\neq 0$: expand $0 \\leq \\|x - \\frac{\\langle x,y\\rangle}{\\|y\\|^2} y\\|^2 = \\|x\\|^2 - \\frac{|\\langle x,y\\rangle|^2}{\\|y\\|^2}$. " +
          "Rearranging gives $|\\langle x,y\\rangle|^2 \\leq \\|x\\|^2 \\|y\\|^2$. Equality holds iff the norm is zero, i.e., $x = \\lambda y$."
        }
        corollaries={[
          "Triangle inequality follows from Cauchy-Schwarz: $\\|x+y\\|^2 = \\|x\\|^2 + 2\\text{Re}\\langle x,y\\rangle + \\|y\\|^2 \\leq (\\|x\\|+\\|y\\|)^2$.",
          "Parseval's identity: if $(e_n)$ is a complete ONB of $H$, then $\\|x\\|^2 = \\sum_n |\\langle x, e_n\\rangle|^2$.",
        ]}
      />

      <ExampleBlock title="L² Space and Fourier Basis">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          In <InlineMath math="L^2([0, 2\pi])" />, the functions <InlineMath math="\{e^{inx}\}_{n \in \mathbb{Z}}" /> form a complete
          orthonormal basis (after normalization). The Fourier coefficients are:
        </p>
        <BlockMath math="\hat{f}(n) = \frac{1}{2\pi}\int_0^{2\pi} f(x) e^{-inx}\,dx = \langle f, e^{inx}\rangle" />
        <BlockMath math="\|f\|_{L^2}^2 = 2\pi \sum_{n=-\infty}^\infty |\hat{f}(n)|^2 \quad \text{(Parseval)}" />
      </ExampleBlock>

      <WarningBlock title="Separability and Basis in Infinite Dimensions">
        <p>
          In finite dimensions, all norms are equivalent and every normed space is complete. In infinite
          dimensions, these fail dramatically: <InlineMath math="\ell^1 \subsetneq \ell^2 \subsetneq \ell^\infty" />{' '}
          with strict inclusions and no norm equivalence. A Hilbert space has an orthonormal basis
          (Schauder basis), but a general Banach space may not have a Schauder basis at all (Enflo, 1973).
          Completeness is essential: without it, the spectral theorem and many key results fail.
        </p>
      </WarningBlock>

      <PythonCode
        title="Hilbert Space Operations with NumPy"
        code={`import numpy as np

# ── L² inner product (discrete approximation) ────────────────────────────
def l2_inner(f, g, a=0, b=2*np.pi, n=10000):
    """Approximate L² inner product ∫f*g dx / (b-a)."""
    xs = np.linspace(a, b, n)
    return np.trapz(f(xs) * g(xs), xs)

def l2_norm(f, a=0, b=2*np.pi, n=10000):
    xs = np.linspace(a, b, n)
    return np.sqrt(np.trapz(f(xs)**2, xs))

# Fourier basis functions
basis = [
    lambda x, n=n: np.cos(n * x) / np.sqrt(np.pi) for n in range(1, 4)
] + [lambda x, n=n: np.sin(n * x) / np.sqrt(np.pi) for n in range(1, 4)]
basis.insert(0, lambda x: np.ones_like(x) / np.sqrt(2 * np.pi))

print("Inner products (should be ≈ 0 for i≠j, ≈ 1 for i=j):")
for i in range(3):
    for j in range(3):
        ip = l2_inner(basis[i], basis[j])
        print(f"  <e_{i}, e_{j}> = {ip:.4f}")

# ── Cauchy-Schwarz inequality ─────────────────────────────────────────────
f = lambda x: np.sin(x)
g = lambda x: x / np.pi
lhs = abs(l2_inner(f, g))
rhs = l2_norm(f) * l2_norm(g)
print(f"\\nCauchy-Schwarz: |<f,g>| = {lhs:.4f} ≤ ||f||·||g|| = {rhs:.4f}")
print(f"  Satisfied: {lhs <= rhs + 1e-10}")

# ── Parseval's identity ───────────────────────────────────────────────────
f2 = lambda x: x  # f(x) = x on [0, 2pi]
norm_sq = l2_inner(f2, f2)
# Fourier coefficients: a_n = (1/pi)∫x cos(nx)dx, b_n = (1/pi)∫x sin(nx)dx
parseval_sum = 0
for n in range(1, 100):
    an = l2_inner(f2, lambda x, n=n: np.cos(n*x)) / np.pi
    bn = l2_inner(f2, lambda x, n=n: np.sin(n*x)) / np.pi
    parseval_sum += an**2 + bn**2

a0 = l2_inner(f2, lambda x: np.ones_like(x)) / (2*np.pi)
parseval_sum += 2 * a0**2
print(f"\\nParseval: ||f||² = {norm_sq:.4f}, Σ|c_n|² = {parseval_sum*np.pi:.4f}")`}
      />
    </div>
  );
}
