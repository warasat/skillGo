import { getUserFromLocalStorage } from "./utils";

export const hasPermission = (permissionKey: string): boolean => {
  const user = getUserFromLocalStorage();
  console.log("Current logged-in user:", getUserFromLocalStorage());

  return user?.permissions?.includes(permissionKey) ?? false;
};
