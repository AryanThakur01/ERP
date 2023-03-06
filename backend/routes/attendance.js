const router = require("express").Router();
const { teacherPermission } = require("../middleware/permissions");
const { WriteStudentAttendance } = require("../controllers/attendance");

router.route("/").post(teacherPermission, WriteStudentAttendance);

module.exports = router;
