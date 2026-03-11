import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a KaTeX display-mode (block) formula.
 *
 * Props:
 *   formula  {string}  LaTeX string to render
 */
function BlockFormula({ formula }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state whenever formula changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(false);
  }, [formula]);

  if (!formula) return null;

  if (hasError) {
    return (
      <div className="my-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400 dark:border-red-400/30 dark:bg-red-900/20 dark:text-red-300">
        Formula rendering error
        <code className="ml-2 rounded bg-red-900/40 px-1.5 py-0.5 font-mono text-xs">
          {formula}
        </code>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-4 flex justify-center">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="my-4 overflow-x-auto rounded-lg bg-gray-50/50 px-4 py-3 dark:bg-gray-900/40">
      <BlockMath
        math={formula}
        renderError={(error) => {
          setHasError(true);
          return (
            <span className="text-sm text-red-400">
              Formula rendering error: {error.message}
            </span>
          );
        }}
      />
    </div>
  );
}

export default BlockFormula;
