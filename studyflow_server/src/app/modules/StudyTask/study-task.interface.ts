export interface IStudyTask {
    id: string;
    title: string;
    description?: string;
    deadline?: Date;
    completed: boolean;
    priority: number; // 0 = low, 1 = medium, 2 = high
    studyPlanId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateStudyTask {
    title: string;
    description?: string;
    deadline?: Date;
    priority?: number;
    studyPlanId: string;
}

export interface IUpdateStudyTask {
    title?: string;
    description?: string;
    deadline?: Date;
    completed?: boolean;
    priority?: number;
}

export interface IStudyTaskFilters {
    userId: string;
    studyPlanId?: string;
    completed?: boolean;
    priority?: number;
    page?: number;
    limit?: number;
}
