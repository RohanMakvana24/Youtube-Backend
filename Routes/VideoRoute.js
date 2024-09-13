import express from "express";
import { Protect } from "../midleware/AuthMiddleware.js";
import upload from "../midleware/multer.js";
import {
  DeletedVideo,
  getSingleVideo,
  getVideos,
  updateView,
  uploadThumbnail,
  UploadVideo,
  videoUpdate,
} from "../Controllers/VideoController.js";
import AdvanceResult from "../midleware/AdvanceResult.js";
import VideoModel from "../models/VideoModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";

const VideoRoute = express.Router();

//Upload Video Route 💨 ✅✅
VideoRoute.post("/", Protect, upload.single("video"), UploadVideo);

//Get Private Video Route 💨 ✅✅
VideoRoute.route("/private").get(
  Protect,
  AdvanceResult(
    VideoModel,
    [
      { path: "userId" },
      { path: "categoryId" },
      { path: "likes" },
      { path: "dislikes" },
      { path: "comments" },
    ],
    {
      status: "private",
    }
  ),
  getVideos
);

//Get Public Video Route 💨 ✅✅
VideoRoute.route("/public").get(
  Protect,
  AdvanceResult(
    VideoModel,
    [
      { path: "userId" },
      { path: "categoryId" },
      { path: "likes" },
      { path: "dislikes" },
      { path: "comments" },
    ],
    {
      status: "public",
    }
  ),
  getVideos
);

//Get Single Video Route 💨 ✅✅
VideoRoute.route("/:id")
  .get(Protect, getSingleVideo)
  .put(Protect, videoUpdate)
  .delete(Protect, DeletedVideo);

//Update Video Views 💨 ✅✅
VideoRoute.route("/:id/view").put(Protect, updateView);

//Upload Thumbnail 💨 ✅✅
VideoRoute.route("/:id/thumbnail").put(
  Protect,
  upload.single("file"),
  uploadThumbnail
);
export default VideoRoute;
