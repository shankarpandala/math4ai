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
// Spectral Clustering Visualizer
// ---------------------------------------------------------------------------

// Two-cluster graph: nodes 0-3 form cluster 1, nodes 4-7 form cluster 2, one bridge edge
const CLUSTER_NODES = [
  { id:0, x:60,  y:80,  cluster:0 },
  { id:1, x:120, y:50,  cluster:0 },
  { id:2, x:140, y:110, cluster:0 },
  { id:3, x:80,  y:140, cluster:0 },
  { id:4, x:240, y:80,  cluster:1 },
  { id:5, x:300, y:50,  cluster:1 },
  { id:6, x:320, y:120, cluster:1 },
  { id:7, x:260, y:150, cluster:1 },
];

const CLUSTER_EDGES = [
  [0,1],[1,2],[2,3],[3,0],[0,2], // cluster 0 (dense)
  [4,5],[5,6],[6,7],[7,4],[4,6], // cluster 1 (dense)
  [2,4], // bridge
];

// Precomputed simplified Fiedler values for visualization
const FIEDLER = [-0.45, -0.48, -0.38, -0.41, 0.42, 0.45, 0.38, 0.35];

function SpectralClusterViz() {
  const [showPartition, setShowPartition] = useState(false);
  const [threshold, setThreshold] = useState(0);

  const partition = FIEDLER.map(v => v >= threshold ? 1 : 0);

  const COLORS = ['#6366f1', '#f59e0b'];
  const LIGHT = ['#c7d2fe', '#fde68a'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Spectral Graph Partition Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The Fiedler vector signs reveal the two-cluster structure. Adjust the threshold to see different cuts.
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <svg width={390} height={210} className="shrink-0">
          {CLUSTER_EDGES.map(([u,v],i) => {
            const nu = CLUSTER_NODES[u], nv = CLUSTER_NODES[v];
            const isBridge = u === 2 && v === 4;
            const samePartition = showPartition && partition[u] === partition[v];
            return (
              <line key={i} x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y}
                stroke={isBridge ? '#ef4444' : samePartition ? COLORS[partition[u]] : '#d1d5db'}
                strokeWidth={isBridge ? 2 : 1.5}
                strokeDasharray={isBridge ? '5,3' : '0'}
                className={isBridge ? '' : 'dark:stroke-gray-600'} />
            );
          })}
          {CLUSTER_NODES.map(node => {
            const p = partition[node.id];
            const fill = showPartition ? COLORS[p] : '#6366f1';
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={18} fill={fill} stroke="#fff" strokeWidth={2} />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill="#fff">
                  {node.id}
                </text>
              </g>
            );
          })}
          {/* Fiedler values */}
          {CLUSTER_NODES.map(node => (
            <text key={`f${node.id}`} x={node.x} y={node.y + 34} textAnchor="middle" fontSize={10}
              fill={FIEDLER[node.id] >= threshold ? '#6366f1' : '#f59e0b'}
              className="dark:fill-current">
              {FIEDLER[node.id].toFixed(2)}
            </text>
          ))}
        </svg>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Fiedler vector values</p>
            <div className="flex gap-1.5 flex-wrap">
              {FIEDLER.map((v,i) => (
                <span key={i} className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                  v >= threshold ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                 : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                }`}>
                  f[{i}]={v.toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
              Cut threshold: {threshold.toFixed(2)}
            </label>
            <input type="range" min={-0.5} max={0.5} step={0.01} value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
              className="w-full" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showPartition} onChange={e => setShowPartition(e.target.checked)}
              className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show partition coloring</span>
          </label>

          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-xs text-gray-600 dark:text-gray-400">
            <strong>Eigenvalues (approx):</strong><br/>
            λ₁ ≈ 0.00 (zero — connected graph)<br/>
            λ₂ ≈ 0.23 (Fiedler — small: bridge makes weak connection)<br/>
            λ₃ ≈ 1.50, λ₄ ≈ 2.00, ...
          </div>
        </div>
      </div>
    </div>
  );
}

const CODE = `import numpy as np
from sklearn.cluster import KMeans
import scipy.linalg as la

def spectral_clustering(A, k, normalized=True):
    """
    Spectral clustering on adjacency matrix A into k clusters.

    Steps:
    1. Compute Laplacian (normalized or unnormalized)
    2. Find k smallest eigenvectors
    3. Embed nodes in R^k, normalize rows
    4. Run k-means on embedded points
    """
    n = A.shape[0]
    deg = A.sum(axis=1)
    D = np.diag(deg)
    L = D - A

    if normalized:
        # Symmetric normalized Laplacian
        D_inv_sqrt = np.diag(np.where(deg > 0, 1.0 / np.sqrt(deg), 0))
        L = D_inv_sqrt @ L @ D_inv_sqrt

    # Compute k smallest eigenvalues/vectors (skip first trivial one)
    eigenvalues, eigenvectors = la.eigh(L)
    # Take k eigenvectors corresponding to k smallest eigenvalues
    U = eigenvectors[:, :k]  # shape (n, k)

    if normalized:
        # Row-normalize for better k-means stability
        norms = np.linalg.norm(U, axis=1, keepdims=True)
        U = U / np.where(norms > 0, norms, 1)

    # k-means in spectral embedding space
    kmeans = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = kmeans.fit_predict(U)
    return labels, eigenvalues[:k+1]

# Example: two clusters connected by a bridge
n = 8
A = np.zeros((n, n))
# Cluster 0: dense subgraph (nodes 0-3)
for i, j in [(0,1),(1,2),(2,3),(3,0),(0,2)]:
    A[i,j] = A[j,i] = 1
# Cluster 1: dense subgraph (nodes 4-7)
for i, j in [(4,5),(5,6),(6,7),(7,4),(4,6)]:
    A[i,j] = A[j,i] = 1
# Bridge
A[2,4] = A[4,2] = 1

labels, eigenvalues = spectral_clustering(A, k=2)
print(f"Cluster assignments: {labels}")
print(f"First 3 eigenvalues: {eigenvalues.round(4)}")
print(f"Expected: nodes 0-3 in cluster 0, nodes 4-7 in cluster 1")

# Ncut (normalized cut) value
def ncut(A, labels, k):
    total = 0
    for c in range(k):
        mask = labels == c
        cut = A[mask][:, ~mask].sum()
        vol = A[mask].sum()
        total += cut / (vol + 1e-12)
    return total

print(f"Normalized cut value: {ncut(A, labels, 2):.4f}")
`;

export default function SpectralClustering() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Spectral Clustering
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Using the eigenstructure of the graph Laplacian to find cluster structure — normalized cuts,
          spectral embeddings, and k-means on eigenvectors.
        </p>
      </div>

      <NoteBlock title="Spectral Methods in Machine Learning">
        <p>
          Spectral clustering was popularized by Shi &amp; Malik (2000) for image segmentation
          and Ng, Jordan &amp; Weiss (2002) for general clustering. It builds on spectral graph
          theory and is related to manifold learning (Laplacian Eigenmaps, Diffusion Maps) and
          dimensionality reduction (Locally Linear Embedding). Modern GNNs can be viewed as
          polynomial filters on the graph Laplacian spectrum.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 2.3"
        title="Graph Cut &amp; Normalized Cut"
        definition="For a partition $V = S \cup \bar{S}$, the cut is $\text{cut}(S,\bar{S}) = \sum_{i \in S, j \in \bar{S}} A_{ij}$. The normalized cut (Ncut) is $\text{Ncut}(S,\bar{S}) = \frac{\text{cut}(S,\bar{S})}{\text{vol}(S)} + \frac{\text{cut}(S,\bar{S})}{\text{vol}(\bar{S})}$, where $\text{vol}(S) = \sum_{i \in S} \deg(i)$ is the volume of $S$. Minimizing Ncut finds balanced cuts that avoid isolating small clusters."
        notation="Minimizing Ncut is NP-hard in general. The spectral relaxation (dropping the integrality constraint) leads to the generalized eigenvalue problem $L\mathbf{f} = \lambda D\mathbf{f}$, equivalent to finding eigenvectors of the normalized Laplacian $\mathcal{L} = D^{-1/2}LD^{-1/2}$."
      />

      <DefinitionBlock
        label="Definition 2.4"
        title="Spectral Embedding"
        definition="Given a graph $G$ with normalized Laplacian $\mathcal{L}$ and eigenvectors $\mathbf{u}_1, \mathbf{u}_2, \ldots, \mathbf{u}_n$ (ordered by eigenvalue), the $k$-dimensional spectral embedding maps each node $i$ to $\phi(i) = (u_{2,i}, u_{3,i}, \ldots, u_{k+1,i}) \in \mathbb{R}^{k}$ (skipping the trivial first eigenvector). Nodes in the same cluster are close in this embedding."
        notation="The embedding uses the $k$ non-trivial eigenvectors (smallest eigenvalues excluding $\lambda_1=0$). For $k=2$ clusters, only the Fiedler vector $\mathbf{u}_2$ is needed; sign of $u_{2,i}$ determines cluster membership."
      />

      <SpectralClusterViz />

      <TheoremBlock
        label="Theorem 2.2"
        title="Spectral Relaxation of Normalized Cut"
        statement="Minimizing $\text{Ncut}(S, \bar{S})$ over bipartitions $S$ is NP-hard. The continuous relaxation leads to minimizing $\mathbf{y}^\top \mathcal{L} \mathbf{y}$ subject to $\|\mathbf{y}\|=1$ and $\mathbf{y} \perp D\mathbf{1}$. The solution is the Fiedler vector $\mathbf{u}_2$ of the normalized Laplacian. This gives an approximation with guarantee: $\text{Ncut}(\text{spectral}) \leq 2h(G)$ where $h(G)$ is the optimal Ncut."
        proof="The Ncut objective for indicator vector $\mathbf{h}$ (where $h_i = \sqrt{|\bar{S}|/|S|}$ if $i\in S$, $-\sqrt{|S|/|\bar{S}|}$ otherwise) equals $\mathbf{h}^\top L \mathbf{h} / \mathbf{h}^\top D \mathbf{h}$. Relaxing $\mathbf{h}$ to be real-valued and using $\mathbf{y} = D^{1/2}\mathbf{h}$ gives $\mathbf{y}^\top \mathcal{L} \mathbf{y}$ (Rayleigh quotient of $\mathcal{L}$). The minimum under orthogonality to $D^{1/2}\mathbf{1}$ is the second smallest eigenvalue, achieved by $\mathbf{u}_2$. $\square$"
        corollaries={[
          "For $k$ clusters, use the $k$ smallest eigenvectors of $\\mathcal{L}$ and apply k-means to the embedded points (Ng-Jordan-Weiss algorithm).",
          "Spectral clustering finds non-convex clusters (rings, interlocking shapes) that k-means cannot — it captures the graph topology, not Euclidean geometry.",
          "The eigenvalue gap $\\lambda_{k+1} - \\lambda_k$ indicates how well-separated the $k$ clusters are.",
        ]}
      />

      <ExampleBlock
        title="Spectral Clustering on a Ring + Two-Cluster Graph"
        difficulty="advanced"
        problem="Explain why k-means fails on two concentric rings but spectral clustering succeeds, and describe the spectral embedding that makes this work."
        solution={[
          { step: 'Build similarity graph', formula: 'A_{ij} = \\exp(-\\|x_i - x_j\\|^2 / 2\\sigma^2)', explanation: 'Connect nearby points with Gaussian kernel weights. σ controls neighborhood size.' },
          { step: 'Compute normalized Laplacian', formula: '\\mathcal{L} = I - D^{-1/2}AD^{-1/2}', explanation: 'Encodes the connectivity structure of the similarity graph.' },
          { step: 'Find Fiedler vector', formula: '\\mathcal{L}\\mathbf{u}_2 = \\lambda_2 \\mathbf{u}_2,\\quad \\lambda_2 \\text{ small}', explanation: 'Fiedler vector separates inner and outer rings: opposite signs for the two rings.' },
          { step: 'Threshold Fiedler vector', formula: '\\text{cluster}(i) = \\mathbf{1}[u_{2,i} \\geq 0]', explanation: 'Nodes in the same ring have the same sign in u_2, revealing the two-cluster structure k-means cannot find in R^2.' },
        ]}
      />

      <WarningBlock title="Spectral Clustering Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Choice of k:</strong> Must specify k in advance. The eigenvalue gap plot (scree plot of Laplacian eigenvalues) can suggest the right k, but it is often ambiguous.</li>
          <li><strong>Similarity graph construction:</strong> The clustering quality depends heavily on the choice of similarity function and neighborhood size σ. Incorrect σ can merge clusters or split them.</li>
          <li><strong>Scalability:</strong> Eigendecomposition of <InlineMath math="L" /> costs <InlineMath math="O(n^3)" /> — infeasible for large graphs. Use Nyström approximation or randomized SVD for large-scale problems.</li>
          <li><strong>Normalized vs unnormalized:</strong> The unnormalized Laplacian can fail when clusters have very different sizes; always prefer the normalized version for general clustering.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="Spectral Clustering — NumPy + scikit-learn" runnable />
    </div>
  );
}
