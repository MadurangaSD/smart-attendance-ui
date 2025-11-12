import React, { useRef, useState, useEffect } from 'react'
import { recognize, markAttendance, getAttendanceByDate, fetchStudents } from '../services/attendanceService'

export default function Attendance(){
  const videoRef = useRef()
  const canvasRef = useRef()
  const [stream, setStream] = useState(null)
  const [captured, setCaptured] = useState(null)
  const [message, setMessage] = useState('')
  const [confidence, setConfidence] = useState(0.75)
  const [todayRecords, setTodayRecords] = useState([])
  useEffect(()=>{ const d = new Date().toISOString().slice(0,10); getAttendanceByDate(d).then(setTodayRecords) },[])
  useEffect(()=>{ return ()=> { if(stream) stream.getTracks().forEach(t=>t.stop()) } },[stream])
  async function startCamera(){
    try{
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}})
      videoRef.current.srcObject = s
      await videoRef.current.play()
      setStream(s)
    }catch(e){ setMessage('Camera permission denied or not available') }
  }
  function stopCamera(){ if(stream) stream.getTracks().forEach(t=>t.stop()); setStream(null) }
  function capture(){
    const v = videoRef.current
    const c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    const ctx = c.getContext('2d')
    ctx.drawImage(v,0,0,c.width,c.height)
    const data = c.toDataURL('image/png')
    setCaptured(data)
  }
  async function simulateRecognition(){
    if(!captured) return setMessage('Capture first')
    setMessage('Recognizing...')
    const res = await recognize(captured) // mocked
    if(res.matched){
      setMessage(`Matched ${res.name} (confidence ${res.confidence})`)
      await markAttendance({studentId: res.studentId, name: res.name, confidence: res.confidence})
      const d = new Date().toISOString().slice(0,10); getAttendanceByDate(d).then(setTodayRecords)
    } else {
      setMessage('No match found — try again or add student')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Attendance (Face Capture)</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="mb-2">
            {!stream ? <button onClick={startCamera} className="px-3 py-1 bg-sky-600 text-white rounded">Start Camera</button>
            : <button onClick={stopCamera} className="px-3 py-1 bg-red-600 text-white rounded">Stop Camera</button>}
          </div>
          <video ref={videoRef} className="w-full rounded bg-black" />
          <div className="mt-2 flex space-x-2">
            <button onClick={capture} className="px-3 py-1 bg-sky-600 text-white rounded">Capture</button>
            <button onClick={simulateRecognition} className="px-3 py-1 border rounded">Simulate Recognize</button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          {captured && <img alt="captured" src={captured} className="mt-2 border rounded max-h-48" />}
          <div className="mt-2">
            <label className="block text-sm">Confidence threshold: {confidence}</label>
            <input type="range" min="0" max="1" step="0.01" value={confidence} onChange={e=>setConfidence(e.target.value)} />
          </div>
          {message && <div className="mt-2 text-sm text-gray-700">{message}</div>}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">Today's attendance</h4>
          <ul>
            {todayRecords.map(r=> <li key={r.id} className="border-b py-2">{r.time} — {r.name} ({r.studentId})</li>)}
            {!todayRecords.length && <li className="text-sm text-gray-500">No records yet</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
