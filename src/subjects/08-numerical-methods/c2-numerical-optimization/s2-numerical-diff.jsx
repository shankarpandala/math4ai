import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// f(x) = sin(x) at x=1, f'(x)=cos(1)
// Error for finite differences: |cos(1) - (f(x+h)-f(x))/h|
// Forward diff: O(h), Central diff: O(h^2)

const TRUE_DERIV = Math.cos(1);
function fSin(x) { return Math.sin(x); }

function forwardDiff(h) { return (fSin(1 + h) - fSin(1)) / h; }
function centralDiff(h) { return (fSin(1 + h) - fSin(1 - h)) / (2 * h); }

function InteractiveFiniteDiff() {
  const [showCentral, setShowCentral] = useState(true);

  const W = 420, H = 240, PAD = 50;
  const logHMin = -16, logHMax = 0;
  const logEMin = -16, logEMax = 1;

  function toSvg(logH, logE) {
    const clamped = Math.max(logEMin, Math.min(logEMax, logE));
    return {
      sx: PAD + ((logH - logHMin) / (logHMax - logHMin)) * (W - 2 * PAD),
      sy: H - PAD - ((clamped - logEMin) / (logEMax - logEMin)) * (H - 2 * PAD),
    };
  }

  const nPts = 100;
  const fwdPts = Array.from({ length: nPts }, (_, i) => {
    const logH = logHMin + (i / (nPts - 1)) * (logHMax - logHMin);
    const h = Math.pow(10, logH);
    const err = Math.abs(forwardDiff(h) - TRUE_DERIV);
    if (err === 0) return null;
    const { sx, sy } = toSvg(logH, Math.log10(err));
    return `${sx},${sy}`;
  }).filter(Boolean).join(' ');

  const ctrPts = showCentral ? Array.from({ length: nPts }, (_, i) => {
    const logH = logHMin + (i / (nPts - 1)) * (logHMax - logHMin);
    const h = Math.pow(10, logH);
    const err = Math.abs(centralDiff(h) - TRUE_DERIV);
    if (err === 0) return null;
    const { sx, sy } = toSvg(logH, Math.log10(err));
    return `${sx},${sy}`;
  }).filter(Boolean).join(' ') : null;

  // Tick marks
  const hTicks = [-15, -12, -9, -6, -3, 0];
  const eTicks = [-15, -10, -5, 0];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Finite Difference Error vs Step Size</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Approximating <InlineMath math="f'(1)" /> for <InlineMath math="f(x)=\sin(x)" />.
        Forward diff has <InlineMath math="O(h)" /> truncation error; central diff has <InlineMath math="O(h^2)" />.
        Both suffer from cancellation for very small <InlineMath math="h" />.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {hTicks.map(tick => {
            const { sx } = toSvg(tick, logEMin);
            return (
              <React.Fragment key={tick}>
                <line x1={sx} y1={H - PAD} x2={sx} y2={H - PAD + 4} stroke="#9ca3af" strokeWidth="1" />
                <text x={sx} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill="#6b7280">h=10^{tick}</text>
              </React.Fragment>
            );
          })}
          {eTicks.map(tick => {
            const { sy } = toSvg(logHMin, tick);
            return (
              <React.Fragment key={tick}>
                <line x1={PAD - 4} y1={sy} x2={PAD} y2={sy} stroke="#9ca3af" strokeWidth="1" />
                <text x={PAD - 6} y={sy + 4} textAnchor="end" fontSize="9" fill="#6b7280">10^{tick}</text>
              </React.Fragment>
            );
          })}
          {/* Forward diff error */}
          {fwdPts && <polyline points={fwdPts} fill="none" stroke="#ef4444" strokeWidth="2.5" />}
          {/* Central diff error */}
          {ctrPts && <polyline points={ctrPts} fill="none" stroke="#3b82f6" strokeWidth="2.5" />}
          {/* O(h) slope guide */}
          {(() => {
            const p1 = toSvg(-8, -8), p2 = toSvg(-4, -4);
            return <line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />;
          })()}
          {(() => {
            const p1 = toSvg(-8, -16), p2 = toSvg(-4, -8);
            return showCentral ? <line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" /> : null;
          })()}
          {/* Optimal h annotation */}
          {(() => {
            const optH = -8, { sx } = toSvg(optH, logEMin);
            return <line x1={sx} y1={PAD} x2={sx} y2={H - PAD} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />;
          })()}
          <text x={PAD + 4} y={PAD + 14} fontSize="10" fill="#374151">← truncation error | cancellation →</text>
          {/* Legend */}
          <rect x={W - PAD - 110} y={PAD} width="106" height={showCentral ? 52 : 28} fill="white" fillOpacity="0.9" rx="4" />
          <line x1={W - PAD - 102} y1={PAD + 12} x2={W - PAD - 80} y2={PAD + 12} stroke="#ef4444" strokeWidth="2.5" />
          <text x={W - PAD - 76} y={PAD + 16} fontSize="10" fill="#374151">Forward O(h)</text>
          {showCentral && <>
            <line x1={W - PAD - 102} y1={PAD + 30} x2={W - PAD - 80} y2={PAD + 30} stroke="#3b82f6" strokeWidth="2.5" />
            <text x={W - PAD - 76} y={PAD + 34} fontSize="10" fill="#374151">Central O(h²)</text>
          </>}
        </svg>
        <div className="flex flex-col gap-4 min-w-[160px]">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showCentral} onChange={e => setShowCentral(e.target.checked)} />
            Show central differences
          </label>
          <div className="rounded bg-blue-50 dark:bg-blue-900/30 px-3 py-2 text-xs space-y-1">
            <p><strong>Forward diff:</strong></p>
            <p>Optimal h ≈ √ε_mach ≈ 10⁻⁸</p>
            <p>Min error ≈ 10⁻⁸</p>
            <p className="mt-1"><strong>Central diff:</strong></p>
            <p>Optimal h ≈ ε_mach^(1/3) ≈ 10⁻⁵</p>
            <p>Min error ≈ 10⁻¹¹</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NumericalDifferentiation() {
  return (
    <div className="space-y-8">
      <InteractiveFiniteDiff />

      <DefinitionBlock title="Finite Difference Approximations">
        <p>
          The <strong>forward difference</strong> approximates <InlineMath math="f'(x)" /> as:
        </p>
        <BlockMath math="\frac{f(x+h) - f(x)}{h} = f'(x) + \frac{h}{2}f''(x) + O(h^2)." />
        <p className="mt-2">
          The <strong>central difference</strong> achieves higher accuracy:
        </p>
        <BlockMath math="\frac{f(x+h) - f(x-h)}{2h} = f'(x) + \frac{h^2}{6}f'''(x) + O(h^4)." />
        <p className="mt-2">
          The optimal step size balances truncation error <InlineMath math="O(h^k)" /> and
          floating-point cancellation error <InlineMath math="O(\epsilon_\text{mach}/h)" />:
          <InlineMath math="h^* \approx \epsilon_\text{mach}^{1/(k+1)}" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Dual Numbers and Forward-Mode AD">
        <p>
          <strong>Dual numbers</strong> extend <InlineMath math="\mathbb{R}" /> with a nilpotent
          infinitesimal <InlineMath math="\epsilon" /> satisfying <InlineMath math="\epsilon^2 = 0" />:
        </p>
        <BlockMath math="a + b\epsilon \in \mathbb{R}[\epsilon]/(\epsilon^2)." />
        <p className="mt-2">
          Evaluating <InlineMath math="f" /> on a dual number <InlineMath math="x_0 + 1 \cdot \epsilon" />
          propagates the derivative exactly:
        </p>
        <BlockMath math="f(x_0 + \epsilon) = f(x_0) + f'(x_0)\epsilon." />
        <p className="mt-2">
          This is the basis of <strong>forward-mode automatic differentiation</strong> — exact
          to machine precision, no step size selection needed.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Taylor Remainder Bounds for Finite Differences"
        proof="By Taylor's theorem with the Lagrange remainder: f(x+h) = f(x) + hf'(x) + (h²/2)f''(ξ) for some ξ ∈ [x, x+h]. Rearranging: |f'(x) - (f(x+h)-f(x))/h| = (h/2)|f''(ξ)| ≤ (h/2)||f''||∞. For central differences, the odd terms cancel: the leading error term is (h²/6)|f'''(ξ)|."
      >
        <p>
          For forward differences with step <InlineMath math="h" />:
        </p>
        <BlockMath math="\left|f'(x) - \frac{f(x+h)-f(x)}{h}\right| \leq \frac{h}{2}\|f''\|_\infty." />
        <p className="mt-2">Including floating-point arithmetic with machine epsilon <InlineMath math="\epsilon_M" />:</p>
        <BlockMath math="\text{Total error} \leq \frac{h}{2}\|f''\|_\infty + \frac{2\epsilon_M |f(x)|}{h}." />
        <p className="mt-2">Minimizing over <InlineMath math="h" /> gives optimal step <InlineMath math="h^* = 2\sqrt{\epsilon_M |f(x)| / \|f''\|_\infty}" />.</p>
      </TheoremBlock>

      <TheoremBlock
        title="Complex Step Differentiation"
        proof="By extending f to complex numbers and using Taylor: f(x+ih) = f(x) + ihf'(x) - (h²/2)f''(x) + O(h³). Taking imaginary part: Im(f(x+ih)) = hf'(x) + O(h³). No cancellation occurs since subtraction is replaced by taking the imaginary part, achieving near-machine-precision accuracy even for large h."
      >
        <p>
          The <strong>complex step method</strong> evaluates <InlineMath math="f" /> at a complex
          argument to compute exact derivatives without cancellation:
        </p>
        <BlockMath math="f'(x) \approx \frac{\operatorname{Im}(f(x + ih))}{h}." />
        <p className="mt-2">
          Error is <InlineMath math="O(h^2)" /> without cancellation, allowing very small
          <InlineMath math="h \approx 10^{-50}" /> in some implementations. Works for any
          analytic function implemented in complex arithmetic.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Gradient Checking in Deep Learning">
        <p>
          Finite differences are used to verify backpropagation implementations:
        </p>
        <BlockMath math="\frac{f(\theta + h e_i) - f(\theta - h e_i)}{2h} \approx \frac{\partial f}{\partial \theta_i}," />
        <p className="mt-2">
          compared to the analytical gradient from backprop. A relative error below
          <InlineMath math="10^{-5}" /> typically confirms correctness. In practice, check on small
          randomly-initialized networks with <InlineMath math="h = 10^{-5}" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Finite Differences Scale Poorly with Dimension">
        <p>
          Computing the full gradient via finite differences requires <InlineMath math="O(n)" />
          function evaluations for an <InlineMath math="n" />-dimensional parameter.
          For neural networks with <InlineMath math="n \sim 10^8" /> parameters,
          this is completely infeasible. Reverse-mode automatic differentiation (backpropagation)
          computes the full gradient in <InlineMath math="O(1)" /> backward passes.
          Finite differences should only be used for gradient checking (verify small subsets
          of parameters) or when AD is unavailable.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

# 1. Finite differences
def forward_diff(f, x, h=1e-5):
    """Forward difference gradient."""
    grad = np.zeros_like(x)
    for i in range(len(x)):
        e = np.zeros_like(x); e[i] = 1.0
        grad[i] = (f(x + h*e) - f(x)) / h
    return grad

def central_diff(f, x, h=1e-5):
    """Central difference gradient (more accurate)."""
    grad = np.zeros_like(x)
    for i in range(len(x)):
        e = np.zeros_like(x); e[i] = 1.0
        grad[i] = (f(x + h*e) - f(x - h*e)) / (2*h)
    return grad

# 2. Forward-mode AD using dual numbers (manual)
class Dual:
    def __init__(self, real, dual=0.0):
        self.r, self.d = real, dual
    def __add__(self, other):
        if isinstance(other, (int, float)): return Dual(self.r + other, self.d)
        return Dual(self.r + other.r, self.d + other.d)
    def __mul__(self, other):
        if isinstance(other, (int, float)): return Dual(self.r * other, self.d * other)
        return Dual(self.r * other.r, self.r * other.d + self.d * other.r)
    def sin(self): return Dual(np.sin(self.r), self.d * np.cos(self.r))
    def exp(self): return Dual(np.exp(self.r), self.d * np.exp(self.r))
    def __repr__(self): return f"Dual({self.r:.6f} + {self.d:.6f}ε)"

def f_dual(x):
    """f(x) = sin(x₀) * exp(x₁) - x₀²"""
    return x[0].sin() * x[1].exp() - x[0] * x[0]

# Test at x = [1.0, 0.5]
x0 = np.array([1.0, 0.5])

# Forward mode: ∂f/∂x₀ (set dual part of x₀ to 1)
x_dual_0 = [Dual(1.0, 1.0), Dual(0.5, 0.0)]
df_dx0 = f_dual(x_dual_0).d

# Forward mode: ∂f/∂x₁
x_dual_1 = [Dual(1.0, 0.0), Dual(0.5, 1.0)]
df_dx1 = f_dual(x_dual_1).d

print("Forward-mode AD:")
print(f"  ∂f/∂x₀ = {df_dx0:.8f}")
print(f"  ∂f/∂x₁ = {df_dx1:.8f}")

# Compare with finite differences
def f_np(x): return np.sin(x[0]) * np.exp(x[1]) - x[0]**2

grad_fwd = forward_diff(f_np, x0, h=1e-7)
grad_ctr = central_diff(f_np, x0, h=1e-5)
grad_true = np.array([np.cos(1.0)*np.exp(0.5) - 2.0, np.sin(1.0)*np.exp(0.5)])

print("\\nGradient comparison:")
print(f"  AD:       {[df_dx0, df_dx1]}")
print(f"  Central:  {grad_ctr.tolist()}")
print(f"  True:     {grad_true.tolist()}")
`} />
    </div>
  );
}
