/**
 * Curriculum navigation utilities for Math4AI.
 * Provides helpers to look up subject/chapter/section metadata and navigate
 * between sections.
 *
 * The curriculum index JSON is expected at /curriculum/index.json relative to
 * the project root.  We use a dynamic import so Vite can bundle it.  If the
 * file is not present we fall back to an empty structure gracefully.
 */

// Vite static import – adjust the path if your curriculum JSON lives elsewhere
let curriculumData = { subjects: [] };

try {
  // This will be resolved at build-time by Vite
  const mod = await import('../../curriculum/index.json', {
    assert: { type: 'json' },
  }).catch(() => ({ default: { subjects: [] } }));
  curriculumData = mod.default || mod;
} catch {
  curriculumData = { subjects: [] };
}

/**
 * Get subject metadata by its ID string (e.g. '03-calculus').
 */
export function getSubject(id) {
  if (!curriculumData.subjects) return null;
  return (
    curriculumData.subjects.find(
      (s) => s.id === id || String(s.id) === String(id)
    ) || null
  );
}

/**
 * Get chapter metadata within a subject.
 */
export function getChapter(subjectId, chapterId) {
  const subject = getSubject(subjectId);
  if (!subject || !subject.chapters) return null;
  return (
    subject.chapters.find(
      (c) => c.id === chapterId || String(c.id) === String(chapterId)
    ) || null
  );
}

/**
 * Get section metadata within a chapter.
 */
export function getSection(subjectId, chapterId, sectionId) {
  const chapter = getChapter(subjectId, chapterId);
  if (!chapter || !chapter.sections) return null;
  return (
    chapter.sections.find(
      (s) => s.id === sectionId || String(s.id) === String(sectionId)
    ) || null
  );
}

/**
 * Build a flat ordered list of all sections across all chapters of a subject.
 */
function flatSections(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject || !subject.chapters) return [];
  const flat = [];
  for (const chapter of subject.chapters) {
    for (const section of chapter.sections || []) {
      flat.push({ subjectId, chapterId: chapter.id, sectionId: section.id, ...section });
    }
  }
  return flat;
}

/**
 * Get the next section after the given one, or null if at the end.
 */
export function getNextSection(subjectId, chapterId, sectionId) {
  const flat = flatSections(subjectId);
  const idx = flat.findIndex(
    (s) => s.chapterId === chapterId && s.sectionId === sectionId
  );
  if (idx === -1 || idx >= flat.length - 1) return null;
  return flat[idx + 1];
}

/**
 * Get the previous section before the given one, or null if at the start.
 */
export function getPrevSection(subjectId, chapterId, sectionId) {
  const flat = flatSections(subjectId);
  const idx = flat.findIndex(
    (s) => s.chapterId === chapterId && s.sectionId === sectionId
  );
  if (idx <= 0) return null;
  return flat[idx - 1];
}

export default curriculumData;
