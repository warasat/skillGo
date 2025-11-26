import type { AxiosResponse } from "axios";
import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type {
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthLoginRequest,
  AuthLoginResponse,
} from "../../types/auth";

export const register = async (
  payload: AuthRegisterRequest | null
): Promise<AxiosResponse<AuthRegisterResponse>> => {
  return API.post(API_CONSTANTS.auth.register, payload);
};

export const login = async (
  payload: AuthLoginRequest | null
): Promise<AxiosResponse<AuthLoginResponse>> => {
  return API.post(API_CONSTANTS.auth.login, payload);
};
