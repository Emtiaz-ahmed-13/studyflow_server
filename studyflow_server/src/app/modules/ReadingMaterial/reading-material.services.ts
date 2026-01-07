import { MaterialType, ReadingMaterial } from "@prisma/client";
import imagekit from "../../config/imagekit.config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateReadingMaterial } from "./reading-material.interface";
import { extractYouTubeId, getYouTubePlaylistDuration, getYouTubeVideoDuration } from "./youtube.utils";

const uploadReadingMaterial = async (
    userId: string,
    file: Express.Multer.File | undefined,
    data: ICreateReadingMaterial
): Promise<ReadingMaterial> => {
    let fileUrl = data.fileUrl;
    if (file) {
        try {
            const uploadResponse = await imagekit.upload({
                file: file.buffer,
                fileName: `studyflow_pdf_${userId}_${Date.now()}_${file.originalname}`,
                folder: "/studyflow/reading-materials",
            });
            fileUrl = uploadResponse.url;
        } catch (error) {
            throw new ApiError(500, "ImageKit Upload Failed");
        }
    }

    // Auto-detect YouTube URL if type matches or defaulting
    let type = data.type || MaterialType.PDF;
    let metadata = data.metadata || {};

    // If fileUrl is provided (as external URL) and looks like YouTube
    if (fileUrl && (fileUrl.includes("youtube.com") || fileUrl.includes("youtu.be"))) {
        const { type: ytType, id } = extractYouTubeId(fileUrl);
        if (ytType === "VIDEO" && id) {
            type = MaterialType.YOUTUBE;
            const duration = await getYouTubeVideoDuration(id);
            if (duration) {
                metadata = { ...metadata, duration, youtubeId: id, youtubeType: "VIDEO" };
            }
        } else if (ytType === "PLAYLIST" && id) {
            type = MaterialType.YOUTUBE;
            const duration = await getYouTubePlaylistDuration(id);
            if (duration) {
                metadata = { ...metadata, duration, youtubeId: id, youtubeType: "PLAYLIST" };
            }
        }
    }

    // Ensure type is correct if not PDF and no file uploaded
    if (!file && !data.content && !fileUrl) {
        throw new ApiError(400, "Either a PDF file, text content, or a valid URL is required");
    }

    const result = await prisma.readingMaterial.create({
        data: {
            ...data,
            userId,
            fileUrl,
            type,
            metadata,
            topics: data.topics || [],
        },
    });

    return result;
};

const getAllReadingMaterials = async (userId: string) => {
    const result = await prisma.readingMaterial.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

const getReadingMaterialById = async (id: string, userId: string) => {
    const result = await prisma.readingMaterial.findUnique({
        where: { id },
    });

    if (!result) {
        throw new ApiError(404, "Reading material not found");
    }

    if (result.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    return result;
};

const deleteReadingMaterial = async (id: string, userId: string) => {
    const result = await prisma.readingMaterial.findUnique({
        where: { id },
    });

    if (!result) {
        throw new ApiError(404, "Reading material not found");
    }

    if (result.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    await prisma.readingMaterial.delete({ where: { id } });
    return result;
};

export const ReadingMaterialService = {
    uploadReadingMaterial,
    getAllReadingMaterials,
    getReadingMaterialById,
    deleteReadingMaterial,
};
