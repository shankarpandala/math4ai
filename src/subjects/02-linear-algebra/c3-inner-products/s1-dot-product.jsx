import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Vector angle/projection visualizer (SVG)
// ---------------------------------------------------------------------------
function DotProductViz() {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(3);

  const dot = ax * bx + ay * by;
  const normA = Math.sqrt(ax * ax + ay * ay);
  const normB = Math.sqrt(bx * bx + by * by);
  const cosTheta = normA > 0 && normB > 0 ? Math.max(-1, Math.min(1, dot / (normA * normB))) : 0;
  const thetaDeg = (Math.acos(cosTheta) * 180 / Math.PI).toFixed(1);

  // Projection of a onto b
  const projLen = normB > 0 ? dot / normB : 0;
  const projX = normB > 0 ? (dot / (normB * normB)) * bx : 0;
  const projY = normB > 0 ? (dot / (normB * normB)) * by : 0;

  const S = 45, OX = 200, OY = 230;
  const toSVG = (x, y) => [OX + x * S, OY - y * S];

  const arrowHead = (x1, y1, x2, y2, color) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 3) return null;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    return (
      <polygon points={`${x2},${y2} ${x2-ux*10+px*5},${y2-uy*10+py*5} ${x2-ux*10-px*5},${y2-uy*10-py*5}`}
        fill={color} />
    );
  };

  const drawVec = (x1, y1, x2, y2, color, dashed = false, strokeWidth = 2.5) => {
    const [sx1, sy1] = toSVG(x1, y1);
    const [sx2, sy2] = toSVG(x2, y2);
    return (
      <g>
        <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={dashed ? '5 4' : undefined} />
        {arrowHead(sx1, sy1, sx2, sy2, color)}
      </g>
    );
  };

  const sliderClass = 'w-full h-1.5 rounded-full accent-cyan-500 cursor-pointer';
  const [px, py] = toSVG(projX, projY);
  const [ax2, ay2] = toSVG(ax, ay);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Dot Product, Angle & Projection Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust <InlineMath math="\mathbf{a}" /> (blue) and <InlineMath math="\mathbf{b}" /> (green).
        The dashed red line shows the projection of <InlineMath math="\mathbf{a}" /> onto <InlineMath math="\mathbf{b}" />.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          {[
            { label: 'aₓ', val: ax, set: setAx, color: 'text-blue-600' },
            { label: 'aᵧ', val: ay, set: setAy, color: 'text-blue-600' },
            { label: 'bₓ', val: bx, set: setBx, color: 'text-green-600' },
            { label: 'bᵧ', val: by, set: setBy, color: 'text-green-600' },
          ].map(({ label, val, set, color }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span className={`font-mono font-semibold ${color}`}>{label}</span>
                <span>{val.toFixed(1)}</span>
              </div>
              <input type="range" min="-4" max="4" step="0.5" value={val}
                onChange={e => set(parseFloat(e.target.value))} className={sliderClass} />
            </div>
          ))}
          <div className="mt-3 space-y-1.5 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">a·b = </span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{dot.toFixed(2)}</span></p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">‖a‖ = </span>
              <span className="font-mono">{normA.toFixed(3)}</span></p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">‖b‖ = </span>
              <span className="font-mono">{normB.toFixed(3)}</span></p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">θ = </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{thetaDeg}°</span></p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">proj_b(a) = </span>
              <span className="font-mono text-red-600 dark:text-red-400">{projLen.toFixed(3)}</span></p>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <line x1={toSVG(i, -4)[0]} y1={toSVG(i, -4)[1]} x2={toSVG(i, 4)[0]} y2={toSVG(i, 4)[1]}
                stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-4, i)[0]} y1={toSVG(-4, i)[1]} x2={toSVG(4, i)[0]} y2={toSVG(4, i)[1]}
                stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          <line x1={toSVG(-4.5, 0)[0]} y1={OY} x2={toSVG(4.5, 0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0, -4.5)[1]} x2={OX} y2={toSVG(0, 4.5)[1]} stroke="#9ca3af" strokeWidth={1.5} />
          {/* Vectors */}
          {drawVec(0, 0, ax, ay, '#3b82f6')}
          {drawVec(0, 0, bx, by, '#22c55e')}
          {/* Projection onto b */}
          {drawVec(0, 0, projX, projY, '#ef4444', false, 2)}
          {/* Perpendicular drop */}
          <line x1={ax2} y1={ay2} x2={px} y2={py} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
          {/* Right angle marker */}
          {normB > 0.1 && (
            <rect
              x={px - 6} y={py - 6}
              width={12} height={12}
              fill="none" stroke="#f59e0b" strokeWidth={1}
              transform={`rotate(${Math.atan2(by, bx) * 180 / Math.PI}, ${px}, ${py})`}
            />
          )}
          {/* Labels */}
          <text x={toSVG(ax * 0.6, ay * 0.6)[0] + 6} y={toSVG(ax * 0.6, ay * 0.6)[1] - 8}
            fontSize={13} fill="#3b82f6" fontWeight="bold">a</text>
          <text x={toSVG(bx * 0.6, by * 0.6)[0] - 18} y={toSVG(bx * 0.6, by * 0.6)[1] - 8}
            fontSize={13} fill="#22c55e" fontWeight="bold">b</text>
          <text x={toSVG(projX * 0.5, projY * 0.5)[0] + 8} y={toSVG(projX * 0.5, projY * 0.5)[1] + 14}
            fontSize={11} fill="#ef4444">proj</text>
          <circle cx={OX} cy={OY} r={4} fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
}

export default function DotProductSection() {
  return (
    <div className="space-y-8">
      <DotProductViz />

      <DefinitionBlock
        label="Definition 3.1.1"
        title="Euclidean Inner Product (Dot Product)"
        definition={
          "For $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$, the dot product is " +
          "$\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\mathbf{u}^T \\mathbf{v}$. " +
          "It is symmetric ($\\mathbf{u}\\cdot\\mathbf{v} = \\mathbf{v}\\cdot\\mathbf{u}$), " +
          "bilinear, and positive definite ($\\mathbf{v}\\cdot\\mathbf{v} \\geq 0$ with equality iff $\\mathbf{v} = \\mathbf{0}$)."
        }
        notation={
          "Geometric formula: $\\mathbf{u}\\cdot\\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ " +
          "where $\\theta$ is the angle between the vectors. " +
          "Vectors are orthogonal if $\\mathbf{u}\\cdot\\mathbf{v} = 0$."
        }
      />

      <DefinitionBlock
        label="Definition 3.1.2"
        title="Vector Norms"
        definition={
          "The Euclidean ($L^2$) norm is $\\|\\mathbf{v}\\| = \\sqrt{\\mathbf{v}\\cdot\\mathbf{v}} = \\sqrt{\\sum_i v_i^2}$. " +
          "More generally, the $L^p$ norm is $\\|\\mathbf{v}\\|_p = (\\sum_i |v_i|^p)^{1/p}$. " +
          "Common cases: $L^1$ (Manhattan), $L^2$ (Euclidean), $L^\\infty = \\max_i |v_i|$. " +
          "A norm must satisfy: positivity, homogeneity ($\\|c\\mathbf{v}\\| = |c|\\|\\mathbf{v}\\|$), " +
          "and triangle inequality ($\\|\\mathbf{u}+\\mathbf{v}\\| \\leq \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$)."
        }
      />

      <TheoremBlock
        label="Theorem 3.1.1"
        title="Cauchy-Schwarz Inequality"
        statement={
          "For all $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$: " +
          "$|\\mathbf{u} \\cdot \\mathbf{v}| \\leq \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|$, " +
          "with equality if and only if $\\mathbf{u}$ and $\\mathbf{v}$ are parallel ($\\mathbf{u} = c\\mathbf{v}$ for some scalar $c$)."
        }
        proof={
          "If $\\mathbf{v} = \\mathbf{0}$, both sides are 0. Otherwise, consider " +
          "$f(t) = \\|\\mathbf{u} - t\\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 - 2t(\\mathbf{u}\\cdot\\mathbf{v}) + t^2\\|\\mathbf{v}\\|^2 \\geq 0$ for all $t \\in \\mathbb{R}$. " +
          "This quadratic in $t$ is non-negative, so its discriminant $\\leq 0$: " +
          "$(2(\\mathbf{u}\\cdot\\mathbf{v}))^2 - 4\\|\\mathbf{v}\\|^2\\|\\mathbf{u}\\|^2 \\leq 0$, " +
          "giving $(\\mathbf{u}\\cdot\\mathbf{v})^2 \\leq \\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$. Taking square roots gives the result."
        }
      />

      <ExampleBlock
        title="Dot Product, Angle, and Projection"
        difficulty="beginner"
        problem={
          "Let $\\mathbf{a} = (3,1)$ and $\\mathbf{b} = (1,3)$. " +
          "Compute the angle between them and the projection of $\\mathbf{a}$ onto $\\mathbf{b}$."
        }
        solution={[
          {
            step: 'Compute dot product and norms',
            formula: '\\mathbf{a}\\cdot\\mathbf{b} = 3\\cdot1 + 1\\cdot3 = 6,\\quad \\|\\mathbf{a}\\| = \\sqrt{10},\\quad \\|\\mathbf{b}\\| = \\sqrt{10}',
          },
          {
            step: 'Find angle θ',
            formula: '\\cos\\theta = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\|\\mathbf{a}\\|\\|\\mathbf{b}\\|} = \\frac{6}{10} = 0.6 \\implies \\theta = \\arccos(0.6) \\approx 53.1°',
          },
          {
            step: 'Projection of a onto b',
            formula: '\\operatorname{proj}_{\\mathbf{b}}\\mathbf{a} = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\|\\mathbf{b}\\|^2}\\mathbf{b} = \\frac{6}{10}(1,3) = (0.6, 1.8)',
          },
        ]}
      />

      <WarningBlock title="Dot Product vs. Matrix Multiply Notation">
        <p>
          In NumPy, <code>np.dot(a, b)</code> behaves differently for 1D arrays (dot product),
          2D arrays (matrix multiply), and mixed shapes. The <code>@</code> operator always does
          matrix multiplication. For 1D vectors, use <code>a @ b</code> or <code>np.dot(a, b)</code>.
          Do <strong>not</strong> use <code>a * b</code> (element-wise) when you want a dot product.
        </p>
      </WarningBlock>

      <PythonCode
        title="Dot Products and Norms"
        code={`import numpy as np

a = np.array([3.0, 1.0])
b = np.array([1.0, 3.0])

# Dot product
dot = np.dot(a, b)   # or a @ b
print(f"a · b = {dot}")

# Norms
norm_a = np.linalg.norm(a)
norm_b = np.linalg.norm(b)
print(f"||a|| = {norm_a:.4f}")
print(f"||b|| = {norm_b:.4f}")

# Angle
cos_theta = dot / (norm_a * norm_b)
theta_deg = np.degrees(np.arccos(np.clip(cos_theta, -1, 1)))
print(f"Angle = {theta_deg:.2f}°")

# Projection of a onto b
proj = (np.dot(a, b) / np.dot(b, b)) * b
print(f"proj_b(a) = {proj}")

# Cauchy-Schwarz verification
print(f"Cauchy-Schwarz: |a·b| = {abs(dot):.4f} <= ||a||·||b|| = {norm_a*norm_b:.4f}")

# L1, L2, Linf norms
v = np.array([3.0, -4.0, 1.0])
print(f"\\nL1 norm: {np.linalg.norm(v, 1):.4f}")
print(f"L2 norm: {np.linalg.norm(v, 2):.4f}")
print(f"Linf norm: {np.linalg.norm(v, np.inf):.4f}")`}
      />
    </div>
  );
}
