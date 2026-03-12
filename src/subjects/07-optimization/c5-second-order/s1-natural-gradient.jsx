import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Visualize Fisher information ellipse vs Euclidean ball
// Fisher matrix F = [[a, c],[c, b]] defines the metric
// The natural gradient step goes in direction F^{-1} g
// The Euclidean ball is a circle; Fisher ellipse is F^{-1} applied to sphere

function InteractiveFisherEllipse() {
  const [fDiag1, setFDiag1] = useState(4.0); // F_11
  const [fDiag2, setFDiag2] = useState(1.0); // F_22
  const [fOff, setFOff] = useState(0.5);     // F_12 (symmetric)

  // For visualization, use 2x2 Fisher F = [[f11, f12],[f12, f22]]
  // Natural gradient direction: F^{-1} g where g = [1, 0.5] (arbitrary)
  const g = [1.0, 0.5];
  const f11 = fDiag1, f22 = fDiag2;
  const f12 = Math.min(fOff, Math.sqrt(f11 * f22) * 0.9); // keep PD
  const det = f11 * f22 - f12 * f12;
  const detSafe = det < 1e-6 ? 1e-6 : det;

  // F^{-1} = (1/det) [[f22, -f12],[-f12, f11]]
  const ng = [
    (f22 * g[0] - f12 * g[1]) / detSafe,
    (-f12 * g[0] + f11 * g[1]) / detSafe,
  ];

  const W = 380, H = 280, CX = 190, CY = 140;
  const SCALE = 60;

  // Draw Fisher ellipse: x^T F x = 1
  // Eigendecompose F numerically for drawing
  const trace = f11 + f22;
  const discrim = Math.sqrt(Math.max(0, ((f11 - f22) / 2) ** 2 + f12 * f12));
  const lam1 = trace / 2 + discrim;
  const lam2 = trace / 2 - discrim;
  const lam2Safe = Math.max(lam2, 1e-6);

  // Eigenvectors
  let v1, v2;
  if (Math.abs(f12) < 1e-9) {
    v1 = [1, 0]; v2 = [0, 1];
  } else {
    const n1 = Math.sqrt((lam1 - f22) ** 2 + f12 * f12);
    v1 = [(lam1 - f22) / n1, f12 / n1];
    const n2 = Math.sqrt((lam2Safe - f22) ** 2 + f12 * f12);
    v2 = [(lam2Safe - f22) / n2, f12 / n2];
  }

  // Semi-axes of ellipse x^T F x <= 1: a = 1/sqrt(lam1), b = 1/sqrt(lam2)
  const a = 1 / Math.sqrt(lam1);
  const b = 1 / Math.sqrt(lam2Safe);

  const ellipsePts = Array.from({ length: 120 }, (_, i) => {
    const theta = (i / 120) * 2 * Math.PI;
    const dx = a * Math.cos(theta) * v1[0] + b * Math.sin(theta) * v2[0];
    const dy = a * Math.cos(theta) * v1[1] + b * Math.sin(theta) * v2[1];
    return `${CX + dx * SCALE},${CY - dy * SCALE}`;
  }).join(' ');

  // Euclidean ball circle: radius 1
  const circlePts = Array.from({ length: 100 }, (_, i) => {
    const theta = (i / 100) * 2 * Math.PI;
    return `${CX + Math.cos(theta) * SCALE},${CY - Math.sin(theta) * SCALE}`;
  }).join(' ');

  // Draw gradient g and natural gradient ng
  const gNorm = Math.sqrt(g[0] ** 2 + g[1] ** 2);
  const ngNorm = Math.sqrt(ng[0] ** 2 + ng[1] ** 2);
  const gScale = 70 / gNorm;
  const ngScale = 70 / Math.max(ngNorm, 0.01);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Fisher Ellipse vs Euclidean Ball</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        The Fisher information matrix defines an ellipsoidal metric (green). The natural gradient
        (orange) is the steepest descent in Fisher geometry; the Euclidean gradient (blue) is in
        <InlineMath math="\ell_2" /> geometry.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD || 0} y1={CY} x2={W} y2={CY} stroke="#e5e7eb" strokeWidth="1" />
          <line x1={CX} y1={0} x2={CX} y2={H} stroke="#e5e7eb" strokeWidth="1" />
          {/* Euclidean ball */}
          <polyline points={circlePts} fill="#dbeafe" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
          <text x={CX + SCALE + 4} y={CY - 4} fontSize="10" fill="#1d4ed8">‖x‖=1</text>
          {/* Fisher ellipse */}
          <polyline points={ellipsePts} fill="#d1fae5" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
          <text x={CX + 4} y={CY - a * SCALE - 6} fontSize="10" fill="#065f46">Fisher unit ball</text>
          {/* Euclidean gradient g */}
          <defs>
            <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
            </marker>
          </defs>
          <line x1={CX} y1={CY} x2={CX + g[0] * gScale} y2={CY - g[1] * gScale} stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrowBlue)" />
          <text x={CX + g[0] * gScale + 4} y={CY - g[1] * gScale} fontSize="11" fill="#1d4ed8">g (Euclidean)</text>
          {/* Natural gradient */}
          <line x1={CX} y1={CY} x2={CX + ng[0] * ngScale} y2={CY - ng[1] * ngScale} stroke="#f97316" strokeWidth="2.5" markerEnd="url(#arrowOrange)" />
          <text x={CX + ng[0] * ngScale + 4} y={CY - ng[1] * ngScale - 6} fontSize="11" fill="#c2410c">F⁻¹g (natural)</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`F_{11} = ${fDiag1.toFixed(1)}`} />
            </label>
            <input type="range" min="0.5" max="8" step="0.5" value={fDiag1} onChange={e => setFDiag1(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`F_{22} = ${fDiag2.toFixed(1)}`} />
            </label>
            <input type="range" min="0.5" max="8" step="0.5" value={fDiag2} onChange={e => setFDiag2(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <InlineMath math={`F_{12} = ${f12.toFixed(2)}`} />
            </label>
            <input type="range" min="0" max="1.5" step="0.1" value={fOff} onChange={e => setFOff(+e.target.value)} className="w-full" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            High <InlineMath math="F_{11}" /> → compressed in x₁ direction<br />
            Natural gradient accounts for curvature of the parameter space
          </p>
        </div>
      </div>
    </div>
  );
}

const PAD = 30;

export default function NaturalGradient() {
  return (
    <div className="space-y-8">
      <InteractiveFisherEllipse />

      <DefinitionBlock title="Fisher Information Matrix">
        <p>
          For a probabilistic model <InlineMath math="p_\theta(x)" /> parameterized by
          <InlineMath math="\theta \in \mathbb{R}^d" />, the <strong>Fisher information matrix</strong> is
        </p>
        <BlockMath math="F(\theta) = \mathbb{E}_{x \sim p_\theta}\!\left[\nabla_\theta \log p_\theta(x)\; \nabla_\theta \log p_\theta(x)^\top\right]." />
        <p className="mt-2">
          Equivalently, <InlineMath math="F(\theta) = -\mathbb{E}[\nabla^2_\theta \log p_\theta(x)]" />
          (expected negative Hessian of the log-likelihood). <InlineMath math="F" /> is always
          positive semidefinite.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Natural Gradient">
        <p>
          The <strong>natural gradient</strong> is the direction of steepest ascent in the
          Riemannian metric induced by the Fisher information:
        </p>
        <BlockMath math="\tilde{\nabla} f(\theta) = F(\theta)^{-1} \nabla f(\theta)." />
        <p className="mt-2">
          The <strong>natural gradient descent</strong> update is:
        </p>
        <BlockMath math="\theta_{t+1} = \theta_t - \eta F(\theta_t)^{-1} \nabla_\theta \mathcal{L}(\theta_t)." />
        <p className="mt-2">
          This is invariant to reparameterization of the model, unlike ordinary gradient descent.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Natural Gradient as KL-Proximal Method"
        proof="The natural gradient direction solves the constrained problem: min_Δ ∇f(θ)⊤Δ s.t. ΔΘ⊤F(θ)Δθ ≤ ε (trust region in Fisher metric). The constraint ΔΘ⊤F Δθ ≤ ε is the second-order approximation to D_KL(p_{θ+Δθ} || p_θ) ≤ ε. Taking the Lagrangian and solving gives Δθ = -η F⁻¹∇f(θ)."
      >
        <p>
          The natural gradient direction is the solution to the <em>proximal</em> problem:
        </p>
        <BlockMath math="\tilde{\nabla} f(\theta) = \underset{\Delta\theta}{\arg\min}\; \nabla f(\theta)^\top \Delta\theta + \frac{1}{2\eta} \Delta\theta^\top F(\theta) \Delta\theta," />
        <p className="mt-2">
          where the quadratic regularizer <InlineMath math="\Delta\theta^\top F(\theta) \Delta\theta" />
          approximates <InlineMath math="2 D_\mathrm{KL}(p_{\theta + \Delta\theta} \| p_\theta)" />.
          Thus NGD constrains steps to have small KL divergence, not small Euclidean norm.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Fisher-Rao Metric and Reparameterization Invariance"
        proof="Under a smooth reparameterization φ = h(θ), the Fisher matrix transforms as F_φ = J_h^{-T} F_θ J_h^{-1} where J_h is the Jacobian of h. The natural gradient transforms as ∇̃_φ f = J_h ∇̃_θ f, so the natural gradient direction is covariant: it transforms as a vector, meaning the update trajectory is geometry-invariant."
      >
        <p>
          Natural gradient descent is <strong>reparameterization invariant</strong>: if
          <InlineMath math="\phi = h(\theta)" /> is a smooth bijection, then running NGD in
          <InlineMath math="\theta" /> or in <InlineMath math="\phi" /> produces the same
          optimization trajectory (up to the reparameterization).
          Ordinary gradient descent does not have this property.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Natural Gradient for Gaussian Distribution">
        <p>
          For a Gaussian <InlineMath math="p_\theta = \mathcal{N}(\mu, \sigma^2)" /> parameterized by
          <InlineMath math="\theta = (\mu, \log\sigma)" />, the Fisher matrix is diagonal:
        </p>
        <BlockMath math="F(\mu, \log\sigma) = \begin{pmatrix} 1/\sigma^2 & 0 \\ 0 & 2 \end{pmatrix}." />
        <p className="mt-2">
          The natural gradient of a loss <InlineMath math="\mathcal{L}" /> scales the gradient by
          <InlineMath math="\sigma^2" /> in the mean direction — larger variance → larger
          natural gradient step in mean space. This captures that small changes in <InlineMath math="\mu" />
          matter more when <InlineMath math="\sigma" /> is small.
        </p>
      </ExampleBlock>

      <WarningBlock title="Fisher Matrix Inversion is Expensive">
        <p>
          Computing and inverting <InlineMath math="F(\theta) \in \mathbb{R}^{d \times d}" /> costs
          <InlineMath math="O(d^3)" /> for a network with <InlineMath math="d" /> parameters. For
          modern networks with <InlineMath math="d \sim 10^8" /> parameters, this is completely
          infeasible. Practical approximations include diagonal Fisher (AdaGrad-style),
          block-diagonal Fisher (K-FAC), and low-rank approximations (EK-FAC).
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

# Natural gradient descent for 2-parameter Gaussian MLE
# Model: p(x|mu, sigma) = N(mu, sigma^2)
# Parameterization: theta = (mu, log_sigma)

rng = np.random.default_rng(42)
data = rng.normal(2.0, 1.5, size=100)  # true mu=2, sigma=1.5

def log_likelihood(theta, X):
    mu, log_sigma = theta
    sigma = np.exp(log_sigma)
    return -0.5 * np.sum((X - mu)**2) / sigma**2 - len(X) * log_sigma

def grad_ll(theta, X):
    mu, log_sigma = theta
    sigma = np.exp(log_sigma)
    d_mu = np.sum(X - mu) / sigma**2
    d_logsig = np.sum((X - mu)**2) / sigma**2 - len(X)
    return np.array([d_mu, d_logsig])

def fisher_matrix(theta):
    """Fisher info for Gaussian N(mu, exp(log_sigma)^2)."""
    _, log_sigma = theta
    sigma2 = np.exp(2 * log_sigma)
    return np.diag([1/sigma2, 2.0])

# Natural gradient ascent (maximize log-likelihood)
theta = np.array([0.0, 0.0])  # start at mu=0, log_sigma=0
lr_ng = 0.1
lr_gd = 0.001

print("Natural Gradient vs Gradient Ascent for Gaussian MLE:")
print(f"{'Iter':>5}  {'NG mu':>8}  {'NG sigma':>10}  {'GD mu':>8}  {'GD sigma':>10}")

theta_ng = theta.copy()
theta_gd = theta.copy()

for t in range(5):
    g_ng = grad_ll(theta_ng, data)
    F = fisher_matrix(theta_ng)
    ng = np.linalg.solve(F, g_ng)  # F^{-1} g
    theta_ng = theta_ng + lr_ng * ng

    g_gd = grad_ll(theta_gd, data)
    theta_gd = theta_gd + lr_gd * g_gd

    print(f"{t+1:>5}  {theta_ng[0]:>8.4f}  {np.exp(theta_ng[1]):>10.4f}  "
          f"{theta_gd[0]:>8.4f}  {np.exp(theta_gd[1]):>10.4f}")

print(f"\\nTrue values: mu={data.mean():.4f}, sigma={data.std():.4f}")
`} />
    </div>
  );
}
