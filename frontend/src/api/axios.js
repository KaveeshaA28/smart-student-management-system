import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// Auth APIs
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
};

// Student APIs
export const studentAPI = {
  getAll:    ()           => API.get('/students'),
  getById:   (id)         => API.get(`/students/${id}`),
  create:    (data)       => API.post('/students', data),
  update:    (id, data)   => API.put(`/students/${id}`, data),
  delete:    (id)         => API.delete(`/students/${id}`),
  search:    (keyword)    => API.get(`/students/search?keyword=${keyword}`),
};

// Course APIs
export const courseAPI = {
  getAll:    ()           => API.get('/courses'),
  getById:   (id)         => API.get(`/courses/${id}`),
  create:    (data)       => API.post('/courses', data),
  update:    (id, data)   => API.put(`/courses/${id}`, data),
  delete:    (id)         => API.delete(`/courses/${id}`),
};

// Enrollment APIs
export const enrollmentAPI = {
  getAll:      ()         => API.get('/enrollments'),
  getByStudent:(id)       => API.get(`/enrollments/student/${id}`),
  getByCourse: (id)       => API.get(`/enrollments/course/${id}`),
  enroll:      (data)     => API.post('/enrollments', data),
  drop:        (id)       => API.patch(`/enrollments/${id}/drop`),
};

// Attendance APIs
export const attendanceAPI = {
  mark:            (data) => API.post('/attendance', data),
  getByEnrollment: (id)   => API.get(`/attendance/enrollment/${id}`),
  getByCourse:     (id)   => API.get(`/attendance/course/${id}`),
  getStats:        (id)   => API.get(`/attendance/stats/enrollment/${id}`),
};

// Marks APIs
export const markAPI = {
  add:               (data) => API.post('/marks', data),
  create:            (data) => API.post('/marks', data),
  getByEnrollment:   (id)   => API.get(`/marks/enrollment/${id}`),
  getByStudent:      (id)   => API.get(`/marks/student/${id}`),
  getGPA:            (id)   => API.get(`/marks/gpa/enrollment/${id}`),
  getGpaByEnrollment:(id)   => API.get(`/marks/gpa/enrollment/${id}`),
  getCumulativeGpa:  (id)   => API.get(`/marks/gpa/student/${id}`),
};
