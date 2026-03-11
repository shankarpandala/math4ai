import React from 'react';

/**
 * Renders a matrix with LaTeX-style brackets using SVG + HTML.
 *
 * Props:
 *   matrix      {number[][]}   2D array of numbers
 *   highlights  {number[][]}   Array of [row, col] pairs to highlight
 *   label       {string}       Optional label (e.g. "A =")
 *   precision   {number}       Decimal places for display (default 2)
 */
function MatrixDisplay({ matrix = [], highlights = [], label = '', precision = 2 }) {
  if (!matrix || matrix.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 p-4 text-sm text-gray-400 dark:border-gray-700">
        Empty matrix
      </div>
    );
  }

  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  // Build a Set for O(1) highlight lookup
  const highlightSet = new Set(highlights.map(([r, c]) => `${r},${c}`));

  // Determine cell width based on content
  const cellWidth = 56;
  const cellHeight = 36;
  const bracketWidth = 12;
  const innerWidth = cols * cellWidth;
  const innerHeight = rows * cellHeight;
  const totalWidth = innerWidth + bracketWidth * 2 + 8;
  const totalHeight = innerHeight + 8;

  return (
    <div className="inline-flex items-center gap-3 overflow-x-auto py-2">
      {label && (
        <span className="font-mono text-base font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {label}
        </span>
      )}

      <div className="relative inline-block">
        <svg
          width={totalWidth}
          height={totalHeight}
          className="overflow-visible"
          aria-label={label ? `Matrix ${label}` : 'Matrix'}
        >
          {/* Left bracket */}
          <path
            d={`M ${bracketWidth} 4 L 4 4 L 4 ${totalHeight - 4} L ${bracketWidth} ${totalHeight - 4}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-gray-700 dark:text-gray-300"
          />

          {/* Right bracket */}
          <path
            d={`M ${totalWidth - bracketWidth} 4 L ${totalWidth - 4} 4 L ${totalWidth - 4} ${totalHeight - 4} L ${totalWidth - bracketWidth} ${totalHeight - 4}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-gray-700 dark:text-gray-300"
          />

          {/* Cells */}
          {matrix.map((row, r) =>
            row.map((val, c) => {
              const isHighlighted = highlightSet.has(`${r},${c}`);
              const x = bracketWidth + 4 + c * cellWidth;
              const y = 4 + r * cellHeight;
              const displayVal =
                typeof val === 'number'
                  ? val % 1 === 0
                    ? val.toString()
                    : val.toFixed(precision)
                  : String(val);

              return (
                <g key={`${r}-${c}`}>
                  {isHighlighted && (
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={cellWidth - 2}
                      height={cellHeight - 2}
                      rx={4}
                      fill="rgba(99, 102, 241, 0.25)"
                      stroke="rgba(99, 102, 241, 0.6)"
                      strokeWidth="1.5"
                    />
                  )}
                  <text
                    x={x + cellWidth / 2}
                    y={y + cellHeight / 2 + 5}
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize={13}
                    className={
                      isHighlighted
                        ? 'fill-indigo-600 dark:fill-indigo-300 font-semibold'
                        : 'fill-gray-800 dark:fill-gray-200'
                    }
                  >
                    {displayVal}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}

export default MatrixDisplay;
