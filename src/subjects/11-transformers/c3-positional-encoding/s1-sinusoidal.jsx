import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Sinusoidal PE heatmap: position × dimension
// ---------------------------------------------------------------------------
function SinusoidalHeatmap() {
  const [maxPos, setMaxPos] = useState(20);
  const [dModel, setDModel] = useState(32);

  const pe = useMemo(() => {
    const mat = [];
    for (let pos = 0; pos < maxPos; pos++) {
      const row = [];
      for (let i = 0; i < dModel; i++) {
        const freq = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dModel);
        const val = i % 2 === 0 ? Math.sin(freq) : Math.cos(freq);
        row.push(val);
      }
      mat.push(row);
    }
    return mat;
  }, [maxPos, dModel]);

  function valToColor(v) {
    // -1 (blue) → 0 (white) → +1 (red)
    const t = (v + 1) / 2;
    const r = t < 0.5 ? Math.round(255 * 2 * t) : 255;
    const g = t < 0.5 ? Math.round(255 * 2 * t) : Math.round(255 * (2 - 2 * t));
    const b = t < 0.5 ? 255 : Math.round(255 * (2 - 2 * t));
    return `rgb(${r},${g},${b})`;
  }

  const cellW = Math.max(6, Math.min(14, Math.floor(460 / dModel)));
  const cellH = Math.max(8, Math.min(18, Math.floor(300 / maxPos)));
  const labelW = 32;
  const svgW = labelW + dModel * cellW + 10;
  const svgH = 24 + maxPos * cellH + 16;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Sinusoidal PE Heatmap — Position × Dimension
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each row is a positional encoding vector. Columns are dimensions (even = sin, odd = cos). Low frequencies vary slowly across positions; high frequencies oscillate rapidly.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
            Max pos: {maxPos}
          </label>
          <input type="range" min={4} max={50} step={2} value={maxPos}
            onChange={(e) => setMaxPos(parseInt(e.target.value))}
            className="flex-1 accent-indigo-500" />
        </div>
        <div className="flex items-center gap-3">
          <label className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
            d_model: {dModel}
          </label>
          <input type="range" min={8} max={64} step={8} value={dModel}
            onChange={(e) => setDModel(parseInt(e.target.value))}
            className="flex-1 accent-purple-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH} className="mx-auto block">
          <text x={labelW + (dModel * cellW) / 2} y={14} textAnchor="middle" fontSize={10}
            className="fill-gray-500">Dimension index →</text>
          {pe.map((row, i) => (
            <React.Fragment key={i}>
              <text x={labelW - 3} y={24 + i * cellH + cellH / 2 + 3}
                textAnchor="end" fontSize={9} className="fill-gray-500">{i}</text>
              {row.map((v, j) => (
                <rect key={j} x={labelW + j * cellW} y={24 + i * cellH}
                  width={cellW - 0.5} height={cellH - 0.5}
                  fill={valToColor(v)} />
              ))}
            </React.Fragment>
          ))}
          <text x={8} y={24 + (maxPos * cellH) / 2}
            textAnchor="middle" fontSize={10} transform={`rotate(-90,8,${24 + (maxPos * cellH) / 2})`}
            className="fill-gray-500">Position</text>
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="text-xs text-gray-500">-1</span>
        <svg width={120} height={12}>
          <defs>
            <linearGradient id="peLegend" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={valToColor(-1)} />
              <stop offset="50%" stopColor={valToColor(0)} />
              <stop offset="100%" stopColor={valToColor(1)} />
            </linearGradient>
          </defs>
          <rect width={120} height={12} rx={3} fill="url(#peLegend)" />
        </svg>
        <span className="text-xs text-gray-500">+1</span>
      </div>
    </div>
  );
}

const PE_CODE = `import numpy as np
import torch

def sinusoidal_positional_encoding(max_len: int, d_model: int) -> np.ndarray:
    """
    Returns PE matrix of shape (max_len, d_model).
    PE[pos, 2i]   = sin(pos / 10000^(2i/d_model))
    PE[pos, 2i+1] = cos(pos / 10000^(2i/d_model))
    """
    pe = np.zeros((max_len, d_model))
    positions = np.arange(max_len)[:, None]          # (max_len, 1)
    i = np.arange(d_model // 2)[None, :]             # (1, d_model/2)
    div_term = np.power(10000.0, 2 * i / d_model)    # frequencies
    pe[:, 0::2] = np.sin(positions / div_term)        # even dims: sin
    pe[:, 1::2] = np.cos(positions / div_term)        # odd dims: cos
    return pe

# Visualize
pe = sinusoidal_positional_encoding(max_len=100, d_model=512)
print("PE shape:", pe.shape)  # (100, 512)
print("Position 0, dims 0-4:", pe[0, :5].round(3))
print("Position 1, dims 0-4:", pe[1, :5].round(3))

# Verify dot product property: nearby positions should be more similar
def pe_similarity(pos1, pos2):
    return np.dot(pe[pos1], pe[pos2]) / (np.linalg.norm(pe[pos1]) * np.linalg.norm(pe[pos2]))

print(f"\\nSim(0,1)  = {pe_similarity(0, 1):.4f}")
print(f"Sim(0,5)  = {pe_similarity(0, 5):.4f}")
print(f"Sim(0,50) = {pe_similarity(0, 50):.4f}")

# PyTorch module
class SinusoidalPE(torch.nn.Module):
    def __init__(self, d_model: int, max_len: int = 5000, dropout: float = 0.1):
        super().__init__()
        self.dropout = torch.nn.Dropout(dropout)
        pe_np = sinusoidal_positional_encoding(max_len, d_model)
        pe_t = torch.tensor(pe_np, dtype=torch.float32).unsqueeze(0)  # (1, max_len, d)
        self.register_buffer('pe', pe_t)

    def forward(self, x):
        # x: (B, T, d_model)
        return self.dropout(x + self.pe[:, :x.size(1), :])`;

export default function SinusoidalEncoding() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Sinusoidal Positional Encoding
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The original fixed positional encoding from "Attention Is All You Need" — a deterministic function of position and dimension index.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Sinusoidal Positional Encoding"
        definition="The sinusoidal PE assigns each position $\text{pos} \in \{0, \ldots, T-1\}$ a $d_{\text{model}}$-dimensional vector: $\text{PE}(\text{pos}, 2i) = \sin\!\left(\frac{\text{pos}}{10000^{2i/d_{\text{model}}}}\right)$, $\text{PE}(\text{pos}, 2i+1) = \cos\!\left(\frac{\text{pos}}{10000^{2i/d_{\text{model}}}}\right)$. This vector is added to the token embedding before the first encoder/decoder block."
        notation="$i \in \{0, 1, \ldots, d_{\text{model}}/2 - 1\}$ is the dimension pair index. The base $10{,}000$ determines the range of frequencies. Even dimensions use sine; odd dimensions use cosine."
      />

      <SinusoidalHeatmap />

      <DefinitionBlock
        label="Definition 1.2"
        title="Frequency Structure"
        definition="The wavelength of dimension $2i$ is $\lambda_i = 2\pi \cdot 10000^{2i/d_{\text{model}}}$. For $i=0$: $\lambda_0 = 2\pi \approx 6.28$ (very high frequency, oscillates every ~6 positions). For $i = d/2-1$: $\lambda_{\max} = 2\pi \cdot 10000 \approx 62{,}832$ (very low frequency, nearly constant across typical sequence lengths). This geometric frequency spacing means each dimension encodes position at a different resolution."
        notation="The encoding covers periods from $2\pi$ to $2\pi \times 10000$, giving roughly logarithmically spaced frequency bands — similar in spirit to the Fourier transform."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Relative Position Linearity"
        statement="For any fixed offset $k$, the sinusoidal encoding satisfies: $\text{PE}(\text{pos} + k)$ can be expressed as a linear transformation of $\text{PE}(\text{pos})$. Specifically, for dimension pair $i$, $[\sin((\text{pos}+k)\omega_i), \cos((\text{pos}+k)\omega_i)] = R(k\omega_i) \cdot [\sin(\text{pos}\cdot\omega_i), \cos(\text{pos}\cdot\omega_i)]$ where $R(\theta)$ is a 2D rotation matrix. This means the model can potentially learn to attend to tokens at a fixed relative offset via a learned linear transformation."
        proof="Angle addition: $\sin(a+b) = \sin a \cos b + \cos a \sin b$ and $\cos(a+b) = \cos a \cos b - \sin a \sin b$. Setting $a = \text{pos} \cdot \omega_i$ and $b = k \cdot \omega_i$: $\begin{bmatrix}\sin((\text{pos}+k)\omega_i)\\\cos((\text{pos}+k)\omega_i)\end{bmatrix} = \begin{bmatrix}\cos(k\omega_i) & \sin(k\omega_i)\\-\sin(k\omega_i) & \cos(k\omega_i)\end{bmatrix}\begin{bmatrix}\sin(\text{pos}\cdot\omega_i)\\\cos(\text{pos}\cdot\omega_i)\end{bmatrix}$. This is a rotation by $k\omega_i$, which depends only on $k$ (not pos). $\square$"
        corollaries={[
          "This motivated the design of Rotary Position Embeddings (RoPE), which make this rotation explicit in the attention score computation.",
          "The original paper noted this property as a motivation but sinusoidal PE was later superseded by learned and relative position methods in practice.",
        ]}
      />

      <ExampleBlock
        title="Computing PE for Position 1, d_model=4"
        difficulty="intermediate"
        problem="Compute the sinusoidal positional encoding for position 1 with $d_{\text{model}} = 4$ (dimension indices 0, 1, 2, 3)."
        solution={[
          { step: "Compute frequencies $\\omega_i = 1/10000^{2i/d}$", formula: "\\omega_0 = 1/10000^{0} = 1.0, \\quad \\omega_1 = 1/10000^{2/4} = 1/100 = 0.01" },
          { step: "Compute PE values at pos=1", formula: "\\text{PE}(1,0) = \\sin(1 \\cdot 1.0) \\approx 0.841, \\quad \\text{PE}(1,1) = \\cos(1 \\cdot 1.0) \\approx 0.540" },
          { step: "Continue for dimensions 2, 3", formula: "\\text{PE}(1,2) = \\sin(1 \\cdot 0.01) \\approx 0.01, \\quad \\text{PE}(1,3) = \\cos(1 \\cdot 0.01) \\approx 1.0", explanation: "Low-index dimensions change rapidly across positions; high-index dimensions change very slowly." },
        ]}
      />

      <WarningBlock title="Limitations of Sinusoidal PE">
        <ul className="space-y-2 text-sm">
          <li><strong>No extrapolation guarantee.</strong> While the encoding is defined for any position, the model only sees positions up to training length $T_{\text{train}}$. Performance degrades for positions beyond $T_{\text{train}}$ because the model hasn't learned to use those encodings.</li>
          <li className="mt-2"><strong>Additive vs. rotary.</strong> Sinusoidal PE is added to token embeddings before attention, which means it can interact unexpectedly with token features. RoPE and ALiBi instead modify attention scores directly, giving better length generalization.</li>
          <li className="mt-2"><strong>Not used in modern LLMs.</strong> Virtually no current LLM uses sinusoidal PE. Llama, Mistral, GPT-NeoX, and others use RoPE; PaLM initially used learned absolute PE; ALiBi is used in BLOOM.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={PE_CODE} title="Sinusoidal Positional Encoding — NumPy + PyTorch" runnable />
    </div>
  );
}
