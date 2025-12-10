import API from "../api";
import API_CONSTANTS from "../apiConstants";

export const getInstructorCoursesCount = async (): Promise<any[]> => {
  const res = await API.get(API_CONSTANTS.dashboard.coursesCount);
  return res.data.data;
};

export const getEnrolledLearnersCount = async (): Promise<number> => {
  const res = await API.get(API_CONSTANTS.dashboard.learnersCount);
  return res.data.data;
};
export const getInstructorCoursesByCategory = async (): Promise<
  { category: string; totalCourses: number }[]
> => {
  const res = await API.get(API_CONSTANTS.dashboard.coursesByCategory);
  return res.data.data;
};
