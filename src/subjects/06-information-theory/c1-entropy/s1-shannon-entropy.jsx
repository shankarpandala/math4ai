import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Utility: binary entropy
// ---------------------------------------------------------------------------

function binaryEntropy(p) {
  if (p <= 0 || p >= 1) return 0;
  return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
}

// ---------------------------------------------------------------------------
// Interactive entropy curve visualization
// ---------------------------------------------------------------------------

// Pre-compute the full curve with 200 points for smooth rendering
const ENTROPY_CURVE = Array.from({ length: 201 }, (_, i) => {
  const p = i / 200;
  return { p: parseFloat(p.toFixed(3)), H: parseFloat(binaryEntropy(p).toFixed(5)) };
});

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { p, H } = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="font-mono text-gray-600 dark:text-gray-400">
        p = <strong>{p.toFixed(3)}</strong>
      </p>
      <p className="font-mono text-indigo-600 dark:text-indigo-400">
        H(p) = <strong>{H.toFixed(4)} bits</strong>
      </p>
    </div>
  );
}

function EntropyViz() {
  const [p, setP] = useState(0.5);
  const currentH = useMemo(() => binaryEntropy(p), [p]);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Binary Entropy Function
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        For a Bernoulli(<InlineMath math="p" />) random variable:
        <span className="ml-2 font-mono">
          H(p) = −p log₂ p − (1−p) log₂(1−p)
        </span>
      </p>

      {/* Slider */}
      <div className="mb-6 flex items-center gap-4">
        <label className="w-20 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
          p =
        </label>
        <input
          type="range"
          min={0.01}
          max={0.99}
          step={0.01}
          value={p}
          onChange={(e) => setP(parseFloat(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-indigo-500"
        />
        <span className="w-14 text-right font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {p.toFixed(2)}
        </span>
      </div>

      {/* Current value display */}
      <div className="mb-5 flex items-center justify-center gap-6">
        <div className="rounded-lg bg-indigo-50 px-5 py-3 text-center dark:bg-indigo-950/30">
          <p className="text-xs text-indigo-500 dark:text-indigo-400">Current entropy</p>
          <p className="mt-0.5 font-mono text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {currentH.toFixed(4)}
          </p>
          <p className="text-xs text-indigo-500 dark:text-indigo-400">bits</p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentH < 0.05 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              Near-certain outcome — almost no information
            </span>
          ) : currentH > 0.95 ? (
            <span className="text-red-600 dark:text-red-400 font-medium">
              Near-maximum uncertainty — ~1 bit of information
            </span>
          ) : (
            <span>
              Intermediate uncertainty — {(currentH * 100).toFixed(1)}% of maximum
            </span>
          )}
        </div>
      </div>

      {/* Line chart */}
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ENTROPY_CURVE} margin={{ top: 8, right: 20, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="p"
              type="number"
              domain={[0, 1]}
              tickCount={6}
              label={{ value: 'p', position: 'insideBottomRight', offset: -4, fontSize: 12 }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 1.1]}
              tickCount={6}
              label={{ value: 'H(p) bits', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* The entropy curve */}
            <Line
              type="monotone"
              dataKey="H"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
              name="H(p)"
            />

            {/* Vertical line at selected p */}
            <ReferenceLine
              x={p}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 3"
              label={{ value: `p=${p.toFixed(2)}`, position: 'top', fontSize: 10, fill: '#f59e0b' }}
            />

            {/* Dot at selected point */}
            <ReferenceDot
              x={p}
              y={currentH}
              r={5}
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth={2}
            />

            {/* Key annotations */}
            <ReferenceDot x={0} y={0} r={4} fill="#22c55e" stroke="#fff" strokeWidth={2}
              label={{ value: 'H(0)=0', position: 'right', fontSize: 9, fill: '#22c55e' }} />
            <ReferenceDot x={0.5} y={1} r={4} fill="#ef4444" stroke="#fff" strokeWidth={2}
              label={{ value: 'H(0.5)=1', position: 'top', fontSize: 9, fill: '#ef4444' }} />
            <ReferenceDot x={1} y={0} r={4} fill="#22c55e" stroke="#fff" strokeWidth={2}
              label={{ value: 'H(1)=0', position: 'left', fontSize: 9, fill: '#22c55e' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex justify-center gap-8 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
          H = 0 (certain)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          H = 1 bit (max uncertainty at p=0.5)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
          Current p
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const ENTROPY_CODE = `import numpy as np

def entropy(p, base=2):
    """Shannon entropy. p is array of probabilities summing to 1."""
    p = np.asarray(p, dtype=float)
    # Avoid log(0) by masking zeros
    mask = p > 0
    return -np.sum(p[mask] * np.log(p[mask])) / np.log(base)

# Binary entropy function
def binary_entropy(p):
    return entropy([p, 1 - p])

# Examples
print(f"H(fair coin) = {binary_entropy(0.5):.4f} bits")
print(f"H(biased coin p=0.1) = {binary_entropy(0.1):.4f} bits")
print(f"H(certain outcome) = {binary_entropy(0.0):.4f} bits")

# Uniform distribution maximizes entropy
for n in [2, 4, 8, 16]:
    uniform = np.ones(n) / n
    print(f"H(Uniform({n})) = {entropy(uniform):.4f} bits = log2({n}) = {np.log2(n):.4f}")

# Cross-entropy loss (neural network training)
def cross_entropy_loss(y_true, y_pred):
    """y_true: one-hot labels, y_pred: softmax probabilities"""
    y_pred = np.clip(y_pred, 1e-15, 1.0)  # numerical stability
    return -np.sum(y_true * np.log(y_pred))

# Example: 3-class classification
y_true = np.array([0, 1, 0])          # true class = 1
y_pred_good = np.array([0.05, 0.90, 0.05])
y_pred_bad  = np.array([0.33, 0.34, 0.33])
print(f"\\nCross-entropy (good prediction): {cross_entropy_loss(y_true, y_pred_good):.4f}")
print(f"Cross-entropy (bad  prediction): {cross_entropy_loss(y_true, y_pred_bad):.4f}")

# Verify: H(p,q) = H(p) + KL(p||q)
def kl_divergence(p, q, base=2):
    p, q = np.asarray(p, float), np.asarray(q, float)
    mask = p > 0
    return np.sum(p[mask] * np.log2(p[mask] / q[mask]))

p_true = np.array([0, 1, 0])
q_pred = np.array([0.05, 0.90, 0.05])
H_p  = entropy(p_true)                          # 0 (deterministic)
KL   = kl_divergence(p_true, q_pred)
CE   = cross_entropy_loss(p_true, q_pred) / np.log(2)  # convert to bits
print(f"\\nH(p) + KL(p||q) = {H_p:.4f} + {KL:.4f} = {H_p + KL:.4f}")
print(f"H(p, q)          = {CE:.4f}  (should match above)")`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Shannon, C. E.',
    year: 1948,
    title: 'A Mathematical Theory of Communication',
    venue: 'Bell System Technical Journal, 27(3), 379–423',
    url: 'https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf',
    type: 'foundational',
    whyImportant: 'The founding paper of information theory. Introduced entropy, channel capacity, and source coding theorems. One of the most cited papers in science.',
  },
  {
    authors: 'Cover, T. M. & Thomas, J. A.',
    year: 2006,
    title: 'Elements of Information Theory (2nd ed.)',
    venue: 'Wiley-Interscience',
    url: 'https://www.wiley.com/en-us/Elements+of+Information+Theory%2C+2nd+Edition-p-9780471241959',
    type: 'textbook',
    whyImportant: 'The standard graduate textbook. Rigorous treatment of entropy, mutual information, channel coding, rate-distortion theory, and Kolmogorov complexity.',
  },
  {
    authors: 'MacKay, D. J. C.',
    year: 2003,
    title: 'Information Theory, Inference, and Learning Algorithms',
    venue: 'Cambridge University Press (freely available online)',
    url: 'https://www.inference.org.uk/mackay/itila/',
    type: 'textbook',
    whyImportant: 'Free online textbook connecting information theory to Bayesian inference and machine learning. Exceptionally clear exposition with exercises.',
  },
  {
    authors: 'Csiszár, I. & Shields, P. C.',
    year: 2004,
    title: 'Information Theory and Statistics: A Tutorial',
    venue: 'Foundations and Trends in Communications and Information Theory, 1(4)',
    url: 'https://www.renyi.hu/~csiszar/Publications/Information_Theory_and_Statistics:_A_Tutorial.pdf',
    type: 'survey',
    whyImportant: 'Connects entropy and KL divergence to statistical estimation theory, hypothesis testing, and large deviations.',
  },
];

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------

export default function ShannonEntropy() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Shannon Entropy
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The fundamental measure of uncertainty and information content in a random variable.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          <strong>Claude Shannon</strong> introduced entropy in his landmark 1948 paper
          "A Mathematical Theory of Communication," published in the Bell System Technical
          Journal. The paper simultaneously founded information theory and established the
          mathematical foundations for digital communication.
        </p>
        <p className="mt-2">
          Shannon borrowed the term <em>entropy</em> from thermodynamics, where Boltzmann's
          entropy <InlineMath math="S = k_B \ln W" /> measures the number of microscopic
          states compatible with a macrostate. The mathematical parallel is exact:
          thermodynamic entropy and information entropy are both measures of uncertainty.
          According to Shannon himself, <strong>John von Neumann</strong> suggested the
          name with the quip: <em>"Nobody knows what entropy really is, so in a debate you
          will always have the advantage."</em>
        </p>
      </NoteBlock>

      {/* Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">Motivation</h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Entropy quantifies two dual concepts that turn out to be identical:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>
              <strong>Uncertainty:</strong> How unpredictable is a random variable? High
              entropy means many equally likely outcomes; low entropy means the distribution
              is peaked.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>
              <strong>Information content:</strong> How many bits are needed on average to
              encode a sample? Shannon's source coding theorem proves that{' '}
              <InlineMath math="H(X)" /> is the minimum average code length in bits.
            </span>
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Applications span virtually all of machine learning and statistics: lossless data
          compression (Huffman codes achieve the entropy bound), neural network training
          (cross-entropy loss), decision tree learning (information gain for feature
          splitting), feature selection (mutual information), variational inference (ELBO
          = reconstruction − KL divergence), and language model evaluation (perplexity
          = <InlineMath math="2^{H}" />).
        </p>
      </section>

      {/* Definition */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Shannon Entropy"
        definition="For a discrete random variable $X$ with alphabet $\mathcal{X}$ and probability mass function $p$, the Shannon entropy is: $H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x) = \mathbb{E}[-\log_2 p(X)]$. By convention, $0 \log 0 := 0$ (consistent with $\lim_{p \to 0} p \log p = 0$)."
        notation="$H(X)$ is measured in bits when using $\log_2$, nats when using $\ln$, and hartleys (dits) when using $\log_{10}$. The self-information of outcome $x$ is $I(x) = -\log_2 p(x)$ bits. Entropy is the expected self-information: $H(X) = \mathbb{E}[I(X)]$."
      />

      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        The self-information <InlineMath math="-\log_2 p(x)" /> is a measure of
        "surprise" — a low-probability event carries high information content. Observing
        that a fair die rolled 1 carries <InlineMath math="\log_2 6 \approx 2.58" /> bits
        of information. Observing that a biased coin (99% heads) landed heads carries only{' '}
        <InlineMath math="-\log_2 0.99 \approx 0.015" /> bits — barely any surprise.
      </p>

      {/* Interactive entropy visualization */}
      <EntropyViz />

      {/* Maximum entropy theorem */}
      <TheoremBlock
        label="Theorem 1.1"
        title="Maximum Entropy"
        statement="For a discrete random variable $X$ taking $n$ values, $H(X) \leq \log_2 n$, with equality if and only if $X$ is uniformly distributed over its $n$ values."
        proof="We want to maximize $H(X) = -\sum_{i=1}^{n} p_i \log_2 p_i$ subject to $\sum_i p_i = 1$, $p_i \geq 0$. Let $u_i = 1/n$ be the uniform distribution. By the log-sum inequality (a consequence of Jensen's inequality applied to the convex function $-\log$): $\sum_i p_i \log(p_i/u_i) \geq 0$ (this is the KL divergence $D_{KL}(p \| u) \geq 0$). Expanding: $\sum_i p_i \log p_i - \sum_i p_i \log(1/n) \geq 0$, so $-\sum_i p_i \log p_i \leq \log n = \sum_i p_i \log n$. Equality holds iff $p_i = u_i$ for all $i$, i.e., iff $p$ is uniform."
        corollaries={[
          "A $k$-bit string has at most $H = k$ bits of entropy, achieved by the uniform distribution over $2^k$ strings.",
          "The entropy of the English language is empirically around 0.6–1.3 bits per character — far below $\\log_2 26 \\approx 4.7$ bits — due to strong statistical redundancy.",
          "This theorem justifies maximum-entropy modeling: among all distributions satisfying given constraints, the uniform (maximum-entropy) distribution makes the fewest unwarranted assumptions.",
        ]}
      />

      {/* Axiomatic characterization */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Axiomatic Characterization
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Shannon (1948) showed that the entropy function is <em>uniquely</em> determined
          (up to a positive multiplicative constant) by four natural axioms:
        </p>
        <ol className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              1
            </span>
            <span>
              <strong>Continuity:</strong>{' '}
              <InlineMath math="H(p_1, \ldots, p_n)" /> is continuous in all{' '}
              <InlineMath math="p_i" />.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              2
            </span>
            <span>
              <strong>Symmetry:</strong>{' '}
              <InlineMath math="H" /> is invariant under permutation of its arguments —
              the entropy depends only on the probability values, not the labeling of outcomes.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              3
            </span>
            <span>
              <strong>Maximum at uniformity:</strong> For fixed <InlineMath math="n" />,
              the uniform distribution <InlineMath math="(1/n, \ldots, 1/n)" /> uniquely
              maximizes <InlineMath math="H" />, and this maximum increases with{' '}
              <InlineMath math="n" />.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              4
            </span>
            <span>
              <strong>Grouping (chain rule):</strong> If outcomes are grouped, the entropy
              of the overall distribution equals the entropy of the grouping plus the
              conditional entropy within groups:{' '}
              <InlineMath math="H(p_1, \ldots, p_n) = H(p_A, p_B) + p_A H(p_1/p_A, \ldots) + p_B H(\ldots)" />.
            </span>
          </li>
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Khinchin (1957) proved that the <em>only</em> function satisfying all four axioms is:
        </p>
        <BlockMath math="H = -K \sum_{i} p_i \log p_i" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          for some positive constant <InlineMath math="K" /> (which sets the choice of
          base / units).
        </p>
      </section>

      {/* Joint and conditional entropy */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Joint and Conditional Entropy
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The entropy of a joint distribution <InlineMath math="(X, Y)" /> is:
        </p>
        <BlockMath math="H(X, Y) = -\sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) \log_2 p(x, y)" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The conditional entropy of <InlineMath math="Y" /> given{' '}
          <InlineMath math="X" /> measures the remaining uncertainty in{' '}
          <InlineMath math="Y" /> after observing <InlineMath math="X" />:
        </p>
        <BlockMath math="H(Y \mid X) = \sum_{x \in \mathcal{X}} p(x)\, H(Y \mid X = x) = -\sum_{x,y} p(x,y) \log_2 p(y \mid x)" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The <strong>chain rule</strong> for entropy states:
        </p>
        <BlockMath math="H(X, Y) = H(X) + H(Y \mid X) = H(Y) + H(X \mid Y)" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Key inequalities (all follow from <InlineMath math="D_{KL}(p\|q) \geq 0" />):
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            <span>
              <strong>Non-negativity:</strong> <InlineMath math="H(X) \geq 0" />, with
              equality iff <InlineMath math="X" /> is deterministic.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            <span>
              <strong>Conditioning reduces entropy:</strong>{' '}
              <InlineMath math="H(Y \mid X) \leq H(Y)" />, with equality iff{' '}
              <InlineMath math="X \perp Y" />.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            <span>
              <strong>Subadditivity:</strong>{' '}
              <InlineMath math="H(X, Y) \leq H(X) + H(Y)" />, with equality iff{' '}
              <InlineMath math="X \perp Y" />.
            </span>
          </li>
        </ul>
      </section>

      {/* Connection to cross-entropy loss */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Connection to Cross-Entropy Loss
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The <strong>cross-entropy</strong> between true distribution{' '}
          <InlineMath math="p" /> and model distribution <InlineMath math="q" /> is:
        </p>
        <BlockMath math="H(p, q) = -\sum_{x} p(x) \log q(x) = \mathbb{E}_{x \sim p}[-\log q(x)]" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          This decomposes via the fundamental identity:
        </p>
        <BlockMath math="H(p, q) = H(p) + D_{\mathrm{KL}}(p \,\|\, q)" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          where <InlineMath math="D_{\mathrm{KL}}(p \| q) = \sum_x p(x) \log(p(x)/q(x)) \geq 0" />{' '}
          is the KL divergence. Since <InlineMath math="H(p)" /> is fixed (the true
          label distribution doesn't depend on model parameters), <em>minimizing
          cross-entropy is equivalent to minimizing KL divergence</em>. This is why the
          standard classification loss in PyTorch/TensorFlow is called
          <code className="mx-1 rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
            nn.CrossEntropyLoss
          </code>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          For language modeling with a next-token prediction objective, the loss per
          token is <InlineMath math="-\log q(x_t \mid x_{<t})" />. The average over a
          corpus gives the model's per-token cross-entropy. <strong>Perplexity</strong> is
          the exponentiated cross-entropy:
        </p>
        <BlockMath math="\text{PPL} = 2^{H(p, q)} = 2^{-\frac{1}{N} \sum_{t=1}^N \log_2 q(x_t \mid x_{<t})}" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Perplexity has the interpretation of the effective vocabulary size the model
          is "confused" between at each token position. GPT-4 achieves perplexity ~5–10
          on standard benchmarks; a random character-level model on English would have
          perplexity ~26 (the alphabet size).
        </p>
      </section>

      {/* Python code */}
      <PythonCode
        code={ENTROPY_CODE}
        language="python"
        title="Shannon Entropy — NumPy Implementation"
        runnable
      />

      {/* Warning block */}
      <WarningBlock title="Common Pitfalls">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>Bits vs. nats:</strong> PyTorch's{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                nn.CrossEntropyLoss
              </code>{' '}
              uses natural logarithm (nats), so reported loss values are in nats.
              Information theory papers typically use <InlineMath math="\log_2" /> (bits).
              Convert via: <InlineMath math="1 \text{ nat} = \log_2 e \approx 1.4427 \text{ bits}" />.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>Entropy is a property of distributions, not outcomes.</strong>{' '}
              It is meaningless to speak of "the entropy of a sample." Entropy measures
              the uncertainty of the <em>distribution</em> generating samples. A single
              observed value provides no entropy information — only the distribution does.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>
                Cross-entropy <InlineMath math="H(p,q) \neq" /> entropy{' '}
                <InlineMath math="H(p)" />.
              </strong>{' '}
              The cross-entropy loss includes a KL divergence term:{' '}
              <InlineMath math="H(p,q) = H(p) + D_{KL}(p\|q) \geq H(p)" />. When
              <InlineMath math="p" /> is one-hot (classification), <InlineMath math="H(p) = 0" />,
              so <InlineMath math="H(p,q) = D_{KL}(p\|q)" /> — the loss <em>is</em> the
              KL divergence in this case.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
