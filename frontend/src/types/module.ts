export interface ModuleRequest {
  course_id: string;
  title: string;
  description: string;
}

export interface ModuleResponse {
  _id: string;
  course_id: string;
  title: string;
  description: string;
}
