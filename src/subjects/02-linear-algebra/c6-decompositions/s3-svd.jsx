import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Mafs, Coordinates, Vector, Text, Transform, Circle, Point } from 'mafs';
import 'mafs/core.css';

import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';

// ---------------------------------------------------------------------------
// Interactive SVD Visualization — 2×2 matrix transforms unit circle to ellipse
// ---------------------------------------------------------------------------
function SVDVisualization() {
  const [a, setA] = useState(2.0);
  const [b, setB] = useState(0.5);
  const [c, setC] = useState(0.5);
  const [d, setD] = useState(1.5);

  // Compute image of unit circle under [[a,b],[c,d]]
  // and approximate singular values via power iteration on A^T A
  const { sigma1, sigma2, ellipsePoints, v1, v2, u1, u2 } = useMemo(() => {
    // A^T A = [[a^2+c^2, ab+cd],[ab+cd, b^2+d^2]]
    const AtA00 = a * a + c * c;
    const AtA01 = a * b + c * d;
    const AtA11 = b * b + d * d;

    // Eigenvalues of 2x2 symmetric: lam = (tr ± sqrt(tr^2 - 4det))/2
    const tr = AtA00 + AtA11;
    const det = AtA00 * AtA11 - AtA01 * AtA01;
    const disc = Math.max(0, tr * tr - 4 * det);
    const lam1 = (tr + Math.sqrt(disc)) / 2;
    const lam2 = (tr - Math.sqrt(disc)) / 2;
    const s1 = Math.sqrt(Math.max(0, lam1));
    const s2 = Math.sqrt(Math.max(0, lam2));

    // Eigenvector of A^T A for lam1
    let vx, vy;
    if (Math.abs(AtA01) > 1e-10) {
      vx = AtA01;
      vy = lam1 - AtA00;
    } else {
      vx = 1;
      vy = 0;
    }
    const vNorm = Math.sqrt(vx * vx + vy * vy) || 1;
    const v1 = [vx / vNorm, vy / vNorm];
    const v2 = [-v1[1], v1[0]];

    // u1 = A v1 / sigma1
    const Av1x = a * v1[0] + b * v1[1];
    const Av1y = c * v1[0] + d * v1[1];
    const Av1norm = Math.sqrt(Av1x * Av1x + Av1y * Av1y) || 1;
    const u1 = s1 > 1e-10 ? [Av1x / Av1norm, Av1y / Av1norm] : [1, 0];

    const u2 = [-u1[1], u1[0]];

    // Parametric ellipse: A * [cos t, sin t]
    const N = 120;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (2 * Math.PI * i) / N;
      const cx = Math.cos(t);
      const cy = Math.sin(t);
      pts.push([a * cx + b * cy, c * cx + d * cy]);
    }

    return { sigma1: s1, sigma2: s2, ellipsePoints: pts, v1, v2, u1, u2 };
  }, [a, b, c, d]);

  const sliderClass =
    'w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer';

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100">
        Interactive SVD — Unit Circle to Ellipse
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust the entries of <InlineMath math="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}" />.
        The unit circle (blue) is mapped to an ellipse (orange) whose semi-axes equal the singular values.
      </p>

      {/* Matrix display */}
      <div className="mb-4 flex flex-wrap items-center gap-6">
        <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
          <BlockMath math={`A = \\begin{bmatrix} ${a.toFixed(2)} & ${b.toFixed(2)} \\\\ ${c.toFixed(2)} & ${d.toFixed(2)} \\end{bmatrix}`} />
        </div>
        <div className="flex gap-6 text-sm">
          <div className="rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-900/20">
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              <InlineMath math="\sigma_1" /> = {sigma1.toFixed(3)}
            </span>
          </div>
          <div className="rounded-lg bg-teal-50 px-3 py-2 dark:bg-teal-900/20">
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              <InlineMath math="\sigma_2" /> = {sigma2.toFixed(3)}
            </span>
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
        <Mafs height={320} viewBox={{ x: [-4, 4], y: [-4, 4] }}>
          <Coordinates.Cartesian />

          {/* Unit circle */}
          <Circle center={[0, 0]} radius={1} strokeStyle="dashed"
            color="#6366f1" fillOpacity={0.06} strokeOpacity={0.6} />

          {/* Transformed ellipse via polyline approximation */}
          {ellipsePoints.map((pt, i) => {
            if (i === 0) return null;
            return (
              <Vector
                key={i}
                tail={ellipsePoints[i - 1]}
                tip={pt}
                color="#f97316"
                weight={1.5}
                opacity={0.85}
              />
            );
          })}

          {/* Right singular vectors (input space) */}
          <Vector tail={[0, 0]} tip={v1} color="#6366f1" weight={2} />
          <Vector tail={[0, 0]} tip={v2} color="#a78bfa" weight={2} />

          {/* Left singular vectors scaled by sigma (output space) */}
          <Vector tail={[0, 0]} tip={[sigma1 * u1[0], sigma1 * u1[1]]} color="#ea580c" weight={2.5} />
          <Vector tail={[0, 0]} tip={[sigma2 * u2[0], sigma2 * u2[1]]} color="#fb923c" weight={2.5} />

          {/* Labels */}
          <Text x={v1[0] * 1.2 + 0.1} y={v1[1] * 1.2 + 0.15} size={14} color="#4f46e5">v₁</Text>
          <Text x={v2[0] * 1.2 + 0.1} y={v2[1] * 1.2 + 0.15} size={14} color="#7c3aed">v₂</Text>
          <Text x={sigma1 * u1[0] * 1.05 + 0.1} y={sigma1 * u1[1] * 1.05 + 0.15} size={14} color="#ea580c">σ₁u₁</Text>
          <Text x={sigma2 * u2[0] * 1.05 + 0.1} y={sigma2 * u2[1] * 1.05 + 0.15} size={14} color="#f97316">σ₂u₂</Text>
        </Mafs>
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Blue dashed = unit circle (domain). Orange curve = image ellipse. Indigo arrows = right singular vectors
        <InlineMath math="v_1, v_2" />. Orange arrows = left singular vectors scaled by <InlineMath math="\sigma_1 u_1, \sigma_2 u_2" />.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------
export default function SVDSection() {
  return (
    <div className="prose-math mx-auto max-w-4xl px-4 py-8">

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Singular Value Decomposition
      </h1>
      <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
        The fundamental matrix factorization underlying modern machine learning.
      </p>

      {/* 1. Historical context */}
      <NoteBlock type="historical" title="Historical Origins">
        <p>
          SVD was discovered independently by <strong>Eugenio Beltrami</strong> (1873) and{' '}
          <strong>Camille Jordan</strong> (1874) for real square matrices, extended to rectangular
          matrices by <strong>James Joseph Sylvester</strong> (1889), and given its modern
          constructive form by <strong>Erhard Schmidt</strong> (1907). The finite-dimensional
          numerical algorithm was developed by Golub and Reinsch (1970) and remains the foundation
          of <code>numpy.linalg.svd</code> today. It is arguably the most important matrix
          factorization in computational science.
        </p>
      </NoteBlock>

      {/* 2. Motivation */}
      <section className="my-8">
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Motivation and Applications
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          SVD is the engine behind a remarkable range of algorithms in machine learning and
          numerical computing. Consider the classic{' '}
          <strong>Netflix Prize</strong> collaborative filtering problem: we observe a sparse
          matrix <InlineMath math="M \in \mathbb{R}^{m \times n}" /> where rows are users, columns
          are movies, and entry <InlineMath math="M_{ij}" /> is user <InlineMath math="i" />'s
          rating of movie <InlineMath math="j" /> (most entries missing). The hypothesis is that
          user preferences and movie attributes live in a low-dimensional{' '}
          <em>latent space</em> of dimension <InlineMath math="k \ll \min(m,n)" />:
        </p>
        <BlockMath math="M \approx U_k \Sigma_k V_k^T = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^T" />
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          This low-rank approximation simultaneously compresses the data and reveals latent
          structure. The same mathematical object appears across the entire ML landscape:
        </p>
        <ul className="mb-4 list-none space-y-2 text-gray-700 dark:text-gray-300">
          {[
            ['PCA', 'Principal components are right singular vectors of the centered data matrix'],
            ['LSA / LSI', 'Latent Semantic Analysis decomposes a document-term matrix via SVD'],
            ['Pseudo-inverses', 'The Moore–Penrose pseudo-inverse is A^+ = V Σ^+ U^T'],
            ['Least squares', 'Minimum-norm solutions to overdetermined systems use SVD'],
            ['Image compression', 'Rank-k truncation achieves k(m+n+1)/(mn) compression ratio'],
            ['Attention mechanisms', 'Low-rank projections in transformer attention relate to SVD'],
          ].map(([name, desc]) => (
            <li key={name} className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
              <span>
                <strong className="text-indigo-700 dark:text-indigo-300">{name}:</strong>{' '}
                {desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Definition */}
      <DefinitionBlock
        label="Definition 6.3.1"
        title="Singular Value Decomposition"
        definition={
          "For any matrix $A \\in \\mathbb{R}^{m \\times n}$, the singular value decomposition (SVD) is a factorization $A = U \\Sigma V^T$ where: " +
          "$U \\in \\mathbb{R}^{m \\times m}$ is orthogonal (columns $\\mathbf{u}_i$ are left singular vectors), " +
          "$\\Sigma \\in \\mathbb{R}^{m \\times n}$ is diagonal with non-negative entries $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq 0$ called singular values, " +
          "and $V \\in \\mathbb{R}^{n \\times n}$ is orthogonal (columns $\\mathbf{v}_i$ are right singular vectors). " +
          "The number of nonzero singular values equals $\\mathrm{rank}(A)$."
        }
        notation={
          "The thin (economy) SVD keeps only $r = \\mathrm{rank}(A)$ columns: $A = U_r \\Sigma_r V_r^T$ with $U_r \\in \\mathbb{R}^{m \\times r}$, $\\Sigma_r \\in \\mathbb{R}^{r \\times r}$, $V_r \\in \\mathbb{R}^{n \\times r}$."
        }
      />

      {/* 4. Existence theorem */}
      <TheoremBlock
        label="Theorem 6.3.1"
        title="Existence of SVD"
        statement={
          "Every real matrix $A \\in \\mathbb{R}^{m \\times n}$ has a singular value decomposition $A = U \\Sigma V^T$."
        }
        proof={
          "Consider the symmetric positive semidefinite matrix $B = A^T A \\in \\mathbb{R}^{n \\times n}$. " +
          "By the spectral theorem for symmetric matrices, $B$ has a complete orthonormal set of eigenvectors $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}$ with real eigenvalues $\\lambda_1 \\geq \\cdots \\geq \\lambda_n \\geq 0$ (non-negative because $B$ is PSD: $\\mathbf{x}^T B \\mathbf{x} = \\|A\\mathbf{x}\\|^2 \\geq 0$). " +
          "Set $\\sigma_i = \\sqrt{\\lambda_i}$. For each $i$ with $\\sigma_i > 0$, define $\\mathbf{u}_i = A\\mathbf{v}_i / \\sigma_i$. " +
          "These satisfy $\\|\\mathbf{u}_i\\| = 1$ (since $\\|A\\mathbf{v}_i\\|^2 = \\mathbf{v}_i^T A^T A \\mathbf{v}_i = \\lambda_i$) and are mutually orthogonal (since $\\mathbf{u}_i^T \\mathbf{u}_j = \\sigma_i^{-1}\\sigma_j^{-1} \\mathbf{v}_i^T A^T A \\mathbf{v}_j = \\lambda_j \\sigma_i^{-1} \\sigma_j^{-1} \\delta_{ij}$). " +
          "Extend $\\{\\mathbf{u}_i\\}$ to an orthonormal basis of $\\mathbb{R}^m$ arbitrarily. " +
          "Then for any $\\mathbf{x} = \\sum_j (\\mathbf{v}_j^T \\mathbf{x}) \\mathbf{v}_j$ we have $A\\mathbf{x} = \\sum_{j: \\sigma_j > 0} \\sigma_j (\\mathbf{v}_j^T \\mathbf{x}) \\mathbf{u}_j = U \\Sigma V^T \\mathbf{x}$, confirming $A = U \\Sigma V^T$."
        }
        corollaries={[
          "The singular values of $A$ are unique, though $U$ and $V$ may not be when singular values repeat.",
          "$\\mathrm{rank}(A)$ equals the number of positive singular values.",
          "$\\|A\\|_2 = \\sigma_1$ (operator norm) and $\\|A\\|_F = \\sqrt{\\sigma_1^2 + \\cdots + \\sigma_r^2}$ (Frobenius norm).",
        ]}
      />

      {/* 5. Interactive visualization */}
      <SVDVisualization />

      {/* 6. Worked example */}
      <ExampleBlock
        title="SVD of a 2×3 Matrix"
        difficulty="intermediate"
        problem={
          "Compute the SVD of $A = \\begin{bmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\end{bmatrix}$."
        }
        solution={[
          {
            step: "Compute $A^T A$",
            formula:
              "A^T A = \\begin{bmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 0 & 1 \\end{bmatrix} \\begin{bmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\end{bmatrix} = \\begin{bmatrix} 1 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 0 & 1 & 1 \\end{bmatrix}",
            explanation: "This is a 3×3 symmetric PSD matrix whose eigenvalues give the squared singular values.",
          },
          {
            step: "Find eigenvalues of $A^T A$",
            formula:
              "\\det(A^T A - \\lambda I) = 0 \\implies \\lambda(\\lambda - 3)(\\lambda - 1) = 0 \\implies \\lambda_1 = 3,\\; \\lambda_2 = 1,\\; \\lambda_3 = 0",
            explanation: "The characteristic polynomial factors as −λ³ + 4λ² − 3λ = −λ(λ−1)(λ−3).",
          },
          {
            step: "Singular values",
            formula: "\\sigma_1 = \\sqrt{3}, \\quad \\sigma_2 = 1, \\quad \\sigma_3 = 0",
            explanation: "The rank of A is 2 (two nonzero singular values).",
          },
          {
            step: "Right singular vectors $\\mathbf{v}_i$ (eigenvectors of $A^T A$)",
            formula:
              "\\mathbf{v}_1 = \\frac{1}{\\sqrt{6}}\\begin{bmatrix}1 \\\\ 2 \\\\ 1\\end{bmatrix}, \\quad \\mathbf{v}_2 = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1 \\\\ 0 \\\\ -1\\end{bmatrix}, \\quad \\mathbf{v}_3 = \\frac{1}{\\sqrt{3}}\\begin{bmatrix}1 \\\\ -1 \\\\ 1\\end{bmatrix}",
            explanation: "Solve $(A^T A - \\lambda_i I)\\mathbf{v} = 0$ for each eigenvalue and normalize.",
          },
          {
            step: "Left singular vectors $\\mathbf{u}_i = A\\mathbf{v}_i / \\sigma_i$",
            formula:
              "\\mathbf{u}_1 = \\frac{1}{\\sqrt{3}\\cdot\\sqrt{6}}\\begin{bmatrix}1+2\\\\2+1\\end{bmatrix} = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1\\\\1\\end{bmatrix}, \\quad \\mathbf{u}_2 = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1\\\\-1\\end{bmatrix}",
            explanation: "Since A is 2×3 and rank 2, U is a 2×2 orthogonal matrix.",
          },
          {
            step: "Full SVD",
            formula:
              "A = \\underbrace{\\frac{1}{\\sqrt{2}}\\begin{bmatrix}1 & 1\\\\1 & -1\\end{bmatrix}}_{U} \\underbrace{\\begin{bmatrix}\\sqrt{3} & 0 & 0\\\\0 & 1 & 0\\end{bmatrix}}_{\\Sigma} \\underbrace{\\frac{1}{\\sqrt{6}}\\begin{bmatrix}1 & 2 & 1\\\\\\sqrt{3} & 0 & -\\sqrt{3}\\\\\\sqrt{2} & -\\sqrt{2} & \\sqrt{2}\\end{bmatrix}}_{V^T}",
          },
        ]}
      />

      {/* 7. Python code */}
      <PythonCode
        title="SVD with NumPy — Computation & Image Compression"
        code={`import numpy as np
import matplotlib.pyplot as plt

# ── Basic SVD ──────────────────────────────────────────────────────────────
A = np.array([[4, 0], [3, -5]], dtype=float)
U, sigma, Vt = np.linalg.svd(A)
print(f"U =\\n{U}")
print(f"Singular values: {sigma}")
print(f"V^T =\\n{Vt}")

# Verify reconstruction
A_reconstructed = U @ np.diag(sigma) @ Vt
print(f"\\n||A - U Σ Vᵀ||_F = {np.linalg.norm(A - A_reconstructed):.2e}")

# ── Rank-k approximation ───────────────────────────────────────────────────
k = 1
A_approx = sigma[0] * np.outer(U[:, 0], Vt[0, :])
print(f"Rank-1 approximation error: {np.linalg.norm(A - A_approx, 'fro'):.4f}")
# By Eckart-Young: this error equals sigma[1] = σ₂

# ── Image compression via truncated SVD ────────────────────────────────────
from PIL import Image
img = np.random.rand(100, 100)   # placeholder grayscale image (100×100)
U_img, s_img, Vt_img = np.linalg.svd(img, full_matrices=False)

print("\\nImage compression analysis:")
print(f"{'k':>4}  {'ratio':>8}  {'Frobenius error':>16}")
for k in [5, 20, 50]:
    img_k = U_img[:, :k] @ np.diag(s_img[:k]) @ Vt_img[:k, :]
    ratio = k * (100 + 100 + 1) / (100 * 100)
    err   = np.linalg.norm(img - img_k, 'fro')
    print(f"{k:>4}  {ratio:>8.3f}  {err:>16.4f}")

# ── Visualize singular value spectrum ────────────────────────────────────
data = np.random.randn(200, 50)  # random data matrix
_, sv, _ = np.linalg.svd(data, full_matrices=False)
plt.figure(figsize=(7, 3))
plt.semilogy(sv, 'o-', markersize=4, color='#4f46e5')
plt.xlabel('index i'); plt.ylabel('σᵢ (log scale)')
plt.title('Singular value spectrum'); plt.tight_layout(); plt.show()`}
      />

      {/* 8. Eckart-Young-Mirsky theorem */}
      <TheoremBlock
        label="Theorem 6.3.2"
        title="Eckart–Young–Mirsky (Best Low-Rank Approximation)"
        statement={
          "Let $A = U\\Sigma V^T$ with singular values $\\sigma_1 \\geq \\cdots \\geq \\sigma_r > 0$. " +
          "Define the rank-$k$ truncation $A_k = \\sum_{i=1}^k \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$. " +
          "Then for both the Frobenius norm and the spectral (operator) norm, $A_k$ is the closest rank-$k$ matrix to $A$: " +
          "$\\min_{\\mathrm{rank}(B) \\leq k} \\|A - B\\|_F = \\|A - A_k\\|_F = \\sqrt{\\sigma_{k+1}^2 + \\cdots + \\sigma_r^2}$ and $\\min_{\\mathrm{rank}(B) \\leq k} \\|A - B\\|_2 = \\sigma_{k+1}$."
        }
        proof={
          "We show the Frobenius case. First, $\\|A - A_k\\|_F^2 = \\|\\sum_{i>k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T\\|_F^2 = \\sum_{i>k} \\sigma_i^2$ by orthonormality of $\\{\\mathbf{u}_i\\}$ and $\\{\\mathbf{v}_i\\}$. " +
          "Now suppose $B$ is any rank-$k$ matrix. Its null space $\\ker(B) \\subset \\mathbb{R}^n$ has dimension at least $n - k$. " +
          "The span $W = \\mathrm{span}(\\mathbf{v}_1, \\ldots, \\mathbf{v}_{k+1})$ has dimension $k+1$, so by a dimension argument $W \\cap \\ker(B) \\neq \\{\\mathbf{0}\\}$; pick a unit vector $\\mathbf{w}$ in this intersection. " +
          "Then $\\|A - B\\|_F \\geq \\|(A-B)\\mathbf{w}\\| = \\|A\\mathbf{w}\\| = \\|\\sum_{i=1}^{k+1} \\sigma_i (\\mathbf{v}_i^T \\mathbf{w}) \\mathbf{u}_i\\| \\geq \\sigma_{k+1}\\|\\mathbf{w}\\| = \\sigma_{k+1}$. " +
          "Summing over all tail singular values (via unitary invariance) yields the Frobenius bound."
        }
        corollaries={[
          "The Frobenius error of rank-k approximation is $\\|A - A_k\\|_F = \\sqrt{\\sum_{i>k} \\sigma_i^2}$.",
          "Percentage of variance explained by k components: $\\sum_{i=1}^k \\sigma_i^2 / \\sum_{i=1}^r \\sigma_i^2$.",
          "For PCA, choosing k such that 95% of variance is explained is the standard heuristic.",
        ]}
      />

      {/* 9. ML Applications note */}
      <NoteBlock type="intuition" title="SVD in Machine Learning">
        <div className="space-y-3">
          <p>
            <strong>PCA via SVD:</strong> Given centered data matrix{' '}
            <InlineMath math="X \in \mathbb{R}^{n \times p}" /> (rows = samples, columns = features),
            compute <InlineMath math="X = U\Sigma V^T" />. The principal components are the columns
            of <InlineMath math="V" />, and the projected data is{' '}
            <InlineMath math="Z = X V_k = U_k \Sigma_k" />. This avoids explicitly forming the
            covariance matrix <InlineMath math="X^T X / (n-1)" />.
          </p>
          <p>
            <strong>Latent Semantic Analysis (LSA):</strong> Build a term-document matrix{' '}
            <InlineMath math="A" /> where <InlineMath math="A_{ij}" /> = TF-IDF weight of term{' '}
            <InlineMath math="i" /> in document <InlineMath math="j" />. The rank-<InlineMath math="k" />{' '}
            SVD approximation captures latent semantic topics, enabling query-document similarity
            in the reduced space even when exact word matches fail.
          </p>
          <p>
            <strong>Collaborative Filtering:</strong> The truncated SVD{' '}
            <InlineMath math="M \approx U_k \Sigma_k V_k^T" /> of a ratings matrix provides
            user embeddings <InlineMath math="(U_k \Sigma_k^{1/2})_i" /> and item embeddings{' '}
            <InlineMath math="(\Sigma_k^{1/2} V_k^T)_j" />. Predicted rating{' '}
            <InlineMath math="\hat{M}_{ij} = \mathbf{p}_i \cdot \mathbf{q}_j" />.
          </p>
        </div>
      </NoteBlock>

      {/* 10. Warning block */}
      <WarningBlock title="Common SVD Mistakes">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              1. Confusing SVD with eigendecomposition
            </p>
            <p className="mt-1">
              For a general matrix: <InlineMath math="A = U\Sigma V^T" /> (SVD) but{' '}
              <InlineMath math="A = P\Lambda P^{-1}" /> (eigendecomp, only for diagonalizable
              square matrices). In SVD, <InlineMath math="U \neq V" /> in general. The two coincide
              only when <InlineMath math="A" /> is symmetric PSD: then{' '}
              <InlineMath math="A = Q\Lambda Q^T = U\Sigma V^T" /> with{' '}
              <InlineMath math="U = V = Q" /> and <InlineMath math="\Sigma = \Lambda" />.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              2. Singular values ≠ eigenvalues
            </p>
            <p className="mt-1">
              For a non-symmetric matrix, singular values of <InlineMath math="A" /> are{' '}
              <em>not</em> the absolute values of eigenvalues. Example:{' '}
              <InlineMath math="A = \begin{bmatrix}0&2\\0&0\end{bmatrix}" /> has eigenvalues{' '}
              <InlineMath math="0, 0" /> but singular values{' '}
              <InlineMath math="\sigma_1 = 2, \sigma_2 = 0" />.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              3. Full SVD vs. thin (economy) SVD
            </p>
            <p className="mt-1">
              <code>np.linalg.svd(A)</code> returns the <em>full</em> SVD by default: <InlineMath math="U" />{' '}
              is <InlineMath math="m \times m" />, <InlineMath math="\Sigma" /> is a length-min(m,n)
              array. Use <code>np.linalg.svd(A, full_matrices=False)</code> for the thin SVD. Many
              papers write <InlineMath math="A = U\Sigma V^T" /> meaning the thin form — always
              check dimensions.
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              4. Sign ambiguity
            </p>
            <p className="mt-1">
              Singular vectors are defined only up to sign (or unitary rotation when singular values
              repeat). Different SVD implementations may return different signs for <InlineMath math="U" />{' '}
              and <InlineMath math="V" />. Always check consistency before comparing across runs or libraries.
            </p>
          </div>
        </div>
      </WarningBlock>

      {/* 11. Exercises */}
      <ExerciseBlock
        title="SVD Exercises"
        exercises={[
          {
            id: 'svd-ex-1',
            difficulty: 'beginner',
            question:
              "Compute the SVD of the 2×2 rotation matrix $R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$. What are the singular values? Interpret geometrically.",
            hint: "Compute $R_\\theta^T R_\\theta$ and find its eigenvalues.",
            solution:
              "$R_\\theta^T R_\\theta = I$ so all eigenvalues of $R_\\theta^T R_\\theta$ equal 1. Thus $\\sigma_1 = \\sigma_2 = 1$. The SVD is $R_\\theta = R_\\theta \\cdot I \\cdot I^T$ (trivially $U = R_\\theta$, $\\Sigma = I$, $V = I$). Geometrically, rotations preserve all lengths, so both singular values equal 1.",
          },
          {
            id: 'svd-ex-2',
            difficulty: 'intermediate',
            question:
              "Prove that the singular values of $A \\in \\mathbb{R}^{m \\times n}$ equal the square roots of the eigenvalues of $A^T A$. What is the relationship between the singular values of $A$ and $A^T$?",
            hint:
              "Use the definition $A = U\\Sigma V^T$ and compute $A^T A$ in terms of $U, \\Sigma, V$. For the second part, note $A^T = V\\Sigma^T U^T$.",
            solution: [
              {
                text: "From $A = U\\Sigma V^T$ we get $A^T A = V\\Sigma^T U^T \\cdot U\\Sigma V^T = V(\\Sigma^T\\Sigma)V^T$.",
              },
              {
                formula:
                  "A^T A = V \\begin{bmatrix} \\sigma_1^2 & & \\\\ & \\ddots & \\\\ & & \\sigma_n^2 \\end{bmatrix} V^T",
              },
              {
                text: "This is the eigendecomposition of $A^T A$, so its eigenvalues are $\\sigma_i^2$, and singular values are $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$. For $A^T$: its SVD is $A^T = V\\Sigma^T U^T$, so the singular values of $A^T$ are the same as those of $A$ (they are the nonzero entries of $\\Sigma^T$).",
              },
            ],
          },
          {
            id: 'svd-ex-3',
            difficulty: 'advanced',
            question:
              "Let $A = U\\Sigma V^T$ with singular values $\\sigma_1 \\geq \\cdots \\geq \\sigma_r > 0$. Show that for any matrix $B$ with $\\mathrm{rank}(B) \\leq k$, we have $\\|A - B\\|_2 \\geq \\sigma_{k+1}$.",
            hint:
              "Use the min-max (Courant-Fischer) characterization: $\\sigma_{k+1} = \\min_{S: \\dim(S) = n-k} \\max_{\\|x\\|=1, x \\in S} \\|Ax\\|$. Show $\\ker(B)$ intersects $\\mathrm{span}(v_1, \\ldots, v_{k+1})$ nontrivially.",
            solution:
              "Since $\\mathrm{rank}(B) \\leq k$, $\\dim(\\ker B) \\geq n - k$. The subspace $W = \\mathrm{span}(\\mathbf{v}_1, \\ldots, \\mathbf{v}_{k+1})$ has dimension $k+1$, so $\\dim(\\ker B) + \\dim(W) \\geq n+1 > n$, forcing $\\ker B \\cap W \\neq \\{\\mathbf{0}\\}$. Pick unit $\\mathbf{w}$ in this intersection. Then $\\|(A-B)\\mathbf{w}\\| = \\|A\\mathbf{w}\\|$ (since $B\\mathbf{w} = 0$) and $\\|A\\mathbf{w}\\|^2 = \\|\\sum_{i \\leq k+1} \\sigma_i (\\mathbf{v}_i^T \\mathbf{w})\\mathbf{u}_i\\|^2 = \\sum_{i \\leq k+1} \\sigma_i^2 (\\mathbf{v}_i^T \\mathbf{w})^2 \\geq \\sigma_{k+1}^2 \\sum_{i \\leq k+1} (\\mathbf{v}_i^T \\mathbf{w})^2 = \\sigma_{k+1}^2$. Hence $\\|A-B\\|_2 \\geq \\|(A-B)\\mathbf{w}\\| \\geq \\sigma_{k+1}$.",
          },
          {
            id: 'svd-ex-4',
            difficulty: 'intermediate',
            question:
              "Implement image compression using SVD in Python. Load a grayscale image, compute its SVD, and reconstruct using k = 5, 10, 20, 50 singular values. Plot the PSNR (peak signal-to-noise ratio) as a function of k and the compression ratio. At what k does the compressed image look visually indistinguishable from the original?",
            hint:
              "PSNR (dB) = 20 log₁₀(MAX_I) − 10 log₁₀(MSE). Use MAX_I = 255 for uint8 images. Compression ratio = k(m + n + 1)/(m·n).",
          },
        ]}
      />

      {/* 12. References */}
      <ReferenceList
        references={[
          {
            type: 'textbook',
            authors: 'Strang, G.',
            year: 2016,
            title: 'Introduction to Linear Algebra (5th ed.), Chapter 7: The Singular Value Decomposition',
            venue: 'Wellesley-Cambridge Press',
            whyImportant:
              'The most accessible treatment of SVD with geometric intuition. Chapter 7 covers existence, properties, and applications.',
          },
          {
            type: 'textbook',
            authors: 'Golub, G. H. & Van Loan, C. F.',
            year: 2013,
            title: 'Matrix Computations (4th ed.)',
            venue: 'Johns Hopkins University Press',
            whyImportant:
              'The definitive reference for numerical SVD algorithms. Covers Golub-Reinsch bidiagonalization and divide-and-conquer methods.',
          },
          {
            type: 'foundational',
            authors: 'Eckart, C. & Young, G.',
            year: 1936,
            title: 'The approximation of one matrix by another of lower rank',
            venue: 'Psychometrika, 1(3), 211–218',
            whyImportant:
              'Original proof that the rank-k SVD truncation minimizes Frobenius error. One of the most cited results in linear algebra.',
          },
          {
            type: 'survey',
            authors: 'Halko, N., Martinsson, P. G., & Tropp, J. A.',
            year: 2011,
            title: 'Finding structure with randomness: Probabilistic algorithms for constructing approximate matrix decompositions',
            venue: 'SIAM Review, 53(2), 217–288',
            url: 'https://arxiv.org/abs/0909.4061',
            whyImportant:
              'Introduces randomized SVD — the practical algorithm used in sklearn and modern ML pipelines for large-scale matrices.',
          },
          {
            type: 'foundational',
            authors: 'Trefethen, L. N. & Bau, D.',
            year: 1997,
            title: 'Numerical Linear Algebra',
            venue: 'SIAM',
            whyImportant:
              'Lecture 4–5 give a rigorous proof of SVD existence and the connection to the polar decomposition.',
          },
        ]}
      />
    </div>
  );
}
