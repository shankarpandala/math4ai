import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function JointDistViz() {
  const [rho, setRho] = useState(0.6);
  const [n, setN] = useState(200);

  // Bivariate normal with correlation rho
  // Generate using Cholesky-like approach deterministically
  const seed42 = (() => {
    let s = 42;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  })();

  const pts = Array.from({ length: n }, () => {
    const u1 = seed42(), u2 = seed42();
    const z1 = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(Math.max(u2, 1e-10))) * Math.sin(2 * Math.PI * u1);
    const x = z1;
    const y = rho * z1 + Math.sqrt(1 - rho * rho) * z2;
    return { x, y };
  });

  const W = 240, H = 200;
  const scale = 35;
  const cx = W / 2, cy = H / 2;
  const toSvg = (x, y) => ({ sx: cx + x * scale, sy: cy - y * scale });

  // Marginal histograms
  const xBins = Array.from({ length: 20 }, (_, i) => ({ lo: -3 + i * 0.3, hi: -3 + (i + 1) * 0.3, count: 0 }));
  const yBins = Array.from({ length: 20 }, (_, i) => ({ lo: -3 + i * 0.3, hi: -3 + (i + 1) * 0.3, count: 0 }));
  pts.forEach(({ x, y }) => {
    const xi = xBins.findIndex(b => x >= b.lo && x < b.hi);
    const yi = yBins.findIndex(b => y >= b.lo && y < b.hi);
    if (xi >= 0) xBins[xi].count++;
    if (yi >= 0) yBins[yi].count++;
  });
  const maxXCount = Math.max(...xBins.map(b => b.count), 1);
  const maxYCount = Math.max(...yBins.map(b => b.count), 1);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Joint Bivariate Normal with Marginals
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Correlation <InlineMath math="\rho" /> controls dependence. Marginals are always Normal regardless of <InlineMath math="\rho" />.
      </p>
      <div className="flex gap-3">
        <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e5e7eb" strokeWidth={1} />
          {pts.map(({ x, y }, i) => {
            const { sx, sy } = toSvg(x, y);
            if (sx < 0 || sx > W || sy < 0 || sy > H) return null;
            return <circle key={i} cx={sx} cy={sy} r={2} fill="#6366f1" opacity={0.5} />;
          })}
        </svg>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs text-gray-500 mb-1">X marginal</p>
            <svg width={80} height={H/2} className="rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              {xBins.map((b, i) => {
                const bh = (b.count / maxXCount) * 60;
                return <rect key={i} x={i * 4} y={H/2 - 10 - bh} width={3} height={bh} fill="#3b82f6" opacity={0.7} />;
              })}
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Y marginal</p>
            <svg width={80} height={H/2} className="rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              {yBins.map((b, i) => {
                const bh = (b.count / maxYCount) * 60;
                return <rect key={i} x={i * 4} y={H/2 - 10 - bh} width={3} height={bh} fill="#10b981" opacity={0.7} />;
              })}
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span className="font-mono">ρ (correlation)</span><span>{rho.toFixed(2)}</span></div>
          <input type="range" min="-0.99" max="0.99" step="0.05" value={rho}
            onChange={e => setRho(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
          Cov(X,Y) = <strong>{rho.toFixed(2)}</strong> (σ_X=σ_Y=1)
        </div>
      </div>
    </div>
  );
}

export default function JointDistSection() {
  return (
    <div className="space-y-8">
      <JointDistViz />

      <DefinitionBlock
        label="Definition 2.3.1"
        title="Joint Distribution"
        definition={
          "For random variables $X$ and $Y$, the joint CDF is $F(x,y) = P(X \\leq x, Y \\leq y)$. " +
          "For jointly continuous $(X,Y)$: joint PDF $f(x,y) \\geq 0$ with $\\iint f(x,y)\\,dx\\,dy = 1$. " +
          "Marginal PDFs: $f_X(x) = \\int_{-\\infty}^\\infty f(x,y)\\,dy$ and $f_Y(y) = \\int_{-\\infty}^\\infty f(x,y)\\,dx$. " +
          "$X$ and $Y$ are independent iff $f(x,y) = f_X(x) f_Y(y)$ for all $(x,y)$."
        }
        notation={
          "Conditional PDF: $f_{X|Y}(x|y) = f(x,y)/f_Y(y)$. " +
          "Conditional expectation: $E[X|Y=y] = \\int x f_{X|Y}(x|y)\\,dx$."
        }
      />

      <DefinitionBlock
        label="Definition 2.3.2"
        title="Covariance and Correlation"
        definition={
          "Covariance: $\\text{Cov}(X,Y) = E[(X-\\mu_X)(Y-\\mu_Y)] = E[XY] - E[X]E[Y]$. " +
          "Correlation: $\\rho(X,Y) = \\text{Cov}(X,Y) / (\\sigma_X \\sigma_Y) \\in [-1, 1]$. " +
          "$|\\rho| = 1$ iff $Y = aX + b$ a.s. (perfect linear relationship). " +
          "If $X \\perp Y$ (independent), then $\\text{Cov}(X,Y) = 0$; the converse is false."
        }
      />

      <TheoremBlock
        label="Theorem 2.3.1"
        title="Law of Total Expectation"
        statement={
          "$E[X] = E[E[X|Y]]$, where the outer expectation is over $Y$. " +
          "More generally, for any integrable $g$: $E[g(X)] = E[E[g(X)|Y]]$. " +
          "Law of total variance: $\\text{Var}(X) = E[\\text{Var}(X|Y)] + \\text{Var}(E[X|Y])$."
        }
        proof={
          "$E[E[X|Y]] = \\int E[X|Y=y] f_Y(y)\\,dy = \\int \\left(\\int x f_{X|Y}(x|y)\\,dx\\right) f_Y(y)\\,dy " +
          "= \\iint x f(x,y)\\,dx\\,dy = E[X]$, " +
          "where we used $f(x,y) = f_{X|Y}(x|y) f_Y(y)$."
        }
      />

      <ExampleBlock title="Bivariate Normal: Correlation vs Independence">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          If <InlineMath math="(X,Y) \sim N(\mathbf{0}, \Sigma)" /> with <InlineMath math="\Sigma = \begin{bmatrix} 1 & \rho \\ \rho & 1 \end{bmatrix}" />:
        </p>
        <BlockMath math="f(x,y) = \frac{1}{2\pi\sqrt{1-\rho^2}} \exp\!\left(-\frac{x^2 - 2\rho xy + y^2}{2(1-\rho^2)}\right)" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For bivariate normal only: <InlineMath math="\rho = 0 \iff X \perp Y" />. Marginals are always{' '}
          <InlineMath math="N(0,1)" /> regardless of <InlineMath math="\rho" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Zero Covariance Does Not Imply Independence">
        <p>
          Let <InlineMath math="X \sim N(0,1)" /> and <InlineMath math="Y = X^2" />. Then{' '}
          <InlineMath math="\text{Cov}(X, Y) = E[X^3] - E[X]E[X^2] = 0 - 0 \cdot 1 = 0" />, but clearly
          <InlineMath math="Y" /> is a deterministic function of <InlineMath math="X" /> — they are maximally
          dependent. Uncorrelatedness only captures linear dependence. Use mutual information or
          distance correlation to detect nonlinear dependence.
        </p>
      </WarningBlock>

      <PythonCode
        title="Joint Distributions and Covariance"
        code={`import numpy as np
from scipy import stats

# ── Bivariate normal ───────────────────────────────────────────────────────
rho = 0.7
Sigma = np.array([[1, rho], [rho, 1]])
mean = np.array([0, 0])

rv = stats.multivariate_normal(mean=mean, cov=Sigma)
print(f"Bivariate normal (ρ={rho}):")
print(f"  pdf at (0,0): {rv.pdf([0,0]):.4f}")

# Sample and verify statistics
np.random.seed(42)
samples = rv.rvs(10000)
X, Y = samples[:, 0], samples[:, 1]
print(f"  Sample correlation: {np.corrcoef(X, Y)[0,1]:.4f} (true: {rho})")
print(f"  Sample Cov(X,Y): {np.cov(X, Y)[0,1]:.4f} (true: {rho})")

# ── Law of total expectation ──────────────────────────────────────────────
# E[X] = E[E[X|Y]] for bivariate normal: E[X|Y=y] = rho*y
# E[E[X|Y]] = E[rho*Y] = rho * E[Y] = 0 = E[X] ✓
cond_means = rho * Y  # E[X|Y=y] = rho*y for standard bivariate normal
print(f"\\nLaw of total expectation:")
print(f"  E[X] = {X.mean():.4f}")
print(f"  E[E[X|Y]] = {cond_means.mean():.4f}")

# ── Zero covariance without independence ──────────────────────────────────
X_sym = np.random.normal(0, 1, 10000)
Y_quad = X_sym ** 2
print(f"\\nX ~ N(0,1), Y = X²:")
print(f"  Cov(X,Y) = {np.cov(X_sym, Y_quad)[0,1]:.4f} (≈ 0)")
print(f"  Corr(X,Y) = {np.corrcoef(X_sym, Y_quad)[0,1]:.4f}")
print(f"  But Y = X² — completely dependent!")`}
      />
    </div>
  );
}
