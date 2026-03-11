import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'
import ReferenceList from '../../../components/content/ReferenceList.jsx'
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx'

function normalPdf(x, mu, sigma) {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

function klGaussian(mu1, sigma1, mu2, sigma2) {
  // KL(N(mu1,sigma1^2) || N(mu2,sigma2^2))
  return (
    Math.log(sigma2 / sigma1) +
    (sigma1 * sigma1 + (mu1 - mu2) * (mu1 - mu2)) / (2 * sigma2 * sigma2) -
    0.5
  )
}

function KLViz() {
  const [mu1, setMu1] = useState(0)
  const [sigma1, setSigma1] = useState(1)
  const [mu2, setMu2] = useState(2)
  const [sigma2, setSigma2] = useState(1.5)

  const data = useMemo(() => {
    const points = []
    for (let x = -6; x <= 8; x += 0.15) {
      points.push({
        x: parseFloat(x.toFixed(2)),
        p: parseFloat(normalPdf(x, mu1, sigma1).toFixed(5)),
        q: parseFloat(normalPdf(x, mu2, sigma2).toFixed(5)),
      })
    }
    return points
  }, [mu1, sigma1, mu2, sigma2])

  const klPQ = klGaussian(mu1, sigma1, mu2, sigma2)
  const klQP = klGaussian(mu2, sigma2, mu1, sigma1)

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
        Interactive KL Divergence: Two Gaussians
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust the two distributions and observe how KL divergence is asymmetric: <InlineMath math="D_{KL}(P\|Q) \neq D_{KL}(Q\|P)" />.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Distribution P (blue)</h4>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">μ₁ = {mu1.toFixed(1)}</label>
            <input type="range" min="-4" max="4" step="0.1" value={mu1} onChange={e => setMu1(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">σ₁ = {sigma1.toFixed(1)}</label>
            <input type="range" min="0.3" max="3" step="0.1" value={sigma1} onChange={e => setSigma1(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Distribution Q (red)</h4>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">μ₂ = {mu2.toFixed(1)}</label>
            <input type="range" min="-4" max="4" step="0.1" value={mu2} onChange={e => setMu2(parseFloat(e.target.value))} className="w-full accent-rose-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">σ₂ = {sigma2.toFixed(1)}</label>
            <input type="range" min="0.3" max="3" step="0.1" value={sigma2} onChange={e => setSigma2(parseFloat(e.target.value))} className="w-full accent-rose-500" />
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="x" domain={[-6, 8]} tickCount={8} />
          <YAxis domain={[0, 'auto']} />
          <Tooltip formatter={v => v.toFixed(4)} />
          <Legend />
          <Line type="monotone" dataKey="p" stroke="#6366f1" strokeWidth={2.5} dot={false} name="P = N(μ₁,σ₁²)" />
          <Line type="monotone" dataKey="q" stroke="#f43f5e" strokeWidth={2.5} dot={false} name="Q = N(μ₂,σ₂²)" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Forward KL</div>
          <div className="mt-1 font-mono text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {klPQ.toFixed(4)}
          </div>
          <div className="mt-0.5 text-xs text-indigo-500 dark:text-indigo-400">
            <InlineMath math="D_{KL}(P \| Q)" /> nats
          </div>
        </div>
        <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Reverse KL</div>
          <div className="mt-1 font-mono text-2xl font-bold text-rose-700 dark:text-rose-300">
            {klQP.toFixed(4)}
          </div>
          <div className="mt-0.5 text-xs text-rose-500 dark:text-rose-400">
            <InlineMath math="D_{KL}(Q \| P)" /> nats
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-gray-400">
        {Math.abs(klPQ - klQP) > 0.001
          ? `Asymmetry: |D(P‖Q) - D(Q‖P)| = ${Math.abs(klPQ - klQP).toFixed(4)}`
          : 'Distributions are equal — KL = 0'}
      </p>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

# KL divergence between two discrete distributions
def kl_divergence(p, q, eps=1e-12):
    """D_KL(P || Q) = sum p(x) log(p(x)/q(x))"""
    p, q = np.asarray(p, float), np.asarray(q, float)
    # Clip to avoid log(0)
    q = np.clip(q, eps, None)
    mask = p > 0
    return np.sum(p[mask] * np.log(p[mask] / q[mask]))

# Example: coin flip distributions
P = np.array([0.7, 0.3])   # biased coin
Q = np.array([0.5, 0.5])   # fair coin

print(f"D_KL(P‖Q) = {kl_divergence(P, Q):.4f} nats")
print(f"D_KL(Q‖P) = {kl_divergence(Q, P):.4f} nats")
print(f"KL is asymmetric: {kl_divergence(P,Q):.4f} ≠ {kl_divergence(Q,P):.4f}")

# KL divergence between two Gaussians (closed form)
def kl_gaussian(mu1, sigma1, mu2, sigma2):
    """D_KL(N(mu1,sigma1^2) || N(mu2,sigma2^2))"""
    return (
        np.log(sigma2/sigma1)
        + (sigma1**2 + (mu1-mu2)**2) / (2 * sigma2**2)
        - 0.5
    )

print(f"\\nD_KL(N(0,1) ‖ N(2,1)) = {kl_gaussian(0,1,2,1):.4f} nats")
print(f"D_KL(N(0,1) ‖ N(0,1)) = {kl_gaussian(0,1,0,1):.4f} (same dist)")

# Cross-entropy loss = H(y) + D_KL(y_true || y_pred)
# In classification, H(y_true) is constant → minimize KL ≡ minimize cross-entropy
def cross_entropy(y_true, y_pred, eps=1e-12):
    y_pred = np.clip(y_pred, eps, 1)
    return -np.sum(y_true * np.log(y_pred))

y_true = np.array([0, 1, 0])  # one-hot label
y_pred = np.array([0.1, 0.8, 0.1])  # softmax output
print(f"\\nCross-entropy loss: {cross_entropy(y_true, y_pred):.4f}")
print(f"= Entropy + KL = {stats.entropy(y_true+1e-12):.4f} + {kl_divergence(y_true+1e-12, y_pred):.4f}")

# PyTorch KL divergence
# import torch, torch.nn.functional as F
# kl = F.kl_div(q.log(), p, reduction='sum')  # note: reversed convention!`

const REFERENCES = [
  {
    type: 'foundational_paper',
    author: 'Kullback, S. & Leibler, R. A.',
    year: 1951,
    title: 'On information and sufficiency',
    venue: 'Annals of Mathematical Statistics, 22(1), 79–86',
    note: 'The original paper introducing KL divergence.',
  },
  {
    type: 'textbook',
    author: 'Cover, T. M. & Thomas, J. A.',
    year: 2006,
    title: 'Elements of Information Theory (2nd ed.)',
    venue: 'Wiley-Interscience',
    note: 'The standard reference for information theory.',
  },
  {
    type: 'paper',
    author: 'Kingma, D. P. & Welling, M.',
    year: 2014,
    title: 'Auto-Encoding Variational Bayes',
    venue: 'ICLR 2014',
    url: 'https://arxiv.org/abs/1312.6114',
    note: 'Uses KL divergence as regularization in the ELBO objective.',
  },
  {
    type: 'textbook',
    author: 'Goodfellow, I., Bengio, Y. & Courville, A.',
    year: 2016,
    title: 'Deep Learning',
    venue: 'MIT Press',
    url: 'https://www.deeplearningbook.org/',
  },
]

export default function KLDivergence() {
  return (
    <div className="prose-math">
      <NoteBlock type="historical" title="Historical Context">
        <p>
          The Kullback-Leibler divergence was introduced by Solomon Kullback and Richard Leibler
          in 1951, motivated by the problem of measuring information loss in statistical inference.
          Kullback developed the concept from Shannon's 1948 work on entropy. In the deep learning
          era, KL divergence appears everywhere: as the regularization term in VAEs (ELBO = reconstruction
          loss − KL), as the objective being minimized in maximum likelihood estimation, and as the
          theoretical justification for cross-entropy loss in classification.
        </p>
      </NoteBlock>

      <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        The KL divergence (also called relative entropy) measures how much one probability
        distribution differs from a reference distribution. It is foundational to information
        theory, Bayesian inference, and the training of virtually every modern generative model.
      </p>

      <DefinitionBlock
        label="Definition"
        title="Kullback-Leibler Divergence"
        definition="For probability distributions $P$ and $Q$ over the same space $\mathcal{X}$, the KL divergence from $Q$ to $P$ is: $D_{KL}(P \| Q) = \sum_{x \in \mathcal{X}} P(x) \log \frac{P(x)}{Q(x)} = \mathbb{E}_{x \sim P}\!\left[\log \frac{P(x)}{Q(x)}\right]$ (discrete case). For continuous distributions: $D_{KL}(P \| Q) = \int p(x) \log \frac{p(x)}{q(x)}\,dx$."
        notation="Also written $KL(P \| Q)$. The convention $0 \log 0 = 0$ and $a \log(a/0) = +\infty$ for $a > 0$ applies."
      />

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Interactive Visualization</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Drag the sliders to adjust two Gaussian distributions. Notice that KL divergence is
        not symmetric — the "direction" matters.
      </p>

      <KLViz />

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Key Properties</h2>

      <TheoremBlock
        label="Theorem"
        title="Gibbs' Inequality (Non-negativity)"
        statement="For any distributions $P$ and $Q$: $D_{KL}(P \| Q) \geq 0$, with equality if and only if $P = Q$ almost everywhere."
        proof="By Jensen's inequality applied to the convex function $f(t) = -\log t$: $D_{KL}(P\|Q) = \mathbb{E}_P\!\left[\log\frac{P}{Q}\right] = -\mathbb{E}_P\!\left[\log\frac{Q}{P}\right] \geq -\log\mathbb{E}_P\!\left[\frac{Q}{P}\right] = -\log\int Q = -\log 1 = 0$. Equality holds iff $Q/P$ is constant, i.e., $P = Q$."
      />

      <TheoremBlock
        label="Theorem"
        title="Chain Rule for KL Divergence"
        statement="$D_{KL}(P(X,Y) \| Q(X,Y)) = D_{KL}(P(X) \| Q(X)) + \mathbb{E}_{x \sim P(X)}\!\left[D_{KL}(P(Y|X=x) \| Q(Y|X=x))\right]$"
        proof="Expand $D_{KL}(P(X,Y) \| Q(X,Y)) = \mathbb{E}_{P(X,Y)}[\log P(X,Y)/Q(X,Y)]$, then factor $P(X,Y) = P(X)P(Y|X)$ and $Q(X,Y) = Q(X)Q(Y|X)$ and split the log."
      />

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Closed Form for Gaussians</h2>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        A key result used in VAE training — the KL divergence between two univariate Gaussians:
      </p>
      <BlockMath math="D_{KL}\!\left(\mathcal{N}(\mu_1, \sigma_1^2) \| \mathcal{N}(\mu_2, \sigma_2^2)\right) = \log\frac{\sigma_2}{\sigma_1} + \frac{\sigma_1^2 + (\mu_1-\mu_2)^2}{2\sigma_2^2} - \frac{1}{2}" />
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        When the reference is the standard normal <InlineMath math="Q = \mathcal{N}(0,1)" />:
      </p>
      <BlockMath math="D_{KL}\!\left(\mathcal{N}(\mu, \sigma^2) \| \mathcal{N}(0,1)\right) = \frac{1}{2}\left(\mu^2 + \sigma^2 - \log\sigma^2 - 1\right)" />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        This is the exact term used in the VAE ELBO: <InlineMath math="\mathcal{L} = \mathbb{E}_{q}[\log p(x|z)] - D_{KL}(q(z|x) \| p(z))" />.
      </p>

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Forward vs Reverse KL</h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/20">
          <h4 className="mb-2 font-semibold text-indigo-700 dark:text-indigo-300">Forward KL: <InlineMath math="D_{KL}(P \| Q)" /></h4>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• <strong>Mean-seeking:</strong> <InlineMath math="Q" /> must cover all mass of <InlineMath math="P" /></li>
            <li>• If <InlineMath math="P(x) > 0" /> but <InlineMath math="Q(x) = 0" />: infinite KL</li>
            <li>• Used in: MLE (minimizing log-likelihood)</li>
            <li>• Results in overdispersed approximations</li>
          </ul>
        </div>
        <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/20">
          <h4 className="mb-2 font-semibold text-rose-700 dark:text-rose-300">Reverse KL: <InlineMath math="D_{KL}(Q \| P)" /></h4>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• <strong>Mode-seeking:</strong> <InlineMath math="Q" /> concentrates on one mode of <InlineMath math="P" /></li>
            <li>• Used in: variational inference (ELBO maximization)</li>
            <li>• Results in underdispersed approximations</li>
            <li>• If <InlineMath math="Q(x) > 0" /> but <InlineMath math="P(x) = 0" />: infinite KL</li>
          </ul>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Connection to Cross-Entropy Loss</h2>

      <ExampleBlock title="Why Cross-Entropy = KL Divergence (up to a constant)">
        <p>In classification, we minimize the cross-entropy loss:</p>
        <BlockMath math="\mathcal{L} = -\sum_i y_i \log \hat{y}_i = H(y) + D_{KL}(y \| \hat{y})" />
        <p className="mt-2">
          Since the true labels <InlineMath math="y" /> are fixed (one-hot), <InlineMath math="H(y) = 0" />.
          Therefore minimizing cross-entropy is identical to minimizing the KL divergence from the
          true label distribution to the predicted distribution:
        </p>
        <BlockMath math="\arg\min_\theta H(y, \hat{y}_\theta) = \arg\min_\theta D_{KL}(y \| \hat{y}_\theta)" />
        <p className="mt-2 text-sm text-gray-500">
          This gives the theoretical justification for using cross-entropy loss in neural network training.
        </p>
      </ExampleBlock>

      <PythonCode title="KL Divergence: Implementation & Applications" code={PYTHON_CODE} />

      <WarningBlock title="Common Mistakes & Pitfalls">
        <ul className="mt-2 space-y-1.5 text-sm">
          <li><strong>KL is not a metric:</strong> It is not symmetric and doesn't satisfy the triangle inequality. For a symmetric alternative, use Jensen-Shannon divergence: <InlineMath math="JSD(P\|Q) = \frac{1}{2}D_{KL}(P\|M) + \frac{1}{2}D_{KL}(Q\|M)" /> where <InlineMath math="M = (P+Q)/2" />.</li>
          <li><strong>PyTorch convention:</strong> <code>F.kl_div(input, target)</code> expects <code>input</code> to be log-probabilities and <code>target</code> to be probabilities. The argument order is reversed from the math: it computes <InlineMath math="D_{KL}(\text{target} \| \text{input})" />.</li>
          <li><strong>Numerical stability:</strong> Always clip probabilities away from 0 before computing logs. Use <code>torch.clamp(p, min=1e-7)</code> or <code>F.log_softmax</code> + <code>F.nll_loss</code>.</li>
          <li><strong>Infinite KL:</strong> If Q assigns zero probability where P is nonzero, KL is infinite. Ensure support of Q covers support of P when using forward KL.</li>
        </ul>
      </WarningBlock>

      <ExerciseBlock
        exercises={[
          {
            difficulty: 'beginner',
            question: 'Compute $D_{KL}(P \\| Q)$ where $P = (0.4, 0.6)$ and $Q = (0.5, 0.5)$.',
            solution: '$0.4 \\log(0.4/0.5) + 0.6 \\log(0.6/0.5) = 0.4 \\log(0.8) + 0.6 \\log(1.2) \\approx -0.0446 + 0.0658 = 0.0212$ nats.',
          },
          {
            difficulty: 'intermediate',
            question: 'Prove that KL divergence is invariant under bijective transformations of the sample space.',
          },
          {
            difficulty: 'advanced',
            question: 'Derive the closed-form KL divergence between two multivariate Gaussians $\\mathcal{N}(\\mu_1, \\Sigma_1)$ and $\\mathcal{N}(\\mu_2, \\Sigma_2)$.',
            solution: '$D_{KL} = \\frac{1}{2}\\left[\\text{tr}(\\Sigma_2^{-1}\\Sigma_1) + (\\mu_2-\\mu_1)^T\\Sigma_2^{-1}(\\mu_2-\\mu_1) - d + \\ln\\frac{|\\Sigma_2|}{|\\Sigma_1|}\\right]$',
          },
          {
            difficulty: 'implementation',
            question: 'Implement a VAE encoder that outputs $\\mu$ and $\\log \\sigma^2$, compute the KL divergence term of the ELBO, and verify it matches the closed-form formula.',
          },
        ]}
      />

      <ReferenceList references={REFERENCES} />
    </div>
  )
}
