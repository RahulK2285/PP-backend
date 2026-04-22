"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env — try server root first, then monorepo root (Render injects env vars directly)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
exports.CONFIG = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepforge',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_me',
    JWT_EXPIRY: '7d',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    LEETCODE_GQL: process.env.LEETCODE_GQL || 'https://leetcode.com/graphql',
    UPLOAD_DIR: path_1.default.resolve(__dirname, '../../uploads'),
};
//# sourceMappingURL=constants.js.map