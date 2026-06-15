import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Users, BookOpen, Clock, Play, ChevronDown, ChevronUp,
  Heart, CheckCircle, ArrowLeft, Send, Trash2, MessageSquare,
  PenLine
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Stars from '../components/ui/Stars'
import Avatar from '../components/ui/Avatar'
import Skeleton from '../components/ui/Skeleton'
import useCourseStore from '../store/courseStore'
import useAuthStore from '../store/authStore'
import { formatPrice, formatDate, cn } from '../lib/utils'

// ── Interactive star picker ───────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={cn(
              'transition-colors',
              s <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-white/20'
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-white/50 min-w-[70px]">
        {labels[hovered || value] ?? ''}
      </span>
    </div>
  )
}

// ── Collapsible content block ─────────────────────────────────────────────────
function ContentSection({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-surface-2 border border-white/6 p-8"
    >
      <h2 className="text-xl font-bold text-white mb-5">{title}</h2>
      {children}
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    currentCourse, fetchCourseDetails, isLoading,
    capturePayment, verifyPayment,
    addToWishlist, wishlist,
    addRating, deleteRating, getCourseRatings,
  } = useCourseStore()
  const { isAuthenticated, user } = useAuthStore()

  const [expandedSection, setExpandedSection] = useState(null)
  const [paying,          setPaying]          = useState(false)

  // ── Reviews state ─────────────────────────────────────────────────────────
  const [reviews,        setReviews]        = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showForm,       setShowForm]       = useState(false)
  const [rating,         setRating]         = useState(5)
  const [reviewText,     setReviewText]     = useState('')
  const [submitting,     setSubmitting]     = useState(false)
  const [deleting,       setDeleting]       = useState(null)  // reviewId being deleted

  // ── Fetch course ──────────────────────────────────────────────────────────
  useEffect(() => { fetchCourseDetails(id) }, [id])

  // ── Fetch live reviews from server ────────────────────────────────────────
  const loadReviews = async () => {
    setReviewsLoading(true)
    try {
      const list = await getCourseRatings(id)
      setReviews(Array.isArray(list) ? list : [])
    } catch {
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }
  useEffect(() => { loadReviews() }, [id])

  // ── Handle Stripe redirect ────────────────────────────────────────────────
  useEffect(() => {
    const status    = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')
    if (status === 'success' && sessionId) {
      verifyPayment(sessionId)
        .then(() => { toast.success('Enrollment confirmed! 🎉'); fetchCourseDetails(id) })
        .catch(() => toast.error('Could not verify payment'))
    }
  }, [searchParams])

  // ── Enroll / pay ──────────────────────────────────────────────────────────
  const handleEnroll = async () => {
    if (!isAuthenticated()) { toast.error('Please login to enroll'); navigate('/login'); return }
    try {
      setPaying(true)
      const data = await capturePayment(id)
      if (data.url) window.location.href = data.url
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPaying(false)
    }
  }

  // ── Submit a new review ───────────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) { toast.error('Write something before submitting'); return }
    try {
      setSubmitting(true)
      await addRating(id, rating, reviewText.trim())
      toast.success('Review submitted!')
      setReviewText('')     // reset form — keep it open so user can add another
      setRating(5)
      await loadReviews()
      fetchCourseDetails(id)  // refresh average rating in hero
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete a specific review ──────────────────────────────────────────────
  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Delete this review?')) return
    try {
      setDeleting(reviewId)
      await deleteRating(reviewId)
      toast.success('Review deleted')
      await loadReviews()
      fetchCourseDetails(id)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const handleWishlist = async () => {
    if (!isAuthenticated()) { toast.error('Login first'); return }
    try {
      await addToWishlist(id)
      toast.success('Added to wishlist')
    } catch { toast.error('Already in wishlist') }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </PageLayout>
    )
  }
  if (!currentCourse) return null

  const course   = currentCourse
  const sections = course.sections ?? []

  const isEnrolled = course.StudentsEnrolled?.some(
    (s) => (s._id ?? s)?.toString() === user?._id?.toString()
  )
  const isWishlisted = wishlist.some((c) => c._id === id)

  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : (course.averageRating ?? 0)

  // Split reviews: mine vs others (user may have multiple)
  const myReviews    = reviews.filter((r) => r.user?._id?.toString() === user?._id?.toString())
  const otherReviews = reviews.filter((r) => r.user?._id?.toString() !== user?._id?.toString())

  const canReview = isAuthenticated()   // any logged-in user can review

  return (
    <PageLayout>

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-surface-3 to-surface-0 border-b border-white/6 pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 pb-10">
              {course.tag && (
                <Badge variant="brand" className="mb-4">{course.tag?.name ?? course.tag}</Badge>
              )}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                {course.courseName}
              </h1>

              <p className="text-white/50 text-base mb-6 leading-relaxed">
                {course.courseDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-6">
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 font-semibold">{avgRating.toFixed(1)}</span>
                  <span>({reviews.length} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />{course.StudentsEnrolled?.length ?? 0} students
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />{sections.length} sections
                </span>
                {course.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />Updated {formatDate(course.updatedAt)}
                  </span>
                )}
              </div>

              {course.instructor && (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={course.instructor.images}
                    firstname={course.instructor.firstname}
                    lastname={course.instructor.lastname}
                    size="md"
                  />
                  <div>
                    <p className="text-sm text-white/80 font-medium">
                      {course.instructor.firstname} {course.instructor.lastname}
                    </p>
                    <p className="text-xs text-white/40">Instructor</p>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Left column ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* What you'll learn */}
            <ContentSection title="What You'll Learn">
              <div className="grid sm:grid-cols-2 gap-3">
                {(course.whatYouWillLearn ?? '').split('\n').filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                    <CheckCircle size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </ContentSection>

            {/* Course content accordion */}
            <ContentSection title={`Course Content (${sections.length} sections)`}>
              <div className="space-y-2">
                {sections.map((section, i) => (
                  <div key={section._id ?? i} className="rounded-xl border border-white/8 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/4 transition-colors"
                    >
                      <span className="text-sm font-medium text-white">
                        {section.sectionTitle || section.sectionName}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>{section.subSections?.length ?? 0} lessons</span>
                        {expandedSection === i
                          ? <ChevronUp size={16} className="text-white/40" />
                          : <ChevronDown size={16} className="text-white/40" />
                        }
                      </div>
                    </button>
                    {expandedSection === i && section.subSections && (
                      <div className="border-t border-white/6">
                        {section.subSections.map((sub) => (
                          <div key={sub._id}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-white/50 hover:bg-white/3 transition-colors">
                            <Play size={13} className="text-brand-400 flex-shrink-0" />
                            <span>{sub.title}</span>
                            {sub.timeDuration && (
                              <span className="ml-auto text-xs text-white/25">{sub.timeDuration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ContentSection>

            {/* ── Reviews ────────────────────────────────────────────────── */}
            <ContentSection title={`Student Reviews (${reviews.length})`}>

              {/* Rating summary bar */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-6 mb-8 p-5 rounded-xl bg-surface-3 border border-white/6">
                  <div className="text-center flex-shrink-0">
                    <div className="text-5xl font-extrabold text-amber-400">{avgRating.toFixed(1)}</div>
                    <Stars rating={avgRating} size={16} className="justify-center mt-1" />
                    <p className="text-xs text-white/30 mt-1">Course Rating</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length
                      const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs text-white/40">
                          <span className="w-3 text-right">{star}</span>
                          <Star size={10} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                          <div className="flex-1 h-1.5 bg-surface-4 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400/70 rounded-full transition-all"
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Write a review (always visible if logged in) ─────────── */}
              {canReview ? (
                <div className="mb-8">
                  {!showForm ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-500/30 bg-brand-500/8 text-brand-300 text-sm font-medium hover:bg-brand-500/15 transition-all"
                    >
                      <PenLine size={15} /> Write a Review
                    </button>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        key="review-form"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-2xl border border-brand-500/25 bg-brand-500/5 p-6"
                      >
                        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                          <MessageSquare size={16} className="text-brand-400" />
                          Leave a Review
                        </h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-white/70 block mb-2">Rating</label>
                            <StarPicker value={rating} onChange={setRating} />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-white/70 block mb-2">Your thoughts</label>
                            <textarea
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              rows={4}
                              maxLength={1000}
                              placeholder="What did you like or dislike? Would you recommend this course?"
                              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all resize-none"
                            />
                            <p className="text-xs text-white/20 text-right mt-1">{reviewText.length}/1000</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              type="submit"
                              variant="gradient"
                              size="md"
                              loading={submitting}
                              icon={<Send size={14} />}
                            >
                              Submit Review
                            </Button>
                            <button
                              type="button"
                              onClick={() => { setShowForm(false); setReviewText(''); setRating(5) }}
                              className="text-sm text-white/40 hover:text-white/70 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              ) : (
                <div className="mb-6 px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-sm text-white/40">
                  <button onClick={() => navigate('/login')} className="text-brand-400 hover:text-brand-300 underline">
                    Sign in
                  </button>{' '}to leave a review.
                </div>
              )}

              {/* ── My own reviews (with delete) ──────────────────────────── */}
              {myReviews.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Your Reviews</p>
                  {myReviews.map((r) => (
                    <div key={r._id} className="rounded-xl border border-brand-500/25 bg-brand-500/5 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={user?.images} firstname={user?.firstname} lastname={user?.lastname} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-white">
                              {user?.firstname} {user?.lastname}
                              <Badge variant="brand" className="ml-2 text-[10px]">You</Badge>
                            </p>
                            <Stars rating={r.rating} size={12} />
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          disabled={deleting === r._id}
                          className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg glass hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-all"
                          title="Delete this review"
                        >
                          {deleting === r._id
                            ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            : <Trash2 size={14} />
                          }
                        </button>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{r.review}</p>
                      {r.createdAt && (
                        <p className="text-xs text-white/25 mt-2">{formatDate(r.createdAt)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── All other reviews ─────────────────────────────────────── */}
              {reviewsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
                </div>
              ) : otherReviews.length === 0 && myReviews.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare size={36} className="mx-auto text-white/10 mb-3" />
                  <p className="text-sm text-white/30">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {otherReviews.map((r) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl p-5"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar
                          src={r.user?.images}
                          firstname={r.user?.firstname}
                          lastname={r.user?.lastname}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm font-medium text-white">
                              {r.user?.firstname} {r.user?.lastname}
                            </p>
                            <Stars rating={r.rating} size={12} />
                          </div>
                          {r.createdAt && (
                            <p className="text-xs text-white/25 mt-0.5">{formatDate(r.createdAt)}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed">{r.review}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </ContentSection>
          </div>

          {/* ── Purchase card ──────────────────────────────────────────────── */}
          <div>
            <div className="sticky top-24">
              <div className="rounded-2xl bg-surface-2 border border-white/8 overflow-hidden shadow-2xl">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.courseName}
                    className="w-full aspect-video object-cover" />
                )}
                <div className="p-6 space-y-4">
                  <div className="text-3xl font-extrabold text-white">{formatPrice(course.price)}</div>

                  {isEnrolled ? (
                    <Button variant="gradient" size="lg" className="w-full"
                      onClick={() => navigate(`/learn/${id}`)} icon={<Play size={16} />}>
                      Continue Learning
                    </Button>
                  ) : (
                    <>
                      <Button variant="gradient" size="lg" className="w-full"
                        onClick={handleEnroll} loading={paying}>
                        Enroll Now
                      </Button>
                      {/* Only show wishlist when NOT enrolled */}
                      <button
                        onClick={handleWishlist}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-white/8 text-sm text-white/60 hover:text-white transition-all"
                      >
                        <Heart size={15} className={isWishlisted ? 'fill-red-400 text-red-400' : ''} />
                        {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                      </button>
                    </>
                  )}

                  <div className="space-y-2 pt-2 border-t border-white/6">
                    {[
                      ['Sections',  sections.length],
                      ['Students',  course.StudentsEnrolled?.length ?? 0],
                      ['Rating',    `${avgRating.toFixed(1)} / 5`],
                      ['Reviews',   reviews.length],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-white/40">{label}</span>
                        <span className="text-white font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}
