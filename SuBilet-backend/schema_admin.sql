CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, -- Gerçek hayatta şifreli tutulur
    full_name VARCHAR(100)
);

-- İlk Admin'i de elle ekleyelim ki sisteme girebilecek biri olsun
INSERT INTO admin (username, password, full_name) 
VALUES ('admin', '12345', 'Sistem Yöneticisi');