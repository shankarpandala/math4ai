import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const FAMILIES = {
  gaussian: {
    label: 'Gaussian (σ²=1)',
    eta: (mu) => mu,
    pdf: (x, mu) => Math.exp(-0.5*(x-mu)**2) / Math.sqrt(2*Math.PI),
    paramLabel: 'μ (mean)',
    etaLabel: 'η = μ',
    range: [-5, 5],
    paramRange: [-3, 3],
  },
  poisson: {
    label: 'Poisson',
    eta: (lam) => Math.log(lam),
    pdf: (x, lam) => {
      if (!Number.isInteger(Math.round(x)) || x < 0) return 0;
      const k = Math.round(x);
      let logp = k * Math.log(lam) - lam;
      for (let i = 1; i <= k; i++) logp -= Math.log(i);
      return Math.exp(logp);
    },
    paramLabel: 'λ (rate)',
    etaLabel: 'η = log λ',
    range: [0, 15],
    paramRange: [0.5, 8],
    discrete: true,
  },
};

function ExpFamilyViz() {
  const [family, setFamily] = useState('gaussian');
  const [param, setParam] = useState(0);
  const F = FAMILIES[family];
  const eta = F.eta(family === 'gaussian' ? param : Math.max(0.5, param));
  const actualParam = family === 'gaussian' ? param : Math.max(0.5, param);

  const W = 340, H = 160;
  const [xMin, xMax] = F.range;
  const nPts = F.discrete ? Math.floor(xMax - xMin) + 1 : 200;

  const vals = F.discrete
    ? Array.from({ length: nPts }, (_, i) => ({ x: xMin + i, y: F.pdf(xMin + i, actualParam) }))
    : Array.from({ length: nPts }, (_, i) => {
        const x = xMin + (i / (nPts - 1)) * (xMax - xMin);
        return { x, y: F.pdf(x, actualParam) };
      });

  const maxY = Math.max(...vals.map(v => v.y), 0.01);

  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * (W - 20) + 10,
    sy: H - 15 - (y / maxY) * (H - 25),
  });

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Exponential Family: Natural Parameter Slider
      </h3>
      <div className="mb-3 flex gap-3">
        {Object.entries(FAMILIES).map(([k, v]) => (
          <button key={k} onClick={() => { setFamily(k); setParam(k === 'gaussian' ? 0 : 2); }}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${family === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {v.label}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={10} y1={H-15} x2={W-10} y2={H-15} stroke="#9ca3af" strokeWidth={1} />
        {F.discrete
          ? vals.map(({ x, y }) => {
              const { sx, sy } = toSvg(x, y);
              return <rect key={x} x={sx - 4} y={sy} width={8} height={H-15-sy} fill="#6366f1" opacity={0.8} rx={1} />;
            })
          : (() => {
              const path = vals.map(({ x, y }, i) => {
                const { sx, sy } = toSvg(x, y);
                return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
              }).join(' ');
              return <path d={path} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth={2} />;
            })()
        }
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>{F.paramLabel}</span><span>{actualParam.toFixed(2)}</span></div>
          <input type="range" min={F.paramRange[0]} max={F.paramRange[1]} step="0.1" value={param}
            onChange={e => setParam(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
          <span className="font-semibold">{F.etaLabel}</span> = <span className="font-mono text-indigo-600 dark:text-indigo-400">{eta.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ExponentialFamilySection() {
  return (
    <div className="space-y-8">
      <ExpFamilyViz />

      <DefinitionBlock
        label="Definition 3.3.1"
        title="Exponential Family"
        definition={
          "A parametric family of distributions is an exponential family if the density can be written as " +
          "$p(x; \\eta) = h(x) \\exp(\\eta^T T(x) - A(\\eta))$ " +
          "where $\\eta \\in \\mathbb{R}^k$ is the natural (canonical) parameter, " +
          "$T(x)$ is the sufficient statistic, " +
          "$h(x)$ is the base measure, and " +
          "$A(\\eta) = \\log \\int h(x) e^{\\eta^T T(x)}\\,dx$ is the log-partition function (ensures normalization)."
        }
        notation={
          "Members: Gaussian, Bernoulli, Binomial, Poisson, Gamma, Beta, Dirichlet, Multinomial. " +
          "The mean parameter: $\\mu = E_{\\eta}[T(X)] = \\nabla A(\\eta)$. " +
          "The covariance of $T(X)$: $\\text{Cov}[T(X)] = \\nabla^2 A(\\eta)$ (Hessian of $A$)."
        }
      />

      <DefinitionBlock
        label="Definition 3.3.2"
        title="Sufficient Statistics"
        definition={
          "A statistic $T(X_1,\\ldots,X_n)$ is sufficient for $\\eta$ if $p(X|T, \\eta) = p(X|T)$ — " +
          "given $T$, the data $X$ carries no additional information about $\\eta$. " +
          "By the factorization theorem: $T$ is sufficient iff $p(x;\\eta) = g(T(x), \\eta) h(x)$. " +
          "For i.i.d. exponential family: $T(X_1,\\ldots,X_n) = \\sum_i T(X_i)$ is sufficient."
        }
      />

      <TheoremBlock
        label="Theorem 3.3.1"
        title="MLE for Exponential Family"
        statement={
          "For i.i.d. data $X_1, \\ldots, X_n$ from an exponential family with natural parameter $\\eta$, " +
          "the MLE satisfies the moment matching condition: " +
          "$\\frac{1}{n}\\sum_{i=1}^n T(X_i) = E_\\eta[T(X)] = \\nabla A(\\eta)$. " +
          "The MLE always exists and is unique (when $A$ is strictly convex), " +
          "and equals the unique $\\eta^*$ such that the expected sufficient statistic equals the empirical sufficient statistic."
        }
        proof={
          "Log-likelihood: $\\ell(\\eta) = \\eta^T \\bar{T} - A(\\eta)$ where $\\bar{T} = \\frac{1}{n}\\sum_i T(X_i)$. " +
          "Setting gradient to zero: $\\nabla \\ell = \\bar{T} - \\nabla A(\\eta) = 0$. " +
          "Since $\\nabla^2 A = \\text{Cov}[T(X)] \\succeq 0$ (and $> 0$ for minimal representations), $A$ is convex, so $\\ell$ is concave."
        }
      />

      <ExampleBlock title="Bernoulli as Exponential Family">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <InlineMath math="P(X=x; p) = p^x(1-p)^{1-x}" /> can be written as:
        </p>
        <BlockMath math="p(x;\eta) = \exp\!\left(\eta x - \log(1+e^\eta)\right), \quad \eta = \log\frac{p}{1-p}" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Natural parameter <InlineMath math="\eta" /> is the log-odds (logit). Sufficient statistic{' '}
          <InlineMath math="T(x) = x" />. Log-partition <InlineMath math="A(\eta) = \log(1+e^\eta)" />.
          MLE gives <InlineMath math="\hat{p} = \bar{x}" /> (sample mean) — moment matching.
        </p>
      </ExampleBlock>

      <WarningBlock title="Natural vs Mean Parameters">
        <p>
          The exponential family can be parameterized by either the natural parameter{' '}
          <InlineMath math="\eta" /> or the mean parameter <InlineMath math="\mu = \nabla A(\eta)" />.
          Gradient descent in <InlineMath math="\eta" />-space uses the Fisher information metric{' '}
          <InlineMath math="F = \nabla^2 A(\eta)" />. Natural gradient descent (Amari, 1998) accounts
          for this curved geometry and often converges faster than ordinary gradient descent.
          Mixing the two parameterizations without care leads to incorrect updates.
        </p>
      </WarningBlock>

      <PythonCode
        title="Exponential Family Log-Partition and MLE"
        code={`import numpy as np
from scipy import stats, optimize

# ── Gaussian exponential family ───────────────────────────────────────────
# p(x; η₁, η₂) = h(x) exp(η₁x + η₂x² - A(η))
# η₁ = μ/σ², η₂ = -1/(2σ²), A(η) = -η₁²/(4η₂) + 0.5*log(-π/η₂)

def gaussian_A(eta1, eta2):
    """Log-partition for Gaussian in natural params."""
    return -eta1**2 / (4*eta2) + 0.5 * np.log(-np.pi / eta2)

# Convert mean/var params to natural params
mu, sigma2 = 2.0, 1.5
eta1 = mu / sigma2
eta2 = -1 / (2 * sigma2)
print(f"Gaussian({mu}, {sigma2}):")
print(f"  Natural params: η₁={eta1:.4f}, η₂={eta2:.4f}")
print(f"  Log-partition A(η): {gaussian_A(eta1, eta2):.4f}")

# Verify MLE: moment matching
np.random.seed(42)
data = np.random.normal(mu, np.sqrt(sigma2), 1000)
mu_hat = data.mean()
sigma2_hat = data.var()
print(f"  MLE: μ̂={mu_hat:.4f} (true {mu}), σ²̂={sigma2_hat:.4f} (true {sigma2})")

# ── Poisson exponential family ────────────────────────────────────────────
# p(k; η) = exp(ηk - e^η) / k!, T(k)=k, A(η)=e^η, η=log(λ)
lam = 3.5
eta_pois = np.log(lam)
print(f"\\nPoisson(λ={lam}): η=log(λ)={eta_pois:.4f}")
data_pois = np.random.poisson(lam, 1000)
lam_mle = data_pois.mean()  # moment matching: E[T(X)] = λ = Σx_i/n
print(f"  MLE λ̂ = {lam_mle:.4f} (true {lam})")

# ── Fisher information as Hessian of A ───────────────────────────────────
# For Gaussian: I(η₂) = d²A/dη₂² at eta2
h = 1e-5
I_eta2 = (gaussian_A(eta1, eta2+h) - 2*gaussian_A(eta1, eta2) + gaussian_A(eta1, eta2-h)) / h**2
print(f"\\nFisher info (Hessian of A) wrt η₂: {I_eta2:.4f}")`}
      />
    </div>
  );
}
