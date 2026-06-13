import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      // ── Auth ───────────────────────────────────────────────────────────────
      sendOtp: async (email) => {
        return api.post('/auth/send-otp', { email })
      },

      signup: async ({ firstname, lastname, email, password, otp, accountType }) => {
        return api.post('/auth/signup', { firstname, lastname, email, password, otp, accountType })
      },

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await api.post('/auth/login', { email, password })
          localStorage.setItem('ll_token', data.token)
          set({ user: data.user, token: data.token })
          return data
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('ll_token')
        set({ user: null, token: null })
      },

      changePassword: async (email, oldPassword, newPassword) => {
        return api.post('/auth/change-password', { email, oldPassword, newPassword })
      },

      // ── Reset password ─────────────────────────────────────────────────────
      requestPasswordReset: async (email) => {
        return api.post('/reset-password', { email })
      },

      updatePassword: async (token, newPassword) => {
        return api.post('/reset-password/update', { token, newPassword })
      },

      // ── Profile ───────────────────────────────────────────────────────────
      getProfile: async () => {
        return api.get('/profile')
      },

      updateProfile: async ({ gender, dob, about, contactNumber }) => {
        const data = await api.put('/profile', { gender, dob, about, contactNumber })
        return data
      },

      deleteAccount: async () => {
        await api.delete('/profile')
        localStorage.removeItem('ll_token')
        set({ user: null, token: null })
      },

      // ── Helpers ────────────────────────────────────────────────────────────
      isAuthenticated: () => !!get().token,
      isStudent:    () => get().user?.accountType === 'student',
      isInstructor: () => get().user?.accountType === 'instructor',
      isAdmin:      () => get().user?.accountType === 'admin',
    }),
    {
      name: 'letlearn-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
)

export default useAuthStore
