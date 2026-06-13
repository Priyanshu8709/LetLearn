import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import {
  BookOpen, Search, Bell, Heart, ChevronDown,
  LogOut, User, LayoutDashboard, Menu, X, Zap
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import Avatar from '../ui/Avatar'
import { cn } from '../../lib/utils'

const navLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'Instructors', href: '/instructors' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const logoRef = useRef(null)

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/') // in preview mode stays logged in — just goes home
  }

  const dashboardPath =
    user?.accountType === 'admin' ? '/admin'
    : user?.accountType === 'instructor' ? '/instructor/dashboard'
    : '/dashboard'

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong border-b border-white/8 shadow-2xl' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" ref={logoRef} className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gradient">LetLearn</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                location.pathname.startsWith(link.href)
                  ? 'bg-brand-500/15 text-brand-300'
                  : 'text-white/60 hover:text-white hover:bg-white/6'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Link
            to="/courses"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-white/10 transition-all"
            aria-label="Search courses"
          >
            <Search size={16} className="text-white/60" />
          </Link>

          {isAuthenticated() ? (
            <>
              <Link
                to="/wishlist"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-white/10 transition-all relative"
                aria-label="Wishlist"
              >
                <Heart size={16} className="text-white/60" />
              </Link>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl glass hover:bg-white/10 transition-all"
                >
                  <Avatar
                    src={user?.images}
                    firstname={user?.firstname}
                    lastname={user?.lastname}
                    size="sm"
                  />
                  <span className="hidden sm:block text-sm font-medium text-white/80 max-w-[100px] truncate">
                    {user?.firstname}
                  </span>
                  <ChevronDown size={14} className={cn('text-white/40 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-sm font-semibold text-white">{user?.firstname} {user?.lastname}</p>
                        <p className="text-xs text-white/40 capitalize">{user?.accountType}</p>
                      </div>
                      <div className="p-1">
                        <DropdownItem to={dashboardPath} icon={<LayoutDashboard size={15} />} label="Dashboard" />
                        <DropdownItem to="/profile" icon={<User size={15} />} label="Profile" />
                        {user?.accountType === 'student' && (
                          <DropdownItem to="/wishlist" icon={<Heart size={15} />} label="Wishlist" />
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all glow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-white/10 transition-all"
          >
            {menuOpen ? <X size={18} className="text-white/80" /> : <Menu size={18} className="text-white/80" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/8 glass-strong overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/6 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated() && (
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/6 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function DropdownItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all"
    >
      {icon}
      {label}
    </Link>
  )
}
