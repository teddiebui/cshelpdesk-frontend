import { useAuth } from '../../auth/AuthContext'

const Header = () => {
    const { user, logout } = useAuth()
    
    const setLanguage = (_language: string) => {
        console.log("setLanguage: not implemented");
        alert("not implemented");
    }
    
    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }
    return (
        <>
            {/* <!-- Header --> */}
            <header className="page-header">
                <div className="header-left">
                    <button className="btn-toggle-sidebar d-lg-none" id="showSidebar">
                        <i className="bi bi-list"></i>
                    </button>
                    <h2>Bảng Điều Khiển</h2>
                </div>
                <div className="header-right">
                    <div className="date-time">
                        <i className="bi bi-calendar3"></i>
                        <span id="currentDate">--/--/----</span>
                    </div>
                    <div className="status-dropdown dropdown">
                        <button className="dropdown-toggle" type="button" id="statusDropdown" aria-expanded="false" data-bs-toggle="dropdown">
                            <span className="status-indicator online"></span>
                            <span id="currentStatusText">Online</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="statusDropdown">
                            <li><a className="dropdown-item" href="#" data-status-id="1">Online</a></li>
                            <li><a className="dropdown-item" href="#" data-status-id="2">Away</a></li>
                        </ul>
                    </div>


                    <div className="language-dropdown dropdown">
                        <button className="dropdown-toggle" type="button" id="languageDropdown" aria-expanded="false" data-bs-toggle="dropdown">
                            <span id="currentLanguage">VI</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                            <li><a className="dropdown-item" href="#" onClick={() => setLanguage('VI')}>VI</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => setLanguage('EN')}>EN</a></li>
                        </ul>
                    </div>



                    <div className="user-dropdown dropdown">
                        <button className="dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            <img src="/img/profile-placeholder.jpg" alt="User Avatar" className="user-avatar" />
                            <span className="user-name">{user?.name || 'User'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><a className="dropdown-item" href="#" id="user-profile-button"><i className="bi bi-person"></i>
                                Hồ sơ</a></li>
                            <li><a className="dropdown-item" href="#" id="setting-button"><i className="bi bi-gear"></i> Cài
                                đặt</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="#" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Đăng
                                xuất</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header