import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // sessionStorage'dan user bilgisini oku
    const userData = sessionStorage.getItem('user');
    const type = sessionStorage.getItem('userType');
    if (userData && type) {
      setUser(JSON.parse(userData));
      setUserType(type);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('user');
      setUser(null);
      setUserType(null);
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Sol Taraf - Logo */}
        <Link to="/" className="navbar-logo">
          ✈️ ŞUBİLET
        </Link>

        {/* Sağ Taraf - Tüm Aksiyonlar */}
        <div className="navbar-right">
          {user ? (
            <div className="navbar-user-section">
              {userType === 'CUSTOMER' && (
                <Link to="/reservations" className="navbar-link">
                  📋 Rezervasyonlarım
                </Link>
              )}
              {userType === 'ADMIN' && (
                <Link to="/admin-dashboard" className="navbar-link admin-link">
                  🛡️ Admin Paneli
                </Link>
              )}
              <span className="navbar-user">
                👋 Hoş geldin, <strong>{user.isimSoyad || user.fullName || user.username}</strong>
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Çıkış Yap
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-login">
              Giriş Yap / Kayıt Ol
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
