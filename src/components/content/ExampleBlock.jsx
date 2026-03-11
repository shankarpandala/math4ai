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

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  research: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

/**
 * Worked example block with collapsible solution steps.
 *
 * Props:
 *   title       {string}   Example title
 *   problem     {string}   Problem statement (may contain $...$ math)
 *   solution    {Array}    Array of { step, formula, explanation }
 *   difficulty  {string}   'beginner' | 'intermediate' | 'advanced' | 'research'
 */
function ExampleBlock({ title, problem, solution = [], difficulty = 'intermediate' }) {
  const [solutionOpen, setSolutionOpen] = useState(false);

  const difficultyStyle = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.intermediate;

  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-emerald-400/50 bg-emerald-50/50 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/20">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-emerald-400/30 bg-emerald-100/60 px-5 py-3 dark:border-emerald-500/30 dark:bg-emerald-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white dark:bg-emerald-600">
            E
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Example
          </span>
          {title && (
            <>
              <span className="text-emerald-400 dark:text-emerald-600">·</span>
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                {title}
              </span>
            </>
          )}
        </div>
        {difficulty && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${difficultyStyle}`}>
            {difficulty}
          </span>
        )}
      </div>

      {/* Problem */}
      <div className="px-5 py-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Problem
        </p>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {renderMathText(problem)}
        </p>
      </div>

      {/* Solution toggle */}
      {solution.length > 0 && (
        <div className="border-t border-emerald-400/20 dark:border-emerald-500/20">
          <button
            onClick={() => setSolutionOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100/40 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            aria-expanded={solutionOpen}
          >
            <span>Solution ({solution.length} step{solution.length !== 1 ? 's' : ''})</span>
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${solutionOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {solutionOpen && (
            <div className="divide-y divide-emerald-200/40 border-t border-emerald-400/20 dark:divide-emerald-700/30 dark:border-emerald-500/20">
              {solution.map((s, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300">
                      {i + 1}
                    </div>
                    {i < solution.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-emerald-300/50 dark:bg-emerald-700/40" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 pb-1">
                    {s.step && (
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        {renderMathText(s.step)}
                      </p>
                    )}
                    {s.formula && (
                      <div className="overflow-x-auto rounded-lg bg-white/60 px-3 py-2 dark:bg-gray-900/40">
                        <BlockMath
                          math={s.formula}
                          renderError={() => (
                            <code className="text-red-400 text-xs">{s.formula}</code>
                          )}
                        />
                      </div>
                    )}
                    {s.explanation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {renderMathText(s.explanation)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExampleBlock;
