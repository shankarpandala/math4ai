import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function CapacityViz() {
  const [snrDb, setSnrDb] = useState(10)

  const snrData = useMemo(() => {
    const pts = []
    for (let db = -5; db <= 30; db += 0.5) {
      const snr = Math.pow(10, db / 10)
      const capacity = Math.log2(1 + snr)   // bits/channel use (Shannon-Hartley)
      pts.push({ db, snr, capacity })
    }
    return pts
  }, [])

  const snr = Math.pow(10, snrDb / 10)
  const capacity = Math.log2(1 + snr)

  const W = 480, H = 200
  const padL = 40, padR = 16, padT = 16, padB = 32
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const maxC = Math.log2(1 + Math.pow(10, 3))
  const xToSvg = db => padL + ((db + 5) / 35) * plotW
  const yToSvg = c => padT + plotH - (c / maxC) * plotH

  const curvePath = snrData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.db).toFixed(1)},${yToSvg(d.capacity).toFixed(1)}`).join(' ')

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Shannon Capacity vs SNR (AWGN Channel)</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <InlineMath math="C = \log_2(1 + \mathrm{SNR})" /> bits/channel use (Shannon-Hartley theorem)
      </p>
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">SNR = {snrDb.toFixed(1)} dB = {snr.toFixed(1)} (linear)</label>
        <input type="range" min="-5" max="30" step="0.5" value={snrDb} onChange={e => setSnrDb(+e.target.value)} className="w-full accent-indigo-600" />
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[0, 5, 10, 15, 20, 25, 30].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">SNR (dB)</text>
          <text x={12} y={padT + plotH / 2} textAnchor="middle" fontSize="10" fill="#6b7280" transform={`rotate(-90, 12, ${padT + plotH / 2})`}>C (bits/use)</text>
          {[2, 4, 6, 8, 10].map(c => (
            <g key={c}>
              <line x1={padL - 4} y1={yToSvg(c)} x2={padL} y2={yToSvg(c)} stroke="#9ca3af" strokeWidth={1} />
              <text x={padL - 6} y={yToSvg(c) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{c}</text>
            </g>
          ))}
          <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
          <circle cx={xToSvg(snrDb)} cy={yToSvg(capacity)} r={5} fill="#ef4444" />
          <line x1={xToSvg(snrDb)} y1={padT} x2={xToSvg(snrDb)} y2={padT + plotH} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={xToSvg(snrDb) + 6} y={yToSvg(capacity) - 6} fontSize="10" fill="#ef4444" fontWeight="600">C={capacity.toFixed(2)}</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{snrDb.toFixed(1)} dB</div><div className="text-gray-500">SNR</div></div>
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20"><div className="font-mono font-bold text-red-600">{capacity.toFixed(4)}</div><div className="text-gray-500">Capacity (bits/use)</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{(capacity * 1).toFixed(4)}</div><div className="text-gray-500">~Max rate (b/s/Hz)</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np

# AWGN Channel Capacity (Shannon-Hartley)
def awgn_capacity_bits(snr_db, bandwidth_hz=1):
    """Shannon capacity in bits/s for AWGN channel."""
    snr_linear = 10 ** (snr_db / 10)
    return bandwidth_hz * np.log2(1 + snr_linear)

print("AWGN Channel Capacity:")
for snr_db in [-5, 0, 5, 10, 20, 30]:
    C = awgn_capacity_bits(snr_db)
    print(f"  SNR={snr_db:4d}dB: C = {C:.4f} bits/channel_use")

# Binary Symmetric Channel (BSC)
def bsc_capacity(p):
    """Capacity of BSC with crossover probability p."""
    if p == 0 or p == 1: return 1.0
    if p == 0.5: return 0.0
    h = -p * np.log2(p) - (1-p) * np.log2(1-p)  # Binary entropy
    return 1 - h

print("\\nBinary Symmetric Channel:")
for p in [0, 0.01, 0.1, 0.25, 0.5]:
    print(f"  p={p:.2f}: C = {bsc_capacity(p):.4f} bits/use")

# Binary Erasure Channel (BEC)
def bec_capacity(epsilon):
    """Capacity of BEC with erasure probability epsilon."""
    return 1 - epsilon

# Water-filling for parallel Gaussian channels
def water_filling(noise_powers, total_power):
    """Optimal power allocation for parallel Gaussian channels."""
    n = len(noise_powers)
    # Sort channels by noise power (ascending)
    order = np.argsort(noise_powers)
    sigma2 = noise_powers[order]

    for k in range(n, 0, -1):
        # Water level: mu = (P_total + sum(sigma2[:k])) / k
        mu = (total_power + sigma2[:k].sum()) / k
        if mu > sigma2[k-1]:
            break

    powers = np.maximum(mu - sigma2[:k], 0)
    # Fill remaining with zeros
    alloc = np.zeros(n)
    alloc[order[:k]] = powers
    return alloc, mu

noise = np.array([0.1, 0.5, 1.0, 2.0])
total_P = 4.0
alloc, level = water_filling(noise, total_P)
print(f"\\nWater-filling (P={total_P}, noise={noise}):")
print(f"  Water level μ = {level:.4f}")
print(f"  Power allocation: {alloc.round(4)}")
capacity = np.sum(np.log2(1 + alloc / noise))
print(f"  Total capacity: {capacity:.4f} bits/use")
`

export default function ChannelCapacity() {
  return (
    <div className="space-y-8">
      <NoteBlock title="The Fundamental Limit of Communication">
        <p>
          Channel capacity is the maximum rate at which information can be reliably transmitted
          over a noisy channel. Shannon's 1948 channel coding theorem proved that below capacity,
          arbitrarily reliable communication is possible; above capacity, it is not. This binary
          threshold is one of the most profound results in mathematics.
        </p>
      </NoteBlock>

      <CapacityViz />

      <DefinitionBlock
        title="Channel Capacity"
        definition="For a discrete memoryless channel with transition probabilities $p(y|x)$, the capacity is: $C = \max_{p(x)} I(X;Y) = \max_{p(x)} \sum_{x,y} p(x)p(y|x)\log\frac{p(y|x)}{p(y)}$. The maximum is over all input distributions $p(x)$. $C$ is measured in bits (log base 2) or nats (log base $e$) per channel use."
        notation="For the Additive White Gaussian Noise (AWGN) channel $Y = X + Z$ with $Z \sim \mathcal{N}(0, N)$ and power constraint $\mathbb{E}[X^2] \leq P$: $C = \frac{1}{2}\log_2\left(1 + \frac{P}{N}\right)$ bits/use."
      />

      <DefinitionBlock
        title="Binary Symmetric Channel"
        definition="A BSC with crossover probability $p$ flips each bit independently with probability $p$. Its capacity is $C_{\mathrm{BSC}} = 1 - H_b(p)$ bits/use where $H_b(p) = -p\log_2 p - (1-p)\log_2(1-p)$ is the binary entropy. The capacity is maximized at $p=0$ (or $p=1$): $C=1$ bit; at $p=0.5$: $C=0$ (completely noisy)."
        notation="The capacity-achieving input distribution is uniform: $p(X=0) = p(X=1) = 0.5$. This gives output entropy $H(Y) = 1$ bit, and $H(Y|X) = H_b(p)$, so $I(X;Y) = 1 - H_b(p)$."
      />

      <TheoremBlock
        title="Shannon's Channel Coding Theorem"
        statement="For any discrete memoryless channel with capacity $C$ and any rate $R < C$, there exists a sequence of codes with block length $n$ and $2^{nR}$ codewords such that the maximum probability of decoding error $P_e^{(n)} \to 0$ as $n \to \infty$. Conversely, for any rate $R > C$ and any sequence of codes, $P_e^{(n)} \geq \delta > 0$ for some $\delta$ depending on $R - C$."
        proof="Achievability (sketch): Use random coding. Generate $2^{nR}$ codewords i.i.d. from the capacity-achieving distribution $p^*(x)$. To decode, use joint typicality decoding: declare $m$ sent if $(x^n(m), y^n)$ are jointly typical. By AEP, if the correct message was sent, joint typicality holds w.h.p. The probability that any other codeword $x^n(m')$ is also jointly typical with $y^n$ is $\approx 2^{-nI(X;Y)}$. By union bound over $2^{nR}$ messages: $P_e \leq 2^{n(R-I(X;Y))} \to 0$ since $R < C \leq I(X;Y)$."
      />

      <ExampleBlock title="Water-Filling: Optimal Power Allocation">
        <p>
          For parallel Gaussian channels (e.g., OFDM subcarriers) with noise powers{' '}
          <InlineMath math="\sigma_k^2" /> and total power <InlineMath math="P" />, the optimal
          power allocation is water-filling: allocate <InlineMath math="P_k = (\mu - \sigma_k^2)_+" /> where
          the water level <InlineMath math="\mu" /> is chosen so <InlineMath math="\sum_k P_k = P" />.
          Better channels (lower noise) get more power; very noisy channels get zero. Total capacity:
          <InlineMath math="C = \sum_k \frac{1}{2}\log_2(1 + P_k/\sigma_k^2)" />.
        </p>
      </ExampleBlock>

      <WarningBlock title="Capacity is Asymptotic">
        <p>
          Channel capacity is achievable only with infinitely long codes. Real systems use
          finite block lengths (LDPC, turbo codes, polar codes) and operate at rates below
          capacity. The gap between practical rates and capacity is characterized by the
          channel dispersion (finite blocklength theory). Also, capacity assumes perfect
          channel knowledge at the receiver — in practice, channel estimation overhead
          reduces effective throughput.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
