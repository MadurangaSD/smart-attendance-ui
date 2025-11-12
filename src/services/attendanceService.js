import * as api from '../api/mock'

export async function fetchStudents(){ return api.getStudents() }
export async function addStudent(student){ return api.createStudent(student) }
export async function editStudent(id, payload){ return api.updateStudent(id, payload) }
export async function removeStudent(id){ return api.deleteStudent(id) }

export async function recognize(imageBlobOrDataURL){
  // Replace this with actual fetch to Flask+OpenCV
  // Example:
  // const form = new FormData(); form.append('image', imageBlob, 'cap.png');
  // const res = await fetch('http://localhost:5000/recognize', { method: 'POST', body: form })
  // return res.json()
  return api.recognizeImage(imageBlobOrDataURL)
}

export async function getAttendanceByDate(date){
  return api.getAttendance({date})
}

export async function markAttendance({studentId, name, confidence}){
  const d = new Date()
  const date = d.toISOString().slice(0,10)
  const time = d.toLocaleTimeString()
  return api.recordAttendance({studentId, name, confidence, date, time})
}
