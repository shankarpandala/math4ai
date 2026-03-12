import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Surface cross-sections via SVG
const GRID = 9; // grid size for surface

function surfaceVal(x, y, fn) {
  if (fn === 'paraboloid') return x * x + y * y;
  if (fn === 'saddle') return x * x - y * y;
  if (fn === 'sincos') return Math.sin(x) * Math.cos(y);
  return x * x + y * y;
}

function PartialDerivViz() {
  const [fn, setFn] = useState('paraboloid');
  const [fixX, setFixX] = useState(0.5);   // fixed x for ∂f/∂y cross-section
  const [fixY, setFixY] = useState(0.5);   // fixed y for ∂f/∂x cross-section
  const [showX, setShowX] = useState(true); // show ∂/∂x cross-section

  const FNS = [
    { id: 'paraboloid', label: 'x² + y²' },
    { id: 'saddle', label: 'x² - y²' },
    { id: 'sincos', label: 'sin(x)cos(y)' },
  ];

  const CW = 280, CH = 200;
  const xLo = -1.5, xHi = 1.5;

  const toSvgX = (v) => 20 + ((v - xLo) / (xHi - xLo)) * (CW - 40);
  const toSvgY = (v) => {
    const lo = -2.5, hi = 2.5;
    return 10 + (1 - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (CH - 40);
  };

  // Cross-section: vary x with fixed y (∂f/∂x direction)
  const xs = Array.from({ length: 80 }, (_, i) => xLo + (i / 79) * (xHi - xLo));
  const xSection = xs.map((x) => surfaceVal(x, fixY, fn));
  const ySection = xs.map((y) => surfaceVal(fixX, y, fn));

  const activeSection = showX ? xSection : ySection;
  const fixedVal = showX ? fixY : fixX;
  const polyStr = xs.map((x, i) => `${toSvgX(x)},${toSvgY(activeSection[i])}`).join(' ');

  // Numerical partial at midpoint
  const h = 0.01;
  const dfdx = (surfaceVal(fixX + h, fixY, fn) - surfaceVal(fixX - h, fixY, fn)) / (2 * h);
  const dfdy = (surfaceVal(fixX, fixY + h, fn) - surfaceVal(fixX, fixY - h, fn)) / (2 * h);
  const zeroY = toSvgY(0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Surface Cross-Section Explorer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        A partial derivative is the slope of a cross-section of the surface with one variable fixed.
      </p>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FNS.map((f) => (
          <button key={f.id} onClick={() => setFn(f.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${fn === f.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="shrink-0">
          <svg width={CW} height={CH} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
            {/* Zero line */}
            <line x1={20} y1={zeroY} x2={CW - 20} y2={zeroY} stroke="#e2e8f0" strokeWidth="1" />
            {/* Axes */}
            <line x1={20} y1={10} x2={20} y2={CH - 30} stroke="#94a3b8" strokeWidth="1" />
            <line x1={20} y1={CH - 30} x2={CW - 20} y2={CH - 30} stroke="#94a3b8" strokeWidth="1" />
            {/* Cross-section curve */}
            <polyline points={polyStr} fill="none" stroke={showX ? '#6366f1' : '#10b981'} strokeWidth="2.5" />
            {/* Tangent at fixed point */}
            {(() => {
              const pt = showX ? fixX : fixY;
              const slope = showX ? dfdx : dfdy;
              const fval = surfaceVal(fixX, fixY, fn);
              const x1 = pt - 0.4, x2 = pt + 0.4;
              const p1 = `${toSvgX(x1)},${toSvgY(fval + slope * (x1 - pt))}`;
              const p2 = `${toSvgX(x2)},${toSvgY(fval + slope * (x2 - pt))}`;
              return (
                <>
                  <polyline points={`${p1} ${p2}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx={toSvgX(pt)} cy={toSvgY(fval)} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                </>
              );
            })()}
            {/* Labels */}
            <text x={CW / 2} y={CH - 10} textAnchor="middle" fontSize="9" fill="#94a3b8">
              {showX ? 'x' : 'y'}
            </text>
          </svg>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setShowX(true)} className={`rounded px-3 py-1 text-xs font-semibold ${showX ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'}`}>
              ∂f/∂x (fix y)
            </button>
            <button onClick={() => setShowX(false)} className={`rounded px-3 py-1 text-xs font-semibold ${!showX ? 'bg-emerald-600 text-white' : 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'}`}>
              ∂f/∂y (fix x)
            </button>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Fixed x = {fixX.toFixed(2)}
            </label>
            <input type="range" min={-1.2} max={1.2} step={0.05} value={fixX} onChange={(e) => setFixX(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Fixed y = {fixY.toFixed(2)}
            </label>
            <input type="range" min={-1.2} max={1.2} step={0.05} value={fixY} onChange={(e) => setFixY(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40 text-xs space-y-1">
            <div>At (<strong>{fixX.toFixed(2)}</strong>, <strong>{fixY.toFixed(2)}</strong>):</div>
            <div>∂f/∂x ≈ <strong>{dfdx.toFixed(4)}</strong></div>
            <div>∂f/∂y ≈ <strong>{dfdy.toFixed(4)}</strong></div>
            <div>∇f ≈ (<strong>{dfdx.toFixed(2)}</strong>, <strong>{dfdy.toFixed(2)}</strong>)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartialDerivatives() {
  return (
    <div className="space-y-8">
      <PartialDerivViz />

      <DefinitionBlock
        label="Definition 1.1"
        title="Partial Derivative"
        definition="For $f: \mathbb{R}^n \to \mathbb{R}$, the partial derivative with respect to $x_i$ at $\mathbf{a}$ is $\frac{\partial f}{\partial x_i}(\mathbf{a}) = \lim_{h \to 0} \frac{f(\mathbf{a} + h\mathbf{e}_i) - f(\mathbf{a})}{h}$, where $\mathbf{e}_i$ is the $i$-th standard basis vector. It measures the rate of change of $f$ along the $x_i$ direction while all other variables are held fixed."
        notation="Also written $f_{x_i}(\mathbf{a})$, $D_i f(\mathbf{a})$, or $\partial_i f(\mathbf{a})$. All differentiation rules (product, chain) apply to partial derivatives."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Gradient"
        definition="The gradient of $f: \mathbb{R}^n \to \mathbb{R}$ at $\mathbf{a}$ is the vector of all partial derivatives: $\nabla f(\mathbf{a}) = \left(\frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \ldots, \frac{\partial f}{\partial x_n}\right)\bigg|_{\mathbf{a}}$. The gradient points in the direction of steepest ascent of $f$."
        notation="$\nabla f(\mathbf{a}) \in \mathbb{R}^n$ (same space as the input). The directional derivative in direction $\mathbf{v}$ (unit vector) is $D_{\mathbf{v}} f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v}$."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Total Derivative (Fréchet)"
        definition="$f: \mathbb{R}^n \to \mathbb{R}^m$ is (totally) differentiable at $\mathbf{a}$ if there exists a linear map $L: \mathbb{R}^n \to \mathbb{R}^m$ such that $\lim_{\mathbf{h} \to 0} \frac{\|f(\mathbf{a}+\mathbf{h}) - f(\mathbf{a}) - L\mathbf{h}\|}{\|\mathbf{h}\|} = 0$. $L$ is represented by the Jacobian matrix."
        notation="Existence of all partial derivatives does NOT imply total differentiability. The converse holds: total differentiability implies all partial derivatives exist and equal the rows of the Jacobian."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Clairaut's Theorem (Symmetry of Mixed Partials)"
        statement="If $f: \mathbb{R}^2 \to \mathbb{R}$ has continuous second-order partial derivatives in a neighbourhood of $(a,b)$, then $\frac{\partial^2 f}{\partial x \partial y}(a,b) = \frac{\partial^2 f}{\partial y \partial x}(a,b)$."
        proof="By the continuity of the mixed partials, both express the same limit of the symmetric finite difference $\frac{f(a+h,b+k) - f(a+h,b) - f(a,b+k) + f(a,b)}{hk}$ as $h,k \to 0$. Since the mixed partials are continuous, both orderings give the same limit. $\square$"
        corollaries={[
          'For $C^2$ functions on $\\mathbb{R}^n$: $\\partial_i \\partial_j f = \\partial_j \\partial_i f$ for all $i, j$.',
          'Continuity is essential: Schwarz\'s counterexample $f(x,y) = xy(x^2-y^2)/(x^2+y^2)$ at the origin shows mixed partials can fail to commute without continuity.',
        ]}
      />

      <ExampleBlock
        title="Computing Gradient of a Loss Function"
        difficulty="intermediate"
        problem="For $f(w_1, w_2) = (w_1 - 2)^2 + (w_2 + 1)^2 + w_1 w_2$, compute $\nabla f$ and find the critical point."
        solution={[
          {
            step: 'Compute ∂f/∂w₁',
            formula: '\\frac{\\partial f}{\\partial w_1} = 2(w_1 - 2) + w_2',
            explanation: 'Treat w₂ as constant.',
          },
          {
            step: 'Compute ∂f/∂w₂',
            formula: '\\frac{\\partial f}{\\partial w_2} = 2(w_2 + 1) + w_1',
            explanation: 'Treat w₁ as constant.',
          },
          {
            step: 'Write the gradient',
            formula: '\\nabla f = \\begin{pmatrix} 2w_1 + w_2 - 4 \\\\ w_1 + 2w_2 + 2 \\end{pmatrix}',
            explanation: 'The gradient vector points uphill.',
          },
          {
            step: 'Find critical point: set ∇f = 0',
            formula: '\\begin{cases} 2w_1 + w_2 = 4 \\\\ w_1 + 2w_2 = -2 \\end{cases} \\implies w_1 = \\tfrac{10}{3},\\; w_2 = -\\tfrac{8}{3}',
            explanation: 'Solve the 2×2 linear system.',
          },
        ]}
      />

      <WarningBlock title="Partial Derivatives Exist ≠ Function Is Differentiable">
        <p className="mb-2">
          A classic counterexample: define <InlineMath math="f(x,y) = xy/(x^2+y^2)" /> for <InlineMath math="(x,y) \neq 0" /> and <InlineMath math="f(0,0) = 0" />.
          Both partials <InlineMath math="\partial f/\partial x" /> and <InlineMath math="\partial f/\partial y" /> exist at the origin (both are 0),
          but <InlineMath math="f" /> is not even continuous there (it takes different limits along different directions).
        </p>
        <p>
          To guarantee differentiability at a point, you need the partial derivatives to exist and be continuous in a neighbourhood (i.e., <InlineMath math="f \in C^1" />).
        </p>
      </WarningBlock>

      <PythonCode
        title="Partial Derivatives & Gradients — Python"
        code={`import numpy as np

def f(w):
    w1, w2 = w
    return (w1 - 2)**2 + (w2 + 1)**2 + w1 * w2

def numerical_gradient(f, w, h=1e-5):
    grad = np.zeros_like(w, dtype=float)
    for i in range(len(w)):
        wp = w.copy(); wp[i] += h
        wm = w.copy(); wm[i] -= h
        grad[i] = (f(wp) - f(wm)) / (2 * h)
    return grad

w = np.array([1.0, -0.5])
grad = numerical_gradient(f, w)
print(f"f({w}) = {f(w):.4f}")
print(f"∇f({w}) ≈ {grad}")  # [2w1+w2-4, w1+2w2+2]

# Analytical gradient
def grad_f(w):
    w1, w2 = w
    return np.array([2*(w1-2) + w2, 2*(w2+1) + w1])

print(f"Analytical ∇f = {grad_f(w)}")

# Gradient descent to find minimum
w = np.array([0.0, 0.0])
lr = 0.1
for _ in range(100):
    w = w - lr * grad_f(w)
print(f"Minimum found at w = {w} (exact: [10/3, -8/3] ≈ [{10/3:.4f}, {-8/3:.4f}])")
`}
        runnable
      />
    </div>
  );
}
