import apiClient from "@/lib/apiClient";
import { registerType, loginType } from "@/models/user";

export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const createUser = async (data: registerType) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const login = async (data: loginType) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};