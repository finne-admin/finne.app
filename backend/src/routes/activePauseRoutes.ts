import express from "express"
import {
  resolveVideoIds,
  insertActivePause,
    updateActivePauseSatisfaction,
} from "../controllers/activePauseController"

const router = express.Router()

/**
 * @route POST /api/active-pauses/resolve-videos
 * @desc Devuelve los IDs internos de los vídeos a partir de sus hashes de Wistia
 * @body { hashes: string[] } o { video_hashes: string[] }
 */
router.post("/resolve-videos", resolveVideoIds)

/**
 * @route POST /api/active-pauses
 * @desc Inserta una nueva pausa activa del usuario
 * @body { user_id: string, video1_id: string, video2_id: string }
 */
router.post("/", insertActivePause)

router.patch("/:id", updateActivePauseSatisfaction)


export default router
