import { useState } from "react";
import { addStudent } from "../api/studentApi";

function AddStudent() {
  const [data, setData] = useState({
    studentId: "",
    name: "",
    faculty: "",
    department: "",
    year: "",
    semester: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!data.studentId.trim()) return "Student ID is required";
    if (!data.name.trim()) return "Name is required";
    if (!data.faculty.trim()) return "Faculty is required";
    if (!data.department.trim()) return "Department is required";
    if (!data.year.trim()) return "Year is required";
    if (!data.semester.trim()) return "Semester is required";
    return null;
  };

  const resetForm = () => {
    setData({
      studentId: "",
      name: "",
      faculty: "",
      department: "",
      year: "",
      semester: ""
    });
  };

  const submit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await addStudent(data);
      // `addStudent` returns response.data (could be a message or object)
      const message = typeof res === 'string' ? res : (res?.message || '✅ Student Added Successfully');
      setSuccess(message);
      resetForm();
    } catch (error) {
      console.error('AddStudent error:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data || error.message || 'Backend connection error';
      setError(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Student</h2>

      {error && <div className="bg-red-100 p-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 p-3 rounded">{success}</div>}

      <div className="space-y-4 mt-4">
        {["studentId", "name", "faculty", "department", "year", "semester"].map(
          (field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={data[field]}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 border rounded"
            />
          )
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded"
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </div>
  );
}

export default AddStudent;
