import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.role !== 'Admin') {
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
        }
    }, []);

    const [phims, setPhims] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhim, setEditingPhim] = useState(null);
    const [formData, setFormData] = useState({
        MaPhim: '', TenPhim: '', ThoiLuong: 0, NgonNgu: '', QuocGia: '',
        DaoDien: '', DienVienChinh: '', NgayKhoiChieu: '', MoTaNoiDung: '', DoTuoi: 13, ChuDePhim: '', Anh: ''
    });

    const fetchPhims = async () => {
        try {
            const res = await axiosClient.get('/admin/phims', { params: { keyword } });
            setPhims(res.data.meta);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchPhims(); }, [keyword]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;
        try {
            await axiosClient.delete(`/admin/phims/${id}`);
            alert("Xóa thành công!");
            fetchPhims();
        } catch (error) { alert("Lỗi xóa: " + error.message); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPhim) await axiosClient.put(`/admin/phims/${editingPhim.MaPhim}`, formData);
            else await axiosClient.post('/admin/phims', formData);
            alert(editingPhim ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setIsModalOpen(false);
            fetchPhims();
        } catch (error) { alert("Lỗi: " + error.message); }
    };

    const openEdit = (phim) => {
        setEditingPhim(phim);
        setFormData({ ...phim, NgayKhoiChieu: phim.NgayKhoiChieu.split('T')[0] });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingPhim(null);
        setFormData({
            MaPhim: '', TenPhim: '', ThoiLuong: 0, NgonNgu: '', QuocGia: '',
            DaoDien: '', DienVienChinh: '', NgayKhoiChieu: '', MoTaNoiDung: '', DoTuoi: 13, ChuDePhim: '', Anh: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#111] pt-24 px-6 pb-10">
            <div className="container mx-auto">
                {/* Header Admin */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex gap-3">
                        <button onClick={openAdd} className="bg-[#00E5FF] text-black px-5 py-2 rounded-lg font-bold hover:bg-[#00cce6] transition shadow-lg">
                            + Thêm Phim
                        </button>
                        <button onClick={fetchPhims} className="bg-gray-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-700 transition border border-gray-600">
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm phim trong database..." 
                        className="w-full p-4 rounded-xl bg-[#1a1a1a] text-white border border-gray-700 focus:border-[#00E5FF] outline-none transition"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Mã</th>
                                <th className="p-4 font-semibold">Poster</th>
                                <th className="p-4 font-semibold">Tên Phim</th>
                                <th className="p-4 font-semibold">Năm</th>
                                <th className="p-4 font-semibold">Thời Lượng</th>
                                <th className="p-4 font-semibold">Rating</th>
                                <th className="p-4 font-semibold text-right">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {phims.map(p => (
                                <tr key={p.MaPhim} className="hover:bg-gray-800/50 transition">
                                    <td className="p-4 text-gray-400 font-mono text-sm">{p.MaPhim}</td>
                                    <td className="p-4">
                                        <img 
                                            src={p.Anh} 
                                            alt={p.TenPhim} 
                                            className="w-10 h-14 object-cover rounded bg-gray-800 border border-gray-700"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/40x56?text=NA'}
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-white">{p.TenPhim}</td>
                                    <td className="p-4 text-gray-300">{new Date(p.NgayKhoiChieu).getFullYear()}</td>
                                    <td className="p-4 text-gray-300">{p.ThoiLuong}p</td>
                                    <td className="p-4 text-yellow-400 font-bold">★ {p.DiemDanhGia || 'N/A'}</td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button onClick={() => openEdit(p)} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition text-sm">Edit</button>
                                        <button onClick={() => handleDelete(p.MaPhim)} className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded transition text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form (Giữ nguyên logic, chỉ chỉnh style tối) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingPhim ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Fields */}
                            {['MaPhim', 'TenPhim', 'ThoiLuong', 'NgayKhoiChieu', 'DaoDien', 'DienVienChinh', 'QuocGia', 'NgonNgu', 'DoTuoi', 'ChuDePhim'].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs text-gray-400 uppercase mb-1">{field}</label>
                                    <input 
                                        type={field === 'ThoiLuong' || field === 'DoTuoi' ? 'number' : field === 'NgayKhoiChieu' ? 'date' : 'text'}
                                        required 
                                        disabled={field === 'MaPhim' && !!editingPhim}
                                        value={formData[field]} 
                                        onChange={e => setFormData({...formData, [field]: e.target.value})} 
                                        className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm text-gray-400">Ngày Khởi Chiếu</label>
                                <input type="date" required value={formData.NgayKhoiChieu} onChange={e => setFormData({...formData, NgayKhoiChieu: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-400">Ngôn Ngữ</label>
                                <input type="text" value={formData.NgonNgu} onChange={e => setFormData({...formData, NgonNgu: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Quốc Gia</label>
                                <input type="text" value={formData.QuocGia} onChange={e => setFormData({...formData, QuocGia: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Đạo Diễn</label>
                                <input type="text" value={formData.DaoDien} onChange={e => setFormData({...formData, DaoDien: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Diễn Viên Chính</label>
                                <input type="text" value={formData.DienVienChinh} onChange={e => setFormData({...formData, DienVienChinh: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Độ Tuổi</label>
                                <input type="number" value={formData.DoTuoi} onChange={e => setFormData({...formData, DoTuoi: parseInt(e.target.value)})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Chủ Đề</label>
                                <input type="text" value={formData.ChuDePhim} onChange={e => setFormData({...formData, ChuDePhim: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"/>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm text-gray-400">URL Ảnh Poster</label>
                                <input type="text" value={formData.Anh} onChange={e => setFormData({...formData, Anh: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600" placeholder="https://..."/>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm text-gray-400">Mô Tả Nội Dung</label>
                                <textarea rows="3" value={formData.MoTaNoiDung} onChange={e => setFormData({...formData, MoTaNoiDung: e.target.value})} className="w-full p-2 bg-gray-800 rounded border border-gray-600"></textarea>
                            </div>

                            <div className="col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-[#00E5FF] text-black font-bold rounded-lg hover:bg-[#00cce6]">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;