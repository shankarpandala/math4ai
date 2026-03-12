import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// f(x,y) = 0.5 * (kappa * x^2 + y^2), gradient: [kappa*x, y]
function makeF(kappa) {
  return {
    f: (x, y) => 0.5 * (kappa * x * x + y * y),
    grad: (x, y) => [kappa * x, y],
  };
}

function runGD(grad, x0, y0, lr, steps) {
  const path = [{ x: x0, y: y0 }];
  let x = x0, y = y0;
  for (let i = 0; i < steps; i++) {
    const [gx, gy] = grad(x, y);
    x -= lr * gx;
    y -= lr * gy;
    path.push({ x, y });
  }
  return path;
}

function runMomentum(grad, x0, y0, lr, beta, steps) {
  const path = [{ x: x0, y: y0 }];
  let x = x0, y = y0, vx = 0, vy = 0;
  for (let i = 0; i < steps; i++) {
    const [gx, gy] = grad(x, y);
    vx = beta * vx - lr * gx;
    vy = beta * vy - lr * gy;
    x += vx;
    y += vy;
    path.push({ x, y });
  }
  return path;
}

const XMIN = -3, XMAX = 3, YMIN = -3, YMAX = 3;
const W = 380, H = 280, PAD = 30;

function toSvg(x, y) {
  return {
    sx: PAD + ((x - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD),
    sy: H - PAD - ((y - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD),
  };
}

function drawPath(path, color) {
  return path.slice(1).map((pt, i) => {
    const a = toSvg(path[i].x, path[i].y);
    const b = toSvg(pt.x, pt.y);
    return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={color} strokeWidth="1.8" opacity="0.85" />;
  });
}

function ellipseContour(kappa, level) {
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const angle = (i / 120) * 2 * Math.PI;
    const x = Math.sqrt(2 * level / kappa) * Math.cos(angle);
    const y = Math.sqrt(2 * level) * Math.sin(angle);
    if (x < XMIN || x > XMAX || y < YMIN || y > YMAX) continue;
    const { sx, sy } = toSvg(x, y);
    pts.push(`${sx},${sy}`);
  }
  return pts.length > 2 ? pts.join(' ') : null;
}

function InteractiveMomentum() {
  const [kappa, setKappa] = useState(10);
  const [beta, setBeta] = useState(0.8);
  const [steps, setSteps] = useState(15);

  const L = kappa, mu = 1;
  const lr = 2 / (L + mu); // optimal for GD
  const { grad } = makeF(kappa);
  const x0 = 2.5, y0 = 2.5;

  const pathGD = runGD(grad, x0, y0, 1 / L, steps);
  const pathMom = runMomentum(grad, x0, y0, lr * 0.7, beta, steps);

  const levels = [0.2, 0.6, 1.5, 3, 6];
  const contourColors = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: GD vs Momentum</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Compare gradient descent (red) vs momentum (green) on an ill-conditioned quadratic.
        Higher <InlineMath math="\kappa" /> makes GD oscillate more.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {levels.map((lv, i) => {
            const pts = ellipseContour(kappa, lv);
            return pts ? <polyline key={lv} points={pts} fill="none" stroke={contourColors[i]} strokeWidth="1" opacity="0.6" /> : null;
          })}
          {drawPath(pathGD, '#ef4444')}
          {drawPath(pathMom, '#10b981')}
          <circle cx={toSvg(x0, y0).sx} cy={toSvg(x0, y0).sy} r="6" fill="#f59e0b" />
          <circle cx={toSvg(0, 0).sx} cy={toSvg(0, 0).sy} r="5" fill="#8b5cf6" />
          <text x={toSvg(0, 0).sx + 7} y={toSvg(0, 0).sy - 5} fontSize="11" fill="#5b21b6">opt</text>
          {/* Legend */}
          <rect x={W - PAD - 90} y={PAD} width="86" height="40" fill="white" fillOpacity="0.85" rx="4" />
          <line x1={W - PAD - 82} y1={PAD + 12} x2={W - PAD - 60} y2={PAD + 12} stroke="#ef4444" strokeWidth="2" />
          <text x={W - PAD - 56} y={PAD + 16} fontSize="10" fill="#374151">GD</text>
          <line x1={W - PAD - 82} y1={PAD + 28} x2={W - PAD - 60} y2={PAD + 28} stroke="#10b981" strokeWidth="2" />
          <text x={W - PAD - 56} y={PAD + 32} fontSize="10" fill="#374151">Momentum</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Condition <InlineMath math={`\\kappa = ${kappa}`} />
            </label>
            <input type="range" min="2" max="30" step="1" value={kappa} onChange={e => setKappa(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Momentum <InlineMath math={`\\beta = ${beta.toFixed(2)}`} />
            </label>
            <input type="range" min="0" max="0.98" step="0.02" value={beta} onChange={e => setBeta(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Iterations: {steps}
            </label>
            <input type="range" min="5" max="40" step="1" value={steps} onChange={e => setSteps(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MomentumMethods() {
  return (
    <div className="space-y-8">
      <InteractiveMomentum />

      <DefinitionBlock title="Heavy Ball Method">
        <p>
          The <strong>heavy ball method</strong> (Polyak 1964) adds a momentum term to gradient descent:
        </p>
        <BlockMath math="x_{t+1} = x_t - \eta \nabla f(x_t) + \beta (x_t - x_{t-1})," />
        <p className="mt-2">
          where <InlineMath math="\beta \in [0,1)" /> is the momentum coefficient. Equivalently, with
          velocity <InlineMath math="v_t = x_t - x_{t-1}" />:
        </p>
        <BlockMath math="v_{t+1} = \beta v_t - \eta \nabla f(x_t), \quad x_{t+1} = x_t + v_{t+1}." />
      </DefinitionBlock>

      <DefinitionBlock title="Nesterov Accelerated Gradient">
        <p>
          <strong>Nesterov's accelerated gradient</strong> (NAG) evaluates the gradient at a
          <em>look-ahead</em> point:
        </p>
        <BlockMath math="\begin{aligned} y_{t+1} &= x_t + \beta_t(x_t - x_{t-1}) \\ x_{t+1} &= y_{t+1} - \eta \nabla f(y_{t+1}), \end{aligned}" />
        <p className="mt-2">
          with <InlineMath math="\beta_t = (t-1)/(t+2)" /> or the optimal schedule. This achieves
          the <strong>optimal</strong> first-order convergence rate for convex functions.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Optimal Convergence Rate (Nesterov)"
        proof="Nesterov showed via an adversarial function construction that no first-order method can achieve better than O(1/T²) for smooth convex optimization. NAG matches this lower bound. The proof of NAG's O(1/T²) rate uses a Lyapunov function argument with a carefully chosen energy."
      >
        <p>
          For a convex, <InlineMath math="L" />-smooth function, Nesterov's accelerated gradient achieves:
        </p>
        <BlockMath math="f(x_T) - f^* \leq \frac{2L\|x_0 - x^*\|^2}{(T+1)^2}." />
        <p className="mt-2">
          This is <em>optimal</em> for first-order methods — no algorithm using only gradients can
          do better for this function class. Compare to GD's <InlineMath math="O(1/T)" /> rate.
        </p>
        <p className="mt-2">
          For <InlineMath math="\mu" />-strongly convex functions, the linear rate improves to:
        </p>
        <BlockMath math="f(x_T) - f^* \leq L\|x_0 - x^*\|^2 \exp\!\left(-\frac{T}{\sqrt{\kappa}}\right)." />
      </TheoremBlock>

      <TheoremBlock
        title="Heavy Ball for Quadratics"
        proof="For a quadratic f(x) = ½x⊤Ax, the update is a linear recurrence. The optimal momentum β = ((√κ-1)/(√κ+1))² and step η = (2/(√L+√μ))² yield convergence factor (√κ-1)/(√κ+1) per step, matching the lower bound."
      >
        <p>
          For a strongly convex quadratic with condition number <InlineMath math="\kappa" />, the heavy ball
          method with optimal parameters converges as:
        </p>
        <BlockMath math="\|x_T - x^*\| \leq \left(\frac{\sqrt{\kappa}-1}{\sqrt{\kappa}+1}\right)^T \|x_0 - x^*\|." />
        <p className="mt-2">
          This is <InlineMath math="\sqrt{\kappa}" /> times faster than GD (which converges as
          <InlineMath math="((\kappa-1)/(\kappa+1))^T" />).
        </p>
      </TheoremBlock>

      <ExampleBlock title="Momentum in Deep Learning">
        <p>
          In practice, <strong>SGD with momentum</strong> is widely used with <InlineMath math="\beta = 0.9" />.
          The update accumulates an exponentially weighted moving average of gradients:
        </p>
        <BlockMath math="m_t = \beta m_{t-1} + (1-\beta)\nabla f(x_t), \quad x_{t+1} = x_t - \eta m_t." />
        <p className="mt-2">
          Momentum helps in saddle points (by carrying velocity through flat regions) and on
          ill-conditioned curvature (by dampening oscillations in high-curvature directions).
        </p>
      </ExampleBlock>

      <WarningBlock title="Heavy Ball Does Not Always Converge for Nonconvex Functions">
        <p>
          Despite its success in practice, heavy ball momentum does <em>not</em> have guaranteed
          convergence for general nonconvex functions. The momentum term can cause the iterates
          to overshoot minima. Nesterov's method also lacks convergence guarantees for general
          nonconvex objectives. In practice, adaptive methods like Adam are preferred for
          nonconvex deep learning problems.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

def sgd_momentum(grad_f, x0, lr=0.01, beta=0.9, n_iters=200):
    x = np.asarray(x0, dtype=float)
    v = np.zeros_like(x)
    history = [x.copy()]
    for _ in range(n_iters):
        g = grad_f(x)
        v = beta * v - lr * g
        x = x + v
        history.append(x.copy())
    return x, history

def nesterov(grad_f, x0, lr=0.01, n_iters=200):
    x = np.asarray(x0, dtype=float)
    y = x.copy()
    history = [x.copy()]
    for t in range(1, n_iters + 1):
        x_prev = x.copy()
        x = y - lr * grad_f(y)
        beta_t = (t - 1) / (t + 2)
        y = x + beta_t * (x - x_prev)
        history.append(x.copy())
    return x, history

# Test on ill-conditioned quadratic
kappa = 50
A = np.diag([kappa] + [1.0] * 9)  # condition number = kappa
b = np.ones(10)
f = lambda x: 0.5 * x @ A @ x - b @ x
grad_f = lambda x: A @ x - b
x_opt = np.linalg.solve(A, b)
f_opt = f(x_opt)

L = float(np.diag(A).max())
x0 = np.zeros(10)

_, hist_gd = sgd_momentum(grad_f, x0, lr=1/L, beta=0.0, n_iters=300)
_, hist_mom = sgd_momentum(grad_f, x0, lr=1/L, beta=0.9, n_iters=300)
_, hist_nes = nesterov(grad_f, x0, lr=1/L, n_iters=300)

for name, hist in [("GD", hist_gd), ("Momentum", hist_mom), ("Nesterov", hist_nes)]:
    gap = f(hist[-1]) - f_opt
    print(f"{name:10s}: f(x_T) - f* = {gap:.2e}")
`} />
    </div>
  );
}
