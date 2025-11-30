import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FlightService from '../services/FlightService';
import './FlightSearch.css';

function FlightSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLayoverFlights, setShowLayoverFlights] = useState(true);

  const originId = searchParams.get('origin');
  const destinationId = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    searchFlights();
  }, [originId, destinationId, date]);

  useEffect(() => {
    // Filtreleme değiştiğinde uçuşları yeniden filtrele
    filterFlights();
  }, [showLayoverFlights, allFlights]);

  const searchFlights = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await FlightService.searchFlights(originId, destinationId, date);
      const flights = response.data || response.apiResponse?.data || [];
      setAllFlights(Array.isArray(flights) ? flights : []);
    } catch (err) {
      setError('Uçuşlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterFlights = () => {
    if (!showLayoverFlights) {
      setFlights(allFlights.filter(f => !f.hasLayover));
    } else {
      setFlights(allFlights);
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
        
        <div className="filter-section">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showLayoverFlights}
              onChange={(e) => setShowLayoverFlights(e.target.checked)}
            />
            <span>Aktarmalı uçuşları göster</span>
          </label>
        </div>
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
            {flights.map(flight => (
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
                      <div className="city">{flight.originAirport.city}</div>
                    </div>

                    <div className="route-line">
                      <div className="duration">
                        {calculateDuration(flight.kalkisTarihi, flight.inisTarihi)}
                      </div>
                      <div className="line"></div>
                      {flight.hasLayover && flight.layoverAirport && (
                        <div className="layover-info">
                          Aktarma: {flight.layoverAirport.code}
                        </div>
                      )}
                    </div>

                    <div className="route-point">
                      <div className="time">{formatDateTime(flight.inisTarihi).split(' ')[1]}</div>
                      <div className="airport">{flight.destinationAirport.code}</div>
                      <div className="city">{flight.destinationAirport.city}</div>
                    </div>
                  </div>
                </div>

                <div className="flight-booking">
                  <div className="price">
                    {formatPrice(flight.basePrice)}
                  </div>
                  <button 
                    onClick={() => handleBooking(flight)} 
                    className="btn-book"
                  >
                    Rezervasyon Yap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightSearch;
