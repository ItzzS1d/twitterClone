import express from "express";
import { protectedRoute } from "../middleware/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getUserPosts,
  likeUnLikePost,
  getAllPosts,
  getLikedPosts,
  getfollowingPosts,
} from "../controllers/postController.js";
const router = express.Router();

router.get("/", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getfollowingPosts);
router.get("/user/:username", protectedRoute, getUserPosts);

router.get("/likedposts/:id", protectedRoute, getLikedPosts);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnLikePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
