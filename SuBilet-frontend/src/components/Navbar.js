import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Kullanıcı durumunu kontrol et
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      setCustomer(JSON.parse(customerData));
    }

    // localStorage değişikliklerini dinle
    const handleStorageChange = () => {
      const updatedCustomer = localStorage.getItem('customer');
      setCustomer(updatedCustomer ? JSON.parse(updatedCustomer) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customerLogin', handleStorageChange);
    window.addEventListener('customerLogout', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customerLogin', handleStorageChange);
      window.removeEventListener('customerLogout', handleStorageChange);
    };
  }, []);

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
          {customer && (
            <li className="navbar-item">
              <Link to="/reservations" className="navbar-link">Rezervasyonlarım</Link>
            </li>
          )}
          <li className="navbar-item">
            <Link to="/admin" className="navbar-link admin-link">Admin</Link>
          </li>
          {customer && (
            <li className="navbar-item">
              <span className="navbar-user">
                👤 {customer.isimSoyad}
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

