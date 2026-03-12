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
// Leapfrog Trajectory Visualizer
// ---------------------------------------------------------------------------

function HMCVisualizer() {
  const [L, setL] = useState(10);      // number of leapfrog steps
  const [eps, setEps] = useState(0.3); // step size
  const [seed, setSeed] = useState(1);

  // Target: 2D Gaussian N([0,0], [[1, 0.7],[0.7, 1]])
  // U(q) = -log p(q) = 0.5 * q^T Sigma^{-1} q
  // grad_q U = Sigma^{-1} q
  const SigInv = [[1 / (1 - 0.49), -0.7 / (1 - 0.49)], [-0.7 / (1 - 0.49), 1 / (1 - 0.49)]];

  function gradU(q) {
    return [
      SigInv[0][0] * q[0] + SigInv[0][1] * q[1],
      SigInv[1][0] * q[0] + SigInv[1][1] * q[1],
    ];
  }

  function H(q, p) {
    const U = 0.5 * (SigInv[0][0] * q[0] ** 2 + 2 * SigInv[0][1] * q[0] * q[1] + SigInv[1][1] * q[1] ** 2);
    const K = 0.5 * (p[0] ** 2 + p[1] ** 2);
    return U + K;
  }

  // Seeded RNG
  function lcg(s) {
    let state = (s * 1103515245 + 12345) & 0x7fffffff;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  function boxMuller(rng) {
    const u1 = rng(), u2 = rng();
    return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
  }

  // Initial position
  const rng = lcg(seed + 100);
  const q0 = [boxMuller(rng) * 0.5 + 0.8, boxMuller(rng) * 0.5 - 0.5];

  // Sample momentum
  const p0 = [boxMuller(rng), boxMuller(rng)];

  // Leapfrog
  function leapfrog(q_init, p_init, nSteps, stepSize) {
    const traj = [{ q: [...q_init], p: [...p_init] }];
    let q = [...q_init];
    let p = [...p_init];
    const g = gradU(q);
    p[0] -= 0.5 * stepSize * g[0];
    p[1] -= 0.5 * stepSize * g[1];
    for (let i = 0; i < nSteps; i++) {
      q[0] += stepSize * p[0];
      q[1] += stepSize * p[1];
      const gNew = gradU(q);
      if (i < nSteps - 1) {
        p[0] -= stepSize * gNew[0];
        p[1] -= stepSize * gNew[1];
      } else {
        p[0] -= 0.5 * stepSize * gNew[0];
        p[1] -= 0.5 * stepSize * gNew[1];
      }
      traj.push({ q: [...q], p: [...p] });
    }
    return { traj, qProp: q, pProp: p };
  }

  const { traj, qProp, pProp } = leapfrog(q0, p0, L, eps);
  const H0 = H(q0, p0);
  const H1 = H(qProp, pProp);
  const acceptProb = Math.min(1, Math.exp(H0 - H1));

  const svgW = 400, svgH = 300;
  const xMin = -2.5, xMax = 2.5, yMin = -2.5, yMax = 2.5;
  function tx(x) { return ((x - xMin) / (xMax - xMin)) * svgW; }
  function ty(y) { return svgH - ((y - yMin) / (yMax - yMin)) * svgH; }

  // Target density ellipse
  const ellipsePts = Array.from({ length: 60 }, (_, i) => {
    const theta = (i / 59) * 2 * Math.PI;
    const x = 1.25 * Math.cos(theta) * Math.cos(Math.PI / 4) - 0.4 * Math.sin(theta) * Math.sin(Math.PI / 4);
    const y = 1.25 * Math.cos(theta) * Math.sin(Math.PI / 4) + 0.4 * Math.sin(theta) * Math.cos(Math.PI / 4);
    return `${tx(x).toFixed(1)},${ty(y).toFixed(1)}`;
  }).join(' ');

  const trajPoints = traj.map((pt) => `${tx(pt.q[0]).toFixed(1)},${ty(pt.q[1]).toFixed(1)}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        HMC Leapfrog Trajectory Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The leapfrog integrator simulates Hamiltonian dynamics on the target distribution (ellipse).
        The proposal follows the trajectory; acceptance rate is <InlineMath math="\min(1, e^{-\Delta H})" />.
      </p>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">Steps L</label>
          <input type="range" min={1} max={30} step={1} value={L}
            onChange={(e) => setL(parseInt(e.target.value))}
            className="h-2 flex-1 accent-teal-500" />
          <span className="w-8 font-mono text-sm font-bold text-teal-600">{L}</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">Step size ε</label>
          <input type="range" min={0.05} max={1.0} step={0.05} value={eps}
            onChange={(e) => setEps(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-teal-500" />
          <span className="w-10 font-mono text-sm font-bold text-teal-600">{eps.toFixed(2)}</span>
        </div>
        <button onClick={() => setSeed((s) => s + 1)}
          className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600">New trajectory</button>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Target density */}
          <polygon points={ellipsePts} fill="#6366f1" fillOpacity={0.1} stroke="#6366f1" strokeWidth={1.5} />
          {/* Axes */}
          <line x1={tx(0)} y1={0} x2={tx(0)} y2={svgH} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={0} y1={ty(0)} x2={svgW} y2={ty(0)} stroke="#e5e7eb" strokeWidth={1} />
          {/* Trajectory */}
          <polyline points={trajPoints} fill="none" stroke="#0891b2" strokeWidth={2} />
          {/* Intermediate points */}
          {traj.map((pt, i) => (
            <circle key={i} cx={tx(pt.q[0])} cy={ty(pt.q[1])} r={2.5}
              fill="#0891b2" opacity={0.5} />
          ))}
          {/* Start */}
          <circle cx={tx(q0[0])} cy={ty(q0[1])} r={6} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
          <text x={tx(q0[0]) + 8} y={ty(q0[1]) - 4} fontSize={9} fill="#3b82f6">q₀</text>
          {/* Proposal */}
          <circle cx={tx(qProp[0])} cy={ty(qProp[1])} r={6}
            fill={acceptProb > 0.5 ? '#22c55e' : '#ef4444'}
            stroke="white" strokeWidth={1.5} />
          <text x={tx(qProp[0]) + 8} y={ty(qProp[1]) - 4} fontSize={9}
            fill={acceptProb > 0.5 ? '#22c55e' : '#ef4444'}>q*</text>
          {/* Momentum arrow */}
          <line x1={tx(q0[0])} y1={ty(q0[1])}
            x2={tx(q0[0] + p0[0] * 0.25)} y2={ty(q0[1] + p0[1] * 0.25)}
            stroke="#f59e0b" strokeWidth={2} />
          <text x={8} y={14} fontSize={9} fill="#3b82f6">q₀ (start)</text>
          <text x={8} y={26} fontSize={9} fill={acceptProb > 0.5 ? '#22c55e' : '#ef4444'}>q* (proposal)</text>
          <text x={8} y={38} fontSize={9} fill="#0891b2">leapfrog path</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-gray-50 py-2 dark:bg-gray-800">
          <p className="text-xs text-gray-400">H(q₀,p₀)</p>
          <p className="font-mono font-bold text-gray-700 dark:text-gray-300">{H0.toFixed(3)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 py-2 dark:bg-gray-800">
          <p className="text-xs text-gray-400">H(q*,p*)</p>
          <p className="font-mono font-bold text-gray-700 dark:text-gray-300">{H1.toFixed(3)}</p>
        </div>
        <div className={`rounded-lg py-2 ${acceptProb > 0.8 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className="text-xs text-gray-400">Accept prob</p>
          <p className={`font-mono font-bold ${acceptProb > 0.8 ? 'text-green-700' : 'text-red-600'}`}>
            {(acceptProb * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const HMC_CODE = `import torch
import torch.distributions as D

def hmc_sampler(log_prob_fn, q_init, n_samples=1000, L=20, eps=0.1, n_warmup=200):
    """
    Hamiltonian Monte Carlo sampler.
    Args:
        log_prob_fn: callable, returns log p(q) and gradient
        q_init: initial position (torch.Tensor, requires_grad=False)
        L: number of leapfrog steps
        eps: step size
    """
    def U(q):
        return -log_prob_fn(q)

    def grad_U(q):
        q_var = q.clone().requires_grad_(True)
        u = U(q_var)
        u.backward()
        return q_var.grad.detach()

    samples = []
    q = q_init.clone()
    n_accept = 0

    for i in range(n_samples + n_warmup):
        # Sample momentum p ~ N(0, I)
        p = torch.randn_like(q)

        # Current Hamiltonian
        H_curr = U(q) + 0.5 * (p ** 2).sum()

        # Leapfrog integration
        q_prop = q.clone()
        p_prop = p.clone()

        p_prop -= 0.5 * eps * grad_U(q_prop)          # half step momentum
        for _ in range(L):
            q_prop += eps * p_prop                      # full step position
            if _ < L - 1:
                p_prop -= eps * grad_U(q_prop)          # full step momentum
        p_prop -= 0.5 * eps * grad_U(q_prop)           # half step momentum

        # Metropolis acceptance
        H_prop = U(q_prop) + 0.5 * (p_prop ** 2).sum()
        log_alpha = H_curr - H_prop   # H_curr - H_prop = log(exp(-H_prop)/exp(-H_curr))

        if torch.log(torch.rand(1)) < log_alpha:
            q = q_prop.clone()
            n_accept += 1

        if i >= n_warmup:
            samples.append(q.clone())

    accept_rate = n_accept / (n_samples + n_warmup)
    print(f"Acceptance rate: {accept_rate:.3f}")
    return torch.stack(samples)


# Example: sample from correlated 2D Gaussian
def log_prob_2d_gaussian(q, rho=0.7):
    cov = torch.tensor([[1., rho], [rho, 1.]])
    dist = D.MultivariateNormal(torch.zeros(2), cov)
    return dist.log_prob(q)

samples = hmc_sampler(log_prob_2d_gaussian, q_init=torch.zeros(2),
                      n_samples=1000, L=20, eps=0.15)
print(f"Sample mean: {samples.mean(0)}")
print(f"Sample cov:\n{torch.cov(samples.T)}")
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function HamiltonianMC() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Hamiltonian Monte Carlo
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          HMC uses Hamiltonian dynamics to make distant proposals that are accepted with
          high probability, avoiding the random walk behavior of simpler MCMC methods.
          NUTS automatically tunes the trajectory length.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          HMC was introduced by <strong>Duane et al. (1987)</strong> in lattice field theory
          and popularized for Bayesian statistics by <strong>Neal (2011)</strong>. The
          No-U-Turn Sampler (<strong>Hoffman & Gelman, 2014</strong>) eliminates the
          need to hand-tune the trajectory length L by automatically terminating when
          the trajectory turns around — the key advance enabling Stan's automatic inference.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Hamiltonian Mechanics in MCMC"
        definition="HMC augments the target distribution $p(q) \propto e^{-U(q)}$ with auxiliary momentum variables $p \sim \mathcal{N}(0, M)$ (mass matrix $M$), defining the Hamiltonian $H(q,p) = U(q) + K(p)$ where $U(q) = -\log p(q)$ (potential energy) and $K(p) = \frac{1}{2}p^T M^{-1} p$ (kinetic energy). Hamilton's equations $\dot{q} = \frac{\partial H}{\partial p}$, $\dot{p} = -\frac{\partial H}{\partial q}$ define a trajectory that conserves $H$ exactly, meaning proposals far from the current point can still be accepted."
        notation="The augmented distribution $p(q,p) \propto e^{-H(q,p)} = p(q)p(p)$ is the joint target. Marginalizing over $p$ recovers the original $p(q)$. The key advantage: Hamiltonian trajectories travel along level sets of $H$, making long-range proposals with near-unit acceptance probability."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Leapfrog Integrator"
        definition="The leapfrog scheme numerically integrates Hamilton's equations with step size $\varepsilon$ and $L$ steps: (1) half-step momentum: $p \leftarrow p - \frac{\varepsilon}{2}\nabla_q U(q)$; (2) for $\ell = 1,\ldots,L$: full position step $q \leftarrow q + \varepsilon M^{-1} p$, then full momentum step (or half-step at the last iteration). The leapfrog is symplectic (volume-preserving), time-reversible, and has global error $O(\varepsilon^2)$ — making it ideal for Hamiltonian simulation."
        notation="Volume preservation (symplecticity) ensures that the Metropolis accept-reject step maintains detailed balance. Time reversibility is needed for the proposal to satisfy detailed balance. Both properties fail for non-symplectic integrators (e.g., Euler), causing biased sampling."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="No-U-Turn Sampler (NUTS)"
        definition="NUTS automatically selects the trajectory length $L$ by stopping when the trajectory starts to 'turn around': when the inner product $\langle q' - q, p' \rangle \leq 0$ (the trajectory is no longer moving away from the starting point). This eliminates the hand-tuning of $L$ while achieving efficiency comparable to optimally-tuned HMC. NUTS is implemented in Stan, PyMC, and Pyro."
        notation="NUTS builds a binary tree of candidate positions via the leapfrog integrator, doubling the trajectory at each tree level. The U-turn criterion is applied to the entire subtree. The No-U-Turn condition prevents the trajectory from retracing its steps, ensuring each step is maximally informative."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="HMC Detailed Balance and Correctness"
        statement="The HMC algorithm produces a Markov chain with stationary distribution $p(q) \propto e^{-U(q)}$. This follows from: (i) the leapfrog proposal preserves the Hamiltonian $H$ approximately (exactly for exact integration), so the Metropolis acceptance probability $\min(1, e^{H(q,p) - H(q',p')}) \approx 1$; (ii) detailed balance holds because the leapfrog is volume-preserving (symplectic) and time-reversible."
        proof="(i) Volume preservation: the Jacobian of the leapfrog map equals 1 (symplecticity), so the proposal density $T(q',p'|q,p) = T(q,p|q',p')$ (time-reversal symmetry). (ii) Metropolis-Hastings detailed balance: $p(q,p)T(q,p|q',p')\min(1, e^{H(q,p)-H(q',p')}) = p(q',p')T(q',p'|q,p)\min(1,e^{H(q',p')-H(q,p)})$. With $p(q,p) = e^{-H(q,p)}$ and $T(q',p'|q,p) = T(q,p|q',p')$: both sides equal $e^{-\max(H(q,p),H(q',p'))} \cdot T$. $\square$"
        corollaries={[
          "With exact Hamiltonian integration, acceptance rate = 100%. The Metropolis step is only needed due to leapfrog discretization errors — which grow as $O(\\varepsilon^2 L)$ and shrink the acceptance rate for large step sizes.",
          "HMC mixes exponentially faster than random-walk Metropolis-Hastings in high dimensions: RWM requires $O(d^{1/3})$ steps between samples while HMC requires $O(d^{1/4})$ gradient evaluations.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Optimal HMC Acceptance Rate and Step Size"
        statement="For a $d$-dimensional Gaussian target, the optimal HMC step size scales as $\varepsilon \propto d^{-1/4}$ and the optimal acceptance rate is approximately 65%. The effective sample size per gradient evaluation is $O(d^{-1/4})$, compared to $O(d^{-1})$ for random-walk Metropolis-Hastings."
        proof="For a $d$-dimensional isotropic Gaussian, the Hamiltonian error per leapfrog step is $O(\varepsilon^4 d)$ (from symplectic integration error analysis). Setting this to $O(1)$ gives $\varepsilon \propto d^{-1/4}$. At this optimal $\varepsilon$, the acceptance probability is $\approx 0.65$ (from the Gaussian random field theory of acceptance rates). The effective sample size is then $d^{-1/4}/L$ per gradient evaluation — vs $O(d^{-1})$ for RWM. $\square$"
        corollaries={[
          "Stan's adaptive step size algorithm (dual averaging) automatically tunes $\\varepsilon$ to target a 65% acceptance rate during warmup.",
          "The mass matrix $M$ can be set to the inverse posterior covariance (estimated during warmup) to further improve efficiency by removing correlations.",
        ]}
      />

      <HMCVisualizer />

      <ExampleBlock
        title="HMC for Bayesian Logistic Regression"
        problem="Binary classification: $y_n \sim \mathrm{Bern}(\sigma(w^T x_n))$, $w \sim \mathcal{N}(0, I)$. Derive the gradient of $U(w) = -\log p(w|X,y)$ needed for the leapfrog step."
        difficulty="advanced"
        solution={[
          {
            step: 'Potential energy U(w) = -log p(w|X,y)',
            formula: 'U(w) = -\\log p(w) - \\sum_n \\log p(y_n|x_n, w) = \\frac{1}{2}\\|w\\|^2 - \\sum_n [y_n \\log\\sigma_n + (1-y_n)\\log(1-\\sigma_n)]',
            explanation: 'Where σ_n = σ(w^T x_n). The gradient of U drives the leapfrog dynamics.',
          },
          {
            step: 'Gradient of U with respect to w',
            formula: '\\nabla_w U(w) = w - \\sum_n (y_n - \\sigma_n)\\,x_n = w - X^T(y - \\sigma)',
            explanation: 'Standard logistic regression gradient, plus the prior gradient (+w from the Gaussian prior). AutoDiff computes this automatically in Stan/Pyro.',
          },
          {
            step: 'Leapfrog integration',
            formula: 'p \\leftarrow p - \\frac{\\varepsilon}{2}\\nabla_w U(w), \\quad w \\leftarrow w + \\varepsilon p, \\quad \\text{repeat L times}',
            explanation: 'Each leapfrog step requires one gradient evaluation. With L=20, eps=0.1, and a good mass matrix, acceptance ≈ 90%.',
          },
          {
            step: 'NUTS acceptance and posterior samples',
            explanation: 'After warmup (tune eps via dual averaging), NUTS produces correlated samples from the exact posterior p(w|X,y). Unlike ADVI, HMC captures non-Gaussian posteriors and posterior correlations between weights.',
          },
        ]}
      />

      <WarningBlock title="HMC Tuning and Failure Modes">
        <ul className="space-y-2 text-sm">
          <li><strong>Divergent transitions:</strong> When the leapfrog integrator encounters regions of high curvature (e.g., near sharp posterior peaks or funnel geometries), it can diverge — the Hamiltonian increases sharply. These 'divergent transitions' indicate poor mixing and biased samples. Fix: reparameterize (non-centered parameterizations), reduce step size, or use more informative priors.</li>
          <li><strong>Non-centered parameterization:</strong> Hierarchical models often have a 'Neal's funnel' geometry — parameters with highly varying scales. Centering (z ~ N(mu, sigma)) leads to divergences. Non-centering (z_raw ~ N(0,1), z = mu + sigma*z_raw) removes the correlation and fixes the funnel.</li>
          <li><strong>Gradient cost:</strong> Each HMC step requires one gradient evaluation (same cost as one SGD step). For large neural networks, this is expensive — HMC is impractical for BNNs with millions of parameters. SGLD (stochastic gradient Langevin dynamics) uses mini-batch gradients but introduces bias.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={HMC_CODE}
        language="python"
        title="HMC and NUTS Sampler — PyTorch Implementation"
        runnable
      />
    </div>
  );
}
