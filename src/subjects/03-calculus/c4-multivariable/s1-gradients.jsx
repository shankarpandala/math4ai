import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function GradientViz() {
  const [px, setPx] = useState(1.0);
  const [py, setPy] = useState(1.0);

  // f(x,y) = x^2 + 2y^2, grad = [2x, 4y]
  const f = (x, y) => x * x + 2 * y * y;
  const gx = 2 * px;
  const gy = 4 * py;
  const gradNorm = Math.sqrt(gx * gx + gy * gy);

  const W = 340, H = 260;
  const xMin = -3, xMax = 3, yMin = -3, yMax = 3;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  // Draw contour lines (ellipses for f = c)
  const contours = [0.5, 1, 2, 4, 7, 11];
  const contourPaths = contours.map(c => {
    const pts = [];
    for (let t = 0; t <= 360; t += 2) {
      const rad = t * Math.PI / 180;
      const x = Math.sqrt(c) * Math.cos(rad);
      const y = Math.sqrt(c / 2) * Math.sin(rad);
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        const { sx, sy } = toSvg(x, y);
        pts.push(`${pts.length === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
    }
    return pts.join(' ') + 'Z';
  });

  const { sx: pxSvg, sy: pySvg } = toSvg(px, py);
  const scale = 30 / Math.max(gradNorm, 0.01);
  const arrowLen = gradNorm * scale;
  const arrowX = pxSvg + (gx / Math.max(gradNorm, 0.01)) * arrowLen;
  const arrowY = pySvg - (gy / Math.max(gradNorm, 0.01)) * arrowLen;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Gradient on Contour Plot: <InlineMath math="f(x,y) = x^2 + 2y^2" />
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Move the point. The red arrow shows <InlineMath math="\nabla f" /> — always perpendicular to contour lines.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* axes */}
        <line x1={0} y1={toSvg(0, 0).sy} x2={W} y2={toSvg(0, 0).sy} stroke="#d1d5db" strokeWidth={1} />
        <line x1={toSvg(0, 0).sx} y1={0} x2={toSvg(0, 0).sx} y2={H} stroke="#d1d5db" strokeWidth={1} />
        {/* contours */}
        {contourPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#818cf8" strokeWidth={1} opacity={0.5 + i * 0.07} />
        ))}
        {/* gradient arrow */}
        <line x1={pxSvg} y1={pySvg} x2={arrowX} y2={arrowY} stroke="#ef4444" strokeWidth={2.5} />
        <polygon points={`${arrowX},${arrowY} ${arrowX - 6 * (gx / gradNorm) + 4 * (gy / gradNorm)},${arrowY + 6 * (gy / gradNorm) + 4 * (gx / gradNorm)} ${arrowX - 6 * (gx / gradNorm) - 4 * (gy / gradNorm)},${arrowY + 6 * (gy / gradNorm) - 4 * (gx / gradNorm)}`} fill="#ef4444" />
        {/* point */}
        <circle cx={pxSvg} cy={pySvg} r={5} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
        <text x={pxSvg + 7} y={pySvg - 5} fontSize={10} fill="#1d4ed8">{`(${px.toFixed(1)},${py.toFixed(1)})`}</text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[{ label: 'x', val: px, set: setPx }, { label: 'y', val: py, set: setPy }].map(({ label, val, set }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono">{label}</span><span>{val.toFixed(2)}</span>
            </div>
            <input type="range" min="-2.5" max="2.5" step="0.1" value={val}
              onChange={e => set(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm">
        <InlineMath math={`\\nabla f = [2x, 4y] = [${gx.toFixed(2)},\\, ${gy.toFixed(2)}]`} />,{' '}
        <InlineMath math={`\\|\\nabla f\\| = ${gradNorm.toFixed(3)}`} />,{' '}
        <InlineMath math={`f = ${f(px, py).toFixed(3)}`} />
      </div>
    </div>
  );
}

export default function GradientsSection() {
  return (
    <div className="space-y-8">
      <GradientViz />

      <DefinitionBlock
        label="Definition 4.1.1"
        title="Gradient Vector"
        definition={
          "For a differentiable function $f: \\mathbb{R}^n \\to \\mathbb{R}$, the gradient at $\\mathbf{x}$ is " +
          "$\\nabla f(\\mathbf{x}) = \\left(\\frac{\\partial f}{\\partial x_1}, \\ldots, \\frac{\\partial f}{\\partial x_n}\\right)^T \\in \\mathbb{R}^n$. " +
          "The gradient is the unique vector such that for any direction $\\mathbf{v}$, " +
          "$D_{\\mathbf{v}} f(\\mathbf{x}) = \\nabla f(\\mathbf{x})^T \\mathbf{v}$ (the directional derivative). " +
          "$\\nabla f$ points in the direction of steepest ascent; $-\\nabla f$ in steepest descent."
        }
        notation={
          "The gradient is perpendicular to level sets (contour lines): " +
          "if $c$ is a regular value, then $\\nabla f(\\mathbf{x}) \\perp \\{\\mathbf{y} : f(\\mathbf{y}) = f(\\mathbf{x})\\}$ at $\\mathbf{x}$."
        }
      />

      <DefinitionBlock
        label="Definition 4.1.2"
        title="Directional Derivative"
        definition={
          "The directional derivative of $f$ at $\\mathbf{x}$ in direction $\\mathbf{u}$ (unit vector) is " +
          "$D_{\\mathbf{u}} f(\\mathbf{x}) = \\lim_{h \\to 0} \\frac{f(\\mathbf{x} + h\\mathbf{u}) - f(\\mathbf{x})}{h} = \\nabla f(\\mathbf{x})^T \\mathbf{u}$. " +
          "By Cauchy-Schwarz: $|D_{\\mathbf{u}} f| \\leq \\|\\nabla f\\| \\|\\mathbf{u}\\| = \\|\\nabla f\\|$, " +
          "with equality when $\\mathbf{u} = \\nabla f / \\|\\nabla f\\|$ (gradient direction)."
        }
      />

      <TheoremBlock
        label="Theorem 4.1.1"
        title="Chain Rule for Multivariable Functions"
        statement={
          "If $f: \\mathbb{R}^m \\to \\mathbb{R}$ and $\\mathbf{g}: \\mathbb{R}^n \\to \\mathbb{R}^m$ are differentiable, " +
          "then $h = f \\circ \\mathbf{g}: \\mathbb{R}^n \\to \\mathbb{R}$ is differentiable and " +
          "$\\nabla h(\\mathbf{x}) = J_{\\mathbf{g}}(\\mathbf{x})^T \\nabla f(\\mathbf{g}(\\mathbf{x}))$ " +
          "where $J_{\\mathbf{g}}$ is the Jacobian matrix of $\\mathbf{g}$."
        }
        proof={
          "Apply the total derivative: $Dh(\\mathbf{x}) = Df(\\mathbf{g}(\\mathbf{x})) \\circ D\\mathbf{g}(\\mathbf{x})$. " +
          "The total derivative of $f$ at $\\mathbf{g}(\\mathbf{x})$ is $\\nabla f^T$; " +
          "the total derivative of $\\mathbf{g}$ is $J_{\\mathbf{g}}$. " +
          "Composing: $Dh = \\nabla f^T J_{\\mathbf{g}}$, which as a gradient gives $J_{\\mathbf{g}}^T \\nabla f$."
        }
      />

      <ExampleBlock title="Gradient Descent Step">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          For <InlineMath math="f(x,y) = x^2 + 2y^2" />, starting at <InlineMath math="(2, 1)" /> with step size{' '}
          <InlineMath math="\eta = 0.1" />:
        </p>
        <BlockMath math="\nabla f(2, 1) = (2 \cdot 2,\; 4 \cdot 1) = (4, 4)" />
        <BlockMath math="(x_1, y_1) = (2,1) - 0.1 \cdot (4, 4) = (1.6,\; 0.6)" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <InlineMath math="f(2,1) = 6" /> → <InlineMath math="f(1.6, 0.6) = 2.56 + 0.72 = 3.28" />. Descending!
        </p>
      </ExampleBlock>

      <WarningBlock title="Gradient Points in Input Space, Not Output Space">
        <p>
          A common confusion: for <InlineMath math="f: \mathbb{R}^n \to \mathbb{R}" />, the gradient
          <InlineMath math="\nabla f \in \mathbb{R}^n" /> lives in the <em>input</em> space, not output.
          For vector-valued functions <InlineMath math="F: \mathbb{R}^n \to \mathbb{R}^m" />, there is no
          single gradient — instead there is a Jacobian <InlineMath math="J \in \mathbb{R}^{m \times n}" />.
          In deep learning, the &quot;gradient of the loss&quot; means <InlineMath math="\nabla_\theta \mathcal{L} \in \mathbb{R}^p" />{' '}
          where <InlineMath math="p" /> is the number of parameters.
        </p>
      </WarningBlock>

      <PythonCode
        title="Gradients with NumPy and Autograd"
        code={`import numpy as np

# ── Finite difference gradient ────────────────────────────────────────────
def numerical_gradient(f, x, h=1e-5):
    """Compute gradient via central differences."""
    grad = np.zeros_like(x)
    for i in range(len(x)):
        x_plus = x.copy(); x_plus[i] += h
        x_minus = x.copy(); x_minus[i] -= h
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * h)
    return grad

f = lambda x: x[0]**2 + 2*x[1]**2
x0 = np.array([1.5, 1.0])
grad = numerical_gradient(f, x0)
print(f"f(x,y) = x²+2y², ∇f at {x0}: {grad}")
print(f"Analytic: [2x, 4y] = [{2*x0[0]}, {4*x0[1]}]")

# ── Gradient descent ──────────────────────────────────────────────────────
def gradient_descent(f, grad_f, x0, lr=0.1, n_steps=50):
    x = x0.copy()
    history = [x.copy()]
    for _ in range(n_steps):
        x -= lr * grad_f(x)
        history.append(x.copy())
    return x, np.array(history)

grad_f = lambda x: np.array([2*x[0], 4*x[1]])
x_opt, hist = gradient_descent(f, grad_f, np.array([2.0, 1.5]))
print(f"\\nGradient descent converged to: {x_opt}")
print(f"f(x*) = {f(x_opt):.2e}")
print(f"Steps: {len(hist)}, f values: {[f(h):.3f for h in hist[::10]]}")

# ── Directional derivative ─────────────────────────────────────────────────
u = np.array([1.0, 1.0]) / np.sqrt(2)  # unit vector 45°
Duf = np.dot(grad_f(x0), u)
print(f"\\nDirectional deriv in [1,1]/√2 direction: {Duf:.4f}")
print(f"Max directional deriv (gradient magnitude): {np.linalg.norm(grad_f(x0)):.4f}")`}
      />
    </div>
  );
}
