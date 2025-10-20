import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    )
  }


  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Nếu đã đăng nhập và đang ở /logout, redirect về /
  if (location.pathname === '/logout') {
    console.log("Redirecting to /");
    return <Navigate to="/" replace />
  }

  console.log("Authenticated, rendering children");
  return <>{children}</>
}



