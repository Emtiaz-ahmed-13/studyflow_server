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
exports.GamificationServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500]; // Example XP thresholds
/**
 * Add XP to a user and check for level up
 */
const addXp = (userId, xpAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new ApiError_1.default(404, "User not found");
    }
    const newXp = (user.xp || 0) + xpAmount;
    let newLevel = user.level || 1;
    // Check for level up
    // Simple logic: If newXp >= threshold for next level
    // Assuming level N requires LEVEL_THRESHOLDS[N] XP
    // Levels are 1-indexed for display, mapped to index 1..10 in array
    // Calculate level based on thresholds
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newXp >= LEVEL_THRESHOLDS[i]) {
            // If i=0 (0 XP), level is 1. If i=1 (100 XP), level is 2.
            newLevel = i + 1;
            break;
        }
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            xp: newXp,
            level: newLevel,
        },
    });
    return {
        previousLevel: user.level || 1,
        currentLevel: updatedUser.level,
        xpGained: xpAmount,
        leveledUp: updatedUser.level > (user.level || 1),
    };
});
/**
 * Get Global Leaderboard
 */
const getLeaderboard = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const users = yield prisma_1.default.user.findMany({
        orderBy: { xp: 'desc' },
        take: limit,
        select: {
            id: true,
            name: true,
            profileImage: true,
            xp: true,
            level: true,
        },
    });
    return users.map((user, index) => ({
        userId: user.id,
        name: user.name,
        profileImage: user.profileImage,
        xp: user.xp || 0,
        level: user.level || 1,
        rank: index + 1,
    }));
});
/**
 * Get User Stats
 */
const getUserStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            userBadges: {
                include: {
                    badge: true
                }
            }
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, "User not found");
    }
    // Calculate rank
    const rankCount = yield prisma_1.default.user.count({
        where: {
            xp: {
                gt: user.xp || 0
            }
        }
    });
    const nextLevelXp = LEVEL_THRESHOLDS[user.level || 1] || ((user.level || 1) * 1000); // Fallback for high levels
    return {
        userId: user.id,
        name: user.name,
        xp: user.xp || 0,
        level: user.level || 1,
        rank: rankCount + 1,
        nextLevelXp,
        badges: user.userBadges.map(ub => ub.badge)
    };
});
exports.GamificationServices = {
    addXp,
    getLeaderboard,
    getUserStats
};
