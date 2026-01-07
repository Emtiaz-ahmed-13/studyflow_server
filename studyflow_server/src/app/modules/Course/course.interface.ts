export interface ICourse {
    id: string;
    name: string;
    semester: string;
    year: number;
    credits?: number;
    instructor?: string;
    subjectId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateCourse {
    name: string;
    semester: string;
    year: number;
    credits?: number;
    instructor?: string;
    subjectId: string;
}

export interface IUpdateCourse {
    name?: string;
    semester?: string;
    year?: number;
    credits?: number;
    instructor?: string;
    subjectId?: string;
}

export interface ICourseFilters {
    userId: string;
    subjectId?: string;
    semester?: string;
    year?: number;
    searchTerm?: string;
    page?: number;
    limit?: number;
}
