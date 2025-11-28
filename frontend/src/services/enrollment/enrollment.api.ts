import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type { EnrollmentRequest } from "../../types/enrollment";

// Enroll a learner into a course
export const enrollCourse = async (
  courseId: string
): Promise<EnrollmentRequest> => {
  const response = await API.post(
    `${API_CONSTANTS.enrollment.enroll}/${courseId}`,
    {}
  );
  console.log(" enrollCourse response:", response.data);
  return response.data.data;
};
// Get all courses the learner is enrolled in
export const getMyCourses = async (): Promise<EnrollmentRequest[]> => {
  const response = await API.get(API_CONSTANTS.enrollment.myEnrollments);
  console.log(" getMyCourses response:", response.data);
  return response.data.data;
};
