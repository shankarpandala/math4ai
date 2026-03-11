import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders inline math segments within a text string.
 * Splits on $...$ delimiters.
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
 * Expandable theorem block with collapsible proof.
 *
 * Props:
 *   title        {string}    Theorem name
 *   statement    {string}    The theorem statement (may contain $...$ math)
 *   proof        {string}    Proof text (may contain $...$ math)
 *   corollaries  {string[]}  Array of corollary strings
 *   label        {string}    e.g. "Theorem 2.1"
 */
function TheoremBlock({ title, statement, proof, corollaries = [], label }) {
  const [proofOpen, setProofOpen] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-indigo-400/50 bg-indigo-50/50 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/20">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-indigo-400/30 bg-indigo-100/60 px-5 py-3 dark:border-indigo-500/30 dark:bg-indigo-900/30">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white dark:bg-indigo-600">
          T
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {label || 'Theorem'}
        </span>
        {title && (
          <>
            <span className="text-indigo-400 dark:text-indigo-600">·</span>
            <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
              {title}
            </span>
          </>
        )}
      </div>

      {/* Statement */}
      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed text-gray-700 italic dark:text-gray-300">
          {renderMathText(statement)}
        </p>
      </div>

      {/* Corollaries */}
      {corollaries.length > 0 && (
        <div className="border-t border-indigo-400/20 px-5 py-3 dark:border-indigo-500/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Corollaries
          </p>
          <ul className="space-y-1.5">
            {corollaries.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-700 dark:bg-indigo-800/50 dark:text-indigo-300">
                  {i + 1}
                </span>
                {renderMathText(c)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Proof toggle */}
      {proof && (
        <div className="border-t border-indigo-400/20 dark:border-indigo-500/20">
          <button
            onClick={() => setProofOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium text-indigo-700 hover:bg-indigo-100/50 dark:text-indigo-300 dark:hover:bg-indigo-900/20 transition-colors"
            aria-expanded={proofOpen}
          >
            <span className="flex items-center gap-2">
              <span>Proof</span>
            </span>
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${proofOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {proofOpen && (
            <div className="border-t border-indigo-400/20 bg-white/40 px-5 pb-5 pt-4 dark:border-indigo-500/20 dark:bg-gray-900/20">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {renderMathText(proof)}
              </p>
              {/* QED symbol */}
              <div className="mt-4 flex justify-end">
                <span
                  className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                  title="QED — quod erat demonstrandum"
                >
                  □
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TheoremBlock;
