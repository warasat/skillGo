export interface EnrollmentRequest {
  _id: string;
  user_id: string;
  course_id: string;
  payment_id?: string | null;
  status: "enrolled" | "completed" | "dropped";
  enrolledAt: string;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: EnrollmentRequest[];
}
