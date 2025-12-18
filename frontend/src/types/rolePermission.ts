import type { Role } from "./role";
import type { PermissionPolicy } from "./permission";

export interface RolePermission {
  _id: string;
  roleId: Role;
  permissionIds: PermissionPolicy[];
}
