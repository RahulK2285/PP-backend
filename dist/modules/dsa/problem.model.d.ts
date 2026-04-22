import mongoose, { Document } from 'mongoose';
export interface IProblem extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    titleSlug?: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Solved' | 'Attempted' | 'Todo';
    source: 'manual' | 'leetcode';
    leetcodeId?: string;
    url?: string;
    notes?: string;
    solvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Problem: mongoose.Model<IProblem, {}, {}, {}, mongoose.Document<unknown, {}, IProblem, {}, {}> & IProblem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=problem.model.d.ts.map