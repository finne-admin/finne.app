import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import { createErrorReportController } from "../controllers/reportController"

const router = Router()

router.post("/", requireAuth, createErrorReportController)

export default router
