import{j as e,r as M}from"./vendor-JIDYfPag.js";import{r as t}from"./vendor-katex-Pf_QKVW_.js";import{N as S,D as T,T as X,P as H,W as D,R as Q,E as F}from"./subject-01-foundations-p2F_xSGC.js";import{R as G,L as V,C as U,X as J,Y as ee,T as te,b as ie,c as ne,d as B}from"./vendor-charts-Ccq586Dw.js";function Z(i){return i<=0||i>=1?0:-(i*Math.log2(i)+(1-i)*Math.log2(1-i))}const ae=Array.from({length:201},(i,$)=>{const r=$/200;return{p:parseFloat(r.toFixed(3)),H:parseFloat(Z(r).toFixed(5))}});function se({active:i,payload:$}){if(!i||!$||!$.length)return null;const{p:r,H:c}=$[0].payload;return e.jsxs("div",{className:"rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800",children:[e.jsxs("p",{className:"font-mono text-gray-600 dark:text-gray-400",children:["p = ",e.jsx("strong",{children:r.toFixed(3)})]}),e.jsxs("p",{className:"font-mono text-indigo-600 dark:text-indigo-400",children:["H(p) = ",e.jsxs("strong",{children:[c.toFixed(4)," bits"]})]})]})}function re(){const[i,$]=M.useState(.5),r=M.useMemo(()=>Z(i),[i]);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Binary Entropy Function"}),e.jsxs("p",{className:"mb-5 text-sm text-gray-500 dark:text-gray-400",children:["For a Bernoulli(",e.jsx(t.InlineMath,{math:"p"}),") random variable:",e.jsx("span",{className:"ml-2 font-mono",children:"H(p) = −p log₂ p − (1−p) log₂(1−p)"})]}),e.jsxs("div",{className:"mb-6 flex items-center gap-4",children:[e.jsx("label",{className:"w-20 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300",children:"p ="}),e.jsx("input",{type:"range",min:.01,max:.99,step:.01,value:i,onChange:c=>$(parseFloat(c.target.value)),className:"h-2 flex-1 cursor-pointer accent-indigo-500"}),e.jsx("span",{className:"w-14 text-right font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:i.toFixed(2)})]}),e.jsxs("div",{className:"mb-5 flex items-center justify-center gap-6",children:[e.jsxs("div",{className:"rounded-lg bg-indigo-50 px-5 py-3 text-center dark:bg-indigo-950/30",children:[e.jsx("p",{className:"text-xs text-indigo-500 dark:text-indigo-400",children:"Current entropy"}),e.jsx("p",{className:"mt-0.5 font-mono text-2xl font-bold text-indigo-700 dark:text-indigo-300",children:r.toFixed(4)}),e.jsx("p",{className:"text-xs text-indigo-500 dark:text-indigo-400",children:"bits"})]}),e.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:r<.05?e.jsx("span",{className:"text-green-600 dark:text-green-400 font-medium",children:"Near-certain outcome — almost no information"}):r>.95?e.jsx("span",{className:"text-red-600 dark:text-red-400 font-medium",children:"Near-maximum uncertainty — ~1 bit of information"}):e.jsxs("span",{children:["Intermediate uncertainty — ",(r*100).toFixed(1),"% of maximum"]})})]}),e.jsx("div",{style:{height:260},children:e.jsx(G,{width:"100%",height:"100%",children:e.jsxs(V,{data:ae,margin:{top:8,right:20,bottom:8,left:0},children:[e.jsx(U,{strokeDasharray:"3 3",stroke:"#e5e7eb",className:"dark:stroke-gray-700"}),e.jsx(J,{dataKey:"p",type:"number",domain:[0,1],tickCount:6,label:{value:"p",position:"insideBottomRight",offset:-4,fontSize:12},tick:{fontSize:11}}),e.jsx(ee,{domain:[0,1.1],tickCount:6,label:{value:"H(p) bits",angle:-90,position:"insideLeft",offset:10,fontSize:11},tick:{fontSize:11}}),e.jsx(te,{content:e.jsx(se,{})}),e.jsx(ie,{type:"monotone",dataKey:"H",stroke:"#6366f1",strokeWidth:2.5,dot:!1,name:"H(p)"}),e.jsx(ne,{x:i,stroke:"#f59e0b",strokeWidth:2,strokeDasharray:"5 3",label:{value:`p=${i.toFixed(2)}`,position:"top",fontSize:10,fill:"#f59e0b"}}),e.jsx(B,{x:i,y:r,r:5,fill:"#f59e0b",stroke:"#ffffff",strokeWidth:2}),e.jsx(B,{x:0,y:0,r:4,fill:"#22c55e",stroke:"#fff",strokeWidth:2,label:{value:"H(0)=0",position:"right",fontSize:9,fill:"#22c55e"}}),e.jsx(B,{x:.5,y:1,r:4,fill:"#ef4444",stroke:"#fff",strokeWidth:2,label:{value:"H(0.5)=1",position:"top",fontSize:9,fill:"#ef4444"}}),e.jsx(B,{x:1,y:0,r:4,fill:"#22c55e",stroke:"#fff",strokeWidth:2,label:{value:"H(1)=0",position:"left",fontSize:9,fill:"#22c55e"}})]})})}),e.jsxs("div",{className:"mt-3 flex justify-center gap-8 text-xs text-gray-500 dark:text-gray-400",children:[e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"inline-block h-2.5 w-2.5 rounded-full bg-green-500"}),"H = 0 (certain)"]}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"inline-block h-2.5 w-2.5 rounded-full bg-red-500"}),"H = 1 bit (max uncertainty at p=0.5)"]}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"inline-block h-2.5 w-2.5 rounded-full bg-amber-400"}),"Current p"]})]})]})}const oe=`import numpy as np

def entropy(p, base=2):
    """Shannon entropy. p is array of probabilities summing to 1."""
    p = np.asarray(p, dtype=float)
    # Avoid log(0) by masking zeros
    mask = p > 0
    return -np.sum(p[mask] * np.log(p[mask])) / np.log(base)

# Binary entropy function
def binary_entropy(p):
    return entropy([p, 1 - p])

# Examples
print(f"H(fair coin) = {binary_entropy(0.5):.4f} bits")
print(f"H(biased coin p=0.1) = {binary_entropy(0.1):.4f} bits")
print(f"H(certain outcome) = {binary_entropy(0.0):.4f} bits")

# Uniform distribution maximizes entropy
for n in [2, 4, 8, 16]:
    uniform = np.ones(n) / n
    print(f"H(Uniform({n})) = {entropy(uniform):.4f} bits = log2({n}) = {np.log2(n):.4f}")

# Cross-entropy loss (neural network training)
def cross_entropy_loss(y_true, y_pred):
    """y_true: one-hot labels, y_pred: softmax probabilities"""
    y_pred = np.clip(y_pred, 1e-15, 1.0)  # numerical stability
    return -np.sum(y_true * np.log(y_pred))

# Example: 3-class classification
y_true = np.array([0, 1, 0])          # true class = 1
y_pred_good = np.array([0.05, 0.90, 0.05])
y_pred_bad  = np.array([0.33, 0.34, 0.33])
print(f"\\nCross-entropy (good prediction): {cross_entropy_loss(y_true, y_pred_good):.4f}")
print(f"Cross-entropy (bad  prediction): {cross_entropy_loss(y_true, y_pred_bad):.4f}")

# Verify: H(p,q) = H(p) + KL(p||q)
def kl_divergence(p, q, base=2):
    p, q = np.asarray(p, float), np.asarray(q, float)
    mask = p > 0
    return np.sum(p[mask] * np.log2(p[mask] / q[mask]))

p_true = np.array([0, 1, 0])
q_pred = np.array([0.05, 0.90, 0.05])
H_p  = entropy(p_true)                          # 0 (deterministic)
KL   = kl_divergence(p_true, q_pred)
CE   = cross_entropy_loss(p_true, q_pred) / np.log(2)  # convert to bits
print(f"\\nH(p) + KL(p||q) = {H_p:.4f} + {KL:.4f} = {H_p + KL:.4f}")
print(f"H(p, q)          = {CE:.4f}  (should match above)")`,le=[{authors:"Shannon, C. E.",year:1948,title:"A Mathematical Theory of Communication",venue:"Bell System Technical Journal, 27(3), 379–423",url:"https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf",type:"foundational",whyImportant:"The founding paper of information theory. Introduced entropy, channel capacity, and source coding theorems. One of the most cited papers in science."},{authors:"Cover, T. M. & Thomas, J. A.",year:2006,title:"Elements of Information Theory (2nd ed.)",venue:"Wiley-Interscience",url:"https://www.wiley.com/en-us/Elements+of+Information+Theory%2C+2nd+Edition-p-9780471241959",type:"textbook",whyImportant:"The standard graduate textbook. Rigorous treatment of entropy, mutual information, channel coding, rate-distortion theory, and Kolmogorov complexity."},{authors:"MacKay, D. J. C.",year:2003,title:"Information Theory, Inference, and Learning Algorithms",venue:"Cambridge University Press (freely available online)",url:"https://www.inference.org.uk/mackay/itila/",type:"textbook",whyImportant:"Free online textbook connecting information theory to Bayesian inference and machine learning. Exceptionally clear exposition with exercises."},{authors:"Csiszár, I. & Shields, P. C.",year:2004,title:"Information Theory and Statistics: A Tutorial",venue:"Foundations and Trends in Communications and Information Theory, 1(4)",url:"https://www.renyi.hu/~csiszar/Publications/Information_Theory_and_Statistics:_A_Tutorial.pdf",type:"survey",whyImportant:"Connects entropy and KL divergence to statistical estimation theory, hypothesis testing, and large deviations."}];function de(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Shannon Entropy"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"The fundamental measure of uncertainty and information content in a random variable."})]}),e.jsxs(S,{type:"historical",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Claude Shannon"}),' introduced entropy in his landmark 1948 paper "A Mathematical Theory of Communication," published in the Bell System Technical Journal. The paper simultaneously founded information theory and established the mathematical foundations for digital communication.']}),e.jsxs("p",{className:"mt-2",children:["Shannon borrowed the term ",e.jsx("em",{children:"entropy"})," from thermodynamics, where Boltzmann's entropy ",e.jsx(t.InlineMath,{math:"S = k_B \\ln W"})," measures the number of microscopic states compatible with a macrostate. The mathematical parallel is exact: thermodynamic entropy and information entropy are both measures of uncertainty. According to Shannon himself, ",e.jsx("strong",{children:"John von Neumann"})," suggested the name with the quip: ",e.jsx("em",{children:'"Nobody knows what entropy really is, so in a debate you will always have the advantage."'})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-bold text-gray-800 dark:text-gray-200",children:"Motivation"}),e.jsx("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:"Entropy quantifies two dual concepts that turn out to be identical:"}),e.jsxs("ul",{className:"mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Uncertainty:"})," How unpredictable is a random variable? High entropy means many equally likely outcomes; low entropy means the distribution is peaked."]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Information content:"})," How many bits are needed on average to encode a sample? Shannon's source coding theorem proves that"," ",e.jsx(t.InlineMath,{math:"H(X)"})," is the minimum average code length in bits."]})]})]}),e.jsxs("p",{className:"mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["Applications span virtually all of machine learning and statistics: lossless data compression (Huffman codes achieve the entropy bound), neural network training (cross-entropy loss), decision tree learning (information gain for feature splitting), feature selection (mutual information), variational inference (ELBO = reconstruction − KL divergence), and language model evaluation (perplexity = ",e.jsx(t.InlineMath,{math:"2^{H}"}),")."]})]}),e.jsx(T,{label:"Definition 1.1",title:"Shannon Entropy",definition:"For a discrete random variable $X$ with alphabet $\\mathcal{X}$ and probability mass function $p$, the Shannon entropy is: $H(X) = -\\sum_{x \\in \\mathcal{X}} p(x) \\log_2 p(x) = \\mathbb{E}[-\\log_2 p(X)]$. By convention, $0 \\log 0 := 0$ (consistent with $\\lim_{p \\to 0} p \\log p = 0$).",notation:"$H(X)$ is measured in bits when using $\\log_2$, nats when using $\\ln$, and hartleys (dits) when using $\\log_{10}$. The self-information of outcome $x$ is $I(x) = -\\log_2 p(x)$ bits. Entropy is the expected self-information: $H(X) = \\mathbb{E}[I(X)]$."}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["The self-information ",e.jsx(t.InlineMath,{math:"-\\log_2 p(x)"}),' is a measure of "surprise" — a low-probability event carries high information content. Observing that a fair die rolled 1 carries ',e.jsx(t.InlineMath,{math:"\\log_2 6 \\approx 2.58"})," bits of information. Observing that a biased coin (99% heads) landed heads carries only"," ",e.jsx(t.InlineMath,{math:"-\\log_2 0.99 \\approx 0.015"})," bits — barely any surprise."]}),e.jsx(re,{}),e.jsx(X,{label:"Theorem 1.1",title:"Maximum Entropy",statement:"For a discrete random variable $X$ taking $n$ values, $H(X) \\leq \\log_2 n$, with equality if and only if $X$ is uniformly distributed over its $n$ values.",proof:"We want to maximize $H(X) = -\\sum_{i=1}^{n} p_i \\log_2 p_i$ subject to $\\sum_i p_i = 1$, $p_i \\geq 0$. Let $u_i = 1/n$ be the uniform distribution. By the log-sum inequality (a consequence of Jensen's inequality applied to the convex function $-\\log$): $\\sum_i p_i \\log(p_i/u_i) \\geq 0$ (this is the KL divergence $D_{KL}(p \\| u) \\geq 0$). Expanding: $\\sum_i p_i \\log p_i - \\sum_i p_i \\log(1/n) \\geq 0$, so $-\\sum_i p_i \\log p_i \\leq \\log n = \\sum_i p_i \\log n$. Equality holds iff $p_i = u_i$ for all $i$, i.e., iff $p$ is uniform.",corollaries:["A $k$-bit string has at most $H = k$ bits of entropy, achieved by the uniform distribution over $2^k$ strings.","The entropy of the English language is empirically around 0.6–1.3 bits per character — far below $\\log_2 26 \\approx 4.7$ bits — due to strong statistical redundancy.","This theorem justifies maximum-entropy modeling: among all distributions satisfying given constraints, the uniform (maximum-entropy) distribution makes the fewest unwarranted assumptions."]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-bold text-gray-800 dark:text-gray-200",children:"Axiomatic Characterization"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["Shannon (1948) showed that the entropy function is ",e.jsx("em",{children:"uniquely"})," determined (up to a positive multiplicative constant) by four natural axioms:"]}),e.jsxs("ol",{className:"mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("span",{className:"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",children:"1"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Continuity:"})," ",e.jsx(t.InlineMath,{math:"H(p_1, \\ldots, p_n)"})," is continuous in all"," ",e.jsx(t.InlineMath,{math:"p_i"}),"."]})]}),e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("span",{className:"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",children:"2"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Symmetry:"})," ",e.jsx(t.InlineMath,{math:"H"})," is invariant under permutation of its arguments — the entropy depends only on the probability values, not the labeling of outcomes."]})]}),e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("span",{className:"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",children:"3"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Maximum at uniformity:"})," For fixed ",e.jsx(t.InlineMath,{math:"n"}),", the uniform distribution ",e.jsx(t.InlineMath,{math:"(1/n, \\ldots, 1/n)"})," uniquely maximizes ",e.jsx(t.InlineMath,{math:"H"}),", and this maximum increases with"," ",e.jsx(t.InlineMath,{math:"n"}),"."]})]}),e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("span",{className:"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",children:"4"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Grouping (chain rule):"})," If outcomes are grouped, the entropy of the overall distribution equals the entropy of the grouping plus the conditional entropy within groups:"," ",e.jsx(t.InlineMath,{math:"H(p_1, \\ldots, p_n) = H(p_A, p_B) + p_A H(p_1/p_A, \\ldots) + p_B H(\\ldots)"}),"."]})]})]}),e.jsxs("p",{className:"mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["Khinchin (1957) proved that the ",e.jsx("em",{children:"only"})," function satisfying all four axioms is:"]}),e.jsx(t.BlockMath,{math:"H = -K \\sum_{i} p_i \\log p_i"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["for some positive constant ",e.jsx(t.InlineMath,{math:"K"})," (which sets the choice of base / units)."]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-bold text-gray-800 dark:text-gray-200",children:"Joint and Conditional Entropy"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["The entropy of a joint distribution ",e.jsx(t.InlineMath,{math:"(X, Y)"})," is:"]}),e.jsx(t.BlockMath,{math:"H(X, Y) = -\\sum_{x \\in \\mathcal{X}} \\sum_{y \\in \\mathcal{Y}} p(x, y) \\log_2 p(x, y)"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["The conditional entropy of ",e.jsx(t.InlineMath,{math:"Y"})," given"," ",e.jsx(t.InlineMath,{math:"X"})," measures the remaining uncertainty in"," ",e.jsx(t.InlineMath,{math:"Y"})," after observing ",e.jsx(t.InlineMath,{math:"X"}),":"]}),e.jsx(t.BlockMath,{math:"H(Y \\mid X) = \\sum_{x \\in \\mathcal{X}} p(x)\\, H(Y \\mid X = x) = -\\sum_{x,y} p(x,y) \\log_2 p(y \\mid x)"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["The ",e.jsx("strong",{children:"chain rule"})," for entropy states:"]}),e.jsx(t.BlockMath,{math:"H(X, Y) = H(X) + H(Y \\mid X) = H(Y) + H(X \\mid Y)"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["Key inequalities (all follow from ",e.jsx(t.InlineMath,{math:"D_{KL}(p\\|q) \\geq 0"}),"):"]}),e.jsxs("ul",{className:"mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Non-negativity:"})," ",e.jsx(t.InlineMath,{math:"H(X) \\geq 0"}),", with equality iff ",e.jsx(t.InlineMath,{math:"X"})," is deterministic."]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Conditioning reduces entropy:"})," ",e.jsx(t.InlineMath,{math:"H(Y \\mid X) \\leq H(Y)"}),", with equality iff"," ",e.jsx(t.InlineMath,{math:"X \\perp Y"}),"."]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Subadditivity:"})," ",e.jsx(t.InlineMath,{math:"H(X, Y) \\leq H(X) + H(Y)"}),", with equality iff"," ",e.jsx(t.InlineMath,{math:"X \\perp Y"}),"."]})]})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-bold text-gray-800 dark:text-gray-200",children:"Connection to Cross-Entropy Loss"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["The ",e.jsx("strong",{children:"cross-entropy"})," between true distribution"," ",e.jsx(t.InlineMath,{math:"p"})," and model distribution ",e.jsx(t.InlineMath,{math:"q"})," is:"]}),e.jsx(t.BlockMath,{math:"H(p, q) = -\\sum_{x} p(x) \\log q(x) = \\mathbb{E}_{x \\sim p}[-\\log q(x)]"}),e.jsx("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:"This decomposes via the fundamental identity:"}),e.jsx(t.BlockMath,{math:"H(p, q) = H(p) + D_{\\mathrm{KL}}(p \\,\\|\\, q)"}),e.jsxs("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["where ",e.jsx(t.InlineMath,{math:"D_{\\mathrm{KL}}(p \\| q) = \\sum_x p(x) \\log(p(x)/q(x)) \\geq 0"})," ","is the KL divergence. Since ",e.jsx(t.InlineMath,{math:"H(p)"})," is fixed (the true label distribution doesn't depend on model parameters), ",e.jsx("em",{children:"minimizing cross-entropy is equivalent to minimizing KL divergence"}),". This is why the standard classification loss in PyTorch/TensorFlow is called",e.jsx("code",{className:"mx-1 rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800",children:"nn.CrossEntropyLoss"}),"."]}),e.jsxs("p",{className:"mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["For language modeling with a next-token prediction objective, the loss per token is ",e.jsx(t.InlineMath,{math:"-\\log q(x_t \\mid x_{<t})"}),". The average over a corpus gives the model's per-token cross-entropy. ",e.jsx("strong",{children:"Perplexity"})," is the exponentiated cross-entropy:"]}),e.jsx(t.BlockMath,{math:"\\text{PPL} = 2^{H(p, q)} = 2^{-\\frac{1}{N} \\sum_{t=1}^N \\log_2 q(x_t \\mid x_{<t})}"}),e.jsx("p",{className:"text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:'Perplexity has the interpretation of the effective vocabulary size the model is "confused" between at each token position. GPT-4 achieves perplexity ~5–10 on standard benchmarks; a random character-level model on English would have perplexity ~26 (the alphabet size).'})]}),e.jsx(H,{code:oe,language:"python",title:"Shannon Entropy — NumPy Implementation",runnable:!0}),e.jsx(D,{title:"Common Pitfalls",children:e.jsxs("ul",{className:"space-y-2",children:[e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300",children:"1"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Bits vs. nats:"})," PyTorch's"," ",e.jsx("code",{className:"rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800",children:"nn.CrossEntropyLoss"})," ","uses natural logarithm (nats), so reported loss values are in nats. Information theory papers typically use ",e.jsx(t.InlineMath,{math:"\\log_2"})," (bits). Convert via: ",e.jsx(t.InlineMath,{math:"1 \\text{ nat} = \\log_2 e \\approx 1.4427 \\text{ bits}"}),"."]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300",children:"2"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Entropy is a property of distributions, not outcomes."})," ",'It is meaningless to speak of "the entropy of a sample." Entropy measures the uncertainty of the ',e.jsx("em",{children:"distribution"})," generating samples. A single observed value provides no entropy information — only the distribution does."]})]}),e.jsxs("li",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300",children:"3"}),e.jsxs("span",{children:[e.jsxs("strong",{children:["Cross-entropy ",e.jsx(t.InlineMath,{math:"H(p,q) \\neq"})," entropy"," ",e.jsx(t.InlineMath,{math:"H(p)"}),"."]})," ","The cross-entropy loss includes a KL divergence term:"," ",e.jsx(t.InlineMath,{math:"H(p,q) = H(p) + D_{KL}(p\\|q) \\geq H(p)"}),". When",e.jsx(t.InlineMath,{math:"p"})," is one-hot (classification), ",e.jsx(t.InlineMath,{math:"H(p) = 0"}),", so ",e.jsx(t.InlineMath,{math:"H(p,q) = D_{KL}(p\\|q)"})," — the loss ",e.jsx("em",{children:"is"})," the KL divergence in this case."]})]})]})}),e.jsx(Q,{references:le})]})}const Re=Object.freeze(Object.defineProperty({__proto__:null,default:de},Symbol.toStringTag,{value:"Module"}));function ce(){const[i,$]=M.useState(1),r=.5*Math.log(2*Math.PI*Math.E*i*i),c=M.useMemo(()=>{const p=[];for(let w=.1;w<=5;w+=.05)p.push({s:parseFloat(w.toFixed(2)),h:.5*Math.log(2*Math.PI*Math.E*w*w)});return p},[]),f=480,j=200,m=40,l=16,h=16,n=32,s=f-m-l,v=j-h-n,d=c[0].h,I=c[c.length-1].h,k=I-d,a=p=>m+(p-.1)/4.9*s,x=p=>h+v-(p-d)/k*v,y=c.map((p,w)=>`${w===0?"M":"L"}${a(p.s).toFixed(1)},${x(p.h).toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Gaussian Differential Entropy vs Variance"}),e.jsxs("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:[e.jsx(t.InlineMath,{math:"h(\\mathcal{N}(0,\\sigma^2)) = \\frac{1}{2}\\ln(2\\pi e\\sigma^2)"})," — entropy grows logarithmically with σ."]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Standard deviation σ = ",i.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.1",max:"5",step:"0.05",value:i,onChange:p=>$(+p.target.value),className:"w-full accent-indigo-600"})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${f} ${j}`,className:"w-full",style:{minWidth:300},children:[e.jsx("line",{x1:m,y1:h,x2:m,y2:h+v,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:m,y1:h+v,x2:f-l,y2:h+v,stroke:"#9ca3af",strokeWidth:1.5}),[1,2,3,4,5].map(p=>e.jsxs("g",{children:[e.jsx("line",{x1:a(p),y1:h+v,x2:a(p),y2:h+v+4,stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:a(p),y:h+v+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:p})]},p)),e.jsx("text",{x:f/2,y:j-2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"σ"}),e.jsx("text",{x:m-30,y:h+v/2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",transform:`rotate(-90, ${m-30}, ${h+v/2})`,children:"h (nats)"}),d<0&&I>0&&e.jsx("line",{x1:m,y1:x(0),x2:f-l,y2:x(0),stroke:"#6b7280",strokeWidth:1,strokeDasharray:"3 3"}),e.jsx("path",{d:y,fill:"none",stroke:"#6366f1",strokeWidth:2.5}),e.jsx("circle",{cx:a(i),cy:x(r),r:5,fill:"#ef4444"}),e.jsx("line",{x1:a(i),y1:h,x2:a(i),y2:h+v,stroke:"#ef4444",strokeWidth:1,strokeDasharray:"3 2"}),e.jsx("text",{x:a(i)+6,y:x(r)-6,fontSize:"9",fill:"#ef4444",children:r.toFixed(3)})]})}),e.jsxs("div",{className:"mt-3 grid grid-cols-3 gap-2 text-center text-xs",children:[e.jsxs("div",{className:"rounded bg-indigo-50 p-2 dark:bg-indigo-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-indigo-600",children:r.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"h(Gaussian) nats"})]}),e.jsxs("div",{className:"rounded bg-emerald-50 p-2 dark:bg-emerald-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-emerald-600",children:(r/Math.log(2)).toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"h(Gaussian) bits"})]}),e.jsxs("div",{className:"rounded bg-purple-50 p-2 dark:bg-purple-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-purple-600",children:(i*i).toFixed(3)}),e.jsx("div",{className:"text-gray-500",children:"Variance σ²"})]})]})]})}const me=`import numpy as np
from scipy import stats

# Differential entropy of continuous distributions
sigma = 2.0

# Gaussian: h = 0.5 * log(2*pi*e*sigma^2)
h_gaussian = 0.5 * np.log(2 * np.pi * np.e * sigma**2)
print(f"Gaussian N(0, {sigma}^2): h = {h_gaussian:.4f} nats = {h_gaussian/np.log(2):.4f} bits")

# Laplace(0, b): h = 1 + log(2b)
b = sigma / np.sqrt(2)   # same variance
h_laplace = 1 + np.log(2 * b)
print(f"Laplace(0, {b:.4f}):       h = {h_laplace:.4f} nats")

# Uniform(-a, a): h = log(2a)
a = sigma * np.sqrt(3)  # same variance
h_uniform = np.log(2 * a)
print(f"Uniform(-{a:.4f}, {a:.4f}): h = {h_uniform:.4f} nats")

print(f"\\nGaussian has highest entropy for fixed variance: {h_gaussian:.4f} > Laplace: {h_laplace:.4f} > ?")

# Numerical approximation of differential entropy via MC
rng = np.random.default_rng(42)
for dist_name, samples in [
    ("Gaussian", rng.normal(0, sigma, 100000)),
    ("Laplace",  rng.laplace(0, b, 100000)),
    ("Uniform",  rng.uniform(-a, a, 100000)),
]:
    # KDE-based entropy estimate
    kde = stats.gaussian_kde(samples)
    x_grid = np.linspace(samples.min(), samples.max(), 1000)
    logp = np.log(np.maximum(kde(x_grid), 1e-15))
    h_mc = -np.trapz(kde(x_grid) * logp, x_grid)
    print(f"{dist_name:12s}: h ≈ {h_mc:.4f} nats (numerical)")

# Maximum entropy: Gaussian maximizes h for fixed variance
print("\\nMax entropy theorem: N(0, sigma^2) maximizes h over all")
print("distributions with mean 0 and variance sigma^2.")
`;function he(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"Continuous Information Theory",children:e.jsx("p",{children:"Differential entropy extends Shannon's discrete entropy to continuous distributions. Unlike discrete entropy, differential entropy can be negative and is not invariant under coordinate transformations. Despite these quirks, it plays a central role in source coding, maximum entropy modeling, and the information bottleneck."})}),e.jsx(ce,{}),e.jsx(T,{title:"Differential Entropy",definition:"For a continuous random variable $X$ with density $f(x)$, the differential entropy is: $h(X) = -\\int_{-\\infty}^{\\infty} f(x) \\log f(x) \\, dx = -\\mathbb{E}[\\log f(X)]$. Using natural log gives nats; log base 2 gives bits. Unlike discrete entropy, $h(X)$ can be negative (e.g., $h(\\mathcal{U}[0, \\epsilon]) = \\log\\epsilon < 0$ for $\\epsilon < 1$).",notation:"The joint differential entropy: $h(X,Y) = -\\int\\!\\!\\int f(x,y)\\log f(x,y)\\,dx\\,dy$. Conditional: $h(Y|X) = h(X,Y) - h(X) \\geq 0$ always holds."}),e.jsx(T,{title:"Maximum Entropy Distributions",definition:"Among all continuous distributions satisfying given moment constraints, the maximum entropy distribution is: (1) No constraint: uniform on the support. (2) Fixed variance $\\sigma^2$: Gaussian $\\mathcal{N}(\\mu, \\sigma^2)$ with $h = \\frac{1}{2}\\log(2\\pi e\\sigma^2)$. (3) Positive support, fixed mean: Exponential. (4) Support $[a,b]$: Uniform$[a,b]$. These arise via Lagrangian optimization.",notation:"Maximum entropy principle: choose the distribution that is 'least informative' (highest entropy) subject to known constraints. This is the principle behind Jaynes' MaxEnt framework."}),e.jsx(X,{title:"Gaussian Maximizes Entropy for Fixed Variance",statement:"Among all distributions on $\\mathbb{R}$ with mean $\\mu$ and variance $\\sigma^2$, the Gaussian $\\mathcal{N}(\\mu, \\sigma^2)$ uniquely maximizes differential entropy: $h(X) \\leq \\frac{1}{2}\\log(2\\pi e \\sigma^2)$ with equality iff $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$.",proof:"For any density $f$ with variance $\\sigma^2$, use the non-negativity of KL divergence: $D_{KL}(f \\| \\phi) \\geq 0$ where $\\phi = \\mathcal{N}(\\mu, \\sigma^2)$. Expanding: $\\int f \\log(f/\\phi) \\geq 0 \\Rightarrow -\\int f\\log f \\leq -\\int f\\log\\phi = \\frac{1}{2}\\log(2\\pi\\sigma^2) + \\frac{1}{2}$ (using $\\mathbb{E}_f[(X-\\mu)^2/\\sigma^2] = 1$). Thus $h(f) \\leq \\frac{1}{2}\\log(2\\pi e\\sigma^2) = h(\\phi)$, with equality iff $f = \\phi$."}),e.jsxs(F,{title:"Differential Entropy Under Linear Transformations",children:[e.jsxs("p",{children:["If ",e.jsx(t.InlineMath,{math:"Y = aX + b"}),", then ",e.jsx(t.InlineMath,{math:"h(Y) = h(X) + \\log|a|"}),". More generally, for an invertible linear map ",e.jsx(t.InlineMath,{math:"\\mathbf{Y} = A\\mathbf{X}"}),":"]}),e.jsx(t.BlockMath,{math:"h(\\mathbf{Y}) = h(\\mathbf{X}) + \\log|\\det(A)|"}),e.jsx("p",{children:"This is why normalizing flows (invertible neural networks) can compute exact likelihoods: the Jacobian determinant tracks the entropy change under the transformation, enabling exact density evaluation via the change-of-variables formula."})]}),e.jsx(D,{title:"Differential Entropy is NOT Invariant",children:e.jsx("p",{children:'Unlike discrete entropy, differential entropy changes under nonlinear transformations and can be negative. It does NOT measure "uncertainty" in an absolute sense — only relative entropy (KL divergence) and mutual information are invariant and have operational meaning as bits of information. For practical applications, prefer mutual information over differential entropy when possible.'})}),e.jsx(H,{code:me})]})}const Ze=Object.freeze(Object.defineProperty({__proto__:null,default:he},Symbol.toStringTag,{value:"Module"}));function R(i,$,r){const c=(i-$)/r;return Math.exp(-.5*c*c)/(r*Math.sqrt(2*Math.PI))}function pe(){const[i,$]=M.useState(0),[r,c]=M.useState(1),[f,j]=M.useState(1),[m,l]=M.useState(1.5),h=Math.log(m/r)+(r*r+(i-f)**2)/(2*m*m)-.5,n=Math.log(r/m)+(m*m+(f-i)**2)/(2*r*r)-.5,s=M.useMemo(()=>{const u=[];for(let _=-6;_<=6;_+=.05){const N=R(_,i,r),q=R(_,f,m);u.push({x:parseFloat(_.toFixed(2)),p:N,q})}return u},[i,r,f,m]),v=Math.max(...s.map(u=>Math.max(u.p,u.q))),d=480,I=200,k=32,a=16,x=16,y=32,p=d-k-a,w=I-x-y,g=u=>k+(u+6)/12*p,L=u=>x+w-u/(v*1.1)*w,o=s.map((u,_)=>`${_===0?"M":"L"}${g(u.x).toFixed(1)},${L(u.p).toFixed(1)}`).join(" "),b=s.map((u,_)=>`${_===0?"M":"L"}${g(u.x).toFixed(1)},${L(u.q).toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"KL Divergence Between Two Gaussians"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:'KL(P‖Q) ≠ KL(Q‖P) — asymmetry is visible in the different "mass-covering" behaviors.'}),e.jsxs("div",{className:"mb-4 grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-blue-600",children:["P: μ₁ = ",i.toFixed(1)]}),e.jsx("input",{type:"range",min:"-3",max:"3",step:"0.1",value:i,onChange:u=>$(+u.target.value),className:"w-full accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-blue-600",children:["P: σ₁ = ",r.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.3",max:"3",step:"0.1",value:r,onChange:u=>c(+u.target.value),className:"w-full accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-red-600",children:["Q: μ₂ = ",f.toFixed(1)]}),e.jsx("input",{type:"range",min:"-3",max:"3",step:"0.1",value:f,onChange:u=>j(+u.target.value),className:"w-full accent-red-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-red-600",children:["Q: σ₂ = ",m.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.3",max:"3",step:"0.1",value:m,onChange:u=>l(+u.target.value),className:"w-full accent-red-500"})]})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${d} ${I}`,className:"w-full",style:{minWidth:300},children:[e.jsx("line",{x1:k,y1:x,x2:k,y2:x+w,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:k,y1:x+w,x2:d-a,y2:x+w,stroke:"#9ca3af",strokeWidth:1.5}),[-4,-2,0,2,4].map(u=>e.jsxs("g",{children:[e.jsx("line",{x1:g(u),y1:x+w,x2:g(u),y2:x+w+4,stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:g(u),y:x+w+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:u})]},u)),e.jsx("path",{d:o,fill:"none",stroke:"#3b82f6",strokeWidth:2.5}),e.jsx("path",{d:b,fill:"none",stroke:"#ef4444",strokeWidth:2.5,strokeDasharray:"6 2"}),e.jsxs("text",{x:k+10,y:x+14,fontSize:"10",fill:"#3b82f6",children:["P = N(",i.toFixed(1),", ",r.toFixed(1),"²)"]}),e.jsxs("text",{x:k+10,y:x+27,fontSize:"10",fill:"#ef4444",children:["Q = N(",f.toFixed(1),", ",m.toFixed(1),"²)"]})]})}),e.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-3",children:[e.jsxs("div",{className:`rounded p-3 text-center ${h>1?"bg-red-50 dark:bg-red-900/20":"bg-blue-50 dark:bg-blue-900/20"}`,children:[e.jsx("div",{className:`font-mono text-lg font-bold ${h>1?"text-red-600":"text-blue-600"}`,children:Math.max(0,h).toFixed(4)}),e.jsx("div",{className:"text-xs text-gray-500",children:"KL(P ‖ Q) nats"})]}),e.jsxs("div",{className:`rounded p-3 text-center ${n>1?"bg-red-50 dark:bg-red-900/20":"bg-emerald-50 dark:bg-emerald-900/20"}`,children:[e.jsx("div",{className:`font-mono text-lg font-bold ${n>1?"text-red-600":"text-emerald-600"}`,children:Math.max(0,n).toFixed(4)}),e.jsx("div",{className:"text-xs text-gray-500",children:"KL(Q ‖ P) nats"})]})]})]})}const xe=`import numpy as np
from scipy import stats, special

# KL divergence between two Gaussians
def kl_gaussian(mu1, sigma1, mu2, sigma2):
    """KL(N(mu1,s1^2) || N(mu2,s2^2))"""
    return (np.log(sigma2/sigma1) +
            (sigma1**2 + (mu1-mu2)**2) / (2*sigma2**2) - 0.5)

kl_fwd = kl_gaussian(0, 1, 2, 1.5)
kl_bwd = kl_gaussian(2, 1.5, 0, 1)
print(f"KL(P||Q) = {kl_fwd:.4f}")
print(f"KL(Q||P) = {kl_bwd:.4f}  (asymmetric!)")
print(f"KL symmetric? {np.isclose(kl_fwd, kl_bwd)}")

# KL for discrete distributions
p = np.array([0.4, 0.3, 0.2, 0.1])
q = np.array([0.25, 0.25, 0.25, 0.25])
kl_discrete = np.sum(p * np.log(p / q))
print(f"\\nKL(p||uniform) = {kl_discrete:.4f} nats")
print(f"  = {kl_discrete/np.log(2):.4f} bits")

# Cross-entropy = KL + H(p)
h_p = -np.sum(p * np.log(p))
ce = np.sum(-p * np.log(q))
print(f"H(p) = {h_p:.4f}")
print(f"CE(p,q) = {ce:.4f}  (= H(p) + KL(p||q) = {h_p + kl_discrete:.4f})")

# Variational interpretation: KL in VAE ELBO
# ELBO = E_q[log p(x|z)] - KL(q(z|x) || p(z))
# For Gaussian q and standard normal prior:
def kl_diag_gaussian_to_standard(mu, log_var):
    """KL(N(mu, diag(exp(log_var))) || N(0,I))"""
    return -0.5 * np.sum(1 + log_var - mu**2 - np.exp(log_var))

import torch
mu = torch.tensor([0.5, -0.3, 0.1])
log_var = torch.tensor([-0.2, 0.1, -0.5])
kl_vae = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
print(f"\\nVAE KL term: {kl_vae.item():.4f}")
`;function fe(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"KL Divergence: The Fundamental Measure of Information",children:e.jsx("p",{children:"KL divergence measures how much information is lost when using distribution Q to approximate distribution P. It appears everywhere in ML: the ELBO in VAEs, the objective in variational inference, the justification for cross-entropy loss, and the theoretical analysis of supervised learning."})}),e.jsx(pe,{}),e.jsx(T,{title:"KL Divergence",definition:"For probability distributions $P$ and $Q$ on the same space, the KL divergence (relative entropy) is: $D_{KL}(P \\| Q) = \\int p(x) \\log \\frac{p(x)}{q(x)} dx = \\mathbb{E}_P\\left[\\log \\frac{p(X)}{q(X)}\\right]$. For discrete distributions: $D_{KL}(P \\| Q) = \\sum_x p(x) \\log \\frac{p(x)}{q(x)}$. Convention: $0\\log(0/q) = 0$ and $p\\log(p/0) = +\\infty$.",notation:"KL divergence is NOT a distance: $D_{KL}(P\\|Q) \\neq D_{KL}(Q\\|P)$ in general. It is also called relative entropy, information gain, or information divergence."}),e.jsx(T,{title:"Cross-Entropy Decomposition",definition:"Cross-entropy decomposes as: $H(P, Q) = \\mathbb{E}_P[-\\log q(X)] = H(P) + D_{KL}(P\\|Q)$ where $H(P) = -\\mathbb{E}_P[\\log p(X)]$ is the entropy of $P$. Minimizing cross-entropy loss over $Q$ (with fixed $P$) is equivalent to minimizing $D_{KL}(P\\|Q)$, since $H(P)$ is constant. This is why cross-entropy is the correct loss for classification.",notation:"Bits: $H(P,Q) = \\sum_x -p(x)\\log_2 q(x)$. The cross-entropy equals the expected code length when using code $q$ to encode messages drawn from $p$."}),e.jsx(X,{title:"Gibbs' Inequality (Non-negativity of KL)",statement:"For any probability distributions $P$ and $Q$: $D_{KL}(P \\| Q) \\geq 0$ with equality if and only if $P = Q$ almost everywhere.",proof:"By Jensen's inequality applied to the concave function $\\log$: $-D_{KL}(P\\|Q) = \\mathbb{E}_P[\\log(q(X)/p(X))] \\leq \\log \\mathbb{E}_P[q(X)/p(X)] = \\log \\int q(x)\\,dx = \\log 1 = 0$. Equality holds iff $q(x)/p(x)$ is constant $P$-a.s., which requires $p = q$ a.e."}),e.jsxs(F,{title:"KL in Variational Inference (VAE ELBO)",children:[e.jsxs("p",{children:["In a VAE, the encoder outputs parameters ",e.jsx(t.InlineMath,{math:"(\\boldsymbol\\mu_\\phi, \\boldsymbol\\sigma_\\phi)"}),"of a diagonal Gaussian ",e.jsx(t.InlineMath,{math:"q_\\phi(\\mathbf{z}|\\mathbf{x})"}),". The KL term in the ELBO with standard normal prior ",e.jsx(t.InlineMath,{math:"p(\\mathbf{z}) = \\mathcal{N}(0,I)"})," is:"]}),e.jsx(t.BlockMath,{math:"D_{KL}(q_\\phi(\\mathbf{z}|\\mathbf{x}) \\| p(\\mathbf{z})) = -\\frac{1}{2}\\sum_{j=1}^d (1 + \\log\\sigma_j^2 - \\mu_j^2 - \\sigma_j^2)"}),e.jsx("p",{children:"This has a closed form, allowing exact computation and backpropagation through the KL term without Monte Carlo sampling."})]}),e.jsx(D,{title:"Zero-Avoidance vs Zero-Forcing",children:e.jsxs("p",{children:["The asymmetry of KL divergence has practical consequences: ",e.jsx(t.InlineMath,{math:"D_{KL}(P\\|Q)"})," ","is large when ",e.jsx(t.InlineMath,{math:"P"})," has mass where ",e.jsx(t.InlineMath,{math:"Q"})," does not (zero-avoiding behavior: Q tries to cover all of P's support). ",e.jsx(t.InlineMath,{math:"D_{KL}(Q\\|P)"})," ","is large when ",e.jsx(t.InlineMath,{math:"Q"})," has mass where ",e.jsx(t.InlineMath,{math:"P"})," does not (zero-forcing: Q concentrates on P's modes). This choice affects posterior approximation quality in variational inference: ",e.jsx(t.InlineMath,{math:"D_{KL}(q\\|p)"})," (forward, used in VAE) leads to mode-seeking behavior."]})}),e.jsx(H,{code:xe})]})}const Oe=Object.freeze(Object.defineProperty({__proto__:null,default:fe},Symbol.toStringTag,{value:"Module"}));function Y(i,$,r){const c=(i-$)/r;return Math.exp(-.5*c*c)/(r*Math.sqrt(2*Math.PI))}function ge(){const[i,$]=M.useState(1.5),[r,c]=M.useState(1.2),f=0,j=1,m=M.useMemo(()=>{const b=[];for(let q=-8;q<=8;q+=.02)b.push(q);let u=0,_=0,N=0;return b.forEach(q=>{const z=Y(q,f,j),C=Y(q,i,r);z>1e-10&&C>1e-10?(u+=z*Math.log(z/C)*.02,_+=.5*Math.abs(z-C)*.02,N+=(Math.sqrt(z)-Math.sqrt(C))**2*.02):z>1e-10&&(_+=.5*z*.02)}),N*=.5,{kl:Math.max(0,u),tv:Math.min(1,_),hellinger:Math.min(1,N)}},[i,r]),l=M.useMemo(()=>{const b=[];for(let _=-6;_<=6;_+=.1)b.push(_);const u=[];for(let _=-3;_<=3;_+=.1){let N=0,q=0,z=0;b.forEach(C=>{const P=Y(C,f,j),E=Y(C,_,r);P>1e-5&&E>1e-5?(N+=P*Math.log(P/E)*.1,q+=.5*Math.abs(P-E)*.1,z+=(Math.sqrt(P)-Math.sqrt(E))**2*.1):P>1e-5&&(q+=.5*P*.1)}),u.push({m:parseFloat(_.toFixed(1)),kl:Math.max(0,N),tv:Math.min(1,q),hellinger:Math.min(1,.5*z)})}return u},[r]),h=480,n=180,s=36,v=16,d=16,I=32,k=h-s-v,a=n-d-I,x=Math.max(...l.map(o=>o.kl)),y=o=>s+(o+3)/6*k,p=(o,b)=>d+a-o/(b*1.1)*a,w=l.map((o,b)=>`${b===0?"M":"L"}${y(o.m).toFixed(1)},${p(o.kl,x).toFixed(1)}`).join(" "),g=l.map((o,b)=>`${b===0?"M":"L"}${y(o.m).toFixed(1)},${p(o.tv*x,x).toFixed(1)}`).join(" "),L=l.map((o,b)=>`${b===0?"M":"L"}${y(o.m).toFixed(1)},${p(o.hellinger*x,x).toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"KL vs Total Variation vs Hellinger (vs μ₂)"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"P = N(0,1) fixed. Q = N(μ₂, σ₂). KL grows unboundedly; TV and Hellinger are bounded in [0,1]."}),e.jsxs("div",{className:"mb-4 grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Q mean μ₂ = ",i.toFixed(1)]}),e.jsx("input",{type:"range",min:"-3",max:"3",step:"0.1",value:i,onChange:o=>$(+o.target.value),className:"w-full accent-red-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Q std σ₂ = ",r.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.3",max:"3",step:"0.1",value:r,onChange:o=>c(+o.target.value),className:"w-full accent-red-500"})]})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${h} ${n}`,className:"w-full",style:{minWidth:300},children:[e.jsx("line",{x1:s,y1:d,x2:s,y2:d+a,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:s,y1:d+a,x2:h-v,y2:d+a,stroke:"#9ca3af",strokeWidth:1.5}),[-2,-1,0,1,2].map(o=>e.jsxs("g",{children:[e.jsx("line",{x1:y(o),y1:d+a,x2:y(o),y2:d+a+4,stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:y(o),y:d+a+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:o})]},o)),e.jsx("text",{x:h/2,y:n-2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"μ₂"}),e.jsx("path",{d:w,fill:"none",stroke:"#ef4444",strokeWidth:2}),e.jsx("path",{d:g,fill:"none",stroke:"#6366f1",strokeWidth:2,strokeDasharray:"5 2"}),e.jsx("path",{d:L,fill:"none",stroke:"#10b981",strokeWidth:2,strokeDasharray:"3 3"}),e.jsx("line",{x1:y(i),y1:d,x2:y(i),y2:d+a,stroke:"#f59e0b",strokeWidth:1.5,strokeDasharray:"4 2"}),e.jsx("text",{x:h-v-4,y:d+12,textAnchor:"end",fontSize:"8",fill:"#ef4444",children:"KL (scaled)"}),e.jsx("text",{x:h-v-4,y:d+22,textAnchor:"end",fontSize:"8",fill:"#6366f1",children:"TV ×scale"}),e.jsx("text",{x:h-v-4,y:d+32,textAnchor:"end",fontSize:"8",fill:"#10b981",children:"Hellinger ×scale"})]})}),e.jsxs("div",{className:"mt-3 grid grid-cols-3 gap-2 text-center text-xs",children:[e.jsxs("div",{className:"rounded bg-red-50 p-2 dark:bg-red-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-red-600",children:m.kl.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"KL(P‖Q) nats"})]}),e.jsxs("div",{className:"rounded bg-indigo-50 p-2 dark:bg-indigo-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-indigo-600",children:m.tv.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"TV distance [0,1]"})]}),e.jsxs("div",{className:"rounded bg-emerald-50 p-2 dark:bg-emerald-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-emerald-600",children:m.hellinger.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"Hellinger² [0,1]"})]})]})]})}const ue=`import numpy as np
from scipy import stats

def kl_divergence(p, q, dx=1e-4):
    """KL(p||q) for continuous densities sampled on grid."""
    mask = (p > 1e-10) & (q > 1e-10)
    return np.sum(p[mask] * np.log(p[mask] / q[mask])) * dx

def total_variation(p, q, dx=1e-4):
    return 0.5 * np.sum(np.abs(p - q)) * dx

def hellinger_sq(p, q, dx=1e-4):
    return 0.5 * np.sum((np.sqrt(p) - np.sqrt(q))**2) * dx

def chi_squared_div(p, q, dx=1e-4):
    mask = q > 1e-10
    return np.sum((p[mask] - q[mask])**2 / q[mask]) * dx

x = np.linspace(-8, 8, 10000)
dx = x[1] - x[0]

for mu2 in [0, 0.5, 1.0, 2.0]:
    p = stats.norm.pdf(x, 0, 1)
    q = stats.norm.pdf(x, mu2, 1.2)
    print(f"mu2={mu2:.1f}: KL={kl_divergence(p,q,dx):.4f}, "
          f"TV={total_variation(p,q,dx):.4f}, "
          f"H^2={hellinger_sq(p,q,dx):.4f}, "
          f"chi^2={chi_squared_div(p,q,dx):.4f}")

# GAN connections: f-GAN uses variational lower bound on f-divergences
# The discriminator D in a GAN computes f*(D(x)) - D(G(z)) where f* is the Fenchel conjugate
# For KL: f*(t) = exp(t-1), giving the original GAN objective
print("\\nPinsker's inequality: TV <= sqrt(KL/2)")
for mu2 in [0.5, 1.0, 2.0]:
    p = stats.norm.pdf(x, 0, 1)
    q = stats.norm.pdf(x, mu2, 1.0)
    tv = total_variation(p, q, dx)
    kl = kl_divergence(p, q, dx)
    print(f"  mu2={mu2}: TV={tv:.4f}, sqrt(KL/2)={np.sqrt(kl/2):.4f}, "
          f"TV <= sqrt(KL/2): {tv <= np.sqrt(kl/2) + 1e-6}")
`;function ye(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"A Unified Family of Divergences",children:e.jsx("p",{children:"The f-divergence family unifies KL divergence, total variation, Hellinger distance, and chi-squared divergence under a single framework. Different GANs optimize different f-divergences, and the choice affects training stability and mode coverage behavior."})}),e.jsx(ge,{}),e.jsx(T,{title:"f-Divergence",definition:"For a convex function $f: (0,\\infty) \\to \\mathbb{R}$ with $f(1) = 0$, the f-divergence between distributions $P$ and $Q$ is: $D_f(P \\| Q) = \\int q(x) f\\!\\left(\\frac{p(x)}{q(x)}\\right) dx$. Examples: KL: $f(t) = t\\log t$; Reverse KL: $f(t) = -\\log t$; Total Variation: $f(t) = \\frac{1}{2}|t-1|$; Hellinger²: $f(t) = (\\sqrt{t}-1)^2$; Chi-squared: $f(t) = (t-1)^2$.",notation:"All f-divergences satisfy $D_f(P\\|Q) \\geq 0$ with equality iff $P=Q$. They all reduce to 0 when $P=Q$ since $f(1)=0$."}),e.jsx(T,{title:"Variational Representation",definition:"By the Fenchel duality, every f-divergence has a variational lower bound: $D_f(P\\|Q) = \\sup_{T: \\mathcal{X} \\to \\mathbb{R}} \\left\\{\\mathbb{E}_P[T(X)] - \\mathbb{E}_Q[f^*(T(X))]\\right\\}$ where $f^*(s) = \\sup_{t > 0}(st - f(t))$ is the Fenchel conjugate. The supremum is achieved at $T^*(x) = f'(p(x)/q(x))$.",notation:"This representation underlies f-GAN: the discriminator $T$ approximates the optimal critic $T^*$, and maximizing over $T$ gives a lower bound on the divergence between the data and generator distributions."}),e.jsx(X,{title:"Pinsker's Inequality",statement:"For any probability distributions $P$ and $Q$: $\\mathrm{TV}(P, Q) \\leq \\sqrt{\\frac{1}{2}D_{KL}(P\\|Q)}$ where $\\mathrm{TV}(P,Q) = \\frac{1}{2}\\|p - q\\|_1$ is the total variation distance. More generally: $\\mathrm{TV}^2 \\leq H^2(P,Q) \\leq D_{KL}(P\\|Q)$ where $H^2$ is the squared Hellinger distance.",proof:"Use the data-processing inequality: $\\mathrm{TV}(P,Q) = \\sup_{A} |P(A) - Q(A)|$. For any event $A$ with $p = P(A)$, $q = Q(A)$: $KL(P\\|Q) \\geq KL(\\mathrm{Bernoulli}(p)\\|\\mathrm{Bernoulli}(q)) = p\\log(p/q) + (1-p)\\log((1-p)/(1-q)) \\geq 2(p-q)^2$. Taking supremum over $A$ and using $|p-q| = \\mathrm{TV}$ gives the bound."}),e.jsx(F,{title:"GAN as f-Divergence Minimization",children:e.jsxs("p",{children:["The original GAN (Goodfellow 2014) minimizes the Jensen-Shannon divergence:",e.jsx(t.InlineMath,{math:"\\mathrm{JS}(P\\|Q) = \\frac{1}{2}D_{KL}(P\\|\\frac{P+Q}{2}) + \\frac{1}{2}D_{KL}(Q\\|\\frac{P+Q}{2})"}),". The WGAN instead minimizes the Wasserstein-1 distance, which is continuous even when supports don't overlap. Different f-divergences lead to different GAN variants with different stability and mode coverage properties."]})}),e.jsx(D,{title:"f-Divergences Require Absolute Continuity",children:e.jsxs("p",{children:["If ",e.jsx(t.InlineMath,{math:"P"})," is not absolutely continuous with respect to ",e.jsx(t.InlineMath,{math:"Q"}),"(i.e., there exists a set where ",e.jsx(t.InlineMath,{math:"q=0"})," but ",e.jsx(t.InlineMath,{math:"p>0"}),"), then ",e.jsx(t.InlineMath,{math:"D_f(P\\|Q) = +\\infty"})," for KL and many f-divergences. This is a major practical problem in GANs: if generator and real distributions have disjoint supports, KL is infinite and gradients vanish. The Wasserstein distance avoids this by using a different metric topology."]})}),e.jsx(H,{code:ue})]})}const Qe=Object.freeze(Object.defineProperty({__proto__:null,default:ye},Symbol.toStringTag,{value:"Module"}));function be(){const[i,$]=M.useState(0),[r,c]=M.useState(.5),[f,j]=M.useState(2),[m,l]=M.useState(.8),h=(i-f)**2+(r-m)**2,n=8,s=M.useMemo(()=>Array.from({length:n},(_,N)=>i+r*(N-n/2+.5)/(n/4)),[i,r]),v=M.useMemo(()=>Array.from({length:n},(_,N)=>f+m*(N-n/2+.5)/(n/4)),[f,m]),d=480,I=220,k=32,a=16,x=40,y=32,p=d-k-a,w=I-x-y,g=Math.min(...s,...v)-1,L=Math.max(...s,...v)+1,o=_=>k+(_-g)/(L-g)*p,b=x+20,u=x+w-20;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"1D Optimal Transport Visualizer"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Lines show the optimal transport plan: each mass unit in P (blue) is mapped to the corresponding unit in Q (red)."}),e.jsxs("div",{className:"mb-4 grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-blue-600",children:["P: μ₁ = ",i.toFixed(1)]}),e.jsx("input",{type:"range",min:"-2",max:"2",step:"0.1",value:i,onChange:_=>$(+_.target.value),className:"w-full accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-blue-600",children:["P: σ₁ = ",r.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.2",max:"1.5",step:"0.05",value:r,onChange:_=>c(+_.target.value),className:"w-full accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-red-600",children:["Q: μ₂ = ",f.toFixed(1)]}),e.jsx("input",{type:"range",min:"-2",max:"4",step:"0.1",value:f,onChange:_=>j(+_.target.value),className:"w-full accent-red-500"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-red-600",children:["Q: σ₂ = ",m.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.2",max:"1.5",step:"0.05",value:m,onChange:_=>l(+_.target.value),className:"w-full accent-red-500"})]})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${d} ${I}`,className:"w-full",style:{minWidth:300},children:[e.jsx("text",{x:k,y:b-10,fontSize:"10",fill:"#3b82f6",children:"P (source)"}),e.jsx("text",{x:k,y:u+18,fontSize:"10",fill:"#ef4444",children:"Q (target)"}),e.jsx("line",{x1:k,y1:b,x2:d-a,y2:b,stroke:"#3b82f6",strokeWidth:1,strokeOpacity:.3}),e.jsx("line",{x1:k,y1:u,x2:d-a,y2:u,stroke:"#ef4444",strokeWidth:1,strokeOpacity:.3}),s.map((_,N)=>{const q=v[N],z=Math.abs(_-q),C=Math.max(...s.map((E,O)=>Math.abs(E-v[O]))),P=.2+.6*(z/(C||1));return e.jsx("line",{x1:o(_),y1:b,x2:o(q),y2:u,stroke:"#8b5cf6",strokeWidth:1.5,opacity:P},N)}),s.map((_,N)=>e.jsx("circle",{cx:o(_),cy:b,r:5,fill:"#3b82f6"},N)),v.map((_,N)=>e.jsx("circle",{cx:o(_),cy:u,r:5,fill:"#ef4444"},N))]})}),e.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-3 text-center text-xs",children:[e.jsxs("div",{className:"rounded bg-indigo-50 p-2 dark:bg-indigo-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-indigo-600",children:Math.abs(i-f).toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"W₁ (same σ): |μ₁-μ₂|"})]}),e.jsxs("div",{className:"rounded bg-purple-50 p-2 dark:bg-purple-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-purple-600",children:Math.sqrt(h).toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"W₂ (1D Gaussian)"})]})]})]})}const _e=`import numpy as np
from scipy.stats import wasserstein_distance
from scipy.optimize import linprog

# 1D Wasserstein distance (exact via quantile matching)
from scipy.stats import norm

mu1, sigma1 = 0, 1
mu2, sigma2 = 2, 1.5

# Analytical W2 for Gaussians: sqrt(|mu1-mu2|^2 + (sigma1-sigma2)^2) in 1D
w2_analytical = np.sqrt((mu1 - mu2)**2 + (sigma1 - sigma2)**2)
print(f"W2 (Gaussian 1D, analytical): {w2_analytical:.4f}")

# Numerical via samples
np.random.seed(42)
n = 10000
samples1 = np.random.normal(mu1, sigma1, n)
samples2 = np.random.normal(mu2, sigma2, n)

# W1 = integral |F1^{-1}(u) - F2^{-1}(u)| du = mean |sorted_x - sorted_y|
s1_sorted = np.sort(samples1)
s2_sorted = np.sort(samples2)
w1_empirical = np.mean(np.abs(s1_sorted - s2_sorted))
print(f"W1 (empirical, n={n}): {w1_empirical:.4f}")

# scipy's wasserstein_distance
w1_scipy = wasserstein_distance(samples1[:1000], samples2[:1000])
print(f"W1 (scipy): {w1_scipy:.4f}")

# W1 for discrete distributions via LP
# scipy handles small cases
from scipy.stats import wasserstein_distance as wd
u_vals = [1, 2, 3, 4]
v_vals = [2, 3, 4, 5]
u_weights = [0.4, 0.3, 0.2, 0.1]
v_weights = [0.1, 0.2, 0.4, 0.3]
w1_discrete = wd(u_vals, v_vals, u_weights, v_weights)
print(f"\\nW1 (discrete): {w1_discrete:.4f}")

# POT library for 2D optimal transport
try:
    import ot
    X = np.random.randn(50, 2)
    Y = np.random.randn(50, 2) + np.array([2, 1])
    a, b = np.ones(50) / 50, np.ones(50) / 50
    M = ot.dist(X, Y)
    T = ot.emd(a, b, M)
    print(f"\\n2D OT cost (EMD): {np.sum(T * M):.4f}")
except ImportError:
    print("\\nInstall POT library for 2D optimal transport: pip install POT")
`;function je(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"Optimal Transport: Moving Mass Efficiently",children:e.jsx("p",{children:"The Wasserstein distance (earth mover's distance) measures the minimum cost to transport the mass of distribution P to match distribution Q. Unlike KL divergence, it is well-defined even when distributions have disjoint supports, making it ideal for GAN training and domain adaptation."})}),e.jsx(be,{}),e.jsx(T,{title:"Wasserstein-p Distance",definition:"The Wasserstein-p distance between distributions $P$ and $Q$ on metric space $(\\mathcal{X}, d)$ is: $W_p(P, Q) = \\left(\\inf_{\\gamma \\in \\Pi(P,Q)} \\int\\!\\!\\int d(x,y)^p \\, d\\gamma(x,y)\\right)^{1/p}$ where $\\Pi(P,Q)$ is the set of joint distributions (couplings) with marginals $P$ and $Q$. Interpretation: find the 'transport plan' $\\gamma$ that minimizes total cost, where cost of moving mass from $x$ to $y$ is $d(x,y)^p$.",notation:"$W_1$: earth mover's distance (EMD). $W_2$: Fréchet distance. For 1D distributions, $W_p(P,Q) = \\|F_P^{-1} - F_Q^{-1}\\|_{L^p} = (\\int_0^1 |F_P^{-1}(u) - F_Q^{-1}(u)|^p du)^{1/p}$."}),e.jsx(T,{title:"Kantorovich-Rubinstein Duality (W₁)",definition:"The Wasserstein-1 distance has the dual (Kantorovich) formulation: $W_1(P, Q) = \\sup_{\\|f\\|_L \\leq 1} \\left|\\mathbb{E}_P[f(X)] - \\mathbb{E}_Q[f(X)]\\right|$ where the supremum is over all 1-Lipschitz functions $f: \\mathcal{X} \\to \\mathbb{R}$. This is the form used in Wasserstein GANs: the discriminator (critic) $f_\\omega$ approximates the optimal 1-Lipschitz function.",notation:"Lipschitz constraint: $|f(x) - f(y)| \\leq d(x,y)$. In WGANs, the critic is constrained via gradient penalty or weight clipping."}),e.jsx(X,{title:"Wasserstein Distance Properties",statement:"The Wasserstein-p distance is a true metric on the space of probability measures with finite p-th moment: (1) $W_p(P,Q) \\geq 0$ with equality iff $P=Q$; (2) Symmetry: $W_p(P,Q) = W_p(Q,P)$; (3) Triangle inequality. Moreover, $W_p$ metrizes weak convergence: $P_n \\xrightarrow{w} P$ iff $W_p(P_n, P) \\to 0$ (under finite moment conditions). This is stronger than convergence in KL divergence.",proof:"(1,2) are immediate from the definition. Triangle inequality: for any three distributions $P,Q,R$ and optimal couplings $\\gamma_{PQ}$, $\\gamma_{QR}$, construct a coupling $\\gamma_{PR}$ by 'gluing' via $Q$: $\\gamma_{PR}(A\\times C) = \\int_\\mathcal{X} \\gamma_{PQ}(A|y)\\gamma_{QR}(dy,C)$. By the triangle inequality for the ground metric $d$: $d(x,z) \\leq d(x,y) + d(y,z)$. Taking expectations gives $W_p(P,R) \\leq W_p(P,Q) + W_p(Q,R)$."}),e.jsxs(F,{title:"Fréchet Inception Distance (FID)",children:[e.jsx("p",{children:"FID measures GAN quality using the Wasserstein-2 distance between the distributions of Inception features of real and generated images. For Gaussian distributions:"}),e.jsx(t.BlockMath,{math:"\\mathrm{FID} = \\|\\boldsymbol\\mu_r - \\boldsymbol\\mu_g\\|^2 + \\mathrm{tr}(\\Sigma_r + \\Sigma_g - 2(\\Sigma_r\\Sigma_g)^{1/2})"}),e.jsxs("p",{children:["This is exactly ",e.jsx(t.InlineMath,{math:"W_2^2"})," between two multivariate Gaussians, providing a principled metric for image generation quality."]})]}),e.jsx(D,{title:"Computational Cost of Wasserstein Distance",children:e.jsxs("p",{children:["Exact Wasserstein computation via linear programming requires ",e.jsx(t.InlineMath,{math:"O(n^3\\log n)"}),"time for ",e.jsx(t.InlineMath,{math:"n"})," discrete samples — prohibitively expensive in ML. Practical approximations include: (1) Sinkhorn algorithm (entropic regularization):",e.jsx(t.InlineMath,{math:"O(n^2/\\varepsilon^2)"}),"; (2) Sliced Wasserstein (random 1D projections); (3) 1D quantile-based computation when distributions live on a line. WGANs implicitly optimize a lower bound via the Kantorovich dual."]})}),e.jsx(H,{code:_e})]})}const Ge=Object.freeze(Object.defineProperty({__proto__:null,default:je},Symbol.toStringTag,{value:"Module"}));function $e(){const[i,$]=M.useState(.5),r=-.5*Math.log(1-i*i),c=r,f=r/Math.log(2),j=M.useMemo(()=>{const p=[];for(let g=0;g<60;g++){const L=Math.sin(g*2.399963229728653)*.5+.5,o=Math.cos(g*3.141592653589793)*.5+.5,b=Math.sqrt(-2*Math.log(Math.max(L,.001)))*Math.cos(2*Math.PI*o),u=Math.sqrt(-2*Math.log(Math.max(1-L,.001)))*Math.sin(2*Math.PI*o),_=b,N=i*b+Math.sqrt(1-i*i)*u;p.push({x:_,y:N})}return p},[i]),m=280,l=280,h=24,n=16,s=16,v=24,d=m-h-n,I=l-s-v,k=-3,a=3,x=p=>h+(p-k)/(a-k)*d,y=p=>s+I-(p-k)/(a-k)*I;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Bivariate Gaussian: MI vs Correlation"}),e.jsxs("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:["For bivariate Gaussian: ",e.jsx(t.InlineMath,{math:"I(X;Y) = -\\frac{1}{2}\\ln(1-\\rho^2)"})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Correlation ρ = ",i.toFixed(2)]}),e.jsx("input",{type:"range",min:"-0.99",max:"0.99",step:"0.01",value:i,onChange:p=>$(+p.target.value),className:"w-full accent-indigo-600"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-4 sm:flex-row",children:[e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800",children:e.jsxs("svg",{viewBox:`0 0 ${m} ${l}`,className:"w-full max-w-xs",children:[e.jsx("line",{x1:h,y1:s,x2:h,y2:s+I,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:h,y1:s+I,x2:m-n,y2:s+I,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:x(0),y1:s,x2:x(0),y2:s+I,stroke:"#6b7280",strokeWidth:.5,strokeOpacity:.5}),e.jsx("line",{x1:h,y1:y(0),x2:m-n,y2:y(0),stroke:"#6b7280",strokeWidth:.5,strokeOpacity:.5}),j.map((p,w)=>e.jsx("circle",{cx:x(p.x),cy:y(p.y),r:3,fill:"#6366f1",opacity:.6},w)),e.jsx("text",{x:m/2,y:l-2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"X"}),e.jsx("text",{x:10,y:s+I/2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",transform:`rotate(-90, 10, ${s+I/2})`,children:"Y"})]})}),e.jsxs("div",{className:"grid grid-cols-1 gap-3 text-center text-xs",children:[e.jsxs("div",{className:"rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20",children:[e.jsx("div",{className:"font-mono text-2xl font-bold text-indigo-600",children:c.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"I(X;Y) nats"})]}),e.jsxs("div",{className:"rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20",children:[e.jsx("div",{className:"font-mono text-2xl font-bold text-purple-600",children:f.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"I(X;Y) bits"})]}),e.jsxs("div",{className:"rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20",children:[e.jsx("div",{className:"font-mono text-lg font-bold text-emerald-600",children:Math.abs(i).toFixed(2)}),e.jsx("div",{className:"text-gray-500",children:"|ρ| = |Corr|"})]})]})]})]})}const ve=`import numpy as np
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
`;function ke(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"Mutual Information: Shared Randomness",children:e.jsx("p",{children:"Mutual information measures how much information two random variables share. Unlike correlation, MI captures all statistical dependence (including nonlinear). MI = 0 iff X and Y are independent; otherwise it quantifies the reduction in uncertainty about Y given knowledge of X."})}),e.jsx($e,{}),e.jsx(T,{title:"Mutual Information",definition:"The mutual information between $X$ and $Y$ is: $I(X;Y) = \\sum_{x,y} p(x,y)\\log\\frac{p(x,y)}{p(x)p(y)} = D_{KL}(p(X,Y) \\| p(X)p(Y))$. Equivalently: $I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X,Y)$. For bivariate Gaussian with correlation $\\rho$: $I(X;Y) = -\\frac{1}{2}\\log(1-\\rho^2)$.",notation:"MI is symmetric: $I(X;Y) = I(Y;X)$. It satisfies $0 \\leq I(X;Y) \\leq \\min(H(X), H(Y))$. For continuous distributions, replace sums with integrals using differential entropy."}),e.jsx(T,{title:"Conditional MI and Information Decomposition",definition:"The conditional mutual information $I(X;Y|Z) = H(X|Z) - H(X|Y,Z)$ measures dependence between $X$ and $Y$ given $Z$. The chain rule: $I(X_1,\\ldots,X_n;Y) = \\sum_{i=1}^n I(X_i;Y|X_1,\\ldots,X_{i-1})$. The interaction information can be negative: $II(X;Y;Z) = I(X;Y|Z) - I(X;Y)$.",notation:"$X \\perp Y | Z$ iff $I(X;Y|Z) = 0$. This is used in conditional independence tests and graphical model structure learning."}),e.jsx(X,{title:"Data Processing Inequality",statement:"If $X \\to Y \\to Z$ forms a Markov chain (i.e., $X \\perp Z | Y$), then: $I(X;Z) \\leq I(X;Y)$ and $I(X;Z) \\leq I(Y;Z)$. Processing data cannot increase the mutual information with the original source. Corollary: for any deterministic function $f$, $I(X; f(Y)) \\leq I(X;Y)$.",proof:"$I(X;Y,Z) = I(X;Z) + I(X;Y|Z)$ (chain rule). Since $Z \\perp X | Y$: $I(X;Y|Z) \\geq 0$ but also $I(X;Z|Y) = 0$. Therefore $I(X;Y,Z) = I(X;Y) + I(X;Z|Y) = I(X;Y)$. Combining: $I(X;Y) = I(X;Y,Z) = I(X;Z) + I(X;Y|Z) \\geq I(X;Z)$."}),e.jsxs(F,{title:"MI in Deep Learning: MINE and InfoNCE",children:[e.jsx("p",{children:"MINE (Mutual Information Neural Estimator, Belghazi 2018) estimates MI using a neural network trained on the Donsker-Varadhan variational lower bound:"}),e.jsx(t.BlockMath,{math:"I(X;Y) \\geq \\sup_T \\mathbb{E}_{p(x,y)}[T(x,y)] - \\log\\mathbb{E}_{p(x)p(y)}[e^{T(x,y)}]"}),e.jsxs("p",{children:["InfoNCE (Oord 2018), used in contrastive self-supervised learning, is a lower bound on MI via a ratio estimator, and training on it maximizes ",e.jsx(t.InlineMath,{math:"I(X;Y)"}),"between different augmented views of the same image."]})]}),e.jsx(D,{title:"MI Estimation in High Dimensions is Hard",children:e.jsxs("p",{children:["For continuous high-dimensional data, MI estimation is a notorious open problem. KDE-based estimators require exponentially many samples in the dimension. KSG (Kraskov-Stögbauer-Grassberger) k-nearest-neighbor estimator is standard for low-to-medium dimensions (",e.jsx(t.InlineMath,{math:"d \\lesssim 10"}),"). Neural estimators (MINE, InfoNCE) scale to high dimensions but have high variance and require careful training. All estimators are biased for high MI values."]})}),e.jsx(H,{code:ve})]})}const Ve=Object.freeze(Object.defineProperty({__proto__:null,default:ke},Symbol.toStringTag,{value:"Module"}));function we(){const[i,$]=M.useState(10),r=M.useMemo(()=>{const y=[];for(let p=-5;p<=30;p+=.5){const w=Math.pow(10,p/10),g=Math.log2(1+w);y.push({db:p,snr:w,capacity:g})}return y},[]),c=Math.pow(10,i/10),f=Math.log2(1+c),j=480,m=200,l=40,h=16,n=16,s=32,v=j-l-h,d=m-n-s,I=Math.log2(1+Math.pow(10,3)),k=y=>l+(y+5)/35*v,a=y=>n+d-y/I*d,x=r.map((y,p)=>`${p===0?"M":"L"}${k(y.db).toFixed(1)},${a(y.capacity).toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Shannon Capacity vs SNR (AWGN Channel)"}),e.jsxs("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:[e.jsx(t.InlineMath,{math:"C = \\log_2(1 + \\mathrm{SNR})"})," bits/channel use (Shannon-Hartley theorem)"]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["SNR = ",i.toFixed(1)," dB = ",c.toFixed(1)," (linear)"]}),e.jsx("input",{type:"range",min:"-5",max:"30",step:"0.5",value:i,onChange:y=>$(+y.target.value),className:"w-full accent-indigo-600"})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${j} ${m}`,className:"w-full",style:{minWidth:300},children:[e.jsx("line",{x1:l,y1:n,x2:l,y2:n+d,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:l,y1:n+d,x2:j-h,y2:n+d,stroke:"#9ca3af",strokeWidth:1.5}),[0,5,10,15,20,25,30].map(y=>e.jsxs("g",{children:[e.jsx("line",{x1:k(y),y1:n+d,x2:k(y),y2:n+d+4,stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:k(y),y:n+d+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:y})]},y)),e.jsx("text",{x:j/2,y:m-2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"SNR (dB)"}),e.jsx("text",{x:12,y:n+d/2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",transform:`rotate(-90, 12, ${n+d/2})`,children:"C (bits/use)"}),[2,4,6,8,10].map(y=>e.jsxs("g",{children:[e.jsx("line",{x1:l-4,y1:a(y),x2:l,y2:a(y),stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:l-6,y:a(y)+3,textAnchor:"end",fontSize:"9",fill:"#9ca3af",children:y})]},y)),e.jsx("path",{d:x,fill:"none",stroke:"#6366f1",strokeWidth:2.5}),e.jsx("circle",{cx:k(i),cy:a(f),r:5,fill:"#ef4444"}),e.jsx("line",{x1:k(i),y1:n,x2:k(i),y2:n+d,stroke:"#ef4444",strokeWidth:1.5,strokeDasharray:"4 2"}),e.jsxs("text",{x:k(i)+6,y:a(f)-6,fontSize:"10",fill:"#ef4444",fontWeight:"600",children:["C=",f.toFixed(2)]})]})}),e.jsxs("div",{className:"mt-3 grid grid-cols-3 gap-2 text-center text-xs",children:[e.jsxs("div",{className:"rounded bg-indigo-50 p-2 dark:bg-indigo-900/20",children:[e.jsxs("div",{className:"font-mono font-bold text-indigo-600",children:[i.toFixed(1)," dB"]}),e.jsx("div",{className:"text-gray-500",children:"SNR"})]}),e.jsxs("div",{className:"rounded bg-red-50 p-2 dark:bg-red-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-red-600",children:f.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"Capacity (bits/use)"})]}),e.jsxs("div",{className:"rounded bg-emerald-50 p-2 dark:bg-emerald-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-emerald-600",children:(f*1).toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"~Max rate (b/s/Hz)"})]})]})]})}const Me=`import numpy as np

# AWGN Channel Capacity (Shannon-Hartley)
def awgn_capacity_bits(snr_db, bandwidth_hz=1):
    """Shannon capacity in bits/s for AWGN channel."""
    snr_linear = 10 ** (snr_db / 10)
    return bandwidth_hz * np.log2(1 + snr_linear)

print("AWGN Channel Capacity:")
for snr_db in [-5, 0, 5, 10, 20, 30]:
    C = awgn_capacity_bits(snr_db)
    print(f"  SNR={snr_db:4d}dB: C = {C:.4f} bits/channel_use")

# Binary Symmetric Channel (BSC)
def bsc_capacity(p):
    """Capacity of BSC with crossover probability p."""
    if p == 0 or p == 1: return 1.0
    if p == 0.5: return 0.0
    h = -p * np.log2(p) - (1-p) * np.log2(1-p)  # Binary entropy
    return 1 - h

print("\\nBinary Symmetric Channel:")
for p in [0, 0.01, 0.1, 0.25, 0.5]:
    print(f"  p={p:.2f}: C = {bsc_capacity(p):.4f} bits/use")

# Binary Erasure Channel (BEC)
def bec_capacity(epsilon):
    """Capacity of BEC with erasure probability epsilon."""
    return 1 - epsilon

# Water-filling for parallel Gaussian channels
def water_filling(noise_powers, total_power):
    """Optimal power allocation for parallel Gaussian channels."""
    n = len(noise_powers)
    # Sort channels by noise power (ascending)
    order = np.argsort(noise_powers)
    sigma2 = noise_powers[order]

    for k in range(n, 0, -1):
        # Water level: mu = (P_total + sum(sigma2[:k])) / k
        mu = (total_power + sigma2[:k].sum()) / k
        if mu > sigma2[k-1]:
            break

    powers = np.maximum(mu - sigma2[:k], 0)
    # Fill remaining with zeros
    alloc = np.zeros(n)
    alloc[order[:k]] = powers
    return alloc, mu

noise = np.array([0.1, 0.5, 1.0, 2.0])
total_P = 4.0
alloc, level = water_filling(noise, total_P)
print(f"\\nWater-filling (P={total_P}, noise={noise}):")
print(f"  Water level μ = {level:.4f}")
print(f"  Power allocation: {alloc.round(4)}")
capacity = np.sum(np.log2(1 + alloc / noise))
print(f"  Total capacity: {capacity:.4f} bits/use")
`;function Ne(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"The Fundamental Limit of Communication",children:e.jsx("p",{children:"Channel capacity is the maximum rate at which information can be reliably transmitted over a noisy channel. Shannon's 1948 channel coding theorem proved that below capacity, arbitrarily reliable communication is possible; above capacity, it is not. This binary threshold is one of the most profound results in mathematics."})}),e.jsx(we,{}),e.jsx(T,{title:"Channel Capacity",definition:"For a discrete memoryless channel with transition probabilities $p(y|x)$, the capacity is: $C = \\max_{p(x)} I(X;Y) = \\max_{p(x)} \\sum_{x,y} p(x)p(y|x)\\log\\frac{p(y|x)}{p(y)}$. The maximum is over all input distributions $p(x)$. $C$ is measured in bits (log base 2) or nats (log base $e$) per channel use.",notation:"For the Additive White Gaussian Noise (AWGN) channel $Y = X + Z$ with $Z \\sim \\mathcal{N}(0, N)$ and power constraint $\\mathbb{E}[X^2] \\leq P$: $C = \\frac{1}{2}\\log_2\\left(1 + \\frac{P}{N}\\right)$ bits/use."}),e.jsx(T,{title:"Binary Symmetric Channel",definition:"A BSC with crossover probability $p$ flips each bit independently with probability $p$. Its capacity is $C_{\\mathrm{BSC}} = 1 - H_b(p)$ bits/use where $H_b(p) = -p\\log_2 p - (1-p)\\log_2(1-p)$ is the binary entropy. The capacity is maximized at $p=0$ (or $p=1$): $C=1$ bit; at $p=0.5$: $C=0$ (completely noisy).",notation:"The capacity-achieving input distribution is uniform: $p(X=0) = p(X=1) = 0.5$. This gives output entropy $H(Y) = 1$ bit, and $H(Y|X) = H_b(p)$, so $I(X;Y) = 1 - H_b(p)$."}),e.jsx(X,{title:"Shannon's Channel Coding Theorem",statement:"For any discrete memoryless channel with capacity $C$ and any rate $R < C$, there exists a sequence of codes with block length $n$ and $2^{nR}$ codewords such that the maximum probability of decoding error $P_e^{(n)} \\to 0$ as $n \\to \\infty$. Conversely, for any rate $R > C$ and any sequence of codes, $P_e^{(n)} \\geq \\delta > 0$ for some $\\delta$ depending on $R - C$.",proof:"Achievability (sketch): Use random coding. Generate $2^{nR}$ codewords i.i.d. from the capacity-achieving distribution $p^*(x)$. To decode, use joint typicality decoding: declare $m$ sent if $(x^n(m), y^n)$ are jointly typical. By AEP, if the correct message was sent, joint typicality holds w.h.p. The probability that any other codeword $x^n(m')$ is also jointly typical with $y^n$ is $\\approx 2^{-nI(X;Y)}$. By union bound over $2^{nR}$ messages: $P_e \\leq 2^{n(R-I(X;Y))} \\to 0$ since $R < C \\leq I(X;Y)$."}),e.jsx(F,{title:"Water-Filling: Optimal Power Allocation",children:e.jsxs("p",{children:["For parallel Gaussian channels (e.g., OFDM subcarriers) with noise powers"," ",e.jsx(t.InlineMath,{math:"\\sigma_k^2"})," and total power ",e.jsx(t.InlineMath,{math:"P"}),", the optimal power allocation is water-filling: allocate ",e.jsx(t.InlineMath,{math:"P_k = (\\mu - \\sigma_k^2)_+"})," where the water level ",e.jsx(t.InlineMath,{math:"\\mu"})," is chosen so ",e.jsx(t.InlineMath,{math:"\\sum_k P_k = P"}),". Better channels (lower noise) get more power; very noisy channels get zero. Total capacity:",e.jsx(t.InlineMath,{math:"C = \\sum_k \\frac{1}{2}\\log_2(1 + P_k/\\sigma_k^2)"}),"."]})}),e.jsx(D,{title:"Capacity is Asymptotic",children:e.jsx("p",{children:"Channel capacity is achievable only with infinitely long codes. Real systems use finite block lengths (LDPC, turbo codes, polar codes) and operate at rates below capacity. The gap between practical rates and capacity is characterized by the channel dispersion (finite blocklength theory). Also, capacity assumes perfect channel knowledge at the receiver — in practice, channel estimation overhead reduces effective throughput."})}),e.jsx(H,{code:Me})]})}const Ue=Object.freeze(Object.defineProperty({__proto__:null,default:Ne},Symbol.toStringTag,{value:"Module"}));function Ie(i,$){const c=[...i.map((l,h)=>({symbol:l,prob:$[h],left:null,right:null,code:""}))];for(;c.length>1;){c.sort((n,s)=>n.prob-s.prob);const l=c.shift(),h=c.shift();c.push({symbol:null,prob:l.prob+h.prob,left:l,right:h,code:""})}const f=c[0],j={};function m(l,h){if(l){if(l.symbol!==null){j[l.symbol]=h||"0";return}m(l.left,h+"0"),m(l.right,h+"1")}}return m(f,""),{root:f,codes:j}}function K(i,$,r,c,f=0,j=[]){if(!i)return j;const m=14,l=45;if(i.left){const h=$-c/4,n=r+l;j.push({type:"line",x1:$,y1:r,x2:h,y2:n,label:"0"}),K(i.left,h,n,c/2,f+1,j)}if(i.right){const h=$+c/4,n=r+l;j.push({type:"line",x1:$,y1:r,x2:h,y2:n,label:"1"}),K(i.right,h,n,c/2,f+1,j)}return j.push({type:"circle",x:$,y:r,radius:m,label:i.symbol||"",prob:i.prob.toFixed(3)}),j}const W=["A","B","C","D","E"],qe=[.4,.25,.2,.1,.05];function Le(){const[i,$]=M.useState(qe),r=i.reduce((n,s)=>n+s,0),c=i.map(n=>n/r),{root:f,codes:j}=M.useMemo(()=>Ie(W,c),[c]),m=M.useMemo(()=>K(f,200,30,320),[f]),l=W.reduce((n,s,v)=>n+c[v]*(j[s]||"").length,0),h=-c.reduce((n,s)=>n+(s>0?s*Math.log2(s):0),0);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Huffman Tree Visualizer"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Adjust symbol probabilities. The Huffman code assigns shorter codes to more frequent symbols."}),e.jsx("div",{className:"mb-4 grid grid-cols-5 gap-2",children:W.map((n,s)=>e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-center text-xs font-medium text-gray-600 dark:text-gray-400",children:[n,": ",c[s].toFixed(2)]}),e.jsx("input",{type:"range",min:"1",max:"40",step:"1",value:Math.round(i[s]*40),onChange:v=>{const d=[...i];d[s]=+v.target.value/40,$(d)},className:"w-full accent-indigo-600"})]},n))}),e.jsx("div",{className:"overflow-x-auto rounded-lg bg-gray-50 dark:bg-gray-800",children:e.jsxs("svg",{viewBox:"0 0 400 200",className:"w-full",style:{minWidth:300},children:[m.filter(n=>n.type==="line").map((n,s)=>e.jsxs("g",{children:[e.jsx("line",{x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("text",{x:(n.x1+n.x2)/2-8,y:(n.y1+n.y2)/2,fontSize:"10",fill:"#6366f1",fontWeight:"bold",children:n.label})]},s)),m.filter(n=>n.type==="circle").map((n,s)=>e.jsxs("g",{children:[e.jsx("circle",{cx:n.x,cy:n.y,r:n.radius,fill:n.label?"#6366f1":"#e5e7eb"}),e.jsx("text",{x:n.x,y:n.y+4,textAnchor:"middle",fontSize:"10",fill:n.label?"white":"#374151",fontWeight:"bold",children:n.label||n.prob})]},s))]})}),e.jsx("div",{className:"mt-3 overflow-x-auto",children:e.jsxs("table",{className:"w-full text-xs",children:[e.jsx("thead",{children:e.jsx("tr",{className:"border-b border-gray-200 dark:border-gray-700",children:["Symbol","Prob","Code","Length"].map(n=>e.jsx("th",{className:"py-1 text-center text-gray-500",children:n},n))})}),e.jsx("tbody",{children:W.map((n,s)=>e.jsxs("tr",{className:"border-b border-gray-100 dark:border-gray-800",children:[e.jsx("td",{className:"py-1 text-center font-bold text-indigo-600",children:n}),e.jsx("td",{className:"py-1 text-center font-mono",children:c[s].toFixed(3)}),e.jsx("td",{className:"py-1 text-center font-mono text-emerald-600",children:j[n]||""}),e.jsx("td",{className:"py-1 text-center",children:(j[n]||"").length})]},n))})]})}),e.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-2 text-center text-xs",children:[e.jsxs("div",{className:"rounded bg-indigo-50 p-2 dark:bg-indigo-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-indigo-600",children:h.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"Entropy H(X) bits"})]}),e.jsxs("div",{className:"rounded bg-emerald-50 p-2 dark:bg-emerald-900/20",children:[e.jsx("div",{className:"font-mono font-bold text-emerald-600",children:l.toFixed(4)}),e.jsx("div",{className:"text-gray-500",children:"Avg code length bits"})]})]})]})}const Te=`import heapq
from collections import Counter

def huffman_encode(text):
    """Build Huffman code for given text."""
    freq = Counter(text)
    heap = [[w, [sym, '']] for sym, w in freq.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]: pair[1] = '0' + pair[1]
        for pair in hi[1:]: pair[1] = '1' + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])

    codes = {sym: code for sym, code in sorted(heapq.heappop(heap)[1:], key=lambda x: (len(x[-1]), x))}
    return codes

text = "aabbbccccdddddeeeeeee"
codes = huffman_encode(text)
freq = Counter(text)
n = len(text)

print("Huffman Codes:")
for sym, code in sorted(codes.items()):
    p = freq[sym] / n
    print(f"  '{sym}': p={p:.3f}, code='{code}', length={len(code)}")

# Average code length
avg_len = sum(freq[s]/n * len(c) for s, c in codes.items())
# Entropy
import numpy as np
probs = np.array(list(freq.values())) / n
H = -np.sum(probs * np.log2(probs))
print(f"\\nEntropy: {H:.4f} bits")
print(f"Avg code length: {avg_len:.4f} bits")
print(f"Efficiency: {H/avg_len:.4f} (1 = perfect)")

# Encode and decode
encoded = ''.join(codes[c] for c in text)
print(f"\\nEncoded length: {len(encoded)} bits (vs {n*8} for ASCII)")
print(f"Compression ratio: {len(encoded)/(n*8):.3f}")

# Arithmetic coding (simplified range coder)
# Provides near-entropy compression for any source
from fractions import Fraction

def arithmetic_encode(symbols, probs_dict, message):
    lo, hi = Fraction(0), Fraction(1)
    for sym in message:
        p = Fraction(*probs_dict[sym])
        # Cumulative probability
        cum = Fraction(0)
        for s in symbols:
            pp = Fraction(*probs_dict[s])
            if s == sym:
                new_lo = lo + (hi - lo) * cum
                new_hi = lo + (hi - lo) * (cum + pp)
                lo, hi = new_lo, new_hi
                break
            cum += pp
    return (lo + hi) / 2

symbols = ['a', 'b', 'c']
probs = {'a': (1, 2), 'b': (1, 4), 'c': (1, 4)}  # as fractions
code = arithmetic_encode(symbols, probs, "abc")
print(f"\\nArithmetic code for 'abc': {float(code):.6f}")
`;function ze(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"Compressing Information to Its Entropy",children:e.jsx("p",{children:"Source coding answers: what is the minimum number of bits needed to represent messages from a source? Shannon's source coding theorem establishes the entropy as the fundamental limit, and Huffman/arithmetic coding achieve it in practice."})}),e.jsx(Le,{}),e.jsx(T,{title:"Uniquely Decodable and Prefix-Free Codes",definition:"A code $C: \\mathcal{X} \\to \\{0,1\\}^*$ is uniquely decodable if no two sequences of symbols have the same encoding. It is prefix-free (instantaneous) if no codeword is a prefix of another. Prefix-free codes can be decoded without delay. By the Kraft inequality, a prefix-free code with lengths $l_1,\\ldots,l_n$ exists iff $\\sum_{i=1}^n 2^{-l_i} \\leq 1$.",notation:"Optimal prefix-free codes achieve average length $L^* = \\sum_i p_i l_i$ satisfying $H(X) \\leq L^* < H(X) + 1$ bits (per symbol). Shannon code: $l_i = \\lceil\\log_2(1/p_i)\\rceil$."}),e.jsx(T,{title:"Huffman Coding",definition:"The Huffman algorithm (1952) greedily constructs an optimal prefix-free code by repeatedly merging the two least-probable symbols into a combined node: (1) Create leaf nodes for each symbol with probability as key. (2) Merge the two lowest-probability nodes repeatedly, creating internal nodes. (3) Assign 0/1 to left/right branches. The resulting code is optimal among prefix-free codes.",notation:"Huffman coding achieves $L^* < H(X) + 1$. For i.i.d. sequences of length $n$, block Huffman coding achieves $L^*/n < H(X) + 1/n \\to H(X)$ as $n\\to\\infty$."}),e.jsx(X,{title:"Shannon's Source Coding Theorem",statement:"For an i.i.d. source with entropy $H(X)$ bits, the minimum expected number of bits per symbol achievable by any uniquely decodable code satisfies $L^* \\geq H(X)$. Moreover, there exist codes (Huffman, arithmetic) achieving $L^* < H(X) + \\epsilon$ for any $\\epsilon > 0$ using sufficiently long blocks. Thus $H(X)$ is the fundamental lower bound on compression rate.",proof:"Lower bound: For any prefix-free code with lengths $l_i$, by the Kraft inequality $\\sum_i 2^{-l_i} \\leq 1$. The average length $L = \\sum_i p_i l_i \\geq \\sum_i p_i \\log_2(1/p_i) = H(X)$ by the information inequality (using log-sum inequality or non-negativity of KL). Upper bound: Shannon code $l_i = \\lceil\\log_2(1/p_i)\\rceil$ achieves $L < H(X) + 1$. Block coding on $n$ symbols: $L_n/n < H(X) + 1/n$."}),e.jsx(F,{title:"Arithmetic Coding: Approaching Entropy",children:e.jsxs("p",{children:["Arithmetic coding encodes an entire message as a single fraction in ",e.jsx(t.InlineMath,{math:"[0,1)"}),". For i.i.d. source with probabilities ",e.jsx(t.InlineMath,{math:"\\{p_i\\}"}),", the message"," ",e.jsx(t.InlineMath,{math:"x_1,\\ldots,x_n"})," maps to an interval of width"," ",e.jsx(t.InlineMath,{math:"\\prod_i p_{x_i}"}),". The code uses ",e.jsx(t.InlineMath,{math:"-\\log_2\\prod_i p_{x_i} = \\sum_i \\log_2(1/p_{x_i})"})," ","bits — exactly the information content. Unlike Huffman, arithmetic coding achieves per-symbol efficiency of ",e.jsx(t.InlineMath,{math:"H(X)"})," bits without blocking."]})}),e.jsx(D,{title:"The Integer Constraint",children:e.jsxs("p",{children:["Huffman codes must use integer numbers of bits per symbol, creating inefficiency for sources with non-dyadic probabilities. A source with ",e.jsx(t.InlineMath,{math:"p(A) = 0.99"}),","," ",e.jsx(t.InlineMath,{math:"p(B) = 0.01"})," has entropy ",e.jsx(t.InlineMath,{math:"\\approx 0.08"})," bits, but Huffman assigns 1 bit to each symbol (average 1 bit vs 0.08 bit entropy). Arithmetic coding avoids this by encoding sequences, not individual symbols. ANS (Asymmetric Numeral Systems) is the modern practical alternative used in zstd, LZ4, and video codecs."]})}),e.jsx(H,{code:Te})]})}const Je=Object.freeze(Object.defineProperty({__proto__:null,default:ze},Symbol.toStringTag,{value:"Module"}));function A(i){const $=1/(1+.2316419*Math.abs(i)),r=$*(.31938153+$*(-.356563782+$*(1.781477937+$*(-1.821255978+$*1.330274429)))),f=1-Math.exp(-.5*i*i)/Math.sqrt(2*Math.PI)*r;return i>=0?1-f:f}function Ce(){const[i,$]=M.useState("uncoded"),r=M.useMemo(()=>{const a=[];for(let x=-2;x<=15;x+=.25){const p=Math.pow(10,x/10),w=A(Math.sqrt(2*p)),g=A(Math.sqrt(2*p)),L=3*g**2*(1-g)+g**3,o=A(Math.sqrt(2*p*4/7)),b=1-(1-o)**7-7*o*(1-o)**6;a.push({db:x,uncoded:w,rep:L,hamming:b})}return a},[]),c=480,f=220,j=44,m=16,l=16,h=36,n=c-j-m,s=f-l-h,v=a=>j+(a+2)/17*n,d=a=>{const x=Math.log10(Math.max(a,1e-7));return l+(x+7)/7*s},I=a=>r.filter(x=>x[a]>1e-7).map((x,y)=>`${y===0?"M":"L"}${v(x.db).toFixed(1)},${d(x[a]).toFixed(1)}`).join(" "),k=[{key:"uncoded",color:"#ef4444",label:"Uncoded BPSK"},{key:"rep",color:"#f97316",label:"Repetition (1/3)"},{key:"hamming",color:"#10b981",label:"Hamming(7,4)"}];return r.find(a=>Math.abs(a.db-8)<.3)||r[r.length-1],e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"BER vs SNR: Coding Gain Comparison"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Log-scale BER curves. Coding gain = SNR shift to achieve the same BER with vs without coding."}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${c} ${f}`,className:"w-full",style:{minWidth:300},children:[[-1,-2,-3,-4,-5,-6].map(a=>e.jsxs("g",{children:[e.jsx("line",{x1:j,y1:d(Math.pow(10,a)),x2:c-m,y2:d(Math.pow(10,a)),stroke:"#374151",strokeOpacity:.15,strokeDasharray:"3 3"}),e.jsxs("text",{x:j-4,y:d(Math.pow(10,a))+3,textAnchor:"end",fontSize:"8",fill:"#9ca3af",children:["10^",a]})]},a)),e.jsx("line",{x1:j,y1:l,x2:j,y2:l+s,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:j,y1:l+s,x2:c-m,y2:l+s,stroke:"#9ca3af",strokeWidth:1.5}),[0,3,6,9,12,15].map(a=>e.jsxs("g",{children:[e.jsx("line",{x1:v(a),y1:l+s,x2:v(a),y2:l+s+4,stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:v(a),y:l+s+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:a})]},a)),e.jsx("text",{x:c/2,y:f-2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"Eb/N0 (dB)"}),e.jsx("text",{x:10,y:l+s/2,textAnchor:"middle",fontSize:"9",fill:"#6b7280",transform:`rotate(-90, 10, ${l+s/2})`,children:"BER"}),k.map(({key:a,color:x})=>e.jsx("path",{d:I(a),fill:"none",stroke:x,strokeWidth:2},a)),k.map(({key:a,color:x,label:y},p)=>e.jsx("text",{x:c-m-4,y:l+14+p*14,textAnchor:"end",fontSize:"9",fill:x,children:y},a))]})})]})}const Pe=`import numpy as np
from scipy.special import erfc

# BER for BPSK over AWGN
def ber_bpsk(snr_db):
    snr = 10**(snr_db/10)
    return 0.5 * erfc(np.sqrt(snr))

# Hamming(7,4) code: [7,4,3] code
# Generator matrix for systematic Hamming(7,4)
G = np.array([
    [1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
], dtype=int)

# Parity check matrix
H_check = np.array([
    [1, 1, 0, 1, 1, 0, 0],
    [1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 1],
], dtype=int)

# Encode message
def encode_hamming(msg):
    return (msg @ G) % 2

# Syndrome decoding
def decode_hamming(received):
    syndrome = (received @ H_check.T) % 2
    # Convert syndrome to error position
    error_pos = 0
    for i, bit in enumerate(syndrome):
        error_pos += bit * (2**i)
    corrected = received.copy()
    if error_pos > 0:
        corrected[error_pos - 1] ^= 1
    return corrected[:4]  # Return information bits

# Simulate BER
np.random.seed(42)
n_trials = 100000
print("Hamming(7,4) BER Simulation:")
for snr_db in [0, 2, 4, 6, 8]:
    p_bit = ber_bpsk(snr_db * 4/7)  # Effective SNR per coded bit
    errors = 0
    for _ in range(n_trials // 7):
        msg = np.random.randint(0, 2, 4)
        codeword = encode_hamming(msg)
        # Random errors
        flip = np.random.random(7) < p_bit
        received = (codeword + flip.astype(int)) % 2
        decoded = decode_hamming(received)
        errors += np.sum(decoded != msg)
    ber = errors / (n_trials // 7 * 4)
    ber_uncoded = ber_bpsk(snr_db)
    print(f"  Eb/N0={snr_db}dB: BER_coded={ber:.2e}, BER_uncoded={ber_uncoded:.2e}")

# Modern codes: LDPC simulation via belief propagation (sketch)
print("\\nModern codes approach Shannon capacity within 0.1 dB (LDPC, Polar codes)")
print("Shannon capacity at 1 dB Eb/N0:", np.log2(1 + 10**(1/10)), "bits/use")
`;function Se(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"Error-Correcting Codes: Reliability at a Cost",children:e.jsx("p",{children:"Channel coding adds controlled redundancy to transmitted messages, enabling error correction at the receiver. Shannon's channel coding theorem promises reliable communication at any rate below capacity — but finding good codes that achieve this took decades of research, culminating in turbo codes (1993) and LDPC rediscovery, now used in 5G and Wi-Fi."})}),e.jsx(Ce,{}),e.jsx(T,{title:"Linear Block Codes",definition:"A linear $[n, k, d]$ code over $\\mathbb{F}_2$ is a $k$-dimensional subspace of $\\mathbb{F}_2^n$ with minimum Hamming distance $d$ between codewords. It can correct up to $t = \\lfloor(d-1)/2\\rfloor$ errors. The code is specified by a generator matrix $G \\in \\mathbb{F}_2^{k\\times n}$ (encoding: $\\mathbf{c} = \\mathbf{m}G$) or parity check matrix $H$ (syndrome check: $H\\mathbf{c}^T = \\mathbf{0}$). Examples: Hamming$[7,4,3]$, Reed-Solomon, LDPC.",notation:"Code rate: $R = k/n$ bits/coded bit. Information bits $k$, coded bits $n$, redundancy $n-k$ parity bits. Singleton bound: $d \\leq n - k + 1$ (MDS codes achieve equality)."}),e.jsx(T,{title:"LDPC Codes and Belief Propagation",definition:"Low-Density Parity Check (LDPC) codes (Gallager 1963, rediscovered 1995) have sparse parity check matrices $H$ with density $O(1/n)$. They are decoded iteratively via Belief Propagation (sum-product algorithm) on the Tanner graph: variable nodes exchange soft probability messages with check nodes until convergence. LDPC codes approach Shannon capacity within 0.0045 dB at block length $10^6$.",notation:"The Tanner graph is bipartite: variable nodes (codeword bits) connected to check nodes (parity equations). Message passing computes marginal posterior probabilities for each bit."}),e.jsx(X,{title:"Coding Gain and Channel Capacity",statement:"For a code with rate $R = k/n$ over an AWGN channel with Eb/N0 $= \\gamma$, the effective SNR per coded bit is $\\gamma_c = R\\gamma$. A code provides a coding gain over uncoded BPSK if its BER curve, plotted against Eb/N0, shifts left (requires less power for the same BER). The maximum achievable rate is the Shannon capacity $C = \\frac{1}{2}\\log_2(1 + 2R\\gamma)$, achievable only by ideal codes with $n\\to\\infty$.",proof:"For an ideal (capacity-achieving) code at rate $R$: reliable communication requires $R \\leq C = \\frac{1}{2}\\log_2(1 + 2R\\gamma)$. Setting $R = C$ and solving for the minimum required $\\gamma$: $2^{2R} - 1 = 2R\\gamma \\Rightarrow \\gamma_{\\min} = (2^{2R}-1)/(2R)$. As $R\\to 0$: $\\gamma_{\\min} \\to \\ln 2 \\approx -1.59$ dB (the Shannon limit). This is the minimum Eb/N0 for any rate, achieved in the limit of very low spectral efficiency."}),e.jsx(F,{title:"Polar Codes: First Capacity-Achieving Codes",children:e.jsxs("p",{children:["Polar codes (Arıkan 2009) are the first family of codes that provably achieve the capacity of binary-input symmetric channels with explicit construction and efficient encoding/decoding (successive cancellation, ",e.jsx(t.InlineMath,{math:"O(n\\log n)"}),"). They exploit the phenomenon of channel polarization: after ",e.jsx(t.InlineMath,{math:"\\log_2 n"}),'stages of combining, synthetic channels become either perfect or completely noisy. Information bits are sent over the good channels; the rest carry known "frozen" bits. Polar codes are now used in 5G NR for control channel coding.']})}),e.jsx(D,{title:"Capacity is for Memoryless Channels",children:e.jsx("p",{children:"Shannon capacity assumes i.i.d. noise (memoryless channel). Real channels have memory: fading, burst errors, frequency-selective interference. Codes designed for AWGN perform poorly over fading channels without interleaving. LDPC/turbo codes require long interleavers to randomize burst errors. For fading channels, the ergodic capacity averages over fading states, while outage capacity handles cases when the instantaneous channel is below the required rate."})}),e.jsx(H,{code:Pe})]})}const et=Object.freeze(Object.defineProperty({__proto__:null,default:Se},Symbol.toStringTag,{value:"Module"}));function Xe(){const[i,$]=M.useState(50),r=M.useMemo(()=>{const g=[];for(let b=1;b<=10;b++){const u=b*Math.log2(i)/2,N=15*(b<3?Math.exp(-.8*(b-1)):Math.exp(-.8*2)*(1-.1*(b-3)))+2,q=i/2*Math.log2(2*Math.PI*Math.E*N/i);g.push({k:b,L_model:u,L_data:q,total:u+q})}const o=Math.min(...g.map(b=>b.total));return{pts:g,kBest:g.find(b=>b.total===o).k}},[i]),c=480,f=220,j=44,m=16,l=16,h=32,n=c-j-m,s=f-l-h,v=[...r.pts.flatMap(g=>[g.L_model,g.L_data,g.total])],d=Math.min(...v),k=Math.max(...v)-d||1,a=g=>j+(g-1)/9*n,x=g=>l+s-(g-d)/k*s,y=r.pts.map((g,L)=>`${L===0?"M":"L"}${a(g.k).toFixed(1)},${x(g.L_model).toFixed(1)}`).join(" "),p=r.pts.map((g,L)=>`${L===0?"M":"L"}${a(g.k).toFixed(1)},${x(g.L_data).toFixed(1)}`).join(" "),w=r.pts.map((g,L)=>`${L===0?"M":"L"}${a(g.k).toFixed(1)},${x(g.total).toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"MDL: Model Complexity vs Description Length Tradeoff"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Total DL = L(model) + L(data|model). MDL selects the model minimizing total description length."}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Sample size n = ",i]}),e.jsx("input",{type:"range",min:"10",max:"200",step:"10",value:i,onChange:g=>$(+g.target.value),className:"w-full accent-indigo-600"})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800 overflow-x-auto",children:e.jsxs("svg",{viewBox:`0 0 ${c} ${f}`,className:"w-full",style:{minWidth:300},children:[e.jsx("line",{x1:j,y1:l,x2:j,y2:l+s,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:j,y1:l+s,x2:c-m,y2:l+s,stroke:"#9ca3af",strokeWidth:1.5}),[1,2,3,4,5,6,7,8,9,10].map(g=>e.jsxs("g",{children:[e.jsx("line",{x1:a(g),y1:l+s,x2:a(g),y2:l+s+4,stroke:"#9ca3af",strokeWidth:1}),e.jsx("text",{x:a(g),y:l+s+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:g})]},g)),e.jsx("text",{x:c/2,y:f-2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"k (parameters)"}),e.jsx("text",{x:10,y:l+s/2,textAnchor:"middle",fontSize:"9",fill:"#6b7280",transform:`rotate(-90, 10, ${l+s/2})`,children:"bits"}),e.jsx("line",{x1:a(3),y1:l,x2:a(3),y2:l+s,stroke:"#f59e0b",strokeWidth:1.5,strokeDasharray:"4 2"}),e.jsx("text",{x:a(3)+4,y:l+12,fontSize:"9",fill:"#f59e0b",children:"k*=3"}),e.jsx("line",{x1:a(r.kBest),y1:l,x2:a(r.kBest),y2:l+s,stroke:"#8b5cf6",strokeWidth:1.5,strokeDasharray:"4 2"}),e.jsxs("text",{x:a(r.kBest)+4,y:l+24,fontSize:"9",fill:"#8b5cf6",children:["MDL k=",r.kBest]}),e.jsx("path",{d:y,fill:"none",stroke:"#3b82f6",strokeWidth:2,strokeDasharray:"5 2"}),e.jsx("path",{d:p,fill:"none",stroke:"#10b981",strokeWidth:2,strokeDasharray:"5 2"}),e.jsx("path",{d:w,fill:"none",stroke:"#ef4444",strokeWidth:2.5}),e.jsx("text",{x:c-m-4,y:l+12,textAnchor:"end",fontSize:"9",fill:"#3b82f6",children:"L(model) ↗"}),e.jsx("text",{x:c-m-4,y:l+24,textAnchor:"end",fontSize:"9",fill:"#10b981",children:"L(data|model) ↘"}),e.jsx("text",{x:c-m-4,y:l+36,textAnchor:"end",fontSize:"9",fill:"#ef4444",children:"Total (MDL)"})]})})]})}const He=`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

np.random.seed(42)
n = 100
x = np.linspace(0, 4, n)
y = 2 * x**2 - x + 1 + np.random.normal(0, 0.8, n)  # True: degree 2

def mdl_score(X, y, k):
    """Two-part MDL: L(model) + L(data|model)."""
    lr = LinearRegression(fit_intercept=False)
    lr.fit(X, y)
    y_pred = lr.predict(X)
    rss = np.sum((y - y_pred)**2)
    sigma2 = rss / (n - k)

    # L(data|model): Gaussian log-likelihood
    L_data = n/2 * np.log(2 * np.pi * sigma2) + n/2

    # L(model): k parameters encoded at precision ~ log(n)/2 bits (Rissanen 1978)
    L_model = k/2 * np.log(n)

    return L_model + L_data, L_model, L_data

print("MDL model selection:")
print(f"{'Degree':>6} {'k':>4} {'L(model)':>10} {'L(data|M)':>11} {'Total':>10}")
for degree in range(1, 8):
    poly = PolynomialFeatures(degree)
    X = poly.fit_transform(x.reshape(-1, 1))
    k = degree + 1
    total, lm, ld = mdl_score(X, y, k)
    marker = " <-- MDL best" if degree == 2 else ""
    print(f"{degree:>6} {k:>4} {lm:>10.2f} {ld:>11.2f} {total:>10.2f}{marker}")

# NML (Normalized Maximum Likelihood) - a more principled MDL variant
# NML-MDL corresponds to BIC for Gaussian linear regression
from sklearn.metrics import mean_squared_error

print("\\nBIC comparison (approximately equivalent to MDL):")
for degree in range(1, 8):
    poly = PolynomialFeatures(degree)
    X = poly.fit_transform(x.reshape(-1, 1))
    k = degree + 1
    lr = LinearRegression(fit_intercept=False)
    lr.fit(X, y)
    sigma2 = np.mean((y - lr.predict(X))**2)
    ll = -n/2 * np.log(2 * np.pi * sigma2) - n/2
    bic = -2 * ll + k * np.log(n)
    print(f"  degree={degree}: BIC={bic:.2f}")
`;function De(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"Learning as Compression",children:e.jsx("p",{children:"The Minimum Description Length (MDL) principle, developed by Jorma Rissanen (1978), formalizes Occam's razor in information-theoretic terms: the best model is the one that allows the most compact description of the data. MDL provides a principled alternative to cross-validation for model selection."})}),e.jsx(Xe,{}),e.jsx(T,{title:"Two-Part MDL",definition:"Given a model class $\\mathcal{M} = \\{M_k\\}$ and data $\\mathbf{x}$, the two-part MDL selects the model minimizing: $L(M_k) + L(\\mathbf{x}|M_k)$ where $L(M_k)$ is the description length of the model (number of bits to specify it) and $L(\\mathbf{x}|M_k)$ is the description length of the data given the model (typically $-\\log_2 p(\\mathbf{x}|\\hat\\theta_{M_k})$). The optimal model balances compactness (small $L(M)$) with fit (small $L(\\mathbf{x}|M)$).",notation:"Rissanen (1978): for $k$ parameters estimated from $n$ data points, $L(M_k) = \\frac{k}{2}\\log n$ bits, giving MDL $\\approx -\\ell(\\hat\\theta) + \\frac{k}{2}\\log n = $ BIC/2. MDL and BIC are thus approximately equivalent."}),e.jsx(T,{title:"Normalized Maximum Likelihood (NML)",definition:"The one-part NML code avoids the arbitrary two-part split: $p_{\\mathrm{NML}}(\\mathbf{x}) = \\frac{p(\\mathbf{x}|\\hat\\theta(\\mathbf{x}))}{\\mathcal{C}_n}$ where $\\mathcal{C}_n = \\int p(\\mathbf{z}|\\hat\\theta(\\mathbf{z}))d\\mathbf{z}$ is the normalization constant (parametric complexity). NML achieves the minimax optimal individual sequence redundancy and is theoretically the ideal MDL code.",notation:"The parametric complexity $\\log_2\\mathcal{C}_n \\approx \\frac{k}{2}\\log_2\\frac{n}{2\\pi e} + \\text{const}$ quantifies the intrinsic complexity of the model class, related to its Fisher information volume."}),e.jsx(X,{title:"MDL Consistency",statement:"Under mild regularity conditions, two-part MDL with code length $L(M_k) = \\frac{k}{2}\\log n$ (Rissanen encoding) is model-selection consistent: if the true model $M_{k^*}$ is in the candidate set, then the MDL-selected model converges to $M_{k^*}$ almost surely as $n\\to\\infty$. This is the same consistency rate as BIC.",proof:"For any over-fitted model $M_k$ with $k > k^*$: the gain in fit $L(\\mathbf{x}|M_k) - L(\\mathbf{x}|M_{k^*}) = O_p(\\chi^2_{k-k^*}/2) = O_p(1)$ while the model complexity penalty grows as $(k-k^*)/2\\log n \\to\\infty$. Therefore MDL correctly rejects over-fitted models asymptotically. For under-fitted models: the data likelihood gap diverges, so MDL also correctly rejects them."}),e.jsx(F,{title:"MDL and Kolmogorov Complexity",children:e.jsxs("p",{children:["The theoretical ideal of MDL is Kolmogorov complexity: the length of the shortest program that computes ",e.jsx(t.InlineMath,{math:"\\mathbf{x}"}),". MDL approximates this by restricting to parametric model classes. A hypothesis ",e.jsx(t.InlineMath,{math:"H"}),' is "good" if it compresses the data: ',e.jsx(t.InlineMath,{math:"L(H) + L(\\mathbf{x}|H) \\ll L(\\mathbf{x})"}),". This connects learning to compression: every lossless compressor is implicitly a predictor, and every good predictor is a compressor."]})}),e.jsx(D,{title:"MDL Requires a Universal Code",children:e.jsx("p",{children:"The two-part MDL requires defining a code for the model parameters (the prior in Bayesian terms). The choice of parameterization matters: MDL is not invariant under reparameterization (unlike NML). For neural networks, the parameter space is enormous and highly redundant, making MDL difficult to apply directly. Practical alternatives: Bayesian model comparison (marginal likelihood) or variational MDL (bits-back coding, which underlies some VAE interpretations)."})}),e.jsx(H,{code:He})]})}const tt=Object.freeze(Object.defineProperty({__proto__:null,default:De},Symbol.toStringTag,{value:"Module"}));function Fe(){const[i,$]=M.useState(1),[r,c]=M.useState(5),f=(o,b)=>{const u=[];for(let q=0;q<=b;q++){const z=q/Math.max(b,1),C=3.5*(1-z*.7*(1/o)),P=1.2*(1-Math.exp(-o*z*1.5));u.push({t:q,ix:Math.max(0,C),iy:Math.min(1.2,P)})}return u},j=[.5,1,2,5],m=M.useMemo(()=>j.map(o=>f(o,r)),[i,r]),l=[];for(let o=0;o<=5;o+=.1){const b=3.5*Math.exp(-.3*o),u=1.2*(1-Math.exp(-o*.8));l.push({ix:b,iy:u})}const h=380,n=300,s=44,v=20,d=20,I=40,k=h-s-v,a=n-d-I,x=4,y=1.4,p=o=>s+o/x*k,w=o=>d+a-o/y*a,g=l.map((o,b)=>`${b===0?"M":"L"}${p(o.ix).toFixed(1)},${w(o.iy).toFixed(1)}`).join(" "),L=["#3b82f6","#10b981","#f59e0b","#ef4444"];return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Information Plane: I(X;Z) vs I(Z;Y)"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Training trajectories in the information plane. β controls compression-prediction tradeoff. Curve = IB optimal boundary."}),e.jsxs("div",{className:"mb-4 grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Active β = ",i.toFixed(1)]}),e.jsx("input",{type:"range",min:"0.5",max:"5",step:"0.5",value:i,onChange:o=>$(+o.target.value),className:"w-full accent-indigo-600"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",children:["Training epochs = ",r]}),e.jsx("input",{type:"range",min:"1",max:"20",step:"1",value:r,onChange:o=>c(+o.target.value),className:"w-full accent-emerald-500"})]})]}),e.jsx("div",{className:"flex justify-center rounded-lg bg-gray-50 dark:bg-gray-800",children:e.jsxs("svg",{viewBox:`0 0 ${h} ${n}`,className:"w-full max-w-sm",children:[[0,1,2,3].map(o=>e.jsxs("g",{children:[e.jsx("line",{x1:p(o),y1:d,x2:p(o),y2:d+a,stroke:"#374151",strokeOpacity:.15,strokeDasharray:"3 3"}),e.jsx("text",{x:p(o),y:d+a+14,textAnchor:"middle",fontSize:"9",fill:"#9ca3af",children:o})]},o)),[0,.4,.8,1.2].map(o=>e.jsxs("g",{children:[e.jsx("line",{x1:s,y1:w(o),x2:s+k,y2:w(o),stroke:"#374151",strokeOpacity:.15,strokeDasharray:"3 3"}),e.jsx("text",{x:s-4,y:w(o)+3,textAnchor:"end",fontSize:"9",fill:"#9ca3af",children:o.toFixed(1)})]},o)),e.jsx("line",{x1:s,y1:d,x2:s,y2:d+a,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("line",{x1:s,y1:d+a,x2:s+k,y2:d+a,stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("text",{x:s+k/2,y:n-4,textAnchor:"middle",fontSize:"10",fill:"#6b7280",children:"I(X;Z) bits"}),e.jsx("text",{x:12,y:d+a/2,textAnchor:"middle",fontSize:"10",fill:"#6b7280",transform:`rotate(-90, 12, ${d+a/2})`,children:"I(Z;Y) bits"}),e.jsx("path",{d:g,fill:"none",stroke:"#8b5cf6",strokeWidth:2,strokeDasharray:"5 3"}),e.jsx("text",{x:p(3),y:w(.85),fontSize:"9",fill:"#8b5cf6",children:"IB curve"}),m.map((o,b)=>{const u=o.map((N,q)=>`${q===0?"M":"L"}${p(N.ix).toFixed(1)},${w(N.iy).toFixed(1)}`).join(" "),_=o[o.length-1];return e.jsxs("g",{children:[e.jsx("path",{d:u,fill:"none",stroke:L[b],strokeWidth:1.8}),e.jsx("circle",{cx:p(_.ix),cy:w(_.iy),r:4,fill:L[b]}),e.jsxs("text",{x:p(_.ix)+6,y:w(_.iy)+3,fontSize:"8",fill:L[b],children:["β=",j[b]]})]},b)})]})})]})}const Ee=`import numpy as np
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
`;function Be(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(S,{title:"The IB: Compression with Preservation",children:e.jsx("p",{children:"The Information Bottleneck (IB) principle (Tishby, Pereira, Bialek 1999) provides a theoretical framework for finding the optimal tradeoff between compression and prediction: extract a representation Z of X that retains as much information about Y as possible while compressing X. This framework has been proposed as a lens for understanding deep learning."})}),e.jsx(Fe,{}),e.jsx(T,{title:"Information Bottleneck Objective",definition:"Given the joint distribution $p(X,Y)$, the IB method finds a stochastic mapping $p(Z|X)$ (encoder) that forms the Markov chain $Y \\to X \\to Z$ and solves: $\\min_{p(Z|X)} I(X;Z) - \\beta \\cdot I(Z;Y)$. The Lagrange multiplier $\\beta \\geq 0$ controls the tradeoff: small $\\beta$ → compress heavily (small $I(X;Z)$), large $\\beta$ → preserve prediction (large $I(Z;Y)$).",notation:"The IB objective traces a curve in the information plane $(I(X;Z), I(Z;Y))$. Each point on the curve is an optimal solution for some $\\beta$. The curve is monotone: more compression necessarily reduces prediction."}),e.jsx(T,{title:"IB Self-Consistent Equations",definition:"The IB optimum satisfies the fixed-point equations: (1) $p(z|x) = \\frac{p(z)}{Z(\\beta,x)}\\exp(-\\beta D_{KL}(p(y|x)\\|p(y|z)))$, (2) $p(z) = \\sum_x p(x)p(z|x)$, (3) $p(y|z) = \\sum_x p(y|x)p(x|z)$. These can be solved by the Blahut-Arimoto algorithm (iterate until convergence). The encoder assigns higher probability to $z$ that 'explains' $p(y|x)$ well.",notation:"For Gaussian variables: the optimal IB solution is Gaussian, and $Z$ is a noisy version of the linear MMSE estimate of $Y$ from $X$. The IB tradeoff curve is a segment of the capacity-distortion curve."}),e.jsx(X,{title:"IB and Sufficient Statistics",statement:"A representation $Z$ is a sufficient statistic of $X$ for $Y$ (i.e., $Y \\perp X | Z$) if and only if $I(Z;Y) = I(X;Y)$ — maximum possible prediction. The IB curve ranges from the trivial encoder ($Z$ independent of $X$, $I(X;Z) = I(Z;Y) = 0$) to the sufficient statistic ($I(Z;Y) = I(X;Y)$, achieved at $\\beta \\to \\infty$). The minimum sufficient statistic minimizes $I(X;Z)$ subject to $I(Z;Y) = I(X;Y)$.",proof:"If $Y \\perp X | Z$, then by the data processing inequality $I(X;Y) \\leq I(Z;Y)$. But $Z$ is a function of $X$, so $I(Z;Y) \\leq I(X;Y)$ also holds. Therefore $I(Z;Y) = I(X;Y)$. Conversely, if $I(Z;Y) = I(X;Y)$, then $I(X;Y|Z) = I(X;Y) - I(Z;Y) + I(X;Z|Y) = I(X;Z|Y) \\geq 0$. But also $0 \\leq I(Y;X|Z) = I(X;Y) - I(Z;Y) = 0$, implying $Y \\perp X|Z$."}),e.jsx(F,{title:"IB and Deep Learning (Tishby & Schwartz-Ziv 2017)",children:e.jsxs("p",{children:["The controversial claim: deep neural networks trained with SGD naturally compress irrelevant information during training, tracing a path in the information plane. Early in training: rapid increase in ",e.jsx(t.InlineMath,{math:"I(Z;Y)"})," (fitting). Later: slow decrease in ",e.jsx(t.InlineMath,{math:"I(X;Z)"})," (compression via noise from SGD). This was proposed as a theory of generalization, though subsequent work showed the compression phase depends heavily on the activation function and is not universal."]})}),e.jsx(D,{title:"IB for Continuous Variables is Ill-Defined",children:e.jsxs("p",{children:["For continuous variables, the IB objective with a deterministic encoder always gives",e.jsx(t.InlineMath,{math:"I(X;Z) = \\infty"})," unless the encoder is stochastic or regularized. This is why VAEs implicitly implement an IB: the ELBO penalizes ",e.jsx(t.InlineMath,{math:"D_{KL}(q(Z|X)\\|p(Z))"}),"which upper-bounds ",e.jsx(t.InlineMath,{math:"I(X;Z)"})," (since ",e.jsx(t.InlineMath,{math:"\\mathbb{E}[D_{KL}(q(z|x)\\|p(z))] \\geq I(X;Z)"}),"under the marginal prior). The IB-VAE explicitly optimizes the IB objective for learned representations."]})}),e.jsx(H,{code:Ee})]})}const it=Object.freeze(Object.defineProperty({__proto__:null,default:Be},Symbol.toStringTag,{value:"Module"}));export{Ze as a,Oe as b,Qe as c,Ge as d,Ve as e,Ue as f,Je as g,et as h,tt as i,it as j,Re as s};
