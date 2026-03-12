import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// 2D parallelogram area = |det| visualizer
// ---------------------------------------------------------------------------
function ParallelogramViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0.5);
  const [c, setC] = useState(0.5);
  const [d, setD] = useState(1.5);

  const det = a * d - b * c;
  const area = Math.abs(det);
  const orientation = det > 0 ? 'positive (CCW)' : det < 0 ? 'negative (CW)' : 'zero (degenerate)';

  const W = 360, H = 280;
  const ox = W / 2, oy = H / 2;
  const scale = 50;

  function toSvg(x, y) { return [ox + x * scale, oy - y * scale]; }

  // Parallelogram vertices: 0, v1, v1+v2, v2
  const [x0, y0] = toSvg(0, 0);
  const [x1, y1] = toSvg(a, c);
  const [x2, y2] = toSvg(a + b, c + d);
  const [x3, y3] = toSvg(b, d);

  const fillColor = det > 0 ? '#6366f1' : det < 0 ? '#ef4444' : '#9ca3af';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Parallelogram Area = <InlineMath math="|\det A|" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The columns of <InlineMath math="A = \begin{bmatrix}a & b \\ c & d\end{bmatrix}" /> define the parallelogram. Its signed area equals <InlineMath math="\det(A) = ad - bc" />. Adjust to see how orientation (sign) and scaling (magnitude) change.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        {[
          { label: 'a (v₁ x)', val: a, set: setA },
          { label: 'b (v₂ x)', val: b, set: setB },
          { label: 'c (v₁ y)', val: c, set: setC },
          { label: 'd (v₂ y)', val: d, set: setD },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono">{label}</span>
              <span>{val.toFixed(1)}</span>
            </div>
            <input type="range" min={-3} max={3} step={0.1} value={val}
              onChange={(e) => set(parseFloat(e.target.value))}
              className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800">
          {/* Grid */}
          {[-3,-2,-1,0,1,2,3].map((v) => {
            const [sx] = toSvg(v, 0);
            const [, sy] = toSvg(0, v);
            return (
              <g key={v}>
                <line x1={sx} y1={0} x2={sx} y2={H} stroke="#e5e7eb" strokeWidth={v === 0 ? 1.5 : 0.5} />
                <line x1={0} y1={sy} x2={W} y2={sy} stroke="#e5e7eb" strokeWidth={v === 0 ? 1.5 : 0.5} />
              </g>
            );
          })}

          {/* Parallelogram fill */}
          <polygon points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill={fillColor} opacity={0.2} />
          <polygon points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="none" stroke={fillColor} strokeWidth={2} />

          {/* Column vectors */}
          <line x1={ox} y1={oy} x2={x1} y2={y1} stroke="#6366f1" strokeWidth={3} />
          <polygon points={`${x1},${y1} ${x1-5},${y1+10} ${x1+5},${y1+10}`}
            fill="#6366f1" transform={`rotate(${Math.atan2(y1-oy, x1-ox)*180/Math.PI+90},${x1},${y1})`} />
          <text x={x1 + 6} y={y1 - 6} fontSize={12} fontWeight="700" fill="#4f46e5">v₁</text>

          <line x1={ox} y1={oy} x2={x3} y2={y3} stroke="#10b981" strokeWidth={3} />
          <text x={x3 + 6} y={y3 - 6} fontSize={12} fontWeight="700" fill="#059669">v₂</text>

          {/* Origin */}
          <circle cx={ox} cy={oy} r={4} fill="#374151" />
          <text x={ox + 6} y={oy + 14} fontSize={10} fill="#9ca3af">O</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-900/20">
          <div className="font-semibold text-indigo-700 dark:text-indigo-300">det(A)</div>
          <div className="font-mono text-indigo-600">{det.toFixed(3)}</div>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
          <div className="font-semibold text-emerald-700 dark:text-emerald-300">Area = |det|</div>
          <div className="font-mono text-emerald-600">{area.toFixed(3)}</div>
        </div>
        <div className={`rounded-lg px-3 py-2 ${det > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <div className={`font-semibold ${det > 0 ? 'text-purple-700 dark:text-purple-300' : 'text-red-700 dark:text-red-300'}`}>Orientation</div>
          <div className={`font-mono text-xs ${det > 0 ? 'text-purple-600' : 'text-red-600'}`}>{orientation}</div>
        </div>
      </div>
    </div>
  );
}

const DET_APPS_CODE = `import numpy as np

# ---------------------------------------------------------------------------
# Determinant applications
# ---------------------------------------------------------------------------

# 1. Volume scaling
# |det(A)| = volume scale factor for A applied to the unit hypercube
A = np.array([[2, 1], [0, 3]], dtype=float)
print(f"det(A) = {np.linalg.det(A):.4f}")
print(f"|det(A)| = {abs(np.linalg.det(A)):.4f}  (area of parallelogram spanned by columns)")

# Verify: columns [2,0] and [1,3] span parallelogram with area = |2*3 - 1*0| = 6
col1 = A[:, 0]
col2 = A[:, 1]
cross_product = col1[0]*col2[1] - col1[1]*col2[0]   # 2D "cross product"
print(f"Cross product: {cross_product:.4f}  (matches det)")

# 2. Cramer's Rule: solve Ax = b using determinants
# x_i = det(A_i) / det(A) where A_i = A with column i replaced by b
def cramers_rule(A, b):
    n = len(b)
    det_A = np.linalg.det(A)
    if abs(det_A) < 1e-12:
        raise ValueError("Matrix is singular (det ≈ 0)")
    x = np.zeros(n)
    for i in range(n):
        A_i = A.copy()
        A_i[:, i] = b    # replace column i with b
        x[i] = np.linalg.det(A_i) / det_A
    return x

A2 = np.array([[2, 1], [1, 3]], dtype=float)
b2 = np.array([5, 7], dtype=float)
x_cramer = cramers_rule(A2, b2)
x_numpy = np.linalg.solve(A2, b2)
print(f"\\nCramer's Rule: x = {x_cramer}")
print(f"NumPy solve:   x = {x_numpy}")
print(f"Match: {np.allclose(x_cramer, x_numpy)}")

# 3. Orientation: sign of det
# Positive = same orientation (counterclockwise), negative = reversed (clockwise)
def orientation_2d(p1, p2, p3):
    """
    Sign of det([[p2-p1], [p3-p1]]): positive=CCW, negative=CW, 0=collinear.
    """
    v1 = np.array(p2) - np.array(p1)
    v2 = np.array(p3) - np.array(p1)
    d = v1[0]*v2[1] - v1[1]*v2[0]
    return 'CCW' if d > 0 else 'CW' if d < 0 else 'Collinear'

print("\\nOrientation tests:")
print(orientation_2d([0,0], [1,0], [0,1]))   # CCW
print(orientation_2d([0,0], [0,1], [1,0]))   # CW

# 4. Log determinant for large matrices (numerically stable)
import numpy as np
A_large = np.random.randn(100, 100)
A_pd = A_large.T @ A_large + 100 * np.eye(100)
sign, logdet = np.linalg.slogdet(A_pd)
print(f"\\nlog|det(A)| = {logdet:.4f}  (using slogdet for stability)")
print(f"sign = {sign}")
# Direct det would overflow for large matrices!`;

export default function DeterminantApplications() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Determinant Applications
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Cramer's rule, volume scaling, orientation — the geometric meaning of the determinant and its practical applications.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 4.2"
        title="Determinant as Signed Volume"
        definition="The determinant $\det(A)$ of a square matrix $A \in \mathbb{R}^{n \times n}$ equals the signed $n$-dimensional volume of the parallelepiped spanned by the columns (or rows) of $A$. In 2D, $|\det A| = |ad - bc|$ is the area of the parallelogram with sides $v_1 = (a,c)^\top$ and $v_2 = (b,d)^\top$. The sign encodes orientation: positive if the column vectors form a right-handed (counterclockwise in 2D) basis, negative if left-handed, zero if the vectors are linearly dependent."
        notation="The signed volume interpretation holds in all dimensions. For the $3 \times 3$ case, $\det A = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - \ldots$ is the scalar triple product of the three column vectors."
      />

      <ParallelogramViz />

      <DefinitionBlock
        label="Definition 4.3"
        title="Cramer's Rule"
        definition="For a system $Ax = b$ with $A \in \mathbb{R}^{n \times n}$ and $\det(A) \neq 0$, Cramer's rule gives: $x_i = \frac{\det(A_i)}{\det(A)}$ where $A_i$ is the matrix $A$ with column $i$ replaced by $b$. Although theoretically elegant, Cramer's rule requires $n+1$ determinant computations, each $O(n^3)$, giving total $O(n^4)$ — far worse than Gaussian elimination at $O(n^3)$. Its primary use is theoretical (existence/uniqueness proofs) and for $2 \times 2$ or $3 \times 3$ systems."
        notation="Cramer's rule provides a closed-form solution: $x = A^{-1}b$. Since $A^{-1} = \text{adj}(A)/\det(A)$ where $\text{adj}(A)_{ij} = (-1)^{i+j}M_{ji}$ (cofactor matrix), Cramer's rule is equivalent to matrix inversion via cofactors."
      />

      <TheoremBlock
        label="Theorem 4.2"
        title="Determinant as Volume Scaling Factor"
        statement="For any measurable set $S \subseteq \mathbb{R}^n$ and linear map $T_A: x \mapsto Ax$, $\text{vol}(T_A(S)) = |\det(A)| \cdot \text{vol}(S)$. In other words, a linear transformation scales $n$-dimensional volume by exactly $|\det(A)|$. As a corollary, $A$ is invertible iff $\det(A) \neq 0$, which corresponds to the transformation being bijective (non-zero-volume-preserving)."
        proof="For the unit hypercube $[0,1]^n$, the image $T_A([0,1]^n)$ is the parallelepiped spanned by the columns of $A$. By the multilinearity and alternating properties of the determinant, this parallelepiped has volume $|\det(A)|$. For general $S$: approximate $S$ by small cubes, apply the linear scaling to each, and take the limit — this is the change-of-variables formula in integration: $\int_{T_A(S)} f(y)\,dy = \int_S f(Ax)|\det(A)|\,dx$. $\square$"
        corollaries={[
          "$\\det(AB) = \\det(A)\\det(B)$: sequential transformations multiply volumes.",
          "For orthogonal $Q$: $\\det(Q) = \\pm 1$, so orthogonal maps are isometries (preserve volume).",
          "$\\det(A^{-1}) = 1/\\det(A)$: the inverse map scales volume by the reciprocal.",
        ]}
      />

      <ExampleBlock
        title="Cramer's Rule for 2×2 System"
        difficulty="intermediate"
        problem="Solve the system $2x + y = 5$, $x + 3y = 7$ using Cramer's rule."
        solution={[
          { step: "Write as $Ax = b$", formula: "A = \\begin{bmatrix}2&1\\\\1&3\\end{bmatrix}, \\quad b = \\begin{bmatrix}5\\\\7\\end{bmatrix}" },
          { step: "Compute $\\det(A)$", formula: "\\det(A) = 2 \\cdot 3 - 1 \\cdot 1 = 5" },
          { step: "Compute $\\det(A_1)$ (replace col 1 with b)", formula: "\\det(A_1) = \\det\\begin{bmatrix}5&1\\\\7&3\\end{bmatrix} = 15 - 7 = 8 \\implies x_1 = 8/5 = 1.6" },
          { step: "Compute $\\det(A_2)$ (replace col 2 with b)", formula: "\\det(A_2) = \\det\\begin{bmatrix}2&5\\\\1&7\\end{bmatrix} = 14 - 5 = 9 \\implies x_2 = 9/5 = 1.8", explanation: "Verify: $2(1.6) + 1.8 = 5$ ✓ and $1.6 + 3(1.8) = 7$ ✓" },
        ]}
      />

      <WarningBlock title="Never Use Determinants for Numerical Computation">
        <ul className="space-y-2 text-sm">
          <li><strong>Overflow/underflow for large matrices.</strong> $\det(2I_{1000}) = 2^{1000} \approx 10^{301}$ — catastrophic overflow in float64. Use <code>np.linalg.slogdet</code> which computes $\log|\det A|$ stably using LU factorization.</li>
          <li className="mt-2"><strong>Cramer's rule is $O(n^4)$, never use it.</strong> Even for $n=100$, Cramer's rule requires $\sim 10^8$ operations; Gaussian elimination needs only $\sim 10^6$. Use <code>np.linalg.solve</code> for any practical system.</li>
          <li className="mt-2"><strong>$\det(A) \neq 0$ is a poor invertibility test.</strong> A matrix can be numerically singular (highly ill-conditioned) while having a non-zero but tiny determinant. Use the condition number <code>np.linalg.cond(A)</code> to assess numerical stability.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={DET_APPS_CODE} title="Determinant Applications — NumPy" runnable />
    </div>
  );
}
