import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'

// Two modes:
// 1. /reset-password            → request form (enter email)
// 2. /reset-password?token=xxx  → update form (enter new password)

const requestSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

const updateSchema = z.object({
  password: z.string().min(8, 'Minimum 8 characters'),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
})

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { requestPasswordReset, updatePassword } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // ── Request form ──────────────────────────────────────────────────────────
  const reqForm = useForm({ resolver: zodResolver(requestSchema) })
  const onRequest = async ({ email }) => {
    try {
      setLoading(true)
      await requestPasswordReset(email)
      setDone(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Update form ───────────────────────────────────────────────────────────
  const updForm = useForm({ resolver: zodResolver(updateSchema) })
  const onUpdate = async ({ password }) => {
    try {
      setLoading(true)
      await updatePassword(token, password)
      toast.success('Password updated! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-0">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center glow">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient">LetLearn</span>
        </Link>

        <div className="glass-strong rounded-2xl border border-white/10 p-8">
          <Link
            to="/login"
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to login
          </Link>

          {/* ── No token: request reset ── */}
          {!token && (
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h1 className="text-2xl font-extrabold text-white mb-2">Forgot password?</h1>
                  <p className="text-white/40 text-sm mb-8">
                    Enter your email and we'll send you a link to reset your password.
                  </p>
                  <form onSubmit={reqForm.handleSubmit(onRequest)} className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      icon={<Mail size={15} />}
                      error={reqForm.formState.errors.email?.message}
                      {...reqForm.register('email')}
                    />
                    <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
                      Send Reset Link
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-4xl mb-4">📬</div>
                  <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                  <p className="text-white/40 text-sm">
                    We've sent a password reset link to your email. It expires in 1 hour.
                  </p>
                  <Link to="/login" className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300">
                    Return to login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ── Has token: update password ── */}
          {token && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-extrabold text-white mb-2">Set new password</h1>
              <p className="text-white/40 text-sm mb-8">
                Choose a strong password of at least 8 characters.
              </p>
              <form onSubmit={updForm.handleSubmit(onUpdate)} className="space-y-4">
                <div>
                  <Input
                    label="New Password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    icon={<Lock size={15} />}
                    error={updForm.formState.errors.password?.message}
                    {...updForm.register('password')}
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
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  icon={<Lock size={15} />}
                  error={updForm.formState.errors.confirm?.message}
                  {...updForm.register('confirm')}
                />
                <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
                  Update Password
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
