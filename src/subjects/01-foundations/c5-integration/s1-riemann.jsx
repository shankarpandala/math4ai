import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const FNS_R = [
  { id: 'x2', label: 'x²', fn: (x) => x * x, exact: (a, b) => (b**3 - a**3) / 3 },
  { id: 'sinx', label: 'sin x', fn: (x) => Math.sin(x), exact: (a, b) => -Math.cos(b) + Math.cos(a) },
  { id: 'sqrt', label: '√x', fn: (x) => Math.sqrt(Math.max(0, x)), exact: (a, b) => (2/3)*(b**1.5 - a**1.5) },
];

const CW = 520, CH = 180;
const PL = 44, PR = 20, PT = 16, PB = 30;

function RiemannViz() {
  const [fnId, setFnId] = useState('x2');
  const [n, setN] = useState(8);
  const [method, setMethod] = useState('left'); // 'left' | 'right' | 'mid'
  const [a] = useState(0);
  const [b] = useState(2);

  const fn = FNS_R.find((f) => f.id === fnId);
  const exact = fn.exact(a, b);

  // Partition
  const dx = (b - a) / n;
  const rects = Array.from({ length: n }, (_, i) => {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    const sampleX = method === 'left' ? x0 : method === 'right' ? x1 : (x0 + x1) / 2;
    const height = fn.fn(sampleX);
    return { x0, x1, height, sampleX };
  });
  const riemannSum = rects.reduce((s, r) => s + r.height * dx, 0);

  // Curve
  const xs = Array.from({ length: 200 }, (_, i) => a + (i / 199) * (b - a));
  const ys = xs.map(fn.fn);
  const yLo = Math.min(0, ...ys) - 0.1;
  const yHi = Math.max(...ys) + 0.3;

  const toX = (v) => PL + ((v - a) / (b - a)) * (CW - PL - PR);
  const toY = (v) => PT + (1 - (v - yLo) / (yHi - yLo)) * (CH - PT - PB);
  const polyStr = xs.map((x, i) => `${toX(x)},${toY(ys[i])}`).join(' ');
  const zero = toY(0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Riemann Sum Approximation
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Increase <InlineMath math="n" /> to see how the Riemann sum converges to the exact integral.
      </p>

      {/* Controls row */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FNS_R.map((f) => (
          <button key={f.id} onClick={() => setFnId(f.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${fnId === f.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
            {f.label}
          </button>
        ))}
        <div className="flex gap-1">
          {['left', 'right', 'mid'].map((m) => (
            <button key={m} onClick={() => setMethod(m)}
              className={`rounded-lg px-2 py-1 text-xs font-semibold capitalize transition-colors ${method === m ? 'bg-emerald-600 text-white' : 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
          n = {n} rectangles
        </label>
        <input type="range" min={1} max={60} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-indigo-500" />
      </div>

      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40 mb-3">
        {/* Rectangles */}
        {rects.map(({ x0, x1, height }, i) => (
          <rect
            key={i}
            x={toX(x0)}
            y={height >= 0 ? toY(height) : zero}
            width={Math.abs(toX(x1) - toX(x0)) - 0.5}
            height={Math.abs(toY(height) - zero)}
            fill="#6366f140"
            stroke="#6366f1"
            strokeWidth="0.5"
          />
        ))}

        {/* Axes */}
        <line x1={PL} y1={zero} x2={CW - PR} y2={zero} stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={PL} y1={PT} x2={PL} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />

        {/* Curve */}
        <polyline points={polyStr} fill="none" stroke="#6366f1" strokeWidth="2.5" />

        {/* x-axis labels */}
        {[a, (a + b) / 2, b].map((v) => (
          <text key={v} x={toX(v)} y={CH - PB + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="rounded border border-indigo-200 bg-indigo-50 p-2 dark:border-indigo-800 dark:bg-indigo-950/20">
          Riemann sum: <strong className="text-indigo-700 dark:text-indigo-300">{riemannSum.toFixed(6)}</strong>
        </div>
        <div className="rounded border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-800 dark:bg-emerald-950/20">
          Exact integral: <strong className="text-emerald-700 dark:text-emerald-300">{exact.toFixed(6)}</strong>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/20">
          Error: <strong className="text-amber-700 dark:text-amber-300">{Math.abs(riemannSum - exact).toFixed(6)}</strong>
        </div>
      </div>
    </div>
  );
}

export default function RiemannIntegral() {
  return (
    <div className="space-y-8">
      <RiemannViz />

      <DefinitionBlock
        label="Definition 1.1"
        title="Partition and Riemann Sum"
        definition="A partition of $[a,b]$ is a finite set $P = \{a = x_0 < x_1 < \cdots < x_n = b\}$. The mesh is $\|P\| = \max_i(x_i - x_{i-1})$. A Riemann sum for $f$ with partition $P$ and sample points $\xi_i \in [x_{i-1}, x_i]$ is $R(f, P) = \sum_{i=1}^{n} f(\xi_i)(x_i - x_{i-1})$."
        notation="Special cases: left Riemann sum ($\xi_i = x_{i-1}$), right ($\xi_i = x_i$), midpoint ($\xi_i = (x_{i-1}+x_i)/2$)."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Riemann Integrability"
        definition="$f: [a,b] \to \mathbb{R}$ is Riemann integrable if $\lim_{\|P\| \to 0} R(f, P)$ exists and is the same for all choices of sample points. This limit is the Riemann integral $\int_a^b f(x)\,dx$."
        notation="Equivalently (Riemann's criterion): $f$ is integrable iff for every $\varepsilon > 0$ there exists $\delta > 0$ such that $U(f,P) - L(f,P) < \varepsilon$ whenever $\|P\| < \delta$, where $U, L$ are upper/lower Darboux sums."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Continuous Functions Are Riemann Integrable"
        statement="If $f: [a,b] \to \mathbb{R}$ is continuous, then $f$ is Riemann integrable on $[a,b]$."
        proof="By the Heine-Cantor theorem, $f$ is uniformly continuous on the compact set $[a,b]$. Given $\varepsilon > 0$, pick $\delta$ so $|x-y| < \delta \Rightarrow |f(x)-f(y)| < \varepsilon/(b-a)$. For any partition $P$ with $\|P\| < \delta$, on each subinterval $[x_{i-1},x_i]$ the oscillation $\sup - \inf \leq \varepsilon/(b-a)$. Thus $U(f,P) - L(f,P) \leq \varepsilon$. By Riemann's criterion, $f$ is integrable. $\square$"
        corollaries={[
          'Monotone bounded functions are also Riemann integrable (at most countably many discontinuities).',
          'Not all bounded functions are integrable: Dirichlet\'s function $\\mathbf{1}_{\\mathbb{Q}}$ is bounded but not Riemann integrable.',
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Linearity and Additivity of the Integral"
        statement="If $f, g$ are integrable on $[a,b]$ and $c \in \mathbb{R}$: (1) $\int_a^b (cf + g) = c\int_a^b f + \int_a^b g$. (2) For any $c \in [a,b]$: $\int_a^b f = \int_a^c f + \int_c^b f$."
        proof="Both follow directly from the linearity of Riemann sums: $R(cf+g, P) = c \cdot R(f, P) + R(g, P)$, and the partition can always be refined to include $c$ without changing the limit. $\square$"
      />

      <ExampleBlock
        title="Computing ∫₀¹ x² dx from the Definition"
        difficulty="beginner"
        problem="Compute $\int_0^1 x^2\,dx$ directly using uniform partitions and right endpoints."
        solution={[
          {
            step: 'Set up uniform partition',
            formula: 'x_i = i/n, \\quad \\Delta x = 1/n',
            explanation: 'n equal subintervals of [0,1].',
          },
          {
            step: 'Write the Riemann sum with right endpoints',
            formula: 'R_n = \\sum_{i=1}^{n} f(x_i) \\Delta x = \\sum_{i=1}^{n} \\frac{i^2}{n^2} \\cdot \\frac{1}{n} = \\frac{1}{n^3} \\sum_{i=1}^{n} i^2',
            explanation: 'Using f(x) = x² and sample point i/n.',
          },
          {
            step: 'Apply the sum formula',
            formula: '\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
            explanation: 'Standard identity (provable by induction).',
          },
          {
            step: 'Take the limit',
            formula: 'R_n = \\frac{n(n+1)(2n+1)}{6n^3} \\to \\frac{2}{6} = \\frac{1}{3} \\text{ as } n \\to \\infty',
            explanation: 'The leading term is 2n³/6n³ = 1/3.',
          },
          {
            step: 'Conclusion',
            formula: '\\int_0^1 x^2\\,dx = \\frac{1}{3}',
            explanation: 'Consistent with the power rule antiderivative: x³/3 evaluated at 0 and 1. ∎',
          },
        ]}
      />

      <WarningBlock title="Riemann vs Lebesgue Integration">
        <p className="mb-2">
          The Riemann integral has limitations: it cannot handle all "reasonable" functions.
          For example, the limit of an increasing sequence of integrable functions may not be
          Riemann integrable (the Monotone Convergence Theorem fails for Riemann).
        </p>
        <p>
          In analysis and probability (and all of modern ML theory), the{' '}
          <strong>Lebesgue integral</strong> is preferred: it integrates a much larger class of
          functions and has better convergence theorems (dominated convergence, Fatou's lemma).
        </p>
      </WarningBlock>

      <PythonCode
        title="Riemann Sums — Python"
        code={`import numpy as np

def riemann_sum(f, a, b, n, method='mid'):
    dx = (b - a) / n
    if method == 'left':
        xs = np.linspace(a, b - dx, n)
    elif method == 'right':
        xs = np.linspace(a + dx, b, n)
    else:  # midpoint
        xs = np.linspace(a + dx/2, b - dx/2, n)
    return np.sum(f(xs)) * dx

f = lambda x: x**2  # exact integral = 1/3

for n in [10, 100, 1000, 10000]:
    left = riemann_sum(f, 0, 1, n, 'left')
    right = riemann_sum(f, 0, 1, n, 'right')
    mid = riemann_sum(f, 0, 1, n, 'mid')
    print(f"n={n:5d}: left={left:.7f}, right={right:.7f}, mid={mid:.7f} (exact=0.3333333)")

# scipy integration for comparison
from scipy import integrate
result, err = integrate.quad(f, 0, 1)
print(f"scipy quad: {result:.10f} ± {err:.2e}")
`}
        runnable
      />
    </div>
  );
}
