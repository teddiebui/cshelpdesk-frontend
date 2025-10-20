import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ApiResponse, AuthenticatedUserInfo } from '../api/types'
import { API_ENDPOINTS, apiClient } from '../api/client'

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthenticatedUserInfo | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: object | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthenticatedUserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiResponse | null>(null)

  // Hàm xử lý session cleanup khi JSESSIONID không hợp lệ
  const handleSessionExpired = () => {
    // Clear local state (JSESSIONID sẽ tự động bị xóa khi không có session trên server)
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  // Hàm gọi API để lấy thông tin user
  const me = async (): Promise<AuthenticatedUserInfo> => {
    const response = await apiClient.get<AuthenticatedUserInfo>(API_ENDPOINTS.auth.me, undefined, { retry: false })
    if (response.httpCode == 200) {
      return response.data
    }
    throw new Error(response.message)
  }

  useEffect(() => {
    // Kiểm tra session khi app khởi động
    const checkSession = async () => {
      try {
        const userInfo = await me()
        setUser(userInfo)
        console.log('User info:', userInfo);
        setIsAuthenticated(true)
      } catch (error: unknown) {
        // fetchUserInfo đã tự động clear state nếu là lỗi 401
        setIsAuthenticated(false);
        console.log('Error:', error);
        console.log('Session expired, redirecting to login');
        
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(API_ENDPOINTS.auth.login, { username, password }, undefined, { retry: false })
      if (response.httpCode == 200) {
        const userInfo = await me()
        setUser(userInfo)
        setIsAuthenticated(true);
      } else {
        setError(response);
        throw new Error(response.message);
      }
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Gọi logout API để invalidate session trên server (không retry)
      await apiClient.get(API_ENDPOINTS.auth.logout, undefined, { retry: false })
    } catch (err) {
      console.error('Logout API call failed:', err)
    } finally {
      // Luôn clear local state
      handleSessionExpired()
      window.location.href = '/login?logout=true';
    }
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
