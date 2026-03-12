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
// IVF-PQ Visualization: Cluster Assignment + Quantization
// ---------------------------------------------------------------------------

// 20 random 2D points pre-assigned to 4 clusters
const POINTS = [
  { x: 80,  y: 70,  cluster: 0 },
  { x: 100, y: 90,  cluster: 0 },
  { x: 65,  y: 85,  cluster: 0 },
  { x: 90,  y: 110, cluster: 0 },
  { x: 230, y: 60,  cluster: 1 },
  { x: 250, y: 80,  cluster: 1 },
  { x: 210, y: 75,  cluster: 1 },
  { x: 240, y: 100, cluster: 1 },
  { x: 80,  y: 210, cluster: 2 },
  { x: 100, y: 230, cluster: 2 },
  { x: 60,  y: 225, cluster: 2 },
  { x: 90,  y: 250, cluster: 2 },
  { x: 230, y: 210, cluster: 3 },
  { x: 250, y: 230, cluster: 3 },
  { x: 210, y: 220, cluster: 3 },
  { x: 240, y: 250, cluster: 3 },
  { x: 140, y: 150, cluster: 0 },
  { x: 160, y: 140, cluster: 1 },
  { x: 135, y: 170, cluster: 2 },
  { x: 165, y: 165, cluster: 3 },
];

const CENTROIDS = [
  { x: 87,  y: 89  },
  { x: 233, y: 79  },
  { x: 83,  y: 229 },
  { x: 233, y: 229 },
];

const CLUSTER_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function IVFPQDiagram() {
  const [query, setQuery] = useState({ x: 150, y: 130 });
  const [nprobe, setNprobe] = useState(2);
  const [dragging, setDragging] = useState(false);

  // Find nprobe nearest centroids to query
  const centroidDists = CENTROIDS.map((c, i) => ({
    i,
    dist: Math.sqrt((c.x - query.x) ** 2 + (c.y - query.y) ** 2),
  })).sort((a, b) => a.dist - b.dist);

  const probeSet = new Set(centroidDists.slice(0, nprobe).map((d) => d.i));

  function handleSvgClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 320;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    setQuery({ x, y });
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        IVF Cluster Assignment Diagram
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Click to move the query (★). Highlighted clusters are probed — only points in probed
        cells are compared. Increase <code>nprobe</code> for higher recall.
      </p>

      <div className="flex flex-col gap-4 md:flex-row">
        <svg
          width={320} height={300}
          className="shrink-0 mx-auto cursor-crosshair rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
          onClick={handleSvgClick}
          viewBox="0 0 320 300"
        >
          {/* Cluster regions (convex regions approximated by circles) */}
          {CENTROIDS.map((c, i) => (
            <circle
              key={`cr-${i}`}
              cx={c.x} cy={c.y} r={70}
              fill={CLUSTER_COLORS[i]}
              opacity={probeSet.has(i) ? 0.15 : 0.04}
              stroke={CLUSTER_COLORS[i]}
              strokeWidth={probeSet.has(i) ? 2 : 0.5}
              strokeDasharray={probeSet.has(i) ? 'none' : '4 3'}
            />
          ))}

          {/* Data points */}
          {POINTS.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={p.x} cy={p.y} r={5}
              fill={CLUSTER_COLORS[p.cluster]}
              opacity={probeSet.has(p.cluster) ? 1 : 0.25}
              stroke="white"
              strokeWidth={1}
            />
          ))}

          {/* Centroids */}
          {CENTROIDS.map((c, i) => (
            <polygon
              key={`cen-${i}`}
              points="0,-8 6,6 -6,6"
              fill={CLUSTER_COLORS[i]}
              stroke="white"
              strokeWidth={1.5}
              transform={`translate(${c.x},${c.y})`}
              opacity={probeSet.has(i) ? 1 : 0.4}
            />
          ))}

          {/* Query */}
          <text x={query.x} y={query.y + 6} textAnchor="middle" fontSize={18} fill="#1e293b" className="dark:fill-gray-100">
            ★
          </text>
          <text x={query.x} y={query.y - 12} textAnchor="middle" fontSize={10} fill="#374151" fontWeight="700" className="dark:fill-gray-200">
            Query
          </text>
        </svg>

        <div className="flex-1 space-y-4">
          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">nprobe (cells to search)</label>
              <span className="font-mono text-sm font-bold text-indigo-600">{nprobe}</span>
            </div>
            <input
              type="range" min={1} max={4} step={1} value={nprobe}
              onChange={(e) => setNprobe(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Cluster distances from query</p>
            {centroidDists.map(({ i, dist }) => (
              <div
                key={i}
                className={`flex justify-between rounded-lg px-3 py-2 text-sm ${probeSet.has(i) ? 'font-bold' : 'opacity-50'}`}
                style={{
                  background: CLUSTER_COLORS[i] + '18',
                  border: `1px solid ${CLUSTER_COLORS[i]}${probeSet.has(i) ? '80' : '30'}`,
                }}
              >
                <span style={{ color: CLUSTER_COLORS[i] }}>Cluster {i} {probeSet.has(i) ? '✓ probed' : ''}</span>
                <span className="font-mono">{dist.toFixed(1)}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Points in probed clusters: {POINTS.filter((p) => probeSet.has(p.cluster)).length} / {POINTS.length}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import faiss
import numpy as np

d   = 128   # vector dimension
n   = 1_000_000  # number of vectors
nq  = 1000  # number of queries

# Training data
xt = np.random.randn(n, d).astype(np.float32)
xq = np.random.randn(nq, d).astype(np.float32)

# --- IVF-Flat (no compression) ---
nlist = 1024   # number of Voronoi cells
quantizer = faiss.IndexFlatL2(d)
index_ivf = faiss.IndexIVFFlat(quantizer, d, nlist, faiss.METRIC_L2)
index_ivf.train(xt)
index_ivf.add(xt)
index_ivf.nprobe = 32   # probe 32 cells at query time

D, I = index_ivf.search(xq, 10)
print(f"IVF-Flat top-10: {I[0]}")

# --- IVF-PQ (with Product Quantization compression) ---
# PQ parameters: m=8 sub-quantizers, 8 bits each -> 8 bytes per vector
m     = 8   # number of sub-spaces (must divide d)
nbits = 8   # bits per sub-quantizer (256 centroids per sub-space)
index_pq = faiss.IndexIVFPQ(quantizer, d, nlist, m, nbits)
index_pq.train(xt)
index_pq.add(xt)
index_pq.nprobe = 32

D_pq, I_pq = index_pq.search(xq, 10)
print(f"IVF-PQ top-10: {I_pq[0]}")

# Memory comparison
bytes_flat = n * d * 4  # float32
bytes_pq   = n * m      # m bytes per vector after PQ
print(f"\\nMemory — Flat: {bytes_flat/1e6:.0f} MB, PQ: {bytes_pq/1e6:.0f} MB")
print(f"Compression ratio: {bytes_flat // bytes_pq}x")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function IvfPq() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          IVF &amp; Product Quantization
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Inverted file indexes with product quantization compression — the foundation of
          FAISS and billion-scale vector search systems.
        </p>
      </div>

      <IVFPQDiagram />

      <DefinitionBlock
        label="Definition 2.1"
        title="Inverted File Index (IVF)"
        definition="An IVF index partitions the vector space into $k$ Voronoi cells using k-means clustering. Each cell $C_i$ is represented by its centroid $c_i$. During indexing, each vector $x$ is assigned to its nearest centroid: $\text{cell}(x) = \arg\min_i \|x - c_i\|$. An inverted list $L_i$ stores all vectors in cell $C_i$. At query time, only the $nprobe \leq k$ nearest cells to the query are searched, reducing computation from $O(n)$ to $O(nprobe \cdot n/k)$."
        notation="Typical values: $k = 1024$ to $65536$ cells for 1M–1B vectors. $nprobe$ controls the recall-speed trade-off: $nprobe=1$ is fastest (lowest recall); $nprobe=k$ is equivalent to brute force (full recall). The rule of thumb: use $k \approx \sqrt{n}$ cells and $nprobe \approx \sqrt{k}$."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Product Quantization (PQ)"
        definition="Product Quantization compresses $d$-dimensional vectors into compact $m$-byte codes. The vector $x \in \mathbb{R}^d$ is split into $m$ sub-vectors of dimension $d/m$: $x = [x^{(1)}, \ldots, x^{(m)}]$. Each sub-vector $x^{(j)} \in \mathbb{R}^{d/m}$ is independently quantized to one of $k^* = 2^{b}$ centroids (for $b$ bits), producing a 1-byte code ($b=8$). The compressed representation is $m$ bytes. The approximated vector is $\hat{x} = [\hat{x}^{(1)}, \ldots, \hat{x}^{(m)}]$ where $\hat{x}^{(j)}$ is the quantization centroid."
        notation="Compression ratio: from $d \times 4$ bytes (float32) to $m$ bytes — for $d=128, m=8$: 512 bytes → 8 bytes, a 64× reduction. The quantization error $\|x - \hat{x}\|^2$ determines approximation quality. The expected distortion decreases as $k^*$ increases (more centroids) or $m$ increases (more sub-spaces, less aggressive compression per sub-space)."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Asymmetric Distance Computation (ADC)"
        statement="Product Quantization enables fast approximate distance computation via lookup tables. Given query $q$ and $n$ PQ-compressed database vectors $\hat{x}_1, \ldots, \hat{x}_n$, the approximate distance $d(q, x_i) \approx d(q, \hat{x}_i)$ can be computed for all $n$ vectors in $O(m \cdot n)$ additions using pre-computed lookup tables, compared to $O(d \cdot n)$ floating-point multiply-adds for exact distances."
        proof="Decompose: $\|q - \hat{x}\|^2 = \sum_{j=1}^m \|q^{(j)} - \hat{x}^{(j)}\|^2$. Pre-compute a lookup table $T[j][c] = \|q^{(j)} - c_j^{(c)}\|^2$ for all $j \in [m]$, $c \in [k^*]$ — this costs $O(m \cdot k^* \cdot d/m) = O(d \cdot k^*)$ operations. Then for each database vector (stored as $m$ centroid indices), the distance is $\sum_j T[j][\text{code}_j(x)]$ — $m$ table lookups and additions. Total: $O(m \cdot n)$ operations. Since $m \ll d$ (typically $m=8$ vs $d=128$), this is a $d/m = 16\times$ speedup over exact computation. $\square$"
        corollaries={[
          'Symmetric Distance Computation (SDC) approximates both $q$ and $x$, allowing faster lookup but lower accuracy. ADC (query uncompressed, database compressed) is preferred in practice.',
          'FAISS IVFPQ combines IVF coarse quantization with PQ fine quantization: IVF prunes clusters, PQ compresses within-cluster vectors for fast ADC.',
        ]}
      />

      <ExampleBlock
        title="Memory Budget: Comparing Flat, IVF-Flat, IVF-PQ for 100M Vectors"
        difficulty="advanced"
        problem="You have 100M vectors of dimension d=768 (float32). Compare memory requirements and approximate search performance for three FAISS index types."
        solution={[
          {
            step: 'Flat (brute force)',
            formula: '100\\text{M} \\times 768 \\times 4 = 307\\text{ GB}',
            explanation:
              'Stores all vectors as float32. Exact search. Completely infeasible for memory (even with 8x A100 GPUs at 80GB each). Only viable for <1M vectors.',
          },
          {
            step: 'IVF-Flat (k=16384 cells)',
            formula: '100\\text{M} \\times 768 \\times 4 + 16384 \\times 768 \\times 4 \\approx 307\\text{ GB}',
            explanation:
              'Same vector storage as Flat, plus centroids. IVF reduces latency via cell pruning but not memory. Still infeasible without a vector store infrastructure.',
          },
          {
            step: 'IVF-PQ (k=65536, m=48, 8-bit)',
            formula: '100\\text{M} \\times 48 + \\text{centroids} \\approx 4.8\\text{ GB}',
            explanation:
              '48 bytes per vector (vs 3072 bytes for float32) — 64× compression. Approximate search with Recall@10 ~0.90-0.95 achievable with nprobe=64. Fits in a single GPU.',
          },
          {
            step: 'OPQ pre-processing for better PQ performance',
            explanation:
              'Optimized Product Quantization (OPQ) applies a learned rotation $R$ to vectors before PQ, minimizing quantization error by better aligning the data with the PQ sub-space decomposition. Typically adds 1-3% Recall@10 vs plain PQ with negligible extra memory.',
          },
        ]}
      />

      <WarningBlock title="PQ Codebook Must Be Trained on Representative Data">
        <p>
          PQ centroids are learned via k-means on a training set. If the training distribution
          differs significantly from the query/database distribution (e.g., the index is
          fine-tuned on a new domain), search recall degrades substantially. Always retrain
          the PQ codebook when the embedding model changes. Additionally, PQ assumes sub-vector
          components are approximately independent — if the model produces strongly correlated
          embedding dimensions (common with pre-trained Transformers), apply OPQ or LOPQ
          (Locally Optimized PQ) to decorrelate dimensions before quantization.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="FAISS IVF-Flat and IVF-PQ Index Construction"
        runnable
      />
    </div>
  );
}
