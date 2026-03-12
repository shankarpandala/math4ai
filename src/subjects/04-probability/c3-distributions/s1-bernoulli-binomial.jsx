import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function CoinFlipSim() {
  const [p, setP] = useState(0.5);
  const [n, setN] = useState(20);
  const [flips, setFlips] = useState([]);
  const [hist, setHist] = useState(Array(21).fill(0));

  const flip = () => {
    const newFlips = Array.from({ length: n }, () => Math.random() < p ? 1 : 0);
    const heads = newFlips.reduce((a, b) => a + b, 0);
    setFlips(newFlips);
    setHist(prev => {
      const next = [...prev];
      if (heads < next.length) next[heads]++;
      return next;
    });
  };

  const reset = () => { setFlips([]); setHist(Array(21).fill(0)); };
  const total = hist.reduce((a, b) => a + b, 0);
  const maxH = Math.max(...hist, 1);
  const binom = (k) => {
    const bk = (n, k) => {
      if (k < 0 || k > n) return 0;
      let r = 1;
      for (let i = 0; i < k; i++) r *= (n - i) / (i + 1);
      return r;
    };
    return bk(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Coin Flip Simulator: Binomial Distribution
      </h3>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>p (heads prob)</span><span>{p.toFixed(2)}</span></div>
          <input type="range" min="0.05" max="0.95" step="0.05" value={p}
            onChange={e => { setP(parseFloat(e.target.value)); reset(); }} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>n (flips per trial)</span><span>{n}</span></div>
          <input type="range" min="5" max="20" step="1" value={n}
            onChange={e => { setN(parseInt(e.target.value)); reset(); }} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="mb-3 flex gap-3">
        <button onClick={flip} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white">Flip {n} Coins</button>
        <button onClick={() => { for (let i = 0; i < 100; i++) { const h = Array.from({length: n}, () => Math.random() < p ? 1 : 0).reduce((a,b)=>a+b,0); setHist(prev => { const next=[...prev]; if(h<next.length) next[h]++; return next; }); }}} className="rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium">+100 trials</button>
        <button onClick={reset} className="rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium">Reset</button>
      </div>
      {flips.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {flips.map((f, i) => (
            <span key={i} className={`rounded px-1.5 py-0.5 text-xs font-bold ${f ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
              {f ? 'H' : 'T'}
            </span>
          ))}
        </div>
      )}
      <svg width={340} height={150} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {Array.from({ length: n + 1 }, (_, k) => {
          const bx = 10 + k * (320 / (n + 1));
          const bw = Math.max(2, 280 / (n + 2));
          const theorH = (binom(k) * 100) / maxH * 120;
          const obsH = total > 0 ? (hist[k] / (maxH)) * 120 : 0;
          return (
            <g key={k}>
              <rect x={bx} y={130 - obsH} width={bw} height={obsH} fill="rgba(99,102,241,0.7)" />
              <rect x={bx} y={130 - theorH} width={bw} height={2} fill="#ef4444" />
            </g>
          );
        })}
        <line x1={5} y1={130} x2={335} y2={130} stroke="#9ca3af" strokeWidth={1} />
      </svg>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Blue bars = observed frequency. Red lines = theoretical Binomial({n}, {p.toFixed(2)}) PMF. Trials: {total}
      </p>
    </div>
  );
}

export default function BernoulliBinomialSection() {
  return (
    <div className="space-y-8">
      <CoinFlipSim />

      <DefinitionBlock
        label="Definition 3.1.1"
        title="Bernoulli and Binomial Distributions"
        definition={
          "Bernoulli$(p)$: $X \\in \\{0,1\\}$, $P(X=1) = p$, $P(X=0) = 1-p$. " +
          "$E[X] = p$, $\\text{Var}(X) = p(1-p)$. Models a single binary trial. " +
          "Binomial$(n,p)$: $X = \\sum_{i=1}^n X_i$ where $X_i \\overset{iid}{\\sim} \\text{Bern}(p)$. " +
          "PMF: $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$ for $k = 0,1,\\ldots,n$. " +
          "$E[X] = np$, $\\text{Var}(X) = np(1-p)$."
        }
        notation={
          "The binomial coefficient $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ counts the number of ways to choose $k$ successes from $n$ trials."
        }
      />

      <DefinitionBlock
        label="Definition 3.1.2"
        title="Normal Approximation to Binomial"
        definition={
          "For large $n$, by the Central Limit Theorem: " +
          "$\\frac{X - np}{\\sqrt{np(1-p)}} \\overset{d}{\\to} N(0,1)$ as $n \\to \\infty$. " +
          "Continuity correction improves the approximation: " +
          "$P(X \\leq k) \\approx \\Phi\\!\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right)$. " +
          "Rule of thumb: normal approximation is adequate when $np \\geq 5$ and $n(1-p) \\geq 5$."
        }
      />

      <TheoremBlock
        label="Theorem 3.1.1"
        title="Binomial Coefficient and Pascal's Rule"
        statement={
          "For $0 \\leq k \\leq n$: $\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$ (Pascal's rule). " +
          "Binomial theorem: $(x+y)^n = \\sum_{k=0}^n \\binom{n}{k} x^k y^{n-k}$. " +
          "Consequence: $\\sum_{k=0}^n \\binom{n}{k} p^k (1-p)^{n-k} = (p + (1-p))^n = 1$ (PMF sums to 1)."
        }
        proof={
          "Pascal's rule: $\\binom{n}{k} + \\binom{n}{k+1} = \\frac{n!}{k!(n-k)!} + \\frac{n!}{(k+1)!(n-k-1)!}$ " +
          "$= \\frac{n!(k+1) + n!(n-k)}{(k+1)!(n-k)!} = \\frac{n!(n+1)}{(k+1)!(n-k)!} = \\binom{n+1}{k+1}$. " +
          "Binomial theorem: expand $(x+y)^n$ by picking $k$ copies of $x$ from $n$ factors."
        }
      />

      <ExampleBlock title="Quality Control: Acceptance Sampling">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          A batch has 5% defective items. Sample 20. What is the probability of 2 or fewer defects?
        </p>
        <BlockMath math="P(X \leq 2) = \sum_{k=0}^{2} \binom{20}{k} (0.05)^k (0.95)^{20-k} \approx 0.358 + 0.377 + 0.189 = 0.925" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          With <InlineMath math="n=20, p=0.05" />: there's a 92.5% chance of accepting the batch if the threshold is 2 defects.
        </p>
      </ExampleBlock>

      <WarningBlock title="Binomial Requires Independent Trials">
        <p>
          The binomial model requires that each trial is <em>independent</em> and has the same probability
          <InlineMath math="p" />. If sampling without replacement from a finite population, use the
          hypergeometric distribution instead. If <InlineMath math="p" /> varies across trials (e.g., a
          sequence of biased coins with changing bias), the Poisson-binomial distribution applies.
          In neural networks, Bernoulli dropout is approximately binomial only when neurons are dropped
          independently.
        </p>
      </WarningBlock>

      <PythonCode
        title="Binomial Distribution Analysis"
        code={`import numpy as np
from scipy import stats

# ── Binomial PMF and CDF ──────────────────────────────────────────────────
n, p = 20, 0.3
X = stats.binom(n=n, p=p)

print(f"Binomial(n={n}, p={p}):")
print(f"  E[X] = {X.mean():.4f}, Var(X) = {X.var():.4f}")
print(f"  P(X=6) = {X.pmf(6):.6f}")
print(f"  P(X≤8) = {X.cdf(8):.6f}")
print(f"  P(4≤X≤8) = {X.cdf(8) - X.cdf(3):.6f}")

# ── Normal approximation with continuity correction ───────────────────────
mu, sigma = n*p, np.sqrt(n*p*(1-p))
Z = stats.norm(mu, sigma)
exact = X.cdf(8)
approx_no_cc = Z.cdf(8)
approx_cc = Z.cdf(8.5)  # continuity correction
print(f"\\nP(X≤8): exact={exact:.6f}, no CC={approx_no_cc:.6f}, with CC={approx_cc:.6f}")

# ── Monte Carlo simulation ────────────────────────────────────────────────
np.random.seed(42)
trials = 100000
samples = np.random.binomial(n=n, p=p, size=trials)
print(f"\\nMonte Carlo (n={trials}):")
print(f"  Sample mean: {samples.mean():.4f} (true: {n*p})")
print(f"  Sample var:  {samples.var():.4f} (true: {n*p*(1-p):.4f})")
print(f"  P(X≤8) est:  {(samples <= 8).mean():.4f}")

# ── Binomial coefficient via scipy ────────────────────────────────────────
from scipy.special import comb
for k in range(6):
    print(f"  C({n},{k}) = {int(comb(n,k,exact=True))}")`}
      />
    </div>
  );
}
