import express from "express"
import {
  resolveVideoIds,
  insertActivePause,
  updateActivePauseSatisfaction,
} from "../controllers/activePauseController"
import { requireAuth } from "../middlewares/verifyToken"

const router = express.Router()

/**
 * @route POST /api/active-pauses/resolve-videos
 * @desc Devuelve los IDs internos de los videos a partir de sus hashes de Wistia
 * @body { hashes: string[] } o { video_hashes: string[] }
 */
router.post("/resolve-videos", requireAuth, resolveVideoIds)

/**
 * @route POST /api/active-pauses
 * @desc Inserta una nueva pausa activa del usuario autenticado
 * @body { video1_id: string, video2_id: string }
 */
router.post("/", requireAuth, insertActivePause)

router.patch("/:id", requireAuth, updateActivePauseSatisfaction)


export default router
