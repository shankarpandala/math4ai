import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Simulate per-parameter effective learning rates for Adam vs SGD
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function simulateAdamSteps(nParams, nSteps, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, seed = 7) {
  const rand = mulberry32(seed);
  // Each parameter has a different "true gradient magnitude"
  const trueMags = Array.from({ length: nParams }, (_, i) => 0.01 + i * (2.0 / nParams));
  const m = new Array(nParams).fill(0);
  const v = new Array(nParams).fill(0);
  const effLRs = [];

  for (let t = 1; t <= nSteps; t++) {
    const stepEffLR = [];
    for (let i = 0; i < nParams; i++) {
      // Noisy gradient
      const g = trueMags[i] * (1 + 0.5 * (rand() * 2 - 1));
      m[i] = beta1 * m[i] + (1 - beta1) * g;
      v[i] = beta2 * v[i] + (1 - beta2) * g * g;
      const mHat = m[i] / (1 - Math.pow(beta1, t));
      const vHat = v[i] / (1 - Math.pow(beta2, t));
      const effLR = Math.abs(mHat) / (Math.sqrt(vHat) + eps);
      stepEffLR.push(effLR);
    }
    effLRs.push(stepEffLR);
  }
  return { trueMags, effLRs };
}

function InteractiveAdamLR() {
  const [beta1, setBeta1] = useState(0.9);
  const [beta2, setBeta2] = useState(0.999);
  const [showStep, setShowStep] = useState(50);

  const nParams = 12;
  const nSteps = 200;
  const { trueMags, effLRs } = simulateAdamSteps(nParams, nSteps, beta1, beta2);

  const stepIdx = Math.min(showStep, nSteps) - 1;
  const effLR = effLRs[Math.max(0, stepIdx)];

  const W = 400, H = 220, PAD = 40;
  const maxEff = Math.max(...effLR, 1.1);
  const maxMag = Math.max(...trueMags);

  function barX(i) { return PAD + (i / nParams) * (W - 2 * PAD); }
  const barW = (W - 2 * PAD) / nParams - 3;

  function toY(val, maxVal) {
    return H - PAD - (val / maxVal) * (H - 2 * PAD);
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Adam Adaptive Learning Rates</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Each bar shows the effective step size per parameter (blue = Adam effective LR, orange = true gradient magnitude).
        Adam normalizes by the second moment, giving roughly equal effective steps.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {/* True gradient magnitude bars */}
          {trueMags.map((mag, i) => (
            <rect
              key={`mag-${i}`}
              x={barX(i)}
              y={toY(mag, maxMag)}
              width={barW}
              height={(mag / maxMag) * (H - 2 * PAD)}
              fill="#f97316"
              opacity="0.5"
            />
          ))}
          {/* Adam effective LR bars */}
          {effLR.map((lr, i) => (
            <rect
              key={`lr-${i}`}
              x={barX(i) + barW / 4}
              y={toY(lr, maxEff)}
              width={barW / 2}
              height={(lr / maxEff) * (H - 2 * PAD)}
              fill="#3b82f6"
              opacity="0.85"
            />
          ))}
          {/* Legend */}
          <rect x={PAD + 4} y={PAD + 4} width="130" height="36" fill="white" fillOpacity="0.9" rx="3" />
          <rect x={PAD + 10} y={PAD + 12} width="12" height="10" fill="#f97316" opacity="0.6" />
          <text x={PAD + 26} y={PAD + 22} fontSize="10" fill="#374151">True |gradient|</text>
          <rect x={PAD + 10} y={PAD + 26} width="12" height="10" fill="#3b82f6" opacity="0.9" />
          <text x={PAD + 26} y={PAD + 36} fontSize="10" fill="#374151">Adam eff. LR</text>
          <text x={PAD + 4} y={H - PAD - 4} fontSize="9" fill="#6b7280">parameter index →</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`\\beta_1 = ${beta1.toFixed(2)}`} /> (momentum)
            </label>
            <input type="range" min="0.5" max="0.99" step="0.01" value={beta1} onChange={e => setBeta1(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`\\beta_2 = ${beta2.toFixed(3)}`} /> (second moment)
            </label>
            <input type="range" min="0.9" max="0.9999" step="0.001" value={beta2} onChange={e => setBeta2(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Step t = {showStep}
            </label>
            <input type="range" min="1" max={nSteps} step="1" value={showStep} onChange={e => setShowStep(+e.target.value)} className="w-full" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Adam normalizes gradients by their running RMS, giving more uniform effective steps across parameters with different gradient scales.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdamAdaptiveMethods() {
  return (
    <div className="space-y-8">
      <InteractiveAdamLR />

      <DefinitionBlock title="Adam Optimizer">
        <p>
          <strong>Adam</strong> (Adaptive Moment Estimation, Kingma & Ba 2015) maintains exponential
          moving averages of gradients and squared gradients:
        </p>
        <BlockMath math="\begin{aligned} m_t &= \beta_1 m_{t-1} + (1-\beta_1) g_t \\ v_t &= \beta_2 v_{t-1} + (1-\beta_2) g_t^2 \\ \hat{m}_t &= m_t / (1-\beta_1^t), \quad \hat{v}_t = v_t / (1-\beta_2^t) \\ x_{t+1} &= x_t - \eta \cdot \hat{m}_t / (\sqrt{\hat{v}_t} + \epsilon) \end{aligned}" />
        <p className="mt-2">
          Default hyperparameters: <InlineMath math="\beta_1 = 0.9" />, <InlineMath math="\beta_2 = 0.999" />,
          <InlineMath math="\epsilon = 10^{-8}" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="AdaGrad and RMSprop">
        <p>
          <strong>AdaGrad</strong> (Duchi et al. 2011) adapts per-parameter learning rates using
          cumulative squared gradients:
        </p>
        <BlockMath math="x_{t+1} = x_t - \frac{\eta}{\sqrt{G_t + \epsilon}} \odot g_t, \quad G_t = \sum_{s=1}^t g_s \odot g_s." />
        <p className="mt-2">
          <strong>RMSprop</strong> (Hinton 2012) uses an exponential moving average instead to
          avoid the monotonically decreasing step size:
        </p>
        <BlockMath math="v_t = \rho v_{t-1} + (1-\rho) g_t^2, \quad x_{t+1} = x_t - \frac{\eta}{\sqrt{v_t + \epsilon}} g_t." />
      </DefinitionBlock>

      <TheoremBlock
        title="Adam Regret Bound (Online Convex Setting)"
        proof="Kingma & Ba showed that in the online convex setting with bounded gradients ||g_t||∞ ≤ G∞, the per-coordinate update satisfies a regret bound. The key insight is that the adaptive step sizes are bounded from below by η/G√T, giving the O(√T) total regret. The bias correction terms ensure the first few steps are not too large."
      >
        <p>
          Under the online convex framework with bounded gradients
          <InlineMath math="\|g_t\|_\infty \leq G_\infty" /> and bounded domain diameter
          <InlineMath math="D_\infty" />, Adam achieves regret:
        </p>
        <BlockMath math="\sum_{t=1}^T f_t(x_t) - \min_x \sum_{t=1}^T f_t(x) \leq \frac{D_\infty^2}{2\eta(1-\beta_1)} \sum_{i=1}^d \sqrt{T \hat{v}_{T,i}} + \frac{\eta \sqrt{T}}{(1-\beta_1)(1-\beta_2)} G_\infty." />
      </TheoremBlock>

      <TheoremBlock
        title="AMSGrad Fix"
        proof="Reddi et al. (2018) showed Adam can diverge due to the exponential moving average decaying too quickly. AMSGrad uses the maximum past v̂_t to ensure step sizes are non-increasing: v̂_t = max(v̂_{t-1}, v_t), guaranteeing convergence."
      >
        <p>
          <strong>AMSGrad</strong> fixes a potential divergence issue in Adam by using the maximum
          of past second moments:
        </p>
        <BlockMath math="\hat{v}_t = \max(\hat{v}_{t-1},\, v_t / (1-\beta_2^t)), \quad x_{t+1} = x_t - \frac{\eta \hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}." />
        <p className="mt-2">
          This guarantees non-increasing per-coordinate step sizes, recovering convergence guarantees.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Choosing Adam Hyperparameters">
        <p>Practical guidelines for Adam in deep learning:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Learning rate</strong>: 1e-3 (default), tune in range [1e-4, 1e-2].</li>
          <li><strong>β₁ = 0.9</strong>: momentum. Lower for noisy gradients.</li>
          <li><strong>β₂ = 0.999</strong>: second moment decay. Use 0.95–0.99 for transformers.</li>
          <li><strong>ε = 1e-8</strong>: prevents division by zero. Use 1e-6 for mixed precision training.</li>
          <li><strong>Weight decay</strong>: use AdamW (decoupled weight decay) rather than L2 regularization within Adam.</li>
        </ul>
      </ExampleBlock>

      <WarningBlock title="Adam May Generalize Worse Than SGD with Momentum">
        <p>
          Despite faster convergence during training, Adam and adaptive methods often generalize
          worse than well-tuned SGD with momentum on image classification tasks (Wilson et al., 2017).
          This may be because the adaptive step sizes escape flat minima more aggressively, landing
          in sharp minima that have poor generalization. AdamW (weight decay) and careful tuning
          of <InlineMath math="\epsilon" /> help mitigate this.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

class Adam:
    def __init__(self, lr=1e-3, beta1=0.9, beta2=0.999, eps=1e-8, weight_decay=0.0):
        self.lr = lr
        self.beta1, self.beta2, self.eps = beta1, beta2, eps
        self.wd = weight_decay
        self.m, self.v, self.t = None, None, 0

    def step(self, params, grads):
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)
        self.t += 1
        g = grads + self.wd * params  # AdamW: separate weight decay
        self.m = self.beta1 * self.m + (1 - self.beta1) * g
        self.v = self.beta2 * self.v + (1 - self.beta2) * g**2
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)
        return params - self.lr * m_hat / (np.sqrt(v_hat) + self.eps)

# Compare Adam vs SGD on Rosenbrock function (non-convex, ill-conditioned)
def rosenbrock(x): return (1 - x[0])**2 + 100*(x[1] - x[0]**2)**2
def rosenbrock_grad(x):
    return np.array([-2*(1-x[0]) - 400*x[0]*(x[1]-x[0]**2),
                     200*(x[1]-x[0]**2)])

x_adam = np.array([-1.5, 2.0])
x_sgd = np.array([-1.5, 2.0])
adam = Adam(lr=0.01)

for t in range(2000):
    g_adam = rosenbrock_grad(x_adam)
    x_adam = adam.step(x_adam, g_adam)
    g_sgd = rosenbrock_grad(x_sgd)
    x_sgd = x_sgd - 0.001 * g_sgd

print(f"Adam final: x={x_adam}, f={rosenbrock(x_adam):.6f}")
print(f"SGD final:  x={x_sgd}, f={rosenbrock(x_sgd):.6f}")
print(f"Optimum: x=[1,1], f=0")
`} />
    </div>
  );
}
