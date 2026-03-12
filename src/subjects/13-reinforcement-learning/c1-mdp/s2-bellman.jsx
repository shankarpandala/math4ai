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
// 3-State MDP Bellman Backup Visualizer
// ---------------------------------------------------------------------------

// States: S0 (start), S1 (middle), S2 (goal/terminal)
// Actions: from S0: go to S1 (r=0) or S2 (r=5); from S1: go to S2 (r=10)
// S2 is terminal with V=0

const GAMMA_INIT = 0.9;

function BellmanVisualizer() {
  const [gamma, setGamma] = useState(GAMMA_INIT);
  const [iter, setIter] = useState(0);

  // Value function iterations via Bellman optimality
  // V(S2) = 0 always (terminal)
  // V(S1) = max_a [ r(S1,a) + gamma * V(S2) ] = 10 + gamma*0 = 10
  // V(S0) = max_a [
  //    r(S0, 'A') + gamma*V(S1),   // action A: go to S1, r=0
  //    r(S0, 'B') + gamma*V(S2),   // action B: go to S2, r=5
  // ]

  // Iterative computation (starting from V=0 everywhere)
  function computeValues(itr) {
    let V = [0, 0, 0]; // V[0], V[1], V[2]
    for (let t = 0; t < itr; t++) {
      const newV = [...V];
      newV[2] = 0; // terminal
      newV[1] = 10 + gamma * V[2];
      newV[0] = Math.max(0 + gamma * V[1], 5 + gamma * V[2]);
      V = newV;
    }
    return V;
  }

  const V = computeValues(iter);
  const Vnext = computeValues(iter + 1);

  const W = 420, H = 160;
  const states = [
    { id: 0, x: 60, y: 80, label: 'S₀', color: '#6366f1' },
    { id: 1, x: 210, y: 80, label: 'S₁', color: '#10b981' },
    { id: 2, x: 360, y: 80, label: 'S₂', color: '#f59e0b' },
  ];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Bellman Backup Visualizer — 3-State MDP
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Watch how the Bellman optimality equation propagates values backward from the terminal
        state. Click "Backup" to perform one value iteration step.
      </p>

      <svg width={W} height={H} className="mx-auto block mb-4" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }}>
        <defs>
          <marker id="arr-bv" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
          </marker>
          <marker id="arr-bv2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#10b981" />
          </marker>
        </defs>

        {/* Arrows: S0 -> S1 (action A, r=0) */}
        <path d="M 90,70 Q 150,30 180,70" fill="none" stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#arr-bv)" />
        <text x={148} y={32} textAnchor="middle" fontSize={10} fill="#6366f1">a=A, r=0</text>

        {/* Arrow: S0 -> S2 (action B, r=5) */}
        <path d="M 90,90 Q 210,140 330,90" fill="none" stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-bv)" strokeDasharray="4 2" />
        <text x={212} y={148} textAnchor="middle" fontSize={10} fill="#8b5cf6">a=B, r=5</text>

        {/* Arrow: S1 -> S2 (action, r=10) */}
        <path d="M 240,75 L 330,75" fill="none" stroke="#10b981" strokeWidth={2} markerEnd="url(#arr-bv2)" />
        <text x={285} y={65} textAnchor="middle" fontSize={10} fill="#10b981">r=10</text>

        {/* State circles */}
        {states.map((s) => (
          <g key={s.id}>
            <circle cx={s.x} cy={s.y} r={30} fill={s.color + '18'} stroke={s.color} strokeWidth={2} />
            <text x={s.x} y={s.y - 8} textAnchor="middle" fontSize={12} fontWeight="800" fill={s.color}>
              {s.label}
            </text>
            <text x={s.x} y={s.y + 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={s.color}>
              V={V[s.id].toFixed(2)}
            </text>
          </g>
        ))}

        {/* Terminal label */}
        <text x={360} y={125} textAnchor="middle" fontSize={9} fill="#f59e0b">terminal</text>
      </svg>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Discount factor γ</label>
            <span className="font-mono text-sm font-bold text-indigo-600">{gamma.toFixed(2)}</span>
          </div>
          <input
            type="range" min={0.5} max={0.99} step={0.01} value={gamma}
            onChange={(e) => { setGamma(Number(e.target.value)); setIter(0); }}
            className="h-2 w-full cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIter((i) => Math.max(0, i - 1))}
            disabled={iter === 0}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
          >
            ← Undo
          </button>
          <button
            onClick={() => setIter((i) => Math.min(i + 1, 10))}
            disabled={iter >= 10}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40"
          >
            Backup (iter {iter + 1})
          </button>
          <button
            onClick={() => setIter(0)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            Reset
          </button>
          <span className="text-sm text-gray-500">Iteration: {iter}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {states.map((s) => (
            <div key={s.id} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="font-mono text-lg font-bold" style={{ color: s.color }}>
                {V[s.id].toFixed(3)}
              </p>
              <p className="text-xs text-gray-400">{Math.abs(Vnext[s.id] - V[s.id]) < 1e-6 ? '✓ converged' : `Δ=${(Vnext[s.id]-V[s.id]).toFixed(3)}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import numpy as np

# 3-state MDP: states {0,1,2}, state 2 is terminal
# Transition: P[s,a,s'] = probability; R[s,a] = reward
nS, nA = 3, 2
gamma  = 0.9

# Transition probabilities (deterministic for clarity)
P = np.zeros((nS, nA, nS))
P[0, 0, 1] = 1.0   # from S0, action 0 -> S1
P[0, 1, 2] = 1.0   # from S0, action 1 -> S2
P[1, 0, 2] = 1.0   # from S1, action 0 -> S2
P[1, 1, 2] = 1.0   # from S1, action 1 -> S2 (same)
P[2, :, 2] = 1.0   # terminal stays

# Rewards
R = np.zeros((nS, nA))
R[0, 0] = 0    # S0, action 0 (go to S1)
R[0, 1] = 5    # S0, action 1 (go to S2)
R[1, 0] = 10   # S1, action 0 (go to S2)
R[1, 1] = 10   # S1, action 1

# Bellman optimality: V*(s) = max_a [R(s,a) + gamma * sum_s' P(s'|s,a) V*(s')]
def bellman_optimality_update(V, P, R, gamma):
    V_new = np.zeros_like(V)
    for s in range(nS - 1):  # skip terminal
        Q = np.array([
            R[s, a] + gamma * np.sum(P[s, a, :] * V)
            for a in range(nA)
        ])
        V_new[s] = np.max(Q)
    return V_new

# Value iteration
V = np.zeros(nS)
for i in range(100):
    V_new = bellman_optimality_update(V, P, R, gamma)
    delta = np.max(np.abs(V_new - V))
    V = V_new
    if delta < 1e-8:
        print(f"Converged at iteration {i+1}")
        break

print(f"Optimal values: V(S0)={V[0]:.4f}, V(S1)={V[1]:.4f}, V(S2)={V[2]:.4f}")

# Extract optimal policy
policy = np.argmax([
    [R[s,a] + gamma * np.sum(P[s,a,:]*V) for a in range(nA)]
    for s in range(nS)
], axis=1)
print(f"Optimal policy: {policy}")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function BellmanEquations() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Bellman Equations
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The recursive characterization of value functions — the mathematical backbone of all
          dynamic programming and reinforcement learning algorithms.
        </p>
      </div>

      <BellmanVisualizer />

      <DefinitionBlock
        label="Definition 2.1"
        title="State Value Function"
        definition="The state value function $V^\pi(s)$ under policy $\pi$ is the expected discounted cumulative reward starting from state $s$ and following $\pi$: $V^\pi(s) = \mathbb{E}_\pi\left[\sum_{t=0}^\infty \gamma^t R_{t+1} \,\middle|\, S_0 = s\right]$, where $\gamma \in [0,1)$ is the discount factor, $R_{t+1}$ is the reward received at step $t+1$, and the expectation is over the stochastic policy and environment transitions."
        notation="The discount factor $\gamma$ encodes temporal preference: $\gamma \to 0$ means myopic (care only about immediate reward); $\gamma \to 1$ means far-sighted. For $\gamma < 1$ and bounded rewards $|R| \leq R_{max}$, the value function is bounded: $|V^\pi(s)| \leq R_{max}/(1-\gamma)$."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Action Value Function (Q-function)"
        definition="The action value function $Q^\pi(s,a)$ is the expected return starting from state $s$, taking action $a$, then following $\pi$: $Q^\pi(s,a) = \mathbb{E}_\pi\left[\sum_{t=0}^\infty \gamma^t R_{t+1} \,\middle|\, S_0=s, A_0=a\right]$. The relationship to $V^\pi$ is: $V^\pi(s) = \sum_a \pi(a|s) Q^\pi(s,a)$ for stochastic $\pi$, and $V^\pi(s) = Q^\pi(s, \pi(s))$ for deterministic $\pi$."
        notation="The advantage function $A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$ measures how much better action $a$ is than the average action under $\pi$. $A^\pi(s,a) > 0$ means $a$ is better than average; $A^\pi(s,a) < 0$ means it is worse. Advantage normalization is a key component of policy gradient methods like PPO."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Bellman Expectation Equation"
        statement="The value function $V^\pi$ satisfies the Bellman expectation equation: $V^\pi(s) = \sum_a \pi(a|s) \sum_{s',r} p(s',r|s,a) \left[r + \gamma V^\pi(s')\right]$. Equivalently in matrix form: $V^\pi = R^\pi + \gamma P^\pi V^\pi$, where $R^\pi_s = \sum_a \pi(a|s) \sum_{s',r} p(s',r|s,a) r$ and $P^\pi_{s,s'} = \sum_a \pi(a|s) p(s'|s,a)$. The unique solution is $V^\pi = (I - \gamma P^\pi)^{-1} R^\pi$."
        proof="Expand the definition $V^\pi(s) = \mathbb{E}_\pi[\sum_t \gamma^t R_{t+1} | S_0=s]$. Split off the first reward: $V^\pi(s) = \mathbb{E}_\pi[R_1 + \gamma \sum_{t=1}^\infty \gamma^{t-1} R_{t+1} | S_0=s] = \mathbb{E}_\pi[R_1|S_0=s] + \gamma \mathbb{E}_\pi[V^\pi(S_1)|S_0=s]$. This is the Bellman expectation equation. The matrix equation $V^\pi = R^\pi + \gamma P^\pi V^\pi$ has unique solution $(I - \gamma P^\pi)^{-1} R^\pi$ since $\gamma < 1$ implies $\|{\gamma P^\pi}\|_\infty = \gamma < 1$, making $(I - \gamma P^\pi)$ invertible. $\square$"
        corollaries={[
          'Policy evaluation (computing $V^\\pi$ exactly) requires solving an $|\\mathcal{S}| \\times |\\mathcal{S}|$ linear system — $O(|\\mathcal{S}|^3)$ via Gaussian elimination, or $O(|\\mathcal{S}|^2 / (1-\\gamma))$ via iterative application of the Bellman operator.',
          'The Bellman operator $\\mathcal{T}^\\pi V(s) = \\sum_a \\pi(a|s) \\sum_{s\'} p(s\'|s,a)[r + \\gamma V(s\')]$ is a $\\gamma$-contraction in $L^\\infty$, guaranteeing convergence of iterative policy evaluation.',
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Bellman Optimality Equation and Contraction"
        statement="The optimal value function $V^*$ satisfies: $V^*(s) = \max_a \sum_{s',r} p(s',r|s,a)[r + \gamma V^*(s')]$. The Bellman optimality operator $\mathcal{T}^* V(s) = \max_a \sum_{s'} p(s'|s,a)[r(s,a,s') + \gamma V(s')]$ is a $\gamma$-contraction in $L^\infty$: $\|\mathcal{T}^* V - \mathcal{T}^* U\|_\infty \leq \gamma \|V - U\|_\infty$. By Banach's fixed point theorem, repeated application of $\mathcal{T}^*$ converges to $V^*$ from any initial $V_0$."
        proof="Show $\|\mathcal{T}^* V - \mathcal{T}^* U\|_\infty \leq \gamma \|V-U\|_\infty$: $|\mathcal{T}^*V(s) - \mathcal{T}^*U(s)| = |\max_a Q_V(s,a) - \max_a Q_U(s,a)| \leq \max_a |Q_V(s,a) - Q_U(s,a)| = \max_a |\gamma \sum_{s'} p(s'|s,a)(V(s')-U(s'))| \leq \gamma \|V-U\|_\infty$. Since $\gamma < 1$, $\mathcal{T}^*$ is a contraction on the complete metric space $(B(\mathcal{S}), \|\cdot\|_\infty)$. By Banach's fixed point theorem, there exists a unique $V^* = \mathcal{T}^* V^*$, and iterative application converges geometrically. $\square$"
        corollaries={[
          'Error bound: after $k$ iterations of value iteration, $\\|V_k - V^*\\|_\\infty \\leq \\gamma^k \\|V_0 - V^*\\|_\\infty /(1-\\gamma)$. Convergence rate is geometric in $\\gamma$; close to 1 requires many iterations.',
          'The optimal policy is greedy with respect to $V^*$: $\\pi^*(s) = \\arg\\max_a \\sum_{s\'} p(s\'|s,a)[r + \\gamma V^*(s\')]$.',
        ]}
      />

      <ExampleBlock
        title="Computing V* for a 3-State MDP"
        difficulty="advanced"
        problem="MDP: states {S0, S1, S2 (terminal)}, $\gamma=0.9$. From S0: action A→S1 (r=0), action B→S2 (r=5). From S1: action→S2 (r=10). Compute $V^*$ via the Bellman optimality equation."
        solution={[
          {
            step: 'Initialize and note terminal condition',
            formula: 'V_0(S_0) = V_0(S_1) = V_0(S_2) = 0',
            explanation: 'Start with all zeros. Terminal state S2 always has V(S2)=0.',
          },
          {
            step: 'First backup: V(S1) and V(S0)',
            formula: 'V_1(S_1) = \\max_a[r(S_1,a) + \\gamma V_0(S_2)] = 10 + 0.9 \\cdot 0 = 10',
            explanation: 'Only one action from S1, giving reward 10 and transitioning to terminal.',
          },
          {
            step: 'Second backup: V(S0) uses updated V(S1)',
            formula: 'V_2(S_0) = \\max(0 + 0.9 \\times 10,\\; 5 + 0.9 \\times 0) = \\max(9, 5) = 9',
            explanation:
              'Action A (go to S1): expected return = 0 + 0.9×10 = 9. Action B (go to S2): expected return = 5 + 0 = 5. Optimal: take action A.',
          },
          {
            step: 'Optimal values and policy',
            formula: 'V^*(S_0) = 9,\\; V^*(S_1) = 10,\\; V^*(S_2) = 0',
            explanation:
              'The optimal policy: $\\pi^*(S_0) = A$ (go to S1 for larger future reward), $\\pi^*(S_1) = $ any (both go to S2). The value of patience: going through S1 yields 9 vs the direct path yielding only 5.',
          },
        ]}
      />

      <WarningBlock title="Bellman Equations Assume Markov Property">
        <p>
          The Bellman equations are valid <strong>only</strong> for Markov decision processes
          where the future is independent of the past given the current state:{' '}
          <InlineMath math="P(S_{t+1}|S_t, A_t, S_{t-1}, A_{t-1}, \ldots) = P(S_{t+1}|S_t, A_t)" />.
          In partially observable environments (POMDPs), the agent cannot observe the true
          state, and the Markov property fails for observations. Applying Bellman equations
          directly to raw observations (e.g., image pixels in an Atari game) implicitly assumes
          a single frame contains all relevant state information — often violated (velocity
          requires multiple frames). DQN uses a stack of 4 frames to approximate the Markov
          property.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="Bellman Optimality and Value Iteration in NumPy"
        runnable
      />
    </div>
  );
}
