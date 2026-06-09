"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { ApiError } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { loginType } from "@/models/user";
import { login, getUserDetails } from "@/services/userService";
import { getEnterpriseProfile } from "@/services/enterpriseService";
import { useEnterpriseStore } from "@/store/useEnterpriseStore";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "react-toastify";

type Props = {
  closeModal: () => void;
  switchToRegister: () => void;
};

export default function LoginFormContent({
  closeModal,
  switchToRegister,
}: Props) {
  const [formData, setFormData] = useState<loginType>({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State mới để quản lý việc hiển thị loading khi đang chuyển hướng
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof loginType]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) return;

    try {
      setLoading(true);

      const result = await login(formData);

      useUserStore.getState().updateUser({
        accessToken: result.token,
        isLogedin: true,
        fullName: result.user.fullName,
        email: result.user.email,
        address: result.user.address ?? "",
        role: result.user.role,
      });

      // Bật hiệu ứng loading
      setIsRedirecting(true);
      toast.success("Đăng nhập thành công");

      if (result.user.role === "ADMIN") {
        router.push("/dashboard/admin-enterprises");
      } else if (result.user.role === "BUSINESS") {
        const businessProfile = await getEnterpriseProfile();
        useEnterpriseStore.getState().updateEnterprise(businessProfile);
        router.push("/dashboard");
      } else {
        const userDetail = await getUserDetails();
        useUserStore.getState().updateUser({
          fullName: userDetail.fullName,
          email: userDetail.email,
          address: userDetail.address ?? "",
          savedStation: userDetail.savedStationList ?? [],
        });
        router.push("/Map");
      }

      // Đảm bảo modal được đóng và state được reset sau khi router.push thực thi
      // 800ms là đủ để user nhìn thấy hiệu ứng chuyển trang mượt mà
      setTimeout(() => {
        closeModal();
        setIsRedirecting(false);
      }, 800);
    } catch (err: unknown) {
      const error = err as ApiError;

      useUserStore.getState().clearUser();
      useEnterpriseStore.getState().clearEnterprise();
      console.error("Đăng nhập không thành công:", error.message);
      toast.error("Đăng nhập không thành công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* MÀN HÌNH LOADING OVERLAY
        Chỉ hiển thị khi isRedirecting = true
      */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-600 font-semibold animate-pulse">
            Đăng nhập thành công, vui lòng đợi trong giây lát...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên người dùng
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="w-5 h-5 text-gray-400" />
            </div>

            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên người dùng"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </div>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer"
            />
            Nhớ mật khẩu
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary-dark"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.username || !formData.password || isRedirecting}
          className="w-full bg-amber-400 hover:bg-amber-300 cursor-pointer text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
      </form>

      <div className="text-center w-full text-gray-600 mt-6 flex flex-row mx-auto justify-center">
        Chưa có tài khoản?{" "}
        <div
          className="text-primary hover:text-primary-dark font-semibold cursor-pointer mx-2"
          onClick={switchToRegister}
        >
          Đăng Kí Ngay
        </div>
      </div>
    </div>
  );
}