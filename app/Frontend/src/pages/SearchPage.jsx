import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    
    // State form
    const [formData, setFormData] = useState({
        keyword: searchParams.get('keyword') || '',
        genre: searchParams.get('genre') || '',
        year: searchParams.get('year') || '',
        minRating: 0,
        sortBy: 'TenPhim'
    });

    const handleSearch = async () => {
        try {
            // Gọi API Backend (Backend sẽ gọi SP_TimKiemPhim)
            // Giả sử API là /auth/phims/advanced-search
            const res = await axiosClient.get('/auth/phims/search', { params: formData });
            setResults(res.data.meta);
        } catch (error) {
            console.error(error);
            setResults([]);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen pt-24 pb-10 px-4">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Tìm Kiếm Nâng Cao</h1>

                {/* Form Tìm Kiếm */}
                <div className="bg-gray-800 p-6 rounded-xl mb-10 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Tên phim</label>
                            <input 
                                type="text" 
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={formData.keyword}
                                onChange={e => setFormData({...formData, keyword: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Điểm đánh giá (Min)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={formData.minRating}
                                onChange={e => setFormData({...formData, minRating: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Sắp xếp theo</label>
                            <select 
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={formData.sortBy}
                                onChange={e => setFormData({...formData, sortBy: e.target.value})}
                            >
                                <option value="TenPhim">Tên phim (A-Z)</option>
                                <option value="NamSanXuat">Năm sản xuất</option>
                                <option value="DiemDanhGia">Điểm đánh giá</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={handleSearch}
                        className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition"
                    >
                        TÌM KIẾM
                    </button>
                </div>

                {/* Kết quả */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {results.map(phim => (
                        <MovieCard key={phim.MaPhim} movie={phim} />
                    ))}
                </div>
                {results.length === 0 && <p className="text-center text-gray-500">Không tìm thấy phim nào.</p>}
            </div>
        </div>
    );
};

export default SearchPage;