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
// Gram-Schmidt Step Visualizer (2D)
// ---------------------------------------------------------------------------
function GramSchmidtViz() {
  const [v1x, setV1x] = useState(3);
  const [v1y, setV1y] = useState(1);
  const [v2x, setV2x] = useState(1);
  const [v2y, setV2y] = useState(3);
  const [step, setStep] = useState(0);

  // Gram-Schmidt
  const norm1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const e1x = norm1 > 0 ? v1x / norm1 : 0;
  const e1y = norm1 > 0 ? v1y / norm1 : 0;

  // Project v2 onto e1
  const proj = v2x * e1x + v2y * e1y;
  const projX = proj * e1x;
  const projY = proj * e1y;

  // Orthogonal complement
  const u2x = v2x - projX;
  const u2y = v2y - projY;
  const norm2 = Math.sqrt(u2x * u2x + u2y * u2y);
  const e2x = norm2 > 0 ? u2x / norm2 : 0;
  const e2y = norm2 > 0 ? u2y / norm2 : 0;

  const isDependent = norm2 < 0.05;

  const S = 50, OX = 200, OY = 220;
  const toSVG = (x, y) => [OX + x * S, OY - y * S];

  const arrowHead = (x1, y1, x2, y2, color) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 3) return null;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    return <polygon points={`${x2},${y2} ${x2-ux*10+px*5},${y2-uy*10+py*5} ${x2-ux*10-px*5},${y2-uy*10-py*5}`} fill={color} />;
  };

  const drawVec = (x1, y1, x2, y2, color, dashed = false, w = 2.5) => {
    const [sx1, sy1] = toSVG(x1, y1);
    const [sx2, sy2] = toSVG(x2, y2);
    return (
      <g>
        <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={w}
          strokeDasharray={dashed ? '5 4' : undefined} />
        {arrowHead(sx1, sy1, sx2, sy2, color)}
      </g>
    );
  };

  const steps = [
    { label: 'Input vectors v₁, v₂', show: { v1: true, v2: true } },
    { label: 'Normalize v₁ → e₁ = v₁/‖v₁‖', show: { v1: true, e1: true } },
    { label: 'Project v₂ onto e₁ (dashed)', show: { e1: true, v2: true, proj: true } },
    { label: 'Subtract: u₂ = v₂ - proj, normalize → e₂', show: { e1: true, u2: true, e2: true } },
    { label: 'Orthonormal basis {e₁, e₂} — perpendicular unit vectors', show: { e1: true, e2: true } },
  ];

  const s = steps[step];

  const sliderClass = 'w-full h-1.5 rounded-full accent-teal-500 cursor-pointer';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Gram-Schmidt Orthogonalization Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Set two input vectors and step through the Gram-Schmidt process to build an orthonormal basis.
      </p>

      {isDependent && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20">
          Vectors are nearly linearly dependent — Gram-Schmidt produces a near-zero vector.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          {[
            { label: 'v₁ₓ', val: v1x, set: setV1x },
            { label: 'v₁ᵧ', val: v1y, set: setV1y },
            { label: 'v₂ₓ', val: v2x, set: setV2x },
            { label: 'v₂ᵧ', val: v2y, set: setV2y },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span className="font-mono font-semibold">{label}</span>
                <span>{val.toFixed(1)}</span>
              </div>
              <input type="range" min="-4" max="4" step="0.5" value={val}
                onChange={e => set(parseFloat(e.target.value))} className={sliderClass} />
            </div>
          ))}
          <div className="mt-3 rounded-lg bg-teal-50 p-3 text-xs dark:bg-teal-900/20 space-y-1">
            <p className="font-mono text-blue-600 dark:text-blue-400">
              e₁ = ({e1x.toFixed(3)}, {e1y.toFixed(3)})
            </p>
            {!isDependent && (
              <p className="font-mono text-teal-600 dark:text-teal-400">
                e₂ = ({e2x.toFixed(3)}, {e2y.toFixed(3)})
              </p>
            )}
            <p className="text-gray-500">e₁·e₂ = {(e1x*e2x + e1y*e2y).toFixed(4)} ≈ 0 ✓</p>
          </div>

          {/* Step controls */}
          <div className="mt-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs dark:bg-indigo-900/20">
            <p className="font-medium text-indigo-700 dark:text-indigo-300">Step {step + 1}/5: {s.label}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
              ← Prev
            </button>
            <button onClick={() => setStep(s => Math.min(4, s + 1))}
              className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-600">
              Next →
            </button>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {[-4,-3,-2,-1,0,1,2,3,4].map(i => (
            <g key={i}>
              <line x1={toSVG(i,-4)[0]} y1={toSVG(i,-4)[1]} x2={toSVG(i,4)[0]} y2={toSVG(i,4)[1]} stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-4,i)[0]} y1={toSVG(-4,i)[1]} x2={toSVG(4,i)[0]} y2={toSVG(4,i)[1]} stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          <line x1={toSVG(-4.5,0)[0]} y1={OY} x2={toSVG(4.5,0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0,-4.5)[1]} x2={OX} y2={toSVG(0,4.5)[1]} stroke="#9ca3af" strokeWidth={1.5} />

          {s.show.v1 && drawVec(0,0,v1x,v1y,'#93c5fd')}
          {s.show.v2 && drawVec(0,0,v2x,v2y,'#86efac')}
          {s.show.proj && drawVec(0,0,projX,projY,'#f87171',true)}
          {s.show.proj && <line x1={toSVG(v2x,v2y)[0]} y1={toSVG(v2x,v2y)[1]} x2={toSVG(projX,projY)[0]} y2={toSVG(projX,projY)[1]} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3 3" />}
          {s.show.u2 && drawVec(0,0,u2x,u2y,'#fb923c',true)}
          {s.show.e1 && drawVec(0,0,e1x,e1y,'#3b82f6',false,3)}
          {s.show.e2 && !isDependent && drawVec(0,0,e2x,e2y,'#14b8a6',false,3)}

          {s.show.v1 && <text x={toSVG(v1x*0.6,v1y*0.6)[0]+6} y={toSVG(v1x*0.6,v1y*0.6)[1]-8} fontSize={12} fill="#93c5fd" fontWeight="bold">v₁</text>}
          {s.show.v2 && <text x={toSVG(v2x*0.6,v2y*0.6)[0]-18} y={toSVG(v2x*0.6,v2y*0.6)[1]-8} fontSize={12} fill="#86efac" fontWeight="bold">v₂</text>}
          {s.show.e1 && <text x={toSVG(e1x*1.3,e1y*1.3)[0]+6} y={toSVG(e1x*1.3,e1y*1.3)[1]-6} fontSize={12} fill="#3b82f6" fontWeight="bold">e₁</text>}
          {s.show.e2 && !isDependent && <text x={toSVG(e2x*1.3,e2y*1.3)[0]-18} y={toSVG(e2x*1.3,e2y*1.3)[1]-6} fontSize={12} fill="#14b8a6" fontWeight="bold">e₂</text>}
          <circle cx={OX} cy={OY} r={4} fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
}

export default function OrthogonalitySection() {
  return (
    <div className="space-y-8">
      <GramSchmidtViz />

      <DefinitionBlock
        label="Definition 3.2.1"
        title="Orthogonality and Orthonormal Bases"
        definition={
          "Vectors $\\mathbf{u}$ and $\\mathbf{v}$ are orthogonal if $\\mathbf{u}\\cdot\\mathbf{v} = 0$. " +
          "A set $\\{\\mathbf{q}_1, \\ldots, \\mathbf{q}_k\\}$ is orthonormal if $\\mathbf{q}_i \\cdot \\mathbf{q}_j = \\delta_{ij}$ " +
          "(orthogonal unit vectors). An orthonormal basis $Q = [\\mathbf{q}_1 | \\cdots | \\mathbf{q}_n]$ satisfies $Q^T Q = I$."
        }
        notation={
          "An $m \\times n$ matrix $Q$ with orthonormal columns ($Q^TQ = I$) is called a semi-orthogonal matrix. " +
          "If also $m = n$ (square), it is an orthogonal matrix satisfying $Q^{-1} = Q^T$."
        }
      />

      <DefinitionBlock
        label="Definition 3.2.2"
        title="Orthogonal Projection"
        definition={
          "The orthogonal projection of $\\mathbf{v}$ onto a subspace $W$ is the unique vector " +
          "$\\operatorname{proj}_W \\mathbf{v} \\in W$ such that $\\mathbf{v} - \\operatorname{proj}_W \\mathbf{v} \\perp W$. " +
          "If $W = \\operatorname{span}\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_k\\}$ with orthonormal $\\mathbf{q}_i$, then " +
          "$\\operatorname{proj}_W \\mathbf{v} = \\sum_{i=1}^k (\\mathbf{v}\\cdot\\mathbf{q}_i)\\mathbf{q}_i = QQ^T\\mathbf{v}$."
        }
      />

      <TheoremBlock
        label="Theorem 3.2.1"
        title="Gram-Schmidt Orthogonalization"
        statement={
          "Every finite-dimensional inner product space has an orthonormal basis. " +
          "Given linearly independent $\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$, " +
          "the Gram-Schmidt process produces an orthonormal set $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_k\\}$ " +
          "with the same span. The algorithm: $\\mathbf{u}_j = \\mathbf{v}_j - \\sum_{i<j}(\\mathbf{v}_j\\cdot\\mathbf{q}_i)\\mathbf{q}_i$, " +
          "then $\\mathbf{q}_j = \\mathbf{u}_j / \\|\\mathbf{u}_j\\|$."
        }
        proof={
          "By induction. $\\mathbf{q}_1 = \\mathbf{v}_1/\\|\\mathbf{v}_1\\|$ is a unit vector spanning $\\operatorname{span}\\{\\mathbf{v}_1\\}$. " +
          "Given orthonormal $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_{j-1}\\}$ spanning $V_{j-1} = \\operatorname{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_{j-1}\\}$, " +
          "define $\\mathbf{u}_j = \\mathbf{v}_j - \\operatorname{proj}_{V_{j-1}}\\mathbf{v}_j$. " +
          "Then $\\mathbf{u}_j \\perp V_{j-1}$ by construction (we subtracted the full projection). " +
          "$\\mathbf{u}_j \\neq \\mathbf{0}$ because $\\mathbf{v}_j \\notin V_{j-1}$ (linear independence). " +
          "Set $\\mathbf{q}_j = \\mathbf{u}_j/\\|\\mathbf{u}_j\\|$. Then $\\{\\mathbf{q}_1,\\ldots,\\mathbf{q}_j\\}$ spans $V_j$."
        }
      />

      <ExampleBlock
        title="Gram-Schmidt in R³"
        difficulty="intermediate"
        problem={
          "Apply Gram-Schmidt to $\\mathbf{v}_1 = (1,1,0)$, $\\mathbf{v}_2 = (1,0,1)$, $\\mathbf{v}_3 = (0,1,1)$."
        }
        solution={[
          {
            step: 'Normalize v₁',
            formula: '\\mathbf{q}_1 = \\frac{(1,1,0)}{\\sqrt{2}} = \\left(\\tfrac{1}{\\sqrt{2}}, \\tfrac{1}{\\sqrt{2}}, 0\\right)',
          },
          {
            step: 'Remove q₁ component from v₂',
            formula: '\\mathbf{v}_2 \\cdot \\mathbf{q}_1 = \\tfrac{1}{\\sqrt{2}}, \\quad \\mathbf{u}_2 = (1,0,1) - \\tfrac{1}{\\sqrt{2}}\\mathbf{q}_1 = \\left(\\tfrac{1}{2}, -\\tfrac{1}{2}, 1\\right)',
          },
          {
            step: 'Normalize: ‖u₂‖ = √(3/2), so q₂ = u₂/‖u₂‖',
            formula: '\\mathbf{q}_2 = \\left(\\tfrac{1}{\\sqrt{6}}, -\\tfrac{1}{\\sqrt{6}}, \\tfrac{2}{\\sqrt{6}}\\right)',
          },
          {
            step: 'q₃ = q₁ × q₂ (or continue Gram-Schmidt)',
            formula: '\\mathbf{q}_3 = \\left(\\tfrac{1}{\\sqrt{3}}, -\\tfrac{1}{\\sqrt{3}}, -\\tfrac{1}{\\sqrt{3}}\\right)',
          },
        ]}
      />

      <WarningBlock title="Numerical Instability of Classical Gram-Schmidt">
        <p>
          The classical Gram-Schmidt algorithm is numerically unstable: rounding errors accumulate,
          causing the output vectors to lose orthogonality. In practice, use the <em>modified</em>
          Gram-Schmidt algorithm (reorthogonalize each vector against all previously computed basis
          vectors one at a time). Even better: use Householder reflections (used in <code>np.linalg.qr</code>),
          which are backward stable.
        </p>
      </WarningBlock>

      <PythonCode
        title="Gram-Schmidt and Orthogonal Projections"
        code={`import numpy as np

def gram_schmidt(V):
    """Classical Gram-Schmidt (for illustration; use np.linalg.qr in practice)."""
    Q = []
    for v in V.T:
        u = v.copy()
        for q in Q:
            u -= np.dot(u, q) * q
        norm = np.linalg.norm(u)
        if norm > 1e-10:
            Q.append(u / norm)
    return np.column_stack(Q)

# Example: three vectors in R^3
V = np.array([[1, 1, 0],
              [1, 0, 1],
              [0, 1, 1]], dtype=float).T  # columns are vectors

Q = gram_schmidt(V)
print("Orthonormal basis Q:\\n", Q.round(4))
print("Q^T Q (should be I):\\n", (Q.T @ Q).round(4))

# Better: use QR factorization
Q2, R = np.linalg.qr(V)
print("\\nQR factorization Q:\\n", Q2.round(4))

# Orthogonal projection onto span of first two columns
q1, q2 = Q2[:, 0], Q2[:, 1]
P = np.outer(q1, q1) + np.outer(q2, q2)  # projection matrix
v = np.array([1.0, 2.0, 3.0])
proj = P @ v
print(f"\\nProjection of {v} onto span: {proj.round(4)}")`}
      />
    </div>
  );
}
