import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const app = express();
const port = process.env.PORT || process.env.PORT_TWO;
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postsRoute from "./routes/postRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

import connectMongoDb from "./db/connectMongoDb.js";
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postsRoute);
app.use("/api/notification", notificationRoute);
app.listen(port, () => {
  connectMongoDb();
  console.log(`Express server started on port ${port}`);
});
