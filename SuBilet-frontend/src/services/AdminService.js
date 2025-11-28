import apiClient from '../utils/apiClient';

const API_URL = '/admin';

class AdminService {
    
    login(username, password) {
        return apiClient.post(`${API_URL}/login`, {
            username: username,
            password: password
        });
    }
}

const adminServiceInstance = new AdminService();
export default adminServiceInstance;
