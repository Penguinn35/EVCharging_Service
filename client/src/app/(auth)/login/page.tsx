"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Header } from "@/components/homePage/Header";

import { loginType } from "@/models/user";
import { login } from "@/services/userService";

export default function LoginForm() {
  const [formData, setFormData] = useState<loginType>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      console.log("Login success:", result);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Header />
      <div className="w-full max-w-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
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
                placeholder="your username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Password */}
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

          {/* Remember & Forgot */}
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

          {/* Login button */}
          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
            className="w-full bg-amber-300 text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          {/* Google login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <FcGoogle className="w-5 h-5" />
            Đăng Nhập với Google
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary-dark font-semibold"
          >
            Đăng Kí Ngay
          </Link>
        </p>
      </div>
    </>
  );
}
