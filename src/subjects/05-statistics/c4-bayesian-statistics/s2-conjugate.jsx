import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function betaPdf(x, a, b) {
  if (x <= 0 || x >= 1) return 0
  // log Beta function via log-gamma approximation
  function logGamma(n) {
    if (n <= 0) return 0
    if (n < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * n)) - logGamma(1 - n)
    let x = n - 1
    let result = 0.5 * Math.log(2 * Math.PI)
    result += (x + 0.5) * Math.log(x + 5.5) - (x + 5.5)
    const coeffs = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5.395239384953e-6]
    let ser = 1.000000000190015
    for (let i = 0; i < 6; i++) ser += coeffs[i] / (x + i + 1)
    return result + Math.log(ser)
  }
  const logB = logGamma(a) + logGamma(b) - logGamma(a + b)
  return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB)
}

function ConjugateViz() {
  const [alpha0, setAlpha0] = useState(2)
  const [beta0, setBeta0] = useState(2)
  const [heads, setHeads] = useState(7)
  const [tails, setTails] = useState(3)

  const alphaN = alpha0 + heads
  const betaN = beta0 + tails
  const priorMean = alpha0 / (alpha0 + beta0)
  const postMean = alphaN / (alphaN + betaN)
  const mle = heads / (heads + tails)

  const data = useMemo(() => {
    const pts = []
    for (let p = 0.01; p <= 0.99; p += 0.01) {
      pts.push({
        p: parseFloat(p.toFixed(2)),
        prior: betaPdf(p, alpha0, beta0),
        posterior: betaPdf(p, alphaN, betaN),
      })
    }
    const maxV = Math.max(...pts.map(d => Math.max(d.prior, d.posterior)))
    return { pts, maxV }
  }, [alpha0, beta0, alphaN, betaN])

  const W = 480, H = 200
  const padL = 32, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = p => padL + (p - 0.01) / 0.98 * plotW
  const yToSvg = y => padT + plotH - (y / (data.maxV * 1.1)) * plotH

  const priorPath = data.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.p).toFixed(1)},${yToSvg(d.prior).toFixed(1)}`).join(' ')
  const postPath = data.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.p).toFixed(1)},${yToSvg(d.posterior).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Beta-Binomial Conjugate Updater</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Prior Beta(α₀, β₀) + data (k heads, n-k tails) → Posterior Beta(α₀+k, β₀+n-k)
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Prior α₀ = {alpha0}</label>
          <input type="range" min="1" max="20" step="1" value={alpha0} onChange={e => setAlpha0(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Prior β₀ = {beta0}</label>
          <input type="range" min="1" max="20" step="1" value={beta0} onChange={e => setBeta0(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Heads k = {heads}</label>
          <input type="range" min="0" max="50" step="1" value={heads} onChange={e => setHeads(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Tails n-k = {tails}</label>
          <input type="range" min="0" max="50" step="1" value={tails} onChange={e => setTails(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[0, 0.25, 0.5, 0.75, 1].map(v => (
            <g key={v}>
              <line x1={xToSvg(Math.max(0.01, Math.min(0.99, v)))} y1={padT + plotH} x2={xToSvg(Math.max(0.01, Math.min(0.99, v)))} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(Math.max(0.01, Math.min(0.99, v)))} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <path d={priorPath} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.7} />
          <path d={postPath} fill="none" stroke="#8b5cf6" strokeWidth={2.5} />
          {/* MLE marker */}
          <line x1={xToSvg(mle)} y1={padT} x2={xToSvg(mle)} y2={padT + plotH} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={xToSvg(mle) + 4} y={padT + 20} fontSize="9" fill="#10b981">MLE={mle.toFixed(2)}</text>
          <text x={padL + 10} y={padT + 14} fontSize="9" fill="#3b82f6">Prior Beta({alpha0},{beta0})</text>
          <text x={padL + 10} y={padT + 26} fontSize="9" fill="#8b5cf6">Post Beta({alphaN},{betaN})</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-blue-50 p-2 dark:bg-blue-900/20"><div className="font-mono font-bold text-blue-600">{priorMean.toFixed(3)}</div><div className="text-gray-500">Prior mean</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{mle.toFixed(3)}</div><div className="text-gray-500">MLE</div></div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20"><div className="font-mono font-bold text-purple-600">{postMean.toFixed(3)}</div><div className="text-gray-500">Post mean (MAP)</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

# Beta-Binomial conjugate
alpha_0, beta_0 = 2, 2   # prior: Beta(2,2) ~ weakly informative
n, k = 20, 14             # 14 heads in 20 flips

alpha_n = alpha_0 + k
beta_n = beta_0 + (n - k)
post = stats.beta(alpha_n, beta_n)

print(f"Prior: Beta({alpha_0}, {beta_0}), mean = {alpha_0/(alpha_0+beta_0):.3f}")
print(f"MLE: {k/n:.3f}")
print(f"Posterior: Beta({alpha_n}, {beta_n}), mean = {post.mean():.3f}")
print(f"Posterior mode (MAP) = {(alpha_n-1)/(alpha_n+beta_n-2):.3f}")
print(f"95% credible interval: {post.interval(0.95)}")

# Gaussian-Gaussian conjugate (known variance)
mu_0, tau_0 = 0, 1   # prior N(mu_0, tau_0^2)
sigma = 1              # known noise std
observations = np.random.normal(3.0, sigma, 10)

def gaussian_update(mu_0, tau_0, observations, sigma):
    n = len(observations)
    x_bar = observations.mean()
    tau_n_sq = 1 / (1/tau_0**2 + n/sigma**2)
    mu_n = tau_n_sq * (mu_0/tau_0**2 + n*x_bar/sigma**2)
    return mu_n, np.sqrt(tau_n_sq)

mu_n, tau_n = gaussian_update(mu_0, tau_0, observations, sigma)
print(f"\\nGaussian posterior: N({mu_n:.4f}, {tau_n:.4f}^2)")

# Gamma-Poisson conjugate
alpha_p, beta_p = 2, 1   # prior Gamma(2,1) for Poisson rate
counts = np.random.poisson(5, 15)
alpha_post = alpha_p + counts.sum()
beta_post = beta_p + len(counts)
post_rate = stats.gamma(alpha_post, scale=1/beta_post)
print(f"\\nPoisson rate posterior: Gamma({alpha_post}, {beta_post})")
print(f"Posterior mean rate: {post_rate.mean():.3f}")
`

export default function ConjugatePriors() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Conjugacy: Closed-Form Posteriors">
        <p>
          Conjugate priors are special priors where the posterior belongs to the same family
          as the prior. This provides analytical tractability — no numerical integration needed.
          The exponential family has a conjugate prior for every member, making it the
          natural framework for conjugate analysis.
        </p>
      </NoteBlock>

      <ConjugateViz />

      <DefinitionBlock
        title="Conjugate Prior"
        definition="A prior $p(\theta)$ is conjugate to a likelihood $p(\mathbf{x}|\theta)$ if the posterior $p(\theta|\mathbf{x}) \propto p(\mathbf{x}|\theta)p(\theta)$ belongs to the same parametric family as $p(\theta)$. Key examples: Beta is conjugate to Binomial; Gaussian is conjugate to Gaussian (known variance); Gamma is conjugate to Poisson; Dirichlet is conjugate to Multinomial."
        notation="The Beta-Binomial pair: Beta($\alpha$, $\beta$) prior + $k$ successes in $n$ trials → Beta($\alpha+k$, $\beta+n-k$) posterior. Update rule: add counts to hyperparameters."
      />

      <DefinitionBlock
        title="Exponential Family Conjugate"
        definition="For exponential family likelihoods $p(\mathbf{x}|\boldsymbol\eta) = h(\mathbf{x})\exp(\boldsymbol\eta^T T(\mathbf{x}) - A(\boldsymbol\eta))$, the conjugate prior is $p(\boldsymbol\eta|\boldsymbol\chi, \nu) \propto \exp(\boldsymbol\eta^T\boldsymbol\chi - \nu A(\boldsymbol\eta))$. After observing $n$ i.i.d. samples, the posterior hyperparameters update as: $\boldsymbol\chi \leftarrow \boldsymbol\chi + \sum_i T(\mathbf{x}_i)$, $\nu \leftarrow \nu + n$."
        notation="The hyperparameters $(\boldsymbol\chi, \nu)$ have interpretations as 'pseudo-observations': $\nu$ is the effective prior sample size, and $\boldsymbol\chi/\nu$ is the prior sufficient statistic."
      />

      <TheoremBlock
        title="Gaussian-Gaussian Conjugate Update"
        statement="For $X_1,\ldots,X_n \sim \mathcal{N}(\mu, \sigma^2)$ with known $\sigma^2$ and prior $\mu \sim \mathcal{N}(\mu_0, \tau_0^2)$, the posterior is $\mu|\mathbf{x} \sim \mathcal{N}(\mu_n, \tau_n^2)$ where: $\frac{1}{\tau_n^2} = \frac{1}{\tau_0^2} + \frac{n}{\sigma^2}, \quad \mu_n = \tau_n^2\left(\frac{\mu_0}{\tau_0^2} + \frac{n\bar x}{\sigma^2}\right)$. The posterior precision is the sum of prior and likelihood precisions."
        proof="The posterior log-density is $\log p(\mu|\mathbf{x}) = -\frac{(\mu-\mu_0)^2}{2\tau_0^2} - \sum_i \frac{(x_i-\mu)^2}{2\sigma^2} + \text{const}$. Complete the square in $\mu$: collect all $\mu^2$ terms to get $-\frac{\mu^2}{2}(1/\tau_0^2 + n/\sigma^2)$ and linear terms to get $\mu({\mu_0}/{\tau_0^2} + {n\bar x}/{\sigma^2})$. This is a Gaussian in $\mu$ with the stated precision and mean."
      />

      <ExampleBlock title="Dirichlet-Multinomial for Language Models">
        <p>
          In language modeling, word counts follow a Multinomial distribution over a vocabulary.
          The Dirichlet prior is conjugate: if <InlineMath math="\boldsymbol\theta \sim \mathrm{Dir}(\boldsymbol\alpha)" />
          and we observe counts <InlineMath math="\mathbf{c}" />, the posterior is:
        </p>
        <BlockMath math="\boldsymbol\theta|\mathbf{c} \sim \mathrm{Dir}(\boldsymbol\alpha + \mathbf{c})" />
        <p>
          The Bayesian predictive probability (Laplace smoothing) is{' '}
          <InlineMath math="P(\text{word}_j) = (\alpha_j + c_j) / (\sum_k \alpha_k + N)" />, which
          avoids zero probabilities for unseen words. This is the foundation of naive Bayes classifiers.
        </p>
      </ExampleBlock>

      <WarningBlock title="Conjugacy Doesn't Always Exist">
        <p>
          Not all likelihood-prior combinations admit conjugate forms. Neural networks, nonparametric
          models, and most real-world models lack conjugate posteriors. In these cases, use:
          (1) Variational inference (ELBO optimization); (2) MCMC sampling (Metropolis-Hastings,
          HMC); (3) Laplace approximation (Gaussian approximation to the posterior mode).
          Modern probabilistic programming (PyMC, Stan, NumPyro) automates inference for
          non-conjugate models.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
