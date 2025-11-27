import React, { useState } from 'react';
import AdminService from '../services/AdminService';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AdminService.login(username, password);
      
      if (response.data) {
        alert("Giriş Başarılı: Hoşgeldin " + response.data.fullName);
        localStorage.setItem('admin', JSON.stringify(response.data));
        navigate('/admin-dashboard');
      } else {
        setError("Kullanıcı adı veya şifre hatalı!");
      }
    } catch (err) {
      setError("Hata: Backend (Port 8080) çalışıyor mu?");
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div style={{ padding: '40px', border: '1px solid #ccc', borderRadius: '10px', width: '350px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Yönetici Girişi</h2>
        
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{display: 'block', marginBottom: '5px'}}>Kullanıcı Adı:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="admin"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{display: 'block', marginBottom: '5px'}}>Şifre:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="12345"
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;