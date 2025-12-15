import { Router } from "express"
import { getPublicTickerController } from "../controllers/systemController"

const router = Router()

router.get("/global-ticker", getPublicTickerController)

export default router
