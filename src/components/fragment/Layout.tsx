import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {

  return (
    <>
      <link rel="stylesheet" href="/css/style.css" />
      <div className="page-content">
        <Header />
        <Sidebar />
        <Outlet />
        <Footer />
      </div>
    </>
    
  )
}

function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    '/': 'Bảng điều khiển',
    '/today-staff': 'Bảng điều khiển',
    '/today-ticket': 'Bảng điều khiển',
    '/tickets': 'Quản lý Ticket',
    '/customers': 'Khách hàng',
    '/performance': 'Hiệu suất',
    '/reports': 'Báo cáo',
    '/settings': 'Cài đặt'
  }
  
  return titles[pathname] || 'Admin Dashboard'
}

export default Layout

