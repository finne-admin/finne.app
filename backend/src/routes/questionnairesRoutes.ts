import express from "express"
import {
  listQuestionnaires,
  getUserResponses,
  respondQuestionnaire,
  getPendingQuestionnaires,
    insertQuestionnaireSubmission

} from "../controllers/questionnairesController"

const router = express.Router()

router.get("/list", listQuestionnaires)
router.get("/responses", getUserResponses)
router.post("/respond", respondQuestionnaire)
router.get("/pending", getPendingQuestionnaires)
router.post("/submit", insertQuestionnaireSubmission)

export default router

// ruta: backend\src\routes\questionnairesRoutes.ts