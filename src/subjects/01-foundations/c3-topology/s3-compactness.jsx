import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const SZ = 300;

function CompactnessViz() {
  const [numCovers, setNumCovers] = useState(4);
  const [compact, setCompact] = useState(true); // true = [0,1], false = (0,1)

  // Generate random open intervals covering [0,1] or (0,1)
  const seed = numCovers * 13;
  const intervals = Array.from({ length: numCovers }, (_, i) => {
    const lo = (((seed + i * 37) % 100) / 200);
    const hi = lo + 0.25 + (((seed + i * 53) % 100) / 200);
    return { lo: Math.min(lo, 0.95), hi: Math.min(hi + 0.1, 1.05), color: `hsl(${(i * 67) % 360}, 70%, 60%)` };
  });

  // Check if they cover
  const setLo = compact ? 0 : 0.01;
  const setHi = compact ? 1 : 0.99;
  const nTest = 100;
  let covered = true;
  for (let i = 0; i <= nTest; i++) {
    const x = setLo + (i / nTest) * (setHi - setLo);
    if (!intervals.some((iv) => iv.lo < x && x < iv.hi)) {
      covered = false;
      break;
    }
  }

  const toSvgX = (v) => 20 + v * (SZ - 40);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Open Cover Explorer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Compact sets (closed &amp; bounded) always have finite subcovers. Adjust the number of open intervals.
      </p>

      {/* Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setCompact(true)}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${compact ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'}`}
        >
          [0, 1] (compact)
        </button>
        <button
          onClick={() => setCompact(false)}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${!compact ? 'bg-rose-600 text-white' : 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'}`}
        >
          (0, 1) (non-compact)
        </button>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
          Open intervals in cover: {numCovers}
        </label>
        <input type="range" min={2} max={10} value={numCovers} onChange={(e) => setNumCovers(Number(e.target.value))} className="w-full accent-indigo-500" />
      </div>

      <svg viewBox={`0 0 ${SZ} 120`} className="w-full rounded-lg bg-gray-50 dark:bg-gray-800/40">
        {/* Set indicator */}
        <rect
          x={toSvgX(compact ? 0 : 0.01)}
          y={50}
          width={toSvgX(compact ? 1 : 0.99) - toSvgX(compact ? 0 : 0.01)}
          height={20}
          fill={compact ? '#6366f1' : '#f43f5e'}
          opacity="0.3"
          rx="2"
        />

        {/* Endpoints */}
        {compact && (
          <>
            <circle cx={toSvgX(0)} cy={60} r="4" fill="#6366f1" />
            <circle cx={toSvgX(1)} cy={60} r="4" fill="#6366f1" />
          </>
        )}
        {!compact && (
          <>
            <circle cx={toSvgX(0)} cy={60} r="4" fill="none" stroke="#f43f5e" strokeWidth="2" />
            <circle cx={toSvgX(1)} cy={60} r="4" fill="none" stroke="#f43f5e" strokeWidth="2" />
          </>
        )}

        {/* Labels */}
        <text x={toSvgX(0)} y={48} textAnchor="middle" fontSize="10" fill="#6b7280">
          {compact ? '0' : '0 (excl)'}
        </text>
        <text x={toSvgX(1)} y={48} textAnchor="middle" fontSize="10" fill="#6b7280">
          {compact ? '1' : '1 (excl)'}
        </text>

        {/* Open intervals */}
        {intervals.map((iv, i) => (
          <g key={i}>
            <rect
              x={toSvgX(Math.max(0, iv.lo))}
              y={80 + i * 3}
              width={Math.abs(toSvgX(Math.min(1, iv.hi)) - toSvgX(Math.max(0, iv.lo)))}
              height={6}
              fill={iv.color}
              opacity="0.6"
              rx="3"
            />
          </g>
        ))}

        {/* Coverage indicator */}
        <text x={SZ / 2} y={110} textAnchor="middle" fontSize="11" fill={covered ? '#10b981' : '#f43f5e'} fontWeight="bold">
          {covered ? '✓ Set is covered' : '✗ Not fully covered'}
        </text>
      </svg>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        For compact <InlineMath math="[0,1]" />, the Heine-Borel theorem guarantees every open cover has a finite subcover.
        For non-compact <InlineMath math="(0,1)" />, the intervals <InlineMath math="(1/n, 1)" /> cover but have no finite subcover.
      </p>
    </div>
  );
}

export default function CompactnessAndConnectedness() {
  return (
    <div className="space-y-8">
      <CompactnessViz />

      <DefinitionBlock
        label="Definition 3.1"
        title="Compact Set"
        definition="A subset $K$ of a topological space is compact if every open cover of $K$ has a finite subcover: for any family $\{U_\alpha\}$ of open sets with $K \subseteq \bigcup_\alpha U_\alpha$, there exist finitely many indices $\alpha_1, \ldots, \alpha_n$ with $K \subseteq U_{\alpha_1} \cup \cdots \cup U_{\alpha_n}$."
        notation="Compactness generalises the notion of being 'closed and bounded' in $\mathbb{R}^n$ (Heine-Borel theorem)."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Connected Set"
        definition="A topological space $X$ is connected if it cannot be written as a disjoint union of two non-empty open sets: there are no sets $U, V$ open in $X$ with $U \cap V = \emptyset$, $U \cup V = X$, and $U, V \neq \emptyset$. A subset $S$ is connected if it is connected in its subspace topology."
        notation="Equivalently: $X$ is connected iff the only sets that are both open and closed are $\emptyset$ and $X$."
      />

      <DefinitionBlock
        label="Definition 3.3"
        title="Path-Connected"
        definition="A space $X$ is path-connected if for any two points $x, y \in X$ there exists a continuous path $\gamma: [0,1] \to X$ with $\gamma(0) = x$ and $\gamma(1) = y$. Path-connectedness implies connectedness, but not conversely."
        notation="The topologist's sine curve $\{(x, \sin(1/x)) : x > 0\} \cup \{(0,0)\}$ is connected but not path-connected."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Heine-Borel Theorem"
        statement="A subset $K \subseteq \mathbb{R}^n$ is compact if and only if it is closed and bounded."
        proof="($\Rightarrow$) Compact sets in Hausdorff spaces are closed. Also, $\{\mathbb{R}^n\} = \{B(0, n) : n \in \mathbb{N}\}$ is an open cover; compactness gives a finite subcover $B(0, N)$, so $K$ is bounded. ($\Leftarrow$) If $K$ is closed and bounded, it is contained in some closed hypercube $[-M, M]^n$. One shows $[-M,M]^n$ is compact by repeated bisection (in $\mathbb{R}$ first, then extend via finite products). Since $K$ is a closed subset of a compact set, $K$ is compact. $\square$"
        corollaries={[
          'Every continuous function on a compact set attains its maximum and minimum (Extreme Value Theorem).',
          'In infinite-dimensional spaces (e.g., $\\ell^2$), the closed unit ball is NOT compact — Heine-Borel fails.',
        ]}
      />

      <TheoremBlock
        label="Theorem 3.2"
        title="Continuous Image of Connected/Compact Sets"
        statement="Let $f: X \to Y$ be continuous. (1) If $X$ is connected, then $f(X)$ is connected. (2) If $X$ is compact, then $f(X)$ is compact."
        proof="(1) If $f(X) = U \cup V$ with $U, V$ disjoint open sets in $f(X)$, then $X = f^{-1}(U) \cup f^{-1}(V)$. By continuity, $f^{-1}(U)$ and $f^{-1}(V)$ are open and disjoint. Connectedness of $X$ forces one to be empty, hence $f(X)$ is connected. (2) If $\{V_\alpha\}$ covers $f(X)$, then $\{f^{-1}(V_\alpha)\}$ covers $X$. Compactness gives a finite subcover, whose images cover $f(X)$. $\square$"
      />

      <ExampleBlock
        title="Non-compact Set Failing Extreme Value"
        difficulty="intermediate"
        problem="Show that $f(x) = 1/x$ on $(0, 1)$ (open, non-compact) does not attain its supremum, illustrating why compactness matters."
        solution={[
          {
            step: 'Compute the supremum',
            formula: '\\sup_{x \\in (0,1)} \\frac{1}{x} = +\\infty',
            explanation: 'As x → 0⁺, 1/x → ∞. The function is unbounded above on (0,1).',
          },
          {
            step: 'Note f is continuous on (0,1)',
            formula: 'f \\text{ is continuous on } (0,1)',
            explanation: 'So continuity alone is not enough to guarantee boundedness or attaining extrema.',
          },
          {
            step: 'Contrast: on [a,b] with 0 < a < b < 1',
            formula: '\\max_{x \\in [a,b]} \\frac{1}{x} = \\frac{1}{a} \\quad (\\text{attained at } x = a)',
            explanation: '[a,b] is compact (closed and bounded), so the Extreme Value Theorem applies.',
          },
          {
            step: 'Root cause',
            formula: '(0,1) \\text{ is bounded but not closed, hence not compact}',
            explanation: 'The failure of EVT is explained by the failure of compactness.',
          },
        ]}
      />

      <WarningBlock title="Closed + Bounded ≠ Compact in Infinite Dimensions">
        <p className="mb-2">
          The Heine-Borel theorem is specific to <InlineMath math="\mathbb{R}^n" />. In
          infinite-dimensional spaces like <InlineMath math="\ell^2" /> (square-summable sequences),
          the closed unit ball <InlineMath math="B = \{x : \|x\| \leq 1\}" /> is closed and
          bounded but NOT compact.
        </p>
        <p>
          This is why in machine learning and functional analysis, compactness arguments require
          care — the function spaces involved are often infinite-dimensional.
        </p>
      </WarningBlock>

      <PythonCode
        title="Compactness — Python"
        code={`import numpy as np

# Heine-Borel: closed+bounded in R^n is compact
# Demonstrate by sequential compactness: every sequence has a convergent subsequence

rng = np.random.default_rng(42)

# Bounded sequence in [0,1]^2 — always has convergent subsequence
pts = rng.uniform(0, 1, (1000, 2))

# Sort by distance from centroid to "extract a convergent subsequence"
centroid = pts.mean(axis=0)
dists = np.linalg.norm(pts - centroid, axis=1)
idx = np.argsort(dists)
subseq = pts[idx[:20]]  # first 20 nearest — converges to centroid
print(f"Centroid: {centroid}")
print(f"Subsequence limit (approx): {subseq.mean(axis=0)}")

# EVT on compact [a,b]: f(x) = sin(x) + cos(2x)
xs = np.linspace(0, 2*np.pi, 10000)
f = np.sin(xs) + np.cos(2*xs)
print(f"max of sin(x)+cos(2x) on [0,2pi]: {f.max():.6f} at x={xs[np.argmax(f)]:.4f}")
print(f"min of sin(x)+cos(2x) on [0,2pi]: {f.min():.6f} at x={xs[np.argmin(f)]:.4f}")
`}
        runnable
      />
    </div>
  );
}
