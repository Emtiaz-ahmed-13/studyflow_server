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
exports.AIVivaServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
/**
 * Start a new AI Viva Session
 */
const startSession = (userId, topic, subjectId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield prisma_1.default.aIVivaSession.create({
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
});
/**
 * Submit a response and get AI feedback
 */
const submitResponse = (sessionId, userId, answerText) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield prisma_1.default.aIVivaSession.findUnique({
        where: { id: sessionId }
    });
    if (!session) {
        throw new ApiError_1.default(404, "Session not found");
    }
    if (session.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized");
    }
    if (session.status === "COMPLETED") {
        throw new ApiError_1.default(400, "Session is already completed");
    }
    // Mock AI Logic (Replace with actual LLM call in future)
    // 1. Analyze answer
    const isGoodAnswer = answerText.length > 20; // Simple heuristic
    let feedback = "";
    let nextQuestion = "";
    if (isGoodAnswer) {
        feedback = "Excellent point! You explained that well.";
        nextQuestion = "Can you elaborate on the practical applications of this?";
    }
    else {
        feedback = "That's a start, but could you provide more details?";
        nextQuestion = "Let's try breaking it down. What are the key components?";
    }
    // 2. Update transcript
    const currentTranscript = session.transcript;
    const newTranscript = [
        ...currentTranscript,
        { speaker: "USER", text: answerText, timestamp: new Date() },
        { speaker: "AI", text: `${feedback} ${nextQuestion}`, timestamp: new Date() }
    ];
    const updatedSession = yield prisma_1.default.aIVivaSession.update({
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
});
/**
 * End the session and generate final report
 */
const endSession = (sessionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield prisma_1.default.aIVivaSession.findUnique({
        where: { id: sessionId }
    });
    if (!session) {
        throw new ApiError_1.default(404, "Session not found");
    }
    if (session.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized");
    }
    // Generate Mock Report
    const score = Math.floor(Math.random() * 30) + 70; // Random 70-100
    const finalFeedback = score > 85
        ? "Great performance! You showed strong understanding."
        : "Good effort. Review the core concepts for better clarity.";
    const updatedSession = yield prisma_1.default.aIVivaSession.update({
        where: { id: sessionId },
        data: {
            status: "COMPLETED",
            score,
            feedback: finalFeedback
        }
    });
    return updatedSession;
});
exports.AIVivaServices = {
    startSession,
    submitResponse,
    endSession
};
