import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportService from '../services/AirportService';
import UserLogin from './UserLogin';
import { showWarning } from '../utils/notification';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    originAirportId: '',
    destinationAirportId: '',
    date: ''
  });

  useEffect(() => {
    // Kullanıcı giriş durumunu kontrol et
    const checkCustomer = () => {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        setCustomer(JSON.parse(customerData));
      } else {
        setCustomer(null);
      }
    };

    checkCustomer();

    // localStorage değişikliklerini dinle
    window.addEventListener('customerLogin', checkCustomer);
    window.addEventListener('customerLogout', checkCustomer);

    return () => {
      window.removeEventListener('customerLogin', checkCustomer);
      window.removeEventListener('customerLogout', checkCustomer);
    };
  }, []);

  useEffect(() => {
    // Havalimanlarını yükle
    setLoading(true);
    AirportService.getAllAirports()
      .then(response => {
        const airports = response.data || response.apiResponse?.data || [];
        setAirports(Array.isArray(airports) ? airports : []);
        setLoading(false);
        console.log('✅ Havalimanları yüklendi:', airports.length, 'adet');
      })
      .catch(error => {
        console.error('❌ Havalimanları yüklenemedi:', error);
        setError('Backend çalışmıyor olabilir. Lütfen backend\'i başlatın: cd SuBilet-backend && mvn spring-boot:run');
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.originAirportId || !formData.destinationAirportId || !formData.date) {
      showWarning('Eksik Bilgi', 'Lütfen tüm alanları doldurun!');
      return;
    }

    if (formData.originAirportId === formData.destinationAirportId) {
      showWarning('Geçersiz Seçim', 'Kalkış ve varış havalimanları aynı olamaz!');
      return;
    }

    // Arama sonuçlarına yönlendir
    navigate(`/flights/search?origin=${formData.originAirportId}&destination=${formData.destinationAirportId}&date=${formData.date}`);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSuccess = (customerData) => {
    setCustomer(customerData);
    window.dispatchEvent(new Event('customerLogin'));
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    setCustomer(null);
    window.dispatchEvent(new Event('customerLogout'));
  };

  return (
    <div className="home">
      {showLogin && (
        <UserLogin 
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">✈️ ŞUBİLET'e Hoş Geldiniz</h1>
          <p className="hero-subtitle">
            Türkiye'nin tüm havayolu firmalarını karşılaştırın, en uygun uçuş biletini bulun!
          </p>
          
          {/* Kullanıcı Giriş Durumu */}
          <div className="user-status">
            {customer ? (
              <div className="logged-in">
                <span>Hoş geldiniz, <strong>{customer.isimSoyad}</strong></span>
                <div className="user-actions">
                  <button onClick={() => navigate('/reservations')} className="btn-reservations">
                    Rezervasyonlarım
                  </button>
                  <button onClick={handleLogout} className="btn-logout">
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="btn-login-hero">
                🔐 Kullanıcı Girişi
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <h2>Uçuş Ara</h2>
          
          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <strong>⚠️ Hata:</strong> {error}
            </div>
          )}
          
          {loading && (
            <div style={{textAlign: 'center', padding: '20px', color: '#667eea'}}>
              <div style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              Havalimanları yükleniyor...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="originAirportId">Nereden</label>
                <select
                  id="originAirportId"
                  name="originAirportId"
                  value={formData.originAirportId}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={loading || error}
                >
                  <option value="">
                    {loading ? 'Yükleniyor...' : error ? 'Backend çalışmıyor' : 'Kalkış Havalimanı Seçin'}
                  </option>
                  {airports.map(airport => (
                    <option key={airport.airportId} value={airport.airportId}>
                      {airport.code} - {airport.name} ({airport.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="destinationAirportId">Nereye</label>
                <select
                  id="destinationAirportId"
                  name="destinationAirportId"
                  value={formData.destinationAirportId}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={loading || error}
                >
                  <option value="">
                    {loading ? 'Yükleniyor...' : error ? 'Backend çalışmıyor' : 'Varış Havalimanı Seçin'}
                  </option>
                  {airports.map(airport => (
                    <option key={airport.airportId} value={airport.airportId}>
                      {airport.code} - {airport.name} ({airport.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Tarih</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn-search">
                  Uçuş Ara
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="features-section">
        <h2>Neden ŞUBİLET?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Kolay Arama</h3>
            <p>Tüm havayolu firmalarının uçuşlarını tek bir platformda karşılaştırın</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>En İyi Fiyat</h3>
            <p>Fiyat, saat ve aktarma bilgilerine göre en uygun uçuşu bulun</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Hızlı Rezervasyon</h3>
            <p>Saniyeler içinde rezervasyon yapın ve biletinizi alın</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Güvenli Ödeme</h3>
            <p>256-bit SSL ile korunan güvenli ödeme altyapısı</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

