import HistoryModel from "../models/HistoryModel.js";
import VideoModel from "../models/VideoModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";

// @desc    Creates History
// @route   Post /api/v1/history
// @access  Private
export const createHistory = async (req, res, next) => {
  try {
    const { searchText, type, videoId } = req.body;

    //validation
    if (!searchText || !type || !videoId) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    if (type == "watch") {
      const video = await VideoModel.findById(videoId);

      if (!video) {
        return next(new HttpResponse(400, `no video with id(${videoId})`));
      }
    }

    const history = await HistoryModel.create({
      searchText,
      type,
      videoId,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};

// <---------------------- End Create History Section 💣 --------------------------> //

// @desc    Delete Single History
// @route   Post /api/v1/history/:id
// @access  Private
export const DeleteHistory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const History = await HistoryModel.findOne({
      _id: id,
      userId: req.user._id,
    });

    //validation
    if (!History) {
      return next(new HttpResponse(400, `No history with id(${id})`));
    }

    await HistoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "The History Deleted Succefully",
      data: {},
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(400, error.message));
  }
};

// <---------------------- End delete History Section 💣 --------------------------> //

// @desc    Delete Histories
// @route   DELETE /api/v1/history/:type/all
// @access  Private

export const deleteManyHistory = async (req, res, next) => {
  try {
    const type = req.params.type;
    //validation
    if (!type) {
      return next(new HttpResponse(400, "Type is required"));
    }

    //delete Logic
    await HistoryModel.deleteMany({
      type: type,
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
// <---------------------- End Many delete History Section 💣 --------------------------> //

// @desc    Get Histories
// @route   GET /api/v1/history
// @access  Private
export const getHistory = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
