import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Play, List, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import useCourseStore from '../store/courseStore'
import useAuthStore from '../store/authStore'
import { cn } from '../lib/utils'
import Button from '../components/ui/Button'

export default function LearnPage() {
  const { id } = useParams()
  const { currentCourse, fetchCourseDetails, updateProgress } = useCourseStore()
  const { isAuthenticated } = useAuthStore()
  const [activeSection, setActiveSection] = useState(0)
  const [activeSubSection, setActiveSubSection] = useState(0)
  const [completed, setCompleted] = useState(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const { addRating } = useCourseStore()

  useEffect(() => {
    fetchCourseDetails(id)
  }, [id])

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  const sections = currentCourse.sections ?? []
  const currentSection = sections[activeSection]
  const subSections = currentSection?.subSection ?? []
  const currentSub = subSections[activeSubSection]

  const handleMarkComplete = async () => {
    if (!currentSub) return
    try {
      await updateProgress(id, currentSub._id)
      setCompleted((prev) => new Set([...prev, currentSub._id]))
      toast.success('Marked as complete!')
      // Auto-advance
      if (activeSubSection < subSections.length - 1) {
        setActiveSubSection((i) => i + 1)
      } else if (activeSection < sections.length - 1) {
        setActiveSection((i) => i + 1)
        setActiveSubSection(0)
      }
    } catch { toast.error('Failed to mark progress') }
  }

  const handleReviewSubmit = async () => {
    try {
      await addRating(id, rating, review)
      toast.success('Review submitted!')
      setShowReview(false)
    } catch { toast.error('Failed to submit review') }
  }

  const totalLessons = sections.reduce((a, s) => a + (s.subSection?.length ?? 0), 0)

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      {/* Top bar */}
      <header className="h-14 glass-strong border-b border-white/8 flex items-center px-4 gap-4 z-40">
        <Link to={`/courses/${id}`} className="text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-sm font-semibold text-white truncate flex-1">{currentCourse.courseName}</h1>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span>{completed.size}/{totalLessons} completed</span>
          <div className="w-24 h-1.5 bg-surface-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: totalLessons ? `${(completed.size / totalLessons) * 100}%` : '0%' }}
            />
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="h-8 w-8 flex items-center justify-center rounded-lg glass hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <List size={15} />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Video + content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video player area */}
          <div className="bg-black aspect-video max-h-[65vh] w-full flex items-center justify-center relative">
            {currentSub?.videoUrl ? (
              <video
                key={currentSub._id}
                src={currentSub.videoUrl}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/20">
                <Play size={48} />
                <span className="text-sm">Select a lesson to start</span>
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{currentSub?.title ?? 'Select a lesson'}</h2>
                {currentSection && (
                  <p className="text-sm text-white/40 mt-1">Section: {currentSection.sectionName}</p>
                )}
              </div>
              <Button
                variant={completed.has(currentSub?._id) ? 'secondary' : 'gradient'}
                size="sm"
                onClick={handleMarkComplete}
                disabled={!currentSub || completed.has(currentSub?._id)}
                icon={completed.has(currentSub?._id) ? <CheckCircle size={14} /> : null}
              >
                {completed.has(currentSub?._id) ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>

            {currentSub?.description && (
              <p className="text-white/50 text-sm leading-relaxed">{currentSub.description}</p>
            )}

            {/* Review prompt */}
            {completed.size === totalLessons && totalLessons > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6"
              >
                <h3 className="text-white font-semibold mb-2">🎉 Course Complete!</h3>
                <p className="text-white/40 text-sm mb-4">How was your experience? Leave a review to help others.</p>
                {!showReview ? (
                  <Button variant="gradient" size="sm" onClick={() => setShowReview(true)} icon={<Star size={14} />}>
                    Leave a Review
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => setRating(s)}>
                          <Star size={24} className={cn(s <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/20')} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={3}
                      placeholder="Share your thoughts..."
                      className="w-full rounded-xl bg-surface-3 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all resize-none"
                    />
                    <Button variant="gradient" size="sm" onClick={handleReviewSubmit}>Submit Review</Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="border-l border-white/6 bg-surface-1 overflow-y-auto flex-shrink-0 hide-scrollbar"
        >
          <div className="p-4 border-b border-white/6 sticky top-0 bg-surface-1 z-10">
            <h3 className="text-sm font-semibold text-white">Course Content</h3>
          </div>
          <div className="p-2">
            {sections.map((section, si) => (
              <div key={section._id ?? si}>
                <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {section.sectionName}
                </div>
                {(section.subSection ?? []).map((sub, ssi) => {
                  const isActive = si === activeSection && ssi === activeSubSection
                  const isDone = completed.has(sub._id)
                  return (
                    <button
                      key={sub._id ?? ssi}
                      onClick={() => { setActiveSection(si); setActiveSubSection(ssi) }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all mb-0.5',
                        isActive ? 'bg-brand-500/20 text-brand-300' : 'text-white/50 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {isDone ? (
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle size={14} className="text-white/20 flex-shrink-0" />
                      )}
                      <span className="truncate">{sub.title}</span>
                      {sub.timeDuration && (
                        <span className="ml-auto text-xs text-white/25 flex-shrink-0">{sub.timeDuration}</span>
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
