import React, { useState } from 'react';

/**
 * Reference type metadata.
 */
const TYPE_CONFIG = {
  foundational: {
    label: 'Foundational Papers',
    icon: '📄',
    color: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
  textbook: {
    label: 'Textbooks',
    icon: '📚',
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  survey: {
    label: 'Surveys & Reviews',
    icon: '🔍',
    color: 'text-purple-600 dark:text-purple-400',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  tutorial: {
    label: 'Tutorials & Guides',
    icon: '🎓',
    color: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
};

/**
 * Single reference item.
 */
function ReferenceItem({ ref: r, badgeClass }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="group flex flex-col gap-1 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/40">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Authors + year */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {r.authors}
            {r.year ? ` (${r.year})` : ''}
          </p>
          {/* Title */}
          {r.url ? (
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 line-clamp-2"
            >
              {r.title}
            </a>
          ) : (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
              {r.title}
            </p>
          )}
          {/* Venue */}
          {r.venue && (
            <p className="text-xs text-gray-500 italic dark:text-gray-400">{r.venue}</p>
          )}
        </div>

        {/* Why important toggle */}
        {r.whyImportant && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-expanded={expanded}
            title="Why is this important?"
          >
            {expanded ? 'Less' : 'Why?'}
          </button>
        )}
      </div>

      {/* Expanded "why important" */}
      {expanded && r.whyImportant && (
        <div className="mt-1 rounded-md border border-blue-200 bg-blue-50/60 px-3 py-2 text-xs text-blue-800 dark:border-blue-700/40 dark:bg-blue-900/20 dark:text-blue-300">
          {r.whyImportant}
        </div>
      )}
    </li>
  );
}

/**
 * Academic reference list grouped by type.
 *
 * Props:
 *   references  {Array}  Array of {authors, year, title, venue, url, type, whyImportant}
 */
function ReferenceList({ references = [] }) {
  if (references.length === 0) return null;

  // Group by type
  const grouped = {};
  const typeOrder = ['foundational', 'textbook', 'survey', 'tutorial'];

  for (const ref of references) {
    const t = ref.type || 'foundational';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(ref);
  }

  // Also handle unknown types
  for (const ref of references) {
    const t = ref.type;
    if (t && !typeOrder.includes(t)) {
      if (!grouped['foundational']) grouped['foundational'] = [];
      grouped['foundational'].push(ref);
    }
  }

  return (
    <div className="my-8">
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        References &amp; Further Reading
      </h3>

      <div className="space-y-6">
        {typeOrder.map((type) => {
          const items = grouped[type];
          if (!items || items.length === 0) return null;
          const config = TYPE_CONFIG[type] || TYPE_CONFIG.foundational;

          return (
            <div key={type}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-base">{config.icon}</span>
                <h4 className={`text-sm font-semibold ${config.color}`}>{config.label}</h4>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClass}`}>
                  {items.length}
                </span>
              </div>
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900/30">
                {items.map((ref, i) => (
                  <ReferenceItem key={i} ref={ref} badgeClass={config.badgeClass} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReferenceList;
