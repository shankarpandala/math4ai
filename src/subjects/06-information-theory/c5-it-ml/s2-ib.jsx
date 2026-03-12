import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function IBViz() {
  const [beta, setBeta] = useState(1.0)
  const [epoch, setEpoch] = useState(5)

  // Synthetic information plane trajectories for different β values
  // I(X;Z) = compression (x-axis), I(Z;Y) = prediction (y-axis)
  const generateTrajectory = (betaVal, nEpochs) => {
    const pts = []
    // Simulate: start at (H(X), 0), compress toward IB curve
    const ixMax = 3.5  // H(X)
    const iyMax = 1.2  // I(X;Y) = max achievable
    for (let t = 0; t <= nEpochs; t++) {
      const progress = t / Math.max(nEpochs, 1)
      // High beta: compress more, sacrifice some prediction
      const ix = ixMax * (1 - progress * 0.7 * (1 / betaVal))
      const iy = iyMax * (1 - Math.exp(-betaVal * progress * 1.5))
      pts.push({ t, ix: Math.max(0, ix), iy: Math.min(iyMax, iy) })
    }
    return pts
  }

  const betas = [0.5, 1.0, 2.0, 5.0]
  const trajectories = useMemo(() => betas.map(b => generateTrajectory(b, epoch)), [beta, epoch])

  // IB optimal curve (information plane boundary)
  const ibCurve = []
  for (let b = 0; b <= 5; b += 0.1) {
    const ix = 3.5 * Math.exp(-0.3 * b)
    const iy = 1.2 * (1 - Math.exp(-b * 0.8))
    ibCurve.push({ ix, iy })
  }

  const W = 380, H = 300
  const padL = 44, padR = 20, padT = 20, padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xMax = 4, yMax = 1.4

  const xToSvg = v => padL + (v / xMax) * plotW
  const yToSvg = v => padT + plotH - (v / yMax) * plotH

  const curvePath = ibCurve.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.ix).toFixed(1)},${yToSvg(d.iy).toFixed(1)}`).join(' ')

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Information Plane: I(X;Z) vs I(Z;Y)</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Training trajectories in the information plane. β controls compression-prediction tradeoff.
        Curve = IB optimal boundary.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Active β = {beta.toFixed(1)}</label>
          <input type="range" min="0.5" max="5" step="0.5" value={beta} onChange={e => setBeta(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Training epochs = {epoch}</label>
          <input type="range" min="1" max="20" step="1" value={epoch} onChange={e => setEpoch(+e.target.value)} className="w-full accent-emerald-500" />
        </div>
      </div>
      <div className="flex justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm">
          {/* Grid */}
          {[0, 1, 2, 3].map(v => (
            <g key={v}>
              <line x1={xToSvg(v)} y1={padT} x2={xToSvg(v)} y2={padT + plotH} stroke="#374151" strokeOpacity={0.15} strokeDasharray="3 3" />
              <text x={xToSvg(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          ))}
          {[0, 0.4, 0.8, 1.2].map(v => (
            <g key={v}>
              <line x1={padL} y1={yToSvg(v)} x2={padL + plotW} y2={yToSvg(v)} stroke="#374151" strokeOpacity={0.15} strokeDasharray="3 3" />
              <text x={padL - 4} y={yToSvg(v) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{v.toFixed(1)}</text>
            </g>
          ))}
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
          <text x={padL + plotW / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#6b7280">I(X;Z) bits</text>
          <text x={12} y={padT + plotH / 2} textAnchor="middle" fontSize="10" fill="#6b7280" transform={`rotate(-90, 12, ${padT + plotH / 2})`}>I(Z;Y) bits</text>
          {/* IB optimal curve */}
          <path d={curvePath} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 3" />
          <text x={xToSvg(3.0)} y={yToSvg(0.85)} fontSize="9" fill="#8b5cf6">IB curve</text>
          {/* Trajectories */}
          {trajectories.map((traj, bi) => {
            const path = traj.map((d, i) => `${i === 0 ? 'M' : 'L'}${xToSvg(d.ix).toFixed(1)},${yToSvg(d.iy).toFixed(1)}`).join(' ')
            const last = traj[traj.length - 1]
            return (
              <g key={bi}>
                <path d={path} fill="none" stroke={colors[bi]} strokeWidth={1.8} />
                <circle cx={xToSvg(last.ix)} cy={yToSvg(last.iy)} r={4} fill={colors[bi]} />
                <text x={xToSvg(last.ix) + 6} y={yToSvg(last.iy) + 3} fontSize="8" fill={colors[bi]}>β={betas[bi]}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy.special import xlogy

# Discrete Information Bottleneck via Blahut-Arimoto algorithm
def ib_blahut_arimoto(p_xy, beta, n_iter=100, tol=1e-6):
    """
    Solve the IB optimization: min I(X;Z) - beta * I(Z;Y)
    p_xy: joint distribution p(x,y), shape (|X|, |Y|)
    beta: Lagrange multiplier (compression tradeoff)
    Returns: p_z_given_x (encoder), I(X;Z), I(Z;Y)
    """
    nx, ny = p_xy.shape
    nz = nx  # |Z| <= |X|

    p_x = p_xy.sum(axis=1)
    p_y = p_xy.sum(axis=0)
    p_y_given_x = p_xy / (p_x[:, None] + 1e-15)

    # Initialize p(z|x) uniformly
    p_z_given_x = np.ones((nx, nz)) / nz

    for _ in range(n_iter):
        # p(z) = sum_x p(x) p(z|x)
        p_z = p_z_given_x.T @ p_x

        # p(y|z) = sum_x p(y|x) p(x|z) = sum_x p(y|x) p(z|x) p(x) / p(z)
        p_y_given_z = (p_z_given_x.T @ (p_y_given_x * p_x[:, None])) / (p_z[:, None] + 1e-15)

        # Update: p(z|x) ∝ p(z) exp(beta * KL(p(y|x) || p(y|z)))
        kl = np.zeros((nx, nz))
        for z in range(nz):
            kl[:, z] = np.sum(xlogy(p_y_given_x, p_y_given_x / (p_y_given_z[z] + 1e-15)), axis=1)

        log_p_z_given_x = np.log(p_z + 1e-15)[None, :] + beta * kl
        log_p_z_given_x -= log_p_z_given_x.max(axis=1, keepdims=True)
        p_z_given_x_new = np.exp(log_p_z_given_x)
        p_z_given_x_new /= p_z_given_x_new.sum(axis=1, keepdims=True)

        if np.abs(p_z_given_x_new - p_z_given_x).max() < tol:
            break
        p_z_given_x = p_z_given_x_new

    # Compute I(X;Z) and I(Z;Y)
    p_z = p_z_given_x.T @ p_x
    p_xz = p_z_given_x * p_x[:, None]
    I_XZ = np.sum(xlogy(p_xz, p_xz / (p_x[:, None] * p_z[None, :] + 1e-15)))

    p_y_given_z = (p_z_given_x.T @ p_y_given_x) / (p_z[:, None] + 1e-15)
    p_yz = p_y_given_z * p_z[:, None]
    I_ZY = np.sum(xlogy(p_yz, p_yz / (p_z[:, None] * p_y[None, :] + 1e-15)))

    return p_z_given_x, max(0, I_XZ), max(0, I_ZY)

# Example: correlated binary variables
p_xy = np.array([[0.4, 0.05], [0.05, 0.5]])
p_xy /= p_xy.sum()

print("Information Bottleneck Tradeoff Curve:")
print(f"{'beta':>6} {'I(X;Z)':>10} {'I(Z;Y)':>10}")
for beta in [0.1, 0.5, 1.0, 2.0, 5.0, 10.0]:
    _, ixz, izy = ib_blahut_arimoto(p_xy, beta)
    print(f"{beta:>6.1f} {ixz:>10.4f} {izy:>10.4f}")
`

export default function InformationBottleneck() {
  return (
    <div className="space-y-8">
      <NoteBlock title="The IB: Compression with Preservation">
        <p>
          The Information Bottleneck (IB) principle (Tishby, Pereira, Bialek 1999) provides a
          theoretical framework for finding the optimal tradeoff between compression and prediction:
          extract a representation Z of X that retains as much information about Y as possible
          while compressing X. This framework has been proposed as a lens for understanding
          deep learning.
        </p>
      </NoteBlock>

      <IBViz />

      <DefinitionBlock
        title="Information Bottleneck Objective"
        definition="Given the joint distribution $p(X,Y)$, the IB method finds a stochastic mapping $p(Z|X)$ (encoder) that forms the Markov chain $Y \to X \to Z$ and solves: $\min_{p(Z|X)} I(X;Z) - \beta \cdot I(Z;Y)$. The Lagrange multiplier $\beta \geq 0$ controls the tradeoff: small $\beta$ → compress heavily (small $I(X;Z)$), large $\beta$ → preserve prediction (large $I(Z;Y)$)."
        notation="The IB objective traces a curve in the information plane $(I(X;Z), I(Z;Y))$. Each point on the curve is an optimal solution for some $\beta$. The curve is monotone: more compression necessarily reduces prediction."
      />

      <DefinitionBlock
        title="IB Self-Consistent Equations"
        definition="The IB optimum satisfies the fixed-point equations: (1) $p(z|x) = \frac{p(z)}{Z(\beta,x)}\exp(-\beta D_{KL}(p(y|x)\|p(y|z)))$, (2) $p(z) = \sum_x p(x)p(z|x)$, (3) $p(y|z) = \sum_x p(y|x)p(x|z)$. These can be solved by the Blahut-Arimoto algorithm (iterate until convergence). The encoder assigns higher probability to $z$ that 'explains' $p(y|x)$ well."
        notation="For Gaussian variables: the optimal IB solution is Gaussian, and $Z$ is a noisy version of the linear MMSE estimate of $Y$ from $X$. The IB tradeoff curve is a segment of the capacity-distortion curve."
      />

      <TheoremBlock
        title="IB and Sufficient Statistics"
        statement="A representation $Z$ is a sufficient statistic of $X$ for $Y$ (i.e., $Y \perp X | Z$) if and only if $I(Z;Y) = I(X;Y)$ — maximum possible prediction. The IB curve ranges from the trivial encoder ($Z$ independent of $X$, $I(X;Z) = I(Z;Y) = 0$) to the sufficient statistic ($I(Z;Y) = I(X;Y)$, achieved at $\beta \to \infty$). The minimum sufficient statistic minimizes $I(X;Z)$ subject to $I(Z;Y) = I(X;Y)$."
        proof="If $Y \perp X | Z$, then by the data processing inequality $I(X;Y) \leq I(Z;Y)$. But $Z$ is a function of $X$, so $I(Z;Y) \leq I(X;Y)$ also holds. Therefore $I(Z;Y) = I(X;Y)$. Conversely, if $I(Z;Y) = I(X;Y)$, then $I(X;Y|Z) = I(X;Y) - I(Z;Y) + I(X;Z|Y) = I(X;Z|Y) \geq 0$. But also $0 \leq I(Y;X|Z) = I(X;Y) - I(Z;Y) = 0$, implying $Y \perp X|Z$."
      />

      <ExampleBlock title="IB and Deep Learning (Tishby & Schwartz-Ziv 2017)">
        <p>
          The controversial claim: deep neural networks trained with SGD naturally compress
          irrelevant information during training, tracing a path in the information plane.
          Early in training: rapid increase in <InlineMath math="I(Z;Y)" /> (fitting).
          Later: slow decrease in <InlineMath math="I(X;Z)" /> (compression via noise from SGD).
          This was proposed as a theory of generalization, though subsequent work showed the
          compression phase depends heavily on the activation function and is not universal.
        </p>
      </ExampleBlock>

      <WarningBlock title="IB for Continuous Variables is Ill-Defined">
        <p>
          For continuous variables, the IB objective with a deterministic encoder always gives
          <InlineMath math="I(X;Z) = \infty" /> unless the encoder is stochastic or regularized.
          This is why VAEs implicitly implement an IB: the ELBO penalizes <InlineMath math="D_{KL}(q(Z|X)\|p(Z))" />
          which upper-bounds <InlineMath math="I(X;Z)" /> (since <InlineMath math="\mathbb{E}[D_{KL}(q(z|x)\|p(z))] \geq I(X;Z)" />
          under the marginal prior). The IB-VAE explicitly optimizes the IB objective for
          learned representations.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
