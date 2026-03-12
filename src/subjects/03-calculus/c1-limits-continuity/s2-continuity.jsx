import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function IVTVisualizer() {
  const [fa, setFa] = useState(-1.5);
  const [fb, setFb] = useState(2.0);

  // Cubic through (0,fa) and (1,fb): f(x) = fa + (fb-fa)*x + sin(pi*x)*0.5
  const f = (x) => fa + (fb - fa) * x + 0.5 * Math.sin(Math.PI * x);
  const W = 320, H = 200;
  const xMin = -0.1, xMax = 1.1, yMin = -3, yMax = 3;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const nPts = 200;
  const pathPts = Array.from({ length: nPts + 1 }, (_, i) => {
    const x = xMin + (i / nPts) * (xMax - xMin);
    return toSvg(x, Math.max(yMin, Math.min(yMax, f(x))));
  });
  const pathD = pathPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  const faPos = fa > 0, fbPos = fb > 0;
  const ivtApplies = (faPos !== fbPos); // one positive one negative
  // Find approximate zero crossing
  let zeroCross = null;
  for (let i = 0; i < nPts; i++) {
    const x0 = xMin + (i / nPts) * (xMax - xMin);
    const x1 = xMin + ((i + 1) / nPts) * (xMax - xMin);
    if (f(x0) * f(x1) < 0) {
      zeroCross = (x0 + x1) / 2;
      break;
    }
  }

  const { sx: ax, sy: ay } = toSvg(0, fa);
  const { sx: bx, sy: by } = toSvg(1, fb);
  const zeroY = toSvg(0, 0).sy;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Intermediate Value Theorem Visualizer
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Set <InlineMath math="f(a)" /> and <InlineMath math="f(b)" /> with opposite signs to guarantee a zero.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* zero line */}
        <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke="#9ca3af" strokeWidth={1} strokeDasharray="4,3" />
        {/* function curve */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} />
        {/* endpoints */}
        <circle cx={ax} cy={ay} r={5} fill="#3b82f6" />
        <circle cx={bx} cy={by} r={5} fill="#ef4444" />
        {/* zero crossing */}
        {zeroCross !== null && (() => {
          const { sx: zx, sy: zy } = toSvg(zeroCross, 0);
          return <circle cx={zx} cy={zy} r={6} fill="#10b981" stroke="white" strokeWidth={2} />;
        })()}
        <text x={ax + 6} y={ay - 5} fontSize={10} fill="#3b82f6">f(a)={fa.toFixed(1)}</text>
        <text x={bx + 6} y={by - 5} fontSize={10} fill="#ef4444">f(b)={fb.toFixed(1)}</text>
        {zeroCross !== null && (
          <text x={toSvg(zeroCross, 0).sx + 6} y={zeroY - 5} fontSize={10} fill="#10b981">c≈{zeroCross.toFixed(2)}</text>
        )}
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-blue-600 font-mono">f(a)</span><span>{fa.toFixed(2)}</span>
          </div>
          <input type="range" min="-3" max="3" step="0.1" value={fa}
            onChange={e => setFa(parseFloat(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-red-600 font-mono">f(b)</span><span>{fb.toFixed(2)}</span>
          </div>
          <input type="range" min="-3" max="3" step="0.1" value={fb}
            onChange={e => setFb(parseFloat(e.target.value))} className="w-full accent-red-500" />
        </div>
      </div>
      <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${ivtApplies ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'}`}>
        {ivtApplies
          ? `IVT guarantees c ∈ (a,b) with f(c)=0 (green dot ≈ ${zeroCross?.toFixed(3)})`
          : 'f(a) and f(b) have the same sign — IVT does not apply (but zeros may still exist)'}
      </div>
    </div>
  );
}

export default function ContinuitySection() {
  return (
    <div className="space-y-8">
      <IVTVisualizer />

      <DefinitionBlock
        label="Definition 1.2.1"
        title="Continuity at a Point"
        definition={
          "A function $f$ is continuous at $a$ if three conditions hold: " +
          "(1) $f(a)$ is defined; " +
          "(2) $\\lim_{x \\to a} f(x)$ exists; " +
          "(3) $\\lim_{x \\to a} f(x) = f(a)$. " +
          "Equivalently (using ε-δ): for every $\\varepsilon > 0$, $\\exists \\delta > 0$ such that " +
          "$|x - a| < \\delta \\implies |f(x) - f(a)| < \\varepsilon$ (note: $x = a$ is now included)."
        }
        notation={
          "Types of discontinuities: removable (limit exists but $\\neq f(a)$), " +
          "jump ($\\lim^+ \\neq \\lim^-$), infinite (limit is $\\pm\\infty$), " +
          "and essential (limit does not exist, e.g., $\\sin(1/x)$ at 0)."
        }
      />

      <DefinitionBlock
        label="Definition 1.2.2"
        title="Uniform Continuity"
        definition={
          "A function $f: D \\to \\mathbb{R}$ is uniformly continuous on $D$ if for every $\\varepsilon > 0$, " +
          "$\\exists \\delta > 0$ (depending only on $\\varepsilon$, not on $x$) such that " +
          "for all $x, y \\in D$: $|x - y| < \\delta \\implies |f(x) - f(y)| < \\varepsilon$. " +
          "Uniform continuity is strictly stronger than pointwise continuity; " +
          "e.g., $f(x) = x^2$ is continuous on $\\mathbb{R}$ but not uniformly continuous."
        }
      />

      <TheoremBlock
        label="Theorem 1.2.1"
        title="Intermediate Value Theorem"
        statement={
          "If $f$ is continuous on $[a, b]$ and $N$ is any number strictly between $f(a)$ and $f(b)$, " +
          "then there exists $c \\in (a, b)$ such that $f(c) = N$. " +
          "In particular, if $f(a) < 0 < f(b)$ (or vice versa), then $f$ has at least one zero in $(a, b)$."
        }
        proof={
          "Assume $f(a) < N < f(b)$. Define $S = \\{x \\in [a,b] : f(x) < N\\}$. " +
          "$S$ is nonempty (contains $a$) and bounded above by $b$. Let $c = \\sup S$. " +
          "By continuity: if $f(c) < N$, then $f$ stays $< N$ near $c$ (contradicting $c = \\sup S$). " +
          "If $f(c) > N$, then $f > N$ near $c$ (contradicting $c$ being an upper bound approached by $S$). " +
          "Hence $f(c) = N$."
        }
        corollaries={[
          "Every continuous function on a closed interval $[a,b]$ attains its maximum and minimum (Extreme Value Theorem).",
          "IVT is the basis of the bisection algorithm for root-finding, with convergence rate $O((b-a)/2^n)$.",
        ]}
      />

      <ExampleBlock title="Proving a Root Exists for x³ - x - 1 = 0">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Let <InlineMath math="f(x) = x^3 - x - 1" />. Note <InlineMath math="f(1) = -1 < 0" /> and{' '}
          <InlineMath math="f(2) = 5 > 0" />. Since <InlineMath math="f" /> is a polynomial
          (hence continuous), IVT guarantees a root in <InlineMath math="(1, 2)" />.
        </p>
        <BlockMath math="f(1) = -1 < 0 < 5 = f(2) \implies \exists\, c \in (1,2): f(c) = 0" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Bisection narrows it to <InlineMath math="c \approx 1.3247" /> (the tribonacci constant).
        </p>
      </ExampleBlock>

      <WarningBlock title="Continuity Does Not Imply Differentiability">
        <p>
          The Weierstrass function <InlineMath math="f(x) = \sum_{n=0}^\infty a^n \cos(b^n \pi x)" />{' '}
          (with <InlineMath math="0 < a < 1" />, <InlineMath math="b" /> odd integer,{' '}
          <InlineMath math="ab > 1 + \frac{3}{2}\pi" />) is continuous everywhere but differentiable
          nowhere. Continuity only guarantees no jumps or gaps — the function can still be
          infinitely jagged. In ML, ReLU is continuous but not differentiable at 0.
        </p>
      </WarningBlock>

      <PythonCode
        title="Bisection Root-Finding via IVT"
        code={`import numpy as np

def bisection(f, a, b, tol=1e-10, max_iter=100):
    """Find root of f in [a,b] via bisection. Requires f(a)*f(b) < 0."""
    assert f(a) * f(b) < 0, "f(a) and f(b) must have opposite signs"
    for i in range(max_iter):
        c = (a + b) / 2
        if abs(f(c)) < tol or (b - a) / 2 < tol:
            return c, i + 1
        if f(a) * f(c) < 0:
            b = c
        else:
            a = c
    return (a + b) / 2, max_iter

# Example: x^3 - x - 1 = 0, root ≈ 1.3247
f = lambda x: x**3 - x - 1
root, iters = bisection(f, 1, 2)
print(f"Root: {root:.10f} found in {iters} iterations")
print(f"Verification: f({root:.6f}) = {f(root):.2e}")

# Check continuity numerically (modulus of continuity)
def modulus_of_continuity(f, a, b, delta, n=10000):
    """max |f(x)-f(y)| over |x-y| < delta in [a,b]."""
    xs = np.linspace(a, b, n)
    fs = f(xs)
    max_diff = 0
    for i in range(n):
        for j in range(i+1, n):
            if abs(xs[i] - xs[j]) < delta:
                max_diff = max(max_diff, abs(fs[i] - fs[j]))
    return max_diff

g = lambda x: x**2  # not uniformly continuous on R, but on [0,5]
omega = modulus_of_continuity(g, 0, 5, delta=0.1, n=200)
print(f"\\nω(x²; δ=0.1) on [0,5] ≈ {omega:.4f}")
print("(For uniform continuity, ω→0 as δ→0 uniformly in x)")`}
      />
    </div>
  );
}
