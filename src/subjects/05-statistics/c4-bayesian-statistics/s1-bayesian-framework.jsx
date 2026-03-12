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
  if (sigma <= 0) return 0
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

function BayesianViz() {
  const [priorMu, setPriorMu] = useState(0)
  const [priorSigma, setPriorSigma] = useState(2)
  const [dataMean, setDataMean] = useState(3)
  const [n, setN] = useState(5)
  const sigma = 1  // known likelihood std

  const postVar = 1 / (1 / (priorSigma ** 2) + n / (sigma ** 2))
  const postMu = postVar * (priorMu / (priorSigma ** 2) + n * dataMean / (sigma ** 2))
  const postSigma = Math.sqrt(postVar)

  const data = useMemo(() => {
    const pts = []
    for (let x = -8; x <= 8; x += 0.05) {
      pts.push({
        x: parseFloat(x.toFixed(2)),
        prior: normalPdf(x, priorMu, priorSigma),
        likelihood: normalPdf(x, dataMean, sigma / Math.sqrt(n)),
        posterior: normalPdf(x, postMu, postSigma),
      })
    }
    return pts
  }, [priorMu, priorSigma, dataMean, n, postMu, postSigma])

  const maxPdf = Math.max(...data.map(d => Math.max(d.prior, d.likelihood, d.posterior)))

  const W = 480, H = 200
  const padL = 32, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = x => padL + ((x + 8) / 16) * plotW
  const yToSvg = y => padT + plotH - (y / (maxPdf * 1.1)) * plotH

  const makePath = key => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d[key]).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Prior / Likelihood / Posterior</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Gaussian conjugate model. Posterior mean = precision-weighted average of prior mean and data mean.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Prior mean μ₀ = {priorMu.toFixed(1)}</label>
          <input type="range" min="-5" max="5" step="0.5" value={priorMu} onChange={e => setPriorMu(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Prior std σ₀ = {priorSigma.toFixed(1)}</label>
          <input type="range" min="0.5" max="5" step="0.5" value={priorSigma} onChange={e => setPriorSigma(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Data mean x̄ = {dataMean.toFixed(1)}</label>
          <input type="range" min="-5" max="5" step="0.5" value={dataMean} onChange={e => setDataMean(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Observations n = {n}</label>
          <input type="range" min="1" max="50" step="1" value={n} onChange={e => setN(+e.target.value)} className="w-full accent-purple-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[-6, -4, -2, 0, 2, 4, 6].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <path d={makePath('prior')} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.8} />
          <path d={makePath('likelihood')} fill="none" stroke="#10b981" strokeWidth={2} opacity={0.8} />
          <path d={makePath('posterior')} fill="none" stroke="#8b5cf6" strokeWidth={2.5} />
          <text x={padL + 10} y={padT + 14} fontSize="9" fill="#3b82f6">Prior</text>
          <text x={padL + 50} y={padT + 14} fontSize="9" fill="#10b981">Likelihood</text>
          <text x={padL + 116} y={padT + 14} fontSize="9" fill="#8b5cf6">Posterior</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-blue-50 p-2 dark:bg-blue-900/20"><div className="font-mono font-bold text-blue-600">{priorMu.toFixed(2)} ± {priorSigma.toFixed(2)}</div><div className="text-gray-500">Prior μ ± σ</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{dataMean.toFixed(2)} ± {(sigma / Math.sqrt(n)).toFixed(2)}</div><div className="text-gray-500">Likelihood center ± SE</div></div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20"><div className="font-mono font-bold text-purple-600">{postMu.toFixed(3)} ± {postSigma.toFixed(3)}</div><div className="text-gray-500">Posterior μ ± σ</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# Bayesian inference for Gaussian mean (known variance)
np.random.seed(42)
true_mu = 3.0
sigma = 1.0       # known
mu_0, sigma_0 = 0.0, 2.0   # prior

observations = np.random.normal(true_mu, sigma, 20)

# Sequential Bayesian update
current_mu, current_sigma = mu_0, sigma_0
print(f"Prior: N({current_mu:.2f}, {current_sigma:.2f}²)")

for i, x in enumerate(observations[:5]):
    prec_post = 1/current_sigma**2 + 1/sigma**2
    mu_post = (current_mu/current_sigma**2 + x/sigma**2) / prec_post
    sigma_post = 1 / np.sqrt(prec_post)
    current_mu, current_sigma = mu_post, sigma_post
    print(f"After obs {i+1} (x={x:.2f}): posterior N({current_mu:.3f}, {current_sigma:.3f}²)")

# Batch update with all n observations
n = len(observations)
x_bar = observations.mean()
prec_post_full = 1/sigma_0**2 + n/sigma**2
mu_post_full = (mu_0/sigma_0**2 + n*x_bar/sigma**2) / prec_post_full
sigma_post_full = 1 / np.sqrt(prec_post_full)
print(f"\\nBatch posterior (n={n}): N({mu_post_full:.4f}, {sigma_post_full:.4f}²)")
print(f"True mu: {true_mu}")

# 95% credible interval
ci = stats.norm(mu_post_full, sigma_post_full).interval(0.95)
print(f"95% credible interval: [{ci[0]:.3f}, {ci[1]:.3f}]")
`

export default function BayesianFramework() {
  return (
    <div className="space-y-8">
      <NoteBlock title="The Bayesian Perspective">
        <p>
          Bayesian statistics treats parameters as random variables with prior distributions,
          updated by data to form posterior distributions. This provides a principled way to
          incorporate prior knowledge and quantify uncertainty — a natural fit for machine
          learning where model parameters are never known exactly.
        </p>
      </NoteBlock>

      <BayesianViz />

      <DefinitionBlock
        title="Bayes' Theorem for Parameters"
        definition="Given data $\mathbf{x}$ and parameter $\theta$ with prior $p(\theta)$ and likelihood $p(\mathbf{x}|\theta)$, the posterior is: $p(\theta|\mathbf{x}) = \frac{p(\mathbf{x}|\theta)\,p(\theta)}{p(\mathbf{x})} \propto p(\mathbf{x}|\theta)\,p(\theta)$. The marginal likelihood (evidence) $p(\mathbf{x}) = \int p(\mathbf{x}|\theta)p(\theta)\,d\theta$ normalizes the posterior but is often intractable."
        notation="Mnemonic: Posterior ∝ Likelihood × Prior. The posterior encodes everything we know about $\theta$ after seeing data. Point estimates derived from it: MAP (mode), posterior mean, posterior median."
      />

      <DefinitionBlock
        title="Posterior Predictive Distribution"
        definition="The posterior predictive for a new observation $\tilde x$ integrates out parameter uncertainty: $p(\tilde x | \mathbf{x}) = \int p(\tilde x|\theta)\,p(\theta|\mathbf{x})\,d\theta$. This automatically accounts for parameter uncertainty and produces calibrated predictions. For Gaussian models with conjugate priors, this integral is analytically tractable, yielding a Student-t distribution."
        notation="Contrast with plug-in prediction: $p(\tilde x|\hat\theta_{\mathrm{MLE}})$ ignores parameter uncertainty and overconfident for small $n$."
      />

      <TheoremBlock
        title="Bernstein-von Mises Theorem"
        statement="Under regularity conditions, as $n \to \infty$, the posterior distribution concentrates around the true parameter $\theta_0$ and converges (in total variation) to a Gaussian: $p(\theta|\mathbf{x}_{1:n}) \to \mathcal{N}\!\left(\hat\theta_n,\, [n\mathcal{I}(\theta_0)]^{-1}\right)$ where $\hat\theta_n$ is the MLE. Thus Bayesian credible intervals and frequentist confidence intervals become asymptotically equivalent."
        proof="By the Laplace approximation to the posterior: expand $\log p(\mathbf{x}|\theta) + \log p(\theta)$ around $\hat\theta_n$. The second-order term gives a Gaussian. As $n\to\infty$, the data overwhelm the prior (first-order term dominates), and the normalization makes it converge to $\mathcal{N}(\hat\theta_n, [nI(\theta_0)]^{-1})$ regardless of the prior."
      />

      <ExampleBlock title="Bayesian vs Frequentist Inference">
        <p>
          For a coin flip with 3 heads out of 5 flips:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li><strong>Frequentist:</strong> MLE is <InlineMath math="\hat p = 0.6" />. 95% CI: [0.15, 0.95]. No statement about probability of <InlineMath math="p" /> being in any range.</li>
          <li><strong>Bayesian (uniform prior):</strong> <InlineMath math="p|data \sim \mathrm{Beta}(4, 3)" />, mean = 0.571, 95% credible interval: [0.18, 0.92].</li>
          <li><strong>Bayesian (informative prior Beta(2,2)):</strong> <InlineMath math="p|data \sim \mathrm{Beta}(5, 4)" />, mean = 0.556, tighter interval due to prior information.</li>
        </ul>
      </ExampleBlock>

      <WarningBlock title="Prior Sensitivity and Subjectivity">
        <p>
          Bayesian inference requires specifying a prior, which is subjective. For small datasets,
          results can be very sensitive to the prior choice. For large <InlineMath math="n" />, the
          likelihood dominates and the prior has little effect (Bernstein-von Mises). Best practice:
          perform sensitivity analysis with multiple priors (weakly informative, informative, flat),
          and justify choices. Improper priors (<InlineMath math="\int p(\theta)d\theta = \infty" />)
          can sometimes yield proper posteriors but require careful verification.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
