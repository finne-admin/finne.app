import express from "express"
import { getTagsByVideoHashes } from "../controllers/tagsController"

const router = express.Router()

router.post("/", getTagsByVideoHashes)

export default router
