import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function MutualInformationViz() {
  const [rho, setRho] = useState(0.5)

  // MI for bivariate Gaussian: I(X;Y) = -0.5 * log(1 - rho^2)
  const mi = -0.5 * Math.log(1 - rho * rho)
  const miNats = mi
  const miBits = mi / Math.log(2)

  // Generate correlated Gaussian scatter points (deterministic via seeded pattern)
  const points = useMemo(() => {
    const pts = []
    const n = 60
    for (let i = 0; i < n; i++) {
      // Deterministic quasi-random via van der Corput
      const t = (i + 0.5) / n
      const u1 = Math.sin(i * 2.399963229728653) * 0.5 + 0.5
      const u2 = Math.cos(i * 3.141592653589793) * 0.5 + 0.5
      const z1 = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2)
      const z2 = Math.sqrt(-2 * Math.log(Math.max(1 - u1, 0.001))) * Math.sin(2 * Math.PI * u2)
      const x = z1
      const y = rho * z1 + Math.sqrt(1 - rho * rho) * z2
      pts.push({ x, y })
    }
    return pts
  }, [rho])

  const W = 280, H = 280
  const padL = 24, padR = 16, padT = 16, padB = 24
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xMin = -3, xMax = 3

  const xToSvg = v => padL + ((v - xMin) / (xMax - xMin)) * plotW
  const yToSvg = v => padT + plotH - ((v - xMin) / (xMax - xMin)) * plotH

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Bivariate Gaussian: MI vs Correlation</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        For bivariate Gaussian: <InlineMath math="I(X;Y) = -\frac{1}{2}\ln(1-\rho^2)" />
      </p>
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Correlation ρ = {rho.toFixed(2)}</label>
        <input type="range" min="-0.99" max="0.99" step="0.01" value={rho} onChange={e => setRho(+e.target.value)} className="w-full accent-indigo-600" />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs">
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
            <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#9ca3af" strokeWidth={1.5} />
            <line x1={xToSvg(0)} y1={padT} x2={xToSvg(0)} y2={padT + plotH} stroke="#6b7280" strokeWidth={0.5} strokeOpacity={0.5} />
            <line x1={padL} y1={yToSvg(0)} x2={W - padR} y2={yToSvg(0)} stroke="#6b7280" strokeWidth={0.5} strokeOpacity={0.5} />
            {points.map((p, i) => (
              <circle key={i} cx={xToSvg(p.x)} cy={yToSvg(p.y)} r={3} fill="#6366f1" opacity={0.6} />
            ))}
            <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">X</text>
            <text x={10} y={padT + plotH / 2} textAnchor="middle" fontSize="10" fill="#6b7280" transform={`rotate(-90, 10, ${padT + plotH / 2})`}>Y</text>
          </svg>
        </div>
        <div className="grid grid-cols-1 gap-3 text-center text-xs">
          <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <div className="font-mono text-2xl font-bold text-indigo-600">{miNats.toFixed(4)}</div>
            <div className="text-gray-500">I(X;Y) nats</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="font-mono text-2xl font-bold text-purple-600">{miBits.toFixed(4)}</div>
            <div className="text-gray-500">I(X;Y) bits</div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <div className="font-mono text-lg font-bold text-emerald-600">{Math.abs(rho).toFixed(2)}</div>
            <div className="text-gray-500">|ρ| = |Corr|</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy.stats import entropy

# MI for discrete distributions
def mutual_information_discrete(joint_prob):
    """Compute I(X;Y) from joint probability table."""
    p_x = joint_prob.sum(axis=1)
    p_y = joint_prob.sum(axis=0)
    mi = 0
    for i in range(len(p_x)):
        for j in range(len(p_y)):
            if joint_prob[i, j] > 0:
                mi += joint_prob[i, j] * np.log(joint_prob[i, j] / (p_x[i] * p_y[j]))
    return mi

# Example: binary variables
p_xy = np.array([[0.4, 0.1], [0.1, 0.4]])
mi = mutual_information_discrete(p_xy)
h_x = entropy(p_xy.sum(1), base=np.e)
h_y = entropy(p_xy.sum(0), base=np.e)
h_xy = entropy(p_xy.flatten(), base=np.e)
print(f"I(X;Y) = {mi:.4f} = H(X) + H(Y) - H(X,Y) = {h_x + h_y - h_xy:.4f}")

# MI for bivariate Gaussian
def mi_bivariate_gaussian(rho):
    return -0.5 * np.log(1 - rho**2)

for rho in [0, 0.3, 0.6, 0.9, 0.99]:
    print(f"rho={rho:.2f}: I = {mi_bivariate_gaussian(rho):.4f} nats, "
          f"{mi_bivariate_gaussian(rho)/np.log(2):.4f} bits")

# MINE: Mutual Information Neural Estimator (Belghazi et al., 2018)
# I(X;Y) >= sup_T E[T(X,Y)] - log E[e^T(X,Y')] where Y' ~ p(Y)
import torch
import torch.nn as nn

class MINENetwork(nn.Module):
    def __init__(self, d=2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d, 64), nn.ReLU(),
            nn.Linear(64, 64), nn.ReLU(),
            nn.Linear(64, 1)
        )
    def forward(self, x):
        return self.net(x)

# Simulate correlated data
rho = 0.8
n = 1000
z = torch.randn(n, 2)
L = torch.tensor([[1, 0], [rho, np.sqrt(1 - rho**2)]])  # Cholesky
xy = (L @ z.T).T

mine = MINENetwork(d=2)
optimizer = torch.optim.Adam(mine.parameters(), lr=1e-3)

for step in range(500):
    idx = torch.randperm(n)
    xy_shuffle = torch.stack([xy[:, 0], xy[idx, 1]], dim=1)
    t_joint = mine(xy).mean()
    t_marginal = torch.log(mine(xy_shuffle).exp().mean())
    loss = -(t_joint - t_marginal)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

true_mi = mi_bivariate_gaussian(rho)
mine_est = (mine(xy).mean() - torch.log(mine(xy[torch.randperm(n)]).exp().mean())).item()
print(f"\\nMINE estimate: {mine_est:.4f}, True: {true_mi:.4f}")
`

export default function MutualInformation() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Mutual Information: Shared Randomness">
        <p>
          Mutual information measures how much information two random variables share.
          Unlike correlation, MI captures all statistical dependence (including nonlinear).
          MI = 0 iff X and Y are independent; otherwise it quantifies the reduction in
          uncertainty about Y given knowledge of X.
        </p>
      </NoteBlock>

      <MutualInformationViz />

      <DefinitionBlock
        title="Mutual Information"
        definition="The mutual information between $X$ and $Y$ is: $I(X;Y) = \sum_{x,y} p(x,y)\log\frac{p(x,y)}{p(x)p(y)} = D_{KL}(p(X,Y) \| p(X)p(Y))$. Equivalently: $I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X,Y)$. For bivariate Gaussian with correlation $\rho$: $I(X;Y) = -\frac{1}{2}\log(1-\rho^2)$."
        notation="MI is symmetric: $I(X;Y) = I(Y;X)$. It satisfies $0 \leq I(X;Y) \leq \min(H(X), H(Y))$. For continuous distributions, replace sums with integrals using differential entropy."
      />

      <DefinitionBlock
        title="Conditional MI and Information Decomposition"
        definition="The conditional mutual information $I(X;Y|Z) = H(X|Z) - H(X|Y,Z)$ measures dependence between $X$ and $Y$ given $Z$. The chain rule: $I(X_1,\ldots,X_n;Y) = \sum_{i=1}^n I(X_i;Y|X_1,\ldots,X_{i-1})$. The interaction information can be negative: $II(X;Y;Z) = I(X;Y|Z) - I(X;Y)$."
        notation="$X \perp Y | Z$ iff $I(X;Y|Z) = 0$. This is used in conditional independence tests and graphical model structure learning."
      />

      <TheoremBlock
        title="Data Processing Inequality"
        statement="If $X \to Y \to Z$ forms a Markov chain (i.e., $X \perp Z | Y$), then: $I(X;Z) \leq I(X;Y)$ and $I(X;Z) \leq I(Y;Z)$. Processing data cannot increase the mutual information with the original source. Corollary: for any deterministic function $f$, $I(X; f(Y)) \leq I(X;Y)$."
        proof="$I(X;Y,Z) = I(X;Z) + I(X;Y|Z)$ (chain rule). Since $Z \perp X | Y$: $I(X;Y|Z) \geq 0$ but also $I(X;Z|Y) = 0$. Therefore $I(X;Y,Z) = I(X;Y) + I(X;Z|Y) = I(X;Y)$. Combining: $I(X;Y) = I(X;Y,Z) = I(X;Z) + I(X;Y|Z) \geq I(X;Z)$."
      />

      <ExampleBlock title="MI in Deep Learning: MINE and InfoNCE">
        <p>
          MINE (Mutual Information Neural Estimator, Belghazi 2018) estimates MI using a neural
          network trained on the Donsker-Varadhan variational lower bound:
        </p>
        <BlockMath math="I(X;Y) \geq \sup_T \mathbb{E}_{p(x,y)}[T(x,y)] - \log\mathbb{E}_{p(x)p(y)}[e^{T(x,y)}]" />
        <p>
          InfoNCE (Oord 2018), used in contrastive self-supervised learning, is a lower bound
          on MI via a ratio estimator, and training on it maximizes <InlineMath math="I(X;Y)" />
          between different augmented views of the same image.
        </p>
      </ExampleBlock>

      <WarningBlock title="MI Estimation in High Dimensions is Hard">
        <p>
          For continuous high-dimensional data, MI estimation is a notorious open problem.
          KDE-based estimators require exponentially many samples in the dimension. KSG
          (Kraskov-Stögbauer-Grassberger) k-nearest-neighbor estimator is standard for
          low-to-medium dimensions (<InlineMath math="d \lesssim 10" />). Neural estimators
          (MINE, InfoNCE) scale to high dimensions but have high variance and require careful
          training. All estimators are biased for high MI values.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
