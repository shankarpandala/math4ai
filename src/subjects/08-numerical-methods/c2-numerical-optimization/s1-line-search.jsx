import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// 1D function: f(alpha) = (alpha - 2)^2 + 1, minimized along a search direction
// Armijo condition: f(alpha) <= f(0) + c1 * alpha * f'(0)
// f(0) = 5, f'(0) = -6 (derivative at 0 along descent direction)

function f1d(alpha) { return (alpha - 2) * (alpha - 2) + 1; }
const f0 = f1d(0); // = 5
const fp0 = -6; // directional derivative at 0 (it's a descent direction)

function InteractiveArmijo() {
  const [c1, setC1] = useState(0.3);
  const [alpha, setAlpha] = useState(0.8);

  const W = 400, H = 240, PAD = 40;
  const alphaMin = 0, alphaMax = 4.5;
  const fMin = 0, fMax = 6;

  function toSvg(a, fv) {
    return {
      sx: PAD + ((a - alphaMin) / (alphaMax - alphaMin)) * (W - 2 * PAD),
      sy: H - PAD - ((fv - fMin) / (fMax - fMin)) * (H - 2 * PAD),
    };
  }

  // f(alpha) curve
  const curvePts = Array.from({ length: 100 }, (_, i) => {
    const a = alphaMin + (i / 99) * (alphaMax - alphaMin);
    const { sx, sy } = toSvg(a, f1d(a));
    return `${sx},${sy}`;
  }).join(' ');

  // Armijo tangent line: f(0) + c1 * alpha * fp0
  const armijoLinePts = Array.from({ length: 60 }, (_, i) => {
    const a = alphaMin + (i / 59) * alphaMax;
    const fv = f0 + c1 * a * fp0;
    if (fv < fMin - 0.5 || fv > fMax + 0.5) return null;
    const { sx, sy } = toSvg(a, fv);
    return `${sx},${sy}`;
  }).filter(Boolean).join(' ');

  // Full tangent at 0
  const tangentPts = Array.from({ length: 60 }, (_, i) => {
    const a = alphaMin + (i / 59) * alphaMax;
    const fv = f0 + a * fp0;
    if (fv < fMin - 0.5 || fv > fMax + 0.5) return null;
    const { sx, sy } = toSvg(a, fv);
    return `${sx},${sy}`;
  }).filter(Boolean).join(' ');

  const fAlpha = f1d(alpha);
  const armijoVal = f0 + c1 * alpha * fp0;
  const armijoSatisfied = fAlpha <= armijoVal;
  const curPt = toSvg(alpha, fAlpha);
  const armijoPt = toSvg(alpha, armijoVal);

  // Sufficient decrease zone
  const zonePts = Array.from({ length: 60 }, (_, i) => {
    const a = alphaMin + (i / 59) * alphaMax;
    const fy = f1d(a), armijo = f0 + c1 * a * fp0;
    if (fy <= armijo && a >= 0) {
      const { sx, sy } = toSvg(a, armijo);
      return `${sx},${sy}`;
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Armijo Sufficient Decrease Condition</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        The Armijo condition requires <InlineMath math="f(\alpha) \leq f(0) + c_1 \alpha f'(0)" />.
        The dashed orange line is the Armijo threshold. Green = step satisfies condition.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {/* f(alpha) curve */}
          <polyline points={curvePts} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
          {/* Full tangent at 0 */}
          {tangentPts && <polyline points={tangentPts} fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,4" />}
          {/* Armijo line */}
          {armijoLinePts && <polyline points={armijoLinePts} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />}
          {/* Current alpha point on curve */}
          <circle cx={curPt.sx} cy={curPt.sy} r="7" fill={armijoSatisfied ? '#10b981' : '#ef4444'} />
          {/* Armijo threshold point */}
          <circle cx={armijoPt.sx} cy={armijoPt.sy} r="5" fill="#f59e0b" />
          {/* Vertical line connecting */}
          <line x1={curPt.sx} y1={curPt.sy} x2={armijoPt.sx} y2={armijoPt.sy} stroke="#6b7280" strokeWidth="1.5" strokeDasharray="3,2" />
          {/* f(0) marker */}
          <circle cx={toSvg(0, f0).sx} cy={toSvg(0, f0).sy} r="5" fill="#8b5cf6" />
          <text x={toSvg(0, f0).sx + 6} y={toSvg(0, f0).sy - 4} fontSize="10" fill="#5b21b6">f(0)</text>
          {/* Minimum marker */}
          <circle cx={toSvg(2, 1).sx} cy={toSvg(2, 1).sy} r="4" fill="#10b981" />
          <text x={toSvg(2, 1).sx + 4} y={toSvg(2, 1).sy - 4} fontSize="10" fill="#065f46">min</text>
          <text x={PAD + 4} y={H - PAD - 4} fontSize="10" fill="#374151">α →</text>
          <text x={W - PAD - 60} y={PAD + 14} fontSize="10" fill="#1d4ed8">f(α)</text>
          <text x={W - PAD - 100} y={PAD + 30} fontSize="10" fill="#b45309">Armijo line</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`c_1 = ${c1.toFixed(2)}`} /> (Armijo constant)
            </label>
            <input type="range" min="0.01" max="0.49" step="0.01" value={c1} onChange={e => setC1(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Step size <InlineMath math={`\\alpha = ${alpha.toFixed(2)}`} />
            </label>
            <input type="range" min="0.01" max="4.4" step="0.01" value={alpha} onChange={e => setAlpha(+e.target.value)} className="w-full" />
          </div>
          <div className={`rounded px-3 py-2 text-sm font-semibold ${armijoSatisfied ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
            Armijo: {armijoSatisfied ? 'satisfied ✓' : 'violated ✗'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>f(α) = {fAlpha.toFixed(4)}</p>
            <p>Threshold = {armijoVal.toFixed(4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LineSearchMethods() {
  return (
    <div className="space-y-8">
      <InteractiveArmijo />

      <DefinitionBlock title="Armijo (Sufficient Decrease) Condition">
        <p>
          The <strong>Armijo condition</strong> (sufficient decrease) requires the step to decrease
          the objective by at least a fraction <InlineMath math="c_1 \in (0,1)" /> of the predicted
          linear decrease:
        </p>
        <BlockMath math="f(x_k + \alpha p_k) \leq f(x_k) + c_1 \alpha \nabla f(x_k)^\top p_k." />
        <p className="mt-2">
          Typical choice: <InlineMath math="c_1 = 10^{-4}" />. The Armijo condition alone allows
          arbitrarily small steps (not sufficient for convergence).
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Wolfe Conditions">
        <p>
          The <strong>Wolfe conditions</strong> add a curvature condition to prevent too-small steps:
        </p>
        <BlockMath math="\begin{aligned} &\text{Sufficient decrease: } & f(x_k + \alpha p_k) &\leq f(x_k) + c_1 \alpha \nabla f_k^\top p_k \\ &\text{Curvature: } & \nabla f(x_k + \alpha p_k)^\top p_k &\geq c_2 \nabla f(x_k)^\top p_k \end{aligned}" />
        <p className="mt-2">
          The <strong>strong Wolfe conditions</strong> replace the curvature condition with
          <InlineMath math="|\nabla f(x_k + \alpha p_k)^\top p_k| \leq c_2 |\nabla f(x_k)^\top p_k|" />,
          with typical choices <InlineMath math="0 < c_1 < c_2 < 1" /> (e.g., <InlineMath math="c_1 = 10^{-4}, c_2 = 0.9" />).
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Backtracking Line Search Convergence"
        proof="Backtracking starts with α = α₀ and reduces by β until Armijo is satisfied. Since ∇f(x)⊤p < 0 (descent direction), f is continuous, and f(x+αp) → f(x) as α→0, the Armijo condition is eventually satisfied for some α ≥ α_min > 0 determined by the Lipschitz constant of ∇f."
      >
        <p>
          For a smooth objective and a descent direction <InlineMath math="p_k" />
          (i.e., <InlineMath math="\nabla f_k^\top p_k < 0" />), the backtracking line search
          with reduction factor <InlineMath math="\beta \in (0,1)" />:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Terminates in finite steps with a step size bounded below.</li>
          <li>The accepted step satisfies <InlineMath math="\alpha \geq \alpha_{\min} = \beta\bar{\alpha} \cdot 2(1-c_1)/L" /> where <InlineMath math="L" /> is the Lipschitz constant of <InlineMath math="\nabla f" />.</li>
        </ul>
      </TheoremBlock>

      <TheoremBlock
        title="L-BFGS and the Wolfe Condition"
        proof="L-BFGS builds an approximation to H⁻¹ using pairs (s_k, y_k) = (x_{k+1}-x_k, ∇f_{k+1}-∇f_k). The Wolfe curvature condition ensures y_k⊤s_k > 0, which is required for the BFGS Hessian approximation to remain positive definite. Without the curvature condition, the BFGS update can break down."
      >
        <p>
          <strong>L-BFGS</strong> (Limited-memory BFGS) approximates <InlineMath math="H_k^{-1}" />
          using the last <InlineMath math="m" /> curvature pairs
          <InlineMath math="\{(s_i, y_i)\}_{i=k-m}^{k-1}" />:
        </p>
        <BlockMath math="H_k^{-1} \approx V_k^\top \cdots V_{k-m}^\top H_0^{-1} V_{k-m} \cdots V_k + \text{rank-}2m \text{ corrections}," />
        <p className="mt-2">
          where <InlineMath math="V_k = I - \rho_k y_k s_k^\top" />. The Wolfe curvature condition
          guarantees <InlineMath math="y_k^\top s_k > 0" />, ensuring the approximation stays positive definite.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Line Search vs Trust Region">
        <p>
          Two main strategies for globalization in optimization:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Line search</strong>: choose direction <InlineMath math="p_k" />, then find step size <InlineMath math="\alpha_k" /> along that direction.</li>
          <li><strong>Trust region</strong>: choose step <InlineMath math="s_k" /> as minimizer of a quadratic model within a ball <InlineMath math="\|s\| \leq \Delta_k" />.</li>
        </ul>
        <p className="mt-2">
          Trust region methods can handle indefinite Hessians more robustly. L-BFGS uses line search;
          conjugate gradient methods can use either. For deep learning, backtracking line search is
          rarely used due to cost; instead, fixed schedules or adaptive methods are preferred.
        </p>
      </ExampleBlock>

      <WarningBlock title="Zoom Phase Can Be Expensive">
        <p>
          Wolfe line search has two phases: the <em>bracketing phase</em> (find an interval
          containing a Wolfe point) and the <em>zoom phase</em> (bisect to find the exact point).
          The zoom phase can require many function/gradient evaluations for ill-conditioned
          problems. In practice, simple backtracking (Armijo only) is often sufficient for
          SGD-based methods, reserving full Wolfe conditions for quasi-Newton methods like L-BFGS.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

def backtracking_line_search(f, grad_f, x, p, alpha0=1.0, c1=1e-4, beta=0.5, max_iter=50):
    """Backtracking line search satisfying Armijo condition."""
    alpha = alpha0
    f0 = f(x)
    gp = grad_f(x) @ p  # directional derivative
    assert gp < 0, "p must be a descent direction"

    for _ in range(max_iter):
        if f(x + alpha * p) <= f0 + c1 * alpha * gp:
            return alpha
        alpha *= beta
    return alpha  # may not satisfy condition if max_iter reached

def wolfe_line_search(f, grad_f, x, p, c1=1e-4, c2=0.9, alpha_max=10.0):
    """Strong Wolfe conditions via scipy."""
    from scipy.optimize import line_search
    result = line_search(f, grad_f, x, p, c1=c1, c2=c2, amax=alpha_max)
    alpha = result[0]
    return alpha if alpha is not None else 1e-4

# L-BFGS with backtracking line search
def lbfgs(f, grad_f, x0, m=5, tol=1e-8, max_iter=200):
    """L-BFGS optimizer."""
    x = x0.copy()
    s_list, y_list = [], []
    history = [{'x': x.copy(), 'f': f(x)}]

    for k in range(max_iter):
        g = grad_f(x)
        if np.linalg.norm(g) < tol:
            break

        # L-BFGS two-loop recursion for search direction
        q = g.copy()
        alphas = []
        for s, y in zip(reversed(s_list), reversed(y_list)):
            rho = 1.0 / (y @ s)
            alpha_i = rho * s @ q
            q -= alpha_i * y
            alphas.append(alpha_i)

        if s_list:
            s_last, y_last = s_list[-1], y_list[-1]
            gamma = (s_last @ y_last) / (y_last @ y_last)
            r = gamma * q
        else:
            r = q / (np.linalg.norm(g) + 1e-8)

        for s, y, alpha_i in zip(s_list, y_list, reversed(alphas)):
            rho = 1.0 / (y @ s)
            beta_i = rho * y @ r
            r += s * (alpha_i - beta_i)

        p = -r  # search direction

        alpha = backtracking_line_search(f, grad_f, x, p)
        x_new = x + alpha * p
        s = x_new - x
        y = grad_f(x_new) - g

        if y @ s > 1e-10:  # curvature condition
            s_list.append(s)
            y_list.append(y)
            if len(s_list) > m:
                s_list.pop(0); y_list.pop(0)

        x = x_new
        history.append({'x': x.copy(), 'f': f(x)})

    return x, history

# Test on Rosenbrock
f = lambda x: (1-x[0])**2 + 100*(x[1]-x[0]**2)**2
grad_f = lambda x: np.array([-2*(1-x[0]) - 400*x[0]*(x[1]-x[0]**2),
                               200*(x[1]-x[0]**2)])

x_opt, hist = lbfgs(f, grad_f, np.array([-1.5, 1.0]))
print(f"L-BFGS on Rosenbrock: {len(hist)} iterations")
print(f"Solution: {x_opt}, f = {f(x_opt):.2e}")
`} />
    </div>
  );
}
