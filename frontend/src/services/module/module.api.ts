import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type { ModuleRequest, ModuleResponse } from "../../types/module";

export const createModule = async (
  payload: ModuleRequest
): Promise<{
  _id: string;
  course_id: string;
  title: string;
  description: string;
}> => {
  const response = await API.post(API_CONSTANTS.module.create, payload);
  return response.data.data;
};
export const getModulesByCourse = async (
  courseId: string
): Promise<ModuleResponse[]> => {
  const res = await API.get(`/modules/${courseId}`);
  return res.data.data;
};
export const deleteModule = async (moduleId: string) => {
  const res = await API.delete(`/modules/${moduleId}`);
  return res.data;
};

export const updateModule = async (
  moduleId: string,
  payload: { title: string; description: string }
) => {
  const res = await API.patch(`/modules/${moduleId}`, payload);
  return res.data.data;
};
