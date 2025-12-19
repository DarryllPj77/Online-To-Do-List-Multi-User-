import axios from 'axios';

const API_URL = 'https://online-to-do-list-multi-user.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email, password) =>
    api.post('/register', { email, password }),
  login: (email, password) =>
    api.post('/login', { email, password }),
};

export const tasksAPI = {
  getTasks: () => api.get('/tasks'),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (title, description) =>
    api.post('/tasks', { title, description }),
  updateTask: (id, title, description, completed) =>
    api.put(`/tasks/${id}`, { title, description, completed }),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;
