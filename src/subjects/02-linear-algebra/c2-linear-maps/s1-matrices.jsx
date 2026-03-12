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
// 2x2 Matrix Multiplication Step-by-Step Animator
// ---------------------------------------------------------------------------
function MatMulViz() {
  const [A, setA] = useState([[1, 2], [3, 4]]);
  const [B, setB] = useState([[5, 6], [7, 8]]);
  const [step, setStep] = useState(0); // 0..3 = which entry of C we highlight

  // Compute C = A * B
  const C = [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];

  const i = Math.floor(step / 2);
  const j = step % 2;

  const updateA = (r, c, val) => {
    const nA = A.map(row => [...row]);
    nA[r][c] = val;
    setA(nA);
  };
  const updateB = (r, c, val) => {
    const nB = B.map(row => [...row]);
    nB[r][c] = val;
    setB(nB);
  };

  const Cell = ({ val, highlight, color = '#3b82f6' }) => (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-mono font-bold transition-all"
      style={{
        background: highlight ? `${color}22` : '#f9fafb',
        border: `2px solid ${highlight ? color : '#e5e7eb'}`,
        color: highlight ? color : '#374151',
      }}
    >
      {typeof val === 'number' ? val : val}
    </div>
  );

  const InputCell = ({ val, onChange }) => (
    <input
      type="number"
      value={val}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="h-10 w-10 rounded-lg border-2 border-gray-300 bg-white text-center text-sm font-mono font-bold text-gray-700 focus:border-blue-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
    />
  );

  const dotProduct = `${A[i][0]} × ${B[0][j]} + ${A[i][1]} × ${B[1][j]} = ${C[i][j]}`;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        2×2 Matrix Multiplication Step-by-Step
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Edit matrices A and B, then step through computing each entry of C = A·B.
        The highlighted row of A and column of B combine to give the highlighted entry of C.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-8">
        {/* Matrix A */}
        <div>
          <p className="mb-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400">Matrix A</p>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map(r => [0, 1].map(c => (
              <InputCell key={`a${r}${c}`} val={A[r][c]} onChange={val => updateA(r, c, val)} />
            )))}
          </div>
        </div>

        <div className="text-2xl font-bold text-gray-400">×</div>

        {/* Matrix B */}
        <div>
          <p className="mb-2 text-center text-xs font-semibold text-green-600 dark:text-green-400">Matrix B</p>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map(r => [0, 1].map(c => (
              <InputCell key={`b${r}${c}`} val={B[r][c]} onChange={val => updateB(r, c, val)} />
            )))}
          </div>
        </div>

        <div className="text-2xl font-bold text-gray-400">=</div>

        {/* Result C with highlighting */}
        <div>
          <p className="mb-2 text-center text-xs font-semibold text-red-600 dark:text-red-400">C = A·B</p>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map(r => [0, 1].map(c => (
              <Cell key={`c${r}${c}`} val={C[r][c]}
                highlight={r === i && c === j} color="#ef4444" />
            )))}
          </div>
        </div>
      </div>

      {/* Step explanation */}
      <div className="mb-4 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Step {step + 1}/4 — Entry C[{i+1},{j+1}] = row {i+1} of A · col {j+1} of B
        </p>
        <p className="font-mono text-sm text-red-700 dark:text-red-300">{dotProduct}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Prev
        </button>
        <button
          onClick={() => setStep(s => Math.min(3, s + 1))}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Next →
        </button>
        <div className="flex gap-1 ml-auto">
          {[0, 1, 2, 3].map(s => (
            <button key={s} onClick={() => setStep(s)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${s === step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatricesSection() {
  return (
    <div className="space-y-8">
      <MatMulViz />

      <DefinitionBlock
        label="Definition 2.1.1"
        title="Matrix"
        definition={
          "A matrix $A \\in \\mathbb{R}^{m \\times n}$ is a rectangular array of real numbers with " +
          "$m$ rows and $n$ columns. Entry $A_{ij}$ (or $a_{ij}$) is in row $i$, column $j$. " +
          "We write $A = [a_{ij}]$. The transpose $A^T \\in \\mathbb{R}^{n \\times m}$ has $(A^T)_{ij} = A_{ji}$."
        }
        notation={
          "A matrix represents a linear map $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ via $T(\\mathbf{x}) = A\\mathbf{x}$. " +
          "The $j$-th column of $A$ is $A\\mathbf{e}_j = T(\\mathbf{e}_j)$, the image of the $j$-th standard basis vector."
        }
      />

      <DefinitionBlock
        label="Definition 2.1.2"
        title="Matrix Multiplication"
        definition={
          "If $A \\in \\mathbb{R}^{m \\times k}$ and $B \\in \\mathbb{R}^{k \\times n}$, " +
          "then $C = AB \\in \\mathbb{R}^{m \\times n}$ has entries " +
          "$c_{ij} = \\sum_{l=1}^{k} a_{il} b_{lj}$ (row $i$ of $A$ dotted with column $j$ of $B$). " +
          "This corresponds to composition of linear maps: if $A$ represents $T_1$ and $B$ represents $T_2$, " +
          "then $AB$ represents $T_1 \\circ T_2$."
        }
      />

      <TheoremBlock
        label="Theorem 2.1.1"
        title="Matrix Multiplication is Associative but Not Commutative"
        statement={
          "For compatible matrices $A, B, C$: $(AB)C = A(BC)$ (associativity). " +
          "In general, $AB \\neq BA$ (not commutative). " +
          "Also: $(AB)^T = B^T A^T$, and $(AB)^{-1} = B^{-1} A^{-1}$ when both inverses exist."
        }
        proof={
          "Associativity: $((AB)C)_{ij} = \\sum_l (AB)_{il} c_{lj} = \\sum_l \\sum_k a_{ik} b_{kl} c_{lj} = " +
          "\\sum_k a_{ik} (BC)_{kj} = (A(BC))_{ij}$. " +
          "Non-commutativity: counterexample — $\\begin{bmatrix}1&1\\\\0&0\\end{bmatrix}\\begin{bmatrix}1&0\\\\1&0\\end{bmatrix} = " +
          "\\begin{bmatrix}2&0\\\\0&0\\end{bmatrix}$ but $\\begin{bmatrix}1&0\\\\1&0\\end{bmatrix}\\begin{bmatrix}1&1\\\\0&0\\end{bmatrix} = " +
          "\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$. " +
          "Transpose: $((AB)^T)_{ij} = (AB)_{ji} = \\sum_k a_{jk}b_{ki} = \\sum_k (B^T)_{ik}(A^T)_{kj} = (B^T A^T)_{ij}$."
        }
      />

      <ExampleBlock
        title="Matrix Composition as Geometric Operations"
        difficulty="beginner"
        problem={
          "Compute the product of the 90° rotation matrix $R$ and the horizontal scaling matrix $S$ " +
          "with scale factor 2. What linear transformation does $RS$ represent?"
        }
        solution={[
          {
            step: 'Write out the matrices',
            formula: 'R = \\begin{bmatrix}0 & -1\\\\ 1 & 0\\end{bmatrix}, \\quad S = \\begin{bmatrix}2 & 0\\\\ 0 & 1\\end{bmatrix}',
          },
          {
            step: 'Multiply RS (first scale, then rotate)',
            formula: 'RS = \\begin{bmatrix}0 & -1\\\\1 & 0\\end{bmatrix}\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix} = \\begin{bmatrix}0\\cdot2+(-1)\\cdot0 & 0\\cdot0+(-1)\\cdot1\\\\ 1\\cdot2+0\\cdot0 & 1\\cdot0+0\\cdot1\\end{bmatrix} = \\begin{bmatrix}0 & -1\\\\2 & 0\\end{bmatrix}',
          },
          {
            step: 'Interpret: first scale x by 2, then rotate 90°. Columns show images of e₁, e₂.',
            explanation: 'e₁=(1,0) → scale → (2,0) → rotate → (0,2). Column 1 of RS is (0,2). ✓',
          },
        ]}
      />

      <NoteBlock type="intuition" title="Matrix Columns as Transformed Basis Vectors">
        <p>
          The columns of a matrix product <InlineMath math="AB" /> are exactly where the
          column of <InlineMath math="B" /> gets mapped by <InlineMath math="A" />:
          the <InlineMath math="j" />-th column of <InlineMath math="AB" /> is
          <InlineMath math="A \mathbf{b}_j" />. This "column view" of multiplication is
          often more intuitive than the dot-product entry formula.
        </p>
      </NoteBlock>

      <WarningBlock title="Dimension Compatibility">
        <p>
          Matrix multiplication <InlineMath math="AB" /> requires the number of columns of
          <InlineMath math="A" /> to equal the number of rows of <InlineMath math="B" />.
          If <InlineMath math="A \in \mathbb{R}^{m \times k}" /> and
          <InlineMath math="B \in \mathbb{R}^{k \times n}" />, then
          <InlineMath math="AB \in \mathbb{R}^{m \times n}" />.
          A common mistake: trying to compute <InlineMath math="AB" /> when shapes are
          incompatible. NumPy will raise a <code>ValueError</code>.
        </p>
      </WarningBlock>

      <PythonCode
        title="Matrix Operations with NumPy"
        code={`import numpy as np

A = np.array([[1, 2], [3, 4]], dtype=float)
B = np.array([[5, 6], [7, 8]], dtype=float)

# Matrix multiplication
C = A @ B           # preferred syntax
C_alt = np.dot(A, B)
print("A @ B =\\n", C)

# Transpose
print("A^T =\\n", A.T)

# Properties
print("(AB)^T == B^T A^T:", np.allclose((A@B).T, B.T @ A.T))

# Matrix inverse (for square invertible matrices)
A_inv = np.linalg.inv(A)
print("A^-1 =\\n", A_inv.round(4))
print("A @ A^-1 ≈ I:", np.allclose(A @ A_inv, np.eye(2)))

# Frobenius norm
print(f"||A||_F = {np.linalg.norm(A, 'fro'):.4f}")

# Element-wise vs matrix multiplication
print("Element-wise A*B:\\n", A * B)  # NOT matrix multiply
print("Matrix A@B:\\n", A @ B)`}
      />
    </div>
  );
}
