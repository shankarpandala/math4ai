import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// f(x) = x^2 / 2; f*(y) = y^2 / 2
// Tangent at x0 has slope y (=f'(x0)=x0): tangent line is y*x - f(x0) = y*x0 - x0^2/2
function fquad(x) { return x * x / 2; }
function tangentLine(x0, xval) {
  // line: y = f'(x0)(xval - x0) + f(x0) = x0*xval - x0^2/2
  return x0 * xval - x0 * x0 / 2;
}

function InteractiveLegendre() {
  const [slope, setSlope] = useState(1.0);

  const W = 400, H = 260, pad = 35;
  const xmin = -2.5, xmax = 2.5, ymin = -2, ymax = 4;

  function toSvg(x, y) {
    return {
      sx: pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad),
      sy: H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad),
    };
  }

  const nPts = 120;
  const curvePts = Array.from({ length: nPts }, (_, i) => {
    const x = xmin + (i / (nPts - 1)) * (xmax - xmin);
    const { sx, sy } = toSvg(x, fquad(x));
    return `${sx},${sy}`;
  }).join(' ');

  // For slope y, tangent touches f at x0 = y (since f'(x)=x => x0=y)
  const x0 = slope;
  const tangentPts = Array.from({ length: 80 }, (_, i) => {
    const x = xmin + (i / 79) * (xmax - xmin);
    const y = tangentLine(x0, x);
    if (y < ymin - 1 || y > ymax + 1) return null;
    const { sx, sy } = toSvg(x, y);
    return `${sx},${sy}`;
  }).filter(Boolean).join(' ');

  // The conjugate value: f*(y) = sup_x (y*x - f(x)) = y^2/2
  const fstar = slope * slope / 2;
  const touchPt = toSvg(x0, fquad(x0));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Legendre–Fenchel Transform</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        For <InlineMath math="f(x)=\tfrac{1}{2}x^2" />, the conjugate <InlineMath math="f^*(y) = \sup_x\{yx - f(x)\}" />.
        The supremum is achieved at the tangent point where slope = <InlineMath math="y" />.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#9ca3af" strokeWidth="1" />
          <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#9ca3af" strokeWidth="1" />
          <polyline points={curvePts} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          {tangentPts && <polyline points={tangentPts} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5,3" />}
          <circle cx={touchPt.sx} cy={touchPt.sy} r="6" fill="#ef4444" />
          <text x={touchPt.sx + 8} y={touchPt.sy - 6} fontSize="11" fill="#7f1d1d">tangent point</text>
          {/* f*(y) annotation */}
          {(() => {
            const yint = toSvg(0, -fstar);
            return (
              <>
                <circle cx={yint.sx} cy={yint.sy} r="5" fill="#8b5cf6" />
                <text x={yint.sx + 8} y={yint.sy + 4} fontSize="10" fill="#5b21b6">−f*(y)</text>
              </>
            );
          })()}
          <text x={W - pad - 50} y={pad + 14} fontSize="11" fill="#1d4ed8">f(x)=x²/2</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slope <InlineMath math={`y = ${slope.toFixed(2)}`} />
            </label>
            <input type="range" min="-2.2" max="2.2" step="0.05" value={slope} onChange={e => setSlope(+e.target.value)} className="w-full" />
          </div>
          <div className="rounded bg-purple-50 dark:bg-purple-900/30 px-3 py-2 text-sm">
            <p className="font-semibold text-purple-800 dark:text-purple-200">Conjugate value</p>
            <p className="text-purple-700 dark:text-purple-300"><InlineMath math={`f^*(${slope.toFixed(2)}) = \\frac{y^2}{2} = ${fstar.toFixed(3)}`} /></p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Yellow: tangent line with slope y<br />
            Red: point where tangent touches curve<br />
            Purple: y-intercept = −f*(y)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConjugateFunctions() {
  return (
    <div className="space-y-8">
      <InteractiveLegendre />

      <DefinitionBlock title="Conjugate (Legendre–Fenchel Transform)">
        <p>
          The <strong>conjugate</strong> (or Legendre–Fenchel transform) of a function
          <InlineMath math="f : \mathbb{R}^n \to \mathbb{R} \cup \{+\infty\}" /> is
        </p>
        <BlockMath math="f^*(y) = \sup_{x \in \operatorname{dom} f}\left\{ y^\top x - f(x) \right\}." />
        <p className="mt-2">
          The conjugate <InlineMath math="f^*" /> is always convex (as a pointwise supremum of affine functions),
          regardless of whether <InlineMath math="f" /> is convex.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Biconjugate and Fenchel Duality">
        <p>The <strong>biconjugate</strong> <InlineMath math="f^{**}" /> satisfies:</p>
        <BlockMath math="f^{**}(x) = \sup_{y}\left\{ x^\top y - f^*(y) \right\} \leq f(x)." />
        <p className="mt-2">
          For a closed convex function, <InlineMath math="f^{**} = f" /> (the biconjugate recovers the function).
          <strong> Fenchel's inequality</strong> states:
        </p>
        <BlockMath math="f(x) + f^*(y) \geq x^\top y \quad \forall\, x, y." />
      </DefinitionBlock>

      <DefinitionBlock title="Subgradient via Conjugate">
        <p>
          The supremum in <InlineMath math="f^*(y) = \sup_x\{y^\top x - f(x)\}" /> is achieved at
          <InlineMath math="x^*" /> iff <InlineMath math="y \in \partial f(x^*)" />, which is equivalent to
          <InlineMath math="x^* \in \partial f^*(y)" />. This gives the conjugate subgradient relationship:
        </p>
        <BlockMath math="y \in \partial f(x) \iff x \in \partial f^*(y) \iff f(x) + f^*(y) = x^\top y." />
      </DefinitionBlock>

      <TheoremBlock
        title="Conjugate Examples"
        proof="For f(x) = x²/2: f*(y) = sup_x{yx - x²/2}. Taking derivative: y - x = 0, so x* = y, giving f*(y) = y²/2 - y²/2 = y²/2. For f(x) = ||x||: f*(y) = 0 if ||y|| ≤ 1, else +∞, i.e., the indicator of the unit ball. This follows since sup_x{y⊤x - ||x||} = 0 when ||y|| ≤ 1 (achieved at x=0) and +∞ otherwise."
      >
        <p>Key conjugate pairs appearing in optimization:</p>
        <BlockMath math="\begin{aligned} f(x) &= \tfrac{1}{2}\|x\|^2 & &\Rightarrow & f^*(y) &= \tfrac{1}{2}\|y\|^2 \\ f(x) &= \|x\|_1 & &\Rightarrow & f^*(y) &= \delta_{\|y\|_\infty \leq 1}(y) \\ f(x) &= -\log x & &\Rightarrow & f^*(y) &= -1 - \log(-y), \; y < 0 \\ f(x) &= e^x & &\Rightarrow & f^*(y) &= y\log y - y, \; y > 0 \end{aligned}" />
      </TheoremBlock>

      <TheoremBlock
        title="Fenchel Duality Theorem"
        proof="Under regularity (e.g., Slater's condition: the relative interiors of the domains intersect), the duality gap is zero. The dual problem is obtained by conjugating: inf_x{f(x)+g(Ax)} = sup_y{-f*(-A⊤y) - g*(y)}. Primal and dual solutions satisfy the saddle-point condition."
      >
        <p>
          For convex <InlineMath math="f, g" /> and linear map <InlineMath math="A" />, Fenchel duality gives:
        </p>
        <BlockMath math="\inf_x \left\{ f(x) + g(Ax) \right\} = \sup_y \left\{ -f^*(-A^\top y) - g^*(y) \right\}." />
        <p className="mt-2">
          Under a constraint qualification (e.g., <InlineMath math="\operatorname{ri}(\operatorname{dom} f) \cap A^{-1}\operatorname{ri}(\operatorname{dom} g) \neq \emptyset" />),
          there is no duality gap and dual solutions exist.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Conjugate in Lasso and SVM">
        <p>
          The conjugate perspective unifies regularized learning problems. The Lasso objective
          <InlineMath math="\tfrac{1}{2}\|Ax-b\|^2 + \lambda\|x\|_1" /> has a dual (via Fenchel duality)
          that is a quadratic program over the <InlineMath math="\ell_\infty" /> ball.
        </p>
        <p className="mt-2">
          The SVM hinge loss <InlineMath math="f(t) = \max(0, 1-t)" /> has conjugate
          <InlineMath math="f^*(s) = s" /> for <InlineMath math="s \in [-1, 0]" /> and <InlineMath math="+\infty" /> otherwise.
          This leads directly to the dual SVM formulation.
        </p>
      </ExampleBlock>

      <WarningBlock title="Domain of Conjugate May Be Restricted">
        <p>
          Even when <InlineMath math="f" /> is defined on all of <InlineMath math="\mathbb{R}^n" />, the
          conjugate <InlineMath math="f^*" /> may have a restricted domain. For example,
          <InlineMath math="f(x) = e^x" /> has conjugate <InlineMath math="f^*(y) = y\log y - y" />
          defined only for <InlineMath math="y > 0" />. Attempting to evaluate <InlineMath math="f^*(y)" />
          outside its domain gives <InlineMath math="+\infty" /> by convention.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np
from scipy.optimize import minimize_scalar

def conjugate(f, y, x_bounds=(-10, 10)):
    """Numerically compute f*(y) = sup_x { y*x - f(x) }."""
    result = minimize_scalar(lambda x: -(y * x - f(x)), bounds=x_bounds, method='bounded')
    return -result.fun

# Example: f(x) = x^2 / 2, f*(y) should equal y^2 / 2
f = lambda x: x**2 / 2
ys = np.linspace(-2, 2, 9)

print("Conjugate of f(x) = x²/2:")
print(f"{'y':>6}  {'f*(y) numerical':>18}  {'y²/2 analytical':>18}")
for y in ys:
    fstar_num = conjugate(f, y)
    fstar_ana = y**2 / 2
    print(f"{y:>6.2f}  {fstar_num:>18.6f}  {fstar_ana:>18.6f}")

# Verify Fenchel's inequality: f(x) + f*(y) >= x*y
print("\\nFenchel inequality f(x) + f*(y) >= x*y:")
x, y = 1.5, 0.8
print(f"f({x}) + f*({y}) = {f(x):.4f} + {conjugate(f, y):.4f} = {f(x)+conjugate(f,y):.4f}")
print(f"x*y = {x*y:.4f}, inequality holds: {f(x)+conjugate(f,y) >= x*y - 1e-9}")
`} />
    </div>
  );
}
