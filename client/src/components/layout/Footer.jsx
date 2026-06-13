import { Link } from 'react-router-dom'
import { Zap, Globe, ExternalLink, AtSign, Mail } from 'lucide-react'

const links = {
  Platform: [
    { label: 'Browse Courses', href: '/courses' },
    { label: 'Become an Instructor', href: '/signup' },
    { label: 'About Us', href: '/about' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
  ],
}

const socials = [
  { icon: <AtSign size={16} />, href: '#', label: 'Twitter' },
  { icon: <ExternalLink size={16} />, href: '#', label: 'GitHub' },
  { icon: <Globe size={16} />, href: '#', label: 'LinkedIn' },
  { icon: <Mail size={16} />, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/6 bg-surface-1 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">LetLearn</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              A modern learning platform that connects passionate instructors with eager students worldwide.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-9 w-9 flex items-center justify-center rounded-lg glass hover:bg-white/10 hover:text-white text-white/40 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white/80 mb-4">{section}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} LetLearn. All rights reserved.</p>
          <p className="text-xs text-white/30">Built with ❤️ for learners everywhere</p>
        </div>
      </div>
    </footer>
  )
}
