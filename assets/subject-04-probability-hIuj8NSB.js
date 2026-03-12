import{j as e,r as M}from"./vendor-JIDYfPag.js";import{r as a}from"./vendor-katex-Pf_QKVW_.js";import{D as w,T as S,E as q,W as F,P as C,N as G,R as K}from"./subject-01-foundations-Du8YIVsd.js";import{S as W,E as O}from"./subject-02-linear-algebra-V1nMoh9O.js";import{R as V,B as R,C as U,X as Q,Y as Z,T as J,a as ee}from"./vendor-charts-Ccq586Dw.js";function te(){const[i,$]=M.useState(.5),[r,k]=M.useState(.4),[p,j]=M.useState(.2),y=Math.min(p,i,r),v=i+r-y,f=v<=1&&y>=0,g=i>0?y/i:0;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Probability Space: Event Probabilities"}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-6",children:[e.jsxs("svg",{viewBox:"0 0 300 200",className:"w-full max-w-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700",children:[e.jsx("rect",{x:5,y:5,width:290,height:190,rx:8,fill:"none",stroke:"#9ca3af",strokeWidth:1.5}),e.jsx("text",{x:270,y:20,fontSize:11,fill:"#6b7280",textAnchor:"end",children:"Ω"}),e.jsx("ellipse",{cx:115,cy:100,rx:75,ry:60,fill:`rgba(59,130,246,${i*.5})`,stroke:"#3b82f6",strokeWidth:2}),e.jsx("ellipse",{cx:185,cy:100,rx:75,ry:60,fill:`rgba(16,185,129,${r*.5})`,stroke:"#10b981",strokeWidth:2}),e.jsx("text",{x:80,y:100,fontSize:12,fill:"#1d4ed8",fontWeight:"700",children:"A"}),e.jsx("text",{x:220,y:100,fontSize:12,fill:"#059669",fontWeight:"700",children:"B"}),e.jsx("text",{x:150,y:100,fontSize:10,fill:"#7c3aed",fontWeight:"600",children:"A∩B"})]}),e.jsxs("div",{className:"flex-1 space-y-3",children:[[{label:"P(A)",val:i,set:$,color:"#3b82f6"},{label:"P(B)",val:r,set:k,color:"#10b981"},{label:"P(A∩B)",val:p,set:j,color:"#7c3aed"}].map(({label:u,val:x,set:h,color:n})=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",style:{color:n},children:[e.jsx("span",{className:"font-mono font-semibold",children:u}),e.jsx("span",{children:x.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"0.9",step:"0.05",value:x,onChange:c=>h(parseFloat(c.target.value)),className:"w-full",style:{accentColor:n}})]},u)),e.jsxs("div",{className:`rounded-lg p-3 text-sm space-y-1 ${f?"bg-green-50 dark:bg-green-900/20":"bg-red-50 dark:bg-red-900/20"}`,children:[e.jsxs("div",{children:["P(A∪B) = P(A)+P(B)−P(A∩B) = ",e.jsx("strong",{children:v.toFixed(3)})]}),e.jsxs("div",{children:["P(B|A) = P(A∩B)/P(A) = ",e.jsx("strong",{children:g.toFixed(3)})]}),e.jsxs("div",{children:["P(Aᶜ) = 1−P(A) = ",e.jsx("strong",{children:(1-i).toFixed(2)})]})]})]})]})]})}function ae(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(te,{}),e.jsx(w,{label:"Definition 1.1.1",title:"Kolmogorov Axioms",definition:"A probability space is a triple $(\\Omega, \\mathcal{F}, P)$ where $\\Omega$ is the sample space, $\\mathcal{F}$ is a σ-algebra of events, and $P: \\mathcal{F} \\to [0,1]$ is a probability measure satisfying: (K1) $P(\\Omega) = 1$; (K2) $P(A) \\geq 0$ for all $A \\in \\mathcal{F}$; (K3) For mutually disjoint events $A_1, A_2, \\ldots \\in \\mathcal{F}$: $P\\left(\\bigsqcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$ (countable additivity).",notation:"Consequences: $P(\\emptyset) = 0$; $P(A^c) = 1 - P(A)$; $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ (inclusion-exclusion); monotonicity: $A \\subseteq B \\Rightarrow P(A) \\leq P(B)$; continuity: $A_n \\nearrow A \\Rightarrow P(A_n) \\nearrow P(A)$."}),e.jsx(w,{label:"Definition 1.1.2",title:"Conditional Probability and Independence",definition:"The conditional probability of $A$ given $B$ (with $P(B) > 0$) is $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. Events $A$ and $B$ are independent if $P(A \\cap B) = P(A) P(B)$, equivalently $P(A|B) = P(A)$ (if $P(B) > 0$). A collection $\\{A_i\\}$ is mutually independent if for every finite subset $S$: $P\\left(\\bigcap_{i \\in S} A_i\\right) = \\prod_{i \\in S} P(A_i)$."}),e.jsx(S,{label:"Theorem 1.1.1",title:"Bayes' Theorem",statement:"Let $\\{B_1, \\ldots, B_n\\}$ be a partition of $\\Omega$ with $P(B_i) > 0$. For any event $A$ with $P(A) > 0$: $P(B_k | A) = \\frac{P(A | B_k) P(B_k)}{\\sum_{i=1}^n P(A | B_i) P(B_i)} = \\frac{P(A|B_k) P(B_k)}{P(A)}$. The denominator $P(A) = \\sum_i P(A|B_i) P(B_i)$ is the law of total probability.",proof:"By definition of conditional probability: $P(B_k|A) = P(B_k \\cap A)/P(A)$. Apply conditional probability again: $P(B_k \\cap A) = P(A|B_k) P(B_k)$. Expand $P(A) = P(A \\cap \\Omega) = P\\left(A \\cap \\bigsqcup_i B_i\\right) = \\sum_i P(A \\cap B_i) = \\sum_i P(A|B_i)P(B_i)$.",corollaries:["Prior $P(B_k)$, likelihood $P(A|B_k)$, posterior $P(B_k|A)$ — the language of Bayesian inference.","Conjugate priors: choosing a prior in the same family as the posterior greatly simplifies Bayesian updating."]}),e.jsxs(q,{title:"Monty Hall Problem via Conditional Probability",children:[e.jsx("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:"Three doors: car behind one, goats behind two. You pick door 1. Host opens a goat door (say door 3). Should you switch?"}),e.jsx(a.BlockMath,{math:"P(\\text{car at 2} | \\text{host opens 3}) = \\frac{P(\\text{open 3} | \\text{car at 2}) P(\\text{car at 2})}{P(\\text{open 3})} = \\frac{1 \\cdot 1/3}{1/2} = \\frac{2}{3}"}),e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Switching wins with probability 2/3. Staying wins with probability 1/3."})]}),e.jsx(F,{title:"Pairwise Independence ≠ Mutual Independence",children:e.jsxs("p",{children:["Three events can be pairwise independent but not mutually independent. Example: flip two fair coins. Let ",e.jsx(a.InlineMath,{math:"A"})," = first coin heads,"," ",e.jsx(a.InlineMath,{math:"B"})," = second coin heads, ",e.jsx(a.InlineMath,{math:"C"})," = exactly one head. Each pair is independent (",e.jsx(a.InlineMath,{math:"P(A \\cap B) = P(A)P(B) = 1/4"}),", etc.), but ",e.jsx(a.InlineMath,{math:"P(A \\cap B \\cap C) = 0 \\neq P(A)P(B)P(C) = 1/8"}),". Always check all subsets for mutual independence."]})}),e.jsx(C,{title:"Probability Axioms and Bayes' Theorem",code:`import numpy as np

# ── Verify Kolmogorov axioms for discrete probability ───────────────────
omega = list(range(1, 7))  # fair die
P = {i: 1/6 for i in omega}  # uniform measure

# K1: P(Omega) = 1
print(f"K1: P(Ω) = {sum(P.values()):.6f}")
# K2: P(A) >= 0
print(f"K2: all P(ω) >= 0: {all(p >= 0 for p in P.values())}")
# K3: countable additivity
A = {1, 2, 3}; B = {4, 5, 6}
PA = sum(P[i] for i in A); PB = sum(P[i] for i in B)
P_AunionB = sum(P[i] for i in A | B)
print(f"K3: P(A∪B) = {P_AunionB:.4f} = P(A)+P(B) = {PA+PB:.4f} (disjoint)")

# ── Bayes' theorem: Medical test ─────────────────────────────────────────
# Disease prevalence, test sensitivity/specificity
P_disease = 0.01       # 1% prevalence
P_pos_given_dis = 0.99  # sensitivity
P_pos_given_no = 0.05   # false positive rate

P_no_disease = 1 - P_disease
P_pos = P_pos_given_dis * P_disease + P_pos_given_no * P_no_disease
P_disease_given_pos = P_pos_given_dis * P_disease / P_pos

print(f"\\nBayes' theorem — Medical test:")
print(f"  P(disease) = {P_disease:.3f}")
print(f"  P(positive | disease) = {P_pos_given_dis:.3f}")
print(f"  P(positive | no disease) = {P_pos_given_no:.3f}")
print(f"  P(positive) = {P_pos:.4f}")
print(f"  P(disease | positive) = {P_disease_given_pos:.4f}")
print(f"  (Only {P_disease_given_pos:.1%} of positive tests are true positives!)")

# ── Monte Carlo verification of Monty Hall ───────────────────────────────
np.random.seed(42)
n = 100000
wins_switch = wins_stay = 0
for _ in range(n):
    car = np.random.randint(3)
    choice = np.random.randint(3)
    # Host opens a goat door (not car, not choice)
    remaining = [d for d in range(3) if d != choice and d != car]
    host_opens = np.random.choice(remaining)
    # Switch to the other door
    switch_to = next(d for d in range(3) if d != choice and d != host_opens)
    wins_switch += (switch_to == car)
    wins_stay += (choice == car)
print(f"\\nMonty Hall (n={n}): stay={wins_stay/n:.4f}, switch={wins_switch/n:.4f}")`})]})}const ze=Object.freeze(Object.defineProperty({__proto__:null,default:ae},Symbol.toStringTag,{value:"Module"}));function ne(){const[i,$]=M.useState("poisson"),[r,k]=M.useState(3),[p,j]=M.useState(10),[y,v]=M.useState(.4),f=s=>s<=1?1:s*f(s-1),g=(s,o)=>f(s)/(f(o)*f(s-o)),u=i==="poisson"?Math.max(15,Math.ceil(r*2.5)):p,x=Array.from({length:u+1},(s,o)=>o),h=i==="poisson"?x.map(s=>Math.exp(-r)*Math.pow(r,s)/f(s)):x.map(s=>s>p?0:g(p,s)*Math.pow(y,s)*Math.pow(1-y,p-s)),n=i==="poisson"?r:p*y,c=i==="poisson"?r:p*y*(1-y),m=340,t=180,d=Math.max(...h,.01),l=Math.max(4,(m-40)/(u+1)-2);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"PMF Bar Chart"}),e.jsx("div",{className:"mb-3 flex gap-3",children:[["poisson","Poisson"],["binomial","Binomial"]].map(([s,o])=>e.jsx("button",{onClick:()=>$(s),className:`rounded-lg px-3 py-1 text-sm font-medium ${i===s?"bg-indigo-500 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`,children:o},s))}),e.jsxs("svg",{width:m,height:t,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[x.map((s,o)=>{if(h[o]<1e-6)return null;const _=h[o]/d*(t-30),X=25+o*(l+2);return e.jsxs("g",{children:[e.jsx("rect",{x:X,y:t-20-_,width:l,height:_,fill:"#6366f1",rx:1,opacity:.8}),l>8&&o%Math.max(1,Math.floor(u/10))===0&&e.jsx("text",{x:X+l/2,y:t-5,fontSize:8,fill:"#6b7280",textAnchor:"middle",children:s})]},s)}),e.jsx("line",{x1:20,y1:t-20,x2:m,y2:t-20,stroke:"#9ca3af",strokeWidth:1}),(()=>{const s=25+n*(l+2)+l/2;return e.jsx("line",{x1:s,y1:0,x2:s,y2:t-20,stroke:"#ef4444",strokeWidth:2,strokeDasharray:"4,3"})})()]}),e.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-3",children:[i==="poisson"?e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{className:"text-indigo-600",children:"λ (mean)"}),e.jsx("span",{children:r})]}),e.jsx("input",{type:"range",min:"0.5",max:"12",step:"0.5",value:r,onChange:s=>k(parseFloat(s.target.value)),className:"w-full accent-indigo-500"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:"n"}),e.jsx("span",{children:p})]}),e.jsx("input",{type:"range",min:"1",max:"20",step:"1",value:p,onChange:s=>j(parseInt(s.target.value)),className:"w-full accent-indigo-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:"p"}),e.jsx("span",{children:y.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.05",max:"0.95",step:"0.05",value:y,onChange:s=>v(parseFloat(s.target.value)),className:"w-full accent-indigo-500"})]})]}),e.jsxs("div",{className:"rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm col-span-2",children:["E[X] = ",n.toFixed(2),", Var(X) = ",c.toFixed(2),", SD = ",Math.sqrt(c).toFixed(2)]})]})]})}function ie(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(ne,{}),e.jsx(w,{label:"Definition 2.1.1",title:"Discrete Random Variable",definition:"A random variable $X: \\Omega \\to \\mathbb{R}$ is discrete if it takes countably many values $\\{x_1, x_2, \\ldots\\}$. Its probability mass function (PMF) is $p(x) = P(X = x)$ for each $x$ in the support, with $p(x) \\geq 0$ and $\\sum_x p(x) = 1$. The cumulative distribution function (CDF) is $F(x) = P(X \\leq x) = \\sum_{x_i \\leq x} p(x_i)$.",notation:"Expected value: $E[X] = \\sum_x x \\cdot p(x)$ (requires absolute convergence). For function $g$: $E[g(X)] = \\sum_x g(x) p(x)$ (law of the unconscious statistician)."}),e.jsx(w,{label:"Definition 2.1.2",title:"Variance and Standard Deviation",definition:"The variance of $X$ is $\\text{Var}(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2$. It measures spread around the mean. Standard deviation $\\sigma = \\sqrt{\\text{Var}(X)}$ has the same units as $X$. Key properties: $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$; for independent $X, Y$: $\\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y)$."}),e.jsx(S,{label:"Theorem 2.1.1",title:"Markov and Chebyshev Inequalities",statement:"Markov: For non-negative $X$ and $a > 0$: $P(X \\geq a) \\leq E[X]/a$. Chebyshev: For any $X$ with finite variance and $k > 0$: $P(|X - E[X]| \\geq k\\sigma) \\leq 1/k^2$. Chebyshev bounds hold for all distributions with finite variance.",proof:"Markov: $E[X] = \\sum_x x p(x) \\geq \\sum_{x \\geq a} x p(x) \\geq a \\sum_{x \\geq a} p(x) = a P(X \\geq a)$. Chebyshev: apply Markov to $Y = (X - \\mu)^2$ with $a = k^2 \\sigma^2$: $P(Y \\geq k^2\\sigma^2) \\leq E[Y]/(k^2\\sigma^2) = \\sigma^2/(k^2\\sigma^2) = 1/k^2$."}),e.jsxs(q,{title:"Poisson Distribution as Limit of Binomial",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:[e.jsx(a.InlineMath,{math:"\\text{Bin}(n, \\lambda/n) \\to \\text{Poisson}(\\lambda)"})," as ",e.jsx(a.InlineMath,{math:"n \\to \\infty"}),"."]}),e.jsx(a.BlockMath,{math:"P(X=k) = \\binom{n}{k}\\left(\\frac{\\lambda}{n}\\right)^k\\left(1-\\frac{\\lambda}{n}\\right)^{n-k} \\xrightarrow{n\\to\\infty} \\frac{e^{-\\lambda}\\lambda^k}{k!}"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["Models rare events: radioactive decays, web requests, typos per page. For Poisson: ",e.jsx(a.InlineMath,{math:"E[X] = \\text{Var}(X) = \\lambda"}),"."]})]}),e.jsx(F,{title:"E[g(X)] ≠ g(E[X]) in General",children:e.jsxs("p",{children:["Jensen's inequality: for convex ",e.jsx(a.InlineMath,{math:"g"}),", ",e.jsx(a.InlineMath,{math:"E[g(X)] \\geq g(E[X])"}),". Example: ",e.jsx(a.InlineMath,{math:"E[X^2] \\geq (E[X])^2"})," (variance is non-negative). For concave"," ",e.jsx(a.InlineMath,{math:"g"})," (like ",e.jsx(a.InlineMath,{math:"\\sqrt{\\cdot}"})," or ",e.jsx(a.InlineMath,{math:"\\log"}),"), the inequality reverses. This has major consequences: the average of squared errors is not the square of average errors; expected utility theory differs from expected value theory in economics."]})}),e.jsx(C,{title:"Discrete Distributions with NumPy and SciPy",code:`import numpy as np
from scipy import stats

# ── Poisson distribution ──────────────────────────────────────────────────
lam = 3
X = stats.poisson(mu=lam)
print(f"Poisson(λ=3):")
print(f"  E[X] = {X.mean():.4f} (should be {lam})")
print(f"  Var(X) = {X.var():.4f} (should be {lam})")
print(f"  PMF at k=0..5: {[X.pmf(k) for k in range(6)]}")

# ── Binomial distribution ─────────────────────────────────────────────────
n, p = 10, 0.4
Y = stats.binom(n=n, p=p)
print(f"\\nBinomial(n=10, p=0.4):")
print(f"  E[Y] = {Y.mean():.4f} (should be {n*p:.4f})")
print(f"  Var(Y) = {Y.var():.4f} (should be {n*p*(1-p):.4f})")

# Poisson approximation to Binomial
n_large, p_small = 100, 0.03  # n*p = 3
Z_binom = stats.binom(n=n_large, p=p_small)
Z_poisson = stats.poisson(mu=n_large*p_small)
print(f"\\nPoisson approx: Bin(100, 0.03) vs Poisson(3)")
for k in range(8):
    print(f"  k={k}: Binom={Z_binom.pmf(k):.5f}, Poisson={Z_poisson.pmf(k):.5f}")

# ── Chebyshev bound verification ──────────────────────────────────────────
lam_test = 4
X_test = stats.poisson(mu=lam_test)
k_vals = np.arange(0, 25)
sigma = np.sqrt(lam_test)
for k_sigma in [1, 2, 3]:
    actual = 1 - X_test.cdf(lam_test + k_sigma*sigma) + X_test.cdf(lam_test - k_sigma*sigma - 1)
    bound = 1 / k_sigma**2
    print(f"  P(|X-λ|≥{k_sigma}σ): actual={actual:.4f}, Chebyshev≤{bound:.4f}")`})]})}const He=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"})),T={normal:{label:"Normal",params:[{name:"μ",min:-3,max:3,step:.1,def:0},{name:"σ",min:.3,max:3,step:.1,def:1}]},exponential:{label:"Exponential",params:[{name:"λ",min:.2,max:5,step:.1,def:1}]}};function se(){const[i,$]=M.useState("normal"),[r,k]=M.useState({μ:0,σ:1,λ:1}),p=t=>{if(i==="normal"){const{μ:d,σ:l}=r;return 1/(l*Math.sqrt(2*Math.PI))*Math.exp(-.5*((t-d)/l)**2)}if(i==="exponential"){const{λ:d}=r;return t<0?0:d*Math.exp(-d*t)}return 0},j=t=>{const d=1/(1+.3275911*Math.abs(t)),s=1-d*(.254829592+d*(-.284496736+d*(1.421413741+d*(-1.453152027+d*1.061405429))))*Math.exp(-t*t);return t>=0?s:-s},y=t=>{if(i==="normal"){const{μ:d,σ:l}=r;return .5*(1+j((t-d)/(l*Math.sqrt(2))))}if(i==="exponential"){const{λ:d}=r;return t<0?0:1-Math.exp(-d*t)}return 0},v=i==="normal"?r.μ-4*r.σ:-.2,f=i==="normal"?r.μ+4*r.σ:5/Math.max(r.λ,.5),g=340,u=180,x=300,h=Math.max(...Array.from({length:x},(t,d)=>p(v+d/x*(f-v)))),n=(t,d,l)=>Array.from({length:x+1},(o,_)=>{const X=v+_/x*(f-v),b=t(X),P=_/x*g,N=u-(Math.max(d,Math.min(l,b))-d)/(l-d)*u;return`${_===0?"M":"L"}${P.toFixed(1)},${N.toFixed(1)}`}).join(" "),c=n(p,0,h*1.1),m=n(y,0,1.05);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"PDF & CDF Visualizer"}),e.jsx("div",{className:"mb-3 flex gap-3",children:Object.entries(T).map(([t,d])=>e.jsx("button",{onClick:()=>$(t),className:`rounded-lg px-3 py-1 text-sm font-medium ${i===t?"bg-indigo-500 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`,children:d.label},t))}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 mb-1",children:"PDF"}),e.jsx("svg",{width:g/2,height:u,className:"rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:e.jsx("path",{d:c,fill:"rgba(99,102,241,0.15)",stroke:"#6366f1",strokeWidth:2})})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 mb-1",children:"CDF"}),e.jsx("svg",{width:g/2,height:u,className:"rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:e.jsx("path",{d:m,fill:"rgba(16,185,129,0.1)",stroke:"#10b981",strokeWidth:2})})]})]}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:T[i].params.map(({name:t,min:d,max:l,step:s})=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{className:"font-mono",children:t}),e.jsx("span",{children:r[t]?.toFixed(2)})]}),e.jsx("input",{type:"range",min:d,max:l,step:s,value:r[t]??1,onChange:o=>k(_=>({..._,[t]:parseFloat(o.target.value)})),className:"w-full accent-indigo-500"})]},t))})]})}function re(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(se,{}),e.jsx(w,{label:"Definition 2.2.1",title:"Continuous Random Variable",definition:"A random variable $X$ is continuous if there exists a non-negative function $f: \\mathbb{R} \\to [0,\\infty)$ (the PDF) such that $P(a \\leq X \\leq b) = \\int_a^b f(x)\\,dx$ for all $a \\leq b$. The PDF satisfies $\\int_{-\\infty}^\\infty f(x)\\,dx = 1$. The CDF is $F(x) = P(X \\leq x) = \\int_{-\\infty}^x f(t)\\,dt$, and $F'(x) = f(x)$ wherever $f$ is continuous.",notation:"For continuous $X$: $P(X = a) = 0$ for all $a$ (singletons have measure zero). Expectation: $E[X] = \\int_{-\\infty}^\\infty x f(x)\\,dx$. Variance: $\\text{Var}(X) = \\int_{-\\infty}^\\infty (x - \\mu)^2 f(x)\\,dx = E[X^2] - (E[X])^2$."}),e.jsx(w,{label:"Definition 2.2.2",title:"Standard Normal and Gaussian Family",definition:"The standard normal $Z \\sim N(0,1)$ has PDF $\\phi(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-z^2/2}$. If $X \\sim N(\\mu, \\sigma^2)$, then $X = \\mu + \\sigma Z$ and $f(x) = \\frac{1}{\\sigma}\\phi\\left(\\frac{x-\\mu}{\\sigma}\\right)$. The CDF $\\Phi(z) = \\int_{-\\infty}^z \\phi(t)\\,dt$ has no closed form but is tabulated. The 68-95-99.7 rule: $P(|Z| \\leq 1) \\approx 0.683$, $P(|Z| \\leq 2) \\approx 0.954$, $P(|Z| \\leq 3) \\approx 0.997$."}),e.jsx(S,{label:"Theorem 2.2.1",title:"Probability Integral Transform",statement:"If $X$ is a continuous random variable with CDF $F$, then $U = F(X) \\sim \\text{Uniform}(0,1)$. Conversely, if $U \\sim \\text{Uniform}(0,1)$, then $X = F^{-1}(U)$ has CDF $F$. This allows generation of any continuous distribution from a uniform random variable.",proof:"$P(F(X) \\leq u) = P(X \\leq F^{-1}(u)) = F(F^{-1}(u)) = u$ for $u \\in [0,1]$. This is the CDF of Uniform(0,1). For the converse: $P(F^{-1}(U) \\leq x) = P(U \\leq F(x)) = F(x)$, the CDF of $X$."}),e.jsxs(q,{title:"Memoryless Property of Exponential",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["If ",e.jsx(a.InlineMath,{math:"X \\sim \\text{Exp}(\\lambda)"}),", then for ",e.jsx(a.InlineMath,{math:"s, t > 0"}),":"]}),e.jsx(a.BlockMath,{math:"P(X > s+t \\mid X > s) = \\frac{P(X > s+t)}{P(X > s)} = \\frac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}} = e^{-\\lambda t} = P(X > t)"}),e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"The distribution does not remember how long you've already waited. This uniquely characterizes the exponential among continuous distributions."})]}),e.jsx(F,{title:"PDF Values Are Not Probabilities",children:e.jsxs("p",{children:["The PDF ",e.jsx(a.InlineMath,{math:"f(x)"})," can exceed 1 (e.g., ",e.jsx(a.InlineMath,{math:"\\text{Uniform}(0, 0.5)"})," has"," ",e.jsx(a.InlineMath,{math:"f(x) = 2"})," on ",e.jsx(a.InlineMath,{math:"[0, 0.5]"}),"). Only integrals of the PDF give probabilities. Also, ",e.jsx(a.InlineMath,{math:"P(X = a) = 0"})," for continuous random variables — you cannot compute ",e.jsx(a.InlineMath,{math:"P(X = 1.5)"})," for a Gaussian; you must specify an interval. In practice, when building likelihoods for continuous data, use the PDF (density) not point probabilities."]})}),e.jsx(C,{title:"Continuous Distributions with SciPy",code:`import numpy as np
from scipy import stats

# ── Normal distribution ───────────────────────────────────────────────────
mu, sigma = 2.0, 1.5
X = stats.norm(loc=mu, scale=sigma)

print(f"Normal({mu}, {sigma}²):")
print(f"  E[X] = {X.mean():.4f}, Var(X) = {X.var():.4f}")
print(f"  P(X ≤ 3) = {X.cdf(3):.4f}")
print(f"  P(1 ≤ X ≤ 3) = {X.cdf(3) - X.cdf(1):.4f}")
print(f"  95th percentile = {X.ppf(0.95):.4f}")

# ── Probability integral transform ────────────────────────────────────────
np.random.seed(42)
n = 10000
# Generate Exp(2) using inverse CDF method
U = np.random.uniform(0, 1, n)
lam = 2.0
X_exp = -np.log(1 - U) / lam  # F^{-1}(u) = -log(1-u)/λ
print(f"\\nInverse CDF for Exp(2): mean={X_exp.mean():.4f} (should be {1/lam})")

# ── KS test: does our sample match the distribution? ──────────────────────
stat, p_val = stats.kstest(X_exp, 'expon', args=(0, 1/lam))
print(f"KS test: stat={stat:.4f}, p={p_val:.4f} (large p = good fit)")

# ── 68-95-99.7 rule verification ──────────────────────────────────────────
Z = stats.norm(0, 1)
for k in [1, 2, 3]:
    prob = Z.cdf(k) - Z.cdf(-k)
    print(f"  P(|Z|≤{k}) = {prob:.5f}")`})]})}const Ge=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));function oe(){const[i,$]=M.useState(.6),[r,k]=M.useState(200),p=(()=>{let t=42;return()=>(t=t*1664525+1013904223&4294967295,(t>>>0)/4294967295)})(),j=Array.from({length:r},()=>{const t=p(),d=p(),l=Math.sqrt(-2*Math.log(Math.max(t,1e-10)))*Math.cos(2*Math.PI*d),s=Math.sqrt(-2*Math.log(Math.max(d,1e-10)))*Math.sin(2*Math.PI*t),o=l,_=i*l+Math.sqrt(1-i*i)*s;return{x:o,y:_}}),y=240,v=200,f=35,g=y/2,u=v/2,x=(t,d)=>({sx:g+t*f,sy:u-d*f}),h=Array.from({length:20},(t,d)=>({lo:-3+d*.3,hi:-3+(d+1)*.3,count:0})),n=Array.from({length:20},(t,d)=>({lo:-3+d*.3,hi:-3+(d+1)*.3,count:0}));j.forEach(({x:t,y:d})=>{const l=h.findIndex(o=>t>=o.lo&&t<o.hi),s=n.findIndex(o=>d>=o.lo&&d<o.hi);l>=0&&h[l].count++,s>=0&&n[s].count++});const c=Math.max(...h.map(t=>t.count),1),m=Math.max(...n.map(t=>t.count),1);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Joint Bivariate Normal with Marginals"}),e.jsxs("p",{className:"mb-3 text-sm text-gray-500 dark:text-gray-400",children:["Correlation ",e.jsx(a.InlineMath,{math:"\\rho"})," controls dependence. Marginals are always Normal regardless of ",e.jsx(a.InlineMath,{math:"\\rho"}),"."]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("svg",{width:y,height:v,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[e.jsx("line",{x1:0,y1:u,x2:y,y2:u,stroke:"#e5e7eb",strokeWidth:1}),e.jsx("line",{x1:g,y1:0,x2:g,y2:v,stroke:"#e5e7eb",strokeWidth:1}),j.map(({x:t,y:d},l)=>{const{sx:s,sy:o}=x(t,d);return s<0||s>y||o<0||o>v?null:e.jsx("circle",{cx:s,cy:o,r:2,fill:"#6366f1",opacity:.5},l)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"X marginal"}),e.jsx("svg",{width:80,height:v/2,className:"rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:h.map((t,d)=>{const l=t.count/c*60;return e.jsx("rect",{x:d*4,y:v/2-10-l,width:3,height:l,fill:"#3b82f6",opacity:.7},d)})})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Y marginal"}),e.jsx("svg",{width:80,height:v/2,className:"rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:n.map((t,d)=>{const l=t.count/m*60;return e.jsx("rect",{x:d*4,y:v/2-10-l,width:3,height:l,fill:"#10b981",opacity:.7},d)})})]})]})]}),e.jsxs("div",{className:"mt-4 grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{className:"font-mono",children:"ρ (correlation)"}),e.jsx("span",{children:i.toFixed(2)})]}),e.jsx("input",{type:"range",min:"-0.99",max:"0.99",step:"0.05",value:i,onChange:t=>$(parseFloat(t.target.value)),className:"w-full accent-indigo-500"})]}),e.jsxs("div",{className:"rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm",children:["Cov(X,Y) = ",e.jsx("strong",{children:i.toFixed(2)})," (σ_X=σ_Y=1)"]})]})]})}function le(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(oe,{}),e.jsx(w,{label:"Definition 2.3.1",title:"Joint Distribution",definition:"For random variables $X$ and $Y$, the joint CDF is $F(x,y) = P(X \\leq x, Y \\leq y)$. For jointly continuous $(X,Y)$: joint PDF $f(x,y) \\geq 0$ with $\\iint f(x,y)\\,dx\\,dy = 1$. Marginal PDFs: $f_X(x) = \\int_{-\\infty}^\\infty f(x,y)\\,dy$ and $f_Y(y) = \\int_{-\\infty}^\\infty f(x,y)\\,dx$. $X$ and $Y$ are independent iff $f(x,y) = f_X(x) f_Y(y)$ for all $(x,y)$.",notation:"Conditional PDF: $f_{X|Y}(x|y) = f(x,y)/f_Y(y)$. Conditional expectation: $E[X|Y=y] = \\int x f_{X|Y}(x|y)\\,dx$."}),e.jsx(w,{label:"Definition 2.3.2",title:"Covariance and Correlation",definition:"Covariance: $\\text{Cov}(X,Y) = E[(X-\\mu_X)(Y-\\mu_Y)] = E[XY] - E[X]E[Y]$. Correlation: $\\rho(X,Y) = \\text{Cov}(X,Y) / (\\sigma_X \\sigma_Y) \\in [-1, 1]$. $|\\rho| = 1$ iff $Y = aX + b$ a.s. (perfect linear relationship). If $X \\perp Y$ (independent), then $\\text{Cov}(X,Y) = 0$; the converse is false."}),e.jsx(S,{label:"Theorem 2.3.1",title:"Law of Total Expectation",statement:"$E[X] = E[E[X|Y]]$, where the outer expectation is over $Y$. More generally, for any integrable $g$: $E[g(X)] = E[E[g(X)|Y]]$. Law of total variance: $\\text{Var}(X) = E[\\text{Var}(X|Y)] + \\text{Var}(E[X|Y])$.",proof:"$E[E[X|Y]] = \\int E[X|Y=y] f_Y(y)\\,dy = \\int \\left(\\int x f_{X|Y}(x|y)\\,dx\\right) f_Y(y)\\,dy = \\iint x f(x,y)\\,dx\\,dy = E[X]$, where we used $f(x,y) = f_{X|Y}(x|y) f_Y(y)$."}),e.jsxs(q,{title:"Bivariate Normal: Correlation vs Independence",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["If ",e.jsx(a.InlineMath,{math:"(X,Y) \\sim N(\\mathbf{0}, \\Sigma)"})," with ",e.jsx(a.InlineMath,{math:"\\Sigma = \\begin{bmatrix} 1 & \\rho \\\\ \\rho & 1 \\end{bmatrix}"}),":"]}),e.jsx(a.BlockMath,{math:"f(x,y) = \\frac{1}{2\\pi\\sqrt{1-\\rho^2}} \\exp\\!\\left(-\\frac{x^2 - 2\\rho xy + y^2}{2(1-\\rho^2)}\\right)"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["For bivariate normal only: ",e.jsx(a.InlineMath,{math:"\\rho = 0 \\iff X \\perp Y"}),". Marginals are always"," ",e.jsx(a.InlineMath,{math:"N(0,1)"})," regardless of ",e.jsx(a.InlineMath,{math:"\\rho"}),"."]})]}),e.jsx(F,{title:"Zero Covariance Does Not Imply Independence",children:e.jsxs("p",{children:["Let ",e.jsx(a.InlineMath,{math:"X \\sim N(0,1)"})," and ",e.jsx(a.InlineMath,{math:"Y = X^2"}),". Then"," ",e.jsx(a.InlineMath,{math:"\\text{Cov}(X, Y) = E[X^3] - E[X]E[X^2] = 0 - 0 \\cdot 1 = 0"}),", but clearly",e.jsx(a.InlineMath,{math:"Y"})," is a deterministic function of ",e.jsx(a.InlineMath,{math:"X"})," — they are maximally dependent. Uncorrelatedness only captures linear dependence. Use mutual information or distance correlation to detect nonlinear dependence."]})}),e.jsx(C,{title:"Joint Distributions and Covariance",code:`import numpy as np
from scipy import stats

# ── Bivariate normal ───────────────────────────────────────────────────────
rho = 0.7
Sigma = np.array([[1, rho], [rho, 1]])
mean = np.array([0, 0])

rv = stats.multivariate_normal(mean=mean, cov=Sigma)
print(f"Bivariate normal (ρ={rho}):")
print(f"  pdf at (0,0): {rv.pdf([0,0]):.4f}")

# Sample and verify statistics
np.random.seed(42)
samples = rv.rvs(10000)
X, Y = samples[:, 0], samples[:, 1]
print(f"  Sample correlation: {np.corrcoef(X, Y)[0,1]:.4f} (true: {rho})")
print(f"  Sample Cov(X,Y): {np.cov(X, Y)[0,1]:.4f} (true: {rho})")

# ── Law of total expectation ──────────────────────────────────────────────
# E[X] = E[E[X|Y]] for bivariate normal: E[X|Y=y] = rho*y
# E[E[X|Y]] = E[rho*Y] = rho * E[Y] = 0 = E[X] ✓
cond_means = rho * Y  # E[X|Y=y] = rho*y for standard bivariate normal
print(f"\\nLaw of total expectation:")
print(f"  E[X] = {X.mean():.4f}")
print(f"  E[E[X|Y]] = {cond_means.mean():.4f}")

# ── Zero covariance without independence ──────────────────────────────────
X_sym = np.random.normal(0, 1, 10000)
Y_quad = X_sym ** 2
print(f"\\nX ~ N(0,1), Y = X²:")
print(f"  Cov(X,Y) = {np.cov(X_sym, Y_quad)[0,1]:.4f} (≈ 0)")
print(f"  Corr(X,Y) = {np.corrcoef(X_sym, Y_quad)[0,1]:.4f}")
print(f"  But Y = X² — completely dependent!")`})]})}const Ke=Object.freeze(Object.defineProperty({__proto__:null,default:le},Symbol.toStringTag,{value:"Module"}));function de(){const[i,$]=M.useState(.5),[r,k]=M.useState(20),[p,j]=M.useState([]),[y,v]=M.useState(Array(21).fill(0)),f=()=>{const n=Array.from({length:r},()=>Math.random()<i?1:0),c=n.reduce((m,t)=>m+t,0);j(n),v(m=>{const t=[...m];return c<t.length&&t[c]++,t})},g=()=>{j([]),v(Array(21).fill(0))},u=y.reduce((n,c)=>n+c,0),x=Math.max(...y,1),h=n=>((m,t)=>{if(t<0||t>m)return 0;let d=1;for(let l=0;l<t;l++)d*=(m-l)/(l+1);return d})(r,n)*Math.pow(i,n)*Math.pow(1-i,r-n);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Coin Flip Simulator: Binomial Distribution"}),e.jsxs("div",{className:"mb-3 grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:"p (heads prob)"}),e.jsx("span",{children:i.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.05",max:"0.95",step:"0.05",value:i,onChange:n=>{$(parseFloat(n.target.value)),g()},className:"w-full accent-indigo-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:"n (flips per trial)"}),e.jsx("span",{children:r})]}),e.jsx("input",{type:"range",min:"5",max:"20",step:"1",value:r,onChange:n=>{k(parseInt(n.target.value)),g()},className:"w-full accent-indigo-500"})]})]}),e.jsxs("div",{className:"mb-3 flex gap-3",children:[e.jsxs("button",{onClick:f,className:"rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white",children:["Flip ",r," Coins"]}),e.jsx("button",{onClick:()=>{for(let n=0;n<100;n++){const c=Array.from({length:r},()=>Math.random()<i?1:0).reduce((m,t)=>m+t,0);v(m=>{const t=[...m];return c<t.length&&t[c]++,t})}},className:"rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium",children:"+100 trials"}),e.jsx("button",{onClick:g,className:"rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium",children:"Reset"})]}),p.length>0&&e.jsx("div",{className:"mb-3 flex flex-wrap gap-1",children:p.map((n,c)=>e.jsx("span",{className:`rounded px-1.5 py-0.5 text-xs font-bold ${n?"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300":"bg-gray-100 text-gray-500 dark:bg-gray-800"}`,children:n?"H":"T"},c))}),e.jsxs("svg",{width:340,height:150,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[Array.from({length:r+1},(n,c)=>{const m=10+c*(320/(r+1)),t=Math.max(2,280/(r+2)),d=h(c)*100/x*120,l=u>0?y[c]/x*120:0;return e.jsxs("g",{children:[e.jsx("rect",{x:m,y:130-l,width:t,height:l,fill:"rgba(99,102,241,0.7)"}),e.jsx("rect",{x:m,y:130-d,width:t,height:2,fill:"#ef4444"})]},c)}),e.jsx("line",{x1:5,y1:130,x2:335,y2:130,stroke:"#9ca3af",strokeWidth:1})]}),e.jsxs("p",{className:"mt-2 text-xs text-gray-500 dark:text-gray-400",children:["Blue bars = observed frequency. Red lines = theoretical Binomial(",r,", ",i.toFixed(2),") PMF. Trials: ",u]})]})}function me(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(de,{}),e.jsx(w,{label:"Definition 3.1.1",title:"Bernoulli and Binomial Distributions",definition:"Bernoulli$(p)$: $X \\in \\{0,1\\}$, $P(X=1) = p$, $P(X=0) = 1-p$. $E[X] = p$, $\\text{Var}(X) = p(1-p)$. Models a single binary trial. Binomial$(n,p)$: $X = \\sum_{i=1}^n X_i$ where $X_i \\overset{iid}{\\sim} \\text{Bern}(p)$. PMF: $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$ for $k = 0,1,\\ldots,n$. $E[X] = np$, $\\text{Var}(X) = np(1-p)$.",notation:"The binomial coefficient $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ counts the number of ways to choose $k$ successes from $n$ trials."}),e.jsx(w,{label:"Definition 3.1.2",title:"Normal Approximation to Binomial",definition:"For large $n$, by the Central Limit Theorem: $\\frac{X - np}{\\sqrt{np(1-p)}} \\overset{d}{\\to} N(0,1)$ as $n \\to \\infty$. Continuity correction improves the approximation: $P(X \\leq k) \\approx \\Phi\\!\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right)$. Rule of thumb: normal approximation is adequate when $np \\geq 5$ and $n(1-p) \\geq 5$."}),e.jsx(S,{label:"Theorem 3.1.1",title:"Binomial Coefficient and Pascal's Rule",statement:"For $0 \\leq k \\leq n$: $\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$ (Pascal's rule). Binomial theorem: $(x+y)^n = \\sum_{k=0}^n \\binom{n}{k} x^k y^{n-k}$. Consequence: $\\sum_{k=0}^n \\binom{n}{k} p^k (1-p)^{n-k} = (p + (1-p))^n = 1$ (PMF sums to 1).",proof:"Pascal's rule: $\\binom{n}{k} + \\binom{n}{k+1} = \\frac{n!}{k!(n-k)!} + \\frac{n!}{(k+1)!(n-k-1)!}$ $= \\frac{n!(k+1) + n!(n-k)}{(k+1)!(n-k)!} = \\frac{n!(n+1)}{(k+1)!(n-k)!} = \\binom{n+1}{k+1}$. Binomial theorem: expand $(x+y)^n$ by picking $k$ copies of $x$ from $n$ factors."}),e.jsxs(q,{title:"Quality Control: Acceptance Sampling",children:[e.jsx("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:"A batch has 5% defective items. Sample 20. What is the probability of 2 or fewer defects?"}),e.jsx(a.BlockMath,{math:"P(X \\leq 2) = \\sum_{k=0}^{2} \\binom{20}{k} (0.05)^k (0.95)^{20-k} \\approx 0.358 + 0.377 + 0.189 = 0.925"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["With ",e.jsx(a.InlineMath,{math:"n=20, p=0.05"}),": there's a 92.5% chance of accepting the batch if the threshold is 2 defects."]})]}),e.jsx(F,{title:"Binomial Requires Independent Trials",children:e.jsxs("p",{children:["The binomial model requires that each trial is ",e.jsx("em",{children:"independent"})," and has the same probability",e.jsx(a.InlineMath,{math:"p"}),". If sampling without replacement from a finite population, use the hypergeometric distribution instead. If ",e.jsx(a.InlineMath,{math:"p"})," varies across trials (e.g., a sequence of biased coins with changing bias), the Poisson-binomial distribution applies. In neural networks, Bernoulli dropout is approximately binomial only when neurons are dropped independently."]})}),e.jsx(C,{title:"Binomial Distribution Analysis",code:`import numpy as np
from scipy import stats

# ── Binomial PMF and CDF ──────────────────────────────────────────────────
n, p = 20, 0.3
X = stats.binom(n=n, p=p)

print(f"Binomial(n={n}, p={p}):")
print(f"  E[X] = {X.mean():.4f}, Var(X) = {X.var():.4f}")
print(f"  P(X=6) = {X.pmf(6):.6f}")
print(f"  P(X≤8) = {X.cdf(8):.6f}")
print(f"  P(4≤X≤8) = {X.cdf(8) - X.cdf(3):.6f}")

# ── Normal approximation with continuity correction ───────────────────────
mu, sigma = n*p, np.sqrt(n*p*(1-p))
Z = stats.norm(mu, sigma)
exact = X.cdf(8)
approx_no_cc = Z.cdf(8)
approx_cc = Z.cdf(8.5)  # continuity correction
print(f"\\nP(X≤8): exact={exact:.6f}, no CC={approx_no_cc:.6f}, with CC={approx_cc:.6f}")

# ── Monte Carlo simulation ────────────────────────────────────────────────
np.random.seed(42)
trials = 100000
samples = np.random.binomial(n=n, p=p, size=trials)
print(f"\\nMonte Carlo (n={trials}):")
print(f"  Sample mean: {samples.mean():.4f} (true: {n*p})")
print(f"  Sample var:  {samples.var():.4f} (true: {n*p*(1-p):.4f})")
print(f"  P(X≤8) est:  {(samples <= 8).mean():.4f}")

# ── Binomial coefficient via scipy ────────────────────────────────────────
from scipy.special import comb
for k in range(6):
    print(f"  C({n},{k}) = {int(comb(n,k,exact=True))}")`})]})}const We=Object.freeze(Object.defineProperty({__proto__:null,default:me},Symbol.toStringTag,{value:"Module"})),L={gaussian:{label:"Gaussian (σ²=1)",eta:i=>i,pdf:(i,$)=>Math.exp(-.5*(i-$)**2)/Math.sqrt(2*Math.PI),paramLabel:"μ (mean)",etaLabel:"η = μ",range:[-5,5],paramRange:[-3,3]},poisson:{label:"Poisson",eta:i=>Math.log(i),pdf:(i,$)=>{if(!Number.isInteger(Math.round(i))||i<0)return 0;const r=Math.round(i);let k=r*Math.log($)-$;for(let p=1;p<=r;p++)k-=Math.log(p);return Math.exp(k)},paramLabel:"λ (rate)",etaLabel:"η = log λ",range:[0,15],paramRange:[.5,8],discrete:!0}};function ce(){const[i,$]=M.useState("gaussian"),[r,k]=M.useState(0),p=L[i],j=p.eta(i==="gaussian"?r:Math.max(.5,r)),y=i==="gaussian"?r:Math.max(.5,r),v=340,f=160,[g,u]=p.range,x=p.discrete?Math.floor(u-g)+1:200,h=p.discrete?Array.from({length:x},(m,t)=>({x:g+t,y:p.pdf(g+t,y)})):Array.from({length:x},(m,t)=>{const d=g+t/(x-1)*(u-g);return{x:d,y:p.pdf(d,y)}}),n=Math.max(...h.map(m=>m.y),.01),c=(m,t)=>({sx:(m-g)/(u-g)*(v-20)+10,sy:f-15-t/n*(f-25)});return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Exponential Family: Natural Parameter Slider"}),e.jsx("div",{className:"mb-3 flex gap-3",children:Object.entries(L).map(([m,t])=>e.jsx("button",{onClick:()=>{$(m),k(m==="gaussian"?0:2)},className:`rounded-lg px-3 py-1 text-sm font-medium ${i===m?"bg-indigo-500 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`,children:t.label},m))}),e.jsxs("svg",{width:v,height:f,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[e.jsx("line",{x1:10,y1:f-15,x2:v-10,y2:f-15,stroke:"#9ca3af",strokeWidth:1}),p.discrete?h.map(({x:m,y:t})=>{const{sx:d,sy:l}=c(m,t);return e.jsx("rect",{x:d-4,y:l,width:8,height:f-15-l,fill:"#6366f1",opacity:.8,rx:1},m)}):(()=>{const m=h.map(({x:t,y:d},l)=>{const{sx:s,sy:o}=c(t,d);return`${l===0?"M":"L"}${s.toFixed(1)},${o.toFixed(1)}`}).join(" ");return e.jsx("path",{d:m,fill:"rgba(99,102,241,0.2)",stroke:"#6366f1",strokeWidth:2})})()]}),e.jsxs("div",{className:"mt-4 grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:p.paramLabel}),e.jsx("span",{children:y.toFixed(2)})]}),e.jsx("input",{type:"range",min:p.paramRange[0],max:p.paramRange[1],step:"0.1",value:r,onChange:m=>k(parseFloat(m.target.value)),className:"w-full accent-indigo-500"})]}),e.jsxs("div",{className:"rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm",children:[e.jsx("span",{className:"font-semibold",children:p.etaLabel})," = ",e.jsx("span",{className:"font-mono text-indigo-600 dark:text-indigo-400",children:j.toFixed(3)})]})]})]})}function pe(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(ce,{}),e.jsx(w,{label:"Definition 3.3.1",title:"Exponential Family",definition:"A parametric family of distributions is an exponential family if the density can be written as $p(x; \\eta) = h(x) \\exp(\\eta^T T(x) - A(\\eta))$ where $\\eta \\in \\mathbb{R}^k$ is the natural (canonical) parameter, $T(x)$ is the sufficient statistic, $h(x)$ is the base measure, and $A(\\eta) = \\log \\int h(x) e^{\\eta^T T(x)}\\,dx$ is the log-partition function (ensures normalization).",notation:"Members: Gaussian, Bernoulli, Binomial, Poisson, Gamma, Beta, Dirichlet, Multinomial. The mean parameter: $\\mu = E_{\\eta}[T(X)] = \\nabla A(\\eta)$. The covariance of $T(X)$: $\\text{Cov}[T(X)] = \\nabla^2 A(\\eta)$ (Hessian of $A$)."}),e.jsx(w,{label:"Definition 3.3.2",title:"Sufficient Statistics",definition:"A statistic $T(X_1,\\ldots,X_n)$ is sufficient for $\\eta$ if $p(X|T, \\eta) = p(X|T)$ — given $T$, the data $X$ carries no additional information about $\\eta$. By the factorization theorem: $T$ is sufficient iff $p(x;\\eta) = g(T(x), \\eta) h(x)$. For i.i.d. exponential family: $T(X_1,\\ldots,X_n) = \\sum_i T(X_i)$ is sufficient."}),e.jsx(S,{label:"Theorem 3.3.1",title:"MLE for Exponential Family",statement:"For i.i.d. data $X_1, \\ldots, X_n$ from an exponential family with natural parameter $\\eta$, the MLE satisfies the moment matching condition: $\\frac{1}{n}\\sum_{i=1}^n T(X_i) = E_\\eta[T(X)] = \\nabla A(\\eta)$. The MLE always exists and is unique (when $A$ is strictly convex), and equals the unique $\\eta^*$ such that the expected sufficient statistic equals the empirical sufficient statistic.",proof:"Log-likelihood: $\\ell(\\eta) = \\eta^T \\bar{T} - A(\\eta)$ where $\\bar{T} = \\frac{1}{n}\\sum_i T(X_i)$. Setting gradient to zero: $\\nabla \\ell = \\bar{T} - \\nabla A(\\eta) = 0$. Since $\\nabla^2 A = \\text{Cov}[T(X)] \\succeq 0$ (and $> 0$ for minimal representations), $A$ is convex, so $\\ell$ is concave."}),e.jsxs(q,{title:"Bernoulli as Exponential Family",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:[e.jsx(a.InlineMath,{math:"P(X=x; p) = p^x(1-p)^{1-x}"})," can be written as:"]}),e.jsx(a.BlockMath,{math:"p(x;\\eta) = \\exp\\!\\left(\\eta x - \\log(1+e^\\eta)\\right), \\quad \\eta = \\log\\frac{p}{1-p}"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["Natural parameter ",e.jsx(a.InlineMath,{math:"\\eta"})," is the log-odds (logit). Sufficient statistic"," ",e.jsx(a.InlineMath,{math:"T(x) = x"}),". Log-partition ",e.jsx(a.InlineMath,{math:"A(\\eta) = \\log(1+e^\\eta)"}),". MLE gives ",e.jsx(a.InlineMath,{math:"\\hat{p} = \\bar{x}"})," (sample mean) — moment matching."]})]}),e.jsx(F,{title:"Natural vs Mean Parameters",children:e.jsxs("p",{children:["The exponential family can be parameterized by either the natural parameter"," ",e.jsx(a.InlineMath,{math:"\\eta"})," or the mean parameter ",e.jsx(a.InlineMath,{math:"\\mu = \\nabla A(\\eta)"}),". Gradient descent in ",e.jsx(a.InlineMath,{math:"\\eta"}),"-space uses the Fisher information metric"," ",e.jsx(a.InlineMath,{math:"F = \\nabla^2 A(\\eta)"}),". Natural gradient descent (Amari, 1998) accounts for this curved geometry and often converges faster than ordinary gradient descent. Mixing the two parameterizations without care leads to incorrect updates."]})}),e.jsx(C,{title:"Exponential Family Log-Partition and MLE",code:`import numpy as np
from scipy import stats, optimize

# ── Gaussian exponential family ───────────────────────────────────────────
# p(x; η₁, η₂) = h(x) exp(η₁x + η₂x² - A(η))
# η₁ = μ/σ², η₂ = -1/(2σ²), A(η) = -η₁²/(4η₂) + 0.5*log(-π/η₂)

def gaussian_A(eta1, eta2):
    """Log-partition for Gaussian in natural params."""
    return -eta1**2 / (4*eta2) + 0.5 * np.log(-np.pi / eta2)

# Convert mean/var params to natural params
mu, sigma2 = 2.0, 1.5
eta1 = mu / sigma2
eta2 = -1 / (2 * sigma2)
print(f"Gaussian({mu}, {sigma2}):")
print(f"  Natural params: η₁={eta1:.4f}, η₂={eta2:.4f}")
print(f"  Log-partition A(η): {gaussian_A(eta1, eta2):.4f}")

# Verify MLE: moment matching
np.random.seed(42)
data = np.random.normal(mu, np.sqrt(sigma2), 1000)
mu_hat = data.mean()
sigma2_hat = data.var()
print(f"  MLE: μ̂={mu_hat:.4f} (true {mu}), σ²̂={sigma2_hat:.4f} (true {sigma2})")

# ── Poisson exponential family ────────────────────────────────────────────
# p(k; η) = exp(ηk - e^η) / k!, T(k)=k, A(η)=e^η, η=log(λ)
lam = 3.5
eta_pois = np.log(lam)
print(f"\\nPoisson(λ={lam}): η=log(λ)={eta_pois:.4f}")
data_pois = np.random.poisson(lam, 1000)
lam_mle = data_pois.mean()  # moment matching: E[T(X)] = λ = Σx_i/n
print(f"  MLE λ̂ = {lam_mle:.4f} (true {lam})")

# ── Fisher information as Hessian of A ───────────────────────────────────
# For Gaussian: I(η₂) = d²A/dη₂² at eta2
h = 1e-5
I_eta2 = (gaussian_A(eta1, eta2+h) - 2*gaussian_A(eta1, eta2) + gaussian_A(eta1, eta2-h)) / h**2
print(f"\\nFisher info (Hessian of A) wrt η₂: {I_eta2:.4f}")`})]})}const Oe=Object.freeze(Object.defineProperty({__proto__:null,default:pe},Symbol.toStringTag,{value:"Module"}));function he(){const[i,$]=M.useState("1 2 3 4 5 6 7 8 9 10"),r=i.split(/[\s,]+/).map(Number).filter(s=>!isNaN(s)),k=r.length,p=k>0?r.reduce((s,o)=>s+o,0)/k:0,j=k>0?r.reduce((s,o)=>s+(o-p)**2,0)/k:0,y=k>0?r.reduce((s,o)=>s+(o-p)**3,0)/k:0,v=k>0?r.reduce((s,o)=>s+(o-p)**4,0)/k:0,f=Math.sqrt(j),g=f>0?y/f**3:0,u=j>0?v/j**2-3:0,x=340,h=120,n=Math.min(...r),m=Math.max(...r)-n||1,t=Math.min(10,Math.max(3,Math.ceil(Math.sqrt(k)))),d=Array.from({length:t},(s,o)=>{const _=n+o/t*m,X=n+(o+1)/t*m+.001;return{lo:_,hi:X,count:r.filter(b=>b>=_&&b<X).length}}),l=Math.max(...d.map(s=>s.count),1);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Sample Moment Calculator"}),e.jsx("p",{className:"mb-3 text-sm text-gray-500 dark:text-gray-400",children:"Enter numbers separated by spaces:"}),e.jsx("input",{type:"text",value:i,onChange:s=>$(s.target.value),className:"w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-mono mb-3"}),e.jsxs("svg",{width:x,height:h,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3",children:[d.map(({lo:s,hi:o,count:_},X)=>{const b=(x-20)/t-2,P=10+X*((x-20)/t),N=_/l*(h-20);return e.jsx("rect",{x:P,y:h-15-N,width:b,height:N,fill:"#6366f1",opacity:.7,rx:1},X)}),k>0&&(()=>{const s=10+(p-n)/m*(x-20);return e.jsx("line",{x1:s,y1:0,x2:s,y2:h-15,stroke:"#ef4444",strokeWidth:2,strokeDasharray:"4,3"})})(),e.jsx("line",{x1:10,y1:h-15,x2:x-10,y2:h-15,stroke:"#9ca3af",strokeWidth:1})]}),e.jsx("div",{className:"grid grid-cols-2 gap-3 text-sm",children:[["n",k],["Mean (μ)",p.toFixed(4)],["Variance (σ²)",j.toFixed(4)],["Std dev (σ)",f.toFixed(4)],["Skewness",g.toFixed(4)],["Excess Kurtosis",u.toFixed(4)]].map(([s,o])=>e.jsxs("div",{className:"rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2",children:[e.jsx("p",{className:"text-xs text-indigo-600 dark:text-indigo-400",children:s}),e.jsx("p",{className:"font-mono font-bold",children:o})]},s))})]})}function xe(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(he,{}),e.jsx(w,{label:"Definition 4.1.1",title:"Moments and Central Moments",definition:"The $k$-th raw moment of $X$ is $\\mu_k' = E[X^k]$ (when finite). The $k$-th central moment is $\\mu_k = E[(X - \\mu)^k]$ where $\\mu = E[X]$. Specifically: $\\mu_1 = 0$, $\\mu_2 = \\text{Var}(X)$ (variance), $\\mu_3/\\sigma^3$ is skewness (asymmetry), $\\mu_4/\\sigma^4 - 3$ is excess kurtosis (tail heaviness, 0 for Gaussian). Relationship: $\\mu_2 = \\mu_2' - (\\mu_1')^2 = E[X^2] - (E[X])^2$.",notation:"Positive skewness: long right tail (lognormal, Poisson). Negative skewness: long left tail. Excess kurtosis $> 0$: heavy tails (Student-t, Laplace). $< 0$: light tails (uniform)."}),e.jsx(w,{label:"Definition 4.1.2",title:"Cumulants",definition:"Cumulants $\\kappa_n$ are defined via the cumulant generating function $K(t) = \\log E[e^{tX}]$ by $K(t) = \\sum_{n=1}^\\infty \\kappa_n \\frac{t^n}{n!}$. First cumulants: $\\kappa_1 = E[X]$ (mean), $\\kappa_2 = \\text{Var}(X)$, $\\kappa_3 = \\mu_3$ (third central moment), $\\kappa_4 = \\mu_4 - 3\\sigma^4$ (excess kurtosis times $\\sigma^4$). Key property: for independent $X, Y$: $\\kappa_n(X+Y) = \\kappa_n(X) + \\kappa_n(Y)$ (cumulants add)."}),e.jsx(S,{label:"Theorem 4.1.1",title:"Moments and Distributions",statement:"If all moments $E[|X|^k] < \\infty$ for all $k \\geq 1$, and the moment sequence $(\\mu_k')$ determines a unique distribution (Carleman's condition: $\\sum_k (\\mu_{2k}')^{-1/(2k)} = \\infty$), then the distribution of $X$ is uniquely determined by its moments. The Gaussian is the unique distribution with $\\kappa_n = 0$ for all $n \\geq 3$.",proof:"Uniqueness: assume $F$ and $G$ have the same moments. Then all polynomials $\\int p(x)\\,dF = \\int p(x)\\,dG$. By Weierstrass approximation and Carleman's condition, this extends to all continuous bounded functions, so $F = G$ by the portmanteau theorem."}),e.jsxs(q,{title:"Skewness and Kurtosis of Common Distributions",children:[e.jsx("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:"A summary of moment properties:"}),e.jsx(a.BlockMath,{math:"\\text{Normal}(0,1): \\text{skew}=0, \\text{kurt}=0"}),e.jsx(a.BlockMath,{math:"\\text{Exp}(\\lambda): \\text{skew}=2, \\text{kurt}=6"}),e.jsx(a.BlockMath,{math:"\\text{Student-}t(\\nu): \\text{kurt}=6/(\\nu-4) \\text{ for } \\nu > 4"}),e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Heavy-tailed distributions (high kurtosis) model financial returns and natural language word frequencies better than the Gaussian."})]}),e.jsx(F,{title:"Sample Moments Are Biased Estimators",children:e.jsxs("p",{children:["The sample mean ",e.jsx(a.InlineMath,{math:"\\bar{X}"})," is unbiased for ",e.jsx(a.InlineMath,{math:"\\mu"}),", but the sample variance ",e.jsx(a.InlineMath,{math:"s^2 = \\frac{1}{n}\\sum(X_i - \\bar{X})^2"})," is biased — use ",e.jsx(a.InlineMath,{math:"\\hat{\\sigma}^2 = \\frac{1}{n-1}\\sum(X_i - \\bar{X})^2"})," (Bessel's correction). Sample skewness and kurtosis are even more biased for small ",e.jsx(a.InlineMath,{math:"n"})," and require bias correction. Never report raw sample kurtosis without adjusting for sample size bias (especially for ",e.jsx(a.InlineMath,{math:"n < 50"}),")."]})}),e.jsx(C,{title:"Computing Moments and Cumulants",code:`import numpy as np
from scipy import stats

# ── Sample moments ─────────────────────────────────────────────────────────
np.random.seed(42)
data = np.random.exponential(scale=2.0, size=10000)

mean = np.mean(data)
var = np.var(data, ddof=0)   # biased
var_u = np.var(data, ddof=1)  # unbiased
m3 = np.mean((data - mean)**3)
m4 = np.mean((data - mean)**4)
skew = m3 / var**1.5
kurt_excess = m4 / var**2 - 3

print(f"Exp(0.5) — true values: mean=2, var=4, skew=2, kurt=6")
print(f"Sample (n=10000):")
print(f"  mean={mean:.4f}, var(biased)={var:.4f}, var(unbiased)={var_u:.4f}")
print(f"  skewness={skew:.4f}, excess kurtosis={kurt_excess:.4f}")

# scipy's stats.describe
desc = stats.describe(data)
print(f"\\nscipy describe:")
print(f"  skewness={desc.skewness:.4f}, kurtosis={desc.kurtosis:.4f}")

# ── Cumulants ─────────────────────────────────────────────────────────────
# For Exp(λ): κ_n = (n-1)! / λ^n
lam = 0.5
print(f"\\nCumulants of Exp(λ=0.5):")
for n in range(1, 5):
    kappa_n = np.math.factorial(n - 1) / lam**n
    print(f"  κ_{n} = {kappa_n:.4f}")

# Independence: cumulants add for independent RVs
X = np.random.exponential(2.0, 10000)
Y = np.random.exponential(3.0, 10000)
S = X + Y  # Sum of independents
print(f"\\nCumulant additivity: X~Exp(0.5), Y~Exp(1/3), S=X+Y")
print(f"  E[X]+E[Y] = {np.mean(X):.2f}+{np.mean(Y):.2f} = {np.mean(X)+np.mean(Y):.2f} ≈ E[S]={np.mean(S):.2f}")
print(f"  Var(X)+Var(Y) = {np.var(X):.2f}+{np.var(Y):.2f} = {np.var(X)+np.var(Y):.2f} ≈ Var(S)={np.var(S):.2f}")`})]})}const Ve=Object.freeze(Object.defineProperty({__proto__:null,default:xe},Symbol.toStringTag,{value:"Module"}));function fe(){const[i,$]=M.useState(0),[r,k]=M.useState("normal"),p={normal:b=>Math.exp(b*b/2),exponential:b=>b<1?1/(1-b):null,bernoulli:b=>.5+.5*Math.exp(b)},j={normal:b=>b*Math.exp(b*b/2),exponential:b=>b<.99?1/(1-b)**2:null,bernoulli:b=>.5*Math.exp(b)},y={normal:"N(0,1)",exponential:"Exp(1)",bernoulli:"Bern(0.5)"},v={normal:[-2,2],exponential:[-2,.9],bernoulli:[-2,2]},[f,g]=v[r],u=340,x=180,h=200,n=Array.from({length:h},(b,P)=>{const N=f+P/(h-1)*(g-f),A=p[r](N);return A!==null&&isFinite(A)&&A<20?{t:N,m:A}:null}).filter(Boolean),c=Math.max(...n.map(b=>b.m),1),m=(b,P)=>({sx:(b-f)/(g-f)*(u-20)+10,sy:x-20-P/(c*1.1)*(x-30)}),t=n.map(({t:b,m:P},N)=>{const{sx:A,sy:E}=m(b,P);return`${N===0?"M":"L"}${A.toFixed(1)},${E.toFixed(1)}`}).join(" "),d=p[r](i),l=j[r](i),s=d!==null&&l!==null&&isFinite(d)&&isFinite(l),o=s?(()=>{const b=f,P=g,N=d+l*(b-i),A=d+l*(P-i),E=m(b,N),B=m(P,A);return`M${E.sx.toFixed(1)},${Math.max(0,Math.min(x,E.sy)).toFixed(1)} L${B.sx.toFixed(1)},${Math.max(0,Math.min(x,B.sy)).toFixed(1)}`})():"",{sx:_,sy:X}=s?m(i,d):{sx:0,sy:0};return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"MGF Plot: Tangent at t₀ shows E[X]"}),e.jsx("div",{className:"mb-3 flex gap-2",children:Object.entries(y).map(([b,P])=>e.jsx("button",{onClick:()=>{k(b),$(0)},className:`rounded-lg px-3 py-1 text-xs font-medium ${r===b?"bg-indigo-500 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`,children:P},b))}),e.jsxs("svg",{width:u,height:x,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[e.jsx("line",{x1:10,y1:x-20,x2:u-10,y2:x-20,stroke:"#9ca3af",strokeWidth:1}),e.jsx("path",{d:t,fill:"none",stroke:"#6366f1",strokeWidth:2.5}),s&&o&&e.jsx("path",{d:o,fill:"none",stroke:"#f97316",strokeWidth:1.5,strokeDasharray:"5,3"}),s&&e.jsx("circle",{cx:_,cy:X,r:5,fill:"#ef4444",stroke:"white",strokeWidth:1.5})]}),e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:"t₀"}),e.jsx("span",{children:i.toFixed(2)})]}),e.jsx("input",{type:"range",min:f,max:g,step:"0.05",value:i,onChange:b=>$(parseFloat(b.target.value)),className:"w-full accent-indigo-500"})]}),s&&e.jsxs("div",{className:"mt-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 px-3 py-2 text-sm",children:["M(t₀)=",d?.toFixed(4),", M'(t₀)=",e.jsx("strong",{children:l?.toFixed(4)})," ",i===0?e.jsx(e.Fragment,{children:"(= E[X] at t=0)"}):e.jsx(e.Fragment,{children:"(slope of tangent)"})]})]})}function ge(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(fe,{}),e.jsx(w,{label:"Definition 4.2.1",title:"Moment Generating Function",definition:"The moment generating function (MGF) of $X$ is $M_X(t) = E[e^{tX}]$, defined for all $t$ in some neighborhood of 0. If the MGF exists, it generates moments: $E[X^k] = M_X^{(k)}(0) = \\left.\\frac{d^k}{dt^k} M_X(t)\\right|_{t=0}$. This follows from $e^{tX} = \\sum_{k=0}^\\infty (tX)^k/k!$ and term-by-term differentiation (justified when MGF is finite near 0).",notation:"Key MGFs: $N(\\mu,\\sigma^2)$: $M(t) = e^{\\mu t + \\sigma^2 t^2/2}$. Exp($\\lambda$): $M(t) = \\lambda/(\\lambda-t)$ for $t < \\lambda$. Poisson($\\lambda$): $M(t) = e^{\\lambda(e^t-1)}$. Binomial$(n,p)$: $M(t) = (pe^t + 1-p)^n$."}),e.jsx(w,{label:"Definition 4.2.2",title:"Characteristic Function",definition:"The characteristic function (CF) is $\\varphi_X(t) = E[e^{itX}]$ (always exists, $|\\varphi_X(t)| \\leq 1$). Unlike the MGF, the CF exists for all distributions. Moments: $E[X^k] = i^{-k} \\varphi_X^{(k)}(0)$ (when moments exist). The CF uniquely determines the distribution (inversion theorem): $f_X(x) = \\frac{1}{2\\pi} \\int_{-\\infty}^\\infty e^{-itx} \\varphi_X(t)\\,dt$ (when $f_X$ is continuous)."}),e.jsx(S,{label:"Theorem 4.2.1",title:"Uniqueness and Continuity Theorems",statement:"Uniqueness: if $M_X(t) = M_Y(t)$ in some open interval containing 0, then $X \\overset{d}{=} Y$. Lévy's continuity theorem: $X_n \\overset{d}{\\to} X$ iff $\\varphi_{X_n}(t) \\to \\varphi_X(t)$ for all $t$. MGF uniqueness: if $M_X$ exists on $(-h, h)$ for some $h > 0$, then it uniquely determines the distribution.",proof:"MGF uniqueness: the MGF determines all moments (by differentiation). If Carleman's condition holds (satisfied when MGF exists in an interval), the moment sequence uniquely determines the distribution.",corollaries:["Sum of independent normals is normal: M_{X+Y}(t) = M_X(t) M_Y(t) = e^{(μ₁+μ₂)t+(σ₁²+σ₂²)t²/2}.","CLT proof via characteristic functions: show φ_{S_n}(t) → e^{-t²/2} pointwise."]}),e.jsxs(q,{title:"Deriving Moments of Normal from MGF",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["For ",e.jsx(a.InlineMath,{math:"X \\sim N(0,1)"}),", ",e.jsx(a.InlineMath,{math:"M(t) = e^{t^2/2}"}),":"]}),e.jsx(a.BlockMath,{math:"M'(t) = te^{t^2/2} \\implies E[X] = M'(0) = 0"}),e.jsx(a.BlockMath,{math:"M''(t) = (1+t^2)e^{t^2/2} \\implies E[X^2] = M''(0) = 1 \\implies \\text{Var}(X)=1"})]}),e.jsx(F,{title:"MGF May Not Exist for Heavy-Tailed Distributions",children:e.jsxs("p",{children:["The Cauchy distribution has no moments — not even the mean — and its MGF is infinite for all"," ",e.jsx(a.InlineMath,{math:"t \\neq 0"}),". The lognormal distribution has all moments finite, but its MGF is infinite for all ",e.jsx(a.InlineMath,{math:"t > 0"})," (despite having a well-defined distribution). For such distributions, use the characteristic function instead. In ML, the MGF is used in deriving concentration inequalities (Chernoff bounds), which require the MGF to be bounded — valid for bounded or sub-Gaussian random variables."]})}),e.jsx(C,{title:"MGF and Characteristic Functions",code:`import numpy as np
from scipy import stats

# ── MGF derivatives to get moments ───────────────────────────────────────
def mgf_normal(t, mu=0, sigma=1):
    """N(mu, sigma²) MGF."""
    return np.exp(mu*t + 0.5*sigma**2*t**2)

def numerical_derivative(f, t, h=1e-5, order=1):
    """Numerical derivative via finite differences."""
    if order == 1:
        return (f(t+h) - f(t-h)) / (2*h)
    elif order == 2:
        return (f(t+h) - 2*f(t) + f(t-h)) / h**2
    elif order == 3:
        return (f(t+2*h) - 2*f(t+h) + 2*f(t-h) - f(t-2*h)) / (2*h**3)
    elif order == 4:
        return (f(t+2*h) - 4*f(t+h) + 6*f(t) - 4*f(t-h) + f(t-2*h)) / h**4

mu, sigma = 2.0, 1.5
M = lambda t: mgf_normal(t, mu, sigma)

print(f"N({mu}, {sigma}²) — MGF-derived moments:")
print(f"  E[X]   = M'(0) = {numerical_derivative(M, 0, order=1):.4f} (true: {mu})")
print(f"  E[X²]  = M''(0) = {numerical_derivative(M, 0, order=2):.4f} (true: {mu**2+sigma**2:.4f})")
print(f"  E[X³]  = M'''(0) = {numerical_derivative(M, 0, order=3):.4f}")

# ── Characteristic function ───────────────────────────────────────────────
# For N(0,1): φ(t) = e^{-t²/2}
phi_normal = lambda t: np.exp(-0.5*t**2 + 0j)

# Characteristic function of sum of normals
phi_sum = lambda t: phi_normal(t) * phi_normal(t)  # sum of two N(0,1)
# Should equal φ of N(0,2): e^{-t²}
phi_n02 = lambda t: np.exp(-t**2)
t_test = 1.5
print(f"\\nCharacteristic function (sum of two N(0,1)):")
print(f"  φ_X₁+X₂(1.5) = {phi_sum(t_test):.6f}")
print(f"  φ_N(0,2)(1.5) = {phi_n02(t_test):.6f}")

# ── Chernoff bound: P(X >= t) <= e^{-st} M_X(s) for best s ─────────────
# For X ~ N(0,1), P(X >= 2) <= e^{-2s} * e^{s²/2} minimized at s=2
s_star = 2.0
chernoff_bound = np.exp(-s_star**2 + s_star**2/2)
actual_prob = 1 - stats.norm.cdf(2.0)
print(f"\\nChernoff bound P(N(0,1)>=2):")
print(f"  Bound: {chernoff_bound:.6f}")
print(f"  Actual: {actual_prob:.6f}")`})]})}const Re=Object.freeze(Object.defineProperty({__proto__:null,default:ge},Symbol.toStringTag,{value:"Module"}));function ue(){const[i,$]=M.useState([]),[r,k]=M.useState("normal"),p={normal:0,exponential:1,bernoulli:.5}[r],j=(()=>{let l=Date.now()&65535;return()=>(l=l*1664525+1013904223&4294967295,(l>>>0)/4294967295)})(),y=l=>Array.from({length:l},()=>{const s=j();if(r==="normal"){const o=j();return Math.sqrt(-2*Math.log(Math.max(s,1e-10)))*Math.cos(2*Math.PI*o)}return r==="exponential"?-Math.log(Math.max(s,1e-10)):s<.5?0:1}),v=l=>{const s=y(l);$(o=>[...o,...s])},f=()=>$([]),g=i.reduce((l,s,o)=>(l.push((l.length>0?l[l.length-1]*o+s:s)/(o+1)),l),[]),u=340,x=180,h=i.length,n=p-2,c=p+2,m=(l,s)=>({sx:h>1?l/(h-1)*u:u/2,sy:x-15-(Math.max(n,Math.min(c,s))-n)/(c-n)*(x-25)}),t=g.map(({},l)=>{const{sx:s,sy:o}=m(l,g[l]);return`${l===0?"M":"L"}${s.toFixed(1)},${o.toFixed(1)}`}).join(" "),d=m(0,p).sy;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Law of Large Numbers: Running Average Convergence"}),e.jsx("div",{className:"mb-3 flex flex-wrap gap-2",children:[["normal","N(0,1)"],["exponential","Exp(1)"],["bernoulli","Bern(0.5)"]].map(([l,s])=>e.jsx("button",{onClick:()=>{k(l),f()},className:`rounded-lg px-3 py-1 text-sm font-medium ${r===l?"bg-indigo-500 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`,children:s},l))}),e.jsxs("svg",{width:u,height:x,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3",children:[e.jsx("line",{x1:0,y1:d,x2:u,y2:d,stroke:"#ef4444",strokeWidth:1.5,strokeDasharray:"6,4"}),h>0&&e.jsx("path",{d:t,fill:"none",stroke:"#6366f1",strokeWidth:2}),e.jsxs("text",{x:u-5,y:d-4,fontSize:10,fill:"#ef4444",textAnchor:"end",children:["μ=",p]}),h>0&&e.jsxs("text",{x:5,y:15,fontSize:10,fill:"#6366f1",children:["X̄_n = ",g[g.length-1]?.toFixed(4)]})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap",children:[[10,100,1e3].map(l=>e.jsxs("button",{onClick:()=>v(l),className:"rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white",children:["+",l]},l)),e.jsx("button",{onClick:f,className:"rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm",children:"Reset"}),e.jsxs("span",{className:"self-center text-xs text-gray-500",children:["n = ",h]})]})]})}function ye(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(ue,{}),e.jsx(w,{label:"Definition 5.1.1",title:"Weak Law of Large Numbers",definition:"Let $X_1, X_2, \\ldots$ be i.i.d. with $E[|X_1|] < \\infty$ and $\\mu = E[X_1]$. The sample mean $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i$ converges in probability to $\\mu$: for any $\\varepsilon > 0$, $P(|\\bar{X}_n - \\mu| > \\varepsilon) \\to 0$ as $n \\to \\infty$. Notation: $\\bar{X}_n \\xrightarrow{P} \\mu$.",notation:"Convergence in probability ($\\xrightarrow{P}$) is weaker than almost sure convergence ($\\xrightarrow{a.s.}$). The Strong LLN states $\\bar{X}_n \\xrightarrow{a.s.} \\mu$: the average equals $\\mu$ eventually with probability 1."}),e.jsx(w,{label:"Definition 5.1.2",title:"Chebyshev's Inequality",definition:"For any random variable $X$ with finite variance $\\sigma^2$: $P(|X - \\mu| \\geq k) \\leq \\sigma^2 / k^2$ for any $k > 0$. Applied to $\\bar{X}_n$: $\\text{Var}(\\bar{X}_n) = \\sigma^2/n$, so $P(|\\bar{X}_n - \\mu| \\geq \\varepsilon) \\leq \\sigma^2/(n\\varepsilon^2) \\to 0$."}),e.jsx(S,{label:"Theorem 5.1.1",title:"Strong Law of Large Numbers (SLLN)",statement:"Let $X_1, X_2, \\ldots$ be i.i.d. with $E[|X_1|] < \\infty$. Then $P\\!\\left(\\lim_{n\\to\\infty} \\bar{X}_n = \\mu\\right) = 1$, i.e., $\\bar{X}_n \\to \\mu$ almost surely.",proof:"The full proof uses the Borel-Cantelli lemma. Sketch: WLOG $\\mu = 0$. Truncate $X_k$ to $Y_k = X_k \\mathbf{1}_{|X_k| \\leq k}$. Show $\\sum_k \\text{Var}(Y_k)/k^2 < \\infty$ (using $E[|X|] < \\infty$). Apply the Kolmogorov maximal inequality and the Kronecker lemma.",corollaries:["Monte Carlo integration: for $f$ with $E[|f(X)|] < \\infty$, $\\frac{1}{n}\\sum_i f(X_i) \\xrightarrow{a.s.} E[f(X)]$.","Sample variance converges: $s_n^2 = \\frac{1}{n}\\sum(X_i-\\bar{X}_n)^2 \\xrightarrow{a.s.} \\sigma^2$."]}),e.jsxs(q,{title:"Monte Carlo Integration via LLN",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["Estimate ",e.jsx(a.InlineMath,{math:"\\pi"})," using the LLN. Sample ",e.jsx(a.InlineMath,{math:"(U_1, U_2) \\sim \\text{Uniform}([0,1]^2)"}),"."]}),e.jsx(a.BlockMath,{math:"E[\\mathbf{1}_{U_1^2+U_2^2 \\leq 1}] = P(U_1^2+U_2^2\\leq 1) = \\pi/4"}),e.jsx(a.BlockMath,{math:"\\hat{\\pi} = \\frac{4}{n}\\sum_{i=1}^n \\mathbf{1}_{U_{1,i}^2+U_{2,i}^2\\leq 1} \\xrightarrow{a.s.} \\pi"})]}),e.jsx(F,{title:"LLN Requires Finite Expectation",children:e.jsxs("p",{children:["The LLN fails without ",e.jsx(a.InlineMath,{math:"E[|X|] < \\infty"}),". For a Cauchy distribution (which has no mean), the sample average does not converge — in fact,"," ",e.jsx(a.InlineMath,{math:"\\bar{X}_n"})," has the same Cauchy distribution for all ",e.jsx(a.InlineMath,{math:"n"}),". Similarly, for ",e.jsx(a.InlineMath,{math:"X \\sim \\text{Pareto}(\\alpha)"})," with ",e.jsx(a.InlineMath,{math:"\\alpha \\leq 1"}),", the mean is infinite and the LLN does not apply. Always check moment conditions before applying LLN-based arguments."]})}),e.jsx(C,{title:"Law of Large Numbers Demonstration",code:`import numpy as np
from scipy import stats

np.random.seed(42)

# ── Weak LLN: Chebyshev bound ─────────────────────────────────────────────
mu, sigma2 = 2.0, 4.0
epsilon = 0.1

for n in [10, 100, 1000, 10000]:
    chebyshev_bound = sigma2 / (n * epsilon**2)
    samples = np.random.normal(mu, np.sqrt(sigma2), (1000, n))
    sample_means = samples.mean(axis=1)
    empirical_prob = np.mean(np.abs(sample_means - mu) > epsilon)
    print(f"n={n:5d}: P(|X̄-μ|>{epsilon}) ≤ {chebyshev_bound:.4f}, empirical={empirical_prob:.4f}")

# ── Strong LLN: running average ───────────────────────────────────────────
print("\\nRunning average convergence:")
n_total = 10000
X = np.random.exponential(1.0, n_total)  # Exp(1), mean=1
running_mean = np.cumsum(X) / np.arange(1, n_total+1)
for n in [10, 100, 1000, 10000]:
    print(f"  n={n:5d}: X̄_n = {running_mean[n-1]:.6f}")

# ── Monte Carlo π estimation ──────────────────────────────────────────────
ns = [100, 1000, 10000, 100000]
for n in ns:
    U1, U2 = np.random.uniform(0,1,n), np.random.uniform(0,1,n)
    pi_est = 4 * np.mean(U1**2 + U2**2 <= 1)
    print(f"  n={n:6d}: π ≈ {pi_est:.5f} (error: {abs(pi_est-np.pi):.5f})")

# ── LLN fails for Cauchy ──────────────────────────────────────────────────
print("\\nCauchy distribution (no mean): sample averages do NOT converge")
for n in [100, 1000, 10000]:
    X_cauchy = stats.cauchy.rvs(size=n)
    print(f"  n={n:5d}: X̄_n = {X_cauchy.mean():.2f} (should converge for any dist with finite mean)")`})]})}const Ue=Object.freeze(Object.defineProperty({__proto__:null,default:ye},Symbol.toStringTag,{value:"Module"}));function be(i){let $=i>>>0;return()=>($=Math.imul(1664525,$)+1013904223>>>0,$/4294967295)}function $e(i,$){return i==="uniform"?$():i==="bernoulli"?$()<.3?1:0:i==="exponential"?-Math.log(1-$()*.9999):$()}function _e(i){return i==="uniform"?{mu:.5,sigma:Math.sqrt(1/12)}:i==="bernoulli"?{mu:.3,sigma:Math.sqrt(.3*.7)}:i==="exponential"?{mu:1,sigma:1}:{mu:.5,sigma:Math.sqrt(1/12)}}const je=2e3,I=30;function ve(){const[i,$]=M.useState("uniform"),[r,k]=M.useState(10),{histData:p,normalCurve:j,stats:y}=M.useMemo(()=>{const f=be(42),{mu:g,sigma:u}=_e(i),x=u/Math.sqrt(r),h=Array.from({length:je},()=>{let o=0;for(let _=0;_<r;_++)o+=$e(i,f);return o/r}),n=g-4*x,c=g+4*x,m=(c-n)/I,t=new Array(I).fill(0);for(const o of h){const _=Math.floor((o-n)/m);_>=0&&_<I&&t[_]++}const d=h.length,l=t.map((o,_)=>({x:(n+(_+.5)*m).toFixed(3),density:o/(d*m)})),s=Array.from({length:80},(o,_)=>{const X=n+_/79*(c-n),b=(X-g)/x,P=Math.exp(-.5*b*b)/(x*Math.sqrt(2*Math.PI));return{x:X.toFixed(3),pdf:P}});return{histData:l,normalCurve:s,stats:{mu:g,sigma:u,seMean:x}}},[i,r]),v=[1,2,5,10,30,100];return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4",children:[e.jsx("h3",{className:"mb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300",children:"CLT Interactive Demo: Distribution of Sample Mean X̄ₙ"}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-4 justify-center",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medium text-gray-500 mb-1",children:"Distribution"}),e.jsxs("select",{value:i,onChange:f=>$(f.target.value),className:"rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300",children:[e.jsx("option",{value:"uniform",children:"Uniform(0,1)"}),e.jsx("option",{value:"bernoulli",children:"Bernoulli(0.3)"}),e.jsx("option",{value:"exponential",children:"Exponential(1)"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medium text-gray-500 mb-1",children:"Sample size n"}),e.jsx("div",{className:"flex gap-1",children:v.map(f=>e.jsx("button",{onClick:()=>k(f),className:`px-2.5 py-1 rounded text-xs font-medium transition-colors ${r===f?"bg-indigo-600 text-white":"bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`,children:f},f))})]})]}),e.jsx(V,{width:"100%",height:220,children:e.jsxs(R,{data:p,margin:{top:5,right:10,bottom:20,left:10},children:[e.jsx(U,{strokeDasharray:"3 3",stroke:"#1e293b"}),e.jsx(Q,{dataKey:"x",tick:{fontSize:9,fill:"#94a3b8"},interval:5,label:{value:"Sample mean",position:"insideBottom",offset:-10,fill:"#64748b",fontSize:11}}),e.jsx(Z,{tick:{fontSize:9,fill:"#94a3b8"},label:{value:"Density",angle:-90,position:"insideLeft",fill:"#64748b",fontSize:11}}),e.jsx(J,{contentStyle:{background:"#1e293b",border:"none",borderRadius:8,fontSize:11},labelStyle:{color:"#94a3b8"},itemStyle:{color:"#818cf8"}}),e.jsx(ee,{dataKey:"density",fill:"#6366f1",fillOpacity:.7})]})}),e.jsxs("div",{className:"mt-1 text-center text-xs text-gray-500",children:["n=",r," · SE = σ/√n = ",y.seMean.toFixed(4)," · 2000 samples · Normal(μ=",y.mu.toFixed(2),", σ²/n=",(y.seMean**2).toFixed(5),") overlay"]}),e.jsx("p",{className:"mt-2 text-xs text-gray-500 dark:text-gray-500 text-center",children:"Watch the histogram converge to a bell curve as n increases — regardless of the original distribution shape."})]})}function ke(){return e.jsxs(W,{children:[e.jsx(G,{title:"Historical Note",content:"The CLT has a remarkable history: de Moivre (1733) proved it for coin flips, Laplace (1812) extended it to general distributions, and Lyapunov (1901) gave the first rigorous proof via moment conditions. Lindeberg (1922) provided the definitive general conditions. It is arguably the most important theorem in all of statistics — it explains why the Gaussian distribution appears everywhere in nature."}),e.jsxs("p",{className:"mb-6 text-gray-700 dark:text-gray-300 leading-relaxed",children:["Why does the normal distribution appear everywhere? The Central Limit Theorem gives the answer: when you average many ",e.jsx("em",{children:"independent"})," random quantities, the result converges to a Gaussian — regardless of the shape of the original distribution. This is why measurement errors, noise in neural networks, and gradient statistics all look Gaussian."]}),e.jsx(w,{label:"Definition 6.1",title:"Sample Mean and Standardized Sum",definition:"Given iid random variables $X_1, \\ldots, X_n$ with mean $\\mu$ and variance $\\sigma^2 < \\infty$, the sample mean is $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i$ and the standardized sum is $Z_n = \\frac{\\bar{X}_n - \\mu}{\\sigma/\\sqrt{n}} = \\frac{\\sum X_i - n\\mu}{\\sigma\\sqrt{n}}$.",notation:"$\\xrightarrow{d}$ denotes convergence in distribution; $\\mathcal{N}(0,1)$ is the standard normal."}),e.jsx(S,{label:"Theorem 6.2",title:"Central Limit Theorem (Lindeberg-Lévy)",statement:"Let $X_1, X_2, \\ldots$ be iid with mean $\\mu$ and finite variance $\\sigma^2 > 0$. Then as $n \\to \\infty$: $Z_n = \\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)$. Equivalently, $\\sqrt{n}(\\bar{X}_n - \\mu) \\xrightarrow{d} \\mathcal{N}(0, \\sigma^2)$.",proof:"Proof via characteristic functions (Fourier approach). Let $\\phi_X(t) = E[e^{itX}]$ be the characteristic function of $X_i - \\mu$ (zero mean). Then $\\phi_{Z_n}(t) = \\phi_X(t/(\\sigma\\sqrt{n}))^n$. Expand: $\\phi_X(s) = 1 + iE[X-\\mu]s - \\frac{E[(X-\\mu)^2]}{2}s^2 + o(s^2) = 1 - \\frac{\\sigma^2}{2}s^2 + o(s^2)$. So $\\phi_{Z_n}(t) = (1 - \\frac{t^2}{2n} + o(1/n))^n \\to e^{-t^2/2}$, which is the characteristic function of $\\mathcal{N}(0,1)$. By Lévy's continuity theorem, convergence of characteristic functions implies convergence in distribution.",corollaries:["Berry-Esseen bound: the convergence rate is $O(1/\\sqrt{n})$ — specifically $|F_n(x) - \\Phi(x)| \\leq C\\rho/(\\sigma^3\\sqrt{n})$ where $\\rho = E|X-\\mu|^3$.","The Delta method extends CLT to smooth functions: if $\\sqrt{n}(\\bar{X}-\\mu) \\to \\mathcal{N}(0,\\sigma^2)$ then $\\sqrt{n}(g(\\bar{X})-g(\\mu)) \\to \\mathcal{N}(0,\\sigma^2[g'(\\mu)]^2)$.","For sums (not means): $\\sum_{i=1}^n X_i \\approx \\mathcal{N}(n\\mu, n\\sigma^2)$ for large $n$."]}),e.jsx(ve,{}),e.jsx(q,{title:"Dice Rolling: Sum of n Dice",steps:[{label:"Single die",content:"Rolling one fair die: $X_i \\sim \\text{Uniform}\\{1,\\ldots,6\\}$, so $\\mu=3.5$, $\\sigma^2=35/12\\approx 2.92$"},{label:"Sum of n dice",content:"$S_n = X_1+\\cdots+X_n$ has $E[S_n]=3.5n$, $\\text{Var}(S_n)=35n/12$"},{label:"CLT approximation",content:"For $n=30$: $S_{30} \\approx \\mathcal{N}(105, 87.5)$, so $P(100 \\leq S_{30} \\leq 110) \\approx \\Phi((110-105)/\\sqrt{87.5})-\\Phi((100-105)/\\sqrt{87.5})$"},{label:"Result",content:"$\\approx \\Phi(0.535)-\\Phi(-0.535) = 2\\Phi(0.535)-1 \\approx 0.407$. Exact simulation gives $\\approx 0.41$."}]}),e.jsxs("div",{className:"my-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4",children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200",children:"CLT in Machine Learning"}),e.jsx("div",{className:"grid gap-2 sm:grid-cols-2 text-xs text-gray-600 dark:text-gray-400",children:[["Mini-batch SGD noise","Gradient noise in mini-batch SGD is a sum of per-sample gradients ≈ N(∇L, Σ/B) by CLT. This Gaussian noise has been linked to implicit regularization."],["Weight initialization","Xavier/He initialization derives variance bounds so that pre-activations remain O(1); CLT justifies treating pre-activations as approximately Gaussian at initialization."],["Ensemble methods","Averaging n model predictions reduces variance by 1/n (law of large numbers) and CLT says the error distribution becomes Gaussian."],["Hypothesis testing in ML","Permutation tests, bootstrap confidence intervals, and t-tests for comparing model accuracy all rely on CLT for valid p-values."]].map(([i,$])=>e.jsxs("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5",children:[e.jsx("div",{className:"font-semibold text-indigo-600 dark:text-indigo-400 mb-1",children:i}),e.jsx("div",{children:$})]},i))})]}),e.jsx(C,{title:"CLT Simulation",code:`import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

rng = np.random.default_rng(42)

def clt_demo(dist_fn, mu, sigma, n_values=(1, 5, 30, 100), n_samples=5000):
    fig, axes = plt.subplots(1, len(n_values), figsize=(14, 3))
    x_range = np.linspace(mu - 4*sigma, mu + 4*sigma, 200)
    
    for ax, n in zip(axes, n_values):
        # Generate sample means
        samples = dist_fn(size=(n_samples, n))
        means = samples.mean(axis=1)
        
        se = sigma / np.sqrt(n)
        x_plot = np.linspace(means.min(), means.max(), 200)
        
        ax.hist(means, bins=50, density=True, alpha=0.7, color='steelblue', label='Simulation')
        ax.plot(x_plot, stats.norm.pdf(x_plot, mu, se),
                'r-', lw=2, label=f'N({mu:.1f},{se:.3f}²)')
        ax.set_title(f'n = {n}')
        ax.legend(fontsize=7)
    
    plt.tight_layout()
    plt.show()

# Example: exponential distribution (very non-Gaussian)
clt_demo(
    dist_fn=lambda size: rng.exponential(scale=1.0, size=size),
    mu=1.0, sigma=1.0
)

# Berry-Esseen bound: convergence rate
n_vals = np.logspace(0, 4, 50, dtype=int)
errors = []
for n in n_vals:
    samples = rng.exponential(size=(10000, n)).mean(axis=1)
    # KS test against standard normal
    z = (samples - 1.0) / (1.0 / np.sqrt(n))
    ks_stat, _ = stats.kstest(z, 'norm')
    errors.append(ks_stat)

# Should scale as 1/sqrt(n)
import numpy as np
slope, intercept = np.polyfit(np.log(n_vals), np.log(errors), 1)
print(f"Empirical convergence rate: n^{slope:.2f} (theory: n^-0.5)")
`}),e.jsx(F,{title:"When CLT Fails or is Slow",items:["CLT requires finite variance. Heavy-tailed distributions like Pareto or Cauchy (infinite variance) do NOT converge to Gaussian — they converge to stable distributions instead.","Convergence is slow (O(1/√n)) when the distribution is very skewed or has large excess kurtosis. Need n ≫ 30 for exponential distributions.","CLT applies to means of iid samples. If observations are correlated (time series, spatial data), use the Functional CLT or check mixing conditions.","The 'rule of thumb' n≥30 is dangerous — it's distribution-dependent. Always verify with QQ-plots or formal normality tests."]}),e.jsx(O,{exercises:[{difficulty:"conceptual",question:"Why does the CLT require finite variance? Construct a distribution where $E[X^2] = \\infty$ and show empirically that sample means do not converge to a Gaussian."},{difficulty:"computational",question:"A factory produces widgets with weight $\\mu=100g$, $\\sigma=5g$. How many widgets must you average to ensure $P(|\\bar{X}-100| < 0.5) \\geq 0.95$?"},{difficulty:"proof",question:"Prove the CLT for Bernoulli$(p)$ random variables using characteristic functions (this is essentially de Moivre's original result for the binomial distribution)."},{difficulty:"implementation",question:"Empirically verify the Berry-Esseen bound for the exponential distribution: plot the KS distance between $Z_n$ and $\\mathcal{N}(0,1)$ vs $n$ on a log-log scale and estimate the convergence rate."}]}),e.jsx(K,{references:[{authors:"Durrett, R.",year:2019,title:"Probability: Theory and Examples (5th ed.), Ch. 3",venue:"Cambridge University Press",note:"Rigorous CLT proof and extensions"},{authors:"Billingsley, P.",year:1995,title:"Probability and Measure (3rd ed.)",venue:"Wiley",note:"Measure-theoretic foundations, characteristic function proofs"},{authors:"Berry, A. C.",year:1941,title:"The accuracy of the Gaussian approximation to the sum of independent variates",venue:"Transactions of the American Mathematical Society, 49(1)",note:"Original Berry-Esseen bound paper"},{authors:"Bottou, L., Curtis, F. E., & Nocedal, J.",year:2018,title:"Optimization methods for large-scale machine learning",venue:"SIAM Review, 60(2)",url:"https://arxiv.org/abs/1606.04838",note:"CLT and Gaussian noise in SGD analysis"}]})]})}const Qe=Object.freeze(Object.defineProperty({__proto__:null,default:ke},Symbol.toStringTag,{value:"Module"}));function Me(){const[i,$]=M.useState([[.7,.2,.1],[.3,.4,.3],[.1,.4,.5]]),[r,k]=M.useState(0),[p,j]=M.useState([0]),y=()=>{const h=i[r],n=Math.random();let c=0,m=0;for(let t=0;t<3;t++)if(c+=h[t],n<c){m=t;break}k(m),j(t=>[...t.slice(-30),m])},v=["#6366f1","#10b981","#f97316"],f=["S₀","S₁","S₂"],g=[{x:80,y:80},{x:220,y:80},{x:150,y:200}],u=20,x=(h,n,c,m)=>{if(h===n)return null;const{x:t,y:d}=g[h],{x:l,y:s}=g[n],o=(t+l)/2,_=(d+s)/2,X=l-t,b=s-d,P=Math.sqrt(X*X+b*b),N=-b/P,A=X/P,E={x:o+N*25,y:_+A*25},B=t+X/P*u,D=d+b/P*u,Y=l-X/P*u,z=s-b/P*u,H=.3+c*1.5;return e.jsxs("g",{children:[e.jsx("path",{d:`M${B},${D} Q${E.x},${E.y} ${Y},${z}`,fill:"none",stroke:v[h],strokeWidth:1+c*3,opacity:Math.min(1,H)}),e.jsx("text",{x:E.x+N*12,y:E.y+A*12,fontSize:9,fill:v[h],textAnchor:"middle",children:c.toFixed(2)})]},`${h}-${n}`)};return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"3-State Markov Chain Transition Diagram"}),e.jsxs("div",{className:"flex gap-6",children:[e.jsxs("svg",{viewBox:"0 0 300 280",className:"w-64 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[i.map((h,n)=>h.map((c,m)=>n!==m&&c>.01?x(n,m,c):null)),i.map((h,n)=>h[n]>.01&&e.jsx("text",{x:g[n].x+(n===0?-22:n===1?15:-8),y:g[n].y+(n===2?20:-22),fontSize:9,fill:v[n],children:h[n].toFixed(2)},`self-${n}`)),g.map((h,n)=>e.jsxs("g",{children:[e.jsx("circle",{cx:h.x,cy:h.y,r:20,fill:r===n?v[n]:"white",stroke:v[n],strokeWidth:2.5}),e.jsx("text",{x:h.x,y:h.y+5,fontSize:13,fontWeight:"700",textAnchor:"middle",fill:r===n?"white":v[n],children:f[n]})]},n)),e.jsxs("text",{x:150,y:258,fontSize:9,fill:"#9ca3af",textAnchor:"middle",children:["Recent: ",p.slice(-15).join("→")]})]}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx("p",{className:"text-xs font-semibold text-gray-600 dark:text-gray-400",children:"Transition Matrix P:"}),i.map((h,n)=>e.jsx("div",{className:"flex gap-1",children:h.map((c,m)=>e.jsx("div",{className:"flex-1",children:e.jsx("input",{type:"number",min:"0",max:"1",step:"0.1",value:c.toFixed(1),onChange:t=>{const d=Math.max(0,Math.min(1,parseFloat(t.target.value)||0));$(l=>{const s=l.map(_=>[..._]);s[n][m],s[n][m]=d;const o=s[n].reduce((_,X)=>_+X,0);return o>0&&(s[n]=s[n].map(_=>_/o)),s})},className:"w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1 py-0.5 text-xs text-center"})},m))},n)),e.jsxs("button",{onClick:y,className:"mt-2 w-full rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white",children:["Take Step (Current: ",f[r],")"]})]})]})]})}function Pe(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(Me,{}),e.jsx(w,{label:"Definition 6.1.1",title:"Markov Chain",definition:"A discrete-time Markov chain is a sequence $X_0, X_1, X_2, \\ldots$ of random variables on state space $\\mathcal{S}$ satisfying the Markov property: $P(X_{n+1} = j | X_n = i, X_{n-1}, \\ldots, X_0) = P(X_{n+1} = j | X_n = i) = P_{ij}$. The transition matrix $P = (P_{ij})$ has $P_{ij} \\geq 0$ and $\\sum_j P_{ij} = 1$ (row-stochastic). $P_{ij}^{(n)} = P(X_n = j | X_0 = i)$ is the $n$-step transition probability.",notation:"Matrix form: if $\\pi^{(0)}$ is the initial distribution row vector, then $\\pi^{(n)} = \\pi^{(0)} P^n$. The $(i,j)$ entry of $P^n$ gives the $n$-step transition probability $P_{ij}^{(n)}$."}),e.jsx(w,{label:"Definition 6.1.2",title:"Irreducibility and Aperiodicity",definition:"A Markov chain is irreducible if for every pair $(i,j)$, there exists $n$ with $P_{ij}^{(n)} > 0$ (every state is reachable from every other). State $i$ has period $d_i = \\gcd\\{n \\geq 1: P_{ii}^{(n)} > 0\\}$. A state (or chain) is aperiodic if $d_i = 1$. An irreducible, aperiodic chain on a finite state space has a unique stationary distribution."}),e.jsx(S,{label:"Theorem 6.1.1",title:"Chapman-Kolmogorov Equations",statement:"For any $m, n \\geq 0$ and states $i, j$: $P_{ij}^{(m+n)} = \\sum_k P_{ik}^{(m)} P_{kj}^{(n)}$, equivalently $P^{m+n} = P^m P^n$. This is simply matrix multiplication of the transition matrix.",proof:"By the law of total probability and the Markov property: $P_{ij}^{(m+n)} = P(X_{m+n}=j|X_0=i) = \\sum_k P(X_m=k|X_0=i) P(X_{m+n}=j|X_m=k) = \\sum_k P_{ik}^{(m)} P_{kj}^{(n)}$."}),e.jsxs(q,{title:"Random Walk on a Graph (Google PageRank)",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["A random surfer on the web follows links uniformly. The transition matrix is:",e.jsx(a.InlineMath,{math:"P_{ij} = 1/\\deg(i)"})," if there is an edge from ",e.jsx(a.InlineMath,{math:"i"})," to ",e.jsx(a.InlineMath,{math:"j"}),"."]}),e.jsx(a.BlockMath,{math:"\\pi^{(n)} = \\pi^{(0)} P^n \\xrightarrow{n\\to\\infty} \\pi"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["PageRank is the stationary distribution ",e.jsx(a.InlineMath,{math:"\\pi"})," of this random walk (with damping)."]})]}),e.jsx(F,{title:"Markov Property Can Be Violated in Practice",children:e.jsxs("p",{children:["Many real systems only approximately satisfy the Markov property. Stock prices are often modeled as Markov, but empirical evidence shows momentum and mean-reversion effects that depend on longer history. Higher-order Markov models use a window of past states:",e.jsx(a.InlineMath,{math:"P(X_{n+1} | X_n, X_{n-1}, \\ldots, X_{n-k+1})"}),". Language models (n-gram models) are precisely ",e.jsx(a.InlineMath,{math:"k"}),"-th order Markov chains on word sequences. Transformers break the Markov assumption by attending to all past tokens."]})}),e.jsx(C,{title:"Markov Chain Simulation and Analysis",code:`import numpy as np

# ── Define a 3-state Markov chain ─────────────────────────────────────────
P = np.array([
    [0.7, 0.2, 0.1],
    [0.3, 0.4, 0.3],
    [0.1, 0.4, 0.5],
])
print("Transition matrix P:")
print(P)

# ── Simulate trajectory ────────────────────────────────────────────────────
def simulate_markov(P, n_steps, initial_state=0, seed=42):
    np.random.seed(seed)
    states = [initial_state]
    for _ in range(n_steps):
        current = states[-1]
        next_state = np.random.choice(len(P), p=P[current])
        states.append(next_state)
    return states

trajectory = simulate_markov(P, 10000)
print(f"\\n10000-step simulation (starting from state 0):")
for s in range(3):
    freq = trajectory.count(s) / len(trajectory)
    print(f"  State {s}: visited {freq:.4f}")

# ── Chapman-Kolmogorov: P^n by matrix multiplication ────────────────────
print("\\nP^n transition probabilities from state 0:")
Pn = np.eye(3)
for n in [1, 2, 5, 10, 20, 50]:
    Pn = np.linalg.matrix_power(P, n)
    print(f"  n={n:2d}: {Pn[0]}")

# ── Stationary distribution ────────────────────────────────────────────────
# Find left eigenvector for eigenvalue 1
eigenvalues, eigenvectors = np.linalg.eig(P.T)
idx = np.argmin(np.abs(eigenvalues - 1.0))
pi = np.real(eigenvectors[:, idx])
pi /= pi.sum()
print(f"\\nStationary distribution: {pi}")
print(f"Verify πP = π: {np.allclose(pi @ P, pi)}")`})]})}const Ze=Object.freeze(Object.defineProperty({__proto__:null,default:Pe},Symbol.toStringTag,{value:"Module"}));function Xe(){const i=[[.6,.3,.1],[.2,.5,.3],[.1,.3,.6]],[$,r]=M.useState(0),[k,p]=M.useState(0),j=[[1,0,0],[0,1,0],[0,0,1],[1/3,1/3,1/3]],y=["[1,0,0]","[0,1,0]","[0,0,1]","uniform"],v=(n,c)=>c[0].map((m,t)=>n.reduce((d,l,s)=>d+l*c[s][t],0));let f=[...j[k]];for(let n=0;n<$;n++)f=v(f,i);const g=Array.from({length:20},(n,c)=>{let m=[...j[k]];for(let t=0;t<c;t++)m=v(m,i);return m}),u=["#6366f1","#10b981","#f97316"],x=340,h=150;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Power Iteration: Stationary Distribution Convergence"}),e.jsxs("p",{className:"mb-3 text-sm text-gray-500 dark:text-gray-400",children:["Starting distribution ",e.jsx(a.InlineMath,{math:"\\pi^{(0)}"})," converges to ",e.jsx(a.InlineMath,{math:"\\pi"})," regardless of starting point."]}),e.jsx("div",{className:"mb-3 flex flex-wrap gap-2",children:y.map((n,c)=>e.jsx("button",{onClick:()=>{p(c),r(0)},className:`rounded-lg px-2 py-1 text-xs font-medium ${k===c?"bg-indigo-500 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`,children:n},c))}),e.jsxs("svg",{width:x,height:h,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3",children:[[0,1,2].map(n=>{const m=g.map((t,d)=>({sx:d/19*(x-20)+10,sy:h-10-t[n]*(h-20)})).map((t,d)=>`${d===0?"M":"L"}${t.sx.toFixed(1)},${t.sy.toFixed(1)}`).join(" ");return e.jsx("path",{d:m,fill:"none",stroke:u[n],strokeWidth:2},n)}),[0,1,2].map(n=>{const c=Math.min($,19)/19*(x-20)+10,m=h-10-g[Math.min($,19)][n]*(h-20);return e.jsx("circle",{cx:c,cy:m,r:4,fill:u[n]},n)})]}),e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("input",{type:"range",min:"0",max:"19",step:"1",value:Math.min($,19),onChange:n=>r(parseInt(n.target.value)),className:"flex-1 accent-indigo-500"}),e.jsxs("span",{className:"text-sm text-gray-600 dark:text-gray-400 w-16",children:["n = ",$]})]}),e.jsx("div",{className:"grid grid-cols-3 gap-2",children:[0,1,2].map(n=>e.jsxs("div",{className:"rounded-lg px-3 py-2 text-sm",style:{backgroundColor:`${u[n]}20`},children:[e.jsxs("p",{className:"text-xs font-semibold",style:{color:u[n]},children:["State ",n]}),e.jsx("p",{className:"font-mono",children:f[n].toFixed(5)})]},n))})]})}function we(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(Xe,{}),e.jsx(w,{label:"Definition 6.2.1",title:"Stationary Distribution",definition:"A probability distribution $\\pi = (\\pi_j)_{j \\in \\mathcal{S}}$ is stationary (invariant) for Markov chain $P$ if $\\pi P = \\pi$, i.e., $\\pi_j = \\sum_i \\pi_i P_{ij}$ for all $j$. Equivalently, $\\pi$ is the left eigenvector of $P$ for eigenvalue 1. If the chain starts in $\\pi$ (i.e., $P(X_0 = i) = \\pi_i$), it stays in $\\pi$ for all time.",notation:"For an irreducible finite Markov chain, the unique stationary distribution exists and satisfies $\\pi_i = 1/E_i[T_i]$ where $T_i = \\inf\\{n \\geq 1: X_n = i\\}$ is the first return time to state $i$."}),e.jsx(w,{label:"Definition 6.2.2",title:"Detailed Balance",definition:"A chain satisfies detailed balance with respect to $\\pi$ if $\\pi_i P_{ij} = \\pi_j P_{ji}$ for all $i, j$. This is a stronger condition than stationarity ($\\pi P = \\pi$ follows by summing over $i$). A chain satisfying detailed balance is called reversible: it looks the same forwards and backwards. Detailed balance is fundamental to MCMC: designing transitions that satisfy it guarantees the correct stationary distribution."}),e.jsx(S,{label:"Theorem 6.2.1",title:"Ergodic Theorem for Markov Chains",statement:"For an irreducible, aperiodic Markov chain with unique stationary distribution $\\pi$: (1) $P^n_{ij} \\to \\pi_j$ as $n \\to \\infty$ for all $i, j$ (mixing). (2) For any bounded function $f$: $\\frac{1}{n}\\sum_{k=0}^{n-1} f(X_k) \\xrightarrow{a.s.} \\sum_j \\pi_j f(j) = E_\\pi[f]$ (ergodicity). The convergence rate to stationarity is governed by the second-largest eigenvalue $\\lambda_2$ of $P$: the mixing time is $O(1/(1-|\\lambda_2|))$.",proof:"By the Perron-Frobenius theorem, the largest eigenvalue of a positive row-stochastic matrix is 1 (simple), with corresponding left eigenvector $\\pi > 0$. All other eigenvalues satisfy $|\\lambda| < 1$. Writing $P^n = \\pi^T \\mathbf{1} + \\sum_{k=2}^d \\lambda_k^n v_k w_k^T$ and $\\lambda_k^n \\to 0$."}),e.jsxs(q,{title:"Gambler's Ruin as a Markov Chain",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["A gambler starts with ",e.jsx(a.InlineMath,{math:"k"})," dollars, wins or loses 1 dollar with probability"," ",e.jsx(a.InlineMath,{math:"p"})," and ",e.jsx(a.InlineMath,{math:"1-p"}),", stops at 0 or ",e.jsx(a.InlineMath,{math:"N"}),". States 0 and ",e.jsx(a.InlineMath,{math:"N"})," are absorbing. Probability of reaching ",e.jsx(a.InlineMath,{math:"N"}),":"]}),e.jsx(a.BlockMath,{math:"P(\\text{win} | X_0 = k) = \\frac{1 - (q/p)^k}{1 - (q/p)^N} \\quad (p \\neq 1/2)"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["For fair game (",e.jsx(a.InlineMath,{math:"p=1/2"}),"): ",e.jsx(a.InlineMath,{math:"P(\\text{win}) = k/N"}),"."]})]}),e.jsx(F,{title:"Mixing Time Can Be Exponentially Large",children:e.jsxs("p",{children:["The time to reach stationarity (mixing time) can be enormous. For a random walk on a path graph with ",e.jsx(a.InlineMath,{math:"N"})," nodes, mixing time is ",e.jsx(a.InlineMath,{math:"O(N^2)"}),". For the Metropolis algorithm in high dimensions, mixing can require exponential time on multimodal distributions (the chain gets trapped in local modes). In ML, the mixing time of MCMC samplers limits their practical applicability for deep learning posteriors — this motivates variational inference as an alternative."]})}),e.jsx(C,{title:"Stationary Distribution and Mixing",code:`import numpy as np
from scipy import linalg

# ── Stationary distribution ─────────────────────────────────────────────
P = np.array([
    [0.6, 0.3, 0.1],
    [0.2, 0.5, 0.3],
    [0.1, 0.3, 0.6],
])

# Method 1: Power iteration
pi = np.array([1/3, 1/3, 1/3])
for _ in range(1000):
    pi = pi @ P
print(f"Power iteration stationary dist: {pi}")

# Method 2: Left eigenvector (eigenvalue = 1)
eigenvalues, eigenvectors = linalg.eig(P.T)
idx = np.argmin(np.abs(eigenvalues - 1.0))
pi_eig = np.real(eigenvectors[:, idx])
pi_eig /= pi_eig.sum()
print(f"Eigenvector method:              {pi_eig}")

# Method 3: Solve linear system (pi P = pi, sum pi = 1)
A = np.vstack([P.T - np.eye(3), np.ones((1, 3))])
b = np.zeros(4); b[-1] = 1
pi_ls, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
print(f"Linear system method:            {pi_ls}")

# ── Mixing time ───────────────────────────────────────────────────────────
print("\\nP^n row 0 (convergence to stationary):")
for n in [1, 2, 5, 10, 20, 50]:
    Pn = np.linalg.matrix_power(P, n)
    print(f"  n={n:2d}: {Pn[0]} (diff={np.linalg.norm(Pn[0] - pi):.6f})")

# ── Eigenvalue gap ────────────────────────────────────────────────────────
eigenvalues_P = np.sort(np.abs(np.linalg.eigvals(P)))[::-1]
print(f"\\nEigenvalues: {eigenvalues_P}")
print(f"Spectral gap = 1 - |λ₂| = {1 - eigenvalues_P[1]:.4f}")
print(f"Mixing time ≈ 1/gap = {1/(1-eigenvalues_P[1]):.2f}")`})]})}const Je=Object.freeze(Object.defineProperty({__proto__:null,default:we},Symbol.toStringTag,{value:"Module"}));function Ne(){const[i,$]=M.useState([0]),[r,k]=M.useState(0),[p,j]=M.useState(0),[y,v]=M.useState(1),[f,g]=M.useState(!1),u=o=>{if(f){const _=Math.exp(-.5*(o-2)**2)/Math.sqrt(2*Math.PI),X=Math.exp(-.5*(o+2)**2)/Math.sqrt(2*Math.PI);return Math.log(.5*(_+X)+1e-300)}return-.5*o*o},x=o=>{let _=i[i.length-1],X=0;const b=[];for(let P=0;P<o;P++){const N=_+(Math.random()*2-1)*y*Math.sqrt(3),A=u(N)-u(_);Math.log(Math.random())<A&&(_=N,X++),b.push(_)}$(P=>[...P,...b].slice(-500)),k(P=>P+X),j(P=>P+o)},h=()=>{$([0]),k(0),j(0)},n=340,c=140,m=i.length,t=Math.min(...i,-3.5),d=Math.max(...i,3.5),l=(o,_)=>({sx:o/Math.max(m-1,1)*n,sy:c-10-(_-t)/(d-t+.01)*(c-20)}),s=i.map(({},o)=>{const{sx:_,sy:X}=l(o,i[o]);return`${o===0?"M":"L"}${_.toFixed(1)},${X.toFixed(1)}`}).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Metropolis-Hastings Trace Plot"}),e.jsxs("p",{className:"mb-3 text-sm text-gray-500 dark:text-gray-400",children:["Target: ",f?"Bimodal mixture N(-2,1)/2 + N(2,1)/2":"Standard Normal N(0,1)",". Proposal: Uniform(±",(y*Math.sqrt(3)).toFixed(2),")."]}),e.jsxs("svg",{width:n,height:c,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-3",children:[e.jsx("line",{x1:0,y1:l(0,0).sy,x2:n,y2:l(0,0).sy,stroke:"#9ca3af",strokeWidth:1,strokeDasharray:"4,3"}),m>1&&e.jsx("path",{d:s,fill:"none",stroke:"#6366f1",strokeWidth:1})]}),e.jsxs("div",{className:"mb-3 grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:"Proposal σ"}),e.jsx("span",{children:y.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.1",max:"5",step:"0.1",value:y,onChange:o=>v(parseFloat(o.target.value)),className:"w-full accent-indigo-500"})]}),e.jsx("div",{className:"flex items-center gap-3",children:e.jsx("button",{onClick:()=>g(o=>!o),className:`rounded-lg px-3 py-1 text-sm font-medium ${f?"bg-indigo-500 text-white":"bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`,children:f?"Bimodal ON":"Bimodal OFF"})})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap",children:[[50,200].map(o=>e.jsxs("button",{onClick:()=>x(o),className:"rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white",children:["+",o," steps"]},o)),e.jsx("button",{onClick:h,className:"rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm",children:"Reset"}),e.jsxs("span",{className:"self-center text-xs text-gray-500",children:["n=",p,", accept rate=",(p>0?r/p:0).toFixed(2)]})]})]})}function Se(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(Ne,{}),e.jsx(w,{label:"Definition 6.3.1",title:"Metropolis-Hastings Algorithm",definition:"Given target $\\pi$ (known up to a constant) and proposal $q(\\cdot|x)$, iterate: (1) At current state $x$, propose $y \\sim q(\\cdot|x)$. (2) Compute acceptance ratio $\\alpha(x,y) = \\min\\!\\left(1,\\; \\frac{\\pi(y) q(x|y)}{\\pi(x) q(y|x)}\\right)$. (3) Accept: set $x_{t+1} = y$ with probability $\\alpha$; reject: $x_{t+1} = x$. The resulting chain satisfies detailed balance with respect to $\\pi$, guaranteeing $\\pi$ is stationary.",notation:"Random walk Metropolis: $q(y|x) = q(y-x)$ (symmetric). Then $\\alpha = \\min(1, \\pi(y)/\\pi(x))$. Optimal acceptance rate for RW-MH in $d$ dimensions: $\\approx 0.234$ (Roberts et al., 1997)."}),e.jsx(w,{label:"Definition 6.3.2",title:"Gibbs Sampling",definition:"For a joint distribution $\\pi(x_1, \\ldots, x_d)$, Gibbs sampling cycles through coordinates: at each step $t$, for each $i$, sample $x_i^{(t+1)} \\sim \\pi(x_i | x_{-i}^{(t)})$ (the full conditional). Gibbs is a special case of MH with acceptance rate 1 (conditionals always accepted). Convergence requires the full conditionals to be tractable."}),e.jsx(S,{label:"Theorem 6.3.1",title:"MH Detailed Balance",statement:"The Metropolis-Hastings chain satisfies detailed balance with respect to $\\pi$: $\\pi(x) P(x,y) = \\pi(y) P(y,x)$ for all $x \\neq y$, where $P(x,y) = q(y|x) \\alpha(x,y)$ is the transition kernel. Hence $\\pi$ is the unique stationary distribution (assuming the chain is irreducible).",proof:"WLOG assume $\\pi(y) q(x|y) \\leq \\pi(x) q(y|x)$. Then $\\alpha(x,y) = \\pi(y)q(x|y)/[\\pi(x)q(y|x)]$ and $\\alpha(y,x) = 1$. $\\pi(x) P(x,y) = \\pi(x) q(y|x) \\alpha(x,y) = \\pi(y) q(x|y)$. $\\pi(y) P(y,x) = \\pi(y) q(x|y) \\cdot 1 = \\pi(y) q(x|y)$. Equal."}),e.jsxs(q,{title:"Bayesian Inference via MCMC",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["Posterior ",e.jsx(a.InlineMath,{math:"p(\\theta | x) \\propto p(x|\\theta) p(\\theta)"})," is often intractable. MH samples from it without knowing the normalizing constant:"]}),e.jsx(a.BlockMath,{math:"\\alpha(\\theta, \\theta') = \\min\\!\\left(1, \\frac{p(x|\\theta')p(\\theta')}{p(x|\\theta)p(\\theta)}\\right)"}),e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"After burn-in, the chain's empirical distribution approximates the posterior. Used for Bayesian neural networks, probabilistic graphical models."})]}),e.jsx(F,{title:"Burn-in, Thinning, and Convergence Diagnostics",children:e.jsxs("p",{children:["MCMC samples are correlated and the chain starts away from stationarity. Always: (1) discard a ",e.jsx("em",{children:"burn-in"})," period (initial samples before mixing); (2) optionally ",e.jsx("em",{children:"thin"})," to reduce autocorrelation; (3) check convergence with diagnostics like the Gelman-Rubin ",e.jsx(a.InlineMath,{math:"\\hat{R}"})," statistic (run multiple chains, ",e.jsx(a.InlineMath,{math:"\\hat{R} \\approx 1"})," indicates convergence). Never assume the chain has converged just because it ",e.jsx("em",{children:"looks"})," stable — for multimodal targets, the chain may be trapped in one mode indefinitely."]})}),e.jsx(C,{title:"Metropolis-Hastings from Scratch",code:`import numpy as np
from scipy import stats

# ── Metropolis-Hastings for Bayesian inference ────────────────────────────
# Model: y_i ~ N(mu, 1), prior: mu ~ N(0, 10²)
# Posterior: mu | y ~ N(mu_post, sigma_post²)

np.random.seed(42)
true_mu = 2.5
data = np.random.normal(true_mu, 1.0, 20)  # 20 observations

# Analytic posterior (conjugate)
n = len(data)
prior_mu, prior_sigma2 = 0, 100
sigma2_post = 1 / (1/prior_sigma2 + n/1.0)
mu_post = sigma2_post * (prior_mu/prior_sigma2 + data.sum()/1.0)
print(f"Analytic posterior: μ|y ~ N({mu_post:.4f}, {sigma2_post:.4f})")

def log_posterior(mu, data):
    log_prior = stats.norm(0, 10).logpdf(mu)
    log_likelihood = stats.norm(mu, 1).logpdf(data).sum()
    return log_prior + log_likelihood

# MH sampler
def metropolis_hastings(log_target, n_samples, proposal_std=0.5, initial=0):
    samples = [initial]
    accepted = 0
    for _ in range(n_samples - 1):
        current = samples[-1]
        proposal = current + np.random.normal(0, proposal_std)
        log_ratio = log_target(proposal) - log_target(current)
        if np.log(np.random.uniform()) < log_ratio:
            samples.append(proposal)
            accepted += 1
        else:
            samples.append(current)
    return np.array(samples), accepted / n_samples

samples, acc_rate = metropolis_hastings(
    lambda mu: log_posterior(mu, data), n_samples=10000, proposal_std=0.5)

burnin = 2000
samples_post = samples[burnin:]
print(f"\\nMH estimates (n={len(samples_post)}, accept={acc_rate:.3f}):")
print(f"  Posterior mean: {samples_post.mean():.4f} (analytic: {mu_post:.4f})")
print(f"  Posterior std:  {samples_post.std():.4f} (analytic: {np.sqrt(sigma2_post):.4f})")

# Gelman-Rubin diagnostic (simplified, 2 chains)
_, _ = metropolis_hastings(lambda mu: log_posterior(mu, data), 5000, 0.5, initial=5)
print(f"\\nNote: Use R-hat < 1.01 for convergence (run multiple chains)")`})]})}const et=Object.freeze(Object.defineProperty({__proto__:null,default:Se},Symbol.toStringTag,{value:"Module"}));function qe(){const[i,$]=M.useState(.5),r=x=>x<=0||x>=1?0:-x*Math.log2(x)-(1-x)*Math.log2(1-x),k=r(i),p=340,j=180,y=200,f=Array.from({length:y},(x,h)=>{const n=.001+h/(y-1)*.998;return{sx:n*(p-20)+10,sy:j-20-r(n)*(j-30)}}).map((x,h)=>`${h===0?"M":"L"}${x.sx.toFixed(1)},${x.sy.toFixed(1)}`).join(" "),g=i*(p-20)+10,u=j-20-k*(j-30);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsxs("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:["Binary Entropy: ",e.jsx(a.InlineMath,{math:"H(p) = -p\\log_2 p - (1-p)\\log_2(1-p)"})]}),e.jsxs("p",{className:"mb-3 text-sm text-gray-500 dark:text-gray-400",children:["Maximum entropy at ",e.jsx(a.InlineMath,{math:"p=0.5"})," (maximum uncertainty). Zero at ",e.jsx(a.InlineMath,{math:"p=0"})," or ",e.jsx(a.InlineMath,{math:"p=1"})," (certainty)."]}),e.jsxs("svg",{width:p,height:j,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[e.jsx("line",{x1:10,y1:j-20,x2:p-10,y2:j-20,stroke:"#9ca3af",strokeWidth:1}),e.jsx("path",{d:f,fill:"rgba(99,102,241,0.1)",stroke:"#6366f1",strokeWidth:2.5}),e.jsx("line",{x1:g,y1:j-20,x2:g,y2:u,stroke:"#ef4444",strokeWidth:1.5,strokeDasharray:"4,3"}),e.jsx("circle",{cx:g,cy:u,r:6,fill:"#ef4444",stroke:"white",strokeWidth:2}),e.jsxs("text",{x:g+8,y:u-6,fontSize:11,fill:"#ef4444",fontWeight:"600",children:["H=",k.toFixed(3)]}),e.jsx("text",{x:10,y:j-25,fontSize:9,fill:"#6b7280",children:"p=0"}),e.jsx("text",{x:p-25,y:j-25,fontSize:9,fill:"#6b7280",children:"p=1"}),e.jsx("text",{x:(p-20)/2,y:20,fontSize:9,fill:"#6366f1",children:"max H=1 bit at p=0.5"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{className:"font-mono",children:"p"}),e.jsx("span",{children:i.toFixed(3)})]}),e.jsx("input",{type:"range",min:"0.001",max:"0.999",step:"0.001",value:i,onChange:x=>$(parseFloat(x.target.value)),className:"w-full accent-indigo-500"})]}),e.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{className:"rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2",children:[e.jsx("p",{className:"text-xs text-indigo-600",children:"H(p) in bits"}),e.jsx("p",{className:"font-mono font-bold",children:k.toFixed(5)})]}),e.jsxs("div",{className:"rounded-lg bg-green-50 dark:bg-green-900/20 px-3 py-2",children:[e.jsx("p",{className:"text-xs text-green-600",children:"H(p) in nats"}),e.jsx("p",{className:"font-mono font-bold",children:(k*Math.log(2)).toFixed(5)})]})]})]})}function Fe(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(qe,{}),e.jsx(w,{label:"Definition 7.1.1",title:"Shannon Entropy",definition:"For a discrete distribution $P = (p_1, \\ldots, p_n)$, the Shannon entropy is $H(P) = -\\sum_{i=1}^n p_i \\log p_i$ (using the convention $0 \\log 0 = 0$). In bits: use $\\log_2$; in nats: use natural log. For a continuous distribution with PDF $f$: differential entropy $h(f) = -\\int f(x)\\log f(x)\\,dx$. Interpretation: $H(P)$ is the expected number of bits needed to encode one draw from $P$.",notation:"Maximum entropy: for $n$ outcomes, $H(P) \\leq \\log n$ with equality iff $P$ is uniform. Entropy is non-negative for discrete distributions; differential entropy can be negative."}),e.jsx(w,{label:"Definition 7.1.2",title:"Cross-Entropy",definition:"The cross-entropy of distribution $Q$ relative to $P$ is $H(P, Q) = -\\sum_x p(x) \\log q(x) = H(P) + D_{\\text{KL}}(P \\| Q)$. In ML, the cross-entropy loss for a classifier with predicted probabilities $\\hat{y}$ and true label $y$ is $\\mathcal{L} = -\\sum_c y_c \\log \\hat{y}_c$ (for one-hot $y$, this reduces to $-\\log \\hat{y}_\\text{true}$). Minimizing cross-entropy is equivalent to maximum likelihood estimation."}),e.jsx(S,{label:"Theorem 7.1.1",title:"Gibbs' Inequality (H ≤ log n)",statement:"For any distribution $P = (p_1, \\ldots, p_n)$: $H(P) \\leq \\log n$, with equality iff $P$ is uniform ($p_i = 1/n$ for all $i$). More generally: $H(P) \\leq H(Q) + D_{\\text{KL}}(P \\| Q)$ for any $Q$, with $D_{\\text{KL}}(P \\| Q) \\geq 0$ (Gibbs' inequality).",proof:"By convexity of $-\\log$: $D_{\\text{KL}}(P\\|Q) = \\sum_x p(x) \\log(p(x)/q(x)) \\geq 0$ (by Jensen: $E_P[-\\log(q/p)] \\geq -\\log E_P[q/p] = -\\log 1 = 0$). For the maximum entropy bound: apply $D_{\\text{KL}}(P\\|\\text{Uniform}) \\geq 0$.",corollaries:["Data processing inequality: $I(X;Y) \\geq I(X;f(Y))$ — processing cannot increase information.","Maximum entropy principle: among all distributions satisfying moment constraints, the one with maximum entropy is the most 'natural' (e.g., Gaussian for mean/variance constraints)."]}),e.jsxs(q,{title:"Cross-Entropy Loss in Neural Network Classification",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["For 3-class classification with true label ",e.jsx(a.InlineMath,{math:"y = [0,1,0]"})," (class 2):"]}),e.jsx(a.BlockMath,{math:"\\mathcal{L}(\\hat{y}) = -\\log \\hat{y}_2"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["If ",e.jsx(a.InlineMath,{math:"\\hat{y} = \\text{softmax}(z)"})," where ",e.jsx(a.InlineMath,{math:"z"})," are logits, then combining softmax + cross-entropy gives the log-sum-exp formula:"," ",e.jsx(a.InlineMath,{math:"\\mathcal{L} = \\log\\sum_k e^{z_k} - z_{\\text{true}}"}),"."]})]}),e.jsx(F,{title:"Differential Entropy Can Be Negative",children:e.jsxs("p",{children:["For a continuous distribution, differential entropy ",e.jsx(a.InlineMath,{math:"h(f)"})," can be negative (e.g., ",e.jsx(a.InlineMath,{math:"\\text{Uniform}(0, 0.5)"})," has ",e.jsx(a.InlineMath,{math:"h = \\log(0.5) = -1"})," nat). Unlike discrete entropy, differential entropy is not invariant to rescaling:",e.jsx(a.InlineMath,{math:"h(aX) = h(X) + \\log|a|"}),". Also, differential entropy is not the limit of discrete entropy as bins get finer — there's a constant offset. In ML, always specify whether you mean discrete bits, nats, or differential entropy."]})}),e.jsx(C,{title:"Entropy and Cross-Entropy in Python",code:`import numpy as np
from scipy import stats

# ── Shannon entropy ────────────────────────────────────────────────────────
def entropy(p, base=2):
    """Discrete entropy in given base."""
    p = np.array(p)
    p = p[p > 0]  # exclude zeros (0 log 0 = 0)
    return -np.sum(p * np.log(p)) / np.log(base)

# Binary entropy
for p in [0.0, 0.1, 0.5, 0.9, 1.0]:
    q = 1 - p
    h = entropy([p, q]) if p > 0 and q > 0 else 0
    print(f"H({p:.1f}, {q:.1f}) = {h:.4f} bits")

# Maximum entropy for n outcomes
for n in [2, 4, 8, 16]:
    uniform = np.ones(n) / n
    print(f"H(uniform, n={n}) = {entropy(uniform):.4f} bits = log2({n}) = {np.log2(n):.4f}")

# ── Cross-entropy loss ─────────────────────────────────────────────────────
def cross_entropy(y_true, y_pred, eps=1e-15):
    """Cross-entropy for classification."""
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.sum(y_true * np.log(y_pred))

# 3-class example
y_true = np.array([0, 1, 0])  # class 2
y_pred_good = np.array([0.05, 0.90, 0.05])
y_pred_bad  = np.array([0.33, 0.34, 0.33])

print(f"\\nCross-entropy losses:")
print(f"  Good prediction: {cross_entropy(y_true, y_pred_good):.4f}")
print(f"  Bad prediction:  {cross_entropy(y_true, y_pred_bad):.4f}")

# ── Differential entropy (Normal) ─────────────────────────────────────────
# Analytic: h(N(mu, sigma²)) = 0.5 * log(2*pi*e*sigma²)
for sigma in [0.5, 1.0, 2.0]:
    h_analytic = 0.5 * np.log(2 * np.pi * np.e * sigma**2)
    # Numeric via sampling
    X = np.random.normal(0, sigma, 100000)
    h_numeric = np.mean(-stats.norm(0, sigma).logpdf(X))
    print(f"  h(N(0,{sigma}²)): analytic={h_analytic:.4f}, numeric={h_numeric:.4f} nats")`})]})}const tt=Object.freeze(Object.defineProperty({__proto__:null,default:Fe},Symbol.toStringTag,{value:"Module"}));function Ce(){const[i,$]=M.useState(0),[r,k]=M.useState(1),[p,j]=M.useState(2),[y,v]=M.useState(1.5),f=Math.log(y/r)+(r**2+(i-p)**2)/(2*y**2)-.5,g=Math.log(r/y)+(y**2+(p-i)**2)/(2*r**2)-.5,u=340,x=160,h=Math.min(i,p)-4,n=Math.max(i,p)+4,c=300,m=o=>Math.exp(-.5*((o-i)/r)**2)/(r*Math.sqrt(2*Math.PI)),t=o=>Math.exp(-.5*((o-p)/y)**2)/(y*Math.sqrt(2*Math.PI)),d=1/(Math.min(r,y)*Math.sqrt(2*Math.PI)),l=(o,_)=>({sx:(o-h)/(n-h)*u,sy:x-15-_/(d*1.1)*(x-25)}),s=o=>Array.from({length:c},(X,b)=>{const P=h+b/(c-1)*(n-h);return l(P,o(P))}).map((X,b)=>`${b===0?"M":"L"}${X.sx.toFixed(1)},${X.sy.toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"KL Divergence Between Two Gaussians"}),e.jsxs("svg",{width:u,height:x,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[e.jsx("line",{x1:0,y1:x-15,x2:u,y2:x-15,stroke:"#9ca3af",strokeWidth:1}),e.jsx("path",{d:s(m),fill:"rgba(59,130,246,0.2)",stroke:"#3b82f6",strokeWidth:2.5}),e.jsx("path",{d:s(t),fill:"rgba(239,68,68,0.2)",stroke:"#ef4444",strokeWidth:2.5})]}),e.jsx("div",{className:"mt-4 grid grid-cols-2 gap-3",children:[{l:"μ₁",v:i,s:$,c:"text-blue-600"},{l:"σ₁",v:r,s:k,c:"text-blue-600",min:.2,max:3},{l:"μ₂",v:p,s:j,c:"text-red-600"},{l:"σ₂",v:y,s:v,c:"text-red-600",min:.2,max:3}].map(({l:o,v:_,s:X,c:b,min:P=-3,max:N=3})=>e.jsxs("div",{children:[e.jsxs("div",{className:`mb-1 flex justify-between text-xs ${b}`,children:[e.jsx("span",{className:"font-mono",children:o}),e.jsx("span",{children:_.toFixed(2)})]}),e.jsx("input",{type:"range",min:P,max:N,step:"0.1",value:_,onChange:A=>X(parseFloat(A.target.value)),className:"w-full accent-indigo-500"})]},o))}),e.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{className:"rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2",children:[e.jsx("p",{className:"text-xs text-blue-600 font-semibold",children:"KL(P‖Q) — Forward"}),e.jsxs("p",{className:"font-mono font-bold",children:[f.toFixed(5)," nats"]}),e.jsx("p",{className:"text-xs text-gray-500",children:"P covers Q"})]}),e.jsxs("div",{className:"rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2",children:[e.jsx("p",{className:"text-xs text-red-600 font-semibold",children:"KL(Q‖P) — Reverse"}),e.jsxs("p",{className:"font-mono font-bold",children:[g.toFixed(5)," nats"]}),e.jsx("p",{className:"text-xs text-gray-500",children:"Mode-seeking"})]})]})]})}function Ae(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(Ce,{}),e.jsx(w,{label:"Definition 7.2.1",title:"KL Divergence",definition:"For distributions $P$ and $Q$ over the same space, the KL divergence (relative entropy) is $D_{\\text{KL}}(P \\| Q) = \\sum_x p(x) \\log \\frac{p(x)}{q(x)}$ (discrete) or $D_{\\text{KL}}(P \\| Q) = \\int p(x) \\log \\frac{p(x)}{q(x)}\\,dx$ (continuous). Defined as $+\\infty$ if $q(x) = 0$ for some $x$ with $p(x) > 0$. By Gibbs' inequality: $D_{\\text{KL}}(P\\|Q) \\geq 0$, with equality iff $P = Q$ a.e. Note: $D_{\\text{KL}}(P\\|Q) \\neq D_{\\text{KL}}(Q\\|P)$ in general — KL is not a metric.",notation:"For $N(\\mu_1, \\sigma_1^2) \\| N(\\mu_2, \\sigma_2^2)$: $D_{\\text{KL}} = \\log(\\sigma_2/\\sigma_1) + (\\sigma_1^2 + (\\mu_1-\\mu_2)^2)/(2\\sigma_2^2) - 1/2$."}),e.jsx(w,{label:"Definition 7.2.2",title:"Forward vs Reverse KL",definition:"Forward KL $D_{\\text{KL}}(P \\| Q)$ (also called M-projection or inclusive KL): minimizing over $Q$ yields mass-covering behavior — $Q$ must have support wherever $P$ does. Reverse KL $D_{\\text{KL}}(Q \\| P)$ (I-projection or exclusive KL): minimizing over $Q$ yields mode-seeking behavior — $Q$ concentrates on a mode of $P$. In variational inference: ELBO maximization minimizes forward KL; expectation propagation minimizes reverse KL."}),e.jsx(S,{label:"Theorem 7.2.1",title:"Chain Rule and Mutual Information",statement:"Chain rule: $D_{\\text{KL}}(P(X,Y) \\| Q(X,Y)) = D_{\\text{KL}}(P(X) \\| Q(X)) + E_{P(X)}[D_{\\text{KL}}(P(Y|X) \\| Q(Y|X))]$. Mutual information: $I(X;Y) = D_{\\text{KL}}(P(X,Y) \\| P(X)P(Y)) = H(X) - H(X|Y) = H(Y) - H(Y|X)$. Mutual information measures how much knowing $Y$ reduces uncertainty about $X$.",proof:"$I(X;Y) = \\sum_{x,y} p(x,y) \\log \\frac{p(x,y)}{p(x)p(y)}$. Expand: $= \\sum_{x,y} p(x,y)\\log p(x,y) - \\sum_x p(x)\\log p(x) - \\sum_y p(y)\\log p(y)$ $= -H(X,Y) + H(X) + H(Y) = H(X) + H(Y) - H(X,Y)$."}),e.jsxs(q,{title:"KL in Variational Autoencoders",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["The VAE ELBO loss has a KL term penalizing the encoder posterior ",e.jsx(a.InlineMath,{math:"q_\\phi(z|x)"})," ","from drifting from the prior ",e.jsx(a.InlineMath,{math:"p(z) = N(0,I)"}),":"]}),e.jsx(a.BlockMath,{math:"\\mathcal{L} = E_{q_\\phi(z|x)}[\\log p_\\theta(x|z)] - D_{\\text{KL}}(q_\\phi(z|x) \\| p(z))"}),e.jsx(a.BlockMath,{math:"D_{\\text{KL}}(N(\\mu,\\sigma^2)\\|N(0,1)) = \\frac{1}{2}(\\mu^2 + \\sigma^2 - \\log\\sigma^2 - 1)"})]}),e.jsx(F,{title:"KL Divergence Is Not a Distance",children:e.jsxs("p",{children:["KL divergence violates the axioms of a metric: it is asymmetric and does not satisfy the triangle inequality. The Jensen-Shannon divergence ",e.jsx(a.InlineMath,{math:"\\text{JSD}(P\\|Q) = \\frac{1}{2}D_\\text{KL}(P\\|M) + \\frac{1}{2}D_\\text{KL}(Q\\|M)"})," ","(where ",e.jsx(a.InlineMath,{math:"M = (P+Q)/2"}),") is symmetric and bounded in ",e.jsx(a.InlineMath,{math:"[0, \\log 2]"}),","," ","and ",e.jsx(a.InlineMath,{math:"\\sqrt{\\text{JSD}}"})," is an actual metric. Wasserstein distance is another alternative that respects the geometry of the space — used in Wasserstein GANs."]})}),e.jsx(C,{title:"KL Divergence Computations",code:`import numpy as np
from scipy import stats

# ── KL between Gaussians (analytic) ──────────────────────────────────────
def kl_gaussians(mu1, sig1, mu2, sig2):
    """KL(N(mu1,sig1²) || N(mu2,sig2²))."""
    return np.log(sig2/sig1) + (sig1**2 + (mu1-mu2)**2)/(2*sig2**2) - 0.5

mu1, sig1 = 0.0, 1.0
mu2, sig2 = 2.0, 1.5
print(f"KL(N({mu1},{sig1}²) || N({mu2},{sig2}²)) = {kl_gaussians(mu1,sig1,mu2,sig2):.4f} nats")
print(f"KL(N({mu2},{sig2}²) || N({mu1},{sig1}²)) = {kl_gaussians(mu2,sig2,mu1,sig1):.4f} nats")
print("KL is asymmetric!")

# ── KL for VAE (diagonal Gaussian posterior) ──────────────────────────────
def kl_vae(mu, log_var):
    """KL(N(mu, exp(log_var)) || N(0,1)) per dimension."""
    return 0.5 * (mu**2 + np.exp(log_var) - log_var - 1)

mu_enc = np.array([0.5, -1.2, 0.3])
log_var_enc = np.array([-0.5, 0.2, -1.0])
kl_terms = kl_vae(mu_enc, log_var_enc)
print(f"\\nVAE KL terms: {kl_terms}")
print(f"Total KL: {kl_terms.sum():.4f}")

# ── Numerical KL via Monte Carlo ──────────────────────────────────────────
np.random.seed(42)
n = 100000
X = np.random.normal(mu1, sig1, n)
log_ratio = stats.norm(mu1, sig1).logpdf(X) - stats.norm(mu2, sig2).logpdf(X)
kl_mc = log_ratio.mean()
print(f"\\nMonte Carlo KL estimate: {kl_mc:.4f} (analytic: {kl_gaussians(mu1,sig1,mu2,sig2):.4f})")

# ── Mutual information ────────────────────────────────────────────────────
# For bivariate normal with correlation rho:
# I(X;Y) = -0.5 * log(1 - rho²)
for rho in [0.0, 0.3, 0.6, 0.9, 0.99]:
    mi = -0.5 * np.log(1 - rho**2)
    print(f"  I(X;Y) for rho={rho:.2f}: {mi:.4f} nats")`})]})}const at=Object.freeze(Object.defineProperty({__proto__:null,default:Ae},Symbol.toStringTag,{value:"Module"}));function Ee(){const[i,$]=M.useState(.3),[r,k]=M.useState(1),p=340,j=180,y=200,v=c=>Math.exp(-2*c*i*i/(4*r*r)),f=c=>Math.min(1,r*r/(c*i*i)),g=200,u=1,x=g,h=(c,m)=>({sx:(c-u)/(x-u)*(p-20)+10,sy:j-15-Math.max(0,Math.min(1,m))*(j-25)}),n=c=>Array.from({length:y},(t,d)=>{const l=1+d/(y-1)*(g-1);return h(l,c(l))}).map((t,d)=>`${d===0?"M":"L"}${t.sx.toFixed(1)},${t.sy.toFixed(1)}`).join(" ");return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Hoeffding vs Chebyshev Bound vs Sample Size"}),e.jsxs("p",{className:"mb-3 text-sm text-gray-500 dark:text-gray-400",children:[e.jsx(a.InlineMath,{math:"P(\\bar{X}_n - \\mu \\geq t)"})," upper bound. Blue = Hoeffding (exponential). Red = Chebyshev (polynomial)."]}),e.jsxs("svg",{width:p,height:j,className:"rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",children:[e.jsx("line",{x1:10,y1:j-15,x2:p-10,y2:j-15,stroke:"#9ca3af",strokeWidth:1}),e.jsx("path",{d:n(f),fill:"none",stroke:"#ef4444",strokeWidth:2,strokeDasharray:"6,3"}),e.jsx("path",{d:n(v),fill:"rgba(99,102,241,0.1)",stroke:"#6366f1",strokeWidth:2.5}),e.jsx("text",{x:p-15,y:20,fontSize:9,fill:"#6366f1",textAnchor:"end",children:"Hoeffding"}),e.jsx("text",{x:p-15,y:34,fontSize:9,fill:"#ef4444",textAnchor:"end",children:"Chebyshev"}),[1,50,100,150,200].map(c=>e.jsx("text",{x:h(c,0).sx,y:j-3,fontSize:8,fill:"#9ca3af",textAnchor:"middle",children:c},c))]}),e.jsx("div",{className:"mt-4 grid grid-cols-2 gap-3",children:[{l:"t (deviation)",v:i,s:$,min:.05,max:1.5,step:.05},{l:"b (half-range)",v:r,s:k,min:.2,max:3,step:.1}].map(({l:c,v:m,s:t,min:d,max:l,step:s})=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-1 flex justify-between text-xs",children:[e.jsx("span",{children:c}),e.jsx("span",{children:m.toFixed(2)})]}),e.jsx("input",{type:"range",min:d,max:l,step:s,value:m,onChange:o=>t(parseFloat(o.target.value)),className:"w-full accent-indigo-500"})]},c))}),e.jsxs("div",{className:"mt-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-sm",children:["At n=50: Hoeffding ≤ ",v(50).toFixed(6),", Chebyshev ≤ ",f(50).toFixed(4)]})]})}function Be(){return e.jsxs("div",{className:"space-y-8",children:[e.jsx(Ee,{}),e.jsx(w,{label:"Definition 8.2.1",title:"Sub-Gaussian Random Variables",definition:"A centered random variable $X$ (with $E[X]=0$) is sub-Gaussian with parameter $\\sigma^2$ if $E[e^{tX}] \\leq e^{\\sigma^2 t^2/2}$ for all $t \\in \\mathbb{R}$. Equivalently: the tail decays at least as fast as a Gaussian: $P(|X| \\geq t) \\leq 2e^{-t^2/(2\\sigma^2)}$. Examples: bounded r.v., Gaussian, Bernoulli (centered). The sub-Gaussian property is preserved under addition of independent sub-Gaussian variables.",notation:"Orlicz norm: $\\|X\\|_{\\psi_2} = \\inf\\{C > 0: E[e^{X^2/C^2}] \\leq 2\\}$. Sub-exponential: $E[e^{tX}] \\leq e^{\\nu^2 t^2/2}$ for $|t| \\leq 1/b$ (e.g., chi-squared, Poisson)."}),e.jsx(w,{label:"Definition 8.2.2",title:"Concentration Inequalities",definition:"Concentration inequalities bound the probability that a random variable deviates significantly from its mean. Markov: $P(X \\geq t) \\leq E[X]/t$ (non-negative $X$). Chebyshev: $P(|X-\\mu| \\geq t) \\leq \\sigma^2/t^2$ (polynomial tail). Chernoff: $P(X \\geq t) \\leq \\inf_{s>0} e^{-st} M_X(s)$ (exponential tail). Hoeffding: explicit exponential bound for bounded random variables (no variance needed)."}),e.jsx(S,{label:"Theorem 8.2.1",title:"Hoeffding's Inequality",statement:"Let $X_1, \\ldots, X_n$ be independent with $X_i \\in [a_i, b_i]$ and $E[X_i] = \\mu_i$. Then for any $t > 0$: $P\\!\\left(\\sum_{i=1}^n (X_i - \\mu_i) \\geq t\\right) \\leq \\exp\\!\\left(-\\frac{2t^2}{\\sum_{i=1}^n (b_i - a_i)^2}\\right)$. For i.i.d. $X_i \\in [a,b]$: $P(\\bar{X}_n - \\mu \\geq t) \\leq e^{-2nt^2/(b-a)^2}$.",proof:"Apply the Chernoff bound: for any $s > 0$, $P(S_n \\geq t) \\leq e^{-st} \\prod_i E[e^{s(X_i-\\mu_i)}]$. Hoeffding's lemma: for $X \\in [a,b]$ centered, $E[e^{sX}] \\leq e^{s^2(b-a)^2/8}$. Substitute and optimize over $s$: $s^* = 4t/\\sum(b_i-a_i)^2$.",corollaries:["Bernstein's inequality: sharper for sub-exponential variables using variance: P(|X̄-μ|≥t) ≤ 2exp(-nt²/(2σ²+2bt/3)).","McDiarmid's inequality (bounded differences): for functions satisfying the bounded differences condition, analogous exponential bound holds."]}),e.jsxs(q,{title:"PAC Learning Sample Complexity",children:[e.jsxs("p",{className:"mb-2 text-gray-700 dark:text-gray-300",children:["To guarantee that the empirical error is within ",e.jsx(a.InlineMath,{math:"\\varepsilon"})," of true error with probability at least ",e.jsx(a.InlineMath,{math:"1-\\delta"}),", Hoeffding gives:"]}),e.jsx(a.BlockMath,{math:"P(|\\hat{R}(h) - R(h)| \\geq \\varepsilon) \\leq 2e^{-2n\\varepsilon^2} \\leq \\delta \\implies n \\geq \\frac{\\log(2/\\delta)}{2\\varepsilon^2}"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:["For ",e.jsx(a.InlineMath,{math:"\\varepsilon = 0.05, \\delta = 0.05"}),": need ",e.jsx(a.InlineMath,{math:"n \\geq 738"})," samples."]})]}),e.jsx(F,{title:"Hoeffding Ignores Variance — Bernstein Can Be Sharper",children:e.jsxs("p",{children:["Hoeffding's bound depends only on the range ",e.jsx(a.InlineMath,{math:"[a,b]"}),", not on the variance. If ",e.jsx(a.InlineMath,{math:"\\sigma^2 \\ll (b-a)^2/4"})," (e.g., near-deterministic variables), Bernstein's inequality gives exponentially tighter bounds. For example, a Bernoulli(",e.jsx(a.InlineMath,{math:"p"}),") variable with small ",e.jsx(a.InlineMath,{math:"p"})," has range 1 but variance ",e.jsx(a.InlineMath,{math:"p(1-p) \\approx p"}),". Hoeffding gives ",e.jsx(a.InlineMath,{math:"e^{-2nt^2}"})," while Bernstein gives roughly"," ",e.jsx(a.InlineMath,{math:"e^{-nt^2/(2p)}"})," — much tighter when ",e.jsx(a.InlineMath,{math:"p \\ll 1"}),"."]})}),e.jsx(C,{title:"Concentration Inequalities",code:`import numpy as np
from scipy import stats

# ── Hoeffding's inequality ────────────────────────────────────────────────
def hoeffding_bound(t, n, a=0, b=1):
    """P(X_bar - mu >= t) <= exp(-2 n t^2 / (b-a)^2)."""
    return np.exp(-2 * n * t**2 / (b - a)**2)

print("Hoeffding bound vs sample size (t=0.1, X in [0,1]):")
for n in [50, 100, 200, 500, 1000]:
    bound = hoeffding_bound(0.1, n)
    print(f"  n={n:4d}: exp(-{2*n*0.01:.0f}) = {bound:.6f}")

# PAC sample complexity
def pac_sample_size(epsilon, delta):
    return int(np.ceil(np.log(2/delta) / (2*epsilon**2)))

print(f"\\nPAC sample complexity (Hoeffding):")
for eps, dlt in [(0.1, 0.1), (0.05, 0.05), (0.01, 0.01)]:
    n = pac_sample_size(eps, dlt)
    print(f"  ε={eps}, δ={dlt}: n ≥ {n}")

# ── Empirical validation ──────────────────────────────────────────────────
np.random.seed(42)
n, t, n_trials = 100, 0.1, 50000
# X_i ~ Uniform(0,1), mu=0.5
data = np.random.uniform(0, 1, (n_trials, n))
sample_means = data.mean(axis=1)
empirical_prob = np.mean(sample_means - 0.5 >= t)
bound = hoeffding_bound(t, n)
print(f"\\nHoeffding validation (n={n}, t={t}):")
print(f"  Empirical P(X̄ - 0.5 ≥ {t}) = {empirical_prob:.6f}")
print(f"  Hoeffding bound:              {bound:.6f}")
print(f"  Bound is valid: {bound >= empirical_prob}")

# ── Bernstein vs Hoeffding ────────────────────────────────────────────────
def bernstein_bound(t, n, sigma2, b):
    """Bernstein: P(X̄ - mu ≥ t) ≤ exp(-n t²/(2σ² + 2bt/3))."""
    return np.exp(-n * t**2 / (2*sigma2 + 2*b*t/3))

# Bernoulli(p=0.05) has sigma²=p(1-p)≈0.0475, b=1
p = 0.05
sigma2 = p * (1 - p)
t_test = 0.05
for n in [100, 500, 1000]:
    h = hoeffding_bound(t_test, n)
    bern = bernstein_bound(t_test, n, sigma2, b=1)
    print(f"  n={n}: Hoeffding={h:.4f}, Bernstein={bern:.4f} (sharper by {h/bern:.1f}x)")`})]})}const nt=Object.freeze(Object.defineProperty({__proto__:null,default:Be},Symbol.toStringTag,{value:"Module"}));export{He as a,Ge as b,Ke as c,We as d,Oe as e,Ve as f,Re as g,Ue as h,Qe as i,Ze as j,Je as k,et as l,tt as m,at as n,nt as o,ze as s};
