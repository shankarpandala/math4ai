import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function normalPdf(x, mu, sigma) {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

function FDivergenceViz() {
  const [mu2, setMu2] = useState(1.5)
  const [sigma2, setSigma2] = useState(1.2)
  const mu1 = 0, sigma1 = 1

  const results = useMemo(() => {
    const dx = 0.02
    const xs = []
    for (let x = -8; x <= 8; x += dx) xs.push(x)

    let kl = 0, tv = 0, hellinger = 0
    xs.forEach(x => {
      const p = normalPdf(x, mu1, sigma1)
      const q = normalPdf(x, mu2, sigma2)
      if (p > 1e-10 && q > 1e-10) {
        kl += p * Math.log(p / q) * dx
        tv += 0.5 * Math.abs(p - q) * dx
        hellinger += (Math.sqrt(p) - Math.sqrt(q)) ** 2 * dx
      } else if (p > 1e-10) {
        tv += 0.5 * p * dx
      }
    })
    hellinger *= 0.5

    // Normalize KL (could be > 0 due to discretization)
    return { kl: Math.max(0, kl), tv: Math.min(1, tv), hellinger: Math.min(1, hellinger) }
  }, [mu2, sigma2])

  // Plot divergences as mu2 varies
  const sweepData = useMemo(() => {
    const dx = 0.1
    const xs = []
    for (let x = -6; x <= 6; x += dx) xs.push(x)

    const pts = []
    for (let m = -3; m <= 3; m += 0.1) {
      let kl = 0, tv = 0, hellinger = 0
      xs.forEach(x => {
        const p = normalPdf(x, mu1, sigma1)
        const q = normalPdf(x, m, sigma2)
        if (p > 1e-5 && q > 1e-5) {
          kl += p * Math.log(p / q) * dx
          tv += 0.5 * Math.abs(p - q) * dx
          hellinger += (Math.sqrt(p) - Math.sqrt(q)) ** 2 * dx
        } else if (p > 1e-5) tv += 0.5 * p * dx
      })
      pts.push({ m: parseFloat(m.toFixed(1)), kl: Math.max(0, kl), tv: Math.min(1, tv), hellinger: Math.min(1, 0.5 * hellinger) })
    }
    return pts
  }, [sigma2])

  const W = 480, H = 180
  const padL = 36, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const maxKL = Math.max(...sweepData.map(d => d.kl))

  const xToSvg = m => padL + ((m + 3) / 6) * plotW
  const yToSvg = (v, maxV) => padT + plotH - (v / (maxV * 1.1)) * plotH

  const klPath = sweepData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.m).toFixed(1)},${yToSvg(d.kl, maxKL).toFixed(1)}`).join(' ')
  const tvPath = sweepData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.m).toFixed(1)},${yToSvg(d.tv * maxKL, maxKL).toFixed(1)}`).join(' ')
  const hePath = sweepData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.m).toFixed(1)},${yToSvg(d.hellinger * maxKL, maxKL).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">KL vs Total Variation vs Hellinger (vs μ₂)</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        P = N(0,1) fixed. Q = N(μ₂, σ₂). KL grows unboundedly; TV and Hellinger are bounded in [0,1].
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Q mean μ₂ = {mu2.toFixed(1)}</label>
          <input type="range" min="-3" max="3" step="0.1" value={mu2} onChange={e => setMu2(+e.target.value)} className="w-full accent-red-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Q std σ₂ = {sigma2.toFixed(1)}</label>
          <input type="range" min="0.3" max="3" step="0.1" value={sigma2} onChange={e => setSigma2(+e.target.value)} className="w-full accent-red-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[-2, -1, 0, 1, 2].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">μ₂</text>
          <path d={klPath} fill="none" stroke="#ef4444" strokeWidth={2} />
          <path d={tvPath} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 2" />
          <path d={hePath} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" />
          {/* Current mu marker */}
          <line x1={xToSvg(mu2)} y1={padT} x2={xToSvg(mu2)} y2={padT + plotH} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={W - padR - 4} y={padT + 12} textAnchor="end" fontSize="8" fill="#ef4444">KL (scaled)</text>
          <text x={W - padR - 4} y={padT + 22} textAnchor="end" fontSize="8" fill="#6366f1">TV ×scale</text>
          <text x={W - padR - 4} y={padT + 32} textAnchor="end" fontSize="8" fill="#10b981">Hellinger ×scale</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20"><div className="font-mono font-bold text-red-600">{results.kl.toFixed(4)}</div><div className="text-gray-500">KL(P‖Q) nats</div></div>
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{results.tv.toFixed(4)}</div><div className="text-gray-500">TV distance [0,1]</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{results.hellinger.toFixed(4)}</div><div className="text-gray-500">Hellinger² [0,1]</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

def kl_divergence(p, q, dx=1e-4):
    """KL(p||q) for continuous densities sampled on grid."""
    mask = (p > 1e-10) & (q > 1e-10)
    return np.sum(p[mask] * np.log(p[mask] / q[mask])) * dx

def total_variation(p, q, dx=1e-4):
    return 0.5 * np.sum(np.abs(p - q)) * dx

def hellinger_sq(p, q, dx=1e-4):
    return 0.5 * np.sum((np.sqrt(p) - np.sqrt(q))**2) * dx

def chi_squared_div(p, q, dx=1e-4):
    mask = q > 1e-10
    return np.sum((p[mask] - q[mask])**2 / q[mask]) * dx

x = np.linspace(-8, 8, 10000)
dx = x[1] - x[0]

for mu2 in [0, 0.5, 1.0, 2.0]:
    p = stats.norm.pdf(x, 0, 1)
    q = stats.norm.pdf(x, mu2, 1.2)
    print(f"mu2={mu2:.1f}: KL={kl_divergence(p,q,dx):.4f}, "
          f"TV={total_variation(p,q,dx):.4f}, "
          f"H^2={hellinger_sq(p,q,dx):.4f}, "
          f"chi^2={chi_squared_div(p,q,dx):.4f}")

# GAN connections: f-GAN uses variational lower bound on f-divergences
# The discriminator D in a GAN computes f*(D(x)) - D(G(z)) where f* is the Fenchel conjugate
# For KL: f*(t) = exp(t-1), giving the original GAN objective
print("\\nPinsker's inequality: TV <= sqrt(KL/2)")
for mu2 in [0.5, 1.0, 2.0]:
    p = stats.norm.pdf(x, 0, 1)
    q = stats.norm.pdf(x, mu2, 1.0)
    tv = total_variation(p, q, dx)
    kl = kl_divergence(p, q, dx)
    print(f"  mu2={mu2}: TV={tv:.4f}, sqrt(KL/2)={np.sqrt(kl/2):.4f}, "
          f"TV <= sqrt(KL/2): {tv <= np.sqrt(kl/2) + 1e-6}")
`

export default function FDivergences() {
  return (
    <div className="space-y-8">
      <NoteBlock title="A Unified Family of Divergences">
        <p>
          The f-divergence family unifies KL divergence, total variation, Hellinger distance,
          and chi-squared divergence under a single framework. Different GANs optimize different
          f-divergences, and the choice affects training stability and mode coverage behavior.
        </p>
      </NoteBlock>

      <FDivergenceViz />

      <DefinitionBlock
        title="f-Divergence"
        definition="For a convex function $f: (0,\infty) \to \mathbb{R}$ with $f(1) = 0$, the f-divergence between distributions $P$ and $Q$ is: $D_f(P \| Q) = \int q(x) f\!\left(\frac{p(x)}{q(x)}\right) dx$. Examples: KL: $f(t) = t\log t$; Reverse KL: $f(t) = -\log t$; Total Variation: $f(t) = \frac{1}{2}|t-1|$; Hellinger²: $f(t) = (\sqrt{t}-1)^2$; Chi-squared: $f(t) = (t-1)^2$."
        notation="All f-divergences satisfy $D_f(P\|Q) \geq 0$ with equality iff $P=Q$. They all reduce to 0 when $P=Q$ since $f(1)=0$."
      />

      <DefinitionBlock
        title="Variational Representation"
        definition="By the Fenchel duality, every f-divergence has a variational lower bound: $D_f(P\|Q) = \sup_{T: \mathcal{X} \to \mathbb{R}} \left\{\mathbb{E}_P[T(X)] - \mathbb{E}_Q[f^*(T(X))]\right\}$ where $f^*(s) = \sup_{t > 0}(st - f(t))$ is the Fenchel conjugate. The supremum is achieved at $T^*(x) = f'(p(x)/q(x))$."
        notation="This representation underlies f-GAN: the discriminator $T$ approximates the optimal critic $T^*$, and maximizing over $T$ gives a lower bound on the divergence between the data and generator distributions."
      />

      <TheoremBlock
        title="Pinsker's Inequality"
        statement="For any probability distributions $P$ and $Q$: $\mathrm{TV}(P, Q) \leq \sqrt{\frac{1}{2}D_{KL}(P\|Q)}$ where $\mathrm{TV}(P,Q) = \frac{1}{2}\|p - q\|_1$ is the total variation distance. More generally: $\mathrm{TV}^2 \leq H^2(P,Q) \leq D_{KL}(P\|Q)$ where $H^2$ is the squared Hellinger distance."
        proof="Use the data-processing inequality: $\mathrm{TV}(P,Q) = \sup_{A} |P(A) - Q(A)|$. For any event $A$ with $p = P(A)$, $q = Q(A)$: $KL(P\|Q) \geq KL(\mathrm{Bernoulli}(p)\|\mathrm{Bernoulli}(q)) = p\log(p/q) + (1-p)\log((1-p)/(1-q)) \geq 2(p-q)^2$. Taking supremum over $A$ and using $|p-q| = \mathrm{TV}$ gives the bound."
      />

      <ExampleBlock title="GAN as f-Divergence Minimization">
        <p>
          The original GAN (Goodfellow 2014) minimizes the Jensen-Shannon divergence:
          <InlineMath math="\mathrm{JS}(P\|Q) = \frac{1}{2}D_{KL}(P\|\frac{P+Q}{2}) + \frac{1}{2}D_{KL}(Q\|\frac{P+Q}{2})" />.
          The WGAN instead minimizes the Wasserstein-1 distance, which is continuous even when
          supports don't overlap. Different f-divergences lead to different GAN variants with
          different stability and mode coverage properties.
        </p>
      </ExampleBlock>

      <WarningBlock title="f-Divergences Require Absolute Continuity">
        <p>
          If <InlineMath math="P" /> is not absolutely continuous with respect to <InlineMath math="Q" />
          (i.e., there exists a set where <InlineMath math="q=0" /> but <InlineMath math="p>0" />),
          then <InlineMath math="D_f(P\|Q) = +\infty" /> for KL and many f-divergences. This is
          a major practical problem in GANs: if generator and real distributions have disjoint supports,
          KL is infinite and gradients vanish. The Wasserstein distance avoids this by using a different
          metric topology.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
