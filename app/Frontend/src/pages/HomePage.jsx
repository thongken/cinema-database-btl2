import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [phims, setPhims] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const navigate = useNavigate();

    // Search State
    const [keyword, setKeyword] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        axiosClient.get('/auth/phims/search?keyword=') 
            .then(res => {
                const list = res.data.meta || [];
                setPhims(list);
                if (list.length > 0) setFeaturedMovie(list[0]);
            })
            .catch(err => console.log(err));
    }, []);

    const handleSearch = () => {
        navigate(`/search?keyword=${keyword}&genre=${genre}&year=${year}`);
    };

    return (
        <div className="min-h-screen bg-[#111] pb-20">
            
            {/* --- 1. HERO BANNER --- */}
            <div className="relative w-full h-[550px] flex items-center justify-center bg-black">
                {featuredMovie && (
                    <>
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-60"
                            style={{ backgroundImage: `url(${featuredMovie.Anh})` }}
                        ></div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                    </>
                )}

                <div className="relative z-10 text-center px-4 w-full max-w-5xl mt-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-tight">
                        KHÁM PHÁ THẾ GIỚI ĐIỆN ẢNH
                    </h1>
                    <p className="text-gray-300 text-lg mb-10 font-light">
                        Nơi tổng hợp hàng ngàn bộ phim chất lượng cao.
                    </p>

                    {/* --- 2. GLASS SEARCH BAR --- */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 mx-auto">
                        <input 
                            type="text" 
                            placeholder="Nhập tên phim..." 
                            className="flex-1 bg-transparent border-b border-gray-500 text-white placeholder-gray-400 px-2 py-2 focus:outline-none focus:border-[#00E5FF] transition"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        
                        <select 
                            className="bg-transparent border-b border-gray-500 text-gray-300 px-2 py-2 focus:outline-none focus:border-[#00E5FF] cursor-pointer md:w-40"
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Tất cả thể loại</option>
                            <option value="Hành động" className="bg-gray-900">Hành động</option>
                            <option value="Tình cảm" className="bg-gray-900">Tình cảm</option>
                        </select>

                        <select 
                            className="bg-transparent border-b border-gray-500 text-gray-300 px-2 py-2 focus:outline-none focus:border-[#00E5FF] cursor-pointer md:w-32"
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Tất cả năm</option>
                            <option value="2024" className="bg-gray-900">2024</option>
                            <option value="2023" className="bg-gray-900">2023</option>
                        </select>

                        <button 
                            onClick={handleSearch}
                            className="bg-[#00E5FF] hover:bg-[#00cce6] text-black font-bold px-8 py-3 rounded-xl transition shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            TÌM KIẾM
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 3. SECTIONS (SLIDER) --- */}
            <div className="container mx-auto px-6 py-12 space-y-16">
                
                {/* Section: Phim Đang Chiếu */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-[#00E5FF] pl-4">
                            Phim Đang Chiếu
                        </h2>
                        <button className="text-gray-400 hover:text-white text-sm font-medium transition">Xem tất cả &rarr;</button>
                    </div>
                    {/* Horizontal Scroll Container */}
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                        {phims.map(phim => (
                            <MovieCard key={phim.MaPhim} movie={phim} />
                        ))}
                    </div>
                </div>

                {/* Section: Top Trending (Giả lập dữ liệu giống nhau) */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-yellow-500 pl-4">
                            Top Trending
                        </h2>
                        <select className="bg-[#141414] border border-gray-700 text-xs text-gray-300 rounded px-2 py-1 outline-none">
                            <option>Hôm nay</option>
                            <option>Tuần này</option>
                        </select>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                        {[...phims].reverse().map(phim => (
                            <MovieCard key={`trend-${phim.MaPhim}`} movie={phim} />
                        ))}
                    </div>
                </div>

            </div>

            {/* --- 4. FOOTER --- */}
            <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
                <p>&copy; 2025 MovieHub – All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
