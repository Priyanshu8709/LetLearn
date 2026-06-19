import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight, Play, Star, Users, BookOpen, Award,
  Zap, ShieldCheck, TrendingUp, ChevronRight,
  CheckCircle, Code2, Brain, Palette, Server, Lock
} from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import CourseCard from '../components/courses/CourseCard'
import { CourseCardSkeleton } from '../components/ui/Skeleton'
import useCourseStore from '../store/courseStore'
import useAuthStore from '../store/authStore'
import Button from '../components/ui/Button'

gsap.registerPlugin(ScrollTrigger)

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '50K+',   label: 'Active Learners',  suffix: '' },
  { value: '1,200+', label: 'Expert Courses',    suffix: '' },
  { value: '4.9',    label: 'Average Rating',    suffix: '★' },
  { value: '98%',    label: 'Satisfaction Rate', suffix: '' },
]

const FEATURES = [
  {
    icon: <Zap size={20} />,
    title: 'Self-Paced Learning',
    desc: 'Stream any lecture, any time. Progress is saved automatically so you pick up exactly where you left off.',
    color: 'from-brand-500 to-indigo-500',
    border: 'hover:border-brand-500/40',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Vetted Instructors',
    desc: 'Every instructor passes a rigorous review. Real practitioners — not just theorists.',
    color: 'from-violet-500 to-purple-600',
    border: 'hover:border-violet-500/40',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Career-Focused',
    desc: 'Curriculum built around real job requirements. Skills employers actually hire for.',
    color: 'from-emerald-500 to-teal-600',
    border: 'hover:border-emerald-500/40',
  },
  {
    icon: <Award size={20} />,
    title: 'Verified Certificates',
    desc: 'Earn shareable certificates upon completion. Add them to LinkedIn in one click.',
    color: 'from-amber-500 to-orange-500',
    border: 'hover:border-amber-500/40',
  },
]

const CATEGORIES = [
  { icon: <Code2 size={22} />,   label: 'Web Dev',         count: '240+ courses', color: 'from-brand-500/20 to-indigo-500/20', border: 'border-brand-500/20' },
  { icon: <Brain size={22} />,   label: 'Machine Learning',count: '180+ courses', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20' },
  { icon: <Server size={22} />,  label: 'DevOps',           count: '95+ courses',  color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20' },
  { icon: <Palette size={22} />, label: 'UI/UX Design',     count: '120+ courses', color: 'from-pink-500/20 to-rose-500/20',    border: 'border-pink-500/20' },
  { icon: <Lock size={22} />,    label: 'Cybersecurity',    count: '75+ courses',  color: 'from-red-500/20 to-orange-500/20',   border: 'border-red-500/20' },
  { icon: <BookOpen size={22} />,label: 'Data Science',     count: '160+ courses', color: 'from-cyan-500/20 to-blue-500/20',    border: 'border-cyan-500/20' },
]

const TESTIMONIALS = [
  {
    quote: "Went from knowing zero React to landing a senior frontend role. The hooks and testing sections are absolutely world-class.",
    name: "Kavya Nair", role: "Frontend Engineer @ Razorpay", rating: 5, avatar: "K",
    color: "from-brand-500 to-purple-600",
  },
  {
    quote: "I won my first Kaggle silver medal after finishing the ML course. The competition walkthrough section alone is worth it.",
    name: "Arjun Singh", role: "ML Engineer @ Google", rating: 5, avatar: "A",
    color: "from-emerald-500 to-teal-600",
  },
  {
    quote: "Got a DevOps role straight out of this course. The K8s and Terraform sections are the most thorough I've seen anywhere.",
    name: "Deepak Mishra", role: "DevOps Engineer @ Infosys", rating: 5, avatar: "D",
    color: "from-amber-500 to-orange-600",
  },
]

// ── Reusable animated section wrapper ─────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { courses, topRated, fetchCourses, fetchTopRated, isLoading } = useCourseStore()
  const { isAuthenticated, user } = useAuthStore()

  const heroRef      = useRef(null)
  const statsRef     = useRef(null)
  const featuresRef  = useRef(null)
  const categoriesRef= useRef(null)
  const headlineRef  = useRef(null)

  const { scrollY } = useScroll()
  const heroY       = useTransform(scrollY, [0, 600], [0, -150])
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0])
  const orbScale    = useTransform(scrollY, [0, 500], [1, 1.4])

  useEffect(() => {
    fetchCourses()
    fetchTopRated()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Staggered stat counters
      gsap.fromTo('.stat-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 82%' }
        }
      )

      // Feature cards with clip-path reveal
      gsap.fromTo('.feature-card',
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 78%' }
        }
      )

      // Category chips fly in from left
      gsap.fromTo('.category-chip',
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: categoriesRef.current, start: 'top 82%' }
        }
      )

      // Horizontal marquee for logos (if you add a logos section)
      // Decorative line draw on headline
      gsap.fromTo('.headline-line',
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut', delay: 1.2,
          transformOrigin: 'left center'
        }
      )

    })
    return () => ctx.revert()
  }, [])

  const displayCourses = (topRated.length > 0 ? topRated : courses).slice(0, 8)

  return (
    <PageLayout>

      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Layered background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large ambient orbs */}
          <motion.div style={{ scale: orbScale }}
            className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-brand-500/10 rounded-full blur-[120px]" />
          <motion.div style={{ scale: orbScale }}
            className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[100px]" />

          {/* Dot grid */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Diagonal accent lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diag" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                <line x1="0" y1="0" x2="0" y2="80" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
        </div>

        {/* Hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: 'backOut' }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10
              bg-brand-500/10 border border-brand-500/25 text-brand-300 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Trusted by 50,000+ learners worldwide
          </motion.div>

          {/* Headline */}
          <div ref={headlineRef} className="mb-7">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[1.08] tracking-tight"
            >
              <span className="text-white block">Master In-Demand</span>
              <span className="relative inline-block mt-2">
                <span className="text-gradient">Skills That Pay</span>
                {/* Underline SVG */}
                <svg className="headline-line absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                  <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="url(#uline)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="uline" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3d5aff"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>
          </div>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Expert-led courses in web dev, ML, DevOps, and design.
            Go from beginner to job-ready with structured paths and real projects.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white
                  bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500
                  shadow-[0_0_40px_rgba(61,90,255,0.35)] hover:shadow-[0_0_55px_rgba(61,90,255,0.5)]
                  transition-all duration-300"
              >
                Explore Courses
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            {/* Second CTA: Dashboard link if logged in, else Sign Up */}
            {isAuthenticated() ? (
              <Link to={user?.accountType === 'instructor' ? '/instructor/dashboard' : user?.accountType === 'admin' ? '/admin' : '/dashboard'}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold
                    text-white/70 hover:text-white border border-white/12 hover:border-white/25
                    hover:bg-white/5 transition-all duration-300"
                >
                  <Play size={15} className="fill-current" />
                  Continue Learning
                </motion.button>
              </Link>
            ) : (
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold
                    text-white/70 hover:text-white border border-white/12 hover:border-white/25
                    hover:bg-white/5 transition-all duration-300"
                >
                  Start for Free
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/35"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2.5">
                {['K','R','A','S','D'].map((l, i) => (
                  <div key={i}
                    className="h-9 w-9 rounded-full border-2 border-surface-0 flex items-center justify-center
                      text-xs font-bold text-white"
                    style={{
                      background: `hsl(${220 + i * 30}, 70%, 55%)`,
                      zIndex: 5 - i,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span><span className="text-white/70 font-semibold">50,000+</span> learners enrolled</span>
            </div>
            <span className="hidden sm:block text-white/15">·</span>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
              <span><span className="text-white/70 font-semibold">4.9</span> avg. rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-surface-0 via-surface-0/60 to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative py-14 border-y border-white/6 overflow-hidden">
        {/* Subtle gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/3 via-transparent to-purple-600/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-card text-center px-4 py-6 rounded-2xl bg-white/2 border border-white/5
              hover:border-brand-500/25 hover:bg-brand-500/4 transition-all duration-300 group">
              <div className="text-4xl font-black text-white mb-1 tracking-tight group-hover:text-brand-200 transition-colors">
                {s.value}<span className="text-brand-400">{s.suffix}</span>
              </div>
              <div className="text-sm text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════════════════════ */}
      <section ref={categoriesRef} className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-4">
            What You'll Learn
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Explore Every Discipline
          </h2>
          <p className="text-white/40 max-w-lg mx-auto leading-relaxed">
            From frontend to infrastructure, from ML to design — if it's in demand, we teach it.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} to={`/courses?query=${encodeURIComponent(cat.label)}`}>
              <div className={`category-chip group relative rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.color}
                p-6 cursor-pointer hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                transition-all duration-300 overflow-hidden`}>
                {/* Glow orb on hover */}
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/5
                  group-hover:scale-150 transition-transform duration-500 blur-2xl" />
                <div className="relative">
                  <div className="text-white/70 mb-4 group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <p className="font-bold text-white text-base mb-1">{cat.label}</p>
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{cat.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TOP COURSES
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3">Highest Rated</p>
            <h2 className="text-4xl font-black text-white tracking-tight">Top Courses</h2>
          </div>
          <Link to="/courses"
            className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300
              font-semibold transition-colors group mb-1">
            View all
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </FadeUp>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCourses.map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════════ */}
      <section ref={featuresRef} className="py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-4">
            The Platform
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Built for Serious Learners
          </h2>
          <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
            Every feature exists for one reason — to get you from where you are to where you want to be.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={`feature-card group rounded-2xl bg-surface-2 border border-white/6 ${f.border}
                p-7 transition-all duration-300 cursor-default`}
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl
                bg-gradient-to-br ${f.color} mb-6 text-white
                shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 overflow-hidden">
        {/* Full-bleed tinted bg */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/3 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-4">
                Student Stories
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                Real People, Real Results
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-2xl bg-surface-2 border border-white/6 p-7
                    hover:border-white/12 transition-all duration-300 group"
                >
                  {/* Quote mark */}
                  <div className="absolute top-5 right-6 text-6xl leading-none text-white/5 font-serif select-none
                    group-hover:text-white/8 transition-colors">
                    "
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-white/65 leading-relaxed mb-7 relative z-10">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${t.color}
                      flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/35">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-4">
            Simple Process
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Three Steps to Job-Ready
          </h2>
        </FadeUp>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px
            bg-gradient-to-r from-brand-500/40 via-purple-500/40 to-brand-500/40" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick a Path', desc: 'Choose from curated learning paths designed for your goal — a job, a promotion, or a new skill.' },
              { step: '02', title: 'Learn & Build', desc: 'Follow structured lessons, complete real projects, and get your code reviewed by instructors.' },
              { step: '03', title: 'Get Certified', desc: 'Earn a verified certificate, add it to your LinkedIn, and start applying with confidence.' },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.15} className="relative text-center">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl
                  bg-gradient-to-br from-brand-500/15 to-purple-600/15 border border-brand-500/20 mx-auto mb-6">
                  <span className="text-3xl font-black text-gradient">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-[220px] mx-auto">{item.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CTA — FINAL
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-purple-700" />
              <div className="absolute inset-0 noise opacity-40" />
              {/* Glow orbs inside card */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

              <div className="relative z-10 px-10 py-16 text-center">
                {/* Checklist pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {['No prior experience needed', 'Cancel anytime', 'Certificate included'].map((t) => (
                    <span key={t}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-white/10 text-white/80 text-xs font-medium border border-white/15">
                      <CheckCircle size={12} className="text-emerald-300" />
                      {t}
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                  Your next career move<br className="hidden sm:block" /> starts today.
                </h2>
                <p className="text-white/65 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                  Join over 50,000 learners who transformed their careers with LetLearn.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {isAuthenticated() ? (
                    <Link to={user?.accountType === 'instructor' ? '/instructor/dashboard' : user?.accountType === 'admin' ? '/admin' : '/dashboard'}>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-9 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base
                          hover:bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                          transition-all duration-300 flex items-center gap-2"
                      >
                        Go to Dashboard
                        <ArrowRight size={17} />
                      </motion.button>
                    </Link>
                  ) : (
                    <Link to="/signup">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-9 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base
                          hover:bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                          transition-all duration-300 flex items-center gap-2"
                      >
                        Get Started Free
                        <ArrowRight size={17} />
                      </motion.button>
                    </Link>
                  )}
                  <Link to="/courses">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-9 py-4 rounded-2xl border border-white/25 text-white font-bold text-base
                        hover:bg-white/10 transition-all duration-300"
                    >
                      Browse Courses
                    </motion.button>
                  </Link>
                </div>

                <p className="mt-8 text-white/30 text-xs">
                  {isAuthenticated() ? `Welcome back, ${user?.firstname}!` : 'No credit card required · Free courses available'}
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </PageLayout>
  )
}
