/**
 * SVG Vector Arrow component.
 *
 * Renders a labeled vector arrow from (x1,y1) to (x2,y2) in math coordinates.
 * Requires a parent <svg> element and uses a <defs> marker for the arrowhead.
 *
 * Props:
 *   id        {string}  Unique ID for the arrowhead marker
 *   x1, y1   {number}  Start point (math coordinates)
 *   x2, y2   {number}  End point (math coordinates)
 *   color     {string}  Stroke/fill color (default '#818cf8')
 *   label     {string}  Optional label text near arrowhead
 *   toSvg     {fn}     Function (x, y) => [svgX, svgY] converting math→SVG coords
 *   width     {number}  Stroke width (default 2.5)
 *   dashed    {boolean} Dashed line (default false)
 */
function VectorArrow({ id, x1, y1, x2, y2, color = '#818cf8', label, toSvg, width = 2.5, dashed = false }) {
  if (!toSvg) return null
  const [sx1, sy1] = toSvg(x1, y1)
  const [sx2, sy2] = toSvg(x2, y2)
  const dx = sx2 - sx1, dy = sy2 - sy1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 4) return null

  const markerId = `arrow-${id}`

  // Label offset: slightly perpendicular to vector direction
  const nx = -dy / len, ny = dx / len
  const lx = sx2 + dx / len * 8 + nx * 12
  const ly = sy2 + dy / len * 8 + ny * 12

  return (
    <g>
      <defs>
        <marker id={markerId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={sx1} y1={sy1} x2={sx2} y2={sy2}
        stroke={color} strokeWidth={width}
        strokeDasharray={dashed ? '6,4' : undefined}
        markerEnd={`url(#${markerId})`}
      />
      {label && (
        <text x={lx} y={ly} fill={color} fontSize="12" fontFamily="serif" fontStyle="italic"
          textAnchor="middle" dominantBaseline="central">
          {label}
        </text>
      )}
    </g>
  )
}

export default VectorArrow
