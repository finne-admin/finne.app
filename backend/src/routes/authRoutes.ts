import { Router } from "express";
import {
  registerUser,
  registerAdmin,
  loginUser,
  verifyToken,
} from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);
router.post("/verify", verifyToken);

export default router;
