import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function MarkovDiagram() {
  // 3-state Markov chain: states 0, 1, 2
  const [P, setP] = useState([
    [0.7, 0.2, 0.1],
    [0.3, 0.4, 0.3],
    [0.1, 0.4, 0.5],
  ]);
  const [state, setState] = useState(0);
  const [history, setHistory] = useState([0]);

  const step = () => {
    const row = P[state];
    const r = Math.random();
    let cum = 0;
    let next = 0;
    for (let i = 0; i < 3; i++) {
      cum += row[i];
      if (r < cum) { next = i; break; }
    }
    setState(next);
    setHistory(prev => [...prev.slice(-30), next]);
  };

  const stateColors = ['#6366f1', '#10b981', '#f97316'];
  const stateLabels = ['S₀', 'S₁', 'S₂'];
  const statePos = [{ x: 80, y: 80 }, { x: 220, y: 80 }, { x: 150, y: 200 }];

  const arrowOffset = 20;
  const renderArrow = (from, to, prob, i) => {
    if (from === to) return null;
    const { x: x1, y: y1 } = statePos[from];
    const { x: x2, y: y2 } = statePos[to];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const nx = -dy/len, ny = dx/len;
    const ctrl = { x: mx + nx * 25, y: my + ny * 25 };
    const startX = x1 + (dx/len)*arrowOffset, startY = y1 + (dy/len)*arrowOffset;
    const endX = x2 - (dx/len)*arrowOffset, endY = y2 - (dy/len)*arrowOffset;
    const opacity = 0.3 + prob * 1.5;
    return (
      <g key={`${from}-${to}`}>
        <path d={`M${startX},${startY} Q${ctrl.x},${ctrl.y} ${endX},${endY}`}
          fill="none" stroke={stateColors[from]} strokeWidth={1 + prob * 3} opacity={Math.min(1, opacity)} />
        <text x={ctrl.x + nx*12} y={ctrl.y + ny*12} fontSize={9} fill={stateColors[from]} textAnchor="middle">
          {prob.toFixed(2)}
        </text>
      </g>
    );
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        3-State Markov Chain Transition Diagram
      </h3>
      <div className="flex gap-6">
        <svg viewBox="0 0 300 280" className="w-64 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Arrows */}
          {P.map((row, from) => row.map((prob, to) => from !== to && prob > 0.01 ? renderArrow(from, to, prob, `${from}-${to}`) : null))}
          {/* Self-loops */}
          {P.map((row, i) => row[i] > 0.01 && (
            <text key={`self-${i}`} x={statePos[i].x + (i===0?-22:i===1?15:-8)} y={statePos[i].y + (i===2?20:-22)} fontSize={9} fill={stateColors[i]}>
              {row[i].toFixed(2)}
            </text>
          ))}
          {/* Nodes */}
          {statePos.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={20} fill={state === i ? stateColors[i] : 'white'}
                stroke={stateColors[i]} strokeWidth={2.5} />
              <text x={pos.x} y={pos.y + 5} fontSize={13} fontWeight="700" textAnchor="middle"
                fill={state === i ? 'white' : stateColors[i]}>{stateLabels[i]}</text>
            </g>
          ))}
          {/* History */}
          <text x={150} y={258} fontSize={9} fill="#9ca3af" textAnchor="middle">
            Recent: {history.slice(-15).join('→')}
          </text>
        </svg>
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Transition Matrix P:</p>
          {P.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map((p, j) => (
                <div key={j} className="flex-1">
                  <input type="number" min="0" max="1" step="0.1" value={p.toFixed(1)}
                    onChange={e => {
                      const val = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                      setP(prev => {
                        const next = prev.map(r => [...r]);
                        const old = next[i][j];
                        const diff = val - old;
                        next[i][j] = val;
                        // Normalize row
                        const sum = next[i].reduce((a,b)=>a+b,0);
                        if (sum > 0) next[i] = next[i].map(x => x/sum);
                        return next;
                      });
                    }}
                    className="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1 py-0.5 text-xs text-center" />
                </div>
              ))}
            </div>
          ))}
          <button onClick={step} className="mt-2 w-full rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white">
            Take Step (Current: {stateLabels[state]})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MarkovBasicsSection() {
  return (
    <div className="space-y-8">
      <MarkovDiagram />

      <DefinitionBlock
        label="Definition 6.1.1"
        title="Markov Chain"
        definition={
          "A discrete-time Markov chain is a sequence $X_0, X_1, X_2, \\ldots$ of random variables on state space $\\mathcal{S}$ satisfying the Markov property: " +
          "$P(X_{n+1} = j | X_n = i, X_{n-1}, \\ldots, X_0) = P(X_{n+1} = j | X_n = i) = P_{ij}$. " +
          "The transition matrix $P = (P_{ij})$ has $P_{ij} \\geq 0$ and $\\sum_j P_{ij} = 1$ (row-stochastic). " +
          "$P_{ij}^{(n)} = P(X_n = j | X_0 = i)$ is the $n$-step transition probability."
        }
        notation={
          "Matrix form: if $\\pi^{(0)}$ is the initial distribution row vector, then $\\pi^{(n)} = \\pi^{(0)} P^n$. " +
          "The $(i,j)$ entry of $P^n$ gives the $n$-step transition probability $P_{ij}^{(n)}$."
        }
      />

      <DefinitionBlock
        label="Definition 6.1.2"
        title="Irreducibility and Aperiodicity"
        definition={
          "A Markov chain is irreducible if for every pair $(i,j)$, there exists $n$ with $P_{ij}^{(n)} > 0$ (every state is reachable from every other). " +
          "State $i$ has period $d_i = \\gcd\\{n \\geq 1: P_{ii}^{(n)} > 0\\}$. " +
          "A state (or chain) is aperiodic if $d_i = 1$. " +
          "An irreducible, aperiodic chain on a finite state space has a unique stationary distribution."
        }
      />

      <TheoremBlock
        label="Theorem 6.1.1"
        title="Chapman-Kolmogorov Equations"
        statement={
          "For any $m, n \\geq 0$ and states $i, j$: " +
          "$P_{ij}^{(m+n)} = \\sum_k P_{ik}^{(m)} P_{kj}^{(n)}$, " +
          "equivalently $P^{m+n} = P^m P^n$. " +
          "This is simply matrix multiplication of the transition matrix."
        }
        proof={
          "By the law of total probability and the Markov property: " +
          "$P_{ij}^{(m+n)} = P(X_{m+n}=j|X_0=i) = \\sum_k P(X_m=k|X_0=i) P(X_{m+n}=j|X_m=k) = \\sum_k P_{ik}^{(m)} P_{kj}^{(n)}$."
        }
      />

      <ExampleBlock title="Random Walk on a Graph (Google PageRank)">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          A random surfer on the web follows links uniformly. The transition matrix is:
          <InlineMath math="P_{ij} = 1/\deg(i)" /> if there is an edge from <InlineMath math="i" /> to <InlineMath math="j" />.
        </p>
        <BlockMath math="\pi^{(n)} = \pi^{(0)} P^n \xrightarrow{n\to\infty} \pi" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          PageRank is the stationary distribution <InlineMath math="\pi" /> of this random walk (with damping).
        </p>
      </ExampleBlock>

      <WarningBlock title="Markov Property Can Be Violated in Practice">
        <p>
          Many real systems only approximately satisfy the Markov property. Stock prices are often
          modeled as Markov, but empirical evidence shows momentum and mean-reversion effects that
          depend on longer history. Higher-order Markov models use a window of past states:
          <InlineMath math="P(X_{n+1} | X_n, X_{n-1}, \ldots, X_{n-k+1})" />. Language models
          (n-gram models) are precisely <InlineMath math="k" />-th order Markov chains on word sequences.
          Transformers break the Markov assumption by attending to all past tokens.
        </p>
      </WarningBlock>

      <PythonCode
        title="Markov Chain Simulation and Analysis"
        code={`import numpy as np

# ── Define a 3-state Markov chain ─────────────────────────────────────────
P = np.array([
    [0.7, 0.2, 0.1],
    [0.3, 0.4, 0.3],
    [0.1, 0.4, 0.5],
])
print("Transition matrix P:")
print(P)

# ── Simulate trajectory ────────────────────────────────────────────────────
def simulate_markov(P, n_steps, initial_state=0, seed=42):
    np.random.seed(seed)
    states = [initial_state]
    for _ in range(n_steps):
        current = states[-1]
        next_state = np.random.choice(len(P), p=P[current])
        states.append(next_state)
    return states

trajectory = simulate_markov(P, 10000)
print(f"\\n10000-step simulation (starting from state 0):")
for s in range(3):
    freq = trajectory.count(s) / len(trajectory)
    print(f"  State {s}: visited {freq:.4f}")

# ── Chapman-Kolmogorov: P^n by matrix multiplication ────────────────────
print("\\nP^n transition probabilities from state 0:")
Pn = np.eye(3)
for n in [1, 2, 5, 10, 20, 50]:
    Pn = np.linalg.matrix_power(P, n)
    print(f"  n={n:2d}: {Pn[0]}")

# ── Stationary distribution ────────────────────────────────────────────────
# Find left eigenvector for eigenvalue 1
eigenvalues, eigenvectors = np.linalg.eig(P.T)
idx = np.argmin(np.abs(eigenvalues - 1.0))
pi = np.real(eigenvectors[:, idx])
pi /= pi.sum()
print(f"\\nStationary distribution: {pi}")
print(f"Verify πP = π: {np.allclose(pi @ P, pi)}")`}
      />
    </div>
  );
}
