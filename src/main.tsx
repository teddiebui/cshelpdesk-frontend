import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../public/css/index.css'
import { AuthProvider } from './auth/AuthContext'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/fragment/Layout'
import Pending from './pages/Pending'
import TodayStaff from './pages/TodayStaff'
import TodayTicket from './pages/TodayTicket'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/today-staff" replace />,
      },
      {
        path: 'today-staff',
        element: <TodayStaff />,
      },
      {
        path: 'today-ticket',
        element: <TodayTicket />,
      },
      {
        path: 'tickets',
        element: <Pending />,
      },
      {
        path: 'customers',
        element: <Pending />,
      },
      {
        path: 'performance',
        element: <Pending />,
      },
      {
        path: 'report',
        element: <Pending />,
      },
      {
        path: 'settings',
        element: <Pending />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          fontSize: '18px'
        }}>
          <h1>404 - Trang không tồn tại</h1>
          <p>Trang bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </ProtectedRoute>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
