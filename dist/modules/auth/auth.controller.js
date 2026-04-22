"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
exports.authController = {
    async register(req, res) {
        try {
            const { name, email, password, leetcodeUsername } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ error: 'Name, email, and password are required' });
                return;
            }
            const result = await auth_service_1.authService.register({ name, email, password, leetcodeUsername });
            res.status(201).json(result);
        }
        catch (error) {
            const status = error.message === 'Email already registered' ? 409 : 500;
            res.status(status).json({ error: error.message });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            const result = await auth_service_1.authService.login(email, password);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    },
    async getMe(req, res) {
        try {
            const profile = await auth_service_1.authService.getProfile(String(req.user._id));
            res.json(profile);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    async updateMe(req, res) {
        try {
            const updated = await auth_service_1.authService.updateProfile(String(req.user._id), req.body);
            res.json(updated);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map