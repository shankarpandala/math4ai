import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function MDLViz() {
  const [n, setN] = useState(50)

  // Simulate MDL for polynomial regression of varying degrees
  // Description length = code(model) + code(data|model)
  const results = useMemo(() => {
    const pts = []
    const sigma = 1.0
    const trueK = 3  // true polynomial degree

    for (let k = 1; k <= 10; k++) {
      // Model code length: k parameters at precision ~ log(n)/2 bits each
      const L_model = k * Math.log2(n) / 2

      // Data code length: using residuals from fitted model
      // True RSS decreases until k >= trueK, then plateaus
      const rss_factor = k < trueK ? Math.exp(-0.8 * (k - 1)) : Math.exp(-0.8 * (trueK - 1)) * (1 - 0.1 * (k - trueK))
      const rss = 15 * rss_factor + 2  // synthetic RSS
      const L_data = n / 2 * Math.log2(2 * Math.PI * Math.E * rss / n)

      pts.push({ k, L_model, L_data, total: L_model + L_data })
    }
    const minTotal = Math.min(...pts.map(p => p.total))
    return { pts, kBest: pts.find(p => p.total === minTotal).k }
  }, [n])

  const W = 480, H = 220
  const padL = 44, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const allVals = [...results.pts.flatMap(p => [p.L_model, p.L_data, p.total])]
  const minV = Math.min(...allVals), maxV = Math.max(...allVals)
  const range = maxV - minV || 1

  const xToSvg = k => padL + ((k - 1) / 9) * plotW
  const yToSvg = v => padT + plotH - ((v - minV) / range) * plotH

  const modelPath = results.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.k).toFixed(1)},${yToSvg(d.L_model).toFixed(1)}`).join(' ')
  const dataPath = results.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.k).toFixed(1)},${yToSvg(d.L_data).toFixed(1)}`).join(' ')
  const totalPath = results.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.k).toFixed(1)},${yToSvg(d.total).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">MDL: Model Complexity vs Description Length Tradeoff</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Total DL = L(model) + L(data|model). MDL selects the model minimizing total description length.
      </p>
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Sample size n = {n}</label>
        <input type="range" min="10" max="200" step="10" value={n} onChange={e => setN(+e.target.value)} className="w-full accent-indigo-600" />
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => (
            <g key={k}>
              <line x1={xToSvg(k)} y1={padT + plotH} x2={xToSvg(k)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(k)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{k}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">k (parameters)</text>
          <text x={10} y={padT + plotH / 2} textAnchor="middle" fontSize="9" fill="#6b7280" transform={`rotate(-90, 10, ${padT + plotH / 2})`}>bits</text>
          {/* True model */}
          <line x1={xToSvg(3)} y1={padT} x2={xToSvg(3)} y2={padT + plotH} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={xToSvg(3) + 4} y={padT + 12} fontSize="9" fill="#f59e0b">k*=3</text>
          {/* MDL selection */}
          <line x1={xToSvg(results.kBest)} y1={padT} x2={xToSvg(results.kBest)} y2={padT + plotH} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={xToSvg(results.kBest) + 4} y={padT + 24} fontSize="9" fill="#8b5cf6">MDL k={results.kBest}</text>
          <path d={modelPath} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 2" />
          <path d={dataPath} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="5 2" />
          <path d={totalPath} fill="none" stroke="#ef4444" strokeWidth={2.5} />
          <text x={W - padR - 4} y={padT + 12} textAnchor="end" fontSize="9" fill="#3b82f6">L(model) ↗</text>
          <text x={W - padR - 4} y={padT + 24} textAnchor="end" fontSize="9" fill="#10b981">L(data|model) ↘</text>
          <text x={W - padR - 4} y={padT + 36} textAnchor="end" fontSize="9" fill="#ef4444">Total (MDL)</text>
        </svg>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

np.random.seed(42)
n = 100
x = np.linspace(0, 4, n)
y = 2 * x**2 - x + 1 + np.random.normal(0, 0.8, n)  # True: degree 2

def mdl_score(X, y, k):
    """Two-part MDL: L(model) + L(data|model)."""
    lr = LinearRegression(fit_intercept=False)
    lr.fit(X, y)
    y_pred = lr.predict(X)
    rss = np.sum((y - y_pred)**2)
    sigma2 = rss / (n - k)

    # L(data|model): Gaussian log-likelihood
    L_data = n/2 * np.log(2 * np.pi * sigma2) + n/2

    # L(model): k parameters encoded at precision ~ log(n)/2 bits (Rissanen 1978)
    L_model = k/2 * np.log(n)

    return L_model + L_data, L_model, L_data

print("MDL model selection:")
print(f"{'Degree':>6} {'k':>4} {'L(model)':>10} {'L(data|M)':>11} {'Total':>10}")
for degree in range(1, 8):
    poly = PolynomialFeatures(degree)
    X = poly.fit_transform(x.reshape(-1, 1))
    k = degree + 1
    total, lm, ld = mdl_score(X, y, k)
    marker = " <-- MDL best" if degree == 2 else ""
    print(f"{degree:>6} {k:>4} {lm:>10.2f} {ld:>11.2f} {total:>10.2f}{marker}")

# NML (Normalized Maximum Likelihood) - a more principled MDL variant
# NML-MDL corresponds to BIC for Gaussian linear regression
from sklearn.metrics import mean_squared_error

print("\\nBIC comparison (approximately equivalent to MDL):")
for degree in range(1, 8):
    poly = PolynomialFeatures(degree)
    X = poly.fit_transform(x.reshape(-1, 1))
    k = degree + 1
    lr = LinearRegression(fit_intercept=False)
    lr.fit(X, y)
    sigma2 = np.mean((y - lr.predict(X))**2)
    ll = -n/2 * np.log(2 * np.pi * sigma2) - n/2
    bic = -2 * ll + k * np.log(n)
    print(f"  degree={degree}: BIC={bic:.2f}")
`

export default function MinimumDescriptionLength() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Learning as Compression">
        <p>
          The Minimum Description Length (MDL) principle, developed by Jorma Rissanen (1978),
          formalizes Occam's razor in information-theoretic terms: the best model is the one
          that allows the most compact description of the data. MDL provides a principled
          alternative to cross-validation for model selection.
        </p>
      </NoteBlock>

      <MDLViz />

      <DefinitionBlock
        title="Two-Part MDL"
        definition="Given a model class $\mathcal{M} = \{M_k\}$ and data $\mathbf{x}$, the two-part MDL selects the model minimizing: $L(M_k) + L(\mathbf{x}|M_k)$ where $L(M_k)$ is the description length of the model (number of bits to specify it) and $L(\mathbf{x}|M_k)$ is the description length of the data given the model (typically $-\log_2 p(\mathbf{x}|\hat\theta_{M_k})$). The optimal model balances compactness (small $L(M)$) with fit (small $L(\mathbf{x}|M)$)."
        notation="Rissanen (1978): for $k$ parameters estimated from $n$ data points, $L(M_k) = \frac{k}{2}\log n$ bits, giving MDL $\approx -\ell(\hat\theta) + \frac{k}{2}\log n = $ BIC/2. MDL and BIC are thus approximately equivalent."
      />

      <DefinitionBlock
        title="Normalized Maximum Likelihood (NML)"
        definition="The one-part NML code avoids the arbitrary two-part split: $p_{\mathrm{NML}}(\mathbf{x}) = \frac{p(\mathbf{x}|\hat\theta(\mathbf{x}))}{\mathcal{C}_n}$ where $\mathcal{C}_n = \int p(\mathbf{z}|\hat\theta(\mathbf{z}))d\mathbf{z}$ is the normalization constant (parametric complexity). NML achieves the minimax optimal individual sequence redundancy and is theoretically the ideal MDL code."
        notation="The parametric complexity $\log_2\mathcal{C}_n \approx \frac{k}{2}\log_2\frac{n}{2\pi e} + \text{const}$ quantifies the intrinsic complexity of the model class, related to its Fisher information volume."
      />

      <TheoremBlock
        title="MDL Consistency"
        statement="Under mild regularity conditions, two-part MDL with code length $L(M_k) = \frac{k}{2}\log n$ (Rissanen encoding) is model-selection consistent: if the true model $M_{k^*}$ is in the candidate set, then the MDL-selected model converges to $M_{k^*}$ almost surely as $n\to\infty$. This is the same consistency rate as BIC."
        proof="For any over-fitted model $M_k$ with $k > k^*$: the gain in fit $L(\mathbf{x}|M_k) - L(\mathbf{x}|M_{k^*}) = O_p(\chi^2_{k-k^*}/2) = O_p(1)$ while the model complexity penalty grows as $(k-k^*)/2\log n \to\infty$. Therefore MDL correctly rejects over-fitted models asymptotically. For under-fitted models: the data likelihood gap diverges, so MDL also correctly rejects them."
      />

      <ExampleBlock title="MDL and Kolmogorov Complexity">
        <p>
          The theoretical ideal of MDL is Kolmogorov complexity: the length of the shortest
          program that computes <InlineMath math="\mathbf{x}" />. MDL approximates this by
          restricting to parametric model classes. A hypothesis <InlineMath math="H" /> is
          "good" if it compresses the data: <InlineMath math="L(H) + L(\mathbf{x}|H) \ll L(\mathbf{x})" />.
          This connects learning to compression: every lossless compressor is implicitly a
          predictor, and every good predictor is a compressor.
        </p>
      </ExampleBlock>

      <WarningBlock title="MDL Requires a Universal Code">
        <p>
          The two-part MDL requires defining a code for the model parameters (the prior in
          Bayesian terms). The choice of parameterization matters: MDL is not invariant
          under reparameterization (unlike NML). For neural networks, the parameter space is
          enormous and highly redundant, making MDL difficult to apply directly. Practical
          alternatives: Bayesian model comparison (marginal likelihood) or variational MDL
          (bits-back coding, which underlies some VAE interpretations).
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
