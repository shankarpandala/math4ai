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
// Weight Distribution Before/After Training
// ---------------------------------------------------------------------------

function WeightDistributionViz() {
  const [epoch, setEpoch] = useState(50);
  const [layerIdx, setLayerIdx] = useState(0);

  function gaussianPDF(x, mu, sigma) {
    return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  }

  // Simulate prior and posterior weight distributions
  // Prior: N(0, 1)
  // After training: posterior narrows around MAP estimate, variance shrinks
  const priorMu = 0, priorSigma = 1.0;

  // Posterior narrows as training progresses (more data -> sharper posterior)
  const trainingFactor = epoch / 100; // 0 to 1
  const layerOffset = [0, 0.4, -0.3][layerIdx];
  const postMu = layerOffset * trainingFactor;
  const postSigma = Math.max(priorSigma * (1 - 0.65 * trainingFactor), 0.1);

  const N = 100;
  const xMin = -3.5, xMax = 3.5;
  const xs = Array.from({ length: N }, (_, i) => xMin + (i / (N - 1)) * (xMax - xMin));

  const priorPDF = xs.map((x) => gaussianPDF(x, priorMu, priorSigma));
  const postPDF = xs.map((x) => gaussianPDF(x, postMu, postSigma));

  const svgW = 480, svgH = 180;
  const padL = 36, padR = 12, padT = 20, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const pMax = Math.max(...priorPDF, ...postPDF) * 1.1;
  function tx(x) { return padL + ((x - xMin) / (xMax - xMin)) * plotW; }
  function ty(p) { return padT + (1 - Math.min(p, pMax) / pMax) * plotH; }

  const priorPoints = xs.map((x, i) => `${tx(x).toFixed(1)},${ty(priorPDF[i]).toFixed(1)}`).join(' ');
  const postPoints = xs.map((x, i) => `${tx(x).toFixed(1)},${ty(postPDF[i]).toFixed(1)}`).join(' ');

  const layers = ['Layer 1', 'Layer 2', 'Layer 3 (output)'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        BNN Weight Distribution: Prior → Posterior
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The weight prior (gray) is <InlineMath math="\mathcal{N}(0,1)" />. As training progresses,
        the posterior (blue) sharpens around the MAP estimate and shifts with the data.
      </p>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">Training epoch</label>
          <input type="range" min={0} max={100} step={1} value={epoch}
            onChange={(e) => setEpoch(parseInt(e.target.value))}
            className="h-2 flex-1 accent-blue-500" />
          <span className="w-10 text-right font-mono text-sm font-bold text-blue-600">{epoch}</span>
        </div>
        <div className="flex gap-2">
          {layers.map((name, i) => (
            <button key={i} onClick={() => setLayerIdx(i)}
              className={`rounded px-3 py-1 text-xs font-medium ${layerIdx === i ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
            <text key={v} x={tx(v)} y={padT + plotH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">{v}</text>
          ))}
          <polyline points={priorPoints} fill="none" stroke="#9ca3af" strokeWidth={2} strokeDasharray="6,3" />
          <polyline points={postPoints} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* Posterior mean marker */}
          <line x1={tx(postMu)} y1={padT} x2={tx(postMu)} y2={padT + plotH}
            stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
          {/* Legend */}
          <line x1={padL + 10} y1={padT + 12} x2={padL + 30} y2={padT + 12} stroke="#9ca3af" strokeWidth={2} strokeDasharray="6,3" />
          <text x={padL + 34} y={padT + 16} fontSize={9} fill="#9ca3af">Prior N(0,1)</text>
          <line x1={padL + 110} y1={padT + 12} x2={padL + 130} y2={padT + 12} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={padL + 134} y={padT + 16} fontSize={9} fill="#3b82f6" fontWeight="bold">
            Posterior N({postMu.toFixed(2)}, {(postSigma ** 2).toFixed(2)})
          </text>
          <text x={padL + plotW / 2} y={padT + plotH + 26} textAnchor="middle" fontSize={9} fill="#9ca3af">weight value</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-gray-50 py-2 dark:bg-gray-800">
          <p className="text-xs text-gray-400">Prior σ</p>
          <p className="font-mono font-bold text-gray-700 dark:text-gray-300">1.000</p>
        </div>
        <div className="rounded-lg bg-blue-50 py-2 dark:bg-blue-900/20">
          <p className="text-xs text-blue-400">Posterior σ</p>
          <p className="font-mono font-bold text-blue-700 dark:text-blue-300">{postSigma.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 py-2 dark:bg-indigo-900/20">
          <p className="text-xs text-indigo-400">Uncertainty reduction</p>
          <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
            {((1 - postSigma) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const BNN_CODE = `import torch
import torch.nn as nn
import torch.distributions as D

class BayesianLinear(nn.Module):
    """
    Bayesian linear layer: weight posterior q(W) = N(W_mu, softplus(W_rho)^2)
    Uses the local reparameterization trick for efficiency.
    """
    def __init__(self, in_features, out_features, prior_std=1.0):
        super().__init__()
        self.in_features  = in_features
        self.out_features = out_features

        # Variational parameters: mean and log-std of weights
        self.W_mu  = nn.Parameter(torch.zeros(out_features, in_features))
        self.W_rho = nn.Parameter(torch.full((out_features, in_features), -3.0))
        self.b_mu  = nn.Parameter(torch.zeros(out_features))
        self.b_rho = nn.Parameter(torch.full((out_features,), -3.0))

        self.prior = D.Normal(0, prior_std)

    @property
    def W_sigma(self): return torch.nn.functional.softplus(self.W_rho)
    @property
    def b_sigma(self): return torch.nn.functional.softplus(self.b_rho)

    def forward(self, x):
        # Reparameterized weight sample
        W = self.W_mu + self.W_sigma * torch.randn_like(self.W_sigma)
        b = self.b_mu + self.b_sigma * torch.randn_like(self.b_sigma)
        return x @ W.T + b

    def kl_divergence(self):
        """KL( q(W) || p(W) ) for Gaussian-Gaussian."""
        kl_W = D.Normal(self.W_mu, self.W_sigma).log_prob(self.W_mu) \
             - self.prior.log_prob(self.W_mu)
        kl_b = D.Normal(self.b_mu, self.b_sigma).log_prob(self.b_mu) \
             - self.prior.log_prob(self.b_mu)
        # Better: closed-form KL
        def kl_gaussian(mu, sigma, prior_std=1.0):
            return 0.5 * (mu**2 / prior_std**2 + (sigma/prior_std)**2
                         - torch.log((sigma/prior_std)**2) - 1)
        return kl_gaussian(self.W_mu, self.W_sigma).sum() \
             + kl_gaussian(self.b_mu, self.b_sigma).sum()

class BNN(nn.Module):
    def __init__(self, in_dim, hidden, out_dim):
        super().__init__()
        self.layers = nn.ModuleList([
            BayesianLinear(in_dim, hidden),
            BayesianLinear(hidden, hidden),
            BayesianLinear(hidden, out_dim),
        ])

    def forward(self, x):
        for layer in self.layers[:-1]:
            x = torch.relu(layer(x))
        return self.layers[-1](x)

    def elbo(self, x, y, n_samples=5, dataset_size=1000):
        kl = sum(layer.kl_divergence() for layer in self.layers)
        # Monte Carlo log-likelihood
        log_liks = torch.stack([
            D.Normal(self(x), 0.1).log_prob(y).sum()
            for _ in range(n_samples)
        ]).mean()
        return log_liks - kl / dataset_size   # scaled KL

    @torch.no_grad()
    def predict_uncertainty(self, x, n_samples=50):
        """Predictive mean and std (epistemic uncertainty)."""
        preds = torch.stack([self(x) for _ in range(n_samples)])
        return preds.mean(0), preds.std(0)
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function BNN() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Bayesian Neural Networks
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Bayesian Neural Networks place prior distributions over neural network weights,
          enabling uncertainty quantification in deep learning through posterior inference
          via variational inference or MCMC.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          BNNs were pioneered by <strong>MacKay (1992)</strong> and <strong>Neal (1995)</strong>,
          who applied the Laplace approximation and HMC respectively. Neal's 1995 PhD thesis
          showed connections between infinite-width BNNs and GPs. Modern BNN scalability came
          from <strong>Graves (2011)</strong> (variational Bayes) and
          <strong> Blundell et al. (2015)</strong> (Bayes by Backprop), which introduced
          the reparameterization trick into BNN training.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Bayesian Neural Network"
        definition="A BNN places a prior distribution $p(W)$ over all neural network parameters $W = \{W_l, b_l\}_{l=1}^L$ and computes the predictive distribution by integrating over the weight posterior: $p(y_*|x_*, \mathcal{D}) = \int p(y_*|x_*, W)\,p(W|\mathcal{D})\,dW$. For classification with softmax: $p(W|\mathcal{D}) \propto p(\mathcal{D}|W)p(W) = \prod_n p(y_n|x_n, W) \cdot p(W)$. The integral over $W$ is intractable — approximated via VI or MCMC."
        notation="Common priors: isotropic Gaussian $p(W) = \prod_{ij}\mathcal{N}(w_{ij}; 0, \sigma_0^2)$, mixture-of-Gaussians (spike-and-slab for sparsity). The prior encodes regularization — Gaussian prior = L2 regularization in the MAP limit."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Bayes by Backprop — Variational BNN"
        definition="Bayes by Backprop (Blundell et al., 2015) approximates the posterior with a factorized Gaussian: $q_\phi(W) = \prod_{ij}\mathcal{N}(w_{ij};\mu_{ij}, \sigma_{ij}^2)$. The ELBO is maximized: $\mathcal{L}(\phi) = \mathbb{E}_{q_\phi(W)}[\log p(\mathcal{D}|W)] - \mathrm{KL}(q_\phi(W) \| p(W))$. The KL term is analytic (Gaussian-Gaussian); the likelihood term is estimated via Monte Carlo with reparameterized weight samples $W = \mu + \sigma \odot \varepsilon$, $\varepsilon \sim \mathcal{N}(0,I)$."
        notation="Each weight $w_{ij}$ has two parameters: $(\mu_{ij}, \rho_{ij})$ where $\sigma_{ij} = \mathrm{softplus}(\rho_{ij}) > 0$. This doubles the parameter count. The local reparameterization trick (Kingma et al., 2015) activates $a = W\mu + W\sigma \odot \varepsilon x$ directly in activation space, reducing variance."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Epistemic vs Aleatoric Uncertainty"
        definition="BNNs distinguish two sources of uncertainty: (1) Epistemic (model) uncertainty: uncertainty in the model parameters $W$ due to limited data, captured by the posterior variance $\mathrm{Var}_{p(W|\mathcal{D})}[f_W(x)]$. This decreases with more data. (2) Aleatoric (data) uncertainty: inherent stochasticity in the data-generating process $p(y|x,W)$, captured by the likelihood variance. This does not decrease with more data."
        notation="Total predictive variance = epistemic + aleatoric: $\mathrm{Var}[y_*|x_*] = \underbrace{\mathrm{Var}_{W}[\mathbb{E}[y|x,W]]}_\text{epistemic} + \underbrace{\mathbb{E}_W[\mathrm{Var}[y|x,W]]}_\text{aleatoric}$. For regression with Gaussian output: aleatoric = $\sigma_\text{noise}^2$; epistemic = variance of predictions across weight samples."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Infinite-Width BNN Converges to a GP"
        statement="A single-hidden-layer BNN with $H$ hidden units, iid Gaussian weight priors $w_j \sim \mathcal{N}(0, \sigma_w^2/H)$ and $b_j \sim \mathcal{N}(0, \sigma_b^2)$, and any bounded activation function $\phi$, converges in distribution to a Gaussian Process as $H \to \infty$: $f(x) \to \mathcal{GP}(0, k(x, x'))$ where $k(x,x') = \sigma_b^2 + \sigma_w^2\,\mathbb{E}_{w,b}[\phi(w^T x + b)\phi(w^T x' + b)]$."
        proof="Each pre-activation $z_j(x) = w_j^T x + b_j$ is iid over $j$ with variance $\sigma_w^2\|x\|^2/H + \sigma_b^2$. The output $f(x) = \sum_{j=1}^H v_j \phi(z_j(x))/\sqrt{H}$ is a sum of $H$ iid terms with finite variance. By the multivariate CLT, for any finite set of inputs $(x_1,\ldots,x_n)$, the joint $(f(x_1),\ldots,f(x_n))$ converges in distribution to a multivariate Gaussian as $H\to\infty$. The covariance $k(x,x') = \sigma_w^2\mathbb{E}[\phi(z)\phi(z')] + \sigma_b^2$ is the kernel. $\square$"
        corollaries={[
          "Deep BNNs (with multiple hidden layers) also converge to GPs (Neal, 1995; Lee et al., 2018). The kernel is recursively defined through the activation functions.",
          "Neural Tangent Kernels (Jacot et al., 2018) characterize the behavior of finite-width networks in the infinite-width limit during gradient descent.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="ELBO for BNNs Equals Regularized Log-Likelihood"
        statement="The BNN ELBO with Gaussian prior $p(W) = \mathcal{N}(0, \sigma_0^2 I)$ and Gaussian variational posterior $q_\phi(W) = \mathcal{N}(\mu, \mathrm{diag}(\sigma^2))$ is: $\mathcal{L} = \sum_n \mathbb{E}_q[\log p(y_n|x_n,W)] - \frac{1}{2\sigma_0^2}\|\mu\|^2 - \text{const}$, which in the zero-variance limit ($\sigma \to 0$) recovers L2-regularized MLE (weight decay = $1/(2\sigma_0^2)$)."
        proof="$\mathrm{KL}(\mathcal{N}(\mu,\sigma^2)\|\mathcal{N}(0,\sigma_0^2)) = \frac{1}{2}\left[\frac{\|\mu\|^2}{\sigma_0^2} + \frac{\sum\sigma_i^2}{\sigma_0^2} - d - \sum\log\sigma_i^2 + d\log\sigma_0^2\right]$. As $\sigma \to 0$, the dominant term is $\frac{\|\mu\|^2}{2\sigma_0^2}$ (plus constants). The ELBO reduces to $\sum_n \log p(y_n|x_n,\mu) - \frac{\|\mu\|^2}{2\sigma_0^2}$ — exactly L2-regularized negative log-likelihood. This shows that standard neural network training with weight decay is a limiting case of Bayesian learning. $\square$"
        corollaries={[
          "Bayesian inference generalizes weight decay: it maintains a distribution over weights rather than a point estimate, enabling uncertainty quantification.",
          "The posterior variance $\\sigma_i^2$ encodes which weights are well-determined by the data (small $\\sigma_i$) vs. underdetermined (large $\\sigma_i$).",
        ]}
      />

      <WeightDistributionViz />

      <ExampleBlock
        title="BNN Uncertainty on Out-of-Distribution Data"
        problem="A BNN trained on in-distribution (ID) data x ∈ [-2, 2] should express high uncertainty on out-of-distribution (OOD) data x > 3. How does the BNN posterior achieve this?"
        difficulty="advanced"
        solution={[
          {
            step: 'Epistemic uncertainty grows with distance from training data',
            explanation: 'For x far from training data, few weight configurations in the posterior fit the observed data at x — the posterior weight variance is large at these inputs, leading to high predictive variance.',
          },
          {
            step: 'Predictive variance via ensemble of weight samples',
            formula: '\\mathrm{Var}[y_*|x_*] \\approx \\frac{1}{S}\\sum_s (f_{W^{(s)}}(x_*) - \\bar{f}(x_*))^2, \\quad W^{(s)} \\sim q_\\phi(W)',
            explanation: 'Different weight samples predict very different values at OOD x — high spread = high uncertainty. At ID points, all samples agree.',
          },
          {
            step: 'Limitation: overconfident BNNs',
            explanation: 'Variational BNNs with mean-field Gaussians often remain overconfident OOD because the approximate posterior q does not capture the full weight uncertainty. More expressive posteriors (normalizing flows over weights, MCMC) give better calibration.',
          },
        ]}
      />

      <WarningBlock title="BNN Practical Challenges">
        <ul className="space-y-2 text-sm">
          <li><strong>Double parameter count:</strong> Each weight needs (μ, ρ), doubling memory and compute. For a ResNet-50 with 25M weights, this means 50M parameters. Practical alternatives: last-layer BNNs (only last layer is Bayesian), MCDropout (see MC Dropout section).</li>
          <li><strong>Posterior underestimation in VI:</strong> Mean field VI underestimates posterior variance (Theorem in Mean Field section). BNN predictions may be overconfident despite using Bayesian inference. Ensemble methods (deep ensembles) often outperform variational BNNs in practice.</li>
          <li><strong>Gradient variance:</strong> The ELBO gradient has high variance from weight sampling. Use local reparameterization, sufficient n_samples (≥5), and a good prior-std warmup schedule (anneal KL weight from 0 to 1).</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={BNN_CODE}
        language="python"
        title="Bayesian Neural Network with Bayes by Backprop — PyTorch"
        runnable
      />
    </div>
  );
}
