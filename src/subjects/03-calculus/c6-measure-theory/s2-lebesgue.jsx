import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function LebesgueApproxViz() {
  const [n, setN] = useState(4);

  // Approximate f(x) = sqrt(x) on [0,1] by simple functions (step functions)
  const f = (x) => Math.sqrt(x);
  const W = 340, H = 200;
  const xMin = 0, xMax = 1, yMin = 0, yMax = 1.1;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  // Lower simple function approximation: phi_n = sum of k/n * 1_{f^{-1}([k/n,(k+1)/n])}
  // For f=sqrt(x): f^{-1}([k/n,(k+1)/n]) = [(k/n)^2, ((k+1)/n)^2]
  const steps = Array.from({ length: n }, (_, k) => {
    const lo = (k / n) ** 2;
    const hi = ((k + 1) / n) ** 2;
    const val = k / n;
    return { lo, hi, val };
  });

  const exactPts = Array.from({ length: 201 }, (_, i) => {
    const x = i / 200;
    return toSvg(x, f(x));
  });
  const exactPath = exactPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  const lebesgueApprox = steps.reduce((sum, s) => sum + s.val * (s.hi - s.lo), 0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Lebesgue Approximation by Simple Functions: <InlineMath math="\sqrt{x}" /> on <InlineMath math="[0,1]" />
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Orange rectangles = simple function <InlineMath math="\phi_n" /> (partition range into <em>n</em> equal parts). Integral of <InlineMath math="\phi_n" /> → <InlineMath math="\int_0^1 \sqrt{x}\,dx = 2/3" />.
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {steps.map(({ lo, hi, val }, i) => {
          const { sx: x1 } = toSvg(lo, 0);
          const { sx: x2 } = toSvg(hi, 0);
          const { sy: y1 } = toSvg(0, val);
          const { sy: y2 } = toSvg(0, 0);
          return (
            <rect key={i} x={x1} y={y1} width={x2 - x1} height={y2 - y1}
              fill="rgba(249,115,22,0.25)" stroke="#f97316" strokeWidth={1} />
          );
        })}
        <path d={exactPath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
        <line x1={0} y1={toSvg(0, 0).sy} x2={W} y2={toSvg(0, 0).sy} stroke="#9ca3af" strokeWidth={1} />
        <line x1={toSvg(0, 0).sx} y1={0} x2={toSvg(0, 0).sx} y2={H} stroke="#9ca3af" strokeWidth={1} />
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span>n = {n} steps</span>
          <span>Approx integral: {lebesgueApprox.toFixed(5)} (exact: {(2/3).toFixed(5)})</span>
        </div>
        <input type="range" min="1" max="30" step="1" value={n}
          onChange={e => setN(parseInt(e.target.value))} className="w-full accent-orange-500" />
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Lebesgue key idea: partition the <em>range</em> (not the domain). Simple function height = <InlineMath math="k/n" />, width = measure of pre-image.
      </p>
    </div>
  );
}

export default function LebesgueSection() {
  return (
    <div className="space-y-8">
      <LebesgueApproxViz />

      <DefinitionBlock
        label="Definition 6.2.1"
        title="Lebesgue Integral"
        definition={
          "For a non-negative measurable function $f: \\Omega \\to [0,\\infty]$, the Lebesgue integral is " +
          "$\\int_\\Omega f\\,d\\mu = \\sup\\left\\{\\int_\\Omega \\phi\\,d\\mu : \\phi \\text{ simple}, 0 \\leq \\phi \\leq f\\right\\}$. " +
          "A simple function $\\phi = \\sum_{i=1}^n a_i \\mathbf{1}_{A_i}$ has integral $\\int \\phi\\,d\\mu = \\sum_i a_i \\mu(A_i)$. " +
          "For general $f = f^+ - f^-$: $\\int f\\,d\\mu = \\int f^+\\,d\\mu - \\int f^-\\,d\\mu$, finite when both are finite."
        }
        notation={
          "For Lebesgue measure on $\\mathbb{R}$: $\\int_a^b f\\,d\\lambda$ agrees with the Riemann integral whenever the latter exists. " +
          "The Lebesgue integral handles wider classes: $f = \\mathbf{1}_{\\mathbb{Q}}$ is Lebesgue integrable (integral = 0) but not Riemann integrable."
        }
      />

      <DefinitionBlock
        label="Definition 6.2.2"
        title="L^p Spaces"
        definition={
          "For $1 \\leq p < \\infty$, the space $L^p(\\Omega, \\mathcal{F}, \\mu)$ consists of (equivalence classes of) measurable functions with " +
          "$\\|f\\|_p = \\left(\\int |f|^p\\,d\\mu\\right)^{1/p} < \\infty$. " +
          "$L^2$ is a Hilbert space with inner product $\\langle f, g \\rangle = \\int f\\bar{g}\\,d\\mu$. " +
          "Hölder's inequality: $\\int |fg|\\,d\\mu \\leq \\|f\\|_p \\|g\\|_q$ for $1/p + 1/q = 1$."
        }
      />

      <TheoremBlock
        label="Theorem 6.2.1"
        title="Monotone Convergence Theorem"
        statement={
          "Let $(f_n)$ be a sequence of non-negative measurable functions with $f_n \\nearrow f$ pointwise (i.e., $f_1 \\leq f_2 \\leq \\cdots$ and $f_n \\to f$ a.e.). " +
          "Then $\\int f\\,d\\mu = \\lim_{n \\to \\infty} \\int f_n\\,d\\mu$. " +
          "That is: you can pass the limit through the integral for monotone sequences."
        }
        proof={
          "Since $f_n \\leq f$, we have $\\sup_n \\int f_n \\leq \\int f$. " +
          "For the other direction: let $\\phi$ be a simple function with $0 \\leq \\phi \\leq f$ and $c \\in (0,1)$. " +
          "Define $E_n = \\{f_n \\geq c\\phi\\}$; then $E_n \\nearrow \\Omega$. " +
          "$\\int f_n \\geq \\int_{E_n} f_n \\geq c \\int_{E_n} \\phi \\to c \\int \\phi$. " +
          "Taking $c \\to 1$ and supremum over $\\phi$: $\\lim \\int f_n \\geq \\int f$."
        }
        corollaries={[
          "Fatou's lemma: $\\int \\liminf_n f_n\\,d\\mu \\leq \\liminf_n \\int f_n\\,d\\mu$.",
          "Dominated convergence: if $f_n \\to f$ a.e. and $|f_n| \\leq g$ with $\\int g < \\infty$, then $\\int f_n \\to \\int f$.",
        ]}
      />

      <ExampleBlock title="Lebesgue Integral of an Indicator Function">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          The indicator of rationals: <InlineMath math="f = \mathbf{1}_{\mathbb{Q}}" /> on <InlineMath math="[0,1]" />.
        </p>
        <BlockMath math="\int_0^1 \mathbf{1}_{\mathbb{Q}}\,d\lambda = \lambda(\mathbb{Q} \cap [0,1]) = 0" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This function is Lebesgue integrable (integral = 0) but has no Riemann integral since every
          subinterval contains both rationals and irrationals, making upper and lower Darboux sums differ.
        </p>
      </ExampleBlock>

      <WarningBlock title="Almost Everywhere vs Everywhere">
        <p>
          In Lebesgue theory, functions are identified if they agree <em>almost everywhere</em> (a.e.):
          on a set of measure zero. Thus in <InlineMath math="L^2" />, we work with equivalence classes,
          not individual functions. The norm <InlineMath math="\|f\|_2 = 0" /> means <InlineMath math="f = 0" /> a.e.,
          not <InlineMath math="f(x) = 0" /> for all <InlineMath math="x" />. This distinction matters
          in probability: random variables are a.e. equal iff they have the same distribution.
          Be careful: pointwise convergence a.e. does not imply convergence in <InlineMath math="L^2" /> norm.
        </p>
      </WarningBlock>

      <PythonCode
        title="Lebesgue Integration via NumPy"
        code={`import numpy as np
from scipy import integrate

# ── Simple function approximation (Lebesgue style) ──────────────────────
def lebesgue_approx(f, a, b, n):
    """Approximate integral by partitioning the range."""
    # Sample function values on fine grid
    xs = np.linspace(a, b, 10000)
    fs = f(xs)
    y_min, y_max = fs.min(), fs.max()

    total = 0
    for k in range(n):
        yk_lo = y_min + k * (y_max - y_min) / n
        yk_hi = y_min + (k + 1) * (y_max - y_min) / n
        yk_mid = (yk_lo + yk_hi) / 2
        # Measure of pre-image {x: f(x) in [yk_lo, yk_hi]}
        mask = (fs >= yk_lo) & (fs < yk_hi)
        measure = np.sum(mask) * (b - a) / len(xs)
        total += yk_mid * measure
    return total

f = lambda x: np.sqrt(x)
exact = 2/3  # ∫₀¹ √x dx = 2/3

print("Lebesgue approximation of ∫₀¹ √x dx:")
for n in [5, 10, 50, 200]:
    approx = lebesgue_approx(f, 0, 1, n)
    print(f"  n={n:3d}: {approx:.6f} (error: {abs(approx-exact):.2e})")

# ── Dominated convergence theorem illustration ──────────────────────────
# f_n(x) = n * x * exp(-n * x^2), dominated by g(x) = 1/(2e*x) on [0,1]
# But f_n -> 0 a.e., so integral should -> 0? Actually ∫f_n = 1/2 * (1 - e^{-n}) -> 1/2
# (f_n is NOT dominated by integrable g — no DCT)
print("\\nDCT violation example f_n = n*x*exp(-n*x²):")
for n in [1, 5, 20, 100]:
    val, _ = integrate.quad(lambda x: n * x * np.exp(-n * x**2), 0, 1)
    print(f"  n={n:3d}: ∫₀¹ f_n dx = {val:.6f}")
print("  (f_n → 0 pointwise, but integrals → 1/2: DCT fails, no dominating function)")`}
      />
    </div>
  );
}
