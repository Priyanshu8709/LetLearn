import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { BookOpen, TrendingUp, Award, Clock, ArrowRight, Play } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import useAuthStore from '../store/authStore'
import useCourseStore from '../store/courseStore'
import { formatPrice } from '../lib/utils'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { progress, fetchProgress, isLoading } = useCourseStore()
  const greetRef = useRef(null)

  useEffect(() => {
    fetchProgress()
  }, [])

  useEffect(() => {
    if (greetRef.current) {
      gsap.fromTo(greetRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: 'Enrolled', value: progress.length, icon: <BookOpen size={18} />, color: 'from-brand-500 to-blue-500' },
    { label: 'Completed', value: progress.filter((p) => p.progressPercentage === 100).length, icon: <Award size={18} />, color: 'from-emerald-500 to-teal-500' },
    { label: 'In Progress', value: progress.filter((p) => p.progressPercentage > 0 && p.progressPercentage < 100).length, icon: <TrendingUp size={18} />, color: 'from-amber-500 to-orange-500' },
    { label: 'Hours Spent', value: '—', icon: <Clock size={18} />, color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Greeting */}
        <div ref={greetRef} className="mb-10">
          <div className="flex items-center gap-4">
            <Avatar src={user?.images} firstname={user?.firstname} lastname={user?.lastname} size="lg" />
            <div>
              <p className="text-white/40 text-sm">{greeting},</p>
              <h1 className="text-3xl font-extrabold text-white">
                {user?.firstname} {user?.lastname}
              </h1>
              <Badge variant="brand" className="mt-1.5 capitalize">{user?.accountType}</Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-surface-2 border border-white/6 p-5"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} mb-3 text-white`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* My courses */}
        <h2 className="text-xl font-bold text-white mb-5">My Courses</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : progress.length === 0 ? (
          <div className="rounded-2xl bg-surface-2 border border-white/6 p-12 text-center">
            <BookOpen size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/50 font-medium mb-2">No courses yet</p>
            <p className="text-white/25 text-sm mb-6">Browse courses and start learning today</p>
            <Link to="/courses">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500/15 text-brand-300 text-sm font-medium hover:bg-brand-500/25 transition-all">
                Browse Courses <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {progress.map((p) => {
              const course = p.courseId
              if (!course) return null
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl bg-surface-2 border border-white/6 hover:border-brand-500/20 transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-5 p-5">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.courseName} className="h-16 w-24 object-cover rounded-xl flex-shrink-0" />
                    ) : (
                      <div className="h-16 w-24 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={20} className="text-white/15" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">{course.courseName}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 rounded-full bg-surface-4">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-700"
                            style={{ width: `${p.progressPercentage ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40 flex-shrink-0">{p.progressPercentage ?? 0}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.progressPercentage === 100 ? (
                          <Badge variant="success">Completed</Badge>
                        ) : p.progressPercentage > 0 ? (
                          <Badge variant="warning">In Progress</Badge>
                        ) : (
                          <Badge>Not Started</Badge>
                        )}
                        {course.price && <span className="text-xs text-white/30">{formatPrice(course.price)}</span>}
                      </div>
                    </div>
                    <Link to={`/learn/${course._id}`}>
                      <button className="flex-shrink-0 h-10 w-10 rounded-xl bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 flex items-center justify-center transition-all">
                        <Play size={16} />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
