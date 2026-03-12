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
// Experience Replay Buffer Diagram with Batch Sampling
// ---------------------------------------------------------------------------

const BUFFER_SIZE = 10;
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

function generateExperience(i) {
  const states = ['(0,2)', '(1,3)', '(2,1)', '(3,0)', '(1,1)', '(2,3)', '(0,0)', '(3,2)', '(2,2)', '(1,0)'];
  const actions = ['Up', 'Down', 'Left', 'Right'];
  const rewards = [-1, -1, -1, 0, -1, 10, -1, -1, -1, 5];
  return {
    idx: i,
    s: states[i % states.length],
    a: actions[i % 4],
    r: rewards[i % rewards.length],
    done: rewards[i % rewards.length] > 0,
  };
}

const BUFFER = Array.from({ length: BUFFER_SIZE }, (_, i) => generateExperience(i));
const BATCH_SIZE = 4;

function ExperienceReplayDiagram() {
  const [batchIndices, setBatchIndices] = useState(null);
  const [pointer, setPointer] = useState(BUFFER_SIZE - 1); // oldest entry

  function sampleBatch() {
    const indices = [];
    while (indices.length < BATCH_SIZE) {
      const idx = Math.floor(Math.random() * BUFFER_SIZE);
      if (!indices.includes(idx)) indices.push(idx);
    }
    setBatchIndices(indices);
  }

  function addExperience() {
    setPointer((p) => (p + 1) % BUFFER_SIZE);
    setBatchIndices(null);
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        DQN Experience Replay Buffer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The replay buffer stores past transitions <InlineMath math="(s, a, r, s')" />. During
        training, random mini-batches are sampled to break correlation between consecutive
        experiences. Click "Sample Batch" to highlight a random mini-batch.
      </p>

      {/* Buffer visualization */}
      <div className="mb-4 space-y-1">
        {BUFFER.map((exp, i) => {
          const isSelected = batchIndices?.includes(i);
          const isPointer = i === pointer;
          const colorIdx = isSelected ? batchIndices.indexOf(i) : -1;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono transition-all ${
                isSelected ? 'shadow-sm' : ''
              } ${isPointer ? 'border border-dashed border-gray-400 dark:border-gray-600' : ''}`}
              style={{
                background: isSelected ? COLORS[colorIdx % COLORS.length] + '20' : '#f9fafb',
                border: isSelected ? `2px solid ${COLORS[colorIdx % COLORS.length]}60` : undefined,
              }}
            >
              <span className="w-5 text-gray-400 dark:text-gray-500">{i}</span>
              <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${isPointer ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                {isPointer ? '← write' : ''}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                s={exp.s} a={exp.a} r={exp.r} done={exp.done ? 'T' : 'F'}
              </span>
              {isSelected && (
                <span
                  className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ background: COLORS[colorIdx % COLORS.length] }}
                >
                  batch [{colorIdx}]
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={sampleBatch}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600"
        >
          Sample Batch ({BATCH_SIZE})
        </button>
        <button
          onClick={addExperience}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
        >
          Add Experience
        </button>
        <button
          onClick={() => setBatchIndices(null)}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          Clear
        </button>
      </div>

      {batchIndices && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Sampled indices: [{batchIndices.join(', ')}] — used for one gradient update step
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from collections import deque
import random

# --- Q-Network ---
class DQN(nn.Module):
    def __init__(self, obs_dim, n_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, 128), nn.ReLU(),
            nn.Linear(128, 128),     nn.ReLU(),
            nn.Linear(128, n_actions)
        )
    def forward(self, x):
        return self.net(x)

# --- Replay Buffer ---
class ReplayBuffer:
    def __init__(self, capacity=100_000):
        self.buffer = deque(maxlen=capacity)

    def push(self, s, a, r, s_next, done):
        self.buffer.append((s, a, r, s_next, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        s, a, r, s_next, done = map(np.array, zip(*batch))
        return (
            torch.FloatTensor(s),
            torch.LongTensor(a),
            torch.FloatTensor(r),
            torch.FloatTensor(s_next),
            torch.FloatTensor(done),
        )

    def __len__(self):
        return len(self.buffer)

# --- DQN Training Loop ---
obs_dim  = 4    # e.g., CartPole
n_actions = 2

online_net = DQN(obs_dim, n_actions)
target_net = DQN(obs_dim, n_actions)
target_net.load_state_dict(online_net.state_dict())  # copy weights

optimizer = optim.Adam(online_net.parameters(), lr=1e-3)
buffer    = ReplayBuffer(100_000)

gamma          = 0.99
batch_size     = 32
target_update  = 1000   # update target network every N steps
steps          = 0

def train_step():
    if len(buffer) < batch_size:
        return
    s, a, r, s_next, done = buffer.sample(batch_size)

    # Current Q-values: Q(s, a) for taken actions
    q_values = online_net(s).gather(1, a.unsqueeze(1)).squeeze(1)

    # TD target using frozen target network
    with torch.no_grad():
        q_next = target_net(s_next).max(1)[0]
        target = r + gamma * (1 - done) * q_next

    loss = nn.MSELoss()(q_values, target)
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(online_net.parameters(), 10.0)  # gradient clipping
    optimizer.step()
    return loss.item()

# Periodically: target_net.load_state_dict(online_net.state_dict())
print("DQN setup complete.")
print(f"Online network: {sum(p.numel() for p in online_net.parameters())} params")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function DQN() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Deep Q-Networks
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          DQN — combining deep neural networks with Q-learning for high-dimensional state
          spaces, using experience replay and target networks to stabilize training.
        </p>
      </div>

      <ExperienceReplayDiagram />

      <DefinitionBlock
        label="Definition 3.1"
        title="Deep Q-Network (DQN)"
        definition="DQN (Mnih et al., 2015) approximates the Q-function with a neural network $Q_\theta: \mathcal{S} \to \mathbb{R}^{|\mathcal{A}|}$ parameterized by $\theta$. The network takes a state $s$ (e.g., 84×84 pixel stack of 4 frames) as input and outputs Q-values for all actions simultaneously. The loss minimizes the mean squared Bellman error: $\mathcal{L}(\theta) = \mathbb{E}_{(s,a,r,s') \sim \mathcal{D}}\left[\left(r + \gamma \max_{a'} Q_{\theta^-}(s',a') - Q_\theta(s,a)\right)^2\right]$, where $\mathcal{D}$ is the replay buffer and $\theta^-$ are frozen target network parameters."
        notation="Architecture for Atari: 3 convolutional layers → 2 FC layers → $|\mathcal{A}|$ outputs. Input: 4 grayscale frames stacked (84×84×4). The network implicitly learns to extract features (edges, motion) relevant for Q-value estimation."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Experience Replay"
        definition="Experience replay stores past transitions $(s_t, a_t, r_t, s_{t+1})$ in a circular buffer $\mathcal{D}$ of capacity $N$. During training, mini-batches of size $B$ are sampled uniformly at random from $\mathcal{D}$ for gradient updates. Benefits: (1) breaks temporal correlations between consecutive experiences; (2) increases data efficiency by reusing each experience multiple times; (3) smooths the training distribution over a mixture of past policies."
        notation="Prioritized Experience Replay (PER) samples transitions with probability proportional to their TD error magnitude: $p_i = |\delta_i|^\alpha / \sum_j |\delta_j|^\alpha$, focusing training on informative (high-error) transitions. Importance sampling weights $w_i = (Np_i)^{-\\beta}$ correct the bias introduced by non-uniform sampling."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="The Deadly Triad: Divergence in Function Approximation RL"
        statement="Combining the following three elements — (1) function approximation (e.g., neural networks), (2) bootstrapping (using estimated values as targets, as in Q-learning), and (3) off-policy training — can lead to divergence in value function estimation, even with linear function approximators and simple MDPs (Baird's counterexample, 1995)."
        proof="Consider Baird's counterexample: a 7-state MDP with a dashed action (goes to any state uniformly) and a solid action (deterministic). With linear function approximation $V(s) = \\phi(s)^\\top \\theta$, the semi-gradient TD update $\\theta \\leftarrow \\theta + \\alpha \\delta \\nabla V(s)$ with off-policy bootstrapped targets causes $\\|\\theta\\| \\to \\infty$ for certain feature choices. The root cause: the semi-gradient update is not a true gradient of any scalar objective, so it can move 'uphill' in parameter space. This divergence is prevented by (a) using on-policy data (SARSA, Actor-Critic), (b) gradient TD methods that minimize a true objective, or (c) conservative updates (DQN target network, PPO's clipping). $\\square$"
        corollaries={[
          'DQN mitigates the deadly triad partially: experience replay reduces off-policy-ness (data is from recent policies), target network slows bootstrapping instability, and the large batch size stabilizes gradients.',
          'Gradient TD methods (GTD, GTD2, TDC) provide convergence guarantees for off-policy function approximation by minimizing the Mean Squared Projected Bellman Error (MSPBE) via a true gradient.',
        ]}
      />

      <ExampleBlock
        title="DQN for Atari: Key Design Choices"
        difficulty="advanced"
        problem="Explain the five key design choices that made DQN work on Atari games where naive Q-learning with neural networks failed."
        solution={[
          {
            step: '1. Experience replay buffer',
            explanation:
              'Store 1M past transitions. Sample uniformly for mini-batch updates. Breaks temporal correlation (consecutive frames are highly correlated — training on them directly biases the gradient). Improves data efficiency by reusing each experience ~8 times on average.',
          },
          {
            step: '2. Target network',
            explanation:
              'Maintain a frozen copy $Q_{\\theta^-}$ of the network for computing TD targets. Update $\\theta^- \\leftarrow \\theta$ every $C=10,000$ steps. Without this, the target $r + \\gamma \\max_{a\'} Q_\\theta(s\',a\')$ changes with every gradient step, creating a moving target that destabilizes training (chasing your own tail).',
          },
          {
            step: '3. Frame preprocessing and stacking',
            explanation:
              'Convert RGB frames (210×160×3) to grayscale, downsample to 84×84, stack 4 consecutive frames. Stacking gives the network velocity information (ball direction in Pong, etc.) — single frames are nearly Markovian but stacked frames are fully Markovian for most Atari games.',
          },
          {
            step: '4. Reward clipping',
            explanation:
              'Clip all rewards to [-1, +1]. This normalizes across games with different reward scales (scores range from 1 to 100,000 depending on the game) and limits the gradient magnitude. Downside: loses information about reward magnitude (all positive events are equally good).',
          },
          {
            step: '5. Gradient clipping',
            formula: '\\theta \\leftarrow \\theta - \\alpha \\cdot \\text{clip}\\left(\\nabla_\\theta \\mathcal{L}, -1, 1\\right)',
            explanation:
              'Clip gradients to [-1, 1] (equivalent to Huber loss on the TD error). Prevents large gradient updates that destabilize the network when TD errors are large (common early in training).',
          },
        ]}
      />

      <WarningBlock title="DQN Target Network Lag Introduces Bias">
        <p>
          The target network's periodically-updated frozen copy introduces a systematic bias:
          the target $r + \gamma \max_{a'} Q_{\theta^-}(s',a')$ is computed with parameters
          that are $C$ steps behind. This means DQN does not minimize the true Bellman error
          but an approximation to it. Large $C$ gives more stable targets but higher bias;
          small $C$ gives lower bias but less stability. Polyak averaging updates the target
          network continuously as $\theta^- \leftarrow (1-\tau)\theta^- + \tau\theta$ with
          $\tau \approx 0.005$ — used in DDPG and SAC as a smoother alternative to periodic
          hard updates.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="DQN Implementation: Network, Replay Buffer, and Training Step"
        runnable
      />
    </div>
  );
}
