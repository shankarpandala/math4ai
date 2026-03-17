import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function TaylorRemainderViz() {
  const [n, setN] = useState(3);
  const f = Math.sin;

  const W = 340, H = 200;
  const xMin = -1, xMax = 6, yMin = -2, yMax = 2;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const taylorSin = (x, order) => {
    let sum = 0;
    for (let k = 0; k <= order; k++) {
      const sign = k % 2 === 0 ? 1 : -1;
      let fact = 1;
      for (let j = 1; j <= 2 * k + 1; j++) fact *= j;
      sum += sign * Math.pow(x, 2 * k + 1) / fact;
    }
    return sum;
  };

  const curvePts = [], approxPts = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    const fy = f(x);
    const ty = taylorSin(x, n);
    if (fy >= yMin && fy <= yMax) curvePts.push(toSvg(x, fy));
    const clamped = Math.max(yMin, Math.min(yMax, ty));
    approxPts.push(toSvg(x, clamped));
  }
  const fPath = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  const tPath = approxPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Taylor Approximation Quality: <InlineMath math="\sin(x)" />
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Increase the order to see how the Taylor polynomial (red) converges to <InlineMath math="\sin(x)" /> (blue).
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <line x1={0} y1={toSvg(0, 0).sy} x2={W} y2={toSvg(0, 0).sy} stroke="#d1d5db" strokeWidth={1} />
        <line x1={toSvg(0, 0).sx} y1={0} x2={toSvg(0, 0).sx} y2={H} stroke="#d1d5db" strokeWidth={1} />
        <path d={fPath} fill="none" stroke="#3b82f6" strokeWidth={2} />
        <path d={tPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="5,3" />
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span className="font-mono">Order (2n+1): {2 * n + 1} terms</span>
          <span>n = {n}</span>
        </div>
        <input type="range" min="0" max="8" step="1" value={n}
          onChange={e => setN(parseInt(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="text-blue-600 font-semibold">--- sin(x)</span>
        <span className="text-red-500 font-semibold">- - Taylor polynomial</span>
      </div>
    </div>
  );
}

export default function TaylorRemainderSection() {
  return (
    <div className="space-y-8">
      <TaylorRemainderViz />

      <TheoremBlock
        label="Theorem 2.3.1"
        title="Taylor's Theorem with Remainder"
        statement={
          "If $f$ has $n+1$ continuous derivatives on an interval containing $a$ and $x$, then " +
          "$f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x-a)^k + R_n(x)$ where the Lagrange remainder is " +
          "$R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}$ for some $\\xi$ between $a$ and $x$."
        }
        proof={
          "Define $R_n(x) = f(x) - T_n(x)$ where $T_n$ is the $n$-th Taylor polynomial. " +
          "Note $R_n(a) = R_n'(a) = \\cdots = R_n^{(n)}(a) = 0$. " +
          "Apply the generalized MVT (Cauchy's form) repeatedly to $R_n(x)/(x-a)^{n+1}$, yielding " +
          "$R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}$ for some $\\xi$ between $a$ and $x$."
        }
        corollaries={[
          "The remainder gives a rigorous error bound: $|R_n(x)| \\leq \\frac{M}{(n+1)!}|x-a|^{n+1}$ where $M = \\max|f^{(n+1)}|$.",
          "If $R_n(x) \\to 0$ as $n \\to \\infty$, the Taylor series converges to $f(x)$.",
        ]}
      />

      <DefinitionBlock
        label="Definition 2.3.1"
        title="Remainder Forms"
        definition={
          "Lagrange form: $R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}$. " +
          "Cauchy form: $R_n(x) = \\frac{f^{(n+1)}(\\xi)}{n!}(x-\\xi)^n(x-a)$. " +
          "Integral form: $R_n(x) = \\int_a^x \\frac{f^{(n+1)}(t)}{n!}(x-t)^n\\,dt$. " +
          "Each form is useful in different contexts for bounding errors."
        }
      />

      <ExampleBlock
        title="Bounding the Error of e^x Approximation"
        difficulty="intermediate"
        problem="Bound the error when approximating $e^{0.5}$ with the 3rd-degree Taylor polynomial centered at $a=0$."
        solution={[
          { step: 'Taylor polynomial', formula: 'T_3(x) = 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6}',
            explanation: 'All derivatives of $e^x$ are $e^x$.' },
          { step: 'Evaluate at x=0.5', formula: 'T_3(0.5) = 1 + 0.5 + 0.125 + 0.0208\\overline{3} = 1.6458\\overline{3}',
            explanation: 'Our approximation.' },
          { step: 'Bound the remainder', formula: '|R_3(0.5)| \\leq \\frac{e^{0.5}}{4!}(0.5)^4 < \\frac{2}{24} \\cdot 0.0625 \\approx 0.0052',
            explanation: 'Since $e^{0.5} < 2$, the error is less than $0.0052$.' },
          { step: 'Actual error', formula: '|e^{0.5} - T_3(0.5)| = |1.6487 - 1.6458| \\approx 0.0029',
            explanation: 'Well within our bound.' },
        ]}
      />

      <WarningBlock title="Convergence Is Not Guaranteed">
        <p>
          Not every infinitely differentiable function equals its Taylor series. The classic
          counterexample is <InlineMath math="f(x) = e^{-1/x^2}" /> (with <InlineMath math="f(0)=0" />):
          all derivatives at 0 are zero, so the Taylor series is identically zero, yet{' '}
          <InlineMath math="f(x) > 0" /> for <InlineMath math="x \neq 0" />. Always verify{' '}
          <InlineMath math="R_n \to 0" />.
        </p>
      </WarningBlock>

      <NoteBlock type="ai" title="Taylor Approximations in ML">
        <p>
          Second-order optimization methods (Newton, L-BFGS) use the quadratic Taylor
          approximation <InlineMath math="f(x+\delta) \approx f(x) + \nabla f \cdot \delta + \frac{1}{2}\delta^T H \delta" />.
          The quality of this approximation, controlled by the remainder term, determines the
          trust region size and convergence rate.
        </p>
      </NoteBlock>

      <PythonCode
        title="Taylor Remainder Analysis"
        code={`import numpy as np
from math import factorial

def taylor_exp(x, n, a=0):
    """n-th degree Taylor polynomial of e^x at a."""
    return sum(np.exp(a) * (x - a)**k / factorial(k) for k in range(n + 1))

def lagrange_bound(x, n, a=0, M=None):
    """Upper bound on |R_n(x)| for e^x."""
    if M is None:
        M = np.exp(max(abs(a), abs(x)))  # max of |f^(n+1)| on interval
    return M * abs(x - a)**(n + 1) / factorial(n + 1)

x = 0.5
exact = np.exp(x)

print("Order | Approx     | Error      | Bound")
print("-" * 50)
for n in range(8):
    approx = taylor_exp(x, n)
    error = abs(exact - approx)
    bound = lagrange_bound(x, n)
    print(f"  {n}   | {approx:.8f} | {error:.2e} | {bound:.2e}")

# Convergence for sin(2)
x, exact_sin = 2.0, np.sin(2.0)
for n in range(6):
    terms = sum((-1)**k * x**(2*k+1) / factorial(2*k+1) for k in range(n+1))
    print(f"sin(2) n={n}: error = {abs(exact_sin - terms):.2e}")`}
      />
    </div>
  );
}
