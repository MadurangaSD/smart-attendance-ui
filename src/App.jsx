import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Reports from './pages/Reports'
import AdminStudents from './pages/AdminStudents'
import AddStudent from './components/AddStudent'
import studentApi from './api/studentApi'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles, userRole, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // If no specific roles required or user role is in allowed roles, render
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">You need {allowedRoles.join(' or ')} role to access this page.</p>
        <p className="text-gray-600 mb-6">Current role: <span className="font-bold">{userRole}</span></p>
        <a 
          href="/dashboard" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    )
  }
  return children
}

// 404 Not Found Component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  )
}

export default function App(){
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  
  const [role, setRole] = useState(() => {
    // Load role from localStorage or default to 'student'
    const savedRole = localStorage.getItem('userRole')
    return savedRole || 'student'
  })
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  // Persist role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userRole', role)
    console.log('Role changed to:', role) // Debug log
  }, [role])

  // Check authentication status
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
  }, [location.pathname])

  // Simulate initial load
  useEffect(() => {
    // Check for existing session/auth token here
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header role={role} setRole={setRole} setIsAuthenticated={setIsAuthenticated} />}
      <main className={isAuthenticated ? "p-4 max-w-7xl mx-auto" : ""}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setUserRole={setRole} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={role}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={role}>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={role}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin-only routes */}
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute allowedRoles={['admin']} userRole={role} isAuthenticated={isAuthenticated}>
                <AdminStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-student" 
            element={
              <ProtectedRoute allowedRoles={['admin']} userRole={role} isAuthenticated={isAuthenticated}>
                <AddStudent />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}


