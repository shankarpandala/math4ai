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

const DIFFICULTY_CONFIG = {
  beginner: {
    label: 'Beginner',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    dotClass: 'bg-yellow-500',
  },
  advanced: {
    label: 'Advanced',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    dotClass: 'bg-orange-500',
  },
  research: {
    label: 'Research',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
};

/**
 * Single exercise item.
 */
function ExerciseItem({ exercise, index }) {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);

  const diffConfig = DIFFICULTY_CONFIG[exercise.difficulty] || DIFFICULTY_CONFIG.intermediate;

  return (
    <div className="border-b border-gray-200 last:border-0 dark:border-gray-700">
      {/* Exercise header */}
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-bold text-gray-600 dark:border-gray-600 dark:text-gray-400">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {renderMathText(exercise.question)}
            </p>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffConfig.badgeClass}`}>
              {diffConfig.label}
            </span>
          </div>

          {/* Hint section */}
          {exercise.hint && (
            <div>
              <button
                onClick={() => setHintOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-md border border-blue-300/50 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-600/30 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                aria-expanded={hintOpen}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {hintOpen ? 'Hide Hint' : 'Reveal Hint'}
              </button>
              {hintOpen && (
                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-800 dark:border-blue-700/40 dark:bg-blue-900/20 dark:text-blue-300">
                  {renderMathText(exercise.hint)}
                </div>
              )}
            </div>
          )}

          {/* Solution section */}
          {exercise.solution && (
            <div>
              <button
                onClick={() => setSolutionOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-md border border-emerald-300/50 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:border-emerald-600/30 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                aria-expanded={solutionOpen}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {solutionOpen ? 'Hide Solution' : 'Reveal Solution'}
              </button>
              {solutionOpen && (
                <div className="mt-2 overflow-x-auto rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                  {typeof exercise.solution === 'string' ? (
                    renderMathText(exercise.solution)
                  ) : Array.isArray(exercise.solution) ? (
                    exercise.solution.map((s, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        {s.formula ? (
                          <BlockMath math={s.formula} renderError={() => <code className="text-red-400">{s.formula}</code>} />
                        ) : (
                          renderMathText(s.text || s)
                        )}
                      </div>
                    ))
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Exercise set block.
 *
 * Props:
 *   exercises  {Array}   Array of { id, difficulty, question, hint, solution }
 *   title      {string}  Block title (optional)
 */
function ExerciseBlock({ exercises = [], title = 'Exercises' }) {
  if (exercises.length === 0) return null;

  return (
    <div className="my-8 overflow-hidden rounded-xl border-2 border-gray-300/60 bg-white shadow-sm dark:border-gray-600/40 dark:bg-gray-900/30">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-100/60 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/40">
        <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {exercises.length}
        </span>
      </div>

      {/* Exercise items */}
      <div>
        {exercises.map((exercise, i) => (
          <ExerciseItem key={exercise.id || i} exercise={exercise} index={i} />
        ))}
      </div>
    </div>
  );
}

export default ExerciseBlock;
