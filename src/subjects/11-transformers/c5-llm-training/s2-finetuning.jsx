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
// Training objective comparison diagram
// ---------------------------------------------------------------------------
const OBJECTIVES = [
  {
    id: 'sft',
    label: 'SFT',
    full: 'Supervised Fine-Tuning',
    color: '#6366f1',
    bg: '#e0e7ff',
    border: '#4f46e5',
    steps: ['Pre-trained LLM', 'Human-written demonstrations', 'Standard CLM loss on outputs', 'Chat-capable model'],
    desc: 'Train on (prompt, response) pairs from human annotators. Simple, fast, but limited by demonstration quality and quantity.',
  },
  {
    id: 'rlhf',
    label: 'RLHF',
    full: 'Reinforcement Learning from Human Feedback',
    color: '#10b981',
    bg: '#d1fae5',
    border: '#059669',
    steps: ['SFT model', 'Human preference pairs (A vs B)', 'Train reward model', 'PPO against reward model'],
    desc: 'Learns a reward model from human pairwise preferences, then optimizes policy with PPO. Enables superhuman preferences but complex.',
  },
  {
    id: 'dpo',
    label: 'DPO',
    full: 'Direct Preference Optimization',
    color: '#f59e0b',
    bg: '#fef3c7',
    border: '#d97706',
    steps: ['SFT model', 'Human preference pairs (y_w vs y_l)', 'Direct policy update', 'No RL loop needed'],
    desc: 'Directly optimizes the policy using preference data without training a separate reward model. Simpler and more stable than RLHF.',
  },
];

function ObjectiveComparison() {
  const [selected, setSelected] = useState('dpo');
  const obj = OBJECTIVES.find((o) => o.id === selected);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Fine-Tuning Objective Comparison
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Three paradigms for aligning LLMs with human preferences. Click to compare.
      </p>
      <div className="mb-5 flex gap-3 justify-center flex-wrap">
        {OBJECTIVES.map((o) => (
          <button key={o.id} onClick={() => setSelected(o.id)}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all border-2"
            style={{
              background: selected === o.id ? o.bg : '#f9fafb',
              borderColor: selected === o.id ? o.border : '#e5e7eb',
              color: selected === o.id ? o.color : '#6b7280',
            }}>
            {o.label}
          </button>
        ))}
      </div>
      {obj && (
        <div className="rounded-xl border-2 p-5" style={{ borderColor: obj.border, background: obj.bg + 'cc' }}>
          <h4 className="mb-3 text-base font-bold" style={{ color: obj.color }}>{obj.full}</h4>
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {obj.steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="rounded-lg px-3 py-1.5 text-xs font-medium border"
                  style={{ borderColor: obj.border + '80', background: '#fff8', color: obj.color }}>
                  {step}
                </div>
                {i < obj.steps.length - 1 && (
                  <span className="text-gray-400 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{obj.desc}</p>
        </div>
      )}
    </div>
  );
}

const FINETUNING_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ---------------------------------------------------------------------------
# LoRA: Low-Rank Adaptation
# ---------------------------------------------------------------------------
class LoRALinear(nn.Module):
    """
    Replace W with W + BA where B: (d_out, r), A: (r, d_in), rank r << min(d_in, d_out).
    Only A and B are trained; W is frozen.
    """
    def __init__(self, in_features: int, out_features: int, rank: int = 8, alpha: float = 16.0):
        super().__init__()
        self.rank = rank
        self.scaling = alpha / rank
        # Frozen base weight
        self.weight = nn.Parameter(torch.randn(out_features, in_features), requires_grad=False)
        # Trainable low-rank matrices
        self.lora_A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))

    def forward(self, x):
        base = F.linear(x, self.weight)
        lora = F.linear(F.linear(x, self.lora_A), self.lora_B) * self.scaling
        return base + lora

    @property
    def trainable_params(self):
        return self.rank * (self.weight.shape[0] + self.weight.shape[1])

    @property
    def total_params(self):
        return self.weight.numel() + self.trainable_params

# ---------------------------------------------------------------------------
# DPO Loss (Rafailov et al., 2023)
# ---------------------------------------------------------------------------

def dpo_loss(policy_logprob_w, policy_logprob_l,
             ref_logprob_w, ref_logprob_l, beta=0.1):
    """
    Direct Preference Optimization loss.
    policy_logprob_w: log p_theta(y_w | x) — winner response log-prob
    policy_logprob_l: log p_theta(y_l | x) — loser response log-prob
    ref_logprob_w/l:  log p_ref(y | x) — reference model log-probs
    beta: KL penalty coefficient (higher = closer to reference)
    """
    # Log likelihood ratio: policy vs reference
    log_ratio_w = policy_logprob_w - ref_logprob_w
    log_ratio_l = policy_logprob_l - ref_logprob_l
    # DPO objective: maximize margin of winner over loser, KL-regularized
    loss = -F.logsigmoid(beta * (log_ratio_w - log_ratio_l))
    return loss.mean()

# Example: LoRA parameter efficiency
d_model = 4096
lora_layer = LoRALinear(d_model, d_model, rank=8, alpha=16)
print(f"Full weight params:     {lora_layer.weight.numel():>10,}")
print(f"LoRA trainable params:  {lora_layer.trainable_params:>10,}")
print(f"Compression ratio:      {lora_layer.weight.numel() / lora_layer.trainable_params:.0f}x")

# DPO example
batch = 4
logprob_w = torch.randn(batch) * 0.5 - 1.0   # winner log-probs
logprob_l = torch.randn(batch) * 0.5 - 2.0   # loser log-probs (lower)
ref_w = logprob_w + torch.randn(batch) * 0.1  # reference (close to policy)
ref_l = logprob_l + torch.randn(batch) * 0.1
loss = dpo_loss(logprob_w, logprob_l, ref_w, ref_l, beta=0.1)
print(f"\\nDPO loss: {loss.item():.4f}")`;

export default function FineTuningRLHF() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Fine-Tuning & RLHF
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          SFT, RLHF, DPO, LoRA, and PEFT methods — the techniques that transform pre-trained models into instruction-following assistants.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Supervised Fine-Tuning (SFT)"
        definition="SFT adapts a pre-trained LLM on a curated dataset of (instruction, response) pairs using standard causal LM loss computed only on the response tokens: $\mathcal{L}_{\text{SFT}} = -\sum_{t \in \text{response}} \log p_\theta(x_t \mid x_{<t})$. The model is trained for 1–3 epochs on datasets like OpenAssistant, ShareGPT, or proprietary human demonstrations. SFT teaches the model the chat format and basic instruction following, but cannot easily instill complex human preferences (conciseness, harmlessness, helpfulness tradeoffs)."
        notation="SFT is sometimes called 'instruction tuning'. The loss is identical to pre-training CLM but applied only to the response portion of each example — the prompt tokens are masked out."
      />

      <ObjectiveComparison />

      <DefinitionBlock
        label="Definition 1.2"
        title="Direct Preference Optimization (DPO)"
        definition="DPO (Rafailov et al., 2023) optimizes the policy $\pi_\theta$ using preference pairs $(y_w, y_l)$ (winner/loser responses to the same prompt) without training a separate reward model. The DPO loss is: $\mathcal{L}_{\text{DPO}} = -\mathbb{E}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]$ where $\pi_{\text{ref}}$ is the SFT reference model and $\beta > 0$ controls deviation from reference."
        notation="DPO implicitly defines a reward: $r(x,y) = \beta \log (\pi_\theta(y|x) / \pi_{\text{ref}}(y|x)) + \beta \log Z(x)$ where $Z(x)$ is the partition function. No RL loop, reward model, or value function is needed."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="LoRA: Low-Rank Adaptation"
        definition="LoRA (Hu et al., 2021) fine-tunes a model by adding low-rank decomposition matrices to each weight: $W' = W + \Delta W = W + BA$ where $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times d}$ with $r \ll d$. Only $A$ and $B$ are trained; $W$ is frozen. The output is $h = Wx + BAx \cdot (\alpha/r)$ where $\alpha/r$ is a scaling factor. For $d=4096, r=8$: $A$ and $B$ together have $2 \times 4096 \times 8 = 65{,}536$ parameters vs $4096^2 = 16.7\text{M}$ in $W$ — a 256× compression."
        notation="LoRA is typically applied to Q and V projection matrices in attention. QLoRA extends this with 4-bit quantized base weights, enabling 65B parameter fine-tuning on a single 48GB GPU."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="DPO Equivalence to RLHF"
        statement="DPO optimizes the same objective as RLHF with a reward model $r^*$, namely $\max_\pi \mathbb{E}[r^*(x,y)] - \beta \text{KL}(\pi \| \pi_{\text{ref}})$, but in closed form without requiring explicit RL. The optimal policy under this objective is $\pi^*(y|x) = \pi_{\text{ref}}(y|x) \exp(r^*(x,y)/\beta) / Z(x)$. DPO reparameterizes this to express $r^*$ directly in terms of policy ratios, bypassing reward model training entirely."
        proof="The RLHF objective $\max_\pi \mathbb{E}_{x,y\sim\pi}[r(x,y)] - \beta\text{KL}(\pi\|\pi_{\text{ref}})$ has closed-form solution $\pi^*(y|x) \propto \pi_{\text{ref}}(y|x)\exp(r(x,y)/\beta)$. Inverting: $r(x,y) = \beta\log(\pi^*(y|x)/\pi_{\text{ref}}(y|x)) + \beta\log Z(x)$. Plugging into the Bradley-Terry preference model $p(y_w \succ y_l) = \sigma(r(y_w) - r(y_l))$ and noting $Z$ cancels: $p(y_w \succ y_l | x) = \sigma(\beta\log\frac{\pi^*(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta\log\frac{\pi^*(y_l|x)}{\pi_{\text{ref}}(y_l|x)})$. Maximizing log-likelihood of preferences gives the DPO loss. $\square$"
        corollaries={[
          "DPO avoids reward model training and the instability of PPO, making alignment considerably more accessible.",
          "However, DPO requires access to the reference model during training and can exhibit distribution shift issues for out-of-distribution prompts.",
        ]}
      />

      <ExampleBlock
        title="LoRA Parameter Count for LLaMA-7B"
        difficulty="advanced"
        problem="LLaMA-7B has 32 attention layers. Each layer has Q, K, V, O projection matrices of size $4096 \times 4096$. If we apply LoRA with rank $r=16$ to Q and V only, what fraction of parameters are trainable?"
        solution={[
          { step: "Total model parameters (approximate)", formula: "7 \\times 10^9 \\text{ parameters}", explanation: "7B model — most are in attention and FFN weight matrices." },
          { step: "LoRA parameters: Q and V per layer", formula: "2 \\times 2 \\times r \\times d = 2 \\times 2 \\times 16 \\times 4096 = 262{,}144 \\text{ per layer}", explanation: "2 matrices (Q, V), each with A (16×4096) and B (4096×16) = 2×16×4096 each." },
          { step: "Total LoRA parameters across all layers", formula: "32 \\times 262{,}144 = 8{,}388{,}608 \\approx 8.4\\text{M}", explanation: "Only 8.4M trainable parameters out of 7B total." },
          { step: "Fraction trainable", formula: "8.4\\text{M} / 7{,}000\\text{M} \\approx 0.12\\%", explanation: "LoRA trains only 0.12% of parameters, yet achieves competitive quality to full fine-tuning on many tasks." },
        ]}
      />

      <WarningBlock title="Alignment Tax and Reward Hacking">
        <ul className="space-y-2 text-sm">
          <li><strong>Alignment tax.</strong> RLHF/DPO can reduce performance on standard benchmarks while improving human preference ratings — the model may learn to sound helpful rather than be helpful. Monitor both preference scores and benchmark accuracy during alignment.</li>
          <li className="mt-2"><strong>Reward hacking.</strong> In RLHF, if the reward model is imperfect (all real reward models are), over-optimizing against it leads to reward hacking — generating responses that score high on the reward model but are actually harmful or low quality. KL penalty (controlled by $\beta$) limits this but does not eliminate it.</li>
          <li className="mt-2"><strong>DPO distributional shift.</strong> DPO is sensitive to the quality of preference pairs — if the chosen/rejected responses are very similar in quality, the gradient signal is noisy. Ensure clear preference gaps in training data.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={FINETUNING_CODE} title="LoRA and DPO Loss — PyTorch" runnable />
    </div>
  );
}
