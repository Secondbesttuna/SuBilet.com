import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana Sayfa */}
        <Route path="/" element={<h1 style={{textAlign:'center', marginTop:'50px'}}>Şubilet Ana Sayfasına Hoşgeldiniz</h1>} />
         
        {/* Admin Giriş */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Admin Paneli (Giriş yapınca buraya gelecek) */}
        <Route path="/admin-dashboard" element={<h1 style={{textAlign:'center', marginTop:'50px', color:'green'}}>Admin Paneli - Hoşgeldiniz!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;