const asyncHandler = require("express-async-handler");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Admin = require("../models/admin");

// -----------------------------Admin Features-----------------------------
// /api/v1/auth/registerTeacher
const registerTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.create(req.body);
  const token = await teacher.createJWT();
  res
    .status(200)
    .json({ userName: teacher.userName, email: teacher.email, token });
});
// /api/v1/auth/registerStudent
const registerStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  const token = await student.createJWT();
  res
    .status(200)
    .json({ userName: student.userName, email: student.email, token });
});
// ------------------------------------------------------------------------
// /api/v1/auth/login
const loginUser = asyncHandler(async (req, res) => {
  let student = await Student.findOne({ email: req.body.email });
  if (student && (await student.checkPassword(req.body.password))) {
    student = await Teacher.populate(student, {
      path: "teacher",
      select: "-password",
    });
    const token = await student.createJWT();
    res.status(200).json({ user: student, token });
    return;
  }

  let teacher = await Teacher.findOne({ email: req.body.email });
  if (teacher && (await teacher.checkPassword(req.body.password))) {
    const token = await teacher.createJWT();
    return res.status(200).json({ user: teacher, token });
  }

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin && (await admin.checkPassword(req.body.password))) {
    const token = await admin.createJWT();
    return res.status(200).json({ user: admin, token });
  }
  res.status(200).json({ message: "Recheck Your UserName And Password" });
});
module.exports = { loginUser, registerTeacher, registerStudent };

// There is a problem in login that the password is being sent to the frontend, this problem need to be solved
