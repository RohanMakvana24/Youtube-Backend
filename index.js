import express from "express";
import dotenv from "dotenv";
import path from "path";
import DBConnect from "./config/db.js";
import colors from "colors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSenetize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import hpp from "hpp";
import HandleGlobalErorr from "./midleware/ErrorMidleware.js";
import AuthRoute from "./Routes/AuthRoute.js";
import cloudinary from "cloudinary";
import CategoryRoute from "./Routes/categoriesRoute.js";
import VideoRoute from "./Routes/VideoRoute.js";
import CommentRoute from "./Routes/CommentRoute.js";
import ReplyRoute from "./Routes/ReplyRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import SubscriptionRoute from "./Routes/SubscriptionRoute.js";
import FeelingRoute from "./Routes/FeelingRoute.js";
import SearchRoute from "./Routes/SearchRoute.js";
import HistoryRoute from "./Routes/HistoryRoute.js";
//dotenv config
dotenv.config({ path: "./config/.env" });

//database config
DBConnect();
//Cloudinary Config
cloudinary.v2.config({
  cloud_name: "ds7xjkkhg",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//server setup
const server = express();
const port = process.env.PORT;

//midleware
server.use(express.json());
if (process.env.NODE_ENV === "devlopment") {
  server.use(morgan("dev"));
}
server.use(cookieParser());
server.use(mongoSenetize());
server.use(helmet());
server.use(xss());
server.use(cors());
server.use(hpp());
// Set timeout for requests (e.g., 10 minutes)
server.use((req, res, next) => {
  req.setTimeout(10 * 60 * 1000); // 10 minutes
  res.setTimeout(10 * 60 * 1000); // 10 minutes
  next();
});
//Routes
const versionOne = (routename) => `/api/v1/${routename}`;
server.use(versionOne("auth"), AuthRoute);
server.use(versionOne("category"), CategoryRoute);
server.use(versionOne("video"), VideoRoute);
server.use(versionOne("comment"), CommentRoute);
server.use(versionOne("replies"), ReplyRoute);
server.use(versionOne("user"), UserRoute);
server.use(versionOne("subscription"), SubscriptionRoute);
server.use(versionOne("feelings"), FeelingRoute);
server.use(versionOne("search"), SearchRoute);
server.use(versionOne("history"), HistoryRoute);

server.use(HandleGlobalErorr);
//server listen
server.listen(port, () => {
  console.log(`Server Listining on port : ${port} 🥰`.underline.blue);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
