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
// Cosine Similarity Calculator for 3 Sentence Vectors (2D projection)
// ---------------------------------------------------------------------------

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function norm(a) {
  return Math.sqrt(a.reduce((s, v) => s + v * v, 0));
}

function cosineSim(a, b) {
  const n = norm(a) * norm(b);
  return n === 0 ? 0 : dot(a, b) / n;
}

const PRESETS = [
  {
    label: 'Semantic similarity',
    vecs: [
      [0.9, 0.4],
      [0.85, 0.5],
      [0.1, 0.95],
    ],
    names: ['Dogs are loyal pets', 'Cats make great companions', 'The stock fell today'],
  },
  {
    label: 'Near-duplicate',
    vecs: [
      [0.7, 0.7],
      [0.72, 0.69],
      [-0.6, 0.8],
    ],
    names: ['I love pizza', 'Pizza is my favorite food', 'The bridge was repaired'],
  },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];
const SVG_W = 220;
const SVG_H = 220;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const R = 85;

function CosineSimilarityThreeWay() {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];
  const vecs = preset.vecs;
  const names = preset.names;

  // Normalize each vec for display
  const pts = vecs.map(([x, y]) => {
    const n = Math.sqrt(x * x + y * y);
    return { x: (x / n) * R, y: -(y / n) * R };
  });

  const sims = [
    cosineSim(vecs[0], vecs[1]),
    cosineSim(vecs[0], vecs[2]),
    cosineSim(vecs[1], vecs[2]),
  ];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Sentence Embedding Cosine Similarity
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each arrow represents a sentence's embedding vector projected to 2D. Cosine similarity
        measures directional alignment — semantically similar sentences point in similar directions.
      </p>

      <div className="mb-4 flex gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => setPresetIdx(i)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              i === presetIdx
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <svg width={SVG_W} height={SVG_H} className="shrink-0">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
          <line x1={CX} y1={CY - R - 8} x2={CX} y2={CY + R + 8} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
          <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
          {pts.map((p, i) => (
            <g key={i}>
              <line
                x1={CX} y1={CY}
                x2={CX + p.x} y2={CY + p.y}
                stroke={COLORS[i]} strokeWidth={2.5} strokeLinecap="round"
              />
              <polygon
                points="0,-5 4,5 -4,5"
                fill={COLORS[i]}
                transform={`translate(${CX + p.x},${CY + p.y}) rotate(${Math.atan2(p.x, -p.y) * 180 / Math.PI})`}
              />
              <text
                x={CX + p.x * 1.18}
                y={CY + p.y * 1.18}
                textAnchor="middle"
                fontSize={10}
                fontWeight="700"
                fill={COLORS[i]}
              >
                S{i + 1}
              </text>
            </g>
          ))}
          <circle cx={CX} cy={CY} r={3} fill="#374151" />
        </svg>

        <div className="flex-1 space-y-3">
          {names.map((name, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>S{i + 1}:</strong> "{name}"
              </span>
            </div>
          ))}
          <div className="mt-4 grid grid-cols-1 gap-2">
            {[
              { label: 'sim(S1, S2)', val: sims[0] },
              { label: 'sim(S1, S3)', val: sims[1] },
              { label: 'sim(S2, S3)', val: sims[2] },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50"
              >
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{label}</span>
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: val > 0.7 ? '#22c55e' : val > 0.2 ? '#f59e0b' : '#ef4444' }}
                >
                  {val.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `from sentence_transformers import SentenceTransformer
import numpy as np

# Load Sentence-BERT model
model = SentenceTransformer('all-MiniLM-L6-v2')

sentences = [
    "Dogs are loyal pets",
    "Cats make great companions",
    "The stock market fell today",
]

# Encode sentences -> fixed-size embeddings
embeddings = model.encode(sentences, normalize_embeddings=True)
print(f"Embedding shape: {embeddings.shape}")  # (3, 384)

# Cosine similarity (embeddings are L2-normalized, so dot product = cosine sim)
sim_matrix = embeddings @ embeddings.T
print("\\nCosine similarity matrix:")
for i, s1 in enumerate(sentences):
    for j, s2 in enumerate(sentences):
        if i < j:
            print(f"  sim('{s1[:20]}...', '{s2[:20]}...') = {sim_matrix[i,j]:.4f}")

# Mean pooling from raw BERT (manual implementation)
import torch
from transformers import AutoTokenizer, AutoModel

tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
bert = AutoModel.from_pretrained('bert-base-uncased')

def mean_pool(token_embeddings, attention_mask):
    mask = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return (token_embeddings * mask).sum(1) / mask.sum(1).clamp(min=1e-9)

encoded = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
with torch.no_grad():
    out = bert(**encoded)
pooled = mean_pool(out.last_hidden_state, encoded['attention_mask'])
pooled = torch.nn.functional.normalize(pooled, dim=-1)
print("\\nManual mean-pool embeddings shape:", pooled.shape)
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function SentenceEmbeddings() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Sentence Embeddings
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Encoding variable-length sentences as fixed-dimensional vectors that capture semantic
          meaning — the foundation of semantic search and retrieval systems.
        </p>
      </div>

      <CosineSimilarityThreeWay />

      <DefinitionBlock
        label="Definition 2.1"
        title="Sentence Embedding"
        definition="A sentence embedding is a function $f: \mathcal{S} \to \mathbb{R}^d$ mapping an arbitrary-length sentence $s \in \mathcal{S}$ to a fixed-dimensional vector $f(s) \in \mathbb{R}^d$. The ideal embedding satisfies: $\text{sim}(f(s_1), f(s_2)) \approx \text{semantic\_similarity}(s_1, s_2)$, where similarity is typically cosine similarity. The embedding dimension $d$ is commonly 384, 768, or 1024."
        notation="The pooling function $\text{pool}: \mathbb{R}^{L \times d} \to \mathbb{R}^d$ collapses a sequence of $L$ token representations into a single vector. Mean pooling averages all token embeddings; CLS pooling uses the first token's representation."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Sentence-BERT (SBERT)"
        definition="Sentence-BERT fine-tunes a BERT encoder using a siamese/triplet network structure on natural language inference (NLI) and semantic textual similarity (STS) datasets. Given two sentences $s_1, s_2$, their embeddings $u = \text{pool}(\text{BERT}(s_1))$ and $v = \text{pool}(\text{BERT}(s_2))$ are compared via: $\text{logits} = W^\top [u; v; |u - v|]$ for classification, or cosine similarity for regression. After fine-tuning, each sentence can be encoded independently in $O(1)$ BERT forward passes."
        notation="The key efficiency gain: cross-encoder BERT requires $O(n^2)$ forward passes to compare $n$ sentences. SBERT reduces this to $O(n)$ encodings plus $O(n^2)$ dot products — enabling large-scale semantic search."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="SimCSE Contrastive Training Objective"
        statement="SimCSE (Simple Contrastive Sentence Embeddings) trains sentence encoders using an InfoNCE-style objective. For a batch of $N$ sentences, each sentence $x_i$ is passed twice through the encoder with different dropout masks, yielding embeddings $h_i^+$ and $h_i^-$ as its own positive pair. The loss is: $\mathcal{L}_i = -\log \frac{e^{\text{sim}(h_i, h_i^+)/\tau}}{\sum_{j=1}^{N} e^{\text{sim}(h_i, h_j^+)/\tau}}$, where $\tau$ is a temperature hyperparameter and the denominator sums over all $N$ in-batch negatives. This pushes each sentence toward its augmented self and away from all other sentences in the batch."
        proof="The loss is minimized when $\text{sim}(h_i, h_i^+) \gg \text{sim}(h_i, h_j^+)$ for all $j \neq i$. The gradient $\nabla \mathcal{L}_i$ w.r.t. $h_i$ pushes $h_i$ toward $h_i^+$ and away from all $h_j^+$. The temperature $\tau$ controls the sharpness: small $\tau$ creates hard contrasts (steeper gradients) but can cause training instability; large $\tau$ smooths the distribution. Optimal $\tau \approx 0.05$ is found empirically. SimCSE unsupervised outperforms many supervised methods because dropout acts as minimal yet sufficient augmentation for language — preserving semantic content while providing representation diversity. $\square$"
        corollaries={[
          'Dropout masks serve as data augmentation: the same sentence encoded twice with different dropout produces a natural positive pair without requiring labeled data.',
          'Hard negatives (semantically similar but non-matching sentences) are crucial for performance and are provided by the NLI contradiction pairs in supervised SimCSE.',
        ]}
      />

      <ExampleBlock
        title="Pooling Strategies: CLS vs Mean vs Max"
        difficulty="intermediate"
        problem="Given BERT output token embeddings $H \in \mathbb{R}^{L \times 768}$ for a sentence with $L$ tokens (including [CLS] and [SEP]), compute three pooling strategies and discuss which performs best for semantic similarity tasks."
        solution={[
          {
            step: 'CLS token pooling',
            formula: 'h_{CLS} = H[0] \in \mathbb{R}^{768}',
            explanation:
              'Use the [CLS] token representation directly. Works well when fine-tuned for sentence-level tasks, but raw BERT CLS pooling performs poorly for semantic similarity (its pre-training objective is MLM, not sentence encoding).',
          },
          {
            step: 'Mean pooling over all tokens',
            formula: 'h_{mean} = \\frac{1}{L} \\sum_{t=1}^{L} H[t]',
            explanation:
              'Average all token embeddings (often masking padding tokens). This is the standard in SBERT and SimCSE. Empirically outperforms CLS pooling for semantic search.',
          },
          {
            step: 'Masked mean pooling (correct for variable-length sentences)',
            formula: 'h_{mean} = \\frac{\\sum_{t=1}^{L} m_t \\cdot H[t]}{\\sum_{t=1}^{L} m_t}',
            explanation:
              'Where $m_t \in \{0,1\}$ is the attention mask excluding padding. This is the recommended implementation to avoid polluting the average with zero-padded positions.',
          },
          {
            step: 'Compare on STS-B benchmark',
            explanation:
              "SBERT mean-pool achieves Spearman correlation ~0.869 on STS-B, vs ~0.203 for raw BERT CLS pooling — a massive improvement. Mean pooling wins because it aggregates information from all tokens, while CLS only encodes what BERT's pre-training task found useful at position 0.",
          },
        ]}
      />

      <WarningBlock title="Anisotropy Problem in Sentence Embeddings">
        <p>
          Pre-trained language model embeddings suffer from <strong>anisotropy</strong>: the
          embedding space is highly non-uniform, with most vectors concentrated in a narrow cone.
          This causes cosine similarity to be uniformly high for unrelated sentences. The{' '}
          <em>effective rank</em> of the embedding matrix is much lower than the nominal
          dimension $d$. SimCSE and SBERT's contrastive fine-tuning explicitly address this by
          spreading embeddings more uniformly over the hypersphere — a property called{' '}
          <strong>alignment and uniformity</strong>. Always fine-tune or use post-hoc whitening
          before using raw BERT embeddings for retrieval.
        </p>
      </WarningBlock>

      <DefinitionBlock
        label="Definition 2.3"
        title="Alignment and Uniformity"
        definition="Two complementary properties quantify embedding quality for retrieval. Alignment measures how close positive pairs are: $\mathcal{L}_{align} = \mathbb{E}_{(x,x^+) \sim p_{pos}} \|f(x) - f(x^+)\|^2$. Uniformity measures how evenly embeddings spread over the unit hypersphere: $\mathcal{L}_{uniform} = \log \mathbb{E}_{x,y \sim p_{data}} e^{-2\|f(x)-f(y)\|^2}$. Good sentence encoders minimize both: similar sentences cluster together while the overall distribution is spread uniformly."
        notation="On the unit sphere, uniformity is equivalent to maximizing the minimum pairwise angle between embeddings. High uniformity avoids the anisotropy collapse where all vectors point in nearly the same direction, making cosine similarity uninformative."
      />

      <PythonCode
        code={CODE}
        language="python"
        title="Sentence-BERT Encoding and Manual Mean Pooling"
        runnable
      />
    </div>
  );
}
