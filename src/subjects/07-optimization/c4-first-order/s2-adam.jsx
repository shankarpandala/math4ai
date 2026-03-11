import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Simulated convergence data for each optimizer on a generic loss landscape
// ─────────────────────────────────────────────────────────────────────────────

// We simulate loss curves for a 2-layer MLP-like problem.
// Data is pre-computed to avoid running actual optimization in the browser.
function generateLossCurves(steps = 100) {
  const data = [];
  for (let t = 1; t <= steps; t++) {
    // SGD: slow sublinear decay
    const sgd = 2.5 / Math.pow(t, 0.45) + 0.12 + 0.08 * Math.sin(t * 0.4) * Math.exp(-t / 30);
    // SGD + Momentum: faster but with slight oscillation early
    const momentum =
      2.0 / Math.pow(t, 0.65) + 0.08 + 0.12 * Math.sin(t * 0.7) * Math.exp(-t / 15);
    // Adam: fast early convergence, plateaus near a good solution
    const adam =
      1.8 / Math.pow(t, 0.9) + 0.05 + 0.04 * Math.cos(t * 0.3) * Math.exp(-t / 40);
    // AdamW: slightly better generalisation plateau than Adam
    const adamw =
      1.8 / Math.pow(t, 0.92) + 0.042 + 0.035 * Math.cos(t * 0.28) * Math.exp(-t / 42);

    data.push({
      step: t,
      SGD: Math.max(0.08, +sgd.toFixed(4)),
      Momentum: Math.max(0.06, +momentum.toFixed(4)),
      Adam: Math.max(0.04, +adam.toFixed(4)),
      AdamW: Math.max(0.038, +adamw.toFixed(4)),
    });
  }
  return data;
}

const ALL_OPTIMIZERS = [
  { key: 'SGD', color: '#f87171', label: 'SGD' },
  { key: 'Momentum', color: '#fbbf24', label: 'SGD + Momentum' },
  { key: 'Adam', color: '#34d399', label: 'Adam' },
  { key: 'AdamW', color: '#60a5fa', label: 'AdamW' },
];

// Custom tooltip for Recharts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-2.5 text-xs shadow-xl">
      <p className="mb-1 font-bold text-gray-300">Step {label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-gray-400">{entry.dataKey}:</span>
          <span className="font-mono font-bold" style={{ color: entry.color }}>
            {entry.value.toFixed(4)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Optimizer comparison chart component
// ─────────────────────────────────────────────────────────────────────────────
function OptimizerComparisonChart() {
  const [enabled, setEnabled] = useState({
    SGD: true,
    Momentum: true,
    Adam: true,
    AdamW: true,
  });
  const [steps, setSteps] = useState(100);

  const fullData = useMemo(() => generateLossCurves(100), []);
  const data = useMemo(() => fullData.slice(0, steps), [fullData, steps]);

  function toggleOptimizer(key) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100">
        Interactive: Optimizer Convergence Comparison
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Simulated training loss curves for a deep learning task. Toggle optimizers and adjust the
        step count. Adam and AdamW converge fastest in early steps due to adaptive learning rates.
      </p>

      {/* Optimizer toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ALL_OPTIMIZERS.map(({ key, color, label }) => (
          <button
            key={key}
            onClick={() => toggleOptimizer(key)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
              enabled[key]
                ? 'border-transparent text-white'
                : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            style={enabled[key] ? { background: color, borderColor: color } : {}}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: enabled[key] ? '#fff' : color, opacity: enabled[key] ? 0.8 : 1 }}
            />
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
          <XAxis
            dataKey="step"
            stroke="#6b7280"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            label={{ value: 'Training Step', position: 'insideBottom', offset: -2, fill: '#9ca3af', fontSize: 11 }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
            domain={[0, 2.5]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={0.05}
            stroke="#6b7280"
            strokeDasharray="4 3"
            strokeOpacity={0.6}
            label={{ value: 'target ≈ 0.05', position: 'right', fill: '#6b7280', fontSize: 10 }}
          />
          {ALL_OPTIMIZERS.map(({ key, color }) =>
            enabled[key] ? (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Step slider */}
      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
          Show steps:
        </label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value, 10))}
          className="w-36 accent-indigo-500"
        />
        <span className="w-10 rounded-md bg-indigo-100 px-2 py-0.5 text-center text-xs font-mono font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          {steps}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Adam algorithm pseudo-code block
// ─────────────────────────────────────────────────────────────────────────────
function AdamAlgorithmBlock() {
  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-indigo-400/40 bg-indigo-50/40 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-950/15">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-indigo-400/30 bg-indigo-100/60 px-5 py-3 dark:border-indigo-500/20 dark:bg-indigo-900/25">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
          A
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Algorithm 4.1
        </span>
        <span className="text-indigo-400 dark:text-indigo-600">·</span>
        <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
          Adam Optimizer
        </span>
      </div>

      {/* Algorithm body */}
      <div className="px-6 py-5">
        {/* Inputs */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Input
        </p>
        <div className="mb-4 rounded-lg bg-white/60 px-4 py-3 dark:bg-gray-900/40">
          <BlockMath math="\eta > 0 \text{ (learning rate)},\quad \beta_1, \beta_2 \in [0,1) \text{ (moment decay rates)},\quad \epsilon > 0 \text{ (numerical stability)}" />
          <BlockMath math="\text{Defaults: } \eta = 10^{-3},\; \beta_1 = 0.9,\; \beta_2 = 0.999,\; \epsilon = 10^{-8}" />
        </div>

        {/* Initialization */}
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Initialization
        </p>
        <div className="mb-4 space-y-1 rounded-lg bg-white/60 px-4 py-3 dark:bg-gray-900/40">
          <BlockMath math="m_0 \leftarrow \mathbf{0} \in \mathbb{R}^d \quad \text{(first moment)} " />
          <BlockMath math="v_0 \leftarrow \mathbf{0} \in \mathbb{R}^d \quad \text{(second moment)}" />
          <BlockMath math="t \leftarrow 0" />
        </div>

        {/* Loop */}
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          For each step
        </p>
        <div className="space-y-2 rounded-lg bg-white/60 px-4 py-4 dark:bg-gray-900/40">
          <div className="flex items-start gap-3">
            <span className="mt-1 min-w-[1.5rem] text-right text-xs font-mono text-indigo-400">1.</span>
            <div className="flex-1">
              <BlockMath math="t \leftarrow t + 1" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 min-w-[1.5rem] text-right text-xs font-mono text-indigo-400">2.</span>
            <div className="flex-1">
              <BlockMath math="g_t = \nabla_\theta L(\theta_{t-1}) \quad \text{(stochastic gradient)}" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 min-w-[1.5rem] text-right text-xs font-mono text-indigo-400">3.</span>
            <div className="flex-1">
              <BlockMath math="m_t = \beta_1\, m_{t-1} + (1 - \beta_1)\, g_t \quad \text{(biased first moment)}" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 min-w-[1.5rem] text-right text-xs font-mono text-indigo-400">4.</span>
            <div className="flex-1">
              <BlockMath math="v_t = \beta_2\, v_{t-1} + (1 - \beta_2)\, g_t^2 \quad \text{(biased second moment, elementwise)}" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 min-w-[1.5rem] text-right text-xs font-mono text-indigo-400">5.</span>
            <div className="flex-1">
              <BlockMath math="\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \qquad \hat{v}_t = \frac{v_t}{1 - \beta_2^t} \quad \text{(bias-corrected moments)}" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 min-w-[1.5rem] text-right text-xs font-mono text-indigo-400">6.</span>
            <div className="flex-1">
              <BlockMath math="\theta_t = \theta_{t-1} - \eta\; \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} \quad \text{(parameter update, elementwise)}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Python code string
// ─────────────────────────────────────────────────────────────────────────────
const ADAM_PYTHON_CODE = `import numpy as np

class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = None
        self.v = None
        self.t = 0

    def step(self, params, grads):
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)
        self.t += 1
        # Update biased moment estimates
        self.m = self.beta1 * self.m + (1 - self.beta1) * grads
        self.v = self.beta2 * self.v + (1 - self.beta2) * grads**2
        # Bias-corrected estimates
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)
        # Parameter update
        return params - self.lr * m_hat / (np.sqrt(v_hat) + self.eps)


# Example: minimize f(x) = x^2 starting from x=10
x = np.array([10.0])
optimizer = Adam(lr=0.1)

print("Adam on f(x) = x^2:")
for step in range(101):
    grad = 2 * x  # gradient of x^2
    x = optimizer.step(x, grad)
    if step % 20 == 0:
        print(f"  Step {step:3d}: x = {x[0]:8.4f}, f(x) = {x[0]**2:.6f}")


# AdamW: decoupled weight decay
class AdamW:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8, weight_decay=0.01):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.wd = weight_decay
        self.m = None
        self.v = None
        self.t = 0

    def step(self, params, grads):
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)
        self.t += 1
        self.m = self.beta1 * self.m + (1 - self.beta1) * grads
        self.v = self.beta2 * self.v + (1 - self.beta2) * grads**2
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)
        # AdamW: weight decay is applied directly to params, NOT via gradient
        return (params * (1 - self.lr * self.wd)
                - self.lr * m_hat / (np.sqrt(v_hat) + self.eps))


# Bias correction demonstration
beta1 = 0.9
m = 0.0
true_grad = 1.0  # constant gradient

print("\\nBias correction demo (constant gradient = 1.0):")
for t in range(1, 6):
    m = beta1 * m + (1 - beta1) * true_grad
    m_hat = m / (1 - beta1**t)
    print(f"  t={t}: m_t = {m:.4f} (biased), m_hat = {m_hat:.4f} (corrected)")

# PyTorch usage (reference):
# import torch
# optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999))
# optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
# for batch in dataloader:
#     optimizer.zero_grad()
#     loss = criterion(model(x), y)
#     loss.backward()
#     optimizer.step()
`;

// ─────────────────────────────────────────────────────────────────────────────
// References
// ─────────────────────────────────────────────────────────────────────────────
const ADAM_REFERENCES = [
  {
    authors: 'Kingma, D. P. & Ba, J.',
    year: 2015,
    title: 'Adam: A Method for Stochastic Optimization',
    venue: 'ICLR 2015',
    url: 'https://arxiv.org/abs/1412.6980',
    type: 'foundational',
    whyImportant:
      'The original Adam paper, with over 160,000 citations. Introduces adaptive moment estimation and bias correction.',
  },
  {
    authors: 'Reddi, S. J., Kale, S., & Kumar, S.',
    year: 2018,
    title: 'On the Convergence of Adam and Beyond',
    venue: 'ICLR 2018',
    url: 'https://arxiv.org/abs/1904.09237',
    type: 'foundational',
    whyImportant:
      'Identified a flaw in the original Adam convergence proof for non-convex problems and proposed the AMSGrad fix.',
  },
  {
    authors: 'Loshchilov, I. & Hutter, F.',
    year: 2019,
    title: 'Decoupled Weight Decay Regularization',
    venue: 'ICLR 2019',
    url: 'https://arxiv.org/abs/1711.05101',
    type: 'foundational',
    whyImportant:
      'Showed that L2 regularization in Adam is not equivalent to weight decay, and introduced AdamW which is now standard for training transformers.',
  },
  {
    authors: 'Bottou, L., Curtis, F. E., & Nocedal, J.',
    year: 2018,
    title: 'Optimization Methods for Large-Scale Machine Learning',
    venue: 'SIAM Review, 60(2)',
    url: 'https://arxiv.org/abs/1606.04838',
    type: 'survey',
    whyImportant:
      'Comprehensive survey situating Adam within the broader landscape of stochastic optimisation theory.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main section component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdamOptimizerSection() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Title */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
          Chapter 4 · First-Order Methods
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          §2 — Adam Optimizer
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Adaptive Moment Estimation — the de-facto standard for training deep neural networks,
          combining per-parameter learning rates with bias-corrected moment estimates.
        </p>
      </div>

      {/* 1. Historical note */}
      <NoteBlock type="historical" title="Historical Context">
        <p>
          Diederik Kingma and Jimmy Ba introduced <strong>Adam</strong> in December 2014
          (arXiv:1412.6980), presenting it at ICLR 2015. It quickly displaced vanilla SGD and
          AdaGrad/RMSProp as the default optimizer for deep learning. As of 2024, Adam and its
          variant <strong>AdamW</strong> remain the standard choice for training large language
          models such as GPT-4, Llama, and Gemini. The paper has accumulated over 160,000
          citations, making it one of the most cited works in machine learning history.
        </p>
      </NoteBlock>

      {/* 2. Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Motivation: Adaptive Learning Rates
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Vanilla SGD applies the <em>same</em> learning rate <InlineMath math="\eta" /> to
          every parameter dimension:
        </p>
        <BlockMath math="\theta_t = \theta_{t-1} - \eta\, g_t" />
        <p className="mt-3 mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          This is problematic when parameters have very different gradient magnitudes — common in
          deep networks where embeddings and output layers can differ by orders of magnitude. Adam
          addresses this by maintaining <strong>running estimates of the first and second moments
          of the gradient</strong>, giving each parameter its own effective step size:
        </p>
        <BlockMath math="\text{effective lr for } \theta_i \approx \frac{\eta}{\sqrt{\hat{v}_{t,i}} + \epsilon} \times \hat{m}_{t,i}" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Parameters with consistently large gradients (large{' '}
          <InlineMath math="\hat{v}_{t,i}" />) receive smaller effective updates; rarely-updated
          parameters (small <InlineMath math="\hat{v}_{t,i}" />) receive larger updates. This
          makes Adam particularly effective for <strong>sparse gradients</strong> (e.g., NLP
          embeddings) and <strong>noisy loss landscapes</strong>.
        </p>
      </section>

      {/* 3. Algorithm */}
      <AdamAlgorithmBlock />

      {/* 4. Interactive comparison */}
      <OptimizerComparisonChart />

      {/* 5. Bias correction definition */}
      <DefinitionBlock
        label="Definition 4.2"
        title="Bias Correction"
        definition="Since $m_0 = v_0 = \mathbf{0}$, the exponential moving averages are initialised at zero and remain biased toward zero during early training. The bias-corrected estimates $\hat{m}_t = m_t / (1 - \beta_1^t)$ and $\hat{v}_t = v_t / (1 - \beta_2^t)$ compensate for this initialisation bias. As $t \to \infty$, both correction factors $1 - \beta_k^t \to 1$, and the bias correction becomes negligible."
        notation="At $t=1$ with $\beta_1=0.9$: $1-\beta_1^1 = 0.1$, so $\hat{m}_1 = m_1/0.1 = 10\,m_1$. Without this, the first update would be 10× too small."
      />

      {/* Bias correction intuition */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">
          Bias Correction Numerically
        </h3>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Suppose the true gradient is constantly{' '}
          <InlineMath math="g = 1" /> and{' '}
          <InlineMath math="\beta_1 = 0.9" />. The biased and corrected first moments evolve as:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  <InlineMath math="t" />
                </th>
                <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  <InlineMath math="m_t" /> (biased)
                </th>
                <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  <InlineMath math="1 - \beta_1^t" />
                </th>
                <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  <InlineMath math="\hat{m}_t" /> (corrected)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { t: 1, m: 0.1, corr: 0.1 },
                { t: 2, m: 0.19, corr: 0.19 },
                { t: 5, m: 0.4095, corr: 0.40951 },
                { t: 10, m: 0.6513, corr: 0.65132 },
                { t: 50, m: 0.9948, corr: 0.99499 },
              ].map(({ t, m, corr }) => (
                <tr key={t} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-2 font-mono text-gray-800 dark:text-gray-200">{t}</td>
                  <td className="px-4 py-2 font-mono text-amber-600 dark:text-amber-400">
                    {m.toFixed(4)}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400">
                    {(1 - Math.pow(0.9, t)).toFixed(4)}
                  </td>
                  <td className="px-4 py-2 font-mono text-emerald-600 dark:text-emerald-400">
                    {(m / (1 - Math.pow(0.9, t))).toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Without bias correction, early estimates are far from 1.0 (the true mean gradient).
          The corrected estimate converges to the true value much faster.
        </p>
      </div>

      {/* 6. Convergence theorem */}
      <TheoremBlock
        label="Theorem 4.3"
        title="Adam Convergence in Non-Convex Setting (Simplified)"
        statement="Under standard stochastic assumptions (bounded gradients $\|g_t\|_\infty \leq G$, bounded second moment $\mathbb{E}[\|g_t\|^2] \leq \sigma^2$), Adam achieves the convergence rate $\frac{1}{T}\sum_{t=1}^T \mathbb{E}\left[\|\nabla L(\theta_t)\|^2\right] = O\!\left(\frac{1}{\sqrt{T}}\right)$ to a stationary point. The rate matches SGD asymptotically, but Adam's adaptive step sizes yield substantially better constants in practice, particularly during early training."
        proof="The proof (Kingma & Ba, 2015; corrected by Reddi et al., 2018) proceeds by bounding the per-step progress using the descent lemma, analysing the effective learning rate $\eta_t^{(i)} = \eta/(\sqrt{\hat{v}_{t,i}}+\epsilon)$ for each coordinate $i$, and applying a regret-style telescoping sum. Note: the original proof contained an error for the case of non-monotone $v_t$; AMSGrad (Reddi et al., 2018) fixes this by using $\hat{v}_t = \max(\hat{v}_{t-1}, v_t)$ to ensure a non-increasing effective learning rate."
        corollaries={[
          "The $O(1/\\sqrt{T})$ rate is the same as SGD, so Adam's practical advantage lies in better constants and faster initial convergence, not an asymptotically superior rate.",
          "For convex problems, Adam achieves $O(\\log T / \\sqrt{T})$ regret, slightly worse than the optimal $O(1/\\sqrt{T})$ of AdaGrad.",
        ]}
      />

      {/* 7. Example */}
      <ExampleBlock
        title="Tracing Adam for 3 Steps on f(x) = x²"
        difficulty="intermediate"
        problem="Apply Adam to minimize $f(x) = x^2$ starting from $x_0 = 1$, with $\eta = 0.01$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$. Trace the first 3 iterations."
        solution={[
          {
            step: 'Initialization',
            formula: 'm_0 = 0, \\quad v_0 = 0, \\quad x_0 = 1',
            explanation: 'Both moment estimates start at zero.',
          },
          {
            step: 'Step t = 1',
            formula:
              'g_1 = f\'(x_0) = 2 \\cdot 1 = 2\\\\\nm_1 = 0.9 \\cdot 0 + 0.1 \\cdot 2 = 0.2\\\\\nv_1 = 0.999 \\cdot 0 + 0.001 \\cdot 4 = 0.004\\\\\n\\hat{m}_1 = 0.2 / 0.1 = 2.0, \\quad \\hat{v}_1 = 0.004 / 0.001 = 4.0\\\\\nx_1 = 1 - 0.01 \\cdot \\frac{2.0}{\\sqrt{4.0} + 10^{-8}} = 1 - 0.01 = 0.99',
            explanation: 'Bias correction restores $\\hat{m}_1 \\approx g_1$, so the first step mirrors SGD with $\\eta=0.01$.',
          },
          {
            step: 'Step t = 2',
            formula:
              'g_2 = 2 \\cdot 0.99 = 1.98\\\\\nm_2 = 0.9 \\cdot 0.2 + 0.1 \\cdot 1.98 = 0.378\\\\\nv_2 = 0.999 \\cdot 0.004 + 0.001 \\cdot 1.98^2 \\approx 0.007920\\\\\n\\hat{m}_2 = 0.378 / 0.19 \\approx 1.989, \\quad \\hat{v}_2 \\approx 0.007920/0.001999 \\approx 3.962\\\\\nx_2 = 0.99 - 0.01 \\cdot \\frac{1.989}{\\sqrt{3.962}+10^{-8}} \\approx 0.99 - 0.00999 \\approx 0.9800',
            explanation: 'The effective step is nearly constant because $\\hat{v}_t \\approx g_t^2$ is well-estimated.',
          },
          {
            step: 'Step t = 3',
            formula:
              'g_3 = 2 \\cdot 0.98 = 1.96\\\\\n\\hat{m}_3 \\approx 1.969, \\quad \\hat{v}_3 \\approx 3.846\\\\\nx_3 \\approx 0.9800 - 0.01 \\cdot \\frac{1.969}{\\sqrt{3.846}} \\approx 0.9800 - 0.01005 \\approx 0.9700',
            explanation: 'Adam takes approximately equal steps of $\\approx 0.01$ for each iteration here, because $f\'(x)/|f\'(x)| \\approx 1$ — Adam normalises the gradient, giving nearly constant step size regardless of gradient magnitude.',
          },
        ]}
      />

      {/* Adam vs SGD interpretation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Interpretation: Adam as Sign Descent
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          In the scalar case with constant gradients, the Adam update simplifies to:
        </p>
        <BlockMath math="\theta_t = \theta_{t-1} - \eta \cdot \text{sign}(g_t)" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          This is because <InlineMath math="\hat{m}_t / \sqrt{\hat{v}_t} \approx g_t / |g_t|" />{' '}
          for large <InlineMath math="t" />. Adam therefore behaves like{' '}
          <em>sign gradient descent</em> with a small perturbation from the first moment. This
          explains why Adam is relatively insensitive to the gradient scale — a property crucial
          for training very deep networks.
        </p>
        <div className="mt-4 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Connection to Lion Optimizer
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            The <strong>Lion</strong> optimizer (Chen et al., 2023) formalises this observation,
            using the exact sign update{' '}
            <InlineMath math="\theta_t = \theta_{t-1} - \eta \cdot \text{sign}(\beta_1 m_{t-1} + (1-\beta_1) g_t)" />{' '}
            without the second moment. Lion uses less memory than Adam and has shown competitive
            performance on large vision and language models.
          </p>
        </div>
      </section>

      {/* 8. Warning */}
      <WarningBlock title="Known Limitations of Adam">
        <ul className="list-disc space-y-2 pl-4">
          <li>
            <strong>Convergence issues in non-convex settings</strong>: Reddi et al. (2018)
            demonstrated that Adam can fail to converge even on simple convex online learning
            problems. The fix, <strong>AMSGrad</strong>, uses{' '}
            <InlineMath math="\hat{v}_t = \max(\hat{v}_{t-1}, v_t)" /> to ensure a
            non-increasing effective learning rate.
          </li>
          <li>
            <strong>Adam ≠ AdamW for regularization</strong>: Adding L2 regularization to the
            loss (i.e., <InlineMath math="L(\theta) + \lambda\|\theta\|^2" />) and using Adam is
            not equivalent to weight decay. The adaptive scaling by{' '}
            <InlineMath math="\sqrt{\hat{v}_t}" /> distorts the regularization effect.{' '}
            <strong>Always use AdamW</strong> when weight decay is desired.
          </li>
          <li>
            <strong>Learning rate warmup</strong>: In transformer training, starting with a
            large <InlineMath math="\eta" /> causes instability. Warmup (linearly increasing{' '}
            <InlineMath math="\eta" /> for the first few thousand steps) is essential to let the
            moment estimates <InlineMath math="m_t, v_t" /> stabilise before taking large steps.
          </li>
          <li>
            <strong>Memory overhead</strong>: Adam stores two gradient moments per parameter,
            doubling memory compared to SGD. For a 7B parameter model, this requires an
            additional ~56 GB of GPU memory (in fp32). Quantised Adam variants (e.g., 8-bit
            Adam, bitsandbytes) address this for inference-time fine-tuning.
          </li>
        </ul>
      </WarningBlock>

      {/* 9. Python code */}
      <PythonCode
        code={ADAM_PYTHON_CODE}
        title="Adam & AdamW — NumPy Implementation"
        runnable
      />

      {/* References */}
      <ReferenceList references={ADAM_REFERENCES} />
    </div>
  );
}
