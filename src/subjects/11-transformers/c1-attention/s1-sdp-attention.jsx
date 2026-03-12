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
// Attention weight heatmap for 4-token sequence
// ---------------------------------------------------------------------------
const TOKENS = ['cat', 'sat', 'on', 'mat'];
const N = 4;

const BASE_LOGITS = [
  [2.1, 1.4, 0.3, 0.5],
  [1.2, 2.3, 0.6, 0.8],
  [0.2, 0.5, 1.8, 1.1],
  [0.4, 0.7, 1.0, 2.5],
];

function softmaxRow(row, scale) {
  const scaled = row.map((v) => v * scale);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((v) => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

function weightToColor(w) {
  const r = w < 0.5 ? Math.round(255 * 2 * w) : 255;
  const g = w < 0.5 ? Math.round(255 * 2 * w) : Math.round(255 * (2 - 2 * w));
  const b = w < 0.5 ? 255 : Math.round(255 * (2 - 2 * w));
  return `rgb(${r},${g},${b})`;
}

function AttentionHeatmap() {
  const [dk, setDk] = useState(8);
  const [hoveredCell, setHoveredCell] = useState(null);

  const scale = 1 / Math.sqrt(dk);
  const matrix = useMemo(() => BASE_LOGITS.map((row) => softmaxRow(row, scale)), [dk]);

  const cellSize = 64;
  const labelOffset = 52;
  const svgWidth = labelOffset + N * cellSize + 10;
  const svgHeight = labelOffset + N * cellSize + 20;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Attention Weight Heatmap — 4-Token Sequence
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Softmax attention weights for "cat sat on mat". Rows = queries, columns = keys.
        Adjust <InlineMath math="d_k" /> to see how the scale factor <InlineMath math="1/\sqrt{d_k}" /> sharpens or diffuses attention.
      </p>
      <div className="mb-5 flex items-center gap-4">
        <label className="w-36 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
          Key dim <InlineMath math="d_k" /> = {dk}
        </label>
        <input
          type="range" min={1} max={64} step={1} value={dk}
          onChange={(e) => setDk(parseInt(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-indigo-500"
        />
        <span className="w-24 text-right font-mono text-sm text-indigo-600 dark:text-indigo-400">
          scale = {scale.toFixed(3)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="mx-auto block">
          {TOKENS.map((tok, j) => (
            <text key={`col-${j}`} x={labelOffset + j * cellSize + cellSize / 2} y={labelOffset - 8}
              textAnchor="middle" fontSize={12} className="fill-gray-600 dark:fill-gray-400">{tok}</text>
          ))}
          {TOKENS.map((tok, i) => (
            <text key={`row-${i}`} x={labelOffset - 6} y={labelOffset + i * cellSize + cellSize / 2 + 4}
              textAnchor="end" fontSize={12} className="fill-gray-600 dark:fill-gray-400">{tok}</text>
          ))}
          {matrix.map((row, i) =>
            row.map((w, j) => {
              const isHovered = hoveredCell && hoveredCell[0] === i && hoveredCell[1] === j;
              return (
                <g key={`${i}-${j}`}
                  onMouseEnter={() => setHoveredCell([i, j])}
                  onMouseLeave={() => setHoveredCell(null)}>
                  <rect x={labelOffset + j * cellSize + 1} y={labelOffset + i * cellSize + 1}
                    width={cellSize - 2} height={cellSize - 2} rx={4}
                    fill={weightToColor(w)} opacity={0.88}
                    stroke={isHovered ? '#6366f1' : 'transparent'} strokeWidth={isHovered ? 2 : 0} />
                  <text x={labelOffset + j * cellSize + cellSize / 2}
                    y={labelOffset + i * cellSize + cellSize / 2 + 4}
                    textAnchor="middle" fontSize={11} fontWeight="600"
                    fill={w > 0.5 ? '#fff' : '#1f2937'}>{w.toFixed(3)}</text>
                </g>
              );
            })
          )}
          <text x={labelOffset + (N * cellSize) / 2} y={svgHeight - 2}
            textAnchor="middle" fontSize={11} className="fill-gray-500 dark:fill-gray-400">
            Keys
          </text>
        </svg>
      </div>
      <div className="mt-3 min-h-[1.5rem] text-center text-xs text-gray-500 dark:text-gray-400">
        {hoveredCell
          ? <span>Q: <strong>{TOKENS[hoveredCell[0]]}</strong> → K: <strong>{TOKENS[hoveredCell[1]]}</strong> — weight: <strong className="text-indigo-600 dark:text-indigo-400">{matrix[hoveredCell[0]][hoveredCell[1]].toFixed(4)}</strong></span>
          : <span className="text-gray-400">Hover a cell to inspect weight</span>}
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="text-xs text-gray-500">Low</span>
        <svg width={140} height={12}>
          <defs>
            <linearGradient id="sdpLegend" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={weightToColor(0)} />
              <stop offset="50%" stopColor={weightToColor(0.5)} />
              <stop offset="100%" stopColor={weightToColor(1)} />
            </linearGradient>
          </defs>
          <rect width={140} height={12} rx={3} fill="url(#sdpLegend)" />
        </svg>
        <span className="text-xs text-gray-500">High</span>
      </div>
    </div>
  );
}

const SDP_CODE = `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Args:
        Q: (..., seq_q, d_k)
        K: (..., seq_k, d_k)
        V: (..., seq_k, d_v)
        mask: optional boolean mask; True = masked out
    Returns:
        output: (..., seq_q, d_v)
        weights: (..., seq_q, seq_k)
    """
    d_k = Q.shape[-1]
    scores = Q @ K.swapaxes(-2, -1) / np.sqrt(d_k)  # (..., seq_q, seq_k)
    if mask is not None:
        scores = np.where(mask, -1e9, scores)
    # Numerically stable softmax
    scores -= scores.max(axis=-1, keepdims=True)
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)
    return weights @ V, weights

# --- Example: 4-token sequence ---
np.random.seed(0)
seq, d_k, d_v = 4, 8, 8
Q = np.random.randn(seq, d_k)
K = np.random.randn(seq, d_k)
V = np.random.randn(seq, d_v)

out, W = scaled_dot_product_attention(Q, K, V)
print("Attention weights:")
print(W.round(3))
print("Output shape:", out.shape)

# Causal mask (for decoder)
mask = np.triu(np.ones((seq, seq), dtype=bool), k=1)
out_causal, W_causal = scaled_dot_product_attention(Q, K, V, mask=mask)
print("\\nCausal attention weights:")
print(W_causal.round(3))`;

export default function SdpAttention() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Scaled Dot-Product Attention
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The fundamental operation underlying all Transformer models — differentiable soft retrieval via Q, K, V matrices.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Scaled Dot-Product Attention"
        definition="Given query matrix $Q \in \mathbb{R}^{n \times d_k}$, key matrix $K \in \mathbb{R}^{m \times d_k}$, and value matrix $V \in \mathbb{R}^{m \times d_v}$, scaled dot-product attention is defined as: $\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$. The term $QK^\top \in \mathbb{R}^{n \times m}$ computes all pairwise dot-product similarities. Dividing by $\sqrt{d_k}$ keeps logits in a gradient-friendly range."
        notation="$n$ = query length, $m$ = key/value length, $d_k$ = query/key dimension, $d_v$ = value dimension. The output shape is $n \times d_v$."
      />

      <AttentionHeatmap />

      <DefinitionBlock
        label="Definition 1.2"
        title="Q, K, V Projections"
        definition="In practice, queries, keys, and values are obtained by linear projections of input embeddings $X \in \mathbb{R}^{n \times d_{\text{model}}}$: $Q = XW^Q$, $K = XW^K$, $V = XW^V$ where $W^Q, W^K \in \mathbb{R}^{d_{\text{model}} \times d_k}$ and $W^V \in \mathbb{R}^{d_{\text{model}} \times d_v}$. These learned projections allow the model to compare tokens in a learned similarity space rather than raw embedding space."
        notation="For self-attention all three projections use the same input $X$. For cross-attention, $Q$ comes from one sequence and $K, V$ from another."
      />

      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Why <InlineMath math="\sqrt{d_k}" /> Scaling?
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          If query and key components are i.i.d. with mean 0 and variance 1, the dot product
          <InlineMath math="q \cdot k = \sum_{i=1}^{d_k} q_i k_i" /> has variance <InlineMath math="d_k" />.
          For large <InlineMath math="d_k" />, unscaled logits push softmax into saturation, giving near-zero gradients.
          Dividing by <InlineMath math="\sqrt{d_k}" /> restores unit variance:
        </p>
        <BlockMath math="\operatorname{Var}\!\left[\frac{q \cdot k}{\sqrt{d_k}}\right] = \frac{d_k}{d_k} = 1" />
      </section>

      <TheoremBlock
        label="Theorem 1.1"
        title="Attention as Soft Dictionary Lookup"
        statement="Attention implements differentiable soft key-value retrieval. The output $\sum_j \alpha_j v_j$ with $\alpha = \text{softmax}(Qk^\top/\sqrt{d_k})$ interpolates between hard nearest-neighbor lookup (as logit scale $\to \infty$) and uniform averaging (as scale $\to 0$). The function is differentiable everywhere with respect to $Q$, $K$, $V$."
        proof="Let $s_j = q \cdot k_j / \sqrt{d_k}$. Softmax weight $\alpha_j = \exp(s_j)/\sum_l \exp(s_l)$. By quotient rule, $\partial \alpha_j / \partial s_i = \alpha_j(\delta_{ij} - \alpha_i)$, so the Jacobian is $\text{diag}(\alpha) - \alpha\alpha^\top \succ 0$ (entry-wise differentiable). As max logit $\to \infty$, $\alpha$ concentrates on argmax; as logits equalize, $\alpha \to 1/m$ uniformly. $\square$"
        corollaries={[
          "The attention Jacobian $\\text{diag}(\\alpha) - \\alpha\\alpha^\\top$ has rank $m-1$, so gradients flow through all non-masked positions.",
          "Temperature $\\tau$ in $\\text{softmax}(s/\\tau)$ explicitly controls sharpness; standard SDP attention uses implicit temperature via $\\|W_Q\\|$, $\\|W_K\\|$ magnitudes.",
        ]}
      />

      <ExampleBlock
        title="Computing SDP Attention by Hand"
        difficulty="advanced"
        problem="Compute $\text{Attention}(Q,K,V)$ for $Q = K = [[1,0],[0,1]]$ and $V = [[10,0],[0,20]]$ with $d_k = 2$. Which token does each query attend to?"
        solution={[
          { step: "Compute raw scores $QK^\\top$", formula: "QK^\\top = \\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix} = \\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}" },
          { step: "Scale by $1/\\sqrt{d_k} = 1/\\sqrt{2} \\approx 0.707$", formula: "S = \\begin{bmatrix}0.707 & 0\\\\0 & 0.707\\end{bmatrix}" },
          { step: "Apply row-wise softmax", formula: "A = \\text{softmax}(S) \\approx \\begin{bmatrix}0.574 & 0.426\\\\0.426 & 0.574\\end{bmatrix}" },
          { step: "Multiply by $V$", formula: "\\text{Output} = AV \\approx \\begin{bmatrix}5.74 + 0 & 0 + 8.52\\\\4.26 + 0 & 0 + 11.48\\end{bmatrix} = \\begin{bmatrix}5.74 & 8.52\\\\4.26 & 11.48\\end{bmatrix}", explanation: "Query 1 attends most to key 1 (value row [10,0]); query 2 attends most to key 2 (value row [0,20])." },
        ]}
      />

      <WarningBlock title="Critical Implementation Notes">
        <ul className="space-y-2 text-sm">
          <li><strong>Always scale by <InlineMath math="\sqrt{d_k}" />.</strong> Omitting this causes softmax saturation and near-zero gradients, especially for large <InlineMath math="d_k" />. This is the most common reimplementation bug.</li>
          <li className="mt-2"><strong>Apply causal mask before softmax, not after.</strong> Add <InlineMath math="-\infty" /> (in practice <InlineMath math="-10^9" />) to masked positions before softmax — applying a mask to softmax outputs does not zero out gradients correctly.</li>
          <li className="mt-2"><strong>Attention is permutation-equivariant.</strong> Without positional encodings, the model cannot distinguish token order — "cat sat" and "sat cat" yield the same attention weights.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={SDP_CODE} title="Scaled Dot-Product Attention — NumPy" runnable />

      <DefinitionBlock
        label="Definition 1.3"
        title="Attention Complexity"
        definition="Standard SDP attention has time complexity $O(n^2 d_k)$ and memory $O(n^2)$ due to materializing the $n \times n$ score matrix. For sequence length $n = 128\,000$ (long-context LLMs), this produces 16 billion entries per layer per head. FlashAttention avoids materializing this matrix via IO-aware tiling."
        notation="$n$ = sequence length. The quadratic memory bottleneck is the primary motivation for efficient attention variants (sparse attention, linear attention, FlashAttention)."
      />
    </div>
  );
}
