import axios, { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { getTokenFromLocalStorage } from "../utils/utils";
export const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);
    headers.set("Authorization", "Bearer" + token);
    config.headers = headers;
  }
  return config;
});

export default API;
