/**
 Writing Tasks
 * Provide Each Day Attendance (For: Teacher and Student)
    => also update Other Pre Computed Values
 */
const Attendance = require("../models/attendance");
const expressAsyncHandler = require("express-async-handler");

const WriteStudentAttendance = expressAsyncHandler(async (req, res) => {
  const { date, data } = req.body;
  const d = new Date(date);
  if (isNaN(d.getFullYear())) {
    throw new Error("Invalid Date");
  }
  data.forEach(async (element) => {
    const filter = {
      student_id: element.student_id,
      isSelf: false,
      Subject: element.subject,
      date: new Date(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`),
    };
    const update = { $set: { Status: element.attendance } };
    const options = { upsert: true, new: true };
    // console.log(filter, update, options);
    const a = await Attendance.updateOne(filter, update, options);
    console.log(a);
  });

  res.status(200).json({ message: "Update Successful" });
});

/**
 All Data Semester wise segregated
 * Net Total Attendance
 * SubjectWise
    => Total Attendance
    => Monthly Attendance
    => Daily Attendance
 */

const officialAttendance = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const attendance = await Attendance.find({ student_id: _id, isSelf: false });

  res.status(200).json({ attendance });
});

module.exports = { WriteStudentAttendance, officialAttendance };
