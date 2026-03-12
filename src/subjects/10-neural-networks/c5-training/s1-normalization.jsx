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
// Before/After Normalization Distribution Visualizer
// ---------------------------------------------------------------------------

function gaussKDE(data, xs, bw) {
  return xs.map(x => data.reduce((s, d) => s + Math.exp(-((x-d)**2)/(2*bw**2)), 0) / (data.length * bw * Math.sqrt(2*Math.PI)));
}

function NormViz() {
  const [mode, setMode] = useState('BatchNorm');
  const [batchIdx, setBatchIdx] = useState(0);

  // Simulate 4 samples, 3 features before normalization (skewed, different scales)
  const rawData = [
    [0.5, 10, -2],
    [1.5, 14,  3],
    [2.5, 8,   1],
    [3.5, 12, -1],
  ];

  // BatchNorm: normalize over batch dim (per feature)
  const batchNorm = (data) => {
    const n = data.length, f = data[0].length;
    return data.map(row => row.map((v, j) => {
      const mean = data.reduce((s,r)=>s+r[j],0)/n;
      const std = Math.sqrt(data.reduce((s,r)=>s+(r[j]-mean)**2,0)/n + 1e-5);
      return (v - mean) / std;
    }));
  };

  // LayerNorm: normalize over feature dim (per sample)
  const layerNorm = (data) => {
    return data.map(row => {
      const mean = row.reduce((s,v)=>s+v,0)/row.length;
      const std  = Math.sqrt(row.reduce((s,v)=>s+(v-mean)**2,0)/row.length + 1e-5);
      return row.map(v => (v-mean)/std);
    });
  };

  const normalized = mode === 'BatchNorm' ? batchNorm(rawData) : layerNorm(rawData);

  const W = 420, H = 160;
  const xMin = -12, xMax = 16, nxMin = -3, nxMax = 3;
  const xs = Array.from({ length: 100 }, (_, i) => xMin + (xMax-xMin)*i/99);
  const nxs = Array.from({ length: 100 }, (_, i) => nxMin + (nxMax-nxMin)*i/99);

  const rawFeature = rawData.map(r => r[batchIdx]);
  const normFeature = normalized.map(r => r[batchIdx]);
  const rawKDE = gaussKDE(rawFeature, xs, 1.5);
  const normKDE = gaussKDE(normFeature, nxs, 0.3);
  const maxRaw  = Math.max(...rawKDE, 0.01);
  const maxNorm = Math.max(...normKDE, 0.01);

  const toSVGRaw  = (x, y) => ({ x: (x-xMin)/(xMax-xMin)*W, y: H - y/maxRaw*H*0.9 });
  const toSVGNorm = (x, y) => ({ x: (x-nxMin)/(nxMax-nxMin)*W, y: H - y/maxNorm*H*0.9 });

  const rawPath  = 'M' + xs.map((x,i) => { const p=toSVGRaw(x, rawKDE[i]); return `${p.x},${p.y}`; }).join(' L');
  const normPath = 'M' + nxs.map((x,i) => { const p=toSVGNorm(x, normKDE[i]); return `${p.x},${p.y}`; }).join(' L');

  const rawMean  = rawFeature.reduce((s,v)=>s+v,0)/rawFeature.length;
  const rawStd   = Math.sqrt(rawFeature.reduce((s,v)=>s+(v-rawMean)**2,0)/rawFeature.length);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Normalization: Before &amp; After Distribution
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        See how BatchNorm and LayerNorm transform the activation distribution.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {['BatchNorm', 'LayerNorm'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
            {m}
          </button>
        ))}
        <div className="flex gap-1 items-center ml-2">
          <span className="text-xs text-gray-500">Feature:</span>
          {[0,1,2].map(j => (
            <button key={j} onClick={() => setBatchIdx(j)}
              className={`rounded px-2 py-1 text-xs ${batchIdx===j ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
              {j}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Before (raw activations, feature {batchIdx})</p>
          <svg width={W} height={H} className="rounded bg-gray-50 dark:bg-gray-800/50 w-full">
            <path d={rawPath} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth={2} />
            {rawFeature.map((v,i) => { const p=toSVGRaw(v,0); return <line key={i} x1={p.x} y1={H-2} x2={p.x} y2={H-15} stroke="#ef4444" strokeWidth={2} />; })}
          </svg>
          <p className="mt-1 text-xs text-gray-500 text-center">μ={rawMean.toFixed(2)}, σ={rawStd.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">After {mode} (standardized)</p>
          <svg width={W} height={H} className="rounded bg-gray-50 dark:bg-gray-800/50 w-full">
            <path d={normPath} fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth={2} />
            {normFeature.map((v,i) => { const p=toSVGNorm(v,0); return <line key={i} x1={p.x} y1={H-2} x2={p.x} y2={H-15} stroke="#6366f1" strokeWidth={2} />; })}
            <line x1={toSVGNorm(0,0).x} y1={0} x2={toSVGNorm(0,0).x} y2={H} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,2" />
          </svg>
          <p className="mt-1 text-xs text-gray-500 text-center">μ≈0, σ≈1 (by construction)</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        {mode === 'BatchNorm' ? 'BatchNorm normalizes over batch (column-wise): each feature has μ=0, σ=1 across the batch.' : 'LayerNorm normalizes over features (row-wise): each sample has μ=0, σ=1 across its features.'}
      </p>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import numpy as np

# ── BatchNorm manual implementation ───────────────────────────────────────────
def batchnorm_manual(x, gamma, beta, eps=1e-5, momentum=0.1,
                     running_mean=None, running_var=None, training=True):
    """
    x: [N, C, H, W] or [N, C]
    gamma, beta: learnable scale/shift [C]
    """
    if x.dim() == 4:  # 2D spatial
        N, C, H, W = x.shape
        # Compute stats over (N, H, W) for each channel C
        mean = x.mean(dim=(0, 2, 3), keepdim=True)
        var  = x.var(dim=(0, 2, 3), keepdim=True, unbiased=False)
    else:  # 1D (N, C)
        mean = x.mean(dim=0, keepdim=True)
        var  = x.var(dim=0, keepdim=True, unbiased=False)

    if training:
        x_norm = (x - mean) / torch.sqrt(var + eps)
        if running_mean is not None:
            running_mean.mul_(1 - momentum).add_(mean.squeeze() * momentum)
            running_var.mul_(1 - momentum).add_(var.squeeze() * momentum)
    else:
        x_norm = (x - running_mean) / torch.sqrt(running_var + eps)

    return gamma * x_norm + beta

# Verify against PyTorch
x = torch.randn(4, 8)  # batch=4, features=8
gamma, beta = torch.ones(8), torch.zeros(8)
running_mean, running_var = torch.zeros(8), torch.ones(8)

manual_out = batchnorm_manual(x, gamma, beta, running_mean=running_mean, running_var=running_var)
bn_layer = nn.BatchNorm1d(8, eps=1e-5, momentum=0.1)
bn_layer.weight.data.fill_(1); bn_layer.bias.data.fill_(0)
official_out = bn_layer(x)

print(f"BatchNorm max diff: {(manual_out - official_out).abs().max():.6f}")

# ── LayerNorm (used in Transformers) ─────────────────────────────────────────
def layernorm_manual(x, gamma, beta, eps=1e-5):
    """Normalize over the last dimension (feature dim)."""
    mean = x.mean(dim=-1, keepdim=True)
    var  = x.var(dim=-1, keepdim=True, unbiased=False)
    x_norm = (x - mean) / torch.sqrt(var + eps)
    return gamma * x_norm + beta

x_seq = torch.randn(4, 10, 512)  # [batch, seq_len, d_model]
gamma_ln, beta_ln = torch.ones(512), torch.zeros(512)
manual_ln = layernorm_manual(x_seq, gamma_ln, beta_ln)
ln_layer  = nn.LayerNorm(512)
official_ln = ln_layer(x_seq)
print(f"LayerNorm max diff: {(manual_ln - official_ln).abs().max():.6f}")

# ── Why BatchNorm helps: internal covariate shift visualization ───────────────
print("\\nActivation statistics without and with BatchNorm:")
print(f"{'Layer':<8} {'Before BN mean':>15} {'Before BN std':>14}")

model_no_bn  = nn.Sequential(*[nn.Linear(64, 64) for _ in range(5)])
model_with_bn = nn.Sequential(*[layer for i in range(5)
                                 for layer in [nn.Linear(64, 64), nn.BatchNorm1d(64), nn.ReLU()]])
x0 = torch.randn(32, 64)
h = x0
for i, layer in enumerate(model_no_bn):
    h = torch.relu(layer(h))
    if i % 2 == 0:
        print(f"  L{i:<4}  mean={h.mean():.4f}  std={h.std():.4f}")
`;

export default function Normalization() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Batch &amp; Layer Normalization
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Normalization techniques that stabilize training, enable higher learning rates, and act
          as regularizers — BatchNorm, LayerNorm, GroupNorm, and internal covariate shift.
        </p>
      </div>

      <NoteBlock title="Normalization History">
        <p>
          BatchNorm (Ioffe &amp; Szegedy, 2015) revolutionized deep learning training speed and stability,
          becoming the default for CNNs. LayerNorm (Ba et al., 2016) was developed for RNNs where
          batch statistics vary with sequence position, and became the standard for Transformers.
          GroupNorm (Wu &amp; He, 2018) bridges the two, useful for small batches. RMSNorm (Zhang &amp; Sennrich, 2019)
          further simplifies LayerNorm used in modern LLMs.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 5.1"
        title="Batch Normalization"
        definition="BatchNorm normalizes activations across the batch dimension. For a mini-batch $\{x_1,\ldots,x_N\}$ at layer $l$: $\mu_\mathcal{B} = \frac{1}{N}\sum_i x_i$, $\sigma^2_\mathcal{B} = \frac{1}{N}\sum_i (x_i - \mu_\mathcal{B})^2$, $\hat{x}_i = (x_i - \mu_\mathcal{B})/\sqrt{\sigma^2_\mathcal{B} + \varepsilon}$, $y_i = \gamma \hat{x}_i + \beta$. Here $\gamma, \beta$ are learnable scale and shift parameters (one per feature/channel), and $\varepsilon > 0$ prevents division by zero. At inference, running statistics (exponential moving average of batch statistics) replace batch statistics."
        notation="For Conv layers: normalization over $(N,H,W)$ axes per channel $C$. For FC layers: over the $N$ batch axis per feature. The running statistics allow inference on a single sample. $\gamma$ and $\beta$ allow the network to undo normalization if beneficial."
      />

      <NormViz />

      <DefinitionBlock
        label="Definition 5.2"
        title="Layer Normalization &amp; GroupNorm"
        definition="LayerNorm normalizes over the feature dimension (not batch): $\hat{x} = (x - \mu_x)/\sqrt{\sigma^2_x + \varepsilon}$ where $\mu_x = \frac{1}{H}\sum_j x_j$ and $\sigma^2_x = \frac{1}{H}\sum_j(x_j-\mu_x)^2$ over all features $H$ for one sample. GroupNorm divides channels into $G$ groups and normalizes within each group, bridging BatchNorm ($G=1$ over all channels) and InstanceNorm ($G=C$, one group per channel). RMSNorm simplifies LayerNorm by removing mean centering: $\hat{x}_i = x_i / \text{RMS}(\mathbf{x})$ where $\text{RMS}(\mathbf{x}) = \sqrt{\frac{1}{H}\sum_j x_j^2}$."
        notation="LayerNorm statistics are computed per sample — no dependence on batch size. This makes it suitable for: (1) RNNs (different seq positions have different stats). (2) Small-batch training. (3) Transformers (standard choice). (4) Inference with batch size 1. RMSNorm removes mean subtraction (~10% faster), used in LLaMA, PaLM."
      />

      <TheoremBlock
        label="Theorem 5.1"
        title="BatchNorm as Regularizer"
        statement="BatchNorm introduces noise during training: the per-batch mean and variance estimates differ from the true population statistics by $O(1/\sqrt{N})$, acting as stochastic regularization similar to dropout. This noise prevents overfitting and reduces the need for other regularizers. The regularization strength decreases as batch size $N$ increases, explaining why large-batch training often requires explicit regularization (weight decay, dropout) to compensate."
        proof="The mini-batch estimators $\hat{\mu} = \frac{1}{N}\sum_i x_i$ and $\hat{\sigma}^2 = \frac{1}{N}\sum_i (x_i - \hat{\mu})^2$ are random variables. By CLT, $\hat{\mu} \sim \mathcal{N}(\mu, \sigma^2/N)$, so the normalized activation $\hat{x}_i = (x_i - \hat{\mu})/\hat{\sigma}$ depends on all other batch elements — each activation sees slightly different normalization noise. This perturbation acts like random regularization. For $N \to \infty$: noise $\to 0$ and BatchNorm reduces to a deterministic normalization. $\square$"
        corollaries={[
          "BN enables training with higher learning rates by smoothing the loss landscape: normalized activations reduce the sensitivity of gradients to parameter initialization.",
          "BN implicitly tunes the effective learning rate: if layer activations double, BN renormalizes them, making the gradient effectively smaller (scale invariance of parameters under BN).",
          "BatchNorm is problematic for (1) small batches (N<8: noisy statistics), (2) online learning (N=1), (3) recurrent networks (statistics change with sequence position). Use LayerNorm in these cases.",
        ]}
      />

      <ExampleBlock
        title="Manual BatchNorm Forward Pass"
        difficulty="advanced"
        problem="Apply BatchNorm to a batch of 4 activations for one feature: $x = [2, 4, 6, 8]$. Use $\gamma = 1$, $\beta = 0$, $\varepsilon = 10^{-5}$."
        solution={[
          { step: 'Compute batch mean', formula: '\\mu = \\frac{2+4+6+8}{4} = 5', explanation: 'Mean over the batch dimension.' },
          { step: 'Compute batch variance', formula: '\\sigma^2 = \\frac{(2-5)^2+(4-5)^2+(6-5)^2+(8-5)^2}{4} = \\frac{9+1+1+9}{4} = 5', explanation: 'Variance over the batch (biased estimator used in BN).' },
          { step: 'Normalize', formula: '\\hat{x} = \\frac{x - 5}{\\sqrt{5 + 10^{-5}}} \\approx \\frac{[{-3},{-1},{1},{3}]}{2.236} = [{-1.342},{-0.447},{0.447},{1.342}]', explanation: 'Subtract mean and divide by std. Result has mean≈0, std≈1.' },
          { step: 'Scale and shift', formula: 'y = \\gamma \\hat{x} + \\beta = 1 \\cdot \\hat{x} + 0 = \\hat{x}', explanation: 'With γ=1, β=0 (initialized values), output equals normalized input.' },
        ]}
      />

      <WarningBlock title="Normalization Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>BatchNorm at inference:</strong> Switch to model.eval() before inference — this uses running statistics instead of batch statistics. Forgetting this gives different (often worse) results at test time, especially with small test batches.</li>
          <li><strong>BatchNorm with small batches:</strong> Batch size &lt; 8 makes BN statistics unreliable. Use GroupNorm or LayerNorm for small-batch settings (e.g., detection/segmentation with high-resolution images).</li>
          <li><strong>BN before or after activation:</strong> The original paper places BN before activation (Conv→BN→ReLU). The pre-activation ResNet (He et al. 2016b) places it as BN→ReLU→Conv, often performing slightly better. Be consistent within an architecture.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="BatchNorm & LayerNorm — Manual Implementation & Verification" runnable />
    </div>
  );
}
