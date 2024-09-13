import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      minlength: [3, "Must be Three character "],
      required: [true, "The text is required"],
    },
    videoId: {
      type: mongoose.Schema.ObjectId,
      ref: "Videos",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// CommentSchema.virtual("replies", {
//   ref: "Reply",
//   localField: "_id",
//   foreignField: "commentId",
//   justOne: false,

//   options: { sort: { createdAt: -1 } },
// });

const CommentModel = new mongoose.model("Comments", CommentSchema);

export default CommentModel;
