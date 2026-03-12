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
// Next-token prediction with sliding window
// ---------------------------------------------------------------------------
function NextTokenViz() {
  const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat', '.'];
  const [windowEnd, setWindowEnd] = useState(3);
  const contextLen = windowEnd;
  const target = tokens[windowEnd];

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Next-Token Prediction — Sliding Window
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        During causal LM pre-training, the model predicts each token given all preceding tokens.
        Slide the window to see each prediction target.
      </p>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target position:</label>
        <input type="range" min={1} max={tokens.length - 1} step={1} value={windowEnd}
          onChange={(e) => setWindowEnd(parseInt(e.target.value))}
          className="flex-1 accent-indigo-500" />
        <span className="font-mono text-sm text-indigo-600">t = {windowEnd}</span>
      </div>

      {/* Token display */}
      <div className="flex flex-wrap items-end gap-2 justify-center">
        {tokens.map((tok, i) => {
          const isContext = i < contextLen;
          const isTarget = i === windowEnd;
          const isFuture = i > windowEnd;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`rounded-lg px-3 py-2 text-sm font-bold border-2 transition-all ${
                isTarget
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-md'
                  : isContext
                    ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                    : isFuture
                      ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-50'
                      : ''
              }`}>
                {tok}
              </div>
              <div className="text-xs text-gray-400">{i}</div>
            </div>
          );
        })}
      </div>

      {/* Loss formula */}
      <div className="mt-4 rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-900/20">
        <p className="text-sm text-indigo-800 dark:text-indigo-300">
          <strong>Context:</strong> {tokens.slice(0, contextLen).map((t) => `"${t}"`).join(', ')}
        </p>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
          <strong>Target:</strong> "{target}" → loss = <InlineMath math={`-\\log p("\\text{${target}}" \\mid \\text{context})`} />
        </p>
      </div>

      <div className="mt-3 flex gap-4 text-xs justify-center">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-indigo-300" /> Context (input)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-emerald-300" /> Target (predicted)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-gray-200" /> Future (masked)
        </span>
      </div>
    </div>
  );
}

const PRETRAINING_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class CausalLMHead(nn.Module):
    """
    Language model head: maps hidden states to vocabulary logits.
    For causal LM pre-training with next-token prediction.
    """
    def __init__(self, d_model: int, vocab_size: int):
        super().__init__()
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)

    def forward(self, hidden_states):
        return self.lm_head(hidden_states)  # (B, T, vocab_size)

def causal_lm_loss(logits, labels, ignore_index=-100):
    """
    Causal LM cross-entropy loss.
    logits: (B, T, vocab_size)
    labels: (B, T) — input_ids shifted left by 1
    """
    # Shift: predict token t+1 from position t
    shift_logits = logits[:, :-1, :].contiguous()  # (B, T-1, V)
    shift_labels = labels[:, 1:].contiguous()       # (B, T-1)
    return F.cross_entropy(
        shift_logits.view(-1, shift_logits.size(-1)),
        shift_labels.view(-1),
        ignore_index=ignore_index,
    )

# Example: masked LM (BERT-style)
def masked_lm_loss(logits, labels, mask_token_id=103):
    """
    Masked LM: only compute loss on masked positions.
    labels: same as input_ids but with non-masked positions set to ignore_index=-100.
    """
    return F.cross_entropy(
        logits.view(-1, logits.size(-1)),
        labels.view(-1),
        ignore_index=-100,
    )

# Simulate causal LM training step
vocab_size, d_model, seq_len, batch = 32000, 512, 128, 4
lm_head = CausalLMHead(d_model, vocab_size)
hidden = torch.randn(batch, seq_len, d_model)
input_ids = torch.randint(0, vocab_size, (batch, seq_len))

logits = lm_head(hidden)
loss = causal_lm_loss(logits, input_ids)
perplexity = torch.exp(loss)
print(f"Loss: {loss.item():.4f}")
print(f"Perplexity: {perplexity.item():.2f}")
print(f"Logits shape: {logits.shape}")  # (4, 128, 32000)

# Prefix LM masking (T5/PaLM style): bidirectional on prefix, causal on target
def prefix_lm_mask(prefix_len: int, total_len: int) -> torch.Tensor:
    mask = torch.triu(torch.ones(total_len, total_len, dtype=torch.bool), diagonal=1)
    # Remove mask for prefix-to-prefix attention (allow bidirectional in prefix)
    mask[:prefix_len, :prefix_len] = False
    return mask  # True = masked`;

export default function PretrainingObjectives() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Pre-Training Objectives
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Causal LM, masked LM, prefix LM, and next-token prediction — the self-supervised objectives that enable large-scale pre-training.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Causal Language Modeling (CLM)"
        definition="Causal LM (used in GPT, Llama, Claude) trains a decoder-only model to predict each token from its predecessors. The training objective is the sum of cross-entropies over all positions: $\mathcal{L}_{\text{CLM}} = -\sum_{t=1}^{T} \log p_\theta(x_t \mid x_1, \ldots, x_{t-1})$. This is optimized by minimizing the negative log-likelihood on a large corpus. A single forward pass with causal masking computes all $T$ prediction losses in parallel."
        notation="Perplexity $\text{PPL} = \exp(\mathcal{L}_{\text{CLM}})$ is the standard evaluation metric for CLM. Lower is better: PPL=1 is perfect prediction."
      />

      <NextTokenViz />

      <DefinitionBlock
        label="Definition 1.2"
        title="Masked Language Modeling (MLM)"
        definition="MLM (BERT, RoBERTa) masks a random 15% of input tokens with a special [MASK] token and trains an encoder to predict the original tokens from bidirectional context. The loss is computed only on masked positions: $\mathcal{L}_{\text{MLM}} = -\sum_{t \in \mathcal{M}} \log p_\theta(x_t \mid x_{\setminus \mathcal{M}})$ where $\mathcal{M}$ is the set of masked positions. MLM gives richer per-token representations but cannot be used directly for autoregressive generation."
        notation="BERT uses a 80/10/10 masking strategy: 80% [MASK], 10% random token, 10% unchanged. This prevents the model from only learning to predict [MASK] tokens."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Prefix Language Modeling"
        definition="Prefix LM (T5, PaLM) uses a bidirectional encoder for a prefix and a causal decoder for the target. The mask matrix has a block structure: positions in the prefix can attend to each other bidirectionally, while target positions attend causally. Objective: $\mathcal{L}_{\text{prefix}} = -\sum_{t > k} \log p_\theta(x_t \mid x_1, \ldots, x_{t-1})$ where $k$ is the prefix length. This combines MLM's contextual prefix representation with CLM's generative capability."
        notation="Used in: T5 (span corruption variant), PaLM. The prefix-target split allows conditioning on structured inputs (e.g., questions) and generating structured outputs (answers)."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="CLM is Universal Density Estimation"
        statement="A causal LM trained on a corpus $\mathcal{D}$ of documents from distribution $p_{\text{data}}$ learns a model $p_\theta$ that, at optimality, satisfies $p_\theta(x_{1:T}) = p_{\text{data}}(x_{1:T})$ for all sequences. Minimizing CLM cross-entropy is equivalent to minimizing KL divergence from $p_\theta$ to $p_{\text{data}}$: $\text{KL}(p_{\text{data}} \| p_\theta) = H(p_{\text{data}}) + \mathcal{L}_{\text{CLM}}$."
        proof="$\text{KL}(p_{\text{data}} \| p_\theta) = \sum_x p_{\text{data}}(x) \log p_{\text{data}}(x)/p_\theta(x) = -H(p_{\text{data}}) - \mathbb{E}_{p_{\text{data}}}[\log p_\theta(x)] = -H(p_{\text{data}}) + \mathcal{L}_{\text{CLM}}$. Since $H(p_{\text{data}})$ is constant w.r.t. $\theta$, minimizing $\mathcal{L}_{\text{CLM}}$ is equivalent to minimizing $\text{KL}(p_{\text{data}} \| p_\theta)$. Minimum achieved at $p_\theta = p_{\text{data}}$ (since KL = 0 iff $p_\theta = p_{\text{data}}$). $\square$"
        corollaries={[
          "CLM pre-training implicitly learns all conditional distributions $p(x_t \\mid x_{<t})$ simultaneously — this is why few-shot prompting works.",
          "The chain rule $p(x_{1:T}) = \\prod_t p(x_t \\mid x_{<t})$ makes CLM an exact density model — no approximation is needed.",
        ]}
      />

      <ExampleBlock
        title="Computing Perplexity"
        difficulty="advanced"
        problem="A language model assigns probability $p(\\text{The}) = 0.05$, $p(\\text{cat}|\\text{The}) = 0.12$, $p(\\text{sat}|\\text{The cat}) = 0.08$ to the sequence 'The cat sat'. Compute the perplexity."
        solution={[
          { step: "Compute negative log-likelihood", formula: "\\mathcal{L} = -\\frac{1}{3}\\left(\\log 0.05 + \\log 0.12 + \\log 0.08\\right)", explanation: "Average over 3 tokens." },
          { step: "Evaluate", formula: "\\mathcal{L} = -\\frac{1}{3}(-2.996 - 2.120 - 2.526) = \\frac{7.642}{3} \\approx 2.547" },
          { step: "Perplexity", formula: "\\text{PPL} = e^{2.547} \\approx 12.77", explanation: "Perplexity ~12.8 means the model is roughly as uncertain as choosing uniformly among ~13 tokens at each position." },
        ]}
      />

      <WarningBlock title="Data Quality Dominates">
        <p className="text-sm">
          Pre-training data quality matters more than architecture for downstream performance. Common pitfalls: (1) <strong>deduplication</strong> — training data often contains near-duplicate web pages; training on duplicates wastes compute and can cause memorization. (2) <strong>data contamination</strong> — benchmark test sets (MMLU, HumanEval) appearing in pre-training data inflates reported performance. (3) <strong>tokenization affects perplexity</strong> — PPL is token-level, so a model with a larger vocabulary will report lower PPL on the same text even if sentence-level quality is identical.
        </p>
      </WarningBlock>

      <PythonCode code={PRETRAINING_CODE} title="Pre-Training Objectives — PyTorch" runnable />
    </div>
  );
}
