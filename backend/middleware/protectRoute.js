import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const protectedRoute = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)

  try {
    if (!token) {
      return res.status(401).json({
        error: "No token, authorization denied",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(401).json({ error: "Token is not valid" });
      }
      const user = await User.findById(decoded.id).select("-password");
      console.log(user)
      if (!user) return res.status(404).json({ error: "User not found" });
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
