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
exports.AIChatServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const startChat = (userId, readingMaterialId) => __awaiter(void 0, void 0, void 0, function* () {
    const readingMaterial = yield prisma_1.default.readingMaterial.findUnique({
        where: { id: readingMaterialId }
    });
    if (!readingMaterial) {
        throw new ApiError_1.default(404, "Reading material found");
    }
    if (readingMaterial.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized");
    }
    const session = yield prisma_1.default.aIChatSession.create({
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
});
const sendMessage = (userId, sessionId, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield prisma_1.default.aIChatSession.findUnique({
        where: { id: sessionId },
        include: { readingMaterial: true }
    });
    if (!session) {
        throw new ApiError_1.default(404, "Chat session not found");
    }
    if (session.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized");
    }
    const context = ((_a = session.readingMaterial.content) === null || _a === void 0 ? void 0 : _a.substring(0, 500)) || "";
    const aiResponse = `[AI Analysis of ${session.readingMaterial.title}]: Based on the text "${context}...", here is the answer to "${message}". (This is a mock response)`;
    const currentMessages = session.messages;
    const newMessages = [
        ...currentMessages,
        { role: "user", content: message, timestamp: new Date() },
        { role: "ai", content: aiResponse, timestamp: new Date() }
    ];
    const updatedSession = yield prisma_1.default.aIChatSession.update({
        where: { id: sessionId },
        data: {
            messages: newMessages
        }
    });
    return {
        reply: aiResponse,
        history: updatedSession.messages
    };
});
const getChatHistory = (userId, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield prisma_1.default.aIChatSession.findUnique({
        where: { id: sessionId }
    });
    if (!session) {
        throw new ApiError_1.default(404, "Chat session not found");
    }
    if (session.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized");
    }
    return session;
});
exports.AIChatServices = {
    startChat,
    sendMessage,
    getChatHistory
};
