import { Server as HttpServer } from "http";
import { Secret } from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import { jwtHelpers } from "../helpers/jwtHelpers";
import config from "./index";

let io: SocketIOServer;

/**
 * Initialize Socket.IO server
 */
export const initializeSocketIO = (httpServer: HttpServer): SocketIOServer => {
    io = new SocketIOServer(httpServer, {
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

            const verifiedUser = jwtHelpers.verifyToken(
                token,
                config.jwt.jwt_secret as Secret
            );

            socket.data.user = verifiedUser;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    console.log("✅ Socket.IO initialized");

    return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};

export default { initializeSocketIO, getIO };
