import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Computation Graph Forward/Backward Step Visualizer
// ---------------------------------------------------------------------------

// f(x,y) = (x + y) * sin(x)
// Nodes: x, y, a=x+y, b=sin(x), f=a*b
const GRAPH_NODES = [
  { id: 'x',  label: 'x',      x: 40,  y: 80,  xval: 1.5,  grad: null   },
  { id: 'y',  label: 'y',      x: 40,  y: 200, xval: 2.0,  grad: null   },
  { id: 'a',  label: 'x+y',   x: 160, y: 80,  xval: 3.5,  grad: null   },
  { id: 'b',  label: 'sin(x)', x: 160, y: 200, xval: 0.997,grad: null   },
  { id: 'f',  label: 'f',      x: 280, y: 140, xval: 3.49, grad: 1.0    },
];

// Precomputed gradients for x=1.5, y=2.0
// f = (x+y)*sin(x) = 3.5 * 0.9975 = 3.491
// df/df = 1
// df/da = b = 0.9975,  df/db = a = 3.5
// df/dx via a: da/dx = 1 → df/dx += 0.9975
// df/dx via b: db/dx = cos(x) = 0.0707 → df/dx += 3.5 * 0.0707 = 0.247
// df/dx = 0.9975 + 0.247 = 1.245
// df/dy = da/dy * df/da = 1 * 0.9975 = 0.9975
const PRECOMPUTED = {
  x: 1.245, y: 0.997, a: 0.997, b: 3.5, f: 1.0
};

const GRAPH_EDGES = [
  { from: 'x', to: 'a' }, { from: 'y', to: 'a' },
  { from: 'x', to: 'b' }, { from: 'a', to: 'f' },
  { from: 'b', to: 'f' },
];

const FORWARD_ORDER = ['x', 'y', 'a', 'b', 'f'];
const BACKWARD_ORDER = ['f', 'b', 'a', 'y', 'x'];

function AutodiffViz() {
  const [mode, setMode] = useState('forward');
  const [step, setStep] = useState(-1);

  const order = mode === 'forward' ? FORWARD_ORDER : BACKWARD_ORDER;
  const computedSoFar = new Set(step >= 0 ? order.slice(0, step + 1) : []);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Computation Graph: Forward &amp; Backward Pass
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="f(x,y) = (x+y)\sin(x)" /> at <InlineMath math="x=1.5, y=2" />.
        Step through the forward pass (computing values) or backward pass (computing gradients).
      </p>

      <div className="flex gap-3 mb-5">
        {['forward', 'backward'].map(m => (
          <button key={m} onClick={() => { setMode(m); setStep(-1); }}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${mode === m ? (m === 'forward' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
            {m} Pass
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <svg width={340} height={280} className="shrink-0">
          {GRAPH_EDGES.map((e, i) => {
            const from = GRAPH_NODES.find(n => n.id === e.from);
            const to   = GRAPH_NODES.find(n => n.id === e.to);
            const isActive = mode === 'forward'
              ? (computedSoFar.has(e.from) && computedSoFar.has(e.to))
              : (computedSoFar.has(e.to) && computedSoFar.has(e.from));
            return (
              <line key={i} x1={from.x+24} y1={from.y} x2={to.x-24} y2={to.y}
                stroke={isActive ? (mode==='forward'?'#10b981':'#ef4444') : '#e5e7eb'}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={isActive ? '' : 'dark:stroke-gray-600'} />
            );
          })}
          {GRAPH_NODES.map(node => {
            const isComputed = computedSoFar.has(node.id);
            const isCurrent = step >= 0 && order[step] === node.id;
            const fill = isCurrent ? (mode==='forward'?'#059669':'#dc2626') : isComputed ? (mode==='forward'?'#6ee7b7':'#fca5a5') : '#e5e7eb';
            const textFill = isComputed ? '#1f2937' : '#6b7280';
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={24} fill={fill} stroke={isCurrent?'#1f2937':'#fff'} strokeWidth={isCurrent?2.5:1.5} />
                <text x={node.x} y={node.y-4} textAnchor="middle" fontSize={10} fill={textFill} fontWeight="600">{node.label}</text>
                {isComputed && mode === 'forward' && (
                  <text x={node.x} y={node.y+10} textAnchor="middle" fontSize={10} fill="#065f46">
                    {node.xval.toFixed(3)}
                  </text>
                )}
                {isComputed && mode === 'backward' && (
                  <text x={node.x} y={node.y+10} textAnchor="middle" fontSize={10} fill="#7f1d1d">
                    {PRECOMPUTED[node.id].toFixed(3)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {mode === 'forward' ? 'Forward Pass: Computing Values' : 'Backward Pass: Computing Gradients'}
            </p>
            {step >= 0 && (
              <div className={`rounded-lg p-3 text-xs font-mono ${mode==='forward' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300'}`}>
                {mode === 'forward' ? (
                  ['x = 1.5 (input)', 'y = 2.0 (input)', 'a = x + y = 3.5', 'b = sin(x) = 0.997', 'f = a × b = 3.491'][step] || ''
                ) : (
                  ['∂f/∂f = 1.000 (base case)', '∂f/∂b = a = 3.5', '∂f/∂a = b = 0.997', '∂f/∂y = ∂f/∂a × 1 = 0.997', '∂f/∂x = ∂f/∂a × 1 + ∂f/∂b × cos(x) = 1.245'][step] || ''
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(-1)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Reset
            </button>
            <button onClick={() => setStep(s => Math.max(-1, s-1))} disabled={step < 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
              ← Prev
            </button>
            <button onClick={() => setStep(s => Math.min(order.length-1, s+1))} disabled={step >= order.length-1}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 ${mode==='forward' ? 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300'}`}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CODE = `import torch

# ── Dual numbers for forward-mode AD ─────────────────────────────────────────
class Dual:
    """Dual number: a + b*ε, ε²=0. Tracks one directional derivative."""
    def __init__(self, val, deriv=0.0):
        self.val, self.deriv = float(val), float(deriv)
    def __add__(self, other):
        if isinstance(other, Dual):
            return Dual(self.val + other.val, self.deriv + other.deriv)
        return Dual(self.val + other, self.deriv)
    def __radd__(self, other): return self.__add__(other)
    def __mul__(self, other):
        if isinstance(other, Dual):
            return Dual(self.val*other.val, self.val*other.deriv + self.deriv*other.val)
        return Dual(self.val*other, self.deriv*other)
    def __rmul__(self, other): return self.__mul__(other)
    def sin(self):
        import math
        return Dual(math.sin(self.val), self.deriv * math.cos(self.val))
    def __repr__(self): return f"Dual(val={self.val:.4f}, deriv={self.deriv:.4f})"

import math

# Compute ∂f/∂x at x=1.5, y=2.0 via forward mode (seed dx=1, dy=0)
def f(x, y):
    return (x + y) * x.sin()

x_dual = Dual(1.5, 1.0)  # dx=1: computing ∂f/∂x
y_dual = Dual(2.0, 0.0)  # dy=0
result = f(x_dual, y_dual)
print(f"Forward mode ∂f/∂x: {result.deriv:.4f}")  # Expected: 1.245

# For ∂f/∂y: seed x.deriv=0, y.deriv=1
x_dual2 = Dual(1.5, 0.0)
y_dual2 = Dual(2.0, 1.0)  # dy=1
result2 = f(x_dual2, y_dual2)
print(f"Forward mode ∂f/∂y: {result2.deriv:.4f}")  # Expected: 0.997

# ── Reverse-mode AD (PyTorch) — one backward pass for ALL gradients ───────────
x = torch.tensor(1.5, requires_grad=True)
y = torch.tensor(2.0, requires_grad=True)

# Build computation graph
a = x + y
b = torch.sin(x)
f_val = a * b
f_val.backward()  # Single backward pass

print(f"\\nReverse mode ∂f/∂x: {x.grad:.4f}")  # 1.245
print(f"Reverse mode ∂f/∂y: {y.grad:.4f}")  # 0.997

# ── Why reverse mode is efficient for training ────────────────────────────────
# Forward mode: O(n) passes for n parameters
# Reverse mode: O(1) passes (one backward)
n_params = 1_000_000  # typical NN
print(f"\\nForward mode: {n_params} passes needed")
print(f"Reverse mode: 1 pass needed (backprop)")
print(f"Speedup: {n_params}x for computing all gradients simultaneously")

# ── Jacobian-vector products (forward mode) vs vector-Jacobian products (reverse)
def batch_jacobian(f, x):
    """Full Jacobian via vectorized backward (vmap)."""
    from torch.autograd.functional import jacobian
    return jacobian(f, x)

x_vec = torch.tensor([1.5, 2.0], requires_grad=True)
fn = lambda v: torch.stack([v[0]+v[1], torch.sin(v[0])])
J = batch_jacobian(fn, x_vec)
print(f"\\nJacobian shape: {J.shape}")
print(f"Jacobian:\\n{J.detach()}")
`;

export default function Autodiff() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Automatic Differentiation
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Forward-mode and reverse-mode automatic differentiation — the computational engine
          behind backpropagation, dual numbers, and computation graphs.
        </p>
      </div>

      <NoteBlock title="AD vs Symbolic vs Numerical Differentiation">
        <p>
          <strong>Symbolic differentiation</strong> (SymPy, Mathematica) produces exact expressions
          but suffers from expression swell. <strong>Numerical differentiation</strong> (finite differences)
          is easy to implement but has <InlineMath math="O(\varepsilon)" /> truncation error and requires
          <InlineMath math="n" /> evaluations for <InlineMath math="n" /> parameters. <strong>Automatic
          differentiation</strong> combines the exactness of symbolic methods with the efficiency of
          numerical ones, computing exact gradients in <InlineMath math="O(1)" /> backward passes.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 2.2"
        title="Forward-Mode Automatic Differentiation &amp; Dual Numbers"
        definition="Forward-mode AD computes directional derivatives $\nabla f(\mathbf{x}) \cdot \mathbf{v}$ for a seed direction $\mathbf{v}$. It uses dual numbers: $\hat{x} = x + x'\varepsilon$ where $\varepsilon^2 = 0$. Every operation on dual numbers automatically propagates the derivative: $(a + a'\varepsilon)(b + b'\varepsilon) = ab + (a'b + ab')\varepsilon$. After evaluating $f(\hat{x})$, the $\varepsilon$ coefficient is $\nabla f \cdot \mathbf{v}$."
        notation="To compute $\partial f/\partial x_i$, set seed $\mathbf{v} = \mathbf{e}_i$ (i-th unit vector). Forward mode computes one partial derivative per pass — efficient when input dimension $n \ll$ output dimension $m$. Cost: $O(n)$ times the cost of evaluating $f$."
      />

      <DefinitionBlock
        label="Definition 2.3"
        title="Reverse-Mode AD &amp; Adjoints"
        definition="Reverse-mode AD (backpropagation) computes $\bar{\mathbf{x}} = \mathbf{v}^\top J_f$ for a seed $\mathbf{v}$ (typically $\mathbf{v} = \partial \mathcal{L}/\partial f$). It requires a two-phase algorithm: (1) Forward pass: execute $f$, record intermediate values and the computation graph. (2) Backward pass: traverse graph in reverse topological order, accumulating adjoints $\bar{v}_i = \partial \mathcal{L}/\partial v_i$ via $\bar{v}_i \mathrel{+}= \bar{v}_j \cdot (\partial v_j/\partial v_i)$ for each child $j$."
        notation="Adjoint of node $v_i$: $\bar{v}_i = \partial \mathcal{L}/\partial v_i$. Base case: $\bar{v}_{\text{output}} = 1$. Cost: $O(1)$ times the forward pass cost — computes ALL partial derivatives in one backward pass. Memory: $O(n)$ to store the forward pass tape."
      />

      <AutodiffViz />

      <TheoremBlock
        label="Theorem 2.3"
        title="Efficiency of Forward vs Reverse Mode AD"
        statement="For a function $f: \mathbb{R}^n \to \mathbb{R}^m$ with evaluation cost $T_f$: Forward mode computes $J_f \mathbf{v}$ (Jacobian-vector product) in cost $O(T_f)$; computing the full Jacobian $J_f \in \mathbb{R}^{m\times n}$ requires $n$ forward passes — cost $O(n \cdot T_f)$. Reverse mode computes $\mathbf{u}^\top J_f$ (vector-Jacobian product) in cost $O(T_f)$; computing the full Jacobian requires $m$ backward passes — cost $O(m \cdot T_f)$. For deep learning with $m=1$ (scalar loss) and $n \gg 1$ parameters, reverse mode is $n$ times cheaper."
        proof="Each elementary operation $(+, \times, \sin, \ldots)$ contributes $O(1)$ work to both forward and backward passes (computing the local Jacobian and accumulating). The total backward cost is $c \cdot T_f$ for a small constant $c$ (typically $c \in [2,5]$ in practice). This follows from the chain rule structure: each edge in the computation graph is traversed once in each direction. $\square$"
        corollaries={[
          "JAX uses both modes: reverse mode for training (jax.grad), forward mode for Jacobian-vector products (jax.jvp) in second-order optimization.",
          "Gradient checkpointing trades memory for compute: instead of storing all intermediate values, recompute them during the backward pass. Reduces memory from $O(L)$ to $O(\\sqrt{L})$ for depth-$L$ networks.",
          "Higher-order derivatives: Hessian-vector products can be computed efficiently as $\\nabla(\\nabla f \\cdot \\mathbf{v})$ using a mix of forward and reverse mode — cost $O(T_f)$, not $O(n^2 T_f)$.",
        ]}
      />

      <ExampleBlock
        title="Forward-Mode AD with Dual Numbers"
        difficulty="advanced"
        problem="Using dual numbers, compute $f'(x)$ for $f(x) = x \sin(x)$ at $x = \pi/4$ by propagating $\hat{x} = \pi/4 + 1\cdot\varepsilon$ through the computation."
        solution={[
          { step: 'Initialize dual input', formula: '\\hat{x} = \\tfrac{\\pi}{4} + 1\\cdot\\varepsilon', explanation: 'The ε-coefficient of 1 seeds the derivative dx/dx = 1.' },
          { step: 'Compute sin(x) in dual', formula: '\\sin(\\hat{x}) = \\sin(\\tfrac{\\pi}{4}) + \\cos(\\tfrac{\\pi}{4})\\cdot\\varepsilon = \\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}\\varepsilon', explanation: 'sin rule: sin(a + bε) = sin(a) + b·cos(a)·ε.' },
          { step: 'Multiply x * sin(x)', formula: '\\hat{x}\\cdot\\sin(\\hat{x}) = \\frac{\\pi\\sqrt{2}}{8} + \\left(\\frac{\\sqrt{2}}{2}\\cdot 1 + \\frac{\\pi}{4}\\cdot\\frac{\\sqrt{2}}{2}\\right)\\varepsilon', explanation: 'Product rule for dual numbers: (a+bε)(c+dε) = ac + (ad+bc)ε.' },
          { step: 'Read off derivative', formula: "f'(\\tfrac{\\pi}{4}) = \\frac{\\sqrt{2}}{2}\\left(1 + \\frac{\\pi}{4}\\right) \\approx 1.267", explanation: 'The ε-coefficient of the result is the derivative. Verify: d/dx[x sin x] = sin x + x cos x evaluated at π/4.' },
        ]}
      />

      <WarningBlock title="Autodiff Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>In-place operations:</strong> PyTorch's autograd requires the original tensor values for backward. In-place ops (e.g., x.add_(1)) can overwrite these, causing "RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation".</li>
          <li><strong>Detaching incorrectly:</strong> Calling .detach() or wrapping in torch.no_grad() stops gradient flow. Common mistake: computing a loss quantity using detached variables, then backpropping through it (gradient is zero).</li>
          <li><strong>Memory: retaining the graph:</strong> Calling backward() multiple times requires retain_graph=True but doubles memory cost. For second-order optimization (Hessians), use create_graph=True in the first backward call.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="Forward-Mode AD (Dual Numbers) & Reverse-Mode AD (PyTorch)" runnable />
    </div>
  );
}
