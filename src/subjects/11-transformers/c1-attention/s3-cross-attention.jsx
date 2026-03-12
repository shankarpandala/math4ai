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
// Cross-attention diagram: Q from decoder, K/V from encoder
// ---------------------------------------------------------------------------
function CrossAttentionDiagram() {
  const [activeDecPos, setActiveDecPos] = useState(1);

  const encoderTokens = ['The', 'cat', 'sat'];
  const decoderTokens = ['Le', 'chat'];
  const nEnc = encoderTokens.length;
  const nDec = decoderTokens.length;

  // Simulated attention weights for each decoder position
  const attnWeights = [
    [0.65, 0.25, 0.10],  // "Le" -> attends mostly to "The"
    [0.10, 0.75, 0.15],  // "chat" -> attends mostly to "cat"
  ];

  const weights = attnWeights[activeDecPos];

  const encY = 60;
  const decY = 220;
  const leftPad = 60;
  const colW = 120;
  const svgW = leftPad + Math.max(nEnc, nDec) * colW + 20;
  const svgH = 290;

  function encX(i) { return leftPad + i * colW + colW / 2; }
  function decX(i) { return leftPad + i * colW + colW / 2; }

  function opacityToColor(w) {
    const r = Math.round(99 + (239 - 99) * w);
    const g = Math.round(102 + (68 - 102) * w);
    const b = Math.round(241 + (68 - 241) * w);
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Cross-Attention: Q from Decoder, K/V from Encoder
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Translation example: English encoder outputs provide keys &amp; values. French decoder queries attend to them.
        Click a decoder token to see its attention pattern over encoder positions.
      </p>
      <div className="mb-3 flex gap-3 justify-center">
        {decoderTokens.map((tok, i) => (
          <button key={i}
            onClick={() => setActiveDecPos(i)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${activeDecPos === i
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
            Decoder: "{tok}"
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH} className="mx-auto block">
          {/* Encoder label */}
          <text x={leftPad - 10} y={encY + 5} textAnchor="end" fontSize={11} fontWeight="600"
            className="fill-emerald-600 dark:fill-emerald-400">Encoder</text>
          {/* Decoder label */}
          <text x={leftPad - 10} y={decY + 5} textAnchor="end" fontSize={11} fontWeight="600"
            className="fill-indigo-600 dark:fill-indigo-400">Decoder</text>

          {/* Attention lines */}
          {encoderTokens.map((_, j) => (
            <line key={j}
              x1={decX(activeDecPos)} y1={decY - 22}
              x2={encX(j)} y2={encY + 22}
              stroke={opacityToColor(weights[j])}
              strokeWidth={Math.max(1, weights[j] * 6)}
              opacity={0.7 + weights[j] * 0.3}
              strokeDasharray={weights[j] < 0.15 ? '4,3' : 'none'}
            />
          ))}

          {/* Encoder nodes (K, V source) */}
          {encoderTokens.map((tok, i) => (
            <g key={`enc-${i}`}>
              <rect x={encX(i) - 30} y={encY - 20} width={60} height={40} rx={8}
                fill="#d1fae5" stroke="#10b981" strokeWidth={1.5} />
              <text x={encX(i)} y={encY + 5} textAnchor="middle" fontSize={13} fontWeight="700"
                fill="#065f46">{tok}</text>
              <text x={encX(i)} y={encY + 30} textAnchor="middle" fontSize={10} fill="#059669">K, V</text>
            </g>
          ))}

          {/* Decoder nodes (Q source) */}
          {decoderTokens.map((tok, i) => (
            <g key={`dec-${i}`}
              onClick={() => setActiveDecPos(i)}
              style={{ cursor: 'pointer' }}>
              <rect x={decX(i) - 30} y={decY - 20} width={60} height={40} rx={8}
                fill={activeDecPos === i ? '#e0e7ff' : '#f3f4f6'}
                stroke={activeDecPos === i ? '#6366f1' : '#9ca3af'}
                strokeWidth={activeDecPos === i ? 2.5 : 1} />
              <text x={decX(i)} y={decY + 5} textAnchor="middle" fontSize={13} fontWeight="700"
                fill={activeDecPos === i ? '#3730a3' : '#6b7280'}>{tok}</text>
              <text x={decX(i)} y={decY + 30} textAnchor="middle" fontSize={10}
                fill={activeDecPos === i ? '#6366f1' : '#9ca3af'}>Q</text>
            </g>
          ))}

          {/* Weight labels */}
          {encoderTokens.map((_, j) => (
            <text key={`w-${j}`}
              x={(decX(activeDecPos) + encX(j)) / 2 + 6}
              y={(decY - 22 + encY + 22) / 2}
              fontSize={10} fontWeight="600"
              fill={opacityToColor(weights[j])}>
              {weights[j].toFixed(2)}
            </text>
          ))}
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Line thickness = attention weight. Dashed = low attention.
      </p>
    </div>
  );
}

const CROSS_ATTN_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class CrossAttention(nn.Module):
    """
    Cross-attention: queries from decoder, keys/values from encoder.
    Used in encoder-decoder Transformers (T5, original Transformer).
    """
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        # Separate projections for Q (decoder) and K, V (encoder)
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False)
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model, bias=False)

    def forward(self, decoder_hidden, encoder_output, key_padding_mask=None):
        """
        decoder_hidden:  (B, T_dec, d_model) -- source of Q
        encoder_output:  (B, T_enc, d_model) -- source of K, V
        key_padding_mask: (B, T_enc) bool, True = pad token to ignore
        """
        B, T_dec, _ = decoder_hidden.shape
        T_enc = encoder_output.shape[1]

        # Project and split into heads
        Q = self.W_q(decoder_hidden).view(B, T_dec, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(encoder_output).view(B, T_enc, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(encoder_output).view(B, T_enc, self.n_heads, self.d_k).transpose(1, 2)

        # Scaled dot-product attention (with optional padding mask)
        attn_mask = None
        if key_padding_mask is not None:
            # Expand mask: (B, 1, 1, T_enc)
            attn_mask = key_padding_mask[:, None, None, :].float() * -1e9

        scores = (Q @ K.transpose(-2, -1)) / (self.d_k ** 0.5)  # (B, H, T_dec, T_enc)
        if attn_mask is not None:
            scores = scores + attn_mask
        weights = F.softmax(scores, dim=-1)

        out = weights @ V  # (B, H, T_dec, d_k)
        out = out.transpose(1, 2).contiguous().view(B, T_dec, -1)
        return self.W_o(out), weights

# Usage
model = CrossAttention(d_model=512, n_heads=8)
enc_out = torch.randn(2, 10, 512)   # batch=2, enc_len=10
dec_hid = torch.randn(2, 5, 512)    # batch=2, dec_len=5
out, weights = model(dec_hid, enc_out)
print("Output:", out.shape)         # (2, 5, 512)
print("Weights:", weights.shape)    # (2, 8, 5, 10) — 8 heads`;

export default function CrossAttention() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Cross-Attention
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Encoder-decoder attention where decoder queries attend over encoder keys and values — the bridge between source and target sequences.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 3.1"
        title="Cross-Attention"
        definition="Cross-attention is scaled dot-product attention where queries $Q$ come from one sequence (the decoder) and keys $K$ and values $V$ come from a different sequence (the encoder output). Given decoder hidden states $H_{\text{dec}} \in \mathbb{R}^{T_{\text{dec}} \times d}$ and encoder output $H_{\text{enc}} \in \mathbb{R}^{T_{\text{enc}} \times d}$: $\text{CrossAttn}(H_{\text{dec}}, H_{\text{enc}}) = \text{softmax}\!\left(\frac{H_{\text{dec}} W^Q (H_{\text{enc}} W^K)^\top}{\sqrt{d_k}}\right) H_{\text{enc}} W^V$. Each decoder position can attend to any encoder position."
        notation="$T_{\text{dec}}$ = decoder sequence length, $T_{\text{enc}}$ = encoder sequence length. The attention matrix is $T_{\text{dec}} \times T_{\text{enc}}$, not square."
      />

      <CrossAttentionDiagram />

      <DefinitionBlock
        label="Definition 3.2"
        title="Self-Attention vs. Cross-Attention"
        definition="In self-attention, $Q$, $K$, $V$ all derive from the same sequence $X$: this allows tokens to contextualize each other. In cross-attention, $Q$ comes from one sequence (e.g., the decoder) while $K$ and $V$ come from another (the encoder): this allows conditioning generation on an external context. Encoder-decoder Transformers (T5, original machine translation Transformer) use both: self-attention within each sequence and cross-attention connecting them."
        notation="The cross-attention sublayer appears between the masked self-attention and feed-forward sublayers in each decoder block."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Alignment via Cross-Attention"
        statement="In a trained encoder-decoder Transformer, cross-attention weights provide a soft alignment matrix between source and target sequences. For neural machine translation, the weight $\alpha_{ij}$ approximates the probability that target token $i$ was generated by attending to source token $j$. This generalizes the explicit alignment models of classical phrase-based MT to a differentiable, end-to-end learned form."
        proof="This is an empirical theorem (Bahdanau et al., 2015; Vaswani et al., 2017). Formal support: cross-attention weights $\alpha_{ij} = \text{softmax}_j(q_i^\top k_j / \sqrt{d_k})$ are a valid probability distribution over $j$ for each $i$. In trained models, they exhibit diagonal structure for monotonic translation pairs and crossing patterns for reordered language pairs, consistent with classical alignment. $\square$"
        corollaries={[
          "Cross-attention weights can serve as interpretable alignment visualizations for MT models.",
          "Degenerate cross-attention (uniform weights) indicates the decoder ignores the encoder — a failure mode in poor training setups.",
        ]}
      />

      <ExampleBlock
        title="Cross-Attention for Translation"
        difficulty="advanced"
        problem="In an English→French Transformer, the encoder processes 'The cat sat'. The decoder generates 'Le chat'. Describe which encoder positions the decoder should attend to when generating each French token, and why."
        solution={[
          { step: "Generating 'Le' (the French definite article)", explanation: "The decoder query for 'Le' should attend strongly to the English 'The' (position 0) since both are determiners. It may also attend weakly to 'cat' to anticipate gender agreement." },
          { step: "Generating 'chat' (cat in French)", explanation: "The decoder query for 'chat' should attend primarily to 'cat' (position 1), which is the direct lexical translation. Syntactic context from 'The' may provide secondary signal." },
          { step: "Padding mask prevents attending to padding tokens", explanation: "If the encoder input is padded to a fixed length, the key_padding_mask is set to True for pad positions, ensuring they receive effectively $-\\infty$ before softmax and contribute zero to the output." },
        ]}
      />

      <WarningBlock title="Cross-Attention Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Key padding mask vs. causal mask.</strong> Cross-attention uses a <em>key</em> padding mask (to ignore encoder pads) but NOT a causal mask — the decoder can attend to all encoder positions simultaneously (no future-leaking concern since encoder is fully observed).</li>
          <li className="mt-2"><strong>Decoder-only models omit cross-attention.</strong> GPT-style models have no encoder and therefore no cross-attention layer. Conditioning on context happens purely through the input prompt in the causal self-attention layers.</li>
          <li className="mt-2"><strong>K/V caching in inference.</strong> Since encoder output is fixed during generation, the encoder $K$ and $V$ projections are computed once and cached across all generation steps — a critical optimization for fast inference.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CROSS_ATTN_CODE} title="Cross-Attention — PyTorch Implementation" runnable />
    </div>
  );
}
