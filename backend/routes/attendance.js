const router = require("express").Router();
const { teacherPermission } = require("../middleware/permissions");
const {
  WriteStudentAttendance,
  addSubject,
  removeSubject,
} = require("../controllers/attendance");

router.route("/").put(teacherPermission, WriteStudentAttendance);
router.route("/addsubjects").post(teacherPermission, addSubject);
router.route("/removesubject").put(teacherPermission, removeSubject);

module.exports = router;
