export interface IStudyGroup {
    id: string;
    name: string;
    description?: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateStudyGroup {
    name: string;
    description?: string;
}

export interface IGroupMember {
    id: string;
    groupId: string;
    userId: string;
    role: string;
    joinedAt: Date;
}

export interface IAddMember {
    groupId: string;
    userId: string;
    role?: string;
}
