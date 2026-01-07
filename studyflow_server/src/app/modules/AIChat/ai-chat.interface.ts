export type IAIChatMessage = {
    role: "user" | "ai";
    content: string;
    timestamp: Date;
};

export type IStartChat = {
    readingMaterialId: string;
};

export type ISendMessage = {
    sessionId: string;
    message: string;
};
