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
// Unrolled RNN Diagram
// ---------------------------------------------------------------------------

const SEQ_LEN = 5;
const TOKENS = ['The', 'cat', 'sat', 'on', 'mat'];

function RNNDiagram() {
  const [activeStep, setActiveStep] = useState(0);
  const [showGrad, setShowGrad] = useState(false);

  const W = 560, H = 200;
  const stepW = W / SEQ_LEN;
  const nodeY = 80, inputY = 160, outputY = 20;
  const nodeR = 22;

  // Gradient magnitude (exponentially decaying as we go back)
  const gradMag = (t) => Math.pow(0.5, activeStep - t);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Unrolled RNN: Hidden State Flow</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Click a timestep to see how the hidden state propagates and how gradients decay during BPTT.
      </p>

      <div className="flex gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={showGrad} onChange={e => setShowGrad(e.target.checked)} />
          Show gradient flow (darker = stronger gradient)
        </label>
      </div>

      <svg width={W} height={H} className="mx-auto block">
        {/* Hidden state arrows (horizontal) */}
        {Array.from({ length: SEQ_LEN - 1 }, (_, i) => {
          const x1 = (i + 0.5) * stepW + nodeR;
          const x2 = (i + 1.5) * stepW - nodeR;
          const isActive = i < activeStep;
          return (
            <g key={`h${i}`}>
              <line x1={x1} y1={nodeY} x2={x2} y2={nodeY}
                stroke={isActive ? '#6366f1' : '#e5e7eb'}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={isActive ? '' : 'dark:stroke-gray-600'} />
              <polygon points={`${x2},${nodeY} ${x2-8},${nodeY-4} ${x2-8},${nodeY+4}`}
                fill={isActive ? '#6366f1' : '#e5e7eb'} />
            </g>
          );
        })}

        {/* Gradient flow arrows (backward, if showGrad) */}
        {showGrad && Array.from({ length: activeStep }, (_, i) => {
          const t = activeStep - 1 - i;
          const x1 = (t + 1.5) * stepW - nodeR - 4;
          const x2 = (t + 0.5) * stepW + nodeR + 4;
          const g = gradMag(t + 1);
          return (
            <g key={`grad${t}`}>
              <line x1={x1} y1={nodeY + 14} x2={x2} y2={nodeY + 14}
                stroke={`rgba(239,68,68,${g})`} strokeWidth={1 + g * 2}
                strokeDasharray="4,2" />
              <polygon points={`${x2},${nodeY+14} ${x2+6},${nodeY+10} ${x2+6},${nodeY+18}`}
                fill={`rgba(239,68,68,${g})`} />
            </g>
          );
        })}

        {/* Input arrows */}
        {Array.from({ length: SEQ_LEN }, (_, t) => {
          const cx = (t + 0.5) * stepW;
          const isActive = t <= activeStep;
          return (
            <g key={`in${t}`}>
              <line x1={cx} y1={inputY - 8} x2={cx} y2={nodeY + nodeR}
                stroke={isActive ? '#10b981' : '#e5e7eb'} strokeWidth={1.5}
                className={isActive ? '' : 'dark:stroke-gray-600'} />
            </g>
          );
        })}

        {/* Hidden state nodes */}
        {Array.from({ length: SEQ_LEN }, (_, t) => {
          const cx = (t + 0.5) * stepW;
          const isActive = t <= activeStep;
          const isCurrent = t === activeStep;
          return (
            <g key={`node${t}`} onClick={() => setActiveStep(t)} className="cursor-pointer">
              <circle cx={cx} cy={nodeY} r={nodeR}
                fill={isCurrent ? '#4f46e5' : isActive ? '#818cf8' : '#e5e7eb'}
                stroke={isCurrent ? '#312e81' : '#fff'} strokeWidth={isCurrent ? 2.5 : 2} />
              <text x={cx} y={nodeY + 4} textAnchor="middle" fontSize={10} fontWeight="600"
                fill={isActive ? '#fff' : '#6b7280'}>
                h{t}
              </text>
            </g>
          );
        })}

        {/* Input tokens */}
        {TOKENS.map((tok, t) => {
          const cx = (t + 0.5) * stepW;
          const isActive = t <= activeStep;
          return (
            <g key={`tok${t}`} onClick={() => setActiveStep(t)} className="cursor-pointer">
              <rect x={cx - 24} y={inputY} width={48} height={22} rx={4}
                fill={isActive ? '#d1fae5' : '#f3f4f6'}
                stroke={isActive ? '#10b981' : '#e5e7eb'} strokeWidth={1} />
              <text x={cx} y={inputY + 14} textAnchor="middle" fontSize={11} fontWeight="600"
                fill={isActive ? '#065f46' : '#6b7280'}>
                {tok}
              </text>
            </g>
          );
        })}

        {/* Labels */}
        <text x={5} y={nodeY + 5} fontSize={9} fill="#9ca3af">h_t</text>
        <text x={5} y={inputY + 14} fontSize={9} fill="#9ca3af">x_t</text>
      </svg>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
        <strong>Step {activeStep}:</strong> After processing "{TOKENS.slice(0, activeStep+1).join(' ')}",
        hidden state h{activeStep} encodes context from all previous tokens.
        {showGrad && activeStep > 0 && (
          <span className="ml-2 text-rose-600 dark:text-rose-400">
            Gradient to h0 is {gradMag(0).toFixed(3)} of gradient at h{activeStep} (×{(0.5).toFixed(1)} per step).
          </span>
        )}
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn
import numpy as np

# ── Vanilla RNN manual implementation ─────────────────────────────────────────
class VanillaRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.hidden_size = hidden_size
        # Weight matrices
        self.W_xh = nn.Linear(input_size, hidden_size)   # input → hidden
        self.W_hh = nn.Linear(hidden_size, hidden_size, bias=False)  # hidden → hidden
        self.W_hy = nn.Linear(hidden_size, output_size)  # hidden → output

    def forward(self, x, h_0=None):
        """
        x: [batch, seq_len, input_size]
        Returns: outputs [batch, seq_len, output_size], final hidden state
        """
        B, T, _ = x.shape
        h = h_0 if h_0 is not None else torch.zeros(B, self.hidden_size)
        outputs = []
        for t in range(T):
            h = torch.tanh(self.W_xh(x[:, t, :]) + self.W_hh(h))
            y_t = self.W_hy(h)
            outputs.append(y_t)
        return torch.stack(outputs, dim=1), h

# Using PyTorch's built-in RNN
rnn = nn.RNN(input_size=10, hidden_size=32, num_layers=2,
             batch_first=True, dropout=0.3)
x = torch.randn(4, 20, 10)  # [batch=4, seq=20, features=10]
out, hn = rnn(x)
print(f"RNN output: {out.shape}, final hidden: {hn.shape}")

# ── BPTT (Backprop Through Time) gradient analysis ────────────────────────────
def check_gradient_flow(seq_len, hidden_size=32):
    """Measure gradient magnitude at each timestep."""
    rnn = VanillaRNN(5, hidden_size, 1)
    x = torch.randn(1, seq_len, 5)
    out, _ = rnn(x)
    loss = out[:, -1, :].sum()  # Only final output contributes to loss
    loss.backward()

    # Gradient of W_hh measures how much early inputs matter
    grad = rnn.W_hh.weight.grad
    return grad.norm().item()

print("\\nGradient analysis (tanh RNN):")
for T in [5, 10, 20, 50]:
    g = check_gradient_flow(T)
    bar = '█' * max(1, int(g * 50))
    print(f"  T={T:2d}: grad_norm = {g:.4f}  {bar}")

# ── Vanishing gradient: eigenvalue analysis ────────────────────────────────────
def max_eigenvalue_effect(W_hh, n_steps):
    """Simulate gradient magnitude after n_steps of BPTT."""
    # Gradient is proportional to W_hh^n_steps (approx for linear case)
    W = W_hh.detach().numpy()
    eigenvalues = np.linalg.eigvals(W)
    spectral_radius = max(abs(eigenvalues))
    # Gradient magnitude decays/explodes as spectral_radius^n_steps
    return spectral_radius ** n_steps

rnn_model = VanillaRNN(5, 8, 1)
print(f"\\nSpectral radius of W_hh: {max(abs(np.linalg.eigvals(rnn_model.W_hh.weight.detach().numpy()))):.4f}")
for n in [5, 10, 20]:
    effect = max_eigenvalue_effect(rnn_model.W_hh.weight, n)
    print(f"  After {n:2d} steps: gradient effect = {effect:.6f}")
`;

export default function VanillaRNN() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Vanilla RNN
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Recurrent computation, backpropagation through time, and the vanishing gradient
          problem — why simple RNNs struggle with long-range dependencies.
        </p>
      </div>

      <NoteBlock title="RNN History">
        <p>
          Recurrent networks were proposed by Jordan (1986) and Elman (1990). The BPTT algorithm
          (Werbos 1990, Williams &amp; Zipser 1995) extends backprop to sequences. The vanishing
          gradient problem was identified by Hochreiter (1991) and analyzed rigorously by Hochreiter
          &amp; Schmidhuber (1997), who proposed LSTM as the solution. Vanilla RNNs are now primarily
          used for teaching; practical sequence models use LSTM, GRU, or Transformers.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 4.1"
        title="Vanilla RNN"
        definition="A recurrent neural network (RNN) processes a sequence $(\mathbf{x}_1, \ldots, \mathbf{x}_T)$ by maintaining a hidden state $\mathbf{h}_t$ that summarizes past inputs. At each timestep: $\mathbf{h}_t = \tanh(W_{hh}\mathbf{h}_{t-1} + W_{xh}\mathbf{x}_t + \mathbf{b}_h)$, $\hat{\mathbf{y}}_t = W_{hy}\mathbf{h}_t + \mathbf{b}_y$. The same weight matrices $W_{hh}, W_{xh}, W_{hy}$ are shared across all timesteps (parameter sharing in time)."
        notation="$W_{hh} \in \mathbb{R}^{H \times H}$ is the recurrent weight matrix, $W_{xh} \in \mathbb{R}^{H \times D}$ maps input to hidden, $W_{hy} \in \mathbb{R}^{C \times H}$ maps hidden to output. $H$ is hidden size, $D$ input dimension, $C$ output dimension. Total parameters: $H^2 + HD + CH + H + C$ — independent of sequence length $T$."
      />

      <RNNDiagram />

      <DefinitionBlock
        label="Definition 4.2"
        title="Backpropagation Through Time (BPTT)"
        definition="BPTT computes gradients for RNNs by unrolling the recurrence for $T$ timesteps and applying standard backpropagation. The gradient of loss $\mathcal{L}$ with respect to the hidden state at time $t$ satisfies: $\frac{\partial \mathcal{L}}{\partial \mathbf{h}_t} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_T} \prod_{k=t}^{T-1} \frac{\partial \mathbf{h}_{k+1}}{\partial \mathbf{h}_k}$, where $\partial \mathbf{h}_{k+1}/\partial \mathbf{h}_k = W_{hh}^\top \text{diag}(\tanh'(\mathbf{z}_k))$."
        notation="Truncated BPTT limits the unrolling to $\tau < T$ steps to reduce memory and computation. Full BPTT requires $O(T)$ memory for the hidden state tape. The product of $T$ Jacobians is the source of vanishing/exploding gradients."
      />

      <TheoremBlock
        label="Theorem 4.1"
        title="Vanishing &amp; Exploding Gradients in RNNs"
        statement="For a vanilla RNN with $\tanh$ activation and recurrent matrix $W_{hh}$, the gradient $\partial \mathcal{L}/\partial \mathbf{h}_t$ decays to zero exponentially in $(T-t)$ if the spectral radius $\rho(W_{hh}) < 1$, and grows unboundedly if $\rho(W_{hh}) > 1$. Specifically, $\|\partial \mathbf{h}_{t+1}/\partial \mathbf{h}_t\|_2 \leq \|W_{hh}\|_2 \cdot \max_k|\tanh'(z_k)| \leq \|W_{hh}\|_2$, so $\|\partial \mathcal{L}/\partial \mathbf{h}_t\| \leq C \cdot \|W_{hh}\|_2^{T-t}$."
        proof="The Jacobian $\partial \mathbf{h}_{k+1}/\partial \mathbf{h}_k = \text{diag}(\tanh'(\mathbf{z}_k)) W_{hh}$. Since $|\tanh'(z)| \leq 1$, the spectral norm is bounded by $\|W_{hh}\|_2$. The product of $(T-t)$ such matrices satisfies $\|\prod_k J_k\|_2 \leq \prod_k \|J_k\|_2 \leq \|W_{hh}\|_2^{T-t}$ (submultiplicativity). If $\|W_{hh}\|_2 < 1$: exponential decay. If $> 1$: exponential growth. For typical random initialization with $\|W_{hh}\|_2 \approx \sqrt{H}$, gradients explode in deep (long) sequences. $\square$"
        corollaries={[
          "Gradient clipping (clip gradient norm to a threshold, e.g., 5.0) mitigates exploding gradients but not vanishing ones.",
          "LSTM and GRU address vanishing gradients via gating mechanisms that create additive (not multiplicative) gradient paths.",
          "The \"stable\" training regime requires $\\rho(W_{hh}) \\approx 1$ (edge of chaos), achievable with careful initialization (orthogonal) or spectral normalization.",
        ]}
      />

      <ExampleBlock
        title="Manual RNN Forward Pass for Language Modeling"
        difficulty="advanced"
        problem="Given a 2-step RNN with $h_0 = [0, 0]$, $W_{hh} = [[0.5, 0.1], [0.1, 0.5]]$, $W_{xh} = [[1, 0], [0, 1]]$, $\tanh$ activation, and inputs $x_1 = [1, 0]$, $x_2 = [0, 1]$, compute $h_1$ and $h_2$."
        solution={[
          { step: 'Compute h₁', formula: '\\mathbf{z}_1 = W_{hh}\\mathbf{h}_0 + W_{xh}\\mathbf{x}_1 = [0,0] + [1,0] = [1, 0]', explanation: 'Initial hidden state is zero. Input [1,0] is added directly.' },
          { step: 'Apply tanh', formula: '\\mathbf{h}_1 = \\tanh([1, 0]) = [0.762, 0.000]', explanation: 'tanh(1)=0.762, tanh(0)=0. First dimension activated by first input.' },
          { step: 'Compute z₂', formula: '\\mathbf{z}_2 = W_{hh}\\mathbf{h}_1 + W_{xh}\\mathbf{x}_2 = [0.381, 0.076] + [0, 1] = [0.381, 1.076]', explanation: 'Previous hidden state is transformed by W_hh and added to new input.' },
          { step: 'Compute h₂', formula: '\\mathbf{h}_2 = \\tanh([0.381, 1.076]) \\approx [0.364, 0.793]', explanation: 'h₂ encodes both x₁ (via h₁) and x₂. The recurrence mixes past and present.' },
        ]}
      />

      <WarningBlock title="Vanilla RNN Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Long-range dependencies:</strong> Vanilla RNNs cannot reliably learn dependencies spanning more than ~10-20 timesteps due to vanishing gradients. Use LSTM or GRU for longer contexts.</li>
          <li><strong>Gradient clipping is necessary:</strong> Always clip gradients when training RNNs (torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5)). Without clipping, exploding gradients crash training.</li>
          <li><strong>Sequence length and memory:</strong> BPTT requires storing all hidden states for the entire sequence. For very long sequences (e.g., 10k+ tokens), use truncated BPTT or switch to attention-based models (Transformers) that avoid recurrence.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="Vanilla RNN — Implementation & Gradient Analysis" runnable />
    </div>
  );
}
