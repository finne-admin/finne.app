import { Router } from "express"
import multer from "multer"
import fs from "fs"
import { requireAuth } from "../middlewares/verifyToken"
import {
  createErrorReportController,
  listMyErrorReportsController,
  markMyErrorReportReadController,
  uploadReportAttachmentController,
} from "../controllers/reportController"

const router = Router()
try { fs.mkdirSync("/tmp/uploads", { recursive: true }) } catch {}
const upload = multer({ dest: "/tmp/uploads/", limits: { fileSize: 8 * 1024 * 1024 } })

router.post("/", requireAuth, createErrorReportController)
router.post("/upload", requireAuth, upload.single("file"), uploadReportAttachmentController)
router.get("/", requireAuth, listMyErrorReportsController)
router.put("/:id/read", requireAuth, markMyErrorReportReadController)

export default router
