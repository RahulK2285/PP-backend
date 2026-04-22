"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dsaController = void 0;
const dsa_service_1 = require("./dsa.service");
exports.dsaController = {
    async getProblems(req, res) {
        try {
            const { topic, difficulty, status } = req.query;
            const problems = await dsa_service_1.dsaService.getProblems(String(req.user._id), {
                topic: topic,
                difficulty: difficulty,
                status: status,
            });
            res.json(problems);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async createProblem(req, res) {
        try {
            const problem = await dsa_service_1.dsaService.createProblem(String(req.user._id), req.body);
            res.status(201).json(problem);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateProblem(req, res) {
        try {
            const problem = await dsa_service_1.dsaService.updateProblem(String(req.user._id), req.params.id, req.body);
            res.json(problem);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    async deleteProblem(req, res) {
        try {
            await dsa_service_1.dsaService.deleteProblem(String(req.user._id), req.params.id);
            res.json({ message: 'Problem deleted' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    async syncLeetCode(req, res) {
        try {
            const username = req.user.leetcodeUsername;
            if (!username) {
                res.status(400).json({ error: 'LeetCode username not set. Update your profile first.' });
                return;
            }
            const result = await dsa_service_1.dsaService.syncLeetCode(String(req.user._id), username, parseInt(String(req.query.limit)) || 20);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getLeetCodeProfile(req, res) {
        try {
            const username = req.user.leetcodeUsername;
            if (!username) {
                res.status(400).json({ error: 'LeetCode username not set' });
                return;
            }
            const profile = await dsa_service_1.dsaService.getLeetCodeProfile(username);
            res.json(profile);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getAnalytics(req, res) {
        try {
            const analytics = await dsa_service_1.dsaService.getAnalytics(String(req.user._id));
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=dsa.controller.js.map