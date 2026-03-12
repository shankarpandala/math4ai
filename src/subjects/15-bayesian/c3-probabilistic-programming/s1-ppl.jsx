import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Probabilistic Program Trace Diagram
// ---------------------------------------------------------------------------

function PPLTraceDiagram() {
  const [step, setStep] = useState(0);
  const [showWeights, setShowWeights] = useState(true);

  // Simulate traces for a simple coin flip model:
  // theta ~ Beta(2,2)
  // x_i ~ Bernoulli(theta) for i=1..4
  // Observed: x = [1,0,1,1]

  const OBSERVED = [1, 0, 1, 1];

  const traces = [
    { theta: 0.75, samples: [1, 0, 1, 1], logW: 0.0 },    // matches perfectly
    { theta: 0.50, samples: [1, 1, 0, 1], logW: -0.693 },  // one mismatch
    { theta: 0.30, samples: [0, 0, 1, 0], logW: -2.1 },    // 2 mismatch
    { theta: 0.85, samples: [1, 1, 1, 1], logW: -0.693 },  // one mismatch
  ];

  function computeLogLikelihood(theta, samples) {
    return samples.reduce((acc, x, i) => {
      const p = x === 1 ? theta : (1 - theta);
      return acc + Math.log(Math.max(p, 1e-10));
    }, 0);
  }

  function logBeta(theta) {
    // log Beta(2,2) density: theta*(1-theta) unnorm
    return Math.log(theta) + Math.log(1 - theta);
  }

  const enrichedTraces = traces.map((t) => ({
    ...t,
    logLik: computeLogLikelihood(t.theta, OBSERVED),
    logPrior: logBeta(t.theta),
  }));

  const maxLogW = Math.max(...enrichedTraces.map((t) => t.logLik + t.logPrior));
  const weights = enrichedTraces.map((t) => Math.exp(t.logLik + t.logPrior - maxLogW));
  const wSum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map((w) => w / wSum);

  const displayTrace = step < traces.length ? enrichedTraces[step] : null;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Probabilistic Program Trace Diagram
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        A PPL execution trace samples latent variables and computes an importance weight
        from the likelihood of observations. Model: <InlineMath math="\theta \sim \mathrm{Beta}(2,2)" />,
        <InlineMath math="x_i \sim \mathrm{Bern}(\theta)" />.
        Observed: <InlineMath math="x = [1,0,1,1]" />.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {traces.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`rounded px-3 py-1 text-sm font-medium ${step === i ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
            Trace {i + 1}
          </button>
        ))}
        <button onClick={() => setShowWeights((v) => !v)}
          className="rounded px-3 py-1 text-sm bg-gray-100 text-gray-500">
          {showWeights ? 'Hide' : 'Show'} weights
        </button>
      </div>

      {/* Trace visualization */}
      {displayTrace && (
        <div className="space-y-3">
          {/* Program execution boxes */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2 dark:bg-purple-900/20">
              <p className="text-xs text-purple-400">SAMPLE</p>
              <p className="font-mono text-sm font-bold text-purple-700 dark:text-purple-300">
                θ = {displayTrace.theta.toFixed(2)}
              </p>
              <p className="text-xs text-purple-400">Beta(2,2)</p>
            </div>
            <span className="text-gray-400">→</span>
            {OBSERVED.map((obs, i) => (
              <React.Fragment key={i}>
                <div className={`rounded-lg border-2 px-3 py-2 ${
                  displayTrace.samples[i] === obs
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <p className="text-xs text-gray-400">OBSERVE x<sub>{i + 1}</sub></p>
                  <p className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                    obs={obs}
                  </p>
                  <p className={`text-xs font-bold ${
                    displayTrace.samples[i] === obs ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {displayTrace.samples[i] === obs ? '✓ match' : '✗ miss'}
                  </p>
                </div>
                {i < OBSERVED.length - 1 && <span className="text-gray-400">→</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Scores */}
          {showWeights && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <p className="text-xs text-gray-400">log prior</p>
                <p className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                  {displayTrace.logPrior.toFixed(3)}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-xs text-blue-400">log likelihood</p>
                <p className="font-mono text-sm font-bold text-blue-700 dark:text-blue-300">
                  {displayTrace.logLik.toFixed(3)}
                </p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                <p className="text-xs text-indigo-400">norm. weight</p>
                <p className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  {(normalizedWeights[step] * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const PPL_CODE = `# -----------------------------------------------------------------------
# Probabilistic Programming with Pyro (PyTorch-based PPL)
# -----------------------------------------------------------------------
import torch
import pyro
import pyro.distributions as dist
from pyro.infer import MCMC, NUTS, SVI, Trace_ELBO
from pyro.optim import Adam

# -----------------------------------------------------------------------
# 1. Defining a probabilistic model in Pyro
# -----------------------------------------------------------------------

def coin_flip_model(data):
    """
    Bayesian coin flip model:
        theta ~ Beta(2, 2)          # prior: slightly biased toward 0.5
        x_i   ~ Bernoulli(theta)    # likelihood
    """
    theta = pyro.sample("theta", dist.Beta(2.0, 2.0))   # latent variable
    with pyro.plate("data", len(data)):
        pyro.sample("obs", dist.Bernoulli(theta), obs=data)  # observed

# -----------------------------------------------------------------------
# 2. Inference Engine 1: NUTS (No-U-Turn Sampler)
# -----------------------------------------------------------------------

data = torch.tensor([1., 0., 1., 1., 1., 0., 1.])

nuts_kernel = NUTS(coin_flip_model)
mcmc = MCMC(nuts_kernel, num_samples=1000, warmup_steps=200)
mcmc.run(data)
samples = mcmc.get_samples()
print(f"NUTS posterior mean theta: {samples['theta'].mean():.4f}")

# -----------------------------------------------------------------------
# 3. Inference Engine 2: SVI (Variational Inference)
# -----------------------------------------------------------------------

def guide(data):
    """Variational guide: q(theta) = Beta(alpha_q, beta_q)."""
    alpha_q = pyro.param("alpha_q", torch.tensor(2.0), constraint=dist.constraints.positive)
    beta_q  = pyro.param("beta_q",  torch.tensor(2.0), constraint=dist.constraints.positive)
    pyro.sample("theta", dist.Beta(alpha_q, beta_q))

svi = SVI(coin_flip_model, guide, Adam({"lr": 0.05}), loss=Trace_ELBO())

# Train for 1000 steps
pyro.clear_param_store()
for step in range(1000):
    loss = svi.step(data)

alpha_q = pyro.param("alpha_q").item()
beta_q  = pyro.param("beta_q").item()
print(f"SVI posterior: Beta({alpha_q:.2f}, {beta_q:.2f})")
print(f"SVI posterior mean: {alpha_q / (alpha_q + beta_q):.4f}")
# True posterior: Beta(2+5, 2+2) = Beta(7,4), mean = 7/11 ≈ 0.636
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PPLConcepts() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          PPL Concepts
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Probabilistic Programming Languages (PPLs) allow users to define probabilistic models
          as programs with random primitives, automating Bayesian inference through either
          MCMC or variational inference engines.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Early PPLs include <strong>BUGS</strong> (1989, Bayesian inference using Gibbs
          sampling) and <strong>JAGS</strong>. Modern PPLs with neural network integration:
          <strong> Pyro</strong> (Uber AI, 2017), <strong>NumPyro</strong> (JAX-based, fast),
          <strong> Stan</strong> (HMC-based, R/Python interface), and
          <strong> Edward2/TensorFlow Probability</strong>. The universal PPL concept
          (arbitrary programs as models) was formalized by <strong>Church (2008)</strong>
          and <strong>Probabilistic C (2014)</strong>.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Probabilistic Program and Execution Trace"
        definition="A probabilistic program is a computer program with two additional operations: SAMPLE (drawing a value from a distribution) and OBSERVE (conditioning on a value, contributing to the likelihood). An execution trace $\tau = \{(v_1, \mathrm{addr}_1), \ldots, (v_K, \mathrm{addr}_K)\}$ is the sequence of sample statements executed. Each trace defines a joint probability $p(\tau, x) = p(x|\tau) \prod_k p(v_k)$, and the posterior over traces is $p(\tau|x) \propto p(x|\tau)\prod_k p(v_k)$."
        notation="The 'address' of a sample site identifies which random variable was sampled (e.g., string name or program counter). Different executions may visit different numbers of sample sites (stochastic control flow), making inference in universal PPLs challenging."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Inference Engines: MCMC vs VI"
        definition="PPLs decouple model specification from inference. The two main inference paradigms: (1) MCMC engines (HMC, NUTS) produce asymptotically exact samples from the posterior by simulating a Markov chain — they are exact but slow; (2) Variational inference (SVI, ADVI) approximates the posterior with a parametric family, trading exactness for speed. Modern PPLs like Pyro/Stan support both through automatic differentiation and interchangeable inference backends."
        notation="A guide (Pyro) or variational family (Stan ADVI) defines the approximate posterior $q_\phi(z)$. The evidence lower bound (ELBO) is maximized over $\phi$ using automatic differentiation. The model (log-joint) and guide must have matching latent variable names."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Plate Notation and Conditional Independence"
        definition="Plates in PPLs declare that a group of variables are conditionally independent given their parents: $x_1, \ldots, x_n \overset{\mathrm{iid}}{\sim} p(x|\theta)$. This allows vectorized computation instead of Python loops, enabling GPU acceleration. In Pyro: `with pyro.plate('data', n): x = pyro.sample('x', dist, obs=data)`. Plates correspond to 'for' loops in the generative process."
        notation="Nested plates model matrix-structured data (rows × columns). The plate annotation also communicates the model structure to inference engines (e.g., NUTS can exploit conditional independence for more efficient HMC proposals)."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Importance Sampling for PPL Inference"
        definition="For a probabilistic program with prior $p(z)$ and likelihood $p(x|z)$, the posterior expectation $\mathbb{E}_{p(z|x)}[f(z)]$ can be estimated by importance sampling: $\mathbb{E}[f(z)|x] \approx \frac{\sum_s w^{(s)} f(z^{(s)})}{\sum_s w^{(s)}}$ where $z^{(s)} \sim q(z)$ and $w^{(s)} = p(x,z^{(s)})/q(z^{(s)})$. This is consistent (converges to the true expectation) for any proposal $q$ with $q(z) > 0$ whenever $p(z|x) > 0$."
        statement="For a probabilistic program with prior $p(z)$ and likelihood $p(x|z)$, the self-normalized importance sampling estimator $\hat{\mathbb{E}}[f] = \sum_s \bar{w}^{(s)} f(z^{(s)})$ with $\bar{w}^{(s)} = w^{(s)}/\sum_k w^{(k)}$ is strongly consistent: $\hat{\mathbb{E}}[f] \to \mathbb{E}_{p(z|x)}[f(z)]$ as $S \to \infty$."
        proof="By the strong law of large numbers, $\frac{1}{S}\sum_s w^{(s)} f(z^{(s)}) \to \mathbb{E}_q[w(z)f(z)] = \mathbb{E}_q[p(x,z)/q(z) \cdot f(z)] = \int p(x,z) f(z)\,dz = p(x)\mathbb{E}_{p(z|x)}[f(z)]$, and $\frac{1}{S}\sum_s w^{(s)} \to p(x)$. Their ratio converges to $\mathbb{E}_{p(z|x)}[f(z)]$. $\square$"
        corollaries={[
          "Likelihood weighting (use the prior as proposal) is the simplest IS-based inference algorithm for PPLs — but suffers from high variance when the prior is far from the posterior.",
          "Sequential Monte Carlo (SMC) improves importance sampling by annealing from prior to posterior, resampling traces with low weights at intermediate steps.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Conjugate Updates are Efficient PPL Primitives"
        statement="For exponential family likelihoods with conjugate priors, the posterior update has a closed form: if $p(\theta) = h(\theta)\exp(\eta^T T(\theta) - A(\eta))$ (prior) and $p(x|\theta) = h(x)\exp(\theta^T T(x) - A(\theta))$ (likelihood), then the posterior $p(\theta|x) \propto p(\theta)p(x|\theta)$ is in the same exponential family with updated natural parameter $\eta' = \eta + T(x)$."
        proof="$p(\theta|x) \propto p(\theta)p(x|\theta) = h(\theta)h(x)\exp((\eta + T(x))^T T(\theta) - A(\eta) - A(\theta))$. This has the form of an exponential family distribution in $\theta$ with natural parameter $\eta' = \eta + T(x)$, i.e., the same family as the prior — the conjugacy property. The normalization constant $\exp(-A(\eta'))$ is determined by the exponential family structure. $\square$"
        corollaries={[
          "PPLs with conjugate primitives (Beta-Bernoulli, Gaussian-Gaussian, Dirichlet-Categorical) support exact closed-form inference that is faster than MCMC.",
          "Non-conjugate models (logistic regression, neural networks) require approximate inference (MCMC or VI), which is automatically dispatched by the PPL inference engine.",
        ]}
      />

      <PPLTraceDiagram />

      <ExampleBlock
        title="Bayesian Linear Regression in Pyro"
        problem="Model: $y_n = w^T x_n + \varepsilon_n$, $w \sim \mathcal{N}(0, I)$, $\varepsilon_n \sim \mathcal{N}(0, \sigma^2)$. Write the Pyro model and guide, and describe what the inference engine does."
        difficulty="intermediate"
        solution={[
          {
            step: 'Define the generative model',
            explanation: 'pyro.sample("w", dist.Normal(0,1).expand([d]).to_event(1)) draws weights. pyro.sample("sigma", dist.HalfNormal(1)) draws noise scale. pyro.sample("obs", dist.Normal(X@w, sigma), obs=y) conditions on data.',
          },
          {
            step: 'Define the guide (variational family)',
            explanation: 'Guide mirrors the model structure. pyro.param("w_mu", zeros(d)) and pyro.param("w_sigma", ones(d), positive). pyro.sample("w", dist.Normal(w_mu, w_sigma).to_event(1)). Mean field Gaussian over weights.',
          },
          {
            step: 'Run SVI',
            explanation: 'SVI maximizes ELBO: E_q[log p(y,w|X)] - KL(q(w)||p(w)). Gradients via reparameterization (pathwise). After 1000 steps: w_mu converges to posterior mean (≈ ridge regression solution), w_sigma to posterior uncertainty.',
          },
          {
            step: 'Predictive distribution',
            formula: 'p(y_*|x_*, \\mathcal{D}) \\approx \\int p(y_*|x_*, w)\\, q(w)\\, dw',
            explanation: 'Draw S samples from q(w), compute predictions, average. Uncertainty in predictions comes from weight uncertainty.',
          },
        ]}
      />

      <WarningBlock title="PPL Pitfalls and Common Mistakes">
        <ul className="space-y-2 text-sm">
          <li><strong>Guide-model mismatch:</strong> Every pyro.sample in the model must have a corresponding pyro.sample in the guide (with the same name and compatible support). Missing or mismatched sample sites cause silent incorrect inference.</li>
          <li><strong>Observed vs sampled:</strong> In the model, obs=data conditions on the data. In the guide, you must not have obs= for latent variables. A common bug: accidentally conditioning on latent variables in the guide.</li>
          <li><strong>Stochastic control flow:</strong> PPLs where if/else branches depend on sampled values require special handling (program path enumeration or continuous relaxation). Naive MCMC may get stuck in one program path.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={PPL_CODE}
        language="python"
        title="Pyro PPL — Model Definition, NUTS, and SVI"
        runnable
      />
    </div>
  );
}
