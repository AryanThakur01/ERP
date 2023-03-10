const asyncHandler = require("express-async-handler");

const NotFoundMiddleware = asyncHandler(async (req, res) => {
  res
    .status(404)
    .json({ message: `${req.url} NOT FOUND || recheck the requested url` });
});

module.exports = { NotFoundMiddleware };
