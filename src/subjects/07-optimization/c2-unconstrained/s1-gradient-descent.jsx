import React, { useState, useCallback } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// f(x,y) = 0.5*x^2 + 2*y^2 (elongated bowl)
function f(x, y) { return 0.5 * x * x + 2 * y * y; }
function grad(x, y) { return [x, 4 * y]; }

const XMIN = -3, XMAX = 3, YMIN = -1.5, YMAX = 1.5;
const W = 380, H = 260, PAD = 30;

function toSvg(x, y) {
  return {
    sx: PAD + ((x - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD),
    sy: H - PAD - ((y - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD),
  };
}

// Generate contour ellipses for f = level
function ellipsePath(level) {
  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * 2 * Math.PI;
    const rx = Math.sqrt(2 * level);
    const ry = Math.sqrt(level / 2);
    const x = rx * Math.cos(angle);
    const y = ry * Math.sin(angle);
    if (x >= XMIN && x <= XMAX && y >= YMIN && y <= YMAX) {
      const { sx, sy } = toSvg(x, y);
      pts.push(`${sx},${sy}`);
    }
  }
  return pts.length > 2 ? pts.join(' ') : null;
}

function runGD(x0, y0, lr, steps) {
  const path = [{ x: x0, y: y0, fval: f(x0, y0) }];
  let x = x0, y = y0;
  for (let i = 0; i < steps; i++) {
    const [gx, gy] = grad(x, y);
    x = x - lr * gx;
    y = y - lr * gy;
    path.push({ x, y, fval: f(x, y) });
  }
  return path;
}

function InteractiveGD() {
  const [step, setStep] = useState(0);
  const [lr, setLr] = useState(0.3);
  const [maxSteps] = useState(20);

  const path = runGD(2.5, 1.2, lr, maxSteps);
  const levels = [0.1, 0.5, 1, 2, 4, 6];
  const colors = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a'];

  const visPath = path.slice(0, step + 1);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Gradient Descent Trajectory</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Minimizing <InlineMath math="f(x,y) = \frac{1}{2}x^2 + 2y^2" />. Step through the GD iterations.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {levels.map((lv, i) => {
            const pts = ellipsePath(lv);
            return pts ? <polyline key={lv} points={pts} fill="none" stroke={colors[i]} strokeWidth="1.2" opacity="0.7" /> : null;
          })}
          {visPath.length > 1 && visPath.slice(1).map((pt, i) => {
            const a = toSvg(visPath[i].x, visPath[i].y);
            const b = toSvg(pt.x, pt.y);
            return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="#ef4444" strokeWidth="2" />;
          })}
          {visPath.map((pt, i) => {
            const { sx, sy } = toSvg(pt.x, pt.y);
            return <circle key={i} cx={sx} cy={sy} r={i === 0 ? 6 : 4} fill={i === 0 ? '#f59e0b' : '#ef4444'} opacity={0.85} />;
          })}
          {/* Optimum */}
          <circle cx={toSvg(0, 0).sx} cy={toSvg(0, 0).sy} r="5" fill="#10b981" />
          <text x={toSvg(0, 0).sx + 7} y={toSvg(0, 0).sy - 5} fontSize="11" fill="#065f46">opt</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Step size <InlineMath math={`\\eta = ${lr.toFixed(2)}`} />
            </label>
            <input type="range" min="0.05" max="0.49" step="0.01" value={lr} onChange={e => { setLr(+e.target.value); setStep(0); }} className="w-full" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="flex-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
            >← Back</button>
            <button
              onClick={() => setStep(s => Math.min(maxSteps, s + 1))}
              className="flex-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 text-sm font-medium hover:bg-blue-200"
            >Step →</button>
          </div>
          <button
            onClick={() => setStep(0)}
            className="rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2 py-1 text-sm font-medium"
          >Reset</button>
          <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Iteration {step}</p>
            <p>f = {path[step].fval.toExponential(3)}</p>
            <p>x = {path[step].x.toFixed(4)}</p>
            <p>y = {path[step].y.toFixed(4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GradientDescent() {
  return (
    <div className="space-y-8">
      <InteractiveGD />

      <DefinitionBlock title="Gradient Descent">
        <p>
          For a differentiable objective <InlineMath math="f : \mathbb{R}^n \to \mathbb{R}" />, the
          <strong> gradient descent</strong> update with step size <InlineMath math="\eta > 0" /> is:
        </p>
        <BlockMath math="x_{t+1} = x_t - \eta \nabla f(x_t)." />
        <p className="mt-2">
          The gradient <InlineMath math="-\nabla f(x)" /> is the direction of steepest descent. Each
          iteration decreases <InlineMath math="f" /> (for small enough <InlineMath math="\eta" />)
          by approximately <InlineMath math="\eta \|\nabla f(x_t)\|^2" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Lipschitz Smoothness">
        <p>
          A differentiable function <InlineMath math="f" /> is <strong><InlineMath math="L" />-smooth</strong>
          if its gradient is Lipschitz continuous:
        </p>
        <BlockMath math="\|\nabla f(x) - \nabla f(y)\| \leq L \|x - y\| \quad \forall\, x, y." />
        <p className="mt-2">
          Equivalently, <InlineMath math="\nabla^2 f(x) \preceq LI" /> everywhere. For
          <InlineMath math="L" />-smooth functions, the quadratic upper bound holds:
        </p>
        <BlockMath math="f(y) \leq f(x) + \nabla f(x)^\top(y-x) + \frac{L}{2}\|y-x\|^2." />
      </DefinitionBlock>

      <TheoremBlock
        title="Convergence of GD for Convex Smooth Functions"
        proof="With step size η = 1/L, the descent lemma gives f(x_{t+1}) ≤ f(x_t) - (1/2L)||∇f(x_t)||². Summing and using convexity (f(x_t) - f* ≤ ∇f(x_t)⊤(x_t - x*)) and the telescoping argument on ||x_t - x*||² yields the O(1/T) rate."
      >
        <p>
          For a convex, <InlineMath math="L" />-smooth function, GD with step size
          <InlineMath math="\eta = 1/L" /> satisfies:
        </p>
        <BlockMath math="f(x_T) - f^* \leq \frac{L \|x_0 - x^*\|^2}{2T}." />
        <p className="mt-2">
          For <InlineMath math="\mu" />-strongly convex functions, the rate improves to linear:
        </p>
        <BlockMath math="f(x_T) - f^* \leq \left(1 - \frac{\mu}{L}\right)^T (f(x_0) - f^*)." />
        <p className="mt-2">
          The quantity <InlineMath math="\kappa = L/\mu" /> is the <strong>condition number</strong>.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Descent Lemma"
        proof="Integrate the Taylor remainder: f(y) - f(x) - ∇f(x)⊤(y-x) = ∫₀¹(1-t)∇²f(x+t(y-x))[y-x,y-x]dt ≤ (L/2)||y-x||² by L-smoothness."
      >
        <p>
          For an <InlineMath math="L" />-smooth function, the <strong>descent lemma</strong> gives:
        </p>
        <BlockMath math="f\!\left(x - \tfrac{1}{L}\nabla f(x)\right) \leq f(x) - \frac{1}{2L}\|\nabla f(x)\|^2." />
        <p className="mt-2">
          This guarantees sufficient decrease at each GD step with <InlineMath math="\eta = 1/L" />.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Step Size Selection in Practice">
        <p>Choosing the step size is critical:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><strong>Fixed step size</strong> <InlineMath math="\eta = 1/L" />: requires knowing <InlineMath math="L" /> (often estimated via backtracking).</li>
          <li><strong>Backtracking line search</strong>: start with a large step, reduce by factor <InlineMath math="\beta \in (0,1)" /> until Armijo condition holds.</li>
          <li><strong>Polyak step size</strong>: <InlineMath math="\eta_t = (f(x_t) - f^*) / \|\nabla f(x_t)\|^2" /> (requires knowing <InlineMath math="f^*" />).</li>
          <li><strong>Diminishing step sizes</strong> <InlineMath math="\eta_t = O(1/\sqrt{t})" />: used for non-smooth or stochastic settings.</li>
        </ul>
      </ExampleBlock>

      <WarningBlock title="GD Can Be Arbitrarily Slow for Ill-Conditioned Problems">
        <p>
          For a quadratic with condition number <InlineMath math="\kappa = L/\mu" />, GD converges at
          rate <InlineMath math="((\kappa-1)/(\kappa+1))^{2T}" />. For <InlineMath math="\kappa = 1000" />,
          roughly 3000 iterations are needed to reduce the error by a factor of <InlineMath math="e^{-6}" />.
          Preconditioning (e.g., Newton's method or K-FAC) reduces the effective condition number.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

def gradient_descent(f, grad_f, x0, lr, n_iters=100, tol=1e-8):
    """Vanilla gradient descent with fixed step size."""
    x = np.asarray(x0, dtype=float)
    history = [{'x': x.copy(), 'f': f(x)}]
    for _ in range(n_iters):
        g = grad_f(x)
        x = x - lr * g
        fval = f(x)
        history.append({'x': x.copy(), 'f': fval})
        if np.linalg.norm(g) < tol:
            break
    return x, history

# Minimize f(x) = 0.5 * x^T A x - b^T x  (strongly convex quadratic)
rng = np.random.default_rng(42)
n = 50
A = rng.standard_normal((n, n))
A = A.T @ A / n + 0.5 * np.eye(n)  # PD matrix
b = rng.standard_normal(n)

f = lambda x: 0.5 * x @ A @ x - b @ x
grad_f = lambda x: A @ x - b

L = np.linalg.norm(A, ord=2)   # Lipschitz constant
mu = np.linalg.eigvalsh(A).min()  # strong convexity constant
kappa = L / mu
print(f"Condition number κ = L/μ = {kappa:.1f}")

x_opt = np.linalg.solve(A, b)  # true optimum
f_opt = f(x_opt)

x_gd, hist = gradient_descent(f, grad_f, np.zeros(n), lr=1/L, n_iters=500)
gaps = [h['f'] - f_opt for h in hist]

print(f"\\nAfter {len(hist)-1} iterations:")
print(f"  f(x_GD) - f* = {gaps[-1]:.2e}")
print(f"  Theoretical bound (1 - 1/κ)^T * gap_0 = {(1 - 1/kappa)**(len(hist)-1) * gaps[0]:.2e}")
`} />
    </div>
  );
}
