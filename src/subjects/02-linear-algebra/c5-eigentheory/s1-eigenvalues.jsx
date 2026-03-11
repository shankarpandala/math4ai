import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Mafs, Coordinates, Vector, Text, Point } from 'mafs';
import 'mafs/core.css';

import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';

// ---------------------------------------------------------------------------
// Helper: eigenvalues and eigenvectors of a 2×2 real matrix
// Returns { lam1, lam2, v1, v2, isReal }
// ---------------------------------------------------------------------------
function eigen2x2(a, b, c, d) {
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  if (disc < 0) {
    // Complex eigenvalues — return null eigenvectors
    const re = tr / 2;
    const im = Math.sqrt(-disc) / 2;
    return { lam1: re, lam2: re, im1: im, im2: -im, isReal: false, v1: null, v2: null };
  }
  const lam1 = (tr + Math.sqrt(disc)) / 2;
  const lam2 = (tr - Math.sqrt(disc)) / 2;

  function eigvec(lam) {
    // (A - λI) v = 0 → try row [a-λ, b]
    const row0x = a - lam;
    const row0y = b;
    if (Math.abs(row0x) + Math.abs(row0y) > 1e-10) {
      const norm = Math.sqrt(row0x * row0x + row0y * row0y);
      // null space: [-b, a-λ] / norm (perpendicular to row)
      return [-row0y / norm, row0x / norm];
    }
    return [1, 0];
  }

  return { lam1, lam2, im1: 0, im2: 0, isReal: true, v1: eigvec(lam1), v2: eigvec(lam2) };
}

// ---------------------------------------------------------------------------
// Interactive eigenvalue visualization
// ---------------------------------------------------------------------------
function EigenVisualization() {
  const [a, setA] = useState(2.0);
  const [b, setB] = useState(1.0);
  const [c, setC] = useState(1.0);
  const [d, setD] = useState(2.0);

  const eigen = useMemo(() => eigen2x2(a, b, c, d), [a, b, c, d]);

  // Sample directions to show how A acts
  const sampleAngles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => (Math.PI * i) / 8);
  }, []);

  const sliderClass = 'w-full h-1.5 rounded-full accent-violet-500 cursor-pointer';

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100">
        Interactive Eigenvector Visualization
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust the 2×2 matrix entries. Gray vectors show <InlineMath math="\mathbf{v}" /> (unit),
        blue vectors show <InlineMath math="A\mathbf{v}" />. Eigenvectors (red/orange) are the{' '}
        <em>special directions</em> where <InlineMath math="A\mathbf{v} \parallel \mathbf{v}" />.
      </p>

      {/* Matrix and eigenvalue display */}
      <div className="mb-4 flex flex-wrap items-start gap-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <BlockMath math={`A = \\begin{bmatrix} ${a.toFixed(2)} & ${b.toFixed(2)} \\\\ ${c.toFixed(2)} & ${d.toFixed(2)} \\end{bmatrix}`} />
        </div>
        <div className="mt-1 space-y-2 text-sm">
          {eigen.isReal ? (
            <>
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="font-mono text-red-700 dark:text-red-300">
                  λ₁ = {eigen.lam1.toFixed(3)}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-900/20">
                <span className="h-3 w-3 rounded-full bg-orange-400" />
                <span className="font-mono text-orange-700 dark:text-orange-300">
                  λ₂ = {eigen.lam2.toFixed(3)}
                </span>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Complex eigenvalues:{' '}
                <InlineMath math={`${eigen.lam1.toFixed(2)} \\pm ${eigen.im1.toFixed(2)}i`} />
              </span>
            </div>
          )}
          <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
            trace = {(a + d).toFixed(2)}, det = {(a * d - b * c).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {[
          { label: 'a', val: a, set: setA },
          { label: 'b', val: b, set: setB },
          { label: 'c', val: c, set: setC },
          { label: 'd', val: d, set: setD },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">{label}</span>
              <span>{val.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.05"
              value={val}
              onChange={(e) => set(parseFloat(e.target.value))}
              className={sliderClass}
            />
          </div>
        ))}
      </div>

      {/* Mafs canvas */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <Mafs height={320} viewBox={{ x: [-5, 5], y: [-5, 5] }}>
          <Coordinates.Cartesian />

          {/* Sample vectors v and Av */}
          {sampleAngles.map((theta, i) => {
            const vx = Math.cos(theta);
            const vy = Math.sin(theta);
            const Avx = a * vx + b * vy;
            const Avy = c * vx + d * vy;
            return (
              <React.Fragment key={i}>
                <Vector tail={[0, 0]} tip={[vx, vy]} color="#9ca3af" opacity={0.5} weight={1} />
                <Vector tail={[0, 0]} tip={[Avx, Avy]} color="#818cf8" opacity={0.6} weight={1.5} />
              </React.Fragment>
            );
          })}

          {/* Eigenvectors (if real) */}
          {eigen.isReal && eigen.v1 && (
            <>
              {/* Eigenvector 1 scaled by eigenvalue */}
              <Vector
                tail={[0, 0]}
                tip={[eigen.v1[0], eigen.v1[1]]}
                color="#ef4444"
                weight={3}
              />
              <Vector
                tail={[0, 0]}
                tip={[eigen.lam1 * eigen.v1[0], eigen.lam1 * eigen.v1[1]]}
                color="#ef4444"
                weight={2}
                opacity={0.5}
              />
              <Text
                x={eigen.v1[0] * 1.2 + 0.1}
                y={eigen.v1[1] * 1.2 + 0.2}
                size={14}
                color="#ef4444"
              >
                {`v₁ (λ=${eigen.lam1.toFixed(1)})`}
              </Text>
            </>
          )}
          {eigen.isReal && eigen.v2 && (
            <>
              <Vector
                tail={[0, 0]}
                tip={[eigen.v2[0], eigen.v2[1]]}
                color="#f97316"
                weight={3}
              />
              <Vector
                tail={[0, 0]}
                tip={[eigen.lam2 * eigen.v2[0], eigen.lam2 * eigen.v2[1]]}
                color="#f97316"
                weight={2}
                opacity={0.5}
              />
              <Text
                x={eigen.v2[0] * 1.2 + 0.1}
                y={eigen.v2[1] * 1.2 + 0.2}
                size={14}
                color="#f97316"
              >
                {`v₂ (λ=${eigen.lam2.toFixed(1)})`}
              </Text>
            </>
          )}
        </Mafs>
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Gray = input direction <InlineMath math="\mathbf{v}" />. Blue = image <InlineMath math="A\mathbf{v}" />.
        Red/orange = eigenvectors (solid = unit, faded = scaled by <InlineMath math="\lambda" />).
        {!eigen.isReal && ' Complex eigenvalues: no real eigenvectors exist for this matrix.'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------
export default function EigenvaluesSection() {
  return (
    <div className="prose-math mx-auto max-w-4xl px-4 py-8">

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Eigenvalues and Eigenvectors
      </h1>
      <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
        The special directions where a linear map acts by pure scaling — and why they govern
        everything from web search to quantum mechanics.
      </p>

      {/* 1. Motivation */}
      <section className="my-8">
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Why Eigenvalues Matter
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          A generic linear map <InlineMath math="A : \mathbb{R}^n \to \mathbb{R}^n" /> rotates,
          shears, and stretches every vector differently. Eigenvectors are the exception: they
          emerge from the map pointing in exactly the same (or exactly opposite) direction —
          only their length changes. This rigidity makes them the natural coordinate system for
          understanding the map's long-run behavior.
        </p>
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              domain: 'Web Search',
              desc: (
                <>
                  <strong>Google PageRank</strong> computes the dominant eigenvector of the{' '}
                  <InlineMath math="n \times n" /> web transition matrix{' '}
                  <InlineMath math="P" />. The stationary distribution{' '}
                  <InlineMath math="\boldsymbol{\pi}" /> satisfying{' '}
                  <InlineMath math="P^T \boldsymbol{\pi} = \boldsymbol{\pi}" /> (eigenvalue 1)
                  ranks all pages simultaneously.
                </>
              ),
            },
            {
              domain: 'Dimensionality Reduction',
              desc: (
                <>
                  <strong>PCA</strong> finds the eigenvectors of the covariance matrix{' '}
                  <InlineMath math="\Sigma = \frac{1}{n} X^T X" />. The eigenvector with the
                  largest eigenvalue points in the direction of greatest variance.
                </>
              ),
            },
            {
              domain: 'Dynamical Systems',
              desc: (
                <>
                  The long-run behavior of <InlineMath math="\mathbf{x}_{t+1} = A \mathbf{x}_t" />{' '}
                  is governed by the dominant eigenvalue: the system is stable iff{' '}
                  <InlineMath math="|\lambda_{\max}| < 1" />.
                </>
              ),
            },
            {
              domain: 'Graph Theory',
              desc: (
                <>
                  <strong>Spectral clustering</strong> uses eigenvectors of the graph Laplacian{' '}
                  <InlineMath math="L = D - W" />. The Fiedler vector (second smallest eigenvector)
                  reveals the optimal graph bipartition.
                </>
              ),
            },
            {
              domain: 'Quantum Mechanics',
              desc: (
                <>
                  Observable quantities correspond to <em>eigenvalues</em> of Hermitian operators.
                  The Schrödinger equation{' '}
                  <InlineMath math="H\psi = E\psi" /> is an eigenvalue problem.
                </>
              ),
            },
            {
              domain: 'Deep Learning',
              desc: (
                <>
                  The <strong>Hessian spectrum</strong> of a neural network loss governs SGD
                  convergence: eigenvalues determine the optimal learning rate and whether a
                  critical point is a minimum, maximum, or saddle.
                </>
              ),
            },
          ].map(({ domain, desc }) => (
            <div
              key={domain}
              className="rounded-xl border border-violet-200 bg-violet-50/40 p-4 dark:border-violet-800/40 dark:bg-violet-950/20"
            >
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                {domain}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Definition */}
      <DefinitionBlock
        label="Definition 5.1.1"
        title="Eigenvalue and Eigenvector"
        definition={
          "Let $A \\in \\mathbb{R}^{n \\times n}$. A scalar $\\lambda \\in \\mathbb{C}$ is an eigenvalue of $A$ if there exists a nonzero vector $\\mathbf{v} \\in \\mathbb{C}^n$ such that $A\\mathbf{v} = \\lambda \\mathbf{v}$. The vector $\\mathbf{v}$ is called an eigenvector associated with $\\lambda$. " +
          "Equivalently, $\\lambda$ is an eigenvalue iff $(A - \\lambda I)$ is singular, i.e., $\\det(A - \\lambda I) = 0$. " +
          "The eigenspace (or $\\lambda$-eigenspace) is $E_\\lambda = \\ker(A - \\lambda I) = \\{\\mathbf{v} : A\\mathbf{v} = \\lambda\\mathbf{v}\\}$."
        }
        notation={
          "The characteristic polynomial is $p(\\lambda) = \\det(\\lambda I - A) \\in \\mathbb{R}[\\lambda]$ of degree $n$. Its roots (in $\\mathbb{C}$) are the eigenvalues. " +
          "The algebraic multiplicity of $\\lambda_0$ is its multiplicity as a root of $p$; the geometric multiplicity is $\\dim(E_{\\lambda_0})$. Always: geometric $\\leq$ algebraic multiplicity."
        }
      />

      {/* 3. Interactive visualization */}
      <EigenVisualization />

      {/* Characteristic polynomial box */}
      <NoteBlock type="intuition" title="Computing Eigenvalues: The Characteristic Polynomial">
        <div className="space-y-3">
          <p>
            For a 2×2 matrix <InlineMath math="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}" />,
            the characteristic polynomial is:
          </p>
          <BlockMath math="p(\lambda) = \det(\lambda I - A) = \lambda^2 - \underbrace{(a+d)}_{\mathrm{tr}(A)}\lambda + \underbrace{(ad - bc)}_{\det(A)}" />
          <p>
            By Vieta's formulas: <InlineMath math="\lambda_1 + \lambda_2 = \mathrm{tr}(A)" /> and{' '}
            <InlineMath math="\lambda_1 \lambda_2 = \det(A)" />. These relations hold for matrices
            of any size: the trace is the sum of all eigenvalues and the determinant is their product.
          </p>
          <BlockMath math="\mathrm{tr}(A) = \sum_{i=1}^n \lambda_i, \qquad \det(A) = \prod_{i=1}^n \lambda_i" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For large matrices, finding eigenvalues by solving <InlineMath math="p(\lambda) = 0" />{' '}
            numerically is unstable. Practical algorithms (QR algorithm, Lanczos, power iteration)
            avoid computing <InlineMath math="p" /> explicitly.
          </p>
        </div>
      </NoteBlock>

      {/* 4. Spectral theorem */}
      <TheoremBlock
        label="Theorem 5.1.1"
        title="Spectral Theorem for Real Symmetric Matrices"
        statement={
          "If $A \\in \\mathbb{R}^{n \\times n}$ is symmetric ($A = A^T$), then: " +
          "(1) all eigenvalues of $A$ are real; " +
          "(2) eigenvectors corresponding to distinct eigenvalues are orthogonal; " +
          "(3) $A$ is orthogonally diagonalizable: $A = Q \\Lambda Q^T$ where $Q$ is orthogonal and $\\Lambda = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)$."
        }
        proof={
          "Part (1): Let $\\lambda \\in \\mathbb{C}$ be an eigenvalue with eigenvector $\\mathbf{v} \\in \\mathbb{C}^n$. " +
          "Compute $\\bar{\\mathbf{v}}^T A \\mathbf{v} = \\lambda \\bar{\\mathbf{v}}^T \\mathbf{v} = \\lambda \\|\\mathbf{v}\\|^2$. " +
          "But also $\\bar{\\mathbf{v}}^T A \\mathbf{v} = \\overline{(A^T \\bar{\\mathbf{v}})^T \\mathbf{v}} = \\bar{\\lambda} \\|\\mathbf{v}\\|^2$ (using $A = A^T$). " +
          "Since $\\|\\mathbf{v}\\|^2 > 0$, we get $\\lambda = \\bar{\\lambda}$, so $\\lambda \\in \\mathbb{R}$. " +
          "Part (2): Let $A\\mathbf{u} = \\lambda \\mathbf{u}$ and $A\\mathbf{v} = \\mu \\mathbf{v}$ with $\\lambda \\neq \\mu$. " +
          "Then $\\lambda (\\mathbf{u}^T \\mathbf{v}) = (A\\mathbf{u})^T \\mathbf{v} = \\mathbf{u}^T A^T \\mathbf{v} = \\mathbf{u}^T A \\mathbf{v} = \\mu (\\mathbf{u}^T \\mathbf{v})$. " +
          "Since $\\lambda \\neq \\mu$ and both are real, $\\mathbf{u}^T \\mathbf{v} = 0$. " +
          "Part (3) follows by induction on $n$: pick a unit eigenvector $\\mathbf{q}_1$, form an orthonormal basis completing it, and show that $A$ restricted to $\\mathbf{q}_1^\\perp$ is again symmetric."
        }
        corollaries={[
          "A real symmetric matrix $A$ is positive semidefinite iff all eigenvalues satisfy $\\lambda_i \\geq 0$.",
          "The spectral decomposition $A = Q\\Lambda Q^T = \\sum_{i=1}^n \\lambda_i \\mathbf{q}_i \\mathbf{q}_i^T$ expresses $A$ as a sum of rank-1 projections.",
          "For symmetric $A$: $\\|A\\|_2 = \\max_i |\\lambda_i|$ and $\\|A\\|_F = \\sqrt{\\sum_i \\lambda_i^2}$.",
        ]}
      />

      {/* Eigendecomposition note */}
      <section className="my-8">
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Eigendecomposition
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          A square matrix <InlineMath math="A \in \mathbb{R}^{n \times n}" /> is{' '}
          <em>diagonalizable</em> if it has <InlineMath math="n" /> linearly independent
          eigenvectors. In that case, forming the matrix{' '}
          <InlineMath math="P = [\mathbf{v}_1 | \cdots | \mathbf{v}_n]" /> of eigenvectors as
          columns:
        </p>
        <BlockMath math="AP = P\Lambda \implies A = P\Lambda P^{-1}" />
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          This factorization enables fast computation of matrix powers:
        </p>
        <BlockMath math="A^k = P \Lambda^k P^{-1} = P \begin{bmatrix} \lambda_1^k & & \\ & \ddots & \\ & & \lambda_n^k \end{bmatrix} P^{-1}" />
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          which has profound consequences for understanding iterated linear dynamical systems,
          Markov chains (PageRank), and recurrence relations.
        </p>
      </section>

      {/* 5. Python code */}
      <PythonCode
        title="Power Iteration & NumPy Eigendecomposition"
        code={`import numpy as np

# ── Power Iteration: find dominant eigenvector ─────────────────────────────
def power_iteration(A, num_iterations=100, tol=1e-10):
    """Find dominant eigenvector and eigenvalue via power iteration."""
    n = A.shape[0]
    b = np.random.rand(n)
    b /= np.linalg.norm(b)

    lam_old = 0.0
    for i in range(num_iterations):
        b_new = A @ b
        lam = np.dot(b, b_new)          # Rayleigh quotient
        b_new /= np.linalg.norm(b_new)  # normalize

        if abs(lam - lam_old) < tol:
            print(f"  Converged at iteration {i+1}")
            break
        lam_old = lam
        b = b_new

    return lam, b

# ── Example: symmetric positive definite matrix ───────────────────────────
A = np.array([[4.0, 1.0, 0.5],
              [1.0, 3.0, 0.8],
              [0.5, 0.8, 2.0]])

print("Power iteration:")
lam_pi, v_pi = power_iteration(A)
print(f"  Dominant eigenvalue (power iter): {lam_pi:.6f}")
print(f"  Dominant eigenvector:             {v_pi}")

# ── NumPy eigendecomposition ──────────────────────────────────────────────
eigenvalues, eigenvectors = np.linalg.eigh(A)  # eigh for symmetric matrices
# eigh returns eigenvalues in ascending order
print("\\nnp.linalg.eigh (ascending order):")
for i, (lam, v) in enumerate(zip(eigenvalues, eigenvectors.T)):
    print(f"  λ_{i+1} = {lam:.6f},  v_{i+1} = {v}")

# Verify: dominant eigenvalue
print(f"\\nDominant eigenvalue (numpy):      {eigenvalues[-1]:.6f}")
print(f"Agreement with power iter:         {abs(lam_pi - eigenvalues[-1]) < 1e-5}")

# ── Spectral decomposition: A = Q Λ Q^T ──────────────────────────────────
Q = eigenvectors
Lambda = np.diag(eigenvalues)
A_reconstructed = Q @ Lambda @ Q.T
print(f"\\n||A - QΛQᵀ||_F = {np.linalg.norm(A - A_reconstructed):.2e}")

# ── Characteristic polynomial (2x2 example) ──────────────────────────────
B = np.array([[3.0, 1.0],
              [1.0, 2.0]])
tr, det = np.trace(B), np.linalg.det(B)
lam1 = (tr + np.sqrt(tr**2 - 4*det)) / 2
lam2 = (tr - np.sqrt(tr**2 - 4*det)) / 2
print(f"\\n2×2 example B: eigenvalues = {lam1:.4f}, {lam2:.4f}")
print(f"  trace(B) = λ₁+λ₂ = {lam1+lam2:.4f} (should be {tr:.4f})")
print(f"  det(B)   = λ₁·λ₂ = {lam1*lam2:.4f} (should be {det:.4f})")`}
      />

      {/* 6. Warning block */}
      <WarningBlock title="Eigenvalue Pitfalls">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              1. Non-symmetric matrices can have complex eigenvalues
            </p>
            <p className="mt-1">
              A real matrix can have complex (non-real) eigenvalues occurring in conjugate pairs.
              For example, the 2D rotation matrix{' '}
              <InlineMath math="R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}" />{' '}
              has eigenvalues <InlineMath math="e^{\pm i\theta}" />. There are no real eigenvectors
              because rotation has no fixed directions (unless <InlineMath math="\theta = 0, \pi" />).
              Always use <code>np.linalg.eig</code> (not <code>eigh</code>) for non-symmetric matrices.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              2. Defective matrices: not all matrices are diagonalizable
            </p>
            <p className="mt-1">
              A matrix is <em>defective</em> if some eigenvalue's geometric multiplicity is
              strictly less than its algebraic multiplicity. Example:{' '}
              <InlineMath math="A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}" /> has a
              double eigenvalue <InlineMath math="\lambda = 1" /> but only one independent
              eigenvector. You cannot form a basis of eigenvectors, so{' '}
              <InlineMath math="A = P\Lambda P^{-1}" /> fails. Use the Jordan normal form instead.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              3. Numerical sensitivity: eigenvalues can be ill-conditioned
            </p>
            <p className="mt-1">
              Small perturbations to a matrix can cause large changes in eigenvalues (Bauer-Fike
              theorem). The Wilkinson matrix is a famous example of catastrophic eigenvalue
              sensitivity. Use <code>np.linalg.eigh</code> for symmetric matrices — it exploits
              symmetry for much better numerical stability than <code>np.linalg.eig</code>.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              4. Eigenvectors are not unique
            </p>
            <p className="mt-1">
              Any nonzero scalar multiple of an eigenvector is also an eigenvector with the same
              eigenvalue. When an eigenvalue has algebraic multiplicity <InlineMath math="\geq 2" />,
              any vector in the eigenspace is an eigenvector. Libraries return normalized
              eigenvectors, but the sign (and orientation for repeated eigenvalues) is arbitrary.
            </p>
          </div>
        </div>
      </WarningBlock>

      {/* Applications: PageRank deep dive */}
      <NoteBlock type="note" title="Deep Dive: PageRank as an Eigenvalue Problem">
        <div className="space-y-3">
          <p>
            Consider a web graph with <InlineMath math="n" /> pages. Define the random surfer
            transition matrix <InlineMath math="P \in \mathbb{R}^{n \times n}" /> where{' '}
            <InlineMath math="P_{ij} = 1/\mathrm{outdeg}(j)" /> if page <InlineMath math="j" />{' '}
            links to page <InlineMath math="i" />, and 0 otherwise (column-stochastic: each
            column sums to 1). The PageRank vector <InlineMath math="\boldsymbol{\pi}" />{' '}
            satisfies the stationary distribution equation:
          </p>
          <BlockMath math="\boldsymbol{\pi} = P \boldsymbol{\pi} \iff P \boldsymbol{\pi} = 1 \cdot \boldsymbol{\pi}" />
          <p>
            This is the eigenvector equation with <InlineMath math="\lambda = 1" />. By the
            Perron-Frobenius theorem, a column-stochastic matrix with positive entries has a
            unique dominant eigenvalue <InlineMath math="\lambda = 1" /> whose eigenvector
            has all positive entries. Google uses the damping factor{' '}
            <InlineMath math="\alpha \approx 0.85" /> to ensure irreducibility:
          </p>
          <BlockMath math="\hat{P} = \alpha P + \frac{1-\alpha}{n} \mathbf{1}\mathbf{1}^T" />
          <p>
            Power iteration converges quickly because{' '}
            <InlineMath math="|\lambda_2(\hat{P})| \leq \alpha < 1" />, guaranteeing geometric
            convergence with rate <InlineMath math="\alpha" />.
          </p>
        </div>
      </NoteBlock>

      {/* Exercises */}
      <ExerciseBlock
        title="Eigenvalue Exercises"
        exercises={[
          {
            id: 'eig-ex-1',
            difficulty: 'beginner',
            question:
              "Find all eigenvalues and eigenvectors of $A = \\begin{bmatrix} 3 & 1 \\\\ 0 & 2 \\end{bmatrix}$. Is $A$ diagonalizable?",
            hint:
              "For upper triangular matrices, the eigenvalues are the diagonal entries. To find eigenvectors, solve $(A - \\lambda I)\\mathbf{v} = 0$ for each $\\lambda$.",
            solution: [
              {
                text: "The characteristic polynomial is $\\det(A - \\lambda I) = (3-\\lambda)(2-\\lambda) = 0$, giving $\\lambda_1 = 3$, $\\lambda_2 = 2$.",
              },
              {
                text: "For $\\lambda_1 = 3$: $(A - 3I)\\mathbf{v} = \\begin{bmatrix}0&1\\\\0&-1\\end{bmatrix}\\mathbf{v} = 0 \\implies \\mathbf{v}_1 = \\begin{bmatrix}1\\\\0\\end{bmatrix}$.",
              },
              {
                text: "For $\\lambda_2 = 2$: $(A - 2I)\\mathbf{v} = \\begin{bmatrix}1&1\\\\0&0\\end{bmatrix}\\mathbf{v} = 0 \\implies \\mathbf{v}_2 = \\begin{bmatrix}-1\\\\1\\end{bmatrix}$.",
              },
              {
                text: "Since both eigenvalues are distinct (hence independent eigenvectors), $A$ is diagonalizable: $A = P\\Lambda P^{-1}$ with $P = \\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}$, $\\Lambda = \\begin{bmatrix}3&0\\\\0&2\\end{bmatrix}$.",
              },
            ],
          },
          {
            id: 'eig-ex-2',
            difficulty: 'intermediate',
            question:
              "Prove that if $\\mathbf{v}$ is an eigenvector of $A$ with eigenvalue $\\lambda$, then $\\mathbf{v}$ is also an eigenvector of $A^k$ for any positive integer $k$, with eigenvalue $\\lambda^k$. Use this to evaluate $A^{100}$ for $A = \\begin{bmatrix} 2 & 0 \\\\ 1 & 3 \\end{bmatrix}$.",
            hint:
              "Apply $A$ repeatedly and use $A\\mathbf{v} = \\lambda\\mathbf{v}$. For $A^{100}$, first diagonalize $A$.",
            solution: [
              {
                text: "By induction: $A^1 \\mathbf{v} = \\lambda \\mathbf{v}$. If $A^k \\mathbf{v} = \\lambda^k \\mathbf{v}$, then $A^{k+1}\\mathbf{v} = A(A^k \\mathbf{v}) = A(\\lambda^k \\mathbf{v}) = \\lambda^k (A\\mathbf{v}) = \\lambda^{k+1}\\mathbf{v}$.",
              },
              {
                formula:
                  "A = \\begin{bmatrix} 2 & 0 \\\\ 1 & 3 \\end{bmatrix}, \\quad \\lambda_1 = 2,\\; \\mathbf{v}_1 = \\begin{bmatrix}1\\\\-1\\end{bmatrix},\\quad \\lambda_2 = 3,\\; \\mathbf{v}_2 = \\begin{bmatrix}0\\\\1\\end{bmatrix}",
              },
              {
                formula:
                  "A^{100} = P \\begin{bmatrix} 2^{100} & 0 \\\\ 0 & 3^{100} \\end{bmatrix} P^{-1} = \\begin{bmatrix} 2^{100} & 0 \\\\ 3^{100} - 2^{100} & 3^{100} \\end{bmatrix}",
              },
            ],
          },
          {
            id: 'eig-ex-3',
            difficulty: 'advanced',
            question:
              "Prove that the eigenvalues of a real symmetric matrix $A$ are real and that eigenvectors corresponding to distinct eigenvalues are orthogonal. Then use this to show that $A$ is positive definite iff all eigenvalues are positive.",
            hint:
              "For reality, multiply the eigenvalue equation $A\\mathbf{v} = \\lambda\\mathbf{v}$ by $\\bar{\\mathbf{v}}^*$ on the left, using $A = A^T$ (hence $A = A^*$ for real $A$). For positive definiteness, use $\\mathbf{x}^T A \\mathbf{x} = \\mathbf{x}^T Q\\Lambda Q^T \\mathbf{x}$.",
            solution:
              "Reality: $\\bar{\\mathbf{v}}^* A \\mathbf{v} = \\lambda \\|\\mathbf{v}\\|^2$. But $\\bar{\\mathbf{v}}^* A \\mathbf{v} = (A \\bar{\\mathbf{v}})^* \\mathbf{v} = \\overline{A\\mathbf{v}}^T \\mathbf{v}$. Since $A\\bar{\\mathbf{v}} = \\overline{A\\mathbf{v}} = \\bar{\\lambda}\\bar{\\mathbf{v}}$, this equals $\\bar{\\lambda}\\|\\mathbf{v}\\|^2$. Hence $\\lambda = \\bar{\\lambda} \\in \\mathbb{R}$. Orthogonality: as in the Spectral Theorem proof. Positive definiteness: by spectral theorem write $A = Q\\Lambda Q^T$. Then $\\mathbf{x}^T A \\mathbf{x} = \\mathbf{y}^T \\Lambda \\mathbf{y} = \\sum_i \\lambda_i y_i^2$ where $\\mathbf{y} = Q^T \\mathbf{x}$. This is $> 0$ for all $\\mathbf{x} \\neq 0$ iff all $\\lambda_i > 0$.",
          },
          {
            id: 'eig-ex-4',
            difficulty: 'intermediate',
            question:
              "Implement the QR iteration algorithm for computing all eigenvalues of a symmetric matrix. Compare convergence to numpy.linalg.eigh on a random 5×5 symmetric PD matrix. How many iterations does QR iteration need to achieve 6 decimal places of accuracy?",
            hint:
              "QR iteration: start with $A_0 = A$, repeat $A_k = Q_k R_k$ (QR decomp of $A_{k-1}$), then $A_{k+1} = R_k Q_k$. The diagonal entries of $A_k$ converge to eigenvalues for symmetric matrices.",
          },
        ]}
      />

      {/* References */}
      <ReferenceList
        references={[
          {
            type: 'textbook',
            authors: 'Strang, G.',
            year: 2016,
            title: "Introduction to Linear Algebra (5th ed.), Chapters 6–7",
            venue: 'Wellesley-Cambridge Press',
            whyImportant:
              "Chapter 6 covers eigenvalues with exceptional geometric intuition; Chapter 7 connects eigendecomposition to SVD. Strang's exposition is the gold standard for first-time learners.",
          },
          {
            type: 'textbook',
            authors: 'Horn, R. A. & Johnson, C. R.',
            year: 2012,
            title: 'Matrix Analysis (2nd ed.)',
            venue: 'Cambridge University Press',
            whyImportant:
              'The comprehensive reference for eigenvalue theory, including the Perron-Frobenius theorem, Jordan normal form, and variational characterizations (Courant-Fischer). Essential for research-level work.',
          },
          {
            type: 'textbook',
            authors: 'Trefethen, L. N. & Bau, D.',
            year: 1997,
            title: 'Numerical Linear Algebra',
            venue: 'SIAM',
            whyImportant:
              'Lectures 24–29 give a rigorous treatment of the QR algorithm and its convergence. Best reference for understanding how eigenvalues are actually computed numerically.',
          },
          {
            type: 'foundational',
            authors: 'Page, L., Brin, S., Motwani, R., & Winograd, T.',
            year: 1999,
            title: 'The PageRank Citation Ranking: Bringing Order to the Web',
            venue: 'Stanford Technical Report',
            url: 'http://ilpubs.stanford.edu:8090/422/',
            whyImportant:
              'The original PageRank paper. A beautiful application of the dominant eigenvalue of a stochastic matrix to real-world information retrieval.',
          },
          {
            type: 'survey',
            authors: 'Golub, G. H. & Van der Vorst, H. A.',
            year: 2000,
            title: 'Eigenvalue computation in the 20th century',
            venue: 'Journal of Computational and Applied Mathematics, 123(1–2), 35–65',
            whyImportant:
              'A survey of the major eigenvalue algorithms developed over the 20th century: QR algorithm, Lanczos, Arnoldi, and Jacobi-Davidson methods.',
          },
        ]}
      />
    </div>
  );
}
