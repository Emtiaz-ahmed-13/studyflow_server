export interface IStudyPlan {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    subjectId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateStudyPlan {
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    subjectId?: string;
}

export interface IUpdateStudyPlan {
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    subjectId?: string;
}

export interface IStudyPlanFilters {
    userId: string;
    subjectId?: string;
    active?: boolean; // Filter for active plans (endDate >= now or no endDate)
    page?: number;
    limit?: number;
}
