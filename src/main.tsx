import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/AuthContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Pending from './pages/Pending'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Pending title="Bảng điều khiển" description="Chào mừng đến với bảng điều khiển quản trị CS Helpdesk." />,
      },
      {
        path: 'dashboard',
        element: <Pending title="Bảng điều khiển" description="Tổng quan về hệ thống và thống kê." />,
        children: [
          {
            path: 'today-staff',
            element: <Pending title="Today Staff" description="Thông tin nhân viên làm việc hôm nay." />,
          },
          {
            path: 'today-tickets',
            element: <Pending title="Today Tickets" description="Danh sách ticket được tạo hôm nay." />,
          },
        ],
      },
      {
        path: 'tickets',
        element: <Pending title="Tickets" description="Quản lý tất cả các ticket trong hệ thống." />,
      },
      {
        path: 'customers',
        element: <Pending title="Customers" description="Quản lý thông tin khách hàng." />,
      },
      {
        path: 'performance',
        element: <Pending title="Performance" description="Báo cáo hiệu suất và thống kê." />,
      },
      {
        path: 'report',
        element: <Pending title="Report" description="Các báo cáo chi tiết và xuất dữ liệu." />,
      },
      {
        path: 'settings',
        element: <Pending title="Settings" description="Cài đặt hệ thống và cấu hình." />,
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
