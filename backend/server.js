require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const Student = require("./models/Student");
const Attendance = require("./models/Attendance");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend Running");
});

// ✅ Register User
app.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Email, password, and full name are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user (password will be hashed automatically by the model)
    const user = new User({
      email: email.toLowerCase(),
      password,
      fullName,
      role: role || "student"
    });

    await user.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    if (err.stack) console.error("Stack:", err.stack);
    
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: "Failed to register user", error: err.message });
  }
});

// ✅ Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive. Please contact administrator" });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: "✅ Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Failed to login" });
  }
});

// ✅ Get All Users (Admin only - for now without auth middleware)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Add Student API
app.post("/add-student", async (req, res) => {
  try {
    let { studentId, name, faculty, department, year, semester } = req.body;

    // Basic required fields check
    if (!studentId || !name || !faculty || !department || year === undefined || semester === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Coerce numeric fields (frontend may send strings)
    year = Number(year);
    semester = Number(semester);
    if (Number.isNaN(year) || Number.isNaN(semester)) {
      return res.status(400).json({ message: "Year and Semester must be numeric" });
    }

    // Normalize studentId
    studentId = String(studentId).trim().toUpperCase();

    // Check for duplicate student ID
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    const student = new Student({ studentId, name, faculty, department, year, semester });
    await student.save();
    res.status(201).json({ message: "✅ Student Added Successfully", student });
  } catch (err) {
    console.error("Error adding student:", err);
    // Duplicate key
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue || {})[0];
      return res.status(400).json({ message: `${key || 'Field'} already exists` });
    }
    // Mongoose validation
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).reduce((acc, k) => {
        acc[k] = err.errors[k].message;
        return acc;
      }, {});
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: "Failed to add student. Please try again." });
  }
});

// ✅ Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).send("Failed to fetch students");
  }
});

// ✅ Delete student
app.delete("/delete-student/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.send("✅ Student Deleted");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Failed to delete student");
  }
});

// ✅ Update student
app.put("/update-student/:id", async (req, res) => {
  try {
    let { studentId, name, faculty, department, year, semester } = req.body;

    // Basic required fields
    if (!studentId || !name || !faculty || !department || year === undefined || semester === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Coerce numeric fields
    year = Number(year);
    semester = Number(semester);
    if (Number.isNaN(year) || Number.isNaN(semester)) {
      return res.status(400).json({ message: "Year and Semester must be numeric" });
    }

    // Check if trying to update to an existing student ID (excluding current student)
    studentId = String(studentId).trim().toUpperCase();
    const existingStudent = await Student.findOne({
      studentId,
      _id: { $ne: req.params.id }
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, name, faculty, department, year, semester },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "✅ Student Updated Successfully", student: updated });
  } catch (err) {
    console.error("Error updating student:", err);
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue || {})[0];
      return res.status(400).json({ message: `${key || 'Field'} already exists` });
    }
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).reduce((acc, k) => {
        acc[k] = err.errors[k].message;
        return acc;
      }, {});
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: "Failed to update student" });
  }
});

// ✅ Mark Attendance API
app.post("/mark-attendance", async (req, res) => {
  try {
    const { studentId, name, date, time, confidence, timestamp } = req.body;

    if (!studentId || !date) {
      return res.status(400).json({ message: "Student ID and Date are required" });
    }

    // Check if attendance already marked for today
    const existing = await Attendance.findOne({ studentId, date });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this date" });
    }

    const attendance = new Attendance({
      studentId,
      name,
      date,
      time,
      confidence,
      timestamp: timestamp || new Date(),
      status: "present"
    });

    await attendance.save();
    res.status(201).json({ message: "✅ Attendance Marked Successfully", attendance });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
});

// ✅ Get Attendance by Date
app.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = {};
    if (date) {
      query.date = date;
    }

    const attendance = await Attendance.find(query).sort({ timestamp: -1 });
    res.json(attendance);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).send("Failed to fetch attendance");
  }
});

// ✅ Get Attendance Stats
app.get("/attendance/stats", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate) query.date = { $gte: startDate };
    if (endDate) {
      query.date = query.date || {};
      query.date.$lte = endDate;
    }

    const attendanceRecords = await Attendance.find(query);
    const totalPresent = attendanceRecords.length;
    const totalStudents = await Student.countDocuments();
    const averageAttendance = totalStudents > 0 ? (totalPresent / totalStudents * 100).toFixed(2) : 0;

    res.json({
      totalPresent,
      totalStudents,
      averageAttendance: parseFloat(averageAttendance),
      records: attendanceRecords
    });
  } catch (err) {
    console.error("Error fetching attendance stats:", err);
    res.status(500).json({ message: "Failed to fetch attendance stats" });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server only after DB connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server Running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
