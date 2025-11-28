import CONSTANTS from "../constants/constants";
import type { User } from "../types/user";

// create a method to setItem in local storage
export const setTokenInLocalStorage = (token: any) => {
  localStorage.setItem(CONSTANTS.token_key.name, token);
};

// create a method to getitem from local storage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem(CONSTANTS.token_key.name);
};

// create a method to remove token from local storage
export const removeTokenFromLocalStorage = () => {
  return localStorage.removeItem(CONSTANTS.token_key.name);
};

//Initials of user name
export const getUserInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "H";

  const trimmedName = name.trim();
  if (trimmedName.length === 0) return "H";

  const initials = trimmedName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials || "H";
};

export const getUserFromLocalStorage = (): User | null => {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
};
