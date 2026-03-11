import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import SectionLayout from '../../../components/content/SectionLayout.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'

// Simple seeded pseudo-random number generator (LCG)
function makePrng(seed) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0xFFFFFFFF
  }
}

function sampleDist(type, rand) {
  if (type === 'uniform') return rand()
  if (type === 'bernoulli') return rand() < 0.3 ? 1 : 0
  if (type === 'exponential') return -Math.log(1 - rand() * 0.9999)
  return rand()
}

function getDistStats(type) {
  if (type === 'uniform')    return { mu: 0.5, sigma: Math.sqrt(1/12) }
  if (type === 'bernoulli')  return { mu: 0.3, sigma: Math.sqrt(0.3*0.7) }
  if (type === 'exponential') return { mu: 1.0, sigma: 1.0 }
  return { mu: 0.5, sigma: Math.sqrt(1/12) }
}

const N_SAMPLES = 2000
const N_BINS = 30

function CLTViz() {
  const [distType, setDistType] = useState('uniform')
  const [n, setN] = useState(10)

  const { histData, normalCurve, stats } = useMemo(() => {
    const rand = makePrng(42)
    const { mu, sigma } = getDistStats(distType)
    const seMean = sigma / Math.sqrt(n)

    // Generate sample means
    const means = Array.from({ length: N_SAMPLES }, () => {
      let sum = 0
      for (let i = 0; i < n; i++) sum += sampleDist(distType, rand)
      return sum / n
    })

    // Build histogram
    const minV = mu - 4 * seMean
    const maxV = mu + 4 * seMean
    const binW = (maxV - minV) / N_BINS
    const counts = new Array(N_BINS).fill(0)
    for (const m of means) {
      const b = Math.floor((m - minV) / binW)
      if (b >= 0 && b < N_BINS) counts[b]++
    }
    const total = means.length
    const histData = counts.map((c, i) => ({
      x: (minV + (i + 0.5) * binW).toFixed(3),
      density: c / (total * binW),
    }))

    // Normal curve overlay
    const normalCurve = Array.from({ length: 80 }, (_, i) => {
      const x = minV + (i / 79) * (maxV - minV)
      const z = (x - mu) / seMean
      const pdf = Math.exp(-0.5 * z * z) / (seMean * Math.sqrt(2 * Math.PI))
      return { x: x.toFixed(3), pdf }
    })

    return { histData, normalCurve, stats: { mu, sigma, seMean } }
  }, [distType, n])

  const nOptions = [1, 2, 5, 10, 30, 100]

  return (
    <div className="my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <h3 className="mb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
        CLT Interactive Demo: Distribution of Sample Mean X̄ₙ
      </h3>

      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Distribution</label>
          <select value={distType} onChange={e => setDistType(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
            <option value="uniform">Uniform(0,1)</option>
            <option value="bernoulli">Bernoulli(0.3)</option>
            <option value="exponential">Exponential(1)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sample size n</label>
          <div className="flex gap-1">
            {nOptions.map(v => (
              <button key={v} onClick={() => setN(v)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  n === v
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={histData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="x" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={5}
            label={{ value: 'Sample mean', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }} />
          <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }}
            label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#818cf8' }} />
          <Bar dataKey="density" fill="#6366f1" fillOpacity={0.7} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-1 text-center text-xs text-gray-500">
        n={n} · SE = σ/√n = {stats.seMean.toFixed(4)} · 2000 samples · Normal(μ={stats.mu.toFixed(2)}, σ²/n={( stats.seMean**2).toFixed(5)}) overlay
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 text-center">
        Watch the histogram converge to a bell curve as n increases — regardless of the original distribution shape.
      </p>
    </div>
  )
}

export default function CLTSection() {
  return (
    <SectionLayout>
      <NoteBlock
        title="Historical Note"
        content="The CLT has a remarkable history: de Moivre (1733) proved it for coin flips, Laplace (1812) extended it to general distributions, and Lyapunov (1901) gave the first rigorous proof via moment conditions. Lindeberg (1922) provided the definitive general conditions. It is arguably the most important theorem in all of statistics — it explains why the Gaussian distribution appears everywhere in nature."
      />

      <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        Why does the normal distribution appear everywhere? The Central Limit Theorem gives the answer:
        when you average many <em>independent</em> random quantities, the result converges to a Gaussian
        — regardless of the shape of the original distribution. This is why measurement errors, noise
        in neural networks, and gradient statistics all look Gaussian.
      </p>

      <DefinitionBlock
        label="Definition 6.1"
        title="Sample Mean and Standardized Sum"
        definition="Given iid random variables $X_1, \ldots, X_n$ with mean $\mu$ and variance $\sigma^2 < \infty$, the sample mean is $\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i$ and the standardized sum is $Z_n = \frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} = \frac{\sum X_i - n\mu}{\sigma\sqrt{n}}$."
        notation="$\xrightarrow{d}$ denotes convergence in distribution; $\mathcal{N}(0,1)$ is the standard normal."
      />

      <TheoremBlock
        label="Theorem 6.2"
        title="Central Limit Theorem (Lindeberg-Lévy)"
        statement="Let $X_1, X_2, \ldots$ be iid with mean $\mu$ and finite variance $\sigma^2 > 0$. Then as $n \to \infty$: $Z_n = \frac{\bar{X}_n - \mu}{\sigma / \sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)$. Equivalently, $\sqrt{n}(\bar{X}_n - \mu) \xrightarrow{d} \mathcal{N}(0, \sigma^2)$."
        proof="Proof via characteristic functions (Fourier approach). Let $\phi_X(t) = E[e^{itX}]$ be the characteristic function of $X_i - \mu$ (zero mean). Then $\phi_{Z_n}(t) = \phi_X(t/(\sigma\sqrt{n}))^n$. Expand: $\phi_X(s) = 1 + iE[X-\mu]s - \frac{E[(X-\mu)^2]}{2}s^2 + o(s^2) = 1 - \frac{\sigma^2}{2}s^2 + o(s^2)$. So $\phi_{Z_n}(t) = (1 - \frac{t^2}{2n} + o(1/n))^n \to e^{-t^2/2}$, which is the characteristic function of $\mathcal{N}(0,1)$. By Lévy's continuity theorem, convergence of characteristic functions implies convergence in distribution."
        corollaries={[
          "Berry-Esseen bound: the convergence rate is $O(1/\\sqrt{n})$ — specifically $|F_n(x) - \\Phi(x)| \\leq C\\rho/(\\sigma^3\\sqrt{n})$ where $\\rho = E|X-\\mu|^3$.",
          "The Delta method extends CLT to smooth functions: if $\\sqrt{n}(\\bar{X}-\\mu) \\to \\mathcal{N}(0,\\sigma^2)$ then $\\sqrt{n}(g(\\bar{X})-g(\\mu)) \\to \\mathcal{N}(0,\\sigma^2[g'(\\mu)]^2)$.",
          "For sums (not means): $\\sum_{i=1}^n X_i \\approx \\mathcal{N}(n\\mu, n\\sigma^2)$ for large $n$."
        ]}
      />

      <CLTViz />

      <ExampleBlock
        title="Dice Rolling: Sum of n Dice"
        steps={[
          { label: "Single die", content: "Rolling one fair die: $X_i \\sim \\text{Uniform}\\{1,\\ldots,6\\}$, so $\\mu=3.5$, $\\sigma^2=35/12\\approx 2.92$" },
          { label: "Sum of n dice", content: "$S_n = X_1+\\cdots+X_n$ has $E[S_n]=3.5n$, $\\text{Var}(S_n)=35n/12$" },
          { label: "CLT approximation", content: "For $n=30$: $S_{30} \\approx \\mathcal{N}(105, 87.5)$, so $P(100 \\leq S_{30} \\leq 110) \\approx \\Phi((110-105)/\\sqrt{87.5})-\\Phi((100-105)/\\sqrt{87.5})$" },
          { label: "Result", content: "$\\approx \\Phi(0.535)-\\Phi(-0.535) = 2\\Phi(0.535)-1 \\approx 0.407$. Exact simulation gives $\\approx 0.41$." }
        ]}
      />

      <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">CLT in Machine Learning</h3>
        <div className="grid gap-2 sm:grid-cols-2 text-xs text-gray-600 dark:text-gray-400">
          {[
            ["Mini-batch SGD noise", "Gradient noise in mini-batch SGD is a sum of per-sample gradients ≈ N(∇L, Σ/B) by CLT. This Gaussian noise has been linked to implicit regularization."],
            ["Weight initialization", "Xavier/He initialization derives variance bounds so that pre-activations remain O(1); CLT justifies treating pre-activations as approximately Gaussian at initialization."],
            ["Ensemble methods", "Averaging n model predictions reduces variance by 1/n (law of large numbers) and CLT says the error distribution becomes Gaussian."],
            ["Hypothesis testing in ML", "Permutation tests, bootstrap confidence intervals, and t-tests for comparing model accuracy all rely on CLT for valid p-values."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5">
              <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{title}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <PythonCode
        title="CLT Simulation"
        code={`import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

rng = np.random.default_rng(42)

def clt_demo(dist_fn, mu, sigma, n_values=(1, 5, 30, 100), n_samples=5000):
    fig, axes = plt.subplots(1, len(n_values), figsize=(14, 3))
    x_range = np.linspace(mu - 4*sigma, mu + 4*sigma, 200)
    
    for ax, n in zip(axes, n_values):
        # Generate sample means
        samples = dist_fn(size=(n_samples, n))
        means = samples.mean(axis=1)
        
        se = sigma / np.sqrt(n)
        x_plot = np.linspace(means.min(), means.max(), 200)
        
        ax.hist(means, bins=50, density=True, alpha=0.7, color='steelblue', label='Simulation')
        ax.plot(x_plot, stats.norm.pdf(x_plot, mu, se),
                'r-', lw=2, label=f'N({mu:.1f},{se:.3f}²)')
        ax.set_title(f'n = {n}')
        ax.legend(fontsize=7)
    
    plt.tight_layout()
    plt.show()

# Example: exponential distribution (very non-Gaussian)
clt_demo(
    dist_fn=lambda size: rng.exponential(scale=1.0, size=size),
    mu=1.0, sigma=1.0
)

# Berry-Esseen bound: convergence rate
n_vals = np.logspace(0, 4, 50, dtype=int)
errors = []
for n in n_vals:
    samples = rng.exponential(size=(10000, n)).mean(axis=1)
    # KS test against standard normal
    z = (samples - 1.0) / (1.0 / np.sqrt(n))
    ks_stat, _ = stats.kstest(z, 'norm')
    errors.append(ks_stat)

# Should scale as 1/sqrt(n)
import numpy as np
slope, intercept = np.polyfit(np.log(n_vals), np.log(errors), 1)
print(f"Empirical convergence rate: n^{slope:.2f} (theory: n^-0.5)")
`}
      />

      <WarningBlock
        title="When CLT Fails or is Slow"
        items={[
          "CLT requires finite variance. Heavy-tailed distributions like Pareto or Cauchy (infinite variance) do NOT converge to Gaussian — they converge to stable distributions instead.",
          "Convergence is slow (O(1/√n)) when the distribution is very skewed or has large excess kurtosis. Need n ≫ 30 for exponential distributions.",
          "CLT applies to means of iid samples. If observations are correlated (time series, spatial data), use the Functional CLT or check mixing conditions.",
          "The 'rule of thumb' n≥30 is dangerous — it's distribution-dependent. Always verify with QQ-plots or formal normality tests."
        ]}
      />

      <ExerciseBlock
        exercises={[
          { difficulty: "conceptual", question: "Why does the CLT require finite variance? Construct a distribution where $E[X^2] = \\infty$ and show empirically that sample means do not converge to a Gaussian." },
          { difficulty: "computational", question: "A factory produces widgets with weight $\\mu=100g$, $\\sigma=5g$. How many widgets must you average to ensure $P(|\\bar{X}-100| < 0.5) \\geq 0.95$?" },
          { difficulty: "proof", question: "Prove the CLT for Bernoulli$(p)$ random variables using characteristic functions (this is essentially de Moivre's original result for the binomial distribution)." },
          { difficulty: "implementation", question: "Empirically verify the Berry-Esseen bound for the exponential distribution: plot the KS distance between $Z_n$ and $\\mathcal{N}(0,1)$ vs $n$ on a log-log scale and estimate the convergence rate." }
        ]}
      />

      <ReferenceList
        references={[
          { authors: "Durrett, R.", year: 2019, title: "Probability: Theory and Examples (5th ed.), Ch. 3", venue: "Cambridge University Press", note: "Rigorous CLT proof and extensions" },
          { authors: "Billingsley, P.", year: 1995, title: "Probability and Measure (3rd ed.)", venue: "Wiley", note: "Measure-theoretic foundations, characteristic function proofs" },
          { authors: "Berry, A. C.", year: 1941, title: "The accuracy of the Gaussian approximation to the sum of independent variates", venue: "Transactions of the American Mathematical Society, 49(1)", note: "Original Berry-Esseen bound paper" },
          { authors: "Bottou, L., Curtis, F. E., & Nocedal, J.", year: 2018, title: "Optimization methods for large-scale machine learning", venue: "SIAM Review, 60(2)", url: "https://arxiv.org/abs/1606.04838", note: "CLT and Gaussian noise in SGD analysis" }
        ]}
      />
    </SectionLayout>
  )
}
