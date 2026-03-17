import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function SetOperationViz() {
  const [op, setOp] = useState('union');
  const ops = [
    { key: 'union', label: 'A ∪ B', color: '#6366f1' },
    { key: 'intersection', label: 'A ∩ B', color: '#22c55e' },
    { key: 'difference', label: 'A \\ B', color: '#ef4444' },
    { key: 'complement', label: 'Aᶜ', color: '#f59e0b' },
  ];

  const desc = {
    union: 'Elements in A or B (or both)',
    intersection: 'Elements in both A and B',
    difference: 'Elements in A but not in B',
    complement: 'Elements in the universal set U but not in A',
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Set Operations Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Select an operation to highlight the resulting region in the Venn diagram.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {ops.map(o => (
          <button key={o.key} onClick={() => setOp(o.key)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              op === o.key ? 'bg-indigo-600 text-white' : 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}>{o.label}</button>
        ))}
      </div>
      <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-sm rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <rect x="10" y="10" width="280" height="180" rx="8" fill="none" stroke="#9ca3af" strokeWidth={1} />
        <text x="270" y="25" fontSize={12} fill="#9ca3af">U</text>
        {op === 'complement' && <rect x="10" y="10" width="280" height="180" rx="8" fill="rgba(245,158,11,0.2)" />}
        {op === 'union' && <>
          <circle cx="120" cy="100" r="60" fill="rgba(99,102,241,0.2)" />
          <circle cx="180" cy="100" r="60" fill="rgba(99,102,241,0.2)" />
        </>}
        {op === 'intersection' && <>
          <clipPath id="clipA"><circle cx="120" cy="100" r="60" /></clipPath>
          <circle cx="180" cy="100" r="60" fill="rgba(34,197,94,0.25)" clipPath="url(#clipA)" />
        </>}
        {op === 'difference' && <>
          <circle cx="120" cy="100" r="60" fill="rgba(239,68,68,0.2)" />
          <circle cx="180" cy="100" r="60" fill="white" className="dark:fill-gray-800" />
        </>}
        {op === 'complement' && <circle cx="120" cy="100" r="60" fill="white" className="dark:fill-gray-800" />}
        <circle cx="120" cy="100" r="60" fill="none" stroke="#6366f1" strokeWidth={2} />
        <circle cx="180" cy="100" r="60" fill="none" stroke="#22c55e" strokeWidth={2} />
        <text x="95" y="105" fontSize={14} fill="#6366f1" fontWeight="bold">A</text>
        <text x="195" y="105" fontSize={14} fill="#22c55e" fontWeight="bold">B</text>
      </svg>
      <p className="mt-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">{desc[op]}</p>
    </div>
  );
}

export default function SetsSection() {
  return (
    <div className="space-y-8">
      <SetOperationViz />

      <DefinitionBlock
        label="Definition 2.1.1"
        title="Set"
        definition={
          "A set is an unordered collection of distinct objects called elements (or members). " +
          "We write $x \\in A$ if $x$ is an element of $A$, and $x \\notin A$ otherwise. " +
          "Two sets are equal iff they have exactly the same elements: $A = B \\iff \\forall x\\,(x \\in A \\leftrightarrow x \\in B)$."
        }
        notation={
          "Roster notation: $\\{1, 2, 3\\}$. Set-builder: $\\{x \\in \\mathbb{Z} \\mid x > 0\\}$. " +
          "The empty set is $\\emptyset = \\{\\}$."
        }
      />

      <DefinitionBlock
        label="Definition 2.1.2"
        title="Set Operations"
        definition={
          "Union: $A \\cup B = \\{x \\mid x \\in A \\lor x \\in B\\}$. " +
          "Intersection: $A \\cap B = \\{x \\mid x \\in A \\land x \\in B\\}$. " +
          "Difference: $A \\setminus B = \\{x \\mid x \\in A \\land x \\notin B\\}$. " +
          "Complement: $A^c = U \\setminus A$ where $U$ is the universal set. " +
          "Power set: $\\mathcal{P}(A) = \\{S \\mid S \\subseteq A\\}$, with $|\\mathcal{P}(A)| = 2^{|A|}$."
        }
      />

      <TheoremBlock
        label="Theorem 2.1.1"
        title="De Morgan's Laws for Sets"
        statement={
          "For any sets $A, B$ within universal set $U$: " +
          "$(A \\cup B)^c = A^c \\cap B^c$ and $(A \\cap B)^c = A^c \\cup B^c$."
        }
        proof={
          "For the first law: $x \\in (A \\cup B)^c \\iff x \\notin (A \\cup B) \\iff \\neg(x \\in A \\lor x \\in B) " +
          "\\iff x \\notin A \\land x \\notin B \\iff x \\in A^c \\cap B^c$. The second follows analogously."
        }
      />

      <ExampleBlock
        title="Power Set Construction"
        difficulty="beginner"
        problem="Find the power set of $A = \\{1, 2, 3\\}$ and verify $|\\mathcal{P}(A)| = 2^3 = 8$."
        solution={[
          { step: 'List all subsets by size',
            formula: '\\mathcal{P}(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{3\\}, \\{1,2\\}, \\{1,3\\}, \\{2,3\\}, \\{1,2,3\\}\\}',
            explanation: 'There are $\\binom{3}{0} + \\binom{3}{1} + \\binom{3}{2} + \\binom{3}{3} = 1+3+3+1 = 8$ subsets total.' },
        ]}
      />

      <NoteBlock type="ai" title="Sets in AI/ML">
        <p>
          Sets underpin feature spaces, hypothesis classes, and event spaces in probability.
          The power set of outcomes defines the sigma-algebra for probability measures.
          In NLP, vocabulary sets and bag-of-words models treat documents as sets (or multisets) of tokens.
        </p>
      </NoteBlock>

      <PythonCode
        title="Set Operations in Python"
        code={`# Python sets support all standard operations
A = {1, 2, 3, 4, 5}
B = {3, 4, 5, 6, 7}

print("A ∪ B =", A | B)           # union
print("A ∩ B =", A & B)           # intersection
print("A \\\\ B =", A - B)          # difference
print("A △ B =", A ^ B)           # symmetric difference

# Power set via itertools
from itertools import combinations

def power_set(s):
    s = list(s)
    result = []
    for r in range(len(s) + 1):
        for subset in combinations(s, r):
            result.append(set(subset))
    return result

S = {1, 2, 3}
ps = power_set(S)
print(f"\\nPower set of {S}:")
for subset in ps:
    print(f"  {subset if subset else '{}'}")
print(f"|P(S)| = {len(ps)} = 2^{len(S)}")

# Verify De Morgan's law
U = set(range(1, 11))
Ac = U - A
Bc = U - B
print(f"\\nDe Morgan: (A∪B)ᶜ = {U - (A | B)}")
print(f"           Aᶜ∩Bᶜ = {Ac & Bc}")
print(f"           Equal: {U - (A | B) == Ac & Bc}")`}
      />
    </div>
  );
}
