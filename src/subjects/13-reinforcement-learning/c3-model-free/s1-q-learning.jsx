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
// Q-Table Update Visualizer with alpha/gamma sliders
// ---------------------------------------------------------------------------

// 3-state MDP, 2 actions
// Q-table: Q[state][action]
const STATE_NAMES = ['S0', 'S1', 'S2'];
const ACTION_NAMES = ['Left', 'Right'];

function QLearningDemo() {
  const [alpha, setAlpha] = useState(0.1);
  const [gamma, setGamma] = useState(0.9);
  const [epsilon, setEpsilon] = useState(0.1);

  // Q-table state (3 states, 2 actions)
  const [Q, setQ] = useState([
    [0.0, 0.0],
    [0.0, 0.0],
    [0.0, 0.0], // S2 terminal
  ]);

  // Current experience
  const [experience, setExperience] = useState({ s: 0, a: 1, r: 0, sNext: 1 });
  const [history, setHistory] = useState([]);

  // Compute Bellman target and TD error
  const { s, a, r, sNext } = experience;
  const maxQNext = Math.max(...Q[sNext]);
  const target = r + gamma * maxQNext;
  const tdError = target - Q[s][a];
  const newQ = Q[s][a] + alpha * tdError;

  // Sample next experience (simplified simulation)
  function step() {
    const newQ2 = Q.map((row) => [...row]);
    newQ2[s][a] = newQ;
    setQ(newQ2);

    // Deterministic next-step choice for demo
    const nextS = sNext;
    let nextA;
    if (Math.random() < epsilon) {
      nextA = Math.floor(Math.random() * 2); // explore
    } else {
      nextA = Q[nextS][0] >= Q[nextS][1] ? 0 : 1; // exploit
    }

    // Simulate simple transitions
    let ns = nextS;
    let nr = 0;
    if (nextA === 1 && ns < 2) { ns = nextS + 1; nr = ns === 2 ? 1 : 0; }
    else if (nextA === 0 && ns > 0) { ns = nextS - 1; nr = 0; }
    else { ns = nextS; nr = 0; }

    const entry = { s, a, r, sNext, oldQ: Q[s][a].toFixed(3), newQ: newQ.toFixed(3), tdErr: tdError.toFixed(3) };
    setHistory((h) => [entry, ...h].slice(0, 5));
    setExperience({ s: nextS, a: nextA, r: nr, sNext: ns });
  }

  function reset() {
    setQ([[0,0],[0,0],[0,0]]);
    setHistory([]);
    setExperience({ s: 0, a: 1, r: 0, sNext: 1 });
  }

  const ACTION_COLORS = ['#6366f1', '#10b981'];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Q-Table Update Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Click "Step" to perform one Q-learning update. Adjust <InlineMath math="\alpha" /> and{' '}
        <InlineMath math="\gamma" /> to see how they affect the TD update.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'α (learning rate)', val: alpha, set: setAlpha, min: 0.01, max: 1.0, color: 'indigo' },
          { label: 'γ (discount)', val: gamma, set: setGamma, min: 0.1, max: 0.99, color: 'emerald' },
          { label: 'ε (exploration)', val: epsilon, set: setEpsilon, min: 0.0, max: 1.0, color: 'amber' },
        ].map(({ label, val, set, min, max, color }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between">
              <label className={`text-xs font-medium text-${color}-700 dark:text-${color}-300`}>{label}</label>
              <span className={`font-mono text-xs font-bold text-${color}-600`}>{val.toFixed(2)}</span>
            </div>
            <input type="range" min={min} max={max} step={0.01} value={val}
              onChange={(e) => set(Number(e.target.value))}
              className={`h-2 w-full cursor-pointer accent-${color}-500`} />
          </div>
        ))}
      </div>

      {/* Q-table */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-center text-sm border-collapse">
          <thead>
            <tr>
              <th className="py-1 px-2 text-gray-500 dark:text-gray-400 font-medium">State</th>
              {ACTION_NAMES.map((a, i) => (
                <th key={a} className="py-1 px-2 font-medium" style={{ color: ACTION_COLORS[i] }}>{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Q.map((row, si) => (
              <tr
                key={si}
                className={si === s ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''}
              >
                <td className="py-1 px-2 font-bold text-gray-700 dark:text-gray-300">
                  {STATE_NAMES[si]} {si === s ? '← current' : ''}
                </td>
                {row.map((q, ai) => (
                  <td
                    key={ai}
                    className="py-1 px-2 font-mono"
                    style={{
                      color: si === s && ai === a ? '#ef4444' : ACTION_COLORS[ai],
                      fontWeight: si === s && ai === a ? 800 : 500,
                    }}
                  >
                    {q.toFixed(3)}
                    {si === s && ai === a && <span className="ml-1 text-xs text-red-400">→{newQ.toFixed(3)}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TD error display */}
      <div className="mb-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-sm">
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Current transition: <span className="font-bold text-indigo-600">{STATE_NAMES[s]}</span> →{' '}
          <strong>{ACTION_NAMES[a]}</strong> → <span className="font-bold text-emerald-600">{STATE_NAMES[sNext]}</span>,{' '}
          r={r}
        </p>
        <p className="mt-1 font-mono text-sm">
          Target = r + γ·max Q(S') = {r} + {gamma.toFixed(2)} × {maxQNext.toFixed(3)} ={' '}
          <strong className="text-emerald-600">{target.toFixed(3)}</strong>
        </p>
        <p className="font-mono text-sm">
          TD error = {target.toFixed(3)} − {Q[s][a].toFixed(3)} ={' '}
          <strong className={tdError >= 0 ? 'text-green-600' : 'text-red-600'}>{tdError.toFixed(3)}</strong>
        </p>
        <p className="font-mono text-sm">
          New Q = {Q[s][a].toFixed(3)} + {alpha.toFixed(2)} × {tdError.toFixed(3)} ={' '}
          <strong className="text-indigo-600">{newQ.toFixed(3)}</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={step}
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600">
          Step
        </button>
        <button onClick={() => { for(let i=0;i<20;i++) { /* batch update simplified */ } step(); step(); step(); step(); step(); }}
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600">
          Run 5 Steps
        </button>
        <button onClick={reset}
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
          Reset
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import numpy as np

class QLearningAgent:
    def __init__(self, nS, nA, alpha=0.1, gamma=0.99, epsilon=0.1):
        self.Q       = np.zeros((nS, nA))
        self.alpha   = alpha
        self.gamma   = gamma
        self.epsilon = epsilon

    def select_action(self, s):
        """Epsilon-greedy action selection."""
        if np.random.random() < self.epsilon:
            return np.random.randint(self.Q.shape[1])
        return np.argmax(self.Q[s])

    def update(self, s, a, r, s_next, done):
        """Off-policy TD(0) update (Q-learning)."""
        if done:
            target = r
        else:
            target = r + self.gamma * np.max(self.Q[s_next])
        td_error = target - self.Q[s, a]
        self.Q[s, a] += self.alpha * td_error
        return td_error

# Simple CliffWorld environment (4x12 grid)
class CliffWorld:
    def __init__(self):
        self.height, self.width = 4, 12
        self.start = (3, 0)
        self.goal  = (3, 11)
        self.cliff = [(3, c) for c in range(1, 11)]
        self.reset()

    def reset(self):
        self.pos = list(self.start)
        return self._state()

    def _state(self):
        return self.pos[0] * self.width + self.pos[1]

    def step(self, action):
        r, c = self.pos
        dr, dc = [(-1,0),(1,0),(0,-1),(0,1)][action]
        nr = max(0, min(self.height-1, r+dr))
        nc = max(0, min(self.width-1,  c+dc))
        self.pos = [nr, nc]

        if (nr, nc) == self.goal:
            return self._state(), 0.0, True
        elif (nr, nc) in self.cliff:
            self.pos = list(self.start)
            return self._state(), -100.0, False
        return self._state(), -1.0, False

env   = CliffWorld()
agent = QLearningAgent(nS=4*12, nA=4, alpha=0.1, gamma=1.0, epsilon=0.1)

episode_returns = []
for ep in range(500):
    s      = env.reset()
    total  = 0
    for _ in range(1000):
        a          = agent.select_action(s)
        s_next, r, done = env.step(a)
        agent.update(s, a, r, s_next, done)
        total += r
        s = s_next
        if done:
            break
    episode_returns.append(total)

print(f"Mean return (last 100 episodes): {np.mean(episode_returns[-100:]):.1f}")
print(f"Optimal Q for start: {agent.Q[env._state()]}")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function QLearning() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Q-Learning
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Off-policy temporal difference control — learning the optimal action-value function
          directly from experience without a model of the environment.
        </p>
      </div>

      <QLearningDemo />

      <DefinitionBlock
        label="Definition 1.1"
        title="Q-Learning Update Rule"
        definition="Q-learning (Watkins, 1989) is an off-policy TD control algorithm. Given a transition $(s, a, r, s')$, the Q-value update is: $Q(s,a) \leftarrow Q(s,a) + \alpha \left[r + \gamma \max_{a'} Q(s', a') - Q(s,a)\right]$, where $\alpha \in (0,1]$ is the learning rate, $\gamma \in [0,1)$ is the discount factor, and $r + \gamma \max_{a'} Q(s', a')$ is the TD target. The TD error $\delta = r + \gamma \max_{a'} Q(s',a') - Q(s,a)$ measures how wrong the current estimate is."
        notation="Q-learning is off-policy: the behavior policy (e.g., $\epsilon$-greedy) used to collect data can differ from the target policy (greedy $\arg\max_a Q$). The $\max$ operator in the target uses the greedy policy — Q-learning directly estimates $Q^*$ regardless of the behavior policy, unlike SARSA which estimates $Q^{\pi_{behavior}}$."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="SARSA vs Q-Learning"
        definition="SARSA (on-policy TD control) uses the actual next action $a'$ taken by the behavior policy: $Q(s,a) \leftarrow Q(s,a) + \alpha[r + \gamma Q(s', a') - Q(s,a)]$. Q-learning uses $\max_{a'} Q(s', a')$ regardless of what $a'$ was selected. SARSA is safer: it converges to the optimal policy within the constraints of the behavior policy (e.g., it learns to avoid cliffs even with $\epsilon$-greedy). Q-learning converges to the true optimum but may take riskier paths during training."
        notation="The CliffWorld example (Sutton & Barto): Q-learning learns the optimal path along the cliff edge; SARSA learns a safer detour away from the cliff. Both converge to the same optimal policy in the limit $\\epsilon \\to 0$, but Q-learning has higher variance during training."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Q-Learning Convergence"
        statement="Q-learning converges to $Q^*$ with probability 1, given: (1) every state-action pair is visited infinitely often; (2) learning rates satisfy $\sum_t \alpha_t(s,a) = \infty$ and $\sum_t \alpha_t(s,a)^2 < \infty$ for all $(s,a)$ (Robbins-Monro conditions); (3) bounded rewards $|r| \leq R_{max}$; (4) the MDP is finite and ergodic."
        proof="Q-learning is a stochastic approximation algorithm. Define the Q-learning operator $F(Q)(s,a) = r(s,a) + \gamma \sum_{s'} p(s'|s,a) \max_{a'} Q(s',a')$. This is a $\gamma$-contraction in $L^\infty$: $\|F(Q) - F(Q')\|_\infty \leq \gamma \|Q - Q'\|_\infty$. By the Robbins-Monro theorem applied to contractive operators (Tsitsiklis, 1994), stochastic approximation with decreasing step sizes and the contraction property guarantees convergence to the unique fixed point $Q^*$. The key steps: (a) show the noise (Monte Carlo sampling of $s'$) is zero-mean given $s,a$; (b) use the contraction to bound the error. $\square$"
        corollaries={[
          'Tabular Q-learning requires storing $|\\mathcal{S}| \\times |\\mathcal{A}|$ values — infeasible for large state spaces. Function approximation (DQN) replaces the table with a neural network.',
          'Double Q-learning reduces the overestimation bias of the max operator by using separate networks for action selection and evaluation: target $= r + \\gamma Q_{\\theta^-}(s\', \\arg\\max_{a\'} Q_\\theta(s\',a\'))$.',
        ]}
      />

      <ExampleBlock
        title="Q-Learning in CliffWorld: Safe vs Optimal Paths"
        difficulty="advanced"
        problem="In CliffWorld (4×12 grid, cliff at row 3, cols 1-10, goal at (3,11)), compare Q-learning and SARSA behavior with ε=0.1 greedy exploration. Which learns a better policy? Which has better online performance?"
        solution={[
          {
            step: 'Q-learning target policy (theoretical optimum)',
            explanation:
              'Q-learning estimates $Q^*$ — the optimal value function for a fully greedy agent. The optimal path is along the cliff edge (row 3, columns 0→11), 11 steps, return = -11. This is the minimum-step path but risky: one random ε-greedy step falls into the cliff (return = -100 + cost of restart).',
          },
          {
            step: 'SARSA behavior policy',
            explanation:
              'SARSA estimates $Q^{\\pi_{\\epsilon-greedy}}$. With ε=0.1, the agent sometimes steps into the cliff, so the optimal SARSA policy detours to row 2 (safer path away from cliff). Total steps ≈ 15-17, return ≈ -15 to -17. Worse theoretically but safer with exploration.',
          },
          {
            step: 'Online performance comparison',
            explanation:
              'During training: SARSA has much better average return because it avoids the cliff despite ε-exploration. Q-learning has worse returns during training (cliff falls degrade average). At evaluation (ε=0): Q-learning achieves -11 (optimal), SARSA achieves -17 (suboptimal detour).',
          },
          {
            step: 'Takeaway',
            explanation:
              'Q-learning is better if you only care about the final deployed policy. SARSA is better if online performance during training matters (safety-critical applications). This distinction between "learn optimal policy" vs "perform well while learning" is fundamental to RL.',
          },
        ]}
      />

      <WarningBlock title="Maximization Bias in Q-Learning">
        <p>
          The <InlineMath math="\max_{a'} Q(s',a')" /> operator in Q-learning introduces a
          systematic positive bias. When <InlineMath math="Q(s',a')" /> estimates are noisy, the maximum of noisy
          estimates overestimates the true maximum. This causes Q-learning to overestimate
          values, potentially leading to suboptimal policies. Example: in a state with 10 actions
          all having true <InlineMath math="Q=0" /> but noisy estimates <InlineMath math="Q \sim \mathcal{N}(0, \sigma^2)" />, the
          expected max is <InlineMath math="\sigma \sqrt{2\ln 10} > 0" />. Double Q-learning (van Hasselt, 2010)
          and Double DQN address this by using separate networks for action selection and
          value estimation.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="Q-Learning Agent in CliffWorld"
        runnable
      />
    </div>
  );
}
