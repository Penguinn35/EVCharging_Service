'use client'

import { FiMapPin, FiZap, FiNavigation, FiBookmark, FiStar, FiSettings } from 'react-icons/fi'
import { TbReload } from 'react-icons/tb'

interface FeatureCard {
  icon: React.ReactNode
  title: string
  description: string
}

const userFeatures: FeatureCard[] = [
  {
    icon: <FiMapPin className="w-8 h-8" />,
    title: 'Tìm Trạm Sạc',
    description: 'Tìm kiếm trạm sạc gần nhất với bộ lọc thông minh theo loại cáp, tốc độ sạc, và bình luận'
  },
  {
    icon: <TbReload className="w-8 h-8" />,
    title: 'Dữ Liệu Thực Tế',
    description: 'Cập nhật trạng thái trạm sạc real-time, tình trạng sẵn sàng, thời gian chờ từ cộng đồng'
  },
  {
    icon: <FiNavigation className="w-8 h-8" />,
    title: 'Dẫn Đường Tối Ưu',
    description: 'Nhận tuyến đường thông minh tối ưu hóa cho việc sạc pin trên đường đi'
  },
  {
    icon: <FiBookmark className="w-8 h-8" />,
    title: 'Lưu Trạm Sạc',
    description: 'Lưu trạm sạc yêu thích, quản lý danh sách cá nhân cho truy cập nhanh'
  },
  {
    icon: <FiStar className="w-8 h-8" />,
    title: 'Đánh Giá & Bình Luận',
    description: 'Chia sẻ đánh giá, upload hình ảnh, và giúp cộng đồng cải thiện dịch vụ'
  },
  {
    icon: <FiSettings className="w-8 h-8" />,
    title: 'Cấu Hình Cá Nhân',
    description: 'Lưu loại cáp, dung lượng pin, và tùy chọn sạc để nhận gợi ý phù hợp nhất'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tính Năng Dành Cho Người Dùng
          </h2>
          <p className="text-lg text-gray-600">
            Mọi tính năng bạn cần để tìm và sạc xe của mình một cách thông minh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
