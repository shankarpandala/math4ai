import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

const FIELDS = {
  rotation: { label: 'Rotation (curl≠0)', F: (x, y) => [-y, x], div: '0', curl: '2' },
  source:   { label: 'Source (div>0)', F: (x, y) => [x, y], div: '2', curl: '0' },
  sink:     { label: 'Sink (div<0)', F: (x, y) => [-x, -y], div: '-2', curl: '0' },
  gradient: { label: 'Gradient field', F: (x, y) => [2*x, 2*y], div: '4', curl: '0' },
};

function VectorFieldViz() {
  const [fieldKey, setFieldKey] = useState('rotation');
  const field = FIELDS[fieldKey];

  const W = 320, H = 280;
  const n = 9;
  const xMin = -2.2, xMax = 2.2, yMin = -2.2, yMax = 2.2;
  const toSvg = (x, y) => ({
    sx: ((x - xMin) / (xMax - xMin)) * W,
    sy: H - ((y - yMin) / (yMax - yMin)) * H,
  });

  const arrows = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = xMin + (i + 0.5) * (xMax - xMin) / n;
      const y = yMin + (j + 0.5) * (yMax - yMin) / n;
      const [fx, fy] = field.F(x, y);
      const mag = Math.sqrt(fx * fx + fy * fy);
      if (mag < 1e-10) continue;
      const len = 18;
      const nx = fx / mag, ny = fy / mag;
      const { sx, sy } = toSvg(x, y);
      const ex = sx + nx * len, ey = sy - ny * len;
      const perp = 4;
      const color = `hsl(${200 + mag * 30}, 70%, 50%)`;
      arrows.push({ sx, sy, ex, ey, nx, ny, perp, color, key: `${i}-${j}` });
    }
  }

  const axisY = toSvg(0, 0).sy, axisX = toSvg(0, 0).sx;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Vector Field Visualizer</h3>
      <div className="mb-3 flex flex-wrap gap-2">
        {Object.entries(FIELDS).map(([k, v]) => (
          <button key={k} onClick={() => setFieldKey(k)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${fieldKey === k ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
            {v.label}
          </button>
        ))}
      </div>
      <svg width={W} height={H} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <line x1={0} y1={axisY} x2={W} y2={axisY} stroke="#d1d5db" strokeWidth={1} />
        <line x1={axisX} y1={0} x2={axisX} y2={H} stroke="#d1d5db" strokeWidth={1} />
        {arrows.map(({ sx, sy, ex, ey, nx, ny, perp, color, key }) => (
          <g key={key}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={1.5} />
            <polygon
              points={`${ex},${ey} ${ex - nx*7 + ny*perp},${ey + ny*7 + nx*perp} ${ex - nx*7 - ny*perp},${ey + ny*7 - nx*perp}`}
              fill={color} />
          </g>
        ))}
      </svg>
      <div className="mt-3 flex gap-4 text-sm">
        <span className="rounded bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-blue-700 dark:text-blue-300">
          div <InlineMath math={`\\mathbf{F} = ${field.div}`} />
        </span>
        <span className="rounded bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-purple-700 dark:text-purple-300">
          curl <InlineMath math={`\\mathbf{F} = ${field.curl}`} />
        </span>
      </div>
    </div>
  );
}

export default function VectorFieldsSection() {
  return (
    <div className="space-y-8">
      <VectorFieldViz />

      <DefinitionBlock
        label="Definition 5.1.1"
        title="Divergence and Curl"
        definition={
          "For a vector field $\\mathbf{F} = (F_1, F_2, F_3): \\mathbb{R}^3 \\to \\mathbb{R}^3$: " +
          "Divergence: $\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}$ (scalar field, measures local expansion/compression). " +
          "Curl: $\\nabla \\times \\mathbf{F} = \\left(\\frac{\\partial F_3}{\\partial y} - \\frac{\\partial F_2}{\\partial z},\\; \\frac{\\partial F_1}{\\partial z} - \\frac{\\partial F_3}{\\partial x},\\; \\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}\\right)$ (vector field, measures local rotation)."
        }
        notation={
          "A vector field is conservative (irrotational) if $\\nabla \\times \\mathbf{F} = \\mathbf{0}$. " +
          "In simply connected domains, $\\nabla \\times \\mathbf{F} = 0 \\iff \\mathbf{F} = \\nabla \\phi$ for some scalar potential $\\phi$. " +
          "An incompressible (solenoidal) field satisfies $\\nabla \\cdot \\mathbf{F} = 0$, e.g., magnetic fields by Gauss's law."
        }
      />

      <DefinitionBlock
        label="Definition 5.1.2"
        title="Line and Flux Integrals"
        definition={
          "Work done by $\\mathbf{F}$ along curve $C$: $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\,dt$. " +
          "Flux of $\\mathbf{F}$ through surface $S$: $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dA$ " +
          "where $\\mathbf{n}$ is the outward unit normal."
        }
      />

      <TheoremBlock
        label="Theorem 5.1.1"
        title="Divergence Theorem (Gauss's Theorem)"
        statement={
          "Let $\\Omega \\subset \\mathbb{R}^3$ be a bounded region with smooth boundary $\\partial\\Omega$ and outward normal $\\mathbf{n}$. " +
          "For a $C^1$ vector field $\\mathbf{F}$: " +
          "$\\iint_{\\partial\\Omega} \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_\\Omega \\nabla \\cdot \\mathbf{F}\\,dV$. " +
          "The net flux out of a closed surface equals the total divergence inside the volume."
        }
        proof={
          "Decompose $\\mathbf{F} = (P, Q, R)$ and prove each component separately. " +
          "For $R$: integrate $\\frac{\\partial R}{\\partial z}$ over the volume, using FTC in the $z$ direction, " +
          "and match the boundary integral on top/bottom faces. Similar arguments apply for $P$ and $Q$. " +
          "Sum the three component results."
        }
        corollaries={[
          "Stokes' theorem: $\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$.",
          "Green's theorem is the 2D special case of Stokes' theorem.",
        ]}
      />

      <ExampleBlock title="Gradient Fields Are Conservative">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          If <InlineMath math="\mathbf{F} = \nabla \phi" />, then for any closed curve <InlineMath math="C" />:
        </p>
        <BlockMath math="\oint_C \mathbf{F} \cdot d\mathbf{r} = \phi(\text{end}) - \phi(\text{start}) = 0" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The work is path-independent. This is why gravity and electrostatic forces are conservative:
          you can define a potential energy function.
        </p>
      </ExampleBlock>

      <WarningBlock title="curl(grad f) = 0 and div(curl F) = 0 Always">
        <p>
          Two fundamental identities: <InlineMath math="\nabla \times (\nabla f) = \mathbf{0}" /> (curl of any
          gradient is zero) and <InlineMath math="\nabla \cdot (\nabla \times \mathbf{F}) = 0" /> (divergence
          of any curl is zero). These are exact differentials in disguise. In physics, they encode
          conservation laws: <InlineMath math="\nabla \cdot \mathbf{B} = 0" /> (no magnetic monopoles) and
          Faraday's law follow from these identities. Never confuse div and curl — they act on different
          types of fields and produce different types of output.
        </p>
      </WarningBlock>

      <PythonCode
        title="Vector Calculus with NumPy"
        code={`import numpy as np

# ── Numerical divergence and curl (2D) ───────────────────────────────────
def divergence_2d(F, x, y, h=1e-5):
    """F(x,y) returns [Fx, Fy]. Compute div F = dFx/dx + dFy/dy."""
    Fx_plus  = F(x + h, y)[0]; Fx_minus = F(x - h, y)[0]
    Fy_plus  = F(x, y + h)[1]; Fy_minus = F(x, y - h)[1]
    return (Fx_plus - Fx_minus) / (2*h) + (Fy_plus - Fy_minus) / (2*h)

def curl_2d(F, x, y, h=1e-5):
    """Curl z-component: dFy/dx - dFx/dy."""
    Fy_plus  = F(x + h, y)[1]; Fy_minus = F(x - h, y)[1]
    Fx_plus  = F(x, y + h)[0]; Fx_minus = F(x, y - h)[0]
    return (Fy_plus - Fy_minus) / (2*h) - (Fx_plus - Fx_minus) / (2*h)

# Test fields
F_rot = lambda x, y: np.array([-y, x])      # rotation: div=0, curl=2
F_src = lambda x, y: np.array([x, y])        # source: div=2, curl=0
F_pot = lambda x, y: np.array([2*x, 2*y])   # gradient field: curl=0

for name, F, exp_div, exp_curl in [
    ('rotation', F_rot, 0, 2),
    ('source',   F_src, 2, 0),
    ('gradient', F_pot, 4, 0),
]:
    d = divergence_2d(F, 1.0, 0.5)
    c = curl_2d(F, 1.0, 0.5)
    print(f"{name}: div={d:.4f} (expected {exp_div}), curl={c:.4f} (expected {exp_curl})")

# ── Line integral: work done by F=-y,x along unit circle ─────────────────
n = 10000
t = np.linspace(0, 2*np.pi, n)
x, y = np.cos(t), np.sin(t)
dx = np.diff(np.cos(t))
dy = np.diff(np.sin(t))
xm, ym = (x[:-1] + x[1:])/2, (y[:-1] + y[1:])/2
Fx, Fy = F_rot(xm, ym)
work = np.sum(Fx * dx + Fy * dy)
print(f"\\nWork by rotation field on unit circle: {work:.4f} (expected {2*np.pi:.4f})")`}
      />
    </div>
  );
}
