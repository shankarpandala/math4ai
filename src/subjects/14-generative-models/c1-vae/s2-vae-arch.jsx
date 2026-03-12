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
// VAE Architecture Diagram with Reparameterization Step
// ---------------------------------------------------------------------------

function VAEArchDiagram() {
  const [showReparam, setShowReparam] = useState(false);
  const [latentDim, setLatentDim] = useState(4);

  const svgW = 560;
  const svgH = 260;

  // Box positions
  const inputBox   = { x: 20,  y: 80, w: 80, h: 100, color: '#3b82f6', label: 'Input x' };
  const encoderBox = { x: 130, y: 60, w: 90, h: 140, color: '#8b5cf6', label: 'Encoder' };
  const latentBox  = { x: 250, y: 50, w: 80, h: 70,  color: '#ec4899', label: 'μ, σ' };
  const sampleBox  = { x: 250, y: 140, w: 80, h: 50, color: '#f59e0b', label: 'z = μ+σε' };
  const decoderBox = { x: 360, y: 60, w: 90, h: 140, color: '#10b981', label: 'Decoder' };
  const outputBox  = { x: 480, y: 80, w: 60, h: 100, color: '#3b82f6', label: 'x̂' };

  function Box({ b }) {
    return (
      <g>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8}
          fill={b.color} fillOpacity={0.15} stroke={b.color} strokeWidth={2} />
        <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5}
          textAnchor="middle" fontSize={11} fontWeight="bold" fill={b.color}>
          {b.label}
        </text>
      </g>
    );
  }

  function Arrow({ x1, y1, x2, y2, color = '#6b7280', dashed = false }) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2 - ux * 6} y2={y2 - uy * 6}
          stroke={color} strokeWidth={1.8}
          strokeDasharray={dashed ? '5,3' : 'none'} />
        <polygon
          points={`${x2},${y2} ${x2 - ux * 8 - uy * 4},${y2 - uy * 8 + ux * 4} ${x2 - ux * 8 + uy * 4},${y2 - uy * 8 - ux * 4}`}
          fill={color}
        />
      </g>
    );
  }

  // Latent dimension dots
  const latentDots = Array.from({ length: Math.min(latentDim, 8) }, (_, i) => ({
    cx: 290,
    cy: 55 + i * (55 / Math.min(latentDim, 8)),
  }));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        VAE Architecture — Encoder → Latent → Decoder
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Toggle the reparameterization step to see how gradients flow through the stochastic node.
        <InlineMath math="\varepsilon \sim \mathcal{N}(0,I)" /> is the auxiliary noise.
      </p>

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setShowReparam((v) => !v)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
            showReparam
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {showReparam ? 'Hide ε node' : 'Show ε node'}
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Latent dim:
          </label>
          <input type="range" min={2} max={16} step={1} value={latentDim}
            onChange={(e) => setLatentDim(parseInt(e.target.value))}
            className="w-24 accent-pink-500" />
          <span className="font-mono text-sm font-bold text-pink-600 dark:text-pink-400">
            {latentDim}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH} className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Main boxes */}
          <Box b={inputBox} />
          <Box b={encoderBox} />
          <Box b={latentBox} />
          {showReparam && (
            <>
              <Box b={sampleBox} />
              {/* ε node */}
              <circle cx={290} cy={210} r={22} fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2} />
              <text x={290} y={215} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#f59e0b">ε∼N(0,I)</text>
              <Arrow x1={290} y1={188} x2={290} y2={165} color="#f59e0b" dashed />
            </>
          )}
          <Box b={decoderBox} />
          <Box b={outputBox} />

          {/* Arrows */}
          <Arrow x1={100} y1={130} x2={130} y2={130} color="#6b7280" />
          <Arrow x1={220} y1={100} x2={250} y2={85} color="#8b5cf6" />
          <Arrow x1={220} y1={150} x2={250} y2={165} color="#8b5cf6" />

          {showReparam ? (
            <>
              <Arrow x1={290} y1={120} x2={290} y2={140} color="#ec4899" />
              <Arrow x1={330} y1={165} x2={360} y2={130} color="#f59e0b" />
            </>
          ) : (
            <Arrow x1={330} y1={85} x2={360} y2={100} color="#ec4899" />
          )}

          <Arrow x1={450} y1={130} x2={480} y2={130} color="#10b981" />

          {/* Labels on arrows */}
          <text x={113} y={124} fontSize={9} fill="#9ca3af">q(z|x)</text>
          <text x={455} y={124} fontSize={9} fill="#9ca3af">p(x|z)</text>

          {/* Latent dim dots */}
          {latentDots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={3} fill="#ec4899" opacity={0.7} />
          ))}
          <text x={290} y={svgH - 8} textAnchor="middle" fontSize={9} fill="#9ca3af">
            {latentDim}-dim latent space z
          </text>

          {/* Title labels */}
          <text x={170} y={52} textAnchor="middle" fontSize={9} fill="#8b5cf6">φ params</text>
          <text x={405} y={52} textAnchor="middle" fontSize={9} fill="#10b981">θ params</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
          <p className="font-semibold text-purple-700 dark:text-purple-300">Encoder q_φ(z|x)</p>
          <p className="text-purple-500">outputs μ and log σ²</p>
        </div>
        <div className="rounded-lg bg-pink-50 p-2 dark:bg-pink-900/20">
          <p className="font-semibold text-pink-700 dark:text-pink-300">Latent z</p>
          <p className="text-pink-500">{latentDim}-dimensional</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
          <p className="font-semibold text-emerald-700 dark:text-emerald-300">Decoder p_θ(x|z)</p>
          <p className="text-emerald-500">reconstructs input</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const VAE_ARCH_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class VAEEncoder(nn.Module):
    """Encoder: x -> (mu, log_var) parameterizing q(z|x)."""
    def __init__(self, input_dim=784, hidden_dim=512, latent_dim=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
        )
        self.fc_mu     = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)

    def forward(self, x):
        h = self.net(x.view(x.size(0), -1))
        mu     = self.fc_mu(h)
        logvar = self.fc_logvar(h)   # log sigma^2 for numerical stability
        return mu, logvar

class VAEDecoder(nn.Module):
    """Decoder: z -> p(x|z), Bernoulli for binary data."""
    def __init__(self, latent_dim=32, hidden_dim=512, output_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(latent_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_dim),
            nn.Sigmoid(),
        )

    def forward(self, z):
        return self.net(z)

def reparameterize(mu, logvar):
    """
    Reparameterization trick: z = mu + sigma * epsilon
    epsilon ~ N(0, I)  -- independent of phi, so gradients flow through mu, sigma
    """
    std = torch.exp(0.5 * logvar)    # sigma = exp(logvar/2)
    eps = torch.randn_like(std)      # sample auxiliary noise
    return mu + std * eps            # z is differentiable w.r.t. mu, logvar

class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=512, latent_dim=32):
        super().__init__()
        self.encoder = VAEEncoder(input_dim, hidden_dim, latent_dim)
        self.decoder = VAEDecoder(latent_dim, hidden_dim, input_dim)

    def forward(self, x):
        mu, logvar = self.encoder(x)
        z = reparameterize(mu, logvar)
        x_recon = self.decoder(z)
        return x_recon, mu, logvar

    @torch.no_grad()
    def sample(self, n, device='cpu'):
        """Generate n samples: z ~ N(0,I), decode."""
        z = torch.randn(n, self.encoder.fc_mu.out_features, device=device)
        return self.decoder(z)

    @torch.no_grad()
    def encode(self, x):
        """Get the posterior mean (no sampling) for visualization."""
        mu, _ = self.encoder(x)
        return mu  # deterministic, use mean as latent code
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function VAEArch() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          VAE Architecture
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The encoder-decoder structure of Variational Autoencoders, the reparameterization
          trick enabling backpropagation through stochastic nodes, and the geometry of the
          learned latent space.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          VAEs were introduced by <strong>Kingma & Welling (2013)</strong> and simultaneously
          by <strong>Rezende et al. (2014)</strong>. The key innovation was the{' '}
          <em>reparameterization trick</em>: instead of sampling <InlineMath math="z \sim q_\phi(z|x)" />
          directly (blocking gradients), write <InlineMath math="z = \mu_\phi + \sigma_\phi \cdot \varepsilon" />
          with <InlineMath math="\varepsilon \sim \mathcal{N}(0,I)" />, making <InlineMath math="z" />
          a deterministic function of <InlineMath math="\phi" /> and enabling standard backprop.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 2.1"
        title="VAE Encoder — Amortized Inference Network"
        definition="The encoder $q_\phi(z|x)$ is a neural network mapping each input $x$ to parameters of an approximate posterior: $q_\phi(z|x) = \mathcal{N}(z;\, \mu_\phi(x),\, \mathrm{diag}(\sigma_\phi^2(x)))$. The network outputs both $\mu_\phi(x) \in \mathbb{R}^d$ and $\log\sigma_\phi^2(x) \in \mathbb{R}^d$ (log-variance for numerical stability). Amortization means we share inference parameters $\phi$ across all data points rather than optimizing per-example variational parameters."
        notation="$d$ is the latent dimension. The diagonal covariance assumption (mean-field) is the main approximation — it ignores posterior correlations between latent dimensions. Richer posteriors (normalizing flows, full covariance) improve the approximation at higher cost."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Reparameterization Trick"
        definition="To enable gradient flow through the stochastic latent sample $z \sim q_\phi(z|x)$, we reparameterize: $z = \mu_\phi(x) + \sigma_\phi(x) \odot \varepsilon$, where $\varepsilon \sim \mathcal{N}(0, I)$ is an auxiliary noise variable independent of $\phi$. This shifts the randomness from the parameters to $\varepsilon$, so $z$ is now a deterministic (differentiable) function of $\mu_\phi, \sigma_\phi$, and we can compute $\nabla_\phi \mathcal{L}$ by standard backpropagation."
        notation="$\odot$ denotes elementwise multiplication. The same trick applies to any distribution with a location-scale parameterization: Laplace, Student-t, LogNormal. For discrete latents, the Gumbel-softmax reparameterization provides a biased-but-low-variance alternative."
      />

      <DefinitionBlock
        label="Definition 2.3"
        title="VAE Decoder — Generative Network"
        definition="The decoder $p_\theta(x|z)$ is a neural network that maps a latent code $z \in \mathbb{R}^d$ to a distribution over observations. For binary data: $p_\theta(x|z) = \mathrm{Bernoulli}(\sigma(f_\theta(z)))$ where $\sigma$ is sigmoid and $f_\theta$ is the neural net. For continuous data: $p_\theta(x|z) = \mathcal{N}(f_\theta(z), I)$, recovering MSE reconstruction loss. The decoder parameters $\theta$ are learned by maximizing the ELBO jointly with $\phi$."
        notation="New samples are generated by ancestral sampling: first draw $z \sim p(z) = \mathcal{N}(0,I)$, then sample $x \sim p_\theta(x|z)$. The latent space is shared by both prior and posterior, creating a continuous, interpolable representation."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Reparameterization Gives Low-Variance Gradient Estimator"
        statement="The reparameterized gradient estimator $\hat{g}_\mathrm{reparam} = \nabla_\phi f(\mu_\phi + \sigma_\phi \odot \varepsilon)$ with $\varepsilon \sim \mathcal{N}(0,I)$ has variance $O(1)$ (bounded), whereas the score function (REINFORCE) estimator $\hat{g}_\mathrm{SF} = f(z)\nabla_\phi \log q_\phi(z|x)$ has variance $O(f(z)^2)$, which can be very large when $f$ varies significantly."
        proof="For the reparameterized estimator, $z = g(\phi, \varepsilon)$ is a deterministic transformation, so $\hat{g} = \nabla_\phi f(g(\phi,\varepsilon))$. By the chain rule, $\hat{g} = (\nabla_z f)\,(\nabla_\phi g)$. The variance is $\mathrm{Var}[\hat{g}] = \mathbb{E}[|\hat{g}|^2] - |\mathbb{E}[\hat{g}]|^2$, which is bounded when $\nabla_z f$ and $\nabla_\phi g$ are bounded — the case for typical neural networks with bounded activations. For the score function estimator, $\hat{g} = f(z)\nabla_\phi \log q_\phi(z|x)$; since $f$ can take large values and $\nabla \log q$ also varies, the product has potentially unbounded variance. Empirically, reparameterized estimates have 10–100× lower variance. $\square$"
        corollaries={[
          "Lower gradient variance means VAE training converges faster and to better solutions than REINFORCE-based approaches for continuous latents.",
          "The reparameterization trick is not limited to Gaussians — it applies to any distribution expressible as $z = g(\\phi, \\varepsilon)$ with $\\varepsilon$ from a fixed, parameter-free distribution.",
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Latent Space Interpolation Property"
        statement="If the VAE encoder maps semantically similar inputs to nearby regions in the latent space $\mathcal{Z} = \mathbb{R}^d$, then the linear interpolation $z_t = (1-t)\,z_1 + t\,z_2$ for $t \in [0,1]$ produces semantically meaningful intermediate samples when decoded through $p_\theta(x|z_t)$."
        proof="This follows from the continuity of the decoder network $f_\theta: \mathbb{R}^d \to \mathcal{X}$. Since $f_\theta$ is a composition of continuous functions (linear layers + smooth activations), it is continuous. Therefore $\|f_\theta(z_t) - f_\theta(z_s)\| \to 0$ as $|t-s| \to 0$. The KL regularization term in the ELBO encourages the encoder to spread latent codes smoothly (preventing isolated clusters), and the standard Gaussian prior gives the latent space a convex, connected geometry — any linear interpolation path stays in a high-probability region. $\square$"
        corollaries={[
          "This property distinguishes VAEs from standard autoencoders, where the latent space has no regularity constraints — interpolations pass through low-probability voids and produce nonsensical outputs.",
          "Disentangled VAEs (β-VAE) push each latent dimension to encode a single factor of variation, making axis-aligned traversals semantically meaningful.",
        ]}
      />

      <VAEArchDiagram />

      <ExampleBlock
        title="Convolutional VAE for CIFAR-10"
        problem="Design a convolutional VAE for 32×32 RGB images (CIFAR-10). Specify the encoder, latent dimension, and decoder architectures, and write the reparameterization and loss."
        difficulty="intermediate"
        solution={[
          {
            step: 'Encoder: CNN → flatten → FC to μ, log σ²',
            explanation: 'Conv layers: 3→32 (stride 2), 32→64 (stride 2), 64→128 (stride 2). After 3 strided convs, spatial size is 4×4. Flatten to 2048 → FC to 128-dim μ and 128-dim log σ². Total encoder parameters: ~2M.',
          },
          {
            step: 'Reparameterization with 128-dim latent',
            formula: 'z = \\mu_\\phi(x) + \\exp(0.5 \\cdot \\log\\sigma^2_\\phi(x)) \\odot \\varepsilon, \\quad \\varepsilon \\sim \\mathcal{N}(0,I_{128})',
            explanation: 'Single forward pass produces one sample. In practice, batch size is the Monte Carlo sample count.',
          },
          {
            step: 'Decoder: FC → reshape → deconvolution',
            explanation: 'FC: 128 → 2048, reshape to 128×4×4, then 3 transposed conv layers doubling spatial size each time back to 3×32×32. Output: sigmoid (pixel values in [0,1]).',
          },
          {
            step: 'ELBO Loss',
            formula: '\\mathcal{L} = \\underbrace{\\|x - \\hat{x}\\|_2^2}_{\\text{reconstruction}} + \\beta \\underbrace{\\tfrac{1}{2}\\sum_j(\\mu_j^2 + \\sigma_j^2 - \\log\\sigma_j^2 - 1)}_{\\text{KL}}',
            explanation: 'For continuous images, MSE reconstruction (Gaussian decoder). β=1 is standard VAE; β>1 encourages disentanglement (β-VAE). KL is analytic.',
          },
        ]}
      />

      <WarningBlock title="Blurry Reconstructions and the Gaussian Decoder Limitation">
        <p className="text-sm">
          The Gaussian decoder with MSE loss implicitly averages over the stochastic latent code,
          producing blurry outputs. This is especially problematic for high-resolution images.
          Key failure modes:
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li><strong>Mode averaging:</strong> When <InlineMath math="p_\theta(x|z)" /> is a unimodal Gaussian, the decoder outputs the mean of all plausible reconstructions — resulting in blurry, low-frequency images.</li>
          <li><strong>Posterior collapse:</strong> With strong decoders (e.g., PixelCNN), the model ignores <InlineMath math="z" /> entirely. Fix: KL annealing, free bits, or weakening the decoder.</li>
          <li><strong>Latent space holes:</strong> The aggregated posterior <InlineMath math="\int q_\phi(z|x)\,p(x)\,dx" /> may not match the Gaussian prior, creating low-density regions that generate poor samples. Fix: training with importance-weighted ELBO (IWAE).</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={VAE_ARCH_CODE}
        language="python"
        title="VAE Encoder-Decoder with Reparameterization — PyTorch"
        runnable
      />
    </div>
  );
}
