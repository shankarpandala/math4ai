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
// Bi-Encoder vs Cross-Encoder Comparison Diagram
// ---------------------------------------------------------------------------

function BiEncoderVsCrossEncoder() {
  const [mode, setMode] = useState('bi');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Bi-Encoder vs Cross-Encoder Architecture
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Compare how bi-encoders enable scalable retrieval while cross-encoders deliver
        higher precision through joint query-document processing.
      </p>

      <div className="mb-4 flex gap-2">
        {[
          { key: 'bi', label: 'Bi-Encoder' },
          { key: 'cross', label: 'Cross-Encoder' },
          { key: 'colbert', label: 'ColBERT (Late Interaction)' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              mode === key
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'bi' && (
        <svg width="100%" viewBox="0 0 460 200" className="mx-auto block">
          {/* Query encoder */}
          <rect x={10} y={70} width={120} height={60} rx={8} fill="#eef2ff" stroke="#6366f1" strokeWidth={1.5} />
          <text x={70} y={96} textAnchor="middle" fontSize={11} fontWeight="700" fill="#4338ca">BERT</text>
          <text x={70} y={112} textAnchor="middle" fontSize={10} fill="#6366f1">Query Encoder</text>

          {/* Query box */}
          <rect x={10} y={20} width={120} height={30} rx={6} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
          <text x={70} y={39} textAnchor="middle" fontSize={10} fill="#475569">"What causes rain?"</text>

          {/* Arrow query → encoder */}
          <line x1={70} y1={50} x2={70} y2={70} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arr)" />

          {/* Query embedding */}
          <rect x={10} y={155} width={120} height={30} rx={6} fill="#c7d2fe" stroke="#6366f1" strokeWidth={1} />
          <text x={70} y={174} textAnchor="middle" fontSize={10} fontWeight="700" fill="#4338ca">q ∈ ℝ⁷⁶⁸</text>
          <line x1={70} y1={130} x2={70} y2={155} stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#arr2)" />

          {/* Document encoder */}
          <rect x={330} y={70} width={120} height={60} rx={8} fill="#ecfdf5" stroke="#10b981" strokeWidth={1.5} />
          <text x={390} y={96} textAnchor="middle" fontSize={11} fontWeight="700" fill="#065f46">BERT</text>
          <text x={390} y={112} textAnchor="middle" fontSize={10} fill="#10b981">Doc Encoder</text>

          {/* Doc box */}
          <rect x={330} y={20} width={120} height={30} rx={6} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
          <text x={390} y={39} textAnchor="middle" fontSize={10} fill="#475569">"Rain forms when..."</text>

          {/* Arrow doc → encoder */}
          <line x1={390} y1={50} x2={390} y2={70} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arr)" />

          {/* Doc embedding */}
          <rect x={330} y={155} width={120} height={30} rx={6} fill="#a7f3d0" stroke="#10b981" strokeWidth={1} />
          <text x={390} y={174} textAnchor="middle" fontSize={10} fontWeight="700" fill="#065f46">d ∈ ℝ⁷⁶⁸</text>
          <line x1={390} y1={130} x2={390} y2={155} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arr3)" />

          {/* Dot product */}
          <rect x={178} y={148} width={104} height={37} rx={8} fill="#fef9c3" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={230} y={168} textAnchor="middle" fontSize={12} fontWeight="700" fill="#92400e">q · d = score</text>
          <line x1={130} y1={168} x2={178} y2={168} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arr4)" />
          <line x1={330} y1={168} x2={282} y2={168} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arr5)" />

          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
            </marker>
            <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#6366f1" />
            </marker>
            <marker id="arr3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#10b981" />
            </marker>
            <marker id="arr4" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
            </marker>
            <marker id="arr5" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M6,0 L6,6 L0,3 z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      )}

      {mode === 'cross' && (
        <svg width="100%" viewBox="0 0 460 200" className="mx-auto block">
          {/* Combined input */}
          <rect x={115} y={10} width={230} height={35} rx={8} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
          <text x={230} y={32} textAnchor="middle" fontSize={10} fill="#475569">
            [CLS] query [SEP] document [SEP]
          </text>

          {/* Cross-encoder */}
          <rect x={90} y={70} width={280} height={60} rx={8} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={230} y={96} textAnchor="middle" fontSize={12} fontWeight="700" fill="#92400e">BERT Cross-Encoder</text>
          <text x={230} y={116} textAnchor="middle" fontSize={10} fill="#b45309">(full self-attention over concatenation)</text>
          <line x1={230} y1={45} x2={230} y2={70} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arr6)" />

          {/* Score */}
          <rect x={165} y={155} width={130} height={35} rx={8} fill="#fef9c3" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={230} y={177} textAnchor="middle" fontSize={12} fontWeight="700" fill="#92400e">relevance score</text>
          <line x1={230} y1={130} x2={230} y2={155} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arr7)" />

          <text x={230} y={195} textAnchor="middle" fontSize={9} fill="#6b7280">
            ⚠ Requires 1 forward pass per (query, doc) pair
          </text>

          <defs>
            <marker id="arr6" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
            </marker>
            <marker id="arr7" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      )}

      {mode === 'colbert' && (
        <svg width="100%" viewBox="0 0 460 220" className="mx-auto block">
          {/* Query tokens */}
          {['What', 'causes', 'rain', '?'].map((tok, i) => (
            <g key={`qt-${i}`}>
              <rect x={10 + i * 52} y={10} width={46} height={25} rx={5} fill="#eef2ff" stroke="#6366f1" strokeWidth={1} />
              <text x={33 + i * 52} y={26} textAnchor="middle" fontSize={9} fill="#4338ca">{tok}</text>
            </g>
          ))}
          {/* Query BERT */}
          <rect x={10} y={55} width={220} height={40} rx={8} fill="#eef2ff" stroke="#6366f1" strokeWidth={1.5} />
          <text x={120} y={79} textAnchor="middle" fontSize={11} fontWeight="700" fill="#4338ca">Query BERT → {'{'}q₁, q₂, q₃, q₄{'}'}</text>
          {[0,1,2,3].map(i => <line key={i} x1={33+i*52} y1={35} x2={33+i*52} y2={55} stroke="#6366f1" strokeWidth={1} />)}

          {/* Doc tokens */}
          {['Rain', 'forms', 'when', 'air', '...'].map((tok, i) => (
            <g key={`dt-${i}`}>
              <rect x={240 + i * 42} y={10} width={36} height={25} rx={5} fill="#ecfdf5" stroke="#10b981" strokeWidth={1} />
              <text x={258 + i * 42} y={26} textAnchor="middle" fontSize={9} fill="#065f46">{tok}</text>
            </g>
          ))}
          {/* Doc BERT */}
          <rect x={240} y={55} width={215} height={40} rx={8} fill="#ecfdf5" stroke="#10b981" strokeWidth={1.5} />
          <text x={347} y={79} textAnchor="middle" fontSize={11} fontWeight="700" fill="#065f46">Doc BERT → {'{'}d₁,…,d₅{'}'}</text>
          {[0,1,2,3,4].map(i => <line key={i} x1={258+i*42} y1={35} x2={258+i*42} y2={55} stroke="#10b981" strokeWidth={1} />)}

          {/* MaxSim */}
          <rect x={100} y={130} width={260} height={45} rx={8} fill="#fef9c3" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={230} y={150} textAnchor="middle" fontSize={11} fontWeight="700" fill="#92400e">
            MaxSim: Σᵢ maxⱼ(qᵢ · dⱼ)
          </text>
          <text x={230} y={166} textAnchor="middle" fontSize={9} fill="#b45309">Late interaction — token-level dot products</text>

          <line x1={120} y1={95} x2={165} y2={130} stroke="#6366f1" strokeWidth={1.5} />
          <line x1={347} y1={95} x2={300} y2={130} stroke="#10b981" strokeWidth={1.5} />

          <text x={230} y={205} textAnchor="middle" fontSize={9} fill="#6b7280">
            ColBERT: encoders run offline per doc; MaxSim computed at retrieval
          </text>
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `from transformers import DPRQuestionEncoder, DPRContextEncoder, DPRTokenizer
import torch
import torch.nn.functional as F

# Load DPR encoders
q_tokenizer  = DPRTokenizer.from_pretrained('facebook/dpr-question_encoder-single-nq-base')
q_encoder    = DPRQuestionEncoder.from_pretrained('facebook/dpr-question_encoder-single-nq-base')
ctx_tokenizer = DPRTokenizer.from_pretrained('facebook/dpr-ctx_encoder-single-nq-base')
ctx_encoder  = DPRContextEncoder.from_pretrained('facebook/dpr-ctx_encoder-single-nq-base')

query = "What causes rain?"
passages = [
    "Rain forms when water vapor condenses around dust particles.",
    "The stock market fell 2% today.",
    "Precipitation occurs when atmospheric moisture exceeds saturation.",
]

# Encode query
q_inputs = q_tokenizer(query, return_tensors='pt', truncation=True, max_length=64)
with torch.no_grad():
    q_emb = q_encoder(**q_inputs).pooler_output  # (1, 768)

# Encode passages
ctx_inputs = ctx_tokenizer(passages, return_tensors='pt', padding=True,
                           truncation=True, max_length=256)
with torch.no_grad():
    d_embs = ctx_encoder(**ctx_inputs).pooler_output  # (3, 768)

# Score = dot product (DPR uses unnormalized dot product)
scores = (q_emb @ d_embs.T).squeeze()
print("DPR relevance scores:", scores.tolist())

# Rank passages
ranked = sorted(zip(scores.tolist(), passages), reverse=True)
for score, passage in ranked:
    print(f"  [{score:.3f}] {passage[:60]}")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function DenseRetrieval() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Dense Retrieval
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          DPR, bi-encoders, and late interaction models — learning to retrieve relevant
          passages from large corpora using dense vector representations.
        </p>
      </div>

      <BiEncoderVsCrossEncoder />

      <DefinitionBlock
        label="Definition 1.1"
        title="Dense Passage Retrieval (DPR)"
        definition="DPR (Karpukhin et al., 2020) trains two independent BERT encoders: a question encoder $E_Q$ and a passage encoder $E_P$. The relevance score of passage $p$ for question $q$ is the dot product $s(q, p) = E_Q(q)^\top E_P(p)$. Both encoders are fine-tuned end-to-end on question-passage pairs using an in-batch negative InfoNCE-style loss. At inference time, all passages are pre-encoded and indexed with FAISS; only the query requires a live forward pass."
        notation="The key advantage over BM25: DPR can match semantically equivalent but lexically different queries and passages. The key limitation: DPR requires in-domain training data and performs poorly out-of-the-box on domains not covered by its training set (NQ, TriviaQA, etc.)."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="ColBERT Late Interaction"
        definition="ColBERT (Khattab & Zaharia, 2020) produces per-token embeddings for both query and document: $Q = \text{BERT}_Q(q) \in \mathbb{R}^{|q| \times d}$ and $D = \text{BERT}_D(p) \in \mathbb{R}^{|p| \times d}$. The relevance score is computed by MaxSim: $s(q, p) = \sum_{i=1}^{|q|} \max_{j=1}^{|p|} Q_i^\top D_j$. Each query token finds its best matching document token, and scores are summed across query tokens."
        notation="ColBERT sits between bi-encoder (full independence) and cross-encoder (full joint attention). Document token embeddings are pre-computed and indexed offline. At query time, only MaxSim computation is needed — $O(|q| \times |p|)$ dot products per candidate, which is fast. ColBERT achieves cross-encoder-like accuracy at bi-encoder-like retrieval speed for a top-$k$ candidate set."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="DPR In-Batch Negative Training"
        statement="DPR is trained with in-batch negatives: for a batch of $B$ question-passage pairs $(q_i, p_i^+)$ with one hard negative $p_i^-$ per question, the training loss is: $\mathcal{L} = -\frac{1}{B} \sum_{i=1}^{B} \log \frac{e^{s(q_i, p_i^+)}}{e^{s(q_i, p_i^+)} + e^{s(q_i, p_i^-)} + \sum_{j \neq i} e^{s(q_i, p_j^+)}}$. The other questions' positive passages serve as additional negatives."
        proof="The denominator sums over $B + 1$ terms per question: the hard negative, the positive, and $B-1$ in-batch negatives (other questions' positives). Maximizing the loss is equivalent to maximizing $s(q_i, p_i^+)$ while minimizing $s(q_i, p_j)$ for all $j \neq i$ — pushing the question embedding toward its relevant passage and away from all other passages. Hard negatives (BM25-retrieved passages that don't answer the question) are crucial: without them, the model can ignore semantically plausible but incorrect passages. $\square$"
        corollaries={[
          'Larger batch sizes provide more in-batch negatives, improving training quality at the cost of memory. DPR uses B=128 with 8 hard negatives per question.',
          'Gold negatives (passages that contain the answer but for a different question) are harder negatives than random and provide stronger training signal.',
        ]}
      />

      <ExampleBlock
        title="BM25 vs DPR Retrieval Comparison"
        difficulty="advanced"
        problem="Query: 'What is the capital of France?'. Passage A: 'Paris is the capital and largest city of France.' Passage B: 'The French metropolis serves as the seat of government.' BM25 ranks A higher. DPR ranks B higher for a particular model. Explain why and when each is preferred."
        solution={[
          {
            step: 'BM25 scoring',
            formula: 'BM25(q, d) = \\sum_{t \\in q} \\text{IDF}(t) \\cdot \\frac{TF(t,d) \\cdot (k+1)}{TF(t,d) + k(1 - b + b|d|/avgdl)}',
            explanation:
              'BM25 matches on exact lexical overlap. Passage A contains "capital," "France" — direct matches to query terms. High BM25 score. Passage B uses synonyms ("metropolis," "seat of government") with no direct matches — low BM25 score.',
          },
          {
            step: 'DPR scoring',
            explanation:
              'DPR encodes semantics. The encoder learns that "French metropolis" → France, "seat of government" → capital. If DPR is trained on similar paraphrases, it can match Passage B semantically. DPR rankings depend heavily on training data distribution.',
          },
          {
            step: 'When to use each',
            explanation:
              'BM25 is preferred for precise entity queries (exact name matching, specific codes, numbers). DPR is preferred for semantic/conceptual queries and paraphrase matching. In practice, hybrid retrieval (BM25 + dense, combined via RRF) outperforms either alone on most benchmarks.',
          },
          {
            step: 'Hybrid Reciprocal Rank Fusion',
            formula: '\\text{RRF}(d) = \\sum_{r \\in \\{bm25, dpr\\}} \\frac{1}{k + \\text{rank}_r(d)}',
            explanation:
              'Combine rankings from BM25 and DPR using RRF (k=60 is standard). Robust to score scale differences, does not require score normalization, and consistently outperforms single-method retrieval.',
          },
        ]}
      />

      <WarningBlock title="Domain Shift Severely Degrades DPR Performance">
        <p>
          DPR models trained on Wikipedia-based QA (NQ, TriviaQA) can lose 20-40% Recall@100
          on out-of-domain datasets (e.g., medical, legal, code). Unlike BM25 which is
          completely domain-agnostic, DPR relies on learned semantic mappings that don't
          generalize without fine-tuning. For new domains: (1) Use BGE-M3 or E5-large
          zero-shot dense models trained on diverse data; (2) Fine-tune on small amounts
          of domain-specific data using the DPR objective; (3) Fall back to BM25 for high-stakes
          retrieval until domain-adapted models are available.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="DPR Question and Context Encoding with HuggingFace"
        runnable
      />
    </div>
  );
}
