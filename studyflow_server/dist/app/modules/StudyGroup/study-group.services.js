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
exports.StudyGroupService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createStudyGroup = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield prisma_1.default.studyGroup.create({
        data: Object.assign(Object.assign({}, data), { createdById: userId }),
        include: { members: true },
    });
    yield prisma_1.default.groupMember.create({
        data: { groupId: group.id, userId, role: "ADMIN" },
    });
    return group;
});
const getMyStudyGroups = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.studyGroup.findMany({
        where: {
            OR: [
                { createdById: userId },
                { members: { some: { userId } } },
            ],
        },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
});
const getStudyGroupById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield prisma_1.default.studyGroup.findFirst({
        where: {
            id,
            OR: [
                { createdById: userId },
                { members: { some: { userId } } },
            ],
        },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    if (!group)
        throw new ApiError_1.default(404, "Study group not found");
    return group;
});
const addMember = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield prisma_1.default.studyGroup.findFirst({
        where: { id: data.groupId, createdById: userId },
    });
    if (!group)
        throw new ApiError_1.default(403, "Only group creator can add members");
    const existing = yield prisma_1.default.groupMember.findFirst({
        where: { groupId: data.groupId, userId: data.userId },
    });
    if (existing)
        throw new ApiError_1.default(400, "User is already a member");
    return yield prisma_1.default.groupMember.create({
        data: { groupId: data.groupId, userId: data.userId, role: data.role || "MEMBER" },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
});
const deleteStudyGroup = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield prisma_1.default.studyGroup.findFirst({ where: { id, createdById: userId } });
    if (!group)
        throw new ApiError_1.default(403, "Only group creator can delete the group");
    yield prisma_1.default.studyGroup.delete({ where: { id } });
    return { message: "Study group deleted successfully" };
});
exports.StudyGroupService = {
    createStudyGroup,
    getMyStudyGroups,
    getStudyGroupById,
    addMember,
    deleteStudyGroup,
};
