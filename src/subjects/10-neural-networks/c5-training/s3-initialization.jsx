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
// Activation Variance vs Layer Depth: Xavier vs He
// ---------------------------------------------------------------------------

function sigmoid_approx(x) { return 1 / (1 + Math.exp(-x)); }

function simulateVariance(nLayers, initMode, activation) {
  const N = 64; // width
  let vars = [1.0]; // input variance
  for (let l = 0; l < nLayers; l++) {
    const fanIn = N, fanOut = N;
    let initVar;
    if (initMode === 'Xavier') {
      initVar = 2 / (fanIn + fanOut);      // Xavier/Glorot
    } else if (initMode === 'He') {
      initVar = 2 / fanIn;                  // He/Kaiming
    } else {
      initVar = 1 / fanIn;                  // Simple (too small)
    }

    const preActVar = vars[vars.length - 1] * fanIn * initVar;
    // Variance after activation (approximation)
    let postActVar;
    if (activation === 'ReLU') {
      postActVar = preActVar / 2;  // ReLU kills half the variance
    } else if (activation === 'tanh') {
      postActVar = Math.min(preActVar, 1) * 0.63;  // tanh saturates
    } else {
      postActVar = preActVar;  // Linear (no nonlinearity)
    }
    vars.push(Math.max(1e-10, postActVar));
  }
  return vars;
}

function InitViz() {
  const [activation, setActivation] = useState('ReLU');
  const [nLayers, setNLayers] = useState(20);

  const methods = ['Xavier', 'He', 'Simple'];
  const colors  = { Xavier: '#6366f1', He: '#10b981', Simple: '#ef4444' };

  const allVars = Object.fromEntries(methods.map(m => [m, simulateVariance(nLayers, m, activation)]));

  const W = 500, H = 200;
  const xMin = 0, xMax = nLayers;
  // Log scale y
  const maxVar = Math.max(...Object.values(allVars).flat().filter(v => isFinite(v)));
  const minVar = Math.min(...Object.values(allVars).flat().filter(v => v > 0 && isFinite(v)));
  const yLogMin = Math.log10(Math.max(1e-10, minVar)) - 0.5;
  const yLogMax = Math.log10(maxVar) + 0.5;

  const toSVG = (x, v) => ({
    x: (x / xMax) * W,
    y: H - ((Math.log10(Math.max(1e-10, v)) - yLogMin) / (yLogMax - yLogMin)) * H,
  });

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Activation Variance vs Layer Depth
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Watch how variance propagates through layers. He init is designed for ReLU;
        Xavier for tanh/sigmoid. Y-axis is log scale.
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex gap-1">
          {['ReLU', 'tanh', 'Linear'].map(a => (
            <button key={a} onClick={() => setActivation(a)}
              className={`rounded px-3 py-1 text-sm font-semibold ${activation === a ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Layers: {nLayers}</label>
          <input type="range" min={5} max={50} value={nLayers} onChange={e => setNLayers(+e.target.value)} className="w-28" />
        </div>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800/50">
        {/* Grid lines at log10 = -6,-4,-2,0,2 */}
        {[-6,-4,-2,0,2,4].map(logv => {
          const p = toSVG(0, Math.pow(10, logv));
          if (p.y < 0 || p.y > H) return null;
          return <line key={logv} x1={0} y1={p.y} x2={W} y2={p.y}
            stroke={logv===0?'#94a3b8':'#e5e7eb'} strokeWidth={logv===0?1.5:0.8}
            className="dark:stroke-gray-600" />;
        })}

        {/* Plot each method */}
        {methods.map(m => {
          const vars = allVars[m];
          const pts = vars.map((v, i) => toSVG(i, v));
          const path = 'M' + pts.map(p => `${p.x},${p.y}`).join(' L');
          return <path key={m} d={path} fill="none" stroke={colors[m]} strokeWidth={2.5} />;
        })}

        {/* Y-axis labels */}
        {[-4,-2,0,2].map(logv => {
          const p = toSVG(0, Math.pow(10, logv));
          if (p.y < 0 || p.y > H) return null;
          return <text key={logv} x={4} y={p.y+4} fontSize={9} fill="#9ca3af">10^{logv}</text>;
        })}
      </svg>

      <div className="mt-3 flex gap-4 justify-center text-xs">
        {methods.map(m => {
          const finalVar = allVars[m][nLayers];
          return (
            <span key={m} className="flex items-center gap-1">
              <span className="w-3 h-1.5 rounded inline-block" style={{background: colors[m]}} />
              <span className="text-gray-600 dark:text-gray-400">{m} (σ²={finalVar < 1e-6 ? finalVar.toExponential(1) : finalVar < 1e3 ? finalVar.toFixed(3) : finalVar.toExponential(1)} at L{nLayers})</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import numpy as np

# ── Xavier / Glorot Initialization ────────────────────────────────────────────
def xavier_uniform_(tensor, gain=1.0):
    fan_in, fan_out = nn.init._calculate_fan_in_and_fan_out(tensor)
    std = gain * np.sqrt(2.0 / (fan_in + fan_out))
    bound = np.sqrt(3.0) * std  # Uniform in [-bound, bound]
    return tensor.uniform_(-bound, bound)

def xavier_normal_(tensor, gain=1.0):
    fan_in, fan_out = nn.init._calculate_fan_in_and_fan_out(tensor)
    std = gain * np.sqrt(2.0 / (fan_in + fan_out))
    return tensor.normal_(0, std)

# ── He / Kaiming Initialization ───────────────────────────────────────────────
def he_normal_(tensor, mode='fan_in', nonlinearity='relu'):
    fan_in, fan_out = nn.init._calculate_fan_in_and_fan_out(tensor)
    fan = fan_in if mode == 'fan_in' else fan_out
    gain = nn.init.calculate_gain(nonlinearity)  # sqrt(2) for ReLU
    std = gain / np.sqrt(fan)
    return tensor.normal_(0, std)

# ── Variance analysis: verify initialization maintains signal ─────────────────
def signal_propagation_experiment(init_fn, activation, n_layers=30, width=512, n_samples=1000):
    """Track variance of activations through a deep network."""
    x = torch.randn(n_samples, width)
    variances = [x.var().item()]

    for _ in range(n_layers):
        W = torch.zeros(width, width)
        init_fn(W)
        with torch.no_grad():
            z = x @ W.T
            x = activation(z)
        variances.append(z.var().item())

    return variances

# ReLU with different initializations
relu = torch.relu
print("Variance at each 5th layer (ReLU network, width=512):")
print(f"{'Layer':>6} {'He init':>12} {'Xavier init':>12} {'Simple(1/n)':>12}")

he_vars     = signal_propagation_experiment(lambda W: nn.init.kaiming_normal_(W, nonlinearity='relu'), relu)
xavier_vars = signal_propagation_experiment(lambda W: nn.init.xavier_normal_(W), relu)
simple_vars = signal_propagation_experiment(lambda W: W.normal_(0, 1/W.shape[0]**0.5), relu)

for l in range(0, 31, 5):
    print(f"  {l:4d}  {he_vars[l]:12.4f}  {xavier_vars[l]:12.4f}  {simple_vars[l]:12.4f}")

# ── PyTorch built-in initialization ───────────────────────────────────────────
def init_weights(module):
    if isinstance(module, nn.Linear):
        nn.init.kaiming_normal_(module.weight, nonlinearity='relu')
        nn.init.constant_(module.bias, 0)
    elif isinstance(module, nn.Conv2d):
        nn.init.kaiming_normal_(module.weight, mode='fan_out', nonlinearity='relu')
        if module.bias is not None:
            nn.init.constant_(module.bias, 0)
    elif isinstance(module, nn.BatchNorm2d):
        nn.init.constant_(module.weight, 1)  # gamma = 1
        nn.init.constant_(module.bias, 0)    # beta = 0

model = nn.Sequential(
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 128), nn.ReLU(),
    nn.Linear(128, 10)
)
model.apply(init_weights)
print(f"\\nModel initialized with He init for all linear layers.")
print(f"First layer weight std: {model[0].weight.std():.4f}")
print(f"Expected (He): {(2/784)**0.5:.4f}")

# ── Spectral normalization ────────────────────────────────────────────────────
# Constrains spectral norm of W ≤ 1 for stable training in GANs
class SpectralLinear(nn.Module):
    def __init__(self, in_f, out_f):
        super().__init__()
        self.linear = nn.utils.spectral_norm(nn.Linear(in_f, out_f))
    def forward(self, x): return self.linear(x)

sn_layer = SpectralLinear(64, 64)
x = torch.randn(10, 64)
out = sn_layer(x)
print(f"\\nSpectral norm layer: {tuple(x.shape)} → {tuple(out.shape)}")
`;

export default function WeightInitialization() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Weight Initialization
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          He and Xavier/Glorot initialization, spectral normalization — how proper initialization
          maintains signal variance through deep networks and enables stable training.
        </p>
      </div>

      <NoteBlock title="Why Initialization Matters">
        <p>
          Early deep networks (pre-2010) were nearly untrainable due to poor initialization. Xavier
          initialization (Glorot &amp; Bengio, 2010) enabled training deeper networks with tanh/sigmoid.
          He initialization (He et al., 2015) extended this to ReLU networks. Proper initialization
          prevents the signal from vanishing or exploding before a single gradient step. Modern
          architectures (ResNets, Transformers) are designed to be robust to initialization, but
          it remains important for training stability.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 5.5"
        title="Xavier / Glorot Initialization"
        definition="Xavier initialization (Glorot &amp; Bengio, 2010) sets $W_{ij} \sim \mathcal{U}[-a, a]$ with $a = \sqrt{6/(n_{in}+n_{out})}$ (uniform), or $W_{ij} \sim \mathcal{N}(0, \sigma^2)$ with $\sigma^2 = 2/(n_{in}+n_{out})$ (normal), where $n_{in}$ is the fan-in (input neurons) and $n_{out}$ is the fan-out (output neurons). The goal is to preserve the variance of activations and gradients through each layer under linear (or near-linear) activations."
        notation="The variance formula arises from requiring $\text{Var}(\mathbf{z}^{(l)}) = \text{Var}(\mathbf{z}^{(l-1)})$ (forward) and $\text{Var}(\partial \mathcal{L}/\partial \mathbf{z}^{(l-1)}) = \text{Var}(\partial \mathcal{L}/\partial \mathbf{z}^{(l)})$ (backward). The harmonic mean $(n_{in}+n_{out})/2$ is a compromise. For $n_{in} = n_{out}$: $\sigma = \sqrt{1/n_{in}}$ (classical weight sharing rule)."
      />

      <DefinitionBlock
        label="Definition 5.6"
        title="He / Kaiming Initialization"
        definition="He initialization (He et al., 2015) addresses ReLU networks: $W_{ij} \sim \mathcal{N}(0, \sigma^2)$ with $\sigma^2 = 2/n_{in}$ (fan-in mode) or $\sigma^2 = 2/n_{out}$ (fan-out mode). The factor of 2 compensates for ReLU killing half the variance (negative pre-activations become 0). He initialization with fan-in is the current default for ReLU/GELU networks. The PyTorch default for Conv and Linear layers is actually Kaiming uniform with fan-in mode."
        notation="General formula: $\sigma^2 = 2/(\text{gain}^{-2} \cdot n_{\text{fan}})$ where gain accounts for activation function: $\sqrt{2}$ for ReLU, $5/3$ for tanh, 1 for linear. Fan-in mode preserves forward variance; fan-out mode preserves backward gradient variance. For asymmetric layers ($n_{in} \neq n_{out}$), He fan-in is preferred for deep networks."
      />

      <InitViz />

      <TheoremBlock
        label="Theorem 5.3"
        title="Variance Preservation in Deep ReLU Networks"
        statement="With He initialization ($\sigma^2 = 2/n_{in}$) and ReLU activations, the variance of activations $\text{Var}(\mathbf{h}^{(l)}) \approx \text{Var}(\mathbf{h}^{(l-1)})$ for all layers $l$, enabling gradient signal to propagate through arbitrarily deep networks at initialization. Without this, signals either vanish ($\sigma^2 < 2/n_{in}$) or explode ($\sigma^2 > 2/n_{in}$)."
        proof="For layer $l$: $z_j^{(l)} = \sum_{i=1}^{n_{in}} W_{ji}^{(l)} h_i^{(l-1)}$. If $W_{ji}$ are i.i.d. with mean 0 and variance $\sigma^2_W$, and activations $h_i^{(l-1)}$ are i.i.d. with mean 0 and variance $\text{Var}(h)$: $\text{Var}(z_j^{(l)}) = n_{in} \sigma^2_W \text{Var}(h)$ (independence). After ReLU: $h_j^{(l)} = \max(0, z_j^{(l)})$. For a symmetric zero-mean distribution: $\text{Var}(h_j) = \text{Var}(z_j)/2$ (ReLU keeps half). Setting $n_{in}\sigma^2_W / 2 = 1$ (i.e., $\sigma^2_W = 2/n_{in}$) gives $\text{Var}(h^{(l)}) = \text{Var}(h^{(l-1)})$. $\square$"
        corollaries={[
          "For tanh activation: $\\text{Var}(\\tanh(z)) \\approx \\text{Var}(z)$ for small $\\text{Var}(z)$ (since $\\tanh'(0)=1$), leading to Xavier with $\\sigma^2 = 1/n_{in}$.",
          "For GELU/SiLU: similar to ReLU analysis; He initialization (or a slight variant) still works well in practice.",
          "Orthogonal initialization ($W$ is a random orthogonal matrix): exactly preserves the L2 norm of inputs, giving even better gradient flow at initialization — used in RNNs and very deep networks.",
        ]}
      />

      <ExampleBlock
        title="Computing He vs Xavier Variance for a Layer"
        difficulty="advanced"
        problem="A layer has $n_{in} = 256$ and $n_{out} = 128$. Compute the initialization standard deviation for (a) He (fan-in), (b) Xavier uniform, and explain why they differ."
        solution={[
          { step: 'He (fan-in) initialization', formula: '\\sigma_{He} = \\sqrt{2/n_{in}} = \\sqrt{2/256} = \\sqrt{1/128} \\approx 0.0884', explanation: 'Only uses fan-in. The factor 2 compensates for ReLU. Does not depend on n_out.' },
          { step: 'Xavier (uniform) initialization', formula: 'a = \\sqrt{6/(n_{in}+n_{out})} = \\sqrt{6/384} \\approx 0.125', explanation: 'Uses harmonic mean of fan-in and fan-out. The uniform bound a ≈ 0.125 means weights drawn from [-0.125, 0.125].' },
          { step: 'Xavier (normal)', formula: '\\sigma_{Xavier} = \\sqrt{2/(n_{in}+n_{out})} = \\sqrt{2/384} \\approx 0.072', explanation: 'Compare: He σ=0.088 > Xavier σ=0.072. He is larger to compensate for ReLU\'s variance reduction.' },
          { step: 'Why they differ', formula: '\\text{ReLU: } \\text{Var}(h) = \\text{Var}(z)/2, \\quad \\text{tanh: } \\text{Var}(h) \\approx \\text{Var}(z)', explanation: 'ReLU kills half the variance, requiring 2× larger weights to compensate. Use He for ReLU, Xavier for tanh/linear.' },
        ]}
      />

      <WarningBlock title="Initialization Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Zero initialization:</strong> Initializing all weights to 0 (or the same value) breaks symmetry — all neurons learn the same thing. Always use random initialization (except biases which can be 0).</li>
          <li><strong>Too-large initialization:</strong> Weights initialized too large cause saturated activations (tanh/sigmoid) or ReLU death. Symptoms: loss=NaN in first step, or flat loss curve. Reduce learning rate or use proper initialization.</li>
          <li><strong>Mismatch with activation:</strong> Using Xavier init with ReLU (instead of He) causes variance to halve at each layer — 30-layer network has variance <InlineMath math="2^{-30}" />. Similarly, He init with tanh causes variance explosion. Always match initialization to activation function.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="Xavier, He Initialization & Signal Propagation — PyTorch" runnable />
    </div>
  );
}
