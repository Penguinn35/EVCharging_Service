import {apiClient} from "@/lib/apiClient";
import { registerType, loginType } from "@/models/user";
import { UserLoginResponse, UserDetailResponse } from "@/type/user";
import { ApiResponse } from "@/type/share";

export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};


export const createUser = async (data: registerType) => {
  const response = await apiClient.post<ApiResponse<Boolean>>("/auth/register", data);
  return response.data;
};

export const login = async (
  data: loginType
): Promise<UserLoginResponse> => {
  const res = await apiClient.post<ApiResponse<UserLoginResponse>>(
    "/auth/login",
    data
  );
  return res.data.responseData;
};

export const getUserById = async (
  userId: string
): Promise<UserDetailResponse> => {
  const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
  "api/client/detail",
  {
    params: { userId },
  }
);
  return response.data.responseData;
}