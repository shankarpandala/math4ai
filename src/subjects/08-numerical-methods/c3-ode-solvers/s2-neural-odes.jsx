import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// Simulate a spiral hidden state trajectory
// dh/dt = f(h, t) where f is a rotation + contraction
// h(t) = r(t) * [cos(omega*t + phi), sin(omega*t + phi)]

function spiralTrajectory(h0, omega = 1.5, gamma = 0.3, T = 6, nSteps = 120) {
  const dt = T / nSteps;
  const traj = [{ t: 0, x: h0[0], y: h0[1] }];
  let x = h0[0], y = h0[1];
  for (let i = 0; i < nSteps; i++) {
    const t = i * dt;
    const dx = omega * (-y) - gamma * x;
    const dy = omega * x - gamma * y;
    x += dx * dt;
    y += dy * dt;
    traj.push({ t: (i + 1) * dt, x, y });
  }
  return traj;
}

function InteractiveNeuralODE() {
  const [omega, setOmega] = useState(1.5);
  const [gamma, setGamma] = useState(0.3);
  const [showT, setShowT] = useState(100);

  const h0s = [
    [1.5, 0.0],
    [0.0, 1.5],
    [-1.5, 0.0],
    [0.0, -1.5],
    [1.0, 1.0],
  ];

  const trajectories = h0s.map(h0 => spiralTrajectory(h0, omega, gamma));
  const colors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];

  const W = 380, H = 300, CX = 190, CY = 150;
  const SCALE = 80;

  function toSvg(x, y) {
    return { sx: CX + x * SCALE, sy: CY - y * SCALE };
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Interactive: Neural ODE Hidden State Trajectory</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Hidden state <InlineMath math="h(t)" /> evolves as <InlineMath math="\dot h = f_\theta(h,t)" /> (spiral dynamics).
        Adjust <InlineMath math="\omega" /> (rotation) and <InlineMath math="\gamma" /> (decay).
        Each color is a different initial condition.
      </p>
      <div className="flex flex-wrap gap-4 items-start">
        <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Axes */}
          <line x1={PAD_SZ} y1={CY} x2={W - PAD_SZ} y2={CY} stroke="#e5e7eb" strokeWidth="1" />
          <line x1={CX} y1={PAD_SZ} x2={CX} y2={H - PAD_SZ} stroke="#e5e7eb" strokeWidth="1" />
          {/* Trajectories */}
          {trajectories.map((traj, j) => {
            const visTraj = traj.slice(0, showT + 1);
            const pathPts = visTraj.map(({ x, y }) => {
              const { sx, sy } = toSvg(x, y);
              return `${sx},${sy}`;
            }).join(' ');
            const last = visTraj[visTraj.length - 1];
            const { sx: lx, sy: ly } = toSvg(last.x, last.y);
            const first = traj[0];
            const { sx: fx, sy: fy } = toSvg(first.x, first.y);
            return (
              <React.Fragment key={j}>
                {pathPts.length > 3 && <polyline points={pathPts} fill="none" stroke={colors[j]} strokeWidth="2" opacity="0.85" />}
                {/* Start marker */}
                <circle cx={fx} cy={fy} r="5" fill={colors[j]} opacity="0.5" />
                {/* End marker */}
                <circle cx={lx} cy={ly} r="4" fill={colors[j]} />
              </React.Fragment>
            );
          })}
          {/* Fixed point at origin */}
          <circle cx={CX} cy={CY} r="6" fill="#374151" />
          <text x={CX + 8} y={CY - 6} fontSize="10" fill="#374151">fixed point</text>
          <text x={PAD_SZ + 4} y={PAD_SZ + 14} fontSize="10" fill="#374151">h₁</text>
        </svg>
        <div className="flex flex-col gap-4 min-w-[180px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rotation <InlineMath math={`\\omega = ${omega.toFixed(2)}`} />
            </label>
            <input type="range" min="0.2" max="3" step="0.1" value={omega} onChange={e => setOmega(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Decay <InlineMath math={`\\gamma = ${gamma.toFixed(2)}`} />
            </label>
            <input type="range" min="0" max="1.5" step="0.05" value={gamma} onChange={e => setGamma(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time t = {(showT / 20).toFixed(1)}
            </label>
            <input type="range" min="1" max="120" step="1" value={showT} onChange={e => setShowT(+e.target.value)} className="w-full" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            γ = 0 → closed orbit (limit cycle)<br />
            γ &gt; 0 → spiral to origin (stable)<br />
            γ &lt; 0 → spiral away (unstable)
          </p>
        </div>
      </div>
    </div>
  );
}

const PAD_SZ = 20;

export default function NeuralODEs() {
  return (
    <div className="space-y-8">
      <InteractiveNeuralODE />

      <DefinitionBlock title="Neural ODE">
        <p>
          A <strong>Neural ODE</strong> (Chen et al., 2018) parameterizes the derivative of a
          hidden state with a neural network:
        </p>
        <BlockMath math="\frac{dh(t)}{dt} = f_\theta(h(t), t), \quad h(t_0) = h_0." />
        <p className="mt-2">
          The output at time <InlineMath math="T" /> is <InlineMath math="h(T) = h_0 + \int_{t_0}^T f_\theta(h(t), t)\, dt" />,
          computed via an ODE solver. This is a <em>continuous-depth</em> analogue of a
          residual network (where each ResNet layer corresponds to one Euler step).
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Adjoint Method for Backpropagation">
        <p>
          Training requires <InlineMath math="\partial \mathcal{L} / \partial \theta" /> where
          <InlineMath math="\mathcal{L} = L(h(T))" />. The <strong>adjoint method</strong> avoids
          storing intermediate states (memory-efficient backprop through an ODE solver):
        </p>
        <BlockMath math="\frac{da(t)}{dt} = -a(t)^\top \frac{\partial f_\theta}{\partial h}, \quad a(T) = \frac{\partial L}{\partial h(T)}." />
        <p className="mt-2">
          The gradient w.r.t. parameters is obtained by integrating backwards:
        </p>
        <BlockMath math="\frac{\partial \mathcal{L}}{\partial \theta} = -\int_{T}^{t_0} a(t)^\top \frac{\partial f_\theta(h(t),t)}{\partial \theta}\, dt." />
      </DefinitionBlock>

      <DefinitionBlock title="Latent ODEs and Continuous-Time Models">
        <p>
          <strong>Latent ODEs</strong> model irregularly-sampled time series by encoding
          observations to an initial latent state <InlineMath math="z_0" /> and decoding the
          ODE trajectory:
        </p>
        <BlockMath math="z(t) = z_0 + \int_0^t f_\theta(z(s))\, ds, \quad \hat{x}(t_i) = g_\phi(z(t_i))." />
        <p className="mt-2">
          The ELBO is optimized by computing the reconstruction at observed times
          <InlineMath math="t_1, \ldots, t_n" /> and the KL divergence on <InlineMath math="z_0" />.
        </p>
      </DefinitionBlock>

      <TheoremBlock
        title="Neural ODE as Continuous ResNet"
        proof="A ResNet with residual connections h_{k+1} = h_k + f(h_k) can be viewed as Euler's method applied to dh/dt = f(h) with step size h=1. As the number of layers increases and depth is treated as continuous time, the ResNet converges to a Neural ODE in a well-defined sense (Euler method approximation)."
      >
        <p>
          The Euler-discretized Neural ODE:
        </p>
        <BlockMath math="h_{k+1} = h_k + h \cdot f_\theta(h_k, t_k)" />
        <p className="mt-2">
          is equivalent to a <em>ResNet</em> with shared weights and step size <InlineMath math="h=1" />.
          Taking <InlineMath math="h \to 0" /> (infinite layers) recovers the continuous Neural ODE.
          This connection motivates using adaptive ODE solvers — they automatically determine the
          effective number of layers needed.
        </p>
      </TheoremBlock>

      <TheoremBlock
        title="Adjoint Sensitivity Method"
        proof="Consider the Lagrangian: L = ∫ a(t)⊤(ḣ - f_θ(h,t))dt + L(h(T)). Variation with respect to h gives the adjoint ODE ȧ = -a⊤∂f/∂h. Variation with respect to θ gives the gradient formula. This is equivalent to the method of characteristics for the HJB equation in optimal control."
      >
        <p>
          The adjoint method computes gradients at <strong>O(1) memory</strong> (independent of
          number of solver steps) by augmenting the backward ODE:
        </p>
        <BlockMath math="\frac{d}{dt}\begin{pmatrix} h \\ a \\ \partial\mathcal{L}/\partial\theta \end{pmatrix} = \begin{pmatrix} f_\theta(h,t) \\ -a^\top \partial f/\partial h \\ -a^\top \partial f/\partial \theta \end{pmatrix}," />
        <p className="mt-2">
          solved backwards from <InlineMath math="t=T" /> to <InlineMath math="t=0" />.
        </p>
      </TheoremBlock>

      <ExampleBlock title="Neural ODE for Time Series">
        <p>
          For irregularly-sampled clinical data (e.g., ICU vitals with missing measurements),
          Latent ODEs model the continuous latent state and predict at arbitrary query times.
          The ODE-RNN encoder handles variable spacing between observations by using an ODE
          between each observation:
        </p>
        <BlockMath math="z_{t_i} = \text{ODE-Solve}(z_{t_{i-1}}, t_{i-1}, t_i), \quad z_{t_i^+} = \text{RNN}(z_{t_i}, x_{t_i})." />
      </ExampleBlock>

      <WarningBlock title="Adjoint Method Has Numerical Issues for Stiff ODEs">
        <p>
          The adjoint ODE is solved <em>backwards</em> in time, which can be numerically
          unstable if the forward ODE is stiff or has sensitive dependence on initial conditions.
          In practice, <strong>checkpointing</strong> (storing intermediate states at regular
          intervals and recomputing forward passes as needed) provides a compromise between
          memory efficiency and numerical stability. Libraries like <code>torchdiffeq</code>
          implement both adjoint and checkpointed backpropagation.
        </p>
      </WarningBlock>

      <PythonCode code={`import torch
import torch.nn as nn

# Neural ODE using torchdiffeq (install: pip install torchdiffeq)
# We show the structure without the library dependency

class ODEFunc(nn.Module):
    """Defines dh/dt = f_theta(h, t)."""
    def __init__(self, hidden_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(hidden_dim, 64),
            nn.Tanh(),
            nn.Linear(64, 64),
            nn.Tanh(),
            nn.Linear(64, hidden_dim),
        )
        self.nfe = 0  # number of function evaluations

    def forward(self, t, h):
        self.nfe += 1
        return self.net(h)

class NeuralODE(nn.Module):
    def __init__(self, hidden_dim, output_dim):
        super().__init__()
        self.odefunc = ODEFunc(hidden_dim)
        self.readout = nn.Linear(hidden_dim, output_dim)

    def forward(self, h0, t_eval):
        # In practice: h = odeint(self.odefunc, h0, t_eval, method='rk4')
        # Here we use Euler for demonstration
        h = h0
        dt = t_eval[1] - t_eval[0]
        states = [h]
        for t in t_eval[:-1]:
            dh = self.odefunc(t, h)
            h = h + dt * dh
            states.append(h)
        return torch.stack(states, dim=1)  # (batch, time, dim)

    def predict(self, h0, t_eval):
        trajectory = self.forward(h0, t_eval)
        return self.readout(trajectory[:, -1, :])  # read out at final time

# Example usage
hidden_dim, output_dim = 16, 2
model = NeuralODE(hidden_dim, output_dim)

batch_size = 8
h0 = torch.randn(batch_size, hidden_dim)
t_eval = torch.linspace(0, 1, 20)

trajectory = model.forward(h0, t_eval)
print(f"Trajectory shape: {trajectory.shape}")  # (8, 20, 16)

predictions = model.predict(h0, t_eval)
print(f"Predictions shape: {predictions.shape}")  # (8, 2)

# Count NFE (a measure of computational cost)
print(f"Number of function evaluations: {model.odefunc.nfe}")

# Adjoint gradient (in practice via torchdiffeq):
# from torchdiffeq import odeint_adjoint as odeint
# h = odeint(func, h0, t_eval, method='rk4', adjoint_params=func.parameters())
# loss = criterion(h[-1], targets)
# loss.backward()  # computes grad via adjoint method, O(1) memory
`} />
    </div>
  );
}
