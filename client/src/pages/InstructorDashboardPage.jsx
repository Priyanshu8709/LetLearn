import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, BookOpen, Users, Star, TrendingUp,
  Edit, Trash2, ToggleLeft, ToggleRight, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Skeleton from '../components/ui/Skeleton'
import useAuthStore from '../store/authStore'
import useCourseStore from '../store/courseStore'
import { formatPrice } from '../lib/utils'

export default function InstructorDashboardPage() {
  const { user } = useAuthStore()
  const { courses, fetchInstructorCourses, toggleCourse, deleteCourse, isLoading } = useCourseStore()

  useEffect(() => {
    fetchInstructorCourses().catch((err) => toast.error(err.message))
  }, [])

  const handleToggle = async (id) => {
    try {
      await toggleCourse(id)
      toast.success('Course status updated')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    try {
      await deleteCourse(id)
      toast.success('Course deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const stats = [
    { label: 'Total Courses',  value: courses.length,
      icon: <BookOpen size={18} />, color: 'from-brand-500 to-blue-500' },
    { label: 'Total Students', value: courses.reduce((a, c) => a + (c.StudentsEnrolled?.length ?? 0), 0).toLocaleString(),
      icon: <Users size={18} />, color: 'from-emerald-500 to-teal-500' },
    { label: 'Avg. Rating',    value: courses.length
        ? (courses.reduce((a, c) => a + (c.averageRating ?? 0), 0) / courses.length).toFixed(1)
        : '—',
      icon: <Star size={18} />, color: 'from-amber-500 to-orange-500' },
    { label: 'Active Courses', value: courses.filter((c) => c.active).length,
      icon: <TrendingUp size={18} />, color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Avatar src={user?.images} firstname={user?.firstname} lastname={user?.lastname} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.firstname}'s Studio</h1>
              <p className="text-white/40 text-sm">Manage your courses and track performance</p>
            </div>
          </div>
          <Link to="/instructor/create-course">
            <Button variant="gradient" icon={<Plus size={16} />}>New Course</Button>
          </Link>
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

        {/* Course list */}
        <h2 className="text-lg font-bold text-white mb-5">Your Courses</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl bg-surface-2 border border-white/6 p-12 text-center">
            <BookOpen size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/50 font-medium mb-6">You haven't created any courses yet</p>
            <Link to="/instructor/create-course">
              <Button variant="gradient" icon={<Plus size={16} />}>Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-surface-2 border border-white/6 overflow-hidden hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-5 p-5">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.courseName}
                      className="h-16 w-24 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-16 w-24 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-white/15" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-white text-sm truncate">{course.courseName}</h3>
                      <Badge variant={course.active ? 'success' : 'danger'}>
                        {course.active ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Users size={11} />{(course.StudentsEnrolled?.length ?? 0).toLocaleString()} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        {(course.averageRating ?? 0).toFixed(1)}
                      </span>
                      <span>{formatPrice(course.price)}</span>
                      {course.tag && (
                        <span className="text-white/25">{course.tag?.name ?? course.tag}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/courses/${course._id}`}>
                      <button className="h-9 w-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all" title="Preview">
                        <ChevronRight size={15} />
                      </button>
                    </Link>
                    <Link to={`/instructor/edit-course/${course._id}`}>
                      <button className="h-9 w-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all" title="Edit">
                        <Edit size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleToggle(course._id)}
                      className="h-9 w-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-all"
                      title={course.active ? 'Disable' : 'Enable'}
                    >
                      {course.active
                        ? <ToggleRight size={15} className="text-emerald-400" />
                        : <ToggleLeft size={15} className="text-white/30" />
                      }
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="h-9 w-9 rounded-lg glass hover:bg-red-500/15 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"
                      title="Delete"
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
