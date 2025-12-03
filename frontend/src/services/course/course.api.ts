import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type {
  CourseRequest,
  Course,
  SingleCourseResponse,
} from "../../types/course";
import { getTokenFromLocalStorage } from "../../utils/utils";

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
export const getAvailableCourses = async () => {
  const token = getTokenFromLocalStorage();
  const res = await API.get("/courses/available", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
export const deleteCourse = async (courseId: string) => {
  const res = await API.delete(`/courses/${courseId}`);
  return res.data;
};
export const updateCourse = async (
  courseId: string,
  payload: CourseRequest
): Promise<Course> => {
  const token = getTokenFromLocalStorage();

  const res = await API.patch(`/courses/${courseId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};
