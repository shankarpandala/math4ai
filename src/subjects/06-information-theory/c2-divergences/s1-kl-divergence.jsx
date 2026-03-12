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

function KLViz() {
  const [mu1, setMu1] = useState(0)
  const [sigma1, setSigma1] = useState(1)
  const [mu2, setMu2] = useState(1)
  const [sigma2, setSigma2] = useState(1.5)

  // KL(P||Q) for two Gaussians
  const klPQ = Math.log(sigma2 / sigma1) + (sigma1 * sigma1 + (mu1 - mu2) ** 2) / (2 * sigma2 * sigma2) - 0.5
  const klQP = Math.log(sigma1 / sigma2) + (sigma2 * sigma2 + (mu2 - mu1) ** 2) / (2 * sigma1 * sigma1) - 0.5

  const data = useMemo(() => {
    const pts = []
    for (let x = -6; x <= 6; x += 0.05) {
      const p = normalPdf(x, mu1, sigma1)
      const q = normalPdf(x, mu2, sigma2)
      pts.push({ x: parseFloat(x.toFixed(2)), p, q })
    }
    return pts
  }, [mu1, sigma1, mu2, sigma2])

  const maxPdf = Math.max(...data.map(d => Math.max(d.p, d.q)))
  const W = 480, H = 200
  const padL = 32, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = x => padL + ((x + 6) / 12) * plotW
  const yToSvg = y => padT + plotH - (y / (maxPdf * 1.1)) * plotH

  const pPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.p).toFixed(1)}`).join(' ')
  const qPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.q).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">KL Divergence Between Two Gaussians</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        KL(P‖Q) ≠ KL(Q‖P) — asymmetry is visible in the different "mass-covering" behaviors.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">P: μ₁ = {mu1.toFixed(1)}</label>
          <input type="range" min="-3" max="3" step="0.1" value={mu1} onChange={e => setMu1(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">P: σ₁ = {sigma1.toFixed(1)}</label>
          <input type="range" min="0.3" max="3" step="0.1" value={sigma1} onChange={e => setSigma1(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-red-600">Q: μ₂ = {mu2.toFixed(1)}</label>
          <input type="range" min="-3" max="3" step="0.1" value={mu2} onChange={e => setMu2(+e.target.value)} className="w-full accent-red-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-red-600">Q: σ₂ = {sigma2.toFixed(1)}</label>
          <input type="range" min="0.3" max="3" step="0.1" value={sigma2} onChange={e => setSigma2(+e.target.value)} className="w-full accent-red-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[-4, -2, 0, 2, 4].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <path d={pPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          <path d={qPath} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6 2" />
          <text x={padL + 10} y={padT + 14} fontSize="10" fill="#3b82f6">P = N({mu1.toFixed(1)}, {sigma1.toFixed(1)}²)</text>
          <text x={padL + 10} y={padT + 27} fontSize="10" fill="#ef4444">Q = N({mu2.toFixed(1)}, {sigma2.toFixed(1)}²)</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className={`rounded p-3 text-center ${klPQ > 1 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
          <div className={`font-mono text-lg font-bold ${klPQ > 1 ? 'text-red-600' : 'text-blue-600'}`}>{Math.max(0, klPQ).toFixed(4)}</div>
          <div className="text-xs text-gray-500">KL(P ‖ Q) nats</div>
        </div>
        <div className={`rounded p-3 text-center ${klQP > 1 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
          <div className={`font-mono text-lg font-bold ${klQP > 1 ? 'text-red-600' : 'text-emerald-600'}`}>{Math.max(0, klQP).toFixed(4)}</div>
          <div className="text-xs text-gray-500">KL(Q ‖ P) nats</div>
        </div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats, special

# KL divergence between two Gaussians
def kl_gaussian(mu1, sigma1, mu2, sigma2):
    """KL(N(mu1,s1^2) || N(mu2,s2^2))"""
    return (np.log(sigma2/sigma1) +
            (sigma1**2 + (mu1-mu2)**2) / (2*sigma2**2) - 0.5)

kl_fwd = kl_gaussian(0, 1, 2, 1.5)
kl_bwd = kl_gaussian(2, 1.5, 0, 1)
print(f"KL(P||Q) = {kl_fwd:.4f}")
print(f"KL(Q||P) = {kl_bwd:.4f}  (asymmetric!)")
print(f"KL symmetric? {np.isclose(kl_fwd, kl_bwd)}")

# KL for discrete distributions
p = np.array([0.4, 0.3, 0.2, 0.1])
q = np.array([0.25, 0.25, 0.25, 0.25])
kl_discrete = np.sum(p * np.log(p / q))
print(f"\\nKL(p||uniform) = {kl_discrete:.4f} nats")
print(f"  = {kl_discrete/np.log(2):.4f} bits")

# Cross-entropy = KL + H(p)
h_p = -np.sum(p * np.log(p))
ce = np.sum(-p * np.log(q))
print(f"H(p) = {h_p:.4f}")
print(f"CE(p,q) = {ce:.4f}  (= H(p) + KL(p||q) = {h_p + kl_discrete:.4f})")

# Variational interpretation: KL in VAE ELBO
# ELBO = E_q[log p(x|z)] - KL(q(z|x) || p(z))
# For Gaussian q and standard normal prior:
def kl_diag_gaussian_to_standard(mu, log_var):
    """KL(N(mu, diag(exp(log_var))) || N(0,I))"""
    return -0.5 * np.sum(1 + log_var - mu**2 - np.exp(log_var))

import torch
mu = torch.tensor([0.5, -0.3, 0.1])
log_var = torch.tensor([-0.2, 0.1, -0.5])
kl_vae = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
print(f"\\nVAE KL term: {kl_vae.item():.4f}")
`

export default function KLDivergence() {
  return (
    <div className="space-y-8">
      <NoteBlock title="KL Divergence: The Fundamental Measure of Information">
        <p>
          KL divergence measures how much information is lost when using distribution Q to
          approximate distribution P. It appears everywhere in ML: the ELBO in VAEs, the
          objective in variational inference, the justification for cross-entropy loss,
          and the theoretical analysis of supervised learning.
        </p>
      </NoteBlock>

      <KLViz />

      <DefinitionBlock
        title="KL Divergence"
        definition="For probability distributions $P$ and $Q$ on the same space, the KL divergence (relative entropy) is: $D_{KL}(P \| Q) = \int p(x) \log \frac{p(x)}{q(x)} dx = \mathbb{E}_P\left[\log \frac{p(X)}{q(X)}\right]$. For discrete distributions: $D_{KL}(P \| Q) = \sum_x p(x) \log \frac{p(x)}{q(x)}$. Convention: $0\log(0/q) = 0$ and $p\log(p/0) = +\infty$."
        notation="KL divergence is NOT a distance: $D_{KL}(P\|Q) \neq D_{KL}(Q\|P)$ in general. It is also called relative entropy, information gain, or information divergence."
      />

      <DefinitionBlock
        title="Cross-Entropy Decomposition"
        definition="Cross-entropy decomposes as: $H(P, Q) = \mathbb{E}_P[-\log q(X)] = H(P) + D_{KL}(P\|Q)$ where $H(P) = -\mathbb{E}_P[\log p(X)]$ is the entropy of $P$. Minimizing cross-entropy loss over $Q$ (with fixed $P$) is equivalent to minimizing $D_{KL}(P\|Q)$, since $H(P)$ is constant. This is why cross-entropy is the correct loss for classification."
        notation="Bits: $H(P,Q) = \sum_x -p(x)\log_2 q(x)$. The cross-entropy equals the expected code length when using code $q$ to encode messages drawn from $p$."
      />

      <TheoremBlock
        title="Gibbs' Inequality (Non-negativity of KL)"
        statement="For any probability distributions $P$ and $Q$: $D_{KL}(P \| Q) \geq 0$ with equality if and only if $P = Q$ almost everywhere."
        proof="By Jensen's inequality applied to the concave function $\log$: $-D_{KL}(P\|Q) = \mathbb{E}_P[\log(q(X)/p(X))] \leq \log \mathbb{E}_P[q(X)/p(X)] = \log \int q(x)\,dx = \log 1 = 0$. Equality holds iff $q(x)/p(x)$ is constant $P$-a.s., which requires $p = q$ a.e."
      />

      <ExampleBlock title="KL in Variational Inference (VAE ELBO)">
        <p>
          In a VAE, the encoder outputs parameters <InlineMath math="(\boldsymbol\mu_\phi, \boldsymbol\sigma_\phi)" />
          of a diagonal Gaussian <InlineMath math="q_\phi(\mathbf{z}|\mathbf{x})" />. The KL term
          in the ELBO with standard normal prior <InlineMath math="p(\mathbf{z}) = \mathcal{N}(0,I)" /> is:
        </p>
        <BlockMath math="D_{KL}(q_\phi(\mathbf{z}|\mathbf{x}) \| p(\mathbf{z})) = -\frac{1}{2}\sum_{j=1}^d (1 + \log\sigma_j^2 - \mu_j^2 - \sigma_j^2)" />
        <p>
          This has a closed form, allowing exact computation and backpropagation through the
          KL term without Monte Carlo sampling.
        </p>
      </ExampleBlock>

      <WarningBlock title="Zero-Avoidance vs Zero-Forcing">
        <p>
          The asymmetry of KL divergence has practical consequences: <InlineMath math="D_{KL}(P\|Q)" />
          {' '}is large when <InlineMath math="P" /> has mass where <InlineMath math="Q" /> does not
          (zero-avoiding behavior: Q tries to cover all of P's support). <InlineMath math="D_{KL}(Q\|P)" />
          {' '}is large when <InlineMath math="Q" /> has mass where <InlineMath math="P" /> does not
          (zero-forcing: Q concentrates on P's modes). This choice affects posterior approximation
          quality in variational inference: <InlineMath math="D_{KL}(q\|p)" /> (forward, used in VAE)
          leads to mode-seeking behavior.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
