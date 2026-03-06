'use client'

import Link from 'next/link'
import { FiZap } from 'react-icons/fi'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <FiZap className="w-6 h-6" />
          ChargeHub
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-primary transition font-medium"
          >
            Đăng nhập
          </Link>
          <Link 
            href="/register" 
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition font-medium"
          >
            Đăng kí
          </Link>
        </div>
      </nav>
    </header>
  )
}
