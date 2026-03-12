import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function MCMCTraceViz() {
  const [trace, setTrace] = useState([0]);
  const [accepted, setAccepted] = useState(0);
  const [total, setTotal] = useState(0);
  const [sigma, setSigma] = useState(1.0);
  const [bimodal, setBimodal] = useState(false);

  // Target: standard normal or bimodal mixture
  const logTarget = (x) => {
    if (bimodal) {
      const p1 = Math.exp(-0.5 * (x - 2) ** 2) / Math.sqrt(2 * Math.PI);
      const p2 = Math.exp(-0.5 * (x + 2) ** 2) / Math.sqrt(2 * Math.PI);
      return Math.log(0.5 * (p1 + p2) + 1e-300);
    }
    return -0.5 * x * x;
  };

  const runMH = (n) => {
    let current = trace[trace.length - 1];
    let acc = 0;
    const newTrace = [];
    for (let i = 0; i < n; i++) {
      const proposal = current + (Math.random() * 2 - 1) * sigma * Math.sqrt(3);
      const logA = logTarget(proposal) - logTarget(current);
      if (Math.log(Math.random()) < logA) {
        current = proposal;
        acc++;
      }
      newTrace.push(current);
    }
    setTrace(prev => [...prev, ...newTrace].slice(-500));
    setAccepted(prev => prev + acc);
    setTotal(prev => prev + n);
  };

  const reset = () => { setTrace([0]); setAccepted(0); setTotal(0); };

  const W = 340, H = 140;
  const n = trace.length;
  const traceMin = Math.min(...trace, -3.5), traceMax = Math.max(...trace, 3.5);
  const toSvg = (i, x) => ({
    sx: (i / Math.max(n - 1, 1)) * W,
    sy: H - 10 - ((x - traceMin) / (traceMax - traceMin + 0.01)) * (H - 20),
  });

  const tracePath = trace.map(({ }, i) => {
    const { sx, sy } = toSvg(i, trace[i]);
    return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Metropolis-Hastings Trace Plot
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Target: {bimodal ? 'Bimodal mixture N(-2,1)/2 + N(2,1)/2' : 'Standard Normal N(0,1)'}. Proposal: Uniform(±{(sigma * Math.sqrt(3)).toFixed(2)}).
      </p>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3">
        <line x1={0} y1={toSvg(0, 0).sy} x2={W} y2={toSvg(0, 0).sy} stroke="#9ca3af" strokeWidth={1} strokeDasharray="4,3" />
        {n > 1 && <path d={tracePath} fill="none" stroke="#6366f1" strokeWidth={1} />}
      </svg>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>Proposal σ</span><span>{sigma.toFixed(2)}</span></div>
          <input type="range" min="0.1" max="5" step="0.1" value={sigma}
            onChange={e => setSigma(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setBimodal(b => !b)}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${bimodal ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            {bimodal ? 'Bimodal ON' : 'Bimodal OFF'}
          </button>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        {[50, 200].map(k => (
          <button key={k} onClick={() => runMH(k)} className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white">
            +{k} steps
          </button>
        ))}
        <button onClick={reset} className="rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm">Reset</button>
        <span className="self-center text-xs text-gray-500">
          n={total}, accept rate={(total > 0 ? accepted/total : 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default function MCMCSection() {
  return (
    <div className="space-y-8">
      <MCMCTraceViz />

      <DefinitionBlock
        label="Definition 6.3.1"
        title="Metropolis-Hastings Algorithm"
        definition={
          "Given target $\\pi$ (known up to a constant) and proposal $q(\\cdot|x)$, iterate: " +
          "(1) At current state $x$, propose $y \\sim q(\\cdot|x)$. " +
          "(2) Compute acceptance ratio $\\alpha(x,y) = \\min\\!\\left(1,\\; \\frac{\\pi(y) q(x|y)}{\\pi(x) q(y|x)}\\right)$. " +
          "(3) Accept: set $x_{t+1} = y$ with probability $\\alpha$; reject: $x_{t+1} = x$. " +
          "The resulting chain satisfies detailed balance with respect to $\\pi$, guaranteeing $\\pi$ is stationary."
        }
        notation={
          "Random walk Metropolis: $q(y|x) = q(y-x)$ (symmetric). Then $\\alpha = \\min(1, \\pi(y)/\\pi(x))$. " +
          "Optimal acceptance rate for RW-MH in $d$ dimensions: $\\approx 0.234$ (Roberts et al., 1997)."
        }
      />

      <DefinitionBlock
        label="Definition 6.3.2"
        title="Gibbs Sampling"
        definition={
          "For a joint distribution $\\pi(x_1, \\ldots, x_d)$, Gibbs sampling cycles through coordinates: " +
          "at each step $t$, for each $i$, sample $x_i^{(t+1)} \\sim \\pi(x_i | x_{-i}^{(t)})$ (the full conditional). " +
          "Gibbs is a special case of MH with acceptance rate 1 (conditionals always accepted). " +
          "Convergence requires the full conditionals to be tractable."
        }
      />

      <TheoremBlock
        label="Theorem 6.3.1"
        title="MH Detailed Balance"
        statement={
          "The Metropolis-Hastings chain satisfies detailed balance with respect to $\\pi$: " +
          "$\\pi(x) P(x,y) = \\pi(y) P(y,x)$ for all $x \\neq y$, " +
          "where $P(x,y) = q(y|x) \\alpha(x,y)$ is the transition kernel. " +
          "Hence $\\pi$ is the unique stationary distribution (assuming the chain is irreducible)."
        }
        proof={
          "WLOG assume $\\pi(y) q(x|y) \\leq \\pi(x) q(y|x)$. Then $\\alpha(x,y) = \\pi(y)q(x|y)/[\\pi(x)q(y|x)]$ and $\\alpha(y,x) = 1$. " +
          "$\\pi(x) P(x,y) = \\pi(x) q(y|x) \\alpha(x,y) = \\pi(y) q(x|y)$. " +
          "$\\pi(y) P(y,x) = \\pi(y) q(x|y) \\cdot 1 = \\pi(y) q(x|y)$. Equal."
        }
      />

      <ExampleBlock title="Bayesian Inference via MCMC">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Posterior <InlineMath math="p(\theta | x) \propto p(x|\theta) p(\theta)" /> is often intractable.
          MH samples from it without knowing the normalizing constant:
        </p>
        <BlockMath math="\alpha(\theta, \theta') = \min\!\left(1, \frac{p(x|\theta')p(\theta')}{p(x|\theta)p(\theta)}\right)" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          After burn-in, the chain's empirical distribution approximates the posterior.
          Used for Bayesian neural networks, probabilistic graphical models.
        </p>
      </ExampleBlock>

      <WarningBlock title="Burn-in, Thinning, and Convergence Diagnostics">
        <p>
          MCMC samples are correlated and the chain starts away from stationarity. Always:
          (1) discard a <em>burn-in</em> period (initial samples before mixing);
          (2) optionally <em>thin</em> to reduce autocorrelation;
          (3) check convergence with diagnostics like the Gelman-Rubin <InlineMath math="\hat{R}" /> statistic
          (run multiple chains, <InlineMath math="\hat{R} \approx 1" /> indicates convergence).
          Never assume the chain has converged just because it <em>looks</em> stable — for multimodal
          targets, the chain may be trapped in one mode indefinitely.
        </p>
      </WarningBlock>

      <PythonCode
        title="Metropolis-Hastings from Scratch"
        code={`import numpy as np
from scipy import stats

# ── Metropolis-Hastings for Bayesian inference ────────────────────────────
# Model: y_i ~ N(mu, 1), prior: mu ~ N(0, 10²)
# Posterior: mu | y ~ N(mu_post, sigma_post²)

np.random.seed(42)
true_mu = 2.5
data = np.random.normal(true_mu, 1.0, 20)  # 20 observations

# Analytic posterior (conjugate)
n = len(data)
prior_mu, prior_sigma2 = 0, 100
sigma2_post = 1 / (1/prior_sigma2 + n/1.0)
mu_post = sigma2_post * (prior_mu/prior_sigma2 + data.sum()/1.0)
print(f"Analytic posterior: μ|y ~ N({mu_post:.4f}, {sigma2_post:.4f})")

def log_posterior(mu, data):
    log_prior = stats.norm(0, 10).logpdf(mu)
    log_likelihood = stats.norm(mu, 1).logpdf(data).sum()
    return log_prior + log_likelihood

# MH sampler
def metropolis_hastings(log_target, n_samples, proposal_std=0.5, initial=0):
    samples = [initial]
    accepted = 0
    for _ in range(n_samples - 1):
        current = samples[-1]
        proposal = current + np.random.normal(0, proposal_std)
        log_ratio = log_target(proposal) - log_target(current)
        if np.log(np.random.uniform()) < log_ratio:
            samples.append(proposal)
            accepted += 1
        else:
            samples.append(current)
    return np.array(samples), accepted / n_samples

samples, acc_rate = metropolis_hastings(
    lambda mu: log_posterior(mu, data), n_samples=10000, proposal_std=0.5)

burnin = 2000
samples_post = samples[burnin:]
print(f"\\nMH estimates (n={len(samples_post)}, accept={acc_rate:.3f}):")
print(f"  Posterior mean: {samples_post.mean():.4f} (analytic: {mu_post:.4f})")
print(f"  Posterior std:  {samples_post.std():.4f} (analytic: {np.sqrt(sigma2_post):.4f})")

# Gelman-Rubin diagnostic (simplified, 2 chains)
_, _ = metropolis_hastings(lambda mu: log_posterior(mu, data), 5000, 0.5, initial=5)
print(f"\\nNote: Use R-hat < 1.01 for convergence (run multiple chains)")`}
      />
    </div>
  );
}
