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
  category_id: string;
  user_id: string;
}
