const asyncHandler = require("express-async-handler");
// /api/v1/auth/register
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "This is registration Page" });
});
// /api/v1/auth/login
const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "hello" });
  return;
});
module.exports = { loginUser, registerUser };
