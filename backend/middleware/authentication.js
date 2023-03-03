const expressAsyncHandler = require("express-async-handler");

const authenticate = expressAsyncHandler(async () => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    throw new Error("Not Authorized");
  }
});

module.exports = { authenticate };
