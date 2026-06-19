import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, BookOpen, Users, Award, Globe, Heart, Target, TrendingUp } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  { icon: <Heart size={22} />,      title: 'Learner First',          desc: 'Every decision starts with one question: does this help learners succeed?',   color: 'from-red-500 to-rose-500' },
  { icon: <Globe size={22} />,      title: 'Accessible to All',      desc: 'Quality education should not depend on where you were born or what you earn.', color: 'from-brand-500 to-blue-500' },
  { icon: <Target size={22} />,     title: 'Outcome Focused',        desc: 'We measure success by the jobs found and skills gained, not courses sold.',    color: 'from-emerald-500 to-teal-500' },
  { icon: <TrendingUp size={22} />, title: 'Continuous Improvement', desc: 'We ship, learn, and iterate. Perfection is the enemy of progress.',            color: 'from-purple-500 to-pink-500' },
]

const STATS = [
  { value: '50K+',   label: 'Active Learners',  icon: <Users size={20} /> },
  { value: '1,200+', label: 'Expert Courses',    icon: <BookOpen size={20} /> },
  { value: '98%',    label: 'Satisfaction Rate', icon: <Award size={20} /> },
  { value: '40+',    label: 'Countries Reached', icon: <Globe size={20} /> },
]

export default function AboutPage() {
  const valuesRef = useRef(null)
  const statsRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.value-card',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' } }
      )
      gsap.fromTo('.stat-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/12 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/12 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/30 text-brand-300 text-sm font-medium mb-8"
          >
            <Zap size={14} />
            Our story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Education is a <span className="text-gradient">right</span>,<br />not a privilege.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto"
          >
            LetLearn was founded in 2024 with a single obsession: make world-class learning
            accessible to every person with an internet connection. We believe the best
            teachers and the best students can connect without geography or cost getting in the way.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 border-y border-white/6 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item text-center">
              <div className="flex justify-center mb-3 text-brand-400">{s.icon}</div>
              <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-6">Our Mission</h2>
            <p className="text-white/50 leading-relaxed mb-6">
              We're building the platform we wish had existed when we were learning. One that respects
              your time, rewards your curiosity, and connects you directly with instructors who care.
            </p>
            <p className="text-white/50 leading-relaxed mb-8">
              LetLearn is more than a course marketplace. It's a community of lifelong learners,
              expert practitioners, and ambitious builders who want to grow together.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all glow-sm"
            >
              Start Learning Today
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: 'Founded',           value: '2024' },
              { label: 'HQ',                value: 'India' },
              { label: 'Languages',         value: '3+' },
              { label: 'Avg. Course Rating', value: '4.8 ★' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface-2 border border-white/6 p-6">
                <p className="text-3xl font-extrabold text-gradient mb-1">{item.value}</p>
                <p className="text-sm text-white/40">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-white mb-4">What We Stand For</h2>
          <p className="text-white/40 max-w-xl mx-auto">Our values aren't on a poster — they drive every product decision we make.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="value-card rounded-2xl bg-surface-2 border border-white/6 p-7 hover:border-white/12 transition-all">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white mb-5`}>
                {v.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600 p-12 text-center"
          >
            <div className="absolute inset-0 noise" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Join us on this journey</h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Whether you want to learn or teach, there's a place for you on LetLearn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <button className="px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold text-base hover:bg-white/90 transition-all">
                    Create Free Account
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
