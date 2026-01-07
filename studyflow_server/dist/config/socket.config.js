"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initializeSocketIO = void 0;
const socket_io_1 = require("socket.io");
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const index_1 = __importDefault(require("./index"));
let io;
/**
 * Initialize Socket.IO server
 */
const initializeSocketIO = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            credentials: true,
        },
    });
    // Authentication middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, index_1.default.jwt.jwt_secret);
            socket.data.user = verifiedUser;
            next();
        }
        catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });
    console.log("✅ Socket.IO initialized");
    return io;
};
exports.initializeSocketIO = initializeSocketIO;
/**
 * Get Socket.IO instance
 */
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};
exports.getIO = getIO;
exports.default = { initializeSocketIO: exports.initializeSocketIO, getIO: exports.getIO };
