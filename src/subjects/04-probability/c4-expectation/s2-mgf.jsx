import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function MGFViz() {
  const [t0, setT0] = useState(0);
  const [dist, setDist] = useState('normal');

  // MGF and first/second derivatives for selected distribution
  const mgf = {
    normal: (t) => Math.exp(t * t / 2),           // N(0,1): M(t) = e^{t²/2}
    exponential: (t) => t < 1 ? 1 / (1 - t) : null, // Exp(1): M(t) = 1/(1-t), t<1
    bernoulli: (t) => 0.5 + 0.5 * Math.exp(t),   // Bern(0.5): M(t) = 0.5 + 0.5e^t
  };

  const mgf_d1 = {
    normal: (t) => t * Math.exp(t * t / 2),
    exponential: (t) => t < 0.99 ? 1 / (1 - t) ** 2 : null,
    bernoulli: (t) => 0.5 * Math.exp(t),
  };

  const labels = { normal: 'N(0,1)', exponential: 'Exp(1)', bernoulli: 'Bern(0.5)' };
  const tRanges = { normal: [-2, 2], exponential: [-2, 0.9], bernoulli: [-2, 2] };

  const [tMin, tMax] = tRanges[dist];
  const W = 340, H = 180;
  const nPts = 200;

  const vals = Array.from({ length: nPts }, (_, i) => {
    const t = tMin + (i / (nPts - 1)) * (tMax - tMin);
    const m = mgf[dist](t);
    return m !== null && isFinite(m) && m < 20 ? { t, m } : null;
  }).filter(Boolean);

  const maxM = Math.max(...vals.map(v => v.m), 1);
  const toSvg = (t, m) => ({
    sx: ((t - tMin) / (tMax - tMin)) * (W - 20) + 10,
    sy: H - 20 - (m / (maxM * 1.1)) * (H - 30),
  });

  const curvePath = vals.map(({ t, m }, i) => {
    const { sx, sy } = toSvg(t, m);
    return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(' ');

  const m0 = mgf[dist](t0);
  const d1 = mgf_d1[dist](t0);
  const tangentValid = m0 !== null && d1 !== null && isFinite(m0) && isFinite(d1);

  const tangentPath = tangentValid ? (() => {
    const x1 = tMin, x2 = tMax;
    const y1 = m0 + d1 * (x1 - t0);
    const y2 = m0 + d1 * (x2 - t0);
    const p1 = toSvg(x1, y1);
    const p2 = toSvg(x2, y2);
    return `M${p1.sx.toFixed(1)},${Math.max(0, Math.min(H, p1.sy)).toFixed(1)} L${p2.sx.toFixed(1)},${Math.max(0, Math.min(H, p2.sy)).toFixed(1)}`;
  })() : '';

  const { sx: t0x, sy: t0y } = tangentValid ? toSvg(t0, m0) : { sx: 0, sy: 0 };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        MGF Plot: Tangent at t₀ shows E[X]
      </h3>
      <div className="mb-3 flex gap-2">
        {Object.entries(labels).map(([k, v]) => (
          <button key={k} onClick={() => { setDist(k); setT0(0); }}
            className={`rounded-lg px-3 py-1 text-xs font-medium ${dist === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {v}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={10} y1={H - 20} x2={W - 10} y2={H - 20} stroke="#9ca3af" strokeWidth={1} />
        <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
        {tangentValid && tangentPath && (
          <path d={tangentPath} fill="none" stroke="#f97316" strokeWidth={1.5} strokeDasharray="5,3" />
        )}
        {tangentValid && (
          <circle cx={t0x} cy={t0y} r={5} fill="#ef4444" stroke="white" strokeWidth={1.5} />
        )}
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs"><span>t₀</span><span>{t0.toFixed(2)}</span></div>
        <input type="range" min={tMin} max={tMax} step="0.05" value={t0}
          onChange={e => setT0(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      {tangentValid && (
        <div className="mt-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 px-3 py-2 text-sm">
          M(t₀)={m0?.toFixed(4)}, M'(t₀)=<strong>{d1?.toFixed(4)}</strong>{' '}
          {t0 === 0 ? <>(= E[X] at t=0)</> : <>(slope of tangent)</>}
        </div>
      )}
    </div>
  );
}

export default function MGFSection() {
  return (
    <div className="space-y-8">
      <MGFViz />

      <DefinitionBlock
        label="Definition 4.2.1"
        title="Moment Generating Function"
        definition={
          "The moment generating function (MGF) of $X$ is $M_X(t) = E[e^{tX}]$, defined for all $t$ in some neighborhood of 0. " +
          "If the MGF exists, it generates moments: $E[X^k] = M_X^{(k)}(0) = \\left.\\frac{d^k}{dt^k} M_X(t)\\right|_{t=0}$. " +
          "This follows from $e^{tX} = \\sum_{k=0}^\\infty (tX)^k/k!$ and term-by-term differentiation (justified when MGF is finite near 0)."
        }
        notation={
          "Key MGFs: $N(\\mu,\\sigma^2)$: $M(t) = e^{\\mu t + \\sigma^2 t^2/2}$. " +
          "Exp($\\lambda$): $M(t) = \\lambda/(\\lambda-t)$ for $t < \\lambda$. " +
          "Poisson($\\lambda$): $M(t) = e^{\\lambda(e^t-1)}$. " +
          "Binomial$(n,p)$: $M(t) = (pe^t + 1-p)^n$."
        }
      />

      <DefinitionBlock
        label="Definition 4.2.2"
        title="Characteristic Function"
        definition={
          "The characteristic function (CF) is $\\varphi_X(t) = E[e^{itX}]$ (always exists, $|\\varphi_X(t)| \\leq 1$). " +
          "Unlike the MGF, the CF exists for all distributions. " +
          "Moments: $E[X^k] = i^{-k} \\varphi_X^{(k)}(0)$ (when moments exist). " +
          "The CF uniquely determines the distribution (inversion theorem): " +
          "$f_X(x) = \\frac{1}{2\\pi} \\int_{-\\infty}^\\infty e^{-itx} \\varphi_X(t)\\,dt$ (when $f_X$ is continuous)."
        }
      />

      <TheoremBlock
        label="Theorem 4.2.1"
        title="Uniqueness and Continuity Theorems"
        statement={
          "Uniqueness: if $M_X(t) = M_Y(t)$ in some open interval containing 0, then $X \\overset{d}{=} Y$. " +
          "Lévy's continuity theorem: $X_n \\overset{d}{\\to} X$ iff $\\varphi_{X_n}(t) \\to \\varphi_X(t)$ for all $t$. " +
          "MGF uniqueness: if $M_X$ exists on $(-h, h)$ for some $h > 0$, then it uniquely determines the distribution."
        }
        proof={
          "MGF uniqueness: the MGF determines all moments (by differentiation). " +
          "If Carleman's condition holds (satisfied when MGF exists in an interval), " +
          "the moment sequence uniquely determines the distribution."
        }
        corollaries={[
          "Sum of independent normals is normal: M_{X+Y}(t) = M_X(t) M_Y(t) = e^{(μ₁+μ₂)t+(σ₁²+σ₂²)t²/2}.",
          "CLT proof via characteristic functions: show φ_{S_n}(t) → e^{-t²/2} pointwise.",
        ]}
      />

      <ExampleBlock title="Deriving Moments of Normal from MGF">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          For <InlineMath math="X \sim N(0,1)" />, <InlineMath math="M(t) = e^{t^2/2}" />:
        </p>
        <BlockMath math="M'(t) = te^{t^2/2} \implies E[X] = M'(0) = 0" />
        <BlockMath math="M''(t) = (1+t^2)e^{t^2/2} \implies E[X^2] = M''(0) = 1 \implies \text{Var}(X)=1" />
      </ExampleBlock>

      <WarningBlock title="MGF May Not Exist for Heavy-Tailed Distributions">
        <p>
          The Cauchy distribution has no moments — not even the mean — and its MGF is infinite for all{' '}
          <InlineMath math="t \neq 0" />. The lognormal distribution has all moments finite, but its MGF is
          infinite for all <InlineMath math="t > 0" /> (despite having a well-defined distribution).
          For such distributions, use the characteristic function instead. In ML, the MGF is used in
          deriving concentration inequalities (Chernoff bounds), which require the MGF to be bounded
          — valid for bounded or sub-Gaussian random variables.
        </p>
      </WarningBlock>

      <PythonCode
        title="MGF and Characteristic Functions"
        code={`import numpy as np
from scipy import stats

# ── MGF derivatives to get moments ───────────────────────────────────────
def mgf_normal(t, mu=0, sigma=1):
    """N(mu, sigma²) MGF."""
    return np.exp(mu*t + 0.5*sigma**2*t**2)

def numerical_derivative(f, t, h=1e-5, order=1):
    """Numerical derivative via finite differences."""
    if order == 1:
        return (f(t+h) - f(t-h)) / (2*h)
    elif order == 2:
        return (f(t+h) - 2*f(t) + f(t-h)) / h**2
    elif order == 3:
        return (f(t+2*h) - 2*f(t+h) + 2*f(t-h) - f(t-2*h)) / (2*h**3)
    elif order == 4:
        return (f(t+2*h) - 4*f(t+h) + 6*f(t) - 4*f(t-h) + f(t-2*h)) / h**4

mu, sigma = 2.0, 1.5
M = lambda t: mgf_normal(t, mu, sigma)

print(f"N({mu}, {sigma}²) — MGF-derived moments:")
print(f"  E[X]   = M'(0) = {numerical_derivative(M, 0, order=1):.4f} (true: {mu})")
print(f"  E[X²]  = M''(0) = {numerical_derivative(M, 0, order=2):.4f} (true: {mu**2+sigma**2:.4f})")
print(f"  E[X³]  = M'''(0) = {numerical_derivative(M, 0, order=3):.4f}")

# ── Characteristic function ───────────────────────────────────────────────
# For N(0,1): φ(t) = e^{-t²/2}
phi_normal = lambda t: np.exp(-0.5*t**2 + 0j)

# Characteristic function of sum of normals
phi_sum = lambda t: phi_normal(t) * phi_normal(t)  # sum of two N(0,1)
# Should equal φ of N(0,2): e^{-t²}
phi_n02 = lambda t: np.exp(-t**2)
t_test = 1.5
print(f"\\nCharacteristic function (sum of two N(0,1)):")
print(f"  φ_X₁+X₂(1.5) = {phi_sum(t_test):.6f}")
print(f"  φ_N(0,2)(1.5) = {phi_n02(t_test):.6f}")

# ── Chernoff bound: P(X >= t) <= e^{-st} M_X(s) for best s ─────────────
# For X ~ N(0,1), P(X >= 2) <= e^{-2s} * e^{s²/2} minimized at s=2
s_star = 2.0
chernoff_bound = np.exp(-s_star**2 + s_star**2/2)
actual_prob = 1 - stats.norm.cdf(2.0)
print(f"\\nChernoff bound P(N(0,1)>=2):")
print(f"  Bound: {chernoff_bound:.6f}")
print(f"  Actual: {actual_prob:.6f}")`}
      />
    </div>
  );
}
