import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type {
  CourseRequest,
  Course,
  SingleCourseResponse,
} from "../../types/course";

export const createCourse = async (payload: CourseRequest): Promise<Course> => {
  const response = await API.post(API_CONSTANTS.course.create, payload);
  return response.data.data;
};
export const getAllCourse = async (): Promise<Course[]> => {
  const response = await API.get(API_CONSTANTS.course.read);
  return response.data.data;
};
export const getCourseById = async (
  courseId: string
): Promise<SingleCourseResponse> => {
  const response = await API.get(`${API_CONSTANTS.course.read}/${courseId}`);
  console.log("📦 Course by ID:", response.data.data);
  return response.data;
};
export const getInstructorCourses = async (): Promise<Course[]> => {
  const response = await API.get(API_CONSTANTS.course.instructorCourse);
  return response.data.data;
};
