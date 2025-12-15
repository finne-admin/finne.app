import { Router } from "express";
import {
  getGlobalStatisticsController,
  getScopedStatisticsController,
  getUserStatisticsController,
  getUserStatisticsForAdminController,
} from "../controllers/statisticsController";
import { requireAuth, requireOrganizationAdmin, requireSuperAdmin } from "../middlewares/verifyToken";

const router = Router();

router.get("/", requireAuth, getUserStatisticsController);
router.get("/overview", requireAuth, getScopedStatisticsController);
router.get("/global", requireAuth, requireSuperAdmin, getGlobalStatisticsController);
router.get("/users/:userId", requireAuth, requireOrganizationAdmin, getUserStatisticsForAdminController);

export default router;
