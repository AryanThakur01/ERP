/**
 Writing Tasks
 * Provide Each Day Attendance (For: Teacher and Student)
    => also update Other Pre Computed Values
 */
const Attendance = require("../models/attendance");
const expressAsyncHandler = require("express-async-handler");

const addSubjects = expressAsyncHandler(async (req, res) => {
  const { student_id, subjects } = req.body;
  const addTo = await Attendance.findOneAndUpdate(
    { student_id, isSelf: false },
    // { $push: { Attendance: subjects } },
    { $push: { Attendance: subjects } },
    { new: true }
  );

  res.status(200).json({ addTo });
});

const WriteStudentAttendance = expressAsyncHandler(async (req, res) => {
  const { date, data } = req.body;
  let updatedData;
  data.forEach(async (element) => {
    let uploadAttendance = {};
    for (const key in element.Attendance) {
      uploadAttendance[key] = { [date]: element.Attendance[key] };
    }
    const query = {
      student_id: element._id,
      isSelf: element.isSelf,
      Attendance: {},
      semester: element.semester,
      TotalClasses: 0,
      Present: 0,
    };
    updatedData = await Attendance.findOneAndUpdate(
      { _id: element._id, isSelf: false },
      query,
      {
        new: true,
      }
    );
  });

  res.status(200).json({ updatedData });
});

/**
 All Data Semester wise segregated
 * Net Total Attendance
 * SubjectWise
    => Total Attendance
    => Monthly Attendance
    => Daily Attendance
 */

module.exports = { WriteStudentAttendance, addSubjects };
