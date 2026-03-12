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
// Determinant Calculator with Cofactor Expansion Tree
// ---------------------------------------------------------------------------
function DeterminantCalc() {
  const [size, setSize] = useState(2);
  const [entries2, setEntries2] = useState([3, 1, 2, 4]);
  const [entries3, setEntries3] = useState([1, 2, 3, 4, 5, 6, 7, 8, 10]);
  const [expandRow, setExpandRow] = useState(0);

  const entries = size === 2 ? entries2 : entries3;
  const setEntries = size === 2 ? setEntries2 : setEntries3;

  const update = (idx, val) => {
    const ne = [...entries];
    ne[idx] = val;
    setEntries(ne);
  };

  const getA = () => {
    if (size === 2) {
      return [[entries[0], entries[1]], [entries[2], entries[3]]];
    }
    return [
      [entries[0], entries[1], entries[2]],
      [entries[3], entries[4], entries[5]],
      [entries[6], entries[7], entries[8]],
    ];
  };

  const det2 = (a, b, c, d) => a * d - b * c;

  const det3 = (M) => {
    const [r0, r1, r2] = M;
    return (
      r0[0] * det2(r1[1], r1[2], r2[1], r2[2]) -
      r0[1] * det2(r1[0], r1[2], r2[0], r2[2]) +
      r0[2] * det2(r1[0], r1[1], r2[0], r2[1])
    );
  };

  const A = getA();
  const determinant = size === 2 ? det2(A[0][0], A[0][1], A[1][0], A[1][1]) : det3(A);

  // Build cofactor expansion display for 3x3
  const minorMatrix = (M, row, col) =>
    M.filter((_, r) => r !== row).map(r => r.filter((_, c) => c !== col));

  const cofactors = size === 3 ? A[expandRow].map((val, j) => {
    const minor = minorMatrix(A, expandRow, j);
    const minorDet = det2(minor[0][0], minor[0][1], minor[1][0], minor[1][1]);
    const sign = (expandRow + j) % 2 === 0 ? 1 : -1;
    return { val, sign, minorDet, cofactor: sign * minorDet };
  }) : null;

  const fmt = v => Number.isInteger(v) ? String(v) : v.toFixed(2);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Determinant Calculator with Cofactor Expansion
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Edit entries and see the cofactor expansion.
      </p>

      <div className="mb-4 flex gap-3">
        {[2, 3].map(n => (
          <button key={n} onClick={() => setSize(n)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              size === n ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}>
            {n}×{n}
          </button>
        ))}
      </div>

      {/* Matrix input */}
      <div className="mb-4">
        <div className={`inline-grid gap-2`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {entries.map((val, idx) => (
            <input key={idx} type="number" value={val}
              onChange={e => update(idx, parseFloat(e.target.value) || 0)}
              className="h-10 w-14 rounded-lg border-2 border-gray-300 bg-white text-center text-sm font-mono font-bold text-gray-700 focus:border-indigo-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="mb-4 flex items-center gap-4">
        <div className={`rounded-xl px-6 py-4 text-center ${
          Math.abs(determinant) < 0.001
            ? 'bg-red-50 dark:bg-red-900/20'
            : 'bg-green-50 dark:bg-green-900/20'
        }`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">det(A)</p>
          <p className={`mt-1 text-3xl font-bold ${
            Math.abs(determinant) < 0.001 ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'
          }`}>{fmt(determinant)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {Math.abs(determinant) < 0.001 ? 'Singular (not invertible)' : 'Invertible'}
          </p>
        </div>
      </div>

      {/* Cofactor expansion for 3x3 */}
      {size === 3 && (
        <div>
          <div className="mb-2 flex items-center gap-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Expand along row:</p>
            {[0, 1, 2].map(r => (
              <button key={r} onClick={() => setExpandRow(r)}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  expandRow === r ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                R{r+1}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {cofactors.map(({ val, sign, minorDet, cofactor }, j) => (
              <div key={j} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                <span className="text-gray-400">{j > 0 ? '+' : ' '}</span>
                <span className="font-mono">
                  ({sign > 0 ? '+' : '−'}) · {fmt(val)} · M<sub>{expandRow+1}{j+1}</sub>
                  = {sign > 0 ? '' : '−'}{fmt(val)} · {fmt(minorDet)}
                  = <strong className="text-indigo-600 dark:text-indigo-400">{fmt(val * cofactor)}</strong>
                </span>
              </div>
            ))}
            <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm dark:bg-indigo-900/20">
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                det = {cofactors.map((c, j) => `${fmt(A[expandRow][j] * c.cofactor)}`).join(' + ')} = {fmt(determinant)}
              </span>
            </div>
          </div>
        </div>
      )}

      {size === 2 && (
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800">
          <p className="font-mono text-gray-700 dark:text-gray-300">
            det = {fmt(A[0][0])}·{fmt(A[1][1])} − {fmt(A[0][1])}·{fmt(A[1][0])} = {fmt(A[0][0]*A[1][1])} − {fmt(A[0][1]*A[1][0])} = <strong className="text-indigo-600 dark:text-indigo-400">{fmt(determinant)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default function DetDefinitionSection() {
  return (
    <div className="space-y-8">
      <DeterminantCalc />

      <DefinitionBlock
        label="Definition 4.1.1"
        title="Determinant"
        definition={
          "The determinant $\\det(A)$ of a square matrix $A \\in \\mathbb{R}^{n \\times n}$ is a scalar " +
          "defined recursively by cofactor expansion along any row $i$: " +
          "$\\det(A) = \\sum_{j=1}^n (-1)^{i+j} a_{ij} M_{ij}$ " +
          "where $M_{ij} = \\det(A_{ij})$ is the minor (determinant of the $(n-1)\\times(n-1)$ submatrix " +
          "obtained by deleting row $i$ and column $j$). The cofactor is $C_{ij} = (-1)^{i+j} M_{ij}$. " +
          "Base case: $\\det([a]) = a$ for a $1\\times 1$ matrix."
        }
        notation={
          "For $2\\times 2$: $\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix} = ad - bc$. " +
          "Also written as $|A|$."
        }
      />

      <DefinitionBlock
        label="Definition 4.1.2"
        title="Key Properties"
        definition={
          "The determinant is the unique function $\\det: \\mathbb{R}^{n\\times n} \\to \\mathbb{R}$ satisfying: " +
          "(P1) Multilinear in rows (linear in each row while others fixed); " +
          "(P2) Alternating: swapping two rows changes sign; " +
          "(P3) Normalised: $\\det(I) = 1$. " +
          "From these: (a) $\\det(AB) = \\det(A)\\det(B)$; (b) $\\det(A^T) = \\det(A)$; " +
          "(c) $A$ is invertible iff $\\det(A) \\neq 0$; (d) $\\det(A^{-1}) = 1/\\det(A)$."
        }
      />

      <TheoremBlock
        label="Theorem 4.1.1"
        title="Multiplicativity of Determinants"
        statement={
          "For $A, B \\in \\mathbb{R}^{n\\times n}$: $\\det(AB) = \\det(A)\\det(B)$. " +
          "Consequently, $\\det(A^k) = \\det(A)^k$ and $\\det(cA) = c^n \\det(A)$."
        }
        proof={
          "If $A$ is singular, then $AB$ is also singular (rank$(AB) \\leq$ rank$(A) < n$), " +
          "so both sides are 0. If $A$ is invertible, use the LU decomposition $A = LU$. " +
          "Since $\\det$ is multilinear alternating with $\\det(I)=1$: $\\det(L) = 1$ (lower triangular, diagonal 1s), " +
          "$\\det(U) = \\prod_i u_{ii}$ (product of diagonal entries). " +
          "The full proof uses the fact that $A \\mapsto \\det(AB)/\\det(B)$ satisfies the same axioms as $\\det(A)$, " +
          "so by uniqueness they are equal."
        }
        corollaries={[
          "A matrix $A$ is invertible iff $\\det(A) \\neq 0$ (equivalently, $A$ has no zero singular values).",
          "The area of the parallelogram spanned by columns of $A \\in \\mathbb{R}^{2\\times 2}$ equals $|\\det(A)|$.",
          "For block triangular matrices: $\\det\\begin{bmatrix}A&B\\\\0&C\\end{bmatrix} = \\det(A)\\det(C)$.",
        ]}
      />

      <ExampleBlock
        title="3×3 Determinant by Cofactor Expansion"
        difficulty="intermediate"
        problem={
          "Compute $\\det\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&10\\end{bmatrix}$ by expanding along row 1."
        }
        solution={[
          {
            step: 'Expand along row 1 with signs (+−+)',
            formula: '\\det(A) = 1\\cdot\\det\\begin{bmatrix}5&6\\\\8&10\\end{bmatrix} - 2\\cdot\\det\\begin{bmatrix}4&6\\\\7&10\\end{bmatrix} + 3\\cdot\\det\\begin{bmatrix}4&5\\\\7&8\\end{bmatrix}',
          },
          {
            step: 'Compute the 2×2 minors',
            formula: '= 1(50-48) - 2(40-42) + 3(32-35) = 2 - 2(-2) + 3(-3) = 2 + 4 - 9 = -3',
          },
        ]}
      />

      <NoteBlock type="intuition" title="Geometric Meaning">
        <p>
          The determinant measures the <em>signed volume scaling factor</em> of the linear map.
          For a <InlineMath math="2\times 2" /> matrix, <InlineMath math="|\det(A)|" /> is the area
          of the parallelogram formed by the column vectors. For <InlineMath math="3\times 3" />,
          it is the volume of the parallelepiped. A negative determinant means the transformation
          includes a reflection (orientation reversal).
        </p>
      </NoteBlock>

      <WarningBlock title="Never Compute Determinants for Large Matrices Directly">
        <p>
          Cofactor expansion has <InlineMath math="O(n!)" /> complexity — completely impractical
          for <InlineMath math="n > 5" />. NumPy uses LU decomposition (<InlineMath math="O(n^3)" />)
          via <code>np.linalg.det</code>. For checking invertibility, prefer checking rank or
          computing the condition number; determinant values can overflow/underflow for large matrices.
        </p>
      </WarningBlock>

      <PythonCode
        title="Computing Determinants with NumPy"
        code={`import numpy as np

# 2x2 example
A2 = np.array([[3, 1], [2, 4]], dtype=float)
print(f"det(2x2) = {np.linalg.det(A2):.4f}")  # 3*4 - 1*2 = 10

# 3x3 example
A3 = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 10]], dtype=float)
print(f"det(3x3) = {np.linalg.det(A3):.4f}")  # should be -3

# Multiplicativity: det(AB) = det(A)*det(B)
B = np.random.randn(3, 3)
print(f"det(A)*det(B) = {np.linalg.det(A3) * np.linalg.det(B):.6f}")
print(f"det(A@B)      = {np.linalg.det(A3 @ B):.6f}")

# Singular matrix
A_sing = np.array([[1, 2], [2, 4]], dtype=float)
print(f"\\nSingular matrix det = {np.linalg.det(A_sing):.6f}")

# Condition number (better than det for invertibility)
cond = np.linalg.cond(A3)
print(f"Condition number: {cond:.4f} (large => near-singular)")

# LU decomposition (how numpy internally computes det)
from scipy import linalg
P, L, U = linalg.lu(A3)
det_via_lu = np.prod(np.diag(U)) * np.linalg.det(P)
print(f"\\ndet via LU diagonal product: {det_via_lu:.4f}")`}
      />
    </div>
  );
}
