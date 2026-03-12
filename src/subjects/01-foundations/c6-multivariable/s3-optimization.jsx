import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Hessian eigenvalue explorer
const SURFACES = [
  { id: 'bowl', label: 'Bowl (min)', fn: (x, y) => x*x + y*y, H: [[2,0],[0,2]], type: 'minimum' },
  { id: 'ridge', label: 'Ridge (max)', fn: (x, y) => -(x*x + y*y), H: [[-2,0],[0,-2]], type: 'maximum' },
  { id: 'saddle', label: 'Saddle', fn: (x, y) => x*x - y*y, H: [[2,0],[0,-2]], type: 'saddle' },
  { id: 'monkey', label: 'Mixed', fn: (x, y) => x*x + 2*x*y + 3*y*y, H: [[2,2],[2,6]], type: 'minimum' },
];

const SZ = 280;

function hessianEigs(H) {
  const a = H[0][0], b = H[0][1], d = H[1][1];
  const trace = a + d;
  const det = a * d - b * b;
  const disc = Math.sqrt(Math.max(0, trace*trace - 4*det));
  return [(trace + disc) / 2, (trace - disc) / 2];
}

function OptimizationViz() {
  const [surfId, setSurfId] = useState('bowl');
  const [px, setPx] = useState(0.8);
  const [py, setPy] = useState(0.6);

  const surf = SURFACES.find((s) => s.id === surfId);
  const H = surf.H;
  const eigs = hessianEigs(H);
  const det = H[0][0]*H[1][1] - H[0][1]*H[1][0];
  const trace = H[0][0] + H[1][1];

  // Gradient (numerical)
  const h = 0.001;
  const gx = (surf.fn(px+h, py) - surf.fn(px-h, py)) / (2*h);
  const gy = (surf.fn(px, py+h) - surf.fn(px, py-h)) / (2*h);
  const gradNorm = Math.sqrt(gx*gx + gy*gy);

  // Classify
  let classColor = 'gray', classText = '';
  if (Math.abs(gx) < 0.05 && Math.abs(gy) < 0.05) {
    if (det > 0 && trace > 0) { classColor = 'green'; classText = 'Local minimum'; }
    else if (det > 0 && trace < 0) { classColor = 'blue'; classText = 'Local maximum'; }
    else if (det < 0) { classColor = 'red'; classText = 'Saddle point'; }
    else { classColor = 'yellow'; classText = 'Inconclusive (det=0)'; }
  } else {
    classText = 'Not a critical point';
  }

  const CW = SZ, CH = 200;
  const xLo = -1.5, xHi = 1.5;
  const toX = (v) => PAD + ((v - xLo)/(xHi - xLo)) * (CW - 2*PAD);
  const PAD = 24;

  // Cross-sections through px,py in x-direction and y-direction
  const xs = Array.from({ length: 80 }, (_, i) => xLo + (i/79)*(xHi-xLo));
  const xSecVals = xs.map((x) => surf.fn(x, py));
  const ySecVals = xs.map((y) => surf.fn(px, y));

  const minV = Math.min(...xSecVals, ...ySecVals);
  const maxV = Math.max(...xSecVals, ...ySecVals);
  const vRange = maxV - minV || 1;
  const toY = (v) => PAD + (1 - (Math.max(minV - 0.1*vRange, Math.min(maxV + 0.1*vRange, v)) - (minV - 0.1*vRange)) / (vRange * 1.2)) * (CH - 2*PAD);

  const xPolyStr = xs.map((x, i) => `${toX(x)},${toY(xSecVals[i])}`).join(' ');
  const yPolyStr = xs.map((y, i) => `${toX(y)},${toY(ySecVals[i])}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Gradient &amp; Hessian Sign Explorer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Move the point and observe how the gradient and Hessian eigenvalues classify the critical point.
      </p>

      {/* Surface selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SURFACES.map((s) => (
          <button key={s.id} onClick={() => setSurfId(s.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${surfId === s.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Cross-section chart */}
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40 mb-4">
        <line x1={PAD} y1={CH-PAD} x2={CW-PAD} y2={CH-PAD} stroke="#94a3b8" strokeWidth="1" />
        <polyline points={xPolyStr} fill="none" stroke="#6366f1" strokeWidth="2" />
        <polyline points={yPolyStr} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6,3" />

        {/* Current point on x-cross-section */}
        <circle cx={toX(px)} cy={toY(surf.fn(px, py))} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />

        {/* Legend */}
        <line x1={PAD} y1={12} x2={PAD+20} y2={12} stroke="#6366f1" strokeWidth="2" />
        <text x={PAD+24} y={16} fontSize="9" fill="#6366f1">f(x, {py.toFixed(1)})</text>
        <line x1={PAD+90} y1={12} x2={PAD+110} y2={12} stroke="#10b981" strokeWidth="2" strokeDasharray="5,3" />
        <text x={PAD+114} y={16} fontSize="9" fill="#10b981">f({px.toFixed(1)}, y)</text>
      </svg>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">x = {px.toFixed(2)}</label>
          <input type="range" min={-1.2} max={1.2} step={0.05} value={px} onChange={(e) => setPx(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">y = {py.toFixed(2)}</label>
          <input type="range" min={-1.2} max={1.2} step={0.05} value={py} onChange={(e) => setPy(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>

      {/* Info panel */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40 space-y-1">
          <div className="font-semibold">Gradient:</div>
          <div>∂f/∂x ≈ <strong>{gx.toFixed(4)}</strong></div>
          <div>∂f/∂y ≈ <strong>{gy.toFixed(4)}</strong></div>
          <div>‖∇f‖ = <strong>{gradNorm.toFixed(4)}</strong></div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40 space-y-1">
          <div className="font-semibold">Hessian eigenvalues:</div>
          <div>λ₁ = <strong className={eigs[0] > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{eigs[0].toFixed(3)}</strong></div>
          <div>λ₂ = <strong className={eigs[1] > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{eigs[1].toFixed(3)}</strong></div>
          <div>det(H) = <strong>{det.toFixed(3)}</strong></div>
        </div>
      </div>

      <div className={`mt-3 rounded-lg border px-4 py-2 text-sm font-semibold ${
        classColor === 'green' ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300' :
        classColor === 'red' ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/20 dark:text-rose-300' :
        classColor === 'blue' ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/20 dark:text-blue-300' :
        'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
      }`}>
        Classification: <strong>{classText}</strong>
        {classText !== 'Not a critical point' && ` (type: ${surf.type})`}
      </div>
    </div>
  );
}

export default function OptimizationConditions() {
  return (
    <div className="space-y-8">
      <OptimizationViz />

      <DefinitionBlock
        label="Definition 3.1"
        title="Critical Point"
        definition="A point $\mathbf{a} \in \mathbb{R}^n$ is a critical point (stationary point) of $f: \mathbb{R}^n \to \mathbb{R}$ if $\nabla f(\mathbf{a}) = \mathbf{0}$ (all partial derivatives vanish). Critical points are candidates for local extrema but may also be saddle points."
        notation="The first-order necessary condition for a local minimum or maximum (in the unconstrained case) is $\nabla f(\mathbf{a}) = \mathbf{0}$."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Hessian Matrix"
        definition="The Hessian of $f: \mathbb{R}^n \to \mathbb{R}$ at $\mathbf{a}$ is the $n \times n$ symmetric matrix $H_f(\mathbf{a}) = \left(\frac{\partial^2 f}{\partial x_i \partial x_j}(\mathbf{a})\right)_{ij}$. For $C^2$ functions, $H_f$ is symmetric (Clairaut's theorem)."
        notation="A matrix is positive definite ($H \succ 0$) if all eigenvalues are positive; negative definite ($H \prec 0$) if all negative; indefinite if some are positive and some negative."
      />

      <DefinitionBlock
        label="Definition 3.3"
        title="Second-Order Optimality Conditions"
        definition="At a critical point $\mathbf{a}$ with $\nabla f(\mathbf{a}) = \mathbf{0}$: (1) If $H_f(\mathbf{a}) \succ 0$ (positive definite), then $\mathbf{a}$ is a strict local minimum. (2) If $H_f(\mathbf{a}) \prec 0$ (negative definite), then $\mathbf{a}$ is a strict local maximum. (3) If $H_f(\mathbf{a})$ is indefinite (mixed eigenvalue signs), then $\mathbf{a}$ is a saddle point. (4) If $H_f(\mathbf{a})$ is positive or negative semidefinite, the test is inconclusive."
        notation="For $n=2$: local min iff det(H) > 0 and $f_{xx} > 0$; local max iff det(H) > 0 and $f_{xx} < 0$; saddle iff det(H) < 0."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Second Derivative Test in ℝⁿ"
        statement="Let $f \in C^2$ near $\mathbf{a}$ with $\nabla f(\mathbf{a}) = \mathbf{0}$. (1) If $H_f(\mathbf{a})$ is positive definite, $f$ has a strict local minimum at $\mathbf{a}$. (2) If negative definite, a strict local maximum. (3) If indefinite, a saddle point. In case (1) or (2), by the Taylor expansion $f(\mathbf{a} + \mathbf{h}) = f(\mathbf{a}) + \tfrac{1}{2}\mathbf{h}^T H_f(\mathbf{a}) \mathbf{h} + o(\|\mathbf{h}\|^2)$."
        proof="From the Taylor expansion at a critical point: $f(\mathbf{a}+\mathbf{h}) - f(\mathbf{a}) = \tfrac{1}{2}\mathbf{h}^T H \mathbf{h} + o(\|\mathbf{h}\|^2)$. If $H \succ 0$, then $\mathbf{h}^T H \mathbf{h} \geq \lambda_{\min}\|\mathbf{h}\|^2 > 0$ for $\mathbf{h} \neq 0$, and the remainder is negligible for small $\mathbf{h}$. Hence $f(\mathbf{a}+\mathbf{h}) > f(\mathbf{a})$ for small $\mathbf{h} \neq 0$. The negative definite case is analogous. $\square$"
        corollaries={[
          'For convex functions, any critical point is a global minimum.',
          'In deep learning, the loss landscape has many saddle points; gradient descent can stall near them, motivating adaptive methods like Adam.',
        ]}
      />

      <ExampleBlock
        title="Finding and Classifying Critical Points"
        difficulty="intermediate"
        problem="Find and classify all critical points of $f(x,y) = x^3 - 3xy^2 - x$."
        solution={[
          {
            step: 'Compute partial derivatives',
            formula: 'f_x = 3x^2 - 3y^2 - 1, \\quad f_y = -6xy',
            explanation: '',
          },
          {
            step: 'Set ∂f/∂y = 0',
            formula: '-6xy = 0 \\implies x = 0 \\text{ or } y = 0',
            explanation: 'Two cases to consider.',
          },
          {
            step: 'Case x = 0: set f_x = 0',
            formula: '3(0)^2 - 3y^2 - 1 = 0 \\implies y^2 = -1/3',
            explanation: 'No real solutions. No critical points with x = 0.',
          },
          {
            step: 'Case y = 0: set f_x = 0',
            formula: '3x^2 - 1 = 0 \\implies x = \\pm 1/\\sqrt{3}',
            explanation: 'Two critical points: (1/√3, 0) and (-1/√3, 0).',
          },
          {
            step: 'Compute Hessian',
            formula: 'H = \\begin{pmatrix} 6x & -6y \\\\ -6y & -6x \\end{pmatrix}',
            explanation: '',
          },
          {
            step: 'Classify at (1/√3, 0): det(H) = -36x² = -12 < 0 → saddle point',
            formula: '\\det H = (6x)(-6x) - (-6y)^2 = -36x^2 - 36y^2 < 0',
            explanation: 'Both critical points are saddle points.',
          },
        ]}
      />

      <WarningBlock title="Vanishing Gradient ≠ Minimum in Neural Networks">
        <p className="mb-2">
          In training deep networks, the loss landscape has an enormous number of saddle points
          where <InlineMath math="\nabla \mathcal{L} \approx 0" /> but the Hessian is indefinite.
          Gradient descent can get "stuck" near these.
        </p>
        <p>
          Also: even at a true local minimum, the Hessian may be nearly singular (flat directions),
          leading to slow convergence. Second-order methods (Newton, natural gradient) use Hessian
          information to navigate this, at the cost of <InlineMath math="O(n^2)" /> memory.
        </p>
      </WarningBlock>

      <PythonCode
        title="Critical Points & Hessian Analysis — Python"
        code={`import numpy as np
from scipy.optimize import minimize
from scipy.linalg import eigh

def f(w):
    x, y = w
    return x**3 - 3*x*y**2 - x

def grad_f(w):
    x, y = w
    return np.array([3*x**2 - 3*y**2 - 1, -6*x*y])

def hessian_f(w):
    x, y = w
    return np.array([[6*x, -6*y], [-6*y, -6*x]])

# Find critical points (where grad = 0)
from scipy.optimize import fsolve
for x0 in [1.0, -1.0]:
    cp = fsolve(grad_f, [x0, 0.0])
    H = hessian_f(cp)
    eigs = np.linalg.eigvalsh(H)
    det_H = np.linalg.det(H)
    print(f"Critical point: {cp}, det(H)={det_H:.4f}, eigenvalues={eigs.round(4)}")
    if det_H < 0:
        print("  -> Saddle point")
    elif eigs.min() > 0:
        print("  -> Local minimum")
    elif eigs.max() < 0:
        print("  -> Local maximum")

# Gradient descent on a simple quadratic
def loss(w): return (w[0]-2)**2 + 2*(w[1]+1)**2
def grad_loss(w): return np.array([2*(w[0]-2), 4*(w[1]+1)])

w = np.array([0.0, 0.0])
for i in range(200):
    w = w - 0.1 * grad_loss(w)
print(f"\\nGradient descent minimum: {w} (exact: [2, -1])")
`}
        runnable
      />
    </div>
  );
}
