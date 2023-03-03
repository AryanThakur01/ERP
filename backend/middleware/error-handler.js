const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Some Error {Check Error-Handler}",
  };
  res.status(customError.statusCode).json(customError);
  return;
};

module.exports = { errorHandlerMiddleware };
