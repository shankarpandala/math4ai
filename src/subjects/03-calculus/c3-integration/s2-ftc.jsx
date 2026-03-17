import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function FTCViz() {
  const [upperLimit, setUpperLimit] = useState(2.0);
  const f = (x) => Math.sin(x);

  const W = 340, H = 200;
  const xMin = -0.5, xMax = 5, yMin = -1.5, yMax = 1.5;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  // Accumulation function F(x) = integral from 0 to x of sin(t) dt = 1 - cos(x)
  const F = (x) => 1 - Math.cos(x);

  const curvePts = [], areaPts = [], accumPts = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    curvePts.push(toSvg(x, f(x)));
    accumPts.push(toSvg(x, F(x)));
  }
  // Shaded area from 0 to upperLimit
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * upperLimit;
    areaPts.push(toSvg(x, f(x)));
  }

  const fPath = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  const accPath = accumPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  const areaPath = areaPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ')
    + ` L${toSvg(upperLimit, 0).sx.toFixed(1)},${toSvg(upperLimit, 0).sy.toFixed(1)} L${toSvg(0, 0).sx.toFixed(1)},${toSvg(0, 0).sy.toFixed(1)} Z`;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        FTC Visualizer: <InlineMath math="F(x) = \int_0^x \sin(t)\,dt" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The shaded area under <InlineMath math="\sin(t)" /> equals <InlineMath math="F(x) = 1 - \cos(x)" />.
        Note <InlineMath math="F'(x) = \sin(x) = f(x)" />.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <line x1={0} y1={toSvg(0,0).sy} x2={W} y2={toSvg(0,0).sy} stroke="#d1d5db" strokeWidth={1} />
        <path d={areaPath} fill="rgba(99,102,241,0.2)" />
        <path d={fPath} fill="none" stroke="#3b82f6" strokeWidth={2} />
        <path d={accPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="5,3" />
        <circle cx={toSvg(upperLimit, F(upperLimit)).sx} cy={toSvg(upperLimit, F(upperLimit)).sy} r={4} fill="#ef4444" />
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>x = {upperLimit.toFixed(2)}</span>
          <span>F(x) = {F(upperLimit).toFixed(4)}</span>
        </div>
        <input type="range" min="0" max="4.5" step="0.05" value={upperLimit}
          onChange={e => setUpperLimit(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="text-blue-600 font-semibold">--- f(x) = sin(x)</span>
        <span className="text-red-500 font-semibold">- - F(x) = 1 - cos(x)</span>
      </div>
    </div>
  );
}

export default function FTCSection() {
  return (
    <div className="space-y-8">
      <FTCViz />

      <TheoremBlock
        label="Theorem 3.2.1"
        title="Fundamental Theorem of Calculus (Part I)"
        statement={
          "If $f$ is continuous on $[a, b]$ and $F(x) = \\int_a^x f(t)\\,dt$, " +
          "then $F$ is differentiable on $(a, b)$ and $F'(x) = f(x)$."
        }
        proof={
          "By definition, $F'(x) = \\lim_{h \\to 0} \\frac{F(x+h) - F(x)}{h} = \\lim_{h \\to 0} \\frac{1}{h}\\int_x^{x+h} f(t)\\,dt$. " +
          "By continuity, for $t$ between $x$ and $x+h$, $f(t)$ is close to $f(x)$. " +
          "More precisely, $f(x) - \\varepsilon < f(t) < f(x) + \\varepsilon$ for small $h$, " +
          "so $f(x) - \\varepsilon < \\frac{1}{h}\\int_x^{x+h} f(t)\\,dt < f(x) + \\varepsilon$. Hence $F'(x) = f(x)$."
        }
      />

      <TheoremBlock
        label="Theorem 3.2.2"
        title="Fundamental Theorem of Calculus (Part II)"
        statement={
          "If $f$ is continuous on $[a, b]$ and $F$ is any antiderivative of $f$ (i.e., $F' = f$), then " +
          "$\\int_a^b f(x)\\,dx = F(b) - F(a)$."
        }
        proof={
          "Let $G(x) = \\int_a^x f(t)\\,dt$. By Part I, $G'(x) = f(x) = F'(x)$, so $(F - G)' = 0$. " +
          "By the MVT, $F - G$ is constant: $F(x) = G(x) + C$. Then $F(b) - F(a) = G(b) - G(a) = G(b) - 0 = \\int_a^b f(t)\\,dt$."
        }
      />

      <ExampleBlock
        title="Using the FTC"
        difficulty="beginner"
        problem="Evaluate $\\int_0^{\\pi} \\sin(x)\\,dx$ and $\\frac{d}{dx}\\int_0^{x^2} e^{-t^2}\\,dt$."
        solution={[
          { step: 'FTC Part II', formula: '\\int_0^{\\pi} \\sin(x)\\,dx = [-\\cos(x)]_0^{\\pi} = -\\cos(\\pi) + \\cos(0) = 1 + 1 = 2',
            explanation: 'Antiderivative of $\\sin(x)$ is $-\\cos(x)$.' },
          { step: 'FTC Part I with chain rule', formula: '\\frac{d}{dx}\\int_0^{x^2} e^{-t^2}\\,dt = e^{-x^4} \\cdot 2x',
            explanation: 'Let $F(u) = \\int_0^u e^{-t^2}\\,dt$, then $\\frac{d}{dx}F(x^2) = F\'(x^2) \\cdot 2x = e^{-x^4} \\cdot 2x$.' },
        ]}
      />

      <NoteBlock type="ai" title="FTC in Machine Learning">
        <p>
          Backpropagation is essentially the chain rule applied to compositions. The FTC connects
          integration and differentiation, analogous to how the reparameterization trick in
          variational autoencoders moves derivatives through expectations (integrals).
          The score function estimator <InlineMath math="\nabla_\theta \mathbb{E}[f(x)]" /> also
          relies on differentiating under the integral sign.
        </p>
      </NoteBlock>

      <PythonCode
        title="FTC Verification in Python"
        code={`import numpy as np
from scipy import integrate

# FTC Part II: integral of sin(x) from 0 to pi
result, _ = integrate.quad(np.sin, 0, np.pi)
print(f"∫₀^π sin(x) dx = {result:.10f} (exact: 2)")

# FTC Part I: verify F'(x) = f(x) numerically
# F(x) = ∫₀ˣ t² dt = x³/3, so F'(x) = x²
def F(x):
    val, _ = integrate.quad(lambda t: t**2, 0, x)
    return val

x0 = 2.0
h = 1e-7
F_prime = (F(x0 + h) - F(x0 - h)) / (2 * h)
print(f"\\nF'({x0}) ≈ {F_prime:.8f}")
print(f"f({x0}) = {x0**2:.8f}")
print(f"FTC verified: {np.isclose(F_prime, x0**2)}")

# Accumulation function visualization data
xs = np.linspace(0, 2*np.pi, 100)
Fs = [integrate.quad(np.sin, 0, x)[0] for x in xs]
analytic = 1 - np.cos(xs)  # antiderivative
print(f"\\nMax |F_numeric - (1-cos(x))| = {max(abs(np.array(Fs) - analytic)):.2e}")

# FTC with chain rule: d/dx ∫₀^(x²) e^(-t²) dt = 2x·e^(-x⁴)
x0 = 1.5
def G(x):
    val, _ = integrate.quad(lambda t: np.exp(-t**2), 0, x**2)
    return val
G_prime = (G(x0 + h) - G(x0 - h)) / (2 * h)
exact_deriv = 2 * x0 * np.exp(-x0**4)
print(f"\\nd/dx ∫₀^(x²) e^(-t²) dt at x={x0}: {G_prime:.8f}")
print(f"2x·e^(-x⁴) = {exact_deriv:.8f}")`}
      />
    </div>
  );
}
