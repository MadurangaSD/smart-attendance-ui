import axios from 'axios'

// API Base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data || 'Server error occurred')
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check your connection.')
    } else {
      // Error in request setup
      throw new Error(error.message || 'Request failed')
    }
  }
)

// ===========================
// Student Management Functions
// ===========================

export async function fetchStudents() {
  try {
    const response = await api.get('/students')
    return response.data
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error
  }
}

export async function addStudent(student) {
  try {
    const response = await api.post('/add-student', student)
    return response.data
  } catch (error) {
    console.error('Error adding student:', error)
    throw error
  }
}

export async function editStudent(id, payload) {
  try {
    const response = await api.put(`/update-student/${id}`, payload)
    return response.data
  } catch (error) {
    console.error('Error updating student:', error)
    throw error
  }
}

export async function removeStudent(id) {
  try {
    const response = await api.delete(`/delete-student/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting student:', error)
    throw error
  }
}

// ===========================
// Face Recognition Functions
// ===========================

export async function recognize(imageBlobOrDataURL) {
  try {
    // For now, return mock data since face recognition backend isn't set up
    // TODO: Replace with actual face recognition API call
    // Example implementation when backend is ready:
    /*
    const formData = new FormData()
    
    // Convert data URL to blob if needed
    if (typeof imageBlobOrDataURL === 'string' && imageBlobOrDataURL.startsWith('data:')) {
      const response = await fetch(imageBlobOrDataURL)
      const blob = await response.blob()
      formData.append('image', blob, 'capture.png')
    } else {
      formData.append('image', imageBlobOrDataURL, 'capture.png')
    }
    
    const result = await api.post('/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    return result.data
    */

    // Mock response for development
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay

    // Simulate recognition result
    const mockStudents = await fetchStudents()
    if (mockStudents && mockStudents.length > 0) {
      // Randomly select a student for demo
      const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)]
      const mockConfidence = 0.85 + Math.random() * 0.14 // Random confidence between 0.85-0.99

      return {
        matched: true,
        studentId: randomStudent.studentId,
        name: randomStudent.name,
        confidence: mockConfidence
      }
    }

    return {
      matched: false,
      message: 'No match found'
    }
  } catch (error) {
    console.error('Error recognizing face:', error)
    throw error
  }
}

// ===========================
// Attendance Functions
// ===========================

export async function getAttendanceByDate(date) {
  try {
    // TODO: Update backend to support date filtering
    // For now, fetch all and filter client-side
    const response = await api.get('/attendance', {
      params: { date }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching attendance:', error)
    // Return empty array instead of throwing to prevent UI breaks
    return []
  }
}

export async function markAttendance({ studentId, name, confidence }) {
  try {
    const date = new Date().toISOString().slice(0, 10)
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const attendanceData = {
      studentId,
      name,
      confidence,
      date,
      time,
      timestamp: new Date().toISOString()
    }

    const response = await api.post('/mark-attendance', attendanceData)
    return response.data
  } catch (error) {
    console.error('Error marking attendance:', error)
    throw error
  }
}

export async function getAllAttendance() {
  try {
    const response = await api.get('/attendance')
    return response.data
  } catch (error) {
    console.error('Error fetching all attendance:', error)
    return []
  }
}

// ===========================
// Statistics Functions
// ===========================

export async function getAttendanceStats(startDate, endDate) {
  try {
    const response = await api.get('/attendance/stats', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching attendance stats:', error)
    return {
      totalPresent: 0,
      averageAttendance: 0,
      dailyStats: []
    }
  }
}

// ===========================
// Health Check
// ===========================

export async function checkServerHealth() {
  try {
    const response = await api.get('/')
    return { healthy: true, message: response.data }
  } catch (error) {
    return { healthy: false, message: error.message }
  }
}

// Export API instance for direct use if needed
export { api }
