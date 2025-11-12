import React, { useEffect, useState } from 'react'
import { getAttendanceByDate, fetchStudents } from '../services/attendanceService'
import Table from '../components/Table'

function exportCSV(rows=[]){
  const headers = ['id','studentId','name','date','time','confidence']
  const csv = [headers.join(',')].concat(rows.map(r=> headers.map(h=> JSON.stringify(r[h]||'')).join(','))).join('\n')
  const blob = new Blob([csv], {type:'text/csv'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download='attendance.csv'; a.click(); URL.revokeObjectURL(url)
}

export default function Reports(){
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [rows, setRows] = useState([])
  useEffect(()=>{ getAttendanceByDate(date).then(setRows) },[date])
  const columns = [
    { header:'Time', accessor:'time' },
    { header:'Student', accessor:'name' },
    { header:'Student ID', accessor:'studentId' },
    { header:'Confidence', accessor:'confidence' },
  ]
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Attendance Reports</h2>
      <div className="mb-4 flex items-center space-x-2">
        <label>Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-1 rounded" />
        <button onClick={()=>exportCSV(rows)} className="px-3 py-1 bg-sky-600 text-white rounded">Export CSV</button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <Table columns={columns} data={rows} />
      </div>
    </div>
  )
}
