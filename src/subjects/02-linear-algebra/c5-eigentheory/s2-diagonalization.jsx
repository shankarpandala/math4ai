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
// Eigendecomposition A = P D P^{-1} interactive visualizer
// ---------------------------------------------------------------------------
function DiagonalizationViz() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const [d, setD] = useState(3);
  const [power, setPower] = useState(1);

  // Eigenvalues of 2x2
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  const isReal = disc >= 0;

  const lam1 = isReal ? (tr + Math.sqrt(disc)) / 2 : null;
  const lam2 = isReal ? (tr - Math.sqrt(disc)) / 2 : null;

  // Eigenvectors
  function eigvec(lam) {
    const rx = a - lam, ry = b;
    if (Math.abs(rx) + Math.abs(ry) > 1e-8) {
      const n = Math.sqrt(rx * rx + ry * ry);
      return [-ry / n, rx / n];
    }
    return [1, 0];
  }

  const v1 = isReal && lam1 !== null ? eigvec(lam1) : null;
  const v2 = isReal && lam2 !== null ? eigvec(lam2) : null;

  // P = [v1 | v2], P^{-1} via 2x2 inverse
  const pdet = v1 && v2 ? v1[0] * v2[1] - v1[1] * v2[0] : 0;
  const isInvertible = isReal && Math.abs(pdet) > 1e-8;

  // A^k via P D^k P^{-1}
  let Ak = null;
  if (isInvertible && v1 && v2 && lam1 !== null && lam2 !== null) {
    const P = [[v1[0], v2[0]], [v1[1], v2[1]]];
    const Pinv = [[v2[1] / pdet, -v2[0] / pdet], [-v1[1] / pdet, v1[0] / pdet]];
    const l1k = Math.pow(lam1, power);
    const l2k = Math.pow(lam2, power);
    // A^k = P * diag(l1^k, l2^k) * P^{-1}
    const PD = [[P[0][0] * l1k, P[0][1] * l2k], [P[1][0] * l1k, P[1][1] * l2k]];
    Ak = [
      [PD[0][0] * Pinv[0][0] + PD[0][1] * Pinv[1][0], PD[0][0] * Pinv[0][1] + PD[0][1] * Pinv[1][1]],
      [PD[1][0] * Pinv[0][0] + PD[1][1] * Pinv[1][0], PD[1][0] * Pinv[0][1] + PD[1][1] * Pinv[1][1]],
    ];
  }

  const fmt = v => isNaN(v) ? '?' : v.toFixed(2);
  const sliderClass = 'w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer';

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Eigendecomposition A = PDP⁻¹ Interactive
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Edit the 2×2 matrix. When diagonalizable (real eigenvalues, independent eigenvectors),
        see <InlineMath math="A = P D P^{-1}" /> and compute <InlineMath math="A^k" /> for any power.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          {/* Matrix sliders */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            {[{l:'a',v:a,s:setA},{l:'b',v:b,s:setB},{l:'c',v:c,s:setC},{l:'d',v:d,s:setD}].map(({l,v,s})=>(
              <div key={l}>
                <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-mono font-semibold">{l}</span>
                  <span>{v.toFixed(1)}</span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={v}
                  onChange={e=>s(parseFloat(e.target.value))} className={sliderClass} />
              </div>
            ))}
          </div>

          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">Power k</span>
              <span>{power}</span>
            </div>
            <input type="range" min="1" max="8" step="1" value={power}
              onChange={e=>setPower(parseInt(e.target.value))} className={sliderClass} />
          </div>

          {!isReal && (
            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              Complex eigenvalues — matrix not diagonalizable over ℝ
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Matrix A */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">Matrix A</p>
            <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
              [[{a}, {b}], [{c}, {d}]]
            </p>
          </div>

          {isReal && lam1 !== null && (
            <>
              <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                <p className="mb-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">Eigenvalues</p>
                <p className="font-mono text-sm text-indigo-700 dark:text-indigo-300">
                  λ₁ = {fmt(lam1)}, λ₂ = {fmt(lam2)}
                </p>
              </div>

              {v1 && v2 && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="mb-1 text-xs font-semibold text-blue-600 dark:text-blue-400">Eigenvectors (columns of P)</p>
                  <p className="font-mono text-xs text-blue-700 dark:text-blue-300">
                    v₁ = ({fmt(v1[0])}, {fmt(v1[1])})
                  </p>
                  <p className="font-mono text-xs text-blue-700 dark:text-blue-300">
                    v₂ = ({fmt(v2[0])}, {fmt(v2[1])})
                  </p>
                </div>
              )}

              {isInvertible && Ak && (
                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <p className="mb-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    A^{power} = PD^{power}P⁻¹
                  </p>
                  <p className="font-mono text-sm text-green-700 dark:text-green-300">
                    [[{fmt(Ak[0][0])}, {fmt(Ak[0][1])}],<br />
                    [{fmt(Ak[1][0])}, {fmt(Ak[1][1])}]]
                  </p>
                </div>
              )}

              {!isInvertible && isReal && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  Repeated eigenvalue with one eigenvector — not diagonalizable (defective)
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiagonalizationSection() {
  return (
    <div className="space-y-8">
      <DiagonalizationViz />

      <DefinitionBlock
        label="Definition 5.2.1"
        title="Diagonalizable Matrix"
        definition={
          "A square matrix $A \\in \\mathbb{R}^{n\\times n}$ is diagonalizable if there exists an " +
          "invertible matrix $P$ and diagonal matrix $D$ such that $A = PDP^{-1}$. " +
          "Equivalently, $A$ has $n$ linearly independent eigenvectors (forming the columns of $P$). " +
          "$D = \\operatorname{diag}(\\lambda_1,\\ldots,\\lambda_n)$ contains the corresponding eigenvalues."
        }
        notation={
          "The columns of $P = [\\mathbf{v}_1 | \\cdots | \\mathbf{v}_n]$ are the eigenvectors. " +
          "The factorization $A = PDP^{-1}$ is the eigendecomposition or spectral decomposition."
        }
      />

      <DefinitionBlock
        label="Definition 5.2.2"
        title="Algebraic vs. Geometric Multiplicity"
        definition={
          "The algebraic multiplicity of eigenvalue $\\lambda_0$ is its multiplicity as a root of $\\det(A - \\lambda I) = 0$. " +
          "The geometric multiplicity is $\\dim(\\ker(A - \\lambda_0 I))$ (dimension of the eigenspace). " +
          "Always: geometric multiplicity $\\leq$ algebraic multiplicity. " +
          "A matrix is diagonalizable iff for every eigenvalue, geometric multiplicity = algebraic multiplicity."
        }
      />

      <TheoremBlock
        label="Theorem 5.2.1"
        title="Diagonalization Theorem"
        statement={
          "A matrix $A \\in \\mathbb{R}^{n\\times n}$ is diagonalizable if and only if it has $n$ linearly " +
          "independent eigenvectors. In particular, if $A$ has $n$ distinct eigenvalues, it is diagonalizable. " +
          "When diagonalizable: $A^k = PD^kP^{-1}$, $e^A = Pe^DP^{-1}$ where $e^D = \\operatorname{diag}(e^{\\lambda_1},\\ldots,e^{\\lambda_n})$."
        }
        proof={
          "($\\Rightarrow$) If $A = PDP^{-1}$, the columns of $P$ are $n$ independent eigenvectors. " +
          "($\\Leftarrow$) Let $\\mathbf{v}_1, \\ldots, \\mathbf{v}_n$ be $n$ independent eigenvectors with eigenvalues $\\lambda_i$. " +
          "Form $P = [\\mathbf{v}_1|\\cdots|\\mathbf{v}_n]$ (invertible since columns independent). " +
          "Then $AP = [A\\mathbf{v}_1|\\cdots|A\\mathbf{v}_n] = [\\lambda_1\\mathbf{v}_1|\\cdots|\\lambda_n\\mathbf{v}_n] = PD$. " +
          "Right-multiplying by $P^{-1}$: $A = PDP^{-1}$. " +
          "For distinct eigenvalues: eigenvectors for distinct eigenvalues are always independent (induction on number of eigenvalues)."
        }
      />

      <ExampleBlock
        title="Diagonalizing a 2×2 Matrix"
        difficulty="intermediate"
        problem={
          "Diagonalize $A = \\begin{bmatrix}4 & 1 \\\\ 2 & 3\\end{bmatrix}$ and compute $A^3$."
        }
        solution={[
          {
            step: 'Find eigenvalues: det(A - λI) = (4-λ)(3-λ) - 2 = λ² - 7λ + 10 = 0',
            formula: '\\lambda_1 = 5,\\quad \\lambda_2 = 2',
          },
          {
            step: 'Eigenvectors: λ₁=5 → v₁=(1,1)/√2; λ₂=2 → v₂=(1,-2)/√5',
            formula: 'P = \\begin{bmatrix}1 & 1\\\\1 & -2\\end{bmatrix},\\quad D = \\begin{bmatrix}5 & 0\\\\0 & 2\\end{bmatrix}',
          },
          {
            step: 'Compute A³ = P D³ P⁻¹',
            formula: 'A^3 = P\\begin{bmatrix}125 & 0\\\\0 & 8\\end{bmatrix}P^{-1} = \\begin{bmatrix}82 & 39\\\\78 & 43\\end{bmatrix}',
          },
        ]}
      />

      <WarningBlock title="Not All Matrices Are Diagonalizable">
        <p>
          A matrix with repeated eigenvalues may fail to be diagonalizable. For example,
          <InlineMath math="A = \begin{bmatrix}1&1\\0&1\end{bmatrix}" /> (Jordan block) has
          a double eigenvalue <InlineMath math="\lambda=1" /> but only one eigenvector direction.
          For such <em>defective</em> matrices, use the Jordan normal form.
          Also note: real matrices can have complex eigenvalues and may only be diagonalizable
          over <InlineMath math="\mathbb{C}" />.
        </p>
      </WarningBlock>

      <PythonCode
        title="Eigendecomposition and Matrix Powers"
        code={`import numpy as np

A = np.array([[4, 1], [2, 3]], dtype=float)

# Eigendecomposition
eigenvalues, P = np.linalg.eig(A)
D = np.diag(eigenvalues)
P_inv = np.linalg.inv(P)

print("Eigenvalues:", eigenvalues)
print("P (eigenvectors as columns):\\n", P.round(4))
print("Verify A = P D P^-1:\\n", (P @ D @ P_inv).round(4))

# Matrix power via diagonalization
k = 3
Dk = np.diag(eigenvalues ** k)
Ak = P @ Dk @ P_inv
print(f"\\nA^{k} via diagonalization:\\n", Ak.round(2))

# Verify with direct matrix power
Ak_direct = np.linalg.matrix_power(A.astype(int), k)
print(f"A^{k} direct:\\n", Ak_direct)
print(f"Match: {np.allclose(Ak, Ak_direct)}")

# Matrix exponential e^A = P e^D P^-1
from scipy.linalg import expm
eD = np.diag(np.exp(eigenvalues))
eA_manual = P @ eD @ P_inv
eA_scipy = expm(A)
print(f"\\ne^A match: {np.allclose(eA_manual, eA_scipy)}")`}
      />
    </div>
  );
}
