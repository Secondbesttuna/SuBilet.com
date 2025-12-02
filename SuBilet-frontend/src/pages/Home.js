import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportService from '../services/AirportService';
import { showWarning } from '../utils/notification';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    originAirportId: '',
    destinationAirportId: '',
    date: ''
  });

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
    
    // Giriş kontrolü - giriş yapmadan uçuş aranamaz
    const token = sessionStorage.getItem('token');
    if (!token) {
      showWarning('Giriş Gerekli', 'Uçuş aramak için lütfen giriş yapın!');
      navigate('/auth');
      return;
    }

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

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">ŞUBİLET'e Hoş Geldiniz</h1>
          <p className="hero-subtitle">
            Türkiye'nin tüm havayolu firmalarını karşılaştırın, en uygun uçuş biletini bulun!
          </p>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <h2>Uçuş Ara</h2>
          
          {error && (
            <div className="error-box">
              <strong>⚠️ Hata:</strong> {error}
            </div>
          )}
          
          {loading && (
            <div className="loading-box">
              <div className="spinner-small"></div>
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
                      {airport.code} - {airport.name} ({airport.city?.city || 'N/A'})
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
                      {airport.code} - {airport.name} ({airport.city?.city || 'N/A'})
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
            </div>

            <button type="submit" className="btn-search" disabled={loading || error}>
              🔍 Uçuş Ara
            </button>
          </form>
        </div>
      </div>

      <div className="features-section">
        <h2>Neden ŞUBİLET?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✈️</div>
            <h3>Tüm Havayolları</h3>
            <p>Türkiye'nin önde gelen tüm havayolu firmalarını tek bir platformda karşılaştırın.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>En İyi Fiyatlar</h3>
            <p>En uygun fiyatlı biletleri bulun, bütçenize en uygun seçeneği seçin.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Güvenli Ödeme</h3>
            <p>256-bit SSL şifreleme ile güvenli ödeme yapın.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>7/24 Destek</h3>
            <p>İhtiyacınız olduğunda her zaman yanınızdayız.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
