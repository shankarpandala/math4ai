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
// 1D Invertible Transformation Visualizer
// ---------------------------------------------------------------------------

function FlowVisualizer() {
  const [steps, setSteps] = useState(3);
  const [showInverse, setShowInverse] = useState(false);

  // Simulate a normalizing flow: Gaussian -> bimodal target
  // Each step applies a leaky-ReLU-like coupling transform
  const N = 80;
  const xs = Array.from({ length: N }, (_, i) => -3.5 + (i / (N - 1)) * 7);

  function gaussianPDF(x, mu = 0, sigma = 1) {
    return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  }

  // Simple flow: affine coupling layers
  // Step k applies x -> tanh(x + bias_k) * scale_k
  function applyFlow(x, nSteps) {
    let z = x;
    for (let k = 0; k < nSteps; k++) {
      const bias = (k % 2 === 0) ? 0.8 : -0.8;
      const scale = 1.0 + 0.3 * Math.sin(k * 1.1);
      z = Math.tanh(z * 0.7 + bias) * scale * 2.5;
    }
    return z;
  }

  // Compute transformed PDF via change of variables
  // p_x(x) = p_z(f(x)) * |df/dx|
  function numerical_jacobian(x, nSteps) {
    const h = 0.001;
    return Math.abs((applyFlow(x + h, nSteps) - applyFlow(x - h, nSteps)) / (2 * h));
  }

  const transformedPDF = xs.map((x) => {
    const z = applyFlow(x, steps);
    const pz = gaussianPDF(z, 0, 1);
    const jac = numerical_jacobian(x, steps);
    return Math.min(pz * jac, 2.0);
  });

  const svgW = 480;
  const svgH = 200;
  const padL = 36, padR = 12, padT = 15, padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const pMax = Math.max(...transformedPDF, 0.6);
  function tx(x) { return padL + ((x + 3.5) / 7) * plotW; }
  function ty(p) { return padT + (1 - Math.min(p, pMax) / pMax) * plotH; }

  const gaussPoints = xs.map((x, i) => `${tx(x).toFixed(1)},${ty(gaussianPDF(x)).toFixed(1)}`).join(' ');
  const transPoints = xs.map((x, i) => `${tx(x).toFixed(1)},${ty(transformedPDF[i]).toFixed(1)}`).join(' ');

  // Transformed samples track
  const sampleXs = [-2, -1, 0, 1, 2];
  const sampleZs = sampleXs.map((x) => applyFlow(x, steps));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Normalizing Flow — 1D Invertible Transformation
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each flow step applies a differentiable invertible map. The transformed density uses
        the change-of-variables formula: <InlineMath math="p_x(x) = p_z(f(x))\,|f'(x)|" />.
      </p>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Flow steps:</label>
          <input type="range" min={0} max={6} step={1} value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value))}
            className="w-24 accent-cyan-500" />
          <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{steps}</span>
        </div>
        <button onClick={() => setShowInverse((v) => !v)}
          className="rounded px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {showInverse ? 'Hide' : 'Show'} base distribution
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
            <text key={v} x={tx(v)} y={padT + plotH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">{v}</text>
          ))}
          {/* Base Gaussian */}
          {showInverse && (
            <polyline points={gaussPoints} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4,2" />
          )}
          {/* Transformed density */}
          <polyline points={transPoints} fill="none" stroke="#06b6d4" strokeWidth={2.5} />
          {/* Sample tracking */}
          {sampleXs.map((x, i) => (
            <g key={i}>
              <circle cx={tx(x)} cy={padT + plotH - 10} r={4} fill="#f59e0b" />
              <circle cx={tx(Math.max(-3.4, Math.min(3.4, sampleZs[i])))} cy={padT + 20} r={4} fill="#06b6d4" />
              <line x1={tx(x)} y1={padT + plotH - 10}
                x2={tx(Math.max(-3.4, Math.min(3.4, sampleZs[i])))} y2={padT + 20}
                stroke="#d1d5db" strokeWidth={0.8} strokeDasharray="2,2" />
            </g>
          ))}
          {/* Legend */}
          <text x={padL + 8} y={padT + 12} fontSize={9} fill="#06b6d4" fontWeight="bold">p_x (transformed)</text>
          {showInverse && <text x={padL + 8} y={padT + 24} fontSize={9} fill="#9ca3af">p_z (base Gaussian)</text>}
          <circle cx={padL + 8} cy={padT + plotH - 10} r={4} fill="#f59e0b" />
          <text x={padL + 16} y={padT + plotH - 6} fontSize={9} fill="#f59e0b">base samples</text>
          <circle cx={padL + 80} cy={padT + 20} r={4} fill="#06b6d4" />
          <text x={padL + 88} y={padT + 24} fontSize={9} fill="#06b6d4">transformed</text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const FLOW_CODE = `import torch
import torch.nn as nn

class AffineCouplingSingle(nn.Module):
    """Single affine coupling layer (RealNVP-style)."""
    def __init__(self, dim):
        super().__init__()
        half = dim // 2
        self.net_s = nn.Sequential(nn.Linear(half, 64), nn.Tanh(), nn.Linear(64, half))
        self.net_t = nn.Sequential(nn.Linear(half, 64), nn.Tanh(), nn.Linear(64, half))

    def forward(self, x):
        x1, x2 = x.chunk(2, dim=1)
        s = self.net_s(x1)
        t = self.net_t(x1)
        y2 = x2 * torch.exp(s) + t
        log_det = s.sum(dim=1)
        return torch.cat([x1, y2], dim=1), log_det

    def inverse(self, y):
        y1, y2 = y.chunk(2, dim=1)
        s = self.net_s(y1)
        t = self.net_t(y1)
        x2 = (y2 - t) * torch.exp(-s)
        return torch.cat([y1, x2], dim=1)


class RealNVP(nn.Module):
    def __init__(self, dim=2, n_layers=6):
        super().__init__()
        self.layers = nn.ModuleList([AffineCouplingSingle(dim) for _ in range(n_layers)])

    def log_prob(self, x):
        log_det_sum = torch.zeros(x.size(0), device=x.device)
        z = x
        for layer in self.layers:
            z, log_det = layer(z)
            log_det_sum += log_det
        # Base distribution: N(0, I)
        log_pz = -0.5 * (z ** 2 + torch.log(torch.tensor(2 * 3.14159))).sum(dim=1)
        return log_pz + log_det_sum  # log p_x(x) = log p_z(z) + log|df/dx|

    def sample(self, n, device='cpu'):
        z = torch.randn(n, 2, device=device)
        x = z
        for layer in reversed(self.layers):
            x = layer.inverse(x)
        return x

# Training: maximize log-likelihood
# model = RealNVP(dim=2, n_layers=6)
# optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
# for x_batch in dataloader:
#     loss = -model.log_prob(x_batch).mean()
#     optimizer.zero_grad(); loss.backward(); optimizer.step()
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NormalizingFlows() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Normalizing Flows
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Normalizing flows model complex distributions by composing a sequence of invertible,
          differentiable transformations of a simple base distribution, enabling exact
          log-likelihood computation via the change-of-variables formula.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Normalizing flows were developed by <strong>Rezende & Mohamed (2015)</strong> for
          improving variational inference posteriors. <strong>Dinh et al. (2014, 2016)</strong>
          (NICE and RealNVP) introduced affine coupling layers, enabling scalable flows for images.
          <strong> Kingma & Glow (2018)</strong> introduced invertible 1×1 convolutions.
          Flow-based models uniquely provide exact likelihoods — unlike GANs (no likelihood)
          or VAEs (approximate lower bound).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Normalizing Flow"
        definition="A normalizing flow is a sequence of invertible, differentiable functions $f = f_K \circ f_{K-1} \circ \cdots \circ f_1: \mathcal{Z} \to \mathcal{X}$ mapping a simple base distribution $p_Z(z)$ (e.g., $\mathcal{N}(0,I)$) to a complex target distribution $p_X(x)$. Given $z \sim p_Z$, samples are $x = f(z)$. The density is $p_X(x) = p_Z(f^{-1}(x))\,|\det J_{f^{-1}}(x)|$ where $J_{f^{-1}}$ is the Jacobian of the inverse."
        notation="'Normalizing' refers to the normalization of the density (total probability = 1). 'Flow' refers to flowing probability mass through the invertible transformation. Key requirement: $f$ must be invertible (bijective) and differentiable with tractable Jacobian determinant."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Change of Variables Formula"
        definition="For an invertible map $x = f(z)$ with $z \sim p_Z$, the transformed density is: $\log p_X(x) = \log p_Z(z) - \log|\det J_f(z)| = \log p_Z(f^{-1}(x)) + \log|\det J_{f^{-1}}(x)|$ where $J_f(z) = \frac{\partial f}{\partial z}$ is the Jacobian matrix. For a composition $f = f_K \circ \cdots \circ f_1$: $\log p_X(x) = \log p_Z(z) - \sum_{k=1}^K \log|\det J_{f_k}(z_k)|$ where $z_k$ is the intermediate representation after step $k$."
        notation="Computing $\det J_f$ for a $d \times d$ Jacobian costs $O(d^3)$ in general. Flow architectures are designed so that $\log|\det J|$ is cheap: triangular Jacobians ($O(d)$), affine coupling layers ($O(d)$), continuous flows (trace-divergence theorem)."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Affine Coupling Layer (RealNVP)"
        definition="An affine coupling layer splits $x = (x_1, x_2)$ and transforms: $y_1 = x_1$, $y_2 = x_2 \odot \exp(s(x_1)) + t(x_1)$ where $s, t: \mathbb{R}^{d/2} \to \mathbb{R}^{d/2}$ are arbitrary neural networks. The Jacobian is lower triangular with $\log|\det J| = \sum_i s(x_1)_i$ — computed in $O(d)$ time. The inverse is $x_2 = (y_2 - t(y_1)) / \exp(s(y_1))$, computed in one forward pass through $s$ and $t$."
        notation="The coupling structure means $s$ and $t$ can be arbitrary (non-invertible) neural networks — only the overall layer needs to be invertible. Stacking with alternating partitions ensures all dimensions are transformed."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Exact Log-Likelihood via Change of Variables"
        statement="For a normalizing flow $x = f_\theta(z)$ with $z \sim p_Z$, the model log-likelihood of a data point $x$ is exactly $\log p_\theta(x) = \log p_Z(f_\theta^{-1}(x)) + \sum_{k=1}^K \log|\det J_{f_k^{-1}}(z_k)|$. No approximation is needed — flows are the only class of deep generative models with exact, tractable likelihoods."
        proof="By the change-of-variables theorem for probability densities: if $X = f(Z)$ is a bijection and $Z$ has density $p_Z$, then $p_X(x) = p_Z(f^{-1}(x)) \cdot |\det J_{f^{-1}}(x)|$. Taking logarithms: $\log p_X(x) = \log p_Z(f^{-1}(x)) + \log|\det J_{f^{-1}}(x)|$. For a composition $f = f_K \circ \cdots \circ f_1$, by the chain rule for determinants $\det J_f = \prod_k \det J_{f_k}$, so $\log|\det J_f| = \sum_k \log|\det J_{f_k}|$. This holds exactly — no stochastic lower bound or approximation. $\square$"
        corollaries={[
          "Training is maximum likelihood: $\\max_\\theta \\frac{1}{n}\\sum_i \\log p_\\theta(x_i)$ is directly optimizable with backpropagation through all layers.",
          "Sampling: $z \\sim p_Z$, $x = f_\\theta(z)$. Density evaluation: $x \\to z = f^{-1}(x)$, compute $\\log p_Z(z) + \\log|\\det J|$. Both operations require one pass through the flow.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Expressive Power of Stacked Affine Couplings"
        statement="A composition of $K$ affine coupling layers can represent any continuous target distribution $p_X$ to arbitrary accuracy (in Kullback-Leibler divergence) given sufficient hidden dimensions in the coupling networks $s$ and $t$ and sufficient depth $K$."
        proof="By the universal approximation theorem for neural networks, $s$ and $t$ can approximate any continuous function. A single affine coupling layer can implement any monotone rearrangement on each half-coordinate. Alternating coupling layers can exchange information between the two halves. By the Brenier theorem, any distribution can be mapped to $\mathcal{N}(0,I)$ via an optimal transport (monotone) map. The composition of alternating affine coupling layers approximates this monotone map to arbitrary precision. $\square$"
        corollaries={[
          "In practice, depth and width are finite, so flows have limited expressive power compared to the theoretical ideal — this motivates continuous normalizing flows (CNFs) with ODEs.",
          "Flows can represent multimodal distributions only if individual layers have sufficient nonlinearity. Purely affine (linear) flows cannot map a Gaussian to a bimodal distribution.",
        ]}
      />

      <FlowVisualizer />

      <ExampleBlock
        title="Planar Flow — Analytical Change of Variables"
        problem="Compute the log-determinant of the Jacobian for a single planar flow $f(z) = z + u \cdot \tanh(w^T z + b)$ where $u, w \in \mathbb{R}^d$, $b \in \mathbb{R}$."
        difficulty="advanced"
        solution={[
          {
            step: 'Jacobian of the planar flow',
            formula: 'J_f(z) = I + u\,\\psi(z)^T, \\quad \\psi(z) = \\tanh\'(w^T z + b)\\, w',
            explanation: 'The Jacobian is rank-1 plus identity, so the determinant is computable in O(d) via the matrix determinant lemma.',
          },
          {
            step: 'Apply matrix determinant lemma: det(I + uv^T) = 1 + v^Tu',
            formula: '|\\det J_f(z)| = |1 + \\psi(z)^T u| = |1 + \\tanh\'(w^T z + b)\\, w^T u|',
            explanation: 'Since tanh\'(·) ∈ (0,1] and we require |1 + w^T u| ≥ 0 (invertibility constraint), we need w^T u ≥ -1.',
          },
          {
            step: 'Log-determinant for the ELBO / likelihood',
            formula: '\\log|\\det J_f| = \\log|1 + \\tanh\'(w^T z + b)\\,w^T u|',
            explanation: 'Computed in O(d) — just a dot product and scalar ops. Stacking K planar flows: sum the log-dets.',
          },
        ]}
      />

      <WarningBlock title="Normalizing Flow Limitations and Gotchas">
        <ul className="space-y-2 text-sm">
          <li><strong>Topological constraints:</strong> A flow must be homeomorphic (continuous bijection). It cannot change the topology of the base distribution — e.g., a flow from a connected Gaussian cannot produce a disconnected distribution. This limits expressiveness for truly multimodal data.</li>
          <li><strong>Memory cost:</strong> Exact likelihood requires storing all intermediate activations for the Jacobian computation. For image-space flows (Glow), this requires large GPU memory. Continuous flows (FFJORD) use memory-efficient ODE solvers.</li>
          <li><strong>Dimension preserving:</strong> Standard flows require input and output to have the same dimension. Generating images requires 3×H×W latent dimensions — very large. Latent flows (e.g., combined with VAEs) address this by operating in compressed spaces.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={FLOW_CODE}
        language="python"
        title="RealNVP Affine Coupling Flow — PyTorch"
        runnable
      />
    </div>
  );
}
