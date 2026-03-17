import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function RiemannSumViz() {
  const [numRects, setNumRects] = useState(8);
  const [sumType, setSumType] = useState('left');
  const f = (x) => x * x;
  const a = 0, b = 2;

  const W = 320, H = 200;
  const xMin = -0.3, xMax = 2.5, yMin = -0.3, yMax = 4.5;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const dx = (b - a) / numRects;
  let riemannSum = 0;
  const rects = [];
  for (let i = 0; i < numRects; i++) {
    const xl = a + i * dx;
    const xr = a + (i + 1) * dx;
    const sampleX = sumType === 'left' ? xl : sumType === 'right' ? xr : (xl + xr) / 2;
    const height = f(sampleX);
    riemannSum += height * dx;
    const topLeft = toSvg(xl, height);
    const botRight = toSvg(xr, 0);
    rects.push({ x: topLeft.sx, y: topLeft.sy, w: botRight.sx - topLeft.sx, h: botRight.sy - topLeft.sy });
  }

  const curvePts = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    if (x >= xMin) curvePts.push(toSvg(x, f(x)));
  }
  const pathD = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  const exact = 8 / 3;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Riemann Sum Visualizer: <InlineMath math="\int_0^2 x^2\,dx" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Increase rectangles to see convergence. Exact value = {exact.toFixed(4)}.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {['left', 'right', 'midpoint'].map(t => (
          <button key={t} onClick={() => setSumType(t)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              sumType === t ? 'bg-indigo-600 text-white' : 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h}
            fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth={0.5} />
        ))}
        <path d={pathD} fill="none" stroke="#ef4444" strokeWidth={2} />
        <line x1={0} y1={toSvg(0,0).sy} x2={W} y2={toSvg(0,0).sy} stroke="#9ca3af" strokeWidth={1} />
        <line x1={toSvg(0,0).sx} y1={0} x2={toSvg(0,0).sx} y2={H} stroke="#9ca3af" strokeWidth={1} />
      </svg>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Rectangles: {numRects}</span>
          <span>Sum = {riemannSum.toFixed(4)}, Error = {Math.abs(riemannSum - exact).toFixed(4)}</span>
        </div>
        <input type="range" min="2" max="50" step="1" value={numRects}
          onChange={e => setNumRects(parseInt(e.target.value))} className="w-full accent-indigo-500" />
      </div>
    </div>
  );
}

export default function RiemannSection() {
  return (
    <div className="space-y-8">
      <RiemannSumViz />

      <DefinitionBlock
        label="Definition 3.1.1"
        title="Riemann Sum"
        definition={
          "For a function $f$ on $[a,b]$, a partition $P = \\{x_0, x_1, \\ldots, x_n\\}$ with $a = x_0 < x_1 < \\cdots < x_n = b$, " +
          "and sample points $c_i \\in [x_{i-1}, x_i]$, the Riemann sum is " +
          "$S(f, P) = \\sum_{i=1}^{n} f(c_i)\\,\\Delta x_i$ where $\\Delta x_i = x_i - x_{i-1}$."
        }
      />

      <DefinitionBlock
        label="Definition 3.1.2"
        title="Riemann Integral"
        definition={
          "The Riemann integral $\\int_a^b f(x)\\,dx = L$ if for every $\\varepsilon > 0$ there exists $\\delta > 0$ " +
          "such that for every partition $P$ with $\\|P\\| < \\delta$ (mesh size) and any choice of sample points, " +
          "$|S(f,P) - L| < \\varepsilon$."
        }
      />

      <TheoremBlock
        label="Theorem 3.1.1"
        title="Integrability of Continuous Functions"
        statement="If $f$ is continuous on $[a, b]$, then $f$ is Riemann integrable on $[a, b]$."
        proof={
          "Continuous functions on closed intervals are uniformly continuous: for each $\\varepsilon > 0$, " +
          "$\\exists \\delta$ such that $|x - y| < \\delta \\Rightarrow |f(x) - f(y)| < \\varepsilon/(b-a)$. " +
          "Then for any partition with mesh $< \\delta$, the upper and lower sums differ by less than $\\varepsilon$."
        }
      />

      <ExampleBlock
        title="Computing a Riemann Integral from Definition"
        difficulty="intermediate"
        problem="Compute $\\int_0^1 x^2\\,dx$ using the limit of right Riemann sums."
        solution={[
          { step: 'Set up the sum', formula: 'S_n = \\sum_{i=1}^{n} \\left(\\frac{i}{n}\\right)^2 \\cdot \\frac{1}{n} = \\frac{1}{n^3}\\sum_{i=1}^{n} i^2',
            explanation: 'Uniform partition with $\\Delta x = 1/n$, right endpoints $c_i = i/n$.' },
          { step: 'Use the sum formula', formula: '\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
            explanation: 'Standard identity.' },
          { step: 'Take the limit', formula: '\\lim_{n \\to \\infty} \\frac{n(n+1)(2n+1)}{6n^3} = \\lim_{n \\to \\infty} \\frac{2n^3 + 3n^2 + n}{6n^3} = \\frac{1}{3}',
            explanation: 'The integral equals $1/3$.' },
        ]}
      />

      <PythonCode
        title="Riemann Sums in Python"
        code={`import numpy as np

def riemann_sum(f, a, b, n, method='left'):
    x = np.linspace(a, b, n + 1)
    dx = (b - a) / n
    if method == 'left':
        return np.sum(f(x[:-1])) * dx
    elif method == 'right':
        return np.sum(f(x[1:])) * dx
    else:  # midpoint
        mids = (x[:-1] + x[1:]) / 2
        return np.sum(f(mids)) * dx

f = lambda x: x**2
exact = 8 / 3  # integral of x^2 from 0 to 2

print("n     | Left     | Right    | Midpoint | Best Error")
print("-" * 58)
for n in [4, 10, 50, 100, 1000]:
    L = riemann_sum(f, 0, 2, n, 'left')
    R = riemann_sum(f, 0, 2, n, 'right')
    M = riemann_sum(f, 0, 2, n, 'midpoint')
    best = min(abs(L-exact), abs(R-exact), abs(M-exact))
    print(f"{n:5d} | {L:.6f} | {R:.6f} | {M:.6f} | {best:.2e}")

# Convergence rate analysis
ns = np.array([10, 20, 50, 100, 200, 500])
errors_mid = [abs(riemann_sum(f, 0, 2, n, 'midpoint') - exact) for n in ns]
print(f"\\nMidpoint rule convergence rate:")
for i in range(1, len(ns)):
    rate = np.log(errors_mid[i-1]/errors_mid[i]) / np.log(ns[i]/ns[i-1])
    print(f"  n={ns[i]}: rate ≈ {rate:.2f}")  # should be ~2`}
      />
    </div>
  );
}
