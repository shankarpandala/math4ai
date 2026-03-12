import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function BiasVarianceViz() {
  const [bias, setBias] = useState(1.0)
  const [n, setN] = useState(20)

  const variance = useMemo(() => 4 / n, [n])
  const mse = bias * bias + variance
  const crb = 1 / n  // Cramér-Rao bound (Fisher info = n for N(theta,1))

  const W = 480, H = 200
  const padL = 40, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  // Decompose MSE into bias^2 and variance as function of n
  const points = useMemo(() => {
    const pts = []
    for (let ni = 2; ni <= 100; ni += 2) {
      const b2 = bias * bias
      const v = 4 / ni
      pts.push({ n: ni, bias2: b2, variance: v, mse: b2 + v, crb: 1 / ni })
    }
    return pts
  }, [bias])

  const maxMse = Math.max(...points.map(p => p.mse))
  const xToSvg = n => padL + ((n - 2) / 98) * plotW
  const yToSvg = v => padT + plotH - (v / (maxMse * 1.1)) * plotH

  const msePath = points.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.n).toFixed(1)},${yToSvg(d.mse).toFixed(1)}`).join(' ')
  const varPath = points.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.n).toFixed(1)},${yToSvg(d.variance).toFixed(1)}`).join(' ')
  const crbPath = points.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.n).toFixed(1)},${yToSvg(d.crb).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Bias-Variance Tradeoff Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        MSE = Bias² + Variance. Cramér-Rao bound (dashed) is the minimum achievable variance for unbiased estimators.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Estimator bias = {bias.toFixed(2)}</label>
          <input type="range" min="0" max="3" step="0.1" value={bias} onChange={e => setBias(+e.target.value)} className="w-full accent-red-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Sample size n = {n}</label>
          <input type="range" min="2" max="100" step="2" value={n} onChange={e => setN(+e.target.value)} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[20, 40, 60, 80, 100].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">n</text>
          <path d={msePath} fill="none" stroke="#ef4444" strokeWidth={2.5} />
          <path d={varPath} fill="none" stroke="#6366f1" strokeWidth={2} opacity={0.8} />
          <path d={crbPath} fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={W - padR - 4} y={padT + 12} textAnchor="end" fontSize="9" fill="#ef4444">MSE</text>
          <text x={W - padR - 4} y={padT + 24} textAnchor="end" fontSize="9" fill="#6366f1">Variance</text>
          <text x={W - padR - 4} y={padT + 36} textAnchor="end" fontSize="9" fill="#10b981">CRB (unbiased)</text>
          {/* Current n marker */}
          <line x1={xToSvg(n)} y1={padT} x2={xToSvg(n)} y2={padT + plotH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20"><div className="font-mono font-bold text-red-600">{(bias * bias).toFixed(3)}</div><div className="text-gray-500">Bias²</div></div>
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{variance.toFixed(3)}</div><div className="text-gray-500">Variance</div></div>
        <div className="rounded bg-orange-50 p-2 dark:bg-orange-900/20"><div className="font-mono font-bold text-orange-600">{mse.toFixed(3)}</div><div className="text-gray-500">MSE</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{crb.toFixed(3)}</div><div className="text-gray-500">CRB</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

# Demonstrating estimator properties via simulation
np.random.seed(42)
true_theta = 5.0
sigma = 2.0
n_sims = 10000

for n in [10, 50, 200]:
    samples = np.random.normal(true_theta, sigma, size=(n_sims, n))

    # MLE mean (unbiased)
    mle_mu = samples.mean(axis=1)
    bias_mu = mle_mu.mean() - true_theta
    var_mu = mle_mu.var()
    mse_mu = ((mle_mu - true_theta)**2).mean()

    # MLE variance (biased, 1/n)
    mle_var = samples.var(axis=1, ddof=0)
    bias_var = mle_var.mean() - sigma**2

    # Unbiased variance (1/(n-1))
    unbiased_var = samples.var(axis=1, ddof=1)
    bias_unbiased = unbiased_var.mean() - sigma**2

    print(f"n={n}:")
    print(f"  MLE mean:  bias={bias_mu:.4f}, var={var_mu:.4f}, MSE={mse_mu:.4f}")
    print(f"  CR bound:  {sigma**2/n:.4f}  (matches variance)")
    print(f"  MLE var bias:      {bias_var:.4f}")
    print(f"  Unbiased var bias: {bias_unbiased:.4f}")

# Cramér-Rao bound for Poisson(lambda)
# Fisher info = 1/lambda, so CRB = lambda/n
lam = 3.0
n = 50
samples_pois = np.random.poisson(lam, size=(n_sims, n))
mle_lam = samples_pois.mean(axis=1)  # MLE for Poisson is sample mean
print(f"\\nPoisson lambda={lam}, n={n}")
print(f"  Var(MLE) = {mle_lam.var():.4f}")
print(f"  CRB      = {lam/n:.4f}")
`

export default function EstimatorProperties() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Why Properties Matter">
        <p>
          An estimator is a function of data used to approximate an unknown parameter.
          Different estimators can have very different behavior: some are systematically
          wrong (biased), some are highly variable, some fail to converge. Understanding
          these properties guides the choice between MLE, MAP, and other estimators.
        </p>
      </NoteBlock>

      <BiasVarianceViz />

      <DefinitionBlock
        title="Bias, Variance, and MSE"
        definition="For an estimator $\hat\theta$ of $\theta$: (1) Bias: $\mathrm{Bias}(\hat\theta) = \mathbb{E}[\hat\theta] - \theta$. (2) Variance: $\mathrm{Var}(\hat\theta) = \mathbb{E}[(\hat\theta - \mathbb{E}[\hat\theta])^2]$. (3) Mean Squared Error: $\mathrm{MSE}(\hat\theta) = \mathbb{E}[(\hat\theta - \theta)^2] = \mathrm{Bias}(\hat\theta)^2 + \mathrm{Var}(\hat\theta)$."
        notation="An estimator is unbiased if $\mathrm{Bias}(\hat\theta) = 0$ for all $\theta$. It is consistent if $\hat\theta_n \xrightarrow{p} \theta$ as $n \to \infty$."
      />

      <DefinitionBlock
        title="Cramér-Rao Lower Bound"
        definition="For any unbiased estimator $\hat\theta$ of a scalar parameter $\theta$ under regularity conditions: $\mathrm{Var}(\hat\theta) \geq \frac{1}{n \cdot \mathcal{I}(\theta)}$ where $\mathcal{I}(\theta) = -\mathbb{E}\left[\frac{\partial^2}{\partial\theta^2}\log p(X;\theta)\right]$ is the Fisher information per observation. An estimator achieving this bound is called efficient."
        notation="For multivariate $\boldsymbol\theta$: $\mathrm{Cov}(\hat{\boldsymbol\theta}) \succeq [n\,\mathcal{I}(\boldsymbol\theta)]^{-1}$ (matrix inequality: difference is PSD)."
      />

      <TheoremBlock
        title="Gauss-Markov Theorem"
        statement="In the linear model $\mathbf{y} = X\boldsymbol\beta + \boldsymbol\epsilon$ with $\mathbb{E}[\boldsymbol\epsilon] = 0$ and $\mathrm{Cov}(\boldsymbol\epsilon) = \sigma^2 I$, the OLS estimator $\hat{\boldsymbol\beta} = (X^TX)^{-1}X^T\mathbf{y}$ is the Best Linear Unbiased Estimator (BLUE): among all linear unbiased estimators, OLS has minimum variance."
        proof="Let $\tilde\beta = C\mathbf{y}$ be any linear unbiased estimator, so $CX = I$. Write $C = (X^TX)^{-1}X^T + D$ where $DX = 0$. Then $\mathrm{Cov}(\tilde\beta) = \sigma^2 CC^T = \mathrm{Cov}(\hat\beta) + \sigma^2 DD^T \succeq \mathrm{Cov}(\hat\beta)$ since $DD^T$ is PSD."
      />

      <ExampleBlock title="MLE Variance is Biased">
        <p>
          For <InlineMath math="X_1,\ldots,X_n \sim \mathcal{N}(\mu, \sigma^2)" />, the MLE variance estimator is:
        </p>
        <BlockMath math="\hat\sigma^2_{\mathrm{MLE}} = \frac{1}{n}\sum_{i=1}^n (X_i - \bar X)^2" />
        <p>
          Its expectation is <InlineMath math="\mathbb{E}[\hat\sigma^2_{\mathrm{MLE}}] = \frac{n-1}{n}\sigma^2 \neq \sigma^2" />.
          The bias is <InlineMath math="-\sigma^2/n" />. The unbiased estimator uses <InlineMath math="1/(n-1)" />{' '}
          (Bessel's correction): <InlineMath math="S^2 = \frac{1}{n-1}\sum(X_i - \bar X)^2" />.
          Yet the biased MLE can have lower MSE when <InlineMath math="\sigma^2" /> is large!
        </p>
      </ExampleBlock>

      <WarningBlock title="Consistency ≠ Unbiasedness">
        <p>
          An estimator can be biased yet consistent (e.g., MLE for <InlineMath math="\sigma^2" />: biased by
          {' '}<InlineMath math="-\sigma^2/n" /> but bias vanishes as <InlineMath math="n\to\infty" />), or
          unbiased yet inconsistent (e.g., any fixed estimator ignoring data is vacuously unbiased if
          the true parameter equals its value). Also, the Cramér-Rao bound applies only to unbiased estimators —
          a biased estimator can have lower variance than the CRB while still having higher MSE.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
