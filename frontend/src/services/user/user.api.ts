import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type { User } from "../../types/user";

export const getUserProfile = async (): Promise<User> => {
  const response = await API.get(API_CONSTANTS.auth.me);
  return response.data.data;
};
