const mongoose = require("mongoose");

const lecturerSchema = new mongoose.Schema({
  lecturerId: String,
  name: String,
  department: String,
  email: String
});

module.exports = mongoose.model("Lecturer", lecturerSchema);
