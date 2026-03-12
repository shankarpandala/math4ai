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
// Toeplitz / Circulant matrix pattern display
// ---------------------------------------------------------------------------
const PATTERNS = {
  toeplitz: {
    label: 'Toeplitz',
    desc: 'Constant along diagonals: T[i,j] depends only on i-j',
    gen: (n) => {
      const first_row = Array.from({ length: n }, (_, j) => j + 1);
      const first_col = Array.from({ length: n }, (_, i) => i === 0 ? 1 : n + i);
      return Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
          i <= j ? first_row[j - i] : first_col[i - j]
        )
      );
    },
    colorScale: (v, n) => {
      const maxVal = 2 * n - 1;
      const diag = Math.abs(v <= n ? v - 1 : v - n);
      const t = diag / (n - 1);
      const r = Math.round(99 + (220 - 99) * t);
      const g = Math.round(102 + (38 - 102) * t);
      const b = Math.round(241 + (38 - 241) * t);
      return `rgb(${r},${g},${b})`;
    },
  },
  circulant: {
    label: 'Circulant',
    desc: 'Each row is a cyclic shift of the previous row',
    gen: (n) => {
      const c = Array.from({ length: n }, (_, i) => i + 1);
      return Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => c[(j - i + n) % n])
      );
    },
    colorScale: (v, n) => {
      const t = (v - 1) / (n - 1);
      const r = Math.round(16 + (239 - 16) * (1 - t));
      const g = Math.round(185 + (68 - 185) * (1 - t));
      const b = Math.round(129 + (68 - 129) * (1 - t));
      return `rgb(${r},${g},${b})`;
    },
  },
  sparse: {
    label: 'Sparse (Band)',
    desc: 'Nonzero only on main diagonal and first off-diagonals',
    gen: (n) => {
      return Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => {
          if (i === j) return 3;
          if (Math.abs(i - j) === 1) return 1;
          return 0;
        })
      );
    },
    colorScale: (v) => {
      if (v === 0) return '#f9fafb';
      if (v === 3) return '#4f46e5';
      return '#a5b4fc';
    },
  },
};

function MatrixPatternViz() {
  const [patternKey, setPatternKey] = useState('toeplitz');
  const [n, setN] = useState(6);
  const pattern = PATTERNS[patternKey];
  const matrix = pattern.gen(n);
  const cellSize = Math.min(44, Math.floor(300 / n));
  const svgSize = n * cellSize + 10;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Structured Matrix Pattern Display
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {pattern.desc}. Toggle between matrix types to see their structure.
      </p>
      <div className="mb-4 flex gap-2 flex-wrap">
        {Object.entries(PATTERNS).map(([key, p]) => (
          <button key={key} onClick={() => setPatternKey(key)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${patternKey === key
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
            {p.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">n:</label>
          <input type="range" min={3} max={8} step={1} value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-20 accent-indigo-500" />
          <span className="text-sm font-mono text-indigo-600">{n}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width={svgSize} height={svgSize} className="mx-auto block">
          {matrix.map((row, i) =>
            row.map((v, j) => (
              <g key={`${i}-${j}`}>
                <rect x={j * cellSize + 1} y={i * cellSize + 1}
                  width={cellSize - 2} height={cellSize - 2} rx={2}
                  fill={pattern.colorScale(v, n)} />
                <text x={j * cellSize + cellSize / 2} y={i * cellSize + cellSize / 2 + 4}
                  textAnchor="middle" fontSize={Math.max(9, cellSize / 3.5)} fontWeight="600"
                  fill={v === 0 ? '#9ca3af' : (v > n / 2 ? '#fff' : '#1f2937')}>
                  {v}
                </text>
              </g>
            ))
          )}
        </svg>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        {patternKey === 'toeplitz' && `Toeplitz: defined by ${2*n-1} numbers instead of n²=${n*n}`}
        {patternKey === 'circulant' && `Circulant: diagonalized by DFT; matrix-vector product in O(n log n)`}
        {patternKey === 'sparse' && `Band matrix: nnz = ${n + 2*(n-1)} nonzeros vs n²=${n*n}; O(n) storage`}
      </p>
    </div>
  );
}

const STRUCTURED_CODE = `import numpy as np
from scipy.linalg import toeplitz, circulant, solve_triangular

# ---------------------------------------------------------------------------
# Toeplitz matrix
# ---------------------------------------------------------------------------
c = [4, 1, 0, 0, 0]   # first column
r = [4, 2, 0, 0, 0]   # first row (r[0] == c[0])
T = toeplitz(c, r)
print("Toeplitz matrix:")
print(T)

# Toeplitz matrix-vector product: O(n^2) naive, O(n log n) via FFT embedding
def toeplitz_matvec_fft(c, r, x):
    """
    Compute T @ x where T = toeplitz(c, r) in O(n log n) via circular embedding.
    Embed the Toeplitz matrix in a circulant matrix of size 2n.
    """
    n = len(c)
    # Build circulant vector: [c[0], c[1], ..., c[n-1], 0, r[n-1], ..., r[1]]
    c_circ = np.concatenate([c, [0], r[-1:0:-1]])
    x_pad = np.concatenate([x, np.zeros(n)])
    # Circulant MV = IFFT(FFT(c_circ) * FFT(x_pad))
    result = np.real(np.fft.ifft(np.fft.fft(c_circ) * np.fft.fft(x_pad)))
    return result[:n]

x = np.random.randn(5)
y_naive = T @ x
y_fft = toeplitz_matvec_fft(np.array(c, dtype=float), np.array(r, dtype=float), x)
print("\\nToeplitz MV: naive vs FFT match:", np.allclose(y_naive, y_fft))

# ---------------------------------------------------------------------------
# Circulant matrix: diagonalized by DFT
# ---------------------------------------------------------------------------
c_circ = [3, 1, 0, 0, 1]
C = circulant(c_circ)
print("\\nCirculant matrix:")
print(C)

# Eigenvalues via DFT
eigenvalues = np.fft.fft(c_circ)
print("Eigenvalues (DFT of first column):", eigenvalues.round(2))

# Verification
evals_numpy = np.linalg.eigvals(C)
print("NumPy eigenvalues:", np.sort(np.abs(evals_numpy)).round(2))
print("DFT eigenvalues:  ", np.sort(np.abs(eigenvalues)).round(2))

# ---------------------------------------------------------------------------
# Sparse band matrix: scipy sparse
# ---------------------------------------------------------------------------
from scipy.sparse import diags
from scipy.sparse.linalg import spsolve

n = 1000
# Tridiagonal matrix: 2 on main diagonal, -1 on off-diagonals
diagonals = [2*np.ones(n), -np.ones(n-1), -np.ones(n-1)]
A_sparse = diags(diagonals, [0, -1, 1], format='csr')
b = np.random.randn(n)

# Efficient sparse solve
x_sparse = spsolve(A_sparse, b)
print(f"\\nSparse tridiagonal: nnz={A_sparse.nnz}, n²={n**2:,}")
print(f"Residual: {np.linalg.norm(A_sparse @ x_sparse - b):.2e}")`;

export default function StructuredMatrices() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Structured Matrices
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Toeplitz, circulant, and sparse matrices — exploiting structure for <InlineMath math="O(n \log n)" /> algorithms and efficient computation.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 8.3"
        title="Toeplitz Matrix"
        definition="A Toeplitz matrix $T \in \mathbb{R}^{n \times n}$ has constant entries along each diagonal: $T_{ij} = t_{i-j}$. It is fully defined by its first row and column ($2n-1$ values vs $n^2$ in general). Toeplitz structure arises naturally from convolution (CNN filters), time series (autocorrelation matrices), and 1D signal processing. Matrix-vector products can be computed in $O(n \log n)$ by embedding in a circulant matrix and using the FFT."
        notation="$T = \text{toeplitz}(c, r)$ where $c = (t_0, t_1, \ldots, t_{n-1})$ is the first column and $r = (t_0, t_{-1}, \ldots, t_{-(n-1)})$ is the first row. Symmetric Toeplitz has $c = r$."
      />

      <MatrixPatternViz />

      <DefinitionBlock
        label="Definition 8.4"
        title="Circulant Matrix"
        definition="A circulant matrix $C \in \mathbb{R}^{n \times n}$ has the form where each row is a cyclic shift of the previous: $C_{ij} = c_{(j-i) \bmod n}$. It is fully defined by its first row/column $c \in \mathbb{R}^n$. Circulant matrices are simultaneously diagonalizable by the DFT matrix $F$: $C = F^* \text{diag}(\hat{c}) F$ where $\hat{c} = \text{DFT}(c)$. All circulant matrices share the same eigenvectors (the DFT basis)."
        notation="Circulant matrix-vector product $Cx$ equals circular convolution $c \circledast x$, computable in $O(n \log n)$ via FFT. This connects circulant matrices to CNNs with circular padding."
      />

      <DefinitionBlock
        label="Definition 8.5"
        title="Sparse Matrices"
        definition="A sparse matrix $A \in \mathbb{R}^{m \times n}$ has $\text{nnz}(A) \ll mn$ nonzero entries. Common formats: CSR (Compressed Sparse Row) stores row pointers, column indices, and values in $O(\text{nnz})$ space. Band matrices (like tridiagonal systems from PDEs) have $\text{nnz} = O(n)$ vs $O(n^2)$ for dense. Sparse LU/Cholesky factorizations exploit fill-in patterns to maintain sparsity."
        notation="Sparsity ratio = $1 - \text{nnz}/(mn)$. A matrix with 99% zeros has sparsity 0.99. scipy.sparse supports CSR, CSC, COO formats with efficient sparse BLAS operations."
      />

      <TheoremBlock
        label="Theorem 8.2"
        title="Circulant Diagonalization by DFT"
        statement="Every $n \times n$ circulant matrix $C$ with first column $c$ is diagonalized by the DFT matrix $F$ (where $F_{jk} = e^{-2\pi i jk/n}/\sqrt{n}$): $C = F^* \Lambda F$ where $\Lambda = \text{diag}(\hat{c})$ and $\hat{c} = F c = \text{DFT}(c)$ is the discrete Fourier transform of the first column. Consequently, all circulant matrices commute, and circulant matrix-vector multiplication $Cv = F^*(\hat{c} \odot (Fv))$ requires $O(n \log n)$ using the FFT."
        proof="By direct computation: $(C)_{jk} = c_{(k-j) \bmod n}$. The DFT matrix has $(F)_{jk} = \omega^{jk}/\sqrt{n}$ where $\omega = e^{-2\pi i/n}$. Compute $(F C F^*)_{jl}$: by convolution theorem for cyclic groups, each column of $C$ is a cyclic shift of $c$, and the DFT diagonalizes cyclic shifts. The eigenvalue of the shift-by-1 operator for eigenvector $f_j$ is $\omega^j$, so $C f_j = \hat{c}_j f_j$ where $\hat{c}_j = \sum_k c_k \omega^{-jk}$. $\square$"
        corollaries={[
          "Circulant matrix inverse: $C^{-1}$ is also circulant with DFT eigenvalues $1/\\hat{c}_j$ (when all $\\hat{c}_j \\neq 0$).",
          "Attention with circular positional bias (e.g., some ViT variants) produces circulant attention matrices, enabling $O(n \\log n)$ attention.",
        ]}
      />

      <ExampleBlock
        title="FFT-Based Convolution via Circulant Matrices"
        difficulty="intermediate"
        problem="Express 1D convolution of signal $x = [1, 2, 3, 4]$ with filter $h = [1, -1]$ (zero-padded) as a circulant matrix-vector product and compute it."
        solution={[
          { step: "Build circulant matrix from filter $h$ padded to length 4: $c = [1, -1, 0, 0]$", formula: "C = \\begin{bmatrix}1&0&0&-1\\\\-1&1&0&0\\\\0&-1&1&0\\\\0&0&-1&1\\end{bmatrix}" },
          { step: "Compute $Cx$", formula: "Cx = \\begin{bmatrix}1\\cdot1 + 0\\cdot2 + 0\\cdot3 + (-1)\\cdot4\\\\-1\\cdot1+1\\cdot2+0\\cdot3+0\\cdot4\\\\0+(-1)\\cdot2+1\\cdot3+0\\\\0+0+(-1)\\cdot3+1\\cdot4\\end{bmatrix} = \\begin{bmatrix}-3\\\\1\\\\1\\\\1\\end{bmatrix}", explanation: "This is the circular convolution $x \\circledast h$. The FFT approach: $\\text{IFFT}(\\text{FFT}(c) \\odot \\text{FFT}(x))$ gives the same result in $O(n \\log n)$." },
        ]}
      />

      <WarningBlock title="Structure Exploitation in Practice">
        <ul className="space-y-2 text-sm">
          <li><strong>Dense operations on sparse matrices waste memory.</strong> Converting a sparse matrix to dense before operations negates all sparsity benefits. Use scipy.sparse or PyTorch sparse tensor operations to maintain $O(\text{nnz})$ storage and $O(\text{nnz})$ matrix-vector products.</li>
          <li className="mt-2"><strong>Toeplitz convolution in CNNs.</strong> A CNN convolutional layer with kernel size $k$ on input size $n$ is a sparse Toeplitz matrix multiplication. PyTorch's im2col + GEMM or cuDNN's direct convolution implementations implicitly exploit this structure without explicitly constructing the Toeplitz matrix.</li>
          <li className="mt-2"><strong>FFT for large convolutions.</strong> For large kernels ($k \gtrsim \log n$), FFT-based convolution ($O(n \log n)$) is faster than direct convolution ($O(nk)$). PyTorch uses FFT convolution automatically when the kernel is large enough.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={STRUCTURED_CODE} title="Toeplitz, Circulant, and Sparse Matrices — NumPy/SciPy" runnable />
    </div>
  );
}
