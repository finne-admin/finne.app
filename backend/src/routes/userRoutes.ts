import express from "express"
import fs from "fs"
import multer from "multer"
import { updateUserProfile, updateAvatarUrlController, uploadAvatarController } from "../controllers/userController"
import { requireAuth } from "../middlewares/verifyToken"

const router = express.Router()
try { fs.mkdirSync("/tmp/uploads", { recursive: true }); } catch {}
const upload = multer({ dest: "/tmp/uploads/" })

// PUT /api/user/update
router.put("/update", updateUserProfile)
router.put("/avatar", requireAuth, updateAvatarUrlController)
router.post("/avatar/upload", requireAuth, upload.single("file"), uploadAvatarController)

export default router
