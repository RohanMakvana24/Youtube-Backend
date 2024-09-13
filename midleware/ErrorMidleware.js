import { HttpResponse } from "../utils/HttpResponse.js";

const HandleGlobalErorr = (err, req, res, next) => {
  let error = {
    ...err,
  };
  error.message = err.message;
  console.log(err);

  //Mongoose bad ObjectID
  if (err.name == "CastError") {
    const message = "Resouce is not Found";
    error = new HttpResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code == 11000) {
    const message = "Duplicate field value entered";
    console.log(err);
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = [];
    Object.values(err.errors).forEach((errr) => {
      message.push({
        field: errr.properties.path,
        message: errr.message,
      });
    });
    error = new ErrorResponse(null, 400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.messageWithField || error.message || "Server Error",
  });
};

export default HandleGlobalErorr;
