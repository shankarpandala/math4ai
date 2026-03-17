import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function GradientDirectionViz() {
  const [angle, setAngle] = useState(45)

  const rad = (angle * Math.PI) / 180
  const dir = [Math.cos(rad), Math.sin(rad)]
  // f(x,y) = x^2 + 2y^2, gradient at (1,1) = (2, 4)
  const grad = [2, 4]
  const gradNorm = Math.sqrt(grad[0] ** 2 + grad[1] ** 2)
  const dotProduct = grad[0] * dir[0] + grad[1] * dir[1]
  const directionalDeriv = dotProduct

  const cx = 160, cy = 140, scale = 30

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Directional Derivative Explorer</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        For <InlineMath math="f(x,y) = x^2 + 2y^2" /> at <InlineMath math="(1,1)" />, the gradient
        is <InlineMath math="\nabla f = (2, 4)" />. Rotate the direction vector to see how the directional derivative changes.
      </p>
      <svg width={320} height={280} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* Gradient vector */}
        <line x1={cx} y1={cy} x2={cx + grad[0] * scale} y2={cy - grad[1] * scale} stroke="#ef4444" strokeWidth={2.5} markerEnd="url(#arrowR)" />
        <text x={cx + grad[0] * scale + 5} y={cy - grad[1] * scale - 5} fontSize={11} fill="#ef4444">&#x2207;f</text>
        {/* Direction vector */}
        <line x1={cx} y1={cy} x2={cx + dir[0] * scale * 2} y2={cy - dir[1] * scale * 2} stroke="#3b82f6" strokeWidth={2} markerEnd="url(#arrowB)" />
        <text x={cx + dir[0] * scale * 2 + 5} y={cy - dir[1] * scale * 2} fontSize={11} fill="#3b82f6">u</text>
        <circle cx={cx} cy={cy} r={3} fill="#374151" />
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#ef4444" /></marker>
          <marker id="arrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#3b82f6" /></marker>
        </defs>
      </svg>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs"><span>Direction angle</span><span>{angle}°</span></div>
        <input type="range" min="0" max="360" step="1" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        D_u f = &#x2207;f &middot; u = {directionalDeriv.toFixed(3)} | max = ||&#x2207;f|| = {gradNorm.toFixed(3)}
      </div>
    </div>
  )
}

export default function GradientProperties() {
  return (
    <div className="space-y-8">
      <GradientDirectionViz />

      <DefinitionBlock
        label="Definition 4.2.1"
        title="Gradient and Directional Derivative"
        definition={
          "The gradient of $f: \\mathbb{R}^n \\to \\mathbb{R}$ at $\\mathbf{x}$ is " +
          "$\\nabla f(\\mathbf{x}) = \\left(\\frac{\\partial f}{\\partial x_1}, \\ldots, \\frac{\\partial f}{\\partial x_n}\\right)^T$. " +
          "The directional derivative in direction $\\mathbf{u}$ ($\\|\\mathbf{u}\\| = 1$) is " +
          "$D_{\\mathbf{u}} f(\\mathbf{x}) = \\nabla f(\\mathbf{x})^T \\mathbf{u}$."
        }
        notation={
          "By Cauchy-Schwarz: $|D_{\\mathbf{u}}f| \\leq \\|\\nabla f\\|$. " +
          "Equality holds when $\\mathbf{u} = \\pm \\nabla f / \\|\\nabla f\\|$."
        }
      />

      <TheoremBlock
        label="Theorem 4.2.1"
        title="Steepest Ascent Direction"
        statement={
          "The gradient $\\nabla f(\\mathbf{x})$ points in the direction of steepest ascent of $f$ at $\\mathbf{x}$. " +
          "More precisely, $\\mathbf{u}^* = \\nabla f / \\|\\nabla f\\|$ maximizes $D_{\\mathbf{u}}f$ over all unit vectors, " +
          "and the maximum rate of increase is $\\|\\nabla f(\\mathbf{x})\\|$. " +
          "Similarly, $-\\nabla f / \\|\\nabla f\\|$ is the steepest descent direction."
        }
        proof={
          "By Cauchy-Schwarz, $D_{\\mathbf{u}}f = \\nabla f^T \\mathbf{u} \\leq \\|\\nabla f\\|\\|\\mathbf{u}\\| = \\|\\nabla f\\|$. " +
          "Equality holds iff $\\mathbf{u} = \\nabla f / \\|\\nabla f\\|$."
        }
      />

      <NoteBlock title="Gradient Perpendicular to Level Sets">
        <p>
          At any point <InlineMath math="\mathbf{x}" />, the gradient <InlineMath math="\nabla f(\mathbf{x})" /> is
          orthogonal to the level set <InlineMath math="\{y : f(y) = f(\mathbf{x})\}" />. This is why gradient
          descent steps cross contour lines perpendicularly, and why it can zig-zag on elongated elliptical contours.
        </p>
      </NoteBlock>

      <ExampleBlock title="Gradient in Machine Learning: Loss Landscapes">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          For MSE loss <InlineMath math="L(\mathbf{w}) = \frac{1}{n}\sum_i (y_i - \mathbf{w}^T\mathbf{x}_i)^2" />,
          the gradient is:
        </p>
        <BlockMath math="\nabla_{\mathbf{w}} L = -\frac{2}{n}\sum_{i=1}^n (y_i - \mathbf{w}^T \mathbf{x}_i)\,\mathbf{x}_i = -\frac{2}{n} X^T(y - X\mathbf{w})" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Setting this to zero gives the normal equations. Gradient descent iterates{' '}
          <InlineMath math="\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla L" /> instead.
        </p>
      </ExampleBlock>

      <PythonCode
        title="Gradient Computations and Steepest Descent"
        code={`import numpy as np

# ── Numerical gradient via finite differences ────────────────────────────
def numerical_gradient(f, x, eps=1e-7):
    grad = np.zeros_like(x)
    for i in range(len(x)):
        e = np.zeros_like(x)
        e[i] = eps
        grad[i] = (f(x + e) - f(x - e)) / (2 * eps)
    return grad

f = lambda x: x[0]**2 + 2*x[1]**2   # bowl-shaped
x0 = np.array([1.0, 1.0])
grad = numerical_gradient(f, x0)
print(f"Numerical gradient at (1,1): {grad}")
print(f"Analytic gradient: [2, 4]")

# ── Directional derivative ───────────────────────────────────────────────
u = np.array([1.0, 1.0]) / np.sqrt(2)
dir_deriv = grad @ u
print(f"\\nDirectional derivative along (1,1)/sqrt(2): {dir_deriv:.4f}")
print(f"Max directional derivative (||grad||): {np.linalg.norm(grad):.4f}")
print(f"Steepest ascent direction: {grad / np.linalg.norm(grad)}")

# ── Simple gradient descent ──────────────────────────────────────────────
x = np.array([3.0, 2.0])
lr = 0.1
trajectory = [x.copy()]
for step in range(20):
    g = np.array([2*x[0], 4*x[1]])
    x = x - lr * g
    trajectory.append(x.copy())

trajectory = np.array(trajectory)
print(f"\\nGradient descent: start={trajectory[0]}, end={trajectory[-1].round(6)}")
print(f"f(start)={f(trajectory[0]):.4f}, f(end)={f(trajectory[-1]):.6f}")`}
      />
    </div>
  )
}
