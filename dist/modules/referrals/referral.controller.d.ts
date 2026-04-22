import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare const referralController: {
    create(req: AuthRequest, res: Response): Promise<void>;
    getAll(req: AuthRequest, res: Response): Promise<void>;
    updateStatus(req: AuthRequest, res: Response): Promise<void>;
    delete(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=referral.controller.d.ts.map