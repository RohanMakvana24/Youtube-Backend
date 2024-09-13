import SubscriptionModel from "../models/SubscriptionModel.js";
import UserModel from "../models/UserModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";
// @desc    Create subscriber
// @route   Post /api/v1/subscriptions
// @access  Private
export const createSubscriber = async (req, res, next) => {
  try {
    const { chennalId } = req.body;
    if (!chennalId) {
      return next(new HttpResponse(400, "The ChennelId is required"));
    }
    //Own channel suscribe error
    if (chennalId.toString() == req.user._id.toString()) {
      return next(new HttpResponse(404, "you can not subscribe own channel"));
    }

    let subscription = await SubscriptionModel.findOne({
      channelId: chennalId,
      subscriberId: req.user._id,
    });

    if (subscription) {
      await SubscriptionModel.findByIdAndDelete(subscription._id);
      return res.status(200).json({ success: true, data: {} });
    } else {
      subscription = await SubscriptionModel.create({
        subscriberId: req.user._id,
        channelId: chennalId,
      });
      return res.status(200).json({ success: true, data: subscription });
    }
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};

//<--------------- End Create Subscriber Section 🎯 ---------------> //

// @desc    Check Subscriber
// @route   Post /api/v1/subscription/check
// @access  Private
export const checkSubscription = async (req, res, next) => {
  try {
    const { chennalId } = req.body;
    if (!chennalId) {
      return next(new HttpResponse(400, "The ChennelId is required"));
    }

    let subscription = await SubscriptionModel.findOne({
      channelId: chennalId,
      subscriberId: req.user._id,
    });

    if (!subscription) {
      return res.status(200).json({ success: true, data: {} });
    }
    return res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
//<--------------- End Check Subscriber Section 🎯 ---------------> //

// @desc   Get all subscribers
// @route   Post /api/v1/subscription/subscribers
// @access  Private
export const getSubscribers = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const subscibers = await SubscriptionModel.find({
      channelId,
    });
    const Sub = await UserModel.find({
      subscriberId: req.user._id,
    });
    res.json(Sub);
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
