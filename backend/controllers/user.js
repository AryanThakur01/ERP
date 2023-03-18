// There is a problem in login that the password is being sent to the frontend, this problem need to be solved
const asyncHandler = require("express-async-handler");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

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
  for (let index = 0; index < 2; index++) {
    Attendance.create({
      student_id: s._id,
      isSelf: index ? true : false,
      TotalClasses: 0,
      Present: 0,
      semester: s.semester || 1,
    });
  }
  res
    .status(200)
    .json({ userName: student.userName, email: student.email, token });
});
// ------------------------------------------------------------------------

// userName
// rollNo
// course
// email
// password
const sendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const checkUser = await Student.findOne({ email });
  if (checkUser) {
    throw new Error("Already Registered");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thakuraryan942@gmail.com",
      pass: process.env.SMTP_PASSWORD,
    },
  });
  // const data = fs.readFileSync(
  //   path.resolve(__dirname, "./templates/mailing.txt"),
  //   "utf-8"
  // );
  // const file = fs.open(path.resolve(__dirname, "./templates/mailing.txt"));
  fs.readFile(
    path.resolve(__dirname, "./templates/mailing.html"),
    "utf-8",
    (err, data) => {
      const token = jwt.sign(
        {
          USERNAME: req.body.userName,
          EMAIL: req.body.email,
          ROLLNO: req.body.rollNo,
          COURSE: req.body.course,
          PASSWORD: req.body.password,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const userForm = data
        .replace("{{userName}}", req.body.userName)
        .replace("{{email}}", req.body.email)
        .replace("{{rollNo}}", req.body.rollNo)
        .replace("{{course}}", req.body.course)
        .replace("{{password}}", req.body.password)
        .replace("{{domain}}", process.env.DOMAIN)
        .replace("{{token}}", token);
      console.log(userForm);
      const mailOptions = {
        from: "thakuraryan942@gmail.com",
        to: email,
        subject: "EMAIL-VERIFICATION",
        html: userForm,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        }
      });
    }
  );
  res.status(200).json({ message: "CHECK YOUR EMAIL" });
});
const registerSelf = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const registerUser = {
    userName: user.USERNAME,
    email: user.EMAIL,
    classRoll: user.ROLLNO,
    course: user.COURSE,
    password: user.PASSWORD,
  };
  const student = await Student.create(registerUser);
  res
    .status(200)
    .send(`<div style='color: green'><b>REGISTERED SUCCESSFULLY</b></div>`);
  // res.status(200).json({ registerUser });
});

// /api/v1/auth/login
const loginUser = asyncHandler(async (req, res) => {
  let student = await Student.findOne({ email: req.body.email });
  if (student && (await student.checkPassword(req.body.password))) {
    student.password = "";
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
    teacher.password = "";
    const token = await teacher.createJWT();
    return res.status(200).json({ user: teacher, token });
  }

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin && (await admin.checkPassword(req.body.password))) {
    admin.password = "";
    const token = await admin.createJWT();
    return res.status(200).json({ user: admin, token });
  }
  res.status(400).json({ message: "Recheck Your UserName And Password" });
});
module.exports = {
  loginUser,
  registerTeacher,
  registerStudent,
  registerSelf,
  sendVerification,
};
