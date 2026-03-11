import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import SectionLayout from '../../../components/content/SectionLayout.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'

function makePrng(seed) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0xFFFFFFFF
  }
}

function softmax(arr) {
  const m = Math.max(...arr)
  const ex = arr.map(x => Math.exp(x - m))
  const s = ex.reduce((a, b) => a + b, 0)
  return ex.map(x => x / s)
}

function genAttentionWeights(n, h, seed) {
  const rand = makePrng(seed)
  return Array.from({ length: h }, () =>
    Array.from({ length: n }, () => softmax(Array.from({ length: n }, () => rand() * 4 - 2)))
  )
}

function heatmapColor(v) {
  // dark blue (0) to bright yellow (1)
  const r = Math.round(v * 255)
  const g = Math.round(v * 200)
  const b = Math.round((1 - v) * 200)
  return `rgb(${r},${g},${b})`
}

function MultiHeadViz() {
  const [h, setH] = useState(4)
  const [n, setN] = useState(6)
  const [seed, setSeed] = useState(42)

  const weights = useMemo(() => genAttentionWeights(n, h, seed), [n, h, seed])

  const cellSize = Math.min(32, Math.floor(200 / n))
  const headW = n * cellSize + 20
  const tokens = Array.from({ length: n }, (_, i) => `t${i+1}`)

  return (
    <div className="my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <h3 className="mb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
        Multi-Head Attention Weights — Each Head Learns Different Patterns
      </h3>

      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Heads h</label>
          <div className="flex gap-1">
            {[1,2,4,8].map(v => (
              <button key={v} onClick={() => setH(v)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  h === v ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Seq length n</label>
          <div className="flex gap-1">
            {[4,6,8].map(v => (
              <button key={v} onClick={() => setN(v)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  n === v ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>{v}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setSeed(s => s + 1)}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 self-end">
          Regenerate ↻
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center overflow-x-auto">
        {weights.map((headWeights, hi) => (
          <div key={hi} className="flex flex-col items-center">
            <div className="text-xs font-medium text-indigo-400 mb-1">Head {hi+1}</div>
            <svg width={headW} height={headW}>
              {/* Column labels (keys) */}
              {tokens.map((t, j) => (
                <text key={j} x={10 + j * cellSize + cellSize/2} y={12}
                  textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{t}</text>
              ))}
              {headWeights.map((row, i) => (
                <g key={i}>
                  {/* Row label (queries) */}
                  <text x={8} y={18 + i * cellSize + cellSize/2}
                    textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">{tokens[i]}</text>
                  {row.map((val, j) => (
                    <rect key={j}
                      x={10 + j * cellSize} y={15 + i * cellSize}
                      width={cellSize - 1} height={cellSize - 1}
                      fill={heatmapColor(val)}
                      rx={2}
                    >
                      <title>{val.toFixed(3)}</title>
                    </rect>
                  ))}
                </g>
              ))}
            </svg>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: heatmapColor(0) }} />
          low attn
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: heatmapColor(1) }} />
          high attn
        </div>
        <span>· rows=queries, cols=keys</span>
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center max-w-md">
        Each head attends to different positions. In trained models, heads specialize: some attend locally, some globally, some to specific syntactic roles.
      </p>
    </div>
  )
}

export default function MultiHeadAttentionSection() {
  return (
    <SectionLayout>
      <NoteBlock
        title="Historical Note"
        content="Multi-head attention was introduced in Vaswani et al. (2017) 'Attention Is All You Need' with h=8 heads, d_model=512, d_k=d_v=64. The insight was that allowing multiple parallel attention heads lets the model jointly attend to information from different representation subspaces. This architecture became the foundation of all modern LLMs."
      />

      <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        Scaled dot-product attention uses a single set of query/key/value projections. But a sentence
        has many simultaneous relationships — syntactic, semantic, co-reference, positional. Multi-head
        attention runs <InlineMath math="h" /> attention heads in parallel, each learning to attend to
        different aspects, then concatenates and projects the results.
      </p>

      <DefinitionBlock
        label="Definition 2.1"
        title="Multi-Head Attention"
        definition="For $h$ heads with $d_{\text{model}}$-dimensional input, define per-head projections $W_i^Q, W_i^K \in \mathbb{R}^{d_{\text{model}} \times d_k}$ and $W_i^V \in \mathbb{R}^{d_{\text{model}} \times d_v}$ (with $d_k = d_v = d_{\text{model}}/h$). Then: $\text{head}_i = \text{Attention}(QW_i^Q,\; KW_i^K,\; VW_i^V)$, and $\text{MHA}(Q,K,V) = \text{Concat}(\text{head}_1,\ldots,\text{head}_h)\,W^O$ where $W^O \in \mathbb{R}^{hd_v \times d_{\text{model}}}$."
        notation="Total parameters for MHA: $4d_{\text{model}}^2$ (same as single-head with $d_k = d_{\text{model}}$)."
      />

      <MultiHeadViz />

      <TheoremBlock
        label="Theorem 2.2"
        title="Expressivity of Multi-Head vs. Single-Head Attention"
        statement="Multi-head attention with $h$ heads, $d_k = d_{\text{model}}/h$ can represent $h$ independent attention distributions simultaneously. A single-head attention with the same total parameter count ($d_k = d_{\text{model}}$) can only represent one distribution, which is a mixture of information from a single attention pattern."
        proof="Each head $i$ computes an independent $n \times n$ attention matrix $A_i = \text{softmax}(QW_i^Q(KW_i^K)^T/\sqrt{d_k})$ with rank at most $\min(n, d_k)$. Since heads operate independently, MHA can represent $h$ different rank-$d_k$ attention patterns. Single-head with $d_k = d_{\text{model}} = hd_k'$ computes one attention pattern — even though it has more flexibility per pattern, it cannot represent multiple independent patterns simultaneously. The output concatenation followed by $W^O$ projection allows selective mixing of what each head attends to."
        corollaries={[
          "The number of parameters is the same: $h \\times (3d_{\\text{model}}d_k + d_{\\text{model}}d_v) + hd_v \\cdot d_{\\text{model}} = 4d_{\\text{model}}^2$ (with $d_k=d_v=d_{\\text{model}}/h$).",
          "Computational complexity is $O(n^2 d_{\\text{model}})$ per layer — same as single-head. The $n^2$ term is the bottleneck for long sequences.",
          "Empirically, different heads specialize: Clark et al. (2019) found BERT heads attend to delimiter tokens, subject-verb dependencies, and coreference patterns."
        ]}
      />

      <ExampleBlock
        title="MHA Computation: n=4, h=2, d_model=8"
        steps={[
          { label: "Dimensions", content: "$n=4$ tokens, $h=2$ heads, $d_{\\text{model}}=8$, so $d_k=d_v=4$ per head" },
          { label: "Per-head projections", content: "Head 1: $Q_1 = XW_1^Q \\in \\mathbb{R}^{4\\times4}$, same for $K_1, V_1$. Head 2: $Q_2=XW_2^Q$, etc. (6 projection matrices total)" },
          { label: "Attention per head", content: "$A_i = \\text{softmax}(Q_iK_i^T/\\sqrt{4}) \\in \\mathbb{R}^{4\\times4}$, head output $H_i = A_i V_i \\in \\mathbb{R}^{4\\times4}$" },
          { label: "Concatenate", content: "$\\text{Concat}(H_1, H_2) \\in \\mathbb{R}^{4 \\times 8}$ (stack head outputs along feature dimension)" },
          { label: "Output projection", content: "$\\text{MHA} = \\text{Concat}(H_1,H_2) W^O \\in \\mathbb{R}^{4\\times8}$ where $W^O \\in \\mathbb{R}^{8\\times8}$" },
          { label: "Parameter count", content: "$2 \\times (3 \\times 8 \\times 4) + 8\\times8 = 192 + 64 = 256 = 4 \\times 8^2 = 4d^2$ ✓" }
        ]}
      />

      <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Complexity Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-600 dark:text-gray-400">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-1 pr-4">Operation</th>
                <th className="text-left py-1 pr-4">Time</th>
                <th className="text-left py-1">Memory</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['QKV projections', 'O(n · d²)', 'O(n · d)'],
                ['Attention scores (per head)', 'O(n² · d_k)', 'O(h · n²)'],
                ['Attention × V (per head)', 'O(n² · d_v)', 'O(n · d)'],
                ['Output projection', 'O(n · d²)', 'O(n · d)'],
                ['Total per layer', 'O(n² · d + n · d²)', 'O(n² + n · d)'],
              ].map(([op, time, mem]) => (
                <tr key={op} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-1 pr-4 font-mono">{op}</td>
                  <td className="py-1 pr-4 text-indigo-400">{time}</td>
                  <td className="py-1 text-amber-400">{mem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          The <InlineMath math="O(n^2)" /> attention matrix is the bottleneck for long sequences — motivating FlashAttention, linear attention, and sparse attention variants.
        </p>
      </div>

      <PythonCode
        title="Multi-Head Attention: NumPy from scratch + PyTorch comparison"
        code={`import numpy as np
import torch
import torch.nn as nn

def scaled_dot_product_attn(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)          # (n, n)
    scores -= scores.max(axis=-1, keepdims=True)  # numerical stability
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)
    return weights @ V, weights               # (n, d_v), (n, n)

def multi_head_attention(X, Wq_list, Wk_list, Wv_list, Wo):
    """
    X:       (n, d_model)
    Wq_list: list of h (d_model, d_k) matrices
    Returns: (n, d_model)
    """
    head_outputs = []
    attn_weights = []
    for Wq, Wk, Wv in zip(Wq_list, Wk_list, Wv_list):
        Q = X @ Wq                            # (n, d_k)
        K = X @ Wk
        V = X @ Wv
        head_out, weights = scaled_dot_product_attn(Q, K, V)
        head_outputs.append(head_out)
        attn_weights.append(weights)
    
    concat = np.concatenate(head_outputs, axis=-1)  # (n, h*d_v)
    output = concat @ Wo                            # (n, d_model)
    return output, attn_weights

# Test
np.random.seed(42)
n, d_model, h = 6, 16, 4
d_k = d_v = d_model // h       # 4 per head

X = np.random.randn(n, d_model)
Wq_list = [np.random.randn(d_model, d_k) * 0.1 for _ in range(h)]
Wk_list = [np.random.randn(d_model, d_k) * 0.1 for _ in range(h)]
Wv_list = [np.random.randn(d_model, d_v) * 0.1 for _ in range(h)]
Wo = np.random.randn(h * d_v, d_model) * 0.1

out, weights = multi_head_attention(X, Wq_list, Wk_list, Wv_list, Wo)
print(f"Output shape: {out.shape}")        # (6, 16)
print(f"Head 0 attention weights:\\n{weights[0].round(3)}")

# ── PyTorch reference ──────────────────────────────────────────────────────
mha = nn.MultiheadAttention(embed_dim=d_model, num_heads=h, batch_first=True)
X_t = torch.tensor(X, dtype=torch.float32).unsqueeze(0)  # (1, n, d_model)
with torch.no_grad():
    out_pt, attn_pt = mha(X_t, X_t, X_t)
print(f"\\nPyTorch output shape: {out_pt.shape}")  # (1, 6, 16)
`}
      />

      <WarningBlock
        title="Common Issues in Practice"
        items={[
          "Head collapse: in untrained or poorly trained models, all heads learn the same pattern. Use different random seeds for W^Q, W^K, W^V initialization to break symmetry.",
          "The 1/√d_k scaling is per-head (using d_k = d_model/h), NOT using d_model. Scaling by 1/√d_model for each head would be wrong and cause vanishing gradients.",
          "Attention sink: in autoregressive models (GPT-style), the first token often accumulates disproportionately high attention (attention sink). This is exploited in StreamingLLM.",
          "Computational cost scales as O(n²) in sequence length. For n > 4096, consider FlashAttention (IO-aware), ALiBi (no positional encoding), or linear attention alternatives."
        ]}
      />

      <ExerciseBlock
        exercises={[
          { difficulty: "conceptual", question: "Explain intuitively why having $h$ heads with $d_k = d_{\\text{model}}/h$ is better than a single head with $d_k = d_{\\text{model}}$, even though the parameter count is the same." },
          { difficulty: "computational", question: "For a Transformer with $d_{\\text{model}}=512$, $h=8$, $n=128$: compute the memory (bytes, float32) needed to store all attention weight matrices across all heads. Why does this grow quadratically with $n$?" },
          { difficulty: "proof", question: "Show that the total number of trainable parameters in the MHA module (Q, K, V projections + output projection) equals $4d_{\\text{model}}^2$ when $d_k = d_v = d_{\\text{model}}/h$." },
          { difficulty: "implementation", question: "Implement masked multi-head attention (causal/autoregressive masking) in NumPy. Verify that token $i$ cannot attend to token $j > i$ by checking that the masked attention weights are zero for future positions." }
        ]}
      />

      <ReferenceList
        references={[
          { authors: "Vaswani, A. et al.", year: 2017, title: "Attention is all you need", venue: "NeurIPS 2017", url: "https://arxiv.org/abs/1706.03762", note: "Introduced multi-head attention and the Transformer architecture" },
          { authors: "Clark, K., Khandelwal, U., Levy, O., & Manning, C. D.", year: 2019, title: "What does BERT look at? An analysis of BERT's attention", venue: "ACL Workshop on BlackboxNLP", url: "https://arxiv.org/abs/1906.04341", note: "Empirical analysis of what different attention heads learn" },
          { authors: "Michel, P., Levy, O., & Neubig, G.", year: 2019, title: "Are sixteen heads really better than one?", venue: "NeurIPS 2019", url: "https://arxiv.org/abs/1905.10650", note: "Pruning study showing most heads can be removed at test time" },
          { authors: "Dao, T. et al.", year: 2022, title: "FlashAttention: fast and memory-efficient exact attention with IO-awareness", venue: "NeurIPS 2022", url: "https://arxiv.org/abs/2205.14135", note: "IO-aware attention algorithm that reduces memory from O(n²) to O(n)" }
        ]}
      />
    </SectionLayout>
  )
}
