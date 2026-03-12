import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ---------------------------------------------------------------------------
// Graph Visualizer — 6-node circular layout, click to highlight nodes
// ---------------------------------------------------------------------------

const NUM_NODES = 6;
const RADIUS = 80;
const CX = 130;
const CY = 130;

// Node positions arranged in a circle
const NODE_POSITIONS = Array.from({ length: NUM_NODES }, (_, i) => {
  const angle = (2 * Math.PI * i) / NUM_NODES - Math.PI / 2;
  return {
    id: i,
    label: String.fromCharCode(65 + i), // A, B, C, D, E, F
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
  };
});

// Edges of the example graph
const EDGES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
];

// Precompute degree of each node
function computeDegrees() {
  const deg = Array(NUM_NODES).fill(0);
  EDGES.forEach(([u, v]) => {
    deg[u]++;
    deg[v]++;
  });
  return deg;
}

const DEGREES = computeDegrees();

// Build adjacency matrix
function buildAdjMatrix() {
  const mat = Array.from({ length: NUM_NODES }, () => Array(NUM_NODES).fill(0));
  EDGES.forEach(([u, v]) => {
    mat[u][v] = 1;
    mat[v][u] = 1;
  });
  return mat;
}

const ADJ_MATRIX = buildAdjMatrix();

function GraphVisualizer() {
  const [selectedNode, setSelectedNode] = useState(null);

  const isHighlightedEdge = (u, v) => {
    if (selectedNode === null) return false;
    return u === selectedNode || v === selectedNode;
  };

  const isHighlightedNode = (id) => {
    if (selectedNode === null) return false;
    if (id === selectedNode) return true;
    return ADJ_MATRIX[selectedNode][id] === 1;
  };

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <h3 className="mb-1 text-base font-bold text-gray-800 dark:text-gray-200">
        Interactive Graph Visualizer
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        A graph <InlineMath math="G = (V, E)" /> with <InlineMath math="|V| = 6" /> vertices and{' '}
        <InlineMath math="|E| = 8" /> edges. Click a node to highlight it and its neighbors.
        Node degree is the number of edges incident to it.
      </p>

      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* SVG graph */}
        <div className="shrink-0">
          <svg
            width={260}
            height={260}
            style={{ fontFamily: 'inherit' }}
            className="mx-auto block"
          >
            {/* Edges */}
            {EDGES.map(([u, v], idx) => {
              const nu = NODE_POSITIONS[u];
              const nv = NODE_POSITIONS[v];
              const highlighted = isHighlightedEdge(u, v);
              return (
                <line
                  key={idx}
                  x1={nu.x}
                  y1={nu.y}
                  x2={nv.x}
                  y2={nv.y}
                  stroke={highlighted ? '#6366f1' : '#d1d5db'}
                  strokeWidth={highlighted ? 2.5 : 1.5}
                  className={highlighted ? '' : 'dark:stroke-gray-600'}
                />
              );
            })}

            {/* Nodes */}
            {NODE_POSITIONS.map((node) => {
              const isSelected = selectedNode === node.id;
              const isNeighbor = isHighlightedNode(node.id) && !isSelected;
              let fill = '#6366f1';
              if (isSelected) fill = '#4f46e5';
              else if (isNeighbor) fill = '#a5b4fc';
              else if (selectedNode !== null) fill = '#e5e7eb';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill={fill}
                    stroke={isSelected ? '#312e81' : '#fff'}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight="700"
                    fill={selectedNode !== null && !isSelected && !isNeighbor ? '#9ca3af' : '#fff'}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-center text-xs text-gray-400 dark:text-gray-500">
            Click a node to inspect it
          </p>
        </div>

        {/* Info panel */}
        <div className="flex-1 space-y-4">
          {/* Node degree table */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Node Degrees
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60">
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Vertex
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Degree
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Neighbors
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {NODE_POSITIONS.map((node) => {
                    const neighbors = EDGES.flatMap(([u, v]) => {
                      if (u === node.id) return [NODE_POSITIONS[v].label];
                      if (v === node.id) return [NODE_POSITIONS[u].label];
                      return [];
                    });
                    const isActive = selectedNode === node.id;
                    return (
                      <tr
                        key={node.id}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                        }`}
                        onClick={() =>
                          setSelectedNode(selectedNode === node.id ? null : node.id)
                        }
                      >
                        <td className="px-3 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {node.label}
                        </td>
                        <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">
                          {DEGREES[node.id]}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                          {'{' + neighbors.join(', ') + '}'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Handshaking check */}
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-xs text-indigo-800 dark:border-indigo-700/40 dark:bg-indigo-900/20 dark:text-indigo-300">
            <span className="font-semibold">Handshaking Lemma check: </span>
            <InlineMath math={`\\sum \\deg(v) = ${DEGREES.reduce((a, b) => a + b, 0)} = 2 \\times ${EDGES.length} = 2|E|`} />
            {' '}✓
          </div>

          {/* Selected node info */}
          {selectedNode !== null && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              <span className="font-semibold">Selected: </span>
              vertex <strong>{NODE_POSITIONS[selectedNode].label}</strong> has degree{' '}
              <strong>{DEGREES[selectedNode]}</strong> — it is adjacent to{' '}
              {EDGES.flatMap(([u, v]) => {
                if (u === selectedNode) return [NODE_POSITIONS[v].label];
                if (v === selectedNode) return [NODE_POSITIONS[u].label];
                return [];
              }).join(', ')}.
            </div>
          )}
        </div>
      </div>

      {/* Adjacency Matrix */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Adjacency Matrix <InlineMath math="A" /> (rows/cols = A, B, C, D, E, F)
        </p>
        <div className="overflow-x-auto">
          <table className="font-mono text-sm">
            <thead>
              <tr>
                <th className="w-6" />
                {NODE_POSITIONS.map((n) => (
                  <th
                    key={n.id}
                    className="w-8 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                  >
                    {n.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADJ_MATRIX.map((row, i) => (
                <tr key={i}>
                  <td className="pr-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {NODE_POSITIONS[i].label}
                  </td>
                  {row.map((val, j) => {
                    const highlight =
                      selectedNode !== null && (i === selectedNode || j === selectedNode) && val === 1;
                    return (
                      <td
                        key={j}
                        className={`w-8 py-0.5 text-center text-xs ${
                          highlight
                            ? 'font-bold text-indigo-600 dark:text-indigo-400'
                            : val === 1
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Python code
// ---------------------------------------------------------------------------

const GRAPH_CODE = `import networkx as nx
import matplotlib.pyplot as plt

# Create an undirected graph
G = nx.Graph()
G.add_nodes_from(['A', 'B', 'C', 'D', 'E', 'F'])
edges = [('A','B'), ('A','C'), ('B','C'), ('B','D'),
         ('C','E'), ('D','E'), ('D','F'), ('E','F')]
G.add_edges_from(edges)

# Node degrees
print("Vertex degrees:")
for node, deg in G.degree():
    neighbors = list(G.neighbors(node))
    print(f"  deg({node}) = {deg}, neighbors = {neighbors}")

# Verify Handshaking Lemma
total_degree = sum(d for _, d in G.degree())
print(f"\\nSum of degrees = {total_degree} = 2 * {G.number_of_edges()} = 2|E| ✓")

# Adjacency matrix
A = nx.adjacency_matrix(G).toarray()
print("\\nAdjacency matrix A:")
print(A)

# Shortest path (BFS)
path = nx.shortest_path(G, source='A', target='F')
print(f"\\nShortest path A → F: {' → '.join(path)}")
print(f"Path length: {len(path) - 1} edges")

# All-pairs shortest paths
print("\\nAll-pairs shortest path lengths:")
for src in ['A', 'B', 'C']:
    for dst in ['D', 'E', 'F']:
        length = nx.shortest_path_length(G, src, dst)
        print(f"  d({src}, {dst}) = {length}")

# Check graph properties
print(f"\\nConnected: {nx.is_connected(G)}")
print(f"Bipartite: {nx.is_bipartite(G)}")
print(f"Number of cycles (cycle basis): {len(nx.cycle_basis(G))}")

# Visualize
pos = nx.circular_layout(G)
plt.figure(figsize=(6, 6))
nx.draw(G, pos, with_labels=True, node_color='#6366f1',
        node_size=800, font_color='white', font_weight='bold',
        edge_color='#9ca3af', width=2)
plt.title("Graph G = (V, E)")
plt.tight_layout()
plt.savefig("graph.png", dpi=150)
plt.show()`;

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const REFERENCES = [
  {
    authors: 'Euler, L.',
    year: 1736,
    title: 'Solutio problematis ad geometriam situs pertinentis (Solution of a problem relating to the geometry of position)',
    venue: 'Commentarii Academiae Scientiarum Imperialis Petropolitanae, 8, 128–140',
    url: 'https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg',
    type: 'foundational',
    whyImportant: 'The founding paper of graph theory. Euler proved that the Königsberg bridge problem has no solution by showing a necessary condition for an Eulerian path, introducing the concept of degree.',
  },
  {
    authors: 'Cayley, A.',
    year: 1889,
    title: 'A theorem on trees',
    venue: 'Quarterly Journal of Pure and Applied Mathematics, 23, 376–378',
    url: 'https://en.wikipedia.org/wiki/Cayley%27s_formula',
    type: 'foundational',
    whyImportant: "Cayley's formula: the number of labeled trees on n vertices is n^(n-2). One of the earliest results on counting graphs, proved using what is now called the Prüfer sequence.",
  },
  {
    authors: 'Bondy, J. A. & Murty, U. S. R.',
    year: 2008,
    title: 'Graph Theory',
    venue: 'Springer Graduate Texts in Mathematics, Vol. 244',
    url: 'https://link.springer.com/book/9781846289699',
    type: 'textbook',
    whyImportant: 'The definitive modern graduate textbook on graph theory. Comprehensive coverage of connectivity, matchings, colorings, planarity, and extremal graph theory.',
  },
  {
    authors: 'West, D. B.',
    year: 2001,
    title: 'Introduction to Graph Theory (2nd ed.)',
    venue: 'Prentice Hall',
    url: 'https://www.pearson.com/en-us/subject-catalog/p/introduction-to-graph-theory/P200000006219',
    type: 'textbook',
    whyImportant: 'An excellent undergraduate-level introduction with a wealth of exercises. Covers trees, connectivity, planarity, colorings, and network flows.',
  },
  {
    authors: 'Diestel, R.',
    year: 2017,
    title: 'Graph Theory (5th ed.)',
    venue: 'Springer Graduate Texts in Mathematics (freely available online)',
    url: 'https://diestel-graph-theory.com/',
    type: 'textbook',
    whyImportant: 'Freely available online. A rigorous treatment suitable for advanced study, covering infinite graphs and deep structural results.',
  },
];

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------

export default function GraphDefinitions() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Graph Definitions &amp; Fundamentals
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          The foundational language of graph theory: vertices, edges, degrees, paths, and
          connectivity — the building blocks of network analysis and combinatorial optimization.
        </p>
      </div>

      {/* Historical note */}
      <NoteBlock type="historical">
        <p>
          Graph theory was born on September 26, 1735, when{' '}
          <strong>Leonhard Euler</strong> presented his solution to the{' '}
          <em>Seven Bridges of Königsberg</em> problem to the St. Petersburg Academy of
          Sciences (published 1736). The citizens of Königsberg (now Kaliningrad) wondered
          whether one could walk through the city crossing each of its seven bridges exactly
          once. Euler proved this impossible by observing that such a walk — now called an
          Eulerian path — requires at most two vertices of odd degree. Since all four land
          masses had odd degree, no such walk could exist.
        </p>
        <p className="mt-2">
          Euler's insight was revolutionary: he abstracted the physical map into a
          combinatorial object consisting only of <em>vertices</em> (land masses) and{' '}
          <em>edges</em> (bridges), discarding irrelevant geometric detail. This abstraction
          is the core idea of graph theory, and Euler's 1736 paper is widely considered the
          first result in discrete mathematics.
        </p>
      </NoteBlock>

      {/* Motivation */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
          Why Graph Theory Matters for AI
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Graphs model pairwise relationships and appear throughout machine learning: social
          networks, knowledge graphs, molecular structures, scene graphs, dependency parses,
          and the computational graph of a neural network are all graphs. Graph Neural
          Networks (GNNs), introduced by Scarselli et al. (2009) and popularized by
          Kipf &amp; Welling (2017), operate directly on graph-structured data to perform
          node classification, link prediction, and graph classification.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Beyond GNNs, graph algorithms underpin recommendation systems (collaborative
          filtering via bipartite graphs), code analysis (call graphs, control flow graphs),
          and knowledge base reasoning (entity-relationship graphs). Mastering graph
          fundamentals is therefore essential for modern AI practitioners.
        </p>
      </section>

      {/* Interactive Visualizer */}
      <GraphVisualizer />

      {/* Definition: Graph */}
      <DefinitionBlock
        label="Definition 1.1"
        title="Graph"
        definition="A graph $G = (V, E)$ consists of a finite non-empty set of vertices $V$ (also called nodes) and a set of edges $E \subseteq \binom{V}{2}$ (unordered pairs of distinct vertices). The order of $G$ is $|V|$ (number of vertices); the size of $G$ is $|E|$ (number of edges). A directed graph (digraph) $D = (V, A)$ replaces unordered pairs with ordered pairs $(u, v) \in V \times V$ called arcs. A weighted graph assigns a weight function $w: E \to \mathbb{R}$ to edges."
        notation="$n = |V|$ (vertices), $m = |E|$ (edges). We write $uv$ or $\{u,v\}$ for an undirected edge, $(u,v)$ for a directed arc. Two vertices $u, v$ are adjacent (neighbors) if $uv \in E$. An edge is incident to its endpoints."
      />

      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        The four main graph variants encountered in practice:
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Type
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Edges
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Example application
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              ['Undirected, unweighted', 'Symmetric, binary', 'Friendship network'],
              ['Undirected, weighted', 'Symmetric, real-valued', 'Road network with distances'],
              ['Directed, unweighted', 'Asymmetric, binary', 'Web link graph (PageRank)'],
              ['Directed, weighted', 'Asymmetric, real-valued', 'Neural network computation graph'],
            ].map(([type, edges, app], i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{type}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{edges}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{app}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Definition: Degree */}
      <DefinitionBlock
        label="Definition 1.2"
        title="Degree, In-degree, Out-degree, Adjacency Matrix"
        definition="The degree $\deg(v)$ of a vertex $v$ in an undirected graph is the number of edges incident to $v$: $\deg(v) = |\{u \in V : uv \in E\}|$. In a digraph, the in-degree $\deg^-(v)$ is the number of arcs entering $v$, and the out-degree $\deg^+(v)$ is the number of arcs leaving $v$: $\deg^-(v) = |\{u : (u,v) \in A\}|$, $\deg^+(v) = |\{u : (v,u) \in A\}|$. The adjacency matrix $A \in \{0,1\}^{n \times n}$ has $A_{ij} = 1$ if $\{i,j\} \in E$ (or $(i,j) \in A$ for digraphs), and $A_{ij} = 0$ otherwise."
        notation="A vertex of degree 0 is isolated. A vertex of degree 1 is a leaf. The minimum and maximum degrees are $\delta(G)$ and $\Delta(G)$. For undirected graphs, $A$ is symmetric ($A = A^\top$). The degree of vertex $i$ equals the $i$-th row sum of $A$: $\deg(i) = \sum_j A_{ij}$."
      />

      {/* Handshaking Lemma */}
      <TheoremBlock
        label="Theorem 1.1"
        title="Handshaking Lemma"
        statement="For any undirected graph $G = (V, E)$: $\sum_{v \in V} \deg(v) = 2|E|$. As a corollary, every graph has an even number of vertices with odd degree."
        proof="Each edge $e = \{u, v\} \in E$ contributes exactly 1 to $\deg(u)$ and exactly 1 to $\deg(v)$, and thus contributes exactly 2 to $\sum_{v \in V} \deg(v)$. Summing over all $|E|$ edges gives $\sum_{v} \deg(v) = 2|E|$. For the corollary: let $O$ be the set of odd-degree vertices and $P$ the set of even-degree vertices. Then $2|E| = \sum_{v \in O} \deg(v) + \sum_{v \in P} \deg(v)$. Since $2|E|$ and $\sum_{v \in P} \deg(v)$ are both even, $\sum_{v \in O} \deg(v)$ must be even. Since each term in this sum is odd, $|O|$ must be even. $\square$"
        corollaries={[
          "An Eulerian circuit (traversing each edge exactly once and returning to start) exists iff the graph is connected and every vertex has even degree — a direct consequence of the Handshaking Lemma.",
          "In any graph, $|E| \\leq \\binom{n}{2}$, so the average degree $\\bar{d} = 2|E|/n \\leq n-1$.",
          "For a $k$-regular graph (every vertex has degree $k$): $|E| = kn/2$, so $kn$ must be even — either $k$ or $n$ must be even.",
        ]}
      />

      {/* Definition: Path, Cycle, Connectivity */}
      <DefinitionBlock
        label="Definition 1.3"
        title="Path, Cycle, Connected Graph, Strongly Connected Digraph"
        definition="A walk in $G$ is a sequence $v_0, e_1, v_1, e_2, \ldots, e_k, v_k$ of alternating vertices and edges. A path is a walk with no repeated vertices (hence no repeated edges). A cycle is a closed walk $v_0, e_1, v_1, \ldots, e_k, v_0$ with no repeated vertices (except $v_0 = v_k$) and $k \geq 3$. A graph is connected if there exists a path between every pair of vertices. A digraph $D$ is strongly connected if for every ordered pair $(u, v)$ there is a directed path from $u$ to $v$."
        notation="The length of a path or cycle is its number of edges. The distance $d(u,v)$ between vertices $u,v$ is the length of a shortest path. The diameter of $G$ is $\max_{u,v} d(u,v)$. Connected components are maximal connected subgraphs. Strongly connected components (SCCs) of a digraph are maximal strongly connected subgraphs."
      />

      {/* Bipartite theorem */}
      <TheoremBlock
        label="Theorem 1.2"
        title="Bipartite Characterization"
        statement="A graph $G$ is bipartite (its vertex set can be partitioned into two independent sets $V = A \cup B$ with all edges between $A$ and $B$) if and only if $G$ contains no odd-length cycle."
        proof="($\Rightarrow$) Suppose $G$ is bipartite with parts $A$ and $B$. Any cycle must alternate between $A$ and $B$, so after $k$ steps we alternate $k$ times and return to the start. Returning to a vertex in $A$ requires an even number of alternations, so all cycles have even length. ($\Leftarrow$) Suppose $G$ contains no odd cycle. Fix a component and a root $r$. Run BFS from $r$; assign vertices at even BFS-distance to $A$ and odd distance to $B$. If any edge connects two vertices in the same part, there would be a cycle of odd length (proved by considering the BFS tree paths to their common ancestor) — contradicting the assumption. Hence the partition is valid and $G$ is bipartite. $\square$"
        corollaries={[
          "Trees are bipartite (they contain no cycles at all, hence no odd cycles).",
          "The 2-coloring (bipartition) can be computed in $O(n + m)$ time by BFS or DFS.",
          "Bipartite graphs model many AI problems: user-item recommendation (users in $A$, items in $B$), and matching problems in assignment algorithms.",
        ]}
      />

      {/* Example: social network */}
      <ExampleBlock
        title="Social Network as a Graph"
        difficulty="beginner"
        problem="Model a 4-person social network {Alice, Bob, Carol, Dave} where Alice knows Bob and Carol, Bob knows Carol and Dave, and Carol knows Dave. (1) Write down $V$, $E$, and the adjacency matrix $A$. (2) Find the degree of each vertex and verify the Handshaking Lemma. (3) Find the shortest path from Alice to Dave using BFS."
        solution={[
          {
            step: 'Set up the graph',
            formula: 'V = \\{A, B, C, D\\}, \\quad E = \\{AB, AC, BC, BD, CD\\}, \\quad |V|=4, |E|=5',
            explanation: 'Label Alice=A, Bob=B, Carol=C, Dave=D.',
          },
          {
            step: 'Write the adjacency matrix (rows/cols: A, B, C, D)',
            formula:
              'A = \\begin{pmatrix} 0 & 1 & 1 & 0 \\\\ 1 & 0 & 1 & 1 \\\\ 1 & 1 & 0 & 1 \\\\ 0 & 1 & 1 & 0 \\end{pmatrix}',
            explanation:
              'Entry A[i][j]=1 iff person i knows person j. The matrix is symmetric because the "knows" relation is mutual.',
          },
          {
            step: 'Compute degrees',
            formula:
              '\\deg(A)=2, \\quad \\deg(B)=3, \\quad \\deg(C)=3, \\quad \\deg(D)=2',
            explanation:
              'Sum = 2+3+3+2 = 10 = 2×5 = 2|E|. Handshaking Lemma confirmed. A and D have even degree; B and C have odd degree — there are 2 (even) odd-degree vertices.',
          },
          {
            step: 'BFS from Alice to find shortest path to Dave',
            formula:
              '\\text{Queue: } [A] \\to [B, C] \\to [C, D] \\to [D] \\text{ (found at distance 2)}',
            explanation:
              'BFS visits A (distance 0), then neighbors B and C (distance 1), then neighbors of B: C (visited), D (distance 2). Shortest path: A → B → D (length 2). Also A → C → D has length 2.',
          },
        ]}
      />

      {/* Warning: Adjacency matrix vs list */}
      <WarningBlock title="Adjacency Matrix vs. Adjacency List: When to Use Which">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              1
            </span>
            <span>
              <strong>Adjacency matrix</strong> (<InlineMath math="O(n^2)" /> space): Edge
              existence check is <InlineMath math="O(1)" />. Preferred for dense graphs (
              <InlineMath math="m = \Theta(n^2)" />), matrix operations (spectral graph
              theory, GNNs use the normalized adjacency), and when random edge queries are
              frequent. Bad for sparse graphs: wastes <InlineMath math="O(n^2)" /> memory
              even if <InlineMath math="m \ll n^2" />.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              2
            </span>
            <span>
              <strong>Adjacency list</strong> (<InlineMath math="O(n + m)" /> space): Iteration
              over neighbors is <InlineMath math="O(\deg(v))" />. Preferred for sparse graphs
              (most real-world networks: social graphs, web graphs, road networks all have
              <InlineMath math="m = O(n)" /> or <InlineMath math="m = O(n \log n)" />). BFS and
              DFS run in <InlineMath math="O(n+m)" /> with adjacency lists, but{' '}
              <InlineMath math="O(n^2)" /> with an adjacency matrix (due to scanning full rows).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
              3
            </span>
            <span>
              <strong>Practical rule:</strong> Use adjacency lists by default (NetworkX,
              PyTorch Geometric use CSR/COO sparse formats). Only use dense matrices when
              <InlineMath math="n \lesssim 10{,}000" /> and the graph is dense, or when you
              need matrix eigenvalues (Laplacian spectrum). For billion-node graphs (web,
              social), even adjacency lists must be stored on disk or distributed.
            </span>
          </li>
        </ul>
      </WarningBlock>

      {/* Python code */}
      <PythonCode
        code={GRAPH_CODE}
        language="python"
        title="Graph Theory with NetworkX — Degrees, Shortest Paths, Visualization"
        runnable
      />

      {/* References */}
      <ReferenceList references={REFERENCES} />
    </div>
  );
}
