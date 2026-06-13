import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute'

import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import InstructorDashboardPage from './pages/InstructorDashboardPage'
import AdminPage from './pages/AdminPage'
import WishlistPage from './pages/WishlistPage'
import ProfilePage from './pages/ProfilePage'
import LearnPage from './pages/LearnPage'
import CreateCoursePage from './pages/CreateCoursePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#16161f',
            color: '#f4f4f8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#16161f' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#16161f' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Auth */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

        {/* Student */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['student']}><DashboardPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute roles={['student']}><WishlistPage /></ProtectedRoute>} />
        <Route path="/learn/:id" element={<ProtectedRoute roles={['student']}><LearnPage /></ProtectedRoute>} />

        {/* Instructor */}
        <Route path="/instructor/dashboard" element={<ProtectedRoute roles={['instructor']}><InstructorDashboardPage /></ProtectedRoute>} />
        <Route path="/instructor/create-course" element={<ProtectedRoute roles={['instructor']}><CreateCoursePage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />

        {/* Profile – all roles */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
