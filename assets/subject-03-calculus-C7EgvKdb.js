import{j as e,r as $}from"./vendor-ev-Lg3zu.js";import{r as a}from"./vendor-katex-B0wz5_gp.js";import{N as w,D as b,T as v,E as N,W as I,P as S,R as M}from"./subject-02-linear-algebra-DppwNOPn.js";import"./vendor-router-BdEKCYC4.js";import"./vendor-mafs-DU9-7j9o.js";const h=480,p=340,u=-2.5,y=2.5,g=-.3,j=6.5;function r(t){return(t-u)/(y-u)*h}function s(t){return p-(t-g)/(j-g)*p}function D(t=200){const n=[];for(let x=0;x<=t;x++){const o=u+x/t*(y-u),l=o*o;n.push(`${r(o).toFixed(2)},${s(l).toFixed(2)}`)}return n.join(" ")}function k(t,n){return 2*n*t-n*n}function T(t){const n=u,x=y,o=k(n,t),l=k(x,t),d=m=>Math.max(g-.5,Math.min(j+.5,m));return`${r(n).toFixed(2)},${s(d(o)).toFixed(2)} ${r(x).toFixed(2)},${s(d(l)).toFixed(2)}`}function F(){const[t,n]=$.useState(1),x=2*t,o=t*t,l=r(t),d=s(o),m=$.useMemo(()=>D(),[]),_=T(t),c=r(0),f=s(0);return e.jsxs("div",{className:"my-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-900",children:[e.jsxs("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-100",children:["Interactive: Tangent Line to ",e.jsx(a.InlineMath,{math:"f(x) = x^2"})]}),e.jsxs("p",{className:"mb-4 text-xs text-gray-500 dark:text-gray-400",children:["Drag the slider to move the point along the parabola. The red tangent line has slope"," ",e.jsx(a.InlineMath,{math:"f'(x_0) = 2x_0"}),"."]}),e.jsx("div",{className:"overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-700",children:e.jsxs("svg",{viewBox:`0 0 ${h} ${p}`,width:"100%",style:{display:"block"},children:[[-2,-1,0,1,2].map(i=>e.jsx("line",{x1:r(i),y1:0,x2:r(i),y2:p,stroke:"#374151",strokeWidth:.6,strokeDasharray:"3 4"},`vg${i}`)),[0,1,2,3,4,5,6].map(i=>e.jsx("line",{x1:0,y1:s(i),x2:h,y2:s(i),stroke:"#374151",strokeWidth:.6,strokeDasharray:"3 4"},`hg${i}`)),e.jsx("line",{x1:c,y1:0,x2:c,y2:p,stroke:"#6b7280",strokeWidth:1.5}),e.jsx("line",{x1:0,y1:f,x2:h,y2:f,stroke:"#6b7280",strokeWidth:1.5}),e.jsx("text",{x:h-14,y:f-6,fill:"#9ca3af",fontSize:"12",fontFamily:"serif",fontStyle:"italic",children:"x"}),e.jsx("text",{x:c+6,y:12,fill:"#9ca3af",fontSize:"12",fontFamily:"serif",fontStyle:"italic",children:"y"}),[-2,-1,1,2].map(i=>e.jsxs("g",{children:[e.jsx("line",{x1:r(i),y1:f-4,x2:r(i),y2:f+4,stroke:"#6b7280",strokeWidth:1}),e.jsx("text",{x:r(i)-4,y:f+15,fill:"#6b7280",fontSize:"10",fontFamily:"monospace",children:i})]},`xt${i}`)),[1,2,3,4,5].map(i=>e.jsxs("g",{children:[e.jsx("line",{x1:c-4,y1:s(i),x2:c+4,y2:s(i),stroke:"#6b7280",strokeWidth:1}),e.jsx("text",{x:c-20,y:s(i)+4,fill:"#6b7280",fontSize:"10",fontFamily:"monospace",children:i})]},`yt${i}`)),e.jsx("polyline",{points:m,fill:"none",stroke:"#818cf8",strokeWidth:2.5,strokeLinejoin:"round"}),e.jsx("text",{x:r(1.65),y:s(3.2),fill:"#818cf8",fontSize:"12",fontFamily:"serif",fontStyle:"italic",children:"y = x²"}),e.jsx("polyline",{points:_,fill:"none",stroke:"#f87171",strokeWidth:2,strokeDasharray:"6 3",strokeOpacity:.9}),e.jsx("line",{x1:l,y1:d,x2:l,y2:f,stroke:"#34d399",strokeWidth:1,strokeDasharray:"4 3",strokeOpacity:.6}),e.jsx("line",{x1:l,y1:d,x2:c,y2:d,stroke:"#34d399",strokeWidth:1,strokeDasharray:"4 3",strokeOpacity:.6}),e.jsx("circle",{cx:l,cy:d,r:7,fill:"#34d399",stroke:"#fff",strokeWidth:2}),e.jsxs("text",{x:l+10,y:d-8,fill:"#34d399",fontSize:"11",fontFamily:"monospace",children:["(",t.toFixed(2),", ",o.toFixed(2),")"]})]})}),e.jsxs("div",{className:"mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap",children:["Point ",e.jsx(a.InlineMath,{math:"x_0"})]}),e.jsx("input",{type:"range",min:-2,max:2,step:.05,value:t,onChange:i=>n(parseFloat(i.target.value)),className:"w-40 accent-indigo-500"}),e.jsx("span",{className:"w-14 rounded-md bg-indigo-100 px-2 py-0.5 text-center text-xs font-mono font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",children:t.toFixed(2)})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("div",{className:"rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-800",children:[e.jsxs("span",{className:"text-gray-500 dark:text-gray-400",children:[e.jsx(a.InlineMath,{math:"f(x_0)"}),":"," "]}),e.jsx("span",{className:"font-bold text-gray-800 dark:text-gray-100",children:o.toFixed(4)})]}),e.jsxs("div",{className:"rounded-lg bg-red-100 px-3 py-1.5 text-xs dark:bg-red-900/30",children:[e.jsxs("span",{className:"text-red-600 dark:text-red-400",children:["Slope ",e.jsx(a.InlineMath,{math:"f'(x_0) = 2x_0"}),":"," "]}),e.jsx("span",{className:"font-bold text-red-700 dark:text-red-300",children:x.toFixed(4)})]}),Math.abs(t)<.05&&e.jsx("div",{className:"rounded-lg bg-purple-100 px-3 py-1.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",children:"At the minimum! Slope = 0"})]})]}),e.jsxs("p",{className:"mt-3 text-xs text-gray-500 dark:text-gray-400",children:["Observe: the tangent line becomes horizontal at ",e.jsx(a.InlineMath,{math:"x_0 = 0"})," (the minimum). For ",e.jsx(a.InlineMath,{math:"x_0 > 0"})," the slope is positive; for"," ",e.jsx(a.InlineMath,{math:"x_0 < 0"})," it is negative."]})]})}const C=`import numpy as np
import sympy as sp
import matplotlib.pyplot as plt

# ── 1. Numerical differentiation with finite differences ──────────────────────
def numerical_derivative(f, x, h=1e-5):
    """Central difference formula: (f(x+h) - f(x-h)) / (2h)"""
    return (f(x + h) - f(x - h)) / (2 * h)

def forward_difference(f, x, h=1e-5):
    """Forward difference: (f(x+h) - f(x)) / h  — O(h) accuracy"""
    return (f(x + h) - f(x)) / h

# Test function: f(x) = x^3 * sin(x)
def f(x):
    return x**3 * np.sin(x)

# Analytical derivative via product rule: f'(x) = 3x^2 sin(x) + x^3 cos(x)
def f_prime_exact(x):
    return 3 * x**2 * np.sin(x) + x**3 * np.cos(x)

# Compare at several test points
test_points = [0.5, 1.0, 1.5, 2.0, np.pi/4]
print("Numerical vs Analytical Derivatives of f(x) = x^3 * sin(x)")
print(f"{'x':>8} | {'Numerical (central)':>22} | {'Analytical':>12} | {'Error':>12}")
print("-" * 65)
for x in test_points:
    num = numerical_derivative(f, x)
    exact = f_prime_exact(x)
    error = abs(num - exact)
    print(f"{x:>8.4f} | {num:>22.10f} | {exact:>12.10f} | {error:>12.2e}")

# ── 2. Effect of step size h on accuracy ─────────────────────────────────────
x_test = 1.0
exact = f_prime_exact(x_test)
print("\\nStep size analysis at x=1.0:")
for h in [1e-1, 1e-2, 1e-4, 1e-6, 1e-8, 1e-10, 1e-14]:
    central = (f(x_test + h) - f(x_test - h)) / (2 * h)
    forward = (f(x_test + h) - f(x_test)) / h
    print(f"h={h:.0e}: central error={abs(central-exact):.2e}, forward error={abs(forward-exact):.2e}")

# ── 3. Symbolic differentiation with SymPy ───────────────────────────────────
x = sp.Symbol('x')

# Define functions symbolically
f_sym = x**3 * sp.sin(x)
g_sym = sp.exp(-x**2) * sp.cos(3*x)
h_sym = sp.ln(x**2 + 1) / (x**2 + 1)

print("\\nSymbolic Derivatives (SymPy):")
for name, expr in [('x^3 sin(x)', f_sym), ('e^{-x^2} cos(3x)', g_sym), ('ln(x^2+1)/(x^2+1)', h_sym)]:
    deriv = sp.diff(expr, x)
    simplified = sp.simplify(deriv)
    print(f"  d/dx [{name}] = {simplified}")

# ── 4. Chain rule: derivative of composite functions ─────────────────────────
# f(g(x)) where f(u) = u^3, g(x) = sin(x)
# f'(g(x)) * g'(x) = 3*sin^2(x)*cos(x)
u = sp.Symbol('u')
f_outer = u**3
g_inner = sp.sin(x)
composite = f_outer.subs(u, g_inner)
deriv_chain = sp.diff(composite, x)
print(f"\\nChain rule: d/dx [sin^3(x)] = {sp.simplify(deriv_chain)}")

# ── 5. Higher-order derivatives ───────────────────────────────────────────────
f_sym2 = x**5 - 3*x**3 + x
print("\\nHigher-order derivatives of f(x) = x^5 - 3x^3 + x:")
for n in range(1, 6):
    dn = sp.diff(f_sym2, x, n)
    print(f"  f^({n})(x) = {dn}")

# ── 6. Visualise tangent lines ────────────────────────────────────────────────
xs = np.linspace(-2, 2, 400)
ys = xs**2

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(xs, ys, 'b-', linewidth=2.5, label=r'$f(x) = x^2$')

for x0, color in zip([-1.5, -0.5, 0.5, 1.5], ['red', 'green', 'orange', 'purple']):
    slope = 2 * x0
    y0 = x0**2
    tangent = slope * (xs - x0) + y0
    ax.plot(xs, tangent, '--', color=color, linewidth=1.5,
            label=rf"Tangent at $x_0={x0}$, slope={slope}")
    ax.scatter([x0], [y0], color=color, s=60, zorder=5)

ax.set_xlim(-2.2, 2.2); ax.set_ylim(-0.5, 5)
ax.set_xlabel('x'); ax.set_ylabel('y')
ax.set_title('Tangent Lines to $f(x) = x^2$')
ax.legend(fontsize=8); ax.grid(True, alpha=0.3)
plt.tight_layout(); plt.show()
`,L=[{authors:"Newton, I.",year:1687,title:"Philosophiæ Naturalis Principia Mathematica",venue:"Royal Society, London",type:"foundational",whyImportant:"Newton developed the method of fluxions (calculus) as a tool for mechanics. His notation and the priority dispute with Leibniz shaped the development of analysis."},{authors:"Leibniz, G. W.",year:1684,title:"Nova Methodus pro Maximis et Minimis",venue:"Acta Eruditorum",type:"foundational",whyImportant:"Leibniz's independent discovery of calculus gave us the dy/dx notation still used today, as well as the product and chain rules in explicit form."},{authors:"Cauchy, A.-L.",year:1821,title:"Cours d'Analyse",venue:"École Polytechnique, Paris",type:"foundational",whyImportant:"Cauchy placed calculus on rigorous footing using the epsilon-delta definition of limits, giving the derivative its modern precise meaning."},{authors:"Spivak, M.",year:2008,title:"Calculus (4th ed.)",venue:"Publish or Perish",type:"textbook",whyImportant:"The gold-standard rigorous calculus textbook, presenting limits, derivatives, and integrals with complete proofs accessible to undergraduates."},{authors:"Goodfellow, I., Bengio, Y., & Courville, A.",year:2016,title:"Deep Learning",venue:"MIT Press",url:"https://www.deeplearningbook.org",type:"textbook",whyImportant:"Chapter 6 covers the chain rule and its application to backpropagation — the connection between calculus derivatives and neural network training."}];function A(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-6 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400",children:"Chapter 2 · Differentiation"}),e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50",children:"§1 — Derivatives & Differentiation Rules"}),e.jsx("p",{className:"mt-2 text-base text-gray-600 dark:text-gray-400",children:"The derivative measures instantaneous rate of change — and underpins everything from classical mechanics to the backpropagation algorithm powering modern deep learning."})]}),e.jsx(w,{type:"historical",title:"Historical Context — The Calculus War",children:e.jsxs("p",{children:["In the late 17th century, two mathematical giants independently invented calculus."," ",e.jsx("strong",{children:"Isaac Newton"}),' developed his "method of fluxions" around 1666 to solve problems in mechanics and optics, but published late. ',e.jsx("strong",{children:"Gottfried Wilhelm Leibniz"})," independently developed calculus by 1675 and published first in 1684, giving us the ",e.jsx("em",{children:"dy/dx"})," notation and the integral sign"," ",e.jsx(a.InlineMath,{math:"\\int"})," still in use today. The ensuing"," ",e.jsx("strong",{children:"priority dispute"})," — which degenerated into a bitter nationalistic controversy — divided European mathematics for generations. The verdict of history: both invented calculus independently, but Leibniz's notation won, and"," ",e.jsx("strong",{children:"Cauchy"})," (1821) gave the derivative its rigorous epsilon-delta foundation."]})}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-bold text-gray-800 dark:text-gray-100",children:"Intuition: Slope of the Tangent Line"}),e.jsxs("p",{className:"mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300",children:["The derivative answers: ",e.jsxs("em",{children:["how fast is ",e.jsx(a.InlineMath,{math:"f(x)"})," changing at the point ",e.jsx(a.InlineMath,{math:"x"}),"?"]})," Geometrically, it is the slope of the"," ",e.jsx("strong",{children:"tangent line"})," to the graph. We approximate this by the slope of a secant line through two nearby points and let the gap shrink to zero:"]}),e.jsx(a.BlockMath,{math:"\\text{secant slope} = \\frac{f(x+h) - f(x)}{h} \\xrightarrow{h \\to 0} f'(x)"})]}),e.jsx(F,{}),e.jsx(b,{label:"Definition 2.1",title:"The Derivative",definition:"Let $f : \\mathbb{R} \\to \\mathbb{R}$ be a function. The derivative of $f$ at $x$, denoted $f'(x)$ or $\\dfrac{df}{dx}$, is defined by the limit $f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$ provided this limit exists. When it does, $f$ is called differentiable at $x$. If $f$ is differentiable at every point in its domain, $f$ is called differentiable.",notation:"Alternative notations: $f'(x)$, $\\dfrac{df}{dx}$, $Df(x)$, $\\dot{f}$ (Newton's fluxion notation for time derivatives)."}),e.jsx(v,{label:"Theorem 2.1",title:"Differentiation Rules",statement:`Let $f$ and $g$ be differentiable functions and $c \\in \\mathbb{R}$ a constant. Then:
(1) Constant: $(c)' = 0$.
(2) Power: $(x^n)' = nx^{n-1}$ for $n \\in \\mathbb{R}$.
(3) Sum: $(f + g)' = f' + g'$.
(4) Constant multiple: $(cf)' = c f'$.
(5) Product rule: $(fg)' = f'g + fg'$.
(6) Quotient rule: $\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f'g - fg'}{g^2}$ (where $g \\neq 0$).
(7) Chain rule: $(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$.`,proof:`We prove the Product Rule from the limit definition. Let $F(x) = f(x)g(x)$. Then:
$F'(x) = \\lim_{h\\to 0} \\frac{f(x+h)g(x+h) - f(x)g(x)}{h}$.
Add and subtract $f(x)g(x+h)$ in the numerator:
$= \\lim_{h\\to 0} \\frac{[f(x+h)-f(x)]g(x+h) + f(x)[g(x+h)-g(x)]}{h}$.
Split the limit (valid since both pieces converge):
$= \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}\\cdot\\lim_{h\\to 0}g(x+h) + f(x)\\cdot\\lim_{h\\to 0}\\frac{g(x+h)-g(x)}{h}$.
Since $g$ is differentiable it is continuous, so $\\lim_{h\\to 0}g(x+h)=g(x)$. Hence $F'(x) = f'(x)g(x) + f(x)g'(x)$. $\\square$`,corollaries:["The product rule generalises: $(f_1 f_2 \\cdots f_n)' = \\sum_{k=1}^n f_k' \\prod_{j \\neq k} f_j$.","The quotient rule follows from the product rule applied to $f \\cdot g^{-1}$ combined with the chain rule."]}),e.jsx(b,{label:"Definition 2.2",title:"Higher-Order Derivatives",definition:"The $n$-th derivative of $f$, denoted $f^{(n)}(x)$ or $\\dfrac{d^n f}{dx^n}$, is defined recursively: $f^{(0)} = f$, $f^{(1)} = f'$, and $f^{(n)} = (f^{(n-1)})'$ for $n \\geq 2$. The second derivative $f''(x)$ measures the rate of change of the slope — i.e., the concavity of $f$.",notation:"$f''(x) > 0$: concave up (like a bowl). $f''(x) < 0$: concave down (like a hill). $f''(x) = 0$ at inflection points."}),e.jsx(N,{title:"Differentiating f(x) = x³·sin(x) using the Product Rule",difficulty:"intermediate",problem:"Find the derivative of $f(x) = x^3 \\sin(x)$ and evaluate $f'(\\pi/2)$.",solution:[{step:"Identify the two factors",formula:"u(x) = x^3, quad v(x) = sin(x)",explanation:"We apply the product rule $(uv)^prime = u^prime v + u v^prime$."},{step:"Compute the individual derivatives",formula:"u'(x) = 3x^2 \\quad \\text{(power rule)}, \\qquad v'(x) = \\cos(x)",explanation:"Standard derivatives: power rule for $x^3$, known derivative of sine."},{step:"Apply the product rule",formula:"f'(x) = u'(x)v(x) + u(x)v'(x) = 3x^2 \\sin(x) + x^3 \\cos(x)",explanation:"Substituting into $(uv)' = u'v + uv'$."},{step:"Factor the result (optional)",formula:"f'(x) = x^2\\bigl(3\\sin(x) + x\\cos(x)\\bigr)",explanation:"Factor out $x^2$ for a cleaner form. This is the final answer."},{step:"Evaluate at $x = \\pi/2$",formula:"f'\\!\\left(\\frac{\\pi}{2}\\right) = \\left(\\frac{\\pi}{2}\\right)^{\\!2}\\!\\left(3\\sin\\frac{\\pi}{2} + \\frac{\\pi}{2}\\cos\\frac{\\pi}{2}\\right) = \\frac{\\pi^2}{4}\\left(3 \\cdot 1 + \\frac{\\pi}{2} \\cdot 0\\right) = \\frac{3\\pi^2}{4}",explanation:"Using $\\sin(\\pi/2) = 1$ and $\\cos(\\pi/2) = 0$. Final answer: $f'(\\pi/2) = 3\\pi^2/4 \\approx 7.402$."}]}),e.jsx(I,{title:"Common Derivative Mistakes",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 font-semibold text-gray-800 dark:text-gray-100",children:"1. Derivative of a product ≠ product of derivatives"}),e.jsxs("div",{className:"rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-900/20",children:[e.jsx(a.BlockMath,{math:"\\underbrace{(fg)'}_{\\text{correct}} = f'g + fg' \\qquad \\underbrace{(fg)' \\neq f' \\cdot g'}_{\\text{WRONG}}"}),e.jsxs("p",{className:"mt-1 text-xs text-gray-700 dark:text-gray-300",children:["Counterexample: ",e.jsx(a.InlineMath,{math:"f = g = x"}),". Left: ",e.jsx(a.InlineMath,{math:"(x^2)' = 2x"}),". Right (wrong): ",e.jsx(a.InlineMath,{math:"1 \\cdot 1 = 1 \\neq 2x"}),"."]})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 font-semibold text-gray-800 dark:text-gray-100",children:"2. Forgetting the chain rule for composite functions"}),e.jsxs("div",{className:"rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-900/20",children:[e.jsx(a.BlockMath,{math:"\\frac{d}{dx}\\sin(x^2) = \\cos(x^2) \\cdot 2x \\quad \\text{NOT} \\quad \\cos(x^2)"}),e.jsx("p",{className:"mt-1 text-xs text-gray-700 dark:text-gray-300",children:"Always multiply by the derivative of the inner function."})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 font-semibold text-gray-800 dark:text-gray-100",children:"3. Differentiating at a point of non-differentiability"}),e.jsxs("p",{className:"text-xs text-gray-700 dark:text-gray-300",children:[e.jsx(a.InlineMath,{math:"|x|"})," is not differentiable at ",e.jsx(a.InlineMath,{math:"x = 0"}),"(the left and right limits of the difference quotient differ). In neural networks, ReLU ",e.jsx(a.InlineMath,{math:"= \\max(0, x)"})," has a subgradient at 0, handled by subgradient methods."]})]})]})}),e.jsx(v,{label:"Theorem 2.2",title:"Chain Rule — Foundation of Backpropagation",statement:"If $g$ is differentiable at $x$ and $f$ is differentiable at $g(x)$, then the composite function $h = f \\circ g$ is differentiable at $x$ and $h'(x) = f'(g(x)) \\cdot g'(x).$ In Leibniz notation: $\\dfrac{dh}{dx} = \\dfrac{df}{dg} \\cdot \\dfrac{dg}{dx}.$ For a chain $y = f_n \\circ f_{n-1} \\circ \\cdots \\circ f_1(x)$: $\\dfrac{dy}{dx} = \\dfrac{\\partial f_n}{\\partial f_{n-1}} \\cdot \\dfrac{\\partial f_{n-1}}{\\partial f_{n-2}} \\cdots \\dfrac{\\partial f_1}{\\partial x}.$",proof:`Let $u = g(x)$ and define $\\epsilon(k) = \\frac{f(u+k) - f(u)}{k} - f'(u)$ for $k \\neq 0$, with $\\epsilon(0) = 0$. By differentiability of $f$, $\\lim_{k\\to 0}\\epsilon(k) = 0$, so $f(u+k) - f(u) = [f'(u) + \\epsilon(k)]k$. Setting $k = g(x+h) - g(x)$:
$\\frac{h(x+h)-h(x)}{h} = \\frac{f(g(x+h))-f(g(x))}{h} = [f'(g(x)) + \\epsilon(k)] \\cdot \\frac{g(x+h)-g(x)}{h}$.
As $h \\to 0$: $k \\to 0$ (since $g$ is continuous), so $\\epsilon(k) \\to 0$, and $\\frac{g(x+h)-g(x)}{h} \\to g'(x)$. Therefore $h'(x) = f'(g(x)) \\cdot g'(x)$. $\\square$`,corollaries:["Backpropagation in neural networks is precisely the chain rule applied recursively through layers: $\\frac{\\partial L}{\\partial w_k} = \\frac{\\partial L}{\\partial a_n} \\cdot \\frac{\\partial a_n}{\\partial a_{n-1}} \\cdots \\frac{\\partial a_{k+1}}{\\partial a_k} \\cdot \\frac{\\partial a_k}{\\partial w_k}$.","In multiple dimensions, the chain rule becomes the Jacobian product: $D(f \\circ g)(x) = Df(g(x)) \\cdot Dg(x)$.","Automatic differentiation (autograd in PyTorch/JAX) implements the chain rule exactly via a computation graph."]}),e.jsx(S,{code:C,title:"Numerical & Symbolic Differentiation — NumPy & SymPy",runnable:!0}),e.jsx(M,{references:L})]})}export{A as default};
