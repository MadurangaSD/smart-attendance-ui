import React, { useEffect, useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { fetchStudents, getAttendanceByDate } from '../services/attendanceService'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export default function Dashboard(){
  const [students, setStudents] = useState([])
  const [todayAttendance, setTodayAttendance] = useState([])
  useEffect(()=>{ fetchStudents().then(setStudents); const d = new Date().toISOString().slice(0,10); getAttendanceByDate(d).then(setTodayAttendance) },[])
  const total = students.length
  const present = todayAttendance.length
  const absent = Math.max(0, total - present)
  // sample line chart data (last 7 days)
  const labels = Array.from({length:7}).map((_,i)=> {
    const d = new Date(); d.setDate(d.getDate()- (6-i)); return d.toISOString().slice(0,10)
  })
  const lineData = {
    labels,
    datasets:[{label:'Present', data: labels.map(()=> Math.floor(Math.random()*total)), fill:false, tension:0.3}]
  }
  const doughnutData = { labels:['Present','Absent'], datasets:[{data:[present, absent]}] }
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3>Total students</h3><p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3>Attendance today</h3><p className="text-2xl font-bold">{present}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3>Present rate</h3><p className="text-2xl font-bold">{ total? Math.round((present/total)*100)+'%':'-'}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">Attendance (last 7 days)</h4>
          <Line data={lineData} />
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">Today status</h4>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  )
}
