import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    searchText: {
      type: String,
    },
    type: {
      type: String,
      enum: ["watch", "search"],
      required: [true, "Type is required"],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "User Id is required "],
    },
    videoId: {
      type: mongoose.Schema.ObjectId,
      ref: "Videos",
      required: [true, "Video Id is required "],
    },
  },
  {
    timestamps: true,
  }
);

const HistoryModel = new mongoose.model("History", HistorySchema);

export default HistoryModel;
