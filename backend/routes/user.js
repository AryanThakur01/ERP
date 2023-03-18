// /api/v1/auth
const router = require("express").Router();
const {
  loginUser,
  registerTeacher,
  registerStudent,
  sendVerification,
  registerSelf,
} = require("../controllers/user");
const { adminPermission } = require("../middleware/permissions");

router.route("/emailVerification").post(sendVerification);
router.route("/registerself/:token").get(registerSelf);
// Only Admins Can Perform
router.route("/registerTeacher").post(adminPermission, registerTeacher);
router.route("/registerStudent").post(adminPermission, registerStudent);
// ----------x-----------x--------x---------------
router.route("/login").post(loginUser);

module.exports = router;
