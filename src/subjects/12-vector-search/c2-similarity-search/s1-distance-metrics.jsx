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
// Distance Metrics Calculator
// ---------------------------------------------------------------------------

function parseVec(str) {
  return str
    .split(',')
    .map((s) => parseFloat(s.trim()))
    .filter((v) => !isNaN(v));
}

function l1(a, b) {
  return a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0);
}

function l2(a, b) {
  return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
}

function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return na === 0 || nb === 0 ? 0 : dot / (na * nb);
}

function hamming(a, b) {
  return a.reduce((s, v, i) => s + (v !== b[i] ? 1 : 0), 0);
}

const DEFAULT_A = '1, 2, 3, 4';
const DEFAULT_B = '2, 0, 3, 5';

export default function DistanceMetrics() {
  const [strA, setStrA] = useState(DEFAULT_A);
  const [strB, setStrB] = useState(DEFAULT_B);

  const a = parseVec(strA);
  const b = parseVec(strB);
  const valid = a.length > 0 && a.length === b.length;

  const metrics = valid
    ? [
        { name: 'L1 (Manhattan)', formula: '\\|a-b\\|_1', value: l1(a, b).toFixed(4), color: '#6366f1' },
        { name: 'L2 (Euclidean)', formula: '\\|a-b\\|_2', value: l2(a, b).toFixed(4), color: '#10b981' },
        {
          name: 'Cosine similarity',
          formula: '\\frac{a \\cdot b}{\\|a\\|\\|b\\|}',
          value: cosine(a, b).toFixed(4),
          color: '#f59e0b',
        },
        {
          name: 'Cosine distance',
          formula: '1 - \\text{cos}(a,b)',
          value: (1 - cosine(a, b)).toFixed(4),
          color: '#ef4444',
        },
        {
          name: 'Hamming distance',
          formula: '\\sum_i [a_i \\neq b_i]',
          value: hamming(a, b).toString(),
          color: '#8b5cf6',
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Distance Metrics
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The geometry of similarity search — how different distance functions shape the
          notion of "nearness" in high-dimensional spaces.
        </p>
      </div>

      {/* Interactive Calculator */}
      <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
        <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
          Distance Metric Calculator
        </h3>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Enter two comma-separated vectors of equal length to compute all distance metrics.
        </p>

        <div className="mb-4 grid grid-cols-2 gap-4">
          {[
            { label: 'Vector a', val: strA, set: setStrA, color: 'indigo' },
            { label: 'Vector b', val: strB, set: setStrB, color: 'emerald' },
          ].map(({ label, val, set, color }) => (
            <div key={label}>
              <label className={`mb-1 block text-sm font-medium text-${color}-700 dark:text-${color}-300`}>
                {label}
              </label>
              <input
                type="text"
                value={val}
                onChange={(e) => set(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          ))}
        </div>

        {!valid && (
          <p className="text-sm text-red-500">
            Enter two comma-separated vectors of equal length.
          </p>
        )}

        {valid && (
          <div className="space-y-2">
            {metrics.map(({ name, formula, value, color }) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</p>
                  <InlineMath math={formula} />
                </div>
                <span
                  className="font-mono text-lg font-bold"
                  style={{ color }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Metric Space"
        definition="A metric space $(\mathcal{X}, d)$ consists of a set $\mathcal{X}$ and a distance function $d: \mathcal{X} \times \mathcal{X} \to \mathbb{R}_{\geq 0}$ satisfying: (1) Non-negativity: $d(x,y) \geq 0$, with $d(x,y)=0 \iff x=y$; (2) Symmetry: $d(x,y)=d(y,x)$; (3) Triangle inequality: $d(x,z) \leq d(x,y)+d(y,z)$. Embedding vectors into metric spaces enables efficient nearest-neighbor data structures (ball trees, KD-trees, HNSW)."
        notation="The triangle inequality is the critical property for approximate nearest neighbor (ANN) algorithms: it allows pruning of search regions without examining every point. Cosine distance $1 - \cos\theta$ does NOT satisfy the triangle inequality in general — use angular distance $\arccos(\cos\theta)/\pi$ for a true metric."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Lp Norms and Distances"
        definition="The $L^p$ norm of a vector $x \in \mathbb{R}^d$ is $\|x\|_p = \left(\sum_{i=1}^d |x_i|^p\right)^{1/p}$ for $p \geq 1$, and $\|x\|_\infty = \max_i |x_i|$. The induced $L^p$ distance is $d_p(x,y) = \|x-y\|_p$. Special cases: $p=1$ gives Manhattan distance (sum of absolute differences); $p=2$ gives Euclidean distance; $p=\infty$ gives Chebyshev distance (maximum component difference)."
        notation="In high dimensions ($d \gg 1$), the 'curse of dimensionality' causes all $L^p$ distances to concentrate: for random vectors, $d_p(x,y) / d_p(x,z) \to 1$ as $d \to \infty$. This makes nearest-neighbor search harder and motivates approximate methods and dimensionality reduction."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Mahalanobis Distance and Covariance Whitening"
        statement="The Mahalanobis distance between $x, y \in \mathbb{R}^d$ with respect to covariance matrix $\Sigma$ is $d_M(x,y) = \sqrt{(x-y)^\top \Sigma^{-1} (x-y)}$. Equivalently, $d_M(x,y) = \|L^{-1}(x-y)\|_2$ where $\Sigma = LL^\top$ (Cholesky). The Mahalanobis distance equals the Euclidean distance after whitening the data by $\Sigma^{-1/2}$."
        proof="Let $\tilde{x} = \Sigma^{-1/2} x$ be the whitened representation. Then $\|\tilde{x} - \tilde{y}\|_2^2 = (\Sigma^{-1/2}(x-y))^\top (\Sigma^{-1/2}(x-y)) = (x-y)^\top \Sigma^{-1} (x-y) = d_M(x,y)^2$. The Mahalanobis distance accounts for correlations between dimensions and different scales: axes with high variance contribute less to the distance (they are 'shrunk'). For whitened data with $\Sigma = I$, Mahalanobis reduces to Euclidean. $\square$"
        corollaries={[
          'A Mahalanobis distance search can be performed as Euclidean search after whitening the data and query: pre-multiply both by $\\Sigma^{-1/2}$.',
          'Learning the metric $\\Sigma^{-1}$ is equivalent to learning a linear projection of the data — the key insight of linear metric learning methods (LMNN, NCA).',
        ]}
      />

      <ExampleBlock
        title="Choosing the Right Distance for Embedding Search"
        difficulty="intermediate"
        problem="You have L2-normalized sentence embeddings from SBERT (unit vectors on $\mathbb{S}^{d-1}$). Should you use L2 distance or cosine similarity for nearest-neighbor search? Show they are equivalent for unit-norm vectors."
        solution={[
          {
            step: 'Expand L2 distance for unit vectors',
            formula: '\\|u - v\\|_2^2 = u^\\top u - 2u^\\top v + v^\\top v = 1 - 2\\cos\\theta + 1 = 2(1 - \\cos\\theta)',
            explanation:
              'Since $\\|u\\|=\\|v\\|=1$, we have $u^\\top u = v^\\top v = 1$. The L2 squared distance equals $2(1 - \\text{cos\_sim}(u,v))$.',
          },
          {
            step: 'Monotone relationship',
            formula: '\\text{argmin}_v \\|u-v\\|_2 = \\text{argmax}_v \\cos(u,v)',
            explanation:
              'Since $2(1 - \\cos\\theta)$ is a monotonically decreasing function of $\\cos\\theta$, minimizing L2 distance is equivalent to maximizing cosine similarity for unit-norm vectors.',
          },
          {
            step: 'Practical implication',
            explanation:
              'For unit-norm embeddings, use whichever metric your ANN library supports more efficiently. FAISS IndexFlatIP uses inner product (= cosine for unit vectors). HNSW typically uses L2. Pre-normalize all vectors once, then use either metric interchangeably.',
          },
        ]}
      />

      <WarningBlock title="Hamming Distance Requires Binary Vectors">
        <p>
          Hamming distance counts the number of differing <em>bits</em> (or elements) between
          two vectors. It is only meaningful for binary vectors or discrete codes.
          When using Hamming distance with Product Quantization or locality-sensitive hashing,
          ensure vectors are properly binarized (e.g., via sign function or binary codes).
          Applying Hamming distance to continuous floating-point embeddings — comparing exact
          floating-point equality — will almost always return the maximum distance (all bits differ)
          due to floating-point precision. Use L2 or cosine distance for continuous embeddings.
        </p>
      </WarningBlock>

      <PythonCode
        code={`import numpy as np
from scipy.spatial.distance import cdist

# Sample vectors
a = np.array([1.0, 2.0, 3.0, 4.0])
b = np.array([2.0, 0.0, 3.0, 5.0])

# L1 (Manhattan)
l1 = np.sum(np.abs(a - b))
print(f"L1 distance:       {l1:.4f}")

# L2 (Euclidean)
l2 = np.linalg.norm(a - b)
print(f"L2 distance:       {l2:.4f}")

# Cosine similarity (manual)
cos_sim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
print(f"Cosine similarity: {cos_sim:.4f}")
print(f"Cosine distance:   {1 - cos_sim:.4f}")

# Mahalanobis (need covariance matrix)
data = np.random.randn(100, 4)
cov  = np.cov(data.T)
VI   = np.linalg.inv(cov)
diff = (a - b)
mahal = np.sqrt(diff @ VI @ diff)
print(f"Mahalanobis:       {mahal:.4f}")

# For unit-norm vectors: L2 vs cosine equivalence
a_norm = a / np.linalg.norm(a)
b_norm = b / np.linalg.norm(b)
l2_normed = np.linalg.norm(a_norm - b_norm)
cos_normed = np.dot(a_norm, b_norm)
print(f"\\nUnit vectors — L2^2 = {l2_normed**2:.4f}, 2(1-cos) = {2*(1-cos_normed):.4f}")
`}
        language="python"
        title="Distance Metrics with NumPy"
        runnable
      />
    </div>
  );
}
