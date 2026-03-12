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
// Noise Schedule Visualizer
// ---------------------------------------------------------------------------

function NoiseScheduleViz() {
  const [T, setT] = useState(1000);
  const [scheduleType, setScheduleType] = useState('linear');

  // Compute betas and alphas_bar
  function getBeta(t, total, type) {
    if (type === 'linear') {
      const b_start = 1e-4, b_end = 0.02;
      return b_start + (t / total) * (b_end - b_start);
    } else {
      // cosine schedule (improved DDPM)
      const s = 0.008;
      const f = (t) => Math.cos((t / total + s) / (1 + s) * Math.PI / 2) ** 2;
      const a_bar_t = f(t) / f(0);
      const a_bar_prev = t > 0 ? f(t - 1) / f(0) : 1;
      return Math.min(1 - a_bar_t / a_bar_prev, 0.999);
    }
  }

  const N_PLOT = 100;
  const steps = Array.from({ length: N_PLOT }, (_, i) => Math.round((i / (N_PLOT - 1)) * T));

  // Compute alpha_bar_t = prod(1 - beta_s, s=0..t)
  const alphasBars = [];
  let abCum = 1.0;
  for (let t = 0; t < T; t++) {
    abCum *= (1 - getBeta(t, T, scheduleType));
    alphasBars.push(abCum);
  }

  // Pick N_PLOT evenly spaced
  const plotAlphaBars = steps.map((s) => alphasBars[Math.min(s, T - 1)]);
  const plotBetas = steps.map((s) => getBeta(s, T, scheduleType));

  const svgW = 480;
  const svgH = 180;
  const padL = 38, padR = 12, padT = 15, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  function tx(i) { return padL + (i / (N_PLOT - 1)) * plotW; }
  function ty01(v) { return padT + (1 - v) * plotH; }

  const abarPoints = plotAlphaBars.map((v, i) => `${tx(i).toFixed(1)},${ty01(v).toFixed(1)}`).join(' ');
  const betaMax = Math.max(...plotBetas);
  const betaPoints = plotBetas.map((v, i) => `${tx(i).toFixed(1)},${ty01(v / betaMax).toFixed(1)}`).join(' ');

  // Visualize a "noisy image" as colored blocks
  const noiseBlocks = Array.from({ length: 10 }, (_, i) => {
    const t = Math.round((i / 9) * (N_PLOT - 1));
    const ab = plotAlphaBars[t];
    const gray = Math.round(200 * ab);
    const noise = Math.round(200 * (1 - ab));
    return { ab, gray, noise, t: steps[t] };
  });

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        DDPM Forward Process — Noise Schedule
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="\bar{\alpha}_t = \prod_{s=1}^t (1-\beta_s)" /> controls how much signal
        remains at step <InlineMath math="t" />. At <InlineMath math="t=T" />, <InlineMath math="\bar{\alpha}_T \approx 0" /> (pure noise).
      </p>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          {['linear', 'cosine'].map((s) => (
            <button key={s} onClick={() => setScheduleType(s)}
              className={`rounded px-3 py-1 text-sm font-medium transition ${
                scheduleType === s
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">T:</label>
          <input type="range" min={100} max={2000} step={100} value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-28 accent-indigo-500" />
          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{T}</span>
        </div>
      </div>

      {/* Noise blocks visualization */}
      <div className="mb-4 flex gap-1 items-center">
        {noiseBlocks.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
            <div className="w-full h-8 rounded"
              style={{ background: `rgb(${b.gray},${b.gray},${b.gray + Math.round(b.noise * 0.3)})` }} />
            <span className="text-xs text-gray-400">{b.t}</span>
          </div>
        ))}
      </div>
      <p className="mb-3 text-xs text-gray-400 text-center">x₀ (signal) → x_T (noise) over T={T} steps</p>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line x1={padL - 3} y1={ty01(v)} x2={padL} y2={ty01(v)} stroke="#9ca3af" strokeWidth={1} />
              <text x={padL - 5} y={ty01(v) + 4} textAnchor="end" fontSize={8} fill="#9ca3af">{v}</text>
            </g>
          ))}
          <polyline points={abarPoints} fill="none" stroke="#6366f1" strokeWidth={2.2} />
          <polyline points={betaPoints} fill="none" stroke="#f59e0b" strokeWidth={1.8} strokeDasharray="4,2" />
          <text x={padL + 8} y={padT + 14} fontSize={9} fill="#6366f1" fontWeight="bold">ᾱ_t (signal)</text>
          <text x={padL + 8} y={padT + 26} fontSize={9} fill="#f59e0b" fontWeight="bold">β_t (scaled)</text>
          <text x={padL + plotW / 2} y={svgH - 3} textAnchor="middle" fontSize={9} fill="#9ca3af">timestep t</text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const DDPM_CODE = `import torch
import torch.nn as nn
import numpy as np

def make_beta_schedule(T=1000, schedule='linear', beta_start=1e-4, beta_end=0.02):
    if schedule == 'linear':
        return torch.linspace(beta_start, beta_end, T)
    elif schedule == 'cosine':
        s = 0.008
        t = torch.linspace(0, T, T + 1)
        f = torch.cos((t / T + s) / (1 + s) * torch.pi / 2) ** 2
        alphas_bar = f / f[0]
        betas = 1 - alphas_bar[1:] / alphas_bar[:-1]
        return betas.clamp(0, 0.999)

class GaussianDiffusion:
    def __init__(self, T=1000, schedule='linear'):
        self.T = T
        betas = make_beta_schedule(T, schedule)
        alphas = 1. - betas
        self.alphas_bar = torch.cumprod(alphas, dim=0)   # ᾱ_t
        self.sqrt_ab    = torch.sqrt(self.alphas_bar)
        self.sqrt_1mab  = torch.sqrt(1. - self.alphas_bar)

    def q_sample(self, x0, t, noise=None):
        """Forward process: q(x_t | x_0) = N(sqrt(ᾱ_t)*x_0, (1-ᾱ_t)*I)"""
        if noise is None:
            noise = torch.randn_like(x0)
        ab  = self.sqrt_ab[t].view(-1, 1, 1, 1)
        mab = self.sqrt_1mab[t].view(-1, 1, 1, 1)
        return ab * x0 + mab * noise, noise

    def p_losses(self, model, x0, t):
        """
        Denoising objective: predict noise epsilon from x_t
        L_simple = E_t E_x0 E_eps [ ||eps - eps_theta(x_t, t)||^2 ]
        """
        noise = torch.randn_like(x0)
        x_t, _ = self.q_sample(x0, t, noise)
        eps_pred = model(x_t, t)
        return nn.functional.mse_loss(eps_pred, noise)

    @torch.no_grad()
    def p_sample(self, model, x_t, t):
        """Reverse process: one DDPM denoising step."""
        b = self.alphas_bar
        betas = make_beta_schedule(self.T)
        alphas = 1. - betas
        alpha_t = alphas[t]
        ab_t    = b[t]

        eps_pred = model(x_t, torch.tensor([t] * x_t.size(0)))
        # Predicted x0
        x0_pred = (x_t - torch.sqrt(1 - ab_t) * eps_pred) / torch.sqrt(ab_t)
        x0_pred = x0_pred.clamp(-1, 1)

        if t == 0:
            return x0_pred
        # Posterior mean + noise
        ab_prev = b[t - 1]
        post_var = betas[t] * (1 - ab_prev) / (1 - ab_t)
        post_mean = (torch.sqrt(ab_prev) * betas[t] / (1 - ab_t) * x0_pred
                     + torch.sqrt(alpha_t) * (1 - ab_prev) / (1 - ab_t) * x_t)
        return post_mean + torch.sqrt(post_var) * torch.randn_like(x_t)
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DDPM() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          DDPM — Denoising Diffusion Probabilistic Models
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Diffusion models define a forward process that gradually destroys data with Gaussian
          noise, and learn a reverse process (denoising network) to reconstruct samples,
          achieving state-of-the-art image generation quality.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Diffusion models were first proposed by <strong>Sohl-Dickstein et al. (2015)</strong>
          using ideas from non-equilibrium thermodynamics. The modern formulation was
          developed by <strong>Ho et al. (2020)</strong> (DDPM), showing that a simple
          noise-prediction objective with a U-Net denoiser achieves high-quality image synthesis.
          <strong> Song & Ermon (2020)</strong> independently developed score-based generative
          models, unifying both frameworks via stochastic differential equations.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Forward (Noising) Process"
        definition="The forward process gradually adds Gaussian noise over $T$ steps: $q(x_t | x_{t-1}) = \mathcal{N}(x_t;\, \sqrt{1-\beta_t}\,x_{t-1},\, \beta_t I)$ where $\{\beta_t\}_{t=1}^T$ is the noise schedule with $\beta_t \in (0,1)$. Key property: the marginal at any step is $q(x_t | x_0) = \mathcal{N}(x_t;\, \sqrt{\bar{\alpha}_t}\,x_0,\, (1-\bar{\alpha}_t) I)$ where $\bar{\alpha}_t = \prod_{s=1}^t (1-\beta_s)$. This allows sampling $x_t$ directly from $x_0$ in one step."
        notation="$\beta_t$ controls the noise level at each step. Linear schedule: $\beta_t$ increases linearly from $10^{-4}$ to $0.02$. Cosine schedule (improved DDPM): $\bar{\alpha}_t = \cos^2\!\left(\frac{t/T + s}{1+s}\cdot\frac{\pi}{2}\right)$. At $t=T$: $\bar{\alpha}_T \approx 0$, so $x_T \approx \mathcal{N}(0,I)$."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Reverse Process and Denoising Network"
        definition="The reverse process learns to denoise: $p_\theta(x_{t-1}|x_t) = \mathcal{N}(x_{t-1};\, \mu_\theta(x_t, t),\, \sigma_t^2 I)$. Instead of directly predicting the posterior mean, DDPM parameterizes the network $\varepsilon_\theta(x_t, t)$ to predict the noise $\varepsilon$ that was added: $\mu_\theta(x_t,t) = \frac{1}{\sqrt{\alpha_t}}\!\left(x_t - \frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\,\varepsilon_\theta(x_t, t)\right)$."
        notation="The posterior variance $\sigma_t^2 = \tilde{\beta}_t = \frac{1-\bar{\alpha}_{t-1}}{1-\bar{\alpha}_t}\beta_t$ can be fixed (DDPM uses $\sigma_t^2 = \beta_t$). The denoising network $\varepsilon_\theta$ is typically a U-Net with sinusoidal time embeddings to condition on $t$."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="DDPM Training Objective (Simple Loss)"
        definition="The variational lower bound (VLB) for the DDPM can be simplified to the noise prediction objective: $\mathcal{L}_\mathrm{simple} = \mathbb{E}_{t, x_0, \varepsilon}\!\left[\|\varepsilon - \varepsilon_\theta(\sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\varepsilon,\, t)\|^2\right]$ where $\varepsilon \sim \mathcal{N}(0,I)$ and $t \sim \mathrm{Uniform}(1,T)$. This is equivalent to minimizing a reweighted ELBO and is simpler to implement than the full VLB."
        notation="The network input is the noisy sample $x_t = \sqrt{\bar{\alpha}_t}x_0 + \sqrt{1-\bar{\alpha}_t}\varepsilon$. During sampling, no $x_0$ is available — the network only sees $(x_t, t)$ and must predict what noise was added, allowing incremental denoising."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Closed-Form Marginal of Forward Process"
        statement="Given $x_0$, the noisy sample at any timestep can be computed in closed form: $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\varepsilon$ where $\varepsilon \sim \mathcal{N}(0,I)$ and $\bar{\alpha}_t = \prod_{s=1}^t(1-\beta_s)$."
        proof="By induction. At $t=1$: $x_1 = \sqrt{1-\beta_1}\,x_0 + \sqrt{\beta_1}\,\varepsilon_1 = \sqrt{\alpha_1}\,x_0 + \sqrt{1-\alpha_1}\,\varepsilon_1$. Assume $x_{t-1} = \sqrt{\bar{\alpha}_{t-1}}\,x_0 + \sqrt{1-\bar{\alpha}_{t-1}}\,\varepsilon$. Then $x_t = \sqrt{\alpha_t}\,x_{t-1} + \sqrt{1-\alpha_t}\,\varepsilon_t = \sqrt{\alpha_t\bar{\alpha}_{t-1}}\,x_0 + \sqrt{\alpha_t(1-\bar{\alpha}_{t-1})}\,\varepsilon + \sqrt{1-\alpha_t}\,\varepsilon_t$. The last two terms are independent Gaussians: their sum has variance $\alpha_t(1-\bar{\alpha}_{t-1}) + (1-\alpha_t) = 1 - \alpha_t\bar{\alpha}_{t-1} = 1-\bar{\alpha}_t$. Thus $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\varepsilon'$ where $\varepsilon' \sim \mathcal{N}(0,I)$. $\square$"
        corollaries={[
          "This enables efficient training: sample a random timestep $t$, compute $x_t$ directly from $x_0$ without iterating through all steps.",
          "As $T \\to \\infty$ with appropriate $\\beta_t$, $\\bar{\\alpha}_T \\to 0$ and $x_T \\sim \\mathcal{N}(0,I)$ — the forward process completely destroys the data.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="DDPM Simple Loss is a Reweighted ELBO"
        statement="The simple loss $\mathcal{L}_\mathrm{simple} = \mathbb{E}_{t,x_0,\varepsilon}[\|\varepsilon - \varepsilon_\theta(x_t,t)\|^2]$ is proportional to a reweighted version of the variational lower bound: $\mathcal{L}_\mathrm{VLB} = \sum_{t=1}^T \frac{\beta_t^2}{2\sigma_t^2\alpha_t(1-\bar{\alpha}_t)}\mathbb{E}[\|\varepsilon - \varepsilon_\theta(x_t,t)\|^2] + C$. The simple loss drops the $t$-dependent weighting, finding empirically better sample quality."
        proof="The VLB decomposes as $-\mathbb{E}[\log p_\theta(x_0)] \leq \mathcal{L}_T + \sum_{t>1}\mathcal{L}_{t-1} + \mathcal{L}_0$ where $\mathcal{L}_{t-1} = \mathbb{E}[D_\mathrm{KL}(q(x_{t-1}|x_t,x_0)\|p_\theta(x_{t-1}|x_t))]$. Both $q(x_{t-1}|x_t,x_0)$ and $p_\theta(x_{t-1}|x_t)$ are Gaussians, so the KL reduces to a squared mean difference. After substituting the noise parameterization and simplifying, each $\mathcal{L}_{t-1}$ becomes $\frac{\beta_t^2}{2\sigma_t^2\alpha_t(1-\bar{\alpha}_t)}\mathbb{E}[\|\varepsilon - \varepsilon_\theta(x_t,t)\|^2]$. Ho et al. (2020) found that removing the weight $\frac{\beta_t^2}{2\sigma_t^2\alpha_t(1-\bar{\alpha}_t)}$ (which downweights small $t$ steps) improves sample quality. $\square$"
        corollaries={[
          "The simple loss implicitly upweights small-noise timesteps (small $t$, large $\\bar{\\alpha}_t$), which correspond to finer-scale details — important for perceptual quality.",
          "Classifier-free guidance and latent diffusion models both use the same denoising loss but in compressed latent spaces.",
        ]}
      />

      <NoiseScheduleViz />

      <ExampleBlock
        title="Single Forward-Process Step Computation"
        problem="Given $x_0 \in \mathbb{R}^d$ (a clean image), compute $x_{500}$ using the linear schedule with $T=1000$, $\beta_1=10^{-4}$, $\beta_{1000}=0.02$."
        difficulty="intermediate"
        solution={[
          {
            step: 'Compute β₅₀₀ (midpoint of linear schedule)',
            formula: '\\beta_{500} = 10^{-4} + \\frac{499}{999}(0.02 - 10^{-4}) \\approx 0.0100',
            explanation: 'Linear interpolation between the start and end noise levels.',
          },
          {
            step: 'Compute ᾱ₅₀₀ = ∏_{s=1}^{500}(1-β_s)',
            formula: '\\bar{\\alpha}_{500} \\approx \\exp\\!\\left(\\sum_{s=1}^{500}\\ln(1-\\beta_s)\\right) \\approx e^{-3.76} \\approx 0.023',
            explanation: 'Using the log-sum approximation. At step 500, only ~2.3% of the original signal remains.',
          },
          {
            step: 'Sample noisy image directly',
            formula: 'x_{500} = \\sqrt{0.023}\\,x_0 + \\sqrt{0.977}\\,\\varepsilon \\approx 0.152\\,x_0 + 0.988\\,\\varepsilon',
            explanation: 'The data is 85% noise by step 500 for the linear schedule. This is why the cosine schedule was proposed: it preserves signal longer.',
          },
        ]}
      />

      <WarningBlock title="DDPM Sampling Speed and Approximation Errors">
        <ul className="space-y-2 text-sm">
          <li><strong>Slow sampling:</strong> DDPM requires T=1000 sequential denoising steps at inference — expensive compared to single-pass VAE/GAN sampling. DDIM (Song et al., 2020) enables deterministic sampling in 50-100 steps with similar quality by reinterpreting the reverse process.</li>
          <li><strong>Clipping and rounding:</strong> During sampling, $x_0$ predictions are often clipped to [-1,1]. This introduces a small bias but prevents instability from accumulating prediction errors over 1000 steps.</li>
          <li><strong>Schedule mismatch:</strong> The cosine schedule preserves more signal in early steps, reducing the number of "easy" denoising steps and improving sample quality, especially for images with fine details.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={DDPM_CODE}
        language="python"
        title="DDPM Forward/Reverse Process — PyTorch"
        runnable
      />
    </div>
  );
}
