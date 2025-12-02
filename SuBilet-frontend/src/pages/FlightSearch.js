import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FlightService from '../services/FlightService';
import apiClient from '../utils/apiClient';
import './FlightSearch.css';

function FlightSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [seatInfoMap, setSeatInfoMap] = useState({}); // flightId -> seatInfo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price'); // 'price', 'priceDesc', 'time', 'duration'

  const originId = searchParams.get('origin');
  const destinationId = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    searchFlights();
  }, [originId, destinationId, date]);

  const searchFlights = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await FlightService.searchFlights(originId, destinationId, date);
      const flightsData = response.data || response.apiResponse?.data || [];
      const flightsList = Array.isArray(flightsData) ? flightsData : [];
      setFlights(flightsList);
      
      // Her uçuş için koltuk bilgisini yükle
      const seatInfoPromises = flightsList.map(async (flight) => {
        try {
          const seatRes = await apiClient.get(`/flights/${flight.flightId}/seat-info`);
          return { flightId: flight.flightId, seatInfo: seatRes.data || seatRes.apiResponse?.data };
        } catch {
          return { flightId: flight.flightId, seatInfo: null };
        }
      });
      
      const seatInfoResults = await Promise.all(seatInfoPromises);
      const seatMap = {};
      seatInfoResults.forEach(result => {
        if (result.seatInfo) {
          seatMap[result.flightId] = result.seatInfo;
        }
      });
      setSeatInfoMap(seatMap);
    } catch (err) {
      setError('Uçuşlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('tr-TR', {
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

  const calculateDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}s ${minutes}dk`;
  };

  const handleBooking = (flight) => {
    navigate(`/booking/${flight.flightId}`);
  };

  // Sıralanmış uçuşları hesapla
  const getSortedFlights = () => {
    const sorted = [...flights];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
      case 'priceDesc':
        return sorted.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
      case 'time':
        return sorted.sort((a, b) => new Date(a.kalkisTarihi) - new Date(b.kalkisTarihi));
      case 'duration':
        return sorted.sort((a, b) => {
          const durationA = new Date(a.inisTarihi) - new Date(a.kalkisTarihi);
          const durationB = new Date(b.inisTarihi) - new Date(b.kalkisTarihi);
          return durationA - durationB;
        });
      default:
        return sorted;
    }
  };

  const sortedFlights = getSortedFlights();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Uçuşlar aranıyor...</p>
      </div>
    );
  }

  return (
    <div className="flight-search">
      <div className="search-header">
        <h1>Uçuş Arama Sonuçları</h1>
        <p className="search-info">
          {flights.length} uçuş bulundu
        </p>
        
        {/* Sıralama Seçenekleri */}
        {flights.length > 0 && (
          <div className="sort-options">
            <span className="sort-label">Sırala:</span>
            <button 
              className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
              onClick={() => setSortBy('price')}
            >
              💰 Fiyat (Artan)
            </button>
            <button 
              className={`sort-btn ${sortBy === 'priceDesc' ? 'active' : ''}`}
              onClick={() => setSortBy('priceDesc')}
            >
              💰 Fiyat (Azalan)
            </button>
            <button 
              className={`sort-btn ${sortBy === 'time' ? 'active' : ''}`}
              onClick={() => setSortBy('time')}
            >
              🕐 Kalkış Saati
            </button>
            <button 
              className={`sort-btn ${sortBy === 'duration' ? 'active' : ''}`}
              onClick={() => setSortBy('duration')}
            >
              ⏱️ Süre (Kısa)
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="flights-container">
        {flights.length === 0 && !error ? (
          <div className="no-flights">
            <h2>Üzgünüz, uygun uçuş bulunamadı</h2>
            <p>Lütfen farklı tarih veya havalimanı seçerek tekrar deneyin.</p>
            <button onClick={() => navigate('/')} className="btn-back">
              Yeni Arama Yap
            </button>
          </div>
        ) : (
          <div className="flights-list">
            {sortedFlights.map(flight => {
              const seatInfo = seatInfoMap[flight.flightId];
              return (
                <div key={flight.flightId} className="flight-card">
                  <div className="flight-info">
                    <div className="airline-info">
                      <h3>{flight.airline.name}</h3>
                      <p className="flight-code">{flight.airline.iataCode}</p>
                    </div>

                    <div className="flight-route">
                      <div className="route-point">
                        <div className="time">{formatDateTime(flight.kalkisTarihi).split(' ')[1]}</div>
                        <div className="airport">{flight.originAirport.code}</div>
                        <div className="city">{flight.originAirport.city?.city || 'N/A'}</div>
                      </div>

                      <div className="route-line">
                        <div className="duration">
                          {calculateDuration(flight.kalkisTarihi, flight.inisTarihi)}
                        </div>
                        <div className="line"></div>
                      </div>

                      <div className="route-point">
                        <div className="time">{formatDateTime(flight.inisTarihi).split(' ')[1]}</div>
                        <div className="airport">{flight.destinationAirport.code}</div>
                        <div className="city">{flight.destinationAirport.city?.city || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Uçak ve Koltuk Bilgisi */}
                  <div className="aircraft-info">
                    <div className="aircraft-model">
                      ✈️ {flight.aircraft?.model || seatInfo?.aircraftModel || 'Bilinmiyor'}
                      {flight.aircraft?.tailNumber && (
                        <span className="tail-number"> ({flight.aircraft.tailNumber})</span>
                      )}
                    </div>
                    {seatInfo && (
                      <div className="seat-info">
                        <span className="available-seats" style={{ 
                          color: seatInfo.availableSeats > 10 ? '#28a745' : seatInfo.availableSeats > 0 ? '#ffc107' : '#dc3545' 
                        }}>
                          🪑 {seatInfo.availableSeats} koltuk müsait
                        </span>
                        <span className="total-seats"> / {seatInfo.totalSeats} toplam</span>
                      </div>
                    )}
                  </div>

                  <div className="flight-booking">
                    <div className="price">
                      {formatPrice(flight.basePrice)}
                    </div>
                    <button 
                      onClick={() => handleBooking(flight)} 
                      className="btn-book"
                      disabled={seatInfo && seatInfo.availableSeats === 0}
                    >
                      {seatInfo && seatInfo.availableSeats === 0 ? 'Dolu' : 'Rezervasyon Yap'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightSearch;
