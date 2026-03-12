import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const SERIES_PRESETS = [
  { id: 'geometric', label: '(1/2)^n', terms: (n) => Math.pow(0.5, n), trueSum: 1, latex: '\\sum (1/2)^n' },
  { id: 'harmonic', label: '1/n (diverges)', terms: (n) => 1 / n, trueSum: null, latex: '\\sum 1/n' },
  { id: 'bsquares', label: '1/n²', terms: (n) => 1 / (n * n), trueSum: Math.PI * Math.PI / 6, latex: '\\sum 1/n^2' },
  { id: 'alternating', label: '(-1)^{n+1}/n', terms: (n) => Math.pow(-1, n + 1) / n, trueSum: Math.log(2), latex: '\\sum (-1)^{n+1}/n' },
];

const CW = 520;
const CH = 160;
const PL = 44, PR = 16, PT = 16, PB = 28;

function SeriesViz() {
  const [sId, setSId] = useState('geometric');
  const [numTerms, setNumTerms] = useState(20);

  const preset = SERIES_PRESETS.find((s) => s.id === sId);

  const partialSums = [];
  let cum = 0;
  for (let k = 1; k <= numTerms; k++) {
    cum += preset.terms(k);
    partialSums.push({ k, S: cum });
  }

  const vals = partialSums.map((p) => p.S);
  const yMin = Math.min(...vals);
  const yMax = Math.max(...vals);
  const yRange = yMax - yMin || 1;
  const yLo = yMin - 0.1 * yRange;
  const yHi = yMax + 0.1 * yRange;

  const toX = (k) => PL + ((k - 1) / (numTerms - 1)) * (CW - PL - PR);
  const toY = (v) => PT + (1 - (v - yLo) / (yHi - yLo)) * (CH - PT - PB);

  const polyline = partialSums.map(({ k, S }) => `${toX(k)},${toY(S)}`).join(' ');

  const trueY = preset.trueSum !== null ? toY(preset.trueSum) : null;
  const lastS = partialSums[partialSums.length - 1]?.S;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Partial Sums Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Plot <InlineMath math="S_N = \sum_{n=1}^{N} a_n" /> and see whether the series converges.
      </p>

      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SERIES_PRESETS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSId(s.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              sId === s.id
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <InlineMath math={s.latex} />
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
          Terms: N = {numTerms}
        </label>
        <input type="range" min={2} max={100} value={numTerms} onChange={(e) => setNumTerms(Number(e.target.value))} className="w-full accent-indigo-500" />
      </div>

      {/* SVG chart */}
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40">
        {/* Axes */}
        <line x1={PL} y1={PT} x2={PL} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />
        <line x1={PL} y1={CH - PB} x2={CW - PR} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />

        {/* True sum dashed line */}
        {trueY !== null && (
          <>
            <line x1={PL} y1={trueY} x2={CW - PR} y2={trueY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x={CW - PR + 2} y={trueY + 4} fontSize="9" fill="#10b981">S</text>
          </>
        )}

        {/* Partial sums polyline */}
        <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2" />

        {/* Dots */}
        {partialSums.map(({ k, S }) => (
          <circle key={k} cx={toX(k)} cy={toY(S)} r="2.5" fill="#6366f1" opacity="0.7" />
        ))}

        {/* n-axis labels */}
        {[1, Math.floor(numTerms / 2), numTerms].map((k) => (
          <text key={k} x={toX(k)} y={CH - PB + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{k}</text>
        ))}

        {preset.trueSum === null && (
          <text x={CW / 2} y={PT + 14} textAnchor="middle" fontSize="11" fill="#f43f5e" fontWeight="bold">Diverges</text>
        )}
      </svg>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>
          <InlineMath math={`S_{${numTerms}} = ${lastS?.toFixed(6)}`} />
        </span>
        {preset.trueSum !== null && (
          <span>
            True sum: <InlineMath math={`${preset.trueSum.toFixed(6)}`} /> |{' '}
            Error: <InlineMath math={`${Math.abs((lastS ?? 0) - preset.trueSum).toFixed(6)}`} />
          </span>
        )}
      </div>
    </div>
  );
}

export default function SeriesAndConvergence() {
  return (
    <div className="space-y-8">
      <SeriesViz />

      <DefinitionBlock
        label="Definition 3.1"
        title="Infinite Series and Convergence"
        definition="Given a sequence $(a_n)$, the infinite series $\sum_{n=1}^{\infty} a_n$ is defined as the limit $\lim_{N \to \infty} S_N$ where $S_N = \sum_{n=1}^{N} a_n$ is the $N$-th partial sum. The series converges to $S$ if $S_N \to S$; otherwise it diverges."
        notation="We write $\sum_{n=1}^{\infty} a_n = S$ to mean both that the series converges and that its sum is $S$."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Absolute and Conditional Convergence"
        definition="A series $\sum a_n$ converges absolutely if $\sum |a_n|$ converges. It converges conditionally if $\sum a_n$ converges but $\sum |a_n|$ diverges. Absolute convergence implies convergence, but not vice versa."
        notation="The alternating harmonic series $\sum (-1)^{n+1}/n = \ln 2$ is conditionally but not absolutely convergent."
      />

      <DefinitionBlock
        label="Definition 3.3"
        title="Power Series"
        definition="A power series centred at $a$ is $\sum_{n=0}^{\infty} c_n (x-a)^n$. It converges for $|x - a| < R$ where $R$ is the radius of convergence, given by $1/R = \limsup_{n \to \infty} |c_n|^{1/n}$ (Hadamard's formula). At the endpoints $|x-a| = R$, convergence must be checked separately."
        notation="Common examples: $e^x = \sum x^n/n!$ (R = ∞), $\ln(1+x) = \sum (-1)^{n+1} x^n/n$ (R = 1)."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Ratio Test"
        statement="Let $\sum a_n$ be a series with $a_n \neq 0$. Let $L = \lim_{n \to \infty} |a_{n+1}/a_n|$. If $L < 1$ the series converges absolutely. If $L > 1$ (or $L = \infty$) the series diverges. If $L = 1$ the test is inconclusive."
        proof="If $L < 1$, pick $r$ with $L < r < 1$. There exists $N$ such that $|a_{n+1}/a_n| < r$ for all $n > N$. Then $|a_{N+k}| < |a_N| r^k$. The series $\sum |a_N| r^k$ is geometric with ratio $r < 1$, hence converges. By comparison, $\sum |a_n|$ converges. If $L > 1$, then $|a_n| \to \infty$, so the $n$-th term test fails. $\square$"
        corollaries={[
          'The ratio test is especially effective for series involving factorials or exponentials: $\\sum n!/n^n$, $\\sum x^n/n!$.',
          'For $\\sum x^n/n!$: $|a_{n+1}/a_n| = |x|/(n+1) \\to 0 < 1$ for all $x$, so $e^x$ converges for all $x$.',
        ]}
      />

      <TheoremBlock
        label="Theorem 3.2"
        title="Alternating Series Test (Leibniz)"
        statement="If $(b_n)$ is a decreasing sequence with $b_n \geq 0$ and $b_n \to 0$, then $\sum_{n=1}^{\infty} (-1)^{n+1} b_n$ converges. Moreover, the error after $N$ terms satisfies $|S - S_N| \leq b_{N+1}$."
        proof="The even partial sums $S_{2k}$ form an increasing sequence bounded above by $S_1$; odd partial sums $S_{2k+1}$ form a decreasing sequence. Both sequences converge by the Monotone Convergence Theorem, and they converge to the same limit since $S_{2k+1} - S_{2k} = b_{2k+1} \to 0$. $\square$"
      />

      <ExampleBlock
        title="Geometric Series and Basel Problem"
        difficulty="intermediate"
        problem="(a) Show $\sum_{n=0}^{\infty} r^n = \frac{1}{1-r}$ for $|r| < 1$. (b) State the Basel problem result."
        solution={[
          {
            step: 'Geometric series: compute partial sum',
            formula: 'S_N = \\sum_{n=0}^{N} r^n = \\frac{1 - r^{N+1}}{1 - r}',
            explanation: 'Use the identity: multiply S_N by r and subtract.',
          },
          {
            step: 'Take limit as N → ∞',
            formula: '|r| < 1 \\implies r^{N+1} \\to 0 \\implies S_N \\to \\frac{1}{1-r}',
            explanation: 'The series converges to 1/(1-r).',
          },
          {
            step: 'Example: r = 1/2',
            formula: '\\sum_{n=0}^{\\infty} \\left(\\frac{1}{2}\\right)^n = \\frac{1}{1-\\frac{1}{2}} = 2',
            explanation: 'Verified: 1 + 1/2 + 1/4 + 1/8 + ... = 2.',
          },
          {
            step: 'Basel problem (Euler, 1734)',
            formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6} \\approx 1.6449',
            explanation: 'Proved by Euler using the infinite product expansion of sin(x)/x. A celebrated result connecting series and π.',
          },
        ]}
      />

      <WarningBlock title="The Harmonic Series Diverges (Slowly!)">
        <p className="mb-2">
          The harmonic series <InlineMath math="\sum 1/n" /> diverges even though <InlineMath math="1/n \to 0" />.
          This is a crucial warning: <strong>the terms going to zero is necessary but NOT sufficient
          for convergence</strong>.
        </p>
        <p>
          Proof (Cauchy's grouping): <InlineMath math="1/2 \geq 1/2" />, {' '}
          <InlineMath math="1/3 + 1/4 \geq 1/2" />, <InlineMath math="1/5 + \cdots + 1/8 \geq 1/2" />, etc.
          Each block contributes at least 1/2, so partial sums are unbounded.
        </p>
      </WarningBlock>

      <PythonCode
        title="Series Convergence Tests — Python"
        code={`import numpy as np

def partial_sums(terms_fn, N=1000):
    ns = np.arange(1, N + 1)
    terms = np.array([terms_fn(n) for n in ns])
    return np.cumsum(terms)

# Geometric series sum(0.5^n, n=1..inf) = 1
S_geo = partial_sums(lambda n: 0.5**n)
print(f"Geometric (r=0.5): S_1000 = {S_geo[-1]:.8f}, true = 1.0")

# Basel problem: sum(1/n^2) = pi^2/6
S_bas = partial_sums(lambda n: 1/n**2)
print(f"Basel:  S_1000 = {S_bas[-1]:.8f}, pi^2/6 = {np.pi**2/6:.8f}")

# Alternating harmonic: sum((-1)^(n+1)/n) = ln(2)
S_alt = partial_sums(lambda n: (-1)**(n+1) / n)
print(f"Alt harmonic: S_1000 = {S_alt[-1]:.8f}, ln(2) = {np.log(2):.8f}")

# Ratio test applied numerically
def ratio_test(terms_fn, N=100):
    terms = [abs(terms_fn(n)) for n in range(1, N + 1)]
    ratios = [terms[i+1] / terms[i] for i in range(len(terms)-1) if terms[i] > 0]
    return ratios[-1]  # estimate of L

print(f"Ratio test on 1/n!: L ≈ {ratio_test(lambda n: 1/float(__import__('math').factorial(n))):.6f}")
`}
        runnable
      />
    </div>
  );
}
