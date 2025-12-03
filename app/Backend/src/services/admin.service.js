import prisma from "../common/prisma/prisma.init.js";
import { BadRequestError } from "../helpers/handleError.js";

class AdminService {
    // 1. Tìm kiếm phim (Gọi SP_TimKiemPhim)
    async getPhims(keyword) {
        const search = keyword || "";
        // Gọi Stored Procedure bằng Prisma Raw Query
        const phims = await prisma.$queryRaw`CALL SP_TimKiemPhim(${search})`;
        return phims;
    }

    // 2. Xóa phim (Gọi SP_Delete_PHIM_Flexible)
    async deletePhim(id) {
        await prisma.$executeRaw`CALL SP_Delete_PHIM_Flexible(${id})`;
        return { message: "Xóa thành công" };
    }
    
    // 3. Thêm phim (Gọi SP_Insert_PHIM)
    async createPhim(data) {
        const {
            MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, 
            DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim
        } = data;

        try {
            await prisma.$executeRaw`
                CALL SP_Insert_PHIM(
                    ${MaPhim}, ${TenPhim}, ${ThoiLuong}, ${NgonNgu}, ${QuocGia},
                    ${DaoDien}, ${DienVienChinh}, ${new Date(NgayKhoiChieu)}, 
                    ${MoTaNoiDung}, ${DoTuoi}, ${ChuDePhim}
                )
            `;
            return { message: "Thêm phim thành công" };
        } catch (error) {
            // Lỗi từ SIGNAL SQLSTATE trong SP sẽ văng ra đây
            throw new BadRequestError(error.message.split('\n').pop()); 
        }
    }

    // 4. Cập nhật phim - Gọi SP_Update_PHIM
    async updatePhim(MaPhim, data) {
        const {
            TenPhim, ThoiLuong, NgonNgu, QuocGia, 
            DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim
        } = data;

        try {
            await prisma.$executeRaw`
                CALL SP_Update_PHIM(
                    ${MaPhim}, ${TenPhim}, ${ThoiLuong}, ${NgonNgu}, ${QuocGia},
                    ${DaoDien}, ${DienVienChinh}, ${new Date(NgayKhoiChieu)}, 
                    ${MoTaNoiDung}, ${DoTuoi}, ${ChuDePhim}
                )
            `;
            return { message: "Cập nhật phim thành công" };
        } catch (error) {
            throw new BadRequestError(error.message.split('\n').pop());
        }
    }
}

export default new AdminService();