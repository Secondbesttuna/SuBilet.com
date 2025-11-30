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
        <Link to="/" className="navbar-logo">
          ✈️ ŞUBİLET
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Ana Sayfa</Link>
          </li>
          {user && userType === 'CUSTOMER' && (
            <li className="navbar-item">
              <Link to="/reservations" className="navbar-link">Rezervasyonlarım</Link>
            </li>
          )}
          {!user && (
            <li className="navbar-item">
              <Link to="/auth" className="navbar-link">Giriş Yap / Kayıt Ol</Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {user && (
            <>
              <span className="navbar-user">
                Hoş geldin, {user.isimSoyad || user.fullName || user.username}
              </span>
              <button onClick={handleLogout} className="navbar-link" style={{background: 'transparent', border: 'none', cursor: 'pointer'}}>
                Çıkış Yap
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
