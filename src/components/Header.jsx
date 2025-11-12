import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header({ role, setRole }){
  const loc = useLocation()
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">Smart Attendance</Link>
          <nav className="hidden md:flex space-x-2">
            <Link className={loc.pathname==='/dashboard'? 'text-blue-600':'text-gray-600'} to="/dashboard">Dashboard</Link>
            <Link className={loc.pathname==='/attendance'? 'text-blue-600':'text-gray-600'} to="/attendance">Attendance</Link>
            <Link className={loc.pathname==='/reports'? 'text-blue-600':'text-gray-600'} to="/reports">Reports</Link>
            <Link className={loc.pathname==='/admin/students'? 'text-blue-600':'text-gray-600'} to="/admin/students">Admin</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm">Role:</span>
            <select value={role} onChange={e=>setRole(e.target.value)} className="border rounded p-1">
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          <Link to="/"><button className="px-3 py-1 bg-sky-600 text-white rounded">Demo Login</button></Link>
        </div>
      </div>
    </header>
  )
}
