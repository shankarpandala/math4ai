import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

export default function DoCalculus() {
  const [rule, setRule] = useState(1)
  const rules = {
    1: { title: 'Rule 1: Insert/Delete Observations', formula: 'P(y \\mid do(x), z, w) = P(y \\mid do(x), w)' },
    2: { title: 'Rule 2: Action/Observation Exchange', formula: 'P(y \\mid do(x), do(z), w) = P(y \\mid do(x), z, w)' },
    3: { title: 'Rule 3: Insert/Delete Actions', formula: 'P(y \\mid do(x), do(z), w) = P(y \\mid do(x), w)' }
  }
  return (
    <div className="space-y-6">
      <DefinitionBlock title="The do-Operator">
        <BlockMath math="P(Y \mid do(X = x)) \neq P(Y \mid X = x)" />
        <p className="mt-2">Intervention cuts incoming edges in the causal graph.</p>
      </DefinitionBlock>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <button key={i} onClick={() => setRule(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${rule === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
            Rule {i}
          </button>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
        <h3 className="font-bold mb-2">{rules[rule].title}</h3>
        <BlockMath math={rules[rule].formula} />
      </div>
      <TheoremBlock title="Backdoor Adjustment" id="backdoor">
        <BlockMath math="P(Y \mid do(X)) = \sum_z P(Y \mid X, Z=z)\, P(Z=z)" />
        <p className="mt-2">Converts interventional queries into observational data.</p>
      </TheoremBlock>
      <ExampleBlock title="Confounding Example">
        <p>Temperature confounds ice cream sales and drowning. Adjusting for temperature removes the spurious correlation.</p>
      </ExampleBlock>
      <PythonCode title="Backdoor Adjustment" code={`import numpy as np
np.random.seed(42)
N = 10_000
Z = np.random.normal(0, 1, N)
X = 0.8 * Z + np.random.normal(0, 0.5, N)
Y = 0.6 * Z + np.random.normal(0, 0.5, N)  # no X->Y!

b_naive = np.polyfit(X, Y, 1)[0]
print(f"Naive X->Y: {b_naive:.3f} (confounded!)")

A = np.column_stack([X, Z, np.ones(N)])
coeffs = np.linalg.lstsq(A, Y, rcond=None)[0]
print(f"Adjusted X->Y: {coeffs[0]:.3f} (true: 0.000)")
print(f"Z->Y effect: {coeffs[1]:.3f} (true: 0.600)")`} />
      <NoteBlock type="note" title="Completeness">
        <p>Do-calculus is complete: any identifiable causal effect can be derived using these three rules.</p>
      </NoteBlock>
    </div>
  )
}
