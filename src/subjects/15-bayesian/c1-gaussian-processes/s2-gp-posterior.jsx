import React, { useState, useCallback } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// GP Posterior Visualizer with clickable training points
// ---------------------------------------------------------------------------

function rbf(x1, x2, l) {
  const d = x1 - x2;
  return Math.exp(-(d * d) / (2 * l * l));
}

function buildK(xs1, xs2, l) {
  return xs1.map((x1) => xs2.map((x2) => rbf(x1, x2, l)));
}

function choleskyAndSolve(K, b) {
  const n = K.length;
  const L = K.map((row) => row.slice());
  // Cholesky: L*L^T = K
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = L[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / (L[j][j] || 1e-12);
    }
    for (let j = i + 1; j < n; j++) L[i][j] = 0;
  }
  // Forward substitution L*y = b
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j];
    y[i] = s / (L[i][i] || 1e-12);
  }
  // Backward substitution L^T * alpha = y
  const alpha = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let j = i + 1; j < n; j++) s -= L[j][i] * alpha[j];
    alpha[i] = s / (L[i][i] || 1e-12);
  }
  return { alpha, L };
}

function computeGPPosterior(trainX, trainY, testX, l, noiseVar) {
  const n = trainX.length;
  if (n === 0) {
    return testX.map(() => ({ mu: 0, variance: 1 }));
  }
  // K_nn + sigma^2 I
  const Knn = buildK(trainX, trainX, l);
  for (let i = 0; i < n; i++) Knn[i][i] += noiseVar;

  const { alpha } = choleskyAndSolve(Knn, trainY);

  // Invert Knn using Cholesky (reuse)
  const { L } = choleskyAndSolve(Knn, trainY);

  return testX.map((xs) => {
    // K_*n
    const kStar = trainX.map((xt) => rbf(xs, xt, l));
    // mu_* = K_*n * alpha
    const mu = kStar.reduce((s, k, i) => s + k * alpha[i], 0);
    // Posterior variance: k(x*,x*) - K_*n * K_nn^-1 * K_n*
    // = 1 - v^T v where v = L^{-1} K_n*
    const v = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = kStar[i];
      for (let j = 0; j < i; j++) s -= L[i][j] * v[j];
      v[i] = s / (L[i][i] || 1e-12);
    }
    const variance = Math.max(1 - v.reduce((s, vi) => s + vi * vi, 0), 0);
    return { mu, variance };
  });
}

const X_GRID = Array.from({ length: 60 }, (_, i) => -3 + (i / 59) * 6);

function GPPosteriorViz() {
  const [trainPoints, setTrainPoints] = useState([
    { x: -2, y: 1 }, { x: 0, y: -0.5 }, { x: 1.5, y: 0.8 },
  ]);
  const [lengthScale, setLengthScale] = useState(1.0);
  const [noiseLevel, setNoiseLevel] = useState(0.05);

  const posterior = computeGPPosterior(
    trainPoints.map((p) => p.x),
    trainPoints.map((p) => p.y),
    X_GRID, lengthScale, noiseLevel
  );

  const svgW = 480, svgH = 260;
  const padL = 36, padR = 12, padT = 16, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const xMin = -3, xMax = 3, yMin = -2.5, yMax = 2.5;

  function tx(x) { return padL + ((x - xMin) / (xMax - xMin)) * plotW; }
  function ty(y) { return padT + (1 - (y - yMin) / (yMax - yMin)) * plotH; }

  const meanPoints = posterior.map((p, i) => `${tx(X_GRID[i]).toFixed(1)},${ty(p.mu).toFixed(1)}`).join(' ');

  // Upper/lower ±2sigma bands
  const upperPts = posterior.map((p, i) => `${tx(X_GRID[i]).toFixed(1)},${ty(p.mu + 2 * Math.sqrt(p.variance)).toFixed(1)}`);
  const lowerPts = [...posterior].reverse().map((p, i) => `${tx(X_GRID[59 - i]).toFixed(1)},${ty(p.mu - 2 * Math.sqrt(p.variance)).toFixed(1)}`);
  const bandPath = `M ${upperPts[0]} ${upperPts.slice(1).join(' ')} L ${lowerPts[0]} ${lowerPts.slice(1).join(' ')} Z`;

  const handleSvgClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (svgW / rect.width);
    const svgY = (e.clientY - rect.top) * (svgH / rect.height);
    const dataX = xMin + ((svgX - padL) / plotW) * (xMax - xMin);
    const dataY = yMin + (1 - (svgY - padT) / plotH) * (yMax - yMin);
    if (dataX < xMin || dataX > xMax || dataY < yMin || dataY > yMax) return;
    setTrainPoints((pts) => {
      if (pts.length >= 10) return pts.slice(1).concat({ x: dataX, y: dataY });
      return [...pts, { x: dataX, y: dataY }];
    });
  }, []);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive GP Posterior — Click to Add Training Points
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Click the plot to add training points. The posterior mean (blue) and ±2σ band (shaded)
        update in real time. Posterior variance <strong>collapses near observations</strong>.
      </p>
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-4">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">Length scale ℓ</label>
          <input type="range" min={0.1} max={2.5} step={0.05} value={lengthScale}
            onChange={(e) => setLengthScale(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-blue-500" />
          <span className="w-12 text-right font-mono text-sm font-bold text-blue-600">{lengthScale.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">Noise σ²</label>
          <input type="range" min={0.001} max={0.5} step={0.005} value={noiseLevel}
            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-orange-500" />
          <span className="w-12 text-right font-mono text-sm font-bold text-orange-600">{noiseLevel.toFixed(3)}</span>
        </div>
        <button onClick={() => setTrainPoints([])}
          className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 dark:bg-gray-800">
          Clear points
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH} onClick={handleSvgClick}
          className="mx-auto block cursor-crosshair rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Zero line */}
          <line x1={padL} y1={ty(0)} x2={padL + plotW} y2={ty(0)} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4,2" />
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {[-2, -1, 0, 1, 2].map((v) => (
            <text key={v} x={tx(v)} y={padT + plotH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">{v}</text>
          ))}
          {/* Confidence band */}
          <path d={bandPath} fill="#3b82f6" fillOpacity={0.15} />
          {/* Posterior mean */}
          <polyline points={meanPoints} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
          {/* Training points */}
          {trainPoints.map((p, i) => (
            <circle key={i} cx={tx(p.x)} cy={ty(p.y)} r={5}
              fill="#ef4444" stroke="white" strokeWidth={1.5} />
          ))}
          {/* Labels */}
          <text x={padL + 10} y={padT + 12} fontSize={9} fill="#3b82f6" fontWeight="bold">posterior mean</text>
          <text x={padL + 10} y={padT + 24} fontSize={9} fill="#3b82f6" opacity={0.5}>±2σ band</text>
          <circle cx={padL + 10} cy={padT + 35} r={4} fill="#ef4444" />
          <text x={padL + 18} y={padT + 39} fontSize={9} fill="#ef4444">observations</text>
        </svg>
      </div>
      <p className="mt-2 text-xs text-gray-400 text-center">Click on the plot to add observation points (max 10)</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const GP_POST_CODE = `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel

# Training data
X_train = np.array([-2, -1, 0, 0.5, 1.5, 2.5]).reshape(-1, 1)
y_train = np.sin(X_train.ravel()) + 0.1 * np.random.randn(len(X_train))

# GP with RBF + noise kernel (hyperparameters optimized by marginal likelihood)
kernel = RBF(length_scale=1.0) + WhiteKernel(noise_level=0.01)
gp = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=5, normalize_y=True)
gp.fit(X_train, y_train)

# Posterior prediction
X_test = np.linspace(-3.5, 3.5, 200).reshape(-1, 1)
mu_post, sigma_post = gp.predict(X_test, return_std=True)

print(f"Optimized kernel: {gp.kernel_}")
print(f"Posterior mean at x=0: {gp.predict([[0]])[0]:.4f}")
print(f"Posterior std  at x=0: {gp.predict([[0]], return_std=True)[1][0]:.4f}")
print(f"Posterior std  at x=3: {gp.predict([[3]], return_std=True)[1][0]:.4f}")
# Far from training data: std ≈ 1 (prior uncertainty)
# Near training data: std << 1 (posterior collapsed to observation)

# Manual GP posterior formulas
def gp_posterior(X_train, y_train, X_test, l=1.0, noise_var=0.01):
    def rbf(x1, x2): return np.exp(-0.5 * ((x1 - x2) / l)**2)
    n = len(X_train)
    Knn = np.array([[rbf(X_train[i,0], X_train[j,0]) for j in range(n)] for i in range(n)])
    Knn += noise_var * np.eye(n)
    K_star_n = np.array([[rbf(xs[0], xn[0]) for xn in X_train] for xs in X_test])
    K_star_star = np.array([[rbf(xs[0], xs2[0]) for xs2 in X_test] for xs in X_test])
    alpha = np.linalg.solve(Knn, y_train)
    mu_post = K_star_n @ alpha
    cov_post = K_star_star - K_star_n @ np.linalg.solve(Knn, K_star_n.T)
    return mu_post, np.diag(cov_post)
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function GPPosterior() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          GP Posterior & Prediction
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Conditioning a Gaussian Process prior on observations yields an analytically tractable
          Gaussian posterior. The posterior mean is the best linear unbiased predictor; the
          posterior variance quantifies uncertainty about the function.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          GP regression is equivalent to <strong>Kriging</strong> in geostatistics (Matheron,
          1963), where it is the BLUP (Best Linear Unbiased Predictor). In machine learning,
          the GP posterior was developed by <strong>Rasmussen & Williams (2006)</strong> and
          is used extensively in Bayesian optimization (where posterior variance drives
          exploration-exploitation tradeoffs) and scientific emulation.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 2.1"
        title="GP Posterior Distribution"
        definition="Given observations $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^n$ with $y_i = f(x_i) + \varepsilon_i$, $\varepsilon_i \sim \mathcal{N}(0, \sigma_n^2)$, and GP prior $f \sim \mathcal{GP}(0, k)$, the posterior is $f_* | X_*, \mathcal{D} \sim \mathcal{GP}(\mu_*, \Sigma_*)$ where: $\mu_*(X_*) = K(X_*, X)(K(X,X) + \sigma_n^2 I)^{-1}\mathbf{y}$ and $\Sigma_*(X_*, X_*) = K(X_*,X_*) - K(X_*,X)(K(X,X)+\sigma_n^2 I)^{-1}K(X,X_*)$."
        notation="$K(X_*,X)_{ij} = k(x_i^*, x_j)$. The matrix $K_y = K(X,X) + \sigma_n^2 I$ is the noisy kernel matrix. The posterior mean is a linear combination of training observations. The posterior variance is reduced from the prior at all test points, with maximum reduction at the training inputs."
      />

      <DefinitionBlock
        label="Definition 2.2"
        title="Predictive Distribution (Point Prediction)"
        definition="The predictive distribution at a single test point $x_*$ is Gaussian: $p(f_*|x_*, \mathcal{D}) = \mathcal{N}(\mu_*(x_*), \sigma_*^2(x_*))$ with $\mu_*(x_*) = \mathbf{k}_*^T K_y^{-1} \mathbf{y}$ and $\sigma_*^2(x_*) = k(x_*,x_*) - \mathbf{k}_*^T K_y^{-1} \mathbf{k}_*$ where $\mathbf{k}_* = [k(x_*, x_1), \ldots, k(x_*, x_n)]^T$. Including output noise: $p(y_*|x_*,\mathcal{D}) = \mathcal{N}(\mu_*(x_*),\, \sigma_*^2(x_*) + \sigma_n^2)$."
        notation="$\sigma_*^2(x_*)$ is the posterior variance (epistemic uncertainty — reducible with more data). $\sigma_n^2$ is the aleatoric noise (irreducible observation noise). The 95% credible interval is $\mu_* \pm 1.96\,\sigma_*$."
      />

      <DefinitionBlock
        label="Definition 2.3"
        title="Marginal Likelihood (Model Evidence)"
        definition="The GP marginal likelihood integrates over all functions consistent with the prior: $\log p(\mathbf{y}|X, \theta) = -\frac{1}{2}\mathbf{y}^T K_y^{-1}\mathbf{y} - \frac{1}{2}\log|K_y| - \frac{n}{2}\log 2\pi$ where $\theta = (\ell, \sigma_f^2, \sigma_n^2)$ are the kernel hyperparameters. Maximizing this over $\theta$ automatically balances data fit (first term) against model complexity (second term — Occam's razor)."
        notation="The log marginal likelihood has gradients $\frac{\partial \log p}{\partial \theta_j} = \frac{1}{2}\mathrm{tr}\!\left((K_y^{-1}\mathbf{y}\mathbf{y}^T K_y^{-1} - K_y^{-1})\frac{\partial K_y}{\partial \theta_j}\right)$ which can be computed in $O(n^2)$ given the Cholesky factorization."
      />

      <TheoremBlock
        label="Theorem 2.1"
        title="GP Posterior via Multivariate Gaussian Conditioning"
        statement="The GP posterior formula follows directly from conditioning the joint Gaussian $(f_*, \mathbf{y})$ on $\mathbf{y}$. The joint is $\begin{pmatrix}f_* \\ \mathbf{y}\end{pmatrix} \sim \mathcal{N}\!\left(\mathbf{0},\,\begin{pmatrix}K_{**} & K_{*n} \\ K_{n*} & K_{nn}+\sigma_n^2 I\end{pmatrix}\right)$, and the conditional mean and variance follow from the standard Gaussian conditioning formula."
        proof="For jointly Gaussian $(a,b)$ with mean $(\mu_a,\mu_b)$ and covariance $\begin{pmatrix}\Sigma_{aa} & \Sigma_{ab} \\ \Sigma_{ba} & \Sigma_{bb}\end{pmatrix}$, the conditional is $a|b \sim \mathcal{N}(\mu_a + \Sigma_{ab}\Sigma_{bb}^{-1}(b-\mu_b),\, \Sigma_{aa} - \Sigma_{ab}\Sigma_{bb}^{-1}\Sigma_{ba})$. Applying with $a = f_*$, $b = \mathbf{y}$, $\Sigma_{aa} = K_{**}$, $\Sigma_{ab} = K_{*n}$, $\Sigma_{bb} = K_{nn}+\sigma_n^2 I$, $\mu_a = \mu_b = 0$: $\mu_* = K_{*n}(K_{nn}+\sigma_n^2 I)^{-1}\mathbf{y}$, $\Sigma_* = K_{**} - K_{*n}(K_{nn}+\sigma_n^2 I)^{-1}K_{n*}$. $\square$"
        corollaries={[
          "The posterior covariance $\\Sigma_*$ does not depend on the observed values $\\mathbf{y}$ — only on the locations $X$ and $X_*$. This is a property of Gaussian distributions.",
          "Cholesky factorization of $K_y$ reduces computation from $O(n^3)$ matrix inverse to $O(n^3)$ Cholesky + $O(n^2)$ solve, with better numerical stability.",
        ]}
      />

      <TheoremBlock
        label="Theorem 2.2"
        title="Posterior Mean as Kernel Regression (Representer Theorem)"
        statement="The GP posterior mean can be written as $\mu_*(x_*) = \sum_{i=1}^n \alpha_i\, k(x_*, x_i)$ where $\boldsymbol{\alpha} = (K_{nn} + \sigma_n^2 I)^{-1}\mathbf{y}$. This is a kernel-weighted sum of training observations — equivalent to kernel ridge regression in the RKHS associated with $k$."
        proof="By definition, $\mu_*(x_*) = K(x_*, X) K_y^{-1}\mathbf{y} = [k(x_*, x_1), \ldots, k(x_*, x_n)](K_{nn}+\sigma_n^2 I)^{-1}\mathbf{y} = \mathbf{k}_*^T\boldsymbol{\alpha} = \sum_i \alpha_i k(x_*,x_i)$. By the representer theorem, the minimizer of $\frac{1}{n}\sum_i(y_i - f(x_i))^2 + \lambda\|f\|_{\mathcal{H}_k}^2$ in the RKHS $\mathcal{H}_k$ is exactly $f^*(x) = \sum_i\alpha_i k(x,x_i)$ with $\boldsymbol{\alpha} = (K_{nn}+\lambda I)^{-1}\mathbf{y}$ where $\lambda = \sigma_n^2$. $\square$"
        corollaries={[
          "GP regression and kernel ridge regression are equivalent for Gaussian noise. The Bayesian (GP) view additionally provides uncertainty estimates.",
          "The dual weights $\\boldsymbol{\\alpha}$ are shared for all test points — computing predictions at $m$ test points costs $O(mn)$ after solving for $\\boldsymbol{\\alpha}$.",
        ]}
      />

      <GPPosteriorViz />

      <ExampleBlock
        title="GP Posterior with 3 Noisy Observations"
        problem="GP prior: $f \sim \mathcal{GP}(0, k_\mathrm{RBF})$ with $\ell=1$, noise $\sigma_n^2=0.01$. Observations: $(x,y) \in \{(-1, 0.8), (0, -0.2), (1, 0.9)\}$. Compute $\mu_*(0.5)$ and $\sigma_*^2(0.5)$."
        difficulty="advanced"
        solution={[
          {
            step: 'Build noisy kernel matrix K_y (3×3)',
            formula: 'K_y = \\begin{pmatrix}1.01 & 0.607 & 0.135 \\\\ 0.607 & 1.01 & 0.607 \\\\ 0.135 & 0.607 & 1.01\\end{pmatrix}',
            explanation: 'K_ij = exp(-|x_i - x_j|^2/2) + 0.01*δ_ij. E.g., k(-1,0) = exp(-0.5) ≈ 0.607.',
          },
          {
            step: 'Solve for weights α = K_y^{-1} y',
            formula: '\\boldsymbol{\\alpha} = K_y^{-1}[0.8, -0.2, 0.9]^T \\approx [0.76, -0.56, 0.83]',
            explanation: 'Solving the 3×3 linear system. These weights encode how each observation contributes to predictions.',
          },
          {
            step: 'Compute cross-kernel k_* at x*=0.5',
            formula: 'k_* = [k(0.5,-1), k(0.5,0), k(0.5,1)] = [e^{-1.125}, e^{-0.125}, e^{-0.125}] \\approx [0.324, 0.882, 0.882]',
            explanation: 'x*=0.5 is equidistant from 0 and 1, closer to them than to -1.',
          },
          {
            step: 'Posterior mean and variance',
            formula: '\\mu_*(0.5) = k_*^T\\alpha \\approx 0.76',
            explanation: 'Weighted interpolation between the observations. Variance: σ²*(0.5) = 1 - k*^T K_y^{-1} k* ≈ 0.08 (small — test point is between training points).',
          },
        ]}
      />

      <WarningBlock title="Numerical Issues in GP Inference">
        <ul className="space-y-2 text-sm">
          <li><strong>Ill-conditioned kernel matrix:</strong> For many closely-spaced points or large length scales, $K_{nn}$ becomes nearly singular. Add jitter: $K_y = K_{nn} + \sigma_n^2 I + \epsilon I$ with $\epsilon \sim 10^{-6}$. Cholesky factorization reveals ill-conditioning early.</li>
          <li><strong>Hyperparameter optimization local minima:</strong> The log marginal likelihood is non-convex. Use multiple restarts with random initializations (scikit-learn's n_restarts_optimizer). Log-transform $\ell$ and $\sigma_n$ for unconstrained optimization.</li>
          <li><strong>Extrapolation overconfidence:</strong> Far from training data, the posterior variance returns to the prior variance (k(x*,x*)) — never exceeds it. But the posterior mean can make confident-looking extrapolations that are physically unreasonable. Always visualize the uncertainty band, not just the mean.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={GP_POST_CODE}
        language="python"
        title="GP Posterior — scikit-learn and Manual Implementation"
        runnable
      />
    </div>
  );
}
