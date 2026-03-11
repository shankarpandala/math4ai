import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx'

function normalPdf(x, mu, sigma) {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

function normalCdf(x, mu, sigma) {
  const z = (x - mu) / (sigma * Math.sqrt(2))
  // Approximation via error function
  const t = 1 / (1 + 0.3275911 * Math.abs(z))
  const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429]
  const poly = t * (a[0] + t * (a[1] + t * (a[2] + t * (a[3] + t * a[4]))))
  const erf = 1 - poly * Math.exp(-z * z)
  return 0.5 * (1 + (z >= 0 ? erf : -erf))
}

function GaussianViz() {
  const [mu, setMu] = useState(0)
  const [sigma, setSigma] = useState(1)
  const [showCdf, setShowCdf] = useState(false)

  const data = useMemo(() => {
    const points = []
    for (let x = -5; x <= 5; x += 0.1) {
      points.push({
        x: parseFloat(x.toFixed(2)),
        pdf: parseFloat(normalPdf(x, mu, sigma).toFixed(5)),
        cdf: parseFloat(normalCdf(x, mu, sigma).toFixed(5)),
      })
    }
    return points
  }, [mu, sigma])

  const peak = normalPdf(mu, mu, sigma)

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
        Interactive Gaussian Distribution
      </h3>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mean <InlineMath math="\mu" /> = {mu.toFixed(2)}
          </label>
          <input
            type="range" min="-3" max="3" step="0.1"
            value={mu}
            onChange={e => setMu(parseFloat(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Std dev <InlineMath math="\sigma" /> = {sigma.toFixed(2)}
          </label>
          <input
            type="range" min="0.3" max="3" step="0.1"
            value={sigma}
            onChange={e => setSigma(parseFloat(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setShowCdf(false)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${!showCdf ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
        >
          PDF
        </button>
        <button
          onClick={() => setShowCdf(true)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${showCdf ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
        >
          CDF
        </button>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="x" tickCount={11} domain={[-5, 5]} label={{ value: 'x', position: 'insideBottomRight', offset: -10 }} />
          <YAxis domain={[0, showCdf ? 1.05 : Math.max(peak * 1.1, 0.1)]} />
          <Tooltip formatter={v => v.toFixed(4)} />
          <ReferenceLine x={mu} stroke="#6366f1" strokeDasharray="4 2" label={{ value: 'μ', fill: '#6366f1', fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey={showCdf ? 'cdf' : 'pdf'}
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            name={showCdf ? 'CDF Φ(x)' : 'PDF φ(x)'}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-indigo-600">{mu.toFixed(2)}</div>
          <div className="text-gray-500">Mean μ</div>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-indigo-600">{sigma.toFixed(2)}</div>
          <div className="text-gray-500">Std dev σ</div>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-indigo-600">{(sigma * sigma).toFixed(2)}</div>
          <div className="text-gray-500">Variance σ²</div>
        </div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# Define a Gaussian distribution
mu, sigma = 0, 1
X = stats.norm(loc=mu, scale=sigma)

# PDF and CDF
x = np.linspace(-4, 4, 200)
print(f"PDF at x=0: {X.pdf(0):.6f} (= 1/√(2π) ≈ {1/np.sqrt(2*np.pi):.6f})")
print(f"CDF at x=0: {X.cdf(0):.6f} (= 0.5 by symmetry)")

# 68-95-99.7 rule
for n_sigma in [1, 2, 3]:
    prob = X.cdf(n_sigma) - X.cdf(-n_sigma)
    print(f"P(|X| ≤ {n_sigma}σ) = {prob:.4f} ({prob*100:.1f}%)")

# Sample from the distribution
samples = X.rvs(size=1000, random_state=42)
print(f"\\nSample mean: {samples.mean():.4f} (true: {mu})")
print(f"Sample std:  {samples.std():.4f} (true: {sigma})")

# Standardization: Z = (X - μ) / σ ~ N(0,1)
X2 = stats.norm(loc=3, scale=2)
x_val = 5
z = (x_val - 3) / 2
print(f"\\nP(X ≤ 5) where X~N(3,4): {X2.cdf(5):.4f}")
print(f"Same as P(Z ≤ {z}) where Z~N(0,1): {stats.norm.cdf(z):.4f}")

# PyTorch: sample from Normal during VAE reparameterization
import torch
mu_t = torch.zeros(4)
log_var_t = torch.zeros(4)
eps = torch.randn_like(mu_t)
z_t = mu_t + torch.exp(0.5 * log_var_t) * eps  # reparameterization trick`

const REFERENCES = [
  {
    type: 'textbook',
    author: 'Durrett, R.',
    year: 2019,
    title: 'Probability: Theory and Examples (5th ed.)',
    venue: 'Cambridge University Press',
  },
  {
    type: 'textbook',
    author: 'Bishop, C. M.',
    year: 2006,
    title: 'Pattern Recognition and Machine Learning',
    venue: 'Springer',
    note: 'Chapter 2 covers Gaussian distributions in depth for ML.',
  },
  {
    type: 'paper',
    author: 'Gauss, C. F.',
    year: 1809,
    title: 'Theoria Motus Corporum Coelestium',
    venue: 'Hamburg',
    note: 'Original derivation of the normal distribution via least squares.',
  },
  {
    type: 'textbook',
    author: 'Murphy, K. P.',
    year: 2022,
    title: 'Probabilistic Machine Learning: An Introduction',
    venue: 'MIT Press',
    url: 'https://probml.github.io/pml-book/',
  },
]

export default function GaussianDistribution() {
  return (
    <div className="prose-math">
      <NoteBlock type="historical" title="Historical Context">
        <p>
          The normal distribution was first described by Abraham de Moivre in 1733 as an
          approximation to the binomial. Carl Friedrich Gauss used it in 1809 to model
          astronomical measurement errors, deriving it as the unique distribution for which
          the maximum likelihood estimator of the mean is the sample mean — hence the name
          "Gaussian distribution." Pierre-Simon Laplace proved the Central Limit Theorem in
          1812, establishing the Gaussian as the universal attractor for sums of independent random variables.
        </p>
      </NoteBlock>

      <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        The Gaussian (normal) distribution is the single most important probability distribution
        in machine learning and statistics. It appears as the output of the Central Limit Theorem,
        as the maximum entropy distribution for given mean and variance, as the prior and posterior
        in Bayesian linear regression, as the noise model in diffusion models, and as the latent
        space of VAEs.
      </p>

      <DefinitionBlock
        label="Definition"
        title="Gaussian Distribution"
        definition="A continuous random variable $X$ follows a Gaussian (normal) distribution with mean $\mu \in \mathbb{R}$ and variance $\sigma^2 > 0$, written $X \sim \mathcal{N}(\mu, \sigma^2)$, if its probability density function is: $f(x; \mu, \sigma^2) = \frac{1}{\sigma\sqrt{2\pi}} \exp\!\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)$"
        notation="$\phi(x) = \frac{1}{\sqrt{2\pi}} e^{-x^2/2}$ denotes the standard normal PDF; $\Phi(x) = \int_{-\infty}^x \phi(t)\,dt$ denotes the standard normal CDF."
      />

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Interactive Visualization</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Adjust <InlineMath math="\mu" /> and <InlineMath math="\sigma" /> to see how the distribution changes.
        Notice that shifting <InlineMath math="\mu" /> translates the bell curve, while changing{' '}
        <InlineMath math="\sigma" /> controls its width.
      </p>

      <GaussianViz />

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Key Properties</h2>

      <TheoremBlock
        label="Theorem"
        title="68-95-99.7 Rule (Empirical Rule)"
        statement="For $X \sim \mathcal{N}(\mu, \sigma^2)$: $P(|X - \mu| \leq \sigma) \approx 68.27\%$, $P(|X - \mu| \leq 2\sigma) \approx 95.45\%$, $P(|X - \mu| \leq 3\sigma) \approx 99.73\%$."
        proof="These follow from the exact value $P(|Z| \leq k) = \Phi(k) - \Phi(-k) = \text{erf}(k/\sqrt{2})$ where $\text{erf}$ is the error function. Substituting $k=1,2,3$ gives the stated values."
      />

      <TheoremBlock
        label="Theorem"
        title="Maximum Entropy"
        statement="Among all distributions on $\mathbb{R}$ with fixed mean $\mu$ and variance $\sigma^2$, the Gaussian $\mathcal{N}(\mu, \sigma^2)$ maximizes differential entropy $h(X) = -\int f(x) \log f(x)\,dx$. The maximum entropy value is $h(\mathcal{N}) = \frac{1}{2}\log(2\pi e \sigma^2)$ nats."
        proof="Use calculus of variations. We maximize $h(f) = -\int f \log f\,dx$ subject to $\int f = 1$, $\int xf = \mu$, $\int x^2 f = \mu^2 + \sigma^2$. Introducing Lagrange multipliers $\lambda_0, \lambda_1, \lambda_2$ and setting the functional derivative to zero gives $f(x) \propto e^{\lambda_1 x + \lambda_2 x^2}$, which is Gaussian. The constraints determine $\lambda_1 = -\mu/\sigma^2$ and $\lambda_2 = -1/(2\sigma^2)$."
        corollaries={[
          'This justifies assuming Gaussian noise in many regression models — it is the least-informative assumption given only mean and variance.',
          'Gaussian priors in Bayesian neural networks encode maximum uncertainty about weights.',
        ]}
      />

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Standardization & Z-Scores</h2>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        If <InlineMath math="X \sim \mathcal{N}(\mu, \sigma^2)" />, then the standardized variable
      </p>
      <BlockMath math="Z = \frac{X - \mu}{\sigma} \sim \mathcal{N}(0, 1)" />
      <p className="text-gray-700 dark:text-gray-300">
        The <strong>standard normal</strong> <InlineMath math="\mathcal{N}(0,1)" /> has CDF{' '}
        <InlineMath math="\Phi(z)" /> tabulated in every statistics textbook. Any Gaussian probability
        can be computed as <InlineMath math="P(X \leq x) = \Phi\!\left(\frac{x-\mu}{\sigma}\right)" />.
      </p>

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Multivariate Gaussian</h2>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        The multivariate generalization is <InlineMath math="\mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \Sigma)" />
        {' '}with density:
      </p>
      <BlockMath math="f(\mathbf{x}) = \frac{1}{(2\pi)^{d/2} |\Sigma|^{1/2}} \exp\!\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T \Sigma^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)" />
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        where <InlineMath math="\boldsymbol{\mu} \in \mathbb{R}^d" /> is the mean vector and{' '}
        <InlineMath math="\Sigma \in \mathbb{R}^{d \times d}" /> is the symmetric positive definite
        covariance matrix. The level sets are ellipsoids determined by the Mahalanobis distance{' '}
        <InlineMath math="(\mathbf{x}-\boldsymbol{\mu})^T \Sigma^{-1} (\mathbf{x}-\boldsymbol{\mu})" />.
      </p>

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">ML Applications</h2>

      <ExampleBlock title="Reparameterization Trick in VAEs">
        <p>
          In Variational Autoencoders (Kingma & Welling, 2014), the latent variable{' '}
          <InlineMath math="\mathbf{z} \sim q_\phi(\mathbf{z}|\mathbf{x}) = \mathcal{N}(\boldsymbol{\mu}_\phi(\mathbf{x}), \text{diag}(\boldsymbol{\sigma}^2_\phi(\mathbf{x})))" />
          {' '}cannot be sampled in a differentiable way. The reparameterization trick writes:
        </p>
        <BlockMath math="\mathbf{z} = \boldsymbol{\mu}_\phi(\mathbf{x}) + \boldsymbol{\sigma}_\phi(\mathbf{x}) \odot \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})" />
        <p>
          This moves the randomness out of the computational graph, allowing gradients to flow
          back through <InlineMath math="\boldsymbol{\mu}_\phi" /> and{' '}
          <InlineMath math="\boldsymbol{\sigma}_\phi" />.
        </p>
      </ExampleBlock>

      <PythonCode title="Gaussian Distribution in NumPy & PyTorch" code={PYTHON_CODE} />

      <WarningBlock title="Common Mistakes">
        <ul className="mt-2 space-y-1.5 text-sm">
          <li><strong>Normal vs log-normal:</strong> If <InlineMath math="\log X \sim \mathcal{N}(\mu, \sigma^2)" />, then <InlineMath math="X" /> is log-normal, not normal. Log-normal arises in financial returns, word frequencies.</li>
          <li><strong>σ vs σ²:</strong> NumPy's <code>np.random.normal(mu, sigma)</code> takes the standard deviation, not variance. PyTorch's <code>torch.distributions.Normal(mu, sigma)</code> also takes std dev.</li>
          <li><strong>Multivariate normal requires PSD Σ:</strong> A covariance matrix must be positive semidefinite. If you construct Σ empirically, floating point errors can make it non-PSD; use <code>np.linalg.cholesky</code> to check.</li>
          <li><strong>Central Limit Theorem applies to i.i.d. sums:</strong> The CLT does NOT apply to dependent observations or heavy-tailed distributions without finite variance.</li>
        </ul>
      </WarningBlock>

      <ExerciseBlock
        exercises={[
          {
            difficulty: 'beginner',
            question: 'Let $X \\sim \\mathcal{N}(5, 4)$. Find $P(3 \\leq X \\leq 7)$ using standardization.',
            hint: 'Convert to Z-scores: $P(3 \\leq X \\leq 7) = \\Phi(1) - \\Phi(-1)$.',
            solution: '$Z = (X-5)/2$. $P(3 \\leq X \\leq 7) = P(-1 \\leq Z \\leq 1) = \\Phi(1) - \\Phi(-1) \\approx 0.6827$ (68.27%).',
          },
          {
            difficulty: 'intermediate',
            question: 'Prove that if $X \\sim \\mathcal{N}(\\mu_1, \\sigma_1^2)$ and $Y \\sim \\mathcal{N}(\\mu_2, \\sigma_2^2)$ are independent, then $X + Y \\sim \\mathcal{N}(\\mu_1+\\mu_2, \\sigma_1^2+\\sigma_2^2)$.',
            hint: 'Use moment generating functions: $M_{X+Y}(t) = M_X(t) \\cdot M_Y(t)$.',
          },
          {
            difficulty: 'advanced',
            question: 'Derive the KL divergence between two Gaussians: $D_{KL}(\\mathcal{N}(\\mu_1, \\sigma_1^2) \\| \\mathcal{N}(\\mu_2, \\sigma_2^2))$.',
            solution: '$D_{KL} = \\log\\frac{\\sigma_2}{\\sigma_1} + \\frac{\\sigma_1^2 + (\\mu_1-\\mu_2)^2}{2\\sigma_2^2} - \\frac{1}{2}$.',
          },
          {
            difficulty: 'implementation',
            question: 'Implement the reparameterization trick in PyTorch and verify that gradients flow through the sampled latent variable $z$.',
          },
        ]}
      />

      <ReferenceList references={REFERENCES} />
    </div>
  )
}
