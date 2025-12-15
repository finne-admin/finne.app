import express from "express"
import { requireAuth } from "../middlewares/verifyToken"
import {
  getNotificationPreferences,
  upsertNotificationPreferences,
  deleteNotificationPreferences,
} from "../controllers/notificationController"
import { saveFcmToken, deleteFcmToken } from "../controllers/fcmTokensController"

const router = express.Router()

// GET /api/notifications/preferences
router.get("/preferences",requireAuth, getNotificationPreferences)

// PUT /api/notifications/preferences
router.put("/preferences",requireAuth, upsertNotificationPreferences)

// DELETE /api/notifications/preferences
router.delete("/preferences",requireAuth, deleteNotificationPreferences)

router.post("/tokens", requireAuth, saveFcmToken)
router.delete("/tokens", requireAuth, deleteFcmToken)

export default router
