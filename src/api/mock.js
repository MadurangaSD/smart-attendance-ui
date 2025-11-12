/**
 * Simple mock API using localStorage + simulated latency.
 * Replace calls in services with your real endpoints.
 */
const LS_KEYS = {
  STUDENTS: 'sa_students_v1',
  ATTENDANCE: 'sa_attendance_v1'
}
const randDelay = (min=300,max=900) => new Promise(r=>setTimeout(r, min + Math.random()*(max-min)))

const defaultStudents = [
  { id: 's1', name: 'Alice Johnson', studentId: '2023001', class: 'CS101', photo: '/public/avatar-1.png' },
  { id: 's2', name: 'Bob Perera', studentId: '2023002', class: 'CS101', photo: '/public/avatar-1.png' },
]

function read(key, fallback){ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback }
function writeLS(key, val){ localStorage.setItem(key, JSON.stringify(val)) }

export async function getStudents(){
  await randDelay()
  const s = read(LS_KEYS.STUDENTS, defaultStudents)
  // ensure persisted
  writeLS(LS_KEYS.STUDENTS, s)
  return s
}
export async function createStudent(student){
  await randDelay()
  const s = read(LS_KEYS.STUDENTS, defaultStudents)
  student.id = 's'+Date.now()
  s.push(student)
  writeLS(LS_KEYS.STUDENTS, s)
  return student
}
export async function updateStudent(id, payload){
  await randDelay()
  const s = read(LS_KEYS.STUDENTS, defaultStudents).map(st=> st.id===id ? {...st, ...payload} : st)
  writeLS(LS_KEYS.STUDENTS, s)
  return s.find(x=>x.id===id)
}
export async function deleteStudent(id){
  await randDelay()
  const s = read(LS_KEYS.STUDENTS, defaultStudents).filter(st=> st.id!==id)
  writeLS(LS_KEYS.STUDENTS, s)
  return true
}

export async function getAttendance({date}){ // date: 'YYYY-MM-DD'
  await randDelay()
  const all = read(LS_KEYS.ATTENDANCE, [])
  if(!date) return all
  return all.filter(a=> a.date === date)
}
export async function recordAttendance(entry){
  await randDelay()
  const all = read(LS_KEYS.ATTENDANCE, [])
  entry.id = 'a'+Date.now()
  all.push(entry)
  writeLS(LS_KEYS.ATTENDANCE, all)
  return entry
}

/**
 * Simulated recognition endpoint:
 * Accepts image Blob (but here we use thumbnail base64 or any marker) and returns matched student or not.
 * Returns { matched: true, studentId, name, confidence } or { matched: false }
 */
export async function recognizeImage(imageDataURL){
  await randDelay(400,1200)
  const students = read(LS_KEYS.STUDENTS, defaultStudents)
  // simple deterministic fake matching: pick random student sometimes
  if(Math.random() > 0.45){
    const s = students[Math.floor(Math.random()*students.length)]
    return { matched: true, studentId: s.id, name: s.name, confidence: +(0.6 + Math.random()*0.35).toFixed(2) }
  } else {
    return { matched: false, confidence: +(0.2 + Math.random()*0.35).toFixed(2) }
  }
}
