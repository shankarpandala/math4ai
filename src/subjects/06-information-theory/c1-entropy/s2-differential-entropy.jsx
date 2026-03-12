import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function DifferentialEntropyViz() {
  const [sigma, setSigma] = useState(1.0)

  const hGaussian = 0.5 * Math.log(2 * Math.PI * Math.E * sigma * sigma)
  const hUniform = Math.log(sigma * 2 * Math.sqrt(3))  // Uniform[-sqrt(3)*sigma, sqrt(3)*sigma] has same variance

  const data = useMemo(() => {
    const pts = []
    for (let s = 0.1; s <= 5; s += 0.05) {
      pts.push({
        s: parseFloat(s.toFixed(2)),
        h: 0.5 * Math.log(2 * Math.PI * Math.E * s * s),
      })
    }
    return pts
  }, [])

  const W = 480, H = 200
  const padL = 40, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const minH = data[0].h, maxH = data[data.length - 1].h
  const range = maxH - minH

  const xToSvg = s => padL + ((s - 0.1) / 4.9) * plotW
  const yToSvg = h => padT + plotH - ((h - minH) / range) * plotH

  const curvePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.s).toFixed(1)},${yToSvg(d.h).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Gaussian Differential Entropy vs Variance</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="h(\mathcal{N}(0,\sigma^2)) = \frac{1}{2}\ln(2\pi e\sigma^2)" /> — entropy grows logarithmically with σ.
      </p>
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Standard deviation σ = {sigma.toFixed(2)}</label>
        <input type="range" min="0.1" max="5" step="0.05" value={sigma} onChange={e => setSigma(+e.target.value)} className="w-full accent-indigo-600" />
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[1, 2, 3, 4, 5].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">σ</text>
          <text x={padL - 30} y={padT + plotH / 2} textAnchor="middle" fontSize="10" fill="#6b7280" transform={`rotate(-90, ${padL - 30}, ${padT + plotH / 2})`}>h (nats)</text>
          {/* h=0 reference line */}
          {minH < 0 && maxH > 0 && <line x1={padL} y1={yToSvg(0)} x2={W - padR} y2={yToSvg(0)} stroke="#6b7280" strokeWidth={1} strokeDasharray="3 3" />}
          <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
          {/* Current sigma marker */}
          <circle cx={xToSvg(sigma)} cy={yToSvg(hGaussian)} r={5} fill="#ef4444" />
          <line x1={xToSvg(sigma)} y1={padT} x2={xToSvg(sigma)} y2={padT + plotH} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
          <text x={xToSvg(sigma) + 6} y={yToSvg(hGaussian) - 6} fontSize="9" fill="#ef4444">{hGaussian.toFixed(3)}</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{hGaussian.toFixed(4)}</div><div className="text-gray-500">h(Gaussian) nats</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{(hGaussian / Math.log(2)).toFixed(4)}</div><div className="text-gray-500">h(Gaussian) bits</div></div>
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20"><div className="font-mono font-bold text-purple-600">{(sigma * sigma).toFixed(3)}</div><div className="text-gray-500">Variance σ²</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

# Differential entropy of continuous distributions
sigma = 2.0

# Gaussian: h = 0.5 * log(2*pi*e*sigma^2)
h_gaussian = 0.5 * np.log(2 * np.pi * np.e * sigma**2)
print(f"Gaussian N(0, {sigma}^2): h = {h_gaussian:.4f} nats = {h_gaussian/np.log(2):.4f} bits")

# Laplace(0, b): h = 1 + log(2b)
b = sigma / np.sqrt(2)   # same variance
h_laplace = 1 + np.log(2 * b)
print(f"Laplace(0, {b:.4f}):       h = {h_laplace:.4f} nats")

# Uniform(-a, a): h = log(2a)
a = sigma * np.sqrt(3)  # same variance
h_uniform = np.log(2 * a)
print(f"Uniform(-{a:.4f}, {a:.4f}): h = {h_uniform:.4f} nats")

print(f"\\nGaussian has highest entropy for fixed variance: {h_gaussian:.4f} > Laplace: {h_laplace:.4f} > ?")

# Numerical approximation of differential entropy via MC
rng = np.random.default_rng(42)
for dist_name, samples in [
    ("Gaussian", rng.normal(0, sigma, 100000)),
    ("Laplace",  rng.laplace(0, b, 100000)),
    ("Uniform",  rng.uniform(-a, a, 100000)),
]:
    # KDE-based entropy estimate
    kde = stats.gaussian_kde(samples)
    x_grid = np.linspace(samples.min(), samples.max(), 1000)
    logp = np.log(np.maximum(kde(x_grid), 1e-15))
    h_mc = -np.trapz(kde(x_grid) * logp, x_grid)
    print(f"{dist_name:12s}: h ≈ {h_mc:.4f} nats (numerical)")

# Maximum entropy: Gaussian maximizes h for fixed variance
print("\\nMax entropy theorem: N(0, sigma^2) maximizes h over all")
print("distributions with mean 0 and variance sigma^2.")
`

export default function DifferentialEntropy() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Continuous Information Theory">
        <p>
          Differential entropy extends Shannon's discrete entropy to continuous distributions.
          Unlike discrete entropy, differential entropy can be negative and is not invariant
          under coordinate transformations. Despite these quirks, it plays a central role in
          source coding, maximum entropy modeling, and the information bottleneck.
        </p>
      </NoteBlock>

      <DifferentialEntropyViz />

      <DefinitionBlock
        title="Differential Entropy"
        definition="For a continuous random variable $X$ with density $f(x)$, the differential entropy is: $h(X) = -\int_{-\infty}^{\infty} f(x) \log f(x) \, dx = -\mathbb{E}[\log f(X)]$. Using natural log gives nats; log base 2 gives bits. Unlike discrete entropy, $h(X)$ can be negative (e.g., $h(\mathcal{U}[0, \epsilon]) = \log\epsilon < 0$ for $\epsilon < 1$)."
        notation="The joint differential entropy: $h(X,Y) = -\int\!\!\int f(x,y)\log f(x,y)\,dx\,dy$. Conditional: $h(Y|X) = h(X,Y) - h(X) \geq 0$ always holds."
      />

      <DefinitionBlock
        title="Maximum Entropy Distributions"
        definition="Among all continuous distributions satisfying given moment constraints, the maximum entropy distribution is: (1) No constraint: uniform on the support. (2) Fixed variance $\sigma^2$: Gaussian $\mathcal{N}(\mu, \sigma^2)$ with $h = \frac{1}{2}\log(2\pi e\sigma^2)$. (3) Positive support, fixed mean: Exponential. (4) Support $[a,b]$: Uniform$[a,b]$. These arise via Lagrangian optimization."
        notation="Maximum entropy principle: choose the distribution that is 'least informative' (highest entropy) subject to known constraints. This is the principle behind Jaynes' MaxEnt framework."
      />

      <TheoremBlock
        title="Gaussian Maximizes Entropy for Fixed Variance"
        statement="Among all distributions on $\mathbb{R}$ with mean $\mu$ and variance $\sigma^2$, the Gaussian $\mathcal{N}(\mu, \sigma^2)$ uniquely maximizes differential entropy: $h(X) \leq \frac{1}{2}\log(2\pi e \sigma^2)$ with equality iff $X \sim \mathcal{N}(\mu, \sigma^2)$."
        proof="For any density $f$ with variance $\sigma^2$, use the non-negativity of KL divergence: $D_{KL}(f \| \phi) \geq 0$ where $\phi = \mathcal{N}(\mu, \sigma^2)$. Expanding: $\int f \log(f/\phi) \geq 0 \Rightarrow -\int f\log f \leq -\int f\log\phi = \frac{1}{2}\log(2\pi\sigma^2) + \frac{1}{2}$ (using $\mathbb{E}_f[(X-\mu)^2/\sigma^2] = 1$). Thus $h(f) \leq \frac{1}{2}\log(2\pi e\sigma^2) = h(\phi)$, with equality iff $f = \phi$."
      />

      <ExampleBlock title="Differential Entropy Under Linear Transformations">
        <p>
          If <InlineMath math="Y = aX + b" />, then <InlineMath math="h(Y) = h(X) + \log|a|" />.
          More generally, for an invertible linear map <InlineMath math="\mathbf{Y} = A\mathbf{X}" />:
        </p>
        <BlockMath math="h(\mathbf{Y}) = h(\mathbf{X}) + \log|\det(A)|" />
        <p>
          This is why normalizing flows (invertible neural networks) can compute exact likelihoods:
          the Jacobian determinant tracks the entropy change under the transformation, enabling
          exact density evaluation via the change-of-variables formula.
        </p>
      </ExampleBlock>

      <WarningBlock title="Differential Entropy is NOT Invariant">
        <p>
          Unlike discrete entropy, differential entropy changes under nonlinear transformations
          and can be negative. It does NOT measure "uncertainty" in an absolute sense —
          only relative entropy (KL divergence) and mutual information are invariant and
          have operational meaning as bits of information. For practical applications,
          prefer mutual information over differential entropy when possible.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
