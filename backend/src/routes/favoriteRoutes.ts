import { Router } from "express"
import { requireAuth } from "../middlewares/verifyToken"
import { addFavorite, listFavorites, removeFavorite } from "../controllers/favoriteController"

const router = Router()

router.use(requireAuth)
router.get("/", listFavorites)
router.post("/", addFavorite)
router.delete("/", removeFavorite)

export default router
