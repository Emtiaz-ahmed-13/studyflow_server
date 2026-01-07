import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { IAIChatMessage } from "./ai-chat.interface";


const startChat = async (userId: string, readingMaterialId: string) => {
    const readingMaterial = await prisma.readingMaterial.findUnique({
        where: { id: readingMaterialId }
    });

    if (!readingMaterial) {
        throw new ApiError(404, "Reading material found");
    }

    if (readingMaterial.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }
    const session = await prisma.aIChatSession.create({
        data: {
            userId,
            readingMaterialId,
            messages: [
                {
                    role: "ai",
                    content: `Hello! I've read "${readingMaterial.title}". Ask me anything about it!`,
                    timestamp: new Date()
                }
            ]
        },
        include: {
            readingMaterial: {
                select: { title: true }
            }
        }
    });

    return session;
};

const sendMessage = async (userId: string, sessionId: string, message: string) => {
    const session = await prisma.aIChatSession.findUnique({
        where: { id: sessionId },
        include: { readingMaterial: true }
    });

    if (!session) {
        throw new ApiError(404, "Chat session not found");
    }

    if (session.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    const context = session.readingMaterial.content?.substring(0, 500) || "";
    const aiResponse = `[AI Analysis of ${session.readingMaterial.title}]: Based on the text "${context}...", here is the answer to "${message}". (This is a mock response)`;

    const currentMessages = session.messages as unknown as IAIChatMessage[];
    const newMessages = [
        ...currentMessages,
        { role: "user", content: message, timestamp: new Date() },
        { role: "ai", content: aiResponse, timestamp: new Date() }
    ];

    const updatedSession = await prisma.aIChatSession.update({
        where: { id: sessionId },
        data: {
            messages: newMessages as any
        }
    });

    return {
        reply: aiResponse,
        history: updatedSession.messages
    };
};

const getChatHistory = async (userId: string, sessionId: string) => {
    const session = await prisma.aIChatSession.findUnique({
        where: { id: sessionId }
    });

    if (!session) {
        throw new ApiError(404, "Chat session not found");
    }

    if (session.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    return session;
};

export const AIChatServices = {
    startChat,
    sendMessage,
    getChatHistory
};
