"use client";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiImage,
  FiKey,
  FiLoader,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiSave,
  FiUpload,
  FiUser,
  FiHelpCircle,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  getEnterpriseProfile,
  updateBusinessImage,
  updateBusinessProfile,
  type UpdateBusinessProfileRequest,
} from "@/services/enterpriseService";
import { useEnterpriseStore } from "@/store/useEnterpriseStore";
import { useUserStore } from "@/store/useUserStore";
import { ApiError } from "@/lib/apiClient";

const LOGO_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%236b7280' font-family='Arial,sans-serif' font-size='26'%3ENo Logo%3C/text%3E%3C/svg%3E";

export function EnterpriseProfile() {
  const router = useRouter();
  const enterprise = useEnterpriseStore((state) => state.enterprise);
  const updateEnterprise = useEnterpriseStore((state) => state.updateEnterprise);
  const clearEnterprise = useEnterpriseStore((state) => state.clearEnterprise);
  const clearUser = useUserStore((state) => state.clearUser);

  const [formData, setFormData] = useState<UpdateBusinessProfileRequest>({
    companyName: enterprise.companyName ?? "",
    companyAddress: enterprise.companyAddress ?? "",
    taxCode: enterprise.taxCode ?? "",
    managerFullName: enterprise.managerFullName ?? "",
    managerEmail: enterprise.managerEmail ?? "",
    managerAddress: enterprise.managerAddress ?? "",
    serverUrl: enterprise.serverUrl ?? "",
    token: enterprise.token ?? "",
  });
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  useEffect(() => {
    const loadEnterpriseProfile = async () => {
      setIsLoading(true);

      try {
        const profile = await getEnterpriseProfile();
        updateEnterprise(profile);
        setFormData({
          companyName: profile.companyName ?? "",
          companyAddress: profile.companyAddress ?? "",
          taxCode: profile.taxCode ?? "",
          managerFullName: profile.managerFullName ?? "",
          managerEmail: profile.managerEmail ?? "",
          managerAddress: profile.managerAddress ?? "",
          serverUrl: profile.serverUrl ?? "",
          token: profile.token ?? "",
        });
      } catch {
        toast.error("Không thể tải thông tin doanh nghiệp.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEnterpriseProfile();
  }, [updateEnterprise]);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const handleInputChange =
    (field: keyof UpdateBusinessProfileRequest) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }

    const nextPreview = URL.createObjectURL(file);
    setSelectedLogoFile(file);
    setLogoPreviewUrl(nextPreview);
  };

  const handleSaveLogo = async () => {
    if (!selectedLogoFile) return;

    setIsSavingLogo(true);

    try {
      const isSuccess = await updateBusinessImage(selectedLogoFile);
      if (!isSuccess) {
        throw new Error("Update logo failed");
      }

      const profile = await getEnterpriseProfile();
      updateEnterprise(profile);
      setSelectedLogoFile(null);
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
      setLogoPreviewUrl(null);
      toast.success("Cập nhật logo thành công.");
    } catch {
      toast.error("Không thể cập nhật logo doanh nghiệp.");
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);

    try {
      const updatedProfile = await updateBusinessProfile(formData);
      updateEnterprise({
        ...updatedProfile,
      });
      toast.success("Đã lưu thông tin doanh nghiệp.");
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 403) {
        toast.error("Không có quyền cập nhật hồ sơ doanh nghiệp (403). Vui lòng đăng nhập lại tài khoản BUSINESS.");
      } else {
        toast.error("Không thể lưu thông tin doanh nghiệp.");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogoError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = LOGO_FALLBACK;
  };

  const displayLogo = logoPreviewUrl || enterprise.logoUrl || LOGO_FALLBACK;
  const verificationConfig = enterprise.isVerified
    ? {
        label: "Đã xác minh",
        className: "bg-green-100 text-green-700 border-green-200",
        tooltipBg: "bg-green-50 border-green-200 text-green-800",
        arrowBg: "bg-green-50 border-green-200",
        icon: FiCheckCircle,
      }
    : {
        label: "Chưa xác minh",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        tooltipBg: "bg-amber-50 border-amber-200 text-amber-800",
        arrowBg: "bg-amber-50 border-amber-200",
        icon: FiClock,
      };
  const VerificationIcon = verificationConfig.icon;

  const handleLogout = () => {
    clearUser();
    clearEnterprise();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <FiLoader className="h-4 w-4 animate-spin" />
          Đang tải thông tin doanh nghiệp...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hồ sơ doanh nghiệp</h2>
            <p className="mt-1 text-sm text-gray-600">
              Xem và cập nhật thông tin hiển thị của doanh nghiệp trên hệ thống.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            <FiLogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900">Logo doanh nghiệp</h3>
          <p className="mt-1 text-sm text-gray-500">
            Hệ thống chỉ dùng 1 logo duy nhất cho doanh nghiệp.
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <img
              src={displayLogo}
              alt="Business logo"
              className="h-56 w-full object-contain"
              onError={handleLogoError}
            />
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-green-300 hover:bg-green-50">
              <FiUpload className="h-4 w-4" />
              Chọn logo mới
              <input
                type="file"
                accept="image/*"
                onChange={handleSelectLogo}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => void handleSaveLogo()}
              disabled={!selectedLogoFile || isSavingLogo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingLogo ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiImage className="h-4 w-4" />
              )}
              Lưu logo
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Thông tin doanh nghiệp
          </h3>
          
          <div className="mt-3 flex items-center gap-2 relative">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${verificationConfig.className}`}
            >
              <VerificationIcon className="h-3.5 w-3.5" />
              Trạng thái hồ sơ: {verificationConfig.label}
            </span>

            {/* Khối Tooltip nằm ngang tại đây */}
            <div className="group relative flex items-center">
              <FiHelpCircle className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600 transition-colors" />
              
              {/* Box hiển thị nội dung nằm bên phải (left-full) và lấp đầy khoảng trống (max-w, w-max) */}
              <div className={`pointer-events-none absolute left-full top-1/2 z-10 ml-3 w-max max-w-[280px] sm:max-w-[350px] lg:max-w-[420px] -translate-y-1/2 scale-95 rounded-md border px-3 py-2 text-xs leading-relaxed opacity-0 shadow-sm transition-all duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 ${verificationConfig.tooltipBg}`}>
                Nếu chưa được xác minh bởi quản trị viên, doanh nghiệp sẽ không thể sử dụng dữ liệu trạm sạc hay đồng bộ trạm sạc từ server,...
                {/* Mũi tên trỏ sang trái */}
                <div className={`absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-l ${verificationConfig.arrowBg}`}></div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Tên công ty</span>
              <input
                value={formData.companyName}
                onChange={handleInputChange("companyName")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Nhập tên công ty"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Mã số thuế</span>
              <input
                value={formData.taxCode}
                onChange={handleInputChange("taxCode")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Nhập mã số thuế"
              />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Địa chỉ công ty</span>
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  value={formData.companyAddress}
                  onChange={handleInputChange("companyAddress")}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập địa chỉ công ty"
                />
              </div>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Người quản lý</span>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  value={formData.managerFullName}
                  onChange={handleInputChange("managerFullName")}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập họ tên người quản lý"
                />
              </div>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Email quản lý</span>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.managerEmail}
                  onChange={handleInputChange("managerEmail")}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="manager@company.com"
                />
              </div>
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">
                Địa chỉ người quản lý
              </span>
              <input
                value={formData.managerAddress}
                onChange={handleInputChange("managerAddress")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Nhập địa chỉ người quản lý"
              />
            </label>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-sm font-semibold text-gray-900">Thông tin kết nối hệ thống</h4>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Server URL</span>
                <div className="relative">
                  <FiGlobe className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    value={formData.serverUrl ?? ""}
                    onChange={handleInputChange("serverUrl")}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Chưa cấu hình"
                  />
                </div>
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Token</span>
                <div className="relative w-full">
                  <FiKey className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    value={formData.token ?? ""}
                    onChange={handleInputChange("token")}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Nhập token hệ thống"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => void handleSaveProfile()}
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProfile ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiSave className="h-4 w-4" />
              )}
              Lưu thông tin
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}