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
// Variance Estimator Comparison Visualizer
// ---------------------------------------------------------------------------

function VarianceComparison() {
  const [nSamples, setNSamples] = useState(10);
  const [seed, setSeed] = useState(42);
  const [showPathwise, setShowPathwise] = useState(true);

  // Simulate variance of score function vs pathwise estimator
  // True gradient: E_q[grad_phi f(z, phi)]
  // Score function: high variance (~10x)
  // Pathwise: low variance (~1x)

  function lcg(s) {
    let state = s >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) & 0xffffffff;
      return (state >>> 0) / 0xffffffff;
    };
  }

  function boxMuller(rng) {
    const u1 = rng(), u2 = rng();
    return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-12))) * Math.cos(2 * Math.PI * u2);
  }

  // Simulate estimates for multiple "experiments"
  const N_EXPERIMENTS = 30;
  const trueGradient = 1.0;

  function simulateEstimates(type, n, seedBase) {
    const rng = lcg(seedBase * 1337 + 7);
    return Array.from({ length: N_EXPERIMENTS }, () => {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const eps = boxMuller(rng);
        if (type === 'score') {
          // Score function: f(z) * grad_phi log q(z)
          // f(z) = (z + mu)^2, grad_phi log q = (z - mu)/sigma^2
          // High variance because f can be large
          const z = eps + 1.0; // mu=1
          const f = (z - 1.2) ** 2; // some objective
          const score = eps; // grad_phi log q = (z-mu)/sigma^2 * sigma = eps for N(mu,1)
          sum += f * score;
        } else {
          // Pathwise: grad_phi E[f(mu + sigma*eps)] = grad_phi f at mu+eps
          // Low variance because we differentiate through smooth f
          const z = eps + 1.0;
          const pathGrad = 2 * (z - 1.2); // df/dmu = 2*(z-1.2)
          sum += pathGrad;
        }
      }
      return sum / n;
    });
  }

  const scoreEstimates = simulateEstimates('score', nSamples, seed);
  const pathwiseEstimates = simulateEstimates('pathwise', nSamples, seed);

  const scoreMean = scoreEstimates.reduce((a, b) => a + b, 0) / N_EXPERIMENTS;
  const scoreVar = scoreEstimates.reduce((a, b) => a + (b - scoreMean) ** 2, 0) / N_EXPERIMENTS;
  const pathMean = pathwiseEstimates.reduce((a, b) => a + b, 0) / N_EXPERIMENTS;
  const pathVar = pathwiseEstimates.reduce((a, b) => a + (b - pathMean) ** 2, 0) / N_EXPERIMENTS;

  const svgW = 460;
  const svgH = 180;
  const padL = 12, padR = 12, padT = 20, padB = 25;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allVals = [...scoreEstimates, ...pathwiseEstimates, trueGradient];
  const vMin = Math.min(...allVals) - 0.5;
  const vMax = Math.max(...allVals) + 0.5;

  function tx(i) { return padL + (i / (N_EXPERIMENTS - 1)) * plotW; }
  function ty(v) { return padT + (1 - (v - vMin) / (vMax - vMin)) * plotH; }

  const trueY = ty(trueGradient);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Gradient Estimator Variance Comparison
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        30 independent gradient estimates. Score function (REINFORCE) has high variance;
        pathwise (reparameterization) is much tighter around the true gradient.
      </p>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">Samples n</label>
          <input type="range" min={1} max={100} step={1} value={nSamples}
            onChange={(e) => setNSamples(parseInt(e.target.value))}
            className="h-2 flex-1 accent-blue-500" />
          <span className="w-10 text-right font-mono text-sm font-bold text-blue-600">{nSamples}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSeed((s) => s + 1)}
            className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600">New samples</button>
          <button onClick={() => setShowPathwise((v) => !v)}
            className={`rounded px-3 py-1 text-sm ${showPathwise ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            {showPathwise ? 'Hide' : 'Show'} pathwise
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* True gradient line */}
          <line x1={padL} y1={trueY} x2={padL + plotW} y2={trueY}
            stroke="#6b7280" strokeWidth={1.5} strokeDasharray="6,3" />
          <text x={padL + plotW} y={trueY - 4} textAnchor="end" fontSize={9} fill="#6b7280">true grad</text>
          {/* Score function estimates */}
          {scoreEstimates.map((v, i) => (
            <circle key={i} cx={tx(i)} cy={ty(v)} r={3.5} fill="#ef4444" opacity={0.7} />
          ))}
          {/* Pathwise estimates */}
          {showPathwise && pathwiseEstimates.map((v, i) => (
            <circle key={i} cx={tx(i) + 4} cy={ty(v)} r={3.5} fill="#10b981" opacity={0.7} />
          ))}
          {/* Labels */}
          <circle cx={padL + 10} cy={padT + 10} r={4} fill="#ef4444" />
          <text x={padL + 18} y={padT + 14} fontSize={9} fill="#ef4444" fontWeight="bold">Score function (REINFORCE)</text>
          {showPathwise && (
            <>
              <circle cx={padL + 180} cy={padT + 10} r={4} fill="#10b981" />
              <text x={padL + 188} y={padT + 14} fontSize={9} fill="#10b981" fontWeight="bold">Pathwise (reparam)</text>
            </>
          )}
          {/* X axis */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">Experiment index</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-xs font-semibold text-red-500">Score Function (REINFORCE)</p>
          <p className="font-mono text-sm text-red-700 dark:text-red-300">Mean: {scoreMean.toFixed(3)}</p>
          <p className="font-mono text-sm text-red-700 dark:text-red-300">Variance: {scoreVar.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
          <p className="text-xs font-semibold text-emerald-500">Pathwise (Reparameterization)</p>
          <p className="font-mono text-sm text-emerald-700 dark:text-emerald-300">Mean: {pathMean.toFixed(3)}</p>
          <p className="font-mono text-sm text-emerald-700 dark:text-emerald-300">Variance: {pathVar.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const BBVI_CODE = `import torch
import torch.distributions as D

class BBVI:
    """
    Black-Box Variational Inference with score function and pathwise gradients.
    Supports non-conjugate models where CAVI does not apply.
    """
    def __init__(self, mu_init=0.0, log_sigma_init=0.0):
        self.mu        = torch.tensor(mu_init,        requires_grad=True)
        self.log_sigma = torch.tensor(log_sigma_init, requires_grad=True)

    @property
    def sigma(self):
        return torch.exp(self.log_sigma)

    # --- Score Function Estimator (REINFORCE) ---
    def score_function_elbo(self, log_joint_fn, n_samples=100):
        """
        ELBO gradient via score function (log-derivative trick):
        grad_phi ELBO = E_q[ (log p(z,x) - log q(z)) * grad_phi log q(z) ]
        Works for any model (discrete or continuous latents).
        High variance — requires baselines/control variates.
        """
        q = D.Normal(self.mu, self.sigma)
        z = q.sample((n_samples,))
        log_q = q.log_prob(z)
        log_p = log_joint_fn(z)
        f     = (log_p - log_q).detach()   # detach for score function trick
        # score function estimator: f * grad log q
        loss  = -(f * log_q).mean()        # negate for minimization
        return loss

    # --- Pathwise (Reparameterization) Estimator ---
    def pathwise_elbo(self, log_joint_fn, n_samples=100):
        """
        ELBO gradient via reparameterization:
        grad_phi E_q[f(z)] = E_{eps~N(0,1)}[ grad_phi f(mu + sigma*eps) ]
        Low variance — gradients flow through the sampled z.
        Requires differentiable f (continuous latents only).
        """
        eps = torch.randn(n_samples)
        z   = self.mu + self.sigma * eps    # reparameterized sample
        q   = D.Normal(self.mu, self.sigma)
        log_q = q.log_prob(z)
        log_p = log_joint_fn(z)
        elbo  = (log_p - log_q).mean()
        return -elbo  # negate for minimization


# Example: fit variational posterior for p(z|x) = N(z; x, 1), x=2.5
def log_joint(z, x_obs=2.5, prior_std=5.0):
    log_prior    = D.Normal(0, prior_std).log_prob(z)
    log_likelihood = D.Normal(z, 1.0).log_prob(x_obs)
    return log_prior + log_likelihood

bbvi = BBVI(mu_init=0.0, log_sigma_init=0.0)
opt  = torch.optim.Adam([bbvi.mu, bbvi.log_sigma], lr=0.05)

for step in range(200):
    loss = bbvi.pathwise_elbo(log_joint, n_samples=50)
    opt.zero_grad(); loss.backward(); opt.step()

print(f"Fitted mu={bbvi.mu.item():.4f}, sigma={bbvi.sigma.item():.4f}")
print(f"True posterior: mu={2.5/(1+1/25):.4f}, sigma={1/torch.sqrt(1+25*torch.tensor(1.0)):.4f}")
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function BBVI() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Black-Box Variational Inference
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          BBVI enables variational inference in non-conjugate models where CAVI updates
          are intractable, using Monte Carlo estimates of the ELBO gradient via the
          score function estimator (REINFORCE) or pathwise (reparameterization) gradients.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          <strong>Ranganath et al. (2014)</strong> introduced BBVI, showing that the ELBO
          gradient can be estimated using only samples from the variational distribution,
          without model-specific derivations. This "black-box" approach enabled VI for
          arbitrary probabilistic programs. <strong>Kucukelbir et al. (2017)</strong>
          implemented it in Stan (ADVI), making VI accessible to applied scientists.
          The pathwise gradient approach (reparameterization trick) for BBVI was
          developed simultaneously with VAEs.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Score Function (REINFORCE) Gradient Estimator"
        definition="The score function gradient of the ELBO w.r.t. variational parameters $\phi$ is: $\nabla_\phi \mathcal{L} = \mathbb{E}_{q_\phi(z)}\!\left[(\log p(x,z) - \log q_\phi(z))\,\nabla_\phi \log q_\phi(z)\right]$ estimated by Monte Carlo: $\hat{g}_\mathrm{SF} = \frac{1}{S}\sum_{s=1}^S (\log p(x,z^{(s)}) - \log q_\phi(z^{(s)}))\,\nabla_\phi \log q_\phi(z^{(s)})$ where $z^{(s)} \sim q_\phi$. This uses the identity $\nabla_\phi \mathbb{E}_{q_\phi}[f] = \mathbb{E}_{q_\phi}[f \nabla_\phi \log q_\phi]$."
        notation="Also called REINFORCE (Williams, 1992) or the log-derivative trick. Works for any $q_\phi$ (including discrete distributions). Key disadvantage: high variance, requiring large $S$ or variance reduction techniques (control variates, baselines)."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Pathwise (Reparameterization) Gradient Estimator"
        definition="For distributions $q_\phi(z)$ admitting a reparameterization $z = g_\phi(\varepsilon)$ with $\varepsilon \sim p(\varepsilon)$ (parameter-free), the pathwise gradient is: $\nabla_\phi \mathcal{L} = \mathbb{E}_{p(\varepsilon)}\!\left[\nabla_\phi (\log p(x, g_\phi(\varepsilon)) - \log q_\phi(g_\phi(\varepsilon)))\right]$ estimated as $\hat{g}_\mathrm{PW} = \frac{1}{S}\sum_{s=1}^S \nabla_\phi (\log p(x,z^{(s)}) - \log q_\phi(z^{(s)}))$ where $z^{(s)} = g_\phi(\varepsilon^{(s)})$, $\varepsilon^{(s)} \sim p(\varepsilon)$."
        notation="For $q_\phi(z) = \mathcal{N}(z;\mu,\sigma^2)$: $g_\phi(\varepsilon) = \mu + \sigma\varepsilon$ with $\varepsilon \sim \mathcal{N}(0,1)$. Gradients flow through $g_\phi$ — requires differentiable $\log p(x,z)$ w.r.t. $z$ (not applicable to discrete $z$)."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Control Variates for Variance Reduction"
        definition="A control variate is a known-mean random variable $c(z)$ with $\mathbb{E}[c(z)] = 0$ added to reduce variance: $\hat{g}_\mathrm{CV} = \frac{1}{S}\sum_s (f(z^{(s)}) - \alpha\, c(z^{(s)}))\,\nabla_\phi \log q_\phi(z^{(s)})$ where the optimal coefficient is $\alpha^* = \mathrm{Cov}(f \cdot \nabla \log q,\, c \cdot \nabla \log q) / \mathrm{Var}(c \cdot \nabla \log q)$. A common baseline: $b = \mathbb{E}_{q}[\log p(x,z) - \log q_\phi(z)]$ (the ELBO itself, estimated from previous samples)."
        notation="Rao-Blackwellization (integrating out some variables analytically) further reduces variance. In practice, the baseline is estimated from a moving average of past ELBO values."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="REINFORCE is Unbiased; Pathwise is Unbiased with Lower Variance"
        statement="Both the score function and pathwise gradient estimators are unbiased: $\mathbb{E}[\hat{g}_\mathrm{SF}] = \mathbb{E}[\hat{g}_\mathrm{PW}] = \nabla_\phi \mathcal{L}$. For smooth $f = \log p(x,z) - \log q_\phi(z)$, the pathwise estimator has strictly lower variance: $\mathrm{Var}[\hat{g}_\mathrm{PW}] \leq \mathrm{Var}[\hat{g}_\mathrm{SF}]$."
        proof="Unbiasedness of SF: $\mathbb{E}[f \nabla_\phi \log q_\phi] = \int f(z)\nabla_\phi q_\phi(z)\,dz = \nabla_\phi \int f(z) q_\phi(z)\,dz = \nabla_\phi \mathcal{L}$ (valid when $\nabla_\phi$ and $\int$ commute, e.g., dominated convergence). Unbiasedness of PW: by chain rule under the integral. Variance comparison: PW removes a term from the variance. Specifically, $\hat{g}_\mathrm{SF} = f(z)\nabla_\phi \log q_\phi(z) = \nabla_\phi \log q_\phi(z) \cdot f(z)$; if $f$ varies a lot (large range), the product has high variance. PW computes $\nabla_z f \cdot \nabla_\phi g_\phi(\varepsilon)$ — a smoother function of $\varepsilon$ when $f$ is smooth. Empirically, the variance reduction is 10×–100×. $\square$"
        corollaries={[
          "With S=1 sample, the pathwise estimator is often sufficient for stable training; the score function estimator typically needs S≥100 or strong baselines.",
          "Mixing both estimators (Stein control variates, RELAX) can achieve lower variance than either alone for non-reparameterizable distributions.",
        ]}
      />

      <VarianceComparison />

      <ExampleBlock
        title="BBVI for Logistic Regression (Non-Conjugate)"
        problem="Binary classification with logistic likelihood $p(y_n=1|x_n, w) = \sigma(w^Tx_n)$ and Gaussian prior $w \sim \mathcal{N}(0, I)$. The posterior $p(w|X,y)$ has no closed form. Apply BBVI with pathwise gradients."
        difficulty="research"
        solution={[
          {
            step: 'Set variational family: q(w) = N(μ, diag(σ²))',
            explanation: 'Mean field Gaussian over weights. Parameters φ = (μ, log σ) learned by BBVI. Dimension matches weight vector w ∈ R^d.',
          },
          {
            step: 'Reparameterize: w = μ + σ ⊙ ε, ε ~ N(0,I)',
            explanation: 'This makes the sample differentiable w.r.t. (μ, σ). BBVI then uses backprop through the log-likelihood.',
          },
          {
            step: 'ELBO and its gradient',
            formula: '\\mathcal{L}(\\phi) = \\mathbb{E}_\\varepsilon\\!\\left[\\sum_n \\log p(y_n|\\mu+\\sigma\\varepsilon, x_n)\\right] - \\mathrm{KL}(q\\|\\mathcal{N}(0,I))',
            explanation: 'KL is analytic (Gaussian-Gaussian). The likelihood term is estimated with S=1-10 samples and backpropagated.',
          },
          {
            step: 'Gradient computation',
            formula: '\\nabla_\\mu \\mathcal{L} \\approx \\frac{1}{S}\\sum_s \\nabla_\\mu \\log p(y|\\mu+\\sigma\\varepsilon^{(s)}, X) - \\mu',
            explanation: 'Gradients flow through the logistic likelihood via backprop. The analytic KL gradient is -μ.',
          },
        ]}
      />

      <WarningBlock title="BBVI Practical Challenges">
        <ul className="space-y-2 text-sm">
          <li><strong>Score function high variance:</strong> REINFORCE is notoriously high-variance without careful baseline design. Antithetic sampling, control variates, and Rao-Blackwellization are essential for discrete latent models (e.g., NLP with discrete tokens).</li>
          <li><strong>Gradient explosion in pathwise:</strong> The pathwise gradient can explode when $\log p(x,z)$ has large second derivatives (e.g., near the boundary of support). Gradient clipping and careful initialization of σ are important.</li>
          <li><strong>Non-reparameterizable distributions:</strong> Discrete distributions (Bernoulli, Categorical) cannot be reparameterized. Straight-through estimator, Gumbel-softmax, and RELAX provide alternatives with different bias-variance tradeoffs.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={BBVI_CODE}
        language="python"
        title="Black-Box VI — Score Function and Pathwise Gradient Estimators"
        runnable
      />
    </div>
  );
}
