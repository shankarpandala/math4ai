import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function PMFViz() {
  const [distType, setDistType] = useState('poisson');
  const [lambda, setLambda] = useState(3);
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.4);

  const factorial = (k) => k <= 1 ? 1 : k * factorial(k - 1);
  const binom = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));

  const maxK = distType === 'poisson' ? Math.max(15, Math.ceil(lambda * 2.5)) : n;
  const ks = Array.from({ length: maxK + 1 }, (_, k) => k);

  const pmf = distType === 'poisson'
    ? ks.map(k => Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k))
    : ks.map(k => k > n ? 0 : binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k));

  const mean = distType === 'poisson' ? lambda : n * p;
  const variance = distType === 'poisson' ? lambda : n * p * (1 - p);

  const W = 340, H = 180;
  const maxProb = Math.max(...pmf, 0.01);
  const barW = Math.max(4, (W - 40) / (maxK + 1) - 2);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">PMF Bar Chart</h3>
      <div className="mb-3 flex gap-3">
        {[['poisson', 'Poisson'], ['binomial', 'Binomial']].map(([k, label]) => (
          <button key={k} onClick={() => setDistType(k)}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${distType === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {label}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {ks.map((k, i) => {
          if (pmf[i] < 1e-6) return null;
          const bh = (pmf[i] / maxProb) * (H - 30);
          const bx = 25 + i * (barW + 2);
          return (
            <g key={k}>
              <rect x={bx} y={H - 20 - bh} width={barW} height={bh} fill="#6366f1" rx={1} opacity={0.8} />
              {barW > 8 && i % Math.max(1, Math.floor(maxK / 10)) === 0 && (
                <text x={bx + barW / 2} y={H - 5} fontSize={8} fill="#6b7280" textAnchor="middle">{k}</text>
              )}
            </g>
          );
        })}
        <line x1={20} y1={H - 20} x2={W} y2={H - 20} stroke="#9ca3af" strokeWidth={1} />
        {/* Mean line */}
        {(() => {
          const mx = 25 + mean * (barW + 2) + barW / 2;
          return <line x1={mx} y1={0} x2={mx} y2={H - 20} stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3" />;
        })()}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {distType === 'poisson' ? (
          <div>
            <div className="mb-1 flex justify-between text-xs"><span className="text-indigo-600">λ (mean)</span><span>{lambda}</span></div>
            <input type="range" min="0.5" max="12" step="0.5" value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ) : (
          <>
            <div>
              <div className="mb-1 flex justify-between text-xs"><span>n</span><span>{n}</span></div>
              <input type="range" min="1" max="20" step="1" value={n} onChange={e => setN(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs"><span>p</span><span>{p.toFixed(2)}</span></div>
              <input type="range" min="0.05" max="0.95" step="0.05" value={p} onChange={e => setP(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
            </div>
          </>
        )}
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm col-span-2">
          E[X] = {mean.toFixed(2)}, Var(X) = {variance.toFixed(2)}, SD = {Math.sqrt(variance).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default function DiscreteRVSection() {
  return (
    <div className="space-y-8">
      <PMFViz />

      <DefinitionBlock
        label="Definition 2.1.1"
        title="Discrete Random Variable"
        definition={
          "A random variable $X: \\Omega \\to \\mathbb{R}$ is discrete if it takes countably many values $\\{x_1, x_2, \\ldots\\}$. " +
          "Its probability mass function (PMF) is $p(x) = P(X = x)$ for each $x$ in the support, with " +
          "$p(x) \\geq 0$ and $\\sum_x p(x) = 1$. " +
          "The cumulative distribution function (CDF) is $F(x) = P(X \\leq x) = \\sum_{x_i \\leq x} p(x_i)$."
        }
        notation={
          "Expected value: $E[X] = \\sum_x x \\cdot p(x)$ (requires absolute convergence). " +
          "For function $g$: $E[g(X)] = \\sum_x g(x) p(x)$ (law of the unconscious statistician)."
        }
      />

      <DefinitionBlock
        label="Definition 2.1.2"
        title="Variance and Standard Deviation"
        definition={
          "The variance of $X$ is $\\text{Var}(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2$. " +
          "It measures spread around the mean. Standard deviation $\\sigma = \\sqrt{\\text{Var}(X)}$ has the same units as $X$. " +
          "Key properties: $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$; " +
          "for independent $X, Y$: $\\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y)$."
        }
      />

      <TheoremBlock
        label="Theorem 2.1.1"
        title="Markov and Chebyshev Inequalities"
        statement={
          "Markov: For non-negative $X$ and $a > 0$: $P(X \\geq a) \\leq E[X]/a$. " +
          "Chebyshev: For any $X$ with finite variance and $k > 0$: " +
          "$P(|X - E[X]| \\geq k\\sigma) \\leq 1/k^2$. " +
          "Chebyshev bounds hold for all distributions with finite variance."
        }
        proof={
          "Markov: $E[X] = \\sum_x x p(x) \\geq \\sum_{x \\geq a} x p(x) \\geq a \\sum_{x \\geq a} p(x) = a P(X \\geq a)$. " +
          "Chebyshev: apply Markov to $Y = (X - \\mu)^2$ with $a = k^2 \\sigma^2$: " +
          "$P(Y \\geq k^2\\sigma^2) \\leq E[Y]/(k^2\\sigma^2) = \\sigma^2/(k^2\\sigma^2) = 1/k^2$."
        }
      />

      <ExampleBlock title="Poisson Distribution as Limit of Binomial">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <InlineMath math="\text{Bin}(n, \lambda/n) \to \text{Poisson}(\lambda)" /> as <InlineMath math="n \to \infty" />.
        </p>
        <BlockMath math="P(X=k) = \binom{n}{k}\left(\frac{\lambda}{n}\right)^k\left(1-\frac{\lambda}{n}\right)^{n-k} \xrightarrow{n\to\infty} \frac{e^{-\lambda}\lambda^k}{k!}" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Models rare events: radioactive decays, web requests, typos per page.
          For Poisson: <InlineMath math="E[X] = \text{Var}(X) = \lambda" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="E[g(X)] ≠ g(E[X]) in General">
        <p>
          Jensen's inequality: for convex <InlineMath math="g" />, <InlineMath math="E[g(X)] \geq g(E[X])" />.
          Example: <InlineMath math="E[X^2] \geq (E[X])^2" /> (variance is non-negative). For concave{' '}
          <InlineMath math="g" /> (like <InlineMath math="\sqrt{\cdot}" /> or <InlineMath math="\log" />),
          the inequality reverses. This has major consequences: the average of squared errors is not the
          square of average errors; expected utility theory differs from expected value theory in economics.
        </p>
      </WarningBlock>

      <PythonCode
        title="Discrete Distributions with NumPy and SciPy"
        code={`import numpy as np
from scipy import stats

# ── Poisson distribution ──────────────────────────────────────────────────
lam = 3
X = stats.poisson(mu=lam)
print(f"Poisson(λ=3):")
print(f"  E[X] = {X.mean():.4f} (should be {lam})")
print(f"  Var(X) = {X.var():.4f} (should be {lam})")
print(f"  PMF at k=0..5: {[X.pmf(k) for k in range(6)]}")

# ── Binomial distribution ─────────────────────────────────────────────────
n, p = 10, 0.4
Y = stats.binom(n=n, p=p)
print(f"\\nBinomial(n=10, p=0.4):")
print(f"  E[Y] = {Y.mean():.4f} (should be {n*p:.4f})")
print(f"  Var(Y) = {Y.var():.4f} (should be {n*p*(1-p):.4f})")

# Poisson approximation to Binomial
n_large, p_small = 100, 0.03  # n*p = 3
Z_binom = stats.binom(n=n_large, p=p_small)
Z_poisson = stats.poisson(mu=n_large*p_small)
print(f"\\nPoisson approx: Bin(100, 0.03) vs Poisson(3)")
for k in range(8):
    print(f"  k={k}: Binom={Z_binom.pmf(k):.5f}, Poisson={Z_poisson.pmf(k):.5f}")

# ── Chebyshev bound verification ──────────────────────────────────────────
lam_test = 4
X_test = stats.poisson(mu=lam_test)
k_vals = np.arange(0, 25)
sigma = np.sqrt(lam_test)
for k_sigma in [1, 2, 3]:
    actual = 1 - X_test.cdf(lam_test + k_sigma*sigma) + X_test.cdf(lam_test - k_sigma*sigma - 1)
    bound = 1 / k_sigma**2
    print(f"  P(|X-λ|≥{k_sigma}σ): actual={actual:.4f}, Chebyshev≤{bound:.4f}")`}
      />
    </div>
  );
}
