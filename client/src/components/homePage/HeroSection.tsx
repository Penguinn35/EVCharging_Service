"use client";

import Link from "next/link";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className=" px-4 lg:px-8 bg-green-100 h-[calc(100vh-72px)] md:mt-[72px] ">
      <div className="w-full lg:w-4/5 mx-auto text-center flex flex-col h-full relative">
        <div className="mt-40 px-3   ">
          <h1 className=" text-3xl md:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 flex flex-col md:gap-4 md:text-left">
            <p>Tìm Trạm Sạc Xe Điện</p>
            <p>Gần Nhất & Nhanh Nhất</p>
          </h1>
          <p className="md:text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl w-full  md:text-left">
            EVStation giúp bạn tìm kiếm trạm sạc xe điện thông minh, xem dữ liệu
            thực tế, nhận dẫn đường tối ưu, và chia sẻ đánh giá của cộng đồng.
          </p>
        </div>

        <Link
          href="/Map"
          className="  inline-flex items-center justify-center gap-2 bg-green-500
          hover:bg-green-600 hover:gap-8 transition-all duration-300 text-white
           px-8 py-4 rounded-lg hover:bg-primary-dark transition font-semibold text-lg
           h-16 w-60 scale-75 md:scale-100 z-2 mx-auto md:mx-0 "
        >
          <p>Bắt Đầu Ngay</p>
          <FiMapPin className="w-5 h-5" />
        </Link>

        <div className="text-center absolute w-full md:w-[80%]  left-1/2 top-[85%] md:top-[75%] -translate-x-1/2 -translate-y-1/2 z-1 md:ml-20 ">
          <img className=" w-full" src="/map.svg" alt="Map" />
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full  "
        viewBox="0 0 1440 319"
        preserveAspectRatio="none"
      >
        <path
          fill="#fff"
          d="M0,192L34.3,197.3C68.6,203,137,213,206,208C274.3,203,343,181,411,170.7C480,160,549,160,617,165.3C685.7,171,754,181,823,192C891.4,203,960,213,1029,200C1097.1,187,1166,160,1234,120C1302.9,80,1371,40,1406,20L1440,0L1440,320L0,320Z"
        />
      </svg>
    </section>
  );
}
