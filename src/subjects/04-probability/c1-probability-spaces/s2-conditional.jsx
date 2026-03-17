import { useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import TheoremBlock from '../../../components/content/TheoremBlock.jsx'
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx'
import ExampleBlock from '../../../components/content/ExampleBlock.jsx'
import WarningBlock from '../../../components/content/WarningBlock.jsx'
import PythonCode from '../../../components/content/PythonCode.jsx'

function BayesViz() {
  const [prior, setPrior] = useState(0.01)
  const [sensitivity, setSensitivity] = useState(0.95)
  const [specificity, setSpecificity] = useState(0.95)

  // P(disease | positive test)
  const pPositive = sensitivity * prior + (1 - specificity) * (1 - prior)
  const posterior = (sensitivity * prior) / pPositive

  const W = 300, H = 30

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">Bayes' Theorem: Medical Test Calculator</h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Given a positive test result, what is the probability of actually having the disease?
      </p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>Prior P(D)</span><span>{(prior * 100).toFixed(1)}%</span></div>
          <input type="range" min="0.001" max="0.5" step="0.001" value={prior} onChange={e => setPrior(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>Sensitivity</span><span>{(sensitivity * 100).toFixed(0)}%</span></div>
          <input type="range" min="0.5" max="0.999" step="0.001" value={sensitivity} onChange={e => setSensitivity(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs"><span>Specificity</span><span>{(specificity * 100).toFixed(0)}%</span></div>
          <input type="range" min="0.5" max="0.999" step="0.001" value={specificity} onChange={e => setSpecificity(parseFloat(e.target.value))} className="w-full accent-blue-500" />
        </div>
      </div>
      {/* Posterior bar */}
      <svg width={W} height={H} className="rounded bg-gray-100 dark:bg-gray-800">
        <rect x={0} y={0} width={W * posterior} height={H} fill="#10b981" rx={4} />
        <rect x={W * posterior} y={0} width={W * (1 - posterior)} height={H} fill="#ef4444" rx={4} opacity={0.3} />
        <text x={W / 2} y={H / 2 + 4} fontSize={12} fill="#1f2937" textAnchor="middle" fontWeight="bold">
          P(D|+) = {(posterior * 100).toFixed(1)}%
        </text>
      </svg>
      <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm">
        P(+) = {(pPositive * 100).toFixed(2)}% | False positive rate = {((1 - specificity) * 100).toFixed(1)}%
      </div>
    </div>
  )
}

export default function ConditionalProbability() {
  return (
    <div className="space-y-8">
      <BayesViz />

      <DefinitionBlock
        label="Definition 1.2.1"
        title="Conditional Probability"
        definition={
          "For events $A, B$ with $P(B) > 0$, the conditional probability of $A$ given $B$ is " +
          "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$. " +
          "This defines a new probability measure $P(\\cdot \\mid B)$ on the sample space, " +
          "restricted to outcomes in $B$."
        }
        notation={
          "The multiplication rule follows: $P(A \\cap B) = P(A \\mid B) P(B) = P(B \\mid A) P(A)$."
        }
      />

      <TheoremBlock
        label="Theorem 1.2.1"
        title="Bayes' Theorem"
        statement={
          "For events $A$ and $B$ with $P(B) > 0$: " +
          "$P(A \\mid B) = \\frac{P(B \\mid A)\\, P(A)}{P(B)}$ " +
          "where $P(B) = \\sum_i P(B \\mid A_i) P(A_i)$ via the law of total probability " +
          "(for any partition $\\{A_i\\}$ of the sample space)."
        }
        proof={
          "From the definition: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(B \\mid A) P(A)}{P(B)}$. " +
          "The denominator expands by total probability: $P(B) = P(B \\mid A)P(A) + P(B \\mid A^c)P(A^c)$."
        }
      />

      <DefinitionBlock
        label="Definition 1.2.2"
        title="Independence"
        definition={
          "Events $A$ and $B$ are independent if $P(A \\cap B) = P(A)P(B)$, equivalently $P(A \\mid B) = P(A)$. " +
          "For random variables, $X$ and $Y$ are independent if $P(X \\in A, Y \\in B) = P(X \\in A)P(Y \\in B)$ " +
          "for all measurable sets $A, B$. Mutual independence of $n$ variables requires all subsets to factor."
        }
      />

      <ExampleBlock title="Bayes' Theorem in Machine Learning">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Naive Bayes classifiers apply Bayes' theorem with a conditional independence assumption:
        </p>
        <BlockMath math="P(y \mid \mathbf{x}) \propto P(y) \prod_{j=1}^d P(x_j \mid y)" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Despite the &quot;naive&quot; independence assumption, this often works well for text classification
          (spam filtering) and other high-dimensional problems where features are approximately independent given the class.
        </p>
      </ExampleBlock>

      <WarningBlock title="Common Pitfalls with Conditional Probability">
        <p>
          <strong>Base rate neglect:</strong> a test with 99% sensitivity and 99% specificity still yields
          only ~50% posterior probability when the base rate is 1%. Always account for the prior.
          <br /><br />
          <strong>Confusion of the inverse:</strong> <InlineMath math="P(A \mid B) \neq P(B \mid A)" /> in
          general. The probability of testing positive given disease differs from the probability of disease
          given a positive test.
        </p>
      </WarningBlock>

      <PythonCode
        title="Conditional Probability and Bayes' Theorem"
        code={`import numpy as np

# ── Bayes' theorem: medical test ─────────────────────────────────────────
prior = 0.01          # 1% prevalence
sensitivity = 0.95    # P(+|disease)
specificity = 0.95    # P(-|no disease)

p_positive = sensitivity * prior + (1 - specificity) * (1 - prior)
posterior = (sensitivity * prior) / p_positive
print(f"Medical test with 1% prevalence:")
print(f"  P(disease | positive) = {posterior:.4f} ({posterior*100:.1f}%)")
print(f"  Most positives are false positives!")

# ── Monte Carlo simulation to verify ────────────────────────────────────
rng = np.random.default_rng(42)
n = 1_000_000
has_disease = rng.random(n) < prior
test_positive = np.where(
    has_disease,
    rng.random(n) < sensitivity,
    rng.random(n) < (1 - specificity)
)
simulated_posterior = has_disease[test_positive].mean()
print(f"  Monte Carlo P(disease|+) = {simulated_posterior:.4f}")

# ── Naive Bayes classifier (from scratch) ────────────────────────────────
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

data = load_iris()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

# Compute class priors and per-feature Gaussian likelihoods
classes = np.unique(y_train)
priors = {c: (y_train == c).mean() for c in classes}
means = {c: X_train[y_train == c].mean(axis=0) for c in classes}
stds = {c: X_train[y_train == c].std(axis=0) + 1e-6 for c in classes}

def predict(x):
    log_probs = {}
    for c in classes:
        log_prior = np.log(priors[c])
        log_likelihood = -0.5 * np.sum(((x - means[c]) / stds[c])**2 + np.log(2*np.pi*stds[c]**2))
        log_probs[c] = log_prior + log_likelihood
    return max(log_probs, key=log_probs.get)

preds = np.array([predict(x) for x in X_test])
accuracy = (preds == y_test).mean()
print(f"\\nNaive Bayes on Iris: accuracy = {accuracy:.4f}")`}
      />
    </div>
  )
}
