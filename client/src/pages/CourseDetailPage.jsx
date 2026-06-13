import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star, Users, BookOpen, Clock, Play, ChevronDown, ChevronUp,
  Heart, Share2, Award, CheckCircle, ArrowLeft
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Stars from '../components/ui/Stars'
import Avatar from '../components/ui/Avatar'
import Skeleton from '../components/ui/Skeleton'
import useCourseStore from '../store/courseStore'
import useAuthStore from '../store/authStore'
import { formatPrice, formatDate } from '../lib/utils'

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentCourse, fetchCourseDetails, isLoading, capturePayment, verifyPayment, addToWishlist, wishlist } = useCourseStore()
  const { isAuthenticated, user } = useAuthStore()
  const [expandedSection, setExpandedSection] = useState(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetchCourseDetails(id)
  }, [id])

  // Handle payment redirect back
  useEffect(() => {
    const status = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')
    if (status === 'success' && sessionId) {
      verifyPayment(sessionId)
        .then(() => toast.success('Enrollment successful! 🎉'))
        .catch(() => toast.error('Could not verify payment'))
    }
  }, [searchParams])

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to enroll')
      navigate('/login')
      return
    }
    try {
      setPaying(true)
      const data = await capturePayment(id)
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPaying(false)
    }
  }

  const isEnrolled = currentCourse?.StudentsEnrolled?.some(
    (s) => s._id === user?._id || s === user?._id
  )
  const isWishlisted = wishlist.some((c) => c._id === id)

  const handleWishlist = async () => {
    if (!isAuthenticated()) { toast.error('Login first'); return }
    try {
      await addToWishlist(id)
      toast.success('Added to wishlist')
    } catch { toast.error('Already in wishlist') }
  }

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

  const course = currentCourse
  const sections = course.sections ?? []
  const reviews = course.RatingAndReview ?? []

  return (
    <PageLayout>
      {/* Hero banner */}
      <div className="bg-gradient-to-b from-surface-3 to-surface-0 border-b border-white/6 pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Course info */}
            <div className="lg:col-span-2 pb-10">
              {course.tag && <Badge variant="brand" className="mb-4">{course.tag?.name ?? course.tag}</Badge>}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                {course.courseName}
              </h1>

              <p className="text-white/50 text-base mb-6 leading-relaxed">
                {course.courseDescription}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-6">
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 font-semibold">{(course.averageRating ?? 0).toFixed(1)}</span>
                  <span>({reviews.length} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {course.StudentsEnrolled?.length ?? 0} students
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  {sections.length} sections
                </span>
                {course.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    Updated {formatDate(course.updatedAt)}
                  </span>
                )}
              </div>

              {/* Instructor */}
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

            {/* Right: Purchase card (sticky on desktop) */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            <Section title="What You'll Learn">
              <div className="grid sm:grid-cols-2 gap-3">
                {(course.whatYouWillLearn ?? '').split('\n').filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                    <CheckCircle size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </Section>

            {/* Course content */}
            <Section title={`Course Content (${sections.length} sections)`}>
              <div className="space-y-2">
                {sections.map((section, i) => (
                  <div key={section._id ?? i} className="rounded-xl border border-white/8 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/4 transition-colors"
                    >
                      <span className="text-sm font-medium text-white">{section.sectionName}</span>
                      {expandedSection === i
                        ? <ChevronUp size={16} className="text-white/40" />
                        : <ChevronDown size={16} className="text-white/40" />
                      }
                    </button>
                    {expandedSection === i && section.subSection && (
                      <div className="border-t border-white/6">
                        {section.subSection.map((sub) => (
                          <div key={sub._id} className="flex items-center gap-3 px-5 py-3 text-sm text-white/50 hover:bg-white/3 transition-colors">
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
            </Section>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Section title={`Student Reviews (${reviews.length})`}>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r._id} className="glass rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar
                          src={r.user?.images}
                          firstname={r.user?.firstname}
                          lastname={r.user?.lastname}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {r.user?.firstname} {r.user?.lastname}
                          </p>
                          <Stars rating={r.rating} size={12} />
                        </div>
                      </div>
                      <p className="text-sm text-white/50">{r.review}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Purchase card */}
          <div>
            <div className="sticky top-24">
              <div className="rounded-2xl bg-surface-2 border border-white/8 overflow-hidden shadow-2xl">
                {/* Thumbnail */}
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.courseName} className="w-full aspect-video object-cover" />
                )}
                <div className="p-6 space-y-5">
                  <div className="text-3xl font-extrabold text-white">{formatPrice(course.price)}</div>

                  {isEnrolled ? (
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      onClick={() => navigate(`/learn/${id}`)}
                      icon={<Play size={16} />}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      onClick={handleEnroll}
                      loading={paying}
                    >
                      Enroll Now
                    </Button>
                  )}

                  <button
                    onClick={handleWishlist}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-white/8 text-sm text-white/60 hover:text-white transition-all"
                  >
                    <Heart size={15} className={isWishlisted ? 'fill-red-400 text-red-400' : ''} />
                    {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>

                  <div className="space-y-2 pt-2 border-t border-white/6">
                    {[
                      ['Sections', sections.length],
                      ['Students', course.StudentsEnrolled?.length ?? 0],
                      ['Rating', `${(course.averageRating ?? 0).toFixed(1)} / 5`],
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

function Section({ title, children }) {
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
