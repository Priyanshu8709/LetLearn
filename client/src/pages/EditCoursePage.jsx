import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Tag as TagIcon, DollarSign, FileText, BookOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import PageLayout from '../components/layout/PageLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import useCourseStore from '../store/courseStore'

const schema = z.object({
  courseName:        z.string().min(5, 'Course name must be at least 5 characters'),
  courseDescription: z.string().min(20, 'Description must be at least 20 characters'),
  whatYouwillLearn:  z.string().min(10, 'Required'),
  price:             z.coerce.number().min(0, 'Price must be 0 or more'),
  tag:               z.string().optional(),
})

export default function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tags, fetchTags, fetchCourseDetails, currentCourse, updateCourse, createSection, createSubSection } = useCourseStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sectionName, setSectionName] = useState('')
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [showSubsectionForm, setShowSubsectionForm] = useState(null)
  const [subsectionForms, setSubsectionForms] = useState({})
  const [subsectionUploading, setSubsectionUploading] = useState({})

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      courseName: '',
      courseDescription: '',
      whatYouwillLearn: '',
      price: 0,
      tag: '',
    },
  })

  useEffect(() => {
    if (!id) return

    Promise.all([fetchCourseDetails(id), fetchTags()])
      .then(([course]) => {
        if (course) {
          reset({
            courseName: course.courseName || '',
            courseDescription: course.courseDescription || '',
            whatYouwillLearn: course.whatYouWillLearn || '',
            price: course.price ?? 0,
            tag: course.tag?._id || course.tag || '',
          })
        }
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }, [id, fetchCourseDetails, fetchTags, reset])

  const onSubmit = async (data) => {
    if (!id) return

    try {
      setIsSubmitting(true)
      const payload = {
        courseName: data.courseName,
        courseDescription: data.courseDescription,
        whatYouwillLearn: data.whatYouwillLearn,
        price: data.price,
      }
      if (data.tag) {
        payload.tag = data.tag
      }
      await updateCourse(id, payload)
      toast.success('Course updated successfully')
      await fetchCourseDetails(id)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSection = async () => {
    if (!sectionName.trim()) {
      toast.error('Enter a section name')
      return
    }
    if (!id) return

    try {
      setIsAddingSection(true)
      await createSection(id, sectionName.trim())
      setSectionName('')
      toast.success('Section added successfully')
      await fetchCourseDetails(id)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsAddingSection(false)
    }
  }

  const handleSubsectionChange = (sectionId, field, value) => {
    setSubsectionForms((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }))
  }

  const handleCreateSubsection = async (sectionId) => {
    const form = subsectionForms[sectionId] ?? {}
    if (!form.title?.trim() || !form.timeDuration?.trim() || !form.description?.trim() || !form.videoFile) {
      toast.error('Please complete all subsection fields and upload a video')
      return
    }

    try {
      setSubsectionUploading((prev) => ({ ...prev, [sectionId]: true }))
      const formData = new FormData()
      formData.append('sectionId', sectionId)
      formData.append('title', form.title.trim())
      formData.append('timeDuration', form.timeDuration.trim())
      formData.append('description', form.description.trim())
      formData.append('videoFile', form.videoFile)

      await createSubSection(formData)
      setSubsectionForms((prev) => ({
        ...prev,
        [sectionId]: { title: '', timeDuration: '', description: '', videoFile: null },
      }))
      toast.success('Lesson added successfully')
      await fetchCourseDetails(id)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubsectionUploading((prev) => ({ ...prev, [sectionId]: false }))
    }
  }

  if (!currentCourse) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-2xl bg-surface-2 border border-white/6 p-10">
            <div className="h-8 w-3/4 bg-surface-3 rounded-xl animate-pulse" />
            <div className="mt-6 grid gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-12 bg-surface-3 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  const sections = currentCourse.sections ?? []

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Course</h1>
            <p className="text-white/50 text-sm">Update course details and manage sections</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-surface-2 border border-white/6 p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <label className="text-sm font-medium text-white/70 block mb-1.5">What Will Students Learn?</label>
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
                    <TagIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <select
                      className={`w-full rounded-xl bg-white/5 border pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-brand-500/50 transition-all appearance-none ${
                        errors.tag ? 'border-red-500/60' : 'border-white/10'
                      }`}
                      {...register('tag')}
                    >
                      <option value="">No category</option>
                      {tags.map((tag) => (
                        <option key={tag._id} value={tag._id}>{tag.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.tag && (
                    <p className="text-xs text-red-400 mt-1">{errors.tag.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => navigate('/instructor/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" size="lg" loading={isSubmitting}>
                  Save Course
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-surface-2 border border-white/6 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Course Sections</h2>
                <p className="text-white/50 text-sm">Add or review course sections here.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {sections.length === 0 ? (
                <div className="rounded-2xl bg-surface-3 p-4 text-sm text-white/60">
                  No sections found yet. Add one to start building your course.
                </div>
              ) : (
                sections.map((section, index) => {
                  const form = subsectionForms[section._id] || {}
                  const isOpen = showSubsectionForm === section._id

                  return (
                    <div key={section._id ?? index} className="rounded-2xl bg-surface-3 p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div>
                          <p className="font-semibold text-white">{section.sectionTitle || section.sectionName}</p>
                          <p className="text-xs text-white/50">{(section.subSections?.length ?? 0)} lessons</p>
                        </div>
                        <Badge variant="secondary">Section {index + 1}</Badge>
                      </div>

                      {section.subSections?.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {section.subSections.map((sub) => (
                            <div key={sub._id} className="rounded-2xl bg-surface-2 p-3 border border-white/10 text-sm text-white/70">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-medium text-white">{sub.title}</p>
                                  <p className="text-xs text-white/40">{sub.timeDuration}</p>
                                </div>
                                <span className="text-xs text-white/50">Lesson</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowSubsectionForm((prev) => (prev === section._id ? null : section._id))}
                        className="inline-flex items-center justify-center w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                      >
                        {isOpen ? 'Hide lesson form' : 'Add a lesson'}
                      </button>

                      {isOpen && (
                        <div className="mt-4 space-y-3 rounded-2xl bg-surface-2 p-4 border border-white/10">
                          <Input
                            label="Lesson title"
                            placeholder="e.g. Getting started with hooks"
                            value={form.title || ''}
                            onChange={(e) => handleSubsectionChange(section._id, 'title', e.target.value)}
                          />
                          <Input
                            label="Duration"
                            placeholder="e.g. 12 min"
                            value={form.timeDuration || ''}
                            onChange={(e) => handleSubsectionChange(section._id, 'timeDuration', e.target.value)}
                          />
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/70">Description</label>
                            <textarea
                              rows={3}
                              value={form.description || ''}
                              onChange={(e) => handleSubsectionChange(section._id, 'description', e.target.value)}
                              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 transition-all resize-none"
                              placeholder="Add a short lesson summary"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/70">Video file</label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleSubsectionChange(section._id, 'videoFile', e.target.files?.[0] ?? null)}
                              className="text-sm text-white"
                            />
                            {form.videoFile && (
                              <p className="text-xs text-white/50">Selected: {form.videoFile.name}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="gradient"
                            size="lg"
                            loading={subsectionUploading[section._id]}
                            onClick={() => handleCreateSubsection(section._id)}
                          >
                            Save Lesson
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            <div className="space-y-3">
              <Input
                label="New section name"
                placeholder="e.g. Introduction to React"
                icon={<BookOpen size={15} />}
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />
              <Button
                type="button"
                variant="gradient"
                size="lg"
                loading={isAddingSection}
                onClick={handleAddSection}
              >
                Add Section
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
