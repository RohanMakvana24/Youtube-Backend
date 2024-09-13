import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  channelId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "Chennal id is required"],
  },
  subscriberId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "Subscriber id is required"],
  },
});

const SubscriptionModel = new mongoose.model(
  "Subscription",
  SubscriptionSchema
);

export default SubscriptionModel;
