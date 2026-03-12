import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function KLViz() {
  const [mu1, setMu1] = useState(0);
  const [sig1, setSig1] = useState(1);
  const [mu2, setMu2] = useState(2);
  const [sig2, setSig2] = useState(1.5);

  // KL(N(mu1,sig1²) || N(mu2,sig2²)) = log(sig2/sig1) + (sig1²+(mu1-mu2)²)/(2sig2²) - 1/2
  const kl_fwd = Math.log(sig2 / sig1) + (sig1 ** 2 + (mu1 - mu2) ** 2) / (2 * sig2 ** 2) - 0.5;
  const kl_rev = Math.log(sig1 / sig2) + (sig2 ** 2 + (mu2 - mu1) ** 2) / (2 * sig1 ** 2) - 0.5;

  const W = 340, H = 160;
  const xMin = Math.min(mu1, mu2) - 4, xMax = Math.max(mu1, mu2) + 4;
  const nPts = 300;

  const pdf1 = (x) => Math.exp(-0.5 * ((x - mu1) / sig1) ** 2) / (sig1 * Math.sqrt(2 * Math.PI));
  const pdf2 = (x) => Math.exp(-0.5 * ((x - mu2) / sig2) ** 2) / (sig2 * Math.sqrt(2 * Math.PI));

  const maxY = 1 / (Math.min(sig1, sig2) * Math.sqrt(2 * Math.PI));
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - 15 - (y / (maxY * 1.1)) * (H - 25),
  });

  const makePath = (pdfFn) => {
    const pts = Array.from({ length: nPts }, (_, i) => {
      const x = xMin + (i / (nPts - 1)) * (xMax - xMin);
      return toSvg(x, pdfFn(x));
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        KL Divergence Between Two Gaussians
      </h3>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={0} y1={H - 15} x2={W} y2={H - 15} stroke="#9ca3af" strokeWidth={1} />
        <path d={makePath(pdf1)} fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth={2.5} />
        <path d={makePath(pdf2)} fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth={2.5} />
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[{l:'μ₁', v:mu1, s:setMu1, c:'text-blue-600'}, {l:'σ₁', v:sig1, s:setSig1, c:'text-blue-600', min:0.2, max:3},
          {l:'μ₂', v:mu2, s:setMu2, c:'text-red-600'}, {l:'σ₂', v:sig2, s:setSig2, c:'text-red-600', min:0.2, max:3}]
          .map(({ l, v, s, c, min=-3, max=3 }) => (
          <div key={l}>
            <div className={`mb-1 flex justify-between text-xs ${c}`}><span className="font-mono">{l}</span><span>{v.toFixed(2)}</span></div>
            <input type="range" min={min} max={max} step="0.1" value={v}
              onChange={e => s(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2">
          <p className="text-xs text-blue-600 font-semibold">KL(P‖Q) — Forward</p>
          <p className="font-mono font-bold">{kl_fwd.toFixed(5)} nats</p>
          <p className="text-xs text-gray-500">P covers Q</p>
        </div>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2">
          <p className="text-xs text-red-600 font-semibold">KL(Q‖P) — Reverse</p>
          <p className="font-mono font-bold">{kl_rev.toFixed(5)} nats</p>
          <p className="text-xs text-gray-500">Mode-seeking</p>
        </div>
      </div>
    </div>
  );
}

export default function KLSection() {
  return (
    <div className="space-y-8">
      <KLViz />

      <DefinitionBlock
        label="Definition 7.2.1"
        title="KL Divergence"
        definition={
          "For distributions $P$ and $Q$ over the same space, the KL divergence (relative entropy) is " +
          "$D_{\\text{KL}}(P \\| Q) = \\sum_x p(x) \\log \\frac{p(x)}{q(x)}$ (discrete) or " +
          "$D_{\\text{KL}}(P \\| Q) = \\int p(x) \\log \\frac{p(x)}{q(x)}\\,dx$ (continuous). " +
          "Defined as $+\\infty$ if $q(x) = 0$ for some $x$ with $p(x) > 0$. " +
          "By Gibbs' inequality: $D_{\\text{KL}}(P\\|Q) \\geq 0$, with equality iff $P = Q$ a.e. " +
          "Note: $D_{\\text{KL}}(P\\|Q) \\neq D_{\\text{KL}}(Q\\|P)$ in general — KL is not a metric."
        }
        notation={
          "For $N(\\mu_1, \\sigma_1^2) \\| N(\\mu_2, \\sigma_2^2)$: " +
          "$D_{\\text{KL}} = \\log(\\sigma_2/\\sigma_1) + (\\sigma_1^2 + (\\mu_1-\\mu_2)^2)/(2\\sigma_2^2) - 1/2$."
        }
      />

      <DefinitionBlock
        label="Definition 7.2.2"
        title="Forward vs Reverse KL"
        definition={
          "Forward KL $D_{\\text{KL}}(P \\| Q)$ (also called M-projection or inclusive KL): " +
          "minimizing over $Q$ yields mass-covering behavior — $Q$ must have support wherever $P$ does. " +
          "Reverse KL $D_{\\text{KL}}(Q \\| P)$ (I-projection or exclusive KL): " +
          "minimizing over $Q$ yields mode-seeking behavior — $Q$ concentrates on a mode of $P$. " +
          "In variational inference: ELBO maximization minimizes forward KL; expectation propagation minimizes reverse KL."
        }
      />

      <TheoremBlock
        label="Theorem 7.2.1"
        title="Chain Rule and Mutual Information"
        statement={
          "Chain rule: $D_{\\text{KL}}(P(X,Y) \\| Q(X,Y)) = D_{\\text{KL}}(P(X) \\| Q(X)) + E_{P(X)}[D_{\\text{KL}}(P(Y|X) \\| Q(Y|X))]$. " +
          "Mutual information: $I(X;Y) = D_{\\text{KL}}(P(X,Y) \\| P(X)P(Y)) = H(X) - H(X|Y) = H(Y) - H(Y|X)$. " +
          "Mutual information measures how much knowing $Y$ reduces uncertainty about $X$."
        }
        proof={
          "$I(X;Y) = \\sum_{x,y} p(x,y) \\log \\frac{p(x,y)}{p(x)p(y)}$. " +
          "Expand: $= \\sum_{x,y} p(x,y)\\log p(x,y) - \\sum_x p(x)\\log p(x) - \\sum_y p(y)\\log p(y)$ " +
          "$= -H(X,Y) + H(X) + H(Y) = H(X) + H(Y) - H(X,Y)$."
        }
      />

      <ExampleBlock title="KL in Variational Autoencoders">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          The VAE ELBO loss has a KL term penalizing the encoder posterior <InlineMath math="q_\phi(z|x)" />{' '}
          from drifting from the prior <InlineMath math="p(z) = N(0,I)" />:
        </p>
        <BlockMath math="\mathcal{L} = E_{q_\phi(z|x)}[\log p_\theta(x|z)] - D_{\text{KL}}(q_\phi(z|x) \| p(z))" />
        <BlockMath math="D_{\text{KL}}(N(\mu,\sigma^2)\|N(0,1)) = \frac{1}{2}(\mu^2 + \sigma^2 - \log\sigma^2 - 1)" />
      </ExampleBlock>

      <WarningBlock title="KL Divergence Is Not a Distance">
        <p>
          KL divergence violates the axioms of a metric: it is asymmetric and does not satisfy the
          triangle inequality. The Jensen-Shannon divergence <InlineMath math="\text{JSD}(P\|Q) = \frac{1}{2}D_\text{KL}(P\|M) + \frac{1}{2}D_\text{KL}(Q\|M)" />{' '}
          (where <InlineMath math="M = (P+Q)/2" />) is symmetric and bounded in <InlineMath math="[0, \log 2]" />,{' '}
          and <InlineMath math="\sqrt{\text{JSD}}" /> is an actual metric. Wasserstein distance is another
          alternative that respects the geometry of the space — used in Wasserstein GANs.
        </p>
      </WarningBlock>

      <PythonCode
        title="KL Divergence Computations"
        code={`import numpy as np
from scipy import stats

# ── KL between Gaussians (analytic) ──────────────────────────────────────
def kl_gaussians(mu1, sig1, mu2, sig2):
    """KL(N(mu1,sig1²) || N(mu2,sig2²))."""
    return np.log(sig2/sig1) + (sig1**2 + (mu1-mu2)**2)/(2*sig2**2) - 0.5

mu1, sig1 = 0.0, 1.0
mu2, sig2 = 2.0, 1.5
print(f"KL(N({mu1},{sig1}²) || N({mu2},{sig2}²)) = {kl_gaussians(mu1,sig1,mu2,sig2):.4f} nats")
print(f"KL(N({mu2},{sig2}²) || N({mu1},{sig1}²)) = {kl_gaussians(mu2,sig2,mu1,sig1):.4f} nats")
print("KL is asymmetric!")

# ── KL for VAE (diagonal Gaussian posterior) ──────────────────────────────
def kl_vae(mu, log_var):
    """KL(N(mu, exp(log_var)) || N(0,1)) per dimension."""
    return 0.5 * (mu**2 + np.exp(log_var) - log_var - 1)

mu_enc = np.array([0.5, -1.2, 0.3])
log_var_enc = np.array([-0.5, 0.2, -1.0])
kl_terms = kl_vae(mu_enc, log_var_enc)
print(f"\\nVAE KL terms: {kl_terms}")
print(f"Total KL: {kl_terms.sum():.4f}")

# ── Numerical KL via Monte Carlo ──────────────────────────────────────────
np.random.seed(42)
n = 100000
X = np.random.normal(mu1, sig1, n)
log_ratio = stats.norm(mu1, sig1).logpdf(X) - stats.norm(mu2, sig2).logpdf(X)
kl_mc = log_ratio.mean()
print(f"\\nMonte Carlo KL estimate: {kl_mc:.4f} (analytic: {kl_gaussians(mu1,sig1,mu2,sig2):.4f})")

# ── Mutual information ────────────────────────────────────────────────────
# For bivariate normal with correlation rho:
# I(X;Y) = -0.5 * log(1 - rho²)
for rho in [0.0, 0.3, 0.6, 0.9, 0.99]:
    mi = -0.5 * np.log(1 - rho**2)
    print(f"  I(X;Y) for rho={rho:.2f}: {mi:.4f} nats")`}
      />
    </div>
  );
}
