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

// Response interceptor - Backend'den gelen ApiResponse'u işle
apiClient.interceptors.response.use(
  (response) => {
    // Eğer response.data bir ApiResponse ise (success, message, data içeriyorsa)
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const apiResponse = response.data;
      const method = response.config?.method?.toLowerCase();
      
      // Notification göster (GET hariç tüm istekler için)
      // GET istekleri için mesajları göstermeyelim (sadece POST, PUT, DELETE için)
      if (apiResponse.message && method && ['post', 'put', 'delete', 'patch'].includes(method)) {
        // Debug: Bildirim gösterilecek
        console.log('Bildirim gösteriliyor:', { method, message: apiResponse.message, success: apiResponse.success });
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
      showApiNotification({
        success: false,
        message: error.message || 'Bağlantı hatası. Backend çalışıyor mu?',
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

