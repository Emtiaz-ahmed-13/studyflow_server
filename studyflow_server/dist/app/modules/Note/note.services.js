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
exports.NoteService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createNote = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError_1.default(404, "Subject not found");
        }
    }
    const note = yield prisma_1.default.note.create({
        data: Object.assign(Object.assign({}, data), { userId, tags: data.tags || [] }),
        include: { subject: true },
    });
    return note;
});
const getNotes = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subjectId, searchTerm, tags, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = { userId };
    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }
    if (searchTerm) {
        whereConditions.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
        ];
    }
    if (tags && tags.length > 0) {
        whereConditions.tags = { hasSome: tags };
    }
    const [notes, total] = yield Promise.all([
        prisma_1.default.note.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { subject: true },
            orderBy: { updatedAt: "desc" },
        }),
        prisma_1.default.note.count({ where: whereConditions }),
    ]);
    return {
        data: notes,
        meta: { page, limit, total },
    };
});
const getNoteById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield prisma_1.default.note.findFirst({
        where: { id, userId },
        include: { subject: true, shares: true },
    });
    if (!note) {
        throw new ApiError_1.default(404, "Note not found");
    }
    return note;
});
const updateNote = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.note.findFirst({
        where: { id, userId },
    });
    if (!existing) {
        throw new ApiError_1.default(404, "Note not found");
    }
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError_1.default(404, "Subject not found");
        }
    }
    const updated = yield prisma_1.default.note.update({
        where: { id },
        data,
        include: { subject: true },
    });
    return updated;
});
const deleteNote = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.note.findFirst({
        where: { id, userId },
    });
    if (!existing) {
        throw new ApiError_1.default(404, "Note not found");
    }
    yield prisma_1.default.note.delete({ where: { id } });
    return { message: "Note deleted successfully" };
});
/**
 * Get Public Marketplace Notes
 */
const getMarketplaceNotes = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, subjectId, minRating, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = {
        isPublic: true,
    };
    if (searchTerm) {
        whereConditions.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            { tags: { has: searchTerm } }
        ];
    }
    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }
    if (minRating) {
        whereConditions.averageRating = {
            gte: parseFloat(minRating)
        };
    }
    const [notes, total] = yield Promise.all([
        prisma_1.default.note.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                subject: true,
                user: {
                    select: {
                        name: true,
                        profileImage: true
                    }
                }
            },
            orderBy: [
                { averageRating: "desc" },
                { createdAt: "desc" }
            ],
        }),
        prisma_1.default.note.count({ where: whereConditions }),
    ]);
    return {
        data: notes,
        meta: { page, limit, total },
    };
});
const rateNote = (userId, noteId, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield prisma_1.default.note.findUnique({ where: { id: noteId } });
    if (!note) {
        throw new ApiError_1.default(404, "Note not found");
    }
    if (!note.isPublic) {
        throw new ApiError_1.default(400, "Cannot rate a private note");
    }
    // Upsert rating
    yield prisma_1.default.noteRating.upsert({
        where: {
            noteId_userId: {
                noteId,
                userId
            }
        },
        update: {
            rating,
            comment
        },
        create: {
            noteId,
            userId,
            rating,
            comment
        }
    });
    // Recalculate average
    const ratings = yield prisma_1.default.noteRating.findMany({
        where: { noteId }
    });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;
    const updatedNote = yield prisma_1.default.note.update({
        where: { id: noteId },
        data: { averageRating }
    });
    return updatedNote;
});
/**
 * Generate Flashcards from Note
 */
const generateFlashcards = (userId, noteId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield prisma_1.default.note.findUnique({ where: { id: noteId } });
    if (!note)
        throw new ApiError_1.default(404, "Note not found");
    if (note.userId !== userId)
        throw new ApiError_1.default(403, "Unauthorized");
    // Mock AI Generation Logic
    // In production, send note.content to LLM to get Q&A pairs
    const mockDeck = [
        { front: "What is the main topic of this note?", back: note.title },
        { front: "Key concept 1", back: "Explanation of concept 1 from content..." },
        { front: "Key concept 2", back: "Explanation of concept 2 from content..." },
    ];
    // Create a Study Technique entry for this flashcard deck
    const studyTechnique = yield prisma_1.default.studyTechnique.create({
        data: {
            userId,
            subjectId: note.subjectId,
            name: `Flashcards: ${note.title}`,
            type: "FLASHCARD", // Ensure this enum exists or use string
            description: "Auto-generated from note",
            metadata: { deck: mockDeck }
        }
    });
    return studyTechnique;
});
exports.NoteService = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getMarketplaceNotes,
    rateNote,
    generateFlashcards
};
