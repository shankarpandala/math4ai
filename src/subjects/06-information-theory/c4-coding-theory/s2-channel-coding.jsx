import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function qFunction(x) {
  // Q(x) = P(Z > x) for Z ~ N(0,1)
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  const pdf = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
  const cdf = 1 - pdf * poly
  return x >= 0 ? 1 - cdf : cdf
}

function BERViz() {
  const [codingType, setCodingType] = useState('uncoded')

  const snrData = useMemo(() => {
    const pts = []
    for (let snrDb = -2; snrDb <= 15; snrDb += 0.25) {
      const snr = Math.pow(10, snrDb / 10)
      const snrLinear = snr

      // BPSK uncoded: BER = Q(sqrt(2*Eb/N0))
      const ber_uncoded = qFunction(Math.sqrt(2 * snrLinear))

      // Repetition code (rate 1/3, needs 3x more Eb/N0 per bit, gain from combining)
      const ber_rep3 = qFunction(Math.sqrt(2 * snrLinear / 3)) ** 3 * 3 + 3 * qFunction(Math.sqrt(2 * snrLinear / 3)) ** 2 * (1 - qFunction(Math.sqrt(2 * snrLinear / 3)))
      // MRC combining gain: effectively SNR * 3 for repetition code
      const p_bit_rep = qFunction(Math.sqrt(2 * snrLinear))
      const ber_rep = 3 * p_bit_rep ** 2 * (1 - p_bit_rep) + p_bit_rep ** 3

      // Hamming(7,4) code: rate 4/7, can correct 1 error in 7 bits
      const p7 = qFunction(Math.sqrt(2 * snrLinear * 4 / 7))
      const ber_hamming = 1 - (1 - p7) ** 7 - 7 * p7 * (1 - p7) ** 6

      pts.push({ db: snrDb, uncoded: ber_uncoded, rep: ber_rep, hamming: ber_hamming })
    }
    return pts
  }, [])

  const W = 480, H = 220
  const padL = 44, padR = 16, padT = 16, padB = 36
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xToSvg = db => padL + ((db + 2) / 17) * plotW
  // Log scale for BER: from 10^-6 to 1
  const yToSvg = ber => {
    const logBer = Math.log10(Math.max(ber, 1e-7))
    return padT + ((logBer + 7) / (-0 + 7)) * plotH
  }

  const makePath = key => snrData.filter(d => d[key] > 1e-7).map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.db).toFixed(1)},${yToSvg(d[key]).toFixed(1)}`).join(' ')

  const curves = [
    { key: 'uncoded', color: '#ef4444', label: 'Uncoded BPSK' },
    { key: 'rep', color: '#f97316', label: 'Repetition (1/3)' },
    { key: 'hamming', color: '#10b981', label: 'Hamming(7,4)' },
  ]

  const active = snrData.find(d => Math.abs(d.db - 8) < 0.3) || snrData[snrData.length - 1]

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">BER vs SNR: Coding Gain Comparison</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Log-scale BER curves. Coding gain = SNR shift to achieve the same BER with vs without coding.
      </p>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
          {/* Grid */}
          {[-1, -2, -3, -4, -5, -6].map(exp => (
            <g key={exp}>
              <line x1={padL} y1={yToSvg(Math.pow(10, exp))} x2={W - padR} y2={yToSvg(Math.pow(10, exp))} stroke="#374151" strokeOpacity={0.15} strokeDasharray="3 3" />
              <text x={padL - 4} y={yToSvg(Math.pow(10, exp)) + 3} textAnchor="end" fontSize="8" fill="#9ca3af">10^{exp}</text>
            </g>
          ))}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          {[0, 3, 6, 9, 12, 15].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT + plotH} x2={xToSvg(v)} y2={padT + plotH + 4} stroke="#9ca3af" strokeWidth={1} />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">Eb/N0 (dB)</text>
          <text x={10} y={padT + plotH / 2} textAnchor="middle" fontSize="9" fill="#6b7280" transform={`rotate(-90, 10, ${padT + plotH / 2})`}>BER</text>
          {curves.map(({ key, color }) => (
            <path key={key} d={makePath(key)} fill="none" stroke={color} strokeWidth={2} />
          ))}
          {curves.map(({ key, color, label }, ci) => (
            <text key={key} x={W - padR - 4} y={padT + 14 + ci * 14} textAnchor="end" fontSize="9" fill={color}>{label}</text>
          ))}
        </svg>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy.special import erfc

# BER for BPSK over AWGN
def ber_bpsk(snr_db):
    snr = 10**(snr_db/10)
    return 0.5 * erfc(np.sqrt(snr))

# Hamming(7,4) code: [7,4,3] code
# Generator matrix for systematic Hamming(7,4)
G = np.array([
    [1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
], dtype=int)

# Parity check matrix
H_check = np.array([
    [1, 1, 0, 1, 1, 0, 0],
    [1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 1],
], dtype=int)

# Encode message
def encode_hamming(msg):
    return (msg @ G) % 2

# Syndrome decoding
def decode_hamming(received):
    syndrome = (received @ H_check.T) % 2
    # Convert syndrome to error position
    error_pos = 0
    for i, bit in enumerate(syndrome):
        error_pos += bit * (2**i)
    corrected = received.copy()
    if error_pos > 0:
        corrected[error_pos - 1] ^= 1
    return corrected[:4]  # Return information bits

# Simulate BER
np.random.seed(42)
n_trials = 100000
print("Hamming(7,4) BER Simulation:")
for snr_db in [0, 2, 4, 6, 8]:
    p_bit = ber_bpsk(snr_db * 4/7)  # Effective SNR per coded bit
    errors = 0
    for _ in range(n_trials // 7):
        msg = np.random.randint(0, 2, 4)
        codeword = encode_hamming(msg)
        # Random errors
        flip = np.random.random(7) < p_bit
        received = (codeword + flip.astype(int)) % 2
        decoded = decode_hamming(received)
        errors += np.sum(decoded != msg)
    ber = errors / (n_trials // 7 * 4)
    ber_uncoded = ber_bpsk(snr_db)
    print(f"  Eb/N0={snr_db}dB: BER_coded={ber:.2e}, BER_uncoded={ber_uncoded:.2e}")

# Modern codes: LDPC simulation via belief propagation (sketch)
print("\\nModern codes approach Shannon capacity within 0.1 dB (LDPC, Polar codes)")
print("Shannon capacity at 1 dB Eb/N0:", np.log2(1 + 10**(1/10)), "bits/use")
`

export default function ChannelCoding() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Error-Correcting Codes: Reliability at a Cost">
        <p>
          Channel coding adds controlled redundancy to transmitted messages, enabling error
          correction at the receiver. Shannon's channel coding theorem promises reliable
          communication at any rate below capacity — but finding good codes that achieve
          this took decades of research, culminating in turbo codes (1993) and LDPC
          rediscovery, now used in 5G and Wi-Fi.
        </p>
      </NoteBlock>

      <BERViz />

      <DefinitionBlock
        title="Linear Block Codes"
        definition="A linear $[n, k, d]$ code over $\mathbb{F}_2$ is a $k$-dimensional subspace of $\mathbb{F}_2^n$ with minimum Hamming distance $d$ between codewords. It can correct up to $t = \lfloor(d-1)/2\rfloor$ errors. The code is specified by a generator matrix $G \in \mathbb{F}_2^{k\times n}$ (encoding: $\mathbf{c} = \mathbf{m}G$) or parity check matrix $H$ (syndrome check: $H\mathbf{c}^T = \mathbf{0}$). Examples: Hamming$[7,4,3]$, Reed-Solomon, LDPC."
        notation="Code rate: $R = k/n$ bits/coded bit. Information bits $k$, coded bits $n$, redundancy $n-k$ parity bits. Singleton bound: $d \leq n - k + 1$ (MDS codes achieve equality)."
      />

      <DefinitionBlock
        title="LDPC Codes and Belief Propagation"
        definition="Low-Density Parity Check (LDPC) codes (Gallager 1963, rediscovered 1995) have sparse parity check matrices $H$ with density $O(1/n)$. They are decoded iteratively via Belief Propagation (sum-product algorithm) on the Tanner graph: variable nodes exchange soft probability messages with check nodes until convergence. LDPC codes approach Shannon capacity within 0.0045 dB at block length $10^6$."
        notation="The Tanner graph is bipartite: variable nodes (codeword bits) connected to check nodes (parity equations). Message passing computes marginal posterior probabilities for each bit."
      />

      <TheoremBlock
        title="Coding Gain and Channel Capacity"
        statement="For a code with rate $R = k/n$ over an AWGN channel with Eb/N0 $= \gamma$, the effective SNR per coded bit is $\gamma_c = R\gamma$. A code provides a coding gain over uncoded BPSK if its BER curve, plotted against Eb/N0, shifts left (requires less power for the same BER). The maximum achievable rate is the Shannon capacity $C = \frac{1}{2}\log_2(1 + 2R\gamma)$, achievable only by ideal codes with $n\to\infty$."
        proof="For an ideal (capacity-achieving) code at rate $R$: reliable communication requires $R \leq C = \frac{1}{2}\log_2(1 + 2R\gamma)$. Setting $R = C$ and solving for the minimum required $\gamma$: $2^{2R} - 1 = 2R\gamma \Rightarrow \gamma_{\min} = (2^{2R}-1)/(2R)$. As $R\to 0$: $\gamma_{\min} \to \ln 2 \approx -1.59$ dB (the Shannon limit). This is the minimum Eb/N0 for any rate, achieved in the limit of very low spectral efficiency."
      />

      <ExampleBlock title="Polar Codes: First Capacity-Achieving Codes">
        <p>
          Polar codes (Arıkan 2009) are the first family of codes that provably achieve the
          capacity of binary-input symmetric channels with explicit construction and efficient
          encoding/decoding (successive cancellation, <InlineMath math="O(n\log n)" />).
          They exploit the phenomenon of channel polarization: after <InlineMath math="\log_2 n" />
          stages of combining, synthetic channels become either perfect or completely noisy.
          Information bits are sent over the good channels; the rest carry known "frozen" bits.
          Polar codes are now used in 5G NR for control channel coding.
        </p>
      </ExampleBlock>

      <WarningBlock title="Capacity is for Memoryless Channels">
        <p>
          Shannon capacity assumes i.i.d. noise (memoryless channel). Real channels have memory:
          fading, burst errors, frequency-selective interference. Codes designed for AWGN perform
          poorly over fading channels without interleaving. LDPC/turbo codes require long
          interleavers to randomize burst errors. For fading channels, the ergodic capacity
          averages over fading states, while outage capacity handles cases when the instantaneous
          channel is below the required rate.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
