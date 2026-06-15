import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'
import { cn } from '../lib/utils'

const schema = z.object({
  firstname:   z.string().min(2, 'First name is required'),
  lastname:    z.string().min(1, 'Last name is required'),
  email:       z.string().email('Enter a valid email'),
  password:    z.string().min(8, 'Minimum 8 characters'),
  otp:         z.string().length(6, 'OTP must be 6 digits'),
})

export default function AdminSignupPage() {
  const { signup, sendOtp } = useAuthStore()
  const navigate = useNavigate()
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [otpSent, setOtpSent]   = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const email = watch('email')

  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Enter a valid email first')
      return
    }
    try {
      setOtpLoading(true)
      await sendOtp(email)
      setOtpSent(true)
      toast.success('OTP sent — check your email')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await signup({ ...data, accountType: 'admin' })
      toast.success('Admin account created! Please sign in.')
      navigate('/admin/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-surface-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center glow">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient">LetLearn</span>
        </Link>

        <div className="glass-strong rounded-2xl border border-white/10 p-8">
          <h1 className="text-2xl font-extrabold text-white mb-1">Create admin account</h1>
          <p className="text-white/40 text-sm mb-8">
            Already have an admin account?{' '}
            <Link to="/admin/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" icon={<User size={15} />}
                error={errors.firstname?.message} {...register('firstname')} />
              <Input label="Last Name"  placeholder="Doe"
                error={errors.lastname?.message}  {...register('lastname')} />
            </div>

            <div>
              <Input label="Email" type="email" placeholder="admin@example.com"
                icon={<Mail size={15} />} error={errors.email?.message} {...register('email')} />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || otpSent}
                className={cn(
                  'mt-2 text-xs font-medium transition-colors',
                  otpSent ? 'text-emerald-400' : 'text-brand-400 hover:text-brand-300'
                )}
              >
                {otpLoading ? 'Sending…' : otpSent ? '✓ OTP sent — check your email' : 'Send OTP to verify email'}
              </button>
            </div>

            {otpSent && (
              <Input label="OTP Code" placeholder="6-digit code" maxLength={6}
                icon={<ShieldCheck size={15} />} error={errors.otp?.message} {...register('otp')} />
            )}

            <div>
              <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Minimum 8 characters"
                icon={<Lock size={15} />} error={errors.password?.message} {...register('password')} />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="mt-1.5 text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
                {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                {showPw ? 'Hide' : 'Show'} password
              </button>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" loading={loading}>
              Create Admin Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/25">
            Admin accounts are for platform management only.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
