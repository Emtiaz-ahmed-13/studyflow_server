import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ILeaderboardEntry, IXPUpdate } from "./gamification.interface";

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500]; // Example XP thresholds

/**
 * Add XP to a user and check for level up
 */
const addXp = async (userId: string, xpAmount: number): Promise<IXPUpdate> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
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

    const updatedUser = await prisma.user.update({
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
};

/**
 * Get Global Leaderboard
 */
const getLeaderboard = async (limit: number = 10): Promise<ILeaderboardEntry[]> => {
    const users = await prisma.user.findMany({
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
};

/**
 * Get User Stats
 */
const getUserStats = async (userId: string) => {
    const user = await prisma.user.findUnique({
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
        throw new ApiError(404, "User not found");
    }

    // Calculate rank
    const rankCount = await prisma.user.count({
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
};

export const GamificationServices = {
    addXp,
    getLeaderboard,
    getUserStats
};
