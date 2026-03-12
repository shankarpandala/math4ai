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
// Activation Function Plotter
// ---------------------------------------------------------------------------

const ACTIVATIONS = {
  ReLU:    { fn: x => Math.max(0, x),  color: '#6366f1', deriv: x => x > 0 ? 1 : 0 },
  Sigmoid: { fn: x => 1/(1+Math.exp(-x)), color: '#10b981', deriv: x => { const s = 1/(1+Math.exp(-x)); return s*(1-s); } },
  Tanh:    { fn: x => Math.tanh(x),    color: '#f59e0b', deriv: x => 1 - Math.tanh(x)**2 },
  GELU:    { fn: x => x * 0.5 * (1 + Math.tanh(0.7978845608 * (x + 0.044715 * x**3))), color: '#ef4444',
             deriv: x => { const t = Math.tanh(0.7978845608*(x+0.044715*x**3)); return 0.5*(1+t) + 0.5*x*(1-t*t)*0.7978845608*(1+3*0.044715*x**2); } },
  Swish:   { fn: x => x/(1+Math.exp(-x)), color: '#8b5cf6', deriv: x => { const s = 1/(1+Math.exp(-x)); return s + x*s*(1-s); } },
};

function ActivationPlot() {
  const [selected, setSelected] = useState('ReLU');
  const [showDeriv, setShowDeriv] = useState(false);

  const W = 400, H = 220;
  const xMin = -4, xMax = 4, yMin = -1.5, yMax = 2;

  const toSVG = (x, y) => ({
    x: ((x - xMin) / (xMax - xMin)) * W,
    y: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const xSteps = 200;
  const xs = Array.from({ length: xSteps }, (_, i) => xMin + (xMax - xMin) * i / (xSteps - 1));

  const pathFor = (fn) => {
    const pts = xs.map(x => {
      const y = Math.max(yMin, Math.min(yMax, fn(x)));
      const p = toSVG(x, y);
      return `${p.x},${p.y}`;
    });
    return 'M' + pts.join(' L');
  };

  const origin = toSVG(0, 0);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Activation Function Explorer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Compare activation functions and their derivatives. Derivatives show gradient magnitude for backprop.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(ACTIVATIONS).map(name => (
          <button key={name} onClick={() => setSelected(name)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${selected === name ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
            style={selected === name ? { backgroundColor: ACTIVATIONS[name].color } : {}}>
            {name}
          </button>
        ))}
        <label className="flex items-center gap-2 ml-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={showDeriv} onChange={e => setShowDeriv(e.target.checked)} />
          Show derivative
        </label>
      </div>

      <svg width={W} height={H} className="mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800/50">
        {/* Grid */}
        {[-1, 0, 1, 2].map(y => {
          const p = toSVG(xMin, y);
          return <line key={y} x1={0} y1={p.y} x2={W} y2={p.y} stroke={y===0?'#94a3b8':'#e5e7eb'} strokeWidth={y===0?1.5:0.8} className="dark:stroke-gray-600" />;
        })}
        {[-4,-3,-2,-1,0,1,2,3,4].map(x => {
          const p = toSVG(x, 0);
          return <line key={x} x1={p.x} y1={0} x2={p.x} y2={H} stroke={x===0?'#94a3b8':'#e5e7eb'} strokeWidth={x===0?1.5:0.8} className="dark:stroke-gray-600" />;
        })}

        {/* Plot all (dimmed) */}
        {Object.entries(ACTIVATIONS).map(([name, act]) => name !== selected && (
          <path key={name} d={pathFor(act.fn)} fill="none" stroke={act.color} strokeWidth={1} opacity={0.2} />
        ))}

        {/* Selected activation */}
        <path d={pathFor(ACTIVATIONS[selected].fn)} fill="none"
          stroke={ACTIVATIONS[selected].color} strokeWidth={2.5} />

        {/* Derivative */}
        {showDeriv && (
          <path d={pathFor(ACTIVATIONS[selected].deriv)} fill="none"
            stroke={ACTIVATIONS[selected].color} strokeWidth={1.5} strokeDasharray="6,3" opacity={0.7} />
        )}

        {/* Axis labels */}
        {[-3,-1,1,3].map(x => {
          const p = toSVG(x, 0);
          return <text key={x} x={p.x} y={origin.y+14} textAnchor="middle" fontSize={10} fill="#9ca3af">{x}</text>;
        })}
      </svg>

      <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
        <span style={{ color: ACTIVATIONS[selected].color }}>— {selected}(x)</span>
        {showDeriv && <span style={{ color: ACTIVATIONS[selected].color }} className="opacity-70">- - {selected}'(x)</span>}
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# ── Activation functions and their properties ─────────────────────────────────
x = torch.linspace(-4, 4, 100)

# ReLU and variants
relu     = F.relu(x)
leaky    = F.leaky_relu(x, 0.01)
elu      = F.elu(x)
gelu     = F.gelu(x)  # PyTorch uses erf approximation
swish    = F.silu(x)  # SiLU = Swish = x * sigmoid(x)
mish     = x * torch.tanh(F.softplus(x))

# Sigmoid and tanh
sigmoid  = torch.sigmoid(x)
tanh_act = torch.tanh(x)

print("Activation statistics at x=0:")
for name, fn in [('ReLU', F.relu), ('GELU', F.gelu), ('Swish/SiLU', F.silu),
                  ('Sigmoid', torch.sigmoid), ('Tanh', torch.tanh)]:
    val = fn(torch.tensor(0.0))
    print(f"  {name}(0) = {val:.4f}")

# ── Dying ReLU demonstration ───────────────────────────────────────────────────
class TinyNet(nn.Module):
    def __init__(self, activation):
        super().__init__()
        self.fc1 = nn.Linear(10, 100)
        self.fc2 = nn.Linear(100, 1)
        self.act = activation

    def forward(self, x):
        return self.fc2(self.act(self.fc1(x)))

# Initialize with large negative biases → dying ReLU
model = TinyNet(F.relu)
with torch.no_grad():
    model.fc1.bias.fill_(-5.0)  # All pre-activations negative

x_test = torch.randn(32, 10)
h1 = F.relu(model.fc1(x_test))
dead = (h1 == 0).float().mean()
print(f"\\nDying ReLU: {dead:.1%} of neurons output zero")

# Fix with GELU or Leaky ReLU
model_gelu = TinyNet(F.gelu)
h1_gelu = F.gelu(model_gelu.fc1(x_test))
print(f"GELU: {(h1_gelu == 0).float().mean():.1%} of neurons output zero")

# ── Saturating activations cause vanishing gradients ─────────────────────────
x_large = torch.tensor(10.0, requires_grad=True)
y = torch.sigmoid(x_large)
y.backward()
print(f"\\nSigmoid gradient at x=10: {x_large.grad:.8f} (nearly zero!)")

x_large2 = torch.tensor(10.0, requires_grad=True)
y2 = F.gelu(x_large2)
y2.backward()
print(f"GELU gradient at x=10: {x_large2.grad:.4f}")
`;

export default function Activations() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Activation Functions
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The nonlinear building blocks of neural networks — ReLU, sigmoid, tanh, GELU, and Swish,
          including the dying ReLU problem and modern alternatives.
        </p>
      </div>

      <NoteBlock title="Evolution of Activation Functions">
        <p>
          Early networks used sigmoid (1980s) and tanh. The ReLU breakthrough came with Nair &amp; Hinton
          (2010) and Glorot et al. (2011) showing it dramatically accelerates training. GELU
          (Hendrycks &amp; Gimpel, 2016) is now the default in Transformers (BERT, GPT). Swish/SiLU
          (Ramachandran et al., 2017; Elfwing et al., 2018) is used in EfficientNet and many modern
          models. The search for better activations is ongoing (e.g., GLU variants, Mish).
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.3"
        title="Common Activation Functions"
        definition="Key activation functions: (1) ReLU: $\sigma(x) = \max(0,x)$, gradient = 1 for x>0, 0 for x<0. (2) Sigmoid: $\sigma(x) = 1/(1+e^{-x})$, range $(0,1)$, gradient = $\sigma(1-\sigma) \leq 1/4$. (3) Tanh: $\sigma(x) = \tanh(x)$, range $(-1,1)$, gradient = $1-\tanh^2(x) \leq 1$. (4) GELU: $\sigma(x) = x \cdot \Phi(x)$ where $\Phi$ is the Gaussian CDF, approximated as $x \cdot 0.5(1+\tanh(\sqrt{2/\pi}(x+0.044715x^3)))$. (5) Swish/SiLU: $\sigma(x) = x \cdot \text{sigmoid}(x)$."
        notation="Leaky ReLU: $\max(\alpha x, x)$ with $\alpha \approx 0.01$ (no dying neurons). ELU: $x$ for $x>0$, $\alpha(e^x-1)$ for $x\leq 0$ (smooth, negative outputs). PReLU: learnable $\alpha$. All modern models use one of: ReLU, GELU, SiLU, or a gated variant (SwiGLU in LLaMA)."
      />

      <ActivationPlot />

      <DefinitionBlock
        label="Definition 1.4"
        title="Dying ReLU Problem"
        definition="A ReLU neuron 'dies' when its pre-activation $z = \mathbf{w}^\top \mathbf{x} + b$ is negative for all inputs in the dataset. Since the gradient of ReLU is 0 for $z < 0$, no gradient flows through dead neurons during backpropagation, so their weights never update — they are permanently deactivated. Large negative biases or large learning rates can cause many neurons to die simultaneously, reducing effective network capacity."
        notation="Dying ReLU is diagnosed by checking the fraction of neurons outputting 0 on the training set (should be < 50%). Mitigations: (1) Leaky ReLU/PReLU with non-zero gradient for $x<0$. (2) ELU with smooth negative region. (3) GELU/SiLU which have small but non-zero output for negative inputs. (4) Careful initialization (He init) and learning rate scheduling."
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Vanishing Gradients from Saturating Activations"
        statement="For sigmoid activation $\sigma(x) = (1+e^{-x})^{-1}$, the gradient $\sigma'(x) = \sigma(x)(1-\sigma(x)) \leq 1/4$ for all $x$. In an $L$-layer network, the gradient of the loss with respect to the first layer satisfies $\|\nabla_{W^{(1)}} \mathcal{L}\| \leq (1/4)^L \prod_{l} \|W^{(l)}\| \cdot \|\nabla_{z^{(L)}} \mathcal{L}\|$, which vanishes exponentially in $L$ for typical weight scales."
        proof="By the chain rule, the gradient through layer $l$ is multiplied by $\sigma'(z^{(l)}) \leq 1/4$. With $L$ sigmoid layers: $\partial \mathcal{L}/\partial z^{(1)} = \prod_{l=2}^L (\sigma'(z^{(l)}) \cdot W^{(l)}) \cdot \nabla_{z^{(L)}} \mathcal{L}$. Taking norms and applying submultiplicativity: $\|\nabla\| \leq (1/4)^{L-1} \prod \|W^{(l)}\| \cdot \|\nabla\|$. For typical random initialization $\|W\| \sim 1$, this is exponentially small. $\square$"
        corollaries={[
          "ReLU avoids vanishing gradients: $\\text{ReLU}'(x) = 1$ for $x > 0$, so gradients pass through unchanged for active neurons.",
          "Batch normalization (Ioffe & Szegedy 2015) mitigates vanishing gradients by normalizing pre-activations, keeping them out of saturation regions.",
          "Residual connections (He et al. 2016) provide gradient highways that bypass nonlinearities, enabling training of networks with hundreds of layers.",
        ]}
      />

      <ExampleBlock
        title="Choosing the Right Activation"
        difficulty="intermediate"
        problem="You are building (a) a binary classifier with a sigmoid output, (b) a hidden layer in a deep network, (c) a language model hidden layer. Which activation do you choose and why?"
        solution={[
          { step: 'Output layer for binary classification', formula: 'p = \\sigma(z) = \\frac{1}{1+e^{-z}}', explanation: 'Sigmoid maps logit to probability in [0,1]. Use with binary cross-entropy loss. (Note: PyTorch BCEWithLogitsLoss applies sigmoid internally for numerical stability.)' },
          { step: 'Hidden layers in deep MLP', formula: 'h = \\text{ReLU}(z) = \\max(0, z)', explanation: 'ReLU: fast to compute, no vanishing gradient for positive activations, sparse activations. Default choice for MLPs, CNNs. Use He initialization with ReLU.' },
          { step: 'Hidden layers in Transformer/LLM', formula: 'h = \\text{GELU}(z) = z \\cdot \\Phi(z)', explanation: 'GELU: smooth, allows small negative outputs (stochastic regularization interpretation), outperforms ReLU in attention-based models empirically. Used in BERT, GPT, ViT.' },
          { step: 'Alternative: SwiGLU (LLaMA)', formula: 'h = \\text{SiLU}(W_1 x) \\odot W_2 x', explanation: 'Gated linear unit with Swish — adds multiplicative gating, more expressive than additive activation. State-of-the-art in large language models.' },
        ]}
      />

      <WarningBlock title="Activation Function Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Sigmoid in hidden layers:</strong> Avoid sigmoid in intermediate layers — it saturates and causes vanishing gradients. Reserve it for output layers (binary classification probability).</li>
          <li><strong>ReLU in RNNs:</strong> ReLU in recurrent networks can cause exploding gradients (the repeated multiplication by weights is not bounded by 1 as in tanh). LSTMs use sigmoid/tanh gates specifically to bound the gradient.</li>
          <li><strong>Large learning rate + ReLU:</strong> Can cause dying neurons. Monitor the fraction of zero activations. If &gt;50% neurons are dead, reduce learning rate or switch to Leaky ReLU.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="Activation Functions in PyTorch — Properties & Dying ReLU" runnable />
    </div>
  );
}
