import API from "../api";
export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
};

export const getAllUsers = async () => {
  const response = await API.get("/admin/users");

  return response.data.data;
};

export const deleteUserById = async (userId: string) => {
  const response = await API.delete(`/admin/users/${userId}`);
  return response.data.data;
};
export const updateUserStatus = async (
  userId: string,
  status: "active" | "inactive"
) => {
  const response = await API.patch(`/admin/users/${userId}/status`, { status });
  return response.data.data;
};
export const updateUserRole = async (
  userId: string,
  roleId: string
): Promise<User> => {
  const response = await API.patch(`/admin/users/${userId}/role`, { roleId });
  return response.data.data;
};
