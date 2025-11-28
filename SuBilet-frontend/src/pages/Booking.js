import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import CustomerService from '../services/CustomerService';
import ReservationService from '../services/ReservationService';
import PaymentService from '../services/PaymentService';
import './Booking.css';

function Booking() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    tcNo: '',
    isimSoyad: '',
    dogumTarihi: '',
    cinsiyet: 'Erkek',
    mail: '',
    telNo: '',
    seatNumber: ''
  });
  const [step, setStep] = useState(1); // 1: Yolcu Bilgileri, 2: Ödeme, 3: Onay

  useEffect(() => {
    // Kullanıcı giriş durumunu kontrol et
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const customerObj = JSON.parse(customerData);
      setCustomer(customerObj);
      // Form'u doldur
      setFormData({
        tcNo: customerObj.tcNo || '',
        isimSoyad: customerObj.isimSoyad || '',
        dogumTarihi: customerObj.dogumTarihi || '',
        cinsiyet: customerObj.cinsiyet || 'Erkek',
        mail: customerObj.mail || '',
        telNo: customerObj.telNo || '',
        seatNumber: ''
      });
    }

    // Uçuş bilgilerini yükle
    apiClient.get(`/flights/${flightId}`)
      .then(response => {
        setFlight(response.data || response.apiResponse?.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Uçuş bilgileri yüklenemedi:', error);
        navigate('/');
      });
  }, [flightId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePassengerSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Önce müşteri var mı kontrol et veya giriş yapmış kullanıcıyı kullan
      let customerToUse = customer; // Giriş yapmış kullanıcıyı kullan
      
      if (!customerToUse) {
        // Müşteri giriş yapmamışsa, TC ile kontrol et veya yeni oluştur
        try {
          const existingCustomer = await CustomerService.getCustomerByTcNo(formData.tcNo);
          customerToUse = existingCustomer.data || existingCustomer.apiResponse?.data;
        } catch {
          // Müşteri yoksa yeni oluştur
          const newCustomer = await CustomerService.createCustomer({
            tcNo: formData.tcNo,
            isimSoyad: formData.isimSoyad,
            dogumTarihi: formData.dogumTarihi,
            uyruk: 'Türkiye',
            cinsiyet: formData.cinsiyet,
            mail: formData.mail,
            telNo: formData.telNo
          });
          customerToUse = newCustomer.data || newCustomer.apiResponse?.data;
        }
      }

      // Rezervasyon oluştur
      const reservation = await ReservationService.createReservation({
        customer: { userId: customerToUse.userId },
        flight: { flightId: parseInt(flightId) },
        seatNumber: formData.seatNumber
      });
      const reservationData = reservation.data || reservation.apiResponse?.data;

      // Ödeme oluştur
      await PaymentService.createPayment({
        reservation: { reservationId: reservationData.reservationId },
        method: 'Credit Card',
        currency: 'TRY',
        amount: flight.basePrice
      });

      // Eğer kullanıcı giriş yapmadıysa, şimdi kaydet (rezervasyonlarım sayfasında görebilsin)
      if (!customer) {
        localStorage.setItem('customer', JSON.stringify(customerToUse));
        setCustomer(customerToUse);
        // Navbar'ı güncellemek için event gönder
        window.dispatchEvent(new Event('customerLogin'));
      }

      // Başarılı!
      setStep(3);
      localStorage.setItem('lastReservation', JSON.stringify(reservationData));
      
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      // Hata bildirimi apiClient interceptor tarafından gösterilecek
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!flight) {
    return <div>Uçuş bulunamadı</div>;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Sol Taraf - Uçuş Özeti */}
        <div className="flight-summary">
          <h2>Uçuş Bilgileri</h2>
          <div className="summary-card">
            <div className="airline-name">{flight.airline.name}</div>
            <div className="route">
              <div className="route-point">
                <div className="airport-code">{flight.originAirport.code}</div>
                <div className="city">{flight.originAirport.city}</div>
                <div className="time">{formatDateTime(flight.kalkisTarihi)}</div>
              </div>
              <div className="arrow">→</div>
              <div className="route-point">
                <div className="airport-code">{flight.destinationAirport.code}</div>
                <div className="city">{flight.destinationAirport.city}</div>
                <div className="time">{formatDateTime(flight.inisTarihi)}</div>
              </div>
            </div>
            <div className="price-summary">
              <div className="price-label">Toplam Tutar:</div>
              <div className="price-value">{formatPrice(flight.basePrice)}</div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Form */}
        <div className="booking-form-container">
          {step === 1 && (
            <>
              <h2>Yolcu Bilgileri</h2>
              <form onSubmit={handlePassengerSubmit} className="booking-form">
                <div className="form-group">
                  <label>TC Kimlik No *</label>
                  <input
                    type="text"
                    name="tcNo"
                    value={formData.tcNo}
                    onChange={handleChange}
                    pattern="[0-9]{11}"
                    maxLength="11"
                    required
                    placeholder="12345678901"
                  />
                </div>

                <div className="form-group">
                  <label>Ad Soyad *</label>
                  <input
                    type="text"
                    name="isimSoyad"
                    value={formData.isimSoyad}
                    onChange={handleChange}
                    required
                    placeholder="Ahmet Yılmaz"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Doğum Tarihi *</label>
                    <input
                      type="date"
                      name="dogumTarihi"
                      value={formData.dogumTarihi}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Cinsiyet *</label>
                    <select
                      name="cinsiyet"
                      value={formData.cinsiyet}
                      onChange={handleChange}
                      required
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>E-posta *</label>
                  <input
                    type="email"
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    name="telNo"
                    value={formData.telNo}
                    onChange={handleChange}
                    pattern="[0-9]{11}"
                    maxLength="11"
                    required
                    placeholder="05321234567"
                  />
                </div>

                <div className="form-group">
                  <label>Koltuk No *</label>
                  <input
                    type="text"
                    name="seatNumber"
                    value={formData.seatNumber}
                    onChange={handleChange}
                    required
                    placeholder="12A"
                    maxLength="3"
                  />
                  <small>Örn: 12A, 15C, 20F</small>
                </div>

                <button type="submit" className="btn-continue">
                  Ödemeye Geç →
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Rezervasyonunuz Tamamlandı!</h2>
              <p>Biletiniz e-posta adresinize gönderildi.</p>
              <div className="success-buttons">
                <button onClick={() => navigate('/')} className="btn-home">
                  Ana Sayfaya Dön
                </button>
                <button onClick={() => navigate('/reservations')} className="btn-reservations">
                  Rezervasyonlarım
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;

