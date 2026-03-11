import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Loss surface helpers  L(x,y) = x² + 5y²
// ─────────────────────────────────────────────────────────────────────────────
function loss(x, y) {
  return x * x + 5 * y * y;
}
function gradX(x) {
  return 2 * x;
}
function gradY(y) {
  return 10 * y;
}

// Map (x,y) in domain [-3,3]×[-3,3] to SVG pixel coordinates
const SVG_W = 480;
const SVG_H = 360;
const DOM_XMIN = -3;
const DOM_XMAX = 3;
const DOM_YMIN = -3;
const DOM_YMAX = 3;

function toSVG(x, y) {
  const px = ((x - DOM_XMIN) / (DOM_XMAX - DOM_XMIN)) * SVG_W;
  const py = SVG_H - ((y - DOM_YMIN) / (DOM_YMAX - DOM_YMIN)) * SVG_H;
  return [px, py];
}

// Pre-compute contour ellipses for levels c: x²+5y²=c  → semi-axes a=√c, b=√(c/5)
const CONTOUR_LEVELS = [0.25, 1, 2.5, 5, 9, 14, 20];
const CONTOUR_COLORS = [
  '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe',
  '#ddd6fe', '#ede9fe', '#f5f3ff',
];

function ContourEllipse({ level, color }) {
  const [cx, cy] = toSVG(0, 0);
  const a = Math.sqrt(level); // x-axis radius in domain units
  const b = Math.sqrt(level / 5); // y-axis radius in domain units
  // Convert radii to SVG pixels
  const rx = (a / (DOM_XMAX - DOM_XMIN)) * SVG_W;
  const ry = (b / (DOM_YMAX - DOM_YMIN)) * SVG_H;
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.7}
    />
  );
}

// Arrow marker for gradient vectors
function GradientArrow({ x, y, gx, gy, scale = 0.08 }) {
  const [x1, y1] = toSVG(x, y);
  // gradient points uphill; we move downhill in SVG, so negate
  const [x2, y2] = toSVG(x - gx * scale, y - gy * scale);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  // arrowhead
  const ux = dx / len;
  const uy = dy / len;
  const headLen = 7;
  const headAngle = 0.4;
  const ax1 = x2 - headLen * (ux * Math.cos(headAngle) - uy * Math.sin(headAngle));
  const ay1 = y2 - headLen * (uy * Math.cos(headAngle) + ux * Math.sin(headAngle));
  const ax2 = x2 - headLen * (ux * Math.cos(-headAngle) - uy * Math.sin(-headAngle));
  const ay2 = y2 - headLen * (uy * Math.cos(-headAngle) + ux * Math.sin(-headAngle));
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.9} />
      <polyline
        points={`${ax1},${ay1} ${x2},${y2} ${ax2},${ay2}`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={2}
        strokeOpacity={0.9}
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive gradient descent visualisation
// ─────────────────────────────────────────────────────────────────────────────
function GradientDescentViz() {
  const [lr, setLr] = useState(0.12);
  const [path, setPath] = useState([{ x: 2.5, y: 2.2 }]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const MAX_STEPS = 60;

  const start = { x: 2.5, y: 2.2 };

  function reset() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPath([start]);
  }

  function runStep(currentPath) {
    const last = currentPath[currentPath.length - 1];
    const nx = last.x - lr * gradX(last.x);
    const ny = last.y - lr * gradY(last.y);
    return [...currentPath, { x: nx, y: ny }];
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setPath((prev) => {
          if (prev.length >= MAX_STEPS) {
            setRunning(false);
            clearInterval(intervalRef.current);
            return prev;
          }
          return runStep(prev);
        });
      }, 120);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, lr]);

  // polyline points string
  const polyPoints = path
    .map(({ x, y }) => {
      const [px, py] = toSVG(x, y);
      return `${px},${py}`;
    })
    .join(' ');

  const last = path[path.length - 1];
  const lossVal = loss(last.x, last.y).toFixed(4);
  const stepCount = path.length - 1;

  // Show gradient arrow at last 3 positions (skip if very close to origin)
  const arrowPoints = path.slice(-4, -1);

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100">
        Interactive: Gradient Descent on{' '}
        <InlineMath math="L(x,y) = x^2 + 5y^2" />
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Starting point{' '}
        <InlineMath math="(x_0, y_0) = (2.5,\,2.2)" />. Yellow arrows show the
        descent direction at recent iterates.
      </p>

      {/* SVG canvas */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-700">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ display: 'block' }}
        >
          {/* Contour ellipses */}
          {CONTOUR_LEVELS.map((c, i) => (
            <ContourEllipse key={c} level={c} color={CONTOUR_COLORS[i]} />
          ))}

          {/* Axes */}
          <line
            x1={SVG_W / 2}
            y1={0}
            x2={SVG_W / 2}
            y2={SVG_H}
            stroke="#4b5563"
            strokeWidth={0.8}
            strokeDasharray="4 3"
          />
          <line
            x1={0}
            y1={SVG_H / 2}
            x2={SVG_W}
            y2={SVG_H / 2}
            stroke="#4b5563"
            strokeWidth={0.8}
            strokeDasharray="4 3"
          />

          {/* Trajectory path */}
          {path.length > 1 && (
            <polyline
              points={polyPoints}
              fill="none"
              stroke="#34d399"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Gradient arrows */}
          {arrowPoints.map((pt, i) => (
            <GradientArrow
              key={i}
              x={pt.x}
              y={pt.y}
              gx={gradX(pt.x)}
              gy={gradY(pt.y)}
              scale={lr * 0.7}
            />
          ))}

          {/* Path dots */}
          {path.map((pt, i) => {
            const [px, py] = toSVG(pt.x, pt.y);
            const isLast = i === path.length - 1;
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={isLast ? 6 : 3}
                fill={isLast ? '#34d399' : '#6ee7b7'}
                fillOpacity={isLast ? 1 : 0.6}
                stroke={isLast ? '#fff' : 'none'}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Origin marker (minimum) */}
          <circle cx={SVG_W / 2} cy={SVG_H / 2} r={5} fill="#f87171" strokeWidth={2} stroke="#fff" />
          <text x={SVG_W / 2 + 8} y={SVG_H / 2 - 6} fill="#f87171" fontSize="11" fontFamily="monospace">
            min
          </text>

          {/* Axis labels */}
          <text x={SVG_W - 12} y={SVG_H / 2 - 6} fill="#9ca3af" fontSize="11" fontFamily="serif" fontStyle="italic">x</text>
          <text x={SVG_W / 2 + 6} y={14} fill="#9ca3af" fontSize="11" fontFamily="serif" fontStyle="italic">y</text>
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Learning rate <InlineMath math="\eta" />
          </label>
          <input
            type="range"
            min={0.01}
            max={0.4}
            step={0.01}
            value={lr}
            onChange={(e) => {
              setLr(parseFloat(e.target.value));
              reset();
            }}
            className="w-36 accent-indigo-500"
          />
          <span className="w-12 rounded-md bg-indigo-100 px-2 py-0.5 text-center text-xs font-mono font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {lr.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              running
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {running ? 'Pause' : 'Run'}
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap gap-4">
        <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">Steps: </span>
          <span className="font-bold text-gray-800 dark:text-gray-100">{stepCount}</span>
        </div>
        <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">
            <InlineMath math="L(\theta_t)" />:{' '}
          </span>
          <span className="font-bold text-gray-800 dark:text-gray-100">{lossVal}</span>
        </div>
        <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">
            <InlineMath math="(x,y)" />:{' '}
          </span>
          <span className="font-bold font-mono text-gray-800 dark:text-gray-100">
            ({last.x.toFixed(3)}, {last.y.toFixed(3)})
          </span>
        </div>
        {lr > 0.2 && (
          <div className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            Warning: large learning rate may cause oscillation
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Python code string
// ─────────────────────────────────────────────────────────────────────────────
const GD_PYTHON_CODE = `import numpy as np
import matplotlib.pyplot as plt

def f(x): return x**2 - 4*x + 4
def grad_f(x): return 2*x - 4

# Gradient descent
def gradient_descent(x0, lr, n_steps):
    x = x0
    history = [x]
    for _ in range(n_steps):
        x = x - lr * grad_f(x)
        history.append(x)
    return history

# Test different learning rates
for lr in [0.1, 0.5, 0.9, 1.1]:
    hist = gradient_descent(x0=10.0, lr=lr, n_steps=20)
    print(f"lr={lr}: final x = {hist[-1]:.4f}, steps = {len(hist)}")

# Plot convergence
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
xs = np.linspace(-1, 11, 300)
axes[0].plot(xs, f(xs), 'b-', linewidth=2, label='f(x)')
for lr, color in zip([0.1, 0.5, 0.9], ['green', 'orange', 'red']):
    hist = gradient_descent(x0=10.0, lr=lr, n_steps=20)
    axes[0].plot(hist, f(np.array(hist)), 'o-', color=color,
                 markersize=4, label=f'lr={lr}')
axes[0].set_xlabel('x'); axes[0].set_ylabel('f(x)')
axes[0].legend(); axes[0].set_title('Trajectory on f(x)')

for lr, color in zip([0.1, 0.5, 0.9], ['green', 'orange', 'red']):
    hist = gradient_descent(x0=10.0, lr=lr, n_steps=20)
    axes[1].plot(f(np.array(hist)), 'o-', color=color, label=f'lr={lr}')
axes[1].set_xlabel('Iteration'); axes[1].set_ylabel('f(x) loss')
axes[1].legend(); axes[1].set_title('Loss vs. Iteration')
plt.tight_layout(); plt.show()

# Neural network gradient descent (parameter dict version)
def sgd_update(params, grads, lr=0.01):
    return {k: params[k] - lr * grads[k] for k in params}

# Mini-batch SGD simulation
def minibatch_sgd(X, y, w, lr=0.01, batch_size=32, n_epochs=10):
    n = len(X)
    loss_history = []
    for epoch in range(n_epochs):
        indices = np.random.permutation(n)
        epoch_loss = 0.0
        for start in range(0, n, batch_size):
            batch_idx = indices[start:start + batch_size]
            X_b, y_b = X[batch_idx], y[batch_idx]
            # MSE loss gradient: (2/|B|) X^T (Xw - y)
            pred = X_b @ w
            grad = (2 / len(batch_idx)) * X_b.T @ (pred - y_b)
            w = w - lr * grad
            epoch_loss += np.mean((pred - y_b)**2)
        loss_history.append(epoch_loss / (n // batch_size))
        print(f"Epoch {epoch+1}: loss = {loss_history[-1]:.4f}")
    return w, loss_history
`;

// ─────────────────────────────────────────────────────────────────────────────
// References
// ─────────────────────────────────────────────────────────────────────────────
const GD_REFERENCES = [
  {
    authors: 'Cauchy, A.-L.',
    year: 1847,
    title: 'Méthode générale pour la résolution des systèmes d\'équations simultanées',
    venue: 'Compte Rendu des Séances de l\'Académie des Sciences',
    type: 'foundational',
    whyImportant:
      'First publication of the method of steepest descent, the ancestor of all gradient-based optimizers.',
  },
  {
    authors: 'Robbins, H. & Monro, S.',
    year: 1951,
    title: 'A Stochastic Approximation Method',
    venue: 'The Annals of Mathematical Statistics',
    type: 'foundational',
    whyImportant:
      'Introduced stochastic approximation, giving theoretical foundations for SGD with diminishing step sizes.',
  },
  {
    authors: 'Bottou, L., Curtis, F. E., & Nocedal, J.',
    year: 2018,
    title: 'Optimization Methods for Large-Scale Machine Learning',
    venue: 'SIAM Review, 60(2)',
    url: 'https://arxiv.org/abs/1606.04838',
    type: 'survey',
    whyImportant:
      'Comprehensive survey of SGD variants, convergence theory, and variance reduction methods for ML.',
  },
  {
    authors: 'Nesterov, Y.',
    year: 2004,
    title: 'Introductory Lectures on Stochastic Optimization',
    venue: 'Springer Optimization and Its Applications',
    type: 'textbook',
    whyImportant:
      'Foundational text establishing complexity bounds for smooth and strongly-convex optimization.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main section component
// ─────────────────────────────────────────────────────────────────────────────
export default function GradientDescentSection() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Title */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
          Chapter 4 · First-Order Methods
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          §1 — Gradient Descent
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          The fundamental iterative algorithm for minimizing differentiable functions, and the backbone of modern deep learning training.
        </p>
      </div>

      {/* 1. Historical note */}
      <NoteBlock type="historical" title="Historical Context">
        <p>
          Augustin-Louis Cauchy introduced the <em>method of steepest descent</em> in 1847 as a
          general procedure for solving systems of equations. The core idea — follow the negative
          gradient — remained largely academic for over a century. The modern, stochastic variant
          gained prominence after{' '}
          <strong>Robbins &amp; Monro (1951)</strong> published their seminal stochastic
          approximation framework, which provided convergence guarantees for noisy gradient
          estimates. With the deep learning revolution of the 2010s, stochastic gradient descent
          (SGD) became the de-facto workhorse for training neural networks with millions to
          billions of parameters.
        </p>
      </NoteBlock>

      {/* 2. Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Motivation
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          In supervised learning we seek parameters{' '}
          <InlineMath math="\theta \in \mathbb{R}^d" /> that minimise an empirical loss:
        </p>
        <BlockMath math="\min_{\theta} \; L(\theta) \;=\; \frac{1}{n}\sum_{i=1}^{n} \ell\!\left(f_\theta(x_i),\, y_i\right)" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          For neural networks, <InlineMath math="L" /> is typically the cross-entropy or mean
          squared error over training data. Setting the gradient to zero analytically,{' '}
          <InlineMath math="\nabla_\theta L(\theta) = 0" />, is generally intractable — the loss
          landscape is non-convex with millions of dimensions. Instead we{' '}
          <strong>iteratively descend</strong> the gradient: at each step we move a small amount
          in the direction of steepest descent.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Geometrically, <InlineMath math="-\nabla L(\theta)" /> is the direction of maximum
          decrease of <InlineMath math="L" /> at <InlineMath math="\theta" />. This follows
          directly from the first-order Taylor expansion:
        </p>
        <BlockMath math="L(\theta + \delta) \approx L(\theta) + \nabla L(\theta)^\top \delta" />
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          which is minimised over unit vectors <InlineMath math="\delta" /> by choosing{' '}
          <InlineMath math="\delta \propto -\nabla L(\theta)" />.
        </p>
      </section>

      {/* 3. Definition */}
      <DefinitionBlock
        label="Definition 4.1"
        title="Gradient Descent Update"
        definition="Given a differentiable loss $L : \mathbb{R}^d \to \mathbb{R}$ and learning rate $\eta > 0$, the gradient descent update rule is $\theta_{t+1} = \theta_t - \eta\,\nabla_\theta L(\theta_t)$, where $\nabla_\theta L(\theta_t) \in \mathbb{R}^d$ is the gradient of $L$ evaluated at the current iterate $\theta_t$."
        notation="$\eta$ is the learning rate (step size). $t = 0, 1, 2, \ldots$ indexes iterations."
      />

      {/* 4. Interactive visualization */}
      <GradientDescentViz />

      {/* Convergence section header */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Convergence Theory
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Before deriving rates, we recall two key smoothness conditions. A function{' '}
          <InlineMath math="L" /> is called:
        </p>
        <ul className="ml-4 list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>
              <InlineMath math="L" />-smooth
            </strong>{' '}
            (Lipschitz gradient) if{' '}
            <InlineMath math="\|\nabla L(x) - \nabla L(y)\| \leq L\|x - y\|" /> for all{' '}
            <InlineMath math="x, y" />. Equivalently,{' '}
            <InlineMath math="L(y) \leq L(x) + \nabla L(x)^\top(y-x) + \frac{L}{2}\|y-x\|^2" />{' '}
            (the <em>descent lemma</em>).
          </li>
          <li>
            <strong>
              <InlineMath math="\mu" />-strongly convex
            </strong>{' '}
            if{' '}
            <InlineMath math="L(y) \geq L(x) + \nabla L(x)^\top(y-x) + \frac{\mu}{2}\|y-x\|^2" />{' '}
            for all <InlineMath math="x, y" />, with <InlineMath math="\mu > 0" />.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The ratio <InlineMath math="\kappa = L/\mu \geq 1" /> is the{' '}
          <em>condition number</em> of the problem. Ill-conditioned problems (large{' '}
          <InlineMath math="\kappa" />) converge slowly with vanilla GD — the contour plot above
          illustrates this: the elongated ellipses of{' '}
          <InlineMath math="x^2 + 5y^2" /> yield <InlineMath math="\kappa = 5" />.
        </p>
      </section>

      {/* 5. Theorem: convex convergence */}
      <TheoremBlock
        label="Theorem 4.1"
        title="Sublinear Convergence for Smooth Convex Functions"
        statement="Let $L : \mathbb{R}^d \to \mathbb{R}$ be convex and $\beta$-smooth with minimum value $L^* = L(\theta^*)$. Gradient descent with step size $\eta = 1/\beta$ satisfies $L(\theta_t) - L^* \leq \dfrac{\|\theta_0 - \theta^*\|^2}{2\eta\, t}$ for all $t \geq 1$. In particular, to reach $\varepsilon$-accuracy requires at most $O(1/\varepsilon)$ iterations."
        proof="Apply the descent lemma with $y = \theta_{t+1}$ and $x = \theta_t$:
$L(\theta_{t+1}) \leq L(\theta_t) + \nabla L(\theta_t)^\top(\theta_{t+1} - \theta_t) + \frac{\beta}{2}\|\theta_{t+1} - \theta_t\|^2$.
Substituting the GD update $\theta_{t+1} - \theta_t = -\eta\nabla L(\theta_t)$ and $\eta = 1/\beta$:
$L(\theta_{t+1}) \leq L(\theta_t) - \frac{1}{2\beta}\|\nabla L(\theta_t)\|^2$.
By convexity: $L(\theta_t) - L^* \leq \nabla L(\theta_t)^\top(\theta_t - \theta^*)$. Using the per-step bound and summing a telescoping argument over $t$ steps yields the stated rate."
        corollaries={[
          "The $O(1/t)$ rate is tight for smooth convex functions.",
          "Nesterov's accelerated gradient descent (momentum) achieves the optimal $O(1/t^2)$ rate.",
        ]}
      />

      {/* 6. Theorem: strongly convex convergence */}
      <TheoremBlock
        label="Theorem 4.2"
        title="Linear Convergence under Strong Convexity"
        statement="If $L$ is $\mu$-strongly convex and $\beta$-smooth with condition number $\kappa = \beta/\mu$, then gradient descent with $\eta = 1/\beta$ achieves the linear (geometric) rate $\|\theta_t - \theta^*\|^2 \leq \left(1 - \frac{\mu}{\beta}\right)^t \|\theta_0 - \theta^*\|^2 = \left(1 - \frac{1}{\kappa}\right)^t \|\theta_0 - \theta^*\|^2.$ The number of iterations to reach $\varepsilon$-accuracy is $O(\kappa \log(1/\varepsilon))$."
        proof="Strong convexity gives: $\|\nabla L(\theta) - \nabla L(\theta^*)\|^2 \geq \mu \|\theta - \theta^*\|^2$ (co-coercivity of the gradient). Combined with the Lipschitz gradient condition and optimality of $\theta^*$ ($\nabla L(\theta^*)=0$), one shows the one-step contraction $\|\theta_{t+1} - \theta^*\|^2 \leq (1-\mu/\beta)\|\theta_t - \theta^*\|^2$. Iterating gives the stated geometric convergence."
        corollaries={[
          "Well-conditioned problems ($\\kappa \\approx 1$) converge rapidly; ill-conditioned ones ($\\kappa \\gg 1$) require preconditioning.",
          "For neural networks, $L$ is not strongly convex globally — these bounds apply locally near minima.",
        ]}
      />

      {/* 7. Example */}
      <ExampleBlock
        title="GD on a Quadratic in One Step"
        difficulty="beginner"
        problem="Apply gradient descent to $f(x) = x^2 - 4x + 4 = (x-2)^2$ with learning rate $\eta = 0.5$, starting from $x_0 = 0$. How many iterations are needed to reach the minimum $x^* = 2$?"
        solution={[
          {
            step: 'Compute the gradient',
            formula: "f'(x) = 2x - 4",
            explanation: 'This is a linear function of $x$, so GD on a quadratic is exact in finite steps.',
          },
          {
            step: 'Apply the update rule at $x_0 = 0$',
            formula: 'x_1 = x_0 - \\eta f\'(x_0) = 0 - 0.5 \\cdot (2 \\cdot 0 - 4) = 0 + 2 = 2',
            explanation: 'Remarkably, we reach the minimum $x^* = 2$ in exactly one step.',
          },
          {
            step: 'Why does this work in one step?',
            formula: '\\eta = 0.5 = \\frac{1}{\\beta}, \\quad \\beta = 2 \\text{ (Lipschitz constant of } f\')',
            explanation:
              'For a $\\mu$-strongly convex quadratic $f(x) = \\frac{a}{2}x^2 + bx + c$, choosing $\\eta = 1/a$ gives convergence in exactly one step. The condition number $\\kappa = \\beta/\\mu = 1$ means the level sets are circular — no oscillation.',
          },
          {
            step: 'Verify: $f(x_1) = f(2) = 0 = L^*$',
            formula: 'f(2) = 2^2 - 4\\cdot 2 + 4 = 4 - 8 + 4 = 0',
            explanation: 'Perfect convergence. In higher dimensions this is equivalent to GD on a spherical bowl.',
          },
        ]}
      />

      {/* 8. Warning */}
      <WarningBlock title="Pitfalls of Gradient Descent">
        <ul className="list-disc space-y-2 pl-4">
          <li>
            <strong>Learning rate too large</strong> (
            <InlineMath math="\eta > 2/\beta" />): the descent lemma is violated and GD
            diverges. The contour visualisation above demonstrates oscillatory divergence for{' '}
            <InlineMath math="\eta > 0.2" /> on the elongated bowl.
          </li>
          <li>
            <strong>Learning rate too small</strong>: the convergence rate{' '}
            <InlineMath math="O(\kappa/\varepsilon)" /> becomes prohibitive. In practice,
            learning rate schedules (warmup + decay) are essential.
          </li>
          <li>
            <strong>Non-convex loss surfaces</strong>: GD converges to a stationary point
            <InlineMath math="\nabla L(\theta) = 0" />, which may be a saddle point or a
            poor local minimum, not the global minimum. Saddle points are particularly
            prevalent in high dimensions (neural networks).
          </li>
          <li>
            <strong>Gradient vanishing/explosion</strong>: deep networks with sigmoid
            activations suffer from exponentially small or large gradients, making GD
            impractical without normalisation schemes (BatchNorm, LayerNorm).
          </li>
        </ul>
      </WarningBlock>

      {/* 9. Mini-batch SGD */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Mini-Batch Stochastic Gradient Descent
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Computing the full gradient{' '}
          <InlineMath math="\nabla L(\theta) = \frac{1}{n}\sum_{i=1}^n \nabla \ell_i(\theta)" />{' '}
          requires a pass over all <InlineMath math="n" /> training examples — prohibitively
          expensive when <InlineMath math="n = 10^7" />. Mini-batch SGD replaces it with a
          stochastic estimate using a random subset{' '}
          <InlineMath math="\mathcal{B} \subset [n]" /> of size{' '}
          <InlineMath math="|\mathcal{B}| = B \ll n" />:
        </p>
        <BlockMath math="\hat{g}_t = \frac{1}{B}\sum_{i \in \mathcal{B}_t} \nabla \ell_i(\theta_t) \approx \nabla L(\theta_t)" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          This is an <strong>unbiased</strong> estimator:{' '}
          <InlineMath math="\mathbb{E}[\hat{g}_t] = \nabla L(\theta_t)" />. The variance of the
          estimate scales as:
        </p>
        <BlockMath math="\text{Var}(\hat{g}_t) = \frac{\sigma^2}{B}" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          where <InlineMath math="\sigma^2" /> is the per-sample gradient variance. Larger{' '}
          <InlineMath math="B" /> reduces noise but increases the cost-per-step proportionally.
          Empirically, there is a <em>linear scaling rule</em> (Goyal et al., 2017): increasing{' '}
          <InlineMath math="B" /> by a factor of <InlineMath math="k" /> while also scaling{' '}
          <InlineMath math="\eta \leftarrow k\eta" /> approximately preserves convergence
          behaviour.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Batch Size B</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Gradient Noise</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Steps per Epoch</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">1</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Very high</td>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">n</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Online learning</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">32–256</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Moderate</td>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">n/B</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Deep learning default</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">n</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Zero (full batch)</td>
                <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">1</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Deterministic GD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. Python code */}
      <PythonCode
        code={GD_PYTHON_CODE}
        title="Gradient Descent & Mini-Batch SGD — NumPy"
        runnable
      />

      {/* References */}
      <ReferenceList references={GD_REFERENCES} />
    </div>
  );
}
