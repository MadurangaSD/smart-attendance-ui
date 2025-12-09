const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  date: {
    type: String,
    required: [true, "Date is required"]
  },
  time: {
    type: String
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "present"
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ studentId: 1, date: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ timestamp: -1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
