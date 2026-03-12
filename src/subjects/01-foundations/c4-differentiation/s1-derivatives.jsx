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
  { id: 'x2', label: 'x²', fn: (x) => x * x, dfn: (x) => 2 * x },
  { id: 'x3', label: 'x³', fn: (x) => x * x * x, dfn: (x) => 3 * x * x },
  { id: 'sinx', label: 'sin x', fn: (x) => Math.sin(x), dfn: (x) => Math.cos(x) },
  { id: 'ex', label: 'eˣ', fn: (x) => Math.exp(x), dfn: (x) => Math.exp(x) },
];

const CW = 520, CH = 200;
const PL = 44, PR = 20, PT = 16, PB = 30;

function DerivativeViz() {
  const [fnId, setFnId] = useState('x2');
  const [a, setA] = useState(0.8);
  const [h, setH] = useState(0.5);

  const fn = FNS.find((f) => f.id === fnId);
  const xLo = -2, xHi = 2;

  const fa = fn.fn(a);
  const fah = fn.fn(a + h);
  const secantSlope = (fah - fa) / h;
  const tangentSlope = fn.dfn(a);

  const xs = Array.from({ length: 200 }, (_, i) => xLo + (i / 199) * (xHi - xLo));
  const ys = xs.map(fn.fn);
  const yVals = ys.filter((y) => isFinite(y));
  const yLo = Math.max(Math.min(...yVals) - 0.5, -6);
  const yHi = Math.min(Math.max(...yVals) + 0.5, 6);

  const toX = (v) => PL + ((v - xLo) / (xHi - xLo)) * (CW - PL - PR);
  const toY = (v) => {
    const clamped = Math.max(yLo, Math.min(yHi, v));
    return PT + (1 - (clamped - yLo) / (yHi - yLo)) * (CH - PT - PB);
  };

  const polyStr = xs.map((x, i) => `${toX(x)},${toY(ys[i])}`).join(' ');

  // Secant line through (a, fa) and (a+h, fa+h)
  const secLine = [-2, 2].map((x) => `${toX(x)},${toY(fa + secantSlope * (x - a))}`).join(' ');
  // Tangent line
  const tanLine = [-2, 2].map((x) => `${toX(x)},${toY(fa + tangentSlope * (x - a))}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Tangent Line &amp; Limit Definition Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        As <InlineMath math="h \to 0" />, the secant slope approaches the tangent slope = <InlineMath math="f'(a)" />.
      </p>

      {/* Function selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FNS.map((f) => (
          <button key={f.id} onClick={() => setFnId(f.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${fnId === f.id ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40 mb-4">
        {/* Axes */}
        <line x1={PL} y1={CH - PB} x2={CW - PR} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />
        <line x1={PL} y1={PT} x2={PL} y2={CH - PB} stroke="#94a3b8" strokeWidth="1" />

        {/* Zero line */}
        {toY(0) > PT && toY(0) < CH - PB && (
          <line x1={PL} y1={toY(0)} x2={CW - PR} y2={toY(0)} stroke="#e2e8f0" strokeWidth="1" />
        )}

        {/* Function */}
        <polyline points={polyStr} fill="none" stroke="#6366f1" strokeWidth="2.5" />

        {/* Secant line */}
        <polyline points={secLine} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3" />

        {/* Tangent line */}
        <polyline points={tanLine} fill="none" stroke="#10b981" strokeWidth="2" />

        {/* Points: a and a+h */}
        <circle cx={toX(a)} cy={toY(fa)} r="5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
        <circle cx={toX(a + h)} cy={toY(fah)} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />

        {/* h bracket on x-axis */}
        <line x1={toX(a)} y1={CH - PB + 4} x2={toX(a + h)} y2={CH - PB + 4} stroke="#f59e0b" strokeWidth="2" />

        <text x={toX(a)} y={CH - PB + 16} textAnchor="middle" fontSize="9" fill="#6366f1">a</text>
        <text x={toX(a + h)} y={CH - PB + 16} textAnchor="middle" fontSize="9" fill="#f59e0b">a+h</text>
      </svg>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">a = {a.toFixed(2)}</label>
          <input type="range" min={-1.5} max={1.5} step={0.05} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">h = {h.toFixed(3)}</label>
          <input type="range" min={0.01} max={1.5} step={0.01} value={h} onChange={(e) => setH(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
        <div className="rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/20">
          Secant slope: <strong className="text-amber-700 dark:text-amber-300">{secantSlope.toFixed(5)}</strong>
        </div>
        <div className="rounded border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-800 dark:bg-emerald-950/20">
          True f'(a): <strong className="text-emerald-700 dark:text-emerald-300">{tangentSlope.toFixed(5)}</strong>
        </div>
      </div>
    </div>
  );
}

export default function DerivativesAndRules() {
  return (
    <div className="space-y-8">
      <DerivativeViz />

      <DefinitionBlock
        label="Definition 1.1"
        title="Derivative (Limit Definition)"
        definition="The derivative of $f$ at $a$ is $f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$, provided the limit exists. If $f'(a)$ exists, $f$ is differentiable at $a$. Geometrically, $f'(a)$ is the slope of the tangent line to $y = f(x)$ at $x = a$."
        notation="Also written $\frac{df}{dx}\big|_{x=a}$, $Df(a)$, or $\dot{f}(a)$. The function $x \mapsto f'(x)$ is the derivative function."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Differentiability Implies Continuity"
        definition="If $f$ is differentiable at $a$, then $f$ is continuous at $a$. The converse is false: $|x|$ is continuous at 0 but not differentiable there."
        notation="Differentiability is a stronger condition than continuity. $C^k$ denotes functions with $k$ continuous derivatives."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Differentiation Rules"
        statement="For differentiable functions $f, g$ and constant $c$: (1) Linearity: $(cf + g)' = cf' + g'$. (2) Product rule: $(fg)' = f'g + fg'$. (3) Quotient rule: $(f/g)' = (f'g - fg')/g^2$ (where $g \neq 0$). (4) Chain rule: $(f \circ g)'(x) = f'(g(x)) \cdot g'(x)$."
        proof="Product rule: $\lim_{h\to0}\frac{f(x+h)g(x+h)-f(x)g(x)}{h} = \lim_{h\to0}\frac{[f(x+h)-f(x)]g(x+h)+f(x)[g(x+h)-g(x)]}{h}$. As $h\to0$, $g(x+h)\to g(x)$ (by continuity), giving $f'(x)g(x)+f(x)g'(x)$. Chain rule follows similarly from substitution $u = g(x+h) - g(x)$. $\square$"
        corollaries={[
          'Power rule (special case): $(x^n)\\' = nx^{n-1}$ for any $n \\in \\mathbb{R}$.',
          "Reciprocal rule: $(1/g)' = -g'/g^2$ (quotient rule with $f=1$).",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Mean Value Theorem"
        statement="If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there exists $c \in (a,b)$ with $f'(c) = \frac{f(b)-f(a)}{b-a}$."
        proof="Apply Rolle's Theorem to $g(x) = f(x) - \frac{f(b)-f(a)}{b-a}(x-a)$. Note $g(a) = f(a)$ and $g(b) = f(a)$, so $g(a) = g(b)$. By Rolle's Theorem (which itself follows from EVT), there exists $c$ with $g'(c) = 0$, giving $f'(c) = \frac{f(b)-f(a)}{b-a}$. $\square$"
        corollaries={[
          'If $f\\' = 0$ on $(a,b)$ then $f$ is constant on $[a,b]$.',
          "L'Hôpital's rule for $0/0$ and $\\infty/\\infty$ indeterminate forms follows from MVT.",
        ]}
      />

      <ExampleBlock
        title="Chain Rule Applied to Neural Network Layer"
        difficulty="beginner"
        problem="Given $f(x) = \sigma(wx + b)$ where $\sigma(z) = 1/(1+e^{-z})$, compute $df/dw$."
        solution={[
          {
            step: 'Identify the composition',
            formula: 'f = \\sigma \\circ g, \\quad g(w) = wx + b',
            explanation: 'Outer function σ, inner function g(w) = wx + b.',
          },
          {
            step: 'Derivative of g with respect to w',
            formula: 'g\'(w) = x',
            explanation: 'Linear in w, so derivative is x.',
          },
          {
            step: "Derivative of sigmoid σ'(z)",
            formula: "\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))",
            explanation: 'A standard result; differentiating 1/(1+e^{-z}) by the chain rule.',
          },
          {
            step: 'Apply chain rule',
            formula: '\\frac{df}{dw} = \\sigma\'(wx+b) \\cdot x = \\sigma(wx+b)(1-\\sigma(wx+b)) \\cdot x',
            explanation: 'This is the gradient used in backpropagation for a single neuron.',
          },
        ]}
      />

      <WarningBlock title="Differentiable ≠ Continuously Differentiable">
        <p className="mb-2">
          A function can be differentiable everywhere yet have a derivative that is not continuous.
          Volterra's construction gives a differentiable <InlineMath math="f" /> with <InlineMath math="f'" />
          bounded but not Riemann integrable.
        </p>
        <p>
          In practice, when we say "differentiable" in calculus we usually mean
          <InlineMath math="C^1" /> (continuously differentiable). Be careful when working with
          non-smooth functions in optimisation — subgradients and weak derivatives may be needed.
        </p>
      </WarningBlock>

      <PythonCode
        title="Numerical Differentiation — Python"
        code={`import numpy as np

def numerical_deriv(f, x, h=1e-5):
    """Central difference approximation."""
    return (f(x + h) - f(x - h)) / (2 * h)

# Test on known functions
import math
funcs = [
    (math.sin, math.cos, "sin(x)"),
    (math.exp, math.exp, "exp(x)"),
    (lambda x: x**3, lambda x: 3*x**2, "x^3"),
]
a = 1.2
for f, df, name in funcs:
    num = numerical_deriv(f, a)
    exact = df(a)
    print(f"{name}: numerical={num:.8f}, exact={exact:.8f}, error={abs(num-exact):.2e}")

# Demonstrate limit definition: secant slope → tangent
f = lambda x: x**2
a = 1.0
hs = [0.5, 0.1, 0.01, 0.001, 1e-6]
for h in hs:
    slope = (f(a+h) - f(a)) / h
    print(f"h={h:.0e}: secant slope = {slope:.8f}  (exact f'(1) = 2)")
`}
        runnable
      />
    </div>
  );
}
