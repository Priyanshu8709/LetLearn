import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user?.accountType)) {
    // Redirect to the user's own dashboard instead of a 403
    const fallback =
      user?.accountType === 'admin' ? '/admin'
      : user?.accountType === 'instructor' ? '/instructor/dashboard'
      : '/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated()) {
    const redirect =
      user?.accountType === 'admin' ? '/admin'
      : user?.accountType === 'instructor' ? '/instructor/dashboard'
      : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}
