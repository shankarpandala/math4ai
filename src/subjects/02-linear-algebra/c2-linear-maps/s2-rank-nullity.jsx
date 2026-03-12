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
// Null space / Column space explorer for a 2x3 matrix
// ---------------------------------------------------------------------------
function RankNullityExplorer() {
  // 2x3 matrix entries
  const [entries, setEntries] = useState([1, 2, 3, 2, 4, 6]);

  // Compute rank via SVD (simulated with a simple approach)
  // Build 2x3 matrix
  const A = [[entries[0], entries[1], entries[2]], [entries[3], entries[4], entries[5]]];

  // Compute rank: try to find linearly independent rows
  // Row reduce to find rank
  function rank2x3(m) {
    const M = m.map(r => [...r]);
    let rank = 0;
    let pivotRow = 0;
    for (let col = 0; col < 3 && pivotRow < 2; col++) {
      let maxRow = -1, maxVal = 0;
      for (let row = pivotRow; row < 2; row++) {
        if (Math.abs(M[row][col]) > maxVal) {
          maxVal = Math.abs(M[row][col]);
          maxRow = row;
        }
      }
      if (maxRow === -1 || maxVal < 1e-10) continue;
      [M[pivotRow], M[maxRow]] = [M[maxRow], M[pivotRow]];
      const piv = M[pivotRow][col];
      for (let c = col; c < 3; c++) M[pivotRow][c] /= piv;
      for (let row = 0; row < 2; row++) {
        if (row !== pivotRow) {
          const factor = M[row][col];
          for (let c = col; c < 3; c++) M[row][c] -= factor * M[pivotRow][c];
        }
      }
      rank++;
      pivotRow++;
    }
    return rank;
  }

  const r = rank2x3(A);
  const nullity = 3 - r; // n - rank

  const update = (idx, val) => {
    const ne = [...entries];
    ne[idx] = val;
    setEntries(ne);
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Rank-Nullity Explorer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Edit the 2×3 matrix <InlineMath math="A" />. The rank (dim of column space) and nullity (dim of null space)
        are displayed. Note: <InlineMath math="\text{rank} + \text{nullity} = 3" /> always.
      </p>

      {/* Matrix input */}
      <div className="mb-4 flex items-center gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Matrix A (2×3)</p>
          <div className="grid grid-cols-3 gap-2">
            {entries.map((val, idx) => (
              <input key={idx} type="number" value={val}
                onChange={e => update(idx, parseFloat(e.target.value) || 0)}
                className="h-10 w-14 rounded-lg border-2 border-gray-300 bg-white text-center text-sm font-mono font-bold text-gray-700 focus:border-indigo-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">n (columns)</p>
          <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">3</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-4 text-center dark:bg-indigo-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">rank(A)</p>
          <p className="mt-2 text-3xl font-bold text-indigo-700 dark:text-indigo-300">{r}</p>
          <p className="mt-1 text-xs text-indigo-500">dim(col space)</p>
        </div>
        <div className="rounded-xl bg-violet-50 p-4 text-center dark:bg-violet-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">nullity(A)</p>
          <p className="mt-2 text-3xl font-bold text-violet-700 dark:text-violet-300">{nullity}</p>
          <p className="mt-1 text-xs text-violet-500">dim(null space)</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-center dark:bg-gray-800">
        <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
          rank + nullity = {r} + {nullity} = <span className="font-bold text-indigo-600">{r + nullity}</span> = n ✓
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Row rank = column rank = {r}.
          {r === 2 ? ' Full row rank: Ax=b always has a solution.' : ''}
          {r === 3 ? ' Full column rank: unique solution if it exists.' : ''}
          {r < 2 && r < 3 ? ' Rank-deficient: some rows/columns are redundant.' : ''}
        </p>
      </div>
    </div>
  );
}

export default function RankNullitySection() {
  return (
    <div className="space-y-8">
      <RankNullityExplorer />

      <DefinitionBlock
        label="Definition 2.2.1"
        title="Fundamental Subspaces"
        definition={
          "For $A \\in \\mathbb{R}^{m \\times n}$, four fundamental subspaces arise: " +
          "(1) Column space (range/image): $\\operatorname{col}(A) = \\{A\\mathbf{x} : \\mathbf{x} \\in \\mathbb{R}^n\\} \\subseteq \\mathbb{R}^m$; " +
          "(2) Null space (kernel): $\\operatorname{null}(A) = \\{\\mathbf{x} \\in \\mathbb{R}^n : A\\mathbf{x} = \\mathbf{0}\\} \\subseteq \\mathbb{R}^n$; " +
          "(3) Row space: $\\operatorname{row}(A) = \\operatorname{col}(A^T) \\subseteq \\mathbb{R}^n$; " +
          "(4) Left null space: $\\operatorname{null}(A^T) \\subseteq \\mathbb{R}^m$."
        }
        notation={
          "$\\operatorname{rank}(A) = \\dim(\\operatorname{col}(A)) = \\dim(\\operatorname{row}(A))$ (row rank = column rank). " +
          "$\\operatorname{nullity}(A) = \\dim(\\operatorname{null}(A))$."
        }
      />

      <DefinitionBlock
        label="Definition 2.2.2"
        title="Rank"
        definition={
          "The rank of $A \\in \\mathbb{R}^{m \\times n}$ is $\\operatorname{rank}(A) = \\dim(\\operatorname{col}(A))$. " +
          "Equivalently, it equals the number of nonzero rows in any row echelon form of $A$, " +
          "or the number of pivot positions in Gaussian elimination. " +
          "$A$ has full column rank if $\\operatorname{rank}(A) = n$; full row rank if $\\operatorname{rank}(A) = m$."
        }
      />

      <TheoremBlock
        label="Theorem 2.2.1"
        title="Rank-Nullity Theorem"
        statement={
          "For any matrix $A \\in \\mathbb{R}^{m \\times n}$: " +
          "$\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$. " +
          "That is, $\\dim(\\operatorname{col}(A)) + \\dim(\\operatorname{null}(A)) = n$ (the number of columns)."
        }
        proof={
          "Let $r = \\operatorname{rank}(A)$ and $p = \\operatorname{nullity}(A)$. " +
          "Row reduce $A$ to echelon form: there are $r$ pivot columns (corresponding to pivot variables) and $p = n - r$ free variables. " +
          "Each free variable yields one vector in a basis for $\\operatorname{null}(A)$ (set one free variable to 1, others to 0 and solve). " +
          "These $p$ vectors are independent (each has a 1 in a different free-variable position), " +
          "and every null space vector is a combination of them. So $\\dim(\\operatorname{null}(A)) = p = n - r$."
        }
        corollaries={[
          "For a square $n \\times n$ matrix: $A$ is invertible iff $\\operatorname{rank}(A) = n$ iff $\\operatorname{null}(A) = \\{\\mathbf{0}\\}$.",
          "The system $A\\mathbf{x} = \\mathbf{b}$ has a solution iff $\\mathbf{b} \\in \\operatorname{col}(A)$ iff $\\operatorname{rank}([A|\\mathbf{b}]) = \\operatorname{rank}(A)$.",
        ]}
      />

      <ExampleBlock
        title="Finding the Null Space"
        difficulty="intermediate"
        problem={
          "Find a basis for the null space of $A = \\begin{bmatrix}1 & 2 & 0 & -1\\\\ 2 & 4 & 1 & 0\\\\ 1 & 2 & 1 & 1\\end{bmatrix}$."
        }
        solution={[
          {
            step: 'Row reduce A to row echelon form',
            formula: '\\begin{bmatrix}1 & 2 & 0 & -1\\\\ 0 & 0 & 1 & 2\\\\ 0 & 0 & 0 & 0\\end{bmatrix}',
          },
          {
            step: 'Pivots in columns 1 and 3; free variables x₂ and x₄',
            explanation: 'rank = 2, nullity = 4 - 2 = 2 (two basis vectors)',
          },
          {
            step: 'Set (x₂,x₄) = (1,0): x₁ = -2, x₃ = 0. Set (x₂,x₄) = (0,1): x₁ = 1, x₃ = -2',
            formula: '\\text{Basis for }\\operatorname{null}(A): \\left\\{\\begin{bmatrix}-2\\\\1\\\\0\\\\0\\end{bmatrix}, \\begin{bmatrix}1\\\\0\\\\-2\\\\1\\end{bmatrix}\\right\\}',
          },
        ]}
      />

      <WarningBlock title="Rank Equals Row Rank = Column Rank">
        <p>
          It is a nontrivial fact that <InlineMath math="\dim(\operatorname{col}(A)) = \dim(\operatorname{row}(A))" />.
          Do not assume that the "number of independent rows" differs from the "number of independent columns".
          They are always equal. However, the row space and column space live in different spaces
          (<InlineMath math="\mathbb{R}^n" /> vs <InlineMath math="\mathbb{R}^m" />) and are generally not
          directly comparable geometrically.
        </p>
      </WarningBlock>

      <PythonCode
        title="Null Space and Column Space with NumPy"
        code={`import numpy as np
from numpy.linalg import svd, matrix_rank

A = np.array([[1, 2, 0, -1],
              [2, 4, 1,  0],
              [1, 2, 1,  1]], dtype=float)

# Rank
r = matrix_rank(A)
n = A.shape[1]
print(f"Shape: {A.shape}")
print(f"Rank = {r}")
print(f"Nullity = {n - r}")
print(f"Rank + Nullity = {r} + {n-r} = {n} = n ✓")

# Null space via SVD: null space = right singular vectors for zero singular values
U, s, Vt = svd(A)
print(f"\\nSingular values: {s.round(4)}")
null_space = Vt[r:].T  # rows of Vt corresponding to near-zero singular values
print(f"Null space basis (columns):\\n{null_space.round(4)}")

# Verify: A @ null_space ≈ 0
print(f"A @ null_space ≈ 0: {np.allclose(A @ null_space, 0)}")

# Column space basis
col_space = U[:, :r]
print(f"\\nColumn space basis (columns of U):\\n{col_space.round(4)}")`}
      />
    </div>
  );
}
