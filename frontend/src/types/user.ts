export interface UserRole {
  identifier: number;
  role: "admin" | "instructor" | "learner";
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
}
