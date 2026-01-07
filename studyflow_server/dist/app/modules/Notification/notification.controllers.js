"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const notification_services_1 = require("./notification.services");
/**
 * Get user's notifications
 */
const getMyNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { isRead, type, page, limit } = req.query;
    const result = yield notification_services_1.NotificationService.getUserNotifications({
        userId,
        isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
        type: type,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notifications retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/**
 * Mark notification as read
 */
const markNotificationAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield notification_services_1.NotificationService.markAsRead(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notification marked as read",
        data: result,
    });
}));
/**
 * Mark all notifications as read
 */
const markAllAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield notification_services_1.NotificationService.markAllAsRead(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All notifications marked as read",
        data: result,
    });
}));
/**
 * Delete a notification
 */
const deleteNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield notification_services_1.NotificationService.deleteNotification(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.NotificationController = {
    getMyNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
};
