import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a multi-line aligned LaTeX formula.
 * Automatically wraps content in \begin{aligned}...\end{aligned} if not
 * already present.
 *
 * Props:
 *   formula   {string}  LaTeX string (individual lines joined by \\)
 *   numbered  {bool}    If true uses align environment (numbered), otherwise aligned
 */
function AlignedFormula({ formula, numbered = false }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [formula, numbered]);

  if (!formula) return null;

  // Build the wrapped formula
  let wrapped = formula.trim();
  const hasAlignEnv = /\\begin\{align/.test(wrapped);

  if (!hasAlignEnv) {
    const env = numbered ? 'align' : 'aligned';
    wrapped = `\\begin{${env}}\n${wrapped}\n\\end{${env}}`;
  }

  if (hasError) {
    return (
      <div className="my-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400 dark:bg-red-900/20 dark:text-red-300">
        Formula rendering error
      </div>
    );
  }

  return (
    <div className="my-4 overflow-x-auto rounded-lg bg-gray-50/50 px-4 py-3 dark:bg-gray-900/40">
      <BlockMath
        math={wrapped}
        renderError={(error) => {
          setHasError(true);
          return (
            <span className="text-sm text-red-400">
              Aligned formula error: {error.message}
            </span>
          );
        }}
      />
    </div>
  );
}

export default AlignedFormula;
