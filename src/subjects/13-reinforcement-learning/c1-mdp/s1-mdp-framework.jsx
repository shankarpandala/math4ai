import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ---------------------------------------------------------------------------
// Grid World Interactive Component
// ---------------------------------------------------------------------------

const GRID_SIZE = 4;
// Layout: 0 = free, 1 = obstacle, 2 = terminal (goal), 3 = terminal (trap)
const GRID_LAYOUT = [
  [0, 0, 0, 2],
  [0, 1, 0, 3],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const REWARDS = [
  [0,    0,    0,    1],
  [0,    null, 0,   -1],
  [0,    0,    0,    0],
  [0,    0,    0,    0],
];

function GridWorld() {
  const [agentPos, setAgentPos] = useState({ r: 3, c: 0 });
  const [accumulated, setAccumulated] = useState(0);
  const [steps, setSteps] = useState(0);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');

  const cellSize = 72;
  const svgSize = GRID_SIZE * cellSize + 4;

  function moveAgent(dr, dc) {
    if (done) return;
    const nr = agentPos.r + dr;
    const nc = agentPos.c + dc;
    // Boundary check
    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) return;
    // Obstacle check
    if (GRID_LAYOUT[nr][nc] === 1) return;
    const reward = REWARDS[nr][nc] || 0;
    const newAccum = parseFloat((accumulated + reward).toFixed(2));
    setAgentPos({ r: nr, c: nc });
    setAccumulated(newAccum);
    setSteps((s) => s + 1);
    if (GRID_LAYOUT[nr][nc] === 2) {
      setDone(true);
      setMessage('Reached goal! +1 reward');
    } else if (GRID_LAYOUT[nr][nc] === 3) {
      setDone(true);
      setMessage('Fell into trap! -1 reward');
    } else {
      setMessage('');
    }
  }

  function reset() {
    setAgentPos({ r: 3, c: 0 });
    setAccumulated(0);
    setSteps(0);
    setDone(false);
    setMessage('');
  }

  function cellColor(r, c) {
    const type = GRID_LAYOUT[r][c];
    if (type === 1) return '#6b7280';
    if (type === 2) return '#16a34a';
    if (type === 3) return '#dc2626';
    return '#f9fafb';
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive 4×4 Grid World MDP
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Navigate the agent (blue) to the goal (green, reward +1). Avoid the trap (red, reward -1).
        Gray cells are obstacles. Use arrow buttons to move.
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
        {/* SVG Grid */}
        <svg width={svgSize} height={svgSize} style={{ flexShrink: 0 }}>
          {Array.from({ length: GRID_SIZE }, (_, r) =>
            Array.from({ length: GRID_SIZE }, (_, c) => {
              const isAgent = agentPos.r === r && agentPos.c === c;
              const x = c * cellSize + 2;
              const y = r * cellSize + 2;
              const bg = cellColor(r, c);
              return (
                <g key={`${r}-${c}`}>
                  <rect
                    x={x} y={y}
                    width={cellSize - 4} height={cellSize - 4}
                    rx={6}
                    fill={bg}
                    stroke="#d1d5db"
                    strokeWidth={1.5}
                  />
                  {/* State label */}
                  <text
                    x={x + 8} y={y + 16}
                    fontSize={9}
                    fill={GRID_LAYOUT[r][c] === 1 ? '#fff' : '#9ca3af'}
                    fontFamily="monospace"
                  >
                    s{r * GRID_SIZE + c}
                  </text>
                  {/* Reward label */}
                  {REWARDS[r][c] !== null && REWARDS[r][c] !== 0 && (
                    <text
                      x={x + (cellSize - 4) / 2} y={y + (cellSize - 4) / 2 + 4}
                      fontSize={13}
                      fontWeight="bold"
                      textAnchor="middle"
                      fill={REWARDS[r][c] > 0 ? '#15803d' : '#b91c1c'}
                    >
                      {REWARDS[r][c] > 0 ? '+1' : '-1'}
                    </text>
                  )}
                  {/* Obstacle label */}
                  {GRID_LAYOUT[r][c] === 1 && (
                    <text
                      x={x + (cellSize - 4) / 2} y={y + (cellSize - 4) / 2 + 4}
                      fontSize={18}
                      textAnchor="middle"
                      fill="#fff"
                    >
                      ✕
                    </text>
                  )}
                  {/* Agent */}
                  {isAgent && (
                    <circle
                      cx={x + (cellSize - 4) / 2}
                      cy={y + (cellSize - 4) / 2}
                      r={14}
                      fill="#3b82f6"
                      stroke="#1d4ed8"
                      strokeWidth={2}
                    />
                  )}
                  {isAgent && (
                    <text
                      x={x + (cellSize - 4) / 2} y={y + (cellSize - 4) / 2 + 5}
                      fontSize={13}
                      textAnchor="middle"
                      fill="white"
                      fontWeight="bold"
                    >
                      A
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* Arrow buttons */}
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => moveAgent(-1, 0)}
              disabled={done}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200 disabled:opacity-40 dark:bg-indigo-900/40 dark:text-indigo-300"
              aria-label="Move up"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => moveAgent(0, -1)}
              disabled={done}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200 disabled:opacity-40 dark:bg-indigo-900/40 dark:text-indigo-300"
              aria-label="Move left"
            >
              ◀
            </button>
            <button
              onClick={() => moveAgent(1, 0)}
              disabled={done}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200 disabled:opacity-40 dark:bg-indigo-900/40 dark:text-indigo-300"
              aria-label="Move down"
            >
              ▼
            </button>
            <button
              onClick={() => moveAgent(0, 1)}
              disabled={done}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200 disabled:opacity-40 dark:bg-indigo-900/40 dark:text-indigo-300"
              aria-label="Move right"
            >
              ▶
            </button>
          </div>

          <button
            onClick={reset}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Reset
          </button>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">State:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                s{agentPos.r * GRID_SIZE + agentPos.c} ({agentPos.r},{agentPos.c})
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">Steps:</span>
              <span className="font-mono text-gray-800 dark:text-gray-200">{steps}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">Reward:</span>
              <span
                className={`font-mono font-bold ${accumulated > 0 ? 'text-green-600 dark:text-green-400' : accumulated < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}
              >
                {accumulated}
              </span>
            </div>
          </div>

          {message && (
            <div className={`rounded-lg px-3 py-2 text-sm font-medium ${accumulated > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-800 dark:border-indigo-700/40 dark:bg-indigo-900/20 dark:text-indigo-300">
        Each grid cell is a <strong>state</strong> <InlineMath math="s \in \mathcal{S}" />.
        Your moves are <strong>actions</strong> <InlineMath math="a \in \mathcal{A}" />.
        Here the environment is deterministic: <InlineMath math="P(s'|s,a) \in \{0,1\}" />.
        Real MDPs have stochastic transitions.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const MDP_CODE = `import numpy as np

# Simple 4x4 Grid World — Value Iteration
# States: 16 cells, Actions: 0=up, 1=down, 2=left, 3=right
# Terminal states: 3 (goal, +1), 7 (trap, -1)

GRID_SIZE = 4
N_STATES = GRID_SIZE * GRID_SIZE
N_ACTIONS = 4
GAMMA = 0.9

# Transition and reward functions
def get_next_state(s, a):
    r, c = s // GRID_SIZE, s % GRID_SIZE
    dr, dc = [(-1,0),(1,0),(0,-1),(0,1)][a]
    nr, nc = r + dr, c + dc
    # Boundary
    if not (0 <= nr < GRID_SIZE and 0 <= nc < GRID_SIZE):
        return s  # stay in place
    ns = nr * GRID_SIZE + nc
    # Obstacle at state 5 (row 1, col 1)
    if ns == 5:
        return s
    return ns

def get_reward(s, a, ns):
    if ns == 3: return  1.0   # goal
    if ns == 7: return -1.0   # trap
    return 0.0

# Value Iteration
def value_iteration(gamma=GAMMA, theta=1e-6, max_iter=1000):
    V = np.zeros(N_STATES)
    terminal = {3, 7}

    for iteration in range(max_iter):
        delta = 0
        V_new = V.copy()
        for s in range(N_STATES):
            if s in terminal:
                continue
            q_values = []
            for a in range(N_ACTIONS):
                ns = get_next_state(s, a)
                r  = get_reward(s, a, ns)
                q_values.append(r + gamma * V[ns])
            V_new[s] = max(q_values)
            delta = max(delta, abs(V_new[s] - V[s]))
        V = V_new
        if delta < theta:
            print(f"Converged after {iteration + 1} iterations")
            break

    return V

# Extract greedy policy
def extract_policy(V):
    policy = np.zeros(N_STATES, dtype=int)
    action_names = ['↑', '↓', '←', '→']
    terminal = {3, 7}
    for s in range(N_STATES):
        if s in terminal:
            continue
        q_values = []
        for a in range(N_ACTIONS):
            ns = get_next_state(s, a)
            r  = get_reward(s, a, ns)
            q_values.append(r + 0.9 * V[ns])
        policy[s] = np.argmax(q_values)
    return policy

V_star = value_iteration()
pi_star = extract_policy(V_star)

print("\\nOptimal Value Function V*(s):")
print(V_star.reshape(GRID_SIZE, GRID_SIZE).round(3))

print("\\nOptimal Policy π*(s)  [↑↓←→]:")
action_symbols = ['↑', '↓', '←', '→']
policy_grid = np.array([action_symbols[a] for a in pi_star]).reshape(GRID_SIZE, GRID_SIZE)
print(policy_grid)
`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Bellman, R.',
    year: 1957,
    title: 'Dynamic Programming',
    venue: 'Princeton University Press',
    url: 'https://press.princeton.edu/books/paperback/9780691146683/dynamic-programming',
    type: 'foundational',
    whyImportant: 'Introduced the principle of optimality and the Bellman equation, providing the mathematical foundation for all dynamic programming and reinforcement learning algorithms.',
  },
  {
    authors: 'Sutton, R. S. & Barto, A. G.',
    year: 2018,
    title: 'Reinforcement Learning: An Introduction (2nd ed.)',
    venue: 'MIT Press',
    url: 'http://incompleteideas.net/book/the-book-2nd.html',
    type: 'textbook',
    whyImportant: 'The definitive textbook on reinforcement learning. Covers MDPs, dynamic programming, temporal-difference learning, policy gradient methods. Freely available online.',
  },
  {
    authors: 'Puterman, M. L.',
    year: 1994,
    title: 'Markov Decision Processes: Discrete Stochastic Dynamic Programming',
    venue: 'Wiley',
    url: 'https://www.wiley.com/en-us/Markov+Decision+Processes%3A+Discrete+Stochastic+Dynamic+Programming-p-9780471727828',
    type: 'textbook',
    whyImportant: 'The comprehensive mathematical treatment of MDPs, covering existence, uniqueness, and convergence of optimal policies for both finite and infinite-horizon problems.',
  },
  {
    authors: 'Howard, R. A.',
    year: 1960,
    title: 'Dynamic Programming and Markov Processes',
    venue: 'MIT Press',
    url: 'https://mitpress.mit.edu/9780262580007/',
    type: 'foundational',
    whyImportant: 'Introduced policy iteration and the formal MDP framework as used in operations research. First systematic computational approach to solving sequential decision problems.',
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MDPFramework() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Markov Decision Processes
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The mathematical framework for sequential decision making under uncertainty — the
          foundation of reinforcement learning.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          <strong>Richard Bellman</strong> developed dynamic programming in the 1950s at RAND
          Corporation, introducing the <em>principle of optimality</em> and the recursive
          equations bearing his name. His 1957 book "Dynamic Programming" provided the
          mathematical tools later adopted by reinforcement learning.
        </p>
        <p className="mt-2">
          The modern RL framework was consolidated by <strong>Sutton & Barto</strong>, whose
          landmark textbook "Reinforcement Learning: An Introduction" (1998, 2nd ed. 2018)
          unified temporal-difference learning, dynamic programming, and Monte Carlo methods
          under the MDP umbrella. Today, MDPs underlie AlphaGo, ChatGPT's RLHF training, and
          virtually all deep RL systems.
        </p>
      </NoteBlock>

      {/* Interactive Grid World */}
      <GridWorld />

      {/* Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          What is an MDP?
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          An agent interacts with an environment over discrete time steps. At each step{' '}
          <InlineMath math="t" />, the agent observes state{' '}
          <InlineMath math="s_t" />, chooses action <InlineMath math="a_t" />, receives
          reward <InlineMath math="r_t" />, and transitions to new state{' '}
          <InlineMath math="s_{t+1}" />. The goal: find a <em>policy</em> (strategy)
          maximizing cumulative discounted reward.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The <strong>Markov property</strong> is the key assumption: the future depends only
          on the current state, not the full history. Formally,{' '}
          <InlineMath math="P(s_{t+1}|s_t, a_t, s_{t-1}, a_{t-1}, \ldots) = P(s_{t+1}|s_t, a_t)" />.
          This memorylessness makes the problem tractable.
        </p>
      </section>

      {/* MDP Definition */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Markov Decision Process"
        definition="A Markov Decision Process is a 5-tuple $\mathcal{M} = (\mathcal{S}, \mathcal{A}, P, R, \gamma)$ where: $\mathcal{S}$ is the state space; $\mathcal{A}$ is the action space; $P: \mathcal{S} \times \mathcal{A} \times \mathcal{S} \to [0,1]$ is the transition kernel with $P(s'|s,a) = \Pr[s_{t+1}=s' \mid s_t=s, a_t=a]$; $R: \mathcal{S} \times \mathcal{A} \to \mathbb{R}$ is the reward function; $\gamma \in [0,1)$ is the discount factor controlling the trade-off between immediate and future rewards."
        notation="Finite MDPs have $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions. The transition matrix for fixed $a$ is a $|\mathcal{S}| \times |\mathcal{S}|$ stochastic matrix. When $\gamma \to 0$ the agent is myopic; as $\gamma \to 1$ it values future rewards equally."
      />

      {/* Policy Definition */}
      <DefinitionBlock
        label="Definition 1.2"
        title="Policy"
        definition="A policy $\pi$ specifies the agent's behavior. A deterministic policy $\pi: \mathcal{S} \to \mathcal{A}$ maps each state to an action. A stochastic policy $\pi: \mathcal{S} \times \mathcal{A} \to [0,1]$ gives $\pi(a|s) = \Pr[a_t = a \mid s_t = s]$ with $\sum_a \pi(a|s) = 1$ for all $s$. An optimal policy $\pi^*$ maximizes expected cumulative reward from every state simultaneously."
        notation="Stationary policies (no time dependence) suffice for infinite-horizon discounted MDPs. Non-stationary policies are sometimes needed for finite-horizon problems."
      />

      {/* Value Function */}
      <DefinitionBlock
        label="Definition 1.3"
        title="Value Function"
        definition="The state-value function of policy $\pi$ is: $V^\pi(s) = \mathbb{E}_\pi\!\left[\sum_{t=0}^\infty \gamma^t R(s_t, a_t) \;\middle|\; s_0 = s\right]$ — the expected discounted return starting from state $s$ following policy $\pi$. The action-value (Q) function is: $Q^\pi(s,a) = \mathbb{E}_\pi\!\left[\sum_{t=0}^\infty \gamma^t R(s_t, a_t) \;\middle|\; s_0 = s,\, a_0 = a\right]$."
        notation="$V^\pi(s) = \sum_a \pi(a|s)\, Q^\pi(s,a)$. The return $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k}$ satisfies the recursion $G_t = R_t + \gamma G_{t+1}$."
      />

      {/* Bellman Expectation */}
      <TheoremBlock
        label="Theorem 1.1"
        title="Bellman Expectation Equation"
        statement="For any policy $\pi$, the value function satisfies the Bellman consistency equation: $V^\pi(s) = \sum_{a} \pi(a|s)\!\left[R(s,a) + \gamma \sum_{s'} P(s'|s,a)\, V^\pi(s')\right]$ for all $s \in \mathcal{S}$. In matrix form: $V^\pi = R^\pi + \gamma P^\pi V^\pi$, where $R^\pi_s = \sum_a \pi(a|s)R(s,a)$ and $P^\pi_{ss'} = \sum_a \pi(a|s)P(s'|s,a)$."
        proof="By definition, $V^\pi(s) = \mathbb{E}_\pi[G_0 \mid s_0 = s]$. Using $G_0 = R_0 + \gamma G_1$: $V^\pi(s) = \mathbb{E}_\pi[R_0 + \gamma G_1 \mid s_0 = s] = \sum_a \pi(a|s)\left[R(s,a) + \gamma \sum_{s'} P(s'|s,a)\mathbb{E}_\pi[G_1 \mid s_1 = s']\right] = \sum_a \pi(a|s)\left[R(s,a) + \gamma \sum_{s'} P(s'|s,a)V^\pi(s')\right]$. The matrix equation follows from writing this for all states simultaneously. Since $\gamma < 1$, $(I - \gamma P^\pi)$ is invertible and the unique solution is $V^\pi = (I - \gamma P^\pi)^{-1}R^\pi$. $\square$"
        corollaries={[
          "The Bellman equation is a fixed-point equation: $V^\\pi$ is the unique fixed point of the Bellman operator $\\mathcal{T}^\\pi V = R^\\pi + \\gamma P^\\pi V$.",
          "The operator $\\mathcal{T}^\\pi$ is a $\\gamma$-contraction in the $\\sup$-norm, so iterating $V \\leftarrow \\mathcal{T}^\\pi V$ converges geometrically to $V^\\pi$.",
          "Direct solution via matrix inversion is $O(|\\mathcal{S}|^3)$ — feasible for small MDPs but impractical for large state spaces.",
        ]}
      />

      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Bellman Expectation Equation — Expanded Form
        </h2>
        <BlockMath math="V^\pi(s) = \sum_{a \in \mathcal{A}} \pi(a|s) \left[ R(s,a) + \gamma \sum_{s' \in \mathcal{S}} P(s'|s,a)\, V^\pi(s') \right]" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          This equation expresses the value as a weighted average over actions (weighted by
          the policy), and for each action, the immediate reward plus the discounted expected
          future value. The analogous equation for <InlineMath math="Q^\pi" /> is:
        </p>
        <BlockMath math="Q^\pi(s,a) = R(s,a) + \gamma \sum_{s'} P(s'|s,a) \sum_{a'} \pi(a'|s')\, Q^\pi(s',a')" />
      </section>

      {/* Optimal Value */}
      <DefinitionBlock
        label="Definition 1.4"
        title="Optimal Value Function and Bellman Optimality"
        definition="The optimal value function $V^*(s) = \max_\pi V^\pi(s)$ satisfies the Bellman optimality equation: $V^*(s) = \max_{a \in \mathcal{A}}\left[R(s,a) + \gamma \sum_{s'} P(s'|s,a)\, V^*(s')\right]$. The optimal Q-function is $Q^*(s,a) = R(s,a) + \gamma \sum_{s'} P(s'|s,a) V^*(s')$, so $V^*(s) = \max_a Q^*(s,a)$. The optimal policy is $\pi^*(a|s) = \arg\max_a Q^*(s,a)$ (greedy w.r.t. $Q^*$)."
        notation="Unlike the Bellman expectation equation (linear in $V^\pi$), the optimality equation is nonlinear due to the $\max$ operator, requiring iterative algorithms like value iteration or policy iteration."
      />

      {/* 3-state MDP example */}
      <ExampleBlock
        title="3-State MDP — Hand Computation"
        problem="Solve the following MDP by value iteration. States $\{s_0, s_1, s_2\}$ where $s_2$ is terminal (absorbing). Single action from each state. Transitions: from $s_0$: go to $s_1$ with $R = 0$. From $s_1$: go to $s_2$ with $R = 1$. $\gamma = 0.9$. Find $V^*(s_0)$, $V^*(s_1)$, $V^*(s_2)$."
        difficulty="intermediate"
        solution={[
          {
            step: 'Initialize: $V_0(s_0) = V_0(s_1) = V_0(s_2) = 0$',
            explanation: 'Start with all values at 0. Terminal state $s_2$ always has $V(s_2) = 0$ (no future rewards).',
          },
          {
            step: 'First iteration: apply Bellman update to each state',
            formula: 'V_1(s_1) = R(s_1) + \\gamma V_0(s_2) = 1 + 0.9 \\times 0 = 1',
            explanation: 'From $s_1$, we get reward 1 and move to terminal $s_2$ (value 0).',
          },
          {
            step: 'Update $s_0$',
            formula: 'V_1(s_0) = R(s_0) + \\gamma V_0(s_1) = 0 + 0.9 \\times 0 = 0',
            explanation: 'From $s_0$, reward 0 plus discounted value of $s_1$ (still 0 in iteration 0).',
          },
          {
            step: 'Second iteration',
            formula: 'V_2(s_0) = 0 + 0.9 \\times V_1(s_1) = 0.9 \\times 1 = 0.9',
            explanation: 'Now $s_1$ has value 1, so $s_0$ picks up discounted value 0.9.',
          },
          {
            step: 'Convergence: Values stabilize',
            formula: 'V^*(s_0) = 0.9, \\quad V^*(s_1) = 1, \\quad V^*(s_2) = 0',
            explanation: 'The values have converged. Intuitively, from $s_0$ we get reward 1 after 2 steps, discounted by $\\gamma = 0.9$ once: $0 + 0.9 \\times 1 = 0.9$.',
          },
        ]}
      />

      {/* Warning */}
      <WarningBlock title="Practical Challenges: Curse of Dimensionality and Partial Observability">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>Curse of dimensionality:</strong> In a robot with 20 continuous joint
              angles discretized to 100 values each, <InlineMath math="|\mathcal{S}| = 100^{20}" /> —
              utterly intractable for tabular methods. Deep RL replaces the value table with a
              neural network, but the underlying MDP structure persists.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>Partial Observability (POMDPs):</strong> When the agent cannot directly
              observe the full state (e.g., a robot in a dark room), the Markov property fails
              for observations. POMDPs maintain a <em>belief state</em> (posterior over states)
              as the sufficient statistic — but this belief state lives in a continuous simplex,
              making exact solutions exponentially hard.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>Reward engineering:</strong> Specifying <InlineMath math="R(s,a)" />
              correctly is notoriously difficult. Reward hacking (achieving high reward via
              unintended behavior) and sparse rewards (reward only at the terminal goal)
              are active research problems. RLHF addresses this by learning rewards from
              human preferences.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* Python Code */}
      <PythonCode
        code={MDP_CODE}
        language="python"
        title="Grid World MDP — Value Iteration (NumPy)"
        runnable
      />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
