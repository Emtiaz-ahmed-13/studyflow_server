import express from "express";
import auth from "../../middleware/auth";
import { NotificationController } from "./notification.controllers";

const router = express.Router();

// Get user's notifications
router.get("/", auth(), NotificationController.getMyNotifications);

// Mark notification as read
router.patch("/:id/read", auth(), NotificationController.markNotificationAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", auth(), NotificationController.markAllAsRead);

// Delete notification
router.delete("/:id", auth(), NotificationController.deleteNotification);

export const NotificationRoutes = router;
