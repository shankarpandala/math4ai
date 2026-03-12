import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';

// ---------------------------------------------------------------------------
// BFS/DFS Traversal Visualizer
// ---------------------------------------------------------------------------

const NODES = [
  { id: 0, label: 'A', x: 130, y: 50 },
  { id: 1, label: 'B', x: 50,  y: 140 },
  { id: 2, label: 'C', x: 210, y: 140 },
  { id: 3, label: 'D', x: 50,  y: 230 },
  { id: 4, label: 'E', x: 210, y: 230 },
  { id: 5, label: 'F', x: 130, y: 310 },
];

const EDGES = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]];

function buildAdj(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });
  return adj;
}

const ADJ = buildAdj(NODES.length, EDGES);

function bfsOrder(start) {
  const visited = new Array(NODES.length).fill(false);
  const order = [];
  const queue = [start];
  visited[start] = true;
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    ADJ[u].forEach(v => { if (!visited[v]) { visited[v] = true; queue.push(v); } });
  }
  return order;
}

function dfsOrder(start) {
  const visited = new Array(NODES.length).fill(false);
  const order = [];
  function dfs(u) { visited[u] = true; order.push(u); ADJ[u].forEach(v => { if (!visited[v]) dfs(v); }); }
  dfs(start);
  return order;
}

function TraversalViz() {
  const [mode, setMode] = useState('BFS');
  const [startNode, setStartNode] = useState(0);
  const [step, setStep] = useState(-1);

  const order = mode === 'BFS' ? bfsOrder(startNode) : dfsOrder(startNode);
  const visitedSoFar = new Set(step >= 0 ? order.slice(0, step + 1) : []);

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">BFS / DFS Traversal Explorer</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Select a start node and algorithm, then step through the traversal.
      </p>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-2">
          {['BFS', 'DFS'].map(m => (
            <button key={m} onClick={() => { setMode(m); setStep(-1); }}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Start:</span>
          {NODES.map(n => (
            <button key={n.id} onClick={() => { setStartNode(n.id); setStep(-1); }}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${startNode === n.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <svg width={270} height={360} className="shrink-0">
          {EDGES.map(([u, v], i) => {
            const nu = NODES[u], nv = NODES[v];
            const bothVisited = visitedSoFar.has(u) && visitedSoFar.has(v);
            return (
              <line key={i} x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y}
                stroke={bothVisited ? '#6366f1' : '#d1d5db'}
                strokeWidth={bothVisited ? 2.5 : 1.5}
                className={bothVisited ? '' : 'dark:stroke-gray-600'} />
            );
          })}
          {NODES.map(node => {
            const idx = order.indexOf(node.id);
            const isVisited = visitedSoFar.has(node.id);
            const isCurrent = step >= 0 && order[step] === node.id;
            return (
              <g key={node.id} onClick={() => { setStartNode(node.id); setStep(-1); }} className="cursor-pointer">
                <circle cx={node.x} cy={node.y} r={22}
                  fill={isCurrent ? '#4f46e5' : isVisited ? '#818cf8' : '#e5e7eb'}
                  stroke={isCurrent ? '#312e81' : '#fff'} strokeWidth={isCurrent ? 3 : 2} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={13} fontWeight="700"
                  fill={isVisited ? '#fff' : '#6b7280'}>
                  {node.label}
                </text>
                {isVisited && (
                  <text x={node.x + 26} y={node.y + 5} textAnchor="middle" fontSize={11}
                    fill="#4f46e5" className="dark:fill-indigo-300">
                    {idx + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              {mode} Order from {NODES[startNode].label}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {order.map((nid, i) => (
                <span key={i}
                  className={`rounded px-2 py-0.5 text-xs font-mono font-bold transition-all ${
                    i <= step ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  }`}>
                  {NODES[nid].label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={() => setStep(-1)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Reset
            </button>
            <button onClick={() => setStep(s => Math.max(-1, s - 1))} disabled={step < 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
              ← Prev
            </button>
            <button onClick={() => setStep(s => Math.min(order.length - 1, s + 1))} disabled={step >= order.length - 1}
              className="rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
              Next →
            </button>
          </div>

          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-xs text-gray-600 dark:text-gray-400">
            <strong>BFS</strong> uses a queue (FIFO) — explores all neighbors at depth <em>k</em> before depth <em>k+1</em>. Finds shortest paths.<br/>
            <strong>DFS</strong> uses a stack (recursion) — goes as deep as possible before backtracking. Finds connected components.
          </div>
        </div>
      </div>
    </div>
  );
}

const CODE = `import numpy as np
from collections import deque

# Graph as adjacency list
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'F'],
    'E': ['C', 'F'],
    'F': ['D', 'E'],
}

# ── BFS: shortest paths from source ──────────────────────────────────────────
def bfs(graph, source):
    """Returns (visited order, distances, parents) from source."""
    dist = {source: 0}
    parent = {source: None}
    order = []
    queue = deque([source])
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                parent[v] = u
                queue.append(v)
    return order, dist, parent

order, dist, parent = bfs(graph, 'A')
print("BFS order from A:", order)
print("Distances from A:", dist)

# Reconstruct shortest path A → F
def shortest_path(parent, target):
    path = []
    while target is not None:
        path.append(target)
        target = parent[target]
    return list(reversed(path))

print("Shortest path A→F:", shortest_path(parent, 'F'))

# ── DFS: connected components ─────────────────────────────────────────────────
def dfs(graph, source, visited=None):
    if visited is None:
        visited = set()
    visited.add(source)
    for v in graph[source]:
        if v not in visited:
            dfs(graph, v, visited)
    return visited

# Find all connected components
def connected_components(graph):
    visited = set()
    components = []
    for node in graph:
        if node not in visited:
            comp = dfs(graph, node, set())
            visited |= comp
            components.append(sorted(comp))
    return components

print("Connected components:", connected_components(graph))
print("Is connected:", len(connected_components(graph)) == 1)

# ── Dijkstra's shortest path (weighted graph) ─────────────────────────────────
import heapq

def dijkstra(graph_weighted, source):
    dist = {node: float('inf') for node in graph_weighted}
    dist[source] = 0
    pq = [(0, source)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph_weighted[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist

weighted = {
    'A': [('B', 1), ('C', 4)],
    'B': [('A', 1), ('C', 2), ('D', 5)],
    'C': [('A', 4), ('B', 2), ('D', 1)],
    'D': [('B', 5), ('C', 1)],
}
print("Dijkstra from A:", dijkstra(weighted, 'A'))
`;

export default function Connectivity() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Connectivity &amp; Paths
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Graph connectivity, BFS, DFS, and shortest path algorithms — the computational
          backbone of network analysis, routing, and graph neural networks.
        </p>
      </div>

      <NoteBlock title="Why Connectivity Matters for AI">
        <p>
          Connectivity is the foundation of every graph algorithm. In knowledge graphs,
          connected components correspond to isolated sub-domains of knowledge. In GNNs,
          the receptive field of a node after <InlineMath math="k" /> message-passing layers
          is exactly its <InlineMath math="k" />-hop neighborhood — discovered by BFS.
          PageRank and many centrality measures require the graph to be (strongly) connected.
        </p>
      </NoteBlock>

      <DefinitionBlock
        label="Definition 1.4"
        title="Connected Graph &amp; Components"
        definition="A graph $G = (V,E)$ is connected if for every pair $u,v \in V$ there exists a path from $u$ to $v$. A connected component is a maximal connected subgraph. The number of connected components is denoted $c(G)$. A graph is $k$-connected if it remains connected after removing any $k-1$ vertices; the vertex connectivity $\kappa(G)$ is the largest such $k$."
        notation="Trees are minimally connected: $|E| = |V|-1$ and removing any edge disconnects them. For a connected graph, $|E| \geq |V|-1$. Menger's theorem: $\kappa(G)$ equals the maximum number of internally vertex-disjoint paths between any pair of vertices."
      />

      <DefinitionBlock
        label="Definition 1.5"
        title="BFS &amp; DFS Traversal"
        definition="Breadth-First Search (BFS) from source $s$ processes vertices in non-decreasing order of distance from $s$, using a queue. It computes shortest-path distances $d(s,v)$ in $O(|V|+|E|)$ time for unweighted graphs. Depth-First Search (DFS) explores as far as possible along each branch before backtracking, using a stack (or recursion). DFS runs in $O(|V|+|E|)$ and classifies edges into tree, back, forward, and cross edges."
        notation="BFS tree: the set of edges $(parent[v], v)$ for all $v \neq s$. DFS discovery time $d[v]$ and finish time $f[v]$ define the parenthesis structure. DFS forest: the DFS tree(s) spanning all vertices. For undirected graphs, DFS produces only tree and back edges."
      />

      <TraversalViz />

      <TheoremBlock
        label="Theorem 1.3"
        title="BFS Shortest Path Correctness"
        statement="For an unweighted graph $G$, BFS from source $s$ correctly computes the shortest-path distance $d(s,v)$ for all $v \in V$. Formally, when vertex $v$ is dequeued, $\text{dist}[v] = d(s,v)$."
        proof="By induction on distance $k = d(s,v)$. Base: $d(s,s)=0$ and $s$ is initialized with dist=0. Inductive step: suppose all vertices at distance $< k$ are correctly processed before any vertex at distance $k$. A vertex $v$ with $d(s,v)=k$ has some neighbor $u$ with $d(s,u)=k-1$; by induction $u$ is processed first and enqueues $v$ with dist $k$. No shorter path exists since that would contradict $d(s,v)=k$. The FIFO queue maintains the BFS level invariant: all vertices at distance $k$ are enqueued before any at distance $k+1$. $\square$"
        corollaries={[
          "BFS gives a $O(|V|+|E|)$ algorithm for single-source shortest paths in unweighted graphs — optimal since we must read all edges.",
          "DFS gives $O(|V|+|E|)$ algorithms for topological sort, strongly connected components (Kosaraju, Tarjan), and bridge/articulation-point detection.",
          "For weighted graphs, Dijkstra's algorithm gives $O((|V|+|E|)\\log|V|)$ shortest paths using a priority queue.",
        ]}
      />

      <TheoremBlock
        label="Theorem 1.4"
        title="Dijkstra's Algorithm Correctness"
        statement="Given a weighted graph with non-negative edge weights $w: E \to \mathbb{R}_{\geq 0}$, Dijkstra's algorithm correctly computes single-source shortest paths in $O((|V|+|E|)\log|V|)$ time with a binary heap."
        proof="Greedy invariant: when a vertex $u$ is extracted from the priority queue with distance $d[u]$, this distance is optimal. Proof by contradiction: suppose $d[u] > d(s,u)$ at extraction. Then there exists a shorter path $s \leadsto x \to \cdots \to u$. The first unextracted vertex $x$ on this path satisfies $d[x] \leq d(s,x) < d(s,u) \leq d[u]$, so $x$ would have been extracted before $u$ — contradiction. Non-negative weights are essential: a negative edge could make a not-yet-extracted path shorter. $\square$"
        corollaries={[
          "Bellman–Ford handles negative edge weights in $O(|V||E|)$ but cannot handle negative cycles.",
          "For unit-weight graphs, BFS is optimal. For graphs with small integer weights, dial's algorithm runs in $O(|V|+|E|+W)$ where $W$ is max weight.",
        ]}
      />

      <ExampleBlock
        title="Finding Shortest Paths in a Small Network"
        difficulty="beginner"
        problem="Given the graph with edges A-B(1), A-C(4), B-C(2), B-D(5), C-D(1), find all shortest paths from A using Dijkstra's algorithm."
        solution={[
          { step: 'Initialize', formula: 'd[A]=0,\\; d[B]=d[C]=d[D]=\\infty', explanation: 'All distances infinite except source.' },
          { step: 'Extract A (d=0), relax neighbors', formula: 'd[B] = 0+1=1,\\; d[C] = 0+4=4', explanation: 'Update B and C via A.' },
          { step: 'Extract B (d=1), relax neighbors', formula: 'd[C] = \\min(4, 1+2)=3,\\; d[D] = 1+5=6', explanation: 'B-C path improves C to 3.' },
          { step: 'Extract C (d=3), relax neighbors', formula: 'd[D] = \\min(6, 3+1)=4', explanation: 'C-D path improves D to 4.' },
          { step: 'Extract D (d=4)', formula: '\\text{Final: } d[A]=0, d[B]=1, d[C]=3, d[D]=4', explanation: 'Shortest paths: A, A-B, A-B-C, A-B-C-D.' },
        ]}
      />

      <WarningBlock title="Common Connectivity Pitfalls">
        <ul className="space-y-2 text-sm">
          <li><strong>DFS vs BFS for shortest paths:</strong> DFS does NOT find shortest paths in unweighted graphs — it finds <em>a</em> path, not the shortest. Always use BFS for shortest paths in unweighted graphs.</li>
          <li><strong>Directed vs undirected connectivity:</strong> A directed graph can be weakly connected (connected if edges are undirected) but not strongly connected. Algorithms for strongly connected components (Tarjan, Kosaraju) are different from undirected component detection.</li>
          <li><strong>Dijkstra with negative weights:</strong> Never use Dijkstra with negative edge weights — the greedy invariant breaks. Use Bellman-Ford instead (<InlineMath math="O(|V||E|)" />).</li>
        </ul>
      </WarningBlock>

      <PythonCode code={CODE} title="BFS, DFS, Dijkstra — Python Implementation" runnable />
    </div>
  );
}
