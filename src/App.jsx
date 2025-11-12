import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Reports from './pages/Reports'
import AdminStudents from './pages/AdminStudents'

export default function App(){
  const [role, setRole] = useState('admin') // 'admin' or 'instructor'
  return (
    <div className="min-h-screen">
      <Header role={role} setRole={setRole} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin/students" element={<AdminStudents />} />
        </Routes>
      </main>
    </div>
  )
}
