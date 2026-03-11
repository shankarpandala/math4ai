import React, { useMemo } from 'react';

/**
 * Color scheme definitions: returns [r,g,b] for a value in [0,1].
 */
const COLOR_SCHEMES = {
  blue: (v) => {
    const r = Math.round(239 - v * 180);
    const g = Math.round(246 - v * 180);
    const b = Math.round(255 - v * 30);
    return `rgb(${r},${g},${b})`;
  },
  green: (v) => {
    const r = Math.round(240 - v * 200);
    const g = Math.round(255 - v * 50);
    const b = Math.round(240 - v * 200);
    return `rgb(${r},${g},${b})`;
  },
  red: (v) => {
    const r = Math.round(255 - v * 30);
    const g = Math.round(240 - v * 200);
    const b = Math.round(240 - v * 200);
    return `rgb(${r},${g},${b})`;
  },
  purple: (v) => {
    const r = Math.round(240 - v * 140);
    const g = Math.round(240 - v * 200);
    const b = Math.round(255 - v * 30);
    return `rgb(${r},${g},${b})`;
  },
};

/**
 * Renders a color-coded grid (heatmap). Useful for attention weight
 * visualization and other 2-D weight matrices.
 *
 * Props:
 *   data         {number[][]}   2D array of values in [0, 1]
 *   xLabels      {string[]}     Column labels (optional)
 *   yLabels      {string[]}     Row labels (optional)
 *   title        {string}       Chart title (optional)
 *   colorScheme  {string}       'blue' | 'green' | 'red' | 'purple'
 *   cellSize     {number}       Cell size in pixels (default 48)
 */
function HeatmapGrid({
  data = [],
  xLabels = [],
  yLabels = [],
  title = '',
  colorScheme = 'blue',
  cellSize = 48,
}) {
  const rows = data.length;
  const cols = rows > 0 ? data[0].length : 0;

  const colorFn = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.blue;

  const labelFontSize = Math.max(10, Math.min(14, cellSize * 0.28));
  const valueFontSize = Math.max(9, Math.min(13, cellSize * 0.25));

  // SVG layout constants
  const yLabelWidth = yLabels.length > 0 ? 80 : 0;
  const xLabelHeight = xLabels.length > 0 ? 36 : 0;
  const padding = 16;

  const svgWidth = yLabelWidth + cols * cellSize + padding * 2;
  const svgHeight = xLabelHeight + rows * cellSize + padding * 2;

  const cells = useMemo(() => {
    const items = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = data[r][c] ?? 0;
        const clamped = Math.max(0, Math.min(1, val));
        const x = padding + yLabelWidth + c * cellSize;
        const y = padding + xLabelHeight + r * cellSize;
        items.push({ r, c, val: clamped, x, y });
      }
    }
    return items;
  }, [data, rows, cols, yLabelWidth, xLabelHeight, cellSize, padding]);

  if (rows === 0 || cols === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 p-8 text-sm text-gray-400 dark:border-gray-700">
        No data to display
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="select-none">
          {/* X-axis labels (column headers) */}
          {xLabels.map((label, c) => (
            <text
              key={`x-${c}`}
              x={padding + yLabelWidth + c * cellSize + cellSize / 2}
              y={padding + xLabelHeight - 6}
              textAnchor="middle"
              fontSize={labelFontSize}
              className="fill-gray-600 dark:fill-gray-400"
            >
              {label}
            </text>
          ))}

          {/* Y-axis labels (row headers) */}
          {yLabels.map((label, r) => (
            <text
              key={`y-${r}`}
              x={padding + yLabelWidth - 8}
              y={padding + xLabelHeight + r * cellSize + cellSize / 2 + 4}
              textAnchor="end"
              fontSize={labelFontSize}
              className="fill-gray-600 dark:fill-gray-400"
            >
              {label}
            </text>
          ))}

          {/* Cells */}
          {cells.map(({ r, c, val, x, y }) => {
            const bgColor = colorFn(val);
            const textColor = val > 0.5 ? '#1e293b' : '#64748b';
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  rx={3}
                  fill={bgColor}
                  className="transition-all duration-150"
                />
                <text
                  x={x + cellSize / 2 - 1}
                  y={y + cellSize / 2 + valueFontSize / 3}
                  textAnchor="middle"
                  fontSize={valueFontSize}
                  fill={textColor}
                  fontFamily="monospace"
                >
                  {val.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>0.0</span>
        <div
          className="h-3 w-32 rounded"
          style={{
            background: `linear-gradient(to right, ${colorFn(0)}, ${colorFn(0.5)}, ${colorFn(1)})`,
          }}
        />
        <span>1.0</span>
      </div>
    </div>
  );
}

export default HeatmapGrid;
