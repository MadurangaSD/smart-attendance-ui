import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Landing() {
  const { isDark } = useTheme()
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Smart Attendance System
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Automated facial recognition attendance tracking with real-time analytics and seamless management
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard">
              <button className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${isDark ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                📊 View Dashboard
              </button>
            </Link>
            <Link to="/attendance">
              <button className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg border-2 transition-all transform hover:scale-105 ${isDark ? 'bg-gray-800 text-blue-400 border-blue-400 hover:bg-gray-700' : 'bg-white text-blue-600 border-blue-600 hover:bg-gray-50'}`}>
                📸 Mark Attendance
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Facial Recognition
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Advanced AI-powered face detection and recognition for accurate and contactless attendance marking
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-5xl mb-4">📈</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Real-time Analytics
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Live dashboard with attendance trends, statistics, and comprehensive reports for better insights
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-5xl mb-4">⚡</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Easy Management
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Intuitive admin panel for managing students, generating reports, and tracking attendance history
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                1
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Register Student</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Add student details to the system</p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
                2
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Capture Face</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Student faces camera for capture</p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                3
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Recognition</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>System identifies the student</p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${isDark ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-600'}`}>
                4
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Mark Attendance</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Automatic attendance recording</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`rounded-2xl p-12 text-center mb-16 ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white`}>
          <h2 className="text-3xl font-bold mb-6">Why Choose Smart Attendance?</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <p className={`${isDark ? 'text-blue-200' : 'text-blue-100'}`}>Accuracy Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3sec</div>
              <p className={`${isDark ? 'text-blue-200' : 'text-blue-100'}`}>Average Time</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className={`${isDark ? 'text-blue-200' : 'text-blue-100'}`}>Contactless</p>
            </div>
          </div>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-blue-200' : 'text-blue-100'}`}>
            Save time, reduce errors, and improve accuracy with our automated attendance tracking system
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/admin/students" className="block">
            <div className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="text-4xl mr-4">👥</div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Student Management</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Add, edit, or remove students</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/reports" className="block">
            <div className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="text-4xl mr-4">📋</div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reports & Analytics</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>View detailed attendance reports</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className={`py-8 ${isDark ? 'bg-gray-950' : 'bg-gray-900'} text-white`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} Smart Attendance System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
