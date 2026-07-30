# Hệ thống Quản lý và Tìm kiếm Trạm sạc Xe điện (EV Charging Station Management & Search System)

Đồ án tốt nghiệp (HK252) - Khoa Khoa học và Kỹ thuật Máy tính, Trường Đại học Bách khoa - ĐHQG-HCM.

## 📖 Giới thiệu
Đây là nền tảng tập trung thông tin trạm sạc xe điện, được xây dựng nhằm giải quyết hội chứng "Range Anxiety" (lo lắng về quãng đường) của người dùng xe điện tại Việt Nam. 

Hệ thống cung cấp giải pháp toàn diện cho hai đối tượng chính:
- **Người dùng cá nhân (End-user):** Hỗ trợ tìm kiếm, chỉ đường, đánh giá và quản lý thông tin các trạm sạc trong khu vực một cách trực quan trên bản đồ.
- **Doanh nghiệp vận hành (CPO/Admin):** Cung cấp công cụ quản lý trạm sạc, phân tích dữ liệu người dùng, xem bản đồ nhiệt (heatmap) để đánh giá nhu cầu và hỗ trợ ra quyết định quy hoạch hạ tầng sạc điện.

## ✨ Các tính năng nổi bật

### Dành cho Người dùng (End-user)
- 🗺️ **Bản đồ trực quan:** Hiển thị vị trí các trạm sạc xung quanh người dùng.
- 🔍 **Tìm kiếm & Lọc:** Lọc trạm sạc theo khoảng cách, loại cổng sạc, công suất, đánh giá,...
- 📍 **Chỉ đường (Routing):** Tìm đường đi ngắn nhất đến trạm sạc mong muốn.
- ⭐ **Đánh giá & Phản hồi:** Cho phép người dùng để lại nhận xét và điểm đánh giá cho trạm sạc.
- 🚗 **Cá nhân hóa:** Lưu trữ thông tin phương tiện cá nhân và danh sách các trạm sạc yêu thích.

### Dành cho Doanh nghiệp (Business/CPO)
- 🏢 **Quản lý trạm sạc:** Thêm, sửa, xóa, và cập nhật trạng thái các trạm sạc do doanh nghiệp quản lý.
- 📊 **Thống kê & Báo cáo:** Theo dõi các chỉ số quan tâm của người dùng, lượt xem, lượt đánh giá.
- 🌡️ **Bản đồ nhiệt (Heatmap):** Trực quan hóa mật độ nhu cầu tìm kiếm và sử dụng trạm sạc, hỗ trợ quy hoạch các "điểm nóng" cần đầu tư hạ tầng.

## 🛠️ Công nghệ sử dụng

Dự án được xây dựng theo mô hình kiến trúc nhiều tầng (Layered Architecture) kết hợp với RESTful API:
- **Frontend:** NextJS
- **Backend:** Java Spring Boot
- **Database:** PostgreSQL
- **Bản đồ & Geocoding:** OpenStreetMap (OSM)
- **Thuật toán chỉ đường:** Dijkstra / Dịch vụ Routing tương đương.

## 🚀 Hướng dẫn cài đặt (Installation)

*(Bạn hãy cập nhật các bước clone repo, cài đặt dependencies và chạy dự án thực tế tại đây)*

```bash
# 1. Clone repository
git clone [https://github.com/your-username/ev-charging-management.git](https://github.com/your-username/ev-charging-management.git)

# 2. Setup Database (PostgreSQL)
# Import file script database hoặc chạy migration...

# 3. Chạy Backend (Spring Boot)
# cd backend && ./mvnw spring-boot:run

# 4. Chạy Frontend (NextJS)
# cd frontend && npm install && npm run dev
