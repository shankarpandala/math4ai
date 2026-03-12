import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// f(x) = 0.5 * x^2 (scalar), noisy gradient = x + noise
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function generateTrajectory(sigma, batchSize, nSteps, lr, seed = 42) {
  const rand = mulberry32(seed);
  // sigma_eff = sigma / sqrt(batchSize)
  const sigmaEff = sigma / Math.sqrt(batchSize);
  let x = 2.5;
  const traj = [{ t: 0, x, noise: 0 }];
  for (let t = 1; t <= nSteps; t++) {
    // Box-Muller for normal sample
    const u1 = rand(), u2 = rand();
    const n = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
    const noiseVal = sigmaEff * n;
    const trueGrad = x;
    const noisyGrad = trueGrad + noiseVal;
    x = x - lr * noisyGrad;
    traj.push({ t, x, noise: noiseVal });
  }
  return traj;
}

function InteractiveSGD() {
  const [sigma, setSigma] = useState(1.5);
  const [batchSize, setBatchSize] = useState(1);
  const [lr, setLr] = useState(0.15);

  const nSteps = 50;
  const trajSGD = generateTrajectory(sigma, batchSize, nSteps, lr, 42);
  const trajGD = generateTrajectory(0, 1, nSteps, lr, 42);

  const W = 400, H = 220, PAD = 35;
  const tMin = 0, tMax = nSteps;
  const xMin = -1.5, xMax = 3;

  function toSvg(t, x) {
    return {
      sx: PAD + ((t - tMin) / (tMax - tMin)) * (W - 2 * PAD),
      sy: H - PAD - ((x - xMin) / (xMax - xMin)) * (H - 2 * PAD),
    };
  }

  const sgdPts = trajSGD.map(({ t, x }) => {
    const { sx, sy } = toSvg(t, x);
    return `${sx},${sy}`;
  }).join(' ');

  const gdPts = trajGD.map(({ t, x }) => {
    const { sx, sy } = toSvg(t, x);
    return `${sx},${sy}`;
  }).join(' ');

  const zeroLine = toSvg(0, 0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: SGD vs Full Gradient</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Minimizing <InlineMath math="f(x)=\tfrac{1}{2}x^2" />. Noisy gradient has variance
        <InlineMath math="\sigma^2/B" /> where <InlineMath math="B" /> is batch size.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {/* Zero line */}
          <line x1={PAD} y1={zeroLine.sy} x2={W - PAD} y2={zeroLine.sy} stroke="#10b981" strokeWidth="1" strokeDasharray="4,2" />
          <text x={PAD + 4} y={zeroLine.sy - 4} fontSize="10" fill="#065f46">x*=0</text>
          {/* GD trajectory */}
          <polyline points={gdPts} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {/* SGD trajectory */}
          <polyline points={sgdPts} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.85" />
          {/* Legend */}
          <rect x={W - PAD - 95} y={PAD} width="91" height="40" fill="white" fillOpacity="0.9" rx="4" />
          <line x1={W - PAD - 87} y1={PAD + 12} x2={W - PAD - 65} y2={PAD + 12} stroke="#3b82f6" strokeWidth="2" />
          <text x={W - PAD - 61} y={PAD + 16} fontSize="10" fill="#374151">Full GD</text>
          <line x1={W - PAD - 87} y1={PAD + 28} x2={W - PAD - 65} y2={PAD + 28} stroke="#ef4444" strokeWidth="1.5" />
          <text x={W - PAD - 61} y={PAD + 32} fontSize="10" fill="#374151">SGD</text>
          <text x={PAD + 4} y={H - PAD - 4} fontSize="10" fill="#374151">iterations →</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Noise <InlineMath math={`\\sigma = ${sigma.toFixed(1)}`} />
            </label>
            <input type="range" min="0.1" max="4" step="0.1" value={sigma} onChange={e => setSigma(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Batch size <InlineMath math={`B = ${batchSize}`} />
            </label>
            <input type="range" min="1" max="32" step="1" value={batchSize} onChange={e => setBatchSize(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              LR <InlineMath math={`\\eta = ${lr.toFixed(2)}`} />
            </label>
            <input type="range" min="0.02" max="0.45" step="0.01" value={lr} onChange={e => setLr(+e.target.value)} className="w-full" />
          </div>
          <div className="rounded bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-xs">
            <p>Eff. noise σ/√B = {(sigma / Math.sqrt(batchSize)).toFixed(3)}</p>
            <p>Larger batch → less noise</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StochasticGradientDescent() {
  return (
    <div className="space-y-8">
      <InteractiveSGD />

      <DefinitionBlock title="Stochastic Gradient Descent">
        <p>
          For an objective <InlineMath math="f(x) = \mathbb{E}_\xi[F(x, \xi)]" /> (or
          finite sum <InlineMath math="\frac{1}{n}\sum_i f_i(x)" />), SGD uses a noisy gradient
          estimate at each step:
        </p>
        <BlockMath math="x_{t+1} = x_t - \eta_t \tilde{\nabla} f(x_t), \quad \mathbb{E}[\tilde{\nabla} f(x_t) | x_t] = \nabla f(x_t)." />
        <p className="mt-2">
          <strong>Mini-batch SGD</strong> averages gradients over a batch of <InlineMath math="B" /> samples,
          reducing variance by a factor of <InlineMath math="B" />:
        </p>
        <BlockMath math="\tilde{\nabla} f(x) = \frac{1}{B}\sum_{i \in \mathcal{B}} \nabla f_i(x), \quad \operatorname{Var}[\tilde{\nabla}] = \frac{\sigma^2}{B}." />
      </DefinitionBlock>

      <DefinitionBlock title="Step Size Schedules">
        <p>Common step size schedules for SGD:</p>
        <BlockMath math="\begin{aligned} &\text{Constant: } & \eta_t &= \eta \\ &\text{Polynomial: } & \eta_t &= \eta_0 / (1 + t)^\alpha \\ &\text{Square root: } & \eta_t &= \eta_0 / \sqrt{t} \\ &\text{Cosine annealing: } & \eta_t &= \eta_{\min} + \tfrac{1}{2}(\eta_{\max}-\eta_{\min})(1 + \cos(\pi t/T)) \end{aligned}" />
        <p className="mt-2">
          The Robbins-Monro conditions for convergence require
          <InlineMath math="\sum_t \eta_t = \infty" /> and <InlineMath math="\sum_t \eta_t^2 < \infty" />.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="SGD Convergence (Convex, Non-Smooth)"
        proof="Using the update equation and taking expectations: E[||x_{t+1}-x*||²] ≤ E[||x_t-x*||²] - 2η_t(f(x_t)-f*) + η_t² G². Summing and choosing η_t = R/(G√T) gives the stated bound, where we use Jensen's inequality on the averaged iterates."
      >
        <p>
          For a convex function with subgradient bound <InlineMath math="\|\tilde{\nabla} f\| \leq G" />
          and step size <InlineMath math="\eta_t = R/(G\sqrt{t})" />:
        </p>
        <BlockMath math="\mathbb{E}\!\left[f\!\left(\frac{1}{T}\sum_{t=1}^T x_t\right)\right] - f^* \leq \frac{RG}{\sqrt{T}}." />
        <p className="mt-2">
          For smooth strongly convex objectives with constant step size <InlineMath math="\eta \leq 1/L" />,
          SGD converges to a neighborhood of <InlineMath math="x^*" /> with radius proportional to
          <InlineMath math="\eta \sigma^2 / \mu" />.
        </p>
      </TheoremBlock>

      <ExampleBlock title="SGD in Deep Learning Practice">
        <p>In training neural networks, each SGD step samples a mini-batch and backpropagates:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Epoch</strong>: one pass through the full dataset.</li>
          <li><strong>Batch size</strong>: typically 32–512 for vision, 1K–8K for LLMs.</li>
          <li><strong>Learning rate warmup</strong>: ramp from 0 to <InlineMath math="\eta_{\max}" /> over first few epochs to stabilize training.</li>
          <li><strong>Linear scaling rule</strong>: when multiplying batch size by <InlineMath math="k" />, multiply LR by <InlineMath math="k" /> (Goyal et al.).</li>
        </ul>
      </ExampleBlock>

      <WarningBlock title="SGD Does Not Converge to the Exact Minimum with Fixed Step Size">
        <p>
          With a fixed (non-diminishing) step size, SGD oscillates in a neighborhood of
          <InlineMath math="x^*" /> with radius <InlineMath math="\Theta(\eta \sigma^2/\mu)" />.
          To achieve <InlineMath math="\epsilon" />-accuracy, one must use diminishing step sizes
          or a two-phase strategy (constant, then decay). This is in contrast to full GD, which
          converges exactly with a fixed step size.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

class SGD:
    def __init__(self, lr=0.01, lr_schedule='constant', decay=0.99):
        self.lr0 = lr
        self.schedule = lr_schedule
        self.decay = decay
        self.t = 0

    def step(self, x, grad):
        self.t += 1
        if self.schedule == 'constant':
            lr = self.lr0
        elif self.schedule == 'decay':
            lr = self.lr0 * self.decay**self.t
        elif self.schedule == 'sqrt':
            lr = self.lr0 / np.sqrt(self.t)
        return x - lr * grad

# Logistic regression with SGD
rng = np.random.default_rng(42)
n, d = 1000, 20
X = rng.standard_normal((n, d))
w_true = rng.standard_normal(d)
y = (X @ w_true > 0).astype(float) * 2 - 1  # ±1 labels

def sigmoid(z): return 1 / (1 + np.exp(-np.clip(z, -50, 50)))

def logistic_loss_grad(w, X_batch, y_batch):
    z = y_batch * (X_batch @ w)
    prob = sigmoid(-z)
    loss = np.mean(np.log(1 + np.exp(-z)))
    grad = -np.mean((prob * y_batch)[:, None] * X_batch, axis=0)
    return loss, grad

w = np.zeros(d)
optimizer = SGD(lr=0.1, lr_schedule='sqrt')
batch_size = 32
losses = []

for epoch in range(10):
    perm = rng.permutation(n)
    epoch_loss = 0.0
    for i in range(0, n, batch_size):
        idx = perm[i:i + batch_size]
        loss, grad = logistic_loss_grad(w, X[idx], y[idx])
        w = optimizer.step(w, grad)
        epoch_loss += loss
    losses.append(epoch_loss / (n // batch_size))
    if (epoch + 1) % 3 == 0:
        print(f"Epoch {epoch+1}: avg loss = {losses[-1]:.4f}")
`} />
    </div>
  );
}
