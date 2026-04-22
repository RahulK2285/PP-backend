"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../config/constants");
const user_model_1 = require("./user.model");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, constants_1.CONFIG.JWT_SECRET, {
        expiresIn: constants_1.CONFIG.JWT_EXPIRY,
    });
};
exports.authService = {
    async register(data) {
        const existingUser = await user_model_1.User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const user = await user_model_1.User.create(data);
        const token = generateToken(String(user._id));
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                leetcodeUsername: user.leetcodeUsername,
                role: user.role,
            },
        };
    },
    async login(email, password) {
        const user = await user_model_1.User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const token = generateToken(String(user._id));
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                leetcodeUsername: user.leetcodeUsername,
                role: user.role,
            },
        };
    },
    async getProfile(userId) {
        const user = await user_model_1.User.findById(userId);
        if (!user)
            throw new Error('User not found');
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            leetcodeUsername: user.leetcodeUsername,
            role: user.role,
            createdAt: user.createdAt,
        };
    },
    async updateProfile(userId, data) {
        const user = await user_model_1.User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
        if (!user)
            throw new Error('User not found');
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            leetcodeUsername: user.leetcodeUsername,
            role: user.role,
        };
    },
};
//# sourceMappingURL=auth.service.js.map