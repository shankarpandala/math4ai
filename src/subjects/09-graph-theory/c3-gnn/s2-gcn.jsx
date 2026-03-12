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
// Attention Weight Visualizer on Graph Edges
// ---------------------------------------------------------------------------

const ATT_NODES = [
  { id: 0, label: '0', x: 150, y: 70  },
  { id: 1, label: '1', x: 60,  y: 180 },
  { id: 2, label: '2', x: 240, y: 180 },
  { id: 3, label: '3', x: 110, y: 280 },
  { id: 4, label: '4', x: 200, y: 280 },
];

const ATT_EDGES = [[0,1],[0,2],[1,3],[2,4],[1,4],[3,4]];

// Precomputed sample attention weights (varying by selected node)
const ATTENTION_WEIGHTS = {
  0: { '0-1': 0.55, '0-2': 0.45, '1-3': 0.20, '2-4': 0.15, '1-4': 0.10, '3-4': 0.08 },
  1: { '0-1': 0.60, '0-2': 0.10, '1-3': 0.50, '2-4': 0.05, '1-4': 0.40, '3-4': 0.12 },
  2: { '0-1': 0.10, '0-2': 0.65, '1-3': 0.08, '2-4': 0.55, '1-4': 0.20, '3-4': 0.10 },
  3: { '0-1': 0.12, '0-2': 0.08, '1-3': 0.60, '2-4': 0.10, '1-4': 0.35, '3-4': 0.70 },
  4: { '0-1': 0.08, '0-2': 0.12, '1-3': 0.20, '2-4': 0.65, '1-4': 0.55, '3-4': 0.60 },
};

function edgeKey(u, v) {
  return `${Math.min(u,v)}-${Math.max(u,v)}`;
}

function AttentionViz() {
  const [focusNode, setFocusNode] = useState(0);

  const weights = ATTENTION_WEIGHTS[focusNode];
  const adjacentEdges = ATT_EDGES.filter(([u,v]) => u === focusNode || v === focusNode);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">GAT Attention Weight Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Select a focus node to see attention weights on its incident edges. Thicker edges = higher attention.
      </p>

      <div className="flex gap-2 mb-5">
        {ATT_NODES.map(n => (
          <button key={n.id} onClick={() => setFocusNode(n.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${focusNode === n.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
            {n.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <svg width={310} height={330} className="shrink-0">
          {ATT_EDGES.map(([u,v],i) => {
            const nu = ATT_NODES[u], nv = ATT_NODES[v];
            const key = edgeKey(u,v);
            const w = weights[key] || 0.1;
            const isAdj = u === focusNode || v === focusNode;
            const alpha = isAdj ? Math.max(0.2, w) : 0.15;
            const strokeW = isAdj ? 1 + w * 8 : 1.5;
            const color = isAdj ? `rgba(99,102,241,${alpha})` : '#e5e7eb';
            return (
              <g key={i}>
                <line x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y}
                  stroke={color} strokeWidth={strokeW} />
                {isAdj && (
                  <text x={(nu.x+nv.x)/2} y={(nu.y+nv.y)/2 - 6} textAnchor="middle"
                    fontSize={10} fill="#4f46e5" className="dark:fill-indigo-300" fontWeight="600">
                    {w.toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
          {ATT_NODES.map(node => {
            const isFocus = node.id === focusNode;
            const isAdj = ATT_EDGES.some(([u,v]) => (u === focusNode && v === node.id) || (v === focusNode && u === node.id));
            return (
              <g key={node.id} onClick={() => setFocusNode(node.id)} className="cursor-pointer">
                <circle cx={node.x} cy={node.y} r={22}
                  fill={isFocus ? '#4f46e5' : isAdj ? '#818cf8' : '#e5e7eb'}
                  stroke={isFocus ? '#312e81' : '#fff'} strokeWidth={isFocus ? 3 : 2} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={13} fontWeight="700"
                  fill={isFocus || isAdj ? '#fff' : '#6b7280'}>
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Attention weights for node {focusNode}
          </p>
          <div className="space-y-2">
            {adjacentEdges.map(([u,v]) => {
              const key = edgeKey(u,v);
              const w = weights[key] || 0;
              const neighbor = u === focusNode ? v : u;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-24">
                    {focusNode}→{neighbor}
                  </span>
                  <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                    <div className="rounded-full bg-indigo-500 h-2 transition-all" style={{ width: `${w*100}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 w-10">
                    {w.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3 text-xs text-indigo-800 dark:text-indigo-300">
            <strong>GAT attention formula:</strong><br/>
            <InlineMath math="\alpha_{ij} = \text{softmax}_j(\text{LeakyReLU}(\mathbf{a}^\top [\mathbf{W}\mathbf{h}_i \| \mathbf{W}\mathbf{h}_j]))" />
          </div>
        </div>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, GATConv

# ── GCN: Graph Convolutional Network (Kipf & Welling 2017) ────────────────────
class GCN(nn.Module):
    def __init__(self, in_channels, hidden, out_channels, num_layers=2):
        super().__init__()
        self.convs = nn.ModuleList()
        self.convs.append(GCNConv(in_channels, hidden))
        for _ in range(num_layers - 2):
            self.convs.append(GCNConv(hidden, hidden))
        self.convs.append(GCNConv(hidden, out_channels))
        self.dropout = nn.Dropout(0.5)

    def forward(self, x, edge_index):
        for conv in self.convs[:-1]:
            x = conv(x, edge_index)
            x = F.relu(x)
            x = self.dropout(x)
        return self.convs[-1](x, edge_index)

# GCN layer formula: H^(l+1) = sigma(D^{-1/2} A_hat D^{-1/2} H^(l) W^(l))
# where A_hat = A + I (self-loops added)
# Manual GCN forward (for understanding)
def gcn_forward_manual(A, H, W):
    """Manual GCN layer computation."""
    import numpy as np
    n = A.shape[0]
    A_hat = A + np.eye(n)  # Add self-loops
    D_hat = np.diag(A_hat.sum(1))
    D_inv_sqrt = np.diag(1.0 / np.sqrt(np.diag(D_hat)))
    A_norm = D_inv_sqrt @ A_hat @ D_inv_sqrt
    return np.tanh(A_norm @ H @ W)  # sigma = tanh

# ── GAT: Graph Attention Network (Velickovic et al. 2018) ─────────────────────
class GAT(nn.Module):
    def __init__(self, in_channels, hidden, out_channels, heads=4):
        super().__init__()
        self.conv1 = GATConv(in_channels, hidden, heads=heads, dropout=0.6)
        self.conv2 = GATConv(hidden * heads, out_channels, heads=1, concat=False, dropout=0.6)

    def forward(self, x, edge_index):
        x = F.dropout(x, p=0.6, training=self.training)
        x = F.elu(self.conv1(x, edge_index))
        x = F.dropout(x, p=0.6, training=self.training)
        return self.conv2(x, edge_index)

# ── Node classification training loop ────────────────────────────────────────
def train_gnn(model, data, epochs=200, lr=0.01):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=5e-4)
    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        out = model(data.x, data.edge_index)
        loss = F.cross_entropy(out[data.train_mask], data.y[data.train_mask])
        loss.backward()
        optimizer.step()
        if epoch % 50 == 0:
            model.eval()
            with torch.no_grad():
                pred = out.argmax(dim=1)
                acc = (pred[data.test_mask] == data.y[data.test_mask]).float().mean()
            print(f"Epoch {epoch}: loss={loss:.4f}, test_acc={acc:.4f}")
            model.train()

# Example with Cora dataset
from torch_geometric.datasets import Planetoid
dataset = Planetoid(root='/tmp/Cora', name='Cora')
data = dataset[0]

gcn_model = GCN(dataset.num_features, 64, dataset.num_classes)
train_gnn(gcn_model, data)

gat_model = GAT(dataset.num_features, 8, dataset.num_classes)
train_gnn(gat_model, data)
`;

export default function GCNandGAT() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          GCN &amp; GAT
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Graph Convolutional Networks and Graph Attention Networks — the two most widely used
          GNN architectures for node classification, link prediction, and graph classification.
        </p>
      </div>

      <NoteBlock title="Landmark Papers">
        <p>
          GCN (Kipf &amp; Welling, ICLR 2017) gave the first simple and scalable semi-supervised
          node classification method, becoming the most cited GNN paper. GAT (Velickovic et al.,
          ICLR 2018) introduced attention-weighted aggregation, allowing the network to learn
          which neighbors are most informative. Both build on the spectral graph convolution
          framework of Bruna et al. (2014) and Defferrard et al. (ChebNet, 2016).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 3.3"
        title="Graph Convolutional Network (GCN)"
        definition="A GCN layer performs: $H^{(l+1)} = \sigma(\hat{D}^{-1/2}\hat{A}\hat{D}^{-1/2} H^{(l)} W^{(l)})$, where $\hat{A} = A + I$ adds self-loops, $\hat{D}_{ii} = \sum_j \hat{A}_{ij}$ is the corresponding degree matrix, $W^{(l)}$ is a learnable weight matrix, $H^{(l)}$ are node features at layer $l$ (with $H^{(0)} = X$), and $\sigma$ is a nonlinearity. The propagation rule is a first-order approximation of spectral graph convolution."
        notation="The symmetric normalization $\hat{D}^{-1/2}\hat{A}\hat{D}^{-1/2}$ ensures each node's aggregated features are degree-normalized. This is equivalent to the normalized adjacency $\tilde{A}$ used in GNNs. Each GCN layer expands the receptive field by one hop."
      />

      <DefinitionBlock
        label="Definition 3.4"
        title="Graph Attention Network (GAT)"
        definition="A GAT layer computes attention weights $\alpha_{ij}$ between connected node pairs and uses them for weighted aggregation: $\mathbf{h}_i^{(l+1)} = \sigma\!\left(\sum_{j \in \mathcal{N}(i) \cup \{i\}} \alpha_{ij}^{(l)} W^{(l)} \mathbf{h}_j^{(l)}\right)$. Attention coefficients are: $\alpha_{ij} = \frac{\exp(\text{LeakyReLU}(\mathbf{a}^\top [W\mathbf{h}_i \| W\mathbf{h}_j]))}{\sum_{k \in \mathcal{N}(i)} \exp(\text{LeakyReLU}(\mathbf{a}^\top [W\mathbf{h}_i \| W\mathbf{h}_k]))}$. Multi-head attention uses $K$ independent attention mechanisms and concatenates (or averages) outputs."
        notation="$\mathbf{a} \in \mathbb{R}^{2F'}$ is a learnable attention vector. $\|$ denotes concatenation. Multi-head: $\mathbf{h}_i^{(l+1)} = \|_{k=1}^K \sigma(\sum_{j} \alpha_{ij}^k W^k \mathbf{h}_j)$. The last layer typically averages heads instead of concatenating."
      />

      <AttentionViz />

      <TheoremBlock
        label="Theorem 3.2"
        title="Spectral Interpretation of GCN"
        statement="The GCN propagation rule $\hat{D}^{-1/2}\hat{A}\hat{D}^{-1/2}$ is a first-order approximation of spectral graph convolution. Specifically, it corresponds to a polynomial spectral filter $g_\theta(\Lambda) \approx \theta_0 I$ truncated after the first-order Chebyshev expansion around $\lambda = 0$, after renormalization. This justifies GCN as a low-pass filter that smooths node features across the graph."
        proof="Spectral convolution: $g_\theta \star \mathbf{x} = U g_\theta(\Lambda) U^\top \mathbf{x}$ where $U$ are eigenvectors of the normalized Laplacian $\mathcal{L} = I - D^{-1/2}AD^{-1/2}$. ChebNet approximates $g_\theta(\Lambda) = \sum_k \theta_k T_k(\tilde\Lambda)$ with $\tilde\Lambda = 2\Lambda/\lambda_{max} - I$. Truncating at $K=1$ and setting $\lambda_{max} \approx 2$ gives $g_\theta \approx \theta_0 I + \theta_1(L-I) = \theta_0 I - \theta_1 D^{-1/2}AD^{-1/2}$. With single parameter $\theta = \theta_0 = -\theta_1$ and renormalization $A+I$, we get exactly the GCN rule. $\square$"
        corollaries={[
          "GCN is a low-pass filter: it smooths features across neighboring nodes, which is why deep GCNs suffer from over-smoothing — all features converge to the same value.",
          "GCN's linear complexity $O(|E| \\cdot d)$ per layer makes it scalable to millions of edges. GraphSAGE extends this to inductive settings by sampling a fixed number of neighbors.",
          "GAT's attention mechanism lets the network focus on relevant neighbors, improving performance on heterophilic graphs where connected nodes tend to have different labels.",
        ]}
      />

      <ExampleBlock
        title="Manual GCN Forward Pass"
        difficulty="advanced"
        problem="Compute one GCN layer for a 3-node path graph (A-B-C) with initial features $H^{(0)} = I_3$ and weight matrix $W = [1, 0; 0, 1]^T$ (identity)."
        solution={[
          { step: 'Build A-hat and D-hat', formula: '\\hat{A} = \\begin{pmatrix}1&1&0\\\\1&1&1\\\\0&1&1\\end{pmatrix}, \\quad \\hat{d} = [2, 3, 2]', explanation: 'Add self-loops to adjacency matrix; diagonal of D-hat gives row sums.' },
          { step: 'Symmetric normalization', formula: '\\hat{D}^{-1/2}\\hat{A}\\hat{D}^{-1/2} = \\begin{pmatrix}1/2 & 1/\\sqrt{6} & 0 \\\\ 1/\\sqrt{6} & 1/3 & 1/\\sqrt{6} \\\\ 0 & 1/\\sqrt{6} & 1/2\\end{pmatrix}', explanation: 'Entry (i,j) is A_hat_{ij} / sqrt(d_i * d_j).' },
          { step: 'Propagate with W = I', formula: 'H^{(1)} = \\sigma(\\hat{D}^{-1/2}\\hat{A}\\hat{D}^{-1/2})', explanation: 'With identity weight matrix, GCN just applies the normalized propagation and a nonlinearity.' },
          { step: 'Observe smoothing', formula: 'H^{(1)}_B = \\frac{1}{\\sqrt{6}}H_A + \\frac{1}{3}H_B + \\frac{1}{\\sqrt{6}}H_C', explanation: 'Node B averages contributions from A, itself, and C — low-pass smoothing of features.' },
        ]}
      />

      <WarningBlock title="GCN vs GAT: When to Use Which">
        <ul className="space-y-2 text-sm">
          <li><strong>GCN</strong> is faster (no attention weights to compute) and works well on homophilic graphs (connected nodes tend to share labels, e.g., citation networks). It treats all neighbors equally.</li>
          <li><strong>GAT</strong> adds <InlineMath math="O(|E|)" /> parameters for attention but can learn to ignore irrelevant neighbors. Preferred for heterophilic graphs or when neighbor importance varies significantly.</li>
          <li><strong>Over-smoothing</strong> affects both: keep layers to 2-4. For deeper networks, use residual connections, PairNorm, or DropEdge to mitigate over-smoothing.</li>
          <li><strong>Inductive vs transductive:</strong> Vanilla GCN requires the full graph during training (transductive). For inductive learning on new nodes, use GraphSAGE (neighbor sampling) or SIGN (precomputed propagation).</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="GCN & GAT with PyTorch Geometric" runnable />
    </div>
  );
}
