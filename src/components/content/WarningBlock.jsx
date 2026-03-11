import React from 'react';

/**
 * Warning / common-mistake callout block.
 *
 * Props:
 *   title    {string}  Optional title (defaults to "Common Mistake")
 *   children {node}    Warning content
 */
function WarningBlock({ title = 'Common Mistake', children }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border-2 border-amber-400/60 bg-amber-50/60 shadow-sm dark:border-amber-500/40 dark:bg-amber-950/20">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-amber-400/30 bg-amber-100/70 px-4 py-2.5 dark:border-amber-500/30 dark:bg-amber-900/30">
        {/* Warning triangle icon */}
        <svg
          className="h-5 w-5 text-amber-500 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

export default WarningBlock;
