export type ILeaderboardEntry = {
    userId: string;
    name: string;
    profileImage: string | null;
    xp: number;
    level: number;
    rank: number;
};

export type IXPUpdate = {
    previousLevel: number;
    currentLevel: number;
    xpGained: number;
    leveledUp: boolean;
};
