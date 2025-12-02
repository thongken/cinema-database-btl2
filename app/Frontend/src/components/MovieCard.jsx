import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <div className="flex-none w-[160px] md:w-[200px] group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:z-10">
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-lg">
                <img 
                    src={movie.Anh || "https://via.placeholder.com/300x450?text=No+Image"} 
                    alt={movie.TenPhim} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image" }}
                />
            </div>

            {/* Overlay thông tin khi hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 rounded-xl">
                <Link 
                    to={`/movie/${movie.MaPhim}`}
                    className="bg-[#00E5FF] text-black px-4 py-2 rounded-full font-bold text-sm transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-white"
                >
                    Chi tiết
                </Link>
                <div className="text-center px-2">
                    <p className="text-white font-bold text-sm truncate">{movie.TenPhim}</p>
                    <p className="text-yellow-400 text-xs font-bold">⭐ {movie.DiemDanhGia || 8.5}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;