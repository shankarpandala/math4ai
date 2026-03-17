import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

export default function IntegrationTechniques() {
  const [technique, setTechnique] = useState('substitution')
  const techniques = {
    substitution: { title: 'u-Substitution', formula: '\\int f(g(x))\\,g\'(x)\\,dx = \\int f(u)\\,du', example: '\\int 2x\\cos(x^2)\\,dx = \\sin(x^2) + C', desc: 'Replace a composite expression with u = g(x).' },
    parts: { title: 'Integration by Parts', formula: '\\int u\\,dv = uv - \\int v\\,du', example: '\\int x e^x\\,dx = xe^x - e^x + C', desc: 'From the product rule. Choose u via LIATE.' },
    partial: { title: 'Partial Fractions', formula: '\\frac{P(x)}{Q(x)} = \\sum_i \\frac{A_i}{(x - r_i)^{k_i}}', example: '\\int \\frac{1}{x^2-1}\\,dx = \\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C', desc: 'Decompose rational functions into simpler fractions.' },
    trig: { title: 'Trig Substitution', formula: 'x = a\\sin\\theta,\; x = a\\tan\\theta,\; x = a\\sec\\theta', example: '\\int \\frac{dx}{\\sqrt{1-x^2}} = \\arcsin(x) + C', desc: 'Use trig identities for expressions with square roots.' }
  }
  const t = techniques[technique]
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.entries(techniques).map(([key, val]) => (
          <button key={key} onClick={() => setTechnique(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${technique === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
            {val.title}
          </button>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
        <h3 className="font-bold text-lg mb-2">{t.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.desc}</p>
        <BlockMath math={t.formula} />
        <p className="text-sm mt-2 font-medium">Example:</p>
        <BlockMath math={t.example} />
      </div>
      <TheoremBlock title="LIATE Rule" id="liate">
        <p>Priority for choosing <InlineMath math="u" /> in integration by parts:</p>
        <ol className="list-decimal ml-5 mt-2 space-y-1">
          <li><strong>L</strong>ogarithmic</li>
          <li><strong>I</strong>nverse trig</li>
          <li><strong>A</strong>lgebraic</li>
          <li><strong>T</strong>rigonometric</li>
          <li><strong>E</strong>xponential</li>
        </ol>
      </TheoremBlock>
      <ExampleBlock title="Tabular Integration by Parts">
        <p>For <InlineMath math="\int x^2 e^x\,dx" />:</p>
        <BlockMath math="= x^2 e^x - 2xe^x + 2e^x + C" />
      </ExampleBlock>
      <PythonCode title="Symbolic Integration" code={`import sympy as sp
x = sp.Symbol('x')
print("u-sub:", sp.integrate(2*x * sp.cos(x**2), x))
print("by parts:", sp.integrate(x * sp.exp(x), x))
print("partial:", sp.integrate(1 / (x**2 - 1), x))
print("trig sub:", sp.integrate(1 / sp.sqrt(1 - x**2), x))`} />
      <NoteBlock type="tip" title="ML Connection">
        <p>Integration techniques are essential for computing normalizing constants, deriving the ELBO, and evaluating expected values throughout ML theory.</p>
      </NoteBlock>
    </div>
  )
}
