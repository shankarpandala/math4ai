import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const PROOF_STRATEGIES = [
  {
    id: 'direct',
    label: 'Direct Proof',
    color: 'indigo',
    description: 'Assume P is true, deduce Q through a chain of logical steps.',
    structure: 'Assume P. Then ... Therefore Q. ∎',
    example: 'Prove: if n is even, then n² is even.',
    steps: [
      'Assume n is even.',
      'Then n = 2k for some integer k.',
      'So n² = (2k)² = 4k² = 2(2k²).',
      'Since 2k² is an integer, n² is even. ∎',
    ],
  },
  {
    id: 'contrapositive',
    label: 'Contrapositive',
    color: 'purple',
    description: 'Prove ¬Q → ¬P instead of P → Q (logically equivalent).',
    structure: 'Assume ¬Q. Then ... Therefore ¬P. ∎',
    example: 'Prove: if n² is odd, then n is odd.',
    steps: [
      'Prove the contrapositive: if n is even, then n² is even.',
      'Assume n is even, so n = 2k.',
      'Then n² = 4k² = 2(2k²) is even.',
      'By contrapositive, n² odd ⟹ n odd. ∎',
    ],
  },
  {
    id: 'contradiction',
    label: 'Contradiction',
    color: 'rose',
    description: 'Assume P is false (or assume ¬P), derive a contradiction ⊥.',
    structure: 'Assume ¬P. Then ... contradiction. Therefore P. ∎',
    example: 'Prove: √2 is irrational.',
    steps: [
      'Assume √2 = p/q in lowest terms (p, q integers, gcd = 1).',
      'Then 2 = p²/q², so p² = 2q² — p² is even, hence p is even.',
      'Write p = 2m. Then 4m² = 2q², so q² = 2m² — q is even.',
      'Both p, q even contradicts gcd(p,q) = 1. ∎',
    ],
  },
];

function ProofStrategyBuilder() {
  const [selected, setSelected] = useState('direct');
  const [stepIdx, setStepIdx] = useState(0);

  const strategy = PROOF_STRATEGIES.find((s) => s.id === selected);

  function selectStrategy(id) {
    setSelected(id);
    setStepIdx(0);
  }

  const colorMap = {
    indigo: {
      tab: 'bg-indigo-600 text-white',
      tabInactive: 'border border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
      step: 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30',
      dot: 'bg-indigo-500',
      dotFuture: 'bg-indigo-200 dark:bg-indigo-800',
    },
    purple: {
      tab: 'bg-purple-600 text-white',
      tabInactive: 'border border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/30',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      step: 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/30',
      dot: 'bg-purple-500',
      dotFuture: 'bg-purple-200 dark:bg-purple-800',
    },
    rose: {
      tab: 'bg-rose-600 text-white',
      tabInactive: 'border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/30',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      step: 'border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30',
      dot: 'bg-rose-500',
      dotFuture: 'bg-rose-200 dark:bg-rose-800',
    },
  };

  const c = colorMap[strategy.color];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Proof Strategy Builder
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Select a proof method, then step through the example proof.
      </p>

      {/* Strategy tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PROOF_STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => selectStrategy(s.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selected === s.id ? colorMap[s.color].tab : colorMap[s.color].tabInactive
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className={`mb-4 rounded-lg border p-3 text-sm ${c.step}`}>
        <span className="font-semibold">Strategy: </span>{strategy.description}
        <div className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
          {strategy.structure}
        </div>
      </div>

      {/* Example */}
      <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="font-semibold">Example: </span>{strategy.example}
      </p>

      {/* Step-through */}
      <div className="space-y-2">
        {strategy.steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border px-4 py-2.5 transition-all ${
              i <= stepIdx ? c.step : 'border-gray-200 bg-gray-50 opacity-40 dark:border-gray-700 dark:bg-gray-800/30'
            }`}
          >
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${i <= stepIdx ? c.dot : c.dotFuture}`}>
              {i + 1}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setStepIdx((n) => Math.max(0, n - 1))}
          disabled={stepIdx === 0}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ← Prev
        </button>
        <button
          onClick={() => setStepIdx((n) => Math.min(strategy.steps.length - 1, n + 1))}
          disabled={stepIdx === strategy.steps.length - 1}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Next →
        </button>
        <button
          onClick={() => setStepIdx(strategy.steps.length - 1)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Show All
        </button>
      </div>
    </div>
  );
}

export default function ProofTechniques() {
  return (
    <div className="space-y-8">
      <ProofStrategyBuilder />

      <DefinitionBlock
        label="Definition 2.1"
        title="Direct Proof"
        definition="A direct proof of $P \Rightarrow Q$ is a finite sequence of statements, each either an axiom, a hypothesis, or a logical consequence of previous statements, that begins with the assumption $P$ and ends with $Q$."
        notation="Symbolically: $P \vdash Q$ means '$Q$ is provable from $P$' in the formal system."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Proof by Contrapositive"
        definition="A proof by contrapositive proves $P \Rightarrow Q$ by instead proving the logically equivalent statement $\neg Q \Rightarrow \neg P$. The logical equivalence $(P \Rightarrow Q) \equiv (\neg Q \Rightarrow \neg P)$ is the contrapositive law."
        notation="If we prove $\neg Q \Rightarrow \neg P$, we have proved $P \Rightarrow Q$ with equal validity."
      />

      <DefinitionBlock
        label="Definition 2.3"
        title="Proof by Contradiction (Reductio ad Absurdum)"
        definition="To prove proposition $P$ by contradiction, assume $\neg P$ and derive a statement $C$ that is known to be false (a contradiction $\bot$). Since $\neg P \Rightarrow \bot$ means $\neg P$ is false, we conclude $P$ must be true."
        notation="Structure: Assume $\neg P$. [Steps...] $\Rightarrow$ contradiction. $\therefore P$. $\square$"
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="Infinitude of Primes"
        statement="There are infinitely many prime numbers."
        proof="Proof by contradiction. Suppose there are only finitely many primes $p_1, p_2, \ldots, p_n$. Define $N = p_1 p_2 \cdots p_n + 1$. Since $N > 1$, it has a prime factor $p$. But for each $p_i$, we have $N \equiv 1 \pmod{p_i}$, so $p_i \nmid N$. Thus $p$ is not in our list — contradiction. Therefore infinitely many primes exist. $\square$"
        corollaries={[
          'The $n$-th prime $p_n$ satisfies $p_n \\leq 2^{2^{n-1}}$ (Euclid\'s bound).',
          'A stronger result: by the Prime Number Theorem, $\\pi(x) \\sim x / \\ln x$ where $\\pi(x)$ counts primes up to $x$.',
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Irrationality of √2"
        statement="$\sqrt{2}$ is irrational: it cannot be expressed as $p/q$ with $p, q \in \mathbb{Z}$, $q \neq 0$."
        proof="Assume for contradiction that $\sqrt{2} = p/q$ in lowest terms ($\gcd(p,q) = 1$). Then $2 = p^2/q^2$, so $p^2 = 2q^2$. Hence $p^2$ is even, which implies $p$ is even (since odd$^2$ is odd). Write $p = 2m$. Then $4m^2 = 2q^2$, giving $q^2 = 2m^2$, so $q$ is even. But then $\gcd(p,q) \geq 2$, contradicting the assumption that $p/q$ is in lowest terms. $\square$"
        corollaries={[
          'More generally, $\\sqrt{n}$ is irrational for any non-square positive integer $n$.',
          'The reals $\\mathbb{R}$ are strictly larger than the rationals $\\mathbb{Q}$; most real numbers are irrational.',
        ]}
      />

      <ExampleBlock
        title="Choosing the Right Method"
        difficulty="beginner"
        problem="Prove: For all integers $n$, if $3n + 2$ is odd then $n$ is odd. Choose the most efficient proof method."
        solution={[
          {
            step: 'Analyse the structure',
            formula: 'P: \\text{``}3n+2\\text{ is odd''} \\quad Q: \\text{``}n\\text{ is odd''}',
            explanation: 'We need P ⟹ Q. The contrapositive ¬Q ⟹ ¬P is often easier when the conclusion talks about parity.',
          },
          {
            step: 'State the contrapositive',
            formula: '\\neg Q \\Rightarrow \\neg P: \\quad \\text{if } n \\text{ is even, then } 3n+2 \\text{ is even}',
            explanation: 'This is logically equivalent to the original. Now we have a concrete hypothesis to work with.',
          },
          {
            step: 'Direct proof of the contrapositive',
            formula: 'n = 2k \\implies 3n + 2 = 6k + 2 = 2(3k+1)',
            explanation: 'Since 3k+1 is an integer, 3n+2 = 2(3k+1) is even. This completes the proof of the contrapositive.',
          },
          {
            step: 'Conclusion',
            formula: '\\therefore \\; (3n+2 \\text{ odd}) \\Rightarrow (n \\text{ odd})',
            explanation: 'By the contrapositive law, the original statement holds for all integers n. ∎',
          },
        ]}
      />

      <WarningBlock title="When NOT to Use Contradiction">
        <p className="mb-2">
          Proof by contradiction is powerful but can obscure structure. Prefer it only when:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-sm">
          <li>You need to prove something <em>does not exist</em> (e.g., no rational equals √2).</li>
          <li>The negation gives you a richer hypothesis to work with.</li>
        </ul>
        <p className="mt-2">
          If a direct proof or contrapositive works cleanly, use those instead — they are
          considered more elegant and constructive. Over-relying on contradiction can produce
          proofs that are hard to follow and don't reveal <em>why</em> something is true.
        </p>
      </WarningBlock>

      <PythonCode
        title="Proof Verification — Python"
        code={`# Verify proof-by-contradiction: sqrt(2) is irrational
# (numeric check that no small rational equals sqrt(2) exactly)
from fractions import Fraction
import math

# Check all rationals p/q with 1 <= p,q <= 1000
sqrt2 = math.sqrt(2)
found = False
for q in range(1, 1001):
    for p in range(1, 1001):
        if Fraction(p, q) ** 2 == Fraction(2):
            print(f"Found rational: {p}/{q}")
            found = True
if not found:
    print("No rational p/q (1<=p,q<=1000) satisfies (p/q)^2 = 2")

# Demonstrate contrapositive: (3n+2 odd) => n odd
def is_odd(n): return n % 2 == 1

failures = [n for n in range(-100, 101) if is_odd(3*n+2) and not is_odd(n)]
print(f"Contrapositive violations in [-100,100]: {len(failures)}")  # should be 0
`}
        runnable
      />
    </div>
  );
}
