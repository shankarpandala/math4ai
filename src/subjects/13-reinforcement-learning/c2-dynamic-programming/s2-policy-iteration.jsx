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
// Policy Iteration: Before/After Toggle
// ---------------------------------------------------------------------------

// Simple 3x3 GridWorld: states 0-8, goal=8 (bottom-right), obstacle=4
// Actions: 0=up, 1=down, 2=left, 3=right
const GRID = 3;
const GOAL = 8;
const OBSTACLE = 4;

// Random initial policy (mostly left/up suboptimal)
const INIT_POLICY = [3, 1, 1, 1, -1, 1, 3, 3, -1]; // -1 = terminal/obstacle
const OPT_POLICY  = [3, 3, 1, 1, -1, 1, 3, 3, -1]; // greedy w.r.t. V*

const INIT_VALUES = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0];
const OPT_VALUES  = [0.729, 0.81, 0.9, 0.81, 0.0, 1.0, 0.9, 1.0, 1.0];

const ARROWS = ['↑', '↓', '←', '→'];
const ARROW_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function PolicyGrid({ policy, values, label, color }) {
  return (
    <div>
      <p className="mb-2 text-center text-sm font-semibold" style={{ color }}>{label}</p>
      <div className="grid grid-cols-3 gap-1.5 mx-auto" style={{ width: 198 }}>
        {Array.from({ length: 9 }, (_, s) => {
          const a = policy[s];
          const isGoal = s === GOAL;
          const isObs = s === OBSTACLE;
          return (
            <div
              key={s}
              className={`flex h-14 flex-col items-center justify-center rounded-lg border ${
                isGoal
                  ? 'border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/30'
                  : isObs
                  ? 'border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50'
              }`}
            >
              {isGoal ? (
                <span className="text-xl">🏆</span>
              ) : isObs ? (
                <span className="text-gray-400 text-lg">⬛</span>
              ) : (
                <>
                  <span className="text-xl font-bold" style={{ color: ARROW_COLORS[a] ?? '#6b7280' }}>
                    {a >= 0 ? ARROWS[a] : '?'}
                  </span>
                  <span className="font-mono text-xs text-gray-400">{values[s].toFixed(2)}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PolicyIterationDemo() {
  const [showOpt, setShowOpt] = useState(false);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Policy Iteration — Before &amp; After
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Toggle between the initial (suboptimal) policy and the optimal policy found by
        policy iteration on a 3×3 GridWorld. Policy iteration alternates between policy
        evaluation (computing <InlineMath math="V^\pi" />) and policy improvement (greedy update).
      </p>

      <div className="flex gap-2 mb-6 justify-center">
        <button
          onClick={() => setShowOpt(false)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            !showOpt ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Initial Policy
        </button>
        <button
          onClick={() => setShowOpt(true)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            showOpt ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Optimal Policy (after iteration)
        </button>
      </div>

      <div className="flex justify-center">
        <PolicyGrid
          policy={showOpt ? OPT_POLICY : INIT_POLICY}
          values={showOpt ? OPT_VALUES : INIT_VALUES}
          label={showOpt ? 'Optimal Policy π*' : 'Initial Policy π₀'}
          color={showOpt ? '#10b981' : '#6366f1'}
        />
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {showOpt
          ? 'All arrows point toward the goal (bottom-right). Values reflect discounted distance.'
          : 'Suboptimal: some states point left or away from the goal. Values are all 0 (not yet evaluated).'}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const CODE = `import numpy as np

def policy_evaluation(policy, P, R, gamma=0.9, theta=1e-8):
    """Compute V^pi via iterative policy evaluation."""
    nS = len(policy)
    V  = np.zeros(nS)
    while True:
        delta = 0
        for s in range(nS):
            a = policy[s]
            v = np.sum(P[s, a, :] * (R[s, a] + gamma * V))
            delta = max(delta, abs(v - V[s]))
            V[s] = v
        if delta < theta:
            break
    return V

def policy_improvement(V, P, R, gamma=0.9):
    """Return greedy policy w.r.t. V."""
    nS, nA = R.shape[:2]
    Q = R + gamma * np.einsum('san,n->sa', P, V)
    return Q.argmax(axis=1)

def policy_iteration(P, R, gamma=0.9):
    """Full policy iteration loop."""
    nS, nA = R.shape[:2]
    policy = np.zeros(nS, dtype=int)  # initialize to action 0
    history = []

    for i in range(1000):
        V = policy_evaluation(policy, P, R, gamma)
        new_policy = policy_improvement(V, P, R, gamma)
        history.append({'iter': i, 'V': V.copy(), 'policy': policy.copy()})
        if np.all(new_policy == policy):
            print(f"Policy iteration converged at iteration {i+1}")
            break
        policy = new_policy

    return policy, V, history

# Simple 4-state chain MDP
nS, nA = 4, 2
P = np.zeros((nS, nA, nS))
R = np.zeros((nS, nA))

P[0,0,0]=1; P[0,1,1]=1; R[0,1]=0
P[1,0,0]=1; P[1,1,2]=1; R[1,1]=0
P[2,0,1]=1; P[2,1,3]=1; R[2,1]=1
P[3,:,3]=1  # terminal

policy, V, history = policy_iteration(P, R, gamma=0.9)
print(f"Optimal policy: {policy}")
print(f"Optimal values: {V.round(4)}")
print(f"Number of policy iterations: {len(history)}")
`;

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PolicyIteration() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Policy Iteration
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Alternating between exact policy evaluation and greedy policy improvement —
          Howard's algorithm with finite convergence guarantees.
        </p>
      </div>

      <PolicyIterationDemo />

      <DefinitionBlock
        label="Definition 2.1"
        title="Policy Iteration Algorithm"
        definition="Policy iteration alternates two steps: (1) Policy evaluation: given current policy $\pi_k$, compute $V^{\pi_k}$ exactly by solving the linear system $(I - \gamma P^{\pi_k})V = R^{\pi_k}$ or iteratively. (2) Policy improvement: compute a greedy policy $\pi_{k+1}(s) = \arg\max_a \sum_{s'} p(s'|s,a)[r + \gamma V^{\pi_k}(s')]$. Repeat until $\pi_{k+1} = \pi_k$. The algorithm is due to Howard (1960)."
        notation="Policy iteration converges in a finite number of iterations since there are finitely many deterministic policies ($|\\mathcal{A}|^{|\\mathcal{S}|}$ in total) and each iteration is guaranteed to improve (or maintain) the policy value. For finite MDPs, convergence to $\\pi^*$ and $V^*$ is exact, not approximate."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Truncated Policy Iteration (Generalized)"
        definition="Generalized policy iteration (GPI) unifies value iteration and policy iteration. Instead of running policy evaluation to convergence, perform only $m$ Bellman expectation updates: $V \leftarrow (\mathcal{T}^{\pi_k})^m V$. Then do one greedy improvement. Special cases: $m=1$ is value iteration (one backup then improve); $m=\infty$ is full policy iteration (evaluate to convergence then improve). GPI with $m \in [1, \infty)$ trades off evaluation accuracy for computation."
        notation="In practice, $m=10$–$100$ evaluation steps often achieves near-optimal convergence speed. This is related to modified policy iteration (Puterman & Shin, 1978). Deep RL uses GPI implicitly: actor-critic methods perform one policy gradient step (improvement) after a few critic (evaluation) steps."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Policy Improvement Theorem"
        statement="Let $\pi$ and $\pi'$ be deterministic policies such that for all $s$: $Q^\pi(s, \pi'(s)) \geq V^\pi(s)$. Then $V^{\pi'}(s) \geq V^\pi(s)$ for all $s$. Furthermore, if the inequality is strict for at least one state, then $V^{\pi'}(s_0) > V^\pi(s_0)$ for at least one state $s_0$."
        proof="$V^\pi(s) \leq Q^\pi(s, \pi'(s)) = \mathbb{E}[R_1 + \gamma V^\pi(S_1) | S_0=s, A_0=\pi'(s)] \leq \mathbb{E}[R_1 + \gamma Q^\pi(S_1, \pi'(S_1)) | S_0=s, A_0=\pi'(s)] \leq \ldots \leq \mathbb{E}[\sum_t \gamma^t R_{t+1} | S_0=s, \pi'] = V^{\pi'}(s)$. Each step applies the assumption that $Q^\pi(s, \pi'(s)) \geq V^\pi(s)$ at the new state. The greedy update satisfies $Q^\pi(s, \pi'(s)) = \max_a Q^\pi(s,a) \geq Q^\pi(s,\pi(s)) = V^\pi(s)$, so the greedy policy always satisfies the hypothesis. $\square$"
        corollaries={[
          'Policy iteration terminates in at most $|\\mathcal{A}|^{|\\mathcal{S}|}$ iterations (the number of deterministic policies). In practice, it often converges in $O(|\\mathcal{S}|)$ iterations for well-structured MDPs.',
          'If the greedy improvement leaves the policy unchanged ($\\pi_{k+1} = \\pi_k$), then $V^{\\pi_k} = V^*$ and $\\pi_k = \\pi^*$. This is the termination condition.',
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Policy Iteration vs Value Iteration: Computational Complexity"
        statement="Let $|\\mathcal{S}| = n$ and $|\\mathcal{A}| = m$. Per-iteration cost: policy evaluation requires $O(n^3)$ (linear system solve) or $O(n^2 m / (1-\\gamma))$ (iterative); greedy improvement requires $O(n^2 m)$. Policy iteration converges in $O(n \log n)$ policy improvement steps (empirically). Value iteration convergence requires $O(\\log(1/\\epsilon(1-\\gamma)) / \\log(1/\\gamma))$ iterations each costing $O(n^2 m)$. Policy iteration is preferred when $n$ is small (exact solve is cheap); value iteration when $n$ is large."
        proof="The $O(n^3)$ policy evaluation cost comes from solving the $(I - \\gamma P^\\pi) V = R^\\pi$ linear system via Gaussian elimination. The iterative alternative converges geometrically at rate $\\gamma$ per sweep, requiring $O(1/(1-\\gamma))$ sweeps each of cost $O(n^2)$ — matching $O(n^2/(1-\\gamma))$. Policy iteration's super-linear convergence in the number of improvement steps (observed but hard to prove formally in general) often makes it significantly faster than value iteration despite the expensive evaluation step. $\\square$"
        corollaries={[
          'Modified policy iteration with $m$ evaluation steps achieves similar empirical convergence to full policy iteration when $m \\approx 10$–$30$, with $O(m n^2)$ per improvement step instead of $O(n^3)$.',
          'Linear programming provides an alternative polynomial-time solution for MDPs: minimize $\\sum_s \\mu(s) V(s)$ s.t. $V(s) \\geq r(s,a) + \\gamma \\sum_{s\'} p(s\'|s,a)V(s\')$ for all $s, a$.',
        ]}
      />

      <ExampleBlock
        title="Policy Iteration on a 4-State MDP: Step by Step"
        difficulty="advanced"
        problem="4-state chain MDP: S0→S1 (r=0, action 1) or stay (r=0, action 0), S1→S2 (r=0), S2→S3 (r=1, terminal). $\gamma=0.9$. Start with policy $\pi_0$ = always action 0 (stay). Trace policy iteration."
        solution={[
          {
            step: 'Policy evaluation of π₀ (always stay)',
            formula: 'V^{\\pi_0}(s) = 0 \\text{ for all } s \\neq S_3',
            explanation:
              'Under $\\pi_0 =$ stay, the agent never moves. No rewards are ever received. $V^{\\pi_0} = 0$ everywhere (except terminal $S_3$ which has $V=0$ trivially).',
          },
          {
            step: 'Policy improvement: greedy w.r.t. V^{π₀} = 0',
            formula: '\\pi_1(s) = \\arg\\max_a [r(s,a) + 0.9 \\times 0] = \\arg\\max_a r(s,a)',
            explanation:
              'With $V^{\\pi_0} = 0$, the greedy action is the one with highest immediate reward. Only $S_2 \\to S_3$ has $r=1$, so $\\pi_1(S_2) = $ forward. All others have $r=0$ for both actions — $\\pi_1$ is same as $\\pi_0$ for $S_0, S_1$.',
          },
          {
            step: 'Continue until fully optimal',
            explanation:
              'After several iterations, policy evaluation propagates the $r=1$ reward backward: $V^{\\pi_k}(S_2) = 1$, $V^{\\pi_k}(S_1) = 0.9$, $V^{\\pi_k}(S_0) = 0.81$. Each improvement step updates one more state\'s action to "forward." Policy iteration converges in $O(|\\mathcal{S}|) = 4$ iterations.',
          },
        ]}
      />

      <WarningBlock title="Exact Policy Evaluation Is Intractable for Large MDPs">
        <p>
          Classical policy iteration requires solving an $|\\mathcal{S}| \\times |\\mathcal{S}|$
          linear system at each iteration — $O(|\\mathcal{S}|^3)$ per solve. For a robot with
          continuous state space or a game with $10^{50}$ states, this is completely infeasible.
          Approximate policy iteration (API) replaces exact evaluation with function approximation
          (neural networks, linear models), but loses the convergence guarantees. API with linear
          function approximators (LSTD-Q) has convergence guarantees under certain conditions;
          nonlinear approximators (DQN) may diverge — the "deadly triad" problem.
        </p>
      </WarningBlock>

      <PythonCode
        code={CODE}
        language="python"
        title="Policy Iteration with NumPy — Evaluation, Improvement, and Convergence"
        runnable
      />
    </div>
  );
}
