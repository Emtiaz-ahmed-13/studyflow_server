import geminiAI from "../../../config/gemini.config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { IAIChatMessage } from "./ai-chat.interface";


const startChat = async (userId: string, readingMaterialId?: string) => {
    try {
        console.log('Starting chat for user:', userId, 'with material:', readingMaterialId);

        let initialMessage = "Hello! I'm your AI study assistant. Ask me anything about your studies!";
        let sessionData: any = {
            userId,
            messages: []
        };

        if (readingMaterialId) {
            const readingMaterial = await prisma.readingMaterial.findUnique({
                where: { id: readingMaterialId }
            });

            if (!readingMaterial) {
                throw new ApiError(404, "Reading material not found");
            }

            if (readingMaterial.userId !== userId) {
                throw new ApiError(403, "Unauthorized");
            }

            sessionData.readingMaterialId = readingMaterialId;
            initialMessage = `Hello! I've read "${readingMaterial.title}". Ask me anything about it!`;
        }

        sessionData.messages = [
            {
                role: "ai",
                content: initialMessage,
                timestamp: new Date()
            }
        ];

        console.log('Creating session with data:', JSON.stringify(sessionData, null, 2));

        const session = await prisma.aIChatSession.create({
            data: sessionData,
            include: {
                readingMaterial: {
                    select: { title: true }
                }
            }
        });

        console.log('Session created successfully:', session.id);

        return {
            sessionId: session.id,
            initialMessage: initialMessage
        };
    } catch (error) {
        console.error('Error in startChat:', error);
        throw error;
    }
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

    // Build context-aware prompt
    let prompt = `User question: ${message}\n\n`;

    if (session.readingMaterial && session.readingMaterial.content) {
        const materialContext = session.readingMaterial.content.substring(0, 4000); // Limit context size
        prompt = `The user is studying the following material titled "${session.readingMaterial.title}":\n\n---START OF MATERIAL---\n${materialContext}\n---END OF MATERIAL---\n\nBased ONLY on the content above (if relevant), answer the user's question. If the information isn't in the material, use your general knowledge but mention that it wasn't in the source.\n\nUser question: ${message}`;
    } else {
        prompt = `You are a helpful AI study assistant. Answer the user's question clearly and concisely.\n\nUser question: ${message}`;
    }

    // Get real AI response
    const aiResponse = await geminiAI.generateContent(prompt);

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
        response: aiResponse,
        sessionId: session.id
    };
};

const getChatHistory = async (userId: string, sessionId: string) => {
    const session = await prisma.aIChatSession.findUnique({
        where: { id: sessionId },
        include: {
            readingMaterial: {
                select: { title: true }
            }
        }
    });

    if (!session) {
        throw new ApiError(404, "Chat session not found");
    }

    if (session.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    return {
        session: session
    };
};

export const AIChatServices = {
    startChat,
    sendMessage,
    getChatHistory
};
