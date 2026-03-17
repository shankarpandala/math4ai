import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function GaussianViz() {
  const [mu, setMu] = useState(0)
  const [sigma, setSigma] = useState(1)

  const W = 340, H = 180, padL = 30, padB = 20
  const xMin = -6, xMax = 6
  const points = []
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (xMax - xMin) * i / 200
    const y = Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))
    points.push({ x, y })
  }
  const yMax = Math.max(...points.map(p => p.y), 0.01)
  const toSvgX = x => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - 10)
  const toSvgY = y => H - padB - (y / yMax) * (H - padB - 10)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Gaussian PDF Explorer</h3>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} />
        {/* Mean line */}
        <line x1={toSvgX(mu)} y1={10} x2={toSvgX(mu)} y2={H - padB} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,3" />
        <line x1={padL} y1={H - padB} x2={W - 10} y2={H - padB} stroke="#9ca3af" strokeWidth={1} />
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>&mu;</span><span>{mu.toFixed(1)}</span></div>
          <input type="range" min="-3" max="3" step="0.1" value={mu} onChange={e => setMu(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>&sigma;</span><span>{sigma.toFixed(1)}</span></div>
          <input type="range" min="0.3" max="3" step="0.1" value={sigma} onChange={e => setSigma(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        68-95-99.7 rule: P(&mu;&plusmn;1&sigma;) = 68.3%, P(&mu;&plusmn;2&sigma;) = 95.4%, P(&mu;&plusmn;3&sigma;) = 99.7%
      </div>
    </div>
  )
}

export default function GaussianDistribution() {
  return (
    <div className="space-y-8">
      <GaussianViz />

      <DefinitionBlock
        label="Definition 3.2.1"
        title="Gaussian (Normal) Distribution"
        definition={
          "A random variable $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$ has PDF " +
          "$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$. " +
          "The multivariate Gaussian $\\mathbf{X} \\sim \\mathcal{N}(\\boldsymbol{\\mu}, \\Sigma)$ in $\\mathbb{R}^d$ has PDF " +
          "$f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}} \\exp\\!\\left(-\\frac{1}{2}(\\mathbf{x}-\\boldsymbol{\\mu})^T \\Sigma^{-1} (\\mathbf{x}-\\boldsymbol{\\mu})\\right)$."
        }
        notation={
          "Key properties: if $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, then $aX + b \\sim \\mathcal{N}(a\\mu+b, a^2\\sigma^2)$. " +
          "Sum of independent Gaussians is Gaussian."
        }
      />

      <TheoremBlock
        label="Theorem 3.2.1"
        title="Central Limit Theorem"
        statement={
          "Let $X_1, X_2, \\ldots$ be i.i.d. with mean $\\mu$ and variance $\\sigma^2 < \\infty$. Then " +
          "$\\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)$ as $n \\to \\infty$. " +
          "Equivalently, $\\sqrt{n}(\\bar{X}_n - \\mu) \\xrightarrow{d} \\mathcal{N}(0, \\sigma^2)$."
        }
        proof={
          "Via characteristic functions: the CF of the standardized sum converges to $e^{-t^2/2}$, " +
          "which is the CF of $\\mathcal{N}(0,1)$. By Lévy's continuity theorem, this implies convergence in distribution."
        }
      />

      <ExampleBlock title="Gaussians in Machine Learning">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          The Gaussian distribution is central to ML:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li><strong>Weight initialization</strong>: <InlineMath math="w_{ij} \sim \mathcal{N}(0, 2/n)" /> (He init)</li>
          <li><strong>Gaussian processes</strong>: infinite-dimensional Gaussian prior over functions</li>
          <li><strong>VAEs</strong>: latent space <InlineMath math="z \sim \mathcal{N}(0, I)" />, reparameterization trick</li>
          <li><strong>L2 regularization</strong>: equivalent to Gaussian prior on weights</li>
        </ul>
      </ExampleBlock>

      <NoteBlock title="Multivariate Gaussian: Marginalization and Conditioning">
        <p>
          For a joint Gaussian <InlineMath math="(X_1, X_2) \sim \mathcal{N}" />, both the marginal
          and conditional distributions are Gaussian. The conditional mean is a linear function of the
          conditioning variable. This property makes Gaussian models computationally tractable and is
          the basis for Gaussian process regression (kriging).
        </p>
        <BlockMath math="X_1 \mid X_2 = x_2 \sim \mathcal{N}\!\left(\mu_1 + \Sigma_{12}\Sigma_{22}^{-1}(x_2 - \mu_2),\; \Sigma_{11} - \Sigma_{12}\Sigma_{22}^{-1}\Sigma_{21}\right)" />
      </NoteBlock>

      <PythonCode
        title="Gaussian Distribution and CLT Demonstration"
        code={`import numpy as np
from scipy import stats

# ── Gaussian properties ──────────────────────────────────────────────────
X = stats.norm(loc=2, scale=1.5)
print(f"N(2, 1.5^2): mean={X.mean():.2f}, var={X.var():.2f}")
print(f"P(0 < X < 4) = {X.cdf(4) - X.cdf(0):.4f}")
print(f"68-95-99.7 check: P(|X-mu| < sigma) = {X.cdf(3.5) - X.cdf(0.5):.4f}")

# ── Central Limit Theorem demonstration ──────────────────────────────────
rng = np.random.default_rng(42)
# Exponential(1) has mean=1, var=1 (clearly non-Gaussian)
sample_sizes = [1, 5, 30, 100]
for n in sample_sizes:
    means = [rng.exponential(1.0, size=n).mean() for _ in range(10000)]
    means = np.array(means)
    standardized = (means - 1.0) / (1.0 / np.sqrt(n))
    # Test normality with Shapiro-Wilk
    _, p_value = stats.shapiro(standardized[:500])
    print(f"n={n:3d}: sample mean std={means.std():.4f}, "
          f"theory={1/np.sqrt(n):.4f}, normality p={p_value:.4f}")

# ── Multivariate Gaussian conditioning ───────────────────────────────────
mu = np.array([1.0, 2.0])
Sigma = np.array([[1.0, 0.8], [0.8, 1.5]])
# Condition X1 | X2=3
x2 = 3.0
mu_cond = mu[0] + Sigma[0,1] / Sigma[1,1] * (x2 - mu[1])
var_cond = Sigma[0,0] - Sigma[0,1]**2 / Sigma[1,1]
print(f"\\nConditional X1|X2=3: mean={mu_cond:.4f}, var={var_cond:.4f}")

# Verify with samples
samples = rng.multivariate_normal(mu, Sigma, size=100000)
mask = np.abs(samples[:, 1] - x2) < 0.05
print(f"Monte Carlo: mean={samples[mask,0].mean():.4f}, var={samples[mask,0].var():.4f}")`}
      />
    </div>
  )
}
