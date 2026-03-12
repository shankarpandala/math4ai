import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function ProbabilitySpaceViz() {
  const [pA, setPA] = useState(0.5);
  const [pB, setB] = useState(0.4);
  const [pAB, setAB] = useState(0.2);

  // Validate: pAintersectB <= min(pA, pB), pAunionB <= 1
  const inter = Math.min(pAB, pA, pB);
  const union = pA + pB - inter;
  const valid = union <= 1 && inter >= 0;
  const pBgivenA = pA > 0 ? inter / pA : 0;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Probability Space: Event Probabilities
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        <svg viewBox="0 0 300 200" className="w-full max-w-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <rect x={5} y={5} width={290} height={190} rx={8} fill="none" stroke="#9ca3af" strokeWidth={1.5} />
          <text x={270} y={20} fontSize={11} fill="#6b7280" textAnchor="end">Ω</text>
          {/* A circle */}
          <ellipse cx={115} cy={100} rx={75} ry={60} fill={`rgba(59,130,246,${pA * 0.5})`} stroke="#3b82f6" strokeWidth={2} />
          {/* B circle */}
          <ellipse cx={185} cy={100} rx={75} ry={60} fill={`rgba(16,185,129,${pB * 0.5})`} stroke="#10b981" strokeWidth={2} />
          <text x={80} y={100} fontSize={12} fill="#1d4ed8" fontWeight="700">A</text>
          <text x={220} y={100} fontSize={12} fill="#059669" fontWeight="700">B</text>
          <text x={150} y={100} fontSize={10} fill="#7c3aed" fontWeight="600">A∩B</text>
        </svg>
        <div className="flex-1 space-y-3">
          {[
            { label: 'P(A)', val: pA, set: setPA, color: '#3b82f6' },
            { label: 'P(B)', val: pB, set: setB, color: '#10b981' },
            { label: 'P(A∩B)', val: pAB, set: setAB, color: '#7c3aed' },
          ].map(({ label, val, set, color }) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs" style={{ color }}>
                <span className="font-mono font-semibold">{label}</span><span>{val.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="0.9" step="0.05" value={val}
                onChange={e => set(parseFloat(e.target.value))} className="w-full"
                style={{ accentColor: color }} />
            </div>
          ))}
          <div className={`rounded-lg p-3 text-sm space-y-1 ${valid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div>P(A∪B) = P(A)+P(B)−P(A∩B) = <strong>{union.toFixed(3)}</strong></div>
            <div>P(B|A) = P(A∩B)/P(A) = <strong>{pBgivenA.toFixed(3)}</strong></div>
            <div>P(Aᶜ) = 1−P(A) = <strong>{(1-pA).toFixed(2)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AxiomsSection() {
  return (
    <div className="space-y-8">
      <ProbabilitySpaceViz />

      <DefinitionBlock
        label="Definition 1.1.1"
        title="Kolmogorov Axioms"
        definition={
          "A probability space is a triple $(\\Omega, \\mathcal{F}, P)$ where $\\Omega$ is the sample space, " +
          "$\\mathcal{F}$ is a σ-algebra of events, and $P: \\mathcal{F} \\to [0,1]$ is a probability measure satisfying: " +
          "(K1) $P(\\Omega) = 1$; " +
          "(K2) $P(A) \\geq 0$ for all $A \\in \\mathcal{F}$; " +
          "(K3) For mutually disjoint events $A_1, A_2, \\ldots \\in \\mathcal{F}$: " +
          "$P\\left(\\bigsqcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$ (countable additivity)."
        }
        notation={
          "Consequences: $P(\\emptyset) = 0$; $P(A^c) = 1 - P(A)$; $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ (inclusion-exclusion); " +
          "monotonicity: $A \\subseteq B \\Rightarrow P(A) \\leq P(B)$; " +
          "continuity: $A_n \\nearrow A \\Rightarrow P(A_n) \\nearrow P(A)$."
        }
      />

      <DefinitionBlock
        label="Definition 1.1.2"
        title="Conditional Probability and Independence"
        definition={
          "The conditional probability of $A$ given $B$ (with $P(B) > 0$) is " +
          "$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. " +
          "Events $A$ and $B$ are independent if $P(A \\cap B) = P(A) P(B)$, " +
          "equivalently $P(A|B) = P(A)$ (if $P(B) > 0$). " +
          "A collection $\\{A_i\\}$ is mutually independent if for every finite subset $S$: " +
          "$P\\left(\\bigcap_{i \\in S} A_i\\right) = \\prod_{i \\in S} P(A_i)$."
        }
      />

      <TheoremBlock
        label="Theorem 1.1.1"
        title="Bayes' Theorem"
        statement={
          "Let $\\{B_1, \\ldots, B_n\\}$ be a partition of $\\Omega$ with $P(B_i) > 0$. " +
          "For any event $A$ with $P(A) > 0$: " +
          "$P(B_k | A) = \\frac{P(A | B_k) P(B_k)}{\\sum_{i=1}^n P(A | B_i) P(B_i)} = \\frac{P(A|B_k) P(B_k)}{P(A)}$. " +
          "The denominator $P(A) = \\sum_i P(A|B_i) P(B_i)$ is the law of total probability."
        }
        proof={
          "By definition of conditional probability: $P(B_k|A) = P(B_k \\cap A)/P(A)$. " +
          "Apply conditional probability again: $P(B_k \\cap A) = P(A|B_k) P(B_k)$. " +
          "Expand $P(A) = P(A \\cap \\Omega) = P\\left(A \\cap \\bigsqcup_i B_i\\right) = \\sum_i P(A \\cap B_i) = \\sum_i P(A|B_i)P(B_i)$."
        }
        corollaries={[
          "Prior $P(B_k)$, likelihood $P(A|B_k)$, posterior $P(B_k|A)$ — the language of Bayesian inference.",
          "Conjugate priors: choosing a prior in the same family as the posterior greatly simplifies Bayesian updating.",
        ]}
      />

      <ExampleBlock title="Monty Hall Problem via Conditional Probability">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Three doors: car behind one, goats behind two. You pick door 1. Host opens a goat door (say door 3). Should you switch?
        </p>
        <BlockMath math="P(\text{car at 2} | \text{host opens 3}) = \frac{P(\text{open 3} | \text{car at 2}) P(\text{car at 2})}{P(\text{open 3})} = \frac{1 \cdot 1/3}{1/2} = \frac{2}{3}" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Switching wins with probability 2/3. Staying wins with probability 1/3.
        </p>
      </ExampleBlock>

      <WarningBlock title="Pairwise Independence ≠ Mutual Independence">
        <p>
          Three events can be pairwise independent but not mutually independent.
          Example: flip two fair coins. Let <InlineMath math="A" /> = first coin heads,{' '}
          <InlineMath math="B" /> = second coin heads, <InlineMath math="C" /> = exactly one head.
          Each pair is independent (<InlineMath math="P(A \cap B) = P(A)P(B) = 1/4" />, etc.),
          but <InlineMath math="P(A \cap B \cap C) = 0 \neq P(A)P(B)P(C) = 1/8" />.
          Always check all subsets for mutual independence.
        </p>
      </WarningBlock>

      <PythonCode
        title="Probability Axioms and Bayes' Theorem"
        code={`import numpy as np

# ── Verify Kolmogorov axioms for discrete probability ───────────────────
omega = list(range(1, 7))  # fair die
P = {i: 1/6 for i in omega}  # uniform measure

# K1: P(Omega) = 1
print(f"K1: P(Ω) = {sum(P.values()):.6f}")
# K2: P(A) >= 0
print(f"K2: all P(ω) >= 0: {all(p >= 0 for p in P.values())}")
# K3: countable additivity
A = {1, 2, 3}; B = {4, 5, 6}
PA = sum(P[i] for i in A); PB = sum(P[i] for i in B)
P_AunionB = sum(P[i] for i in A | B)
print(f"K3: P(A∪B) = {P_AunionB:.4f} = P(A)+P(B) = {PA+PB:.4f} (disjoint)")

# ── Bayes' theorem: Medical test ─────────────────────────────────────────
# Disease prevalence, test sensitivity/specificity
P_disease = 0.01       # 1% prevalence
P_pos_given_dis = 0.99  # sensitivity
P_pos_given_no = 0.05   # false positive rate

P_no_disease = 1 - P_disease
P_pos = P_pos_given_dis * P_disease + P_pos_given_no * P_no_disease
P_disease_given_pos = P_pos_given_dis * P_disease / P_pos

print(f"\\nBayes' theorem — Medical test:")
print(f"  P(disease) = {P_disease:.3f}")
print(f"  P(positive | disease) = {P_pos_given_dis:.3f}")
print(f"  P(positive | no disease) = {P_pos_given_no:.3f}")
print(f"  P(positive) = {P_pos:.4f}")
print(f"  P(disease | positive) = {P_disease_given_pos:.4f}")
print(f"  (Only {P_disease_given_pos:.1%} of positive tests are true positives!)")

# ── Monte Carlo verification of Monty Hall ───────────────────────────────
np.random.seed(42)
n = 100000
wins_switch = wins_stay = 0
for _ in range(n):
    car = np.random.randint(3)
    choice = np.random.randint(3)
    # Host opens a goat door (not car, not choice)
    remaining = [d for d in range(3) if d != choice and d != car]
    host_opens = np.random.choice(remaining)
    # Switch to the other door
    switch_to = next(d for d in range(3) if d != choice and d != host_opens)
    wins_switch += (switch_to == car)
    wins_stay += (choice == car)
print(f"\\nMonty Hall (n={n}): stay={wins_stay/n:.4f}, switch={wins_switch/n:.4f}")`}
      />
    </div>
  );
}
