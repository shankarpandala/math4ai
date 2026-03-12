import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function LagrangeViz() {
  const [radius, setRadius] = useState(1.5);

  // f(x,y) = x + y (maximize on circle x^2+y^2 = r^2)
  // Optimal: x*=y*= r/sqrt(2), f* = r*sqrt(2)
  const r = radius;
  const optX = r / Math.sqrt(2);
  const optY = r / Math.sqrt(2);
  const fOpt = optX + optY;

  const W = 340, H = 260;
  const scale = 3.5;
  const xMin = -scale, xMax = scale, yMin = -scale, yMax = scale;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  // Constraint circle
  const circlePts = Array.from({ length: 361 }, (_, i) => {
    const t = (i / 360) * 2 * Math.PI;
    return toSvg(r * Math.cos(t), r * Math.sin(t));
  });
  const circlePath = circlePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ') + 'Z';

  // Level lines of f(x,y)=x+y: x+y=c => y=c-x
  const levelCurves = [-3, -2, -1, 0, 1, 2, fOpt].map(c => {
    const p1 = toSvg(xMin, c - xMin);
    const p2 = toSvg(xMax, c - xMax);
    return { p1, p2, c, isOpt: Math.abs(c - fOpt) < 0.01 };
  });

  const { sx: oxSvg, sy: oySvg } = toSvg(optX, optY);
  const { sx: oNegSvg, sy: oNegY } = toSvg(-optX, -optY);
  const axisY = toSvg(0, 0).sy, axisX = toSvg(0, 0).sx;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Lagrange Multiplier: maximize <InlineMath math="x+y" /> on <InlineMath math="x^2+y^2=r^2" />
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Green = constraint circle. Gray = level lines of <InlineMath math="f=x+y" />. Optimum where circle is tangent to a level line.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={0} y1={axisY} x2={W} y2={axisY} stroke="#d1d5db" strokeWidth={1} />
        <line x1={axisX} y1={0} x2={axisX} y2={H} stroke="#d1d5db" strokeWidth={1} />
        {/* level lines */}
        {levelCurves.map(({ p1, p2, c, isOpt }) => (
          <line key={c} x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy}
            stroke={isOpt ? '#f97316' : '#9ca3af'} strokeWidth={isOpt ? 2.5 : 1}
            strokeDasharray={isOpt ? undefined : '4,3'} opacity={0.7} />
        ))}
        {/* constraint */}
        <path d={circlePath} fill="none" stroke="#16a34a" strokeWidth={2.5} />
        {/* gradient arrows at optimum */}
        <line x1={oxSvg} y1={oySvg}
          x2={oxSvg + 25} y2={oySvg - 25}
          stroke="#ef4444" strokeWidth={2} />
        <line x1={oxSvg} y1={oySvg}
          x2={oxSvg + 25 * (optX / r)} y2={oySvg - 25 * (optY / r)}
          stroke="#3b82f6" strokeWidth={2} />
        {/* optimal points */}
        <circle cx={oxSvg} cy={oySvg} r={6} fill="#f97316" stroke="white" strokeWidth={2} />
        <circle cx={oNegSvg} cy={oNegY} r={6} fill="#9ca3af" stroke="white" strokeWidth={2} />
        <text x={oxSvg + 8} y={oySvg - 8} fontSize={10} fill="#f97316">max</text>
        <text x={oNegSvg + 8} y={oNegY + 14} fontSize={10} fill="#6b7280">min</text>
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span className="font-mono">r (radius)</span><span>{r.toFixed(2)}</span>
        </div>
        <input type="range" min="0.5" max="3" step="0.1" value={radius}
          onChange={e => setRadius(parseFloat(e.target.value))} className="w-full accent-green-500" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 px-3 py-2">
          <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">Maximum</p>
          <p><InlineMath math={`f^* = r\\sqrt{2} = ${fOpt.toFixed(3)}`} /></p>
          <p className="text-xs">at <InlineMath math={`(${optX.toFixed(2)},\\, ${optY.toFixed(2)})`} /></p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">λ (multiplier)</p>
          <p><InlineMath math={`\\lambda = 1/(2r) \\cdot 2 \\cdot r\\sqrt{2} = ${(1/Math.sqrt(2)).toFixed(3)}`} /></p>
        </div>
      </div>
    </div>
  );
}

export default function LagrangeSection() {
  return (
    <div className="space-y-8">
      <LagrangeViz />

      <DefinitionBlock
        label="Definition 4.3.1"
        title="Lagrangian and Lagrange Multipliers"
        definition={
          "The constrained optimization problem $\\min_{\\mathbf{x}} f(\\mathbf{x})$ subject to $g_i(\\mathbf{x}) = 0$, $i=1,\\ldots,m$ " +
          "is addressed via the Lagrangian $\\mathcal{L}(\\mathbf{x}, \\boldsymbol{\\lambda}) = f(\\mathbf{x}) + \\sum_{i=1}^m \\lambda_i g_i(\\mathbf{x})$. " +
          "The scalars $\\lambda_i$ are Lagrange multipliers. At a constrained local optimum $\\mathbf{x}^*$, " +
          "$\\nabla_{\\mathbf{x}} \\mathcal{L} = 0$, i.e., $\\nabla f(\\mathbf{x}^*) = -\\sum_i \\lambda_i \\nabla g_i(\\mathbf{x}^*)$: " +
          "the objective gradient is a linear combination of constraint gradients."
        }
        notation={
          "Geometric interpretation: at the optimum, $\\nabla f$ and $\\nabla g$ are parallel — " +
          "the level set of $f$ and the constraint surface are tangent. " +
          "The multiplier $\\lambda_i$ measures the sensitivity of the optimal value to perturbations of constraint $i$: $df^*/dc_i = \\lambda_i$."
        }
      />

      <DefinitionBlock
        label="Definition 4.3.2"
        title="KKT Conditions (Inequality Constraints)"
        definition={
          "For $\\min f(\\mathbf{x})$ subject to $g_i(\\mathbf{x}) \\leq 0$, the KKT conditions are: " +
          "(1) Stationarity: $\\nabla f(\\mathbf{x}^*) + \\sum_i \\mu_i \\nabla g_i(\\mathbf{x}^*) = 0$; " +
          "(2) Primal feasibility: $g_i(\\mathbf{x}^*) \\leq 0$; " +
          "(3) Dual feasibility: $\\mu_i \\geq 0$; " +
          "(4) Complementary slackness: $\\mu_i g_i(\\mathbf{x}^*) = 0$ (either constraint is active or multiplier is zero)."
        }
      />

      <TheoremBlock
        label="Theorem 4.3.1"
        title="Lagrange Multiplier Theorem (Equality Constraints)"
        statement={
          "Let $f, g_1, \\ldots, g_m \\in C^1$ and $\\mathbf{x}^*$ a local optimum of $f$ on $\\{\\mathbf{x}: g_i(\\mathbf{x})=0\\}$. " +
          "If the constraint qualification holds (the gradients $\\nabla g_1(\\mathbf{x}^*), \\ldots, \\nabla g_m(\\mathbf{x}^*)$ are linearly independent), " +
          "then there exist unique $\\lambda_1^*, \\ldots, \\lambda_m^*$ such that " +
          "$\\nabla f(\\mathbf{x}^*) + \\sum_i \\lambda_i^* \\nabla g_i(\\mathbf{x}^*) = \\mathbf{0}$."
        }
        proof={
          "Apply the implicit function theorem to the constraint system to locally parameterize the constraint set. " +
          "At an interior constrained optimum, the projection of $\\nabla f$ onto the constraint tangent space is zero. " +
          "This means $\\nabla f$ lies in the span of $\\{\\nabla g_i\\}$, giving the multiplier representation."
        }
      />

      <ExampleBlock title="Maximize x+y subject to x²+y²=1">
        <BlockMath math="\mathcal{L}(x,y,\lambda) = x + y + \lambda(x^2 + y^2 - 1)" />
        <BlockMath math="\nabla \mathcal{L} = 0 \implies 1 + 2\lambda x = 0,\quad 1 + 2\lambda y = 0 \implies x = y = -\frac{1}{2\lambda}" />
        <BlockMath math="x^2 + y^2 = 1 \implies 2 \cdot \frac{1}{4\lambda^2} = 1 \implies \lambda = \pm\frac{1}{\sqrt{2}}" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Maximum at <InlineMath math="\lambda = -1/\sqrt{2}" />: <InlineMath math="x=y=1/\sqrt{2}" />,{' '}
          <InlineMath math="f^* = \sqrt{2}" />. Minimum at <InlineMath math="\lambda = 1/\sqrt{2}" />: <InlineMath math="f_{\min} = -\sqrt{2}" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Lagrange Multipliers Only Find Candidates">
        <p>
          The Lagrange conditions are <em>necessary</em> but not sufficient. Solutions to
          <InlineMath math="\nabla \mathcal{L} = 0" /> are <em>critical points</em> of the constrained problem — they
          could be minima, maxima, or saddle points. Always verify by evaluating <InlineMath math="f" /> at all
          candidates and checking boundary behavior. On compact constraint sets, the extreme value theorem
          guarantees a global extremum exists, so comparing all Lagrange critical points suffices.
        </p>
      </WarningBlock>

      <PythonCode
        title="Constrained Optimization with SciPy"
        code={`import numpy as np
from scipy.optimize import minimize

# ── Maximize x+y on x²+y²=1 via Lagrange ────────────────────────────────
# Negate to maximize
f = lambda x: -(x[0] + x[1])
grad_f = lambda x: np.array([-1.0, -1.0])

# Constraint: x² + y² - 1 = 0
constraint = {'type': 'eq', 'fun': lambda x: x[0]**2 + x[1]**2 - 1,
              'jac': lambda x: 2 * x}

x0 = np.array([0.6, 0.8])
result = minimize(f, x0, method='SLSQP', constraints=[constraint],
                  options={'ftol': 1e-12})
print(f"Optimal x: ({result.x[0]:.6f}, {result.x[1]:.6f})")
print(f"Optimal f: {-result.fun:.6f} (analytic: {np.sqrt(2):.6f})")
print(f"Lagrange multiplier: {result.v[0][0]:.6f} (analytic: {-1/np.sqrt(2):.6f})")

# ── Example with multiple constraints ─────────────────────────────────────
# Minimize x²+y²+z² subject to x+y+z=1 and x+2y=0
f2 = lambda x: x[0]**2 + x[1]**2 + x[2]**2
c1 = {'type': 'eq', 'fun': lambda x: x[0] + x[1] + x[2] - 1}
c2 = {'type': 'eq', 'fun': lambda x: x[0] + 2*x[1]}

res2 = minimize(f2, [0.5, 0.0, 0.5], method='SLSQP', constraints=[c1, c2])
print(f"\\nMultiple constraints solution: {res2.x}")
print(f"f* = {res2.fun:.6f}")`}
      />
    </div>
  );
}
