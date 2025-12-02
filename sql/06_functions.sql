USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   CÁC HÀM HỖ TRỢ (FUNCTIONS)
   ======================================================================= */

DELIMITER $$

-- 1. Hàm tính doanh thu của một phim
CREATE FUNCTION FUNC_TinhDoanhThuPhim(p_MaPhim VARCHAR(20)) 
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    DECLARE v_DoanhThu DECIMAL(18,2);
    
    SELECT COALESCE(SUM(v.GiaVeCuoi), 0) INTO v_DoanhThu
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    WHERE s.MaPhim = p_MaPhim AND v.TrangThai = 'Đã thanh toán';
    
    RETURN v_DoanhThu;
END$$

-- 2. Hàm kiểm tra ghế còn trống không (Trả về 1: Trống, 0: Đã đặt)
CREATE FUNCTION FUNC_KiemTraGheTrong(
    p_MaSuatChieu VARCHAR(20), 
    p_MaPhong VARCHAR(20), 
    p_HangGhe VARCHAR(10), 
    p_SoGhe INT
) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_Count INT;
    
    SELECT COUNT(*) INTO v_Count
    FROM VE_XEM_PHIM
    WHERE MaSuatChieu = p_MaSuatChieu
      AND MaPhong = p_MaPhong
      AND HangGhe = p_HangGhe
      AND SoGhe = p_SoGhe
      AND TrangThai <> 'Hủy';
      
    IF v_Count > 0 THEN
        RETURN 0; -- Đã có người đặt
    ELSE
        RETURN 1; -- Còn trống
    END IF;
END$$

-- 3. Hàm lấy tên phim từ mã suất chiếu
CREATE FUNCTION FUNC_LayTenPhimTuSuatChieu(p_MaSuatChieu VARCHAR(20))
RETURNS VARCHAR(200)
DETERMINISTIC
BEGIN
    DECLARE v_TenPhim VARCHAR(200);
    
    SELECT p.TenPhim INTO v_TenPhim
    FROM SUAT_CHIEU s
    JOIN PHIM p ON s.MaPhim = p.MaPhim
    WHERE s.MaSuatChieu = p_MaSuatChieu;
    
    RETURN v_TenPhim;
END$$

DELIMITER ;