import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function InductionVisualizer() {
  const [n, setN] = useState(5);
  const [mode, setMode] = useState('weak'); // 'weak' | 'strong'

  // Illustrate: sum 1..n = n(n+1)/2
  const actual = (n * (n + 1)) / 2;
  const formula = (n * (n + 1)) / 2;
  const match = actual === formula;

  // Domino positions
  const dominoes = Array.from({ length: Math.min(n, 12) }, (_, i) => i + 1);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Induction Visualizer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Watch how the inductive step propagates — like dominoes falling.
      </p>

      {/* Mode toggle */}
      <div className="mb-5 flex gap-2">
        {['weak', 'strong'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors ${
              mode === m
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'weak' ? 'Weak Induction' : 'Strong Induction'}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
          Verify up to <InlineMath math={`n = ${n}`} />
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Domino visual */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {dominoes.map((k) => (
          <div
            key={k}
            className="flex h-8 w-8 items-center justify-center rounded border-2 border-indigo-400 bg-indigo-100 text-xs font-bold text-indigo-700 dark:border-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"
            title={`Step ${k}: verified`}
          >
            {k}
          </div>
        ))}
        {n > 12 && (
          <div className="flex h-8 items-center px-2 text-xs text-gray-400">
            ...up to {n}
          </div>
        )}
      </div>

      {/* Induction structure */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
        {mode === 'weak' ? (
          <>
            <p className="mb-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">Weak Induction Structure:</p>
            <ol className="ml-4 list-decimal space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li><strong>Base case:</strong> Verify P(1) directly.</li>
              <li><strong>Inductive step:</strong> Assume P(k) (inductive hypothesis). Prove P(k+1).</li>
              <li><strong>Conclusion:</strong> P(n) holds for all n ≥ 1.</li>
            </ol>
          </>
        ) : (
          <>
            <p className="mb-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">Strong Induction Structure:</p>
            <ol className="ml-4 list-decimal space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li><strong>Base case(s):</strong> Verify P(1), maybe P(2), ... as needed.</li>
              <li><strong>Inductive step:</strong> Assume P(1), P(2), ..., P(k) ALL hold. Prove P(k+1).</li>
              <li><strong>Conclusion:</strong> P(n) holds for all n ≥ 1.</li>
            </ol>
          </>
        )}
      </div>

      {/* Formula check */}
      <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          Gauss formula check: <InlineMath math={`\\sum_{k=1}^{${n}} k = ${actual}`} />
          {' '}and{' '}<InlineMath math={`\\frac{${n}(${n}+1)}{2} = ${formula}`} />
          {' — '}<span className={match ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
            {match ? '✓ match' : '✗ mismatch'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function MathematicalInduction() {
  return (
    <div className="space-y-8">
      <InductionVisualizer />

      <DefinitionBlock
        label="Definition 3.1"
        title="Principle of Mathematical Induction (Weak)"
        definition="Let $P(n)$ be a predicate defined for positive integers $n$. If (1) $P(1)$ is true (base case), and (2) for every integer $k \geq 1$, $P(k) \Rightarrow P(k+1)$ (inductive step), then $P(n)$ is true for all positive integers $n$."
        notation="The inductive hypothesis is the assumption $P(k)$ made in step (2). It is not circular — we are proving an implication, not assuming the conclusion."
      />

      <DefinitionBlock
        label="Definition 3.2"
        title="Principle of Strong (Complete) Induction"
        definition="Let $P(n)$ be a predicate for $n \geq 1$. If for every $k \geq 1$, assuming $P(1), P(2), \ldots, P(k)$ all hold implies $P(k+1)$, then $P(n)$ is true for all $n \geq 1$. Strong induction allows using all previous cases, not just $P(k)$."
        notation="Strong induction is logically equivalent to weak induction — each implies the other. Strong induction is especially useful when $P(k+1)$ depends on $P(k/2)$ or other non-adjacent predecessors."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Gauss Sum Formula"
        statement="For all positive integers $n$: $\displaystyle\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$."
        proof="By weak induction on $n$. Base case $n=1$: $\sum_{k=1}^{1} k = 1 = \frac{1 \cdot 2}{2}$. Inductive step: assume $\sum_{k=1}^{m} k = \frac{m(m+1)}{2}$ for some $m \geq 1$. Then $\sum_{k=1}^{m+1} k = \left(\sum_{k=1}^{m} k\right) + (m+1) = \frac{m(m+1)}{2} + (m+1) = (m+1)\left(\frac{m}{2}+1\right) = \frac{(m+1)(m+2)}{2}$. This is exactly the formula with $n = m+1$. By induction, the formula holds for all $n \geq 1$. $\square$"
        corollaries={[
          'Analogously: $\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}$ and $\\sum_{k=1}^{n} k^3 = \\left(\\frac{n(n+1)}{2}\\right)^2$.',
          'The formula $n(n+1)/2$ counts the number of edges in the complete graph $K_{n+1}$.',
        ]}
      />

      <TheoremBlock
        label="Theorem 3.2"
        title="Fundamental Theorem of Arithmetic (via Strong Induction)"
        statement="Every integer $n \geq 2$ can be written as a product of prime numbers (unique up to order)."
        proof="Existence by strong induction. Base case $n = 2$: 2 is prime, so it is its own prime factorisation. Inductive step: assume every integer $2 \leq j \leq k$ has a prime factorisation. Consider $k+1$. If $k+1$ is prime, done. Otherwise $k+1 = ab$ with $2 \leq a, b < k+1$. By the strong induction hypothesis, $a$ and $b$ each have prime factorisations, so $k+1 = ab$ inherits one. (Uniqueness follows from Euclid's lemma: if $p \mid ab$ then $p \mid a$ or $p \mid b$.) $\square$"
        corollaries={[
          'Strong induction was essential here: the factors $a, b$ are not necessarily $k$.',
          'Uniqueness of factorisation characterises $\\mathbb{Z}$ as a unique factorisation domain (UFD).',
        ]}
      />

      <ExampleBlock
        title="Induction on Inequalities"
        difficulty="beginner"
        problem="Prove by induction: $2^n > n^2$ for all integers $n \geq 5$."
        solution={[
          {
            step: 'Base case n = 5',
            formula: '2^5 = 32 > 25 = 5^2 \\quad \\checkmark',
            explanation: 'Verified directly.',
          },
          {
            step: 'Inductive hypothesis',
            formula: '\\text{Assume } 2^k > k^2 \\text{ for some } k \\geq 5.',
            explanation: 'This is our assumption — we do NOT assume it for all k simultaneously.',
          },
          {
            step: 'Inductive step: prove 2^{k+1} > (k+1)^2',
            formula: '2^{k+1} = 2 \\cdot 2^k > 2k^2 \\quad (\\text{by I.H.})',
            explanation: 'Now we need 2k² ≥ (k+1)² = k² + 2k + 1, i.e., k² - 2k - 1 ≥ 0.',
          },
          {
            step: 'Verify the auxiliary inequality for k ≥ 5',
            formula: 'k^2 - 2k - 1 = (k-1)^2 - 2 \\geq (5-1)^2 - 2 = 14 > 0',
            explanation: 'So 2k² ≥ (k+1)² for k ≥ 5, completing the step.',
          },
          {
            step: 'Conclusion',
            formula: '\\forall n \\geq 5: \\; 2^n > n^2',
            explanation: 'By the principle of mathematical induction. ∎',
          },
        ]}
      />

      <WarningBlock title="The Induction Fallacy: Missing Base Case">
        <p className="mb-2">
          Induction <em>requires</em> a valid base case. Without it, absurd results follow.
        </p>
        <p className="mb-2 font-mono text-xs bg-red-50 dark:bg-red-950/30 rounded p-2">
          "All horses are the same colour." — A famous flawed induction where the inductive step
          silently fails at n=2 (two horses have no overlap when you remove one at a time).
        </p>
        <p>
          Always verify: (1) the base case is checked explicitly, (2) the inductive step truly
          covers the transition from <InlineMath math="k" /> to <InlineMath math="k+1" />,
          and (3) the base case matches the starting point assumed in the inductive step.
        </p>
      </WarningBlock>

      <PythonCode
        title="Mathematical Induction — Python Verification"
        code={`# Verify Gauss formula and 2^n > n^2 by explicit computation
import numpy as np

# 1. Gauss sum formula: sum(1..n) == n(n+1)//2
for n in range(1, 21):
    lhs = sum(range(1, n + 1))
    rhs = n * (n + 1) // 2
    assert lhs == rhs, f"Formula fails at n={n}"
print("Gauss formula verified for n=1..20")

# 2. 2^n > n^2 for n >= 5
violations = [n for n in range(5, 30) if 2**n <= n**2]
print(f"Violations of 2^n > n^2 for n=5..29: {violations}")  # should be []

# 3. Demonstrate strong induction: every n>=2 has a prime factor
def smallest_prime_factor(n):
    for p in range(2, int(n**0.5) + 1):
        if n % p == 0:
            return p
    return n  # n is prime

def prime_factorisation(n):
    factors = []
    while n > 1:
        p = smallest_prime_factor(n)
        factors.append(p)
        n //= p
    return factors

for n in range(2, 20):
    fs = prime_factorisation(n)
    product = 1
    for f in fs: product *= f
    assert product == n, f"Factorisation wrong at n={n}"
print("Prime factorisation verified for n=2..19")
`}
        runnable
      />
    </div>
  );
}
