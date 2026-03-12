import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'

// ---------------------------------------------------------------------------
// Helpers: 3×3 matrix operations in plain JS
// ---------------------------------------------------------------------------
function matMul3(A, B) {
  const C = Array.from({ length: 3 }, () => [0, 0, 0])
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++)
        C[i][j] += A[i][k] * B[k][j]
  return C
}

function identity3() {
  return [[1,0,0],[0,1,0],[0,0,1]]
}

function copyMat(M) {
  return M.map(r => [...r])
}

/**
 * LU decomposition with partial pivoting for a 3×3 matrix.
 * Returns { P, L, U, steps } where P is the permutation matrix,
 * L is lower-triangular, U is upper-triangular.
 */
function luDecompose3(A) {
  const n = 3
  let U = copyMat(A)
  let L = identity3()
  let P = identity3()
  const steps = []

  for (let col = 0; col < n - 1; col++) {
    // Partial pivoting: find row with max |U[row][col]| for row >= col
    let maxVal = Math.abs(U[col][col])
    let pivotRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(U[row][col]) > maxVal) {
        maxVal = Math.abs(U[row][col])
        pivotRow = row
      }
    }

    // Swap rows in U and P; adjust L for already-computed columns
    if (pivotRow !== col) {
      ;[U[col], U[pivotRow]] = [U[pivotRow], U[col]]
      ;[P[col], P[pivotRow]] = [P[pivotRow], P[col]]
      // Swap already-computed L entries (left of diagonal)
      for (let j = 0; j < col; j++) {
        ;[L[col][j], L[pivotRow][j]] = [L[pivotRow][j], L[col][j]]
      }
      steps.push({
        type: 'swap',
        desc: `Swap rows ${col + 1} and ${pivotRow + 1} (partial pivoting, pivot = ${U[col][col].toFixed(3)})`,
        U: copyMat(U),
        L: copyMat(L),
        P: copyMat(P),
      })
    }

    // Elimination
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(U[col][col]) < 1e-14) continue
      const m = U[row][col] / U[col][col]
      L[row][col] = m
      for (let j = col; j < n; j++) {
        U[row][j] -= m * U[col][j]
      }
      steps.push({
        type: 'eliminate',
        desc: `Eliminate R${row + 1} → R${row + 1} − (${m.toFixed(3)}) × R${col + 1}`,
        U: copyMat(U),
        L: copyMat(L),
        P: copyMat(P),
      })
    }
  }

  return { P, L, U, steps }
}

function fmt(v) {
  if (Math.abs(v) < 1e-10) return '0'
  return v.toFixed(3).replace(/\.?0+$/, '')
}

function MatrixTable({ M, label, color = 'indigo' }) {
  const colorMap = {
    indigo: 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/20',
    emerald: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20',
    amber: 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20',
  }
  const headerMap = {
    indigo: 'text-indigo-700 dark:text-indigo-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    amber: 'text-amber-700 dark:text-amber-300',
  }

  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      {label && (
        <div className={`mb-1 text-center text-xs font-bold uppercase tracking-wider ${headerMap[color]}`}>
          {label}
        </div>
      )}
      <table className="mx-auto border-collapse text-sm font-mono">
        <tbody>
          {M.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => (
                <td key={j} className="px-2 py-0.5 text-right text-gray-800 dark:text-gray-200">
                  {fmt(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Interactive LU Factorization Demo
// ---------------------------------------------------------------------------
const DEFAULT_MATRIX = [
  [2, 1, -1],
  [-3, -1, 2],
  [-2, 1, 2],
]

function LUDemo() {
  const [rawValues, setRawValues] = useState(
    DEFAULT_MATRIX.map(r => r.map(v => String(v)))
  )
  const [stepIdx, setStepIdx] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const A = useMemo(() => {
    return rawValues.map(row =>
      row.map(s => { const v = parseFloat(s); return isNaN(v) ? 0 : v })
    )
  }, [rawValues])

  const { P, L, U, steps } = useMemo(() => luDecompose3(A), [A])

  const totalSteps = steps.length
  const clampedStep = Math.min(stepIdx, totalSteps)

  // Current state at clampedStep (0 = initial A, >0 = after step clampedStep-1)
  const currentState = clampedStep === 0
    ? { U: copyMat(A), L: identity3(), P: identity3() }
    : steps[clampedStep - 1]

  function handleCellChange(i, j, val) {
    setRawValues(prev => {
      const next = prev.map(r => [...r])
      next[i][j] = val
      return next
    })
    setStepIdx(0)
  }

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
        Interactive LU Factorization (3×3)
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Edit the matrix entries, then step through the Gaussian elimination process to see
        how <InlineMath math="PA = LU" /> is built. Partial pivoting is applied automatically.
      </p>

      {/* Editable input matrix */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Input Matrix A</p>
        <div className="inline-block rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
          <table className="border-collapse">
            <tbody>
              {rawValues.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="p-1">
                      <input
                        type="number"
                        value={val}
                        onChange={e => handleCellChange(i, j, e.target.value)}
                        className="w-16 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center font-mono text-sm text-gray-800 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setStepIdx(0)}
          disabled={clampedStep === 0}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          Reset
        </button>
        <button
          onClick={() => setStepIdx(s => Math.max(0, s - 1))}
          disabled={clampedStep === 0}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-500">
          Step {clampedStep} / {totalSteps}
        </span>
        <button
          onClick={() => setStepIdx(s => Math.min(totalSteps, s + 1))}
          disabled={clampedStep >= totalSteps}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
        >
          Next →
        </button>
        <button
          onClick={() => setStepIdx(totalSteps)}
          disabled={clampedStep >= totalSteps}
          className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-40 dark:border-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
        >
          Complete
        </button>
      </div>

      {/* Step description */}
      {clampedStep > 0 && steps[clampedStep - 1] && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:border-blue-700/40 dark:bg-blue-900/20 dark:text-blue-300">
          {steps[clampedStep - 1].desc}
        </div>
      )}
      {clampedStep === 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
          Initial matrix. Press "Next" to start elimination.
        </div>
      )}

      {/* Matrices display */}
      <div className="grid grid-cols-3 gap-3">
        <MatrixTable M={currentState.P} label="P (permutation)" color="amber" />
        <MatrixTable M={currentState.L} label="L (lower)" color="emerald" />
        <MatrixTable M={currentState.U} label="U (upper)" color="indigo" />
      </div>

      {/* Verification: show PA = LU at the end */}
      {clampedStep === totalSteps && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          <span className="font-semibold">Factorization complete.</span>{' '}
          The decomposition <InlineMath math="PA = LU" /> satisfies:{' '}
          <strong>P</strong> encodes row swaps, <strong>L</strong> is unit lower-triangular
          (1s on diagonal), <strong>U</strong> is upper-triangular.
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------
const PYTHON_CODE = `import numpy as np
from scipy import linalg
import time

# ── numpy.linalg.solve (uses LAPACK dgesv — LU with pivoting) ───────────────
A = np.array([[2.,  1., -1.],
              [-3., -1.,  2.],
              [-2.,  1.,  2.]])
b = np.array([8., -11., -3.])

x = np.linalg.solve(A, b)
print(f"Solution x = {x}")           # [2., 3., -1.]
print(f"Residual ||Ax-b|| = {np.linalg.norm(A @ x - b):.2e}")

# ── scipy.linalg.lu — explicit LU factorization ─────────────────────────────
P, L, U = linalg.lu(A)
print(f"\\nP =\\n{P}")
print(f"L =\\n{L.round(4)}")
print(f"U =\\n{U.round(4)}")
# Verify: P @ A == L @ U
print(f"||PA - LU||_F = {np.linalg.norm(P @ A - L @ U):.2e}")

# ── scipy.linalg.cholesky — Cholesky for SPD systems ───────────────────────
# Symmetric positive definite matrix (e.g., XᵀX from regression)
np.random.seed(0)
X = np.random.randn(100, 5)
AtA = X.T @ X           # SPD: covariance-like matrix
Aty = X.T @ np.random.randn(100)

c = linalg.cholesky(AtA, lower=True)  # AtA = L @ L.T
print(f"\\nCholesky factor L (first 3×3 block):\\n{c[:3,:3].round(4)}")

# Solve (XᵀX)β = Xᵀy via forward/back substitution
beta_chol = linalg.cho_solve(linalg.cho_factor(AtA), Aty)
beta_direct = np.linalg.solve(AtA, Aty)
print(f"||β_chol - β_direct|| = {np.linalg.norm(beta_chol - beta_direct):.2e}")

# ── Timing comparison (LU vs Cholesky vs numpy.solve) ───────────────────────
n = 500
A_spd = np.random.randn(n, n)
A_spd = A_spd.T @ A_spd + n * np.eye(n)   # guaranteed SPD
b_big = np.random.randn(n)

t0 = time.perf_counter()
for _ in range(20):
    np.linalg.solve(A_spd, b_big)
t_lu = (time.perf_counter() - t0) / 20

t0 = time.perf_counter()
cf = linalg.cho_factor(A_spd)
for _ in range(20):
    linalg.cho_solve(cf, b_big)
t_chol = (time.perf_counter() - t0) / 20

print(f"\\nTiming for n={n} SPD system:")
print(f"  numpy.linalg.solve (LU):  {t_lu*1e3:.2f} ms")
print(f"  scipy Cholesky (factored): {t_chol*1e3:.2f} ms")

# ── Condition number and numerical stability ─────────────────────────────────
cond = np.linalg.cond(A_spd)
print(f"\\nCondition number κ(A) = {cond:.2f}")
print(f"Digits of precision lost ≈ log10(κ) = {np.log10(cond):.1f}")`

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------
const REFERENCES = [
  {
    type: 'textbook',
    authors: 'Higham, N. J.',
    year: 2002,
    title: 'Accuracy and Stability of Numerical Algorithms (2nd ed.)',
    venue: 'SIAM',
    whyImportant: 'The definitive reference on floating-point stability of LU, Cholesky, and other factorizations. Chapter 9 covers LU, Chapter 10 covers Cholesky.',
  },
  {
    type: 'textbook',
    authors: 'Golub, G. H. & Van Loan, C. F.',
    year: 2013,
    title: 'Matrix Computations (4th ed.)',
    venue: 'Johns Hopkins University Press',
    whyImportant: 'Chapters 3–4 provide the algorithmic details of LU and Cholesky with operation counts and backward error analysis.',
  },
  {
    type: 'foundational',
    authors: 'Gauss, C. F.',
    year: 1809,
    title: 'Theoria Motus Corporum Coelestium',
    venue: 'Hamburg',
    whyImportant: 'Contains the original systematic description of Gaussian elimination for solving normal equations in the context of orbit determination.',
  },
  {
    type: 'foundational',
    authors: 'Cholesky, A.-L.',
    year: 1924,
    title: 'Sur la résolution numérique des systèmes d\'équations linéaires (posthumous, published by Benoit)',
    venue: 'Bulletin géodésique',
    whyImportant: 'The original publication of the Cholesky factorization, developed during geodetic surveying work around 1910.',
  },
  {
    type: 'textbook',
    authors: 'Trefethen, L. N. & Bau, D.',
    year: 1997,
    title: 'Numerical Linear Algebra',
    venue: 'SIAM',
    whyImportant: 'Lectures 20–23 give a concise, rigorous treatment of LU decomposition and its stability via backward error analysis.',
  },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DirectLinearSolvers() {
  return (
    <div className="prose-math mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Direct Linear System Solvers
      </h1>
      <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
        LU and Cholesky factorizations: the workhorses of numerical linear algebra.
      </p>

      {/* Historical context */}
      <NoteBlock type="historical" title="Historical Context">
        <p>
          Gaussian elimination — the foundation of LU decomposition — traces to{' '}
          <strong>Carl Friedrich Gauss</strong>, who described the method systematically in his
          1809 work on orbit determination. The Chinese text <em>The Nine Chapters on the
          Mathematical Art</em> (circa 179 AD) contains equivalent row-reduction methods, likely
          the world's earliest recorded algorithm for linear systems. The LU factorization
          formulation (explicitly splitting into lower and upper triangular factors) was developed
          in the early 20th century. The critical insight of <strong>partial pivoting</strong> for
          numerical stability became clear as computers arrived in the 1940s–50s. The{' '}
          <strong>Cholesky factorization</strong>, discovered by French military officer
          André-Louis Cholesky around 1910 and published posthumously in 1924, exploits
          symmetry to halve the work and storage for positive definite systems.
        </p>
      </NoteBlock>

      <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        Solving linear systems <InlineMath math="A\mathbf{x} = \mathbf{b}" /> is the most
        fundamental computation in numerical analysis and machine learning. Training linear
        models, computing normal equations for least squares, performing Gaussian process
        inference, and many Newton-method steps all reduce to solving such systems. Direct
        solvers compute an exact factorization in <InlineMath math="O(n^3)" /> operations,
        after which back-substitution solves any right-hand side in <InlineMath math="O(n^2)" />.
      </p>

      {/* LU Decomposition definition */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">LU Decomposition</h2>

      <DefinitionBlock
        label="Definition 1.1"
        title="LU Decomposition with Partial Pivoting"
        definition="For a square matrix $A \in \mathbb{R}^{n \times n}$, the LU decomposition with partial pivoting is a factorization $PA = LU$ where: $P \in \mathbb{R}^{n \times n}$ is a permutation matrix (encodes row swaps), $L \in \mathbb{R}^{n \times n}$ is unit lower-triangular ($L_{ii} = 1$, $L_{ij} = 0$ for $j > i$), and $U \in \mathbb{R}^{n \times n}$ is upper-triangular ($U_{ij} = 0$ for $i > j$). Solving $A\mathbf{x} = \mathbf{b}$ then proceeds as: (1) compute $\mathbf{c} = P\mathbf{b}$, (2) solve $L\mathbf{y} = \mathbf{c}$ by forward substitution in $O(n^2)$, (3) solve $U\mathbf{x} = \mathbf{y}$ by back substitution in $O(n^2)$."
        notation="The multipliers $m_{ij} = A_{ij}/A_{jj}$ used during elimination become the entries $L_{ij}$ below the diagonal. Partial pivoting chooses the largest-magnitude entry in each column as the pivot to control growth of $L$ entries."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Existence of LU Decomposition"
        statement="Every invertible matrix $A \in \mathbb{R}^{n \times n}$ has an LU decomposition with partial pivoting $PA = LU$ where $P$ is a permutation matrix, $L$ is unit lower-triangular, and $U$ is nonsingular upper-triangular. The factorization requires $\frac{2}{3}n^3 + O(n^2)$ floating-point operations."
        proof="Gaussian elimination with partial pivoting is the constructive proof. At step $k$, select row $r \geq k$ with $|A_{rk}^{(k)}| = \max_{i \geq k} |A_{ik}^{(k)}|$ and swap it with row $k$ (recorded in $P$). Since $A$ is invertible, the pivot is nonzero. Define multipliers $m_{ik} = A_{ik}^{(k)}/A_{kk}^{(k)}$ and subtract $m_{ik}$ times row $k$ from row $i > k$. After $n-1$ steps, the result is $U$. The multipliers $m_{ik}$ form the strictly lower-triangular part of $L$, with ones on the diagonal. By construction $|m_{ij}| \leq 1$ (partial pivoting ensures this), bounding element growth."
        corollaries={[
          'Without pivoting, LU may fail even for nonsingular matrices if a zero pivot is encountered during elimination.',
          'Partial pivoting bounds the growth factor by $2^{n-1}$ in the worst case, but in practice growth is almost always mild.',
          'Complete pivoting (also permuting columns) gives a growth factor of $O(n^{1/4})$ but is rarely needed and is more expensive.',
        ]}
      />

      {/* Interactive demo */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Interactive Demo</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Edit the 3×3 matrix and step through the LU factorization. Each step shows a row swap
        (pivoting) or an elimination step, updating <InlineMath math="P" />, <InlineMath math="L" />,
        and <InlineMath math="U" /> in real time.
      </p>

      <LUDemo />

      {/* Step-by-step example */}
      <ExampleBlock
        title="Step-by-Step LU Factorization of a 3×3 Matrix"
        difficulty="intermediate"
        problem="Compute the LU factorization (with partial pivoting) of $A = \begin{bmatrix} 2 & 1 & -1 \\ -3 & -1 & 2 \\ -2 & 1 & 2 \end{bmatrix}$ and use it to solve $A\mathbf{x} = [8, -11, -3]^T$."
        solution={[
          {
            step: 'Partial pivoting: column 1',
            formula: 'P_1 A = \\begin{bmatrix} -3 & -1 & 2 \\\\ 2 & 1 & -1 \\\\ -2 & 1 & 2 \\end{bmatrix}',
            explanation: 'Largest |entry| in column 1 is |-3|=3 in row 2. Swap rows 1 and 2.',
          },
          {
            step: 'Eliminate entries below pivot in column 1',
            formula: '\\begin{aligned} m_{21} &= 2/(-3) = -2/3 \\\\ m_{31} &= -2/(-3) = 2/3 \\end{aligned}',
          },
          {
            step: 'After column 1 elimination',
            formula: 'U^{(1)} = \\begin{bmatrix} -3 & -1 & 2 \\\\ 0 & 1/3 & 1/3 \\\\ 0 & 1/3 & 10/3 \\end{bmatrix}',
            explanation: 'Row 2 ← Row 2 − (−2/3)·Row 1; Row 3 ← Row 3 − (2/3)·Row 1.',
          },
          {
            step: 'Partial pivoting: column 2 (rows 2–3 already equal, no swap needed)',
            formula: 'U^{(2)} = \\begin{bmatrix} -3 & -1 & 2 \\\\ 0 & 1/3 & 1/3 \\\\ 0 & 0 & 3 \\end{bmatrix}, \\quad m_{32} = 1',
            explanation: 'Row 3 ← Row 3 − 1·Row 2. The upper-triangular factor U is now complete.',
          },
          {
            step: 'Full factorization $PA = LU$',
            formula: 'P = \\begin{bmatrix}0&1&0\\\\1&0&0\\\\0&0&1\\end{bmatrix},\\; L = \\begin{bmatrix}1&0&0\\\\-2/3&1&0\\\\2/3&1&1\\end{bmatrix},\\; U = \\begin{bmatrix}-3&-1&2\\\\0&1/3&1/3\\\\0&0&3\\end{bmatrix}',
          },
          {
            step: 'Solve $L\\mathbf{y} = P\\mathbf{b}$ by forward substitution ($P\\mathbf{b} = [-11, 8, -3]^T$)',
            formula: 'y_1 = -11, \\quad y_2 = 8 + \\tfrac{2}{3}(-11) = \\tfrac{2}{3}, \\quad y_3 = -3 - \\tfrac{2}{3}(-11) - 1(\\tfrac{2}{3}) = 3',
          },
          {
            step: 'Solve $U\\mathbf{x} = \\mathbf{y}$ by back substitution',
            formula: 'x_3 = 1, \\quad x_2 = (2/3 - (1/3)(1))/(1/3) = 1, \\quad x_1 = (-11 - (-1)(1) - 2(1))/(-3) = 2',
            explanation: 'Solution: $\\mathbf{x} = [2, 3, -1]^T$. Verify: $A[2,3,-1]^T = [8,-11,-3]^T$ ✓',
          },
        ]}
      />

      {/* Cholesky decomposition */}
      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Cholesky Decomposition</h2>

      <DefinitionBlock
        label="Definition 1.2"
        title="Cholesky Decomposition"
        definition="For a symmetric positive definite (SPD) matrix $A \in \mathbb{R}^{n \times n}$, the Cholesky decomposition is $A = LL^T$ where $L \in \mathbb{R}^{n \times n}$ is lower-triangular with positive diagonal entries. Equivalently, $A = R^T R$ where $R = L^T$ is upper-triangular (the form returned by many software implementations). The factorization requires $\frac{1}{3}n^3 + O(n^2)$ operations — exactly half the cost of LU."
        notation="Positive definiteness of $A$ means $\mathbf{x}^T A \mathbf{x} > 0$ for all nonzero $\mathbf{x} \in \mathbb{R}^n$, equivalently all eigenvalues are positive. A Gram matrix $X^TX$ is always positive semidefinite; it is positive definite iff $X$ has full column rank."
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Cholesky Decomposition Existence and Uniqueness"
        statement="A symmetric matrix $A \in \mathbb{R}^{n \times n}$ admits a Cholesky decomposition $A = LL^T$ with $L_{ii} > 0$ if and only if $A$ is positive definite. The factorization is unique under the constraint that diagonal entries of $L$ are positive."
        proof="($\Rightarrow$) If $A = LL^T$ with $L_{ii} > 0$, then for any nonzero $\mathbf{x}$: $\mathbf{x}^T A \mathbf{x} = \mathbf{x}^T L L^T \mathbf{x} = \|L^T\mathbf{x}\|^2 \geq 0$, with equality iff $L^T\mathbf{x} = 0$, which requires $\mathbf{x} = 0$ since $L$ is invertible (positive diagonal means $\det(L) = \prod L_{ii} > 0$). ($\Leftarrow$) Induction on $n$. Write $A = \begin{bmatrix} a & \mathbf{b}^T \\ \mathbf{b} & C \end{bmatrix}$. Since $A$ is PD, $a > 0$. Set $\ell_{11} = \sqrt{a}$, $\mathbf{l} = \mathbf{b}/\ell_{11}$, and note $C - \mathbf{l}\mathbf{l}^T$ is PD (it is the Schur complement of $a$ in $A$). By induction, $C - \mathbf{l}\mathbf{l}^T = \tilde{L}\tilde{L}^T$. Then $L = \begin{bmatrix}\ell_{11} & \mathbf{0}^T \\ \mathbf{l} & \tilde{L}\end{bmatrix}$ satisfies $LL^T = A$."
        corollaries={[
          'Attempting Cholesky on a non-PD matrix will encounter a negative number under a square root — this is the standard numerical test for positive definiteness.',
          'For a positive semidefinite matrix (singular), modified Cholesky with pivoting can still be applied.',
          'Cholesky avoids partial pivoting entirely because PD matrices are naturally well-conditioned for elimination.',
        ]}
      />

      {/* Cholesky application example */}
      <ExampleBlock
        title="Cholesky for Normal Equations in Linear Regression"
        difficulty="intermediate"
        problem="In ordinary least squares regression, the coefficient vector $\hat{\boldsymbol{\beta}}$ solves the normal equations $(X^TX)\hat{\boldsymbol{\beta}} = X^T\mathbf{y}$. Show how Cholesky factorization solves this efficiently, and why it is preferred over inverting $X^TX$ directly."
        solution={[
          {
            step: 'Form the Gram matrix and right-hand side',
            formula: 'A = X^TX \\in \\mathbb{R}^{p \\times p}, \\quad \\mathbf{c} = X^T\\mathbf{y} \\in \\mathbb{R}^p',
            explanation: 'The matrix $A = X^TX$ is always symmetric positive semidefinite (PD if $X$ has full column rank $p$). Cost: $O(np^2)$ to form $A$.',
          },
          {
            step: 'Cholesky factorization $A = LL^T$',
            formula: 'L = \\mathrm{cholesky}(X^TX) \\in \\mathbb{R}^{p \\times p}',
            explanation: 'Factorization costs $O(p^3/3)$ — half the cost of general LU. This is efficient when $p \\ll n$.',
          },
          {
            step: 'Forward substitution: solve $L\\mathbf{v} = \\mathbf{c}$',
            formula: 'v_i = \\frac{c_i - \\sum_{j < i} L_{ij} v_j}{L_{ii}}, \\quad i = 1, \\ldots, p',
          },
          {
            step: 'Back substitution: solve $L^T\\hat{\\boldsymbol{\\beta}} = \\mathbf{v}$',
            formula: '\\hat{\\beta}_i = \\frac{v_i - \\sum_{j > i} L_{ji} \\hat{\\beta}_j}{L_{ii}}, \\quad i = p, \\ldots, 1',
            explanation: 'Total solve cost: $O(p^2)$ per right-hand side. For multiple response vectors $Y \\in \\mathbb{R}^{n \\times q}$, the factorization is computed once and reused for all $q$ columns.',
          },
          {
            step: 'Why not invert $X^TX$?',
            formula: '\\hat{\\boldsymbol{\\beta}} = (X^TX)^{-1}X^T\\mathbf{y}',
            explanation: 'Computing $(X^TX)^{-1}$ explicitly is numerically unstable (squares the condition number) and costs $O(p^3)$ — the same as factorization but with worse stability. Always prefer solving the system over explicit matrix inversion.',
          },
        ]}
      />

      {/* Warning block */}
      <WarningBlock title="Numerical Stability and Condition Numbers">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">1. Partial pivoting is essential for LU</p>
            <p className="mt-1">
              Without partial pivoting, LU decomposition fails on singular matrices and produces
              catastrophically wrong answers on nearly-singular ones. Consider{' '}
              <InlineMath math="A = \begin{bmatrix}\epsilon & 1 \\ 1 & 1\end{bmatrix}" /> with tiny{' '}
              <InlineMath math="\epsilon" />: without pivoting, the multiplier is{' '}
              <InlineMath math="1/\epsilon \to \infty" />, corrupting the result. With partial
              pivoting, we swap rows first and get a multiplier of <InlineMath math="\epsilon" />.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">2. Condition number governs accuracy loss</p>
            <p className="mt-1">
              The relative error in the solution satisfies{' '}
              <InlineMath math="\|\delta\mathbf{x}\|/\|\mathbf{x}\| \lesssim \kappa(A) \cdot \epsilon_{\mathrm{machine}}" />
              {' '}where <InlineMath math="\kappa(A) = \|A\|\|A^{-1}\| = \sigma_{\max}/\sigma_{\min}" />.
              With double precision (<InlineMath math="\epsilon_{\mathrm{mach}} \approx 10^{-16}" />),
              a condition number of <InlineMath math="10^{12}" /> means only ~4 significant digits
              are reliable. Use <code>np.linalg.cond(A)</code> to diagnose.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">3. Never invert a matrix explicitly</p>
            <p className="mt-1">
              Computing <code>np.linalg.inv(A) @ b</code> is both slower and less accurate than
              <code>np.linalg.solve(A, b)</code>. The condition number of the problem is{' '}
              <InlineMath math="\kappa(A)" />, but inversion squares errors. Always use
              <code>solve</code>, <code>lstsq</code>, or a dedicated factorization.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">4. Cholesky is not for all symmetric matrices</p>
            <p className="mt-1">
              Cholesky requires strict positive definiteness. A matrix from a regression
              with collinear features will be singular (or nearly so): Cholesky will fail
              or produce inaccurate results. Use ridge regularization{' '}
              <InlineMath math="(X^TX + \lambda I)" /> to restore positive definiteness.
              In NumPy: check with <code>np.linalg.eigvalsh(A).min() &gt; 0</code>.
            </p>
          </div>
        </div>
      </WarningBlock>

      {/* Python code */}
      <PythonCode title="LU and Cholesky in NumPy/SciPy with timing" code={PYTHON_CODE} />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  )
}
