import { useAuth } from "../auth/AuthContext";

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permissionName: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.some(
      (permission) => permission.name === permissionName
    );
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissionNames.some((permissionName) =>
      hasPermission(permissionName)
    );
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissionNames.every((permissionName) =>
      hasPermission(permissionName)
    );
  };

  const getUserGroup = () => {
    return user?.userGroup || null;
  };

  const isInGroup = (groupCode: string): boolean => {
    return user?.userGroup?.code === groupCode;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserGroup,
    isInGroup,
    permissions: user?.permissions || [],
    userGroup: user?.userGroup || null,
  };
}



