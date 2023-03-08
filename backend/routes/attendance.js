const router = require("express").Router();
const { teacherPermission } = require("../middleware/permissions");
const {
  WriteStudentAttendance,
  addSubject,
  removeSubject,
} = require("../controllers/attendance");

router.route("/").post(teacherPermission, WriteStudentAttendance);

module.exports = router;
