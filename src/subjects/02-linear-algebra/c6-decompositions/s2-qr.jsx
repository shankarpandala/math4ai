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
// Q and R matrix visualizer from a 3x2 input matrix
// ---------------------------------------------------------------------------
function QRVisualizerComp() {
  const [entries, setEntries] = useState([1, 1, 1, 0, 0, 1]);
  // 3x2 matrix
  const A = [
    [entries[0], entries[1]],
    [entries[2], entries[3]],
    [entries[4], entries[5]],
  ];

  const update = (idx, val) => {
    const ne = [...entries];
    ne[idx] = val;
    setEntries(ne);
  };

  // Gram-Schmidt on columns of A
  function gramSchmidt(M) {
    const cols = M[0].map((_, j) => M.map(row => row[j]));
    const Q_cols = [];
    const R = [];
    for (let j = 0; j < cols.length; j++) {
      let u = [...cols[j]];
      const rRow = new Array(cols.length).fill(0);
      for (let i = 0; i < Q_cols.length; i++) {
        const dotVal = Q_cols[i].reduce((s, v, k) => s + v * cols[j][k], 0);
        rRow[i] = dotVal;
        u = u.map((v, k) => v - dotVal * Q_cols[i][k]);
      }
      const norm = Math.sqrt(u.reduce((s, v) => s + v * v, 0));
      rRow[j] = norm;
      R.push(rRow);
      Q_cols.push(norm > 1e-10 ? u.map(v => v / norm) : u);
    }
    // Build Q from columns
    const Q = M.map((_, i) => Q_cols.map(col => col[i]));
    return { Q, R, valid: R.every(row => Math.abs(row[row.indexOf(Math.max(...row.map(Math.abs)))]) > 1e-8) };
  }

  const { Q, R, valid } = gramSchmidt(A);

  const fmt = v => v.toFixed(3);

  const MatrixDisplay = ({ M, label, color }) => (
    <div className="text-center">
      <p className={`mb-2 text-xs font-semibold ${color}`}>{label}</p>
      <div className="inline-block rounded-lg border-2 border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
        {M.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((v, j) => (
              <span key={j}
                className={`inline-block w-16 rounded py-0.5 text-center font-mono text-xs ${
                  Math.abs(v) < 1e-8 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'
                }`}>
                {fmt(v)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        QR Factorization Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Edit the 3×2 matrix A. See the orthonormal Q and upper-triangular R computed via Gram-Schmidt.
        The diagonal of R contains the norms of the orthogonalization steps.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-2">
        {entries.map((val, idx) => (
          <input key={idx} type="number" value={val}
            onChange={e => update(idx, parseFloat(e.target.value) || 0)}
            className="h-9 w-full rounded-lg border-2 border-gray-300 bg-white text-center text-sm font-mono font-bold text-gray-700 focus:border-indigo-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 text-center">
        <MatrixDisplay M={A} label="A (input)" color="text-gray-600 dark:text-gray-400" />
        <span className="text-2xl font-bold text-gray-400">=</span>
        <MatrixDisplay M={Q} label="Q (orthonormal cols)" color="text-blue-600 dark:text-blue-400" />
        <span className="text-2xl font-bold text-gray-400">·</span>
        <MatrixDisplay M={R} label="R (upper triangular)" color="text-green-600 dark:text-green-400" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-lg bg-blue-50 p-3 text-xs dark:bg-blue-900/20">
          <span className="font-semibold text-blue-600 dark:text-blue-400">Q orthonormality check: </span>
          <span className="font-mono text-blue-700 dark:text-blue-300">
            Q^T Q ≈ I: {
              (() => {
                // Check Q^T Q
                const n = Q[0].length;
                let ok = true;
                for (let i = 0; i < n; i++) {
                  for (let j = 0; j < n; j++) {
                    const dot = Q.reduce((s, row) => s + row[i] * row[j], 0);
                    const expected = i === j ? 1 : 0;
                    if (Math.abs(dot - expected) > 1e-6) ok = false;
                  }
                }
                return ok ? '✓' : '✗';
              })()
            }
          </span>
        </div>
        <div className="rounded-lg bg-green-50 p-3 text-xs dark:bg-green-900/20">
          <span className="font-semibold text-green-600 dark:text-green-400">R diagonal (norms): </span>
          <span className="font-mono text-green-700 dark:text-green-300">
            {R.map((row, i) => fmt(row[i])).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function QRSection() {
  return (
    <div className="space-y-8">
      <QRVisualizerComp />

      <DefinitionBlock
        label="Definition 6.2.1"
        title="QR Factorization"
        definition={
          "Every matrix $A \\in \\mathbb{R}^{m\\times n}$ with $m \\geq n$ and linearly independent columns " +
          "has a QR factorization $A = QR$ where: " +
          "$Q \\in \\mathbb{R}^{m\\times n}$ has orthonormal columns ($Q^TQ = I_n$), and " +
          "$R \\in \\mathbb{R}^{n\\times n}$ is upper triangular with positive diagonal entries. " +
          "This factorization is unique (when the positivity condition on $R$'s diagonal is imposed)."
        }
        notation={
          "Full QR: $A = \\hat{Q}\\hat{R}$ where $\\hat{Q} \\in \\mathbb{R}^{m\\times m}$ is orthogonal and $\\hat{R}$ is $m\\times n$ upper triangular. " +
          "Thin (reduced) QR: $A = QR$ with $Q \\in \\mathbb{R}^{m\\times n}$, $R \\in \\mathbb{R}^{n\\times n}$ (as above)."
        }
      />

      <DefinitionBlock
        label="Definition 6.2.2"
        title="Gram-Schmidt as QR"
        definition={
          "The Gram-Schmidt process applied to the columns $\\mathbf{a}_1, \\ldots, \\mathbf{a}_n$ of $A$ produces QR. " +
          "Setting $\\mathbf{q}_j = \\mathbf{u}_j / r_{jj}$ where " +
          "$\\mathbf{u}_j = \\mathbf{a}_j - \\sum_{i<j} r_{ij}\\mathbf{q}_i$, $r_{ij} = \\mathbf{q}_i^T \\mathbf{a}_j$, " +
          "$r_{jj} = \\|\\mathbf{u}_j\\|$, the entries of $R$ are exactly the $r_{ij}$."
        }
      />

      <TheoremBlock
        label="Theorem 6.2.1"
        title="Existence and Uniqueness of QR"
        statement={
          "If $A \\in \\mathbb{R}^{m\\times n}$ ($m \\geq n$) has full column rank, then the thin QR factorization " +
          "$A = QR$ with $Q^TQ = I_n$ and $R$ upper triangular with positive diagonal exists and is unique."
        }
        proof={
          "Existence: apply Gram-Schmidt to the columns of $A$. " +
          "Since columns are independent, $\\|\\mathbf{u}_j\\| > 0$ at each step, so $r_{jj} > 0$. " +
          "The resulting $Q = [\\mathbf{q}_1|\\cdots|\\mathbf{q}_n]$ is semi-orthogonal and $R = [r_{ij}]$ is upper triangular. " +
          "Uniqueness: if $A = Q_1 R_1 = Q_2 R_2$ with both factorizations valid, then " +
          "$Q_2^T Q_1 = R_2 R_1^{-1}$. The left side has columns of norm 1; the right side is upper triangular. " +
          "An upper triangular matrix with unit-norm columns must be diagonal with $\\pm 1$ on the diagonal. " +
          "The positivity of the diagonal forces all entries to be $+1$, giving $Q_1 = Q_2$, $R_1 = R_2$."
        }
        corollaries={[
          "Least-squares: the solution to $\\min_x \\|Ax-b\\|$ is $x^* = R^{-1}Q^Tb$ (back-substitution instead of forming $A^TA$).",
          "QR iteration is the standard algorithm for computing all eigenvalues of a symmetric matrix.",
        ]}
      />

      <ExampleBlock
        title="QR via Gram-Schmidt"
        difficulty="intermediate"
        problem={
          "Compute the QR factorization of $A = \\begin{bmatrix}1&1\\\\1&0\\\\0&1\\end{bmatrix}$."
        }
        solution={[
          {
            step: 'Normalize first column a₁ = (1,1,0)',
            formula: '\\mathbf{q}_1 = \\frac{(1,1,0)}{\\sqrt{2}},\\quad r_{11} = \\sqrt{2}',
          },
          {
            step: 'Project a₂ = (1,0,1) onto q₁, subtract',
            formula: 'r_{12} = \\mathbf{q}_1 \\cdot \\mathbf{a}_2 = \\tfrac{1}{\\sqrt{2}}, \\quad \\mathbf{u}_2 = (1,0,1) - \\tfrac{1}{\\sqrt{2}}\\mathbf{q}_1 = (\\tfrac{1}{2}, -\\tfrac{1}{2}, 1)',
          },
          {
            step: 'Normalize u₂',
            formula: 'r_{22} = \\|\\mathbf{u}_2\\| = \\sqrt{\\tfrac{3}{2}},\\quad \\mathbf{q}_2 = \\tfrac{1}{\\sqrt{6}}(1, -1, 2)',
          },
          {
            step: 'Assemble Q and R',
            formula: 'Q = \\begin{bmatrix}1/\\sqrt{2} & 1/\\sqrt{6}\\\\ 1/\\sqrt{2} & -1/\\sqrt{6}\\\\ 0 & 2/\\sqrt{6}\\end{bmatrix},\\quad R = \\begin{bmatrix}\\sqrt{2} & 1/\\sqrt{2}\\\\ 0 & \\sqrt{3/2}\\end{bmatrix}',
          },
        ]}
      />

      <NoteBlock type="tip" title="When to Use QR vs. LU">
        <p>
          Use QR for least-squares problems and numerically sensitive systems — it is more stable
          than forming the normal equations <InlineMath math="A^TA x = A^Tb" />, which squares the
          condition number. Use LU (Gaussian elimination) for square, non-symmetric systems when
          you just want to solve <InlineMath math="Ax = b" /> efficiently. Use Cholesky for
          symmetric positive definite systems (twice as fast as LU).
        </p>
      </NoteBlock>

      <WarningBlock title="Householder vs. Gram-Schmidt">
        <p>
          Classical Gram-Schmidt loses orthogonality rapidly in finite precision. NumPy's
          <code>np.linalg.qr</code> uses Householder reflections instead, which are backward-stable.
          Never implement Gram-Schmidt for production numerical code; always use
          <code>np.linalg.qr</code>. Gram-Schmidt is useful for understanding QR conceptually,
          but not for computing it.
        </p>
      </WarningBlock>

      <PythonCode
        title="QR Factorization with NumPy"
        code={`import numpy as np

A = np.array([[1, 1],
              [1, 0],
              [0, 1]], dtype=float)

# Thin QR (columns of Q are orthonormal)
Q, R = np.linalg.qr(A, mode='reduced')
print("Q (orthonormal columns):\\n", Q.round(4))
print("R (upper triangular):\\n", R.round(4))
print("Q^T Q =\\n", (Q.T @ Q).round(6))
print("QR = A:", np.allclose(Q @ R, A))

# Least-squares via QR (more stable than normal equations)
b = np.array([1.0, 2.0, 3.0])
# min ||Ax - b||
# QR approach: solve R x = Q^T b
x_qr = np.linalg.solve(R, Q.T @ b)
print(f"\\nLeast-squares solution: {x_qr}")
# Verify with lstsq
x_lstsq, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
print(f"lstsq solution:          {x_lstsq}")
print(f"Match: {np.allclose(x_qr, x_lstsq)}")

# Full QR
Q_full, R_full = np.linalg.qr(A, mode='complete')
print(f"\\nFull Q shape: {Q_full.shape}, R shape: {R_full.shape}")`}
      />
    </div>
  );
}
