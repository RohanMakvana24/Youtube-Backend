import mongoose, { mongo } from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      minlenght: [3, "must be three character long"],
      required: [true, "The text is required"],
    },
    commentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Comments",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

ReplySchema.pre("find", function () {
  this.populate({
    path: "userId",
    select: "channelName photoUrl", //🤦‍♂️
    sort: "+createdAt",
  });
});

const ReplyModel = new mongoose.model("Reply", ReplySchema);
export default ReplyModel;
