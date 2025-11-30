import apiClient from '../utils/apiClient';

const API_URL = '/auth';

class AuthService {
    
    // Customer Register
    registerCustomer(customerData) {
        return apiClient.post(`${API_URL}/register/customer`, customerData);
    }

    // Admin Register
    registerAdmin(adminData) {
        return apiClient.post(`${API_URL}/register/admin`, adminData);
    }

    // Customer Login
    loginCustomer(username, password) {
        return apiClient.post(`${API_URL}/login/customer`, {
            username: username,
            password: password
        });
    }

    // Admin Login
    loginAdmin(username, password) {
        return apiClient.post(`${API_URL}/login/admin`, {
            username: username,
            password: password
        });
    }

    // Token doğrulama
    validateToken() {
        return apiClient.get(`${API_URL}/validate`);
    }

    // Logout
    logout() {
        return apiClient.post(`${API_URL}/logout`);
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;

