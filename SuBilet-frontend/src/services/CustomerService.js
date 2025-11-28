import apiClient from '../utils/apiClient';

const API_URL = '/customers';

class CustomerService {
    
    getAllCustomers() {
        return apiClient.get(API_URL);
    }

    getCustomerById(id) {
        return apiClient.get(`${API_URL}/${id}`);
    }

    getCustomerByTcNo(tcNo) {
        return apiClient.get(`${API_URL}/tc/${tcNo}`);
    }

    createCustomer(customer) {
        return apiClient.post(API_URL, customer);
    }

    updateCustomer(id, customer) {
        return apiClient.put(`${API_URL}/${id}`, customer);
    }

    deleteCustomer(id) {
        return apiClient.delete(`${API_URL}/${id}`);
    }

    login(tcNo) {
        return apiClient.post(`${API_URL}/login`, { tcNo });
    }
}

const customerServiceInstance = new CustomerService();
export default customerServiceInstance;

