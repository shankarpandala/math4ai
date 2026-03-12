import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Objective: f(x,y) = x^2 + y^2 (minimize distance to origin)
// Constraint: g(x,y) = x + y - c = 0 (linear constraint)
// KKT solution: x* = y* = c/2

const W = 380, H = 280, PAD = 35;
const XMIN = -2.5, XMAX = 2.5, YMIN = -2.5, YMAX = 2.5;

function toSvg(x, y) {
  return {
    sx: PAD + ((x - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD),
    sy: H - PAD - ((y - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD),
  };
}

function InteractiveLagrangian() {
  const [c, setC] = useState(1.5);
  const [showKKT, setShowKKT] = useState(true);

  // Optimal point: x* = y* = c/2
  const xs = c / 2, ys = c / 2;
  const opt = toSvg(xs, ys);

  // Contour circles for f(x,y) = x^2 + y^2 = r^2
  const levels = [0.5, 1, 1.5, 2, 2.8];
  const contourColors = ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'];

  function circleContour(r) {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * 2 * Math.PI;
      const x = r * Math.cos(angle), y = r * Math.sin(angle);
      if (x < XMIN || x > XMAX || y < YMIN || y > YMAX) continue;
      const { sx, sy } = toSvg(x, y);
      pts.push(`${sx},${sy}`);
    }
    return pts.length > 2 ? pts.join(' ') : null;
  }

  // Constraint line: x + y = c  =>  y = c - x
  const cLine = [toSvg(XMIN, c - XMIN), toSvg(XMAX, c - XMAX)].filter(
    pt => pt.sy >= PAD && pt.sy <= H - PAD
  );

  // Gradient of f at x*: [2x*, 2y*]
  const gfx = 2 * xs, gfy = 2 * ys;
  const gnorm = Math.sqrt(gfx * gfx + gfy * gfy) * 40;
  const gradEnd = toSvg(xs + gfx / gnorm * 0.8, ys + gfy / gnorm * 0.8);

  // Normal to constraint: [1,1]/sqrt(2)
  const normEnd = toSvg(xs + 0.8 / Math.sqrt(2), ys + 0.8 / Math.sqrt(2));

  const fOpt = xs * xs + ys * ys;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: KKT Conditions</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Minimizing <InlineMath math="f(x,y)=x^2+y^2" /> subject to <InlineMath math="x+y=c" />.
        At the optimum, <InlineMath math="\nabla f = \lambda \nabla g" /> (gradients are parallel).
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {levels.map((r, i) => {
            const pts = circleContour(r);
            return pts ? <polyline key={r} points={pts} fill="none" stroke={contourColors[i]} strokeWidth="1.2" /> : null;
          })}
          {/* Constraint line */}
          {cLine.length === 2 && (
            <line x1={cLine[0].sx} y1={cLine[0].sy} x2={cLine[1].sx} y2={cLine[1].sy} stroke="#ef4444" strokeWidth="2.5" />
          )}
          {/* Optimal point */}
          <circle cx={opt.sx} cy={opt.sy} r="7" fill="#10b981" />
          <text x={opt.sx + 9} y={opt.sy - 7} fontSize="11" fill="#065f46">x*</text>
          {showKKT && (
            <>
              {/* Gradient of f */}
              <line x1={opt.sx} y1={opt.sy} x2={gradEnd.sx} y2={gradEnd.sy} stroke="#8b5cf6" strokeWidth="2.5" markerEnd="url(#arrowPurple)" />
              <text x={gradEnd.sx + 4} y={gradEnd.sy - 4} fontSize="10" fill="#5b21b6">∇f</text>
              {/* Normal to constraint */}
              <line x1={opt.sx} y1={opt.sy} x2={normEnd.sx} y2={normEnd.sy} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" markerEnd="url(#arrowAmber)" />
              <text x={normEnd.sx + 4} y={normEnd.sy} fontSize="10" fill="#92400e">∇g</text>
            </>
          )}
          <defs>
            <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" />
            </marker>
            <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
          </defs>
          <text x={PAD + 4} y={PAD + 14} fontSize="10" fill="#374151">f=x²+y²</text>
          <text x={W - PAD - 60} y={PAD + 14} fontSize="10" fill="#ef4444">x+y=c</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Constraint <InlineMath math={`c = ${c.toFixed(2)}`} />
            </label>
            <input type="range" min="-2" max="2" step="0.1" value={c} onChange={e => setC(+e.target.value)} className="w-full" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showKKT} onChange={e => setShowKKT(e.target.checked)} className="rounded" />
            Show gradient vectors
          </label>
          <div className="rounded bg-green-50 dark:bg-green-900/30 px-3 py-2 text-sm">
            <p className="font-semibold text-green-800 dark:text-green-200">KKT solution</p>
            <p className="text-xs text-green-700 dark:text-green-300">x* = y* = {xs.toFixed(3)}</p>
            <p className="text-xs text-green-700 dark:text-green-300">f(x*) = {fOpt.toFixed(4)}</p>
            <p className="text-xs text-green-700 dark:text-green-300">λ* = {xs.toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LagrangianKKT() {
  return (
    <div className="space-y-8">
      <InteractiveLagrangian />

      <DefinitionBlock title="The Lagrangian">
        <p>For the constrained optimization problem</p>
        <BlockMath math="\min_x\; f(x) \quad \text{s.t.}\quad g_i(x) \leq 0,\; h_j(x) = 0," />
        <p className="mt-2">the <strong>Lagrangian</strong> is</p>
        <BlockMath math="\mathcal{L}(x, \lambda, \nu) = f(x) + \sum_i \lambda_i g_i(x) + \sum_j \nu_j h_j(x)," />
        <p className="mt-2">
          where <InlineMath math="\lambda_i \geq 0" /> are dual variables for inequality constraints
          and <InlineMath math="\nu_j \in \mathbb{R}" /> for equalities.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="KKT Conditions">
        <p>
          If <InlineMath math="x^*" /> is a local minimum and a constraint qualification holds, then
          there exist <InlineMath math="\lambda^*, \nu^*" /> satisfying the
          <strong> Karush–Kuhn–Tucker (KKT) conditions</strong>:
        </p>
        <BlockMath math="\begin{aligned} &\text{Stationarity: } & \nabla_x \mathcal{L}(x^*,\lambda^*,\nu^*) &= 0 \\ &\text{Primal feasibility: } & g_i(x^*) &\leq 0,\; h_j(x^*) = 0 \\ &\text{Dual feasibility: } & \lambda_i^* &\geq 0 \\ &\text{Complementary slackness: } & \lambda_i^* g_i(x^*) &= 0 \end{aligned}" />
      </DefinitionBlock>

      <DefinitionBlock title="Constraint Qualifications">
        <p>
          KKT conditions are <em>necessary</em> only under a <strong>constraint qualification (CQ)</strong>.
          Common CQs include:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>LICQ</strong>: gradients of active constraints are linearly independent at <InlineMath math="x^*" />.</li>
          <li><strong>Slater's CQ</strong>: there exists a strictly feasible point (for convex problems).</li>
          <li><strong>MFCQ</strong>: active constraint gradients are positively independent.</li>
        </ul>
        <p className="mt-2">
          For convex programs, Slater's condition guarantees KKT conditions are both necessary and sufficient.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="KKT Sufficiency for Convex Programs"
        proof="Suppose f, g_i are convex and h_j affine. If (x*, λ*, ν*) satisfies KKT, then for any feasible x: f(x) ≥ f(x*) + ∇f(x*)⊤(x-x*) ≥ f(x*) - Σ λ_i*∇g_i(x*)⊤(x-x*) - Σ ν_j*∇h_j(x*)⊤(x-x*) = L(x,λ*,ν*) - Σλ_i*g_i(x) - Σν_j*h_j(x) ≥ L(x*,λ*,ν*) = f(x*), using convexity, dual feasibility, and complementary slackness."
      >
        <p>
          For a convex optimization problem (convex <InlineMath math="f, g_i" />, affine <InlineMath math="h_j" />),
          if <InlineMath math="(x^*, \lambda^*, \nu^*)" /> satisfies the KKT conditions, then
          <InlineMath math="x^*" /> is a <em>global</em> minimizer.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Complementary Slackness Interpretation"
        proof="At optimality, either the constraint g_i is active (binding) or the dual variable λ_i = 0 (the constraint has no cost). This follows from the KKT stationarity condition and the fact that at optimum the Lagrangian cannot decrease."
      >
        <p>
          The complementary slackness condition <InlineMath math="\lambda_i^* g_i(x^*) = 0" /> means:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>If <InlineMath math="g_i(x^*) < 0" /> (inactive constraint), then <InlineMath math="\lambda_i^* = 0" />.</li>
          <li>If <InlineMath math="\lambda_i^* > 0" /> (constraint has cost), then <InlineMath math="g_i(x^*) = 0" /> (constraint is active).</li>
        </ul>
      </TheoremBlock>

      <ExampleBlock title="SVM as a Constrained Optimization Problem">
        <p>The hard-margin SVM is:</p>
        <BlockMath math="\min_{w,b}\; \frac{1}{2}\|w\|^2 \quad \text{s.t.}\quad y_i(w^\top x_i + b) \geq 1 \;\; \forall i." />
        <p className="mt-2">
          The KKT conditions give <InlineMath math="w^* = \sum_i \alpha_i y_i x_i" /> where
          <InlineMath math="\alpha_i \geq 0" /> are dual variables. Complementary slackness:
          <InlineMath math="\alpha_i(y_i(w^\top x_i + b) - 1) = 0" />, so only support vectors
          (on the margin) have <InlineMath math="\alpha_i > 0" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="KKT Conditions Are Not Always Sufficient for Non-Convex Problems">
        <p>
          For non-convex problems, KKT conditions are necessary but not sufficient for global
          optimality — they only guarantee local stationarity. A point satisfying KKT may be
          a saddle point or local maximum. Additionally, without a constraint qualification,
          KKT conditions may fail even at a local minimum.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np
from scipy.optimize import minimize

# Solve constrained QP: min x^2 + y^2 s.t. x + y = c
# KKT solution: x* = y* = c/2

def kkt_equality_constrained():
    c = 1.5
    # Augmented system: [2I, a; a^T, 0] [x; lambda] = [0; c]
    A_kkt = np.array([[2, 0, 1],
                       [0, 2, 1],
                       [1, 1, 0]], dtype=float)
    b_kkt = np.array([0, 0, c])
    sol = np.linalg.solve(A_kkt, b_kkt)
    x_star, y_star, lam_star = sol
    print(f"KKT solution: x*={x_star:.4f}, y*={y_star:.4f}, λ*={lam_star:.4f}")
    print(f"f(x*) = {x_star**2 + y_star**2:.4f}")
    print(f"Constraint satisfied: {abs(x_star + y_star - c) < 1e-10}")

kkt_equality_constrained()

# Inequality constrained: min (x-3)^2 + (y-2)^2 s.t. x^2 + y^2 <= 1
from scipy.optimize import minimize

f = lambda v: (v[0]-3)**2 + (v[1]-2)**2
grad_f = lambda v: np.array([2*(v[0]-3), 2*(v[1]-2)])

constraints = [{'type': 'ineq', 'fun': lambda v: 1 - v[0]**2 - v[1]**2}]
result = minimize(f, [0.5, 0.5], jac=grad_f, constraints=constraints, method='SLSQP')
x, y = result.x
print(f"\\nInequality constrained solution: x*={x:.4f}, y*={y:.4f}")
print(f"||x*|| = {np.sqrt(x**2+y**2):.4f} (on boundary: {abs(np.sqrt(x**2+y**2)-1) < 1e-4})")
print(f"KKT dual variable (approx): λ* = {result.v[0][0] if hasattr(result, 'v') else 'N/A'}")
`} />
    </div>
  );
}
