import express from "express"
import multer from "multer"
import fs from "fs"
import {
  listUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  approveUserRequest,
  rejectUserRequest,
  listRolesController,
  updateUserRoleController,
  updateUserMembershipController,
  addManualXpController,
} from "../controllers/admin/adminUsersController"
import {
  listJoinCodesController,
  createJoinCodeController,
  deleteJoinCodeController,
} from "../controllers/admin/adminJoinCodesController"
import {
  createOrganizationController,
  createDepartmentController,
  updateOrganizationDailyLimitController,
  listOrganizationSeasonTimers,
  updateOrganizationSeasonTimer,
  getOrganizationStructure,
} from "../controllers/admin/adminOrganizationsController"
import {
  listOrganizationNotificationDefaults,
  updateOrganizationNotificationDefaults,
} from "../controllers/admin/adminNotificationsController"
import {
  getExerciseSatisfaction,
  resetOrganizationDataController,
} from "../controllers/admin/adminMaintenanceController"
import {
  listErrorReportsController,
  updateErrorReportStatusController,
  uploadAdminReportAttachmentController,
} from "../controllers/reportController"
import {
  deleteRewardDefinitionController,
  listRaffleThresholdsController,
  listRewardDefinitionsController,
  replaceRaffleThresholdsController,
  upsertRewardDefinitionController,
  uploadRewardImageController,
  drawRaffleRewardController,
} from "../controllers/rewardController"
import {
  listAnnouncementsController,
  upsertAnnouncementController,
} from "../controllers/announcementController"
import {
  getOrganizationCalendarController,
  listOrganizationCalendarController,
  updateOrganizationCalendarController,
} from "../controllers/admin/adminCalendarController"
import { requireAuth, requireOrganizationAdmin, requireSuperAdmin } from "../middlewares/verifyToken"

const router = express.Router()
try { fs.mkdirSync("/tmp/uploads", { recursive: true }) } catch {}
const upload = multer({ dest: "/tmp/uploads/" })

router.use(requireAuth, requireOrganizationAdmin)

router.get("/users", listUsers)
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)
router.post("/users/:id/password", changeUserPassword)
router.post("/users/:id/approve", approveUserRequest)
router.post("/users/:id/reject", rejectUserRequest)
router.post("/users/:id/xp", requireSuperAdmin, addManualXpController)
router.put("/users/:id/role", requireSuperAdmin, updateUserRoleController)
router.put("/users/:id/membership", requireSuperAdmin, updateUserMembershipController)
router.get("/join-codes", requireSuperAdmin, listJoinCodesController)
router.post("/join-codes", requireSuperAdmin, createJoinCodeController)
router.delete("/join-codes/:id", requireSuperAdmin, deleteJoinCodeController)
router.post("/organizations", requireSuperAdmin, createOrganizationController)
router.put("/organizations/:id/daily-limit", requireSuperAdmin, updateOrganizationDailyLimitController)
router.get("/season-timers", requireSuperAdmin, listOrganizationSeasonTimers)
router.put("/season-timers/:organizationId", requireSuperAdmin, updateOrganizationSeasonTimer)
router.post("/departments", requireSuperAdmin, createDepartmentController)
router.get("/org-structure", requireSuperAdmin, getOrganizationStructure)
router.get("/notification-defaults", requireSuperAdmin, listOrganizationNotificationDefaults)
router.put(
  "/notification-defaults/:organizationId",
  requireSuperAdmin,
  updateOrganizationNotificationDefaults
)
router.post("/reset", requireSuperAdmin, resetOrganizationDataController)
router.get("/roles", requireSuperAdmin, listRolesController)
router.get("/exercise-satisfaction", getExerciseSatisfaction)
router.get("/reports", requireSuperAdmin, listErrorReportsController)
router.put("/reports/:id/status", requireSuperAdmin, updateErrorReportStatusController)
router.post("/reports/upload", requireSuperAdmin, upload.single("file"), uploadAdminReportAttachmentController)
router.get("/rewards", requireSuperAdmin, listRewardDefinitionsController)
router.post("/rewards", requireSuperAdmin, upsertRewardDefinitionController)
router.delete("/rewards/:id", requireSuperAdmin, deleteRewardDefinitionController)
router.get("/rewards/thresholds/:organizationId", requireSuperAdmin, listRaffleThresholdsController)
router.put("/rewards/thresholds/:organizationId", requireSuperAdmin, replaceRaffleThresholdsController)
router.post("/rewards/raffle/draw", drawRaffleRewardController)
router.post(
  "/rewards/upload",
  requireSuperAdmin,
  upload.single("file"),
  uploadRewardImageController
)
router.get("/announcements", requireSuperAdmin, listAnnouncementsController)
router.post("/announcements", requireSuperAdmin, upsertAnnouncementController)
router.put("/announcements/:id", requireSuperAdmin, upsertAnnouncementController)
router.get("/calendar", requireSuperAdmin, listOrganizationCalendarController)
router.get("/calendar/:organizationId", requireSuperAdmin, getOrganizationCalendarController)
router.put("/calendar/:organizationId", requireSuperAdmin, updateOrganizationCalendarController)

export default router
