import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

export default function ImproperIntegrals() {
  const [type, setType] = useState('infinite')
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {['infinite', 'discontinuous'].map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
            {t === 'infinite' ? 'Infinite Limits' : 'Discontinuous Integrands'}
          </button>
        ))}
      </div>
      {type === 'infinite' ? (
        <DefinitionBlock title="Type I: Infinite Limits">
          <BlockMath math="\int_a^{\infty} f(x)\,dx = \lim_{t \to \infty} \int_a^t f(x)\,dx" />
          <p className="mt-2">Converges if the limit exists and is finite.</p>
        </DefinitionBlock>
      ) : (
        <DefinitionBlock title="Type II: Discontinuous Integrand">
          <BlockMath math="\int_a^b f(x)\,dx = \lim_{\epsilon \to 0^+} \int_a^{c-\epsilon} f(x)\,dx + \lim_{\epsilon \to 0^+} \int_{c+\epsilon}^b f(x)\,dx" />
        </DefinitionBlock>
      )}
      <TheoremBlock title="p-Test" id="p-test">
        <BlockMath math="\int_1^{\infty} \frac{1}{x^p}\,dx \begin{cases} \text{converges} & p > 1 \\ \text{diverges} & p \leq 1 \end{cases}" />
      </TheoremBlock>
      <ExampleBlock title="The Gaussian Integral">
        <BlockMath math="\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}" />
        <p className="mt-2">Ensures the normal distribution integrates to 1.</p>
      </ExampleBlock>
      <PythonCode title="Numerical Improper Integration" code={`import numpy as np
from scipy import integrate

result, _ = integrate.quad(lambda x: np.exp(-x**2), -np.inf, np.inf)
print(f"Gaussian integral: {result:.6f} (exact: {np.sqrt(np.pi):.6f})")

for p in [0.5, 1.0, 1.5, 2.0]:
    result, _ = integrate.quad(lambda x, p=p: x**(-p), 1, np.inf)
    status = "converges" if p > 1 else "diverges"
    print(f"p={p}: {status}, value={result:.4f}")`} />
      <NoteBlock type="warning" title="Convergence in ML">
        <p>KL divergence requires the support of p to be contained in q, otherwise the integral diverges.</p>
      </NoteBlock>
    </div>
  )
}
