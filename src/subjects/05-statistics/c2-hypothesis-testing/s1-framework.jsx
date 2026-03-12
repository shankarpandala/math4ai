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

function normalCdf(x) {
  // Standard normal CDF approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  const pdf = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
  const cdf = 1 - pdf * poly
  return x >= 0 ? cdf : 1 - cdf
}

function TestingViz() {
  const [alpha, setAlpha] = useState(0.05)
  const [testStat, setTestStat] = useState(1.8)
  const [twoSided, setTwoSided] = useState(true)

  const criticalVal = useMemo(() => {
    // Inverse normal approximation for common alphas
    const table = { 0.01: 2.576, 0.05: 1.96, 0.10: 1.645 }
    return table[alpha] ?? 1.96
  }, [alpha])

  const pValue = useMemo(() => {
    const p = 1 - normalCdf(Math.abs(testStat))
    return twoSided ? 2 * p : p
  }, [testStat, twoSided])

  const rejected = pValue < alpha

  const W = 480, H = 200
  const padL = 32, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xMin = -4, xMax = 4
  const xToSvg = x => padL + ((x - xMin) / (xMax - xMin)) * plotW
  const yMax = normalPdf(0, 0, 1) * 1.1
  const yToSvg = y => padT + plotH - (y / yMax) * plotH

  const curvePoints = []
  for (let x = xMin; x <= xMax; x += 0.05) {
    curvePoints.push({ x, y: normalPdf(x, 0, 1) })
  }

  const curvePath = curvePoints.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.y).toFixed(1)}`).join(' ')

  // Rejection region fill path
  const cv = twoSided ? criticalVal : criticalVal
  const rightFill = curvePoints.filter(d => d.x >= cv).map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.y).toFixed(1)}`).join(' ')
  const leftFill = twoSided ? curvePoints.filter(d => d.x <= -cv).map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.y).toFixed(1)}`).join(' ') : ''

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">p-Value & Rejection Region Visualizer</h3>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Significance level α</label>
          <select value={alpha} onChange={e => setAlpha(+e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800">
            <option value={0.01}>α = 0.01</option>
            <option value={0.05}>α = 0.05</option>
            <option value={0.10}>α = 0.10</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Test: {twoSided ? 'two-sided' : 'one-sided'}</label>
          <button onClick={() => setTwoSided(v => !v)} className={`w-full rounded px-3 py-1 text-sm font-medium ${twoSided ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
            Toggle
          </button>
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Test statistic z = {testStat.toFixed(2)}</label>
          <input type="range" min="-4" max="4" step="0.05" value={testStat} onChange={e => setTestStat(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[-3, -2, -1, 0, 1, 2, 3].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          {/* Rejection region */}
          {curvePoints.filter(d => d.x >= cv).length > 1 && (
            <path d={rightFill + ` L${xToSvg(xMax)},${yToSvg(0)} L${xToSvg(cv)},${yToSvg(0)} Z`} fill="#ef4444" opacity={0.3} />
          )}
          {twoSided && curvePoints.filter(d => d.x <= -cv).length > 1 && (
            <path d={leftFill + ` L${xToSvg(-cv)},${yToSvg(0)} L${xToSvg(xMin)},${yToSvg(0)} Z`} fill="#ef4444" opacity={0.3} />
          )}
          <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
          {/* Critical value lines */}
          <line x1={xToSvg(cv)} y1={padT} x2={xToSvg(cv)} y2={padT + plotH} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
          {twoSided && <line x1={xToSvg(-cv)} y1={padT} x2={xToSvg(-cv)} y2={padT + plotH} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />}
          {/* Test statistic */}
          <line x1={xToSvg(testStat)} y1={padT} x2={xToSvg(testStat)} y2={padT + plotH} stroke={rejected ? '#ef4444' : '#10b981'} strokeWidth={2} />
          <circle cx={xToSvg(testStat)} cy={yToSvg(normalPdf(testStat, 0, 1))} r={4} fill={rejected ? '#ef4444' : '#10b981'} />
          <text x={xToSvg(testStat) + 6} y={padT + 20} fontSize="9" fill={rejected ? '#ef4444' : '#10b981'} fontWeight="600">z={testStat.toFixed(2)}</text>
        </svg>
      </div>
      <div className={`mt-3 rounded-lg p-3 text-center font-bold ${rejected ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
        p-value = {pValue.toFixed(4)} — {rejected ? 'REJECT H₀' : 'FAIL TO REJECT H₀'}
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

# One-sample z-test
np.random.seed(42)
mu_0 = 0          # null hypothesis
sigma = 1         # known std
n = 30
data = np.random.normal(1.0, sigma, n)   # true mean = 1

x_bar = data.mean()
z_stat = (x_bar - mu_0) / (sigma / np.sqrt(n))
p_val_two = 2 * (1 - stats.norm.cdf(abs(z_stat)))
p_val_one = 1 - stats.norm.cdf(z_stat)

print(f"z-statistic: {z_stat:.4f}")
print(f"Two-sided p: {p_val_two:.4f}")
print(f"One-sided p: {p_val_one:.4f}")

# t-test (unknown sigma)
t_stat, p_ttest = stats.ttest_1samp(data, popmean=mu_0)
print(f"\\nt-test: t={t_stat:.4f}, p={p_ttest:.4f}")

# Power calculation
from scipy.stats import norm
alpha = 0.05
delta = 1.0     # effect size (true mean - null mean)
z_alpha = norm.ppf(1 - alpha/2)
power = 1 - norm.cdf(z_alpha - delta * np.sqrt(n) / sigma) + norm.cdf(-z_alpha - delta * np.sqrt(n) / sigma)
print(f"\\nPower at delta={delta}, n={n}: {power:.4f}")

# Required n for 80% power
for target_power in [0.80, 0.90, 0.95]:
    n_req = int(np.ceil(((z_alpha + norm.ppf(target_power)) * sigma / delta)**2))
    print(f"n for {target_power:.0%} power: {n_req}")
`

export default function TestingFramework() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Frequentist Hypothesis Testing">
        <p>
          Hypothesis testing formalizes decision-making under uncertainty. We ask: is the
          observed data consistent with a null hypothesis, or is it surprising enough to
          warrant rejecting it? The framework, developed by Neyman and Pearson, balances
          two types of errors with no single optimal solution.
        </p>
      </NoteBlock>

      <TestingViz />

      <DefinitionBlock
        title="Null and Alternative Hypotheses"
        definition="A statistical hypothesis test specifies: (1) $H_0$: null hypothesis — the default claim about the parameter (e.g., $\theta = \theta_0$). (2) $H_1$: alternative hypothesis — what we believe if $H_0$ is false (e.g., $\theta \neq \theta_0$). A test statistic $T(\mathbf{X})$ is chosen to be large when evidence against $H_0$ is strong. We reject $H_0$ when $T$ falls in the rejection region $\mathcal{R}$."
        notation="Type I error (false positive): $P(\text{reject } H_0 | H_0 \text{ true}) = \alpha$ (significance level). Type II error (false negative): $P(\text{fail to reject } H_0 | H_1 \text{ true}) = \beta$. Power $= 1 - \beta$."
      />

      <DefinitionBlock
        title="p-Value"
        definition="The p-value is the probability, under $H_0$, of observing a test statistic at least as extreme as the observed value: $p = P_{H_0}(T(\mathbf{X}) \geq T_{\mathrm{obs}})$ (one-sided) or $p = P_{H_0}(|T(\mathbf{X})| \geq |T_{\mathrm{obs}}|)$ (two-sided). We reject $H_0$ at level $\alpha$ if and only if $p \leq \alpha$."
        notation="Under $H_0$, the p-value is uniformly distributed on $[0,1]$. This means: even if $H_0$ is true, 5% of experiments will yield $p < 0.05$."
      />

      <TheoremBlock
        title="Neyman-Pearson Lemma"
        statement="For testing a simple null $H_0: \theta = \theta_0$ against a simple alternative $H_1: \theta = \theta_1$, the most powerful test at level $\alpha$ is the likelihood ratio test: reject $H_0$ when $\Lambda = \frac{p(\mathbf{x};\theta_1)}{p(\mathbf{x};\theta_0)} > k_\alpha$ where $k_\alpha$ is chosen so that $P_{H_0}(\Lambda > k_\alpha) = \alpha$."
        proof="Consider any other test with rejection region $\mathcal{R}'$ having the same size $\alpha$. We want to show $P_{H_1}(\mathbf{X} \in \mathcal{R}) \geq P_{H_1}(\mathbf{X} \in \mathcal{R}')$. Note $\int_{\mathcal{R} \setminus \mathcal{R}'} (p_1 - p_0) \geq 0$ since $\mathcal{R}$ contains only regions where $\Lambda > k_\alpha$, i.e., $p_1 \geq k_\alpha p_0$. Since both tests have size $\alpha$: $\int_{\mathcal{R}} p_0 = \int_{\mathcal{R}'} p_0 = \alpha$. Combining gives $P_{H_1}(\mathcal{R}) \geq P_{H_1}(\mathcal{R}')$."
      />

      <ExampleBlock title="One-Sample z-Test">
        <p>
          Suppose we observe <InlineMath math="n=30" /> measurements with sample mean{' '}
          <InlineMath math="\bar X = 1.2" /> and known <InlineMath math="\sigma = 1" />.
          Testing <InlineMath math="H_0: \mu = 0" /> vs <InlineMath math="H_1: \mu \neq 0" />:
        </p>
        <BlockMath math="z = \frac{\bar X - \mu_0}{\sigma/\sqrt{n}} = \frac{1.2 - 0}{1/\sqrt{30}} \approx 6.57" />
        <p>
          The two-sided p-value is <InlineMath math="p = 2(1 - \Phi(6.57)) \approx 5 \times 10^{-11}" />,
          far below any conventional <InlineMath math="\alpha" />. We reject <InlineMath math="H_0" /> with overwhelming evidence.
        </p>
      </ExampleBlock>

      <WarningBlock title="Common Misconceptions about p-Values">
        <p>
          The p-value is NOT: (1) the probability that <InlineMath math="H_0" /> is true; (2) the
          probability that the result occurred by chance; (3) a measure of effect size. A small
          p-value with large <InlineMath math="n" /> can occur for trivially small effects. Always
          report effect sizes and confidence intervals alongside p-values. The significance threshold
          <InlineMath math="\alpha = 0.05" /> is arbitrary — many fields now require{' '}
          <InlineMath math="p < 0.005" /> for novel findings.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
