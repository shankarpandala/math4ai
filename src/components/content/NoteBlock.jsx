import React from 'react';

/**
 * Type-to-style mapping for different note variants.
 */
const NOTE_TYPES = {
  note: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Note',
    border: 'border-blue-400/50 dark:border-blue-500/40',
    bg: 'bg-blue-50/60 dark:bg-blue-950/20',
    headerBg: 'bg-blue-100/60 dark:bg-blue-900/30',
    headerBorder: 'border-blue-400/30 dark:border-blue-500/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
    labelColor: 'text-blue-600 dark:text-blue-400',
  },
  historical: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Historical Context',
    border: 'border-amber-400/50 dark:border-amber-500/40',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    headerBg: 'bg-amber-100/60 dark:bg-amber-900/30',
    headerBorder: 'border-amber-400/30 dark:border-amber-500/30',
    iconColor: 'text-amber-500 dark:text-amber-400',
    labelColor: 'text-amber-600 dark:text-amber-400',
  },
  intuition: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'Intuition',
    border: 'border-violet-400/50 dark:border-violet-500/40',
    bg: 'bg-violet-50/60 dark:bg-violet-950/20',
    headerBg: 'bg-violet-100/60 dark:bg-violet-900/30',
    headerBorder: 'border-violet-400/30 dark:border-violet-500/30',
    iconColor: 'text-violet-500 dark:text-violet-400',
    labelColor: 'text-violet-600 dark:text-violet-400',
  },
  tip: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    label: 'Tip',
    border: 'border-teal-400/50 dark:border-teal-500/40',
    bg: 'bg-teal-50/60 dark:bg-teal-950/20',
    headerBg: 'bg-teal-100/60 dark:bg-teal-900/30',
    headerBorder: 'border-teal-400/30 dark:border-teal-500/30',
    iconColor: 'text-teal-500 dark:text-teal-400',
    labelColor: 'text-teal-600 dark:text-teal-400',
  },
};

/**
 * Informational note callout block.
 *
 * Props:
 *   title    {string}  Optional override title
 *   children {node}    Note content
 *   type     {string}  'note' | 'historical' | 'intuition' | 'tip'
 */
function NoteBlock({ title, children, type = 'note' }) {
  const config = NOTE_TYPES[type] || NOTE_TYPES.note;
  const displayTitle = title || config.label;

  return (
    <div
      className={`my-5 overflow-hidden rounded-xl border-2 shadow-sm ${config.border} ${config.bg}`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 border-b px-4 py-2.5 ${config.headerBg} ${config.headerBorder}`}
      >
        <span className={config.iconColor}>{config.icon}</span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${config.labelColor}`}>
          {displayTitle}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

export default NoteBlock;
