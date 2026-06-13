import { create } from 'zustand'
import api from '../lib/api'

const useCourseStore = create((set, get) => ({
  courses: [],
  topRated: [],
  currentCourse: null,
  wishlist: [],
  progress: [],
  tags: [],
  isLoading: false,

  // ── Courses ───────────────────────────────────────────────────────────────
  // Server: { sucess, message, data: Course[] }
  fetchCourses: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/courses')
      set({ courses: res.data ?? [] })
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  // Server: { sucess, message, data: Course[] }
  fetchTopRated: async () => {
    const res = await api.get('/courses/top-rated')
    set({ topRated: res.data ?? [] })
    return res.data
  },

  // Server: { sucess, message, data: Course }
  fetchCourseDetails: async (id) => {
    set({ isLoading: true })
    try {
      const res = await api.get(`/courses/${id}`)
      set({ currentCourse: res.data })
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  // Server: { sucess, message, data: Course[] }
  searchCourses: async (params) => {
    set({ isLoading: true })
    try {
      const qs = new URLSearchParams(params).toString()
      const res = await api.get(`/courses/search?${qs}`)
      set({ courses: res.data ?? [] })
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  // Server: { sucess, message, data: Course[] }
  fetchCoursesByTag: async (tagId) => {
    set({ isLoading: true })
    try {
      const res = await api.get(`/courses/tag/${tagId}`)
      set({ courses: res.data ?? [] })
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  // Server: { sucess, message, data: Course[] }
  fetchInstructorCourses: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/courses/instructor')
      set({ courses: res.data ?? [] })
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  // Server: { sucess, message, data: Course[] }
  fetchStudentCourses: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/courses/student')
      set({ courses: res.data ?? [] })
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  // Server: { sucess, message, data: Course }
  createCourse: async (formData) => {
    const res = await api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  // Server: { sucess, message, data: Course }
  updateCourse: async (id, payload) => {
    const res = await api.put(`/courses/${id}`, payload)
    return res.data
  },

  // Server: { sucess, message }
  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}`)
    set((s) => ({ courses: s.courses.filter((c) => c._id !== id) }))
  },

  // Server: { sucess, message, data: Course } — data.active is the new value
  toggleCourse: async (id) => {
    const res = await api.patch(`/courses/${id}/toggle`)
    const newActive = res.data?.active
    set((s) => ({
      courses: s.courses.map((c) =>
        c._id === id
          ? { ...c, active: newActive !== undefined ? newActive : !c.active }
          : c
      ),
    }))
    return res
  },

  // Server: { sucess, message }
  enrollCourse: async (id) => {
    return api.post(`/courses/${id}/enroll`)
  },

  // ── Tags ──────────────────────────────────────────────────────────────────
  // Server: { sucess, message, alltags: Tag[] }  ← key is "alltags" not "data"
  fetchTags: async () => {
    const res = await api.get('/tags')
    set({ tags: res.alltags ?? [] })
    return res.alltags
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────
  // Server: { message, wishlist: { courses: Course[] } }
  fetchWishlist: async () => {
    const res = await api.get('/wishlist')
    set({ wishlist: res.wishlist?.courses ?? [] })
    return res.wishlist
  },

  addToWishlist: async (courseId) => {
    await api.post('/wishlist', { courseId })
    await get().fetchWishlist()
  },

  removeFromWishlist: async (courseId) => {
    await api.delete(`/wishlist/${courseId}`)
    set((s) => ({ wishlist: s.wishlist.filter((c) => c._id !== courseId) }))
  },

  // Server: { isInWishlist: boolean }
  checkWishlist: async (courseId) => {
    const res = await api.get(`/wishlist/check/${courseId}`)
    return res.isInWishlist
  },

  // ── Progress ──────────────────────────────────────────────────────────────
  // Server: { message, progress: CourseProgress[] }
  fetchProgress: async () => {
    const res = await api.get('/progress')
    set({ progress: res.progress ?? [] })
    return res.progress
  },

  // Server: { message, progress: CourseProgress }
  fetchCourseProgress: async (courseId) => {
    const res = await api.get(`/progress/${courseId}`)
    return res.progress
  },

  // Server: { message, progress, progressPercentage }
  updateProgress: async (courseId, subSectionId) => {
    const res = await api.post('/progress/update', { courseId, subSectionId })
    set((s) => ({
      progress: s.progress.map((p) =>
        p.courseId?._id === courseId || p.courseId === courseId
          ? { ...p, progressPercentage: res.progressPercentage ?? p.progressPercentage }
          : p
      ),
    }))
    return res
  },

  // Server: { message }
  resetProgress: async (courseId) => {
    return api.delete(`/progress/${courseId}`)
  },

  // ── Payments ──────────────────────────────────────────────────────────────
  // Server: { message, sessionId, url }
  capturePayment: async (courseId) => {
    return api.post('/payment/capture', { courseId })
  },

  // Server: { message, enrolled: boolean }
  verifyPayment: async (sessionId) => {
    return api.post('/payment/verify', { sessionId })
  },

  // ── Ratings & Reviews ─────────────────────────────────────────────────────
  // Server: { message, ratingAndReview }
  addRating: async (courseId, rating, review) => {
    return api.post('/ratings', { courseId, rating, review })
  },

  // Server: { ratingsAndReviews: [] }
  getCourseRatings: async (courseId) => {
    const res = await api.get(`/ratings/${courseId}`)
    return res.ratingsAndReviews ?? []
  },

  // Server: { message }
  deleteRating: async (courseId) => {
    return api.delete(`/ratings/${courseId}`)
  },

  // ── Sections ──────────────────────────────────────────────────────────────
  // Server: { message, section, course }
  // Note: updateSection reads sectionId + sectionName from req.body (not params)
  createSection: async (courseId, sectionName) => {
    return api.post('/sections', { courseId, sectionName })
  },

  updateSection: async (sectionId, sectionName) => {
    // Server controller reads sectionId from req.body, route param is ignored
    return api.put(`/sections/${sectionId}`, { sectionId, sectionName })
  },

  deleteSection: async (sectionId) => {
    return api.delete(`/sections/${sectionId}`)
  },

  // ── Subsections ───────────────────────────────────────────────────────────
  // Server: { message, subsection }
  createSubSection: async (formData) => {
    return api.post('/subsections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Server controller reads subSectionId from req.body — send it in body too
  updateSubSection: async (subSectionId, formData) => {
    formData.append('subSectionId', subSectionId)
    return api.put(`/subsections/${subSectionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteSubSection: async (sectionId, subSectionId) => {
    return api.delete(`/subsections/${sectionId}/${subSectionId}`)
  },

  // ── Inquiries ─────────────────────────────────────────────────────────────
  submitInquiry: async (courseId, message) => {
    return api.post('/inquiries', { courseId, message })
  },
}))

export default useCourseStore
