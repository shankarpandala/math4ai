import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

export default function NewtonMethod() {
  const [steps, setSteps] = useState(3)
  const trace = [2.0]
  for (let i = 0; i < 8; i++) {
    const x = trace[trace.length - 1]
    const fp = 4 * x * x * x - 6 * x
    const fpp = 12 * x * x - 6
    if (Math.abs(fpp) < 1e-10) break
    trace.push(x - fp / fpp)
  }
  return (
    <div className="space-y-6">
      <DefinitionBlock title="Newton's Method">
        <BlockMath math="x_{k+1} = x_k - [H_f(x_k)]^{-1} \nabla f(x_k)" />
        <p className="mt-2">In 1D: <InlineMath math="x_{k+1} = x_k - f'(x_k)/f''(x_k)" /></p>
      </DefinitionBlock>
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Iterations on <InlineMath math="f(x) = x^4 - 3x^2 + 2" /></h3>
          <div className="flex items-center gap-2">
            <label className="text-sm">Steps: {steps}</label>
            <input type="range" min={1} max={7} value={steps} onChange={e => setSteps(parseInt(e.target.value))} />
          </div>
        </div>
        <div className="text-sm font-mono space-y-1">
          {trace.slice(0, steps + 1).map((x, i) => (
            <div key={i}>k={i}: x={x.toFixed(8)}, f&apos;={((4*x*x*x - 6*x)).toFixed(6)}</div>
          ))}
        </div>
      </div>
      <TheoremBlock title="Quadratic Convergence" id="convergence">
        <BlockMath math="\|x_{k+1} - x^*\| \leq C\|x_k - x^*\|^2" />
        <p className="mt-2">Correct digits double each step near the optimum.</p>
      </TheoremBlock>
      <PythonCode title="Newton vs Gradient Descent" code={`import numpy as np

def grad(x): return 4*x**3 - 6*x
def hess(x): return 12*x**2 - 6

x_n = 2.0
for i in range(6):
    x_n = x_n - grad(x_n) / hess(x_n)
print(f"Newton (6 steps): x = {x_n:.10f}")

x_gd = 2.0
for i in range(100):
    x_gd = x_gd - 0.01 * grad(x_gd)
print(f"GD (100 steps):   x = {x_gd:.10f}")
print(f"True minimum:     x = {np.sqrt(3/2):.10f}")`} />
      <NoteBlock type="warning" title="High-Dimensional Cost">
        <p>Full Newton requires O(n³) for the Hessian inverse. Approximations like L-BFGS and K-FAC are used in practice.</p>
      </NoteBlock>
    </div>
  )
}
