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
exports.checkPermission = void 0;
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const rbac_utils_1 = require("../utils/rbac.utils");
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token)
                throw new ApiError_1.default(401, "You are not authorized");
            // Extract the token from Bearer scheme
            const tokenWithoutBearer = token.split(" ")[1];
            if (!tokenWithoutBearer) {
                throw new ApiError_1.default(401, "Invalid token format");
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(tokenWithoutBearer, config_1.default.jwt.jwt_secret);
            req.user = verifiedUser;
            if (roles.length && !roles.includes(verifiedUser.role))
                throw new ApiError_1.default(403, "Forbidden");
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
const checkPermission = (...requiredPermissions) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token)
                throw new ApiError_1.default(401, "You are not authorized");
            // Extract the token from Bearer scheme
            const tokenWithoutBearer = token.split(" ")[1];
            if (!tokenWithoutBearer) {
                throw new ApiError_1.default(401, "Invalid token format");
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(tokenWithoutBearer, config_1.default.jwt.jwt_secret);
            req.user = verifiedUser;
            // Check if user has any of the required permissions
            const hasRequiredPermission = requiredPermissions.some((permission) => (0, rbac_utils_1.hasPermission)(verifiedUser.role, permission));
            if (!hasRequiredPermission) {
                throw new ApiError_1.default(403, "You do not have permission to perform this action");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.checkPermission = checkPermission;
exports.default = auth;
