import { useEffect, useState } from "react";
import { getStudents, deleteStudent, addStudent } from "../api/studentApi";
import { useTheme } from "../context/ThemeContext";

function AdminStudents() {
  const { isDark } = useTheme()
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    faculty: "",
    department: "",
    year: "",
    semester: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudents();
      // getStudents() returns data directly (response.data)
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadStudents error:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");
      await deleteStudent(id);
      setSuccess("Student deleted successfully");
      await loadStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("deleteStudent error:", err);
      setError("Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentId.trim()) {
      setError("Student ID is required");
      return;
    }
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.faculty.trim()) {
      setError("Faculty is required");
      return;
    }
    if (!formData.department.trim()) {
      setError("Department is required");
      return;
    }
    if (!formData.year) {
      setError("Year is required");
      return;
    }
    if (!formData.semester) {
      setError("Semester is required");
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      setSuccess("");
      
      await addStudent({
        ...formData,
        year: parseInt(formData.year),
        semester: parseInt(formData.semester)
      });
      
      setSuccess("Student added successfully!");
      setFormData({
        studentId: "",
        name: "",
        faculty: "",
        department: "",
        year: "",
        semester: ""
      });
      setShowAddForm(false);
      await loadStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Add student error:", err);
      setError(err.message || "Failed to add student");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (loading) return <h2 className={`text-center mt-6 ${isDark ? 'text-gray-300' : ''}`}>Loading...</h2>;

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900 min-h-screen' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : ''}`}>All Students</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`text-white px-4 py-2 rounded transition-colors ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {showAddForm ? "Cancel" : "+ Add Student"}
        </button>
      </div>

      {error && <div className={`mb-4 p-3 rounded ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>{error}</div>}
      {success && <div className={`mb-4 p-3 rounded ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>{success}</div>}

      {showAddForm && (
        <div className={`mb-6 p-6 border rounded-lg shadow-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : ''}`}>Add New Student</h3>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : ''}`}>Student ID *</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleFormChange}
                placeholder="e.g., S001, REG001"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                disabled={formLoading}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : ''}`}>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., John Doe"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                disabled={formLoading}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : ''}`}>Faculty *</label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleFormChange}
                placeholder="e.g., Engineering"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                disabled={formLoading}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : ''}`}>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                placeholder="e.g., Computer Science"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                disabled={formLoading}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : ''}`}>Year *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                disabled={formLoading}
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : ''}`}>Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleFormChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                disabled={formLoading}
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={formLoading}
                className={`w-full text-white py-2 rounded transition-colors ${isDark ? 'bg-green-700 hover:bg-green-600 disabled:bg-gray-600' : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'}`}
              >
                {formLoading ? "Adding..." : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      {students.length === 0 ? (
        <div className={`text-center p-8 rounded ${isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-500'}`}>
          No students found. <button onClick={() => setShowAddForm(true)} className={`hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Add one now</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full border ${isDark ? 'border-gray-700' : ''}`}>
            <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <tr>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Student ID</th>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Name</th>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Faculty</th>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Department</th>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Year</th>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Semester</th>
                <th className={`p-3 border ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id} className={`${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50'} border`}>
                  <td className={`border p-2 ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>{s.studentId}</td>
                  <td className={`border p-2 ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>{s.name}</td>
                  <td className={`border p-2 ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>{s.faculty}</td>
                  <td className={`border p-2 ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>{s.department}</td>
                  <td className={`border p-2 ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>{s.year}</td>
                  <td className={`border p-2 ${isDark ? 'border-gray-700 text-gray-300' : ''}`}>{s.semester}</td>
                  <td className={`border p-2 ${isDark ? 'border-gray-700' : ''}`}>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className={`text-white px-3 py-1 rounded transition-colors ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === s._id}
                    >
                      {deletingId === s._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;
