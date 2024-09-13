import express from "express";
import { Protect } from "../midleware/AuthMiddleware.js";
import isEmptyBody from "../midleware/isEmptyBody.js";
import {
  CreateComment,
  deleteComment,
  getCommentbyVideo,
  UpdateComment,
} from "../Controllers/CommentController.js";

const CommentRoute = express.Router();

// CREATE COMMENT ROUTE 🧛‍♀️ ✅✅
CommentRoute.route("/").post(Protect, isEmptyBody, CreateComment);

// UPDATE COMMENT ROUTE 🧛‍♀️ ✅✅
CommentRoute.route("/:id")
  .put(Protect, isEmptyBody, UpdateComment)
  .delete(Protect, deleteComment);
// GET COMMENT BY VIDEO ID 🧛‍♀️✅✅
CommentRoute.route("/:videoId/video").get(Protect, getCommentbyVideo);
export default CommentRoute;
