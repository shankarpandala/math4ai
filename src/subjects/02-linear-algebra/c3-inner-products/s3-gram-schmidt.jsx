import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import SectionLayout from '../../../components/content/SectionLayout.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'

// Normalize a 2D vector
function norm(v) { return Math.sqrt(v[0] ** 2 + v[1] ** 2) }
function normalize(v) { const n = norm(v); return n < 1e-10 ? [0,0] : [v[0]/n, v[1]/n] }
function dot(a, b) { return a[0]*b[0] + a[1]*b[1] }
function sub(a, b) { return [a[0]-b[0], a[1]-b[1]] }
function scale(v, s) { return [v[0]*s, v[1]*s] }
function proj(u, e) { return scale(e, dot(u, e)) }  // project u onto unit vector e

const STEPS = [
  { label: 'Original vectors', desc: 'Start with two linearly independent vectors v₁ and v₂.' },
  { label: 'Normalize v₁', desc: 'Set e₁ = v₁ / ‖v₁‖. First basis vector is done.' },
  { label: 'Subtract projection', desc: 'Compute u₂ = v₂ − (v₂·e₁)e₁, removing the component along e₁.' },
  { label: 'Normalize u₂', desc: 'Set e₂ = u₂ / ‖u₂‖. Now {e₁, e₂} is an orthonormal basis.' },
]

const v1 = [2, 1]
const v2 = [1, 2.5]

function GramSchmidtViz() {
  const [step, setStep] = useState(0)
  const W = 320, H = 320, cx = 80, cy = 240, gs = 60

  const toSvg = (x, y) => [cx + x * gs, cy - y * gs]
  const arrow = (x1, y1, x2, y2, color, id) => {
    const dx = x2-x1, dy = y2-y1
    const L = Math.sqrt(dx*dx+dy*dy)
    if (L < 2) return null
    return (
      <g key={id}>
        <defs>
          <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0L6 3L0 6Z" fill={color} />
          </marker>
        </defs>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" markerEnd={`url(#${id})`} />
      </g>
    )
  }

  const e1 = normalize(v1)
  const u2 = sub(v2, proj(v2, e1))
  const e2 = normalize(u2)

  const p0 = toSvg(0, 0)

  const v1p = toSvg(...v1)
  const v2p = toSvg(...v2)
  const e1p = toSvg(...scale(e1, 2.2))
  const u2p = toSvg(...u2)
  const e2p = toSvg(...scale(e2, 2.2))
  const projP = toSvg(...proj(v2, e1))

  return (
    <div className="my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <h3 className="mb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
        Gram-Schmidt Step by Step
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="text-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
          Step {step+1}/4: {STEPS[step].label}
        </div>
        <svg width={W} height={H} className="rounded-lg bg-gray-950">
          {/* Grid */}
          {[-1,0,1,2,3].map(i => (
            <g key={i}>
              <line x1={toSvg(i,-1)[0]} y1={toSvg(i,-1)[1]} x2={toSvg(i,4)[0]} y2={toSvg(i,4)[1]}
                stroke="#1e293b" strokeWidth="0.5" />
              <line x1={toSvg(-1,i)[0]} y1={toSvg(-1,i)[1]} x2={toSvg(4,i)[0]} y2={toSvg(4,i)[1]}
                stroke="#1e293b" strokeWidth="0.5" />
            </g>
          ))}
          {/* Axes */}
          <line x1={toSvg(-0.5,0)[0]} y1={cy} x2={toSvg(3.5,0)[0]} y2={cy} stroke="#334155" strokeWidth="1" />
          <line x1={cx} y1={toSvg(0,-0.5)[1]} x2={cx} y2={toSvg(0,4)[1]} stroke="#334155" strokeWidth="1" />

          {/* v1 always shown */}
          {arrow(p0[0], p0[1], v1p[0], v1p[1], '#94a3b8', 'v1a')}
          <text x={v1p[0]+5} y={v1p[1]-5} fill="#94a3b8" fontSize="12">v₁</text>

          {/* v2 always shown */}
          {arrow(p0[0], p0[1], v2p[0], v2p[1], '#94a3b8', 'v2a')}
          <text x={v2p[0]+5} y={v2p[1]-5} fill="#94a3b8" fontSize="12">v₂</text>

          {/* Step 1+: e1 */}
          {step >= 1 && arrow(p0[0], p0[1], e1p[0], e1p[1], '#818cf8', 'e1a')}
          {step >= 1 && <text x={e1p[0]+5} y={e1p[1]-5} fill="#818cf8" fontSize="12">e₁</text>}

          {/* Step 2+: projection dashed line + u2 */}
          {step >= 2 && (
            <line x1={v2p[0]} y1={v2p[1]} x2={projP[0]} y2={projP[1]}
              stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" />
          )}
          {step >= 2 && arrow(p0[0], p0[1], u2p[0], u2p[1], '#fbbf24', 'u2a')}
          {step >= 2 && <text x={u2p[0]+5} y={u2p[1]-5} fill="#fbbf24" fontSize="12">u₂</text>}

          {/* Step 3+: e2 */}
          {step >= 3 && arrow(p0[0], p0[1], e2p[0], e2p[1], '#34d399', 'e2a')}
          {step >= 3 && <text x={e2p[0]+5} y={e2p[1]-5} fill="#34d399" fontSize="12">e₂</text>}
        </svg>

        <p className="text-xs text-gray-500 text-center max-w-xs">{STEPS[step].desc}</p>

        <div className="flex gap-3">
          <button onClick={() => setStep(0)}
            className="rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Reset
          </button>
          <button onClick={() => setStep(s => Math.min(s+1, 3))} disabled={step===3}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors">
            Next Step →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GramSchmidtSection() {
  return (
    <SectionLayout>
      <NoteBlock
        title="Historical Note"
        content="Jørgen Pedersen Gram (1883) and Erhard Schmidt (1907) independently developed this orthogonalization algorithm. Schmidt's 1907 paper established it in the operator theory context. Today it underpins QR decomposition, which is used in least-squares solvers, eigenvalue algorithms (QR iteration), and orthogonal weight initialization in deep neural networks."
      />

      <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        Given a set of linearly independent vectors, Gram-Schmidt produces an <strong>orthonormal basis</strong> spanning
        the same subspace. The key idea: at each step, subtract off the components of the new vector that
        lie in the span of the vectors already processed.
      </p>

      <DefinitionBlock
        label="Definition 3.4"
        title="Orthonormal Set"
        definition="A set of vectors $\{e_1, \ldots, e_k\}$ in an inner product space is orthonormal if $\langle e_i, e_j \rangle = \delta_{ij}$ (i.e., mutually orthogonal and each unit length). An orthonormal set that spans the space is an orthonormal basis."
        notation="For $\mathbb{R}^n$ with dot product, $e_i^T e_j = \delta_{ij}$."
      />

      <TheoremBlock
        label="Theorem 3.5"
        title="Gram-Schmidt Orthogonalization"
        statement="Let $\{v_1, \ldots, v_k\}$ be linearly independent vectors in an inner product space. Define: $u_1 = v_1$, and for $j \geq 2$: $u_j = v_j - \sum_{i=1}^{j-1} \frac{\langle v_j, u_i \rangle}{\langle u_i, u_i \rangle} u_i$. Then setting $e_j = u_j / \|u_j\|$ gives an orthonormal set $\{e_1, \ldots, e_k\}$ with $\mathrm{span}\{e_1,\ldots,e_j\} = \mathrm{span}\{v_1,\ldots,v_j\}$ for all $j$."
        proof="By induction. Base: $e_1 = v_1/\|v_1\|$ is clearly unit length and spans $\{v_1\}$. Inductive step: assume $e_1,\ldots,e_{j-1}$ are orthonormal. Then $u_j = v_j - \sum_{i<j}\langle v_j, e_i\rangle e_i$. For any $\ell < j$: $\langle u_j, e_\ell\rangle = \langle v_j, e_\ell\rangle - \langle v_j, e_\ell\rangle = 0$. Since $v_j$ is not in $\text{span}\{v_1,\ldots,v_{j-1}\} = \text{span}\{e_1,\ldots,e_{j-1}\}$, we have $u_j \neq 0$, so $e_j = u_j/\|u_j\|$ is well-defined and unit length."
        corollaries={[
          "Every finite-dimensional inner product space has an orthonormal basis (take any basis and apply Gram-Schmidt).",
          "The QR factorization $A = QR$ is just Gram-Schmidt: columns of $Q$ are the $e_j$, and $R_{ij} = \\langle a_j, e_i\\rangle$ for $i \\leq j$.",
          "Orthonormal bases simplify coordinates: $v = \\sum_i \\langle v, e_i\\rangle e_i$ (no matrix inversion needed)."
        ]}
      />

      <GramSchmidtViz />

      <ExampleBlock
        title="3D Gram-Schmidt"
        steps={[
          { label: "Input", content: "$v_1=(1,1,0),\; v_2=(1,0,1),\; v_3=(0,1,1)$" },
          { label: "Step 1", content: "$e_1 = v_1/\\|v_1\\| = (1/\\sqrt{2}, 1/\\sqrt{2}, 0)$" },
          { label: "Step 2", content: "$u_2 = v_2 - (v_2 \\cdot e_1)e_1 = (1,0,1) - \\frac{1}{\\sqrt{2}}\\cdot(1/\\sqrt{2},1/\\sqrt{2},0) = (1/2,-1/2,1)$, then $e_2 = u_2/\\|u_2\\| = (1/\\sqrt{6},-1/\\sqrt{6},2/\\sqrt{6})$" },
          { label: "Step 3", content: "$u_3 = v_3 - (v_3\\cdot e_1)e_1 - (v_3\\cdot e_2)e_2$, giving $e_3 = (1/\\sqrt{3},-1/\\sqrt{3},-1/\\sqrt{3})$" },
          { label: "Verify", content: "$e_1^Te_2 = 0$, $e_1^Te_3 = 0$, $e_2^Te_3 = 0$ ✓ (all unit length, mutually orthogonal)" }
        ]}
      />

      <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Connection to QR Decomposition</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Gram-Schmidt on the columns of <InlineMath math="A \in \mathbb{R}^{m \times n}" /> (m≥n) yields <InlineMath math="A = QR" />{' '}
          where <InlineMath math="Q \in \mathbb{R}^{m \times n}" /> has orthonormal columns and{' '}
          <InlineMath math="R \in \mathbb{R}^{n \times n}" /> is upper triangular:
        </p>
        <BlockMath math="R_{ij} = \langle a_j, e_i \rangle \text{ for } i \leq j, \quad R_{ij} = 0 \text{ for } i > j" />
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          QR is used for: solving least squares (normal equations without forming <InlineMath math="A^TA" />),
          the QR eigenvalue algorithm, and orthogonal weight initialization in neural networks.
        </p>
      </div>

      <PythonCode
        title="Gram-Schmidt QR from scratch"
        code={`import numpy as np

def gram_schmidt_qr(A):
    """Classical Gram-Schmidt QR decomposition."""
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    
    for j in range(n):
        u = A[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ A[:, j]   # projection coefficient
            u -= R[i, j] * Q[:, i]         # subtract projection
        R[j, j] = np.linalg.norm(u)
        Q[:, j] = u / R[j, j]             # normalize
    
    return Q, R

# Test on a 4x3 matrix
A = np.array([[1,1,0],[1,0,1],[0,1,1],[1,1,1]], dtype=float)
Q, R = gram_schmidt_qr(A)

print("Q (orthonormal columns):")
print(Q.round(4))
print("\\nR (upper triangular):")
print(R.round(4))
print("\\nQ^T Q ≈ I?", np.allclose(Q.T @ Q, np.eye(3)))
print("A ≈ QR?", np.allclose(A, Q @ R))

# Compare with NumPy's built-in (uses Householder, more stable)
Q_np, R_np = np.linalg.qr(A)
print("\\nMax difference from np.linalg.qr:", np.max(np.abs(np.abs(Q) - np.abs(Q_np))))

# Application: solve least squares Ax = b
b = np.array([1, 2, 3, 4], dtype=float)
# x = R^{-1} Q^T b
x = np.linalg.solve(R, Q.T @ b)
print("\\nLeast-squares solution:", x.round(4))
print("Residual:", np.linalg.norm(A @ x - b).round(4))
`}
      />

      <WarningBlock
        title="Numerical Stability"
        items={[
          "Classical Gram-Schmidt accumulates floating-point errors exponentially when vectors are nearly collinear. Modified Gram-Schmidt (MGS) reorthogonalizes against already-computed vectors iteratively — same math, better numerics.",
          "For serious numerical work (e.g. solving linear systems), use Householder reflections (numpy.linalg.qr) which are more stable than MGS by another factor.",
          "Loss of orthogonality: classical GS can produce Q columns with $|e_i^T e_j| \\sim 10^{-8}$ even with 64-bit floats on ill-conditioned inputs. Always check Q^TQ ≈ I.",
          "Reorthogonalization (running GS twice) often restores full orthogonality at 2× the cost."
        ]}
      />

      <ExerciseBlock
        exercises={[
          { difficulty: "conceptual", question: "Why does Gram-Schmidt fail if the input vectors are linearly dependent? What goes wrong algebraically?" },
          { difficulty: "computational", question: "Apply Gram-Schmidt to $v_1=(3,4)$, $v_2=(1,0)$ in $\\mathbb{R}^2$. Verify $e_1^Te_2=0$ and that the columns of $Q$ satisfy $A=QR$." },
          { difficulty: "proof", question: "Prove that Modified Gram-Schmidt (subtract projections sequentially onto already-normalized vectors rather than all at once) produces the same Q but is numerically more stable." },
          { difficulty: "implementation", question: "Implement Modified Gram-Schmidt in NumPy. Test on a Hilbert matrix (known to be ill-conditioned) and compare $\\|Q^TQ - I\\|_F$ with classical Gram-Schmidt." }
        ]}
      />

      <ReferenceList
        references={[
          { authors: "Strang, G.", year: 2016, title: "Introduction to Linear Algebra (5th ed.), Ch. 4.4", venue: "Wellesley-Cambridge Press", note: "Clear geometric treatment of Gram-Schmidt and QR" },
          { authors: "Trefethen, L. N. & Bau, D.", year: 1997, title: "Numerical Linear Algebra, Lecture 7–8", venue: "SIAM", note: "Classical vs Modified GS, Householder QR, stability analysis" },
          { authors: "Saxe, A. M. et al.", year: 2014, title: "Exact solutions to the nonlinear dynamics of learning in deep linear neural networks", venue: "ICLR 2014", note: "Orthogonal initialization (related to QR) enables deep network training" }
        ]}
      />
    </SectionLayout>
  )
}
