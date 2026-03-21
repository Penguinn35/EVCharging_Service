"use client";

import {
  FiMapPin,
  FiZap,
  FiNavigation,
  FiBookmark,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { TbReload } from "react-icons/tb";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const userFeatures: FeatureCard[] = [
  {
    icon: <TbReload className="w-8 h-8" />,
    title: "Dữ Liệu Thực Tế",
    description:
      "Cập nhật trạng thái trạm sạc real-time, tình trạng sẵn sàng, thời gian chờ từ cộng đồng",
  },
  {
    icon: <FiNavigation className="w-8 h-8" />,
    title: "Dẫn Đường Tối Ưu",
    description:
      "Nhận tuyến đường thông minh tối ưu hóa cho việc sạc pin trên đường đi",
  },
  {
    icon: <FiBookmark className="w-8 h-8" />,
    title: "Lưu Trạm Sạc",
    description:
      "Lưu trạm sạc yêu thích, quản lý danh sách cá nhân cho truy cập nhanh",
  },
  {
    icon: <FiStar className="w-8 h-8" />,
    title: "Đánh Giá & Bình Luận",
    description:
      "Chia sẻ đánh giá, upload hình ảnh, và giúp cộng đồng cải thiện dịch vụ",
  },
  {
    icon: <FiSettings className="w-8 h-8" />,
    title: "Cấu Hình Cá Nhân",
    description:
      "Lưu loại cáp, dung lượng pin, và tùy chọn sạc để nhận gợi ý phù hợp nhất",
  },
];

export function FeaturesSection() {
  
  return (
    <section
      style={{ 
        backgroundImage: `
      linear-gradient(to right, oklch(95.1% 0.15 154.449) 1px, transparent 1px),
      linear-gradient(to bottom, oklch(95.1% 0.15 154.449) 1px, transparent 1px)
      
    `,
        
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%)",
        maskImage: "linear-gradient(to bottom, transparent, black 30%)",
      }}
      className=" px-4 sm:px-6 lg:px-8 bg-white md:mt-40 [background-size:40px_40px]
    md:[background-size:60px_60px]
    lg:[background-size:80px_80px]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-0 ">
        <div className="w-full flex md:flex-row flex-col items-center  h-[100vh]  justify-center">
          <div className=" md:w-1/2 ">
            <img src="/search.svg" alt="search" />
          </div>
          <div className="md:w-1/2 flex flex-col  justify-center text-center md:ml-20 md:text-left
          bg-white backdrop-blur-5xl rounded-xl p-6
          ">
            <h1 className="text-3xl md:text-4xl  font-bold">
              Tìm kiếm trạm sạc nhanh chóng
            </h1>
            
            <p>
              Tìm kiếm trạm sạc gần nhất với bộ lọc thông minh theo đầu sạc,
              công suất, và gần bạn nhất.
            </p>
          </div>
        </div>

        <div className="min-h-[100vh] ">
          <div className="text-center    ">
            <h2 className="text-3xl sm:text-4xl font-bold  mb-4">
              Và loạt tính năng hữu ích khác
            </h2>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div> */}

          <div className="max-w-6xl mx-auto py-20 px-4 scale-100">
            <div className="flex flex-wrap justify-center gap-6">
              {userFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`
  w-full sm:w-[45%] lg:w-[30%]
  p-6 rounded-2xl border-2 border-gray-200 bg-white
  hover:shadow-xl hover:-translate-y-2 transition group

  flex flex-col justify-center

  ${index % 2 === 0 ? "lg:mt-10" : ""}
`}
                >
                  <div className="text-green-500 mb-4 group-hover:scale-110 transition">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600">{feature.description}</p>

                  {/* optional height variation */}
                  {index % 2 === 0 && (
                    <div className=" md:h-20 bg-white rounded-lg"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
