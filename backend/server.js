import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postsRoute from "./routes/postRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

import connectMongoDb from "./db/connectMongoDb.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: "dvhnvi8ov",
  api_key: 538961887128492,
  api_secret: "es3dl48hqqFFrbn9Y7P5ooTINzg",
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
