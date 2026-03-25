"use client";

import { FiBarChart, FiArrowRight, FiTool } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import MotionWrapper from "../MotionWraper";
interface BusinessCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const businessFeatures: BusinessCard[] = [
  {
    icon: <FiTool className="w-8 h-8" />,
    title: "Kết Nối Dễ Dàng",
    description:
      "Tích hợp đơn giản với hệ thống quản lý trạm sạc hiện có thông qua API đầy đủ",
  },
  {
    icon: <FiBarChart className="w-8 h-8" />,
    title: "Dashboard Phân Tích",
    description:
      "Theo dõi lưu lượng sử dụng, doanh thu, hiệu suất trạm sạc real-time",
  },
  {
    icon: <BsGraphUp className="w-8 h-8" />,
    title: "Dữ Liệu Chi Tiết",
    description:
      "Phân tích người dùng, thông số kỹ thuật, xu hướng tiêu thụ năng lượng chi tiết",
  },
];

export function BusinessSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-100 to-white min-h-[70vh] ">
      <div className="max-w-6xl mx-auto ">
        <div className="text-center mb-16">
          <MotionWrapper direction="down">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Giải Pháp Cho Doanh Nghiệp
            </h2>
          </MotionWrapper>
          <MotionWrapper delay={0.5}>
            <p className="text-lg text-gray-600">
              Quản lý, phân tích, và phát triển mạng lưới trạm sạc của bạn với
              dữ liệu thông minh
            </p>
          </MotionWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {businessFeatures.map((feature, index) => (
            <MotionWrapper
              key={index}
              className="p-8 rounded-xl bg-white border border-gray-200 hover:border-primary hover:shadow-lg transition group"
            >
              <MotionWrapper direction="left" className="text-green-500 mb-4 group-hover:scale-110 transition text-2xl">
                {feature.icon}
              </MotionWrapper>
              <MotionWrapper direction="right" delay={0.2} className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </MotionWrapper>
              <MotionWrapper delay={0.5} className="text-gray-600 leading-relaxed">
                {feature.description}
              </MotionWrapper>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
