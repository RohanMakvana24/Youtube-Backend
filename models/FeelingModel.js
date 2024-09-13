import mongoose from "mongoose";

const FeelingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: [true, "Type is required"],
    },
    videoId: {
      type: mongoose.Schema.ObjectId,
      ref: "Videos",
      required: [true, "VideoId is required "],
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeelingModel =  mongoose.model("Feeling", FeelingSchema);

export default FeelingModel;
