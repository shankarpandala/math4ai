import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function JacobianViz() {
  const [a, setA] = useState(1.0)
  const [b, setB] = useState(0.5)

  // Linear map F(x,y) = (a*x + b*y, -b*x + a*y), Jacobian = [[a,b],[-b,a]]
  const det = a * a + b * b
  const pts = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]]
  const mapped = pts.map(([x, y]) => [a * x + b * y, -b * x + a * y])

  const cx = 80, cy = 80, scale = 40
  const cx2 = 240, cy2 = 80

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Jacobian as Local Linear Map</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        The Jacobian transforms the unit square (left) to a parallelogram (right). |det J| = area scaling factor.
      </p>
      <svg width={360} height={160} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* Original shape */}
        <polygon points={pts.map(([x, y]) => `${cx + x * scale},${cy - y * scale}`).join(' ')} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={cx} y={cy + scale + 15} fontSize={10} fill="#6b7280" textAnchor="middle">Domain</text>
        {/* Arrow */}
        <text x={160} y={cy + 5} fontSize={16} fill="#6b7280" textAnchor="middle">&rarr;</text>
        {/* Mapped shape */}
        <polygon points={mapped.map(([x, y]) => `${cx2 + x * scale},${cy2 - y * scale}`).join(' ')} fill="#fce7f3" stroke="#ec4899" strokeWidth={1.5} />
        <text x={cx2} y={cy2 + scale + 15} fontSize={10} fill="#6b7280" textAnchor="middle">Range</text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>a</span><span>{a.toFixed(1)}</span></div>
          <input type="range" min="-2" max="2" step="0.1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>b</span><span>{b.toFixed(1)}</span></div>
          <input type="range" min="-2" max="2" step="0.1" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        |det J| = {Math.abs(det).toFixed(2)} (area scaling factor)
      </div>
    </div>
  )
}

export default function JacobianMatrices() {
  return (
    <div className="space-y-8">
      <JacobianViz />

      <DefinitionBlock
        label="Definition 4.3.1"
        title="Jacobian Matrix"
        definition={
          "For a vector-valued function $\\mathbf{F}: \\mathbb{R}^n \\to \\mathbb{R}^m$, " +
          "the Jacobian matrix $J \\in \\mathbb{R}^{m \\times n}$ has entries " +
          "$J_{ij} = \\frac{\\partial F_i}{\\partial x_j}$. It is the best linear approximation: " +
          "$\\mathbf{F}(\\mathbf{x} + \\mathbf{h}) \\approx \\mathbf{F}(\\mathbf{x}) + J(\\mathbf{x})\\,\\mathbf{h}$."
        }
        notation={
          "When $m = 1$, the Jacobian reduces to the gradient (a row vector). " +
          "When $n = 1$, it is the derivative vector $\\mathbf{F}'(t)$."
        }
      />

      <TheoremBlock
        label="Theorem 4.3.1"
        title="Chain Rule for Jacobians"
        statement={
          "If $\\mathbf{G}: \\mathbb{R}^n \\to \\mathbb{R}^m$ and $\\mathbf{F}: \\mathbb{R}^m \\to \\mathbb{R}^p$, then " +
          "the Jacobian of the composition is the matrix product: " +
          "$J_{\\mathbf{F} \\circ \\mathbf{G}}(\\mathbf{x}) = J_{\\mathbf{F}}(\\mathbf{G}(\\mathbf{x}))\\, J_{\\mathbf{G}}(\\mathbf{x})$. " +
          "This is the foundation of backpropagation in neural networks."
        }
        proof={
          "By the multivariable chain rule, $\\frac{\\partial (F \\circ G)_i}{\\partial x_k} = " +
          "\\sum_j \\frac{\\partial F_i}{\\partial G_j} \\frac{\\partial G_j}{\\partial x_k}$, " +
          "which is exactly the $(i,k)$ entry of $J_F \\cdot J_G$."
        }
      />

      <ExampleBlock title="Jacobian in Neural Networks (Backpropagation)">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          A two-layer network computes <InlineMath math="\mathbf{y} = \sigma(W_2\, \sigma(W_1 \mathbf{x}))" />.
          The Jacobian of the output w.r.t. the input is:
        </p>
        <BlockMath math="J = \text{diag}(\sigma'(\mathbf{z}_2))\, W_2\, \text{diag}(\sigma'(\mathbf{z}_1))\, W_1" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Each layer contributes a factor. Vanishing/exploding gradients occur when the spectral
          norm of these Jacobian factors is consistently &lt; 1 or &gt; 1.
        </p>
      </ExampleBlock>

      <NoteBlock title="Jacobian Determinant and Change of Variables">
        <p>
          For invertible <InlineMath math="\mathbf{F}: \mathbb{R}^n \to \mathbb{R}^n" />, the
          absolute value of <InlineMath math="\det J" /> gives the local volume scaling factor.
          In probability, the change-of-variables formula uses this:
        </p>
        <BlockMath math="p_Y(\mathbf{y}) = p_X(\mathbf{F}^{-1}(\mathbf{y}))\, |\det J_{\mathbf{F}^{-1}}(\mathbf{y})|" />
        <p>
          This is central to normalizing flows in generative modeling.
        </p>
      </NoteBlock>

      <PythonCode
        title="Jacobian Computation with JAX and NumPy"
        code={`import numpy as np

# ── Numerical Jacobian ───────────────────────────────────────────────────
def numerical_jacobian(F, x, eps=1e-7):
    x = np.array(x, dtype=float)
    f0 = np.array(F(x))
    m, n = len(f0), len(x)
    J = np.zeros((m, n))
    for j in range(n):
        e = np.zeros(n)
        e[j] = eps
        J[:, j] = (np.array(F(x + e)) - np.array(F(x - e))) / (2 * eps)
    return J

# F: R^2 -> R^2, F(x,y) = (x^2*y, x + sin(y))
def F(x):
    return [x[0]**2 * x[1], x[0] + np.sin(x[1])]

x0 = np.array([1.0, np.pi/4])
J = numerical_jacobian(F, x0)
print("Numerical Jacobian at (1, pi/4):")
print(J.round(6))

# Analytic: J = [[2*x*y, x^2], [1, cos(y)]]
J_exact = np.array([
    [2*x0[0]*x0[1], x0[0]**2],
    [1.0, np.cos(x0[1])]
])
print(f"\\nAnalytic Jacobian:\\n{J_exact.round(6)}")
print(f"det(J) = {np.linalg.det(J):.6f}")

# ── Chain rule: Jacobian of composition ──────────────────────────────────
def G(x):
    return [x[0] + x[1], x[0] * x[1]]

J_F = numerical_jacobian(F, G(x0))
J_G = numerical_jacobian(G, x0)
J_comp = numerical_jacobian(lambda x: F(G(x)), x0)
print(f"\\nJ_F @ J_G:\\n{(J_F @ J_G).round(6)}")
print(f"J_{'{F o G}'}:\\n{J_comp.round(6)}")
print(f"Match: {np.allclose(J_F @ J_G, J_comp)}")`}
      />
    </div>
  )
}
