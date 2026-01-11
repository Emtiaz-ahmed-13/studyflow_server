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
exports.ReadingMaterialService = void 0;
const client_1 = require("@prisma/client");
const imagekit_config_1 = __importDefault(require("../../config/imagekit.config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const youtube_utils_1 = require("./youtube.utils");
const uploadReadingMaterial = (userId, file, data) => __awaiter(void 0, void 0, void 0, function* () {
    let fileUrl = data.fileUrl;
    if (file) {
        try {
            const uploadResponse = yield imagekit_config_1.default.upload({
                file: file.buffer,
                fileName: `studyflow_pdf_${userId}_${Date.now()}_${file.originalname}`,
                folder: "/studyflow/reading-materials",
            });
            fileUrl = uploadResponse.url;
        }
        catch (error) {
            throw new ApiError_1.default(500, "ImageKit Upload Failed");
        }
    }
    // Auto-detect YouTube URL if type matches or defaulting
    let type = data.type || client_1.MaterialType.PDF;
    let metadata = data.metadata || {};
    // If fileUrl is provided (as external URL) and looks like YouTube
    if (fileUrl && (fileUrl.includes("youtube.com") || fileUrl.includes("youtu.be"))) {
        const { type: ytType, id } = (0, youtube_utils_1.extractYouTubeId)(fileUrl);
        if (ytType === "VIDEO" && id) {
            type = client_1.MaterialType.YOUTUBE;
            const duration = yield (0, youtube_utils_1.getYouTubeVideoDuration)(id);
            if (duration) {
                metadata = Object.assign(Object.assign({}, metadata), { duration, youtubeId: id, youtubeType: "VIDEO" });
            }
        }
        else if (ytType === "PLAYLIST" && id) {
            type = client_1.MaterialType.YOUTUBE;
            const duration = yield (0, youtube_utils_1.getYouTubePlaylistDuration)(id);
            if (duration) {
                metadata = Object.assign(Object.assign({}, metadata), { duration, youtubeId: id, youtubeType: "PLAYLIST" });
            }
        }
    }
    // Ensure type is correct if not PDF and no file uploaded
    if (!file && !data.content && !fileUrl) {
        throw new ApiError_1.default(400, "Either a PDF file, text content, or a valid URL is required");
    }
    const result = yield prisma_1.default.readingMaterial.create({
        data: Object.assign(Object.assign({}, data), { userId,
            fileUrl,
            type,
            metadata, topics: data.topics || [] }),
    });
    return result;
});
const getAllReadingMaterials = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.readingMaterial.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getReadingMaterialById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.readingMaterial.findUnique({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(404, "Reading material not found");
    }
    if (result.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    return result;
});
const deleteReadingMaterial = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.readingMaterial.findUnique({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(404, "Reading material not found");
    }
    if (result.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    yield prisma_1.default.readingMaterial.delete({ where: { id } });
    return result;
});
exports.ReadingMaterialService = {
    uploadReadingMaterial,
    getAllReadingMaterials,
    getReadingMaterialById,
    deleteReadingMaterial,
};
