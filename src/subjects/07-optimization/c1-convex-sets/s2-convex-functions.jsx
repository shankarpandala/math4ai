import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// f(x) = x^2 for demo
function fquad(x) { return x * x; }

function InteractiveChordAboveGraph() {
  const [xa, setXa] = useState(-1.5);
  const [xb, setXb] = useState(1.5);
  const [theta, setTheta] = useState(0.5);

  const W = 400, H = 260, pad = 30;
  const xmin = -2.5, xmax = 2.5;
  const ymin = -0.3, ymax = 7;

  function toSvg(x, y) {
    return {
      sx: pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad),
      sy: H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad),
    };
  }

  // Draw f(x) = x^2 curve
  const nPts = 120;
  const curvePts = Array.from({ length: nPts }, (_, i) => {
    const x = xmin + (i / (nPts - 1)) * (xmax - xmin);
    const { sx, sy } = toSvg(x, fquad(x));
    return `${sx},${sy}`;
  }).join(' ');

  const ya = fquad(xa), yb = fquad(xb);
  const xc = theta * xa + (1 - theta) * xb;
  const fxc = fquad(xc);
  const chord_y = theta * ya + (1 - theta) * yb;

  const A = toSvg(xa, ya), B = toSvg(xb, yb), C = toSvg(xc, fxc), Chord = toSvg(xc, chord_y);
  const jensensHolds = fxc <= chord_y + 1e-9;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Chord Above Graph (Jensen's Inequality)</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        For <InlineMath math="f(x)=x^2" />, verify that <InlineMath math="f(\theta a + (1-\theta)b) \leq \theta f(a) + (1-\theta)f(b)" />.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Axes */}
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#9ca3af" strokeWidth="1" />
          <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#9ca3af" strokeWidth="1" />
          {/* Curve */}
          <polyline points={curvePts} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {/* Chord line */}
          <line x1={A.sx} y1={A.sy} x2={B.sx} y2={B.sy} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
          {/* Points */}
          <circle cx={A.sx} cy={A.sy} r="5" fill="#3b82f6" />
          <circle cx={B.sx} cy={B.sy} r="5" fill="#3b82f6" />
          {/* Convex combination on curve */}
          <circle cx={C.sx} cy={C.sy} r="6" fill="#10b981" />
          {/* Convex combination on chord */}
          <circle cx={Chord.sx} cy={Chord.sy} r="6" fill="#f59e0b" />
          {/* Vertical connecting line */}
          <line x1={C.sx} y1={C.sy} x2={Chord.sx} y2={Chord.sy} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x={C.sx + 8} y={C.sy - 4} fontSize="11" fill="#065f46">f(θa+(1-θ)b)</text>
          <text x={Chord.sx + 8} y={Chord.sy + 12} fontSize="11" fill="#92400e">θf(a)+(1-θ)f(b)</text>
          <text x={A.sx - 14} y={A.sy - 6} fontSize="12" fill="#1d4ed8">a</text>
          <text x={B.sx + 4} y={B.sy - 6} fontSize="12" fill="#1d4ed8">b</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><InlineMath math={`a = ${xa.toFixed(2)}`} /></label>
            <input type="range" min="-2.3" max="0" step="0.05" value={xa} onChange={e => setXa(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><InlineMath math={`b = ${xb.toFixed(2)}`} /></label>
            <input type="range" min="0" max="2.3" step="0.05" value={xb} onChange={e => setXb(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><InlineMath math={`\\theta = ${theta.toFixed(2)}`} /></label>
            <input type="range" min="0.01" max="0.99" step="0.01" value={theta} onChange={e => setTheta(+e.target.value)} className="w-full" />
          </div>
          <div className={`rounded px-3 py-2 text-sm font-semibold ${jensensHolds ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800'}`}>
            {jensensHolds ? 'Jensen holds ✓' : 'Jensen violated ✗'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Green dot: function value at midpoint<br />
            Yellow dot: chord value (convex combination of function values)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConvexFunctions() {
  return (
    <div className="space-y-8">
      <InteractiveChordAboveGraph />

      <DefinitionBlock title="Convex Function">
        <p>
          A function <InlineMath math="f : \mathbb{R}^n \to \mathbb{R}" /> is <strong>convex</strong> if
          its domain is a convex set and for all <InlineMath math="x, y \in \operatorname{dom} f" /> and
          <InlineMath math="\theta \in [0,1]" />:
        </p>
        <BlockMath math="f(\theta x + (1-\theta)y) \leq \theta f(x) + (1-\theta)f(y)." />
        <p className="mt-2">
          The function is <strong>strictly convex</strong> if the inequality holds strictly for <InlineMath math="x \neq y" />,
          <InlineMath math="\theta \in (0,1)" />. It is <strong>strongly convex</strong> with parameter <InlineMath math="\mu > 0" /> if
        </p>
        <BlockMath math="f(y) \geq f(x) + \nabla f(x)^\top(y-x) + \frac{\mu}{2}\|y-x\|^2." />
      </DefinitionBlock>

      <DefinitionBlock title="Epigraph and Sublevel Sets">
        <p>The <strong>epigraph</strong> of <InlineMath math="f" /> is the set of points on and above its graph:</p>
        <BlockMath math="\operatorname{epi}(f) = \{(x, t) \in \mathbb{R}^{n+1} : f(x) \leq t\}." />
        <p className="mt-2"><InlineMath math="f" /> is convex if and only if <InlineMath math="\operatorname{epi}(f)" /> is a convex set.</p>
        <p className="mt-2">The <InlineMath math="\alpha" />-<strong>sublevel set</strong> is <InlineMath math="C_\alpha = \{x : f(x) \leq \alpha\}" />. Convexity of <InlineMath math="f" /> implies all sublevel sets are convex.</p>
      </DefinitionBlock>

      <DefinitionBlock title="Subgradient">
        <p>
          A vector <InlineMath math="g \in \mathbb{R}^n" /> is a <strong>subgradient</strong> of <InlineMath math="f" /> at
          <InlineMath math="x" /> if
        </p>
        <BlockMath math="f(y) \geq f(x) + g^\top (y - x) \quad \forall\, y \in \operatorname{dom} f." />
        <p className="mt-2">
          The set of all subgradients at <InlineMath math="x" /> is the <strong>subdifferential</strong>
          <InlineMath math="\partial f(x)" />. For differentiable convex <InlineMath math="f" />,
          <InlineMath math="\partial f(x) = \{\nabla f(x)\}" />.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="First-Order Condition for Convexity"
        proof="If f is convex, differentiability means the chord between any two points lies above the curve, which gives the gradient inequality directly. Conversely, if the first-order condition holds, for any x,y and θ∈[0,1] let z = θx+(1-θ)y. Then f(x) ≥ f(z)+∇f(z)⊤(x-z) and f(y) ≥ f(z)+∇f(z)⊤(y-z). Multiplying by θ and (1-θ) and summing gives the convexity inequality."
      >
        <p>
          A differentiable function <InlineMath math="f" /> is convex if and only if
          <InlineMath math="\operatorname{dom} f" /> is convex and
        </p>
        <BlockMath math="f(y) \geq f(x) + \nabla f(x)^\top (y - x) \quad \forall\, x, y \in \operatorname{dom} f." />
        <p className="mt-2">
          Equivalently, <InlineMath math="f" /> is convex iff its Hessian is positive semidefinite everywhere:
          <InlineMath math="\nabla^2 f(x) \succeq 0" />.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Jensen's Inequality"
        proof="By induction on the definition of convexity. For a random variable X and convex f, approximate X by finitely supported distributions and apply the finite Jensen inequality, then take limits."
      >
        <p>
          For a convex function <InlineMath math="f" /> and a random variable <InlineMath math="X" />:
        </p>
        <BlockMath math="f(\mathbb{E}[X]) \leq \mathbb{E}[f(X)]." />
        <p className="mt-2">
          This underlies the EM algorithm's lower bound construction and the ELBO in variational inference.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Quasiconvex Functions">
        <p>
          A function is <strong>quasiconvex</strong> (unimodal) if all sublevel sets are convex, i.e.,
        </p>
        <BlockMath math="f(\theta x + (1-\theta)y) \leq \max(f(x), f(y))." />
        <p className="mt-2">Every convex function is quasiconvex, but not vice versa. Example: <InlineMath math="f(x) = \sqrt{|x|}" /> is quasiconvex but not convex. Quasiconvex optimization can be solved via bisection on the sublevel sets.</p>
      </ExampleBlock>

      <WarningBlock title="Pointwise Maximum vs. Sum">
        <p>
          The pointwise maximum of convex functions is convex. However, the pointwise
          <em> minimum</em> of convex functions is generally <em>not</em> convex. For example,
          <InlineMath math="\min(x^2, (x-3)^2)" /> has a non-convex domain when extended to all <InlineMath math="\mathbb{R}" />.
          Similarly, composition rules require care: <InlineMath math="f(g(x))" /> is convex only if
          <InlineMath math="f" /> is convex nondecreasing and <InlineMath math="g" /> is convex,
          or <InlineMath math="f" /> is convex nonincreasing and <InlineMath math="g" /> is concave.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

# Check convexity via second-order condition (Hessian PSD)
def is_convex_quadratic(Q):
    """f(x) = x^T Q x is convex iff Q + Q^T is PSD."""
    M = (Q + Q.T) / 2
    eigvals = np.linalg.eigvalsh(M)
    return bool(np.all(eigvals >= -1e-10)), eigvals

Q = np.array([[3., 1.], [1., 2.]])
convex, eigvals = is_convex_quadratic(Q)
print(f"Quadratic f(x)=x^TQx convex: {convex}, eigenvalues: {eigvals}")

# Subgradient of f(x) = |x| at x=0
def subgradient_abs(x, eps=1e-8):
    if abs(x) > eps:
        return np.sign(x)
    else:
        # Any value in [-1, 1] is a valid subgradient
        return 0.0  # Typical choice

print(f"\\nSubgradient of |x| at x=0: {subgradient_abs(0.0)}")
print(f"Subgradient of |x| at x=2: {subgradient_abs(2.0)}")

# Verify Jensen's inequality numerically
rng = np.random.default_rng(42)
X = rng.standard_normal(10000)
f = np.exp  # convex function

lhs = f(np.mean(X))  # f(E[X])
rhs = np.mean(f(X))  # E[f(X)]
print(f"\\nJensen's inequality for exp:")
print(f"f(E[X]) = {lhs:.4f}, E[f(X)] = {rhs:.4f}, holds: {lhs <= rhs}")
`} />
    </div>
  );
}
