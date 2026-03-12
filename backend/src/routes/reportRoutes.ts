import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import {
  createErrorReportController,
  listMyErrorReportsController,
  markMyErrorReportReadController,
} from "../controllers/reportController"

const router = Router()

router.post("/", requireAuth, createErrorReportController)
router.get("/", requireAuth, listMyErrorReportsController)
router.put("/:id/read", requireAuth, markMyErrorReportReadController)

export default router
