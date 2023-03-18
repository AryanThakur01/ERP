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
    if (!["P", "A", "L"].includes(element.attendance)) {
      return;
    }

    const filter = {
      student_id: element.student_id,
      isSelf: false,
      Subject: element.subject,
      date: d.toDateString(),
    };
    const update = { $set: { Status: element.attendance } };
    const options = { upsert: true, new: true };
    // console.log(filter, update, options);
    const a = await Attendance.updateOne(filter, update, options);
    console.log(a);
  });

  res.status(200).json({ message: "Update Successful" });
});

const WriteSelfAttendance = expressAsyncHandler(async (req, res) => {
  const { date, data } = req.body;
  const _id = req.user._id;

  const d = new Date(date);
  data.subject = data.subject.trim();
  data.attendance = data.attendance.trim();
  if (isNaN(d.getFullYear())) {
    throw new Error("Invalid Date");
  }
  if (!data.subject) {
    throw new Error("Provide subject Name");
  }
  if (!data.attendance) {
    throw new Error("attendanceStatus Missing");
  }
  const filter = {
    student_id: _id,
    isSelf: true,
    Subject: data.subject,
    date: d.toDateString(),
  };
  const update = { $set: { Status: data.attendance } };
  const options = { upsert: true, new: true };
  const a = await Attendance.updateOne(filter, update, options);

  res.status(200).json({ message: "Update Successful", a });
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

// Self Attendance
const selfAttendance = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const attendance = await Attendance.find({ student_id: _id, isSelf: true });

  let Present = [],
    Absent = [],
    Leave = [];
  attendance.forEach((e) => {
    switch (e.Status) {
      case "P":
        Present.push(e);
        break;
      case "A":
        Absent.push(e);
        break;
      case "L":
        Leave.push(e);
        break;

      default:
        break;
    }
  });

  res.status(200).json({ Present, Absent, Leave });
});

const subjectAttendanceData = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { subjectName } = req.query;

  const attendance = await Attendance.find({
    student_id: _id,
    isSelf: true,
    Subject: subjectName,
  });
  let Present = [],
    Absent = [],
    Leave = [];
  attendance.forEach((e) => {
    switch (e.Status) {
      case "P":
        Present.push(e);
        break;
      case "A":
        Absent.push(e);
        break;
      case "L":
        Leave.push(e);
        break;

      default:
        break;
    }
  });
  Present.push;

  res.status(200).json({
    Present: { Present, length: Present.length },
    Absent: { Absent, length: Absent.length },
    Leave: { Leave, length: Leave.length },
  });
});

const selfSubjects = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const subjectList = await Attendance.distinct("Subject", {
    student_id: _id,
    isSelf: true,
  });

  res.status(200).json({ subjectList });
});

const removeSelfSubject = expressAsyncHandler(async (req, res) => {
  const message = await Attendance.deleteMany({ Subject: req.query.subject });
  res.status(200).json({ msg: message });
});
const deleteSelfAttendance = expressAsyncHandler(async (req, res) => {
  console.log(req.query);
  const message = await Attendance.deleteOne({ date: req.query.date });
  res.status(200).json({ msg: message });
});

module.exports = {
  WriteStudentAttendance,
  officialAttendance,
  WriteSelfAttendance,
  selfAttendance,
  selfSubjects,
  subjectAttendanceData,
  removeSelfSubject,
  deleteSelfAttendance,
};
