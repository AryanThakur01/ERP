const router = require("express").Router();
const { teacherPermission } = require("../middleware/permissions");
const {
  WriteStudentAttendance,
  officialAttendance,
} = require("../controllers/attendance");
const { authenticate } = require("../middleware/authentication");

router.route("/").post(teacherPermission, WriteStudentAttendance);
router.route("/official").get(authenticate, officialAttendance);

module.exports = router;
