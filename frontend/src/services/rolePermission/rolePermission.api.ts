import API from "../api";
import type { RolePermission } from "../../types/rolePermission";

export const getAllRolePermissions = async (): Promise<RolePermission[]> => {
  const response = await API.get("/role-management");
  return response.data.data;
};

export const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[]
): Promise<RolePermission> => {
  const response = await API.post("/role-management", {
    roleId,
    permissionIds,
  });
  return response.data.data;
};

export const deleteRolePermissions = async (
  roleId: string
): Promise<RolePermission> => {
  const response = await API.delete(`/role-management/${roleId}`);
  return response.data.data;
};
