import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function RegularizationViz() {
  const [lambda, setLambda] = useState(1.0)
  const [regType, setRegType] = useState('ridge') // 'ridge' | 'lasso'

  // Show constraint region and OLS solution in 2D coefficient space
  // OLS solution at (2, 1.5), constraint radius t = 1/lambda
  const olsBeta1 = 2.0, olsBeta2 = 1.5
  const t = Math.max(0.1, 2.5 / lambda)  // constraint radius

  const W = 320, H = 320
  const cx = W / 2, cy = H / 2
  const scale = 60  // pixels per unit

  const toSvg = (b1, b2) => ({ x: cx + b1 * scale, y: cy - b2 * scale })
  const olsSvg = toSvg(olsBeta1, olsBeta2)

  // Intersection point (regularized solution)
  let regB1, regB2
  if (regType === 'ridge') {
    // Project OLS onto L2 ball: beta * t / max(t, ||beta||)
    const norm = Math.sqrt(olsBeta1 ** 2 + olsBeta2 ** 2)
    if (norm <= t) { regB1 = olsBeta1; regB2 = olsBeta2 }
    else { regB1 = olsBeta1 * t / norm; regB2 = olsBeta2 * t / norm }
  } else {
    // Lasso: project onto L1 ball
    const l1 = Math.abs(olsBeta1) + Math.abs(olsBeta2)
    if (l1 <= t) { regB1 = olsBeta1; regB2 = olsBeta2 }
    else {
      // Soft-thresholding: favor corners
      const ratio = t / l1
      regB1 = olsBeta1 * ratio
      regB2 = olsBeta2 * ratio
      // Push toward corner
      if (t < 1.0) { regB1 = t * Math.sign(olsBeta1); regB2 = 0 }
    }
  }
  const regSvg = toSvg(regB1, regB2)

  // Ellipse contour points (loss function contours centered at OLS)
  const ellipsePoints = []
  for (let angle = 0; angle <= 2 * Math.PI; angle += 0.05) {
    const b1 = olsBeta1 + 1.2 * Math.cos(angle)
    const b2 = olsBeta2 + 0.8 * Math.sin(angle)
    const p = toSvg(b1, b2)
    ellipsePoints.push(`${angle === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
  }
  const ellipsePath = ellipsePoints.join(' ') + ' Z'

  // Constraint region
  let constraintPath = ''
  if (regType === 'ridge') {
    const r = t * scale
    constraintPath = `M${cx + r},${cy} A${r},${r} 0 1 1 ${cx + r - 0.01},${cy} Z`
  } else {
    // L1 diamond: corners at (t,0), (0,t), (-t,0), (0,-t)
    const pts = [[t, 0], [0, t], [-t, 0], [0, -t]].map(([b1, b2]) => toSvg(b1, b2))
    constraintPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">L1/L2 Constraint Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The constraint region (blue) intersects the loss contours (orange) at the regularized solution.
        Lasso's diamond corners induce sparsity.
      </p>
      <div className="mb-4 flex gap-4">
        <button onClick={() => setRegType('ridge')} className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${regType === 'ridge' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>Ridge (L2)</button>
        <button onClick={() => setRegType('lasso')} className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${regType === 'lasso' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>Lasso (L1)</button>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">λ = {lambda.toFixed(2)} (constraint size t = {t.toFixed(2)})</label>
        <input type="range" min="0.5" max="5" step="0.1" value={lambda} onChange={e => setLambda(+e.target.value)} className="w-full accent-indigo-600" />
      </div>
      <div className="mt-4 flex justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs">
          {/* Axes */}
          <line x1={cx} y1={20} x2={cx} y2={H - 20} stroke="#6b7280" strokeWidth={1} />
          <line x1={20} y1={cy} x2={W - 20} y2={cy} stroke="#6b7280" strokeWidth={1} />
          <text x={W - 18} y={cy - 6} fontSize="11" fill="#6b7280">β₁</text>
          <text x={cx + 4} y={22} fontSize="11" fill="#6b7280">β₂</text>
          {/* Constraint region */}
          <path d={constraintPath} fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={2} />
          {/* Loss contours */}
          <path d={ellipsePath} fill="none" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 2" />
          {/* OLS point */}
          <circle cx={olsSvg.x} cy={olsSvg.y} r={6} fill="#ef4444" />
          <text x={olsSvg.x + 8} y={olsSvg.y - 4} fontSize="10" fill="#ef4444">OLS</text>
          {/* Regularized solution */}
          <circle cx={regSvg.x} cy={regSvg.y} r={6} fill="#8b5cf6" />
          <text x={regSvg.x + 8} y={regSvg.y - 4} fontSize="10" fill="#8b5cf6">Reg.</text>
          {/* Axis labels */}
          <text x={cx - 8} y={cy - 2 * scale - 4} fontSize="9" fill="#9ca3af">2</text>
          <text x={cx + 2 * scale - 4} y={cy + 14} fontSize="9" fill="#9ca3af">2</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20"><div className="font-mono font-bold text-red-600">({olsBeta1}, {olsBeta2})</div><div className="text-gray-500">OLS β</div></div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20"><div className="font-mono font-bold text-purple-600">({regB1.toFixed(2)}, {regB2.toFixed(2)})</div><div className="text-gray-500">{regType === 'ridge' ? 'Ridge' : 'Lasso'} β</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score

np.random.seed(42)
n, p = 100, 20
X = np.random.randn(n, p)
# Only first 5 features are relevant
true_beta = np.array([1, -1, 2, -0.5, 0.8] + [0] * 15)
y = X @ true_beta + np.random.normal(0, 0.5, n)

scaler = StandardScaler()
X_s = scaler.fit_transform(X)

alphas = [0.01, 0.1, 1.0, 10.0]

print("Ridge coefficients for first 5 features:")
for a in alphas:
    ridge = Ridge(alpha=a)
    ridge.fit(X_s, y)
    cv = cross_val_score(ridge, X_s, y, cv=5, scoring='r2').mean()
    print(f"  lambda={a:.2f}: coef={ridge.coef_[:5].round(2)}, CV R2={cv:.3f}")

print("\\nLasso: sparse solution")
for a in alphas:
    lasso = Lasso(alpha=a, max_iter=5000)
    lasso.fit(X_s, y)
    n_nonzero = np.sum(lasso.coef_ != 0)
    cv = cross_val_score(lasso, X_s, y, cv=5, scoring='r2').mean()
    print(f"  lambda={a:.2f}: {n_nonzero} nonzero, coef={lasso.coef_[:5].round(2)}, CV R2={cv:.3f}")

print("\\nElastic Net (l1_ratio=0.5):")
en = ElasticNet(alpha=0.1, l1_ratio=0.5)
en.fit(X_s, y)
print(f"  Nonzero: {np.sum(en.coef_ != 0)}, coef={en.coef_[:5].round(2)}")
`

export default function Regularization() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Regularization as Constraint or Prior">
        <p>
          Regularization adds a penalty to the loss function that discourages large coefficients,
          trading off bias for reduced variance. The choice of penalty (L2 for ridge, L1 for lasso)
          has profound implications for the sparsity structure of the solution.
        </p>
      </NoteBlock>

      <RegularizationViz />

      <DefinitionBlock
        title="Ridge Regression (L2)"
        definition="Ridge regression adds an L2 penalty to OLS: $\hat{\boldsymbol\beta}_{\mathrm{ridge}} = \operatorname{argmin}_{\boldsymbol\beta} \left\{\|\mathbf{y} - X\boldsymbol\beta\|^2 + \lambda\|\boldsymbol\beta\|_2^2\right\} = (X^TX + \lambda I)^{-1}X^T\mathbf{y}$. The closed form exists for all $\lambda > 0$, even when $X^TX$ is singular. The solution continuously shrinks OLS coefficients toward zero."
        notation="Equivalently: minimize $\|\mathbf{y}-X\boldsymbol\beta\|^2$ subject to $\|\boldsymbol\beta\|_2^2 \leq t$. The constraint radius $t$ is a decreasing function of $\lambda$."
      />

      <DefinitionBlock
        title="Lasso (L1) and Elastic Net"
        definition="Lasso adds an L1 penalty: $\hat{\boldsymbol\beta}_{\mathrm{lasso}} = \operatorname{argmin}_{\boldsymbol\beta} \left\{\|\mathbf{y} - X\boldsymbol\beta\|^2 + \lambda\|\boldsymbol\beta\|_1\right\}$. Unlike ridge, lasso produces sparse solutions (many exact zeros) due to the geometry of the L1 ball. Elastic Net combines both: $\lambda_1\|\boldsymbol\beta\|_1 + \lambda_2\|\boldsymbol\beta\|_2^2$, encouraging both sparsity and grouping of correlated features."
        notation="The lasso has no closed form and requires iterative solvers (coordinate descent, LARS). Soft-thresholding: $\hat\beta_j^{\mathrm{lasso}} = \mathrm{sign}(\hat\beta_j^{\mathrm{OLS}})(|\hat\beta_j^{\mathrm{OLS}}| - \lambda)_+$ for orthogonal $X$."
      />

      <TheoremBlock
        title="Ridge Bias-Variance Decomposition"
        statement="For ridge regression with true parameter $\boldsymbol\beta_0$: $\mathrm{Bias}(\hat{\boldsymbol\beta}_{\mathrm{ridge}}) = -\lambda(X^TX + \lambda I)^{-1}\boldsymbol\beta_0$, $\mathrm{Var}(\hat{\boldsymbol\beta}_{\mathrm{ridge}}) = \sigma^2(X^TX + \lambda I)^{-1}X^TX(X^TX + \lambda I)^{-1}$. As $\lambda$ increases from 0: bias increases, variance decreases. The optimal $\lambda$ minimizes MSE."
        proof="Write $\hat{\boldsymbol\beta} = (X^TX + \lambda I)^{-1}X^T\mathbf{y} = A\mathbf{y}$ where $A = (X^TX + \lambda I)^{-1}X^T$. Then $\mathbb{E}[\hat{\boldsymbol\beta}] = AX\boldsymbol\beta_0 = (I - \lambda(X^TX+\lambda I)^{-1})\boldsymbol\beta_0$, giving the bias. Variance follows from $\mathrm{Cov}(\hat{\boldsymbol\beta}) = \sigma^2 AA^T$."
      />

      <ExampleBlock title="Choosing λ via Cross-Validation">
        <p>
          The regularization strength <InlineMath math="\lambda" /> is a hyperparameter chosen by
          minimizing cross-validation error. In scikit-learn, <code>RidgeCV</code> and{' '}
          <code>LassoCV</code> automatically select <InlineMath math="\lambda" /> via LOO or k-fold CV.
          The optimal <InlineMath math="\lambda" /> grows with noise (<InlineMath math="\sigma^2" />)
          and shrinks with <InlineMath math="n" />, reflecting the bias-variance tradeoff.
        </p>
      </ExampleBlock>

      <WarningBlock title="Standardize Features Before Regularizing">
        <p>
          Regularization penalizes coefficient magnitudes, so it is critical to standardize all
          features to zero mean and unit variance before fitting ridge or lasso. Otherwise, features
          with large scales will be artificially penalized less. Also, ridge/lasso typically should
          NOT penalize the intercept — scikit-learn handles this correctly by default
          (<code>fit_intercept=True</code>).
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
