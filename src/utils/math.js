/**
 * Math utility functions for Math4AI visualizations and computations.
 */

/**
 * Returns array of n evenly spaced values from start to end (inclusive).
 */
export function linspace(start, end, n) {
  if (n < 2) return [start];
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/**
 * Returns {X, Y} 2D arrays (meshgrid).
 * X[i][j] = xs[j], Y[i][j] = ys[i]
 */
export function meshgrid(xs, ys) {
  const X = ys.map(() => [...xs]);
  const Y = ys.map((y) => xs.map(() => y));
  return { X, Y };
}

/**
 * Gaussian (Normal) probability density function.
 */
export function normalPdf(x, mu = 0, sigma = 1) {
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return coeff * Math.exp(exponent);
}

/**
 * Gaussian (Normal) cumulative distribution function.
 * Uses the error function approximation.
 */
export function normalCdf(x, mu = 0, sigma = 1) {
  const z = (x - mu) / (sigma * Math.SQRT2);
  return 0.5 * (1 + erf(z));
}

/**
 * Error function approximation (Abramowitz and Stegun 7.1.26).
 */
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly =
    t *
    (0.254829592 +
      t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return sign * (1 - poly * Math.exp(-x * x));
}

/**
 * Sigmoid activation function.
 */
export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * ReLU activation function.
 */
export function relu(x) {
  return Math.max(0, x);
}

/**
 * Hyperbolic tangent activation function.
 */
export function tanh(x) {
  return Math.tanh(x);
}

/**
 * GELU activation function (Gaussian Error Linear Unit).
 * Approximation: 0.5 * x * (1 + tanh(sqrt(2/pi) * (x + 0.044715 * x^3)))
 */
export function gelu(x) {
  const c = Math.sqrt(2 / Math.PI);
  return 0.5 * x * (1 + Math.tanh(c * (x + 0.044715 * Math.pow(x, 3))));
}

/**
 * Swish activation function (x * sigmoid(x)).
 */
export function swish(x) {
  return x * sigmoid(x);
}

/**
 * Softmax of an array. Returns array of probabilities summing to 1.
 */
export function softmax(arr) {
  const maxVal = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/**
 * Shannon entropy H(p) = -sum(p_i * log2(p_i)).
 */
export function entropy(probs) {
  return probs.reduce((acc, p) => {
    if (p <= 0) return acc;
    return acc - p * Math.log2(p);
  }, 0);
}

/**
 * KL divergence KL(p || q) = sum(p_i * log(p_i / q_i)).
 */
export function klDivergence(p, q) {
  return p.reduce((acc, pi, i) => {
    if (pi <= 0) return acc;
    if (q[i] <= 0) return acc + Infinity;
    return acc + pi * Math.log(pi / q[i]);
  }, 0);
}

/**
 * Cosine similarity between two vectors (arrays of equal length).
 */
export function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

/**
 * Matrix multiplication of 2D arrays A (m x k) and B (k x n).
 * Returns result matrix C (m x n).
 */
export function matMul(A, B) {
  const m = A.length;
  const k = A[0].length;
  const n = B[0].length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let l = 0; l < k; l++) {
        sum += A[i][l] * B[l][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

/**
 * Eigenvalues of 2x2 matrix [[a, b], [c, d]].
 * Returns [lambda1, lambda2] (real or complex as {re, im} objects).
 */
export function eigenvalues2x2(a, b, c, d) {
  const trace = a + d;
  const det = a * d - b * c;
  const discriminant = trace * trace - 4 * det;

  if (discriminant >= 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    return [
      { re: (trace + sqrtDisc) / 2, im: 0 },
      { re: (trace - sqrtDisc) / 2, im: 0 },
    ];
  } else {
    const sqrtDisc = Math.sqrt(-discriminant);
    return [
      { re: trace / 2, im: sqrtDisc / 2 },
      { re: trace / 2, im: -sqrtDisc / 2 },
    ];
  }
}
