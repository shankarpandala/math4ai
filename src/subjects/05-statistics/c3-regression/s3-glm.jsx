import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function sigmoid(x) { return 1 / (1 + Math.exp(-x)) }

function LogisticViz() {
  const [w0, setW0] = useState(0)
  const [w1, setW1] = useState(2)

  const data = useMemo(() => {
    const pts = []
    for (let x = -5; x <= 5; x += 0.05) {
      pts.push({ x: parseFloat(x.toFixed(2)), p: sigmoid(w0 + w1 * x) })
    }
    return pts
  }, [w0, w1])

  const boundary = w1 !== 0 ? -w0 / w1 : null

  const W = 480, H = 200
  const padL = 36, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = x => padL + ((x + 5) / 10) * plotW
  const yToSvg = y => padT + plotH - y * plotH

  const curvePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.x).toFixed(1)},${yToSvg(d.p).toFixed(1)}`).join(' ')

  // Sample points for illustration
  const class0 = [-3.5, -2.8, -2.1, -1.5, -0.5 - 0.3 / w1]
  const class1 = [0.5 + 0.3 / w1, 1.5, 2.1, 2.8, 3.5]

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Logistic Regression: Sigmoid & Decision Boundary</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="p(y=1|x) = \sigma(w_0 + w_1 x)" /> — decision boundary at <InlineMath math="x = -w_0/w_1" />
        {boundary !== null && <> = <strong className="text-red-600">{boundary.toFixed(2)}</strong></>}
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Bias w₀ = {w0.toFixed(2)}</label>
          <input type="range" min="-4" max="4" step="0.1" value={w0} onChange={e => setW0(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Weight w₁ = {w1.toFixed(2)}</label>
          <input type="range" min="-4" max="4" step="0.1" value={w1} onChange={e => setW1(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {/* y=0.5 line */}
          <line x1={padL} y1={yToSvg(0.5)} x2={W - padR} y2={yToSvg(0.5)} stroke="#6b7280" strokeWidth={1} strokeDasharray="3 3" />
          <text x={padL + 4} y={yToSvg(0.5) - 4} fontSize="9" fill="#6b7280">0.5</text>
          {[-4, -2, 0, 2, 4].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          {[0, 0.5, 1].map(v => (
            <text key={v} x={padL - 5} y={yToSvg(v) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
          ))}
          {/* Class points */}
          {class0.map((x, i) => <circle key={i} cx={xToSvg(x)} cy={yToSvg(0.1)} r={4} fill="#3b82f6" opacity={0.7} />)}
          {class1.map((x, i) => <circle key={i} cx={xToSvg(x)} cy={yToSvg(0.9)} r={4} fill="#ef4444" opacity={0.7} />)}
          {/* Sigmoid curve */}
          <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
          {/* Decision boundary */}
          {boundary !== null && Math.abs(boundary) < 5 && (
            <>
              <line x1={xToSvg(boundary)} y1={padT} x2={xToSvg(boundary)} y2={padT + plotH} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" />
              <text x={xToSvg(boundary) + 4} y={padT + 16} fontSize="9" fill="#ef4444">DB</text>
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats
from sklearn.linear_model import LogisticRegression, PoissonRegressor
from sklearn.datasets import make_classification

# ── Logistic Regression ───────────────────────────────────────────────────
X, y = make_classification(n_samples=200, n_features=2, n_redundant=0,
                            n_informative=2, random_state=42)
lr = LogisticRegression(C=1.0)
lr.fit(X, y)
print("Logistic Regression:")
print(f"  Coefficients: {lr.coef_[0].round(3)}")
print(f"  Intercept: {lr.intercept_[0]:.3f}")
print(f"  Accuracy: {lr.score(X, y):.3f}")

# Predicted probabilities
probs = lr.predict_proba(X[:3])
print(f"  Probs (first 3): {probs.round(3)}")

# ── Poisson Regression (for count data) ──────────────────────────────────
np.random.seed(42)
n = 100
X_pois = np.random.randn(n, 1)
true_rate = np.exp(0.5 + 0.8 * X_pois.squeeze())
y_pois = np.random.poisson(true_rate)

pois_reg = PoissonRegressor(alpha=0)
pois_reg.fit(X_pois, y_pois)
print("\\nPoisson Regression (count data):")
print(f"  Log-rate: {pois_reg.intercept_:.3f} + {pois_reg.coef_[0]:.3f} * X")
print(f"  True:     0.500 + 0.800 * X")

# ── GLM via statsmodels ───────────────────────────────────────────────────
import statsmodels.api as sm

X_sm = sm.add_constant(X)
logit_model = sm.Logit(y, X_sm)
result = logit_model.fit(disp=0)
print("\\nStatsmodels Logit:")
print(result.summary2().tables[1])
`

export default function GeneralizedLinearModels() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Beyond Gaussian Responses">
        <p>
          Standard linear regression assumes Gaussian errors. Generalized Linear Models (GLMs)
          extend this to exponential family responses: binary outcomes (logistic regression),
          counts (Poisson regression), proportions (beta regression). All share a common
          log-likelihood framework and IRLS fitting algorithm.
        </p>
      </NoteBlock>

      <LogisticViz />

      <DefinitionBlock
        title="GLM Framework"
        definition="A GLM has three components: (1) Random component: $Y_i \sim$ exponential family with mean $\mu_i$. (2) Systematic component: linear predictor $\eta_i = \mathbf{x}_i^T\boldsymbol\beta$. (3) Link function $g$: $g(\mu_i) = \eta_i$, so $\mu_i = g^{-1}(\eta_i)$. The log-likelihood is $\ell(\boldsymbol\beta) = \sum_i [y_i \theta_i - b(\theta_i)] / a(\phi) + c(y_i, \phi)$ in canonical form."
        notation="Common links: logit $g(p) = \log(p/(1-p))$ for binary; log $g(\mu) = \log\mu$ for Poisson; identity for Gaussian. The canonical link satisfies $g = (b')^{-1}$."
      />

      <DefinitionBlock
        title="Logistic Regression"
        definition="For binary $Y_i \in \{0,1\}$, logistic regression models $P(Y_i=1|\mathbf{x}_i) = \sigma(\mathbf{x}_i^T\boldsymbol\beta) = \frac{e^{\mathbf{x}_i^T\boldsymbol\beta}}{1 + e^{\mathbf{x}_i^T\boldsymbol\beta}}$. The log-likelihood is the negative cross-entropy: $\ell(\boldsymbol\beta) = \sum_i [y_i \mathbf{x}_i^T\boldsymbol\beta - \log(1 + e^{\mathbf{x}_i^T\boldsymbol\beta})]$. No closed form: fit via Newton-Raphson or gradient descent."
        notation="Interpretation: $e^{\beta_j}$ is the odds ratio for a unit increase in $x_j$. Log-odds (logit) transform: $\log\frac{p}{1-p} = \mathbf{x}^T\boldsymbol\beta$."
      />

      <TheoremBlock
        title="IRLS Algorithm for GLMs"
        statement="The MLE for any GLM can be computed via Iteratively Reweighted Least Squares (IRLS): at each step, solve a weighted least-squares problem with weights $W_t = \mathrm{diag}(w_{ti})$ where $w_{ti} = 1/(V(\mu_{ti})(g'(\mu_{ti}))^2)$ and $V(\mu)$ is the variance function. This Newton-Raphson update converges to the MLE under mild conditions."
        proof="The Newton-Raphson update for the score equation $\nabla\ell = 0$ is $\boldsymbol\beta^{(t+1)} = \boldsymbol\beta^{(t)} - H_t^{-1} \nabla\ell_t$. For GLMs, the expected Hessian is $\mathcal{I} = X^T W X$ and the score is $X^T W \tilde{\mathbf{z}}$ where $\tilde{z}_i = \eta_i + (y_i - \mu_i)g'(\mu_i)$ is the working response. This gives the IRLS update $\boldsymbol\beta^{(t+1)} = (X^TW_tX)^{-1}X^TW_t\tilde{\mathbf{z}}_t$, a WLS regression of working responses on $X$."
      />

      <ExampleBlock title="Poisson Regression for Event Counts">
        <p>
          For count data <InlineMath math="Y_i \sim \mathrm{Poisson}(\mu_i)" />, the canonical link
          is log: <InlineMath math="\log\mu_i = \mathbf{x}_i^T\boldsymbol\beta" />, so{' '}
          <InlineMath math="\mu_i = e^{\mathbf{x}_i^T\boldsymbol\beta}" />. This ensures predicted
          counts are always positive. The coefficient interpretation: <InlineMath math="e^{\beta_j}" />
          is the multiplicative change in expected count per unit increase in <InlineMath math="x_j" />.
          Used for: disease rates, word counts, click-through events.
        </p>
      </ExampleBlock>

      <WarningBlock title="Overdispersion in Count Models">
        <p>
          Poisson regression assumes <InlineMath math="\mathrm{Var}(Y) = \mu" /> (equal mean and
          variance). Real count data often exhibits overdispersion (<InlineMath math="\mathrm{Var}(Y) > \mu" />),
          leading to underestimated standard errors and inflated test statistics. Use negative binomial
          regression or quasi-Poisson models when the deviance/df ratio significantly exceeds 1.
          Always check: <code>model.deviance / model.df_resid</code> in statsmodels.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
