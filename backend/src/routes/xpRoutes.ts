import express from "express"
import { addXP, getXpHistoryController } from "../controllers/xpController"
import { requireAuth } from "../middlewares/verifyToken"

const router = express.Router()

router.post("/add", addXP)
router.get("/history", requireAuth, getXpHistoryController)

export default router
