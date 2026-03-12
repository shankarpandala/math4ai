import { useState, useMemo } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import NoteBlock from '../../../components/content/NoteBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function KFoldViz() {
  const [k, setK] = useState(5)
  const [n, setN] = useState(20)
  const [activeFold, setActiveFold] = useState(0)

  const folds = useMemo(() => {
    const foldSizes = Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0))
    let offset = 0
    return foldSizes.map(size => {
      const fold = { start: offset, size }
      offset += size
      return fold
    })
  }, [k, n])

  const cellW = Math.min(28, Math.floor(360 / n))
  const cellH = 28

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">k-Fold Cross-Validation Diagram</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Each row is one iteration. Red = validation fold, blue = training. Click a fold to highlight it.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">k folds = {k}</label>
          <input type="range" min="2" max="10" step="1" value={k} onChange={e => { setK(+e.target.value); setActiveFold(0) }} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">n samples = {n}</label>
          <input type="range" min="10" max="40" step="2" value={n} onChange={e => setN(+e.target.value)} className="w-full accent-indigo-600" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {folds.map((fold, fIdx) => (
            <div key={fIdx} className="mb-1 flex items-center gap-2 cursor-pointer" onClick={() => setActiveFold(fIdx)}>
              <span className="w-16 text-right text-xs text-gray-500">Fold {fIdx + 1}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: n }, (_, i) => {
                  const isVal = i >= fold.start && i < fold.start + fold.size
                  const isActive = fIdx === activeFold
                  return (
                    <div
                      key={i}
                      style={{ width: cellW, height: cellH }}
                      className={`rounded-sm border ${isVal
                        ? isActive ? 'bg-red-500 border-red-600' : 'bg-red-200 border-red-300 dark:bg-red-900/40 dark:border-red-700'
                        : isActive ? 'bg-blue-500 border-blue-600' : 'bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-indigo-50 p-2 dark:bg-indigo-900/20">
          <div className="font-mono font-bold text-indigo-600">{Math.floor(n * (k - 1) / k)}</div>
          <div className="text-gray-500">Train size / fold</div>
        </div>
        <div className="rounded bg-red-50 p-2 dark:bg-red-900/20">
          <div className="font-mono font-bold text-red-600">{Math.ceil(n / k)}</div>
          <div className="text-gray-500">Val size / fold</div>
        </div>
        <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20">
          <div className="font-mono font-bold text-emerald-600">{k}</div>
          <div className="text-gray-500">Total models</div>
        </div>
      </div>
    </div>
  )
}

const PYTHON_CODE = `import numpy as np
from sklearn.model_selection import (KFold, LeaveOneOut, cross_val_score,
                                      StratifiedKFold, cross_validate)
from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline

np.random.seed(42)
n = 100
X = np.random.randn(n, 1)
y = 2 * X.squeeze()**2 + np.random.normal(0, 1, n)

# k-fold cross-validation for model selection
for degree in [1, 2, 3, 5]:
    pipe = Pipeline([
        ('poly', PolynomialFeatures(degree)),
        ('ridge', Ridge(alpha=0.1))
    ])
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipe, X, y, cv=kf, scoring='neg_mean_squared_error')
    print(f"Degree {degree}: CV MSE = {-scores.mean():.4f} ± {scores.std():.4f}")

# Leave-One-Out (LOO) for small datasets
small_n = 20
X_s = X[:small_n]; y_s = y[:small_n]
loo = LeaveOneOut()
model = Pipeline([('poly', PolynomialFeatures(2)), ('ridge', Ridge(alpha=0.1))])
loo_scores = cross_val_score(model, X_s, y_s, cv=loo, scoring='neg_mean_squared_error')
print(f"\\nLOO MSE (n=20): {-loo_scores.mean():.4f}")

# Stratified k-fold for classification
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
X_c, y_c = make_classification(200, 10, random_state=0)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
result = cross_validate(LogisticRegression(), X_c, y_c, cv=skf,
                         scoring=['accuracy', 'roc_auc'])
print(f"\\nClassification: accuracy={result['test_accuracy'].mean():.4f}, "
      f"AUC={result['test_roc_auc'].mean():.4f}")
`

export default function CrossValidation() {
  return (
    <div className="space-y-8">
      <NoteBlock title="Model Evaluation vs Model Selection">
        <p>
          Cross-validation serves two purposes: estimating generalization performance (model
          evaluation) and selecting hyperparameters (model selection). The bias-variance tradeoff
          in CV itself: LOO has low bias but high variance; 5/10-fold CV balances both.
        </p>
      </NoteBlock>

      <KFoldViz />

      <DefinitionBlock
        title="k-Fold Cross-Validation"
        definition="Partition the dataset $\{(\mathbf{x}_i, y_i)\}_{i=1}^n$ into $k$ equal folds $\mathcal{F}_1,\ldots,\mathcal{F}_k$. For each fold $j$: train on $\bigcup_{i \neq j}\mathcal{F}_i$, evaluate on $\mathcal{F}_j$. The CV estimate of generalization error is: $\hat\epsilon_{\mathrm{CV}} = \frac{1}{n}\sum_{j=1}^k \sum_{i\in\mathcal{F}_j} L(y_i, \hat f_{-j}(\mathbf{x}_i))$ where $\hat f_{-j}$ is trained on all folds except $j$."
        notation="Common choices: $k=5$ or $k=10$ in practice. $k=n$ is Leave-One-Out (LOO). Each fold trains $k$ models total."
      />

      <DefinitionBlock
        title="Leave-One-Out Cross-Validation"
        definition="LOO-CV is k-fold with $k=n$: each observation is held out once as the validation set. For linear models with hat matrix $H$, LOO-CV has the shortcut: $\mathrm{LOO\text{-}CV} = \frac{1}{n}\sum_{i=1}^n \left(\frac{y_i - \hat y_i}{1 - H_{ii}}\right)^2$ where $H_{ii}$ are the diagonal hat matrix elements. This avoids fitting $n$ separate models."
        notation="LOO-CV is approximately equivalent to AIC for linear models under Gaussian errors. Generalized CV (GCV) replaces $H_{ii}$ with $\mathrm{tr}(H)/n$."
      />

      <TheoremBlock
        title="Bias-Variance of k-Fold CV"
        statement="The k-fold CV estimator has a bias-variance tradeoff with respect to $k$: LOO ($k=n$) is nearly unbiased (trains on $n-1$ samples) but has high variance (correlated fold estimates). Small $k$ (e.g., $k=2$) has lower variance but high pessimistic bias (trains on only half the data). Empirically, $k=5$ or $k=10$ provides a good tradeoff and is the standard recommendation."
        proof="The bias comes from the fact that k-fold trains on $(1-1/k)n$ samples, not $n$. Under the assumption that performance improves with $n$ at rate $n^{-\alpha}$, the bias is $O((kn)^{-\alpha})$. The variance comes from the $k$ correlated estimates: since training sets overlap significantly, fold errors are highly correlated (especially for LOO), inflating variance."
      />

      <ExampleBlock title="Nested Cross-Validation for Model Selection">
        <p>
          When selecting hyperparameters AND estimating generalization performance, use nested CV:
          outer loop (5-fold) for performance estimation, inner loop (5-fold) for hyperparameter
          selection. Without nesting, CV error is optimistically biased because the best
          hyperparameters were chosen on the same data used to evaluate performance. Nested CV
          gives an unbiased estimate at the cost of <InlineMath math="5 \times 5 = 25" /> model fits.
        </p>
      </ExampleBlock>

      <WarningBlock title="Data Leakage in Cross-Validation">
        <p>
          Preprocessing steps (scaling, imputation, feature selection) must be fit INSIDE the
          CV loop, not on the full dataset. Fitting a StandardScaler on all data before CV leaks
          information from validation folds into training, inflating CV scores. Use scikit-learn
          Pipelines to ensure preprocessing is done within each fold. This is especially critical
          for feature selection and PCA — never select features using all data before CV.
        </p>
      </WarningBlock>

      <PythonCode code={PYTHON_CODE} />
    </div>
  )
}
