"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralController = void 0;
const referral_model_1 = require("./referral.model");
exports.referralController = {
    async create(req, res) {
        try {
            const { company, role, message } = req.body;
            if (!company || !role || !message) {
                res.status(400).json({ error: 'Company, role, and message are required' });
                return;
            }
            const referral = await referral_model_1.Referral.create({
                userId: req.user._id,
                company,
                role,
                message,
            });
            res.status(201).json(referral);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getAll(req, res) {
        try {
            const referrals = await referral_model_1.Referral.find({ userId: req.user._id }).sort({ createdAt: -1 });
            res.json(referrals);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const validStatuses = ['Applied', 'Under Review', 'Referral Sent', 'Interview Set', 'Rejected'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ error: 'Invalid status' });
                return;
            }
            const referral = await referral_model_1.Referral.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { status }, { new: true });
            if (!referral) {
                res.status(404).json({ error: 'Referral not found' });
                return;
            }
            res.json(referral);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const referral = await referral_model_1.Referral.findOneAndDelete({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!referral) {
                res.status(404).json({ error: 'Referral not found' });
                return;
            }
            res.json({ message: 'Referral deleted' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=referral.controller.js.map