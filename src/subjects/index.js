/**
 * Curriculum registry for Math4AI.
 * Defines all 15 subjects, their chapters, and sections.
 */

export const CURRICULUM = [
  {
    id: '01-foundations',
    title: 'Mathematical Foundations',
    icon: '∑',
    colorHex: '#6366f1',
    description: 'Logic, proofs, real analysis, and the mathematical language underpinning all of ML.',
    prerequisites: [],
    mlRelevance: 85,
    estimatedHours: 40,
    difficulty: 'beginner',
    chapters: [
      {
        id: 'c1-logic-proofs',
        title: 'Logic & Proofs',
        description: 'Propositional logic, predicate logic, proof techniques.',
        difficulty: 'beginner',
        estimatedMinutes: 240,
        sections: [
          { id: 's1-propositions', title: 'Propositions & Connectives', difficulty: 'beginner', readingMinutes: 20, description: 'Truth tables, logical operators.' },
          { id: 's2-proof-techniques', title: 'Proof Techniques', difficulty: 'beginner', readingMinutes: 30, description: 'Direct, contrapositive, contradiction.' },
          { id: 's3-induction', title: 'Mathematical Induction', difficulty: 'beginner', readingMinutes: 25, description: 'Weak and strong induction.' },
        ],
      },
      {
        id: 'c2-real-numbers',
        title: 'Real Numbers & Sequences',
        description: 'The real line, completeness, limits, and sequences.',
        difficulty: 'beginner',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-real-line', title: 'The Real Number System', difficulty: 'beginner', readingMinutes: 20, description: 'Axioms, order, completeness.' },
          { id: 's2-sequences', title: 'Sequences & Limits', difficulty: 'beginner', readingMinutes: 30, description: 'Convergence, Cauchy sequences.' },
          { id: 's3-series', title: 'Series & Convergence', difficulty: 'intermediate', readingMinutes: 35, description: 'Convergence tests, power series.' },
        ],
      },
      {
        id: 'c3-topology',
        title: 'Basic Topology',
        description: 'Open/closed sets, compactness, continuity.',
        difficulty: 'intermediate',
        estimatedMinutes: 280,
        sections: [
          { id: 's1-metric-spaces', title: 'Metric Spaces', difficulty: 'intermediate', readingMinutes: 30, description: 'Distance functions, balls, open sets.' },
          { id: 's2-continuity', title: 'Continuity & Homeomorphisms', difficulty: 'intermediate', readingMinutes: 28, description: 'Continuous maps, topological equivalence.' },
          { id: 's3-compactness', title: 'Compactness & Connectedness', difficulty: 'intermediate', readingMinutes: 32, description: 'Heine-Borel, connected spaces.' },
        ],
      },
      {
        id: 'c4-differentiation',
        title: 'Differentiation',
        description: 'Derivatives, chain rule, mean value theorem.',
        difficulty: 'beginner',
        estimatedMinutes: 260,
        sections: [
          { id: 's1-derivatives', title: 'Derivatives & Rules', difficulty: 'beginner', readingMinutes: 22, description: 'Limit definition, product, quotient, chain rules.' },
          { id: 's2-mvt', title: 'Mean Value Theorem', difficulty: 'beginner', readingMinutes: 20, description: "Rolle's, MVT, L'Hôpital's rule." },
        ],
      },
      {
        id: 'c5-integration',
        title: 'Integration',
        description: 'Riemann integral, fundamental theorem, techniques.',
        difficulty: 'beginner',
        estimatedMinutes: 270,
        sections: [
          { id: 's1-riemann', title: 'Riemann Integral', difficulty: 'beginner', readingMinutes: 25, description: 'Partitions, Riemann sums, integrability.' },
          { id: 's2-ftc', title: 'Fundamental Theorem of Calculus', difficulty: 'beginner', readingMinutes: 20, description: 'Both parts, antiderivatives.' },
        ],
      },
      {
        id: 'c6-multivariable',
        title: 'Multivariable Analysis',
        description: 'Partial derivatives, gradients, Jacobians.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-partial-derivatives', title: 'Partial Derivatives', difficulty: 'intermediate', readingMinutes: 25, description: 'Partial derivatives, gradients.' },
          { id: 's2-jacobian', title: 'Jacobian & Chain Rule', difficulty: 'intermediate', readingMinutes: 28, description: 'Jacobian matrix, multivariable chain rule.' },
          { id: 's3-optimization', title: 'Optimization Conditions', difficulty: 'intermediate', readingMinutes: 30, description: 'Critical points, Hessian, saddle points.' },
        ],
      },
    ],
  },
  {
    id: '02-linear-algebra',
    title: 'Linear Algebra',
    icon: '⊕',
    colorHex: '#8b5cf6',
    description: 'Vectors, matrices, transformations, eigenvalues — the core language of ML and neural networks.',
    prerequisites: ['01-foundations'],
    mlRelevance: 98,
    estimatedHours: 50,
    difficulty: 'beginner',
    chapters: [
      {
        id: 'c1-vector-spaces',
        title: 'Vector Spaces',
        description: 'Vectors, subspaces, basis, dimension.',
        difficulty: 'beginner',
        estimatedMinutes: 280,
        sections: [
          { id: 's1-vectors', title: 'Vectors & Operations', difficulty: 'beginner', readingMinutes: 20, description: 'Rⁿ, addition, scalar multiplication.' },
          { id: 's2-subspaces', title: 'Subspaces & Span', difficulty: 'beginner', readingMinutes: 25, description: 'Linear independence, span.' },
          { id: 's3-basis', title: 'Basis & Dimension', difficulty: 'beginner', readingMinutes: 25, description: 'Basis theorem, coordinates.' },
        ],
      },
      {
        id: 'c2-linear-maps',
        title: 'Linear Maps & Matrices',
        description: 'Matrix multiplication, rank, null space.',
        difficulty: 'beginner',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-matrices', title: 'Matrices & Multiplication', difficulty: 'beginner', readingMinutes: 25, description: 'Matrix ops, composition.' },
          { id: 's2-rank-nullity', title: 'Rank-Nullity Theorem', difficulty: 'intermediate', readingMinutes: 30, description: 'Row space, column space, null space.' },
          { id: 's3-systems', title: 'Systems of Equations', difficulty: 'beginner', readingMinutes: 28, description: 'Gaussian elimination, row reduction.' },
        ],
      },
      {
        id: 'c3-inner-products',
        title: 'Inner Products & Norms',
        description: 'Dot product, orthogonality, projections.',
        difficulty: 'intermediate',
        estimatedMinutes: 290,
        sections: [
          { id: 's1-dot-product', title: 'Dot Product & Norms', difficulty: 'beginner', readingMinutes: 22, description: 'Euclidean inner product, vector norms.' },
          { id: 's2-orthogonality', title: 'Orthogonality & Projections', difficulty: 'intermediate', readingMinutes: 30, description: 'Orthonormal bases, projections.' },
          { id: 's3-gram-schmidt', title: 'Gram-Schmidt Process', difficulty: 'intermediate', readingMinutes: 28, description: 'Orthogonalization algorithm.' },
        ],
      },
      {
        id: 'c4-determinants',
        title: 'Determinants',
        description: 'Determinant definition, properties, applications.',
        difficulty: 'intermediate',
        estimatedMinutes: 250,
        sections: [
          { id: 's1-det-def', title: 'Definition & Properties', difficulty: 'intermediate', readingMinutes: 25, description: 'Cofactor expansion, properties.' },
          { id: 's2-det-apps', title: 'Applications', difficulty: 'intermediate', readingMinutes: 22, description: "Cramer's rule, geometric interpretation." },
        ],
      },
      {
        id: 'c5-eigentheory',
        title: 'Eigenvalues & Eigenvectors',
        description: 'Characteristic polynomial, diagonalization.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-eigenvalues', title: 'Eigenvalues & Eigenvectors', difficulty: 'intermediate', readingMinutes: 30, description: 'Characteristic polynomial, eigenspaces.' },
          { id: 's2-diagonalization', title: 'Diagonalization', difficulty: 'intermediate', readingMinutes: 28, description: 'Diagonalizable matrices, spectral theorem.' },
          { id: 's3-spectral', title: 'Spectral Theorem', difficulty: 'advanced', readingMinutes: 32, description: 'Symmetric matrices, orthogonal diagonalization.' },
        ],
      },
      {
        id: 'c6-decompositions',
        title: 'Matrix Decompositions',
        description: 'LU, QR, SVD factorizations.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-lu', title: 'LU Factorization', difficulty: 'intermediate', readingMinutes: 28, description: 'Gaussian elimination as LU.' },
          { id: 's2-qr', title: 'QR Factorization', difficulty: 'intermediate', readingMinutes: 30, description: 'Gram-Schmidt as QR.' },
          { id: 's3-svd', title: 'Singular Value Decomposition', difficulty: 'advanced', readingMinutes: 40, description: 'Full SVD, reduced SVD, geometric view.' },
        ],
      },
      {
        id: 'c7-pca',
        title: 'PCA & Dimensionality Reduction',
        description: 'Principal component analysis via SVD.',
        difficulty: 'advanced',
        estimatedMinutes: 280,
        sections: [
          { id: 's1-covariance', title: 'Covariance Matrices', difficulty: 'intermediate', readingMinutes: 25, description: 'Sample covariance, PSD matrices.' },
          { id: 's2-pca', title: 'PCA Algorithm', difficulty: 'advanced', readingMinutes: 35, description: 'Variance maximization, reconstruction.' },
        ],
      },
      {
        id: 'c8-special-matrices',
        title: 'Special Matrices',
        description: 'Symmetric, positive definite, sparse, Toeplitz.',
        difficulty: 'advanced',
        estimatedMinutes: 260,
        sections: [
          { id: 's1-psd', title: 'Positive Semidefinite Matrices', difficulty: 'advanced', readingMinutes: 30, description: 'PSD, PD definitions, Cholesky.' },
          { id: 's2-structured', title: 'Structured Matrices', difficulty: 'advanced', readingMinutes: 28, description: 'Toeplitz, circulant, sparse.' },
        ],
      },
    ],
  },
  {
    id: '03-calculus',
    title: 'Calculus & Analysis',
    icon: '∫',
    colorHex: '#06b6d4',
    description: 'Differential and integral calculus, vector calculus, and real analysis for optimization and learning theory.',
    prerequisites: ['01-foundations'],
    mlRelevance: 92,
    estimatedHours: 45,
    difficulty: 'beginner',
    chapters: [
      {
        id: 'c1-limits-continuity',
        title: 'Limits & Continuity',
        description: 'Epsilon-delta, continuity, uniform continuity.',
        difficulty: 'beginner',
        estimatedMinutes: 260,
        sections: [
          { id: 's1-limits', title: 'Limits', difficulty: 'beginner', readingMinutes: 22, description: 'Epsilon-delta definition.' },
          { id: 's2-continuity', title: 'Continuity', difficulty: 'beginner', readingMinutes: 20, description: 'Continuous functions, IVT.' },
        ],
      },
      {
        id: 'c2-differentiation',
        title: 'Single-Variable Differentiation',
        description: 'Derivative rules, Taylor series, optimization.',
        difficulty: 'beginner',
        estimatedMinutes: 280,
        sections: [
          { id: 's1-derivatives', title: 'Derivative Rules', difficulty: 'beginner', readingMinutes: 22, description: 'Product, chain, implicit differentiation.' },
          { id: 's2-taylor', title: 'Taylor & Maclaurin Series', difficulty: 'intermediate', readingMinutes: 30, description: 'Taylor approximations, remainder.' },
        ],
      },
      {
        id: 'c3-integration',
        title: 'Integration Techniques',
        description: 'Integration by parts, substitution, numerical.',
        difficulty: 'intermediate',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-techniques', title: 'Integration Techniques', difficulty: 'intermediate', readingMinutes: 30, description: 'Parts, substitution, partial fractions.' },
          { id: 's2-improper', title: 'Improper Integrals', difficulty: 'intermediate', readingMinutes: 25, description: 'Convergence of improper integrals.' },
        ],
      },
      {
        id: 'c4-multivariable',
        title: 'Multivariable Calculus',
        description: 'Partial derivatives, gradients, Hessians.',
        difficulty: 'intermediate',
        estimatedMinutes: 320,
        sections: [
          { id: 's1-gradients', title: 'Gradients & Directional Derivatives', difficulty: 'intermediate', readingMinutes: 28, description: 'Gradient vector, directional derivative.' },
          { id: 's2-hessian', title: 'Hessian Matrix', difficulty: 'intermediate', readingMinutes: 28, description: 'Second-order conditions.' },
          { id: 's3-lagrange', title: 'Lagrange Multipliers', difficulty: 'advanced', readingMinutes: 32, description: 'Constrained optimization.' },
        ],
      },
      {
        id: 'c5-vector-calculus',
        title: 'Vector Calculus',
        description: 'Divergence, curl, Stokes theorem.',
        difficulty: 'advanced',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-vector-fields', title: 'Vector Fields', difficulty: 'advanced', readingMinutes: 28, description: 'Divergence, curl, gradient fields.' },
          { id: 's2-stokes', title: "Stokes' & Divergence Theorems", difficulty: 'advanced', readingMinutes: 35, description: 'Fundamental theorems of calculus.' },
        ],
      },
      {
        id: 'c6-measure-theory',
        title: 'Measure Theory Basics',
        description: 'σ-algebras, Lebesgue integral, almost sure convergence.',
        difficulty: 'research',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-sigma-algebras', title: 'σ-Algebras & Measures', difficulty: 'research', readingMinutes: 35, description: 'Measure spaces, Borel sets.' },
          { id: 's2-lebesgue', title: 'Lebesgue Integration', difficulty: 'research', readingMinutes: 40, description: 'Lebesgue integral, convergence theorems.' },
        ],
      },
      {
        id: 'c7-functional-analysis',
        title: 'Functional Analysis Basics',
        description: 'Banach spaces, Hilbert spaces, operators.',
        difficulty: 'research',
        estimatedMinutes: 360,
        sections: [
          { id: 's1-banach', title: 'Banach & Hilbert Spaces', difficulty: 'research', readingMinutes: 38, description: 'Completeness, inner product spaces.' },
          { id: 's2-operators', title: 'Linear Operators', difficulty: 'research', readingMinutes: 35, description: 'Bounded operators, spectral theory.' },
        ],
      },
    ],
  },
  {
    id: '04-probability',
    title: 'Probability Theory',
    icon: 'P',
    colorHex: '#10b981',
    description: 'Foundations of probability, random variables, distributions, and limit theorems for statistical ML.',
    prerequisites: ['01-foundations', '03-calculus'],
    mlRelevance: 96,
    estimatedHours: 48,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-probability-spaces',
        title: 'Probability Spaces',
        description: 'Sample spaces, events, axioms.',
        difficulty: 'intermediate',
        estimatedMinutes: 260,
        sections: [
          { id: 's1-axioms', title: 'Kolmogorov Axioms', difficulty: 'intermediate', readingMinutes: 25, description: 'Probability measure, axioms.' },
          { id: 's2-conditional', title: 'Conditional Probability', difficulty: 'intermediate', readingMinutes: 28, description: "Conditioning, Bayes' theorem." },
        ],
      },
      {
        id: 'c2-random-variables',
        title: 'Random Variables',
        description: 'Discrete and continuous RVs, PMF, PDF, CDF.',
        difficulty: 'intermediate',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-discrete-rv', title: 'Discrete Random Variables', difficulty: 'intermediate', readingMinutes: 28, description: 'PMF, expected value, variance.' },
          { id: 's2-continuous-rv', title: 'Continuous Random Variables', difficulty: 'intermediate', readingMinutes: 30, description: 'PDF, CDF, expectation.' },
          { id: 's3-joint', title: 'Joint Distributions', difficulty: 'advanced', readingMinutes: 32, description: 'Joint PDF, marginals, covariance.' },
        ],
      },
      {
        id: 'c3-distributions',
        title: 'Common Distributions',
        description: 'Bernoulli, Gaussian, Poisson, Exponential.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-bernoulli-binomial', title: 'Bernoulli & Binomial', difficulty: 'beginner', readingMinutes: 22, description: 'Binomial distribution, applications.' },
          { id: 's2-gaussian', title: 'Gaussian Distribution', difficulty: 'intermediate', readingMinutes: 30, description: 'Normal distribution, MGF.' },
          { id: 's3-exponential-family', title: 'Exponential Family', difficulty: 'advanced', readingMinutes: 35, description: 'Exponential family form, natural parameters.' },
        ],
      },
      {
        id: 'c4-expectation',
        title: 'Expectation & Moments',
        description: 'Mean, variance, MGF, characteristic functions.',
        difficulty: 'intermediate',
        estimatedMinutes: 280,
        sections: [
          { id: 's1-moments', title: 'Moments & Cumulants', difficulty: 'intermediate', readingMinutes: 28, description: 'Raw, central moments, cumulants.' },
          { id: 's2-mgf', title: 'Moment Generating Functions', difficulty: 'advanced', readingMinutes: 30, description: 'MGF, characteristic function.' },
        ],
      },
      {
        id: 'c5-limit-theorems',
        title: 'Limit Theorems',
        description: 'LLN, CLT, convergence in distribution.',
        difficulty: 'advanced',
        estimatedMinutes: 320,
        sections: [
          { id: 's1-lln', title: 'Law of Large Numbers', difficulty: 'intermediate', readingMinutes: 25, description: 'Weak and strong LLN.' },
          { id: 's2-clt', title: 'Central Limit Theorem', difficulty: 'advanced', readingMinutes: 35, description: 'CLT and applications to ML.' },
        ],
      },
      {
        id: 'c6-markov-chains',
        title: 'Markov Chains',
        description: 'Transition matrices, stationary distributions, MCMC.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-markov-basics', title: 'Markov Chain Basics', difficulty: 'advanced', readingMinutes: 32, description: 'Transition matrix, Chapman-Kolmogorov.' },
          { id: 's2-stationary', title: 'Stationary Distributions', difficulty: 'advanced', readingMinutes: 30, description: 'Ergodicity, stationary distributions.' },
          { id: 's3-mcmc', title: 'MCMC Methods', difficulty: 'research', readingMinutes: 40, description: 'Metropolis-Hastings, Gibbs sampling.' },
        ],
      },
      {
        id: 'c7-information-measures',
        title: 'Probabilistic Information',
        description: 'Entropy, KL divergence, mutual information.',
        difficulty: 'advanced',
        estimatedMinutes: 290,
        sections: [
          { id: 's1-entropy', title: 'Entropy & Cross-Entropy', difficulty: 'advanced', readingMinutes: 28, description: 'Shannon entropy, cross-entropy loss.' },
          { id: 's2-kl', title: 'KL Divergence', difficulty: 'advanced', readingMinutes: 28, description: 'KL divergence, properties, applications.' },
        ],
      },
      {
        id: 'c8-concentration',
        title: 'Concentration Inequalities',
        description: "Markov, Chebyshev, Hoeffding, Bernstein.",
        difficulty: 'research',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-basic-ineq', title: 'Basic Inequalities', difficulty: 'advanced', readingMinutes: 28, description: "Markov's, Chebyshev's inequalities." },
          { id: 's2-hoeffding', title: 'Hoeffding & Bernstein', difficulty: 'research', readingMinutes: 35, description: 'Sub-Gaussian tail bounds.' },
        ],
      },
    ],
  },
  {
    id: '05-statistics',
    title: 'Statistics & Inference',
    icon: 'σ',
    colorHex: '#3b82f6',
    description: 'Statistical estimation, hypothesis testing, and regression — bridging probability theory and data analysis.',
    prerequisites: ['04-probability'],
    mlRelevance: 90,
    estimatedHours: 42,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-estimation',
        title: 'Statistical Estimation',
        description: 'MLE, MAP, unbiased estimators.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-mle', title: 'Maximum Likelihood Estimation', difficulty: 'intermediate', readingMinutes: 32, description: 'MLE derivation, properties.' },
          { id: 's2-map', title: 'MAP Estimation', difficulty: 'intermediate', readingMinutes: 28, description: 'Bayesian point estimation.' },
          { id: 's3-properties', title: 'Estimator Properties', difficulty: 'advanced', readingMinutes: 30, description: 'Bias, variance, consistency, Cramér-Rao.' },
        ],
      },
      {
        id: 'c2-hypothesis-testing',
        title: 'Hypothesis Testing',
        description: 'p-values, power, t-tests, chi-squared.',
        difficulty: 'intermediate',
        estimatedMinutes: 290,
        sections: [
          { id: 's1-framework', title: 'Testing Framework', difficulty: 'intermediate', readingMinutes: 28, description: 'Null hypothesis, Type I/II errors, p-values.' },
          { id: 's2-tests', title: 'Common Tests', difficulty: 'intermediate', readingMinutes: 30, description: 't-test, chi-squared, ANOVA.' },
        ],
      },
      {
        id: 'c3-regression',
        title: 'Regression Analysis',
        description: 'Linear regression, regularization, GLMs.',
        difficulty: 'intermediate',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-linear-regression', title: 'Linear Regression', difficulty: 'intermediate', readingMinutes: 30, description: 'OLS, geometric interpretation.' },
          { id: 's2-regularization', title: 'Ridge, Lasso, Elastic Net', difficulty: 'intermediate', readingMinutes: 32, description: 'L1/L2 regularization.' },
          { id: 's3-glm', title: 'Generalized Linear Models', difficulty: 'advanced', readingMinutes: 35, description: 'GLM framework, logistic regression.' },
        ],
      },
      {
        id: 'c4-bayesian-statistics',
        title: 'Bayesian Statistics',
        description: 'Prior/posterior, conjugate priors, Bayesian inference.',
        difficulty: 'advanced',
        estimatedMinutes: 340,
        sections: [
          { id: 's1-bayesian-framework', title: 'Bayesian Framework', difficulty: 'advanced', readingMinutes: 30, description: 'Prior, likelihood, posterior.' },
          { id: 's2-conjugate', title: 'Conjugate Priors', difficulty: 'advanced', readingMinutes: 32, description: 'Beta-Binomial, Gaussian conjugates.' },
        ],
      },
      {
        id: 'c5-information-criteria',
        title: 'Model Selection',
        description: 'AIC, BIC, cross-validation.',
        difficulty: 'intermediate',
        estimatedMinutes: 270,
        sections: [
          { id: 's1-aic-bic', title: 'AIC & BIC', difficulty: 'intermediate', readingMinutes: 25, description: 'Information criteria for model selection.' },
          { id: 's2-cross-validation', title: 'Cross-Validation', difficulty: 'intermediate', readingMinutes: 25, description: 'k-fold, LOO cross-validation.' },
        ],
      },
      {
        id: 'c6-nonparametric',
        title: 'Nonparametric Statistics',
        description: 'Kernel density estimation, bootstrap.',
        difficulty: 'advanced',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-kde', title: 'Kernel Density Estimation', difficulty: 'advanced', readingMinutes: 30, description: 'KDE, bandwidth selection.' },
          { id: 's2-bootstrap', title: 'Bootstrap Methods', difficulty: 'advanced', readingMinutes: 28, description: 'Bootstrap confidence intervals.' },
        ],
      },
      {
        id: 'c7-causal-inference',
        title: 'Causal Inference',
        description: 'Potential outcomes, DAGs, do-calculus.',
        difficulty: 'research',
        estimatedMinutes: 360,
        sections: [
          { id: 's1-potential-outcomes', title: 'Potential Outcomes Framework', difficulty: 'research', readingMinutes: 35, description: 'Rubin causal model, ATE.' },
          { id: 's2-do-calculus', title: 'Do-Calculus & DAGs', difficulty: 'research', readingMinutes: 38, description: 'Causal graphs, intervention distributions.' },
        ],
      },
    ],
  },
  {
    id: '06-information-theory',
    title: 'Information Theory',
    icon: 'H',
    colorHex: '#f59e0b',
    description: 'Entropy, mutual information, coding theory, and their deep connections to learning and compression.',
    prerequisites: ['04-probability'],
    mlRelevance: 88,
    estimatedHours: 35,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-entropy',
        title: 'Entropy & Information',
        description: 'Shannon entropy, differential entropy.',
        difficulty: 'intermediate',
        estimatedMinutes: 290,
        sections: [
          { id: 's1-shannon-entropy', title: 'Shannon Entropy', difficulty: 'intermediate', readingMinutes: 28, description: 'Entropy definition, properties.' },
          { id: 's2-differential-entropy', title: 'Differential Entropy', difficulty: 'advanced', readingMinutes: 30, description: 'Continuous entropy, max entropy.' },
        ],
      },
      {
        id: 'c2-divergences',
        title: 'Divergences & Distances',
        description: 'KL, Jensen-Shannon, Wasserstein.',
        difficulty: 'advanced',
        estimatedMinutes: 320,
        sections: [
          { id: 's1-kl-divergence', title: 'KL Divergence', difficulty: 'advanced', readingMinutes: 30, description: 'KL properties, forward vs. reverse.' },
          { id: 's2-f-divergences', title: 'f-Divergences', difficulty: 'advanced', readingMinutes: 32, description: 'Variational representations.' },
          { id: 's3-wasserstein', title: 'Wasserstein Distance', difficulty: 'research', readingMinutes: 38, description: 'Optimal transport, earth mover distance.' },
        ],
      },
      {
        id: 'c3-mutual-information',
        title: 'Mutual Information',
        description: 'MI, channel capacity, data processing inequality.',
        difficulty: 'advanced',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-mutual-info', title: 'Mutual Information', difficulty: 'advanced', readingMinutes: 30, description: 'MI definition, properties.' },
          { id: 's2-channel-capacity', title: 'Channel Capacity', difficulty: 'advanced', readingMinutes: 32, description: 'Shannon capacity, coding theorem.' },
        ],
      },
      {
        id: 'c4-coding-theory',
        title: 'Source & Channel Coding',
        description: 'Huffman, arithmetic coding, error-correcting codes.',
        difficulty: 'advanced',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-source-coding', title: 'Source Coding', difficulty: 'advanced', readingMinutes: 30, description: 'Huffman coding, arithmetic coding.' },
          { id: 's2-channel-coding', title: 'Channel Coding', difficulty: 'advanced', readingMinutes: 32, description: 'Error-correcting codes, capacity.' },
        ],
      },
      {
        id: 'c5-it-ml',
        title: 'Information Theory in ML',
        description: 'MDL, IB principle, mutual information for features.',
        difficulty: 'research',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-mdl', title: 'Minimum Description Length', difficulty: 'research', readingMinutes: 35, description: 'MDL principle, model complexity.' },
          { id: 's2-ib', title: 'Information Bottleneck', difficulty: 'research', readingMinutes: 38, description: 'IB principle, deep learning connection.' },
        ],
      },
    ],
  },
  {
    id: '07-optimization',
    title: 'Optimization',
    icon: '∇',
    colorHex: '#ef4444',
    description: 'Convex and non-convex optimization, gradient methods, and the mathematical heart of training ML models.',
    prerequisites: ['02-linear-algebra', '03-calculus'],
    mlRelevance: 99,
    estimatedHours: 52,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-convex-sets',
        title: 'Convex Sets & Functions',
        description: 'Convexity, supporting hyperplanes, conjugate functions.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-convex-sets', title: 'Convex Sets', difficulty: 'intermediate', readingMinutes: 28, description: 'Convex sets, hyperplanes, cones.' },
          { id: 's2-convex-functions', title: 'Convex Functions', difficulty: 'intermediate', readingMinutes: 30, description: 'Jensen inequality, quasiconvexity.' },
          { id: 's3-conjugate', title: 'Conjugate Functions', difficulty: 'advanced', readingMinutes: 32, description: 'Legendre-Fenchel transform.' },
        ],
      },
      {
        id: 'c2-unconstrained',
        title: 'Unconstrained Optimization',
        description: 'Gradient descent, Newton, quasi-Newton methods.',
        difficulty: 'intermediate',
        estimatedMinutes: 340,
        sections: [
          { id: 's1-gradient-descent', title: 'Gradient Descent', difficulty: 'intermediate', readingMinutes: 30, description: 'GD, convergence rates, step size.' },
          { id: 's2-newton', title: "Newton's Method", difficulty: 'advanced', readingMinutes: 32, description: "Newton's and quasi-Newton (BFGS)." },
          { id: 's3-momentum', title: 'Momentum Methods', difficulty: 'intermediate', readingMinutes: 28, description: 'Heavy ball, Nesterov acceleration.' },
        ],
      },
      {
        id: 'c3-constrained',
        title: 'Constrained Optimization',
        description: 'KKT conditions, duality, primal-dual methods.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-lagrangian', title: 'Lagrangian & KKT', difficulty: 'advanced', readingMinutes: 35, description: 'KKT conditions, constraint qualifications.' },
          { id: 's2-duality', title: 'Lagrangian Duality', difficulty: 'advanced', readingMinutes: 35, description: 'Strong duality, Slater condition.' },
        ],
      },
      {
        id: 'c4-stochastic-optimization',
        title: 'Stochastic Optimization',
        description: 'SGD, Adam, variance reduction.',
        difficulty: 'advanced',
        estimatedMinutes: 360,
        sections: [
          { id: 's1-sgd', title: 'Stochastic Gradient Descent', difficulty: 'intermediate', readingMinutes: 32, description: 'SGD, mini-batch, convergence.' },
          { id: 's2-adam', title: 'Adam & Adaptive Methods', difficulty: 'intermediate', readingMinutes: 30, description: 'Adam, RMSprop, AdaGrad.' },
          { id: 's3-variance-reduction', title: 'Variance Reduction', difficulty: 'advanced', readingMinutes: 35, description: 'SVRG, SARAH, momentum variance.' },
        ],
      },
      {
        id: 'c5-second-order',
        title: 'Second-Order & Natural Gradient',
        description: 'Natural gradient, K-FAC, Hessian-free.',
        difficulty: 'research',
        estimatedMinutes: 370,
        sections: [
          { id: 's1-natural-gradient', title: 'Natural Gradient', difficulty: 'research', readingMinutes: 38, description: 'Fisher information, natural gradient descent.' },
          { id: 's2-kfac', title: 'K-FAC', difficulty: 'research', readingMinutes: 40, description: 'Kronecker-factored approximate curvature.' },
        ],
      },
    ],
  },
  {
    id: '08-numerical-methods',
    title: 'Numerical Methods',
    icon: '≈',
    colorHex: '#ec4899',
    description: 'Numerical linear algebra, ODE solvers, and computational methods critical for implementing ML algorithms.',
    prerequisites: ['02-linear-algebra', '03-calculus'],
    mlRelevance: 80,
    estimatedHours: 38,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-numerical-linalg',
        title: 'Numerical Linear Algebra',
        description: 'LU, QR, Cholesky, iterative solvers.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-direct-solvers', title: 'Direct Solvers', difficulty: 'intermediate', readingMinutes: 30, description: 'Gaussian elimination, pivoting.' },
          { id: 's2-iterative-solvers', title: 'Iterative Solvers', difficulty: 'advanced', readingMinutes: 32, description: 'CG, GMRES, Krylov methods.' },
        ],
      },
      {
        id: 'c2-numerical-optimization',
        title: 'Numerical Optimization',
        description: 'Line search, trust region, numerical differentiation.',
        difficulty: 'advanced',
        estimatedMinutes: 300,
        sections: [
          { id: 's1-line-search', title: 'Line Search Methods', difficulty: 'advanced', readingMinutes: 30, description: 'Wolfe conditions, Armijo rule.' },
          { id: 's2-numerical-diff', title: 'Numerical Differentiation', difficulty: 'intermediate', readingMinutes: 25, description: 'Finite differences, automatic differentiation.' },
        ],
      },
      {
        id: 'c3-ode-solvers',
        title: 'ODE & PDE Solvers',
        description: 'Euler, Runge-Kutta, neural ODEs.',
        difficulty: 'advanced',
        estimatedMinutes: 320,
        sections: [
          { id: 's1-euler', title: 'Euler & Runge-Kutta', difficulty: 'advanced', readingMinutes: 30, description: 'Explicit and implicit ODE solvers.' },
          { id: 's2-neural-odes', title: 'Neural ODEs', difficulty: 'research', readingMinutes: 38, description: 'Continuous depth models.' },
        ],
      },
    ],
  },
  {
    id: '09-graph-theory',
    title: 'Graph Theory',
    icon: 'G',
    colorHex: '#14b8a6',
    description: 'Graphs, spectral methods, graph neural networks, and the mathematics of relational data.',
    prerequisites: ['02-linear-algebra'],
    mlRelevance: 82,
    estimatedHours: 36,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-graph-basics',
        title: 'Graph Fundamentals',
        description: 'Vertices, edges, paths, connectivity.',
        difficulty: 'beginner',
        estimatedMinutes: 250,
        sections: [
          { id: 's1-definitions', title: 'Graph Definitions', difficulty: 'beginner', readingMinutes: 22, description: 'Directed, undirected graphs, adjacency.' },
          { id: 's2-connectivity', title: 'Connectivity & Paths', difficulty: 'beginner', readingMinutes: 22, description: 'Connected components, BFS, DFS.' },
        ],
      },
      {
        id: 'c2-spectral-graph',
        title: 'Spectral Graph Theory',
        description: 'Laplacian, eigenvalues, graph cuts.',
        difficulty: 'advanced',
        estimatedMinutes: 320,
        sections: [
          { id: 's1-laplacian', title: 'Graph Laplacian', difficulty: 'advanced', readingMinutes: 30, description: 'Laplacian matrix, eigenvalues.' },
          { id: 's2-spectral-clustering', title: 'Spectral Clustering', difficulty: 'advanced', readingMinutes: 32, description: 'Normalized cuts, spectral embedding.' },
        ],
      },
      {
        id: 'c3-gnn',
        title: 'Graph Neural Networks',
        description: 'Message passing, GCN, GAT.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-message-passing', title: 'Message Passing Framework', difficulty: 'advanced', readingMinutes: 35, description: 'MPNN, aggregation functions.' },
          { id: 's2-gcn', title: 'GCN & GAT', difficulty: 'advanced', readingMinutes: 35, description: 'Graph convolutional, attention networks.' },
        ],
      },
    ],
  },
  {
    id: '10-neural-networks',
    title: 'Neural Networks',
    icon: 'NN',
    colorHex: '#f97316',
    description: 'Feedforward networks, backpropagation, CNNs, RNNs, and the mathematics of deep learning.',
    prerequisites: ['02-linear-algebra', '03-calculus', '04-probability', '07-optimization'],
    mlRelevance: 100,
    estimatedHours: 55,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-mlp',
        title: 'Multilayer Perceptrons',
        description: 'Architecture, activations, universal approximation.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-architecture', title: 'MLP Architecture', difficulty: 'intermediate', readingMinutes: 28, description: 'Layers, weights, biases.' },
          { id: 's2-activations', title: 'Activation Functions', difficulty: 'intermediate', readingMinutes: 25, description: 'ReLU, sigmoid, tanh, GELU.' },
          { id: 's3-uat', title: 'Universal Approximation', difficulty: 'advanced', readingMinutes: 32, description: 'UAT theorem, depth vs. width.' },
        ],
      },
      {
        id: 'c2-backprop',
        title: 'Backpropagation',
        description: 'Chain rule, computational graphs, autodiff.',
        difficulty: 'advanced',
        estimatedMinutes: 340,
        sections: [
          { id: 's1-chain-rule', title: 'Chain Rule & Computation Graphs', difficulty: 'intermediate', readingMinutes: 30, description: 'Forward/backward passes.' },
          { id: 's2-autodiff', title: 'Automatic Differentiation', difficulty: 'advanced', readingMinutes: 35, description: 'Forward-mode, reverse-mode AD.' },
        ],
      },
      {
        id: 'c3-cnn',
        title: 'Convolutional Networks',
        description: 'Convolution, pooling, equivariance.',
        difficulty: 'intermediate',
        estimatedMinutes: 320,
        sections: [
          { id: 's1-convolution', title: 'Convolution Operation', difficulty: 'intermediate', readingMinutes: 28, description: 'Discrete convolution, feature maps.' },
          { id: 's2-cnn-arch', title: 'CNN Architectures', difficulty: 'intermediate', readingMinutes: 30, description: 'LeNet, VGG, ResNet.' },
        ],
      },
      {
        id: 'c4-rnn',
        title: 'Recurrent Networks',
        description: 'RNN, LSTM, GRU, vanishing gradients.',
        difficulty: 'advanced',
        estimatedMinutes: 340,
        sections: [
          { id: 's1-rnn', title: 'Vanilla RNN', difficulty: 'advanced', readingMinutes: 30, description: 'Recurrent computation, BPTT.' },
          { id: 's2-lstm', title: 'LSTM & GRU', difficulty: 'advanced', readingMinutes: 35, description: 'Gating mechanisms, long-range dependencies.' },
        ],
      },
      {
        id: 'c5-training',
        title: 'Training Deep Networks',
        description: 'Normalization, regularization, initialization.',
        difficulty: 'advanced',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-normalization', title: 'Batch & Layer Normalization', difficulty: 'advanced', readingMinutes: 30, description: 'BatchNorm, LayerNorm, GroupNorm.' },
          { id: 's2-regularization', title: 'Regularization Techniques', difficulty: 'intermediate', readingMinutes: 28, description: 'Dropout, weight decay, data augmentation.' },
          { id: 's3-initialization', title: 'Weight Initialization', difficulty: 'advanced', readingMinutes: 28, description: 'He, Xavier, spectral normalization.' },
        ],
      },
    ],
  },
  {
    id: '11-transformers',
    title: 'Transformers & Attention',
    icon: '⚡',
    colorHex: '#a855f7',
    description: 'Self-attention, multi-head attention, positional encoding, and the architecture powering modern LLMs.',
    prerequisites: ['02-linear-algebra', '10-neural-networks'],
    mlRelevance: 100,
    estimatedHours: 50,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-attention',
        title: 'Attention Mechanisms',
        description: 'Scaled dot-product, multi-head, cross-attention.',
        difficulty: 'advanced',
        estimatedMinutes: 340,
        sections: [
          { id: 's1-sdp-attention', title: 'Scaled Dot-Product Attention', difficulty: 'advanced', readingMinutes: 35, description: 'Q, K, V matrices, softmax.' },
          { id: 's2-multihead', title: 'Multi-Head Attention', difficulty: 'advanced', readingMinutes: 35, description: 'Multiple attention heads, concatenation.' },
          { id: 's3-cross-attention', title: 'Cross-Attention', difficulty: 'advanced', readingMinutes: 30, description: 'Encoder-decoder attention.' },
        ],
      },
      {
        id: 'c2-transformer-arch',
        title: 'Transformer Architecture',
        description: 'Encoder, decoder, feed-forward, layer norm.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-encoder', title: 'Transformer Encoder', difficulty: 'advanced', readingMinutes: 32, description: 'Encoder block, pre/post-norm.' },
          { id: 's2-decoder', title: 'Transformer Decoder', difficulty: 'advanced', readingMinutes: 32, description: 'Causal masking, autoregressive decoding.' },
        ],
      },
      {
        id: 'c3-positional-encoding',
        title: 'Positional Encoding',
        description: 'Sinusoidal, learned, RoPE, ALiBi.',
        difficulty: 'advanced',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-sinusoidal', title: 'Sinusoidal Encoding', difficulty: 'advanced', readingMinutes: 28, description: 'Original PE, interpolation.' },
          { id: 's2-rope', title: 'RoPE & ALiBi', difficulty: 'research', readingMinutes: 35, description: 'Rotary, relative position encodings.' },
        ],
      },
      {
        id: 'c4-efficient-attention',
        title: 'Efficient Attention',
        description: 'FlashAttention, linear attention, sparse attention.',
        difficulty: 'research',
        estimatedMinutes: 370,
        sections: [
          { id: 's1-flash-attention', title: 'FlashAttention', difficulty: 'research', readingMinutes: 40, description: 'IO-aware attention, tiling.' },
          { id: 's2-linear-attention', title: 'Linear Attention', difficulty: 'research', readingMinutes: 38, description: 'Kernel approximations, O(n) attention.' },
        ],
      },
      {
        id: 'c5-llm-training',
        title: 'LLM Training & Scaling',
        description: 'Pre-training, fine-tuning, RLHF, scaling laws.',
        difficulty: 'research',
        estimatedMinutes: 390,
        sections: [
          { id: 's1-pretraining', title: 'Pre-Training Objectives', difficulty: 'advanced', readingMinutes: 35, description: 'CLM, MLM, prefix LM.' },
          { id: 's2-finetuning', title: 'Fine-Tuning & RLHF', difficulty: 'research', readingMinutes: 40, description: 'SFT, RLHF, DPO.' },
          { id: 's3-scaling-laws', title: 'Scaling Laws', difficulty: 'research', readingMinutes: 38, description: 'Chinchilla laws, compute-optimal training.' },
        ],
      },
    ],
  },
  {
    id: '12-vector-search',
    title: 'Vector Search & Embeddings',
    icon: '⊂',
    colorHex: '#0ea5e9',
    description: 'Embedding spaces, similarity search, ANN algorithms, and the mathematics of semantic retrieval.',
    prerequisites: ['02-linear-algebra', '04-probability'],
    mlRelevance: 94,
    estimatedHours: 38,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-embedding-spaces',
        title: 'Embedding Spaces',
        description: 'Word2Vec, sentence embeddings, metric learning.',
        difficulty: 'intermediate',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-word2vec', title: 'Word2Vec & GloVe', difficulty: 'intermediate', readingMinutes: 30, description: 'Skip-gram, CBOW, matrix factorization view.' },
          { id: 's2-sentence-embeddings', title: 'Sentence Embeddings', difficulty: 'intermediate', readingMinutes: 28, description: 'Sentence-BERT, SimCSE.' },
          { id: 's3-metric-learning', title: 'Metric Learning', difficulty: 'advanced', readingMinutes: 32, description: 'Contrastive, triplet, InfoNCE loss.' },
        ],
      },
      {
        id: 'c2-similarity-search',
        title: 'Similarity & Distance',
        description: 'Cosine, Euclidean, dot product, Jaccard.',
        difficulty: 'intermediate',
        estimatedMinutes: 270,
        sections: [
          { id: 's1-distance-metrics', title: 'Distance Metrics', difficulty: 'intermediate', readingMinutes: 25, description: 'L1, L2, cosine, Mahalanobis.' },
          { id: 's2-inner-product-spaces', title: 'Inner Product Spaces for Search', difficulty: 'intermediate', readingMinutes: 25, description: 'MIPS, retrieval scoring.' },
        ],
      },
      {
        id: 'c3-ann-algorithms',
        title: 'ANN Search Algorithms',
        description: 'HNSW, IVF, PQ, ScaNN.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-hnsw', title: 'HNSW', difficulty: 'advanced', readingMinutes: 35, description: 'Hierarchical navigable small world graphs.' },
          { id: 's2-ivf-pq', title: 'IVF & Product Quantization', difficulty: 'advanced', readingMinutes: 35, description: 'Inverted index, PQ compression.' },
        ],
      },
      {
        id: 'c4-rag',
        title: 'Retrieval-Augmented Generation',
        description: 'RAG architectures, dense retrieval, re-ranking.',
        difficulty: 'advanced',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-dense-retrieval', title: 'Dense Retrieval', difficulty: 'advanced', readingMinutes: 30, description: 'DPR, bi-encoder, ColBERT.' },
          { id: 's2-rag-arch', title: 'RAG Architecture', difficulty: 'advanced', readingMinutes: 32, description: 'Retrieval-generation pipeline.' },
        ],
      },
    ],
  },
  {
    id: '13-reinforcement-learning',
    title: 'Reinforcement Learning',
    icon: 'R',
    colorHex: '#84cc16',
    description: 'MDPs, policy gradient, Q-learning, and the mathematics of sequential decision making.',
    prerequisites: ['04-probability', '07-optimization'],
    mlRelevance: 88,
    estimatedHours: 48,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-mdp',
        title: 'Markov Decision Processes',
        description: 'States, actions, rewards, Bellman equations.',
        difficulty: 'advanced',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-mdp-framework', title: 'MDP Framework', difficulty: 'advanced', readingMinutes: 32, description: 'State, action, reward, transition.' },
          { id: 's2-bellman', title: 'Bellman Equations', difficulty: 'advanced', readingMinutes: 35, description: 'Value functions, Bellman optimality.' },
        ],
      },
      {
        id: 'c2-dynamic-programming',
        title: 'Dynamic Programming',
        description: 'Policy evaluation, value iteration, policy iteration.',
        difficulty: 'advanced',
        estimatedMinutes: 310,
        sections: [
          { id: 's1-value-iteration', title: 'Value Iteration', difficulty: 'advanced', readingMinutes: 30, description: 'Value iteration algorithm, convergence.' },
          { id: 's2-policy-iteration', title: 'Policy Iteration', difficulty: 'advanced', readingMinutes: 28, description: 'Policy evaluation and improvement.' },
        ],
      },
      {
        id: 'c3-model-free',
        title: 'Model-Free RL',
        description: 'Q-learning, SARSA, TD methods.',
        difficulty: 'advanced',
        estimatedMinutes: 340,
        sections: [
          { id: 's1-q-learning', title: 'Q-Learning', difficulty: 'advanced', readingMinutes: 30, description: 'Off-policy TD control.' },
          { id: 's2-dqn', title: 'Deep Q-Networks', difficulty: 'advanced', readingMinutes: 35, description: 'DQN, experience replay, target network.' },
        ],
      },
      {
        id: 'c4-policy-gradient',
        title: 'Policy Gradient Methods',
        description: 'REINFORCE, actor-critic, PPO.',
        difficulty: 'advanced',
        estimatedMinutes: 360,
        sections: [
          { id: 's1-reinforce', title: 'REINFORCE', difficulty: 'advanced', readingMinutes: 30, description: 'Policy gradient theorem, REINFORCE.' },
          { id: 's2-ppo', title: 'PPO & Actor-Critic', difficulty: 'research', readingMinutes: 38, description: 'A3C, PPO, clipped objective.' },
        ],
      },
    ],
  },
  {
    id: '14-generative-models',
    title: 'Generative Models',
    icon: '~',
    colorHex: '#f43f5e',
    description: 'VAEs, GANs, diffusion models, normalizing flows — the mathematics of generative AI.',
    prerequisites: ['04-probability', '07-optimization', '10-neural-networks'],
    mlRelevance: 97,
    estimatedHours: 52,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-vae',
        title: 'Variational Autoencoders',
        description: 'ELBO, reparameterization, latent spaces.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-elbo', title: 'ELBO & Variational Inference', difficulty: 'advanced', readingMinutes: 35, description: 'Evidence lower bound, KL term.' },
          { id: 's2-vae-arch', title: 'VAE Architecture', difficulty: 'advanced', readingMinutes: 32, description: 'Encoder-decoder, reparameterization.' },
        ],
      },
      {
        id: 'c2-gan',
        title: 'Generative Adversarial Networks',
        description: 'Minimax game, Wasserstein GAN, training stability.',
        difficulty: 'advanced',
        estimatedMinutes: 360,
        sections: [
          { id: 's1-gan-minimax', title: 'GAN Minimax Game', difficulty: 'advanced', readingMinutes: 35, description: 'Generator, discriminator, Nash equilibrium.' },
          { id: 's2-wgan', title: 'Wasserstein GAN', difficulty: 'research', readingMinutes: 38, description: 'Earth mover distance, Lipschitz constraint.' },
        ],
      },
      {
        id: 'c3-diffusion',
        title: 'Diffusion Models',
        description: 'DDPM, score matching, DDIM, classifier-free guidance.',
        difficulty: 'research',
        estimatedMinutes: 400,
        sections: [
          { id: 's1-ddpm', title: 'DDPM', difficulty: 'research', readingMinutes: 40, description: 'Forward/reverse process, training objective.' },
          { id: 's2-score-matching', title: 'Score Matching & SDE', difficulty: 'research', readingMinutes: 42, description: 'Score functions, stochastic DEs.' },
          { id: 's3-cfg', title: 'Classifier-Free Guidance', difficulty: 'research', readingMinutes: 38, description: 'Guidance scale, conditional generation.' },
        ],
      },
      {
        id: 'c4-flow-matching',
        title: 'Normalizing Flows & Flow Matching',
        description: 'Change of variables, CNFs, flow matching.',
        difficulty: 'research',
        estimatedMinutes: 380,
        sections: [
          { id: 's1-normalizing-flows', title: 'Normalizing Flows', difficulty: 'advanced', readingMinutes: 35, description: 'Change of variables, invertible maps.' },
          { id: 's2-flow-matching', title: 'Flow Matching', difficulty: 'research', readingMinutes: 40, description: 'Conditional flow matching, OT paths.' },
        ],
      },
    ],
  },
  {
    id: '15-bayesian',
    title: 'Bayesian & Probabilistic ML',
    icon: 'B',
    colorHex: '#64748b',
    description: 'Gaussian processes, variational inference, probabilistic programming, and Bayesian deep learning.',
    prerequisites: ['04-probability', '05-statistics', '07-optimization'],
    mlRelevance: 86,
    estimatedHours: 45,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-gaussian-processes',
        title: 'Gaussian Processes',
        description: 'GP prior, kernel functions, posterior inference.',
        difficulty: 'advanced',
        estimatedMinutes: 360,
        sections: [
          { id: 's1-gp-prior', title: 'GP Prior & Kernel', difficulty: 'advanced', readingMinutes: 35, description: 'Gaussian process definition, kernels.' },
          { id: 's2-gp-posterior', title: 'GP Posterior & Prediction', difficulty: 'advanced', readingMinutes: 38, description: 'Posterior GP, predictive distribution.' },
        ],
      },
      {
        id: 'c2-variational-inference',
        title: 'Variational Inference',
        description: 'Mean field, ELBO, black-box VI.',
        difficulty: 'advanced',
        estimatedMinutes: 350,
        sections: [
          { id: 's1-mean-field', title: 'Mean Field VI', difficulty: 'advanced', readingMinutes: 35, description: 'CAVI, mean field approximation.' },
          { id: 's2-bbvi', title: 'Black-Box Variational Inference', difficulty: 'research', readingMinutes: 38, description: 'BBVI, pathwise gradient.' },
        ],
      },
      {
        id: 'c3-probabilistic-programming',
        title: 'Probabilistic Programming',
        description: 'Pyro, NumPyro, Stan, inference algorithms.',
        difficulty: 'advanced',
        estimatedMinutes: 330,
        sections: [
          { id: 's1-ppl', title: 'PPL Concepts', difficulty: 'advanced', readingMinutes: 30, description: 'Probabilistic programs, inference engines.' },
          { id: 's2-hamiltonian', title: 'Hamiltonian MC', difficulty: 'research', readingMinutes: 40, description: 'HMC, NUTS, leapfrog integrator.' },
        ],
      },
      {
        id: 'c4-bayesian-deep-learning',
        title: 'Bayesian Deep Learning',
        description: 'Bayesian neural nets, Laplace approximation, MC Dropout.',
        difficulty: 'research',
        estimatedMinutes: 380,
        sections: [
          { id: 's1-bnn', title: 'Bayesian Neural Networks', difficulty: 'research', readingMinutes: 38, description: 'Weight distributions, posterior inference.' },
          { id: 's2-laplace', title: 'Laplace Approximation', difficulty: 'research', readingMinutes: 35, description: 'Gaussian approx around MAP, Hessian.' },
          { id: 's3-mc-dropout', title: 'MC Dropout & Uncertainty', difficulty: 'advanced', readingMinutes: 30, description: 'Dropout as approximate inference.' },
        ],
      },
    ],
  },
];

/**
 * Get a subject by ID.
 */
export function getCurriculumById(subjectId) {
  return CURRICULUM.find((s) => s.id === subjectId) || null;
}

/**
 * Get a chapter by subjectId and chapterId.
 */
export function getChapterById(subjectId, chapterId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return null;
  return subject.chapters.find((c) => c.id === chapterId) || null;
}

/**
 * Get a section by subjectId, chapterId, sectionId.
 */
export function getSectionById(subjectId, chapterId, sectionId) {
  const chapter = getChapterById(subjectId, chapterId);
  if (!chapter) return null;
  return chapter.sections.find((s) => s.id === sectionId) || null;
}

/**
 * Get total section count for a subject.
 */
export function getSubjectSectionCount(subjectId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return 0;
  return subject.chapters.reduce((acc, ch) => acc + (ch.sections?.length || 0), 0);
}

/**
 * Get adjacent sections (prev/next) across entire subject.
 * Returns { prev, next } where each has { title, subjectId, chapterId, sectionId } or null.
 */
export function getAdjacentSections(subjectId, chapterId, sectionId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return { prev: null, next: null };

  const flat = [];
  for (const ch of subject.chapters) {
    for (const sec of ch.sections || []) {
      flat.push({ title: sec.title, subjectId, chapterId: ch.id, sectionId: sec.id });
    }
  }

  const idx = flat.findIndex(
    (s) => s.chapterId === chapterId && s.sectionId === sectionId
  );

  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export default CURRICULUM;
