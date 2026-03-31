import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import {
  getCurrentAnnouncementController,
  markAnnouncementReadController,
} from "../controllers/announcementController"

const router = Router()

router.get("/current", requireAuth, getCurrentAnnouncementController)
router.put("/:id/read", requireAuth, markAnnouncementReadController)

export default router
