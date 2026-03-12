import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function MomentCalculator() {
  const [dataStr, setDataStr] = useState('1 2 3 4 5 6 7 8 9 10');

  const data = dataStr.split(/[\s,]+/).map(Number).filter(x => !isNaN(x));
  const n = data.length;

  const mean = n > 0 ? data.reduce((a, b) => a + b, 0) / n : 0;
  const m2 = n > 0 ? data.reduce((a, x) => a + (x - mean) ** 2, 0) / n : 0;
  const m3 = n > 0 ? data.reduce((a, x) => a + (x - mean) ** 3, 0) / n : 0;
  const m4 = n > 0 ? data.reduce((a, x) => a + (x - mean) ** 4, 0) / n : 0;
  const std = Math.sqrt(m2);
  const skewness = std > 0 ? m3 / std ** 3 : 0;
  const kurtosis = m2 > 0 ? m4 / m2 ** 2 - 3 : 0; // excess kurtosis

  const W = 340, H = 120;
  const minD = Math.min(...data), maxD = Math.max(...data);
  const range = maxD - minD || 1;
  const nBins = Math.min(10, Math.max(3, Math.ceil(Math.sqrt(n))));
  const bins = Array.from({ length: nBins }, (_, i) => {
    const lo = minD + (i / nBins) * range;
    const hi = minD + ((i + 1) / nBins) * range + 0.001;
    return { lo, hi, count: data.filter(x => x >= lo && x < hi).length };
  });
  const maxCount = Math.max(...bins.map(b => b.count), 1);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Sample Moment Calculator
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">Enter numbers separated by spaces:</p>
      <input type="text" value={dataStr} onChange={e => setDataStr(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-mono mb-3" />
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3">
        {bins.map(({ lo, hi, count }, i) => {
          const bw = (W - 20) / nBins - 2;
          const bx = 10 + i * ((W - 20) / nBins);
          const bh = (count / maxCount) * (H - 20);
          return <rect key={i} x={bx} y={H - 15 - bh} width={bw} height={bh} fill="#6366f1" opacity={0.7} rx={1} />;
        })}
        {n > 0 && (() => {
          const mx = 10 + ((mean - minD) / range) * (W - 20);
          return <line x1={mx} y1={0} x2={mx} y2={H - 15} stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3" />;
        })()}
        <line x1={10} y1={H - 15} x2={W - 10} y2={H - 15} stroke="#9ca3af" strokeWidth={1} />
      </svg>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          ['n', n], ['Mean (μ)', mean.toFixed(4)], ['Variance (σ²)', m2.toFixed(4)],
          ['Std dev (σ)', std.toFixed(4)], ['Skewness', skewness.toFixed(4)], ['Excess Kurtosis', kurtosis.toFixed(4)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">{k}</p>
            <p className="font-mono font-bold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MomentsSection() {
  return (
    <div className="space-y-8">
      <MomentCalculator />

      <DefinitionBlock
        label="Definition 4.1.1"
        title="Moments and Central Moments"
        definition={
          "The $k$-th raw moment of $X$ is $\\mu_k' = E[X^k]$ (when finite). " +
          "The $k$-th central moment is $\\mu_k = E[(X - \\mu)^k]$ where $\\mu = E[X]$. " +
          "Specifically: $\\mu_1 = 0$, $\\mu_2 = \\text{Var}(X)$ (variance), " +
          "$\\mu_3/\\sigma^3$ is skewness (asymmetry), $\\mu_4/\\sigma^4 - 3$ is excess kurtosis (tail heaviness, 0 for Gaussian). " +
          "Relationship: $\\mu_2 = \\mu_2' - (\\mu_1')^2 = E[X^2] - (E[X])^2$."
        }
        notation={
          "Positive skewness: long right tail (lognormal, Poisson). Negative skewness: long left tail. " +
          "Excess kurtosis $> 0$: heavy tails (Student-t, Laplace). $< 0$: light tails (uniform)."
        }
      />

      <DefinitionBlock
        label="Definition 4.1.2"
        title="Cumulants"
        definition={
          "Cumulants $\\kappa_n$ are defined via the cumulant generating function $K(t) = \\log E[e^{tX}]$ by " +
          "$K(t) = \\sum_{n=1}^\\infty \\kappa_n \\frac{t^n}{n!}$. " +
          "First cumulants: $\\kappa_1 = E[X]$ (mean), $\\kappa_2 = \\text{Var}(X)$, " +
          "$\\kappa_3 = \\mu_3$ (third central moment), $\\kappa_4 = \\mu_4 - 3\\sigma^4$ (excess kurtosis times $\\sigma^4$). " +
          "Key property: for independent $X, Y$: $\\kappa_n(X+Y) = \\kappa_n(X) + \\kappa_n(Y)$ (cumulants add)."
        }
      />

      <TheoremBlock
        label="Theorem 4.1.1"
        title="Moments and Distributions"
        statement={
          "If all moments $E[|X|^k] < \\infty$ for all $k \\geq 1$, and the moment sequence $(\\mu_k')$ determines a unique distribution (Carleman's condition: $\\sum_k (\\mu_{2k}')^{-1/(2k)} = \\infty$), " +
          "then the distribution of $X$ is uniquely determined by its moments. " +
          "The Gaussian is the unique distribution with $\\kappa_n = 0$ for all $n \\geq 3$."
        }
        proof={
          "Uniqueness: assume $F$ and $G$ have the same moments. Then all polynomials $\\int p(x)\\,dF = \\int p(x)\\,dG$. " +
          "By Weierstrass approximation and Carleman's condition, this extends to all continuous bounded functions, " +
          "so $F = G$ by the portmanteau theorem."
        }
      />

      <ExampleBlock title="Skewness and Kurtosis of Common Distributions">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          A summary of moment properties:
        </p>
        <BlockMath math="\text{Normal}(0,1): \text{skew}=0, \text{kurt}=0" />
        <BlockMath math="\text{Exp}(\lambda): \text{skew}=2, \text{kurt}=6" />
        <BlockMath math="\text{Student-}t(\nu): \text{kurt}=6/(\nu-4) \text{ for } \nu > 4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Heavy-tailed distributions (high kurtosis) model financial returns and natural language word frequencies better than the Gaussian.
        </p>
      </ExampleBlock>

      <WarningBlock title="Sample Moments Are Biased Estimators">
        <p>
          The sample mean <InlineMath math="\bar{X}" /> is unbiased for <InlineMath math="\mu" />, but
          the sample variance <InlineMath math="s^2 = \frac{1}{n}\sum(X_i - \bar{X})^2" /> is biased —
          use <InlineMath math="\hat{\sigma}^2 = \frac{1}{n-1}\sum(X_i - \bar{X})^2" /> (Bessel's correction).
          Sample skewness and kurtosis are even more biased for small <InlineMath math="n" /> and require
          bias correction. Never report raw sample kurtosis without adjusting for sample size bias
          (especially for <InlineMath math="n < 50" />).
        </p>
      </WarningBlock>

      <PythonCode
        title="Computing Moments and Cumulants"
        code={`import numpy as np
from scipy import stats

# ── Sample moments ─────────────────────────────────────────────────────────
np.random.seed(42)
data = np.random.exponential(scale=2.0, size=10000)

mean = np.mean(data)
var = np.var(data, ddof=0)   # biased
var_u = np.var(data, ddof=1)  # unbiased
m3 = np.mean((data - mean)**3)
m4 = np.mean((data - mean)**4)
skew = m3 / var**1.5
kurt_excess = m4 / var**2 - 3

print(f"Exp(0.5) — true values: mean=2, var=4, skew=2, kurt=6")
print(f"Sample (n=10000):")
print(f"  mean={mean:.4f}, var(biased)={var:.4f}, var(unbiased)={var_u:.4f}")
print(f"  skewness={skew:.4f}, excess kurtosis={kurt_excess:.4f}")

# scipy's stats.describe
desc = stats.describe(data)
print(f"\\nscipy describe:")
print(f"  skewness={desc.skewness:.4f}, kurtosis={desc.kurtosis:.4f}")

# ── Cumulants ─────────────────────────────────────────────────────────────
# For Exp(λ): κ_n = (n-1)! / λ^n
lam = 0.5
print(f"\\nCumulants of Exp(λ=0.5):")
for n in range(1, 5):
    kappa_n = np.math.factorial(n - 1) / lam**n
    print(f"  κ_{n} = {kappa_n:.4f}")

# Independence: cumulants add for independent RVs
X = np.random.exponential(2.0, 10000)
Y = np.random.exponential(3.0, 10000)
S = X + Y  # Sum of independents
print(f"\\nCumulant additivity: X~Exp(0.5), Y~Exp(1/3), S=X+Y")
print(f"  E[X]+E[Y] = {np.mean(X):.2f}+{np.mean(Y):.2f} = {np.mean(X)+np.mean(Y):.2f} ≈ E[S]={np.mean(S):.2f}")
print(f"  Var(X)+Var(Y) = {np.var(X):.2f}+{np.var(Y):.2f} = {np.var(X)+np.var(Y):.2f} ≈ Var(S)={np.var(S):.2f}")`}
      />
    </div>
  );
}
