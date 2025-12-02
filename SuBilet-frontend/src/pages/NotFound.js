import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="plane-animation">
          <span className="plane">✈️</span>
          <div className="clouds">
            <span className="cloud">☁️</span>
            <span className="cloud">☁️</span>
            <span className="cloud">☁️</span>
          </div>
        </div>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Sayfa Bulunamadı</h2>
        <p className="error-message">
          Aradığınız sayfa türbülansa girmiş olabilir! 🌪️<br />
          Ya da bu rota artık uçuş planımızda yok.
        </p>
        
        <div className="error-details">
          <p>Olası nedenler:</p>
          <ul>
            <li>Sayfa taşınmış veya silinmiş olabilir</li>
            <li>URL adresi yanlış yazılmış olabilir</li>
            <li>Bu sayfa hiç var olmamış olabilir</li>
          </ul>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn-home">
            🏠 Ana Sayfaya Dön
          </Link>
          <button onClick={() => window.history.back()} className="btn-back">
            ← Geri Git
          </button>
        </div>

        <div className="fun-fact">
          <p>💡 Biliyor muydunuz? Uçaklar yılda ortalama 35.000 uçuş gerçekleştirir!</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

