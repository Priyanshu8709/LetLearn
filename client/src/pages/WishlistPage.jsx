import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Skeleton from '../components/ui/Skeleton'
import { formatPrice } from '../lib/utils'
import Stars from '../components/ui/Stars'
import useCourseStore from '../store/courseStore'
import Button from '../components/ui/Button'

export default function WishlistPage() {
  const { wishlist, fetchWishlist, removeFromWishlist, isLoading } = useCourseStore()

  useEffect(() => { fetchWishlist() }, [])

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id)
      toast.success('Removed from wishlist')
    } catch { toast.error('Failed to remove') }
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <Heart size={18} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Wishlist</h1>
            <p className="text-white/40 text-sm">{wishlist.length} courses saved</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="rounded-2xl bg-surface-2 border border-white/6 p-16 text-center">
            <Heart size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/50 font-medium mb-2">Your wishlist is empty</p>
            <p className="text-white/25 text-sm mb-6">Save courses you're interested in</p>
            <Link to="/courses">
              <Button variant="secondary">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl bg-surface-2 border border-white/6 overflow-hidden hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-5 p-5">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.courseName} className="h-20 w-32 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-20 w-32 rounded-xl bg-surface-3 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/courses/${course._id}`}>
                      <h3 className="font-semibold text-white hover:text-brand-300 transition-colors text-sm mb-1">
                        {course.courseName}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                      <Stars rating={course.averageRating ?? 0} size={12} />
                      <span>({course.StudentsEnrolled?.length ?? 0} students)</span>
                    </div>
                    <span className="text-lg font-bold text-white">{formatPrice(course.price)}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link to={`/courses/${course._id}`}>
                      <Button variant="gradient" size="sm">Enroll</Button>
                    </Link>
                    <button
                      onClick={() => handleRemove(course._id)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg glass hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
