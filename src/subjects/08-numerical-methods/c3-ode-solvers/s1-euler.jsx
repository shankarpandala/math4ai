import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ODE: dy/dt = -2y + sin(t), y(0) = 1
// Exact solution: y(t) = C e^{-2t} + (sin(t) - 2cos(t)/5) ... or use numerical comparison

function odeRHS(t, y) { return -2 * y + Math.sin(t); }

function exactSolution(t) {
  // y(t) = e^{-2t} * (1 + 2/5) + sin(t)/5 - 2cos(t)/5
  return Math.exp(-2 * t) * (1 + 2 / 5) + Math.sin(t) / 5 - 2 * Math.cos(t) / 5;
}

function solveEuler(h, tEnd = 3) {
  const pts = [{ t: 0, y: 1 }];
  let t = 0, y = 1;
  while (t < tEnd - h / 2) {
    y = y + h * odeRHS(t, y);
    t = Math.min(t + h, tEnd);
    pts.push({ t, y });
  }
  return pts;
}

function solveRK4(h, tEnd = 3) {
  const pts = [{ t: 0, y: 1 }];
  let t = 0, y = 1;
  while (t < tEnd - h / 2) {
    const k1 = odeRHS(t, y);
    const k2 = odeRHS(t + h / 2, y + h / 2 * k1);
    const k3 = odeRHS(t + h / 2, y + h / 2 * k2);
    const k4 = odeRHS(t + h, y + h * k3);
    y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    t = Math.min(t + h, tEnd);
    pts.push({ t, y });
  }
  return pts;
}

function InteractiveODE() {
  const [h, setH] = useState(0.5);
  const [method, setMethod] = useState('euler');

  const tEnd = 3;
  const nExact = 100;
  const exactPts = Array.from({ length: nExact }, (_, i) => ({
    t: (i / (nExact - 1)) * tEnd,
    y: exactSolution((i / (nExact - 1)) * tEnd),
  }));

  const numPts = method === 'euler' ? solveEuler(h, tEnd) : solveRK4(h, tEnd);
  const finalError = Math.abs(numPts[numPts.length - 1].y - exactSolution(tEnd));

  const W = 400, H = 240, PAD = 40;
  const tMin = 0, yMin = -0.2, yMax = 1.2;

  function toSvg(t, y) {
    return {
      sx: PAD + (t / tEnd) * (W - 2 * PAD),
      sy: H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD),
    };
  }

  const exactPath = exactPts.map(({ t, y }) => {
    const { sx, sy } = toSvg(t, y);
    return `${sx},${sy}`;
  }).join(' ');

  const numPath = numPts.map(({ t, y }) => {
    const { sx, sy } = toSvg(t, y);
    return `${sx},${sy}`;
  }).join(' ');

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Euler vs RK4</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Solving <InlineMath math="y' = -2y + \sin(t),\; y(0)=1" />. Compare Euler (first-order) vs
        RK4 (fourth-order) accuracy. Increase step size to see errors grow.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#9ca3af" strokeWidth="1" />
          {/* Exact solution */}
          <polyline points={exactPath} fill="none" stroke="#10b981" strokeWidth="2" />
          {/* Numerical solution */}
          <polyline points={numPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray={h > 0.3 ? '0' : '4,2'} />
          {/* Step markers */}
          {numPts.slice(0, 20).map(({ t, y }, i) => {
            const { sx, sy } = toSvg(t, y);
            return <circle key={i} cx={sx} cy={sy} r="3" fill="#ef4444" opacity="0.7" />;
          })}
          {/* Legend */}
          <rect x={W - PAD - 120} y={PAD} width="116" height="46" fill="white" fillOpacity="0.9" rx="4" />
          <line x1={W - PAD - 112} y1={PAD + 12} x2={W - PAD - 90} y2={PAD + 12} stroke="#10b981" strokeWidth="2" />
          <text x={W - PAD - 86} y={PAD + 16} fontSize="10" fill="#374151">Exact</text>
          <line x1={W - PAD - 112} y1={PAD + 28} x2={W - PAD - 90} y2={PAD + 28} stroke="#ef4444" strokeWidth="2" />
          <text x={W - PAD - 86} y={PAD + 32} fontSize="10" fill="#374151">{method === 'euler' ? 'Euler' : 'RK4'}</text>
          <text x={PAD + 4} y={H - PAD - 4} fontSize="10" fill="#374151">t →</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Method</label>
            {['euler', 'rk4'].map(m => (
              <label key={m} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">
                <input type="radio" value={m} checked={method === m} onChange={e => setMethod(e.target.value)} />
                {m === 'euler' ? 'Euler (O(h))' : 'RK4 (O(h⁴))'}
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Step size <InlineMath math={`h = ${h.toFixed(2)}`} />
            </label>
            <input type="range" min="0.02" max="0.9" step="0.02" value={h} onChange={e => setH(+e.target.value)} className="w-full" />
          </div>
          <div className="rounded bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-xs">
            <p>Steps: {numPts.length - 1}</p>
            <p>Final error: <strong className={finalError < 1e-4 ? 'text-green-700' : finalError < 0.01 ? 'text-amber-700' : 'text-red-700'}>{finalError.toExponential(2)}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EulerRungeKutta() {
  return (
    <div className="space-y-8">
      <InteractiveODE />

      <DefinitionBlock title="Initial Value Problem and Euler's Method">
        <p>
          The <strong>initial value problem (IVP)</strong> is:
        </p>
        <BlockMath math="\frac{dy}{dt} = f(t, y), \quad y(t_0) = y_0." />
        <p className="mt-2">
          <strong>Explicit Euler's method</strong> advances the solution by:
        </p>
        <BlockMath math="y_{n+1} = y_n + h f(t_n, y_n)," />
        <p className="mt-2">
          where <InlineMath math="h" /> is the step size. It is a first-order method: global
          error <InlineMath math="|y(t_n) - y_n| = O(h)" />.
          <strong> Implicit Euler</strong> uses <InlineMath math="f(t_{n+1}, y_{n+1})" />
          on the right-hand side, requiring solving a nonlinear equation per step.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Runge-Kutta Methods">
        <p>
          <strong>RK4</strong> (the classical fourth-order Runge-Kutta method) uses four
          function evaluations per step:
        </p>
        <BlockMath math="\begin{aligned} k_1 &= f(t_n, y_n) \\ k_2 &= f(t_n + h/2,\; y_n + h k_1/2) \\ k_3 &= f(t_n + h/2,\; y_n + h k_2/2) \\ k_4 &= f(t_n + h,\; y_n + h k_3) \\ y_{n+1} &= y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4). \end{aligned}" />
        <p className="mt-2">
          RK4 achieves fourth-order accuracy: global error <InlineMath math="O(h^4)" />.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Stability and Stiff Equations">
        <p>
          A method is <strong>A-stable</strong> if it is stable for all
          <InlineMath math="\lambda \in \mathbb{C}" /> with <InlineMath math="\operatorname{Re}(\lambda) < 0" />
          applied to the test equation <InlineMath math="y' = \lambda y" />. Stability region of
          explicit Euler: <InlineMath math="|1 + h\lambda| \leq 1" />.
        </p>
        <p className="mt-2">
          <strong>Stiff equations</strong> have components that evolve on vastly different timescales.
          For stiff problems, explicit methods require tiny <InlineMath math="h" /> for stability
          (not accuracy). Implicit methods like the trapezoidal rule or BDF are A-stable or
          L-stable and handle stiffness efficiently.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Global Error Bound for RK Methods"
        proof="By induction: the local truncation error (LTE) for a p-th order method is O(h^{p+1}). The global error accumulates LTE over T/h steps: ||e_n|| ≤ (T/h) * C * h^{p+1} = CT * h^p = O(h^p). The constant C depends on higher derivatives of f."
      >
        <p>
          For a <InlineMath math="p" />-th order Runge-Kutta method applied to a smooth IVP,
          the global error satisfies:
        </p>
        <BlockMath math="\max_{0 \leq n \leq T/h} |y(t_n) - y_n| \leq C \cdot h^p," />
        <p className="mt-2">
          where <InlineMath math="C" /> depends on <InlineMath math="T" /> and the
          <InlineMath math="(p+1)" />-th derivative of the exact solution. RK4 has
          <InlineMath math="p=4" />; Euler has <InlineMath math="p=1" />.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Adaptive Step Size Control"
        proof="Embedded RK pairs (e.g., Dormand-Prince RK45) compute two solutions of order p and p+1 with the same function evaluations. Their difference estimates the local error, enabling step size adjustment: h_new = h * (tol/err)^{1/(p+1)} scaled by a safety factor."
      >
        <p>
          Adaptive methods (e.g., <strong>RK45 / Dormand-Prince</strong>) estimate the local
          error <InlineMath math="\hat{e}_n" /> using an embedded lower-order solution and
          adjust the step size:
        </p>
        <BlockMath math="h_{\text{new}} = h \cdot \left(\frac{\text{tol}}{\|\hat{e}_n\|}\right)^{1/(p+1)}." />
        <p className="mt-2">
          This achieves prescribed tolerance automatically, using large steps where the solution
          is smooth and small steps where it changes rapidly.
        </p>
      </TheoremBlock>

      <ExampleBlock title="ODE Solvers in Machine Learning">
        <p>
          ODE solvers appear in several ML contexts:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Neural ODEs</strong>: model hidden state evolution as <InlineMath math="dh/dt = f_\theta(h, t)" />.</li>
          <li><strong>Score-based generative models</strong>: sample via a reverse-time SDE/ODE solved numerically.</li>
          <li><strong>Hamiltonian Monte Carlo</strong>: simulate Hamiltonian dynamics using leapfrog (symplectic) integration.</li>
          <li><strong>Physics-informed neural networks</strong>: minimize residuals of governing ODEs/PDEs.</li>
        </ul>
      </ExampleBlock>

      <WarningBlock title="Explicit Methods Fail for Stiff Systems Without Tiny Step Sizes">
        <p>
          For stiff ODEs (e.g., from neural ODEs with large spectral radius, or chemical kinetics),
          explicit methods like Euler or RK4 require step sizes far smaller than the dynamics
          timescale for stability. For example, the eigenvalue <InlineMath math="\lambda = -1000" />
          requires <InlineMath math="h < 2/1000 = 0.002" /> for explicit Euler stability,
          even if the solution changes slowly. Use implicit methods (SDIRK, Radau, BDF) or
          adaptive solvers from scipy/torchdiffeq that detect stiffness automatically.
        </p>
      </WarningBlock>

      <PythonCode code={`import numpy as np
from scipy.integrate import solve_ivp

# ODE: dy/dt = -2y + sin(t), y(0) = 1
def rhs(t, y): return [-2*y[0] + np.sin(t)]
def exact(t): return np.exp(-2*t)*(1 + 2/5) + np.sin(t)/5 - 2*np.cos(t)/5

t_span = (0, 3)
y0 = [1.0]

# Compare methods with fixed step sizes
methods_h = [('Euler', 0.5), ('Euler', 0.1), ('RK45', 0.5)]

for method_name, h in methods_h:
    if method_name == 'Euler':
        # Manual Euler
        t, y = 0.0, 1.0
        while t < t_span[1] - h/2:
            y = y + h * rhs(t, [y])[0]
            t += h
        err = abs(y - exact(t_span[1]))
        print(f"Euler (h={h}):  y(3)={y:.6f}, |error|={err:.2e}")
    else:
        sol = solve_ivp(rhs, t_span, y0, method='RK45', max_step=h, dense_output=True)
        y_rk45 = sol.y[0, -1]
        err = abs(y_rk45 - exact(t_span[1]))
        print(f"RK45  (h={h}):  y(3)={y_rk45:.6f}, |error|={err:.2e}")

# Adaptive RK45 with tolerance control
for rtol in [1e-3, 1e-6, 1e-9]:
    sol = solve_ivp(rhs, t_span, y0, method='RK45', rtol=rtol, atol=rtol*1e-2)
    y_final = sol.y[0, -1]
    err = abs(y_final - exact(t_span[1]))
    print(f"\\nAdaptive RK45 (rtol={rtol:.0e}): "
          f"{sol.nfev} func evals, |error|={err:.2e}")

# Stiff example: y' = -1000y + 3000 - 2000 e^{-t}
def stiff_rhs(t, y): return [-1000*y[0] + 3000 - 2000*np.exp(-t)]
sol_stiff = solve_ivp(stiff_rhs, (0, 0.05), [0.0], method='Radau', rtol=1e-6)
print(f"\\nStiff problem solved with Radau: {sol_stiff.nfev} func evals")
`} />
    </div>
  );
}
