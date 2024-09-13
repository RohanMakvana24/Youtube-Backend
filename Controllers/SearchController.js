import UserModel from "../models/UserModel.js";
import VideoModel from "../models/VideoModel.js";
import { HttpResponse } from "../utils/HttpResponse.js";

export const Search = async (req, res, next) => {
  try {
    const { text } = req.body;

    console.log(text);

    let Channels = await UserModel.find({ $text: { $search: text } }).populate({
      path: "videos",
    });

    const Video = await VideoModel.find({ $text: { $search: text } }).populate({
      path: "userId",
    });

    Channels.push(...Video);

    let search = Channels;

    const page = parseInt(req.body.page, 10) || 1;
    const limit = parseInt(req.body.limit, 10) || 12;
    const StartIndex = (page - 1) * limit;
    const EndIndex = page * limit;
    const total = search.length;
    const totalPage = Math.ceil(total / limit);

    if (parseInt(req.query.limit) !== 0) {
      search = search.slice(StartIndex, EndIndex);
    }

    //pagination Result
    const Pagination = {};

    if (EndIndex < total) {
      Pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (StartIndex > 0) {
      Pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    if (parseInt(req.query.limit) !== 0) {
      res.status(200).json({
        success: true,
        count: search.length,
        totalPage,
        Pagination,
        data: search,
      });
    } else {
      res.status(200).json({
        success: true,
        data: search,
      });
    }
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
