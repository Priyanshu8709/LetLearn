import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, ChevronLeft, Play, List, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import useCourseStore from '../store/courseStore'
import { cn } from '../lib/utils'
import Button from '../components/ui/Button'

export default function LearnPage() {
  const { id } = useParams()
  const {
    currentCourse, fetchCourseDetails,
    fetchCourseProgress, updateProgress, addRating,
  } = useCourseStore()

  const [activeSection,    setActiveSection]    = useState(0)
  const [activeSubSection, setActiveSubSection] = useState(0)
  const [completed,        setCompleted]        = useState(new Set())   // Set of sub._id strings
  const [sidebarOpen,      setSidebarOpen]      = useState(true)
  const [marking,          setMarking]          = useState(false)
  const [showReview,       setShowReview]       = useState(false)
  const [rating,           setRating]           = useState(5)
  const [review,           setReview]           = useState('')

  // ── Load course + existing progress on mount ─────────────────────────────
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      await fetchCourseDetails(id)

      // Load already-completed lessons from the DB
      try {
        const progress = await fetchCourseProgress(id)
        if (!cancelled && progress?.completedVideos?.length) {
          const doneIds = new Set(
            progress.completedVideos.map((v) =>
              typeof v === 'object' ? v._id?.toString() : v?.toString()
            )
          )
          setCompleted(doneIds)
        }
      } catch {
        // No progress yet — fine, start fresh
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  // ── Derived ───────────────────────────────────────────────────────────────
  const sections     = currentCourse?.sections ?? []
  const currentSec   = sections[activeSection]
  // Server field is `subSections` (Section model)
  const subSections  = currentSec?.subSections ?? []
  const currentSub   = subSections[activeSubSection]
  const totalLessons = sections.reduce((a, s) => a + (s.subSections?.length ?? 0), 0)

  // ── Mark complete ─────────────────────────────────────────────────────────
  const handleMarkComplete = useCallback(async () => {
    if (!currentSub || marking) return
    const subId = currentSub._id?.toString()
    if (completed.has(subId)) return

    try {
      setMarking(true)
      await updateProgress(id, subId)
      setCompleted((prev) => new Set([...prev, subId]))
      toast.success('Lesson marked complete!')

      // Auto-advance to next lesson
      if (activeSubSection < subSections.length - 1) {
        setActiveSubSection((i) => i + 1)
      } else if (activeSection < sections.length - 1) {
        setActiveSection((i) => i + 1)
        setActiveSubSection(0)
      }
    } catch (err) {
      toast.error(err?.message ?? 'Failed to save progress')
    } finally {
      setMarking(false)
    }
  }, [currentSub, marking, completed, id, activeSubSection, subSections, activeSection, sections, updateProgress])

  // ── Review submit ─────────────────────────────────────────────────────────
  const handleReviewSubmit = async () => {
    try {
      await addRating(id, rating, review)
      toast.success('Review submitted!')
      setShowReview(false)
    } catch (err) {
      toast.error(err?.message ?? 'Failed to submit review')
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  const isCurrentDone = completed.has(currentSub?._id?.toString())
  const progressPct   = totalLessons ? Math.round((completed.size / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="h-14 glass-strong border-b border-white/8 flex items-center px-4 gap-4 z-40 flex-shrink-0">
        <Link to={`/courses/${id}`} className="text-white/40 hover:text-white transition-colors flex-shrink-0">
          <ChevronLeft size={20} />
        </Link>

        <h1 className="text-sm font-semibold text-white truncate flex-1 min-w-0">
          {currentCourse.courseName}
        </h1>

        <div className="flex items-center gap-3 text-xs text-white/40 flex-shrink-0">
          <span className="hidden sm:inline">{completed.size}/{totalLessons} lessons</span>
          <div className="w-24 h-1.5 bg-surface-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-white/60 font-medium">{progressPct}%</span>
        </div>

        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg glass hover:bg-white/10 text-white/50 hover:text-white transition-all"
          title="Toggle sidebar"
        >
          <List size={15} />
        </button>
      </header>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Video + info ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-w-0">

          {/* Video */}
          <div className="bg-black w-full" style={{ maxHeight: '65vh', aspectRatio: '16/9' }}>
            {currentSub?.videoUrl ? (
              <video
                key={currentSub._id}
                src={currentSub.videoUrl}
                controls
                className="w-full h-full"
                style={{ maxHeight: '65vh' }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/20"
                style={{ minHeight: '300px' }}>
                <Play size={48} />
                <span className="text-sm">Select a lesson to start</span>
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white">
                  {currentSub?.title ?? 'Select a lesson from the sidebar'}
                </h2>
                {currentSec && (
                  <p className="text-sm text-white/40 mt-1">
                    {/* Model uses sectionTitle */}
                    {currentSec.sectionTitle || currentSec.sectionName}
                  </p>
                )}
              </div>

              {currentSub && (
                <Button
                  variant={isCurrentDone ? 'secondary' : 'gradient'}
                  size="sm"
                  onClick={handleMarkComplete}
                  loading={marking}
                  disabled={isCurrentDone}
                  icon={isCurrentDone ? <CheckCircle size={14} /> : null}
                  className="flex-shrink-0"
                >
                  {isCurrentDone ? 'Completed' : 'Mark Complete'}
                </Button>
              )}
            </div>

            {currentSub?.description && (
              <p className="text-white/50 text-sm leading-relaxed">{currentSub.description}</p>
            )}

            {/* Course complete — show review prompt */}
            {completed.size > 0 && completed.size === totalLessons && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6"
              >
                <h3 className="text-white font-semibold mb-1">🎉 Course Complete!</h3>
                <p className="text-white/40 text-sm mb-4">
                  How was your experience? Leave a review to help others.
                </p>
                {!showReview ? (
                  <Button
                    variant="gradient" size="sm"
                    onClick={() => setShowReview(true)}
                    icon={<Star size={14} />}
                  >
                    Leave a Review
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} onClick={() => setRating(s)} type="button">
                          <Star
                            size={24}
                            className={cn(
                              s <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={3}
                      placeholder="Share your thoughts…"
                      className="w-full rounded-xl bg-surface-3 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all resize-none"
                    />
                    <Button variant="gradient" size="sm" onClick={handleReviewSubmit}>
                      Submit Review
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <motion.aside
          animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="border-l border-white/6 bg-surface-1 overflow-y-auto flex-shrink-0 hide-scrollbar"
          style={{ minWidth: 0 }}
        >
          <div className="p-4 border-b border-white/6 sticky top-0 bg-surface-1 z-10">
            <p className="text-sm font-semibold text-white">Course Content</p>
            <p className="text-xs text-white/30 mt-0.5">{totalLessons} lessons</p>
          </div>

          <div className="p-2">
            {sections.map((section, si) => (
              <div key={section._id?.toString() ?? si}>
                {/* Section header */}
                <div className="px-3 pt-4 pb-1 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {section.sectionTitle || section.sectionName}
                </div>

                {/* Subsections */}
                {(section.subSections ?? []).map((sub, ssi) => {
                  const subIdStr = sub._id?.toString()
                  const isActive = si === activeSection && ssi === activeSubSection
                  const isDone   = completed.has(subIdStr)

                  return (
                    <button
                      key={subIdStr ?? ssi}
                      type="button"
                      onClick={() => {
                        setActiveSection(si)
                        setActiveSubSection(ssi)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all mb-0.5',
                        isActive
                          ? 'bg-brand-500/20 text-brand-300'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {isDone ? (
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle size={14} className="text-white/20 flex-shrink-0" />
                      )}
                      <span className="truncate flex-1">{sub.title}</span>
                      {sub.timeDuration && (
                        <span className="text-xs text-white/25 flex-shrink-0">{sub.timeDuration}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
