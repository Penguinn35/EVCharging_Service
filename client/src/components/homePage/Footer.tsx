'use client'

import Link from 'next/link'
import { FiZap } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <FiZap className="w-6 h-6" />
              ChargeHub
            </div>
            <p className="text-gray-400">
              Nền tảng tìm kiếm trạm sạc xe điện thông minh
            </p>
          </div>

          {/* User Links */}
          <div>
            <h4 className="font-semibold mb-4">Dành Cho Người Dùng</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-primary transition">Tìm Trạm Sạc</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Dẫn Đường</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Đánh Giá</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Cộng Đồng</Link></li>
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h4 className="font-semibold mb-4">Dành Cho Doanh Nghiệp</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-primary transition">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-primary transition">API</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Tích Hợp</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Giá Cả</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Công Ty</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-primary transition">Giới Thiệu</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Tuyển Dụng</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Liên Hệ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2024 ChargeHub. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-primary transition">Điều Khoản</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-primary transition">Riêng Tư</Link>
              <Link href="/" className="text-gray-400 hover:text-primary transition">Cookie</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
