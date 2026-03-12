import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function ImproperIntegralViz() {
  const [p, setP] = useState(1.5);
  const converges = p > 1;

  const W = 340, H = 200;
  const xMin = 0.5, xMax = 6, yMin = 0, yMax = 2.5;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const f = (x) => 1 / Math.pow(x, p);

  // Build filled area path from 1 to xMax
  const nPts = 200;
  const xs = Array.from({ length: nPts }, (_, i) => 1 + (i / (nPts - 1)) * (xMax - 1));
  const areaPath = (() => {
    const pts = xs.map(x => toSvg(x, Math.min(yMax, f(x))));
    const start = toSvg(1, 0);
    const end = toSvg(xMax, 0);
    return `M${start.sx},${start.sy} ` + pts.map(p => `L${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ') + ` L${end.sx},${end.sy} Z`;
  })();

  const curvePath = (() => {
    const pts = xs.map(x => toSvg(x, Math.min(yMax, f(x))));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  })();

  const axisY = toSvg(0, 0).sy;
  const value = converges ? `1/(p-1) = 1/${(p - 1).toFixed(2)} ≈ ${(1 / (p - 1)).toFixed(3)}` : '∞ (diverges)';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Improper Integral: <InlineMath math="\int_1^\infty x^{-p}\,dx" />
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Adjust <InlineMath math="p" />. Converges (finite area) iff <InlineMath math="p > 1" />.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <path d={areaPath} fill={converges ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)'} />
        <path d={curvePath} fill="none" stroke={converges ? '#16a34a' : '#dc2626'} strokeWidth={2.5} />
        <line x1={0} y1={axisY} x2={W} y2={axisY} stroke="#9ca3af" strokeWidth={1} />
        <line x1={toSvg(1, 0).sx} y1={0} x2={toSvg(1, 0).sx} y2={H} stroke="#6b7280" strokeWidth={1} strokeDasharray="4,3" />
        <text x={toSvg(1, 0).sx + 3} y={axisY - 4} fontSize={10} fill="#6b7280">x=1</text>
        <text x={W - 60} y={20} fontSize={11} fill={converges ? '#16a34a' : '#dc2626'} fontWeight="bold">
          {converges ? 'CONVERGES' : 'DIVERGES'}
        </text>
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span className="font-mono">p</span><span>{p.toFixed(2)}</span>
        </div>
        <input type="range" min="0.3" max="3" step="0.05" value={p}
          onChange={e => setP(parseFloat(e.target.value))}
          className="w-full accent-indigo-500" />
      </div>
      <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${converges ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
        <InlineMath math={`\\int_1^\\infty x^{-${p.toFixed(2)}}\\,dx`} /> = {value}
      </div>
    </div>
  );
}

export default function ImproperIntegralsSection() {
  return (
    <div className="space-y-8">
      <ImproperIntegralViz />

      <DefinitionBlock
        label="Definition 3.2.1"
        title="Improper Integrals"
        definition={
          "An integral is improper if the interval is unbounded or the integrand is unbounded. " +
          "Type 1 (infinite limits): $\\int_a^\\infty f(x)\\,dx = \\lim_{b\\to\\infty} \\int_a^b f(x)\\,dx$. " +
          "Type 2 (unbounded integrand): $\\int_a^b f(x)\\,dx = \\lim_{\\varepsilon \\to 0^+} \\int_{a+\\varepsilon}^b f(x)\\,dx$ " +
          "if $f$ has a singularity at $a$. The integral converges if the limit exists and is finite."
        }
        notation={
          "The p-integral: $\\int_1^\\infty x^{-p}\\,dx$ converges iff $p > 1$, with value $1/(p-1)$. " +
          "Dually, $\\int_0^1 x^{-p}\\,dx$ converges iff $p < 1$, with value $1/(1-p)$."
        }
      />

      <DefinitionBlock
        label="Definition 3.2.2"
        title="Comparison Test for Improper Integrals"
        definition={
          "If $0 \\leq f(x) \\leq g(x)$ for $x \\geq a$, then: " +
          "(1) if $\\int_a^\\infty g(x)\\,dx$ converges, so does $\\int_a^\\infty f(x)\\,dx$; " +
          "(2) if $\\int_a^\\infty f(x)\\,dx$ diverges, so does $\\int_a^\\infty g(x)\\,dx$. " +
          "The limit comparison test: if $\\lim_{x\\to\\infty} f(x)/g(x) = c > 0$, " +
          "then $\\int_a^\\infty f$ and $\\int_a^\\infty g$ either both converge or both diverge."
        }
      />

      <TheoremBlock
        label="Theorem 3.2.1"
        title="Absolute Convergence Implies Convergence"
        statement={
          "If $\\int_a^\\infty |f(x)|\\,dx < \\infty$, then $\\int_a^\\infty f(x)\\,dx$ converges. " +
          "An integral satisfying this is called absolutely convergent. " +
          "An integral may converge conditionally without absolute convergence " +
          "(e.g., $\\int_1^\\infty \\sin(x)/x\\,dx$ converges but $\\int_1^\\infty |\\sin(x)/x|\\,dx$ diverges)."
        }
        proof={
          "Since $0 \\leq f(x) + |f(x)| \\leq 2|f(x)|$, and $\\int 2|f|$ converges, " +
          "by the comparison test $\\int (f + |f|)$ converges. " +
          "Then $\\int f = \\int (f + |f|) - \\int |f|$ is the difference of two convergent integrals."
        }
      />

      <ExampleBlock title="Gamma Function: Γ(n) = (n-1)!">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          The Gamma function <InlineMath math="\Gamma(s) = \int_0^\infty t^{s-1} e^{-t}\,dt" /> converges
          for all <InlineMath math="s > 0" />.
        </p>
        <BlockMath math="\Gamma(n) = (n-1)! \quad \text{for } n \in \mathbb{N}" />
        <BlockMath math="\Gamma(1/2) = \sqrt{\pi}, \quad \Gamma(3/2) = \frac{\sqrt{\pi}}{2}" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Central to probability (chi-squared, Gamma distributions) and the definition of the Beta function.
        </p>
      </ExampleBlock>

      <WarningBlock title="Infinite Integrand ≠ Infinite Integral">
        <p>
          <InlineMath math="\int_0^1 x^{-1/2}\,dx = 2" /> is finite even though the integrand blows up at 0.
          Conversely, <InlineMath math="\int_1^\infty 1/x\,dx = \infty" /> diverges despite the integrand
          going to 0. The rate of decay matters: <InlineMath math="1/x^p" /> converges for the same threshold
          at both ends (but with the inequality flipped). Never assume that a vanishing integrand
          guarantees convergence — the harmonic series is the prototypical counterexample.
        </p>
      </WarningBlock>

      <PythonCode
        title="Improper Integrals with SciPy"
        code={`import numpy as np
from scipy import integrate
import warnings

# ── p-integral: converges iff p > 1 ─────────────────────────────────────
print("p-integral ∫₁^∞ x^{-p} dx:")
for p in [0.5, 0.9, 1.0, 1.5, 2.0, 3.0]:
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            result, err = integrate.quad(lambda x: x**(-p), 1, np.inf)
        if p > 1:
            analytic = 1 / (p - 1)
            print(f"  p={p}: {result:.6f} (analytic: {analytic:.6f})")
        else:
            print(f"  p={p}: DIVERGES (scipy gives {result:.2f} with limit)")
    except Exception as e:
        print(f"  p={p}: {e}")

# ── Gamma function ────────────────────────────────────────────────────────
from scipy.special import gamma
print("\\nGamma function:")
for s in [0.5, 1.0, 1.5, 2.0, 3.0, 4.0]:
    numerical, _ = integrate.quad(lambda t: t**(s-1) * np.exp(-t), 0, np.inf)
    print(f"  Γ({s}) = {numerical:.6f} (scipy: {gamma(s):.6f})")

# ── Comparison test illustration ──────────────────────────────────────────
# Does ∫₁^∞ 1/(x² + sin²(x)) dx converge?
# Note: 0 < 1/(x²+sin²x) ≤ 1/x², and ∫1/x² converges
result, err = integrate.quad(lambda x: 1/(x**2 + np.sin(x)**2), 1, np.inf)
print(f"\\n∫₁^∞ 1/(x²+sin²x) dx ≈ {result:.6f} (converges by comparison with 1/x²)")`}
      />
    </div>
  );
}
