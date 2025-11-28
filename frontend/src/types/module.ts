export interface ModuleRequest {
  course_id: string;
  title: string;
  description: string;
}

export interface ModuleResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    course_id: string;
    title: string;
    description: string;
  };
}
