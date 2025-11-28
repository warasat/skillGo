import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type { CategoryResponse } from "../../types/category";

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  const response = await API.get(API_CONSTANTS.category.getAll);
  return response.data.data;
};
