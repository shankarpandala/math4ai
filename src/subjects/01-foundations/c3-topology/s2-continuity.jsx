import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const FNS = [
  { id: 'x2', label: 'x²', fn: (x) => x * x, continuous: true },
  { id: 'abs', label: '|x|', fn: (x) => Math.abs(x), continuous: true },
  { id: 'step', label: 'step (disc.)', fn: (x) => (x >= 0 ? 1 : 0), continuous: false },
  { id: 'sinx', label: 'sin(x)', fn: (x) => Math.sin(x), continuous: true },
];

const CW = 520, CH = 180;
const PL = 40, PR = 20, PT = 16, PB = 28;

function ContinuityViz() {
  const [fnId, setFnId] = useState('x2');
  const [a, setA] = useState(0.5);
  const [delta, setDelta] = useState(0.3);
  const [epsilon, setEpsilon] = useState(0.6);

  const fn = FNS.find((f) => f.id === fnId);
  const fa = fn.fn(a);

  const xLo = -2, xHi = 2;
  const xs = Array.from({ length: 300 }, (_, i) => xLo + (i / 299) * (xHi - xLo));
  const ys = xs.map(fn.fn);
  const yLo = Math.min(...ys) - 0.3;
  const yHi = Math.max(...ys) + 0.3;

  const toX = (v) => PL + ((v - xLo) / (xHi - xLo)) * (CW - PL - PR);
  const toY = (v) => PT + (1 - (v - yLo) / (yHi - yLo)) * (CH - PT - PB);

  // Check epsilon-delta: for all x in (a-delta, a+delta), |f(x)-f(a)| < epsilon
  const testXs = Array.from({ length: 50 }, (_, i) => a - delta + (i / 49) * 2 * delta);
  const violations = testXs.filter((x) => Math.abs(fn.fn(x) - fa) >= epsilon).length;
  const epsDeltaWorks = violations === 0;

  const polyStr = xs.map((x, i) => `${toX(x)},${toY(ys[i])}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Epsilon-Delta Continuity Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Drag <InlineMath math="\delta" /> (input) and <InlineMath math="\varepsilon" /> (output) to explore the continuity condition at point <InlineMath math="a" />.
      </p>

      {/* Function selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FNS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFnId(f.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              fnId === f.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            {f.label}
            {!f.continuous && <span className="ml-1 text-rose-400">⚠</span>}
          </button>
        ))}
      </div>

      {/* SVG */}
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40 mb-4">
        {/* ε band on y-axis */}
        <rect
          x={PL}
          y={toY(fa + epsilon)}
          width={CW - PL - PR}
          height={Math.abs(toY(fa - epsilon) - toY(fa + epsilon))}
          fill="#10b98118"
        />
        {/* δ band on x-axis */}
        <rect
          x={toX(a - delta)}
          y={PT}
          width={Math.abs(toX(a + delta) - toX(a - delta))}
          height={CH - PT - PB}
          fill="#6366f118"
        />

        {/* Axes */}
        <line x1={PL} y1={CH - PB} x2={CW - PR} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />
        <line x1={PL} y1={PT} x2={PL} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />

        {/* ε lines */}
        <line x1={PL} y1={toY(fa + epsilon)} x2={CW - PR} y2={toY(fa + epsilon)} stroke="#10b981" strokeWidth="1" strokeDasharray="4,2" />
        <line x1={PL} y1={toY(fa - epsilon)} x2={CW - PR} y2={toY(fa - epsilon)} stroke="#10b981" strokeWidth="1" strokeDasharray="4,2" />

        {/* Function curve */}
        <polyline points={polyStr} fill="none" stroke="#6366f1" strokeWidth="2" />

        {/* Point a */}
        <circle cx={toX(a)} cy={toY(fa)} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
        <line x1={toX(a)} y1={toY(fa)} x2={toX(a)} y2={CH - PB} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
        <line x1={PL} y1={toY(fa)} x2={toX(a)} y2={toY(fa)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />

        <text x={toX(a)} y={CH - PB + 14} textAnchor="middle" fontSize="9" fill="#f59e0b">a</text>
        <text x={PL - 4} y={toY(fa) + 4} textAnchor="end" fontSize="9" fill="#f59e0b">f(a)</text>
      </svg>

      {/* Sliders */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">a = {a.toFixed(2)}</label>
          <input type="range" min={-1.5} max={1.5} step={0.05} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"><InlineMath math={`\\delta = ${delta.toFixed(2)}`} /></label>
          <input type="range" min={0.05} max={1} step={0.05} value={delta} onChange={(e) => setDelta(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"><InlineMath math={`\\varepsilon = ${epsilon.toFixed(2)}`} /></label>
          <input type="range" min={0.05} max={1.5} step={0.05} value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
      </div>

      <div className={`mt-3 rounded-lg border px-4 py-2 text-sm font-semibold ${epsDeltaWorks ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300' : 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/20 dark:text-rose-300'}`}>
        {epsDeltaWorks
          ? `✓ For this δ and ε, the condition holds at a = ${a.toFixed(2)}`
          : `✗ Some x in (a-δ, a+δ) maps outside the ε-band (${violations} violation${violations > 1 ? 's' : ''})`}
      </div>
    </div>
  );
}

export default function ContinuityAndHomeomorphisms() {
  return (
    <div className="space-y-8">
      <ContinuityViz />

      <DefinitionBlock
        label="Definition 2.1"
        title="Continuity at a Point (ε-δ)"
        definition="Let $(X, d_X)$ and $(Y, d_Y)$ be metric spaces, $f: X \to Y$, $a \in X$. $f$ is continuous at $a$ if for every $\varepsilon > 0$ there exists $\delta > 0$ such that $d_X(x, a) < \delta \Rightarrow d_Y(f(x), f(a)) < \varepsilon$. $f$ is continuous if it is continuous at every point."
        notation="Topological characterisation: $f$ is continuous iff the preimage of every open set is open — $f^{-1}(V)$ is open whenever $V \subseteq Y$ is open."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Uniform Continuity"
        definition="$f: X \to Y$ is uniformly continuous if for every $\varepsilon > 0$ there exists $\delta > 0$ (depending only on $\varepsilon$, not on $x$) such that for all $x_1, x_2 \in X$: $d_X(x_1, x_2) < \delta \Rightarrow d_Y(f(x_1), f(x_2)) < \varepsilon$."
        notation="Uniform continuity implies continuity, but not conversely. $f(x) = 1/x$ is continuous but not uniformly continuous on $(0,1)$."
      />

      <DefinitionBlock
        label="Definition 2.3"
        title="Homeomorphism"
        definition="A homeomorphism between topological spaces $X$ and $Y$ is a bijection $f: X \to Y$ such that both $f$ and $f^{-1}$ are continuous. Two spaces are topologically equivalent (homeomorphic) if a homeomorphism between them exists, written $X \cong Y$."
        notation="Homeomorphic spaces share all topological properties: connectedness, compactness, number of holes, etc. A coffee mug is homeomorphic to a donut (both have one hole)."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Intermediate Value Theorem"
        statement="Let $f: [a,b] \to \mathbb{R}$ be continuous. If $f(a) < c < f(b)$ (or $f(b) < c < f(a)$), then there exists $x \in (a,b)$ with $f(x) = c$. In other words, continuous functions on intervals take all intermediate values."
        proof="Define $S = \{t \in [a,b] : f(t) \leq c\}$. $S$ is non-empty (contains $a$) and bounded above. Let $x = \sup S$. By continuity of $f$ at $x$, and properties of the supremum, one shows $f(x) = c$: if $f(x) < c$, a neighbourhood around $x$ maps below $c$, contradicting $x = \sup S$; if $f(x) > c$, a neighbourhood maps above $c$, contradicting $x$ being an upper bound of $S$. $\square$"
        corollaries={[
          'Every continuous $f: [a,b] \\to \\mathbb{R}$ attains its maximum and minimum (Extreme Value Theorem).',
          'IVT is equivalent to the connectedness of $[a,b]$: the continuous image of a connected set is connected.',
        ]}
      />

      <ExampleBlock
        title="Showing a Function is NOT Continuous"
        difficulty="intermediate"
        problem="Prove that $f(x) = \lfloor x \rfloor$ (floor function) is not continuous at $x = 1$ using the ε-δ definition."
        solution={[
          {
            step: 'Note f(1) = 1',
            formula: 'f(1) = \\lfloor 1 \\rfloor = 1',
            explanation: 'The function value at the point.',
          },
          {
            step: 'Choose ε = 1/2',
            formula: '\\varepsilon = 1/2',
            explanation: 'We will show no δ > 0 satisfies the ε-δ condition for this ε.',
          },
          {
            step: 'For any δ > 0, consider x = 1 - δ/2',
            formula: '|x - 1| = \\delta/2 < \\delta, \\quad f(x) = \\lfloor 1 - \\delta/2 \\rfloor = 0',
            explanation: 'So |f(x) - f(1)| = |0 - 1| = 1 ≥ ε = 1/2.',
          },
          {
            step: 'Conclusion',
            formula: '\\nexists\\, \\delta > 0 \\text{ s.t. } |x-1| < \\delta \\Rightarrow |f(x)-1| < 1/2',
            explanation: 'f is not continuous at x = 1. ∎',
          },
        ]}
      />

      <WarningBlock title="Continuous ≠ Uniformly Continuous">
        <p className="mb-2">
          <InlineMath math="f(x) = x^2" /> is continuous on <InlineMath math="\mathbb{R}" /> but NOT
          uniformly continuous: near large <InlineMath math="x" />, a tiny <InlineMath math="\delta" />
          -change causes a large change in <InlineMath math="f" />.
          Formally: for <InlineMath math="\varepsilon = 1" />, no single <InlineMath math="\delta" />
          works for all <InlineMath math="x" />.
        </p>
        <p>
          However, on a closed bounded interval like <InlineMath math="[0, 10]" />, every continuous
          function IS uniformly continuous (Heine-Cantor theorem).
        </p>
      </WarningBlock>

      <PythonCode
        title="Continuity Verification — Python"
        code={`import numpy as np

def check_continuity(f, a, epsilon, delta, n_test=1000):
    """Check epsilon-delta condition numerically."""
    xs = np.linspace(a - delta, a + delta, n_test)
    fa = f(a)
    violations = np.sum(np.abs(f(xs) - fa) >= epsilon)
    return violations == 0, violations

# f(x) = x^2 at a=1, epsilon=0.5, delta=0.2
f_sq = np.vectorize(lambda x: x**2)
ok, v = check_continuity(f_sq, 1.0, 0.5, 0.2)
print(f"x^2 continuous at a=1 (eps=0.5, delta=0.2): {ok}, violations={v}")

# floor function at a=1 — discontinuous
f_fl = np.vectorize(lambda x: float(int(x)) if x >= 0 else float(int(x) - 1))
ok2, v2 = check_continuity(f_fl, 1.0, 0.5, 0.1)
print(f"floor(x) continuous at a=1 (eps=0.5, delta=0.1): {ok2}, violations={v2}")

# Verify IVT: x^3 - x - 2 = 0 has root in [1,2]
g = lambda x: x**3 - x - 2
print(f"g(1)={g(1):.2f}, g(2)={g(2):.2f} -> root exists in [1,2] by IVT")
# Bisection
lo, hi = 1.0, 2.0
for _ in range(50): mid = (lo+hi)/2; (lo if g(mid) < 0 else hi); hi = mid if g(mid) > 0 else hi; lo = mid if g(mid) < 0 else lo
print(f"Root ≈ {(lo+hi)/2:.8f}")
`}
        runnable
      />
    </div>
  );
}
