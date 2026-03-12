import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ---------------------------------------------------------------------------
// ELBO Visualizer — Gaussian vs Standard Normal
// ---------------------------------------------------------------------------

function gaussianPDF(x, mu, sigma) {
  const norm = 1.0 / (sigma * Math.sqrt(2 * Math.PI));
  return norm * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

// KL( N(mu, sigma^2) || N(0,1) ) analytically
function klGaussian(mu, sigma) {
  return 0.5 * (mu * mu + sigma * sigma - Math.log(sigma * sigma) - 1);
}

function ELBOVisualizer() {
  const [mu, setMu] = useState(1.0);
  const [logSigma, setLogSigma] = useState(0.0); // log(sigma), so sigma = exp(logSigma)

  const sigma = Math.exp(logSigma);
  const kl = useMemo(() => klGaussian(mu, sigma), [mu, sigma]);

  const svgWidth = 480;
  const svgHeight = 200;
  const xMin = -4;
  const xMax = 6;
  const yMax = 0.9;

  function toSvgX(x) {
    return ((x - xMin) / (xMax - xMin)) * svgWidth;
  }
  function toSvgY(y) {
    return svgHeight - (y / yMax) * svgHeight;
  }

  const N_POINTS = 200;
  const xs = Array.from({ length: N_POINTS }, (_, i) => xMin + (i / (N_POINTS - 1)) * (xMax - xMin));

  function makePolyline(pdfFn) {
    return xs
      .map((x, i) => {
        const y = pdfFn(x);
        return `${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`;
      })
      .join(' ');
  }

  const priorPoints = makePolyline((x) => gaussianPDF(x, 0, 1));
  const approxPoints = makePolyline((x) => gaussianPDF(x, mu, sigma));

  // Shaded overlap area
  const overlapPoints = xs.map((x) => {
    const y = Math.min(gaussianPDF(x, 0, 1), gaussianPDF(x, mu, sigma));
    return `${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`;
  });
  const overlapPath =
    `M ${toSvgX(xs[0])},${toSvgY(0)} ` +
    overlapPoints.join(' ') +
    ` L ${toSvgX(xs[xs.length - 1])},${toSvgY(0)} Z`;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive ELBO Decomposition
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Visualize the approximate posterior{' '}
        <InlineMath math="q(z|x) = \mathcal{N}(\mu, \sigma^2)" /> (blue) vs the prior{' '}
        <InlineMath math="p(z) = \mathcal{N}(0,1)" /> (orange). KL divergence measures
        how far apart they are.
      </p>

      {/* Sliders */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-28 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
            Mean <InlineMath math="\mu" />
          </label>
          <input
            type="range" min={-3} max={4} step={0.1} value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-blue-500"
          />
          <span className="w-14 text-right font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
            {mu.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-28 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
            Log-std <InlineMath math="\log\sigma" />
          </label>
          <input
            type="range" min={-1.5} max={1.0} step={0.05} value={logSigma}
            onChange={(e) => setLogSigma(parseFloat(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-blue-500"
          />
          <span className="w-14 text-right font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
            {logSigma.toFixed(2)}
          </span>
        </div>
      </div>

      {/* SVG Plot */}
      <div className="overflow-x-auto">
        <svg
          width={svgWidth} height={svgHeight}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40"
          style={{ fontFamily: 'inherit' }}
        >
          {/* Axes */}
          <line x1={0} y1={svgHeight} x2={svgWidth} y2={svgHeight} stroke="#9ca3af" strokeWidth={1} />
          {/* Zero line */}
          <line
            x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={svgHeight}
            stroke="#d1d5db" strokeWidth={1} strokeDasharray="3,3"
          />
          {/* Overlap shading */}
          <path d={overlapPath} fill="#a855f7" fillOpacity={0.2} />
          {/* Prior p(z) */}
          <polyline points={priorPoints} fill="none" stroke="#f97316" strokeWidth={2.5} />
          {/* Approx posterior q(z|x) */}
          <polyline points={approxPoints} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* Mean marker */}
          <line
            x1={toSvgX(mu)} y1={0} x2={toSvgX(mu)} y2={svgHeight}
            stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6}
          />
          {/* Labels */}
          <text x={toSvgX(-3.5)} y={svgHeight - 6} fontSize={10} fill="#9ca3af">-4</text>
          <text x={toSvgX(-0.1)} y={svgHeight - 6} fontSize={10} fill="#9ca3af">0</text>
          <text x={toSvgX(3.9)} y={svgHeight - 6} fontSize={10} fill="#9ca3af">4</text>
          <text x={8} y={20} fontSize={10} fill="#f97316" fontWeight="bold">p(z)</text>
          <text x={8} y={34} fontSize={10} fill="#3b82f6" fontWeight="bold">q(z|x)</text>
        </svg>
      </div>

      {/* KL Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-center dark:bg-blue-950/30">
          <p className="text-xs text-blue-500">sigma (σ)</p>
          <p className="mt-1 font-mono text-lg font-bold text-blue-700 dark:text-blue-300">
            {sigma.toFixed(3)}
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 px-4 py-3 text-center dark:bg-purple-950/30">
          <p className="text-xs text-purple-500">KL Divergence</p>
          <p className="mt-1 font-mono text-lg font-bold text-purple-700 dark:text-purple-300">
            {kl.toFixed(4)}
          </p>
        </div>
        <div className="rounded-lg bg-orange-50 px-4 py-3 text-center dark:bg-orange-950/30">
          <p className="text-xs text-orange-500">KL = 0 at</p>
          <p className="mt-1 font-mono text-sm font-bold text-orange-700 dark:text-orange-300">
            μ=0, σ=1
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-800 dark:border-indigo-700/40 dark:bg-indigo-900/20 dark:text-indigo-300">
        {kl < 0.05 ? (
          <span>
            <strong>KL ≈ 0:</strong> The approximate posterior nearly matches the prior.
            Reconstruction term dominates the ELBO — the latent code is informative.
          </span>
        ) : kl > 5 ? (
          <span>
            <strong>Large KL:</strong> The encoder pushes far from the prior. The decoder
            must work hard to reconstruct, but the latent space may be poorly structured.
          </span>
        ) : (
          <span>
            <strong>ELBO = Reconstruction − KL:</strong> Training balances these two terms.
            KL = <strong>{kl.toFixed(3)}</strong> penalizes deviation from the prior.
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const VAE_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# -----------------------------------------------------------------------
# Simple Gaussian VAE for MNIST (784-dimensional binary images)
# -----------------------------------------------------------------------

class Encoder(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        self.fc1  = nn.Linear(input_dim, hidden_dim)
        self.fc_mu    = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)

    def forward(self, x):
        h = F.relu(self.fc1(x))
        mu, logvar = self.fc_mu(h), self.fc_logvar(h)
        return mu, logvar


class Decoder(nn.Module):
    def __init__(self, latent_dim=20, hidden_dim=400, output_dim=784):
        super().__init__()
        self.fc1  = nn.Linear(latent_dim, hidden_dim)
        self.fc2  = nn.Linear(hidden_dim, output_dim)

    def forward(self, z):
        h = F.relu(self.fc1(z))
        return torch.sigmoid(self.fc2(h))   # Bernoulli p(x|z)


class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        self.encoder = Encoder(input_dim, hidden_dim, latent_dim)
        self.decoder = Decoder(latent_dim, hidden_dim, input_dim)

    def reparameterize(self, mu, logvar):
        """z = mu + sigma * eps,  eps ~ N(0, I)"""
        if self.training:
            std = torch.exp(0.5 * logvar)
            eps = torch.randn_like(std)   # sample from N(0,I)
            return mu + std * eps
        return mu   # use mean at test time

    def forward(self, x):
        mu, logvar = self.encoder(x)
        z = self.reparameterize(mu, logvar)
        x_recon = self.decoder(z)
        return x_recon, mu, logvar


def elbo_loss(x, x_recon, mu, logvar, beta=1.0):
    """
    ELBO = E_q[log p(x|z)]  -  beta * KL(q(z|x) || p(z))
    Reconstruction: binary cross-entropy (log p(x|z) for Bernoulli decoder)
    KL closed-form for Gaussians: KL(N(mu,sigma^2) || N(0,1))
    """
    # Reconstruction term: sum over dimensions, mean over batch
    recon_loss = F.binary_cross_entropy(x_recon, x, reduction='sum') / x.size(0)

    # KL term: 0.5 * sum(mu^2 + sigma^2 - log(sigma^2) - 1)
    kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp()) / x.size(0)

    return recon_loss + beta * kl_loss, recon_loss, kl_loss


# -----------------------------------------------------------------------
# Training loop sketch
# -----------------------------------------------------------------------

# model = VAE(input_dim=784, latent_dim=20)
# optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
#
# for epoch in range(50):
#     for x, _ in train_loader:
#         x = x.view(-1, 784)
#         optimizer.zero_grad()
#         x_recon, mu, logvar = model(x)
#         loss, recon, kl = elbo_loss(x, x_recon, mu, logvar, beta=1.0)
#         loss.backward()
#         optimizer.step()
#     print(f"Epoch {epoch}: ELBO={-loss.item():.2f}, Recon={recon.item():.2f}, KL={kl.item():.2f}")

# -----------------------------------------------------------------------
# KL divergence between two Gaussians (closed-form verification)
# -----------------------------------------------------------------------

def kl_gaussian(mu, sigma):
    """KL( N(mu, sigma^2) || N(0,1) ) = (mu^2 + sigma^2 - log(sigma^2) - 1) / 2"""
    return 0.5 * (mu**2 + sigma**2 - torch.log(sigma**2) - 1)

mu_test    = torch.tensor([1.0])
sigma_test = torch.tensor([0.5])
print(f"KL(N(1, 0.25) || N(0,1)) = {kl_gaussian(mu_test, sigma_test).item():.4f}")
# Should be: 0.5*(1 + 0.25 - log(0.25) - 1) = 0.5*(1.25 + 1.386) = 1.318
`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Kingma, D. P. & Welling, M.',
    year: 2013,
    title: 'Auto-Encoding Variational Bayes',
    venue: 'ICLR 2014',
    url: 'https://arxiv.org/abs/1312.6114',
    type: 'foundational',
    whyImportant: 'Introduced the Variational Autoencoder (VAE) and the reparameterization trick, enabling end-to-end training of deep generative models via ELBO maximization.',
  },
  {
    authors: 'Rezende, D. J., Mohamed, S., & Wierstra, D.',
    year: 2014,
    title: 'Stochastic Backpropagation and Approximate Inference in Deep Generative Models',
    venue: 'ICML 2014',
    url: 'https://arxiv.org/abs/1401.4082',
    type: 'foundational',
    whyImportant: 'Concurrent work to Kingma & Welling introducing the same reparameterization idea from a different perspective, with applications to deep Sigmoid Belief Networks.',
  },
  {
    authors: 'Higgins, I., Matthey, L., Pal, A., Burgess, C., Glorot, X., Botvinick, M., Mohamed, S., & Lerchner, A.',
    year: 2017,
    title: 'beta-VAE: Learning Basic Visual Concepts with a Constrained Variational Framework',
    venue: 'ICLR 2017',
    url: 'https://openreview.net/forum?id=Sy2fchgP-',
    type: 'foundational',
    whyImportant: 'Introduced β-VAE, showing that increasing the KL weight β > 1 encourages disentangled latent representations, linking VAEs to interpretable generative models.',
  },
  {
    authors: 'Jordan, M. I., Ghahramani, Z., Jaakkola, T. S., & Saul, L. K.',
    year: 1999,
    title: 'An Introduction to Variational Methods for Graphical Models',
    venue: 'Machine Learning, 37(2), 183–233',
    url: 'https://link.springer.com/article/10.1023/A:1007665907178',
    type: 'survey',
    whyImportant: 'Classic survey introducing variational inference and the ELBO as a general technique for approximate Bayesian inference in graphical models.',
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ELBOSection() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Evidence Lower Bound (ELBO)
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The variational objective at the heart of VAEs and variational inference — a
          tractable lower bound on the log-likelihood of observed data.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          Variational inference has roots in physics (mean-field theory) and was formalized
          for probabilistic graphical models by <strong>Jordan et al. (1999)</strong>.
          The key insight — maximizing a lower bound (ELBO) instead of the intractable
          marginal likelihood — was already known in statistical physics as the
          <em> variational free energy</em>.
        </p>
        <p className="mt-2">
          <strong>Kingma & Welling (2013)</strong> and <strong>Rezende et al. (2014)</strong>
          independently introduced the <em>reparameterization trick</em>, making ELBO
          maximization scalable with SGD and enabling the Variational Autoencoder.
          VAEs became the first practical deep generative model and remain influential
          in representation learning, image synthesis, and molecular design.
        </p>
      </NoteBlock>

      {/* Generative model definition */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Latent Variable Generative Model"
        definition="A generative model posits a joint distribution $p_\theta(x, z) = p_\theta(x|z)\, p(z)$ over observed data $x$ and latent variables $z$. The marginal (evidence) is $p_\theta(x) = \int p_\theta(x|z)\, p(z)\, dz$. The latent variable $z$ is intended to capture underlying structure: style, shape, content. In a VAE, $p(z) = \mathcal{N}(0, I)$ and $p_\theta(x|z)$ is a neural network decoder."
        notation="$\theta$ are the generative (decoder) parameters. $\phi$ will denote variational (encoder) parameters. Maximizing $\log p_\theta(x)$ over $\theta$ is maximum likelihood estimation, but the integral over $z$ is generally intractable."
      />

      {/* ELBO Definition */}
      <DefinitionBlock
        label="Definition 1.2"
        title="Evidence Lower Bound (ELBO)"
        definition="Given an approximate posterior $q_\phi(z|x)$ (the encoder), the ELBO is: $\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{q_\phi(z|x)}[\log p_\theta(x|z)] - \mathrm{KL}(q_\phi(z|x) \,\|\, p(z))$. The first term is the reconstruction term (expected log-likelihood of data given latent code). The second term is the KL regularizer penalizing the approximate posterior for deviating from the prior."
        notation="The ELBO is a function of both decoder parameters $\theta$ and encoder parameters $\phi$. Maximizing the ELBO w.r.t. $\theta$ improves the generative model; w.r.t. $\phi$ improves the approximate posterior."
      />

      {/* ELBO is a lower bound */}
      <TheoremBlock
        label="Theorem 1.1"
        title="ELBO is a Lower Bound on Log-Evidence"
        statement="For any distribution $q_\phi(z|x)$, we have $\log p_\theta(x) \geq \mathcal{L}(\theta, \phi; x)$ with equality iff $q_\phi(z|x) = p_\theta(z|x)$ (the true posterior). The gap is exactly the KL divergence from the approximate to the true posterior: $\log p_\theta(x) = \mathcal{L}(\theta, \phi; x) + \mathrm{KL}(q_\phi(z|x) \,\|\, p_\theta(z|x))$."
        proof="Start with the definition of KL divergence (which is non-negative): $\mathrm{KL}(q_\phi(z|x) \| p_\theta(z|x)) = \mathbb{E}_{q_\phi}\!\left[\log \frac{q_\phi(z|x)}{p_\theta(z|x)}\right] \geq 0$. Expanding $p_\theta(z|x) = p_\theta(x|z)p(z)/p_\theta(x)$: $\mathbb{E}_{q_\phi}\!\left[\log q_\phi(z|x) - \log p_\theta(x|z) - \log p(z) + \log p_\theta(x)\right] \geq 0$. Rearranging: $\log p_\theta(x) \geq \mathbb{E}_{q_\phi}[\log p_\theta(x|z)] - \mathbb{E}_{q_\phi}\!\left[\log \frac{q_\phi(z|x)}{p(z)}\right] = \mathcal{L}(\theta,\phi;x)$. Equality holds iff the KL is zero, i.e., $q_\phi(z|x) = p_\theta(z|x)$. $\square$"
        corollaries={[
          "Maximizing the ELBO simultaneously pushes $\\log p_\\theta(x)$ upward (improves the model) and minimizes $\\mathrm{KL}(q_\\phi \\| p_\\theta)$ (improves the approximation).",
          "Jensen's inequality provides an alternative proof: $\\log p(x) = \\log \\mathbb{E}_{p(z)}[p(x|z)] \\geq \\mathbb{E}_{q}\\!\\left[\\log \\frac{p(x|z)p(z)}{q(z|x)}\\right] = \\mathcal{L}$ by Jensen applied to concave $\\log$.",
          "The tighter the variational family (richer $q_\\phi$), the smaller the gap — normalizing flows address this by using expressive approximate posteriors.",
        ]}
      />

      {/* KL between Gaussians */}
      <TheoremBlock
        label="Theorem 1.2"
        title="KL Divergence Between Diagonal Gaussians"
        statement="For $q = \mathcal{N}(\mu, \sigma^2 I)$ and $p = \mathcal{N}(0, I)$ in $d$ dimensions: $\mathrm{KL}(q \,\|\, p) = \frac{1}{2}\sum_{j=1}^{d}\!\left(\mu_j^2 + \sigma_j^2 - \log \sigma_j^2 - 1\right)$. For 1D: $\mathrm{KL}(\mathcal{N}(\mu,\sigma^2) \,\|\, \mathcal{N}(0,1)) = \frac{1}{2}(\mu^2 + \sigma^2 - \ln \sigma^2 - 1)$."
        proof="Using the formula $\mathrm{KL}(q\|p) = \int q(z)\log(q(z)/p(z))dz$. For 1D Gaussians: $= \int \mathcal{N}(z;\mu,\sigma^2)\left[\frac{(z-\mu)^2}{2\sigma^2} - \frac{z^2}{2} - \log\sigma + \frac{1}{2}\log(2\pi) - \frac{1}{2}\log(2\pi)\right]dz$. Using $\mathbb{E}_q[(z-\mu)^2] = \sigma^2$, $\mathbb{E}_q[z^2] = \mu^2 + \sigma^2$: $= \frac{\sigma^2}{2\sigma^2} - \frac{\mu^2 + \sigma^2}{2} - \log\sigma = \frac{1}{2}(1 - \mu^2 - \sigma^2 + \log\sigma^2) \cdot (-1) = \frac{1}{2}(\mu^2 + \sigma^2 - \log\sigma^2 - 1)$. $\square$"
        corollaries={[
          "This closed-form KL makes VAE training efficient — no Monte Carlo estimate needed for the regularization term.",
          "KL = 0 iff $\\mu = 0$ and $\\sigma = 1$, i.e., the approximate posterior equals the prior. The VAE encoder is trained to make the posterior close to a standard Gaussian.",
          "In practice, the encoder outputs $\\mu$ and $\\log \\sigma^2$ (log-variance) for numerical stability, since $\\sigma^2 > 0$ is automatically ensured by $e^{\\log\\sigma^2}$.",
        ]}
      />

      {/* Reparameterization */}
      <DefinitionBlock
        label="Definition 1.3"
        title="Reparameterization Trick"
        definition="To compute $\nabla_\phi\, \mathbb{E}_{q_\phi(z|x)}[f(z)]$, we cannot differentiate through the stochastic sampling $z \sim q_\phi$. The reparameterization trick rewrites the sample as $z = \mu_\phi(x) + \sigma_\phi(x) \cdot \varepsilon$ where $\varepsilon \sim \mathcal{N}(0, I)$ is an auxiliary noise variable independent of $\phi$. Then $\nabla_\phi\, \mathbb{E}_\varepsilon[f(\mu + \sigma\varepsilon)] = \mathbb{E}_\varepsilon[\nabla_\phi f(\mu + \sigma\varepsilon)]$ — gradients flow through $\mu_\phi$ and $\sigma_\phi$."
        notation="Without reparameterization, the gradient estimator (REINFORCE / score function) has high variance. Reparameterization provides a low-variance pathwise gradient estimator, enabling stable training with standard backpropagation."
      />

      {/* Interactive Visualizer */}
      <ELBOVisualizer />

      {/* Example */}
      <ExampleBlock
        title="Gaussian VAE ELBO — Explicit Derivation"
        problem="For a VAE with Gaussian encoder $q_\phi(z|x) = \mathcal{N}(\mu_\phi(x), \sigma_\phi^2(x)I)$, Gaussian prior $p(z) = \mathcal{N}(0,I)$, and Gaussian decoder $p_\theta(x|z) = \mathcal{N}(f_\theta(z), I)$, write out the ELBO explicitly."
        difficulty="intermediate"
        solution={[
          {
            step: 'Write ELBO as Reconstruction − KL',
            formula: '\\mathcal{L} = \\mathbb{E}_{q_\\phi(z|x)}[\\log p_\\theta(x|z)] - \\mathrm{KL}(q_\\phi(z|x) \\| p(z))',
            explanation: 'Starting from the definition of ELBO.',
          },
          {
            step: 'Expand the reconstruction term for Gaussian $p_\\theta(x|z) = \\mathcal{N}(f_\\theta(z), I)$',
            formula: '\\mathbb{E}_q[\\log p_\\theta(x|z)] = \\mathbb{E}_q\\!\\left[-\\frac{1}{2}\\|x - f_\\theta(z)\\|^2 - \\frac{d}{2}\\log(2\\pi)\\right]',
            explanation: 'The log of a Gaussian. The constant term is dropped during optimization. This becomes the mean squared error loss.',
          },
          {
            step: 'Apply reparameterization: $z = \\mu_\\phi + \\sigma_\\phi \\odot \\varepsilon$',
            formula: '\\mathbb{E}_q[\\|x - f_\\theta(z)\\|^2] \\approx \\frac{1}{L}\\sum_{l=1}^L \\|x - f_\\theta(\\mu_\\phi + \\sigma_\\phi \\odot \\varepsilon^{(l)})\\|^2',
            explanation: 'Monte Carlo estimate (usually $L=1$ in practice) with $\\varepsilon^{(l)} \\sim \\mathcal{N}(0,I)$.',
          },
          {
            step: 'KL term is analytic (Theorem 1.2)',
            formula: '\\mathrm{KL}(q \\| p) = \\frac{1}{2}\\sum_{j=1}^{d_z}(\\mu_{\\phi,j}^2 + \\sigma_{\\phi,j}^2 - \\log\\sigma_{\\phi,j}^2 - 1)',
            explanation: 'No Monte Carlo needed here — exact closed-form gradient.',
          },
          {
            step: 'Final ELBO loss (negated for minimization)',
            formula: '\\mathcal{L}_{\\mathrm{VAE}} = \\frac{1}{L}\\sum_l \\|x - f_\\theta(z^{(l)})\\|^2 + \\frac{1}{2}\\sum_j(\\mu_j^2 + \\sigma_j^2 - \\log\\sigma_j^2 - 1)',
            explanation: 'MSE reconstruction + KL regularization. Minimizing this is equivalent to maximizing the ELBO.',
          },
        ]}
      />

      {/* Warning */}
      <WarningBlock title="Posterior Collapse and KL Vanishing">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>Posterior collapse:</strong> In VAEs with powerful autoregressive
              decoders (e.g., PixelCNN), the decoder can learn to ignore the latent code
              entirely. The encoder then collapses to the prior (<InlineMath math="q(z|x) \to p(z)" />),
              and KL → 0. The model degenerates to a pure autoregressive model — no generative
              structure is learned. Mitigation: KL annealing (slowly ramp up KL weight),
              or use a weaker decoder.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>KL vanishing in text VAEs:</strong> Training a VAE on text sequences
              often leads to KL collapsing to zero because the LSTM decoder is too powerful.
              Free bits (ensure each latent dimension contributes at least <InlineMath math="\lambda" /> nats)
              and β-VAE annealing schedules are common fixes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>VAEs produce blurry samples:</strong> The Gaussian decoder with MSE
              reconstruction loss acts like maximum likelihood under a Gaussian — it averages
              over possible reconstructions. This causes blurry images. GANs and diffusion
              models address this with adversarial or score-matching objectives.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* Python Code */}
      <PythonCode
        code={VAE_CODE}
        language="python"
        title="Variational Autoencoder — PyTorch Implementation"
        runnable
      />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
