import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function EpsilonDeltaViz() {
  const [epsilon, setEpsilon] = useState(0.5);
  const [delta, setDelta] = useState(0.3);
  const L = 2; // limit value (x->1 of 2x)
  const a = 1; // limit point

  const W = 320, H = 240;
  const xMin = -0.5, xMax = 2.5, yMin = -0.5, yMax = 4.5;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    if (Math.abs(x - a) < 0.01) continue;
    pts.push(toSvg(x, 2 * x));
  }
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  const { sx: ax, sy: ay } = toSvg(a, L);
  const { sx: xLoSvg } = toSvg(a - delta, 0);
  const { sx: xHiSvg } = toSvg(a + delta, 0);
  const { sy: yLoSvg } = toSvg(0, L - epsilon);
  const { sy: yHiSvg } = toSvg(0, L + epsilon);

  const inDelta = (x) => Math.abs(x - a) < delta && Math.abs(x - a) > 0.001;
  const inEpsilon = (y) => Math.abs(y - L) < epsilon;
  const verified = Array.from({ length: 200 }, (_, i) => {
    const x = a - delta + (i / 199) * 2 * delta;
    if (Math.abs(x - a) < 0.001) return true;
    return inEpsilon(2 * x);
  }).every(Boolean);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Epsilon-Delta Visualizer: <InlineMath math="\lim_{x \to 1} 2x = 2" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag the sliders. The limit holds when every <InlineMath math="x" /> within the{' '}
        <span className="font-semibold text-blue-600">blue δ-band</span> maps into the{' '}
        <span className="font-semibold text-green-600">green ε-band</span>.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* epsilon band */}
        <rect x={0} y={yHiSvg} width={W} height={yLoSvg - yHiSvg} fill="rgba(34,197,94,0.15)" />
        {/* delta band */}
        <rect x={xLoSvg} y={0} width={xHiSvg - xLoSvg} height={H} fill="rgba(59,130,246,0.15)" />
        {/* axes */}
        <line x1={toSvg(0, yMin).sx} y1={0} x2={toSvg(0, yMin).sx} y2={H} stroke="#9ca3af" strokeWidth={1} />
        <line x1={0} y1={toSvg(0, 0).sy} x2={W} y2={toSvg(0, 0).sy} stroke="#9ca3af" strokeWidth={1} />
        {/* function */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2} />
        {/* limit point (open circle) */}
        <circle cx={ax} cy={ay} r={5} fill="white" stroke="#6366f1" strokeWidth={2} />
        {/* horizontal/vertical guide lines */}
        <line x1={0} y1={ay} x2={ax} y2={ay} stroke="#10b981" strokeWidth={1} strokeDasharray="4,3" />
        <line x1={ax} y1={H} x2={ax} y2={ay} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,3" />
        {/* labels */}
        <text x={ax + 4} y={toSvg(0, 0).sy - 4} fontSize={10} fill="#6b7280">a=1</text>
        <text x={4} y={ay - 4} fontSize={10} fill="#6b7280">L=2</text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono text-green-600">ε (epsilon)</span>
            <span>{epsilon.toFixed(2)}</span>
          </div>
          <input type="range" min="0.05" max="2" step="0.05" value={epsilon}
            onChange={e => setEpsilon(parseFloat(e.target.value))}
            className="w-full accent-green-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono text-blue-600">δ (delta)</span>
            <span>{delta.toFixed(2)}</span>
          </div>
          <input type="range" min="0.05" max="1.5" step="0.05" value={delta}
            onChange={e => setDelta(parseFloat(e.target.value))}
            className="w-full accent-blue-500" />
        </div>
      </div>
      <div className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${verified ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
        {verified
          ? `✓ For ε=${epsilon.toFixed(2)}, δ=${delta.toFixed(2)} works: |x−1|<δ ⟹ |2x−2|<ε`
          : `✗ δ=${delta.toFixed(2)} is too large for ε=${epsilon.toFixed(2)}`}
      </div>
    </div>
  );
}

export default function LimitsSection() {
  return (
    <div className="space-y-8">
      <EpsilonDeltaViz />

      <DefinitionBlock
        label="Definition 1.1.1"
        title="Limit of a Function (ε-δ)"
        definition={
          "Let $f$ be defined on an open interval containing $a$ (except possibly at $a$). " +
          "We say $\\lim_{x \\to a} f(x) = L$ if for every $\\varepsilon > 0$ there exists $\\delta > 0$ such that " +
          "$0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon$. " +
          "The key point: $f(a)$ need not be defined, and even if it is, $f(a)$ plays no role in the limit."
        }
        notation={
          "One-sided limits: $\\lim_{x \\to a^-} f(x) = L$ (left) requires $a - \\delta < x < a$; " +
          "$\\lim_{x \\to a^+} f(x) = L$ (right) requires $a < x < a + \\delta$. " +
          "The two-sided limit exists iff both one-sided limits exist and are equal."
        }
      />

      <DefinitionBlock
        label="Definition 1.1.2"
        title="Limit Laws"
        definition={
          "If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$, then: " +
          "(1) $\\lim_{x \\to a} [f(x) \\pm g(x)] = L \\pm M$; " +
          "(2) $\\lim_{x \\to a} [f(x) \\cdot g(x)] = LM$; " +
          "(3) $\\lim_{x \\to a} [f(x)/g(x)] = L/M$ provided $M \\neq 0$; " +
          "(4) $\\lim_{x \\to a} [f(x)]^n = L^n$ for positive integer $n$."
        }
      />

      <TheoremBlock
        label="Theorem 1.1.1"
        title="Squeeze Theorem"
        statement={
          "If $g(x) \\leq f(x) \\leq h(x)$ for all $x$ near $a$ (but not necessarily at $a$), " +
          "and $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$, then $\\lim_{x \\to a} f(x) = L$."
        }
        proof={
          "Given $\\varepsilon > 0$, since $\\lim g = L$, $\\exists \\delta_1 > 0$: $|x-a|<\\delta_1 \\Rightarrow |g(x)-L|<\\varepsilon$. " +
          "Similarly $\\exists \\delta_2 > 0$ for $h$. Let $\\delta = \\min(\\delta_1, \\delta_2)$. " +
          "For $0 < |x-a| < \\delta$: $L-\\varepsilon < g(x) \\leq f(x) \\leq h(x) < L+\\varepsilon$, so $|f(x)-L|<\\varepsilon$."
        }
      />

      <ExampleBlock title="Classic Squeeze: sin(x)/x as x→0">
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          We cannot substitute <InlineMath math="x=0" /> since <InlineMath math="0/0" /> is indeterminate.
          For <InlineMath math="x \in (0, \pi/2)" />, geometric argument gives{' '}
          <InlineMath math="\cos x \leq \frac{\sin x}{x} \leq 1" />.
        </p>
        <BlockMath math="\lim_{x \to 0} \cos x = 1 = \lim_{x \to 0} 1 \implies \lim_{x \to 0} \frac{\sin x}{x} = 1" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          This fundamental limit underpins the derivative of sine and all of trigonometric calculus.
        </p>
      </ExampleBlock>

      <WarningBlock title="Indeterminate Forms Are Not Values">
        <p>
          Expressions like <InlineMath math="0/0" />, <InlineMath math="\infty/\infty" />,{' '}
          <InlineMath math="0 \cdot \infty" />, <InlineMath math="\infty - \infty" /> are called{' '}
          <em>indeterminate forms</em> — they signal that more analysis is needed, not that the limit
          is undefined. For example, <InlineMath math="\lim_{x\to 0} x/x = 1" /> while{' '}
          <InlineMath math="\lim_{x\to 0} x^2/x = 0" /> — both are <InlineMath math="0/0" />{' '}
          forms with different answers. Always apply algebraic simplification, L'Hôpital's rule,
          or Taylor expansion before concluding about an indeterminate form.
        </p>
      </WarningBlock>

      <PythonCode
        title="Computing Limits Numerically and Symbolically"
        code={`import numpy as np
import sympy as sp

# ── Numerical limit via approaching sequence ──────────────────────────────
def numerical_limit(f, a, epsilon=1e-8, n=10):
    """Estimate lim_{x->a} f(x) by evaluating on a sequence approaching a."""
    xs = [a + epsilon * (0.1 ** k) for k in range(n)]
    vals = [f(x) for x in xs]
    return vals[-1]  # last value closest to a

# Classic: sin(x)/x as x -> 0
f = lambda x: np.sin(x) / x
print(f"lim sin(x)/x as x->0 ≈ {numerical_limit(f, 0):.8f}")

# ── Symbolic limits with SymPy ─────────────────────────────────────────────
x = sp.Symbol('x')

limits = [
    (sp.sin(x) / x, 0),
    ((sp.exp(x) - 1) / x, 0),
    ((1 + 1/x)**x, sp.oo),
    (x * sp.sin(1/x), 0),
]

for expr, point in limits:
    lim = sp.limit(expr, x, point)
    print(f"lim({expr}, x->{point}) = {lim}")

# ── Epsilon-delta verification ─────────────────────────────────────────────
def verify_epsilon_delta(f, L, a, epsilon, delta):
    """Check: for all x with 0 < |x-a| < delta, |f(x)-L| < epsilon."""
    xs = np.linspace(a - delta, a + delta, 10000)
    xs = xs[np.abs(xs - a) > 1e-12]  # exclude x=a
    errors = np.abs(f(xs) - L)
    return np.all(errors < epsilon), errors.max()

f_test = lambda x: 2 * x
ok, max_err = verify_epsilon_delta(f_test, L=2, a=1, epsilon=0.5, delta=0.25)
print(f"\\nε=0.5, δ=0.25 for 2x at x=1: {'✓' if ok else '✗'}, max|f-L|={max_err:.4f}")`}
      />
    </div>
  );
}
