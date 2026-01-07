import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

/**
 * Start a new AI Viva Session
 */
const startSession = async (userId: string, topic: string, subjectId?: string) => {
    const session = await prisma.aIVivaSession.create({
        data: {
            userId,
            subjectId,
            topic,
            status: "IN_PROGRESS",
            transcript: [
                {
                    speaker: "AI",
                    text: `Hello! Today we will discuss ${topic}. Are you ready for your first question?`,
                    timestamp: new Date()
                }
            ]
        }
    });

    return session;
};

/**
 * Submit a response and get AI feedback
 */
const submitResponse = async (sessionId: string, userId: string, answerText: string) => {
    const session = await prisma.aIVivaSession.findUnique({
        where: { id: sessionId }
    });

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (session.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    if (session.status === "COMPLETED") {
        throw new ApiError(400, "Session is already completed");
    }

    // Mock AI Logic (Replace with actual LLM call in future)
    // 1. Analyze answer
    const isGoodAnswer = answerText.length > 20; // Simple heuristic
    let feedback = "";
    let nextQuestion = "";

    if (isGoodAnswer) {
        feedback = "Excellent point! You explained that well.";
        nextQuestion = "Can you elaborate on the practical applications of this?";
    } else {
        feedback = "That's a start, but could you provide more details?";
        nextQuestion = "Let's try breaking it down. What are the key components?";
    }

    // 2. Update transcript
    const currentTranscript = session.transcript as any[];
    const newTranscript = [
        ...currentTranscript,
        { speaker: "USER", text: answerText, timestamp: new Date() },
        { speaker: "AI", text: `${feedback} ${nextQuestion}`, timestamp: new Date() }
    ];

    const updatedSession = await prisma.aIVivaSession.update({
        where: { id: sessionId },
        data: {
            transcript: newTranscript
        }
    });

    return {
        feedback,
        nextQuestion,
        transcript: updatedSession.transcript
    };
};

/**
 * End the session and generate final report
 */
const endSession = async (sessionId: string, userId: string) => {
    const session = await prisma.aIVivaSession.findUnique({
        where: { id: sessionId }
    });

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (session.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    // Generate Mock Report
    const score = Math.floor(Math.random() * 30) + 70; // Random 70-100
    const finalFeedback = score > 85
        ? "Great performance! You showed strong understanding."
        : "Good effort. Review the core concepts for better clarity.";

    const updatedSession = await prisma.aIVivaSession.update({
        where: { id: sessionId },
        data: {
            status: "COMPLETED",
            score,
            feedback: finalFeedback
        }
    });

    return updatedSession;
};

export const AIVivaServices = {
    startSession,
    submitResponse,
    endSession
};
