import API from "../api";

export const createRole = async (roleName: string) => {
  const response = await API.post("/admin/roles", { role: roleName });
  return response.data.data;
};

export const getAllRoles = async () => {
  const response = await API.get("/admin/roles");
  return response.data.data;
};
