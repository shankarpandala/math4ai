import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function LLNViz() {
  const [samples, setSamples] = useState([]);
  const [dist, setDist] = useState('normal');
  const mu = { normal: 0, exponential: 1, bernoulli: 0.5 }[dist];

  const lcg = (() => {
    let s = Date.now() & 0xffff;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  })();

  const sampleFrom = (n) => Array.from({ length: n }, () => {
    const u = lcg();
    if (dist === 'normal') {
      const u2 = lcg();
      return Math.sqrt(-2 * Math.log(Math.max(u, 1e-10))) * Math.cos(2 * Math.PI * u2);
    }
    if (dist === 'exponential') return -Math.log(Math.max(u, 1e-10));
    return u < 0.5 ? 0 : 1;
  });

  const addSamples = (n) => {
    const newSamples = sampleFrom(n);
    setSamples(prev => [...prev, ...newSamples]);
  };
  const reset = () => setSamples([]);

  const runningAvg = samples.reduce((acc, x, i) => {
    acc.push((acc.length > 0 ? acc[acc.length - 1] * i + x : x) / (i + 1));
    return acc;
  }, []);

  const W = 340, H = 180;
  const n = samples.length;
  const yMin = mu - 2, yMax = mu + 2;
  const toSvg = (i, y) => ({
    sx: n > 1 ? (i / (n - 1)) * W : W / 2,
    sy: H - 15 - ((Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * (H - 25),
  });

  const avgPath = runningAvg.map(({ }, i) => {
    const { sx, sy } = toSvg(i, runningAvg[i]);
    return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(' ');

  const muY = toSvg(0, mu).sy;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Law of Large Numbers: Running Average Convergence
      </h3>
      <div className="mb-3 flex flex-wrap gap-2">
        {[['normal', 'N(0,1)'], ['exponential', 'Exp(1)'], ['bernoulli', 'Bern(0.5)']].map(([k, v]) => (
          <button key={k} onClick={() => { setDist(k); reset(); }}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${dist === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {v}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3">
        <line x1={0} y1={muY} x2={W} y2={muY} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6,4" />
        {n > 0 && <path d={avgPath} fill="none" stroke="#6366f1" strokeWidth={2} />}
        <text x={W - 5} y={muY - 4} fontSize={10} fill="#ef4444" textAnchor="end">μ={mu}</text>
        {n > 0 && <text x={5} y={15} fontSize={10} fill="#6366f1">X̄_n = {runningAvg[runningAvg.length-1]?.toFixed(4)}</text>}
      </svg>
      <div className="flex gap-3 flex-wrap">
        {[10, 100, 1000].map(k => (
          <button key={k} onClick={() => addSamples(k)}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white">
            +{k}
          </button>
        ))}
        <button onClick={reset} className="rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm">Reset</button>
        <span className="self-center text-xs text-gray-500">n = {n}</span>
      </div>
    </div>
  );
}

export default function LLNSection() {
  return (
    <div className="space-y-8">
      <LLNViz />

      <DefinitionBlock
        label="Definition 5.1.1"
        title="Weak Law of Large Numbers"
        definition={
          "Let $X_1, X_2, \\ldots$ be i.i.d. with $E[|X_1|] < \\infty$ and $\\mu = E[X_1]$. " +
          "The sample mean $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i$ converges in probability to $\\mu$: " +
          "for any $\\varepsilon > 0$, $P(|\\bar{X}_n - \\mu| > \\varepsilon) \\to 0$ as $n \\to \\infty$. " +
          "Notation: $\\bar{X}_n \\xrightarrow{P} \\mu$."
        }
        notation={
          "Convergence in probability ($\\xrightarrow{P}$) is weaker than almost sure convergence ($\\xrightarrow{a.s.}$). " +
          "The Strong LLN states $\\bar{X}_n \\xrightarrow{a.s.} \\mu$: the average equals $\\mu$ eventually with probability 1."
        }
      />

      <DefinitionBlock
        label="Definition 5.1.2"
        title="Chebyshev's Inequality"
        definition={
          "For any random variable $X$ with finite variance $\\sigma^2$: " +
          "$P(|X - \\mu| \\geq k) \\leq \\sigma^2 / k^2$ for any $k > 0$. " +
          "Applied to $\\bar{X}_n$: $\\text{Var}(\\bar{X}_n) = \\sigma^2/n$, so " +
          "$P(|\\bar{X}_n - \\mu| \\geq \\varepsilon) \\leq \\sigma^2/(n\\varepsilon^2) \\to 0$."
        }
      />

      <TheoremBlock
        label="Theorem 5.1.1"
        title="Strong Law of Large Numbers (SLLN)"
        statement={
          "Let $X_1, X_2, \\ldots$ be i.i.d. with $E[|X_1|] < \\infty$. Then " +
          "$P\\!\\left(\\lim_{n\\to\\infty} \\bar{X}_n = \\mu\\right) = 1$, " +
          "i.e., $\\bar{X}_n \\to \\mu$ almost surely."
        }
        proof={
          "The full proof uses the Borel-Cantelli lemma. Sketch: " +
          "WLOG $\\mu = 0$. Truncate $X_k$ to $Y_k = X_k \\mathbf{1}_{|X_k| \\leq k}$. " +
          "Show $\\sum_k \\text{Var}(Y_k)/k^2 < \\infty$ (using $E[|X|] < \\infty$). " +
          "Apply the Kolmogorov maximal inequality and the Kronecker lemma."
        }
        corollaries={[
          "Monte Carlo integration: for $f$ with $E[|f(X)|] < \\infty$, $\\frac{1}{n}\\sum_i f(X_i) \\xrightarrow{a.s.} E[f(X)]$.",
          "Sample variance converges: $s_n^2 = \\frac{1}{n}\\sum(X_i-\\bar{X}_n)^2 \\xrightarrow{a.s.} \\sigma^2$.",
        ]}
      />

      <ExampleBlock title="Monte Carlo Integration via LLN">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Estimate <InlineMath math="\pi" /> using the LLN. Sample <InlineMath math="(U_1, U_2) \sim \text{Uniform}([0,1]^2)" />.
        </p>
        <BlockMath math="E[\mathbf{1}_{U_1^2+U_2^2 \leq 1}] = P(U_1^2+U_2^2\leq 1) = \pi/4" />
        <BlockMath math="\hat{\pi} = \frac{4}{n}\sum_{i=1}^n \mathbf{1}_{U_{1,i}^2+U_{2,i}^2\leq 1} \xrightarrow{a.s.} \pi" />
      </ExampleBlock>

      <WarningBlock title="LLN Requires Finite Expectation">
        <p>
          The LLN fails without <InlineMath math="E[|X|] < \infty" />. For a Cauchy distribution
          (which has no mean), the sample average does not converge — in fact,{' '}
          <InlineMath math="\bar{X}_n" /> has the same Cauchy distribution for all <InlineMath math="n" />.
          Similarly, for <InlineMath math="X \sim \text{Pareto}(\alpha)" /> with <InlineMath math="\alpha \leq 1" />,
          the mean is infinite and the LLN does not apply. Always check moment conditions before
          applying LLN-based arguments.
        </p>
      </WarningBlock>

      <PythonCode
        title="Law of Large Numbers Demonstration"
        code={`import numpy as np
from scipy import stats

np.random.seed(42)

# ── Weak LLN: Chebyshev bound ─────────────────────────────────────────────
mu, sigma2 = 2.0, 4.0
epsilon = 0.1

for n in [10, 100, 1000, 10000]:
    chebyshev_bound = sigma2 / (n * epsilon**2)
    samples = np.random.normal(mu, np.sqrt(sigma2), (1000, n))
    sample_means = samples.mean(axis=1)
    empirical_prob = np.mean(np.abs(sample_means - mu) > epsilon)
    print(f"n={n:5d}: P(|X̄-μ|>{epsilon}) ≤ {chebyshev_bound:.4f}, empirical={empirical_prob:.4f}")

# ── Strong LLN: running average ───────────────────────────────────────────
print("\\nRunning average convergence:")
n_total = 10000
X = np.random.exponential(1.0, n_total)  # Exp(1), mean=1
running_mean = np.cumsum(X) / np.arange(1, n_total+1)
for n in [10, 100, 1000, 10000]:
    print(f"  n={n:5d}: X̄_n = {running_mean[n-1]:.6f}")

# ── Monte Carlo π estimation ──────────────────────────────────────────────
ns = [100, 1000, 10000, 100000]
for n in ns:
    U1, U2 = np.random.uniform(0,1,n), np.random.uniform(0,1,n)
    pi_est = 4 * np.mean(U1**2 + U2**2 <= 1)
    print(f"  n={n:6d}: π ≈ {pi_est:.5f} (error: {abs(pi_est-np.pi):.5f})")

# ── LLN fails for Cauchy ──────────────────────────────────────────────────
print("\\nCauchy distribution (no mean): sample averages do NOT converge")
for n in [100, 1000, 10000]:
    X_cauchy = stats.cauchy.rvs(size=n)
    print(f"  n={n:5d}: X̄_n = {X_cauchy.mean():.2f} (should converge for any dist with finite mean)")`}
      />
    </div>
  );
}
