import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const SEQ_PRESETS = [
  { id: '1/n', label: '1/n', fn: (n) => 1 / n, limit: 0, latex: '1/n' },
  { id: 'cauchy', label: '(n+1)/n', fn: (n) => (n + 1) / n, limit: 1, latex: '(n+1)/n' },
  { id: 'alternating', label: '(-1)^n/n', fn: (n) => Math.pow(-1, n) / n, limit: 0, latex: '(-1)^n/n' },
  { id: 'diverge', label: 'sin(n)', fn: (n) => Math.sin(n), limit: null, latex: '\\sin(n)' },
];

const CHART_W = 520;
const CHART_H = 160;
const PAD = { top: 20, right: 20, bottom: 30, left: 40 };

function SequenceViz() {
  const [seqId, setSeqId] = useState('1/n');
  const [maxN, setMaxN] = useState(30);
  const [epsilon, setEpsilon] = useState(0.3);

  const preset = SEQ_PRESETS.find((s) => s.id === seqId);
  const terms = Array.from({ length: maxN }, (_, i) => ({ n: i + 1, val: preset.fn(i + 1) }));

  const allVals = terms.map((t) => t.val);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const valRange = maxVal - minVal || 1;
  const padFrac = 0.15;
  const yLo = minVal - padFrac * valRange;
  const yHi = maxVal + padFrac * valRange;

  function toSvgX(n) {
    return PAD.left + ((n - 1) / (maxN - 1)) * (CHART_W - PAD.left - PAD.right);
  }
  function toSvgY(v) {
    return PAD.top + (1 - (v - yLo) / (yHi - yLo)) * (CHART_H - PAD.top - PAD.bottom);
  }

  const limitY = preset.limit !== null ? toSvgY(preset.limit) : null;
  const epBandTop = preset.limit !== null ? toSvgY(preset.limit + epsilon) : null;
  const epBandBot = preset.limit !== null ? toSvgY(preset.limit - epsilon) : null;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Sequence Convergence Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Choose a sequence and adjust <InlineMath math="\varepsilon" /> to see the convergence band.
      </p>

      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SEQ_PRESETS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSeqId(s.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              seqId === s.id
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <InlineMath math={s.latex} />
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Terms shown: n = {maxN}
          </label>
          <input type="range" min={5} max={80} value={maxN} onChange={(e) => setMaxN(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            <InlineMath math={`\\varepsilon = ${epsilon.toFixed(2)}`} />
          </label>
          <input type="range" min={0.05} max={1} step={0.05} value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40">
        {/* ε-band */}
        {preset.limit !== null && epBandTop !== null && epBandBot !== null && (
          <rect
            x={PAD.left}
            y={Math.min(epBandTop, epBandBot)}
            width={CHART_W - PAD.left - PAD.right}
            height={Math.abs(epBandBot - epBandTop)}
            fill="#10b98120"
          />
        )}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={CHART_H - PAD.bottom} stroke="#94a3b8" strokeWidth="1" />
        <line x1={PAD.left} y1={CHART_H - PAD.bottom} x2={CHART_W - PAD.right} y2={CHART_H - PAD.bottom} stroke="#94a3b8" strokeWidth="1" />

        {/* Limit line */}
        {limitY !== null && (
          <line x1={PAD.left} y1={limitY} x2={CHART_W - PAD.right} y2={limitY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
        )}

        {/* Sequence dots */}
        {terms.map(({ n, val }) => {
          const inside = preset.limit !== null && Math.abs(val - preset.limit) < epsilon;
          return (
            <circle
              key={n}
              cx={toSvgX(n)}
              cy={toSvgY(val)}
              r="3"
              fill={inside ? '#6366f1' : '#f43f5e'}
              opacity="0.85"
            />
          );
        })}

        {/* n-axis labels */}
        {[1, Math.floor(maxN / 2), maxN].map((n) => (
          <text key={n} x={toSvgX(n)} y={CHART_H - PAD.bottom + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {n}
          </text>
        ))}

        {/* Limit label */}
        {limitY !== null && (
          <text x={CHART_W - PAD.right + 2} y={limitY + 4} fontSize="9" fill="#10b981">L</text>
        )}

        {preset.limit === null && (
          <text x={CHART_W / 2} y={PAD.top + 14} textAnchor="middle" fontSize="11" fill="#f43f5e" fontWeight="bold">Diverges</text>
        )}
      </svg>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Purple dots are within <InlineMath math="\varepsilon" /> of the limit <InlineMath math="L" />. Red dots are outside the band.
        {preset.limit !== null
          ? ` For a_n → L, eventually ALL terms should be purple.`
          : ` This sequence has no limit.`}
      </p>
    </div>
  );
}

export default function SequencesAndLimits() {
  return (
    <div className="space-y-8">
      <SequenceViz />

      <DefinitionBlock
        label="Definition 2.1"
        title="Convergence of a Sequence"
        definition="A sequence $(a_n)_{n=1}^\infty$ in $\mathbb{R}$ converges to $L \in \mathbb{R}$, written $\lim_{n \to \infty} a_n = L$, if for every $\varepsilon > 0$ there exists $N \in \mathbb{N}$ such that for all $n > N$: $|a_n - L| < \varepsilon$. A sequence that does not converge is called divergent."
        notation="$a_n \to L$ as $n \to \infty$. The $\varepsilon$-$N$ definition: $\forall \varepsilon > 0,\; \exists N,\; \forall n > N: |a_n - L| < \varepsilon$."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Cauchy Sequence"
        definition="A sequence $(a_n)$ is Cauchy if for every $\varepsilon > 0$ there exists $N \in \mathbb{N}$ such that for all $m, n > N$: $|a_m - a_n| < \varepsilon$. Intuitively, the terms bunch together without reference to a limit point."
        notation="$\forall \varepsilon > 0,\; \exists N,\; \forall m, n > N: |a_m - a_n| < \varepsilon$."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Cauchy Completeness of ℝ"
        statement="A sequence in $\mathbb{R}$ converges if and only if it is a Cauchy sequence. Equivalently, $\mathbb{R}$ is a complete metric space."
        proof="($\Rightarrow$) If $a_n \to L$, then for any $\varepsilon > 0$ pick $N$ so $|a_n - L| < \varepsilon/2$ for $n > N$. Then for $m, n > N$: $|a_m - a_n| \leq |a_m - L| + |L - a_n| < \varepsilon$. So $(a_n)$ is Cauchy. ($\Leftarrow$) If $(a_n)$ is Cauchy it is bounded (easy: take $N$ for $\varepsilon=1$, then $|a_n| \leq \max(|a_1|,\ldots,|a_N|,|a_{N+1}|+1)$). By Bolzano-Weierstrass, it has a convergent subsequence $a_{n_k} \to L$. One then shows the full sequence converges to $L$ using the Cauchy property and the triangle inequality. $\square$"
        corollaries={[
          '$\\mathbb{Q}$ is NOT Cauchy-complete: the sequence $1, 1.4, 1.41, 1.414, \\ldots$ (rational approximations to $\\sqrt{2}$) is Cauchy in $\\mathbb{Q}$ but has no rational limit.',
          'The real numbers can be formally constructed as equivalence classes of Cauchy sequences of rationals — this is Cantor\'s construction of $\\mathbb{R}$.',
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Squeeze Theorem"
        statement="If sequences $(a_n)$, $(b_n)$, $(c_n)$ satisfy $a_n \leq b_n \leq c_n$ for all $n \geq N_0$ and $\lim a_n = \lim c_n = L$, then $\lim b_n = L$."
        proof="Given $\varepsilon > 0$, pick $N_1$ so $|a_n - L| < \varepsilon$ for $n > N_1$, and $N_2$ so $|c_n - L| < \varepsilon$ for $n > N_2$. For $n > \max(N_0, N_1, N_2)$: $L - \varepsilon < a_n \leq b_n \leq c_n < L + \varepsilon$, so $|b_n - L| < \varepsilon$. $\square$"
      />

      <ExampleBlock
        title="ε-N Proof: 1/n → 0"
        difficulty="beginner"
        problem="Prove from the definition that $\lim_{n \to \infty} \frac{1}{n} = 0$."
        solution={[
          {
            step: 'Setup: need to find N given ε > 0',
            formula: '\\text{Want: } \\left|\\frac{1}{n} - 0\\right| = \\frac{1}{n} < \\varepsilon',
            explanation: 'This requires n > 1/ε.',
          },
          {
            step: 'Choose N',
            formula: 'N = \\left\\lfloor \\frac{1}{\\varepsilon} \\right\\rfloor + 1',
            explanation: 'By the Archimedean property, such N ∈ ℕ exists.',
          },
          {
            step: 'Verify',
            formula: 'n > N \\geq \\frac{1}{\\varepsilon} \\implies \\frac{1}{n} < \\varepsilon',
            explanation: 'Hence |1/n - 0| < ε for all n > N.',
          },
          {
            step: 'Conclusion',
            formula: '\\lim_{n \\to \\infty} \\frac{1}{n} = 0 \\quad \\square',
            explanation: 'The definition is satisfied for any ε > 0.',
          },
        ]}
      />

      <WarningBlock title="Converges ≠ Monotone + Bounded (order matters)">
        <p className="mb-2">
          The Monotone Convergence Theorem says a <em>monotone and bounded</em> sequence
          converges. But not every convergent sequence is monotone — for example,{' '}
          <InlineMath math="a_n = (-1)^n / n \to 0" /> converges but oscillates.
        </p>
        <p>
          Also: <strong>bounded does not imply convergent</strong>. The sequence{' '}
          <InlineMath math="(-1)^n" /> is bounded but diverges. You need monotone <em>and</em> bounded,
          or the Cauchy criterion.
        </p>
      </WarningBlock>

      <PythonCode
        title="Sequence Convergence — Python"
        code={`import numpy as np

def check_cauchy(seq, eps=1e-6):
    """Check if sequence is approximately Cauchy."""
    n = len(seq)
    # Check last quarter of terms
    tail = seq[3 * n // 4:]
    return np.max(np.abs(np.subtract.outer(tail, tail))) < eps

# 1/n converges to 0
n_vals = np.arange(1, 201)
seq_1n = 1 / n_vals
print(f"1/n → {seq_1n[-1]:.6f}  (Cauchy: {check_cauchy(seq_1n)})")

# (-1)^n/n converges to 0
seq_alt = (-1)**n_vals / n_vals
print(f"(-1)^n/n → {seq_alt[-1]:.6f}  (Cauchy: {check_cauchy(seq_alt)})")

# sin(n) diverges
seq_sin = np.sin(n_vals)
print(f"sin(n) last term: {seq_sin[-1]:.6f}  (Cauchy: {check_cauchy(seq_sin)})")

# Rational Cauchy sequence converging to sqrt(2)
a = 1.0
for _ in range(50):
    a = (a + 2/a) / 2  # Newton's method
print(f"Cauchy approximation to sqrt(2): {a:.15f}")
print(f"Actual sqrt(2):                  {np.sqrt(2):.15f}")
`}
        runnable
      />
    </div>
  );
}
