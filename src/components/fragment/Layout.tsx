import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {
  // useEffect(() => {
  //   // Check if login.css is already appended
  //   if (!document.querySelector('link[href="/css/style.css"]')) {
  //     const link = document.createElement('link');
  //     link.rel = 'stylesheet';
  //     link.href = '/css/style.css';
  //     document.head.appendChild(link);
  //   }
  // }, []);

  return (
    <>
      {/* <link rel="stylesheet" href="/css/style.css"/> */}
      <div className="page-content">
        <Header />
        <Sidebar />
        <Outlet />
        <Footer />
      </div>
    </>
    
  )
}


export default Layout

