--  Demo Nghiệp vụ 1: Quản lý Phim & Suất Chiếu (Admin)
-- Mục tiêu: Thêm phim mới và kiểm tra ràng buộc ngày chiếu.

-- 1. Thêm một phim mới (Thành công)
-- Phim 'Đất Rừng Phương Nam', khởi chiếu 2024-12-20
CALL SP_Insert_PHIM(
    'PH999', N'Đất Rừng Phương Nam', 110, N'Tiếng Việt', N'Việt Nam', 
    N'Nguyễn Quang Dũng', N'Hồng Ánh', '2024-12-20', 
    N'Phim lịch sử', 13, N'Lịch sử'
);
-- Kiểm tra phim đã vào chưa
SELECT * FROM PHIM WHERE MaPhim = 'PH999';

-- 2. Thử thêm suất chiếu SAI quy định (Trigger TRG_SC_CheckNgayPhim)
-- Ngày chiếu (2024-12-01) < Ngày khởi chiếu (2024-12-20) -> Sẽ báo lỗi
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai)
VALUES ('SC999', 'PH999', 'P001', '2024-12-01', '18:00', '20:00', 100000, 'Đang mở');
-- (Mong đợi: Error Code: 1644. Ngày chiếu phải >= ngày khởi chiếu phim.)

-- 3. Thêm suất chiếu ĐÚNG quy định
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai)
VALUES ('SC999', 'PH999', 'P001', '2024-12-25', '18:00', '20:00', 100000, 'Đang mở');

-- Demo Nghiệp vụ 2: Quy trình Đặt vé & Mua bắp nước (Khách hàng)
-- Mục tiêu: Tạo đơn hàng, đặt vé, mua bắp nước, hệ thống tự tính tiền và xử lý thanh toán.

-- 1. Khách hàng KH001 tạo đơn hàng mới
CALL SP_TaoDonHang('DH_DEMO', 'KH001', 'App Mobile');

-- Kiểm tra đơn hàng vừa tạo (TongTien = 0)
SELECT * FROM DON_HANG WHERE MaDonHang = 'DH_DEMO';

-- 2. Khách đặt vé cho suất chiếu SC999 vừa tạo
-- Giá vé cơ bản là 100,000. Đặt ghế A1.
CALL SP_DatVe('VE_DEMO', 'SC999', 'P001', 'A', 1, 'KH001', 'DH_DEMO');

-- Kiểm tra:
-- 1. Bảng VE_XEM_PHIM đã có vé.
-- 2. Bảng DON_HANG: TongTien đã tự nhảy lên 100,000 (do SP_DatVe cập nhật).
SELECT * FROM DON_HANG WHERE MaDonHang = 'DH_DEMO';

-- 3. Khách mua thêm Combo bắp nước (MH003 - Giá 70,000)
-- Số lượng: 2 combo.
CALL SP_ThemMatHangVaoDon('DH_DEMO', 'MH003', 2);

-- Kiểm tra Trigger TRG_GOM_UpdateTongTien_Insert hoạt động chưa
-- Tổng tiền mong đợi: 100,000 (Vé) + 2 * 70,000 (Bắp) = 240,000
SELECT MaDonHang, TongTien, TrangThai FROM DON_HANG WHERE MaDonHang = 'DH_DEMO';

-- 4. Thanh toán đơn hàng
-- Thêm record vào bảng THANH_TOAN
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien)
VALUES ('TT_DEMO', 'DH_DEMO', NOW(), 'Thẻ tín dụng', 'Đã thanh toán', 240000);

-- Cập nhật trạng thái đơn hàng
CALL SP_CapNhatTrangThaiDon('DH_DEMO', 'Đã thanh toán');

-- Cập nhật trạng thái vé (Trigger TRG_VE_CheckThanhToan sẽ cho phép vì đơn đã thanh toán)
UPDATE VE_XEM_PHIM SET TrangThai = 'Đã thanh toán' WHERE MaVe = 'VE_DEMO';

-- 5. Kiểm tra điểm tích lũy (Trigger TRG_TT_CongDiemThuong)
-- 240,000 VNĐ -> Cộng 24 điểm.
-- Kiểm tra điểm của KH001 (Ban đầu là 10, giờ phải là 34)
SELECT MaNguoiDung, DiemTichLuy FROM KHACH_HANG WHERE MaNguoiDung = 'KH001';

-- Demo Nghiệp vụ 3: Kiểm tra các ràng buộc Logic (Negative Test)
-- Mục tiêu: Chứng minh hệ thống ngăn chặn được các thao tác sai.

-- 1. Kiểm tra trùng ghế
-- Cố tình đặt lại ghế A1 của suất SC999 (đã được KH001 đặt ở trên) cho khách KH002
CALL SP_TaoDonHang('DH_FAIL', 'KH002', 'Tại quầy');

-- Lệnh này sẽ báo lỗi do SP_DatVe kiểm tra ghế trống
CALL SP_DatVe('VE_FAIL', 'SC999', 'P001', 'A', 1, 'KH002', 'DH_FAIL');
-- (Mong đợi: Error Code: 45000. Ghế này đã được đặt.)

-- 2. Kiểm tra đánh giá phim khi chưa xem (Trigger TRG_DG_ChiDaMuaVe)
-- KH002 chưa từng mua vé xem phim 'PH999' (Đất Rừng Phương Nam)
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo)
VALUES ('DG_FAIL', 'KH002', 'PH999', 'Phim hay lắm', NOW(), 10);
-- (Mong đợi: Error Code: 1644. Chỉ khách đã mua vé xem phim mới được đánh giá)

-- 3. Kiểm tra Admin không được đặt hàng (Trigger TRG_DH_KhongChoQTVDat)
-- AD001 là quản trị viên
CALL SP_TaoDonHang('DH_ADMIN', 'AD001', 'App');
-- (Mong đợi: Error Code: 1644. Quản trị viên không được phép tạo đơn hàng)

--Demo Nghiệp vụ 4: Báo cáo & Thống kê
--Mục tiêu: Xem dữ liệu tổng hợp.

-- 1. Xem lịch chiếu ngày 25/11/2024 (Dữ liệu mẫu có sẵn)
CALL SP_XemLichChieu('2024-11-25');

-- 2. Xem báo cáo doanh thu theo phim
-- Sẽ thấy phim PH999 vừa bán được 1 vé, doanh thu 100,000
CALL SP_BaoCaoDoanhThuPhim();

-- 3. Xem lịch sử giao dịch của KH001
-- Sẽ thấy đơn hàng DH_DEMO vừa tạo
CALL SP_LichSuGiaoDich('KH001');


