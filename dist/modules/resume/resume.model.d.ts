import mongoose, { Document } from 'mongoose';
interface ScoreCategory {
    name: string;
    score: number;
    maxScore: number;
    feedback: string;
    status: 'good' | 'warning' | 'bad';
}
export interface IResumeScore {
    totalScore: number;
    maxScore: number;
    percentage: number;
    grade: string;
    categories: ScoreCategory[];
    tips: string[];
}
export interface IResume extends Document {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    score?: IResumeScore;
    createdAt: Date;
}
export declare const Resume: mongoose.Model<IResume, {}, {}, {}, mongoose.Document<unknown, {}, IResume, {}, {}> & IResume & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=resume.model.d.ts.map