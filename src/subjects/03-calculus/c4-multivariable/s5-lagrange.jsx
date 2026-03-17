import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function LagrangeViz() {
  const [lam, setLam] = useState(1.0)

  // Minimize f(x,y)=x^2+y^2 subject to x+y=2
  // Lagrangian: L = x^2 + y^2 - lam*(x+y-2)
  // Optimal: x=y=1, lam*=2
  const xOpt = lam / 2
  const yOpt = lam / 2
  const fVal = xOpt ** 2 + yOpt ** 2
  const constraint = xOpt + yOpt - 2

  const cx = 160, cy = 160, scale = 50

  // Draw contours of f = c for several c values
  const contours = [0.5, 1, 2, 3, 4]

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Lagrange Multiplier Explorer</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Minimize <InlineMath math="f(x,y) = x^2 + y^2" /> subject to <InlineMath math="x + y = 2" />.
        Adjust <InlineMath math="\lambda" /> to see when the gradient condition is satisfied.
      </p>
      <svg width={320} height={320} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* Contour circles */}
        {contours.map(c => (
          <circle key={c} cx={cx} cy={cy} r={Math.sqrt(c) * scale} fill="none" stroke="#ddd6fe" strokeWidth={1} />
        ))}
        {/* Constraint line x+y=2 */}
        <line x1={cx - 2 * scale} y1={cy - (-2 + 2) * scale} x2={cx + 2 * scale} y2={cy - (2 - (-2) + 2 - 2) * scale}
          stroke="#3b82f6" strokeWidth={2} />
        <line x1={cx + 0 * scale} y1={cy + 2 * scale} x2={cx + 2 * scale} y2={cy + 0 * scale}
          stroke="#3b82f6" strokeWidth={2} />
        {/* Current point */}
        <circle cx={cx + xOpt * scale} cy={cy - yOpt * scale} r={5} fill={Math.abs(constraint) < 0.1 ? '#10b981' : '#ef4444'} />
        {/* Optimal point */}
        <circle cx={cx + 1 * scale} cy={cy - 1 * scale} r={3} fill="#6366f1" />
        <text x={cx + 1 * scale + 8} y={cy - 1 * scale - 5} fontSize={10} fill="#6366f1">(1,1)</text>
      </svg>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs"><span>&lambda;</span><span>{lam.toFixed(1)}</span></div>
        <input type="range" min="0" max="4" step="0.1" value={lam} onChange={e => setLam(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        x = y = &lambda;/2 = {xOpt.toFixed(2)} | f = {fVal.toFixed(2)} | constraint violation = {Math.abs(constraint).toFixed(2)}
        {Math.abs(constraint) < 0.05 && ' ✓ optimal!'}
      </div>
    </div>
  )
}

export default function LagrangeMultipliers() {
  return (
    <div className="space-y-8">
      <LagrangeViz />

      <DefinitionBlock
        label="Definition 4.5.1"
        title="Lagrangian and KKT Conditions"
        definition={
          "For $\\min f(\\mathbf{x})$ subject to $g_i(\\mathbf{x}) = 0$, the Lagrangian is " +
          "$\\mathcal{L}(\\mathbf{x}, \\boldsymbol{\\lambda}) = f(\\mathbf{x}) + \\sum_i \\lambda_i g_i(\\mathbf{x})$. " +
          "At a constrained optimum, $\\nabla_{\\mathbf{x}} \\mathcal{L} = 0$ and $g_i(\\mathbf{x}) = 0$ for all $i$."
        }
        notation={
          "For inequality constraints $h_j(\\mathbf{x}) \\leq 0$, the KKT conditions add " +
          "complementary slackness: $\\mu_j \\geq 0$ and $\\mu_j h_j(\\mathbf{x}) = 0$."
        }
      />

      <TheoremBlock
        label="Theorem 4.5.1"
        title="Lagrange Multiplier Theorem"
        statement={
          "If $\\mathbf{x}^*$ is a local minimizer of $f$ subject to $g_i(\\mathbf{x}) = 0$ ($i = 1,\\ldots,m$), " +
          "and the constraint gradients $\\nabla g_i(\\mathbf{x}^*)$ are linearly independent (LICQ), then there " +
          "exist multipliers $\\lambda_1^*, \\ldots, \\lambda_m^*$ such that " +
          "$\\nabla f(\\mathbf{x}^*) = -\\sum_i \\lambda_i^* \\nabla g_i(\\mathbf{x}^*)$."
        }
        proof={
          "Geometrically, at a constrained optimum the gradient of $f$ must be a linear combination of the " +
          "constraint gradients. Otherwise, there would be a feasible direction that decreases $f$. " +
          "Formally, this follows from the implicit function theorem applied to the constraint surface."
        }
      />

      <ExampleBlock title="Lagrange Multipliers in Machine Learning">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          SVMs maximize the margin subject to classification constraints. The dual form emerges
          via Lagrange multipliers <InlineMath math="\alpha_i \geq 0" />:
        </p>
        <BlockMath math="\max_{\boldsymbol{\alpha}} \sum_i \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j \mathbf{x}_i^T\mathbf{x}_j \quad \text{s.t. } \alpha_i \geq 0,\; \sum_i \alpha_i y_i = 0" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The multipliers <InlineMath math="\alpha_i" /> identify support vectors (points where <InlineMath math="\alpha_i > 0" />).
          Complementary slackness gives the KKT conditions of the SVM.
        </p>
      </ExampleBlock>

      <NoteBlock title="Sensitivity Interpretation">
        <p>
          The multiplier <InlineMath math="\lambda_i^*" /> measures sensitivity: if we perturb the
          constraint to <InlineMath math="g_i(\mathbf{x}) = \epsilon" />, then the optimal value
          changes by approximately <InlineMath math="-\lambda_i^* \epsilon" />. This connects to
          shadow prices in economics and dual variables in convex optimization.
        </p>
      </NoteBlock>

      <PythonCode
        title="Constrained Optimization with Lagrange Multipliers"
        code={`import numpy as np
from scipy.optimize import minimize

# ── Minimize f(x,y)=x^2+y^2 subject to x+y=2 ───────────────────────────
result = minimize(
    lambda x: x[0]**2 + x[1]**2,
    x0=[0.0, 0.0],
    constraints={'type': 'eq', 'fun': lambda x: x[0] + x[1] - 2}
)
print(f"Optimal point: ({result.x[0]:.4f}, {result.x[1]:.4f})")
print(f"Optimal value: {result.fun:.4f}")
print(f"Expected: (1, 1), value = 2")

# ── Minimize with inequality constraints ─────────────────────────────────
# min x^2 + y^2 subject to x + y >= 3, x >= 0, y >= 0
result2 = minimize(
    lambda x: x[0]**2 + x[1]**2,
    x0=[2.0, 2.0],
    constraints=[
        {'type': 'ineq', 'fun': lambda x: x[0] + x[1] - 3},
        {'type': 'ineq', 'fun': lambda x: x[0]},
        {'type': 'ineq', 'fun': lambda x: x[1]},
    ]
)
print(f"\\nInequality-constrained optimum: ({result2.x[0]:.4f}, {result2.x[1]:.4f})")
print(f"Value: {result2.fun:.4f}")

# ── Maximum entropy distribution ────────────────────────────────────────
# max -sum(p*log(p)) s.t. sum(p)=1, sum(i*p_i)=mu
n_states = 6
mu_target = 3.5
result3 = minimize(
    lambda p: np.sum(p * np.log(p + 1e-12)),  # minimize negative entropy
    x0=np.ones(n_states) / n_states,
    constraints=[
        {'type': 'eq', 'fun': lambda p: np.sum(p) - 1},
        {'type': 'eq', 'fun': lambda p: np.sum(np.arange(n_states) * p) - mu_target},
    ],
    bounds=[(1e-10, 1)] * n_states
)
print(f"\\nMax-entropy distribution (mean={mu_target}):")
for i, pi in enumerate(result3.x):
    print(f"  p({i}) = {pi:.4f}")`}
      />
    </div>
  )
}
