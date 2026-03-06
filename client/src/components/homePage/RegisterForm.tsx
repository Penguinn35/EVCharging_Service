'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission - no actual logic
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Họ và Tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Xác Nhận Mật Khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer mt-0.5"
          />
          <span>
            Tôi đồng ý với{' '}
            <Link href="/terms" className="text-primary hover:text-primary-dark transition font-semibold">
              Điều Khoản Dịch Vụ
            </Link>
            {' '}và{' '}
            <Link href="/privacy" className="text-primary hover:text-primary-dark transition font-semibold">
              Chính Sách Riêng Tư
            </Link>
          </span>
        </label>

        {/* Register Button */}
        <button
          type="submit"
          disabled={!agreeTerms}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FiCheck className="w-5 h-5" />
          Tạo Tài Khoản
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc đăng kí với</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          <FcGoogle className="w-5 h-5" />
          Đăng Kí với Google
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-gray-600 mt-6">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-primary hover:text-primary-dark transition font-semibold">
          Đăng Nhập Ngay
        </Link>
      </p>
    </div>
  )
}
