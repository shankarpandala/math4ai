import React, { useState, useEffect, useMemo } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a KaTeX formula that updates live based on parameter values.
 * Replaces {KEY} placeholders in the template with corresponding values.
 *
 * Props:
 *   template  {string}  LaTeX template with {PARAM} placeholders
 *   values    {object}  Map of { PARAM: value } to substitute
 */
function LiveFormula({ template, values = {} }) {
  const [hasError, setHasError] = useState(false);

  // Rebuild formula whenever template or values change
  const formula = useMemo(() => {
    if (!template) return '';
    let result = template;
    for (const [key, val] of Object.entries(values)) {
      // Replace all occurrences of {KEY}
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(`\\{${escaped}\\}`, 'g'), String(val));
    }
    return result;
  }, [template, values]);

  useEffect(() => {
    setHasError(false);
  }, [formula]);

  if (!formula) return null;

  if (hasError) {
    return (
      <div className="my-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400 dark:bg-red-900/20 dark:text-red-300">
        Formula rendering error
      </div>
    );
  }

  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-indigo-500/20 bg-gray-50/50 px-4 py-3 transition-all duration-200 dark:bg-gray-900/40">
      <BlockMath
        math={formula}
        renderError={(error) => {
          setHasError(true);
          return (
            <span className="text-sm text-red-400">
              Live formula error: {error.message}
            </span>
          );
        }}
      />
    </div>
  );
}

export default LiveFormula;
