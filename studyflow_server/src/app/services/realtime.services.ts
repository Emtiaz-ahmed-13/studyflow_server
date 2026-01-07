import { getIO } from "../../config/socket.config";

/**
 * Real-time service for broadcasting events
 */

/**
 * Broadcast event to a specific user
 */
export const broadcastToUser = (userId: string, event: string, data: any) => {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
};

/**
 * Broadcast event to a room (e.g., study group)
 */
export const broadcastToRoom = (roomId: string, event: string, data: any) => {
    const io = getIO();
    io.to(`group:${roomId}`).emit(event, data);
};

/**
 * Emit real-time notification to user
 */
export const emitNotification = (userId: string, notification: any) => {
    broadcastToUser(userId, "notification:new", notification);
};

/**
 * Emit streak update to user
 */
export const emitStreakUpdate = (userId: string, streakData: any) => {
    broadcastToUser(userId, "streak:update", streakData);
};

/**
 * Emit focus session update
 */
export const emitFocusUpdate = (userId: string, focusData: any) => {
    broadcastToUser(userId, "focus:update", focusData);
};

export const RealtimeService = {
    broadcastToUser,
    broadcastToRoom,
    emitNotification,
    emitStreakUpdate,
    emitFocusUpdate,
};
