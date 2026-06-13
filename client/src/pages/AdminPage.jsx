import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, BookOpen, MessageSquare, TrendingUp,
  CheckCircle, XCircle, UserX, UserCheck, LayoutDashboard
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Skeleton from '../components/ui/Skeleton'
import api from '../lib/api'
import { formatDate, cn } from '../lib/utils'

const TABS = ['Overview', 'Users', 'Courses', 'Inquiries']

export default function AdminPage() {
  const [tab, setTab]           = useState('Overview')
  const [stats, setStats]       = useState(null)
  const [users, setUsers]       = useState([])
  const [courses, setCourses]   = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/courses'),
      api.get('/admin/inquiries'),
    ])
      .then(([s, u, c, i]) => {
        setStats(s.stats)
        setUsers(u.users ?? [])
        setCourses(c.courses ?? [])
        setInquiries(i.inquiries ?? [])
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const blockUser = async (id, block) => {
    try {
      await api.patch(`/admin/users/${id}/${block ? 'block' : 'unblock'}`)
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: block } : u))
      toast.success(`User ${block ? 'blocked' : 'unblocked'}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const approveCourse = async (id) => {
    try {
      await api.patch(`/admin/courses/${id}/approve`)
      setCourses((prev) => prev.map((c) => c._id === id ? { ...c, active: true } : c))
      toast.success('Course approved')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const rejectCourse = async (id) => {
    if (!confirm('Reject and permanently delete this course?')) return
    try {
      await api.delete(`/admin/courses/${id}/reject`)
      setCourses((prev) => prev.filter((c) => c._id !== id))
      toast.success('Course rejected')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const statCards = stats ? [
    { label: 'Total Users',       value: stats.totalUsers?.toLocaleString(),       icon: <Users size={18} />,       color: 'from-brand-500 to-blue-500' },
    { label: 'Total Courses',     value: stats.totalCourses?.toLocaleString(),     icon: <BookOpen size={18} />,    color: 'from-emerald-500 to-teal-500' },
    { label: 'Instructors',       value: stats.totalInstructor?.toLocaleString(),  icon: <TrendingUp size={18} />,  color: 'from-amber-500 to-orange-500' },
    { label: 'Students',          value: stats.totalStudents?.toLocaleString(),    icon: <Users size={18} />,       color: 'from-purple-500 to-pink-500' },
    { label: 'Active Courses',    value: stats.activeCourses?.toLocaleString(),    icon: <CheckCircle size={18} />, color: 'from-teal-500 to-cyan-500' },
    { label: 'Pending Inquiries', value: stats.pendingInquiries,                   icon: <MessageSquare size={18} />, color: 'from-red-500 to-rose-500' },
  ] : []

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/40 text-sm">Platform management</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-surface-2 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t ? 'bg-brand-500/20 text-brand-300' : 'text-white/40 hover:text-white/70'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* ── Overview ── */}
            {tab === 'Overview' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl bg-surface-2 border border-white/6 p-6"
                  >
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-3 text-white`}>
                      {s.icon}
                    </div>
                    <div className="text-3xl font-bold text-white">{s.value}</div>
                    <div className="text-sm text-white/40">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Users ── */}
            {tab === 'Users' && (
              <div className="space-y-3">
                {users.map((u, i) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl bg-surface-2 border border-white/6 px-5 py-4 flex items-center gap-4"
                  >
                    <Avatar src={u.images} firstname={u.firstname} lastname={u.lastname} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{u.firstname} {u.lastname}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                    <Badge
                      variant={u.accountType === 'admin' ? 'purple' : u.accountType === 'instructor' ? 'brand' : 'default'}
                      className="capitalize"
                    >
                      {u.accountType}
                    </Badge>
                    {u.isBlocked && <Badge variant="danger">Blocked</Badge>}
                    <button
                      onClick={() => blockUser(u._id, !u.isBlocked)}
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center transition-all',
                        u.isBlocked
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-red-500/10 text-red-400/60 hover:bg-red-500/15 hover:text-red-400'
                      )}
                      title={u.isBlocked ? 'Unblock' : 'Block'}
                    >
                      {u.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                    </button>
                  </motion.div>
                ))}
                {users.length === 0 && <p className="text-white/30 text-center py-12">No users found</p>}
              </div>
            )}

            {/* ── Courses ── */}
            {tab === 'Courses' && (
              <div className="space-y-3">
                {courses.map((c, i) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl bg-surface-2 border border-white/6 px-5 py-4 flex items-center gap-4"
                  >
                    {c.thumbnail && (
                      <img src={c.thumbnail} alt={c.courseName} className="h-12 w-20 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{c.courseName}</p>
                      <p className="text-xs text-white/40">
                        by {c.instructor?.firstname} {c.instructor?.lastname}
                        {c.createdAt ? ` · ${formatDate(c.createdAt)}` : ''}
                      </p>
                    </div>
                    <Badge variant={c.active ? 'success' : 'warning'}>
                      {c.active ? 'Active' : 'Pending'}
                    </Badge>
                    {!c.active && (
                      <button
                        onClick={() => approveCourse(c._id)}
                        className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 flex items-center justify-center transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => rejectCourse(c._id)}
                      className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/15 hover:text-red-400 flex items-center justify-center transition-all"
                      title="Reject & Delete"
                    >
                      <XCircle size={14} />
                    </button>
                  </motion.div>
                ))}
                {courses.length === 0 && <p className="text-white/30 text-center py-12">No courses found</p>}
              </div>
            )}

            {/* ── Inquiries ── */}
            {tab === 'Inquiries' && (
              <div className="space-y-3">
                {inquiries.map((inq, i) => (
                  <motion.div
                    key={inq._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl bg-surface-2 border border-white/6 px-5 py-4"
                  >
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="font-medium text-white text-sm">
                        {inq.UserId?.firstname} {inq.UserId?.lastname}
                      </p>
                      <span className="text-xs text-white/30">{inq.UserId?.email}</span>
                      <Badge
                        variant={inq.status === 'pending' ? 'warning' : 'success'}
                        className="ml-auto"
                      >
                        {inq.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/50">{inq.message}</p>
                    {inq.courseId && (
                      <p className="text-xs text-brand-400 mt-1.5">Re: {inq.courseId?.courseName}</p>
                    )}
                    {inq.createdAt && (
                      <p className="text-xs text-white/20 mt-1">{formatDate(inq.createdAt)}</p>
                    )}
                  </motion.div>
                ))}
                {inquiries.length === 0 && <p className="text-white/30 text-center py-12">No inquiries</p>}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
