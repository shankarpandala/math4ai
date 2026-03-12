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
// Message Passing Visualizer
// ---------------------------------------------------------------------------

const MP_NODES = [
  { id: 0, label: '0', x: 150, y: 60,  h: [1.0, 0.0] },
  { id: 1, label: '1', x: 60,  y: 160, h: [0.0, 1.0] },
  { id: 2, label: '2', x: 240, y: 160, h: [0.5, 0.5] },
  { id: 3, label: '3', x: 150, y: 260, h: [0.2, 0.8] },
];

const MP_EDGES = [[0,1],[0,2],[1,3],[2,3]];

function buildMPAdj(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([u,v]) => { adj[u].push(v); adj[v].push(u); });
  return adj;
}

const MP_ADJ = buildMPAdj(MP_NODES.length, MP_EDGES);

function aggregateMean(nodeFeatures, adj) {
  return nodeFeatures.map((h, i) => {
    const nbrs = adj[i];
    if (nbrs.length === 0) return h;
    const agg = h.map((_,d) => nbrs.reduce((s,n) => s + nodeFeatures[n][d], 0) / nbrs.length);
    // Simple update: mean of self + neighbors
    return h.map((v, d) => (v + agg[d]) / 2);
  });
}

function MessagePassingViz() {
  const [step, setStep] = useState(0);
  const [activeNode, setActiveNode] = useState(null);

  const initialFeatures = MP_NODES.map(n => n.h);
  const afterStep1 = aggregateMean(initialFeatures, MP_ADJ);
  const afterStep2 = aggregateMean(afterStep1, MP_ADJ);

  const stepsData = [initialFeatures, afterStep1, afterStep2];
  const currentFeatures = stepsData[step];

  const featToColor = (h) => {
    const r = Math.round(h[0] * 200 + 55);
    const b = Math.round(h[1] * 200 + 55);
    return `rgb(${r}, 100, ${b})`;
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Message Passing Aggregation</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Watch node features evolve through mean aggregation over <InlineMath math="k" /> layers.
        Node colors encode 2D features (red=dim0, blue=dim1).
      </p>

      <div className="flex gap-3 mb-5">
        {[0,1,2].map(s => (
          <button key={s} onClick={() => setStep(s)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${step === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
            Layer {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <svg width={310} height={330} className="shrink-0">
          {MP_EDGES.map(([u,v],i) => {
            const nu = MP_NODES[u], nv = MP_NODES[v];
            const isActive = activeNode !== null && (activeNode === u || activeNode === v);
            return (
              <line key={i} x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y}
                stroke={isActive ? '#6366f1' : '#d1d5db'}
                strokeWidth={isActive ? 2.5 : 1.5} />
            );
          })}
          {MP_NODES.map((node, i) => {
            const feat = currentFeatures[i];
            return (
              <g key={node.id} onMouseEnter={() => setActiveNode(node.id)} onMouseLeave={() => setActiveNode(null)} className="cursor-pointer">
                <circle cx={node.x} cy={node.y} r={24} fill={featToColor(feat)} stroke="#fff" strokeWidth={2} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={13} fontWeight="700" fill="#fff">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Node features at layer {step}
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Node</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">h[0]</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">h[1]</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Neighbors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {MP_NODES.map((node, i) => (
                  <tr key={node.id} className={activeNode === node.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}>
                    <td className="px-3 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{node.label}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">{currentFeatures[i][0].toFixed(3)}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">{currentFeatures[i][1].toFixed(3)}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">{MP_ADJ[i].join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            After {step} layer{step !== 1 ? 's' : ''}, each node's receptive field covers its {step}-hop neighborhood.
          </p>
        </div>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
from torch_geometric.nn import MessagePassing
from torch_geometric.utils import add_self_loops, degree

# ── Custom MPNN layer (mean aggregation + linear update) ──────────────────────
class MeanConv(MessagePassing):
    def __init__(self, in_channels, out_channels):
        super().__init__(aggr='mean')  # Mean aggregation
        self.lin = nn.Linear(in_channels, out_channels)

    def forward(self, x, edge_index):
        # edge_index: [2, num_edges] COO format
        edge_index, _ = add_self_loops(edge_index, num_nodes=x.size(0))
        return self.propagate(edge_index, x=x)

    def message(self, x_j):
        # x_j: source node features [num_edges, in_channels]
        return x_j  # Pass features unchanged

    def update(self, aggr_out):
        # aggr_out: aggregated messages [num_nodes, in_channels]
        return self.lin(aggr_out)

# ── GNN with multiple MPNN layers ────────────────────────────────────────────
class SimpleGNN(nn.Module):
    def __init__(self, in_dim, hidden_dim, out_dim, num_layers):
        super().__init__()
        self.convs = nn.ModuleList()
        self.convs.append(MeanConv(in_dim, hidden_dim))
        for _ in range(num_layers - 2):
            self.convs.append(MeanConv(hidden_dim, hidden_dim))
        self.convs.append(MeanConv(hidden_dim, out_dim))

    def forward(self, x, edge_index):
        for conv in self.convs[:-1]:
            x = conv(x, edge_index)
            x = torch.relu(x)
        return self.convs[-1](x, edge_index)

# Example usage
torch.manual_seed(42)
n_nodes, in_dim = 10, 4
x = torch.randn(n_nodes, in_dim)
edges = torch.tensor([[0,1,1,2,3,4],[1,0,2,1,4,3]], dtype=torch.long)

model = SimpleGNN(in_dim=4, hidden_dim=16, out_dim=2, num_layers=3)
out = model(x, edges)
print(f"Output shape: {out.shape}")  # [n_nodes, 2]

# ── WL Coloring (expressiveness test) ─────────────────────────────────────────
def wl_1_coloring(adj, max_iters=5):
    """1-dimensional WL graph isomorphism test via color refinement."""
    n = len(adj)
    colors = list(range(n))  # Initial: all distinct
    for _ in range(max_iters):
        new_colors = {}
        mapping = {}
        counter = [0]
        def get_color(sig):
            if sig not in mapping:
                mapping[sig] = counter[0]
                counter[0] += 1
            return mapping[sig]
        new_c = []
        for i in range(n):
            neighbor_colors = tuple(sorted(colors[j] for j in adj[i]))
            sig = (colors[i], neighbor_colors)
            new_c.append(get_color(sig))
        if new_c == colors:
            break
        colors = new_c
    return colors

adj = {0:[1,2], 1:[0,3], 2:[0,3], 3:[1,2]}
print("WL colors:", wl_1_coloring(adj))
`;

export default function MessagePassing() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Message Passing Framework
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The unifying framework for graph neural networks — message passing, aggregation
          functions, expressiveness, and the Weisfeiler-Leman graph isomorphism test.
        </p>
      </div>

      <NoteBlock title="MPNN Framework Origin">
        <p>
          The Message Passing Neural Network (MPNN) framework was formalized by Gilmer et al.
          (2017) in "Neural Message Passing for Quantum Chemistry," unifying many prior GNN
          variants (Kipf &amp; Welling GCN, Hamilton GraphSAGE, Velickovic GAT) under a single
          framework. The expressiveness connection to WL was established by Xu et al. (2019)
          in "How Powerful are Graph Neural Networks?" and Morris et al. (2019).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 3.1"
        title="Message Passing Neural Network (MPNN)"
        definition="An MPNN operates on a graph $G=(V,E)$ with node features $\mathbf{h}_v^{(0)} = \mathbf{x}_v$ and performs $K$ rounds of message passing. At each layer $k$: (1) Message: $\mathbf{m}_{uv}^{(k)} = M_k(\mathbf{h}_u^{(k-1)}, \mathbf{h}_v^{(k-1)}, \mathbf{e}_{uv})$ for each edge $(u,v)$. (2) Aggregate: $\mathbf{a}_v^{(k)} = \text{AGG}_k(\{\mathbf{m}_{uv}^{(k)} : u \in \mathcal{N}(v)\})$. (3) Update: $\mathbf{h}_v^{(k)} = U_k(\mathbf{h}_v^{(k-1)}, \mathbf{a}_v^{(k)})$. Here $M_k$, $\text{AGG}_k$, $U_k$ are learnable functions."
        notation="$\mathcal{N}(v)$ is the neighborhood of $v$. AGG must be a permutation-invariant function (sum, mean, max) since neighbors have no canonical ordering. After $K$ layers, $\mathbf{h}_v^{(K)}$ summarizes the $K$-hop neighborhood of $v$. Graph-level output: $\hat{y} = R(\{\mathbf{h}_v^{(K)} : v \in V\})$ using a readout function $R$."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Weisfeiler-Leman (WL) Graph Isomorphism Test"
        definition="The 1-WL test (color refinement) iteratively assigns colors to nodes based on their current color and the multiset of neighbor colors. At step $t$: $c_v^{(t+1)} = \text{hash}(c_v^{(t)}, \{\{c_u^{(t)} : u \in \mathcal{N}(v)\}\})$, where $\{\{\cdot\}\}$ denotes a multiset. Two graphs are declared non-isomorphic if their color histograms differ at any step. The test is a necessary but not sufficient condition for isomorphism."
        notation="1-WL fails to distinguish regular graphs with the same degree sequence. The $k$-WL hierarchy uses $k$-tuples of nodes; 2-WL equals 1-WL; 3-WL can distinguish all graphs that 1-WL cannot. MPNNs with injective aggregation are at most as powerful as 1-WL (Xu et al. 2019)."
      />

      <MessagePassingViz />

      <TheoremBlock
        label="Theorem 3.1"
        title="Expressiveness of MPNNs (Xu et al. 2019)"
        statement="Any MPNN with a sufficient number of layers is at most as powerful as the 1-WL test in distinguishing non-isomorphic graphs. Conversely, if the aggregation function is injective (i.e., maps different multisets to different outputs), then the MPNN is exactly as powerful as 1-WL. The Graph Isomorphism Network (GIN) achieves this maximum expressiveness with aggregation $\mathbf{h}_v^{(k)} = \text{MLP}((1+\epsilon)\mathbf{h}_v^{(k-1)} + \sum_{u \in \mathcal{N}(v)} \mathbf{h}_u^{(k-1)})$."
        proof="(Upper bound) Each MPNN layer maps $(h_v, \{\{h_u : u\in\mathcal{N}(v)\}\}) \to h_v^+$. This is structurally identical to one step of WL color refinement. If two nodes have the same WL color at step $k$ for all $k$, they will also have the same MPNN hidden state at every layer, so the MPNN cannot distinguish them — giving the 1-WL upper bound. (Lower bound) An injective aggregation can hash any multiset to a unique value; by the universal approximation theorem, an MLP can approximate any such injective function over a countable domain. $\square$"
        corollaries={[
          "Mean and max aggregation are strictly less expressive than sum aggregation — they cannot distinguish graphs like two triangles vs. one hexagon.",
          "1-WL (and thus standard MPNNs) cannot distinguish regular graphs with the same degree, e.g., the 3-regular Petersen graph vs. the 3-regular complete bipartite graph $K_{3,3}$.",
          "To go beyond 1-WL, one must incorporate global information (e.g., random node features, higher-order WL, structural encodings like cycle counts or distance encodings).",
        ]}
      />

      <ExampleBlock
        title="Mean vs Sum Aggregation: Expressiveness Difference"
        difficulty="advanced"
        problem="Show that mean aggregation cannot distinguish the following two graphs: Graph 1: two isolated nodes each with 2 neighbors. Graph 2: one node with 2 neighbors, one node with 4 neighbors of the same feature value."
        solution={[
          { step: 'Setup', formula: 'h_v^{(0)} = 1 \\text{ for all } v', explanation: 'All nodes start with the same feature.' },
          { step: 'Mean aggregation, layer 1', formula: 'h_v^{(1)} = \\text{MEAN}(\\{h_u : u \\in \\mathcal{N}(v)\\}) = 1', explanation: 'Mean of a set of 1s is always 1, regardless of how many neighbors there are.' },
          { step: 'Sum aggregation, layer 1', formula: 'h_v^{(1)} = \\text{SUM} = \\deg(v) \\cdot 1 = \\deg(v)', explanation: 'Sum aggregation preserves degree information — nodes with 2 vs 4 neighbors get different features.' },
          { step: 'Conclusion', formula: 'h_v^{(1)}_{\\text{mean}} = 1 = h_u^{(1)}_{\\text{mean}} \\text{ for all } v,u', explanation: 'Mean aggregation cannot distinguish different-degree nodes starting from uniform features. Sum (used in GIN) can.' },
        ]}
      />

      <WarningBlock title="MPNN Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Over-smoothing:</strong> With many layers, all node representations converge to the same value — the GNN loses the ability to distinguish nodes. Typically, 2-4 layers is optimal for most graphs.</li>
          <li><strong>Over-squashing:</strong> Exponentially many nodes are compressed into a fixed-size vector as depth increases. Bottleneck at nodes with low Cheeger constant (graph bottlenecks). Mitigated by graph rewiring.</li>
          <li><strong>Permutation invariance:</strong> Aggregation functions must be permutation-invariant. Common mistake: using concatenation (ordered) instead of multiset aggregation (unordered) — breaks the MPNN framework for undirected graphs.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="MPNN with PyTorch Geometric" runnable />
    </div>
  );
}
