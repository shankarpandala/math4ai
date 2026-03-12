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
// HNSW Multi-Layer Graph Diagram with Search Path Animation
// ---------------------------------------------------------------------------

const W = 420;
const H = 320;

// Fixed node positions per layer
const LAYERS = [
  // Layer 2 (top): 3 nodes
  { y: 50, nodes: [
    { id: 0, x: 80 },
    { id: 2, x: 210 },
    { id: 5, x: 340 },
  ]},
  // Layer 1: 6 nodes
  { y: 155, nodes: [
    { id: 0, x: 80 },
    { id: 1, x: 160 },
    { id: 2, x: 210 },
    { id: 3, x: 270 },
    { id: 4, x: 310 },
    { id: 5, x: 340 },
  ]},
  // Layer 0 (bottom): 9 nodes
  { y: 265, nodes: [
    { id: 0, x: 40 },
    { id: 1, x: 90 },
    { id: 2, x: 140 },
    { id: 3, x: 190 },
    { id: 6, x: 230 },
    { id: 4, x: 280 },
    { id: 7, x: 320 },
    { id: 5, x: 360 },
    { id: 8, x: 400 },
  ]},
];

// Edges per layer (node id pairs)
const LAYER_EDGES = [
  [[0, 2], [2, 5]],  // Layer 2
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 2], [1, 3]],  // Layer 1
  [[0, 1], [1, 2], [2, 3], [3, 6], [6, 4], [4, 7], [7, 5], [5, 8], [0, 2], [3, 4]],  // Layer 0
];

// Search path steps: [layer, node_id, type='visit'|'entry']
const SEARCH_STEPS = [
  { layer: 2, nodeId: 0, type: 'entry' },
  { layer: 2, nodeId: 2, type: 'visit' },
  { layer: 2, nodeId: 5, type: 'visit' },
  { layer: 1, nodeId: 5, type: 'entry' },
  { layer: 1, nodeId: 4, type: 'visit' },
  { layer: 1, nodeId: 3, type: 'visit' },
  { layer: 0, nodeId: 4, type: 'entry' },
  { layer: 0, nodeId: 7, type: 'visit' },
  { layer: 0, nodeId: 6, type: 'visit' },  // nearest
];

// Query node position
const QUERY = { x: 305, y: 310 };

function HNSWDiagram() {
  const [step, setStep] = useState(0);

  const visitedUpTo = SEARCH_STEPS.slice(0, step + 1);

  function getNodePos(layerIdx, nodeId) {
    const layer = LAYERS[layerIdx];
    return layer.nodes.find((n) => n.id === nodeId) || null;
  }

  function isVisited(layerIdx, nodeId) {
    return visitedUpTo.some((s) => s.layer === layerIdx && s.nodeId === nodeId);
  }

  function isCurrent(layerIdx, nodeId) {
    const cur = SEARCH_STEPS[step];
    return cur && cur.layer === layerIdx && cur.nodeId === nodeId;
  }

  const layerLabels = ['Layer 2 (top)', 'Layer 1', 'Layer 0 (base)'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        HNSW Search Path Animation
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Step through the greedy search: enter at the top layer, greedily descend toward the
        query (red star), then refine at the base layer.
      </p>

      <svg width={W} height={H} className="mx-auto block mb-4" style={{ maxWidth: '100%' }}>
        {/* Layer backgrounds */}
        {[0, 1, 2].map((li) => (
          <rect
            key={li}
            x={10} y={LAYERS[li].y - 25}
            width={W - 20} height={50}
            rx={8}
            fill={li === 2 ? '#f5f3ff' : li === 1 ? '#f0fdf4' : '#fff7ed'}
            stroke={li === 2 ? '#c4b5fd' : li === 1 ? '#86efac' : '#fdba74'}
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {/* Layer labels */}
        {layerLabels.map((lbl, li) => (
          <text
            key={li}
            x={16} y={LAYERS[li].y - 10}
            fontSize={9} fill={li === 2 ? '#7c3aed' : li === 1 ? '#15803d' : '#c2410c'}
            fontWeight="600"
          >
            {lbl}
          </text>
        ))}

        {/* Edges */}
        {LAYER_EDGES.map((edges, li) =>
          edges.map(([a, b], ei) => {
            const pa = getNodePos(li, a);
            const pb = getNodePos(li, b);
            if (!pa || !pb) return null;
            return (
              <line
                key={`e${li}-${ei}`}
                x1={pa.x} y1={LAYERS[li].y}
                x2={pb.x} y2={LAYERS[li].y}
                stroke="#d1d5db" strokeWidth={1.5}
                className="dark:stroke-gray-600"
              />
            );
          })
        )}

        {/* Vertical "elevator" connections between layers */}
        {[0, 2, 5].map((nodeId) => {
          const p0 = getNodePos(0, nodeId);
          const p1 = getNodePos(1, nodeId);
          const p2 = getNodePos(2, nodeId);
          if (!p0 || !p1 || !p2) return null;
          return (
            <g key={`vert-${nodeId}`}>
              <line x1={p2.x} y1={LAYERS[2].y + 6} x2={p1.x} y2={LAYERS[1].y - 6}
                stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
              <line x1={p1.x} y1={LAYERS[1].y + 6} x2={p0.x} y2={LAYERS[0].y - 6}
                stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            </g>
          );
        })}

        {/* Nodes */}
        {LAYERS.map((layer, li) =>
          layer.nodes.map(({ id, x }) => {
            const visited = isVisited(li, id);
            const current = isCurrent(li, id);
            return (
              <circle
                key={`n${li}-${id}`}
                cx={x} cy={layer.y} r={current ? 9 : 7}
                fill={current ? '#ef4444' : visited ? '#6366f1' : '#e5e7eb'}
                stroke={current ? '#b91c1c' : visited ? '#4f46e5' : '#9ca3af'}
                strokeWidth={current ? 2.5 : 1.5}
                className="dark:stroke-gray-500"
              />
            );
          })
        )}

        {/* Query star */}
        <text x={QUERY.x} y={QUERY.y + 5} textAnchor="middle" fontSize={16} fill="#ef4444">★</text>
        <text x={QUERY.x + 14} y={QUERY.y + 5} fontSize={10} fill="#ef4444" fontWeight="700">Query</text>
      </svg>

      <div className="flex items-center gap-3 justify-center">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
          Step {step + 1} / {SEARCH_STEPS.length}
        </span>
        <button
          disabled={step === SEARCH_STEPS.length - 1}
          onClick={() => setStep((s) => s + 1)}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40"
        >
          Next →
        </button>
        <button
          onClick={() => setStep(0)}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
        {(() => {
          const cur = SEARCH_STEPS[step];
          if (cur.type === 'entry') return `Entering Layer ${cur.layer} at node ${cur.nodeId}`;
          if (step === SEARCH_STEPS.length - 1) return `Found approximate nearest neighbor at node ${cur.nodeId} (Layer 0)`;
          return `Greedy step: visiting node ${cur.nodeId} on Layer ${cur.layer}`;
        })()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import hnswlib
import numpy as np

# Build HNSW index
dim   = 128
n     = 100_000
M     = 16      # number of bi-directional links per node
ef_c  = 200     # construction ef (larger = better recall, slower build)
ef_s  = 64      # search ef (larger = better recall, slower search)

index = hnswlib.Index(space='cosine', dim=dim)
index.init_index(max_elements=n, ef_construction=ef_c, M=M)

# Add elements
data = np.random.randn(n, dim).astype(np.float32)
index.add_items(data)

# Search
index.set_ef(ef_s)
query = np.random.randn(1, dim).astype(np.float32)
labels, distances = index.knn_query(query, k=10)

print(f"Nearest neighbors: {labels[0]}")
print(f"Distances:         {distances[0].round(4)}")

# Recall evaluation
test = np.random.randn(100, dim).astype(np.float32)
approx_labels, _ = index.knn_query(test, k=10)

# Brute force ground truth
from sklearn.metrics.pairwise import cosine_distances
D = cosine_distances(test, data)
true_labels = np.argsort(D, axis=1)[:, :10]

# Recall@10
recall = np.mean([
    len(set(approx_labels[i]) & set(true_labels[i])) / 10
    for i in range(len(test))
])
print(f"Recall@10: {recall:.3f}")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function HNSW() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          HNSW
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Hierarchical Navigable Small World graphs — the state-of-the-art approximate nearest
          neighbor algorithm combining navigable small world graphs with a hierarchical structure.
        </p>
      </div>

      <HNSWDiagram />

      <DefinitionBlock
        label="Definition 1.1"
        title="Navigable Small World (NSW) Graph"
        definition="A navigable small world graph $G = (V, E)$ is a proximity graph where each node $v \in V$ (a data point) is connected to its $M$ nearest neighbors plus a set of 'long-range' links that enable efficient navigation. The graph has the small world property: average shortest path length is $O(\log |V|)$. Greedy search proceeds by always moving to the neighbor closest to the query, converging to a local minimum in $O(\log |V|)$ hops."
        notation="The key insight from small world theory: a graph with mostly local connections (clustering) plus a few random long-range links (low diameter) enables efficient greedy routing. NSW adds long-range connections naturally during incremental construction — early-inserted nodes accumulate many connections and serve as 'highways.'"
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="HNSW Index Structure"
        definition="HNSW organizes nodes into a hierarchy of $L$ layers. Node $v$ is present in all layers $0, 1, \ldots, \ell_v$ where $\ell_v \sim \lfloor -\ln(\text{Uniform}(0,1)) \cdot m_L \rfloor$ (geometric distribution). Layer 0 contains all nodes; higher layers contain exponentially fewer nodes. Each node has at most $M$ connections per layer (except layer 0 where it has $2M$). Search starts at the single entry point in the top layer."
        notation="Parameters: $M$ (max connections per layer, typically 16–64), $ef_{construction}$ (search beam width during construction, typically 100–200), $ef$ (search beam width during query, typically 64–256). Recall@k can be tuned by increasing $ef$ at query time without rebuilding the index."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="HNSW Search Complexity"
        statement="HNSW approximate nearest neighbor search achieves $O(\log n)$ average-case complexity for construction and $O(\log n)$ average-case hop count during search, where $n = |V|$ is the number of data points. The recall@1 approaches 1 as $ef \to n$, with recall@10 $> 0.99$ achievable in practice with $ef \approx 256$ for most datasets."
        proof="The top layers form a NSW graph over $O(1/m_L)$ fraction of nodes, enabling $O(\log n)$ traversal to the nearest neighborhood of the query. At each level, the number of nodes decreases by factor $e^{m_L}$ (geometric distribution), so the number of layers is $O(\log n)$. Within each layer, greedy search finds the local minimum in $O(\log n)$ steps (small world property). Total hops: $O(\log n) \times O(\log n) = O(\log^2 n)$ in the worst case, $O(\log n)$ on average. Construction is $O(n \log n)$. $\square$"
        corollaries={[
          'HNSW significantly outperforms IVF (which requires $O(\\sqrt{n})$ distance computations) on high-dimensional dense vectors at the same recall level.',
          'The hierarchy makes HNSW robust to intrinsic dimensionality: the top layers coarsely navigate, while lower layers refine, avoiding the full $O(n)$ comparison needed in flat indexes.',
        ]}
      />

      <ExampleBlock
        title="Tuning ef and M for 99% Recall@10"
        difficulty="advanced"
        problem="You're building a vector search system over 1M 768-dim sentence embeddings. Target: 99% Recall@10, latency < 5ms per query on 1 CPU core. How do you set M and ef?"
        solution={[
          {
            step: 'Start with M=16, ef_construction=200',
            explanation:
              'M=16 gives good recall with moderate memory (roughly $2 \\times M \\times 4$ bytes per node per layer = ~1.5GB for 1M vectors). Higher M improves recall but increases memory and build time quadratically.',
          },
          {
            step: 'Index build time estimate',
            formula: 'T_{build} \\approx O(n \\cdot ef_c \\cdot \\log n)',
            explanation:
              'For 1M vectors, ef_c=200: roughly 30-60 minutes on one CPU core. Parallelization helps but HNSW construction is partially sequential due to graph modifications.',
          },
          {
            step: 'Tune ef at query time for recall vs latency trade-off',
            explanation:
              'Fix M=16, vary ef from 32 to 512. Measure Recall@10 and QPS. Typically ef=128-256 achieves 99% Recall@10. Higher ef = better recall, lower QPS. Plot the recall-QPS Pareto frontier to choose the operating point.',
          },
          {
            step: 'Memory estimate',
            formula: 'Memory \\approx n \\times (d \\times 4 + M \\times 2 \\times 4) \\text{ bytes}',
            explanation:
              'For 1M × 768-dim float32: 768×4 = 3072 bytes/vector for data + ~128 bytes/vector for graph = ~3.2GB total. HNSW is memory-intensive; for memory-constrained systems, use IVF-PQ for compression.',
          },
        ]}
      />

      <WarningBlock title="HNSW Does Not Support Deletions Well">
        <p>
          Standard HNSW supports insertions and queries but not efficient deletions. Deleted
          nodes leave "holes" in the graph that can degrade search quality over time.
          Workarounds: (1) <strong>Soft delete</strong> with a filter at query time (wasteful
          for large deletion rates); (2) <strong>Rebuild the index</strong> periodically;
          (3) Use <strong>HNSW with lazy deletion</strong> (available in some libraries like
          hnswlib). For use cases with frequent updates (e.g., real-time document indexing),
          consider IVF-based indexes that are more amenable to online updates, or segment-based
          architectures (like Weaviate, Qdrant) that rebuild small segments incrementally.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="Building and Querying an HNSW Index with hnswlib"
        runnable
      />
    </div>
  );
}
