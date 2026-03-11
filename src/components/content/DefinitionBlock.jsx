import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders inline math segments within a text string.
 */
function renderMathText(text) {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1);
      try {
        return <InlineMath key={i} math={formula} />;
      } catch {
        return <code key={i}>{formula}</code>;
      }
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Definition callout box.
 *
 * Props:
 *   title       {string}  Definition name
 *   definition  {string}  The definition text (may contain $...$ math)
 *   notation    {string}  Notation description (optional)
 *   label       {string}  e.g. "Definition 1.3"
 */
function DefinitionBlock({ title, definition, notation, label }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-purple-400/50 bg-purple-50/50 shadow-sm dark:border-purple-500/40 dark:bg-purple-950/20">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-purple-400/30 bg-purple-100/60 px-5 py-3 dark:border-purple-500/30 dark:bg-purple-900/30">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white dark:bg-purple-600">
          D
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          {label || 'Definition'}
        </span>
        {title && (
          <>
            <span className="text-purple-400 dark:text-purple-600">·</span>
            <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
              {title}
            </span>
          </>
        )}
      </div>

      {/* Definition body */}
      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {renderMathText(definition)}
        </p>
      </div>

      {/* Notation */}
      {notation && (
        <div className="border-t border-purple-400/20 bg-purple-100/30 px-5 py-3 dark:border-purple-500/20 dark:bg-purple-900/15">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Notation:
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {renderMathText(notation)}
          </span>
        </div>
      )}
    </div>
  );
}

export default DefinitionBlock;
