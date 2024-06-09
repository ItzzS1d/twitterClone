import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationmodel.js";
import { v2 as cloudinary } from "cloudinary";
import { isValidObjectId } from "mongoose";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (error) {
    console.log("error in getAllPosts " + error);
    return res.status(500).json({ error: error.message });
  }
};
export const getfollowingPosts = async (req, res) => {
  try {
    if (!isValidObjectId(req.user.id))
      return res.status(404).json({ error: "Invalid user id" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const posts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (error) {
    console.log("error in getfollowingPosts " + error);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    const posts = await Post.find({ user: user.id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (error) {
    console.log("error in getfollowingPosts " + error);
    return res.status(500).json({ error: error.message });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ error: "Invalid user id" });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const posts = await Post.find({ likes: user.id })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (error) {
    console.log("error in getLikedPosts " + error);
    return res.status(500).json({ error: error.message });
  }
};
export const createPost = async (req, res) => {
  try {
    let { text, img } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!text && !img)
      return res.status(400).json({ error: "post must have text or image" });
    if (img) {
      const result = await cloudinary.uploader.upload(img);
      img = result.secure_url;
    }
    const newPost = await Post.create({ user: user.id, text, img });
    return res.status(201).json(newPost);
  } catch (error) {
    console.log("error in createPostController " + error);
    return res.status(500).json({ error: error.message });
  }
};
export const likeUnLikePost = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ error: "Invalid post id" });
    const post = await Post.findById(req.params.id);
    if (post.id === req.user.id)
      return res.status(400).json({ error: "you can't like your own posts" });
    if (!post) return res.status(404).json({ error: "post not found" });
    const isLiked = post.likes.includes(req.user.id);
    if (isLiked) {
      //unlike post
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user.id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { likedPosts: post.id },
      });
      return res.status(200).json({ message: "unliked successfully" });
    } else {
      //like post
      await Post.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user.id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { likedPosts: post.id },
      });
      await Notification.create({
        from: req.user.id,
        to: post.user,
        type: "like",
        read: false,
      });
      return res.status(200).json({ message: "liked successfully" });
    }
  } catch (error) {
    console.log("error on likeUnLikePostController " + error);
    return res.status(500).json({ error: error.message });
  }
};
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    if (!text) return res.status(400).json({ error: "comment must have text" });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "post not found" });
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("error on commentOnPostController " + error);
    return res.status(500).json({ error: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(404).json({ error: "Invalid post id" });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ error: "You can't delete this post" });
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "post deleted" });
  } catch (error) {
    console.log("error in deletePostController " + error);
    return res.status(500).json({ error: error.message });
  }
};
