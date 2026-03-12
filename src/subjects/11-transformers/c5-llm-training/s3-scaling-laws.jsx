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
// Chinchilla compute-optimal tokens vs model size plot
// ---------------------------------------------------------------------------
function ScalingLawPlot() {
  const [budget, setBudget] = useState(21); // log10(FLOPs)

  const C = Math.pow(10, budget);
  // Chinchilla: N_opt = (C / 6D_opt)^0.5 — but here: N_opt = (C/6)^0.5, D_opt = C/(6*N_opt)
  // From Hoffmann et al.: N_opt ≈ (C / (6 * 20))^0.5 simplified
  // Actually: C = 6 * N * D => for N_opt: dL/dN = 0 gives N_opt ≈ sqrt(C/6) if a=b
  // Simplified: N_opt = (C/(6*20))^0.5, D_opt = 20 * N_opt
  const N_opt = Math.sqrt(C / 120);
  const D_opt = C / (6 * N_opt);

  // Plot: for a given compute C, show loss vs N along the compute-optimal frontier
  const modelSizes = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const logN = 7 + i * 0.2; // log10 of parameter count
      const N = Math.pow(10, logN);
      const D = C / (6 * N); // tokens given the compute budget
      if (D < 1e6) return null; // not enough tokens
      // Simplified Chinchilla loss: L(N,D) = A/N^0.5 + B/D^0.5 + E
      const A = 406.4, B = 410.7, E = 1.69;
      const loss = A / Math.pow(N, 0.34) + B / Math.pow(D, 0.28) + E;
      return { N, D, loss, logN };
    }).filter(Boolean);
  }, [budget]);

  const validSizes = modelSizes.filter((d) => d.loss < 10);
  const minLoss = Math.min(...validSizes.map((d) => d.loss));
  const maxLoss = Math.min(Math.max(...validSizes.map((d) => d.loss)), minLoss + 1.5);

  const W = 460, H = 200;
  const padL = 55, padR = 15, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  function xPos(logN) {
    const minLogN = validSizes[0]?.logN || 7;
    const maxLogN = validSizes[validSizes.length - 1]?.logN || 12;
    return padL + ((logN - minLogN) / (maxLogN - minLogN)) * plotW;
  }
  function yPos(loss) {
    return padT + plotH * (1 - (loss - minLoss) / (maxLoss - minLoss));
  }

  const pts = validSizes.map(({ logN, loss }) => `${xPos(logN)},${yPos(loss)}`).join(' ');
  const optLogN = Math.log10(N_opt);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Chinchilla: Loss vs Model Size (Fixed Compute Budget)
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Given a fixed compute budget <InlineMath math="C" />, there is an optimal model size
        <InlineMath math="N_{\text{opt}}" />. Too small = underfitting; too large = insufficient data.
      </p>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          log₁₀(C) = {budget} ({budget < 20 ? '~' : ''}10^{budget} FLOPs)
        </label>
        <input type="range" min={18} max={24} step={0.5} value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))}
          className="flex-1 accent-indigo-500" />
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="mx-auto block">
          {[0, 0.5, 1, 1.5].map((dLoss) => {
            const y = yPos(minLoss + dLoss);
            if (y < padT || y > padT + plotH) return null;
            return (
              <g key={dLoss}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                <text x={padL - 5} y={y + 4} textAnchor="end" fontSize={9} className="fill-gray-500">
                  {(minLoss + dLoss).toFixed(2)}
                </text>
              </g>
            );
          })}
          <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1} />

          {validSizes.length > 1 && (
            <polyline points={pts} fill="none" stroke="#6366f1" strokeWidth={2.5} />
          )}

          {/* Optimal point */}
          {validSizes.length > 0 && N_opt > 0 && (
            <>
              <line x1={xPos(optLogN)} x2={xPos(optLogN)} y1={padT} y2={padT + plotH}
                stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5,3" />
              <circle cx={xPos(optLogN)} cy={yPos(minLoss)} r={5} fill="#ef4444" />
              <text x={xPos(optLogN) + 5} y={padT + 14} fontSize={9} fill="#ef4444">
                N_opt≈{N_opt.toExponential(1)}
              </text>
            </>
          )}

          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} className="fill-gray-500">
            log₁₀(N) — Model Size (parameters)
          </text>
          <text x={8} y={padT + plotH / 2} textAnchor="middle" fontSize={10}
            transform={`rotate(-90,8,${padT + plotH / 2})`} className="fill-gray-500">Loss</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-900/20">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">Optimal model size:</span>
          <span className="ml-2 font-mono text-indigo-600">{N_opt.toExponential(2)} params</span>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">Optimal tokens:</span>
          <span className="ml-2 font-mono text-emerald-600">{D_opt.toExponential(2)}</span>
        </div>
      </div>
    </div>
  );
}

const SCALING_CODE = `import numpy as np

# ---------------------------------------------------------------------------
# Chinchilla scaling law: L(N, D) = A/N^alpha + B/D^beta + E
# Hoffmann et al. (2022) fitted constants
# ---------------------------------------------------------------------------
A, ALPHA = 406.4, 0.34   # model size term
B, BETA  = 410.7, 0.28   # data size term
E        = 1.69           # irreducible loss

def chinchilla_loss(N: float, D: float) -> float:
    """Predict loss given model size N (params) and dataset size D (tokens)."""
    return A / N**ALPHA + B / D**BETA + E

def compute_optimal_allocation(C: float, verbose: bool = True):
    """
    Given compute budget C (FLOPs), find optimal N and D.
    Assumes: C ≈ 6 * N * D (standard FLOPs approximation for Transformer)
    Optimality: minimize L(N, C/(6N)) w.r.t. N
    """
    # Grid search for optimal N
    log_N = np.linspace(6, 14, 1000)
    N_vals = 10 ** log_N
    D_vals = C / (6 * N_vals)
    valid = D_vals > 1e6   # need at least 1M tokens
    loss_vals = np.where(valid, chinchilla_loss(N_vals, D_vals), np.inf)
    idx = np.argmin(loss_vals)
    N_opt, D_opt = N_vals[idx], D_vals[idx]
    ratio = D_opt / N_opt
    if verbose:
        print(f"Compute: {C:.2e} FLOPs")
        print(f"Optimal N: {N_opt:.2e} parameters")
        print(f"Optimal D: {D_opt:.2e} tokens")
        print(f"D/N ratio: {ratio:.1f}  (Chinchilla: ~20)")
        print(f"Predicted loss: {chinchilla_loss(N_opt, D_opt):.4f}")
    return N_opt, D_opt

# Historical comparison (from Hoffmann et al. 2022 Table 3)
models = {
    'Gopher 280B': {'N': 280e9, 'D': 300e9, 'C': 6 * 280e9 * 300e9},
    'GPT-3 175B':  {'N': 175e9, 'D': 300e9, 'C': 6 * 175e9 * 300e9},
    'Chinchilla':  {'N':  70e9, 'D': 1.4e12, 'C': 6 * 70e9 * 1.4e12},
}

print("=== Historical Model Analysis ===")
for name, m in models.items():
    loss = chinchilla_loss(m['N'], m['D'])
    print(f"\\n{name}: N={m['N']:.0e}, D={m['D']:.0e}")
    print(f"  D/N ratio: {m['D']/m['N']:.1f}, Loss: {loss:.4f}")

print("\\n=== Compute-Optimal Allocation ===")
# GPT-3 compute budget: ~3.14e23 FLOPs
compute_optimal_allocation(6 * 175e9 * 300e9)`;

export default function ScalingLaws() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Scaling Laws
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Chinchilla laws, compute-optimal training, and how Hoffmann et al. showed that most large language models were undertrained.
        </p>
      </div>

      <DefinitionBlock
        label="Definition 1.1"
        title="Neural Scaling Laws"
        definition="Scaling laws describe how model loss $L$ depends on model size $N$ (parameters), training data $D$ (tokens), and compute $C$ (FLOPs) as power laws: $L(N, D) = A/N^\alpha + B/D^\beta + E$ where $E$ is the irreducible loss (entropy of data). Kaplan et al. (2020) first characterized this empirically for language models. Hoffmann et al. (2022) — the Chinchilla paper — showed that larger models must be paired with proportionally more data: the D/N ratio should be ~20, not ~1 as Kaplan suggested."
        notation="$C \approx 6ND$ is the standard FLOPs estimate for a Transformer (6 multiply-adds per parameter per token, accounting for forward and backward). Hoffmann constants: $A=406.4$, $\alpha=0.34$, $B=410.7$, $\beta=0.28$, $E=1.69$."
      />

      <ScalingLawPlot />

      <DefinitionBlock
        label="Definition 1.2"
        title="Compute-Optimal Training"
        definition="For a fixed compute budget $C \approx 6ND$, the loss-minimizing allocation of model size $N$ and training tokens $D$ is: $N_{\text{opt}} \propto C^{0.5}$ and $D_{\text{opt}} \propto C^{0.5}$. This means $D_{\text{opt}} / N_{\text{opt}} \approx 20$ (train each parameter on ~20 tokens). Models trained with $D < 20N$ are compute-suboptimal — they would achieve lower loss if parameters were reduced and tokens increased, holding $C$ fixed."
        notation="The Chinchilla model (70B parameters, 1.4T tokens) matches or outperforms Gopher (280B, 300B tokens) at 4× smaller size and same compute budget — demonstrating that large models are often undertrained."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Optimal Compute Allocation"
        statement="Under the Chinchilla loss model $L(N,D) = A N^{-\alpha} + B D^{-\beta} + E$ with constraint $C = 6ND$, the compute-optimal model size satisfies $N^* \propto C^{b/(a+b)}$ and $D^* \propto C^{a/(a+b)}$ where $a = \alpha$ and $b = \beta$. For Chinchilla constants ($\alpha=0.34$, $\beta=0.28$): $N^* \propto C^{0.45}$ and $D^* \propto C^{0.55}$."
        proof="Substitute $D = C/(6N)$ into $L(N,D)$: $L(N) = A N^{-\alpha} + B(6N/C)^\beta + E$. Taking $dL/dN = 0$: $-\alpha A N^{-\alpha-1} + \beta B (6/C)^\beta N^{\beta-1} = 0$. Solving: $N^{\alpha+\beta} = \alpha A / (\beta B) \cdot (C/6)^\beta$, giving $N^* \propto C^{\beta/(\alpha+\beta)}$. With $\alpha=0.34$, $\beta=0.28$: exponent $= 0.28/0.62 \approx 0.45$. By symmetry $D^* \propto C^{\alpha/(\alpha+\beta)} \approx C^{0.55}$. $\square$"
        corollaries={[
          "As compute increases, both model size and data scale as $C^{\\approx 0.5}$ — roughly doubling model size requires doubling tokens for the same loss.",
          "The frontier models GPT-4, Claude 3, Llama 3.1 are believed to train for significantly longer than Chinchilla-optimal (inference efficiency is also a goal).",
        ]}
      />

      <ExampleBlock
        title="Was GPT-3 Compute-Optimal?"
        difficulty="research"
        problem="GPT-3 (Brown et al., 2020) has $N = 175\text{B}$ parameters trained on $D = 300\text{B}$ tokens. Using Chinchilla analysis, what would be the compute-optimal allocation for the same compute budget $C = 6 \times 175\text{B} \times 300\text{B}$?"
        solution={[
          { step: "Compute budget", formula: "C = 6 \\times 175 \\times 10^9 \\times 300 \\times 10^9 \\approx 3.15 \\times 10^{23} \\text{ FLOPs}" },
          { step: "GPT-3 D/N ratio", formula: "D/N = 300\\text{B} / 175\\text{B} \\approx 1.7", explanation: "Far below the Chinchilla-optimal ratio of ~20." },
          { step: "Chinchilla-optimal allocation at same compute", explanation: "Solving $N^* = \\sqrt{C/120}$ and $D^* = 20N^*$: $N^* \\approx 51\\text{B}$ parameters, $D^* \\approx 1\\text{T}$ tokens." },
          { step: "Conclusion", explanation: "GPT-3 used 3.4× too many parameters relative to compute-optimal. A ~50B model trained on 1T tokens would have achieved lower perplexity at the same compute — this is exactly what Chinchilla (70B, 1.4T) demonstrated." },
        ]}
      />

      <WarningBlock title="Scaling Laws Have Limits">
        <ul className="space-y-2 text-sm">
          <li><strong>Emergent capabilities don't follow smooth scaling.</strong> Many capabilities (e.g., arithmetic, chain-of-thought, in-context learning) appear abruptly at specific model sizes — these "emergent abilities" are not predicted by smooth loss curves. Whether emergence is fundamental or an artifact of evaluation metrics is debated.</li>
          <li className="mt-2"><strong>Inference cost matters in practice.</strong> Chinchilla-optimal models minimize loss at fixed training compute, but larger models with fewer training steps have lower inference cost per token. LLaMA-3 70B (trained on 15T tokens — well beyond Chinchilla-optimal) is deployed at scale because inference efficiency matters more than training optimality.</li>
          <li className="mt-2"><strong>Data quality changes the constants.</strong> Scaling laws are empirically fit on specific datasets. Higher-quality data (synthetic reasoning data, textbook-quality text) shifts the constants — smaller models trained on high-quality data can outperform larger models on low-quality data.</li>
        </ul>
      </WarningBlock>

      <PythonCode code={SCALING_CODE} title="Chinchilla Scaling Laws — Analysis" runnable />
    </div>
  );
}
