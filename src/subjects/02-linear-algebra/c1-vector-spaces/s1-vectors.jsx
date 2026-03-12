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
// Interactive 2D vector addition visualizer
// ---------------------------------------------------------------------------
function VectorAdditionViz() {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(2);

  const cx = ax + bx;
  const cy = ay + by;

  // Map math coords to SVG coords (center at 200,200, scale 30px per unit)
  const S = 30;
  const OX = 200, OY = 200;
  const toSVG = (x, y) => [OX + x * S, OY - y * S];

  const arrowHead = (x1, y1, x2, y2, color) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return null;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    const tip = [x2, y2];
    const base1 = [x2 - ux * 10 + px * 5, y2 - uy * 10 + py * 5];
    const base2 = [x2 - ux * 10 - px * 5, y2 - uy * 10 - py * 5];
    return (
      <polygon
        points={`${tip[0]},${tip[1]} ${base1[0]},${base1[1]} ${base2[0]},${base2[1]}`}
        fill={color}
      />
    );
  };

  const drawVector = (fromX, fromY, toX, toY, color, dashed = false) => {
    const [x1, y1] = toSVG(fromX, fromY);
    const [x2, y2] = toSVG(toX, toY);
    return (
      <g>
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={2.5}
          strokeDasharray={dashed ? '6 4' : undefined}
        />
        {arrowHead(x1, y1, x2, y2, color)}
      </g>
    );
  };

  const sliderClass = 'w-full h-1.5 rounded-full accent-blue-500 cursor-pointer';
  const [oax, oay] = toSVG(0, 0);
  const [tax, tay] = toSVG(ax, ay);
  const [tbx, tby] = toSVG(ax + bx, ay + by);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Vector Addition Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust vectors <InlineMath math="\mathbf{a}" /> (blue) and <InlineMath math="\mathbf{b}" /> (green).
        Their sum <InlineMath math="\mathbf{a}+\mathbf{b}" /> is shown in red (tip-to-tail method).
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Sliders */}
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
              <input
                type="range" min="-5" max="5" step="0.5"
                value={val} onChange={e => set(parseFloat(e.target.value))}
                className={sliderClass}
              />
            </div>
          ))}
          <div className="mt-4 space-y-1 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
            <p className="font-mono text-blue-600 dark:text-blue-400">
              a = ({ax.toFixed(1)}, {ay.toFixed(1)})
            </p>
            <p className="font-mono text-green-600 dark:text-green-400">
              b = ({bx.toFixed(1)}, {by.toFixed(1)})
            </p>
            <p className="font-mono text-red-600 dark:text-red-400">
              a+b = ({cx.toFixed(1)}, {cy.toFixed(1)})
            </p>
          </div>
        </div>

        {/* SVG canvas */}
        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {/* Grid */}
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(i => (
            <g key={i}>
              <line x1={toSVG(i, -5)[0]} y1={toSVG(i, -5)[1]}
                    x2={toSVG(i, 5)[0]} y2={toSVG(i, 5)[1]}
                    stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-5, i)[0]} y1={toSVG(-5, i)[1]}
                    x2={toSVG(5, i)[0]} y2={toSVG(5, i)[1]}
                    stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          {/* Axes */}
          <line x1={toSVG(-5.5, 0)[0]} y1={OY} x2={toSVG(5.5, 0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0, -5.5)[1]} x2={OX} y2={toSVG(0, 5.5)[1]} stroke="#9ca3af" strokeWidth={1.5} />
          {/* Vectors: a from origin, b from tip of a (tip-to-tail), sum from origin */}
          {drawVector(0, 0, ax, ay, '#3b82f6')}
          {drawVector(ax, ay, ax + bx, ay + by, '#22c55e')}
          {drawVector(0, 0, cx, cy, '#ef4444')}
          {/* Labels */}
          <text x={toSVG(ax / 2, ay / 2)[0] - 15} y={toSVG(ax / 2, ay / 2)[1] - 8}
            fontSize={12} fill="#3b82f6" fontWeight="bold">a</text>
          <text x={toSVG(ax + bx / 2, ay + by / 2)[0] + 5} y={toSVG(ax + bx / 2, ay + by / 2)[1] - 8}
            fontSize={12} fill="#22c55e" fontWeight="bold">b</text>
          <text x={toSVG(cx / 2, cy / 2)[0] + 5} y={toSVG(cx / 2, cy / 2)[1] + 15}
            fontSize={12} fill="#ef4444" fontWeight="bold">a+b</text>
          {/* Origin dot */}
          <circle cx={OX} cy={OY} r={4} fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------
export default function VectorsSection() {
  return (
    <div className="space-y-8">
      <VectorAdditionViz />

      <DefinitionBlock
        label="Definition 1.1.1"
        title="Vector in Rⁿ"
        definition={
          "A vector $\\mathbf{v} \\in \\mathbb{R}^n$ is an ordered $n$-tuple of real numbers: " +
          "$\\mathbf{v} = (v_1, v_2, \\ldots, v_n)$. The set $\\mathbb{R}^n$ with component-wise " +
          "addition and scalar multiplication forms a vector space over $\\mathbb{R}$."
        }
        notation={
          "We write column vectors as $\\mathbf{v} = \\begin{bmatrix} v_1 \\\\ \\vdots \\\\ v_n \\end{bmatrix}$ " +
          "or row vectors as $\\mathbf{v}^T = [v_1, \\ldots, v_n]$. The zero vector is $\\mathbf{0} \\in \\mathbb{R}^n$."
        }
      />

      <DefinitionBlock
        label="Definition 1.1.2"
        title="Vector Addition and Scalar Multiplication"
        definition={
          "For $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$ and $c \\in \\mathbb{R}$, " +
          "addition is defined component-wise: $(\\mathbf{u} + \\mathbf{v})_i = u_i + v_i$, " +
          "and scalar multiplication by $(c\\mathbf{v})_i = c v_i$. " +
          "These operations satisfy eight axioms making $\\mathbb{R}^n$ a real vector space: " +
          "commutativity, associativity, identity, inverses, distributivity over scalars and vectors."
        }
      />

      <TheoremBlock
        label="Theorem 1.1.1"
        title="Properties of Vector Operations"
        statement={
          "For all $\\mathbf{u}, \\mathbf{v}, \\mathbf{w} \\in \\mathbb{R}^n$ and $c, d \\in \\mathbb{R}$: " +
          "(1) $\\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u}$; " +
          "(2) $(\\mathbf{u} + \\mathbf{v}) + \\mathbf{w} = \\mathbf{u} + (\\mathbf{v} + \\mathbf{w})$; " +
          "(3) $c(\\mathbf{u} + \\mathbf{v}) = c\\mathbf{u} + c\\mathbf{v}$; " +
          "(4) $(c+d)\\mathbf{v} = c\\mathbf{v} + d\\mathbf{v}$."
        }
        proof={
          "All properties follow directly from the definitions. For (1): $(\\mathbf{u} + \\mathbf{v})_i = u_i + v_i = v_i + u_i = (\\mathbf{v} + \\mathbf{u})_i$ " +
          "by commutativity of real number addition. Properties (2)-(4) follow similarly component-wise."
        }
      />

      <ExampleBlock
        title="Vector Arithmetic in R³"
        difficulty="beginner"
        problem={
          "Let $\\mathbf{u} = (1, -2, 3)$ and $\\mathbf{v} = (4, 0, -1)$. " +
          "Compute $2\\mathbf{u} - 3\\mathbf{v}$ and the magnitude $\\|\\mathbf{u}\\|$."
        }
        solution={[
          {
            step: 'Scale each vector',
            formula: '2\\mathbf{u} = (2, -4, 6), \\quad 3\\mathbf{v} = (12, 0, -3)',
          },
          {
            step: 'Subtract component-wise',
            formula: '2\\mathbf{u} - 3\\mathbf{v} = (2-12,\\; -4-0,\\; 6-(-3)) = (-10, -4, 9)',
          },
          {
            step: 'Compute magnitude of u',
            formula: '\\|\\mathbf{u}\\| = \\sqrt{1^2 + (-2)^2 + 3^2} = \\sqrt{1 + 4 + 9} = \\sqrt{14} \\approx 3.742',
          },
        ]}
      />

      <NoteBlock type="intuition" title="Geometric Interpretation">
        <p>
          In <InlineMath math="\mathbb{R}^2" /> and <InlineMath math="\mathbb{R}^3" />, vectors
          represent directed line segments (arrows). Addition follows the parallelogram law:
          place the tail of <InlineMath math="\mathbf{b}" /> at the tip of <InlineMath math="\mathbf{a}" />;
          the sum points from origin to the new tip. Scalar multiplication stretches (|c|&gt;1),
          shrinks (|c|&lt;1), or reverses (c&lt;0) the direction.
        </p>
      </NoteBlock>

      <WarningBlock title="Vectors vs. Points">
        <p>
          A vector <InlineMath math="\mathbf{v} \in \mathbb{R}^n" /> represents a <em>direction and magnitude</em>,
          not a fixed location. The same vector <InlineMath math="(1, 2)" /> can be drawn starting from
          any point in the plane — it always has the same direction and length. Points are locations;
          vectors are displacements. Confusing the two leads to errors in coordinate transformations
          and affine vs. linear maps.
        </p>
      </WarningBlock>

      <PythonCode
        title="Vector Operations with NumPy"
        code={`import numpy as np

# Define vectors
u = np.array([1, -2, 3], dtype=float)
v = np.array([4,  0, -1], dtype=float)

# Basic operations
print("u + v =", u + v)
print("2u - 3v =", 2*u - 3*v)
print("|u| =", np.linalg.norm(u))

# Unit vector (normalize)
u_hat = u / np.linalg.norm(u)
print("û =", u_hat, "  |û| =", np.linalg.norm(u_hat).round(10))

# Linear combination: 0.5*u + 0.3*v
lc = 0.5 * u + 0.3 * v
print("0.5u + 0.3v =", lc)

# Verify triangle inequality: ||u + v|| <= ||u|| + ||v||
lhs = np.linalg.norm(u + v)
rhs = np.linalg.norm(u) + np.linalg.norm(v)
print(f"||u+v|| = {lhs:.4f} <= ||u|| + ||v|| = {rhs:.4f}: {lhs <= rhs}")`}
      />
    </div>
  );
}
