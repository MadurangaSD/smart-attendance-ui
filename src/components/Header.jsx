import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Header({ role, setRole, setIsAuthenticated }) {
  const loc = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/reports', label: 'Reports' },
    { to: '/admin/students', label: 'Admin' },
  ]

  function isActive(path) {
    return loc.pathname === path
  }

  const handleRoleChange = (e) => {
    const newRole = e.target.value
    console.log('Setting role to:', newRole)
    setRole(newRole)
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear()
      setIsAuthenticated(false)
      navigate('/login')
    }
  }

  return (
    <>
      <header className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'} shadow-sm sticky top-0 z-20 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`max-w-6xl mx-auto flex items-center justify-between p-3 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="flex items-center space-x-4">
            <Link to="/" className={`text-xl font-bold ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-sky-700 hover:text-sky-900'} transition-colors`}>Smart Attendance</Link>
            <nav className="hidden md:flex space-x-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    (isActive(link.to)
                      ? isDark ? 'text-blue-400 font-bold underline underline-offset-4' : 'text-blue-600 font-bold underline underline-offset-4'
                      : isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600') +
                    ' px-2 py-1 rounded transition-colors'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`px-3 py-1 rounded transition-colors ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <label className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : ''}`}>
              <span className="text-sm font-semibold">Role:</span>
              <select
                value={role}
                onChange={handleRoleChange}
                className={`border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-yellow-50'}`}
                aria-label="Select role"
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>({role})</span>
            </label>
            <button
              onClick={handleLogout}
              className={`px-3 py-1 rounded transition-colors text-sm ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              Logout
            </button>
            <Link to="/">
              <button className={`px-3 py-1 rounded transition-colors ${isDark ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-sky-600 text-white hover:bg-sky-700'}`}>
                Demo Login
              </button>
            </Link>
            {/* Mobile menu button */}
            <button
              className={`md:hidden px-2 py-1 rounded ${isDark ? 'text-blue-400 border-blue-400 hover:bg-gray-800' : 'text-sky-600 border-sky-600 hover:bg-sky-50'} border transition-colors`}
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen(m => !m)}
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </header>
      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col p-3 space-y-2">
            {navLinks.map(link => {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    (isActive(link.to)
                      ? 'text-blue-600 font-bold underline underline-offset-4'
                      : 'text-gray-600 hover:text-blue-600') +
                    ' px-2 py-2 rounded transition-colors'
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
