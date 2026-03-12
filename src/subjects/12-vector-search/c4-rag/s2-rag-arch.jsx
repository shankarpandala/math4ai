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
// RAG Pipeline Flowchart
// ---------------------------------------------------------------------------

const PIPELINE_STEPS = [
  { id: 'query',      label: 'User Query',       sub: '"What causes inflation?"',  color: '#6366f1', icon: '💬' },
  { id: 'encode',     label: 'Query Encoder',    sub: 'SBERT / DPR',               color: '#8b5cf6', icon: '🔢' },
  { id: 'retrieve',   label: 'ANN Retrieval',    sub: 'FAISS / HNSW → top-k docs', color: '#10b981', icon: '🔍' },
  { id: 'rerank',     label: 'Reranker',         sub: 'Cross-encoder → top-n',     color: '#f59e0b', icon: '↕️' },
  { id: 'augment',    label: 'Context Builder',  sub: 'Chunk + format passages',   color: '#ef4444', icon: '📄' },
  { id: 'generate',   label: 'LLM Generation',   sub: 'GPT-4 / Llama → answer',    color: '#0ea5e9', icon: '✨' },
];

function RAGPipeline() {
  const [activeStep, setActiveStep] = useState(null);

  const details = {
    query:    'The user submits a natural language question. Preprocessing may include query expansion or HyDE (generating a hypothetical answer to retrieve from).',
    encode:   'The query is encoded into a dense vector using a bi-encoder (e.g., SBERT all-MiniLM-L6-v2 or DPR). This takes ~5ms on CPU.',
    retrieve: 'The query vector is compared against pre-indexed document embeddings using approximate nearest neighbor search. Returns top-100 candidates in <10ms for 1M docs.',
    rerank:   'A cross-encoder scores each (query, passage) pair jointly. More expensive (100ms–500ms for top-100) but much higher precision. Reduces to top-5 passages.',
    augment:  'Retrieved passages are concatenated into the LLM context. Chunking strategy (size, overlap) significantly impacts quality. Metadata may be prepended.',
    generate: 'The LLM receives the query + retrieved context and generates a grounded answer. Citation extraction maps answer spans back to source documents.',
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        RAG Pipeline — Click to Explore
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        A complete retrieval-augmented generation pipeline. Click each stage for details.
      </p>

      {/* Horizontal flowchart */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {PIPELINE_STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              className={`shrink-0 rounded-xl px-3 py-3 text-center transition-all ${
                activeStep === step.id ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-sm'
              }`}
              style={{
                background: step.color + (activeStep === step.id ? '25' : '12'),
                border: `2px solid ${step.color}${activeStep === step.id ? 'cc' : '40'}`,
                minWidth: 90,
              }}
            >
              <div className="text-xl mb-1">{step.icon}</div>
              <p className="text-xs font-bold" style={{ color: step.color }}>{step.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{step.sub}</p>
            </button>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="mx-1 shrink-0 text-gray-300 dark:text-gray-600 text-xl">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detail panel */}
      {activeStep && (
        <div
          className="mt-4 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 transition-all"
          style={{
            background: PIPELINE_STEPS.find((s) => s.id === activeStep)?.color + '10',
            border: `1px solid ${PIPELINE_STEPS.find((s) => s.id === activeStep)?.color}30`,
          }}
        >
          <p className="font-medium mb-1" style={{ color: PIPELINE_STEPS.find((s) => s.id === activeStep)?.color }}>
            {PIPELINE_STEPS.find((s) => s.id === activeStep)?.label}
          </p>
          <p>{details[activeStep]}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `from sentence_transformers import SentenceTransformer, CrossEncoder
import numpy as np
import faiss

# === OFFLINE: Build document index ===

encoder   = SentenceTransformer('all-MiniLM-L6-v2')
reranker  = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# Corpus (normally 100k+ documents, pre-chunked)
corpus = [
    "Inflation is caused by too much money chasing too few goods.",
    "The Federal Reserve raises interest rates to combat inflation.",
    "Demand-pull inflation occurs when aggregate demand exceeds supply.",
    "Cost-push inflation results from supply shocks like rising oil prices.",
    "Quantitative easing increases the money supply, potentially causing inflation.",
]

# Chunk large docs (simplified: treat each doc as one chunk)
# In production: use RecursiveCharacterTextSplitter(chunk_size=512, overlap=64)

doc_embeddings = encoder.encode(corpus, normalize_embeddings=True)
doc_embeddings = doc_embeddings.astype(np.float32)

# Build FAISS index (cosine = inner product for normalized vectors)
d = doc_embeddings.shape[1]
index = faiss.IndexFlatIP(d)
index.add(doc_embeddings)
print(f"Index built: {index.ntotal} documents")

# === ONLINE: Query pipeline ===

def rag_retrieve(query, k_retrieve=10, k_rerank=3):
    # 1. Encode query
    q_emb = encoder.encode([query], normalize_embeddings=True).astype(np.float32)

    # 2. ANN retrieval (bi-encoder)
    scores, indices = index.search(q_emb, k=k_retrieve)
    candidates = [corpus[i] for i in indices[0]]

    # 3. Reranking (cross-encoder)
    pairs  = [[query, doc] for doc in candidates]
    rerank_scores = reranker.predict(pairs)
    ranked = sorted(zip(rerank_scores, candidates), reverse=True)

    return [(s, d) for s, d in ranked[:k_rerank]]

# Run pipeline
query = "What causes inflation?"
results = rag_retrieve(query)
print("\\nTop passages after reranking:")
for score, passage in results:
    print(f"  [{score:.3f}] {passage}")

# 4. Build context and generate answer
context = "\\n\\n".join(p for _, p in results)
prompt  = f"Context:\\n{context}\\n\\nQuestion: {query}\\nAnswer:"
print("\\nPrompt (first 200 chars):", prompt[:200])
# Pass prompt to LLM (openai.ChatCompletion, llama.cpp, etc.)
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function RAGArch() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          RAG Architecture
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Retrieval-Augmented Generation — grounding LLM outputs in factual, up-to-date
          knowledge through efficient dense retrieval pipelines.
        </p>
      </div>

      <RAGPipeline />

      <DefinitionBlock
        label="Definition 4.1"
        title="Retrieval-Augmented Generation (RAG)"
        definition="RAG (Lewis et al., 2020) augments a language model generator $p_\theta(y|x)$ with a non-parametric memory: a retrieval function $R(x) = \{d_1, \ldots, d_k\}$ returning the $k$ most relevant documents from corpus $\mathcal{D}$. The joint distribution over output $y$ given input $x$ is: $p(y|x) = \sum_{d \in \mathcal{D}} p_\eta(d|x) \cdot p_\theta(y|x, d)$, marginalized over retrieved documents. In practice, only the top-$k$ documents are used, and the sum is approximated."
        notation="Two RAG variants: RAG-Sequence marginalizes over documents per full output sequence; RAG-Token marginalizes per generated token (more flexible, higher quality, slower). Modern implementations typically use RAG-Sequence with the top-5 passages concatenated into the LLM context."
      />

      <DefinitionBlock
        label="Definition 4.2"
        title="Chunking Strategies"
        definition="Document chunking partitions long documents into passage-sized chunks for dense retrieval. A chunk $c_i$ has length $L$ tokens with overlap $O$ tokens between consecutive chunks. Fixed-size chunking: $c_i = \text{doc}[i \cdot (L-O) : i \cdot (L-O) + L]$. Semantic chunking splits at sentence or paragraph boundaries to preserve coherent units. The chunk size $L$ creates a recall-precision trade-off: small chunks ($L=128$) have precise retrieval but lose context; large chunks ($L=1024$) retain context but dilute relevance signals."
        notation="Typical production settings: $L \in \{256, 512, 1024\}$ tokens with overlap $O = L/8$. Hierarchical indexing stores both sentence-level and paragraph-level embeddings, retrieving sentences but returning surrounding paragraphs to the LLM — the 'small-to-big' strategy."
      />

      <TheoremBlock
        label="Theorem 4.1"
        title="Retrieve-then-Generate vs Generate-then-Retrieve"
        statement="Standard RAG retrieves once before generation (retrieve-then-generate). For multi-hop questions requiring iterative reasoning, iterative retrieval significantly outperforms single-step retrieval. Given a query $q$ and intermediate reasoning steps $r_1, r_2, \ldots$, iterative RAG performs: $d_t = R(q, r_{<t})$, $r_t = \text{LLM}(q, d_t, r_{<t})$ — re-querying with updated context at each step. The probability of retrieving all necessary facts in $T$ steps is $1 - (1 - p)^T$ vs $p$ for single retrieval."
        proof="For a multi-hop question requiring facts $f_1$ and $f_2$ where $f_2$ depends on $f_1$: single retrieval finds $f_1$ with probability $p_1$ but cannot find $f_2$ since the retrieval query does not mention the entity from $f_1$. Iterative retrieval: first retrieve $f_1$, then formulate a follow-up query mentioning the entity to retrieve $f_2$. The probability of success is $p_1 \cdot p_2 > p_{combined}$ where $p_{combined}$ is the probability of retrieving both simultaneously. $\square$"
        corollaries={[
          'Self-RAG (Asai et al., 2023) trains the LLM to decide when to retrieve (special RETRIEVE token) vs generate directly, avoiding unnecessary retrieval for simple queries.',
          'FLARE (Forward-Looking Active REtrieval) triggers retrieval when the LLM generates low-confidence tokens, fetching passages to condition the next generation.',
        ]}
      />

      <ExampleBlock
        title="Optimizing Chunking for a Legal Document QA System"
        difficulty="advanced"
        problem="A legal document QA system indexes 50,000 legal cases (avg 10,000 tokens each). Users ask questions like 'What was the court's ruling on damages in Smith v. Jones?' Design the chunking and retrieval strategy."
        solution={[
          {
            step: 'Hierarchical document segmentation',
            explanation:
              'Split each case into logical sections: header (parties, court, date), facts section, legal analysis, ruling, disposition. Encode each section separately. This preserves semantic coherence — the ruling section is always complete, not mid-paragraph.',
          },
          {
            step: 'Dual-granularity indexing',
            explanation:
              'Build two indexes: (1) sentence-level embeddings for precise retrieval of specific holdings; (2) paragraph-level embeddings for broader context. At query time, retrieve at sentence level for high-precision answers, expand to paragraph level for LLM context.',
          },
          {
            step: 'Metadata-augmented retrieval',
            explanation:
              'Prepend structured metadata to each chunk: court name, year, jurisdiction, case category. Filter by metadata before dense retrieval to reduce search space. E.g., filter to federal cases from 2010-2024 before embedding comparison.',
          },
          {
            step: 'Context window management',
            explanation:
              'With 10 retrieved passages × 512 tokens each = 5,120 tokens. Add query (100 tokens) + instruction (200 tokens) = 5,420 tokens — fits in GPT-4-32k. For longer contexts, use LostInTheMiddle-aware ordering: place most relevant passages at the beginning and end of the context.',
          },
        ]}
      />

      <WarningBlock title="Hallucination Persists Even with RAG">
        <p>
          RAG reduces but does not eliminate LLM hallucinations. Common failure modes:
          (1) <strong>Retrieval failure</strong> — the correct passage is not retrieved
          (recall@k &lt; 1), so the LLM generates from parametric knowledge, which may be wrong
          or outdated; (2) <strong>Context ignorance</strong> — the LLM generates information
          contradicting the retrieved context (especially with long contexts); (3){' '}
          <strong>Conflation</strong> — the LLM merges information from multiple retrieved
          passages incorrectly. Mitigations: citation extraction + verification, faithfulness
          scoring (NLI between answer and context), and grounding prompts instructing the LLM
          to only use the provided context.
        </p>
      </WarningBlock>

      <DefinitionBlock
        label="Definition 4.3"
        title="HyDE: Hypothetical Document Embeddings"
        definition="HyDE (Gao et al., 2022) improves retrieval by having the LLM generate a hypothetical answer document $\hat{d} = \text{LLM}(q)$ before retrieval, then encoding $\hat{d}$ instead of (or in addition to) $q$ as the retrieval query. The intuition: a hypothetical answer is in the same semantic space as actual answers, providing a better retrieval query than the question itself. The retrieved passages then ground the final generation."
        notation="HyDE is most effective when queries are short and abstract ('explain X') and documents are detailed and specific. It is less effective when queries already contain enough context for good retrieval, and adds LLM latency before retrieval. Multi-vector HyDE generates multiple hypothetical documents and averages their embeddings."
      />

      <PythonCode
        code={CODE}
        language="python"
        title="Complete RAG Pipeline: Retrieval, Reranking, and Context Building"
        runnable
      />
    </div>
  );
}
