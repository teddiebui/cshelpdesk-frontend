import { type ReactNode } from 'react'
import { usePermissions } from '../hooks/usePermissions'

interface PermissionGuardProps {
  children: ReactNode
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  groupCode?: string
  fallback?: ReactNode
}

export default function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  groupCode,
  fallback = null
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isInGroup } = usePermissions()

  // Kiểm tra group code trước
  if (groupCode && !isInGroup(groupCode)) {
    return <>{fallback}</>
  }

  // Kiểm tra permission đơn lẻ
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Kiểm tra danh sách permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    
    if (!hasRequiredPermissions) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}



