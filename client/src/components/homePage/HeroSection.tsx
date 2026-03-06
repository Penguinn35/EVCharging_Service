"use client";

import Link from "next/link";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Tìm Trạm Sạc Xe Điện
          <span className="text-primary block mt-2">Gần Nhất & Nhanh Nhất</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          ChargeHub giúp bạn tìm kiếm trạm sạc xe điện thông minh, xem dữ liệu
          thực tế, nhận dẫn đường tối ưu, và chia sẻ đánh giá của cộng đồng.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/Map"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 hover:gap-8 transition-all duration-300 text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition font-semibold text-lg"
          >
            <p>Bắt Đầu Ngay</p>
            <FiMapPin className="w-5 h-5" />
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-12 relative h-80 bg-gradient-to-br from-primary-light to-cyan-200 rounded-2xl shadow-lg overflow-hidden">
          <svg
            viewBox="0 0 400 300"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Map background */}
            <rect width="400" height="300" fill="#ecfdf5" />

            {/* Roads */}
            <line
              x1="0"
              y1="150"
              x2="400"
              y2="150"
              stroke="#d1fae5"
              strokeWidth="3"
            />
            <line
              x1="200"
              y1="0"
              x2="200"
              y2="300"
              stroke="#d1fae5"
              strokeWidth="3"
            />

            {/* Charging stations */}
            <circle cx="100" cy="100" r="15" fill="#10b981" opacity="0.9" />
            <circle
              cx="100"
              cy="100"
              r="12"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              ⚡
            </text>

            <circle cx="300" cy="120" r="15" fill="#10b981" opacity="0.7" />
            <text
              x="300"
              y="125"
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              ⚡
            </text>

            <circle cx="150" cy="200" r="15" fill="#10b981" opacity="0.6" />
            <text
              x="150"
              y="205"
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              ⚡
            </text>

            {/* Route */}
            <path
              d="M 80 80 Q 180 150 320 130"
              stroke="#06b6d4"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />

            {/* User location */}
            <circle cx="80" cy="80" r="8" fill="#ec4899" />
            <circle
              cx="80"
              cy="80"
              r="12"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
