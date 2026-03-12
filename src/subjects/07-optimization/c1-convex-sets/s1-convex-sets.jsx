import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Polygon vertices for demo shapes
const SHAPES = {
  convex: [
    { x: 200, y: 60 },
    { x: 320, y: 120 },
    { x: 300, y: 240 },
    { x: 160, y: 260 },
    { x: 80, y: 160 },
  ],
  nonconvex: [
    { x: 200, y: 60 },
    { x: 320, y: 160 },
    { x: 220, y: 160 },
    { x: 300, y: 260 },
    { x: 100, y: 200 },
  ],
};

function lerp(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function pointInPolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
      (pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function InteractiveConvexSet() {
  const [shape, setShape] = useState('convex');
  const [t, setT] = useState(0.5);
  const [ptA] = useState({ x: 140, y: 200 });
  const [ptB] = useState({ x: 280, y: 100 });

  const poly = SHAPES[shape];
  const combo = lerp(ptA, ptB, t);
  const polyStr = poly.map(p => `${p.x},${p.y}`).join(' ');
  const comboInside = pointInPolygon(combo, poly);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Convex Combination Test</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Move <InlineMath math="t" /> to trace the convex combination <InlineMath math="\theta A + (1-\theta)B" />. Switch shape to see non-convexity.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width="400" height="300" className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <polygon points={polyStr} fill={shape === 'convex' ? '#dbeafe' : '#fce7f3'} stroke={shape === 'convex' ? '#3b82f6' : '#ec4899'} strokeWidth="2" />
          <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4,3" />
          <circle cx={ptA.x} cy={ptA.y} r="6" fill="#3b82f6" />
          <text x={ptA.x + 8} y={ptA.y - 6} fontSize="13" fill="#1d4ed8">A</text>
          <circle cx={ptB.x} cy={ptB.y} r="6" fill="#3b82f6" />
          <text x={ptB.x + 8} y={ptB.y - 6} fontSize="13" fill="#1d4ed8">B</text>
          <circle cx={combo.x} cy={combo.y} r="7" fill={comboInside ? '#10b981' : '#ef4444'} />
          <text x={combo.x + 9} y={combo.y + 4} fontSize="11" fill={comboInside ? '#065f46' : '#7f1d1d'}>
            {comboInside ? 'inside ✓' : 'outside ✗'}
          </text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[160px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shape</label>
            <select
              value={shape}
              onChange={e => setShape(e.target.value)}
              className="block w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 text-sm"
            >
              <option value="convex">Convex polygon</option>
              <option value="nonconvex">Non-convex polygon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`\\theta = ${t.toFixed(2)}`} />
            </label>
            <input type="range" min="0" max="1" step="0.01" value={t} onChange={e => setT(+e.target.value)} className="w-full" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Green = combination inside set (convex)<br />
            Red = combination outside set (not convex)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConvexSets() {
  return (
    <div className="space-y-8">
      <InteractiveConvexSet />

      <DefinitionBlock title="Convex Set">
        <p>
          A set <InlineMath math="C \subseteq \mathbb{R}^n" /> is <strong>convex</strong> if for any two points
          <InlineMath math="x, y \in C" /> and any <InlineMath math="\theta \in [0,1]" />, the convex combination
          also lies in <InlineMath math="C" />:
        </p>
        <BlockMath math="\theta x + (1-\theta)y \in C \quad \forall\, x,y \in C,\; \theta \in [0,1]." />
        <p className="mt-2">
          The <strong>convex hull</strong> <InlineMath math="\operatorname{conv}(S)" /> of a set <InlineMath math="S" /> is
          the smallest convex set containing <InlineMath math="S" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Hyperplanes, Halfspaces, and Cones">
        <p>
          A <strong>hyperplane</strong> is a set of the form <InlineMath math="\{x : a^\top x = b\}" /> with
          <InlineMath math="a \neq 0" />. A <strong>halfspace</strong> is <InlineMath math="\{x : a^\top x \leq b\}" />.
        </p>
        <BlockMath math="\text{Halfspace: } \{x \in \mathbb{R}^n : a^\top x \leq b\},\quad a \in \mathbb{R}^n,\; b \in \mathbb{R}." />
        <p className="mt-2">
          A <strong>cone</strong> <InlineMath math="K" /> satisfies: <InlineMath math="x \in K \Rightarrow \lambda x \in K" /> for
          all <InlineMath math="\lambda \geq 0" />. A <strong>convex cone</strong> is both convex and a cone.
          The <strong>second-order cone</strong> (ice-cream cone) is
        </p>
        <BlockMath math="\mathcal{C} = \{(x, t) \in \mathbb{R}^{n+1} : \|x\|_2 \leq t\}." />
      </DefinitionBlock>

      <DefinitionBlock title="Projection onto a Convex Set">
        <p>
          For a closed convex set <InlineMath math="C" /> and a point <InlineMath math="x \notin C" />, the
          <strong> projection</strong> is the unique nearest point:
        </p>
        <BlockMath math="\Pi_C(x) = \underset{y \in C}{\arg\min}\; \|x - y\|_2." />
        <p className="mt-2">The projection satisfies the <em>characterization inequality</em>:</p>
        <BlockMath math="(x - \Pi_C(x))^\top (y - \Pi_C(x)) \leq 0 \quad \forall\, y \in C." />
      </DefinitionBlock>

      <TheoremBlock
        title="Separating Hyperplane Theorem"
        proof="If C and D are disjoint convex sets, consider the minimum-distance pair (c*, d*) = argmin ||c-d|| over C×D. The hyperplane {x : a⊤x = b} with a = d*-c* and b = a⊤(c*+d*)/2 separates them. Details require closedness and compactness arguments for unbounded sets."
      >
        <p>
          Let <InlineMath math="C, D \subseteq \mathbb{R}^n" /> be nonempty disjoint convex sets. Then there exists
          a hyperplane that separates them: there is <InlineMath math="a \neq 0" /> and <InlineMath math="b" /> such that
        </p>
        <BlockMath math="a^\top x \leq b \;\;\forall x \in C \quad \text{and} \quad a^\top x \geq b \;\;\forall x \in D." />
        <p className="mt-2">
          If the sets are additionally closed and one is compact, the separation is strict.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Supporting Hyperplane Theorem"
        proof="For x₀ on the boundary of convex C, {x₀} and the interior of C are disjoint convex sets. Applying the separating hyperplane theorem yields the supporting hyperplane at x₀."
      >
        <p>
          For a convex set <InlineMath math="C" /> and a boundary point <InlineMath math="x_0 \in \partial C" />,
          there exists a <strong>supporting hyperplane</strong> at <InlineMath math="x_0" />: a nonzero vector
          <InlineMath math="a" /> such that
        </p>
        <BlockMath math="a^\top x \leq a^\top x_0 \quad \forall\, x \in C." />
      </TheoremBlock>

      <ExampleBlock title="Convex Sets in Machine Learning">
        <p>Many sets arising in ML are convex:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>The set of probability distributions over a finite alphabet (the probability simplex)</li>
          <li>The positive semidefinite cone <InlineMath math="\mathbb{S}^n_+ = \{X \in \mathbb{S}^n : X \succeq 0\}" /></li>
          <li>The <InlineMath math="\ell_1" /> ball <InlineMath math="\{x : \|x\|_1 \leq 1\}" /> (used in Lasso)</li>
          <li>Nuclear norm ball <InlineMath math="\{X : \|X\|_* \leq 1\}" /> (used in matrix completion)</li>
        </ul>
        <p className="mt-2">
          The intersection of convex sets is convex — feasible sets defined by convex constraints are convex.
        </p>
      </ExampleBlock>

      <WarningBlock title="Convexity of a Set vs. Convexity of a Function">
        <p>
          These are related but distinct concepts. A function <InlineMath math="f" /> is convex iff its
          <em> epigraph</em> <InlineMath math="\operatorname{epi}(f) = \{(x,t) : f(x) \leq t\}" /> is a convex set.
          A set being convex does <em>not</em> mean every function defined on it is convex.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np
from scipy.spatial import ConvexHull

# Check if a set of points forms a convex set (i.e., equals its convex hull)
rng = np.random.default_rng(42)
points = rng.uniform(0, 1, size=(20, 2))

hull = ConvexHull(points)
hull_vertices = points[hull.vertices]

print("Hull vertices (boundary of convex hull):")
print(hull_vertices)

# Project a point onto a convex set (here, the L2 ball)
def project_l2_ball(x, radius=1.0):
    norm = np.linalg.norm(x)
    return x if norm <= radius else x * (radius / norm)

x = np.array([2.0, 1.5])
proj = project_l2_ball(x)
print(f"\\nProjection of {x} onto unit ball: {proj}")
print(f"||proj||_2 = {np.linalg.norm(proj):.6f}")

# Verify separating hyperplane between two convex sets
# Set C: L2 ball centered at origin, Set D: L2 ball centered at [3,0]
c_center = np.zeros(2)
d_center = np.array([3.0, 0.0])
# Separating hyperplane normal: direction between centers
a = d_center - c_center
b = (a @ c_center + a @ d_center) / 2
print(f"\\nSeparating hyperplane: {a} · x = {b:.2f}")
`} />
    </div>
  );
}
