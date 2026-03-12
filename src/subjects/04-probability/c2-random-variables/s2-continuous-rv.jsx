import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const DISTS = {
  normal: { label: 'Normal', params: [{ name: 'μ', min: -3, max: 3, step: 0.1, def: 0 }, { name: 'σ', min: 0.3, max: 3, step: 0.1, def: 1 }] },
  exponential: { label: 'Exponential', params: [{ name: 'λ', min: 0.2, max: 5, step: 0.1, def: 1 }] },
};

function PDFCDFViz() {
  const [dist, setDist] = useState('normal');
  const [params, setParams] = useState({ μ: 0, σ: 1, λ: 1 });

  const pdf = (x) => {
    if (dist === 'normal') {
      const { μ, σ } = params;
      return (1 / (σ * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - μ) / σ) ** 2);
    }
    if (dist === 'exponential') {
      const { λ } = params;
      return x < 0 ? 0 : λ * Math.exp(-λ * x);
    }
    return 0;
  };

  const erfApprox = (x) => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    const e = 1 - poly * Math.exp(-x * x);
    return x >= 0 ? e : -e;
  };

  const cdf = (x) => {
    if (dist === 'normal') {
      const { μ, σ } = params;
      return 0.5 * (1 + erfApprox((x - μ) / (σ * Math.sqrt(2))));
    }
    if (dist === 'exponential') {
      const { λ } = params;
      return x < 0 ? 0 : 1 - Math.exp(-λ * x);
    }
    return 0;
  };

  const xMin = dist === 'normal' ? params.μ - 4 * params.σ : -0.2;
  const xMax = dist === 'normal' ? params.μ + 4 * params.σ : 5 / Math.max(params.λ, 0.5);
  const W = 340, H = 180;
  const nPts = 300;

  const pdfMax = Math.max(...Array.from({ length: nPts }, (_, i) => pdf(xMin + (i / nPts) * (xMax - xMin))));

  const makePath = (yfn, yMin, yMax) => {
    const pts = Array.from({ length: nPts + 1 }, (_, i) => {
      const x = xMin + (i / nPts) * (xMax - xMin);
      const y = yfn(x);
      const sx = (i / nPts) * W;
      const sy = H - ((Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * H;
      return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
    });
    return pts.join(' ');
  };

  const pdfPath = makePath(pdf, 0, pdfMax * 1.1);
  const cdfPath = makePath(cdf, 0, 1.05);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">PDF & CDF Visualizer</h3>
      <div className="mb-3 flex gap-3">
        {Object.entries(DISTS).map(([k, v]) => (
          <button key={k} onClick={() => setDist(k)}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${dist === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PDF</p>
          <svg width={W/2} height={H} className="rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <path d={pdfPath} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth={2} />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CDF</p>
          <svg width={W/2} height={H} className="rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <path d={cdfPath} fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth={2} />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {DISTS[dist].params.map(({ name, min, max, step }) => (
          <div key={name}>
            <div className="mb-1 flex justify-between text-xs"><span className="font-mono">{name}</span><span>{params[name]?.toFixed(2)}</span></div>
            <input type="range" min={min} max={max} step={step} value={params[name] ?? 1}
              onChange={e => setParams(p => ({ ...p, [name]: parseFloat(e.target.value) }))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContinuousRVSection() {
  return (
    <div className="space-y-8">
      <PDFCDFViz />

      <DefinitionBlock
        label="Definition 2.2.1"
        title="Continuous Random Variable"
        definition={
          "A random variable $X$ is continuous if there exists a non-negative function $f: \\mathbb{R} \\to [0,\\infty)$ (the PDF) such that " +
          "$P(a \\leq X \\leq b) = \\int_a^b f(x)\\,dx$ for all $a \\leq b$. " +
          "The PDF satisfies $\\int_{-\\infty}^\\infty f(x)\\,dx = 1$. " +
          "The CDF is $F(x) = P(X \\leq x) = \\int_{-\\infty}^x f(t)\\,dt$, and $F'(x) = f(x)$ wherever $f$ is continuous."
        }
        notation={
          "For continuous $X$: $P(X = a) = 0$ for all $a$ (singletons have measure zero). " +
          "Expectation: $E[X] = \\int_{-\\infty}^\\infty x f(x)\\,dx$. " +
          "Variance: $\\text{Var}(X) = \\int_{-\\infty}^\\infty (x - \\mu)^2 f(x)\\,dx = E[X^2] - (E[X])^2$."
        }
      />

      <DefinitionBlock
        label="Definition 2.2.2"
        title="Standard Normal and Gaussian Family"
        definition={
          "The standard normal $Z \\sim N(0,1)$ has PDF $\\phi(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-z^2/2}$. " +
          "If $X \\sim N(\\mu, \\sigma^2)$, then $X = \\mu + \\sigma Z$ and $f(x) = \\frac{1}{\\sigma}\\phi\\left(\\frac{x-\\mu}{\\sigma}\\right)$. " +
          "The CDF $\\Phi(z) = \\int_{-\\infty}^z \\phi(t)\\,dt$ has no closed form but is tabulated. " +
          "The 68-95-99.7 rule: $P(|Z| \\leq 1) \\approx 0.683$, $P(|Z| \\leq 2) \\approx 0.954$, $P(|Z| \\leq 3) \\approx 0.997$."
        }
      />

      <TheoremBlock
        label="Theorem 2.2.1"
        title="Probability Integral Transform"
        statement={
          "If $X$ is a continuous random variable with CDF $F$, then $U = F(X) \\sim \\text{Uniform}(0,1)$. " +
          "Conversely, if $U \\sim \\text{Uniform}(0,1)$, then $X = F^{-1}(U)$ has CDF $F$. " +
          "This allows generation of any continuous distribution from a uniform random variable."
        }
        proof={
          "$P(F(X) \\leq u) = P(X \\leq F^{-1}(u)) = F(F^{-1}(u)) = u$ for $u \\in [0,1]$. " +
          "This is the CDF of Uniform(0,1). For the converse: " +
          "$P(F^{-1}(U) \\leq x) = P(U \\leq F(x)) = F(x)$, the CDF of $X$."
        }
      />

      <ExampleBlock title="Memoryless Property of Exponential">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          If <InlineMath math="X \sim \text{Exp}(\lambda)" />, then for <InlineMath math="s, t > 0" />:
        </p>
        <BlockMath math="P(X > s+t \mid X > s) = \frac{P(X > s+t)}{P(X > s)} = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t} = P(X > t)" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The distribution does not remember how long you've already waited. This uniquely characterizes
          the exponential among continuous distributions.
        </p>
      </ExampleBlock>

      <WarningBlock title="PDF Values Are Not Probabilities">
        <p>
          The PDF <InlineMath math="f(x)" /> can exceed 1 (e.g., <InlineMath math="\text{Uniform}(0, 0.5)" /> has{' '}
          <InlineMath math="f(x) = 2" /> on <InlineMath math="[0, 0.5]" />). Only integrals of the PDF give
          probabilities. Also, <InlineMath math="P(X = a) = 0" /> for continuous random variables — you cannot
          compute <InlineMath math="P(X = 1.5)" /> for a Gaussian; you must specify an interval.
          In practice, when building likelihoods for continuous data, use the PDF (density) not point probabilities.
        </p>
      </WarningBlock>

      <PythonCode
        title="Continuous Distributions with SciPy"
        code={`import numpy as np
from scipy import stats

# ── Normal distribution ───────────────────────────────────────────────────
mu, sigma = 2.0, 1.5
X = stats.norm(loc=mu, scale=sigma)

print(f"Normal({mu}, {sigma}²):")
print(f"  E[X] = {X.mean():.4f}, Var(X) = {X.var():.4f}")
print(f"  P(X ≤ 3) = {X.cdf(3):.4f}")
print(f"  P(1 ≤ X ≤ 3) = {X.cdf(3) - X.cdf(1):.4f}")
print(f"  95th percentile = {X.ppf(0.95):.4f}")

# ── Probability integral transform ────────────────────────────────────────
np.random.seed(42)
n = 10000
# Generate Exp(2) using inverse CDF method
U = np.random.uniform(0, 1, n)
lam = 2.0
X_exp = -np.log(1 - U) / lam  # F^{-1}(u) = -log(1-u)/λ
print(f"\\nInverse CDF for Exp(2): mean={X_exp.mean():.4f} (should be {1/lam})")

# ── KS test: does our sample match the distribution? ──────────────────────
stat, p_val = stats.kstest(X_exp, 'expon', args=(0, 1/lam))
print(f"KS test: stat={stat:.4f}, p={p_val:.4f} (large p = good fit)")

# ── 68-95-99.7 rule verification ──────────────────────────────────────────
Z = stats.norm(0, 1)
for k in [1, 2, 3]:
    prob = Z.cdf(k) - Z.cdf(-k)
    print(f"  P(|Z|≤{k}) = {prob:.5f}")`}
      />
    </div>
  );
}
