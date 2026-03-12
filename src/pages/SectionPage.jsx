import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { getCurriculumById, getChapterById, getSectionById, getAdjacentSections } from '../subjects/index.js'
import DifficultyBadge from '../components/navigation/DifficultyBadge.jsx'
import PrevNextNav from '../components/navigation/PrevNextNav.jsx'
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx'
import useProgress from '../hooks/useProgress.js'

// Registry of sections that have full content pages written.
// Auto-generated from all existing section JSX files across all 15 subjects.
const CONTENT_REGISTRY = {
  // 01-foundations
  '01-foundations/c1-logic-proofs/s1-propositions': lazy(() => import('../subjects/01-foundations/c1-logic-proofs/s1-propositions.jsx')),
  '01-foundations/c1-logic-proofs/s2-proof-techniques': lazy(() => import('../subjects/01-foundations/c1-logic-proofs/s2-proof-techniques.jsx')),
  '01-foundations/c1-logic-proofs/s3-induction': lazy(() => import('../subjects/01-foundations/c1-logic-proofs/s3-induction.jsx')),
  '01-foundations/c2-real-numbers/s1-real-line': lazy(() => import('../subjects/01-foundations/c2-real-numbers/s1-real-line.jsx')),
  '01-foundations/c2-real-numbers/s2-sequences': lazy(() => import('../subjects/01-foundations/c2-real-numbers/s2-sequences.jsx')),
  '01-foundations/c2-real-numbers/s3-series': lazy(() => import('../subjects/01-foundations/c2-real-numbers/s3-series.jsx')),
  '01-foundations/c3-topology/s1-metric-spaces': lazy(() => import('../subjects/01-foundations/c3-topology/s1-metric-spaces.jsx')),
  '01-foundations/c3-topology/s2-continuity': lazy(() => import('../subjects/01-foundations/c3-topology/s2-continuity.jsx')),
  '01-foundations/c3-topology/s3-compactness': lazy(() => import('../subjects/01-foundations/c3-topology/s3-compactness.jsx')),
  '01-foundations/c4-differentiation/s1-derivatives': lazy(() => import('../subjects/01-foundations/c4-differentiation/s1-derivatives.jsx')),
  '01-foundations/c5-integration/s1-riemann': lazy(() => import('../subjects/01-foundations/c5-integration/s1-riemann.jsx')),
  '01-foundations/c5-integration/s2-ftc': lazy(() => import('../subjects/01-foundations/c5-integration/s2-ftc.jsx')),
  '01-foundations/c6-multivariable/s1-partial-derivatives': lazy(() => import('../subjects/01-foundations/c6-multivariable/s1-partial-derivatives.jsx')),
  '01-foundations/c6-multivariable/s2-jacobian': lazy(() => import('../subjects/01-foundations/c6-multivariable/s2-jacobian.jsx')),
  '01-foundations/c6-multivariable/s3-optimization': lazy(() => import('../subjects/01-foundations/c6-multivariable/s3-optimization.jsx')),
  // 02-linear-algebra
  '02-linear-algebra/c1-vector-spaces/s1-vectors': lazy(() => import('../subjects/02-linear-algebra/c1-vector-spaces/s1-vectors.jsx')),
  '02-linear-algebra/c1-vector-spaces/s2-subspaces': lazy(() => import('../subjects/02-linear-algebra/c1-vector-spaces/s2-subspaces.jsx')),
  '02-linear-algebra/c1-vector-spaces/s3-basis': lazy(() => import('../subjects/02-linear-algebra/c1-vector-spaces/s3-basis.jsx')),
  '02-linear-algebra/c2-linear-maps/s1-matrices': lazy(() => import('../subjects/02-linear-algebra/c2-linear-maps/s1-matrices.jsx')),
  '02-linear-algebra/c2-linear-maps/s2-rank-nullity': lazy(() => import('../subjects/02-linear-algebra/c2-linear-maps/s2-rank-nullity.jsx')),
  '02-linear-algebra/c2-linear-maps/s3-systems': lazy(() => import('../subjects/02-linear-algebra/c2-linear-maps/s3-systems.jsx')),
  '02-linear-algebra/c3-inner-products/s1-dot-product': lazy(() => import('../subjects/02-linear-algebra/c3-inner-products/s1-dot-product.jsx')),
  '02-linear-algebra/c3-inner-products/s2-orthogonality': lazy(() => import('../subjects/02-linear-algebra/c3-inner-products/s2-orthogonality.jsx')),
  '02-linear-algebra/c3-inner-products/s3-gram-schmidt': lazy(() => import('../subjects/02-linear-algebra/c3-inner-products/s3-gram-schmidt.jsx')),
  '02-linear-algebra/c4-determinants/s1-det-def': lazy(() => import('../subjects/02-linear-algebra/c4-determinants/s1-det-def.jsx')),
  '02-linear-algebra/c4-determinants/s2-det-apps': lazy(() => import('../subjects/02-linear-algebra/c4-determinants/s2-det-apps.jsx')),
  '02-linear-algebra/c5-eigentheory/s1-eigenvalues': lazy(() => import('../subjects/02-linear-algebra/c5-eigentheory/s1-eigenvalues.jsx')),
  '02-linear-algebra/c5-eigentheory/s2-diagonalization': lazy(() => import('../subjects/02-linear-algebra/c5-eigentheory/s2-diagonalization.jsx')),
  '02-linear-algebra/c5-eigentheory/s3-spectral': lazy(() => import('../subjects/02-linear-algebra/c5-eigentheory/s3-spectral.jsx')),
  '02-linear-algebra/c6-decompositions/s2-qr': lazy(() => import('../subjects/02-linear-algebra/c6-decompositions/s2-qr.jsx')),
  '02-linear-algebra/c6-decompositions/s3-svd': lazy(() => import('../subjects/02-linear-algebra/c6-decompositions/s3-svd.jsx')),
  '02-linear-algebra/c7-pca/s1-covariance': lazy(() => import('../subjects/02-linear-algebra/c7-pca/s1-covariance.jsx')),
  '02-linear-algebra/c7-pca/s2-pca': lazy(() => import('../subjects/02-linear-algebra/c7-pca/s2-pca.jsx')),
  '02-linear-algebra/c8-special-matrices/s1-psd': lazy(() => import('../subjects/02-linear-algebra/c8-special-matrices/s1-psd.jsx')),
  '02-linear-algebra/c8-special-matrices/s2-structured': lazy(() => import('../subjects/02-linear-algebra/c8-special-matrices/s2-structured.jsx')),
  // 03-calculus
  '03-calculus/c1-limits-continuity/s1-limits': lazy(() => import('../subjects/03-calculus/c1-limits-continuity/s1-limits.jsx')),
  '03-calculus/c1-limits-continuity/s2-continuity': lazy(() => import('../subjects/03-calculus/c1-limits-continuity/s2-continuity.jsx')),
  '03-calculus/c2-differentiation/s1-derivatives': lazy(() => import('../subjects/03-calculus/c2-differentiation/s1-derivatives.jsx')),
  '03-calculus/c2-differentiation/s2-taylor': lazy(() => import('../subjects/03-calculus/c2-differentiation/s2-taylor.jsx')),
  '03-calculus/c3-integration/s1-techniques': lazy(() => import('../subjects/03-calculus/c3-integration/s1-techniques.jsx')),
  '03-calculus/c3-integration/s2-improper': lazy(() => import('../subjects/03-calculus/c3-integration/s2-improper.jsx')),
  '03-calculus/c4-multivariable/s1-gradients': lazy(() => import('../subjects/03-calculus/c4-multivariable/s1-gradients.jsx')),
  '03-calculus/c4-multivariable/s2-hessian': lazy(() => import('../subjects/03-calculus/c4-multivariable/s2-hessian.jsx')),
  '03-calculus/c4-multivariable/s3-lagrange': lazy(() => import('../subjects/03-calculus/c4-multivariable/s3-lagrange.jsx')),
  '03-calculus/c5-vector-calculus/s1-vector-fields': lazy(() => import('../subjects/03-calculus/c5-vector-calculus/s1-vector-fields.jsx')),
  '03-calculus/c6-measure-theory/s1-sigma-algebras': lazy(() => import('../subjects/03-calculus/c6-measure-theory/s1-sigma-algebras.jsx')),
  '03-calculus/c6-measure-theory/s2-lebesgue': lazy(() => import('../subjects/03-calculus/c6-measure-theory/s2-lebesgue.jsx')),
  '03-calculus/c7-functional-analysis/s1-banach': lazy(() => import('../subjects/03-calculus/c7-functional-analysis/s1-banach.jsx')),
  '03-calculus/c7-functional-analysis/s2-operators': lazy(() => import('../subjects/03-calculus/c7-functional-analysis/s2-operators.jsx')),
  // 04-probability
  '04-probability/c1-probability-spaces/s1-axioms': lazy(() => import('../subjects/04-probability/c1-probability-spaces/s1-axioms.jsx')),
  '04-probability/c2-random-variables/s1-discrete-rv': lazy(() => import('../subjects/04-probability/c2-random-variables/s1-discrete-rv.jsx')),
  '04-probability/c2-random-variables/s2-continuous-rv': lazy(() => import('../subjects/04-probability/c2-random-variables/s2-continuous-rv.jsx')),
  '04-probability/c2-random-variables/s3-joint': lazy(() => import('../subjects/04-probability/c2-random-variables/s3-joint.jsx')),
  '04-probability/c3-distributions/s1-bernoulli-binomial': lazy(() => import('../subjects/04-probability/c3-distributions/s1-bernoulli-binomial.jsx')),
  '04-probability/c3-distributions/s3-exponential-family': lazy(() => import('../subjects/04-probability/c3-distributions/s3-exponential-family.jsx')),
  '04-probability/c4-expectation/s1-moments': lazy(() => import('../subjects/04-probability/c4-expectation/s1-moments.jsx')),
  '04-probability/c4-expectation/s2-mgf': lazy(() => import('../subjects/04-probability/c4-expectation/s2-mgf.jsx')),
  '04-probability/c5-limit-theorems/s1-lln': lazy(() => import('../subjects/04-probability/c5-limit-theorems/s1-lln.jsx')),
  '04-probability/c5-limit-theorems/s2-clt': lazy(() => import('../subjects/04-probability/c5-limit-theorems/s2-clt.jsx')),
  '04-probability/c6-markov-chains/s1-markov-basics': lazy(() => import('../subjects/04-probability/c6-markov-chains/s1-markov-basics.jsx')),
  '04-probability/c6-markov-chains/s2-stationary': lazy(() => import('../subjects/04-probability/c6-markov-chains/s2-stationary.jsx')),
  '04-probability/c6-markov-chains/s3-mcmc': lazy(() => import('../subjects/04-probability/c6-markov-chains/s3-mcmc.jsx')),
  '04-probability/c7-information-measures/s1-entropy': lazy(() => import('../subjects/04-probability/c7-information-measures/s1-entropy.jsx')),
  '04-probability/c7-information-measures/s2-kl': lazy(() => import('../subjects/04-probability/c7-information-measures/s2-kl.jsx')),
  '04-probability/c8-concentration/s2-hoeffding': lazy(() => import('../subjects/04-probability/c8-concentration/s2-hoeffding.jsx')),
  // 05-statistics
  '05-statistics/c1-estimation/s1-mle': lazy(() => import('../subjects/05-statistics/c1-estimation/s1-mle.jsx')),
  '05-statistics/c1-estimation/s2-map': lazy(() => import('../subjects/05-statistics/c1-estimation/s2-map.jsx')),
  '05-statistics/c1-estimation/s3-properties': lazy(() => import('../subjects/05-statistics/c1-estimation/s3-properties.jsx')),
  '05-statistics/c2-hypothesis-testing/s1-framework': lazy(() => import('../subjects/05-statistics/c2-hypothesis-testing/s1-framework.jsx')),
  '05-statistics/c2-hypothesis-testing/s2-tests': lazy(() => import('../subjects/05-statistics/c2-hypothesis-testing/s2-tests.jsx')),
  '05-statistics/c3-regression/s1-linear-regression': lazy(() => import('../subjects/05-statistics/c3-regression/s1-linear-regression.jsx')),
  '05-statistics/c3-regression/s2-regularization': lazy(() => import('../subjects/05-statistics/c3-regression/s2-regularization.jsx')),
  '05-statistics/c3-regression/s3-glm': lazy(() => import('../subjects/05-statistics/c3-regression/s3-glm.jsx')),
  '05-statistics/c4-bayesian-statistics/s1-bayesian-framework': lazy(() => import('../subjects/05-statistics/c4-bayesian-statistics/s1-bayesian-framework.jsx')),
  '05-statistics/c4-bayesian-statistics/s2-conjugate': lazy(() => import('../subjects/05-statistics/c4-bayesian-statistics/s2-conjugate.jsx')),
  '05-statistics/c5-information-criteria/s1-aic-bic': lazy(() => import('../subjects/05-statistics/c5-information-criteria/s1-aic-bic.jsx')),
  '05-statistics/c5-information-criteria/s2-cross-validation': lazy(() => import('../subjects/05-statistics/c5-information-criteria/s2-cross-validation.jsx')),
  '05-statistics/c6-nonparametric/s1-kde': lazy(() => import('../subjects/05-statistics/c6-nonparametric/s1-kde.jsx')),
  '05-statistics/c6-nonparametric/s2-bootstrap': lazy(() => import('../subjects/05-statistics/c6-nonparametric/s2-bootstrap.jsx')),
  '05-statistics/c7-causal-inference/s1-potential-outcomes': lazy(() => import('../subjects/05-statistics/c7-causal-inference/s1-potential-outcomes.jsx')),
  // 06-information-theory
  '06-information-theory/c1-entropy/s1-shannon-entropy': lazy(() => import('../subjects/06-information-theory/c1-entropy/s1-shannon-entropy.jsx')),
  '06-information-theory/c1-entropy/s2-differential-entropy': lazy(() => import('../subjects/06-information-theory/c1-entropy/s2-differential-entropy.jsx')),
  '06-information-theory/c2-divergences/s1-kl-divergence': lazy(() => import('../subjects/06-information-theory/c2-divergences/s1-kl-divergence.jsx')),
  '06-information-theory/c2-divergences/s2-f-divergences': lazy(() => import('../subjects/06-information-theory/c2-divergences/s2-f-divergences.jsx')),
  '06-information-theory/c2-divergences/s3-wasserstein': lazy(() => import('../subjects/06-information-theory/c2-divergences/s3-wasserstein.jsx')),
  '06-information-theory/c3-mutual-information/s1-mutual-info': lazy(() => import('../subjects/06-information-theory/c3-mutual-information/s1-mutual-info.jsx')),
  '06-information-theory/c3-mutual-information/s2-channel-capacity': lazy(() => import('../subjects/06-information-theory/c3-mutual-information/s2-channel-capacity.jsx')),
  '06-information-theory/c4-coding-theory/s1-source-coding': lazy(() => import('../subjects/06-information-theory/c4-coding-theory/s1-source-coding.jsx')),
  '06-information-theory/c4-coding-theory/s2-channel-coding': lazy(() => import('../subjects/06-information-theory/c4-coding-theory/s2-channel-coding.jsx')),
  '06-information-theory/c5-it-ml/s1-mdl': lazy(() => import('../subjects/06-information-theory/c5-it-ml/s1-mdl.jsx')),
  '06-information-theory/c5-it-ml/s2-ib': lazy(() => import('../subjects/06-information-theory/c5-it-ml/s2-ib.jsx')),
  // 07-optimization
  '07-optimization/c1-convex-sets/s1-convex-sets': lazy(() => import('../subjects/07-optimization/c1-convex-sets/s1-convex-sets.jsx')),
  '07-optimization/c1-convex-sets/s2-convex-functions': lazy(() => import('../subjects/07-optimization/c1-convex-sets/s2-convex-functions.jsx')),
  '07-optimization/c1-convex-sets/s3-conjugate': lazy(() => import('../subjects/07-optimization/c1-convex-sets/s3-conjugate.jsx')),
  '07-optimization/c2-unconstrained/s1-gradient-descent': lazy(() => import('../subjects/07-optimization/c2-unconstrained/s1-gradient-descent.jsx')),
  '07-optimization/c2-unconstrained/s3-momentum': lazy(() => import('../subjects/07-optimization/c2-unconstrained/s3-momentum.jsx')),
  '07-optimization/c3-constrained/s1-lagrangian': lazy(() => import('../subjects/07-optimization/c3-constrained/s1-lagrangian.jsx')),
  '07-optimization/c3-constrained/s2-duality': lazy(() => import('../subjects/07-optimization/c3-constrained/s2-duality.jsx')),
  '07-optimization/c4-stochastic-optimization/s1-sgd': lazy(() => import('../subjects/07-optimization/c4-stochastic-optimization/s1-sgd.jsx')),
  '07-optimization/c4-stochastic-optimization/s2-adam': lazy(() => import('../subjects/07-optimization/c4-stochastic-optimization/s2-adam.jsx')),
  '07-optimization/c4-stochastic-optimization/s3-variance-reduction': lazy(() => import('../subjects/07-optimization/c4-stochastic-optimization/s3-variance-reduction.jsx')),
  '07-optimization/c5-second-order/s1-natural-gradient': lazy(() => import('../subjects/07-optimization/c5-second-order/s1-natural-gradient.jsx')),
  '07-optimization/c5-second-order/s2-kfac': lazy(() => import('../subjects/07-optimization/c5-second-order/s2-kfac.jsx')),
  // 08-numerical-methods
  '08-numerical-methods/c1-numerical-linalg/s1-direct-solvers': lazy(() => import('../subjects/08-numerical-methods/c1-numerical-linalg/s1-direct-solvers.jsx')),
  '08-numerical-methods/c1-numerical-linalg/s2-iterative-solvers': lazy(() => import('../subjects/08-numerical-methods/c1-numerical-linalg/s2-iterative-solvers.jsx')),
  '08-numerical-methods/c2-numerical-optimization/s1-line-search': lazy(() => import('../subjects/08-numerical-methods/c2-numerical-optimization/s1-line-search.jsx')),
  '08-numerical-methods/c2-numerical-optimization/s2-numerical-diff': lazy(() => import('../subjects/08-numerical-methods/c2-numerical-optimization/s2-numerical-diff.jsx')),
  '08-numerical-methods/c3-ode-solvers/s1-euler': lazy(() => import('../subjects/08-numerical-methods/c3-ode-solvers/s1-euler.jsx')),
  '08-numerical-methods/c3-ode-solvers/s2-neural-odes': lazy(() => import('../subjects/08-numerical-methods/c3-ode-solvers/s2-neural-odes.jsx')),
  // 09-graph-theory
  '09-graph-theory/c1-graph-basics/s1-definitions': lazy(() => import('../subjects/09-graph-theory/c1-graph-basics/s1-definitions.jsx')),
  '09-graph-theory/c1-graph-basics/s2-connectivity': lazy(() => import('../subjects/09-graph-theory/c1-graph-basics/s2-connectivity.jsx')),
  '09-graph-theory/c2-spectral-graph/s1-laplacian': lazy(() => import('../subjects/09-graph-theory/c2-spectral-graph/s1-laplacian.jsx')),
  '09-graph-theory/c2-spectral-graph/s2-spectral-clustering': lazy(() => import('../subjects/09-graph-theory/c2-spectral-graph/s2-spectral-clustering.jsx')),
  '09-graph-theory/c3-gnn/s1-message-passing': lazy(() => import('../subjects/09-graph-theory/c3-gnn/s1-message-passing.jsx')),
  '09-graph-theory/c3-gnn/s2-gcn': lazy(() => import('../subjects/09-graph-theory/c3-gnn/s2-gcn.jsx')),
  // 10-neural-networks
  '10-neural-networks/c1-mlp/s1-architecture': lazy(() => import('../subjects/10-neural-networks/c1-mlp/s1-architecture.jsx')),
  '10-neural-networks/c1-mlp/s2-activations': lazy(() => import('../subjects/10-neural-networks/c1-mlp/s2-activations.jsx')),
  '10-neural-networks/c1-mlp/s3-uat': lazy(() => import('../subjects/10-neural-networks/c1-mlp/s3-uat.jsx')),
  '10-neural-networks/c2-backprop/s1-chain-rule': lazy(() => import('../subjects/10-neural-networks/c2-backprop/s1-chain-rule.jsx')),
  '10-neural-networks/c2-backprop/s2-autodiff': lazy(() => import('../subjects/10-neural-networks/c2-backprop/s2-autodiff.jsx')),
  '10-neural-networks/c3-cnn/s1-convolution': lazy(() => import('../subjects/10-neural-networks/c3-cnn/s1-convolution.jsx')),
  '10-neural-networks/c3-cnn/s2-cnn-arch': lazy(() => import('../subjects/10-neural-networks/c3-cnn/s2-cnn-arch.jsx')),
  '10-neural-networks/c4-rnn/s1-rnn': lazy(() => import('../subjects/10-neural-networks/c4-rnn/s1-rnn.jsx')),
  '10-neural-networks/c4-rnn/s2-lstm': lazy(() => import('../subjects/10-neural-networks/c4-rnn/s2-lstm.jsx')),
  '10-neural-networks/c5-training/s1-normalization': lazy(() => import('../subjects/10-neural-networks/c5-training/s1-normalization.jsx')),
  '10-neural-networks/c5-training/s2-regularization': lazy(() => import('../subjects/10-neural-networks/c5-training/s2-regularization.jsx')),
  '10-neural-networks/c5-training/s3-initialization': lazy(() => import('../subjects/10-neural-networks/c5-training/s3-initialization.jsx')),
  // 11-transformers
  '11-transformers/c1-attention/s1-sdp-attention': lazy(() => import('../subjects/11-transformers/c1-attention/s1-sdp-attention.jsx')),
  '11-transformers/c1-attention/s2-multihead': lazy(() => import('../subjects/11-transformers/c1-attention/s2-multihead.jsx')),
  '11-transformers/c1-attention/s3-cross-attention': lazy(() => import('../subjects/11-transformers/c1-attention/s3-cross-attention.jsx')),
  '11-transformers/c2-transformer-arch/s1-encoder': lazy(() => import('../subjects/11-transformers/c2-transformer-arch/s1-encoder.jsx')),
  '11-transformers/c2-transformer-arch/s2-decoder': lazy(() => import('../subjects/11-transformers/c2-transformer-arch/s2-decoder.jsx')),
  '11-transformers/c3-positional-encoding/s1-sinusoidal': lazy(() => import('../subjects/11-transformers/c3-positional-encoding/s1-sinusoidal.jsx')),
  '11-transformers/c3-positional-encoding/s2-rope': lazy(() => import('../subjects/11-transformers/c3-positional-encoding/s2-rope.jsx')),
  '11-transformers/c4-efficient-attention/s1-flash-attention': lazy(() => import('../subjects/11-transformers/c4-efficient-attention/s1-flash-attention.jsx')),
  '11-transformers/c4-efficient-attention/s2-linear-attention': lazy(() => import('../subjects/11-transformers/c4-efficient-attention/s2-linear-attention.jsx')),
  '11-transformers/c5-llm-training/s1-pretraining': lazy(() => import('../subjects/11-transformers/c5-llm-training/s1-pretraining.jsx')),
  '11-transformers/c5-llm-training/s2-finetuning': lazy(() => import('../subjects/11-transformers/c5-llm-training/s2-finetuning.jsx')),
  '11-transformers/c5-llm-training/s3-scaling-laws': lazy(() => import('../subjects/11-transformers/c5-llm-training/s3-scaling-laws.jsx')),
  // 12-vector-search
  '12-vector-search/c1-embedding-spaces/s1-word2vec': lazy(() => import('../subjects/12-vector-search/c1-embedding-spaces/s1-word2vec.jsx')),
  '12-vector-search/c1-embedding-spaces/s2-sentence-embeddings': lazy(() => import('../subjects/12-vector-search/c1-embedding-spaces/s2-sentence-embeddings.jsx')),
  '12-vector-search/c1-embedding-spaces/s3-metric-learning': lazy(() => import('../subjects/12-vector-search/c1-embedding-spaces/s3-metric-learning.jsx')),
  '12-vector-search/c2-similarity-search/s1-distance-metrics': lazy(() => import('../subjects/12-vector-search/c2-similarity-search/s1-distance-metrics.jsx')),
  '12-vector-search/c2-similarity-search/s2-inner-product-spaces': lazy(() => import('../subjects/12-vector-search/c2-similarity-search/s2-inner-product-spaces.jsx')),
  '12-vector-search/c3-ann-algorithms/s1-hnsw': lazy(() => import('../subjects/12-vector-search/c3-ann-algorithms/s1-hnsw.jsx')),
  '12-vector-search/c3-ann-algorithms/s2-ivf-pq': lazy(() => import('../subjects/12-vector-search/c3-ann-algorithms/s2-ivf-pq.jsx')),
  '12-vector-search/c4-rag/s1-dense-retrieval': lazy(() => import('../subjects/12-vector-search/c4-rag/s1-dense-retrieval.jsx')),
  '12-vector-search/c4-rag/s2-rag-arch': lazy(() => import('../subjects/12-vector-search/c4-rag/s2-rag-arch.jsx')),
  // 13-reinforcement-learning
  '13-reinforcement-learning/c1-mdp/s1-mdp-framework': lazy(() => import('../subjects/13-reinforcement-learning/c1-mdp/s1-mdp-framework.jsx')),
  '13-reinforcement-learning/c1-mdp/s2-bellman': lazy(() => import('../subjects/13-reinforcement-learning/c1-mdp/s2-bellman.jsx')),
  '13-reinforcement-learning/c2-dynamic-programming/s1-value-iteration': lazy(() => import('../subjects/13-reinforcement-learning/c2-dynamic-programming/s1-value-iteration.jsx')),
  '13-reinforcement-learning/c2-dynamic-programming/s2-policy-iteration': lazy(() => import('../subjects/13-reinforcement-learning/c2-dynamic-programming/s2-policy-iteration.jsx')),
  '13-reinforcement-learning/c3-model-free/s1-q-learning': lazy(() => import('../subjects/13-reinforcement-learning/c3-model-free/s1-q-learning.jsx')),
  '13-reinforcement-learning/c3-model-free/s2-dqn': lazy(() => import('../subjects/13-reinforcement-learning/c3-model-free/s2-dqn.jsx')),
  '13-reinforcement-learning/c4-policy-gradient/s1-reinforce': lazy(() => import('../subjects/13-reinforcement-learning/c4-policy-gradient/s1-reinforce.jsx')),
  '13-reinforcement-learning/c4-policy-gradient/s2-ppo': lazy(() => import('../subjects/13-reinforcement-learning/c4-policy-gradient/s2-ppo.jsx')),
  // 14-generative-models
  '14-generative-models/c1-vae/s1-elbo': lazy(() => import('../subjects/14-generative-models/c1-vae/s1-elbo.jsx')),
  '14-generative-models/c1-vae/s2-vae-arch': lazy(() => import('../subjects/14-generative-models/c1-vae/s2-vae-arch.jsx')),
  '14-generative-models/c2-gan/s1-gan-minimax': lazy(() => import('../subjects/14-generative-models/c2-gan/s1-gan-minimax.jsx')),
  '14-generative-models/c2-gan/s2-wgan': lazy(() => import('../subjects/14-generative-models/c2-gan/s2-wgan.jsx')),
  '14-generative-models/c3-diffusion/s1-ddpm': lazy(() => import('../subjects/14-generative-models/c3-diffusion/s1-ddpm.jsx')),
  '14-generative-models/c3-diffusion/s2-score-matching': lazy(() => import('../subjects/14-generative-models/c3-diffusion/s2-score-matching.jsx')),
  '14-generative-models/c3-diffusion/s3-cfg': lazy(() => import('../subjects/14-generative-models/c3-diffusion/s3-cfg.jsx')),
  '14-generative-models/c4-flow-matching/s1-normalizing-flows': lazy(() => import('../subjects/14-generative-models/c4-flow-matching/s1-normalizing-flows.jsx')),
  '14-generative-models/c4-flow-matching/s2-flow-matching': lazy(() => import('../subjects/14-generative-models/c4-flow-matching/s2-flow-matching.jsx')),
  // 15-bayesian
  '15-bayesian/c1-gaussian-processes/s1-gp-prior': lazy(() => import('../subjects/15-bayesian/c1-gaussian-processes/s1-gp-prior.jsx')),
  '15-bayesian/c1-gaussian-processes/s2-gp-posterior': lazy(() => import('../subjects/15-bayesian/c1-gaussian-processes/s2-gp-posterior.jsx')),
  '15-bayesian/c2-variational-inference/s1-mean-field': lazy(() => import('../subjects/15-bayesian/c2-variational-inference/s1-mean-field.jsx')),
  '15-bayesian/c2-variational-inference/s2-bbvi': lazy(() => import('../subjects/15-bayesian/c2-variational-inference/s2-bbvi.jsx')),
  '15-bayesian/c3-probabilistic-programming/s1-ppl': lazy(() => import('../subjects/15-bayesian/c3-probabilistic-programming/s1-ppl.jsx')),
  '15-bayesian/c3-probabilistic-programming/s2-hamiltonian': lazy(() => import('../subjects/15-bayesian/c3-probabilistic-programming/s2-hamiltonian.jsx')),
  '15-bayesian/c4-bayesian-deep-learning/s1-bnn': lazy(() => import('../subjects/15-bayesian/c4-bayesian-deep-learning/s1-bnn.jsx')),
  '15-bayesian/c4-bayesian-deep-learning/s2-laplace': lazy(() => import('../subjects/15-bayesian/c4-bayesian-deep-learning/s2-laplace.jsx')),
  '15-bayesian/c4-bayesian-deep-learning/s3-mc-dropout': lazy(() => import('../subjects/15-bayesian/c4-bayesian-deep-learning/s3-mc-dropout.jsx')),
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300 dark:text-indigo-700" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function ComingSoonPlaceholder({ section }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 px-8 py-16 text-center dark:border-indigo-800/40 dark:bg-indigo-950/10"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <BookIcon />
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Content Coming Soon
        </h2>
        <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          The interactive content for{' '}
          <strong className="font-semibold text-gray-700 dark:text-gray-300">
            {section.title}
          </strong>{' '}
          is being prepared. It will include formal definitions, theorems with proofs,
          interactive visualizations, and Python examples.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {['Theory', 'Proofs', 'Visualizations', 'Exercises'].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function SectionContent({ subjectId, chapterId, sectionId, section }) {
  const key = `${subjectId}/${chapterId}/${sectionId}`
  const ContentComponent = CONTENT_REGISTRY[key]
  if (ContentComponent) {
    return (
      <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading content…</div>}>
        <ContentComponent />
      </Suspense>
    )
  }
  return <ComingSoonPlaceholder section={section} />
}

export default function SectionPage() {
  const { subjectId, chapterId, sectionId } = useParams()
  const { isComplete, markComplete } = useProgress()

  const subject = getCurriculumById(subjectId)
  const chapter = getChapterById(subjectId, chapterId)
  const section = getSectionById(subjectId, chapterId, sectionId)
  const done = isComplete(subjectId, chapterId, sectionId)

  if (!subject || !chapter || !section) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl" aria-hidden="true">∅</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Section Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Could not find section "{sectionId}".
        </p>
        <Link
          to="/"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentSections(subjectId, chapterId, sectionId)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: subject.title, href: `/subjects/${subjectId}` },
    { label: chapter.title, href: `/subjects/${subjectId}/${chapterId}` },
    { label: section.title },
  ]

  function handleMarkComplete() {
    if (!done) {
      markComplete(subjectId, chapterId, sectionId)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Section Header */}
      <div
        className="relative border-b border-gray-200 dark:border-gray-800"
        style={{ background: `linear-gradient(135deg, ${subject.colorHex}10 0%, transparent 50%)` }}
      >
        <div
          className="absolute left-0 top-0 h-full w-1.5"
          style={{ backgroundColor: subject.colorHex }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl px-6 py-8 pl-10">
          <Breadcrumbs items={breadcrumbs} />

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl leading-snug">
              {section.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <DifficultyBadge level={section.difficulty} />
              {section.readingMinutes && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon />
                  {section.readingMinutes} min read
                </span>
              )}
              {done && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckIcon />
                  Completed
                </span>
              )}
            </div>

            {section.description && (
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content area */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Dynamically loaded content or "Coming Soon" */}
        <SectionContent
          subjectId={subjectId}
          chapterId={chapterId}
          sectionId={sectionId}
          section={section}
        />

        {/* Mark as complete */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={done}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
              done
                ? 'cursor-default bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
            aria-label={done ? 'Section already marked complete' : 'Mark this section as complete'}
          >
            {done ? (
              <>
                <CheckIcon />
                Marked as Complete
              </>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>

        {/* Prev / Next navigation */}
        <PrevNextNav prev={prev} next={next} />
      </div>
    </div>
  )
}
