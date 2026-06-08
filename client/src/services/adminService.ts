import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/type/share";

export type AdminEnterprise = {
  companyId: string;
  companyName: string;
  companyAddress: string;
  taxCode: string;
  logoUrl: string | null;
  isVerified: boolean;
  managerFullName: string;
  managerEmail: string;
  managerAddress: string;
};

export const getAdminEnterprises = async (): Promise<AdminEnterprise[]> => {
  const response = await apiClient.get<ApiResponse<AdminEnterprise[]>>(
    "/api/admin/cpos",
  );

  return response.data.responseData;
};

export const verifyAdminEnterprise = async (
  enterpriseId: string,
): Promise<boolean> => {
  const response = await apiClient.put<ApiResponse<boolean>>(
    `/api/admin/cpo/${enterpriseId}/verification`,
  );

  return response.data.responseData;
};

export const disableAdminEnterprise = async (
  enterpriseId: string,
): Promise<boolean> => {
  const response = await apiClient.put<ApiResponse<boolean>>(
    `/api/admin/cpo/${enterpriseId}/disable`,
  );

  return response.data.responseData;
};

export const deleteAdminEnterprise = async (
  enterpriseId: string,
): Promise<boolean> => {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    `/api/admin/cpo/${enterpriseId}`,
  );

  return response.data.responseData;
};
