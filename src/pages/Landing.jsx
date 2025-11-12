import React from 'react'
import { Link } from 'react-router-dom'
export default function Landing(){
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-2">Smart Attendance System (Demo)</h1>
      <p className="mb-4">Frontend-only demo with mocked recognition and localStorage persistence.</p>
      <div className="space-x-2">
        <Link to="/dashboard"><button className="px-4 py-2 bg-sky-600 text-white rounded">Go to Dashboard</button></Link>
        <Link to="/attendance"><button className="px-4 py-2 border rounded">Start Attendance</button></Link>
      </div>
    </div>
  )
}
