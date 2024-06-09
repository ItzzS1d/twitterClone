import { gereateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
export const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email format" });

    const existUsername = await User.findOne({ username });
    if (existUsername)
      return res.status(400).json({ error: "Username is already taken" });
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(400).json({ error: "email is already taken" });
    const newUser = await User.create({ fullName, username, email, password });
    if (newUser) gereateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      bio: newUser.bio,
      coverImg: newUser.coverImg,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
export const logIn = async (req, res) => {
  try {
    const {username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username or password" });
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });
    gereateTokenAndSetCookie(user.id, res);
    return res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      bio: user.bio,
      coverImg: user.coverImg,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
export const logOut = async (req, res) => {
  try {
    const cookie = req.cookies.jwt
  if(!cookie) return
  res.clearCookie("jwt")
  res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}