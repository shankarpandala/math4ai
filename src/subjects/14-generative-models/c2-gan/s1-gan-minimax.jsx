import React, { useState, useRef, useCallback } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// GAN Training Curve Simulator
// ---------------------------------------------------------------------------

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function GANTrainingCurve() {
  const [step, setStep] = useState(0);
  const MAX_STEPS = 60;

  // Simulate G and D loss over training steps
  // D starts high (can easily distinguish), G loss starts high
  // Ideally both converge to log(2) ≈ 0.693 at Nash equilibrium
  function dLoss(t) {
    const base = Math.log(2);
    const decay = 0.6 * Math.exp(-t / 15) * Math.sin(t * 0.4 + 1);
    return base + decay + 0.05 * Math.sin(t * 1.3);
  }
  function gLoss(t) {
    const base = Math.log(2);
    const rise = 0.5 * Math.exp(-t / 12) * Math.cos(t * 0.3);
    return base + rise + 0.06 * Math.sin(t * 0.9 + 2);
  }

  const svgW = 480;
  const svgH = 220;
  const padL = 40, padR = 12, padT = 20, padB = 35;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMin = 0.3, yMax = 1.5;

  function tx(i) { return padL + (i / (MAX_STEPS - 1)) * plotW; }
  function ty(y) { return padT + (1 - (y - yMin) / (yMax - yMin)) * plotH; }

  const dPoints = Array.from({ length: step + 1 }, (_, i) => `${tx(i).toFixed(1)},${ty(dLoss(i)).toFixed(1)}`).join(' ');
  const gPoints = Array.from({ length: step + 1 }, (_, i) => `${tx(i).toFixed(1)},${ty(gLoss(i)).toFixed(1)}`).join(' ');

  const nashY = ty(Math.log(2));

  const curD = dLoss(step).toFixed(3);
  const curG = gLoss(step).toFixed(3);
  const nashDist = Math.abs(dLoss(step) - Math.log(2)) + Math.abs(gLoss(step) - Math.log(2));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        GAN Training Dynamics — G/D Loss Over Iterations
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Step through training iterations. Both losses converge toward{' '}
        <InlineMath math="\log 2 \approx 0.693" /> at the Nash equilibrium.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setStep(0)}
          className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
          Reset
        </button>
        <button onClick={() => setStep((s) => Math.min(s + 1, MAX_STEPS - 1))}
          className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
          Step +1
        </button>
        <button onClick={() => setStep((s) => Math.min(s + 5, MAX_STEPS - 1))}
          className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
          Step +5
        </button>
        <button onClick={() => setStep(MAX_STEPS - 1)}
          className="rounded bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300">
          Run All
        </button>
        <span className="font-mono text-sm text-gray-500">Iter: {step}</span>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Nash equilibrium line */}
          <line x1={padL} y1={nashY} x2={padL + plotW} y2={nashY}
            stroke="#6b7280" strokeWidth={1} strokeDasharray="6,3" />
          <text x={padL + plotW - 2} y={nashY - 4} textAnchor="end" fontSize={9} fill="#6b7280">
            Nash log(2)≈0.693
          </text>
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {/* Y axis ticks */}
          {[0.4, 0.693, 1.0, 1.3].map((v) => (
            <g key={v}>
              <line x1={padL - 3} y1={ty(v)} x2={padL} y2={ty(v)} stroke="#9ca3af" strokeWidth={1} />
              <text x={padL - 5} y={ty(v) + 4} textAnchor="end" fontSize={8} fill="#9ca3af">{v.toFixed(2)}</text>
            </g>
          ))}
          {/* X axis label */}
          <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">Training Iterations</text>
          {/* D loss polyline */}
          {step > 0 && <polyline points={dPoints} fill="none" stroke="#ef4444" strokeWidth={2.2} />}
          {/* G loss polyline */}
          {step > 0 && <polyline points={gPoints} fill="none" stroke="#3b82f6" strokeWidth={2.2} />}
          {/* Current dots */}
          <circle cx={tx(step)} cy={ty(dLoss(step))} r={4} fill="#ef4444" />
          <circle cx={tx(step)} cy={ty(gLoss(step))} r={4} fill="#3b82f6" />
          {/* Legend */}
          <circle cx={padL + 12} cy={padT + 12} r={4} fill="#ef4444" />
          <text x={padL + 20} y={padT + 16} fontSize={10} fill="#ef4444" fontWeight="bold">D Loss</text>
          <circle cx={padL + 70} cy={padT + 12} r={4} fill="#3b82f6" />
          <text x={padL + 78} y={padT + 16} fontSize={10} fill="#3b82f6" fontWeight="bold">G Loss</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-red-50 py-2 dark:bg-red-900/20">
          <p className="text-xs text-red-400">D Loss</p>
          <p className="font-mono font-bold text-red-700 dark:text-red-300">{curD}</p>
        </div>
        <div className="rounded-lg bg-blue-50 py-2 dark:bg-blue-900/20">
          <p className="text-xs text-blue-400">G Loss</p>
          <p className="font-mono font-bold text-blue-700 dark:text-blue-300">{curG}</p>
        </div>
        <div className={`rounded-lg py-2 ${nashDist < 0.1 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
          <p className="text-xs text-gray-400">Nash dist</p>
          <p className={`font-mono font-bold ${nashDist < 0.1 ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>{nashDist.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const GAN_CODE = `import torch
import torch.nn as nn
import torch.optim as optim

class Generator(nn.Module):
    def __init__(self, z_dim=100, output_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(z_dim, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 512),   nn.LeakyReLU(0.2),
            nn.Linear(512, 1024),  nn.LeakyReLU(0.2),
            nn.Linear(1024, output_dim), nn.Tanh(),
        )
    def forward(self, z):
        return self.net(z)

class Discriminator(nn.Module):
    def __init__(self, input_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 1024), nn.LeakyReLU(0.2), nn.Dropout(0.3),
            nn.Linear(1024, 512),       nn.LeakyReLU(0.2), nn.Dropout(0.3),
            nn.Linear(512, 256),        nn.LeakyReLU(0.2), nn.Dropout(0.3),
            nn.Linear(256, 1),          nn.Sigmoid(),
        )
    def forward(self, x):
        return self.net(x.view(x.size(0), -1))

# GAN training loop (vanilla GAN, minimax objective)
def train_gan(G, D, loader, z_dim=100, n_epochs=50, device='cpu'):
    bce = nn.BCELoss()
    opt_D = optim.Adam(D.parameters(), lr=2e-4, betas=(0.5, 0.999))
    opt_G = optim.Adam(G.parameters(), lr=2e-4, betas=(0.5, 0.999))

    for epoch in range(n_epochs):
        for real_x, _ in loader:
            real_x = real_x.view(real_x.size(0), -1).to(device)
            bsz = real_x.size(0)

            # --- Discriminator step ---
            # Maximize: E[log D(x)] + E[log(1 - D(G(z)))]
            z = torch.randn(bsz, z_dim, device=device)
            fake_x = G(z).detach()  # detach to avoid G gradients

            real_loss = bce(D(real_x), torch.ones(bsz, 1, device=device))
            fake_loss = bce(D(fake_x), torch.zeros(bsz, 1, device=device))
            d_loss = (real_loss + fake_loss) / 2

            opt_D.zero_grad(); d_loss.backward(); opt_D.step()

            # --- Generator step ---
            # Minimize: E[log(1 - D(G(z)))]  <=>  Maximize: E[log D(G(z))]
            z = torch.randn(bsz, z_dim, device=device)
            g_loss = bce(D(G(z)), torch.ones(bsz, 1, device=device))

            opt_G.zero_grad(); g_loss.backward(); opt_G.step()

        print(f"Epoch {epoch}: D={d_loss.item():.4f}, G={g_loss.item():.4f}")
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function GANMinimax() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          GAN Minimax Game
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Generative Adversarial Networks frame generation as a two-player zero-sum game
          between a generator and discriminator, converging to the Jensen-Shannon divergence
          minimizer at Nash equilibrium.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          GANs were introduced by <strong>Goodfellow et al. (2014)</strong>, immediately
          drawing analogies to game theory and adversarial examples. The minimax formulation
          provided a novel training objective that bypassed the need for an explicit likelihood
          model — instead using a learned critic. Early GANs were famously unstable, motivating
          years of research into training tricks (batch normalization, label smoothing, WGAN).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="GAN Minimax Objective"
        definition="A GAN trains a generator $G_\theta: \mathcal{Z} \to \mathcal{X}$ and discriminator $D_\phi: \mathcal{X} \to [0,1]$ via the minimax game: $\min_\theta \max_\phi\, V(G,D) = \mathbb{E}_{x \sim p_\mathrm{data}}[\log D_\phi(x)] + \mathbb{E}_{z \sim p(z)}[\log(1 - D_\phi(G_\theta(z)))]$. The discriminator maximizes $V$ (distinguishing real from fake); the generator minimizes $V$ (fooling the discriminator). Alternating gradient updates approximate this saddle point."
        notation="$p(z) = \mathcal{N}(0,I)$ is the latent prior (noise). $D_\phi(x) \in [0,1]$ is the probability that $x$ is real. At optimality, $D^*(x) = p_\mathrm{data}(x) / (p_\mathrm{data}(x) + p_G(x))$ is the Bayes-optimal discriminator."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Jensen-Shannon Divergence"
        definition="The Jensen-Shannon (JS) divergence between distributions $P$ and $Q$ is: $\mathrm{JSD}(P \| Q) = \frac{1}{2}\mathrm{KL}\!\left(P \,\Big\|\, \frac{P+Q}{2}\right) + \frac{1}{2}\mathrm{KL}\!\left(Q \,\Big\|\, \frac{P+Q}{2}\right)$. Unlike KL divergence, JSD is symmetric and bounded: $0 \leq \mathrm{JSD}(P\|Q) \leq \log 2$. It achieves its maximum $\log 2$ when $P$ and $Q$ have disjoint support."
        notation="$\sqrt{\mathrm{JSD}}$ is a metric (satisfies triangle inequality). JSD = 0 iff $P = Q$ a.e. The connection to GANs: the GAN minimax objective equals $-\log 4 + 2\,\mathrm{JSD}(p_\mathrm{data} \| p_G)$ at the optimal discriminator."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Nash Equilibrium in GANs"
        definition="A Nash equilibrium is a pair $(G^*, D^*)$ such that neither player can improve their payoff by unilaterally deviating: $V(G^*, D^*) \leq V(G^*, D)$ for all $D$, and $V(G^*, D^*) \geq V(G, D^*)$ for all $G$. For the GAN game, the unique Nash equilibrium is $p_G = p_\mathrm{data}$ (generator matches the data distribution) and $D^*(x) = 1/2$ everywhere (discriminator cannot distinguish real from fake)."
        notation="Reaching Nash equilibrium in practice requires the generator to have sufficient capacity to model $p_\mathrm{data}$ and the training dynamics to converge — both non-trivial conditions. In practice, GANs exhibit oscillatory behavior and mode collapse instead of clean Nash convergence."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Global Optimum of GAN Minimizes JSD"
        statement="For fixed $G$, the optimal discriminator is $D^*(x) = \frac{p_\mathrm{data}(x)}{p_\mathrm{data}(x) + p_G(x)}$. Under this optimal discriminator, the generator's minimax objective becomes $C(G) = -\log 4 + 2\,\mathrm{JSD}(p_\mathrm{data} \| p_G)$, minimized uniquely at $p_G = p_\mathrm{data}$, where $C(G) = -\log 4$."
        proof="Fix $G$ and maximize $V(G,D) = \int p_\mathrm{data}(x)\log D(x)\,dx + \int p_G(x)\log(1-D(x))\,dx$ pointwise in $x$. For any $a, b > 0$, $\max_{y \in [0,1]} a\log y + b\log(1-y)$ is achieved at $y^* = a/(a+b)$ (setting derivative to zero). Thus $D^*(x) = p_\mathrm{data}(x)/(p_\mathrm{data}(x)+p_G(x))$. Substituting back: $V(G,D^*) = \int p_d \log\frac{p_d}{(p_d+p_G)/2}\,dx + \int p_G\log\frac{p_G}{(p_d+p_G)/2}\,dx - \log 4 = 2\,\mathrm{JSD}(p_d\|p_G) - \log 4$. Since $\mathrm{JSD} \geq 0$ with equality iff $p_d = p_G$, the minimum is $-\log 4$ at $p_G = p_\mathrm{data}$. $\square$"
        corollaries={[
          "At the global optimum, $V(G^*, D^*) = -\\log 4 \\approx -1.386$, not zero. This is consistent with the discriminator outputting 0.5 everywhere.",
          "Vanilla GAN minimizes JSD. When $p_G$ and $p_\\mathrm{data}$ have disjoint support (common early in training), $\\mathrm{JSD} = \\log 2$ (maximum) and gradients for $G$ vanish — the mode collapse and vanishing gradient problem.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Non-Saturating Generator Loss"
        statement="Instead of minimizing $\mathbb{E}[\log(1-D(G(z)))]$ (which saturates early), the generator can maximize $\mathbb{E}[\log D(G(z))]$ (non-saturating heuristic). Both objectives have the same fixed points but the non-saturating version provides stronger gradients when $D(G(z)) \approx 0$."
        proof="For the saturating loss, $\frac{\partial}{\partial \theta}\mathbb{E}[\log(1-D(G_\theta(z)))] = \mathbb{E}\left[\frac{-1}{1-D}\nabla_\theta D(G_\theta(z))\right]$. When $D(G(z)) \approx 0$ (discriminator is confident), $\frac{-1}{1-D} \approx -1$, giving bounded gradients. But when $D(G(z)) \approx 0$, the loss is near its maximum ($\log 1 = 0$) and provides little signal. For the non-saturating loss: $\frac{\partial}{\partial\theta}\mathbb{E}[-\log D(G_\theta(z))] = \mathbb{E}\left[\frac{-1}{D}\nabla_\theta D(G_\theta(z))\right]$. When $D \approx 0$, $-1/D$ is large, giving strong gradients. $\square$"
        corollaries={[
          "Goodfellow et al. (2014) already recommended the non-saturating heuristic in the original paper.",
          "The non-saturating loss does not minimize JSD — it minimizes a different (asymmetric) divergence. This can cause instability and mode-seeking behavior.",
        ]}
      />

      <GANTrainingCurve />

      <ExampleBlock
        title="GAN Minimax — Two-Gaussian Toy Example"
        problem="Data distribution is $p_\mathrm{data} = \mathcal{N}(2, 0.5^2)$. Generator outputs $G(z) = z \cdot \sigma + \mu$ with $z \sim \mathcal{N}(0,1)$. What is the optimal discriminator, and what is the Nash equilibrium?"
        difficulty="intermediate"
        solution={[
          {
            step: 'Optimal discriminator at current G',
            formula: 'D^*(x) = \\frac{p_\\mathrm{data}(x)}{p_\\mathrm{data}(x) + p_G(x)} = \\frac{\\mathcal{N}(x;2,0.25)}{\\mathcal{N}(x;2,0.25) + \\mathcal{N}(x;\\mu,\\sigma^2)}',
            explanation: 'At initialization (μ=0, σ=1), D* assigns high probability to regions near x=2 being real and near x=0 being fake.',
          },
          {
            step: 'Generator gradient at Nash equilibrium',
            formula: '\\nabla_\\mu V = \\mathbb{E}_{z}\\left[\\frac{\\partial \\log(1-D^*(G(z)))}{\\partial \\mu}\\right]',
            explanation: 'The generator adjusts μ to match p_data. At Nash: μ→2, σ→0.5, making p_G = p_data and D*→1/2 everywhere.',
          },
          {
            step: 'Nash equilibrium value',
            formula: 'V(G^*, D^*) = -\\log 4 \\approx -1.386',
            explanation: 'At equilibrium, D*=1/2 everywhere, so log(1/2) + log(1/2) = -log(4). Both discriminator outputs agree.',
          },
        ]}
      />

      <WarningBlock title="GAN Training Instabilities: Mode Collapse and Oscillation">
        <ul className="space-y-2 text-sm">
          <li><strong>Mode collapse:</strong> The generator learns to produce a limited variety of outputs (often a single mode of the data distribution) that fool the discriminator. The discriminator then adapts, but the generator may just switch modes — a cycle with no convergence.</li>
          <li><strong>Vanishing discriminator gradients:</strong> When D is too strong (D(G(z)) ≈ 0 always), the generator loss saturates and gradients vanish. Fix: non-saturating loss, Wasserstein loss (WGAN), or gradient penalty.</li>
          <li><strong>Training hyperparameter sensitivity:</strong> GAN training is sensitive to the balance between G and D update frequencies, learning rates, and batch normalization choices. The Adam optimizer with β₁=0.5 (not the default 0.9) is often recommended.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={GAN_CODE}
        language="python"
        title="Vanilla GAN — PyTorch Training Loop"
        runnable
      />
    </div>
  );
}
