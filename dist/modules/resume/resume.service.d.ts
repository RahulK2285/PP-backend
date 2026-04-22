interface ScoreCategory {
    name: string;
    score: number;
    maxScore: number;
    feedback: string;
    status: 'good' | 'warning' | 'bad';
}
export interface ResumeScoreResult {
    totalScore: number;
    maxScore: number;
    percentage: number;
    grade: string;
    categories: ScoreCategory[];
    tips: string[];
}
export declare function analyzeResume(filePath: string, mimeType: string): Promise<ResumeScoreResult>;
export {};
//# sourceMappingURL=resume.service.d.ts.map