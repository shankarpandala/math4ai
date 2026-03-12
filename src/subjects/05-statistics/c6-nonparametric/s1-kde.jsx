import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

const DATA_POINTS = [-2.1, -1.8, -1.2, -0.9, -0.3, 0.1, 0.4, 0.9, 1.5, 2.0, 2.3, 2.8]

function gaussianKernel(u) {
  return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI)
}

function KDEViz() {
  const [h, setH] = useState(0.5)
  const [kernel, setKernel] = useState('gaussian')

  const kernelFn = kernel === 'gaussian' ? gaussianKernel
    : kernel === 'epanechnikov' ? u => Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0
    : u => Math.abs(u) <= 1 ? 0.5 : 0   // uniform

  const data = useMemo(() => {
    const pts = []
    for (let x = -4.5; x <= 5.5; x += 0.05) {
      const kde = DATA_POINTS.reduce((sum, xi) => sum + kernelFn((x - xi) / h), 0) / (DATA_POINTS.length * h)
      pts.push({ x: parseFloat(x.toFixed(2)), kde })
    }
    return pts
  }, [h, kernel])

  const W = 480, H = 200
  const padL = 32, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const maxKDE = Math.max(...data.map(d => d.kde))
  const xToSvg = x => padL + ((x + 4.5) / 10) * plotW
  const yToSvg = y => padT + plotH - (y / (maxKDE * 1.1)) * plotH

  const kdePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.kde).toFixed(1)}`).join(' ')

  // Silverman's rule of thumb
  const n = DATA_POINTS.length
  const stdData = Math.sqrt(DATA_POINTS.reduce((s, x) => s + x * x, 0) / n - (DATA_POINTS.reduce((s, x) => s + x, 0) / n) ** 2)
  const hSilverman = 1.06 * stdData * Math.pow(n, -0.2)

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">KDE Bandwidth Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Silverman's rule: h* ≈ <strong className="text-emerald-600">{hSilverman.toFixed(3)}</strong>. Too small → spiky; too large → oversmoothed.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {['gaussian', 'epanechnikov', 'uniform'].map(k => (
          <button key={k} onClick={() => setKernel(k)} className={`rounded px-3 py-1 text-xs font-medium capitalize ${kernel === k ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>{k}</button>
        ))}
      </div>
      <div className="mb-2">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Bandwidth h = {h.toFixed(2)}</label>
        <input type="range" min="0.1" max="2" step="0.05" value={h} onChange={e => setH(+e.target.value)} className="w-full accent-indigo-600" />
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[-4, -2, 0, 2, 4].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          {/* Silverman's h */}
          <line x1={padL} y1={padT + 4} x2={padL} y2={padT + 4} />
          {/* KDE curve */}
          <path d={kdePath} fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={2.5} />
          {/* Data rug plot */}
          {DATA_POINTS.map((x, i) => (
            <line key={i} x1={xToSvg(x)} y1={padT + plotH} x2={xToSvg(x)} y2={padT + plotH - 8} stroke="#ef4444" strokeWidth={1.5} />
          ))}
          {/* Silverman bandwidth line */}
          <line x1={xToSvg(-hSilverman)} y1={padT + 8} x2={xToSvg(hSilverman)} y2={padT + 8} stroke="#10b981" strokeWidth={2} />
          <text x={xToSvg(0)} y={padT + 6} textAnchor="middle" fontSize="8" fill="#10b981">h* (Silverman)</text>
        </svg>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy.stats import gaussian_kde
import matplotlib.pyplot as plt

np.random.seed(42)
# Bimodal distribution
data = np.concatenate([np.random.normal(-2, 0.5, 100), np.random.normal(2, 1.0, 150)])
x_grid = np.linspace(-5, 6, 500)

# Silverman's rule
n = len(data)
sigma = data.std(ddof=1)
iqr = np.percentile(data, 75) - np.percentile(data, 25)
h_silverman = 1.06 * min(sigma, iqr/1.34) * n**(-0.2)
print(f"Silverman's bandwidth: {h_silverman:.4f}")

# scipy KDE with different bandwidths
for bw in ['scott', 'silverman', 0.2, 0.5, 1.0]:
    kde = gaussian_kde(data, bw_method=bw)
    actual_h = kde.factor * data.std(ddof=1)
    density = kde(x_grid)
    print(f"bw={str(bw):12s}: h={actual_h:.4f}, max density={density.max():.4f}")

# sklearn KernelDensity for more control
from sklearn.neighbors import KernelDensity
from sklearn.model_selection import GridSearchCV

# Cross-validation for bandwidth selection
params = {'bandwidth': np.logspace(-1, 1, 20)}
grid = GridSearchCV(KernelDensity(kernel='gaussian'), params, cv=5)
grid.fit(data[:, None])
best_h = grid.best_params_['bandwidth']
print(f"\\nCV optimal bandwidth: {best_h:.4f}")

# Fit with optimal bandwidth
kde_cv = KernelDensity(bandwidth=best_h, kernel='gaussian')
kde_cv.fit(data[:, None])
log_density = kde_cv.score_samples(x_grid[:, None])
density_cv = np.exp(log_density)
print(f"Integral check: {np.trapz(density_cv, x_grid):.4f} (should ≈ 1)")
`

export default function KernelDensityEstimation() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Nonparametric Density Estimation">
        <p>
          KDE estimates a probability density from data without assuming a parametric form.
          It is the nonparametric analogue of fitting a histogram — smoother, with principled
          bandwidth selection. KDE underpins many ML algorithms: one-class classification,
          anomaly detection, and generative models.
        </p>
      </NoteBlock>

      <KDEViz />

      <DefinitionBlock
        title="Kernel Density Estimator"
        definition="Given data $x_1,\ldots,x_n$ and a kernel function $K$ (a non-negative function with $\int K = 1$), the KDE at point $x$ is: $\hat f_h(x) = \frac{1}{nh}\sum_{i=1}^n K\!\left(\frac{x - x_i}{h}\right)$. The bandwidth $h > 0$ controls smoothness. Common kernels: Gaussian $K(u) = \frac{1}{\sqrt{2\pi}}e^{-u^2/2}$; Epanechnikov $K(u) = \frac{3}{4}(1-u^2)\mathbf{1}_{|u|\leq 1}$ (optimal in MSE sense)."
        notation="The KDE integrates to 1 and is non-negative, making it a valid density. It is the convolution of the empirical distribution $\hat F_n$ with the kernel: $\hat f_h = (\hat F_n * K_h)'$."
      />

      <DefinitionBlock
        title="Bandwidth Selection"
        definition="The optimal bandwidth minimizes MISE (Mean Integrated Squared Error): $\mathrm{MISE}(h) = \mathbb{E}\int (\hat f_h(x) - f(x))^2 dx = \mathrm{Bias}^2 + \mathrm{Variance}$. Asymptotically optimal: $h^* \propto n^{-1/5}$. Silverman's rule-of-thumb for Gaussian kernels: $h^* = 1.06\,\hat\sigma\,n^{-1/5}$ where $\hat\sigma = \min(\hat s, \hat{\mathrm{IQR}}/1.34)$."
        notation="For $d$-dimensional data, the optimal bandwidth scales as $n^{-1/(d+4)}$, suffering from the curse of dimensionality. In high dimensions, KDE becomes unreliable."
      />

      <TheoremBlock
        title="Bias-Variance Tradeoff for KDE"
        statement="For a twice-differentiable density $f$ and Gaussian kernel, the pointwise MSE decomposes as: $\mathrm{MSE}(\hat f_h(x)) = \frac{h^4}{4}[f''(x)]^2\mu_2(K)^2 + \frac{f(x)R(K)}{nh} + O(h^6 + (nh)^{-2})$ where $\mu_2(K) = \int u^2 K(u)du$ and $R(K) = \int K(u)^2 du$. Bias grows as $h^2$, variance shrinks as $(nh)^{-1}$. Optimal $h = O(n^{-1/5})$."
        proof="The bias term comes from a Taylor expansion of $f$ around $x$: $\mathbb{E}[\hat f_h(x)] = f(x) + \frac{h^2}{2}f''(x)\mu_2(K) + O(h^4)$. The variance: $\mathrm{Var}(\hat f_h(x)) = \frac{f(x)R(K)}{nh} + O(n^{-1})$. Summing bias² + variance and minimizing over $h$ gives the optimal rate $h^* \propto n^{-1/5}$."
      />

      <ExampleBlock title="KDE for Anomaly Detection">
        <p>
          KDE can be used for one-class classification: fit a KDE to normal training data, then
          flag test points with density below a threshold as anomalies. The threshold is chosen
          to achieve a desired false-positive rate. This is equivalent to the Parzen window
          density estimator used in non-parametric Bayes classifiers:
          <InlineMath math="P(y=1|\mathbf{x}) \propto \hat f(\mathbf{x}|y=1)" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="KDE Fails in High Dimensions">
        <p>
          The curse of dimensionality renders KDE impractical for <InlineMath math="d \gtrsim 5" />.
          The volume of a ball of radius <InlineMath math="h" /> vanishes in high dimensions,
          so virtually no data points fall in any kernel window. The required sample size grows
          as <InlineMath math="O(n^{1/(d+4)})" /> for fixed accuracy. For high-dimensional density
          estimation, use normalizing flows, VAEs, or energy-based models instead.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
