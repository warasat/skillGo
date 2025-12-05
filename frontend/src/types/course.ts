import type { ModuleResponse } from "../types/module";

export interface CourseRequest {
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  paidStatus: boolean;
  amount?: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  paidStatus: boolean;
  amount: number;
  moduleCount: number;
  modules?: ModuleResponse[];
  category_id: {
    _id: string;
    name: string;
  };

  user_id: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface SingleCourseResponse {
  success: boolean;
  data: {
    _id: string;
    title: string;
    description: string;
    paidStatus: boolean;
    amount: number;
    user_id: {
      _id: string;
      name: string;
      email: string;
    };
    category_id: {
      _id: string;
      name: string;
    };
  };
}
