import React, { useEffect, useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { fetchStudents, getAttendanceByDate } from '../services/attendanceService'
import { useTheme } from '../context/ThemeContext'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const { isDark } = useTheme()
  const [students, setStudents] = useState([])
  const [todayAttendance, setTodayAttendance] = useState([])
  const [weekData, setWeekData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      setError('')

      // Fetch students
      const studentsData = await fetchStudents()
      setStudents(studentsData || [])

      // Fetch today's attendance
      const today = new Date().toISOString().slice(0, 10)
      const todayData = await getAttendanceByDate(today)
      setTodayAttendance(todayData || [])

      // Fetch last 7 days attendance
      const weekDataPromises = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().slice(0, 10)
        weekDataPromises.push(
          getAttendanceByDate(dateStr).then(data => ({
            date: dateStr,
            count: data?.length || 0
          }))
        )
      }

      const weekResults = await Promise.all(weekDataPromises)
      setWeekData(weekResults)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const total = students.length
  const present = todayAttendance.length
  const absent = Math.max(0, total - present)
  const presentRate = total ? Math.round((present / total) * 100) : 0

  // Format date for display
  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Line chart data (last 7 days)
  const lineData = {
    labels: weekData.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Students Present',
        data: weekData.map(d => d.count),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  // Doughnut chart data
  const doughnutData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(239, 68, 68, 0.8)'   // Red
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${isDark ? 'bg-gray-900' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${isDark ? 'bg-gray-900 min-h-screen' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Dashboard</h2>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`p-4 border rounded-lg ${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Total Students</h3>
          <p className="text-4xl font-bold mt-2">{total}</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Present Today</h3>
          <p className="text-4xl font-bold mt-2">{present}</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Absent Today</h3>
          <p className="text-4xl font-bold mt-2">{absent}</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Attendance Rate</h3>
          <p className="text-4xl font-bold mt-2">{presentRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h4 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Attendance Trend (Last 7 Days)
          </h4>
          {weekData.length > 0 ? (
            <div className="h-64">
              <Line data={lineData} options={lineOptions} />
            </div>
          ) : (
            <div className={`h-64 flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No data available
            </div>
          )}
        </div>

        {/* Doughnut Chart */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h4 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Today's Status
          </h4>
          {total > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          ) : (
            <div className={`h-64 flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No students registered
            </div>
          )}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h4 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Recent Attendance Today
        </h4>
        {todayAttendance.length === 0 ? (
          <div className="text-center py-8">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No attendance records yet today</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                  <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Time</th>
                  <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Student Name</th>
                  <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Student ID</th>
                  <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.slice(0, 10).map((record, idx) => (
                  <tr key={record.id || idx} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <td className={`p-3 text-sm ${isDark ? 'text-gray-300' : ''}`}>{record.time}</td>
                    <td className={`p-3 ${isDark ? 'text-gray-300' : ''}`}>{record.name}</td>
                    <td className={`p-3 font-mono text-sm ${isDark ? 'text-gray-300' : ''}`}>{record.studentId}</td>
                    <td className="p-3 text-sm">
                      {record.confidence ? 
                        <span className={`px-2 py-1 rounded ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                          {(record.confidence * 100).toFixed(1)}%
                        </span> 
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {todayAttendance.length > 10 && (
              <p className={`text-sm mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing 10 of {todayAttendance.length} records
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
