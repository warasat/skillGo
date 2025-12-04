export interface Lesson {
  _id: string;
  module_id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonResponseSingle {
  success: boolean;
  message: string;
  data: Lesson;
}

export interface LessonResponseArray {
  success: boolean;
  message: string;
  data: Lesson[];
}
