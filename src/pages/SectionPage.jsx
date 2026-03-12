import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { getCurriculumById, getChapterById, getSectionById, getAdjacentSections } from '../subjects/index.js'
import DifficultyBadge from '../components/navigation/DifficultyBadge.jsx'
import PrevNextNav from '../components/navigation/PrevNextNav.jsx'
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx'
import useProgress from '../hooks/useProgress.js'

// Registry of sections that have full content pages written.
// Add entries here as new section files are created.
const CONTENT_REGISTRY = {
  // Linear Algebra
  '02-linear-algebra/c3-inner-products/s3-gram-schmidt': lazy(() => import('../subjects/02-linear-algebra/c3-inner-products/s3-gram-schmidt.jsx')),
  '02-linear-algebra/c5-eigentheory/s1-eigenvalues': lazy(() => import('../subjects/02-linear-algebra/c5-eigentheory/s1-eigenvalues.jsx')),
  '02-linear-algebra/c6-decompositions/s3-svd': lazy(() => import('../subjects/02-linear-algebra/c6-decompositions/s3-svd.jsx')),
  // Probability
  '04-probability/c3-continuous-distributions/s1-gaussian': lazy(() => import('../subjects/04-probability/c3-continuous-distributions/s1-gaussian.jsx')),
  '04-probability/c5-limit-theorems/s2-clt': lazy(() => import('../subjects/04-probability/c5-limit-theorems/s2-clt.jsx')),
  // Information Theory
  '06-information-theory/c1-entropy/s1-shannon-entropy': lazy(() => import('../subjects/06-information-theory/c1-entropy/s1-shannon-entropy.jsx')),
  '06-information-theory/c3-divergences/s1-kl-divergence': lazy(() => import('../subjects/06-information-theory/c3-divergences/s1-kl-divergence.jsx')),
  // Optimization
  '07-optimization/c4-first-order/s1-gradient-descent': lazy(() => import('../subjects/07-optimization/c4-first-order/s1-gradient-descent.jsx')),
  '07-optimization/c4-first-order/s2-adam': lazy(() => import('../subjects/07-optimization/c4-first-order/s2-adam.jsx')),
  // Neural Networks
  '10-neural-networks/c2-backprop/s1-chain-rule': lazy(() => import('../subjects/10-neural-networks/c2-backprop/s1-chain-rule.jsx')),
  // Transformers
  '11-transformers/c1-attention/s1-scaled-dot-product': lazy(() => import('../subjects/11-transformers/c1-attention/s1-scaled-dot-product.jsx')),
  '11-transformers/c1-attention/s2-multihead': lazy(() => import('../subjects/11-transformers/c1-attention/s2-multihead.jsx')),
  // Mathematical Foundations (new)
  '01-foundations/c1-logic-proofs/s1-propositions': lazy(() => import('../subjects/01-foundations/c1-logic-proofs/s1-propositions.jsx')),
  // Calculus (new)
  '03-calculus/c2-differentiation/s1-derivatives': lazy(() => import('../subjects/03-calculus/c2-differentiation/s1-derivatives.jsx')),
  // Statistics (new)
  '05-statistics/c1-estimation/s1-mle': lazy(() => import('../subjects/05-statistics/c1-estimation/s1-mle.jsx')),
  // Numerical Methods (new)
  '08-numerical-methods/c1-numerical-linalg/s1-direct-solvers': lazy(() => import('../subjects/08-numerical-methods/c1-numerical-linalg/s1-direct-solvers.jsx')),
  // Graph Theory (new)
  '09-graph-theory/c1-graph-basics/s1-definitions': lazy(() => import('../subjects/09-graph-theory/c1-graph-basics/s1-definitions.jsx')),
  // Vector Search (new)
  '12-vector-search/c1-embedding-spaces/s1-word2vec': lazy(() => import('../subjects/12-vector-search/c1-embedding-spaces/s1-word2vec.jsx')),
  // Reinforcement Learning (new)
  '13-reinforcement-learning/c1-mdp/s1-mdp-framework': lazy(() => import('../subjects/13-reinforcement-learning/c1-mdp/s1-mdp-framework.jsx')),
  // Generative Models (new)
  '14-generative-models/c1-vae/s1-elbo': lazy(() => import('../subjects/14-generative-models/c1-vae/s1-elbo.jsx')),
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300 dark:text-indigo-700" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function ComingSoonPlaceholder({ section }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 px-8 py-16 text-center dark:border-indigo-800/40 dark:bg-indigo-950/10"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <BookIcon />
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Content Coming Soon
        </h2>
        <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          The interactive content for{' '}
          <strong className="font-semibold text-gray-700 dark:text-gray-300">
            {section.title}
          </strong>{' '}
          is being prepared. It will include formal definitions, theorems with proofs,
          interactive visualizations, and Python examples.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {['Theory', 'Proofs', 'Visualizations', 'Exercises'].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function SectionContent({ subjectId, chapterId, sectionId, section }) {
  const key = `${subjectId}/${chapterId}/${sectionId}`
  const ContentComponent = CONTENT_REGISTRY[key]
  if (ContentComponent) {
    return (
      <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading content…</div>}>
        <ContentComponent />
      </Suspense>
    )
  }
  return <ComingSoonPlaceholder section={section} />
}

export default function SectionPage() {
  const { subjectId, chapterId, sectionId } = useParams()
  const { isComplete, markComplete } = useProgress()

  const subject = getCurriculumById(subjectId)
  const chapter = getChapterById(subjectId, chapterId)
  const section = getSectionById(subjectId, chapterId, sectionId)
  const done = isComplete(subjectId, chapterId, sectionId)

  if (!subject || !chapter || !section) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl" aria-hidden="true">∅</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Section Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Could not find section "{sectionId}".
        </p>
        <Link
          to="/"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentSections(subjectId, chapterId, sectionId)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: subject.title, href: `/subjects/${subjectId}` },
    { label: chapter.title, href: `/subjects/${subjectId}/${chapterId}` },
    { label: section.title },
  ]

  function handleMarkComplete() {
    if (!done) {
      markComplete(subjectId, chapterId, sectionId)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Section Header */}
      <div
        className="relative border-b border-gray-200 dark:border-gray-800"
        style={{ background: `linear-gradient(135deg, ${subject.colorHex}10 0%, transparent 50%)` }}
      >
        <div
          className="absolute left-0 top-0 h-full w-1.5"
          style={{ backgroundColor: subject.colorHex }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl px-6 py-8 pl-10">
          <Breadcrumbs items={breadcrumbs} />

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl leading-snug">
              {section.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <DifficultyBadge level={section.difficulty} />
              {section.readingMinutes && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon />
                  {section.readingMinutes} min read
                </span>
              )}
              {done && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckIcon />
                  Completed
                </span>
              )}
            </div>

            {section.description && (
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content area */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Dynamically loaded content or "Coming Soon" */}
        <SectionContent
          subjectId={subjectId}
          chapterId={chapterId}
          sectionId={sectionId}
          section={section}
        />

        {/* Mark as complete */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={done}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
              done
                ? 'cursor-default bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
            aria-label={done ? 'Section already marked complete' : 'Mark this section as complete'}
          >
            {done ? (
              <>
                <CheckIcon />
                Marked as Complete
              </>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>

        {/* Prev / Next navigation */}
        <PrevNextNav prev={prev} next={next} />
      </div>
    </div>
  )
}
