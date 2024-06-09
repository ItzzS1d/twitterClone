import express from "express";
import { protectedRoute } from "../middleware/protectRoute.js";
import { getUserProfile , followUnFollowUser, getSuggestedUsers , updateUserProfile } from "../controllers/userController.js";
const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/suggested",protectedRoute, getSuggestedUsers);
router.post("/follow/:id",protectedRoute , followUnFollowUser);
router.post("/update", protectedRoute, updateUserProfile);
export default router;
