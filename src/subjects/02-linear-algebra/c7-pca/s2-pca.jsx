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
// 2D point cloud variance direction visualizer
// ---------------------------------------------------------------------------
function PCAViz() {
  const [angle, setAngle] = useState(30);
  const [spread1, setSpread1] = useState(2.5);
  const [spread2, setSpread2] = useState(0.6);
  const [nPoints] = useState(40);
  const [showProjected, setShowProjected] = useState(true);

  // Generate deterministic-looking points along rotated ellipse
  const theta = (angle * Math.PI) / 180;
  const cos = Math.cos(theta), sin = Math.sin(theta);

  // Seeded pseudo-random using sine
  const points = Array.from({ length: nPoints }, (_, i) => {
    const t = i / nPoints;
    // two "random" values per point using different frequencies
    const r1 = (Math.sin(i * 17.3 + 1.5) * 0.5 + Math.sin(i * 31.7 + 2.1) * 0.5);
    const r2 = (Math.sin(i * 11.9 + 3.2) * 0.5 + Math.sin(i * 23.1 + 0.7) * 0.5);
    const x_local = r1 * spread1;
    const y_local = r2 * spread2;
    return [cos * x_local - sin * y_local, sin * x_local + cos * y_local];
  });

  // Compute mean
  const mx = points.reduce((s, p) => s + p[0], 0) / nPoints;
  const my = points.reduce((s, p) => s + p[1], 0) / nPoints;
  const centered = points.map(p => [p[0] - mx, p[1] - my]);

  // Covariance matrix
  const c11 = centered.reduce((s, p) => s + p[0] * p[0], 0) / (nPoints - 1);
  const c12 = centered.reduce((s, p) => s + p[0] * p[1], 0) / (nPoints - 1);
  const c22 = centered.reduce((s, p) => s + p[1] * p[1], 0) / (nPoints - 1);

  // Eigenvalues of 2x2 covariance
  const tr = c11 + c22;
  const det = c11 * c22 - c12 * c12;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lam1 = (tr + Math.sqrt(disc)) / 2;
  const lam2 = (tr - Math.sqrt(disc)) / 2;

  // PC1 direction
  function eigvec(lam) {
    const rx = c11 - lam, ry = c12;
    if (Math.abs(rx) + Math.abs(ry) > 1e-8) {
      const n = Math.sqrt(rx * rx + ry * ry);
      return [-ry / n, rx / n];
    }
    return [1, 0];
  }

  const pc1 = eigvec(lam1);
  const pc2 = eigvec(lam2);
  const varianceExplained = lam1 / (lam1 + lam2);

  const S = 40, OX = 200, OY = 200;
  const toSVG = (x, y) => [OX + x * S, OY - y * S];

  const arrowHead = (x1, y1, x2, y2, color) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 3) return null;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    return <polygon points={`${x2},${y2} ${x2-ux*12+px*6},${y2-uy*12+py*6} ${x2-ux*12-px*6},${y2-uy*12-py*6}`} fill={color} />;
  };

  const drawArrow = (x1, y1, x2, y2, color, w = 3) => {
    const [sx1, sy1] = toSVG(x1, y1);
    const [sx2, sy2] = toSVG(x2, y2);
    return <g>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={w} />
      {arrowHead(sx1, sy1, sx2, sy2, color)}
    </g>;
  };

  const scale1 = Math.sqrt(lam1) * 1.5;
  const scale2 = Math.sqrt(lam2) * 1.5;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        PCA — Variance Direction Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust the cloud orientation and spread. The principal components (PC1 = red, PC2 = orange)
        are the eigenvectors of the covariance matrix, aligned with directions of maximum variance.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">Cloud angle (°)</span>
              <span>{angle}°</span>
            </div>
            <input type="range" min="0" max="90" step="5" value={angle}
              onChange={e => setAngle(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full accent-red-500 cursor-pointer" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">Spread 1 (PC1)</span>
              <span>{spread1.toFixed(1)}</span>
            </div>
            <input type="range" min="0.5" max="3.5" step="0.5" value={spread1}
              onChange={e => setSpread1(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full accent-red-500 cursor-pointer" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono font-semibold">Spread 2 (PC2)</span>
              <span>{spread2.toFixed(1)}</span>
            </div>
            <input type="range" min="0.1" max="2.0" step="0.1" value={spread2}
              onChange={e => setSpread2(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full accent-orange-500 cursor-pointer" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input type="checkbox" checked={showProjected} onChange={e => setShowProjected(e.target.checked)}
              className="rounded" />
            Show projection onto PC1
          </label>

          <div className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
            <p className="font-semibold text-gray-600 dark:text-gray-400">Covariance Matrix</p>
            <p className="font-mono">[[{c11.toFixed(2)}, {c12.toFixed(2)}]</p>
            <p className="font-mono"> [{c12.toFixed(2)}, {c22.toFixed(2)}]]</p>
            <div className="mt-2 space-y-1">
              <p className="font-mono text-red-600 dark:text-red-400">λ₁ = {lam1.toFixed(3)} (PC1)</p>
              <p className="font-mono text-orange-500 dark:text-orange-400">λ₂ = {lam2.toFixed(3)} (PC2)</p>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                Var. explained by PC1: {(varianceExplained * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {[-4,-3,-2,-1,0,1,2,3,4].map(i => (
            <g key={i}>
              <line x1={toSVG(i,-4)[0]} y1={toSVG(i,-4)[1]} x2={toSVG(i,4)[0]} y2={toSVG(i,4)[1]} stroke="#e5e7eb" strokeWidth={1} />
              <line x1={toSVG(-4,i)[0]} y1={toSVG(-4,i)[1]} x2={toSVG(4,i)[0]} y2={toSVG(4,i)[1]} stroke="#e5e7eb" strokeWidth={1} />
            </g>
          ))}
          <line x1={toSVG(-4.5,0)[0]} y1={OY} x2={toSVG(4.5,0)[0]} y2={OY} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={OX} y1={toSVG(0,-4.5)[1]} x2={OX} y2={toSVG(0,4.5)[1]} stroke="#9ca3af" strokeWidth={1.5} />

          {/* Data points */}
          {centered.map((p, i) => {
            const [sx, sy] = toSVG(p[0], p[1]);
            // Project onto pc1
            const projLen = p[0] * pc1[0] + p[1] * pc1[1];
            const [px2, py2] = toSVG(projLen * pc1[0], projLen * pc1[1]);
            return (
              <g key={i}>
                {showProjected && (
                  <line x1={sx} y1={sy} x2={px2} y2={py2} stroke="#d1d5db" strokeWidth={0.8} strokeDasharray="3 2" />
                )}
                <circle cx={sx} cy={sy} r={3} fill="#6366f1" opacity={0.7} />
                {showProjected && <circle cx={px2} cy={py2} r={2} fill="#ef4444" opacity={0.5} />}
              </g>
            );
          })}

          {/* Mean point */}
          <circle cx={OX} cy={OY} r={5} fill="#f59e0b" stroke="white" strokeWidth={2} />

          {/* Principal component arrows */}
          {drawArrow(0, 0, scale1 * pc1[0], scale1 * pc1[1], '#ef4444', 3)}
          {drawArrow(0, 0, scale2 * pc2[0], scale2 * pc2[1], '#f97316', 2.5)}
          {drawArrow(0, 0, -scale1 * pc1[0], -scale1 * pc1[1], '#ef4444', 1.5)}

          {/* Labels */}
          <text x={toSVG(scale1*pc1[0]*1.1,scale1*pc1[1]*1.1)[0]+5} y={toSVG(scale1*pc1[0]*1.1,scale1*pc1[1]*1.1)[1]-5}
            fontSize={12} fill="#ef4444" fontWeight="bold">PC1</text>
          <text x={toSVG(scale2*pc2[0]*1.1,scale2*pc2[1]*1.1)[0]+5} y={toSVG(scale2*pc2[0]*1.1,scale2*pc2[1]*1.1)[1]-5}
            fontSize={12} fill="#f97316" fontWeight="bold">PC2</text>
        </svg>
      </div>
    </div>
  );
}

export default function PCASection() {
  return (
    <div className="space-y-8">
      <PCAViz />

      <DefinitionBlock
        label="Definition 7.2.1"
        title="Principal Component Analysis"
        definition={
          "Given centered data matrix $X \\in \\mathbb{R}^{n\\times d}$ (rows are $n$ samples, columns $d$ features, mean-subtracted), " +
          "PCA finds an orthonormal basis $\\{\\mathbf{w}_1, \\ldots, \\mathbf{w}_k\\}$ (principal components) " +
          "such that the variance of the projected data $X\\mathbf{w}_1$ is maximized, " +
          "then $X\\mathbf{w}_2$ is maximized subject to $\\mathbf{w}_2 \\perp \\mathbf{w}_1$, and so on. " +
          "The principal components are the eigenvectors of the sample covariance matrix " +
          "$\\Sigma = \\frac{1}{n-1}X^TX$, ordered by decreasing eigenvalue."
        }
        notation={
          "The loading matrix $W = [\\mathbf{w}_1 | \\cdots | \\mathbf{w}_k] \\in \\mathbb{R}^{d\\times k}$. " +
          "The scores (projections) $Z = XW \\in \\mathbb{R}^{n\\times k}$. " +
          "Reconstruction: $\\hat{X} = ZW^T = XWW^T$."
        }
      />

      <DefinitionBlock
        label="Definition 7.2.2"
        title="Reconstruction Error and Variance Explained"
        definition={
          "The reconstruction error of keeping $k$ components is " +
          "$\\|X - XWW^T\\|_F^2 = \\sum_{j=k+1}^d \\lambda_j$ (sum of discarded eigenvalues). " +
          "The fraction of variance explained by the first $k$ components is " +
          "$\\frac{\\sum_{j=1}^k \\lambda_j}{\\sum_{j=1}^d \\lambda_j}$. " +
          "This is minimized/maximized by the spectral theorem: no other $k$-dimensional projection " +
          "captures more variance."
        }
      />

      <TheoremBlock
        label="Theorem 7.2.1"
        title="PCA is Optimal for Variance and Reconstruction"
        statement={
          "Let $\\Sigma = W \\Lambda W^T$ be the eigendecomposition of the sample covariance, " +
          "with eigenvalues $\\lambda_1 \\geq \\cdots \\geq \\lambda_d \\geq 0$. " +
          "The projection onto the top $k$ eigenvectors $(\\mathbf{w}_1, \\ldots, \\mathbf{w}_k)$ " +
          "(1) maximizes total projected variance among all rank-$k$ orthogonal projections, and " +
          "(2) minimizes the reconstruction error $\\|X - XWW^T\\|_F^2 = \\sum_{j=k+1}^d \\lambda_j$."
        }
        proof={
          "By the Eckart-Young theorem (applied to SVD of $X$), the best rank-$k$ approximation " +
          "to $X$ in Frobenius norm is $X_k = U_k \\Sigma_k V_k^T$ (top $k$ singular vectors/values). " +
          "Since $\\Sigma_{\\text{cov}} = X^TX/(n-1)$, the right singular vectors of $X$ are the eigenvectors of $\\Sigma_{\\text{cov}}$, " +
          "and the singular values of $X$ relate to eigenvalues by $\\sigma_j^2 = (n-1)\\lambda_j$. " +
          "The projection $XW_kW_k^T$ is the best rank-$k$ reconstruction, minimizing Frobenius error. " +
          "Maximum variance follows from $\\operatorname{Var}(X\\mathbf{w}) = \\mathbf{w}^T\\Sigma\\mathbf{w} \\leq \\lambda_1$ with equality at $\\mathbf{w} = \\mathbf{w}_1$."
        }
        corollaries={[
          "PCA via covariance matrix eigendecomposition and via SVD of the data matrix X are equivalent.",
          "The proportion of variance explained by the first k PCs is $\\sum_{j=1}^k \\lambda_j / \\operatorname{tr}(\\Sigma)$.",
        ]}
      />

      <ExampleBlock
        title="PCA on 2D Data"
        difficulty="advanced"
        problem={
          "Data has covariance $\\Sigma = \\begin{bmatrix}4 & 3\\\\ 3 & 3\\end{bmatrix}$. " +
          "Find the first principal component and the fraction of variance it explains."
        }
        solution={[
          {
            step: 'Find eigenvalues: det(Σ - λI) = (4-λ)(3-λ)-9 = λ²-7λ+3 = 0',
            formula: '\\lambda_1 = \\frac{7+\\sqrt{37}}{2} \\approx 6.54,\\quad \\lambda_2 = \\frac{7-\\sqrt{37}}{2} \\approx 0.46',
          },
          {
            step: 'Eigenvector for λ₁ ≈ 6.54: (Σ - λ₁I)v = 0',
            formula: '\\mathbf{w}_1 \\approx \\frac{1}{\\sqrt{(4-\\lambda_1)^2+9}}\\begin{bmatrix}-3\\\\ 4-\\lambda_1\\end{bmatrix} \\approx \\begin{bmatrix}0.752\\\\0.659\\end{bmatrix}',
          },
          {
            step: 'Variance explained by PC1',
            formula: '\\frac{\\lambda_1}{\\lambda_1+\\lambda_2} = \\frac{6.54}{7} \\approx 93.4\\%',
          },
        ]}
      />

      <NoteBlock type="intuition" title="PCA as Rotation">
        <p>
          PCA is simply a rotation of the coordinate system to align axes with the directions of
          greatest spread. The new basis (principal components) is just a rotation of the standard
          basis — the data cloud itself doesn't change, only the coordinate frame.
          The magic is that this rotation is uniquely determined by the variance structure of the data,
          making it the "most informative" coordinate system for a given dataset.
        </p>
      </NoteBlock>

      <WarningBlock title="Mean-Center Before Running PCA">
        <p>
          PCA assumes the data is centered (zero mean). If you forget to subtract the mean, the
          first principal component will simply point toward the mean vector, not toward the
          direction of maximum variance within the data cloud. Always center your data:
          <code>X_centered = X - X.mean(axis=0)</code>. Also, consider standardizing
          (dividing by standard deviation) if features have very different scales.
        </p>
      </WarningBlock>

      <PythonCode
        title="PCA from Scratch and with sklearn"
        code={`import numpy as np

# Generate correlated 2D data
rng = np.random.default_rng(42)
X = rng.multivariate_normal(mean=[0, 0],
                             cov=[[4, 3], [3, 3]],
                             size=200)

# Step 1: Center
X_c = X - X.mean(axis=0)

# Step 2: Covariance matrix
Sigma = X_c.T @ X_c / (len(X_c) - 1)
print("Covariance matrix:\\n", Sigma.round(2))

# Step 3: Eigendecomposition (eigh for symmetric)
eigenvalues, W = np.linalg.eigh(Sigma)
# eigh returns ascending order — reverse for descending
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx]
W = W[:, idx]
print("\\nEigenvalues:", eigenvalues.round(4))
print("Principal components (columns):\\n", W.round(4))

# Step 4: Project onto top k PCs
k = 1
Z = X_c @ W[:, :k]  # scores
X_recon = Z @ W[:, :k].T  # reconstruction

# Variance explained
var_explained = eigenvalues / eigenvalues.sum()
print(f"\\nVariance explained by PC1: {var_explained[0]*100:.1f}%")
print(f"Reconstruction error: {np.linalg.norm(X_c - X_recon, 'fro'):.4f}")

# Verify: SVD gives same PCs
U, s, Vt = np.linalg.svd(X_c, full_matrices=False)
print(f"\\nSVD vs eig match: {np.allclose(np.abs(W[:, 0]), np.abs(Vt[0]))}")`}
      />
    </div>
  );
}
