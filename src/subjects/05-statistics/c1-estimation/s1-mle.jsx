import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'

// ---------------------------------------------------------------------------
// Interactive Log-Likelihood Visualizer for Bernoulli(p)
// ---------------------------------------------------------------------------
function LogLikelihoodViz() {
  const [n, setN] = useState(20)
  const [k, setK] = useState(12)

  // Clamp k to [0, n]
  const safeK = Math.min(k, n)
  const mle = n > 0 ? safeK / n : 0

  // Build SVG curve points for ℓ(p) = k·log(p) + (n-k)·log(1-p)
  // over p ∈ [0.01, 0.99]
  const { maxLL, minLL, points } = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 196; i++) {
      const p = 0.01 + i * (0.98 / 196)
      const ll =
        safeK * Math.log(p) + (n - safeK) * Math.log(1 - p)
      pts.push({ p, ll })
    }
    const lls = pts.map((d) => d.ll).filter(isFinite)
    const maxL = Math.max(...lls)
    const minL = Math.min(...lls)
    return { points: pts, maxLL: maxL, minLL: minL }
  }, [n, safeK])

  // SVG viewport: 480 × 220
  const W = 480
  const H = 220
  const padL = 52
  const padR = 20
  const padT = 16
  const padB = 36

  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const llRange = maxLL - minLL || 1

  function xPos(p) {
    return padL + ((p - 0.01) / 0.98) * plotW
  }
  function yPos(ll) {
    if (!isFinite(ll)) return padT + plotH
    return padT + plotH - ((ll - minLL) / llRange) * plotH
  }

  const pathD = points
    .filter((d) => isFinite(d.ll))
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(d.p).toFixed(1)},${yPos(d.ll).toFixed(1)}`)
    .join(' ')

  const mleLine = xPos(mle)
  const mleY = yPos(mle > 0 && mle < 1 ? safeK * Math.log(mle) + (n - safeK) * Math.log(1 - mle) : minLL)

  // Y-axis ticks (3 ticks)
  const yTicks = [minLL, (minLL + maxLL) / 2, maxLL]

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
        Interactive Log-Likelihood: Bernoulli(<InlineMath math="p" />)
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust <InlineMath math="n" /> (total trials) and <InlineMath math="k" /> (successes).
        The log-likelihood <InlineMath math="\ell(p) = k\log p + (n-k)\log(1-p)" /> is
        maximized at the MLE <InlineMath math="\hat{p} = k/n" /> (vertical line).
      </p>

      <div className="mb-5 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Total trials <InlineMath math="n" /> = {n}
          </label>
          <input
            type="range" min="10" max="100" step="1"
            value={n}
            onChange={(e) => {
              const newN = parseInt(e.target.value)
              setN(newN)
              if (k > newN) setK(newN)
            }}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Successes <InlineMath math="k" /> = {safeK}
          </label>
          <input
            type="range" min="0" max={n} step="1"
            value={safeK}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      {/* SVG plot */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-inner dark:bg-gray-800">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
          {/* Grid lines */}
          {yTicks.map((v, i) => (
            <line
              key={i}
              x1={padL} y1={yPos(v).toFixed(1)}
              x2={W - padR} y2={yPos(v).toFixed(1)}
              stroke="#374151" strokeOpacity={0.2} strokeDasharray="4 3"
            />
          ))}

          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />

          {/* Y-axis ticks & labels */}
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={padL - 4} y1={yPos(v).toFixed(1)} x2={padL} y2={yPos(v).toFixed(1)} stroke="#9ca3af" strokeWidth={1} />
              <text
                x={padL - 7} y={parseFloat(yPos(v).toFixed(1)) + 4}
                textAnchor="end" fontSize="9" fill="#9ca3af"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}

          {/* X-axis ticks */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
            <g key={v}>
              <line x1={xPos(Math.max(0.01, Math.min(0.99, v)))} y1={padT + plotH} x2={xPos(Math.max(0.01, Math.min(0.99, v)))} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text
                x={xPos(Math.max(0.01, Math.min(0.99, v)))} y={padT + plotH + 14}
                textAnchor="middle" fontSize="9" fill="#9ca3af"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="11" fill="#6b7280">p</text>
          <text
            x={12} y={padT + plotH / 2}
            textAnchor="middle" fontSize="10" fill="#6b7280"
            transform={`rotate(-90, 12, ${padT + plotH / 2})`}
          >
            ℓ(p)
          </text>

          {/* Log-likelihood curve */}
          <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* MLE vertical line */}
          {mle > 0.01 && mle < 0.99 && (
            <>
              <line
                x1={mleLine.toFixed(1)} y1={padT}
                x2={mleLine.toFixed(1)} y2={padT + plotH}
                stroke="#10b981" strokeWidth={1.8} strokeDasharray="5 3"
              />
              <circle cx={mleLine.toFixed(1)} cy={mleY.toFixed(1)} r={4} fill="#10b981" />
              <text
                x={parseFloat(mleLine.toFixed(1)) + 6} y={padT + 14}
                fontSize="10" fill="#10b981" fontWeight="600"
              >
                p̂={mle.toFixed(2)}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-indigo-600">{n}</div>
          <div className="text-gray-500">Trials n</div>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-emerald-600">{safeK}</div>
          <div className="text-gray-500">Successes k</div>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-indigo-600">{mle.toFixed(3)}</div>
          <div className="text-gray-500">MLE p̂ = k/n</div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------
const PYTHON_CODE = `import numpy as np
from scipy import stats
from scipy.optimize import minimize

# ── Manual MLE for Gaussian ─────────────────────────────────────────────────
rng = np.random.default_rng(42)
data = rng.normal(loc=3.0, scale=2.0, size=200)

# Analytic MLE (closed-form)
mu_hat   = data.mean()
sigma_hat = data.std(ddof=0)   # biased (MLE uses 1/n, not 1/(n-1))
print(f"Analytic MLE:  μ̂ = {mu_hat:.4f}, σ̂ = {sigma_hat:.4f}")

# Numeric MLE via scipy.optimize.minimize (negative log-likelihood)
def neg_log_likelihood(params):
    mu, log_sigma = params
    sigma = np.exp(log_sigma)   # enforce σ > 0 by optimizing log σ
    return -np.sum(stats.norm.logpdf(data, loc=mu, scale=sigma))

result = minimize(
    neg_log_likelihood,
    x0=[0.0, 0.0],              # initial guess for [μ, log σ]
    method='L-BFGS-B',
)
mu_opt, log_sigma_opt = result.x
print(f"Numerical MLE: μ̂ = {mu_opt:.4f}, σ̂ = {np.exp(log_sigma_opt):.4f}")

# ── scipy.stats fitting ─────────────────────────────────────────────────────
mu_fit, sigma_fit = stats.norm.fit(data)
print(f"scipy.stats:   μ̂ = {mu_fit:.4f}, σ̂ = {sigma_fit:.4f}")

# ── Bernoulli MLE ───────────────────────────────────────────────────────────
bernoulli_data = rng.binomial(1, 0.7, size=500)
p_hat = bernoulli_data.mean()
print(f"\\nBernoulli MLE: p̂ = {p_hat:.4f}  (true p = 0.70)")

# ── Fisher information for Gaussian ─────────────────────────────────────────
# I(μ) = 1/σ², I(σ²) = 1/(2σ⁴)  → asymptotic variance of MLE
n = len(data)
sigma_true = 2.0
se_mu = sigma_true / np.sqrt(n)        # std error of μ̂
se_sigma2 = sigma_true**2 * np.sqrt(2/n)  # std error of σ̂²
print(f"\\nAsymptotic SE of μ̂:  {se_mu:.4f}")
print(f"Asymptotic SE of σ̂²: {se_sigma2:.4f}")

# ── Logistic regression (cross-entropy = negative log-likelihood) ────────────
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

X_cls, y_cls = make_classification(n_samples=300, n_features=5, random_state=0)
lr = LogisticRegression(C=1e6, max_iter=1000)  # C→∞ ≈ no regularization = pure MLE
lr.fit(X_cls, y_cls)
print(f"\\nLogistic regression coefficients (MLE): {lr.coef_[0].round(3)}")`

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------
const REFERENCES = [
  {
    type: 'foundational',
    authors: 'Fisher, R. A.',
    year: 1922,
    title: 'On the Mathematical Foundations of Theoretical Statistics',
    venue: 'Philosophical Transactions of the Royal Society A, 222, 309–368',
    whyImportant: 'The paper that introduced maximum likelihood estimation and established its asymptotic efficiency properties.',
  },
  {
    type: 'foundational',
    authors: 'Cramér, H.',
    year: 1946,
    title: 'Mathematical Methods of Statistics',
    venue: 'Princeton University Press',
    whyImportant: 'Proved the Cramér–Rao lower bound showing MLE achieves minimum variance asymptotically.',
  },
  {
    type: 'foundational',
    authors: 'Rao, C. R.',
    year: 1945,
    title: 'Information and the Accuracy Attainable in the Estimation of Statistical Parameters',
    venue: 'Bulletin of the Calcutta Mathematical Society, 37, 81–91',
    whyImportant: 'Independently derived the information lower bound (Cramér–Rao bound) and the concept of Fisher information.',
  },
  {
    type: 'textbook',
    authors: 'Casella, G. & Berger, R. L.',
    year: 2002,
    title: 'Statistical Inference (2nd ed.)',
    venue: 'Duxbury Press',
    whyImportant: 'The standard graduate-level reference for MLE theory, sufficiency, and asymptotic results.',
  },
  {
    type: 'textbook',
    authors: 'Murphy, K. P.',
    year: 2022,
    title: 'Probabilistic Machine Learning: An Introduction',
    venue: 'MIT Press',
    url: 'https://probml.github.io/pml-book/',
    whyImportant: 'Chapter 4 gives a modern ML perspective on MLE, MAP, and Bayesian estimation with practical examples.',
  },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function MaximumLikelihoodEstimation() {
  return (
    <div className="prose-math mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Maximum Likelihood Estimation
      </h1>
      <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
        The fundamental principle for fitting parametric models to data.
      </p>

      {/* Historical context */}
      <NoteBlock type="historical" title="Historical Context">
        <p>
          Maximum likelihood estimation was introduced by{' '}
          <strong>Ronald A. Fisher</strong> in a 1912 undergraduate essay and developed more
          fully in his landmark 1922 paper "On the Mathematical Foundations of Theoretical
          Statistics." Fisher coined the term <em>likelihood</em> to distinguish the function of
          the parameter (given fixed data) from the probability (function of data given fixed
          parameter). He proved that MLE is consistent, asymptotically normal, and achieves the
          Cramér–Rao lower bound — making it asymptotically efficient. Before Fisher, Gauss and
          Laplace had used least-squares and method-of-moments, but MLE provided a systematic
          principle applicable to any parametric family.
        </p>
      </NoteBlock>

      <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        Maximum Likelihood Estimation (MLE) is the cornerstone of statistical inference and
        a ubiquitous tool in machine learning. Training a neural network with cross-entropy loss,
        fitting a logistic regression, or calibrating a Gaussian mixture model all reduce to
        maximizing a likelihood function. Understanding MLE formally reveals why these loss
        functions arise naturally, and what their solutions guarantee.
      </p>

      {/* Core definitions */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Likelihood and Log-Likelihood</h2>

      <DefinitionBlock
        label="Definition 1.1"
        title="Likelihood Function"
        definition="Given a parametric family $\{p(\mathbf{x};\theta) : \theta \in \Theta\}$ and observed data $\mathbf{x}$, the likelihood function is $L(\theta; \mathbf{x}) = p(\mathbf{x}; \theta)$, viewed as a function of $\theta$ for fixed $\mathbf{x}$. For an i.i.d. sample $\mathbf{x}_1, \ldots, \mathbf{x}_n$, the joint likelihood factors as $L(\theta; \mathbf{x}_{1:n}) = \prod_{i=1}^n p(\mathbf{x}_i; \theta)$."
        notation="The log-likelihood $\ell(\theta) = \log L(\theta; \mathbf{x}) = \sum_{i=1}^n \log p(\mathbf{x}_i; \theta)$ is computationally and analytically more convenient: it converts products into sums and is monotone in $L$, so maximizers coincide."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Maximum Likelihood Estimator"
        definition="The maximum likelihood estimator (MLE) is $\hat{\theta}_{\mathrm{MLE}} = \operatorname{argmax}_{\theta \in \Theta} \ell(\theta)$. When $\ell$ is differentiable and the maximum is interior to $\Theta$, the MLE solves the score equation $\nabla_\theta \ell(\theta) = \mathbf{0}$, where the score function $s(\theta) = \nabla_\theta \log p(\mathbf{x};\theta)$ has the key property $\mathbb{E}_\theta[s(\theta)] = \mathbf{0}$."
        notation="The Fisher information matrix quantifies the curvature of the log-likelihood: $\mathcal{I}(\theta) = -\mathbb{E}_\theta\!\left[\nabla^2_\theta \ell(\theta)/n\right] = \mathbb{E}_\theta[s(\theta)s(\theta)^T]$."
      />

      {/* Interactive visualization */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Interactive Visualization</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        For <InlineMath math="X_1, \ldots, X_n \overset{\text{iid}}{\sim} \mathrm{Bernoulli}(p)" />,
        the log-likelihood is <InlineMath math="\ell(p) = k\log p + (n-k)\log(1-p)" /> where{' '}
        <InlineMath math="k = \sum X_i" />. The peak is always at{' '}
        <InlineMath math="\hat{p} = k/n" />. Notice how the curve becomes sharper (more information)
        as <InlineMath math="n" /> grows — this reflects the Fisher information scaling as <InlineMath math="n \cdot \mathcal{I}_1(\theta)" />.
      </p>

      <LogLikelihoodViz />

      {/* Asymptotic theorem */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Asymptotic Theory</h2>

      <TheoremBlock
        label="Theorem 1.1"
        title="Asymptotic Normality of MLE"
        statement="Under regularity conditions (correct model specification, identifiability, twice-differentiable log-likelihood, interior true parameter $\theta_0$), the MLE satisfies: $\sqrt{n}\,(\hat{\theta}_n - \theta_0) \xrightarrow{d} \mathcal{N}\!\left(\mathbf{0},\; \mathcal{I}(\theta_0)^{-1}\right)$ where $\mathcal{I}(\theta_0) = -\mathbb{E}_{\theta_0}[\nabla^2_\theta \log p(X;\theta_0)]$ is the Fisher information matrix. Moreover, the MLE is asymptotically efficient: no regular estimator has smaller asymptotic variance (Cramér–Rao bound)."
        proof="Sketch: Taylor-expand the score equation $0 = \frac{1}{n}\sum_i s(\hat\theta; X_i)$ around $\theta_0$: $0 \approx \frac{1}{\sqrt{n}}\sum_i s(\theta_0; X_i) + \frac{1}{n}\sum_i \nabla s(\theta_0;X_i) \cdot \sqrt{n}(\hat\theta - \theta_0)$. By the CLT, $\frac{1}{\sqrt{n}}\sum_i s(\theta_0;X_i) \xrightarrow{d} \mathcal{N}(0, \mathcal{I}(\theta_0))$. By the LLN, $\frac{1}{n}\sum_i \nabla s(\theta_0;X_i) \to -\mathcal{I}(\theta_0)$. Solving: $\sqrt{n}(\hat\theta-\theta_0) \approx \mathcal{I}(\theta_0)^{-1} \frac{1}{\sqrt{n}}\sum_i s(\theta_0;X_i) \xrightarrow{d} \mathcal{N}(0, \mathcal{I}(\theta_0)^{-1})$ by the continuous mapping theorem."
        corollaries={[
          'The asymptotic variance $\\mathcal{I}(\\theta_0)^{-1}$ matches the Cramér–Rao lower bound, confirming that MLE is asymptotically efficient.',
          'For scalar parameters: $\\mathrm{Var}(\\hat\\theta) \\approx 1/(n \\cdot \\mathcal{I}_1(\\theta_0))$ where $\\mathcal{I}_1$ is the single-observation Fisher information.',
          'The delta method extends this to smooth functions $g(\\hat\\theta)$: $\\sqrt{n}(g(\\hat\\theta) - g(\\theta_0)) \\to \\mathcal{N}(0, [g\'(\\theta_0)]^2 \\mathcal{I}(\\theta_0)^{-1})$.',
        ]}
      />

      {/* Gaussian example */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Worked Examples</h2>

      <ExampleBlock
        title="MLE for the Gaussian Distribution"
        difficulty="intermediate"
        problem="Given i.i.d. data $x_1, \ldots, x_n \sim \mathcal{N}(\mu, \sigma^2)$, derive the MLEs for $\mu$ and $\sigma^2$ by differentiating the log-likelihood and solving."
        solution={[
          {
            step: 'Write the log-likelihood',
            formula: '\\ell(\\mu, \\sigma^2) = -\\frac{n}{2}\\log(2\\pi) - \\frac{n}{2}\\log(\\sigma^2) - \\frac{1}{2\\sigma^2}\\sum_{i=1}^n (x_i - \\mu)^2',
            explanation: 'The log of the Gaussian PDF, summed over i.i.d. observations. Constants not involving parameters can be dropped for optimization.',
          },
          {
            step: 'Score equation for $\\mu$: differentiate and set to zero',
            formula: '\\frac{\\partial \\ell}{\\partial \\mu} = \\frac{1}{\\sigma^2}\\sum_{i=1}^n (x_i - \\mu) = 0 \\implies \\hat{\\mu} = \\frac{1}{n}\\sum_{i=1}^n x_i = \\bar{x}',
            explanation: 'The MLE of the mean is the sample mean. This result holds regardless of σ² and confirms the intuition behind least squares.',
          },
          {
            step: 'Score equation for $\\sigma^2$: differentiate and set to zero',
            formula: '\\frac{\\partial \\ell}{\\partial \\sigma^2} = -\\frac{n}{2\\sigma^2} + \\frac{1}{2(\\sigma^2)^2}\\sum_{i=1}^n (x_i - \\mu)^2 = 0',
          },
          {
            step: 'Solve for $\\hat{\\sigma}^2$',
            formula: '\\hat{\\sigma}^2_{\\mathrm{MLE}} = \\frac{1}{n}\\sum_{i=1}^n (x_i - \\hat{\\mu})^2',
            explanation: 'The MLE variance uses $1/n$ (biased), unlike the sample variance $S^2 = \\frac{1}{n-1}\\sum(x_i-\\bar{x})^2$ which is unbiased. As $n\\to\\infty$ both converge.',
          },
          {
            step: 'Verify it is a maximum (second derivative test)',
            formula: '\\frac{\\partial^2 \\ell}{\\partial \\mu^2} = -\\frac{n}{\\sigma^2} < 0 \\quad \\checkmark',
            explanation: 'The Hessian is negative definite, confirming the critical point is a global maximum.',
          },
        ]}
      />

      <ExampleBlock
        title="Logistic Regression as MLE (Cross-Entropy)"
        difficulty="intermediate"
        problem="Show that minimizing the binary cross-entropy loss for logistic regression is equivalent to maximizing the log-likelihood under a Bernoulli model."
        solution={[
          {
            step: 'Logistic regression model',
            formula: 'p(y=1 \\mid \\mathbf{x}; \\mathbf{w}) = \\sigma(\\mathbf{w}^T\\mathbf{x}) = \\frac{1}{1+e^{-\\mathbf{w}^T\\mathbf{x}}}',
            explanation: 'Each label $y_i \\in \\{0,1\\}$ is modeled as Bernoulli with success probability given by the sigmoid.',
          },
          {
            step: 'Log-likelihood for i.i.d. labeled pairs $(\\mathbf{x}_i, y_i)$',
            formula: '\\ell(\\mathbf{w}) = \\sum_{i=1}^n \\left[y_i \\log \\sigma(\\mathbf{w}^T\\mathbf{x}_i) + (1-y_i)\\log(1 - \\sigma(\\mathbf{w}^T\\mathbf{x}_i))\\right]',
          },
          {
            step: 'Equivalence to cross-entropy loss',
            formula: '-\\frac{1}{n}\\ell(\\mathbf{w}) = \\frac{1}{n}\\sum_{i=1}^n \\mathcal{L}_{\\mathrm{CE}}(y_i, \\hat{y}_i) = H(y, \\hat{y})',
            explanation: 'Minimizing cross-entropy is exactly MLE for logistic regression. No regularization corresponds to a flat (improper) prior. Adding L2 regularization $\\lambda\\|\\mathbf{w}\\|^2$ corresponds to a Gaussian MAP estimate.',
          },
          {
            step: 'Gradient of the log-likelihood (elegant form)',
            formula: '\\nabla_{\\mathbf{w}} \\ell(\\mathbf{w}) = \\sum_{i=1}^n (y_i - \\hat{y}_i)\\,\\mathbf{x}_i',
            explanation: 'The gradient is a weighted residual sum. No closed form exists — we must use iterative solvers (gradient descent, Newton–Raphson).',
          },
        ]}
      />

      {/* Warning block */}
      <WarningBlock title="MLE Pitfalls and Limitations">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">1. Overfitting with small samples</p>
            <p className="mt-1">
              MLE can overfit dramatically when <InlineMath math="n" /> is small relative to the
              parameter dimension. The extreme case: if you observe 3 heads in 3 coin flips, the
              MLE gives <InlineMath math="\hat{p} = 1" />, assigning zero probability to tails.
              With small data, Bayesian methods (MAP with an informative prior) are more robust.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">2. Relationship to MAP with flat prior</p>
            <p className="mt-1">
              MAP estimation maximizes <InlineMath math="\log p(\theta|\mathbf{x}) = \ell(\theta) + \log p(\theta) + \text{const}" />.
              With a uniform (flat) prior <InlineMath math="p(\theta) \propto 1" />, MAP = MLE.
              L2 regularization corresponds to a Gaussian prior; L1 regularization corresponds to
              a Laplace prior. MLE is thus a special case of MAP with an uninformative prior.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">3. Model misspecification</p>
            <p className="mt-1">
              If the true distribution is not in the parametric family, MLE converges to the
              parameter minimizing the KL divergence <InlineMath math="D_{KL}(p_{\text{true}} \| p_\theta)" />,
              not necessarily a useful estimate. Asymptotic normality may fail under misspecification
              (use sandwich estimators for robust standard errors).
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">4. MLE variance is biased for Gaussian σ²</p>
            <p className="mt-1">
              <InlineMath math="\hat\sigma^2_{\mathrm{MLE}} = \frac{1}{n}\sum(x_i - \bar x)^2" /> is biased:
              <InlineMath math="\mathbb{E}[\hat\sigma^2_{\mathrm{MLE}}] = \frac{n-1}{n}\sigma^2" />.
              The unbiased estimator uses <InlineMath math="1/(n-1)" /> (Bessel's correction).
              In Python: <code>np.var(data, ddof=0)</code> gives MLE, <code>ddof=1</code> gives unbiased.
            </p>
          </div>
        </div>
      </WarningBlock>

      {/* Python code */}
      <PythonCode title="MLE in Python: scipy and manual optimization" code={PYTHON_CODE} />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  )
}
