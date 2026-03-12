import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function TaylorViz() {
  const [degree, setDegree] = useState(3);
  const [fn, setFn] = useState('exp');

  const W = 380, H = 220;
  const xMin = -3.5, xMax = 3.5, yMin = -2.5, yMax = 6;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  // Factorial
  const fact = (n) => n <= 1 ? 1 : n * fact(n - 1);

  // Taylor coefficients at x=0 for each function
  const coefficients = {
    exp:  Array.from({ length: 12 }, (_, k) => 1 / fact(k)),
    sin:  Array.from({ length: 12 }, (_, k) => k % 2 === 0 ? 0 : (k % 4 === 1 ? 1 : -1) / fact(k)),
    cos:  Array.from({ length: 12 }, (_, k) => k % 2 !== 0 ? 0 : (k % 4 === 0 ? 1 : -1) / fact(k)),
  };

  const taylor = (x, deg) => {
    const cs = coefficients[fn];
    let sum = 0;
    for (let k = 0; k <= deg && k < cs.length; k++) sum += cs[k] * Math.pow(x, k);
    return sum;
  };

  const exact = { exp: Math.exp, sin: Math.sin, cos: Math.cos }[fn];

  const nPts = 300;
  const clamp = (y) => Math.max(yMin, Math.min(yMax, y));

  const makePath = (yfn) => {
    const pts = Array.from({ length: nPts + 1 }, (_, i) => {
      const x = xMin + (i / nPts) * (xMax - xMin);
      return toSvg(x, clamp(yfn(x)));
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  };

  const exactPath = makePath(exact);
  const taylorPath = makePath((x) => taylor(x, degree));

  const axisY = toSvg(0, 0).sy;
  const axisX = toSvg(0, 0).sx;

  const fnLabels = { exp: 'eˣ', sin: 'sin x', cos: 'cos x' };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Taylor Series Approximation
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Blue = exact function; orange = degree-<em>{degree}</em> Maclaurin polynomial. Increase degree to improve approximation.
      </p>
      <div className="mb-3 flex gap-3">
        {['exp', 'sin', 'cos'].map(f => (
          <button key={f} onClick={() => setFn(f)}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${fn === f ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {fnLabels[f]}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={0} y1={axisY} x2={W} y2={axisY} stroke="#9ca3af" strokeWidth={1} />
        <line x1={axisX} y1={0} x2={axisX} y2={H} stroke="#9ca3af" strokeWidth={1} />
        <path d={exactPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
        <path d={taylorPath} fill="none" stroke="#f97316" strokeWidth={2} strokeDasharray="5,3" />
        <circle cx={axisX} cy={toSvg(0, exact(0)).sy} r={4} fill="#3b82f6" />
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Polynomial Degree</span><span>{degree}</span>
        </div>
        <input type="range" min="0" max="11" step="1" value={degree}
          onChange={e => setDegree(parseInt(e.target.value))}
          className="w-full accent-orange-500" />
      </div>
    </div>
  );
}

export default function TaylorSection() {
  return (
    <div className="space-y-8">
      <TaylorViz />

      <DefinitionBlock
        label="Definition 2.2.1"
        title="Taylor Series"
        definition={
          "If $f$ is infinitely differentiable at $a$, its Taylor series centered at $a$ is " +
          "$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\cdots$ " +
          "When $a = 0$, this is the Maclaurin series. The $n$-th partial sum $T_n(x) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!}(x-a)^k$ " +
          "is the Taylor polynomial of degree $n$."
        }
        notation={
          "Key Maclaurin series: $e^x = \\sum_{n=0}^\\infty x^n/n!$; " +
          "$\\sin x = \\sum_{n=0}^\\infty (-1)^n x^{2n+1}/(2n+1)!$; " +
          "$\\cos x = \\sum_{n=0}^\\infty (-1)^n x^{2n}/(2n)!$; " +
          "$(1+x)^\\alpha = \\sum_{n=0}^\\infty \\binom{\\alpha}{n} x^n$ for $|x|<1$ (binomial series)."
        }
      />

      <DefinitionBlock
        label="Definition 2.2.2"
        title="Taylor Remainder"
        definition={
          "The remainder $R_n(x) = f(x) - T_n(x)$ satisfies the Lagrange form: " +
          "$R_n(x) = \\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ for some $c$ between $a$ and $x$. " +
          "This gives the bound $|R_n(x)| \\leq \\frac{M_{n+1}}{(n+1)!}|x-a|^{n+1}$ " +
          "where $M_{n+1} = \\max_{t}|f^{(n+1)}(t)|$ on the interval."
        }
      />

      <TheoremBlock
        label="Theorem 2.2.1"
        title="Taylor's Theorem with Lagrange Remainder"
        statement={
          "If $f$ is $n+1$ times differentiable on an open interval containing $a$ and $x$, then " +
          "$f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x-a)^k + R_n(x)$ " +
          "where $R_n(x) = \\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ for some $c$ strictly between $a$ and $x$."
        }
        proof={
          "Apply Cauchy's mean value theorem repeatedly (or use integration by parts $n+1$ times on the integral form). " +
          "The integral remainder $R_n(x) = \\int_a^x \\frac{(x-t)^n}{n!} f^{(n+1)}(t)\\,dt$ " +
          "combined with the mean value theorem for integrals yields the Lagrange form."
        }
        corollaries={[
          "For $e^x$: $|e^x - \\sum_{k=0}^n x^k/k!| \\leq e^{|x|} |x|^{n+1}/(n+1)! \\to 0$ for all $x$.",
          "Taylor series of a function equals the function iff $R_n(x) \\to 0$ as $n \\to \\infty$ (not guaranteed for all smooth functions).",
        ]}
      />

      <ExampleBlock title="Using Taylor Expansion for Limits">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Evaluate <InlineMath math="\lim_{x \to 0} \frac{e^x - 1 - x}{x^2}" /> using Maclaurin series.
        </p>
        <BlockMath math="e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots" />
        <BlockMath math="\frac{e^x - 1 - x}{x^2} = \frac{\frac{x^2}{2} + \frac{x^3}{6} + \cdots}{x^2} = \frac{1}{2} + \frac{x}{6} + \cdots \xrightarrow{x \to 0} \frac{1}{2}" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Taylor expansion is often more efficient than repeated L'Hôpital applications.
        </p>
      </ExampleBlock>

      <WarningBlock title="Smooth ≠ Analytic: Not All Taylor Series Converge to f">
        <p>
          The function <InlineMath math="f(x) = e^{-1/x^2}" /> (with <InlineMath math="f(0)=0" />) is infinitely
          differentiable everywhere, with <InlineMath math="f^{(n)}(0) = 0" /> for all <InlineMath math="n" />.
          Its Maclaurin series is identically 0, which does not equal <InlineMath math="f(x)" /> for{' '}
          <InlineMath math="x \neq 0" />. A function whose Taylor series converges to it is called{' '}
          <em>analytic</em> — a strictly stronger property than being smooth (<InlineMath math="C^\infty" />).
        </p>
      </WarningBlock>

      <PythonCode
        title="Taylor Series with NumPy and SymPy"
        code={`import numpy as np
import sympy as sp

# ── Symbolic Taylor series ─────────────────────────────────────────────────
x = sp.Symbol('x')

for func, name in [(sp.exp(x), 'exp'), (sp.sin(x), 'sin'), (sp.cos(x), 'cos')]:
    series = sp.series(func, x, 0, n=8)
    print(f"{name}(x) = {series}")

# ── Numerical Taylor polynomial ────────────────────────────────────────────
def taylor_poly(f_derivs_at_a, a, xs):
    """Evaluate Taylor polynomial given list of derivatives at a."""
    result = np.zeros_like(xs, dtype=float)
    for n, fn_a in enumerate(f_derivs_at_a):
        result += fn_a / np.math.factorial(n) * (xs - a) ** n
    return result

xs = np.linspace(-3, 3, 500)
# e^x at a=0: all derivatives equal 1
derivs_exp = [1.0] * 12
y_exact = np.exp(xs)
y_taylor = taylor_poly(derivs_exp, a=0, xs=xs)
max_err = np.max(np.abs(y_exact - y_taylor))
print(f"\\nDeg-11 Taylor of exp: max error on [-3,3] = {max_err:.4f}")

# ── Remainder bound ────────────────────────────────────────────────────────
def lagrange_remainder_bound(M_next, n, x, a=0):
    """Upper bound |R_n(x)| <= M_{n+1} |x-a|^{n+1} / (n+1)!"""
    return M_next * abs(x - a) ** (n + 1) / np.math.factorial(n + 1)

# For e^x on [-1,1]: M_{n+1} = e^1 ≈ 2.718
bound = lagrange_remainder_bound(np.e, n=5, x=1.0)
actual = abs(np.exp(1) - sum(1/np.math.factorial(k) for k in range(6)))
print(f"\\nRemainder bound (n=5, x=1): {bound:.6f}")
print(f"Actual remainder:            {actual:.6f}")`}
      />
    </div>
  );
}
