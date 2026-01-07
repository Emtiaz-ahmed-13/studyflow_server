"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = exports.emitFocusUpdate = exports.emitStreakUpdate = exports.emitNotification = exports.broadcastToRoom = exports.broadcastToUser = void 0;
const socket_config_1 = require("../../config/socket.config");
/**
 * Real-time service for broadcasting events
 */
/**
 * Broadcast event to a specific user
 */
const broadcastToUser = (userId, event, data) => {
    const io = (0, socket_config_1.getIO)();
    io.to(`user:${userId}`).emit(event, data);
};
exports.broadcastToUser = broadcastToUser;
/**
 * Broadcast event to a room (e.g., study group)
 */
const broadcastToRoom = (roomId, event, data) => {
    const io = (0, socket_config_1.getIO)();
    io.to(`group:${roomId}`).emit(event, data);
};
exports.broadcastToRoom = broadcastToRoom;
/**
 * Emit real-time notification to user
 */
const emitNotification = (userId, notification) => {
    (0, exports.broadcastToUser)(userId, "notification:new", notification);
};
exports.emitNotification = emitNotification;
/**
 * Emit streak update to user
 */
const emitStreakUpdate = (userId, streakData) => {
    (0, exports.broadcastToUser)(userId, "streak:update", streakData);
};
exports.emitStreakUpdate = emitStreakUpdate;
/**
 * Emit focus session update
 */
const emitFocusUpdate = (userId, focusData) => {
    (0, exports.broadcastToUser)(userId, "focus:update", focusData);
};
exports.emitFocusUpdate = emitFocusUpdate;
exports.RealtimeService = {
    broadcastToUser: exports.broadcastToUser,
    broadcastToRoom: exports.broadcastToRoom,
    emitNotification: exports.emitNotification,
    emitStreakUpdate: exports.emitStreakUpdate,
    emitFocusUpdate: exports.emitFocusUpdate,
};
