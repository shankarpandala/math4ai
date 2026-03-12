import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function PowerIterationViz() {
  const P = [
    [0.6, 0.3, 0.1],
    [0.2, 0.5, 0.3],
    [0.1, 0.3, 0.6],
  ];
  const [iter, setIter] = useState(0);
  const [pi0Idx, setPi0Idx] = useState(0);

  // Initial distributions
  const inits = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1/3, 1/3, 1/3]];
  const initLabels = ['[1,0,0]', '[0,1,0]', '[0,0,1]', 'uniform'];

  // Power iteration
  const matMul = (v, M) => M[0].map((_, j) => v.reduce((s, vi, i) => s + vi * M[i][j], 0));
  let pi = [...inits[pi0Idx]];
  for (let i = 0; i < iter; i++) pi = matMul(pi, P);

  // All histories for visualization
  const histories = Array.from({ length: 20 }, (_, step) => {
    let v = [...inits[pi0Idx]];
    for (let i = 0; i < step; i++) v = matMul(v, P);
    return v;
  });

  const stateColors = ['#6366f1', '#10b981', '#f97316'];
  const W = 340, H = 150;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Power Iteration: Stationary Distribution Convergence
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Starting distribution <InlineMath math="\pi^{(0)}" /> converges to <InlineMath math="\pi" /> regardless of starting point.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {initLabels.map((l, i) => (
          <button key={i} onClick={() => { setPi0Idx(i); setIter(0); }}
            className={`rounded-lg px-2 py-1 text-xs font-medium ${pi0Idx === i ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {l}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3">
        {/* lines for each state probability over iterations */}
        {[0, 1, 2].map(s => {
          const pts = histories.map((v, i) => ({
            sx: (i / 19) * (W - 20) + 10,
            sy: H - 10 - v[s] * (H - 20),
          }));
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
          return <path key={s} d={path} fill="none" stroke={stateColors[s]} strokeWidth={2} />;
        })}
        {/* current iteration marker */}
        {[0, 1, 2].map(s => {
          const x = (Math.min(iter, 19) / 19) * (W - 20) + 10;
          const y = H - 10 - histories[Math.min(iter, 19)][s] * (H - 20);
          return <circle key={s} cx={x} cy={y} r={4} fill={stateColors[s]} />;
        })}
      </svg>
      <div className="flex items-center gap-3 mb-3">
        <input type="range" min="0" max="19" step="1" value={Math.min(iter, 19)}
          onChange={e => setIter(parseInt(e.target.value))} className="flex-1 accent-indigo-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400 w-16">n = {iter}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map(s => (
          <div key={s} className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: `${stateColors[s]}20` }}>
            <p className="text-xs font-semibold" style={{ color: stateColors[s] }}>State {s}</p>
            <p className="font-mono">{pi[s].toFixed(5)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StationarySection() {
  return (
    <div className="space-y-8">
      <PowerIterationViz />

      <DefinitionBlock
        label="Definition 6.2.1"
        title="Stationary Distribution"
        definition={
          "A probability distribution $\\pi = (\\pi_j)_{j \\in \\mathcal{S}}$ is stationary (invariant) for Markov chain $P$ if " +
          "$\\pi P = \\pi$, i.e., $\\pi_j = \\sum_i \\pi_i P_{ij}$ for all $j$. " +
          "Equivalently, $\\pi$ is the left eigenvector of $P$ for eigenvalue 1. " +
          "If the chain starts in $\\pi$ (i.e., $P(X_0 = i) = \\pi_i$), it stays in $\\pi$ for all time."
        }
        notation={
          "For an irreducible finite Markov chain, the unique stationary distribution exists and satisfies " +
          "$\\pi_i = 1/E_i[T_i]$ where $T_i = \\inf\\{n \\geq 1: X_n = i\\}$ is the first return time to state $i$."
        }
      />

      <DefinitionBlock
        label="Definition 6.2.2"
        title="Detailed Balance"
        definition={
          "A chain satisfies detailed balance with respect to $\\pi$ if $\\pi_i P_{ij} = \\pi_j P_{ji}$ for all $i, j$. " +
          "This is a stronger condition than stationarity ($\\pi P = \\pi$ follows by summing over $i$). " +
          "A chain satisfying detailed balance is called reversible: it looks the same forwards and backwards. " +
          "Detailed balance is fundamental to MCMC: designing transitions that satisfy it guarantees the correct stationary distribution."
        }
      />

      <TheoremBlock
        label="Theorem 6.2.1"
        title="Ergodic Theorem for Markov Chains"
        statement={
          "For an irreducible, aperiodic Markov chain with unique stationary distribution $\\pi$: " +
          "(1) $P^n_{ij} \\to \\pi_j$ as $n \\to \\infty$ for all $i, j$ (mixing). " +
          "(2) For any bounded function $f$: $\\frac{1}{n}\\sum_{k=0}^{n-1} f(X_k) \\xrightarrow{a.s.} \\sum_j \\pi_j f(j) = E_\\pi[f]$ (ergodicity). " +
          "The convergence rate to stationarity is governed by the second-largest eigenvalue $\\lambda_2$ of $P$: the mixing time is $O(1/(1-|\\lambda_2|))$."
        }
        proof={
          "By the Perron-Frobenius theorem, the largest eigenvalue of a positive row-stochastic matrix is 1 (simple), " +
          "with corresponding left eigenvector $\\pi > 0$. " +
          "All other eigenvalues satisfy $|\\lambda| < 1$. " +
          "Writing $P^n = \\pi^T \\mathbf{1} + \\sum_{k=2}^d \\lambda_k^n v_k w_k^T$ and $\\lambda_k^n \\to 0$."
        }
      />

      <ExampleBlock title="Gambler's Ruin as a Markov Chain">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          A gambler starts with <InlineMath math="k" /> dollars, wins or loses 1 dollar with probability{' '}
          <InlineMath math="p" /> and <InlineMath math="1-p" />, stops at 0 or <InlineMath math="N" />.
          States 0 and <InlineMath math="N" /> are absorbing. Probability of reaching <InlineMath math="N" />:
        </p>
        <BlockMath math="P(\text{win} | X_0 = k) = \frac{1 - (q/p)^k}{1 - (q/p)^N} \quad (p \neq 1/2)" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For fair game (<InlineMath math="p=1/2" />): <InlineMath math="P(\text{win}) = k/N" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Mixing Time Can Be Exponentially Large">
        <p>
          The time to reach stationarity (mixing time) can be enormous. For a random walk on a
          path graph with <InlineMath math="N" /> nodes, mixing time is <InlineMath math="O(N^2)" />.
          For the Metropolis algorithm in high dimensions, mixing can require exponential time on
          multimodal distributions (the chain gets trapped in local modes). In ML, the mixing time
          of MCMC samplers limits their practical applicability for deep learning posteriors —
          this motivates variational inference as an alternative.
        </p>
      </WarningBlock>

      <PythonCode
        title="Stationary Distribution and Mixing"
        code={`import numpy as np
from scipy import linalg

# ── Stationary distribution ─────────────────────────────────────────────
P = np.array([
    [0.6, 0.3, 0.1],
    [0.2, 0.5, 0.3],
    [0.1, 0.3, 0.6],
])

# Method 1: Power iteration
pi = np.array([1/3, 1/3, 1/3])
for _ in range(1000):
    pi = pi @ P
print(f"Power iteration stationary dist: {pi}")

# Method 2: Left eigenvector (eigenvalue = 1)
eigenvalues, eigenvectors = linalg.eig(P.T)
idx = np.argmin(np.abs(eigenvalues - 1.0))
pi_eig = np.real(eigenvectors[:, idx])
pi_eig /= pi_eig.sum()
print(f"Eigenvector method:              {pi_eig}")

# Method 3: Solve linear system (pi P = pi, sum pi = 1)
A = np.vstack([P.T - np.eye(3), np.ones((1, 3))])
b = np.zeros(4); b[-1] = 1
pi_ls, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
print(f"Linear system method:            {pi_ls}")

# ── Mixing time ───────────────────────────────────────────────────────────
print("\\nP^n row 0 (convergence to stationary):")
for n in [1, 2, 5, 10, 20, 50]:
    Pn = np.linalg.matrix_power(P, n)
    print(f"  n={n:2d}: {Pn[0]} (diff={np.linalg.norm(Pn[0] - pi):.6f})")

# ── Eigenvalue gap ────────────────────────────────────────────────────────
eigenvalues_P = np.sort(np.abs(np.linalg.eigvals(P)))[::-1]
print(f"\\nEigenvalues: {eigenvalues_P}")
print(f"Spectral gap = 1 - |λ₂| = {1 - eigenvalues_P[1]:.4f}")
print(f"Mixing time ≈ 1/gap = {1/(1-eigenvalues_P[1]):.2f}")`}
      />
    </div>
  );
}
