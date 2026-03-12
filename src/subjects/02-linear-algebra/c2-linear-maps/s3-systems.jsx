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
// Gaussian Elimination Step Animator (3x3 system)
// ---------------------------------------------------------------------------
function GaussianEliminationViz() {
  const INITIAL = [
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3],
  ];

  const [currentStep, setCurrentStep] = useState(0);

  // Pre-compute all steps of Gaussian elimination
  const steps = [];

  function fmt(v) { return Number.isInteger(v) ? String(v) : v.toFixed(2); }

  function computeSteps() {
    let M = INITIAL.map(r => [...r]);
    steps.push({ matrix: M.map(r => [...r]), desc: 'Initial augmented matrix [A|b]', pivot: null });

    // Step 1: eliminate column 0, rows 1 and 2
    let factor1 = M[1][0] / M[0][0];
    M[1] = M[1].map((v, j) => v - factor1 * M[0][j]);
    steps.push({
      matrix: M.map(r => [...r]),
      desc: `R₂ ← R₂ - (${fmt(factor1)})·R₁`,
      pivot: [0, 0],
    });

    let factor2 = M[2][0] / M[0][0];
    M[2] = M[2].map((v, j) => v - factor2 * M[0][j]);
    steps.push({
      matrix: M.map(r => [...r]),
      desc: `R₃ ← R₃ - (${fmt(factor2)})·R₁`,
      pivot: [0, 0],
    });

    // Step 2: eliminate column 1, row 2
    let factor3 = M[2][1] / M[1][1];
    M[2] = M[2].map((v, j) => v - factor3 * M[1][j]);
    steps.push({
      matrix: M.map(r => [...r]),
      desc: `R₃ ← R₃ - (${fmt(factor3)})·R₂`,
      pivot: [1, 1],
    });

    // Back substitution
    const x3 = M[2][3] / M[2][2];
    const x2 = (M[1][3] - M[1][2] * x3) / M[1][1];
    const x1 = (M[0][3] - M[0][1] * x2 - M[0][2] * x3) / M[0][0];
    steps.push({
      matrix: M.map(r => [...r]),
      desc: `Back substitution: x₃=${fmt(x3)}, x₂=${fmt(x2)}, x₁=${fmt(x1)}`,
      solution: [x1, x2, x3],
      pivot: null,
    });

    return steps;
  }

  const allSteps = computeSteps();
  const s = allSteps[currentStep];

  const cellClass = (r, c, pivot) => {
    if (!pivot) return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    if (r === pivot[0] && c < 3) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold';
    if (c === pivot[1] && r > pivot[0]) return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Gaussian Elimination Step Animator
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        System: <InlineMath math="2x_1 + x_2 - x_3 = 8,\;" />
        <InlineMath math="-3x_1 - x_2 + 2x_3 = -11,\;" />
        <InlineMath math="-2x_1 + x_2 + 2x_3 = -3" />.
        Step through elimination to see how the augmented matrix transforms.
      </p>

      {/* Step indicator */}
      <div className="mb-3 rounded-lg bg-indigo-50 px-4 py-2 dark:bg-indigo-900/20">
        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
          Step {currentStep}/{allSteps.length - 1}: {s.desc}
        </p>
      </div>

      {/* Augmented matrix display */}
      <div className="mb-4 overflow-x-auto">
        <table className="mx-auto border-collapse">
          <thead>
            <tr>
              {['x₁', 'x₂', 'x₃', '|', 'b'].map((h, i) => (
                <th key={i} className="px-3 py-1 text-xs text-gray-400 dark:text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.matrix.map((row, r) => (
              <tr key={r}>
                {row.map((val, c) => (
                  <React.Fragment key={c}>
                    {c === 3 && (
                      <td className="px-1 py-2 text-center text-gray-400 font-bold">|</td>
                    )}
                    <td className={`px-3 py-2 text-center font-mono text-sm rounded ${cellClass(r, c, s.pivot)}`}>
                      {val.toFixed(1)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {s.solution && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <p className="text-sm font-mono font-bold text-green-700 dark:text-green-300">
            Solution: x₁ = {s.solution[0].toFixed(2)}, x₂ = {s.solution[1].toFixed(2)}, x₃ = {s.solution[2].toFixed(2)}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          ← Prev
        </button>
        <button onClick={() => setCurrentStep(s => Math.min(allSteps.length - 1, s + 1))}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">
          Next →
        </button>
        <div className="ml-auto flex gap-1">
          {allSteps.map((_, i) => (
            <button key={i} onClick={() => setCurrentStep(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === currentStep ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SystemsSection() {
  return (
    <div className="space-y-8">
      <GaussianEliminationViz />

      <DefinitionBlock
        label="Definition 2.3.1"
        title="System of Linear Equations"
        definition={
          "A system of $m$ linear equations in $n$ unknowns has the form $A\\mathbf{x} = \\mathbf{b}$, " +
          "where $A \\in \\mathbb{R}^{m \\times n}$, $\\mathbf{x} \\in \\mathbb{R}^n$, $\\mathbf{b} \\in \\mathbb{R}^m$. " +
          "The augmented matrix $[A | \\mathbf{b}]$ encodes the system compactly. " +
          "Solutions may be: unique (consistent, rank $n$), infinitely many (underdetermined), or none (inconsistent)."
        }
        notation={
          "Row operations: (R1) swap two rows; (R2) multiply a row by nonzero scalar; (R3) add a multiple of one row to another. " +
          "These preserve the solution set and yield an equivalent system."
        }
      />

      <DefinitionBlock
        label="Definition 2.3.2"
        title="Row Echelon Form"
        definition={
          "A matrix is in row echelon form (REF) if: " +
          "(1) all zero rows are below all nonzero rows; " +
          "(2) the leading entry (pivot) of each nonzero row is strictly to the right of pivots in rows above. " +
          "It is in reduced row echelon form (RREF) if additionally each pivot is 1 and is the only nonzero entry in its column."
        }
      />

      <TheoremBlock
        label="Theorem 2.3.1"
        title="Consistency Criterion (Rouché-Capelli)"
        statement={
          "The system $A\\mathbf{x} = \\mathbf{b}$ is consistent (has at least one solution) if and only if " +
          "$\\operatorname{rank}(A) = \\operatorname{rank}([A|\\mathbf{b}])$. " +
          "When consistent: if $\\operatorname{rank}(A) = n$, the solution is unique; " +
          "if $\\operatorname{rank}(A) < n$, there are infinitely many solutions parametrized by $n - \\operatorname{rank}(A)$ free variables."
        }
        proof={
          "The system $A\\mathbf{x} = \\mathbf{b}$ has a solution iff $\\mathbf{b} \\in \\operatorname{col}(A)$. " +
          "Adding $\\mathbf{b}$ as a column to $A$ increases the rank iff $\\mathbf{b} \\notin \\operatorname{col}(A)$. " +
          "So the system is consistent iff $\\operatorname{rank}([A|\\mathbf{b}]) = \\operatorname{rank}(A)$. " +
          "If consistent, the general solution is $\\mathbf{x}_p + \\operatorname{null}(A)$ where $\\mathbf{x}_p$ is any particular solution. " +
          "The null space has dimension $n - \\operatorname{rank}(A)$ by the rank-nullity theorem."
        }
      />

      <ExampleBlock
        title="Gaussian Elimination — Complete Example"
        difficulty="beginner"
        problem={
          "Solve the system: $2x_1 + x_2 - x_3 = 8$, $-3x_1 - x_2 + 2x_3 = -11$, $-2x_1 + x_2 + 2x_3 = -3$."
        }
        solution={[
          {
            step: 'Eliminate x₁ from rows 2 and 3',
            formula: '\\begin{bmatrix}2 & 1 & -1 & 8\\\\ 0 & 0.5 & 0.5 & 1\\\\ 0 & 2 & 1 & 5\\end{bmatrix}',
          },
          {
            step: 'Eliminate x₂ from row 3 (R₃ ← R₃ - 4·R₂)',
            formula: '\\begin{bmatrix}2 & 1 & -1 & 8\\\\ 0 & 0.5 & 0.5 & 1\\\\ 0 & 0 & -1 & 1\\end{bmatrix}',
          },
          {
            step: 'Back-substitute: x₃ = -1, x₂ = (1 - 0.5·(-1))/0.5 = 3, x₁ = (8 - 1·3 - (-1)·(-1))/2 = 2',
            formula: 'x_1 = 2,\\quad x_2 = 3,\\quad x_3 = -1',
          },
        ]}
      />

      <NoteBlock type="tip" title="Pivoting for Numerical Stability">
        <p>
          In floating-point arithmetic, always swap rows to put the largest absolute value in the
          pivot position (<em>partial pivoting</em>). This avoids division by small numbers that
          amplify rounding errors. NumPy's <code>np.linalg.solve</code> uses LU decomposition with
          partial pivoting automatically.
        </p>
      </NoteBlock>

      <WarningBlock title="Overdetermined vs. Underdetermined Systems">
        <p>
          An overdetermined system (more equations than unknowns, <InlineMath math="m > n" />) is
          generally inconsistent. The least-squares solution <InlineMath math="\mathbf{x}^* = (A^TA)^{-1}A^T\mathbf{b}" />
          minimizes <InlineMath math="\|A\mathbf{x} - \mathbf{b}\|^2" />. An underdetermined system
          (<InlineMath math="m < n" />) has infinitely many solutions if consistent; the minimum-norm
          solution uses the pseudoinverse.
        </p>
      </WarningBlock>

      <PythonCode
        title="Solving Linear Systems with NumPy"
        code={`import numpy as np

A = np.array([[ 2,  1, -1],
              [-3, -1,  2],
              [-2,  1,  2]], dtype=float)
b = np.array([8, -11, -3], dtype=float)

# Direct solve (LU with pivoting internally)
x = np.linalg.solve(A, b)
print("Solution:", x)
print("Verify Ax =", A @ x, "(should be", b, ")")

# Check consistency via ranks
Ab = np.column_stack([A, b])
print(f"rank(A) = {np.linalg.matrix_rank(A)}")
print(f"rank([A|b]) = {np.linalg.matrix_rank(Ab)}")
print(f"Consistent: {np.linalg.matrix_rank(A) == np.linalg.matrix_rank(Ab)}")

# Least squares for overdetermined system
A_over = np.array([[1, 1], [2, 1], [3, 1]], dtype=float)
b_over = np.array([2.0, 3.5, 5.5])
x_ls, _, _, _ = np.linalg.lstsq(A_over, b_over, rcond=None)
print(f"\\nLeast-squares solution: {x_ls}")
print(f"Residual: {np.linalg.norm(A_over @ x_ls - b_over):.4f}")`}
      />
    </div>
  );
}
