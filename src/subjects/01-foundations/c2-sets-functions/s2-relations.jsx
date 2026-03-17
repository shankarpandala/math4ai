import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function RelationPropertyChecker() {
  const [pairs, setPairs] = useState([[1,1],[2,2],[3,3],[1,2],[2,1]]);
  const elements = [...new Set(pairs.flat())].sort((a, b) => a - b);

  const isReflexive = elements.every(e => pairs.some(([a, b]) => a === e && b === e));
  const isSymmetric = pairs.every(([a, b]) => pairs.some(([c, d]) => c === b && d === a));
  const isTransitive = pairs.every(([a, b]) =>
    pairs.filter(([c, d]) => c === b).every(([c, d]) => pairs.some(([e, f]) => e === a && f === d))
  );

  const presets = [
    { label: 'Equivalence', val: [[1,1],[2,2],[3,3],[1,2],[2,1]] },
    { label: 'Partial Order', val: [[1,1],[2,2],[3,3],[1,2],[1,3],[2,3]] },
    { label: 'Not transitive', val: [[1,2],[2,3]] },
  ];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Relation Property Checker
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Select a preset relation and check which properties it satisfies.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {presets.map(p => (
          <button key={p.label} onClick={() => setPairs(p.val)}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {p.label}
          </button>
        ))}
      </div>
      <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
        R = {'{'} {pairs.map(([a, b]) => `(${a},${b})`).join(', ')} {'}'}
      </p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Reflexive', val: isReflexive },
          { label: 'Symmetric', val: isSymmetric },
          { label: 'Transitive', val: isTransitive },
        ].map(({ label, val }) => (
          <span key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${
            val ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>{val ? '✓' : '✗'} {label}</span>
        ))}
        {isReflexive && isSymmetric && isTransitive && (
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            Equivalence Relation
          </span>
        )}
      </div>
    </div>
  );
}

export default function RelationsSection() {
  return (
    <div className="space-y-8">
      <RelationPropertyChecker />

      <DefinitionBlock
        label="Definition 2.2.1"
        title="Binary Relation"
        definition={
          "A binary relation $R$ from set $A$ to set $B$ is a subset $R \\subseteq A \\times B$. " +
          "We write $aRb$ or $(a,b) \\in R$ to mean $a$ is related to $b$. " +
          "When $A = B$, we call $R$ a relation on $A$."
        }
        notation="$A \\times B = \\{(a,b) \\mid a \\in A, b \\in B\\}$ is the Cartesian product."
      />

      <DefinitionBlock
        label="Definition 2.2.2"
        title="Properties of Relations"
        definition={
          "A relation $R$ on $A$ is: " +
          "Reflexive if $\\forall a \\in A,\\; aRa$. " +
          "Symmetric if $aRb \\implies bRa$. " +
          "Antisymmetric if $aRb \\land bRa \\implies a = b$. " +
          "Transitive if $aRb \\land bRc \\implies aRc$."
        }
      />

      <DefinitionBlock
        label="Definition 2.2.3"
        title="Equivalence Relation"
        definition={
          "A relation that is reflexive, symmetric, and transitive is an equivalence relation. " +
          "The equivalence class of $a$ is $[a] = \\{b \\in A \\mid aRb\\}$. " +
          "The set of all equivalence classes forms a partition of $A$."
        }
      />

      <TheoremBlock
        label="Theorem 2.2.1"
        title="Equivalence Classes Partition"
        statement="If $\\sim$ is an equivalence relation on $A$, then the equivalence classes $\\{[a] \\mid a \\in A\\}$ form a partition of $A$: they are pairwise disjoint and their union is $A$."
        proof={
          "Reflexivity gives $a \\in [a]$, so the union covers $A$. " +
          "Suppose $[a] \\cap [b] \\neq \\emptyset$, say $c \\in [a] \\cap [b]$. Then $a \\sim c$ and $b \\sim c$. " +
          "By symmetry $c \\sim b$, and by transitivity $a \\sim b$. Then for any $x \\in [a]$, $x \\sim a \\sim b$, so $x \\in [b]$. Similarly $[b] \\subseteq [a]$, hence $[a] = [b]$."
        }
      />

      <ExampleBlock
        title="Congruence Modulo n"
        difficulty="intermediate"
        problem="Show that $a \\equiv b \\pmod{3}$ defines an equivalence relation on $\\mathbb{Z}$ and find its equivalence classes."
        solution={[
          { step: 'Reflexive', formula: 'a - a = 0 = 3 \\cdot 0', explanation: '$3 \\mid 0$, so $a \\equiv a \\pmod{3}$.' },
          { step: 'Symmetric', formula: 'a - b = 3k \\implies b - a = 3(-k)', explanation: 'If $3 \\mid (a-b)$ then $3 \\mid (b-a)$.' },
          { step: 'Transitive', formula: 'a-b=3k,\\; b-c=3m \\implies a-c = 3(k+m)', explanation: 'Sum of multiples of 3 is a multiple of 3.' },
          { step: 'Classes', formula: '[0] = \\{\\ldots,-3,0,3,6,\\ldots\\},\\; [1] = \\{\\ldots,-2,1,4,7,\\ldots\\},\\; [2] = \\{\\ldots,-1,2,5,8,\\ldots\\}',
            explanation: 'Three classes partition $\\mathbb{Z}$: remainders 0, 1, 2 modulo 3.' },
        ]}
      />

      <NoteBlock type="ai" title="Relations in AI">
        <p>
          Equivalence relations define feature groupings and clustering: data points in the same
          cluster are &quot;equivalent.&quot; Partial orders appear in topological sorting of
          computation graphs (e.g., neural network layers). Knowledge graphs use relations
          extensively to encode semantic relationships between entities.
        </p>
      </NoteBlock>

      <PythonCode
        title="Relations & Equivalence Classes in Python"
        code={`# Check relation properties
def check_properties(R, elements):
    reflexive = all((a, a) in R for a in elements)
    symmetric = all((b, a) in R for (a, b) in R)
    transitive = all((a, d) in R
                     for (a, b) in R
                     for (c, d) in R if b == c)
    return reflexive, symmetric, transitive

# Congruence mod 3 on {0,...,8}
elements = set(range(9))
R = {(a, b) for a in elements for b in elements if (a - b) % 3 == 0}

ref, sym, trans = check_properties(R, elements)
print(f"Reflexive: {ref}, Symmetric: {sym}, Transitive: {trans}")

# Build equivalence classes
def equiv_classes(R, elements):
    classes = []
    remaining = set(elements)
    for a in elements:
        if a in remaining:
            cls = {b for b in elements if (a, b) in R}
            classes.append(cls)
            remaining -= cls
    return classes

classes = equiv_classes(R, elements)
print(f"\\nEquivalence classes mod 3:")
for cls in classes:
    print(f"  {sorted(cls)}")

print(f"Classes partition Z_9: {set().union(*classes) == elements}")`}
      />
    </div>
  );
}
