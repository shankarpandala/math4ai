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
// PPO Clipped Surrogate Objective Plot (ratio r vs advantage A)
// ---------------------------------------------------------------------------

const PLOT_W = 360;
const PLOT_H = 200;
const PAD = { top: 20, right: 20, bottom: 36, left: 50 };

function ppoClipped(r, A, eps = 0.2) {
  const unclipped = r * A;
  const clipped = Math.min(Math.max(r, 1 - eps), 1 + eps) * A;
  return Math.min(unclipped, clipped);
}

function PPOPlot() {
  const [epsilon, setEpsilon] = useState(0.2);
  const [advantage, setAdvantage] = useState(1.0);

  const plotW = PLOT_W - PAD.left - PAD.right;
  const plotH = PLOT_H - PAD.top - PAD.bottom;

  // x-axis: ratio r from 0.1 to 2.5
  const rMin = 0.1, rMax = 2.5;
  const yMin = -1.0, yMax = 2.5;

  function px(r) { return PAD.left + ((r - rMin) / (rMax - rMin)) * plotW; }
  function py(y) { return PAD.top + ((yMax - y) / (yMax - yMin)) * plotH; }

  const steps = 120;
  const ratios = Array.from({ length: steps }, (_, i) => rMin + (i / (steps - 1)) * (rMax - rMin));

  // Clipped surrogate
  const clippedPts = ratios.map((r) => `${px(r)},${py(ppoClipped(r, advantage, epsilon))}`).join(' ');
  // Unclipped (r * A)
  const unclippedPts = ratios.map((r) => `${px(r)},${py(r * advantage)}`).join(' ');

  // Clip boundaries
  const clipLo = 1 - epsilon;
  const clipHi = 1 + epsilon;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        PPO Clipped Surrogate Objective
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="L^{CLIP}(r, A) = \min(r \cdot A,\; \text{clip}(r, 1-\epsilon, 1+\epsilon) \cdot A)" />{' '}
        — the clipping limits how much the policy can change per update step.
      </p>

      <svg width={PLOT_W} height={PLOT_H} className="mx-auto block mb-4">
        {/* Clip region */}
        <rect
          x={px(clipLo)} y={PAD.top}
          width={px(clipHi) - px(clipLo)} height={plotH}
          fill="#fef9c3" opacity={0.5}
        />

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#d1d5db" strokeWidth={1} />
        <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#d1d5db" strokeWidth={1} />

        {/* y=0 line */}
        <line x1={PAD.left} y1={py(0)} x2={PAD.left + plotW} y2={py(0)} stroke="#e5e7eb" strokeWidth={1} />

        {/* r=1 line */}
        <line x1={px(1)} y1={PAD.top} x2={px(1)} y2={PAD.top + plotH} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 2" />
        <text x={px(1)} y={PAD.top - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">r=1</text>

        {/* Clip boundaries */}
        <line x1={px(clipLo)} y1={PAD.top} x2={px(clipLo)} y2={PAD.top + plotH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={px(clipHi)} y1={PAD.top} x2={px(clipHi)} y2={PAD.top + plotH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={px(clipLo)} y={PAD.top + plotH + 24} textAnchor="middle" fontSize={9} fill="#f59e0b">1-ε</text>
        <text x={px(clipHi)} y={PAD.top + plotH + 24} textAnchor="middle" fontSize={9} fill="#f59e0b">1+ε</text>

        {/* Unclipped objective (dashed) */}
        <polyline points={unclippedPts} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" />

        {/* Clipped objective */}
        <polyline points={clippedPts} fill="none" stroke="#6366f1" strokeWidth={2.5} />

        {/* Axis labels */}
        {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((r) => (
          <text key={r} x={px(r)} y={PAD.top + plotH + 14} textAnchor="middle" fontSize={9} fill="#9ca3af">{r}</text>
        ))}
        {[-1, 0, 1, 2].map((y) => (
          <text key={y} x={PAD.left - 4} y={py(y) + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{y}</text>
        ))}

        <text x={PAD.left + plotW / 2} y={PLOT_H - 2} textAnchor="middle" fontSize={9} fill="#6b7280">Probability ratio r = π_θ / π_θ_old</text>

        {/* Legend */}
        <line x1={PAD.left + 6} y1={PAD.top + 10} x2={PAD.left + 22} y2={PAD.top + 10} stroke="#6366f1" strokeWidth={2.5} />
        <text x={PAD.left + 26} y={PAD.top + 14} fontSize={9} fill="#6366f1">L^CLIP</text>
        <line x1={PAD.left + 6} y1={PAD.top + 24} x2={PAD.left + 22} y2={PAD.top + 24} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={PAD.left + 26} y={PAD.top + 28} fontSize={9} fill="#9ca3af">r·A (unclipped)</text>
      </svg>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm font-medium text-amber-700 dark:text-amber-300">ε (clip range)</label>
            <span className="font-mono text-sm font-bold text-amber-600">{epsilon.toFixed(2)}</span>
          </div>
          <input type="range" min={0.05} max={0.5} step={0.01} value={epsilon}
            onChange={(e) => setEpsilon(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-amber-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Advantage A</label>
            <span className="font-mono text-sm font-bold text-indigo-600">{advantage.toFixed(1)}</span>
          </div>
          <input type="range" min={-2} max={2} step={0.1} value={advantage}
            onChange={(e) => setAdvantage(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-indigo-500" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import numpy as np

class ActorCritic(nn.Module):
    def __init__(self, obs_dim, n_actions):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(obs_dim, 64), nn.Tanh(),
            nn.Linear(64, 64),     nn.Tanh(),
        )
        self.actor  = nn.Linear(64, n_actions)   # policy head
        self.critic = nn.Linear(64, 1)            # value head

    def forward(self, x):
        h     = self.shared(x)
        logits = self.actor(h)
        value  = self.critic(h).squeeze(-1)
        return logits, value

class PPO:
    def __init__(self, obs_dim, n_actions, lr=3e-4, gamma=0.99,
                 lam=0.95, eps_clip=0.2, n_epochs=10, batch_size=64):
        self.net       = ActorCritic(obs_dim, n_actions)
        self.opt       = optim.Adam(self.net.parameters(), lr=lr)
        self.gamma     = gamma
        self.lam       = lam
        self.eps_clip  = eps_clip
        self.n_epochs  = n_epochs
        self.batch_size = batch_size

    def compute_gae(self, rewards, values, dones, next_value):
        """Generalized Advantage Estimation (GAE-λ)."""
        advantages = []
        gae = 0
        values = values + [next_value]
        for step in reversed(range(len(rewards))):
            delta = rewards[step] + self.gamma * values[step+1] * (1-dones[step]) - values[step]
            gae   = delta + self.gamma * self.lam * (1-dones[step]) * gae
            advantages.insert(0, gae)
        returns = [a + v for a, v in zip(advantages, values[:-1])]
        return advantages, returns

    def update(self, obs, actions, old_log_probs, returns, advantages):
        obs        = torch.FloatTensor(obs)
        actions    = torch.LongTensor(actions)
        old_lp     = torch.FloatTensor(old_log_probs)
        returns    = torch.FloatTensor(returns)
        advantages = torch.FloatTensor(advantages)
        advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)

        for _ in range(self.n_epochs):
            # Mini-batch updates
            idx = torch.randperm(len(obs))
            for start in range(0, len(obs), self.batch_size):
                mb  = idx[start:start+self.batch_size]
                logits, values = self.net(obs[mb])
                dist    = torch.distributions.Categorical(logits=logits)
                log_p   = dist.log_prob(actions[mb])
                entropy = dist.entropy().mean()

                # Clipped surrogate objective
                ratio   = torch.exp(log_p - old_lp[mb])
                surr1   = ratio * advantages[mb]
                surr2   = ratio.clamp(1-self.eps_clip, 1+self.eps_clip) * advantages[mb]
                actor_loss  = -torch.min(surr1, surr2).mean()
                critic_loss = F.mse_loss(values, returns[mb])
                loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy

                self.opt.zero_grad()
                loss.backward()
                torch.nn.utils.clip_grad_norm_(self.net.parameters(), 0.5)
                self.opt.step()

print("PPO setup complete.")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PPOActorCritic() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          PPO &amp; Actor-Critic
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Proximal Policy Optimization with Generalized Advantage Estimation — the dominant
          on-policy deep RL algorithm, combining the stability of trust-region methods with
          the simplicity of first-order optimization.
        </p>
      </div>

      <PPOPlot />

      <DefinitionBlock
        label="Definition 4.1"
        title="Actor-Critic Architecture"
        definition="An actor-critic combines a policy (actor) $\pi_\theta(a|s)$ with a value function (critic) $V_w(s)$. The actor generates actions; the critic evaluates states and provides a baseline. The actor is updated via policy gradient weighted by advantages $A_t = G_t - V_w(s_t)$; the critic is updated to minimize $\mathbb{E}[(V_w(s_t) - G_t)^2]$. Using a shared network with a shared feature extractor and two heads (policy and value) reduces memory and promotes feature sharing."
        notation="A2C (Advantage Actor-Critic): synchronous, multiple parallel environment copies provide diverse experience. A3C (Asynchronous A2C): multiple agents run asynchronously and push gradients to a shared parameter server. Both use $n$-step returns for advantage estimation, trading bias for variance reduction compared to Monte Carlo returns."
      />

      <DefinitionBlock
        label="Definition 4.2"
        title="Generalized Advantage Estimation (GAE)"
        definition="GAE (Schulman et al., 2015) computes advantage estimates as an exponentially weighted sum of $n$-step TD errors: $\hat{A}_t^{GAE(\gamma,\lambda)} = \sum_{l=0}^\infty (\gamma\lambda)^l \delta_{t+l}$, where $\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)$ is the TD error. The parameter $\lambda \in [0,1]$ controls the bias-variance trade-off: $\lambda=0$ gives 1-step TD (low variance, high bias); $\lambda=1$ gives Monte Carlo (zero bias, high variance). Typical: $\lambda=0.95$."
        notation="GAE truncated to horizon $T$: $\\hat{A}_t = \\sum_{l=0}^{T-t-1} (\\gamma\\lambda)^l \\delta_{t+l} + (\\gamma\\lambda)^{T-t} V(s_T)$. In practice, collect $T=2048$ steps, compute GAE, then perform $K=10$ epochs of mini-batch PPO updates on the collected data."
      />

      <TheoremBlock
        label="Theorem 4.1"
        title="PPO Clipped Objective and Policy Conservatism"
        statement="The PPO-Clip objective is $L^{CLIP}(\theta) = \mathbb{E}_t[\min(r_t(\theta) A_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon) A_t)]$, where $r_t(\theta) = \pi_\theta(a_t|s_t) / \pi_{\theta_{old}}(a_t|s_t)$ is the probability ratio. This objective implicitly constrains the policy update: when $A_t > 0$, the objective is clipped at $r = 1+\epsilon$ (no incentive to increase $\pi$ beyond $(1+\epsilon)\pi_{old}$); when $A_t < 0$, it is clipped at $r = 1-\epsilon$ (no incentive to decrease $\pi$ below $(1-\epsilon)\pi_{old}$)."
        proof="Consider $A_t > 0$: gradient of $L^{CLIP}$ w.r.t. $r = r_t(\\theta)$ is $\\partial L^{CLIP} / \\partial r = A_t \\cdot \\mathbf{1}[r < 1+\\epsilon]$. When $r \\geq 1+\\epsilon$, the gradient is zero — the update stops regardless of $A_t > 0$. This prevents greedily maximizing the ratio (which would push the policy far from $\\pi_{old}$). Similarly for $A_t < 0$: gradient is zero when $r \\leq 1-\\epsilon$. The resulting policy update stays within a $(1-\\epsilon, 1+\\epsilon)$ ratio of the old policy, approximating a trust region constraint at first order. $\\square$"
        corollaries={[
          'PPO-Clip is equivalent to TRPO (Trust Region Policy Optimization) in the limit of small $\\epsilon$ but requires only first-order optimization, making it $\\sim 10\\times$ faster per update.',
          'KL penalty PPO (PPO-KL) adds $\\beta \\cdot KL(\\pi_{\\theta_{old}}, \\pi_\\theta)$ to the loss as an alternative trust region formulation, adaptively adjusting $\\beta$ based on observed KL.',
        ]}
      />

      <TheoremBlock
        label="Theorem 4.2"
        title="A3C: Asynchronous Advantage Actor-Critic"
        statement="A3C (Mnih et al., 2016) maintains a global parameter server $\\theta$ and $n$ parallel actor threads, each running an independent copy of the environment. Each thread: (1) copies global $\\theta_{t}$ to local $\\theta'$; (2) runs $t_{max}$ steps collecting $(s, a, r)$; (3) computes gradients $d\\theta = \nabla_{\theta'} \sum_t \log\pi_{\theta'}(a_t|s_t)(R_t - V_{\theta'}(s_t)) + \nabla_{\theta'} (R_t - V_{\theta'}(s_t))^2$; (4) applies $d\\theta$ to global $\\theta$ asynchronously. The asynchrony provides diverse experience that de-correlates updates, replacing the need for a replay buffer."
        proof="The asynchronous gradient updates are unbiased gradient estimates in expectation (each thread uses its own consistent parameter copy $\\theta'$). The diversity of simultaneously-running threads decorrelates temporal data, providing a similar benefit to experience replay without storing past transitions. Theoretical convergence follows from stochastic gradient descent convergence with bounded gradient variance. Empirically, A3C converges 4× faster on CPU than DQN on GPU for Atari games. $\\square$"
        corollaries={[
          'A2C (synchronous A3C) waits for all workers before updating, giving more stable gradients. A2C often matches A3C performance with simpler implementation.',
          'Entropy bonus $\\beta H[\\pi_\\theta(\\cdot|s)]$ encourages exploration by penalizing premature convergence to deterministic policies. Typical $\\beta=0.01$.',
        ]}
      />

      <ExampleBlock
        title="PPO Hyperparameter Tuning for MuJoCo Locomotion"
        difficulty="research"
        problem="You're training PPO on HalfCheetah-v4 (continuous control, 17-dim state, 6-dim action). Describe the key hyperparameters and their effects on training stability and performance."
        solution={[
          {
            step: 'Rollout collection: T and num_envs',
            explanation:
              'Collect T=2048 steps per environment, with num_envs=8 parallel environments → 16,384 total transitions per PPO iteration. More environments reduce gradient variance and decorrelate data. For continuous control, longer rollouts capture longer-horizon rewards.',
          },
          {
            step: 'GAE parameters: λ and γ',
            formula: '\\hat{A}_t = \\sum_{l=0}^{T-t} (\\gamma\\lambda)^l \\delta_{t+l},\\quad \\gamma=0.99,\\; \\lambda=0.95',
            explanation:
              '$\\gamma=0.99$ is standard for locomotion (long-horizon tasks need high discount). $\\lambda=0.95$ gives low-variance advantages without excessive bias. $\\lambda=1$ would require very accurate value function; $\\lambda=0$ would be too myopic.',
          },
          {
            step: 'Clipping: ε and mini-batch epochs',
            explanation:
              '$\\epsilon=0.2$ is the PPO default. For sensitive continuous control, $\\epsilon=0.1$ prevents too-large policy changes that can destabilize locomotion gaits. Perform $K=10$ epochs of 32 mini-batches per rollout. Watch the KL divergence: if KL(old, new) > 0.05 per epoch, reduce epochs or $\\epsilon$.',
          },
          {
            step: 'Critic and entropy',
            explanation:
              'Critic coefficient: $c_1=0.5$ (MSE loss weight relative to actor). Entropy coefficient: $c_2=0.0$ for MuJoCo (continuous action already has inherent stochasticity from Gaussian policy $\\sigma$). Gradient clipping: $\\|\\nabla\\|_2 \\leq 0.5$ prevents large updates when advantages are poorly estimated.',
          },
        ]}
      />

      <WarningBlock title="PPO Is On-Policy: Sample Efficiency Limitation">
        <p>
          PPO collects rollouts with $\pi_{\theta_{old}}$, updates parameters, then{' '}
          <strong>discards all collected data</strong> and repeats. This is fundamentally
          sample inefficient: each transition is used for at most $K \approx 10$ gradient
          updates before being thrown away. Off-policy algorithms (SAC, TD3) reuse data
          from a replay buffer, achieving 10-100× better sample efficiency on continuous
          control benchmarks. For environments where simulation is cheap (Atari, MuJoCo),
          PPO's simplicity and stability make it the default choice. For real-world robotics
          where each sample is expensive, use SAC (Soft Actor-Critic) instead — it combines
          maximum entropy RL with off-policy learning and typically achieves similar final
          performance with 10× fewer environment steps.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="PPO with GAE and Clipped Surrogate Objective in PyTorch"
        runnable
      />
    </div>
  );
}
