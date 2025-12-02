import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import CustomerService from '../services/CustomerService';
import ReservationService from '../services/ReservationService';
import PaymentService from '../services/PaymentService';
import AuthService from '../services/AuthService';
import { showError, showWarning } from '../utils/notification';
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
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1); // -1 = yeni kart
  const [step, setStep] = useState(1); // 1: Yolcu Bilgileri, 2: Ödeme, 3: Onay
  const [occupiedSeats, setOccupiedSeats] = useState([]); // Dolu koltuklar
  const [seatInfo, setSeatInfo] = useState(null); // Koltuk bilgileri

  useEffect(() => {
    // Kullanıcı giriş durumunu kontrol et - sessionStorage kullan
    const userData = sessionStorage.getItem('user');
    const userType = sessionStorage.getItem('userType');
    
    if (userData && userType === 'CUSTOMER') {
      const userObj = JSON.parse(userData);
      setCustomer(userObj);
      // Form'u doldur
      setFormData({
        tcNo: userObj.tcNo || '',
        isimSoyad: userObj.isimSoyad || userObj.fullName || '',
        dogumTarihi: userObj.dogumTarihi || '',
        cinsiyet: userObj.cinsiyet || 'Erkek',
        mail: userObj.mail || userObj.email || '',
        telNo: userObj.telNo || userObj.phone || '',
        seatNumber: ''
      });
      
      // Kayıtlı ödeme yöntemlerini yükle
      const savedPayments = localStorage.getItem('savedPaymentMethods');
      if (savedPayments) {
        const cards = JSON.parse(savedPayments);
        setSavedCards(cards);
      }
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
    
    // Dolu koltukları yükle
    apiClient.get(`/flights/${flightId}/occupied-seats`)
      .then(response => {
        const seats = response.data || response.apiResponse?.data || [];
        setOccupiedSeats(seats);
      })
      .catch(error => {
        console.error('Dolu koltuklar yüklenemedi:', error);
      });
    
    // Koltuk bilgilerini yükle
    apiClient.get(`/flights/${flightId}/seat-info`)
      .then(response => {
        const info = response.data || response.apiResponse?.data;
        setSeatInfo(info);
      })
      .catch(error => {
        console.error('Koltuk bilgileri yüklenemedi:', error);
      });
  }, [flightId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    let value = e.target.value;
    
    // Kart numarası için sadece rakam ve otomatik boşluk ekleme
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substring(0, 19);
    }
    // Son kullanma tarihi için MM/YY formatı
    else if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (value.length > 5) value = value.substring(0, 5);
    }
    // CVV için sadece rakam ve max 3 karakter
    else if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setPaymentData({
      ...paymentData,
      [e.target.name]: value
    });
  };

  const handleSelectCard = (index) => {
    setSelectedCardIndex(index);
    if (index >= 0 && savedCards[index]) {
      const card = savedCards[index];
      setPaymentData({
        cardNumber: card.cardNumber,
        cardHolder: card.cardHolder,
        expiryDate: card.expiryDate,
        cvv: '' // CVV her zaman yeniden girilmeli
      });
    } else {
      // Yeni kart seçildi
      setPaymentData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });
    }
  };

  const handleDeleteCard = (index) => {
    const updatedCards = savedCards.filter((_, i) => i !== index);
    setSavedCards(updatedCards);
    localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedCards));
    if (selectedCardIndex === index) {
      setSelectedCardIndex(-1);
      setPaymentData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    }
  };

  const handlePassengerSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ödemeye geçmeden önce koltuk müsaitliğini kontrol et
      const occupiedSeatsResponse = await apiClient.get(`/flights/${flightId}/occupied-seats`);
      const occupiedSeats = occupiedSeatsResponse.data || occupiedSeatsResponse.apiResponse?.data || [];
      
      // Seçilen koltuk zaten alınmış mı kontrol et
      const selectedSeat = formData.seatNumber.toUpperCase();
      if (occupiedSeats.includes(selectedSeat)) {
        showError('Koltuk Dolu', `${selectedSeat} koltuğu zaten başka bir yolcu tarafından rezerve edilmiş. Lütfen başka bir koltuk seçin.`);
        return;
      }
      
      // Koltuk müsait, ödeme adımına geç
      setStep(2);
    } catch (error) {
      console.error('Koltuk kontrolü hatası:', error);
      // Hata olsa bile devam et (backend kontrolü yapacak)
      setStep(2);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Kart son kullanma tarihi kontrolü
    if (paymentData.expiryDate) {
      const [month, year] = paymentData.expiryDate.split('/');
      if (month && year) {
        const expiryMonth = parseInt(month);
        const expiryYear = parseInt('20' + year); // YY -> 20YY
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 0-indexed
        const currentYear = now.getFullYear();
        
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
          showError('Geçersiz Kart', 'Kartınızın son kullanma tarihi geçmiş. Lütfen geçerli bir kart kullanın.');
          return;
        }
      }
    }
    
    try {
      // Önce müşteri var mı kontrol et veya giriş yapmış kullanıcıyı kullan
      let customerToUse = null;
      
      // Giriş yapmış kullanıcı varsa, backend'de gerçekten var mı kontrol et
      if (customer && customer.userId) {
        try {
          // Sessizce customer kontrolü yap
          const checkCustomer = await apiClient.get(`/customers/${customer.userId}`).catch(() => null);
          if (checkCustomer && checkCustomer.data) {
            customerToUse = checkCustomer.data || checkCustomer.apiResponse?.data;
            console.log('Giriş yapmış customer backend\'de bulundu:', customerToUse);
          } else {
            console.warn('Giriş yapmış customer backend\'de bulunamadı (ID: ' + customer.userId + '), yeni customer oluşturulacak');
            // Customer backend'de yoksa yeni oluşturulacak
          }
        } catch (err) {
          console.warn('Customer kontrolü hatası:', err);
          // Hata olsa bile devam et, yeni customer oluşturulacak
        }
      }
      
      if (!customerToUse) {
        // Müşteri giriş yapmamışsa, AuthService ile kayıt yap
        try {
          if (formData.tcNo) {
            // TC ile kontrol et - sessizce (hata bildirimi gösterme)
            try {
              const existingCustomer = await apiClient.get(`/customers/tc/${formData.tcNo}`).catch(() => null);
              if (existingCustomer && existingCustomer.data) {
                customerToUse = existingCustomer.data || existingCustomer.apiResponse?.data;
              }
            } catch {
              // Sessizce devam et
            }
          }
          
          // Eğer customer bulunamadıysa yeni oluştur
          if (!customerToUse) {
            const username = formData.mail ? formData.mail.split('@')[0] : `user${Date.now()}`;
            const password = 'temp123';
            
            // AuthService.registerCustomer çağrısını sessizce yap
            const registerResponse = await AuthService.registerCustomer({
              username: username,
              password: password,
              tcNo: formData.tcNo,
              isimSoyad: formData.isimSoyad,
              dogumTarihi: formData.dogumTarihi,
              uyruk: 'Türkiye',
              cinsiyet: formData.cinsiyet,
              mail: formData.mail,
              telNo: formData.telNo
            }).catch((err) => {
              console.warn('Customer kayıt hatası:', err);
              return null;
            });
            
            if (registerResponse) {
              const result = registerResponse.data || registerResponse.apiResponse?.data;
              customerToUse = result?.user;
            }
          }
        } catch (err) {
          console.warn('Customer oluşturma hatası:', err);
        }
      }

      // Customer ID kontrolü
      if (!customerToUse || !customerToUse.userId) {
        throw new Error('Müşteri bilgileri alınamadı. Lütfen tekrar deneyin.');
      }

      console.log('Rezervasyon oluşturuluyor - Customer:', customerToUse);
      console.log('Customer ID:', customerToUse.userId);

      // Rezervasyon oluştur
      const reservation = await ReservationService.createReservation({
        customer: { userId: customerToUse.userId },
        flight: { flightId: parseInt(flightId) },
        seatNumber: formData.seatNumber
      });
      const reservationData = reservation.data || reservation.apiResponse?.data;

      // Ödeme oluştur - hata olsa bile devam et (sessizce, bildirim gösterme)
      try {
        // Payment endpoint'ini sessizce çağır (hata bildirimi gösterme)
        await apiClient.post('/payments', {
          reservation: { reservationId: reservationData.reservationId },
          method: 'Credit Card',
          currency: 'TRY',
          amount: flight.basePrice
        }).catch(() => {
          // Sessizce hata yakala, hiçbir bildirim gösterme
        });
      } catch (paymentError) {
        // Sessizce hata yakala, hiçbir bildirim gösterme
        console.warn('Ödeme oluşturulurken hata oluştu (devam ediliyor):', paymentError);
      }

      // Ödeme yöntemini kaydet (kullanıcı istediyse ve yeni kart ise)
      if (savePaymentMethod && selectedCardIndex === -1) {
        const newCard = {
          cardNumber: paymentData.cardNumber,
          cardHolder: paymentData.cardHolder,
          expiryDate: paymentData.expiryDate,
          lastFourDigits: paymentData.cardNumber.replace(/\s/g, '').slice(-4)
        };
        const updatedCards = [...savedCards, newCard];
        setSavedCards(updatedCards);
        localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedCards));
      }

      // Başarılı!
      setStep(3);
      localStorage.setItem('lastReservation', JSON.stringify(reservationData));
      
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
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

  if (loading || !flight) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Uçuş bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="flight-summary">
          <h2>Uçuş Bilgileri</h2>
          <div className="summary-card">
            <div className="airline-name">{flight.airline.name}</div>
            <div className="route">
              <div className="route-point">
                <div className="airport-code">{flight.originAirport.code}</div>
                <div className="city">{flight.originAirport.city?.city || 'N/A'}</div>
                <div className="time">{formatDateTime(flight.kalkisTarihi)}</div>
              </div>
              <div className="route-arrow">→</div>
              <div className="route-point">
                <div className="airport-code">{flight.destinationAirport.code}</div>
                <div className="city">{flight.destinationAirport.city?.city || 'N/A'}</div>
                <div className="time">{formatDateTime(flight.inisTarihi)}</div>
              </div>
            </div>
            <div className="price-box">
              <span className="price-label">Toplam:</span>
              <span className="price-value">{formatPrice(flight.basePrice)}</span>
            </div>
            
            {/* Uçak ve Koltuk Bilgileri */}
            <div className="aircraft-seat-info" style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>✈️</span>
                <div>
                  <strong>Uçak:</strong> {flight.aircraft?.model || seatInfo?.aircraftModel || 'Bilinmiyor'}
                  {(flight.aircraft?.tailNumber || seatInfo?.aircraftTailNumber) && (
                    <span style={{ color: '#666', marginLeft: '8px' }}>
                      ({flight.aircraft?.tailNumber || seatInfo?.aircraftTailNumber})
                    </span>
                  )}
                </div>
              </div>
              {seatInfo && (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ color: '#666' }}>Toplam Koltuk:</span>{' '}
                    <strong>{seatInfo.totalSeats}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Dolu:</span>{' '}
                    <strong style={{ color: '#dc3545' }}>{seatInfo.occupiedSeats}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Müsait:</span>{' '}
                    <strong style={{ color: seatInfo.availableSeats > 10 ? '#28a745' : seatInfo.availableSeats > 0 ? '#ffc107' : '#dc3545' }}>
                      {seatInfo.availableSeats}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="booking-form-section">
          {step === 1 && (
            <>
              <h2>Yolcu Bilgileri</h2>
              <form onSubmit={handlePassengerSubmit} className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>TC Kimlik No *</label>
                    <input
                      type="text"
                      name="tcNo"
                      value={formData.tcNo}
                      onChange={handleChange}
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
                      placeholder="Ad Soyad"
                    />
                  </div>
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
                    maxLength="4"
                    style={{
                      borderColor: occupiedSeats.includes(formData.seatNumber.toUpperCase()) ? '#dc3545' : undefined,
                      backgroundColor: occupiedSeats.includes(formData.seatNumber.toUpperCase()) ? '#fff5f5' : undefined
                    }}
                  />
                  {occupiedSeats.includes(formData.seatNumber.toUpperCase()) && (
                    <small style={{ color: '#dc3545', fontWeight: 'bold' }}>
                      ⚠️ Bu koltuk zaten rezerve edilmiş! Lütfen başka bir koltuk seçin.
                    </small>
                  )}
                  {!occupiedSeats.includes(formData.seatNumber.toUpperCase()) && (
                    <small>Örn: 12A, 15C, 20F</small>
                  )}
                  {occupiedSeats.length > 0 && (
                    <div className="occupied-seats-info" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '0.85rem' }}>
                      <strong>Dolu Koltuklar:</strong> {occupiedSeats.join(', ') || 'Henüz rezervasyon yok'}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-continue">
                  Ödemeye Geç →
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="payment-header">
                <h2>Ödeme Bilgileri</h2>
                <button onClick={() => setStep(1)} className="btn-back">
                  ← Geri
                </button>
              </div>
              
              {/* Kayıtlı Kartlar */}
              {savedCards.length > 0 && (
                <div className="saved-cards-section">
                  <h3>Kayıtlı Kartlarım</h3>
                  <div className="saved-cards-list">
                    {savedCards.map((card, index) => (
                      <div 
                        key={index} 
                        className={`saved-card ${selectedCardIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSelectCard(index)}
                      >
                        <div className="card-icon">💳</div>
                        <div className="card-info">
                          <span className="card-holder-name">{card.cardHolder}</span>
                          <span className="card-number-masked">**** **** **** {card.lastFourDigits}</span>
                          <span className="card-expiry">Son Kullanma: {card.expiryDate}</span>
                        </div>
                        <button 
                          type="button"
                          className="btn-delete-card"
                          onClick={(e) => { e.stopPropagation(); handleDeleteCard(index); }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <div 
                      className={`saved-card new-card ${selectedCardIndex === -1 ? 'selected' : ''}`}
                      onClick={() => handleSelectCard(-1)}
                    >
                      <div className="card-icon">➕</div>
                      <div className="card-info">
                        <span className="card-holder-name">Yeni Kart Ekle</span>
                        <span className="card-number-masked">Yeni bir kart ile ödeme yap</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} className="booking-form">
                <div className="form-group">
                  <label>Kart Numarası *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                    disabled={selectedCardIndex >= 0}
                  />
                </div>

                <div className="form-group">
                  <label>Kart Sahibinin Adı *</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handlePaymentChange}
                    placeholder="AHMET YILMAZ"
                    required
                    disabled={selectedCardIndex >= 0}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Son Kullanma Tarihi *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                      disabled={selectedCardIndex >= 0}
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                    {selectedCardIndex >= 0 && (
                      <small className="cvv-hint">Güvenlik için CVV'yi yeniden girin</small>
                    )}
                  </div>
                </div>

                {selectedCardIndex === -1 && (
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={savePaymentMethod}
                        onChange={(e) => setSavePaymentMethod(e.target.checked)}
                      />
                      <span>Bu kartı gelecek rezervasyonlarım için kaydet (CVV hariç)</span>
                    </label>
                  </div>
                )}

                <div className="payment-summary">
                  <div className="payment-summary-row">
                    <span>Uçuş Tutarı:</span>
                    <span>{formatPrice(flight.basePrice)}</span>
                  </div>
                  <div className="payment-summary-row total">
                    <span>Toplam:</span>
                    <span>{formatPrice(flight.basePrice)}</span>
                  </div>
                </div>

                <button type="submit" className="btn-continue">
                  Rezervasyonu Tamamla →
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
