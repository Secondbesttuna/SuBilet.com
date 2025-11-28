import apiClient from '../utils/apiClient';

const API_URL = '/flights';

class FlightService {
    
    getAllFlights() {
        return apiClient.get(API_URL);
    }

    getFlightById(id) {
        return apiClient.get(`${API_URL}/${id}`);
    }

    searchFlights(originAirportId, destinationAirportId, date) {
        return apiClient.get(`${API_URL}/search`, {
            params: {
                originAirportId,
                destinationAirportId,
                date
            }
        });
    }

    createFlight(flight) {
        return apiClient.post(API_URL, flight);
    }

    updateFlight(id, flight) {
        return apiClient.put(`${API_URL}/${id}`, flight);
    }

    deleteFlight(id) {
        return apiClient.delete(`${API_URL}/${id}`);
    }
}

const flightServiceInstance = new FlightService();
export default flightServiceInstance;

