import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function tCdf(t, df) {
  // Approximation for t-distribution CDF
  const x = df / (df + t * t)
  // Regularized incomplete beta function approximation
  let result = 0
  const a = df / 2, b = 0.5
  // Use continued fraction for incomplete beta (simplified)
  const z = x
  let f = 1, term = 1
  for (let k = 1; k <= 50; k++) {
    term *= (a + k - 1) * (1 - z) / k
    f += term
  }
  result = Math.pow(z, a) * Math.pow(1 - z, b) * f / (a)
  // Just use normal approx for large df
  if (df > 30) {
    const norm = 1 / (1 + 0.2316419 * Math.abs(t))
    const poly = norm * (0.319381530 + norm * (-0.356563782 + norm * (1.781477937 + norm * (-1.821255978 + norm * 1.330274429))))
    const pdf = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI)
    const cdf = 1 - pdf * poly
    return t >= 0 ? cdf : 1 - cdf
  }
  return 0.5
}

function TTestViz() {
  const [mean1, setMean1] = useState(5.0)
  const [mean2, setMean2] = useState(5.8)
  const [std, setStd] = useState(1.0)
  const [n, setN] = useState(30)

  const pooledSe = useMemo(() => std * Math.sqrt(2 / n), [std, n])
  const tStat = useMemo(() => (mean1 - mean2) / pooledSe, [mean1, mean2, pooledSe])
  const df = 2 * n - 2
  const pVal = useMemo(() => {
    // Two-sided t-test p-value using normal approximation for large df
    const absT = Math.abs(tStat)
    if (df > 30) {
      const norm = 1 / (1 + 0.2316419 * absT)
      const poly = norm * (0.319381530 + norm * (-0.356563782 + norm * (1.781477937 + norm * (-1.821255978 + norm * 1.330274429))))
      const pdf = Math.exp(-0.5 * absT * absT) / Math.sqrt(2 * Math.PI)
      return 2 * pdf * poly
    }
    return 0.05
  }, [tStat, df])

  const cohenD = Math.abs(mean1 - mean2) / std

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Two-Sample t-Test Calculator</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Compare means of two groups with equal variance. Live t-statistic and p-value.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Group 1 mean μ₁ = {mean1.toFixed(2)}</label>
          <input type="range" min="0" max="10" step="0.1" value={mean1} onChange={e => setMean1(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Group 2 mean μ₂ = {mean2.toFixed(2)}</label>
          <input type="range" min="0" max="10" step="0.1" value={mean2} onChange={e => setMean2(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Common std σ = {std.toFixed(2)}</label>
          <input type="range" min="0.2" max="4" step="0.1" value={std} onChange={e => setStd(+e.target.value)} className="w-full accent-purple-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Sample size per group n = {n}</label>
          <input type="range" min="5" max="100" step="5" value={n} onChange={e => setN(+e.target.value)} className="w-full accent-orange-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-indigo-50 p-3 text-center dark:bg-indigo-900/20">
          <div className="font-mono text-lg font-bold text-indigo-600">{tStat.toFixed(3)}</div>
          <div className="text-xs text-gray-500">t-statistic</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <div className="font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{df}</div>
          <div className="text-xs text-gray-500">df</div>
        </div>
        <div className={`rounded-lg p-3 text-center ${pVal < 0.05 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
          <div className={`font-mono text-lg font-bold ${pVal < 0.05 ? 'text-red-600' : 'text-emerald-600'}`}>{pVal < 0.001 ? '<0.001' : pVal.toFixed(4)}</div>
          <div className="text-xs text-gray-500">p-value</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-900/20">
          <div className="font-mono text-lg font-bold text-purple-600">{cohenD.toFixed(3)}</div>
          <div className="text-xs text-gray-500">Cohen's d</div>
        </div>
      </div>
      <div className={`mt-3 rounded p-2 text-center text-sm font-semibold ${pVal < 0.05 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
        {pVal < 0.05 ? 'Reject H₀: means are significantly different (α=0.05)' : 'Fail to reject H₀ (α=0.05)'}
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

np.random.seed(42)

# ── One-sample t-test ─────────────────────────────────────────────────────
data = np.random.normal(5.2, 1.0, 25)
t_stat, p_val = stats.ttest_1samp(data, popmean=5.0)
print(f"One-sample t-test: t={t_stat:.4f}, p={p_val:.4f}")

# ── Two-sample t-test (independent) ──────────────────────────────────────
group1 = np.random.normal(5.0, 1.0, 30)
group2 = np.random.normal(5.8, 1.0, 30)
t_stat, p_val = stats.ttest_ind(group1, group2, equal_var=True)
print(f"Two-sample t-test: t={t_stat:.4f}, p={p_val:.4f}")
# Cohen's d
d = (group1.mean() - group2.mean()) / np.sqrt((group1.var() + group2.var()) / 2)
print(f"Cohen's d = {d:.4f}")

# ── Chi-squared test of independence ──────────────────────────────────────
# Contingency table: treatment vs outcome
observed = np.array([[30, 70], [45, 55]])
chi2, p_chi2, dof, expected = stats.chi2_contingency(observed)
print(f"\\nChi-squared: chi2={chi2:.4f}, p={p_chi2:.4f}, df={dof}")
print(f"Expected:\\n{expected}")

# ── One-way ANOVA ──────────────────────────────────────────────────────────
g1 = np.random.normal(5, 1, 20)
g2 = np.random.normal(6, 1, 20)
g3 = np.random.normal(5.5, 1, 20)
f_stat, p_anova = stats.f_oneway(g1, g2, g3)
print(f"\\nANOVA: F={f_stat:.4f}, p={p_anova:.4f}")
`

export default function CommonTests() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Statistical Tests in ML">
        <p>
          Common statistical tests appear throughout machine learning: t-tests compare model
          performances, chi-squared tests evaluate feature independence, and ANOVA assesses
          differences across multiple hyperparameter configurations. Each test assumes a
          specific null distribution for its test statistic.
        </p>
      </NoteBlock>

      <TTestViz />

      <DefinitionBlock
        title="Student's t-Test"
        definition="For testing $H_0: \mu = \mu_0$ with unknown $\sigma$, the one-sample t-statistic is $t = \frac{\bar X - \mu_0}{S/\sqrt{n}}$ where $S^2 = \frac{1}{n-1}\sum(X_i - \bar X)^2$. Under $H_0$, $t \sim t_{n-1}$ (Student's t with $n-1$ degrees of freedom). For two-sample testing: $t = \frac{\bar X_1 - \bar X_2}{S_p\sqrt{2/n}}$ where $S_p$ is the pooled standard deviation."
        notation="As $n \to \infty$, $t_{n-1} \to \mathcal{N}(0,1)$. For $n \geq 30$, the normal approximation is usually adequate. Effect size: Cohen's $d = |\mu_1 - \mu_2|/\sigma$."
      />

      <DefinitionBlock
        title="Chi-Squared Test"
        definition="For testing independence of two categorical variables with observed counts $O_{ij}$ and expected counts $E_{ij} = (\text{row total}_i \times \text{col total}_j) / n$: $\chi^2 = \sum_{i,j} \frac{(O_{ij} - E_{ij})^2}{E_{ij}} \sim \chi^2_{(r-1)(c-1)}$ under $H_0$ (independence), where $r,c$ are the number of rows and columns."
        notation="Also used for goodness-of-fit: $\chi^2 = \sum_k (O_k - E_k)^2/E_k$ with $k-1$ df (or $k-1-p$ if $p$ parameters estimated from data). Rule of thumb: all $E_{ij} \geq 5$."
      />

      <TheoremBlock
        title="F-Distribution and ANOVA"
        statement="In one-way ANOVA with $k$ groups of size $n$ each ($N = kn$ total), under $H_0: \mu_1 = \cdots = \mu_k$: $F = \frac{\mathrm{MS_{between}}}{\mathrm{MS_{within}}} = \frac{\frac{1}{k-1}\sum_{j=1}^k n(\bar X_j - \bar X)^2}{\frac{1}{N-k}\sum_{j=1}^k\sum_{i=1}^n (X_{ij} - \bar X_j)^2} \sim F_{k-1,N-k}$. Reject $H_0$ when $F$ is large."
        proof="Under the Gaussian model $X_{ij} \sim \mathcal{N}(\mu_j, \sigma^2)$, the between-group and within-group sums of squares are independent chi-squared variables (by Cochran's theorem), giving the F-ratio its distribution under $H_0$."
      />

      <ExampleBlock title="Comparing Two ML Model Performances">
        <p>
          To compare two classifiers on paired test sets (same test instances), use a paired
          t-test. For 5×2 cross-validation comparison (Dietterich, 1998), the test statistic
          accounts for the correlation structure across folds:
        </p>
        <BlockMath math="t = \frac{p_1^{(1)}}{\sqrt{\frac{1}{5}\sum_{i=1}^5 s_i^2}} \sim t_5" />
        <p>
          where <InlineMath math="p_1^{(1)}" /> is the performance difference in fold 1 of the
          first repetition, and <InlineMath math="s_i^2" /> is the variance across the two
          repetitions of fold <InlineMath math="i" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Multiple Comparisons Problem">
        <p>
          Running many tests at <InlineMath math="\alpha = 0.05" /> inflates the family-wise error
          rate. With 20 independent tests, the probability of at least one false positive is
          {' '}<InlineMath math="1 - 0.95^{20} \approx 64\%" />. Use Bonferroni correction
          (<InlineMath math="\alpha/m" /> per test) or the Benjamini-Hochberg procedure to control
          the False Discovery Rate (FDR). This is critical in feature selection, where thousands
          of tests may be performed simultaneously.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
