-- ==============================================================================
-- 1. INSERT DATA CHO BẢNG CPO (Charge Point Operator)
-- Schema: enterprise_id, address, company_name, logo_url, tax_code
-- ==============================================================================
INSERT INTO cpo (enterprise_id, address, company_name, logo_url, tax_code) VALUES
('cpo-vinfast', 'Khu kinh tế Đình Vũ – Cát Hải, Huyện Cát Hải, Hải Phòng', 'Vinfast', NULL, '0108926276'),
('cpo-abb', '9 Đoàn Văn Bơ, Phường 12, Quận 4, TP. HCM', 'ABB', NULL, '0300112466'),
('cpo-siemens', '33 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. HCM', 'Siemens', NULL, '0300234567'),
('cpo-chargeplus', 'Singapore', 'Charge+', NULL, '0300345678'),
('cpo-evercharge', 'USA', 'Evercharge', NULL, '0300456789'),
('cpo-schneider', '364 Cộng Hòa, Phường 13, Tân Bình, TP. HCM', 'Schneider', NULL, '0300567890');

-- ==============================================================================
-- 1. INSERT DATA CHO CHARGING_STATION
-- Schema mới: id, address, district, status, manufacturer_id, name, latitude, longitude, total_points
-- Status map: 0 = UNAVAILABLE, 1 = AVAILABLE, 2 = BUSY, 3 = FULL
-- ==============================================================================
-- Schema: id, address, district, status, manufacturer_id, name, latitude, longitude
INSERT INTO charging_station (id, address, district, status, manufacturer_id, name, latitude, longitude) VALUES
-- KHU VỰC QUẬN 1 
('cs-vn-1001', '65 Lê Lợi, Phường Bến Nghé', 'Quận 1', 1, 'cpo-vinfast', 'Trạm sạc Vincom Center', 10.7778, 106.7022),
('cs-vn-1002', '92 Nguyễn Huệ, Phường Bến Nghé', 'Quận 1', 1, 'cpo-abb', 'Trạm sạc Sunwah Tower', 10.7745, 106.7041),
('cs-vn-1003', '72 Lê Thánh Tôn, Phường Bến Nghé', 'Quận 1', 1, 'cpo-siemens', 'Trạm sạc Vincom Đồng Khởi', 10.7781, 106.7018),
('cs-vn-1004', '2 Hải Triều, Phường Bến Nghé', 'Quận 1', 0, 'cpo-chargeplus', 'Trạm sạc Bitexco', 10.7715, 106.7049),
('cs-vn-1005', '39 Lê Duẩn, Phường Bến Nghé', 'Quận 1', 1, 'cpo-evercharge', 'Trạm sạc mPlaza', 10.7820, 106.7003),
('cs-vn-1006', '17 Tôn Đức Thắng, Phường Bến Nghé', 'Quận 1', 1, 'cpo-schneider', 'Trạm sạc Green Power', 10.7844, 106.7051),
('cs-vn-1007', '88 Đồng Khởi, Phường Bến Nghé', 'Quận 1', 1, 'cpo-vinfast', 'Trạm sạc Sheraton', 10.7758, 106.7039),
('cs-vn-1008', '111A Pasteur, Phường Bến Nghé', 'Quận 1', 1, 'cpo-abb', 'Trạm sạc Liberty', 10.7739, 106.7005),
('cs-vn-1009', '2 Nguyễn Bỉnh Khiêm, Phường Đa Kao', 'Quận 1', 1, 'cpo-vinfast', 'Trạm sạc Thảo Cầm Viên', 10.7865, 106.7047),
('cs-vn-1010', '29A Nguyễn Đình Chiểu, Phường Đa Kao', 'Quận 1', 0, 'cpo-siemens', 'Trạm sạc Lim Tower 3', 10.7884, 106.6981),
('cs-vn-1011', '15 Lê Duẩn, Phường Bến Nghé', 'Quận 1', 1, 'cpo-chargeplus', 'Trạm sạc PetroVietnam', 10.7834, 106.7021),
('cs-vn-1012', '3A Tôn Đức Thắng, Phường Bến Nghé', 'Quận 1', 1, 'cpo-evercharge', 'Trạm sạc Le Meridien', 10.7814, 106.7061),
('cs-vn-1013', '9-11 Tôn Đức Thắng, Phường Bến Nghé', 'Quận 1', 1, 'cpo-schneider', 'Trạm sạc Lim Tower 1', 10.7794, 106.7061),
('cs-vn-1014', '28 Phùng Khắc Khoan, Phường Đa Kao', 'Quận 1', 1, 'cpo-vinfast', 'Trạm sạc Somerset', 10.7854, 106.6981),
('cs-vn-1015', '34 Tôn Đức Thắng, Phường Bến Nghé', 'Quận 1', 0, 'cpo-abb', 'Trạm sạc Sài Gòn Trade', 10.7861, 106.7055),
('cs-vn-1016', '22A Hai Bà Trưng, Phường Bến Nghé', 'Quận 1', 1, 'cpo-vinfast', 'Trạm sạc Bến Cảng', 10.7788, 106.7066),
('cs-vn-1017', '45 Lý Tự Trọng, Phường Bến Nghé', 'Quận 1', 1, 'cpo-siemens', 'Trạm sạc Bến Thành', 10.7761, 106.6995),

-- KHU VỰC QUẬN 3 
('cs-vn-1018', '117 Nguyễn Đình Chiểu, Phường 6', 'Quận 3', 1, 'cpo-vinfast', 'Trạm sạc RomeA', 10.7801, 106.6912),
('cs-vn-1019', '3 Võ Văn Tần, Phường 6', 'Quận 3', 1, 'cpo-abb', 'Trạm sạc The Landmark', 10.7812, 106.6934),
('cs-vn-1020', '112 Lý Chính Thắng, Phường 8', 'Quận 3', 1, 'cpo-chargeplus', 'Trạm sạc An Phú Plaza', 10.7901, 106.6854),
('cs-vn-1021', '89B Nguyễn Đình Chiểu, Phường 6', 'Quận 3', 1, 'cpo-evercharge', 'Trạm sạc Lim Tower 2', 10.7834, 106.6921),
('cs-vn-1022', '201 Điện Biên Phủ, Phường Võ Thị Sáu', 'Quận 3', 1, 'cpo-schneider', 'Trạm sạc E-Town Central', 10.7865, 106.6881),
('cs-vn-1023', '14 Kỳ Đồng, Phường 9', 'Quận 3', 1, 'cpo-vinfast', 'Trạm sạc Kỳ Đồng', 10.7878, 106.6845),
('cs-vn-1024', '60 Võ Văn Tần, Phường 6', 'Quận 3', 1, 'cpo-siemens', 'Trạm sạc Báo Sài Gòn', 10.7789, 106.6911),
('cs-vn-1025', '280 Nam Kỳ Khởi Nghĩa, Phường 8', 'Quận 3', 0, 'cpo-abb', 'Trạm sạc Sacombank', 10.7915, 106.6868),
('cs-vn-1026', '167 Hai Bà Trưng, Phường Võ Thị Sáu', 'Quận 3', 1, 'cpo-vinfast', 'Trạm sạc Novaland', 10.7842, 106.6955),
('cs-vn-1027', '258 Nguyễn Đình Chiểu, Phường 6', 'Quận 3', 1, 'cpo-chargeplus', 'Trạm sạc Co-op Mart', 10.7765, 106.6885),
('cs-vn-1028', '134 Lê Quý Đôn, Phường Võ Thị Sáu', 'Quận 3', 1, 'cpo-evercharge', 'Trạm sạc Lê Quý Đôn', 10.7825, 106.6905),
('cs-vn-1029', '40 Bà Huyện Thanh Quan, Phường 6', 'Quận 3', 0, 'cpo-vinfast', 'Trạm sạc Thanh Quan', 10.7811, 106.6872),
('cs-vn-1030', '120 Cách Mạng Tháng 8, Phường 7', 'Quận 3', 1, 'cpo-schneider', 'Trạm sạc CMT8', 10.7758, 106.6851),
('cs-vn-1031', '215 Điện Biên Phủ, Phường Võ Thị Sáu', 'Quận 3', 1, 'cpo-siemens', 'Trạm sạc ĐBP 215', 10.7858, 106.6871),
('cs-vn-1032', '35 Trương Định, Phường 6', 'Quận 3', 1, 'cpo-vinfast', 'Trạm sạc Trương Định', 10.7785, 106.6925),
('cs-vn-1033', '85 Pasteur, Phường 6', 'Quận 3', 1, 'cpo-abb', 'Trạm sạc Viện Pasteur', 10.7852, 106.6948),

-- KHU VỰC BÌNH THẠNH 
('cs-vn-1034', '208 Nguyễn Hữu Cảnh, Phường 22', 'Bình Thạnh', 1, 'cpo-vinfast', 'Trạm sạc Vinhomes Central Park', 10.7928, 106.7230),
('cs-vn-1035', '92 Nguyễn Hữu Cảnh, Phường 22', 'Bình Thạnh', 1, 'cpo-abb', 'Trạm sạc Saigon Pearl', 10.7876, 106.7165),
('cs-vn-1036', '561A Điện Biên Phủ, Phường 25', 'Bình Thạnh', 1, 'cpo-siemens', 'Trạm sạc Pearl Plaza', 10.8001, 106.7178),
('cs-vn-1037', '125 Điện Biên Phủ, Phường 15', 'Bình Thạnh', 1, 'cpo-chargeplus', 'Trạm sạc Hồng Bàng', 10.7965, 106.7058),
('cs-vn-1038', '2A Phan Chu Trinh, Phường 12', 'Bình Thạnh', 0, 'cpo-evercharge', 'Trạm sạc Học Viện Cán Bộ', 10.8055, 106.7021),
('cs-vn-1039', '15 Hoàng Hoa Thám, Phường 6', 'Bình Thạnh', 1, 'cpo-schneider', 'Trạm sạc Hoàng Hoa Thám', 10.8012, 106.6925),
('cs-vn-1040', '290 Nơ Trang Long, Phường 12', 'Bình Thạnh', 1, 'cpo-vinfast', 'Trạm sạc Nơ Trang Long', 10.8155, 106.6985),
('cs-vn-1041', '130 Xô Viết Nghệ Tĩnh, Phường 21', 'Bình Thạnh', 1, 'cpo-abb', 'Trạm sạc Ngã Tư Hàng Xanh', 10.7985, 106.7115),
('cs-vn-1042', '236 Phan Đăng Lưu, Phường 3', 'Bình Thạnh', 1, 'cpo-siemens', 'Trạm sạc Phan Đăng Lưu', 10.8015, 106.6905),
('cs-vn-1043', '152 Điện Biên Phủ, Phường 25', 'Bình Thạnh', 1, 'cpo-vinfast', 'Trạm sạc Khu C', 10.8010, 106.7155),
('cs-vn-1044', '42 Ung Văn Khiêm, Phường 25', 'Bình Thạnh', 0, 'cpo-chargeplus', 'Trạm sạc Ung Văn Khiêm', 10.8052, 106.7188),
('cs-vn-1045', '79 D2, Phường 25', 'Bình Thạnh', 1, 'cpo-evercharge', 'Trạm sạc Đại Học Hutech', 10.8035, 106.7162),
('cs-vn-1046', '334 Phan Chu Trinh, Phường 12', 'Bình Thạnh', 1, 'cpo-schneider', 'Trạm sạc Vissan', 10.8085, 106.7055),
('cs-vn-1047', '20B Bạch Đằng, Phường 24', 'Bình Thạnh', 1, 'cpo-vinfast', 'Trạm sạc Chợ Bà Chiểu', 10.8012, 106.7001),
('cs-vn-1048', '110 Đinh Tiên Hoàng, Phường 1', 'Bình Thạnh', 1, 'cpo-abb', 'Trạm sạc Đinh Tiên Hoàng', 10.7955, 106.6985),
('cs-vn-1049', '45 Nguyễn Gia Trí, Phường 25', 'Bình Thạnh', 0, 'cpo-siemens', 'Trạm sạc Nguyễn Gia Trí', 10.8041, 106.7145),
('cs-vn-1050', '200 Nguyễn Xí, Phường 26', 'Bình Thạnh', 1, 'cpo-vinfast', 'Trạm sạc Vincom Nguyễn Xí', 10.8145, 106.7112),

-- KHU VỰC QUẬN 7
('cs-vn-1051', '1058 Nguyễn Văn Linh, Phường Tân Phong', 'Quận 7', 1, 'cpo-vinfast', 'Trạm sạc SC VivoCity', 10.7300, 106.7023),
('cs-vn-1052', '101 Tôn Dật Tiên, Phường Tân Phú', 'Quận 7', 1, 'cpo-abb', 'Trạm sạc Crescent Mall', 10.7294, 106.7169),
('cs-vn-1053', '73 Hoàng Văn Thái, Phường Tân Phú', 'Quận 7', 1, 'cpo-siemens', 'Trạm sạc SECC', 10.7321, 106.7211),
('cs-vn-1054', '12 Tân Trào, Phường Tân Phú', 'Quận 7', 1, 'cpo-chargeplus', 'Trạm sạc Vinamilk Tower', 10.7324, 106.7181),
('cs-vn-1055', '300 Nguyễn Thị Thập, Phường Tân Quy', 'Quận 7', 0, 'cpo-evercharge', 'Trạm sạc Lotte Mart Q7', 10.7405, 106.7001),
('cs-vn-1056', '15 Hoàng Quốc Việt, Phường Phú Thuận', 'Quận 7', 1, 'cpo-schneider', 'Trạm sạc La Casa', 10.7251, 106.7302),
('cs-vn-1057', '80 Huỳnh Tấn Phát, Phường Tân Thuận Tây', 'Quận 7', 1, 'cpo-vinfast', 'Trạm sạc KCX Tân Thuận', 10.7551, 106.7255),
('cs-vn-1058', '500 Nguyễn Hữu Thọ, Phường Tân Hưng', 'Quận 7', 1, 'cpo-abb', 'Trạm sạc Sunrise City', 10.7412, 106.6985),
('cs-vn-1059', '1 Đường D4, Phường Tân Hưng', 'Quận 7', 0, 'cpo-siemens', 'Trạm sạc Him Lam', 10.7435, 106.6941),
('cs-vn-1060', '15 Nguyễn Lương Bằng, Phường Tân Phú', 'Quận 7', 1, 'cpo-chargeplus', 'Trạm sạc Paragon', 10.7305, 106.7201),
('cs-vn-1061', '68 Nguyễn Lương Bằng, Phường Tân Phú', 'Quận 7', 1, 'cpo-vinfast', 'Trạm sạc TTTM Nam Sài Gòn', 10.7255, 106.7235),
('cs-vn-1062', '20 Phạm Thái Bường, Phường Tân Phong', 'Quận 7', 1, 'cpo-evercharge', 'Trạm sạc Mỹ Toàn', 10.7281, 106.7081),
('cs-vn-1063', '85 Nguyễn Thái Học, Phường Tân Thuận Đông', 'Quận 7', 0, 'cpo-schneider', 'Trạm sạc Cầu Tân Thuận', 10.7581, 106.7351),
('cs-vn-1064', '9A Lâm Văn Bền, Phường Tân Kiểng', 'Quận 7', 1, 'cpo-vinfast', 'Trạm sạc Chợ Tân Mỹ', 10.7451, 106.7121),
('cs-vn-1065', '112 Trần Trọng Cung, Phường Tân Thuận Đông', 'Quận 7', 1, 'cpo-abb', 'Trạm sạc Nam Long', 10.7485, 106.7355),
('cs-vn-1066', '35 Đào Trí, Phường Phú Thuận', 'Quận 7', 1, 'cpo-siemens', 'Trạm sạc Q7 Boulevard', 10.7215, 106.7355),
('cs-vn-1067', '40 Phú Thuận, Phường Phú Thuận', 'Quận 7', 1, 'cpo-vinfast', 'Trạm sạc Mũi Đèn Đỏ', 10.7201, 106.7401),

-- KHU VỰC QUẬN 10
('cs-vn-1068', '11 Sư Vạnh Hạnh, Phường 12', 'Quận 10', 1, 'cpo-vinfast', 'Trạm sạc Vạn Hạnh Mall', 10.7753, 106.6675),
('cs-vn-1069', '828 Sư Vạn Hạnh, Phường 13', 'Quận 10', 1, 'cpo-abb', 'Trạm sạc Bệnh Viện 115', 10.7785, 106.6655),
('cs-vn-1070', '285 Cách Mạng Tháng 8, Phường 12', 'Quận 10', 1, 'cpo-siemens', 'Trạm sạc Viettel Complex', 10.7788, 106.6781),
('cs-vn-1071', '134 Thành Thái, Phường 12', 'Quận 10', 0, 'cpo-chargeplus', 'Trạm sạc UBND Q10', 10.7715, 106.6631),
('cs-vn-1072', '3/2, Phường 12', 'Quận 10', 1, 'cpo-evercharge', 'Trạm sạc Maximark 3/2', 10.7725, 106.6721),
('cs-vn-1073', '163 Tô Hiến Thành, Phường 13', 'Quận 10', 1, 'cpo-schneider', 'Trạm sạc Big C Miền Đông', 10.7791, 106.6685),
('cs-vn-1074', '254 Hòa Hảo, Phường 4', 'Quận 10', 1, 'cpo-vinfast', 'Trạm sạc Chợ Nhật Tảo', 10.7615, 106.6651),
('cs-vn-1075', '412 Nguyễn Tri Phương, Phường 4', 'Quận 10', 1, 'cpo-abb', 'Trạm sạc Đại học Kinh Tế', 10.7621, 106.6681),
('cs-vn-1076', '120 Lý Thái Tổ, Phường 2', 'Quận 10', 0, 'cpo-siemens', 'Trạm sạc Ngã Bảy', 10.7655, 106.6755),
('cs-vn-1077', '601 Cách Mạng Tháng 8, Phường 15', 'Quận 10', 1, 'cpo-chargeplus', 'Trạm sạc Công viên Lê Thị Riêng', 10.7851, 106.6621),
('cs-vn-1078', '70 Lữ Gia, Phường 15', 'Quận 10', 1, 'cpo-vinfast', 'Trạm sạc Nhà Thi Đấu Lữ Gia', 10.7721, 106.6551),
('cs-vn-1079', '100 Cửu Long, Phường 15', 'Quận 10', 1, 'cpo-evercharge', 'Trạm sạc Cư Xá Bắc Hải', 10.7815, 106.6611),
('cs-vn-1080', '299 Nguyễn Ngọc Lộc, Phường 14', 'Quận 10', 0, 'cpo-schneider', 'Trạm sạc Nguyễn Ngọc Lộc', 10.7681, 106.6621),
('cs-vn-1081', '350 Ngô Gia Tự, Phường 4', 'Quận 10', 1, 'cpo-vinfast', 'Trạm sạc Vòng xoay Nguyễn Tri Phương', 10.7601, 106.6701),
('cs-vn-1082', '201 Nguyễn Chí Thanh, Phường 12', 'Quận 10', 1, 'cpo-abb', 'Trạm sạc Bệnh Viện Chợ Rẫy (Cổng phụ)', 10.7585, 106.6605),
('cs-vn-1083', '15 Ba Vì, Phường 15', 'Quận 10', 1, 'cpo-siemens', 'Trạm sạc Cư xá Đồng Tiến', 10.7751, 106.6611),

-- KHU VỰC TP. THỦ ĐỨC
('cs-vn-1084', '242 Phạm Văn Đồng, Phường Hiệp Bình Chánh', 'Thủ Đức', 1, 'cpo-vinfast', 'Trạm sạc Gigamall', 10.8281, 106.7172),
('cs-vn-1085', '159 Xa lộ Hà Nội, Phường Thảo Điền', 'Thủ Đức', 1, 'cpo-abb', 'Trạm sạc Masteri Thảo Điền', 10.8031, 106.7431),
('cs-vn-1086', '161 Xa lộ Hà Nội, Phường An Phú', 'Thủ Đức', 1, 'cpo-siemens', 'Trạm sạc Estella Place', 10.8005, 106.7451),
('cs-vn-1087', '9 Võ Văn Ngân, Phường Linh Chiểu', 'Thủ Đức', 1, 'cpo-chargeplus', 'Trạm sạc Vincom Thủ Đức', 10.8501, 106.7564),
('cs-vn-1088', '50 Lê Văn Việt, Phường Hiệp Phú', 'Thủ Đức', 1, 'cpo-evercharge', 'Trạm sạc Vincom Lê Văn Việt', 10.8451, 106.7824),
('cs-vn-1089', '1 Song Hành, Phường Tân Phú', 'Thủ Đức', 1, 'cpo-schneider', 'Trạm sạc Suối Tiên', 10.8654, 106.8011),
('cs-vn-1090', '360 Xa lộ Hà Nội, Phường Phước Long A', 'Thủ Đức', 0, 'cpo-vinfast', 'Trạm sạc Centum Wealth', 10.8281, 106.7634),
('cs-vn-1091', '12 Quốc Hương, Phường Thảo Điền', 'Thủ Đức', 1, 'cpo-abb', 'Trạm sạc Q2 Thảo Điền', 10.8041, 106.7367),
('cs-vn-1092', '216 Võ Văn Ngân, Phường Bình Thọ', 'Thủ Đức', 0, 'cpo-siemens', 'Trạm sạc Nguyễn Kim', 10.8494, 106.7587),
('cs-vn-1093', '252 Nguyễn Văn Hưởng, Phường Thảo Điền', 'Thủ Đức', 1, 'cpo-chargeplus', 'Trạm sạc Tropic Garden', 10.8124, 106.7351),
('cs-vn-1094', '190 Nguyễn Văn Hưởng, Phường Thảo Điền', 'Thủ Đức', 1, 'cpo-vinfast', 'Trạm sạc Thảo Điền Pearl', 10.8067, 106.7324),
('cs-vn-1095', '1 Đại lộ Vòng Cung, Phường An Khánh', 'Thủ Đức', 1, 'cpo-evercharge', 'Trạm sạc Khu Đô Thị Sala', 10.7701, 106.7201),
('cs-vn-1096', '50 Mai Chí Thọ, Phường An Phú', 'Thủ Đức', 1, 'cpo-schneider', 'Trạm sạc Lexington', 10.7951, 106.7501),
('cs-vn-1097', '120 Kha Vạn Cân, Phường Hiệp Bình Chánh', 'Thủ Đức', 1, 'cpo-vinfast', 'Trạm sạc Chợ Bình Triệu', 10.8301, 106.7201),
('cs-vn-1098', '85 Đặng Văn Bi, Phường Bình Thọ', 'Thủ Đức', 1, 'cpo-abb', 'Trạm sạc Moonlight Residences', 10.8385, 106.7621),
('cs-vn-1099', '200 Nguyễn Duy Trinh, Phường Bình Trưng Tây', 'Thủ Đức', 0, 'cpo-siemens', 'Trạm sạc Homyland', 10.7885, 106.7681),
('cs-vn-1100', '15 Trần Não, Phường Bình An', 'Thủ Đức', 1, 'cpo-vinfast', 'Trạm sạc Trần Não', 10.7955, 106.7301),

-- KHU VỰC TÂN BÌNH 
('cs-vn-1101', 'Cộng Hòa, Phường 12', 'Tân Bình', 1, 'cpo-vinfast', 'Trạm sạc Pico Plaza', 10.8014, 106.6501),
('cs-vn-1102', 'Trường Sơn, Phường 2', 'Tân Bình', 1, 'cpo-abb', 'Trạm sạc Sân bay Tân Sơn Nhất', 10.8141, 106.6654),
('cs-vn-1103', '104 Phổ Quang, Phường 2', 'Tân Bình', 1, 'cpo-siemens', 'Trạm sạc Sky Center', 10.8074, 106.6681),
('cs-vn-1104', '364 Cộng Hòa, Phường 13', 'Tân Bình', 1, 'cpo-chargeplus', 'Trạm sạc E-Town', 10.8025, 106.6425),
('cs-vn-1105', '431 Hoàng Văn Thụ, Phường 4', 'Tân Bình', 0, 'cpo-evercharge', 'Trạm sạc Vincom VCC', 10.7961, 106.6565),
('cs-vn-1106', '200 Lý Thường Kiệt, Phường 9', 'Tân Bình', 1, 'cpo-schneider', 'Trạm sạc Chợ Tân Bình', 10.7851, 106.6531),
('cs-vn-1107', '141 Bàu Cát, Phường 14', 'Tân Bình', 1, 'cpo-vinfast', 'Trạm sạc Bàu Cát', 10.7951, 106.6451),
('cs-vn-1108', '2 Hoàng Việt, Phường 4', 'Tân Bình', 1, 'cpo-abb', 'Trạm sạc Đệ Nhất Hotel', 10.7965, 106.6581),
('cs-vn-1109', '60A Trường Sơn, Phường 2', 'Tân Bình', 0, 'cpo-siemens', 'Trạm sạc Menas Mall', 10.8115, 106.6645),
('cs-vn-1110', '1 Trường Chinh, Phường 11', 'Tân Bình', 1, 'cpo-chargeplus', 'Trạm sạc Ngã Tư Bảy Hiền', 10.7925, 106.6551),
('cs-vn-1111', '97A Phó Cơ Điều, Phường 3', 'Tân Bình', 1, 'cpo-vinfast', 'Trạm sạc Chợ Phạm Văn Hai', 10.7941, 106.6635),
('cs-vn-1112', '248 Phổ Quang, Phường 2', 'Tân Bình', 1, 'cpo-evercharge', 'Trạm sạc Botanica Premier', 10.8121, 106.6651),
('cs-vn-1113', '10 Phổ Quang, Phường 2', 'Tân Bình', 0, 'cpo-schneider', 'Trạm sạc Tân Sơn Nhất Hotel', 10.8055, 106.6711),
('cs-vn-1114', '54B Lạc Long Quân, Phường 9', 'Tân Bình', 1, 'cpo-vinfast', 'Trạm sạc Lạc Long Quân', 10.7821, 106.6521),
('cs-vn-1115', '15 Âu Cơ, Phường 14', 'Tân Bình', 1, 'cpo-abb', 'Trạm sạc Vòng Xoay Lê Đại Hành', 10.7785, 106.6515),
('cs-vn-1116', '30 Phan Đình Giót, Phường 2', 'Tân Bình', 1, 'cpo-siemens', 'Trạm sạc Ký túc xá CĐ Kỹ Thuật', 10.8035, 106.6675),

-- KHU VỰC PHÚ NHUẬN
('cs-vn-1117', '194 Hoàng Văn Thụ, Phường 9', 'Phú Nhuận', 1, 'cpo-vinfast', 'Trạm sạc White Palace', 10.8001, 106.6784),
('cs-vn-1118', '106 Nguyễn Văn Trỗi, Phường 8', 'Phú Nhuận', 1, 'cpo-abb', 'Trạm sạc Centre Point', 10.7965, 106.6805),
('cs-vn-1119', '48 Hoa Sứ, Phường 7', 'Phú Nhuận', 1, 'cpo-chargeplus', 'Trạm sạc Co.opmart Rạch Miễu', 10.7985, 106.6881),
('cs-vn-1120', '119 Phổ Quang, Phường 9', 'Phú Nhuận', 0, 'cpo-evercharge', 'Trạm sạc Golden Mansion', 10.8101, 106.6754),
('cs-vn-1121', '8 Hoàng Minh Giám, Phường 9', 'Phú Nhuận', 1, 'cpo-siemens', 'Trạm sạc Orchard Garden', 10.8124, 106.6781),
('cs-vn-1122', '128 Phan Đăng Lưu, Phường 3', 'Phú Nhuận', 1, 'cpo-schneider', 'Trạm sạc Ngã Tư Phú Nhuận', 10.8025, 106.6841),
('cs-vn-1123', '253 Nguyễn Văn Trỗi, Phường 10', 'Phú Nhuận', 1, 'cpo-vinfast', 'Trạm sạc Movenpick Hotel', 10.7951, 106.6755),
('cs-vn-1124', '130 Nguyễn Đình Chính, Phường 8', 'Phú Nhuận', 1, 'cpo-abb', 'Trạm sạc Nguyễn Đình Chính', 10.7935, 106.6791),
('cs-vn-1125', '261 Huỳnh Văn Bánh, Phường 12', 'Phú Nhuận', 0, 'cpo-siemens', 'Trạm sạc Huỳnh Văn Bánh', 10.7921, 106.6741),
('cs-vn-1126', '163 Lê Văn Sỹ, Phường 13', 'Phú Nhuận', 1, 'cpo-chargeplus', 'Trạm sạc Chợ Nguyễn Văn Trỗi', 10.7895, 106.6731),
('cs-vn-1127', '90 Phan Đình Phùng, Phường 2', 'Phú Nhuận', 1, 'cpo-vinfast', 'Trạm sạc Phan Đình Phùng', 10.7955, 106.6875),
('cs-vn-1128', '117 Phổ Quang, Phường 9', 'Phú Nhuận', 1, 'cpo-evercharge', 'Trạm sạc NovaWorld Centre', 10.8114, 106.6761),
('cs-vn-1129', '15 Thích Quảng Đức, Phường 4', 'Phú Nhuận', 0, 'cpo-schneider', 'Trạm sạc Chùa Vạn Hạnh', 10.8081, 106.6851),
('cs-vn-1130', '52 Nguyễn Kiệm, Phường 4', 'Phú Nhuận', 1, 'cpo-vinfast', 'Trạm sạc Vòng xoay Phạm Văn Đồng', 10.8125, 106.6821),
('cs-vn-1131', '30 Phùng Văn Cung, Phường 7', 'Phú Nhuận', 1, 'cpo-abb', 'Trạm sạc Phùng Văn Cung', 10.8015, 106.6855),
('cs-vn-1132', '1A Cầm Bá Thước, Phường 7', 'Phú Nhuận', 1, 'cpo-siemens', 'Trạm sạc Cầm Bá Thước', 10.8005, 106.6885),

-- KHU VỰC GÒ VẤP 
('cs-vn-1133', '366 Phan Văn Trị, Phường 5', 'Gò Vấp', 1, 'cpo-vinfast', 'Trạm sạc Emart Gò Vấp', 10.8251, 106.6881),
('cs-vn-1134', '190 Quang Trung, Phường 10', 'Gò Vấp', 1, 'cpo-abb', 'Trạm sạc Vincom Quang Trung', 10.8305, 106.6655),
('cs-vn-1135', '242 Nguyễn Văn Lượng, Phường 10', 'Gò Vấp', 1, 'cpo-siemens', 'Trạm sạc Lotte Mart Gò Vấp', 10.8365, 106.6685),
('cs-vn-1136', '18 Phan Văn Trị, Phường 10', 'Gò Vấp', 1, 'cpo-chargeplus', 'Trạm sạc Cityland Park Hills', 10.8315, 106.6661),
('cs-vn-1137', '1 Nguyễn Oanh, Phường 10', 'Gò Vấp', 0, 'cpo-evercharge', 'Trạm sạc Ngã 6 Gò Vấp', 10.8255, 106.6781),
('cs-vn-1138', '12 Quang Trung, Phường 11', 'Gò Vấp', 1, 'cpo-schneider', 'Trạm sạc Chợ Hạnh Thông Tây', 10.8421, 106.6541),
('cs-vn-1139', '15 Nguyễn Thái Sơn, Phường 4', 'Gò Vấp', 1, 'cpo-vinfast', 'Trạm sạc Bệnh Viện 175', 10.8185, 106.6805),
('cs-vn-1140', '300 Lê Đức Thọ, Phường 15', 'Gò Vấp', 1, 'cpo-abb', 'Trạm sạc Lê Đức Thọ', 10.8455, 106.6685),
('cs-vn-1141', '10 Phạm Văn Đồng, Phường 3', 'Gò Vấp', 0, 'cpo-siemens', 'Trạm sạc Vòng Xoay Công Viên Gia Định', 10.8155, 106.6785),
('cs-vn-1142', '55 Thống Nhất, Phường 11', 'Gò Vấp', 1, 'cpo-chargeplus', 'Trạm sạc Thống Nhất', 10.8351, 106.6581),
('cs-vn-1143', '102 Dương Quảng Hàm, Phường 5', 'Gò Vấp', 1, 'cpo-vinfast', 'Trạm sạc Dương Quảng Hàm', 10.8285, 106.6851),
('cs-vn-1144', '45 Phạm Huy Thông, Phường 6', 'Gò Vấp', 1, 'cpo-evercharge', 'Trạm sạc Phạm Huy Thông', 10.8381, 106.6781),
('cs-vn-1145', '118 Cây Trâm, Phường 9', 'Gò Vấp', 0, 'cpo-schneider', 'Trạm sạc Công Viên Làng Hoa', 10.8405, 106.6521),
('cs-vn-1146', '35 Phạm Văn Chiêu, Phường 14', 'Gò Vấp', 1, 'cpo-vinfast', 'Trạm sạc Chợ Thạch Đà', 10.8485, 106.6505),
('cs-vn-1147', '299 Phan Huy Ích, Phường 12', 'Gò Vấp', 1, 'cpo-abb', 'Trạm sạc Phan Huy Ích', 10.8355, 106.6401),
('cs-vn-1148', '115 Lê Văn Thọ, Phường 11', 'Gò Vấp', 1, 'cpo-siemens', 'Trạm sạc Lê Văn Thọ', 10.8425, 106.6585),
('cs-vn-1149', '50 Nguyễn Kiệm, Phường 3', 'Gò Vấp', 1, 'cpo-chargeplus', 'Trạm sạc Big C Gò Vấp', 10.8151, 106.6801),
('cs-vn-1150', '25 Trương Đăng Quế, Phường 1', 'Gò Vấp', 1, 'cpo-vinfast', 'Trạm sạc Trương Đăng Quế', 10.8125, 106.6855),

-- KHU VỰC QUẬN 5
('cs-vn-1151', '126 Hồng Bàng, Phường 12', 'Quận 5', 1, 'cpo-vinfast', 'Trạm sạc Thuận Kiều Plaza', 10.7534, 106.6581),
('cs-vn-1152', '190 Hồng Bàng, Phường 12', 'Quận 5', 1, 'cpo-abb', 'Trạm sạc Hùng Vương Plaza', 10.7551, 106.6627),
('cs-vn-1153', '215 Hồng Bàng, Phường 11', 'Quận 5', 1, 'cpo-siemens', 'Trạm sạc Bệnh Viện Đại Học Y Dược', 10.7558, 106.6645),
('cs-vn-1154', '227 Nguyễn Văn Cừ, Phường 4', 'Quận 5', 1, 'cpo-chargeplus', 'Trạm sạc Đại học Khoa Học Tự Nhiên', 10.7625, 106.6811),
('cs-vn-1155', '290 An Dương Vương, Phường 4', 'Quận 5', 0, 'cpo-evercharge', 'Trạm sạc Đại học Sư Phạm', 10.7611, 106.6801),
('cs-vn-1156', '68 Châu Văn Liêm, Phường 11', 'Quận 5', 1, 'cpo-schneider', 'Trạm sạc Châu Văn Liêm', 10.7515, 106.6585),
('cs-vn-1157', '190 Hải Thượng Lãn Ông, Phường 14', 'Quận 5', 1, 'cpo-vinfast', 'Trạm sạc Chợ Kim Biên', 10.7485, 106.6551),
('cs-vn-1158', '82 Hải Thượng Lãn Ông, Phường 10', 'Quận 5', 1, 'cpo-abb', 'Trạm sạc Chợ Lớn', 10.7501, 106.6595),
('cs-vn-1159', '11 Nguyễn Trãi, Phường 2', 'Quận 5', 0, 'cpo-siemens', 'Trạm sạc Nguyễn Trãi', 10.7605, 106.6781),
('cs-vn-1160', '391 Trần Hưng Đạo, Phường 10', 'Quận 5', 1, 'cpo-chargeplus', 'Trạm sạc Bệnh Viện Chấn Thương Chỉnh Hình', 10.7555, 106.6691),
('cs-vn-1161', '105 Lương Nhữ Học, Phường 11', 'Quận 5', 1, 'cpo-vinfast', 'Trạm sạc Phố Lồng Đèn', 10.7521, 106.6605),
('cs-vn-1162', '45 Mạc Thiên Tích, Phường 11', 'Quận 5', 1, 'cpo-evercharge', 'Trạm sạc Mạc Thiên Tích', 10.7541, 106.6621),
('cs-vn-1163', '201 Nguyễn Tri Phương, Phường 9', 'Quận 5', 0, 'cpo-schneider', 'Trạm sạc Ngã Tư Nguyễn Tri Phương', 10.7585, 106.6661),
('cs-vn-1164', '50 Tản Đà, Phường 10', 'Quận 5', 1, 'cpo-vinfast', 'Trạm sạc Tản Đà Court', 10.7545, 106.6645),
('cs-vn-1165', '120 Trần Bình Trọng, Phường 2', 'Quận 5', 1, 'cpo-abb', 'Trạm sạc Trần Bình Trọng', 10.7581, 106.6751),
('cs-vn-1166', '15 Võ Văn Kiệt, Phường 1', 'Quận 5', 1, 'cpo-siemens', 'Trạm sạc Cầu Chữ Y', 10.7555, 106.6805),

-- KHU VỰC QUẬN 11
('cs-vn-1167', '182 Lê Đại Hành, Phường 15', 'Quận 11', 1, 'cpo-vinfast', 'Trạm sạc The Emporium', 10.7654, 106.6541),
('cs-vn-1168', '3 Hòa Bình, Phường 3', 'Quận 11', 1, 'cpo-abb', 'Trạm sạc Công Viên Đầm Sen', 10.7665, 106.6385),
('cs-vn-1169', '205 Lạc Long Quân, Phường 3', 'Quận 11', 1, 'cpo-chargeplus', 'Trạm sạc Lạc Long Quân Q11', 10.7651, 106.6415),
('cs-vn-1170', '16 Lãnh Binh Thăng, Phường 13', 'Quận 11', 0, 'cpo-evercharge', 'Trạm sạc Lãnh Binh Thăng', 10.7635, 106.6481),
('cs-vn-1171', '212 Bình Thới, Phường 14', 'Quận 11', 1, 'cpo-siemens', 'Trạm sạc Vòng Xoay Lê Đại Hành', 10.7681, 106.6455),
('cs-vn-1172', '315 Lê Đại Hành, Phường 13', 'Quận 11', 1, 'cpo-schneider', 'Trạm sạc Chợ Thiếc', 10.7615, 106.6521),
('cs-vn-1173', '110 Ông Ích Khiêm, Phường 10', 'Quận 11', 1, 'cpo-vinfast', 'Trạm sạc Ông Ích Khiêm', 10.7661, 106.6421),
('cs-vn-1174', '50 Minh Phụng, Phường 5', 'Quận 11', 1, 'cpo-abb', 'Trạm sạc Minh Phụng', 10.7621, 106.6381),
('cs-vn-1175', '45 Tôn Thất Hiệp, Phường 13', 'Quận 11', 0, 'cpo-chargeplus', 'Trạm sạc Tôn Thất Hiệp', 10.7625, 106.6495),
('cs-vn-1176', '150 Đường 3 Tháng 2, Phường 16', 'Quận 11', 1, 'cpo-vinfast', 'Trạm sạc Cầu Vượt Cây Gõ', 10.7585, 106.6455),
('cs-vn-1177', '18 Tân Hóa, Phường 1', 'Quận 11', 1, 'cpo-evercharge', 'Trạm sạc Kênh Tân Hóa', 10.7601, 106.6355),
('cs-vn-1178', '85 Đội Cung, Phường 11', 'Quận 11', 1, 'cpo-schneider', 'Trạm sạc Đội Cung', 10.7651, 106.6465),
('cs-vn-1179', '200 Phú Thọ, Phường 4', 'Quận 11', 1, 'cpo-vinfast', 'Trạm sạc Chợ Phú Thọ', 10.7605, 106.6435),
('cs-vn-1180', '19 Thái Phiên, Phường 16', 'Quận 11', 0, 'cpo-siemens', 'Trạm sạc Thái Phiên', 10.7595, 106.6475),
('cs-vn-1181', '30 Nguyễn Chí Thanh, Phường 16', 'Quận 11', 1, 'cpo-abb', 'Trạm sạc Bệnh Viện Chợ Rẫy Q11', 10.7571, 106.6531),
('cs-vn-1182', '55 Hồng Bàng, Phường 16', 'Quận 11', 1, 'cpo-vinfast', 'Trạm sạc Cây Gõ', 10.7565, 106.6441),

-- KHU VỰC TÂN PHÚ
('cs-vn-1183', '30 Bờ Bao Tân Thắng, Phường Sơn Kỳ', 'Tân Phú', 1, 'cpo-vinfast', 'Trạm sạc Aeon Mall Tân Phú', 10.8016, 106.6163),
('cs-vn-1184', '212 Thoại Ngọc Hầu, Phường Phú Thạnh', 'Tân Phú', 1, 'cpo-abb', 'Trạm sạc Big C Phú Thạnh', 10.7855, 106.6285),
('cs-vn-1185', '685 Âu Cơ, Phường Tân Thành', 'Tân Phú', 1, 'cpo-siemens', 'Trạm sạc Ngã Ba Bà Quẹo', 10.7951, 106.6351),
('cs-vn-1186', '239 Lũy Bán Bích, Phường Hiệp Tân', 'Tân Phú', 1, 'cpo-chargeplus', 'Trạm sạc Co.opmart Hòa Bình', 10.7785, 106.6261),
('cs-vn-1187', '90 Tân Sơn Nhì, Phường Tân Sơn Nhì', 'Tân Phú', 0, 'cpo-evercharge', 'Trạm sạc Tân Sơn Nhì', 10.8021, 106.6301),
('cs-vn-1188', '15 Vườn Lài, Phường Phú Thọ Hòa', 'Tân Phú', 1, 'cpo-schneider', 'Trạm sạc Chợ Vườn Lài', 10.7925, 106.6251),
('cs-vn-1189', '258 Lê Trọng Tấn, Phường Tây Thạnh', 'Tân Phú', 1, 'cpo-vinfast', 'Trạm sạc Đại học Công Thương', 10.8085, 106.6185),
('cs-vn-1190', '100 Trương Vĩnh Ký, Phường Tân Thành', 'Tân Phú', 1, 'cpo-abb', 'Trạm sạc Trương Vĩnh Ký', 10.7961, 106.6281),
('cs-vn-1191', '50 Độc Lập, Phường Tân Thành', 'Tân Phú', 0, 'cpo-siemens', 'Trạm sạc Độc Lập', 10.7935, 106.6291),
('cs-vn-1192', '120 Gò Dầu, Phường Tân Quý', 'Tân Phú', 1, 'cpo-chargeplus', 'Trạm sạc Gò Dầu', 10.7965, 106.6215),
('cs-vn-1193', '45 Tân Kỳ Tân Quý, Phường Tân Sơn Nhì', 'Tân Phú', 1, 'cpo-vinfast', 'Trạm sạc Tân Kỳ Tân Quý', 10.8035, 106.6255),
('cs-vn-1194', '180 Kênh Tân Hóa, Phường Phú Trung', 'Tân Phú', 1, 'cpo-evercharge', 'Trạm sạc Phú Trung', 10.7751, 106.6355),
('cs-vn-1195', '55 Thạch Lam, Phường Hiệp Tân', 'Tân Phú', 1, 'cpo-schneider', 'Trạm sạc Thạch Lam', 10.7815, 106.6241),
('cs-vn-1196', '95 Bình Long, Phường Bình Hưng Hòa A', 'Tân Phú', 1, 'cpo-vinfast', 'Trạm sạc Bình Long', 10.7865, 106.6151),
('cs-vn-1197', '210 Tây Thạnh, Phường Tây Thạnh', 'Tân Phú', 1, 'cpo-abb', 'Trạm sạc KCN Tân Bình', 10.8121, 106.6221),
('cs-vn-1198', '115 Nguyễn Sơn, Phường Phú Thạnh', 'Tân Phú', 1, 'cpo-siemens', 'Trạm sạc Chợ Nguyễn Sơn', 10.7881, 106.6255),
('cs-vn-1199', '20 Dân Tộc, Phường Tân Thành', 'Tân Phú', 0, 'cpo-chargeplus', 'Trạm sạc Dân Tộc', 10.7915, 106.6321),
('cs-vn-1200', '85 Cây Keo, Phường Hiệp Tân', 'Tân Phú', 1, 'cpo-vinfast', 'Trạm sạc Cây Keo', 10.7821, 106.6211);

UPDATE charging_station 
SET number_of_saves = 0, hit_full_count = 0;


-- ==============================================================================
-- 2. INSERT DATA CHO CHARGING_POINT
-- ==============================================================================
INSERT INTO charging_point (id, status, charging_station_id)
SELECT 
    REPLACE(cs.id, 'cs-', 'cp-') || '-' || LPAD(g.n::text, 2, '0') AS id,
    (ARRAY[0, 1, 2, 3])[floor(random() * 4 + 1)::int] AS status,
    cs.id AS charging_station_id
FROM 
    charging_station cs,
    -- Tạo ngẫu nhiên từ 5 đến 15 điểm sạc cho mỗi trạm để thay thế total_points
    LATERAL generate_series(1, floor(random() * 11 + 5)::int) AS g(n)
WHERE cs.id >= 'cs-vn-1001' AND cs.id <= 'cs-vn-1200';


-- ==============================================================================
-- 3. INSERT DATA CHO CONNECTOR
-- Cập nhật: Chỉ tạo 2 connector (đầu sạc) cho mỗi charging_point
-- ==============================================================================
INSERT INTO connector (id, is_available, max_power, price, type, voltage, charging_point_id)
WITH connector_mock AS (
    SELECT 
        cp.id AS point_id,
        REPLACE(cp.id, 'cp-', 'cn-') || '-' || g.n::text AS id,
        floor(random() * 5 + 1)::int AS profile_id, 
        (floor(random() * 9 + 31) * 100)::double precision AS price
    FROM 
        charging_point cp,
        LATERAL generate_series(1, 2) AS g(n)  -- <=== Đã thay đổi cứng thành 2 đầu sạc
    WHERE cp.charging_station_id >= 'cs-vn-1001' AND cp.charging_station_id <= 'cs-vn-1200'
)
SELECT 
    id,
    true AS is_available,
    CASE 
        WHEN profile_id = 1 THEN (ARRAY[7.4, 22.0])[floor(random() * 2 + 1)::int] 
        WHEN profile_id = 2 THEN 50.0  
        WHEN profile_id = 3 THEN 150.0 
        WHEN profile_id = 4 THEN 250.0 
        ELSE (ARRAY[150.0, 250.0])[floor(random() * 2 + 1)::int] 
    END AS max_power,
    price,
    CASE 
        WHEN profile_id = 1 THEN 1 -- Type 2 (Sạc chậm AC)
        WHEN profile_id = 2 THEN 2 -- CHAdeMO
        WHEN profile_id = 3 THEN 0 -- CCS2 (Sạc nhanh DC)
        WHEN profile_id = 4 THEN 0 -- CCS2
        ELSE 3                     -- Tesla
    END AS type,
    CASE 
        WHEN profile_id = 1 THEN 220.0
        WHEN profile_id = 2 THEN 400.0
        WHEN profile_id = 3 THEN 400.0
        WHEN profile_id = 4 THEN 800.0
        ELSE 400.0
    END AS voltage,
    point_id AS charging_point_id
FROM connector_mock;