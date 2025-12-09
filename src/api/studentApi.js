import axios from "axios";

// Use environment variable when available (Vite: import.meta.env)
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : process.env.REACT_APP_API_URL || "http://localhost:5000";

// Trim trailing slashes to avoid accidental double-slashes
const API_BASE = String(API_BASE_RAW).replace(/\/+$/,'').replace(/\\/g, '/');

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Centralized response handling: unwrap `res.data` on success,
// and normalize errors to the server JSON payload when possible.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error?.response?.data || { message: error.message || 'API Error' };
    // Keep a concise console log for debugging
    console.error('API error:', payload);
    return Promise.reject(payload);
  }
);

async function addStudent(data) {
  try {
    return await api.post('/add-student', data);
  } catch (err) {
    console.error('addStudent error:', err);
    throw err;
  }
}

async function getStudents() {
  try {
    return await api.get('/students');
  } catch (err) {
    console.error('getStudents error:', err);
    throw err;
  }
}

async function deleteStudent(id) {
  try {
    return await api.delete(`/delete-student/${id}`);
  } catch (err) {
    console.error('deleteStudent error:', err);
    throw err;
  }
}

async function updateStudent(id, data) {
  try {
    return await api.put(`/update-student/${id}`, data);
  } catch (err) {
    console.error('updateStudent error:', err);
    throw err;
  }
}

export { api, addStudent, getStudents, deleteStudent, updateStudent };

export default {
  api,
  addStudent,
  getStudents,
  deleteStudent,
  updateStudent,
};
