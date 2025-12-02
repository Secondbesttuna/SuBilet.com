import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import About from './pages/About';
import './App.css';

// Layout bileşeni - Navbar ve Footer'ı koşullu gösterir
function Layout({ children }) {
  const location = useLocation();
  
  // Bu route'larda navbar/footer gösterme
  const hideNavbarRoutes = ['/404', '/not-found'];
  const isNotFoundPage = !['/', '/flights/search', '/flights', '/reservations', '/auth', '/admin', '/admin-dashboard', '/about'].some(
    route => location.pathname === route || location.pathname.startsWith('/booking/')
  );
  
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || isNotFoundPage;

  if (shouldHideNavbar) {
    return <>{children}</>;
  }

  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ConfigProvider locale={trTR}>
      <Router>
        <Layout>
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
            
            {/* Giriş/Kayıt Sayfası */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Giriş */}
            <Route path="/admin" element={<AdminLogin />} />
            
            {/* Admin Paneli */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* Hakkında Sayfası */}
            <Route path="/about" element={<About />} />
            
            {/* 404 - Sayfa Bulunamadı */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
