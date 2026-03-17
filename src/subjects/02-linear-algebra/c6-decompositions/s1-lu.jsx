import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function LUStepViz() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'Original A', matrix: '\\begin{bmatrix} 2 & 1 & 1 \\\\ 4 & 3 & 3 \\\\ 8 & 7 & 9 \\end{bmatrix}',
      desc: 'Start with the original matrix A.' },
    { label: 'R2 ← R2 − 2R1', matrix: '\\begin{bmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 8 & 7 & 9 \\end{bmatrix}',
      desc: 'Eliminate first column below pivot. Multiplier: l₂₁ = 2.' },
    { label: 'R3 ← R3 − 4R1', matrix: '\\begin{bmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 3 & 5 \\end{bmatrix}',
      desc: 'Continue eliminating first column. Multiplier: l₃₁ = 4.' },
    { label: 'R3 ← R3 − 3R2', matrix: '\\begin{bmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 2 \\end{bmatrix}',
      desc: 'Eliminate second column below pivot. Multiplier: l₃₂ = 3. This is U.' },
  ];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        LU Decomposition Step-by-Step
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Walk through Gaussian elimination to obtain the upper triangular factor U.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              step === i ? 'bg-indigo-600 text-white' : 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}>{s.label}</button>
        ))}
      </div>
      <div className="text-center">
        <BlockMath math={steps[step].matrix} />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{steps[step].desc}</p>
      </div>
      {step === 3 && (
        <div className="mt-4 rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            L stores the multipliers:
          </p>
          <BlockMath math="L = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 4 & 3 & 1 \end{bmatrix}" />
        </div>
      )}
    </div>
  );
}

export default function LUSection() {
  return (
    <div className="space-y-8">
      <LUStepViz />

      <DefinitionBlock
        label="Definition 6.1.1"
        title="LU Decomposition"
        definition={
          "An LU decomposition of a square matrix $A$ is a factorization $A = LU$ where " +
          "$L$ is a lower triangular matrix with ones on the diagonal and $U$ is an upper triangular matrix. " +
          "The entries of $L$ below the diagonal are the multipliers from Gaussian elimination."
        }
        notation="With partial pivoting: $PA = LU$ where $P$ is a permutation matrix."
      />

      <TheoremBlock
        label="Theorem 6.1.1"
        title="Existence of LU Decomposition"
        statement={
          "If all leading principal minors of $A \\in \\mathbb{R}^{n \\times n}$ are nonzero " +
          "(i.e., Gaussian elimination can proceed without row swaps), then $A$ has a unique LU decomposition. " +
          "With partial pivoting, every nonsingular matrix $A$ admits a decomposition $PA = LU$."
        }
        proof={
          "By induction on $n$. For $n=1$, $A = [a_{11}]$ with $L = [1]$, $U = [a_{11}]$. " +
          "For the inductive step, partition $A$ and apply elimination to the first column, " +
          "reducing to a $(n-1) \\times (n-1)$ subproblem. The nonzero minor condition ensures no zero pivots."
        }
      />

      <ExampleBlock
        title="Solving Ax = b via LU"
        difficulty="intermediate"
        problem={
          "Given $A = \\begin{bmatrix} 2 & 1 & 1 \\\\ 4 & 3 & 3 \\\\ 8 & 7 & 9 \\end{bmatrix}$ and $b = \\begin{bmatrix} 1 \\\\ 1 \\\\ 1 \\end{bmatrix}$, solve using LU decomposition."
        }
        solution={[
          { step: 'Forward substitution: Ly = b', formula: 'y = \\begin{bmatrix} 1 \\\\ -1 \\\\ 0 \\end{bmatrix}',
            explanation: 'Solve from top to bottom using the L matrix.' },
          { step: 'Back substitution: Ux = y', formula: 'x = \\begin{bmatrix} 1 \\\\ -1 \\\\ 0 \\end{bmatrix}',
            explanation: 'Solve from bottom to top using the U matrix.' },
        ]}
      />

      <NoteBlock type="ai" title="LU in AI/ML">
        <p>
          LU decomposition is used to solve systems of linear equations efficiently.
          Once <InlineMath math="A = LU" /> is computed in <InlineMath math="O(n^3)" />,
          each new right-hand side <InlineMath math="b" /> requires only <InlineMath math="O(n^2)" /> work.
          This is crucial in least-squares regression, Gaussian processes, and solving
          the normal equations <InlineMath math="A^T A x = A^T b" />.
        </p>
      </NoteBlock>

      <WarningBlock title="Zero Pivots">
        <p>
          LU without pivoting fails when a diagonal entry becomes zero during elimination.
          Always use partial pivoting (<InlineMath math="PA = LU" />) in practice for numerical
          stability. Libraries like NumPy/SciPy use pivoting by default.
        </p>
      </WarningBlock>

      <PythonCode
        title="LU Decomposition with SciPy"
        code={`import numpy as np
from scipy.linalg import lu, lu_factor, lu_solve

# Define matrix
A = np.array([[2, 1, 1],
              [4, 3, 3],
              [8, 7, 9]], dtype=float)
b = np.array([1, 1, 1], dtype=float)

# Compute PA = LU
P, L, U = lu(A)
print("P (permutation):\\n", P)
print("L (lower triangular):\\n", L)
print("U (upper triangular):\\n", U)
print("PA = LU check:", np.allclose(P @ A, L @ U))

# Solve Ax = b using LU
lu_piv, piv = lu_factor(A)
x = lu_solve((lu_piv, piv), b)
print(f"\\nSolution x = {x}")
print(f"Verify Ax = b: {np.allclose(A @ x, b)}")

# Compare cost: direct solve vs LU for multiple RHS
bs = np.random.randn(3, 5)  # 5 different right-hand sides
xs = lu_solve((lu_piv, piv), bs)
print(f"\\nSolved {bs.shape[1]} systems using same LU factorization")
print(f"All correct: {all(np.allclose(A @ xs[:, i], bs[:, i]) for i in range(5))}")`}
      />
    </div>
  );
}
