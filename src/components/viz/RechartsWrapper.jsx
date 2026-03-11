import { ResponsiveContainer } from 'recharts'

/**
 * Dark-mode aware responsive wrapper for Recharts.
 *
 * Props:
 *   height      {number}   Chart height in px (default 280)
 *   title       {string}   Optional chart title
 *   description {string}   Optional subtitle/description
 *   children    {node}     A Recharts chart component
 */
function RechartsWrapper({ height = 280, title, description, children }) {
  return (
    <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      {title && (
        <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      )}
      {description && (
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export default RechartsWrapper

// Re-export common Recharts chart colors for consistent dark/light theming
export const CHART_COLORS = {
  primary:   '#818cf8',   // indigo-400
  secondary: '#34d399',   // emerald-400
  accent:    '#fbbf24',   // amber-400
  danger:    '#f87171',   // red-400
  muted:     '#94a3b8',   // slate-400
  grid:      '#1e293b',   // slate-800 (dark) / use #e2e8f0 for light
  axis:      '#475569',   // slate-600
}
