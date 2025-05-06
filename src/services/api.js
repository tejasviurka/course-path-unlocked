
import axios from 'axios';

// Configure the API URL based on the environment
// For local development, use the full server URL
// In production, the relative path will work with proper proxy configuration
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a timeout to prevent hanging requests
  timeout: 10000,
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lmsUserToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('API Error:', error.message, error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received. The server might be down or unreachable.');
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to check if backend is reachable
export const checkBackendConnection = async () => {
  try {
    const response = await api.get('/health', { timeout: 2000 });
    return { connected: true, status: response.status };
  } catch (error) {
    return { 
      connected: false, 
      error: error.message,
      details: error.response?.status || 'No response'
    };
  }
};

// Authentication endpoints
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
    
  register: (userData) => 
    api.post('/auth/register', userData),
};

// Course endpoints
export const courseAPI = {
  getAllCourses: () => 
    api.get('/courses/all'),
    
  getCourseById: (id) => 
    api.get(`/courses/${id}`),
    
  // Admin endpoints
  createCourse: (courseData) => 
    api.post('/courses/admin/create', courseData),
    
  updateCourse: (id, courseData) => 
    api.put(`/courses/admin/${id}`, courseData),
    
  deleteCourse: (id) => 
    api.delete(`/courses/admin/${id}`),
    
  // Student endpoints
  getEnrolledCourses: () => 
    api.get('/courses/enrolled'),
    
  enrollInCourse: (courseId) => 
    api.post('/courses/enroll', { courseId }),
    
  getEnrollments: () => 
    api.get('/courses/enrollments'),
    
  getEnrollment: (courseId) => 
    api.get(`/courses/enrollment/${courseId}`),
    
  updateProgress: (courseId, moduleId, completed) => 
    api.post(`/courses/progress/${courseId}`, { moduleId, completed }),
};

export default api;
