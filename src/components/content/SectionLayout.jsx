import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProgress from '../../hooks/useProgress';
import { getNextSection, getPrevSection } from '../../utils/curriculum';

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700',
  research: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700',
};

/**
 * Layout wrapper for all section content pages.
 *
 * Props:
 *   title         {string}    Section title
 *   difficulty    {string}    'beginner' | 'intermediate' | 'advanced' | 'research'
 *   readingTime   {number}    Estimated reading time in minutes
 *   prerequisites {string[]}  Array of prerequisite topic names
 *   children      {node}      Section content
 *   subjectId     {string}    Override — if not provided, reads from URL params
 *   chapterId     {string}    Override — if not provided, reads from URL params
 *   sectionId     {string}    Override — if not provided, reads from URL params
 */
function SectionLayout({
  title,
  difficulty,
  readingTime,
  prerequisites = [],
  children,
  subjectId: subjectIdProp,
  chapterId: chapterIdProp,
  sectionId: sectionIdProp,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();

  const subjectId = subjectIdProp || params.subjectId;
  const chapterId = chapterIdProp || params.chapterId;
  const sectionId = sectionIdProp || params.sectionId;

  const completed = isComplete(subjectId, chapterId, sectionId);

  const nextSection = getNextSection(subjectId, chapterId, sectionId);
  const prevSection = getPrevSection(subjectId, chapterId, sectionId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [subjectId, chapterId, sectionId]);

  const handleMarkComplete = () => {
    markComplete(subjectId, chapterId, sectionId);
  };

  const buildSectionPath = (s) =>
    `/${s.subjectId}/${s.chapterId}/${s.sectionId}`;

  const diffStyle = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.intermediate;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Section header */}
      <header className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {difficulty && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${diffStyle}`}>
              {difficulty}
            </span>
          )}
          {readingTime && (
            <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100/60 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </span>
          )}
          {completed && (
            <span className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {title}
        </h1>

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Prerequisites:
            </span>
            {prerequisites.map((prereq, i) => (
              <span
                key={i}
                className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400"
              >
                {prereq}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="prose prose-gray max-w-none dark:prose-invert">
        {children}
      </main>

      {/* Footer: mark complete + navigation */}
      <footer className="mt-12 space-y-6 border-t border-gray-200 pt-8 dark:border-gray-700">
        {/* Mark complete button */}
        {!completed && (
          <div className="flex justify-center">
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-md active:scale-95 dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Section Complete
            </button>
          </div>
        )}

        {/* Prev / Next navigation */}
        <nav className="flex items-stretch justify-between gap-4">
          {prevSection ? (
            <button
              onClick={() => navigate(buildSectionPath(prevSection))}
              className="group flex max-w-xs flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/30 dark:hover:border-indigo-600"
            >
              <svg className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:-translate-x-1 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500">Previous</p>
                <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                  {prevSection.title || prevSection.sectionId}
                </p>
              </div>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {nextSection ? (
            <button
              onClick={() => navigate(buildSectionPath(nextSection))}
              className="group flex max-w-xs flex-1 items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-right shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/30 dark:hover:border-indigo-600"
            >
              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500">Next</p>
                <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                  {nextSection.title || nextSection.sectionId}
                </p>
              </div>
              <svg className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </footer>
    </div>
  );
}

export default SectionLayout;
