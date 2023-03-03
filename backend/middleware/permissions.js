const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Teacher = require("../models/student");
const expressAsyncHandler = require("express-async-handler");

const adminPermission = expressAsyncHandler(async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(payload._id);
    if (!admin) throw new Error();
    req._id = payload._id;
    next();
  } catch (error) {
    throw new Error("Admin Privileges Needed");
  }
});

const teacherPermission = expressAsyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(`Bearer `))
    throw new Error("You are Not Authrized for this feature");
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(payload._id);
    const teacher = await Teacher.findById(payload._id);
    if (!teacher && !admin) throw new Error();
    req._id = payload._id;
    next();
  } catch (error) {
    throw new Error("Not Authorized for this feature");
  }
});

module.exports = { adminPermission, teacherPermission };
