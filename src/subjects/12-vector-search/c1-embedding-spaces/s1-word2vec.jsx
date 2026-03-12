import React, { useState, useCallback } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ---------------------------------------------------------------------------
// Cosine Similarity Interactive Demo
// Two 2D vectors controlled by angle sliders; display dot product, magnitudes,
// cosine similarity, and angle between them.
// ---------------------------------------------------------------------------

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

function dot2D(ax, ay, bx, by) {
  return ax * bx + ay * by;
}

function mag2D(x, y) {
  return Math.sqrt(x * x + y * y);
}

const SVG_W = 240;
const SVG_H = 240;
const ORIGIN_X = SVG_W / 2;
const ORIGIN_Y = SVG_H / 2;
const VEC_LEN = 90;

function CosineSimilarityDemo() {
  const [angleA, setAngleA] = useState(30);  // degrees from positive x-axis
  const [angleB, setAngleB] = useState(75);

  const ax = VEC_LEN * Math.cos(toRad(angleA));
  const ay = -VEC_LEN * Math.sin(toRad(angleA)); // SVG y-axis flipped
  const bx = VEC_LEN * Math.cos(toRad(angleB));
  const by = -VEC_LEN * Math.sin(toRad(angleB));

  // Unit vector components (for cosine calculation)
  const dotProd = dot2D(ax, ay, bx, by);
  const magA = mag2D(ax, ay);
  const magB = mag2D(bx, by);
  const cosSim = dotProd / (magA * magB);
  const angleBetween = toDeg(Math.acos(Math.max(-1, Math.min(1, cosSim))));

  // Arc for angle between vectors (draw a small arc)
  const arcAngleA = toRad(angleA);
  const arcAngleB = toRad(angleB);
  const arcR = 28;
  const minAngle = Math.min(arcAngleA, arcAngleB);
  const maxAngle = Math.max(arcAngleA, arcAngleB);
  const arcX1 = ORIGIN_X + arcR * Math.cos(minAngle);
  const arcY1 = ORIGIN_Y - arcR * Math.sin(minAngle);
  const arcX2 = ORIGIN_X + arcR * Math.cos(maxAngle);
  const arcY2 = ORIGIN_Y - arcR * Math.sin(maxAngle);
  const largeArc = maxAngle - minAngle > Math.PI ? 1 : 0;

  // Color-code cosine similarity: green=1 (parallel), red=-1 (anti-parallel)
  function simColor(sim) {
    if (sim >= 0.8) return '#22c55e';
    if (sim >= 0.3) return '#84cc16';
    if (sim >= -0.3) return '#f59e0b';
    if (sim >= -0.8) return '#f97316';
    return '#ef4444';
  }
  const color = simColor(cosSim);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Cosine Similarity Demo
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Adjust the angle of each 2D vector. Watch how cosine similarity{' '}
        <InlineMath math="\cos\theta = \frac{\mathbf{a} \cdot \mathbf{b}}{|\mathbf{a}||\mathbf{b}|}" />{' '}
        changes. In word embeddings, similar words have high cosine similarity regardless of
        vector magnitude.
      </p>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        {/* SVG visualization */}
        <div className="shrink-0">
          <svg
            width={SVG_W}
            height={SVG_H}
            className="mx-auto block"
            style={{ fontFamily: 'inherit' }}
          >
            {/* Grid lines */}
            <line x1={ORIGIN_X} y1={0} x2={ORIGIN_X} y2={SVG_H} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
            <line x1={0} y1={ORIGIN_Y} x2={SVG_W} y2={ORIGIN_Y} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />

            {/* Shaded region between vectors */}
            <path
              d={`M ${ORIGIN_X} ${ORIGIN_Y} L ${ORIGIN_X + ax} ${ORIGIN_Y + ay} A ${VEC_LEN} ${VEC_LEN} 0 0 ${arcAngleA < arcAngleB ? 1 : 0} ${ORIGIN_X + bx} ${ORIGIN_Y + by} Z`}
              fill={cosSim >= 0 ? 'rgba(99,102,241,0.08)' : 'rgba(239,68,68,0.08)'}
            />

            {/* Angle arc */}
            <path
              d={`M ${arcX1} ${arcY1} A ${arcR} ${arcR} 0 ${largeArc} ${arcAngleA < arcAngleB ? 1 : 0} ${arcX2} ${arcY2}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth={1.5}
              opacity={0.5}
            />

            {/* Angle label */}
            {(() => {
              const midAngle = (arcAngleA + arcAngleB) / 2;
              const lx = ORIGIN_X + (arcR + 10) * Math.cos(midAngle);
              const ly = ORIGIN_Y - (arcR + 10) * Math.sin(midAngle);
              return (
                <text x={lx} y={ly} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight="600">
                  {angleBetween.toFixed(0)}°
                </text>
              );
            })()}

            {/* Vector A */}
            <line
              x1={ORIGIN_X}
              y1={ORIGIN_Y}
              x2={ORIGIN_X + ax}
              y2={ORIGIN_Y + ay}
              stroke="#6366f1"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Arrowhead A */}
            <polygon
              points={`0,-5 4,5 -4,5`}
              fill="#6366f1"
              transform={`translate(${ORIGIN_X + ax}, ${ORIGIN_Y + ay}) rotate(${-angleA + 90})`}
            />
            <text
              x={ORIGIN_X + ax * 1.12}
              y={ORIGIN_Y + ay * 1.12}
              textAnchor="middle"
              fontSize={12}
              fontWeight="700"
              fill="#4f46e5"
            >
              a
            </text>

            {/* Vector B */}
            <line
              x1={ORIGIN_X}
              y1={ORIGIN_Y}
              x2={ORIGIN_X + bx}
              y2={ORIGIN_Y + by}
              stroke="#10b981"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Arrowhead B */}
            <polygon
              points={`0,-5 4,5 -4,5`}
              fill="#10b981"
              transform={`translate(${ORIGIN_X + bx}, ${ORIGIN_Y + by}) rotate(${-angleB + 90})`}
            />
            <text
              x={ORIGIN_X + bx * 1.12}
              y={ORIGIN_Y + by * 1.12}
              textAnchor="middle"
              fontSize={12}
              fontWeight="700"
              fill="#059669"
            >
              b
            </text>

            {/* Origin dot */}
            <circle cx={ORIGIN_X} cy={ORIGIN_Y} r={3} fill="#374151" className="dark:fill-gray-400" />
          </svg>
        </div>

        {/* Controls and readout */}
        <div className="flex-1 space-y-5">
          {/* Slider A */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Vector <strong>a</strong> angle
              </label>
              <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {angleA}°
              </span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={angleA}
              onChange={(e) => setAngleA(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Slider B */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Vector <strong>b</strong> angle
              </label>
              <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {angleB}°
              </span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={angleB}
              onChange={(e) => setAngleB(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Readout */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-center dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Dot product</p>
              <p className="font-mono text-base font-bold text-gray-800 dark:text-gray-200">
                {dotProd.toFixed(1)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-center dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Angle between</p>
              <p className="font-mono text-base font-bold text-gray-800 dark:text-gray-200">
                {angleBetween.toFixed(1)}°
              </p>
            </div>
          </div>

          {/* Cosine similarity display */}
          <div
            className="rounded-xl px-5 py-4 text-center"
            style={{ background: color + '18', border: `2px solid ${color}40` }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
              Cosine Similarity
            </p>
            <p className="mt-1 font-mono text-3xl font-extrabold" style={{ color }}>
              {cosSim.toFixed(4)}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {cosSim > 0.95
                ? 'Nearly identical direction — very similar words'
                : cosSim > 0.5
                ? 'Moderately similar'
                : cosSim > -0.1
                ? 'Nearly orthogonal — unrelated concepts'
                : cosSim > -0.5
                ? 'Moderately dissimilar'
                : 'Nearly opposite direction — antonyms?'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const WORD2VEC_CODE = `from gensim.models import Word2Vec
import numpy as np

# Small training corpus (tokenized sentences)
corpus = [
    ["the", "king", "rules", "the", "kingdom"],
    ["the", "queen", "rules", "the", "kingdom"],
    ["man", "is", "strong", "and", "brave"],
    ["woman", "is", "strong", "and", "brave"],
    ["king", "and", "queen", "are", "royalty"],
    ["man", "and", "woman", "are", "human"],
    ["paris", "is", "the", "capital", "of", "france"],
    ["berlin", "is", "the", "capital", "of", "germany"],
    ["france", "and", "germany", "are", "countries"],
    ["the", "king", "of", "france", "is", "a", "man"],
]

# Train Skip-gram model
model = Word2Vec(
    sentences=corpus,
    vector_size=50,     # embedding dimension d
    window=3,           # context window size
    min_count=1,        # include all words (small corpus)
    sg=1,               # 1=Skip-gram, 0=CBOW
    negative=5,         # negative samples per positive
    epochs=200,
    seed=42,
)

print("Vocabulary:", list(model.wv.key_to_index.keys()))

# Cosine similarity between word pairs
print("\\nCosine similarities:")
pairs = [("king", "queen"), ("man", "woman"), ("france", "germany"),
         ("king", "man"), ("paris", "berlin")]
for w1, w2 in pairs:
    try:
        sim = model.wv.similarity(w1, w2)
        print(f"  sim({w1}, {w2}) = {sim:.4f}")
    except KeyError as e:
        print(f"  {e} not in vocabulary")

# Most similar words
print("\\nWords most similar to 'king':")
for word, score in model.wv.most_similar("king", topn=4):
    print(f"  {word}: {score:.4f}")

# Vector arithmetic: king - man + woman ≈ queen
print("\\nVector arithmetic: king - man + woman ≈ ?")
result = model.wv.most_similar(
    positive=["king", "woman"],
    negative=["man"],
    topn=3
)
for word, score in result:
    print(f"  {word}: {score:.4f}")

# Manual vector arithmetic with numpy
v_king  = model.wv["king"]
v_man   = model.wv["man"]
v_woman = model.wv["woman"]
v_queen = model.wv["queen"]

analogy_vec = v_king - v_man + v_woman
cos_sim = np.dot(analogy_vec, v_queen) / (
    np.linalg.norm(analogy_vec) * np.linalg.norm(v_queen)
)
print(f"\\ncosine_sim(king-man+woman, queen) = {cos_sim:.4f}")

# Inspect the raw embedding vectors
print(f"\\nEmbedding of 'king' (first 10 dims): {v_king[:10].round(3)}")
print(f"Embedding shape: {v_king.shape}  (d={model.vector_size})")`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Mikolov, T., Chen, K., Corrado, G., & Dean, J.',
    year: 2013,
    title: 'Efficient Estimation of Word Representations in Vector Space',
    venue: 'ICLR 2013',
    url: 'https://arxiv.org/abs/1301.3781',
    type: 'foundational',
    whyImportant: 'Introduced Word2Vec (Skip-gram and CBOW). Demonstrated that simple neural language models learn linear relationships between word vectors, enabling the famous king−man+woman≈queen analogy.',
  },
  {
    authors: 'Mikolov, T., Sutskever, I., Chen, K., Corrado, G., & Dean, J.',
    year: 2013,
    title: 'Distributed Representations of Words and Phrases and their Compositionality',
    venue: 'NeurIPS 2013',
    url: 'https://arxiv.org/abs/1310.4546',
    type: 'foundational',
    whyImportant: 'Introduced negative sampling (NEG) and subsampling of frequent words, making Word2Vec practical for large corpora. Also introduced phrase embeddings.',
  },
  {
    authors: 'Pennington, J., Socher, R., & Manning, C. D.',
    year: 2014,
    title: 'GloVe: Global Vectors for Word Representation',
    venue: 'EMNLP 2014',
    url: 'https://nlp.stanford.edu/pubs/glove.pdf',
    type: 'foundational',
    whyImportant: 'GloVe learns embeddings from global co-occurrence statistics rather than local context windows, often outperforming Word2Vec on analogy and similarity benchmarks.',
  },
  {
    authors: 'Bojanowski, P., Grave, E., Joulin, A., & Mikolov, T.',
    year: 2017,
    title: 'Enriching Word Vectors with Subword Information',
    venue: 'TACL, 5, 135–146',
    url: 'https://arxiv.org/abs/1607.04606',
    type: 'foundational',
    whyImportant: 'FastText extends Word2Vec with character n-gram embeddings, enabling representations for out-of-vocabulary words and improving performance on morphologically rich languages.',
  },
  {
    authors: 'Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K.',
    year: 2019,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    venue: 'NAACL 2019',
    url: 'https://arxiv.org/abs/1810.04805',
    type: 'foundational',
    whyImportant: 'BERT produces context-dependent (contextual) embeddings, where the same word gets different vectors in different sentences, overcoming the main limitation of static Word2Vec embeddings.',
  },
];

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------

export default function Word2Vec() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Word2Vec &amp; Neural Word Embeddings
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          How neural networks learn to encode semantic relationships between words as vectors
          in a continuous space — the foundation of modern NLP and vector search.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          In January 2013, <strong>Tomas Mikolov</strong> and colleagues at Google published
          "Efficient Estimation of Word Representations in Vector Space," introducing{' '}
          <em>Word2Vec</em>. The paper demonstrated that a shallow neural network trained
          on a massive text corpus (Google News, ~100B tokens) learned word vectors with
          remarkable geometric structure: <InlineMath math="\vec{king} - \vec{man} + \vec{woman} \approx \vec{queen}" />.
        </p>
        <p className="mt-2">
          This result upended the NLP field. Before Word2Vec, the dominant paradigm was
          high-dimensional sparse representations (bag-of-words, TF-IDF). Mikolov's
          demonstration that a 300-dimensional dense vector could capture semantic analogies
          sparked a decade of work on representation learning — leading directly to GloVe
          (2014), FastText (2017), ELMo (2018), and ultimately BERT (2019) and the
          Transformer era.
        </p>
      </NoteBlock>

      {/* Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          The Distributional Hypothesis
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Word embeddings are grounded in the <em>distributional hypothesis</em> (Harris,
          1954; Firth, 1957): <em>"You shall know a word by the company it keeps."</em>{' '}
          Words appearing in similar contexts (co-occurring with similar surrounding words)
          tend to have similar meanings. Word2Vec operationalizes this: two words are
          "similar" if they appear in the same contexts across a large corpus.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The practical impact is immense. Dense word embeddings serve as initialization for
          virtually all NLP models, enable semantic search (query a vector database with an
          embedding rather than keywords), power recommendation systems, and form the input
          layer of language models. Understanding their mathematical foundations — particularly
          cosine similarity in embedding space — is essential for modern AI engineering.
        </p>
      </section>

      {/* Definition: Word Embedding */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Word Embedding"
        definition="A word embedding is a mapping $\phi: \mathcal{V} \to \mathbb{R}^d$ from a vocabulary $\mathcal{V}$ (with $|\mathcal{V}| = V$ words) to a $d$-dimensional Euclidean space, where $d \ll V$. Typically $d \in \{50, 100, 200, 300\}$ while $V \in \{10{,}000, 100{,}000\}$. The embedding matrix $W_E \in \mathbb{R}^{V \times d}$ has one row per vocabulary word; the embedding of word $w$ is the row $W_E[w] \in \mathbb{R}^d$."
        notation="$\phi(w) = \mathbf{w} \in \mathbb{R}^d$. The embedding space is sometimes called the representation space or latent space. The goal is that geometric proximity (measured by cosine similarity or Euclidean distance) in $\mathbb{R}^d$ reflects semantic similarity in the original language."
      />

      {/* Interactive cosine demo */}
      <CosineSimilarityDemo />

      {/* Definition: Cosine Similarity */}
      <DefinitionBlock
        label="Definition 1.2"
        title="Cosine Similarity"
        definition="The cosine similarity between two vectors $\mathbf{a}, \mathbf{b} \in \mathbb{R}^d$ is: $\text{sim}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{|\mathbf{a}||\mathbf{b}|} = \cos\theta$, where $\theta$ is the angle between $\mathbf{a}$ and $\mathbf{b}$ and $|\cdot|$ denotes the Euclidean norm. The value lies in $[-1, 1]$: $+1$ means identical direction (parallel), $0$ means orthogonal, $-1$ means opposite direction (anti-parallel)."
        notation="Cosine similarity is invariant to the magnitude (length) of vectors — only direction matters. This is desirable for word embeddings because word frequency affects magnitude but not necessarily meaning. Cosine distance is $1 - \text{sim}(\mathbf{a}, \mathbf{b})$. For unit-norm vectors, cosine similarity equals the dot product."
      />

      <BlockMath math="\text{sim}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\|\,\|\mathbf{b}\|} = \frac{\sum_{i=1}^{d} a_i b_i}{\sqrt{\sum_i a_i^2}\,\sqrt{\sum_i b_i^2}}" />

      {/* Definition: Skip-gram and CBOW */}
      <DefinitionBlock
        label="Definition 1.3"
        title="Word2Vec Architectures: Skip-gram and CBOW"
        definition="Word2Vec provides two neural architectures trained on a context-prediction task. In Continuous Bag-of-Words (CBOW), the model predicts the center word $w_t$ from its surrounding context words $\{w_{t-c}, \ldots, w_{t-1}, w_{t+1}, \ldots, w_{t+c}\}$ (window size $c$). In Skip-gram, the model predicts each context word $w_{t+j}$ (for $-c \leq j \leq c$, $j \neq 0$) from the center word $w_t$. Skip-gram generally outperforms CBOW on rare words; CBOW is faster to train."
        notation="Both architectures use two embedding matrices: $W_I \in \mathbb{R}^{V \times d}$ (input/center embeddings) and $W_O \in \mathbb{R}^{V \times d}$ (output/context embeddings). The final word embedding is typically taken from $W_I$. The context window size $c$ is a hyperparameter: larger $c$ captures more topical similarity; smaller $c$ captures more syntactic/functional similarity."
      />

      {/* Skip-gram objective theorem */}
      <TheoremBlock
        label="Theorem 1.1"
        title="Skip-gram Objective"
        statement="The Skip-gram model maximizes the log-likelihood of observing each context word given the center word, over the entire training corpus $\mathcal{C}$. The objective is: $\mathcal{J} = \frac{1}{T} \sum_{t=1}^{T} \sum_{-c \leq j \leq c,\, j \neq 0} \log P(w_{t+j} \mid w_t)$, where the conditional probability is defined via softmax over dot products: $P(o \mid c) = \frac{\exp(\mathbf{u}_o^\top \mathbf{v}_c)}{\sum_{w=1}^{V} \exp(\mathbf{u}_w^\top \mathbf{v}_c)}$, with $\mathbf{v}_c \in \mathbb{R}^d$ the center-word embedding and $\mathbf{u}_o \in \mathbb{R}^d$ the output embedding of word $o$."
        proof="The softmax denominator $Z_c = \sum_{w=1}^{V} \exp(\mathbf{u}_w^\top \mathbf{v}_c)$ is called the partition function. The gradient of the log-probability w.r.t. $\mathbf{v}_c$ is $\nabla_{\mathbf{v}_c} \log P(o|c) = \mathbf{u}_o - \sum_{w} P(w|c)\,\mathbf{u}_w = \mathbf{u}_o - \mathbb{E}_{w \sim P(\cdot|c)}[\mathbf{u}_w]$. This is an observed context embedding minus the expected context embedding under the current model. Computing this gradient requires a sum over all $V$ vocabulary words, making it $O(V)$ per training step — expensive for $V \approx 10^5$. This motivates negative sampling as an approximation. $\square$"
        corollaries={[
          "The softmax formulation forces embeddings of words appearing in similar contexts to become similar (high dot product), since the gradient pushes $\\mathbf{v}_c$ toward the context embeddings $\\mathbf{u}_o$.",
          "The partition function $Z_c$ is expensive ($O(V)$) to compute — the key motivation for negative sampling and hierarchical softmax approximations.",
          "CBOW maximizes $\\sum_t \\log P(w_t \\mid w_{t-c}, \\ldots, w_{t+c})$ using the averaged context embedding as input.",
        ]}
      />

      {/* Word analogy example */}
      <ExampleBlock
        title="Word Vector Arithmetic: King − Man + Woman ≈ Queen"
        difficulty="intermediate"
        problem="Given word embeddings $\mathbf{v}_{king}$, $\mathbf{v}_{man}$, $\mathbf{v}_{woman}$, $\mathbf{v}_{queen}$ trained by Word2Vec, demonstrate and explain the famous analogy $\vec{king} - \vec{man} + \vec{woman} \approx \vec{queen}$. What geometric structure in the embedding space enables this?"
        solution={[
          {
            step: 'Understand the analogy as a vector offset',
            formula:
              '\\mathbf{v}_{king} - \\mathbf{v}_{man} \\approx \\mathbf{v}_{queen} - \\mathbf{v}_{woman}',
            explanation:
              'This says the vector from "man" to "king" (the "royalty" direction) is the same as the vector from "woman" to "queen". The embedding space encodes gender and royalty as approximately orthogonal linear directions.',
          },
          {
            step: 'Compute the analogy vector',
            formula:
              '\\mathbf{a} = \\mathbf{v}_{king} - \\mathbf{v}_{man} + \\mathbf{v}_{woman}',
            explanation:
              'Subtract the "man" component (removing the male-gender direction) and add the "woman" component (adding the female-gender direction). The royalty component from "king" is preserved.',
          },
          {
            step: 'Find the nearest word in the vocabulary (excluding king, man, woman)',
            formula:
              '\\hat{w} = \\arg\\max_{w \\notin \\{king, man, woman\\}} \\frac{\\mathbf{v}_w \\cdot \\mathbf{a}}{\\|\\mathbf{v}_w\\|\\,\\|\\mathbf{a}\\|}',
            explanation:
              'We search the vocabulary for the word whose embedding has the highest cosine similarity to the analogy vector a. Empirically on the Google News corpus, this retrieves "queen" with high cosine similarity (~0.76).',
          },
          {
            step: 'Interpret the linear structure',
            explanation:
              'Word2Vec embeddings learn approximate linear structure because the skip-gram objective forces words with similar distributional patterns (co-occurrence statistics) to have similar embeddings. Since "king" and "queen" appear in similar contexts (government, royalty) and differ mainly in gender (like "man" vs "woman"), the gender direction is learned as a consistent vector offset. This works because the softmax gradient updates nudge embeddings toward their context embeddings, and gender context words (his/her, king/queen, prince/princess) consistently co-occur with gender-marked center words.',
          },
        ]}
      />

      {/* Definition: Negative Sampling */}
      <DefinitionBlock
        label="Definition 1.4"
        title="Negative Sampling (NEG)"
        definition="Negative sampling approximates the softmax objective by replacing the sum over all $V$ vocabulary words with a sum over $k$ randomly sampled 'negative' words. The NEG objective for a center word $c$ and true context word $o$ is: $\mathcal{J}_{NEG} = \log\sigma(\mathbf{u}_o^\top \mathbf{v}_c) + \sum_{i=1}^{k} \mathbb{E}_{w_i \sim P_n(w)}\left[\log\sigma(-\mathbf{u}_{w_i}^\top \mathbf{v}_c)\right]$, where $\sigma(x) = 1/(1+e^{-x})$ is the sigmoid function and $P_n(w) \propto f(w)^{3/4}$ is the smoothed unigram distribution (raising frequency to the $3/4$ power to increase sampling of rare words)."
        notation="The NEG objective is a binary classification problem: distinguish the true context word (positive) from $k$ noise words (negatives). Training cost is $O(k)$ per step instead of $O(V)$. Typical values: $k=5$ for large corpora, $k=15$ for small corpora. The $3/4$-power smoothing was found empirically to improve performance by oversampling rare words relative to pure unigram sampling."
      />

      <BlockMath math="\mathcal{J}_{NEG}(o, c) = \log \sigma(\mathbf{u}_o^\top \mathbf{v}_c) + \sum_{i=1}^{k} \mathbb{E}_{w_i \sim P_n}\!\left[\log \sigma(-\mathbf{u}_{w_i}^\top \mathbf{v}_c)\right]" />

      {/* Warning: Limitations */}
      <WarningBlock title="Word2Vec Limitations">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>No subword information (fixed by FastText).</strong> Word2Vec treats
              each word as an atomic unit. "run," "runs," "running," and "runner" each get
              completely separate embeddings despite sharing a root. Out-of-vocabulary words
              get no embedding at all. FastText (Bojanowski et al., 2017) represents each
              word as a sum of character <InlineMath math="n" />-gram embeddings
              (e.g., "apple" = {`<ap`} + app + ppl + ple + {`le>`}), enabling OOV embeddings
              and better handling of morphology.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>Context-independent embeddings (fixed by BERT/ELMo).</strong>{' '}
              Word2Vec assigns a single static vector to each word regardless of context.
              "bank" in "river bank" and "bank account" receive the same embedding — a
              conflation of both senses. ELMo (2018) and BERT (2019) produce
              <em>contextual</em> embeddings: the representation of "bank" depends on the
              surrounding sentence, allowing disambiguation of polysemous words.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>Encodes societal biases.</strong> Embeddings trained on large corpora
              reflect statistical regularities — including harmful biases. For example,
              Word2Vec embeddings trained on Google News encode gender stereotypes:{' '}
              <InlineMath math="\vec{man} - \vec{woman} \approx \vec{programmer} - \vec{homemaker}" />.
              Bolukbasi et al. (2016) showed this and proposed debiasing methods. Any
              downstream model using pretrained embeddings inherits these biases, making
              bias evaluation and mitigation essential in production systems.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* Python code */}
      <PythonCode
        code={WORD2VEC_CODE}
        language="python"
        title="Word2Vec with Gensim — Training, Similarity, Vector Arithmetic"
        runnable
      />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
