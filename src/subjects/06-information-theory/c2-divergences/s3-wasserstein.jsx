import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function WassersteinViz() {
  const [mu1, setMu1] = useState(0)
  const [sigma1, setSigma1] = useState(0.5)
  const [mu2, setMu2] = useState(2)
  const [sigma2, setSigma2] = useState(0.8)

  // W1 between two Gaussians: |mu1 - mu2| when sigmas are equal
  // For general Gaussians: W2^2 = |mu1-mu2|^2 + (sigma1 - sigma2)^2 (1D)
  const w1_approx = Math.abs(mu1 - mu2) + Math.abs(sigma1 - sigma2)  // crude 1D approx
  const w2_sq = (mu1 - mu2) ** 2 + (sigma1 - sigma2) ** 2

  // Discrete OT for illustration: two discrete distributions
  const N = 8
  const positions1 = useMemo(() => Array.from({ length: N }, (_, i) => mu1 + sigma1 * (i - N / 2 + 0.5) / (N / 4)), [mu1, sigma1])
  const positions2 = useMemo(() => Array.from({ length: N }, (_, i) => mu2 + sigma2 * (i - N / 2 + 0.5) / (N / 4)), [mu2, sigma2])

  const W = 480, H = 220
  const padL = 32, padR = 16, padT = 40, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xMin = Math.min(...positions1, ...positions2) - 1
  const xMax = Math.max(...positions1, ...positions2) + 1
  const xToSvg = x => padL + ((x - xMin) / (xMax - xMin)) * plotW
  const rowY1 = padT + 20, rowY2 = padT + plotH - 20

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">1D Optimal Transport Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Lines show the optimal transport plan: each mass unit in P (blue) is mapped to the corresponding unit in Q (red).
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">P: μ₁ = {mu1.toFixed(1)}</label>
          <input type="range" min="-2" max="2" step="0.1" value={mu1} onChange={e => setMu1(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">P: σ₁ = {sigma1.toFixed(2)}</label>
          <input type="range" min="0.2" max="1.5" step="0.05" value={sigma1} onChange={e => setSigma1(+e.target.value)} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-red-600">Q: μ₂ = {mu2.toFixed(1)}</label>
          <input type="range" min="-2" max="4" step="0.1" value={mu2} onChange={e => setMu2(+e.target.value)} className="w-full accent-red-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-red-600">Q: σ₂ = {sigma2.toFixed(2)}</label>
          <input type="range" min="0.2" max="1.5" step="0.05" value={sigma2} onChange={e => setSigma2(+e.target.value)} className="w-full accent-red-500" />
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <text x={padL} y={rowY1 - 10} fontSize="10" fill="#3b82f6">P (source)</text>
          <text x={padL} y={rowY2 + 18} fontSize="10" fill="#ef4444">Q (target)</text>
          <line x1={padL} y1={rowY1} x2={W - padR} y2={rowY1} stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.3} />
          <line x1={padL} y1={rowY2} x2={W - padR} y2={rowY2} stroke="#ef4444" strokeWidth={1} strokeOpacity={0.3} />
          {/* Transport plan: sort both, connect i-th quantile to i-th quantile */}
          {positions1.map((x1, i) => {
            const x2 = positions2[i]
            const dist = Math.abs(x1 - x2)
            const maxDist = Math.max(...positions1.map((x, j) => Math.abs(x - positions2[j])))
            const opacity = 0.2 + 0.6 * (dist / (maxDist || 1))
            return (
              <line
                key={i}
                x1={xToSvg(x1)} y1={rowY1}
                x2={xToSvg(x2)} y2={rowY2}
                stroke="#8b5cf6" strokeWidth={1.5}
                opacity={opacity}
              />
            )
          })}
          {positions1.map((x, i) => (
            <circle key={i} cx={xToSvg(x)} cy={rowY1} r={5} fill="#3b82f6" />
          ))}
          {positions2.map((x, i) => (
            <circle key={i} cx={xToSvg(x)} cy={rowY2} r={5} fill="#ef4444" />
          ))}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20">
          <div className="font-mono font-bold text-indigo-600">{Math.abs(mu1 - mu2).toFixed(4)}</div>
          <div className="text-gray-500">W₁ (same σ): |μ₁-μ₂|</div>
        </div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20">
          <div className="font-mono font-bold text-purple-600">{Math.sqrt(w2_sq).toFixed(4)}</div>
          <div className="text-gray-500">W₂ (1D Gaussian)</div>
        </div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy.stats import wasserstein_distance
from scipy.optimize import linprog

# 1D Wasserstein distance (exact via quantile matching)
from scipy.stats import norm

mu1, sigma1 = 0, 1
mu2, sigma2 = 2, 1.5

# Analytical W2 for Gaussians: sqrt(|mu1-mu2|^2 + (sigma1-sigma2)^2) in 1D
w2_analytical = np.sqrt((mu1 - mu2)**2 + (sigma1 - sigma2)**2)
print(f"W2 (Gaussian 1D, analytical): {w2_analytical:.4f}")

# Numerical via samples
np.random.seed(42)
n = 10000
samples1 = np.random.normal(mu1, sigma1, n)
samples2 = np.random.normal(mu2, sigma2, n)

# W1 = integral |F1^{-1}(u) - F2^{-1}(u)| du = mean |sorted_x - sorted_y|
s1_sorted = np.sort(samples1)
s2_sorted = np.sort(samples2)
w1_empirical = np.mean(np.abs(s1_sorted - s2_sorted))
print(f"W1 (empirical, n={n}): {w1_empirical:.4f}")

# scipy's wasserstein_distance
w1_scipy = wasserstein_distance(samples1[:1000], samples2[:1000])
print(f"W1 (scipy): {w1_scipy:.4f}")

# W1 for discrete distributions via LP
# scipy handles small cases
from scipy.stats import wasserstein_distance as wd
u_vals = [1, 2, 3, 4]
v_vals = [2, 3, 4, 5]
u_weights = [0.4, 0.3, 0.2, 0.1]
v_weights = [0.1, 0.2, 0.4, 0.3]
w1_discrete = wd(u_vals, v_vals, u_weights, v_weights)
print(f"\\nW1 (discrete): {w1_discrete:.4f}")

# POT library for 2D optimal transport
try:
    import ot
    X = np.random.randn(50, 2)
    Y = np.random.randn(50, 2) + np.array([2, 1])
    a, b = np.ones(50) / 50, np.ones(50) / 50
    M = ot.dist(X, Y)
    T = ot.emd(a, b, M)
    print(f"\\n2D OT cost (EMD): {np.sum(T * M):.4f}")
except ImportError:
    print("\\nInstall POT library for 2D optimal transport: pip install POT")
`

export default function WassersteinDistance() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Optimal Transport: Moving Mass Efficiently">
        <p>
          The Wasserstein distance (earth mover's distance) measures the minimum cost to
          transport the mass of distribution P to match distribution Q. Unlike KL divergence,
          it is well-defined even when distributions have disjoint supports, making it
          ideal for GAN training and domain adaptation.
        </p>
      </NoteBlock>

      <WassersteinViz />

      <DefinitionBlock
        title="Wasserstein-p Distance"
        definition="The Wasserstein-p distance between distributions $P$ and $Q$ on metric space $(\mathcal{X}, d)$ is: $W_p(P, Q) = \left(\inf_{\gamma \in \Pi(P,Q)} \int\!\!\int d(x,y)^p \, d\gamma(x,y)\right)^{1/p}$ where $\Pi(P,Q)$ is the set of joint distributions (couplings) with marginals $P$ and $Q$. Interpretation: find the 'transport plan' $\gamma$ that minimizes total cost, where cost of moving mass from $x$ to $y$ is $d(x,y)^p$."
        notation="$W_1$: earth mover's distance (EMD). $W_2$: Fréchet distance. For 1D distributions, $W_p(P,Q) = \|F_P^{-1} - F_Q^{-1}\|_{L^p} = (\int_0^1 |F_P^{-1}(u) - F_Q^{-1}(u)|^p du)^{1/p}$."
      />

      <DefinitionBlock
        title="Kantorovich-Rubinstein Duality (W₁)"
        definition="The Wasserstein-1 distance has the dual (Kantorovich) formulation: $W_1(P, Q) = \sup_{\|f\|_L \leq 1} \left|\mathbb{E}_P[f(X)] - \mathbb{E}_Q[f(X)]\right|$ where the supremum is over all 1-Lipschitz functions $f: \mathcal{X} \to \mathbb{R}$. This is the form used in Wasserstein GANs: the discriminator (critic) $f_\omega$ approximates the optimal 1-Lipschitz function."
        notation="Lipschitz constraint: $|f(x) - f(y)| \leq d(x,y)$. In WGANs, the critic is constrained via gradient penalty or weight clipping."
      />

      <TheoremBlock
        title="Wasserstein Distance Properties"
        statement="The Wasserstein-p distance is a true metric on the space of probability measures with finite p-th moment: (1) $W_p(P,Q) \geq 0$ with equality iff $P=Q$; (2) Symmetry: $W_p(P,Q) = W_p(Q,P)$; (3) Triangle inequality. Moreover, $W_p$ metrizes weak convergence: $P_n \xrightarrow{w} P$ iff $W_p(P_n, P) \to 0$ (under finite moment conditions). This is stronger than convergence in KL divergence."
        proof="(1,2) are immediate from the definition. Triangle inequality: for any three distributions $P,Q,R$ and optimal couplings $\gamma_{PQ}$, $\gamma_{QR}$, construct a coupling $\gamma_{PR}$ by 'gluing' via $Q$: $\gamma_{PR}(A\times C) = \int_\mathcal{X} \gamma_{PQ}(A|y)\gamma_{QR}(dy,C)$. By the triangle inequality for the ground metric $d$: $d(x,z) \leq d(x,y) + d(y,z)$. Taking expectations gives $W_p(P,R) \leq W_p(P,Q) + W_p(Q,R)$."
      />

      <ExampleBlock title="Fréchet Inception Distance (FID)">
        <p>
          FID measures GAN quality using the Wasserstein-2 distance between the distributions of
          Inception features of real and generated images. For Gaussian distributions:
        </p>
        <BlockMath math="\mathrm{FID} = \|\boldsymbol\mu_r - \boldsymbol\mu_g\|^2 + \mathrm{tr}(\Sigma_r + \Sigma_g - 2(\Sigma_r\Sigma_g)^{1/2})" />
        <p>
          This is exactly <InlineMath math="W_2^2" /> between two multivariate Gaussians,
          providing a principled metric for image generation quality.
        </p>
      </ExampleBlock>

      <WarningBlock title="Computational Cost of Wasserstein Distance">
        <p>
          Exact Wasserstein computation via linear programming requires <InlineMath math="O(n^3\log n)" />
          time for <InlineMath math="n" /> discrete samples — prohibitively expensive in ML.
          Practical approximations include: (1) Sinkhorn algorithm (entropic regularization):
          <InlineMath math="O(n^2/\varepsilon^2)" />; (2) Sliced Wasserstein (random 1D projections);
          (3) 1D quantile-based computation when distributions live on a line. WGANs implicitly
          optimize a lower bound via the Kantorovich dual.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
