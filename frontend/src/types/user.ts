interface UserRole {
  _id: string;
  identifier: number;
  role: "admin" | "instructor" | "learner" | "sub-admin";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole; // <-- object now
  status: "active" | "inactive";
  createdAt: string;
}
