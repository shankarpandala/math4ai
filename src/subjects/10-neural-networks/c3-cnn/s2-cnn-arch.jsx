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
// CNN Architecture Layer Stack Diagram
// ---------------------------------------------------------------------------

const ARCHITECTURES = {
  LeNet: [
    { type: 'Conv', filters: 6,   size: '5×5', outH: 28, color: '#818cf8' },
    { type: 'Pool', filters: 6,   size: '2×2', outH: 14, color: '#a5b4fc' },
    { type: 'Conv', filters: 16,  size: '5×5', outH: 10, color: '#818cf8' },
    { type: 'Pool', filters: 16,  size: '2×2', outH: 5,  color: '#a5b4fc' },
    { type: 'FC',   filters: 120, size: '',    outH: 1,  color: '#6ee7b7' },
    { type: 'FC',   filters: 84,  size: '',    outH: 1,  color: '#6ee7b7' },
    { type: 'FC',   filters: 10,  size: '',    outH: 1,  color: '#fca5a5' },
  ],
  VGG16: [
    { type: 'Conv×2', filters: 64,  size: '3×3', outH: 224, color: '#818cf8' },
    { type: 'Pool',   filters: 64,  size: '2×2', outH: 112, color: '#a5b4fc' },
    { type: 'Conv×2', filters: 128, size: '3×3', outH: 112, color: '#818cf8' },
    { type: 'Pool',   filters: 128, size: '2×2', outH: 56,  color: '#a5b4fc' },
    { type: 'Conv×3', filters: 256, size: '3×3', outH: 56,  color: '#818cf8' },
    { type: 'Pool',   filters: 256, size: '2×2', outH: 28,  color: '#a5b4fc' },
    { type: 'Conv×3', filters: 512, size: '3×3', outH: 28,  color: '#818cf8' },
    { type: 'Pool',   filters: 512, size: '2×2', outH: 14,  color: '#a5b4fc' },
    { type: 'Conv×3', filters: 512, size: '3×3', outH: 14,  color: '#818cf8' },
    { type: 'Pool',   filters: 512, size: '2×2', outH: 7,   color: '#a5b4fc' },
    { type: 'FC',     filters: 4096,size: '',    outH: 1,   color: '#6ee7b7' },
    { type: 'FC',     filters: 1000,size: '',    outH: 1,   color: '#fca5a5' },
  ],
  ResNet: [
    { type: 'Conv', filters: 64,  size: '7×7', outH: 112, color: '#818cf8' },
    { type: 'Pool', filters: 64,  size: '3×3', outH: 56,  color: '#a5b4fc' },
    { type: 'Res×3',filters: 64,  size: '3×3', outH: 56,  color: '#fbbf24' },
    { type: 'Res×4',filters: 128, size: '3×3', outH: 28,  color: '#fbbf24' },
    { type: 'Res×6',filters: 256, size: '3×3', outH: 14,  color: '#fbbf24' },
    { type: 'Res×3',filters: 512, size: '3×3', outH: 7,   color: '#fbbf24' },
    { type: 'GAP',  filters: 512, size: '',    outH: 1,   color: '#6ee7b7' },
    { type: 'FC',   filters: 1000,size: '',    outH: 1,   color: '#fca5a5' },
  ],
};

function CNNDiagram() {
  const [arch, setArch] = useState('ResNet');
  const [hovered, setHovered] = useState(null);

  const layers = ARCHITECTURES[arch];
  const barW = 48, gap = 8;
  const W = layers.length * (barW + gap) + 20;
  const H = 220;
  const maxH = Math.max(...layers.map(l => l.outH));
  const scale = (h) => Math.max(12, (h / maxH) * 140);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">CNN Architecture Stack</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Bar height ∝ spatial resolution. Bar color shows layer type. Hover for details.
      </p>
      <div className="flex gap-2 mb-4">
        {Object.keys(ARCHITECTURES).map(a => (
          <button key={a} onClick={() => { setArch(a); setHovered(null); }}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${arch === a ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
            {a}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H+40} className="block">
          {layers.map((layer, i) => {
            const barH = scale(layer.outH);
            const x = 10 + i * (barW + gap);
            const y = H - barH;
            const isHov = hovered === i;
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
                <rect x={x} y={y} width={barW} height={barH}
                  fill={layer.color} opacity={isHov ? 1 : 0.8}
                  rx={4} stroke={isHov ? '#1f2937' : 'none'} strokeWidth={2} />
                <text x={x+barW/2} y={H+14} textAnchor="middle" fontSize={9} fill="#6b7280"
                  className="dark:fill-gray-400">
                  {layer.type}
                </text>
                <text x={x+barW/2} y={H+25} textAnchor="middle" fontSize={9} fill="#9ca3af"
                  className="dark:fill-gray-500">
                  {layer.filters}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {hovered !== null && (
        <div className="mt-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm">
          <strong>{layers[hovered].type}</strong> — {layers[hovered].filters} filters/channels,
          {layers[hovered].size && <> kernel {layers[hovered].size},</>} spatial {layers[hovered].outH}×{layers[hovered].outH}
        </div>
      )}
      <div className="mt-3 flex gap-4 flex-wrap text-xs">
        {[['#818cf8','Conv'],['#a5b4fc','Pool'],['#fbbf24','Residual Block'],['#6ee7b7','FC/GAP'],['#fca5a5','Output']].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded" style={{background:c}} />
            <span className="text-gray-600 dark:text-gray-400">{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── LeNet-5 (simplified) ───────────────────────────────────────────────────────
class LeNet5(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 6, kernel_size=5, padding=2),   nn.ReLU(), nn.AvgPool2d(2, 2),
            nn.Conv2d(6, 16, kernel_size=5),              nn.ReLU(), nn.AvgPool2d(2, 2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(16*5*5, 120), nn.ReLU(),
            nn.Linear(120, 84),     nn.ReLU(),
            nn.Linear(84, num_classes),
        )
    def forward(self, x): return self.classifier(self.features(x))

# ── ResNet Residual Block ──────────────────────────────────────────────────────
class ResBlock(nn.Module):
    """Basic residual block with skip connection: y = F(x, W) + x"""
    def __init__(self, channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(channels)
        # Shortcut (identity or 1x1 conv for dimension matching)
        self.shortcut = nn.Identity() if stride == 1 else \
                        nn.Sequential(nn.Conv2d(channels, channels, 1, stride=stride, bias=False),
                                      nn.BatchNorm2d(channels))

    def forward(self, x):
        residual = self.shortcut(x)
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        return F.relu(out + residual)  # Skip connection!

# ── Demonstrate vanishing gradient fix via residual connection ─────────────────
def grad_norm(model, x, y):
    """Compute gradient norm for the first layer."""
    loss = F.cross_entropy(model(x), y)
    loss.backward()
    first_layer = list(model.parameters())[0]
    return first_layer.grad.norm().item()

# Plain network (no skip connections)
class PlainBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(channels)
    def forward(self, x):
        return F.relu(self.bn2(self.conv2(F.relu(self.bn1(self.conv1(x))))))

# Stack many blocks and compare gradient flow
def build_net(BlockClass, n_blocks, channels=16):
    blocks = [nn.Conv2d(3, channels, 3, padding=1)]
    for _ in range(n_blocks):
        blocks.append(BlockClass(channels))
    blocks += [nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(channels, 10)]
    return nn.Sequential(*blocks)

x = torch.randn(4, 3, 32, 32)
y = torch.randint(0, 10, (4,))

for n in [4, 8, 16]:
    plain = build_net(PlainBlock, n)
    resnet = build_net(ResBlock, n)
    print(f"Depth {n*2+3}:")
    print(f"  Plain  grad norm: {grad_norm(plain, x, y):.4f}")
    plain.zero_grad()
    print(f"  ResNet grad norm: {grad_norm(resnet, x.clone(), y):.4f}")
    resnet.zero_grad()
`;

export default function CNNArchitectures() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          CNN Architectures
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The evolution from LeNet to VGG to ResNet — how skip connections solved the vanishing
          gradient problem and enabled training of very deep networks.
        </p>
      </div>

      <NoteBlock title="Architecture Evolution">
        <p>
          LeNet-5 (LeCun, 1998) pioneered CNNs for handwritten digit recognition. AlexNet (2012) scaled
          up with GPU training, ReLU, and dropout. VGG (Simonyan &amp; Zisserman, 2014) systematized
          design with 3×3 kernels. GoogLeNet/Inception (2014) introduced parallel multi-scale convolutions.
          ResNet (He et al., 2015) enabled 152-layer training via skip connections, winning ILSVRC 2015.
          Modern variants: DenseNet, EfficientNet, ConvNeXt, ViT.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 3.3"
        title="Residual Block &amp; Skip Connections"
        definition="A residual block computes $\mathbf{y} = F(\mathbf{x}, \{W_i\}) + \mathbf{x}$ where $F$ is a stack of 2-3 convolutions with BatchNorm and ReLU, and $\mathbf{x}$ is the identity shortcut. When dimensions differ (stride > 1 or channel change), a 1×1 convolution $W_s$ matches dimensions: $\mathbf{y} = F(\mathbf{x}) + W_s\mathbf{x}$. ResNet-50+ uses bottleneck blocks with 1×1→3×3→1×1 convolutions to reduce computation."
        notation="The block learns the residual $F(\mathbf{x}) = H(\mathbf{x}) - \mathbf{x}$ rather than the full mapping $H(\mathbf{x})$. If the optimal mapping is near-identity (common in deep networks), residual learning makes $F \approx 0$ easier to optimize than $H \approx \mathbf{x}$. Depth-1 and depth-2 residual blocks are both common."
      />

      <CNNDiagram />

      <DefinitionBlock
        label="Definition 3.4"
        title="VGG Design Philosophy"
        definition="VGG replaces large kernels (5×5, 7×7) with stacks of 3×3 convolutions: two 3×3 convolutions have the same receptive field as one 5×5, but fewer parameters ($2 \cdot 3^2 C^2 = 18C^2$ vs $5^2 C^2 = 25C^2$) and an additional nonlinearity. VGG uses max-pooling for spatial downsampling (halving dimensions) and doubles the number of filters after each pooling, maintaining computational cost. The pattern: [Conv×2-3, MaxPool] × 5, FC × 3."
        notation="VGG-16: 13 conv layers + 3 FC = 16 weight layers. 138M parameters (mostly in FC layers). Modern practice: replace FC layers with Global Average Pooling (GAP) — reduces params from 102M to 0 for FC part, while often improving generalization."
      />

      <TheoremBlock
        label="Theorem 3.2"
        title="Residual Networks Solve Vanishing Gradients"
        statement="In a plain (non-residual) network, the gradient of the loss with respect to layer $l$ parameters satisfies $\|\partial \mathcal{L}/\partial W^{(l)}\| \leq C^{L-l} \cdot \|\partial \mathcal{L}/\partial W^{(L)}\|$ for some $C < 1$, leading to exponential decay. With residual connections, the gradient path includes a direct path: $\partial \mathcal{L}/\partial \mathbf{x}^{(l)} = \partial \mathcal{L}/\partial \mathbf{x}^{(L)} \cdot \prod_{k=l}^{L-1}(1 + \partial F_k/\partial \mathbf{x}^{(k)})$, which always includes the additive term 1, preventing gradient vanishing."
        proof="In a residual network: $\mathbf{x}^{(l+1)} = \mathbf{x}^{(l)} + F_l(\mathbf{x}^{(l)})$. By the chain rule: $\frac{\partial \mathbf{x}^{(L)}}{\partial \mathbf{x}^{(l)}} = \prod_{k=l}^{L-1}\left(I + \frac{\partial F_k}{\partial \mathbf{x}^{(k)}}\right)$. Expanding the product: $= I + \sum_k \frac{\partial F_k}{\partial \mathbf{x}^{(k)}} + \text{cross terms}$. The identity term $I$ provides a direct gradient path from output to any layer, preventing the gradient from vanishing even if all $\partial F_k/\partial \mathbf{x}^{(k)} \approx 0$. $\square$"
        corollaries={[
          "ResNets can be viewed as ensembles of networks of varying depth: the skip connections create $2^L$ paths of different lengths through $L$ residual blocks.",
          "Unrolled residual networks (\"neural ODEs\") led to continuous-depth models where depth is a differential equation parameter.",
          "Skip connections also appear in: DenseNet (dense connections to all previous layers), U-Net (encoder-decoder with skip connections for segmentation), and Transformers (residual around each attention and FFN block).",
        ]}
      />

      <ExampleBlock
        title="Computing VGG-16 Parameters"
        difficulty="intermediate"
        problem="Count the parameters in VGG-16's first two convolutional blocks: Block 1 (2× Conv 3×3, 64 filters from 3 channels), Block 2 (2× Conv 3×3, 128 filters from 64 channels)."
        solution={[
          { step: 'Block 1: Conv 3×3, 3→64', formula: '2 \\times (3 \\times 3 \\times 3 \\times 64 + 64) = 2 \\times 1792 = 3584', explanation: 'Each conv: kernel_h × kernel_w × in_channels × out_channels + bias. Two such convs.' },
          { step: 'Block 2: Conv 3×3, 64→128', formula: '2 \\times (3 \\times 3 \\times 64 \\times 128 + 128) = 2 \\times 73856 = 147712', explanation: '73,856 per conv layer. Doubling channels quadruples parameters.' },
          { step: 'FC layers dominate', formula: '7 \\times 7 \\times 512 \\times 4096 + 4096 \\times 4096 + 4096 \\times 1000 \\approx 102M', explanation: 'The three FC layers account for ~74% of VGG-16\'s 138M total parameters.' },
          { step: 'Global Average Pooling alternative', formula: '512 \\times 1000 + 1000 = 513000 \\text{ params for FC part}', explanation: 'GAP (1 FC from 512 to 1000 instead of three FCs) reduces FC parameters by 200×, reducing overfitting.' },
        ]}
      />

      <WarningBlock title="CNN Architecture Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Pooling too aggressively:</strong> Reducing spatial dimensions too fast (large strides or many pooling layers early) loses fine-grained spatial information needed for dense prediction tasks (segmentation, detection). Use dilated convolutions or feature pyramid networks instead.</li>
          <li><strong>Depth without skip connections:</strong> Plain networks beyond 20-30 layers suffer from degradation (worse training error, not just overfitting) due to optimization difficulties. Always use residual/dense connections for very deep networks.</li>
          <li><strong>Batch normalization placement:</strong> The original ResNet places BN before ReLU (pre-activation ResNet, He et al. 2016b) which often performs better than the original post-activation order. Check which convention your framework uses.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="LeNet, ResNet Block — PyTorch Implementation" runnable />
    </div>
  );
}
