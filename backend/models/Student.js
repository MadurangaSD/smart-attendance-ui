const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [3, "Student ID must be at least 3 characters"],
    maxlength: [20, "Student ID cannot exceed 20 characters"]
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  faculty: {
    type: String,
    required: [true, "Faculty is required"],
    trim: true,
    minlength: [2, "Faculty must be at least 2 characters"],
    maxlength: [100, "Faculty cannot exceed 100 characters"]
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true,
    minlength: [2, "Department must be at least 2 characters"],
    maxlength: [100, "Department cannot exceed 100 characters"]
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: [1, "Year must be at least 1"],
    max: [10, "Year cannot exceed 10"]
  },
  semester: {
    type: Number,
    required: [true, "Semester is required"],
    min: [1, "Semester must be at least 1"],
    max: [8, "Semester cannot exceed 8"]
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ faculty: 1, department: 1 });

// Virtual field for full student info
studentSchema.virtual("fullInfo").get(function() {
  return `${this.studentId} - ${this.name} (${this.faculty}, Year ${this.year})`;
});

module.exports = mongoose.model("Student", studentSchema);
