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
// Lipschitz Constraint Visualizer
// ---------------------------------------------------------------------------

function LipschitzVisualizer() {
  const [lambda, setLambda] = useState(10);
  const [gradNorm, setGradNorm] = useState(1.5);

  // Penalty term = lambda * (grad_norm - 1)^2
  const penalty = lambda * Math.pow(Math.max(gradNorm - 1, 0), 2);
  const isValid = gradNorm <= 1.05;

  const svgW = 480;
  const svgH = 180;
  const padL = 45, padR = 12, padT = 15, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  // Plot penalty vs gradient norm (fixed lambda)
  const gnMin = 0, gnMax = 3;
  const penMax = lambda * 4; // at gnorm=3, penalty = lambda*(3-1)^2 = 4*lambda
  const clampedPenMax = Math.min(penMax, lambda * 4.5);

  function tx(g) { return padL + ((g - gnMin) / (gnMax - gnMin)) * plotW; }
  function ty(p) { return padT + (1 - Math.min(p, clampedPenMax) / clampedPenMax) * plotH; }

  const N = 120;
  const penaltyLine = Array.from({ length: N }, (_, i) => {
    const g = gnMin + (i / (N - 1)) * (gnMax - gnMin);
    const p = lambda * Math.pow(Math.max(g - 1, 0), 2);
    return `${tx(g).toFixed(1)},${ty(p).toFixed(1)}`;
  }).join(' ');

  const curX = tx(gradNorm);
  const curY = ty(penalty);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Lipschitz Constraint — Gradient Penalty Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        WGAN-GP adds a penalty <InlineMath math="\lambda\,(\|\nabla_{\hat{x}} D(\hat{x})\|_2 - 1)^2" /> to
        enforce the 1-Lipschitz constraint. Adjust <InlineMath math="\lambda" /> and the current
        gradient norm to see the penalty.
      </p>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-36 text-sm font-medium text-gray-700 dark:text-gray-300">
            Penalty <InlineMath math="\lambda" />
          </label>
          <input type="range" min={1} max={50} step={1} value={lambda}
            onChange={(e) => setLambda(parseInt(e.target.value))}
            className="h-2 flex-1 accent-purple-500" />
          <span className="w-10 text-right font-mono text-sm font-bold text-purple-600 dark:text-purple-400">{lambda}</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-36 text-sm font-medium text-gray-700 dark:text-gray-300">
            Grad norm <InlineMath math="\|\nabla D\|" />
          </label>
          <input type="range" min={0} max={3} step={0.05} value={gradNorm}
            onChange={(e) => setGradNorm(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-rose-500" />
          <span className="w-10 text-right font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{gradNorm.toFixed(2)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Target region: grad norm = 1 */}
          <rect x={tx(0.9)} y={padT} width={tx(1.1) - tx(0.9)} height={plotH}
            fill="#22c55e" fillOpacity={0.1} />
          <line x1={tx(1)} y1={padT} x2={tx(1)} y2={padT + plotH}
            stroke="#22c55e" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={tx(1)} y={padT - 3} textAnchor="middle" fontSize={9} fill="#22c55e">1-Lipschitz target</text>
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {/* X ticks */}
          {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((v) => (
            <g key={v}>
              <line x1={tx(v)} y1={padT + plotH} x2={tx(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={tx(v)} y={padT + plotH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">{v}</text>
            </g>
          ))}
          <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fontSize={9} fill="#9ca3af">‖∇D‖₂</text>
          {/* Penalty curve */}
          <polyline points={penaltyLine} fill="none" stroke="#8b5cf6" strokeWidth={2.2} />
          {/* Current point */}
          <circle cx={curX} cy={Math.min(curY, padT + plotH)} r={5} fill="#ef4444" />
          <line x1={curX} y1={padT} x2={curX} y2={padT + plotH}
            stroke="#ef4444" strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
          {/* Y label */}
          <text x={padL - 6} y={padT + plotH / 2}
            textAnchor="middle" fontSize={9} fill="#9ca3af"
            transform={`rotate(-90, ${padL - 18}, ${padT + plotH / 2})`}>
            Penalty
          </text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div className={`rounded-lg py-2 ${isValid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className="text-xs text-gray-400">Lipschitz?</p>
          <p className={`font-bold ${isValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {isValid ? 'Satisfied' : 'Violated'}
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 py-2 dark:bg-purple-900/20">
          <p className="text-xs text-gray-400">Penalty λ(‖∇D‖-1)²</p>
          <p className="font-mono font-bold text-purple-700 dark:text-purple-300">{penalty.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 py-2 dark:bg-gray-800">
          <p className="text-xs text-gray-400">λ × (‖∇D‖-1)²</p>
          <p className="font-mono font-bold text-gray-700 dark:text-gray-300">
            {lambda} × {(Math.max(gradNorm - 1, 0)).toFixed(2)}² = {penalty.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const WGAN_CODE = `import torch
import torch.nn as nn
import torch.autograd as autograd

def gradient_penalty(critic, real, fake, device='cpu'):
    """
    WGAN-GP gradient penalty.
    Enforces 1-Lipschitz constraint on the critic via:
      GP = E[ (||grad_x' D(x')|| - 1)^2 ]
    where x' = alpha*real + (1-alpha)*fake, alpha ~ Uniform[0,1]
    """
    bsz = real.size(0)
    alpha = torch.rand(bsz, 1, device=device).expand_as(real)
    x_hat = (alpha * real + (1 - alpha) * fake).requires_grad_(True)

    d_hat = critic(x_hat)
    grads = autograd.grad(
        outputs=d_hat, inputs=x_hat,
        grad_outputs=torch.ones_like(d_hat),
        create_graph=True, retain_graph=True
    )[0]
    grad_norm = grads.view(bsz, -1).norm(2, dim=1)
    return ((grad_norm - 1) ** 2).mean()


def train_wgan_gp(critic, generator, loader, z_dim=128,
                  n_critic=5, lam=10, n_epochs=50, device='cpu'):
    """
    WGAN-GP training:
    - Train critic n_critic steps per generator step
    - Critic loss: E[D(fake)] - E[D(real)] + lambda * GP
    - Generator loss: -E[D(G(z))]  (maximize critic score)
    """
    opt_C = torch.optim.Adam(critic.parameters(),  lr=1e-4, betas=(0, 0.9))
    opt_G = torch.optim.Adam(generator.parameters(), lr=1e-4, betas=(0, 0.9))

    for epoch in range(n_epochs):
        for i, (real, _) in enumerate(loader):
            real = real.to(device)
            bsz  = real.size(0)

            # === Critic update (n_critic times) ===
            for _ in range(n_critic):
                z    = torch.randn(bsz, z_dim, device=device)
                fake = generator(z).detach()

                gp       = gradient_penalty(critic, real, fake, device)
                c_loss   = critic(fake).mean() - critic(real).mean() + lam * gp

                opt_C.zero_grad(); c_loss.backward(); opt_C.step()

            # === Generator update (once) ===
            z      = torch.randn(bsz, z_dim, device=device)
            g_loss = -critic(generator(z)).mean()

            opt_G.zero_grad(); g_loss.backward(); opt_G.step()

        print(f"Epoch {epoch}: W-dist≈{-c_loss.item():.3f}, G={g_loss.item():.3f}")
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function WGAN() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Wasserstein GAN
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          WGAN replaces the Jensen-Shannon divergence with the Wasserstein (Earth Mover)
          distance, providing stable gradients even when real and generated distributions
          have disjoint support, and enforcing the 1-Lipschitz constraint via weight clipping
          or gradient penalty (WGAN-GP).
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          <strong>Arjovsky, Chintala & Bottou (2017)</strong> derived the theoretical
          justification for using the Wasserstein distance in GANs, showing it solves the
          vanishing gradient and mode collapse problems of vanilla GANs. The original WGAN
          used weight clipping (<InlineMath math="|w| \leq c" />) to enforce Lipschitz continuity.
          <strong> Gulrajani et al. (2017)</strong> replaced weight clipping with a gradient
          penalty (WGAN-GP), yielding more stable training and higher quality outputs.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Wasserstein-1 (Earth Mover) Distance"
        definition="The Wasserstein-1 distance between distributions $P$ and $Q$ is: $W_1(P, Q) = \inf_{\gamma \in \Pi(P,Q)} \mathbb{E}_{(x,y) \sim \gamma}[\|x - y\|]$ where $\Pi(P,Q)$ is the set of all joint distributions (couplings) with marginals $P$ and $Q$. Intuitively, it is the minimum cost of transporting mass from $P$ to $Q$, where cost equals distance traveled."
        notation="$W_1$ is a metric on the space of probability distributions. Unlike KL and JSD, $W_1(P,Q)$ is finite and continuous even when $P$ and $Q$ have disjoint support — critical for early GAN training when generator output is far from the data manifold."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Lipschitz Continuity"
        definition="A function $f: \mathcal{X} \to \mathbb{R}$ is $K$-Lipschitz if $|f(x) - f(y)| \leq K\|x - y\|$ for all $x, y \in \mathcal{X}$. In WGAN, the critic $D_\phi$ must be constrained to the class of 1-Lipschitz functions: $\|D_\phi\|_L \leq 1$. This is enforced either by weight clipping ($|w_{ij}| \leq c$) or by the gradient penalty (WGAN-GP): $\mathbb{E}_{\hat{x}}[(\|\nabla_{\hat{x}} D(\hat{x})\|_2 - 1)^2]$."
        notation="Weight clipping is simple but may over-constrain the critic and cause gradient issues. The gradient penalty (GP) directly penalizes the Lipschitz constraint violation at interpolated points $\hat{x} = \alpha x_\mathrm{real} + (1-\alpha)x_\mathrm{fake}$, $\alpha \sim U[0,1]$."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="WGAN Critic Objective (Kantorovich-Rubinstein Duality)"
        definition="By the Kantorovich-Rubinstein theorem, $W_1(P_r, P_g) = \sup_{\|f\|_L \leq 1} \mathbb{E}_{x \sim P_r}[f(x)] - \mathbb{E}_{x \sim P_g}[f(x)]$. The WGAN critic approximates this supremum: maximize $\mathbb{E}_{x \sim P_r}[D(x)] - \mathbb{E}_{z \sim p(z)}[D(G(z))]$ over 1-Lipschitz $D$. The generator minimizes $-\mathbb{E}[D(G(z))]$ (maximizes the critic score on its outputs)."
        notation="Note: the WGAN critic $D$ is not a probability (no sigmoid). It can take any real values — it's a scoring function (hence 'critic' not 'discriminator'). The Wasserstein distance estimate is the critic loss value (without absolute value)."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Wasserstein Distance Provides Meaningful Gradients"
        statement="When $p_\mathrm{data}$ and $p_G$ have disjoint support (which happens when $p_G$ is supported on a low-dimensional manifold): (i) $\mathrm{JSD}(p_\mathrm{data}\|p_G) = \log 2$ (maximum, constant), so $\nabla_\theta\,\mathrm{JSD} = 0$ — no gradient for the generator; (ii) $W_1(p_\mathrm{data}, p_G) > 0$ and is continuous in $\theta$, providing meaningful gradients."
        proof="(i) If $\mathrm{supp}(P) \cap \mathrm{supp}(Q) = \emptyset$, then the optimal discriminator $D^*(x) = 1$ on $\mathrm{supp}(P)$ and $0$ on $\mathrm{supp}(Q)$, giving $V(G,D^*) = 0 + 0 = 0$, and $\mathrm{JSD} = \log 2$. The gradient of JSD w.r.t. $\theta$ is zero because the optimal discriminator perfectly separates the distributions — changing $\theta$ slightly does not change JSD. (ii) $W_1$ is a metric on a separable complete metric space (by Prokhorov's theorem), so it's weakly continuous. If $p_\theta \to p_r$ weakly, then $W_1(p_\theta, p_r) \to 0$. The generator gradient $\nabla_\theta W_1$ is non-zero generically — it points toward the true data distribution. $\square$"
        corollaries={[
          "WGAN gradients do not vanish even when D is trained to optimality — a key stability improvement over vanilla GANs.",
          "The Wasserstein distance can be used as a meaningful convergence metric: training should reduce $W_1$ monotonically (unlike the GAN loss which oscillates).",
        ]}
      />

      <LipschitzVisualizer />

      <ExampleBlock
        title="WGAN Critic Loss on 1D Gaussians"
        problem="Data distribution: $p_r = \mathcal{N}(0, 1)$. Generator currently produces $p_g = \mathcal{N}(2, 1)$. Estimate the Wasserstein distance and the optimal critic function."
        difficulty="advanced"
        solution={[
          {
            step: 'Compute Wasserstein-1 distance for Gaussians',
            formula: 'W_1(\\mathcal{N}(\\mu_1, \\sigma_1^2),\\, \\mathcal{N}(\\mu_2, \\sigma_2^2)) = |\\mu_1 - \\mu_2| = |0 - 2| = 2',
            explanation: 'For 1D Gaussians with equal variance, W₁ equals the mean shift. (In general: W₂² = |μ₁-μ₂|² + (σ₁-σ₂)².)',
          },
          {
            step: 'Optimal 1-Lipschitz critic',
            formula: 'f^*(x) = x\\,/\\,(\\sigma_1 + \\sigma_2) \\quad \\text{(shifts mass optimally)}',
            explanation: 'The optimal transport plan for 1D distributions is the monotone coupling: match quantiles. The critic gradient points from fake to real distribution.',
          },
          {
            step: 'Critic loss after training',
            formula: '\\mathbb{E}_{x\\sim p_r}[D(x)] - \\mathbb{E}_{z}[D(G(z))] \\approx W_1 = 2',
            explanation: 'A perfectly trained WGAN critic reports the Wasserstein distance as the loss value. As the generator improves, this value decreases toward 0.',
          },
        ]}
      />

      <WarningBlock title="WGAN-GP Implementation Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Batch normalization in critic:</strong> BN creates correlations between sample gradients in a batch, breaking the per-sample Lipschitz constraint. Use layer normalization or no normalization in the WGAN-GP critic.</li>
          <li><strong>n_critic ratio:</strong> WGAN recommends training the critic 5 times per generator update. Too few critic steps means the Wasserstein estimate is inaccurate; too many is wasteful.</li>
          <li><strong>Weight clipping vs GP:</strong> Weight clipping (original WGAN) constrains the critic capacity too severely, leading to slow convergence. WGAN-GP (gradient penalty) is almost always preferred in practice.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={WGAN_CODE}
        language="python"
        title="WGAN-GP Training Loop — PyTorch"
        runnable
      />
    </div>
  );
}
