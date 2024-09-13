import CommentModel from "../models/CommentModel.js";
import VideoModel from "../models/VideoModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";

//@desc   Create Comment
//@Route  POST : api/v1/comment
//access  Private User

export const CreateComment = async (req, res, next) => {
  try {
    const { text, videoId } = req.body;
    //validation
    if (!text || !videoId) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    //Videp Validation
    const Video = await VideoModel.findOne({
      _id: videoId,
      status: "public",
    });
    if (!Video) {
      return next(
        new HttpResponse(404, `Video is not found with id ${videoId}`)
      );
    }

    //Store
    const Comment = await CommentModel.create({
      text: text,
      videoId: videoId,
      userId: req.user._id,
    });

    //response
    res.status(200).send({
      success: true,
      message: "Comment Added",
      Comment,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
//___________________*** End Add Comment Section 😁 ***______________________//

//@desc   Update Comment
//@Route  Put : api/v1/comment/;id
//access  Private User
export const UpdateComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    //validation
    if (!text) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    const commentID = req.params.id;
    const Comment = await CommentModel.findById(commentID).populate("videoId");

    if (!Comment) {
      return next(new HttpResponse(404, `No Comment with id ${commentID}`));
    }
    if (
      Comment.userId.toString() == req.user._id.toString() ||
      Comment.videoId.userId == req.user._id.toString()
    ) {
      const upComment = await CommentModel.findByIdAndUpdate(
        commentID,
        {
          text: text,
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({ success: true, data: Comment });
    } else {
      return next(
        new HttpResponse(400, `You are not authorized to update this comment`)
      );
    }
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

//@desc   Delete Comment
//@Route  DELETE : api/v1/comment/:id
//access  Private User
export const deleteComment = async (req, res) => {
  try {
    const commentID = req.params.id;
    const Comment = await CommentModel.findById(commentID).populate("videoId");

    if (!Comment) {
      return next(new HttpResponse(404, `No Comment with id ${commentID}`));
    }
    if (
      Comment.userId.toString() == req.user._id.toString() ||
      Comment.videoId.userId == req.user._id.toString()
    ) {
      const upComment = await CommentModel.findByIdAndDelete(commentID);
      res.status(200).json({ success: true, message: "Comment Deleted" });
    } else {
      return next(
        new HttpResponse(400, `You are not authorized to Delete this comment`)
      );
    }
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

//@desc   Get Comment With Video ID
//@Route  GET : api/v1/comment/:videoId/video
//access  Private User
export const getCommentbyVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    console.log(videoId);
    const Comments = await CommentModel.find({
      videoId: videoId,
    })
      // .populate("userId")
      // .populate("replies")
      .sort("-createdAt");
    console.log(Comments);
    if (!Comments) {
      return next(
        new HttpResponse(`No comment with that video id of ${videoId}`)
      );
    }

    res.status(200).json({ sucess: true, data: Comments });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
