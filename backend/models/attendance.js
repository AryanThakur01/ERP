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
  isSelf: {
    type: Boolean,
    default: true,
    required: [true, "Teacher or student?"],
  },
  Subject: { type: String, required: [true, "SubjectName Missing"] },
  Status: {
    type: String,
    enum: ["P", "A", "L"],
    required: [true, "Status Missing"],
  },
  date: {
    type: String,
    required: [true, "Date Missing"],
  },
});

module.exports = mongoose.model("attendance", attendanceSchema);
