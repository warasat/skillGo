import API from "../api";
import API_CONSTANTS from "../apiConstants";

export interface AdminDashboardStats {
  totalInstructors: number;
  totalLearners: number;
  totalCourses: number;
}

export interface UserStatsByDate {
  date: string;
  total: number;
}

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const res = await API.get(API_CONSTANTS.adminDashboard.dashboardStats);
    return res.data.data;
  };
export const getUserStatsByDate = async (): Promise<UserStatsByDate[]> => {
  const res = await API.get(API_CONSTANTS.adminDashboard.userStats);
  return res.data.data;
};
