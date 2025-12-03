import CONSTANTS from "../constants/constants";
import type { User, UserRole } from "../types/user";

// Token helpers
export const setTokenInLocalStorage = (token: any) => {
  localStorage.setItem(CONSTANTS.token_key.name, token);
};

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem(CONSTANTS.token_key.name);
};

export const removeTokenFromLocalStorage = () => {
  return localStorage.removeItem(CONSTANTS.token_key.name);
};

// Initials of user name
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

// Get user from local storage safely

const ROLE_MAP: Record<string, UserRole> = {
  admin: { identifier: 1, role: "admin" },
  instructor: { identifier: 2, role: "instructor" },
  learner: { identifier: 3, role: "learner" },
};

export const getUserFromLocalStorage = (): User | null => {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const rawUser = JSON.parse(userData);

    let normalizedRole: UserRole;

    if (typeof rawUser.role === "string") {
      normalizedRole = ROLE_MAP[rawUser.role.toLowerCase()] || ROLE_MAP.learner;
    } else if (
      rawUser.role &&
      typeof rawUser.role === "object" &&
      "role" in rawUser.role &&
      "identifier" in rawUser.role
    ) {
      normalizedRole = rawUser.role as UserRole;
    } else {
      // fallback
      normalizedRole = ROLE_MAP.learner;
    }

    return {
      name: rawUser.name,
      email: rawUser.email,
      role: normalizedRole,
    };
  } catch {
    return null;
  }
};
