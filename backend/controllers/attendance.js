/**
 Writing Tasks
 * Provide Each Day Attendance (For: Teacher and Student)
    => also update Other Pre Computed Values
 */
const Attendance = require("../models/attendance");
const expressAsyncHandler = require("express-async-handler");

const addSubject = expressAsyncHandler(async (req, res) => {
  const { student_id, subject } = req.body;
  if (typeof subject !== "string")
    throw new Error("Subject Name Should be string");
  let updatedAttendance = await Attendance.findOneAndUpdate(
    { student_id, isSelf: false },
    // { Attendance: [] },
    {
      $push: {
        Attendance: { [subject]: [] },
      },
    },
    { new: true }
  );
  updatedAttendance = updatedAttendance.Attendance;

  res.status(200).json({ attendanceList: updatedAttendance });
  return;
});

const removeSubject = expressAsyncHandler(async (req, res) => {
  const { student_id, subject } = req.body;
  let removeSubject = await Attendance.findOneAndUpdate(
    { student_id, isSelf: false },
    {
      $pull: {
        Attendance: { [subject]: [] },
      },
    },
    { new: true }
  );
  removeSubject = removeSubject.Attendance;
  res.status(200).json({ attendanceList: removeSubject });
});

const WriteStudentAttendance = expressAsyncHandler(async (req, res) => {
  const { date, data } = req.body;
  data.forEach(async (element) => {
    const filter = { student_id: element.student_id, isSelf: false };
    const update = {
      $set: {
        Attendance: {
          subject: element.subject,
          date: date,
          presence: element.attendance,
        },
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    await Attendance.findOneAndUpdate(filter, update, options);
  });

  res.status(200).json({ message: "SUCCESSFUL" });
});

/**
 All Data Semester wise segregated
 * Net Total Attendance
 * SubjectWise
    => Total Attendance
    => Monthly Attendance
    => Daily Attendance
 */

module.exports = { WriteStudentAttendance, addSubject, removeSubject };
