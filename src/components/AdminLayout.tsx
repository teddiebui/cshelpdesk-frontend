import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <h1>Hello</h1>
    </>
  )
}

function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    '/': 'Bảng điều khiển',
    '/dashboard': 'Bảng điều khiển',
    '/tickets': 'Tickets',
    '/customers': 'Customers',
    '/performance': 'Performance',
    '/report': 'Report',
    '/settings': 'Settings'
  }
  
  return titles[pathname] || 'Admin Dashboard'
}

export default AdminLayout

