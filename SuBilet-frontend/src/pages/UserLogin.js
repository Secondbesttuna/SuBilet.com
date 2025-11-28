import React, { useState } from 'react';
import CustomerService from '../services/CustomerService';
import { useNavigate } from 'react-router-dom';
// Bildirimler apiClient interceptor tarafından otomatik gösteriliyor
import './UserLogin.css';

function UserLogin({ onLoginSuccess, onClose }) {
  const navigate = useNavigate();
  const [tcNo, setTcNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!tcNo || tcNo.length !== 11) {
      setError('Lütfen 11 haneli TC Kimlik Numaranızı giriniz');
      setLoading(false);
      return;
    }

    try {
      const response = await CustomerService.login(tcNo);
      const customerData = response.data || response.apiResponse?.data;
      
      if (customerData) {
        localStorage.setItem('customer', JSON.stringify(customerData));
        // Bildirim apiClient interceptor tarafından otomatik gösterilecek
        if (onLoginSuccess) {
          onLoginSuccess(customerData);
        }
        if (onClose) {
          onClose();
        }
        navigate('/');
      }
    } catch (err) {
      // Hata mesajı apiClient interceptor tarafından gösterilecek
      setError('TC Kimlik No bulunamadı. Lütfen rezervasyon yaparken girdiğiniz TC No\'yu kullanın.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-overlay" onClick={onClose}>
      <div className="user-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Kullanıcı Girişi</h2>
        <p className="login-info">Rezervasyon yaparken kullandığınız TC Kimlik No ile giriş yapın</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="user-login-form">
          <div className="form-group">
            <label htmlFor="tcNo">TC Kimlik No</label>
            <input
              id="tcNo"
              type="text"
              value={tcNo}
              onChange={(e) => setTcNo(e.target.value.replace(/\D/g, ''))}
              placeholder="12345678901"
              maxLength="11"
              pattern="[0-9]{11}"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="login-help">
          <p><strong>İlk kez mi kullanıyorsunuz?</strong></p>
          <p>TC Kimlik No'nuzu rezervasyon yaparken otomatik olarak kaydediyoruz. İlk rezervasyonunuzdan sonra bu TC No ile giriş yapabilirsiniz.</p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;

