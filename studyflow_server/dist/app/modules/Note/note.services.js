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
exports.NoteService = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
};
