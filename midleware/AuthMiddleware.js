import UserModel from "../models/UserModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";
import jwt from "jsonwebtoken";

//Protect Route
export const Protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new HttpResponse(401, "Auth Token is required"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decode.id);
    next();
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(401, "Not authorized to access this route"));
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HttpResponse(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
