import express from "express";
import { Protect } from "../midleware/AuthMiddleware.js";
import {
  createHistory,
  DeleteHistory,
  deleteManyHistory,
  getHistory,
} from "../Controllers/HistoryController.js";
import AdvanceResult from "../midleware/AdvanceResult.js";
import HistoryModel from "../models/HistoryModel.js";

const HistoryRoute = express.Router();
HistoryRoute.use(Protect);

//CREATE AND GET HISTORY 🎯 ✅✅
HistoryRoute.route("/")
  .post(createHistory)
  .get(
    AdvanceResult(HistoryModel, [{ path: "videoId" }, { path: "userId" }], {
      status: "private",
    }),
    getHistory
  );

//DELETE SINGLE HISTORY 🎯 ✅✅
HistoryRoute.route("/:id").delete(DeleteHistory);

//DELETE ALL HISTORY ROUTE 🎯 ✅✅
HistoryRoute.route("/:type/all").delete(deleteManyHistory);

export default HistoryRoute;
