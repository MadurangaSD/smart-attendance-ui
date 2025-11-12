import React, { useEffect, useState } from 'react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { fetchStudents, addStudent, editStudent, removeStudent } from '../services/attendanceService'

export default function AdminStudents(){
  const [students, setStudents] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({name:'', studentId:'', class:'', photo:''})
  const [editing, setEditing] = useState(null)
  useEffect(()=>{ fetchStudents().then(setStudents) },[])
  async function save(){
    if(editing){ await editStudent(editing.id, form) }
    else { await addStudent(form) }
    setOpen(false); setForm({name:'', studentId:'', class:'', photo:''}); setEditing(null)
    fetchStudents().then(setStudents)
  }
  function onUpload(e){
    const f = e.target.files[0]; if(!f) return
    const reader = new FileReader()
    reader.onload = () => setForm(prev=> ({...prev, photo: reader.result}))
    reader.readAsDataURL(f)
  }
  function startEdit(s){ setEditing(s); setForm({name:s.name, studentId:s.studentId, class:s.class, photo:s.photo}); setOpen(true) }
  async function doDelete(id){ if(!confirm('Delete?')) return; await removeStudent(id); fetchStudents().then(setStudents) }

  const columns = [
    { header:'Photo', accessor:'photo', cell: r=> <img src={r.photo||'/public/avatar-1.png'} alt={r.name} className="w-12 h-12 rounded" /> },
    { header:'Name', accessor:'name' }, { header:'Student ID', accessor:'studentId' }, { header:'Class', accessor:'class' },
    { header:'Actions', accessor:'actions', cell: r=> (<div className="space-x-2"><button onClick={()=>startEdit(r)} className="px-2 py-1 border rounded">Edit</button><button onClick={()=>doDelete(r.id)} className="px-2 py-1 border rounded">Delete</button></div>) }
  ]
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold">Students (Admin)</h2>
      <div className="my-2">
        <button onClick={()=>setOpen(true)} className="px-3 py-1 bg-sky-600 text-white rounded">Add Student</button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <Table columns={columns} data={students} />
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title={editing? 'Edit Student' : 'Add Student'}>
        <div className="space-y-2">
          <label className="block">Name<input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="border p-1 w-full" /></label>
          <label className="block">Student ID<input value={form.studentId} onChange={e=>setForm({...form, studentId:e.target.value})} className="border p-1 w-full" /></label>
          <label className="block">Class<input value={form.class} onChange={e=>setForm({...form, class:e.target.value})} className="border p-1 w-full" /></label>
          <label className="block">Photo<input type="file" accept="image/*" onChange={onUpload} className="w-full" /></label>
          {form.photo && <img src={form.photo} alt="preview" className="w-24 h-24 rounded" />}
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={()=>setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={save} className="px-3 py-1 bg-sky-600 text-white rounded">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
