import React from 'react';

/**
 * Styled range slider component.
 *
 * Props:
 *   label         {string}    Label text
 *   value         {number}    Current value
 *   onChange      {function}  Callback with new numeric value
 *   min           {number}    Minimum value
 *   max           {number}    Maximum value
 *   step          {number}    Step size
 *   unit          {string}    Unit string appended to display value (optional)
 *   displayValue  {function}  Optional formatter: (value) => string
 */
function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  unit = '',
  displayValue,
}) {
  const formatted = displayValue
    ? displayValue(value)
    : typeof value === 'number'
    ? value % 1 === 0
      ? value.toString()
      : value.toFixed(2)
    : String(value);

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <span className="min-w-[3.5rem] rounded bg-indigo-100 px-2 py-0.5 text-center text-sm font-mono font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          {formatted}
          {unit && <span className="ml-0.5 text-xs opacity-75">{unit}</span>}
        </span>
      </div>

      <div className="relative flex items-center">
        {/* Track background */}
        <div className="relative w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {/* Filled portion */}
          <div
            className="absolute h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Native range input overlaid */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0 h-2"
          aria-label={label}
        />

        {/* Custom thumb */}
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-0 rounded-full border-2 border-indigo-500 bg-white shadow-md dark:border-indigo-400 dark:bg-gray-900 transition-all duration-75"
          style={{ left: `${percent}%`, top: '-4px' }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default Slider;
