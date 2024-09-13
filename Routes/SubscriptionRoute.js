import express from "express";
import { Protect } from "../midleware/AuthMiddleware.js";
import {
  checkSubscription,
  createSubscriber,
  getSubscribers,
} from "../Controllers/SubsriptionController.js";
import AdvanceResult from "../midleware/AdvanceResult.js";
import SubscriptionModel from "../models/SubscriptionModel.js";

const SubscriptionRoute = express.Router();

//CREATE SUBSCRIBER ROUTE
SubscriptionRoute.post("/", Protect, createSubscriber);

//CHECK SUBSCRIBER ROUTE
SubscriptionRoute.post("/check", Protect, checkSubscription);

//GET SUBSCRIBERED DATA
SubscriptionRoute.get("/subsribers", Protect, getSubscribers);
export default SubscriptionRoute;

//😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢
