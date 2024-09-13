import CommentModel from "../models/CommentModel.js";
import ReplyModel from "../models/ReplyModel.js";
import UserModel from "../models/UserModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";
// @desc    Create Reply
// @route   POST /api/v1/replies
// @access  Private/Admin
export const createReply = async (req, res, next) => {
  try {
    const { text, commentId } = req.body;

    // Validation
    if (!text || !commentId) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    console.log(req.body);

    //Check if Comment Exist
    const Comment = await CommentModel.find({
      _id: commentId,
    });

    if (!Comment) {
      return next(new HttpResponse(404, `No Comment with id of ${commentId}`));
    }

    const Reply = await ReplyModel.create({
      text,
      commentId,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "The Reply Added",
      data: Reply,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

// @desc    Get Reply
// @route   get /api/v1/replies
// @access  Private/Admin
export const getReplys = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

// @desc    Update Reply
// @route   Put  /api/v1/replies/:id
// @access  Private/Admin
export const updateReply = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { text } = req.body;
    const Reply = await ReplyModel.findById(id).populate({
      path: "commentId",
      select: "userId videoId",
      populate: { path: "videoId", select: "userId" },
    });

    if (!Reply) {
      return next(new HttpResponse(404, `replay not found with id ${id}`));
    }

    if (
      Reply.userId.toString() == req.user._id.toString() ||
      Reply.commentId.videoId.userId.toString() != req.user._id
    ) {
      const upReply = await ReplyModel.findByIdAndUpdate(
        id,
        {
          text: text,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "The Updated Succefullly",
        data: upReply,
      });
    } else {
      return next(
        new HttpResponse(400, `You are not authorized to delete this reply`)
      );
    }
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

// @desc    Delete Reply
// @route   Delete  /api/v1/replies/:id
// @access  Private/Admin
export const deleteReply = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Reply = await ReplyModel.findById(id).populate({
      path: "commentId",
      select: "userId videoId",
      populate: { path: "videoId", select: "userId" },
    });

    if (!Reply) {
      return next(new HttpResponse(404, `replay not found with id ${id}`));
    }

    if (
      Reply.userId.toString() == req.user._id.toString() ||
      Reply.commentId.videoId.userId.toString() != req.user._id
    ) {
      await ReplyModel.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "The Reply Deleted ",
      });
    } else {
      return next(
        new HttpResponse(400, `You are not authorized to delete this reply`)
      );
    }
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
