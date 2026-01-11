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
exports.AIChatControllers = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const ai_chat_services_1 = require("./ai-chat.services");
const startChat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { readingMaterialId } = req.body;
    const result = yield ai_chat_services_1.AIChatServices.startChat((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, readingMaterialId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "PDF Chat Session Started",
        data: result,
    });
}));
const sendMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sessionId, message } = req.body;
    const result = yield ai_chat_services_1.AIChatServices.sendMessage((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, sessionId, message);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
}));
const getChatHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const result = yield ai_chat_services_1.AIChatServices.getChatHistory((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Chat history retrieved",
        data: result,
    });
}));
exports.AIChatControllers = {
    startChat,
    sendMessage,
    getChatHistory
};
