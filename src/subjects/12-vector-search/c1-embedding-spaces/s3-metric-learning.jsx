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
// Triplet Loss Margin Visualizer
// ---------------------------------------------------------------------------

function TripletLossVisualizer() {
  const [dPos, setDPos] = useState(0.4);
  const [dNeg, setDNeg] = useState(0.9);
  const [margin, setMargin] = useState(0.3);

  const loss = Math.max(0, dPos - dNeg + margin);
  const satisfied = loss === 0;

  // SVG number line
  const W = 340;
  const H = 80;
  const lineY = 45;
  const px = (v) => 20 + v * (W - 40);

  const anchorX = px(0);
  const posX = px(dPos);
  const negX = px(Math.min(dNeg, 1));
  const marginEdgeX = px(Math.min(dPos + margin, 1));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Triplet Loss Margin Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The triplet loss pushes the anchor–positive distance closer and the anchor–negative
        distance farther, with a margin <InlineMath math="\alpha" />. Loss ={' '}
        <InlineMath math="\max(0,\, d(a,p) - d(a,n) + \alpha)" />.
      </p>

      <svg width={W} height={H} className="mx-auto block mb-4">
        {/* Number line */}
        <line x1={20} y1={lineY} x2={W - 20} y2={lineY} stroke="#d1d5db" strokeWidth={2} />

        {/* Margin zone (shaded) */}
        <rect
          x={posX}
          y={lineY - 12}
          width={Math.max(0, marginEdgeX - posX)}
          height={24}
          fill="#fef08a"
          opacity={0.6}
        />

        {/* Positive distance bar */}
        <line x1={anchorX} y1={lineY} x2={posX} y2={lineY} stroke="#6366f1" strokeWidth={4} />

        {/* Negative distance bar */}
        <line
          x1={anchorX}
          y1={lineY}
          x2={Math.min(negX, W - 20)}
          y2={lineY}
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 3"
        />

        {/* Anchor */}
        <circle cx={anchorX} cy={lineY} r={7} fill="#374151" />
        <text x={anchorX} y={lineY - 18} textAnchor="middle" fontSize={11} fontWeight="700" fill="#374151">A</text>

        {/* Positive */}
        <circle cx={posX} cy={lineY} r={7} fill="#6366f1" />
        <text x={posX} y={lineY - 18} textAnchor="middle" fontSize={11} fontWeight="700" fill="#6366f1">P</text>

        {/* Negative */}
        {negX <= W - 20 && (
          <>
            <circle cx={negX} cy={lineY} r={7} fill="#10b981" />
            <text x={negX} y={lineY - 18} textAnchor="middle" fontSize={11} fontWeight="700" fill="#10b981">N</text>
          </>
        )}

        {/* Margin indicator */}
        {marginEdgeX <= W - 20 && (
          <line x1={marginEdgeX} y1={lineY - 14} x2={marginEdgeX} y2={lineY + 14}
            stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 2" />
        )}

        {/* Labels */}
        <text x={(anchorX + posX) / 2} y={lineY + 22} textAnchor="middle" fontSize={10} fill="#6366f1">
          d(a,p)={dPos.toFixed(2)}
        </text>
      </svg>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'd(a,p) — positive distance', val: dPos, set: setDPos, color: 'indigo' },
          { label: 'd(a,n) — negative distance', val: dNeg, set: setDNeg, color: 'emerald' },
          { label: 'α — margin', val: margin, set: setMargin, color: 'amber' },
        ].map(({ label, val, set, color }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between">
              <label className={`text-xs font-medium text-${color}-700 dark:text-${color}-300`}>{label}</label>
              <span className={`font-mono text-xs font-bold text-${color}-600`}>{val.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0.01} max={0.99} step={0.01} value={val}
              onChange={(e) => set(Number(e.target.value))}
              className={`h-2 w-full cursor-pointer accent-${color}-500`}
            />
          </div>
        ))}
      </div>

      <div
        className={`rounded-xl px-4 py-3 text-center ${
          satisfied
            ? 'bg-green-50 border border-green-300 dark:bg-green-950/30 dark:border-green-700'
            : 'bg-red-50 border border-red-300 dark:bg-red-950/30 dark:border-red-700'
        }`}
      >
        <p className={`text-xs font-semibold uppercase tracking-wider ${satisfied ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
          Triplet Loss
        </p>
        <p className={`mt-1 font-mono text-2xl font-extrabold ${satisfied ? 'text-green-600' : 'text-red-600'}`}>
          {loss.toFixed(4)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {satisfied
            ? 'Constraint satisfied — negative is far enough beyond margin'
            : `Violation: need d(a,n) ≥ d(a,p) + α = ${(dPos + margin).toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# --- Contrastive Loss (Siamese networks) ---
def contrastive_loss(emb1, emb2, label, margin=1.0):
    """
    label=1 for similar pairs, label=0 for dissimilar.
    Pulls similar pairs together, pushes dissimilar pairs apart.
    """
    dist = F.pairwise_distance(emb1, emb2)
    loss = label * dist.pow(2) + (1 - label) * F.relu(margin - dist).pow(2)
    return loss.mean()

# --- Triplet Loss ---
triplet_loss = nn.TripletMarginLoss(margin=0.3, p=2)

# Example batch
B, D = 16, 128
anchor   = F.normalize(torch.randn(B, D), dim=-1)
positive = F.normalize(anchor + 0.1 * torch.randn(B, D), dim=-1)
negative = F.normalize(torch.randn(B, D), dim=-1)

loss = triplet_loss(anchor, positive, negative)
print(f"Triplet loss: {loss.item():.4f}")

# --- InfoNCE Loss (used in SimCSE, CLIP, DPR) ---
def infonce_loss(query, keys, temperature=0.07):
    """
    query: (B, D), keys: (B, D) — positive pairs are (query[i], keys[i])
    All other (query[i], keys[j]) for j!=i are negatives.
    """
    query  = F.normalize(query,  dim=-1)
    keys   = F.normalize(keys,   dim=-1)
    logits = (query @ keys.T) / temperature  # (B, B)
    labels = torch.arange(len(query), device=query.device)
    return F.cross_entropy(logits, labels)

q = torch.randn(32, 128)
k = q + 0.05 * torch.randn(32, 128)
print(f"InfoNCE loss: {infonce_loss(q, k):.4f}")

# --- N-Pairs Loss ---
def npairs_loss(anchor, positive, temperature=0.1):
    a = F.normalize(anchor,   dim=-1)
    p = F.normalize(positive, dim=-1)
    # Similarities of each anchor to all positives
    sim = (a @ p.T) / temperature
    labels = torch.arange(len(a), device=a.device)
    return F.cross_entropy(sim, labels)
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function MetricLearning() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Metric Learning
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Learning embedding spaces where geometric distance reflects semantic similarity —
          the mathematical foundation of contrastive representation learning.
        </p>
      </div>

      <TripletLossVisualizer />

      <DefinitionBlock
        label="Definition 3.1"
        title="Metric Learning"
        definition="Metric learning trains an encoder $f_\theta: \mathcal{X} \to \mathbb{R}^d$ such that the induced distance $d(x_1, x_2) = \|f_\theta(x_1) - f_\theta(x_2)\|$ reflects semantic similarity: $d(x_i, x_i^+) \ll d(x_i, x_j^-)$, where $x_i^+$ is a positive (similar) example and $x_j^-$ is a negative (dissimilar) example. The learned metric is a pseudo-metric on the input space $\mathcal{X}$, parameterized by the neural network $f_\theta$."
        notation="Distances are measured in the embedding space $\mathbb{R}^d$. Common choices: L2 distance $\|u - v\|_2$, cosine distance $1 - \frac{u \cdot v}{\|u\|\|v\|}$. For L2-normalized embeddings on the unit sphere $\mathbb{S}^{d-1}$, both are equivalent up to a monotone transformation."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Contrastive Loss (Siamese Networks)"
        definition="The contrastive loss (Hadsell et al., 2006) operates on labeled pairs $(x_1, x_2, y)$ where $y=1$ for similar pairs and $y=0$ for dissimilar pairs. The loss is: $\mathcal{L}_{cont} = y \cdot d^2 + (1-y) \cdot \max(0, m - d)^2$, where $d = \|f_\theta(x_1) - f_\theta(x_2)\|$ is the Euclidean distance in embedding space and $m > 0$ is a margin hyperparameter. Similar pairs are attracted (first term); dissimilar pairs are repelled if they are within margin $m$ (second term)."
        notation="The margin $m$ prevents the trivial solution where all embeddings collapse to the same point. Choosing $m$ is critical: too small and negatives are insufficiently separated; too large and gradients vanish for well-separated negatives."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Triplet Loss and Margin Constraint"
        statement="The triplet loss trains on triples $(a, p, n)$ — anchor, positive, negative — and enforces: $d(a, p) + \alpha < d(a, n)$ for margin $\alpha > 0$. The loss is: $\mathcal{L}_{tri} = \sum_{(a,p,n)} \max(0,\, d(a,p) - d(a,n) + \alpha)$. At convergence, for all valid triplets the negative is at least margin $\alpha$ farther from the anchor than the positive."
        proof="The gradient of $\mathcal{L}_{tri}$ w.r.t. the anchor embedding $f(a)$ is non-zero only for 'hard' triplets where the constraint is violated: $d(a,p) - d(a,n) + \alpha > 0$. The gradient pushes $f(a)$ toward $f(p)$ and away from $f(n)$. At a local minimum, all triplets satisfy $d(a,n) \geq d(a,p) + \alpha$, which means the negative lies outside a ball of radius $d(a,p) + \alpha$ around the anchor. This is the metric learning condition: the embedding space separates classes by at least margin $\alpha$. Hard negative mining (selecting triplets where the constraint is nearly violated) is critical for fast convergence, as easy negatives have zero gradient. $\square$"
        corollaries={[
          'Semi-hard negatives satisfy $d(a,p) < d(a,n) < d(a,p) + \\alpha$ — they violate the margin but are farther than the positive. These provide the best training signal.',
          'Hard negatives with $d(a,n) < d(a,p)$ (negative closer than positive) provide strong gradients but can cause instability in early training.',
        ]}
      />

      <TheoremBlock
        label="Theorem 3.2"
        title="InfoNCE Loss and Mutual Information Maximization"
        statement="The InfoNCE loss for a batch of $N$ positive pairs $(x_i, x_i^+)$ is: $\mathcal{L}_{NCE} = -\frac{1}{N}\sum_{i=1}^N \log \frac{e^{f(x_i)^\top f(x_i^+)/\tau}}{\sum_{j=1}^N e^{f(x_i)^\top f(x_j^+)/\tau}}$. Minimizing InfoNCE maximizes a lower bound on the mutual information $I(f(x); f(x^+))$."
        proof="The InfoNCE loss is a lower bound on $-I(x; x^+) + \log N$. As $N \to \infty$ with more negatives, the bound tightens. The optimal encoder under InfoNCE is $f^*(x) \propto p(x^+ | x) / p(x^+)$ — the representation of $x$ that best predicts its positive augmentation. Temperature $\tau$ controls the concentration: small $\tau$ creates sharper softmax distributions, focusing more on hard negatives. $\square$"
        corollaries={[
          'N-pairs loss is InfoNCE with $\\tau=1$. CLIP uses $\\tau$ as a learned parameter.',
          'Larger batch sizes provide more in-batch negatives, improving InfoNCE estimates but requiring more memory.',
        ]}
      />

      <ExampleBlock
        title="Mining Hard Negatives for Triplet Training"
        difficulty="advanced"
        problem="Given a batch of 32 anchor-positive pairs with L2-normalized embeddings in $\mathbb{R}^{128}$, describe the three negative mining strategies and their trade-offs."
        solution={[
          {
            step: 'Random negatives',
            explanation:
              'For each anchor, randomly sample any non-positive example as the negative. Simple but most negatives are easy (already well-separated), leading to near-zero gradients and slow convergence. Effective only in early training when many triplets are violated.',
          },
          {
            step: 'Hard negative mining (offline)',
            formula: 'n^* = \\arg\\min_{n \\not\\sim a} d(f_\\theta(a), f_\\theta(n))',
            explanation:
              'Find the hardest negative — the non-matching example closest to the anchor. Maximizes gradient magnitude but risks mode collapse if the hardest negatives are actually mislabeled or semantically ambiguous examples.',
          },
          {
            step: 'Semi-hard negative mining (recommended)',
            formula: 'n^* = \\{n : d(a,p) < d(a,n) < d(a,p) + \\alpha\\}',
            explanation:
              'Find negatives that are farther than the positive but within the margin. These give non-zero gradients without the instability of hard negatives. FaceNet reports this is the most effective strategy in practice.',
          },
          {
            step: 'In-batch hard negatives',
            explanation:
              'For a batch of $B$ items, compute all $B \times B$ pairwise distances and select the hardest within-batch negatives. Efficient (no extra forward passes) and scales with batch size. Used in DPR and SBERT with large batches.',
          },
        ]}
      />

      <WarningBlock title="Mode Collapse in Contrastive Learning">
        <p>
          Without careful design, contrastive objectives can collapse: all embeddings converge
          to the same point or a small subspace, satisfying the loss trivially. Causes include:
          (1) <strong>Insufficient negatives</strong> — small batches provide too few negatives;
          (2) <strong>Symmetric collapse</strong> — two-branch encoders can collapse if both
          branches learn to output the same constant; (3) <strong>Augmentation mismatch</strong>
          — too-strong augmentations destroy semantic content. Solutions: large batches (InfoNCE),
          momentum encoders (MoCo), stop-gradient (SimSiam), or BN tricks (BYOL).
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="Contrastive, Triplet, InfoNCE, and N-Pairs Losses in PyTorch"
        runnable
      />
    </div>
  );
}
