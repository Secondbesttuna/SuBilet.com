import apiClient from '../utils/apiClient';

const API_URL = '/payments';

class PaymentService {
    
    getAllPayments() {
        return apiClient.get(API_URL);
    }

    getPaymentById(id) {
        return apiClient.get(`${API_URL}/${id}`);
    }

    getPaymentByReservationId(reservationId) {
        return apiClient.get(`${API_URL}/reservation/${reservationId}`);
    }

    createPayment(payment) {
        return apiClient.post(API_URL, payment);
    }

    updatePaymentStatus(id, status) {
        return apiClient.put(`${API_URL}/${id}/status`, null, {
            params: { status }
        });
    }
}

const paymentServiceInstance = new PaymentService();
export default paymentServiceInstance;

