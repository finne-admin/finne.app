import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import {
  calculateGoalController,
  claimAchievementController,
  claimWeeklyChallengeController,
  getAllAchievementsController,
  getDepartmentProgressController,
  getMilestonesSummary,
  getRankingController,
  getUnclaimedCountsController,
  getUnlockedAchievementsController,
  getWeeklyActivity,
  getWeeklyChallengesController,
  getWeeklyChallengesCatalogController,
  postWeeklyChallengeProgressController,
} from "../controllers/milestonesController"

const router = Router()

router.get("/summary", requireAuth, getMilestonesSummary)
router.get("/weekly-activity", requireAuth, getWeeklyActivity)
router.get("/achievements/unlocked", requireAuth, getUnlockedAchievementsController)
router.get("/achievements/all", requireAuth, getAllAchievementsController)
router.post("/achievements/:id/claim", requireAuth, claimAchievementController)
router.get("/weekly-challenges", requireAuth, getWeeklyChallengesController)
router.get("/weekly-challenges/catalog", requireAuth, getWeeklyChallengesCatalogController)
router.post("/weekly-challenges/progress", requireAuth, postWeeklyChallengeProgressController)
router.post("/weekly-challenges/:id/claim", requireAuth, claimWeeklyChallengeController)
router.get("/unclaimed-counts", requireAuth, getUnclaimedCountsController)
router.get("/department/progress", requireAuth, getDepartmentProgressController)
router.get("/ranking", requireAuth, getRankingController)
router.post("/goals/calc", requireAuth, calculateGoalController)

export default router
