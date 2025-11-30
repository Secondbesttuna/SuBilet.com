import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import ReservationService from '../services/ReservationService';
import { showWarning } from '../utils/notification';
import './MyReservations.css';

function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Müşteri kontrolü - sessionStorage kullan
    const userData = sessionStorage.getItem('user');
    const userType = sessionStorage.getItem('userType');
    
    if (!userData || userType !== 'CUSTOMER') {
      showWarning('Giriş Gerekli', 'Rezervasyonlarınızı görmek için lütfen giriş yapın!');
      navigate('/auth');
      return;
    }

    const customerObj = JSON.parse(userData);
    setCustomer(customerObj);
    loadReservations(customerObj.userId);
  }, [navigate]);

  const loadReservations = async (customerId) => {
    setLoading(true);
    try {
      const response = await ReservationService.getReservationsByCustomerId(customerId);
      const reservations = response.data || response.apiResponse?.data || [];
      setReservations(Array.isArray(reservations) ? reservations : []);
    } catch (error) {
      console.error('Rezervasyonlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('user');
    navigate('/auth');
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleCancel = async (reservationId, pnr) => {
    Modal.confirm({
      title: 'Rezervasyon İptali',
      content: `PNR: ${pnr} ile rezervasyonu iptal etmek istediğinize emin misiniz?`,
      okText: 'Evet, İptal Et',
      cancelText: 'Hayır',
      okType: 'danger',
      onOk: async () => {
        try {
          await ReservationService.cancelReservation(reservationId);
          // Rezervasyonları yeniden yükle
          loadReservations(customer.userId);
        } catch (error) {
          console.error('İptal hatası:', error);
          // Hata bildirimi apiClient interceptor tarafından gösterilecek
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Rezervasyonlarınız yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="my-reservations">
      <div className="reservations-header">
        <div>
          <h1>🎫 Rezervasyonlarım</h1>
          {customer && (
            <p className="welcome-text">
              Hoş geldiniz, <strong>{customer.isimSoyad}</strong>
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Çıkış Yap
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <div className="no-reservations-icon">✈️</div>
          <h2>Henüz rezervasyonunuz bulunmamaktadır</h2>
          <p>Yeni bir uçuş rezervasyonu yapmak için ana sayfaya dönebilirsiniz.</p>
          <button onClick={() => navigate('/')} className="btn-home">
            Ana Sayfaya Dön
          </button>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map(reservation => (
            <div key={reservation.reservationId} className="reservation-card">
              <div className="reservation-header">
                <div className="pnr-section">
                  <div className="pnr-label">PNR</div>
                  <div className="pnr-value">{reservation.pnr}</div>
                </div>
                <div className={`status-badge ${reservation.status.toLowerCase()}`}>
                  {reservation.status === 'CONFIRMED' ? 'Onaylandı' : 'İptal Edildi'}
                </div>
              </div>

              <div className="reservation-body">
                <div className="flight-info">
                  <div className="route-section">
                    <div className="airport-info">
                      <div className="airport-code">{reservation.flight.originAirport.code}</div>
                      <div className="city">{reservation.flight.originAirport.city}</div>
                      <div className="time">{formatDateTime(reservation.flight.kalkisTarihi)}</div>
                    </div>
                    <div className="arrow-container">
                      <div className="arrow">→</div>
                      {reservation.flight.hasLayover && reservation.flight.layoverAirport && (
                        <div className="layover-badge">
                          Aktarma: {reservation.flight.layoverAirport.code}
                        </div>
                      )}
                    </div>
                    <div className="airport-info">
                      <div className="airport-code">{reservation.flight.destinationAirport.code}</div>
                      <div className="city">{reservation.flight.destinationAirport.city}</div>
                      <div className="time">{formatDateTime(reservation.flight.inisTarihi)}</div>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Havayolu:</span>
                      <span className="detail-value">{reservation.flight.airline.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Koltuk:</span>
                      <span className="detail-value">{reservation.seatNumber || 'Check-in\'de belirlenecek'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fiyat:</span>
                      <span className="detail-value price">{formatPrice(reservation.flight.basePrice)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rezervasyon Tarihi:</span>
                      <span className="detail-value">{formatDateTime(reservation.reservationDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {reservation.status === 'CONFIRMED' && (
                <div className="reservation-footer">
                  <button 
                    onClick={() => handleCancel(reservation.reservationId, reservation.pnr)}
                    className="btn-cancel"
                  >
                    Rezervasyonu İptal Et
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;

