"use client";
import { useState } from "react";
import Link from "next/link";
import { FiZap, FiMenu, FiX } from "react-icons/fi";

export  function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className=" text-green-500 flex items-center gap-2 font-bold text-xl text-primary">
          <FiZap className="w-6 h-6" />
          EVStation
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-primary transition font-medium"
          >
            Đăng nhập
          </Link>
          <Link 
            href="/register" 
            className="bg-primary text-gray-700 px-5 py-2 rounded-lg hover:bg-primary-dark transition font-medium"
          >
            Đăng kí
          </Link>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-primary transition font-medium"
              onClick={() => setOpen(false)}
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="bg-primary text-gray-700 py-2 rounded-lg text-left hover:bg-primary-dark transition font-medium"
              onClick={() => setOpen(false)}
            >
              Đăng kí
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}