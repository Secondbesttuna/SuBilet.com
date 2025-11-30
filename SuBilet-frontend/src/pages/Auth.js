import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer'); // 'customer' veya 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state'leri
  const [customerForm, setCustomerForm] = useState({
    username: '',
    password: '',
    tcNo: '',
    isimSoyad: '',
    dogumTarihi: '',
    cinsiyet: 'Erkek',
    mail: '',
    telNo: ''
  });

  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    fullName: ''
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const handleCustomerFormChange = (e) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminFormChange = (e) => {
    setAdminForm({
      ...adminForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginFormChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (userType === 'customer') {
        response = await AuthService.registerCustomer(customerForm);
      } else {
        response = await AuthService.registerAdmin(adminForm);
      }

      const result = response.data || response.apiResponse?.data;
      if (result) {
        // Session storage'a kaydet
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('userType', result.userType);
        sessionStorage.setItem('user', JSON.stringify(result.user));

        // Başarılı - yönlendir ve sayfayı yenile (navbar güncellensin)
        if (result.userType === 'ADMIN') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (userType === 'customer') {
        response = await AuthService.loginCustomer(loginForm.username, loginForm.password);
      } else {
        response = await AuthService.loginAdmin(loginForm.username, loginForm.password);
      }

      const result = response.data || response.apiResponse?.data;
      if (result) {
        // Session storage'a kaydet
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('userType', result.userType);
        sessionStorage.setItem('user', JSON.stringify(result.user));

        // Başarılı - yönlendir ve sayfayı yenile (navbar güncellensin)
        if (result.userType === 'ADMIN') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>ŞUBİLET</h1>
          
          {/* Login/Register Toggle */}
          <div className="auth-toggle">
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(true)}
            >
              Giriş Yap
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(false)}
            >
              Kayıt Ol
            </button>
          </div>

          {/* User Type Selection */}
          <div className="user-type-toggle">
            <button 
              className={userType === 'customer' ? 'active' : ''} 
              onClick={() => setUserType('customer')}
            >
              👤 Müşteri
            </button>
            <button 
              className={userType === 'admin' ? 'active' : ''} 
              onClick={() => setUserType('admin')}
            >
              🛡️ Yönetici
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginFormChange}
                  required
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div className="form-group">
                <label>Şifre</label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginFormChange}
                  required
                  placeholder="Şifrenizi girin"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          )}

          {/* Register Form - Customer */}
          {!isLogin && userType === 'customer' && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>Kullanıcı Adı *</label>
                <input
                  type="text"
                  name="username"
                  value={customerForm.username}
                  onChange={handleCustomerFormChange}
                  required
                  placeholder="Kullanıcı adı"
                />
              </div>

              <div className="form-group">
                <label>Şifre *</label>
                <input
                  type="password"
                  name="password"
                  value={customerForm.password}
                  onChange={handleCustomerFormChange}
                  required
                  placeholder="Şifre"
                />
              </div>

              <div className="form-group">
                <label>TC Kimlik No (Opsiyonel)</label>
                <input
                  type="text"
                  name="tcNo"
                  value={customerForm.tcNo}
                  onChange={handleCustomerFormChange}
                  maxLength="11"
                  placeholder="12345678901"
                />
              </div>

              <div className="form-group">
                <label>Ad Soyad *</label>
                <input
                  type="text"
                  name="isimSoyad"
                  value={customerForm.isimSoyad}
                  onChange={handleCustomerFormChange}
                  required
                  placeholder="Ad Soyad"
                />
              </div>

              <div className="form-group">
                <label>Doğum Tarihi</label>
                <input
                  type="date"
                  name="dogumTarihi"
                  value={customerForm.dogumTarihi}
                  onChange={handleCustomerFormChange}
                />
              </div>

              <div className="form-group">
                <label>Cinsiyet</label>
                <select
                  name="cinsiyet"
                  value={customerForm.cinsiyet}
                  onChange={handleCustomerFormChange}
                >
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>

              <div className="form-group">
                <label>E-posta</label>
                <input
                  type="email"
                  name="mail"
                  value={customerForm.mail}
                  onChange={handleCustomerFormChange}
                  placeholder="ornek@email.com"
                />
              </div>

              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  name="telNo"
                  value={customerForm.telNo}
                  onChange={handleCustomerFormChange}
                  placeholder="05321234567"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </button>
            </form>
          )}

          {/* Register Form - Admin */}
          {!isLogin && userType === 'admin' && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>Kullanıcı Adı *</label>
                <input
                  type="text"
                  name="username"
                  value={adminForm.username}
                  onChange={handleAdminFormChange}
                  required
                  placeholder="Kullanıcı adı"
                />
              </div>

              <div className="form-group">
                <label>Ad Soyad *</label>
                <input
                  type="text"
                  name="fullName"
                  value={adminForm.fullName}
                  onChange={handleAdminFormChange}
                  required
                  placeholder="Ad Soyad"
                />
              </div>

              <div className="form-group">
                <label>Şifre *</label>
                <input
                  type="password"
                  name="password"
                  value={adminForm.password}
                  onChange={handleAdminFormChange}
                  required
                  placeholder="Şifre"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;

