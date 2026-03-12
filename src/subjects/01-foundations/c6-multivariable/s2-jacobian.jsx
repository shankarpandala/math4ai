import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const SZ = 260;
const PAD = 20;

function transformPoint(x, y, J) {
  // Apply 2x2 Jacobian matrix J = [[a,b],[c,d]] to point (x,y)
  return [J[0][0]*x + J[0][1]*y, J[1][0]*x + J[1][1]*y];
}

const TRANSFORMS = [
  { id: 'scale', label: 'Scale (2, 0.5)', J: [[2, 0], [0, 0.5]] },
  { id: 'rotate', label: 'Rotate 45°', J: [[Math.cos(Math.PI/4), -Math.sin(Math.PI/4)], [Math.sin(Math.PI/4), Math.cos(Math.PI/4)]] },
  { id: 'shear', label: 'Shear', J: [[1, 0.7], [0, 1]] },
  { id: 'identity', label: 'Identity', J: [[1, 0], [0, 1]] },
];

// Unit grid points
const GRID_LINES = [
  // Horizontal lines y = -1, 0, 1
  ...[-1, 0, 1].map((y) => ({ pts: [[-1, y], [0, y], [1, y]], color: '#94a3b8' })),
  // Vertical lines x = -1, 0, 1
  ...[-1, 0, 1].map((x) => ({ pts: [[x, -1], [x, 0], [x, 1]], color: '#94a3b8' })),
];

function JacobianViz() {
  const [tId, setTId] = useState('scale');
  const [t, setT] = useState(1); // interpolation 0..1

  const transform = TRANSFORMS.find((tr) => tr.id === tId);
  const J = transform.J;
  const det = J[0][0]*J[1][1] - J[0][1]*J[1][0];

  // Interpolate between identity and J
  const tJ = [
    [1 + (J[0][0]-1)*t, J[0][1]*t],
    [J[1][0]*t, 1 + (J[1][1]-1)*t],
  ];

  const toSvgX = (v) => SZ/2 + v * 70;
  const toSvgY = (v) => SZ/2 - v * 70;

  function transformedPts(pts) {
    return pts.map(([x, y]) => {
      const [tx, ty] = transformPoint(x, y, tJ);
      return [toSvgX(tx), toSvgY(ty)];
    });
  }

  // Colors for grid
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        2D Transformation Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        The Jacobian describes how a smooth map deforms space. Slide to interpolate between identity and the transformation.
      </p>

      {/* Selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TRANSFORMS.map((tr) => (
          <button key={tr.id} onClick={() => { setTId(tr.id); setT(1); }}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${tId === tr.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
            {tr.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <svg width={SZ} height={SZ} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40 shrink-0">
          {/* Transformed grid */}
          {GRID_LINES.map((line, li) => {
            const tPts = transformedPts(line.pts);
            const d = tPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ');
            return <path key={li} d={d} fill="none" stroke={colors[li % colors.length]} strokeWidth="1.5" opacity="0.7" />;
          })}

          {/* Basis vectors */}
          {[[1,0,'#6366f1','e₁'], [0,1,'#10b981','e₂']].map(([bx, by, col, lbl]) => {
            const [tx, ty] = transformPoint(bx, by, tJ);
            const ox = toSvgX(0), oy = toSvgY(0);
            const ex = toSvgX(tx), ey = toSvgY(ty);
            return (
              <g key={lbl}>
                <line x1={ox} y1={oy} x2={ex} y2={ey} stroke={col} strokeWidth="3" />
                <circle cx={ex} cy={ey} r="5" fill={col} />
                <text x={ex + 5} y={ey - 5} fontSize="10" fill={col} fontWeight="bold">{lbl}</text>
              </g>
            );
          })}

          {/* Origin */}
          <circle cx={toSvgX(0)} cy={toSvgY(0)} r="4" fill="#374151" />
        </svg>

        <div className="flex-1 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Interpolation t = {t.toFixed(2)}
            </label>
            <input type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => setT(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40 text-xs space-y-2">
            <div className="font-semibold text-gray-700 dark:text-gray-300">Jacobian J:</div>
            <div className="font-mono">
              [{J[0][0].toFixed(2)}, {J[0][1].toFixed(2)}]<br />
              [{J[1][0].toFixed(2)}, {J[1][1].toFixed(2)}]
            </div>
            <div>det(J) = <strong className={Math.abs(det) < 0.01 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}>{det.toFixed(4)}</strong></div>
            <div className="text-gray-500 dark:text-gray-400">
              |det(J)| = area scaling factor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JacobianAndChainRule() {
  return (
    <div className="space-y-8">
      <JacobianViz />

      <DefinitionBlock
        label="Definition 2.1"
        title="Jacobian Matrix"
        definition="For $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$ with components $f_1, \ldots, f_m$, the Jacobian matrix at $\mathbf{a}$ is the $m \times n$ matrix $J_\mathbf{f}(\mathbf{a}) = \frac{\partial(f_1, \ldots, f_m)}{\partial(x_1, \ldots, x_n)} = \begin{pmatrix} \partial f_i / \partial x_j \end{pmatrix}_{ij}$. It is the matrix representation of the total (Fréchet) derivative."
        notation="Row $i$ is $\nabla f_i^T$. For $n=m$, $\det J_\mathbf{f}(\mathbf{a})$ is the Jacobian determinant, measuring local area/volume scaling."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Multivariable Chain Rule"
        definition="If $\mathbf{g}: \mathbb{R}^k \to \mathbb{R}^n$ and $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$ are differentiable, then the composition $\mathbf{f} \circ \mathbf{g}: \mathbb{R}^k \to \mathbb{R}^m$ is differentiable and its Jacobian at $\mathbf{a}$ is $J_{\mathbf{f} \circ \mathbf{g}}(\mathbf{a}) = J_\mathbf{f}(\mathbf{g}(\mathbf{a})) \cdot J_\mathbf{g}(\mathbf{a})$."
        notation="In terms of components: $\frac{\partial(f \circ g)_i}{\partial a_j} = \sum_k \frac{\partial f_i}{\partial g_k} \cdot \frac{\partial g_k}{\partial a_j}$. This generalises the 1D chain rule $\frac{d}{dx}f(g(x)) = f'(g(x))g'(x)$."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Inverse Function Theorem"
        statement="Let $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^n$ be $C^1$ and let $\det J_\mathbf{f}(\mathbf{a}) \neq 0$. Then there exist open sets $U \ni \mathbf{a}$ and $V \ni \mathbf{f}(\mathbf{a})$ such that $\mathbf{f}: U \to V$ is a $C^1$ diffeomorphism (bijective with $C^1$ inverse). Moreover, $J_{\mathbf{f}^{-1}}(\mathbf{f}(\mathbf{a})) = [J_\mathbf{f}(\mathbf{a})]^{-1}$."
        proof="The proof uses the Banach fixed-point theorem (contraction mapping). Define $T(\mathbf{x}) = \mathbf{a} + [J_\mathbf{f}(\mathbf{a})]^{-1}(\mathbf{y} - \mathbf{f}(\mathbf{x}))$ for a target $\mathbf{y}$; one shows $T$ is a contraction on a small ball, so it has a unique fixed point $\mathbf{x} = \mathbf{f}^{-1}(\mathbf{y})$. Smoothness of the inverse follows from the chain rule and the formula $J_{\mathbf{f}^{-1}} = (J_\mathbf{f})^{-1}$. $\square$"
        corollaries={[
          'The condition $\\det J \\neq 0$ is the non-degeneracy needed: at critical points ($\\det J = 0$) the local structure can be complex.',
          'Used in change-of-variables for integration: $\\int_V f = \\int_U (f \\circ \\mathbf{g}) |\\det J_\\mathbf{g}|$.',
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Chain Rule for Neural Networks (Backpropagation)"
        statement="For a feedforward network with layers $\mathbf{a}^{(l)} = \sigma(W^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)})$, the gradient of loss $\mathcal{L}$ with respect to layer $l$ weights is $\frac{\partial \mathcal{L}}{\partial W^{(l)}} = \boldsymbol{\delta}^{(l)} (\mathbf{a}^{(l-1)})^T$ where $\boldsymbol{\delta}^{(l)} = (W^{(l+1)})^T \boldsymbol{\delta}^{(l+1)} \odot \sigma'(\mathbf{z}^{(l)})$ is computed by the multivariable chain rule."
        proof="This follows directly from repeated application of the matrix chain rule: $J_{\mathcal{L} \circ \mathbf{a}^{(L)} \circ \cdots \circ \mathbf{a}^{(l)}} = J_\mathcal{L} \cdot J_{\mathbf{a}^{(L)}} \cdots J_{\mathbf{a}^{(l)}}$, evaluated from the output layer backwards (hence 'backpropagation'). $\square$"
      />

      <ExampleBlock
        title="Jacobian of a 2D Polar Transformation"
        difficulty="intermediate"
        problem="Compute the Jacobian matrix and determinant for the polar coordinate map $\mathbf{f}(r, \theta) = (r\cos\theta, r\sin\theta)$."
        solution={[
          {
            step: 'Write the component functions',
            formula: 'f_1(r,\\theta) = r\\cos\\theta, \\quad f_2(r,\\theta) = r\\sin\\theta',
            explanation: 'The map takes (r,θ) to Cartesian (x,y).',
          },
          {
            step: 'Compute all four partial derivatives',
            formula: '\\frac{\\partial f_1}{\\partial r} = \\cos\\theta, \\quad \\frac{\\partial f_1}{\\partial \\theta} = -r\\sin\\theta',
            explanation: '',
          },
          {
            step: '',
            formula: '\\frac{\\partial f_2}{\\partial r} = \\sin\\theta, \\quad \\frac{\\partial f_2}{\\partial \\theta} = r\\cos\\theta',
            explanation: '',
          },
          {
            step: 'Assemble the Jacobian',
            formula: 'J_\\mathbf{f}(r,\\theta) = \\begin{pmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{pmatrix}',
            explanation: '',
          },
          {
            step: 'Compute the determinant',
            formula: '\\det J = \\cos\\theta \\cdot r\\cos\\theta - (-r\\sin\\theta)\\sin\\theta = r\\cos^2\\theta + r\\sin^2\\theta = r',
            explanation: 'So |det J| = r, which is the area scaling factor in polar coordinates: dA = r dr dθ.',
          },
        ]}
      />

      <WarningBlock title="Jacobian Matrix vs Jacobian Determinant">
        <p className="mb-2">
          The term "Jacobian" is used for two things that are often confused:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-sm">
          <li><strong>Jacobian matrix</strong>: the full <InlineMath math="m \times n" /> matrix of partial derivatives — used in the chain rule.</li>
          <li><strong>Jacobian determinant</strong>: <InlineMath math="\det J_\mathbf{f}" /> (only when <InlineMath math="m = n" />) — used in change of variables in integration.</li>
        </ul>
        <p className="mt-2">
          In machine learning, "Jacobian" almost always means the matrix. In calculus integration, it usually means the determinant (or its absolute value).
        </p>
      </WarningBlock>

      <PythonCode
        title="Jacobian Computation — Python"
        code={`import numpy as np

# Numerical Jacobian via finite differences
def numerical_jacobian(f, x, h=1e-5):
    x = np.array(x, dtype=float)
    m = len(f(x))
    n = len(x)
    J = np.zeros((m, n))
    for j in range(n):
        xp = x.copy(); xp[j] += h
        xm = x.copy(); xm[j] -= h
        J[:, j] = (f(xp) - f(xm)) / (2 * h)
    return J

# Polar coordinate map
def polar(rv):
    r, theta = rv
    return np.array([r * np.cos(theta), r * np.sin(theta)])

r, theta = 2.0, np.pi / 4
J = numerical_jacobian(polar, [r, theta])
print("Jacobian of polar map at (r=2, theta=pi/4):")
print(J.round(6))
print(f"det(J) = {np.linalg.det(J):.6f}  (should be r = {r})")

# Verify chain rule: f(g(t)) where g: R -> R^2, f: R^2 -> R
g = lambda t: np.array([t**2, np.sin(t)])
f_scalar = lambda xy: xy[0] + xy[1]**2  # f(x,y) = x + y^2

t0 = 1.0
Jg = numerical_jacobian(g, [t0])  # 2x1
# grad_f at g(t0)
grad_f = numerical_jacobian(lambda xy: np.array([f_scalar(xy)]), g(t0))  # 1x2
chain = (grad_f @ Jg)[0, 0]
exact = 2*t0 + 2*np.sin(t0)*np.cos(t0)  # d/dt (t^2 + sin^2(t))
print(f"Chain rule: {chain:.8f}, exact: {exact:.8f}")
`}
        runnable
      />
    </div>
  );
}
