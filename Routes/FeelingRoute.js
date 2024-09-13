import express, { Router } from "express";
import { Protect } from "../midleware/AuthMiddleware.js";
import {
  CheckFeeling,
  createFeelings,
  getLikedVideo,
} from "../Controllers/FeelingController.js";

const FeelingRoute = express.Router();
FeelingRoute.use(Protect);

//CREATE FEELING ROUTE🎆 ✅✅
FeelingRoute.post("/", createFeelings);
//CHECK FEWLING ROUTE 🎆 ✅✅
FeelingRoute.post("/check", CheckFeeling);
//GET LIKE VIDEO 🎆 ✅✅
FeelingRoute.post("/video", getLikedVideo);
export default FeelingRoute;
