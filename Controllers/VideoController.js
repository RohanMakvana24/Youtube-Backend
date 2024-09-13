import cloudinary from "cloudinary";

//@desc   Upload Video
//@Route  Post : api/v1/video
//access  Private User

import VideoModel from "../models/VideoModel.js";
import { getDataUri } from "../utils/features.js";
import { HttpResponse } from "../utils/HttpResponse.js";
import UserModel from "../models/UserModel.js";
import CategoriesModel from "../models/CategoriesModel.js";

export const UploadVideo = async (req, res, next) => {
  try {
    const { title, description, categoryId } = req.body;

    //validation of empty
    if (!title || !description || !categoryId) {
      return next(new HttpResponse(400, "All Fields are required"));
    }
    if (!req.user._id) {
      return next(new HttpResponse(400, "Sorrry Somenthing Went Wrong"));
    }
    if (!req.file) {
      return next(new HttpResponse(400, "Please Upload A Video"));
    }

    //Video Upload Only Validation
    if (!req.file.mimetype.startsWith("video")) {
      return next(new HttpResponse(400, "Please Upload A Video"));
    }

    //video Size Validation
    const maxFiel = parseInt(process.env.MAX_FILE_UPLOAD * 10);
    if (req.file.size > maxFiel) {
      return next(
        new HttpResponse(
          404,
          `Please Upload a Video less than ${
            (process.env.MAX_FILE_UPLOAD * 10) / 1000000
          }mb`
        )
      );
    }

    //upload Video vie Cloudinary
    const video = await getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(video.content, {
      resource_type: "video",
    });

    //Store values
    const Video = await VideoModel.create({
      title: title,
      description: description,
      categoryId: categoryId,
      userId: req.user._id,
      VideoUrl: {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      },
    });

    //response
    res.status(201).send({
      sucess: true,
      message: "The Video Uploaded Succefully",
      Video,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
//-------------------- 🎯 End Video Upload Section 🎯 ---------------//

//@desc   get Video
//@Route  get : api/v1/video/private
//access  Private User

export const getVideos = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
//-------------------- 🎯 End Get Video Section 🎯 ---------------//

//@desc   Get Single  Video
//@Route  get : api/v1/video/:id
//access  Private User
export const getSingleVideo = async (req, res, next) => {
  try {
    const id = req.params.id;

    const Video = await VideoModel.findById(id)
      .populate({
        path: "categoryId",
      })
      .populate({ path: "userId", select: "channelName subscribers photoUrl" })
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      .populate({ path: "comments" });
    if (!Video) {
      return next(new HttpResponse(400, `Video Not Found with id(${id})`));
    }

    return res.status(200).json({
      success: true,
      data: Video,
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};

//-------------------- 🎯 End Get Single Video Section 🎯 ---------------//

//@desc   Update Video
//@Route  get : api/v1/video/:id
//access  Private User
export const videoUpdate = async (req, res, next) => {
  try {
    const { title, description, categoryId, status } = req.body;
    //validation
    if (!title || !description || !categoryId || !status) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    //Video Id
    const videoId = req.params.id;
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return next(new HttpResponse(400, `no video with id(${videoId})`));
    }

    //check if categories is exist
    const Category = await CategoriesModel.findById(categoryId);
    if (!Category) {
      return next(
        new HttpResponse(400, `no category found with id(${categoryId})`)
      );
    }

    //Update
    const UpdatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      {
        title: title,
        desciption: description,
        status: status,
        categoryId: categoryId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: UpdatedVideo,
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
//-------------------- 🎯 Update  Video Section 🎯 ---------------//

//@desc   Delete Video
//@Route  DELETE : api/v1/video/:id
//access  Private User
export const DeletedVideo = async (req, res, next) => {
  try {
    const id = req.params.id;

    const video = await VideoModel.findById(id);
    if (!video) {
      return next(new HttpResponse(400, `No Video with id(${id})`));
    }

    // const public_id = video.VideoUrl[0].public_id;
    // console.log(public_id);
    // const result = await cloudinary.v2.uploader.destroay("omq602anjl6z1e5jizgz");

    await VideoModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Delete Video Succefully",
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
//-------------------- 🎯 Delete Video Section 🎯 ---------------//

//@desc   Update Views
//@Route  PUT : api/v1/video/:id/views
//access  Private User
export const updateView = async (req, res, next) => {
  try {
    const id = req.params.id;
    const video = await VideoModel.findById(id);
    if (!video) {
      return next(new HttpResponse(400, `No Video With Id(${id})`));
    }
    video.views++;
    await video.save();
    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
//-------------------- 🎯 Update Video View Section 🎯 ---------------//

//@desc   Upload Video Thumbnail
//@Route  PUT : api/v1/video/:id/thubnail
//access  Private User
export const uploadThumbnail = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await VideoModel.findById(videoId);

    if (!video) {
      return next(new HttpResponse(400, `No Video With id(${videoId})`));
    }

    //file Validation
    if (!req.file) {
      return next(new HttpResponse(400, `File is required`));
    }
    if (!req.file.mimetype.startsWith("image")) {
      return next(new HttpResponse(400, "Please Upload A Image"));
    }
    if (req.file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new HttpResponse(
          404,
          `Please upload an image less than ${
            process.env.MAX_FILE_UPLOAD / 1000 / 1000
          }mb`
        )
      );
    }

    //upload logic
    const files = await getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(files.content);
    //Store
    const Video = await VideoModel.findByIdAndUpdate(videoId, {
      thumbnailUrl: {
        public_id: cdb.public_id,
        url: cdb.url,
      },
    });

    //response
    return res.status(200).json({
      sucess: true,
      data: Video,
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};

//-------------------- 🎯 Update Video ThumbnailSection 🎯 ---------------//
