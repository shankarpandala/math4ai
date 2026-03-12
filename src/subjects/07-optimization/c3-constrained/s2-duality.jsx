import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Simple 1D problem: primal min f(x) = x^2 s.t. x >= a
// Lagrangian: L(x, lambda) = x^2 - lambda*(x - a) (lambda >= 0)
// Dual: g(lambda) = min_x L = -lambda^2/4 + lambda*a (for lambda >= 0)
// Primal optimal: max(0, a), f* = max(0, a)^2

function InteractiveDuality() {
  const [a, setA] = useState(0.8);
  const [lambdaVal, setLambdaVal] = useState(1.0);

  // Primal: min x^2 s.t. x >= a
  const xPrimal = Math.max(0, a);
  const fPrimal = xPrimal * xPrimal;

  // Dual function: g(lambda) = min_x { x^2 - lambda*(x - a) }
  // d/dx = 2x - lambda = 0 => x* = lambda/2
  // g(lambda) = (lambda/2)^2 - lambda*(lambda/2 - a) = lambda^2/4 - lambda^2/2 + lambda*a = -lambda^2/4 + lambda*a
  function dualFunc(lam) {
    if (lam < 0) return -Infinity;
    return -lam * lam / 4 + lam * a;
  }

  const gLambda = dualFunc(lambdaVal);
  const dualOpt = 2 * a; // optimal lambda for g when a>0
  const dualBound = dualFunc(Math.max(0, dualOpt));

  const W = 380, H = 220, PAD = 35;
  const lamMin = 0, lamMax = 4;
  const gMin = -1, gMax = fPrimal + 0.5;

  function toSvg(lam, g) {
    return {
      sx: PAD + ((lam - lamMin) / (lamMax - lamMin)) * (W - 2 * PAD),
      sy: H - PAD - ((g - gMin) / (gMax - gMin)) * (H - 2 * PAD),
    };
  }

  // Dual function curve
  const dualCurve = Array.from({ length: 100 }, (_, i) => {
    const lam = lamMin + (i / 99) * (lamMax - lamMin);
    const g = dualFunc(lam);
    if (g < gMin || g > gMax + 1) return null;
    const { sx, sy } = toSvg(lam, g);
    return `${sx},${sy}`;
  }).filter(Boolean).join(' ');

  // Primal value line
  const primalLine1 = toSvg(lamMin, fPrimal);
  const primalLine2 = toSvg(lamMax, fPrimal);

  // Current dual value
  const curPt = toSvg(lambdaVal, gLambda);
  const gapSize = Math.max(0, fPrimal - gLambda);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Primal vs Dual Bound</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Primal: <InlineMath math="\min_x x^2\; \text{s.t.}\; x \geq a" />. Dual function
        <InlineMath math="g(\lambda) = -\lambda^2/4 + \lambda a" /> always lower bounds the primal.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {/* Primal value (horizontal line) */}
          <line x1={primalLine1.sx} y1={primalLine1.sy} x2={primalLine2.sx} y2={primalLine2.sy} stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,3" />
          <text x={PAD + 4} y={primalLine1.sy - 4} fontSize="10" fill="#1d4ed8">p* = {fPrimal.toFixed(3)}</text>
          {/* Dual curve */}
          {dualCurve && <polyline points={dualCurve} fill="none" stroke="#10b981" strokeWidth="2.5" />}
          {/* Current lambda point */}
          <circle cx={curPt.sx} cy={curPt.sy} r="6" fill="#f59e0b" />
          {/* Duality gap vertical line */}
          {gLambda < fPrimal && (
            <line x1={curPt.sx} y1={curPt.sy} x2={curPt.sx} y2={primalLine1.sy} stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
          )}
          {/* Gap annotation */}
          {gapSize > 0.02 && (() => {
            const mid = toSvg(lambdaVal, (gLambda + fPrimal) / 2);
            return <text x={mid.sx + 5} y={mid.sy} fontSize="10" fill="#b91c1c">gap={gapSize.toFixed(3)}</text>;
          })()}
          <text x={W - PAD - 70} y={H - PAD - 10} fontSize="10" fill="#065f46">g(λ) dual</text>
          <text x={W - 2 * PAD - 14} y={PAD + 14} fontSize="10" fill="#1d4ed8">p* primal</text>
          <text x={PAD + 4} y={H - PAD - 4} fontSize="10" fill="#374151">λ →</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Constraint <InlineMath math={`a = ${a.toFixed(2)}`} />
            </label>
            <input type="range" min="-0.5" max="1.5" step="0.05" value={a} onChange={e => setA(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`\\lambda = ${lambdaVal.toFixed(2)}`} />
            </label>
            <input type="range" min="0" max="3.8" step="0.05" value={lambdaVal} onChange={e => setLambdaVal(+e.target.value)} className="w-full" />
          </div>
          <div className="rounded bg-blue-50 dark:bg-blue-900/30 px-3 py-2 text-xs">
            <p>Primal opt: <strong>{fPrimal.toFixed(4)}</strong></p>
            <p>Dual bound: <strong>{gLambda.toFixed(4)}</strong></p>
            <p>Duality gap: <strong className={gapSize < 0.001 ? 'text-green-700' : 'text-red-700'}>{gapSize.toFixed(4)}</strong></p>
            {a > 0 && <p className="mt-1 text-green-700 dark:text-green-300">Strong duality holds (Slater: x̂=a+1 feasible)</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LagrangianDuality() {
  return (
    <div className="space-y-8">
      <InteractiveDuality />

      <DefinitionBlock title="Lagrangian Dual Problem">
        <p>
          The <strong>dual function</strong> is the infimum of the Lagrangian over primal variables:
        </p>
        <BlockMath math="g(\lambda, \nu) = \inf_{x \in \mathcal{D}}\; \mathcal{L}(x, \lambda, \nu) = \inf_x \left\{ f(x) + \sum_i \lambda_i g_i(x) + \sum_j \nu_j h_j(x) \right\}." />
        <p className="mt-2">
          The <strong>dual problem</strong> maximizes the dual function:
        </p>
        <BlockMath math="\max_{\lambda \geq 0,\, \nu}\; g(\lambda, \nu)." />
        <p className="mt-2">
          The dual function is always concave (as an infimum of affine functions in <InlineMath math="(\lambda, \nu)" />).
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Weak and Strong Duality">
        <p>
          <strong>Weak duality</strong> always holds: for any dual feasible <InlineMath math="(\lambda, \nu)" />
          and primal feasible <InlineMath math="x" />:
        </p>
        <BlockMath math="g(\lambda, \nu) \leq p^* \leq f(x)," />
        <p className="mt-2">
          where <InlineMath math="p^*" /> is the primal optimal value. The difference
          <InlineMath math="p^* - d^*" /> is the <strong>duality gap</strong>.
        </p>
        <p className="mt-2">
          <strong>Strong duality</strong> holds when <InlineMath math="p^* = d^*" /> (zero gap).
          This requires a constraint qualification.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Slater's Condition"
        proof="Slater's condition ensures the Lagrangian dual attains its supremum and equals the primal. The proof uses the separating hyperplane theorem applied to the joint epigraph of (f, g₁, ..., gₘ) and the target set {(u,v): u < 0, v ≤ 0}, showing the primal value equals the dual."
      >
        <p>
          For a convex problem, if there exists a strictly feasible point
          (a <em>Slater point</em>) <InlineMath math="\hat{x}" /> with
          <InlineMath math="g_i(\hat{x}) < 0" /> for all <InlineMath math="i" />,
          then <strong>strong duality holds</strong>: <InlineMath math="p^* = d^*" />,
          and the dual optimum is attained.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="SVM Duality"
        proof="The Lagrangian of the primal SVM is L(w,b,α) = ½||w||² - Σαᵢ(yᵢ(w⊤xᵢ+b)-1). Setting ∂L/∂w = 0 gives w = Σαᵢyᵢxᵢ and ∂L/∂b = 0 gives Σαᵢyᵢ = 0. Substituting back yields the dual."
      >
        <p>
          The hard-margin SVM dual is obtained by substituting KKT stationarity into the Lagrangian:
        </p>
        <BlockMath math="\max_\alpha\; \sum_i \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j x_i^\top x_j \quad \text{s.t.}\quad \alpha_i \geq 0,\; \sum_i \alpha_i y_i = 0." />
        <p className="mt-2">
          Strong duality holds (Slater: separable data). The dual depends only on inner products
          <InlineMath math="x_i^\top x_j" /> — replacing these with a kernel <InlineMath math="k(x_i, x_j)" />
          gives the kernel SVM.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Dual of LASSO">
        <p>
          The LASSO problem <InlineMath math="\min_x \tfrac{1}{2}\|Ax - b\|^2 + \lambda\|x\|_1" />
          has a dual (via Fenchel duality):
        </p>
        <BlockMath math="\max_u\; -\frac{1}{2}\|u\|^2 + b^\top u \quad \text{s.t.}\quad \|A^\top u\|_\infty \leq \lambda." />
        <p className="mt-2">
          This is a constrained quadratic program. The primal-dual relationship shows that the
          LASSO residual <InlineMath math="b - Ax^*" /> is proportional to the dual optimal
          <InlineMath math="u^*" /> — useful for computing dual certificates.
        </p>
      </ExampleBlock>

      <WarningBlock title="Strong Duality Does Not Always Hold for Non-Convex Problems">
        <p>
          For non-convex problems, strong duality may fail even when Slater's condition is satisfied.
          Integer programs (LP relaxations), quadratic programs with indefinite <InlineMath math="Q" />,
          and general non-convex NLPs can have positive duality gaps. The
          <em> SDP relaxation</em> technique often provides tighter dual bounds by lifting
          to a higher-dimensional convex problem.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np
from scipy.optimize import linprog, minimize

# LP duality: primal min c^T x s.t. Ax >= b, x >= 0
# Dual: max b^T y s.t. A^T y <= c, y >= 0
c_primal = np.array([2.0, 3.0, 1.0])
A = np.array([[1.0, 1.0, 0.0],
              [0.0, 1.0, 1.0]])
b = np.array([1.0, 1.0])

# Solve primal (linprog minimizes, Ax >= b => -Ax <= -b)
res_primal = linprog(c_primal, A_ub=-A, b_ub=-b, bounds=[(0, None)]*3)
p_star = res_primal.fun
print(f"Primal optimal: p* = {p_star:.6f}")
print(f"Primal solution: {res_primal.x}")

# Solve dual (max b^T y <=> min -b^T y, A^T y <= c, y >= 0)
res_dual = linprog(-b, A_ub=A.T, b_ub=c_primal, bounds=[(0, None)]*2)
d_star = -res_dual.fun
print(f"\\nDual optimal: d* = {d_star:.6f}")
print(f"Dual solution: {res_dual.x}")
print(f"Duality gap: {abs(p_star - d_star):.2e} (should be ~0 by strong duality)")

# Verify complementary slackness for LP
x_star = res_primal.x
y_star = res_dual.x
slack_primal = A @ x_star - b
slack_dual = c_primal - A.T @ y_star
print(f"\\nComplementary slackness check:")
print(f"  y* * (Ax*-b): {y_star @ slack_primal:.2e} (should be ~0)")
print(f"  x* * (c-A^Ty*): {x_star @ slack_dual:.2e} (should be ~0)")
`} />
    </div>
  );
}
