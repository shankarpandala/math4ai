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
// MIPS: Dot Product Scoring Visualizer
// ---------------------------------------------------------------------------

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function DotProductVisualizer() {
  // Query and 4 document vectors (2D for visualization)
  const [query, setQuery] = useState([0.8, 0.6]);
  const [docs, setDocs] = useState([
    [0.7, 0.7],
    [0.3, 0.9],
    [-0.5, 0.8],
    [0.9, -0.3],
  ]);

  const docLabels = ['Doc A', 'Doc B', 'Doc C', 'Doc D'];

  // Compute dot products (using raw, not normalized)
  const scores = docs.map((d) => d[0] * query[0] + d[1] * query[1]);
  const ranked = scores
    .map((s, i) => ({ i, s, label: docLabels[i] }))
    .sort((a, b) => b.s - a.s);

  const W = 220, H = 220, CX = W / 2, CY = H / 2, R = 80;

  function normVis(v) {
    const n = Math.sqrt(v[0] ** 2 + v[1] ** 2);
    return n === 0 ? [0, 0] : [v[0] / n, v[1] / n];
  }

  const qn = normVis(query);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        MIPS: Dot Product Scoring
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Maximum Inner Product Search finds the document with the highest dot product to the query.
        Larger magnitude AND aligned direction both increase the score.
      </p>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* SVG */}
        <svg width={W} height={H} className="shrink-0 mx-auto">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
          <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
          <line x1={CX} y1={CY - R - 8} x2={CX} y2={CY + R + 8} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />

          {/* Doc vectors */}
          {docs.map((d, i) => {
            const dn = normVis(d);
            const ex = CX + dn[0] * R * 0.9;
            const ey = CY - dn[1] * R * 0.9;
            return (
              <g key={i}>
                <line x1={CX} y1={CY} x2={ex} y2={ey}
                  stroke={COLORS[i]} strokeWidth={2} strokeLinecap="round" />
                <circle cx={ex} cy={ey} r={5} fill={COLORS[i]} />
                <text x={ex * 1.0 + (dn[0] > 0 ? 10 : -10)} y={ey + (dn[1] < 0 ? 14 : -6)}
                  fontSize={10} fontWeight="700" fill={COLORS[i]} textAnchor="middle">
                  {docLabels[i]}
                </text>
              </g>
            );
          })}

          {/* Query vector */}
          <line x1={CX} y1={CY} x2={CX + qn[0] * R} y2={CY - qn[1] * R}
            stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
          <polygon
            points="0,-6 5,6 -5,6"
            fill="#1e293b"
            transform={`translate(${CX + qn[0] * R},${CY - qn[1] * R}) rotate(${Math.atan2(qn[0], qn[1]) * 180 / Math.PI})`}
          />
          <text x={CX + qn[0] * R * 1.18} y={CY - qn[1] * R * 1.18}
            fontSize={11} fontWeight="800" fill="#1e293b" className="dark:fill-gray-100" textAnchor="middle">
            Q
          </text>

          <circle cx={CX} cy={CY} r={3} fill="#374151" />
        </svg>

        {/* Scores */}
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Ranked by dot product score
          </p>
          {ranked.map(({ i, s, label }, rank) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background: COLORS[i] + '18', border: `1px solid ${COLORS[i]}40` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">#{rank + 1}</span>
                <span className="text-sm font-semibold" style={{ color: COLORS[i] }}>{label}</span>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: COLORS[i] }}>
                {s.toFixed(4)}
              </span>
            </div>
          ))}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Query = [{query.map(v => v.toFixed(2)).join(', ')}]
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import numpy as np

# --- Brute-force MIPS ---
query = np.array([0.8, 0.6, 0.3, -0.1])
docs  = np.random.randn(10000, 4)  # 10k document vectors

# Unnormalized dot product (MIPS)
scores = docs @ query  # shape (10000,)
top_k  = np.argsort(scores)[::-1][:5]
print("Top-5 MIPS indices:", top_k)
print("Top-5 scores:", scores[top_k].round(4))

# --- Reduce MIPS to ANNS (Shrivastava & Li 2014) ---
# Augment vectors to convert inner product to L2
def augment_mips(x, m=4):
    """Augment x in R^d -> R^(d+m) so that ANNS = MIPS."""
    norms = np.linalg.norm(x, axis=-1, keepdims=True)
    phi = np.hstack([x, np.zeros((len(x), m))])
    # Additional components for query: sqrt(1 - ||x||^2)
    return phi, norms

docs_aug, _ = augment_mips(docs / np.linalg.norm(docs, axis=1, keepdims=True))

# --- Score function comparison ---
q_norm = query / np.linalg.norm(query)
docs_norm = docs / np.linalg.norm(docs, axis=1, keepdims=True)

# Raw dot product
raw_scores   = docs @ query
# Cosine similarity
cos_scores   = docs_norm @ q_norm
# Rescaled: cosine * ||doc|| * ||query||
rescaled     = cos_scores * np.linalg.norm(docs, axis=1) * np.linalg.norm(query)

print("\\nRaw vs rescaled dot product (should be equal):")
print(np.allclose(raw_scores, rescaled))
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function InnerProductSpaces() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Inner Product Spaces for Search
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Maximum Inner Product Search (MIPS) and the mathematical structure of dot-product
          retrieval — when magnitude matters as much as direction.
        </p>
      </div>

      <DotProductVisualizer />

      <DefinitionBlock
        label="Definition 2.1"
        title="Maximum Inner Product Search (MIPS)"
        definition="Given a query vector $q \in \mathbb{R}^d$ and a database $\mathcal{D} = \{x_1, \ldots, x_n\} \subset \mathbb{R}^d$, MIPS finds the item maximizing the inner product: $x^* = \arg\max_{x \in \mathcal{D}} \langle q, x \rangle = \arg\max_{x \in \mathcal{D}} q^\top x$. Unlike nearest-neighbor search under L2 or cosine distance, MIPS is sensitive to both the direction and magnitude of vectors — a document with a large norm can score highly even if it is not directionally aligned with the query."
        notation="MIPS arises naturally in: recommendation systems (user-item score = $u^\top v_i$), language model scoring (logit $= W_\text{out}^\top h$), dense retrieval ($\text{score}(q, d) = f_q(q)^\top f_d(d)$). MIPS is harder than NNS: the inner product is not a metric (it violates the triangle inequality), preventing direct use of ball-tree or KD-tree structures."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Score Functions in Dense Retrieval"
        definition="A score function $s: \mathcal{Q} \times \mathcal{D} \to \mathbb{R}$ assigns a relevance score to a query-document pair. Common forms: (1) Dot product: $s(q,d) = f_q(q)^\top f_d(d)$; (2) Cosine: $s(q,d) = \frac{f_q(q)^\top f_d(d)}{\|f_q(q)\|\|f_d(d)\|}$; (3) L2 score: $s(q,d) = -\|f_q(q) - f_d(d)\|_2^2$. For L2-normalized encoders, dot product and cosine are equivalent. Models like DPR use dot product; many bi-encoders normalize and use cosine."
        notation="Cross-encoder score functions $s(q,d) = g_\theta([q; d])$ process the concatenation and yield higher accuracy but require $O(n)$ forward passes for $n$ documents — incompatible with large-scale retrieval. Bi-encoders factorize as $f_q(q)^\top f_d(d)$, enabling offline document encoding and $O(1)$ retrieval via MIPS."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Reduction of MIPS to Approximate Nearest Neighbor Search"
        statement="MIPS can be reduced to an approximate nearest neighbor search (ANNS) problem by augmenting vectors. Given $x \in \mathbb{R}^d$ with $\|x\| \leq 1$, define the augmented vector $\tilde{x} = [x; \sqrt{1-\|x\|^2}; 0; \ldots; 0] \in \mathbb{R}^{d+m}$ and query $\tilde{q} = [q; 0; \sqrt{1-\|q\|^2}; \ldots] \in \mathbb{R}^{d+m}$ such that $\|\tilde{x}\| = \|\tilde{q}\| = 1$. Then $\langle q, x \rangle = \langle \tilde{q}, \tilde{x} \rangle$ and the inner product equals the cosine similarity of augmented unit vectors."
        proof="Expand: $\|\tilde{q} - \tilde{x}\|^2 = \|\tilde{q}\|^2 + \|\tilde{x}\|^2 - 2\langle\tilde{q},\tilde{x}\rangle = 2 - 2\langle q, x\rangle$ (since augmented norms are 1 and the extra components are orthogonal). So minimizing $\|\tilde{q}-\tilde{x}\|$ maximizes $\langle q,x\rangle$. This reduction allows using any ANNS data structure (HNSW, IVF) for MIPS by simply augmenting vectors at index time. The cost is a modest increase in dimensionality from $d$ to $d+m$. $\square$"
        corollaries={[
          'FAISS supports IndexFlatIP (exact MIPS) and IVFFlat with inner product metric directly without augmentation.',
          'For recommendation systems with unbounded item norms, proper normalization or ScaNN (learned quantization for MIPS) gives better results than the augmentation trick.',
        ]}
      />

      <ExampleBlock
        title="Bi-Encoder Dot Product vs Cross-Encoder Scoring"
        difficulty="intermediate"
        problem="A dense retrieval system uses a bi-encoder with dot product scoring. Query: 'What causes inflation?' with embedding $q \in \mathbb{R}^{768}$. We have 3 candidate passages with embeddings $d_1, d_2, d_3 \in \mathbb{R}^{768}$ and scores 8.2, 7.9, 12.1. Explain why the passage with score 12.1 might not actually be the most relevant."
        solution={[
          {
            step: 'Dot product decomposes into magnitude and angle',
            formula: 'q^\\top d = \\|q\\| \\cdot \\|d\\| \\cdot \\cos\\theta',
            explanation:
              'The dot product depends on both the directional alignment ($\\cos\\theta$) and vector magnitudes. A document with large $\\|d\\|$ can dominate the ranking even if it is not directionally aligned with the query.',
          },
          {
            step: 'Check if $d_3$ has anomalously large norm',
            explanation:
              'If $\\|d_3\\| = 15$ while $\\|d_1\\| = \\|d_2\\| = 5$, then even with lower cosine similarity, $d_3$ scores highest. This is a magnitude bias problem in MIPS.',
          },
          {
            step: 'Mitigation: L2 normalization',
            formula: '\\hat{d} = d / \\|d\\|,\\quad s(q,d) = \\hat{q}^\\top \\hat{d} = \\cos\\theta',
            explanation:
              'Normalizing all vectors to the unit sphere removes magnitude bias, making the score purely directional. Most modern bi-encoders (SBERT, SimCSE) L2-normalize embeddings before dot product computation.',
          },
          {
            step: 'Reranking with cross-encoder',
            explanation:
              'For high-stakes retrieval, use a bi-encoder to retrieve top-100 candidates (fast, approximate), then rerank with a cross-encoder that processes the query-document pair jointly for precise relevance scoring.',
          },
        ]}
      />

      <WarningBlock title="MIPS is Not a Metric Search Problem">
        <p>
          Inner product maximization does <strong>not</strong> satisfy the metric axioms: it is
          not symmetric ($q^\top d \neq d^\top q$ in general for non-square encoders), and there
          is no notion of "distance" since inner products can be negative. This means standard
          metric-based indexing structures (ball trees, KD-trees) are inapplicable without
          modification. FAISS handles MIPS via IndexFlatIP (brute force) or by using cosine
          similarity on L2-normalized vectors. ScaNN (Google) and DiskANN support asymmetric
          distance functions designed specifically for MIPS.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="MIPS with NumPy and MIPS-to-ANNS Reduction"
        runnable
      />
    </div>
  );
}
