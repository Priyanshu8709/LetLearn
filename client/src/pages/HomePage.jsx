import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight, Play, Star, Users, BookOpen, Award,
  Zap, Shield, TrendingUp, ChevronRight
} from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import CourseCard from '../components/courses/CourseCard'
import { CourseCardSkeleton } from '../components/ui/Skeleton'
import useCourseStore from '../store/courseStore'
import Button from '../components/ui/Button'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: 'Active Learners', value: '50K+', icon: <Users size={20} /> },
  { label: 'Expert Courses', value: '1,200+', icon: <BookOpen size={20} /> },
  { label: 'Avg. Rating', value: '4.9★', icon: <Star size={20} /> },
  { label: 'Certifications', value: '30K+', icon: <Award size={20} /> },
]

const FEATURES = [
  {
    icon: <Zap size={22} />,
    title: 'Learn at Your Pace',
    desc: 'Stream any lecture at any time, mark lessons complete, and track your progress automatically.',
    color: 'from-brand-500 to-blue-500',
  },
  {
    icon: <Shield size={22} />,
    title: 'Expert Instructors',
    desc: 'Every instructor is vetted by our team. Only the best get to teach on LetLearn.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Real Career Growth',
    desc: 'Courses designed around real industry needs. Upskill and land the role you want.',
    color: 'from-emerald-500 to-teal-500',
  },
]

export default function HomePage() {
  const { courses, topRated, fetchCourses, fetchTopRated, isLoading } = useCourseStore()
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const featuresRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -120])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    fetchCourses()
    fetchTopRated()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats counter animation
      gsap.fromTo('.stat-item',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
        }
      )
      // Feature cards
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15,
          scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  const displayCourses = topRated.length > 0 ? topRated : courses

  return (
    <PageLayout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/30 text-brand-300 text-sm font-medium mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            The modern way to learn & grow
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            <span className="text-white">Unlock Your</span>
            <br />
            <span className="text-gradient">Full Potential</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Expert-led courses, real-world projects, and a community that keeps you moving forward.
            Learn what matters. Build what's next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/courses">
              <Button variant="gradient" size="xl" icon={<ArrowRight size={18} />}>
                Explore Courses
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary" size="xl" icon={<Play size={16} />}>
                Watch Preview
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-surface-0 bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ zIndex: 5 - i }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm text-white/40">
              <span className="text-white/80 font-semibold">50,000+</span> learners already enrolled
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-surface-0 to-transparent" />
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 border-y border-white/6 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <div className="flex justify-center mb-3 text-brand-400">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose <span className="text-gradient">LetLearn</span>?</h2>
          <p className="text-white/40 max-w-xl mx-auto">Everything you need to go from zero to job-ready, built into one seamless platform.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card rounded-2xl bg-surface-2 border border-white/6 p-8 hover:border-white/12 transition-all">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} mb-5 text-white`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Courses */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Top Rated Courses</h2>
            <p className="text-white/40 mt-1 text-sm">Hand-picked by our team for quality and impact</p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCourses.slice(0, 8).map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600 p-12 text-center"
          >
            <div className="absolute inset-0 noise" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Join thousands of learners who are already building their future with LetLearn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button
                    className="bg-white text-brand-700 hover:bg-white/90 !shadow-none"
                    size="lg"
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
