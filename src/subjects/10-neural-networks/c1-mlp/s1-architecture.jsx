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
// MLP Architecture Diagram
// ---------------------------------------------------------------------------

function MLPDiagram() {
  const [dims, setDims] = useState([3, 4, 4, 2]);
  const [hoverEdge, setHoverEdge] = useState(null);

  const SVG_W = 480, SVG_H = 280;
  const LAYER_XS = [60, 180, 300, 420];
  const MAX_NODES = 6;

  const nodePositions = dims.map((d, li) => {
    const count = Math.min(d, MAX_NODES);
    const spacing = SVG_H / (count + 1);
    return Array.from({ length: count }, (_, ni) => ({
      x: LAYER_XS[li], y: spacing * (ni + 1), isEllipsis: ni === MAX_NODES - 1 && d > MAX_NODES
    }));
  });

  const LAYER_NAMES = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];
  const COLORS = ['#94a3b8', '#818cf8', '#818cf8', '#f87171'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">MLP Architecture Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust layer dimensions to see the network structure. Hover over edges to highlight them.
      </p>

      <div className="flex flex-wrap gap-4 mb-5">
        {dims.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">{LAYER_NAMES[i]}</label>
            <input type="number" min={1} max={8} value={d}
              onChange={e => {
                const v = Math.max(1, Math.min(8, parseInt(e.target.value) || 1));
                setDims(dims.map((x, j) => j === i ? v : x));
              }}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
          </div>
        ))}
      </div>

      <svg width={SVG_W} height={SVG_H} className="mx-auto block">
        {/* Edges */}
        {nodePositions.slice(0,-1).map((layerNodes, li) =>
          layerNodes.map((srcNode, si) =>
            nodePositions[li+1].map((dstNode, di) => {
              const key = `${li}-${si}-${di}`;
              const isHover = hoverEdge === key;
              return (
                <line key={key} x1={srcNode.x+12} y1={srcNode.y} x2={dstNode.x-12} y2={dstNode.y}
                  stroke={isHover ? '#6366f1' : '#e5e7eb'}
                  strokeWidth={isHover ? 1.5 : 0.8}
                  onMouseEnter={() => setHoverEdge(key)} onMouseLeave={() => setHoverEdge(null)}
                  className="cursor-pointer dark:stroke-gray-700" />
              );
            })
          )
        )}
        {/* Nodes */}
        {nodePositions.map((layer, li) =>
          layer.map((node, ni) => (
            <g key={`${li}-${ni}`}>
              <circle cx={node.x} cy={node.y} r={12}
                fill={node.isEllipsis ? 'none' : COLORS[li]}
                stroke={node.isEllipsis ? COLORS[li] : 'none'} strokeWidth={1.5} />
              {node.isEllipsis && (
                <text x={node.x} y={node.y+4} textAnchor="middle" fontSize={12} fill={COLORS[li]}>⋮</text>
              )}
            </g>
          ))
        )}
        {/* Layer labels */}
        {dims.map((d, li) => (
          <g key={`lbl-${li}`}>
            <text x={LAYER_XS[li]} y={SVG_H - 8} textAnchor="middle" fontSize={11} fill="#6b7280" className="dark:fill-gray-400">
              {LAYER_NAMES[li]}
            </text>
            <text x={LAYER_XS[li]} y={SVG_H - 22} textAnchor="middle" fontSize={10} fill="#9ca3af" className="dark:fill-gray-500">
              d={d}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span>Parameters: W₁({dims[0]}×{dims[1]}) + b₁({dims[1]}) + W₂({dims[1]}×{dims[2]}) + b₂({dims[2]}) + W₃({dims[2]}×{dims[3]}) + b₃({dims[3]})</span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          = {dims[0]*dims[1]+dims[1]+dims[1]*dims[2]+dims[2]+dims[2]*dims[3]+dims[3]} parameters
        </span>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── MLP from scratch using nn.Linear ─────────────────────────────────────────
class MLP(nn.Module):
    def __init__(self, layer_dims, activation=nn.ReLU, dropout=0.0):
        super().__init__()
        layers = []
        for i in range(len(layer_dims) - 1):
            layers.append(nn.Linear(layer_dims[i], layer_dims[i+1]))
            if i < len(layer_dims) - 2:  # No activation after last layer
                layers.append(activation())
                if dropout > 0:
                    layers.append(nn.Dropout(dropout))
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

# Example: 3 → 64 → 64 → 2 classifier
model = MLP([3, 64, 64, 2], activation=nn.ReLU, dropout=0.2)

# ── Inspect the network ───────────────────────────────────────────────────────
x = torch.randn(32, 3)  # batch of 32, input dim 3
out = model(x)
print(f"Input: {x.shape}")
print(f"Output: {out.shape}")

# Count parameters
total = sum(p.numel() for p in model.parameters())
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Total parameters: {total:,}")
print(f"Trainable: {trainable:,}")

# ── Forward pass manually ─────────────────────────────────────────────────────
import numpy as np

def forward_pass(x, weights_biases):
    """Manual forward pass through MLP layers."""
    h = x
    for W, b in weights_biases[:-1]:
        h = np.maximum(0, h @ W.T + b)  # ReLU activation
    W, b = weights_biases[-1]
    return h @ W.T + b  # No activation on last layer

# Verify against PyTorch
W1 = model.net[0].weight.detach().numpy()
b1 = model.net[0].bias.detach().numpy()
W2 = model.net[2].weight.detach().numpy()
b2 = model.net[2].bias.detach().numpy()
W3 = model.net[4].weight.detach().numpy()
b3 = model.net[4].bias.detach().numpy()

x_np = x.numpy()
manual_out = forward_pass(x_np, [(W1,b1),(W2,b2),(W3,b3)])
torch_out  = model(x).detach().numpy()
# Note: dropout makes exact match impossible; disable for verification:
model.eval()
torch_out = model(x).detach().numpy()
print(f"Max diff (eval mode): {np.abs(manual_out - torch_out).max():.6f}")
`;

export default function MLPArchitecture() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          MLP Architecture
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The multilayer perceptron — layers, weights, biases, and the forward pass computation
          that underlies all deep learning.
        </p>
      </div>

      <NoteBlock title="Historical Note">
        <p>
          The perceptron was introduced by Rosenblatt (1958) as a single-layer model for binary
          classification. Minsky &amp; Papert (1969) showed its limitations (cannot learn XOR),
          causing the first "AI winter." The MLP with backpropagation (Rumelhart, Hinton &amp; Williams 1986)
          overcame these limitations. Modern deep MLPs (ResNets, Transformers) follow the same
          fundamental architecture with many engineering improvements.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Multilayer Perceptron"
        definition="An MLP with $L$ layers is a function $f: \mathbb{R}^{d_0} \to \mathbb{R}^{d_L}$ defined by: $\mathbf{h}^{(0)} = \mathbf{x}$, $\mathbf{z}^{(l)} = W^{(l)}\mathbf{h}^{(l-1)} + \mathbf{b}^{(l)}$, $\mathbf{h}^{(l)} = \sigma(\mathbf{z}^{(l)})$ for $l=1,\ldots,L-1$, $f(\mathbf{x}) = \mathbf{z}^{(L)}$ (or $\sigma(\mathbf{z}^{(L)})$ for classification). Here $W^{(l)} \in \mathbb{R}^{d_l \times d_{l-1}}$, $\mathbf{b}^{(l)} \in \mathbb{R}^{d_l}$, and $\sigma$ is a nonlinear activation function applied element-wise."
        notation="$\mathbf{z}^{(l)}$ is the pre-activation (logit), $\mathbf{h}^{(l)}$ is the post-activation (hidden state). $d_0$ is input dimension, $d_L$ is output dimension, $d_1,\ldots,d_{L-1}$ are hidden dimensions. Total parameters: $\sum_{l=1}^L d_l \cdot d_{l-1} + d_l$."
      />

      <MLPDiagram />

      <DefinitionBlock
        label="Definition 1.2"
        title="Layer Types &amp; Parameter Count"
        definition="A fully connected (dense) layer maps $\mathbb{R}^{d_{in}} \to \mathbb{R}^{d_{out}}$ via $\mathbf{z} = W\mathbf{x} + \mathbf{b}$ with $W \in \mathbb{R}^{d_{out}\times d_{in}}$, $\mathbf{b} \in \mathbb{R}^{d_{out}}$, totaling $d_{in} \cdot d_{out} + d_{out}$ parameters. The bias term allows the hyperplane $W\mathbf{x}+\mathbf{b}=0$ to not pass through the origin, essential for learning arbitrary decision boundaries. Without nonlinearities, stacking multiple linear layers collapses to a single linear transformation."
        notation="In PyTorch: nn.Linear(d_in, d_out, bias=True). The weight matrix W is initialized (Xavier or He), bias is usually initialized to zero. The computation is: $z_j = \sum_i W_{ji} x_i + b_j$ for each output neuron $j$."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Necessity of Nonlinearity"
        statement="A composition of $L$ linear transformations is equivalent to a single linear transformation: $W^{(L)} \cdots W^{(1)} = \tilde{W}$. Therefore, without nonlinear activation functions, an MLP with any number of layers can only represent linear functions and cannot learn XOR, spirals, or any non-linearly separable pattern."
        proof="By associativity of matrix multiplication: $f(\mathbf{x}) = W^{(L)}(W^{(L-1)}\cdots(W^{(1)}\mathbf{x}+\mathbf{b}^{(1)})\cdots+\mathbf{b}^{(L-1)})+\mathbf{b}^{(L)}$. Expanding: $f(\mathbf{x}) = (W^{(L)}\cdots W^{(1)})\mathbf{x} + \text{const} = \tilde{W}\mathbf{x} + \tilde{\mathbf{b}}$. This is an affine map, representable by a single layer. The rank of $\tilde{W}$ is at most $\min(d_1, \ldots, d_L)$, so multiple layers also don't increase the rank of the linear map. $\square$"
        corollaries={[
          "This motivates activation functions like ReLU, sigmoid, and tanh — they break the linearity, enabling MLPs to represent complex nonlinear functions.",
          "Even a single hidden layer with nonlinearity can approximate any continuous function (Universal Approximation Theorem) — depth primarily improves efficiency.",
          "The depth-width tradeoff: deeper networks can represent certain functions (e.g., parity) exponentially more efficiently than wide shallow networks.",
        ]}
      />

      <ExampleBlock
        title="Forward Pass Through a 2-Layer MLP"
        difficulty="intermediate"
        problem="Compute the forward pass of a 2-layer MLP with input $\mathbf{x} = [1, 2]$, $W^{(1)} = [[1,0],[0,1],[-1,1]]$, $\mathbf{b}^{(1)} = [0,1,-1]$, ReLU activation, $W^{(2)} = [[1,2,-1]]$, $\mathbf{b}^{(2)} = [0]$."
        solution={[
          { step: 'Layer 1 pre-activation', formula: '\\mathbf{z}^{(1)} = W^{(1)}\\mathbf{x} + \\mathbf{b}^{(1)} = [1, 3, -2]', explanation: 'z1 = 1·1+0·2+0=1; z2=0·1+1·2+1=3; z3=-1·1+1·2-1=-2.' },
          { step: 'Apply ReLU', formula: '\\mathbf{h}^{(1)} = \\text{ReLU}([1,3,-2]) = [1, 3, 0]', explanation: 'max(0, z) applied element-wise. The third neuron is deactivated (z=-2<0).' },
          { step: 'Layer 2 pre-activation', formula: 'z^{(2)} = W^{(2)}\\mathbf{h}^{(1)} + b^{(2)} = 1\\cdot1 + 2\\cdot3 + (-1)\\cdot0 + 0 = 7', explanation: 'Output is a scalar for this 1-output MLP.' },
          { step: 'Final output', formula: 'f(\\mathbf{x}) = z^{(2)} = 7', explanation: 'No activation on the last layer for regression. For classification, apply softmax.' },
        ]}
      />

      <WarningBlock title="Common MLP Mistakes">
        <ul className="space-y-2 text-sm">
          <li><strong>Forgetting bias:</strong> Without bias terms, all hyperplanes pass through the origin, severely restricting the function class. Always include bias (default in PyTorch's nn.Linear).</li>
          <li><strong>Applying activation after the last layer:</strong> For regression, do not apply ReLU or sigmoid after the output layer — it restricts the output range. For multi-class classification, cross-entropy loss in PyTorch expects logits (unnormalized), not softmax probabilities.</li>
          <li><strong>Width vs depth tradeoff:</strong> Increasing width (neurons per layer) often helps more than increasing depth for tabular data. For structured data (images, sequences), depth with appropriate architectures (CNN, RNN) is key.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="MLP in PyTorch — Architecture, Forward Pass, Parameter Count" runnable />
    </div>
  );
}
