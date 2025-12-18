interface UserRole {
  _id: string;
  identifier: number;
  role: "admin" | "instructor" | "learner" | "sub-admin";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  permissions: string[];
  roleUpdatedAt: string;

  createdAt: string;
}
