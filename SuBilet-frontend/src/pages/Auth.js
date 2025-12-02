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
      // Müşteri kaydı için yaş kontrolü - minimum 13 yaş
      if (userType === 'customer' && customerForm.dogumTarihi) {
        const birthDate = new Date(customerForm.dogumTarihi);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 13) {
          setError('13 yaşından küçük kişiler kayıt olamaz. Lütfen bir veli/vasi eşliğinde işlem yapın.');
          setLoading(false);
          return;
        }
      }

      // Telefon numarası format kontrolü (Türkiye formatı: 05XX XXX XX XX)
      if (userType === 'customer' && customerForm.telNo) {
        const phoneRegex = /^(05)[0-9]{9}$/;
        const cleanPhone = customerForm.telNo.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          setError('Geçersiz telefon numarası. Lütfen 05XX XXX XX XX formatında girin (örn: 05321234567)');
          setLoading(false);
          return;
        }
      }

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
          
          {/* User Type Selection */}
          <div className="user-type-toggle">
            <button 
              className={userType === 'customer' ? 'active' : ''} 
              onClick={() => { setUserType('customer'); setIsLogin(true); }}
            >
              👤 Müşteri
            </button>
            <button 
              className={userType === 'admin' ? 'active' : ''} 
              onClick={() => { setUserType('admin'); setIsLogin(true); }}
            >
              🛡️ Yönetici
            </button>
          </div>

          {/* Login/Register Toggle - Sadece müşteri için kayıt seçeneği */}
          {userType === 'customer' && (
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
          )}

          {/* Admin için sadece giriş bilgisi */}
          {userType === 'admin' && (
            <div className="admin-info">
              <p>🔐 Yönetici girişi</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Login Form - Müşteri için */}
          {isLogin && userType === 'customer' && (
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
                <label>Telefon (05XX XXX XX XX)</label>
                <input
                  type="tel"
                  name="telNo"
                  value={customerForm.telNo}
                  onChange={handleCustomerFormChange}
                  placeholder="05321234567"
                  maxLength="11"
                  pattern="05[0-9]{9}"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </button>
            </form>
          )}

          {/* Admin Login Form - Admin için sadece giriş */}
          {userType === 'admin' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginFormChange}
                  required
                  placeholder="Yönetici kullanıcı adı"
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
                {loading ? 'Giriş yapılıyor...' : 'Yönetici Girişi'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;

