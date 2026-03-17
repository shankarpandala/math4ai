import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

export default function BasicInequalities() {
  const [k, setK] = useState(2)
  const chebyshevBound = 1 / (k * k)
  return (
    <div className="space-y-6">
      <TheoremBlock title="Markov's Inequality" id="markov">
        <p>For non-negative <InlineMath math="X \geq 0" />:</p>
        <BlockMath math="P(X \geq a) \leq \frac{\mathbb{E}[X]}{a}" />
      </TheoremBlock>
      <TheoremBlock title="Chebyshev's Inequality" id="chebyshev">
        <BlockMath math="P(|X - \mu| \geq k\sigma) \leq \frac{1}{k^2}" />
      </TheoremBlock>
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
        <h3 className="font-bold mb-3">Chebyshev Bound Explorer</h3>
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm font-medium">k = {k}</label>
          <input type="range" min={1} max={6} step={0.5} value={k} onChange={e => setK(parseFloat(e.target.value))} className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Chebyshev bound</div>
            <div className="text-2xl font-bold text-indigo-600">{(chebyshevBound * 100).toFixed(1)}%</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Gaussian actual</div>
            <div className="text-2xl font-bold text-emerald-600">{k <= 1 ? '31.7%' : k <= 1.5 ? '13.4%' : k <= 2 ? '4.55%' : k <= 3 ? '0.27%' : '~0%'}</div>
          </div>
        </div>
      </div>
      <TheoremBlock title="Jensen's Inequality" id="jensen">
        <p>For convex <InlineMath math="\varphi" />:</p>
        <BlockMath math="\varphi(\mathbb{E}[X]) \leq \mathbb{E}[\varphi(X)]" />
        <p className="mt-2">Justifies the ELBO and KL non-negativity.</p>
      </TheoremBlock>
      <PythonCode title="Empirical Verification" code={`import numpy as np
np.random.seed(42)
N = 100_000
X = np.random.exponential(1.0, N)
print(f"Markov P(X>=3) <= {1/3:.4f}, actual={np.mean(X >= 3):.4f}")

Y = np.random.normal(0, 1, N)
for k in [1, 2, 3]:
    print(f"Chebyshev k={k}: bound={1/k**2:.4f}, actual={np.mean(np.abs(Y) >= k):.4f}")`} />
      <NoteBlock type="note" title="PAC Learning">
        <p>Concentration inequalities provide sample complexity bounds and generalization guarantees in ML.</p>
      </NoteBlock>
    </div>
  )
}
