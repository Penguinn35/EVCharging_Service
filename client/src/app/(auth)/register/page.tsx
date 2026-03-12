'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { Header } from '@/components/homePage/Header'

import { registerType } from '@/models/user'
import { createUser } from '@/services/userService'

export default function RegisterForm() {
  const [formData, setFormData] = useState<registerType>({
    userName: '',
    fullName: '',
    email: '',
    password: ''
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== confirmPassword) {
      alert('Password confirmation does not match')
      return
    }

    try {
      await createUser(formData)
      alert('Register success')
    } catch (error) {
      console.error(error)
      alert('Register failed')
    }
  }

  return (
<><Header/>
    <div className="w-full max-w-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và Tên
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400"/>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400"/>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400"/>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <FiEyeOff/> : <FiEye/>}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác Nhận Mật Khẩu
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400"/>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? <FiEyeOff/> : <FiEye/>}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <span>
            Tôi đồng ý với <Link href="/terms" className="text-primary">Điều Khoản</Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreeTerms}
          className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <FiCheck/>
          Tạo Tài Khoản
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg"
        >
          <FcGoogle/>
          Đăng Kí với Google
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-primary font-semibold">
          Đăng Nhập Ngay
        </Link>
      </p>
    </div></>
    
  )
}