import { PermissionsType } from "../enums/role.enum";
import { RolesPermissions } from "./role-permission";
import { UnauthorizedException } from "./appError";

export const roleGuard = (
  role: keyof typeof RolesPermissions,
  requiredPermission: PermissionsType[]
) => {
  const permissions = RolesPermissions[role];
  // if the role doesn't exist or lack requiredd permission

  const hasPermission = requiredPermission.every((permissions) => permissions.includes(permissions));

  if (!hasPermission) {
    throw new UnauthorizedException("You dont have the necesssary permissions to perform this workspace");
  }
};

export default roleGuard;