import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

export default function PartialDerivatives() {
  const [dim, setDim] = useState(2)
  return (
    <div className="space-y-6">
      <DefinitionBlock title="Partial Derivative">
        <BlockMath math="\frac{\partial f}{\partial x_i} = \lim_{h \to 0} \frac{f(\ldots, x_i + h, \ldots) - f(\ldots, x_i, \ldots)}{h}" />
        <p className="mt-2">Differentiate w.r.t. one variable, holding others constant.</p>
      </DefinitionBlock>
      <div className="flex gap-3">
        {[2, 3].map(d => (
          <button key={d} onClick={() => setDim(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${dim === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
            {d}D
          </button>
        ))}
      </div>
      <ExampleBlock title={`Partial Derivatives in ${dim}D`}>
        {dim === 2 ? (
          <>
            <p>For <InlineMath math="f(x,y) = x^2y + \sin(xy)" />:</p>
            <BlockMath math="\frac{\partial f}{\partial x} = 2xy + y\cos(xy), \quad \frac{\partial f}{\partial y} = x^2 + x\cos(xy)" />
          </>
        ) : (
          <>
            <p>For <InlineMath math="f(x,y,z) = x^2yz + e^{xz}" />:</p>
            <BlockMath math="\frac{\partial f}{\partial x} = 2xyz + ze^{xz}, \quad \frac{\partial f}{\partial y} = x^2z, \quad \frac{\partial f}{\partial z} = x^2y + xe^{xz}" />
          </>
        )}
      </ExampleBlock>
      <TheoremBlock title="Clairaut's Theorem" id="clairaut">
        <p>If second partials are continuous:</p>
        <BlockMath math="\frac{\partial^2 f}{\partial x_i \partial x_j} = \frac{\partial^2 f}{\partial x_j \partial x_i}" />
        <p className="mt-2">Ensures the Hessian is symmetric.</p>
      </TheoremBlock>
      <PythonCode title="Automatic Partial Derivatives" code={`import torch
x = torch.tensor(1.0, requires_grad=True)
y = torch.tensor(2.0, requires_grad=True)
f = x**2 * y + torch.sin(x * y)
f.backward()
print(f"df/dx = {x.grad.item():.4f}")
print(f"df/dy = {y.grad.item():.4f}")

import math
print(f"Analytic df/dx = {2*1*2 + 2*math.cos(2):.4f}")
print(f"Analytic df/dy = {1 + math.cos(2):.4f}")`} />
    </div>
  )
}
