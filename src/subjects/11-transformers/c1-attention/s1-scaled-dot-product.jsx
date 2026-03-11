import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Attention heatmap interactive visualization
// ---------------------------------------------------------------------------

const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
const N = TOKENS.length;

// Fixed pre-softmax logit matrix — hand-crafted to be interesting:
// syntactic subject-verb, determiner-noun, prepositional phrase relations.
const BASE_LOGITS = [
  [1.2, 0.8, 0.3, 0.1, 0.5, 0.2],  // "The" attends to nouns/verbs
  [0.7, 1.5, 0.9, 0.2, 0.3, 0.6],  // "cat" attends to itself + "sat"
  [0.2, 1.1, 1.8, 0.5, 0.1, 0.4],  // "sat" attends to "cat" and itself
  [0.1, 0.2, 0.3, 1.0, 0.8, 0.9],  // "on" attends to its PP head "mat"
  [0.6, 0.1, 0.1, 0.3, 1.2, 0.7],  // "the" attends to determiner role
  [0.2, 0.5, 0.4, 0.8, 0.6, 1.6],  // "mat" attends to itself + "on"
];

function softmaxRow(row, tau) {
  const scaled = row.map((v) => v / tau);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((v) => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

function computeAttentionMatrix(tau) {
  return BASE_LOGITS.map((row) => softmaxRow(row, tau));
}

// Map weight in [0,1] to a CSS color interpolating blue→white→red
function weightToColor(w) {
  // Blue (0) → white (0.5) → red (1)
  const r = w < 0.5 ? Math.round(255 * (2 * w)) : 255;
  const g = w < 0.5 ? Math.round(255 * (2 * w)) : Math.round(255 * (2 - 2 * w));
  const b = w < 0.5 ? 255 : Math.round(255 * (2 - 2 * w));
  return `rgb(${r},${g},${b})`;
}

function AttentionHeatmap() {
  const [tau, setTau] = useState(1.0);
  const [hoveredCell, setHoveredCell] = useState(null);

  const matrix = useMemo(() => computeAttentionMatrix(tau), [tau]);

  const cellSize = 52;
  const labelOffset = 56;
  const svgWidth = labelOffset + N * cellSize + 10;
  const svgHeight = labelOffset + N * cellSize + 10;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Attention Matrix
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Softmax attention weights for a 6-token sentence. Rows = queries, columns = keys.
        Adjust temperature <InlineMath math="\tau" /> to observe sharpening vs. diffusion.
      </p>

      {/* Temperature slider */}
      <div className="mb-5 flex items-center gap-4">
        <label className="w-28 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
          Temperature <InlineMath math="\tau" />
        </label>
        <input
          type="range"
          min={0.1}
          max={2.0}
          step={0.05}
          value={tau}
          onChange={(e) => setTau(parseFloat(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-indigo-500"
        />
        <span className="w-12 text-right font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {tau.toFixed(2)}
        </span>
      </div>

      {/* Heatmap SVG */}
      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="mx-auto block"
          style={{ fontFamily: 'inherit' }}
        >
          {/* Column labels (keys) — rotated at top */}
          {TOKENS.map((tok, j) => (
            <text
              key={`col-${j}`}
              x={labelOffset + j * cellSize + cellSize / 2}
              y={labelOffset - 6}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              className="fill-gray-600 dark:fill-gray-400"
            >
              {tok}
            </text>
          ))}

          {/* Row labels (queries) */}
          {TOKENS.map((tok, i) => (
            <text
              key={`row-${i}`}
              x={labelOffset - 6}
              y={labelOffset + i * cellSize + cellSize / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fill="currentColor"
              className="fill-gray-600 dark:fill-gray-400"
            >
              {tok}
            </text>
          ))}

          {/* Cells */}
          {matrix.map((row, i) =>
            row.map((w, j) => {
              const isHovered = hoveredCell && hoveredCell[0] === i && hoveredCell[1] === j;
              return (
                <g
                  key={`${i}-${j}`}
                  onMouseEnter={() => setHoveredCell([i, j])}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <rect
                    x={labelOffset + j * cellSize + 1}
                    y={labelOffset + i * cellSize + 1}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    rx={3}
                    fill={weightToColor(w)}
                    opacity={0.85}
                    stroke={isHovered ? '#6366f1' : 'transparent'}
                    strokeWidth={isHovered ? 2 : 0}
                  />
                  <text
                    x={labelOffset + j * cellSize + cellSize / 2}
                    y={labelOffset + i * cellSize + cellSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="600"
                    fill={w > 0.55 ? '#ffffff' : '#1f2937'}
                  >
                    {w.toFixed(2)}
                  </text>
                </g>
              );
            })
          )}

          {/* Axis labels */}
          <text
            x={labelOffset + (N * cellSize) / 2}
            y={svgHeight - 2}
            textAnchor="middle"
            fontSize={11}
            className="fill-gray-500 dark:fill-gray-400"
          >
            Keys (attended to)
          </text>
          <text
            x={10}
            y={labelOffset + (N * cellSize) / 2}
            textAnchor="middle"
            fontSize={11}
            transform={`rotate(-90, 10, ${labelOffset + (N * cellSize) / 2})`}
            className="fill-gray-500 dark:fill-gray-400"
          >
            Queries
          </text>
        </svg>
      </div>

      {/* Hover tooltip */}
      <div className="mt-3 min-h-[1.5rem] text-center text-xs text-gray-600 dark:text-gray-400">
        {hoveredCell ? (
          <span>
            Query: <strong>{TOKENS[hoveredCell[0]]}</strong> → Key:{' '}
            <strong>{TOKENS[hoveredCell[1]]}</strong> — weight:{' '}
            <strong className="text-indigo-600 dark:text-indigo-400">
              {matrix[hoveredCell[0]][hoveredCell[1]].toFixed(4)}
            </strong>
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-600">Hover a cell to inspect weight</span>
        )}
      </div>

      {/* Color legend */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">Low attention</span>
        <svg width={160} height={14}>
          <defs>
            <linearGradient id="legendGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={weightToColor(0)} />
              <stop offset="50%" stopColor={weightToColor(0.5)} />
              <stop offset="100%" stopColor={weightToColor(1)} />
            </linearGradient>
          </defs>
          <rect width={160} height={14} rx={4} fill="url(#legendGrad)" />
        </svg>
        <span className="text-xs text-gray-500 dark:text-gray-400">High attention</span>
      </div>

      {/* Insight callout */}
      <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-800 dark:border-indigo-700/40 dark:bg-indigo-900/20 dark:text-indigo-300">
        {tau < 0.4 ? (
          <span>
            Low <InlineMath math="\tau" />: softmax is near-argmax — each token attends almost
            exclusively to its most relevant key. Hard retrieval regime.
          </span>
        ) : tau > 1.4 ? (
          <span>
            High <InlineMath math="\tau" />: softmax is near-uniform — attention weights diffuse
            across all keys. Little discriminative signal.
          </span>
        ) : (
          <span>
            Moderate <InlineMath math="\tau \approx 1" />: the default operating regime in
            Transformers after <InlineMath math="\sqrt{d_k}" /> scaling.
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code string
// ---------------------------------------------------------------------------

const ATTENTION_CODE = `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: (batch, heads, seq_len, d_k)
    K: (batch, heads, seq_len, d_k)
    V: (batch, heads, seq_len, d_v)
    """
    d_k = Q.shape[-1]
    # Compute attention scores
    scores = Q @ K.transpose(-2, -1) / np.sqrt(d_k)

    # Apply causal mask (for autoregressive generation)
    if mask is not None:
        scores = scores + mask * (-1e9)  # -inf where masked

    # Softmax over key dimension
    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights = weights / weights.sum(axis=-1, keepdims=True)

    # Weighted sum of values
    output = weights @ V
    return output, weights

# Example: single-head attention on a 4-token sequence
np.random.seed(42)
seq_len, d_k, d_v = 4, 8, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_v)

output, weights = scaled_dot_product_attention(Q, K, V)
print(f"Attention weights (row = query, col = key):\\n{weights.round(3)}")
print(f"Output shape: {output.shape}")

# PyTorch version (built-in, uses Flash Attention kernel):
# import torch.nn.functional as F
# output = F.scaled_dot_product_attention(Q, K, V)`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I.',
    year: 2017,
    title: 'Attention Is All You Need',
    venue: 'NeurIPS 2017',
    url: 'https://arxiv.org/abs/1706.03762',
    type: 'foundational',
    whyImportant: 'Introduced the Transformer architecture and scaled dot-product attention, replacing recurrence entirely. Now the foundation of all major LLMs.',
  },
  {
    authors: 'Bahdanau, D., Cho, K., & Bengio, Y.',
    year: 2015,
    title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
    venue: 'ICLR 2015',
    url: 'https://arxiv.org/abs/1409.0473',
    type: 'foundational',
    whyImportant: 'The original attention mechanism for seq2seq models. Demonstrated that soft alignment over encoder hidden states dramatically improved translation quality.',
  },
  {
    authors: 'Dao, T., Fu, D. Y., Ermon, S., Rudra, A., & Ré, C.',
    year: 2022,
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    venue: 'NeurIPS 2022',
    url: 'https://arxiv.org/abs/2205.14135',
    type: 'foundational',
    whyImportant: 'Reformulates attention computation to minimize HBM reads/writes via tiling, achieving 2–4× speedups and O(n) memory without approximation.',
  },
  {
    authors: 'Clark, K., Khandelwal, U., Levy, O., & Manning, C. D.',
    year: 2019,
    title: 'What Does BERT Look at? An Analysis of BERT\'s Attention',
    venue: 'BlackboxNLP 2019',
    url: 'https://arxiv.org/abs/1906.04341',
    type: 'survey',
    whyImportant: 'Empirical study showing that different attention heads specialize in syntactic and semantic relations, validating the multi-head design philosophy.',
  },
];

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------

export default function ScaledDotProductAttention() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Scaled Dot-Product Attention
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The core operation powering all modern Transformer-based language models.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          Attention mechanisms were introduced by{' '}
          <strong>Bahdanau et al. (2015)</strong> for sequence-to-sequence neural machine
          translation. Their additive attention allowed a decoder to selectively focus on
          different encoder positions, breaking the fixed-context-vector bottleneck of vanilla
          seq2seq models.
        </p>
        <p className="mt-2">
          <strong>Vaswani et al. (2017)</strong> — "Attention Is All You Need" — replaced
          recurrence and convolution entirely with <em>scaled dot-product attention</em>,
          introducing the Transformer. This single architectural decision underlies GPT, BERT,
          PaLM, Llama, and every major LLM today.
        </p>
      </NoteBlock>

      {/* Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">Motivation</h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Traditional sequence-to-sequence models (Sutskever et al., 2014) encoded the entire
          source sequence into a single fixed-size context vector — a severe information
          bottleneck for long sequences. Attention resolves this by allowing each decoder step to
          compute a <em>weighted average</em> over all encoder hidden states, with weights
          reflecting relevance.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          In <strong>self-attention</strong>, queries, keys, and values all come from the
          same sequence. Each token can directly attend to every other token in a single
          layer, bypassing the long-range vanishing gradient problem of RNNs. This gives
          Transformers <InlineMath math="O(1)" /> path length between any two positions
          (versus <InlineMath math="O(n)" /> for RNNs).
        </p>
      </section>

      {/* Definition */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Scaled Dot-Product Attention"
        definition="Given query matrix $Q \in \mathbb{R}^{n \times d_k}$, key matrix $K \in \mathbb{R}^{m \times d_k}$, and value matrix $V \in \mathbb{R}^{m \times d_v}$, the scaled dot-product attention output is:"
        notation="$n$ = query sequence length, $m$ = key/value sequence length, $d_k$ = key/query dimension, $d_v$ = value dimension."
      />
      <BlockMath math="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V" />
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        The term <InlineMath math="QK^\top \in \mathbb{R}^{n \times m}" /> computes all
        pairwise dot products between queries and keys. Dividing by{' '}
        <InlineMath math="\sqrt{d_k}" /> stabilizes gradients. The softmax is applied
        row-wise (over the key dimension), giving a stochastic matrix of attention weights{' '}
        <InlineMath math="A \in \mathbb{R}^{n \times m}" />. The output is then the
        weighted combination of value rows: <InlineMath math="AV \in \mathbb{R}^{n \times d_v}" />.
      </p>

      {/* Why sqrt(d_k) */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Why the <InlineMath math="\sqrt{d_k}" /> Scaling?
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Suppose the components of query and key vectors are independent standard normals:{' '}
          <InlineMath math="q_i, k_i \sim \mathcal{N}(0,1)" />. The dot product is:
        </p>
        <BlockMath math="q \cdot k = \sum_{i=1}^{d_k} q_i k_i" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Each product <InlineMath math="q_i k_i" /> has mean 0 and variance 1, so the sum
          has variance <InlineMath math="d_k" />. For large{' '}
          <InlineMath math="d_k" /> (e.g., 64–128 in GPT-2), the logits fed into softmax
          can be on the order of <InlineMath math="\sqrt{d_k}" />, pushing the softmax into
          its <em>saturation region</em> where the gradient{' '}
          <InlineMath math="\partial \text{softmax} / \partial s_i \approx 0" />. This
          causes training instability and very slow learning.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Dividing by <InlineMath math="\sqrt{d_k}" /> normalizes the dot products back to
          unit variance:
        </p>
        <BlockMath math="\operatorname{Var}\!\left[\frac{q \cdot k}{\sqrt{d_k}}\right] = \frac{d_k}{d_k} = 1" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          This keeps the softmax in a gradient-friendly regime and makes training
          considerably more stable across different model widths.
        </p>
      </section>

      {/* Theorem — Soft Retrieval */}
      <TheoremBlock
        label="Theorem 1.1"
        title="Attention as Soft Dictionary Lookup"
        statement="Attention implements a differentiable, soft key-value dictionary retrieval. For a query $q$ and database of key-value pairs $\{(k_j, v_j)\}_{j=1}^{m}$, the output is $\sum_{j} \alpha_j v_j$ where $\alpha_j = \text{softmax}(q \cdot k / \sqrt{d_k})_j$. As temperature $\tau \to 0$ in $\text{softmax}(s/\tau)$, the weights concentrate on $\arg\max_j(q \cdot k_j)$, recovering hard (argmax) retrieval. As $\tau \to \infty$, weights become uniform and the output converges to the mean of all values."
        proof="Let $s_j = q \cdot k_j / \tau$. The softmax weight $\alpha_j = \exp(s_j) / \sum_l \exp(s_l)$. Let $j^* = \arg\max_j s_j$. Divide numerator and denominator by $\exp(s_{j^*})$: $\alpha_j = \exp(s_j - s_{j^*}) / \sum_l \exp(s_l - s_{j^*})$. As $\tau \to 0$, $s_j - s_{j^*} = (q \cdot k_j - q \cdot k_{j^*})/\tau \to -\infty$ for all $j \neq j^*$, so $\exp(s_j - s_{j^*}) \to 0$ and $\alpha_{j^*} \to 1$. As $\tau \to \infty$, all $s_j \to 0$, so $\alpha_j \to 1/m$ for all $j$. $\square$"
        corollaries={[
          "The temperature parameter $\\tau$ interpolates between hard nearest-neighbor lookup and uniform averaging.",
          "This framing connects Transformers to memory-augmented neural networks and neural Turing machines.",
          "In trained models, $\\tau$ is implicit via the scale of weight matrices — models learn to control sharpness through $\\|W_Q\\|$ and $\\|W_K\\|$.",
        ]}
      />

      {/* Interactive Heatmap */}
      <AttentionHeatmap />

      {/* Softmax gradient derivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Gradient of the Softmax
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Understanding why scaling prevents gradient vanishing requires the Jacobian of
          softmax. Let <InlineMath math="p = \text{softmax}(s)" />. Then:
        </p>
        <BlockMath math="p_j = \frac{e^{s_j}}{\sum_l e^{s_l}}" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Computing <InlineMath math="\partial p_j / \partial s_i" /> by the quotient rule:
        </p>
        <BlockMath math="\frac{\partial p_j}{\partial s_i} = p_j\!\left(\delta_{ij} - p_i\right)" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          where <InlineMath math="\delta_{ij}" /> is the Kronecker delta. In matrix form,
          the Jacobian is:
        </p>
        <BlockMath math="J_{\text{softmax}} = \operatorname{diag}(p) - pp^\top \in \mathbb{R}^{m \times m}" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          When logits are large (high magnitude), <InlineMath math="p" /> concentrates near a
          one-hot vector. Then <InlineMath math="\operatorname{diag}(p) \approx pp^\top" />,
          so <InlineMath math="J \approx 0" /> — nearly zero gradients everywhere. This is
          the saturation regime that <InlineMath math="\sqrt{d_k}" /> scaling prevents.
        </p>
      </section>

      {/* Multi-head extension */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Multi-Head Attention
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Rather than a single attention function over{' '}
          <InlineMath math="d_{\text{model}}" />-dimensional keys/queries, it is beneficial
          to project into <InlineMath math="h" /> different subspaces and compute attention
          in parallel:
        </p>
        <BlockMath math="\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)\, W^O" />
        <BlockMath math="\text{head}_i = \text{Attention}(Q W_i^Q,\; K W_i^K,\; V W_i^V)" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          where <InlineMath math="W_i^Q, W_i^K \in \mathbb{R}^{d_{\text{model}} \times d_k}" />,
          <InlineMath math="W_i^V \in \mathbb{R}^{d_{\text{model}} \times d_v}" />, and
          <InlineMath math="W^O \in \mathbb{R}^{h d_v \times d_{\text{model}}}" />.
          Typically <InlineMath math="d_k = d_v = d_{\text{model}} / h" />.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Different heads empirically specialize: some track syntactic dependencies
          (subject-verb agreement), others semantic similarity, others coreference. This
          multi-perspective representation is a key reason Transformers outperform single-head
          variants. Empirically, GPT-2 uses <InlineMath math="h = 12" /> heads with{' '}
          <InlineMath math="d_{\text{model}} = 768" />, giving{' '}
          <InlineMath math="d_k = 64" /> per head.
        </p>
      </section>

      {/* Computational complexity */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Computational Complexity
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Operation</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Memory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">QKᵀ matmul</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300"><InlineMath math="O(n^2 d_k)" /></td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300"><InlineMath math="O(n^2)" /></td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">Softmax</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300"><InlineMath math="O(n^2)" /></td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300"><InlineMath math="O(n^2)" /></td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">AV matmul</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300"><InlineMath math="O(n^2 d_v)" /></td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300"><InlineMath math="O(n d_v)" /></td>
              </tr>
              <tr className="bg-gray-50/80 dark:bg-gray-800/20">
                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">Total (full attention)</td>
                <td className="px-4 py-3 font-semibold text-red-600 dark:text-red-400"><InlineMath math="O(n^2 d)" /></td>
                <td className="px-4 py-3 font-semibold text-red-600 dark:text-red-400"><InlineMath math="O(n^2)" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The quadratic <InlineMath math="O(n^2)" /> scaling in both time and memory is the
          primary bottleneck for long-context models. For a sequence of length{' '}
          <InlineMath math="n = 128{,}000" /> (Claude 3), the attention matrix alone has
          ~16 billion entries per layer per head. FlashAttention (Dao et al., 2022) addresses
          this via tiled computation that avoids materializing the full matrix in HBM, achieving
          the same result in <InlineMath math="O(n)" /> memory. Sparse and linear attention
          variants further reduce complexity at a quality tradeoff.
        </p>
      </section>

      {/* Python implementation */}
      <PythonCode
        code={ATTENTION_CODE}
        language="python"
        title="Scaled Dot-Product Attention — NumPy Implementation"
        runnable
      />

      {/* Warning block */}
      <WarningBlock title="Critical Implementation Notes">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>Attention is permutation-equivariant.</strong> The mechanism has no
              inherent notion of order — swapping two tokens and swapping the corresponding rows
              in the output produces the same result. Without positional encodings (sinusoidal,
              RoPE, ALiBi, etc.), the model cannot distinguish "The cat sat" from "cat sat The".
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>Causal masking is required for autoregressive (decoder) attention.</strong>{' '}
              Without an upper-triangular mask, each position can attend to future tokens,
              leaking ground-truth labels during training. Apply additive{' '}
              <InlineMath math="-\infty" /> masking <em>before</em> softmax (not after).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>Always scale by <InlineMath math="\sqrt{d_k}" />.</strong> Omitting
              this — or scaling by the wrong factor — leads to saturated softmax weights,
              near-zero gradients, and training failure, especially at larger{' '}
              <InlineMath math="d_k" />. This is one of the most common reimplementation bugs.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
