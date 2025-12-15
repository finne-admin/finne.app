import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import { getUserCategoryCounts } from "../controllers/exerciseController"

const router = Router()

router.get("/categories", requireAuth, getUserCategoryCounts)

export default router
