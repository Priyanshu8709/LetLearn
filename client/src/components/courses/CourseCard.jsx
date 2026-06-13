import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Star, Heart, BookOpen } from 'lucide-react'
import { formatPrice, truncate } from '../../lib/utils'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import useCourseStore from '../../store/courseStore'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function CourseCard({ course, index = 0 }) {
  const { addToWishlist, wishlist } = useCourseStore()
  const { isAuthenticated } = useAuthStore()

  const isWishlisted = wishlist.some((c) => c._id === course._id)

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      toast.error('Login to save to wishlist')
      return
    }
    try {
      await addToWishlist(course._id)
      toast.success('Added to wishlist')
    } catch {
      toast.error('Could not update wishlist')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
    >
      <Link to={`/courses/${course._id}`} className="group block">
        <div className="rounded-2xl bg-surface-2 border border-white/6 overflow-hidden hover:border-brand-500/30 hover:shadow-[0_8px_32px_rgba(61,90,255,0.12)] transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-surface-3">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={40} className="text-white/10" />
              </div>
            )}
            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-lg glass hover:bg-white/15 transition-all"
              aria-label="Add to wishlist"
            >
              <Heart
                size={14}
                className={isWishlisted ? 'fill-red-400 text-red-400' : 'text-white/60'}
              />
            </button>
            {course.tag && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="brand">{course.tag?.name ?? course.tag}</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-brand-300 transition-colors line-clamp-2">
              {course.courseName}
            </h3>
            <p className="text-xs text-white/40 mb-3 line-clamp-2">
              {truncate(course.courseDescription, 80)}
            </p>

            {/* Instructor */}
            {course.instructor && (
              <div className="flex items-center gap-2 mb-3">
                <Avatar
                  src={course.instructor.images}
                  firstname={course.instructor.firstname}
                  lastname={course.instructor.lastname}
                  size="sm"
                />
                <span className="text-xs text-white/50">
                  {course.instructor.firstname} {course.instructor.lastname}
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
              <span className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-amber-400 font-medium">{(course.averageRating ?? 0).toFixed(1)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {course.StudentsEnrolled?.length ?? 0} students
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">
                {formatPrice(course.price)}
              </span>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/15 text-brand-300 font-medium">
                Enroll
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
