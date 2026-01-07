export type IAIVivaSession = {
    id: string;
    userId: string;
    topic: string;
    status: string;
    transcript: any;
    score: number | null;
    feedback: string | null;
};

export type IResponseInput = {
    sessionId: string;
    answerText: string;
};
