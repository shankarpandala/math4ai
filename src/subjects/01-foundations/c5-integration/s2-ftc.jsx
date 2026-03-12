import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const FNS_FTC = [
  { id: 'x2', label: 'f(x) = x²', fn: (x) => x * x, antideriv: (x) => x**3 / 3 },
  { id: 'cosx', label: 'f(x) = cos x', fn: (x) => Math.cos(x), antideriv: (x) => Math.sin(x) },
  { id: 'ex', label: 'f(x) = eˣ', fn: (x) => Math.exp(x), antideriv: (x) => Math.exp(x) },
];

const CW = 520, CH = 180;
const PL = 48, PR = 20, PT = 16, PB = 30;

function FTCViz() {
  const [fnId, setFnId] = useState('x2');
  const [xVal, setXVal] = useState(1.2);
  const [a] = useState(0);

  const fn = FNS_FTC.find((f) => f.id === fnId);
  const xLo = a, xHi = 2.5;

  const xs = Array.from({ length: 200 }, (_, i) => xLo + (i / 199) * (xHi - xLo));
  const ys = xs.map(fn.fn);
  const yLo = Math.min(0, ...ys) - 0.1;
  const yHi = Math.max(...ys) + 0.4;

  const toX = (v) => PL + ((v - xLo) / (xHi - xLo)) * (CW - PL - PR);
  const toY = (v) => PT + (1 - (Math.max(yLo, Math.min(yHi, v)) - yLo) / (yHi - yLo)) * (CH - PT - PB);
  const zero = toY(0);

  const polyStr = xs.map((x, i) => `${toX(x)},${toY(ys[i])}`).join(' ');

  // Shaded area from a to xVal
  const areaXs = Array.from({ length: 80 }, (_, i) => a + (i / 79) * (xVal - a));
  const areaPath = [
    `M ${toX(a)},${zero}`,
    ...areaXs.map((x) => `L ${toX(x)},${toY(fn.fn(x))}`),
    `L ${toX(xVal)},${zero}`,
    'Z',
  ].join(' ');

  const Fx = fn.antideriv(xVal) - fn.antideriv(a);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Area Accumulation Function Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        The accumulation function <InlineMath math="F(x) = \int_0^x f(t)\,dt" /> is an antiderivative of <InlineMath math="f" />.
        Move <InlineMath math="x" /> to see the accumulated area.
      </p>

      {/* Function selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FNS_FTC.map((f) => (
          <button key={f.id} onClick={() => setFnId(f.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${fnId === f.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40 mb-4">
        {/* Shaded area */}
        <path d={areaPath} fill="#6366f130" />

        {/* Axes */}
        <line x1={PL} y1={zero} x2={CW - PR} y2={zero} stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={PL} y1={PT} x2={PL} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />

        {/* Curve */}
        <polyline points={polyStr} fill="none" stroke="#6366f1" strokeWidth="2.5" />

        {/* Vertical line at x */}
        <line x1={toX(xVal)} y1={toY(fn.fn(xVal))} x2={toX(xVal)} y2={zero} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
        <circle cx={toX(xVal)} cy={toY(fn.fn(xVal))} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />

        {/* x-axis labels */}
        {[0, 0.5, 1, 1.5, 2, 2.5].map((v) => (
          <text key={v} x={toX(v)} y={CH - PB + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>
        ))}

        {/* x label */}
        <text x={toX(xVal)} y={zero + 20} textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold">x</text>

        {/* F(x) label */}
        <text x={toX(xVal / 2)} y={toY(fn.fn(xVal / 2)) - 6} textAnchor="middle" fontSize="9" fill="#6366f1">
          F(x) = {Fx.toFixed(4)}
        </text>
      </svg>

      <div className="mb-2">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
          x = {xVal.toFixed(2)}
        </label>
        <input type="range" min={0.01} max={2.4} step={0.01} value={xVal} onChange={(e) => setXVal(Number(e.target.value))} className="w-full accent-amber-500" />
      </div>

      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm dark:border-indigo-800 dark:bg-indigo-950/20">
        <InlineMath math={`F(${xVal.toFixed(2)}) = \\int_0^{${xVal.toFixed(2)}} f(t)\\,dt = ${Fx.toFixed(6)}`} />
        {' '}and{' '}
        <InlineMath math={`F'(x) = f(x) = ${fn.fn(xVal).toFixed(6)}`} />
      </div>
    </div>
  );
}

export default function FundamentalTheoremOfCalculus() {
  return (
    <div className="space-y-8">
      <FTCViz />

      <DefinitionBlock
        label="Definition 2.1"
        title="Antiderivative"
        definition="A function $F: [a,b] \to \mathbb{R}$ is an antiderivative of $f$ on $[a,b]$ if $F'(x) = f(x)$ for all $x \in (a,b)$. If $F$ is one antiderivative, then every antiderivative has the form $F(x) + C$ for a constant $C \in \mathbb{R}$."
        notation="$\int f(x)\,dx = F(x) + C$ denotes the general antiderivative (indefinite integral)."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Accumulation Function"
        definition="Given an integrable function $f$ on $[a, b]$, the accumulation function is $F(x) = \int_a^x f(t)\,dt$ for $x \in [a,b]$. The FTC (Part 1) says this is an antiderivative of $f$ when $f$ is continuous."
        notation="$F$ measures the signed area under $f$ from $a$ to $x$. FTC bridges the two fundamental operations of calculus: differentiation and integration."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Fundamental Theorem of Calculus — Part 1"
        statement="If $f$ is continuous on $[a,b]$ and $F(x) = \int_a^x f(t)\,dt$, then $F$ is differentiable on $(a,b)$ and $F'(x) = f(x)$."
        proof="Fix $x \in (a,b)$ and compute $\frac{F(x+h)-F(x)}{h} = \frac{1}{h}\int_x^{x+h} f(t)\,dt$. By the mean value theorem for integrals, this equals $f(c_h)$ for some $c_h \in [x, x+h]$. As $h \to 0$, $c_h \to x$, and by continuity $f(c_h) \to f(x)$. Hence $F'(x) = f(x)$. $\square$"
        corollaries={[
          'Every continuous function has an antiderivative (namely $F(x) = \\int_a^x f(t)\\,dt$).',
          "$\\frac{d}{dx}\\int_a^{g(x)} f(t)\\,dt = f(g(x)) \\cdot g'(x)$ by the chain rule.",
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Fundamental Theorem of Calculus — Part 2 (Evaluation Theorem)"
        statement="If $f$ is integrable on $[a,b]$ and $F$ is any antiderivative of $f$ (i.e., $F' = f$ on $(a,b)$), then $\int_a^b f(x)\,dx = F(b) - F(a)$."
        proof="Partition $[a,b]$ uniformly and apply the MVT to $F$ on each subinterval $[x_{i-1}, x_i]$: there exists $\xi_i$ with $F(x_i) - F(x_{i-1}) = F'(\xi_i)(x_i - x_{i-1}) = f(\xi_i)\Delta x$. Summing, $F(b) - F(a) = \sum_i f(\xi_i)\Delta x$, a Riemann sum. Taking $n \to \infty$ (mesh $\to 0$), the right side converges to $\int_a^b f$. $\square$"
        corollaries={[
          'Standard notation: $\\int_a^b f(x)\\,dx = [F(x)]_a^b = F(b) - F(a)$.',
          'Integration by parts: $\\int_a^b u\\,dv = [uv]_a^b - \\int_a^b v\\,du$ follows from the product rule and FTC.',
        ]}
      />

      <ExampleBlock
        title="Using FTC Part 1 with Chain Rule"
        difficulty="beginner"
        problem="Compute $\frac{d}{dx}\int_1^{x^3} e^{-t^2}\,dt$."
        solution={[
          {
            step: 'Let G(u) = ∫₁ᵘ e^{-t²} dt, so the expression is G(x³)',
            formula: '\\frac{d}{dx} G(x^3) = G\'(x^3) \\cdot \\frac{d}{dx}(x^3)',
            explanation: 'Chain rule: differentiate the outer function G, then multiply by the derivative of x³.',
          },
          {
            step: 'Apply FTC Part 1 to find G\'',
            formula: 'G\'(u) = e^{-u^2}',
            explanation: 'By FTC Part 1, the derivative of ∫₁ᵘ e^{-t²} dt with respect to u is the integrand evaluated at u.',
          },
          {
            step: 'Combine',
            formula: '\\frac{d}{dx}\\int_1^{x^3} e^{-t^2}\\,dt = e^{-(x^3)^2} \\cdot 3x^2 = 3x^2 e^{-x^6}',
            explanation: 'Final answer.',
          },
        ]}
      />

      <WarningBlock title="FTC Requires Continuity (or at Least Integrability)">
        <p className="mb-2">
          FTC Part 1 requires <InlineMath math="f" /> to be continuous at the point where you
          differentiate. If <InlineMath math="f" /> has a jump discontinuity at <InlineMath math="x_0" />,
          then <InlineMath math="F(x) = \int_a^x f(t)\,dt" /> is still continuous at <InlineMath math="x_0" />
          but generally not differentiable there.
        </p>
        <p>
          Also: do not confuse FTC with simply "differentiating inside the integral" — the limits
          of integration must be handled carefully when they depend on the variable.
        </p>
      </WarningBlock>

      <PythonCode
        title="Fundamental Theorem of Calculus — Python"
        code={`import numpy as np
from scipy import integrate

# FTC Part 2: evaluate integral using antiderivative
def ftc_part2(f, F, a, b):
    """Uses antiderivative F."""
    return F(b) - F(a)

# Test: int_0^pi sin(x) dx = [-cos(x)]_0^pi = 2
val = ftc_part2(np.sin, lambda x: -np.cos(x), 0, np.pi)
print(f"int_0^pi sin(x) dx = {val:.10f}  (exact = 2)")

# Verify FTC Part 1: derivative of F(x) = int_0^x t^2 dt equals x^2
# Numerically approximate F'(x) = (F(x+h)-F(x))/h
F = lambda x: integrate.quad(lambda t: t**2, 0, x)[0]
x0 = 1.5
h = 1e-6
deriv_F = (F(x0 + h) - F(x0)) / h
print(f"F'({x0}) ≈ {deriv_F:.8f},  f({x0}) = {x0**2:.8f}  (should match)")

# FTC Part 1 with chain rule: d/dx int_1^(x^3) exp(-t^2) dt
from scipy.misc import derivative
G = lambda x: integrate.quad(lambda t: np.exp(-t**2), 1, x**3)[0]
dG = derivative(G, 0.8, dx=1e-6)
exact = 3 * 0.8**2 * np.exp(-0.8**6)
print(f"d/dx at x=0.8: numerical={dG:.8f}, exact={exact:.8f}")
`}
        runnable
      />
    </div>
  );
}
