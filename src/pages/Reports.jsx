import React, { useEffect, useState } from 'react'
import { getAttendanceByDate, fetchStudents } from '../services/attendanceService'
import { useTheme } from '../context/ThemeContext'
import Table from '../components/Table'

function exportCSV(rows = [], date) {
  if (rows.length === 0) {
    alert('⚠️ No data to export')
    return
  }

  try {
    const headers = ['Date', 'Time', 'Student ID', 'Student Name', 'Confidence']
    const csvRows = [
      headers.join(','),
      ...rows.map(r => [
        date,
        r.time || '',
        r.studentId || '',
        `"${r.name || ''}"`, // Wrap in quotes in case name has commas
        r.confidence ? `${(r.confidence * 100).toFixed(2)}%` : ''
      ].join(','))
    ]
    
    const csv = csvRows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `attendance_${date}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success message
    return true
  } catch (error) {
    console.error('Export error:', error)
    alert('❌ Failed to export CSV')
    return false
  }
}

export default function Reports() {
  const { isDark } = useTheme()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAttendance()
  }, [date])

  async function loadAttendance() {
    try {
      setLoading(true)
      setError('')
      const data = await getAttendanceByDate(date)
      setRows(data || [])
    } catch (err) {
      console.error('Error loading attendance:', err)
      setError('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  function handleExport() {
    const success = exportCSV(filteredRows, date)
    if (success) {
      setSuccess('✅ CSV exported successfully')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  function goToToday() {
    setDate(new Date().toISOString().slice(0, 10))
  }

  function previousDay() {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1)
    setDate(newDate.toISOString().slice(0, 10))
  }

  function nextDay() {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    const today = new Date().toISOString().slice(0, 10)
    if (newDate.toISOString().slice(0, 10) <= today) {
      setDate(newDate.toISOString().slice(0, 10))
    }
  }

  // Filter rows based on search term
  const filteredRows = rows.filter((row) =>
    row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const totalPresent = rows.length
  const avgConfidence = rows.length > 0
    ? (rows.reduce((sum, r) => sum + (r.confidence || 0), 0) / rows.length * 100).toFixed(1)
    : 0

  const columns = [
    { 
      header: 'Time', 
      accessor: 'time',
      cell: (row) => <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{row.time}</span>
    },
    { 
      header: 'Student Name', 
      accessor: 'name',
      cell: (row) => <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.name}</span>
    },
    { 
      header: 'Student ID', 
      accessor: 'studentId',
      cell: (row) => <span className={`font-mono text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.studentId}</span>
    },
    {
      header: 'Confidence',
      accessor: 'confidence',
      cell: (row) => row.confidence ? (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.confidence >= 0.9 ? isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800' :
          row.confidence >= 0.75 ? isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800' :
          isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {(row.confidence * 100).toFixed(1)}%
        </span>
      ) : '-'
    },
  ]

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${isDark ? 'bg-gray-900' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${isDark ? 'bg-gray-900 min-h-screen' : ''}`}>
      {/* Header */}
      <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Attendance Reports</h2>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>View and export attendance records</p>
          </div>
          <button
            onClick={handleExport}
            disabled={filteredRows.length === 0}
            className={`px-6 py-3 rounded-lg disabled:cursor-not-allowed transition-colors flex items-center gap-2 ${isDark ? 'bg-green-700 text-white hover:bg-green-600 disabled:bg-gray-600' : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'}`}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className={`p-4 border rounded-lg ${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`p-4 border rounded-lg ${isDark ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-100 border-green-400 text-green-700'}`}>
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium opacity-90">Total Present</h3>
          <p className="text-4xl font-bold mt-2">{totalPresent}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium opacity-90">Filtered Records</h3>
          <p className="text-4xl font-bold mt-2">{filteredRows.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium opacity-90">Avg. Confidence</h3>
          <p className="text-4xl font-bold mt-2">{avgConfidence}%</p>
        </div>
      </div>

      {/* Date Controls */}
      <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Date:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={previousDay}
                className={`px-3 py-2 rounded transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ←
              </button>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              />
              <button
                onClick={nextDay}
                disabled={date === new Date().toISOString().slice(0, 10)}
                className={`px-3 py-2 rounded transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'}`}
              >
                →
              </button>
            </div>
            <button
              onClick={goToToday}
              className={`px-4 py-2 rounded transition-colors text-sm text-white ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Today
            </button>
          </div>

          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'}`}
            />
          </div>
        </div>

        <p className={`text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Viewing attendance for: <span className="font-semibold">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </p>
      </div>

      {/* Table */}
      <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {rows.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No attendance records found for this date</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No records match your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table columns={columns} data={filteredRows} />
          </div>
        )}
      </div>
    </div>
  )
}
