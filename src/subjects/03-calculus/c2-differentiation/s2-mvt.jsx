import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function MVTViz() {
  const [a, setA] = useState(0.5);
  const [b, setB] = useState(3.0);
  const f = (x) => x * x;
  const fPrime = (x) => 2 * x;

  // MVT guarantees c with f'(c) = (f(b)-f(a))/(b-a)
  const slope = (f(b) - f(a)) / (b - a);
  const c = slope / 2; // for f(x)=x^2, f'(c)=2c=slope => c=slope/2

  const W = 320, H = 220;
  const xMin = -0.5, xMax = 4, yMin = -1, yMax = 10;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const curvePts = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    curvePts.push(toSvg(x, f(x)));
  }
  const pathD = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  const pA = toSvg(a, f(a));
  const pB = toSvg(b, f(b));
  const pC = toSvg(c, f(c));

  // Tangent line at c: y - f(c) = slope*(x - c)
  const tangentX1 = c - 1, tangentX2 = c + 1;
  const tangentY1 = f(c) + slope * (tangentX1 - c);
  const tangentY2 = f(c) + slope * (tangentX2 - c);
  const pT1 = toSvg(tangentX1, tangentY1);
  const pT2 = toSvg(tangentX2, tangentY2);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Mean Value Theorem Visualizer: <InlineMath math="f(x) = x^2" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The tangent at <InlineMath math="c" /> (green) is parallel to the secant through{' '}
        <InlineMath math="a" /> and <InlineMath math="b" /> (red dashed).
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2} />
        <line x1={pA.sx} y1={pA.sy} x2={pB.sx} y2={pB.sy} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6,4" />
        <line x1={pT1.sx} y1={pT1.sy} x2={pT2.sx} y2={pT2.sy} stroke="#22c55e" strokeWidth={2} />
        <circle cx={pA.sx} cy={pA.sy} r={4} fill="#ef4444" />
        <circle cx={pB.sx} cy={pB.sy} r={4} fill="#ef4444" />
        <circle cx={pC.sx} cy={pC.sy} r={5} fill="#22c55e" />
        <text x={pA.sx - 5} y={pA.sy + 15} fontSize={10} fill="#ef4444">a</text>
        <text x={pB.sx + 5} y={pB.sy + 15} fontSize={10} fill="#ef4444">b</text>
        <text x={pC.sx + 7} y={pC.sy - 5} fontSize={10} fill="#22c55e">c</text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono text-red-600">a</span><span>{a.toFixed(2)}</span>
          </div>
          <input type="range" min="0" max="1.5" step="0.1" value={a}
            onChange={e => setA(parseFloat(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono text-red-600">b</span><span>{b.toFixed(2)}</span>
          </div>
          <input type="range" min="1.5" max="3.5" step="0.1" value={b}
            onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-red-500" />
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        Secant slope = {slope.toFixed(3)}, c = {c.toFixed(3)}, f&apos;(c) = {fPrime(c).toFixed(3)}
      </p>
    </div>
  );
}

export default function MVTSection() {
  return (
    <div className="space-y-8">
      <MVTViz />

      <TheoremBlock
        label="Theorem 2.2.1"
        title="Mean Value Theorem"
        statement={
          "If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then there exists $c \\in (a, b)$ such that " +
          "$f'(c) = \\frac{f(b) - f(a)}{b - a}$."
        }
        proof={
          "Define $g(x) = f(x) - \\left[f(a) + \\frac{f(b)-f(a)}{b-a}(x-a)\\right]$. " +
          "Then $g$ is continuous on $[a,b]$, differentiable on $(a,b)$, and $g(a) = g(b) = 0$. " +
          "By Rolle's Theorem, $\\exists c \\in (a,b)$ with $g'(c) = 0$, " +
          "i.e., $f'(c) - \\frac{f(b)-f(a)}{b-a} = 0$."
        }
        corollaries={[
          "If $f'(x) = 0$ for all $x \\in (a,b)$, then $f$ is constant on $[a,b]$.",
          "If $f'(x) > 0$ on $(a,b)$, then $f$ is strictly increasing on $[a,b]$.",
          "If $|f'(x)| \\leq M$ on $(a,b)$, then $|f(b) - f(a)| \\leq M|b - a|$ (Lipschitz condition).",
        ]}
      />

      <ExampleBlock
        title="Applying MVT to Bound a Function"
        difficulty="intermediate"
        problem="Use the MVT to show that $|\\sin(a) - \\sin(b)| \\leq |a - b|$ for all real $a, b$."
        solution={[
          { step: 'Apply MVT', formula: '\\sin(b) - \\sin(a) = \\cos(c)(b - a)', explanation: 'For some $c$ between $a$ and $b$.' },
          { step: 'Take absolute values', formula: '|\\sin(b) - \\sin(a)| = |\\cos(c)||b - a| \\leq |b - a|', explanation: 'Since $|\\cos(c)| \\leq 1$ always.' },
        ]}
      />

      <NoteBlock type="ai" title="MVT in Optimization">
        <p>
          The MVT underpins convergence proofs for gradient descent. If <InlineMath math="f" /> has
          Lipschitz-continuous gradients (<InlineMath math="\|{\nabla f(x) - \nabla f(y)}\| \leq L\|{x-y}\|" />),
          the MVT-derived descent lemma guarantees progress at each step with learning rate{' '}
          <InlineMath math="\eta \leq 1/L" />.
        </p>
      </NoteBlock>

      <PythonCode
        title="Verifying MVT Numerically"
        code={`import numpy as np
from scipy.optimize import brentq

# f(x) = x^3 - 2x + 1 on [0, 2]
f = lambda x: x**3 - 2*x + 1
fp = lambda x: 3*x**2 - 2

a, b = 0.0, 2.0
secant_slope = (f(b) - f(a)) / (b - a)
print(f"f(a) = {f(a)}, f(b) = {f(b)}")
print(f"Secant slope: {secant_slope:.4f}")

# Find c where f'(c) = secant_slope
g = lambda x: fp(x) - secant_slope
c = brentq(g, a, b)
print(f"MVT point c = {c:.6f}")
print(f"f'(c) = {fp(c):.6f} = secant slope: {np.isclose(fp(c), secant_slope)}")

# Lipschitz bound via MVT: |sin(a) - sin(b)| <= |a - b|
xs = np.random.uniform(-10, 10, 10000)
ys = np.random.uniform(-10, 10, 10000)
lhs = np.abs(np.sin(xs) - np.sin(ys))
rhs = np.abs(xs - ys)
print(f"\\n|sin(a)-sin(b)| <= |a-b| holds for all 10000 pairs: {np.all(lhs <= rhs + 1e-12)}")

# MVT corollary: constant derivative => linear function
x = np.linspace(0, 5, 100)
f_linear = 3*x + 2  # f'(x) = 3 everywhere
slopes = np.diff(f_linear) / np.diff(x)
print(f"All slopes equal 3: {np.allclose(slopes, 3)}")`}
      />
    </div>
  );
}
