import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const SZ = 280;
const CX = SZ / 2;
const CY = SZ / 2;
const SCALE = 80;

const METRICS = [
  { id: 'euclidean', label: 'Euclidean (L²)', dist: (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) },
  { id: 'manhattan', label: 'Manhattan (L¹)', dist: (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2) },
  { id: 'chebyshev', label: 'Chebyshev (L∞)', dist: (x1, y1, x2, y2) => Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) },
];

function ballPoints(metric, cx, cy, r, steps = 120) {
  // Sample boundary of ball B(center, r) for the given metric
  if (metric.id === 'euclidean') {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const theta = (2 * Math.PI * i) / steps;
      pts.push([cx + r * Math.cos(theta), cy + r * Math.sin(theta)]);
    }
    return pts;
  }
  if (metric.id === 'manhattan') {
    // L1 ball is a diamond
    return [
      [cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r],
    ];
  }
  if (metric.id === 'chebyshev') {
    // L∞ ball is a square
    return [
      [cx - r, cy - r], [cx + r, cy - r], [cx + r, cy + r], [cx - r, cy + r], [cx - r, cy - r],
    ];
  }
  return [];
}

function svgCoord(x, y) {
  return [CX + x * SCALE, CY - y * SCALE];
}

function MetricSpaceViz() {
  const [metricId, setMetricId] = useState('euclidean');
  const [p, setP] = useState({ x: 0.5, y: 0.4 }); // query point (draggable via sliders)
  const [r, setR] = useState(0.7);

  const metric = METRICS.find((m) => m.id === metricId);
  const center = { x: 0, y: 0 };
  const dist = metric.dist(center.x, center.y, p.x, p.y);
  const inside = dist < r;

  const [cx2, cy2] = svgCoord(center.x, center.y);
  const [px2, py2] = svgCoord(p.x, p.y);
  const rSvg = r * SCALE;

  const boundary = ballPoints(metric, cx2, cy2, rSvg);
  const boundaryStr = boundary.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Distance Calculator
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Explore how the unit ball shape changes with the metric. Is the point inside <InlineMath math="B(0, r)" />?
      </p>

      {/* Metric selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetricId(m.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              metricId === m.id
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* SVG */}
        <svg width={SZ} height={SZ} className="rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40 shrink-0">
          {/* Grid */}
          {[-2, -1, 0, 1, 2].map((v) => {
            const [x1, y1] = svgCoord(v, -2.2);
            const [x2, y2] = svgCoord(v, 2.2);
            const [xa, ya] = svgCoord(-2.2, v);
            const [xb, yb] = svgCoord(2.2, v);
            return (
              <g key={v}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth="1" />
                <line x1={xa} y1={ya} x2={xb} y2={yb} stroke="#e2e8f0" strokeWidth="1" />
              </g>
            );
          })}

          {/* Axes */}
          {(() => {
            const [ax, ay] = svgCoord(-2.2, 0);
            const [bx, by] = svgCoord(2.2, 0);
            const [cx3, cy3] = svgCoord(0, -2.2);
            const [dx, dy] = svgCoord(0, 2.2);
            return (
              <>
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#94a3b8" strokeWidth="1.5" />
                <line x1={cx3} y1={cy3} x2={dx} y2={dy} stroke="#94a3b8" strokeWidth="1.5" />
              </>
            );
          })()}

          {/* Ball boundary */}
          {metric.id === 'euclidean' ? (
            <circle cx={cx2} cy={cy2} r={rSvg} fill="#6366f130" stroke="#6366f1" strokeWidth="2" />
          ) : (
            <polygon points={boundaryStr} fill="#6366f130" stroke="#6366f1" strokeWidth="2" />
          )}

          {/* Center */}
          <circle cx={cx2} cy={cy2} r="5" fill="#6366f1" />
          <text x={cx2 + 6} y={cy2 - 6} fontSize="10" fill="#6366f1">O</text>

          {/* Query point */}
          <circle cx={px2} cy={py2} r="6" fill={inside ? '#10b981' : '#f43f5e'} stroke="white" strokeWidth="1.5" />
          <text x={px2 + 7} y={py2 - 6} fontSize="10" fill={inside ? '#10b981' : '#f43f5e'}>P</text>

          {/* Distance line */}
          <line x1={cx2} y1={cy2} x2={px2} y2={py2} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
        </svg>

        {/* Controls and info */}
        <div className="flex-1 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              P.x = {p.x.toFixed(2)}
            </label>
            <input type="range" min={-1.5} max={1.5} step={0.05} value={p.x} onChange={(e) => setP((q) => ({ ...q, x: Number(e.target.value) }))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              P.y = {p.y.toFixed(2)}
            </label>
            <input type="range" min={-1.5} max={1.5} step={0.05} value={p.y} onChange={(e) => setP((q) => ({ ...q, y: Number(e.target.value) }))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Radius r = {r.toFixed(2)}
            </label>
            <input type="range" min={0.2} max={1.8} step={0.05} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40 text-sm space-y-1">
            <div>d(O, P) = <strong>{dist.toFixed(4)}</strong></div>
            <div>r = <strong>{r.toFixed(2)}</strong></div>
            <div className={inside ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              P is <strong>{inside ? 'inside' : 'outside'}</strong> B(O, r)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MetricSpaces() {
  return (
    <div className="space-y-8">
      <MetricSpaceViz />

      <DefinitionBlock
        label="Definition 1.1"
        title="Metric Space"
        definition="A metric space is a pair $(X, d)$ where $X$ is a set and $d: X \times X \to \mathbb{R}_{\geq 0}$ is a distance function satisfying: (1) Non-negativity: $d(x,y) \geq 0$, with $d(x,y) = 0 \iff x = y$. (2) Symmetry: $d(x,y) = d(y,x)$. (3) Triangle inequality: $d(x,z) \leq d(x,y) + d(y,z)$."
        notation="Common metrics on $\mathbb{R}^n$: Euclidean $d_2(x,y) = \|x-y\|_2$, Manhattan $d_1(x,y) = \|x-y\|_1$, Chebyshev $d_\infty(x,y) = \|x-y\|_\infty$."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Open Ball and Open Set"
        definition="In a metric space $(X, d)$, the open ball of radius $r > 0$ centred at $x$ is $B(x, r) = \{y \in X : d(x, y) < r\}$. A set $U \subseteq X$ is open if for every $x \in U$ there exists $r > 0$ with $B(x, r) \subseteq U$."
        notation="Closed balls use $\leq r$. A neighbourhood of $x$ is any set containing an open ball around $x$."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Convergence in Metric Spaces"
        definition="A sequence $(x_n)$ in $(X,d)$ converges to $x$ if $d(x_n, x) \to 0$, i.e., $\forall \varepsilon > 0, \exists N: \forall n > N, d(x_n, x) < \varepsilon$. A sequence is Cauchy if $\forall \varepsilon > 0, \exists N: \forall m,n > N, d(x_m, x_n) < \varepsilon$."
        notation="$(X,d)$ is complete if every Cauchy sequence converges in $X$."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="All p-Norms on ℝⁿ Are Equivalent"
        statement="For any $1 \leq p, q \leq \infty$, the $L^p$ and $L^q$ norms on $\mathbb{R}^n$ are equivalent: there exist constants $c, C > 0$ such that $c\|x\|_p \leq \|x\|_q \leq C\|x\|_p$ for all $x \in \mathbb{R}^n$."
        proof="In finite dimensions it suffices to show each norm is equivalent to $\|\cdot\|_2$. For $1 \leq p \leq \infty$: by Hölder's inequality, $\|x\|_p \leq n^{|1/p - 1/2|} \|x\|_2$. Also $\|x\|_2 \leq n^{1/2 - 1/p} \|x\|_p$ for $p \geq 2$ (and similarly for $p \leq 2$). The explicit constants give the equivalence. $\square$"
        corollaries={[
          'Equivalent norms define the same open sets, hence the same topology on $\\mathbb{R}^n$.',
          'In infinite dimensions (e.g. function spaces) norms are generally NOT equivalent.',
        ]}
      />

      <ExampleBlock
        title="Discrete Metric"
        difficulty="intermediate"
        problem="Verify that the discrete metric $d(x,y) = 0$ if $x = y$ and $d(x,y) = 1$ if $x \neq y$ is a valid metric. Describe its open balls."
        solution={[
          {
            step: 'Verify metric axioms',
            formula: 'd(x,y) \\geq 0,\\; d(x,y)=0 \\iff x=y,\\; d(x,y)=d(y,x)',
            explanation: 'All three basic axioms hold by inspection.',
          },
          {
            step: 'Triangle inequality',
            formula: 'd(x,z) \\leq d(x,y) + d(y,z)',
            explanation: 'If x = z then d(x,z) = 0 ≤ anything. If x ≠ z then at least one of x≠y or y≠z, so d(x,y)+d(y,z) ≥ 1 = d(x,z).',
          },
          {
            step: 'Open balls',
            formula: 'B(x, r) = \\begin{cases} \\{x\\} & r \\leq 1 \\\\ X & r > 1 \\end{cases}',
            explanation: 'Small balls contain only the centre; large balls contain everything.',
          },
          {
            step: 'Every subset is open',
            formula: '\\forall S \\subseteq X,\\; S \\text{ is open} \\quad (\\text{take } r=0.5)',
            explanation: 'Since B(x, 0.5) = {x} ⊆ S for any x ∈ S, every set is open in the discrete topology.',
          },
        ]}
      />

      <WarningBlock title="The Triangle Inequality Is Not Obvious">
        <p className="mb-2">
          When defining a new metric, the triangle inequality is the axiom most likely to fail.
          For example, <InlineMath math="d(x,y) = |x-y|^2" /> on <InlineMath math="\mathbb{R}" /> is
          NOT a metric (take x=0, y=1, z=2: d(x,z)=4 but d(x,y)+d(y,z)=2).
        </p>
        <p>
          Before claiming something is a metric, always verify all four metric axioms — especially
          the triangle inequality.
        </p>
      </WarningBlock>

      <PythonCode
        title="Metric Spaces — Python"
        code={`import numpy as np

def d_euclidean(x, y): return np.linalg.norm(np.array(x) - np.array(y))
def d_manhattan(x, y): return np.sum(np.abs(np.array(x) - np.array(y)))
def d_chebyshev(x, y): return np.max(np.abs(np.array(x) - np.array(y)))

# Verify triangle inequality for random points
rng = np.random.default_rng(42)
pts = rng.standard_normal((100, 2))
for d_fn in [d_euclidean, d_manhattan, d_chebyshev]:
    violations = 0
    for i in range(50):
        x, y, z = pts[i], pts[i+25], pts[i+50]
        if d_fn(x, z) > d_fn(x, y) + d_fn(y, z) + 1e-10:
            violations += 1
    print(f"{d_fn.__name__}: triangle inequality violations = {violations}")

# Equivalence of norms: constants for R^2
n = 2
x = np.array([3.0, 4.0])
print(f"||x||_1={d_manhattan(x,[0,0]):.2f}, ||x||_2={d_euclidean(x,[0,0]):.2f}, ||x||_inf={d_chebyshev(x,[0,0]):.2f}")
print(f"L2 <= sqrt(n)*L_inf: {d_euclidean(x,[0,0]):.4f} <= {np.sqrt(n)*d_chebyshev(x,[0,0]):.4f}")
`}
        runnable
      />
    </div>
  );
}
