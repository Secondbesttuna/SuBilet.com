import { notification } from 'antd';

/**
 * Backend'den gelen ApiResponse'a göre notification gösterir
 * @param {Object} response - Backend'den gelen ApiResponse
 */
export const showApiNotification = (response) => {
  if (!response) return;

  const { success, message } = response;

  if (success) {
    notification.success({
      message: 'Başarılı',
      description: message || 'İşlem başarıyla tamamlandı',
      placement: 'topRight',
      duration: 3,
    });
  } else {
    notification.error({
      message: 'Hata',
      description: message || 'Bir hata oluştu',
      placement: 'topRight',
      duration: 4,
    });
  }
};

/**
 * Başarı bildirimi gösterir
 */
export const showSuccess = (message, description) => {
  notification.success({
    message: message || 'Başarılı',
    description: description || 'İşlem başarıyla tamamlandı',
    placement: 'topRight',
    duration: 3,
  });
};

/**
 * Hata bildirimi gösterir
 */
export const showError = (message, description) => {
  notification.error({
    message: message || 'Hata',
    description: description || 'Bir hata oluştu',
    placement: 'topRight',
    duration: 4,
  });
};

/**
 * Uyarı bildirimi gösterir
 */
export const showWarning = (message, description) => {
  notification.warning({
    message: message || 'Uyarı',
    description: description || 'Lütfen dikkat edin',
    placement: 'topRight',
    duration: 3,
  });
};

/**
 * Bilgi bildirimi gösterir
 */
export const showInfo = (message, description) => {
  notification.info({
    message: message || 'Bilgi',
    description: description || '',
    placement: 'topRight',
    duration: 3,
  });
};








