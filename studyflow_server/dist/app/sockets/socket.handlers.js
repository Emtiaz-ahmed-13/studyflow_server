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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
/**
 * Handle Socket.IO connections and events
 */
const handleSocketConnection = (socket) => {
    const user = socket.data.user;
    console.log(`✅ User connected: ${user.userId} (${user.email})`);
    // Join user to their personal room
    socket.join(`user:${user.userId}`);
    // Focus Session Events
    socket.on("focus:start", (data) => {
        handleFocusStart(socket, data);
    });
    socket.on("focus:pause", (data) => {
        handleFocusPause(socket, data);
    });
    socket.on("focus:resume", (data) => {
        handleFocusResume(socket, data);
    });
    socket.on("focus:complete", (data) => {
        handleFocusComplete(socket, data);
    });
    // Streak Events
    socket.on("streak:check", () => {
        handleStreakCheck(socket);
    });
    // Study Group Events
    socket.on("group:join", (groupId) => {
        socket.join(`group:${groupId}`);
        socket.to(`group:${groupId}`).emit("group:user-joined", {
            userId: user.userId,
            userName: user.name,
        });
    });
    socket.on("group:leave", (groupId) => {
        socket.leave(`group:${groupId}`);
        socket.to(`group:${groupId}`).emit("group:user-left", {
            userId: user.userId,
            userName: user.name,
        });
    });
    socket.on("group:message", (data) => {
        socket.to(`group:${data.groupId}`).emit("group:new-message", {
            userId: user.userId,
            userName: user.name,
            message: data.message,
            timestamp: new Date(),
        });
    });
    // Disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${user.userId}`);
    });
};
exports.handleSocketConnection = handleSocketConnection;
/**
 * Focus session handlers
 */
let focusTimers = new Map();
const handleFocusStart = (socket, data) => {
    const user = socket.data.user;
    const { duration, type } = data;
    console.log(`⏱️  Focus session started: ${user.userId} - ${type} (${duration} min)`);
    // Clear any existing timer
    if (focusTimers.has(user.userId)) {
        clearInterval(focusTimers.get(user.userId));
    }
    let remainingTime = duration * 60; // Convert to seconds
    const timer = setInterval(() => {
        remainingTime--;
        socket.emit("focus:tick", {
            remainingTime,
            duration: duration * 60,
            type,
        });
        if (remainingTime <= 0) {
            clearInterval(timer);
            focusTimers.delete(user.userId);
            socket.emit("focus:completed", {
                duration,
                type,
                completedAt: new Date(),
            });
        }
    }, 1000);
    focusTimers.set(user.userId, timer);
    socket.emit("focus:started", {
        duration,
        type,
        startedAt: new Date(),
    });
};
const handleFocusPause = (socket, data) => {
    const user = socket.data.user;
    if (focusTimers.has(user.userId)) {
        clearInterval(focusTimers.get(user.userId));
        focusTimers.delete(user.userId);
        socket.emit("focus:paused", {
            pausedAt: new Date(),
        });
    }
};
const handleFocusResume = (socket, data) => {
    const user = socket.data.user;
    const { remainingTime: initialTime, type } = data;
    let remainingTime = initialTime;
    const timer = setInterval(() => {
        remainingTime--;
        socket.emit("focus:tick", {
            remainingTime,
            type,
        });
        if (remainingTime <= 0) {
            clearInterval(timer);
            focusTimers.delete(user.userId);
            socket.emit("focus:completed", {
                type,
                completedAt: new Date(),
            });
        }
    }, 1000);
    focusTimers.set(user.userId, timer);
    socket.emit("focus:resumed", {
        resumedAt: new Date(),
    });
};
const handleFocusComplete = (socket, data) => {
    const user = socket.data.user;
    if (focusTimers.has(user.userId)) {
        clearInterval(focusTimers.get(user.userId));
        focusTimers.delete(user.userId);
    }
    socket.emit("focus:completed", Object.assign({ completedAt: new Date() }, data));
};
const handleStreakCheck = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const user = socket.data.user;
    // This would fetch from database in real implementation
    socket.emit("streak:update", {
        currentStreak: 5,
        longestStreak: 10,
        lastStudyDate: new Date(),
    });
});
