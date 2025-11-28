import apiClient from '../utils/apiClient';

const API_URL = '/reservations';

class ReservationService {
    
    getAllReservations() {
        return apiClient.get(API_URL);
    }

    getReservationById(id) {
        return apiClient.get(`${API_URL}/${id}`);
    }

    getReservationByPNR(pnr) {
        return apiClient.get(`${API_URL}/pnr/${pnr}`);
    }

    getReservationsByCustomerId(customerId) {
        return apiClient.get(`${API_URL}/customer/${customerId}`);
    }

    createReservation(reservation) {
        return apiClient.post(API_URL, reservation);
    }

    updateReservation(id, reservation) {
        return apiClient.put(`${API_URL}/${id}`, reservation);
    }

    cancelReservation(id) {
        return apiClient.put(`${API_URL}/${id}/cancel`);
    }
}

const reservationServiceInstance = new ReservationService();
export default reservationServiceInstance;

