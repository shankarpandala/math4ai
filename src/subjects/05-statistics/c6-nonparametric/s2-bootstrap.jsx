import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

const ORIG_DATA = [2.3, 4.1, 3.8, 5.2, 1.9, 4.7, 3.1, 5.8, 2.6, 4.3]

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function BootstrapViz() {
  const [B, setB] = useState(200)
  const [seed, setSeed] = useState(42)
  const [statistic, setStatistic] = useState('mean')

  const n = ORIG_DATA.length
  const origStat = statistic === 'mean' ? ORIG_DATA.reduce((a, b) => a + b, 0) / n
    : statistic === 'median' ? [...ORIG_DATA].sort((a, b) => a - b)[Math.floor(n / 2)]
    : Math.max(...ORIG_DATA) - Math.min(...ORIG_DATA)

  const bootstrapStats = useMemo(() => {
    const rng = seededRandom(seed)
    const stats = []
    for (let b = 0; b < B; b++) {
      const sample = Array.from({ length: n }, () => ORIG_DATA[Math.floor(rng() * n)])
      const s = statistic === 'mean' ? sample.reduce((a, b) => a + b, 0) / n
        : statistic === 'median' ? [...sample].sort((a, b) => a - b)[Math.floor(n / 2)]
        : Math.max(...sample) - Math.min(...sample)
      stats.push(s)
    }
    return stats.sort((a, b) => a - b)
  }, [B, seed, statistic])

  const ci95 = [bootstrapStats[Math.floor(0.025 * B)], bootstrapStats[Math.floor(0.975 * B)]]
  const bsMean = bootstrapStats.reduce((a, b) => a + b, 0) / B
  const bsStd = Math.sqrt(bootstrapStats.reduce((s, x) => s + (x - bsMean) ** 2, 0) / B)

  // Histogram
  const minV = bootstrapStats[0], maxV = bootstrapStats[bootstrapStats.length - 1]
  const nbins = 20
  const binWidth = (maxV - minV) / nbins || 1
  const bins = Array.from({ length: nbins }, (_, i) => ({ start: minV + i * binWidth, count: 0 }))
  bootstrapStats.forEach(v => {
    const idx = Math.min(nbins - 1, Math.floor((v - minV) / binWidth))
    bins[idx].count++
  })
  const maxCount = Math.max(...bins.map(b => b.count))

  const W = 480, H = 180
  const padL = 32, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = v => padL + ((v - minV) / ((maxV - minV) || 1)) * plotW
  const yToSvg = c => padT + plotH - (c / (maxCount * 1.1)) * plotH
  const barW = plotW / nbins

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Bootstrap Resampling Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Original data: [{ORIG_DATA.join(', ')}]
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Bootstrap samples B = {B}</label>
          <input type="range" min="50" max="2000" step="50" value={B} onChange={e => setB(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Statistic</label>
          <select value={statistic} onChange={e => setStatistic(e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800">
            <option value="mean">Mean</option>
            <option value="median">Median</option>
            <option value="range">Range</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {bins.map((bin, i) => (
            <rect
              key={i}
              x={padL + i * barW + 1}
              y={yToSvg(bin.count)}
              width={barW - 1}
              height={padT + plotH - yToSvg(bin.count)}
              fill="#6366f1"
              opacity={0.7}
            />
          ))}
          {/* CI lines */}
          <line x1={xToSvg(ci95[0])} y1={padT} x2={xToSvg(ci95[0])} y2={padT + plotH} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" />
          <line x1={xToSvg(ci95[1])} y1={padT} x2={xToSvg(ci95[1])} y2={padT + plotH} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" />
          {/* Original statistic */}
          <line x1={xToSvg(origStat)} y1={padT} x2={xToSvg(origStat)} y2={padT + plotH} stroke="#10b981" strokeWidth={2} />
          <text x={xToSvg(origStat) + 4} y={padT + 16} fontSize="9" fill="#10b981">Obs</text>
          <text x={xToSvg(ci95[0])} y={padT + 10} textAnchor="middle" fontSize="8" fill="#ef4444">{ci95[0].toFixed(2)}</text>
          <text x={xToSvg(ci95[1])} y={padT + 10} textAnchor="middle" fontSize="8" fill="#ef4444">{ci95[1].toFixed(2)}</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{origStat.toFixed(3)}</div><div className="text-gray-500">Observed</div></div>
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{bsMean.toFixed(3)}</div><div className="text-gray-500">Boot mean</div></div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20"><div className="font-mono font-bold text-purple-600">{bsStd.toFixed(3)}</div><div className="text-gray-500">Boot SE</div></div>
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20"><div className="font-mono font-bold text-red-600">[{ci95[0].toFixed(2)}, {ci95[1].toFixed(2)}]</div><div className="text-gray-500">95% CI</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

np.random.seed(42)
data = np.random.exponential(scale=2, size=30)
n = len(data)

# Nonparametric bootstrap
B = 10000
boot_means = np.array([np.random.choice(data, size=n, replace=True).mean() for _ in range(B)])

# Percentile CI
ci_pct = np.percentile(boot_means, [2.5, 97.5])
print(f"Percentile CI: [{ci_pct[0]:.4f}, {ci_pct[1]:.4f}]")

# BCa (bias-corrected accelerated) - more accurate
# Bias correction
z0 = stats.norm.ppf((boot_means < data.mean()).mean())
# Acceleration (jackknife)
jack_means = np.array([np.delete(data, i).mean() for i in range(n)])
jack_bar = jack_means.mean()
a = np.sum((jack_bar - jack_means)**3) / (6 * np.sum((jack_bar - jack_means)**2)**1.5)

alpha = 0.05
z_alpha = stats.norm.ppf(alpha / 2)
z1_alpha = stats.norm.ppf(1 - alpha / 2)

p1 = stats.norm.cdf(z0 + (z0 + z_alpha) / (1 - a * (z0 + z_alpha)))
p2 = stats.norm.cdf(z0 + (z0 + z1_alpha) / (1 - a * (z0 + z1_alpha)))
ci_bca = np.percentile(boot_means, [p1 * 100, p2 * 100])
print(f"BCa CI:        [{ci_bca[0]:.4f}, {ci_bca[1]:.4f}]")
print(f"True mean:     {2.0:.4f}  (Exp(2) has mean 2)")

# Bootstrap for regression coefficients
from sklearn.linear_model import LinearRegression
X = np.random.randn(50, 2)
y = 2 * X[:, 0] - 1.5 * X[:, 1] + np.random.normal(0, 0.5, 50)

boot_coefs = []
for _ in range(1000):
    idx = np.random.choice(50, 50, replace=True)
    lr = LinearRegression().fit(X[idx], y[idx])
    boot_coefs.append(lr.coef_)
boot_coefs = np.array(boot_coefs)
print(f"\\nRegression bootstrap 95% CI for β₁: {np.percentile(boot_coefs[:, 0], [2.5, 97.5]).round(3)}")
print(f"Regression bootstrap 95% CI for β₂: {np.percentile(boot_coefs[:, 1], [2.5, 97.5]).round(3)}")
`

export default function BootstrapMethods() {
  return (
    <div className="space-y-8">
      <NoteBlock title="The Bootstrap Idea">
        <p>
          The bootstrap (Efron, 1979) treats the observed sample as a proxy for the true
          population and uses resampling with replacement to approximate the sampling distribution
          of any statistic. No distributional assumptions are needed — only the data itself.
          This makes it universally applicable.
        </p>
      </NoteBlock>

      <BootstrapViz />

      <DefinitionBlock
        title="Nonparametric Bootstrap"
        definition="Given data $\mathbf{x} = (x_1,\ldots,x_n)$ and statistic $T = g(\mathbf{x})$, the bootstrap procedure: (1) Draw $B$ bootstrap samples $\mathbf{x}^{*(b)} = (x^*_1,\ldots,x^*_n)$ by sampling with replacement from $\mathbf{x}$. (2) Compute $T^{*(b)} = g(\mathbf{x}^{*(b)})$ for each. (3) Use the empirical distribution of $\{T^{*(b)}\}_{b=1}^B$ to estimate the sampling distribution of $T$."
        notation="Bootstrap standard error: $\hat{\mathrm{SE}} = \sqrt{\frac{1}{B-1}\sum_b (T^{*(b)} - \bar T^*)^2}$. Bootstrap bias: $\hat{\mathrm{Bias}} = \bar T^* - T$."
      />

      <DefinitionBlock
        title="Bootstrap Confidence Intervals"
        definition="Three common bootstrap CIs: (1) Percentile: $[\hat\theta^*_{(\alpha/2)}, \hat\theta^*_{(1-\alpha/2)}]$. (2) Basic (pivot): $[2T - \hat\theta^*_{(1-\alpha/2)}, 2T - \hat\theta^*_{(\alpha/2)}]$. (3) BCa (bias-corrected accelerated): adjusts percentiles for bias and skewness using the jackknife acceleration. BCa is the most accurate but computationally expensive."
        notation="The percentile method implicitly assumes the statistic $T$ is approximately normally distributed and unbiased. BCa relaxes both assumptions and is second-order accurate (error $O(n^{-1})$ vs $O(n^{-1/2})$ for percentile)."
      />

      <TheoremBlock
        title="Bootstrap Consistency"
        statement="Under regularity conditions, the bootstrap distribution of $\sqrt{n}(T^* - T)$ consistently estimates the sampling distribution of $\sqrt{n}(T - \theta)$: $\sup_x |P^*(\sqrt{n}(T^* - T) \leq x) - P(\sqrt{n}(T - \theta) \leq x)| \xrightarrow{p} 0$ as $n \to \infty$. Thus bootstrap confidence intervals are asymptotically valid."
        proof="By the functional delta method applied to the empirical process. The key insight is that the empirical distribution $\hat F_n$ converges to $F$ in Kolmogorov-Smirnov distance at rate $O(n^{-1/2})$, and smooth functionals of $\hat F_n$ converge accordingly. The bootstrap mimics this process: $\hat F_n^*$ (from bootstrap sample) converges to $\hat F_n$ at the same rate. Consistency of the bootstrap then follows by Bickel and Freedman (1981)."
      />

      <ExampleBlock title="Bootstrap for Non-Standard Statistics">
        <p>
          The bootstrap shines for statistics with no known sampling distribution, such as the
          sample median, trimmed mean, Gini coefficient, or test accuracy. For example, to get
          a 95% CI for the median of <InlineMath math="n=20" /> observations, draw{' '}
          <InlineMath math="B=10000" /> bootstrap samples, compute the median of each, and take
          the 2.5th and 97.5th percentiles. No asymptotic formula is needed.
        </p>
      </ExampleBlock>

      <WarningBlock title="When Bootstrap Fails">
        <p>
          The bootstrap fails for: (1) Statistics that depend on extreme order statistics (sample
          maximum), where the empirical distribution underestimates tail behavior; (2) Non-i.i.d.
          data (time series) — use block bootstrap instead; (3) Very small <InlineMath math="n" />
          (bootstrap approximation itself requires <InlineMath math="n" /> large); (4) Unstable
          models where small perturbations cause large changes. For heavy-tailed distributions
          without finite variance, bootstrap CIs for the mean may fail.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
