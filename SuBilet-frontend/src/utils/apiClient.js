import axios from 'axios';
import { showApiNotification } from './notification';

const API_BASE_URL = 'http://localhost:8080/api';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Bildirim gösterilmeyecek endpoint'ler (frontend'de manuel kontrol edilecek)
const SILENT_ENDPOINTS = [
  '/payments',
  '/admin/', // Admin paneli işlemleri için manuel bildirim gösterilecek
  '/auth/register',
  '/customers/tc/',
  '/reservations', // Rezervasyon işlemleri için manuel bildirim gösterilecek
];

// URL'in sessiz endpoint olup olmadığını kontrol et
const isSilentEndpoint = (url) => {
  return SILENT_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Response interceptor - Backend'den gelen ApiResponse'u işle
apiClient.interceptors.response.use(
  (response) => {
    // Eğer response.data bir ApiResponse ise (success, message, data içeriyorsa)
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const apiResponse = response.data;
      const method = response.config?.method?.toLowerCase();
      const url = response.config?.url || '';
      
      // Sessiz endpoint'ler için bildirim gösterme
      const shouldShowNotification = !isSilentEndpoint(url) && 
        apiResponse.message && 
        method && 
        ['post', 'put', 'delete', 'patch'].includes(method);
      
      if (shouldShowNotification) {
        showApiNotification(apiResponse);
      }
      
      // Data'yı direkt döndür (frontend'de response.data.data yerine response.data kullanılabilir)
      return {
        ...response,
        data: apiResponse.data || apiResponse,
        apiResponse: apiResponse, // Orijinal ApiResponse'u da sakla
      };
    }
    
    return response;
  },
  (error) => {
    // Hata durumunda
    const url = error.config?.url || '';
    const isCustomerGet = url.includes('/customers/') && error.config?.method === 'get';
    const status = error.response?.status;
    
    // 401 Unauthorized - Oturum süresi dolmuş veya geçersiz token
    if (status === 401) {
      // Token'ı ve kullanıcı bilgilerini temizle
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userType');
      
      // Auth sayfasına yönlendir (sadece auth sayfasında değilsek)
      if (!window.location.pathname.includes('/auth')) {
        showApiNotification({
          success: false,
          message: 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.',
        });
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
    
    // 403 Forbidden - Yetkisiz erişim
    if (status === 403) {
      showApiNotification({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor.',
      });
      return Promise.reject(error);
    }
    
    // Sessiz endpoint'ler ve customer GET için hata bildirimi gösterme
    if (!isSilentEndpoint(url) && !isCustomerGet) {
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // ApiResponse formatındaysa
        if (errorData.success !== undefined) {
          showApiNotification(errorData);
        } else {
          // Standart hata mesajı
          showApiNotification({
            success: false,
            message: errorData.message || error.message || 'Bir hata oluştu',
          });
        }
      } else {
        // Network error veya bağlantı hatası
        showApiNotification({
          success: false,
          message: error.message || 'Bağlantı hatası. Backend çalışıyor mu?',
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

