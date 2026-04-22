import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare const resumeController: {
    upload(req: AuthRequest, res: Response): Promise<void>;
    getAll(req: AuthRequest, res: Response): Promise<void>;
    delete(req: AuthRequest, res: Response): Promise<void>;
    download(req: AuthRequest, res: Response): Promise<void>;
    preview(req: AuthRequest, res: Response): Promise<void>;
    rescore(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=resume.controller.d.ts.map