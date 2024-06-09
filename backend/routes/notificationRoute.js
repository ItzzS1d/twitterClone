import express from "express";
import { protectedRoute } from "../middleware/protectRoute.js";
import { getNotications , deleteNotications,  } from "../controllers/notificationController.js";
const router = express.Router();

router.get("/" , protectedRoute , getNotications)
router.delete("/" , protectedRoute , deleteNotications)
// router.delete("/:id" , protectedRoute , deleteNotication)

export default router;