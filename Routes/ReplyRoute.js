import express from "express";
import { Protect } from "../midleware/AuthMiddleware.js";
import {
  createReply,
  deleteReply,
  getReplys,
  updateReply,
} from "../Controllers/ReplyController.js";
import isEmptyBody from "../midleware/isEmptyBody.js";
import AdvanceResult from "../midleware/AdvanceResult.js";
import ReplyModel from "../models/ReplyModel.js";

const ReplyRoute = express.Router();

//Create and Get Reply Route 🎯 ✅✅
ReplyRoute.route("/")
  .post(isEmptyBody, Protect, createReply)
  .get(AdvanceResult(ReplyModel), getReplys); //😢

//UPDATE AND DELETE REPLY 🎯 ✅✅
ReplyRoute.route("/:id")
  .put(Protect, isEmptyBody, updateReply)
  .delete(Protect, deleteReply);
export default ReplyRoute;
