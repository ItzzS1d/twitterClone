import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import Notification from "../models/notificationmodel.js";
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnFollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user.id);
    if (id === req.user.id)
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow yourself" });
    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user.id } });
      await User.findByIdAndUpdate(req.user.id, { $pull: { following: id } });
      const newNotification = await Notification.create({
        from: userToModify.id,
        to: req.user.id,
        type: "follow",
      });
      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user.id } });
      await User.findByIdAndUpdate(req.user.id, { $push: { following: id } });
      const newNotification = await Notification.create({
        from: req.user.id,
        to: userToModify.id,
        type: "follow",
      });
      //TODO return the id of the user as response
      res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnFollowUser", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user.id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("error in getSuggestedUsers", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const currentUser = req.user.id;
  const { fullName, email, username, bio, link, currentPassword, newPassword } =
    req.body;

  let { profileImg, coverImg } = req.body;
  try {
    let user = await User.findById(currentUser);
    if (!user) return res.status(404).json({ error: "User not found" });
    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res
        .status(400)
        .json({ error: "Please provide both currentPassword and newPassword" });
    if (currentPassword && newPassword) {
      const isMatched = await bcrypt.compare(currentPassword, user.password);

      if (!isMatched) return res.status(400).json({ error: "Wrong password" });
      //pw hashed
    }
    if (profileImg) {
      if (user.profileImg)
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      const result = await cloudinary.uploader.upload(profileImg);
      user.profileImg = result.secure_url;
    }
    if (coverImg) {
      if (user.coverImg)
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      const result = await cloudinary.uploader.upload(coverImg);
      user.coverImg = result.secure_url;
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user = await user.save();
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log("error in updateUserProfile", error.message);
    return res.status(500).json({ error: error.message });
  }
};
