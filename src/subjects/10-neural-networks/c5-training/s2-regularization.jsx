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
// Dropout Mask Visualizer
// ---------------------------------------------------------------------------

const GRID_W = 8, GRID_H = 4;
const TOTAL = GRID_W * GRID_H;

function DropoutViz() {
  const [dropRate, setDropRate] = useState(0.5);
  const [mask, setMask] = useState(() => Array(TOTAL).fill(true));
  const [showScaled, setShowScaled] = useState(true);
  const [training, setTraining] = useState(true);

  const regenerateMask = () => {
    setMask(Array.from({ length: TOTAL }, () => Math.random() >= dropRate));
  };

  const activeCount = mask.filter(Boolean).length;
  const scale = training && showScaled ? 1 / (1 - dropRate) : 1;

  const CELL = 44, GAP = 4;
  const SVG_W = GRID_W * (CELL + GAP) + 20;
  const SVG_H = GRID_H * (CELL + GAP) + 20;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Dropout Mask Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each cell is a neuron. Grayed out = dropped (set to 0). In training, active neurons
        are scaled by <InlineMath math="1/(1-p)" /> to preserve expected value.
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Drop rate p: {dropRate.toFixed(2)}</label>
          <input type="range" min={0} max={0.9} step={0.05} value={dropRate}
            onChange={e => setDropRate(parseFloat(e.target.value))} className="w-28" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={training} onChange={e => setTraining(e.target.checked)} />
          Training mode
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={showScaled} onChange={e => setShowScaled(e.target.checked)} />
          Inverted dropout (scale by 1/(1-p))
        </label>
        <button onClick={regenerateMask}
          className="rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
          New Mask
        </button>
      </div>

      <svg width={SVG_W} height={SVG_H} className="mx-auto block">
        {Array.from({ length: TOTAL }, (_, idx) => {
          const xi = idx % GRID_W, yi = Math.floor(idx / GRID_W);
          const x = 10 + xi * (CELL + GAP), y = 10 + yi * (CELL + GAP);
          const active = !training || mask[idx];
          const value = active ? (1 * scale) : 0;
          return (
            <g key={idx}>
              <rect x={x} y={y} width={CELL} height={CELL} rx={6}
                fill={active ? '#818cf8' : '#e5e7eb'}
                opacity={active ? 0.9 : 0.4}
                stroke={active ? '#4f46e5' : '#d1d5db'} strokeWidth={active ? 1.5 : 1} />
              <text x={x+CELL/2} y={y+CELL/2+5} textAnchor="middle" fontSize={11} fontWeight="600"
                fill={active ? '#fff' : '#9ca3af'}>
                {active ? value.toFixed(1) : '0'}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <span>Active: {training ? activeCount : TOTAL}/{TOTAL} ({training ? ((activeCount/TOTAL)*100).toFixed(0) : 100}%)</span>
        <span>Drop rate: p={dropRate.toFixed(2)}</span>
        <span>Scale factor: {(training && showScaled) ? (1/(1-dropRate)).toFixed(3) : '1.000'}</span>
        <span className="text-indigo-600 dark:text-indigo-400">
          E[output] ≈ {((training ? activeCount/TOTAL : 1) * scale).toFixed(3)} (target: 1.000)
        </span>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Dropout: inverted dropout implementation ───────────────────────────────────
def dropout_manual(x, p, training=True):
    """Inverted dropout: scale active neurons by 1/(1-p) during training."""
    if not training or p == 0:
        return x
    # Bernoulli mask: 1 with probability (1-p), 0 with probability p
    mask = torch.bernoulli(torch.full_like(x, 1 - p))
    return x * mask / (1 - p)  # Scale to preserve expected value

x = torch.ones(4, 10)  # All-ones input
torch.manual_seed(42)
dropped = dropout_manual(x, p=0.5, training=True)
print(f"Manual dropout: {dropped[0].tolist()[:6]}...")
print(f"Expected mean: 1.0, Got: {dropped.mean():.4f}")

# ── Weight decay (L2 regularization) ─────────────────────────────────────────
# L = loss + λ||W||²_F  ↔  update: w ← (1 - 2λη)w - η∇_w L
# PyTorch implements as "weight_decay" in optimizer
optimizer = torch.optim.Adam(nn.Linear(10,10).parameters(),
                              lr=1e-3, weight_decay=1e-4)
# weight_decay=1e-4 adds 1e-4 * ||W||² to the loss

# L1 regularization (manual — not built-in)
def l1_loss(model, lambda_l1):
    return lambda_l1 * sum(p.abs().sum() for p in model.parameters())

# ── Data augmentation ─────────────────────────────────────────────────────────
from torchvision import transforms
augment = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomCrop(32, padding=4),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
    transforms.RandomErasing(p=0.3, scale=(0.02, 0.33)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
print("\\nAugmentation pipeline defined")

# ── Implicit regularization of SGD ────────────────────────────────────────────
# Keskar et al. (2017): small-batch SGD generalizes better due to
# sharp vs flat minima. Large batches can be compensated with:
# - Learning rate warmup + cosine decay
# - Mixup (Zhang et al. 2018): x = λx_i + (1-λ)x_j, y = λy_i + (1-λ)y_j
def mixup(x, y, alpha=0.2):
    lam = torch.distributions.Beta(alpha, alpha).sample()
    idx = torch.randperm(x.size(0))
    x_mix = lam * x + (1 - lam) * x[idx]
    y_a, y_b = y, y[idx]
    loss_fn = lambda pred: lam * F.cross_entropy(pred, y_a) + (1-lam) * F.cross_entropy(pred, y_b)
    return x_mix, loss_fn

x_batch = torch.randn(8, 3, 32, 32)
y_batch = torch.randint(0, 10, (8,))
x_mix, loss_fn = mixup(x_batch, y_batch, alpha=0.4)
print(f"Mixup: {x_batch.shape} → {x_mix.shape}")
print("Loss function handles mixed labels")

# ── Comparison: with and without regularization ───────────────────────────────
class RegNet(nn.Module):
    def __init__(self, dropout_p=0.0):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(20, 64), nn.ReLU(), nn.Dropout(dropout_p),
            nn.Linear(64, 64), nn.ReLU(), nn.Dropout(dropout_p),
            nn.Linear(64, 1)
        )
    def forward(self, x): return self.net(x)

# train_acc and val_acc patterns (illustrative):
print("\\nTypical effect of regularization on gap:")
print("No reg:    train_acc=99%, val_acc=72% (overfit)")
print("Dropout:   train_acc=95%, val_acc=86%")
print("L2+Drop:   train_acc=93%, val_acc=89%")
print("Augment:   train_acc=91%, val_acc=91% (best generalization)")
`;

export default function Regularization() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Regularization Techniques
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Dropout, weight decay, data augmentation, and implicit regularization — the toolkit
          for preventing overfitting and improving generalization in deep networks.
        </p>
      </div>

      <NoteBlock title="The Generalization Puzzle">
        <p>
          Dropout (Srivastava et al., 2014) was a breakthrough regularizer. But modern deep networks
          are heavily overparameterized yet generalize well — a phenomenon that classical statistics
          cannot explain. Zhang et al. (2017) showed that deep networks can memorize random labels,
          yet still generalize on real data. This led to the study of implicit regularization: SGD
          with small batches and appropriate learning rates acts as a regularizer itself (Keskar et al.
          2017, Smith &amp; Le 2018).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 5.3"
        title="Dropout"
        definition="Dropout (Srivastava et al., 2014) randomly sets each neuron's output to 0 with probability $p$ during training, independently at each forward pass. Inverted dropout scales active neurons by $1/(1-p)$ so that the expected output equals the non-dropout output. Formally, the dropped output is $\tilde{h}_i = h_i \cdot m_i / (1-p)$ where $m_i \sim \text{Bernoulli}(1-p)$. At inference, all neurons are active and no scaling is needed."
        notation="Dropout probability $p \in [0,1]$; common values: $p=0.5$ for FC layers, $p=0.1$-$0.3$ for convolutional layers. Inverted dropout allows identical behavior at train and test time — only the scale differs. Spatial dropout drops entire feature maps (channels) in CNNs; variational dropout uses the same mask for all timesteps in RNNs."
      />

      <DropoutViz />

      <DefinitionBlock
        label="Definition 5.4"
        title="Weight Decay (L2 Regularization)"
        definition="Weight decay adds an L2 penalty to the loss: $\tilde{\mathcal{L}}(\theta) = \mathcal{L}(\theta) + \frac{\lambda}{2}\|\theta\|^2$. The gradient becomes $\nabla_\theta \tilde{\mathcal{L}} = \nabla_\theta \mathcal{L} + \lambda\theta$, so each parameter update is: $\theta \leftarrow \theta - \eta(\nabla_\theta \mathcal{L} + \lambda\theta) = (1-\eta\lambda)\theta - \eta\nabla_\theta\mathcal{L}$. The factor $(1-\eta\lambda) < 1$ shrinks weights toward zero each step — hence 'weight decay'. With Adam, weight decay and L2 regularization are NOT equivalent: AdamW (Loshchilov &amp; Hutter, 2019) implements true weight decay separately from the gradient step."
        notation="$\lambda$ is the regularization strength. L1 regularization: $|\theta|$ instead of $\theta^2$ — promotes sparsity (Lasso). Elastic Net combines L1 and L2. For transformers, $\lambda \approx 0.01$-$0.1$ is typical. Do NOT apply weight decay to biases or LayerNorm parameters."
      />

      <TheoremBlock
        label="Theorem 5.2"
        title="Dropout as Model Averaging"
        statement="Training a neural network with dropout is equivalent (approximately) to training an ensemble of $2^n$ different networks (one for each dropout mask pattern) with shared weights, and averaging their predictions at inference. This gives a geometric mean of the ensemble predictions in probability space (for sigmoid outputs) and an arithmetic mean in log-probability space."
        proof="Each dropout mask $\mathbf{m}$ defines a thinned network $f_\mathbf{m}(\mathbf{x})$. Dropout training minimizes $\mathbb{E}_\mathbf{m}[\mathcal{L}(f_\mathbf{m}(\mathbf{x}), y)]$ — the expected loss over mask distributions. At inference with all neurons active (scaled), the output $f(\mathbf{x})$ approximates $\mathbb{E}_\mathbf{m}[f_\mathbf{m}(\mathbf{x})]$ by the linearity of expectation through the affine parts of the network. For nonlinear outputs (softmax), the approximation is a geometric mean. The weight sharing forces the ensemble members to cooperate, unlike independent ensemble training. $\square$"
        corollaries={[
          "MC Dropout (Gal & Ghahramani 2016): keep dropout active at inference time and run $T$ forward passes — the variance of outputs approximates Bayesian uncertainty. Useful for uncertainty quantification.",
          "Dropout rate should be tuned: too low (p<0.1) provides little regularization; too high (p>0.7) makes training unstable and slow.",
          "Data augmentation can be seen as adding regularization by increasing the effective dataset size and enforcing invariances in the model.",
        ]}
      />

      <ExampleBlock
        title="Choosing Regularization Strategies"
        difficulty="intermediate"
        problem="You have a CNN training on CIFAR-10 with 93% training accuracy and 75% validation accuracy. Suggest a regularization strategy and explain why."
        solution={[
          { step: 'Diagnose overfitting', formula: '\\text{gap} = 93\\% - 75\\% = 18\\%', explanation: 'Large train-val gap = overfitting. The model has learned training-specific features.' },
          { step: 'Add data augmentation (first)', formula: '\\text{RandomHorizontalFlip, RandomCrop, ColorJitter}', explanation: 'Most effective for image tasks. Increases effective dataset diversity. Often closes 5-10% of the gap without additional compute at inference.' },
          { step: 'Add dropout to FC layers', formula: 'h = \\text{Dropout}(0.5)(\\text{FC}(h))', explanation: 'Typical p=0.5 for fully-connected layers. Convolutional layers benefit from smaller p (0.1-0.2) or spatial dropout.' },
          { step: 'Add weight decay', formula: 'L_{\\text{total}} = L_{\\text{CE}} + \\lambda \\|W\\|^2_F, \\quad \\lambda \\in [10^{-4}, 10^{-2}]', explanation: 'Prevents any single weight from becoming too large. Use AdamW (not Adam + L2) for correct weight decay behavior.' },
        ]}
      />

      <WarningBlock title="Regularization Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Adam + L2 regularization:</strong> Adding L2 to the loss with Adam is NOT equivalent to weight decay — Adam adapts the learning rate per parameter, which distorts the L2 effect. Use AdamW (torch.optim.AdamW) which implements weight decay correctly as parameter shrinkage.</li>
          <li><strong>Dropout in batch-normalized networks:</strong> Dropout after BatchNorm can cause training/inference mismatch in BN statistics (different effective batch sizes). Either use dropout before BN, or avoid dropout in the conv layers and only use it in FC layers.</li>
          <li><strong>Too much regularization:</strong> Over-regularized models underfit — training accuracy also drops. Start with standard values (dropout p=0.5, weight_decay=1e-4) and tune based on the train-val gap, not val accuracy alone.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="Dropout, Weight Decay, Data Augmentation — PyTorch" runnable />
    </div>
  );
}
