import{j as e,r as $}from"./vendor-JIDYfPag.js";import{r as T}from"./vendor-katex-Pf_QKVW_.js";import{N as R,D as N,T as S,E as M,W as C,P as W,R as le}from"./subject-01-foundations-Du8YIVsd.js";import{S as de,E as ce}from"./subject-02-linear-algebra-V1nMoh9O.js";function he(){const[t,b]=$.useState([3,4,4,2]),[o,_]=$.useState(null),m=480,x=280,a=[60,180,300,420],s=6,l=t.map((d,i)=>{const f=Math.min(d,s),p=x/(f+1);return Array.from({length:f},(n,r)=>({x:a[i],y:p*(r+1),isEllipsis:r===s-1&&d>s}))}),h=["Input","Hidden 1","Hidden 2","Output"],u=["#94a3b8","#818cf8","#818cf8","#f87171"];return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"MLP Architecture Visualizer"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Adjust layer dimensions to see the network structure. Hover over edges to highlight them."}),e.jsx("div",{className:"flex flex-wrap gap-4 mb-5",children:t.map((d,i)=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("label",{className:"text-xs text-gray-500 dark:text-gray-400",children:h[i]}),e.jsx("input",{type:"number",min:1,max:8,value:d,onChange:f=>{const p=Math.max(1,Math.min(8,parseInt(f.target.value)||1));b(t.map((n,r)=>r===i?p:n))},className:"w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"})]},i))}),e.jsxs("svg",{width:m,height:x,className:"mx-auto block",children:[l.slice(0,-1).map((d,i)=>d.map((f,p)=>l[i+1].map((n,r)=>{const j=`${i}-${p}-${r}`,c=o===j;return e.jsx("line",{x1:f.x+12,y1:f.y,x2:n.x-12,y2:n.y,stroke:c?"#6366f1":"#e5e7eb",strokeWidth:c?1.5:.8,onMouseEnter:()=>_(j),onMouseLeave:()=>_(null),className:"cursor-pointer dark:stroke-gray-700"},j)}))),l.map((d,i)=>d.map((f,p)=>e.jsxs("g",{children:[e.jsx("circle",{cx:f.x,cy:f.y,r:12,fill:f.isEllipsis?"none":u[i],stroke:f.isEllipsis?u[i]:"none",strokeWidth:1.5}),f.isEllipsis&&e.jsx("text",{x:f.x,y:f.y+4,textAnchor:"middle",fontSize:12,fill:u[i],children:"⋮"})]},`${i}-${p}`))),t.map((d,i)=>e.jsxs("g",{children:[e.jsx("text",{x:a[i],y:x-8,textAnchor:"middle",fontSize:11,fill:"#6b7280",className:"dark:fill-gray-400",children:h[i]}),e.jsxs("text",{x:a[i],y:x-22,textAnchor:"middle",fontSize:10,fill:"#9ca3af",className:"dark:fill-gray-500",children:["d=",d]})]},`lbl-${i}`))]}),e.jsxs("div",{className:"mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400",children:[e.jsxs("span",{children:["Parameters: W₁(",t[0],"×",t[1],") + b₁(",t[1],") + W₂(",t[1],"×",t[2],") + b₂(",t[2],") + W₃(",t[2],"×",t[3],") + b₃(",t[3],")"]}),e.jsxs("span",{className:"font-bold text-indigo-600 dark:text-indigo-400",children:["= ",t[0]*t[1]+t[1]+t[1]*t[2]+t[2]+t[2]*t[3]+t[3]," parameters"]})]})]})}const me=`import torch
import torch.nn as nn
import torch.nn.functional as F

# ── MLP from scratch using nn.Linear ─────────────────────────────────────────
class MLP(nn.Module):
    def __init__(self, layer_dims, activation=nn.ReLU, dropout=0.0):
        super().__init__()
        layers = []
        for i in range(len(layer_dims) - 1):
            layers.append(nn.Linear(layer_dims[i], layer_dims[i+1]))
            if i < len(layer_dims) - 2:  # No activation after last layer
                layers.append(activation())
                if dropout > 0:
                    layers.append(nn.Dropout(dropout))
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

# Example: 3 → 64 → 64 → 2 classifier
model = MLP([3, 64, 64, 2], activation=nn.ReLU, dropout=0.2)

# ── Inspect the network ───────────────────────────────────────────────────────
x = torch.randn(32, 3)  # batch of 32, input dim 3
out = model(x)
print(f"Input: {x.shape}")
print(f"Output: {out.shape}")

# Count parameters
total = sum(p.numel() for p in model.parameters())
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Total parameters: {total:,}")
print(f"Trainable: {trainable:,}")

# ── Forward pass manually ─────────────────────────────────────────────────────
import numpy as np

def forward_pass(x, weights_biases):
    """Manual forward pass through MLP layers."""
    h = x
    for W, b in weights_biases[:-1]:
        h = np.maximum(0, h @ W.T + b)  # ReLU activation
    W, b = weights_biases[-1]
    return h @ W.T + b  # No activation on last layer

# Verify against PyTorch
W1 = model.net[0].weight.detach().numpy()
b1 = model.net[0].bias.detach().numpy()
W2 = model.net[2].weight.detach().numpy()
b2 = model.net[2].bias.detach().numpy()
W3 = model.net[4].weight.detach().numpy()
b3 = model.net[4].bias.detach().numpy()

x_np = x.numpy()
manual_out = forward_pass(x_np, [(W1,b1),(W2,b2),(W3,b3)])
torch_out  = model(x).detach().numpy()
# Note: dropout makes exact match impossible; disable for verification:
model.eval()
torch_out = model(x).detach().numpy()
print(f"Max diff (eval mode): {np.abs(manual_out - torch_out).max():.6f}")
`;function pe(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"MLP Architecture"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"The multilayer perceptron — layers, weights, biases, and the forward pass computation that underlies all deep learning."})]}),e.jsx(R,{title:"Historical Note",children:e.jsx("p",{children:'The perceptron was introduced by Rosenblatt (1958) as a single-layer model for binary classification. Minsky & Papert (1969) showed its limitations (cannot learn XOR), causing the first "AI winter." The MLP with backpropagation (Rumelhart, Hinton & Williams 1986) overcame these limitations. Modern deep MLPs (ResNets, Transformers) follow the same fundamental architecture with many engineering improvements.'})}),e.jsx(N,{label:"Definition 1.1",title:"Multilayer Perceptron",definition:"An MLP with $L$ layers is a function $f: \\mathbb{R}^{d_0} \\to \\mathbb{R}^{d_L}$ defined by: $\\mathbf{h}^{(0)} = \\mathbf{x}$, $\\mathbf{z}^{(l)} = W^{(l)}\\mathbf{h}^{(l-1)} + \\mathbf{b}^{(l)}$, $\\mathbf{h}^{(l)} = \\sigma(\\mathbf{z}^{(l)})$ for $l=1,\\ldots,L-1$, $f(\\mathbf{x}) = \\mathbf{z}^{(L)}$ (or $\\sigma(\\mathbf{z}^{(L)})$ for classification). Here $W^{(l)} \\in \\mathbb{R}^{d_l \\times d_{l-1}}$, $\\mathbf{b}^{(l)} \\in \\mathbb{R}^{d_l}$, and $\\sigma$ is a nonlinear activation function applied element-wise.",notation:"$\\mathbf{z}^{(l)}$ is the pre-activation (logit), $\\mathbf{h}^{(l)}$ is the post-activation (hidden state). $d_0$ is input dimension, $d_L$ is output dimension, $d_1,\\ldots,d_{L-1}$ are hidden dimensions. Total parameters: $\\sum_{l=1}^L d_l \\cdot d_{l-1} + d_l$."}),e.jsx(he,{}),e.jsx(N,{label:"Definition 1.2",title:"Layer Types & Parameter Count",definition:"A fully connected (dense) layer maps $\\mathbb{R}^{d_{in}} \\to \\mathbb{R}^{d_{out}}$ via $\\mathbf{z} = W\\mathbf{x} + \\mathbf{b}$ with $W \\in \\mathbb{R}^{d_{out}\\times d_{in}}$, $\\mathbf{b} \\in \\mathbb{R}^{d_{out}}$, totaling $d_{in} \\cdot d_{out} + d_{out}$ parameters. The bias term allows the hyperplane $W\\mathbf{x}+\\mathbf{b}=0$ to not pass through the origin, essential for learning arbitrary decision boundaries. Without nonlinearities, stacking multiple linear layers collapses to a single linear transformation.",notation:"In PyTorch: nn.Linear(d_in, d_out, bias=True). The weight matrix W is initialized (Xavier or He), bias is usually initialized to zero. The computation is: $z_j = \\sum_i W_{ji} x_i + b_j$ for each output neuron $j$."}),e.jsx(S,{label:"Theorem 1.1",title:"Necessity of Nonlinearity",statement:"A composition of $L$ linear transformations is equivalent to a single linear transformation: $W^{(L)} \\cdots W^{(1)} = \\tilde{W}$. Therefore, without nonlinear activation functions, an MLP with any number of layers can only represent linear functions and cannot learn XOR, spirals, or any non-linearly separable pattern.",proof:"By associativity of matrix multiplication: $f(\\mathbf{x}) = W^{(L)}(W^{(L-1)}\\cdots(W^{(1)}\\mathbf{x}+\\mathbf{b}^{(1)})\\cdots+\\mathbf{b}^{(L-1)})+\\mathbf{b}^{(L)}$. Expanding: $f(\\mathbf{x}) = (W^{(L)}\\cdots W^{(1)})\\mathbf{x} + \\text{const} = \\tilde{W}\\mathbf{x} + \\tilde{\\mathbf{b}}$. This is an affine map, representable by a single layer. The rank of $\\tilde{W}$ is at most $\\min(d_1, \\ldots, d_L)$, so multiple layers also don't increase the rank of the linear map. $\\square$",corollaries:["This motivates activation functions like ReLU, sigmoid, and tanh — they break the linearity, enabling MLPs to represent complex nonlinear functions.","Even a single hidden layer with nonlinearity can approximate any continuous function (Universal Approximation Theorem) — depth primarily improves efficiency.","The depth-width tradeoff: deeper networks can represent certain functions (e.g., parity) exponentially more efficiently than wide shallow networks."]}),e.jsx(M,{title:"Forward Pass Through a 2-Layer MLP",difficulty:"intermediate",problem:"Compute the forward pass of a 2-layer MLP with input $\\mathbf{x} = [1, 2]$, $W^{(1)} = [[1,0],[0,1],[-1,1]]$, $\\mathbf{b}^{(1)} = [0,1,-1]$, ReLU activation, $W^{(2)} = [[1,2,-1]]$, $\\mathbf{b}^{(2)} = [0]$.",solution:[{step:"Layer 1 pre-activation",formula:"\\mathbf{z}^{(1)} = W^{(1)}\\mathbf{x} + \\mathbf{b}^{(1)} = [1, 3, -2]",explanation:"z1 = 1·1+0·2+0=1; z2=0·1+1·2+1=3; z3=-1·1+1·2-1=-2."},{step:"Apply ReLU",formula:"\\mathbf{h}^{(1)} = \\text{ReLU}([1,3,-2]) = [1, 3, 0]",explanation:"max(0, z) applied element-wise. The third neuron is deactivated (z=-2<0)."},{step:"Layer 2 pre-activation",formula:"z^{(2)} = W^{(2)}\\mathbf{h}^{(1)} + b^{(2)} = 1\\cdot1 + 2\\cdot3 + (-1)\\cdot0 + 0 = 7",explanation:"Output is a scalar for this 1-output MLP."},{step:"Final output",formula:"f(\\mathbf{x}) = z^{(2)} = 7",explanation:"No activation on the last layer for regression. For classification, apply softmax."}]}),e.jsx(C,{title:"Common MLP Mistakes",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Forgetting bias:"})," Without bias terms, all hyperplanes pass through the origin, severely restricting the function class. Always include bias (default in PyTorch's nn.Linear)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Applying activation after the last layer:"})," For regression, do not apply ReLU or sigmoid after the output layer — it restricts the output range. For multi-class classification, cross-entropy loss in PyTorch expects logits (unnormalized), not softmax probabilities."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Width vs depth tradeoff:"})," Increasing width (neurons per layer) often helps more than increasing depth for tabular data. For structured data (images, sequences), depth with appropriate architectures (CNN, RNN) is key."]})]})}),e.jsx(W,{code:me,title:"MLP in PyTorch — Architecture, Forward Pass, Parameter Count",runnable:!0})]})}const nt=Object.freeze(Object.defineProperty({__proto__:null,default:pe},Symbol.toStringTag,{value:"Module"})),A={ReLU:{fn:t=>Math.max(0,t),color:"#6366f1",deriv:t=>t>0?1:0},Sigmoid:{fn:t=>1/(1+Math.exp(-t)),color:"#10b981",deriv:t=>{const b=1/(1+Math.exp(-t));return b*(1-b)}},Tanh:{fn:t=>Math.tanh(t),color:"#f59e0b",deriv:t=>1-Math.tanh(t)**2},GELU:{fn:t=>t*.5*(1+Math.tanh(.7978845608*(t+.044715*t**3))),color:"#ef4444",deriv:t=>{const b=Math.tanh(.7978845608*(t+.044715*t**3));return .5*(1+b)+.5*t*(1-b*b)*.7978845608*(1+3*.044715*t**2)}},Swish:{fn:t=>t/(1+Math.exp(-t)),color:"#8b5cf6",deriv:t=>{const b=1/(1+Math.exp(-t));return b+t*b*(1-b)}}};function ue(){const[t,b]=$.useState("ReLU"),[o,_]=$.useState(!1),m=400,x=220,a=-4,s=4,l=-1.5,h=2,u=(n,r)=>({x:(n-a)/(s-a)*m,y:x-(r-l)/(h-l)*x}),d=200,i=Array.from({length:d},(n,r)=>a+(s-a)*r/(d-1)),f=n=>"M"+i.map(j=>{const c=Math.max(l,Math.min(h,n(j))),g=u(j,c);return`${g.x},${g.y}`}).join(" L"),p=u(0,0);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Activation Function Explorer"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Compare activation functions and their derivatives. Derivatives show gradient magnitude for backprop."}),e.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[Object.keys(A).map(n=>e.jsx("button",{onClick:()=>b(n),className:`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${t===n?"text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`,style:t===n?{backgroundColor:A[n].color}:{},children:n},n)),e.jsxs("label",{className:"flex items-center gap-2 ml-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300",children:[e.jsx("input",{type:"checkbox",checked:o,onChange:n=>_(n.target.checked)}),"Show derivative"]})]}),e.jsxs("svg",{width:m,height:x,className:"mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800/50",children:[[-1,0,1,2].map(n=>{const r=u(a,n);return e.jsx("line",{x1:0,y1:r.y,x2:m,y2:r.y,stroke:n===0?"#94a3b8":"#e5e7eb",strokeWidth:n===0?1.5:.8,className:"dark:stroke-gray-600"},n)}),[-4,-3,-2,-1,0,1,2,3,4].map(n=>{const r=u(n,0);return e.jsx("line",{x1:r.x,y1:0,x2:r.x,y2:x,stroke:n===0?"#94a3b8":"#e5e7eb",strokeWidth:n===0?1.5:.8,className:"dark:stroke-gray-600"},n)}),Object.entries(A).map(([n,r])=>n!==t&&e.jsx("path",{d:f(r.fn),fill:"none",stroke:r.color,strokeWidth:1,opacity:.2},n)),e.jsx("path",{d:f(A[t].fn),fill:"none",stroke:A[t].color,strokeWidth:2.5}),o&&e.jsx("path",{d:f(A[t].deriv),fill:"none",stroke:A[t].color,strokeWidth:1.5,strokeDasharray:"6,3",opacity:.7}),[-3,-1,1,3].map(n=>{const r=u(n,0);return e.jsx("text",{x:r.x,y:p.y+14,textAnchor:"middle",fontSize:10,fill:"#9ca3af",children:n},n)})]}),e.jsxs("div",{className:"mt-3 flex justify-center gap-4 text-xs text-gray-500",children:[e.jsxs("span",{style:{color:A[t].color},children:["— ",t,"(x)"]}),o&&e.jsxs("span",{style:{color:A[t].color},className:"opacity-70",children:["- - ",t,"'(x)"]})]})]})}const fe=`import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# ── Activation functions and their properties ─────────────────────────────────
x = torch.linspace(-4, 4, 100)

# ReLU and variants
relu     = F.relu(x)
leaky    = F.leaky_relu(x, 0.01)
elu      = F.elu(x)
gelu     = F.gelu(x)  # PyTorch uses erf approximation
swish    = F.silu(x)  # SiLU = Swish = x * sigmoid(x)
mish     = x * torch.tanh(F.softplus(x))

# Sigmoid and tanh
sigmoid  = torch.sigmoid(x)
tanh_act = torch.tanh(x)

print("Activation statistics at x=0:")
for name, fn in [('ReLU', F.relu), ('GELU', F.gelu), ('Swish/SiLU', F.silu),
                  ('Sigmoid', torch.sigmoid), ('Tanh', torch.tanh)]:
    val = fn(torch.tensor(0.0))
    print(f"  {name}(0) = {val:.4f}")

# ── Dying ReLU demonstration ───────────────────────────────────────────────────
class TinyNet(nn.Module):
    def __init__(self, activation):
        super().__init__()
        self.fc1 = nn.Linear(10, 100)
        self.fc2 = nn.Linear(100, 1)
        self.act = activation

    def forward(self, x):
        return self.fc2(self.act(self.fc1(x)))

# Initialize with large negative biases → dying ReLU
model = TinyNet(F.relu)
with torch.no_grad():
    model.fc1.bias.fill_(-5.0)  # All pre-activations negative

x_test = torch.randn(32, 10)
h1 = F.relu(model.fc1(x_test))
dead = (h1 == 0).float().mean()
print(f"\\nDying ReLU: {dead:.1%} of neurons output zero")

# Fix with GELU or Leaky ReLU
model_gelu = TinyNet(F.gelu)
h1_gelu = F.gelu(model_gelu.fc1(x_test))
print(f"GELU: {(h1_gelu == 0).float().mean():.1%} of neurons output zero")

# ── Saturating activations cause vanishing gradients ─────────────────────────
x_large = torch.tensor(10.0, requires_grad=True)
y = torch.sigmoid(x_large)
y.backward()
print(f"\\nSigmoid gradient at x=10: {x_large.grad:.8f} (nearly zero!)")

x_large2 = torch.tensor(10.0, requires_grad=True)
y2 = F.gelu(x_large2)
y2.backward()
print(f"GELU gradient at x=10: {x_large2.grad:.4f}")
`;function xe(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Activation Functions"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"The nonlinear building blocks of neural networks — ReLU, sigmoid, tanh, GELU, and Swish, including the dying ReLU problem and modern alternatives."})]}),e.jsx(R,{title:"Evolution of Activation Functions",children:e.jsx("p",{children:"Early networks used sigmoid (1980s) and tanh. The ReLU breakthrough came with Nair & Hinton (2010) and Glorot et al. (2011) showing it dramatically accelerates training. GELU (Hendrycks & Gimpel, 2016) is now the default in Transformers (BERT, GPT). Swish/SiLU (Ramachandran et al., 2017; Elfwing et al., 2018) is used in EfficientNet and many modern models. The search for better activations is ongoing (e.g., GLU variants, Mish)."})}),e.jsx(N,{label:"Definition 1.3",title:"Common Activation Functions",definition:"Key activation functions: (1) ReLU: $\\sigma(x) = \\max(0,x)$, gradient = 1 for x>0, 0 for x<0. (2) Sigmoid: $\\sigma(x) = 1/(1+e^{-x})$, range $(0,1)$, gradient = $\\sigma(1-\\sigma) \\leq 1/4$. (3) Tanh: $\\sigma(x) = \\tanh(x)$, range $(-1,1)$, gradient = $1-\\tanh^2(x) \\leq 1$. (4) GELU: $\\sigma(x) = x \\cdot \\Phi(x)$ where $\\Phi$ is the Gaussian CDF, approximated as $x \\cdot 0.5(1+\\tanh(\\sqrt{2/\\pi}(x+0.044715x^3)))$. (5) Swish/SiLU: $\\sigma(x) = x \\cdot \\text{sigmoid}(x)$.",notation:"Leaky ReLU: $\\max(\\alpha x, x)$ with $\\alpha \\approx 0.01$ (no dying neurons). ELU: $x$ for $x>0$, $\\alpha(e^x-1)$ for $x\\leq 0$ (smooth, negative outputs). PReLU: learnable $\\alpha$. All modern models use one of: ReLU, GELU, SiLU, or a gated variant (SwiGLU in LLaMA)."}),e.jsx(ue,{}),e.jsx(N,{label:"Definition 1.4",title:"Dying ReLU Problem",definition:"A ReLU neuron 'dies' when its pre-activation $z = \\mathbf{w}^\\top \\mathbf{x} + b$ is negative for all inputs in the dataset. Since the gradient of ReLU is 0 for $z < 0$, no gradient flows through dead neurons during backpropagation, so their weights never update — they are permanently deactivated. Large negative biases or large learning rates can cause many neurons to die simultaneously, reducing effective network capacity.",notation:"Dying ReLU is diagnosed by checking the fraction of neurons outputting 0 on the training set (should be < 50%). Mitigations: (1) Leaky ReLU/PReLU with non-zero gradient for $x<0$. (2) ELU with smooth negative region. (3) GELU/SiLU which have small but non-zero output for negative inputs. (4) Careful initialization (He init) and learning rate scheduling."}),e.jsx(S,{label:"Theorem 1.2",title:"Vanishing Gradients from Saturating Activations",statement:"For sigmoid activation $\\sigma(x) = (1+e^{-x})^{-1}$, the gradient $\\sigma'(x) = \\sigma(x)(1-\\sigma(x)) \\leq 1/4$ for all $x$. In an $L$-layer network, the gradient of the loss with respect to the first layer satisfies $\\|\\nabla_{W^{(1)}} \\mathcal{L}\\| \\leq (1/4)^L \\prod_{l} \\|W^{(l)}\\| \\cdot \\|\\nabla_{z^{(L)}} \\mathcal{L}\\|$, which vanishes exponentially in $L$ for typical weight scales.",proof:"By the chain rule, the gradient through layer $l$ is multiplied by $\\sigma'(z^{(l)}) \\leq 1/4$. With $L$ sigmoid layers: $\\partial \\mathcal{L}/\\partial z^{(1)} = \\prod_{l=2}^L (\\sigma'(z^{(l)}) \\cdot W^{(l)}) \\cdot \\nabla_{z^{(L)}} \\mathcal{L}$. Taking norms and applying submultiplicativity: $\\|\\nabla\\| \\leq (1/4)^{L-1} \\prod \\|W^{(l)}\\| \\cdot \\|\\nabla\\|$. For typical random initialization $\\|W\\| \\sim 1$, this is exponentially small. $\\square$",corollaries:["ReLU avoids vanishing gradients: $\\text{ReLU}'(x) = 1$ for $x > 0$, so gradients pass through unchanged for active neurons.","Batch normalization (Ioffe & Szegedy 2015) mitigates vanishing gradients by normalizing pre-activations, keeping them out of saturation regions.","Residual connections (He et al. 2016) provide gradient highways that bypass nonlinearities, enabling training of networks with hundreds of layers."]}),e.jsx(M,{title:"Choosing the Right Activation",difficulty:"intermediate",problem:"You are building (a) a binary classifier with a sigmoid output, (b) a hidden layer in a deep network, (c) a language model hidden layer. Which activation do you choose and why?",solution:[{step:"Output layer for binary classification",formula:"p = \\sigma(z) = \\frac{1}{1+e^{-z}}",explanation:"Sigmoid maps logit to probability in [0,1]. Use with binary cross-entropy loss. (Note: PyTorch BCEWithLogitsLoss applies sigmoid internally for numerical stability.)"},{step:"Hidden layers in deep MLP",formula:"h = \\text{ReLU}(z) = \\max(0, z)",explanation:"ReLU: fast to compute, no vanishing gradient for positive activations, sparse activations. Default choice for MLPs, CNNs. Use He initialization with ReLU."},{step:"Hidden layers in Transformer/LLM",formula:"h = \\text{GELU}(z) = z \\cdot \\Phi(z)",explanation:"GELU: smooth, allows small negative outputs (stochastic regularization interpretation), outperforms ReLU in attention-based models empirically. Used in BERT, GPT, ViT."},{step:"Alternative: SwiGLU (LLaMA)",formula:"h = \\text{SiLU}(W_1 x) \\odot W_2 x",explanation:"Gated linear unit with Swish — adds multiplicative gating, more expressive than additive activation. State-of-the-art in large language models."}]}),e.jsx(C,{title:"Activation Function Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sigmoid in hidden layers:"})," Avoid sigmoid in intermediate layers — it saturates and causes vanishing gradients. Reserve it for output layers (binary classification probability)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ReLU in RNNs:"})," ReLU in recurrent networks can cause exploding gradients (the repeated multiplication by weights is not bounded by 1 as in tanh). LSTMs use sigmoid/tanh gates specifically to bound the gradient."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Large learning rate + ReLU:"})," Can cause dying neurons. Monitor the fraction of zero activations. If >50% neurons are dead, reduce learning rate or switch to Leaky ReLU."]})]})}),e.jsx(W,{code:fe,title:"Activation Functions in PyTorch — Properties & Dying ReLU",runnable:!0})]})}const it=Object.freeze(Object.defineProperty({__proto__:null,default:xe},Symbol.toStringTag,{value:"Module"})),J={"sin(πx)":t=>Math.sin(Math.PI*t),"x²":t=>t*t,"|x|":t=>Math.abs(t),"sign(x)":t=>t>0?1:t<0?-1:0};function ge(t,b,o,_){return Array.from({length:b},(m,x)=>{const a=o+(_-o)*x/b,s=o+(_-o)*(x+1)/b,l=(a+s)/2;return{xLeft:a,xRight:s,height:t(l)}})}function be(){const[t,b]=$.useState(6),[o,_]=$.useState("sin(πx)"),m=440,x=220,a=-1,s=1,l=-1.5,h=1.5,u=(c,g)=>({x:(c-a)/(s-a)*m,y:x-(g-l)/(h-l)*x}),d=J[o],i=ge(d,t,a,s),f=200,p=Array.from({length:f},(c,g)=>{const v=a+(s-a)*g/(f-1),k=Math.max(l,Math.min(h,d(v))),L=u(v,k);return`${L.x},${L.y}`}),n=100;let r=0;for(let c=0;c<n;c++){const g=a+(s-a)*c/(n-1),v=i.find(k=>g>=k.xLeft&&g<k.xRight)||i[i.length-1];r+=(d(g)-v.height)**2}r=Math.sqrt(r/n);const j=u(0,0);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"UAT: Step Function Approximation"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Each bump = 2 neurons (one ReLU transition up, one down). More neurons = better approximation."}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-500 dark:text-gray-400 mr-2",children:"Target:"}),Object.keys(J).map(c=>e.jsx("button",{onClick:()=>_(c),className:`mr-1 rounded px-2 py-1 text-xs font-semibold ${o===c?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`,children:c},c))]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("label",{className:"text-xs text-gray-500 dark:text-gray-400",children:["Neurons: ",t*2]}),e.jsx("input",{type:"range",min:2,max:24,step:1,value:t,onChange:c=>b(parseInt(c.target.value)),className:"w-28"})]})]}),e.jsxs("svg",{width:m,height:x,className:"mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800/50",children:[e.jsx("line",{x1:0,y1:j.y,x2:m,y2:j.y,stroke:"#94a3b8",strokeWidth:1}),e.jsx("line",{x1:u(0,l).x,y1:0,x2:u(0,l).x,y2:x,stroke:"#94a3b8",strokeWidth:1}),i.map((c,g)=>{const v=u(c.xLeft,c.height).x,k=u(c.xRight,c.height).x,L=u(c.xLeft,Math.max(l,Math.min(h,c.height))).y,U=j.y;return e.jsxs("g",{children:[e.jsx("rect",{x:v,y:Math.min(L,U),width:k-v,height:Math.abs(L-U),fill:c.height>=0?"rgba(99,102,241,0.2)":"rgba(239,68,68,0.15)",stroke:"rgba(99,102,241,0.5)",strokeWidth:.5}),e.jsx("line",{x1:v,y1:L,x2:k,y2:L,stroke:"#6366f1",strokeWidth:2})]},g)}),e.jsx("path",{d:"M"+p.join(" L"),fill:"none",stroke:"#f59e0b",strokeWidth:2})]}),e.jsxs("div",{className:"mt-3 flex justify-center gap-6 text-xs text-gray-600 dark:text-gray-400",children:[e.jsxs("span",{className:"text-indigo-600 dark:text-indigo-400",children:["— Step approx (",t*2," neurons)"]}),e.jsxs("span",{className:"text-amber-500",children:["— Target: ",o]}),e.jsxs("span",{className:"font-mono",children:["L2 error: ",r.toFixed(4)]})]})]})}const ye=`import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt

# ── Demonstrate UAT: approximate sin with varying width ───────────────────────
class ShallowNet(nn.Module):
    def __init__(self, width):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, width),
            nn.ReLU(),
            nn.Linear(width, 1),
        )

    def forward(self, x):
        return self.net(x)

def train_and_evaluate(width, n_epochs=2000, lr=0.01):
    model = ShallowNet(width)
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    x_train = torch.linspace(-1, 1, 200).unsqueeze(1)
    y_train = torch.sin(np.pi * x_train)

    for _ in range(n_epochs):
        opt.zero_grad()
        loss = ((model(x_train) - y_train) ** 2).mean()
        loss.backward()
        opt.step()

    with torch.no_grad():
        y_pred = model(x_train)
        mse = ((y_pred - y_train)**2).mean().item()
    return mse

# Width scaling experiment
print("Width | MSE")
print("-" * 20)
for width in [2, 4, 8, 16, 32, 64, 128]:
    mse = train_and_evaluate(width)
    bar = '█' * int(mse * 1000)
    print(f"  {width:3d}  | {mse:.6f}  {bar}")

# ── Depth vs Width: exponential expressiveness gain ──────────────────────────
def count_linear_regions(model, x_range=(-2, 2), n=1000):
    """Count linear regions (activation pattern changes) of a ReLU network."""
    x = torch.linspace(*x_range, n).unsqueeze(1)
    with torch.no_grad():
        # Track activation patterns
        hooks = []
        patterns = []
        def hook_fn(module, inp, out):
            patterns.append((out > 0).int())
        for m in model.modules():
            if isinstance(m, nn.ReLU):
                hooks.append(m.register_forward_hook(hook_fn))
        model(x)
        for h in hooks:
            h.remove()
    # Count pattern changes
    n_regions = 1
    if patterns:
        combined = torch.cat(patterns, dim=1)
        n_regions = 1 + (combined[:-1] != combined[1:]).any(dim=1).sum().item()
    return n_regions

# Deep vs wide networks for expressiveness
deep_net  = nn.Sequential(nn.Linear(1,4),nn.ReLU(),nn.Linear(4,4),nn.ReLU(),nn.Linear(4,4),nn.ReLU(),nn.Linear(4,1))
wide_net  = nn.Sequential(nn.Linear(1,64),nn.ReLU(),nn.Linear(64,1))
print(f"\\nDeep (4-4-4-1) linear regions: {count_linear_regions(deep_net)}")
print(f"Wide (64-1) linear regions: {count_linear_regions(wide_net)}")
print(f"Deep has fewer params ({sum(p.numel() for p in deep_net.parameters())}) but potentially more regions")
`;function _e(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Universal Approximation Theorem"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Any continuous function can be approximated to arbitrary accuracy by a sufficiently wide (or deep) neural network — the theoretical foundation for why neural networks work."})]}),e.jsx(R,{title:"History of UAT",children:e.jsx("p",{children:"Cybenko (1989) proved that a single hidden layer with sigmoid activations is a universal approximator for continuous functions on compact sets. Hornik, Stinchcombe & White (1989) extended this to any non-polynomial activation. Barron (1993) gave approximation rates. The depth version (why deep networks are exponentially more efficient) was proved by Montufar et al. (2014), Eldan & Shamir (2016), and Telgarsky (2016)."})}),e.jsx(N,{label:"Definition 1.5",title:"Universal Approximator",definition:"A family of functions $\\mathcal{F}$ is a universal approximator for a function class $\\mathcal{C}$ if for every $f \\in \\mathcal{C}$, every compact set $K$, and every $\\varepsilon > 0$, there exists $g \\in \\mathcal{F}$ such that $\\sup_{x \\in K} |f(x) - g(x)| < \\varepsilon$. An MLP with a single hidden layer and a non-polynomial activation is a universal approximator for $C(K)$ (continuous functions on compact $K \\subset \\mathbb{R}^d$).",notation:"Universal approximation does not guarantee: (1) that the network can be efficiently trained, (2) that generalization is good, (3) that polynomial-size networks suffice. The theorem is an existence result — it says the right network exists but doesn't say how to find it or how large it needs to be."}),e.jsx(be,{}),e.jsx(S,{label:"Theorem 1.3",title:"Cybenko's Universal Approximation Theorem (1989)",statement:"Let $\\sigma: \\mathbb{R} \\to \\mathbb{R}$ be a continuous sigmoidal function (i.e., $\\sigma(t) \\to 1$ as $t \\to +\\infty$ and $\\sigma(t) \\to 0$ as $t \\to -\\infty$). Then the set of finite sums $\\sum_{j=1}^N \\alpha_j \\sigma(\\mathbf{w}_j^\\top \\mathbf{x} + b_j)$ is dense in $C([0,1]^d)$ — the space of continuous functions on the unit hypercube.",proof:"The key idea is the Stone-Weierstrass theorem. First, show that finite sums $\\sum \\alpha_j \\sigma(\\mathbf{w}_j^\\top \\mathbf{x})$ can approximate indicator functions of half-spaces. Any bounded measurable function on $[0,1]^d$ is a limit of such indicators. By approximating the target function $f$ with step functions (which are linear combinations of indicators), and then approximating each step function with sigmoid sums, we get a single-layer approximation. Density in $C([0,1]^d)$ then follows from the uniform approximation of step functions. $\\square$",corollaries:["The theorem holds for any non-polynomial $\\sigma$, including ReLU (Hornik 1991). The proof for ReLU uses the fact that ReLU can approximate indicator functions via differences.","Width bound: For any $\\varepsilon>0$ and $f \\in C([0,1]^d)$, a single hidden layer of width $O((\\varepsilon^{-1})^d)$ neurons suffices — exponential in dimension (curse of dimensionality).","Depth helps exponentially: Montufar et al. (2014) showed that depth-$L$ ReLU networks can have $O((n/d)^{d(L-1)} \\cdot n)$ linear regions vs $O(n^d)$ for depth-2 networks of width $n$."]}),e.jsx(S,{label:"Theorem 1.4",title:"Depth vs Width: Exponential Separation",statement:"There exist functions computable by a depth-$L$ ReLU network of width $n$ that require a depth-2 (single hidden layer) network of width $\\Omega(2^{n(L-2)/2})$ to approximate to constant error. In other words, depth can provide an exponential reduction in the number of neurons needed.",proof:"Telgarsky (2016) constructed explicit functions (iterates of the hat function $h(x) = 2\\min(x, 1-x)$) that require exponentially many neurons for shallow approximation. The $k$-th iterate $h^k$ has $2^k$ linear pieces on $[0,1]$ and can be computed exactly by a depth-$2k+1$ network of width 2, but requires $2^{k/2}$ neurons in a depth-2 network to approximate. $\\square$",corollaries:["This theoretically justifies deep networks over wide shallow ones for complex hierarchical functions (though practice is more nuanced).","In practice, both depth and width matter. Depth captures hierarchical structure; width captures the complexity of features at each level.","Residual networks (ResNets) can train very deep networks by providing gradient shortcuts, making depth practically accessible beyond 100+ layers."]}),e.jsx(M,{title:"Constructing a ReLU Network to Approximate a Step Function",difficulty:"advanced",problem:"Show explicitly how 2 ReLU neurons can approximate the indicator function $f(x) = \\mathbf{1}[a \\leq x \\leq b]$ for a given interval $[a,b]$.",solution:[{step:"ReLU bump construction",formula:"f(x) \\approx \\text{ReLU}(x-a) - \\text{ReLU}(x-b)",explanation:"ReLU(x-a) rises from 0 at x=a; subtracting ReLU(x-b) makes it flat after x=b. Result: ramp from a to b, then flat."},{step:"Normalize height",formula:"g(x) = \\frac{1}{b-a}[\\text{ReLU}(x-a) - \\text{ReLU}(x-b)]",explanation:"Divide by (b-a) to normalize the height to 1 on [a,b]."},{step:"Generalize: sum of N bumps",formula:"f(x) \\approx \\sum_{k=1}^N c_k \\cdot \\frac{\\text{ReLU}(x-a_k) - \\text{ReLU}(x-b_k)}{b_k - a_k}",explanation:"Each bump approximates f on [a_k, b_k] with height c_k = average of f on that interval. This is the Riemann sum approximation, using 2N neurons total."},{step:"Error bound",formula:"\\|f - f_N\\|_{\\infty} \\leq \\omega_f(1/N)",explanation:"Where ω_f is the modulus of continuity. For Lipschitz f with constant L: error ≤ L/N. More neurons → smaller error."}]}),e.jsx(C,{title:"UAT Misconceptions",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"Neural networks can learn any function":'})," UAT guarantees approximation in principle, not learnability via gradient descent. Many functions require exponential width or depth, and SGD may not find the right parameters."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Wider is always better":'})," Overly wide networks overfit without regularization. UAT is about approximation capacity, not generalization. Modern practice uses regularization (dropout, weight decay) to match capacity to data size."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Shallow networks are sufficient":'})," UAT holds for single hidden layers, but the required width may be exponential in the input dimension. Depth provides polynomial-vs-exponential efficiency for structured functions."]})]})}),e.jsx(W,{code:ye,title:"UAT Demo: Width Scaling & Linear Region Counting",runnable:!0})]})}const rt=Object.freeze(Object.defineProperty({__proto__:null,default:_e},Symbol.toStringTag,{value:"Module"})),q=[{id:"x",label:"x",x:40,y:100,value:2,grad:null,color:"#94a3b8"},{id:"w1",label:"w₁",x:40,y:200,value:.5,grad:null,color:"#94a3b8"},{id:"b1",label:"b₁",x:40,y:300,value:.1,grad:null,color:"#94a3b8"},{id:"z1",label:"z₁",x:160,y:200,value:1.1,grad:.2927,color:"#818cf8"},{id:"a1",label:"a₁",x:280,y:200,value:1.1,grad:.2927,color:"#818cf8"},{id:"w2",label:"w₂",x:280,y:320,value:1.5,grad:null,color:"#94a3b8"},{id:"z2",label:"z₂",x:390,y:200,value:1.65,grad:-1.35,color:"#fbbf24"},{id:"L",label:"L",x:490,y:200,value:.911,grad:1,color:"#f87171"}],Y=[["x","z1"],["w1","z1"],["b1","z1"],["z1","a1"],["a1","z2"],["w2","z2"],["z2","L"]],Z={z1:"z₁ = w₁·x + b₁ = 0.5×2 + 0.1 = 1.1",a1:"a₁ = ReLU(z₁) = max(0, 1.1) = 1.1",z2:"z₂ = w₂·a₁ = 1.5×1.1 = 1.65",L:"L = (z₂ - y)²/2 = (1.65-3)²/2 ≈ 0.911"};function ve(){const[t,b]=$.useState(null),o=540,_=420,x=t?(a=>{const s=new Set,l=h=>{s.has(h)||(s.add(h),Y.filter(([,u])=>u===h).forEach(([u])=>l(u)))};return l(a),s})(t):new Set;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4",children:[e.jsx("h3",{className:"mb-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300",children:"Computational Graph — Click a Node to See Gradient Flow"}),e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsxs("svg",{width:o,height:_,className:"rounded-lg bg-gray-950 overflow-visible",children:[Y.map(([a,s])=>{const l=q.find(d=>d.id===a),h=q.find(d=>d.id===s),u=t&&x.has(a)&&x.has(s);return e.jsx("line",{x1:l.x+24,y1:l.y,x2:h.x-24,y2:h.y,stroke:u?"#818cf8":"#334155",strokeWidth:u?2.5:1,strokeDasharray:u?"0":"4,3"},`${a}-${s}`)}),q.map(a=>{const s=t===a.id,l=t&&x.has(a.id);return e.jsxs("g",{onClick:()=>b(a.id===t?null:a.id),style:{cursor:"pointer"},children:[e.jsx("circle",{cx:a.x,cy:a.y,r:24,fill:s?a.color:"#1e293b",stroke:l||s?a.color:"#334155",strokeWidth:s?3:l?2:1}),e.jsx("text",{x:a.x,y:a.y+4,textAnchor:"middle",fill:s?"#fff":"#94a3b8",fontSize:"12",fontFamily:"monospace",children:a.label})]},a.id)}),q.map(a=>e.jsxs("text",{x:a.x,y:a.y+38,textAnchor:"middle",fill:"#64748b",fontSize:"10",fontFamily:"monospace",children:["=",a.value]},`lbl-${a.id}`))]}),t&&(()=>{const a=q.find(s=>s.id===t);return e.jsxs("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm max-w-sm w-full",children:[e.jsxs("div",{className:"font-semibold text-gray-800 dark:text-gray-200 mb-1",children:["Node: ",e.jsx("span",{style:{color:a.color},children:a.label})]}),Z[a.id]&&e.jsx("div",{className:"text-xs text-gray-600 dark:text-gray-400 mb-1 font-mono",children:Z[a.id]}),e.jsxs("div",{className:"text-xs text-gray-600 dark:text-gray-400",children:[e.jsx("span",{className:"text-gray-500",children:"forward value:"})," ",e.jsx("span",{className:"font-mono text-emerald-400",children:a.value})]}),a.grad!==null&&e.jsxs("div",{className:"text-xs text-gray-600 dark:text-gray-400",children:[e.jsxs("span",{className:"text-gray-500",children:["∂L/∂",a.id,":"]})," ",e.jsx("span",{className:"font-mono text-rose-400",children:a.grad})]})]})})(),e.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-500 text-center max-w-md",children:"y=3.0 (target). Forward pass: left→right. Backward pass: gradients flow right→left. Highlighted path shows ancestor nodes that contributed to the selected node."})]})]})}function $e(){return e.jsxs(de,{children:[e.jsx(R,{title:"Historical Note",content:"Backpropagation was independently discovered multiple times: Linnainmaa (1970) in his master's thesis as 'reverse-mode AD', Werbos (1974) in the context of neural networks, and — most influentially — Rumelhart, Hinton & Williams (1986) in 'Learning representations by back-propagating errors' (Nature). This paper launched the deep learning revolution by showing that multi-layer networks could learn useful internal representations."}),e.jsxs("p",{className:"mb-6 text-gray-700 dark:text-gray-300 leading-relaxed",children:["Training a neural network requires computing ",e.jsx(T.InlineMath,{math:"\\partial \\mathcal{L} / \\partial w"})," for every parameter ",e.jsx(T.InlineMath,{math:"w"}),". With millions of parameters, naive symbolic differentiation is infeasible. Backpropagation solves this in ",e.jsx(T.InlineMath,{math:"O(\\text{forward pass})"})," time using a single backward sweep through the computation graph."]}),e.jsx(N,{label:"Definition 2.1",title:"Computational Graph",definition:"A computational graph is a directed acyclic graph (DAG) where: nodes represent intermediate values (variables or function applications), and edges represent data flow. Each non-input node $v_i$ stores its value $v_i = f_i(\\text{parents}(v_i))$ and a local Jacobian $\\partial v_i / \\partial v_j$ for each parent $v_j$.",notation:"$\\bar{v}_i = \\partial \\mathcal{L}/\\partial v_i$ denotes the adjoint (accumulated gradient) of node $v_i$."}),e.jsx(S,{label:"Theorem 2.2",title:"Chain Rule for Computational Graphs",statement:"Let $\\mathcal{L}$ be the output of a DAG computation. For any node $v_i$ with children $\\{c : c \\text{ is a child of } i\\}$, the adjoint satisfies: $\\bar{v}_i = \\frac{\\partial \\mathcal{L}}{\\partial v_i} = \\sum_{c \\in \\text{children}(i)} \\frac{\\partial \\mathcal{L}}{\\partial v_c} \\cdot \\frac{\\partial v_c}{\\partial v_i} = \\sum_{c} \\bar{v}_c \\cdot \\frac{\\partial v_c}{\\partial v_i}$. Backpropagation computes all adjoints in a single reverse-topological-order traversal.",proof:"By the multivariate chain rule: if $\\mathcal{L}$ depends on $v_i$ only through its children $\\{v_c\\}$, then $\\partial\\mathcal{L}/\\partial v_i = \\sum_c (\\partial\\mathcal{L}/\\partial v_c)(\\partial v_c/\\partial v_i)$. Base case: $\\bar{v}_{\\text{output}} = 1$. The algorithm processes nodes in reverse topological order (output→inputs), so when we compute $\\bar{v}_i$, all child adjoints $\\bar{v}_c$ have already been computed. Total cost = O(forward pass) since each edge is traversed exactly once.",corollaries:["Reverse-mode AD is efficient when output dimension ≪ input dimension (one backward pass for all parameters). Forward-mode is efficient when input dimension ≪ output dimension.","The memory cost of backprop is O(graph size) since all forward values must be stored for use in backward pass — motivating gradient checkpointing.","Every modern DL framework (PyTorch, JAX, TensorFlow) implements this algorithm automatically via operator overloading."]}),e.jsx(ve,{}),e.jsx(M,{title:"Manual Backprop: f(x,y) = (x·y + y²)·sin(x)",steps:[{label:"Build graph",content:"Nodes: $a=xy$, $b=y^2$, $c=a+b=xy+y^2$, $d=\\sin(x)$, $f=c\\cdot d$"},{label:"Forward pass (x=π/2, y=1)",content:"$a=\\pi/2,; b=1,; c=\\pi/2+1,; d=1,; f=\\pi/2+1\\approx 2.571$"},{label:"Backward: ∂f/∂c, ∂f/∂d",content:"$\\bar{c} = d = 1,; \\bar{d} = c = \\pi/2+1$"},{label:"Backward: ∂f/∂x via d",content:"$\\bar{x} \\mathrel{+}= \\bar{d}\\cdot\\cos(x) = (\\pi/2+1)\\cdot 0 = 0$ (since $\\cos(\\pi/2)=0$)"},{label:"Backward: ∂f/∂a, ∂f/∂b",content:"$\\bar{a}=\\bar{c}=1,; \\bar{b}=\\bar{c}=1$"},{label:"Backward: ∂f/∂x via a, ∂f/∂y",content:"$\\bar{x}\\mathrel{+}= \\bar{a}\\cdot y = 1$, so $\\partial f/\\partial x = 1$; $\\partial f/\\partial y = \\bar{a}\\cdot x + \\bar{b}\\cdot 2y = \\pi/2+2\\approx 3.571$"}]}),e.jsx(W,{title:"Manual Backprop vs. PyTorch Autograd",code:`import numpy as np
import torch

# ── Manual backprop for a 2-layer MLP ─────────────────────────────────────
# Architecture: f(x) = w2 * relu(w1*x + b1)  (scalar for clarity)
x, y_target = 2.0, 3.0
w1, b1, w2 = 0.5, 0.1, 1.5

# Forward pass
z1 = w1 * x + b1         # 1.1
a1 = max(0.0, z1)        # 1.1  (ReLU)
z2 = w2 * a1             # 1.65
loss = 0.5 * (z2 - y_target) ** 2  # 0.911

print(f"Forward: z1={z1}, a1={a1}, z2={z2:.3f}, loss={loss:.4f}")

# Backward pass (chain rule)
dL_dz2 = z2 - y_target       # -1.35   (∂L/∂z2)
dL_dw2 = dL_dz2 * a1         # -1.485  (∂L/∂w2)
dL_da1 = dL_dz2 * w2         # -2.025  (∂L/∂a1)
dL_dz1 = dL_da1 * (1.0 if z1 > 0 else 0.0)  # ReLU grad
dL_dw1 = dL_dz1 * x          # -4.05
dL_db1 = dL_dz1 * 1.0        # -2.025

print(f"\\nManual gradients: ∂L/∂w1={dL_dw1:.4f}, ∂L/∂w2={dL_dw2:.4f}")

# ── PyTorch autograd ───────────────────────────────────────────────────────
w1_t = torch.tensor(w1, requires_grad=True)
b1_t = torch.tensor(b1, requires_grad=True)
w2_t = torch.tensor(w2, requires_grad=True)
x_t  = torch.tensor(x)
y_t  = torch.tensor(y_target)

z1_t = w1_t * x_t + b1_t
a1_t = torch.relu(z1_t)
z2_t = w2_t * a1_t
loss_t = 0.5 * (z2_t - y_t) ** 2
loss_t.backward()

print(f"PyTorch gradients: ∂L/∂w1={w1_t.grad:.4f}, ∂L/∂w2={w2_t.grad:.4f}")
print(f"Match: {np.isclose(w1_t.grad.item(), dL_dw1) and np.isclose(w2_t.grad.item(), dL_dw2)}")

# ── Numerical gradient check ──────────────────────────────────────────────
eps = 1e-5
def f(w1_val, b1_val, w2_val):
    z1 = w1_val * x + b1_val
    a1 = max(0.0, z1)
    z2 = w2_val * a1
    return 0.5 * (z2 - y_target) ** 2

grad_w1_num = (f(w1+eps, b1, w2) - f(w1-eps, b1, w2)) / (2*eps)
print(f"\\nNumerical ∂L/∂w1 = {grad_w1_num:.4f} (check)")
`}),e.jsx(C,{title:"Common Pitfalls",items:["Vanishing gradients: repeated multiplication of small values (e.g., sigmoid′ ≤ 0.25) makes gradients exponentially small with depth. Solved by ReLU, residual connections, gradient clipping.","Exploding gradients: conversely, deep networks with large weights explode. Solved by gradient clipping (clip_grad_norm_) and proper initialization.","ReLU is not differentiable at x=0. Frameworks use a subgradient (typically 0) — this rarely causes problems in practice.","Inplace operations break autograd in PyTorch (the backward graph needs the original value). Avoid inplace ops or use .clone() before.","Gradient accumulation: .backward() accumulates gradients by default; call optimizer.zero_grad() before each step unless intentionally accumulating over micro-batches."]}),e.jsx(ce,{exercises:[{difficulty:"conceptual",question:"Explain why reverse-mode AD requires O(n) memory where n is the number of operations, while forward-mode requires only O(1) memory per derivative. When would you prefer forward-mode?"},{difficulty:"computational",question:"Compute all gradients $\\partial L/\\partial w_i$ for $f(x) = \\sigma(w_2 \\cdot \\text{tanh}(w_1 x + b_1) + b_2)$ at $x=1, w_1=0.5, b_1=0, w_2=2, b_2=0$, where $\\sigma$ is sigmoid and $L=(f-1)^2/2$."},{difficulty:"proof",question:"Prove that the total number of floating-point operations in backpropagation is at most $c$ times the cost of the forward pass, for some small constant $c$ (in practice $c \\approx 2-3$)."},{difficulty:"implementation",question:"Implement a tiny autograd engine (like micrograd) supporting scalar operations: +, *, **, relu, with .backward() computing gradients via the chain rule. Test on the 2-layer MLP example."}]}),e.jsx(le,{references:[{authors:"Rumelhart, D. E., Hinton, G. E., & Williams, R. J.",year:1986,title:"Learning representations by back-propagating errors",venue:"Nature, 323(6088)",note:"The paper that launched deep learning — backprop for MLP training"},{authors:"Goodfellow, I., Bengio, Y., & Courville, A.",year:2016,title:"Deep Learning, Ch. 6",venue:"MIT Press",url:"https://www.deeplearningbook.org",note:"Standard reference for backprop and computational graphs"},{authors:"Baydin, A. G., Pearlmutter, B. A., Radul, A. A., & Siskind, J. M.",year:2018,title:"Automatic differentiation in machine learning: a survey",venue:"JMLR 18(153)",url:"https://arxiv.org/abs/1502.05767",note:"Comprehensive survey of AD, forward vs reverse mode, implementations"}]})]})}const st=Object.freeze(Object.defineProperty({__proto__:null,default:$e},Symbol.toStringTag,{value:"Module"})),V=[{id:"x",label:"x",x:40,y:80,xval:1.5,grad:null},{id:"y",label:"y",x:40,y:200,xval:2,grad:null},{id:"a",label:"x+y",x:160,y:80,xval:3.5,grad:null},{id:"b",label:"sin(x)",x:160,y:200,xval:.997,grad:null},{id:"f",label:"f",x:280,y:140,xval:3.49,grad:1}],we={x:1.245,y:.997,a:.997,b:3.5,f:1},ke=[{from:"x",to:"a"},{from:"y",to:"a"},{from:"x",to:"b"},{from:"a",to:"f"},{from:"b",to:"f"}],je=["x","y","a","b","f"],Ne=["f","b","a","y","x"];function Le(){const[t,b]=$.useState("forward"),[o,_]=$.useState(-1),m=t==="forward"?je:Ne,x=new Set(o>=0?m.slice(0,o+1):[]);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Computation Graph: Forward & Backward Pass"}),e.jsxs("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:[e.jsx(T.InlineMath,{math:"f(x,y) = (x+y)\\sin(x)"})," at ",e.jsx(T.InlineMath,{math:"x=1.5, y=2"}),". Step through the forward pass (computing values) or backward pass (computing gradients)."]}),e.jsx("div",{className:"flex gap-3 mb-5",children:["forward","backward"].map(a=>e.jsxs("button",{onClick:()=>{b(a),_(-1)},className:`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${t===a?a==="forward"?"bg-emerald-600 text-white":"bg-rose-600 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`,children:[a," Pass"]},a))}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-6",children:[e.jsxs("svg",{width:340,height:280,className:"shrink-0",children:[ke.map((a,s)=>{const l=V.find(d=>d.id===a.from),h=V.find(d=>d.id===a.to),u=t==="forward"?x.has(a.from)&&x.has(a.to):x.has(a.to)&&x.has(a.from);return e.jsx("line",{x1:l.x+24,y1:l.y,x2:h.x-24,y2:h.y,stroke:u?t==="forward"?"#10b981":"#ef4444":"#e5e7eb",strokeWidth:u?2.5:1.5,className:u?"":"dark:stroke-gray-600"},s)}),V.map(a=>{const s=x.has(a.id),l=o>=0&&m[o]===a.id,h=l?t==="forward"?"#059669":"#dc2626":s?t==="forward"?"#6ee7b7":"#fca5a5":"#e5e7eb",u=s?"#1f2937":"#6b7280";return e.jsxs("g",{children:[e.jsx("circle",{cx:a.x,cy:a.y,r:24,fill:h,stroke:l?"#1f2937":"#fff",strokeWidth:l?2.5:1.5}),e.jsx("text",{x:a.x,y:a.y-4,textAnchor:"middle",fontSize:10,fill:u,fontWeight:"600",children:a.label}),s&&t==="forward"&&e.jsx("text",{x:a.x,y:a.y+10,textAnchor:"middle",fontSize:10,fill:"#065f46",children:a.xval.toFixed(3)}),s&&t==="backward"&&e.jsx("text",{x:a.x,y:a.y+10,textAnchor:"middle",fontSize:10,fill:"#7f1d1d",children:we[a.id].toFixed(3)})]},a.id)})]}),e.jsxs("div",{className:"flex-1 space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400",children:t==="forward"?"Forward Pass: Computing Values":"Backward Pass: Computing Gradients"}),o>=0&&e.jsx("div",{className:`rounded-lg p-3 text-xs font-mono ${t==="forward"?"bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300":"bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300"}`,children:t==="forward"?["x = 1.5 (input)","y = 2.0 (input)","a = x + y = 3.5","b = sin(x) = 0.997","f = a × b = 3.491"][o]||"":["∂f/∂f = 1.000 (base case)","∂f/∂b = a = 3.5","∂f/∂a = b = 0.997","∂f/∂y = ∂f/∂a × 1 = 0.997","∂f/∂x = ∂f/∂a × 1 + ∂f/∂b × cos(x) = 1.245"][o]||""})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>_(-1),className:"rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",children:"Reset"}),e.jsx("button",{onClick:()=>_(a=>Math.max(-1,a-1)),disabled:o<0,className:"rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",children:"← Prev"}),e.jsx("button",{onClick:()=>_(a=>Math.min(m.length-1,a+1)),disabled:o>=m.length-1,className:`rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 ${t==="forward"?"border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300":"border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300"}`,children:"Next →"})]})]})]})]})}const ze=`import torch

# ── Dual numbers for forward-mode AD ─────────────────────────────────────────
class Dual:
    """Dual number: a + b*ε, ε²=0. Tracks one directional derivative."""
    def __init__(self, val, deriv=0.0):
        self.val, self.deriv = float(val), float(deriv)
    def __add__(self, other):
        if isinstance(other, Dual):
            return Dual(self.val + other.val, self.deriv + other.deriv)
        return Dual(self.val + other, self.deriv)
    def __radd__(self, other): return self.__add__(other)
    def __mul__(self, other):
        if isinstance(other, Dual):
            return Dual(self.val*other.val, self.val*other.deriv + self.deriv*other.val)
        return Dual(self.val*other, self.deriv*other)
    def __rmul__(self, other): return self.__mul__(other)
    def sin(self):
        import math
        return Dual(math.sin(self.val), self.deriv * math.cos(self.val))
    def __repr__(self): return f"Dual(val={self.val:.4f}, deriv={self.deriv:.4f})"

import math

# Compute ∂f/∂x at x=1.5, y=2.0 via forward mode (seed dx=1, dy=0)
def f(x, y):
    return (x + y) * x.sin()

x_dual = Dual(1.5, 1.0)  # dx=1: computing ∂f/∂x
y_dual = Dual(2.0, 0.0)  # dy=0
result = f(x_dual, y_dual)
print(f"Forward mode ∂f/∂x: {result.deriv:.4f}")  # Expected: 1.245

# For ∂f/∂y: seed x.deriv=0, y.deriv=1
x_dual2 = Dual(1.5, 0.0)
y_dual2 = Dual(2.0, 1.0)  # dy=1
result2 = f(x_dual2, y_dual2)
print(f"Forward mode ∂f/∂y: {result2.deriv:.4f}")  # Expected: 0.997

# ── Reverse-mode AD (PyTorch) — one backward pass for ALL gradients ───────────
x = torch.tensor(1.5, requires_grad=True)
y = torch.tensor(2.0, requires_grad=True)

# Build computation graph
a = x + y
b = torch.sin(x)
f_val = a * b
f_val.backward()  # Single backward pass

print(f"\\nReverse mode ∂f/∂x: {x.grad:.4f}")  # 1.245
print(f"Reverse mode ∂f/∂y: {y.grad:.4f}")  # 0.997

# ── Why reverse mode is efficient for training ────────────────────────────────
# Forward mode: O(n) passes for n parameters
# Reverse mode: O(1) passes (one backward)
n_params = 1_000_000  # typical NN
print(f"\\nForward mode: {n_params} passes needed")
print(f"Reverse mode: 1 pass needed (backprop)")
print(f"Speedup: {n_params}x for computing all gradients simultaneously")

# ── Jacobian-vector products (forward mode) vs vector-Jacobian products (reverse)
def batch_jacobian(f, x):
    """Full Jacobian via vectorized backward (vmap)."""
    from torch.autograd.functional import jacobian
    return jacobian(f, x)

x_vec = torch.tensor([1.5, 2.0], requires_grad=True)
fn = lambda v: torch.stack([v[0]+v[1], torch.sin(v[0])])
J = batch_jacobian(fn, x_vec)
print(f"\\nJacobian shape: {J.shape}")
print(f"Jacobian:\\n{J.detach()}")
`;function Te(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Automatic Differentiation"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Forward-mode and reverse-mode automatic differentiation — the computational engine behind backpropagation, dual numbers, and computation graphs."})]}),e.jsx(R,{title:"AD vs Symbolic vs Numerical Differentiation",children:e.jsxs("p",{children:[e.jsx("strong",{children:"Symbolic differentiation"})," (SymPy, Mathematica) produces exact expressions but suffers from expression swell. ",e.jsx("strong",{children:"Numerical differentiation"})," (finite differences) is easy to implement but has ",e.jsx(T.InlineMath,{math:"O(\\varepsilon)"})," truncation error and requires",e.jsx(T.InlineMath,{math:"n"})," evaluations for ",e.jsx(T.InlineMath,{math:"n"})," parameters. ",e.jsx("strong",{children:"Automatic differentiation"})," combines the exactness of symbolic methods with the efficiency of numerical ones, computing exact gradients in ",e.jsx(T.InlineMath,{math:"O(1)"})," backward passes."]})}),e.jsx(N,{label:"Definition 2.2",title:"Forward-Mode Automatic Differentiation & Dual Numbers",definition:"Forward-mode AD computes directional derivatives $\\nabla f(\\mathbf{x}) \\cdot \\mathbf{v}$ for a seed direction $\\mathbf{v}$. It uses dual numbers: $\\hat{x} = x + x'\\varepsilon$ where $\\varepsilon^2 = 0$. Every operation on dual numbers automatically propagates the derivative: $(a + a'\\varepsilon)(b + b'\\varepsilon) = ab + (a'b + ab')\\varepsilon$. After evaluating $f(\\hat{x})$, the $\\varepsilon$ coefficient is $\\nabla f \\cdot \\mathbf{v}$.",notation:"To compute $\\partial f/\\partial x_i$, set seed $\\mathbf{v} = \\mathbf{e}_i$ (i-th unit vector). Forward mode computes one partial derivative per pass — efficient when input dimension $n \\ll$ output dimension $m$. Cost: $O(n)$ times the cost of evaluating $f$."}),e.jsx(N,{label:"Definition 2.3",title:"Reverse-Mode AD & Adjoints",definition:"Reverse-mode AD (backpropagation) computes $\\bar{\\mathbf{x}} = \\mathbf{v}^\\top J_f$ for a seed $\\mathbf{v}$ (typically $\\mathbf{v} = \\partial \\mathcal{L}/\\partial f$). It requires a two-phase algorithm: (1) Forward pass: execute $f$, record intermediate values and the computation graph. (2) Backward pass: traverse graph in reverse topological order, accumulating adjoints $\\bar{v}_i = \\partial \\mathcal{L}/\\partial v_i$ via $\\bar{v}_i \\mathrel{+}= \\bar{v}_j \\cdot (\\partial v_j/\\partial v_i)$ for each child $j$.",notation:"Adjoint of node $v_i$: $\\bar{v}_i = \\partial \\mathcal{L}/\\partial v_i$. Base case: $\\bar{v}_{\\text{output}} = 1$. Cost: $O(1)$ times the forward pass cost — computes ALL partial derivatives in one backward pass. Memory: $O(n)$ to store the forward pass tape."}),e.jsx(Le,{}),e.jsx(S,{label:"Theorem 2.3",title:"Efficiency of Forward vs Reverse Mode AD",statement:"For a function $f: \\mathbb{R}^n \\to \\mathbb{R}^m$ with evaluation cost $T_f$: Forward mode computes $J_f \\mathbf{v}$ (Jacobian-vector product) in cost $O(T_f)$; computing the full Jacobian $J_f \\in \\mathbb{R}^{m\\times n}$ requires $n$ forward passes — cost $O(n \\cdot T_f)$. Reverse mode computes $\\mathbf{u}^\\top J_f$ (vector-Jacobian product) in cost $O(T_f)$; computing the full Jacobian requires $m$ backward passes — cost $O(m \\cdot T_f)$. For deep learning with $m=1$ (scalar loss) and $n \\gg 1$ parameters, reverse mode is $n$ times cheaper.",proof:"Each elementary operation $(+, \\times, \\sin, \\ldots)$ contributes $O(1)$ work to both forward and backward passes (computing the local Jacobian and accumulating). The total backward cost is $c \\cdot T_f$ for a small constant $c$ (typically $c \\in [2,5]$ in practice). This follows from the chain rule structure: each edge in the computation graph is traversed once in each direction. $\\square$",corollaries:["JAX uses both modes: reverse mode for training (jax.grad), forward mode for Jacobian-vector products (jax.jvp) in second-order optimization.","Gradient checkpointing trades memory for compute: instead of storing all intermediate values, recompute them during the backward pass. Reduces memory from $O(L)$ to $O(\\sqrt{L})$ for depth-$L$ networks.","Higher-order derivatives: Hessian-vector products can be computed efficiently as $\\nabla(\\nabla f \\cdot \\mathbf{v})$ using a mix of forward and reverse mode — cost $O(T_f)$, not $O(n^2 T_f)$."]}),e.jsx(M,{title:"Forward-Mode AD with Dual Numbers",difficulty:"advanced",problem:"Using dual numbers, compute $f'(x)$ for $f(x) = x \\sin(x)$ at $x = \\pi/4$ by propagating $\\hat{x} = \\pi/4 + 1\\cdot\\varepsilon$ through the computation.",solution:[{step:"Initialize dual input",formula:"\\hat{x} = \\tfrac{\\pi}{4} + 1\\cdot\\varepsilon",explanation:"The ε-coefficient of 1 seeds the derivative dx/dx = 1."},{step:"Compute sin(x) in dual",formula:"\\sin(\\hat{x}) = \\sin(\\tfrac{\\pi}{4}) + \\cos(\\tfrac{\\pi}{4})\\cdot\\varepsilon = \\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}\\varepsilon",explanation:"sin rule: sin(a + bε) = sin(a) + b·cos(a)·ε."},{step:"Multiply x * sin(x)",formula:"\\hat{x}\\cdot\\sin(\\hat{x}) = \\frac{\\pi\\sqrt{2}}{8} + \\left(\\frac{\\sqrt{2}}{2}\\cdot 1 + \\frac{\\pi}{4}\\cdot\\frac{\\sqrt{2}}{2}\\right)\\varepsilon",explanation:"Product rule for dual numbers: (a+bε)(c+dε) = ac + (ad+bc)ε."},{step:"Read off derivative",formula:"f'(\\tfrac{\\pi}{4}) = \\frac{\\sqrt{2}}{2}\\left(1 + \\frac{\\pi}{4}\\right) \\approx 1.267",explanation:"The ε-coefficient of the result is the derivative. Verify: d/dx[x sin x] = sin x + x cos x evaluated at π/4."}]}),e.jsx(C,{title:"Autodiff Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"In-place operations:"}),` PyTorch's autograd requires the original tensor values for backward. In-place ops (e.g., x.add_(1)) can overwrite these, causing "RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation".`]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Detaching incorrectly:"})," Calling .detach() or wrapping in torch.no_grad() stops gradient flow. Common mistake: computing a loss quantity using detached variables, then backpropping through it (gradient is zero)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Memory: retaining the graph:"})," Calling backward() multiple times requires retain_graph=True but doubles memory cost. For second-order optimization (Hessians), use create_graph=True in the first backward call."]})]})}),e.jsx(W,{code:ze,title:"Forward-Mode AD (Dual Numbers) & Reverse-Mode AD (PyTorch)",runnable:!0})]})}const ot=Object.freeze(Object.defineProperty({__proto__:null,default:Te},Symbol.toStringTag,{value:"Module"})),H=[1,2,3,4,5,6,7,8],Q={"Edge [−1,2,−1]":[-1,2,-1],"Smooth [1,1,1]/3":[1/3,1/3,1/3],"Deriv [−1,0,1]":[-1,0,1]};function Se(t,b,o){const _=o,m=[...Array(_).fill(0),...t,...Array(_).fill(0)],x=b.length,a=[];for(let s=0;s<=m.length-x;s++){let l=0;for(let h=0;h<x;h++)l+=m[s+h]*b[h];a.push(Math.round(l*100)/100)}return a}function Re(){const[t,b]=$.useState("Edge [−1,2,−1]"),[o,_]=$.useState(1),[m,x]=$.useState(0),[a,s]=$.useState(0),l=Q[t],h=l.length,u=[...Array(m).fill(0),...H,...Array(m).fill(0)],d=Math.floor((u.length-h)/o)+1;Se(H,l,m);const i=[];for(let c=0;c<d;c++){let g=0;for(let v=0;v<h;v++)g+=u[c*o+v]*l[v];i.push(Math.round(g*100)/100)}const f=d-1,p=44,n=44,r=4,j=Math.max(1,...i.map(Math.abs));return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"1D Convolution Explorer"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Slide the kernel over the input signal and observe the output feature map."}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-500 dark:text-gray-400 mr-2",children:"Kernel:"}),Object.keys(Q).map(c=>e.jsx("button",{onClick:()=>{b(c),s(0)},className:`mr-1 rounded px-2 py-1 text-xs font-semibold ${t===c?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`,children:c},c))]}),e.jsxs("div",{className:"flex gap-3 items-center",children:[e.jsxs("label",{className:"text-xs text-gray-500 dark:text-gray-400",children:["Stride: ",o]}),e.jsx("input",{type:"range",min:1,max:3,value:o,onChange:c=>{_(+c.target.value),s(0)},className:"w-20"}),e.jsxs("label",{className:"text-xs text-gray-500 dark:text-gray-400",children:["Padding: ",m]}),e.jsx("input",{type:"range",min:0,max:2,value:m,onChange:c=>{x(+c.target.value),s(0)},className:"w-20"})]})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("svg",{width:Math.max(u.length*(p+r)+20,400),height:240,className:"block",children:[u.map((c,g)=>{const v=g<m||g>=m+H.length,k=g>=a*o&&g<a*o+h;return e.jsxs("g",{children:[e.jsx("rect",{x:10+g*(p+r),y:10,width:p,height:n,fill:k?"#c7d2fe":v?"#f3f4f6":"#f8fafc",stroke:k?"#6366f1":"#e5e7eb",strokeWidth:k?2:1,rx:4,className:"dark:stroke-gray-600"}),e.jsx("text",{x:10+g*(p+r)+p/2,y:10+n/2+5,textAnchor:"middle",fontSize:14,fontWeight:"600",fill:v?"#9ca3af":"#1f2937",className:"dark:fill-gray-200",children:c}),e.jsx("text",{x:10+g*(p+r)+p/2,y:10+n+14,textAnchor:"middle",fontSize:10,fill:"#9ca3af",children:g})]},g)}),e.jsx("text",{x:10,y:8,fontSize:10,fill:"#6b7280",className:"dark:fill-gray-400",children:"Input (padded)"}),l.map((c,g)=>{const v=10+(a*o+g)*(p+r);return e.jsxs("g",{children:[e.jsx("rect",{x:v,y:80,width:p,height:n,fill:"#ddd6fe",stroke:"#7c3aed",strokeWidth:2,rx:4}),e.jsx("text",{x:v+p/2,y:80+n/2+5,textAnchor:"middle",fontSize:12,fontWeight:"700",fill:"#5b21b6",children:c%1===0?c:c.toFixed(1)})]},g)}),e.jsx("text",{x:10,y:78,fontSize:10,fill:"#7c3aed",children:"Kernel"}),i.map((c,g)=>{const v=g===a,k=Math.abs(c)/j*35,L=175-(c>=0?k:0);return e.jsxs("g",{children:[e.jsx("rect",{x:10+g*(p+r),y:145,width:p,height:n,fill:v?"#fef3c7":"#f9fafb",stroke:v?"#f59e0b":"#e5e7eb",strokeWidth:v?2:1,rx:4,className:"dark:stroke-gray-600"}),e.jsx("text",{x:10+g*(p+r)+p/2,y:145+n/2+5,textAnchor:"middle",fontSize:11,fill:v?"#92400e":"#374151",fontWeight:v?"700":"400",className:"dark:fill-gray-200",children:c}),e.jsx("rect",{x:10+g*(p+r)+4,y:L+195,width:p-8,height:k,fill:c>=0?"rgba(99,102,241,0.4)":"rgba(239,68,68,0.3)",rx:2})]},g)}),e.jsxs("text",{x:10,y:143,fontSize:10,fill:"#6b7280",className:"dark:fill-gray-400",children:["Output (",i.length," values)"]})]})}),e.jsxs("div",{className:"flex gap-2 mt-4",children:[e.jsx("button",{onClick:()=>s(0),className:"rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",children:"Reset"}),e.jsx("button",{onClick:()=>s(c=>Math.max(0,c-1)),disabled:a<=0,className:"rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",children:"← Prev"}),e.jsx("button",{onClick:()=>s(c=>Math.min(f,c+1)),disabled:a>=f,className:"rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 disabled:opacity-40 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",children:"Next →"}),e.jsxs("span",{className:"ml-2 text-xs text-gray-500 dark:text-gray-400 self-center",children:["Output size = ⌊(L+2P−K)/S⌋+1 = ⌊(",H.length,"+",2*m,"−",h,")/",o,"⌋+1 = ",i.length]})]})]})}const Me=`import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# ── 1D Convolution ─────────────────────────────────────────────────────────────
x = torch.tensor([1.,2.,3.,4.,5.,6.,7.,8.]).unsqueeze(0).unsqueeze(0)  # [1,1,8]
kernel = torch.tensor([-1., 2., -1.]).unsqueeze(0).unsqueeze(0)        # [1,1,3]

# Manual convolution
out_no_pad = F.conv1d(x, kernel, padding=0, stride=1)
out_same    = F.conv1d(x, kernel, padding=1, stride=1)  # 'same' padding
out_stride2 = F.conv1d(x, kernel, padding=0, stride=2)

print(f"Input length: {x.shape[-1]}, Kernel: {kernel.shape[-1]}")
print(f"No padding (s=1): output length = {out_no_pad.shape[-1]}")
print(f"Padding=1 (s=1):  output length = {out_same.shape[-1]}    (same as input)")
print(f"Stride=2:         output length = {out_stride2.shape[-1]}")
print(f"Formula: floor((L + 2P - K) / S) + 1")

# ── 2D Convolution ─────────────────────────────────────────────────────────────
# Edge detection kernel (Sobel)
sobel_x = torch.tensor([[-1,0,1],[-2,0,2],[-1,0,1]], dtype=torch.float32)
sobel_y = torch.tensor([[-1,-2,-1],[0,0,0],[1,2,1]],  dtype=torch.float32)
# Reshape to [out_channels, in_channels/groups, H, W]
sobel_x = sobel_x.unsqueeze(0).unsqueeze(0)
sobel_y = sobel_y.unsqueeze(0).unsqueeze(0)

# Random "image"
img = torch.randn(1, 1, 32, 32)
edges_x = F.conv2d(img, sobel_x, padding=1)
edges_y = F.conv2d(img, sobel_y, padding=1)
edges   = torch.sqrt(edges_x**2 + edges_y**2)
print(f"\\n2D conv: input {tuple(img.shape)} → output {tuple(edges.shape)}")

# ── Learnable convolution layer ────────────────────────────────────────────────
conv_layer = nn.Conv2d(
    in_channels=3,  out_channels=64,
    kernel_size=3,  padding=1,  stride=1
)
x_rgb = torch.randn(8, 3, 32, 32)  # batch of 8 RGB 32x32 images
out = conv_layer(x_rgb)
print(f"\\nConv2d: {tuple(x_rgb.shape)} → {tuple(out.shape)}")
print(f"Parameters: {sum(p.numel() for p in conv_layer.parameters()):,}")
# = 64 * (3 * 3 * 3 + 1) = 64 * 28 = 1,792
# weight: [64, 3, 3, 3] = 1728, bias: [64] = 64

# ── Weight sharing: parameter efficiency ───────────────────────────────────────
fc_equiv = nn.Linear(3*32*32, 64*32*32)  # Fully connected equivalent
conv_params = sum(p.numel() for p in conv_layer.parameters())
fc_params   = sum(p.numel() for p in fc_equiv.parameters())
print(f"\\nConv params: {conv_params:,}  vs  FC params: {fc_params:,}")
print(f"Ratio: {fc_params/conv_params:.0f}x more params for FC")
`;function Ce(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Convolution Operation"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Discrete convolution, feature maps, padding, and stride — the core building block of convolutional neural networks and a pillar of modern AI for image and sequence data."})]}),e.jsx(R,{title:"Convolution in Signal Processing vs Deep Learning",children:e.jsxs("p",{children:["In signal processing, convolution is ",e.jsx(T.InlineMath,{math:"(f*g)[n] = \\sum_k f[k]g[n-k]"})," ","(note the flip of ",e.jsx(T.InlineMath,{math:"g"}),"). In deep learning, the operation is technically cross-correlation ",e.jsx(T.InlineMath,{math:"(f \\star g)[n] = \\sum_k f[k]g[n+k]"})," (no flip). Since the kernel is learned, the distinction is irrelevant — the network learns the flipped kernel anyway. LeNet-5 (LeCun et al., 1998) first demonstrated CNNs for digit recognition; AlexNet (Krizhevsky et al., 2012) launched the modern deep learning era."]})}),e.jsx(N,{label:"Definition 3.1",title:"Discrete 2D Convolution",definition:"The 2D discrete convolution (cross-correlation) of input $X \\in \\mathbb{R}^{H \\times W}$ with kernel $K \\in \\mathbb{R}^{k_H \\times k_W}$ is: $(X \\star K)_{i,j} = \\sum_{m=0}^{k_H-1}\\sum_{n=0}^{k_W-1} X_{i+m, j+n} \\cdot K_{m,n}$. The output feature map has dimensions $H_{out} = \\lfloor(H + 2P - k_H)/S\\rfloor + 1$ and $W_{out} = \\lfloor(W + 2P - k_W)/S\\rfloor + 1$, where $P$ is padding and $S$ is stride.",notation:"For $C_{in}$ input channels and $C_{out}$ output channels: $Y_c = \\sum_{c'=1}^{C_{in}} X_{c'} \\star K_{c,c'} + b_c$. Total parameters: $C_{out} \\cdot C_{in} \\cdot k_H \\cdot k_W + C_{out}$ (biases). Weight sharing: the same kernel $K_{c,c'}$ is applied to every spatial location — enabling translation equivariance."}),e.jsx(Re,{}),e.jsx(N,{label:"Definition 3.2",title:"Padding and Stride",definition:"Padding adds $P$ zeros around the input border before convolution. 'Valid' padding ($P=0$) reduces spatial dimensions; 'same' padding ($P = \\lfloor k/2 \\rfloor$) preserves input size for stride 1. Stride $S$ controls the step size of the kernel sliding window — stride 2 halves the spatial dimensions (like 2× downsampling). Dilated/atrous convolution uses a dilation rate $d$: kernel elements are spaced $d$ apart, expanding the receptive field without increasing parameters: effective kernel size $(k-1)d + 1$.",notation:"Receptive field of output neuron at layer $l$ with kernel size $k$ and stride $s$: $r_l = r_{l-1} + (k-1) \\cdot \\prod_{i=1}^{l-1} s_i$. For a stack of $L$ layers with $k=3, s=1$: $r_L = 2L+1$ — grows linearly with depth."}),e.jsx(S,{label:"Theorem 3.1",title:"Translation Equivariance of Convolution",statement:"Convolution is translation equivariant: if $T_\\tau$ denotes a spatial translation by $\\tau$ (i.e., $T_\\tau X = X[\\cdot - \\tau]$), then $(T_\\tau X) \\star K = T_\\tau (X \\star K)$. This means detecting a feature at position $\\tau$ in the input produces a response at position $\\tau$ in the output feature map — the detector translates with the input.",proof:"$(T_\\tau X \\star K)[n] = \\sum_k X[n+\\tau-k] K[k] = (X \\star K)[n+\\tau] = T_\\tau(X \\star K)[n]$. The translation simply shifts the output feature map by $\\tau$. This follows from the commutativity of translation and convolution, a consequence of shift-invariant kernel weighting. $\\square$",corollaries:["Equivariance enables weight sharing: one kernel suffices to detect a feature anywhere in the image, giving exponential parameter efficiency over fully-connected layers.","Pooling (max-pool, average-pool) converts equivariance to approximate invariance by summarizing local regions — making CNNs robust to small translations.","CNNs are not invariant to rotation or scale — data augmentation (random rotations, flips, crops) or specialized architectures (group-equivariant CNNs) are needed."]}),e.jsx(M,{title:"Computing a 2D Convolution by Hand",difficulty:"intermediate",problem:"Apply a 3×3 edge-detection kernel $K = [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]$ to the 4×4 input $X$ (no padding, stride 1). What is the output size and the value at position (0,0)?",solution:[{step:"Output size formula",formula:"H_{out} = \\lfloor(4 + 0 - 3)/1\\rfloor + 1 = 2, \\quad W_{out} = 2",explanation:"No padding (P=0), stride S=1, kernel 3×3. Output is 2×2."},{step:"Compute output at (0,0)",formula:"Y_{0,0} = \\sum_{m,n} X_{m,n} K_{m,n}",explanation:"Sum over the 3×3 top-left patch of X multiplied element-wise with K."},{step:"Example with X uniform=5 except center=8",formula:"Y_{0,0} = -1(5)-1(5)-1(5)-1(5)+8(5)-1(5)-1(5)-1(5)-1(8)",explanation:"Most of the patch is 5, center changes. This shows edge-detection: uniform regions give output near 0."},{step:"Interpretation",formula:"Y \\approx 0 \\text{ (smooth region)}, Y \\gg 0 \\text{ (edge/blob)}",explanation:"The Laplacian-like kernel responds to local intensity changes — a classic image edge detector."}]}),e.jsx(C,{title:"Convolution Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Convolution vs cross-correlation:"})," PyTorch's nn.Conv2d implements cross-correlation (no kernel flip). This is fine for learning but be careful when comparing to signal processing literature."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Padding for 'same' output:"})," For even kernel sizes (k=2,4,...), 'same' padding requires asymmetric padding. PyTorch's padding= parameter adds equal padding on both sides — use nn.ZeroPad2d for asymmetric cases."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Strided vs pooling downsampling:"})," Strided convolution (modern practice) is learnable and avoids the checkerboard artifacts of transposed convolution. Max-pooling is non-differentiable at ties — PyTorch uses the first maximum by convention."]})]})}),e.jsx(W,{code:Me,title:"1D & 2D Convolution — PyTorch",runnable:!0})]})}const lt=Object.freeze(Object.defineProperty({__proto__:null,default:Ce},Symbol.toStringTag,{value:"Module"})),ee={LeNet:[{type:"Conv",filters:6,size:"5×5",outH:28,color:"#818cf8"},{type:"Pool",filters:6,size:"2×2",outH:14,color:"#a5b4fc"},{type:"Conv",filters:16,size:"5×5",outH:10,color:"#818cf8"},{type:"Pool",filters:16,size:"2×2",outH:5,color:"#a5b4fc"},{type:"FC",filters:120,size:"",outH:1,color:"#6ee7b7"},{type:"FC",filters:84,size:"",outH:1,color:"#6ee7b7"},{type:"FC",filters:10,size:"",outH:1,color:"#fca5a5"}],VGG16:[{type:"Conv×2",filters:64,size:"3×3",outH:224,color:"#818cf8"},{type:"Pool",filters:64,size:"2×2",outH:112,color:"#a5b4fc"},{type:"Conv×2",filters:128,size:"3×3",outH:112,color:"#818cf8"},{type:"Pool",filters:128,size:"2×2",outH:56,color:"#a5b4fc"},{type:"Conv×3",filters:256,size:"3×3",outH:56,color:"#818cf8"},{type:"Pool",filters:256,size:"2×2",outH:28,color:"#a5b4fc"},{type:"Conv×3",filters:512,size:"3×3",outH:28,color:"#818cf8"},{type:"Pool",filters:512,size:"2×2",outH:14,color:"#a5b4fc"},{type:"Conv×3",filters:512,size:"3×3",outH:14,color:"#818cf8"},{type:"Pool",filters:512,size:"2×2",outH:7,color:"#a5b4fc"},{type:"FC",filters:4096,size:"",outH:1,color:"#6ee7b7"},{type:"FC",filters:1e3,size:"",outH:1,color:"#fca5a5"}],ResNet:[{type:"Conv",filters:64,size:"7×7",outH:112,color:"#818cf8"},{type:"Pool",filters:64,size:"3×3",outH:56,color:"#a5b4fc"},{type:"Res×3",filters:64,size:"3×3",outH:56,color:"#fbbf24"},{type:"Res×4",filters:128,size:"3×3",outH:28,color:"#fbbf24"},{type:"Res×6",filters:256,size:"3×3",outH:14,color:"#fbbf24"},{type:"Res×3",filters:512,size:"3×3",outH:7,color:"#fbbf24"},{type:"GAP",filters:512,size:"",outH:1,color:"#6ee7b7"},{type:"FC",filters:1e3,size:"",outH:1,color:"#fca5a5"}]};function We(){const[t,b]=$.useState("ResNet"),[o,_]=$.useState(null),m=ee[t],x=48,a=8,s=m.length*(x+a)+20,l=220,h=Math.max(...m.map(d=>d.outH)),u=d=>Math.max(12,d/h*140);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"CNN Architecture Stack"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Bar height ∝ spatial resolution. Bar color shows layer type. Hover for details."}),e.jsx("div",{className:"flex gap-2 mb-4",children:Object.keys(ee).map(d=>e.jsx("button",{onClick:()=>{b(d),_(null)},className:`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${t===d?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`,children:d},d))}),e.jsx("div",{className:"overflow-x-auto",children:e.jsx("svg",{width:s,height:l+40,className:"block",children:m.map((d,i)=>{const f=u(d.outH),p=10+i*(x+a),n=l-f,r=o===i;return e.jsxs("g",{onMouseEnter:()=>_(i),onMouseLeave:()=>_(null),className:"cursor-pointer",children:[e.jsx("rect",{x:p,y:n,width:x,height:f,fill:d.color,opacity:r?1:.8,rx:4,stroke:r?"#1f2937":"none",strokeWidth:2}),e.jsx("text",{x:p+x/2,y:l+14,textAnchor:"middle",fontSize:9,fill:"#6b7280",className:"dark:fill-gray-400",children:d.type}),e.jsx("text",{x:p+x/2,y:l+25,textAnchor:"middle",fontSize:9,fill:"#9ca3af",className:"dark:fill-gray-500",children:d.filters})]},i)})})}),o!==null&&e.jsxs("div",{className:"mt-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm",children:[e.jsx("strong",{children:m[o].type})," — ",m[o].filters," filters/channels,",m[o].size&&e.jsxs(e.Fragment,{children:[" kernel ",m[o].size,","]})," spatial ",m[o].outH,"×",m[o].outH]}),e.jsx("div",{className:"mt-3 flex gap-4 flex-wrap text-xs",children:[["#818cf8","Conv"],["#a5b4fc","Pool"],["#fbbf24","Residual Block"],["#6ee7b7","FC/GAP"],["#fca5a5","Output"]].map(([d,i])=>e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"inline-block w-3 h-3 rounded",style:{background:d}}),e.jsx("span",{className:"text-gray-600 dark:text-gray-400",children:i})]},i))})]})}const Ae=`import torch
import torch.nn as nn
import torch.nn.functional as F

# ── LeNet-5 (simplified) ───────────────────────────────────────────────────────
class LeNet5(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 6, kernel_size=5, padding=2),   nn.ReLU(), nn.AvgPool2d(2, 2),
            nn.Conv2d(6, 16, kernel_size=5),              nn.ReLU(), nn.AvgPool2d(2, 2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(16*5*5, 120), nn.ReLU(),
            nn.Linear(120, 84),     nn.ReLU(),
            nn.Linear(84, num_classes),
        )
    def forward(self, x): return self.classifier(self.features(x))

# ── ResNet Residual Block ──────────────────────────────────────────────────────
class ResBlock(nn.Module):
    """Basic residual block with skip connection: y = F(x, W) + x"""
    def __init__(self, channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(channels)
        # Shortcut (identity or 1x1 conv for dimension matching)
        self.shortcut = nn.Identity() if stride == 1 else                         nn.Sequential(nn.Conv2d(channels, channels, 1, stride=stride, bias=False),
                                      nn.BatchNorm2d(channels))

    def forward(self, x):
        residual = self.shortcut(x)
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        return F.relu(out + residual)  # Skip connection!

# ── Demonstrate vanishing gradient fix via residual connection ─────────────────
def grad_norm(model, x, y):
    """Compute gradient norm for the first layer."""
    loss = F.cross_entropy(model(x), y)
    loss.backward()
    first_layer = list(model.parameters())[0]
    return first_layer.grad.norm().item()

# Plain network (no skip connections)
class PlainBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(channels)
    def forward(self, x):
        return F.relu(self.bn2(self.conv2(F.relu(self.bn1(self.conv1(x))))))

# Stack many blocks and compare gradient flow
def build_net(BlockClass, n_blocks, channels=16):
    blocks = [nn.Conv2d(3, channels, 3, padding=1)]
    for _ in range(n_blocks):
        blocks.append(BlockClass(channels))
    blocks += [nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(channels, 10)]
    return nn.Sequential(*blocks)

x = torch.randn(4, 3, 32, 32)
y = torch.randint(0, 10, (4,))

for n in [4, 8, 16]:
    plain = build_net(PlainBlock, n)
    resnet = build_net(ResBlock, n)
    print(f"Depth {n*2+3}:")
    print(f"  Plain  grad norm: {grad_norm(plain, x, y):.4f}")
    plain.zero_grad()
    print(f"  ResNet grad norm: {grad_norm(resnet, x.clone(), y):.4f}")
    resnet.zero_grad()
`;function Fe(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"CNN Architectures"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"The evolution from LeNet to VGG to ResNet — how skip connections solved the vanishing gradient problem and enabled training of very deep networks."})]}),e.jsx(R,{title:"Architecture Evolution",children:e.jsx("p",{children:"LeNet-5 (LeCun, 1998) pioneered CNNs for handwritten digit recognition. AlexNet (2012) scaled up with GPU training, ReLU, and dropout. VGG (Simonyan & Zisserman, 2014) systematized design with 3×3 kernels. GoogLeNet/Inception (2014) introduced parallel multi-scale convolutions. ResNet (He et al., 2015) enabled 152-layer training via skip connections, winning ILSVRC 2015. Modern variants: DenseNet, EfficientNet, ConvNeXt, ViT."})}),e.jsx(N,{label:"Definition 3.3",title:"Residual Block & Skip Connections",definition:"A residual block computes $\\mathbf{y} = F(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x}$ where $F$ is a stack of 2-3 convolutions with BatchNorm and ReLU, and $\\mathbf{x}$ is the identity shortcut. When dimensions differ (stride > 1 or channel change), a 1×1 convolution $W_s$ matches dimensions: $\\mathbf{y} = F(\\mathbf{x}) + W_s\\mathbf{x}$. ResNet-50+ uses bottleneck blocks with 1×1→3×3→1×1 convolutions to reduce computation.",notation:"The block learns the residual $F(\\mathbf{x}) = H(\\mathbf{x}) - \\mathbf{x}$ rather than the full mapping $H(\\mathbf{x})$. If the optimal mapping is near-identity (common in deep networks), residual learning makes $F \\approx 0$ easier to optimize than $H \\approx \\mathbf{x}$. Depth-1 and depth-2 residual blocks are both common."}),e.jsx(We,{}),e.jsx(N,{label:"Definition 3.4",title:"VGG Design Philosophy",definition:"VGG replaces large kernels (5×5, 7×7) with stacks of 3×3 convolutions: two 3×3 convolutions have the same receptive field as one 5×5, but fewer parameters ($2 \\cdot 3^2 C^2 = 18C^2$ vs $5^2 C^2 = 25C^2$) and an additional nonlinearity. VGG uses max-pooling for spatial downsampling (halving dimensions) and doubles the number of filters after each pooling, maintaining computational cost. The pattern: [Conv×2-3, MaxPool] × 5, FC × 3.",notation:"VGG-16: 13 conv layers + 3 FC = 16 weight layers. 138M parameters (mostly in FC layers). Modern practice: replace FC layers with Global Average Pooling (GAP) — reduces params from 102M to 0 for FC part, while often improving generalization."}),e.jsx(S,{label:"Theorem 3.2",title:"Residual Networks Solve Vanishing Gradients",statement:"In a plain (non-residual) network, the gradient of the loss with respect to layer $l$ parameters satisfies $\\|\\partial \\mathcal{L}/\\partial W^{(l)}\\| \\leq C^{L-l} \\cdot \\|\\partial \\mathcal{L}/\\partial W^{(L)}\\|$ for some $C < 1$, leading to exponential decay. With residual connections, the gradient path includes a direct path: $\\partial \\mathcal{L}/\\partial \\mathbf{x}^{(l)} = \\partial \\mathcal{L}/\\partial \\mathbf{x}^{(L)} \\cdot \\prod_{k=l}^{L-1}(1 + \\partial F_k/\\partial \\mathbf{x}^{(k)})$, which always includes the additive term 1, preventing gradient vanishing.",proof:"In a residual network: $\\mathbf{x}^{(l+1)} = \\mathbf{x}^{(l)} + F_l(\\mathbf{x}^{(l)})$. By the chain rule: $\\frac{\\partial \\mathbf{x}^{(L)}}{\\partial \\mathbf{x}^{(l)}} = \\prod_{k=l}^{L-1}\\left(I + \\frac{\\partial F_k}{\\partial \\mathbf{x}^{(k)}}\\right)$. Expanding the product: $= I + \\sum_k \\frac{\\partial F_k}{\\partial \\mathbf{x}^{(k)}} + \\text{cross terms}$. The identity term $I$ provides a direct gradient path from output to any layer, preventing the gradient from vanishing even if all $\\partial F_k/\\partial \\mathbf{x}^{(k)} \\approx 0$. $\\square$",corollaries:["ResNets can be viewed as ensembles of networks of varying depth: the skip connections create $2^L$ paths of different lengths through $L$ residual blocks.",'Unrolled residual networks ("neural ODEs") led to continuous-depth models where depth is a differential equation parameter.',"Skip connections also appear in: DenseNet (dense connections to all previous layers), U-Net (encoder-decoder with skip connections for segmentation), and Transformers (residual around each attention and FFN block)."]}),e.jsx(M,{title:"Computing VGG-16 Parameters",difficulty:"intermediate",problem:"Count the parameters in VGG-16's first two convolutional blocks: Block 1 (2× Conv 3×3, 64 filters from 3 channels), Block 2 (2× Conv 3×3, 128 filters from 64 channels).",solution:[{step:"Block 1: Conv 3×3, 3→64",formula:"2 \\times (3 \\times 3 \\times 3 \\times 64 + 64) = 2 \\times 1792 = 3584",explanation:"Each conv: kernel_h × kernel_w × in_channels × out_channels + bias. Two such convs."},{step:"Block 2: Conv 3×3, 64→128",formula:"2 \\times (3 \\times 3 \\times 64 \\times 128 + 128) = 2 \\times 73856 = 147712",explanation:"73,856 per conv layer. Doubling channels quadruples parameters."},{step:"FC layers dominate",formula:"7 \\times 7 \\times 512 \\times 4096 + 4096 \\times 4096 + 4096 \\times 1000 \\approx 102M",explanation:"The three FC layers account for ~74% of VGG-16's 138M total parameters."},{step:"Global Average Pooling alternative",formula:"512 \\times 1000 + 1000 = 513000 \\text{ params for FC part}",explanation:"GAP (1 FC from 512 to 1000 instead of three FCs) reduces FC parameters by 200×, reducing overfitting."}]}),e.jsx(C,{title:"CNN Architecture Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Pooling too aggressively:"})," Reducing spatial dimensions too fast (large strides or many pooling layers early) loses fine-grained spatial information needed for dense prediction tasks (segmentation, detection). Use dilated convolutions or feature pyramid networks instead."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Depth without skip connections:"})," Plain networks beyond 20-30 layers suffer from degradation (worse training error, not just overfitting) due to optimization difficulties. Always use residual/dense connections for very deep networks."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Batch normalization placement:"})," The original ResNet places BN before ReLU (pre-activation ResNet, He et al. 2016b) which often performs better than the original post-activation order. Check which convention your framework uses."]})]})}),e.jsx(W,{code:Ae,title:"LeNet, ResNet Block — PyTorch Implementation",runnable:!0})]})}const dt=Object.freeze(Object.defineProperty({__proto__:null,default:Fe},Symbol.toStringTag,{value:"Module"})),G=5,te=["The","cat","sat","on","mat"];function Ue(){const[t,b]=$.useState(0),[o,_]=$.useState(!1),m=560,x=200,a=m/G,s=80,l=160,h=22,u=d=>Math.pow(.5,t-d);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Unrolled RNN: Hidden State Flow"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Click a timestep to see how the hidden state propagates and how gradients decay during BPTT."}),e.jsx("div",{className:"flex gap-3 mb-4",children:e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300",children:[e.jsx("input",{type:"checkbox",checked:o,onChange:d=>_(d.target.checked)}),"Show gradient flow (darker = stronger gradient)"]})}),e.jsxs("svg",{width:m,height:x,className:"mx-auto block",children:[Array.from({length:G-1},(d,i)=>{const f=(i+.5)*a+h,p=(i+1.5)*a-h,n=i<t;return e.jsxs("g",{children:[e.jsx("line",{x1:f,y1:s,x2:p,y2:s,stroke:n?"#6366f1":"#e5e7eb",strokeWidth:n?2.5:1.5,className:n?"":"dark:stroke-gray-600"}),e.jsx("polygon",{points:`${p},${s} ${p-8},${s-4} ${p-8},${s+4}`,fill:n?"#6366f1":"#e5e7eb"})]},`h${i}`)}),o&&Array.from({length:t},(d,i)=>{const f=t-1-i,p=(f+1.5)*a-h-4,n=(f+.5)*a+h+4,r=u(f+1);return e.jsxs("g",{children:[e.jsx("line",{x1:p,y1:s+14,x2:n,y2:s+14,stroke:`rgba(239,68,68,${r})`,strokeWidth:1+r*2,strokeDasharray:"4,2"}),e.jsx("polygon",{points:`${n},${s+14} ${n+6},${s+10} ${n+6},${s+18}`,fill:`rgba(239,68,68,${r})`})]},`grad${f}`)}),Array.from({length:G},(d,i)=>{const f=(i+.5)*a,p=i<=t;return e.jsx("g",{children:e.jsx("line",{x1:f,y1:l-8,x2:f,y2:s+h,stroke:p?"#10b981":"#e5e7eb",strokeWidth:1.5,className:p?"":"dark:stroke-gray-600"})},`in${i}`)}),Array.from({length:G},(d,i)=>{const f=(i+.5)*a,p=i<=t,n=i===t;return e.jsxs("g",{onClick:()=>b(i),className:"cursor-pointer",children:[e.jsx("circle",{cx:f,cy:s,r:h,fill:n?"#4f46e5":p?"#818cf8":"#e5e7eb",stroke:n?"#312e81":"#fff",strokeWidth:n?2.5:2}),e.jsxs("text",{x:f,y:s+4,textAnchor:"middle",fontSize:10,fontWeight:"600",fill:p?"#fff":"#6b7280",children:["h",i]})]},`node${i}`)}),te.map((d,i)=>{const f=(i+.5)*a,p=i<=t;return e.jsxs("g",{onClick:()=>b(i),className:"cursor-pointer",children:[e.jsx("rect",{x:f-24,y:l,width:48,height:22,rx:4,fill:p?"#d1fae5":"#f3f4f6",stroke:p?"#10b981":"#e5e7eb",strokeWidth:1}),e.jsx("text",{x:f,y:l+14,textAnchor:"middle",fontSize:11,fontWeight:"600",fill:p?"#065f46":"#6b7280",children:d})]},`tok${i}`)}),e.jsx("text",{x:5,y:s+5,fontSize:9,fill:"#9ca3af",children:"h_t"}),e.jsx("text",{x:5,y:l+14,fontSize:9,fill:"#9ca3af",children:"x_t"})]}),e.jsxs("div",{className:"mt-3 text-sm text-gray-600 dark:text-gray-400 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3",children:[e.jsxs("strong",{children:["Step ",t,":"]}),' After processing "',te.slice(0,t+1).join(" "),'", hidden state h',t," encodes context from all previous tokens.",o&&t>0&&e.jsxs("span",{className:"ml-2 text-rose-600 dark:text-rose-400",children:["Gradient to h0 is ",u(0).toFixed(3)," of gradient at h",t," (×",.5.toFixed(1)," per step)."]})]})]})}const Pe=`import torch
import torch.nn as nn
import numpy as np

# ── Vanilla RNN manual implementation ─────────────────────────────────────────
class VanillaRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.hidden_size = hidden_size
        # Weight matrices
        self.W_xh = nn.Linear(input_size, hidden_size)   # input → hidden
        self.W_hh = nn.Linear(hidden_size, hidden_size, bias=False)  # hidden → hidden
        self.W_hy = nn.Linear(hidden_size, output_size)  # hidden → output

    def forward(self, x, h_0=None):
        """
        x: [batch, seq_len, input_size]
        Returns: outputs [batch, seq_len, output_size], final hidden state
        """
        B, T, _ = x.shape
        h = h_0 if h_0 is not None else torch.zeros(B, self.hidden_size)
        outputs = []
        for t in range(T):
            h = torch.tanh(self.W_xh(x[:, t, :]) + self.W_hh(h))
            y_t = self.W_hy(h)
            outputs.append(y_t)
        return torch.stack(outputs, dim=1), h

# Using PyTorch's built-in RNN
rnn = nn.RNN(input_size=10, hidden_size=32, num_layers=2,
             batch_first=True, dropout=0.3)
x = torch.randn(4, 20, 10)  # [batch=4, seq=20, features=10]
out, hn = rnn(x)
print(f"RNN output: {out.shape}, final hidden: {hn.shape}")

# ── BPTT (Backprop Through Time) gradient analysis ────────────────────────────
def check_gradient_flow(seq_len, hidden_size=32):
    """Measure gradient magnitude at each timestep."""
    rnn = VanillaRNN(5, hidden_size, 1)
    x = torch.randn(1, seq_len, 5)
    out, _ = rnn(x)
    loss = out[:, -1, :].sum()  # Only final output contributes to loss
    loss.backward()

    # Gradient of W_hh measures how much early inputs matter
    grad = rnn.W_hh.weight.grad
    return grad.norm().item()

print("\\nGradient analysis (tanh RNN):")
for T in [5, 10, 20, 50]:
    g = check_gradient_flow(T)
    bar = '█' * max(1, int(g * 50))
    print(f"  T={T:2d}: grad_norm = {g:.4f}  {bar}")

# ── Vanishing gradient: eigenvalue analysis ────────────────────────────────────
def max_eigenvalue_effect(W_hh, n_steps):
    """Simulate gradient magnitude after n_steps of BPTT."""
    # Gradient is proportional to W_hh^n_steps (approx for linear case)
    W = W_hh.detach().numpy()
    eigenvalues = np.linalg.eigvals(W)
    spectral_radius = max(abs(eigenvalues))
    # Gradient magnitude decays/explodes as spectral_radius^n_steps
    return spectral_radius ** n_steps

rnn_model = VanillaRNN(5, 8, 1)
print(f"\\nSpectral radius of W_hh: {max(abs(np.linalg.eigvals(rnn_model.W_hh.weight.detach().numpy()))):.4f}")
for n in [5, 10, 20]:
    effect = max_eigenvalue_effect(rnn_model.W_hh.weight, n)
    print(f"  After {n:2d} steps: gradient effect = {effect:.6f}")
`;function De(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Vanilla RNN"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Recurrent computation, backpropagation through time, and the vanishing gradient problem — why simple RNNs struggle with long-range dependencies."})]}),e.jsx(R,{title:"RNN History",children:e.jsx("p",{children:"Recurrent networks were proposed by Jordan (1986) and Elman (1990). The BPTT algorithm (Werbos 1990, Williams & Zipser 1995) extends backprop to sequences. The vanishing gradient problem was identified by Hochreiter (1991) and analyzed rigorously by Hochreiter & Schmidhuber (1997), who proposed LSTM as the solution. Vanilla RNNs are now primarily used for teaching; practical sequence models use LSTM, GRU, or Transformers."})}),e.jsx(N,{label:"Definition 4.1",title:"Vanilla RNN",definition:"A recurrent neural network (RNN) processes a sequence $(\\mathbf{x}_1, \\ldots, \\mathbf{x}_T)$ by maintaining a hidden state $\\mathbf{h}_t$ that summarizes past inputs. At each timestep: $\\mathbf{h}_t = \\tanh(W_{hh}\\mathbf{h}_{t-1} + W_{xh}\\mathbf{x}_t + \\mathbf{b}_h)$, $\\hat{\\mathbf{y}}_t = W_{hy}\\mathbf{h}_t + \\mathbf{b}_y$. The same weight matrices $W_{hh}, W_{xh}, W_{hy}$ are shared across all timesteps (parameter sharing in time).",notation:"$W_{hh} \\in \\mathbb{R}^{H \\times H}$ is the recurrent weight matrix, $W_{xh} \\in \\mathbb{R}^{H \\times D}$ maps input to hidden, $W_{hy} \\in \\mathbb{R}^{C \\times H}$ maps hidden to output. $H$ is hidden size, $D$ input dimension, $C$ output dimension. Total parameters: $H^2 + HD + CH + H + C$ — independent of sequence length $T$."}),e.jsx(Ue,{}),e.jsx(N,{label:"Definition 4.2",title:"Backpropagation Through Time (BPTT)",definition:"BPTT computes gradients for RNNs by unrolling the recurrence for $T$ timesteps and applying standard backpropagation. The gradient of loss $\\mathcal{L}$ with respect to the hidden state at time $t$ satisfies: $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_T} \\prod_{k=t}^{T-1} \\frac{\\partial \\mathbf{h}_{k+1}}{\\partial \\mathbf{h}_k}$, where $\\partial \\mathbf{h}_{k+1}/\\partial \\mathbf{h}_k = W_{hh}^\\top \\text{diag}(\\tanh'(\\mathbf{z}_k))$.",notation:"Truncated BPTT limits the unrolling to $\\tau < T$ steps to reduce memory and computation. Full BPTT requires $O(T)$ memory for the hidden state tape. The product of $T$ Jacobians is the source of vanishing/exploding gradients."}),e.jsx(S,{label:"Theorem 4.1",title:"Vanishing & Exploding Gradients in RNNs",statement:"For a vanilla RNN with $\\tanh$ activation and recurrent matrix $W_{hh}$, the gradient $\\partial \\mathcal{L}/\\partial \\mathbf{h}_t$ decays to zero exponentially in $(T-t)$ if the spectral radius $\\rho(W_{hh}) < 1$, and grows unboundedly if $\\rho(W_{hh}) > 1$. Specifically, $\\|\\partial \\mathbf{h}_{t+1}/\\partial \\mathbf{h}_t\\|_2 \\leq \\|W_{hh}\\|_2 \\cdot \\max_k|\\tanh'(z_k)| \\leq \\|W_{hh}\\|_2$, so $\\|\\partial \\mathcal{L}/\\partial \\mathbf{h}_t\\| \\leq C \\cdot \\|W_{hh}\\|_2^{T-t}$.",proof:"The Jacobian $\\partial \\mathbf{h}_{k+1}/\\partial \\mathbf{h}_k = \\text{diag}(\\tanh'(\\mathbf{z}_k)) W_{hh}$. Since $|\\tanh'(z)| \\leq 1$, the spectral norm is bounded by $\\|W_{hh}\\|_2$. The product of $(T-t)$ such matrices satisfies $\\|\\prod_k J_k\\|_2 \\leq \\prod_k \\|J_k\\|_2 \\leq \\|W_{hh}\\|_2^{T-t}$ (submultiplicativity). If $\\|W_{hh}\\|_2 < 1$: exponential decay. If $> 1$: exponential growth. For typical random initialization with $\\|W_{hh}\\|_2 \\approx \\sqrt{H}$, gradients explode in deep (long) sequences. $\\square$",corollaries:["Gradient clipping (clip gradient norm to a threshold, e.g., 5.0) mitigates exploding gradients but not vanishing ones.","LSTM and GRU address vanishing gradients via gating mechanisms that create additive (not multiplicative) gradient paths.",'The "stable" training regime requires $\\rho(W_{hh}) \\approx 1$ (edge of chaos), achievable with careful initialization (orthogonal) or spectral normalization.']}),e.jsx(M,{title:"Manual RNN Forward Pass for Language Modeling",difficulty:"advanced",problem:"Given a 2-step RNN with $h_0 = [0, 0]$, $W_{hh} = [[0.5, 0.1], [0.1, 0.5]]$, $W_{xh} = [[1, 0], [0, 1]]$, $\\tanh$ activation, and inputs $x_1 = [1, 0]$, $x_2 = [0, 1]$, compute $h_1$ and $h_2$.",solution:[{step:"Compute h₁",formula:"\\mathbf{z}_1 = W_{hh}\\mathbf{h}_0 + W_{xh}\\mathbf{x}_1 = [0,0] + [1,0] = [1, 0]",explanation:"Initial hidden state is zero. Input [1,0] is added directly."},{step:"Apply tanh",formula:"\\mathbf{h}_1 = \\tanh([1, 0]) = [0.762, 0.000]",explanation:"tanh(1)=0.762, tanh(0)=0. First dimension activated by first input."},{step:"Compute z₂",formula:"\\mathbf{z}_2 = W_{hh}\\mathbf{h}_1 + W_{xh}\\mathbf{x}_2 = [0.381, 0.076] + [0, 1] = [0.381, 1.076]",explanation:"Previous hidden state is transformed by W_hh and added to new input."},{step:"Compute h₂",formula:"\\mathbf{h}_2 = \\tanh([0.381, 1.076]) \\approx [0.364, 0.793]",explanation:"h₂ encodes both x₁ (via h₁) and x₂. The recurrence mixes past and present."}]}),e.jsx(C,{title:"Vanilla RNN Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Long-range dependencies:"})," Vanilla RNNs cannot reliably learn dependencies spanning more than ~10-20 timesteps due to vanishing gradients. Use LSTM or GRU for longer contexts."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Gradient clipping is necessary:"})," Always clip gradients when training RNNs (torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5)). Without clipping, exploding gradients crash training."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sequence length and memory:"})," BPTT requires storing all hidden states for the entire sequence. For very long sequences (e.g., 10k+ tokens), use truncated BPTT or switch to attention-based models (Transformers) that avoid recurrence."]})]})}),e.jsx(W,{code:Pe,title:"Vanilla RNN — Implementation & Gradient Analysis",runnable:!0})]})}const ct=Object.freeze(Object.defineProperty({__proto__:null,default:De},Symbol.toStringTag,{value:"Module"}));function X(t){return 1/(1+Math.exp(-t))}function qe(){const[t,b]=$.useState(.8),[o,_]=$.useState(.5),[m,x]=$.useState(.7),[a,s]=$.useState(.6),[l,h]=$.useState(1),u=X(t),d=X(o),i=Math.tanh(m),f=X(a),p=u*l+d*i,n=f*Math.tanh(p),r=({val:c,color:g,label:v})=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs w-5 text-right text-gray-500",children:v}),e.jsx("div",{className:"flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-3",children:e.jsx("div",{className:"rounded-full h-3 transition-all",style:{width:`${Math.abs(c)*100}%`,backgroundColor:g}})}),e.jsx("span",{className:"text-xs font-mono w-12 text-gray-700 dark:text-gray-300",children:c.toFixed(3)})]}),j=({label:c,value:g,onChange:v,color:k})=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs w-20 font-semibold",style:{color:k},children:c}),e.jsx("input",{type:"range",min:-4,max:4,step:.1,value:g,onChange:L=>v(parseFloat(L.target.value)),className:"flex-1"}),e.jsx("span",{className:"text-xs font-mono w-12 text-gray-500",children:g.toFixed(1)})]});return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"LSTM Gate Simulator"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Adjust gate logits to see how the cell state and hidden state are computed."}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400",children:"Gate Logits"}),e.jsx(j,{label:"Forget (f)",value:t,onChange:b,color:"#ef4444"}),e.jsx(j,{label:"Input (i)",value:o,onChange:_,color:"#6366f1"}),e.jsx(j,{label:"Cell gate (g)",value:m,onChange:x,color:"#10b981"}),e.jsx(j,{label:"Output (o)",value:a,onChange:s,color:"#f59e0b"}),e.jsxs("div",{className:"flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700",children:[e.jsx("span",{className:"text-xs w-20 font-semibold text-gray-500",children:"Prev cell c"}),e.jsx("input",{type:"range",min:-2,max:2,step:.1,value:l,onChange:c=>h(parseFloat(c.target.value)),className:"flex-1"}),e.jsx("span",{className:"text-xs font-mono w-12 text-gray-500",children:l.toFixed(1)})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400",children:"Gate Values & Output"}),e.jsx(r,{val:u,color:"#ef4444",label:"f"}),e.jsx(r,{val:d,color:"#6366f1",label:"i"}),e.jsx(r,{val:i,color:"#10b981",label:"g̃"}),e.jsx(r,{val:f,color:"#f59e0b",label:"o"}),e.jsxs("div",{className:"mt-3 space-y-1 border-t border-gray-100 dark:border-gray-700 pt-3",children:[e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-gray-500",children:"c_next = f×c_prev + i×g̃"}),e.jsxs("span",{className:"font-mono font-bold text-purple-600 dark:text-purple-400",children:["= ",u.toFixed(2),"×",l.toFixed(1)," + ",d.toFixed(2),"×",i.toFixed(2)," = ",e.jsx("strong",{children:p.toFixed(3)})]})]}),e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-gray-500",children:"h_next = o × tanh(c_next)"}),e.jsxs("span",{className:"font-mono font-bold text-indigo-600 dark:text-indigo-400",children:["= ",f.toFixed(2),"×",Math.tanh(p).toFixed(2)," = ",e.jsx("strong",{children:n.toFixed(3)})]})]})]}),e.jsx("div",{className:"rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2 text-xs text-gray-600 dark:text-gray-400",children:"f≈1 preserves memory, f≈0 forgets. i≈1 writes new info. o≈1 exposes cell state."})]})]})]})}const He=`import torch
import torch.nn as nn

# ── LSTM manual step (for understanding) ──────────────────────────────────────
def lstm_step(x, h_prev, c_prev, W_i, W_f, W_g, W_o, b_i, b_f, b_g, b_o):
    """One LSTM timestep."""
    # Stack input and hidden (combined input for gate computation)
    xh = torch.cat([x, h_prev], dim=-1)
    # Gates
    f = torch.sigmoid(xh @ W_f.T + b_f)  # Forget gate
    i = torch.sigmoid(xh @ W_i.T + b_i)  # Input gate
    g = torch.tanh(xh @ W_g.T + b_g)     # Cell gate (candidate)
    o = torch.sigmoid(xh @ W_o.T + b_o)  # Output gate
    # Cell state update (additive! gradient highway)
    c_next = f * c_prev + i * g
    h_next = o * torch.tanh(c_next)
    return h_next, c_next

# ── PyTorch LSTM usage ────────────────────────────────────────────────────────
lstm = nn.LSTM(input_size=10, hidden_size=64, num_layers=2,
               batch_first=True, dropout=0.3, bidirectional=False)

x = torch.randn(8, 50, 10)  # [batch=8, seq=50, features=10]
out, (hn, cn) = lstm(x)
print(f"LSTM output: {out.shape}")  # [8, 50, 64]
print(f"Final hidden: {hn.shape}")  # [2, 8, 64] (num_layers × batch × hidden)
print(f"Cell state:   {cn.shape}")  # [2, 8, 64]

# ── GRU (simpler alternative to LSTM) ─────────────────────────────────────────
gru = nn.GRU(input_size=10, hidden_size=64, num_layers=2,
             batch_first=True, dropout=0.3)
out_gru, hn_gru = gru(x)
print(f"\\nGRU output: {out_gru.shape}")  # [8, 50, 64]

# GRU equations (for reference):
# z = sigmoid(W_z [h, x] + b_z)  # update gate
# r = sigmoid(W_r [h, x] + b_r)  # reset gate
# h_tilde = tanh(W [r*h, x] + b) # candidate hidden
# h_next = (1-z) * h + z * h_tilde

# ── LSTM vs GRU parameter count ───────────────────────────────────────────────
input_size, hidden_size = 10, 64
lstm_params = sum(p.numel() for p in lstm.parameters())
gru_params  = sum(p.numel() for p in gru.parameters())
print(f"\\nLSTM params (2-layer): {lstm_params:,}")
print(f"GRU params  (2-layer): {gru_params:,}")
# LSTM: 4 * (H*(H+D) + H) gates per layer
# GRU:  3 * (H*(H+D) + H) gates per layer (~75% of LSTM)

# ── Sequence classification with LSTM ─────────────────────────────────────────
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden, n_layers, n_classes):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm  = nn.LSTM(embed_dim, hidden, n_layers,
                             batch_first=True, dropout=0.5, bidirectional=True)
        self.fc    = nn.Linear(hidden * 2, n_classes)  # *2 for bidirectional
        self.drop  = nn.Dropout(0.5)

    def forward(self, tokens):
        x = self.drop(self.embed(tokens))
        out, (hn, _) = self.lstm(x)
        # Concatenate forward and backward final hidden states
        h = torch.cat([hn[-2], hn[-1]], dim=-1)
        return self.fc(self.drop(h))

model = SentimentLSTM(vocab_size=10000, embed_dim=100, hidden=256, n_layers=2, n_classes=2)
tokens = torch.randint(0, 10000, (4, 128))  # batch of 4 sequences length 128
logits = model(tokens)
print(f"\\nSentiment model output: {logits.shape}")
`;function Ge(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"LSTM & GRU"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Gating mechanisms, cell state, and long-range dependencies — how LSTM and GRU solve the vanishing gradient problem that cripples vanilla RNNs."})]}),e.jsx(R,{title:"LSTM Origins",children:e.jsxs("p",{children:["Long Short-Term Memory (LSTM) was introduced by Hochreiter & Schmidhuber in 1997 to solve the vanishing gradient problem. The key insight: the cell state ",e.jsx(T.InlineMath,{math:"c_t"})," ","is updated additively (not multiplicatively), creating a gradient highway through time. The Gated Recurrent Unit (GRU) was proposed by Cho et al. (2014) as a simpler alternative with two gates instead of three, often matching LSTM performance with fewer parameters."]})}),e.jsx(N,{label:"Definition 4.3",title:"Long Short-Term Memory (LSTM)",definition:"An LSTM maintains two states: hidden state $\\mathbf{h}_t \\in \\mathbb{R}^H$ and cell state $\\mathbf{c}_t \\in \\mathbb{R}^H$. At each timestep, four gates are computed from $[\\mathbf{h}_{t-1}, \\mathbf{x}_t]$: forget gate $\\mathbf{f}_t = \\sigma(W_f[\\mathbf{h}_{t-1},\\mathbf{x}_t]+\\mathbf{b}_f)$, input gate $\\mathbf{i}_t = \\sigma(W_i[\\mathbf{h}_{t-1},\\mathbf{x}_t]+\\mathbf{b}_i)$, cell gate $\\tilde{\\mathbf{c}}_t = \\tanh(W_g[\\mathbf{h}_{t-1},\\mathbf{x}_t]+\\mathbf{b}_g)$, output gate $\\mathbf{o}_t = \\sigma(W_o[\\mathbf{h}_{t-1},\\mathbf{x}_t]+\\mathbf{b}_o)$. Cell update: $\\mathbf{c}_t = \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{c}}_t$. Hidden state: $\\mathbf{h}_t = \\mathbf{o}_t \\odot \\tanh(\\mathbf{c}_t)$.",notation:"$\\odot$ is element-wise (Hadamard) product. $\\sigma$ is sigmoid. The forget gate $\\mathbf{f}_t \\in (0,1)^H$ controls how much of the previous cell state to retain. When $\\mathbf{f}_t \\approx 1$ and $\\mathbf{i}_t \\approx 0$: cell state is preserved unchanged (long-range memory). LSTM parameters: $4(H \\cdot (H+D) + H)$ per layer."}),e.jsx(qe,{}),e.jsx(N,{label:"Definition 4.4",title:"Gated Recurrent Unit (GRU)",definition:"A GRU simplifies LSTM to two gates and one state vector. Update gate $\\mathbf{z}_t = \\sigma(W_z[\\mathbf{h}_{t-1},\\mathbf{x}_t])$ controls how much to update. Reset gate $\\mathbf{r}_t = \\sigma(W_r[\\mathbf{h}_{t-1},\\mathbf{x}_t])$ controls how much past to use for candidate. Candidate: $\\tilde{\\mathbf{h}}_t = \\tanh(W[\\mathbf{r}_t \\odot \\mathbf{h}_{t-1}, \\mathbf{x}_t])$. Update: $\\mathbf{h}_t = (1-\\mathbf{z}_t) \\odot \\mathbf{h}_{t-1} + \\mathbf{z}_t \\odot \\tilde{\\mathbf{h}}_t$.",notation:"GRU has ~75% of LSTM parameters. The update gate interpolates between previous hidden state (memory) and new candidate (new information). When $\\mathbf{z}_t \\approx 0$: old hidden state is preserved; when $\\mathbf{z}_t \\approx 1$: new candidate replaces it. No separate cell state — one vector plays both roles."}),e.jsx(S,{label:"Theorem 4.2",title:"LSTM Gradient Highway",statement:"In an LSTM, the gradient of the loss with respect to the cell state at timestep $t$ satisfies: $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{c}_t} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{c}_T} \\prod_{k=t}^{T-1} \\mathbf{f}_{k+1}$. If the forget gate is held near 1 (i.e., $\\mathbf{f}_k \\approx \\mathbf{1}$), gradients flow through all timesteps without vanishing. This is the 'constant error carousel' — the key mechanism enabling LSTMs to learn long-range dependencies.",proof:"Cell state update: $\\mathbf{c}_{t+1} = \\mathbf{f}_{t+1} \\odot \\mathbf{c}_t + \\mathbf{i}_{t+1} \\odot \\tilde{\\mathbf{c}}_{t+1}$. Taking derivative: $\\partial \\mathbf{c}_{t+1}/\\partial \\mathbf{c}_t = \\text{diag}(\\mathbf{f}_{t+1})$. Applying chain rule through $T-t$ steps: $\\partial \\mathbf{c}_T/\\partial \\mathbf{c}_t = \\prod_{k=t}^{T-1} \\text{diag}(\\mathbf{f}_{k+1})$. This product of diagonal matrices (with values in $(0,1)$) can be maintained near 1 if the gates learn to stay near 1, unlike the product of full Jacobian matrices in vanilla RNNs which quickly shrinks. $\\square$",corollaries:["The forget gate's initial bias is crucial: initializing $b_f = 1$ (or 2) encourages $f_t \\approx \\sigma(1) \\approx 0.73$ at initialization, which helps the cell state flow early in training.","LSTMs can still fail for very long sequences ($T > 1000$) or when the forget gate consistently outputs near 0. Attention mechanisms (Transformers) avoid recurrence entirely.","Gradient clipping is still needed for LSTMs in practice — the hidden state $h_t$ still passes through sigmoid/tanh, which can cause some degree of vanishing."]}),e.jsx(M,{title:"LSTM Forget Gate: Selective Memory",difficulty:"advanced",problem:"Explain how an LSTM can learn to ignore a distractor word in a sentence like 'The actor who won the award was [long clause] happy.' The subject 'actor' must be remembered past the clause.",solution:[{step:'Process "The actor"',formula:"c_1 \\approx \\text{[actor=singular]}",explanation:"The cell state stores grammatical number of subject."},{step:"Process the relative clause",formula:"f_t \\approx 1 \\text{ for number slot} \\Rightarrow c_t \\approx c_1",explanation:"The forget gate learns to preserve number information through distractor words. Input gate learns to write clause info to different dimensions."},{step:'Arrive at "was"',formula:"h_T = o_T \\odot \\tanh(c_T), \\quad c_T[\\text{number}] \\approx c_1[\\text{number}]",explanation:'The hidden state can read out subject number from cell state to predict "was" (singular) vs "were" (plural).'},{step:"Why this works",formula:"\\frac{\\partial \\mathcal{L}}{\\partial c_1} = \\frac{\\partial \\mathcal{L}}{\\partial c_T} \\cdot f_2 \\cdots f_T \\approx \\frac{\\partial \\mathcal{L}}{\\partial c_T}",explanation:"If f_t ≈ 1 for the number dimension throughout the clause, the gradient flows back to c_1 unchanged, allowing the LSTM to learn to preserve this information."}]}),e.jsx(C,{title:"LSTM/GRU Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Forget gate initialization:"})," Always initialize the forget gate bias to 1 (or 2) for better gradient flow early in training. PyTorch's nn.LSTM initializes all biases to 0 by default — add a line: ",e.jsx("code",{children:"lstm.bias_hh_l0.data[hidden_size:2*hidden_size].fill_(1.0)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bidirectional LSTM:"})," Doubles parameters and hidden size (for classification from hn). Output is [batch, seq, 2H] — remember to concatenate forward and backward final hidden states, not use the raw hn directly."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"LSTM vs Transformer:"})," For sequences longer than a few hundred tokens or tasks requiring global context, Transformers (self-attention) outperform LSTM significantly. LSTMs are still competitive for streaming/online inference where full-sequence attention is impractical."]})]})}),e.jsx(W,{code:He,title:"LSTM & GRU — PyTorch Implementation",runnable:!0})]})}const ht=Object.freeze(Object.defineProperty({__proto__:null,default:Ge},Symbol.toStringTag,{value:"Module"}));function ae(t,b,o){return b.map(_=>t.reduce((m,x)=>m+Math.exp(-((_-x)**2)/(2*o**2)),0)/(t.length*o*Math.sqrt(2*Math.PI)))}function Be(){const[t,b]=$.useState("BatchNorm"),[o,_]=$.useState(0),m=[[.5,10,-2],[1.5,14,3],[2.5,8,1],[3.5,12,-1]],s=t==="BatchNorm"?(y=>{const w=y.length;return y[0].length,y.map(z=>z.map((E,F)=>{const D=y.reduce((O,I)=>O+I[F],0)/w,oe=Math.sqrt(y.reduce((O,I)=>O+(I[F]-D)**2,0)/w+1e-5);return(E-D)/oe}))})(m):(y=>y.map(w=>{const z=w.reduce((F,D)=>F+D,0)/w.length,E=Math.sqrt(w.reduce((F,D)=>F+(D-z)**2,0)/w.length+1e-5);return w.map(F=>(F-z)/E)}))(m),l=420,h=160,u=-12,d=16,i=-3,f=3,p=Array.from({length:100},(y,w)=>u+(d-u)*w/99),n=Array.from({length:100},(y,w)=>i+(f-i)*w/99),r=m.map(y=>y[o]),j=s.map(y=>y[o]),c=ae(r,p,1.5),g=ae(j,n,.3),v=Math.max(...c,.01),k=Math.max(...g,.01),L=(y,w)=>({x:(y-u)/(d-u)*l,y:h-w/v*h*.9}),U=(y,w)=>({x:(y-i)/(f-i)*l,y:h-w/k*h*.9}),ie="M"+p.map((y,w)=>{const z=L(y,c[w]);return`${z.x},${z.y}`}).join(" L"),re="M"+n.map((y,w)=>{const z=U(y,g[w]);return`${z.x},${z.y}`}).join(" L"),K=r.reduce((y,w)=>y+w,0)/r.length,se=Math.sqrt(r.reduce((y,w)=>y+(w-K)**2,0)/r.length);return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Normalization: Before & After Distribution"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"See how BatchNorm and LayerNorm transform the activation distribution."}),e.jsxs("div",{className:"flex flex-wrap gap-3 mb-4",children:[["BatchNorm","LayerNorm"].map(y=>e.jsx("button",{onClick:()=>b(y),className:`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${t===y?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`,children:y},y)),e.jsxs("div",{className:"flex gap-1 items-center ml-2",children:[e.jsx("span",{className:"text-xs text-gray-500",children:"Feature:"}),[0,1,2].map(y=>e.jsx("button",{onClick:()=>_(y),className:`rounded px-2 py-1 text-xs ${o===y?"bg-purple-600 text-white":"bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`,children:y},y))]})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs font-semibold text-gray-500 mb-1",children:["Before (raw activations, feature ",o,")"]}),e.jsxs("svg",{width:l,height:h,className:"rounded bg-gray-50 dark:bg-gray-800/50 w-full",children:[e.jsx("path",{d:ie,fill:"rgba(239,68,68,0.3)",stroke:"#ef4444",strokeWidth:2}),r.map((y,w)=>{const z=L(y,0);return e.jsx("line",{x1:z.x,y1:h-2,x2:z.x,y2:h-15,stroke:"#ef4444",strokeWidth:2},w)})]}),e.jsxs("p",{className:"mt-1 text-xs text-gray-500 text-center",children:["μ=",K.toFixed(2),", σ=",se.toFixed(2)]})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs font-semibold text-gray-500 mb-1",children:["After ",t," (standardized)"]}),e.jsxs("svg",{width:l,height:h,className:"rounded bg-gray-50 dark:bg-gray-800/50 w-full",children:[e.jsx("path",{d:re,fill:"rgba(99,102,241,0.3)",stroke:"#6366f1",strokeWidth:2}),j.map((y,w)=>{const z=U(y,0);return e.jsx("line",{x1:z.x,y1:h-2,x2:z.x,y2:h-15,stroke:"#6366f1",strokeWidth:2},w)}),e.jsx("line",{x1:U(0,0).x,y1:0,x2:U(0,0).x,y2:h,stroke:"#94a3b8",strokeWidth:1,strokeDasharray:"4,2"})]}),e.jsx("p",{className:"mt-1 text-xs text-gray-500 text-center",children:"μ≈0, σ≈1 (by construction)"})]})]}),e.jsx("p",{className:"mt-2 text-xs text-gray-500 dark:text-gray-400 text-center",children:t==="BatchNorm"?"BatchNorm normalizes over batch (column-wise): each feature has μ=0, σ=1 across the batch.":"LayerNorm normalizes over features (row-wise): each sample has μ=0, σ=1 across its features."})]})}const Ee=`import torch
import torch.nn as nn
import numpy as np

# ── BatchNorm manual implementation ───────────────────────────────────────────
def batchnorm_manual(x, gamma, beta, eps=1e-5, momentum=0.1,
                     running_mean=None, running_var=None, training=True):
    """
    x: [N, C, H, W] or [N, C]
    gamma, beta: learnable scale/shift [C]
    """
    if x.dim() == 4:  # 2D spatial
        N, C, H, W = x.shape
        # Compute stats over (N, H, W) for each channel C
        mean = x.mean(dim=(0, 2, 3), keepdim=True)
        var  = x.var(dim=(0, 2, 3), keepdim=True, unbiased=False)
    else:  # 1D (N, C)
        mean = x.mean(dim=0, keepdim=True)
        var  = x.var(dim=0, keepdim=True, unbiased=False)

    if training:
        x_norm = (x - mean) / torch.sqrt(var + eps)
        if running_mean is not None:
            running_mean.mul_(1 - momentum).add_(mean.squeeze() * momentum)
            running_var.mul_(1 - momentum).add_(var.squeeze() * momentum)
    else:
        x_norm = (x - running_mean) / torch.sqrt(running_var + eps)

    return gamma * x_norm + beta

# Verify against PyTorch
x = torch.randn(4, 8)  # batch=4, features=8
gamma, beta = torch.ones(8), torch.zeros(8)
running_mean, running_var = torch.zeros(8), torch.ones(8)

manual_out = batchnorm_manual(x, gamma, beta, running_mean=running_mean, running_var=running_var)
bn_layer = nn.BatchNorm1d(8, eps=1e-5, momentum=0.1)
bn_layer.weight.data.fill_(1); bn_layer.bias.data.fill_(0)
official_out = bn_layer(x)

print(f"BatchNorm max diff: {(manual_out - official_out).abs().max():.6f}")

# ── LayerNorm (used in Transformers) ─────────────────────────────────────────
def layernorm_manual(x, gamma, beta, eps=1e-5):
    """Normalize over the last dimension (feature dim)."""
    mean = x.mean(dim=-1, keepdim=True)
    var  = x.var(dim=-1, keepdim=True, unbiased=False)
    x_norm = (x - mean) / torch.sqrt(var + eps)
    return gamma * x_norm + beta

x_seq = torch.randn(4, 10, 512)  # [batch, seq_len, d_model]
gamma_ln, beta_ln = torch.ones(512), torch.zeros(512)
manual_ln = layernorm_manual(x_seq, gamma_ln, beta_ln)
ln_layer  = nn.LayerNorm(512)
official_ln = ln_layer(x_seq)
print(f"LayerNorm max diff: {(manual_ln - official_ln).abs().max():.6f}")

# ── Why BatchNorm helps: internal covariate shift visualization ───────────────
print("\\nActivation statistics without and with BatchNorm:")
print(f"{'Layer':<8} {'Before BN mean':>15} {'Before BN std':>14}")

model_no_bn  = nn.Sequential(*[nn.Linear(64, 64) for _ in range(5)])
model_with_bn = nn.Sequential(*[layer for i in range(5)
                                 for layer in [nn.Linear(64, 64), nn.BatchNorm1d(64), nn.ReLU()]])
x0 = torch.randn(32, 64)
h = x0
for i, layer in enumerate(model_no_bn):
    h = torch.relu(layer(h))
    if i % 2 == 0:
        print(f"  L{i:<4}  mean={h.mean():.4f}  std={h.std():.4f}")
`;function Oe(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Batch & Layer Normalization"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Normalization techniques that stabilize training, enable higher learning rates, and act as regularizers — BatchNorm, LayerNorm, GroupNorm, and internal covariate shift."})]}),e.jsx(R,{title:"Normalization History",children:e.jsx("p",{children:"BatchNorm (Ioffe & Szegedy, 2015) revolutionized deep learning training speed and stability, becoming the default for CNNs. LayerNorm (Ba et al., 2016) was developed for RNNs where batch statistics vary with sequence position, and became the standard for Transformers. GroupNorm (Wu & He, 2018) bridges the two, useful for small batches. RMSNorm (Zhang & Sennrich, 2019) further simplifies LayerNorm used in modern LLMs."})}),e.jsx(N,{label:"Definition 5.1",title:"Batch Normalization",definition:"BatchNorm normalizes activations across the batch dimension. For a mini-batch $\\{x_1,\\ldots,x_N\\}$ at layer $l$: $\\mu_\\mathcal{B} = \\frac{1}{N}\\sum_i x_i$, $\\sigma^2_\\mathcal{B} = \\frac{1}{N}\\sum_i (x_i - \\mu_\\mathcal{B})^2$, $\\hat{x}_i = (x_i - \\mu_\\mathcal{B})/\\sqrt{\\sigma^2_\\mathcal{B} + \\varepsilon}$, $y_i = \\gamma \\hat{x}_i + \\beta$. Here $\\gamma, \\beta$ are learnable scale and shift parameters (one per feature/channel), and $\\varepsilon > 0$ prevents division by zero. At inference, running statistics (exponential moving average of batch statistics) replace batch statistics.",notation:"For Conv layers: normalization over $(N,H,W)$ axes per channel $C$. For FC layers: over the $N$ batch axis per feature. The running statistics allow inference on a single sample. $\\gamma$ and $\\beta$ allow the network to undo normalization if beneficial."}),e.jsx(Be,{}),e.jsx(N,{label:"Definition 5.2",title:"Layer Normalization & GroupNorm",definition:"LayerNorm normalizes over the feature dimension (not batch): $\\hat{x} = (x - \\mu_x)/\\sqrt{\\sigma^2_x + \\varepsilon}$ where $\\mu_x = \\frac{1}{H}\\sum_j x_j$ and $\\sigma^2_x = \\frac{1}{H}\\sum_j(x_j-\\mu_x)^2$ over all features $H$ for one sample. GroupNorm divides channels into $G$ groups and normalizes within each group, bridging BatchNorm ($G=1$ over all channels) and InstanceNorm ($G=C$, one group per channel). RMSNorm simplifies LayerNorm by removing mean centering: $\\hat{x}_i = x_i / \\text{RMS}(\\mathbf{x})$ where $\\text{RMS}(\\mathbf{x}) = \\sqrt{\\frac{1}{H}\\sum_j x_j^2}$.",notation:"LayerNorm statistics are computed per sample — no dependence on batch size. This makes it suitable for: (1) RNNs (different seq positions have different stats). (2) Small-batch training. (3) Transformers (standard choice). (4) Inference with batch size 1. RMSNorm removes mean subtraction (~10% faster), used in LLaMA, PaLM."}),e.jsx(S,{label:"Theorem 5.1",title:"BatchNorm as Regularizer",statement:"BatchNorm introduces noise during training: the per-batch mean and variance estimates differ from the true population statistics by $O(1/\\sqrt{N})$, acting as stochastic regularization similar to dropout. This noise prevents overfitting and reduces the need for other regularizers. The regularization strength decreases as batch size $N$ increases, explaining why large-batch training often requires explicit regularization (weight decay, dropout) to compensate.",proof:"The mini-batch estimators $\\hat{\\mu} = \\frac{1}{N}\\sum_i x_i$ and $\\hat{\\sigma}^2 = \\frac{1}{N}\\sum_i (x_i - \\hat{\\mu})^2$ are random variables. By CLT, $\\hat{\\mu} \\sim \\mathcal{N}(\\mu, \\sigma^2/N)$, so the normalized activation $\\hat{x}_i = (x_i - \\hat{\\mu})/\\hat{\\sigma}$ depends on all other batch elements — each activation sees slightly different normalization noise. This perturbation acts like random regularization. For $N \\to \\infty$: noise $\\to 0$ and BatchNorm reduces to a deterministic normalization. $\\square$",corollaries:["BN enables training with higher learning rates by smoothing the loss landscape: normalized activations reduce the sensitivity of gradients to parameter initialization.","BN implicitly tunes the effective learning rate: if layer activations double, BN renormalizes them, making the gradient effectively smaller (scale invariance of parameters under BN).","BatchNorm is problematic for (1) small batches (N<8: noisy statistics), (2) online learning (N=1), (3) recurrent networks (statistics change with sequence position). Use LayerNorm in these cases."]}),e.jsx(M,{title:"Manual BatchNorm Forward Pass",difficulty:"advanced",problem:"Apply BatchNorm to a batch of 4 activations for one feature: $x = [2, 4, 6, 8]$. Use $\\gamma = 1$, $\\beta = 0$, $\\varepsilon = 10^{-5}$.",solution:[{step:"Compute batch mean",formula:"\\mu = \\frac{2+4+6+8}{4} = 5",explanation:"Mean over the batch dimension."},{step:"Compute batch variance",formula:"\\sigma^2 = \\frac{(2-5)^2+(4-5)^2+(6-5)^2+(8-5)^2}{4} = \\frac{9+1+1+9}{4} = 5",explanation:"Variance over the batch (biased estimator used in BN)."},{step:"Normalize",formula:"\\hat{x} = \\frac{x - 5}{\\sqrt{5 + 10^{-5}}} \\approx \\frac{[{-3},{-1},{1},{3}]}{2.236} = [{-1.342},{-0.447},{0.447},{1.342}]",explanation:"Subtract mean and divide by std. Result has mean≈0, std≈1."},{step:"Scale and shift",formula:"y = \\gamma \\hat{x} + \\beta = 1 \\cdot \\hat{x} + 0 = \\hat{x}",explanation:"With γ=1, β=0 (initialized values), output equals normalized input."}]}),e.jsx(C,{title:"Normalization Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"BatchNorm at inference:"})," Switch to model.eval() before inference — this uses running statistics instead of batch statistics. Forgetting this gives different (often worse) results at test time, especially with small test batches."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"BatchNorm with small batches:"})," Batch size < 8 makes BN statistics unreliable. Use GroupNorm or LayerNorm for small-batch settings (e.g., detection/segmentation with high-resolution images)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"BN before or after activation:"})," The original paper places BN before activation (Conv→BN→ReLU). The pre-activation ResNet (He et al. 2016b) places it as BN→ReLU→Conv, often performing slightly better. Be consistent within an architecture."]})]})}),e.jsx(W,{code:Ee,title:"BatchNorm & LayerNorm — Manual Implementation & Verification",runnable:!0})]})}const mt=Object.freeze(Object.defineProperty({__proto__:null,default:Oe},Symbol.toStringTag,{value:"Module"})),B=8,ne=4,P=B*ne;function Ie(){const[t,b]=$.useState(.5),[o,_]=$.useState(()=>Array(P).fill(!0)),[m,x]=$.useState(!0),[a,s]=$.useState(!0),l=()=>{_(Array.from({length:P},()=>Math.random()>=t))},h=o.filter(Boolean).length,u=a&&m?1/(1-t):1,d=44,i=4,f=B*(d+i)+20,p=ne*(d+i)+20;return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Dropout Mask Visualizer"}),e.jsxs("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:["Each cell is a neuron. Grayed out = dropped (set to 0). In training, active neurons are scaled by ",e.jsx(T.InlineMath,{math:"1/(1-p)"})," to preserve expected value."]}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("label",{className:"text-xs text-gray-500 dark:text-gray-400",children:["Drop rate p: ",t.toFixed(2)]}),e.jsx("input",{type:"range",min:0,max:.9,step:.05,value:t,onChange:n=>b(parseFloat(n.target.value)),className:"w-28"})]}),e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300",children:[e.jsx("input",{type:"checkbox",checked:a,onChange:n=>s(n.target.checked)}),"Training mode"]}),e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300",children:[e.jsx("input",{type:"checkbox",checked:m,onChange:n=>x(n.target.checked)}),"Inverted dropout (scale by 1/(1-p))"]}),e.jsx("button",{onClick:l,className:"rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",children:"New Mask"})]}),e.jsx("svg",{width:f,height:p,className:"mx-auto block",children:Array.from({length:P},(n,r)=>{const j=r%B,c=Math.floor(r/B),g=10+j*(d+i),v=10+c*(d+i),k=!a||o[r],L=k?1*u:0;return e.jsxs("g",{children:[e.jsx("rect",{x:g,y:v,width:d,height:d,rx:6,fill:k?"#818cf8":"#e5e7eb",opacity:k?.9:.4,stroke:k?"#4f46e5":"#d1d5db",strokeWidth:k?1.5:1}),e.jsx("text",{x:g+d/2,y:v+d/2+5,textAnchor:"middle",fontSize:11,fontWeight:"600",fill:k?"#fff":"#9ca3af",children:k?L.toFixed(1):"0"})]},r)})}),e.jsxs("div",{className:"mt-3 flex flex-wrap justify-center gap-4 text-xs text-gray-600 dark:text-gray-400",children:[e.jsxs("span",{children:["Active: ",a?h:P,"/",P," (",a?(h/P*100).toFixed(0):100,"%)"]}),e.jsxs("span",{children:["Drop rate: p=",t.toFixed(2)]}),e.jsxs("span",{children:["Scale factor: ",a&&m?(1/(1-t)).toFixed(3):"1.000"]}),e.jsxs("span",{className:"text-indigo-600 dark:text-indigo-400",children:["E[output] ≈ ",((a?h/P:1)*u).toFixed(3)," (target: 1.000)"]})]})]})}const Ve=`import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Dropout: inverted dropout implementation ───────────────────────────────────
def dropout_manual(x, p, training=True):
    """Inverted dropout: scale active neurons by 1/(1-p) during training."""
    if not training or p == 0:
        return x
    # Bernoulli mask: 1 with probability (1-p), 0 with probability p
    mask = torch.bernoulli(torch.full_like(x, 1 - p))
    return x * mask / (1 - p)  # Scale to preserve expected value

x = torch.ones(4, 10)  # All-ones input
torch.manual_seed(42)
dropped = dropout_manual(x, p=0.5, training=True)
print(f"Manual dropout: {dropped[0].tolist()[:6]}...")
print(f"Expected mean: 1.0, Got: {dropped.mean():.4f}")

# ── Weight decay (L2 regularization) ─────────────────────────────────────────
# L = loss + λ||W||²_F  ↔  update: w ← (1 - 2λη)w - η∇_w L
# PyTorch implements as "weight_decay" in optimizer
optimizer = torch.optim.Adam(nn.Linear(10,10).parameters(),
                              lr=1e-3, weight_decay=1e-4)
# weight_decay=1e-4 adds 1e-4 * ||W||² to the loss

# L1 regularization (manual — not built-in)
def l1_loss(model, lambda_l1):
    return lambda_l1 * sum(p.abs().sum() for p in model.parameters())

# ── Data augmentation ─────────────────────────────────────────────────────────
from torchvision import transforms
augment = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomCrop(32, padding=4),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
    transforms.RandomErasing(p=0.3, scale=(0.02, 0.33)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
print("\\nAugmentation pipeline defined")

# ── Implicit regularization of SGD ────────────────────────────────────────────
# Keskar et al. (2017): small-batch SGD generalizes better due to
# sharp vs flat minima. Large batches can be compensated with:
# - Learning rate warmup + cosine decay
# - Mixup (Zhang et al. 2018): x = λx_i + (1-λ)x_j, y = λy_i + (1-λ)y_j
def mixup(x, y, alpha=0.2):
    lam = torch.distributions.Beta(alpha, alpha).sample()
    idx = torch.randperm(x.size(0))
    x_mix = lam * x + (1 - lam) * x[idx]
    y_a, y_b = y, y[idx]
    loss_fn = lambda pred: lam * F.cross_entropy(pred, y_a) + (1-lam) * F.cross_entropy(pred, y_b)
    return x_mix, loss_fn

x_batch = torch.randn(8, 3, 32, 32)
y_batch = torch.randint(0, 10, (8,))
x_mix, loss_fn = mixup(x_batch, y_batch, alpha=0.4)
print(f"Mixup: {x_batch.shape} → {x_mix.shape}")
print("Loss function handles mixed labels")

# ── Comparison: with and without regularization ───────────────────────────────
class RegNet(nn.Module):
    def __init__(self, dropout_p=0.0):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(20, 64), nn.ReLU(), nn.Dropout(dropout_p),
            nn.Linear(64, 64), nn.ReLU(), nn.Dropout(dropout_p),
            nn.Linear(64, 1)
        )
    def forward(self, x): return self.net(x)

# train_acc and val_acc patterns (illustrative):
print("\\nTypical effect of regularization on gap:")
print("No reg:    train_acc=99%, val_acc=72% (overfit)")
print("Dropout:   train_acc=95%, val_acc=86%")
print("L2+Drop:   train_acc=93%, val_acc=89%")
print("Augment:   train_acc=91%, val_acc=91% (best generalization)")
`;function Xe(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Regularization Techniques"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"Dropout, weight decay, data augmentation, and implicit regularization — the toolkit for preventing overfitting and improving generalization in deep networks."})]}),e.jsx(R,{title:"The Generalization Puzzle",children:e.jsx("p",{children:"Dropout (Srivastava et al., 2014) was a breakthrough regularizer. But modern deep networks are heavily overparameterized yet generalize well — a phenomenon that classical statistics cannot explain. Zhang et al. (2017) showed that deep networks can memorize random labels, yet still generalize on real data. This led to the study of implicit regularization: SGD with small batches and appropriate learning rates acts as a regularizer itself (Keskar et al. 2017, Smith & Le 2018)."})}),e.jsx(N,{label:"Definition 5.3",title:"Dropout",definition:"Dropout (Srivastava et al., 2014) randomly sets each neuron's output to 0 with probability $p$ during training, independently at each forward pass. Inverted dropout scales active neurons by $1/(1-p)$ so that the expected output equals the non-dropout output. Formally, the dropped output is $\\tilde{h}_i = h_i \\cdot m_i / (1-p)$ where $m_i \\sim \\text{Bernoulli}(1-p)$. At inference, all neurons are active and no scaling is needed.",notation:"Dropout probability $p \\in [0,1]$; common values: $p=0.5$ for FC layers, $p=0.1$-$0.3$ for convolutional layers. Inverted dropout allows identical behavior at train and test time — only the scale differs. Spatial dropout drops entire feature maps (channels) in CNNs; variational dropout uses the same mask for all timesteps in RNNs."}),e.jsx(Ie,{}),e.jsx(N,{label:"Definition 5.4",title:"Weight Decay (L2 Regularization)",definition:"Weight decay adds an L2 penalty to the loss: $\\tilde{\\mathcal{L}}(\\theta) = \\mathcal{L}(\\theta) + \\frac{\\lambda}{2}\\|\\theta\\|^2$. The gradient becomes $\\nabla_\\theta \\tilde{\\mathcal{L}} = \\nabla_\\theta \\mathcal{L} + \\lambda\\theta$, so each parameter update is: $\\theta \\leftarrow \\theta - \\eta(\\nabla_\\theta \\mathcal{L} + \\lambda\\theta) = (1-\\eta\\lambda)\\theta - \\eta\\nabla_\\theta\\mathcal{L}$. The factor $(1-\\eta\\lambda) < 1$ shrinks weights toward zero each step — hence 'weight decay'. With Adam, weight decay and L2 regularization are NOT equivalent: AdamW (Loshchilov & Hutter, 2019) implements true weight decay separately from the gradient step.",notation:"$\\lambda$ is the regularization strength. L1 regularization: $|\\theta|$ instead of $\\theta^2$ — promotes sparsity (Lasso). Elastic Net combines L1 and L2. For transformers, $\\lambda \\approx 0.01$-$0.1$ is typical. Do NOT apply weight decay to biases or LayerNorm parameters."}),e.jsx(S,{label:"Theorem 5.2",title:"Dropout as Model Averaging",statement:"Training a neural network with dropout is equivalent (approximately) to training an ensemble of $2^n$ different networks (one for each dropout mask pattern) with shared weights, and averaging their predictions at inference. This gives a geometric mean of the ensemble predictions in probability space (for sigmoid outputs) and an arithmetic mean in log-probability space.",proof:"Each dropout mask $\\mathbf{m}$ defines a thinned network $f_\\mathbf{m}(\\mathbf{x})$. Dropout training minimizes $\\mathbb{E}_\\mathbf{m}[\\mathcal{L}(f_\\mathbf{m}(\\mathbf{x}), y)]$ — the expected loss over mask distributions. At inference with all neurons active (scaled), the output $f(\\mathbf{x})$ approximates $\\mathbb{E}_\\mathbf{m}[f_\\mathbf{m}(\\mathbf{x})]$ by the linearity of expectation through the affine parts of the network. For nonlinear outputs (softmax), the approximation is a geometric mean. The weight sharing forces the ensemble members to cooperate, unlike independent ensemble training. $\\square$",corollaries:["MC Dropout (Gal & Ghahramani 2016): keep dropout active at inference time and run $T$ forward passes — the variance of outputs approximates Bayesian uncertainty. Useful for uncertainty quantification.","Dropout rate should be tuned: too low (p<0.1) provides little regularization; too high (p>0.7) makes training unstable and slow.","Data augmentation can be seen as adding regularization by increasing the effective dataset size and enforcing invariances in the model."]}),e.jsx(M,{title:"Choosing Regularization Strategies",difficulty:"intermediate",problem:"You have a CNN training on CIFAR-10 with 93% training accuracy and 75% validation accuracy. Suggest a regularization strategy and explain why.",solution:[{step:"Diagnose overfitting",formula:"\\text{gap} = 93\\% - 75\\% = 18\\%",explanation:"Large train-val gap = overfitting. The model has learned training-specific features."},{step:"Add data augmentation (first)",formula:"\\text{RandomHorizontalFlip, RandomCrop, ColorJitter}",explanation:"Most effective for image tasks. Increases effective dataset diversity. Often closes 5-10% of the gap without additional compute at inference."},{step:"Add dropout to FC layers",formula:"h = \\text{Dropout}(0.5)(\\text{FC}(h))",explanation:"Typical p=0.5 for fully-connected layers. Convolutional layers benefit from smaller p (0.1-0.2) or spatial dropout."},{step:"Add weight decay",formula:"L_{\\text{total}} = L_{\\text{CE}} + \\lambda \\|W\\|^2_F, \\quad \\lambda \\in [10^{-4}, 10^{-2}]",explanation:"Prevents any single weight from becoming too large. Use AdamW (not Adam + L2) for correct weight decay behavior."}]}),e.jsx(C,{title:"Regularization Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Adam + L2 regularization:"})," Adding L2 to the loss with Adam is NOT equivalent to weight decay — Adam adapts the learning rate per parameter, which distorts the L2 effect. Use AdamW (torch.optim.AdamW) which implements weight decay correctly as parameter shrinkage."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dropout in batch-normalized networks:"})," Dropout after BatchNorm can cause training/inference mismatch in BN statistics (different effective batch sizes). Either use dropout before BN, or avoid dropout in the conv layers and only use it in FC layers."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Too much regularization:"})," Over-regularized models underfit — training accuracy also drops. Start with standard values (dropout p=0.5, weight_decay=1e-4) and tune based on the train-val gap, not val accuracy alone."]})]})}),e.jsx(W,{code:Ve,title:"Dropout, Weight Decay, Data Augmentation — PyTorch",runnable:!0})]})}const pt=Object.freeze(Object.defineProperty({__proto__:null,default:Xe},Symbol.toStringTag,{value:"Module"}));function Ke(t,b,o){let m=[1];for(let x=0;x<t;x++){let l;b==="Xavier"?l=2/128:b==="He"?l=2/64:l=1/64;const h=m[m.length-1]*64*l;let u;o==="ReLU"?u=h/2:o==="tanh"?u=Math.min(h,1)*.63:u=h,m.push(Math.max(1e-10,u))}return m}function Je(){const[t,b]=$.useState("ReLU"),[o,_]=$.useState(20),m=["Xavier","He","Simple"],x={Xavier:"#6366f1",He:"#10b981",Simple:"#ef4444"},a=Object.fromEntries(m.map(n=>[n,Ke(o,n,t)])),s=500,l=200,h=o,u=Math.max(...Object.values(a).flat().filter(n=>isFinite(n))),d=Math.min(...Object.values(a).flat().filter(n=>n>0&&isFinite(n))),i=Math.log10(Math.max(1e-10,d))-.5,f=Math.log10(u)+.5,p=(n,r)=>({x:n/h*s,y:l-(Math.log10(Math.max(1e-10,r))-i)/(f-i)*l});return e.jsxs("div",{className:"my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50",children:[e.jsx("h3",{className:"mb-1 text-base font-bold text-gray-800 dark:text-gray-200",children:"Activation Variance vs Layer Depth"}),e.jsx("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400",children:"Watch how variance propagates through layers. He init is designed for ReLU; Xavier for tanh/sigmoid. Y-axis is log scale."}),e.jsxs("div",{className:"flex flex-wrap gap-4 mb-4",children:[e.jsx("div",{className:"flex gap-1",children:["ReLU","tanh","Linear"].map(n=>e.jsx("button",{onClick:()=>b(n),className:`rounded px-3 py-1 text-sm font-semibold ${t===n?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`,children:n},n))}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("label",{className:"text-xs text-gray-500 dark:text-gray-400",children:["Layers: ",o]}),e.jsx("input",{type:"range",min:5,max:50,value:o,onChange:n=>_(+n.target.value),className:"w-28"})]})]}),e.jsxs("svg",{width:s,height:l,className:"mx-auto block rounded-lg bg-gray-50 dark:bg-gray-800/50",children:[[-6,-4,-2,0,2,4].map(n=>{const r=p(0,Math.pow(10,n));return r.y<0||r.y>l?null:e.jsx("line",{x1:0,y1:r.y,x2:s,y2:r.y,stroke:n===0?"#94a3b8":"#e5e7eb",strokeWidth:n===0?1.5:.8,className:"dark:stroke-gray-600"},n)}),m.map(n=>{const c="M"+a[n].map((g,v)=>p(v,g)).map(g=>`${g.x},${g.y}`).join(" L");return e.jsx("path",{d:c,fill:"none",stroke:x[n],strokeWidth:2.5},n)}),[-4,-2,0,2].map(n=>{const r=p(0,Math.pow(10,n));return r.y<0||r.y>l?null:e.jsxs("text",{x:4,y:r.y+4,fontSize:9,fill:"#9ca3af",children:["10^",n]},n)})]}),e.jsx("div",{className:"mt-3 flex gap-4 justify-center text-xs",children:m.map(n=>{const r=a[n][o];return e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"w-3 h-1.5 rounded inline-block",style:{background:x[n]}}),e.jsxs("span",{className:"text-gray-600 dark:text-gray-400",children:[n," (σ²=",r<1e-6?r.toExponential(1):r<1e3?r.toFixed(3):r.toExponential(1)," at L",o,")"]})]},n)})})]})}const Ye=`import torch
import torch.nn as nn
import numpy as np

# ── Xavier / Glorot Initialization ────────────────────────────────────────────
def xavier_uniform_(tensor, gain=1.0):
    fan_in, fan_out = nn.init._calculate_fan_in_and_fan_out(tensor)
    std = gain * np.sqrt(2.0 / (fan_in + fan_out))
    bound = np.sqrt(3.0) * std  # Uniform in [-bound, bound]
    return tensor.uniform_(-bound, bound)

def xavier_normal_(tensor, gain=1.0):
    fan_in, fan_out = nn.init._calculate_fan_in_and_fan_out(tensor)
    std = gain * np.sqrt(2.0 / (fan_in + fan_out))
    return tensor.normal_(0, std)

# ── He / Kaiming Initialization ───────────────────────────────────────────────
def he_normal_(tensor, mode='fan_in', nonlinearity='relu'):
    fan_in, fan_out = nn.init._calculate_fan_in_and_fan_out(tensor)
    fan = fan_in if mode == 'fan_in' else fan_out
    gain = nn.init.calculate_gain(nonlinearity)  # sqrt(2) for ReLU
    std = gain / np.sqrt(fan)
    return tensor.normal_(0, std)

# ── Variance analysis: verify initialization maintains signal ─────────────────
def signal_propagation_experiment(init_fn, activation, n_layers=30, width=512, n_samples=1000):
    """Track variance of activations through a deep network."""
    x = torch.randn(n_samples, width)
    variances = [x.var().item()]

    for _ in range(n_layers):
        W = torch.zeros(width, width)
        init_fn(W)
        with torch.no_grad():
            z = x @ W.T
            x = activation(z)
        variances.append(z.var().item())

    return variances

# ReLU with different initializations
relu = torch.relu
print("Variance at each 5th layer (ReLU network, width=512):")
print(f"{'Layer':>6} {'He init':>12} {'Xavier init':>12} {'Simple(1/n)':>12}")

he_vars     = signal_propagation_experiment(lambda W: nn.init.kaiming_normal_(W, nonlinearity='relu'), relu)
xavier_vars = signal_propagation_experiment(lambda W: nn.init.xavier_normal_(W), relu)
simple_vars = signal_propagation_experiment(lambda W: W.normal_(0, 1/W.shape[0]**0.5), relu)

for l in range(0, 31, 5):
    print(f"  {l:4d}  {he_vars[l]:12.4f}  {xavier_vars[l]:12.4f}  {simple_vars[l]:12.4f}")

# ── PyTorch built-in initialization ───────────────────────────────────────────
def init_weights(module):
    if isinstance(module, nn.Linear):
        nn.init.kaiming_normal_(module.weight, nonlinearity='relu')
        nn.init.constant_(module.bias, 0)
    elif isinstance(module, nn.Conv2d):
        nn.init.kaiming_normal_(module.weight, mode='fan_out', nonlinearity='relu')
        if module.bias is not None:
            nn.init.constant_(module.bias, 0)
    elif isinstance(module, nn.BatchNorm2d):
        nn.init.constant_(module.weight, 1)  # gamma = 1
        nn.init.constant_(module.bias, 0)    # beta = 0

model = nn.Sequential(
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 128), nn.ReLU(),
    nn.Linear(128, 10)
)
model.apply(init_weights)
print(f"\\nModel initialized with He init for all linear layers.")
print(f"First layer weight std: {model[0].weight.std():.4f}")
print(f"Expected (He): {(2/784)**0.5:.4f}")

# ── Spectral normalization ────────────────────────────────────────────────────
# Constrains spectral norm of W ≤ 1 for stable training in GANs
class SpectralLinear(nn.Module):
    def __init__(self, in_f, out_f):
        super().__init__()
        self.linear = nn.utils.spectral_norm(nn.Linear(in_f, out_f))
    def forward(self, x): return self.linear(x)

sn_layer = SpectralLinear(64, 64)
x = torch.randn(10, 64)
out = sn_layer(x)
print(f"\\nSpectral norm layer: {tuple(x.shape)} → {tuple(out.shape)}")
`;function Ze(){return e.jsxs("div",{className:"mx-auto max-w-4xl space-y-8 px-4 py-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100",children:"Weight Initialization"}),e.jsx("p",{className:"mt-2 text-base text-gray-500 dark:text-gray-400",children:"He and Xavier/Glorot initialization, spectral normalization — how proper initialization maintains signal variance through deep networks and enables stable training."})]}),e.jsx(R,{title:"Why Initialization Matters",children:e.jsx("p",{children:"Early deep networks (pre-2010) were nearly untrainable due to poor initialization. Xavier initialization (Glorot & Bengio, 2010) enabled training deeper networks with tanh/sigmoid. He initialization (He et al., 2015) extended this to ReLU networks. Proper initialization prevents the signal from vanishing or exploding before a single gradient step. Modern architectures (ResNets, Transformers) are designed to be robust to initialization, but it remains important for training stability."})}),e.jsx(N,{label:"Definition 5.5",title:"Xavier / Glorot Initialization",definition:"Xavier initialization (Glorot & Bengio, 2010) sets $W_{ij} \\sim \\mathcal{U}[-a, a]$ with $a = \\sqrt{6/(n_{in}+n_{out})}$ (uniform), or $W_{ij} \\sim \\mathcal{N}(0, \\sigma^2)$ with $\\sigma^2 = 2/(n_{in}+n_{out})$ (normal), where $n_{in}$ is the fan-in (input neurons) and $n_{out}$ is the fan-out (output neurons). The goal is to preserve the variance of activations and gradients through each layer under linear (or near-linear) activations.",notation:"The variance formula arises from requiring $\\text{Var}(\\mathbf{z}^{(l)}) = \\text{Var}(\\mathbf{z}^{(l-1)})$ (forward) and $\\text{Var}(\\partial \\mathcal{L}/\\partial \\mathbf{z}^{(l-1)}) = \\text{Var}(\\partial \\mathcal{L}/\\partial \\mathbf{z}^{(l)})$ (backward). The harmonic mean $(n_{in}+n_{out})/2$ is a compromise. For $n_{in} = n_{out}$: $\\sigma = \\sqrt{1/n_{in}}$ (classical weight sharing rule)."}),e.jsx(N,{label:"Definition 5.6",title:"He / Kaiming Initialization",definition:"He initialization (He et al., 2015) addresses ReLU networks: $W_{ij} \\sim \\mathcal{N}(0, \\sigma^2)$ with $\\sigma^2 = 2/n_{in}$ (fan-in mode) or $\\sigma^2 = 2/n_{out}$ (fan-out mode). The factor of 2 compensates for ReLU killing half the variance (negative pre-activations become 0). He initialization with fan-in is the current default for ReLU/GELU networks. The PyTorch default for Conv and Linear layers is actually Kaiming uniform with fan-in mode.",notation:"General formula: $\\sigma^2 = 2/(\\text{gain}^{-2} \\cdot n_{\\text{fan}})$ where gain accounts for activation function: $\\sqrt{2}$ for ReLU, $5/3$ for tanh, 1 for linear. Fan-in mode preserves forward variance; fan-out mode preserves backward gradient variance. For asymmetric layers ($n_{in} \\neq n_{out}$), He fan-in is preferred for deep networks."}),e.jsx(Je,{}),e.jsx(S,{label:"Theorem 5.3",title:"Variance Preservation in Deep ReLU Networks",statement:"With He initialization ($\\sigma^2 = 2/n_{in}$) and ReLU activations, the variance of activations $\\text{Var}(\\mathbf{h}^{(l)}) \\approx \\text{Var}(\\mathbf{h}^{(l-1)})$ for all layers $l$, enabling gradient signal to propagate through arbitrarily deep networks at initialization. Without this, signals either vanish ($\\sigma^2 < 2/n_{in}$) or explode ($\\sigma^2 > 2/n_{in}$).",proof:"For layer $l$: $z_j^{(l)} = \\sum_{i=1}^{n_{in}} W_{ji}^{(l)} h_i^{(l-1)}$. If $W_{ji}$ are i.i.d. with mean 0 and variance $\\sigma^2_W$, and activations $h_i^{(l-1)}$ are i.i.d. with mean 0 and variance $\\text{Var}(h)$: $\\text{Var}(z_j^{(l)}) = n_{in} \\sigma^2_W \\text{Var}(h)$ (independence). After ReLU: $h_j^{(l)} = \\max(0, z_j^{(l)})$. For a symmetric zero-mean distribution: $\\text{Var}(h_j) = \\text{Var}(z_j)/2$ (ReLU keeps half). Setting $n_{in}\\sigma^2_W / 2 = 1$ (i.e., $\\sigma^2_W = 2/n_{in}$) gives $\\text{Var}(h^{(l)}) = \\text{Var}(h^{(l-1)})$. $\\square$",corollaries:["For tanh activation: $\\text{Var}(\\tanh(z)) \\approx \\text{Var}(z)$ for small $\\text{Var}(z)$ (since $\\tanh'(0)=1$), leading to Xavier with $\\sigma^2 = 1/n_{in}$.","For GELU/SiLU: similar to ReLU analysis; He initialization (or a slight variant) still works well in practice.","Orthogonal initialization ($W$ is a random orthogonal matrix): exactly preserves the L2 norm of inputs, giving even better gradient flow at initialization — used in RNNs and very deep networks."]}),e.jsx(M,{title:"Computing He vs Xavier Variance for a Layer",difficulty:"advanced",problem:"A layer has $n_{in} = 256$ and $n_{out} = 128$. Compute the initialization standard deviation for (a) He (fan-in), (b) Xavier uniform, and explain why they differ.",solution:[{step:"He (fan-in) initialization",formula:"\\sigma_{He} = \\sqrt{2/n_{in}} = \\sqrt{2/256} = \\sqrt{1/128} \\approx 0.0884",explanation:"Only uses fan-in. The factor 2 compensates for ReLU. Does not depend on n_out."},{step:"Xavier (uniform) initialization",formula:"a = \\sqrt{6/(n_{in}+n_{out})} = \\sqrt{6/384} \\approx 0.125",explanation:"Uses harmonic mean of fan-in and fan-out. The uniform bound a ≈ 0.125 means weights drawn from [-0.125, 0.125]."},{step:"Xavier (normal)",formula:"\\sigma_{Xavier} = \\sqrt{2/(n_{in}+n_{out})} = \\sqrt{2/384} \\approx 0.072",explanation:"Compare: He σ=0.088 > Xavier σ=0.072. He is larger to compensate for ReLU's variance reduction."},{step:"Why they differ",formula:"\\text{ReLU: } \\text{Var}(h) = \\text{Var}(z)/2, \\quad \\text{tanh: } \\text{Var}(h) \\approx \\text{Var}(z)",explanation:"ReLU kills half the variance, requiring 2× larger weights to compensate. Use He for ReLU, Xavier for tanh/linear."}]}),e.jsx(C,{title:"Initialization Pitfalls",children:e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Zero initialization:"})," Initializing all weights to 0 (or the same value) breaks symmetry — all neurons learn the same thing. Always use random initialization (except biases which can be 0)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Too-large initialization:"})," Weights initialized too large cause saturated activations (tanh/sigmoid) or ReLU death. Symptoms: loss=NaN in first step, or flat loss curve. Reduce learning rate or use proper initialization."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mismatch with activation:"})," Using Xavier init with ReLU (instead of He) causes variance to halve at each layer — 30-layer network has variance ",e.jsx(T.InlineMath,{math:"2^{-30}"}),". Similarly, He init with tanh causes variance explosion. Always match initialization to activation function."]})]})}),e.jsx(W,{code:Ye,title:"Xavier, He Initialization & Signal Propagation — PyTorch",runnable:!0})]})}const ut=Object.freeze(Object.defineProperty({__proto__:null,default:Ze},Symbol.toStringTag,{value:"Module"}));export{it as a,rt as b,st as c,ot as d,lt as e,dt as f,ct as g,ht as h,mt as i,pt as j,ut as k,nt as s};
