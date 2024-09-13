import AdvanceResult from "../midleware/AdvanceResult.js";
import FeelingModel from "../models/FeelingModel.js";
import VideoModel from "../models/VideoModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";

// @desc    Create Feeling
// @route   Post /api/v1/subscription/feelings
// @access  Private/User
export const createFeelings = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const { type, userId, videoId } = req.body;

    //validation

    if (!type || !userId || !videoId) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    // check video Exist
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return next(new HttpResponse(404, `no video found with id(${videoId})`));
    }

    //Check Video Status
    if (video.status !== "public") {
      return next(
        new HttpResponse(
          400,
          `You can't like/dislike this video until it's made pulbic`
        )
      );
    }

    // Check if feeling exists
    let Feeling = await FeelingModel.findOne({
      videoId,
      userId,
    });

    //if not exist then create
    if (!Feeling) {
      const newFeeling = await FeelingModel.create({
        type,
        videoId,
        userId,
      });
      return res.status(200).json({ success: true, data: newFeeling });
    }
    //else  check req.body.feeling if equals to feeling.type remove
    if (type == Feeling.type) {
      await FeelingModel.findByIdAndDelete(Feeling._id);
      return res.status(200).json({ success: true, data: {} });
    } else {
      Feeling.type = type;
      Feeling = await Feeling.save();
    }
    res.status(200).json({ success: true, data: Feeling });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};

// <-------------- End Create Feeling Section 🎯  -------------->  //

// @desc    Check Feeling
// @route   POST /api/v1/subscription/feelings
// @access  Private/User
export const CheckFeeling = async (req, res, next) => {
  try {
    const videoId = req.body.videoId;
    if (!videoId) {
      return next(new HttpResponse(400, "All Fields are required"));
    }
    const Feeling = await FeelingModel.findOne({
      videoId: videoId,
      userId: req.user._id,
    });

    if (!Feeling) {
      res.status(200).json({ success: true, data: { feeling: "" } });
    }
    res.status(200).json({ success: true, data: { feeling: Feeling.type } });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
// <-------------- End Check Feeling Section 🎯  -------------->  //

// @desc    Get Liked Video
// @route   POST /api/v1/feelings/video
// @access  Private/User
export const getLikedVideo = async (req, res, next) => {
  try {
    const Likes = await FeelingModel.find({
      userId: req.user._id,
      type: "like",
    });

    //check liked Video Length
    if (Likes.length === 0) {
      res.status(200).json({ success: true, data: {} });
    }

    //get liked video ID
    const videoId = Likes.map((video) => {
      return {
        _id: video.videoId.toString(),
      };
    });
    console.log(videoId);

    //Get Liked Video
    const LikedVideo = await VideoModel.find({
      _id: { $in: videoId },
    });
    if (LikedVideo) {
      res.status(200).json({
        success: true,
        data: LikedVideo,
      });
    } else {
      res.status(200).json({
        success: true,
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
