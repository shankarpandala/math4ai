import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Simulate variance of gradient estimates over iterations
// SVRG: variance decreases to 0 within each epoch (snapshot corrects bias)
// SGD: variance stays constant

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function simulateSVRGVariance(n, nEpochs, sigma2 = 4.0) {
  // For a strongly convex quadratic, SVRG gradient variance after t steps in epoch
  // is approximately sigma2 * ||x_t - x_snap||^2 ≈ sigma2 * rho^(2t)
  // where rho = contraction factor
  const sgdVar = [], svrgVar = [];
  const stepsPerEpoch = 20;

  for (let epoch = 0; epoch < nEpochs; epoch++) {
    for (let t = 0; t < stepsPerEpoch; t++) {
      const iter = epoch * stepsPerEpoch + t;
      // SGD: constant variance
      sgdVar.push({ iter, v: sigma2 });
      // SVRG: variance decays within epoch (snapshot at start of epoch)
      const distFromSnap = Math.pow(0.85, t); // proxy for contraction
      svrgVar.push({ iter, v: sigma2 * distFromSnap * distFromSnap });
    }
  }
  return { sgdVar, svrgVar, stepsPerEpoch };
}

function InteractiveVarianceReduction() {
  const [nEpochs, setNEpochs] = useState(4);
  const [sigma2, setSigma2] = useState(4.0);

  const { sgdVar, svrgVar, stepsPerEpoch } = simulateSVRGVariance(20, nEpochs, sigma2);

  const W = 400, H = 220, PAD = 40;
  const totalIters = nEpochs * stepsPerEpoch;
  const maxV = sigma2 + 0.5;

  function toSvg(iter, v) {
    return {
      sx: PAD + (iter / totalIters) * (W - 2 * PAD),
      sy: H - PAD - (v / maxV) * (H - 2 * PAD),
    };
  }

  const sgdPts = sgdVar.map(({ iter, v }) => {
    const { sx, sy } = toSvg(iter, v);
    return `${sx},${sy}`;
  }).join(' ');

  const svrgPts = svrgVar.map(({ iter, v }) => {
    const { sx, sy } = toSvg(iter, v);
    return `${sx},${sy}`;
  }).join(' ');

  // Epoch boundaries
  const epochLines = Array.from({ length: nEpochs + 1 }, (_, i) => {
    const iter = i * stepsPerEpoch;
    return toSvg(iter, 0).sx;
  });

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: SVRG Variance Reduction</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        SVRG gradient variance (green) decays within each epoch due to snapshot correction,
        while SGD variance (red) remains constant at <InlineMath math="\sigma^2" />.
        Vertical lines mark epoch boundaries.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {/* Epoch boundaries */}
          {epochLines.map((sx, i) => (
            <line key={i} x1={sx} y1={PAD} x2={sx} y2={H - PAD} stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,3" />
          ))}
          {/* SGD variance */}
          <polyline points={sgdPts} fill="none" stroke="#ef4444" strokeWidth="2" />
          {/* SVRG variance */}
          <polyline points={svrgPts} fill="none" stroke="#10b981" strokeWidth="2" />
          {/* Legend */}
          <rect x={W - PAD - 95} y={PAD} width="91" height="40" fill="white" fillOpacity="0.9" rx="4" />
          <line x1={W - PAD - 87} y1={PAD + 12} x2={W - PAD - 65} y2={PAD + 12} stroke="#ef4444" strokeWidth="2" />
          <text x={W - PAD - 61} y={PAD + 16} fontSize="10" fill="#374151">SGD</text>
          <line x1={W - PAD - 87} y1={PAD + 28} x2={W - PAD - 65} y2={PAD + 28} stroke="#10b981" strokeWidth="2" />
          <text x={W - PAD - 61} y={PAD + 32} fontSize="10" fill="#374151">SVRG</text>
          <text x={PAD + 4} y={H - PAD - 4} fontSize="10" fill="#374151">iterations →</text>
          <text x={PAD - 28} y={PAD + 14} fontSize="9" fill="#374151" transform={`rotate(-90, ${PAD - 28}, ${PAD + 14})`}>variance</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Epochs: {nEpochs}
            </label>
            <input type="range" min="1" max="8" step="1" value={nEpochs} onChange={e => setNEpochs(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`\\sigma^2 = ${sigma2.toFixed(1)}`} />
            </label>
            <input type="range" min="0.5" max="8" step="0.5" value={sigma2} onChange={e => setSigma2(+e.target.value)} className="w-full" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            At each epoch start (vertical line), SVRG takes a full gradient snapshot — variance resets and decays.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VarianceReduction() {
  return (
    <div className="space-y-8">
      <InteractiveVarianceReduction />

      <DefinitionBlock title="Variance Reduction Problem">
        <p>
          For the finite-sum objective <InlineMath math="f(x) = \frac{1}{n}\sum_{i=1}^n f_i(x)" />,
          SGD uses <InlineMath math="\nabla f_i(x)" /> as an unbiased gradient estimate with variance
        </p>
        <BlockMath math="\mathbb{E}\|\nabla f_i(x) - \nabla f(x)\|^2 = \sigma^2(x)." />
        <p className="mt-2">
          This variance prevents convergence to <InlineMath math="x^*" /> with constant step size.
          <strong> Variance reduction</strong> methods reduce <InlineMath math="\sigma^2(x) \to 0" />
          as <InlineMath math="x \to x^*" />, enabling linear convergence without decreasing step sizes.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="SVRG: Stochastic Variance Reduced Gradient">
        <p>
          <strong>SVRG</strong> (Johnson & Zhang, 2013) periodically computes a full gradient
          snapshot <InlineMath math="\tilde{\mu} = \nabla f(\tilde{x})" /> and uses it as a
          control variate:
        </p>
        <BlockMath math="\tilde{\nabla}_t = \nabla f_{i_t}(x_t) - \nabla f_{i_t}(\tilde{x}) + \tilde{\mu}." />
        <p className="mt-2">
          This estimate is unbiased (<InlineMath math="\mathbb{E}[\tilde{\nabla}_t] = \nabla f(x_t)" />)
          with variance that vanishes as <InlineMath math="x_t \to x^*" /> (since
          <InlineMath math="\nabla f_{i_t}(x_t) \approx \nabla f_{i_t}(\tilde{x})" /> near the optimum).
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="SARAH and SPIDER">
        <p>
          <strong>SARAH</strong> (Nguyen et al., 2017) uses a recursive gradient estimator:
        </p>
        <BlockMath math="v_t = \nabla f_{i_t}(x_t) - \nabla f_{i_t}(x_{t-1}) + v_{t-1}." />
        <p className="mt-2">
          <strong>SPIDER</strong> (Fang et al., 2018) extends SARAH to nonconvex settings,
          achieving the optimal complexity of <InlineMath math="O(n^{1/2}/\epsilon^2)" />
          stochastic gradient evaluations to find an <InlineMath math="\epsilon" />-stationary point.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="SVRG Convergence Rate"
        proof="In each epoch of length m, starting from snapshot x̃ with full gradient μ̃, the expected distance to optimum contracts by factor ρ = L/(μm) + 1/(2μη) under step size η < 1/(4L). Choosing m = O(n) and η = 1/(10L) gives ρ < 1, yielding geometric convergence with total cost O((n + κ)log(1/ε)) per epoch."
      >
        <p>
          For strongly convex objectives with condition number <InlineMath math="\kappa = L/\mu" />,
          SVRG with epoch length <InlineMath math="m = O(n)" /> achieves linear convergence:
        </p>
        <BlockMath math="\mathbb{E}[f(x_T) - f^*] \leq \rho^T (f(x_0) - f^*), \quad \rho < 1." />
        <p className="mt-2">
          Total stochastic gradient evaluations: <InlineMath math="O\!\left((n + \kappa)\log\frac{1}{\epsilon}\right)" />
          vs SGD's <InlineMath math="O(1/(\mu\epsilon))" />. For <InlineMath math="n \gg \kappa" />,
          SVRG is significantly cheaper.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Control Variates Interpretation">
        <p>
          Variance reduction uses the <strong>control variate</strong> technique from Monte Carlo:
          to estimate <InlineMath math="\mathbb{E}[X]" />, use <InlineMath math="X - c(Z - \mathbb{E}[Z])" />
          where <InlineMath math="c" /> is chosen to minimize variance. In SVRG,
          <InlineMath math="Z = \nabla f_{i_t}(\tilde{x})" /> is the control variate with known mean
          <InlineMath math="\tilde{\mu}" />. The correlation between <InlineMath math="\nabla f_{i_t}(x_t)" />
          and <InlineMath math="\nabla f_{i_t}(\tilde{x})" /> (which is high near the optimum)
          drives the variance reduction.
        </p>
      </ExampleBlock>

      <WarningBlock title="SVRG Requires Full Gradient Passes">
        <p>
          The periodic full gradient computation in SVRG costs <InlineMath math="O(n)" /> per epoch,
          which can be expensive for very large datasets. In practice, for deep learning with
          <InlineMath math="n \gg 10^6" />, variance reduction methods are rarely used directly.
          Instead, techniques like large mini-batches, gradient clipping, and careful learning rate
          schedules are preferred. SVRG-type methods are more relevant for ML theory and
          moderate-scale problems (e.g., kernel methods, logistic regression).
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

def svrg(grad_fi, full_grad, x0, lr, n, epoch_len, n_epochs):
    """
    SVRG for finite-sum minimization.
    grad_fi(x, i): stochastic gradient for sample i
    full_grad(x): full gradient (costs O(n))
    """
    x = x0.copy()
    x_tilde = x.copy()
    history = [x.copy()]
    rng = np.random.default_rng(42)

    for epoch in range(n_epochs):
        mu = full_grad(x_tilde)  # O(n) snapshot gradient
        x_inner = x_tilde.copy()
        for t in range(epoch_len):
            i = int(rng.integers(n))
            # SVRG gradient: variance-reduced estimate
            g = grad_fi(x_inner, i) - grad_fi(x_tilde, i) + mu
            x_inner = x_inner - lr * g
        x_tilde = x_inner  # update snapshot
        history.append(x_inner.copy())
    return x_tilde, history

# Logistic regression on synthetic data
rng = np.random.default_rng(42)
n, d = 500, 10
X = rng.standard_normal((n, d))
w_true = rng.standard_normal(d)
y = np.sign(X @ w_true)

lam = 0.01  # L2 regularization
def loss_i(w, i):
    z = y[i] * (X[i] @ w)
    return np.log(1 + np.exp(-z)) + lam/2 * w @ w

def grad_fi(w, i):
    z = y[i] * (X[i] @ w)
    s = -y[i] / (1 + np.exp(z))
    return s * X[i] + lam * w

def full_grad(w):
    return np.mean([grad_fi(w, i) for i in range(n)], axis=0)

x0 = np.zeros(d)
L = np.linalg.norm(X, ord=2)**2 / (4*n) + lam  # Lipschitz constant
x_svrg, hist = svrg(grad_fi, full_grad, x0, lr=1/(5*L), n=n, epoch_len=2*n, n_epochs=10)

for epoch, x in enumerate(hist):
    g = full_grad(x)
    if epoch % 3 == 0:
        print(f"Epoch {epoch}: ||grad|| = {np.linalg.norm(g):.2e}")
`} />
    </div>
  );
}
