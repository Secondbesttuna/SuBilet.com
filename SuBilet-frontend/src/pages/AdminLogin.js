import React, { useState } from 'react';
import AdminService from '../services/AdminService';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
// Bildirimler apiClient interceptor tarafından otomatik gösteriliyor

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AdminService.login(username, password);
      const adminData = response.data || response.apiResponse?.data;
      
      if (adminData) {
        localStorage.setItem('admin', JSON.stringify(adminData));
        // Bildirim apiClient interceptor tarafından otomatik gösterilecek
        navigate('/admin-dashboard');
      } else {
        setError("Kullanıcı adı veya şifre hatalı!");
      }
    } catch (err) {
      // Hata bildirimi apiClient interceptor tarafından gösterilecek
      setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      console.error(err);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">Yönetici Girişi</h2>
        
        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="admin-login-form-group">
            <label className="admin-login-label">Kullanıcı Adı:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-login-input"
              placeholder="admin"
            />
          </div>
          
          <div className="admin-login-form-group">
            <label className="admin-login-label">Şifre:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              placeholder="admin123"
            />
          </div>

          <button type="submit" className="admin-login-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;