import API from "../api";
import type { PermissionPolicy } from "../../types/permission";

//  Create Permission Policy
export const createPermissionPolicy = async (
  title: string,
  description: string,
  permissions: string[]
): Promise<PermissionPolicy> => {
  const response = await API.post("/permissions", {
    title,
    description,
    permissions,
  });
  return response.data.data;
};

// Get All Permission Policies
export const getAllPermissionPolicies = async (): Promise<
  PermissionPolicy[]
> => {
  const response = await API.get("/permissions");
  return response.data.data;
};

// Delete Permission Policy
export const deletePermissionPolicy = async (
  id: string
): Promise<PermissionPolicy> => {
  const response = await API.delete(`/permissions/${id}`);
  return response.data.data;
};
// ✅ Update Permission Policy
export const updatePermissionPolicy = async (
  id: string,
  title: string,
  description: string,
  permissions: string[]
): Promise<PermissionPolicy> => {
  const response = await API.put(`/permissions/${id}`, {
    title,
    description,
    permissions,
  });
  return response.data.data;
};
