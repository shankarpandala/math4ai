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
// LSTM Gate Diagram with Value Sliders
// ---------------------------------------------------------------------------

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function LSTMViz() {
  const [f, setF] = useState(0.8);  // forget gate logit
  const [i, setI] = useState(0.5);  // input gate logit
  const [g, setG] = useState(0.7);  // cell gate logit
  const [o, setO] = useState(0.6);  // output gate logit
  const [cPrev, setCPrev] = useState(1.0);

  const fVal = sigmoid(f);
  const iVal = sigmoid(i);
  const gVal = Math.tanh(g);
  const oVal = sigmoid(o);
  const cNext = fVal * cPrev + iVal * gVal;
  const hNext = oVal * Math.tanh(cNext);

  const Bar = ({ val, color, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs w-5 text-right text-gray-500">{label}</span>
      <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-3">
        <div className="rounded-full h-3 transition-all" style={{ width: `${Math.abs(val)*100}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono w-12 text-gray-700 dark:text-gray-300">{val.toFixed(3)}</span>
    </div>
  );

  const Slider = ({ label, value, onChange, color }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs w-20 font-semibold" style={{ color }}>{label}</span>
      <input type="range" min={-4} max={4} step={0.1} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} className="flex-1" />
      <span className="text-xs font-mono w-12 text-gray-500">{value.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">LSTM Gate Simulator</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust gate logits to see how the cell state and hidden state are computed.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Gate Logits</p>
          <Slider label="Forget (f)" value={f} onChange={setF} color="#ef4444" />
          <Slider label="Input (i)" value={i} onChange={setI} color="#6366f1" />
          <Slider label="Cell gate (g)" value={g} onChange={setG} color="#10b981" />
          <Slider label="Output (o)" value={o} onChange={setO} color="#f59e0b" />
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xs w-20 font-semibold text-gray-500">Prev cell c</span>
            <input type="range" min={-2} max={2} step={0.1} value={cPrev}
              onChange={e => setCPrev(parseFloat(e.target.value))} className="flex-1" />
            <span className="text-xs font-mono w-12 text-gray-500">{cPrev.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Gate Values &amp; Output</p>
          <Bar val={fVal} color="#ef4444" label="f" />
          <Bar val={iVal} color="#6366f1" label="i" />
          <Bar val={gVal} color="#10b981" label="g̃" />
          <Bar val={oVal} color="#f59e0b" label="o" />
          <div className="mt-3 space-y-1 border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">c_next = f×c_prev + i×g̃</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                = {fVal.toFixed(2)}×{cPrev.toFixed(1)} + {iVal.toFixed(2)}×{gVal.toFixed(2)} = <strong>{cNext.toFixed(3)}</strong>
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">h_next = o × tanh(c_next)</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                = {oVal.toFixed(2)}×{Math.tanh(cNext).toFixed(2)} = <strong>{hNext.toFixed(3)}</strong>
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2 text-xs text-gray-600 dark:text-gray-400">
            f≈1 preserves memory, f≈0 forgets. i≈1 writes new info. o≈1 exposes cell state.
          </div>
        </div>
      </div>
    </div>
  );
}

const CODE = `import torch
import torch.nn as nn

# ── LSTM manual step (for understanding) ──────────────────────────────────────
def lstm_step(x, h_prev, c_prev, W_i, W_f, W_g, W_o, b_i, b_f, b_g, b_o):
    """One LSTM timestep."""
    # Stack input and hidden (combined input for gate computation)
    xh = torch.cat([x, h_prev], dim=-1)
    # Gates
    f = torch.sigmoid(xh @ W_f.T + b_f)  # Forget gate
    i = torch.sigmoid(xh @ W_i.T + b_i)  # Input gate
    g = torch.tanh(xh @ W_g.T + b_g)     # Cell gate (candidate)
    o = torch.sigmoid(xh @ W_o.T + b_o)  # Output gate
    # Cell state update (additive! gradient highway)
    c_next = f * c_prev + i * g
    h_next = o * torch.tanh(c_next)
    return h_next, c_next

# ── PyTorch LSTM usage ────────────────────────────────────────────────────────
lstm = nn.LSTM(input_size=10, hidden_size=64, num_layers=2,
               batch_first=True, dropout=0.3, bidirectional=False)

x = torch.randn(8, 50, 10)  # [batch=8, seq=50, features=10]
out, (hn, cn) = lstm(x)
print(f"LSTM output: {out.shape}")  # [8, 50, 64]
print(f"Final hidden: {hn.shape}")  # [2, 8, 64] (num_layers × batch × hidden)
print(f"Cell state:   {cn.shape}")  # [2, 8, 64]

# ── GRU (simpler alternative to LSTM) ─────────────────────────────────────────
gru = nn.GRU(input_size=10, hidden_size=64, num_layers=2,
             batch_first=True, dropout=0.3)
out_gru, hn_gru = gru(x)
print(f"\\nGRU output: {out_gru.shape}")  # [8, 50, 64]

# GRU equations (for reference):
# z = sigmoid(W_z [h, x] + b_z)  # update gate
# r = sigmoid(W_r [h, x] + b_r)  # reset gate
# h_tilde = tanh(W [r*h, x] + b) # candidate hidden
# h_next = (1-z) * h + z * h_tilde

# ── LSTM vs GRU parameter count ───────────────────────────────────────────────
input_size, hidden_size = 10, 64
lstm_params = sum(p.numel() for p in lstm.parameters())
gru_params  = sum(p.numel() for p in gru.parameters())
print(f"\\nLSTM params (2-layer): {lstm_params:,}")
print(f"GRU params  (2-layer): {gru_params:,}")
# LSTM: 4 * (H*(H+D) + H) gates per layer
# GRU:  3 * (H*(H+D) + H) gates per layer (~75% of LSTM)

# ── Sequence classification with LSTM ─────────────────────────────────────────
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden, n_layers, n_classes):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm  = nn.LSTM(embed_dim, hidden, n_layers,
                             batch_first=True, dropout=0.5, bidirectional=True)
        self.fc    = nn.Linear(hidden * 2, n_classes)  # *2 for bidirectional
        self.drop  = nn.Dropout(0.5)

    def forward(self, tokens):
        x = self.drop(self.embed(tokens))
        out, (hn, _) = self.lstm(x)
        # Concatenate forward and backward final hidden states
        h = torch.cat([hn[-2], hn[-1]], dim=-1)
        return self.fc(self.drop(h))

model = SentimentLSTM(vocab_size=10000, embed_dim=100, hidden=256, n_layers=2, n_classes=2)
tokens = torch.randint(0, 10000, (4, 128))  # batch of 4 sequences length 128
logits = model(tokens)
print(f"\\nSentiment model output: {logits.shape}")
`;

export default function LSTMandGRU() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          LSTM &amp; GRU
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Gating mechanisms, cell state, and long-range dependencies — how LSTM and GRU solve
          the vanishing gradient problem that cripples vanilla RNNs.
        </p>
      </div>

      <NoteBlock title="LSTM Origins">
        <p>
          Long Short-Term Memory (LSTM) was introduced by Hochreiter &amp; Schmidhuber in 1997
          to solve the vanishing gradient problem. The key insight: the cell state <InlineMath math="c_t" />{' '}
          is updated additively (not multiplicatively), creating a gradient highway through time.
          The Gated Recurrent Unit (GRU) was proposed by Cho et al. (2014) as a simpler alternative
          with two gates instead of three, often matching LSTM performance with fewer parameters.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 4.3"
        title="Long Short-Term Memory (LSTM)"
        definition="An LSTM maintains two states: hidden state $\mathbf{h}_t \in \mathbb{R}^H$ and cell state $\mathbf{c}_t \in \mathbb{R}^H$. At each timestep, four gates are computed from $[\mathbf{h}_{t-1}, \mathbf{x}_t]$: forget gate $\mathbf{f}_t = \sigma(W_f[\mathbf{h}_{t-1},\mathbf{x}_t]+\mathbf{b}_f)$, input gate $\mathbf{i}_t = \sigma(W_i[\mathbf{h}_{t-1},\mathbf{x}_t]+\mathbf{b}_i)$, cell gate $\tilde{\mathbf{c}}_t = \tanh(W_g[\mathbf{h}_{t-1},\mathbf{x}_t]+\mathbf{b}_g)$, output gate $\mathbf{o}_t = \sigma(W_o[\mathbf{h}_{t-1},\mathbf{x}_t]+\mathbf{b}_o)$. Cell update: $\mathbf{c}_t = \mathbf{f}_t \odot \mathbf{c}_{t-1} + \mathbf{i}_t \odot \tilde{\mathbf{c}}_t$. Hidden state: $\mathbf{h}_t = \mathbf{o}_t \odot \tanh(\mathbf{c}_t)$."
        notation="$\odot$ is element-wise (Hadamard) product. $\sigma$ is sigmoid. The forget gate $\mathbf{f}_t \in (0,1)^H$ controls how much of the previous cell state to retain. When $\mathbf{f}_t \approx 1$ and $\mathbf{i}_t \approx 0$: cell state is preserved unchanged (long-range memory). LSTM parameters: $4(H \cdot (H+D) + H)$ per layer."
      />

      <LSTMViz />

      <DefinitionBlock
        label="Definition 4.4"
        title="Gated Recurrent Unit (GRU)"
        definition="A GRU simplifies LSTM to two gates and one state vector. Update gate $\mathbf{z}_t = \sigma(W_z[\mathbf{h}_{t-1},\mathbf{x}_t])$ controls how much to update. Reset gate $\mathbf{r}_t = \sigma(W_r[\mathbf{h}_{t-1},\mathbf{x}_t])$ controls how much past to use for candidate. Candidate: $\tilde{\mathbf{h}}_t = \tanh(W[\mathbf{r}_t \odot \mathbf{h}_{t-1}, \mathbf{x}_t])$. Update: $\mathbf{h}_t = (1-\mathbf{z}_t) \odot \mathbf{h}_{t-1} + \mathbf{z}_t \odot \tilde{\mathbf{h}}_t$."
        notation="GRU has ~75% of LSTM parameters. The update gate interpolates between previous hidden state (memory) and new candidate (new information). When $\mathbf{z}_t \approx 0$: old hidden state is preserved; when $\mathbf{z}_t \approx 1$: new candidate replaces it. No separate cell state — one vector plays both roles."
      />

      <TheoremBlock
        label="Theorem 4.2"
        title="LSTM Gradient Highway"
        statement="In an LSTM, the gradient of the loss with respect to the cell state at timestep $t$ satisfies: $\frac{\partial \mathcal{L}}{\partial \mathbf{c}_t} = \frac{\partial \mathcal{L}}{\partial \mathbf{c}_T} \prod_{k=t}^{T-1} \mathbf{f}_{k+1}$. If the forget gate is held near 1 (i.e., $\mathbf{f}_k \approx \mathbf{1}$), gradients flow through all timesteps without vanishing. This is the 'constant error carousel' — the key mechanism enabling LSTMs to learn long-range dependencies."
        proof="Cell state update: $\mathbf{c}_{t+1} = \mathbf{f}_{t+1} \odot \mathbf{c}_t + \mathbf{i}_{t+1} \odot \tilde{\mathbf{c}}_{t+1}$. Taking derivative: $\partial \mathbf{c}_{t+1}/\partial \mathbf{c}_t = \text{diag}(\mathbf{f}_{t+1})$. Applying chain rule through $T-t$ steps: $\partial \mathbf{c}_T/\partial \mathbf{c}_t = \prod_{k=t}^{T-1} \text{diag}(\mathbf{f}_{k+1})$. This product of diagonal matrices (with values in $(0,1)$) can be maintained near 1 if the gates learn to stay near 1, unlike the product of full Jacobian matrices in vanilla RNNs which quickly shrinks. $\square$"
        corollaries={[
          "The forget gate's initial bias is crucial: initializing $b_f = 1$ (or 2) encourages $f_t \\approx \\sigma(1) \\approx 0.73$ at initialization, which helps the cell state flow early in training.",
          "LSTMs can still fail for very long sequences ($T > 1000$) or when the forget gate consistently outputs near 0. Attention mechanisms (Transformers) avoid recurrence entirely.",
          "Gradient clipping is still needed for LSTMs in practice — the hidden state $h_t$ still passes through sigmoid/tanh, which can cause some degree of vanishing.",
        ]}
      />

      <ExampleBlock
        title="LSTM Forget Gate: Selective Memory"
        difficulty="advanced"
        problem="Explain how an LSTM can learn to ignore a distractor word in a sentence like 'The actor who won the award was [long clause] happy.' The subject 'actor' must be remembered past the clause."
        solution={[
          { step: 'Process "The actor"', formula: 'c_1 \\approx \\text{[actor=singular]}', explanation: 'The cell state stores grammatical number of subject.' },
          { step: 'Process the relative clause', formula: 'f_t \\approx 1 \\text{ for number slot} \\Rightarrow c_t \\approx c_1', explanation: 'The forget gate learns to preserve number information through distractor words. Input gate learns to write clause info to different dimensions.' },
          { step: 'Arrive at "was"', formula: 'h_T = o_T \\odot \\tanh(c_T), \\quad c_T[\\text{number}] \\approx c_1[\\text{number}]', explanation: 'The hidden state can read out subject number from cell state to predict "was" (singular) vs "were" (plural).' },
          { step: 'Why this works', formula: '\\frac{\\partial \\mathcal{L}}{\\partial c_1} = \\frac{\\partial \\mathcal{L}}{\\partial c_T} \\cdot f_2 \\cdots f_T \\approx \\frac{\\partial \\mathcal{L}}{\\partial c_T}', explanation: 'If f_t ≈ 1 for the number dimension throughout the clause, the gradient flows back to c_1 unchanged, allowing the LSTM to learn to preserve this information.' },
        ]}
      />

      <WarningBlock title="LSTM/GRU Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>Forget gate initialization:</strong> Always initialize the forget gate bias to 1 (or 2) for better gradient flow early in training. PyTorch's nn.LSTM initializes all biases to 0 by default — add a line: <code>lstm.bias_hh_l0.data[hidden_size:2*hidden_size].fill_(1.0)</code>.</li>
          <li><strong>Bidirectional LSTM:</strong> Doubles parameters and hidden size (for classification from hn). Output is [batch, seq, 2H] — remember to concatenate forward and backward final hidden states, not use the raw hn directly.</li>
          <li><strong>LSTM vs Transformer:</strong> For sequences longer than a few hundred tokens or tasks requiring global context, Transformers (self-attention) outperform LSTM significantly. LSTMs are still competitive for streaming/online inference where full-sequence attention is impractical.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="LSTM & GRU — PyTorch Implementation" runnable />
    </div>
  );
}
