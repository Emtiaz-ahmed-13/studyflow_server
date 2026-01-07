export interface ISubject {
    id: string;
    name: string;
    code?: string;
    description?: string;
    color?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateSubject {
    name: string;
    code?: string;
    description?: string;
    color?: string;
}

export interface IUpdateSubject {
    name?: string;
    code?: string;
    description?: string;
    color?: string;
}

export interface ISubjectFilters {
    userId: string;
    searchTerm?: string;
    page?: number;
    limit?: number;
}
