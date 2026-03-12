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
// Encoder layer diagram with toggleable sublayers
// ---------------------------------------------------------------------------
function EncoderDiagram() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [normVariant, setNormVariant] = useState('post');

  const layers = [
    {
      id: 'embed',
      label: 'Token + Positional Embedding',
      color: '#f59e0b',
      bg: '#fef3c7',
      border: '#d97706',
      desc: 'Input tokens are mapped to $d_{\\text{model}}$-dimensional vectors. Positional encodings are added to inject sequence order information.',
    },
    {
      id: 'mha',
      label: 'Multi-Head Self-Attention',
      color: '#6366f1',
      bg: '#e0e7ff',
      border: '#4f46e5',
      desc: 'Each token attends to all other tokens via $h$ parallel attention heads. Output is projected back to $d_{\\text{model}}$ via $W^O$.',
    },
    {
      id: 'add1',
      label: normVariant === 'post' ? 'Add & LayerNorm' : 'LayerNorm (Pre-Norm)',
      color: '#10b981',
      bg: '#d1fae5',
      border: '#059669',
      desc: normVariant === 'post'
        ? 'Residual connection: $x \\leftarrow \\text{LN}(x + \\text{MHA}(x))$. Post-norm used in original Vaswani et al. 2017.'
        : 'Pre-norm: $x \\leftarrow x + \\text{MHA}(\\text{LN}(x))$. Improves training stability; used in most modern LLMs (GPT, Llama).',
    },
    {
      id: 'ffn',
      label: 'Feed-Forward Network',
      color: '#8b5cf6',
      bg: '#ede9fe',
      border: '#7c3aed',
      desc: 'Two linear layers with activation: $\\text{FFN}(x) = W_2 \\cdot \\text{ReLU}(W_1 x + b_1) + b_2$. Hidden dim is typically $4 d_{\\text{model}}$.',
    },
    {
      id: 'add2',
      label: normVariant === 'post' ? 'Add & LayerNorm' : 'LayerNorm (Pre-Norm)',
      color: '#10b981',
      bg: '#d1fae5',
      border: '#059669',
      desc: normVariant === 'post'
        ? 'Second residual: $x \\leftarrow \\text{LN}(x + \\text{FFN}(x))$.'
        : 'Second pre-norm: $x \\leftarrow x + \\text{FFN}(\\text{LN}(x))$.',
    },
  ];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Encoder Block — Interactive Forward Pass
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Click each sublayer to see its role. Toggle between post-norm and pre-norm variants.
      </p>
      <div className="mb-4 flex gap-3">
        {['post', 'pre'].map((v) => (
          <button key={v} onClick={() => setNormVariant(v)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${normVariant === v
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
            {v === 'post' ? 'Post-Norm (original)' : 'Pre-Norm (modern)'}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-lg bg-gray-100 px-10 py-2 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          Input sequence x₀ ∈ ℝⁿˣᵈ
        </div>
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
        {layers.map((layer, i) => (
          <React.Fragment key={layer.id}>
            <button
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              className="w-full max-w-xs rounded-xl border-2 px-5 py-3 text-center text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
              style={{
                background: activeLayer === layer.id ? layer.bg : '#f9fafb',
                borderColor: activeLayer === layer.id ? layer.border : '#d1d5db',
                color: activeLayer === layer.id ? layer.color : '#374151',
              }}>
              {layer.label}
            </button>
            {activeLayer === layer.id && (
              <div className="w-full max-w-sm rounded-lg border px-4 py-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300"
                style={{ borderColor: layer.border, background: layer.bg + '80' }}>
                {layer.desc}
              </div>
            )}
            {i < layers.length - 1 && <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />}
          </React.Fragment>
        ))}
        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
        <div className="rounded-lg bg-indigo-100 px-10 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          Encoder output xₙ ∈ ℝⁿˣᵈ
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        This block is stacked $N$ times (e.g., $N=12$ for BERT-base, $N=24$ for BERT-large).
      </p>
    </div>
  );
}

const ENCODER_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class TransformerEncoderBlock(nn.Module):
    """Single Transformer encoder block (pre-norm variant, used in modern LLMs)."""
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.attn = nn.MultiheadAttention(d_model, n_heads, dropout=dropout, batch_first=True)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x, src_key_padding_mask=None):
        # Pre-norm self-attention + residual
        x = x + self.attn(self.norm1(x), self.norm1(x), self.norm1(x),
                           key_padding_mask=src_key_padding_mask)[0]
        # Pre-norm FFN + residual
        x = x + self.ffn(self.norm2(x))
        return x

class TransformerEncoder(nn.Module):
    def __init__(self, vocab_size, d_model=512, n_heads=8, d_ff=2048, n_layers=6):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, d_model)
        self.layers = nn.ModuleList([
            TransformerEncoderBlock(d_model, n_heads, d_ff) for _ in range(n_layers)
        ])
        self.norm = nn.LayerNorm(d_model)

    def forward(self, token_ids, padding_mask=None):
        x = self.embed(token_ids)  # (B, T, d_model)
        for layer in self.layers:
            x = layer(x, src_key_padding_mask=padding_mask)
        return self.norm(x)

encoder = TransformerEncoder(vocab_size=32000)
x = torch.randint(0, 32000, (2, 16))  # (batch=2, seq_len=16)
out = encoder(x)
print("Encoder output:", out.shape)   # (2, 16, 512)

total_params = sum(p.numel() for p in encoder.parameters())
print(f"Parameters: {total_params:,}")`;

export default function TransformerEncoder() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Transformer Encoder
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The encoder block: stacked multi-head self-attention and feed-forward layers that produce contextualized representations.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Encoder Block"
        definition="A Transformer encoder block maps a sequence $X \in \mathbb{R}^{n \times d}$ to a same-shaped contextualized output. Each block applies two sublayers: (1) multi-head self-attention, and (2) a position-wise feed-forward network (FFN). Each sublayer uses a residual connection and layer normalization. Post-norm (original): $x \leftarrow \text{LN}(x + \text{Sublayer}(x))$. Pre-norm (modern): $x \leftarrow x + \text{Sublayer}(\text{LN}(x))$."
        notation="$n$ = sequence length, $d = d_{\text{model}}$ = model dimension, $N$ = number of stacked blocks. BERT-base: $N=12$, $d=768$. BERT-large: $N=24$, $d=1024$."
      />

      <EncoderDiagram />

      <DefinitionBlock
        label="Definition 1.2"
        title="Position-wise Feed-Forward Network"
        definition="The FFN sublayer applies the same two-layer MLP to every position independently: $\text{FFN}(x) = W_2 \, \sigma(W_1 x + b_1) + b_2$ where $W_1 \in \mathbb{R}^{d_{\text{ff}} \times d}$, $W_2 \in \mathbb{R}^{d \times d_{\text{ff}}}$, and $\sigma$ is typically ReLU or GELU. The inner dimension $d_{\text{ff}} = 4d$ is standard. Modern models often replace this with gated variants: SwiGLU, GeGLU."
        notation="The FFN has no interaction between sequence positions — it acts independently per token. Most of a Transformer's parameters live in the FFN layers, not attention."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Encoder as Iterative Representation Refinement"
        statement="With $N$ encoder blocks, the encoder computes a sequence of representations $X^{(0)}, X^{(1)}, \ldots, X^{(N)}$ where each $X^{(l+1)} = \text{EncoderBlock}_l(X^{(l)})$. Lower layers tend to capture local syntactic structure; upper layers encode more global semantic information. This has been empirically verified by probing classifiers trained on intermediate representations."
        proof="Empirical observation (Tenney et al., 2019; Jawahar et al., 2019). Formal intuition: the self-attention in layer $l$ can reference any information in $X^{(l)}$, which already integrates context from all previous layers. The effective receptive field grows with depth while locality bias diminishes. $\square$"
        corollaries={[
          "Probing studies on BERT show layer 4-6 best for syntactic tasks (POS, NER), layers 9-12 for semantic tasks (entailment, coreference).",
          "Pre-norm architectures are more stable at large depth/width due to better gradient flow — the residual stream preserves scale.",
        ]}
      />

      <ExampleBlock
        title="BERT-base Parameter Count"
        difficulty="intermediate"
        problem="Compute the total parameter count for a BERT-base encoder: $N=12$ layers, $d_{\text{model}}=768$, $h=12$ heads, $d_{\text{ff}}=3072$, vocab size = 30,522."
        solution={[
          { step: "Embedding layer", formula: "30{,}522 \\times 768 = 23{,}440{,}896 \\approx 23.4\\text{M}", explanation: "Plus positional embeddings (512 × 768 ≈ 0.4M) and token type embeddings." },
          { step: "Per-layer: multi-head attention", formula: "4 \\times d^2 = 4 \\times 768^2 = 2{,}359{,}296 \\approx 2.4\\text{M}", explanation: "$W^Q, W^K, W^V, W^O$ each $768 \\times 768$." },
          { step: "Per-layer: FFN", formula: "2 \\times d \\times d_{\\text{ff}} = 2 \\times 768 \\times 3072 = 4{,}718{,}592 \\approx 4.7\\text{M}", explanation: "Plus biases: 3072 + 768 ≈ negligible." },
          { step: "Total for 12 layers + embeddings", formula: "12 \\times (2.4 + 4.7)\\text{M} + 24\\text{M} \\approx 110\\text{M parameters}", explanation: "BERT-base has 110M parameters as reported in Devlin et al. (2019)." },
        ]}
      />

      <WarningBlock title="Pre-Norm vs Post-Norm">
        <p className="text-sm">
          The original Transformer (Vaswani et al., 2017) uses <strong>post-norm</strong>: LayerNorm after the residual addition. This requires careful learning rate warmup — without it, gradients in early training explode. <strong>Pre-norm</strong> (LayerNorm before each sublayer) is much more stable and is used in GPT-2, GPT-3, Llama, Mistral, and virtually all modern LLMs. Pre-norm enables training without warmup and at larger scale. When reimplementing, verify which variant a checkpoint was trained with before loading weights.
        </p>
      </WarningBlock>

      <PythonCode code={ENCODER_CODE} title="Transformer Encoder Block — PyTorch" runnable />
    </div>
  );
}
