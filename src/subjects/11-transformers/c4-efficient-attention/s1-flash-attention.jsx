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
// Memory usage comparison chart: standard vs flash attention
// ---------------------------------------------------------------------------
function MemoryComparisonChart() {
  const [dModel, setDModel] = useState(64);

  const seqLens = [512, 1024, 2048, 4096, 8192, 16384];
  const float16Bytes = 2;

  const standard = useMemo(() =>
    seqLens.map((n) => ({
      n,
      // n×n attention matrix + n×d output
      mem: (n * n * float16Bytes + n * dModel * float16Bytes) / 1024 / 1024,
    })), [dModel]);

  const flash = useMemo(() =>
    seqLens.map((n) => ({
      n,
      // O(n) — just Q, K, V, O blocks (tile size B ≈ SRAM / 4d)
      mem: (4 * n * dModel * float16Bytes) / 1024 / 1024,
    })), [dModel]);

  const maxMem = Math.max(...standard.map((d) => d.mem));
  const W = 460, H = 220;
  const padL = 60, padR = 10, padT = 10, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const nLabels = ['512', '1K', '2K', '4K', '8K', '16K'];

  function xPos(i) { return padL + (i / (seqLens.length - 1)) * plotW; }
  function yPos(mem) { return padT + plotH * (1 - mem / maxMem); }

  const stdPts = standard.map(({ mem }, i) => `${xPos(i)},${yPos(mem)}`).join(' ');
  const flashPts = flash.map(({ mem }, i) => `${xPos(i)},${yPos(mem)}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Memory Usage: Standard Attention vs FlashAttention
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Standard attention materializes the <InlineMath math="n \times n" /> score matrix in HBM (quadratic).
        FlashAttention tiles the computation in SRAM, never storing the full matrix (linear).
      </p>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">d_model: {dModel}</label>
        <input type="range" min={32} max={256} step={32} value={dModel}
          onChange={(e) => setDModel(parseInt(e.target.value))}
          className="flex-1 accent-indigo-500" />
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const y = padT + plotH * (1 - f);
            return (
              <g key={f}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                <text x={padL - 5} y={y + 4} textAnchor="end" fontSize={9} className="fill-gray-500">
                  {(maxMem * f).toFixed(0)}MB
                </text>
              </g>
            );
          })}
          {/* Axes */}
          <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />

          {/* Standard attention (red, quadratic) */}
          <polyline points={stdPts} fill="none" stroke="#ef4444" strokeWidth={2.5} />
          {standard.map(({ mem }, i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(mem)} r={3.5} fill="#ef4444" />
          ))}

          {/* FlashAttention (green, linear) */}
          <polyline points={flashPts} fill="none" stroke="#10b981" strokeWidth={2.5} />
          {flash.map(({ mem }, i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(mem)} r={3.5} fill="#10b981" />
          ))}

          {/* X labels */}
          {seqLens.map((_, i) => (
            <text key={i} x={xPos(i)} y={padT + plotH + 16}
              textAnchor="middle" fontSize={10} className="fill-gray-500">{nLabels[i]}</text>
          ))}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} className="fill-gray-500">
            Sequence length
          </text>

          {/* Legend */}
          <line x1={padL + 10} x2={padL + 30} y1={padT + 16} y2={padT + 16} stroke="#ef4444" strokeWidth={2.5} />
          <text x={padL + 35} y={padT + 20} fontSize={11} fill="#ef4444">Standard O(n²)</text>
          <line x1={padL + 130} x2={padL + 150} y1={padT + 16} y2={padT + 16} stroke="#10b981" strokeWidth={2.5} />
          <text x={padL + 155} y={padT + 20} fontSize={11} fill="#10b981">FlashAttn O(n)</text>
        </svg>
      </div>
    </div>
  );
}

const FLASH_CODE = `import torch
import torch.nn.functional as F

# PyTorch 2.0+ provides built-in FlashAttention via SDPA
# This automatically uses FlashAttention when:
#  - CUDA GPU is available
#  - Q, K, V are float16 or bfloat16
#  - No custom attention bias (or using causal mask)

def attention_standard(Q, K, V, is_causal=False):
    """Standard O(n^2) memory attention — materializes full n×n matrix."""
    scale = Q.shape[-1] ** -0.5
    scores = Q @ K.transpose(-2, -1) * scale
    if is_causal:
        T = Q.shape[-2]
        mask = torch.triu(torch.ones(T, T, device=Q.device), diagonal=1).bool()
        scores = scores.masked_fill(mask, float('-inf'))
    weights = F.softmax(scores, dim=-1)
    return weights @ V

def attention_flash(Q, K, V, is_causal=False):
    """FlashAttention via PyTorch SDPA (IO-aware, O(n) memory)."""
    # torch.nn.functional.scaled_dot_product_attention
    # Automatically selects FlashAttention kernel when possible
    return F.scaled_dot_product_attention(Q, K, V, is_causal=is_causal)

# Compare memory and speed
B, H, T, d_k = 1, 8, 4096, 64
dtype = torch.float16
device = 'cuda' if torch.cuda.is_available() else 'cpu'

Q = torch.randn(B, H, T, d_k, dtype=dtype, device=device)
K = torch.randn(B, H, T, d_k, dtype=dtype, device=device)
V = torch.randn(B, H, T, d_k, dtype=dtype, device=device)

print(f"Sequence length: {T}")
print(f"n^2 attention matrix size: {T*T*2/1e6:.1f} MB (float16)")
print(f"FlashAttention HBM usage: O(n*d) = {T*d_k*2/1e6:.3f} MB (float16)")

if device == 'cuda':
    # Both produce identical outputs
    out_std = attention_standard(Q, K, V, is_causal=True)
    out_flash = attention_flash(Q, K, V, is_causal=True)
    print(f"Max difference: {(out_std - out_flash).abs().max().item():.2e}")  # ~0`;

export default function FlashAttention() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          FlashAttention
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          IO-aware exact attention via tiling — same mathematical result as standard attention, but with <InlineMath math="O(n)" /> HBM memory instead of <InlineMath math="O(n^2)" />.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="IO-Aware Attention"
        definition="FlashAttention (Dao et al., 2022) observes that the bottleneck in standard attention is not FLOP count but memory bandwidth: repeatedly reading/writing the $n \times n$ attention matrix between GPU High Bandwidth Memory (HBM, ~80GB at 3.35 TB/s) and on-chip SRAM (~20MB at 19 TB/s). FlashAttention restructures the computation into tiles that fit in SRAM, fusing the score computation, softmax, and output accumulation into a single kernel pass. The attention matrix is never materialized in HBM."
        notation="HBM = High Bandwidth Memory (GPU DRAM). SRAM = on-chip shared memory. Tile size $B_c \approx \lfloor M / (4d) \rfloor$ where $M$ is SRAM size and $d$ is head dimension."
      />

      <MemoryComparisonChart />

      <DefinitionBlock
        label="Definition 1.2"
        title="Online Softmax Algorithm"
        definition="Computing tiled attention requires computing softmax over the full key sequence without materializing all logits simultaneously. The online softmax algorithm maintains running statistics $(m^{(j)}, \ell^{(j)})$ — the current max and normalizer — and updates them as new tiles are processed: $m^{(j+1)} = \max(m^{(j)}, \tilde{m}^{(j+1)})$, $\ell^{(j+1)} = e^{m^{(j)} - m^{(j+1)}} \ell^{(j)} + e^{\tilde{m}^{(j+1)} - m^{(j+1)}} \tilde{\ell}^{(j+1)}$. This allows numerically stable softmax in a single pass without storing all logits."
        notation="Derived from the numerically stable softmax trick: $\text{softmax}(x) = \text{softmax}(x - \max x)$. The running max ensures all exponents are $\leq 0$."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="FlashAttention IO Complexity"
        statement="Standard attention requires $O(n^2)$ HBM reads/writes (to store/load the attention matrix). FlashAttention reduces HBM I/O to $O(n^2 d / M)$ reads/writes, where $M$ is SRAM size and $d$ is head dimension. For $M \gg d$ (typical), this is $O(n)$ in practice. The computation produces the exact same output as standard attention — no approximation."
        proof="Standard attention performs at minimum one HBM write of the $n \times n$ score matrix and one read for the softmax output — $O(n^2)$ I/O. FlashAttention processes $n/B_c$ key blocks, each requiring $O(n \cdot d)$ data per tile, giving total I/O $O(n^2 d / M)$. Since $M$ grows with chip generation while $d$ is fixed (typically 64–128), this grows much more slowly than $O(n^2)$. Exact equivalence follows from the online softmax algorithm which computes the same convex combination of value vectors. $\square$"
        corollaries={[
          "FlashAttention enables training sequences 4-8× longer than standard attention given the same GPU memory budget.",
          "The backward pass also tiles gradients, maintaining O(n) memory at a cost of recomputing the forward attention (rematerialization).",
        ]}
      />

      <ExampleBlock
        title="Memory Budget at n=65536"
        difficulty="research"
        problem="For sequence length $n = 65{,}536$, $d_k = 64$, float16 (2 bytes): (a) compute standard attention matrix HBM size, (b) compute FlashAttention HBM footprint, (c) how many A100 80GB GPUs would standard attention need just for one attention layer?"
        solution={[
          { step: "Standard attention matrix", formula: "n^2 \\times 2\\text{ bytes} = 65536^2 \\times 2 = 8\\text{ GB}", explanation: "Per head, per layer — a 16-head model with 32 layers needs 16 × 32 × 8 = 4,096 GB just for attention matrices." },
          { step: "FlashAttention HBM footprint (Q, K, V, O only)", formula: "4 \\times n \\times d_k \\times 2\\text{ bytes} = 4 \\times 65536 \\times 64 \\times 2 = 32\\text{ MB}", explanation: "Independent of $n^2$ — scales linearly. This fits easily on a single GPU." },
          { step: "GPUs needed for standard attention (1 layer, 16 heads)", formula: "16 \\times 8\\text{ GB} = 128\\text{ GB} \\approx 2\\text{ A100s}", explanation: "Contrast with FlashAttention: 16 × 32 MB = 512 MB — one GPU with room to spare." },
        ]}
      />

      <WarningBlock title="When FlashAttention is Active">
        <p className="text-sm">
          PyTorch 2.0+ automatically uses FlashAttention in <code>F.scaled_dot_product_attention</code> when: (1) inputs are on CUDA, (2) dtype is float16 or bfloat16, (3) no custom attention mask beyond causal masking. If any condition fails, it falls back to the standard math path. Check which backend is used via <code>torch.backends.cuda.flash_sdp_enabled()</code>. FlashAttention v3 (2024) adds further optimizations for H100 GPUs including warp specialization and pipelining.
        </p>
      </WarningBlock>

      <PythonCode code={FLASH_CODE} title="FlashAttention via PyTorch SDPA" runnable />
    </div>
  );
}
