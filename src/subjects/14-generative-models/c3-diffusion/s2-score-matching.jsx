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
// Score Function Arrows on 2D Gaussian Mixture
// ---------------------------------------------------------------------------

function ScoreViz() {
  const [sigma, setSigma] = useState(0.5);
  const [showScore, setShowScore] = useState(true);

  // 2D Gaussian mixture: 3 components
  const components = [
    { mx: -1.5, my: 0.5, w: 0.4 },
    { mx: 1.5, my: 0.5, w: 0.35 },
    { mx: 0, my: -1.2, w: 0.25 },
  ];

  function pdf(x, y) {
    return components.reduce((s, c) => {
      const d2 = (x - c.mx) ** 2 + (y - c.my) ** 2;
      return s + c.w * Math.exp(-d2 / (2 * sigma * sigma));
    }, 0);
  }

  // Score = gradient of log p(x)
  function score(x, y) {
    const p = pdf(x, y);
    if (p < 1e-10) return [0, 0];
    // Numerical gradient
    const h = 0.01;
    const gx = (Math.log(pdf(x + h, y) + 1e-12) - Math.log(pdf(x - h, y) + 1e-12)) / (2 * h);
    const gy = (Math.log(pdf(x, y + h) + 1e-12) - Math.log(pdf(x, y - h) + 1e-12)) / (2 * h);
    return [gx, gy];
  }

  const svgW = 360;
  const svgH = 300;
  const xMin = -3, xMax = 3, yMin = -2.5, yMax = 2.5;

  function tx(x) { return ((x - xMin) / (xMax - xMin)) * svgW; }
  function ty(y) { return svgH - ((y - yMin) / (yMax - yMin)) * svgH; }

  // Grid of arrows
  const GRID = 9;
  const arrows = [];
  for (let i = 0; i <= GRID; i++) {
    for (let j = 0; j <= GRID; j++) {
      const x = xMin + (i / GRID) * (xMax - xMin);
      const y = yMin + (j / GRID) * (yMax - yMin);
      const [sx, sy] = score(x, y);
      const norm = Math.sqrt(sx * sx + sy * sy) + 1e-8;
      const scale = 0.18;
      arrows.push({
        x1: tx(x), y1: ty(y),
        dx: sx / norm * scale,
        dy: -sy / norm * scale,
        intensity: Math.min(norm / 5, 1),
      });
    }
  }

  // Density heatmap as SVG rect grid
  const HGRID = 40;
  const heatCells = [];
  for (let i = 0; i < HGRID; i++) {
    for (let j = 0; j < HGRID; j++) {
      const x = xMin + (i / HGRID) * (xMax - xMin);
      const y = yMin + (j / HGRID) * (yMax - yMin);
      const p = pdf(x, y);
      const alpha = Math.min(p * 4, 1);
      heatCells.push({ x: tx(x), y: ty(y + (yMax - yMin) / HGRID), w: svgW / HGRID + 1, h: svgH / HGRID + 1, alpha });
    }
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Score Function <InlineMath math="\nabla_x \log p(x)" /> on 2D Mixture
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Arrows point in the direction of increasing log-density. Langevin dynamics follows
        these score vectors to sample from the distribution.
      </p>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Bandwidth σ:</label>
          <input type="range" min={0.2} max={1.5} step={0.05} value={sigma}
            onChange={(e) => setSigma(parseFloat(e.target.value))}
            className="w-24 accent-emerald-500" />
          <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{sigma.toFixed(2)}</span>
        </div>
        <button onClick={() => setShowScore((v) => !v)}
          className={`rounded px-3 py-1 text-sm font-medium ${
            showScore ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          }`}>
          {showScore ? 'Hide' : 'Show'} score arrows
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Heatmap */}
          {heatCells.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h}
              fill="#6366f1" opacity={c.alpha * 0.6} />
          ))}
          {/* Score arrows */}
          {showScore && arrows.map((a, i) => {
            const ex = a.x1 + a.dx * svgW;
            const ey = a.y1 + a.dy * svgH;
            const col = `rgba(16,185,129,${0.4 + a.intensity * 0.6})`;
            return (
              <g key={i}>
                <line x1={a.x1} y1={a.y1} x2={ex} y2={ey} stroke={col} strokeWidth={1.5} />
                <polygon
                  points={`${ex},${ey} ${ex - a.dx * 12 - a.dy * 6},${ey - a.dy * 12 + a.dx * 6} ${ex - a.dx * 12 + a.dy * 6},${ey - a.dy * 12 - a.dx * 6}`}
                  fill={col}
                />
              </g>
            );
          })}
          {/* Component centers */}
          {components.map((c, i) => (
            <circle key={i} cx={tx(c.mx)} cy={ty(c.my)} r={4} fill="white" stroke="#f59e0b" strokeWidth={2} />
          ))}
          {/* Labels */}
          <text x={4} y={12} fontSize={9} fill="#6366f1" fontWeight="bold">p(x) density</text>
          <text x={4} y={24} fontSize={9} fill="#10b981" fontWeight="bold">∇log p(x)</text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const SCORE_CODE = `import torch
import torch.nn as nn
import numpy as np

# -----------------------------------------------------------------------
# Denoising Score Matching (DSM) objective
# -----------------------------------------------------------------------

class ScoreNet(nn.Module):
    """Time-conditioned score network s_theta(x, sigma) ≈ ∇_x log p_sigma(x)."""
    def __init__(self, dim=2, hidden=128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(dim + 1, hidden), nn.SiLU(),
            nn.Linear(hidden, hidden),  nn.SiLU(),
            nn.Linear(hidden, dim),
        )
    def forward(self, x, sigma):
        # Concatenate sigma as a conditioning feature
        cond = sigma.view(-1, 1).expand(x.size(0), 1)
        return self.net(torch.cat([x, cond], dim=1))

def dsm_loss(score_net, x0, sigma_min=0.01, sigma_max=10.0):
    """
    Denoising Score Matching:
      L = E_sigma E_x0 E_noise [ sigma^2 * ||s_theta(x+sigma*noise, sigma) + noise/sigma||^2 ]
    """
    bsz = x0.size(0)
    # Sample noise level sigma ~ LogUniform(sigma_min, sigma_max)
    log_sigma = (torch.rand(bsz) * (np.log(sigma_max) - np.log(sigma_min)) + np.log(sigma_min))
    sigma = torch.exp(log_sigma).to(x0.device)

    # Perturb data
    noise = torch.randn_like(x0)
    x_tilde = x0 + sigma.view(-1, 1) * noise

    # Score prediction: should be -noise/sigma (= ∇ log p_sigma(x_tilde|x0))
    s_pred = score_net(x_tilde, sigma)
    target = -noise / sigma.view(-1, 1)

    # Weighted MSE (weight = sigma^2 for equal contribution across scales)
    loss = (sigma.view(-1, 1) ** 2 * (s_pred - target) ** 2).mean()
    return loss


# -----------------------------------------------------------------------
# Langevin Dynamics Sampler
# -----------------------------------------------------------------------

@torch.no_grad()
def annealed_langevin(score_net, sigmas, n_steps_per_sigma=100,
                      eps=0.00002, device='cpu', dim=2):
    """
    Annealed Langevin dynamics: sample by following score at decreasing noise levels.
    sigma_1 > sigma_2 > ... > sigma_L (anneal from high to low noise)
    """
    x = torch.randn(1, dim, device=device) * sigmas[0]  # init at highest noise

    for sigma in sigmas:
        step_size = eps * (sigma / sigmas[-1]) ** 2
        sigma_t = torch.tensor([sigma], device=device)

        for _ in range(n_steps_per_sigma):
            grad = score_net(x, sigma_t)
            noise = torch.randn_like(x)
            x = x + step_size * grad + torch.sqrt(2 * step_size) * noise

    return x
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ScoreMatching() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Score Matching & SDEs
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Score-based generative models learn the gradient of the log-density (the score function)
          and use Langevin dynamics or stochastic differential equations to generate samples
          by following these gradients through a sequence of noise levels.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Score matching was introduced by <strong>Hyvärinen (2005)</strong> as a way to fit
          unnormalized probability models. <strong>Song & Ermon (2019, 2020)</strong> showed
          that estimating score functions at multiple noise levels and using annealed Langevin
          dynamics achieves high-quality generation. <strong>Song et al. (2021)</strong>
          unified the framework using stochastic differential equations, connecting DDPM
          and score-based models as discretizations of the same continuous-time SDE.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Score Function"
        definition="The score function of a distribution $p(x)$ is the gradient of the log-density: $s(x) = \nabla_x \log p(x) \in \mathbb{R}^d$. The score points in the direction of steepest increase in log-probability — it is a vector field that 'knows' where high-density regions are. Learning the score does not require knowing the normalizing constant $Z = \int p^*(x)\,dx$."
        notation="For a Gaussian $p(x) = \mathcal{N}(\mu, \sigma^2 I)$: $s(x) = -\frac{x-\mu}{\sigma^2}$ — always points toward the mean. For a mixture, the score points toward the nearest mode, weighted by component probabilities."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Denoising Score Matching (DSM)"
        definition="DSM learns the score of a noise-perturbed distribution $p_\sigma(x) = \int p_\mathrm{data}(x_0)\,\mathcal{N}(x;\,x_0,\sigma^2 I)\,dx_0$. The objective is: $\mathcal{L}_\mathrm{DSM} = \mathbb{E}_{\sigma}\mathbb{E}_{x_0}\mathbb{E}_{\varepsilon\sim\mathcal{N}(0,I)}\!\left[\sigma^2\!\left\|s_\theta(x_0+\sigma\varepsilon,\sigma) + \frac{\varepsilon}{\sigma}\right\|^2\right]$ which can be evaluated without knowing $\nabla_x \log p_\sigma(x)$ explicitly — the target is simply $-\varepsilon/\sigma$, the score of the Gaussian noise kernel."
        notation="By Tweedie's formula: $\mathbb{E}[x_0|x_t] = x_t + \sigma_t^2\,s_\theta(x_t, \sigma_t)$, connecting the learned score to the DDPM denoising network. At $\sigma \to 0$, the score of $p_\sigma$ approaches the score of $p_\mathrm{data}$."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Langevin Dynamics"
        definition="Langevin Monte Carlo generates samples from $p(x)$ by iterating: $x_{k+1} = x_k + \frac{\delta}{2}\nabla_x \log p(x_k) + \sqrt{\delta}\,\varepsilon_k$ where $\varepsilon_k \sim \mathcal{N}(0,I)$ and $\delta > 0$ is the step size. The stationary distribution is $p(x)$. With $\nabla_x \log p$ replaced by the learned $s_\theta$, this generates samples without requiring a normalizing constant."
        notation="Annealed Langevin dynamics runs Langevin at decreasing noise levels $\sigma_1 > \sigma_2 > \cdots > \sigma_L$. At high $\sigma$, the score is well-estimated everywhere (the noise smooths out the density). As $\sigma \to 0$, we recover samples from $p_\mathrm{data}$."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Score Matching = Denoising Score Matching (Vincent, 2011)"
        statement="Under mild regularity conditions, the implicit score matching objective $\mathcal{L}_\mathrm{ISM} = \mathbb{E}_x\!\left[\mathrm{tr}(\nabla_x s_\theta(x)) + \frac{1}{2}\|s_\theta(x)\|^2\right]$ is equivalent (up to a constant) to the denoising score matching objective with Gaussian noise: $\mathcal{L}_\mathrm{DSM}(\sigma) = \mathbb{E}_{x_0,\varepsilon}\!\left[\left\|s_\theta(x_0+\sigma\varepsilon) + \frac{\varepsilon}{\sigma}\right\|^2\right]$. In the limit $\sigma \to 0$, both estimate the score of $p_\mathrm{data}$."
        proof="The ISM objective arises from integrating the score matching loss $\|s_\theta(x) - \nabla_x \log p(x)\|^2$ by parts (Green's theorem), eliminating the intractable $\nabla \log p$. DSM uses a different equality: $\nabla_x \log p_\sigma(\tilde{x}) = \mathbb{E}_{x_0|\tilde{x}}\!\left[\frac{x_0 - \tilde{x}}{\sigma^2}\right] = -\mathbb{E}[\varepsilon/\sigma|\tilde{x}]$. Vincent (2011) shows that minimizing the DSM objective over all $\sigma$-perturbed versions is equivalent to minimizing the ISM objective in expectation over noise levels. Both estimators are consistent (converge to the true score as $\sigma \to 0$ and $n \to \infty$). $\square$"
        corollaries={[
          "DSM is preferred in practice because it avoids computing $\\mathrm{tr}(\\nabla_x s_\\theta)$, which requires expensive Jacobian traces (\\$O(d)\\$ backward passes).",
          "The equivalence shows that denoising and score estimation are two sides of the same coin — this insight unifies DDPM and score-based models.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Diffusion as Continuous-Time SDE"
        statement="The DDPM forward process is the discretization of the Ornstein-Uhlenbeck SDE: $dx = -\frac{1}{2}\beta(t)\,x\,dt + \sqrt{\beta(t)}\,dW_t$ where $W_t$ is Brownian motion. The reverse SDE (Anderson, 1982) is: $dx = \left[-\frac{1}{2}\beta(t)\,x - \beta(t)\,\nabla_x \log p_t(x)\right]dt + \sqrt{\beta(t)}\,d\bar{W}_t$ which corresponds to denoising by following the learned score. The probability flow ODE $dx = \left[-\frac{1}{2}\beta(t)\,x - \frac{1}{2}\beta(t)\,\nabla_x \log p_t(x)\right]dt$ has the same marginals but is deterministic."
        proof="The connection follows from Ito's lemma and the Fokker-Planck equation. The forward SDE $dx = f(x,t)dt + g(t)dW_t$ has marginal distribution $p_t(x)$ evolving as $\frac{\partial p_t}{\partial t} = -\nabla\cdot(f p_t) + \frac{g^2}{2}\Delta p_t$. Anderson (1982) showed the reverse-time SDE is $dx = [f(x,t) - g^2(t)\nabla_x \log p_t(x)]dt + g(t)d\bar{W}_t$. Substituting $f = -\frac{\beta(t)}{2}x$ and $g = \sqrt{\beta(t)}$ gives the DDPM reverse process. The probability flow ODE is obtained by dropping the noise term and halving the score coefficient (the deterministic equivalent). $\square$"
        corollaries={[
          "The probability flow ODE enables fast sampling (DDIM is its Euler discretization) and exact log-likelihood computation.",
          "The SDE framework allows designing new noise processes, schedules, and samplers systematically — leading to variance-exploding (VE) and variance-preserving (VP) SDEs.",
        ]}
      />

      <ScoreViz />

      <ExampleBlock
        title="Score Function for a 1D Gaussian Mixture"
        problem="Compute the score function $\nabla_x \log p(x)$ for the mixture $p(x) = 0.6\,\mathcal{N}(x;-1,0.5^2) + 0.4\,\mathcal{N}(x;2,0.5^2)$. What happens near each mode and between modes?"
        difficulty="advanced"
        solution={[
          {
            step: 'Write the score as a mixture-weighted sum',
            formula: '\\nabla_x \\log p(x) = \\frac{\\sum_k w_k\\, p_k(x)\\, \\nabla_x \\log p_k(x)}{\\sum_k w_k\\, p_k(x)}',
            explanation: 'The score of a mixture is a convex combination of component scores, weighted by the posterior probability of each component given x.',
          },
          {
            step: 'Score near mode x = -1',
            formula: '\\nabla_x \\log \\mathcal{N}(x;-1,0.25) = -\\frac{x-(-1)}{0.25} = -4(x+1)',
            explanation: 'Near -1, the first component dominates. The score points toward -1 (attraction). At x = -1 exactly, score = 0.',
          },
          {
            step: 'Score in the "valley" between modes (x ≈ 0.5)',
            formula: '\\nabla_x \\log p(0.5) \\approx r_1 \\cdot (-6) + r_2 \\cdot (6) \\quad \\text{where } r_1 + r_2 = 1',
            explanation: 'The score is a tug-of-war: component 1 pulls left (-6), component 2 pulls right (+6). Near the equal-probability crossing, the score crosses zero — this is the score function saddle point.',
          },
        ]}
      />

      <WarningBlock title="Score Estimation Challenges in Low-Density Regions">
        <ul className="space-y-2 text-sm">
          <li><strong>Inaccurate scores in tails:</strong> Standard score matching fails in low-density regions because very few training points appear there — the score estimate has high variance. This is why multi-scale noise (NCSN) is essential: high-σ noise fills in the low-density gaps.</li>
          <li><strong>Mode mixing with Langevin:</strong> Langevin dynamics can get trapped in modes when the distribution is multimodal and modes are far apart. Annealing (starting at high noise, decreasing) enables mode jumping in early stages.</li>
          <li><strong>Discretization error:</strong> Langevin dynamics with finite step size δ has stationary distribution ≠ p(x). MALA (Metropolis-adjusted Langevin) corrects this with an accept/reject step, at the cost of slower sampling.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={SCORE_CODE}
        language="python"
        title="Denoising Score Matching + Langevin Sampling — PyTorch"
        runnable
      />
    </div>
  );
}
