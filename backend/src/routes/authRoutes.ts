import { Router } from "express";
import {
  registerUser,
  registerAdmin,
  loginUser,
  verifyToken,
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);
router.post("/verify", verifyToken);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
