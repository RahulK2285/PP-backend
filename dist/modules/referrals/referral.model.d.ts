import mongoose, { Document } from 'mongoose';
export type ReferralStatus = 'Applied' | 'Under Review' | 'Referral Sent' | 'Interview Set' | 'Rejected';
export interface IReferral extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    role: string;
    message: string;
    status: ReferralStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Referral: mongoose.Model<IReferral, {}, {}, {}, mongoose.Document<unknown, {}, IReferral, {}, {}> & IReferral & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=referral.model.d.ts.map