import express from "express";
import { authorize, Protect } from "../midleware/AuthMiddleware.js";
import isEmptyBody from "../midleware/isEmptyBody.js";
import upload from "../midleware/multer.js";
import {
  createUser,
  deleteUser,
  getSingleUser,
  getUsers,
  update_User,
} from "../Controllers/UserController.js";
import AdvanceResult from "../midleware/AdvanceResult.js";
import UserModel from "../models/UserModel.js";

const UserRoute = express.Router();
//CREATE AND GET USERS 🎯 ✅✅
UserRoute.route("/")
  .post(Protect, authorize("admin"), upload.single("profile"), createUser)
  .get(Protect, authorize("admin"), AdvanceResult(UserModel), getUsers);

//GET SINGLE AND UPDATE AND DELETE USERS
UserRoute.route("/:id")
  .get(Protect, authorize(" admin"), getSingleUser)
  .delete(Protect, authorize("admin"), deleteUser)
  .put(Protect, authorize("admin"), upload.single("profile"), update_User);

export default UserRoute;
