import {apiClient, publicApiClient} from "@/lib/apiClient";
import { registerType, loginType } from "@/models/user";
import { UserLoginResponse, UserDetailResponse } from "@/type/user";
import { ApiResponse } from "@/type/share";

export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};


export const createUser = async (data: registerType) => {
  const response = await publicApiClient.post<ApiResponse<Boolean>>("/auth/register", data);
  return response.data;
};

export const login = async (
  data: loginType
): Promise<UserLoginResponse> => {
  const res = await publicApiClient.post<ApiResponse<UserLoginResponse>>(
    "/auth/login",
    data
  );
  return res.data.responseData;
};

export const getUserDetails = async (
): Promise<UserDetailResponse> => {
  const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
  "api/users/profile"
);
  return response.data.responseData;
}