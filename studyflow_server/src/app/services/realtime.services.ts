import { getIO } from "../../config/socket.config";
export const broadcastToUser = (userId: string, event: string, data: any) => {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
};
export const broadcastToRoom = (roomId: string, event: string, data: any) => {
    const io = getIO();
    io.to(`group:${roomId}`).emit(event, data);
};

export const emitNotification = (userId: string, notification: any) => {
    broadcastToUser(userId, "notification:new", notification);
};

export const emitStreakUpdate = (userId: string, streakData: any) => {
    broadcastToUser(userId, "streak:update", streakData);
};
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
