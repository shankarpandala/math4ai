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
// Complexity curve O(n²) vs O(n) comparison
// ---------------------------------------------------------------------------
function ComplexityCurve() {
  const [dModel, setDModel] = useState(64);
  const seqLens = [128, 256, 512, 1024, 2048, 4096, 8192];

  const standard = useMemo(() =>
    seqLens.map((n) => ({ n, ops: n * n * dModel })), [dModel]);
  const linear = useMemo(() =>
    seqLens.map((n) => ({ n, ops: n * dModel * dModel })), [dModel]);

  const maxOps = Math.max(...standard.map((d) => d.ops));
  const W = 460, H = 220;
  const padL = 60, padR = 15, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const nLabels = ['128', '256', '512', '1K', '2K', '4K', '8K'];

  function xPos(i) { return padL + (i / (seqLens.length - 1)) * plotW; }
  function yPos(ops) { return padT + plotH * (1 - Math.min(ops / maxOps, 1)); }

  const stdPts = standard.map(({ ops }, i) => `${xPos(i)},${yPos(ops)}`).join(' ');
  const linPts = linear.map(({ ops }, i) => `${xPos(i)},${yPos(ops)}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Complexity: <InlineMath math="O(n^2 d)" /> vs <InlineMath math="O(nd^2)" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Linear attention replaces softmax with a kernel feature map, enabling <InlineMath math="O(nd^2)" /> complexity. When <InlineMath math="n \gg d" />, this is a dramatic saving. Adjust <InlineMath math="d" /> to see the crossover point.
      </p>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">d_model: {dModel}</label>
        <input type="range" min={16} max={256} step={16} value={dModel}
          onChange={(e) => setDModel(parseInt(e.target.value))}
          className="flex-1 accent-indigo-500" />
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block">
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const y = padT + plotH * (1 - f);
            return (
              <g key={f}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                <text x={padL - 5} y={y + 4} textAnchor="end" fontSize={9} className="fill-gray-500">
                  {(maxOps * f / 1e9).toFixed(1)}G
                </text>
              </g>
            );
          })}
          <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />

          {/* O(n^2 d) standard */}
          <polyline points={stdPts} fill="none" stroke="#ef4444" strokeWidth={2.5} />
          {standard.map(({ ops }, i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(ops)} r={3.5} fill="#ef4444" />
          ))}

          {/* O(nd^2) linear */}
          <polyline points={linPts} fill="none" stroke="#10b981" strokeWidth={2.5} />
          {linear.map(({ ops }, i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(ops)} r={3.5} fill="#10b981" />
          ))}

          {seqLens.map((_, i) => (
            <text key={i} x={xPos(i)} y={padT + plotH + 16}
              textAnchor="middle" fontSize={10} className="fill-gray-500">{nLabels[i]}</text>
          ))}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} className="fill-gray-500">Sequence length</text>

          <line x1={padL + 5} x2={padL + 25} y1={padT + 16} y2={padT + 16} stroke="#ef4444" strokeWidth={2} />
          <text x={padL + 30} y={padT + 20} fontSize={11} fill="#ef4444">Standard O(n²d)</text>
          <line x1={padL + 130} x2={padL + 150} y1={padT + 16} y2={padT + 16} stroke="#10b981" strokeWidth={2} />
          <text x={padL + 155} y={padT + 20} fontSize={11} fill="#10b981">Linear O(nd²)</text>
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Crossover at <InlineMath math="n = d^2 / d = d" />: linear attention wins when <InlineMath math="n \gg d" />.
        With d={dModel}, crossover is at n≈{dModel}.
      </p>
    </div>
  );
}

const LINEAR_ATTN_CODE = `import torch
import torch.nn.functional as F
import math

# ---------------------------------------------------------------------------
# Linear Attention (Katharopoulos et al., 2020)
# Replaces softmax with kernel feature map phi(x) = elu(x) + 1
# ---------------------------------------------------------------------------

def elu_feature_map(x):
    """ELU + 1 feature map — always positive, approximates exp."""
    return F.elu(x) + 1

def linear_attention(Q, K, V):
    """
    Linear attention: O(n * d^2) vs O(n^2 * d) for standard.
    Uses associativity: (phi(Q) @ (phi(K)^T @ V)) instead of (phi(Q) @ phi(K)^T) @ V

    Q, K, V: (B, H, T, d_k)
    Returns: (B, H, T, d_v)
    """
    Q = elu_feature_map(Q)   # (B, H, T, d_k) — positive
    K = elu_feature_map(K)   # (B, H, T, d_k) — positive

    # Key insight: compute K^T @ V first (d_k × d_v), then Q @ (K^T @ V)
    KV = K.transpose(-2, -1) @ V           # (B, H, d_k, d_v) — O(n * d^2)
    Z = (Q * K.sum(dim=-2, keepdim=True))  # normalizer
    # Actually: normalizer = Q @ K.sum(d=-2) to get (B, H, T, 1)
    norm = Q @ K.sum(dim=-2).unsqueeze(-1)  # (B, H, T, 1)
    output = (Q @ KV) / (norm + 1e-6)      # (B, H, T, d_v)
    return output

# ---------------------------------------------------------------------------
# Mamba-style State Space Model (simplified SSM recurrence)
# ---------------------------------------------------------------------------

class SimplifiedSSM(torch.nn.Module):
    """
    Simplified Mamba-like SSM layer for illustration.
    State space: h_t = A h_{t-1} + B x_t
                 y_t = C h_t + D x_t
    A is diagonal (structured), enabling O(n log n) parallel scan.
    """
    def __init__(self, d_model: int, d_state: int = 16):
        super().__init__()
        self.d_state = d_state
        # Learnable A (diagonal, initialized to HiPPO)
        self.A = torch.nn.Parameter(-torch.abs(torch.randn(d_state)))
        self.B = torch.nn.Linear(d_model, d_state, bias=False)
        self.C = torch.nn.Linear(d_state, d_model, bias=False)
        self.D = torch.nn.Parameter(torch.ones(d_model))

    def forward(self, x):
        B_size, T, d = x.shape
        # Recurrent form (O(n) inference)
        h = torch.zeros(B_size, self.d_state, device=x.device)
        outputs = []
        for t in range(T):
            h = torch.exp(self.A)[None, :] * h + self.B(x[:, t])
            y = self.C(h) + self.D * x[:, t]
            outputs.append(y)
        return torch.stack(outputs, dim=1)

# Compare outputs
B, H, T, d_k = 1, 4, 64, 32
Q = torch.randn(B, H, T, d_k)
K = torch.randn(B, H, T, d_k)
V = torch.randn(B, H, T, d_k)

lin_out = linear_attention(Q, K, V)
print("Linear attention output:", lin_out.shape)  # (1, 4, 64, 32)

ssm = SimplifiedSSM(d_model=128)
x_in = torch.randn(2, 64, 128)
ssm_out = ssm(x_in)
print("SSM output:", ssm_out.shape)               # (2, 64, 128)`;

export default function LinearAttention() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Linear Attention
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Kernel feature maps, <InlineMath math="O(n)" /> complexity, Performer, and state-space models including Mamba.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Linear Attention via Kernel Feature Maps"
        definition="Standard attention computes $\text{softmax}(QK^\top/\sqrt{d})V$, which requires materializing the $n\times n$ score matrix. Linear attention replaces the softmax with a kernel feature map $\phi: \mathbb{R}^d \to \mathbb{R}^r$ such that $\exp(q^\top k / \sqrt{d}) \approx \phi(q)^\top \phi(k)$. The output then becomes $\sum_j \phi(q_i)^\top \phi(k_j) v_j^\top / \sum_j \phi(q_i)^\top \phi(k_j) = \phi(q_i)^\top (\sum_j \phi(k_j) v_j^\top) / \phi(q_i)^\top (\sum_j \phi(k_j))$. By computing the sum $\sum_j \phi(k_j) v_j^\top \in \mathbb{R}^{r \times d}$ first, the total complexity drops to $O(nrd)$."
        notation="When $r = d$ (e.g., ELU+1 feature map), complexity is $O(nd^2)$. For long sequences with $n \gg d$, this is a dramatic improvement over $O(n^2 d)$."
      />

      <ComplexityCurve />

      <DefinitionBlock
        label="Definition 1.2"
        title="Performer (Random Features)"
        definition="Performer (Choromanski et al., 2020) approximates $\exp(q^\top k)$ using random Fourier features: $\phi(x) = (r)^{-1/2} [e^{\omega_1^\top x}, \ldots, e^{\omega_r^\top x}]$ where $\omega_i \sim \mathcal{N}(0, I)$. By the kernel approximation theorem, $\mathbb{E}[\phi(q)^\top \phi(k)] = \exp(q^\top k)$. Using $r = O(d \log d)$ features gives a good approximation with $O(nd \log d)$ complexity. FAVOR+ (Positive Random Features) ensures non-negative features, giving unbiased estimators."
        notation="The Performer achieves provably unbiased attention approximation with $O(nd \log d)$ time and $O(n)$ memory. Quality depends on number of random features $r$."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Linear Attention Recurrent Form"
        statement="Linear attention can be computed as a recurrence: define the state $S_t = \sum_{j \leq t} \phi(k_j) v_j^\top \in \mathbb{R}^{r \times d}$ and $z_t = \sum_{j \leq t} \phi(k_j) \in \mathbb{R}^r$. Then $S_t = S_{t-1} + \phi(k_t) v_t^\top$ and $o_t = \phi(q_t)^\top S_t / (\phi(q_t)^\top z_t)$. This recurrent form requires $O(1)$ computation per step (independent of sequence length), making causal linear attention ideal for efficient autoregressive inference."
        proof="Causal attention at step $t$: $o_t = \sum_{j=1}^t \phi(q_t)^\top \phi(k_j) v_j / \sum_{j=1}^t \phi(q_t)^\top \phi(k_j) = \phi(q_t)^\top (\sum_{j=1}^t \phi(k_j) v_j^\top) / \phi(q_t)^\top (\sum_{j=1}^t \phi(k_j))$. The sums $S_t = \sum_{j=1}^t \phi(k_j) v_j^\top$ and $z_t = \sum_{j=1}^t \phi(k_j)$ are updated incrementally: $S_t = S_{t-1} + \phi(k_t) v_t^\top$. Each update costs $O(rd)$ giving $O(nrd)$ total. $\square$"
        corollaries={[
          "The state $S_t \in \\mathbb{R}^{r \\times d}$ is a fixed-size memory, connecting linear attention to RNNs — the model compresses all past context into a constant-size state.",
          "Mamba (Gu & Dao, 2023) extends this idea with input-dependent ($x$-dependent) $A$ and $B$ matrices, overcoming the fixed-capacity limitation.",
        ]}
      />

      <ExampleBlock
        title="Linear vs Standard Attention FLOPs"
        difficulty="research"
        problem="For a 128K-token context ($n = 131{,}072$), $d_k = 128$, single head: compare FLOPs for (a) standard attention $O(n^2 d)$ and (b) linear attention $O(nd^2)$. What is the speedup ratio?"
        solution={[
          { step: "Standard attention FLOPs", formula: "n^2 \\times d_k = 131072^2 \\times 128 \\approx 2.2 \\times 10^{12} \\text{ FLOPs}", explanation: "Over 2 trillion FLOPs just for the QK^T matrix multiplication — infeasible at interactive speeds." },
          { step: "Linear attention FLOPs", formula: "n \\times d_k^2 = 131072 \\times 128^2 \\approx 2.1 \\times 10^9 \\text{ FLOPs}", explanation: "About 2 billion FLOPs — ~1000× fewer than standard attention." },
          { step: "Speedup ratio", formula: "\\frac{n^2 d}{n d^2} = \\frac{n}{d} = \\frac{131072}{128} = 1024\\times", explanation: "The speedup is exactly $n/d$, which grows with context length. At $n=1M$, $d=64$: speedup ~15,625×." },
        ]}
      />

      <WarningBlock title="Quality vs Speed Tradeoff">
        <ul className="space-y-2 text-sm">
          <li><strong>Linear attention is not exact.</strong> Replacing softmax with a kernel approximation loses the sharpening property of softmax — linear attention tends to underperform standard attention on tasks requiring hard retrieval (e.g., copying, associative recall). This gap narrows at scale.</li>
          <li className="mt-2"><strong>Mamba is not attention.</strong> Mamba-2 and state-space models use structured state matrices rather than softmax/kernel attention. They can match or exceed Transformer quality on many benchmarks but have different inductive biases.</li>
          <li className="mt-2"><strong>Hybrid architectures dominate.</strong> In 2024–2025, the leading architectures (Jamba, Zamba, Falcon Mamba) interleave standard attention layers (for hard retrieval) with SSM/linear attention layers (for efficiency), combining the strengths of both.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={LINEAR_ATTN_CODE} title="Linear Attention & Simplified SSM — PyTorch" runnable />
    </div>
  );
}
