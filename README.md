# Math4AI

An interactive web book covering the mathematics behind AI and machine learning — from foundational logic and proofs through neural networks, transformers, and generative models.

**[Read the Book](https://shankarpandala.github.io/math4ai)**

## What This Is

Math4AI is a free, open-source interactive textbook that teaches mathematics for AI/ML with a progressive learning flow. Each topic builds on the previous one, like chapters in a book — not isolated wiki pages.

The curriculum covers 15 subjects with 450+ sections, including formal definitions, theorems with proofs, interactive visualizations, Python examples, and exercises.

## Curriculum

The subjects follow a prerequisite-based learning path:

### Phase 1 — Foundations
| Subject | Topics | Prerequisites |
|---------|--------|---------------|
| **Mathematical Foundations** | Logic, proofs, sets, functions, real numbers, sequences, topology | None |
| **Linear Algebra** | Vectors, matrices, eigenvalues, SVD, PCA | Foundations |
| **Calculus & Analysis** | Limits, derivatives, integrals, multivariable calculus, measure theory | Foundations |

### Phase 2 — Core ML Math
| Subject | Topics | Prerequisites |
|---------|--------|---------------|
| **Probability Theory** | Random variables, distributions, limit theorems, Markov chains | Foundations, Calculus |
| **Statistics & Inference** | MLE, hypothesis testing, regression, Bayesian statistics | Probability |
| **Optimization** | Convexity, gradient descent, SGD, Adam, constrained optimization | Linear Algebra, Calculus |

### Phase 3 — Deep Learning
| Subject | Topics | Prerequisites |
|---------|--------|---------------|
| **Neural Networks** | MLPs, backpropagation, CNNs, RNNs, training techniques | Linear Algebra, Calculus, Probability, Optimization |
| **Information Theory** | Entropy, KL divergence, mutual information, coding theory | Probability |
| **Transformers & Attention** | Self-attention, positional encoding, FlashAttention, LLM training | Linear Algebra, Neural Networks |

### Phase 4 — Advanced Topics
| Subject | Topics | Prerequisites |
|---------|--------|---------------|
| **Numerical Methods** | Numerical linear algebra, ODE solvers, neural ODEs | Linear Algebra, Calculus |
| **Graph Theory** | Spectral methods, GNNs, message passing | Linear Algebra |
| **Vector Search & Embeddings** | Word2Vec, ANN algorithms, RAG | Linear Algebra, Probability |
| **Reinforcement Learning** | MDPs, Q-learning, policy gradient, PPO | Probability, Optimization |
| **Generative Models** | VAEs, GANs, diffusion models, flow matching | Probability, Optimization, Neural Networks |
| **Bayesian & Probabilistic ML** | Gaussian processes, variational inference, BNNs | Probability, Statistics, Optimization |

## Features

- **Progressive learning flow** — Topics build on each other with explicit "builds on" links between sections
- **Cross-subject navigation** — Prev/Next buttons bridge across subjects for continuous reading
- **Interactive visualizations** — Explore concepts with sliders, plots, and animated diagrams
- **Formal math** — LaTeX-rendered definitions, theorems, and proofs
- **Python examples** — NumPy/SciPy code for every concept
- **Progress tracking** — Mark sections complete, track progress per subject
- **Dark mode** — Full dark/light theme support

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173/math4ai/](http://localhost:5173/math4ai/) in your browser.

## Tech Stack

- **React 19** + **Vite** — Fast builds with per-subject code splitting
- **React Router v7** — Hash-based routing for GitHub Pages
- **Tailwind CSS v4** — Utility-first styling
- **KaTeX** — LaTeX math rendering
- **Mafs** + **D3.js** + **Recharts** — Interactive visualizations
- **Framer Motion** — Smooth animations
- **Zustand** — State management with localStorage persistence

## Contributing

Content is organized as JSX files in `src/subjects/`. Each subject has its own folder with chapters and sections:

```
src/subjects/
  01-foundations/
    c1-logic-proofs/
      s1-propositions.jsx
      s2-proof-techniques.jsx
      ...
  02-linear-algebra/
    ...
```

The curriculum structure is defined in `src/subjects/index.js` — the single source of truth for all subject, chapter, and section metadata.

## License

MIT
