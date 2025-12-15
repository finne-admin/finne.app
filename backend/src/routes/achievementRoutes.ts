import express from "express";
import { requireAuth } from "../middlewares/verifyToken";
import { checkAchievementsController } from "../controllers/achievementController";

const router = express.Router();

router.post("/check", requireAuth, checkAchievementsController);

export default router;
