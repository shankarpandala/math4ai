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
// Coordinate change visualizer (2D basis change)
// ---------------------------------------------------------------------------
function BasisChangeViz() {
  // Custom basis vectors e1', e2'
  const [b1x, setB1x] = useState(1);
  const [b1y, setB1y] = useState(0.5);
  const [b2x, setB2x] = useState(-0.5);
  const [b2y, setB2y] = useState(1);
  // Coordinates in new basis
  const [cx, setCx] = useState(2);
  const [cy, setCy] = useState(1);

  // Vector in standard coords
  const vx = cx * b1x + cy * b2x;
  const vy = cx * b1y + cy * b2y;

  // Check if basis is valid (det != 0)
  const det = b1x * b2y - b1y * b2x;
  const isValid = Math.abs(det) > 0.05;

  const S = 50, OX = 200, OY = 220;
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

  const sliderClass = 'w-full h-1.5 rounded-full accent-teal-500 cursor-pointer';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Coordinate System Change Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Set a custom basis <InlineMath math="\{\mathbf{b}_1, \mathbf{b}_2\}" /> and coordinates
        <InlineMath math="(c_1, c_2)" /> in that basis. The red vector shows the same point in
        standard <InlineMath math="(x,y)" /> coordinates.
      </p>

      {!isValid && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Basis vectors are (nearly) linearly dependent — not a valid basis!
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          {[
            { label: 'b₁ₓ', val: b1x, set: setB1x, color: 'text-blue-600' },
            { label: 'b₁ᵧ', val: b1y, set: setB1y, color: 'text-blue-600' },
            { label: 'b₂ₓ', val: b2x, set: setB2x, color: 'text-green-600' },
            { label: 'b₂ᵧ', val: b2y, set: setB2y, color: 'text-green-600' },
            { label: 'c₁', val: cx, set: setCx, color: 'text-violet-600' },
            { label: 'c₂', val: cy, set: setCy, color: 'text-violet-600' },
          ].map(({ label, val, set, color }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span className={`font-mono font-semibold ${color}`}>{label}</span>
                <span>{val.toFixed(1)}</span>
              </div>
              <input type="range" min="-3" max="3" step="0.5" value={val}
                onChange={e => set(parseFloat(e.target.value))} className={sliderClass} />
            </div>
          ))}
          <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800 space-y-1">
            <p className="font-mono text-blue-600 dark:text-blue-400">b₁ = ({b1x.toFixed(1)}, {b1y.toFixed(1)})</p>
            <p className="font-mono text-green-600 dark:text-green-400">b₂ = ({b2x.toFixed(1)}, {b2y.toFixed(1)})</p>
            <p className="font-mono text-violet-600 dark:text-violet-400">
              [{cx.toFixed(1)}, {cy.toFixed(1)}]_B = ({vx.toFixed(2)}, {vy.toFixed(2)})_std
            </p>
            <p className="text-gray-500">det(B) = {det.toFixed(2)}</p>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {/* Grid lines */}
          {[-3, -2, -1, 0, 1, 2, 3].map(i => (
            <g key={i}>
              <line x1={toSVG(i, -4)[0]} y1={toSVG(i, -4)[1]} x2={toSVG(i, 4)[0]} y2={toSVG(i, 4)[1]}
                stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-4, i)[0]} y1={toSVG(-4, i)[1]} x2={toSVG(4, i)[0]} y2={toSVG(4, i)[1]}
                stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          {/* Standard axes */}
          <line x1={toSVG(-4, 0)[0]} y1={OY} x2={toSVG(4, 0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0, -4)[1]} x2={OX} y2={toSVG(0, 4)[1]} stroke="#9ca3af" strokeWidth={1.5} />
          {/* Custom basis vectors */}
          {drawVec(0, 0, b1x, b1y, '#3b82f6')}
          {drawVec(0, 0, b2x, b2y, '#22c55e')}
          {/* Construction lines (dashed) */}
          {isValid && drawVec(0, 0, cx * b1x, cx * b1y, '#a78bfa', true)}
          {isValid && drawVec(cx * b1x, cx * b1y, vx, vy, '#a78bfa', true)}
          {/* Result vector */}
          {isValid && drawVec(0, 0, vx, vy, '#ef4444')}
          {/* Labels */}
          <text x={toSVG(b1x * 0.6, b1y * 0.6)[0] + 6} y={toSVG(b1x * 0.6, b1y * 0.6)[1] - 8}
            fontSize={12} fill="#3b82f6" fontWeight="bold">b₁</text>
          <text x={toSVG(b2x * 0.6, b2y * 0.6)[0] - 20} y={toSVG(b2x * 0.6, b2y * 0.6)[1] - 8}
            fontSize={12} fill="#22c55e" fontWeight="bold">b₂</text>
          {isValid && (
            <text x={toSVG(vx * 0.5, vy * 0.5)[0] + 8} y={toSVG(vx * 0.5, vy * 0.5)[1] + 14}
              fontSize={11} fill="#ef4444" fontWeight="bold">v</text>
          )}
          <circle cx={OX} cy={OY} r={4} fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
}

export default function BasisSection() {
  return (
    <div className="space-y-8">
      <BasisChangeViz />

      <DefinitionBlock
        label="Definition 1.3.1"
        title="Basis"
        definition={
          "A basis for a vector space $V$ is a set $\\mathcal{B} = \\{\\mathbf{b}_1, \\ldots, \\mathbf{b}_n\\}$ " +
          "that is (1) linearly independent and (2) spans $V$. " +
          "Equivalently, every $\\mathbf{v} \\in V$ can be written uniquely as " +
          "$\\mathbf{v} = c_1\\mathbf{b}_1 + \\cdots + c_n\\mathbf{b}_n$. " +
          "The scalars $(c_1, \\ldots, c_n)$ are the coordinates of $\\mathbf{v}$ relative to $\\mathcal{B}$."
        }
        notation={
          "The coordinate vector is $[\\mathbf{v}]_{\\mathcal{B}} = (c_1, \\ldots, c_n)$. " +
          "The standard basis for $\\mathbb{R}^n$ is $\\mathbf{e}_1, \\ldots, \\mathbf{e}_n$ where $\\mathbf{e}_i$ has 1 in position $i$ and 0 elsewhere."
        }
      />

      <DefinitionBlock
        label="Definition 1.3.2"
        title="Dimension"
        definition={
          "The dimension of a vector space $V$, written $\\dim(V)$, is the number of vectors in any basis for $V$. " +
          "By the basis theorem, all bases of $V$ have the same number of elements. " +
          "If $V$ has no finite basis, $V$ is infinite-dimensional. The trivial space $\\{\\mathbf{0}\\}$ has dimension 0."
        }
      />

      <TheoremBlock
        label="Theorem 1.3.1"
        title="Basis Theorem"
        statement={
          "If $V$ is a vector space with $\\dim(V) = n$, then: " +
          "(1) any set of $n$ linearly independent vectors is a basis; " +
          "(2) any set of $n$ vectors that spans $V$ is a basis; " +
          "(3) any linearly independent set can be extended to a basis; " +
          "(4) any spanning set can be reduced to a basis."
        }
        proof={
          "We prove (1). Let $S = \\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}$ be linearly independent with $|S| = n = \\dim(V)$. " +
          "It suffices to show $S$ spans $V$. If $\\mathbf{w} \\notin \\operatorname{span}(S)$, then " +
          "$\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n, \\mathbf{w}\\}$ is linearly independent (set of $n+1$ independent vectors). " +
          "But no independent set in $V$ can exceed $n$ vectors (exchange argument), a contradiction. Hence $S$ spans $V$."
        }
      />

      <ExampleBlock
        title="Finding Coordinates in a New Basis"
        difficulty="beginner"
        problem={
          "Let $\\mathcal{B} = \\{\\mathbf{b}_1, \\mathbf{b}_2\\} = \\{(1,1), (1,-1)\\}$ be a basis for $\\mathbb{R}^2$. " +
          "Find the $\\mathcal{B}$-coordinates of $\\mathbf{v} = (3, 1)$."
        }
        solution={[
          {
            step: 'Set up the coordinate equation',
            formula: 'c_1\\begin{bmatrix}1\\\\1\\end{bmatrix} + c_2\\begin{bmatrix}1\\\\-1\\end{bmatrix} = \\begin{bmatrix}3\\\\1\\end{bmatrix}',
          },
          {
            step: 'Solve the 2x2 system: c₁+c₂=3 and c₁-c₂=1',
            formula: 'c_1 = 2,\\quad c_2 = 1',
          },
          {
            step: 'State the result',
            formula: '[\\mathbf{v}]_{\\mathcal{B}} = \\begin{bmatrix}2\\\\1\\end{bmatrix}, \\text{ verify: } 2(1,1)+1(1,-1)=(3,1) \\checkmark',
          },
        ]}
      />

      <NoteBlock type="intuition" title="Why Bases Matter for AI">
        <p>
          In machine learning, choosing a good basis (feature representation) is everything.
          PCA finds the basis aligned with the directions of maximum variance.
          Attention mechanisms in transformers learn task-relevant basis vectors for token representations.
          The "embedding space" of word2vec or BERT is literally a choice of basis for semantic meaning.
        </p>
      </NoteBlock>

      <WarningBlock title="Basis is Not Unique">
        <p>
          A vector space has infinitely many bases. The dimension is unique — all bases have the same
          cardinality — but the actual basis vectors can be chosen freely (subject to independence and span).
          Do not confuse "dimension" with "the number of coordinates we happen to use" — always verify
          your proposed basis vectors are independent.
        </p>
      </WarningBlock>

      <PythonCode
        title="Basis, Dimension, and Coordinate Change"
        code={`import numpy as np

# Basis vectors for R^2
B = np.array([[1, 1],
              [1, -1]], dtype=float).T  # columns are basis vectors

# Find coordinates of v in basis B
v = np.array([3.0, 1.0])
coords = np.linalg.solve(B, v)
print(f"Coordinates in B: {coords}")  # [2, 1]
print(f"Verification: {B @ coords}")   # should be [3, 1]

# Change of basis matrix: from B-coords to standard coords
print(f"Change-of-basis matrix B:\\n{B}")
print(f"Determinant (non-zero = valid basis): {np.linalg.det(B):.4f}")

# Find dimension via rank
A = np.array([[1, 2, 3],
              [2, 4, 6],
              [0, 1, 1]], dtype=float)
rank = np.linalg.matrix_rank(A)
print(f"\\nRank of A (dim of column space): {rank}")

# Find a basis for column space via QR
Q, R = np.linalg.qr(A)
print(f"Basis for col(A):\\n{Q[:, :rank].round(4)}")`}
      />
    </div>
  );
}
