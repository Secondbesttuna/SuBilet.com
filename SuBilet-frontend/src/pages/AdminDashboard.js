import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import apiClient from '../utils/apiClient';
import ReservationService from '../services/ReservationService';
import { showWarning, showSuccess, showError } from '../utils/notification';
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

  // Modal states
  const [showAirlineModal, setShowAirlineModal] = useState(false);
  const [showAirportModal, setShowAirportModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);

  // Form states
  const [airlineForm, setAirlineForm] = useState({
    name: '',
    ulke: 'Türkiye',
    iataCode: '',
    icaoCode: '',
    yillikUcusSayisi: 0,
    ucakSayisi: 0,
    selectedAircraftTypes: [], // Seçilen uçak türleri
    aircraftTypeCounts: {} // Her uçak türü için adet: { typeId: count }
  });

  // Uçak ekleme modal state
  const [showAddAircraftModal, setShowAddAircraftModal] = useState(false);
  const [addAircraftForm, setAddAircraftForm] = useState({
    airlineId: '',
    aircraftTypeId: '',
    tailNumber: '',
    count: 1 // Kaç adet eklenecek
  });

  const [airportForm, setAirportForm] = useState({
    code: '',
    name: '',
    cityId: ''
  });

  const [flightForm, setFlightForm] = useState({
    airlineId: '',
    aircraftId: '',
    originAirportId: '',
    destinationAirportId: '',
    kalkisTarihi: '',
    inisTarihi: '',
    basePrice: ''
  });

  // Dropdown data
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Sıralama state'i
  const [flightSortOrder, setFlightSortOrder] = useState('asc'); // 'asc' veya 'desc'

  useEffect(() => {
    // Admin kontrolü - sessionStorage kullan
    const userType = sessionStorage.getItem('userType');
    const token = sessionStorage.getItem('token');
    
    if (!token || userType !== 'ADMIN') {
      showWarning('Giriş Gerekli', 'Admin paneline erişmek için lütfen giriş yapın!');
      navigate('/auth');
      return;
    }

    // İstatistikleri ve dropdown verilerini yükle
    loadStats();
    loadDropdownData();
    loadData(activeTab);
  }, [navigate, activeTab, flightSortOrder]);

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

  const loadDropdownData = async () => {
    try {
      const [airlinesRes, airportsRes, aircraftsRes, aircraftTypesRes, citiesRes] = await Promise.all([
        apiClient.get('/airlines'),
        apiClient.get('/airports'),
        apiClient.get('/aircrafts').catch(() => ({ data: [] })),
        apiClient.get('/aircraft-types').catch(() => ({ data: [] })),
        apiClient.get('/cities').catch(() => ({ data: [] }))
      ]);

      const aircraftsData = aircraftsRes.data || aircraftsRes.apiResponse?.data || [];
      console.log('Loaded aircrafts:', aircraftsData.length, 'items');
      console.log('Aircraft airline details:', aircraftsData.map(a => ({ 
        aircraftId: a.aircraftId, 
        tailNumber: a.tailNumber,
        airlineId: a.airline?.airlineId,
        airlineName: a.airline?.name 
      })));

      setAirlines(airlinesRes.data || airlinesRes.apiResponse?.data || []);
      setAirports(airportsRes.data || airportsRes.apiResponse?.data || []);
      setAircrafts(aircraftsData);
      setAircraftTypes(aircraftTypesRes.data || aircraftTypesRes.apiResponse?.data || []);
      setCities(citiesRes.data || citiesRes.apiResponse?.data || []);
    } catch (error) {
      console.error('Dropdown verileri yüklenemedi:', error);
    }
  };

  // Havayoluna göre uçakları filtreleyen fonksiyon (render sırasında kullanılır)
  const getFilteredAircraftsForAirline = (airlineId) => {
    if (!airlineId) return [];
    const selectedAirlineId = parseInt(airlineId);
    return aircrafts.filter(a => {
      const aircraftAirlineId = a.airline?.airlineId || a.airlineId;
      return aircraftAirlineId === selectedAirlineId;
    });
  };

  // Havayolu değiştiğinde uçak seçimini sıfırla
  useEffect(() => {
    if (flightForm.airlineId) {
      const filtered = getFilteredAircraftsForAirline(flightForm.airlineId);
      console.log('Airline changed:', flightForm.airlineId, 'Filtered aircrafts:', filtered.length, 'Total:', aircrafts.length);
      // Havayolu değiştiğinde uçak seçimini sıfırla (eğer seçili uçak bu havayoluna ait değilse)
      if (flightForm.aircraftId) {
        const isAircraftBelongsToAirline = filtered.some(a => a.aircraftId === parseInt(flightForm.aircraftId));
        if (!isAircraftBelongsToAirline) {
          setFlightForm(prev => ({...prev, aircraftId: ''}));
        }
      }
    } else {
      setFlightForm(prev => ({...prev, aircraftId: ''}));
    }
  }, [flightForm.airlineId]);
  
  // Render sırasında filtrelenmiş uçakları hesapla
  const currentFilteredAircrafts = getFilteredAircraftsForAirline(flightForm.airlineId);

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
      let responseData = response.data || response.apiResponse?.data || [];
      
      // Uçuşları kalkış tarihine göre sırala
      if (tab === 'flights' && Array.isArray(responseData)) {
        responseData = responseData.sort((a, b) => {
          const dateA = new Date(a.kalkisTarihi);
          const dateB = new Date(b.kalkisTarihi);
          return flightSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
      }
      
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
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

  const handleCancelReservation = (reservationId, pnr) => {
    Modal.confirm({
      title: 'Rezervasyon İptali',
      content: `PNR: ${pnr} ile rezervasyonu iptal etmek istediğinize emin misiniz?`,
      okText: 'Evet, İptal Et',
      cancelText: 'Hayır',
      okType: 'danger',
      onOk: async () => {
        try {
          await ReservationService.cancelReservation(reservationId);
          showSuccess('Başarılı', `PNR: ${pnr} rezervasyonu iptal edildi`);
          loadData('reservations');
          loadStats();
        } catch (error) {
          console.error('İptal hatası:', error);
          showError('Hata', 'Rezervasyon iptal edilemedi');
        }
      }
    });
  };

  // ==================== HAVAYOLU İŞLEMLERİ ====================
  const handleAirlineSubmit = async (e) => {
    e.preventDefault();
    try {
      const { selectedAircraftTypes, aircraftTypeCounts, ...airlineData } = airlineForm;
      const response = await apiClient.post('/admin/airlines', airlineData);
      const newAirline = response.data || response.apiResponse?.data;
      
      let totalAircrafts = 0;
      let aircraftErrors = 0;
      
      // Seçilen uçak türleri için otomatik uçak oluştur (her tür için belirtilen adet kadar)
      if (selectedAircraftTypes.length > 0 && newAirline?.airlineId) {
        for (const typeId of selectedAircraftTypes) {
          const aircraftType = aircraftTypes.find(t => t.aircraftTypeId === parseInt(typeId));
          if (aircraftType) {
            const count = aircraftTypeCounts[typeId] || 1;
            
            for (let i = 0; i < count; i++) {
              const tailNumber = `TC-${airlineData.iataCode}${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
              try {
                await apiClient.post('/admin/aircrafts', {
                  airline: { airlineId: newAirline.airlineId },
                  aircraftType: { aircraftTypeId: parseInt(typeId) },
                  model: aircraftType.model,
                  tailNumber: tailNumber,
                  capacity: aircraftType.capacity,
                  uretici: aircraftType.manufacturer
                });
                totalAircrafts++;
              } catch (err) {
                console.error('Uçak eklenemedi:', err);
                aircraftErrors++;
              }
            }
          }
        }
      }
      
      // Tek bildirim göster
      if (totalAircrafts > 0) {
        showSuccess('Başarılı', `${newAirline.name} havayolu ve ${totalAircrafts} adet uçak eklendi`);
      } else {
        showSuccess('Başarılı', `${newAirline.name} havayolu eklendi`);
      }
      
      setShowAirlineModal(false);
      setAirlineForm({ name: '', ulke: 'Türkiye', iataCode: '', icaoCode: '', yillikUcusSayisi: 0, ucakSayisi: 0, selectedAircraftTypes: [], aircraftTypeCounts: {} });
      
      // Verileri yeniden yükle - await ile bekle ki aircrafts state'i güncellensin
      await loadDropdownData();
      loadData('airlines');
      loadStats();
    } catch (error) {
      showError('Hata', 'Havayolu eklenemedi');
    }
  };

  // ==================== UÇAK EKLEME İŞLEMLERİ ====================
  const handleAddAircraftSubmit = async (e) => {
    e.preventDefault();
    try {
      const aircraftType = aircraftTypes.find(t => t.aircraftTypeId === parseInt(addAircraftForm.aircraftTypeId));
      const count = parseInt(addAircraftForm.count) || 1;
      const selectedAirline = airlines.find(a => a.airlineId === parseInt(addAircraftForm.airlineId));
      
      let successCount = 0;
      let errorCount = 0;
      
      // Belirtilen adet kadar uçak oluştur
      for (let i = 0; i < count; i++) {
        let tailNumber;
        if (count === 1 && addAircraftForm.tailNumber && addAircraftForm.tailNumber.trim() !== '') {
          tailNumber = addAircraftForm.tailNumber.toUpperCase();
        } else {
          const randomNum = Math.floor(Math.random() * 9000) + 1000;
          tailNumber = `TC-${selectedAirline?.iataCode || 'XX'}${String(randomNum).padStart(4, '0')}`;
        }
        
        const aircraftData = {
          airline: { airlineId: parseInt(addAircraftForm.airlineId) },
          aircraftType: { aircraftTypeId: parseInt(addAircraftForm.aircraftTypeId) },
          model: aircraftType?.model || '',
          tailNumber: tailNumber,
          capacity: aircraftType?.capacity || 0,
          uretici: aircraftType?.manufacturer || ''
        };
        
        try {
          await apiClient.post('/admin/aircrafts', aircraftData);
          successCount++;
        } catch (err) {
          console.error(`Uçak ${i + 1} eklenemedi:`, err);
          errorCount++;
        }
      }
      
      // Tek bildirim göster
      if (successCount > 0) {
        showSuccess('Başarılı', `${selectedAirline?.name || 'Havayolu'} için ${successCount} adet ${aircraftType?.model || 'uçak'} eklendi`);
      }
      if (errorCount > 0 && successCount === 0) {
        showError('Hata', 'Uçaklar eklenemedi');
      }
      
      setShowAddAircraftModal(false);
      setAddAircraftForm({ airlineId: '', aircraftTypeId: '', tailNumber: '', count: 1 });
      
      // Verileri yeniden yükle - await ile bekle ki aircrafts state'i güncellensin
      await loadDropdownData();
      loadData('airlines');
      loadStats();
    } catch (error) {
      showError('Hata', 'Uçak eklenemedi');
    }
  };

  // ==================== HAVALİMANI İŞLEMLERİ ====================
  const handleAirportSubmit = async (e) => {
    e.preventDefault();
    try {
      const airportData = {
        code: airportForm.code,
        name: airportForm.name,
        city: { cityId: parseInt(airportForm.cityId) }
      };
      await apiClient.post('/admin/airports', airportData);
      showSuccess('Başarılı', 'Havalimanı başarıyla eklendi');
      setShowAirportModal(false);
      setAirportForm({ code: '', name: '', cityId: '' });
      loadData('airports');
      loadDropdownData();
      loadStats();
    } catch (error) {
      showError('Hata', 'Havalimanı eklenemedi');
    }
  };

  // ==================== UÇUŞ İŞLEMLERİ ====================
  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    
    // Uçak seçimi kontrolü
    if (!flightForm.aircraftId) {
      showError('Hata', 'Uçuş oluşturmak için bir uçak seçmelisiniz');
      return;
    }
    
    // Seçilen uçağın havayoluna ait olduğunu kontrol et
    const selectedAircraft = aircrafts.find(a => a.aircraftId === parseInt(flightForm.aircraftId));
    if (selectedAircraft && selectedAircraft.airline?.airlineId !== parseInt(flightForm.airlineId)) {
      showError('Hata', 'Seçilen uçak bu havayoluna ait değil');
      return;
    }
    
    // Tarih kontrolleri
    if (flightForm.kalkisTarihi && flightForm.inisTarihi) {
      const kalkis = new Date(flightForm.kalkisTarihi);
      const inis = new Date(flightForm.inisTarihi);
      const now = new Date();
      
      // Geçmiş tarihe uçuş oluşturma engeli
      if (kalkis < now) {
        showError('Hata', 'Geçmiş bir tarihe uçuş oluşturulamaz. Lütfen bugünden sonraki bir tarih seçin.');
        return;
      }
      
      const diffMs = inis - kalkis;
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = diffHours / 24;
      
      if (diffMs <= 0) {
        showError('Hata', 'İniş tarihi kalkış tarihinden sonra olmalıdır');
        return;
      }
      
      // Uçuş süresi kontrolü - maksimum 3 gün (72 saat)
      if (diffDays > 3) {
        showError('Hata', `Uçuş süresi maksimum 3 gün (72 saat) olabilir. Girilen süre: ${diffDays.toFixed(1)} gün`);
        return;
      }
    }
    
    try {
      const flightData = {
        airline: { airlineId: parseInt(flightForm.airlineId) },
        aircraft: { aircraftId: parseInt(flightForm.aircraftId) },
        originAirport: { airportId: parseInt(flightForm.originAirportId) },
        destinationAirport: { airportId: parseInt(flightForm.destinationAirportId) },
        kalkisTarihi: flightForm.kalkisTarihi,
        inisTarihi: flightForm.inisTarihi,
        basePrice: parseFloat(flightForm.basePrice),
      };

      if (editingFlight) {
        await apiClient.put(`/admin/flights/${editingFlight.flightId}`, flightData);
        showSuccess('Başarılı', 'Uçuş başarıyla güncellendi');
      } else {
        await apiClient.post('/admin/flights', flightData);
        showSuccess('Başarılı', 'Uçuş başarıyla eklendi');
      }

      setShowFlightModal(false);
      setEditingFlight(null);
      resetFlightForm();
      loadData('flights');
      loadStats();
    } catch (error) {
      showError('Hata', editingFlight ? 'Uçuş güncellenemedi' : 'Uçuş eklenemedi');
    }
  };

  const handleEditFlight = async (flight) => {
    setEditingFlight(flight);
    await loadDropdownData(); // Güncel uçak listesini yükle
    setFlightForm({
      airlineId: flight.airline?.airlineId || '',
      aircraftId: flight.aircraft?.aircraftId || '',
      originAirportId: flight.originAirport?.airportId || '',
      destinationAirportId: flight.destinationAirport?.airportId || '',
      kalkisTarihi: flight.kalkisTarihi ? flight.kalkisTarihi.slice(0, 16) : '',
      inisTarihi: flight.inisTarihi ? flight.inisTarihi.slice(0, 16) : '',
      basePrice: flight.basePrice || '',
    });
    setShowFlightModal(true);
  };

  const resetFlightForm = () => {
    setFlightForm({
      airlineId: '',
      aircraftId: '',
      originAirportId: '',
      destinationAirportId: '',
      kalkisTarihi: '',
      inisTarihi: '',
      basePrice: '',
    });
  };

  // ==================== SİLME İŞLEMLERİ ====================
  const handleDeleteFlight = (flightId) => {
    Modal.confirm({
      title: 'Uçuş Silme',
      content: `#${flightId} numaralı uçuşu silmek istediğinize emin misiniz?`,
      okText: 'Evet, Sil',
      cancelText: 'Hayır',
      okType: 'danger',
      onOk: async () => {
        try {
          await apiClient.delete(`/admin/flights/${flightId}`);
          showSuccess('Başarılı', 'Uçuş başarıyla silindi');
          loadData('flights');
          loadStats();
        } catch (error) {
          showError('Hata', 'Uçuş silinemedi. Bu uçuşa ait rezervasyonlar olabilir.');
        }
      }
    });
  };

  const handleDeleteAirport = (airportId, airportCode) => {
    Modal.confirm({
      title: 'Havalimanı Silme',
      content: `${airportCode} kodlu havalimanını silmek istediğinize emin misiniz?`,
      okText: 'Evet, Sil',
      cancelText: 'Hayır',
      okType: 'danger',
      onOk: async () => {
        try {
          await apiClient.delete(`/admin/airports/${airportId}`);
          showSuccess('Başarılı', 'Havalimanı başarıyla silindi');
          loadData('airports');
          loadDropdownData();
          loadStats();
        } catch (error) {
          showError('Hata', 'Havalimanı silinemedi. Bu havalimanına ait uçuşlar olabilir.');
        }
      }
    });
  };

  const handleDeleteAirline = (airlineId, airlineName) => {
    Modal.confirm({
      title: 'Havayolu Silme',
      content: `${airlineName} havayolunu silmek istediğinize emin misiniz?`,
      okText: 'Evet, Sil',
      cancelText: 'Hayır',
      okType: 'danger',
      onOk: async () => {
        try {
          await apiClient.delete(`/admin/airlines/${airlineId}`);
          showSuccess('Başarılı', 'Havayolu başarıyla silindi');
          loadData('airlines');
          loadDropdownData();
        } catch (error) {
          showError('Hata', 'Havayolu silinemedi. Bu havayoluna ait uçuşlar veya uçaklar olabilir.');
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

      {/* Aksiyon Butonları */}
      <div className="action-buttons">
        {activeTab === 'flights' && (
          <>
            <button className="btn-add" onClick={async () => { 
              await loadDropdownData(); // Güncel uçak listesini yükle
              resetFlightForm(); 
              setEditingFlight(null); 
              setShowFlightModal(true); 
            }}>
              ➕ Yeni Uçuş Ekle
            </button>
            <button 
              className="btn-sort" 
              onClick={() => setFlightSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}
            >
              📅 Tarih: {flightSortOrder === 'asc' ? '↑ Artan' : '↓ Azalan'}
            </button>
          </>
        )}
        {activeTab === 'airports' && (
          <button className="btn-add" onClick={() => setShowAirportModal(true)}>
            ➕ Yeni Havalimanı Ekle
          </button>
        )}
        {activeTab === 'airlines' && (
          <>
            <button className="btn-add" onClick={() => setShowAirlineModal(true)}>
              ➕ Yeni Havayolu Ekle
            </button>
            <button className="btn-add" style={{ marginLeft: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }} onClick={() => setShowAddAircraftModal(true)}>
              ✈️ Havayoluna Uçak Ekle
            </button>
          </>
        )}
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
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(flight => (
                    <tr key={flight.flightId}>
                      <td>{flight.flightId}</td>
                      <td>{flight.airline?.name || 'N/A'}</td>
                      <td>{flight.originAirport?.code || 'N/A'} - {flight.originAirport?.city?.city || 'N/A'}</td>
                      <td>{flight.destinationAirport?.code || 'N/A'} - {flight.destinationAirport?.city?.city || 'N/A'}</td>
                      <td>{flight.kalkisTarihi ? formatDateTime(flight.kalkisTarihi) : 'N/A'}</td>
                      <td>{flight.inisTarihi ? formatDateTime(flight.inisTarihi) : 'N/A'}</td>
                      <td>{flight.basePrice ? formatPrice(flight.basePrice) : 'N/A'}</td>
                      <td className="action-cell">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditFlight(flight)}
                        >
                          ✏️ Düzenle
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteFlight(flight.flightId)}
                        >
                          🗑️ Sil
                        </button>
                      </td>
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
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(airport => (
                    <tr key={airport.airportId}>
                      <td><strong>{airport.code}</strong></td>
                      <td>{airport.name}</td>
                      <td>{airport.city?.city || 'N/A'}</td>
                      <td>{airport.city?.country || 'N/A'}</td>
                      <td>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteAirport(airport.airportId, airport.code)}
                        >
                          🗑️ Sil
                        </button>
                      </td>
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
                    <th>Yıllık Uçuş</th>
                    <th>Uçak Sayısı</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(airline => (
                    <tr key={airline.airlineId}>
                      <td><strong>{airline.iataCode}</strong></td>
                      <td>{airline.name}</td>
                      <td>{airline.ulke}</td>
                      <td>{airline.yillikUcusSayisi}</td>
                      <td>{airline.ucakSayisi}</td>
                      <td>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteAirline(airline.airlineId, airline.name)}
                        >
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Havayolu Ekleme Modal */}
      {showAirlineModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yeni Havayolu Ekle</h2>
            <form onSubmit={handleAirlineSubmit}>
              <div className="form-group">
                <label>Havayolu Adı *</label>
                <input
                  type="text"
                  value={airlineForm.name}
                  onChange={(e) => setAirlineForm({...airlineForm, name: e.target.value})}
                  required
                  placeholder="Örn: Türk Hava Yolları"
                />
              </div>
              <div className="form-group">
                <label>Ülke *</label>
                <input
                  type="text"
                  value={airlineForm.ulke}
                  onChange={(e) => setAirlineForm({...airlineForm, ulke: e.target.value})}
                  required
                  placeholder="Türkiye"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>IATA Kodu *</label>
                  <input
                    type="text"
                    value={airlineForm.iataCode}
                    onChange={(e) => setAirlineForm({...airlineForm, iataCode: e.target.value.toUpperCase()})}
                    maxLength="2"
                    required
                    placeholder="TK"
                  />
                </div>
                <div className="form-group">
                  <label>ICAO Kodu *</label>
                  <input
                    type="text"
                    value={airlineForm.icaoCode}
                    onChange={(e) => setAirlineForm({...airlineForm, icaoCode: e.target.value.toUpperCase()})}
                    maxLength="3"
                    required
                    placeholder="THY"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Yıllık Uçuş Sayısı</label>
                  <input
                    type="number"
                    value={airlineForm.yillikUcusSayisi}
                    onChange={(e) => setAirlineForm({...airlineForm, yillikUcusSayisi: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Uçak Sayısı (Otomatik)</label>
                  <input
                    type="number"
                    value={airlineForm.ucakSayisi}
                    readOnly
                    disabled
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sahip Olduğu Uçak Türleri (Çoklu Seçim)</label>
                <select
                  multiple
                  value={airlineForm.selectedAircraftTypes}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    const newCounts = { ...airlineForm.aircraftTypeCounts };
                    // Yeni seçilenler için varsayılan adet 1
                    selected.forEach(id => {
                      if (!newCounts[id]) {
                        newCounts[id] = 1;
                      }
                    });
                    // Seçilmeyenler için adet bilgisini temizle
                    Object.keys(newCounts).forEach(id => {
                      if (!selected.includes(id)) {
                        delete newCounts[id];
                      }
                    });
                    setAirlineForm({...airlineForm, selectedAircraftTypes: selected, aircraftTypeCounts: newCounts});
                  }}
                  style={{ height: '150px' }}
                >
                  {aircraftTypes.map(type => (
                    <option key={type.aircraftTypeId} value={type.aircraftTypeId}>
                      {type.manufacturer} {type.model} ({type.capacity} koltuk)
                    </option>
                  ))}
                </select>
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                  Ctrl tuşuna basılı tutarak birden fazla seçebilirsiniz
                </small>
              </div>
              
              {/* Seçilen uçak türleri için adet seçimi */}
              {airlineForm.selectedAircraftTypes.length > 0 && (
                <div className="form-group">
                  <label>Uçak Türleri ve Adetleri</label>
                  <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', maxHeight: '200px', overflowY: 'auto' }}>
                    {airlineForm.selectedAircraftTypes.map(typeId => {
                      const type = aircraftTypes.find(t => t.aircraftTypeId === parseInt(typeId));
                      return (
                        <div key={typeId} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                          <span style={{ flex: 1, fontSize: '0.9rem' }}>
                            {type?.manufacturer} {type?.model}:
                          </span>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={airlineForm.aircraftTypeCounts[typeId] || 1}
                            onChange={(e) => {
                              const newCounts = { ...airlineForm.aircraftTypeCounts };
                              newCounts[typeId] = parseInt(e.target.value) || 1;
                              setAirlineForm({...airlineForm, aircraftTypeCounts: newCounts});
                            }}
                            style={{ width: '80px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#666' }}>adet</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="modal-buttons">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowAirlineModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-submit-modal">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Uçak Ekleme Modal */}
      {showAddAircraftModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Havayoluna Uçak Ekle</h2>
            <form onSubmit={handleAddAircraftSubmit}>
              <div className="form-group">
                <label>Havayolu *</label>
                <select
                  value={addAircraftForm.airlineId}
                  onChange={(e) => setAddAircraftForm({...addAircraftForm, airlineId: e.target.value})}
                  required
                >
                  <option value="">Havayolu Seçin</option>
                  {airlines.map(airline => (
                    <option key={airline.airlineId} value={airline.airlineId}>
                      {airline.iataCode} - {airline.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Uçak Türü *</label>
                <select
                  value={addAircraftForm.aircraftTypeId}
                  onChange={(e) => setAddAircraftForm({...addAircraftForm, aircraftTypeId: e.target.value})}
                  required
                >
                  <option value="">Uçak Türü Seçin</option>
                  {aircraftTypes.map(type => (
                    <option key={type.aircraftTypeId} value={type.aircraftTypeId}>
                      {type.manufacturer} {type.model} ({type.capacity} koltuk)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Adet *</label>
                <input
                  type="number"
                  value={addAircraftForm.count}
                  onChange={(e) => setAddAircraftForm({...addAircraftForm, count: parseInt(e.target.value) || 1})}
                  min="1"
                  max="50"
                  required
                  placeholder="1"
                />
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                  {addAircraftForm.count > 1 ? `${addAircraftForm.count} adet uçak oluşturulacak (kuyruk numaraları otomatik)` : '1 adet için kuyruk numarası belirtebilirsiniz'}
                </small>
              </div>
              {addAircraftForm.count === 1 && (
                <div className="form-group">
                  <label>Kuyruk Numarası (Opsiyonel)</label>
                  <input
                    type="text"
                    value={addAircraftForm.tailNumber}
                    onChange={(e) => setAddAircraftForm({...addAircraftForm, tailNumber: e.target.value.toUpperCase()})}
                    placeholder="TC-ABC1234 (Boş bırakılırsa otomatik oluşturulur)"
                    maxLength="10"
                  />
                </div>
              )}
              <div className="modal-buttons">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowAddAircraftModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-submit-modal">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Havalimanı Ekleme Modal */}
      {showAirportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yeni Havalimanı Ekle</h2>
            <form onSubmit={handleAirportSubmit}>
              <div className="form-group">
                <label>Havalimanı Kodu *</label>
                <input
                  type="text"
                  value={airportForm.code}
                  onChange={(e) => setAirportForm({...airportForm, code: e.target.value.toUpperCase()})}
                  maxLength="3"
                  required
                  placeholder="IST"
                />
              </div>
              <div className="form-group">
                <label>Havalimanı Adı *</label>
                <input
                  type="text"
                  value={airportForm.name}
                  onChange={(e) => setAirportForm({...airportForm, name: e.target.value})}
                  required
                  placeholder="İstanbul Havalimanı"
                />
              </div>
              <div className="form-group">
                <label>Şehir *</label>
                <select
                  value={airportForm.cityId}
                  onChange={(e) => setAirportForm({...airportForm, cityId: e.target.value})}
                  required
                >
                  <option value="">Şehir Seçin</option>
                  {cities.map(city => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.city} - {city.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowAirportModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-submit-modal">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Uçuş Ekleme/Düzenleme Modal */}
      {showFlightModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <h2>{editingFlight ? 'Uçuş Düzenle' : 'Yeni Uçuş Ekle'}</h2>
            <form onSubmit={handleFlightSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Havayolu *</label>
                  <select
                    value={flightForm.airlineId}
                    onChange={(e) => setFlightForm({...flightForm, airlineId: e.target.value})}
                    required
                  >
                    <option value="">Havayolu Seçin</option>
                    {airlines.map(airline => (
                      <option key={airline.airlineId} value={airline.airlineId}>
                        {airline.iataCode} - {airline.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Uçak *
                    {!flightForm.airlineId && <span style={{color: '#999', fontSize: '0.85rem'}}> (Önce havayolu seçin)</span>}
                    {flightForm.airlineId && currentFilteredAircrafts.length === 0 && (
                      <span style={{color: '#dc3545', fontSize: '0.85rem'}}> ⚠️ Bu havayolunun uçağı yok!</span>
                    )}
                  </label>
                  <select
                    value={flightForm.aircraftId}
                    onChange={(e) => setFlightForm({...flightForm, aircraftId: e.target.value})}
                    disabled={!flightForm.airlineId || currentFilteredAircrafts.length === 0}
                    required
                  >
                    <option value="">
                      {!flightForm.airlineId 
                        ? 'Önce havayolu seçin' 
                        : currentFilteredAircrafts.length === 0 
                          ? 'Bu havayolunun uçağı yok - Önce uçak ekleyin' 
                          : 'Uçak Seçin'}
                    </option>
                    {currentFilteredAircrafts.map(aircraft => (
                      <option key={aircraft.aircraftId} value={aircraft.aircraftId}>
                        {aircraft.tailNumber} - {aircraft.model} ({aircraft.capacity} koltuk)
                      </option>
                    ))}
                  </select>
                  {flightForm.airlineId && currentFilteredAircrafts.length === 0 && (
                    <small style={{ color: '#dc3545', marginTop: '5px', display: 'block' }}>
                      Bu havayoluna uçak eklemeniz gerekiyor. Havayolları sekmesinden "Havayoluna Uçak Ekle" butonunu kullanın.
                    </small>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kalkış Havalimanı *</label>
                  <select
                    value={flightForm.originAirportId}
                    onChange={(e) => setFlightForm({...flightForm, originAirportId: e.target.value})}
                    required
                  >
                    <option value="">Kalkış Seçin</option>
                    {airports.map(airport => (
                      <option key={airport.airportId} value={airport.airportId}>
                        {airport.code} - {airport.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Varış Havalimanı *</label>
                  <select
                    value={flightForm.destinationAirportId}
                    onChange={(e) => setFlightForm({...flightForm, destinationAirportId: e.target.value})}
                    required
                  >
                    <option value="">Varış Seçin</option>
                    {airports.map(airport => (
                      <option key={airport.airportId} value={airport.airportId}>
                        {airport.code} - {airport.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kalkış Tarihi/Saati *</label>
                  <input
                    type="datetime-local"
                    value={flightForm.kalkisTarihi}
                    onChange={(e) => setFlightForm({...flightForm, kalkisTarihi: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>İniş Tarihi/Saati *</label>
                  <input
                    type="datetime-local"
                    value={flightForm.inisTarihi}
                    onChange={(e) => setFlightForm({...flightForm, inisTarihi: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fiyat (TL) *</label>
                <input
                  type="number"
                  value={flightForm.basePrice}
                  onChange={(e) => setFlightForm({...flightForm, basePrice: e.target.value})}
                  min="0"
                  step="0.01"
                  required
                  placeholder="1500.00"
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-cancel-modal" onClick={() => { setShowFlightModal(false); setEditingFlight(null); }}>
                  İptal
                </button>
                <button type="submit" className="btn-submit-modal">
                  {editingFlight ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
