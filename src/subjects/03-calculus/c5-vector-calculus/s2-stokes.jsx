import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function DivergenceViz() {
  const [fieldType, setFieldType] = useState('source')

  // Simple 2D vector field visualization
  const gridSize = 6
  const cx = 160, cy = 140, spacing = 35, arrowScale = 12

  const getField = (x, y) => {
    if (fieldType === 'source') return [x, y]          // div > 0
    if (fieldType === 'sink') return [-x, -y]           // div < 0
    if (fieldType === 'curl') return [-y, x]            // div = 0
    return [1, 0]                                       // uniform, div = 0
  }

  const divValue = fieldType === 'source' ? 2 : fieldType === 'sink' ? -2 : 0

  const arrows = []
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (i === 0 && j === 0) continue
      const [fx, fy] = getField(i, j)
      const mag = Math.sqrt(fx * fx + fy * fy) || 1
      arrows.push({ x: cx + i * spacing, y: cy - j * spacing, dx: (fx / mag) * arrowScale, dy: -(fy / mag) * arrowScale })
    }
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Divergence of Vector Fields</h3>
      <div className="mb-3 flex gap-2 flex-wrap">
        {[['source', 'Source (div &gt; 0)'], ['sink', 'Sink (div &lt; 0)'], ['curl', 'Curl-only (div = 0)'], ['uniform', 'Uniform (div = 0)']].map(([k, label]) => (
          <button key={k} onClick={() => setFieldType(k)}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${fieldType === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            dangerouslySetInnerHTML={{ __html: label }} />
        ))}
      </div>
      <svg width={320} height={280} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {arrows.map((a, i) => (
          <line key={i} x1={a.x} y1={a.y} x2={a.x + a.dx} y2={a.y + a.dy} stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#arrowDiv)" />
        ))}
        <circle cx={cx} cy={cy} r={60} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="5,3" />
        <defs>
          <marker id="arrowDiv" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        div F = {divValue} | Net flux through the circle is {divValue > 0 ? 'outward (positive)' : divValue < 0 ? 'inward (negative)' : 'zero'}
      </div>
    </div>
  )
}

export default function StokesDivergence() {
  return (
    <div className="space-y-8">
      <DivergenceViz />

      <DefinitionBlock
        label="Definition 5.2.1"
        title="Divergence and Curl"
        definition={
          "For $\\mathbf{F} = (F_1, F_2, F_3)$: " +
          "$\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}$ (divergence, scalar). " +
          "$\\nabla \\times \\mathbf{F} = \\left(\\frac{\\partial F_3}{\\partial y} - \\frac{\\partial F_2}{\\partial z},\\; " +
          "\\frac{\\partial F_1}{\\partial z} - \\frac{\\partial F_3}{\\partial x},\\; " +
          "\\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}\\right)$ (curl, vector)."
        }
        notation={
          "Divergence measures local expansion rate; curl measures local rotation."
        }
      />

      <TheoremBlock
        label="Theorem 5.2.1"
        title="Divergence Theorem (Gauss)"
        statement={
          "For a compact region $V \\subset \\mathbb{R}^3$ with boundary $\\partial V$ and outward normal $\\hat{\\mathbf{n}}$: " +
          "$\\iiint_V (\\nabla \\cdot \\mathbf{F})\\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot \\hat{\\mathbf{n}}\\, dS$. " +
          "The total divergence inside equals the net outward flux through the boundary."
        }
        proof={
          "Apply the fundamental theorem of calculus to each component. For $F_1$: " +
          "$\\iiint \\frac{\\partial F_1}{\\partial x} dV = \\iint (F_1|_{x=b} - F_1|_{x=a}) dy\\,dz$, " +
          "which equals the flux of $F_1$ through the $x$-faces. Sum over all components."
        }
      />

      <TheoremBlock
        label="Theorem 5.2.2"
        title="Stokes' Theorem"
        statement={
          "For an oriented surface $S$ with boundary curve $\\partial S$: " +
          "$\\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r}$. " +
          "The surface integral of the curl equals the line integral around the boundary."
        }
      />

      <ExampleBlock title="Applications in Physics and ML">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          The divergence theorem underlies conservation laws. In ML, it appears in:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Normalizing flows</strong>: the instantaneous change of log-density
            is <InlineMath math="\frac{\partial \log p}{\partial t} = -\nabla \cdot \mathbf{v}" /> (continuity equation)
          </li>
          <li>
            <strong>Score matching</strong>: integration by parts (a consequence of the divergence theorem)
            eliminates the need to know the normalizing constant
          </li>
          <li>
            <strong>Physics-informed neural networks</strong>: enforcing PDE constraints that involve
            divergence and curl operators
          </li>
        </ul>
      </ExampleBlock>

      <NoteBlock title="Unifying View: Generalized Stokes' Theorem">
        <p>
          All these theorems (FTC, Green's, Stokes', Divergence) are special cases of the
          generalized Stokes' theorem on differential forms:{' '}
          <InlineMath math="\int_{\partial \Omega} \omega = \int_\Omega d\omega" />.
          The boundary operator <InlineMath math="\partial" /> and exterior derivative <InlineMath math="d" /> are
          adjoint in this sense.
        </p>
      </NoteBlock>

      <PythonCode
        title="Divergence and Curl Computations"
        code={`import numpy as np

# ── Numerical divergence and curl on a grid ──────────────────────────────
N = 50
x = np.linspace(-2, 2, N)
y = np.linspace(-2, 2, N)
X, Y = np.meshgrid(x, y)
dx = x[1] - x[0]

# Vector field: F = (x*y, -y^2)
Fx = X * Y
Fy = -Y**2

# Divergence: dFx/dx + dFy/dy
div_F = np.gradient(Fx, dx, axis=1) + np.gradient(Fy, dx, axis=0)
# Analytic: div F = y + (-2y) = -y
div_analytic = -Y

print(f"Divergence - numerical vs analytic error: {np.max(np.abs(div_F - div_analytic)):.6f}")

# ── Verify divergence theorem in 2D (Green's theorem) ───────────────────
# Region: unit disk, F = (x, y), div F = 2
# Integral of div F over disk = 2 * pi * r^2 = 2*pi
# Flux integral = integral of F.n over circle = integral of r dr = 2*pi

theta = np.linspace(0, 2*np.pi, 1000)
# F=(x,y) on unit circle, F.n = cos^2+sin^2 = 1
flux = np.trapz(np.ones_like(theta), theta)
volume_integral = 2 * np.pi
print(f"\\nDivergence theorem: vol integral={volume_integral:.4f}, flux={flux:.4f}, match={np.isclose(flux, volume_integral)}")

# ── 2D curl (scalar): curl F = dFy/dx - dFx/dy ─────────────────────────
curl_F = np.gradient(Fy, dx, axis=1) - np.gradient(Fx, dx, axis=0)
print(f"Curl error: {np.max(np.abs(curl_F - (-X))):.6f}")`}
      />
    </div>
  )
}
