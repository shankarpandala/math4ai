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
// CAVI Convergence Animation — 2-factor mean field
// ---------------------------------------------------------------------------

function CAVIVisualizer() {
  const [iter, setIter] = useState(0);
  const MAX_ITER = 20;

  // Simulate CAVI on a 2D Gaussian with off-diagonal covariance
  // True posterior: N([1,1], [[1, 0.8],[0.8, 1]])
  // Mean field approximation: q(z1)q(z2) converges to correct marginals
  // CAVI update: mu1 = mu1_true + Sigma12/Sigma22 * (mu2_q - mu2_true)
  // (simplified simulation)

  const trueMu = [1, 1];
  const trueSig = [[1, 0.8], [0.8, 1]];

  // CAVI trajectory: starts at (mu1_q=0, mu2_q=0) alternating updates
  function caviTrajectory(nIter) {
    let mu1 = -1.5, mu2 = -2.0; // initial
    const pts = [{ mu1, mu2, step: 0 }];
    for (let i = 1; i <= nIter; i++) {
      if (i % 2 === 1) {
        // Update q(z1): mu1_new = E_{q(z2)}[z2] * Sigma12/Sigma11
        mu1 = trueMu[0] + (trueSig[0][1] / trueSig[1][1]) * (mu2 - trueMu[1]);
      } else {
        // Update q(z2): symmetric
        mu2 = trueMu[1] + (trueSig[1][0] / trueSig[0][0]) * (mu1 - trueMu[0]);
      }
      pts.push({ mu1, mu2, step: i });
    }
    return pts;
  }

  const trajectory = caviTrajectory(MAX_ITER);
  const current = trajectory[Math.min(iter, trajectory.length - 1)];
  const displayPts = trajectory.slice(0, Math.min(iter + 1, trajectory.length));

  const svgW = 400;
  const svgH = 300;
  const xMin = -2.5, xMax = 3.5, yMin = -2.5, yMax = 3.5;
  function tx(x) { return ((x - xMin) / (xMax - xMin)) * svgW; }
  function ty(y) { return svgH - ((y - yMin) / (yMax - yMin)) * svgH; }

  // Draw ellipses for the true posterior
  const ellipsePoints = Array.from({ length: 60 }, (_, i) => {
    const theta = (i / 59) * 2 * Math.PI;
    // 2-sigma ellipse: rotate by 45deg, eigenvalues 1.8, 0.2
    const ev1 = 1.8, ev2 = 0.2;
    const ex = ev1 * Math.cos(theta) * Math.cos(Math.PI / 4) - ev2 * Math.sin(theta) * Math.sin(Math.PI / 4) + trueMu[0];
    const ey = ev1 * Math.cos(theta) * Math.sin(Math.PI / 4) + ev2 * Math.sin(theta) * Math.cos(Math.PI / 4) + trueMu[1];
    return `${tx(ex).toFixed(1)},${ty(ey).toFixed(1)}`;
  }).join(' ');

  const ELBO_approx = -Math.sqrt((current.mu1 - trueMu[0]) ** 2 + (current.mu2 - trueMu[1]) ** 2);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        CAVI Convergence — 2-Factor Mean Field Approximation
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        CAVI alternately updates <InlineMath math="q(z_1)" /> and <InlineMath math="q(z_2)" />.
        The trajectory (orange path) zigzags toward the true posterior mean (★).
        The mean field approximation factorizes the correlated posterior.
      </p>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <button onClick={() => setIter(0)}
          className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800">Reset</button>
        <button onClick={() => setIter((s) => Math.min(s + 1, MAX_ITER))}
          className="rounded bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
          Step +1
        </button>
        <button onClick={() => setIter(MAX_ITER)}
          className="rounded bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">Run All</button>
        <span className="font-mono text-sm text-gray-500">Iter: {iter}</span>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* True posterior ellipse */}
          <polygon points={ellipsePoints} fill="#6366f1" fillOpacity={0.1} stroke="#6366f1" strokeWidth={1.5} />
          {/* Axes */}
          <line x1={tx(0)} y1={0} x2={tx(0)} y2={svgH} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={0} y1={ty(0)} x2={svgW} y2={ty(0)} stroke="#e5e7eb" strokeWidth={1} />
          {/* CAVI trajectory */}
          {displayPts.length > 1 && (
            <polyline
              points={displayPts.map((p) => `${tx(p.mu1).toFixed(1)},${ty(p.mu2).toFixed(1)}`).join(' ')}
              fill="none" stroke="#f97316" strokeWidth={2}
            />
          )}
          {/* Path dots */}
          {displayPts.map((p, i) => (
            <circle key={i} cx={tx(p.mu1)} cy={ty(p.mu2)} r={3.5}
              fill={i % 2 === 1 ? '#f97316' : '#fb923c'} opacity={0.7} />
          ))}
          {/* Current position */}
          <circle cx={tx(current.mu1)} cy={ty(current.mu2)} r={7}
            fill="#ef4444" stroke="white" strokeWidth={2} />
          {/* True mean */}
          <text x={tx(trueMu[0])} y={ty(trueMu[1]) - 8} textAnchor="middle" fontSize={16} fill="#22c55e">★</text>
          {/* MF ellipse (uncorrelated) */}
          <ellipse cx={tx(current.mu1)} cy={ty(current.mu2)}
            rx={0.9 * svgW / (xMax - xMin)} ry={0.9 * svgH / (yMax - yMin)}
            fill="none" stroke="#f97316" strokeWidth={1.5} strokeDasharray="5,3" />
          {/* Labels */}
          <text x={8} y={14} fontSize={9} fill="#6366f1">True posterior (correlated)</text>
          <text x={8} y={26} fontSize={9} fill="#f97316">MF approx q(z₁)q(z₂)</text>
          {/* Axis labels */}
          <text x={svgW - 20} y={ty(0) - 4} fontSize={9} fill="#9ca3af">z₁</text>
          <text x={tx(0) + 4} y={14} fontSize={9} fill="#9ca3af">z₂</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-orange-50 py-2 dark:bg-orange-900/20">
          <p className="text-xs text-gray-400">μ₁</p>
          <p className="font-mono font-bold text-orange-700 dark:text-orange-300">{current.mu1.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-orange-50 py-2 dark:bg-orange-900/20">
          <p className="text-xs text-gray-400">μ₂</p>
          <p className="font-mono font-bold text-orange-700 dark:text-orange-300">{current.mu2.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 py-2 dark:bg-indigo-900/20">
          <p className="text-xs text-gray-400">Distance to true</p>
          <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
            {Math.sqrt((current.mu1 - 1) ** 2 + (current.mu2 - 1) ** 2).toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const MEAN_FIELD_CODE = `import torch
import torch.nn as nn
import torch.distributions as dist

class MeanFieldVI(nn.Module):
    """
    Mean-field variational inference for a simple Gaussian model.
    q(z) = prod_i N(z_i; mu_i, sigma_i^2)  -- fully factorized
    """
    def __init__(self, dim):
        super().__init__()
        self.mu    = nn.Parameter(torch.zeros(dim))
        self.rho   = nn.Parameter(torch.zeros(dim))   # sigma = softplus(rho)

    @property
    def sigma(self):
        return torch.nn.functional.softplus(self.rho) + 1e-5

    def sample(self, n_samples=1):
        eps = torch.randn(n_samples, len(self.mu))
        return self.mu + self.sigma * eps

    def log_q(self, z):
        return dist.Normal(self.mu, self.sigma).log_prob(z).sum(-1)

    def elbo(self, log_joint_fn, n_samples=10):
        """
        ELBO = E_q[log p(x,z)] - E_q[log q(z)]
             = E_q[log p(x,z)] + H[q]
        """
        z = self.sample(n_samples)
        log_joint = log_joint_fn(z)       # log p(x, z)
        log_q     = self.log_q(z)
        return (log_joint - log_q).mean()


# -----------------------------------------------------------------------
# CAVI (Coordinate Ascent Variational Inference) for Gaussian-Gaussian model
# -----------------------------------------------------------------------
# Model: z ~ N(0, I),  x|z ~ N(z, sigma_n^2 I)
# True posterior: z|x ~ N((sigma_n^2/(1+sigma_n^2))*x, sigma_n^2/(1+sigma_n^2)*I)
# Mean-field approximation: q(z) = prod_i q(z_i)
# CAVI update: for Gaussian-Gaussian: converges in one step (exact)

def cavi_gaussian(x_obs, sigma_n=0.3, n_iter=20):
    d = len(x_obs)
    mu = torch.zeros(d)         # variational mean
    sigma2 = torch.ones(d)      # variational variance

    elbo_trace = []
    for t in range(n_iter):
        # CAVI update for diagonal Gaussian-Gaussian:
        # q*(z_i) = N(mu_i, sigma_i^2) where:
        # sigma_i^2 = 1 / (1 + 1/sigma_n^2)
        # mu_i = sigma_i^2 * (x_i / sigma_n^2)
        sigma2 = 1.0 / (1.0 + 1.0 / sigma_n**2) * torch.ones(d)
        mu     = sigma2 * (x_obs / sigma_n**2)

        # ELBO = -0.5*||x - mu||^2/sigma_n^2 + 0.5*sum(1 + log(sigma_i^2) - mu_i^2 - sigma_i^2)
        recon = -0.5 * ((x_obs - mu)**2 / sigma_n**2).sum()
        kl    = -0.5 * (1 + sigma2.log() - mu**2 - sigma2).sum()
        elbo  = recon - kl
        elbo_trace.append(elbo.item())

    return mu, sigma2, elbo_trace

x = torch.tensor([1.5, -0.8, 2.0])
mu_q, sigma2_q, trace = cavi_gaussian(x)
print(f"Posterior mean: {mu_q}")
print(f"Posterior var:  {sigma2_q}")
print(f"Final ELBO: {trace[-1]:.4f}")
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MeanFieldVI() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Mean Field Variational Inference
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Mean field VI approximates the posterior by a fully factorized distribution,
          then maximizes the ELBO using coordinate ascent (CAVI), alternately optimizing
          each factor while holding the others fixed.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Mean field theory originated in statistical physics (Curie-Weiss theory), where it
          approximates a system of interacting particles by independent particles in an
          effective field. In machine learning, it was formalized for graphical models by
          <strong> Jordan et al. (1999)</strong> and <strong>Wainwright & Jordan (2008)</strong>.
          The CAVI algorithm is equivalent to EM in many models and is the workhorse of
          Bayesian latent variable inference.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Mean Field Approximation"
        definition="The mean field family assumes the approximate posterior fully factorizes over a partition $\{z_1, \ldots, z_M\}$ of the latent variables: $q(z) = \prod_{j=1}^M q_j(z_j)$. The optimal factor $q_j^*(z_j)$ that maximizes the ELBO is: $\log q_j^*(z_j) = \mathbb{E}_{q_{-j}}[\log p(x, z)] + \mathrm{const}$ where $\mathbb{E}_{q_{-j}}[\cdot]$ denotes expectation over all factors except $j$."
        notation="The mean field approximation ignores all correlations between different latent variable groups. This is the main limitation: for posteriors with strong correlations (e.g., from a prior with off-diagonal covariance), the mean field approximation underestimates the variance and misses the correlation structure."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Coordinate Ascent Variational Inference (CAVI)"
        definition="CAVI iteratively updates each factor $q_j$ while keeping all others fixed: $q_j^{(t+1)}(z_j) \propto \exp\!\left(\mathbb{E}_{q_{-j}^{(t)}}[\log p(x, z)]\right)$. This is guaranteed to increase the ELBO monotonically at each step (each update is an exact maximization of ELBO over $q_j$), converging to a local optimum of the ELBO within the mean field family."
        notation="CAVI requires computing $\mathbb{E}_{q_{-j}}[\log p(x,z)]$ — tractable for models in the exponential family where the optimal factor is also in the exponential family (closed-form updates). For non-conjugate models, the expectation requires Monte Carlo (Black-Box VI)."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Natural Parameters and Exponential Family Updates"
        definition="For models where $p(z_j | z_{-j}, x)$ is in the exponential family with natural parameter $\eta_j(z_{-j}, x)$, the optimal mean field factor $q_j^* \propto \exp(\mathbb{E}_{q_{-j}}[\eta_j(z_{-j}, x)] \cdot t(z_j))$ is the same exponential family with natural parameter $\hat{\eta}_j = \mathbb{E}_{q_{-j}}[\eta_j(z_{-j}, x)]$. This enables closed-form CAVI updates."
        notation="Example: Gaussian-Gaussian model with $z \sim \mathcal{N}(0,I)$ and $x|z \sim \mathcal{N}(z, \sigma^2 I)$. The conditional $p(z_j|z_{-j},x) = \mathcal{N}(\sigma^{-2}x_j/(\sigma^{-2}+1), 1/(\sigma^{-2}+1))$ is Gaussian, so the optimal mean field factor is also Gaussian. CAVI converges in one step."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="CAVI Monotonically Increases the ELBO"
        statement="Each CAVI update $q_j \leftarrow q_j^*$ increases or maintains the ELBO: $\mathcal{L}(q_j^*, q_{-j}) \geq \mathcal{L}(q_j^{(t)}, q_{-j})$. Therefore, the ELBO sequence is monotonically non-decreasing and converges (since ELBO is bounded above by $\log p(x)$)."
        proof="The ELBO can be written as a function of $q_j$ alone: $\mathcal{L}(q_j) = \mathbb{E}_{q_j}[\mathbb{E}_{q_{-j}}[\log p(x,z)]] - \mathbb{E}_{q_j}[\log q_j(z_j)] + C$. This is exactly $-\mathrm{KL}(q_j \| q_j^*) + C'$ where $\log q_j^*(z_j) = \mathbb{E}_{q_{-j}}[\log p(x,z)] + \mathrm{const}$. Since $\mathrm{KL} \geq 0$ with equality iff $q_j = q_j^*$, setting $q_j = q_j^*$ maximizes $\mathcal{L}$ over $q_j$. Thus each update increases the ELBO. Since ELBO $\leq \log p(x)$, the sequence converges. $\square$"
        corollaries={[
          "CAVI converges to a local (not global) maximum of the ELBO. Multiple random initializations may be needed.",
          "Convergence does not imply the approximation is good — the mean field family may not contain the true posterior, leaving an irreducible approximation error.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Mean Field Underestimates Posterior Variance"
        statement="For any distribution $p(z)$ with the true posterior mean $\mathbb{E}_p[z_j]$ and variance $\mathrm{Var}_p(z_j)$, the mean field approximation $q(z) = \prod_j q_j(z_j)$ that minimizes $\mathrm{KL}(q\|p)$ satisfies: (i) $\mathbb{E}_q[z_j] = \mathbb{E}_p[z_j]$ (correct means); (ii) $\mathrm{Var}_q(z_j) \leq \mathrm{Var}_p(z_j)$ (underestimates variances)."
        proof="(i) The mean field optimality condition gives $\mathbb{E}_q[z_j] = \mathbb{E}_p[z_j|z_{-j}]\big|_{z_{-j}=\mathbb{E}_q[z_{-j}]}$, which by Jensen's inequality for linear functions gives the true marginal mean. (ii) By the law of total variance: $\mathrm{Var}_p(z_j) = \mathbb{E}_{p(z_{-j})}[\mathrm{Var}(z_j|z_{-j})] + \mathrm{Var}_{p(z_{-j})}(\mathbb{E}[z_j|z_{-j}])$. The mean field $q_j$ captures the first term (expected conditional variance) but not the second (variance of the conditional mean across $z_{-j}$). $\square$"
        corollaries={[
          "Mean field VI produces overconfident posteriors — it systematically underestimates uncertainty. This is critical for risk-sensitive applications.",
          "Posterior variance underestimation can lead to wrong decisions in Bayesian optimization or active learning, where uncertainty drives exploration.",
        ]}
      />

      <CAVIVisualizer />

      <ExampleBlock
        title="CAVI for Bayesian Gaussian Mixture Model"
        problem="A 1D Gaussian mixture with $K=2$ components, known weights $\pi_1=\pi_2=0.5$, known variance $\sigma^2=1$, and unknown means $\mu_k \sim \mathcal{N}(0, 10)$. Data: $x_n \sim \sum_k \pi_k \mathcal{N}(\mu_k, 1)$. Write the CAVI update for the cluster assignment $r_{nk} = q(c_n = k)$."
        difficulty="advanced"
        solution={[
          {
            step: 'Optimal cluster assignment (E-step analogue)',
            formula: 'r_{nk} = q(c_n = k) \\propto \\exp\\!\\left(\\mathbb{E}_q\\!\\left[\\log\\mathcal{N}(x_n; \\mu_k, 1)\\right] + \\log\\pi_k\\right)',
            explanation: 'The optimal q(c_n) is proportional to the exponentiated expected log-likelihood.',
          },
          {
            step: 'Expected log-likelihood under q(μ_k)',
            formula: '\\mathbb{E}_q[\\log\\mathcal{N}(x_n;\\mu_k,1)] = -\\frac{1}{2}\\big((x_n - \\mathbb{E}_q[\\mu_k])^2 + \\mathrm{Var}_q(\\mu_k)\\big)',
            explanation: 'Using E[μ²] = Var(μ) + E[μ]², the expected quadratic term includes the variational variance.',
          },
          {
            step: 'Optimal mean update (M-step analogue)',
            formula: 'q^*(\\mu_k) = \\mathcal{N}(m_k, s_k^2), \\quad s_k^2 = \\frac{1}{1/10 + N_k}, \\quad m_k = s_k^2 \\sum_n r_{nk} x_n',
            explanation: 'N_k = Σ_n r_{nk} is the effective number of points in cluster k. Conjugate Gaussian update.',
          },
          {
            step: 'Iterate until ELBO converges',
            explanation: 'Alternately update r_{nk} (cluster responsibilities) and (m_k, s_k²) (mean parameters). This is exactly EM for Gaussian mixtures with mean field posterior.',
          },
        ]}
      />

      <WarningBlock title="Mean Field VI Failure Modes">
        <ul className="space-y-2 text-sm">
          <li><strong>Correlation blindness:</strong> Mean field cannot capture bimodality due to a single mode or posterior correlations. For multimodal posteriors with separated modes, CAVI will collapse to one mode.</li>
          <li><strong>KL direction:</strong> VI minimizes KL(q||p) (forward KL), not KL(p||q) (reverse KL). Forward KL is zero-forcing (q avoids regions where p=0) and mode-seeking — q concentrates on one mode of a multimodal p. Expectation Propagation minimizes reverse KL (moment matching, more spread out).</li>
          <li><strong>Scaling issues:</strong> CAVI on graphical models scales poorly with the number of latent variables when dependencies are dense. Stochastic VI uses mini-batch gradient estimates to scale to large datasets.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={MEAN_FIELD_CODE}
        language="python"
        title="Mean Field VI and CAVI — PyTorch"
        runnable
      />
    </div>
  );
}
