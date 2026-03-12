import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function HoeffdingViz() {
  const [t, setT] = useState(0.3);
  const [b, setB] = useState(1.0); // range [a,b] = [-b, b], width 2b

  const W = 340, H = 180;
  const nPts = 200;

  // Hoeffding bound for n i.i.d. in [-b, b]: P(X_bar - mu >= t) <= exp(-2n t^2 / (2b)^2)
  const hoeffding = (n) => Math.exp(-2 * n * t * t / (4 * b * b));

  // Chebyshev bound: P(X_bar - mu >= t) <= sigma^2/(n t^2), sigma^2 <= b^2
  const chebyshev = (n) => Math.min(1, b * b / (n * t * t));

  const maxN = 200;
  const xMin = 1, xMax = maxN;

  const toSvg = (n, y) => ({
    sx: ((n - xMin) / (xMax - xMin)) * (W - 20) + 10,
    sy: H - 15 - Math.max(0, Math.min(1, y)) * (H - 25),
  });

  const makePath = (fn) => {
    const pts = Array.from({ length: nPts }, (_, i) => {
      const n = 1 + (i / (nPts - 1)) * (maxN - 1);
      return toSvg(n, fn(n));
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Hoeffding vs Chebyshev Bound vs Sample Size
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="P(\bar{X}_n - \mu \geq t)" /> upper bound. Blue = Hoeffding (exponential). Red = Chebyshev (polynomial).
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={10} y1={H - 15} x2={W - 10} y2={H - 15} stroke="#9ca3af" strokeWidth={1} />
        <path d={makePath(chebyshev)} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3" />
        <path d={makePath(hoeffding)} fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth={2.5} />
        <text x={W - 15} y={20} fontSize={9} fill="#6366f1" textAnchor="end">Hoeffding</text>
        <text x={W - 15} y={34} fontSize={9} fill="#ef4444" textAnchor="end">Chebyshev</text>
        {/* n axis labels */}
        {[1, 50, 100, 150, 200].map(n => (
          <text key={n} x={toSvg(n, 0).sx} y={H - 3} fontSize={8} fill="#9ca3af" textAnchor="middle">{n}</text>
        ))}
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[{ l: 't (deviation)', v: t, s: setT, min: 0.05, max: 1.5, step: 0.05 },
          { l: 'b (half-range)', v: b, s: setB, min: 0.2, max: 3, step: 0.1 }].map(({ l, v, s, min, max, step }) => (
          <div key={l}>
            <div className="mb-1 flex justify-between text-xs"><span>{l}</span><span>{v.toFixed(2)}</span></div>
            <input type="range" min={min} max={max} step={step} value={v}
              onChange={e => s(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        At n=50: Hoeffding ≤ {hoeffding(50).toFixed(6)}, Chebyshev ≤ {chebyshev(50).toFixed(4)}
      </div>
    </div>
  );
}

export default function HoeffdingSection() {
  return (
    <div className="space-y-8">
      <HoeffdingViz />

      <DefinitionBlock
        label="Definition 8.2.1"
        title="Sub-Gaussian Random Variables"
        definition={
          "A centered random variable $X$ (with $E[X]=0$) is sub-Gaussian with parameter $\\sigma^2$ if " +
          "$E[e^{tX}] \\leq e^{\\sigma^2 t^2/2}$ for all $t \\in \\mathbb{R}$. " +
          "Equivalently: the tail decays at least as fast as a Gaussian: $P(|X| \\geq t) \\leq 2e^{-t^2/(2\\sigma^2)}$. " +
          "Examples: bounded r.v., Gaussian, Bernoulli (centered). " +
          "The sub-Gaussian property is preserved under addition of independent sub-Gaussian variables."
        }
        notation={
          "Orlicz norm: $\\|X\\|_{\\psi_2} = \\inf\\{C > 0: E[e^{X^2/C^2}] \\leq 2\\}$. " +
          "Sub-exponential: $E[e^{tX}] \\leq e^{\\nu^2 t^2/2}$ for $|t| \\leq 1/b$ (e.g., chi-squared, Poisson)."
        }
      />

      <DefinitionBlock
        label="Definition 8.2.2"
        title="Concentration Inequalities"
        definition={
          "Concentration inequalities bound the probability that a random variable deviates significantly from its mean. " +
          "Markov: $P(X \\geq t) \\leq E[X]/t$ (non-negative $X$). " +
          "Chebyshev: $P(|X-\\mu| \\geq t) \\leq \\sigma^2/t^2$ (polynomial tail). " +
          "Chernoff: $P(X \\geq t) \\leq \\inf_{s>0} e^{-st} M_X(s)$ (exponential tail). " +
          "Hoeffding: explicit exponential bound for bounded random variables (no variance needed)."
        }
      />

      <TheoremBlock
        label="Theorem 8.2.1"
        title="Hoeffding's Inequality"
        statement={
          "Let $X_1, \\ldots, X_n$ be independent with $X_i \\in [a_i, b_i]$ and $E[X_i] = \\mu_i$. " +
          "Then for any $t > 0$: " +
          "$P\\!\\left(\\sum_{i=1}^n (X_i - \\mu_i) \\geq t\\right) \\leq \\exp\\!\\left(-\\frac{2t^2}{\\sum_{i=1}^n (b_i - a_i)^2}\\right)$. " +
          "For i.i.d. $X_i \\in [a,b]$: $P(\\bar{X}_n - \\mu \\geq t) \\leq e^{-2nt^2/(b-a)^2}$."
        }
        proof={
          "Apply the Chernoff bound: for any $s > 0$, $P(S_n \\geq t) \\leq e^{-st} \\prod_i E[e^{s(X_i-\\mu_i)}]$. " +
          "Hoeffding's lemma: for $X \\in [a,b]$ centered, $E[e^{sX}] \\leq e^{s^2(b-a)^2/8}$. " +
          "Substitute and optimize over $s$: $s^* = 4t/\\sum(b_i-a_i)^2$."
        }
        corollaries={[
          "Bernstein's inequality: sharper for sub-exponential variables using variance: P(|X̄-μ|≥t) ≤ 2exp(-nt²/(2σ²+2bt/3)).",
          "McDiarmid's inequality (bounded differences): for functions satisfying the bounded differences condition, analogous exponential bound holds.",
        ]}
      />

      <ExampleBlock title="PAC Learning Sample Complexity">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          To guarantee that the empirical error is within <InlineMath math="\varepsilon" /> of true error
          with probability at least <InlineMath math="1-\delta" />, Hoeffding gives:
        </p>
        <BlockMath math="P(|\hat{R}(h) - R(h)| \geq \varepsilon) \leq 2e^{-2n\varepsilon^2} \leq \delta \implies n \geq \frac{\log(2/\delta)}{2\varepsilon^2}" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For <InlineMath math="\varepsilon = 0.05, \delta = 0.05" />: need <InlineMath math="n \geq 738" /> samples.
        </p>
      </ExampleBlock>

      <WarningBlock title="Hoeffding Ignores Variance — Bernstein Can Be Sharper">
        <p>
          Hoeffding's bound depends only on the range <InlineMath math="[a,b]" />, not on the variance.
          If <InlineMath math="\sigma^2 \ll (b-a)^2/4" /> (e.g., near-deterministic variables), Bernstein's
          inequality gives exponentially tighter bounds. For example, a Bernoulli(<InlineMath math="p" />)
          variable with small <InlineMath math="p" /> has range 1 but variance <InlineMath math="p(1-p) \approx p" />.
          Hoeffding gives <InlineMath math="e^{-2nt^2}" /> while Bernstein gives roughly{' '}
          <InlineMath math="e^{-nt^2/(2p)}" /> — much tighter when <InlineMath math="p \ll 1" />.
        </p>
      </WarningBlock>

      <PythonCode
        title="Concentration Inequalities"
        code={`import numpy as np
from scipy import stats

# ── Hoeffding's inequality ────────────────────────────────────────────────
def hoeffding_bound(t, n, a=0, b=1):
    """P(X_bar - mu >= t) <= exp(-2 n t^2 / (b-a)^2)."""
    return np.exp(-2 * n * t**2 / (b - a)**2)

print("Hoeffding bound vs sample size (t=0.1, X in [0,1]):")
for n in [50, 100, 200, 500, 1000]:
    bound = hoeffding_bound(0.1, n)
    print(f"  n={n:4d}: exp(-{2*n*0.01:.0f}) = {bound:.6f}")

# PAC sample complexity
def pac_sample_size(epsilon, delta):
    return int(np.ceil(np.log(2/delta) / (2*epsilon**2)))

print(f"\\nPAC sample complexity (Hoeffding):")
for eps, dlt in [(0.1, 0.1), (0.05, 0.05), (0.01, 0.01)]:
    n = pac_sample_size(eps, dlt)
    print(f"  ε={eps}, δ={dlt}: n ≥ {n}")

# ── Empirical validation ──────────────────────────────────────────────────
np.random.seed(42)
n, t, n_trials = 100, 0.1, 50000
# X_i ~ Uniform(0,1), mu=0.5
data = np.random.uniform(0, 1, (n_trials, n))
sample_means = data.mean(axis=1)
empirical_prob = np.mean(sample_means - 0.5 >= t)
bound = hoeffding_bound(t, n)
print(f"\\nHoeffding validation (n={n}, t={t}):")
print(f"  Empirical P(X̄ - 0.5 ≥ {t}) = {empirical_prob:.6f}")
print(f"  Hoeffding bound:              {bound:.6f}")
print(f"  Bound is valid: {bound >= empirical_prob}")

# ── Bernstein vs Hoeffding ────────────────────────────────────────────────
def bernstein_bound(t, n, sigma2, b):
    """Bernstein: P(X̄ - mu ≥ t) ≤ exp(-n t²/(2σ² + 2bt/3))."""
    return np.exp(-n * t**2 / (2*sigma2 + 2*b*t/3))

# Bernoulli(p=0.05) has sigma²=p(1-p)≈0.0475, b=1
p = 0.05
sigma2 = p * (1 - p)
t_test = 0.05
for n in [100, 500, 1000]:
    h = hoeffding_bound(t_test, n)
    bern = bernstein_bound(t_test, n, sigma2, b=1)
    print(f"  n={n}: Hoeffding={h:.4f}, Bernstein={bern:.4f} (sharper by {h/bern:.1f}x)")`}
      />
    </div>
  );
}
