import express from "express"
import { updateUserProfile } from "../controllers/userController"

const router = express.Router()

// PUT /api/user/update
router.put("/update", updateUserProfile)

export default router
