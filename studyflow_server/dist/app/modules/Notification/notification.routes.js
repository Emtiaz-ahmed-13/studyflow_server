"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const notification_controllers_1 = require("./notification.controllers");
const router = express_1.default.Router();
// Get user's notifications
router.get("/", (0, auth_1.default)(), notification_controllers_1.NotificationController.getMyNotifications);
// Mark notification as read
router.patch("/:id/read", (0, auth_1.default)(), notification_controllers_1.NotificationController.markNotificationAsRead);
// Mark all notifications as read
router.patch("/mark-all-read", (0, auth_1.default)(), notification_controllers_1.NotificationController.markAllAsRead);
// Delete notification
router.delete("/:id", (0, auth_1.default)(), notification_controllers_1.NotificationController.deleteNotification);
exports.NotificationRoutes = router;
