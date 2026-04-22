import { IProblem } from './problem.model';
export declare const dsaService: {
    getProblems(userId: string, filters?: {
        topic?: string;
        difficulty?: string;
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, IProblem, {}, {}> & IProblem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createProblem(userId: string, data: Partial<IProblem>): Promise<import("mongoose").Document<unknown, {}, IProblem, {}, {}> & IProblem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProblem(userId: string, problemId: string, data: Partial<IProblem>): Promise<import("mongoose").Document<unknown, {}, IProblem, {}, {}> & IProblem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteProblem(userId: string, problemId: string): Promise<import("mongoose").Document<unknown, {}, IProblem, {}, {}> & IProblem & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    syncLeetCode(userId: string, username: string, limit?: number): Promise<{
        synced: number;
        skipped: number;
        total: any;
        submissions: any;
    }>;
    getLeetCodeProfile(username: string): Promise<any>;
    getAnalytics(userId: string): Promise<{
        topicCounts: Record<string, {
            solved: number;
            attempted: number;
            todo: number;
        }>;
        difficultyCounts: {
            Easy: number;
            Medium: number;
            Hard: number;
        };
        statusCounts: {
            Solved: number;
            Attempted: number;
            Todo: number;
        };
        weeklyData: {
            week: string;
            count: number;
        }[];
        heatmapData: Record<string, number>;
        streak: {
            current: number;
            longest: number;
            totalActiveDays: number;
        };
        totalProblems: number;
    }>;
};
//# sourceMappingURL=dsa.service.d.ts.map