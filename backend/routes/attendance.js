const router = require("express").Router();
const { teacherPermission } = require("../middleware/permissions");
const {
  WriteStudentAttendance,
  addSubjects,
} = require("../controllers/attendance");

router.route("/").post(teacherPermission, WriteStudentAttendance);
router.route("/addsubjects").post(teacherPermission, addSubjects);

module.exports = router;
