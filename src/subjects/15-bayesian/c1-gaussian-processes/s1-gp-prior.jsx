import React, { useState, useCallback } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

// RBF kernel k(x1, x2) = exp(-|x1-x2|^2 / (2*l^2))
function rbfKernel(x1, x2, l) {
  const diff = x1 - x2;
  return Math.exp(-(diff * diff) / (2 * l * l));
}

// Build covariance matrix K[i,j] = k(xs[i], xs[j]) + jitter * delta_ij
function buildCovariance(xs, l, jitter = 1e-6) {
  const n = xs.length;
  const K = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      K[i][j] = rbfKernel(xs[i], xs[j], l);
    }
    K[i][i] += jitter;
  }
  return K;
}

// Cholesky decomposition (lower triangular)
function cholesky(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = A[i][j];
      for (let k = 0; k < j; k++) sum -= L[i][k] * L[j][k];
      if (i === j) {
        L[i][j] = sum > 0 ? Math.sqrt(sum) : 1e-10;
      } else {
        L[i][j] = sum / (L[j][j] || 1e-10);
      }
    }
  }
  return L;
}

// Forward substitution: solve L*y = b
function forwardSolve(L, b) {
  const n = b.length;
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let sum = b[i];
    for (let j = 0; j < i; j++) sum -= L[i][j] * y[j];
    y[i] = sum / (L[i][i] || 1e-10);
  }
  return y;
}

// Sample f ~ GP(0, K) using L*eps where L = chol(K), eps ~ N(0,I)
function sampleGP(L, rng) {
  const n = L.length;
  const eps = Array.from({ length: n }, () => {
    // Box-Muller transform
    const u1 = rng();
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-15))) * Math.cos(2 * Math.PI * u2);
  });
  const f = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      f[i] += L[i][j] * eps[j];
    }
  }
  return f;
}

// Seeded pseudo-random number generator (Mulberry32)
function makeRNG(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// GP Prior Visualizer
// ---------------------------------------------------------------------------

const X_RANGE = [-3, 3];
const N_GRID = 80;
const N_SAMPLES = 5;
const SAMPLE_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7'];

const X_GRID = Array.from({ length: N_GRID }, (_, i) =>
  X_RANGE[0] + (i / (N_GRID - 1)) * (X_RANGE[1] - X_RANGE[0])
);

function GPPriorVisualizer() {
  const [lengthScale, setLengthScale] = useState(1.0);
  const [seed, setSeed] = useState(42);

  const { samples, yMin, yMax } = (() => {
    const K = buildCovariance(X_GRID, lengthScale, 1e-6);
    const L = cholesky(K);
    const rng = makeRNG(seed * 137 + 7);
    const rawSamples = Array.from({ length: N_SAMPLES }, () => sampleGP(L, rng));
    const allVals = rawSamples.flat();
    const yMin = Math.min(...allVals) - 0.1;
    const yMax = Math.max(...allVals) + 0.1;
    return { samples: rawSamples, yMin, yMax };
  })();

  const svgWidth = 500;
  const svgHeight = 240;
  const padL = 32, padR = 12, padT = 12, padB = 28;
  const plotW = svgWidth - padL - padR;
  const plotH = svgHeight - padT - padB;

  function toSvgX(x) {
    return padL + ((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * plotW;
  }
  function toSvgY(y) {
    return padT + (1 - (y - yMin) / (yMax - yMin)) * plotH;
  }

  function samplePath(ys) {
    return X_GRID.map((x, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(ys[i]).toFixed(1)}`).join(' ');
  }

  // y=0 line
  const zeroY = toSvgY(0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive GP Prior Visualizer
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        5 sample functions drawn from <InlineMath math="f \sim \mathcal{GP}(0, k_{\mathrm{RBF}})" />{' '}
        with RBF kernel. Adjust length scale <InlineMath math="\ell" /> to control smoothness.
        Click "New Samples" to redraw.
      </p>

      {/* Controls */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
            Length scale <InlineMath math="\ell" />
          </label>
          <input
            type="range" min={0.1} max={2.0} step={0.05} value={lengthScale}
            onChange={(e) => setLengthScale(parseFloat(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-indigo-500"
          />
          <span className="w-12 text-right font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {lengthScale.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-lg bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300"
        >
          New Samples
        </button>
      </div>

      {/* SVG Plot */}
      <div className="overflow-x-auto">
        <svg
          width={svgWidth} height={svgHeight}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50/60 dark:border-gray-700 dark:bg-gray-800/30"
          style={{ fontFamily: 'inherit' }}
        >
          {/* Grid lines */}
          {[-2, -1, 0, 1, 2].map((xv) => (
            <line key={`vg-${xv}`}
              x1={toSvgX(xv)} y1={padT} x2={toSvgX(xv)} y2={padT + plotH}
              stroke="#e5e7eb" strokeWidth={1} strokeDasharray="3,3"
            />
          ))}
          {/* Zero horizontal line */}
          {zeroY >= padT && zeroY <= padT + plotH && (
            <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY}
              stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4,2"
            />
          )}
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {/* X axis labels */}
          {[-3, -2, -1, 0, 1, 2, 3].map((xv) => (
            <text key={`xl-${xv}`}
              x={toSvgX(xv)} y={padT + plotH + 16}
              textAnchor="middle" fontSize={10} fill="#9ca3af"
            >
              {xv}
            </text>
          ))}
          {/* Sample paths */}
          {samples.map((ys, idx) => (
            <path
              key={`s-${idx}-${seed}`}
              d={samplePath(ys)}
              fill="none"
              stroke={SAMPLE_COLORS[idx % SAMPLE_COLORS.length]}
              strokeWidth={1.8}
              opacity={0.85}
            />
          ))}
          {/* Y axis label */}
          <text x={padL - 6} y={padT + plotH / 2 + 4}
            textAnchor="middle" fontSize={10} fill="#9ca3af"
            transform={`rotate(-90, ${padL - 14}, ${padT + plotH / 2})`}
          >
            f(x)
          </text>
          <text x={padL + plotW / 2} y={padT + plotH + 26}
            textAnchor="middle" fontSize={10} fill="#9ca3af"
          >
            x
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        {SAMPLE_COLORS.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-block h-2 w-6 rounded" style={{ backgroundColor: c }} />
            Sample {i + 1}
          </span>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-800 dark:border-indigo-700/40 dark:bg-indigo-900/20 dark:text-indigo-300">
        {lengthScale < 0.4 ? (
          <span>
            <strong>Small <InlineMath math="\ell" />:</strong> Rapidly varying functions —
            nearby points are nearly uncorrelated. The GP prior puts probability on rough, jagged functions.
          </span>
        ) : lengthScale > 1.5 ? (
          <span>
            <strong>Large <InlineMath math="\ell" />:</strong> Slowly varying functions —
            the kernel correlates points far apart. All samples look like smooth, gentle curves.
          </span>
        ) : (
          <span>
            <strong>Moderate <InlineMath math="\ell \approx 1" />:</strong> Balanced smoothness.
            The length scale encodes prior belief about how quickly <InlineMath math="f" /> varies.
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const GP_CODE = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel

# -----------------------------------------------------------------------
# 1. GP Prior: sample functions from GP(0, RBF kernel)
# -----------------------------------------------------------------------

np.random.seed(42)
kernel_prior = RBF(length_scale=1.0)

# Evaluation points
X_grid = np.linspace(-3, 3, 200).reshape(-1, 1)

# Build covariance matrix from prior kernel
K_prior = kernel_prior(X_grid)
K_prior += 1e-6 * np.eye(len(X_grid))   # numerical jitter

# Sample 5 functions f ~ GP(0, K)
L = np.linalg.cholesky(K_prior)
samples = L @ np.random.randn(len(X_grid), 5)

plt.figure(figsize=(10, 4))
for i in range(5):
    plt.plot(X_grid, samples[:, i], alpha=0.8, label=f'Sample {i+1}')
plt.axhline(0, color='gray', linestyle='--', linewidth=0.8)
plt.title("GP Prior Samples — RBF kernel, l=1.0")
plt.xlabel("x"); plt.ylabel("f(x)")
plt.legend(loc='upper right')
plt.tight_layout()
plt.savefig("gp_prior_samples.png", dpi=100)

# -----------------------------------------------------------------------
# 2. GP Posterior: condition on noisy observations
# -----------------------------------------------------------------------

# True function and noisy observations
def f_true(x):
    return np.sin(2 * x) * np.exp(-0.3 * x**2)

X_train = np.array([-2.5, -1.0, 0.3, 1.5, 2.8]).reshape(-1, 1)
y_train = f_true(X_train.ravel()) + 0.1 * np.random.randn(len(X_train))

# Fit GP regression
kernel = RBF(length_scale=1.0) + WhiteKernel(noise_level=0.01)
gpr = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=10)
gpr.fit(X_train, y_train)

# Predict posterior mean and std on test grid
X_test = np.linspace(-3.5, 3.5, 300).reshape(-1, 1)
mu_post, sigma_post = gpr.predict(X_test, return_std=True)

print(f"Optimized kernel: {gpr.kernel_}")
print(f"Log-marginal-likelihood: {gpr.log_marginal_likelihood_value_:.4f}")

# Plot posterior
plt.figure(figsize=(10, 5))
plt.fill_between(
    X_test.ravel(),
    mu_post - 2 * sigma_post,
    mu_post + 2 * sigma_post,
    alpha=0.3, label='95% CI', color='steelblue'
)
plt.plot(X_test, mu_post, 'b-', linewidth=2, label='Posterior mean')
plt.plot(X_test, f_true(X_test.ravel()), 'k--', linewidth=1.5, label='True f')
plt.scatter(X_train, y_train, c='red', zorder=5, s=60, label='Observations')
plt.title("GP Posterior — 5 Noisy Observations")
plt.xlabel("x"); plt.ylabel("f(x)")
plt.legend()
plt.tight_layout()
plt.savefig("gp_posterior.png", dpi=100)
`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Rasmussen, C. E. & Williams, C. K. I.',
    year: 2006,
    title: 'Gaussian Processes for Machine Learning',
    venue: 'MIT Press',
    url: 'http://www.gaussianprocess.org/gpml/',
    type: 'textbook',
    whyImportant: 'The definitive textbook on Gaussian processes. Covers kernels, inference, approximations, and connections to neural networks. Freely available online.',
  },
  {
    authors: 'Wiener, N.',
    year: 1949,
    title: 'Extrapolation, Interpolation, and Smoothing of Stationary Time Series',
    venue: 'MIT Press',
    url: 'https://mitpress.mit.edu/9780262730099/',
    type: 'foundational',
    whyImportant: 'Early treatment of Gaussian stochastic processes and optimal linear prediction, foundational to Kriging (Gaussian process regression in geostatistics).',
  },
  {
    authors: 'MacKay, D. J. C.',
    year: 2003,
    title: 'Information Theory, Inference, and Learning Algorithms',
    venue: 'Cambridge University Press',
    url: 'https://www.inference.org.uk/mackay/itila/',
    type: 'textbook',
    whyImportant: 'Chapter 45 gives an excellent treatment of Gaussian processes from a Bayesian perspective, connecting them to neural networks and Bayesian model comparison.',
  },
  {
    authors: 'Wilson, A. G. & Adams, R. P.',
    year: 2013,
    title: 'Gaussian Process Kernels for Pattern Discovery and Extrapolation',
    venue: 'ICML 2013',
    url: 'https://arxiv.org/abs/1302.4245',
    type: 'foundational',
    whyImportant: 'Introduced the Spectral Mixture kernel, showing how to automatically discover complex periodic and quasi-periodic patterns from data using GP kernel learning.',
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function GPPrior() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Gaussian Process Prior
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          A non-parametric Bayesian approach to regression and classification — placing a
          prior distribution directly over functions.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          Gaussian processes have roots in early 20th-century stochastic process theory.
          <strong> Norbert Wiener</strong> (1949) developed optimal linear prediction for
          stationary processes; <strong>Andrey Kolmogorov</strong> independently developed
          the mathematical theory of stochastic processes including the extension theorem
          that justifies GPs as distributions over functions.
        </p>
        <p className="mt-2">
          In machine learning, GPs were popularized by <strong>Neal (1996)</strong> (who showed
          that infinite-width Bayesian neural networks converge to GPs) and thoroughly
          developed by <strong>Rasmussen & Williams (2006)</strong> whose textbook remains the
          standard reference. The connection between deep learning and GPs remains an active
          research area (Neural Tangent Kernels, deep GPs).
        </p>
      </NoteBlock>

      {/* GP Definition */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Gaussian Process"
        definition="A Gaussian Process is a collection of random variables $\{f(x)\}_{x \in \mathcal{X}}$ such that for any finite set of inputs $\{x_1, \ldots, x_n\} \subset \mathcal{X}$, the joint distribution $(f(x_1), \ldots, f(x_n))$ is multivariate Gaussian. A GP is completely specified by its mean function $m(x) = \mathbb{E}[f(x)]$ and covariance kernel $k(x, x') = \mathrm{Cov}[f(x), f(x')]$. We write $f \sim \mathcal{GP}(m, k)$."
        notation="For regression, we typically use $m(x) = 0$ (zero mean prior). The kernel $k$ encodes our beliefs about smoothness, periodicity, and scale. Any symmetric positive semi-definite function is a valid kernel."
      />

      {/* RBF Kernel */}
      <DefinitionBlock
        label="Definition 1.2"
        title="Radial Basis Function (RBF / Squared Exponential) Kernel"
        definition="The RBF kernel is $k_{\mathrm{RBF}}(x, x') = \sigma_f^2 \exp\!\left(-\frac{\|x - x'\|^2}{2\ell^2}\right)$ where $\sigma_f^2 > 0$ is the signal variance and $\ell > 0$ is the length scale. It produces infinitely differentiable sample functions. The covariance decays smoothly from $\sigma_f^2$ at $x = x'$ to 0 as $\|x - x'\| \to \infty$."
        notation="Length scale $\ell$ controls smoothness: small $\ell$ → rapidly varying (jagged) functions; large $\ell$ → slowly varying (smooth) functions. Other kernels: Matérn (finite differentiability), periodic kernel (cyclic patterns), linear kernel (linear functions)."
      />

      {/* GP is consistent */}
      <TheoremBlock
        label="Theorem 1.1"
        title="Kolmogorov Extension: GP Priors are Consistent"
        statement="Given a mean function $m: \mathcal{X} \to \mathbb{R}$ and a symmetric positive semi-definite kernel $k: \mathcal{X} \times \mathcal{X} \to \mathbb{R}$, there exists a unique probability measure on the space of functions $\mathbb{R}^{\mathcal{X}}$ such that any finite-dimensional marginal $(f(x_1), \ldots, f(x_n)) \sim \mathcal{N}(\mathbf{m}, K)$ where $\mathbf{m}_i = m(x_i)$ and $K_{ij} = k(x_i, x_j)$."
        proof="Kolmogorov's Extension Theorem guarantees existence of the measure given that the finite-dimensional distributions are consistent (Kolmogorov consistency conditions). Consistency requires: (i) permutation invariance — $(f(x_1), f(x_2))$ and $(f(x_2), f(x_1))$ give the same marginals; (ii) marginalization — integrating out any subset of variables gives the correct lower-dimensional Gaussian. Both hold automatically for Gaussian distributions with $K_{ij} = k(x_i, x_j)$. Positive semi-definiteness of $k$ ensures each $K$ is a valid covariance matrix. $\square$"
        corollaries={[
          "A GP prior defines a valid probability measure over the infinite-dimensional function space — we can coherently ask about the probability of any event defined by function values.",
          "Samples from a GP with RBF kernel are continuous (in fact, infinitely differentiable) almost surely. Samples from a Matérn-$\\nu$ kernel are $\\lceil \\nu \\rceil - 1$ times differentiable.",
          "Any function in the reproducing kernel Hilbert space (RKHS) of $k$ has prior probability zero — the GP assigns probability to much larger function classes.",
        ]}
      />

      {/* Interactive Visualizer */}
      <GPPriorVisualizer />

      {/* GP Regression */}
      <DefinitionBlock
        label="Definition 1.3"
        title="GP Regression (Kriging)"
        definition="Given observations $\mathbf{y} = f(X) + \varepsilon$ at inputs $X = \{x_1, \ldots, x_n\}$ with noise $\varepsilon \sim \mathcal{N}(0, \sigma_n^2 I)$, the GP posterior at test points $X_*$ is Gaussian: $p(f_* | X_*, X, \mathbf{y}) = \mathcal{N}(\mu_*, \Sigma_*)$ with posterior mean $\mu_* = K(X_*, X)[K(X,X) + \sigma_n^2 I]^{-1}\mathbf{y}$ and covariance $\Sigma_* = K(X_*, X_*) - K(X_*, X)[K(X,X) + \sigma_n^2 I]^{-1}K(X, X_*)$."
        notation="$K(X_*, X)_{ij} = k(x^*_i, x_j)$. The matrix $[K(X,X) + \sigma_n^2 I]^{-1}$ requires $O(n^3)$ computation. The posterior mean is a linear predictor (weighted sum of kernel evaluations); the posterior variance is reduced from the prior wherever data has been observed."
      />

      {/* GP posterior theorem */}
      <TheoremBlock
        label="Theorem 1.2"
        title="GP Posterior via Multivariate Gaussian Conditioning"
        statement="For a GP prior $f \sim \mathcal{GP}(0, k)$ and Gaussian noise model $\mathbf{y} = f(X) + \varepsilon$, the posterior $p(f_* | X_*, \mathbf{y})$ is Gaussian with mean $\mu_* = K_{*n}(K_{nn} + \sigma_n^2 I)^{-1}\mathbf{y}$ and covariance $\Sigma_* = K_{**} - K_{*n}(K_{nn} + \sigma_n^2 I)^{-1}K_{n*}$ where $K_{nn} = K(X,X)$, $K_{*n} = K(X_*,X)$, $K_{**} = K(X_*,X_*)$."
        proof="By the GP definition, $(f(X_*), f(X))$ is jointly Gaussian. With the noise model, $(f(X_*), \mathbf{y})$ is jointly Gaussian: $\begin{pmatrix}f_* \\ \mathbf{y}\end{pmatrix} \sim \mathcal{N}\!\left(\mathbf{0},\, \begin{pmatrix}K_{**} & K_{*n} \\ K_{n*} & K_{nn} + \sigma_n^2 I\end{pmatrix}\right)$. Applying the conditional Gaussian formula: $p(f_*|\mathbf{y}) = \mathcal{N}(\mu_*, \Sigma_*)$ with $\mu_* = K_{*n}(K_{nn}+\sigma_n^2 I)^{-1}\mathbf{y}$ and $\Sigma_* = K_{**} - K_{*n}(K_{nn}+\sigma_n^2 I)^{-1}K_{n*}$. $\square$"
        corollaries={[
          "The posterior mean is a linear function of the observations $\\mathbf{y}$. This makes GP regression the optimal linear unbiased predictor (BLUP) under its kernel assumptions.",
          "The posterior variance $\\Sigma_*(x_*, x_*)$ equals the prior variance $k(x_*, x_*)$ minus a non-negative correction — the GP always becomes more confident after seeing data.",
          "Hyperparameters $(\\ell, \\sigma_f^2, \\sigma_n^2)$ can be optimized by maximizing the log marginal likelihood $\\log p(\\mathbf{y}|X,\\theta) = -\\frac{1}{2}\\mathbf{y}^\\top K_y^{-1}\\mathbf{y} - \\frac{1}{2}\\log|K_y| - \\frac{n}{2}\\log 2\\pi$.",
        ]}
      />

      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Posterior Mean and Variance Formulas
        </h2>
        <BlockMath math="\mu_* = K(X_*, X)\bigl[K(X,X) + \sigma_n^2 I\bigr]^{-1}\mathbf{y}" />
        <BlockMath math="\Sigma_* = K(X_*, X_*) - K(X_*, X)\bigl[K(X,X) + \sigma_n^2 I\bigr]^{-1}K(X, X_*)" />
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The posterior mean can be written as a kernel regression:
        </p>
        <BlockMath math="\mu_*(x_*) = \sum_{i=1}^n \alpha_i\, k(x_*, x_i), \quad \boldsymbol{\alpha} = (K_{nn} + \sigma_n^2 I)^{-1}\mathbf{y}" />
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          The dual weights <InlineMath math="\boldsymbol{\alpha}" /> solve a linear system and are
          shared for all test points. This gives GPs an elegant dual view: the prediction at
          any new point is a weighted sum of kernel evaluations at training points — a
          <em> kernel smoothing</em> interpretation.
        </p>
      </section>

      {/* Example */}
      <ExampleBlock
        title="GP Regression with 5 Noisy Observations"
        problem="We observe 5 noisy samples from an unknown function. Using a GP with RBF kernel $k(x,x') = \exp(-|x-x'|^2/2)$ and noise level $\sigma_n^2 = 0.01$. Compute and interpret the posterior mean and uncertainty at a new test point $x_* = 0$."
        difficulty="intermediate"
        solution={[
          {
            step: 'Set up training data and compute $K_{nn}$',
            explanation: 'With observations at $X = \{-2, -1, 0, 1, 2\}$, compute the $5 \\times 5$ kernel matrix $K_{nn}$ where $K_{ij} = k(x_i, x_j) = \\exp(-|x_i - x_j|^2/2)$. E.g., $K_{12} = \\exp(-0.5) \\approx 0.607$.',
          },
          {
            step: 'Compute cross-kernel $K(x_*, X)$',
            formula: 'k(x_*, X) = [k(0, -2),\\, k(0, -1),\\, k(0, 0),\\, k(0, 1),\\, k(0, 2)]',
            explanation: 'Evaluates to $[e^{-2}, e^{-0.5}, 1, e^{-0.5}, e^{-2}] \\approx [0.135, 0.607, 1, 0.607, 0.135]$.',
          },
          {
            step: 'Form the noisy kernel matrix',
            formula: 'K_y = K_{nn} + \\sigma_n^2 I = K_{nn} + 0.01 I',
            explanation: 'The noise adds 0.01 to each diagonal entry, ensuring invertibility and accounting for observation noise.',
          },
          {
            step: 'Posterior mean at $x_* = 0$',
            formula: '\\mu_*(0) = k(0, X)^\\top K_y^{-1} \\mathbf{y}',
            explanation: 'This is a weighted average of observations where weights are proportional to kernel similarity. Points closer to $x_* = 0$ receive higher weight.',
          },
          {
            step: 'Posterior variance at $x_* = 0$',
            formula: '\\sigma_*^2(0) = k(0,0) - k(0,X)^\\top K_y^{-1} k(X, 0) = 1 - k(0,X)^\\top K_y^{-1} k(X,0)',
            explanation: 'The prior variance is $k(0,0) = 1$. Since $x=0$ is a training point, the posterior variance will be approximately $\\sigma_n^2 = 0.01$ — nearly certain there.',
          },
        ]}
      />

      {/* Warning */}
      <WarningBlock title="Scalability: O(n³) Complexity and Sparse Approximations">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>Cubic time complexity:</strong> Exact GP inference requires solving
              the linear system <InlineMath math="(K_{nn} + \sigma_n^2 I)^{-1}\mathbf{y}" />
              via Cholesky factorization, costing{' '}
              <InlineMath math="O(n^3)" /> time and <InlineMath math="O(n^2)" /> memory.
              With <InlineMath math="n = 10{,}000" /> points this becomes impractical.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>Sparse GP approximations:</strong> Inducing point methods (Nyström
              approximation, FITC, SVGP) reduce cost to{' '}
              <InlineMath math="O(nm^2)" /> where <InlineMath math="m \ll n" /> is the
              number of inducing points. The GPyTorch library enables GPU-accelerated GPs
              with millions of data points using structured kernel interpolation (SKI).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>Kernel selection matters:</strong> The GP's inductive bias is
              entirely encoded in the kernel choice. A misspecified kernel can yield
              overconfident or underconfident predictions. Always validate the posterior
              predictive uncertainty empirically, and consider kernel hyperparameter
              optimization via marginal likelihood maximization.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* Python Code */}
      <PythonCode
        code={GP_CODE}
        language="python"
        title="Gaussian Process Regression — scikit-learn"
        runnable
      />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
