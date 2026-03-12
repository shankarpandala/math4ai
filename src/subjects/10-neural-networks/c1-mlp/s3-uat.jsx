import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Step Function Approximation of a Target Function
// ---------------------------------------------------------------------------

const TARGET_FNS = {
  'sin(πx)': x => Math.sin(Math.PI * x),
  'x²':      x => x * x,
  '|x|':     x => Math.abs(x),
  'sign(x)': x => x > 0 ? 1 : x < 0 ? -1 : 0,
};

function stepApprox(fn, nSteps, xMin, xMax) {
  return Array.from({ length: nSteps }, (_, i) => {
    const xLeft  = xMin + (xMax - xMin) * i / nSteps;
    const xRight = xMin + (xMax - xMin) * (i+1) / nSteps;
    const xMid   = (xLeft + xRight) / 2;
    return { xLeft, xRight, height: fn(xMid) };
  });
}

function UATViz() {
  const [nSteps, setNSteps] = useState(6);
  const [targetName, setTargetName] = useState('sin(πx)');

  const W = 440, H = 220;
  const xMin = -1, xMax = 1, yMin = -1.5, yMax = 1.5;

  const toSVG = (x, y) => ({
    x: ((x - xMin) / (xMax - xMin)) * W,
    y: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const fn = TARGET_FNS[targetName];
  const steps = stepApprox(fn, nSteps, xMin, xMax);

  // Smooth target path
  const nPts = 200;
  const targetPath = Array.from({ length: nPts }, (_, i) => {
    const x = xMin + (xMax - xMin) * i / (nPts - 1);
    const y = Math.max(yMin, Math.min(yMax, fn(x)));
    const p = toSVG(x, y);
    return `${p.x},${p.y}`;
  });

  // Compute L2 error
  const errorPts = 100;
  let l2err = 0;
  for (let i = 0; i < errorPts; i++) {
    const x = xMin + (xMax - xMin) * i / (errorPts - 1);
    const step = steps.find(s => x >= s.xLeft && x < s.xRight) || steps[steps.length-1];
    l2err += (fn(x) - step.height)**2;
  }
  l2err = Math.sqrt(l2err / errorPts);

  const origin = toSVG(0, 0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">UAT: Step Function Approximation</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each bump = 2 neurons (one ReLU transition up, one down). More neurons = better approximation.
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mr-2">Target:</label>
          {Object.keys(TARGET_FNS).map(name => (
            <button key={name} onClick={() => setTargetName(name)}
              className={`mr-1 rounded px-2 py-1 text-xs font-semibold ${targetName === name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Neurons: {nSteps * 2}</label>
          <input type="range" min={2} max={24} step={1} value={nSteps}
            onChange={e => setNSteps(parseInt(e.target.value))}
            className="w-28" />
        </div>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800/50">
        {/* Grid */}
        <line x1={0} y1={origin.y} x2={W} y2={origin.y} stroke="#94a3b8" strokeWidth={1} />
        <line x1={toSVG(0,yMin).x} y1={0} x2={toSVG(0,yMin).x} y2={H} stroke="#94a3b8" strokeWidth={1} />

        {/* Step approximation */}
        {steps.map((s, i) => {
          const x1 = toSVG(s.xLeft, s.height).x;
          const x2 = toSVG(s.xRight, s.height).x;
          const y  = toSVG(s.xLeft, Math.max(yMin, Math.min(yMax, s.height))).y;
          const y0 = origin.y;
          return (
            <g key={i}>
              <rect x={x1} y={Math.min(y, y0)} width={x2-x1} height={Math.abs(y-y0)}
                fill={s.height >= 0 ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.15)'}
                stroke="rgba(99,102,241,0.5)" strokeWidth={0.5} />
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#6366f1" strokeWidth={2} />
            </g>
          );
        })}

        {/* Target function */}
        <path d={'M' + targetPath.join(' L')} fill="none" stroke="#f59e0b" strokeWidth={2} />
      </svg>

      <div className="mt-3 flex justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
        <span className="text-indigo-600 dark:text-indigo-400">— Step approx ({nSteps*2} neurons)</span>
        <span className="text-amber-500">— Target: {targetName}</span>
        <span className="font-mono">L2 error: {l2err.toFixed(4)}</span>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt

# ── Demonstrate UAT: approximate sin with varying width ───────────────────────
class ShallowNet(nn.Module):
    def __init__(self, width):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, width),
            nn.ReLU(),
            nn.Linear(width, 1),
        )

    def forward(self, x):
        return self.net(x)

def train_and_evaluate(width, n_epochs=2000, lr=0.01):
    model = ShallowNet(width)
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    x_train = torch.linspace(-1, 1, 200).unsqueeze(1)
    y_train = torch.sin(np.pi * x_train)

    for _ in range(n_epochs):
        opt.zero_grad()
        loss = ((model(x_train) - y_train) ** 2).mean()
        loss.backward()
        opt.step()

    with torch.no_grad():
        y_pred = model(x_train)
        mse = ((y_pred - y_train)**2).mean().item()
    return mse

# Width scaling experiment
print("Width | MSE")
print("-" * 20)
for width in [2, 4, 8, 16, 32, 64, 128]:
    mse = train_and_evaluate(width)
    bar = '█' * int(mse * 1000)
    print(f"  {width:3d}  | {mse:.6f}  {bar}")

# ── Depth vs Width: exponential expressiveness gain ──────────────────────────
def count_linear_regions(model, x_range=(-2, 2), n=1000):
    """Count linear regions (activation pattern changes) of a ReLU network."""
    x = torch.linspace(*x_range, n).unsqueeze(1)
    with torch.no_grad():
        # Track activation patterns
        hooks = []
        patterns = []
        def hook_fn(module, inp, out):
            patterns.append((out > 0).int())
        for m in model.modules():
            if isinstance(m, nn.ReLU):
                hooks.append(m.register_forward_hook(hook_fn))
        model(x)
        for h in hooks:
            h.remove()
    # Count pattern changes
    n_regions = 1
    if patterns:
        combined = torch.cat(patterns, dim=1)
        n_regions = 1 + (combined[:-1] != combined[1:]).any(dim=1).sum().item()
    return n_regions

# Deep vs wide networks for expressiveness
deep_net  = nn.Sequential(nn.Linear(1,4),nn.ReLU(),nn.Linear(4,4),nn.ReLU(),nn.Linear(4,4),nn.ReLU(),nn.Linear(4,1))
wide_net  = nn.Sequential(nn.Linear(1,64),nn.ReLU(),nn.Linear(64,1))
print(f"\\nDeep (4-4-4-1) linear regions: {count_linear_regions(deep_net)}")
print(f"Wide (64-1) linear regions: {count_linear_regions(wide_net)}")
print(f"Deep has fewer params ({sum(p.numel() for p in deep_net.parameters())}) but potentially more regions")
`;

export default function UAT() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Universal Approximation Theorem
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Any continuous function can be approximated to arbitrary accuracy by a sufficiently
          wide (or deep) neural network — the theoretical foundation for why neural networks work.
        </p>
      </div>

      <NoteBlock title="History of UAT">
        <p>
          Cybenko (1989) proved that a single hidden layer with sigmoid activations is a universal
          approximator for continuous functions on compact sets. Hornik, Stinchcombe &amp; White (1989)
          extended this to any non-polynomial activation. Barron (1993) gave approximation rates.
          The depth version (why deep networks are exponentially more efficient) was proved by
          Montufar et al. (2014), Eldan &amp; Shamir (2016), and Telgarsky (2016).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.5"
        title="Universal Approximator"
        definition="A family of functions $\mathcal{F}$ is a universal approximator for a function class $\mathcal{C}$ if for every $f \in \mathcal{C}$, every compact set $K$, and every $\varepsilon > 0$, there exists $g \in \mathcal{F}$ such that $\sup_{x \in K} |f(x) - g(x)| < \varepsilon$. An MLP with a single hidden layer and a non-polynomial activation is a universal approximator for $C(K)$ (continuous functions on compact $K \subset \mathbb{R}^d$)."
        notation="Universal approximation does not guarantee: (1) that the network can be efficiently trained, (2) that generalization is good, (3) that polynomial-size networks suffice. The theorem is an existence result — it says the right network exists but doesn't say how to find it or how large it needs to be."
      />

      <UATViz />

      <TheoremBlock
        label="Theorem 1.3"
        title="Cybenko's Universal Approximation Theorem (1989)"
        statement="Let $\sigma: \mathbb{R} \to \mathbb{R}$ be a continuous sigmoidal function (i.e., $\sigma(t) \to 1$ as $t \to +\infty$ and $\sigma(t) \to 0$ as $t \to -\infty$). Then the set of finite sums $\sum_{j=1}^N \alpha_j \sigma(\mathbf{w}_j^\top \mathbf{x} + b_j)$ is dense in $C([0,1]^d)$ — the space of continuous functions on the unit hypercube."
        proof="The key idea is the Stone-Weierstrass theorem. First, show that finite sums $\sum \alpha_j \sigma(\mathbf{w}_j^\top \mathbf{x})$ can approximate indicator functions of half-spaces. Any bounded measurable function on $[0,1]^d$ is a limit of such indicators. By approximating the target function $f$ with step functions (which are linear combinations of indicators), and then approximating each step function with sigmoid sums, we get a single-layer approximation. Density in $C([0,1]^d)$ then follows from the uniform approximation of step functions. $\square$"
        corollaries={[
          "The theorem holds for any non-polynomial $\\sigma$, including ReLU (Hornik 1991). The proof for ReLU uses the fact that ReLU can approximate indicator functions via differences.",
          "Width bound: For any $\\varepsilon>0$ and $f \\in C([0,1]^d)$, a single hidden layer of width $O((\\varepsilon^{-1})^d)$ neurons suffices — exponential in dimension (curse of dimensionality).",
          "Depth helps exponentially: Montufar et al. (2014) showed that depth-$L$ ReLU networks can have $O((n/d)^{d(L-1)} \\cdot n)$ linear regions vs $O(n^d)$ for depth-2 networks of width $n$.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.4"
        title="Depth vs Width: Exponential Separation"
        statement="There exist functions computable by a depth-$L$ ReLU network of width $n$ that require a depth-2 (single hidden layer) network of width $\Omega(2^{n(L-2)/2})$ to approximate to constant error. In other words, depth can provide an exponential reduction in the number of neurons needed."
        proof="Telgarsky (2016) constructed explicit functions (iterates of the hat function $h(x) = 2\min(x, 1-x)$) that require exponentially many neurons for shallow approximation. The $k$-th iterate $h^k$ has $2^k$ linear pieces on $[0,1]$ and can be computed exactly by a depth-$2k+1$ network of width 2, but requires $2^{k/2}$ neurons in a depth-2 network to approximate. $\square$"
        corollaries={[
          "This theoretically justifies deep networks over wide shallow ones for complex hierarchical functions (though practice is more nuanced).",
          "In practice, both depth and width matter. Depth captures hierarchical structure; width captures the complexity of features at each level.",
          "Residual networks (ResNets) can train very deep networks by providing gradient shortcuts, making depth practically accessible beyond 100+ layers.",
        ]}
      />

      <ExampleBlock
        title="Constructing a ReLU Network to Approximate a Step Function"
        difficulty="advanced"
        problem="Show explicitly how 2 ReLU neurons can approximate the indicator function $f(x) = \mathbf{1}[a \leq x \leq b]$ for a given interval $[a,b]$."
        solution={[
          { step: 'ReLU bump construction', formula: 'f(x) \\approx \\text{ReLU}(x-a) - \\text{ReLU}(x-b)', explanation: 'ReLU(x-a) rises from 0 at x=a; subtracting ReLU(x-b) makes it flat after x=b. Result: ramp from a to b, then flat.' },
          { step: 'Normalize height', formula: 'g(x) = \\frac{1}{b-a}[\\text{ReLU}(x-a) - \\text{ReLU}(x-b)]', explanation: 'Divide by (b-a) to normalize the height to 1 on [a,b].' },
          { step: 'Generalize: sum of N bumps', formula: 'f(x) \\approx \\sum_{k=1}^N c_k \\cdot \\frac{\\text{ReLU}(x-a_k) - \\text{ReLU}(x-b_k)}{b_k - a_k}', explanation: 'Each bump approximates f on [a_k, b_k] with height c_k = average of f on that interval. This is the Riemann sum approximation, using 2N neurons total.' },
          { step: 'Error bound', formula: '\\|f - f_N\\|_{\\infty} \\leq \\omega_f(1/N)', explanation: 'Where ω_f is the modulus of continuity. For Lipschitz f with constant L: error ≤ L/N. More neurons → smaller error.' },
        ]}
      />

      <WarningBlock title="UAT Misconceptions">
        <ul className="space-y-2 text-sm">
          <li><strong>"Neural networks can learn any function":</strong> UAT guarantees approximation in principle, not learnability via gradient descent. Many functions require exponential width or depth, and SGD may not find the right parameters.</li>
          <li><strong>"Wider is always better":</strong> Overly wide networks overfit without regularization. UAT is about approximation capacity, not generalization. Modern practice uses regularization (dropout, weight decay) to match capacity to data size.</li>
          <li><strong>"Shallow networks are sufficient":</strong> UAT holds for single hidden layers, but the required width may be exponential in the input dimension. Depth provides polynomial-vs-exponential efficiency for structured functions.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="UAT Demo: Width Scaling & Linear Region Counting" runnable />
    </div>
  );
}
