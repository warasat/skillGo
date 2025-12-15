import axios, { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getTokenFromLocalStorage } from "../utils/utils";

export const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

// Request interceptor
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);
    headers.set("Authorization", "Bearer " + token);
    config.headers = headers;
  }
  return config;
});

//  Response interceptor for handling inactive accounts
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Check if user is inactive or unauthorized
    if (status === 401 && message?.includes("deactivated")) {
      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
