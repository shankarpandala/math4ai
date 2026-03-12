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
// Causal mask visualizer
// ---------------------------------------------------------------------------
function CausalMaskViz() {
  const [seqLen, setSeqLen] = useState(5);
  const tokens = ['<s>', 'The', 'cat', 'sat', 'on', 'mat'].slice(0, seqLen);
  const cellSize = 44;
  const labelOffset = 50;
  const svgSize = labelOffset + seqLen * cellSize + 10;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Causal Mask Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The upper-triangular mask prevents each position from attending to future tokens.
        Green = allowed (<InlineMath math="\alpha \neq 0" />), red = masked (<InlineMath math="\alpha = 0$, additive $-\infty" />).
      </p>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sequence length:</label>
        <input type="range" min={2} max={6} step={1} value={seqLen}
          onChange={(e) => setSeqLen(parseInt(e.target.value))}
          className="h-2 w-40 cursor-pointer accent-indigo-500" />
        <span className="font-mono text-sm text-indigo-600">{seqLen}</span>
      </div>
      <div className="overflow-x-auto">
        <svg width={svgSize} height={svgSize} className="mx-auto block">
          {/* Column labels (keys) */}
          {tokens.map((tok, j) => (
            <text key={`col-${j}`} x={labelOffset + j * cellSize + cellSize / 2} y={labelOffset - 8}
              textAnchor="middle" fontSize={11} className="fill-gray-600 dark:fill-gray-400">{tok}</text>
          ))}
          {/* Row labels (queries) */}
          {tokens.map((tok, i) => (
            <text key={`row-${i}`} x={labelOffset - 6} y={labelOffset + i * cellSize + cellSize / 2 + 4}
              textAnchor="end" fontSize={11} className="fill-gray-600 dark:fill-gray-400">{tok}</text>
          ))}
          {/* Cells */}
          {tokens.map((_, i) =>
            tokens.map((_, j) => {
              const allowed = j <= i;
              return (
                <g key={`${i}-${j}`}>
                  <rect x={labelOffset + j * cellSize + 1} y={labelOffset + i * cellSize + 1}
                    width={cellSize - 2} height={cellSize - 2} rx={3}
                    fill={allowed ? '#d1fae5' : '#fee2e2'}
                    stroke={allowed ? '#059669' : '#ef4444'} strokeWidth={1.2} />
                  <text x={labelOffset + j * cellSize + cellSize / 2}
                    y={labelOffset + i * cellSize + cellSize / 2 + 4}
                    textAnchor="middle" fontSize={16}
                    fill={allowed ? '#065f46' : '#b91c1c'}>
                    {allowed ? '✓' : '✗'}
                  </text>
                </g>
              );
            })
          )}
          {/* Diagonal guide */}
          {tokens.map((_, i) => (
            <line key={`diag-${i}`}
              x1={labelOffset + i * cellSize} y1={labelOffset + i * cellSize}
              x2={labelOffset + (i + 1) * cellSize} y2={labelOffset + (i + 1) * cellSize}
              stroke="#6366f1" strokeWidth={1} opacity={0.4} />
          ))}
        </svg>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        The mask is lower-triangular (including diagonal). Upper triangle receives additive <InlineMath math="-\infty" /> before softmax.
      </p>
    </div>
  );
}

const DECODER_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

def causal_mask(seq_len: int, device=None):
    """Upper triangular mask: True = masked position (future token)."""
    return torch.triu(torch.ones(seq_len, seq_len, dtype=torch.bool, device=device), diagonal=1)

class DecoderBlock(nn.Module):
    """
    Decoder block with:
    1. Masked causal self-attention
    2. Cross-attention to encoder output (omit for decoder-only models)
    3. Feed-forward network
    All with pre-norm and residual connections.
    """
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)
        self.self_attn = nn.MultiheadAttention(d_model, n_heads, dropout=dropout, batch_first=True)
        self.cross_attn = nn.MultiheadAttention(d_model, n_heads, dropout=dropout, batch_first=True)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff), nn.GELU(), nn.Dropout(dropout),
            nn.Linear(d_ff, d_model), nn.Dropout(dropout),
        )

    def forward(self, x, encoder_output=None, tgt_mask=None, memory_key_padding_mask=None):
        B, T, _ = x.shape
        # 1. Masked causal self-attention
        if tgt_mask is None:
            tgt_mask = causal_mask(T, x.device)
        n1 = self.norm1(x)
        sa_out, _ = self.self_attn(n1, n1, n1, attn_mask=tgt_mask.float() * -1e9)
        x = x + sa_out
        # 2. Cross-attention (only for encoder-decoder models)
        if encoder_output is not None:
            n2 = self.norm2(x)
            ca_out, _ = self.cross_attn(n2, encoder_output, encoder_output,
                                         key_padding_mask=memory_key_padding_mask)
            x = x + ca_out
        # 3. FFN
        x = x + self.ffn(self.norm3(x))
        return x

# Decoder-only (GPT-style): just omit encoder_output
block = DecoderBlock(d_model=512, n_heads=8, d_ff=2048)
x = torch.randn(2, 10, 512)  # (batch=2, seq_len=10, d_model=512)
out = block(x)  # No encoder output — decoder-only mode
print("Decoder output:", out.shape)  # (2, 10, 512)

# Verify causal mask
mask = causal_mask(5)
print("\\nCausal mask (5 tokens):")
print(mask.int())  # Upper triangular: 1 = masked`;

export default function TransformerDecoder() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Transformer Decoder
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Causal masking, autoregressive decoding, and the architecture of GPT-style decoder-only language models.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 2.1"
        title="Causal (Autoregressive) Masking"
        definition="Causal masking ensures that position $i$ can only attend to positions $j \leq i$ during self-attention. This is implemented by adding $-\infty$ to the pre-softmax scores at positions $j > i$: $S_{ij} \leftarrow S_{ij} + M_{ij}$ where $M_{ij} = -\infty$ if $j > i$, else $0$. After softmax, masked positions receive weight $\exp(-\infty) = 0$. This preserves the autoregressive property: the model's prediction at position $i$ depends only on tokens $1, \ldots, i-1$."
        notation="The mask matrix $M$ is upper-triangular with $-\infty$ above the diagonal and $0$ on and below. In practice, $-10^9$ or $-10^4$ is used instead of $-\infty$ for numerical stability."
      />

      <CausalMaskViz />

      <DefinitionBlock
        label="Definition 2.2"
        title="Autoregressive Decoding"
        definition="At inference time, a decoder-only model generates tokens one at a time. Given input tokens $x_1, \ldots, x_t$, the model computes a probability distribution over the vocabulary for position $t+1$: $p(x_{t+1} \mid x_1, \ldots, x_t) = \text{softmax}(W_\text{unembed} \cdot h_t)$ where $h_t$ is the final hidden state at position $t$. The next token is sampled (or chosen by greedy/beam search). This token is appended and the process repeats — hence 'autoregressive'."
        notation="KV-caching makes this efficient: at step $t+1$, keys and values for positions $1, \ldots, t$ are cached and reused, so only the new query at position $t+1$ is computed from scratch."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Equivalence of Training and Inference Masking"
        statement="During training, applying the causal mask to the full sequence of length $T$ simultaneously is equivalent to running $T$ separate forward passes — one per prefix length. The causal mask guarantees that the loss at position $t$ receives gradients only from tokens $1, \ldots, t$, making parallel training exact (not an approximation)."
        proof="The gradient of the cross-entropy loss at position $t$ flows backward through the softmax and into the hidden state $h_t$. Due to the causal mask, $h_t$ depends only on $x_1, \ldots, x_t$ (a function of past tokens only). Therefore the gradient $\partial \mathcal{L}_t / \partial \theta$ is identical to what would be obtained by a separate forward pass on prefix $(x_1, \ldots, x_t)$. By linearity of backprop across positions, summing gradients over all positions is equivalent to running $T$ forward passes. $\square$"
        corollaries={[
          "Training throughput scales linearly with sequence length (vs. $O(T)$ sequential passes for RNNs) — this is the primary training efficiency advantage of Transformers.",
          "Teacher forcing: during training the model always conditions on the ground-truth prefix, not its own predictions. This can cause exposure bias at inference.",
        ]}
      />

      <ExampleBlock
        title="KV-Cache Memory Calculation"
        difficulty="advanced"
        problem="A GPT-3-scale model: $N=96$ layers, $d_{\text{model}}=12{,}288$, $h=96$ heads. If generating up to sequence length $T=2{,}048$ in float16, how much GPU memory does the KV-cache require?"
        solution={[
          { step: "Per token, per layer: size of K and V", formula: "2 \\times d_{\\text{model}} \\times 2\\text{ bytes} = 2 \\times 12{,}288 \\times 2 = 49{,}152\\text{ bytes}", explanation: "Factor 2 for K and V; float16 = 2 bytes per element." },
          { step: "For all layers and sequence length", formula: "N \\times T \\times 49{,}152 = 96 \\times 2{,}048 \\times 49{,}152 \\approx 9.66\\text{ GB}", explanation: "This is per batch item. For batch size 8: ~77 GB just for KV cache." },
          { step: "Implication", explanation: "KV-cache memory scales linearly with sequence length and batch size, making long-context inference memory-bound. Techniques like grouped-query attention (GQA) and multi-query attention (MQA) reduce this by sharing K/V heads." },
        ]}
      />

      <WarningBlock title="Decoder-Only vs Encoder-Decoder">
        <p className="text-sm">
          Modern LLMs (GPT-2/3/4, Llama, Mistral, Claude) are <strong>decoder-only</strong>: they have no separate encoder or cross-attention layer. The entire model is a stack of masked self-attention + FFN blocks. The "context" is simply prepended to the generation target in a single autoregressive sequence.
          Classic encoder-decoder models (T5, BART, original Transformer for MT) have separate encoder and decoder stacks connected by cross-attention.
          Decoder-only models are generally preferred for generation tasks due to simplicity and better scaling behavior.
        </p>
      </WarningBlock>

      <PythonCode code={DECODER_CODE} title="Decoder Block with Causal Mask — PyTorch" runnable />
    </div>
  );
}
