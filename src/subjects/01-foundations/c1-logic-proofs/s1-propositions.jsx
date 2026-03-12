import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Truth Table Component
// ─────────────────────────────────────────────────────────────────────────────
const TRUTH_TABLE_ROWS = [
  { p: true,  q: true  },
  { p: true,  q: false },
  { p: false, q: true  },
  { p: false, q: false },
];

function boolStr(v) {
  return v ? 'T' : 'F';
}

function TruthTableViz() {
  const [highlightRow, setHighlightRow] = useState(null);
  const [activeOp, setActiveOp] = useState('all');

  const ops = [
    { key: 'all',     label: 'All connectives' },
    { key: 'and',     label: 'AND (∧)' },
    { key: 'or',      label: 'OR (∨)' },
    { key: 'not',     label: 'NOT (¬)' },
    { key: 'implies', label: 'IMPLIES (→)' },
    { key: 'iff',     label: 'IFF (↔)' },
  ];

  const showCol = (key) => activeOp === 'all' || activeOp === key;

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100">
        Interactive Truth Table Explorer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Hover over rows to highlight them. Select a connective to focus.
      </p>

      {/* Op selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ops.map((op) => (
          <button
            key={op.key}
            onClick={() => setActiveOp(op.key)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              activeOp === op.key
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                <InlineMath math="p" />
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                <InlineMath math="q" />
              </th>
              {showCol('not') && (
                <th className="px-4 py-2.5 text-left font-semibold text-purple-700 dark:text-purple-300">
                  <InlineMath math="\neg p" />
                </th>
              )}
              {showCol('and') && (
                <th className="px-4 py-2.5 text-left font-semibold text-blue-700 dark:text-blue-300">
                  <InlineMath math="p \wedge q" />
                </th>
              )}
              {showCol('or') && (
                <th className="px-4 py-2.5 text-left font-semibold text-green-700 dark:text-green-300">
                  <InlineMath math="p \vee q" />
                </th>
              )}
              {showCol('implies') && (
                <th className="px-4 py-2.5 text-left font-semibold text-amber-700 dark:text-amber-300">
                  <InlineMath math="p \rightarrow q" />
                </th>
              )}
              {showCol('iff') && (
                <th className="px-4 py-2.5 text-left font-semibold text-rose-700 dark:text-rose-300">
                  <InlineMath math="p \leftrightarrow q" />
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {TRUTH_TABLE_ROWS.map((row, i) => {
              const notP   = !row.p;
              const and    = row.p && row.q;
              const or     = row.p || row.q;
              const implies = !row.p || row.q;
              const iff    = row.p === row.q;
              const isHigh = highlightRow === i;

              return (
                <tr
                  key={i}
                  onMouseEnter={() => setHighlightRow(i)}
                  onMouseLeave={() => setHighlightRow(null)}
                  className={`cursor-default transition-colors ${
                    isHigh
                      ? 'bg-indigo-50 dark:bg-indigo-900/30'
                      : 'bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/30'
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono font-semibold text-gray-800 dark:text-gray-200">
                    {boolStr(row.p)}
                  </td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-gray-800 dark:text-gray-200">
                    {boolStr(row.q)}
                  </td>
                  {showCol('not') && (
                    <td className={`px-4 py-2.5 font-mono font-semibold ${notP ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {boolStr(notP)}
                    </td>
                  )}
                  {showCol('and') && (
                    <td className={`px-4 py-2.5 font-mono font-semibold ${and ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {boolStr(and)}
                    </td>
                  )}
                  {showCol('or') && (
                    <td className={`px-4 py-2.5 font-mono font-semibold ${or ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {boolStr(or)}
                    </td>
                  )}
                  {showCol('implies') && (
                    <td className={`px-4 py-2.5 font-mono font-semibold ${implies ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>
                      {boolStr(implies)}
                    </td>
                  )}
                  {showCol('iff') && (
                    <td className={`px-4 py-2.5 font-mono font-semibold ${iff ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {boolStr(iff)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend callout for implies */}
      {(activeOp === 'implies' || activeOp === 'all') && (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
          <strong>Note on implication:</strong> <InlineMath math="p \rightarrow q" /> is only
          false when <InlineMath math="p" /> is true and <InlineMath math="q" /> is false
          (vacuous truth makes the other rows true).
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Python code
// ─────────────────────────────────────────────────────────────────────────────
const PROPS_PYTHON_CODE = `from itertools import product

# Define connectives as Python functions
def neg(p):     return not p
def conj(p, q): return p and q
def disj(p, q): return p or q
def impl(p, q): return (not p) or q
def iff(p, q):  return p == q

# Generate full truth table for two variables
def truth_table(func, vars=('p', 'q')):
    print(' | '.join(vars) + ' | result')
    print('-' * (4 * len(vars) + 8))
    for values in product([True, False], repeat=len(vars)):
        row = ' | '.join('T' if v else 'F' for v in values)
        result = func(*values)
        print(f"{row} | {'T' if result else 'F'}")

print("=== AND (conjunction) ===")
truth_table(conj)

print("\\n=== OR (disjunction) ===")
truth_table(disj)

print("\\n=== IMPLIES ===")
truth_table(impl)

print("\\n=== IFF (biconditional) ===")
truth_table(iff)

# Verify De Morgan's Laws
print("\\n=== Verify De Morgan: neg(p AND q) == neg(p) OR neg(q) ===")
for p, q in product([True, False], repeat=2):
    lhs = neg(conj(p, q))
    rhs = disj(neg(p), neg(q))
    status = "OK" if lhs == rhs else "FAIL"
    print(f"p={p}, q={q}: neg(p∧q)={lhs}, neg(p)∨neg(q)={rhs}  [{status}]")

# Check if a formula is a tautology
def is_tautology(func, n_vars=2):
    return all(func(*vals) for vals in product([True, False], repeat=n_vars))

def is_contradiction(func, n_vars=2):
    return not any(func(*vals) for vals in product([True, False], repeat=n_vars))

# Modus ponens is a tautology: ((p -> q) and p) -> q
def modus_ponens(p, q):
    return impl(conj(impl(p, q), p), q)

print("\\nModus ponens is tautology:", is_tautology(modus_ponens))

# Affirming the consequent is NOT a tautology: ((p -> q) and q) -> p
def affirm_consequent(p, q):
    return impl(conj(impl(p, q), q), p)

print("Affirming the consequent is tautology:", is_tautology(affirm_consequent))

# Three-variable formula example: p -> (q -> p)   (always true)
def vacuous(p, q, r):
    return impl(p, impl(q, p))

print("p -> (q -> p) is tautology:", is_tautology(vacuous, n_vars=3))
`;

// ─────────────────────────────────────────────────────────────────────────────
// References
// ─────────────────────────────────────────────────────────────────────────────
const PROPS_REFERENCES = [
  {
    authors: 'Aristotle',
    year: '~350 BCE',
    title: 'Prior Analytics (Analytica Priora)',
    venue: 'Ancient Greek philosophical treatise',
    type: 'foundational',
    whyImportant:
      'Introduced syllogistic logic — the first systematic framework for deductive reasoning, laying groundwork for formal propositional logic.',
  },
  {
    authors: 'Boole, G.',
    year: 1854,
    title: 'An Investigation of the Laws of Thought',
    venue: 'Walton and Maberly, London',
    type: 'foundational',
    whyImportant:
      'Established Boolean algebra — algebraic treatment of logic using 0/1 values, directly enabling digital circuit design and computer science.',
  },
  {
    authors: 'Frege, G.',
    year: 1879,
    title: 'Begriffsschrift (Concept Script)',
    venue: 'Halle: Louis Nebert',
    type: 'foundational',
    whyImportant:
      'Invented predicate logic with quantifiers, extending propositional logic and founding modern mathematical logic.',
  },
  {
    authors: 'Enderton, H. B.',
    year: 2001,
    title: 'A Mathematical Introduction to Logic',
    venue: 'Academic Press, 2nd edition',
    type: 'textbook',
    whyImportant:
      'Rigorous and accessible textbook covering propositional and first-order logic, widely used in undergraduate courses.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main section component
// ─────────────────────────────────────────────────────────────────────────────
export default function PropositionsSection() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Title */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
          Chapter 1 · Logic &amp; Proofs
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          §1 — Propositions &amp; Connectives
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          The atoms of mathematical reasoning: declarative statements that are either true or
          false, combined by logical connectives into compound formulas.
        </p>
      </div>

      {/* 1. Historical note */}
      <NoteBlock type="historical" title="Historical Context">
        <p>
          Formal logic traces to <strong>Aristotle</strong> (~350 BCE), whose <em>Prior
          Analytics</em> laid out syllogistic reasoning — rules for valid inference from
          premises. Two millennia later, <strong>George Boole</strong> (1854) algebraicised
          logic in <em>The Laws of Thought</em>, treating truth values as 0 and 1 and
          logical operations as algebraic laws. <strong>Gottlob Frege</strong> (1879) then
          invented predicate logic with quantifiers, creating the language in which virtually
          all modern mathematics is written. This chain — Aristotle → Boole → Frege — forms
          the direct lineage of propositional logic as studied today, and of every digital
          circuit on the planet.
        </p>
      </NoteBlock>

      {/* 2. Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          What is a Proposition?
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Mathematics is built on <em>statements</em> — sentences that assert something that
          is either true or false, never both, never neither. These are called{' '}
          <strong>propositions</strong>. Not every sentence qualifies: questions, commands,
          and paradoxes like "This statement is false" are excluded.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Sentence</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Proposition?</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { sentence: '"2 + 2 = 4"', prop: 'Yes (True)', reason: 'Determinate truth value' },
                { sentence: '"All prime numbers are odd"', prop: 'Yes (False)', reason: 'Determinate (counterexample: 2)' },
                { sentence: '"Is the sky blue?"', prop: 'No', reason: 'A question, not a declarative' },
                { sentence: '"This statement is false"', prop: 'No', reason: 'Paradox — no consistent truth value' },
                { sentence: '"x > 5"', prop: 'No (open formula)', reason: 'Depends on free variable x' },
              ].map((r, i) => (
                <tr key={i} className="bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/30">
                  <td className="px-4 py-2.5 font-mono text-gray-800 dark:text-gray-200">{r.sentence}</td>
                  <td className={`px-4 py-2.5 font-semibold ${r.prop.startsWith('Yes') ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{r.prop}</td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Definition: Proposition */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Proposition"
        definition="A proposition (or statement) is a declarative sentence that has a definite truth value: either True (denoted $\top$ or $1$) or False (denoted $\bot$ or $0$), but not both and not neither. Propositions are typically denoted by lowercase letters $p, q, r, \ldots$"
        notation="$p = $ 'It is raining.' has truth value $\top$ (True) or $\bot$ (False) depending on the weather."
      />

      {/* 4. Connectives definitions */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
          Logical Connectives
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Simple propositions are combined into compound ones using{' '}
          <strong>logical connectives</strong>. The five fundamental connectives and their
          truth conditions are:
        </p>
        <div className="space-y-4">
          {[
            {
              name: 'Negation (NOT)',
              symbol: '\\neg p',
              desc: 'True when $p$ is false. Flips the truth value.',
              table: '\\begin{array}{c|c} p & \\neg p \\\\ \\hline T & F \\\\ F & T \\end{array}',
            },
            {
              name: 'Conjunction (AND)',
              symbol: 'p \\wedge q',
              desc: 'True only when both $p$ and $q$ are true.',
              table: '\\begin{array}{c c|c} p & q & p \\wedge q \\\\ \\hline T & T & T \\\\ T & F & F \\\\ F & T & F \\\\ F & F & F \\end{array}',
            },
            {
              name: 'Disjunction (OR)',
              symbol: 'p \\vee q',
              desc: 'True when at least one of $p$, $q$ is true (inclusive or).',
              table: '\\begin{array}{c c|c} p & q & p \\vee q \\\\ \\hline T & T & T \\\\ T & F & T \\\\ F & T & T \\\\ F & F & F \\end{array}',
            },
            {
              name: 'Implication (IF…THEN)',
              symbol: 'p \\rightarrow q',
              desc: 'False only when $p$ is true and $q$ is false. Read: "$p$ implies $q$" or "if $p$ then $q$".',
              table: '\\begin{array}{c c|c} p & q & p \\rightarrow q \\\\ \\hline T & T & T \\\\ T & F & F \\\\ F & T & T \\\\ F & F & T \\end{array}',
            },
            {
              name: 'Biconditional (IFF)',
              symbol: 'p \\leftrightarrow q',
              desc: 'True when $p$ and $q$ have the same truth value. Equivalent to $(p \\rightarrow q) \\wedge (q \\rightarrow p)$.',
              table: '\\begin{array}{c c|c} p & q & p \\leftrightarrow q \\\\ \\hline T & T & T \\\\ T & F & F \\\\ F & T & F \\\\ F & F & T \\end{array}',
            },
          ].map((conn, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">
                    {conn.name} — <InlineMath math={conn.symbol} />
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{conn.desc.replace(/\$([^$]+)\$/g, '')}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {/* Simplified prose; the table on the right shows the math */}
                  </p>
                </div>
                <div className="shrink-0">
                  <BlockMath math={conn.table} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive truth table */}
      <TruthTableViz />

      {/* 6. Definition: Propositional formula */}
      <DefinitionBlock
        label="Definition 1.2"
        title="Propositional Formula (Well-Formed Formula)"
        definition="A propositional formula (WFF) is defined inductively: (1) Every propositional variable $p, q, r, \ldots$ is a WFF. (2) If $\phi$ is a WFF, then $\neg \phi$ is a WFF. (3) If $\phi$ and $\psi$ are WFFs, then $(\phi \wedge \psi)$, $(\phi \vee \psi)$, $(\phi \rightarrow \psi)$, and $(\phi \leftrightarrow \psi)$ are WFFs. (4) Nothing else is a WFF."
        notation="A formula is a tautology if it is true for all truth assignments; a contradiction if false for all assignments; contingent otherwise."
      />

      {/* 7. De Morgan's Laws */}
      <TheoremBlock
        label="Theorem 1.1"
        title="De Morgan's Laws"
        statement="For any propositions $P$ and $Q$: $\neg(P \wedge Q) \equiv \neg P \vee \neg Q$ and $\neg(P \vee Q) \equiv \neg P \wedge \neg Q$. Here $\equiv$ denotes logical equivalence (same truth value for all assignments)."
        proof="We verify by exhaustive truth table. For the first law, consider all four cases of $(P, Q)$:
Case (T,T): LHS = $\neg(T \wedge T) = \neg T = F$; RHS = $F \vee F = F$. Equal.
Case (T,F): LHS = $\neg(T \wedge F) = \neg F = T$; RHS = $F \vee T = T$. Equal.
Case (F,T): LHS = $\neg(F \wedge T) = \neg F = T$; RHS = $T \vee F = T$. Equal.
Case (F,F): LHS = $\neg(F \wedge F) = \neg F = T$; RHS = $T \vee T = T$. Equal.
Since all cases agree, $\neg(P \wedge Q) \equiv \neg P \vee \neg Q$. The second law follows analogously (or by duality — replacing $\wedge \leftrightarrow \vee$ and $T \leftrightarrow F$ throughout). $\square$"
        corollaries={[
          "De Morgan's laws allow us to push negation inward: $\\neg(P_1 \\wedge \\cdots \\wedge P_n) \\equiv \\neg P_1 \\vee \\cdots \\vee \\neg P_n$.",
          "They are the foundation of negation-normal form (NNF), used in automated theorem provers and SAT solvers.",
          "In set theory, they correspond to: $(A \\cap B)^c = A^c \\cup B^c$ and $(A \\cup B)^c = A^c \\cap B^c$.",
        ]}
      />

      {/* 8. Modus Ponens Example */}
      <ExampleBlock
        title="Modus Ponens — A Valid Argument"
        difficulty="beginner"
        problem="Determine whether the following argument is logically valid: 'If it rains, then the ground is wet. It rained. Therefore, the ground is wet.' Identify the argument form and verify validity."
        solution={[
          {
            step: 'Symbolise the argument',
            formula: 'p = \\text{"It rains"}, \\quad q = \\text{"The ground is wet"}',
            explanation: 'Premise 1: $p \\rightarrow q$. Premise 2: $p$. Conclusion: $q$.',
          },
          {
            step: 'Identify the argument form: Modus Ponens',
            formula: '\\frac{p \\rightarrow q \\quad p}{\\therefore\\; q}',
            explanation: 'This classical inference rule says: if we know $p \\rightarrow q$ and $p$, we may conclude $q$.',
          },
          {
            step: 'Verify validity via truth table — check that the argument form is a tautology',
            formula: '[(p \\rightarrow q) \\wedge p] \\rightarrow q',
            explanation: 'An argument is valid iff it is impossible for all premises to be true and the conclusion false. We check if this formula is a tautology.',
          },
          {
            step: 'Evaluate all cases',
            formula: '\\begin{array}{c c|c c|c} p & q & p\\rightarrow q & (p\\rightarrow q)\\wedge p & \\text{conclusion valid?} \\\\ \\hline T & T & T & T & T \\\\ T & F & F & F & \\text{(premises not both true)} \\\\ F & T & T & F & \\text{(premises not both true)} \\\\ F & F & T & F & \\text{(premises not both true)} \\end{array}',
            explanation: 'In every row where both premises are true (row 1), the conclusion $q$ is also true. Therefore the argument is valid.',
          },
          {
            step: 'Conclusion',
            formula: '\\models\\; [(p \\rightarrow q) \\wedge p] \\rightarrow q',
            explanation: 'The formula is a tautology ($\\models$ means "is a tautology"). Modus Ponens is a sound and valid inference rule.',
          },
        ]}
      />

      {/* 9. Warning: Logical Fallacies */}
      <WarningBlock title="Common Logical Fallacies">
        <p className="mb-3">
          Two fallacies are frequently confused with valid inference rules:
        </p>
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-900/20">
            <p className="mb-1 text-sm font-bold text-red-700 dark:text-red-400">
              Affirming the Consequent (INVALID)
            </p>
            <BlockMath math="\frac{p \rightarrow q \quad q}{\therefore\; p} \quad \text{(FALLACY)}" />
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
              Example: "If it rains, the ground is wet. The ground is wet. Therefore it rained."
              The ground could be wet for other reasons (sprinkler, flood). This is invalid because
              when <InlineMath math="p = F, q = T" />, both premises are true but the conclusion is false.
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-900/20">
            <p className="mb-1 text-sm font-bold text-red-700 dark:text-red-400">
              Denying the Antecedent (INVALID)
            </p>
            <BlockMath math="\frac{p \rightarrow q \quad \neg p}{\therefore\; \neg q} \quad \text{(FALLACY)}" />
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
              Example: "If it rains, the ground is wet. It did not rain. Therefore the ground is
              not wet." Again invalid — other causes can wet the ground.
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800/40 dark:bg-green-900/20">
            <p className="mb-1 text-sm font-bold text-green-700 dark:text-green-400">
              Modus Tollens (VALID — contrast)
            </p>
            <BlockMath math="\frac{p \rightarrow q \quad \neg q}{\therefore\; \neg p} \quad \text{(VALID)}" />
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
              "If it rains, the ground is wet. The ground is not wet. Therefore it did not rain."
              This IS valid — if the consequent is false, the antecedent must be false.
            </p>
          </div>
        </div>
      </WarningBlock>

      {/* 10. Python code */}
      <PythonCode
        code={PROPS_PYTHON_CODE}
        title="Truth Tables & Tautology Checking — Python"
        runnable
      />

      {/* References */}
      <ReferenceList references={PROPS_REFERENCES} />
    </div>
  );
}
