USE CINEMA;

-- 1. Thêm cột Anh vào bảng PHIM
ALTER TABLE PHIM ADD COLUMN Anh VARCHAR(500);

-- 2. Cập nhật Poster (Dùng link ảnh chất lượng cao)
-- Phim 1: Avengers: Endgame
UPDATE PHIM SET Anh = 'https://static0.colliderimages.com/wordpress/wp-content/uploads/2019/03/avengers-endgame-poster.jpg' WHERE MaPhim = 'PH001';

-- Phim 2: Nhà Bà Nữ
UPDATE PHIM SET Anh = 'https://boxofficevietnam.com/wp-content/uploads/2023/01/NBN_MAIN-POSTER_compress.jpg' WHERE MaPhim = 'PH002';

-- Phim 3: Fast & Furious 9
UPDATE PHIM SET Anh = 'https://i.pinimg.com/736x/42/e0/72/42e07294dbb81693532529fe74ebd03f.jpg' WHERE MaPhim = 'PH003';

-- Phim 4: Conan Movie 26
UPDATE PHIM SET Anh = 'https://im4j1ner.com/wp-content/uploads/2023/02/image-9.png' WHERE MaPhim = 'PH004';

-- Phim 5: Spider-Man: No Way Home
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/original/tomAFJjfSCpsufKh1oYcoLmNjT9.jpg' WHERE MaPhim = 'PH005';