// This is the module for all the students
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SubjectSchema = new mongoose.Schema({
  subject: { type: String },
  date: { type: String },
  presence: { type: String },
});

const attendanceSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
  isSelf: { type: Boolean, default: true },
  Attendance: [SubjectSchema],
  TotalClasses: {
    type: Number,
    required: [true, "SemesterTotal Missing"],
  },
  Present: {
    type: Number,
    required: [true, "SemesterTotal Missing"],
  },
  semester: { type: Number, required: [true, "Semester Missing"] },
});

module.exports = mongoose.model("attendance", attendanceSchema);
