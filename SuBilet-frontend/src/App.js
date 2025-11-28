import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import trTR from 'antd/locale/tr_TR';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import Booking from './pages/Booking';
import MyReservations from './pages/MyReservations';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={trTR}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Ana Sayfa */}
              <Route path="/" element={<Home />} />
              
              {/* Uçuş Arama Sonuçları */}
              <Route path="/flights/search" element={<FlightSearch />} />
              
              {/* Rezervasyon Sayfası */}
              <Route path="/booking/:flightId" element={<Booking />} />
              
              {/* Tüm Uçuşlar */}
              <Route path="/flights" element={<h1 style={{textAlign:'center', marginTop:'50px'}}>Tüm Uçuşlar</h1>} />
              
              {/* Rezervasyonlarım */}
              <Route path="/reservations" element={<MyReservations />} />
              
              {/* Admin Giriş */}
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Admin Paneli */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;