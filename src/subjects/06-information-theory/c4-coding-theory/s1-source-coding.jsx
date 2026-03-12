import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

// Build Huffman tree from symbols and probabilities
function buildHuffman(symbols, probs) {
  const nodes = symbols.map((s, i) => ({ symbol: s, prob: probs[i], left: null, right: null, code: '' }))
  const heap = [...nodes]

  while (heap.length > 1) {
    heap.sort((a, b) => a.prob - b.prob)
    const left = heap.shift()
    const right = heap.shift()
    heap.push({ symbol: null, prob: left.prob + right.prob, left, right, code: '' })
  }

  const root = heap[0]
  const codes = {}

  function traverse(node, code) {
    if (!node) return
    if (node.symbol !== null) { codes[node.symbol] = code || '0'; return }
    traverse(node.left, code + '0')
    traverse(node.right, code + '1')
  }
  traverse(root, '')

  return { root, codes }
}

function renderTree(node, x, y, width, depth = 0, elements = []) {
  if (!node) return elements
  const radius = 14
  const vGap = 45

  if (node.left) {
    const lx = x - width / 4, ly = y + vGap
    elements.push({ type: 'line', x1: x, y1: y, x2: lx, y2: ly, label: '0' })
    renderTree(node.left, lx, ly, width / 2, depth + 1, elements)
  }
  if (node.right) {
    const rx = x + width / 4, ry = y + vGap
    elements.push({ type: 'line', x1: x, y1: y, x2: rx, y2: ry, label: '1' })
    renderTree(node.right, rx, ry, width / 2, depth + 1, elements)
  }
  elements.push({ type: 'circle', x, y, radius, label: node.symbol || '', prob: node.prob.toFixed(3) })
  return elements
}

const DEFAULT_SYMBOLS = ['A', 'B', 'C', 'D', 'E']
const DEFAULT_PROBS = [0.4, 0.25, 0.2, 0.1, 0.05]

function HuffmanViz() {
  const [probs, setProbs] = useState(DEFAULT_PROBS)
  const totalProb = probs.reduce((a, b) => a + b, 0)
  const normProbs = probs.map(p => p / totalProb)

  const { root, codes } = useMemo(() => buildHuffman(DEFAULT_SYMBOLS, normProbs), [normProbs])
  const elements = useMemo(() => renderTree(root, 200, 30, 320), [root])

  const avgLen = DEFAULT_SYMBOLS.reduce((s, sym, i) => s + normProbs[i] * (codes[sym] || '').length, 0)
  const entropy = -normProbs.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0)

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Huffman Tree Visualizer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Adjust symbol probabilities. The Huffman code assigns shorter codes to more frequent symbols.
      </p>
      <div className="mb-4 grid grid-cols-5 gap-2">
        {DEFAULT_SYMBOLS.map((sym, i) => (
          <div key={sym}>
            <label className="mb-1 block text-center text-xs font-medium text-gray-600 dark:text-gray-400">{sym}: {normProbs[i].toFixed(2)}</label>
            <input type="range" min="1" max="40" step="1" value={Math.round(probs[i] * 40)} onChange={e => {
              const newProbs = [...probs]
              newProbs[i] = +e.target.value / 40
              setProbs(newProbs)
            }} className="w-full accent-indigo-600" />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg bg-gray-50 dark:bg-gray-800">
        <svg viewBox="0 0 400 200" className="w-full" style={{ minWidth: 300 }}>
          {elements.filter(e => e.type === 'line').map((e, i) => (
            <g key={i}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#9ca3af" strokeWidth={1.5} />
              <text x={(e.x1 + e.x2) / 2 - 8} y={(e.y1 + e.y2) / 2} fontSize="10" fill="#6366f1" fontWeight="bold">{e.label}</text>
            </g>
          ))}
          {elements.filter(e => e.type === 'circle').map((e, i) => (
            <g key={i}>
              <circle cx={e.x} cy={e.y} r={e.radius} fill={e.label ? '#6366f1' : '#e5e7eb'} />
              <text x={e.x} y={e.y + 4} textAnchor="middle" fontSize="10" fill={e.label ? 'white' : '#374151'} fontWeight="bold">{e.label || e.prob}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-gray-200 dark:border-gray-700">{['Symbol', 'Prob', 'Code', 'Length'].map(h => <th key={h} className="py-1 text-center text-gray-500">{h}</th>)}</tr></thead>
          <tbody>
            {DEFAULT_SYMBOLS.map((sym, i) => (
              <tr key={sym} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1 text-center font-bold text-indigo-600">{sym}</td>
                <td className="py-1 text-center font-mono">{normProbs[i].toFixed(3)}</td>
                <td className="py-1 text-center font-mono text-emerald-600">{codes[sym] || ''}</td>
                <td className="py-1 text-center">{(codes[sym] || '').length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20"><div className="font-mono font-bold text-indigo-600">{entropy.toFixed(4)}</div><div className="text-gray-500">Entropy H(X) bits</div></div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20"><div className="font-mono font-bold text-emerald-600">{avgLen.toFixed(4)}</div><div className="text-gray-500">Avg code length bits</div></div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import heapq
from collections import Counter

def huffman_encode(text):
    """Build Huffman code for given text."""
    freq = Counter(text)
    heap = [[w, [sym, '']] for sym, w in freq.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]: pair[1] = '0' + pair[1]
        for pair in hi[1:]: pair[1] = '1' + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])

    codes = {sym: code for sym, code in sorted(heapq.heappop(heap)[1:], key=lambda x: (len(x[-1]), x))}
    return codes

text = "aabbbccccdddddeeeeeee"
codes = huffman_encode(text)
freq = Counter(text)
n = len(text)

print("Huffman Codes:")
for sym, code in sorted(codes.items()):
    p = freq[sym] / n
    print(f"  '{sym}': p={p:.3f}, code='{code}', length={len(code)}")

# Average code length
avg_len = sum(freq[s]/n * len(c) for s, c in codes.items())
# Entropy
import numpy as np
probs = np.array(list(freq.values())) / n
H = -np.sum(probs * np.log2(probs))
print(f"\\nEntropy: {H:.4f} bits")
print(f"Avg code length: {avg_len:.4f} bits")
print(f"Efficiency: {H/avg_len:.4f} (1 = perfect)")

# Encode and decode
encoded = ''.join(codes[c] for c in text)
print(f"\\nEncoded length: {len(encoded)} bits (vs {n*8} for ASCII)")
print(f"Compression ratio: {len(encoded)/(n*8):.3f}")

# Arithmetic coding (simplified range coder)
# Provides near-entropy compression for any source
from fractions import Fraction

def arithmetic_encode(symbols, probs_dict, message):
    lo, hi = Fraction(0), Fraction(1)
    for sym in message:
        p = Fraction(*probs_dict[sym])
        # Cumulative probability
        cum = Fraction(0)
        for s in symbols:
            pp = Fraction(*probs_dict[s])
            if s == sym:
                new_lo = lo + (hi - lo) * cum
                new_hi = lo + (hi - lo) * (cum + pp)
                lo, hi = new_lo, new_hi
                break
            cum += pp
    return (lo + hi) / 2

symbols = ['a', 'b', 'c']
probs = {'a': (1, 2), 'b': (1, 4), 'c': (1, 4)}  # as fractions
code = arithmetic_encode(symbols, probs, "abc")
print(f"\\nArithmetic code for 'abc': {float(code):.6f}")
`

export default function SourceCoding() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Compressing Information to Its Entropy">
        <p>
          Source coding answers: what is the minimum number of bits needed to represent
          messages from a source? Shannon's source coding theorem establishes the entropy
          as the fundamental limit, and Huffman/arithmetic coding achieve it in practice.
        </p>
      </NoteBlock>

      <HuffmanViz />

      <DefinitionBlock
        title="Uniquely Decodable and Prefix-Free Codes"
        definition="A code $C: \mathcal{X} \to \{0,1\}^*$ is uniquely decodable if no two sequences of symbols have the same encoding. It is prefix-free (instantaneous) if no codeword is a prefix of another. Prefix-free codes can be decoded without delay. By the Kraft inequality, a prefix-free code with lengths $l_1,\ldots,l_n$ exists iff $\sum_{i=1}^n 2^{-l_i} \leq 1$."
        notation="Optimal prefix-free codes achieve average length $L^* = \sum_i p_i l_i$ satisfying $H(X) \leq L^* < H(X) + 1$ bits (per symbol). Shannon code: $l_i = \lceil\log_2(1/p_i)\rceil$."
      />

      <DefinitionBlock
        title="Huffman Coding"
        definition="The Huffman algorithm (1952) greedily constructs an optimal prefix-free code by repeatedly merging the two least-probable symbols into a combined node: (1) Create leaf nodes for each symbol with probability as key. (2) Merge the two lowest-probability nodes repeatedly, creating internal nodes. (3) Assign 0/1 to left/right branches. The resulting code is optimal among prefix-free codes."
        notation="Huffman coding achieves $L^* < H(X) + 1$. For i.i.d. sequences of length $n$, block Huffman coding achieves $L^*/n < H(X) + 1/n \to H(X)$ as $n\to\infty$."
      />

      <TheoremBlock
        title="Shannon's Source Coding Theorem"
        statement="For an i.i.d. source with entropy $H(X)$ bits, the minimum expected number of bits per symbol achievable by any uniquely decodable code satisfies $L^* \geq H(X)$. Moreover, there exist codes (Huffman, arithmetic) achieving $L^* < H(X) + \epsilon$ for any $\epsilon > 0$ using sufficiently long blocks. Thus $H(X)$ is the fundamental lower bound on compression rate."
        proof="Lower bound: For any prefix-free code with lengths $l_i$, by the Kraft inequality $\sum_i 2^{-l_i} \leq 1$. The average length $L = \sum_i p_i l_i \geq \sum_i p_i \log_2(1/p_i) = H(X)$ by the information inequality (using log-sum inequality or non-negativity of KL). Upper bound: Shannon code $l_i = \lceil\log_2(1/p_i)\rceil$ achieves $L < H(X) + 1$. Block coding on $n$ symbols: $L_n/n < H(X) + 1/n$."
      />

      <ExampleBlock title="Arithmetic Coding: Approaching Entropy">
        <p>
          Arithmetic coding encodes an entire message as a single fraction in <InlineMath math="[0,1)" />.
          For i.i.d. source with probabilities <InlineMath math="\{p_i\}" />, the message{' '}
          <InlineMath math="x_1,\ldots,x_n" /> maps to an interval of width{' '}
          <InlineMath math="\prod_i p_{x_i}" />. The code uses <InlineMath math="-\log_2\prod_i p_{x_i} = \sum_i \log_2(1/p_{x_i})" />
          {' '}bits — exactly the information content. Unlike Huffman, arithmetic coding achieves
          per-symbol efficiency of <InlineMath math="H(X)" /> bits without blocking.
        </p>
      </ExampleBlock>

      <WarningBlock title="The Integer Constraint">
        <p>
          Huffman codes must use integer numbers of bits per symbol, creating inefficiency
          for sources with non-dyadic probabilities. A source with <InlineMath math="p(A) = 0.99" />,
          {' '}<InlineMath math="p(B) = 0.01" /> has entropy <InlineMath math="\approx 0.08" /> bits,
          but Huffman assigns 1 bit to each symbol (average 1 bit vs 0.08 bit entropy).
          Arithmetic coding avoids this by encoding sequences, not individual symbols.
          ANS (Asymmetric Numeral Systems) is the modern practical alternative used in
          zstd, LZ4, and video codecs.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
