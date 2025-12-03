import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type { ModuleRequest, ModuleResponse } from "../../types/module";

export const createModule = async (
  payload: ModuleRequest
): Promise<ModuleResponse> => {
  const response = await API.post(API_CONSTANTS.module.create, payload);
  console.log(" Module created:", response.data);
  return response.data.data;
};

export const getModulesByCourse = async (
  courseId: string
): Promise<ModuleResponse[]> => {
  const res = await API.get(`/modules/${courseId}`);
  return res.data.data;
};
