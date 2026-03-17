import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function HessianClassifier() {
  const [a11, setA11] = useState(2)
  const [a22, setA22] = useState(3)
  const [a12, setA12] = useState(0)

  const trace = a11 + a22
  const det = a11 * a22 - a12 * a12
  const disc = Math.sqrt(Math.max(0, (a11 - a22) ** 2 + 4 * a12 * a12))
  const lam1 = (trace + disc) / 2
  const lam2 = (trace - disc) / 2

  let classification = 'Indefinite (saddle point)'
  let color = '#f59e0b'
  if (lam1 > 0 && lam2 > 0) { classification = 'Positive definite (local minimum)'; color = '#10b981' }
  else if (lam1 < 0 && lam2 < 0) { classification = 'Negative definite (local maximum)'; color = '#ef4444' }
  else if (lam1 === 0 || lam2 === 0) { classification = 'Semidefinite (inconclusive)'; color = '#6b7280' }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Second-Order Test Classifier</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Adjust Hessian entries to see how eigenvalues determine the critical point type.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>H₁₁</span><span>{a11}</span></div>
          <input type="range" min="-5" max="5" step="0.5" value={a11} onChange={e => setA11(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>H₂₂</span><span>{a22}</span></div>
          <input type="range" min="-5" max="5" step="0.5" value={a22} onChange={e => setA22(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>H₁₂</span><span>{a12}</span></div>
          <input type="range" min="-5" max="5" step="0.5" value={a12} onChange={e => setA12(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: color + '20', borderLeft: `3px solid ${color}` }}>
        <div>&lambda;₁ = {lam1.toFixed(2)}, &lambda;₂ = {lam2.toFixed(2)}, det = {det.toFixed(2)}</div>
        <div className="font-semibold mt-1">{classification}</div>
      </div>
    </div>
  )
}

export default function HessianSecondOrder() {
  return (
    <div className="space-y-8">
      <HessianClassifier />

      <DefinitionBlock
        label="Definition 4.4.1"
        title="Hessian Matrix"
        definition={
          "For $f: \\mathbb{R}^n \\to \\mathbb{R}$ twice differentiable, the Hessian is the $n \\times n$ matrix " +
          "of second partial derivatives: $H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$. " +
          "By Schwarz's theorem (Clairaut's), $H$ is symmetric when second partials are continuous."
        }
        notation={
          "The second-order Taylor expansion is " +
          "$f(\\mathbf{x} + \\mathbf{h}) \\approx f(\\mathbf{x}) + \\nabla f^T \\mathbf{h} + \\frac{1}{2} \\mathbf{h}^T H \\mathbf{h}$."
        }
      />

      <TheoremBlock
        label="Theorem 4.4.1"
        title="Second-Order Sufficient Conditions"
        statement={
          "Let $\\nabla f(\\mathbf{x}^*) = \\mathbf{0}$ (critical point). Then: " +
          "(1) If $H(\\mathbf{x}^*)$ is positive definite, $\\mathbf{x}^*$ is a strict local minimum. " +
          "(2) If $H(\\mathbf{x}^*)$ is negative definite, $\\mathbf{x}^*$ is a strict local maximum. " +
          "(3) If $H(\\mathbf{x}^*)$ is indefinite (has both positive and negative eigenvalues), $\\mathbf{x}^*$ is a saddle point."
        }
        proof={
          "From the Taylor expansion, near $\\mathbf{x}^*$: $f(\\mathbf{x}^* + \\mathbf{h}) - f(\\mathbf{x}^*) " +
          "\\approx \\frac{1}{2}\\mathbf{h}^T H \\mathbf{h}$. If $H \\succ 0$, this quadratic form is positive " +
          "for all $\\mathbf{h} \\neq 0$, so $f$ increases in every direction — local minimum."
        }
      />

      <ExampleBlock title="Saddle Points in Neural Network Loss Surfaces">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          In high-dimensional optimization (e.g., training neural networks), saddle points are far more
          common than local minima. For a random function in <InlineMath math="\mathbb{R}^n" />, a
          critical point where the Hessian has <InlineMath math="k" /> negative eigenvalues out
          of <InlineMath math="n" /> is an index-<InlineMath math="k" /> saddle point.
        </p>
        <BlockMath math="\text{P(local minimum)} = \text{P(all } n \text{ eigenvalues} > 0) \approx 2^{-n}" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This exponential decay explains why gradient descent on neural networks rarely gets
          stuck at bad local minima — it encounters saddle points instead.
        </p>
      </ExampleBlock>

      <WarningBlock title="Hessian Computation Cost">
        <p>
          The full Hessian has <InlineMath math="O(n^2)" /> entries and costs <InlineMath math="O(n^2)" /> to
          store. For neural networks with millions of parameters, this is infeasible. Practical alternatives
          include: Hessian-vector products (computed in <InlineMath math="O(n)" /> via autodiff),
          diagonal approximations, and low-rank approximations like L-BFGS.
        </p>
      </WarningBlock>

      <PythonCode
        title="Hessian Analysis and Critical Point Classification"
        code={`import numpy as np

# ── Numerical Hessian ────────────────────────────────────────────────────
def numerical_hessian(f, x, eps=1e-5):
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            ei, ej = np.zeros(n), np.zeros(n)
            ei[i] = eps; ej[j] = eps
            H[i, j] = (f(x+ei+ej) - f(x+ei-ej) - f(x-ei+ej) + f(x-ei-ej)) / (4*eps**2)
    return H

# f(x,y) = x^3 - 3xy^2  (monkey saddle at origin)
f = lambda x: x[0]**3 - 3*x[0]*x[1]**2
x0 = np.array([0.0, 0.0])
H = numerical_hessian(f, x0)
evals = np.linalg.eigvalsh(H)
print(f"Hessian at origin:\\n{H.round(4)}")
print(f"Eigenvalues: {evals.round(4)}")
print(f"Classification: degenerate (all eigenvalues ~ 0)")

# f(x,y) = x^2 + 2y^2 - xy  (positive definite minimum at origin)
g = lambda x: x[0]**2 + 2*x[1]**2 - x[0]*x[1]
H_g = numerical_hessian(g, np.array([0.0, 0.0]))
evals_g = np.linalg.eigvalsh(H_g)
print(f"\\nHessian of x^2+2y^2-xy:\\n{H_g.round(4)}")
print(f"Eigenvalues: {evals_g.round(4)}")
print(f"Positive definite: {all(e > 0 for e in evals_g)} → local minimum")

# f(x,y) = x^2 - y^2  (saddle point)
h = lambda x: x[0]**2 - x[1]**2
H_h = numerical_hessian(h, np.array([0.0, 0.0]))
evals_h = np.linalg.eigvalsh(H_h)
print(f"\\nHessian of x^2-y^2:\\n{H_h.round(4)}")
print(f"Eigenvalues: {evals_h.round(4)}")
print(f"Indefinite: {evals_h[0] * evals_h[1] < 0} → saddle point")

# ── Condition number (ratio of eigenvalues) ──────────────────────────────
kappa = max(abs(evals_g)) / min(abs(evals_g))
print(f"\\nCondition number of g's Hessian: {kappa:.2f}")
print("High condition number → slow gradient descent convergence")`}
      />
    </div>
  )
}
