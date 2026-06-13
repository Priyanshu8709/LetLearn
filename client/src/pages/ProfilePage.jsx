import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Info, Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Avatar from '../components/ui/Avatar'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import useAuthStore from '../store/authStore'

export default function ProfilePage() {
  const { user, getProfile, updateProfile } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const [form, setForm] = useState({ gender: '', dob: '', about: '', contactNumber: '' })

  useEffect(() => {
    getProfile()
      .then((d) => {
        setProfile(d.profile)
        setForm({
          gender:        d.profile.gender        ?? '',
          dob:           d.profile.DoB           ?? '',
          about:         d.profile.about         ?? '',
          contactNumber: d.profile.contactNumber ?? '',
        })
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const data = await updateProfile(form)
      setProfile(data.profile ?? { ...profile, ...form, DoB: form.dob })
      toast.success('Profile updated')
      setEditing(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="rounded-2xl bg-surface-2 border border-white/6 p-8 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <Avatar src={user?.images} firstname={user?.firstname} lastname={user?.lastname} size="xl" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{user?.firstname} {user?.lastname}</h1>
                  <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
                  <Badge variant="brand" className="mt-2 capitalize">{user?.accountType}</Badge>
                </div>
              </div>
              <button
                onClick={() => setEditing((e) => !e)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 text-sm text-white/60 hover:text-white transition-all"
              >
                {editing ? <X size={14} /> : <Edit3 size={14} />}
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl bg-surface-2 border border-white/6 p-8">
            <h2 className="text-lg font-bold text-white mb-6">Personal Details</h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
              </div>
            ) : editing ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1.5">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand-500/50 transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input label="Date of Birth" type="date" value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    icon={<Calendar size={15} />} />
                </div>
                <Input label="Contact Number" type="tel" placeholder="+91 98765 43210"
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  icon={<Phone size={15} />} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/70">About</label>
                  <textarea
                    value={form.about}
                    onChange={(e) => setForm({ ...form, about: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself…"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all resize-none"
                  />
                </div>
                <Button variant="gradient" onClick={handleSave} loading={saving} icon={<Save size={15} />}>
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {[
                  { icon: <Mail size={15} />,     label: 'Email',         value: user?.email },
                  { icon: <User size={15} />,     label: 'Gender',        value: profile?.gender        || '—' },
                  { icon: <Calendar size={15} />, label: 'Date of Birth', value: profile?.DoB           || '—' },
                  { icon: <Phone size={15} />,    label: 'Contact',       value: profile?.contactNumber || '—' },
                  { icon: <Info size={15} />,     label: 'About',         value: profile?.about         || '—' },
                ].map((field) => (
                  <div key={field.label} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-surface-3 flex items-center justify-center text-white/30 flex-shrink-0 mt-0.5">
                      {field.icon}
                    </div>
                    <div>
                      <p className="text-xs text-white/30 mb-0.5">{field.label}</p>
                      <p className="text-sm text-white capitalize">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
