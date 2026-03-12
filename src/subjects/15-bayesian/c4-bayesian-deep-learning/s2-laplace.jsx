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
// Laplace Approximation Visualizer — quadratic approx around MAP
// ---------------------------------------------------------------------------

function LaplaceViz() {
  const [mapX, setMapX] = useState(1.2);
  const [showTrue, setShowTrue] = useState(true);

  // True (unnormalized) log posterior: bimodal with peaks at ~±1.5
  function logPostTrue(x) {
    return -0.5 * (x - 1.5) ** 2 * 4 + Math.log(1 + Math.exp(-3 * (x - 0.5) ** 2));
  }

  // Numerical second derivative at mapX
  const h = 0.001;
  const logpMap = logPostTrue(mapX);
  const d2logp = (logPostTrue(mapX + h) - 2 * logPostTrue(mapX) + logPostTrue(mapX - h)) / (h * h);
  const hessian = -d2logp; // Hessian of -log p (positive definite at MAP)
  const laplaceVar = Math.max(1 / Math.max(hessian, 0.01), 0.01);
  const laplaceSigma = Math.sqrt(laplaceVar);

  function gaussianPDF(x, mu, sigma) {
    return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  }

  // Normalize true posterior numerically
  const N = 150;
  const xMin = -4, xMax = 4;
  const xs = Array.from({ length: N }, (_, i) => xMin + (i / (N - 1)) * (xMax - xMin));
  const trueVals = xs.map((x) => Math.exp(logPostTrue(x)));
  const trueMax = Math.max(...trueVals);
  const truePDF = trueVals.map((v) => v / (trueMax * 2.5)); // rough normalization

  const laplacePDF = xs.map((x) => gaussianPDF(x, mapX, laplaceSigma));

  const svgW = 480, svgH = 200;
  const padL = 36, padR = 12, padT = 20, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMax = Math.max(...truePDF, ...laplacePDF) * 1.15;
  function tx(x) { return padL + ((x - xMin) / (xMax - xMin)) * plotW; }
  function ty(p) { return padT + (1 - Math.min(p, yMax) / yMax) * plotH; }

  const truePoints = xs.map((x, i) => `${tx(x).toFixed(1)},${ty(truePDF[i]).toFixed(1)}`).join(' ');
  const lapPoints = xs.map((x, i) => `${tx(x).toFixed(1)},${ty(laplacePDF[i]).toFixed(1)}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Laplace Approximation — Quadratic Approximation around MAP
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag the MAP position to see the Laplace Gaussian approximation (blue) fit the true
        posterior (gray). The curvature <InlineMath math="\mathbf{H}^{-1}" /> sets the variance.
      </p>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
            MAP position
          </label>
          <input type="range" min={-2} max={2.5} step={0.05} value={mapX}
            onChange={(e) => setMapX(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-blue-500" />
          <span className="w-12 text-right font-mono text-sm font-bold text-blue-600">{mapX.toFixed(2)}</span>
        </div>
        <button onClick={() => setShowTrue((v) => !v)}
          className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600">
          {showTrue ? 'Hide' : 'Show'} true posterior
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
            <text key={v} x={tx(v)} y={padT + plotH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">{v}</text>
          ))}
          {showTrue && <polyline points={truePoints} fill="none" stroke="#9ca3af" strokeWidth={2} />}
          <polyline points={lapPoints} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* MAP marker */}
          <line x1={tx(mapX)} y1={padT} x2={tx(mapX)} y2={padT + plotH}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={tx(mapX)} y={padT - 4} textAnchor="middle" fontSize={9} fill="#ef4444">MAP</text>
          {/* Legend */}
          {showTrue && <line x1={padL + 8} y1={padT + 12} x2={padL + 28} y2={padT + 12} stroke="#9ca3af" strokeWidth={2} />}
          {showTrue && <text x={padL + 32} y={padT + 16} fontSize={9} fill="#9ca3af">True p(w|D)</text>}
          <line x1={padL + 110} y1={padT + 12} x2={padL + 130} y2={padT + 12} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={padL + 134} y={padT + 16} fontSize={9} fill="#3b82f6" fontWeight="bold">Laplace approx</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-red-50 py-2 dark:bg-red-900/20">
          <p className="text-xs text-gray-400">Hessian H</p>
          <p className="font-mono font-bold text-red-700 dark:text-red-300">{hessian.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-blue-50 py-2 dark:bg-blue-900/20">
          <p className="text-xs text-blue-400">Laplace σ²=H⁻¹</p>
          <p className="font-mono font-bold text-blue-700 dark:text-blue-300">{laplaceVar.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 py-2 dark:bg-indigo-900/20">
          <p className="text-xs text-indigo-400">Laplace σ</p>
          <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{laplaceSigma.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const LAPLACE_CODE = `import torch
import torch.nn as nn
from torch.utils.data import DataLoader

# -----------------------------------------------------------------------
# Laplace Approximation for Neural Networks
# Step 1: Train to MAP estimate (standard training with weight decay)
# Step 2: Compute Hessian (or GGN) at MAP
# Step 3: Use N(w_MAP, H^{-1}) as posterior approximation
# -----------------------------------------------------------------------

class MLP(nn.Module):
    def __init__(self, in_dim, hidden, out_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )
    def forward(self, x): return self.net(x)


def map_training(model, loader, n_epochs=100, weight_decay=1e-4):
    """Standard training to MAP estimate = MLE + L2 regularization."""
    opt = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=weight_decay)
    for epoch in range(n_epochs):
        for x, y in loader:
            loss = nn.functional.cross_entropy(model(x), y)
            opt.zero_grad(); loss.backward(); opt.step()
    return model


def compute_diagonal_ggn(model, loader, n_classes):
    """
    Diagonal Generalized Gauss-Newton (GGN) approximation of the Hessian.
    Cheaper than full Hessian but ignores off-diagonal structure.
    GGN = J^T H_loss J  where J is the Jacobian of the output.
    """
    diag_ggn = [torch.zeros_like(p) for p in model.parameters()]

    for x, y in loader:
        out = model(x)
        probs = torch.softmax(out, dim=-1)

        for c in range(n_classes):
            # For cross-entropy: H_loss is diagonal with probs*(1-probs)
            weight = probs[:, c] * (1 - probs[:, c])

            # Compute gradient of output c w.r.t. parameters
            model.zero_grad()
            out[:, c].sum().backward(retain_graph=(c < n_classes - 1))

            for i, p in enumerate(model.parameters()):
                if p.grad is not None:
                    diag_ggn[i] += (weight.mean() * p.grad ** 2).detach()

    return diag_ggn


def laplace_sample(model, diag_ggn, prior_prec=1.0, n_samples=50):
    """
    Sample from Laplace posterior:
    w ~ N(w_MAP, (H + prior_prec * I)^{-1})
    Using diagonal approximation: each weight independently.
    """
    w_map = [p.detach().clone() for p in model.parameters()]
    samples = []

    for _ in range(n_samples):
        perturbed = []
        for w, h in zip(w_map, diag_ggn):
            sigma = 1.0 / torch.sqrt(h + prior_prec + 1e-6)
            perturbed.append(w + sigma * torch.randn_like(w))
        samples.append(perturbed)
    return samples


# Predictive uncertainty: MC average over Laplace samples
@torch.no_grad()
def laplace_predict(model, x, laplace_samples):
    """Predictive distribution by Monte Carlo over Laplace posterior samples."""
    all_probs = []
    original_params = [p.clone() for p in model.parameters()]

    for sample in laplace_samples:
        # Load sampled weights
        for p, w in zip(model.parameters(), sample):
            p.data = w
        probs = torch.softmax(model(x), dim=-1)
        all_probs.append(probs)

    # Restore original weights
    for p, w in zip(model.parameters(), original_params):
        p.data = w

    pred_mean = torch.stack(all_probs).mean(0)
    pred_std  = torch.stack(all_probs).std(0)
    return pred_mean, pred_std   # mean prediction + epistemic uncertainty
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Laplace() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Laplace Approximation
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The Laplace approximation fits a Gaussian to the posterior at its mode (MAP estimate),
          using the negative Hessian of the log-posterior as the precision matrix — a
          post-hoc Bayesian uncertainty method for trained neural networks.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          The Laplace approximation for Bayesian inference dates to <strong>Laplace (1774)</strong>
          for approximating integrals in Bayesian inference. In machine learning,
          <strong> MacKay (1992)</strong> applied it to neural networks, and it was recently
          revived by <strong>Ritter et al. (2018)</strong> (Kronecker-factored Laplace) and
          <strong> Daxberger et al. (2021)</strong> (laplace library, last-layer Laplace),
          showing that post-hoc Laplace on a pre-trained deterministic model is competitive
          with full Bayesian training.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Laplace Approximation"
        definition="Given the log-posterior $\log p(w|\mathcal{D}) = \log p(\mathcal{D}|w) + \log p(w) + C$, the Laplace approximation finds the MAP estimate $w_\mathrm{MAP} = \arg\max_w \log p(w|\mathcal{D})$ and approximates the posterior as a Gaussian centered at $w_\mathrm{MAP}$: $p(w|\mathcal{D}) \approx \mathcal{N}(w;\, w_\mathrm{MAP},\, \Sigma)$ where $\Sigma = (-\nabla^2_{ww}\log p(w|\mathcal{D})|_{w_\mathrm{MAP}})^{-1} = \mathbf{H}^{-1}$ and $\mathbf{H} = \mathbf{H}_\mathrm{NLL} + \mathbf{H}_\mathrm{prior}$ is the Hessian of the negative log-posterior."
        notation="For a Gaussian prior $p(w) = \mathcal{N}(0, \lambda^{-1} I)$: $\mathbf{H} = \mathbf{H}_\mathrm{NLL} + \lambda I$. The prior contributes $\lambda$ to the diagonal, ensuring $\mathbf{H}$ is positive definite. In practice, $w_\mathrm{MAP}$ is found by standard training with L2 regularization (weight decay = $\lambda$)."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Hessian Approximations for Neural Networks"
        definition="The full Hessian $\mathbf{H} \in \mathbb{R}^{d \times d}$ is intractable for large networks ($d \sim 10^6$). Common approximations: (1) Diagonal: $\mathbf{H} \approx \mathrm{diag}(\mathbf{H})$ — ignores all parameter correlations; (2) KFAC (Kronecker-Factored): approximates blocks of $\mathbf{H}$ as Kronecker products of input/output Jacobians — captures layer structure; (3) GGN (Generalized Gauss-Newton): $\mathbf{H} \approx J^T \mathbf{H}_\mathrm{loss} J$ — PSD by construction; (4) Last-layer only: Hessian for output layer weights only — scales to large models."
        notation="KFAC approximation: $\mathbf{H}_l \approx \mathbf{A}_{l-1} \otimes \mathbf{G}_l$ where $\mathbf{A}_{l-1} = \mathbb{E}[a_{l-1}a_{l-1}^T]$ (input covariance) and $\mathbf{G}_l = \mathbb{E}[\delta_l \delta_l^T]$ (gradient covariance). Inversion: $(\mathbf{A} \otimes \mathbf{G})^{-1} = \mathbf{A}^{-1} \otimes \mathbf{G}^{-1}$."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Marginal Likelihood Under Laplace"
        definition="The Laplace approximation gives an analytic estimate of the log marginal likelihood: $\log p(\mathcal{D}) \approx \log p(\mathcal{D}|w_\mathrm{MAP}) + \log p(w_\mathrm{MAP}) + \frac{d}{2}\log 2\pi - \frac{1}{2}\log|\mathbf{H}|$ where $d$ is the number of parameters and $|\mathbf{H}|$ is the determinant of the Hessian. This can be used for model selection (comparing architectures or hyperparameters) without cross-validation."
        notation="$\frac{1}{2}\log|\mathbf{H}|$ penalizes model complexity (Occam factor) — complex models with many sharp posterior modes are penalized. This is the Bayesian Information Criterion (BIC) when $|\mathbf{H}| \approx n^d$ for large $n$."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Laplace Approximation Error and Validity"
        statement="The Laplace approximation $q(w) = \mathcal{N}(w_\mathrm{MAP}, \mathbf{H}^{-1})$ satisfies: (i) $q(w_\mathrm{MAP}) = p(w_\mathrm{MAP}|\mathcal{D})/Z$ (matches the true posterior at the mode, up to normalization); (ii) $\nabla^2_w \log q(w)|_{w_\mathrm{MAP}} = \nabla^2_w \log p(w|\mathcal{D})|_{w_\mathrm{MAP}}$ (matches curvature at the mode). The approximation error is $O(\|w - w_\mathrm{MAP}\|^3)$ — cubic in the distance from the MAP."
        proof="Expanding $\log p(w|\mathcal{D})$ around $w_\mathrm{MAP}$ using Taylor's theorem: $\log p(w|\mathcal{D}) = \log p(w_\mathrm{MAP}|\mathcal{D}) + (w-w_\mathrm{MAP})^T\underbrace{\nabla\log p}_{=0} - \frac{1}{2}(w-w_\mathrm{MAP})^T\mathbf{H}(w-w_\mathrm{MAP}) + O(\|w-w_\mathrm{MAP}\|^3)$. The first-order term vanishes at the MAP. Taking the exponential: $p(w|\mathcal{D}) \approx p(w_\mathrm{MAP}|\mathcal{D})\exp(-\frac{1}{2}(w-w_\mathrm{MAP})^T\mathbf{H}(w-w_\mathrm{MAP})) \propto \mathcal{N}(w_\mathrm{MAP}, \mathbf{H}^{-1})$. $\square$"
        corollaries={[
          "The approximation is exact for Gaussian posteriors (all higher-order terms vanish), i.e., Gaussian-Gaussian linear models.",
          "For multimodal posteriors, the Laplace approximation misses all but the largest mode — a critical failure mode for complex models.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Last-Layer Laplace is Efficient and Well-Calibrated"
        statement="Applying the Laplace approximation only to the last-layer weights $W_\mathrm{last}$ while treating earlier layers deterministically (at MAP) achieves comparable uncertainty calibration to full-network Laplace at a fraction of the computational cost. The predictive distribution is $p(y_*|x_*, \mathcal{D}) = \int p(y_*|f(x_*; w_\mathrm{last})) q(w_\mathrm{last})\,dw_\mathrm{last}$."
        proof="The key insight: for a network $f(x) = W_\mathrm{last} \phi(x; w_{<L})$ where $\phi$ is the penultimate-layer feature map, the Hessian w.r.t. $W_\mathrm{last}$ factors as $\mathbf{H}_{LL} = \Phi^T \mathbf{H}_\mathrm{loss} \Phi$ where $\Phi \in \mathbb{R}^{n \times d}$ is the feature matrix. This is a $d \times d$ matrix (d = last-layer dim), independent of total network depth. The approximation becomes: $q(W_\mathrm{last}) = \mathcal{N}(W_\mathrm{MAP}, \mathbf{H}_{LL}^{-1})$. Daxberger et al. (2021) showed empirically that last-layer Laplace matches or exceeds full-network Laplace on calibration benchmarks. $\square$"
        corollaries={[
          "Last-layer Laplace applies to any pre-trained network with a linear last layer — making it a practical post-hoc Bayesian method without retraining.",
          "The feature space $\\phi(x; w_{<L})$ is treated as a fixed (deterministic) kernel — equivalent to GP regression with a learned kernel.",
        ]}
      />

      <LaplaceViz />

      <ExampleBlock
        title="Laplace Approximation for Binary Logistic Regression"
        problem="1D logistic regression: $p(y=1|x,w) = \sigma(wx)$, prior $w \sim \mathcal{N}(0,1)$. Find $w_\mathrm{MAP}$ and the Laplace posterior given data $\{(x,y)\} = \{(1,1), (2,1), (-1,0)\}$."
        difficulty="advanced"
        solution={[
          {
            step: 'Negative log-posterior to minimize',
            formula: '-\\log p(w|D) = -\\sum_n[y_n\\log\\sigma_n + (1-y_n)\\log(1-\\sigma_n)] + \\frac{w^2}{2}',
            explanation: 'L2 regularized negative log-likelihood. σ_n = σ(w·x_n).',
          },
          {
            step: 'Find MAP via optimization',
            explanation: 'Setting gradient to zero: w_MAP ≈ 0.9 (found numerically). The positive observations (x=1,2) outweigh the negative (x=-1).',
          },
          {
            step: 'Compute Hessian at MAP',
            formula: 'H = \\sum_n x_n^2\\,\\sigma_n(1-\\sigma_n) + 1 \\approx 1.75 + 1 = 2.75',
            explanation: 'The Hessian of the negative log-posterior = sum of weighted x^2 (from logistic) plus 1 (from Gaussian prior).',
          },
          {
            step: 'Laplace posterior',
            formula: 'q(w) = \\mathcal{N}(w_\\mathrm{MAP},\\, H^{-1}) = \\mathcal{N}(0.9,\\, 0.36)',
            explanation: 'Gaussian approximation around MAP with variance 1/2.75 ≈ 0.36. Predictive uncertainty at x=0 (extrapolation) will be higher than at x=1 (training data).',
          },
        ]}
      />

      <WarningBlock title="Laplace Approximation Failure Modes">
        <ul className="space-y-2 text-sm">
          <li><strong>Multimodal posteriors:</strong> Laplace captures only the neighborhood of the MAP mode. For multi-modal posteriors (e.g., networks with many equivalent weight permutations), the approximation misses most of the probability mass. Overconfident predictions far from training data are common.</li>
          <li><strong>Hessian computation cost:</strong> Full Hessian is O(d²) in memory for d parameters. For ResNet-50 (25M params), this is 2.5 petabytes — impossible. Kronecker-factored approximations (KFAC, EKFAC) reduce to O(d) storage but introduce approximation error.</li>
          <li><strong>MAP is not the posterior mean:</strong> For asymmetric posteriors, the MAP and posterior mean differ. The Laplace approximation centers the Gaussian at the MAP, which may have lower posterior probability than the true mean — especially for highly skewed posteriors.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={LAPLACE_CODE}
        language="python"
        title="Laplace Approximation for Neural Networks — PyTorch"
        runnable
      />
    </div>
  );
}
