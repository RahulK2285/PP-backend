import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare const dsaController: {
    getProblems(req: AuthRequest, res: Response): Promise<void>;
    createProblem(req: AuthRequest, res: Response): Promise<void>;
    updateProblem(req: AuthRequest, res: Response): Promise<void>;
    deleteProblem(req: AuthRequest, res: Response): Promise<void>;
    syncLeetCode(req: AuthRequest, res: Response): Promise<void>;
    getLeetCodeProfile(req: AuthRequest, res: Response): Promise<void>;
    getAnalytics(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=dsa.controller.d.ts.map