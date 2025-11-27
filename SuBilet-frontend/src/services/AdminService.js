import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

class AdminService {
    
    login(username, password) {
        return axios.post(API_URL + '/login', {
            username: username,
            password: password
        });
    }
}

export default new AdminService();
