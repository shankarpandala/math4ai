import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
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
 * Stand-alone proof block with numbered steps.
 *
 * Props:
 *   title  {string}   Proof title (optional)
 *   steps  {Array}    Array of { description, formula, explanation }
 *     description  {string}  Short step label
 *     formula      {string}  LaTeX formula for this step (optional)
 *     explanation  {string}  Explanation text (optional, may contain $math$)
 */
function ProofBlock({ title = 'Proof', steps = [] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-300/60 bg-slate-50/50 shadow-sm dark:border-slate-600/40 dark:bg-slate-900/30">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-500 text-xs font-bold text-white dark:bg-slate-600">
            ∎
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {title}
          </span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Steps */}
      {open && (
        <div className="divide-y divide-slate-200/60 border-t border-slate-300/40 dark:divide-slate-700/40 dark:border-slate-600/30">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 px-5 py-4">
              {/* Step number */}
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-400 text-xs font-bold text-slate-600 dark:border-slate-500 dark:text-slate-400">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-slate-300 dark:bg-slate-600" />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 space-y-2 pb-1">
                {step.description && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {renderMathText(step.description)}
                  </p>
                )}
                {step.formula && (
                  <div className="overflow-x-auto rounded-lg bg-white/60 px-3 py-2 dark:bg-gray-900/40">
                    <BlockMath
                      math={step.formula}
                      renderError={() => (
                        <code className="text-red-400 text-xs">{step.formula}</code>
                      )}
                    />
                  </div>
                )}
                {step.explanation && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {renderMathText(step.explanation)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* QED */}
          <div className="flex justify-end px-5 py-3">
            <span
              className="text-lg font-bold text-slate-600 dark:text-slate-400"
              title="QED"
            >
              □
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProofBlock;
