import express from "express";
import isEmptyBody from "../midleware/isEmptyBody.js";
import {
  Forgot_Password,
  Forgot_Password2,
  GetMe,
  logout,
  Signin,
  Signup,
  UpdateDetails,
  UpdatePassword,
  UploadAvtar,
} from "../Controllers/AuthController.js";
import ValidateBody from "../decorates/ValidateBody.js";
import {
  LoginSchemaValidation,
  UserValidationSchema,
} from "../Schema/Validator/UserValidateSchema.js";
import { Protect } from "../midleware/AuthMiddleware.js";
import upload from "../midleware/multer.js";

const AuthRoute = express.Router();

//Signup ✅✅
AuthRoute.post(
  "/signup",
  isEmptyBody,
  ValidateBody(UserValidationSchema),
  Signup
);

//Signin ✅✅
AuthRoute.post(
  "/signin",
  isEmptyBody,
  ValidateBody(LoginSchemaValidation),
  Signin
);

//Logout ✅✅
AuthRoute.post("/logout", logout);

//Get Current User ✅✅
AuthRoute.get("/me", Protect, GetMe);

//Update Details ✅✅
AuthRoute.put("/updatedetails", isEmptyBody, Protect, UpdateDetails);

//Upload Avatar ✅✅
AuthRoute.put("/updateavtar", Protect, upload.single("file"), UploadAvtar);

//Update Password ✅✅
AuthRoute.put("/update-password", isEmptyBody, Protect, UpdatePassword);

//Forgot Password ✅✅
AuthRoute.post("/forgot-password", Forgot_Password);

//Reset Password Token ✅✅
AuthRoute.put("/resetPassword/:resetToken", Forgot_Password2);

export default AuthRoute;
