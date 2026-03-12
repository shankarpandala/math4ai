import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function AICBICViz() {
  const [n, setN] = useState(50)
  const [trueK, setTrueK] = useState(3)

  // Simulate AIC/BIC for polynomial regression of varying degrees
  const results = useMemo(() => {
    const pts = []
    // True model: degree (trueK-1), so k=trueK parameters
    // Log-likelihood decreases once model is correct; use synthetic values
    for (let k = 1; k <= 12; k++) {
      // Synthetic log-likelihood: improves until true model, then flattens
      const delta = Math.max(0, k - trueK)
      const ll = -20 - 40 * Math.exp(-0.8 * (k - 1)) + 2 * Math.max(0, k - trueK) * 0.1
      const aic = -2 * ll + 2 * k
      const bic = -2 * ll + Math.log(n) * k
      pts.push({ k, ll, aic, bic })
    }
    const minAIC = Math.min(...pts.map(p => p.aic))
    const minBIC = Math.min(...pts.map(p => p.bic))
    return { pts, minAIC, minBIC, kAIC: pts.find(p => p.aic === minAIC).k, kBIC: pts.find(p => p.bic === minBIC).k }
  }, [n, trueK])

  const W = 480, H = 220
  const padL = 40, padR = 20, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const allVals = [...results.pts.map(p => p.aic), ...results.pts.map(p => p.bic)]
  const minV = Math.min(...allVals), maxV = Math.max(...allVals)
  const range = maxV - minV || 1

  const xToSvg = k => padL + ((k - 1) / 11) * plotW
  const yToSvg = v => padT + plotH - ((v - minV) / range) * plotH

  const aicPath = results.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.k).toFixed(1)},${yToSvg(d.aic).toFixed(1)}`).join(' ')
  const bicPath = results.pts.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.k).toFixed(1)},${yToSvg(d.bic).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">AIC & BIC vs Model Complexity</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        AIC = -2ℓ + 2k, BIC = -2ℓ + k·ln(n). BIC penalizes more heavily for large n.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Sample size n = {n}</label>
          <input type="range" min="10" max="500" step="10" value={n} onChange={e => setN(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">True model complexity k* = {trueK}</label>
          <input type="range" min="1" max="8" step="1" value={trueK} onChange={e => setTrueK(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[1, 3, 5, 7, 9, 11].map(k => (
            <g key={k}>
              <line x1={xToSvg(k)} y1={padT + plotH} x2={xToSvg(k)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(k)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{k}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">k (parameters)</text>
          {/* True model marker */}
          <line x1={xToSvg(trueK)} y1={padT} x2={xToSvg(trueK)} y2={padT + plotH} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={xToSvg(trueK) + 4} y={padT + 12} fontSize="9" fill="#f59e0b">k*</text>
          <path d={aicPath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
          <path d={bicPath} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6 2" />
          {/* Min markers */}
          <circle cx={xToSvg(results.kAIC)} cy={yToSvg(results.minAIC)} r={5} fill="#6366f1" />
          <circle cx={xToSvg(results.kBIC)} cy={yToSvg(results.minBIC)} r={5} fill="#ef4444" />
          <text x={W - padR - 8} y={padT + 14} textAnchor="end" fontSize="9" fill="#6366f1">AIC (min k={results.kAIC})</text>
          <text x={W - padR - 8} y={padT + 26} textAnchor="end" fontSize="9" fill="#ef4444">BIC (min k={results.kBIC})</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-amber-50 p-2 dark:bg-amber-900/20"><div className="font-mono font-bold text-amber-600">k* = {trueK}</div><div className="text-gray-500">True complexity</div></div>
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">k̂ = {results.kAIC}</div><div className="text-gray-500">AIC selected</div></div>
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20"><div className="font-mono font-bold text-red-600">k̂ = {results.kBIC}</div><div className="text-gray-500">BIC selected</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

np.random.seed(42)
n = 50
x = np.linspace(0, 4, n)
y = 2 * x**2 - 3 * x + 1 + np.random.normal(0, 2, n)

results = []
for degree in range(1, 10):
    poly = PolynomialFeatures(degree)
    X = poly.fit_transform(x.reshape(-1, 1))
    k = degree + 1   # number of parameters

    lr = LinearRegression(fit_intercept=False)
    lr.fit(X, y)
    y_pred = lr.predict(X)

    # Log-likelihood (Gaussian errors, estimated sigma)
    sigma2 = np.mean((y - y_pred)**2)
    ll = -n/2 * np.log(2 * np.pi * sigma2) - n/2

    aic = -2 * ll + 2 * k
    bic = -2 * ll + np.log(n) * k
    aicc = aic + 2*k*(k+1) / (n-k-1)  # AICc: corrected for small n

    results.append({'degree': degree, 'k': k, 'll': ll, 'AIC': aic, 'BIC': bic, 'AICc': aicc})
    print(f"deg={degree}: k={k}, LL={ll:.2f}, AIC={aic:.2f}, BIC={bic:.2f}, AICc={aicc:.2f}")

best_aic = min(results, key=lambda r: r['AIC'])
best_bic = min(results, key=lambda r: r['BIC'])
print(f"\\nBest AIC: degree={best_aic['degree']}")
print(f"Best BIC: degree={best_bic['degree']}")
print(f"True degree: 2")
`

export default function AICBIC() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Model Selection via Information Criteria">
        <p>
          Information criteria provide a principled way to compare models of different complexity
          by penalizing log-likelihood for the number of parameters. AIC is derived from
          information theory (KL divergence minimization); BIC is derived from Bayesian model
          comparison. They answer different questions and select different models.
        </p>
      </NoteBlock>

      <AICBICViz />

      <DefinitionBlock
        title="Akaike Information Criterion (AIC)"
        definition="$\mathrm{AIC} = -2\hat\ell + 2k$ where $\hat\ell$ is the maximized log-likelihood and $k$ is the number of free parameters. The model with the lowest AIC is preferred. For small samples (n/k < 40), use the corrected version: $\mathrm{AIC}_c = \mathrm{AIC} + \frac{2k(k+1)}{n-k-1}$. AIC asymptotically selects the model minimizing KL divergence to the true distribution."
        notation="AIC is not a test — it has no p-value. AIC differences: $\Delta$AIC < 2: substantial support; 4–7: considerably less support; > 10: essentially no support."
      />

      <DefinitionBlock
        title="Bayesian Information Criterion (BIC)"
        definition="$\mathrm{BIC} = -2\hat\ell + k\ln(n)$. BIC penalizes more heavily than AIC for large $n$ (since $\ln(n) > 2$ for $n > 8$). Under certain conditions, BIC approximates $-2\log$ Bayes factor and selects the model with the highest marginal likelihood (Bayesian Occam's razor). BIC is consistent: it selects the true model as $n\to\infty$ if it is among the candidates."
        notation="BIC tends to select simpler models than AIC, especially for large $n$. Choice of criterion depends on goal: AIC for prediction, BIC for model identification."
      />

      <TheoremBlock
        title="AIC as KL Divergence Estimator"
        statement="Akaike (1974) showed that for a correctly specified model with $k$ parameters, an asymptotically unbiased estimator of the expected KL divergence $\mathbb{E}_{y^*}[D_{KL}(p^* \| p_{\hat\theta})]$ (from an independent dataset) is $\mathrm{AIC}/2$. Thus, minimizing AIC is equivalent to selecting the model with minimum expected KL divergence to the true distribution."
        proof="The log-likelihood $\hat\ell(\hat\theta)$ evaluated at MLE is an upward-biased estimator of the expected log-likelihood on new data: $\mathbb{E}[\hat\ell(\hat\theta)] = \mathbb{E}[E_{\mathbf{x}^*}[\log p(\mathbf{x}^*|\hat\theta)]] + k + O(1/n)$. The bias is approximately $k$. Subtracting $k$ (penalty in AIC/2) corrects this bias, yielding an approximately unbiased estimate of predictive log-likelihood."
      />

      <ExampleBlock title="AIC for Comparing Regression Models">
        <p>
          When comparing logistic regression models with 3 vs 7 predictors on <InlineMath math="n=200" /> samples,
          if the 7-predictor model has log-likelihood 5 points higher:
        </p>
        <BlockMath math="\Delta\mathrm{AIC} = (-2 \times (-5) + 2 \times 7) - (-2 \times 0 + 2 \times 3) = (-10 + 14) - (0 + 6) = -2" />
        <p>
          A <InlineMath math="\Delta\mathrm{AIC} = -2" /> in favor of the larger model suggests
          marginal support. BIC would give{' '}
          <InlineMath math="\Delta\mathrm{BIC} = -10 + 4\ln(200) \approx -10 + 21.2 = 11.2" />,
          strongly favoring the simpler model.
        </p>
      </ExampleBlock>

      <WarningBlock title="AIC/BIC Are Not Goodness-of-Fit Tests">
        <p>
          AIC and BIC compare models relative to each other — they do not test whether any model
          fits the data adequately. A low AIC could still correspond to a poorly fitting model if
          all candidates are misspecified. Always complement model selection with residual diagnostics,
          calibration checks, and domain knowledge. Also, both assume large-sample asymptotics;
          for very small <InlineMath math="n" />, use <InlineMath math="\mathrm{AIC}_c" />.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
