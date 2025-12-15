import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import {
  acceptPauseInviteController,
  createPauseInviteController,
  getPendingInvitesController,
  getSentInvitesController,
  cancelSentInviteController,
  createShareLinkController,
  useShareLinkController,
  declinePauseInviteController,
  getDepartmentUsersController,
} from "../controllers/socialController"

const router = Router()

router.get("/department-users", requireAuth, getDepartmentUsersController)
router.post("/invites", requireAuth, createPauseInviteController)
router.get("/invites", requireAuth, getPendingInvitesController)
router.get("/invites/sent", requireAuth, getSentInvitesController)
router.post("/invites/:id/accept", requireAuth, acceptPauseInviteController)
router.post("/invites/:id/decline", requireAuth, declinePauseInviteController)
router.post("/invites/:id/cancel", requireAuth, cancelSentInviteController)

router.post("/shares", requireAuth, createShareLinkController)
router.post("/shares/:token/use", requireAuth, useShareLinkController)

export default router
