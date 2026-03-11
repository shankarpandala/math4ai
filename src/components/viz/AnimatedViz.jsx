import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Step-through animated visualization controller.
 *
 * Props:
 *   steps       {Array}   Array of step objects: { title, description, content }
 *                         where content is a React node for that step
 *   autoPlay    {boolean} Auto-advance steps (default false)
 *   interval    {number}  Auto-play interval in ms (default 2000)
 *   title       {string}  Optional title above the viz
 */
function AnimatedViz({ steps = [], autoPlay = false, interval = 2000, title }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(autoPlay)

  const advance = useCallback(() => {
    setStep(s => (s + 1) % steps.length)
  }, [steps.length])

  useEffect(() => {
    if (!playing || steps.length <= 1) return
    const id = setInterval(advance, interval)
    return () => clearInterval(id)
  }, [playing, interval, advance, steps.length])

  if (!steps.length) return null

  const current = steps[step]

  return (
    <div className="my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      {title && (
        <h3 className="mb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </h3>
      )}

      {/* Step content */}
      <div className="relative min-h-[160px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step description */}
      {current.description && (
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          {current.description}
        </p>
      )}

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setStep(s => (s - 1 + steps.length) % steps.length)}
          className="rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Previous step"
        >
          ← Prev
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === step ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setStep(s => (s + 1) % steps.length)}
          className="rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Next step"
        >
          Next →
        </button>

        {steps.length > 1 && (
          <button
            onClick={() => setPlaying(p => !p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              playing
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
        )}
      </div>

      {/* Step counter */}
      <p className="mt-2 text-center text-xs text-gray-400">
        Step {step + 1} / {steps.length}
        {current.title ? ` — ${current.title}` : ''}
      </p>
    </div>
  )
}

export default AnimatedViz
