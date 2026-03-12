import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const METHODS = [
  {
    id: 'parts',
    label: 'Integration by Parts',
    formula: '\\int u\\,dv = uv - \\int v\\,du',
    example: '\\int x e^x\\,dx',
    steps: [
      { label: 'Choose u and dv', math: 'u = x,\\quad dv = e^x\\,dx' },
      { label: 'Differentiate and integrate', math: 'du = dx,\\quad v = e^x' },
      { label: 'Apply formula', math: '\\int x e^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C' },
      { label: 'Final answer', math: '\\boxed{(x-1)e^x + C}' },
    ],
  },
  {
    id: 'sub',
    label: 'u-Substitution',
    formula: '\\int f(g(x))g\'(x)\\,dx = \\int f(u)\\,du,\\quad u=g(x)',
    example: '\\int 2x\\cos(x^2)\\,dx',
    steps: [
      { label: 'Choose substitution', math: 'u = x^2,\\quad du = 2x\\,dx' },
      { label: 'Rewrite integral', math: '\\int \\cos(u)\\,du' },
      { label: 'Integrate', math: '\\sin(u) + C' },
      { label: 'Back-substitute', math: '\\boxed{\\sin(x^2) + C}' },
    ],
  },
  {
    id: 'partial',
    label: 'Partial Fractions',
    formula: '\\frac{P(x)}{Q(x)} = \\sum_i \\frac{A_i}{(x-r_i)^{k_i}}',
    example: '\\int \\frac{1}{x^2-1}\\,dx',
    steps: [
      { label: 'Factor denominator', math: 'x^2 - 1 = (x-1)(x+1)' },
      { label: 'Partial fraction decomposition', math: '\\frac{1}{(x-1)(x+1)} = \\frac{A}{x-1} + \\frac{B}{x+1}' },
      { label: 'Solve: A=1/2, B=-1/2', math: '\\frac{1}{2}\\cdot\\frac{1}{x-1} - \\frac{1}{2}\\cdot\\frac{1}{x+1}' },
      { label: 'Integrate each term', math: '\\boxed{\\tfrac{1}{2}\\ln|x-1| - \\tfrac{1}{2}\\ln|x+1| + C = \\tfrac{1}{2}\\ln\\left|\\tfrac{x-1}{x+1}\\right| + C}' },
    ],
  },
];

function IntegrationMethodViz() {
  const [selectedMethod, setSelectedMethod] = useState('parts');
  const [step, setStep] = useState(0);
  const method = METHODS.find(m => m.id === selectedMethod);

  const handleMethod = (id) => { setSelectedMethod(id); setStep(0); };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Integration Technique Explorer
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {METHODS.map(m => (
          <button key={m.id} onClick={() => handleMethod(m.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${selectedMethod === m.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="mb-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3">
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Formula</p>
        <BlockMath math={method.formula} />
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Example: <InlineMath math={method.example} />
      </p>
      <div className="space-y-2">
        {method.steps.map((s, i) => (
          <div key={i} className={`rounded-lg border p-3 transition-all ${i <= step ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30 opacity-40'}`}>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Step {i+1}: {s.label}</p>
            <BlockMath math={s.math} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:bg-gray-700">
          Previous
        </button>
        <button onClick={() => setStep(Math.min(method.steps.length - 1, step + 1))}
          disabled={step === method.steps.length - 1}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
          Next Step
        </button>
        <span className="ml-auto text-xs text-gray-500 self-center">Step {step+1}/{method.steps.length}</span>
      </div>
    </div>
  );
}

export default function IntegrationTechniquesSection() {
  return (
    <div className="space-y-8">
      <IntegrationMethodViz />

      <DefinitionBlock
        label="Definition 3.1.1"
        title="Integration by Parts"
        definition={
          "For differentiable functions $u$ and $v$, integration by parts states " +
          "$\\int u\\,dv = uv - \\int v\\,du$. " +
          "It follows from the product rule: $(uv)' = u'v + uv'$ integrated over $[a,b]$ gives " +
          "$\\int_a^b u\\,v'\\,dx = [uv]_a^b - \\int_a^b v\\,u'\\,dx$. " +
          "The LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) " +
          "suggests choosing $u$ from the earlier categories."
        }
      />

      <DefinitionBlock
        label="Definition 3.1.2"
        title="Partial Fraction Decomposition"
        definition={
          "Any proper rational function $P(x)/Q(x)$ (deg $P <$ deg $Q$) with $Q$ factored over $\\mathbb{R}$ can be written as " +
          "a sum of terms: $\\frac{A}{(x-r)^k}$ for each real root $r$ of multiplicity $k$, and " +
          "$\\frac{Bx+C}{(x^2+px+q)^m}$ for each irreducible quadratic factor of multiplicity $m$. " +
          "If deg $P \\geq$ deg $Q$, first perform polynomial long division."
        }
      />

      <TheoremBlock
        label="Theorem 3.1.1"
        title="Fundamental Theorem of Calculus (FTC)"
        statement={
          "Part 1: If $f$ is continuous on $[a,b]$ and $F(x) = \\int_a^x f(t)\\,dt$, then $F'(x) = f(x)$. " +
          "Part 2: If $F$ is any antiderivative of continuous $f$ on $[a,b]$, then $\\int_a^b f(x)\\,dx = F(b) - F(a)$."
        }
        proof={
          "Part 1: $\\frac{F(x+h)-F(x)}{h} = \\frac{1}{h}\\int_x^{x+h} f(t)\\,dt$. " +
          "By the mean value theorem for integrals, this equals $f(c_h)$ for some $c_h \\in [x, x+h]$. " +
          "As $h \\to 0$, $c_h \\to x$ and by continuity of $f$, $f(c_h) \\to f(x)$. " +
          "Part 2 follows since $F$ and any antiderivative $G$ satisfy $G = F + C$."
        }
      />

      <ExampleBlock title="Tabular Integration by Parts for ∫x²eˣdx">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Repeated integration by parts (tabular method): differentiate <InlineMath math="x^2" /> repeatedly,
          integrate <InlineMath math="e^x" /> repeatedly, alternate signs.
        </p>
        <BlockMath math="\int x^2 e^x\,dx = x^2 e^x - 2xe^x + 2e^x + C = e^x(x^2 - 2x + 2) + C" />
      </ExampleBlock>

      <WarningBlock title="Constant of Integration and Definite vs Indefinite">
        <p>
          Always include <InlineMath math="+C" /> in indefinite integrals — omitting it is mathematically incorrect.
          For definite integrals, the constant cancels: <InlineMath math="\int_a^b f = [F]_a^b = F(b)-F(a)" />.
          Also, when doing u-substitution in definite integrals, either back-substitute before evaluating,
          or change the limits of integration to match the substitution variable.
        </p>
      </WarningBlock>

      <PythonCode
        title="Symbolic Integration with SymPy"
        code={`import sympy as sp
import numpy as np
from scipy import integrate

x = sp.Symbol('x')

# ── Integration by parts (symbolic) ──────────────────────────────────────
integrals = [
    x * sp.exp(x),
    x**2 * sp.exp(x),
    sp.log(x),
    x * sp.sin(x),
    sp.exp(x) * sp.sin(x),
]

print("Symbolic antiderivatives:")
for expr in integrals:
    result = sp.integrate(expr, x)
    print(f"  ∫ {expr} dx = {result}")

# ── Partial fraction decomposition ───────────────────────────────────────
f = 1 / (x**2 - 1)
pf = sp.apart(f, x)
print(f"\\nPartial fractions: 1/(x²-1) = {pf}")
print(f"Integral: {sp.integrate(f, x)}")

# ── Numerical integration (scipy) ────────────────────────────────────────
# ∫₀¹ exp(-x²) dx (Gaussian integral, no closed form)
result, error = integrate.quad(lambda x: np.exp(-x**2), 0, 1)
print(f"\\n∫₀¹ exp(-x²) dx ≈ {result:.8f} ± {error:.2e}")
print(f"  Compare: √π/2 ≈ {np.sqrt(np.pi)/2:.8f}")

# ── u-substitution verification ──────────────────────────────────────────
# ∫ 2x cos(x²) dx with u=x²
u = sp.Symbol('u')
transformed = sp.integrate(sp.cos(u), u)
back_sub = transformed.subs(u, x**2)
print(f"\\n∫ 2x cos(x²) dx (via u=x²): {back_sub}")
# Verify by differentiation
print(f"  Verification (d/dx): {sp.diff(back_sub, x)}")`}
      />
    </div>
  );
}
