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
// Guidance Scale Slider — Conditional vs Unconditional Interpolation
// ---------------------------------------------------------------------------

function CFGVisualizer() {
  const [w, setW] = useState(1.0);
  const [condClass, setCondClass] = useState(0);

  // Simulated "samples" from 5 classes as 2D colored blobs
  const classes = [
    { name: 'Cat',   cx: -1.5, cy: 0.8,  color: '#3b82f6' },
    { name: 'Dog',   cx: 1.5,  cy: 0.8,  color: '#ef4444' },
    { name: 'Bird',  cx: 0,    cy: -1.2,  color: '#22c55e' },
    { name: 'Car',   cx: -1.2, cy: -0.5,  color: '#f59e0b' },
    { name: 'House', cx: 1.2,  cy: -0.5,  color: '#a855f7' },
  ];

  // Unconditional mean (average of all classes)
  const uncondCx = classes.reduce((s, c) => s + c.cx, 0) / classes.length;
  const uncondCy = classes.reduce((s, c) => s + c.cy, 0) / classes.length;

  const cond = classes[condClass];

  // Guided score = uncond + w * (cond - uncond)
  const guidedCx = uncondCx + w * (cond.cx - uncondCx);
  const guidedCy = uncondCy + w * (cond.cy - uncondCy);

  const svgW = 380;
  const svgH = 260;
  const xMin = -3, xMax = 3, yMin = -2.5, yMax = 2.5;
  function tx(x) { return ((x - xMin) / (xMax - xMin)) * svgW; }
  function ty(y) { return svgH - ((y - yMin) / (yMax - yMin)) * svgH; }

  // Generate simulated sample cloud for each class (deterministic)
  function clusterPoints(cx, cy, n = 8, r = 0.35, seed = 1) {
    let s = seed;
    const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
    return Array.from({ length: n }, () => ({
      x: cx + (rng() - 0.5) * 2 * r,
      y: cy + (rng() - 0.5) * 2 * r,
    }));
  }

  // Spread decreases with higher guidance (tighter sampling)
  const baseSpread = Math.max(0.5 - w * 0.1, 0.1);

  const guidedPoints = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI;
    return {
      x: guidedCx + Math.cos(angle) * baseSpread * 0.8,
      y: guidedCy + Math.sin(angle) * baseSpread * 0.8,
    };
  });

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Classifier-Free Guidance — Conditional vs Unconditional Interpolation
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Guidance scale <InlineMath math="w" /> interpolates (and extrapolates) between
        unconditional and conditional scores.
        <InlineMath math="\tilde{s} = s_\theta(x,\varnothing) + w\,(s_\theta(x,c) - s_\theta(x,\varnothing))" />
      </p>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
            Guidance <InlineMath math="w" />
          </label>
          <input type="range" min={0} max={15} step={0.1} value={w}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-violet-500" />
          <span className="w-10 text-right font-mono text-sm font-bold text-violet-600 dark:text-violet-400">{w.toFixed(1)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {classes.map((c, i) => (
            <button key={i} onClick={() => setCondClass(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium border-2 transition ${
                condClass === i ? 'text-white' : 'bg-transparent'
              }`}
              style={{
                borderColor: c.color,
                backgroundColor: condClass === i ? c.color : 'transparent',
                color: condClass === i ? 'white' : c.color,
              }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Class clusters */}
          {classes.map((c, ci) => (
            <g key={ci}>
              {clusterPoints(c.cx, c.cy, 10, 0.38, ci + 1).map((p, pi) => (
                <circle key={pi} cx={tx(p.x)} cy={ty(p.y)} r={3}
                  fill={c.color} opacity={0.3} />
              ))}
              <circle cx={tx(c.cx)} cy={ty(c.cy)} r={6} fill={c.color} opacity={0.8} />
              <text x={tx(c.cx)} y={ty(c.cy) - 9} textAnchor="middle" fontSize={9} fill={c.color} fontWeight="bold">
                {c.name}
              </text>
            </g>
          ))}
          {/* Unconditional center */}
          <circle cx={tx(uncondCx)} cy={ty(uncondCy)} r={5} fill="#6b7280" opacity={0.7} />
          <text x={tx(uncondCx) + 8} y={ty(uncondCy) + 4} fontSize={9} fill="#6b7280">∅ (uncond)</text>
          {/* Arrow from uncond to guided */}
          <line x1={tx(uncondCx)} y1={ty(uncondCy)} x2={tx(guidedCx)} y2={ty(guidedCy)}
            stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4,2" />
          {/* Guided samples ring */}
          {guidedPoints.map((p, i) => (
            <circle key={i} cx={tx(p.x)} cy={ty(p.y)} r={3.5}
              fill={cond.color} opacity={0.85} stroke="white" strokeWidth={0.5} />
          ))}
          <circle cx={tx(guidedCx)} cy={ty(guidedCy)} r={7}
            fill={cond.color} opacity={0.9} stroke="white" strokeWidth={1.5} />
          <text x={tx(guidedCx)} y={ty(guidedCy) + 18} textAnchor="middle" fontSize={8} fill={cond.color} fontWeight="bold">
            w={w.toFixed(1)} guided
          </text>
        </svg>
      </div>

      <div className="mt-3 rounded-lg bg-violet-50 px-4 py-2 text-xs text-violet-800 dark:bg-violet-900/20 dark:text-violet-300">
        {w < 0.5 ? <span><strong>w≈0:</strong> Nearly unconditional — ignores class label, diverse but low fidelity.</span>
        : w < 1.5 ? <span><strong>w≈1:</strong> Standard conditional sampling without extra guidance.</span>
        : w < 5 ? <span><strong>w={w.toFixed(1)}:</strong> Strong guidance — higher fidelity to class, reduced diversity.</span>
        : <span><strong>w={w.toFixed(1)} (high guidance):</strong> Over-saturated samples, very sharp but potentially artifacts and reduced variety. Typical for DALL-E/SD: w=7.5.</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CFG_CODE = `import torch

def classifier_free_guidance_sample(
    model,          # score/noise network: (x_t, t, cond) -> eps
    x_T,            # initial noise
    cond,           # conditioning (class label, text embedding, etc.)
    guidance_scale, # w: 1=no extra guidance, >1 = stronger conditioning
    T=1000,
    betas=None,
    device='cpu',
):
    """
    DDPM sampling with classifier-free guidance.
    Modified score:
        eps_guided = eps_uncond + w * (eps_cond - eps_uncond)
    """
    if betas is None:
        betas = torch.linspace(1e-4, 0.02, T, device=device)
    alphas = 1. - betas
    alphas_bar = torch.cumprod(alphas, dim=0)

    x_t = x_T.to(device)
    null_cond = torch.zeros_like(cond)   # null/unconditional conditioning token

    for t in reversed(range(T)):
        t_batch = torch.full((x_t.size(0),), t, device=device, dtype=torch.long)

        # Two forward passes: conditional and unconditional
        with torch.no_grad():
            eps_cond   = model(x_t, t_batch, cond)       # conditioned on class
            eps_uncond = model(x_t, t_batch, null_cond)  # null conditioning

        # CFG interpolation: extrapolate beyond conditional
        eps_guided = eps_uncond + guidance_scale * (eps_cond - eps_uncond)

        # DDPM reverse step with guided eps
        ab  = alphas_bar[t]
        ab_prev = alphas_bar[t - 1] if t > 0 else torch.tensor(1.0, device=device)
        alpha_t = alphas[t]
        beta_t  = betas[t]

        x0_pred = (x_t - torch.sqrt(1 - ab) * eps_guided) / torch.sqrt(ab)
        x0_pred = x0_pred.clamp(-1, 1)

        if t == 0:
            x_t = x0_pred
        else:
            post_var  = beta_t * (1 - ab_prev) / (1 - ab)
            post_mean = (torch.sqrt(ab_prev) * beta_t / (1 - ab) * x0_pred
                         + torch.sqrt(alpha_t) * (1 - ab_prev) / (1 - ab) * x_t)
            x_t = post_mean + torch.sqrt(post_var) * torch.randn_like(x_t)

    return x_t


# Training: randomly drop conditioning (p_uncond dropout)
def cfg_training_loss(model, x0, cond, noise_scheduler, p_uncond=0.1):
    """
    CFG training: randomly replace cond with null token.
    During inference, run both conditional and unconditional in parallel.
    """
    bsz = x0.size(0)
    t = torch.randint(0, noise_scheduler.T, (bsz,), device=x0.device)

    # Random unconditional masking
    mask = torch.rand(bsz, device=x0.device) < p_uncond
    cond_input = cond.clone()
    cond_input[mask] = 0   # null token

    noise = torch.randn_like(x0)
    x_t, _ = noise_scheduler.q_sample(x0, t, noise)
    eps_pred = model(x_t, t, cond_input)
    return torch.nn.functional.mse_loss(eps_pred, noise)
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CFG() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Classifier-Free Guidance
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          CFG enables strong conditional generation by extrapolating the score estimate
          beyond the conditional direction, trading diversity for fidelity through a
          single guidance scale hyperparameter.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          <strong>Ho & Salimans (2021)</strong> introduced classifier-free guidance as an
          alternative to classifier guidance (Dhariwal & Nichol, 2021), which required a
          separately trained classifier. CFG trains a single model with both conditional
          and unconditional objectives, enabling guidance without a separate classifier.
          CFG became the standard technique in text-to-image models (DALL-E 2, Stable
          Diffusion, Imagen) with guidance scales typically between 7 and 12.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Classifier Guidance (Baseline)"
        definition="Original classifier guidance (Dhariwal & Nichol, 2021) modifies the diffusion score using gradients from a noisy classifier $p_\phi(c|x_t)$: $\tilde{s}_\theta(x_t,t,c) = s_\theta(x_t,t) + w\,\nabla_{x_t}\log p_\phi(c|x_t)$. This steers generation toward class $c$ by following the classifier gradient. The guidance scale $w$ controls fidelity-diversity tradeoff. Limitation: requires training a separate noise-robust classifier at every noise level."
        notation="The classifier gradient $\nabla_{x_t}\log p_\phi(c|x_t)$ shifts the score toward regions where $c$ is probable. Higher $w$ leads to sharper, more class-specific samples at the cost of diversity and potential adversarial artifacts."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Classifier-Free Guidance"
        definition="CFG trains a single model jointly on conditional ($c$ provided) and unconditional ($c=\varnothing$) denoising, randomly dropping the condition with probability $p_\mathrm{uncond}$ during training. At inference, the guided score estimate is: $\tilde{\varepsilon}_\theta(x_t,t,c) = \varepsilon_\theta(x_t,t,\varnothing) + w\,(\varepsilon_\theta(x_t,t,c) - \varepsilon_\theta(x_t,t,\varnothing))$ where $\varepsilon_\theta(x_t,t,\varnothing)$ is the unconditional prediction (null token)."
        notation="For $w=0$: pure unconditional sampling. For $w=1$: standard conditional sampling. For $w>1$: extrapolates beyond the conditional direction — increases fidelity but reduces diversity. Typical values: $w \in [3, 12]$ for text-to-image generation."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Unconditional Dropout Training"
        definition="During CFG training, the conditioning signal $c$ is randomly replaced by a null token $\varnothing$ (zero vector, learnable null embedding, or [MASK] token) with probability $p_\mathrm{uncond} \in [0.1, 0.2]$. This trains the model to handle both conditional and unconditional denoising in a single forward pass, amortizing the cost of guidance to two forward passes at inference (conditional + unconditional) instead of one classifier gradient computation."
        notation="Implementation: $c_\mathrm{input} = c$ with probability $1-p_\mathrm{uncond}$, else $c_\mathrm{input} = \varnothing$. The model learns $\varepsilon_\theta(x_t, t, \varnothing) \approx \mathbb{E}_{c}[\varepsilon_\theta(x_t, t, c)]$ — the average over all conditions."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="CFG as Implicit Classifier Gradient"
        statement="The CFG score modification $\tilde{s} = s_\theta(x_t,\varnothing) + w\,(s_\theta(x_t,c) - s_\theta(x_t,\varnothing))$ is equivalent to using the score of $p(x_t)^{1-w} \cdot p(x_t|c)^w$, which for $w>1$ is a sharpened conditional distribution — equivalent to following gradients of a classifier $\log p(c|x_t) \propto \log p(x_t|c) - \log p(x_t)$."
        proof="By Bayes' theorem, $p(x_t|c) = p(c|x_t)p(x_t)/p(c)$. The score of $p(x_t|c)$ is $s(x_t,c) = \nabla_{x_t}\log p(x_t|c) = s(x_t) + \nabla_{x_t}\log p(c|x_t)$. Thus $s(x_t,c) - s(x_t,\varnothing) \approx \nabla_{x_t}\log p(c|x_t)$. Substituting: $\tilde{s} = s(x_t,\varnothing) + w\,\nabla_{x_t}\log p(c|x_t) = \nabla_{x_t}[\log p(x_t) + w\log p(c|x_t)] = \nabla_{x_t}\log[p(x_t)^1 p(c|x_t)^w]$. This is the score of $p(x_t)\,p(c|x_t)^w$, equivalent to maximizing $\log p(x_t) + w\log p(c|x_t)$ — trading marginal probability for class adherence. $\square$"
        corollaries={[
          "CFG with $w>1$ implicitly runs classifier guidance with a classifier learned from the generative model itself — no separately trained discriminative model needed.",
          "The optimal $w$ balances FID (measuring distribution quality) and CLIP score (measuring text-image alignment). Increasing $w$ typically improves CLIP at the cost of FID.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Fidelity-Diversity Tradeoff Under CFG"
        statement="For a conditional diffusion model with CFG scale $w$, the precision (average quality of samples) increases monotonically with $w$, while recall (diversity/coverage) decreases. There exists an optimal $w^*$ maximizing F1 score (harmonic mean of precision and recall)."
        proof="Intuitively: the CFG-guided distribution is $\tilde{p}(x|c) \propto p(x)^{1-w}p(x|c)^w$. For $w>1$, the density is peaked more sharply around the conditional mode — sampling from a sharpened distribution reduces variance (higher precision) but misses low-probability but valid samples (lower recall). Formally, for a Gaussian approximation $p(x|c) = \mathcal{N}(\mu_c, \Sigma)$: $\tilde{p}(x|c) \propto \mathcal{N}(\mu_c, \Sigma/w)$ — same mean, $w$-times smaller variance. Precision increases (samples are closer to $\mu_c$); recall decreases (no samples far from $\mu_c$). $\square$"
        corollaries={[
          "The tradeoff explains why CFG scale is treated as a hyperparameter: different applications want different balances (creative diversity vs photorealistic accuracy).",
          "Dynamic thresholding (Imagen) and interval guidance further refine CFG by preventing the score extrapolation from producing out-of-range pixel values.",
        ]}
      />

      <CFGVisualizer />

      <ExampleBlock
        title="CFG in Stable Diffusion — Practical Calculation"
        problem="A text-to-image model uses CFG with $w=7.5$. Given $\varepsilon_\theta(x_t, t, \text{text}) = [0.3, -0.2]$ and $\varepsilon_\theta(x_t, t, \varnothing) = [0.1, -0.05]$ (2D example), compute the guided noise estimate."
        difficulty="intermediate"
        solution={[
          {
            step: 'Compute the guidance direction',
            formula: '\\varepsilon_\\theta(x_t,t,c) - \\varepsilon_\\theta(x_t,t,\\varnothing) = [0.3-0.1, -0.2-(-0.05)] = [0.2, -0.15]',
            explanation: 'This vector points from the unconditional to the conditional estimate — the direction that correlates with the text condition.',
          },
          {
            step: 'Scale by guidance weight w=7.5',
            formula: 'w \\cdot (\\varepsilon_c - \\varepsilon_\\varnothing) = 7.5 \\times [0.2, -0.15] = [1.5, -1.125]',
            explanation: 'The guidance contribution is much larger than the original conditional estimate, strongly steering toward the text.',
          },
          {
            step: 'Add unconditional estimate',
            formula: '\\tilde{\\varepsilon} = [0.1, -0.05] + [1.5, -1.125] = [1.6, -1.175]',
            explanation: 'The guided estimate is much larger in magnitude — it extrapolates far beyond the conditional distribution toward regions with high text adherence.',
          },
        ]}
      />

      <WarningBlock title="CFG Artifacts and Over-Saturation">
        <ul className="space-y-2 text-sm">
          <li><strong>Over-saturation at high w:</strong> Very high guidance (w&gt;15) causes over-saturated, hyper-realistic outputs with visual artifacts. The score extrapolation moves far from the data manifold. Dynamic thresholding (clipping x_0 predictions) mitigates this.</li>
          <li><strong>2× inference cost:</strong> CFG requires two forward passes per denoising step (conditional + unconditional). Techniques like Batch conditioning and SDS (Score Distillation Sampling) optimize this.</li>
          <li><strong>Null token sensitivity:</strong> The choice of null conditioning (zero vector, learned embedding, or empty text) affects the unconditional baseline quality. A learned null embedding generally outperforms a zero vector.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={CFG_CODE}
        language="python"
        title="Classifier-Free Guidance — DDPM Sampling with CFG"
        runnable
      />
    </div>
  );
}
