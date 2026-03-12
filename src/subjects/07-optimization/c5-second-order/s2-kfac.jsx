import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Visualize block-diagonal Fisher approximation as a diagram
// Show: full Fisher (dense), block-diagonal (K-FAC), diagonal (AdaGrad)

function FisherBlockDiagram({ nLayers, approx }) {
  const cellSize = 14;
  const pad = 4;
  const layerSizes = [4, 6, 4, 5];
  const n = layerSizes.slice(0, nLayers).reduce((a, b) => a + b, 0);
  const W = n * cellSize + 2 * pad;
  const H = n * cellSize + 2 * pad;

  let cumSizes = [0];
  for (let i = 0; i < nLayers; i++) {
    cumSizes.push(cumSizes[cumSizes.length - 1] + layerSizes[i]);
  }

  // Determine if cell (i, j) is filled based on approximation
  function isFilled(i, j) {
    if (approx === 'full') return true;
    if (approx === 'diagonal') return i === j;
    if (approx === 'block') {
      // Block diagonal: same layer block
      for (let l = 0; l < nLayers; l++) {
        const start = cumSizes[l], end = cumSizes[l + 1];
        if (i >= start && i < end && j >= start && j < end) return true;
      }
      return false;
    }
    return false;
  }

  const cells = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const filled = isFilled(i, j);
      const isDiag = i === j;
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={pad + j * cellSize}
          y={pad + i * cellSize}
          width={cellSize - 1}
          height={cellSize - 1}
          fill={isDiag ? '#1d4ed8' : filled ? '#93c5fd' : '#f3f4f6'}
          rx="1"
        />
      );
    }
  }

  // Block boundary lines
  const blockLines = cumSizes.slice(1, -1).map((c, i) => (
    <React.Fragment key={i}>
      <line x1={pad + c * cellSize} y1={pad} x2={pad + c * cellSize} y2={H - pad} stroke="#ef4444" strokeWidth="1.5" />
      <line x1={pad} y1={pad + c * cellSize} x2={W - pad} y2={pad + c * cellSize} stroke="#ef4444" strokeWidth="1.5" />
    </React.Fragment>
  ));

  return (
    <svg width={W} height={H} className="rounded border border-gray-300 dark:border-gray-600">
      {cells}
      {approx === 'block' && blockLines}
    </svg>
  );
}

function InteractiveKFAC() {
  const [approx, setApprox] = useState('block');
  const [nLayers, setNLayers] = useState(3);

  const nParams = [4, 6, 4, 5].slice(0, nLayers).reduce((a, b) => a + b, 0);
  const nFull = nParams * nParams;
  const layerSizes = [4, 6, 4, 5].slice(0, nLayers);
  const nBlock = layerSizes.reduce((s, sz) => s + sz * sz, 0);
  const nDiag = nParams;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Block-Diagonal Fisher Approximation</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        K-FAC uses a block-diagonal approximation to the Fisher matrix. Each block corresponds
        to a layer. Red lines mark block boundaries.
      </p>
      <div className="flex flex-wrap gap-6 items-start">
        <div className="flex flex-col items-center gap-2">
          <FisherBlockDiagram nLayers={nLayers} approx={approx} />
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Dark blue = diagonal, Light blue = off-diagonal, Gray = zero
          </p>
        </div>
        <div className="flex flex-col gap-4 min-w-[200px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Approximation</label>
            {['full', 'block', 'diagonal'].map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer mb-1">
                <input type="radio" value={opt} checked={approx === opt} onChange={e => setApprox(e.target.value)} />
                {opt === 'full' ? 'Full Fisher' : opt === 'block' ? 'Block-diagonal (K-FAC)' : 'Diagonal (AdaGrad)'}
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Layers: {nLayers}
            </label>
            <input type="range" min="2" max="4" step="1" value={nLayers} onChange={e => setNLayers(+e.target.value)} className="w-full" />
          </div>
          <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs space-y-1">
            <p>Total params: <strong>{nParams}</strong></p>
            <p>Full Fisher: <strong>{nFull}</strong> entries</p>
            <p>Block-diag: <strong>{nBlock}</strong> entries</p>
            <p>Diagonal: <strong>{nDiag}</strong> entries</p>
            <p className="text-green-700 dark:text-green-400">
              K-FAC savings: {((1 - nBlock / nFull) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KFAC() {
  return (
    <div className="space-y-8">
      <InteractiveKFAC />

      <DefinitionBlock title="K-FAC: Kronecker-Factored Approximate Curvature">
        <p>
          <strong>K-FAC</strong> (Martens & Grosse, 2015) approximates the Fisher information
          matrix for a neural network layer using a Kronecker product:
        </p>
        <BlockMath math="\hat{F}_\ell \approx \hat{A}_{\ell-1} \otimes \hat{G}_\ell," />
        <p className="mt-2">
          where <InlineMath math="\hat{A}_{\ell-1} = \mathbb{E}[a_{\ell-1} a_{\ell-1}^\top]" /> is
          the covariance of layer activations and
          <InlineMath math="\hat{G}_\ell = \mathbb{E}[g_\ell g_\ell^\top]" /> is the covariance
          of pre-activation gradients. The vec of the weight matrix satisfies
          <InlineMath math="\operatorname{vec}(W_\ell) \in \mathbb{R}^{d_{\ell-1} d_\ell}" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Kronecker Product Inverse">
        <p>
          The key computational advantage of K-FAC comes from the identity:
        </p>
        <BlockMath math="(A \otimes G)^{-1} = A^{-1} \otimes G^{-1}." />
        <p className="mt-2">
          This means the natural gradient update can be computed as:
        </p>
        <BlockMath math="\hat{F}_\ell^{-1} \operatorname{vec}(\nabla_{W_\ell} \mathcal{L}) = \operatorname{vec}\!\left(\hat{G}_\ell^{-1} \nabla_{W_\ell} \mathcal{L}\; \hat{A}_{\ell-1}^{-1}\right)." />
        <p className="mt-2">
          Inverting two small matrices instead of one large one reduces cost from
          <InlineMath math="O((d_{\ell-1} d_\ell)^3)" /> to
          <InlineMath math="O(d_{\ell-1}^3 + d_\ell^3)" />.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="K-FAC as Block-Diagonal Fisher"
        proof="For a linear layer with weights W_ℓ ∈ ℝ^{d_ℓ × d_{ℓ-1}}, the Fisher block is F_ℓ = E[∇_{vec(Wℓ)} log p · ∇_{vec(Wℓ)} log p⊤]. The gradient is vec(∇_{Wℓ}) = g_ℓ ⊗ a_{ℓ-1} (outer product of pre-activation gradient and activation). Thus F_ℓ = E[(g_ℓ⊗a_{ℓ-1})(g_ℓ⊗a_{ℓ-1})⊤] = E[g_ℓg_ℓ⊤ ⊗ a_{ℓ-1}a_{ℓ-1}⊤]. Under the assumption that g_ℓ and a_{ℓ-1} are independent (approximately true), this factors as Ĝ_ℓ ⊗ Â_{ℓ-1}."
      >
        <p>
          For a linear layer <InlineMath math="h_\ell = W_\ell a_{\ell-1}" />, the Fisher block is:
        </p>
        <BlockMath math="F_\ell = \mathbb{E}\!\left[g_\ell g_\ell^\top \otimes a_{\ell-1} a_{\ell-1}^\top\right] \approx \mathbb{E}[g_\ell g_\ell^\top] \otimes \mathbb{E}[a_{\ell-1} a_{\ell-1}^\top] = \hat{G}_\ell \otimes \hat{A}_{\ell-1}," />
        <p className="mt-2">
          where the approximation assumes independence of <InlineMath math="g_\ell" /> and
          <InlineMath math="a_{\ell-1}" />, which holds approximately for networks with many layers.
        </p>
      </TheoremBlock>

      <ExampleBlock title="K-FAC in Practice: Damping and Momentum">
        <p>
          In practice, K-FAC uses damping for numerical stability:
        </p>
        <BlockMath math="\hat{F}_\ell^{-1} \approx (\hat{A}_{\ell-1} + \pi_\ell \lambda I)^{-1} \otimes (\hat{G}_\ell + \lambda/\pi_\ell I)^{-1}," />
        <p className="mt-2">
          where <InlineMath math="\lambda" /> is the damping factor and <InlineMath math="\pi_\ell" />
          is a scale factor. Running averages of <InlineMath math="\hat{A}" /> and <InlineMath math="\hat{G}" />
          are updated less frequently than gradient steps (e.g., every 10–100 steps) to amortize cost.
          EK-FAC (Eigenbasis K-FAC) decomposes <InlineMath math="\hat{A}, \hat{G}" /> into eigenbases
          for exact rescaling.
        </p>
      </ExampleBlock>

      <WarningBlock title="K-FAC Approximation Quality Degrades for Small Layers">
        <p>
          The Kronecker factorization approximates the Fisher as if activations and pre-activation
          gradients are independent. This is more accurate for deep networks with many layers
          (where signals become more decorrelated) than for shallow networks. Additionally,
          K-FAC is defined for weight matrices — it does not directly handle non-standard
          architectures like attention layers without modification.
          Researchers have extended K-FAC to convolutions (via spatial averaging)
          and attention (via structural approximations).
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np

def kfac_update(grad_W, A_inv, G_inv):
    """
    K-FAC update: computes G_inv @ grad_W @ A_inv (in weight-space).
    grad_W: (d_out, d_in) gradient matrix
    A_inv: (d_in, d_in) inverse activation covariance
    G_inv: (d_out, d_out) inverse gradient covariance
    Returns the natural gradient in weight-matrix form.
    """
    return G_inv @ grad_W @ A_inv

class KFACLayer:
    def __init__(self, d_in, d_out, decay=0.95, damping=1e-3):
        self.decay = decay
        self.damping = damping
        self.A = np.eye(d_in)   # activation covariance
        self.G = np.eye(d_out)  # gradient covariance

    def update_stats(self, a, g):
        """Update running averages of A and G."""
        self.A = self.decay * self.A + (1 - self.decay) * np.outer(a, a)
        self.G = self.decay * self.G + (1 - self.decay) * np.outer(g, g)

    def natural_gradient(self, grad_W):
        """Compute K-FAC natural gradient."""
        pi = np.sqrt(np.trace(self.G) / np.trace(self.A))
        A_inv = np.linalg.inv(self.A + self.damping / pi * np.eye(self.A.shape[0]))
        G_inv = np.linalg.inv(self.G + self.damping * pi * np.eye(self.G.shape[0]))
        return kfac_update(grad_W, A_inv, G_inv)

# Demo
rng = np.random.default_rng(42)
d_in, d_out = 8, 6
layer = KFACLayer(d_in, d_out)

# Simulate some gradient statistics
for _ in range(50):
    a = rng.standard_normal(d_in)
    g = rng.standard_normal(d_out)
    layer.update_stats(a, g)

grad_W = rng.standard_normal((d_out, d_in))
ng = layer.natural_gradient(grad_W)

print(f"Gradient W shape: {grad_W.shape}")
print(f"Natural gradient shape: {ng.shape}")
print(f"||grad_W|| = {np.linalg.norm(grad_W):.4f}")
print(f"||natural grad|| = {np.linalg.norm(ng):.4f}")
print(f"Ratio (curvature scaling): {np.linalg.norm(ng)/np.linalg.norm(grad_W):.4f}")
`} />
    </div>
  );
}
