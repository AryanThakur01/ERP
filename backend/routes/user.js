// /api/v1/auth
const router = require("express").Router();
const { loginUser, registerUser } = require("../controllers/user");

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);

module.exports = router;
