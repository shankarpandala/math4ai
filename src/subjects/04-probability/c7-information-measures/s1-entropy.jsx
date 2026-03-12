import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

function EntropyViz() {
  const [p, setP] = useState(0.5);

  // Binary entropy H(p) = -p log p - (1-p) log(1-p)
  const H = (x) => {
    if (x <= 0 || x >= 1) return 0;
    return -x * Math.log2(x) - (1 - x) * Math.log2(1 - x);
  };

  const hp = H(p);
  const W = 340, H_px = 180;
  const nPts = 200;

  const curve = Array.from({ length: nPts }, (_, i) => {
    const x = 0.001 + (i / (nPts - 1)) * 0.998;
    return {
      sx: x * (W - 20) + 10,
      sy: H_px - 20 - H(x) * (H_px - 30),
    };
  });
  const curvePath = curve.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');

  const px = p * (W - 20) + 10;
  const py = H_px - 20 - hp * (H_px - 30);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Binary Entropy: <InlineMath math="H(p) = -p\log_2 p - (1-p)\log_2(1-p)" />
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        Maximum entropy at <InlineMath math="p=0.5" /> (maximum uncertainty). Zero at <InlineMath math="p=0" /> or <InlineMath math="p=1" /> (certainty).
      </p>
      <svg width={W} height={H_px} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={10} y1={H_px - 20} x2={W - 10} y2={H_px - 20} stroke="#9ca3af" strokeWidth={1} />
        <path d={curvePath} fill="rgba(99,102,241,0.1)" stroke="#6366f1" strokeWidth={2.5} />
        {/* current point */}
        <line x1={px} y1={H_px - 20} x2={px} y2={py} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,3" />
        <circle cx={px} cy={py} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
        <text x={px + 8} y={py - 6} fontSize={11} fill="#ef4444" fontWeight="600">
          H={hp.toFixed(3)}
        </text>
        <text x={10} y={H_px - 25} fontSize={9} fill="#6b7280">p=0</text>
        <text x={W - 25} y={H_px - 25} fontSize={9} fill="#6b7280">p=1</text>
        <text x={(W - 20) / 2} y={20} fontSize={9} fill="#6366f1">max H=1 bit at p=0.5</text>
      </svg>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="font-mono">p</span><span>{p.toFixed(3)}</span>
        </div>
        <input type="range" min="0.001" max="0.999" step="0.001" value={p}
          onChange={e => setP(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2">
          <p className="text-xs text-indigo-600">H(p) in bits</p>
          <p className="font-mono font-bold">{hp.toFixed(5)}</p>
        </div>
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 px-3 py-2">
          <p className="text-xs text-green-600">H(p) in nats</p>
          <p className="font-mono font-bold">{(hp * Math.log(2)).toFixed(5)}</p>
        </div>
      </div>
    </div>
  );
}

export default function EntropySection() {
  return (
    <div className="space-y-8">
      <EntropyViz />

      <DefinitionBlock
        label="Definition 7.1.1"
        title="Shannon Entropy"
        definition={
          "For a discrete distribution $P = (p_1, \\ldots, p_n)$, the Shannon entropy is " +
          "$H(P) = -\\sum_{i=1}^n p_i \\log p_i$ (using the convention $0 \\log 0 = 0$). " +
          "In bits: use $\\log_2$; in nats: use natural log. " +
          "For a continuous distribution with PDF $f$: differential entropy $h(f) = -\\int f(x)\\log f(x)\\,dx$. " +
          "Interpretation: $H(P)$ is the expected number of bits needed to encode one draw from $P$."
        }
        notation={
          "Maximum entropy: for $n$ outcomes, $H(P) \\leq \\log n$ with equality iff $P$ is uniform. " +
          "Entropy is non-negative for discrete distributions; differential entropy can be negative."
        }
      />

      <DefinitionBlock
        label="Definition 7.1.2"
        title="Cross-Entropy"
        definition={
          "The cross-entropy of distribution $Q$ relative to $P$ is " +
          "$H(P, Q) = -\\sum_x p(x) \\log q(x) = H(P) + D_{\\text{KL}}(P \\| Q)$. " +
          "In ML, the cross-entropy loss for a classifier with predicted probabilities $\\hat{y}$ and true label $y$ is " +
          "$\\mathcal{L} = -\\sum_c y_c \\log \\hat{y}_c$ (for one-hot $y$, this reduces to $-\\log \\hat{y}_\\text{true}$). " +
          "Minimizing cross-entropy is equivalent to maximum likelihood estimation."
        }
      />

      <TheoremBlock
        label="Theorem 7.1.1"
        title="Gibbs' Inequality (H ≤ log n)"
        statement={
          "For any distribution $P = (p_1, \\ldots, p_n)$: $H(P) \\leq \\log n$, " +
          "with equality iff $P$ is uniform ($p_i = 1/n$ for all $i$). " +
          "More generally: $H(P) \\leq H(Q) + D_{\\text{KL}}(P \\| Q)$ for any $Q$, " +
          "with $D_{\\text{KL}}(P \\| Q) \\geq 0$ (Gibbs' inequality)."
        }
        proof={
          "By convexity of $-\\log$: $D_{\\text{KL}}(P\\|Q) = \\sum_x p(x) \\log(p(x)/q(x)) \\geq 0$ " +
          "(by Jensen: $E_P[-\\log(q/p)] \\geq -\\log E_P[q/p] = -\\log 1 = 0$). " +
          "For the maximum entropy bound: apply $D_{\\text{KL}}(P\\|\\text{Uniform}) \\geq 0$."
        }
        corollaries={[
          "Data processing inequality: $I(X;Y) \\geq I(X;f(Y))$ — processing cannot increase information.",
          "Maximum entropy principle: among all distributions satisfying moment constraints, the one with maximum entropy is the most 'natural' (e.g., Gaussian for mean/variance constraints).",
        ]}
      />

      <ExampleBlock title="Cross-Entropy Loss in Neural Network Classification">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          For 3-class classification with true label <InlineMath math="y = [0,1,0]" /> (class 2):
        </p>
        <BlockMath math="\mathcal{L}(\hat{y}) = -\log \hat{y}_2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          If <InlineMath math="\hat{y} = \text{softmax}(z)" /> where <InlineMath math="z" /> are logits, then
          combining softmax + cross-entropy gives the log-sum-exp formula:{' '}
          <InlineMath math="\mathcal{L} = \log\sum_k e^{z_k} - z_{\text{true}}" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Differential Entropy Can Be Negative">
        <p>
          For a continuous distribution, differential entropy <InlineMath math="h(f)" /> can be negative
          (e.g., <InlineMath math="\text{Uniform}(0, 0.5)" /> has <InlineMath math="h = \log(0.5) = -1" /> nat).
          Unlike discrete entropy, differential entropy is not invariant to rescaling:
          <InlineMath math="h(aX) = h(X) + \log|a|" />. Also, differential entropy is not the
          limit of discrete entropy as bins get finer — there's a constant offset. In ML, always
          specify whether you mean discrete bits, nats, or differential entropy.
        </p>
      </WarningBlock>

      <PythonCode
        title="Entropy and Cross-Entropy in Python"
        code={`import numpy as np
from scipy import stats

# ── Shannon entropy ────────────────────────────────────────────────────────
def entropy(p, base=2):
    """Discrete entropy in given base."""
    p = np.array(p)
    p = p[p > 0]  # exclude zeros (0 log 0 = 0)
    return -np.sum(p * np.log(p)) / np.log(base)

# Binary entropy
for p in [0.0, 0.1, 0.5, 0.9, 1.0]:
    q = 1 - p
    h = entropy([p, q]) if p > 0 and q > 0 else 0
    print(f"H({p:.1f}, {q:.1f}) = {h:.4f} bits")

# Maximum entropy for n outcomes
for n in [2, 4, 8, 16]:
    uniform = np.ones(n) / n
    print(f"H(uniform, n={n}) = {entropy(uniform):.4f} bits = log2({n}) = {np.log2(n):.4f}")

# ── Cross-entropy loss ─────────────────────────────────────────────────────
def cross_entropy(y_true, y_pred, eps=1e-15):
    """Cross-entropy for classification."""
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.sum(y_true * np.log(y_pred))

# 3-class example
y_true = np.array([0, 1, 0])  # class 2
y_pred_good = np.array([0.05, 0.90, 0.05])
y_pred_bad  = np.array([0.33, 0.34, 0.33])

print(f"\\nCross-entropy losses:")
print(f"  Good prediction: {cross_entropy(y_true, y_pred_good):.4f}")
print(f"  Bad prediction:  {cross_entropy(y_true, y_pred_bad):.4f}")

# ── Differential entropy (Normal) ─────────────────────────────────────────
# Analytic: h(N(mu, sigma²)) = 0.5 * log(2*pi*e*sigma²)
for sigma in [0.5, 1.0, 2.0]:
    h_analytic = 0.5 * np.log(2 * np.pi * np.e * sigma**2)
    # Numeric via sampling
    X = np.random.normal(0, sigma, 100000)
    h_numeric = np.mean(-stats.norm(0, sigma).logpdf(X))
    print(f"  h(N(0,{sigma}²)): analytic={h_analytic:.4f}, numeric={h_numeric:.4f} nats")`}
      />
    </div>
  );
}
