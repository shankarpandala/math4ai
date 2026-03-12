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
// Span / Linear Independence Checker
// ---------------------------------------------------------------------------
function SpanVisualizer() {
  const [v1x, setV1x] = useState(2);
  const [v1y, setV1y] = useState(1);
  const [v2x, setV2x] = useState(-1);
  const [v2y, setV2y] = useState(2);
  const [c1, setC1] = useState(1);
  const [c2, setC2] = useState(0.5);

  const combX = c1 * v1x + c2 * v2x;
  const combY = c1 * v1y + c2 * v2y;

  // Check linear independence: non-zero cross product
  const cross = v1x * v2y - v1y * v2x;
  const isIndependent = Math.abs(cross) > 0.01;

  const S = 28, OX = 200, OY = 200;
  const toSVG = (x, y) => [OX + x * S, OY - y * S];

  const arrowHead = (x1, y1, x2, y2, color) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 3) return null;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    return (
      <polygon
        points={`${x2},${y2} ${x2 - ux * 10 + px * 5},${y2 - uy * 10 + py * 5} ${x2 - ux * 10 - px * 5},${y2 - uy * 10 - py * 5}`}
        fill={color}
      />
    );
  };

  const drawVec = (x1, y1, x2, y2, color, dashed = false) => {
    const [sx1, sy1] = toSVG(x1, y1);
    const [sx2, sy2] = toSVG(x2, y2);
    return (
      <g>
        <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={2.5}
          strokeDasharray={dashed ? '6 4' : undefined} />
        {arrowHead(sx1, sy1, sx2, sy2, color)}
      </g>
    );
  };

  const sliderClass = 'w-full h-1.5 rounded-full accent-violet-500 cursor-pointer';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Span & Linear Independence Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust <InlineMath math="\mathbf{v}_1" /> (blue) and <InlineMath math="\mathbf{v}_2" /> (green),
        and the combination weights <InlineMath math="c_1, c_2" /> to see <InlineMath math="c_1\mathbf{v}_1 + c_2\mathbf{v}_2" /> (red).
      </p>

      <div className="mb-3 flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isIndependent
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {isIndependent ? 'Linearly Independent (span = R²)' : 'Linearly Dependent (span = line)'}
        </span>
        <span className="text-xs text-gray-400">cross = {cross.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          {[
            { label: 'v₁ₓ', val: v1x, set: setV1x, color: 'text-blue-600' },
            { label: 'v₁ᵧ', val: v1y, set: setV1y, color: 'text-blue-600' },
            { label: 'v₂ₓ', val: v2x, set: setV2x, color: 'text-green-600' },
            { label: 'v₂ᵧ', val: v2y, set: setV2y, color: 'text-green-600' },
            { label: 'c₁', val: c1, set: setC1, color: 'text-violet-600' },
            { label: 'c₂', val: c2, set: setC2, color: 'text-violet-600' },
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
          <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs font-mono dark:bg-gray-800">
            <p className="text-red-600 dark:text-red-400">
              {c1.toFixed(1)}·v₁ + {c2.toFixed(1)}·v₂ = ({combX.toFixed(2)}, {combY.toFixed(2)})
            </p>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {/* Grid */}
          {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(i => (
            <g key={i}>
              <line x1={toSVG(i, -6)[0]} y1={toSVG(i, -6)[1]} x2={toSVG(i, 6)[0]} y2={toSVG(i, 6)[1]}
                stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-6, i)[0]} y1={toSVG(-6, i)[1]} x2={toSVG(6, i)[0]} y2={toSVG(6, i)[1]}
                stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          <line x1={toSVG(-6.5, 0)[0]} y1={OY} x2={toSVG(6.5, 0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0, -6.5)[1]} x2={OX} y2={toSVG(0, 6.5)[1]} stroke="#9ca3af" strokeWidth={1.5} />
          {/* v1 and v2 */}
          {drawVec(0, 0, v1x, v1y, '#3b82f6')}
          {drawVec(0, 0, v2x, v2y, '#22c55e')}
          {/* combination: c1*v1 from origin, then c2*v2 from there */}
          {drawVec(0, 0, c1 * v1x, c1 * v1y, '#a78bfa', true)}
          {drawVec(c1 * v1x, c1 * v1y, combX, combY, '#a78bfa', true)}
          {drawVec(0, 0, combX, combY, '#ef4444')}
          {/* Labels */}
          <text x={toSVG(v1x / 2, v1y / 2)[0] + 5} y={toSVG(v1x / 2, v1y / 2)[1] - 8}
            fontSize={12} fill="#3b82f6" fontWeight="bold">v₁</text>
          <text x={toSVG(v2x / 2, v2y / 2)[0] - 20} y={toSVG(v2x / 2, v2y / 2)[1] - 8}
            fontSize={12} fill="#22c55e" fontWeight="bold">v₂</text>
          <text x={toSVG(combX / 2, combY / 2)[0] + 5} y={toSVG(combX / 2, combY / 2)[1] + 14}
            fontSize={11} fill="#ef4444" fontWeight="bold">c₁v₁+c₂v₂</text>
          <circle cx={OX} cy={OY} r={4} fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
}

export default function SubspacesSection() {
  return (
    <div className="space-y-8">
      <SpanVisualizer />

      <DefinitionBlock
        label="Definition 1.2.1"
        title="Subspace"
        definition={
          "A nonempty subset $W \\subseteq V$ of a vector space $V$ is a subspace if it is " +
          "closed under addition and scalar multiplication: " +
          "(1) $\\mathbf{u}, \\mathbf{v} \\in W \\Rightarrow \\mathbf{u} + \\mathbf{v} \\in W$, and " +
          "(2) $c \\in \\mathbb{R},\\, \\mathbf{v} \\in W \\Rightarrow c\\mathbf{v} \\in W$. " +
          "Equivalently, $W$ is a subspace iff it is nonempty and closed under arbitrary linear combinations."
        }
        notation={
          "The span of a set $S = \\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$ is the smallest subspace containing $S$: " +
          "$\\operatorname{span}(S) = \\{c_1\\mathbf{v}_1 + \\cdots + c_k\\mathbf{v}_k : c_i \\in \\mathbb{R}\\}$."
        }
      />

      <DefinitionBlock
        label="Definition 1.2.2"
        title="Linear Independence"
        definition={
          "Vectors $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_k\\}$ are linearly independent if the only " +
          "solution to $c_1\\mathbf{v}_1 + \\cdots + c_k\\mathbf{v}_k = \\mathbf{0}$ is $c_1 = \\cdots = c_k = 0$. " +
          "Otherwise, they are linearly dependent: at least one vector lies in the span of the others."
        }
        notation={
          "A set is dependent iff there exist scalars $c_i$, not all zero, with $\\sum c_i \\mathbf{v}_i = \\mathbf{0}$. " +
          "For two vectors in $\\mathbb{R}^2$: independent iff $v_{1x}v_{2y} - v_{1y}v_{2x} \\neq 0$ (nonzero cross product)."
        }
      />

      <TheoremBlock
        label="Theorem 1.2.1"
        title="Subspace Test"
        statement={
          "A nonempty subset $W \\subseteq \\mathbb{R}^n$ is a subspace if and only if: " +
          "(1) $\\mathbf{0} \\in W$; " +
          "(2) $\\mathbf{u} + \\mathbf{v} \\in W$ for all $\\mathbf{u}, \\mathbf{v} \\in W$; " +
          "(3) $c\\mathbf{v} \\in W$ for all $c \\in \\mathbb{R}$, $\\mathbf{v} \\in W$."
        }
        proof={
          "($\\Rightarrow$) Any subspace satisfies these by definition. " +
          "($\\Leftarrow$) Suppose (1)-(3) hold. $W$ is nonempty by (1). " +
          "Conditions (2) and (3) give closure. The zero vector (1) ensures additive identity. " +
          "Taking $c = -1$ in (3) gives additive inverses. All vector space axioms inherited from $\\mathbb{R}^n$."
        }
      />

      <ExampleBlock
        title="Column Space as a Subspace"
        difficulty="beginner"
        problem={
          "Show that the column space of $A = \\begin{bmatrix}1 & 2\\\\2 & 4\\end{bmatrix}$ is a subspace of $\\mathbb{R}^2$, " +
          "and find its dimension and a spanning set."
        }
        solution={[
          {
            step: 'Identify the columns',
            formula: '\\mathbf{c}_1 = \\begin{bmatrix}1\\\\2\\end{bmatrix}, \\quad \\mathbf{c}_2 = \\begin{bmatrix}2\\\\4\\end{bmatrix} = 2\\mathbf{c}_1',
          },
          {
            step: 'Check dependence: c₂ = 2c₁, so span{c₁, c₂} = span{c₁}',
            formula: '\\operatorname{col}(A) = \\operatorname{span}\\left\\{\\begin{bmatrix}1\\\\2\\end{bmatrix}\\right\\} = \\left\\{t\\begin{bmatrix}1\\\\2\\end{bmatrix} : t \\in \\mathbb{R}\\right\\}',
          },
          {
            step: 'This is a line through the origin — a 1-dimensional subspace of R²',
            explanation: 'The column space (rank) has dimension 1. The matrix is rank-deficient.',
          },
        ]}
      />

      <WarningBlock title="Not Every Subset is a Subspace">
        <p>
          A line that does <em>not</em> pass through the origin is <strong>not</strong> a subspace:
          it fails the zero vector condition. For example, <InlineMath math="\{(x,y) : x + y = 1\}" />
          does not contain <InlineMath math="\mathbf{0}" />, so it is an affine subspace, not a subspace.
          Always verify the zero vector condition first when checking subspaces.
        </p>
      </WarningBlock>

      <PythonCode
        title="Checking Linear Independence"
        code={`import numpy as np

# Two vectors in R^3
v1 = np.array([1.0, 0.0, 2.0])
v2 = np.array([3.0, 1.0, 1.0])
v3 = np.array([5.0, 1.0, 5.0])  # v3 = v1 + v2?

# Stack as matrix columns and check rank
A = np.column_stack([v1, v2, v3])
rank = np.linalg.matrix_rank(A)
print(f"Rank = {rank} out of {A.shape[1]} vectors")
print(f"Linearly independent: {rank == A.shape[1]}")

# Verify: v3 = v1 + v2 => linearly dependent
print(f"v1 + v2 = {v1 + v2}  vs  v3 = {v3}")

# Span: find a basis for col(A)
# Use SVD to find independent columns
_, s, _ = np.linalg.svd(A)
print(f"Singular values: {s.round(4)}")
print(f"Dimension of span: {np.sum(s > 1e-10)}")

# 2D example: check if two vectors span R^2
u = np.array([2.0, 1.0])
v = np.array([-1.0, 2.0])
cross = u[0]*v[1] - u[1]*v[0]
print(f"\\n2D cross product (det): {cross:.4f}")
print(f"Span R^2: {abs(cross) > 1e-10}")`}
      />
    </div>
  );
}
