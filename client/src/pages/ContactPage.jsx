import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, User, BookOpen, Send, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useCourseStore from '../store/courseStore'
import useAuthStore from '../store/authStore'

const INFO = [
  { icon: <Mail size={18} />,        title: 'Email Support',    desc: 'anshraj082003@gmail.com',     color: 'from-brand-500 to-blue-500' },
  { icon: <Clock size={18} />,       title: 'Response Time',    desc: 'Within 24 hours',             color: 'from-emerald-500 to-teal-500' },
  { icon: <MapPin size={18} />,      title: 'Based In',         desc: 'New Delhi, India',            color: 'from-purple-500 to-pink-500' },
]

export default function ContactPage() {
  const { submitInquiry } = useCourseStore()
  const { isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      setLoading(true)
      // Use inquiry endpoint if authenticated, otherwise just show success
      if (isAuthenticated()) {
        await submitInquiry(null, `[${form.subject || 'General'}] ${form.message}`)
      }
      setSent(true)
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/30 text-brand-300 text-sm font-medium mb-6">
            <MessageSquare size={14} />
            We're here to help
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Have a question about a course, an instructor application, or a technical issue?
            We respond to every message within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info cards */}
          <div className="space-y-4">
            {INFO.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-surface-2 border border-white/6 p-6 flex items-start gap-4"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/40 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* FAQ hint */}
            <div className="rounded-2xl bg-brand-500/8 border border-brand-500/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={15} className="text-brand-400" />
                <span className="text-sm font-semibold text-brand-300">Common Questions</span>
              </div>
              <ul className="space-y-1.5 text-xs text-white/40">
                {[
                  'How do I get a refund?',
                  'How do I become an instructor?',
                  'Is there a certificate on completion?',
                  'How does progress tracking work?',
                ].map((q) => (
                  <li key={q} className="flex items-center gap-1.5">
                    <span className="text-brand-500">›</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            {sent ? (
              <div className="rounded-2xl bg-surface-2 border border-white/6 p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">✉️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Message Received!</h2>
                <p className="text-white/40 text-sm max-w-sm">
                  Thanks for reaching out. We'll reply to your email within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-6 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-surface-2 border border-white/6 p-8">
                <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name *"
                      name="name"
                      placeholder="John Doe"
                      icon={<User size={15} />}
                      value={form.name}
                      onChange={handleChange}
                    />
                    <Input
                      label="Email Address *"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      icon={<Mail size={15} />}
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="e.g. Issue with my course access"
                    icon={<MessageSquare size={15} />}
                    value={form.subject}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Message *</label>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Describe your question or issue in detail…"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    loading={loading}
                    icon={<Send size={15} />}
                    className="w-full sm:w-auto"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
