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
// RoPE: rotation angle vs position visualizer
// ---------------------------------------------------------------------------
function RoPEViz() {
  const [maxPos, setMaxPos] = useState(32);
  const [dimIdx, setDimIdx] = useState(0);
  const [dModel, setDModel] = useState(64);

  // Compute rotation angles for multiple dimensions
  const dims = [0, 4, 8, 16];
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const angleData = useMemo(() => {
    return dims.map((i) => {
      const theta_i = Math.pow(10000, -2 * i / dModel);
      return Array.from({ length: maxPos }, (_, pos) => ({
        pos,
        angle: pos * theta_i,
        sin: Math.sin(pos * theta_i),
        cos: Math.cos(pos * theta_i),
      }));
    });
  }, [maxPos, dModel]);

  const W = 460, H = 200;
  const padL = 40, padB = 30, padT = 10, padR = 10;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxAngle = angleData[0][maxPos - 1].angle;

  function toSvgX(pos) { return padL + (pos / (maxPos - 1)) * plotW; }
  function toSvgY(val) { return padT + plotH - ((val + 1) / 2) * plotH; } // val in [-1,1]

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        RoPE: Rotation Angle vs Position
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each dimension pair $(2i, 2i+1)$ rotates at a different frequency. Low-index dims (like dim 0) rotate fast; high-index dims rotate slowly. Adjust parameters to see how frequency structure changes.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">Max pos: {maxPos}</label>
          <input type="range" min={8} max={128} step={8} value={maxPos}
            onChange={(e) => setMaxPos(parseInt(e.target.value))}
            className="flex-1 accent-indigo-500" />
        </div>
        <div className="flex items-center gap-3">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">d_model: {dModel}</label>
          <input type="range" min={16} max={128} step={16} value={dModel}
            onChange={(e) => setDModel(parseInt(e.target.value))}
            className="flex-1 accent-purple-500" />
        </div>
      </div>

      {/* Plot: cos(pos * theta_i) for selected dimensions */}
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block">
          {/* Grid lines */}
          {[-1, -0.5, 0, 0.5, 1].map((v) => (
            <line key={v} x1={padL} x2={W - padR} y1={toSvgY(v)} y2={toSvgY(v)}
              stroke="#e5e7eb" strokeWidth={1} />
          ))}
          {/* Zero line */}
          <line x1={padL} x2={W - padR} y1={toSvgY(0)} y2={toSvgY(0)}
            stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4,3" />
          {/* Y axis */}
          <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {/* Y labels */}
          {[-1, 0, 1].map((v) => (
            <text key={v} x={padL - 5} y={toSvgY(v) + 4} textAnchor="end" fontSize={10}
              className="fill-gray-500">{v}</text>
          ))}
          {/* X axis */}
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} className="fill-gray-500">Position</text>

          {/* Curves for each dimension */}
          {dims.map((di, ci) => {
            const pts = angleData[ci].map(({ pos, cos }) =>
              `${toSvgX(pos)},${toSvgY(cos)}`
            ).join(' ');
            return (
              <polyline key={di} points={pts} fill="none"
                stroke={colors[ci]} strokeWidth={1.8} opacity={0.85} />
            );
          })}

          {/* Legend */}
          {dims.map((di, ci) => (
            <g key={`leg-${ci}`}>
              <line x1={padL + 10 + ci * 90} x2={padL + 28 + ci * 90} y1={padT + 14} y2={padT + 14}
                stroke={colors[ci]} strokeWidth={2} />
              <text x={padL + 32 + ci * 90} y={padT + 18} fontSize={10} fill={colors[ci]}>dim {di}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Plotting <InlineMath math="\cos(\text{pos} \cdot \theta_i)" /> where <InlineMath math="\theta_i = 10000^{-2i/d}" />. Dim 0 oscillates most rapidly.
      </p>
    </div>
  );
}

const ROPE_CODE = `import torch
import torch.nn.functional as F

def precompute_rope_freqs(d_head: int, max_seq_len: int, base: float = 10000.0):
    """
    Precompute RoPE rotation angles for all positions and head dimensions.
    Returns: cos, sin tensors of shape (max_seq_len, d_head//2)
    """
    # theta_i = base^{-2i/d_head} for i in [0, d_head/2)
    i = torch.arange(0, d_head, 2, dtype=torch.float32)
    theta = 1.0 / (base ** (i / d_head))          # (d_head/2,)
    positions = torch.arange(max_seq_len).float()  # (max_seq_len,)
    freqs = torch.outer(positions, theta)           # (max_seq_len, d_head/2)
    return freqs.cos(), freqs.sin()

def apply_rope(x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
    """
    Apply RoPE to query or key tensor.
    x:   (B, n_heads, T, d_head)
    cos: (T, d_head//2)
    sin: (T, d_head//2)
    """
    # Split x into pairs along last dim
    x1 = x[..., ::2]   # even dims
    x2 = x[..., 1::2]  # odd dims
    # Broadcast cos/sin: (1, 1, T, d_head//2)
    cos = cos[None, None, :x.shape[2], :]
    sin = sin[None, None, :x.shape[2], :]
    # Rotation: [x1, x2] * [cos, cos] + [-x2, x1] * [sin, sin]
    x_rot1 = x1 * cos - x2 * sin
    x_rot2 = x1 * sin + x2 * cos
    # Interleave back
    x_out = torch.stack([x_rot1, x_rot2], dim=-1).flatten(-2)
    return x_out

# Usage
B, H, T, d_k = 2, 8, 16, 64
q = torch.randn(B, H, T, d_k)
k = torch.randn(B, H, T, d_k)

cos, sin = precompute_rope_freqs(d_head=d_k, max_seq_len=T)
q_rot = apply_rope(q, cos, sin)
k_rot = apply_rope(k, cos, sin)

# RoPE property: dot product depends only on relative position
scores = (q_rot @ k_rot.transpose(-2, -1)) / (d_k ** 0.5)
print("Rotary attention scores shape:", scores.shape)  # (2, 8, 16, 16)

# ALiBi: subtract linear bias based on relative distance
def alibi_bias(n_heads: int, seq_len: int) -> torch.Tensor:
    """ALiBi attention bias: (n_heads, seq_len, seq_len)"""
    slopes = torch.tensor([2 ** (-8 * (i+1) / n_heads) for i in range(n_heads)])
    positions = torch.arange(seq_len)
    dist = positions[None, :] - positions[:, None]  # relative distance
    bias = -slopes[:, None, None] * dist.abs()[None, :, :]
    # Causal: mask future positions
    causal = torch.triu(torch.full((seq_len, seq_len), float('-inf')), diagonal=1)
    return bias + causal[None, :, :]

alibi = alibi_bias(n_heads=8, seq_len=16)
print("ALiBi bias shape:", alibi.shape)  # (8, 16, 16)`;

export default function RopeAlibi() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          RoPE & ALiBi
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Rotary position embeddings and attention with linear biases — two modern approaches to encoding relative position with strong length extrapolation.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 2.1"
        title="Rotary Position Embedding (RoPE)"
        definition="RoPE encodes position by rotating query and key vectors in 2D subspaces before computing attention. For a query $q$ at position $m$ and key $k$ at position $n$, the rotated vectors are $\tilde{q}_m = R_m q$ and $\tilde{k}_n = R_n k$ where $R_m$ is a block-diagonal rotation matrix with $d/2$ blocks, each being a 2D rotation by angle $m\theta_i$. The attention score becomes $\tilde{q}_m^\top \tilde{k}_n = q^\top R_m^\top R_n k = q^\top R_{n-m} k$, which depends only on the relative offset $n-m$."
        notation="$\theta_i = 10000^{-2i/d}$ for $i \in \{0,1,\ldots,d/2-1\}$. Used in: Llama, Mistral, Falcon, GPT-NeoX, PaLM 2."
      />

      <RoPEViz />

      <DefinitionBlock
        label="Definition 2.2"
        title="ALiBi (Attention with Linear Biases)"
        definition="ALiBi adds a fixed, non-learned position bias to attention logits before softmax: $\text{score}(q_i, k_j) = q_i^\top k_j / \sqrt{d_k} - |i - j| \cdot m_h$ where $m_h > 0$ is a per-head slope that discourages attending to distant tokens. Different heads use different slopes, giving a geometric sequence $m_h = 2^{-8h/H}$ for $h = 1, \ldots, H$. The bias grows linearly with distance, acting as a soft recency bias."
        notation="ALiBi requires no positional embeddings added to token embeddings — position information enters only through attention scores. Used in: BLOOM (176B), MPT."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="RoPE Encodes Relative Position"
        statement="The inner product of RoPE-encoded query at position $m$ and key at position $n$ satisfies $\langle R_m q, R_n k \rangle = \langle R_{m-n} q, k \rangle$, i.e., the score depends only on the relative position $m - n$, not on absolute positions $m$ and $n$ individually. This makes RoPE a relative positional encoding, combining the efficiency of absolute PE (applied per-token, not per-pair) with the relative position sensitivity of methods like T5 relative PE."
        proof="The rotation matrix $R_m$ is block-diagonal with 2×2 rotation blocks $R_m^{(i)} = \begin{bmatrix}\cos m\theta_i & -\sin m\theta_i \\ \sin m\theta_i & \cos m\theta_i\end{bmatrix}$. Since $R_m^\top R_n = R_{n-m}$ (rotation composition: $(R_m)^\top = R_{-m}$, so $R_{-m} R_n = R_{n-m}$), we have $\langle R_m q, R_n k \rangle = q^\top R_m^\top R_n k = q^\top R_{n-m} k$. $\square$"
        corollaries={[
          "RoPE is equivalent to applying the complex exponential $e^{im\\theta}$ to each dimension pair, making it a form of complex-valued positional modulation.",
          "YaRN, LongRoPE, and other extensions scale $\\theta_i$ to improve extrapolation beyond the training context length.",
        ]}
      />

      <ExampleBlock
        title="RoPE vs Sinusoidal PE"
        difficulty="research"
        problem="Compare sinusoidal PE and RoPE on: (a) how position information is injected, (b) whether the attention score encodes absolute or relative position, (c) length extrapolation behavior."
        solution={[
          { step: "Injection mechanism", explanation: "Sinusoidal PE: added to token embeddings before the first layer — position affects every layer through the residual stream. RoPE: applied directly to Q and K before each attention operation in each layer — position modulates similarity computation directly without polluting the value stream." },
          { step: "Absolute vs relative", explanation: "Sinusoidal PE: the attention score $q_m^\top k_n$ mixes absolute positions in a non-trivial way; no clean relative position property. RoPE: $q_m^\top k_n = f(q, k, m-n)$ — provably depends only on relative offset." },
          { step: "Length extrapolation", explanation: "Sinusoidal PE: theoretically supports any length but empirically degrades significantly beyond training length. RoPE: with base scaling (NTK-aware scaling, YaRN), can extrapolate 8-32× beyond training length. ALiBi: best extrapolation — linear bias never saw an 'out of distribution' value; tested to 4× training length with minimal degradation." },
        ]}
      />

      <WarningBlock title="RoPE Implementation Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Apply to Q and K only, not V.</strong> The rotation must be applied to the query and key vectors; applying it to values would break the output representation.</li>
          <li className="mt-2"><strong>Dimension interleaving convention varies.</strong> Llama uses a split-half convention (all even dims then all odd dims); the original RoPE paper interleaves pairs. Mixing conventions causes silent bugs when loading checkpoints.</li>
          <li className="mt-2"><strong>Context length extension requires $\theta$ rescaling.</strong> Simply using RoPE-trained weights beyond the training length fails catastrophically. Use NTK scaling (multiply base by $(T_{\text{new}}/T_{\text{train}})^{d/(d-2)}$) or YaRN for robust extension.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={ROPE_CODE} title="RoPE and ALiBi — PyTorch Implementation" runnable />
    </div>
  );
}
