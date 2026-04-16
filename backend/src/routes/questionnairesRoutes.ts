import express from "express"
import {
  listQuestionnaires,
  getUserResponses,
  respondQuestionnaire,
  getPendingQuestionnaires,
  insertQuestionnaireSubmission,
  updateQuestionnaireActiveController,
  resetQuestionnaireResponsesController
} from "../controllers/questionnairesController"
import { requireAuth, requireSuperAdmin } from "../middlewares/verifyToken"

const router = express.Router()

router.get("/list", listQuestionnaires)
router.get("/responses", getUserResponses)
router.post("/respond", respondQuestionnaire)
router.get("/pending", getPendingQuestionnaires)
router.post("/submit", insertQuestionnaireSubmission)
router.put("/:id/active", requireAuth, requireSuperAdmin, updateQuestionnaireActiveController)
router.put("/:id/reset", requireAuth, requireSuperAdmin, resetQuestionnaireResponsesController)

export default router

// ruta: backend\src\routes\questionnairesRoutes.ts
