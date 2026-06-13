import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Tag, DollarSign, FileText, BookOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useCourseStore from '../store/courseStore'

const schema = z.object({
  courseName:        z.string().min(5,  'Course name must be at least 5 characters'),
  courseDescription: z.string().min(20, 'Description must be at least 20 characters'),
  whatYouwillLearn:  z.string().min(10, 'Required'),
  price:             z.coerce.number().min(0, 'Price must be 0 or more'),
  tag:               z.string().optional(),
})

export default function CreateCoursePage() {
  const { tags, fetchTags, createCourse } = useCourseStore()
  const navigate = useNavigate()
  const [loading, setLoading]       = useState(false)
  const [thumbnail, setThumbnail]   = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    fetchTags().catch(() => {})
  }, [])

  const handleThumb = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    if (!thumbnail) { toast.error('Upload a thumbnail'); return }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('courseName',        data.courseName)
      formData.append('courseDescription', data.courseDescription)
      formData.append('whatYouwillLearn',  data.whatYouwillLearn)
      formData.append('price',             data.price)
      if (data.tag) {
        formData.append('tag', data.tag)
      }
      formData.append('thumbnailImage', thumbnail)
      await createCourse(formData)
      toast.success('Course created successfully!')
      navigate('/instructor/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <BookOpen size={18} className="text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Course</h1>
              <p className="text-white/40 text-sm">Share your knowledge with the world</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Thumbnail */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2">
                Course Thumbnail <span className="text-red-400">*</span>
              </label>
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" onChange={handleThumb} className="sr-only" />
                <div className={`rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
                  thumbPreview ? 'border-brand-500/40' : 'border-white/10 hover:border-white/25'
                }`}>
                  {thumbPreview ? (
                    <img src={thumbPreview} alt="Thumbnail preview" className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center gap-3 text-white/30">
                      <Upload size={32} />
                      <span className="text-sm">Click to upload thumbnail</span>
                      <span className="text-xs">Recommended: 1280 × 720 px</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <Input
              label="Course Name"
              placeholder="e.g. Complete React Developer Course"
              icon={<FileText size={15} />}
              error={errors.courseName?.message}
              {...register('courseName')}
            />

            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Description</label>
              <textarea
                rows={4}
                placeholder="Describe what this course covers, who it's for, and why students should take it…"
                className={`w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all resize-none ${
                  errors.courseDescription ? 'border-red-500/60' : 'border-white/10'
                }`}
                {...register('courseDescription')}
              />
              {errors.courseDescription && (
                <p className="text-xs text-red-400 mt-1">{errors.courseDescription.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">
                What Will Students Learn?
              </label>
              <textarea
                rows={4}
                placeholder="List learning outcomes, one per line"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all resize-none"
                {...register('whatYouwillLearn')}
              />
              {errors.whatYouwillLearn && (
                <p className="text-xs text-red-400 mt-1">{errors.whatYouwillLearn.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Price (₹)"
                type="number"
                placeholder="499"
                min="0"
                icon={<DollarSign size={15} />}
                error={errors.price?.message}
                {...register('price')}
              />

              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Category</label>
                <div className="relative">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <select
                    className={`w-full rounded-xl bg-white/5 border pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-brand-500/50 transition-all appearance-none ${
                      errors.tag ? 'border-red-500/60' : 'border-white/10'
                    }`}
                    {...register('tag')}
                  >
                    <option value="">Select category</option>
                    {tags.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                {errors.tag && (
                  <p className="text-xs text-red-400 mt-1">{errors.tag.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" size="lg" loading={loading} className="flex-1">
                Create Course
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </PageLayout>
  )
}
