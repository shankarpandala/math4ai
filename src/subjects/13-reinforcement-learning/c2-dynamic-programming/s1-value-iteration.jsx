import React, { useState, useCallback } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Value Iteration Convergence Plot
// ---------------------------------------------------------------------------

// Simple 4-state chain MDP: S0 - S1 - S2 - S3(terminal)
// R(S0→S1)=0, R(S1→S2)=0, R(S2→S3)=1
const nS = 4;
const gamma = 0.9;
const R = [0, 0, 0, 1]; // reward for going to next state
const V_STAR = [
  gamma ** 2, // S0: 0.9^2 * 1
  gamma ** 1, // S1: 0.9^1 * 1
  gamma ** 0, // S2: 1
  0,          // S3: terminal
];

function computeHistory(maxIter = 30) {
  let V = [0, 0, 0, 0];
  const history = [{ V: [...V], delta: null }];
  for (let i = 0; i < maxIter; i++) {
    const newV = [...V];
    for (let s = 0; s < nS - 1; s++) {
      newV[s] = R[s] + gamma * V[s + 1];
    }
    const delta = Math.max(...newV.map((v, s) => Math.abs(v - V[s])));
    V = newV;
    history.push({ V: [...V], delta });
    if (delta < 1e-8) break;
  }
  return history;
}

const HISTORY = computeHistory(30);
const MAX_ITER = HISTORY.length - 1;

const PLOT_W = 340;
const PLOT_H = 180;
const PAD = { top: 16, right: 16, bottom: 36, left: 44 };

function ConvergencePlot() {
  const [showIter, setShowIter] = useState(10);

  const displayHistory = HISTORY.slice(0, showIter + 1);
  const stateColors = ['#6366f1', '#10b981', '#f59e0b', '#94a3b8'];
  const maxVal = Math.max(...V_STAR) + 0.1;

  const plotW = PLOT_W - PAD.left - PAD.right;
  const plotH = PLOT_H - PAD.top - PAD.bottom;

  function px(iter) {
    return PAD.left + (iter / MAX_ITER) * plotW;
  }
  function py(val) {
    return PAD.top + plotH - (val / maxVal) * plotH;
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Value Iteration Convergence
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag the slider to see how value estimates improve over iterations for a 4-state chain MDP.
        Dashed lines show true <InlineMath math="V^*" /> values.
      </p>

      <svg width={PLOT_W} height={PLOT_H} className="mx-auto block mb-4">
        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#d1d5db" strokeWidth={1} />
        <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#d1d5db" strokeWidth={1} />

        {/* Y-axis labels */}
        {[0, 0.5, 1.0].map((v) => (
          <g key={v}>
            <text x={PAD.left - 4} y={py(v) + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{v.toFixed(1)}</text>
            <line x1={PAD.left - 2} y1={py(v)} x2={PAD.left + plotW} y2={py(v)} stroke="#f3f4f6" strokeWidth={1} className="dark:stroke-gray-800" />
          </g>
        ))}

        {/* X-axis labels */}
        {[0, 10, 20, 30].map((v) => (
          <text key={v} x={px(v)} y={PAD.top + plotH + 16} textAnchor="middle" fontSize={9} fill="#9ca3af">
            {v}
          </text>
        ))}
        <text x={PAD.left + plotW / 2} y={PLOT_H - 4} textAnchor="middle" fontSize={9} fill="#6b7280">Iteration</text>

        {/* True V* lines (dashed) */}
        {[0, 1, 2].map((s) => (
          <line
            key={`vstar-${s}`}
            x1={PAD.left} y1={py(V_STAR[s])}
            x2={PAD.left + plotW} y2={py(V_STAR[s])}
            stroke={stateColors[s]} strokeWidth={1} strokeDasharray="4 3" opacity={0.4}
          />
        ))}

        {/* Value curves */}
        {[0, 1, 2].map((s) => {
          const pts = displayHistory.map((h, i) => `${px(i)},${py(h.V[s])}`).join(' ');
          return (
            <polyline
              key={`s${s}`}
              points={pts}
              fill="none"
              stroke={stateColors[s]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Current iteration marker */}
        <line
          x1={px(showIter)} y1={PAD.top}
          x2={px(showIter)} y2={PAD.top + plotH}
          stroke="#374151" strokeWidth={1} strokeDasharray="3 2" opacity={0.5}
        />

        {/* Legend */}
        {[0, 1, 2].map((s) => (
          <g key={`leg-${s}`}>
            <line x1={PAD.left + 10} y1={PAD.top + 10 + s * 14} x2={PAD.left + 26} y2={PAD.top + 10 + s * 14}
              stroke={stateColors[s]} strokeWidth={2} />
            <text x={PAD.left + 30} y={PAD.top + 14 + s * 14} fontSize={9} fill={stateColors[s]}>S{s}</text>
          </g>
        ))}
      </svg>

      <div>
        <div className="mb-1 flex justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Iteration</label>
          <span className="font-mono text-sm font-bold text-gray-600 dark:text-gray-400">{showIter}</span>
        </div>
        <input
          type="range" min={0} max={MAX_ITER} step={1} value={showIter}
          onChange={(e) => setShowIter(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-indigo-500"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((s) => (
          <div key={s} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400" style={{ color: stateColors[s] }}>S{s}</p>
            <p className="font-mono text-sm font-bold" style={{ color: stateColors[s] }}>
              {HISTORY[showIter]?.V[s].toFixed(4)}
            </p>
            <p className="text-xs text-gray-400">V*={V_STAR[s].toFixed(4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import numpy as np

def value_iteration(P, R, gamma=0.9, theta=1e-8, max_iter=1000):
    """
    P: transition matrix P[s,a,s'] shape (nS, nA, nS)
    R: reward matrix R[s,a] shape (nS, nA)
    Returns: V* and optimal policy
    """
    nS, nA = R.shape
    V = np.zeros(nS)
    history = [V.copy()]

    for i in range(max_iter):
        # Bellman optimality update (vectorized)
        # Q[s,a] = R[s,a] + gamma * sum_s' P[s,a,s'] * V[s']
        Q = R + gamma * np.einsum('san,n->sa', P, V)  # (nS, nA)
        V_new = Q.max(axis=1)                           # (nS,)

        delta = np.max(np.abs(V_new - V))
        V = V_new
        history.append(V.copy())

        if delta < theta:
            print(f"Converged at iteration {i+1}, delta={delta:.2e}")
            break

    # Greedy policy
    Q_star = R + gamma * np.einsum('san,n->sa', P, V)
    policy  = Q_star.argmax(axis=1)

    return V, policy, np.array(history)

# Example: 4x4 GridWorld
# States 0-15, goal at state 15 (terminal)
nS, nA = 16, 4  # 4 actions: up/down/left/right
P = np.zeros((nS, nA, nS))
R = np.full((nS, nA), -1.0)  # -1 per step

# Simplified transition setup (borders stay in place)
for s in range(15):
    for a in range(4):
        s_next = s  # default: stay (wall)
        r, c = s // 4, s % 4
        if a == 0 and r > 0: s_next = s - 4   # up
        if a == 1 and r < 3: s_next = s + 4   # down
        if a == 2 and c > 0: s_next = s - 1   # left
        if a == 3 and c < 3: s_next = s + 1   # right
        P[s, a, s_next] = 1.0
        if s_next == 15:
            R[s, a] = 0.0  # no penalty for reaching goal

P[15, :, 15] = 1.0  # terminal state

V, policy, history = value_iteration(P, R, gamma=0.99)
print("V* grid:")
print(V.reshape(4, 4).round(2))
print("Policy grid:")
arrows = {0:'↑', 1:'↓', 2:'←', 3:'→'}
print([[arrows[a] for a in row] for row in policy.reshape(4,4)])
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function ValueIteration() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Value Iteration
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The simplest exact dynamic programming algorithm — iteratively applying the Bellman
          optimality operator until convergence to <InlineMath math="V^*" />.
        </p>
      </div>

      <ConvergencePlot />

      <DefinitionBlock
        label="Definition 1.1"
        title="Value Iteration Algorithm"
        definition="Value iteration computes the optimal value function $V^*$ by repeatedly applying the Bellman optimality operator $\mathcal{T}^*$: Initialize $V_0$ arbitrarily (typically zero). Update: $V_{k+1}(s) = \max_a \sum_{s'} p(s'|s,a)[r(s,a,s') + \gamma V_k(s')]$ for all $s$. Stop when $\|V_{k+1} - V_k\|_\infty < \theta$ for convergence threshold $\theta$. Extract the greedy policy $\pi^*(s) = \arg\max_a \sum_{s'} p(s'|s,a)[r + \gamma V^*(s')]$."
        notation="Unlike policy iteration, value iteration does not maintain an explicit policy during computation — it directly computes $V^*$ via repeated Bellman backups. Each iteration requires $O(|\\mathcal{S}|^2 |\\mathcal{A}|)$ computations (for each state-action pair, sum over all successor states)."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Synchronous vs Asynchronous Value Iteration"
        definition="Synchronous value iteration updates all states simultaneously: $V_{k+1}(s) = (\mathcal{T}^* V_k)(s)$ for all $s$. Asynchronous value iteration updates states in any order, potentially using the most recent values: $V(s) \leftarrow (\mathcal{T}^* V)(s)$ one state at a time. Asynchronous VI converges with the same guarantee as long as every state is updated infinitely often. In-place (Gauss-Seidel) updates use the newest estimates immediately and often converge faster in practice."
        notation="Prioritized sweeping updates states in order of their Bellman error magnitude $|\\mathcal{T}^*V(s) - V(s)|$, focusing computation on states whose values are changing most — a key efficiency improvement for large state spaces."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Convergence and Error Bound for Value Iteration"
        statement="Let $V_k$ be the iterate after $k$ steps of value iteration starting from $V_0$. Then: (1) $\|V_k - V^*\|_\infty \leq \gamma^k \|V_0 - V^*\|_\infty$. (2) The greedy policy $\pi_k$ with respect to $V_k$ satisfies: $\|V^{\pi_k} - V^*\|_\infty \leq \frac{2\gamma}{1-\gamma} \|V_k - V^*\|_\infty$. A stopping criterion of $\|V_{k+1} - V_k\|_\infty \leq \theta$ guarantees $\|V_k - V^*\|_\infty \leq \frac{\gamma\theta}{1-\gamma}$."
        proof="(1) By the $\gamma$-contraction of $\mathcal{T}^*$: $\|V_k - V^*\|_\infty = \|\mathcal{T}^* V_{k-1} - \mathcal{T}^* V^*\|_\infty \leq \gamma \|V_{k-1} - V^*\|_\infty \leq \ldots \leq \gamma^k \|V_0 - V^*\|_\infty$. (2) For the greedy policy $\\pi_k$: $V^*(s) - V^{\\pi_k}(s) = Q^*(s,\\pi^*(s)) - Q^*(s,\\pi_k(s)) \leq 0 + 2\\gamma\|V_k-V^*\|_\infty/(1-\\gamma)$ using the performance difference lemma. (3) From $\\|V_{k+1}-V_k\\|_\\infty < \\theta$: $\\|V_k - V^*\\|_\\infty \\leq \\|V_{k+1}-V_k\\|_\\infty/(1-\\gamma) \\leq \\gamma\\theta/(1-\\gamma)$. $\\square$"
        corollaries={[
          'For $\\gamma=0.99$ and target error $\\epsilon=0.01$: need $\\gamma^k \\|V_0-V^*\\| \\leq \\epsilon$. With $\\|V_0-V^*\\| \\leq R_{max}/(1-\\gamma)=100$, need $k \\geq \\log(10000)/\\log(1/0.99) \\approx 921$ iterations.',
          'Asynchronous VI in cyclic order has the same convergence guarantee. Prioritized sweeping typically reduces the number of updates by 10-100x.',
        ]}
      />

      <ExampleBlock
        title="Value Iteration on GridWorld"
        difficulty="advanced"
        problem="4×4 GridWorld: 16 states, 4 actions (up/down/left/right), $\gamma=0.99$, reward $-1$ per step, $0$ at goal (state 15). Trace the first 2 iterations of value iteration starting from $V_0 = 0$."
        solution={[
          {
            step: 'Iteration 1: Only states adjacent to goal update',
            formula: 'V_1(s) = \\max_a [r(s,a) + 0.99 \\times V_0(\\cdot)] = \\max_a r(s,a)',
            explanation:
              'Since $V_0 = 0$ everywhere, the update simplifies to the immediate reward. States 11 and 14 (adjacent to goal 15) can reach goal in one step: $V_1(11) = V_1(14) = 0$ (reaching goal), while all others have $V_1 = -1$ (forced to move, cannot reach goal yet). Actually, reaching goal gives $r=0$, so $V_1(11) = V_1(14) = 0$.',
          },
          {
            step: 'Iteration 2: Propagates one step further',
            formula: 'V_2(s) = \\max_a [r(s,a) + 0.99 \\times V_1(s\'(s,a))]',
            explanation:
              'States at distance 2 from goal (7, 10, 13) can now see: going toward goal gives $-1 + 0.99 \\times 0 = -1$. This is the same as going elsewhere ($-1 + 0.99 \\times (-1) = -1.99$). So $V_2(s) = -1$ for distance-2 states vs $-1.99$ for worse alternatives.',
          },
          {
            step: 'General pattern: value propagates like ripples',
            explanation:
              'After $k$ iterations, accurate estimates reach states at Manhattan distance $k$ from the goal. With $\\gamma=0.99$, states at distance $d$ get $V^*(s) \\approx -d \\times 0.99^d / (1-0.99) \\approx -d$ (rough). Value iteration requires ~$k \\approx$ diameter of the MDP iterations to propagate values everywhere.',
          },
        ]}
      />

      <WarningBlock title="Value Iteration Requires a Known Model">
        <p>
          Value iteration is a <strong>model-based</strong> dynamic programming method requiring
          knowledge of the transition function $p(s'|s,a)$ and reward function $r(s,a,s')$. In
          most real-world settings, the model is unknown — an agent must learn from interactions
          with the environment. This is the model-free RL setting, addressed by Q-learning, SARSA,
          and policy gradient methods. Furthermore, value iteration is only tractable for
          tabular MDPs with a small, discrete state space. For continuous or high-dimensional
          state spaces (e.g., robot control, Atari games), function approximation (neural networks)
          replaces the value table — leading to Deep Q-Networks (DQN).
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="Value Iteration with NumPy — GridWorld Example"
        runnable
      />
    </div>
  );
}
