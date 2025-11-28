import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import apiClient from '../utils/apiClient';
import ReservationService from '../services/ReservationService';
import { showWarning } from '../utils/notification';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalReservations: 0,
    totalCustomers: 0,
    totalAirports: 0
  });

  useEffect(() => {
    // Admin kontrolü
    const admin = localStorage.getItem('admin');
    if (!admin) {
      showWarning('Giriş Gerekli', 'Admin paneline erişmek için lütfen giriş yapın!');
      navigate('/admin');
      return;
    }

    // İstatistikleri yükle
    loadStats();
    loadData(activeTab);
  }, [navigate, activeTab]);

  const loadStats = async () => {
    try {
      const [flights, reservations, customers, airports] = await Promise.all([
        apiClient.get('/flights'),
        apiClient.get('/reservations'),
        apiClient.get('/customers'),
        apiClient.get('/airports')
      ]);

      const flightsData = flights.data || flights.apiResponse?.data || [];
      const reservationsData = reservations.data || reservations.apiResponse?.data || [];
      const customersData = customers.data || customers.apiResponse?.data || [];
      const airportsData = airports.data || airports.apiResponse?.data || [];

      setStats({
        totalFlights: Array.isArray(flightsData) ? flightsData.length : 0,
        totalReservations: Array.isArray(reservationsData) ? reservationsData.length : 0,
        totalCustomers: Array.isArray(customersData) ? customersData.length : 0,
        totalAirports: Array.isArray(airportsData) ? airportsData.length : 0
      });
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    }
  };

  const loadData = async (tab) => {
    setLoading(true);
    try {
      let endpoint = '';
      switch(tab) {
        case 'flights':
          endpoint = 'flights';
          break;
        case 'reservations':
          endpoint = 'reservations';
          break;
        case 'customers':
          endpoint = 'customers';
          break;
        case 'airports':
          endpoint = 'airports';
          break;
        case 'airlines':
          endpoint = 'airlines';
          break;
        default:
          endpoint = 'flights';
      }

      const response = await apiClient.get(`/${endpoint}`);
      const responseData = response.data || response.apiResponse?.data || [];
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin');
  };

  const handleCancelReservation = (reservationId, pnr) => {
    Modal.confirm({
      title: 'Rezervasyon İptali',
      content: `PNR: ${pnr} ile rezervasyonu iptal etmek istediğinize emin misiniz?`,
      okText: 'Evet, İptal Et',
      cancelText: 'Hayır',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await ReservationService.cancelReservation(reservationId);
          // Bildirim apiClient interceptor tarafından otomatik gösterilecek
          
          // Rezervasyonları yeniden yükle
          loadData('reservations');
          loadStats(); // İstatistikleri güncelle
        } catch (error) {
          console.error('İptal hatası:', error);
          // Hata bildirimi apiClient interceptor tarafından gösterilecek
        }
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('tr-TR');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛫 ŞUBİLET Admin Paneli</h1>
        <button onClick={handleLogout} className="btn-logout">
          Çıkış Yap
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✈️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalFlights}</div>
            <div className="stat-label">Toplam Uçuş</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalReservations}</div>
            <div className="stat-label">Rezervasyon</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Müşteri</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalAirports}</div>
            <div className="stat-label">Havalimanı</div>
          </div>
        </div>
      </div>

      {/* Tab Menüsü */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'flights' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('flights')}
        >
          Uçuşlar
        </button>
        <button 
          className={activeTab === 'reservations' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('reservations')}
        >
          Rezervasyonlar
        </button>
        <button 
          className={activeTab === 'customers' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('customers')}
        >
          Müşteriler
        </button>
        <button 
          className={activeTab === 'airports' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('airports')}
        >
          Havalimanları
        </button>
        <button 
          className={activeTab === 'airlines' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('airlines')}
        >
          Havayolları
        </button>
      </div>

      {/* İçerik Alanı */}
      <div className="admin-content">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <div className="data-table">
            {activeTab === 'flights' && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Havayolu</th>
                    <th>Nereden</th>
                    <th>Nereye</th>
                    <th>Kalkış</th>
                    <th>İniş</th>
                    <th>Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(flight => (
                    <tr key={flight.flightId}>
                      <td>{flight.flightId}</td>
                      <td>{flight.airline?.name || 'N/A'}</td>
                      <td>{flight.originAirport?.code || 'N/A'} - {flight.originAirport?.city || 'N/A'}</td>
                      <td>{flight.destinationAirport?.code || 'N/A'} - {flight.destinationAirport?.city || 'N/A'}</td>
                      <td>{flight.kalkisTarihi ? formatDateTime(flight.kalkisTarihi) : 'N/A'}</td>
                      <td>{flight.inisTarihi ? formatDateTime(flight.inisTarihi) : 'N/A'}</td>
                      <td>{flight.basePrice ? formatPrice(flight.basePrice) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'reservations' && (
              <table>
                <thead>
                  <tr>
                    <th>PNR</th>
                    <th>Müşteri</th>
                    <th>Uçuş</th>
                    <th>Koltuk</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(res => (
                    <tr key={res.reservationId}>
                      <td><strong>{res.pnr}</strong></td>
                      <td>{res.customer?.isimSoyad || 'N/A'}</td>
                      <td>{res.flight?.originAirport?.code || 'N/A'} → {res.flight?.destinationAirport?.code || 'N/A'}</td>
                      <td>{res.seatNumber || 'N/A'}</td>
                      <td>{res.reservationDate ? formatDateTime(res.reservationDate) : 'N/A'}</td>
                      <td>
                        <span className={`status ${res.status?.toLowerCase() || 'unknown'}`}>
                          {res.status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {res.status && res.status.toUpperCase() === 'CONFIRMED' && (
                          <button 
                            onClick={() => handleCancelReservation(res.reservationId, res.pnr)}
                            className="btn-cancel"
                            style={{
                              padding: '5px 15px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            İptal Et
                          </button>
                        )}
                        {res.status && res.status.toUpperCase() === 'CANCELLED' && (
                          <span style={{ color: '#dc3545', fontWeight: 'bold' }}>İptal Edildi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'customers' && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TC No</th>
                    <th>Ad Soyad</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Doğum Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(customer => (
                    <tr key={customer.userId}>
                      <td>{customer.userId}</td>
                      <td>{customer.tcNo}</td>
                      <td>{customer.isimSoyad}</td>
                      <td>{customer.mail}</td>
                      <td>{customer.telNo}</td>
                      <td>{customer.dogumTarihi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'airports' && (
              <table>
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Havalimanı Adı</th>
                    <th>Şehir</th>
                    <th>Ülke</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(airport => (
                    <tr key={airport.airportId}>
                      <td><strong>{airport.code}</strong></td>
                      <td>{airport.name}</td>
                      <td>{airport.city}</td>
                      <td>{airport.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'airlines' && (
              <table>
                <thead>
                  <tr>
                    <th>IATA</th>
                    <th>Havayolu Adı</th>
                    <th>Ülke</th>
                    <th>Uçuş Sayısı</th>
                    <th>Uçak Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(airline => (
                    <tr key={airline.airlineId}>
                      <td><strong>{airline.iataCode}</strong></td>
                      <td>{airline.name}</td>
                      <td>{airline.ulke}</td>
                      <td>{airline.ucusSayisi}</td>
                      <td>{airline.ucakSayisi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

