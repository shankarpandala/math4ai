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
// 1D Convolution Kernel Sliding Animation
// ---------------------------------------------------------------------------

const INPUT = [1, 2, 3, 4, 5, 6, 7, 8];
const KERNELS = {
  'Edge [−1,2,−1]':    [-1, 2, -1],
  'Smooth [1,1,1]/3':  [1/3, 1/3, 1/3],
  'Deriv [−1,0,1]':    [-1, 0, 1],
};

function convolve1D(input, kernel, padding) {
  const p = padding;
  const padded = [...Array(p).fill(0), ...input, ...Array(p).fill(0)];
  const k = kernel.length;
  const out = [];
  for (let i = 0; i <= padded.length - k; i++) {
    let val = 0;
    for (let j = 0; j < k; j++) val += padded[i+j] * kernel[j];
    out.push(Math.round(val * 100) / 100);
  }
  return out;
}

function ConvViz() {
  const [kernelName, setKernelName] = useState('Edge [−1,2,−1]');
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(0);
  const [pos, setPos] = useState(0);

  const kernel = KERNELS[kernelName];
  const K = kernel.length;
  const padded = [...Array(padding).fill(0), ...INPUT, ...Array(padding).fill(0)];
  const outputLen = Math.floor((padded.length - K) / stride) + 1;
  const output = convolve1D(INPUT, kernel, padding);
  const strideOutput = [];
  for (let i = 0; i < outputLen; i++) {
    let val = 0;
    for (let j = 0; j < K; j++) val += padded[i*stride+j] * kernel[j];
    strideOutput.push(Math.round(val * 100) / 100);
  }

  const maxPos = outputLen - 1;
  const cellW = 44, cellH = 44, gapX = 4;

  const absMax = Math.max(1, ...strideOutput.map(Math.abs));

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">1D Convolution Explorer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Slide the kernel over the input signal and observe the output feature map.
      </p>

      <div className="flex flex-wrap gap-4 mb-5">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mr-2">Kernel:</label>
          {Object.keys(KERNELS).map(k => (
            <button key={k} onClick={() => { setKernelName(k); setPos(0); }}
              className={`mr-1 rounded px-2 py-1 text-xs font-semibold ${kernelName === k ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
              {k}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <label className="text-xs text-gray-500 dark:text-gray-400">Stride: {stride}</label>
          <input type="range" min={1} max={3} value={stride} onChange={e => { setStride(+e.target.value); setPos(0); }} className="w-20" />
          <label className="text-xs text-gray-500 dark:text-gray-400">Padding: {padding}</label>
          <input type="range" min={0} max={2} value={padding} onChange={e => { setPadding(+e.target.value); setPos(0); }} className="w-20" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={Math.max((padded.length) * (cellW+gapX) + 20, 400)} height={240} className="block">
          {/* Input (with padding) */}
          {padded.map((v, i) => {
            const isPad = i < padding || i >= padding + INPUT.length;
            const isActive = i >= pos*stride && i < pos*stride + K;
            return (
              <g key={i}>
                <rect x={10 + i*(cellW+gapX)} y={10} width={cellW} height={cellH}
                  fill={isActive ? '#c7d2fe' : isPad ? '#f3f4f6' : '#f8fafc'}
                  stroke={isActive ? '#6366f1' : '#e5e7eb'} strokeWidth={isActive ? 2 : 1}
                  rx={4} className="dark:stroke-gray-600" />
                <text x={10+i*(cellW+gapX)+cellW/2} y={10+cellH/2+5} textAnchor="middle" fontSize={14} fontWeight="600"
                  fill={isPad ? '#9ca3af' : '#1f2937'} className="dark:fill-gray-200">{v}</text>
                <text x={10+i*(cellW+gapX)+cellW/2} y={10+cellH+14} textAnchor="middle" fontSize={10} fill="#9ca3af">{i}</text>
              </g>
            );
          })}
          <text x={10} y={8} fontSize={10} fill="#6b7280" className="dark:fill-gray-400">Input (padded)</text>

          {/* Kernel */}
          {kernel.map((v, j) => {
            const xPos = 10 + (pos*stride + j) * (cellW+gapX);
            return (
              <g key={j}>
                <rect x={xPos} y={80} width={cellW} height={cellH}
                  fill="#ddd6fe" stroke="#7c3aed" strokeWidth={2} rx={4} />
                <text x={xPos+cellW/2} y={80+cellH/2+5} textAnchor="middle" fontSize={12} fontWeight="700" fill="#5b21b6">
                  {v % 1 === 0 ? v : v.toFixed(1)}
                </text>
              </g>
            );
          })}
          <text x={10} y={78} fontSize={10} fill="#7c3aed">Kernel</text>

          {/* Output */}
          {strideOutput.map((v, i) => {
            const isCurrent = i === pos;
            const barH = Math.abs(v) / absMax * 35;
            const barY = 175 - (v >= 0 ? barH : 0);
            return (
              <g key={i}>
                <rect x={10 + i*(cellW+gapX)} y={145} width={cellW} height={cellH}
                  fill={isCurrent ? '#fef3c7' : '#f9fafb'} stroke={isCurrent ? '#f59e0b' : '#e5e7eb'} strokeWidth={isCurrent?2:1} rx={4} className="dark:stroke-gray-600" />
                <text x={10+i*(cellW+gapX)+cellW/2} y={145+cellH/2+5} textAnchor="middle" fontSize={11}
                  fill={isCurrent ? '#92400e' : '#374151'} fontWeight={isCurrent?'700':'400'} className="dark:fill-gray-200">
                  {v}
                </text>
                <rect x={10+i*(cellW+gapX)+4} y={barY + 195} width={cellW-8} height={barH}
                  fill={v>=0?'rgba(99,102,241,0.4)':'rgba(239,68,68,0.3)'} rx={2} />
              </g>
            );
          })}
          <text x={10} y={143} fontSize={10} fill="#6b7280" className="dark:fill-gray-400">Output ({strideOutput.length} values)</text>
        </svg>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={() => setPos(0)} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">Reset</button>
        <button onClick={() => setPos(p => Math.max(0, p-1))} disabled={pos <= 0}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">← Prev</button>
        <button onClick={() => setPos(p => Math.min(maxPos, p+1))} disabled={pos >= maxPos}
          className="rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 disabled:opacity-40 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">Next →</button>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 self-center">
          Output size = ⌊(L+2P−K)/S⌋+1 = ⌊({INPUT.length}+{2*padding}−{K})/{stride}⌋+1 = {strideOutput.length}
        </span>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# ── 1D Convolution ─────────────────────────────────────────────────────────────
x = torch.tensor([1.,2.,3.,4.,5.,6.,7.,8.]).unsqueeze(0).unsqueeze(0)  # [1,1,8]
kernel = torch.tensor([-1., 2., -1.]).unsqueeze(0).unsqueeze(0)        # [1,1,3]

# Manual convolution
out_no_pad = F.conv1d(x, kernel, padding=0, stride=1)
out_same    = F.conv1d(x, kernel, padding=1, stride=1)  # 'same' padding
out_stride2 = F.conv1d(x, kernel, padding=0, stride=2)

print(f"Input length: {x.shape[-1]}, Kernel: {kernel.shape[-1]}")
print(f"No padding (s=1): output length = {out_no_pad.shape[-1]}")
print(f"Padding=1 (s=1):  output length = {out_same.shape[-1]}    (same as input)")
print(f"Stride=2:         output length = {out_stride2.shape[-1]}")
print(f"Formula: floor((L + 2P - K) / S) + 1")

# ── 2D Convolution ─────────────────────────────────────────────────────────────
# Edge detection kernel (Sobel)
sobel_x = torch.tensor([[-1,0,1],[-2,0,2],[-1,0,1]], dtype=torch.float32)
sobel_y = torch.tensor([[-1,-2,-1],[0,0,0],[1,2,1]],  dtype=torch.float32)
# Reshape to [out_channels, in_channels/groups, H, W]
sobel_x = sobel_x.unsqueeze(0).unsqueeze(0)
sobel_y = sobel_y.unsqueeze(0).unsqueeze(0)

# Random "image"
img = torch.randn(1, 1, 32, 32)
edges_x = F.conv2d(img, sobel_x, padding=1)
edges_y = F.conv2d(img, sobel_y, padding=1)
edges   = torch.sqrt(edges_x**2 + edges_y**2)
print(f"\\n2D conv: input {tuple(img.shape)} → output {tuple(edges.shape)}")

# ── Learnable convolution layer ────────────────────────────────────────────────
conv_layer = nn.Conv2d(
    in_channels=3,  out_channels=64,
    kernel_size=3,  padding=1,  stride=1
)
x_rgb = torch.randn(8, 3, 32, 32)  # batch of 8 RGB 32x32 images
out = conv_layer(x_rgb)
print(f"\\nConv2d: {tuple(x_rgb.shape)} → {tuple(out.shape)}")
print(f"Parameters: {sum(p.numel() for p in conv_layer.parameters()):,}")
# = 64 * (3 * 3 * 3 + 1) = 64 * 28 = 1,792
# weight: [64, 3, 3, 3] = 1728, bias: [64] = 64

# ── Weight sharing: parameter efficiency ───────────────────────────────────────
fc_equiv = nn.Linear(3*32*32, 64*32*32)  # Fully connected equivalent
conv_params = sum(p.numel() for p in conv_layer.parameters())
fc_params   = sum(p.numel() for p in fc_equiv.parameters())
print(f"\\nConv params: {conv_params:,}  vs  FC params: {fc_params:,}")
print(f"Ratio: {fc_params/conv_params:.0f}x more params for FC")
`;

export default function Convolution() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Convolution Operation
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Discrete convolution, feature maps, padding, and stride — the core building block of
          convolutional neural networks and a pillar of modern AI for image and sequence data.
        </p>
      </div>

      <NoteBlock title="Convolution in Signal Processing vs Deep Learning">
        <p>
          In signal processing, convolution is <InlineMath math="(f*g)[n] = \sum_k f[k]g[n-k]" />{' '}
          (note the flip of <InlineMath math="g" />). In deep learning, the operation is technically
          cross-correlation <InlineMath math="(f \star g)[n] = \sum_k f[k]g[n+k]" /> (no flip).
          Since the kernel is learned, the distinction is irrelevant — the network learns the
          flipped kernel anyway. LeNet-5 (LeCun et al., 1998) first demonstrated CNNs for digit
          recognition; AlexNet (Krizhevsky et al., 2012) launched the modern deep learning era.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 3.1"
        title="Discrete 2D Convolution"
        definition="The 2D discrete convolution (cross-correlation) of input $X \in \mathbb{R}^{H \times W}$ with kernel $K \in \mathbb{R}^{k_H \times k_W}$ is: $(X \star K)_{i,j} = \sum_{m=0}^{k_H-1}\sum_{n=0}^{k_W-1} X_{i+m, j+n} \cdot K_{m,n}$. The output feature map has dimensions $H_{out} = \lfloor(H + 2P - k_H)/S\rfloor + 1$ and $W_{out} = \lfloor(W + 2P - k_W)/S\rfloor + 1$, where $P$ is padding and $S$ is stride."
        notation="For $C_{in}$ input channels and $C_{out}$ output channels: $Y_c = \sum_{c'=1}^{C_{in}} X_{c'} \star K_{c,c'} + b_c$. Total parameters: $C_{out} \cdot C_{in} \cdot k_H \cdot k_W + C_{out}$ (biases). Weight sharing: the same kernel $K_{c,c'}$ is applied to every spatial location — enabling translation equivariance."
      />

      <ConvViz />

      <DefinitionBlock
        label="Definition 3.2"
        title="Padding and Stride"
        definition="Padding adds $P$ zeros around the input border before convolution. 'Valid' padding ($P=0$) reduces spatial dimensions; 'same' padding ($P = \lfloor k/2 \rfloor$) preserves input size for stride 1. Stride $S$ controls the step size of the kernel sliding window — stride 2 halves the spatial dimensions (like 2× downsampling). Dilated/atrous convolution uses a dilation rate $d$: kernel elements are spaced $d$ apart, expanding the receptive field without increasing parameters: effective kernel size $(k-1)d + 1$."
        notation="Receptive field of output neuron at layer $l$ with kernel size $k$ and stride $s$: $r_l = r_{l-1} + (k-1) \cdot \prod_{i=1}^{l-1} s_i$. For a stack of $L$ layers with $k=3, s=1$: $r_L = 2L+1$ — grows linearly with depth."
      />

      <TheoremBlock
        label="Theorem 3.1"
        title="Translation Equivariance of Convolution"
        statement="Convolution is translation equivariant: if $T_\tau$ denotes a spatial translation by $\tau$ (i.e., $T_\tau X = X[\cdot - \tau]$), then $(T_\tau X) \star K = T_\tau (X \star K)$. This means detecting a feature at position $\tau$ in the input produces a response at position $\tau$ in the output feature map — the detector translates with the input."
        proof="$(T_\tau X \star K)[n] = \sum_k X[n+\tau-k] K[k] = (X \star K)[n+\tau] = T_\tau(X \star K)[n]$. The translation simply shifts the output feature map by $\tau$. This follows from the commutativity of translation and convolution, a consequence of shift-invariant kernel weighting. $\square$"
        corollaries={[
          "Equivariance enables weight sharing: one kernel suffices to detect a feature anywhere in the image, giving exponential parameter efficiency over fully-connected layers.",
          "Pooling (max-pool, average-pool) converts equivariance to approximate invariance by summarizing local regions — making CNNs robust to small translations.",
          "CNNs are not invariant to rotation or scale — data augmentation (random rotations, flips, crops) or specialized architectures (group-equivariant CNNs) are needed.",
        ]}
      />

      <ExampleBlock
        title="Computing a 2D Convolution by Hand"
        difficulty="intermediate"
        problem="Apply a 3×3 edge-detection kernel $K = [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]$ to the 4×4 input $X$ (no padding, stride 1). What is the output size and the value at position (0,0)?"
        solution={[
          { step: 'Output size formula', formula: 'H_{out} = \\lfloor(4 + 0 - 3)/1\\rfloor + 1 = 2, \\quad W_{out} = 2', explanation: 'No padding (P=0), stride S=1, kernel 3×3. Output is 2×2.' },
          { step: 'Compute output at (0,0)', formula: 'Y_{0,0} = \\sum_{m,n} X_{m,n} K_{m,n}', explanation: 'Sum over the 3×3 top-left patch of X multiplied element-wise with K.' },
          { step: 'Example with X uniform=5 except center=8', formula: 'Y_{0,0} = -1(5)-1(5)-1(5)-1(5)+8(5)-1(5)-1(5)-1(5)-1(8)', explanation: 'Most of the patch is 5, center changes. This shows edge-detection: uniform regions give output near 0.' },
          { step: 'Interpretation', formula: 'Y \\approx 0 \\text{ (smooth region)}, Y \\gg 0 \\text{ (edge/blob)}', explanation: 'The Laplacian-like kernel responds to local intensity changes — a classic image edge detector.' },
        ]}
      />

      <WarningBlock title="Convolution Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Convolution vs cross-correlation:</strong> PyTorch's nn.Conv2d implements cross-correlation (no kernel flip). This is fine for learning but be careful when comparing to signal processing literature.</li>
          <li><strong>Padding for 'same' output:</strong> For even kernel sizes (k=2,4,...), 'same' padding requires asymmetric padding. PyTorch's padding= parameter adds equal padding on both sides — use nn.ZeroPad2d for asymmetric cases.</li>
          <li><strong>Strided vs pooling downsampling:</strong> Strided convolution (modern practice) is learnable and avoids the checkerboard artifacts of transposed convolution. Max-pooling is non-differentiable at ties — PyTorch uses the first maximum by convention.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="1D & 2D Convolution — PyTorch" runnable />
    </div>
  );
}
