import apiClient from '../utils/apiClient';

const API_URL = '/airports';

class AirportService {
    
    getAllAirports() {
        return apiClient.get(API_URL);
    }

    getAirportById(id) {
        return apiClient.get(`${API_URL}/${id}`);
    }

    getAirportByCode(code) {
        return apiClient.get(`${API_URL}/code/${code}`);
    }

    createAirport(airport) {
        return apiClient.post(API_URL, airport);
    }

    updateAirport(id, airport) {
        return apiClient.put(`${API_URL}/${id}`, airport);
    }

    deleteAirport(id) {
        return apiClient.delete(`${API_URL}/${id}`);
    }
}

const airportServiceInstance = new AirportService();
export default airportServiceInstance;

