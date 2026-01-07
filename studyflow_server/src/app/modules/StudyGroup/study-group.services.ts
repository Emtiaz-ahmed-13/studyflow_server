import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { IAddMember, ICreateStudyGroup } from "./study-group.interface";

const createStudyGroup = async (userId: string, data: ICreateStudyGroup) => {
    const group = await prisma.studyGroup.create({
        data: { ...data, createdById: userId },
        include: { members: true },
    });
    await prisma.groupMember.create({
        data: { groupId: group.id, userId, role: "ADMIN" },
    });
    return group;
};

const getMyStudyGroups = async (userId: string) => {
    return await prisma.studyGroup.findMany({
        where: {
            OR: [
                { createdById: userId },
                { members: { some: { userId } } },
            ],
        },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
};

const getStudyGroupById = async (id: string, userId: string) => {
    const group = await prisma.studyGroup.findFirst({
        where: {
            id,
            OR: [
                { createdById: userId },
                { members: { some: { userId } } },
            ],
        },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    if (!group) throw new ApiError(404, "Study group not found");
    return group;
};

const addMember = async (userId: string, data: IAddMember) => {
    const group = await prisma.studyGroup.findFirst({
        where: { id: data.groupId, createdById: userId },
    });
    if (!group) throw new ApiError(403, "Only group creator can add members");

    const existing = await prisma.groupMember.findFirst({
        where: { groupId: data.groupId, userId: data.userId },
    });
    if (existing) throw new ApiError(400, "User is already a member");

    return await prisma.groupMember.create({
        data: { groupId: data.groupId, userId: data.userId, role: data.role || "MEMBER" },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
};

const deleteStudyGroup = async (id: string, userId: string) => {
    const group = await prisma.studyGroup.findFirst({ where: { id, createdById: userId } });
    if (!group) throw new ApiError(403, "Only group creator can delete the group");
    await prisma.studyGroup.delete({ where: { id } });
    return { message: "Study group deleted successfully" };
};

export const StudyGroupService = {
    createStudyGroup,
    getMyStudyGroups,
    getStudyGroupById,
    addMember,
    deleteStudyGroup,
};
