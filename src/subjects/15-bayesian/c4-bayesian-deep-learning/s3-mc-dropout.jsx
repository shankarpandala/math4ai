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
// MC Dropout Ensemble Prediction Visualizer
// ---------------------------------------------------------------------------

function MCDropoutViz() {
  const [nSamples, setNSamples] = useState(10);
  const [dropoutP, setDropoutP] = useState(0.3);
  const [seed, setSeed] = useState(1);

  // Simulate MC Dropout predictions on a 1D regression problem
  // True function: sin(x)
  // Training region: x ∈ [-2, 2]
  // OOD region: x > 2.5 or x < -2.5

  const xTest = [-3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
  const trainMask = xTest.map((x) => Math.abs(x) <= 2.2);

  function lcg(s) {
    let state = s >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) & 0x7fffffff;
      return (state >>> 0) / 0x7fffffff;
    };
  }

  function boxMuller(rng) {
    const u1 = Math.max(rng(), 1e-10), u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  // Simulate ensemble predictions with dropout
  function predictWithDropout(x, trialSeed) {
    const rng = lcg(trialSeed * 1337 + 1);
    // Base prediction: sin(x) + small model uncertainty
    const basePred = Math.sin(x);
    // Dropout noise increases with distance from training data (OOD)
    const oodDist = Math.max(0, Math.abs(x) - 2.0);
    const oodNoise = oodDist * 0.6 * dropoutP;
    const idNoise = 0.1 * dropoutP;
    return basePred + boxMuller(rng) * (idNoise + oodNoise);
  }

  // Generate nSamples predictions for each test point
  const allPreds = xTest.map((x, xi) =>
    Array.from({ length: nSamples }, (_, s) => predictWithDropout(x, seed * 100 + s + xi))
  );

  const means = allPreds.map((preds) => preds.reduce((a, b) => a + b, 0) / preds.length);
  const stds = allPreds.map((preds, i) => {
    const mu = means[i];
    return Math.sqrt(preds.reduce((a, b) => a + (b - mu) ** 2, 0) / preds.length);
  });

  const svgW = 480, svgH = 220;
  const padL = 36, padR = 12, padT = 20, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = -4, xMax = 4, yMin = -2.5, yMax = 2.5;
  function tx(x) { return padL + ((x - xMin) / (xMax - xMin)) * plotW; }
  function ty(y) { return padT + (1 - (y - yMin) / (yMax - yMin)) * plotH; }

  // True function
  const trueXs = Array.from({ length: 80 }, (_, i) => xMin + (i / 79) * (xMax - xMin));
  const truePoints = trueXs.map((x) => `${tx(x).toFixed(1)},${ty(Math.sin(x)).toFixed(1)}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        MC Dropout — Ensemble Predictions with Uncertainty Bars
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Error bars show ±2σ epistemic uncertainty. Uncertainty grows outside the training
        region (|x| &gt; 2.2) — the model knows what it doesn't know.
      </p>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-4">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">MC samples T</label>
          <input type="range" min={1} max={50} step={1} value={nSamples}
            onChange={(e) => setNSamples(parseInt(e.target.value))}
            className="h-2 flex-1 accent-purple-500" />
          <span className="w-8 font-mono text-sm font-bold text-purple-600">{nSamples}</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">Dropout p</label>
          <input type="range" min={0.05} max={0.7} step={0.05} value={dropoutP}
            onChange={(e) => setDropoutP(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-purple-500" />
          <span className="w-10 font-mono text-sm font-bold text-purple-600">{dropoutP.toFixed(2)}</span>
        </div>
        <button onClick={() => setSeed((s) => s + 1)}
          className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600">New samples</button>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Training region shading */}
          <rect x={tx(-2.2)} y={padT} width={tx(2.2) - tx(-2.2)} height={plotH}
            fill="#22c55e" fillOpacity={0.07} />
          {/* Axes */}
          <line x1={tx(0)} y1={padT} x2={tx(0)} y2={padT + plotH} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={padL} y1={ty(0)} x2={padL + plotW} y2={ty(0)} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
            <text key={v} x={tx(v)} y={padT + plotH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">{v}</text>
          ))}
          {/* True function */}
          <polyline points={truePoints} fill="none" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5,3" />
          {/* Uncertainty bars and mean */}
          {xTest.map((x, i) => {
            const mu = means[i];
            const s = stds[i];
            const cx = tx(x);
            const cy = ty(mu);
            const ylo = ty(mu - 2 * s);
            const yhi = ty(mu + 2 * s);
            const col = trainMask[i] ? '#8b5cf6' : '#ef4444';
            return (
              <g key={i}>
                {/* CI bar */}
                <line x1={cx} y1={Math.min(ylo, padT + plotH)} x2={cx} y2={Math.max(yhi, padT)}
                  stroke={col} strokeWidth={2} opacity={0.4} />
                {/* Horizontal caps */}
                <line x1={cx - 4} y1={Math.min(ylo, padT + plotH)} x2={cx + 4} y2={Math.min(ylo, padT + plotH)}
                  stroke={col} strokeWidth={1.5} opacity={0.4} />
                <line x1={cx - 4} y1={Math.max(yhi, padT)} x2={cx + 4} y2={Math.max(yhi, padT)}
                  stroke={col} strokeWidth={1.5} opacity={0.4} />
                {/* Mean dot */}
                <circle cx={cx} cy={cy} r={4} fill={col} />
              </g>
            );
          })}
          {/* Legend */}
          <circle cx={padL + 10} cy={padT + 12} r={4} fill="#8b5cf6" />
          <text x={padL + 18} y={padT + 16} fontSize={9} fill="#8b5cf6">In-distribution</text>
          <circle cx={padL + 110} cy={padT + 12} r={4} fill="#ef4444" />
          <text x={padL + 118} y={padT + 16} fontSize={9} fill="#ef4444">OOD (high uncertainty)</text>
          <line x1={padL + 240} y1={padT + 12} x2={padL + 260} y2={padT + 12} stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4,2" />
          <text x={padL + 264} y={padT + 16} fontSize={9} fill="#9ca3af">true sin(x)</text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const MCDROPOUT_CODE = `import torch
import torch.nn as nn

class MCDropoutNet(nn.Module):
    """
    Neural network with dropout at EVERY layer — enabled at test time too.
    MC Dropout = approximate Bayesian inference.
    """
    def __init__(self, in_dim, hidden, out_dim, p=0.3):
        super().__init__()
        self.p = p
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden),
            nn.ReLU(),
            nn.Dropout(p),           # dropout after each hidden layer
            nn.Linear(hidden, hidden),
            nn.ReLU(),
            nn.Dropout(p),
            nn.Linear(hidden, out_dim),
        )

    def forward(self, x):
        return self.net(x)   # Dropout active in both train and eval mode

    def predict_with_uncertainty(self, x, n_samples=100):
        """
        MC Dropout inference: run T forward passes with dropout enabled.
        Collects:
          - Predictive mean  (= E_p[y|x])
          - Predictive variance (epistemic uncertainty)
        """
        self.train()   # keep dropout active!  (NOT self.eval())
        with torch.no_grad():
            preds = torch.stack([self(x) for _ in range(n_samples)])  # (T, n, out)

        mean = preds.mean(0)         # predictive mean
        var  = preds.var(0)          # epistemic variance (variance across dropout masks)
        return mean, var

    def predict_decomposed_uncertainty(self, x, n_samples=100, sigma_noise=0.1):
        """
        Decompose predictive variance into epistemic + aleatoric:
        Var[y*] = E_w[Var[y*|w]] + Var_w[E[y*|w]]
                = sigma_noise^2 + epistemic_variance
        (For regression with fixed aleatoric noise sigma_noise)
        """
        self.train()
        with torch.no_grad():
            preds = torch.stack([self(x) for _ in range(n_samples)])

        epistemic = preds.var(0)                  # variance of predictions
        aleatoric = sigma_noise ** 2              # fixed noise level
        total = epistemic + aleatoric
        return preds.mean(0), epistemic, aleatoric * torch.ones_like(epistemic), total


# -----------------------------------------------------------------------
# Calibration check: Expected Calibration Error (ECE)
# -----------------------------------------------------------------------

def compute_ece(y_true, probs, n_bins=15):
    """
    Expected Calibration Error: measures if confidence = accuracy.
    ECE = sum_b |acc_b - conf_b| * n_b / n
    """
    confidences, predictions = probs.max(dim=1)
    correct = (predictions == y_true).float()

    ece = 0.0
    for i in range(n_bins):
        low  = i / n_bins
        high = (i + 1) / n_bins
        mask = (confidences >= low) & (confidences < high)
        if mask.sum() > 0:
            acc  = correct[mask].mean()
            conf = confidences[mask].mean()
            ece += mask.float().mean() * (acc - conf).abs()

    return ece.item()


# Usage example
# model = MCDropoutNet(784, 256, 10, p=0.3)
# ... (train with standard CE loss) ...
# mean, epistemic = model.predict_with_uncertainty(x_test, n_samples=100)
# ece = compute_ece(y_test, torch.softmax(mean, -1))
# print(f"ECE: {ece:.4f}")  # should be < 0.05 for well-calibrated model
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MCDropout() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          MC Dropout & Uncertainty
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          MC Dropout interprets dropout at test time as approximate Bayesian inference,
          enabling uncertainty quantification in existing neural networks with no
          architectural changes — just keep dropout on during prediction.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Dropout was introduced by <strong>Srivastava et al. (2014)</strong> as a
          regularization technique. <strong>Gal & Ghahramani (2016)</strong> showed its
          Bayesian interpretation: training a network with dropout and $L_2$ regularization
          is equivalent to approximate variational inference in a deep Gaussian process.
          Running MC Dropout at test time samples from this variational posterior.
          The approach was rapidly adopted in medical AI, autonomous driving, and other
          safety-critical applications for uncertainty quantification.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Dropout as Variational Inference"
        definition="A neural network with dropout can be interpreted as a variational distribution over infinitely many thinned networks. Each forward pass samples a binary dropout mask $\mathbf{m}_l \in \{0,1\}^{K_l}$ (zeroing out units with probability $p$), defining a weight matrix $\tilde{W}_l = \mathrm{diag}(\mathbf{m}_l) W_l$. The variational distribution is $q(\{W_l\}) = \prod_l q_l(W_l)$ where $q_l(W_l) = p\,\delta(W_l) + (1-p)\,\mathcal{N}(W_l; M_l, \sigma^2 I)$ (mixture of a zero-weight and a Gaussian)."
        notation="MC Dropout approximates the BNN posterior where each column of $W_l$ is independently zeroed or kept. The prior implicit in this formulation favors sparse weight matrices. Gal (2016) showed this matches VI with a specific prior/guide combination."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="MC Dropout Predictive Distribution"
        definition="Given a trained model with dropout and $T$ stochastic forward passes at test time, the Monte Carlo estimate of the predictive distribution is: $p(y_*|x_*, \mathcal{D}) \approx \frac{1}{T}\sum_{t=1}^T p(y_*|x_*, \hat{W}^{(t)})$ where $\hat{W}^{(t)}$ are independent dropout-sampled weights. The predictive mean is $\bar{y} = \frac{1}{T}\sum_t f(x_*; \hat{W}^{(t)})$ and the epistemic uncertainty is $\mathrm{Var}[y_*] \approx \frac{1}{T}\sum_t f(x_*;\hat{W}^{(t)})^2 - \bar{y}^2$."
        notation="Unlike standard inference (dropout off, single pass), MC Dropout requires $T$ passes at inference — $T\times$ more computation. In practice, $T=50$-$100$ is sufficient for stable estimates. The dropout masks must be re-sampled independently for each forward pass."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Epistemic Uncertainty and OOD Detection"
        definition="MC Dropout separates epistemic (model) uncertainty from aleatoric (data) uncertainty. For regression with Gaussian likelihood with variance $\tau^{-1}$: total uncertainty = $\frac{1}{T}\sum_t f(x_*;W^{(t)})^2 - \bar{f}^2 + \tau^{-1}$ = epistemic + aleatoric. On out-of-distribution inputs, epistemic uncertainty grows — different dropout masks produce very different predictions. This enables OOD detection: flag inputs with high epistemic variance."
        notation="For classification, the entropy of the averaged softmax $H[\frac{1}{T}\sum_t \mathrm{softmax}(f(x_*;W^{(t)}))]$ measures total uncertainty. Mutual information between labels and weights measures epistemic uncertainty. Both can serve as OOD scores."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="MC Dropout Minimizes a Variational Objective"
        statement="Training a neural network with dropout and L2 regularization is equivalent to minimizing an approximation to the KL divergence $\mathrm{KL}(q(\mathbf{W})\|p(\mathbf{W}|\mathcal{D}))$ between the dropout variational distribution $q$ and the true posterior $p(\mathbf{W}|\mathcal{D})$. Specifically, the training objective equals the negative ELBO: $-\mathcal{L} = \frac{N}{M}\sum_{m=1}^M E(y_m, f^{\hat{W}}(x_m)) + \lambda\sum_l(\|W_l\|^2 + \|b_l\|^2)$ up to a constant."
        proof="The ELBO is $\mathcal{L} = \mathbb{E}_{q(W)}[\log p(\mathcal{D}|W)] - \mathrm{KL}(q(W)\|p(W))$. For Gaussian likelihood: $\mathbb{E}_q[\log p(\mathcal{D}|W)] \approx \frac{N}{M}\sum_m E(y_m, f^{\hat{W}}(x_m))$ (MC estimate with dropout samples). For the KL with a specific Gaussian mixture prior: $\mathrm{KL}(q\|p) \approx \lambda\sum_l(\|W_l\|^2 + \|b_l\|^2) + C$. Combining and negating: the standard dropout training objective. $\square$"
        corollaries={[
          "This justifies MC Dropout as Bayesian inference post-hoc — no retraining needed. Any existing network trained with dropout can be used for Bayesian prediction by keeping dropout active at test time.",
          "The optimal dropout rate $p$ minimizes the KL divergence — it depends on the data and model. In practice, cross-validate p ∈ {0.1, 0.2, 0.3, 0.5}.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="MC Dropout Converges to Posterior Mean"
        statement="As $T \to \infty$, the MC Dropout predictive mean converges to the variational Bayes predictive mean: $\frac{1}{T}\sum_{t=1}^T f(x; W^{(t)}) \to \mathbb{E}_{q(W)}[f(x; W)]$ almost surely. For $T$ fixed, the estimation error is $O(T^{-1/2})$ by the law of large numbers."
        proof="By the strong law of large numbers, for any $\varepsilon > 0$: $P\!\left(\left|\frac{1}{T}\sum_t f(x;W^{(t)}) - \mathbb{E}_q[f(x;W)]\right| > \varepsilon\right) \to 0$ as $T \to \infty$, since $\{f(x;W^{(t)})\}$ are iid samples from $q(W)$ with finite variance (for bounded networks with sigmoid/tanh activations). The rate is $O(T^{-1/2})$ by the central limit theorem. $\square$"
        corollaries={[
          "For ReLU networks, the variance of $f(x;W^{(t)})$ may be unbounded — use output clipping or bounded activations for reliable convergence.",
          "Antithetic sampling (paired dropout masks) can reduce the Monte Carlo variance by a factor of 2 without increasing the number of forward passes.",
        ]}
      />

      <MCDropoutViz />

      <ExampleBlock
        title="MC Dropout for Medical Image Classification"
        problem="A CNN classifies chest X-rays as 'Pneumonia' or 'Normal'. Using MC Dropout with T=100 passes, explain how to use epistemic uncertainty for triaging cases to human radiologists."
        difficulty="intermediate"
        solution={[
          {
            step: 'Enable dropout at test time (keep model.train() mode)',
            explanation: 'Run T=100 forward passes for each X-ray. Collect softmax probabilities for each pass: shape (100, batch_size, 2).',
          },
          {
            step: 'Compute predictive entropy',
            formula: 'H[y_*|x_*] = -\\sum_c \\bar{p}_c \\log \\bar{p}_c, \\quad \\bar{p} = \\frac{1}{T}\\sum_t p^{(t)}',
            explanation: 'High entropy = uncertain prediction. For a binary classifier, maximum entropy = log(2) ≈ 0.693 (completely uncertain).',
          },
          {
            step: 'Compute mutual information (epistemic uncertainty)',
            formula: 'I(y_*, w) = H[y_*|x_*] - \\mathbb{E}_w[H[y_*|x_*, w]]',
            explanation: 'MI measures how much the prediction changes across dropout samples — high MI = model is uncertain about the underlying weights, not just the prediction.',
          },
          {
            step: 'Triage strategy',
            explanation: 'Route cases with MI > threshold to human radiologists. Empirically: 20% of cases with highest epistemic uncertainty contain 60% of misclassifications — targeted review improves overall accuracy with minimal human effort.',
          },
        ]}
      />

      <WarningBlock title="MC Dropout Limitations and Critiques">
        <ul className="space-y-2 text-sm">
          <li><strong>Posterior approximation quality:</strong> The dropout variational distribution is a coarse approximation — it uses a specific mixture prior and cannot represent complex posterior correlations. Ovadya (2019) showed MC Dropout can be overconfident on OOD data for certain network architectures.</li>
          <li><strong>Requires dropout to have been used during training:</strong> MC Dropout does not apply to networks trained without dropout (e.g., most batch-norm-only networks). Batch normalization and dropout interact poorly — when both are used, the posterior estimate degrades. Use one or the other.</li>
          <li><strong>Computational overhead at inference:</strong> T=100 forward passes = 100× inference cost. For real-time applications, use T=5-20 or approximate with a single deterministic forward pass (using Concrete Dropout or analytical approximations).</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={MCDROPOUT_CODE}
        language="python"
        title="MC Dropout Inference and Uncertainty Decomposition — PyTorch"
        runnable
      />
    </div>
  );
}
