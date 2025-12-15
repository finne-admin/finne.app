import { Router } from "express";
import {
  registerUser,
  registerAdmin,
  loginUser,
  verifyToken,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/verifyToken";

const router = Router();

router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);
router.post("/verify", verifyToken);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", requireAuth, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
