import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// 2D scatter with covariance ellipse visualizer
// ---------------------------------------------------------------------------
function CovarianceEllipse() {
  const [rho, setRho] = useState(0.7);   // correlation
  const [sigma1, setSigma1] = useState(1.5);
  const [sigma2, setSigma2] = useState(1.0);

  const N = 80;
  const seed = 42;

  // Simple seeded random (LCG)
  function lcg(seed) {
    let s = seed;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  }

  const points = useMemo(() => {
    const rand = lcg(seed);
    const pts = [];
    for (let i = 0; i < N; i++) {
      // Box-Muller
      const u1 = rand(), u2 = rand();
      const z1 = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.sin(2 * Math.PI * u2);
      // Correlated normals
      const x = sigma1 * z1;
      const y = sigma2 * (rho * z1 + Math.sqrt(1 - rho * rho) * z2);
      pts.push([x, y]);
    }
    return pts;
  }, [rho, sigma1, sigma2]);

  // 95% confidence ellipse parameters
  // For bivariate normal: semi-axes = chi2_95=5.991 * eigenvalues of Sigma
  const cov11 = sigma1 * sigma1;
  const cov12 = rho * sigma1 * sigma2;
  const cov22 = sigma2 * sigma2;
  const trace = cov11 + cov22;
  const det = cov11 * cov22 - cov12 * cov12;
  const disc = Math.sqrt(Math.max(0, (trace / 2) ** 2 - det));
  const lam1 = trace / 2 + disc;
  const lam2 = trace / 2 - disc;
  const scale = Math.sqrt(5.991); // chi2(2, 0.95)
  const a = scale * Math.sqrt(lam1);
  const b = scale * Math.sqrt(Math.max(0, lam2));
  const theta = Math.atan2(lam1 - cov11, cov12) * 180 / Math.PI;

  const W = 400, H = 300;
  const cx = W / 2, cy = H / 2;
  const pxPerUnit = 50;

  function toSvg(x, y) {
    return [cx + x * pxPerUnit, cy - y * pxPerUnit];
  }

  // Generate ellipse points
  const ellipsePts = Array.from({ length: 100 }, (_, i) => {
    const ang = (2 * Math.PI * i) / 100;
    const ex = a * Math.cos(ang);
    const ey = b * Math.sin(ang);
    const thRad = theta * Math.PI / 180;
    const rx = ex * Math.cos(thRad) - ey * Math.sin(thRad);
    const ry = ex * Math.sin(thRad) + ey * Math.cos(thRad);
    const [sx, sy] = toSvg(rx, ry);
    return `${sx},${sy}`;
  }).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        2D Scatter with Covariance Ellipse
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Red ellipse = 95% confidence region of the bivariate Gaussian with the given covariance. Adjust correlation and variances to see how the ellipse rotates and stretches.
      </p>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'σ₁', val: sigma1, set: setSigma1, min: 0.3, max: 3, step: 0.1 },
          { label: 'σ₂', val: sigma2, set: setSigma2, min: 0.3, max: 3, step: 0.1 },
          { label: 'ρ', val: rho, set: setRho, min: -0.95, max: 0.95, step: 0.05 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">{label}</span>
              <span>{val.toFixed(2)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value))}
              className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800">
          {/* Grid */}
          {[-3, -2, -1, 0, 1, 2, 3].map((v) => {
            const [sx] = toSvg(v, 0);
            const [, sy] = toSvg(0, v);
            return (
              <g key={v}>
                <line x1={sx} y1={0} x2={sx} y2={H} stroke="#e5e7eb" strokeWidth={v === 0 ? 1.5 : 0.5} />
                <line x1={0} y1={sy} x2={W} y2={sy} stroke="#e5e7eb" strokeWidth={v === 0 ? 1.5 : 0.5} />
              </g>
            );
          })}
          {/* Points */}
          {points.map(([x, y], i) => {
            const [sx, sy] = toSvg(x, y);
            if (sx < 0 || sx > W || sy < 0 || sy > H) return null;
            return <circle key={i} cx={sx} cy={sy} r={2.5} fill="#6366f1" opacity={0.5} />;
          })}
          {/* 95% confidence ellipse */}
          <polygon points={ellipsePts} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.8} />
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
          <span className="font-semibold text-purple-700 dark:text-purple-300">Cov matrix: </span>
          <span className="font-mono text-purple-600">[[{cov11.toFixed(2)}, {cov12.toFixed(2)}], [{cov12.toFixed(2)}, {cov22.toFixed(2)}]]</span>
        </div>
        <div className="rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
          <span className="font-semibold text-red-700 dark:text-red-300">Eigenvalues: </span>
          <span className="font-mono text-red-600">λ₁={lam1.toFixed(2)}, λ₂={lam2.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

const COV_CODE = `import numpy as np

# ---------------------------------------------------------------------------
# Sample covariance matrix
# ---------------------------------------------------------------------------
np.random.seed(42)
n, d = 200, 3   # 200 samples, 3 features

# Generate correlated data
A = np.array([[2, 1, 0.5], [0, 1.5, 0.3], [0, 0, 1.0]])
X_raw = np.random.randn(n, d)
X = X_raw @ A.T   # correlated via Cholesky-like factor

# Sample covariance matrix (unbiased: divide by n-1)
X_centered = X - X.mean(axis=0)
S = (X_centered.T @ X_centered) / (n - 1)   # (d, d)
# Equivalently: np.cov(X.T)

print("Sample covariance matrix:")
print(S.round(3))

# Spectral decomposition: S = Q @ diag(lambdas) @ Q.T
eigenvalues, eigenvectors = np.linalg.eigh(S)  # sorted ascending for symmetric
print("\\nEigenvalues:", eigenvalues.round(4))
print("Eigenvectors (columns):")
print(eigenvectors.round(3))

# Verify PSD: all eigenvalues >= 0 (up to numerical noise)
print("\\nAll eigenvalues >= 0?", np.all(eigenvalues >= -1e-10))

# Verify reconstruction
S_reconstructed = eigenvectors @ np.diag(eigenvalues) @ eigenvectors.T
print("||S - QΛQᵀ||_F =", np.linalg.norm(S - S_reconstructed).round(12))

# ---------------------------------------------------------------------------
# PCA via spectral decomposition of covariance
# ---------------------------------------------------------------------------
# Sort by descending eigenvalue (PCA convention)
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx]
eigenvectors = eigenvectors[:, idx]

# Project to top-2 principal components
X_pca = X_centered @ eigenvectors[:, :2]
print("\\nPCA projection shape:", X_pca.shape)   # (200, 2)

# Variance explained
var_explained = eigenvalues / eigenvalues.sum()
print("Variance explained:", var_explained.round(3))
print("Cumulative:", var_explained.cumsum().round(3))`;

export default function CovarianceMatrices() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Covariance Matrices
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Sample covariance, positive semidefiniteness, and spectral decomposition — the mathematical foundation of PCA.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 7.1"
        title="Sample Covariance Matrix"
        definition="Given a data matrix $X \in \mathbb{R}^{n \times d}$ with $n$ observations and $d$ features, the sample covariance matrix is $\hat{\Sigma} = \frac{1}{n-1} X_c^\top X_c$ where $X_c = X - \bar{X}$ is the mean-centered data matrix ($\bar{X}_{ij} = \bar{x}_j$). The $(i,j)$ entry $\hat{\sigma}_{ij} = \frac{1}{n-1}\sum_k (x_{ki} - \bar{x}_i)(x_{kj} - \bar{x}_j)$ measures the linear co-variation between features $i$ and $j$."
        notation="$\hat{\Sigma} \in \mathbb{R}^{d \times d}$ is symmetric. The diagonal entries $\hat{\sigma}_{ii} = \hat{s}_i^2$ are sample variances. Off-diagonal entries $\hat{\sigma}_{ij}$ are sample covariances. The correlation matrix $R$ has entries $r_{ij} = \hat{\sigma}_{ij} / (\hat{s}_i \hat{s}_j)$ normalized to $[-1, 1]$."
      />

      <CovarianceEllipse />

      <DefinitionBlock
        label="Definition 7.2"
        title="Positive Semidefinite (PSD) Covariance"
        definition="The sample covariance matrix $\hat{\Sigma} = \frac{1}{n-1} X_c^\top X_c$ is always positive semidefinite: for any vector $v \in \mathbb{R}^d$, $v^\top \hat{\Sigma} v = \frac{1}{n-1} \|X_c v\|^2 \geq 0$. It is positive definite iff the columns of $X_c$ span $\mathbb{R}^d$ (i.e., $n > d$ and no feature is a linear combination of others). PSD means all eigenvalues are non-negative — eigenvalues represent the variance in each principal direction."
        notation="$\hat{\Sigma} \succeq 0$ (PSD) for any data. $\hat{\Sigma} \succ 0$ (PD) requires $n > d$ with full-rank data. In practice, $n < d$ (more features than samples) gives a rank-deficient, singular covariance matrix."
      />

      <TheoremBlock
        label="Theorem 7.1"
        title="Spectral Decomposition of Covariance"
        statement="Since $\hat{\Sigma}$ is real symmetric PSD, the spectral theorem gives $\hat{\Sigma} = Q \Lambda Q^\top$ where $Q \in \mathbb{R}^{d \times d}$ is orthogonal (columns are eigenvectors) and $\Lambda = \text{diag}(\lambda_1, \ldots, \lambda_d)$ with $\lambda_1 \geq \ldots \geq \lambda_d \geq 0$. The eigenvectors are the principal components of PCA and the eigenvalues are the variances along each principal axis. Together, they give a variance-maximizing orthogonal basis for the data."
        proof="Existence of eigendecomposition follows from the spectral theorem for real symmetric matrices (all eigenvalues real, eigenvectors orthogonal). PSD: for any $v$, $v^\top \hat{\Sigma} v = (Q^\top v)^\top \Lambda (Q^\top v) = \sum_i \lambda_i w_i^2 \geq 0$ where $w = Q^\top v$. Hence $\lambda_i \geq 0$ (choose $v = q_i$: $q_i^\top \hat{\Sigma} q_i = \lambda_i \geq 0$). $\square$"
        corollaries={[
          "PCA projection to top-$k$ components: $Z = X_c Q_k$ where $Q_k$ are the $k$ leading eigenvectors. This is the optimal rank-$k$ linear compression (by the Eckart-Young theorem).",
          "The fraction of variance explained by the top-$k$ components is $\\sum_{i=1}^k \\lambda_i / \\sum_{i=1}^d \\lambda_i$.",
        ]}
      />

      <ExampleBlock
        title="Computing Covariance and PCA by Hand"
        difficulty="intermediate"
        problem="Data: $X = \begin{bmatrix}1 & 2 \\ 3 & 4 \\ 5 & 6\end{bmatrix}$ (3 samples, 2 features). Compute $\hat{\Sigma}$ and its eigenvalues."
        solution={[
          { step: "Mean center", formula: "\\bar{x} = (3, 4), \\quad X_c = \\begin{bmatrix}-2&-2\\\\0&0\\\\2&2\\end{bmatrix}" },
          { step: "Covariance matrix ($n-1=2$)", formula: "\\hat{\\Sigma} = \\frac{1}{2} X_c^\\top X_c = \\frac{1}{2}\\begin{bmatrix}8&8\\\\8&8\\end{bmatrix} = \\begin{bmatrix}4&4\\\\4&4\\end{bmatrix}" },
          { step: "Eigenvalues of $\\hat{\\Sigma}$", formula: "\\det(\\hat{\\Sigma} - \\lambda I) = (4-\\lambda)^2 - 16 = 0 \\implies \\lambda_1 = 8,\\; \\lambda_2 = 0", explanation: "The data lies on a 1D line (perfect correlation ρ=1), so one eigenvalue is 0 — the covariance matrix is rank 1." },
        ]}
      />

      <WarningBlock title="Covariance vs Correlation">
        <p className="text-sm">
          <strong>Scale sensitivity:</strong> Covariance depends on the units of measurement. If feature 1 is in meters and feature 2 in millimeters, the covariance matrix is dominated by the millimeter feature. Always standardize features (subtract mean, divide by std) before computing covariances for PCA, unless the features are naturally on comparable scales. The standardized covariance matrix is the <em>correlation matrix</em>, with diagonal entries equal to 1.
        </p>
      </WarningBlock>

      <PythonCode code={COV_CODE} title="Covariance Matrix and PCA — NumPy" runnable />
    </div>
  );
}
