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
// Symmetric matrix → orthogonal eigenvectors demo
// ---------------------------------------------------------------------------
function SpectralViz() {
  const [a11, setA11] = useState(3);
  const [a12, setA12] = useState(1);
  const [a22, setA22] = useState(2);

  // Symmetric 2x2: [[a11, a12], [a12, a22]]
  const tr = a11 + a22;
  const det = a11 * a22 - a12 * a12;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lam1 = (tr + Math.sqrt(disc)) / 2;
  const lam2 = (tr - Math.sqrt(disc)) / 2;

  // Eigenvectors (always real for symmetric)
  function eigvec(lam) {
    const rx = a11 - lam, ry = a12;
    if (Math.abs(rx) + Math.abs(ry) > 1e-8) {
      const n = Math.sqrt(rx * rx + ry * ry);
      return [-ry / n, rx / n];
    }
    return lam > 0 ? [1, 0] : [0, 1];
  }

  const v1 = eigvec(lam1);
  const v2 = eigvec(lam2);
  const dotProd = v1[0] * v2[0] + v1[1] * v2[1];
  const isPSD = lam1 >= -1e-8 && lam2 >= -1e-8;
  const isPD = lam1 > 1e-8 && lam2 > 1e-8;

  const S = 55, OX = 200, OY = 210;
  const toSVG = (x, y) => [OX + x * S, OY - y * S];

  const arrowHead = (x1, y1, x2, y2, color) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 3) return null;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    return <polygon points={`${x2},${y2} ${x2-ux*10+px*5},${y2-uy*10+py*5} ${x2-ux*10-px*5},${y2-uy*10-py*5}`} fill={color} />;
  };

  const drawVec = (x1, y1, x2, y2, color, w = 2.5) => {
    const [sx1, sy1] = toSVG(x1, y1);
    const [sx2, sy2] = toSVG(x2, y2);
    return <g>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={w} />
      {arrowHead(sx1, sy1, sx2, sy2, color)}
    </g>;
  };

  // Show image of unit circle under A: parametric curve
  const ellipsePoints = Array.from({ length: 61 }, (_, i) => {
    const t = (2 * Math.PI * i) / 60;
    const cx = Math.cos(t), cy = Math.sin(t);
    const Ax = a11 * cx + a12 * cy;
    const Ay = a12 * cx + a22 * cy;
    return toSVG(Ax, Ay);
  });
  const ellipsePath = ellipsePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';

  const circlePoints = Array.from({ length: 61 }, (_, i) => {
    const t = (2 * Math.PI * i) / 60;
    return toSVG(Math.cos(t), Math.sin(t));
  });
  const circlePath = circlePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';

  const sliderClass = 'w-full h-1.5 rounded-full accent-violet-500 cursor-pointer';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Symmetric Matrix — Orthogonal Eigenvectors Demo
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Symmetric matrices always have real, orthogonal eigenvectors. The unit circle (gray) maps to an
        ellipse aligned with the eigenvectors. Eigenvectors are always perpendicular.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          {[
            { label: 'A₁₁', val: a11, set: setA11 },
            { label: 'A₁₂ = A₂₁', val: a12, set: setA12 },
            { label: 'A₂₂', val: a22, set: setA22 },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span className="font-mono font-semibold">{label}</span>
                <span>{val.toFixed(1)}</span>
              </div>
              <input type="range" min="-3" max="5" step="0.5" value={val}
                onChange={e => set(parseFloat(e.target.value))} className={sliderClass} />
            </div>
          ))}

          <div className="mt-3 space-y-2">
            <div className="rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-900/20">
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Eigenvalues (always real)</p>
              <p className="font-mono mt-1">λ₁ = {lam1.toFixed(3)}, λ₂ = {lam2.toFixed(3)}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-xs dark:bg-blue-900/20">
              <p className="font-semibold text-blue-600 dark:text-blue-400">Eigenvectors (always orthogonal)</p>
              <p className="font-mono mt-1">v₁ = ({v1[0].toFixed(3)}, {v1[1].toFixed(3)})</p>
              <p className="font-mono">v₂ = ({v2[0].toFixed(3)}, {v2[1].toFixed(3)})</p>
              <p className="mt-1 text-gray-500">v₁·v₂ = {Math.abs(dotProd).toFixed(6)} ≈ 0 ✓</p>
            </div>
            <div className={`rounded-lg p-3 text-xs ${
              isPD ? 'bg-green-50 dark:bg-green-900/20' : isPSD ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <p className={`font-semibold ${isPD ? 'text-green-700 dark:text-green-400' : isPSD ? 'text-yellow-700 dark:text-yellow-400' : 'text-red-700 dark:text-red-400'}`}>
                {isPD ? 'Positive Definite (all λ > 0)' : isPSD ? 'Positive Semi-definite (all λ ≥ 0)' : 'Indefinite (mixed signs)'}
              </p>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {[-3,-2,-1,0,1,2,3].map(i => (
            <g key={i}>
              <line x1={toSVG(i,-3)[0]} y1={toSVG(i,-3)[1]} x2={toSVG(i,3)[0]} y2={toSVG(i,3)[1]} stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-3,i)[0]} y1={toSVG(-3,i)[1]} x2={toSVG(3,i)[0]} y2={toSVG(3,i)[1]} stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          <line x1={toSVG(-3.5,0)[0]} y1={OY} x2={toSVG(3.5,0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0,-3.5)[1]} x2={OX} y2={toSVG(0,3.5)[1]} stroke="#9ca3af" strokeWidth={1.5} />
          {/* Unit circle */}
          <path d={circlePath} fill="none" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4 3" />
          {/* Image of unit circle under A */}
          <path d={ellipsePath} fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth={2} />
          {/* Eigenvectors */}
          {drawVec(0, 0, v1[0], v1[1], '#3b82f6', 3)}
          {drawVec(0, 0, v2[0], v2[1], '#22c55e', 3)}
          {/* Scaled eigenvectors (by eigenvalue) */}
          {drawVec(0, 0, lam1 * v1[0], lam1 * v1[1], '#93c5fd', 2)}
          {drawVec(0, 0, lam2 * v2[0], lam2 * v2[1], '#86efac', 2)}
          <text x={toSVG(v1[0]*1.3,v1[1]*1.3)[0]+5} y={toSVG(v1[0]*1.3,v1[1]*1.3)[1]-6}
            fontSize={12} fill="#3b82f6" fontWeight="bold">q₁</text>
          <text x={toSVG(v2[0]*1.3,v2[1]*1.3)[0]-20} y={toSVG(v2[0]*1.3,v2[1]*1.3)[1]-6}
            fontSize={12} fill="#22c55e" fontWeight="bold">q₂</text>
          <circle cx={OX} cy={OY} r={4} fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
}

export default function SpectralSection() {
  return (
    <div className="space-y-8">
      <SpectralViz />

      <DefinitionBlock
        label="Definition 5.3.1"
        title="Symmetric Matrix"
        definition={
          "A matrix $A \\in \\mathbb{R}^{n\\times n}$ is symmetric if $A = A^T$. " +
          "Equivalently, $a_{ij} = a_{ji}$ for all $i,j$. " +
          "Symmetric matrices arise naturally as covariance matrices, Gram matrices ($A^TA$), " +
          "graph Laplacians, and Hessians of smooth functions."
        }
        notation={
          "The set of $n\\times n$ symmetric matrices is denoted $\\mathcal{S}^n$. " +
          "The positive definite cone $\\mathcal{S}^n_{++} = \\{A \\in \\mathcal{S}^n : \\mathbf{x}^T A \\mathbf{x} > 0 \\text{ for all } \\mathbf{x} \\neq \\mathbf{0}\\}$."
        }
      />

      <DefinitionBlock
        label="Definition 5.3.2"
        title="Positive (Semi-)Definite Matrices"
        definition={
          "A symmetric matrix $A$ is positive definite (PD) if $\\mathbf{x}^T A \\mathbf{x} > 0$ for all $\\mathbf{x} \\neq \\mathbf{0}$, " +
          "and positive semidefinite (PSD) if $\\mathbf{x}^T A \\mathbf{x} \\geq 0$ for all $\\mathbf{x}$. " +
          "Equivalently (by the spectral theorem): $A$ is PD iff all eigenvalues are positive; " +
          "PSD iff all eigenvalues are non-negative."
        }
      />

      <TheoremBlock
        label="Theorem 5.3.1"
        title="Spectral Theorem for Real Symmetric Matrices"
        statement={
          "Every real symmetric matrix $A \\in \\mathbb{R}^{n\\times n}$ is orthogonally diagonalizable: " +
          "there exists an orthogonal matrix $Q$ ($Q^TQ = I$) and diagonal matrix $\\Lambda$ such that $A = Q\\Lambda Q^T$. " +
          "The diagonal entries of $\\Lambda$ are the eigenvalues of $A$ (all real), " +
          "and the columns of $Q$ are the corresponding orthonormal eigenvectors."
        }
        proof={
          "By induction on $n$. Base case $n=1$ is trivial. " +
          "For $n \\geq 2$: the characteristic polynomial has a real root $\\lambda_1$ " +
          "(since over $\\mathbb{C}$, $A = A^T$ implies $A = \\bar{A}$ for real $A$, " +
          "so if $A\\mathbf{v} = \\lambda\\mathbf{v}$ then $\\bar{\\lambda}\\|\\mathbf{v}\\|^2 = \\mathbf{v}^*A\\mathbf{v} = \\lambda\\|\\mathbf{v}\\|^2$, giving $\\lambda \\in \\mathbb{R}$). " +
          "Choose unit eigenvector $\\mathbf{q}_1$ for $\\lambda_1$, extend to orthonormal basis $Q_1 = [\\mathbf{q}_1 | Q_2]$. " +
          "Then $Q_1^T A Q_1 = \\begin{bmatrix}\\lambda_1 & \\mathbf{0}^T \\\\ \\mathbf{0} & B\\end{bmatrix}$ where $B = Q_2^T A Q_2$ is symmetric. " +
          "Apply induction to $B$ to complete the proof."
        }
        corollaries={[
          "The spectral decomposition gives $A = \\sum_{i=1}^n \\lambda_i \\mathbf{q}_i\\mathbf{q}_i^T$ (rank-1 outer products).",
          "Eigenvectors for distinct eigenvalues of a symmetric matrix are orthogonal.",
          "$\\|A\\|_2 = \\max_i |\\lambda_i|$ (spectral norm) and $\\|A\\|_F = \\sqrt{\\sum_i \\lambda_i^2}$.",
        ]}
      />

      <ExampleBlock
        title="Orthogonal Diagonalization"
        difficulty="advanced"
        problem={
          "Find the orthogonal diagonalization of $A = \\begin{bmatrix}3 & 1\\\\ 1 & 3\\end{bmatrix}$."
        }
        solution={[
          {
            step: 'Find eigenvalues: det(A-λI) = (3-λ)²-1 = 0 → λ=4 or λ=2',
            formula: '\\lambda_1 = 4,\\quad \\lambda_2 = 2',
          },
          {
            step: 'Eigenvectors: λ₁=4: (A-4I)v=0 → v₁=(1,1)/√2; λ₂=2: v₂=(1,-1)/√2',
            formula: 'Q = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1 & 1\\\\1 & -1\\end{bmatrix}, \\quad \\Lambda = \\begin{bmatrix}4 & 0\\\\0 & 2\\end{bmatrix}',
          },
          {
            step: 'Verify orthogonality and spectral decomposition',
            formula: 'A = Q\\Lambda Q^T = 4\\cdot\\frac{1}{2}\\begin{bmatrix}1\\\\1\\end{bmatrix}\\begin{bmatrix}1&1\\end{bmatrix} + 2\\cdot\\frac{1}{2}\\begin{bmatrix}1\\\\-1\\end{bmatrix}\\begin{bmatrix}1&-1\\end{bmatrix}',
          },
        ]}
      />

      <NoteBlock type="intuition" title="Why Symmetric = Orthogonally Diagonalizable">
        <p>
          Geometrically, a symmetric matrix has no "rotational" component — it only stretches along
          its eigenvector directions. The eigenvectors are always mutually perpendicular because
          the matrix "looks the same" when transposed, so it cannot distinguish between input and
          output directions. This makes symmetric matrices the natural matrices for quadratic forms,
          covariance, and energy functions.
        </p>
      </NoteBlock>

      <WarningBlock title="Symmetric vs. Orthogonal — Do Not Confuse">
        <p>
          A <em>symmetric</em> matrix (<InlineMath math="A = A^T" />) is not the same as an
          <em>orthogonal</em> matrix (<InlineMath math="Q^TQ = I" />). Symmetric matrices have real
          eigenvalues and orthogonal eigenvectors (via spectral theorem). Orthogonal matrices
          represent rotations/reflections with all eigenvalues on the unit circle. They are very
          different objects! The spectral theorem says symmetric matrices are <em>diagonalized by</em>
          orthogonal matrices.
        </p>
      </WarningBlock>

      <PythonCode
        title="Spectral Theorem and Positive Definiteness"
        code={`import numpy as np

# Symmetric matrix
A = np.array([[3, 1], [1, 3]], dtype=float)

# np.linalg.eigh is optimized for symmetric/Hermitian matrices
eigenvalues, Q = np.linalg.eigh(A)
print("Eigenvalues:", eigenvalues)
print("Orthonormal eigenvectors (columns):\\n", Q.round(4))
print("Q^T Q = I:", np.allclose(Q.T @ Q, np.eye(2)))

# Spectral decomposition: A = Q Lambda Q^T
Lambda = np.diag(eigenvalues)
A_reconstructed = Q @ Lambda @ Q.T
print("A = Q Λ Q^T:", np.allclose(A_reconstructed, A))

# Rank-1 decomposition
A_rank1 = sum(lam * np.outer(q, q) for lam, q in zip(eigenvalues, Q.T))
print("Rank-1 sum:", np.allclose(A_rank1, A))

# Checking positive definiteness
def is_pd(M):
    """Check positive definiteness via eigenvalues."""
    return np.all(np.linalg.eigvalsh(M) > 0)

print(f"\\nA is PD: {is_pd(A)}")
print(f"A - 4I is PD: {is_pd(A - 4*np.eye(2))}")  # borderline

# Covariance matrix (always PSD)
X = np.random.randn(100, 3)
Sigma = X.T @ X / 100  # sample covariance
lams = np.linalg.eigvalsh(Sigma)
print(f"\\nCovariance eigenvalues (all ≥ 0): {lams.round(4)}")
print(f"Is PSD: {np.all(lams >= -1e-10)}")`}
      />
    </div>
  );
}
