
import axios from 'axios';

// Update the API_URL to use a relative path instead of localhost
// This will ensure requests are sent to the same origin as the frontend
const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lmsUserToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
