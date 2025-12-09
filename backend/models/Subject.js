const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: [true, "Subject code is required"],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [2, "Subject code must be at least 2 characters"],
    maxlength: [20, "Subject code cannot exceed 20 characters"]
  },
  subjectName: {
    type: String,
    required: [true, "Subject name is required"],
    trim: true,
    minlength: [3, "Subject name must be at least 3 characters"],
    maxlength: [150, "Subject name cannot exceed 150 characters"]
  },
  credits: {
    type: Number,
    min: [0, "Credits cannot be negative"],
    max: [10, "Credits cannot exceed 10"],
    default: 3
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecturer",
    required: [true, "Lecturer is required"]
  },
  faculty: {
    type: String,
    trim: true,
    maxlength: [100, "Faculty cannot exceed 100 characters"]
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, "Department cannot exceed 100 characters"]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
subjectSchema.index({ subjectCode: 1 });
subjectSchema.index({ subjectName: 1 });
subjectSchema.index({ lecturerId: 1 });
subjectSchema.index({ faculty: 1, department: 1 });
subjectSchema.index({ isActive: 1 });

// Virtual field for full subject info
subjectSchema.virtual("fullInfo").get(function() {
  return `${this.subjectCode} - ${this.subjectName} (${this.credits} credits)`;
});

// Pre-save middleware to ensure subject code is uppercase
subjectSchema.pre("save", function(next) {
  if (this.subjectCode) {
    this.subjectCode = this.subjectCode.toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Subject", subjectSchema);
