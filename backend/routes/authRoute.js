import express from "express";
import { getUser, logIn, logOut, signUp } from "../controllers/authController.js";
import { protectedRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/me",protectedRoute , getUser);
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
