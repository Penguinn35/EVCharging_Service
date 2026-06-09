"use client";

import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { registerType } from "@/models/user";
import { createUser } from "@/services/userService";
import {
  BusinessRegistrationRequest,
  registerBusinessAccount,
} from "@/services/enterpriseService";
import { toast } from "react-toastify";
type Props = {
  closeModal: () => void;
  switchToLogin: () => void;
};

export default function RegisterFormContent({
  closeModal: _closeModal,
  switchToLogin,
}: Props) {
  const [formData, setFormData] = useState<registerType>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    address: "",
  });
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{7,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [accountType, setAccountType] = useState<"USER" | "BUSINESS">("USER");
  const [businessData, setBusinessData] = useState({
    companyId: "",
    companyName: "",
    taxCode: "",
    companyAddress: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    companyId: "",
    companyName: "",
    taxCode: "",
    companyAddress: "",
  });

  const validate = () => {
    const newErrors = {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      companyId: "",
      companyName: "",
      taxCode: "",
      companyAddress: "",
    };

    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Username must be ≥8 chars and start with a letter";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name must not be empty";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, special char and ≥8 chars";
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (accountType === "BUSINESS") {
      if (!businessData.companyId.trim()) {
        newErrors.companyId = "Company ID is required";
      }
      if (!businessData.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!businessData.taxCode.trim()) {
        newErrors.taxCode = "Tax code is required";
      }
      if (!businessData.companyAddress.trim()) {
        newErrors.companyAddress = "Company address is required";
      }
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === "");
  };
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (formData.password !== confirmPassword) {
      alert("Password confirmation does not match");
      return;
    }

    try {
      setLoading(true);

      if (accountType === "BUSINESS") {
        const businessPayload: BusinessRegistrationRequest = {
          ...formData,
          companyId: businessData.companyId,
          companyName: businessData.companyName,
          taxCode: businessData.taxCode,
          companyAddress: businessData.companyAddress,
        };
        const response = await registerBusinessAccount(businessPayload);
        if (response.httpStatus === "OK") {
          toast.success("Đăng ký tài khoản doanh nghiệp thành công");
          switchToLogin();
        }
        return;
      }

      const response = await createUser(formData);
      if (response.httpStatus === "OK") {
        toast.success("Đăng ký tài khoản thành công");
        switchToLogin();
      }
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {accountType === "BUSINESS" ? (
  <div className="space-y-8">
    
    {/* =========================================
        PHẦN 1: THÔNG TIN CÁ NHÂN 
        ========================================= */}
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        Thông tin người đại diện doanh nghiệp
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CỘT TRÁI - CÁ NHÂN */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác Nhận Mật Khẩu
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI - CÁ NHÂN */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và Tên
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ cá nhân
            </label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* =========================================
        PHẦN 2: THÔNG TIN DOANH NGHIỆP 
        ========================================= */}
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        Thông tin doanh nghiệp
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CỘT TRÁI - DOANH NGHIỆP */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên doanh nghiệp
            </label>
            <input
              name="companyName"
              type="text"
              value={businessData.companyName}
              onChange={handleBusinessChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Doanh nghiệp
            </label>
            <input
              name="companyId"
              type="text"
              value={businessData.companyId}
              onChange={handleBusinessChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.companyId ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.companyId && (
              <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>
            )}
          </div>
        </div>

        {/* CỘT PHẢI - DOANH NGHIỆP */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã số thuế
            </label>
            <input
              name="taxCode"
              type="text"
              value={businessData.taxCode}
              onChange={handleBusinessChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.taxCode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.taxCode && (
              <p className="text-red-500 text-sm mt-1">{errors.taxCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ doanh nghiệp
            </label>
            <input
              name="companyAddress"
              type="text"
              value={businessData.companyAddress}
              onChange={handleBusinessChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.companyAddress ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

  </div>
) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                name="username"
                type="text"
                placeholder="Ví dụ: johndoe"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và Tên
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="fullName"
                  type="text"
                  placeholder="Ví dụ: John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Ví dụ: johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác Nhận Mật Khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Terms */}
        {/* <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>
              Tôi đồng ý với{" "}
              <Link href="/terms" className="text-primary">
                Điều Khoản
              </Link>
            </span>
          </label> */}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Loại tài khoản
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAccountType("USER")}
              className={`py-2 rounded-lg border text-sm font-medium transition cursor-pointer ${
                accountType === "USER"
                  ? "bg-amber-400 text-white border-amber-400"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Người dùng
            </button>
            <button
              type="button"
              onClick={() => setAccountType("BUSINESS")}
              className={`py-2 rounded-lg border text-sm font-medium transition cursor-pointer ${
                accountType === "BUSINESS"
                  ? "bg-amber-400 text-white border-amber-400"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Doanh nghiệp
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className=" mt-8 w-full bg-amber-400 text-white py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
        </button>
      </form>

      <div className="text-center text-gray-600 mt-6 flex flex-row">
        <p>Đã có tài khoản?</p>
        <div
          onClick={switchToLogin}
          className="text-primary mx-2 font-semibold cursor-pointer"
        >
          Đăng Nhập Ngay
        </div>
      </div>
    </div>
  );
}
