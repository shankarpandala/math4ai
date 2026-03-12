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

function MAPViz() {
  const [priorMu, setPriorMu] = useState(0)
  const [priorSigma, setPriorSigma] = useState(1)
  const [likelihood, setLikelihood] = useState(2)
  const [likeSigma, setLikeSigma] = useState(0.8)

  const data = useMemo(() => {
    const pts = []
    for (let x = -5; x <= 5; x += 0.05) {
      const px = parseFloat(x.toFixed(2))
      const prior = normalPdf(px, priorMu, priorSigma)
      const like = normalPdf(px, likelihood, likeSigma)
      const unnorm = prior * like
      pts.push({ x: px, prior, like, unnorm })
    }
    const maxUnnorm = Math.max(...pts.map(p => p.unnorm))
    return pts.map(p => ({ ...p, posterior: maxUnnorm > 0 ? p.unnorm / maxUnnorm : 0 }))
  }, [priorMu, priorSigma, likelihood, likeSigma])

  // MAP estimate: posterior mu
  const postVar = 1 / (1 / (priorSigma * priorSigma) + 1 / (likeSigma * likeSigma))
  const postMu = postVar * (priorMu / (priorSigma * priorSigma) + likelihood / (likeSigma * likeSigma))
  const mle = likelihood

  const W = 480, H = 220
  const padL = 40, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = x => padL + ((x + 5) / 10) * plotW
  const yToSvg = y => padT + plotH - y * plotH

  const priorPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.prior / Math.max(...data.map(p => p.prior))).toFixed(1)}`).join(' ')
  const likePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.like / Math.max(...data.map(p => p.like))).toFixed(1)}`).join(' ')
  const postPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.posterior).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Prior × Likelihood → Posterior</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust the prior and likelihood parameters. MAP = <strong className="text-purple-600">{postMu.toFixed(3)}</strong>, MLE = <strong className="text-emerald-600">{mle.toFixed(2)}</strong>
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Prior mean μ₀ = {priorMu.toFixed(1)}</label>
          <input type="range" min="-3" max="3" step="0.1" value={priorMu} onChange={e => setPriorMu(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Prior std σ₀ = {priorSigma.toFixed(1)}</label>
          <input type="range" min="0.3" max="3" step="0.1" value={priorSigma} onChange={e => setPriorSigma(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Data mean x̄ = {likelihood.toFixed(1)}</label>
          <input type="range" min="-3" max="3" step="0.1" value={likelihood} onChange={e => setLikelihood(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Likelihood std σ = {likeSigma.toFixed(1)}</label>
          <input type="range" min="0.2" max="2" step="0.1" value={likeSigma} onChange={e => setLikeSigma(+e.target.value)} className="w-full accent-emerald-500" />
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
          <path d={priorPath} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.8} />
          <path d={likePath} fill="none" stroke="#10b981" strokeWidth={2} opacity={0.8} />
          <path d={postPath} fill="none" stroke="#8b5cf6" strokeWidth={2.5} />
          <line x1={xToSvg(postMu)} y1={padT} x2={xToSvg(postMu)} y2={padT + plotH} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 2" />
          <line x1={xToSvg(mle)} y1={padT} x2={xToSvg(mle)} y2={padT + plotH} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={padL + 8} y={padT + 12} fontSize="9" fill="#3b82f6">Prior</text>
          <text x={padL + 48} y={padT + 12} fontSize="9" fill="#10b981">Likelihood</text>
          <text x={padL + 108} y={padT + 12} fontSize="9" fill="#8b5cf6">Posterior</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-blue-50 p-2 dark:bg-blue-900/20"><div className="font-mono font-bold text-blue-600">{priorMu.toFixed(2)}</div><div className="text-gray-500">Prior μ₀</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{mle.toFixed(2)}</div><div className="text-gray-500">MLE</div></div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20"><div className="font-mono font-bold text-purple-600">{postMu.toFixed(3)}</div><div className="text-gray-500">MAP</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

# MAP estimation for Gaussian with known variance
# Prior: mu ~ N(mu_0, sigma_0^2), Likelihood: x_i ~ N(mu, sigma^2)

sigma_0 = 1.0    # prior std
sigma = 0.5      # known likelihood std
mu_0 = 0.0       # prior mean

np.random.seed(42)
true_mu = 2.0
data = np.random.normal(true_mu, sigma, size=10)

# Posterior parameters (conjugate update)
n = len(data)
x_bar = data.mean()

post_var = 1 / (1/sigma_0**2 + n/sigma**2)
post_mu = post_var * (mu_0/sigma_0**2 + n*x_bar/sigma**2)

print(f"MLE: {x_bar:.4f}")
print(f"MAP: {post_mu:.4f}  (posterior mean = MAP for Gaussian)")
print(f"True mu: {true_mu:.4f}")
print(f"Posterior std: {np.sqrt(post_var):.4f}")

# As n -> infinity, MAP -> MLE
for n_samples in [1, 5, 20, 100, 1000]:
    d = np.random.normal(true_mu, sigma, size=n_samples)
    pv = 1 / (1/sigma_0**2 + n_samples/sigma**2)
    pm = pv * (mu_0/sigma_0**2 + n_samples*d.mean()/sigma**2)
    print(f"n={n_samples:4d}: MLE={d.mean():.3f}, MAP={pm:.3f}")
`

export default function MAPEstimation() {
  return (
    <div className="space-y-8">
      <NoteBlock title="MAP vs MLE">
        <p>
          Maximum A Posteriori (MAP) estimation incorporates a prior belief about the parameter,
          making it a middle ground between MLE (no prior) and full Bayesian inference
          (entire posterior). As sample size grows, MAP converges to MLE.
        </p>
      </NoteBlock>

      <MAPViz />

      <DefinitionBlock
        title="MAP Estimator"
        definition="Given observed data $\mathbf{x}$ and prior $p(\theta)$, the MAP estimator maximizes the posterior: $\hat{\theta}_{\mathrm{MAP}} = \operatorname{argmax}_\theta \; p(\theta \mid \mathbf{x}) = \operatorname{argmax}_\theta \left[ \log p(\mathbf{x} \mid \theta) + \log p(\theta) \right]$. Unlike MLE which maximizes only $\log p(\mathbf{x}|\theta)$, MAP adds the log-prior as a regularization term."
        notation="By Bayes' theorem: $p(\theta|\mathbf{x}) \propto p(\mathbf{x}|\theta)\,p(\theta)$. Taking logs: $\log p(\theta|\mathbf{x}) = \ell(\theta) + \log p(\theta) + \text{const}$."
      />

      <DefinitionBlock
        title="Gaussian Conjugate MAP"
        definition="For $x_1,\ldots,x_n \sim \mathcal{N}(\mu, \sigma^2)$ with known $\sigma^2$ and prior $\mu \sim \mathcal{N}(\mu_0, \sigma_0^2)$, the MAP estimate equals the posterior mean: $\hat{\mu}_{\mathrm{MAP}} = \frac{\sigma^{-2}\bar{x} + \sigma_0^{-2}\mu_0}{\sigma^{-2} + \sigma_0^{-2}} \cdot n / (n + \sigma^2/\sigma_0^2) \cdot \bar{x} + \frac{\sigma^2/\sigma_0^2}{n + \sigma^2/\sigma_0^2} \cdot \mu_0$"
        notation="This is a precision-weighted average of the prior mean $\mu_0$ and sample mean $\bar{x}$. Precision = inverse variance."
      />

      <TheoremBlock
        title="MAP as Regularized MLE"
        statement="Under a Gaussian prior $\theta \sim \mathcal{N}(0, \lambda^{-1} I)$, MAP estimation is equivalent to L2-regularized (ridge) MLE: $\hat{\theta}_{\mathrm{MAP}} = \operatorname{argmax}_\theta \left[\ell(\theta) - \frac{\lambda}{2}\|\theta\|^2\right]$. Under a Laplace prior $p(\theta_j) \propto e^{-\lambda|\theta_j|}$, MAP corresponds to L1-regularized (lasso) estimation."
        proof="Taking $\log p(\theta) = -\frac{\lambda}{2}\|\theta\|^2 + \text{const}$ for a Gaussian prior with precision $\lambda$ and adding to the log-likelihood gives the ridge objective. The MAP is then equivalent to minimizing $-\ell(\theta) + \frac{\lambda}{2}\|\theta\|^2$. For the Laplace prior $p(\theta_j) \propto e^{-\lambda|\theta_j|}$, $\log p(\theta) = -\lambda\sum_j |\theta_j| + \text{const}$, yielding the lasso penalty."
      />

      <ExampleBlock title="Bayesian Linear Regression MAP">
        <p>
          For linear regression <InlineMath math="\mathbf{y} = X\boldsymbol{\beta} + \boldsymbol{\epsilon}" />{' '}
          with <InlineMath math="\boldsymbol{\epsilon} \sim \mathcal{N}(0, \sigma^2 I)" /> and prior{' '}
          <InlineMath math="\boldsymbol{\beta} \sim \mathcal{N}(0, \tau^2 I)" />, the MAP estimate is:
        </p>
        <BlockMath math="\hat{\boldsymbol{\beta}}_{\mathrm{MAP}} = (X^T X + \lambda I)^{-1} X^T \mathbf{y}, \quad \lambda = \sigma^2/\tau^2" />
        <p>
          This is exactly ridge regression! The regularization coefficient <InlineMath math="\lambda" /> equals
          the ratio of noise variance to prior variance. Strong prior (small <InlineMath math="\tau^2" />)
          → large regularization → coefficients shrunk toward zero.
        </p>
      </ExampleBlock>

      <WarningBlock title="MAP is Not the Full Posterior">
        <p>
          MAP gives a single point estimate, discarding all uncertainty information encoded in
          the posterior distribution. Unlike full Bayesian inference, MAP cannot provide credible
          intervals, and can be sensitive to the parameterization: if <InlineMath math="\hat\theta" /> is
          the MAP of <InlineMath math="\theta" />, then <InlineMath math="g(\hat\theta)" /> is generally
          NOT the MAP of <InlineMath math="g(\theta)" /> (unless <InlineMath math="g" /> is linear).
          For small datasets, full posterior inference is usually preferable.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
