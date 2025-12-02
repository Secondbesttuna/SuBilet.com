import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>✈️ ŞUBİLET</h3>
          <p>Türkiye'nin en güvenilir uçak bileti karşılaştırma ve rezervasyon platformu</p>
        </div>
        <div className="footer-section">
          <h4>Hızlı Linkler</h4>
          <ul>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/flights">Uçuşlar</a></li>
            <li><a href="/reservations">Rezervasyonlar</a></li>
            <li><a href="/about">Hakkımızda</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>İletişim</h4>
          <p>Email: info@subilet.com</p>
          <p>Tel: +90 (312) 555 00 00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 ŞUBİLET - Tüm Hakları Saklıdır | TOBB ETÜ BIL372 Projesi</p>
      </div>
    </footer>
  );
}

export default Footer;








