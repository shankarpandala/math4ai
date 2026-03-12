import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

const UNITS = [
  { id: 'A', x0: 40, x1: 55, X: 1, name: 'Alice' },
  { id: 'B', x0: 30, x1: 45, X: 0, name: 'Bob' },
  { id: 'C', x0: 50, x1: 70, X: 1, name: 'Carol' },
  { id: 'D', x0: 35, x1: 50, X: 0, name: 'Dave' },
  { id: 'E', x0: 60, x1: 75, X: 1, name: 'Eve' },
  { id: 'F', x0: 25, x1: 40, X: 0, name: 'Frank' },
]

function PotentialOutcomesViz() {
  const [showCounterfactual, setShowCounterfactual] = useState(false)
  const [highlightUnit, setHighlightUnit] = useState(null)

  const treated = UNITS.filter(u => u.X === 1)
  const control = UNITS.filter(u => u.X === 0)

  const ate = UNITS.reduce((s, u) => s + (u.x1 - u.x0), 0) / UNITS.length
  const att = treated.reduce((s, u) => s + (u.x1 - u.x0), 0) / treated.length

  // Naive estimate (observed)
  const treatedObs = treated.reduce((s, u) => s + u.x1, 0) / treated.length
  const controlObs = control.reduce((s, u) => s + u.x0, 0) / control.length
  const naiveEst = treatedObs - controlObs

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Potential Outcomes: Treatment vs Control</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each unit has two potential outcomes: Y(0) = untreated, Y(1) = treated. We observe only one.
        Grayed values are counterfactual (unobserved).
      </p>
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => setShowCounterfactual(v => !v)}
          className={`rounded px-3 py-1.5 text-sm font-medium ${showCounterfactual ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
        >
          {showCounterfactual ? 'Hide' : 'Reveal'} Counterfactuals
        </button>
        <span className="text-xs text-gray-500">(In reality, counterfactuals are never observed)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 text-left text-xs font-semibold text-gray-500">Unit</th>
              <th className="py-2 text-center text-xs font-semibold text-gray-500">Treatment X</th>
              <th className="py-2 text-center text-xs font-semibold text-blue-600">Y(0) = control</th>
              <th className="py-2 text-center text-xs font-semibold text-red-600">Y(1) = treated</th>
              <th className="py-2 text-center text-xs font-semibold text-purple-600">ITE = Y(1)-Y(0)</th>
            </tr>
          </thead>
          <tbody>
            {UNITS.map(u => {
              const observed0 = u.X === 0
              const observed1 = u.X === 1
              return (
                <tr
                  key={u.id}
                  className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${highlightUnit === u.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  onClick={() => setHighlightUnit(h => h === u.id ? null : u.id)}
                >
                  <td className="py-2 font-medium">{u.name}</td>
                  <td className="py-2 text-center">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${u.X === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.X === 1 ? 'Treated' : 'Control'}
                    </span>
                  </td>
                  <td className={`py-2 text-center font-mono ${observed0 ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
                    {observed0 || showCounterfactual ? u.x0 : '???'}
                  </td>
                  <td className={`py-2 text-center font-mono ${observed1 ? 'text-red-700 font-bold' : 'text-gray-400'}`}>
                    {observed1 || showCounterfactual ? u.x1 : '???'}
                  </td>
                  <td className={`py-2 text-center font-mono ${showCounterfactual ? 'text-purple-700 font-bold' : 'text-gray-400'}`}>
                    {showCounterfactual ? `+${u.x1 - u.x0}` : '???'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-purple-50 p-2 dark:bg-purple-900/20">
          <div className="font-mono font-bold text-purple-600">{showCounterfactual ? ate.toFixed(1) : '???'}</div>
          <div className="text-gray-500">ATE (true)</div>
        </div>
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20">
          <div className="font-mono font-bold text-red-600">{showCounterfactual ? att.toFixed(1) : '???'}</div>
          <div className="text-gray-500">ATT (true)</div>
        </div>
        <div className="rounded bg-orange-50 p-2 dark:bg-orange-900/20">
          <div className="font-mono font-bold text-orange-600">{naiveEst.toFixed(1)}</div>
          <div className="text-gray-500">Naive estimate (biased)</div>
        </div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from scipy import stats

np.random.seed(42)
n = 1000

# Confounded observational data
# True ATE = 2.0
ability = np.random.normal(0, 1, n)
# Selection bias: higher ability → more likely to be treated
treatment = (ability + np.random.normal(0, 1, n) > 0).astype(int)

# Outcomes: ability affects Y regardless of treatment
Y0 = 50 + 5 * ability + np.random.normal(0, 2, n)   # untreated potential outcome
Y1 = Y0 + 2.0                                          # treated potential outcome (ATE=2)
Y_obs = np.where(treatment, Y1, Y0)                    # observed

# Naive estimate (biased due to confounding)
naive = Y_obs[treatment == 1].mean() - Y_obs[treatment == 0].mean()
print(f"Naive estimate: {naive:.4f} (biased, should be 2.0)")

# Oracle (if we knew both potential outcomes)
ate_oracle = (Y1 - Y0).mean()
print(f"Oracle ATE:     {ate_oracle:.4f}")

# OLS regression adjustment
import statsmodels.api as sm
X_reg = sm.add_constant(np.column_stack([treatment, ability]))
ols = sm.OLS(Y_obs, X_reg).fit()
print(f"OLS adjusted:   {ols.params[1]:.4f} (coefficient on treatment)")

# Propensity score matching (simplified)
from sklearn.linear_model import LogisticRegression
ps_model = LogisticRegression()
ps_model.fit(ability.reshape(-1, 1), treatment)
propensity = ps_model.predict_proba(ability.reshape(-1, 1))[:, 1]

# IPW estimator
ipw_treated = (Y_obs * treatment / propensity).mean()
ipw_control = (Y_obs * (1 - treatment) / (1 - propensity)).mean()
ipw_ate = ipw_treated - ipw_control
print(f"IPW estimate:   {ipw_ate:.4f}")
`

export default function PotentialOutcomesFramework() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Correlation Is Not Causation">
        <p>
          The potential outcomes framework (Rubin Causal Model) provides a precise mathematical
          language for causal questions. The fundamental problem of causal inference: we cannot
          observe both potential outcomes for the same unit at the same time. Estimating causal
          effects requires strong assumptions about how treatment was assigned.
        </p>
      </NoteBlock>

      <PotentialOutcomesViz />

      <DefinitionBlock
        title="Potential Outcomes (Rubin Causal Model)"
        definition="For each unit $i$, define two potential outcomes: $Y_i(0)$ (outcome if untreated) and $Y_i(1)$ (outcome if treated). The Individual Treatment Effect (ITE) is $\tau_i = Y_i(1) - Y_i(0)$. The Average Treatment Effect is $\mathrm{ATE} = \mathbb{E}[\tau_i] = \mathbb{E}[Y(1)] - \mathbb{E}[Y(0)]$. The Average Treatment Effect on the Treated is $\mathrm{ATT} = \mathbb{E}[\tau_i | X_i = 1]$."
        notation="We observe only $Y_i^{\mathrm{obs}} = Y_i(X_i)$ where $X_i \in \{0,1\}$ is treatment. The counterfactual $Y_i(1-X_i)$ is never observed — the Fundamental Problem of Causal Inference."
      />

      <DefinitionBlock
        title="SUTVA and Ignorability"
        definition="Two key assumptions for identification: (1) SUTVA (Stable Unit Treatment Value Assumption): no interference between units ($Y_i(x)$ does not depend on others' treatments) and no hidden treatment versions. (2) Ignorability (unconfoundedness): $\{Y_i(0), Y_i(1)\} \perp X_i \mid \mathbf{Z}_i$ — treatment is independent of potential outcomes given observed covariates $\mathbf{Z}$. This justifies randomized experiments and covariate adjustment in observational studies."
        notation="Strong ignorability + positivity ($0 < P(X=1|\mathbf{Z}) < 1$) allows nonparametric identification of ATE from observational data."
      />

      <TheoremBlock
        title="Randomization Identifies ATE"
        statement="In a completely randomized experiment where treatment $X_i$ is assigned independently of potential outcomes, the difference in observed means is an unbiased estimator of ATE: $\mathbb{E}[\bar Y_1 - \bar Y_0] = \mathrm{ATE}$ where $\bar Y_t = n_t^{-1}\sum_{i:X_i=t} Y_i^{\mathrm{obs}}$."
        proof="By randomization: $\{Y_i(0), Y_i(1)\} \perp X_i$ (ignorability holds). Thus $\mathbb{E}[Y^{\mathrm{obs}} | X=1] = \mathbb{E}[Y(1)|X=1] = \mathbb{E}[Y(1)]$ (by independence). Similarly $\mathbb{E}[Y^{\mathrm{obs}}|X=0] = \mathbb{E}[Y(0)]$. Therefore $\mathbb{E}[\bar Y_1 - \bar Y_0] = \mathbb{E}[Y(1)] - \mathbb{E}[Y(0)] = \mathrm{ATE}$."
      />

      <ExampleBlock title="Selection Bias in Observational Studies">
        <p>
          Consider a job training program where motivated workers self-select into training.
          Motivated workers would earn more even without training (<InlineMath math="Y_i(0)" /> is
          higher for treated). The naive comparison <InlineMath math="\bar Y_1 - \bar Y_0" /> overestimates
          the ATE. Remedies include: (1) Propensity score matching; (2) Inverse probability weighting
          (IPW); (3) Regression discontinuity; (4) Instrumental variables.
        </p>
      </ExampleBlock>

      <WarningBlock title="No Causal Conclusions from Observational Data Without Assumptions">
        <p>
          Causal identification always requires untestable assumptions (ignorability, SUTVA, instrument validity).
          These must be justified by domain knowledge, not statistics. Machine learning can estimate
          heterogeneous treatment effects from observational data (e.g., via causal forests), but the
          validity of causal conclusions depends entirely on the plausibility of the identifying
          assumptions. Always report sensitivity analyses showing how conclusions change under
          violations of key assumptions.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
