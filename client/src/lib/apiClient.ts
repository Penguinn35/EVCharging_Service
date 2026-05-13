import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useUserStore } from "@/store/useUserStore";

export type ApiError = {
  message: string;
  status?: number;
};

export const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useUserStore.getState().user.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    let apiError: ApiError = {
      message: "Something went wrong",
    };

    if (error.response) {
      apiError = {
        message: "Request failed",
        status: error.response.status,
      };

      if (error.response.status === 401) {
        useUserStore.getState().clearUser();
        console.log("token invalid or expired, cleared user information");
      }
    } else if (error.request) {
      apiError = {
        message: "Network error",
      };
    }

    return Promise.reject(apiError);
  }
);
