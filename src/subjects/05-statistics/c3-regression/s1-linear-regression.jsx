import { useState, useMemo, useCallback } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

const INITIAL_POINTS = [
  { x: 1, y: 2.1 }, { x: 2, y: 3.8 }, { x: 3, y: 5.2 },
  { x: 4, y: 6.9 }, { x: 5, y: 8.1 }, { x: 6, y: 9.7 },
  { x: 7, y: 11.2 }, { x: 8, y: 12.4 },
]

function olsFit(points) {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }
  const xBar = points.reduce((s, p) => s + p.x, 0) / n
  const yBar = points.reduce((s, p) => s + p.y, 0) / n
  const sxx = points.reduce((s, p) => s + (p.x - xBar) ** 2, 0)
  const sxy = points.reduce((s, p) => s + (p.x - xBar) * (p.y - yBar), 0)
  const slope = sxx > 0 ? sxy / sxx : 0
  const intercept = yBar - slope * xBar
  const yPred = points.map(p => slope * p.x + intercept)
  const ssTot = points.reduce((s, p) => s + (p.y - yBar) ** 2, 0)
  const ssRes = points.reduce((s, p, i) => s + (p.y - yPred[i]) ** 2, 0)
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0
  return { slope, intercept, r2 }
}

function OLSViz() {
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [dragging, setDragging] = useState(null)

  const fit = useMemo(() => olsFit(points), [points])

  const W = 400, H = 280
  const padL = 36, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xMin = 0, xMax = 10, yMin = 0, yMax = 16

  const xToSvg = x => padL + ((x - xMin) / (xMax - xMin)) * plotW
  const yToSvg = y => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH
  const svgToData = (sx, sy) => ({
    x: Math.max(0.5, Math.min(9.5, xMin + ((sx - padL) / plotW) * (xMax - xMin))),
    y: Math.max(0.5, Math.min(15.5, yMin + (1 - (sy - padT) / plotH) * (yMax - yMin))),
  })

  const fitY1 = fit.slope * xMin + fit.intercept
  const fitY2 = fit.slope * xMax + fit.intercept

  const handleMouseDown = (idx) => (e) => {
    e.preventDefault()
    setDragging(idx)
  }

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const sx = (e.clientX - rect.left) * scaleX
    const sy = (e.clientY - rect.top) * scaleY
    const { x, y } = svgToData(sx, sy)
    setPoints(pts => pts.map((p, i) => i === dragging ? { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) } : p))
  }, [dragging])

  const handleMouseUp = () => setDragging(null)

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">OLS Regression — Drag Points</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag the blue dots to see how OLS updates the regression line in real time.
      </p>
      <div className="overflow-x-auto rounded-lg bg-gray-50 dark:bg-gray-800">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full cursor-crosshair"
          style={{ minWidth: 280, userSelect: 'none' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid */}
          {[2, 4, 6, 8, 10, 12, 14].map(v => (
            <line key={v} x1={padL} y1={yToSvg(v)} x2={W - padR} y2={yToSvg(v)} stroke="#374151" strokeOpacity={0.15} strokeDasharray="3 3" />
          ))}
          {[2, 4, 6, 8].map(v => (
            <line key={v} x1={xToSvg(v)} y1={padT} x2={xToSvg(v)} y2={padT + plotH} stroke="#374151" strokeOpacity={0.15} strokeDasharray="3 3" />
          ))}
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[0, 2, 4, 6, 8, 10].map(v => (
            <text key={v} x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
          ))}
          {[0, 4, 8, 12, 16].map(v => (
            <text key={v} x={padL - 5} y={yToSvg(v) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
          ))}
          {/* Residuals */}
          {points.map((p, i) => {
            const yHat = fit.slope * p.x + fit.intercept
            return <line key={i} x1={xToSvg(p.x)} y1={yToSvg(p.y)} x2={xToSvg(p.x)} y2={yToSvg(yHat)} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
          })}
          {/* OLS line */}
          <line x1={xToSvg(xMin)} y1={yToSvg(fitY1)} x2={xToSvg(xMax)} y2={yToSvg(fitY2)} stroke="#10b981" strokeWidth={2.5} />
          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={xToSvg(p.x)} cy={yToSvg(p.y)} r={6}
              fill="#6366f1" stroke="white" strokeWidth={2}
              style={{ cursor: 'grab' }}
              onMouseDown={handleMouseDown(i)}
            />
          ))}
          <text x={xToSvg(8)} y={yToSvg(fitY2 * 0.98) - 8} fontSize="10" fill="#10b981" fontWeight="600">
            ŷ = {fit.slope.toFixed(2)}x + {fit.intercept.toFixed(2)}
          </text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{fit.slope.toFixed(4)}</div><div className="text-gray-500">Slope β̂₁</div></div>
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{fit.intercept.toFixed(4)}</div><div className="text-gray-500">Intercept β̂₀</div></div>
        <div className="rounded bg-orange-50 p-2 dark:bg-orange-900/20"><div className="font-mono font-bold text-orange-600">{fit.r2.toFixed(4)}</div><div className="text-gray-500">R²</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from sklearn.linear_model import LinearRegression

np.random.seed(42)
n = 100
X = np.random.uniform(0, 10, (n, 1))
y = 2 * X.squeeze() + 3 + np.random.normal(0, 1, n)

# Manual OLS: beta = (X^T X)^{-1} X^T y
X_aug = np.hstack([np.ones((n, 1)), X])
beta = np.linalg.solve(X_aug.T @ X_aug, X_aug.T @ y)
print(f"OLS (manual): intercept={beta[0]:.4f}, slope={beta[1]:.4f}")

# sklearn
lr = LinearRegression()
lr.fit(X, y)
print(f"sklearn:      intercept={lr.intercept_:.4f}, slope={lr.coef_[0]:.4f}")

# R-squared
y_pred = lr.predict(X)
ss_res = np.sum((y - y_pred)**2)
ss_tot = np.sum((y - y.mean())**2)
r2 = 1 - ss_res / ss_tot
print(f"R² = {r2:.4f}")

# Confidence intervals (via covariance of beta)
sigma2_hat = ss_res / (n - 2)
cov_beta = sigma2_hat * np.linalg.inv(X_aug.T @ X_aug)
se_beta = np.sqrt(np.diag(cov_beta))
from scipy.stats import t as t_dist
t_crit = t_dist.ppf(0.975, df=n-2)
print(f"\\n95% CI for slope: [{beta[1]-t_crit*se_beta[1]:.4f}, {beta[1]+t_crit*se_beta[1]:.4f}]")
`

export default function LinearRegression() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Linear Regression as OLS">
        <p>
          Linear regression seeks the hyperplane that minimizes the sum of squared residuals.
          This Ordinary Least Squares (OLS) criterion has an elegant closed-form solution via
          the normal equations, a geometric interpretation as orthogonal projection, and
          optimality guarantees via the Gauss-Markov theorem.
        </p>
      </NoteBlock>

      <OLSViz />

      <DefinitionBlock
        title="OLS Estimator"
        definition="Given design matrix $X \in \mathbb{R}^{n \times p}$ (with intercept column) and response $\mathbf{y} \in \mathbb{R}^n$, the OLS estimator minimizes $\|\mathbf{y} - X\boldsymbol\beta\|^2$. The solution (normal equations) is: $\hat{\boldsymbol\beta} = (X^TX)^{-1}X^T\mathbf{y}$, assuming $X^TX$ is invertible. The fitted values are $\hat{\mathbf{y}} = X\hat{\boldsymbol\beta} = H\mathbf{y}$ where $H = X(X^TX)^{-1}X^T$ is the hat matrix."
        notation="The hat matrix $H$ is an orthogonal projection onto $\mathrm{col}(X)$: $H^2 = H$, $H^T = H$. Residuals $\hat{\mathbf{e}} = (I - H)\mathbf{y}$ lie in the orthogonal complement of $\mathrm{col}(X)$."
      />

      <DefinitionBlock
        title="Coefficient of Determination R²"
        definition="$R^2 = 1 - \frac{SS_{\mathrm{res}}}{SS_{\mathrm{tot}}} = 1 - \frac{\|\mathbf{y} - \hat{\mathbf{y}}\|^2}{\|\mathbf{y} - \bar y \mathbf{1}\|^2} \in [0,1]$ measures the proportion of variance in $\mathbf{y}$ explained by the model. For simple linear regression, $R^2 = \rho^2_{XY}$ (squared correlation). $R^2 = 1$ means perfect fit; $R^2 = 0$ means the model explains nothing beyond the mean."
        notation="Adjusted $R^2 = 1 - \frac{SS_{\mathrm{res}}/(n-p)}{SS_{\mathrm{tot}}/(n-1)}$ penalizes for the number of predictors $p$, preventing artificial inflation by adding irrelevant features."
      />

      <TheoremBlock
        title="Geometric Interpretation of OLS"
        statement="The OLS estimate $\hat{\boldsymbol\beta}$ yields fitted values $\hat{\mathbf{y}} = H\mathbf{y}$ that are the orthogonal projection of $\mathbf{y}$ onto the column space of $X$. Equivalently, $\hat{\mathbf{y}}$ is the point in $\mathrm{col}(X)$ closest to $\mathbf{y}$ in Euclidean distance. The residual vector $\hat{\mathbf{e}} = \mathbf{y} - \hat{\mathbf{y}}$ is orthogonal to every column of $X$: $X^T\hat{\mathbf{e}} = \mathbf{0}$ (the normal equations)."
        proof="Minimize $f(\boldsymbol\beta) = \|\mathbf{y} - X\boldsymbol\beta\|^2$ by setting the gradient to zero: $\nabla f = -2X^T(\mathbf{y} - X\boldsymbol\beta) = 0 \Rightarrow X^TX\boldsymbol\beta = X^T\mathbf{y}$. When $X^TX$ is invertible, $\hat{\boldsymbol\beta} = (X^TX)^{-1}X^T\mathbf{y}$. Geometrically, $\hat{\mathbf{y}} = X\hat{\boldsymbol\beta}$ is the projection onto $\mathrm{col}(X)$, and the residual $\hat{\mathbf{e}} = \mathbf{y} - \hat{\mathbf{y}}$ satisfies $X^T\hat{\mathbf{e}} = X^T\mathbf{y} - X^TX\hat{\boldsymbol\beta} = 0$."
      />

      <ExampleBlock title="Polynomial Features via Design Matrix">
        <p>
          Linear regression is linear in parameters but can fit nonlinear functions by expanding
          features. For polynomial regression, construct the design matrix:
        </p>
        <BlockMath math="X = \begin{bmatrix} 1 & x_1 & x_1^2 & \cdots & x_1^d \\ \vdots & \vdots & \vdots & & \vdots \\ 1 & x_n & x_n^2 & \cdots & x_n^d \end{bmatrix}" />
        <p>
          OLS then fits a degree-<InlineMath math="d" /> polynomial. This is still "linear regression"
          because it's linear in the parameters <InlineMath math="\boldsymbol\beta" />. Higher{' '}
          <InlineMath math="d" /> increases flexibility but risks overfitting.
        </p>
      </ExampleBlock>

      <WarningBlock title="When OLS Fails">
        <p>
          OLS requires: (1) <InlineMath math="X^TX" /> invertible (no perfect multicollinearity);
          (2) homoscedastic errors (<InlineMath math="\mathrm{Var}(\epsilon_i) = \sigma^2" /> constant);
          (3) no endogeneity (<InlineMath math="\mathbb{E}[\epsilon_i | X] = 0" />). Violations lead to
          inefficient estimates (heteroscedasticity), biased estimates (endogeneity), or numerical
          instability (multicollinearity). Use WLS, robust regression, or IV estimation in these cases.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
