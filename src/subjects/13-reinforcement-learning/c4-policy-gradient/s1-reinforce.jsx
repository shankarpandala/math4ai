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
// Policy Gradient Update Direction Visualizer
// ---------------------------------------------------------------------------

const W = 380, H = 220;
const CX = W / 2, CY = H / 2;

function GradientViz() {
  const [G, setG] = useState(2.0);        // episode return (can be negative)
  const [logprobAngle, setLogprobAngle] = useState(45); // direction of ∇log π

  // Policy gradient update: θ += α * G * ∇log π(a|s)
  // Visualize the gradient direction and scale
  const rad = (logprobAngle * Math.PI) / 180;
  const gx = Math.cos(rad);
  const gy = -Math.sin(rad);   // SVG y-axis flip

  const scale = Math.abs(G) * 50;
  const positive = G >= 0;
  const arrowColor = positive ? '#10b981' : '#ef4444';
  const arrowX = CX + gx * scale;
  const arrowY = CY + gy * scale;

  // Current policy distribution (simplified: softmax over 3 actions)
  const theta = [0, 0, 0];
  // Action taken corresponds to logprobAngle sector
  const actionIdx = Math.floor((((logprobAngle % 360) + 360) % 360) / 120);
  const updateMag = G * 0.2;
  const newTheta = [...theta];
  newTheta[actionIdx] += updateMag;
  const softmax = (t) => {
    const exp = t.map(Math.exp);
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map((e) => e / sum);
  };
  const oldProbs = softmax(theta);
  const newProbs = softmax(newTheta);
  const actionNames = ['Action 0', 'Action 1', 'Action 2'];
  const actionColors = ['#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        REINFORCE: Policy Gradient Update Direction
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The update <InlineMath math="\theta \leftarrow \theta + \alpha G \nabla\log\pi(a|s)" />{' '}
        increases the probability of action <em>a</em> when <InlineMath math="G > 0" /> (green
        arrow) and decreases it when <InlineMath math="G < 0" /> (red arrow).
      </p>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="shrink-0">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="mx-auto block" style={{ maxWidth: '100%' }}>
            {/* Grid */}
            <line x1={CX} y1={20} x2={CX} y2={H - 20} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />
            <line x1={20} y1={CY} x2={W - 20} y2={CY} stroke="#e5e7eb" strokeWidth={1} className="dark:stroke-gray-700" />

            {/* ∇log π direction (fixed, unit circle) */}
            <circle cx={CX} cy={CY} r={80} fill="none" stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 2" className="dark:stroke-gray-700" />
            <line
              x1={CX} y1={CY}
              x2={CX + gx * 80} y2={CY + gy * 80}
              stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2"
            />
            <text
              x={CX + gx * 95} y={CY + gy * 95}
              textAnchor="middle" fontSize={10} fill="#6366f1"
            >∇log π</text>

            {/* Policy gradient update arrow */}
            <defs>
              <marker id="arrow-pg" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill={arrowColor} />
              </marker>
            </defs>
            <line
              x1={CX} y1={CY}
              x2={arrowX} y2={arrowY}
              stroke={arrowColor} strokeWidth={3} markerEnd="url(#arrow-pg)"
              opacity={scale > 0 ? 1 : 0}
            />

            {/* Labels */}
            <text x={CX} y={CY - 10} textAnchor="middle" fontSize={10} fontWeight="700" fill="#374151" className="dark:fill-gray-300">θ</text>
            {scale > 5 && (
              <text
                x={CX + gx * scale * 0.6}
                y={CY + gy * scale * 0.6 - 8}
                textAnchor="middle" fontSize={10} fontWeight="700"
                fill={arrowColor}
              >
                {positive ? '+' : '−'}{Math.abs(G).toFixed(1)}·∇log π
              </text>
            )}
            <circle cx={CX} cy={CY} r={4} fill="#374151" className="dark:fill-gray-300" />
          </svg>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Return G (episode reward)
              </label>
              <span className={`font-mono text-sm font-bold ${G >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {G.toFixed(1)}
              </span>
            </div>
            <input
              type="range" min={-3} max={3} step={0.1} value={G}
              onChange={(e) => setG(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-indigo-500"
            />
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ∇log π angle
              </label>
              <span className="font-mono text-sm font-bold text-indigo-600">{logprobAngle}°</span>
            </div>
            <input
              type="range" min={0} max={359} step={1} value={logprobAngle}
              onChange={(e) => setLogprobAngle(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Policy distribution change */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Effect on π(a|s) — action taken: {actionNames[actionIdx]}
            </p>
            {actionNames.map((name, i) => (
              <div key={i} className="mb-1 flex items-center gap-2">
                <span className="w-16 text-xs" style={{ color: actionColors[i] }}>{name}</span>
                <div className="relative flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded">
                  <div
                    className="absolute left-0 top-0 h-4 rounded"
                    style={{ width: `${oldProbs[i] * 100}%`, background: actionColors[i], opacity: 0.3 }}
                  />
                  <div
                    className="absolute left-0 top-0 h-4 rounded"
                    style={{ width: `${newProbs[i] * 100}%`, background: actionColors[i], opacity: 0.7 }}
                  />
                </div>
                <span className="w-14 text-xs font-mono text-gray-500">
                  {(oldProbs[i] * 100).toFixed(0)}%→{(newProbs[i] * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
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

class PolicyNetwork(nn.Module):
    def __init__(self, obs_dim, n_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, 64), nn.ReLU(),
            nn.Linear(64, 64),      nn.ReLU(),
            nn.Linear(64, n_actions)
        )

    def forward(self, x):
        return F.softmax(self.net(x), dim=-1)

    def select_action(self, obs):
        probs = self.forward(torch.FloatTensor(obs))
        dist  = torch.distributions.Categorical(probs)
        action = dist.sample()
        return action.item(), dist.log_prob(action)

# REINFORCE with baseline
class REINFORCE:
    def __init__(self, obs_dim, n_actions, lr=1e-3, gamma=0.99):
        self.policy  = PolicyNetwork(obs_dim, n_actions)
        self.opt     = optim.Adam(self.policy.parameters(), lr=lr)
        self.gamma   = gamma

    def compute_returns(self, rewards):
        G, returns = 0, []
        for r in reversed(rewards):
            G = r + self.gamma * G
            returns.insert(0, G)
        returns = torch.FloatTensor(returns)
        # Baseline: subtract mean to reduce variance
        returns = (returns - returns.mean()) / (returns.std() + 1e-8)
        return returns

    def update(self, log_probs, rewards):
        returns    = self.compute_returns(rewards)
        policy_loss = -torch.stack(log_probs) * returns  # negative because we maximize
        loss = policy_loss.sum()
        self.opt.zero_grad()
        loss.backward()
        self.opt.step()
        return loss.item()

# Training loop (pseudocode for CartPole)
import gymnasium as gym

env    = gym.make('CartPole-v1')
agent  = REINFORCE(obs_dim=4, n_actions=2, lr=1e-3)
ep_returns = []

for episode in range(1000):
    obs, _   = env.reset()
    log_probs, rewards = [], []

    while True:
        action, log_prob = agent.policy.select_action(obs)
        obs, r, terminated, truncated, _ = env.step(action)
        log_probs.append(log_prob)
        rewards.append(r)
        if terminated or truncated:
            break

    loss = agent.update(log_probs, rewards)
    ep_returns.append(sum(rewards))
    if episode % 100 == 0:
        print(f"Ep {episode}: return={np.mean(ep_returns[-10:]):.1f}")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function Reinforce() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          REINFORCE
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The foundational policy gradient algorithm — directly optimizing the policy by
          following the gradient of expected return, using Monte Carlo episode returns.
        </p>
      </div>

      <GradientViz />

      <DefinitionBlock
        label="Definition 1.1"
        title="Policy Gradient"
        definition="Policy gradient methods directly parameterize the policy $\pi_\theta(a|s)$ and optimize the expected return $J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}[G(\tau)]$ via gradient ascent. The policy gradient theorem states: $\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[\sum_t \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot G_t\right]$, where $G_t = \sum_{t'=t}^\infty \gamma^{t'-t} r_{t'}$ is the discounted return from step $t$. The REINFORCE algorithm (Williams, 1992) estimates this gradient via Monte Carlo sampling."
        notation="The score function $\\nabla_\\theta \\log \\pi_\\theta(a|s)$ is the direction in parameter space that most increases the probability of action $a$ at state $s$. Multiplying by $G_t$ reinforces actions proportionally to their return: positive return increases probability, negative return decreases it."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Baseline Subtraction for Variance Reduction"
        definition="The REINFORCE gradient estimate has high variance (different episodes give very different returns). A baseline $b(s)$ can be subtracted from $G_t$ without introducing bias: $\nabla_\theta J(\theta) = \mathbb{E}_\tau\left[\sum_t \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot (G_t - b(s_t))\right]$. This is unbiased because $\mathbb{E}_{a \sim \pi_\theta}[\nabla_\theta \log \pi_\theta(a|s) \cdot b(s)] = b(s) \nabla_\theta \sum_a \pi_\theta(a|s) = b(s) \nabla_\theta 1 = 0$. The optimal baseline minimizes variance and is approximately $b^*(s) = \mathbb{E}[G_t^2] / \mathbb{E}[G_t]$; in practice, $b(s) \approx V(s)$ works well."
        notation="Using $b(s_t) = V(s_t)$ gives $G_t - V(s_t) = A_t$ — the advantage function. This is the connection between REINFORCE and actor-critic methods: the critic estimates $V$ and the actor uses advantages as gradient weights."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Policy Gradient Theorem"
        statement="For any differentiable policy $\pi_\theta$ and any start state distribution $d_0$, the gradient of the performance objective $J(\theta) = \sum_s d^\pi(s) V^\pi(s)$ (where $d^\pi$ is the discounted state visitation distribution) is: $\nabla_\theta J(\theta) = \sum_s d^\pi(s) \sum_a \nabla_\theta \pi_\theta(a|s) Q^\pi(s,a) = \mathbb{E}_\pi\left[\nabla_\theta \log \pi_\theta(A_t|S_t) Q^\pi(S_t, A_t)\right]$."
        proof="Start with $\nabla_\theta V^\pi(s) = \nabla_\theta \sum_a \pi_\theta(a|s) Q^\pi(s,a) = \sum_a [\nabla_\theta \pi_\theta(a|s) Q^\pi(s,a) + \pi_\theta(a|s) \nabla_\theta Q^\pi(s,a)]$. Expand $\nabla_\theta Q^\pi(s,a)$ recursively using $Q^\pi(s,a) = r + \\gamma \\sum_{s'} p(s'|s,a) V^\\pi(s')$: $\\nabla_\\theta Q^\\pi(s,a) = \\gamma \\sum_{s'} p(s'|s,a) \\nabla_\\theta V^\\pi(s')$. Unrolling the recursion gives $\\nabla_\\theta V^\\pi(s_0) = \\sum_{s} \\sum_{t=0}^\\infty \\gamma^t P(S_t=s|s_0,\\pi_\\theta) \\sum_a \\nabla_\\theta \\pi_\\theta(a|s) Q^\\pi(s,a)$. Using the log-derivative trick $\\nabla_\\theta \\pi = \\pi \\nabla_\\theta \\log \\pi$ and defining $d^\\pi(s) = \\sum_{t=0}^\\infty \\gamma^t P(S_t=s)$ completes the proof. $\\square$"
        corollaries={[
          'The policy gradient theorem holds for both episodic and continuing tasks, and for any parameterization of $\\pi_\\theta$ (neural network, linear, tabular softmax).',
          'REINFORCE replaces $Q^\\pi(s,a)$ with Monte Carlo return $G_t$ — an unbiased but high-variance estimate. Actor-critic replaces it with a lower-variance learned critic $Q_w(s,a)$.',
        ]}
      />

      <ExampleBlock
        title="REINFORCE Update Computation"
        difficulty="advanced"
        problem="An episode generates trajectory: $(s_0, a_0, r_1=0), (s_1, a_1, r_2=0), (s_2, a_2, r_3=1)$ with $\gamma=0.99$. Compute the REINFORCE gradient for step $t=0$ and explain the effect of baseline subtraction."
        solution={[
          {
            step: 'Compute discounted returns',
            formula: 'G_0 = 0 + 0.99 \\times 0 + 0.99^2 \\times 1 = 0.9801',
            explanation: '$G_1 = 0 + 0.99 \\times 1 = 0.99$. $G_2 = 1$. Each $G_t$ is the discounted return from step $t$ to the end of the episode.',
          },
          {
            step: 'Policy gradient update for θ',
            formula: '\\nabla_\\theta J \\approx \\sum_{t=0}^{2} G_t \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t)',
            explanation:
              'Each term $G_t \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t)$ reinforces action $a_t$ proportionally to its future return. Action $a_2$ (with $G_2=1$) is reinforced most strongly; $a_0$ (with $G_0=0.9801$) is reinforced almost as much.',
          },
          {
            step: 'Baseline subtraction: use mean return',
            formula: '\\bar{G} = (0.9801 + 0.99 + 1) / 3 = 0.990,\\quad \\hat{G}_t = G_t - \\bar{G}',
            explanation:
              '$\\hat{G}_0 = -0.010$, $\\hat{G}_1 = 0$, $\\hat{G}_2 = 0.010$. Now only the best action ($a_2$) is significantly reinforced; the average action ($a_1$) receives no update; $a_0$ (slightly below average) is slightly penalized.',
          },
          {
            step: 'Effect of baseline',
            explanation:
              'Variance reduction: with baseline, gradient norms are much smaller, enabling larger learning rates without instability. The same information is preserved (which actions are relatively better) with lower signal-to-noise ratio.',
          },
        ]}
      />

      <WarningBlock title="REINFORCE Has High Variance — Use Baselines Always">
        <p>
          Vanilla REINFORCE without a baseline is almost never used in practice due to
          catastrophically high gradient variance. In a single episode, all actions in the
          episode receive the same sign update (positive if the episode went well, negative
          if it went badly) — this is extremely wasteful. Even with a simple moving-average
          baseline, variance drops by orders of magnitude. Modern implementations use:
          (1) advantage normalization per batch (subtract mean, divide by std);
          (2) learned value function baseline (actor-critic);
          (3) multiple episode rollouts per update (larger batch = lower variance).
          High variance also causes the "Optimizer's Curse": initial good luck can make
          the agent overfit to a suboptimal policy before sufficient exploration.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="REINFORCE with Baseline in PyTorch — CartPole"
        runnable
      />
    </div>
  );
}
