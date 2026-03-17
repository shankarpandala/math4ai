import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function FunctionTypeViz() {
  const [fnType, setFnType] = useState('injective');
  const types = [
    { key: 'injective', label: 'Injective (1-to-1)' },
    { key: 'surjective', label: 'Surjective (onto)' },
    { key: 'bijective', label: 'Bijective' },
    { key: 'neither', label: 'Neither' },
  ];

  const mappings = {
    injective:  { domain: ['a','b','c'], codomain: ['1','2','3','4'], arrows: [['a','1'],['b','3'],['c','4']] },
    surjective: { domain: ['a','b','c','d'], codomain: ['1','2','3'], arrows: [['a','1'],['b','2'],['c','3'],['d','2']] },
    bijective:  { domain: ['a','b','c'], codomain: ['1','2','3'], arrows: [['a','2'],['b','1'],['c','3']] },
    neither:    { domain: ['a','b','c'], codomain: ['1','2','3'], arrows: [['a','1'],['b','1'],['c','2']] },
  };

  const m = mappings[fnType];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Function Types Visualizer
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Select a function type to see the mapping diagram.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {types.map(t => (
          <button key={t.key} onClick={() => setFnType(t.key)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              fnType === t.key ? 'bg-indigo-600 text-white' : 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}>{t.label}</button>
        ))}
      </div>
      <svg viewBox="0 0 300 180" className="mx-auto w-full max-w-sm rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <ellipse cx="80" cy="90" rx="45" ry="70" fill="none" stroke="#6366f1" strokeWidth={2} />
        <ellipse cx="220" cy="90" rx="45" ry="70" fill="none" stroke="#22c55e" strokeWidth={2} />
        <text x="80" y="15" textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight="bold">Domain</text>
        <text x="220" y="15" textAnchor="middle" fontSize={11} fill="#22c55e" fontWeight="bold">Codomain</text>
        {m.domain.map((d, i) => {
          const y = 50 + i * (120 / Math.max(m.domain.length - 1, 1));
          return <text key={d} x="80" y={y} textAnchor="middle" fontSize={13} fill="#374151" fontWeight="600">{d}</text>;
        })}
        {m.codomain.map((c, i) => {
          const y = 50 + i * (120 / Math.max(m.codomain.length - 1, 1));
          return <text key={c} x="220" y={y} textAnchor="middle" fontSize={13} fill="#374151" fontWeight="600">{c}</text>;
        })}
        {m.arrows.map(([from, to], i) => {
          const fi = m.domain.indexOf(from);
          const ti = m.codomain.indexOf(to);
          const y1 = 47 + fi * (120 / Math.max(m.domain.length - 1, 1));
          const y2 = 47 + ti * (120 / Math.max(m.codomain.length - 1, 1));
          return <line key={i} x1="100" y1={y1} x2="200" y2={y2} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#arrowR)" />;
        })}
        <defs><marker id="arrowR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
        </marker></defs>
      </svg>
    </div>
  );
}

export default function FunctionsSection() {
  return (
    <div className="space-y-8">
      <FunctionTypeViz />

      <DefinitionBlock
        label="Definition 2.3.1"
        title="Function"
        definition={
          "A function $f: A \\to B$ is a relation $f \\subseteq A \\times B$ such that for every $a \\in A$ " +
          "there exists exactly one $b \\in B$ with $(a, b) \\in f$. We write $f(a) = b$. " +
          "$A$ is the domain, $B$ is the codomain, and $f(A) = \\{f(a) \\mid a \\in A\\}$ is the image (range)."
        }
      />

      <DefinitionBlock
        label="Definition 2.3.2"
        title="Injective, Surjective, Bijective"
        definition={
          "Injective (one-to-one): $f(a_1) = f(a_2) \\implies a_1 = a_2$. " +
          "Surjective (onto): $\\forall b \\in B,\\; \\exists a \\in A,\\; f(a) = b$. " +
          "Bijective: both injective and surjective. A bijection has an inverse $f^{-1}: B \\to A$."
        }
      />

      <TheoremBlock
        label="Theorem 2.3.1"
        title="Composition of Functions"
        statement={
          "If $f: A \\to B$ is injective and $g: B \\to C$ is injective, then $g \\circ f: A \\to C$ is injective. " +
          "Similarly, if both are surjective, the composition is surjective. Hence bijections compose to bijections."
        }
        proof={
          "Suppose $(g \\circ f)(a_1) = (g \\circ f)(a_2)$, i.e., $g(f(a_1)) = g(f(a_2))$. " +
          "Since $g$ is injective, $f(a_1) = f(a_2)$. Since $f$ is injective, $a_1 = a_2$."
        }
      />

      <ExampleBlock
        title="Verifying Bijectivity"
        difficulty="intermediate"
        problem="Show that $f: \\mathbb{R} \\to \\mathbb{R}$ defined by $f(x) = 2x + 3$ is bijective and find $f^{-1}$."
        solution={[
          { step: 'Injective', formula: 'f(a) = f(b) \\implies 2a+3 = 2b+3 \\implies a = b', explanation: 'Different inputs give different outputs.' },
          { step: 'Surjective', formula: '\\forall y \\in \\mathbb{R},\\; x = \\frac{y-3}{2} \\implies f(x) = y', explanation: 'Every real number is achieved.' },
          { step: 'Inverse', formula: 'f^{-1}(y) = \\frac{y-3}{2}', explanation: 'Verify: $f(f^{-1}(y)) = 2 \\cdot \\frac{y-3}{2} + 3 = y$.' },
        ]}
      />

      <WarningBlock title="Codomain vs. Range">
        <p>
          The codomain and range are different concepts. For <InlineMath math="f: \mathbb{R} \to \mathbb{R}" /> with{' '}
          <InlineMath math="f(x) = x^2" />, the codomain is <InlineMath math="\mathbb{R}" /> but the
          range is <InlineMath math="[0, \infty)" />. This function is surjective onto <InlineMath math="[0,\infty)" /> but
          not onto <InlineMath math="\mathbb{R}" />.
        </p>
      </WarningBlock>

      <PythonCode
        title="Function Properties in Python"
        code={`# Check injectivity, surjectivity for finite functions
def is_injective(f, domain):
    images = [f(x) for x in domain]
    return len(images) == len(set(images))

def is_surjective(f, domain, codomain):
    images = {f(x) for x in domain}
    return codomain.issubset(images)

# Example: f(x) = x^2 on {-2,-1,0,1,2} -> {0,1,2,3,4}
domain = {-2, -1, 0, 1, 2}
codomain = {0, 1, 4}
f = lambda x: x**2

print(f"f(x) = x^2")
print(f"Injective: {is_injective(f, domain)}")  # False: f(-1) = f(1)
print(f"Surjective onto {codomain}: {is_surjective(f, domain, codomain)}")

# Bijection example: f(x) = 2x + 3
import numpy as np

f_bij = lambda x: 2*x + 3
f_inv = lambda y: (y - 3) / 2

xs = np.array([-2, -1, 0, 1, 2], dtype=float)
print(f"\\nf(x) = 2x+3: {[f_bij(x) for x in xs]}")
print(f"f_inv(f(x)): {[f_inv(f_bij(x)) for x in xs]}")
print(f"f(f_inv(x)): {[f_bij(f_inv(x)) for x in xs]}")

# Composition
g = lambda x: x**2
h = lambda x: x + 1
composed = lambda x: g(h(x))  # (x+1)^2
print(f"\\n(g ∘ h)(2) = g(h(2)) = g(3) = {composed(2)}")
print(f"(h ∘ g)(2) = h(g(2)) = h(4) = {h(g(2))}")
print(f"Composition is not commutative: g∘h ≠ h∘g")`}
      />
    </div>
  );
}
