export interface INote {
    id: string;
    title: string;
    content: string;
    tags: string[];
    subjectId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateNote {
    title: string;
    content: string;
    tags?: string[];
    subjectId?: string;
}

export interface IUpdateNote {
    title?: string;
    content?: string;
    tags?: string[];
    subjectId?: string;
}

export interface INoteFilters {
    userId: string;
    subjectId?: string;
    searchTerm?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}
