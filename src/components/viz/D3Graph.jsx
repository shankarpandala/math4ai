import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

/**
 * D3 force-directed graph visualization.
 *
 * Props:
 *   nodes   {Array}  Array of { id, label, group?, size? }
 *   links   {Array}  Array of { source, target, label? }
 *   height  {number} SVG height (default 380)
 *   title   {string} Optional chart title
 *   onNodeClick {fn} Called with node data when a node is clicked
 *
 * Node groups map to colors; nodes are draggable.
 */
const GROUP_COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8']

function D3Graph({ nodes = [], links = [], height = 380, title, onNodeClick }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [width, setWidth] = useState(500)

  // Observe container width for responsiveness
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width || 500)
      }
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'd3g-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 18).attr('refY', 5)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#475569')

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#d3g-arrow)')

    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(links.filter(l => l.label))
      .join('text')
      .attr('fill', '#64748b')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .text(d => d.label)

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick?.(d))
      .call(
        d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x; d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          })
      )

    node.append('circle')
      .attr('r', d => d.size || 16)
      .attr('fill', d => GROUP_COLORS[(d.group || 0) % GROUP_COLORS.length])
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 1.5)

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#f1f5f9')
      .attr('font-size', 11)
      .attr('font-family', 'monospace')
      .text(d => d.label || d.id)

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 6)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => simulation.stop()
  }, [nodes, links, width, height, onNodeClick])

  return (
    <div ref={containerRef} className="my-6 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-950 overflow-hidden">
      {title && (
        <div className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-300">{title}</div>
      )}
      <svg ref={svgRef} width={width} height={height} />
    </div>
  )
}

export default D3Graph
