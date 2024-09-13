import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be three character long"],
    },
    description: {
      type: String,
      default: "",
    },
    thumbnailUrl: [
      {
        public_id: {
          type: "String",
        },
        url: {
          type: "String",
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    VideoUrl: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "private", "public"],
      default: "draft",
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

VideoSchema.index({ title: "text" });

VideoSchema.virtual("dislikes", {
  ref: "Feeling",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
  match: { type: "dislike" },
});

VideoSchema.virtual("likes", {
  ref: "Feeling",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
  match: { type: "like" },
});

VideoSchema.virtual("comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
});

const VideoModel = new mongoose.model("Videos", VideoSchema);

export default VideoModel;
