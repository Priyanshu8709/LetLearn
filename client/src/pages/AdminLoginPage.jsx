import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function AdminLoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password }) => {
    try {
      setLoading(true)
      const res = await login(email, password)
      if (res.user?.accountType !== 'admin') {
        toast.error('Only admin users can use this page')
        return
      }
      toast.success(`Welcome back, ${res.user?.firstname}!`)
      navigate(from ?? '/admin', { replace: true })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-surface-1 to-surface-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),
                linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center glow">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">LetLearn</span>
          </Link>
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            Admin access<br />for platform management.
          </h2>
          <p className="text-white/40 text-lg leading-relaxed max-w-sm">
            Manage users, courses, inquiries, and platform metrics from a secure admin dashboard.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-0">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LetLearn</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-white mb-2">Admin sign in</h1>
          <p className="text-white/40 mb-8">
            Need an admin account?{' '}
            <Link to="/admin/signup" className="text-brand-400 hover:text-brand-300 font-medium">
              Create one here
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="mt-1.5 text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
              >
                {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                {showPw ? 'Hide' : 'Show'} password
              </button>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
