import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// SVG Tangent Line Visualizer for y = x²
// ─────────────────────────────────────────────────────────────────────────────
const SVG_W = 480;
const SVG_H = 340;

// Domain: x ∈ [-2.5, 2.5],  y ∈ [-0.3, 6.5]
const X_MIN = -2.5;
const X_MAX = 2.5;
const Y_MIN = -0.3;
const Y_MAX = 6.5;

function toSVGx(x) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * SVG_W;
}
function toSVGy(y) {
  return SVG_H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * SVG_H;
}

// Build SVG polyline points for y = x²
function buildParabolaPoints(nPts = 200) {
  const pts = [];
  for (let i = 0; i <= nPts; i++) {
    const x = X_MIN + (i / nPts) * (X_MAX - X_MIN);
    const y = x * x;
    pts.push(`${toSVGx(x).toFixed(2)},${toSVGy(y).toFixed(2)}`);
  }
  return pts.join(' ');
}

// Tangent line at x0: y = x0² + 2x0·(x - x0)  =>  y = 2x0·x - x0²
function tangentY(x, x0) {
  return 2 * x0 * x - x0 * x0;
}

function buildTangentPoints(x0) {
  // Extend the tangent line across the full domain but clamp y to visible range
  const xL = X_MIN;
  const xR = X_MAX;
  const yL = tangentY(xL, x0);
  const yR = tangentY(xR, x0);
  // Clamp points to visible region
  const clampY = (y) => Math.max(Y_MIN - 0.5, Math.min(Y_MAX + 0.5, y));
  return `${toSVGx(xL).toFixed(2)},${toSVGy(clampY(yL)).toFixed(2)} ${toSVGx(xR).toFixed(2)},${toSVGy(clampY(yR)).toFixed(2)}`;
}

function TangentLineViz() {
  const [x0, setX0] = useState(1.0);

  const slope = 2 * x0;
  const y0 = x0 * x0;
  const px = toSVGx(x0);
  const py = toSVGy(y0);
  const parabolaPoints = useMemo(() => buildParabolaPoints(), []);
  const tangentPoints = buildTangentPoints(x0);

  // Origin in SVG coords
  const ox = toSVGx(0);
  const oy = toSVGy(0);

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100">
        Interactive: Tangent Line to <InlineMath math="f(x) = x^2" />
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Drag the slider to move the point along the parabola. The red tangent line has slope{' '}
        <InlineMath math="f'(x_0) = 2x_0" />.
      </p>

      {/* SVG */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-700">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: 'block' }}>
          {/* Grid lines */}
          {[-2, -1, 0, 1, 2].map((xg) => (
            <line
              key={`vg${xg}`}
              x1={toSVGx(xg)}
              y1={0}
              x2={toSVGx(xg)}
              y2={SVG_H}
              stroke="#374151"
              strokeWidth={0.6}
              strokeDasharray="3 4"
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((yg) => (
            <line
              key={`hg${yg}`}
              x1={0}
              y1={toSVGy(yg)}
              x2={SVG_W}
              y2={toSVGy(yg)}
              stroke="#374151"
              strokeWidth={0.6}
              strokeDasharray="3 4"
            />
          ))}

          {/* Axes */}
          <line x1={ox} y1={0} x2={ox} y2={SVG_H} stroke="#6b7280" strokeWidth={1.5} />
          <line x1={0} y1={oy} x2={SVG_W} y2={oy} stroke="#6b7280" strokeWidth={1.5} />

          {/* Axis labels */}
          <text x={SVG_W - 14} y={oy - 6} fill="#9ca3af" fontSize="12" fontFamily="serif" fontStyle="italic">x</text>
          <text x={ox + 6} y={12} fill="#9ca3af" fontSize="12" fontFamily="serif" fontStyle="italic">y</text>

          {/* Tick marks */}
          {[-2, -1, 1, 2].map((xg) => (
            <g key={`xt${xg}`}>
              <line x1={toSVGx(xg)} y1={oy - 4} x2={toSVGx(xg)} y2={oy + 4} stroke="#6b7280" strokeWidth={1} />
              <text x={toSVGx(xg) - 4} y={oy + 15} fill="#6b7280" fontSize="10" fontFamily="monospace">{xg}</text>
            </g>
          ))}
          {[1, 2, 3, 4, 5].map((yg) => (
            <g key={`yt${yg}`}>
              <line x1={ox - 4} y1={toSVGy(yg)} x2={ox + 4} y2={toSVGy(yg)} stroke="#6b7280" strokeWidth={1} />
              <text x={ox - 20} y={toSVGy(yg) + 4} fill="#6b7280" fontSize="10" fontFamily="monospace">{yg}</text>
            </g>
          ))}

          {/* Parabola y = x² */}
          <polyline
            points={parabolaPoints}
            fill="none"
            stroke="#818cf8"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* Parabola label */}
          <text x={toSVGx(1.65)} y={toSVGy(3.2)} fill="#818cf8" fontSize="12" fontFamily="serif" fontStyle="italic">
            y = x²
          </text>

          {/* Tangent line */}
          <polyline
            points={tangentPoints}
            fill="none"
            stroke="#f87171"
            strokeWidth={2}
            strokeDasharray="6 3"
            strokeOpacity={0.9}
          />

          {/* Dashed drop lines from point to axes */}
          <line
            x1={px} y1={py} x2={px} y2={oy}
            stroke="#34d399" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.6}
          />
          <line
            x1={px} y1={py} x2={ox} y2={py}
            stroke="#34d399" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.6}
          />

          {/* Point on parabola */}
          <circle cx={px} cy={py} r={7} fill="#34d399" stroke="#fff" strokeWidth={2} />
          <text
            x={px + 10}
            y={py - 8}
            fill="#34d399"
            fontSize="11"
            fontFamily="monospace"
          >
            ({x0.toFixed(2)}, {y0.toFixed(2)})
          </text>
        </svg>
      </div>

      {/* Slider */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Point <InlineMath math="x_0" />
          </label>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.05}
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="w-40 accent-indigo-500"
          />
          <span className="w-14 rounded-md bg-indigo-100 px-2 py-0.5 text-center text-xs font-mono font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {x0.toFixed(2)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-800">
            <span className="text-gray-500 dark:text-gray-400">
              <InlineMath math="f(x_0)" />:{' '}
            </span>
            <span className="font-bold text-gray-800 dark:text-gray-100">{y0.toFixed(4)}</span>
          </div>
          <div className="rounded-lg bg-red-100 px-3 py-1.5 text-xs dark:bg-red-900/30">
            <span className="text-red-600 dark:text-red-400">
              Slope <InlineMath math="f'(x_0) = 2x_0" />:{' '}
            </span>
            <span className="font-bold text-red-700 dark:text-red-300">{slope.toFixed(4)}</span>
          </div>
          {Math.abs(x0) < 0.05 && (
            <div className="rounded-lg bg-purple-100 px-3 py-1.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              At the minimum! Slope = 0
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Observe: the tangent line becomes horizontal at <InlineMath math="x_0 = 0" /> (the
        minimum). For <InlineMath math="x_0 > 0" /> the slope is positive; for{' '}
        <InlineMath math="x_0 < 0" /> it is negative.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Python code
// ─────────────────────────────────────────────────────────────────────────────
const DERIV_PYTHON_CODE = `import numpy as np
import sympy as sp
import matplotlib.pyplot as plt

# ── 1. Numerical differentiation with finite differences ──────────────────────
def numerical_derivative(f, x, h=1e-5):
    """Central difference formula: (f(x+h) - f(x-h)) / (2h)"""
    return (f(x + h) - f(x - h)) / (2 * h)

def forward_difference(f, x, h=1e-5):
    """Forward difference: (f(x+h) - f(x)) / h  — O(h) accuracy"""
    return (f(x + h) - f(x)) / h

# Test function: f(x) = x^3 * sin(x)
def f(x):
    return x**3 * np.sin(x)

# Analytical derivative via product rule: f'(x) = 3x^2 sin(x) + x^3 cos(x)
def f_prime_exact(x):
    return 3 * x**2 * np.sin(x) + x**3 * np.cos(x)

# Compare at several test points
test_points = [0.5, 1.0, 1.5, 2.0, np.pi/4]
print("Numerical vs Analytical Derivatives of f(x) = x^3 * sin(x)")
print(f"{'x':>8} | {'Numerical (central)':>22} | {'Analytical':>12} | {'Error':>12}")
print("-" * 65)
for x in test_points:
    num = numerical_derivative(f, x)
    exact = f_prime_exact(x)
    error = abs(num - exact)
    print(f"{x:>8.4f} | {num:>22.10f} | {exact:>12.10f} | {error:>12.2e}")

# ── 2. Effect of step size h on accuracy ─────────────────────────────────────
x_test = 1.0
exact = f_prime_exact(x_test)
print("\\nStep size analysis at x=1.0:")
for h in [1e-1, 1e-2, 1e-4, 1e-6, 1e-8, 1e-10, 1e-14]:
    central = (f(x_test + h) - f(x_test - h)) / (2 * h)
    forward = (f(x_test + h) - f(x_test)) / h
    print(f"h={h:.0e}: central error={abs(central-exact):.2e}, forward error={abs(forward-exact):.2e}")

# ── 3. Symbolic differentiation with SymPy ───────────────────────────────────
x = sp.Symbol('x')

# Define functions symbolically
f_sym = x**3 * sp.sin(x)
g_sym = sp.exp(-x**2) * sp.cos(3*x)
h_sym = sp.ln(x**2 + 1) / (x**2 + 1)

print("\\nSymbolic Derivatives (SymPy):")
for name, expr in [('x^3 sin(x)', f_sym), ('e^{-x^2} cos(3x)', g_sym), ('ln(x^2+1)/(x^2+1)', h_sym)]:
    deriv = sp.diff(expr, x)
    simplified = sp.simplify(deriv)
    print(f"  d/dx [{name}] = {simplified}")

# ── 4. Chain rule: derivative of composite functions ─────────────────────────
# f(g(x)) where f(u) = u^3, g(x) = sin(x)
# f'(g(x)) * g'(x) = 3*sin^2(x)*cos(x)
u = sp.Symbol('u')
f_outer = u**3
g_inner = sp.sin(x)
composite = f_outer.subs(u, g_inner)
deriv_chain = sp.diff(composite, x)
print(f"\\nChain rule: d/dx [sin^3(x)] = {sp.simplify(deriv_chain)}")

# ── 5. Higher-order derivatives ───────────────────────────────────────────────
f_sym2 = x**5 - 3*x**3 + x
print("\\nHigher-order derivatives of f(x) = x^5 - 3x^3 + x:")
for n in range(1, 6):
    dn = sp.diff(f_sym2, x, n)
    print(f"  f^({n})(x) = {dn}")

# ── 6. Visualise tangent lines ────────────────────────────────────────────────
xs = np.linspace(-2, 2, 400)
ys = xs**2

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(xs, ys, 'b-', linewidth=2.5, label=r'$f(x) = x^2$')

for x0, color in zip([-1.5, -0.5, 0.5, 1.5], ['red', 'green', 'orange', 'purple']):
    slope = 2 * x0
    y0 = x0**2
    tangent = slope * (xs - x0) + y0
    ax.plot(xs, tangent, '--', color=color, linewidth=1.5,
            label=rf"Tangent at $x_0={x0}$, slope={slope}")
    ax.scatter([x0], [y0], color=color, s=60, zorder=5)

ax.set_xlim(-2.2, 2.2); ax.set_ylim(-0.5, 5)
ax.set_xlabel('x'); ax.set_ylabel('y')
ax.set_title('Tangent Lines to $f(x) = x^2$')
ax.legend(fontsize=8); ax.grid(True, alpha=0.3)
plt.tight_layout(); plt.show()
`;

// ─────────────────────────────────────────────────────────────────────────────
// References
// ─────────────────────────────────────────────────────────────────────────────
const DERIV_REFERENCES = [
  {
    authors: 'Newton, I.',
    year: 1687,
    title: 'Philosophiæ Naturalis Principia Mathematica',
    venue: 'Royal Society, London',
    type: 'foundational',
    whyImportant:
      'Newton developed the method of fluxions (calculus) as a tool for mechanics. His notation and the priority dispute with Leibniz shaped the development of analysis.',
  },
  {
    authors: 'Leibniz, G. W.',
    year: 1684,
    title: 'Nova Methodus pro Maximis et Minimis',
    venue: 'Acta Eruditorum',
    type: 'foundational',
    whyImportant:
      "Leibniz's independent discovery of calculus gave us the dy/dx notation still used today, as well as the product and chain rules in explicit form.",
  },
  {
    authors: 'Cauchy, A.-L.',
    year: 1821,
    title: 'Cours d\'Analyse',
    venue: 'École Polytechnique, Paris',
    type: 'foundational',
    whyImportant:
      'Cauchy placed calculus on rigorous footing using the epsilon-delta definition of limits, giving the derivative its modern precise meaning.',
  },
  {
    authors: 'Spivak, M.',
    year: 2008,
    title: 'Calculus (4th ed.)',
    venue: 'Publish or Perish',
    type: 'textbook',
    whyImportant:
      'The gold-standard rigorous calculus textbook, presenting limits, derivatives, and integrals with complete proofs accessible to undergraduates.',
  },
  {
    authors: 'Goodfellow, I., Bengio, Y., & Courville, A.',
    year: 2016,
    title: 'Deep Learning',
    venue: 'MIT Press',
    url: 'https://www.deeplearningbook.org',
    type: 'textbook',
    whyImportant:
      'Chapter 6 covers the chain rule and its application to backpropagation — the connection between calculus derivatives and neural network training.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main section component
// ─────────────────────────────────────────────────────────────────────────────
export default function DerivativesSection() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Title */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
          Chapter 2 · Differentiation
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          §1 — Derivatives &amp; Differentiation Rules
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          The derivative measures instantaneous rate of change — and underpins everything from
          classical mechanics to the backpropagation algorithm powering modern deep learning.
        </p>
      </div>

      {/* 1. Historical note */}
      <NoteBlock type="historical" title="Historical Context — The Calculus War">
        <p>
          In the late 17th century, two mathematical giants independently invented calculus.{' '}
          <strong>Isaac Newton</strong> developed his "method of fluxions" around 1666 to solve
          problems in mechanics and optics, but published late. <strong>Gottfried Wilhelm
          Leibniz</strong> independently developed calculus by 1675 and published first in
          1684, giving us the <em>dy/dx</em> notation and the integral sign{' '}
          <InlineMath math="\int" /> still in use today. The ensuing{' '}
          <strong>priority dispute</strong> — which degenerated into a bitter nationalistic
          controversy — divided European mathematics for generations. The verdict of history:
          both invented calculus independently, but Leibniz's notation won, and{' '}
          <strong>Cauchy</strong> (1821) gave the derivative its rigorous epsilon-delta
          foundation.
        </p>
      </NoteBlock>

      {/* 2. Intuition */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Intuition: Slope of the Tangent Line
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The derivative answers: <em>how fast is <InlineMath math="f(x)" /> changing at the
          point <InlineMath math="x" />?</em> Geometrically, it is the slope of the{' '}
          <strong>tangent line</strong> to the graph. We approximate this by the slope of a
          secant line through two nearby points and let the gap shrink to zero:
        </p>
        <BlockMath math="\text{secant slope} = \frac{f(x+h) - f(x)}{h} \xrightarrow{h \to 0} f'(x)" />
      </section>

      {/* 3. Interactive tangent line visualizer */}
      <TangentLineViz />

      {/* 4. Definition: derivative as limit */}
      <DefinitionBlock
        label="Definition 2.1"
        title="The Derivative"
        definition="Let $f : \mathbb{R} \to \mathbb{R}$ be a function. The derivative of $f$ at $x$, denoted $f'(x)$ or $\dfrac{df}{dx}$, is defined by the limit $f'(x) = \lim_{h \to 0} \dfrac{f(x+h) - f(x)}{h}$ provided this limit exists. When it does, $f$ is called differentiable at $x$. If $f$ is differentiable at every point in its domain, $f$ is called differentiable."
        notation="Alternative notations: $f'(x)$, $\dfrac{df}{dx}$, $Df(x)$, $\dot{f}$ (Newton's fluxion notation for time derivatives)."
      />

      {/* 5. Differentiation rules theorem */}
      <TheoremBlock
        label="Theorem 2.1"
        title="Differentiation Rules"
        statement="Let $f$ and $g$ be differentiable functions and $c \in \mathbb{R}$ a constant. Then:
(1) Constant: $(c)' = 0$.
(2) Power: $(x^n)' = nx^{n-1}$ for $n \in \mathbb{R}$.
(3) Sum: $(f + g)' = f' + g'$.
(4) Constant multiple: $(cf)' = c f'$.
(5) Product rule: $(fg)' = f'g + fg'$.
(6) Quotient rule: $\left(\dfrac{f}{g}\right)' = \dfrac{f'g - fg'}{g^2}$ (where $g \neq 0$).
(7) Chain rule: $(f \circ g)'(x) = f'(g(x)) \cdot g'(x)$."
        proof="We prove the Product Rule from the limit definition. Let $F(x) = f(x)g(x)$. Then:
$F'(x) = \lim_{h\to 0} \frac{f(x+h)g(x+h) - f(x)g(x)}{h}$.
Add and subtract $f(x)g(x+h)$ in the numerator:
$= \lim_{h\to 0} \frac{[f(x+h)-f(x)]g(x+h) + f(x)[g(x+h)-g(x)]}{h}$.
Split the limit (valid since both pieces converge):
$= \lim_{h\to 0}\frac{f(x+h)-f(x)}{h}\cdot\lim_{h\to 0}g(x+h) + f(x)\cdot\lim_{h\to 0}\frac{g(x+h)-g(x)}{h}$.
Since $g$ is differentiable it is continuous, so $\lim_{h\to 0}g(x+h)=g(x)$. Hence $F'(x) = f'(x)g(x) + f(x)g'(x)$. $\square$"
        corollaries={[
          "The product rule generalises: $(f_1 f_2 \\cdots f_n)' = \\sum_{k=1}^n f_k' \\prod_{j \\neq k} f_j$.",
          "The quotient rule follows from the product rule applied to $f \\cdot g^{-1}$ combined with the chain rule.",
        ]}
      />

      {/* 6. Higher-order derivatives */}
      <DefinitionBlock
        label="Definition 2.2"
        title="Higher-Order Derivatives"
        definition="The $n$-th derivative of $f$, denoted $f^{(n)}(x)$ or $\dfrac{d^n f}{dx^n}$, is defined recursively: $f^{(0)} = f$, $f^{(1)} = f'$, and $f^{(n)} = (f^{(n-1)})'$ for $n \geq 2$. The second derivative $f''(x)$ measures the rate of change of the slope — i.e., the concavity of $f$."
        notation="$f''(x) > 0$: concave up (like a bowl). $f''(x) < 0$: concave down (like a hill). $f''(x) = 0$ at inflection points."
      />

      {/* 7. Product rule example */}
      <ExampleBlock
        title="Differentiating f(x) = x³·sin(x) using the Product Rule"
        difficulty="intermediate"
        problem="Find the derivative of $f(x) = x^3 \sin(x)$ and evaluate $f'(\pi/2)$."
        solution={[
          {
            step: 'Identify the two factors',
            formula: 'u(x) = x^3, \quad v(x) = \sin(x)',
            explanation: 'We apply the product rule $(uv)^\prime = u^\prime v + u v^\prime$.',
          },
          {
            step: 'Compute the individual derivatives',
            formula: "u'(x) = 3x^2 \\quad \\text{(power rule)}, \\qquad v'(x) = \\cos(x)",
            explanation: 'Standard derivatives: power rule for $x^3$, known derivative of sine.',
          },
          {
            step: 'Apply the product rule',
            formula: "f'(x) = u'(x)v(x) + u(x)v'(x) = 3x^2 \\sin(x) + x^3 \\cos(x)",
            explanation: 'Substituting into $(uv)\' = u\'v + uv\'$.',
          },
          {
            step: 'Factor the result (optional)',
            formula: "f'(x) = x^2\\bigl(3\\sin(x) + x\\cos(x)\\bigr)",
            explanation: 'Factor out $x^2$ for a cleaner form. This is the final answer.',
          },
          {
            step: 'Evaluate at $x = \\pi/2$',
            formula: "f'\\!\\left(\\frac{\\pi}{2}\\right) = \\left(\\frac{\\pi}{2}\\right)^{\\!2}\\!\\left(3\\sin\\frac{\\pi}{2} + \\frac{\\pi}{2}\\cos\\frac{\\pi}{2}\\right) = \\frac{\\pi^2}{4}\\left(3 \\cdot 1 + \\frac{\\pi}{2} \\cdot 0\\right) = \\frac{3\\pi^2}{4}",
            explanation: 'Using $\\sin(\\pi/2) = 1$ and $\\cos(\\pi/2) = 0$. Final answer: $f\'(\\pi/2) = 3\\pi^2/4 \\approx 7.402$.',
          },
        ]}
      />

      {/* 8. Warning: common mistakes */}
      <WarningBlock title="Common Derivative Mistakes">
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
              1. Derivative of a product ≠ product of derivatives
            </p>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-900/20">
              <BlockMath math="\underbrace{(fg)'}_{\text{correct}} = f'g + fg' \qquad \underbrace{(fg)' \neq f' \cdot g'}_{\text{WRONG}}" />
              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                Counterexample: <InlineMath math="f = g = x" />. Left: <InlineMath math="(x^2)' = 2x" />.
                Right (wrong): <InlineMath math="1 \cdot 1 = 1 \neq 2x" />.
              </p>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
              2. Forgetting the chain rule for composite functions
            </p>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-900/20">
              <BlockMath math="\frac{d}{dx}\sin(x^2) = \cos(x^2) \cdot 2x \quad \text{NOT} \quad \cos(x^2)" />
              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                Always multiply by the derivative of the inner function.
              </p>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
              3. Differentiating at a point of non-differentiability
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <InlineMath math="|x|" /> is not differentiable at <InlineMath math="x = 0" />
              (the left and right limits of the difference quotient differ). In neural
              networks, ReLU <InlineMath math="= \max(0, x)" /> has a subgradient at 0, handled
              by subgradient methods.
            </p>
          </div>
        </div>
      </WarningBlock>

      {/* 9. Chain Rule theorem — crucial for backprop */}
      <TheoremBlock
        label="Theorem 2.2"
        title="Chain Rule — Foundation of Backpropagation"
        statement="If $g$ is differentiable at $x$ and $f$ is differentiable at $g(x)$, then the composite function $h = f \circ g$ is differentiable at $x$ and $h'(x) = f'(g(x)) \cdot g'(x).$ In Leibniz notation: $\dfrac{dh}{dx} = \dfrac{df}{dg} \cdot \dfrac{dg}{dx}.$ For a chain $y = f_n \circ f_{n-1} \circ \cdots \circ f_1(x)$: $\dfrac{dy}{dx} = \dfrac{\partial f_n}{\partial f_{n-1}} \cdot \dfrac{\partial f_{n-1}}{\partial f_{n-2}} \cdots \dfrac{\partial f_1}{\partial x}.$"
        proof="Let $u = g(x)$ and define $\epsilon(k) = \frac{f(u+k) - f(u)}{k} - f'(u)$ for $k \neq 0$, with $\epsilon(0) = 0$. By differentiability of $f$, $\lim_{k\to 0}\epsilon(k) = 0$, so $f(u+k) - f(u) = [f'(u) + \epsilon(k)]k$. Setting $k = g(x+h) - g(x)$:
$\frac{h(x+h)-h(x)}{h} = \frac{f(g(x+h))-f(g(x))}{h} = [f'(g(x)) + \epsilon(k)] \cdot \frac{g(x+h)-g(x)}{h}$.
As $h \to 0$: $k \to 0$ (since $g$ is continuous), so $\epsilon(k) \to 0$, and $\frac{g(x+h)-g(x)}{h} \to g'(x)$. Therefore $h'(x) = f'(g(x)) \cdot g'(x)$. $\square$"
        corollaries={[
          "Backpropagation in neural networks is precisely the chain rule applied recursively through layers: $\\frac{\\partial L}{\\partial w_k} = \\frac{\\partial L}{\\partial a_n} \\cdot \\frac{\\partial a_n}{\\partial a_{n-1}} \\cdots \\frac{\\partial a_{k+1}}{\\partial a_k} \\cdot \\frac{\\partial a_k}{\\partial w_k}$.",
          "In multiple dimensions, the chain rule becomes the Jacobian product: $D(f \\circ g)(x) = Df(g(x)) \\cdot Dg(x)$.",
          "Automatic differentiation (autograd in PyTorch/JAX) implements the chain rule exactly via a computation graph.",
        ]}
      />

      {/* 10. Python code */}
      <PythonCode
        code={DERIV_PYTHON_CODE}
        title="Numerical & Symbolic Differentiation — NumPy & SymPy"
        runnable
      />

      {/* References */}
      <ReferenceList references={DERIV_REFERENCES} />
    </div>
  );
}
