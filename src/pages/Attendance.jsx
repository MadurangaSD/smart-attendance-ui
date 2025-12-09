import React, { useRef, useState, useEffect } from 'react'
import { recognize, markAttendance, getAttendanceByDate, fetchStudents } from '../services/attendanceService'
import { useTheme } from '../context/ThemeContext'

export default function Attendance() {
  const { isDark } = useTheme()
  const videoRef = useRef()
  const canvasRef = useRef()
  const [stream, setStream] = useState(null)
  const [captured, setCaptured] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confidence, setConfidence] = useState(0.6)
  const [todayRecords, setTodayRecords] = useState([])
  const [isRecognizing, setIsRecognizing] = useState(false)

  // Load today's attendance on mount
  useEffect(() => {
    loadTodayRecords()
  }, [])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [stream])

  async function loadTodayRecords() {
    try {
      const date = new Date().toISOString().slice(0, 10)
      const records = await getAttendanceByDate(date)
      setTodayRecords(records || [])
    } catch (err) {
      console.error('Error loading attendance:', err)
      setError('Failed to load attendance records')
    }
  }

  async function startCamera() {
    try {
      setLoading(true)
      setError('')
      setMessage('')
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      videoRef.current.srcObject = mediaStream
      await videoRef.current.play()
      setStream(mediaStream)
      setMessage('Camera started successfully')
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera permission denied or not available. Please check your browser settings.')
    } finally {
      setLoading(false)
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setMessage('Camera stopped')
    }
  }

  function capture() {
    try {
      setError('')
      
      const video = videoRef.current
      const canvas = canvasRef.current

      if (!video || !stream) {
        setError('Please start the camera first')
        return
      }

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        setError('Video not ready. Please wait a moment.')
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const imageData = canvas.toDataURL('image/png')
      setCaptured(imageData)
      setMessage('Image captured successfully')
    } catch (err) {
      console.error('Capture error:', err)
      setError('Failed to capture image')
    }
  }

  function clearCapture() {
    setCaptured(null)
    setMessage('')
    setError('')
  }

  async function simulateRecognition() {
    if (!captured) {
      setError('Please capture an image first')
      return
    }

    try {
      setIsRecognizing(true)
      setError('')
      setMessage('Processing face...')

      const result = await recognize(captured)

      if (result.matched && result.confidence >= confidence) {
        setMessage(`✅ Matched: ${result.name} (${(result.confidence * 100).toFixed(1)}% confidence)`)
        
        await markAttendance({
          studentId: result.studentId,
          name: result.name,
          confidence: result.confidence
        })

        // Reload today's records
        await loadTodayRecords()
        
        // Clear capture after successful recognition
        setTimeout(() => {
          clearCapture()
        }, 2000)
      } else if (result.matched && result.confidence < confidence) {
        setError(`Match found but confidence too low: ${(result.confidence * 100).toFixed(1)}% (threshold: ${(confidence * 100).toFixed(0)}%)`)
      } else {
        setError('❌ No match found. Please try again or register as a new student.')
      }
    } catch (err) {
      console.error('Recognition error:', err)
      setError(`Recognition failed: ${err.message || 'Please try again.'}`)
    } finally {
      setIsRecognizing(false)
    }
  }

  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${isDark ? 'bg-gray-900 min-h-screen' : ''}`}>
      <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Attendance System</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Capture your face to mark attendance</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className={`p-6 rounded-lg shadow-md space-y-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Face Capture</h3>

          {/* Error Message */}
          {error && (
            <div className={`p-3 border rounded ${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && !error && (
            <div className={`p-3 border rounded ${isDark ? 'bg-blue-900 border-blue-700 text-blue-200' : 'bg-blue-100 border-blue-400 text-blue-700'}`}>
              {message}
            </div>
          )}

          {/* Camera Controls */}
          <div className="flex gap-2">
            {!stream ? (
              <button
                onClick={startCamera}
                disabled={loading}
                className={`px-4 py-2 rounded transition-colors ${isDark ? 'bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'} text-white`}
              >
                {loading ? 'Starting...' : 'Start Camera'}
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className={`px-4 py-2 rounded transition-colors text-white ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Stop Camera
              </button>
            )}
          </div>

          {/* Video Feed */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Camera not started</p>
              </div>
            )}
          </div>

          {/* Capture Controls */}
          <div className="flex gap-2">
            <button
              onClick={capture}
              disabled={!stream || loading}
              className={`px-4 py-2 rounded transition-colors text-white ${isDark ? 'bg-green-700 hover:bg-green-600 disabled:bg-gray-600' : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'}`}
            >
              📸 Capture Photo
            </button>
            {captured && (
              <button
                onClick={clearCapture}
                className={`px-4 py-2 rounded transition-colors text-white ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                Clear
              </button>
            )}
          </div>

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Captured Image */}
          {captured && (
            <div className="space-y-2">
              <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Captured Image:</h4>
              <img
                src={captured}
                alt="Captured face"
                className={`w-full border-2 rounded-lg max-h-64 object-contain ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
              />
              <button
                onClick={simulateRecognition}
                disabled={isRecognizing}
                className={`w-full px-4 py-2 rounded transition-colors text-white ${isDark ? 'bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600' : 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400'}`}
              >
                {isRecognizing ? 'Recognizing...' : '🔍 Recognize & Mark Attendance'}
              </button>
            </div>
          )}

          {/* Confidence Threshold */}
          <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : ''}`}>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Confidence Threshold: {(confidence * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={confidence}
              onChange={e => setConfidence(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Higher values require better matches
            </p>
          </div>
        </div>

        {/* Today's Attendance Section */}
        <div className={`p-6 rounded-lg shadow-md space-y-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Today's Attendance</h3>
            <button
              onClick={loadTodayRecords}
              className={`px-3 py-1 text-sm rounded transition-colors ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              🔄 Refresh
            </button>
          </div>

          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          {todayRecords.length === 0 ? (
            <div className="text-center py-12">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No attendance records yet today</p>
            </div>
          ) : (
            <div className={`space-y-2 max-h-[600px] overflow-y-auto`}>
              {todayRecords.map((record, idx) => (
                <div
                  key={record.id || idx}
                  className={`border rounded-lg p-3 transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{record.name}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ID: {record.studentId}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{record.time}</p>
                      {record.confidence && (
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {(record.confidence * 100).toFixed(1)}% match
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {todayRecords.length > 0 && (
            <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : ''}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total: <span className="font-semibold">{todayRecords.length}</span> student(s) present
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
