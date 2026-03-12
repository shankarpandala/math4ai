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
// Laplacian Matrix Computer
// ---------------------------------------------------------------------------

const EXAMPLE_EDGES = [[0,1],[0,2],[1,2],[1,3],[2,3]];
const N = 4;
const LABELS = ['A','B','C','D'];

function buildMatrices(edges, n) {
  const A = Array.from({ length: n }, () => Array(n).fill(0));
  const deg = Array(n).fill(0);
  edges.forEach(([u, v]) => { A[u][v] = 1; A[v][u] = 1; deg[u]++; deg[v]++; });
  const D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? deg[i] : 0)));
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => D[i][j] - A[i][j]));
  return { A, D, L, deg };
}

function MatrixDisplay({ mat, labels, highlight, title, colorFn }) {
  return (
    <div>
      <p className="mb-1 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">{title}</p>
      <table className="mx-auto font-mono text-sm">
        <thead>
          <tr>
            <th className="w-6" />
            {labels.map(l => (
              <th key={l} className="w-8 text-center text-xs font-semibold text-indigo-500">{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mat.map((row, i) => (
            <tr key={i}>
              <td className="pr-2 text-xs font-semibold text-indigo-500">{labels[i]}</td>
              {row.map((val, j) => {
                const color = colorFn ? colorFn(i, j, val) : '';
                return (
                  <td key={j} className={`w-8 py-0.5 text-center text-xs ${color || (val !== 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-600')}`}>
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LaplacianViz() {
  const [selectedEdge, setSelectedEdge] = useState(null);
  const { A, D, L, deg } = buildMatrices(EXAMPLE_EDGES, N);

  const lColorFn = (i, j, val) => {
    if (i === j) return 'font-bold text-purple-600 dark:text-purple-400';
    if (val === -1) return 'text-rose-600 dark:text-rose-400';
    return '';
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Graph Laplacian Builder</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        For the graph with edges {EXAMPLE_EDGES.map(([u,v]) => `${LABELS[u]}-${LABELS[v]}`).join(', ')},
        the Laplacian is <InlineMath math="L = D - A" />.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <MatrixDisplay mat={A} labels={LABELS} title="Adjacency A" colorFn={(i,j,v) => v===1 ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''} />
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <MatrixDisplay mat={D} labels={LABELS} title="Degree D" colorFn={(i,j,v) => i===j && v>0 ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''} />
        </div>
        <div className="rounded-lg border border-purple-200 dark:border-purple-700 p-4 bg-purple-50/50 dark:bg-purple-900/20">
          <MatrixDisplay mat={L} labels={LABELS} title="Laplacian L = D − A" colorFn={lColorFn} />
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3 text-xs text-indigo-800 dark:text-indigo-300">
        <strong>Properties check:</strong> Row sums = {L.map(row => row.reduce((a,b)=>a+b,0)).join(', ')} (all zero ✓).
        Diagonal = degrees = [{deg.join(', ')}]. Off-diagonal entries: −1 for edges, 0 otherwise.
      </div>
    </div>
  );
}

const CODE = `import numpy as np
import scipy.linalg as la

# Build graph Laplacian from edge list
def graph_laplacian(n, edges, normalized=False):
    A = np.zeros((n, n))
    for u, v in edges:
        A[u, v] = A[v, u] = 1.0
    D = np.diag(A.sum(axis=1))
    L = D - A
    if normalized:
        # Normalized Laplacian: L_norm = D^{-1/2} L D^{-1/2}
        deg = A.sum(axis=1)
        D_inv_sqrt = np.diag(np.where(deg > 0, 1.0 / np.sqrt(deg), 0))
        L = D_inv_sqrt @ L @ D_inv_sqrt
    return L, A, D

edges = [(0,1),(0,2),(1,2),(1,3),(2,3)]
n = 4

L, A, D = graph_laplacian(n, edges)
print("Laplacian L:")
print(L)

# Eigendecomposition
eigenvalues, eigenvectors = la.eigh(L)  # eigh for symmetric matrices
print(f"\\nEigenvalues: {eigenvalues.round(4)}")
print(f"Algebraic connectivity (Fiedler value): lambda_2 = {eigenvalues[1]:.4f}")
print(f"Fiedler vector: {eigenvectors[:, 1].round(4)}")

# Number of connected components = number of zero eigenvalues
n_components = np.sum(np.abs(eigenvalues) < 1e-10)
print(f"\\nNumber of connected components: {n_components}")

# Normalized Laplacian
L_norm, _, _ = graph_laplacian(n, edges, normalized=True)
ev_norm, _ = la.eigh(L_norm)
print(f"\\nNormalized Laplacian eigenvalues: {ev_norm.round(4)}")
print(f"(All in [0, 2] for undirected graphs)")

# Graph cut via Fiedler vector
fiedler = eigenvectors[:, 1]
partition = (fiedler >= 0).astype(int)
print(f"\\nFiedler partition (0/1): {partition}")
# This gives the spectral bisection of the graph
`;

export default function Laplacian() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Graph Laplacian
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The Laplacian matrix encodes graph structure in its spectrum — eigenvalues reveal
          connectivity, clustering, and graph partitioning structure.
        </p>
      </div>

      <NoteBlock title="Historical Context">
        <p>
          The graph Laplacian was introduced by Kirchhoff (1847) in the context of electrical
          circuits to solve for currents (Kirchhoff's matrix tree theorem counts spanning trees
          via Laplacian eigenvalues). Spectral graph theory flourished with work by Cheeger (1970),
          Fiedler (1973), and Spielman &amp; Teng (2004). Modern applications span graph clustering,
          manifold learning (Laplacian Eigenmaps), and graph neural networks.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 2.1"
        title="Graph Laplacian"
        definition="The Laplacian matrix $L \in \mathbb{R}^{n \times n}$ of an undirected graph $G=(V,E)$ is $L = D - A$, where $D = \text{diag}(\deg(1),\ldots,\deg(n))$ is the degree matrix and $A$ is the adjacency matrix. Equivalently, $L_{ij} = \deg(i)$ if $i=j$, $-1$ if $\{i,j\} \in E$, and $0$ otherwise. The normalized Laplacian is $\mathcal{L} = D^{-1/2} L D^{-1/2} = I - D^{-1/2}AD^{-1/2}$."
        notation="$L$ is symmetric positive semidefinite. Its smallest eigenvalue is always $\lambda_1 = 0$ with eigenvector $\mathbf{1}/\sqrt{n}$. The second smallest eigenvalue $\lambda_2$ (Fiedler value) measures algebraic connectivity. For $\mathcal{L}$, all eigenvalues lie in $[0,2]$."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Fiedler Vector &amp; Spectral Gap"
        definition="The Fiedler vector is the eigenvector $\mathbf{f}$ corresponding to the second smallest eigenvalue $\lambda_2$ (Fiedler value) of the Laplacian. The spectral gap is $\lambda_2 - \lambda_1 = \lambda_2$. For a $k$-regular graph, the spectral gap of the normalized Laplacian is $1 - \lambda_{\max}(D^{-1}A)$, where $\lambda_{\max}$ is the largest non-trivial eigenvalue of the random walk matrix."
        notation="$\lambda_2 > 0$ iff $G$ is connected. Large $\lambda_2$ means the graph is hard to disconnect (expander graph). Small $\lambda_2$ means there is a sparse cut. The Fiedler vector $\mathbf{f}$ gives the optimal spectral bisection: assign node $i$ to part 0 if $f_i < 0$, part 1 if $f_i \geq 0$."
      />

      <LaplacianViz />

      <TheoremBlock
        label="Theorem 2.1"
        title="Spectral Properties of the Laplacian"
        statement="Let $G$ be an undirected graph with $n$ vertices and Laplacian $L$. Then: (1) $L$ is symmetric positive semidefinite with eigenvalues $0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_n$. (2) The multiplicity of eigenvalue 0 equals the number of connected components $c(G)$. (3) For any $\mathbf{x} \in \mathbb{R}^n$, the quadratic form satisfies $\mathbf{x}^\top L \mathbf{x} = \sum_{\{i,j\}\in E}(x_i - x_j)^2 \geq 0$."
        proof="(1) $L = D-A$ is symmetric since $A$ and $D$ are symmetric. For any $\mathbf{x}$: $\mathbf{x}^\top L \mathbf{x} = \mathbf{x}^\top D \mathbf{x} - \mathbf{x}^\top A \mathbf{x} = \sum_i d_i x_i^2 - \sum_{ij} A_{ij}x_ix_j = \sum_{\{i,j\}\in E}(x_i^2 - 2x_ix_j + x_j^2) = \sum_{\{i,j\}\in E}(x_i-x_j)^2 \geq 0$. (2) $L\mathbf{x}=0$ iff $\mathbf{x}^\top L\mathbf{x}=0$ iff $x_i=x_j$ for all edges $\{i,j\}$ iff $\mathbf{x}$ is constant on each connected component. The dimension of the null space equals the number of components. $\square$"
        corollaries={[
          "Kirchhoff's matrix-tree theorem: the number of spanning trees of $G$ equals any cofactor of $L$, which equals $\\frac{1}{n}\\lambda_2\\lambda_3\\cdots\\lambda_n$.",
          "Cheeger's inequality: $\\lambda_2/2 \\leq h(G) \\leq \\sqrt{2\\lambda_2}$ where $h(G)$ is the Cheeger constant (normalized edge boundary of the sparsest cut). This links spectrum to graph expansion.",
          "Random walk mixing time is $O(\\log n / \\lambda_2)$: the Fiedler value controls how fast a random walk on $G$ mixes to its stationary distribution.",
        ]}
      />

      <ExampleBlock
        title="Computing the Laplacian of a Path Graph"
        difficulty="advanced"
        problem="Compute the Laplacian $L$ of the path graph $P_4$ (4 nodes in a line: 1-2-3-4). Find its eigenvalues and verify the spectral properties."
        solution={[
          { step: 'Write L for P_4', formula: 'L = \\begin{pmatrix}1&-1&0&0\\\\-1&2&-1&0\\\\0&-1&2&-1\\\\0&0&-1&1\\end{pmatrix}', explanation: 'Endpoints have degree 1; interior nodes have degree 2.' },
          { step: 'Eigenvalues of P_n', formula: '\\lambda_k = 2 - 2\\cos\\!\\left(\\frac{(k-1)\\pi}{n}\\right), \\quad k=1,\\ldots,n', explanation: 'For P_4: k=1,2,3,4 gives eigenvalues.' },
          { step: 'Compute for P_4', formula: '\\lambda_1=0,\\; \\lambda_2 = 2-2\\cos(\\pi/4)\\approx 0.586,\\; \\lambda_3\\approx 2,\\; \\lambda_4\\approx 3.414', explanation: 'One zero eigenvalue (connected graph). Fiedler value ≈ 0.586.' },
          { step: 'Verify quadratic form', formula: '\\mathbf{x}^\\top L \\mathbf{x} = (x_1-x_2)^2 + (x_2-x_3)^2 + (x_3-x_4)^2 \\geq 0', explanation: 'Sum of squared differences over edges.' },
        ]}
      />

      <WarningBlock title="Normalized vs Unnormalized Laplacian">
        <p className="text-sm">
          The <strong>unnormalized Laplacian</strong> <InlineMath math="L = D-A" /> is natural for theoretical analysis
          but its eigenvalues scale with the maximum degree. The <strong>normalized Laplacian</strong>{' '}
          <InlineMath math="\mathcal{L} = D^{-1/2}LD^{-1/2}" /> has eigenvalues in <InlineMath math="[0,2]" />{' '}
          regardless of degree, making it better for comparing graphs of different densities.
          GNNs typically use the normalized adjacency <InlineMath math="\hat{A} = D^{-1/2}AD^{-1/2}" />{' '}
          (equivalently, <InlineMath math="I - \mathcal{L}" />). Using the wrong normalization
          can cause numerical issues or make message passing unstable for high-degree nodes.
        </p>
      </WarningBlock>

      <PythonCode code={CODE} title="Graph Laplacian & Spectral Analysis — NumPy/SciPy" runnable />
    </div>
  );
}
