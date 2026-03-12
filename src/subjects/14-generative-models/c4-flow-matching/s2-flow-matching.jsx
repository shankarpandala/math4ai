import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// Velocity Field Visualization (SVG arrows showing OT interpolation)
// ---------------------------------------------------------------------------

function FlowMatchingViz() {
  const [t, setT] = useState(0.5);
  const [otPath, setOtPath] = useState(true);

  // Source: Gaussian at (-1.5, 0), Target: Gaussian at (1.5, 0)
  // Straight-line (OT) path: x(t) = (1-t)*x0 + t*x1
  // velocity = x1 - x0 (constant along straight-line paths)

  const sourcePoints = [
    { x: -1.8, y: 0.4 }, { x: -1.5, y: 0.0 }, { x: -1.2, y: -0.4 },
    { x: -1.7, y: 0.8 }, { x: -1.3, y: 0.6 }, { x: -1.9, y: -0.2 },
    { x: -1.1, y: 0.2 }, { x: -1.6, y: -0.6 },
  ];
  const targetPoints = [
    { x: 1.8, y: 0.4 }, { x: 1.5, y: 0.0 }, { x: 1.2, y: -0.4 },
    { x: 1.7, y: 0.8 }, { x: 1.3, y: 0.6 }, { x: 1.9, y: -0.2 },
    { x: 1.1, y: 0.2 }, { x: 1.6, y: -0.6 },
  ];

  const svgW = 420;
  const svgH = 280;
  const xMin = -3, xMax = 3, yMin = -2, yMax = 2;
  function tx(x) { return ((x - xMin) / (xMax - xMin)) * svgW; }
  function ty(y) { return svgH - ((y - yMin) / (yMax - yMin)) * svgH; }

  // Current interpolated positions
  const interpPoints = sourcePoints.map((s, i) => {
    const tgt = targetPoints[i];
    return {
      x: (1 - t) * s.x + t * tgt.x,
      y: (1 - t) * s.y + t * tgt.y,
      vx: tgt.x - s.x,
      vy: tgt.y - s.y,
    };
  });

  // Background velocity field grid
  const VGRID = 7;
  const velArrows = [];
  for (let i = 0; i <= VGRID; i++) {
    for (let j = 0; j <= VGRID; j++) {
      const gx = xMin + (i / VGRID) * (xMax - xMin);
      const gy = yMin + (j / VGRID) * (yMax - yMin);
      // OT velocity field: constant horizontal drift (simplified)
      const vx = otPath ? 3.0 : (3.0 + 0.5 * Math.sin(gy * 2));
      const vy = otPath ? 0 : (0.3 * Math.cos(gx));
      const vmag = Math.sqrt(vx * vx + vy * vy);
      velArrows.push({ gx, gy, vx: vx / vmag, vy: vy / vmag, mag: vmag });
    }
  }

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Flow Matching — Velocity Field & OT Interpolation
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag <InlineMath math="t" /> to see particles flow from source (blue) to target (green).
        Arrows show the velocity field <InlineMath math="v_t(x)" /> the network learns to approximate.
      </p>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="w-8 text-sm font-medium text-gray-700 dark:text-gray-300">t</label>
          <input type="range" min={0} max={1} step={0.01} value={t}
            onChange={(e) => setT(parseFloat(e.target.value))}
            className="h-2 flex-1 accent-emerald-500" />
          <span className="w-10 text-right font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{t.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setOtPath(true)}
            className={`rounded px-3 py-1 text-sm ${otPath ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            OT (straight) paths
          </button>
          <button onClick={() => setOtPath(false)}
            className={`rounded px-3 py-1 text-sm ${!otPath ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
            Curved paths
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH}
          className="mx-auto block rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
          {/* Velocity arrows */}
          {velArrows.map((a, i) => {
            const scale = 18;
            const x1 = tx(a.gx), y1 = ty(a.gy);
            const x2 = x1 + a.vx * scale;
            const y2 = y1 - a.vy * scale;
            return (
              <g key={i} opacity={0.35}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6b7280" strokeWidth={1} />
                <polygon
                  points={`${x2},${y2} ${x2 - a.vx * 5 - a.vy * 2.5},${y2 + a.vy * 5 - a.vx * 2.5} ${x2 - a.vx * 5 + a.vy * 2.5},${y2 + a.vy * 5 + a.vx * 2.5}`}
                  fill="#6b7280"
                />
              </g>
            );
          })}
          {/* Trajectory lines */}
          {sourcePoints.map((s, i) => {
            const tgt = targetPoints[i];
            return (
              <line key={i}
                x1={tx(s.x)} y1={ty(s.y)}
                x2={tx(tgt.x)} y2={ty(tgt.y)}
                stroke="#d1d5db" strokeWidth={0.8} strokeDasharray="3,3" />
            );
          })}
          {/* Source points */}
          {sourcePoints.map((p, i) => (
            <circle key={i} cx={tx(p.x)} cy={ty(p.y)} r={5} fill="#3b82f6" opacity={1 - t} />
          ))}
          {/* Target points */}
          {targetPoints.map((p, i) => (
            <circle key={i} cx={tx(p.x)} cy={ty(p.y)} r={5} fill="#22c55e" opacity={t} />
          ))}
          {/* Interpolated points */}
          {interpPoints.map((p, i) => (
            <g key={i}>
              <circle cx={tx(p.x)} cy={ty(p.y)} r={6}
                fill={`rgb(${Math.round(59 + (34-59)*t)}, ${Math.round(130 + (197-130)*t)}, ${Math.round(246 + (94-246)*t)})`}
                stroke="white" strokeWidth={1.5} />
              {/* Velocity arrow at particle */}
              <line
                x1={tx(p.x)} y1={ty(p.y)}
                x2={tx(p.x + p.vx * 0.12)} y2={ty(p.y + p.vy * 0.12)}
                stroke="#ef4444" strokeWidth={1.8} />
            </g>
          ))}
          {/* Labels */}
          <text x={tx(-1.5)} y={ty(1.3)} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight="bold">Source p₀</text>
          <text x={tx(1.5)} y={ty(1.3)} textAnchor="middle" fontSize={10} fill="#22c55e" fontWeight="bold">Target p₁</text>
          <text x={svgW / 2} y={svgH - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">t={t.toFixed(2)}</text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const FM_CODE = `import torch
import torch.nn as nn
from torchdiffeq import odeint   # pip install torchdiffeq

class VelocityField(nn.Module):
    """Time-conditioned velocity field v_theta(x, t)."""
    def __init__(self, dim=2, hidden=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(dim + 1, hidden), nn.SiLU(),
            nn.Linear(hidden, hidden),  nn.SiLU(),
            nn.Linear(hidden, dim),
        )
    def forward(self, x, t):
        t_emb = t.view(-1, 1).expand(x.size(0), 1)
        return self.net(torch.cat([x, t_emb], dim=1))

def conditional_flow_matching_loss(model, x0, x1):
    """
    Conditional Flow Matching (Lipman et al., 2022):
    - OT path: x_t = (1-t)*x0 + t*x1 (optimal transport straight lines)
    - Conditional velocity: u_t(x|x0,x1) = x1 - x0 (constant)
    - Loss: E_t E_{x0,x1} ||v_theta(x_t, t) - (x1 - x0)||^2
    """
    bsz = x0.size(0)
    t = torch.rand(bsz, device=x0.device)   # t ~ Uniform[0,1]

    # Interpolate along straight-line OT path
    x_t = (1 - t.view(-1, 1)) * x0 + t.view(-1, 1) * x1

    # Target velocity (constant for straight paths)
    u_t = x1 - x0

    # Predict velocity field
    v_pred = model(x_t, t)

    return nn.functional.mse_loss(v_pred, u_t)


@torch.no_grad()
def sample_flow(model, n, dim=2, T=100, device='cpu'):
    """
    Generate samples by integrating the ODE:
        dx/dt = v_theta(x, t),  x(0) ~ N(0, I)
    Using Euler integration (or odeint for better accuracy).
    """
    x = torch.randn(n, dim, device=device)
    dt = 1.0 / T

    for i in range(T):
        t = torch.full((n,), i / T, device=device)
        v = model(x, t)
        x = x + dt * v   # Euler step

    return x   # x(1) ~ p_data


# --- For continuous ODE sampling with adaptive solver ---
# def ode_func(t, x):
#     t_batch = t.expand(x.size(0))
#     return model(x, t_batch)
# x_gen = odeint(ode_func, x0_noise, torch.tensor([0., 1.]), method='dopri5')[-1]
`;

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FlowMatching() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Flow Matching
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Flow matching learns a continuous normalizing flow by regressing a neural network
          velocity field against conditional vector fields derived from optimal transport paths,
          providing a simulation-free, scalable alternative to continuous normalizing flows.
        </p>
      </div>

      <NoteBlock type="historical">
        <p>
          Flow matching was introduced simultaneously by <strong>Lipman et al. (2022)</strong>
          (Conditional Flow Matching), <strong>Liu et al. (2022)</strong> (Rectified Flow),
          and <strong>Albergo & Vanden-Eijnden (2022)</strong> (Stochastic Interpolants).
          The key insight: instead of computing expensive likelihood traces (continuous NFs),
          or denoising scores at many noise levels (diffusion), flow matching directly regresses
          the velocity field. Meta's <strong>Voicebox</strong> and <strong>Stable Audio</strong>
          use flow matching; it underlies Stable Diffusion 3.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.1"
        title="Continuous Normalizing Flow (CNF)"
        definition="A continuous normalizing flow defines a time-indexed diffeomorphism $\phi_t: \mathcal{X} \to \mathcal{X}$ via an ODE: $\frac{d\phi_t(x)}{dt} = v_t(\phi_t(x))$ with $\phi_0 = \mathrm{id}$. Starting from $x_0 \sim p_0$ (e.g., Gaussian), samples at time $t=1$ follow $p_1 = \phi_{1\#}p_0$ (pushforward). The density evolves by the continuity equation: $\frac{\partial p_t}{\partial t} + \nabla \cdot (v_t p_t) = 0$."
        notation="The pushforward $\phi_{1\#}p_0$ means: if $x_0 \sim p_0$, then $\phi_1(x_0) \sim p_1$. CNFs are more expressive than discrete flows (no restriction on architecture) but naively require expensive ODE integration and trace computation for training."
      />

      <DefinitionBlock
        label="Definition 1.2"
        title="Flow Matching Objective"
        definition="Flow matching (FM) trains a velocity field $v_\theta: \mathcal{X} \times [0,1] \to \mathcal{X}$ to match a target vector field $u_t$ that generates the marginal probability path $p_t$ from $p_0$ to $p_1$: $\mathcal{L}_\mathrm{FM} = \mathbb{E}_{t,x_t}\!\left[\|v_\theta(x_t, t) - u_t(x_t)\|^2\right]$. The marginal vector field $u_t(x)$ is generally intractable, but conditional flow matching avoids this by conditioning on individual sample pairs."
        notation="$p_t$ is the marginal density at time $t$ interpolating between source $p_0$ and target $p_1$. Samples $x_t \sim p_t$ are drawn via the interpolation $x_t = (1-t)x_0 + tx_1$ for coupled $(x_0, x_1)$. The conditional velocity $u_t(x|x_0,x_1) = x_1 - x_0$ is the straight-line velocity."
      />

      <DefinitionBlock
        label="Definition 1.3"
        title="Optimal Transport (OT) Conditional Flow Matching"
        definition="OT-CFM couples source and target samples $(x_0, x_1)$ via the optimal transport map (minimizing expected squared distance), using straight-line paths $x_t = (1-t)x_0 + tx_1$ with constant velocity $u_t(x_t|x_0,x_1) = x_1 - x_0$. The OT-CFM objective is: $\mathcal{L}_\mathrm{OT-CFM} = \mathbb{E}_{t,x_0,x_1}\!\left[\|v_\theta((1-t)x_0 + tx_1, t) - (x_1-x_0)\|^2\right]$ where $(x_0,x_1)$ are OT-coupled."
        notation="OT coupling minimizes $\mathbb{E}[\|x_0-x_1\|^2]$ subject to correct marginals. For Gaussian source, this is the Bures metric. Straight paths are optimal (no unnecessary curvature), leading to faster ODE integration at inference. In practice, mini-batch OT approximations (e.g., Sinkhorn) are used."
      />

      <TheoremBlock
        label="Theorem 1.1"
        title="Conditional Flow Matching = Marginal Flow Matching"
        statement="The conditional flow matching objective $\mathcal{L}_\mathrm{CFM} = \mathbb{E}_{t,x_0,x_1}\!\left[\|v_\theta(x_t,t) - u_t(x_t|x_0,x_1)\|^2\right]$ has the same gradient w.r.t. $\theta$ as the marginal flow matching objective $\mathcal{L}_\mathrm{FM} = \mathbb{E}_{t,x_t}\!\left[\|v_\theta(x_t,t) - u_t(x_t)\|^2\right]$, making CFM a valid training objective for learning the marginal velocity field."
        proof="Expand $\mathcal{L}_\mathrm{CFM} = \mathbb{E}[\|v_\theta\|^2] - 2\mathbb{E}[v_\theta \cdot u_t(x|x_0,x_1)] + \mathbb{E}[\|u_t\|^2]$. Taking the gradient w.r.t. $\theta$: $\nabla_\theta \mathcal{L}_\mathrm{CFM} = 2\mathbb{E}[\nabla_\theta v_\theta (v_\theta - u_t(x|x_0,x_1))]$. Similarly for $\mathcal{L}_\mathrm{FM}$: $\nabla_\theta \mathcal{L}_\mathrm{FM} = 2\mathbb{E}[\nabla_\theta v_\theta(v_\theta - u_t(x))]$. Since $u_t(x) = \mathbb{E}[u_t(x|x_0,x_1)|x_t=x]$ (the conditional expectation), and $\mathbb{E}[\nabla_\theta v_\theta(u_t(x) - u_t(x|x_0,x_1))|x_t] = \nabla_\theta v_\theta \cdot 0$, the gradients are equal. $\square$"
        corollaries={[
          "This justifies training with easy-to-compute conditional objectives (pairs of source/target samples) while learning the hard-to-compute marginal velocity field.",
          "Unlike continuous NFs (which require expensive ODE simulation + trace computation during training), CFM is simulation-free: just sample $t$, interpolate, and regress.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.2"
        title="Rectified Flow = Flow Matching with Straight Paths"
        statement="Rectified Flow (Liu et al., 2022) uses straight-line paths without OT coupling: sample $(x_0, x_1)$ independently from $p_0$ and $p_1$, interpolate $x_t = (1-t)x_0 + tx_1$, and minimize $\|v_\theta(x_t,t) - (x_1-x_0)\|^2$. The 'reflow' procedure (iterating by coupling with the learned flow) progressively straightens the paths, approaching OT."
        proof="The learned velocity field $v_\theta$ induces a coupling: pairs $(x_0, v_\theta(x_0, 0)) \approx (x_0, x_1)$. Retraining on the new coupling straightens trajectories (reduces transport cost). In the limit of infinite reflow iterations, the coupling approaches the OT plan — each trajectory is straight and non-crossing. The proof follows from the Benamou-Brenier theorem: the OT map minimizes kinetic energy $\int_0^1 \mathbb{E}[\|v_t(x)\|^2]\,dt$, achieved by straight paths. $\square$"
        corollaries={[
          "Straight paths allow fewer ODE steps at inference. A 2-step rectified flow achieves comparable quality to 100-step DDPM — a 50× speedup.",
          "Stable Diffusion 3 uses rectified flow with a modified noise schedule (logit-normal $t$ sampling) for better high-resolution generation.",
        ]}
      />

      <FlowMatchingViz />

      <ExampleBlock
        title="Flow Matching on 2D Half-Moon Distribution"
        problem="Source: $p_0 = \mathcal{N}(0,I)$. Target: half-moon shape. Train a flow matching model and describe the velocity field at $t=0.5$."
        difficulty="advanced"
        solution={[
          {
            step: 'Sample paired data for training',
            explanation: 'Draw x0 ~ N(0,I) and x1 ~ half-moon independently. For OT-CFM, solve min-cost matching within mini-batches (Sinkhorn algorithm). For plain CFM, just pair randomly.',
          },
          {
            step: 'Interpolate and compute velocity target',
            formula: 'x_t = (1-t)\\,x_0 + t\\,x_1, \\quad u_t = x_1 - x_0',
            explanation: 'At t=0.5, x_t is the midpoint between source and target sample. The velocity u_t = x_1 - x_0 is the constant straight-line velocity.',
          },
          {
            step: 'Train velocity network to minimize CFM loss',
            formula: '\\mathcal{L} = \\|v_\\theta(x_t, 0.5) - (x_1-x_0)\\|^2',
            explanation: 'After training, v_theta at t=0.5 points toward the half-moon from wherever the particle currently is.',
          },
          {
            step: 'Inference: integrate ODE from t=0 to t=1',
            formula: 'x(t+\\Delta t) = x(t) + \\Delta t \\cdot v_\\theta(x(t), t), \\quad x(0) \\sim \\mathcal{N}(0,I)',
            explanation: 'With 20-50 Euler steps (or fewer with Runge-Kutta), this transforms Gaussian noise into half-moon shaped samples.',
          },
        ]}
      />

      <WarningBlock title="Flow Matching Practical Considerations">
        <ul className="space-y-2 text-sm">
          <li><strong>Crossing trajectories:</strong> Without OT coupling, individual paths may cross (different source points flowing to similar target regions). This creates high-curvature velocity fields, requiring more ODE steps. OT-CFM or reflow reduces crossings.</li>
          <li><strong>Mini-batch OT approximation:</strong> Exact OT coupling requires solving a global assignment problem — expensive for large batches. Mini-batch OT (Sinkhorn) approximates this but introduces bias. For Gaussian sources, the OT map is the identity to the Wasserstein barycenter.</li>
          <li><strong>Timestep weighting:</strong> Uniform $t \sim U[0,1]$ may under-sample the critical early timesteps (near $t=0$, where curvature is highest). Logit-normal sampling (Stable Diffusion 3) concentrates samples near the middle where velocity fields are most informative.</li>
        </ul>
      </WarningBlock>

      <PythonCode
        code={FM_CODE}
        language="python"
        title="Conditional Flow Matching — PyTorch Training and Sampling"
        runnable
      />
    </div>
  );
}
