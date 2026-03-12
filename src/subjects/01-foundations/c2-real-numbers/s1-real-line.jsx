import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const W = 560;
const H = 80;
const LEFT = 40;
const RIGHT = W - 40;
const MID = H / 2;

function toX(val, lo, hi) {
  return LEFT + ((val - lo) / (hi - lo)) * (RIGHT - LEFT);
}

function RealLineViz() {
  const [showRationals, setShowRationals] = useState(true);
  const [showIrrationals, setShowIrrationals] = useState(true);
  const [highlight, setHighlight] = useState('sup'); // 'sup' | 'inf' | 'none'

  // Set S = { x in Q : x^2 < 2 }  →  sup = sqrt(2) ≈ 1.4142
  const sqr2 = Math.sqrt(2);
  const LO = -0.2;
  const HI = 2.2;

  const rationals = [-0, 0.5, 1, 1.2, 1.4, 1.41, 1.414, 1.4142];
  const irrationals = [sqr2, Math.PI / 2 - 0.15];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Real Line &amp; Completeness Explorer
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        The set <InlineMath math="S = \{x \in \mathbb{Q} : x^2 < 2\}" /> has no rational supremum — but it has a real one: <InlineMath math="\sqrt{2}" />.
      </p>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={showRationals} onChange={(e) => setShowRationals(e.target.checked)} className="accent-blue-500" />
          Show rationals in S
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={showIrrationals} onChange={(e) => setShowIrrationals(e.target.checked)} className="accent-rose-500" />
          Show irrational points
        </label>
        <div className="flex gap-2">
          {['sup', 'inf', 'none'].map((h) => (
            <button
              key={h}
              onClick={() => setHighlight(h)}
              className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
                highlight === h ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {h === 'sup' ? 'Highlight sup' : h === 'inf' ? 'Highlight inf' : 'Clear'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG number line */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
        {/* Axis */}
        <line x1={LEFT} y1={MID} x2={RIGHT} y2={MID} stroke="#94a3b8" strokeWidth="2" />
        <polygon points={`${RIGHT},${MID} ${RIGHT - 8},${MID - 4} ${RIGHT - 8},${MID + 4}`} fill="#94a3b8" />

        {/* Tick marks */}
        {[0, 0.5, 1, 1.5, 2].map((v) => {
          const x = toX(v, LO, HI);
          return (
            <g key={v}>
              <line x1={x} y1={MID - 6} x2={x} y2={MID + 6} stroke="#94a3b8" strokeWidth="1.5" />
              <text x={x} y={MID + 18} textAnchor="middle" fontSize="10" fill="#94a3b8">{v}</text>
            </g>
          );
        })}

        {/* Shade region x^2 < 2 */}
        <rect x={toX(0, LO, HI)} y={MID - 4} width={toX(sqr2, LO, HI) - toX(0, LO, HI)} height={8} fill="#818cf880" rx="2" />

        {/* Rational points */}
        {showRationals && rationals.map((r) => (
          <circle key={r} cx={toX(r, LO, HI)} cy={MID} r="4" fill="#3b82f6" opacity="0.85" />
        ))}

        {/* Irrational points */}
        {showIrrationals && irrationals.map((r, i) => (
          <circle key={i} cx={toX(r, LO, HI)} cy={MID} r="5" fill="#f43f5e" opacity="0.9" stroke="white" strokeWidth="1" />
        ))}

        {/* Supremum marker */}
        {highlight === 'sup' && (
          <g>
            <line x1={toX(sqr2, LO, HI)} y1={8} x2={toX(sqr2, LO, HI)} y2={MID + 8} stroke="#6366f1" strokeWidth="2" strokeDasharray="4,2" />
            <text x={toX(sqr2, LO, HI)} y={8} textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="bold">sup S = √2</text>
          </g>
        )}

        {/* Infimum marker */}
        {highlight === 'inf' && (
          <g>
            <line x1={toX(0, LO, HI)} y1={8} x2={toX(0, LO, HI)} y2={MID + 8} stroke="#10b981" strokeWidth="2" strokeDasharray="4,2" />
            <text x={toX(0, LO, HI)} y={8} textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold">inf S = 0</text>
          </g>
        )}

        {/* Legend */}
        <circle cx={LEFT} cy={H - 12} r="4" fill="#3b82f6" />
        <text x={LEFT + 8} y={H - 8} fontSize="9" fill="#94a3b8">rational in S</text>
        <circle cx={LEFT + 90} cy={H - 12} r="4" fill="#f43f5e" />
        <text x={LEFT + 98} y={H - 8} fontSize="9" fill="#94a3b8">irrational (√2, ...)</text>
      </svg>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        The blue region is <InlineMath math="\{x \geq 0 : x^2 < 2\}" />. Rationals get arbitrarily close to <InlineMath math="\sqrt{2}" /> but never reach it — illustrating the <strong>completeness</strong> needed to define <InlineMath math="\mathbb{R}" />.
      </p>
    </div>
  );
}

export default function TheRealNumberSystem() {
  return (
    <div className="space-y-8">
      <RealLineViz />

      <DefinitionBlock
        label="Definition 1.1"
        title="Ordered Field Axioms"
        definition="$\mathbb{R}$ is an ordered field: it satisfies the field axioms (addition and multiplication with identities 0 and 1, inverses, distributivity) plus order axioms: a total order $\leq$ compatible with the field operations ($a \leq b \Rightarrow a+c \leq b+c$; $0 \leq a, 0 \leq b \Rightarrow 0 \leq ab$)."
        notation="$\mathbb{Q}$ also satisfies these axioms. The axiom that distinguishes $\mathbb{R}$ from $\mathbb{Q}$ is completeness."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Supremum and Infimum"
        definition="Let $S \subseteq \mathbb{R}$, $S \neq \emptyset$. An upper bound of $S$ is $M \in \mathbb{R}$ with $s \leq M$ for all $s \in S$. The supremum (least upper bound) $\sup S$ is the smallest upper bound: $\sup S = M$ iff $M$ is an upper bound and no smaller number is. Symmetrically, $\inf S$ is the greatest lower bound."
        notation="$\sup S$ may or may not be in $S$. If $\sup S \in S$ it is called the maximum; if $\inf S \in S$ it is the minimum."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Completeness Axiom (Least Upper Bound Property)"
        definition="Every non-empty subset $S \subseteq \mathbb{R}$ that is bounded above has a supremum in $\mathbb{R}$. This axiom, together with the ordered field axioms, characterises $\mathbb{R}$ uniquely (up to isomorphism)."
        notation="$\mathbb{Q}$ fails this: $S = \{q \in \mathbb{Q} : q^2 < 2\}$ is bounded above in $\mathbb{Q}$ but has no rational supremum."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Archimedean Property"
        statement="For every $x \in \mathbb{R}$, there exists $n \in \mathbb{N}$ such that $n > x$. Equivalently, $\mathbb{N}$ is not bounded above in $\mathbb{R}$."
        proof="Assume for contradiction that $\mathbb{N}$ is bounded above. By the completeness axiom, $s = \sup \mathbb{N}$ exists in $\mathbb{R}$. Since $s-1$ is not an upper bound, there exists $m \in \mathbb{N}$ with $m > s-1$, giving $m+1 > s$. But $m+1 \in \mathbb{N}$, contradicting $s$ being an upper bound of $\mathbb{N}$. $\square$"
        corollaries={[
          'For any $\\varepsilon > 0$ there exists $n \\in \\mathbb{N}$ with $1/n < \\varepsilon$ — rationals of the form $1/n$ can be made arbitrarily small.',
          '$\\mathbb{Q}$ is dense in $\\mathbb{R}$: between any two reals there is a rational.',
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="√2 ∈ ℝ (Completeness guarantees square roots)"
        statement="There exists a positive real number $x$ such that $x^2 = 2$."
        proof="Let $S = \{t \in \mathbb{R} : t^2 < 2\}$. $S$ is non-empty (1 ∈ S) and bounded above (2 is an upper bound since $t \geq 2 \Rightarrow t^2 \geq 4 > 2$). By completeness, $x = \sup S \in \mathbb{R}$. We show $x^2 = 2$ by ruling out $x^2 < 2$ (then $x$ is not an upper bound) and $x^2 > 2$ (then a smaller number is also an upper bound) — both leading to contradictions. Hence $x^2 = 2$. $\square$"
        corollaries={[
          'By the same argument, every positive real has a positive square root.',
          '$\\sqrt{2} \\notin \\mathbb{Q}$ (proved earlier by contradiction), so $\\mathbb{R} \\supsetneq \\mathbb{Q}$.',
        ]}
      />

      <ExampleBlock
        title="Computing sup and inf"
        difficulty="beginner"
        problem="Find $\sup S$ and $\inf S$ for $S = \left\{ \frac{n}{n+1} : n \in \mathbb{N} \right\} = \left\{ \frac{1}{2}, \frac{2}{3}, \frac{3}{4}, \ldots \right\}$."
        solution={[
          {
            step: 'Recognise the sequence is increasing',
            formula: '\\frac{n}{n+1} = 1 - \\frac{1}{n+1}',
            explanation: 'As n increases, 1/(n+1) decreases, so n/(n+1) increases.',
          },
          {
            step: 'Find upper bound',
            formula: '\\frac{n}{n+1} < 1 \\text{ for all } n \\in \\mathbb{N}',
            explanation: 'So 1 is an upper bound for S.',
          },
          {
            step: 'Show sup S = 1',
            formula: '\\sup S = 1 \\notin S',
            explanation: 'For any ε > 0, choosing n > 1/ε - 1 gives n/(n+1) > 1 - ε. So 1-ε is not an upper bound. Hence 1 is the LEAST upper bound.',
          },
          {
            step: 'Find inf S',
            formula: '\\inf S = \\frac{1}{2} \\in S',
            explanation: 'The smallest element is 1/2 (at n=1), so inf S = min S = 1/2.',
          },
        ]}
      />

      <WarningBlock title="sup vs max — They Are Not the Same">
        <p className="mb-2">
          The supremum need not belong to the set. For example:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-sm">
          <li><InlineMath math="\sup(0,1) = 1" /> but <InlineMath math="1 \notin (0,1)" /> — no maximum exists.</li>
          <li><InlineMath math="\sup[0,1] = 1 \in [0,1]" /> — the maximum exists and equals the sup.</li>
        </ul>
        <p className="mt-2">
          Always distinguish: <strong>maximum</strong> = largest element actually in the set;
          <strong> supremum</strong> = least upper bound, which may lie outside the set.
        </p>
      </WarningBlock>

      <PythonCode
        title="Real Number System — Python"
        code={`import math
from fractions import Fraction

# Approximate sqrt(2) via rationals converging to sup S
# S = {q in Q : q^2 < 2}
def rational_approximations_sqrt2(n_steps=10):
    lo, hi = Fraction(0), Fraction(2)
    for _ in range(n_steps):
        mid = (lo + hi) / 2
        if mid * mid < 2:
            lo = mid
        else:
            hi = mid
    return lo, hi

lo, hi = rational_approximations_sqrt2(40)
print(f"Rational bounds after 40 steps: ({float(lo):.15f}, {float(hi):.15f})")
print(f"True sqrt(2):                    {math.sqrt(2):.15f}")

# Archimedean property: find n > x
x = 1e6 + 0.5
n = math.ceil(x) + 1
print(f"For x={x}, n={n} > x: {n > x}")

# sup of n/(n+1)
seq = [n / (n + 1) for n in range(1, 10001)]
print(f"sup{{n/(n+1)}}: {max(seq):.8f}  (approaches 1.0)")
`}
        runnable
      />
    </div>
  );
}
