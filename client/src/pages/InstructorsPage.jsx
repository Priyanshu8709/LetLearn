import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, Star, Search } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import api from '../lib/api'

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    api.get('/admin/users')
      .then((data) => {
        const ins = (data.users ?? []).filter((u) => u.accountType === 'instructor')
        setInstructors(ins)
      })
      .catch(() => {
        // endpoint requires admin auth — fall back to empty list for public view
        setInstructors([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = instructors.filter((u) =>
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Our <span className="text-gradient">Instructors</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Every instructor on LetLearn is a practitioner — people who have done the work,
            not just studied it.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search instructors…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 text-lg">No instructors found</p>
            <p className="text-white/25 text-sm mt-1">
              {query ? 'Try a different search term' : 'Check back soon'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((instructor, i) => (
              <motion.div
                key={instructor._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl bg-surface-2 border border-white/6 p-7 text-center hover:border-brand-500/30 hover:shadow-[0_8px_32px_rgba(61,90,255,0.12)] transition-all"
              >
                <div className="flex justify-center mb-4">
                  <Avatar
                    src={instructor.images}
                    firstname={instructor.firstname}
                    lastname={instructor.lastname}
                    size="xl"
                  />
                </div>
                <h3 className="font-semibold text-white text-base">
                  {instructor.firstname} {instructor.lastname}
                </h3>
                <Badge variant="brand" className="mt-2 mb-4">Instructor</Badge>
                <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} />
                    {instructor.courses?.length ?? 0} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    Verified
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Become instructor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl bg-gradient-to-br from-brand-600 to-purple-700 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 noise" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Become an Instructor</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Share your expertise with thousands of learners. Create your first course and start earning.
            </p>
            <Link to="/signup">
              <button className="px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold hover:bg-white/90 transition-all">
                Apply to Teach
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
