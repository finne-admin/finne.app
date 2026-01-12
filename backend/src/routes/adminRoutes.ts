import express from "express";
import multer from "multer";
import fs from "fs";
import {
  listUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  approveUserRequest,
  rejectUserRequest,
  listJoinCodesController,
  createJoinCodeController,
  deleteJoinCodeController,
  createOrganizationController,
  createDepartmentController,
  updateOrganizationDailyLimitController,
  getOrganizationStructure,
  listRolesController,
  updateUserRoleController,
  updateUserMembershipController,
  listOrganizationNotificationDefaults,
  updateOrganizationNotificationDefaults,
  getExerciseSatisfaction,
} from "../controllers/adminController";
import {
  deleteRewardDefinitionController,
  listRewardDefinitionsController,
  upsertRewardDefinitionController,
  uploadRewardImageController,
} from "../controllers/rewardController";
import { requireAuth, requireOrganizationAdmin, requireSuperAdmin } from "../middlewares/verifyToken";

const router = express.Router();
try { fs.mkdirSync("/tmp/uploads", { recursive: true }); } catch {}
const upload = multer({ dest: "/tmp/uploads/" })

router.use(requireAuth, requireOrganizationAdmin);

router.get("/users", listUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/password", changeUserPassword);
router.post("/users/:id/approve", approveUserRequest);
router.post("/users/:id/reject", rejectUserRequest);
router.put("/users/:id/role", requireSuperAdmin, updateUserRoleController);
router.put("/users/:id/membership", requireSuperAdmin, updateUserMembershipController);
router.get("/join-codes", requireSuperAdmin, listJoinCodesController);
router.post("/join-codes", requireSuperAdmin, createJoinCodeController);
router.delete("/join-codes/:id", requireSuperAdmin, deleteJoinCodeController);
router.post("/organizations", requireSuperAdmin, createOrganizationController);
router.put("/organizations/:id/daily-limit", requireSuperAdmin, updateOrganizationDailyLimitController);
router.post("/departments", requireSuperAdmin, createDepartmentController);
router.get("/org-structure", requireSuperAdmin, getOrganizationStructure);
router.get(
  "/notification-defaults",
  requireSuperAdmin,
  listOrganizationNotificationDefaults
);
router.put(
  "/notification-defaults/:organizationId",
  requireSuperAdmin,
  updateOrganizationNotificationDefaults
);
router.get("/roles", requireSuperAdmin, listRolesController);
router.get("/exercise-satisfaction", getExerciseSatisfaction);
router.get("/rewards", requireSuperAdmin, listRewardDefinitionsController);
router.post("/rewards", requireSuperAdmin, upsertRewardDefinitionController);
router.delete("/rewards/:id", requireSuperAdmin, deleteRewardDefinitionController);
router.post(
  "/rewards/upload",
  requireSuperAdmin,
  upload.single("file"),
  uploadRewardImageController
);

export default router;
