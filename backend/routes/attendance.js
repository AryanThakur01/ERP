const router = require("express").Router();
const { teacherPermission } = require("../middleware/permissions");
const {
  WriteStudentAttendance,
  officialAttendance,
  WriteSelfAttendance,
  selfAttendance,
  selfSubjects,
  subjectAttendanceData,
  removeSelfSubject,
  deleteSelfAttendance,
} = require("../controllers/attendance");
const { authenticate } = require("../middleware/authentication");

router.route("/").post(teacherPermission, WriteStudentAttendance);
router.route("/selfAttendance").post(authenticate, WriteSelfAttendance);
router.route("/official").get(authenticate, officialAttendance);
router.route("/self").get(authenticate, selfAttendance);
router.route("/selfsubjects").get(authenticate, selfSubjects);
router.route("/subjectAttendanceData").get(authenticate, subjectAttendanceData);
router.route("/removeSubject").delete(authenticate, removeSelfSubject);
router
  .route("/deleteSelfAttendance")
  .delete(authenticate, deleteSelfAttendance);

module.exports = router;
