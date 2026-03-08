"use client";

import Link from "next/link";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className=" px-4 lg:px-8 bg-gradient-to-b from-green-200 to-white h-[calc(100vh-72px)] ">
      <div className="w-full lg:w-4/5 mx-auto text-center flex flex-row h-full relative">
        <div className="mt-40 h-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 flex flex-col gap-4 text-left">
            <p>Tìm Trạm Sạc Xe Điện</p>
            <p>Gần Nhất & Nhanh Nhất</p>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-left">
            EVStation giúp bạn tìm kiếm trạm sạc xe điện thông minh, xem dữ liệu
            thực tế, nhận dẫn đường tối ưu, và chia sẻ đánh giá của cộng đồng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12"></div>
        </div>

        <div className="text-center ml-auto mt-auto mb-8 ">
          <img className="ml-auto " src="/map.svg" alt="Map" />
        </div>
        <Link
          href="/Map"
          className="absolute top-1/3 right-[10%] -translate-y-1/3 lg:top-1/4 lg:-translate-y-1/4  inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 hover:gap-8 transition-all duration-300 text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition font-semibold text-lg"
        >
          <p>Bắt Đầu Ngay</p>
          <FiMapPin className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
