import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateNote, INoteFilters, IUpdateNote } from "./note.interface";

const createNote = async (userId: string, data: ICreateNote) => {
    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
    }

    const note = await prisma.note.create({
        data: {
            ...data,
            userId,
            tags: data.tags || [],
        },
        include: { subject: true },
    });

    return note;
};

const getNotes = async (filters: INoteFilters) => {
    const { userId, subjectId, searchTerm, tags, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const whereConditions: any = { userId };

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

    const [notes, total] = await Promise.all([
        prisma.note.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { subject: true },
            orderBy: { updatedAt: "desc" },
        }),
        prisma.note.count({ where: whereConditions }),
    ]);

    return {
        data: notes,
        meta: { page, limit, total },
    };
};

const getNoteById = async (id: string, userId: string) => {
    const note = await prisma.note.findFirst({
        where: { id, userId },
        include: { subject: true, shares: true },
    });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return note;
};

const updateNote = async (id: string, userId: string, data: IUpdateNote) => {
    const existing = await prisma.note.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new ApiError(404, "Note not found");
    }

    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
    }

    const updated = await prisma.note.update({
        where: { id },
        data,
        include: { subject: true },
    });

    return updated;
};

const deleteNote = async (id: string, userId: string) => {
    const existing = await prisma.note.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new ApiError(404, "Note not found");
    }

    await prisma.note.delete({ where: { id } });

    return { message: "Note deleted successfully" };
};

/**
 * Get Public Marketplace Notes
 */
const getMarketplaceNotes = async (filters: any) => {
    const { searchTerm, subjectId, minRating, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const whereConditions: any = {
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

    const [notes, total] = await Promise.all([
        prisma.note.findMany({
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
        prisma.note.count({ where: whereConditions }),
    ]);

    return {
        data: notes,
        meta: { page, limit, total },
    };
};

const rateNote = async (userId: string, noteId: string, rating: number, comment?: string) => {
    const note = await prisma.note.findUnique({ where: { id: noteId } });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    if (!note.isPublic) {
        throw new ApiError(400, "Cannot rate a private note");
    }

    // Upsert rating
    await prisma.noteRating.upsert({
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
    const ratings = await prisma.noteRating.findMany({
        where: { noteId }
    });

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { averageRating }
    });

    return updatedNote;
};

/**
 * Generate Flashcards from Note
 */
const generateFlashcards = async (userId: string, noteId: string) => {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new ApiError(404, "Note not found");

    if (note.userId !== userId) throw new ApiError(403, "Unauthorized");

    // Mock AI Generation Logic
    // In production, send note.content to LLM to get Q&A pairs
    const mockDeck = [
        { front: "What is the main topic of this note?", back: note.title },
        { front: "Key concept 1", back: "Explanation of concept 1 from content..." },
        { front: "Key concept 2", back: "Explanation of concept 2 from content..." },
    ];

    // Create a Study Technique entry for this flashcard deck
    const studyTechnique = await prisma.studyTechnique.create({
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
};

export const NoteService = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getMarketplaceNotes,
    rateNote,
    generateFlashcards
};
